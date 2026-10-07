import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublications } from '@/lib/content';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, Eyebrow, InfoCard, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';

export const metadata: Metadata = {
  title: 'BIM Implementation and Information Management',
  description:
    'CDSS helps teams adopt BIM and establish practical workflows for sharing models, managing documents and coordinating reviews, supported by common data environment setup and role-based training.',
  alternates: { canonical: '/bim-implementation' },
};

const AREAS: [IconName, string, string][] = [
  ['box', 'BIM adoption', 'Move from 2D drafting to model-based delivery in stages, starting with a pilot project and the standards your teams will work to.'],
  ['users', 'Model sharing and reviews', 'Establish practical workflows for sharing models between disciplines and coordinating reviews, including clash detection.'],
  ['file', 'Document and information management', 'Agree how project information is named, stored, checked and exchanged, supported by common data environment setup.'],
  ['graduation', 'Role-based training', 'Training built around the tasks each role performs, for architects, engineers, BIM coordinators and project managers.'],
];

export default async function BimImplementationPage() {
  const guide = (await getPublications()).filter(p => p.slug === 'cad-to-bim-transition-guide');

  return (
    <>
      <PageHero
        trail={[['Solutions', '/products'], ['BIM Implementation']]}
        eyebrow="BIM implementation and information management"
        title="Connect your people, processes and project information."
        lede="We help teams adopt BIM and establish practical workflows for sharing models, managing documents and coordinating reviews, supported by common data environment setup and role-based training."
        actions={
          <>
            <Link className="btn btn-light" href="/contact">
              Speak to a specialist
              <Icon name="arrow" />
            </Link>
            <Link className="btn btn-ghost" href="/publications/cad-to-bim-transition-guide">
              Read the CAD-to-BIM guide
            </Link>
          </>
        }
        visual={
          <div className="page-hero-visual">
            <Art name="bim" alt="A building shown as 2D CAD linework on one side and a BIM model on the other" priority />
          </div>
        }
      />

      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="What it covers"
            title="BIM that works in day-to-day project delivery."
            lead="Every engagement is scoped with your team before work starts, around your projects, disciplines and IT environment."
          />
          <div className="grid-4 reveal-stagger">
            {AREAS.map(([icon, title, text]) => (
              <InfoCard key={title} icon={icon} title={title} text={text} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>Tools</Eyebrow>
            <h2 className="h2">Built on software your teams already know.</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              CDSS is an authorised partner for the design and coordination tools most BIM workflows rely on, and supports them locally.
            </p>
            <div className="chip-list" style={{ marginTop: 24 }}>
              {['Revit', 'Navisworks', 'AutoCAD', 'Civil 3D', 'MicroStation', 'OpenPlant', 'OpenRoads'].map(t => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="grid-2 reveal-stagger">
            <InfoCard href="/products/autodesk" kicker="Design & Engineering" title="Autodesk" text="Revit, AutoCAD, Civil 3D and Navisworks for model-based design and coordination." cta="View Autodesk" />
            <InfoCard href="/products/bentley" kicker="Infrastructure Engineering" title="Bentley Systems" text="MicroStation, OpenPlant and OpenRoads for plant and infrastructure projects." cta="View Bentley" />
            <InfoCard href="/training#training" kicker="Training" title="CAD-to-BIM programme" text="Role-based training delivered in person in Lagos or online via Zoom and Microsoft Teams." cta="View training" />
            <InfoCard href="/training#support" kicker="Support" title="Ongoing support" text="Help with application and deployment issues once your teams are working in BIM." cta="View support options" />
          </div>
        </div>
      </section>

      {guide.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHead eyebrow="Related reading" title="Planning the move to BIM." link={{ href: '/publications', label: 'All publications' }} />
            <PostGrid posts={guide} />
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
