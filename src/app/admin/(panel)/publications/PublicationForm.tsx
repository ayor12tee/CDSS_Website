import Link from 'next/link';
import type { MediaItem, Product, Publication } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { ActionForm } from '../../_components/ActionForm';
import { ConfirmButton } from '../../_components/buttons';
import { CheckboxField, CheckboxGroupField, SelectField, TextAreaField, TextField } from '../../_components/fields';
import { ImagePicker } from '../../_components/ImagePicker';
import { MarkdownEditor } from '../../_components/MarkdownEditor';
import { deletePublication, savePublication } from '../../_lib/content-actions';

interface Props {
  publication?: Publication;
  products: Product[];
  media: MediaItem[];
  created?: boolean;
}

export function PublicationForm({ publication: p, products, media, created }: Props) {
  const images = media.filter(m => m.mimeType.startsWith('image/'));
  const today = new Date().toISOString().slice(0, 10);

  return (
    <ActionForm
      action={savePublication}
      submitLabel={p ? 'Save changes' : 'Create publication'}
      initialMessage={created ? 'Publication created.' : undefined}
      extra={
        p && (
          <>
            {p.status === 'published' && (
              <Link className="adm-btn secondary" href={`/publications/${p.slug}`} target="_blank">
                <Icon name="eye" />
                View live
              </Link>
            )}
            <ConfirmButton action={deletePublication.bind(null, p.id)} label="Delete" confirm={`Delete “${p.title}”? This cannot be undone.`} />
          </>
        )
      }
    >
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="adm-grid main-side">
        <div className="adm-grid">
          <section className="adm-card adm-fields">
            <TextField name="title" label="Title" required defaultValue={p?.title} maxLength={200} full />
            <TextAreaField
              name="excerpt"
              label="Summary"
              required
              rows={3}
              defaultValue={p?.excerpt}
              maxLength={400}
              hint="One or two sentences. Shown on cards, in search results and when the article is shared."
              full
            />
          </section>
          <section className="adm-card adm-fields">
            <MarkdownEditor name="body" defaultValue={p?.body} images={images.map(m => ({ url: m.url, filename: m.filename, alt: m.alt }))} />
          </section>
        </div>

        <div className="adm-grid">
          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">Publishing</h2>
            <SelectField
              name="status"
              label="Status"
              defaultValue={p?.status ?? 'draft'}
              options={[
                { value: 'draft', label: 'Draft (hidden from the website)' },
                { value: 'published', label: 'Published' },
              ]}
            />
            <SelectField name="category" label="Category" defaultValue={p?.category ?? 'insights'} options={Object.entries(CATEGORIES).map(([value, c]) => ({ value, label: c.label }))} />
            <TextField name="publishedOn" type="date" label="Publication date" required defaultValue={p?.publishedOn ?? today} />
            <CheckboxField name="featured" label="Feature on the Publications page" hint="Replaces the currently featured article." defaultChecked={p?.featured} />
          </section>

          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">Details</h2>
            <TextField name="slug" label="URL slug" defaultValue={p?.slug} placeholder="generated-from-the-title" hint="Leave blank to generate it from the title. Changing it breaks existing links." />
            <TextField name="tags" label="Tags" defaultValue={p?.tags.join(', ')} hint="Comma-separated, e.g. BIM, Autodesk, Training" />
            <CheckboxGroupField name="products" label="Related products" options={products.map(pr => ({ value: pr.slug, label: pr.name }))} defaultValue={p?.products} hint="The article is suggested on these product pages." />
          </section>

          <section className="adm-card adm-fields">
            <ImagePicker name="cover" label="Cover image" defaultValue={p?.cover ?? 'hero'} images={images} />
          </section>
        </div>
      </div>
    </ActionForm>
  );
}
