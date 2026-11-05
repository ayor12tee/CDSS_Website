import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isoToLagos } from '@/lib/webinars';
import { FREQUENCIES, OCCASIONS, SHOW_ON } from '@/lib/popups';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { CheckboxField, SelectField, TextAreaField, TextField } from '../../../_components/fields';
import { ImagePicker } from '../../../_components/ImagePicker';
import { PageHeader } from '../../../_components/PageHeader';
import { PopupPreview } from '../../../_components/PopupPreview';
import { deletePopup, savePopup } from '../../../_lib/popup-actions';
import { getPopupById } from '../../../_lib/popup-queries';
import { listMedia } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Edit pop-up' };

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> };

const DAY = 24 * 60 * 60 * 1000;

export default async function PopupEditor({ params, searchParams }: Props) {
  const [{ id }, { created }] = await Promise.all([params, searchParams]);
  const isNew = id === 'new';
  if (!isNew && !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [p, media] = await Promise.all([isNew ? null : getPopupById(id), listMedia()]);
  if (!isNew && !p) notFound();

  const images = media.filter(m => m.mimeType.startsWith('image/')).map(m => ({ url: m.url, filename: m.filename }));
  // a new pop-up starts today and runs for a week
  const today = new Date();
  const start = p ? isoToLagos(p.startsAt) : { date: isoToLagos(today.toISOString()).date, time: '00:00' };
  const end = p ? isoToLagos(p.endsAt) : { date: isoToLagos(new Date(today.getTime() + 7 * DAY).toISOString()).date, time: '23:59' };

  return (
    <>
      <PageHeader title={p ? p.title : 'New pop-up'} crumbs={[['Pop-ups', '/admin/popups']]} />
      <div className="adm-content">
        <ActionForm
          action={savePopup}
          submitLabel={p ? 'Save changes' : 'Create pop-up'}
          initialMessage={created ? 'Pop-up created.' : undefined}
          extra={
            p && (
              <>
                <PopupPreview popup={p} label="Preview saved version" />
                <ConfirmButton action={deletePopup.bind(null, p.id)} label="Delete" confirm={`Delete this pop-up? “${p.title}” will be removed and stop showing on the site.`} />
              </>
            )
          }
        >
          {p && <input type="hidden" name="id" value={p.id} />}
          <div className="adm-grid main-side">
            <div className="adm-grid">
              <section className="adm-card adm-fields">
                <SelectField
                  name="occasion"
                  label="Occasion"
                  defaultValue={p?.occasion ?? 'announcement'}
                  options={Object.entries(OCCASIONS).map(([value, o]) => ({ value, label: o.label }))}
                  hint={'Sets the colours, icon and small heading, such as “Ramadan Kareem” or “Season’s greetings”. Use Announcement for news, office closures or events.'}
                  full
                />
                <TextField name="title" label="Title" required defaultValue={p?.title} maxLength={120} placeholder="Merry Christmas and a happy New Year" full />
                <TextAreaField
                  name="message"
                  label="Message"
                  rows={5}
                  defaultValue={p?.message}
                  maxLength={800}
                  hint="Keep it short. Leave a blank line between paragraphs."
                  full
                />
              </section>
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">Button (optional)</h2>
                <TextField name="ctaLabel" label="Button text" defaultValue={p?.ctaLabel} maxLength={40} placeholder="Read the announcement" />
                <TextField
                  name="ctaUrl"
                  label="Button link"
                  defaultValue={p?.ctaUrl}
                  placeholder="/contact or https://…"
                  hint="A page on this site (starting with /) or a full https:// link. Leave both blank for no button."
                />
              </section>
              <section className="adm-card adm-fields">
                <ImagePicker
                  name="image"
                  label="Image (optional)"
                  defaultValue={p?.image}
                  images={images}
                  optional
                  illustrations={false}
                  hint="Optional. Replaces the coloured banner at the top, e.g. a seasonal greeting card. A landscape image about 1200 × 600 px works best."
                />
              </section>
            </div>

            <div className="adm-grid">
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">When (Lagos time)</h2>
                <TextField name="startDate" type="date" label="Starts on" required defaultValue={start.date} />
                <TextField name="startTime" type="time" label="Start time" required defaultValue={start.time} />
                <TextField name="endDate" type="date" label="Ends on" required defaultValue={end.date} />
                <TextField name="endTime" type="time" label="End time" required defaultValue={end.time} hint="The pop-up switches itself on and off at these times." />
              </section>
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">Display</h2>
                <SelectField
                  name="frequency"
                  label="How often a visitor sees it"
                  defaultValue={p?.frequency ?? 'once'}
                  options={Object.entries(FREQUENCIES).map(([value, f]) => ({ value, label: f.label }))}
                  hint={Object.values(FREQUENCIES)
                    .map(f => `${f.label}: ${f.hint}`)
                    .join(' ')}
                />
                <SelectField name="showOn" label="Show on" defaultValue={p?.showOn ?? 'all'} options={Object.entries(SHOW_ON).map(([value, label]) => ({ value, label }))} />
                <CheckboxField name="published" label="Turned on" hint="Untick to stop it showing without deleting it." defaultChecked={p?.published ?? true} />
              </section>
            </div>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
