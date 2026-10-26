import type { Metadata } from 'next';
import Link from 'next/link';
import { formatWebinarDay, formatWebinarTime, isUpcoming, youtubeId } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listWebinars } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Webinars' };

type Search = { when?: 'upcoming' | 'past'; deleted?: string };

export default async function WebinarsAdmin({ searchParams }: { searchParams: Promise<Search> }) {
  const { when, deleted } = await searchParams;
  const all = await listWebinars();

  if (!all) {
    return (
      <>
        <PageHeader title="Webinars" />
        <div className="adm-content">
          <div className="adm-notice warn">
            <Icon name="alert" />
            <div>
              <strong>One-time setup needed.</strong> The webinars table doesn&apos;t exist in the database yet. In Supabase, open the SQL Editor and run
              <code>supabase/migrations/20261025000000_webinars.sql</code>, then <code>20261026000000_webinars_platform.sql</code>, then reload this page.
            </div>
          </div>
        </div>
      </>
    );
  }

  const now = new Date();
  const upcoming = all.filter(w => isUpcoming(w, now)).reverse();
  const past = all.filter(w => !isUpcoming(w, now));
  const list = when === 'upcoming' ? upcoming : when === 'past' ? past : [...upcoming, ...past];
  const tab = (s?: string) => (s === when ? 'page' : undefined);

  return (
    <>
      <PageHeader
        title="Webinars"
        actions={
          <>
            <Link className="adm-btn secondary" href="/admin/webinars/import">
              <Icon name="upload" />
              Import past webinars
            </Link>
            <Link className="adm-btn primary" href="/admin/webinars/new">
              <Icon name="plus" />
              New webinar
            </Link>
          </>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="webinar" />
        <section className="adm-card">
          <div className="adm-toolbar">
            <nav className="adm-tabs" aria-label="Filter">
              <Link href="/admin/webinars" aria-current={tab(undefined)}>
                All ({all.length})
              </Link>
              <Link href="/admin/webinars?when=upcoming" aria-current={tab('upcoming')}>
                Upcoming ({upcoming.length})
              </Link>
              <Link href="/admin/webinars?when=past" aria-current={tab('past')}>
                Past ({past.length})
              </Link>
            </nav>
          </div>
          {list.length === 0 ? (
            <div className="adm-empty">
              <h3>No webinars here yet</h3>
              <p>
                Add an upcoming webinar with its Teams or Google Meet link, or <Link href="/admin/webinars/import">import past recordings</Link> from YouTube.
              </p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>When (WAT)</th>
                    <th>Status</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(w => {
                    const live = isUpcoming(w, now);
                    const status = !w.published
                      ? { cls: 'warn', label: 'Hidden' }
                      : live
                        ? w.registrationUrl
                          ? { cls: 'ok', label: 'Registration open' }
                          : { cls: 'warn', label: 'No registration link' }
                        : youtubeId(w.recordingUrl)
                          ? { cls: 'ok', label: 'Recording live' }
                          : { cls: 'warn', label: 'Add recording' };
                    return (
                      <tr key={w.id}>
                        <td className="title-cell">
                          <Link href={`/admin/webinars/${w.id}`}>{w.title}</Link>
                          <small>/webinars/{w.slug}</small>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {formatWebinarDay(w.startsAt)}
                          <small style={{ display: 'block', color: 'var(--muted)' }}>{formatWebinarTime(w)}</small>
                        </td>
                        <td>
                          <span className={`adm-badge ${status.cls}`}>{status.label}</span>
                        </td>
                        <td className="actions">
                          {w.published && (
                            <Link className="adm-btn secondary sm" href={`/webinars/${w.slug}`} target="_blank">
                              <Icon name="eye" />
                              View
                            </Link>
                          )}{' '}
                          <Link className="adm-btn secondary sm" href={`/admin/webinars/${w.id}`}>
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
