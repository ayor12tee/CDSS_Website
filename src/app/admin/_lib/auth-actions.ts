'use server';

import { revalidatePath } from 'next/cache';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getSessionClaims, requireUser } from '@/lib/auth';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/auth/password';
import {
  PENDING_COOKIE,
  pendingCookieOptions,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  sessionCookieOptions,
  signPending,
  signSession,
  verifyPending,
  verifySession,
} from '@/lib/auth/session';
import { decryptSecret, encryptSecret, generateBackupCodes, hashBackupCode, matchBackupCode, verifyTotp } from '@/lib/auth/totp';
import { requireDb } from '@/lib/supabase';
import { fail, fromZod, ok, str } from './form';
import type { ActionState } from './state';

const WINDOW_MINUTES = 15;
const MAX_PER_EMAIL = 5;
const MAX_PER_IP = 20;
const MAX_CODE_ATTEMPTS = 5;
// Compared against when the email is unknown, so response time doesn't reveal which accounts exist.
const DUMMY_HASH = 'scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' + 'A'.repeat(86) + '==';

async function clientIp() {
  const h = await headers();
  return (h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown').trim();
}

/** Only allow redirects back into the admin. */
function safeNext(next: string) {
  return next.startsWith('/admin') && !next.startsWith('//') && !next.startsWith('/admin/login') ? next : '/admin';
}

async function recentFailures(key: string) {
  const since = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
  const { count } = await requireDb().from('login_attempts').select('*', { count: 'exact', head: true }).eq('key', key).gte('created_at', since);
  return count ?? 0;
}

async function recordFailure(...keys: string[]) {
  await requireDb()
    .from('login_attempts')
    .insert(keys.map(key => ({ key })));
}

/**
 * Second factor passed: record a session for this browser, issue the cookie and finish signing in.
 * Returns an error message if the session can't be recorded (e.g. the sessions migration hasn't run).
 */
async function completeSignIn(user: { id: string; session_version: number; role: 'admin' | 'editor' }): Promise<string | null> {
  const db = requireDb();
  const now = new Date();
  // tidy this user's expired sessions while we're here
  await db.from('sessions').delete().eq('user_id', user.id).lt('expires_at', now.toISOString());
  const { data: session, error } = await db
    .from('sessions')
    .insert({
      user_id: user.id,
      expires_at: new Date(now.getTime() + SESSION_TTL_SECONDS * 1000).toISOString(),
      user_agent: ((await headers()).get('user-agent') ?? '').slice(0, 300),
      ip: (await clientIp()).slice(0, 64),
    })
    .select('id')
    .single();
  if (error || !session) {
    console.error('[auth] could not create a session:', error?.message);
    return 'Sign-in is unavailable right now because the session could not be saved. If this persists, an administrator needs to run the newest database migration.';
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await signSession({ sub: user.id, v: user.session_version, role: user.role, sid: session.id }), sessionCookieOptions);
  jar.delete({ name: PENDING_COOKIE, path: '/admin' });
  await db.from('users').update({ last_login_at: now.toISOString() }).eq('id', user.id);
  return null;
}

// ---------------------------------------------------------------------------
// Step 1: email + password
// ---------------------------------------------------------------------------
export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const email = str(fd, 'email').toLowerCase();
  const password = String(fd.get('password') ?? '');
  const next = safeNext(str(fd, 'next'));
  if (!email || !password) return fail('Enter your email and password.');

  const db = requireDb();
  const ip = await clientIp();
  const [byEmail, byIp] = await Promise.all([recentFailures(`email:${email}`), recentFailures(`ip:${ip}`)]);
  if (byEmail >= MAX_PER_EMAIL || byIp >= MAX_PER_IP) return fail(`Too many failed sign-in attempts. Try again in ${WINDOW_MINUTES} minutes.`);

  const { data: user } = await db.from('users').select('id, password_hash, session_version, totp_secret').eq('email', email).maybeSingle();
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) {
    await recordFailure(`email:${email}`, `ip:${ip}`);
    return fail('Incorrect email or password.');
  }
  await db.from('login_attempts').delete().eq('key', `email:${email}`);

  const stage = user.totp_secret ? 'verify' : 'enrol';
  (await cookies()).set(PENDING_COOKIE, await signPending({ sub: user.id, v: user.session_version, stage, next }), pendingCookieOptions);
  redirect(stage === 'verify' ? '/admin/login/verify' : '/admin/login/setup');
}

