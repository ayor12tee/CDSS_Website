import type { Metadata } from 'next';
import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { Icon } from '@/components/ui/Icon';
import { ActionForm } from '../../_components/ActionForm';
import { SelectField, TextField } from '../../_components/fields';
import { FlashNotice, PageHeader } from '../../_components/PageHeader';
import { listUsers } from '../../_lib/queries';
import { createUser } from '../../_lib/user-actions';

export const metadata: Metadata = { title: 'Users' };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  const me = await requireUser('admin');
  const [users, { deleted }] = await Promise.all([listUsers(), searchParams]);

  return (
    <>
      <PageHeader title="Users" />
      <div className="adm-content" style={{ maxWidth: 1100 }}>
        <FlashNotice deleted={deleted} what="user" />
        <section className="adm-card">
          <div className="adm-card-head">
            <h2>Team members</h2>
            <span className="adm-badge">{users.length}</span>
          </div>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Two-factor</th>
                  <th>Last sign-in</th>
                  <th className="actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="title-cell">
                      <Link href={`/admin/users/${u.id}`}>
                        {u.name || u.email}
                        {u.id === me.id && ' (you)'}
                      </Link>
                      <small>{u.email}</small>
                    </td>
                    <td>
                      <span className={`adm-badge ${u.role === 'admin' ? 'brand' : ''}`}>{u.role}</span>
                    </td>
                    <td>
                      {u.twoFactorEnabledAt ? (
                        <span className="adm-badge ok">On</span>
                      ) : (
                        <span className="adm-badge warn" title="Sets up the authenticator app at next sign-in">
                          Pending set-up
                        </span>
                      )}
                    </td>
                    <td>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : 'Never'}</td>
                    <td className="actions">
                      <Link className="adm-btn secondary sm" href={`/admin/users/${u.id}`}>
                        <Icon name="edit" />
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="adm-card">
          <h2>Add a team member</h2>
          <p className="sub">
            <b>Editors</b> manage content, media and enquiries. <b>Admins</b> can also change site settings and manage users.
          </p>
          <ActionForm action={createUser} compact submitLabel="Create account">
            <div className="adm-fields cols-2">
              <TextField name="name" label="Full name" required />
              <TextField name="email" type="email" label="Email" required autoComplete="off" />
              <SelectField
                name="role"
                label="Role"
                defaultValue="editor"
                options={[
                  { value: 'editor', label: 'Editor' },
                  { value: 'admin', label: 'Admin' },
                ]}
              />
              <TextField name="password" type="password" label="Password" autoComplete="new-password" hint="Optional. Leave blank to generate a temporary password to share with them." />
            </div>
          </ActionForm>
        </section>
      </div>
    </>
  );
}
