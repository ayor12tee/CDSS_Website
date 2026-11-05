// Admin reads for site pop-ups. Kept apart from queries.ts so the feature is self-contained.
import 'server-only';
import { requireUser } from '@/lib/auth';
import { requireDb } from '@/lib/supabase';
import { toPopup, type Popup } from '@/lib/popups';

const missingTable = (code?: string) => code === '42P01' || code === 'PGRST205';

/** Every pop-up, newest start first; null until the pop-ups migration has been run. */
export async function listPopups(): Promise<Popup[] | null> {
  await requireUser();
  const { data, error } = await requireDb().from('popups').select('*').order('starts_at', { ascending: false });
  if (missingTable(error?.code)) return null;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toPopup);
}

export async function getPopupById(id: string): Promise<Popup | null> {
  await requireUser();
  const { data, error } = await requireDb().from('popups').select('*').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPopup(data) : null;
}
