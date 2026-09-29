import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { CheckboxField, CheckboxGroupField, LinesField, SelectField, TextAreaField, TextField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { deleteProduct, saveProduct } from '../../../_lib/content-actions';
import { getProductById, listIndustries } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit product' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function ProductEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [p, industries] = await Promise.all([isNew ? null : getProductById(id), listIndustries()]);
  if (!isNew && !p) notFound();

  return (
    <>
      <PageHeader title={p?.name ?? 'New product'} crumbs={[['Products', '/admin/products']]} />
      <div className="adm-content">
        <ActionForm
          action={saveProduct}
          submitLabel={p ? 'Save changes' : 'Create product'}
          initialMessage={created ? 'Product created.' : undefined}
          extra={
            p && (
              <>
                {p.published && (
                  <Link className="adm-btn secondary" href={`/products/${p.slug}`} target="_blank">
                    <Icon name="eye" />
                    View live
                  </Link>
                )}
                <ConfirmButton action={deleteProduct.bind(null, p.id)} label="Delete" confirm={`Delete ${p.name}? Its page will be removed from the website.`} />
              </>
            )
          }
        >
          {p && <input type="hidden" name="id" value={p.id} />}
          <div className="adm-grid main-side">
            <div className="adm-grid">
              <section className="adm-card adm-fields cols-2">
                <TextField name="name" label="Name" required defaultValue={p?.name} full />
                <TextField name="kind" label="Specialism" required defaultValue={p?.kind} placeholder="e.g. Infrastructure Engineering" />
                <TextField name="tagline" label="Tagline" required defaultValue={p?.tagline} />
                <TextAreaField name="lede" label="Introduction" required rows={5} defaultValue={p?.lede} hint="Opening paragraph on the product page." full />
                <TextAreaField name="why" label="Why buy through CDSS" rows={4} defaultValue={p?.why} full />
              </section>
              <section className="adm-card adm-fields">
                <LinesField
                  name="uses"
                  label="What it is used for"
                  rows={6}
                  defaultValue={p?.uses}
                  hint="One per line. Put product names in brackets to show them as a label, e.g. “Offshore structural analysis (SACS)”."
                />
                <LinesField name="keyProducts" label="Key products" rows={6} defaultValue={p?.keyProducts} hint="One per line. Shown as chips on the page." />
              </section>
            </div>
            <div className="adm-grid">
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">Publishing</h2>
                <CheckboxField name="published" label="Show on the website" defaultChecked={p?.published ?? true} />
                <SelectField
                  name="group"
                  label="Type"
                  defaultValue={p?.group ?? 'Software'}
                  options={[
                    { value: 'Software', label: 'Software' },
                    { value: 'Hardware', label: 'Hardware' },
                  ]}
                />
                <TextField name="sortOrder" type="number" label="Order" defaultValue={p?.sortOrder ?? 0} hint="Lower numbers appear first." />
                <TextField name="slug" label="URL slug" defaultValue={p?.slug} hint="Leave blank to generate it from the name." />
              </section>
              <section className="adm-card adm-fields">
                <CheckboxGroupField name="industries" label="Industries" options={industries.map(i => ({ value: i.slug, label: i.name }))} defaultValue={p?.industries} />
              </section>
            </div>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
