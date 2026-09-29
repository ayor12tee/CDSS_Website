import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Icon, ICON_NAMES } from '@/components/ui/Icon';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { CapabilitiesEditor } from '../../../_components/CapabilitiesEditor';
import { CheckboxField, CheckboxGroupField, LinesField, SelectField, TextAreaField, TextField } from '../../../_components/fields';
import { ImagePicker } from '../../../_components/ImagePicker';
import { PageHeader } from '../../../_components/PageHeader';
import { deleteIndustry, saveIndustry } from '../../../_lib/content-actions';
import { getIndustryById, listMedia, listProducts, listPublications } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit industry' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

export default async function IndustryEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [ind, products, publications, media] = await Promise.all([isNew ? null : getIndustryById(id), listProducts(), listPublications('published'), listMedia()]);
  if (!isNew && !ind) notFound();
  const images = media.filter(m => m.mimeType.startsWith('image/'));

  return (
    <>
      <PageHeader title={ind?.name ?? 'New industry'} crumbs={[['Industries', '/admin/industries']]} />
      <div className="adm-content">
        <ActionForm
          action={saveIndustry}
          submitLabel={ind ? 'Save changes' : 'Create industry'}
          initialMessage={created ? 'Industry created.' : undefined}
          extra={
            ind && (
              <>
                {ind.published && (
                  <Link className="adm-btn secondary" href={`/industries/${ind.slug}`} target="_blank">
                    <Icon name="eye" />
                    View live
                  </Link>
                )}
                <ConfirmButton action={deleteIndustry.bind(null, ind.id)} label="Delete" confirm={`Delete ${ind.name}? Its page will be removed from the website.`} />
              </>
            )
          }
        >
          {ind && <input type="hidden" name="id" value={ind.id} />}
          <div className="adm-grid main-side">
            <div className="adm-grid">
              <section className="adm-card adm-fields cols-2">
                <TextField name="name" label="Name" required defaultValue={ind?.name} />
                <TextField name="short" label="Short label" defaultValue={ind?.short} placeholder="e.g. Upstream, midstream & offshore" />
                <TextField name="title" label="Page headline" required defaultValue={ind?.title} full />
                <TextAreaField name="lede" label="Introduction" required rows={4} defaultValue={ind?.lede} full />
                <TextAreaField name="summary" label="Card summary" required rows={2} defaultValue={ind?.summary} hint="Shown on the home page and in the menu." full />
              </section>
              <section className="adm-card adm-fields">
                <CapabilitiesEditor name="capabilities" defaultValue={ind?.capabilities} />
              </section>
              <section className="adm-card adm-fields">
                <CheckboxGroupField name="solutions" label="Solutions shown on this page" options={products.map(p => ({ value: p.slug, label: p.name }))} defaultValue={ind?.solutions} />
                <CheckboxGroupField name="articles" label="Related reading" options={publications.map(p => ({ value: p.slug, label: p.title }))} defaultValue={ind?.articles} />
                <LinesField name="clients" label="Selected clients" rows={6} defaultValue={ind?.clients} />
              </section>
            </div>
            <div className="adm-grid">
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">Publishing</h2>
                <CheckboxField name="published" label="Show on the website" defaultChecked={ind?.published ?? true} />
                <TextField name="sortOrder" type="number" label="Order" defaultValue={ind?.sortOrder ?? 0} hint="Lower numbers appear first." />
                <TextField name="slug" label="URL slug" defaultValue={ind?.slug} hint="Leave blank to generate it from the name." />
                <SelectField name="icon" label="Icon" defaultValue={ind?.icon ?? 'building'} options={ICON_NAMES.map(n => ({ value: n, label: n }))} />
              </section>
              <section className="adm-card adm-fields">
                <ImagePicker name="image" label="Image" defaultValue={ind?.image ?? 'hero'} images={images} />
              </section>
            </div>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
