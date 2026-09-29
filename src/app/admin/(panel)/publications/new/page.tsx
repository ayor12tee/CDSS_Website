import type { Metadata } from 'next';
import { PageHeader } from '../../../_components/PageHeader';
import { listMedia, listProducts } from '../../../_lib/queries';
import { PublicationForm } from '../PublicationForm';

export const metadata: Metadata = { title: 'New publication' };

export default async function NewPublication() {
  const [products, media] = await Promise.all([listProducts(), listMedia()]);
  return (
    <>
      <PageHeader title="New publication" crumbs={[['Publications', '/admin/publications']]} />
      <div className="adm-content">
        <PublicationForm products={products} media={media} />
      </div>
    </>
  );
}
