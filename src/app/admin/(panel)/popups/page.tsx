import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { OCCASIONS, SHOW_ON, formatLagos, popupStatus } from '@/lib/popups';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { PopupPreview } from '../../_components/PopupPreview';
import { listPopups } from '../../_lib/popup-queries';

export const metadata: Metadata = { title: 'Pop-ups' };

export default async function PopupsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [popups, { deleted }] = await Promise.all([listPopups(), searchParams]);

  if (!popups) {
    return (
      <>
        <PageHeader title="Pop-ups" />
        <div className="adm-content">
          <div className="adm-notice warn">
            <Icon name="alert" />
            <div>
              <strong>One-time setup needed.</strong> The pop-ups table doesn&apos;t exist in the database yet. In Supabase, open the SQL Editor and run
              <code>supabase/migrations/20261105000000_popups.sql</code>, then reload this page.
            </div>
          </div>
        </div>
      </>
    );
  }

  const now = new Date();
  return (
    <>
      <PageHeader
        title="Pop-ups"
        actions={
          <Link className="adm-btn primary" href="/admin/popups/new">
            <Icon name="plus" />
            New pop-up
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="pop-up" />
        <section className="adm-card">
          {popups.length === 0 ? (
            <div className="adm-empty">
              <h3>No pop-ups yet</h3>
              <p>Create a greeting for Christmas, Ramadan, Eid or another occasion, or an announcement such as an office closure. Choose when it starts and ends, and the site shows it during that time.</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Pop-up</th>
                    <th>When (Lagos time)</th>
                    <th>Status</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {popups.map(p => {
                    const status = popupStatus(p, now);
                    return (
                      <tr key={p.id}>
                        <td className="title-cell">
                          <Link href={`/admin/popups/${p.id}`}>{p.title}</Link>
                          <small>
                            {OCCASIONS[p.occasion].label} · {SHOW_ON[p.showOn]}
                          </small>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {formatLagos(p.startsAt)}
                          <small style={{ display: 'block', color: 'var(--muted)' }}>to {formatLagos(p.endsAt)}</small>
                        </td>
                        <td>
                          <span className={`adm-badge ${status.cls}`}>{status.label}</span>
                        </td>
                        <td className="actions">
                          <PopupPreview popup={p} />{' '}
                          <Link className="adm-btn secondary sm" href={`/admin/popups/${p.id}`}>
                            <Icon name="edit" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
