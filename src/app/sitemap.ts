import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';
import { getIndustries, getProducts, getPublications } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, industries, publications] = await Promise.all([getProducts(), getIndustries(), getPublications()]);

  const pages = [
    '',
    '/products',
    '/industries',
    '/training',
    '/publications',
    '/about',
    '/about/profile',
    '/about/client-base',
    '/about/our-values',
    '/about/vendor-partners',
    '/about/bureau-services',
    '/bim-implementation',
    '/about/news',
    '/contact',
    ...products.map(p => `/products/${p.slug}`),
    ...industries.map(i => `/industries/${i.slug}`),
  ].map(path => ({ url: `${SITE_URL}${path}`, changeFrequency: 'monthly' as const, priority: path === '' ? 1 : 0.7 }));

  const articles = publications.map(p => ({
    url: `${SITE_URL}/publications/${p.slug}`,
    lastModified: p.updatedAt ?? p.publishedOn,
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));

  return [...pages, ...articles];
}
