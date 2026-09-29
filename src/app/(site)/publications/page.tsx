import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { CATEGORIES as categories } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { Newsletter } from '@/components/forms/Newsletter';
import { PostGrid, PostMeta } from '@/components/publications/PostCard';
import { PublicationsBrowser } from '@/components/publications/PublicationsBrowser';
import { getPublications } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Publications — Insights, Guides & News',
  description: 'Insights, practical guides and company news from CDSS — engineering software, BIM, simulation, pipeline integrity, document digitisation and more.',
  alternates: { canonical: '/publications' },
};

export default async function PublicationsPage() {
  const posts = await getPublications();
  const featured = posts.find(p => p.featured) ?? posts[0];

  return (
    <>
      <PageHero
        trail={[['Publications']]}
        eyebrow="Publications"
        title="Insights, guides and news from CDSS."
        lede="Practical thinking from our engineers on the tools and workflows shaping engineering in Nigeria, plus the latest news from CDSS."
      />
      <section className="section">
        <div className="container">
          <Link className="pub-featured reveal" href={`/publications/${featured.slug}`}>
            <div className="post-cover">
              <Art name={featured.cover} priority />
              <span className="cat-pill">Featured · {categories[featured.category].label}</span>
            </div>
            <div className="post-body">
              <PostMeta post={featured} />
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <span className="link-arrow">
                Read article
                <Icon name="arrow" />
              </span>
            </div>
          </Link>

          {/* The browser reads ?category= on the client; the fallback server-renders every post for crawlers and no-JS visitors. */}
          <Suspense fallback={<div style={{ marginTop: 72 }}><PostGrid posts={posts} /></div>}>
            <PublicationsBrowser posts={posts} />
          </Suspense>
        </div>
      </section>
      <section className="section-sm bg-soft">
        <div className="container">
          <Newsletter />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
