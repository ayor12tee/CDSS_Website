import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate } from '@/lib/format';
import { CATEGORIES } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listPublications } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Publications' };

type Search = { status?: 'draft' | 'published'; q?: string; deleted?: string };

export default async function PublicationsAdmin({ searchParams }: { searchParams: Promise<Search> }) {
  const { status, q = '', deleted } = await searchParams;
  const all = await listPublications();
  const term = q.trim().toLowerCase();
  const list = all.filter(p => (!status || p.status === status) && (!term || `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(term)));
  const tab = (s?: string) => (s === status ? 'page' : undefined);

  return (
    <>
      <PageHeader
        title="Publications"
        actions={
          <Link className="adm-btn primary" href="/admin/publications/new">
            <Icon name="plus" />
            New publication
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="publication" />
        <section className="adm-card">
          <div className="adm-toolbar">
            <nav className="adm-tabs" aria-label="Filter">
              <Link href="/admin/publications" aria-current={tab(undefined)}>
                All ({all.length})
              </Link>
              <Link href="/admin/publications?status=published" aria-current={tab('published')}>
                Published ({all.filter(p => p.status === 'published').length})
              </Link>
              <Link href="/admin/publications?status=draft" aria-current={tab('draft')}>
                Drafts ({all.filter(p => p.status === 'draft').length})
              </Link>
            </nav>
            <form>
              {status && <input type="hidden" name="status" value={status} />}
              <input className="adm-search" type="search" name="q" defaultValue={q} placeholder="Search titles and tags" aria-label="Search publications" />
            </form>
          </div>
          {list.length === 0 ? (
            <div className="adm-empty">
              <h3>No publications found</h3>
              <p>{term || status ? 'Try another filter.' : 'Write your first article.'}</p>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map(p => (
                    <tr key={p.id}>
                      <td className="title-cell">
                        <Link href={`/admin/publications/${p.id}`}>
                          {p.featured && <Icon name="star" style={{ width: 14, height: 14, display: 'inline', marginRight: 6, color: 'var(--brand-500)' }} />}
                          {p.title}
                        </Link>
                        <small>/publications/{p.slug}</small>
                      </td>
                      <td>{CATEGORIES[p.category].label}</td>
                      <td>
                        <span className={`adm-badge ${p.status === 'published' ? 'ok' : 'warn'}`}>{p.status}</span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(p.publishedOn)}</td>
                      <td className="actions">
                        {p.status === 'published' && (
                          <Link className="adm-btn secondary sm" href={`/publications/${p.slug}`} target="_blank">
                            <Icon name="eye" />
                            View
                          </Link>
                        )}{' '}
                        <Link className="adm-btn secondary sm" href={`/admin/publications/${p.id}`}>
                          <Icon name="edit" />
                          Edit
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
