'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { generatePassword, hashPassword, passwordProblem } from '@/lib/auth/password';
import { requireDb } from '@/lib/supabase';
import { fail, fromDb, fromZod, ok, str } from './form';
import type { ActionState } from './state';

const userSchema = z.object({
  email: z.email('Enter a valid email').max(200),
  name: z.string().trim().min(1, 'Required').max(100),
  role: z.enum(['admin', 'editor']),
});

async function adminCount() {
  const { count } = await requireDb().from('users').select('*', { count: 'exact', head: true }).eq('role', 'admin');
  return count ?? 0;
}

export async function createUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser('admin');
  const parsed = userSchema.safeParse({ email: str(fd, 'email').toLowerCase(), name: str(fd, 'name'), role: str(fd, 'role') });
  if (!parsed.success) return fromZod(parsed.error);

  const typed = String(fd.get('password') ?? '');
  const password = typed || generatePassword();
  const problem = passwordProblem(password);
  if (problem) return fail(problem, { password: problem });

  const { error } = await requireDb()
    .from('users')
    .insert({ ...parsed.data, password_hash: await hashPassword(password) });
  if (error) return fromDb(error, 'user');
  revalidatePath('/admin/users');
  return ok(
    typed
      ? `${parsed.data.email} can now sign in with the password you set.`
      : `Account created. Temporary password for ${parsed.data.email}: ${password}. Copy it now; it will not be shown again.`,
  );
}

export async function updateUser(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireUser('admin');
  const id = str(fd, 'id');
  const parsed = userSchema.safeParse({ email: str(fd, 'email').toLowerCase(), name: str(fd, 'name'), role: str(fd, 'role') });
  if (!parsed.success) return fromZod(parsed.error);

  const db = requireDb();
  const { data: existing } = await db.from('users').select('role, session_version').eq('id', id).single();
  if (!existing) return fail('User not found.');
  if (existing.role === 'admin' && parsed.data.role !== 'admin' && (await adminCount()) <= 1) {
    return fail('This is the only admin. Make someone else an admin first.', { role: 'Last admin' });
  }

  const update: Record<string, unknown> = { ...parsed.data };
  // a role change takes effect immediately: sign the user out everywhere
  if (existing.role !== parsed.data.role) update.session_version = existing.session_version + 1;

  const newPassword = String(fd.get('newPassword') ?? '');
  if (newPassword) {
    const problem = passwordProblem(newPassword);
    if (problem) return fail(problem, { newPassword: problem });
    update.password_hash = await hashPassword(newPassword);
    update.session_version = existing.session_version + 1;
  }

  const { error } = await db.from('users').update(update).eq('id', id);
  if (error) return fromDb(error, 'user');
  revalidatePath('/admin/users');
  if (id === me.id && update.session_version) redirect('/admin/login');
  return ok(newPassword ? 'User updated and password reset. They have been signed out everywhere.' : 'User updated.');
}

export async function revokeSessions(id: string) {
  const me = await requireUser('admin');
  const db = requireDb();
  const { data } = await db.from('users').select('session_version').eq('id', id).single();
  if (!data) return;
  await db.from('users').update({ session_version: data.session_version + 1 }).eq('id', id);
  revalidatePath('/admin/users');
  if (id === me.id) redirect('/admin/login');
}

/** For a user who lost their phone: removes their authenticator and signs them out. They set it up again at next sign-in. */
export async function resetUserTwoFactor(id: string) {
  const me = await requireUser('admin');
  const db = requireDb();
  const { data } = await db.from('users').select('session_version').eq('id', id).single();
  if (!data) return;
  const { error } = await db
    .from('users')
    .update({ totp_secret: null, totp_enabled_at: null, totp_last_step: 0, backup_codes: [], session_version: data.session_version + 1 })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
  if (id === me.id) redirect('/admin/login?reset=2fa');
}

export async function deleteUser(id: string) {
  const me = await requireUser('admin');
  if (id === me.id) throw new Error('You cannot delete your own account.');
  const db = requireDb();
  const { data } = await db.from('users').select('role').eq('id', id).single();
  if (data?.role === 'admin' && (await adminCount()) <= 1) throw new Error('You cannot delete the only admin.');
  const { error } = await db.from('users').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/users');
  redirect('/admin/users?deleted=1');
}
