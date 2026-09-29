// Database row <-> domain object mapping (snake_case columns -> camelCase types).
import type { AdminUser, Client, Faq, Industry, MediaItem, Partner, Product, Publication, Submission } from './types';

/* eslint-disable @typescript-eslint/no-explicit-any */
type Row = Record<string, any>;

export function readTime(markdown: string) {
  const words = markdown.replace(/[#*_>`[\]()-]|:::\w*(\{[^}]*\})?/g, ' ').split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}

export const toProduct = (r: Row): Product => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  group: r.product_group,
  kind: r.kind,
  tagline: r.tagline,
  lede: r.lede,
  uses: r.uses ?? [],
  keyProducts: r.key_products ?? [],
  why: r.why,
  industries: r.industries ?? [],
  sortOrder: r.sort_order,
  published: r.published,
});

export const fromProduct = (p: Omit<Product, 'id'>) => ({
  slug: p.slug,
  name: p.name,
  product_group: p.group,
  kind: p.kind,
  tagline: p.tagline,
  lede: p.lede,
  uses: p.uses,
  key_products: p.keyProducts,
  why: p.why,
  industries: p.industries,
  sort_order: p.sortOrder,
  published: p.published,
});

export const toIndustry = (r: Row): Industry => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  short: r.short,
  image: r.image,
  icon: r.icon,
  title: r.title,
  lede: r.lede,
  summary: r.summary,
  capabilities: r.capabilities ?? [],
  solutions: r.solutions ?? [],
  clients: r.clients ?? [],
  articles: r.articles ?? [],
  sortOrder: r.sort_order,
  published: r.published,
});

export const fromIndustry = (i: Omit<Industry, 'id'>) => ({
  slug: i.slug,
  name: i.name,
  short: i.short,
  image: i.image,
  icon: i.icon,
  title: i.title,
  lede: i.lede,
  summary: i.summary,
  capabilities: i.capabilities,
  solutions: i.solutions,
  clients: i.clients,
  articles: i.articles,
  sort_order: i.sortOrder,
  published: i.published,
});

export const toPublication = (r: Row): Publication => ({
  id: r.id,
  slug: r.slug,
  category: r.category,
  status: r.status,
  featured: r.featured,
  publishedOn: r.published_on,
  cover: r.cover,
  title: r.title,
  excerpt: r.excerpt,
  tags: r.tags ?? [],
  products: r.products ?? [],
  body: r.body ?? '',
  readTime: readTime(r.body ?? ''),
  updatedAt: r.updated_at,
});

export const fromPublication = (p: Omit<Publication, 'id' | 'readTime' | 'updatedAt'>) => ({
  slug: p.slug,
  category: p.category,
  status: p.status,
  featured: p.featured,
  published_on: p.publishedOn,
  cover: p.cover,
  title: p.title,
  excerpt: p.excerpt,
  tags: p.tags,
  products: p.products,
  body: p.body,
});

export const toPartner = (r: Row): Partner => ({
  id: r.id,
  name: r.name,
  tag: r.tag,
  description: r.description,
  productSlug: r.product_slug,
  sortOrder: r.sort_order,
});

export const fromPartner = (p: Omit<Partner, 'id'>) => ({
  name: p.name,
  tag: p.tag,
  description: p.description,
  product_slug: p.productSlug,
  sort_order: p.sortOrder,
});

export const toClient = (r: Row): Client => ({ id: r.id, name: r.name, group: r.client_group, onLogoWall: r.on_logo_wall, sortOrder: r.sort_order });

export const fromClient = (c: Omit<Client, 'id'>) => ({ name: c.name, client_group: c.group, on_logo_wall: c.onLogoWall, sort_order: c.sortOrder });

export const toFaq = (r: Row): Faq => ({ id: r.id, section: r.section, question: r.question, answer: r.answer, sortOrder: r.sort_order });

export const fromFaq = (f: Omit<Faq, 'id'>) => ({ section: f.section, question: f.question, answer: f.answer, sort_order: f.sortOrder });

export const toMedia = (r: Row, url: string): MediaItem => ({
  id: r.id,
  path: r.path,
  url,
  filename: r.filename,
  mimeType: r.mime_type,
  sizeBytes: r.size_bytes,
  alt: r.alt,
  createdAt: r.created_at,
});

export const toSubmission = (r: Row): Submission => ({
  id: r.id,
  kind: r.kind,
  email: r.email,
  name: r.name,
  fields: r.fields ?? {},
  isRead: r.is_read,
  createdAt: r.created_at,
});

export const toAdminUser = (r: Row): AdminUser => ({
  id: r.id,
  email: r.email,
  name: r.name,
  role: r.role,
  sessionVersion: r.session_version,
  lastLoginAt: r.last_login_at,
  createdAt: r.created_at,
  twoFactorEnabledAt: r.totp_enabled_at ?? null,
  backupCodesLeft: Array.isArray(r.backup_codes) ? r.backup_codes.length : 0,
});

/** Columns safe to load for an admin user (never the password hash or 2FA secret). */
export const USER_COLUMNS = 'id, email, name, role, session_version, last_login_at, created_at, totp_enabled_at, backup_codes';
