import type { Metadata } from 'next';
import Link from 'next/link';
import { PLATFORMS } from '@/lib/webinars';
import { ActionForm } from '../../../_components/ActionForm';
import { CheckboxField, SelectField, TextAreaField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { importWebinars } from '../../../_lib/content-actions';

export const metadata: Metadata = { title: 'Import past webinars' };

const EXAMPLE = `17/09/2026  https://youtu.be/abc123def45
08/10/2026  https://www.youtube.com/watch?v=xyz987uvw65 | Digitising drawing archives`;

export default function ImportWebinars() {
  return (
    <>
      <PageHeader title="Import past webinars" crumbs={[['Webinars', '/admin/webinars']]} />
      <div className="adm-content">
        <ActionForm action={importWebinars} submitLabel="Import webinars">
          <div className="adm-grid main-side">
            <section className="adm-card adm-fields">
              <TextAreaField
                name="lines"
                label="Webinars to import"
                required
                rows={12}
                placeholder={EXAMPLE}
                hint="One webinar per line: the date it ran and its YouTube link. Add a title after a | to use your own; otherwise the YouTube title is used. Up to 50 at a time."
                full
              />
            </section>
            <div className="adm-grid">
              <section className="adm-card adm-fields">
                <h2 className="adm-section-title">Options</h2>
                <SelectField name="platform" label="Held on" defaultValue="teams" options={Object.entries(PLATFORMS).map(([value, p]) => ({ value, label: p.name }))} />
                <CheckboxField name="published" label="Show on the website straight away" hint="Untick to review them before they appear." defaultChecked />
              </section>
              <section className="adm-card">
                <h2 className="adm-section-title">How it works</h2>
                <ol style={{ display: 'grid', gap: 8, paddingLeft: 18, listStyle: 'decimal', fontSize: 14, color: 'var(--muted)' }}>
                  <li>Upload each recording to YouTube as public or unlisted (private videos can&apos;t be imported).</li>
                  <li>Paste one line per webinar and click Import.</li>
                  <li>
                    Each appears under <Link href="/admin/webinars?when=past">Past webinars</Link>. Open one to add a summary, speakers or products.
                  </li>
                </ol>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', marginTop: 12 }}>
                  Videos already on the site are skipped, so you can safely paste the same list again after fixing a line.
                </p>
              </section>
            </div>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
