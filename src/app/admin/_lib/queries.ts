// Admin-side reads. Unlike src/lib/content.ts these include drafts and unpublished items.
import 'server-only';
import { mediaPublicUrl, requireDb } from '@/lib/supabase';
import { USER_COLUMNS, toAdminUser, toClient, toFaq, toIndustry, toMedia, toPartner, toProduct, toPublication, toSubmission } from '@/lib/mappers';
import { seedSettings } from '@/content/seed';
import type { SiteSettings } from '@/lib/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
function rows<T>(res: { data: any[] | null; error: any }, map: (r: any) => T): T[] {
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []).map(map);
}
function row<T>(res: { data: any | null; error: any }, map: (r: any) => T): T | null {
  if (res.error) throw new Error(res.error.message);
  return res.data ? map(res.data) : null;
}

export async function listPublications(status?: 'draft' | 'published') {
  let q = requireDb().from('publications').select('*').order('published_on', { ascending: false }).order('updated_at', { ascending: false });
  if (status) q = q.eq('status', status);
  return rows(await q, toPublication);
}
export async function getPublicationById(id: string) {
  return row(await requireDb().from('publications').select('*').eq('id', id).maybeSingle(), toPublication);
}

export async function listProducts() {
  return rows(await requireDb().from('products').select('*').order('sort_order').order('name'), toProduct);
}
export async function getProductById(id: string) {
  return row(await requireDb().from('products').select('*').eq('id', id).maybeSingle(), toProduct);
}

export async function listIndustries() {
  return rows(await requireDb().from('industries').select('*').order('sort_order').order('name'), toIndustry);
}
export async function getIndustryById(id: string) {
  return row(await requireDb().from('industries').select('*').eq('id', id).maybeSingle(), toIndustry);
}

export async function listPartners() {
  return rows(await requireDb().from('partners').select('*').order('sort_order').order('name'), toPartner);
}
export async function getPartnerById(id: string) {
  return row(await requireDb().from('partners').select('*').eq('id', id).maybeSingle(), toPartner);
}

export async function listClients() {
  return rows(await requireDb().from('clients').select('*').order('sort_order').order('name'), toClient);
}
export async function getClientById(id: string) {
  return row(await requireDb().from('clients').select('*').eq('id', id).maybeSingle(), toClient);
}

export async function listFaqs() {
  return rows(await requireDb().from('faqs').select('*').order('section').order('sort_order'), toFaq);
}
export async function getFaqById(id: string) {
  return row(await requireDb().from('faqs').select('*').eq('id', id).maybeSingle(), toFaq);
}

export async function listMedia() {
  return rows(await requireDb().from('media').select('*').order('created_at', { ascending: false }), r => toMedia(r, mediaPublicUrl(r.path)));
}

export async function listSubmissions(filter?: 'unread' | 'contact' | 'newsletter') {
  let q = requireDb().from('submissions').select('*').order('created_at', { ascending: false }).limit(500);
  if (filter === 'unread') q = q.eq('is_read', false);
  if (filter === 'contact' || filter === 'newsletter') q = q.eq('kind', filter);
  return rows(await q, toSubmission);
}
export async function getSubmission(id: string) {
  return row(await requireDb().from('submissions').select('*').eq('id', id).maybeSingle(), toSubmission);
}

export async function listSubscribers() {
  const res = await requireDb().from('subscribers').select('*').order('created_at', { ascending: false });
  if (res.error) throw new Error(res.error.message);
  return (res.data ?? []) as { id: string; email: string; source: string; created_at: string }[];
}

export async function listUsers() {
  return rows(await requireDb().from('users').select(USER_COLUMNS).order('created_at'), toAdminUser);
}
export async function getUserById(id: string) {
  return row(await requireDb().from('users').select(USER_COLUMNS).eq('id', id).maybeSingle(), toAdminUser);
}

export async function getAdminSettings(): Promise<SiteSettings> {
  const res = await requireDb().from('settings').select('value').eq('key', 'site').maybeSingle();
  if (res.error) throw new Error(res.error.message);
  const v = (res.data?.value ?? {}) as Partial<SiteSettings>;
  return {
    company: { ...seedSettings.company, ...v.company },
    announcement: { ...seedSettings.announcement, ...v.announcement },
    hero: { ...seedSettings.hero, ...v.hero },
    otherLines: v.otherLines ?? seedSettings.otherLines,
  };
}

async function count(table: string, filter?: (q: any) => any) {
  let q = requireDb().from(table).select('*', { count: 'exact', head: true });
  if (filter) q = filter(q);
  const { count: n, error } = await q;
  if (error) throw new Error(error.message);
  return n ?? 0;
}

export async function getDashboardCounts() {
  const [published, drafts, unread, subscribers, products, industries] = await Promise.all([
    count('publications', q => q.eq('status', 'published')),
    count('publications', q => q.eq('status', 'draft')),
    count('submissions', q => q.eq('is_read', false)),
    count('subscribers'),
    count('products'),
    count('industries'),
  ]);
  return { published, drafts, unread, subscribers, products, industries };
}

export async function unreadCount() {
  try {
    return await count('submissions', q => q.eq('is_read', false));
  } catch {
    return 0;
  }
}
