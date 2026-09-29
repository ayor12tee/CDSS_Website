import Link from 'next/link';
import { Fragment } from 'react';
import { getFaqs, getIndustries, getLogoWall, getPartners, getPublications, getSettings } from '@/lib/content';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Art, Eyebrow, Faq, LinkArrow, SectionHead, Steps } from '@/components/ui/primitives';
import { CountUp } from '@/components/layout/Motion';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import { Newsletter } from '@/components/forms/Newsletter';

const SERVICES: { icon: IconName; title: string; text: string; list: string[]; href: string; cta: string }[] = [
  { icon: 'layers', title: 'Software Solutions', text: 'Licensed, installed and configured for your workflow.', list: ['Autodesk & Bentley', 'Seequent & ANSYS', 'Technical Toolboxes, Hexagon PPM, CYPE'], href: '/products', cta: 'Explore software' },
  { icon: 'printer', title: 'Hardware & Bureau', text: 'Capture, plot and archive every drawing you hold.', list: ['Contex large-format scanners', 'Avision document scanners', 'Scanning & raster-to-vector'], href: '/about/bureau-services', cta: 'Explore bureau services' },
  { icon: 'graduation', title: 'Certified Training', text: 'Get teams productive from day one, in person or online.', list: ['In-house Lagos facility', 'Zoom & MS Teams delivery', 'CAD-to-BIM programme'], href: '/training#training', cta: 'View training' },
  { icon: 'headset', title: 'Technical Support', text: 'Keep your office running once you are live.', list: ['Unlimited phone & email', 'Scheduled on-site visits', 'Remote diagnosis via AnyDesk'], href: '/training#support', cta: 'View support plans' },
];

const WORKFLOWS: { icon: IconName; title: string; text: string; steps: string[] }[] = [
  { icon: 'scan', title: 'Paper archive to live CAD', text: 'Turn decades of paper drawings into searchable, editable digital assets that are protected against fire, flood and wear.', steps: ['Paper drawings', 'Contex scan', 'GTX raster-to-vector', 'AutoCAD / MicroStation'] },
  { icon: 'activity', title: 'Design to validated performance', text: 'Take a design model into detailed simulation and prove performance before fabrication, not after.', steps: ['Revit / STAAD.Pro', 'ANSYS simulation', 'Design sign-off'] },
  { icon: 'box', title: 'CAD to BIM', text: 'Move a 2D drafting office to coordinated model-based delivery without stalling live projects.', steps: ['CAD standards', 'Revit templates', 'Navisworks coordination'] },
  { icon: 'mountain', title: 'Field data to subsurface model', text: 'Combine drillhole, geophysical and survey data into 3D geological models the whole team can use.', steps: ['Drillhole data', 'Oasis montaj', 'Leapfrog Geo model'] },
];

