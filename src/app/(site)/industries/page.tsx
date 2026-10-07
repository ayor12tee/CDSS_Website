import type { Metadata } from 'next';
import Link from 'next/link';
import { getIndustries } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, InfoCard, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Industries We Serve',
  description:
    'CDSS supports oil & gas, architecture, engineering & construction, government, survey & GIS, and mining & geoscience organisations with engineering software, hardware, training and support.',
  alternates: { canonical: '/industries' },
};

export default async function IndustriesPage() {
  const industries = await getIndustries();
  return (
    <>
      <PageHero
        trail={[['Industries']]}
        eyebrow="Industries we serve"
        title="Technology shaped around your Industry."
        lede="Each industry has its own standards, deliverables and pressures. We combine the right tools from our vendor partners with training and support that reflect how your sector really works."
      />
      <section className="section">
        <div className="container">
          <div className="grid-2 reveal-stagger">
            {industries.map((ind, i) => (
              <Link className="industry-card" style={{ minHeight: 480 }} href={`/industries/${ind.slug}`} key={ind.slug}>
                <Art name={ind.image} />
                <span className="tag">
                  0{i + 1} · {ind.short.toUpperCase()}
                </span>
                <h3>{ind.name}</h3>
                <p style={{ maxHeight: 'none', opacity: 1 }}>{ind.summary}</p>
                <span className="link-arrow">
                  Explore {ind.name}
                  <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-soft">
        <div className="container">
          <SectionHead center eyebrow="Across every sector" title="What every client gets." />
          <div className="grid-4 reveal-stagger">
            <InfoCard icon="shield" title="Genuine licensing" text="Authorised, vendor-backed licences for every product we carry." />
            <InfoCard icon="graduation" title="Certified training" text="Vendor-certified instructors, in person or online." />
            <InfoCard icon="headset" title="Local support" text="Three support tiers with on-site and remote options." />
            <InfoCard icon="handshake" title="One partner" text="Many vendors, one accountable relationship." />
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
