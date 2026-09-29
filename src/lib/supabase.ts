import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const MEDIA_BUCKET = 'media';

let client: SupabaseClient | null | undefined;

/** True when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set. */
export function isDbConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Server-only Supabase client using the service-role key.
 * Returns null when Supabase is not configured (the public site then serves built-in seed content).
 */
export function getDb(): SupabaseClient | null {
  if (client !== undefined) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  client = url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
  return client;
}

/** Like getDb(), but throws a clear error for code paths (admin, forms) that cannot work without a database. */
export function requireDb(): SupabaseClient {
  const db = getDb();
  if (!db) throw new Error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.');
  return db;
}

export function mediaPublicUrl(path: string) {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}