export default async function HomePage() {
  const [settings, publications, industries, logoWall, faqs, partners] = await Promise.all([
    getSettings(),
    getPublications(),
    getIndustries(),
    getLogoWall(),
    getFaqs('home'),
    getPartners(),
  ]);
  const latest = publications.slice(0, 3);
  const { announcement, hero } = settings;
  const partnerNames = partners.filter(p => /Software|Hardware/.test(p.tag)).map(p => p.name);

  return (
    <>
      <section className="hero">
        <div className="blueprint" />
        <div className="container hero-inner">
          <div>
            {announcement.enabled && (
              <Link className="hero-kicker" href={announcement.href || '/'}>
                {announcement.label && <b>{announcement.label}</b>}
                {announcement.text} <Icon name="arrow" style={{ width: 14, height: 14 }} />
              </Link>
            )}
            <h1>
              {hero.titleLead} <span className="chrome-text">{hero.titleAccent}</span>
            </h1>
            <p className="hero-sub">{hero.subtitle}</p>
            <div className="hero-actions">
              <Link className="btn btn-light" href="/products">
                Explore Our Solutions
                <Icon name="arrow" />
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Speak to an Expert
              </Link>
            </div>
            <div className="hero-points">
              {['Authorised vendor licensing', 'Certified training', 'Local, tiered support'].map(p => (
                <span key={p}>
                  <Icon name="check" />
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-frame">
              <Art name="hero" alt="Isometric blueprint of buildings and a tower crane over survey contours" priority />
            </div>
            <div className="float-card fc-1">
              <div className="icon-box">
                <Icon name="award" />
              </div>
              <div>
                <strong>#1 Bentley Partner</strong>
                <span>Sub-Saharan Africa, 2025</span>
              </div>
            </div>
            <div className="float-card fc-2">
              <div className="icon-box">
                <Icon name="clock" />
              </div>
              <div>
                <strong>Since 1989</strong>
                <span>Nigeria&apos;s first CADD company</span>
              </div>
            </div>
            <div className="float-card fc-3">
              <div className="icon-box">
                <Icon name="layers" />
              </div>
              <div>
                <strong>{partners.length} vendor partners</strong>
                <span>One accountable partner</span>
              </div>
            </div>
          </div>
        </div>
        <div className="partner-strip">
          <div className="container">
            <p>Authorised partner for</p>
            <div className="marquee">
              <div className="marquee-track">
                {[...partnerNames, ...partnerNames].map((n, i) => (
                  <span key={i} aria-hidden={i >= partnerNames.length || undefined}>
                    {n}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="what-we-do">
        <div className="container">
          <SectionHead
            eyebrow="What we do"
            title="Software, hardware, training and support from one partner."
            lead="Every product line we carry comes with vendor-certified training and tiered technical support. You get far more than a licence key."
            link={{ href: '/about', label: 'About CDSS' }}
          />
          <div className="grid-4 reveal-stagger">
            {SERVICES.map((s, i) => (
              <Link className="service-card" href={s.href} key={s.title}>
                <span className="card-num">0{i + 1}</span>
                <div className="icon-box">
                  <Icon name={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <ul>
                  {s.list.map(l => (
                    <li key={l}>
                      <Icon name="check" />
                      {l}
                    </li>
                  ))}
                </ul>
                <span className="link-arrow">
                  {s.cta}
                  <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-soft" id="industries">
        <div className="container">
          <SectionHead
            eyebrow="Industries we serve"
            title="Built for the sectors that build Nigeria."
            lead="For more than three decades we have supported the country's most demanding engineering, industrial and public-sector work."
            link={{ href: '/industries', label: 'All industries' }}
          />
          <div className="grid-4 reveal-stagger">
            {industries.map((ind, i) => (
              <Link className="industry-card" href={`/industries/${ind.slug}`} key={ind.slug}>
                <Art name={ind.image} />
                <span className="tag">0{i + 1}</span>
                <h3>{ind.name}</h3>
                <p>{ind.summary}</p>
                <span className="link-arrow">
                  Explore
                  <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-dark" id="workflows">
        <div className="container">
          <SectionHead
            eyebrow="Connected workflows"
            title="Tools that work together, not in isolation."
            lead="We combine the right products from our vendor partners into complete workflows, and train your team to run them."
            link={{ href: '/contact', label: 'Discuss your workflow' }}
            onDark
          />
          <div className="grid-2 reveal-stagger">
            {WORKFLOWS.map(w => (
              <div className="flow-card" key={w.title}>
                <div className="icon-box">
                  <Icon name={w.icon} />
                </div>
                <h3>{w.title}</h3>
                <p>{w.text}</p>
                <div className="flow-steps">
                  {w.steps.map((s, i) => (
                    <Fragment key={s}>
                      {i > 0 && <Icon name="arrow" />}
                      <span className="flow-chip">{s}</span>
                    </Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stat-band">
        <div className="container">
          <div className="stat-grid">
            <div className="stat">
              <div className="stat-num">1989</div>
              <div className="stat-label">Nigeria&apos;s first CADD technology company</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <CountUp to={35} suffix="+" />
              </div>
              <div className="stat-label">Years as an authorised Autodesk reseller</div>
            </div>
            <div className="stat">
              <div className="stat-num">#1</div>
              <div className="stat-label">Bentley partner in Sub-Saharan Africa, 2025</div>
            </div>
            <div className="stat">
              <div className="stat-num">
                <CountUp to={partners.length} />
              </div>
              <div className="stat-label">Vendor, training and technology partners</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="how-we-work">
        <div className="container">
          <SectionHead center eyebrow="How we work" title="A clear path from first call to full support." />
          <Steps
            steps={[
              ['Consult', "We learn your workflow, project types and pain points, then recommend the right software and hardware. You won't get a one-size-fits-all bundle."],
              ['License & Deploy', 'Genuine, vendor-authorised licensing, installed and configured on your systems, whether desktop, mobile or cloud.'],
              ['Train', 'Certified training across every product line, in person or online, so your team is productive from day one.'],
              ['Support', "Tiered technical support and remote diagnosis keep your office running once you're live."],
            ]}
          />
        </div>
      </section>

      <section className="section bg-soft" id="proof">
        <div className="container">
          <div className="award reveal">
            <div className="award-body">
              <Eyebrow>Recognition</Eyebrow>
              <h2 className="h3">Top-Performing Partner, Sub-Saharan Africa 2025</h2>
              <blockquote>
                “Bentley Systems is proud to recognize CDSS as the top-performing partner in the Sub-Saharan Africa region for 2025. CDSS has been a trusted Bentley
                partner for many years, serving primarily the oil and gas industry.”
              </blockquote>
              <cite>
                <span>
                  <b>Allan Murphy</b>Senior Vice President, Bentley Systems
                </span>
              </cite>
              <div style={{ marginTop: 32 }}>
                <LinkArrow href="/publications/bentley-top-partner-africa-2025">Read the announcement</LinkArrow>
              </div>
            </div>
            <div className="award-media">
              <Art name="award" alt="Award emblem: number one, top-performing partner 2025" />
            </div>
          </div>

          <div style={{ marginTop: 96 }} className="reveal">
            <div className="section-head">
              <div>
                <Eyebrow>Trusted by industry leaders</Eyebrow>
                <h2 className="h2">The organisations behind Nigeria&apos;s biggest projects.</h2>
              </div>
              <LinkArrow href="/about/client-base">View our client base</LinkArrow>
            </div>
            <div className="logo-wall">
              {logoWall.map(n => (
                <div className="logo-cell" key={n}>
                  {n}
                </div>
              ))}
            </div>
            <p className="fine-print">Organisation names are listed as a factual record of client relationships. They are not endorsements.</p>
          </div>
        </div>
      </section>

      <section className="section" id="insights">
        <div className="container">
          <SectionHead
            eyebrow="Publications"
            title="Insights, guides and news."
            lead="Practical thinking from our engineers on the tools and workflows shaping engineering in Nigeria."
            link={{ href: '/publications', label: 'All publications' }}
          />
          <PostGrid posts={latest} />
        </div>
      </section>

      <section className="section bg-soft" id="faq">
        <div className="container split top">
          <div className="reveal">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="h2">Common questions.</h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Can&apos;t find what you&apos;re looking for? Our team can answer questions about licensing, training or support.
            </p>
            <div className="hero-actions" style={{ marginTop: 32 }}>
              <Link className="btn btn-primary" href="/contact">
                Ask a question
                <Icon name="arrow" />
              </Link>
            </div>
          </div>
          <div className="reveal">
            <Faq items={faqs} />
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container">
          <Newsletter />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
