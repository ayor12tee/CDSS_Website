'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { requireDb } from '@/lib/supabase';
import { fromClient, fromFaq, fromIndustry, fromPartner, fromProduct, fromPublication, fromWebinar } from '@/lib/mappers';
import { PLATFORMS, isPlatformUrl, lagosToIso, parseDate, youtubeId } from '@/lib/webinars';
import { ICON_NAMES } from '@/components/ui/Icon';
import { bool, csv, fail, fromDb, fromZod, int, lines, many, ok, optional, revalidateSite, str, toSlug } from './form';
import type { ActionState } from './state';

const slug = z
  .string()
  .min(1, 'Required')
  .max(80)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and single dashes');
const text = (max: number, required = false) => (required ? z.string().trim().min(1, 'Required').max(max) : z.string().trim().max(max));
const list = z.array(z.string().trim().min(1).max(300)).max(60);
const icon = z.enum(ICON_NAMES as [string, ...string[]]);
/** Optional image: an https URL, a site path (/img/…) or a built-in illustration name; empty means none. */
const imageRef = z
  .string()
  .trim()
  .max(500)
  .regex(/^(https:\/\/\S+|\/[\w./-]+|[a-z0-9-]+)?$/, 'Choose an image, or paste a link starting with https://')
  .transform(v => v || null);

/** Insert or update a row, then send the editor to the right place. */
async function upsert(table: string, what: string, id: string, values: Record<string, unknown>, listPath: string): Promise<ActionState> {
  const db = requireDb();
  if (id) {
    const { error } = await db.from(table).update(values).eq('id', id);
    if (error) return fromDb(error, what);
    revalidateSite();
    return ok(`${what[0].toUpperCase()}${what.slice(1)} saved.`);
  }
  const { data, error } = await db.from(table).insert(values).select('id').single();
  if (error) return fromDb(error, what);
  revalidateSite();
  redirect(`${listPath}/${data.id}?created=1`);
}

