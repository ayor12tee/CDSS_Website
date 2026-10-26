import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getSettings } from '@/lib/content';
import type { ProductGroup } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, Eyebrow, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Solutions & Product Lines',
  description:
    'Software and hardware from every vendor CDSS is authorised to sell, license, train and support — Autodesk, Bentley, Seequent, Ansys, Technical Toolboxes, Contex and Avision.',
  alternates: { canonical: '/products' },
};

const GROUPS: { group: ProductGroup; title: string }[] = [
  { group: 'Software', title: 'Design, analysis and simulation software.' },
  { group: 'Hardware', title: 'Scanning and capture hardware.' },
];

// Card button labels that don't follow the default "Explore {name} Solutions".
const CTA_LABELS: Record<string, string> = {
  bentley: 'Explore Bentley Solutions',
  'technical-toolboxes': 'Explore Technical Toolboxes',
};

export default async function ProductsPage() {
  const [products, { otherLines }] = await Promise.all([getProducts(), getSettings()]);
  return (
    <>
      <PageHero
        trail={[['Solutions']]}
        eyebrow="Our product lines"
        title="Every major engineering software and hardware line, from one partner."
        lede="Software and hardware from every vendor CDSS is authorised to sell, license, train and support. Choose a line for details, or talk to us about the right mix for your team."
        actions={
          <>
            <Link className="btn btn-light" href="/contact">
              Get a recommendation
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/about/vendor-partners">
              All vendor partners
            </Link>
          </>
        }
      />

      {GROUPS.map(({ group, title }, gi) => (
        <section className={`section${gi ? ' bg-soft' : ''}`} key={group}>
          <div className="container">
            <SectionHead eyebrow={group} title={title} />
            <div className="grid-3 reveal-stagger">
              {products
                .filter(p => p.group === group)
                .map(p => (
                  <Link className={`info-card${p.image ? ' has-cover' : ''}`} href={`/products/${p.slug}`} key={p.slug}>
                    {p.image && (
                      <div className="card-cover">
                        <Art name={p.image} />
                      </div>
                    )}
                    {p.logo ? (
                      <div className="card-logo">
                        <Image src={p.logo} alt={`${p.name} logo`} width={240} height={96} unoptimized />
                      </div>
                    ) : (
                      <div className="icon-box">
                        <Icon name={group === 'Software' ? 'layers' : 'printer'} />
                      </div>
                    )}
                    <div className="kicker">{p.kind}</div>
                    <h3>{p.name}</h3>
                    <p>{p.tagline}</p>
                    <div className="chip-list" style={{ marginTop: 18 }}>
                      {p.keyProducts.slice(0, 6).map(k => (
                        <span className="chip" key={k}>
                          {k}
                        </span>
                      ))}
                    </div>
                    <span className="link-arrow">
                      {CTA_LABELS[p.slug] ?? `Explore ${p.name} Solutions`}
                      <Icon name="arrow" />
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section-sm">
        <div className="container split">
          <div className="reveal">
            <Eyebrow>Also available</Eyebrow>
            <h2 className="h3">More lines we are authorised to supply</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              We also supply and support these specialist products. Ask our team for details and pricing.
            </p>
          </div>
          <div className="chip-list reveal">
            {otherLines.map(n => (
              <span className="chip" key={n}>
                {n}
              </span>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
