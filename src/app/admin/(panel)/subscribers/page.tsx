import type { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';
import { ConfirmButton } from '../../_components/buttons';
import { PageHeader } from '../../_components/PageHeader';
import { deleteSubscriber } from '../../_lib/inbox-actions';
import { listSubscribers } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Subscribers' };

export default async function SubscribersAdmin() {
  const subscribers = await listSubscribers();
  return (
    <>
      <PageHeader
        title={`Subscribers (${subscribers.length})`}
        actions={
          <a className="adm-btn secondary" href="/admin/api/subscribers">
            <Icon name="download" />
            Export CSV
          </a>
        }
      />
      <div className="adm-content" style={{ maxWidth: 960 }}>
        <section className="adm-card">
          <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
            People who signed up to the newsletter on the website. Export the list to import it into your email marketing tool.
          </p>
          {subscribers.length === 0 ? (
            <div className="adm-empty">
              <h3>No subscribers yet</h3>
            </div>
          ) : (
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Signed up</th>
                    <th className="actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(s => (
                    <tr key={s.id}>
                      <td>
                        <a className="adm-link" href={`mailto:${s.email}`}>
                          {s.email}
                        </a>
                      </td>
                      <td>{new Date(s.created_at).toLocaleDateString('en-GB', { dateStyle: 'medium' })}</td>
                      <td className="actions">
                        <ConfirmButton action={deleteSubscriber.bind(null, s.id)} label="Remove" size="sm" confirm={`Remove ${s.email} from the list?`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
