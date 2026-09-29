import type { Metadata } from 'next';
import { requireUser } from '@/lib/auth';
import { ActionForm } from '../../_components/ActionForm';
import { TextField } from '../../_components/fields';
import { PageHeader } from '../../_components/PageHeader';
import { regenerateBackupCodesAction, resetOwnTwoFactorAction, updateAccountAction } from '../../_lib/auth-actions';

export const metadata: Metadata = { title: 'My account' };

export default async function AccountPage() {
  const user = await requireUser();
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
      </div>
    </>
  );
}
