import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listClients } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Clients' };

export default async function ClientsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [clients, { deleted }] = await Promise.all([listClients(), searchParams]);
  return (
    <>
      <PageHeader
        title="Clients"
        actions={
          <Link className="adm-btn primary" href="/admin/clients/new">
            <Icon name="plus" />
            New client
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="client" />
        <section className="adm-card">
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
            Clients with a group appear on the Client Base page. Tick &ldquo;logo wall&rdquo; to also show the name on the home page.
          </p>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Client Base group</th>
                  <th>Home logo wall</th>
                  <th className="num">Order</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id}>
                    <td className="title-cell">
                      <Link href={`/admin/clients/${c.id}`}>{c.name}</Link>
                    </td>
                    <td>{c.group ?? <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td>{c.onLogoWall ? <span className="adm-badge ok">Shown</span> : <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                    <td className="num">{c.sortOrder}</td>
                    <td className="actions">
                      <Link className="adm-btn secondary sm" href={`/admin/clients/${c.id}`}>
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
