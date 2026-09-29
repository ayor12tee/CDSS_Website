// Signed session tokens (HS256 JWT) stored in an httpOnly cookie. No database access here,
// so this module is safe to use from proxy.ts.
import { jwtVerify, SignJWT } from 'jose';
import type { Role } from '@/lib/types';

export const SESSION_COOKIE = 'cdss_session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

export interface SessionClaims {
  /** user id */
  sub: string;
  /** users.session_version at sign-in; a mismatch means the session was revoked */
  v: number;
  role: Role;
}

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters (see .env.example).');
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(claims: SessionClaims) {
  return new SignJWT({ v: claims.v, role: claims.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .setAudience('cdss-admin')
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'], audience: 'cdss-admin' });
    if (typeof payload.sub !== 'string' || typeof payload.v !== 'number' || (payload.role !== 'admin' && payload.role !== 'editor')) return null;
    return { sub: payload.sub, v: payload.v, role: payload.role };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_TTL_SECONDS,
};

// ---------------------------------------------------------------------------
// Pending sign-in: password accepted, second factor still required.
// Uses a different audience, so it can never be mistaken for a full session.
// ---------------------------------------------------------------------------
export const PENDING_COOKIE = 'cdss_mfa';
const PENDING_TTL_SECONDS = 10 * 60;

export interface PendingClaims {
  sub: string;
  v: number;
  /** enrol = first-time authenticator setup; verify = enter a code */
  stage: 'enrol' | 'verify';
  next: string;
}

export async function signPending(claims: PendingClaims) {
  return new SignJWT({ v: claims.v, stage: claims.stage, next: claims.next })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${PENDING_TTL_SECONDS}s`)
    .setAudience('cdss-mfa')
    .sign(secretKey());
}

export async function verifyPending(token: string | undefined): Promise<PendingClaims | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'], audience: 'cdss-mfa' });
    if (typeof payload.sub !== 'string' || typeof payload.v !== 'number' || (payload.stage !== 'enrol' && payload.stage !== 'verify')) return null;
    return { sub: payload.sub, v: payload.v, stage: payload.stage, next: typeof payload.next === 'string' ? payload.next : '/admin' };
  } catch {
    return null;
  }
}

export const pendingCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/admin',
  maxAge: PENDING_TTL_SECONDS,
};