export async function logoutAction() {
  const jar = await cookies();
  // end this browser's session on the server too, so a copy of the cookie stops working
  const claims = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (claims) await requireDb().from('sessions').delete().eq('id', claims.sid).eq('user_id', claims.sub);
  jar.delete(SESSION_COOKIE);
  jar.delete({ name: PENDING_COOKIE, path: '/admin' });
  redirect('/admin/login');
}

/** Pending sign-in from the cookie, re-checked against the database. */
async function pendingUser(stage: 'enrol' | 'verify') {
  const claims = await verifyPending((await cookies()).get(PENDING_COOKIE)?.value);
  if (!claims || claims.stage !== stage) return null;
  const { data } = await requireDb().from('users').select('id, email, role, session_version, totp_secret, totp_last_step, backup_codes').eq('id', claims.sub).maybeSingle();
  if (!data || data.session_version !== claims.v) return null;
  return { claims, user: data };
}

// ---------------------------------------------------------------------------
// Step 2a: first sign-in, set up the authenticator app
// ---------------------------------------------------------------------------
export async function enrolAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const pending = await pendingUser('enrol');
  if (!pending) return fail('Your sign-in expired. Please sign in again.');
  const { user } = pending;
  if (user.totp_secret) return fail('Two-factor authentication is already set up. Please sign in again.');
  if ((await recentFailures(`otp:${user.id}`)) >= MAX_CODE_ATTEMPTS) return fail(`Too many incorrect codes. Try again in ${WINDOW_MINUTES} minutes.`);

  // The secret shown on the page travels encrypted and bound to this user.
  let secret: string;
  try {
    const [owner, value] = decryptSecret(str(fd, 'pendingSecret')).split(':');
    if (owner !== user.id || !value) throw new Error('mismatch');
    secret = value;
  } catch {
    return fail('The setup code expired. Reload the page and scan the new QR code.');
  }

  const step = verifyTotp(secret, str(fd, 'code'));
  if (step === null) {
    await recordFailure(`otp:${user.id}`);
    return fail('That code is not correct. Check the time on your phone is set automatically, and enter the newest code.', { code: 'Incorrect code' });
  }

  const backupCodes = generateBackupCodes();
  const { error } = await requireDb()
    .from('users')
    .update({ totp_secret: encryptSecret(secret), totp_enabled_at: new Date().toISOString(), totp_last_step: step, backup_codes: await Promise.all(backupCodes.map(hashBackupCode)) })
    .eq('id', user.id);
  if (error) return fail(`Could not save your authenticator: ${error.message}`);

  const problem = await completeSignIn(user);
  if (problem) return fail(problem);
  return { ok: true, message: 'Two-factor authentication is on.', backupCodes, at: Date.now() };
}

// ---------------------------------------------------------------------------
// Step 2b: every later sign-in, enter the code (or a backup code)
// ---------------------------------------------------------------------------
export async function verifyCodeAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const pending = await pendingUser('verify');
  if (!pending) return fail('Your sign-in expired. Please sign in again.');
  const { user, claims } = pending;
  if (!user.totp_secret) return fail('Two-factor authentication was reset. Please sign in again to set it up.');
  if ((await recentFailures(`otp:${user.id}`)) >= MAX_CODE_ATTEMPTS) return fail(`Too many incorrect codes. Try again in ${WINDOW_MINUTES} minutes.`);

  const db = requireDb();
  const code = str(fd, 'code');
  if (str(fd, 'mode') === 'backup') {
    const remaining: string[] = user.backup_codes ?? [];
    const used = code ? await matchBackupCode(code, remaining) : null;
    if (!used) {
      await recordFailure(`otp:${user.id}`);
      return fail('That backup code is not valid or has already been used.', { code: 'Invalid backup code' });
    }
    await db
      .from('users')
      .update({ backup_codes: remaining.filter(h => h !== used) })
      .eq('id', user.id);
  } else {
    let secret: string;
    try {
      secret = decryptSecret(user.totp_secret);
    } catch {
      // the secret was encrypted with a different TOTP_ENCRYPTION_KEY (e.g. set up on another deployment)
      console.error(`[auth] cannot decrypt the 2FA secret for user ${user.id}; TOTP_ENCRYPTION_KEY differs from the one used at setup`);
      return fail(
        "Your authenticator was set up on a site with a different encryption key, so this site can't check codes from it. Sign in with a backup code instead, or ask an admin to reset your two-factor authentication.",
        { code: 'Use a backup code' },
      );
    }
    const step = verifyTotp(secret, code, Number(user.totp_last_step ?? 0));
    if (step === null) {
      await recordFailure(`otp:${user.id}`);
      return fail('That code is not correct or has already been used. Enter the newest code from your app.', { code: 'Incorrect code' });
    }
    await db.from('users').update({ totp_last_step: step }).eq('id', user.id);
  }

  await db.from('login_attempts').delete().eq('key', `otp:${user.id}`);
  const problem = await completeSignIn(user);
  if (problem) return fail(problem);
  redirect(safeNext(claims.next));
}

