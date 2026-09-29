import Link from 'next/link';
import type { ReactNode } from 'react';

export function PageHeader({ title, crumbs = [], actions }: { title: string; crumbs?: [string, string][]; actions?: ReactNode }) {
  return (
    <header className="adm-top">
      <div>
        {crumbs.length > 0 && (
          <nav className="adm-crumbs" aria-label="Breadcrumb">
            {crumbs.map(([label, href]) => (
              <span key={href}>
                <Link href={href}>{label}</Link> /
              </span>
            ))}
          </nav>
        )}
        <h1>{title}</h1>
      </div>
      {actions && <div className="adm-top-actions">{actions}</div>}
    </header>
  );
}

/** Success banner driven by ?created=1 / ?deleted=1 query flags after redirects. */
export function FlashNotice({ created, deleted, what }: { created?: string; deleted?: string; what: string }) {
  if (!created && !deleted) return null;
  return (
    <div className="adm-notice ok" role="status">
      {created ? `The ${what} was created.` : `The ${what} was deleted.`}
    </div>
  );
}
