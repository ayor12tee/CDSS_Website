import type { Metadata } from 'next';
import './admin.css';

// The admin is always rendered per request: it depends on the signed-in user, live database data and
// runtime environment variables, so it must never be pre-rendered at build time.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | CDSS Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="adm">{children}</div>;
}
