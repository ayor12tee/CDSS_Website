import type { Metadata } from 'next';
import Link from 'next/link';
import type { IconName } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, Eyebrow, InfoCard, SectionHead, StatBand } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    "CDSS was incorporated in 1989 as Nigeria's first CADD technology company. 35+ years on, we deliver engineering software, hardware, training, support and bureau services from one accountable partner.",
  alternates: { canonical: '/about' },
};

const HUB: [IconName, string, string, string, string][] = [
  ['file', 'Company Profile', 'Profile', 'Our history, capabilities and the full range of what CDSS delivers.', '/about/profile'],
  ['users', 'Who we serve', 'Client Base', 'Organisations across oil & gas, government and engineering that rely on CDSS.', '/about/client-base'],
  ['target', 'How we work', 'Our Values', 'The principles behind 35+ years in business, and our footprint across Africa.', '/about/our-values'],
  ['handshake', 'Our partnerships', 'Vendor Partners', 'Every software and hardware line CDSS is authorised to sell, license, train and support.', '/about/vendor-partners'],
  ['scan', 'Scanning & archiving', 'Bureau Services', 'Digitising and protecting your paper drawing and map archive.', '/about/bureau-services'],
  ['calendar', 'Announcements', 'News', 'Company news and milestones from CDSS.', '/about/news'],
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        trail={[['About']]}
        eyebrow="About CDSS"
        title="35+ years, one engineering technology partner."
        lede="CDSS was incorporated in 1989 and became an authorised AutoCAD reseller for Nigeria that same year. Our portfolio now covers almost everything an engineering office needs: software, hardware, training, technical support and bureau services."
        visual={
          <div className="page-hero-visual">
            <Art name="history" alt="Timeline: 1989 incorporated, 1992 first AutoCAD in Nigeria, 2025 top Bentley partner in Africa" priority />
          </div>
        }
      />

      <section className="section">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="h2">Built by engineers, for engineers.</h2>
          </div>
          <div className="body-copy reveal">
            <p>
              CDSS was founded by Eng. Peter A. O. Fisher, a registered civil engineer who knew what Nigeria&apos;s design offices needed: reliable CAD technology,
              certified training, and support they could count on. It was the country&apos;s first CADD-specific technology company, and in 1992 it installed
              Nigeria&apos;s first AutoCAD workstation, for Chevron.
            </p>
            <p>
              More than three decades later, we remain the technology partner behind some of Nigeria&apos;s most demanding engineering, industrial and public-sector
              projects. Every product line we carry comes with vendor-certified training and tiered technical support. We deliver more than a licence key. In 2025,
              Bentley Systems named CDSS its top-performing partner in Sub-Saharan Africa.
            </p>
            <p>
              <Link href="/publications/thirty-five-years-of-cad-in-nigeria">Read the full story: 35 years of CAD in Nigeria</Link>
            </p>
          </div>
        </div>
      </section>

      <StatBand
        stats={[
          { value: '1989', label: 'Incorporated in Lagos' },
          { value: '1992', label: "Nigeria's first AutoCAD installation" },
          { value: '#1', label: 'Bentley partner in Sub-Saharan Africa, 2025' },
          { value: '7', label: 'African countries in our footprint' },
        ]}
      />

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Explore" title="Get to know CDSS." />
          <div className="grid-3 reveal-stagger">
            {HUB.map(([icon, kicker, title, text, href]) => (
              <InfoCard key={href} href={href} icon={icon} kicker={kicker} title={title} text={text} cta={`View ${title.toLowerCase()}`} />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
