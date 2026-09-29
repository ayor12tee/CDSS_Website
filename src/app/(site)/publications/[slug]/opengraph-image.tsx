import { getPublication, getPublications } from '@/lib/content';
import { CATEGORIES } from '@/lib/types';
import { formatDate } from '@/lib/format';
import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'CDSS publication';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return (await getPublications()).map(p => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublication(slug);
  return ogCard({
    eyebrow: post ? `CDSS ${CATEGORIES[post.category].label}` : 'CDSS Publications',
    title: post?.title ?? 'Insights, guides and news from CDSS',
    footer: post ? `${formatDate(post.publishedOn)} · CDSS Editorial Team` : 'CDSS Editorial Team',
  });
}
