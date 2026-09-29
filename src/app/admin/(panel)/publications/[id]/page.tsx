import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHeader } from '../../../_components/PageHeader';
import { getPublicationById, listMedia, listProducts } from '../../../_lib/queries';
import { PublicationForm } from '../PublicationForm';

export const metadata: Metadata = { title: 'Edit publication' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function EditPublication({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [publication, products, media] = await Promise.all([getPublicationById(id), listProducts(), listMedia()]);
  if (!publication) notFound();

  return (
    <>
      <PageHeader title={publication.title} crumbs={[['Publications', '/admin/publications']]} />
      <div className="adm-content">
        <PublicationForm publication={publication} products={products} media={media} created={!!created} />
      </div>
    </>
  );
}
