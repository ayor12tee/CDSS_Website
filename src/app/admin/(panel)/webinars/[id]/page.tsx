import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../_components/PageHeader';
import { getWebinarById, listMedia, listProducts } from '../../../_lib/queries';
import { WebinarForm } from '../WebinarForm';

export const metadata: Metadata = { title: 'Edit webinar' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditWebinar({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [webinar, products, media] = await Promise.all([getWebinarById(id), listProducts(), listMedia()]);
  if (!webinar) notFound();

  return (
    <>
      <PageHeader title={webinar.title} crumbs={[['Webinars', '/admin/webinars']]} />
      <div className="adm-content">
        <WebinarForm webinar={webinar} products={products} media={media} created={!!created} />
      </div>
    </>
  );
}
