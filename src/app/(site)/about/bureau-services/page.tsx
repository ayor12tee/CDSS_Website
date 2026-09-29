import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, CheckList, InfoCard, SectionHead, Steps } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Bureau Services — Scanning, Conversion & Archiving',
  description:
    'Protect your paper drawing archive. CDSS scans drawings and maps up to A0+, converts raster to vector CAD, and stores them securely — in-house or as a managed bureau service.',
  alternates: { canonical: '/about/bureau-services' },
};

export default function BureauServicesPage() {
  return (
    <>
      <PageHero
        trail={[['Solutions', '/products'], ['Bureau Services']]}
        eyebrow="Bureau services"
        title="Protect your paper archive before it's too late."
        lede="A historical archive of paper drawings, from A3 up to A0+, is your organisation’s legacy, and one fire, flood or leaking roof could destroy it. Scanning it to digital and storing it securely means it can be retrieved, printed, edited or referenced for decades to come."
        actions={
          <>
            <Link className="btn btn-light" href="/contact">
              Get an appraisal
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/publications/digitising-paper-drawing-archives">
              Read the guide
            </Link>
          </>
        }
        visual={
          <div className="page-hero-visual">
            <Art name="archive" alt="A scanned raster floor plan converted into clean vector CAD linework" priority />
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead center eyebrow="The process" title="From paper to protected digital asset." />
          <Steps
            steps={[
              ['Scan', 'Paper drawings and maps up to A0+ (44″ wide), any length, in monochrome or colour.'],
              ['Convert', 'Raster-to-vector conversion of scanned drawings and maps where you need editable CAD files.'],
              ['Store', 'Saved securely to CD, DVD, a network storage location (NAS) or your own external drive.'],
              ['Retrieve', 'Retrieve, print, edit or reference any drawing whenever you need it, long after the original paper is gone.'],
            ]}
          />
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container grid-2 reveal-stagger">
          <div className="info-card">
            <div className="icon-box">
              <Icon name="printer" />
            </div>
            <h3>Equipment we use</h3>
            <CheckList items={['Contex large-format scanners, up to 60″ wide', 'Avision A3/A4 document scanners', 'HP DesignJet large-format plotters and A3 printers']} />
          </div>
          <div className="info-card">
            <div className="icon-box">
              <Icon name="layers" />
            </div>
            <h3>Software behind the service</h3>
            <CheckList
              items={['Bentley and Autodesk raster/CAD tools', 'GTX RasterCAD and ImageCAD for raster-to-vector conversion', 'FileHold for document management and archiving']}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Two ways to work" title="In-house deployment or managed service." />
          <div className="grid-2 reveal-stagger">
            <InfoCard
              kicker="In-house"
              title="Your premises, our equipment and expertise"
              text="We supply, install and support the scanners and software on your premises, and train your staff to run them. This suits ongoing scanning, or drawings that must not leave site."
            />
            <InfoCard
              kicker="Managed bureau"
              title="We handle the scanning and archiving for you"
              text="CDSS scans, converts and archives your drawings, then returns them in the formats and storage you choose. This suits one-off backlogs, or teams without spare capacity."
            />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
