// Domain types shared by the public site, the admin and the seed data.
import type { IconName } from '@/components/ui/Icon';

export type ProductGroup = 'Software' | 'Hardware';
export type Category = 'insights' | 'guides' | 'news';
export type PublicationStatus = 'draft' | 'published';
export type Role = 'admin' | 'editor';
export type FaqSection = 'home' | 'training';

export const CATEGORIES: Record<Category, { label: string; blurb: string }> = {
  insights: { label: 'Insights', blurb: 'Perspectives on engineering technology and practice.' },
  guides: { label: 'Guides', blurb: 'Practical, step-by-step advice for engineering offices.' },
  news: { label: 'News', blurb: 'Announcements and milestones from CDSS.' },
};

export interface SiteSettings {
  company: {
    name: string;
    legal: string;
    email: string;
    phones: string[];
    address: string;
    poBox: string;
    locationShort: string;
  };
  announcement: { enabled: boolean; label: string; text: string; href: string };
  hero: { titleLead: string; titleAccent: string; subtitle: string };
  otherLines: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  group: ProductGroup;
  kind: string;
  tagline: string;
  lede: string;
  /** "What it is used for" items, written as "Title (Products)" */
  uses: string[];
  keyProducts: string[];
  why: string;
  /** industry slugs */
  industries: string[];
  sortOrder: number;
  published: boolean;
}

export interface Capability {
  icon: IconName;
  title: string;
  text: string;
}

export interface Industry {
  id: string;
  slug: string;
  name: string;
  short: string;
  /** illustration name in /public/img */
  image: string;
  icon: IconName;
  title: string;
  lede: string;
  summary: string;
  capabilities: Capability[];
  /** product slugs */
  solutions: string[];
  clients: string[];
  /** publication slugs */
  articles: string[];
  sortOrder: number;
  published: boolean;
}

export interface Publication {
  id: string;
  slug: string;
  category: Category;
  status: PublicationStatus;
  featured: boolean;
  /** YYYY-MM-DD */
  publishedOn: string;
  /** illustration name (e.g. "award") or absolute image URL */
  cover: string;
  title: string;
  excerpt: string;
  tags: string[];
  /** related product slugs */
  products: string[];
  /** Markdown */
  body: string;
  readTime: number;
  updatedAt?: string;
}

export interface Partner {
  id: string;
  name: string;
  tag: string;
  description: string;
  productSlug: string | null;
  sortOrder: number;
}

export interface Client {
  id: string;
  name: string;
  group: string | null;
  onLogoWall: boolean;
  sortOrder: number;
}

export interface Faq {
  id: string;
  section: FaqSection;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface MediaItem {
  id: string;
  path: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  alt: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  kind: 'contact' | 'newsletter';
  email: string;
  name: string;
  fields: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  sessionVersion: number;
  lastLoginAt: string | null;
  createdAt: string;
  /** when the authenticator app was set up; null = sets it up at next sign-in */
  twoFactorEnabledAt: string | null;
  backupCodesLeft: number;
}
