import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { SelectField, TextAreaField, TextField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { deletePartner, savePartner } from '../../../_lib/content-actions';
import { getPartnerById, listProducts } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit partner' };

const TAGS = ['Software Partner', 'Hardware Partner', 'Training Partner', 'Education Partner', 'Technology Partner'];

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function PartnerEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [p, products] = await Promise.all([isNew ? null : getPartnerById(id), listProducts()]);
  if (!isNew && !p) notFound();
  const tags = p && !TAGS.includes(p.tag) ? [...TAGS, p.tag] : TAGS;

  return (
    <>
      <PageHeader title={p?.name ?? 'New partner'} crumbs={[['Vendor partners', '/admin/partners']]} />
      <div className="adm-content" style={{ maxWidth: 860 }}>
        <ActionForm
          action={savePartner}
          submitLabel={p ? 'Save changes' : 'Create partner'}
          initialMessage={created ? 'Partner created.' : undefined}
          extra={p && <ConfirmButton action={deletePartner.bind(null, p.id)} label="Delete" confirm={`Remove ${p.name} from the website?`} />}
        >
          {p && <input type="hidden" name="id" value={p.id} />}
          <section className="adm-card adm-fields cols-2">
            <TextField name="name" label="Name" required defaultValue={p?.name} />
            <SelectField name="tag" label="Partner type" defaultValue={p?.tag ?? 'Software Partner'} options={tags.map(t => ({ value: t, label: t }))} />
            <TextAreaField name="description" label="Description" required rows={3} defaultValue={p?.description} full />
            <SelectField
              name="productSlug"
              label="Links to product page"
              defaultValue={p?.productSlug ?? ''}
              options={[{ value: '', label: 'No product page' }, ...products.map(pr => ({ value: pr.slug, label: pr.name }))]}
            />
            <TextField name="sortOrder" type="number" label="Order" defaultValue={p?.sortOrder ?? 0} hint="Lower numbers appear first." />
          </section>
        </ActionForm>
      </div>
    </>
  );
}
