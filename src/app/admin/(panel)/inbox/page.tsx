import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { markAllRead } from '../../_lib/inbox-actions';
import { listSubmissions } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Inbox' };

type Filter = 'unread' | 'contact' | 'newsletter';

export default async function InboxAdmin({ searchParams }: { searchParams: Promise<{ filter?: Filter; deleted?: string }> }) {
  const { filter, deleted } = await searchParams;
  const items = await listSubmissions(filter);
  const tab = (f?: Filter) => (f === filter ? 'page' : undefined);

  return (
    <>
      <PageHeader
        title="Inbox"
        actions={
          <form action={markAllRead}>
            <button className="adm-btn secondary" type="submit">
              <Icon name="check" />
              Mark all as read
            </button>
          </form>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="message" />
        <section className="adm-card">
          <div className="adm-toolbar">
            <nav className="adm-tabs" aria-label="Filter">
              <Link href="/admin/inbox" aria-current={tab(undefined)}>
                All
              </Link>
              <Link href="/admin/inbox?filter=unread" aria-current={tab('unread')}>
                Unread
              </Link>
              <Link href="/admin/inbox?filter=contact" aria-current={tab('contact')}>
                Contact form
              </Link>
              <Link href="/admin/inbox?filter=newsletter" aria-current={tab('newsletter')}>
                Newsletter
              </Link>
            </nav>
          </div>
          {items.length === 0 ? (
            <div className="adm-empty">
              <h3>Nothing here</h3>
              <p>Messages from the website contact form and newsletter sign-ups appear here.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Received</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(s => (
                    <tr key={s.id} className={s.isRead ? undefined : 'unread'}>
                      <td className="title-cell">
                        <Link href={`/admin/inbox/${s.id}`}>
                          {!s.isRead && <span className="adm-dot" style={{ marginRight: 8 }} />}
                          {s.name || s.email}
                        </Link>
                        {s.name && <small>{s.email}</small>}
                      </td>
                      <td>
                        {s.kind === 'newsletter' ? <span className="adm-badge brand">Newsletter</span> : s.fields.enquiry || 'Contact form'}
                        {s.fields.company && <small style={{ display: 'block', color: 'var(--muted)', fontWeight: 400 }}>{s.fields.company}</small>}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', fontWeight: 400 }}>{new Date(s.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td className="actions">
                        <Link className="adm-btn secondary sm" href={`/admin/inbox/${s.id}`}>
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
