import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getDb } from '@/lib/supabase';
import { toAdminUser, USER_COLUMNS } from '@/lib/mappers';
import type { AdminUser, Role } from '@/lib/types';
import { SESSION_COOKIE, verifySession } from './session';

/** Verified claims from this browser's session cookie (signature only; getCurrentUser also checks the database). */
export const getSessionClaims = cache(async () => verifySession((await cookies()).get(SESSION_COOKIE)?.value));

/**
 * The signed-in admin user, or null. Verifies the cookie signature AND re-checks the database on every
 * request: the user must exist, its session_version must match (bumped to revoke everything), and this
 * browser's sessions row must still exist (deleted on sign-out). Fails closed if the sessions table is missing.
 */
export const getCurrentUser = cache(async (): Promise<AdminUser | null> => {
  const claims = await getSessionClaims();
  if (!claims) return null;
  const db = getDb();
  if (!db) return null;
  const [{ data }, { data: session }] = await Promise.all([
    db.from('users').select(USER_COLUMNS).eq('id', claims.sub).maybeSingle(),
    db.from('sessions').select('id').eq('id', claims.sid).eq('user_id', claims.sub).gt('expires_at', new Date().toISOString()).maybeSingle(),
  ]);
  if (!data || !session || data.session_version !== claims.v) return null;
  return toAdminUser(data);
});

/** Use at the top of every admin page and server action. Redirects to the login page when signed out. */
export async function requireUser(role?: Role): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  if (role === 'admin' && user.role !== 'admin') redirect('/admin?error=forbidden');
  return user;
}
