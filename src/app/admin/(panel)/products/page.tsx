import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listProducts } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Products' };

export default async function ProductsAdmin({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const [products, { deleted }] = await Promise.all([listProducts(), searchParams]);
  return (
    <>
      <PageHeader
        title="Products"
        actions={
          <Link className="adm-btn primary" href="/admin/products/new">
            <Icon name="plus" />
            New product
          </Link>
        }
      />
      <div className="adm-content">
        <FlashNotice deleted={deleted} what="product" />
        <section className="adm-card">
          <p className="sub" style={{ marginTop: -4, marginBottom: 16, color: 'var(--muted)' }}>
            Each product line has its own page under Solutions. Order sets their position in lists.
          </p>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Product line</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="num">Order</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td className="title-cell">
                      <Link href={`/admin/products/${p.id}`}>{p.name}</Link>
                      <small>{p.kind}</small>
                    </td>
                    <td>{p.group}</td>
                    <td>
                      <span className={`adm-badge ${p.published ? 'ok' : 'warn'}`}>{p.published ? 'Live' : 'Hidden'}</span>
                    </td>
                    <td className="num">{p.sortOrder}</td>
                    <td className="actions">
                      <Link className="adm-btn secondary sm" href={`/admin/products/${p.id}`}>
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
