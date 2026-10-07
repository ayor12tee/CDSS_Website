import Link from 'next/link';
import { getFaqs, getIndustries, getLogoWall, getPartners, getPublications, getSettings } from '@/lib/content';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Art, Eyebrow, Faq, LinkArrow, SectionHead, Steps } from '@/components/ui/primitives';
import { CountUp } from '@/components/layout/Motion';
import { CtaBand } from '@/components/layout/CtaBand';
import { PostGrid } from '@/components/publications/PostCard';
import { Newsletter } from '@/components/forms/Newsletter';

const SERVICES: { icon: IconName; title: string; text: string; href: string; cta: string }[] = [
  {
    icon: 'layers',
    title: 'Software licensing',
    text: 'Explore design, analysis, simulation and specialist software. Ask CDSS for advice on available products and licensing options for your team.',
    href: '/products',
    cta: 'Explore software',
  },
  {
    icon: 'printer',
    title: 'Hardware and document digitisation',
    text: 'Select scanning and plotting equipment, or discuss a managed service for drawings, maps and technical records.',
    href: '/about/bureau-services',
    cta: 'Explore scanning and bureau services',
  },
  {
    icon: 'graduation',
    title: 'Training',
    text: 'Build practical software skills through training for individuals and teams, with the course scope and delivery format agreed before enrolment.',
    href: '/training#training',
    cta: 'Explore training',
  },
  {
    icon: 'headset',
    title: 'Technical support',
    text: 'Discuss installation, configuration and application support, with coverage matched to your products and working environment.',
    href: '/training#support',
    cta: 'View support options',
  },
];

const APPROACH: { title: string; text: string; href: string; cta: string }[] = [
  { title: 'Choose the right tools', text: 'Match software and hardware to your discipline, deliverables, users and budget.', href: '/products', cta: 'Explore solutions' },
  { title: 'Prepare for productive use', text: 'Plan installation, configuration and the practical steps needed for adoption.', href: '/contact', cta: 'Plan your rollout' },
  { title: 'Build team capability', text: 'Develop skills around the tasks your people need to complete.', href: '/training#training', cta: 'View training' },
  { title: 'Keep work moving', text: 'Get help with application and deployment issues as your needs change.', href: '/training#support', cta: 'Support plans' },
];

const WORKFLOWS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: 'scan',
    title: 'Paper drawings to usable digital records',
    text: 'Scan, check and organise historical drawings. Convert selected sheets into editable CAD where the condition and intended use justify it.',
  },
  {
    icon: 'box',
    title: 'CAD to coordinated BIM delivery',
    text: 'Develop modelling skills alongside templates, coordination routines and agreed information-sharing practices.',
  },
  {
    icon: 'activity',
    title: 'Design to engineering assessment',
    text: 'Select analysis and simulation tools appropriate to the engineering question, then build the skills needed to interpret results and document assumptions.',
  },
  {
    icon: 'mountain',
    title: 'Field data to geological interpretation',
    text: 'Explore tools for managing exploration data and developing geological models for review and decision-making.',
  },
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
  const { hero } = settings;
  const partnerNames = partners.filter(p => /Software|Hardware/.test(p.tag)).map(p => p.name);

  return (
    <>
      <section className="hero">
        <div className="blueprint" />
        <div className="container hero-inner">
          <div>
            <p className="hero-since">
              <span aria-hidden="true" />
              Since 1989
            </p>
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
            <ul className="hero-points" aria-label="What we do">
              {['Software licensing', 'Scanning and plotting', 'Training', 'Technical support'].map(p => (
                <li key={p}>{p}</li>
              ))}
            </ul>
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

      <section className="section bg-soft" id="approach">
        <div className="container approach">
          <div className="approach-intro reveal">
            <Eyebrow>Our approach</Eyebrow>
            <h2 className="h2">Make your technology work for the way you work.</h2>
            <p className="lead">
              Your team needs more than access to software. It needs the right tools for its deliverables, a workable deployment, the skills to use them and a
              clear route to technical help. CDSS brings these decisions together around your projects, people and IT environment.
            </p>
          </div>
          <ol className="approach-rows reveal-stagger">
            {APPROACH.map((row, i) => (
              <li key={row.title}>
                <Link className="approach-row" href={row.href}>
                  <span className="approach-num">0{i + 1}</span>
                  <div className="approach-copy">
                    <h3>{row.title}</h3>
                    <p>{row.text}</p>
                  </div>
                  <span className="approach-link">
                    {row.cta}
                    <Icon name="arrow" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section" id="what-we-do">
        <div className="container">
          <SectionHead eyebrow="Our services" title="From selecting technology to putting it to work." />
          <div className="grid-4 reveal-stagger">
            {SERVICES.map((s, i) => (
              <Link className="service-card" href={s.href} key={s.title}>
                <span className="card-num">0{i + 1}</span>
                <div className="icon-box">
                  <Icon name={s.icon} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="link-arrow">
                  {s.cta}
                  <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
          <Link className="service-feature reveal" href="/bim-implementation">
            <div className="blueprint" />
            <div className="icon-box">
              <Icon name="box" />
            </div>
            <div className="service-feature-copy">
              <span className="service-feature-kicker">05 · Dedicated service</span>
              <h3>BIM implementation and information management</h3>
              <p>
                Connect your people, processes and project information. We help teams adopt BIM and establish practical workflows for sharing models, managing
                documents and coordinating reviews, supported by common data environment setup and role-based training.
              </p>
            </div>
            <span className="btn btn-light">
              Explore BIM implementation
              <Icon name="arrow" />
            </span>
          </Link>
        </div>
      </section>

      <section className="section bg-soft" id="industries">
        <div className="container">
          <SectionHead
            eyebrow="Industries we serve"
            title="Technology shaped around your Industry."
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
            title="Technology makes more sense when the workflow is clear."
            lead="Start with the information you have and the deliverable you need. CDSS can help you identify the tools, training and support required along the way."
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
                <CountUp to={20} suffix="+" />
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
            title="Practical guidance from the people behind the tools."
            lead="Product guidance, workflow lessons and technical insights from CDSS's team."
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
