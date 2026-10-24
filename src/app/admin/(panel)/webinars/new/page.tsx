import type { Metadata } from 'next';
import { PageHeader } from '../../../_components/PageHeader';
import { listMedia, listProducts } from '../../../_lib/queries';
import { WebinarForm } from '../WebinarForm';

export const metadata: Metadata = { title: 'New webinar' };

export default async function NewWebinar() {
  const [products, media] = await Promise.all([listProducts(), listMedia()]);
  return (
    <>
      <PageHeader title="New webinar" crumbs={[['Webinars', '/admin/webinars']]} />
      <div className="adm-content">
        <WebinarForm products={products} media={media} />
      </div>
    </>
  );
}
