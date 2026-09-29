import type { Metadata } from 'next';
import Link from 'next/link';
import { tel } from '@/content/site';
import { getFaqs, getSettings } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Art, CheckList, Eyebrow, Faq, InfoCard, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Training & Support',
  description:
    'Certified training across every CDSS product line — in person at our Lagos facility or online via Zoom and MS Teams — plus three tiers of technical support and remote diagnosis via AnyDesk.',
  alternates: { canonical: '/training' },
};

const COURSES: [string, string, string][] = [
  ['Autodesk', 'AutoCAD, Revit, Civil 3D, Inventor, Navisworks', '/products/autodesk'],
  ['Bentley Systems', 'MicroStation, STAAD.Pro, AutoPIPE, OpenPlant, OpenRoads', '/products/bentley'],
  ['Seequent', 'Leapfrog Geo, MX Deposit, Oasis montaj', '/products/seequent'],
  ['ANSYS', 'Structural, thermal and fluid simulation', '/products/ansys'],
  ['Technical Toolboxes', 'Pipeline integrity and design engineering', '/products/technical-toolboxes'],
  ['CAD-to-BIM Programme', 'Role-based transition from 2D CAD to BIM', '/publications/cad-to-bim-transition-guide'],
];

const TIERS = [
  { tier: 'Tier 1', name: 'Basic — Nigeria', text: 'Remote cover for teams anywhere in the country.', list: ['Unlimited telephone support', 'Unlimited email support', 'Valid for any location in Nigeria', 'Remote diagnosis via AnyDesk'] },
  { tier: 'Tier 2', name: 'On-site — Lagos', text: 'Scheduled visits for Lagos-based offices.', list: ['Everything in Basic', 'Up to 6 site visits (6 days) per year', 'After installation and commissioning', 'Remote diagnosis via AnyDesk'], featured: true },
  { tier: 'Tier 3', name: 'On-site — Nigeria', text: 'On-site cover scoped to your project location.', list: ['Everything in Basic', 'Per-call on-site visits nationwide', 'Scoped to your project location', 'Same remote, email and phone backbone'] },
];

export default async function TrainingPage() {
  const [{ company }, FAQS] = await Promise.all([getSettings(), getFaqs('training')]);
  return (
    <>
      <PageHero
        trail={[['Training & Support']]}
        eyebrow="Training & Support"
        title="Certified training and support that keeps your office productive."
        lede="A licence only delivers value when people use it well. We train your team on every product line we carry, then support them for as long as you need."
        actions={
          <>
            <Link className="btn btn-light" href="/contact">
              Request a training schedule
              <Icon name="arrow" />
            </Link>
            <a className="btn btn-ghost" href="#support">
              Compare support plans
            </a>
          </>
        }
        visual={
          <div className="page-hero-visual">
            <Art name="training" priority />
          </div>
        }
      />

      <section className="section" id="training">
        <div className="container split">
          <div className="reveal">
            <Eyebrow>Certified training</Eyebrow>
            <h2 className="h2">Learn from certified instructors, wherever your team is.</h2>
            <div className="body-copy" style={{ marginTop: 20 }}>
              <p>
                Training runs from our dedicated in-house facility in Lagos, or remotely over Zoom and Microsoft Teams. We offer corporate, personal and certified
                tracks, from first-day fundamentals to advanced, project-based workflows.
              </p>
            </div>
            <CheckList
              items={[
                'Vendor-certified instructors across every product line',
                'Corporate training for teams, and personal training for individuals',
                'Certified tracks, including delivery as a Bentley Institute training partner',
                'CAD-to-BIM transition programme for design offices',
                'Postgraduate education in partnership with Zigurat Global Institute of Technology',
              ]}
            />
          </div>
          <div className="split-media reveal">
            <Art name="bim" alt="Diagram of a building shown as 2D CAD linework on one side and a BIM model on the other" />
          </div>
        </div>
      </section>

      <section className="section bg-soft">
        <div className="container">
          <SectionHead eyebrow="Course areas" title="Training across our portfolio." link={{ href: '/contact', label: 'Ask about upcoming dates' }} />
          <div className="grid-3 reveal-stagger">
            {COURSES.map(([title, text, href]) => (
              <InfoCard key={title} href={href} icon="graduation" title={title} text={text} cta="Learn more" />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="support">
        <div className="container">
          <SectionHead
            center
            eyebrow="Support plans"
            title="Three support tiers, built around how you work."
            lead="Annual support contracts cover installation, commissioning and application support. Choose the level of on-site cover you need."
          />
          <div className="grid-3 reveal-stagger" style={{ alignItems: 'stretch' }}>
            {TIERS.map(t => (
              <div className={`tier-card${t.featured ? ' featured' : ''}`} key={t.tier}>
                {t.featured && <span className="badge">For Lagos offices</span>}
                <span className="tier">{t.tier}</span>
                <h3>{t.name}</h3>
                <p>{t.text}</p>
                <CheckList items={t.list} />
                <Link className={`btn ${t.featured ? 'btn-primary' : 'btn-outline'} btn-block`} href="/contact">
                  Request a quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-dark" id="remote">
        <div className="container split">
          <div className="reveal">
            <Eyebrow>Remote support</Eyebrow>
            <h2 className="h2">Problem solved, without waiting for a site visit.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Most software issues can be diagnosed and fixed remotely. With your permission, our engineers connect securely using AnyDesk.
            </p>
            <div className="hero-actions">
              <a className="btn btn-light" href="https://anydesk.com/en/downloads" target="_blank" rel="noopener noreferrer">
                <Icon name="download" />
                Download AnyDesk
              </a>
              <a className="btn btn-ghost" href={tel(company.phones[0])}>
                <Icon name="phone" />
                Call support
              </a>
            </div>
          </div>
          <div className="reveal">
            <ol className="steps steps-2">
              {[
                ['Download', 'Install the free AnyDesk client from the official site.'],
                ['Contact us', `Call or email ${company.email} with a short description of the issue.`],
                ['Share your ID', 'Read out the AnyDesk address shown on your screen.'],
                ['We connect', 'You approve the session and our engineer resolves the issue.'],
              ].map(([title, text], i) => (
                <li className="step" key={title}>
                  <div className="step-num">0{i + 1}</div>
                  <h3>{title}</h3>
                  <p style={{ color: 'var(--silver)' }}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="h2">Training &amp; support questions.</h2>
          </div>
          <div className="reveal">
            <Faq items={FAQS} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
