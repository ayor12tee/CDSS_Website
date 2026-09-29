import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listPartners } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Vendor partners' };

export default async function PartnersAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [partners, { deleted }] = await Promise.all([listPartners(), searchParams]);
  return (
    <>
      <PageHeader
        title="Vendor partners"
        actions={
          <Link className="adm-btn primary" href="/admin/partners/new">
            <Icon name="plus" />
            New partner
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="partner" />
        <section className="adm-card">
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
            Listed on the Vendor Partners page. Software and hardware partners also scroll across the home page, and the total appears in the home page stats.
          </p>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Type</th>
                  <th>Product page</th>
                  <th className="num">Order</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {partners.map(p => (
                  <tr key={p.id}>
                    <td className="title-cell">
                      <Link href={`/admin/partners/${p.id}`}>{p.name}</Link>
                      <small>{p.description.slice(0, 90)}</small>
                    </td>
                    <td>
                      <span className="adm-badge brand">{p.tag}</span>
                    </td>
                    <td>{p.productSlug ? `/products/${p.productSlug}` : '—'}</td>
                    <td className="num">{p.sortOrder}</td>
                    <td className="actions">
                      <Link className="adm-btn secondary sm" href={`/admin/partners/${p.id}`}>
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
