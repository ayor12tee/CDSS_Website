import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIndustries, getIndustry, getProducts, getPublications } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, Eyebrow, InfoCard, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import type { Product, Publication } from '@/lib/types';
import { truncate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getIndustries()).map(i => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const ind = await getIndustry((await params).slug);
  if (!ind) return {};
  return {
    title: `${ind.name} Solutions`,
    description: truncate(ind.lede, 155),
    alternates: { canonical: `/industries/${ind.slug}` },
  };
}

/** Short name used in headings ("AEC", "the public sector"). */
function shortName(name: string) {
  if (name.startsWith('Architecture')) return 'AEC';
  if (name.startsWith('Government')) return 'the public sector';
  return name;
}

export default async function IndustryPage({ params }: Props) {
  const ind = await getIndustry((await params).slug);
  if (!ind) notFound();

  const [products, publications] = await Promise.all([getProducts(), getPublications()]);
  const solutions = ind.solutions.map(s => products.find(p => p.slug === s)).filter((p): p is Product => p !== undefined);
  const articles = ind.articles.map(s => publications.find(a => a.slug === s)).filter((a): a is Publication => a !== undefined);

  return (
    <>
      <PageHero
        trail={[['Industries', '/industries'], [ind.name]]}
        eyebrow={ind.name}
        title={ind.title}
        lede={ind.lede}
        actions={
          <Link className="btn btn-light" href="/contact">
            Speak to a specialist
            <Icon name="arrow" />
          </Link>
        }
        visual={
          <div className="page-hero-visual">
            <Art name={ind.image} priority />
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="How we help" title={`Capabilities for ${ind.name.startsWith('Architecture') ? 'AEC' : ind.name} teams.`} />
          <div className="grid-3 reveal-stagger">
            {ind.capabilities.map(({ icon, title, text }) => (
              <InfoCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <SectionHead eyebrow="Solutions" title="The product lines behind the work." link={{ href: '/products', label: 'All solutions' }} />
          <div className={`grid-${Math.min(4, solutions.length)} reveal-stagger`}>
            {solutions.map(p => (
              <InfoCard key={p.slug} href={`/products/${p.slug}`} kicker={p.kind} title={p.name} text={p.tagline} cta="View" />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>Selected clients</Eyebrow>
            <h2 className="h2">Trusted in {shortName(ind.name)}.</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              A sample of organisations in this sector that have worked with CDSS.
            </p>
            <p className="fine-print">Names are listed as a factual record of relationships, not as endorsements.</p>
          </div>
          <div className="client-grid cols-2 reveal">
            {ind.clients.map(c => (
              <div className="client-chip" key={c}>
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      {ind.slug === 'oil-gas' && (
        <section className="section-sm bg-soft">
          <div className="container">
            <div className="award reveal">
              <div className="award-body">
                <Eyebrow>Recognition</Eyebrow>
                <blockquote>“CDSS has been a trusted Bentley partner for many years, serving primarily the oil and gas industry.”</blockquote>
                <cite>
                  <span>
                    <b>Allan Murphy</b>Senior Vice President, Bentley Systems
                  </span>
                </cite>
              </div>
              <div className="award-media">
                <Art name="award" />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Related reading" title="From our publications." link={{ href: '/publications', label: 'All publications' }} />
          <PostGrid posts={articles} />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
