import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { CheckList, Eyebrow } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Company Profile',
  description: 'CDSS delivers CAD and BIM solutions to the AEC and Oil & Gas sectors, with software sales, implementation, support, scanning, plotting, archiving and training.',
  alternates: { canonical: '/about/profile' },
};

export default function ProfilePage() {
  return (
    <>
      <PageHero
        trail={[['About', '/about'], ['Profile']]}
        eyebrow="Company profile"
        title="Nigeria's first CADD technology company."
        lede="CDSS was incorporated in June 1989 and became an authorised AutoCAD reseller for Nigeria that December. We deliver CAD and BIM solutions, mainly to the Architecture, Engineering & Construction (AEC) and Oil & Gas sectors. The portfolio now covers almost every engineering-office need: software sales, implementation and after-sales support, scanning, printing, plotting, archiving and training."
      />

      <section className="section">
        <div className="container grid-2 reveal-stagger">
          <div className="info-card">
            <div className="icon-box">
              <Icon name="layers" />
            </div>
            <h3>What we offer</h3>
            <CheckList
              items={[
                'Discipline-specific software for the upstream petroleum and AEC industries',
                'Large-format scanners in colour and monochrome, 24″, 36″, 42″, 44″ and 60″ wide, at unlimited length (Contex)',
                'A3/A4 document scanners (Avision)',
                'Large-format plotters (HP DesignJet series) and A3 printers',
              ]}
            />
          </div>
          <div className="info-card">
            <div className="icon-box">
              <Icon name="headset" />
            </div>
            <h3>Our services</h3>
            <CheckList
              items={[
                'Training in person or remotely from our dedicated in-house facility, with certified instructors (in person, Zoom or MS Teams)',
                'Bureau services: large-format plotting, scanning, archiving and raster-to-vector conversion',
                'Engineering services: design and drafting support for building-industry and mapping/GIS clients, charged by the hour',
                'Technical support, both remote and on-site',
                'Annual support contracts covering installation, commissioning and application support',
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container split">
          <div className="reveal">
            <Eyebrow>Our position</Eyebrow>
            <h2 className="h2">Backed by 35+ years as an authorised vendor partner.</h2>
          </div>
          <div className="body-copy reveal">
            <p>
              CDSS is an authorised vendor partner in Nigeria for many internationally recognised software and hardware brands. Few others in the market can match
              our record: decades of continuity, and qualified, experienced technical and support staff in a market that keeps changing.
            </p>
            <p>
              See our <Link href="/about/vendor-partners">full list of vendor partners</Link>, or the organisations that rely on us in our{' '}
              <Link href="/about/client-base">client base</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
