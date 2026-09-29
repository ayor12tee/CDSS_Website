import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getDb } from '@/lib/supabase';
import { toAdminUser, USER_COLUMNS } from '@/lib/mappers';
import type { AdminUser, Role } from '@/lib/types';
import { SESSION_COOKIE, verifySession } from './session';

/**
 * The signed-in admin user, or null. Verifies the cookie signature AND re-checks the user in the
 * database on every request, so deleted users and revoked sessions (session_version bump) lose access immediately.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const claims = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!claims) return null;
  const db = getDb();
  if (!db) return null;
  const { data } = await db.from('users').select(USER_COLUMNS).eq('id', claims.sub).maybeSingle();
  if (!data || data.session_version !== claims.v) return null;
  return toAdminUser(data);
});

/** Use at the top of every admin page and server action. Redirects to the login page when signed out. */
export async function requireUser(role?: Role): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (role === 'admin' && user.role !== 'admin') redirect('/admin?error=forbidden');
  return user;
}