// ---------------------------------------------------------------------------
// My account
// ---------------------------------------------------------------------------
const accountSchema = z.object({
  name: z.string().trim().min(1, 'Enter your name').max(100),
});

export async function updateAccountAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  const db = requireDb();
  const parsed = accountSchema.safeParse({ name: str(fd, 'name') });
  if (!parsed.success) return fromZod(parsed.error);

  const current = String(fd.get('currentPassword') ?? '');
  const next = String(fd.get('newPassword') ?? '');
  const confirm = String(fd.get('confirmPassword') ?? '');
  const update: Record<string, unknown> = { name: parsed.data.name };

  if (next || current) {
    const { data } = await db.from('users').select('password_hash').eq('id', user.id).single();
    if (!data || !(await verifyPassword(current, data.password_hash))) return fail('Your current password is incorrect.', { currentPassword: 'Incorrect password' });
    const problem = passwordProblem(next);
    if (problem) return fail(problem, { newPassword: problem });
    if (next !== confirm) return fail('The new passwords do not match.', { confirmPassword: 'Does not match' });
    update.password_hash = await hashPassword(next);
    update.session_version = user.sessionVersion + 1;
  }

  const { error } = await db.from('users').update(update).eq('id', user.id);
  if (error) return fail(error.message);

  if (update.session_version) {
    // keep this browser signed in with a fresh token; every other session is now revoked
    const claims = await getSessionClaims();
    if (claims) {
      await db.from('sessions').delete().eq('user_id', user.id).neq('id', claims.sid);
      const token = await signSession({ sub: user.id, v: user.sessionVersion + 1, role: user.role, sid: claims.sid });
      (await cookies()).set(SESSION_COOKIE, token, sessionCookieOptions);
    }
    return ok('Password changed. You have been signed out everywhere else.');
  }
  return ok('Account updated.');
}

async function checkPassword(userId: string, password: string) {
  const { data } = await requireDb().from('users').select('password_hash').eq('id', userId).single();
  return !!data && (await verifyPassword(password, data.password_hash));
}

export async function regenerateBackupCodesAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!(await checkPassword(user.id, String(fd.get('password') ?? '')))) return fail('Your password is incorrect.', { password: 'Incorrect password' });
  const backupCodes = generateBackupCodes();
  const { error } = await requireDb()
    .from('users')
    .update({ backup_codes: await Promise.all(backupCodes.map(hashBackupCode)) })
    .eq('id', user.id);
  if (error) return fail(error.message);
  return { ok: true, message: 'New backup codes created. Your old codes no longer work.', backupCodes, at: Date.now() };
}

/** For a new phone: removes the authenticator and signs out; set it up again at the next sign-in. */
export async function resetOwnTwoFactorAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const user = await requireUser();
  if (!(await checkPassword(user.id, String(fd.get('resetPassword') ?? '')))) return fail('Your password is incorrect.', { resetPassword: 'Incorrect password' });
  const { error } = await requireDb()
    .from('users')
    .update({ totp_secret: null, totp_enabled_at: null, totp_last_step: 0, backup_codes: [], session_version: user.sessionVersion + 1 })
    .eq('id', user.id);
  if (error) return fail(error.message);
  await requireDb().from('sessions').delete().eq('user_id', user.id);
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/admin/login?reset=2fa');
}

// ---------------------------------------------------------------------------
// Signed-in devices
// ---------------------------------------------------------------------------

/** Ends one of the signed-in user's other sessions. Scoped to the user, so another user's session id does nothing. */
export async function endSessionAction(sessionId: string) {
  const user = await requireUser();
  const claims = await getSessionClaims();
  if (sessionId === claims?.sid) throw new Error('Use "Sign out" to end this session.');
  const { error } = await requireDb().from('sessions').delete().eq('id', sessionId).eq('user_id', user.id);
  if (error) throw new Error('Could not end that session. Please try again.');
  revalidatePath('/admin/account');
}

/** Signs this user out on every device, including this one. */
export async function signOutEverywhereAction() {
  const user = await requireUser();
  const db = requireDb();
  await db.from('users').update({ session_version: user.sessionVersion + 1 }).eq('id', user.id);
  await db.from('sessions').delete().eq('user_id', user.id);
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/admin/login');
}
