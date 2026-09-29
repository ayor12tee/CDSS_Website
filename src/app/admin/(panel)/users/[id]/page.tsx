import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { ActionForm } from '../../../_components/ActionForm';
import { ConfirmButton } from '../../../_components/buttons';
import { SelectField, TextField } from '../../../_components/fields';
import { PageHeader } from '../../../_components/PageHeader';
import { getUserById } from '../../../_lib/queries';
import { deleteUser, resetUserTwoFactor, revokeSessions, updateUser } from '../../../_lib/user-actions';

export const metadata: Metadata = { title: 'Manage user' };

export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireUser('admin');
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  const u = await getUserById(id);
  if (!u) notFound();
  const isMe = u.id === me.id;

  return (
    <>
      <PageHeader title={u.name || u.email} crumbs={[['Users', '/admin/users']]} />
      <div className="adm-content" style={{ maxWidth: 860 }}>
        <ActionForm
          action={updateUser}
          extra={
            <>
              <ConfirmButton
                action={revokeSessions.bind(null, u.id)}
                label="Sign out everywhere"
                icon="logout"
                variant="secondary"
                confirm={isMe ? 'Sign yourself out on every device, including this one?' : `Sign ${u.email} out on every device?`}
              />
              {u.twoFactorEnabledAt && (
                <ConfirmButton
                  action={resetUserTwoFactor.bind(null, u.id)}
                  label="Reset two-factor"
                  icon="lock"
                  variant="secondary"
                  confirm={`Remove ${isMe ? 'your' : `${u.email}'s`} authenticator app? They will be signed out and must set it up again at next sign-in.`}
                />
              )}
              {!isMe && <ConfirmButton action={deleteUser.bind(null, u.id)} label="Delete user" confirm={`Delete ${u.email}? They will lose access immediately.`} />}
            </>
          }
        >
          <input type="hidden" name="id" value={u.id} />
          <section className="adm-card adm-fields cols-2">
            <TextField name="name" label="Full name" required defaultValue={u.name} />
            <TextField name="email" type="email" label="Email" required defaultValue={u.email} />
            <SelectField
              name="role"
              label="Role"
              defaultValue={u.role}
              options={[
                { value: 'editor', label: 'Editor: content, media and enquiries' },
                { value: 'admin', label: 'Admin: also settings and users' },
              ]}
              hint="Changing the role signs the user out so it takes effect immediately."
            />
            <TextField name="newPassword" type="password" label="Reset password" autoComplete="new-password" hint="Leave blank to keep the current password. At least 12 characters, with letters and numbers." />
          </section>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Created {new Date(u.createdAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}. Last sign-in:{' '}
            {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'never'}. Two-factor:{' '}
            {u.twoFactorEnabledAt
              ? `on since ${new Date(u.twoFactorEnabledAt).toLocaleDateString('en-GB', { dateStyle: 'medium' })}, ${u.backupCodesLeft} backup codes left`
              : 'not set up yet (they set it up at next sign-in)'}
            .
          </p>
        </ActionForm>
      </div>
    </>
  );
}
