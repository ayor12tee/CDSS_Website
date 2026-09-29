// Public-site content reads. Uses Supabase when configured, otherwise the built-in seed content.
// Only published items are ever returned here; the admin reads drafts through its own queries.
import 'server-only';
import { cache } from 'react';
import { getDb } from './supabase';
import { readTime, toClient, toFaq, toIndustry, toPartner, toProduct, toPublication } from './mappers';
import type { Client, Faq, FaqSection, Industry, Partner, Product, Publication, SiteSettings } from './types';
import { seedClients, seedFaqs, seedIndustries, seedPartners, seedProducts, seedPublications, seedSettings } from '@/content/seed';

const withSeedIds = <T,>(items: T[], prefix: string) => items.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));

function warnFallback(what: string, error: unknown) {
  console.error(`[content] Failed to load ${what} from Supabase; serving built-in content instead.`, error);
}

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const db = getDb();
  if (!db) return seedSettings;
  const { data, error } = await db.from('settings').select('value').eq('key', 'site').maybeSingle();
  if (error) warnFallback('settings', error);
  // merge over defaults so newly added settings fields always have a value
  const value = (data?.value ?? {}) as Partial<SiteSettings>;
  return {
    company: { ...seedSettings.company, ...value.company },
    announcement: { ...seedSettings.announcement, ...value.announcement },
    hero: { ...seedSettings.hero, ...value.hero },
    otherLines: value.otherLines ?? seedSettings.otherLines,
  };
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const db = getDb();
  if (!db) return withSeedIds(seedProducts, 'product');
  const { data, error } = await db.from('products').select('*').eq('published', true).order('sort_order').order('name');
  if (error) {
    warnFallback('products', error);
    return withSeedIds(seedProducts, 'product');
  }
  return data.map(toProduct);
});

export async function getProduct(slug: string) {
  return (await getProducts()).find(p => p.slug === slug);
}

export const getIndustries = cache(async (): Promise<Industry[]> => {
  const db = getDb();
  if (!db) return withSeedIds(seedIndustries, 'industry');
  const { data, error } = await db.from('industries').select('*').eq('published', true).order('sort_order').order('name');
  if (error) {
    warnFallback('industries', error);
    return withSeedIds(seedIndustries, 'industry');
  }
  return data.map(toIndustry);
});

export async function getIndustry(slug: string) {
  return (await getIndustries()).find(i => i.slug === slug);
}

const seedPubs = (): Publication[] => withSeedIds(seedPublications, 'publication').map(p => ({ ...p, readTime: readTime(p.body) }));

/** Published publications, newest first. */
export const getPublications = cache(async (): Promise<Publication[]> => {
  const db = getDb();
  let list: Publication[];
  if (!db) list = seedPubs();
  else {
    const { data, error } = await db.from('publications').select('*').eq('status', 'published').order('published_on', { ascending: false });
    if (error) {
      warnFallback('publications', error);
      list = seedPubs();
    } else list = data.map(toPublication);
  }
  return list.filter(p => p.status === 'published').sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
});

export async function getPublication(slug: string) {
  return (await getPublications()).find(p => p.slug === slug);
}

export const getPartners = cache(async (): Promise<Partner[]> => {
  const db = getDb();
  if (!db) return withSeedIds(seedPartners, 'partner');
  const { data, error } = await db.from('partners').select('*').order('sort_order').order('name');
  if (error) {
    warnFallback('partners', error);
    return withSeedIds(seedPartners, 'partner');
  }
  return data.map(toPartner);
});

export const getClients = cache(async (): Promise<Client[]> => {
  const db = getDb();
  if (!db) return withSeedIds(seedClients, 'client');
  const { data, error } = await db.from('clients').select('*').order('sort_order').order('name');
  if (error) {
    warnFallback('clients', error);
    return withSeedIds(seedClients, 'client');
  }
  return data.map(toClient);
});

/** Client Base page groups, in first-seen order. */
export async function getClientGroups(): Promise<[string, string[]][]> {
  const groups = new Map<string, string[]>();
  for (const c of await getClients()) {
    if (!c.group) continue;
    groups.set(c.group, [...(groups.get(c.group) ?? []), c.name]);
  }
  return [...groups.entries()];
}

export async function getLogoWall() {
  return (await getClients()).filter(c => c.onLogoWall).map(c => c.name);
}

export const getFaqs = cache(async (section: FaqSection): Promise<[string, string][]> => {
  const db = getDb();
  let list: Faq[];
  if (!db) list = withSeedIds(seedFaqs, 'faq');
  else {
    const { data, error } = await db.from('faqs').select('*').order('sort_order');
    if (error) {
      warnFallback('faqs', error);
      list = withSeedIds(seedFaqs, 'faq');
    } else list = data.map(toFaq);
  }
  return list.filter(f => f.section === section).map(f => [f.question, f.answer]);
});
