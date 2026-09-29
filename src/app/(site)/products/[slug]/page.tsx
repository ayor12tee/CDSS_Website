import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIndustries, getProduct, getProducts, getPublications } from '@/lib/content';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { CheckList, Eyebrow, InfoCard, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import { truncate } from '@/lib/format';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: `${p.name} — ${p.kind}`,
    description: truncate(p.lede, 155),
    alternates: { canonical: `/products/${p.slug}` },
  };
}

const VALUE_PROPS = [
  'Genuine, vendor-backed licensing and renewals',
  'Installation, configuration and commissioning',
  'Certified training in person or via Zoom and MS Teams',
  'Tiered local support, plus remote diagnosis via AnyDesk',
];
const USE_ICONS: IconName[] = ['layers', 'building', 'activity', 'box', 'scan', 'map'];

function splitUse(text: string) {
  const m = text.match(/^(.*?)\s*\((.*)\)$/);
  return m ? { title: m[1], kicker: m[2] } : { title: text, kicker: '' };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();

  const [products, publications, industries] = await Promise.all([getProducts(), getPublications(), getIndustries()]);
  const related = products.filter(o => o.slug !== p.slug && (o.group === p.group || o.industries.some(i => p.industries.includes(i)))).slice(0, 3);
  const pubs = publications
    .filter(a => a.products.includes(p.slug))
    .slice(0, 3);

  return (
    <>
      <PageHero
        trail={[['Solutions', '/products'], [p.name]]}
        eyebrow={`${p.group} partner · ${p.kind}`}
        title={p.name}
        lede={p.lede}
        actions={
          <>
            <Link className="btn btn-light" href="/contact">
              Talk to us about {p.name}
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/products">
              All solutions
            </Link>
          </>
        }
        visual={
          <div className="vendor-mark">
            <span className="sub">Authorised {p.group.toLowerCase()} partner</span>
            <span className="wm">{p.name}</span>
            <span className="tagline">{p.tagline}</span>
            <div className="chip-list" style={{ marginTop: 10 }}>
              {p.keyProducts.slice(0, 6).map(k => (
                <span className="chip" key={k}>
                  {k}
                </span>
              ))}
            </div>
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Capabilities" title={`What ${p.name} is used for.`} />
          <div className="grid-3 reveal-stagger">
            {p.uses.map(splitUse).map((u, i) => (
              <InfoCard key={u.title} icon={USE_ICONS[i % USE_ICONS.length]} kicker={u.kicker || undefined} title={u.title} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>Why CDSS</Eyebrow>
            <h2 className="h2">Why buy {p.name} through CDSS.</h2>
            <div className="body-copy" style={{ marginTop: 22 }}>
              <p>{p.why}</p>
            </div>
          </div>
          <div className="reveal">
            <div className="info-card">
              <h3>Included with every {p.name} engagement</h3>
              <CheckList items={VALUE_PROPS} />
              <h3 style={{ marginTop: 32 }}>Industries</h3>
              <div className="chip-list" style={{ marginTop: 12 }}>
                {p.industries.map(s => industries.find(i => i.slug === s)).map(
                  ind =>
                    ind && (
                      <Link className="chip" href={`/industries/${ind.slug}`} key={ind.slug}>
                        {ind.name}
                      </Link>
                    ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {pubs.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Related reading" title="From our publications." link={{ href: '/publications', label: 'All publications' }} />
            <PostGrid posts={pubs} />
          </div>
        </section>
      )}

      <section className={`section${pubs.length ? ' bg-soft' : ''}`}>
        <div className="container">
          <SectionHead eyebrow="Related solutions" title={`Often paired with ${p.name}.`} />
          <div className="grid-3 reveal-stagger">
            {related.map(o => (
              <InfoCard key={o.slug} href={`/products/${o.slug}`} kicker={o.kind} title={o.name} text={o.tagline} cta={`View ${o.name}`} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
