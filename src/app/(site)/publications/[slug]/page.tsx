import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/content/site';
import { getPublication, getPublications, getSettings } from '@/lib/content';
import { CATEGORIES } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, JsonLd, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import { ArticleToc, CopyLinkButton } from '@/components/publications/ArticleAside';
import { Markdown, markdownToc } from '@/components/markdown/Markdown';
import { formatDate, truncate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPublications()).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublication((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/publications/${post.slug}` },
    openGraph: { type: 'article', title: post.title, description: post.excerpt, publishedTime: post.publishedOn, tags: post.tags },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, all, settings] = await Promise.all([getPublication(slug), getPublications(), getSettings()]);
  if (!post) notFound();

  const toc = markdownToc(post.body);
  const category = CATEGORIES[post.category];
  const related = all
    .filter(p => p.slug !== slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  const url = `${SITE_URL}/publications/${slug}`;
  const share = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    x: `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`,
    email: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(url)}`,
  };

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedOn,
          dateModified: post.updatedAt ?? post.publishedOn,
          mainEntityOfPage: url,
          image: `${url}/opengraph-image`,
          author: { '@type': 'Organization', name: 'CDSS Editorial Team' },
          publisher: { '@type': 'Organization', name: settings.company.name, logo: { '@type': 'ImageObject', url: `${SITE_URL}/brand/cdss-logo.png` } },
        }}
      />
      <PageHero
        className="article-hero"
        trail={[['Publications', '/publications'], [category.label, `/publications?category=${post.category}`], [truncate(post.title, 48)]]}
        title={post.title}
        lede={post.excerpt}
        extra={
          <div className="article-meta">
            <span>
              <span className="avatar">
                <Image src="/brand/cdss-logo.png" alt="" width={26} height={6} />
              </span>
              CDSS Editorial Team
            </span>
            <span>
              <Icon name="calendar" />
              <time dateTime={post.publishedOn}>{formatDate(post.publishedOn)}</time>
            </span>
            <span>
              <Icon name="clock" />
              {post.readTime} min read
            </span>
            <span className="cat-pill" style={{ background: 'rgba(255,255,255,.1)', color: '#fff' }}>
              {category.label}
            </span>
          </div>
        }
      />

      <div className="container">
        <figure className="article-cover">
          <Art name={post.cover} priority />
        </figure>
        <div className="article-layout">
          <ArticleToc items={toc} />
          <article className="prose">
            <Markdown>{post.body}</Markdown>
            {post.tags.length > 0 && (
              <div className="article-tags">
                {post.tags.map(t => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="author-box">
              <div className="avatar">
                <Image src="/brand/cdss-logo.png" alt="" width={44} height={10} />
              </div>
              <div>
                <h3>CDSS Editorial Team</h3>
                <p>Engineers and specialists at CDSS (Nig.) Limited, Nigeria&apos;s first CADD technology company since 1989.</p>
              </div>
            </div>
          </article>
          <aside className="share-rail" aria-label="Share">
            <span>Share</span>
            <a className="share-btn" href={share.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
              <Icon name="linkedin" />
            </a>
            <a className="share-btn" href={share.x} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
              <Icon name="xlogo" solid />
            </a>
            <a className="share-btn" href={share.email} aria-label="Share by email">
              <Icon name="mail" />
            </a>
            <CopyLinkButton />
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section bg-soft">
          <div className="container">
            <SectionHead eyebrow="Keep reading" title="Related publications." link={{ href: '/publications', label: 'All publications' }} />
            <PostGrid posts={related} />
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
