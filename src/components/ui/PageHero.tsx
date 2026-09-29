import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

export type Crumb = [label: string, href?: string];

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const items: Crumb[] = [['Home', '/'], ...trail];
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map(([label, href], i) =>
        i === items.length - 1 || !href ? (
          <span key={label} aria-current="page">
            {label}
          </span>
        ) : (
          <Fragment key={label}>
            <Link href={href}>{label}</Link>
            <span aria-hidden="true">/</span>
          </Fragment>
        ),
      )}
    </nav>
  );
}

interface PageHeroProps {
  trail: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  actions?: ReactNode;
  visual?: ReactNode;
  extra?: ReactNode;
  className?: string;
}

export function PageHero({ trail, eyebrow, title, lede, actions, visual, extra, className }: PageHeroProps) {
  const cls = ['page-hero', visual ? 'has-visual' : '', className ?? ''].filter(Boolean).join(' ');
  return (
    <section className={cls}>
      <div className="blueprint" />
      <div className="container">
        <div>
          <Breadcrumbs trail={trail} />
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {lede && <p className="lede">{lede}</p>}
          {actions && <div className="hero-actions">{actions}</div>}
          {extra}
        </div>
        {visual}
      </div>
    </section>
  );
}
