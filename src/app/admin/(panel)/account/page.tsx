import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ActionForm } from '../../_components/ActionForm';
import { ConfirmButton } from '../../_components/buttons';
import { TextField } from '../../_components/fields';
import { PageHeader } from '../../_components/PageHeader';
import { endSessionAction, regenerateBackupCodesAction, resetOwnTwoFactorAction, signOutEverywhereAction, updateAccountAction } from '../../_lib/auth-actions';
import { listMySessions } from '../../_lib/queries';

export const metadata: Metadata = { title: 'My account' };

/** "Chrome on Windows" from a user-agent string; good enough to recognise your own devices. */
function describeDevice(ua: string) {
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : 'Browser';
  const os = /iPhone|iPad/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : 'unknown device';
  return `${browser} on ${os}`;
}

export default async function AccountPage() {
  const [user, sessions] = await Promise.all([requireUser(), listMySessions()]);
  return (
    <>
      <PageHeader title="My account" />
      <div className="adm-content" style={{ maxWidth: 760 }}>
        <ActionForm action={updateAccountAction}>
          <section className="adm-card adm-fields cols-2">
            <h2 className="adm-section-title adm-field full">Profile</h2>
            <TextField name="name" label="Full name" required defaultValue={user.name} />
            <div className="adm-field">
              <span className="label">Email</span>
              <input type="email" value={user.email} disabled readOnly />
              <span className="hint">Ask an admin to change your email.</span>
            </div>
          </section>
          <section className="adm-card adm-fields cols-2">
            <h2 className="adm-section-title adm-field full">Change password</h2>
            <TextField name="currentPassword" type="password" label="Current password" autoComplete="current-password" full />
            <TextField name="newPassword" type="password" label="New password" autoComplete="new-password" hint="At least 12 characters, with letters and numbers." />
            <TextField name="confirmPassword" type="password" label="Confirm new password" autoComplete="new-password" />
          </section>
        </ActionForm>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Two-factor authentication</h2>
            <span className="adm-badge ok">On</span>
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: 18 }}>
            You sign in with your password and a code from your authenticator app
            {user.twoFactorEnabledAt ? `, set up on ${new Date(user.twoFactorEnabledAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}` : ''}. You have{' '}
            <b>{user.backupCodesLeft}</b> unused backup code{user.backupCodesLeft === 1 ? '' : 's'}.
          </p>

          <div className="adm-grid cols-2">
            <div>
              <h3 style={{ fontSize: 15, marginBottom: 6 }}>New backup codes</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 12 }}>Creates 10 new codes. Your old codes stop working.</p>
              <ActionForm action={regenerateBackupCodesAction} compact submitLabel="Create new codes">
                <TextField name="password" type="password" label="Confirm your password" autoComplete="current-password" />
              </ActionForm>
            </div>
            <div>
              <h3 style={{ fontSize: 15, marginBottom: 6 }}>Moving to a new phone</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 12 }}>
                Removes your current authenticator and signs you out. You will scan a new QR code at your next sign-in.
              </p>
              <ActionForm action={resetOwnTwoFactorAction} compact submitLabel="Reset authenticator">
                <TextField name="resetPassword" type="password" label="Confirm your password" autoComplete="current-password" />
              </ActionForm>
            </div>
          </div>
        </section>

        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Signed-in devices</h2>
            <ConfirmButton
              action={signOutEverywhereAction}
              label="Sign out everywhere"
              icon="logout"
              variant="secondary"
              size="sm"
              confirm="Sign out on every device? You will need to sign in again here too."
            />
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: 14, fontSize: 13.5 }}>
            Each browser you sign in from appears here until it signs out or its session expires after 7 days. If you don&apos;t recognise one, end it and
            change your password.
          </p>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Device</th>
                  <th>Signed in</th>
                  <th>IP address</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(s => (
                  <tr key={s.id}>
                    <td className="title-cell">
                      {describeDevice(s.userAgent)}
                      {s.current && <span className="adm-badge ok" style={{ marginLeft: 8 }}>This device</span>}
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(s.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Africa/Lagos' })}</td>
                    <td>{s.ip || '—'}</td>
                    <td className="actions">
                      {!s.current && (
                        <ConfirmButton action={endSessionAction.bind(null, s.id)} label="Sign out" icon="logout" size="sm" confirm={`Sign out ${describeDevice(s.userAgent)}? It will need to sign in again.`} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}
