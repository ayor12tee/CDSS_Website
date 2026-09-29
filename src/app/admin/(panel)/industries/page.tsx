import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listIndustries } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Industries' };

export default async function IndustriesAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [industries, { deleted }] = await Promise.all([listIndustries(), searchParams]);
  return (
    <>
      <PageHeader
        title="Industries"
        actions={
          <Link className="adm-btn primary" href="/admin/industries/new">
            <Icon name="plus" />
            New industry
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="industry" />
        <section className="adm-card">
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Status</th>
                  <th className="num">Capabilities</th>
                  <th className="num">Order</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {industries.map(i => (
                  <tr key={i.id}>
                    <td className="title-cell">
                      <Link href={`/admin/industries/${i.id}`}>{i.name}</Link>
                      <small>{i.short}</small>
                    </td>
                    <td>
                      <span className={`adm-badge ${i.published ? 'ok' : 'warn'}`}>{i.published ? 'Live' : 'Hidden'}</span>
                    </td>
                    <td className="num">{i.capabilities.length}</td>
                    <td className="num">{i.sortOrder}</td>
                    <td className="actions">
                      <Link className="adm-btn secondary sm" href={`/admin/industries/${i.id}`}>
                        <Icon name="edit" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
