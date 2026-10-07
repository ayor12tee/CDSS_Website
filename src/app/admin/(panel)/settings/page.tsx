import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ActionForm } from '../../_components/ActionForm';
import { CheckboxField, LinesField, TextAreaField, TextField } from '../../_components/fields';
import { PageHeader } from '../../_components/PageHeader';
import { saveSettings } from '../../_lib/content-actions';
import { getAdminSettings } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Site settings' };

export default async function SettingsPage() {
  await requireUser('admin');
  const s = await getAdminSettings();

  return (
    <>
      <PageHeader title="Site settings" />
      <div className="adm-content" style={{ maxWidth: 1000 }}>
        <ActionForm action={saveSettings} submitLabel="Save settings">
          <section className="adm-card adm-fields cols-2">
            <h2 className="adm-section-title adm-field full">Company details</h2>
            <TextField name="companyName" label="Short name" required defaultValue={s.company.name} />
            <TextField name="companyLegal" label="Registered name" required defaultValue={s.company.legal} />
            <TextField name="companyEmail" type="email" label="Public email" required defaultValue={s.company.email} hint="Shown on the site. The forms' email-app fallback also uses it." />
            <TextField name="companyLocation" label="Location (short)" required defaultValue={s.company.locationShort} hint="Shown in the top bar, e.g. Gbagada, Lagos" />
            <LinesField name="companyPhones" label="Phone numbers" rows={3} defaultValue={s.company.phones} hint="One per line. The first is used for “Call” buttons." />
            <TextAreaField name="companyAddress" label="Address" required rows={3} defaultValue={s.company.address} />
            <TextField name="companyPoBox" label="Postal address" defaultValue={s.company.poBox} full />
          </section>

          <section className="adm-card adm-fields cols-2">
            <h2 className="adm-section-title adm-field full">Home page hero</h2>
            <TextField name="heroTitleLead" label="Headline" required defaultValue={s.hero.titleLead} />
            <TextField name="heroTitleAccent" label="Highlighted last words" required defaultValue={s.hero.titleAccent} hint="Shown in the chrome gradient." />
            <TextAreaField name="heroSubtitle" label="Introduction" required rows={3} defaultValue={s.hero.subtitle} full />
          </section>

          <section className="adm-card adm-fields cols-2">
            <h2 className="adm-section-title adm-field full">Announcement</h2>
            <div className="adm-field full">
              <CheckboxField name="announcementEnabled" label="Show the announcement" hint="Appears in the top bar of every page." defaultChecked={s.announcement.enabled} />
            </div>
            <TextField name="announcementText" label="Text" defaultValue={s.announcement.text} />
            <TextField name="announcementLabel" label="Badge" defaultValue={s.announcement.label} hint="Short, e.g. a year or “New”." />
            <TextField name="announcementHref" label="Link" defaultValue={s.announcement.href} hint="A page on this site (e.g. /publications/…) or a full URL." full />
          </section>

          <section className="adm-card adm-fields">
            <h2 className="adm-section-title">Other product lines</h2>
            <LinesField name="otherLines" label="Also available" rows={6} defaultValue={s.otherLines} hint="One per line. Listed on the Solutions page and in the contact form." />
          </section>
        </ActionForm>
      </div>
    </>
  );
}
