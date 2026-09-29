import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Icon } from '@/components/ui/Icon';
import { requireDb } from '@/lib/supabase';
import { ConfirmButton } from '../../../_components/buttons';
import { PageHeader } from '../../../_components/PageHeader';
import { deleteSubmission, setSubmissionRead } from '../../../_lib/inbox-actions';
import { getSubmission } from '../../../_lib/queries';

export const metadata: Metadata = { title: 'Message' };

const LABELS: Record<string, string> = { name: 'Name', email: 'Email', phone: 'Phone', company: 'Company', enquiry: 'Enquiry', product: 'Product of interest', message: 'Message', consent: 'Consent to contact' };

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  let s = await getSubmission(id);
  if (!s) notFound();
  // opening a message marks it as read (a plain update: revalidation is not allowed during render)
  if (!s.isRead) {
    await requireDb().from('submissions').update({ is_read: true }).eq('id', s.id);
    s = { ...s, isRead: true };
  }

  const subject = s.kind === 'newsletter' ? 'Newsletter subscription' : `Re: your enquiry to CDSS${s.fields.enquiry ? ` (${s.fields.enquiry})` : ''}`;
  const entries = Object.entries(s.fields).filter(([k, v]) => v && k !== 'website');

  return (
    <>
      <PageHeader
        title={s.name || s.email}
        crumbs={[['Inbox', '/admin/inbox']]}
        actions={
          <>
            <a className="adm-btn primary" href={`mailto:${s.email}?subject=${encodeURIComponent(subject)}`}>
              <Icon name="mail" />
              Reply by email
            </a>
            <form action={setSubmissionRead.bind(null, s.id, false)}>
              <button className="adm-btn secondary" type="submit">
                Mark as unread
              </button>
            </form>
            <ConfirmButton action={deleteSubmission.bind(null, s.id)} label="Delete" confirm="Delete this message permanently?" />
          </>
        }
      />
      <div className="adm-content" style={{ maxWidth: 900 }}>
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>{s.kind === 'newsletter' ? 'Newsletter sign-up' : 'Contact form enquiry'}</h2>
            <span style={{ color: 'var(--muted)', fontSize: 13.5 }}>{new Date(s.createdAt).toLocaleString('en-GB', { dateStyle: 'full', timeStyle: 'short' })}</span>
          </div>
          <dl className="adm-dl">
            {entries.map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}>
                <dt>{LABELS[k] ?? k}</dt>
                <dd>{k === 'email' ? <a className="adm-link" href={`mailto:${v}`}>{v}</a> : k === 'consent' ? 'Yes' : v}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  );
}
