import Link from 'next/link';
import type { MediaItem, Product, Webinar } from '@/lib/types';
import { isoToLagos } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';
import { ActionForm } from '../../_components/ActionForm';
import { ConfirmButton } from '../../_components/buttons';
import { CheckboxField, CheckboxGroupField, LinesField, TextAreaField, TextField } from '../../_components/fields';
import { MarkdownEditor } from '../../_components/MarkdownEditor';
import { deleteWebinar, saveWebinar } from '../../_lib/content-actions';

interface Props {
  webinar?: Webinar;
  products: Product[];
  media: MediaItem[];
  created?: boolean;
}

export function WebinarForm({ webinar: w, products, media, created }: Props) {
  const images = media.filter(m => m.mimeType.startsWith('image/'));
  const start = w ? isoToLagos(w.startsAt) : { date: '', time: '14:00' };

  return (
    <ActionForm
      action={saveWebinar}
      submitLabel={w ? 'Save changes' : 'Create webinar'}
      initialMessage={created ? 'Webinar created.' : undefined}
      extra={
        w && (
          <>
            {w.published && (
              <Link className="adm-btn secondary" href={`/webinars/${w.slug}`} target="_blank">
                <Icon name="eye" />
                View live
              </Link>
            )}
            <ConfirmButton action={deleteWebinar.bind(null, w.id)} label="Delete" confirm={`Delete “${w.title}”? This cannot be undone.`} />
          </>
        )
      }
    >
      {w && <input type="hidden" name="id" value={w.id} />}
      <div className="adm-grid main-side">
        <div className="adm-grid">
          <section className="adm-card adm-fields">
            <TextField name="title" label="Title" required defaultValue={w?.title} maxLength={200} full />
            <TextAreaField
              name="summary"
              label="Summary"
              required
              rows={3}
              defaultValue={w?.summary}
              maxLength={400}
              hint="One or two sentences. Shown on the webinar cards and in search results."
              full
            />
          </section>
          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">Links</h2>
            <TextField
              name="registrationUrl"
              type="url"
              label="Microsoft Teams registration link"
              defaultValue={w?.registrationUrl}
              placeholder="https://events.teams.microsoft.com/event/…"
              hint="In Teams, open the webinar's details and copy the registration page link. Leave blank until registration opens."
              full
            />
            <TextField
              name="recordingUrl"
              type="url"
              label="YouTube recording link"
              defaultValue={w?.recordingUrl}
              placeholder="https://youtu.be/…"
              hint="Add this after the session. Unlisted YouTube videos work; private ones don't. The recording plays on the webinar page."
              full
            />
          </section>
          <section className="adm-card adm-fields">
            <MarkdownEditor name="description" defaultValue={w?.description} images={images.map(m => ({ url: m.url, filename: m.filename, alt: m.alt }))} />
          </section>
        </div>

        <div className="adm-grid">
          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">When</h2>
            <TextField name="date" type="date" label="Date" required defaultValue={start.date} />
            <TextField name="time" type="time" label="Start time (Lagos, WAT)" required defaultValue={start.time} />
            <TextField name="durationMinutes" type="number" label="Duration (minutes)" required defaultValue={w?.durationMinutes ?? 60} />
            <CheckboxField name="published" label="Show on the website" hint="Untick to hide this webinar while you prepare it." defaultChecked={w?.published ?? true} />
          </section>

          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">Details</h2>
            <LinesField name="speakers" label="Speakers" rows={3} defaultValue={w?.speakers} placeholder="Jane Doe, BIM Manager" hint="One per line: name, then role." />
            <TextField name="slug" label="URL slug" defaultValue={w?.slug} placeholder="generated-from-the-title" hint="Leave blank to generate it from the title. Changing it breaks existing links." />
            <CheckboxGroupField name="products" label="Products covered" options={products.map(p => ({ value: p.slug, label: p.name }))} defaultValue={w?.products} />
          </section>
        </div>
      </div>
    </ActionForm>
  );
}
