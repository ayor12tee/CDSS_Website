import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { formatDate } from '@/lib/format';
import { CATEGORIES } from '@/lib/types';
import { Icon, type IconName } from '@/components/ui/Icon';
import { PageHeader } from '../_components/PageHeader';
import { getDashboardCounts, listPublications, listSubmissions } from '../_lib/queries';

export const metadata: Metadata = { title: 'Dashboard' };

function when(iso: string) {
  return new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const [counts, submissions, publications, { error }] = await Promise.all([getDashboardCounts(), listSubmissions(), listPublications(), searchParams]);
  const recent = [...publications].sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? '')).slice(0, 5);

  const stats: { label: string; value: number; icon: IconName; href: string }[] = [
    { label: 'Published articles', value: counts.published, icon: 'file', href: '/admin/publications?status=published' },
    { label: 'Drafts', value: counts.drafts, icon: 'edit', href: '/admin/publications?status=draft' },
    { label: 'Unread messages', value: counts.unread, icon: 'inbox', href: '/admin/inbox?filter=unread' },
    { label: 'Subscribers', value: counts.subscribers, icon: 'mail', href: '/admin/subscribers' },
  ];

  const warnings: string[] = [];
  if (!process.env.NEXT_PUBLIC_SITE_URL) warnings.push('NEXT_PUBLIC_SITE_URL is not set, so share links and the sitemap use the default domain.');
  if (!process.env.RESEND_API_KEY && !process.env.CONTACT_WEBHOOK_URL) warnings.push('No email or webhook notifications are configured. New enquiries only appear in the Inbox.');

  return (
    <>
      <PageHeader
        title={`Welcome back${user.name ? `, ${user.name.split(' ')[0]}` : ''}`}
        actions={
          <>
            <Link className="adm-btn secondary" href="/admin/inbox">
              <Icon name="inbox" />
              Inbox
            </Link>
            <Link className="adm-btn primary" href="/admin/publications/new">
              <Icon name="plus" />
              New publication
            </Link>
          </>
        }
      />
      <div className="adm-content">
        {error === 'forbidden' && <div className="adm-notice err">That area is for admins only.</div>}
        {warnings.map(w => (
          <div className="adm-notice warn" key={w}>
            <Icon name="alert" />
            {w}
          </div>
        ))}

        <div className="adm-stats">
          {stats.map(s => (
            <Link className="adm-stat" href={s.href} key={s.label}>
              <div className="icon-box">
                <Icon name={s.icon} />
              </div>
              <div>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="adm-grid cols-2">
          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Latest enquiries</h2>
              <Link className="adm-link" href="/admin/inbox">
                View all
              </Link>
            </div>
            {submissions.length === 0 ? (
              <div className="adm-empty">
                <h3>No messages yet</h3>
                <p>Contact form and newsletter submissions will appear here.</p>
              </div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <tbody>
                    {submissions.slice(0, 6).map(s => (
                      <tr key={s.id} className={s.isRead ? undefined : 'unread'}>
                        <td className="title-cell">
                          <Link href={`/admin/inbox/${s.id}`}>
                            {!s.isRead && <span className="adm-dot" style={{ marginRight: 8 }} />}
                            {s.name || s.email}
                          </Link>
                          <small>{s.kind === 'newsletter' ? 'Newsletter sign-up' : s.fields.enquiry || 'Contact form'}</small>
                        </td>
                        <td className="num" style={{ color: 'var(--muted)', fontWeight: 400 }}>
                          {when(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="adm-card">
            <div className="adm-card-head">
              <h2>Recently edited publications</h2>
              <Link className="adm-link" href="/admin/publications">
                View all
              </Link>
            </div>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <tbody>
                  {recent.map(p => (
                    <tr key={p.id}>
                      <td className="title-cell">
                        <Link href={`/admin/publications/${p.id}`}>{p.title}</Link>
                        <small>
                          {CATEGORIES[p.category].label} · {formatDate(p.publishedOn)}
                        </small>
                      </td>
                      <td className="actions">
                        <span className={`adm-badge ${p.status === 'published' ? 'ok' : 'warn'}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="adm-card">
          <h2>Quick links</h2>
          <p className="sub">Edits go live on the website as soon as you save.</p>
          <div className="adm-top-actions">
            <Link className="adm-btn secondary" href="/admin/products">
              <Icon name="layers" />
              Products ({counts.products})
            </Link>
            <Link className="adm-btn secondary" href="/admin/industries">
              <Icon name="building" />
              Industries ({counts.industries})
            </Link>
            <Link className="adm-btn secondary" href="/admin/media">
              <Icon name="image" />
              Media library
            </Link>
            {user.role === 'admin' && (
              <Link className="adm-btn secondary" href="/admin/settings">
                <Icon name="settings" />
                Site settings
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
