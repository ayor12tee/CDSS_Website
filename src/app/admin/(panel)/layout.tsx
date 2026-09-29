import Link from 'next/link';
import { requireUser } from '@/lib/auth';
import { Icon } from '@/components/ui/Icon';
import { AdminShell } from '../_components/AdminNav';
import { SetupNotice, setupProblems } from '../_components/SetupNotice';
import { logoutAction } from '../_lib/auth-actions';
import { unreadCount } from '../_lib/queries';

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const problems = setupProblems();
  if (problems.length) return <SetupNotice problems={problems} />;

  const user = await requireUser();
  const unread = await unreadCount();
  const initials = (user.name || user.email)
    .split(/\s+/)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminShell
      role={user.role}
      unread={unread}
      footer={
        <>
          <div className="adm-user">
            <span className="adm-avatar">{initials}</span>
            <span>
              <strong>{user.name || user.email}</strong>
              <small>{user.role}</small>
            </span>
          </div>
          <Link className="adm-btn ghost" href="/" target="_blank">
            <Icon name="external" />
            View website
          </Link>
          <form action={logoutAction}>
            <button className="adm-btn ghost" type="submit" style={{ width: '100%', justifyContent: 'flex-start' }}>
              <Icon name="logout" />
              Sign out
            </button>
          </form>
        </>
      }
    >
      {children}
    </AdminShell>
  );
}
