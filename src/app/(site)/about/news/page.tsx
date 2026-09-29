import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import { getPublications } from '@/lib/content';

export const metadata: Metadata = {
  title: 'News',
  description: 'Announcements, milestones and company news from CDSS (Nig.) Limited.',
  alternates: { canonical: '/about/news' },
};

export default async function NewsPage() {
  const all = await getPublications();
  const news = all.filter(p => p.category === 'news');
  const other = all.filter(p => p.category !== 'news').slice(0, 3);

  return (
    <>
      <PageHero trail={[['About', '/about'], ['News']]} eyebrow="News" title="What's new at CDSS." lede="Announcements, product updates and company milestones." />
      <section className="section">
        <div className="container">
          <PostGrid posts={news} />
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container">
          <SectionHead eyebrow="More from CDSS" title="Latest insights and guides." link={{ href: '/publications', label: 'All publications' }} />
          <PostGrid posts={other} />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
