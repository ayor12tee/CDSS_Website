import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Icon, type IconName } from './Icon';

/** Image source for an illustration name ("award" -> /img/award.svg) or an uploaded image URL. */
export function artSrc(name: string) {
  return /^https?:\/\//.test(name) || name.startsWith('/') ? name : `/img/${name}.svg`;
}

/** Blueprint illustration from /public/img, or an uploaded image from the media library. */
export function Art({ name, alt = '', priority = false }: { name: string; alt?: string; priority?: boolean }) {
  return <Image src={artSrc(name)} alt={alt} width={800} height={500} unoptimized priority={priority} />;
}

export function LinkArrow({ href, children, onDark }: { href: string; children: ReactNode; onDark?: boolean }) {
  return (
    <Link className={`link-arrow${onDark ? ' on-dark' : ''}`} href={href}>
      {children}
      <Icon name="arrow" />
    </Link>
  );
}

export function Eyebrow({ children, onDark }: { children: ReactNode; onDark?: boolean }) {
  return <span className={`eyebrow${onDark ? ' on-dark' : ''}`}>{children}</span>;
}

interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  link?: { href: string; label: string };
  center?: boolean;
  onDark?: boolean;
}

export function SectionHead({ eyebrow, title, lead, link, center, onDark }: SectionHeadProps) {
  if (center) {
    return (
      <div className="section-head center reveal">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h2">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
    );
  }
  return (
    <div className="section-head reveal">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="h2">{title}</h2>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {link && (
        <LinkArrow href={link.href} onDark={onDark}>
          {link.label}
        </LinkArrow>
      )}
    </div>
  );
}

export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="check-list">
      {items.map((item, i) => (
        <li key={i}>
          <Icon name="check" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

interface InfoCardProps {
  href?: string;
  icon?: IconName;
  kicker?: string;
  title: string;
  text?: ReactNode;
  cta?: string;
  children?: ReactNode;
}

export function InfoCard({ href, icon, kicker, title, text, cta, children }: InfoCardProps) {
  const inner = (
    <>
      {icon && (
        <div className="icon-box">
          <Icon name={icon} />
        </div>
      )}
      {kicker && <div className="kicker">{kicker}</div>}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
      {href && cta && (
        <span className="link-arrow">
          {cta}
          <Icon name="arrow" />
        </span>
      )}
    </>
  );
  return href ? (
    <Link className="info-card" href={href}>
      {inner}
    </Link>
  ) : (
    <div className="info-card">{inner}</div>
  );
}

export function Steps({ steps, className = 'steps reveal-stagger' }: { steps: [string, string][]; className?: string }) {
  return (
    <div className={className}>
      {steps.map(([title, text], i) => (
        <div className="step" key={title}>
          <div className="step-num">0{i + 1}</div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </div>
  );
}

export function Faq({ items }: { items: [string, string][] }) {
  return (
    <div className="faq">
      {items.map(([q, a], i) => (
        <details key={q} open={i === 0}>
          <summary>
            {q}
            <span className="pm">
              <Icon name="plus" />
            </span>
          </summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}

export function StatBand({ stats }: { stats: { value: ReactNode; label: string }[] }) {
  return (
    <section className="stat-band">
      <div className="container">
        <div className="stat-grid">
          {stats.map(s => (
            <div className="stat" key={s.label}>
              <div className="stat-num">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