async function remove(table: string, id: string, listPath: string) {
  await requireUser();
  const { error } = await requireDb().from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect(`${listPath}?deleted=1`);
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------
const publicationSchema = z.object({
  title: text(200, true),
  slug,
  category: z.enum(['insights', 'guides', 'news']),
  status: z.enum(['draft', 'published']),
  featured: z.boolean(),
  publishedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
  cover: text(500, true),
  excerpt: text(400, true),
  tags: list,
  products: list,
  body: z.string().max(100_000),
});

export async function savePublication(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const id = str(fd, 'id');
  const parsed = publicationSchema.safeParse({
    title: str(fd, 'title'),
    slug: str(fd, 'slug') || toSlug(str(fd, 'title')),
    category: str(fd, 'category'),
    status: str(fd, 'status'),
    featured: bool(fd, 'featured'),
    publishedOn: str(fd, 'publishedOn'),
    cover: str(fd, 'cover'),
    excerpt: str(fd, 'excerpt'),
    tags: csv(fd, 'tags'),
    products: many(fd, 'products'),
    body: String(fd.get('body') ?? ''),
  });
  if (!parsed.success) return fromZod(parsed.error);
  if (parsed.data.status === 'published' && parsed.data.body.trim().length < 50) {
    return fail('Add the article text before publishing, or save it as a draft.', { body: 'Too short to publish' });
  }

  // only one featured publication at a time
  if (parsed.data.featured) {
    let q = requireDb().from('publications').update({ featured: false }).eq('featured', true);
    if (id) q = q.neq('id', id);
    await q;
  }
  const values = { ...fromPublication(parsed.data), ...(id ? {} : { author_id: user.id }) };
  return upsert('publications', 'publication', id, values, '/admin/publications');
}

export async function deletePublication(id: string) {
  await remove('publications', id, '/admin/publications');
}

// ---------------------------------------------------------------------------
// Webinars
// ---------------------------------------------------------------------------
const webinarSchema = z.object({
  title: text(200, true),
  slug,
  summary: text(400),
  description: z.string().max(50_000),
  platform: z.enum(['teams', 'meet']),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Choose a start time'),
  durationMinutes: z.number().int().min(5, 'At least 5 minutes').max(600, 'At most 10 hours'),
  speakers: z.array(z.string().trim().min(1).max(160)).max(12),
  products: list,
  registrationUrl: z.string().trim().max(2000).nullable(),
  recordingUrl: z.string().trim().max(500).nullable(),
  published: z.boolean(),
});

export async function saveWebinar(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = webinarSchema.safeParse({
    title: str(fd, 'title'),
    slug: str(fd, 'slug') || toSlug(str(fd, 'title')),
    summary: str(fd, 'summary'),
    description: String(fd.get('description') ?? ''),
    platform: str(fd, 'platform') || 'teams',
    date: str(fd, 'date'),
    time: str(fd, 'time'),
    durationMinutes: int(fd, 'durationMinutes', 60),
    speakers: lines(fd, 'speakers'),
    products: many(fd, 'products'),
    registrationUrl: optional(fd, 'registrationUrl'),
    recordingUrl: optional(fd, 'recordingUrl'),
    published: bool(fd, 'published'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  const { date, time, ...w } = parsed.data;
  if (w.registrationUrl && !isPlatformUrl(w.platform, w.registrationUrl)) {
    const p = PLATFORMS[w.platform];
    return fail(`That link isn't from ${p.name}. Check the link, or change the platform.`, { registrationUrl: `Paste ${p.linkHint}` });
  }
  if (w.recordingUrl && !youtubeId(w.recordingUrl)) {
    return fail('The recording link must be a YouTube video.', { recordingUrl: 'Paste the YouTube link, e.g. https://youtu.be/…' });
  }
  return upsert('webinars', 'webinar', str(fd, 'id'), fromWebinar({ ...w, startsAt: lagosToIso(date, time) }), '/admin/webinars');
}

export async function deleteWebinar(id: string) {
  await remove('webinars', id, '/admin/webinars');
}

/** Title of a public or unlisted YouTube video, via YouTube's oEmbed endpoint; null if it's private, deleted or unreachable. */
async function youtubeTitle(videoId: string) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const { title } = (await res.json()) as { title?: string };
    return title?.trim().slice(0, 200) || null;
  } catch {
    return null;
  }
}

const DATE_IN_TEXT = /\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}\/\d{4}/;
const EDGE_SEPARATORS = /^[\s|,;–—-]+|[\s|,;–—-]+$/g;

/**
 * Bulk-add past webinars from pasted lines, each holding a date and a YouTube link, with an optional title
 * (otherwise the video's YouTube title is used). Videos already on the site are skipped, so a corrected
 * list can be pasted again safely.
 */
export async function importWebinars(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const platform = str(fd, 'platform') === 'meet' ? 'meet' : 'teams';
  const published = bool(fd, 'published');
  const entries = String(fd.get('lines') ?? '')
    .split(/\r?\n/)
    .map((text, i) => ({ text: text.trim(), line: i + 1 }))
    .filter(e => e.text);
  if (!entries.length) return fail('Paste at least one webinar.', { lines: 'One webinar per line' });
  if (entries.length > 50) return fail('Import up to 50 webinars at a time.', { lines: `${entries.length} lines` });

  const db = requireDb();
  const { data: existing, error } = await db.from('webinars').select('slug, recording_url');
  if (error) return fromDb(error, 'webinars');
  const slugs = new Set(existing.map(r => r.slug as string));
  const videos = new Set(existing.map(r => youtubeId(r.recording_url)).filter(Boolean));

  const parsed = await Promise.all(
    entries.map(async ({ text, line }) => {
      const url = text.match(/https?:\/\/\S+/)?.[0];
      const videoId = youtubeId(url);
      if (!url || !videoId) return { line, problem: 'no YouTube link' };
      const rest = text.replace(url, ' ');
      const dateText = rest.match(DATE_IN_TEXT)?.[0];
      const date = dateText ? parseDate(dateText) : null;
      if (!date) return { line, problem: 'no valid date (use 17/09/2026 or 2026-09-17)' };
      const youtube = await youtubeTitle(videoId);
      if (!youtube) return { line, problem: "video not found, or it's private" };
      const title = rest.replace(dateText!, ' ').replace(EDGE_SEPARATORS, '').replace(/\s{2,}/g, ' ').slice(0, 200) || youtube;
      return { line, videoId, date, title };
    }),
  );

  const problems: string[] = [];
  let skipped = 0;
  const rows = [];
  for (const p of parsed) {
    if ('problem' in p) {
      problems.push(`line ${p.line}: ${p.problem}`);
      continue;
    }
    if (videos.has(p.videoId)) {
      skipped++;
      continue;
    }
    videos.add(p.videoId);
    const base = toSlug(p.title) || 'webinar';
    let slugFor = base;
    for (let n = 2; slugs.has(slugFor); n++) slugFor = `${base}-${n}`;
    slugs.add(slugFor);
    rows.push(
      fromWebinar({
        slug: slugFor,
        title: p.title,
        summary: '',
        description: '',
        // a recording's time of day isn't shown on the site, so noon keeps the date safe in every timezone
        startsAt: lagosToIso(p.date, '12:00'),
        durationMinutes: 60,
        speakers: [],
        products: [],
        platform,
        registrationUrl: null,
        recordingUrl: `https://www.youtube.com/watch?v=${p.videoId}`,
        published,
      }),
    );
  }

  if (rows.length) {
    const ins = await db.from('webinars').insert(rows);
    if (ins.error) return fromDb(ins.error, 'webinars');
    revalidateSite();
  }

  const done = [`Imported ${rows.length} webinar${rows.length === 1 ? '' : 's'}.`, skipped ? `${skipped} already on the site, skipped.` : ''].filter(Boolean).join(' ');
  if (problems.length) return fail(`${done} Not imported: ${problems.join('; ')}. Fix those lines and import again.`, { lines: `${problems.length} line(s) need fixing` });
  return ok(`${done} Open each one to add a summary, speakers or products.`);
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const productSchema = z.object({
  name: text(120, true),
  slug,
  group: z.enum(['Software', 'Hardware']),
  kind: text(120, true),
  tagline: text(200, true),
  lede: text(1500, true),
  uses: list,
  keyProducts: list,
  why: text(2000),
  industries: list,
  sortOrder: z.number().int(),
  published: z.boolean(),
  logo: imageRef,
  image: imageRef,
});

export async function saveProduct(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = productSchema.safeParse({
    name: str(fd, 'name'),
    slug: str(fd, 'slug') || toSlug(str(fd, 'name')),
    group: str(fd, 'group'),
    kind: str(fd, 'kind'),
    tagline: str(fd, 'tagline'),
    lede: str(fd, 'lede'),
    uses: lines(fd, 'uses'),
    keyProducts: lines(fd, 'keyProducts'),
    why: str(fd, 'why'),
    industries: many(fd, 'industries'),
    sortOrder: int(fd, 'sortOrder'),
    published: bool(fd, 'published'),
    logo: str(fd, 'logo'),
    image: str(fd, 'image'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  return upsert('products', 'product', str(fd, 'id'), fromProduct(parsed.data), '/admin/products');
}

export async function deleteProduct(id: string) {
  await remove('products', id, '/admin/products');
}

// ---------------------------------------------------------------------------
// Industries
// ---------------------------------------------------------------------------
const industrySchema = z.object({
  name: text(120, true),
  slug,
  short: text(80),
  image: text(500, true),
  icon,
  title: text(200, true),
  lede: text(1500, true),
  summary: text(300, true),
  capabilities: z.array(z.object({ icon, title: text(120, true), text: text(400, true) })).max(12),
  solutions: list,
  clients: list,
  articles: list,
  sortOrder: z.number().int(),
  published: z.boolean(),
});

export async function saveIndustry(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  let capabilities: unknown = [];
  try {
    capabilities = JSON.parse(String(fd.get('capabilities') || '[]'));
  } catch {
    return fail('The capabilities list could not be read. Reload the page and try again.');
  }
  const parsed = industrySchema.safeParse({
    name: str(fd, 'name'),
    slug: str(fd, 'slug') || toSlug(str(fd, 'name')),
    short: str(fd, 'short'),
    image: str(fd, 'image'),
    icon: str(fd, 'icon'),
    title: str(fd, 'title'),
    lede: str(fd, 'lede'),
    summary: str(fd, 'summary'),
    capabilities,
    solutions: many(fd, 'solutions'),
    clients: lines(fd, 'clients'),
    articles: many(fd, 'articles'),
    sortOrder: int(fd, 'sortOrder'),
    published: bool(fd, 'published'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  return upsert('industries', 'industry', str(fd, 'id'), fromIndustry(parsed.data as Parameters<typeof fromIndustry>[0]), '/admin/industries');
}

export async function deleteIndustry(id: string) {
  await remove('industries', id, '/admin/industries');
}

// ---------------------------------------------------------------------------
// Partners, clients, FAQs
// ---------------------------------------------------------------------------
const partnerSchema = z.object({
  name: text(120, true),
  tag: text(60, true),
  description: text(500, true),
  productSlug: z.string().nullable(),
  sortOrder: z.number().int(),
});

export async function savePartner(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = partnerSchema.safeParse({
    name: str(fd, 'name'),
    tag: str(fd, 'tag'),
    description: str(fd, 'description'),
    productSlug: optional(fd, 'productSlug'),
    sortOrder: int(fd, 'sortOrder'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  return upsert('partners', 'partner', str(fd, 'id'), fromPartner(parsed.data), '/admin/partners');
}

export async function deletePartner(id: string) {
  await remove('partners', id, '/admin/partners');
}

const clientSchema = z.object({
  name: text(160, true),
  group: z.string().trim().max(80).nullable(),
  onLogoWall: z.boolean(),
  sortOrder: z.number().int(),
  logo: imageRef,
});

export async function saveClient(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = clientSchema.safeParse({
    name: str(fd, 'name'),
    group: str(fd, 'group') === '__new' ? optional(fd, 'newGroup') : optional(fd, 'group'),
    onLogoWall: bool(fd, 'onLogoWall'),
    sortOrder: int(fd, 'sortOrder'),
    logo: str(fd, 'logo'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  if (!parsed.data.group && !parsed.data.onLogoWall) return fail('Choose a Client Base group, show the client on the home page logo wall, or both.');
  return upsert('clients', 'client', str(fd, 'id'), fromClient(parsed.data), '/admin/clients');
}

export async function deleteClient(id: string) {
  await remove('clients', id, '/admin/clients');
}

const faqSchema = z.object({
  section: z.enum(['home', 'training']),
  question: text(300, true),
  answer: text(2000, true),
  sortOrder: z.number().int(),
});

export async function saveFaq(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = faqSchema.safeParse({ section: str(fd, 'section'), question: str(fd, 'question'), answer: str(fd, 'answer'), sortOrder: int(fd, 'sortOrder') });
  if (!parsed.success) return fromZod(parsed.error);
  return upsert('faqs', 'FAQ', str(fd, 'id'), fromFaq(parsed.data), '/admin/faqs');
}

export async function deleteFaq(id: string) {
  await remove('faqs', id, '/admin/faqs');
}

// ---------------------------------------------------------------------------
// Settings (admins only)
// ---------------------------------------------------------------------------
const settingsSchema = z.object({
  company: z.object({
    name: text(120, true),
    legal: text(200, true),
    email: z.email('Enter a valid email'),
    phones: z.array(z.string().trim().min(5).max(40)).min(1, 'Add at least one phone number').max(6),
    address: text(300, true),
    poBox: text(200),
    locationShort: text(60, true),
  }),
  announcement: z.object({ enabled: z.boolean(), label: text(20), text: text(160), href: text(300) }),
  hero: z.object({ titleLead: text(120, true), titleAccent: text(60, true), subtitle: text(600, true) }),
  otherLines: list,
});

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser('admin');
  const parsed = settingsSchema.safeParse({
    company: {
      name: str(fd, 'companyName'),
      legal: str(fd, 'companyLegal'),
      email: str(fd, 'companyEmail'),
      phones: lines(fd, 'companyPhones'),
      address: str(fd, 'companyAddress'),
      poBox: str(fd, 'companyPoBox'),
      locationShort: str(fd, 'companyLocation'),
    },
    announcement: { enabled: bool(fd, 'announcementEnabled'), label: str(fd, 'announcementLabel'), text: str(fd, 'announcementText'), href: str(fd, 'announcementHref') },
    hero: { titleLead: str(fd, 'heroTitleLead'), titleAccent: str(fd, 'heroTitleAccent'), subtitle: str(fd, 'heroSubtitle') },
    otherLines: lines(fd, 'otherLines'),
  });
  if (!parsed.success) {
    // flatten nested paths ("company.email") onto the form field names
    const names: Record<string, string> = { 'company.name': 'companyName', 'company.legal': 'companyLegal', 'company.email': 'companyEmail', 'company.phones': 'companyPhones', 'company.address': 'companyAddress', 'company.locationShort': 'companyLocation', 'hero.titleLead': 'heroTitleLead', 'hero.titleAccent': 'heroTitleAccent', 'hero.subtitle': 'heroSubtitle' };
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[names[issue.path.slice(0, 2).join('.')] ?? String(issue.path[0])] ??= issue.message;
    return fail('Please fix the highlighted fields.', fieldErrors);
  }
  if (parsed.data.announcement.enabled && !parsed.data.announcement.text) return fail('Add announcement text, or switch the announcement off.', { announcementText: 'Required when enabled' });

  const { error } = await requireDb().from('settings').upsert({ key: 'site', value: parsed.data, updated_at: new Date().toISOString() });
  if (error) return fromDb(error, 'settings');
  revalidateSite();
  return ok('Settings saved. The website has been updated.');
}
