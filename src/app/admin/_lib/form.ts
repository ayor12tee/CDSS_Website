import 'server-only';
import { revalidatePath } from 'next/cache';
import type { ZodError } from 'zod';
import type { ActionState } from './state';

export const str = (fd: FormData, key: string) => String(fd.get(key) ?? '').trim();
export const optional = (fd: FormData, key: string) => str(fd, key) || null;
/** one item per line */
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);
/** comma-separated */
export const csv = (fd: FormData, key: string) =>
  str(fd, key)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
/** all values of a multi-value field (checkbox groups) */
export const many = (fd: FormData, key: string) => fd.getAll(key).map(String).filter(Boolean);
export const bool = (fd: FormData, key: string) => ['on', 'true', '1'].includes(String(fd.get(key)));
export const int = (fd: FormData, key: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
};

export function toSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export const ok = (message: string): ActionState => ({ ok: true, message, at: Date.now() });
export const fail = (error: string, fieldErrors?: Record<string, string>): ActionState => ({ ok: false, error, fieldErrors, at: Date.now() });

export function fromZod(err: ZodError): ActionState {
  const fieldErrors: Record<string, string> = {};
  for (const issue of err.issues) {
    const key = String(issue.path[0] ?? 'form');
    fieldErrors[key] ??= issue.message;
  }
  return fail('Please fix the highlighted fields.', fieldErrors);
}

/** Translate a Supabase/Postgres error into a friendly message. */
export function fromDb(error: { code?: string; message: string }, what = 'item'): ActionState {
  console.error(`[admin] database error saving ${what}:`, error);
  if (error.code === '23505') return fail(`Another ${what} already uses this slug or email. Choose a different one.`, { slug: 'Already in use', email: 'Already in use' });
  if (error.code === '23514') return fail(`One of the values is not allowed for this ${what}. Check the slug format (lowercase letters, numbers and dashes).`);
  return fail(`Could not save the ${what}. ${error.message}`);
}

/** Content changed: rebuild every public page on its next request. */
export function revalidateSite() {
  revalidatePath('/', 'layout');
}
