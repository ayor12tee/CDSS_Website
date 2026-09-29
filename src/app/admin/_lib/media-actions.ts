'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/auth';
import { MEDIA_BUCKET, requireDb } from '@/lib/supabase';
import { fail, ok, str } from './form';
import type { ActionState } from './state';

export async function updateMediaAlt(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const alt = str(fd, 'alt').slice(0, 300);
  const { error } = await requireDb().from('media').update({ alt }).eq('id', str(fd, 'id'));
  if (error) return fail(error.message);
  revalidatePath('/admin/media');
  return ok('Saved.');
}

export async function deleteMedia(id: string) {
  await requireUser();
  const db = requireDb();
  const { data, error } = await db.from('media').select('path').eq('id', id).single();
  if (error) throw new Error(error.message);
  const removed = await db.storage.from(MEDIA_BUCKET).remove([data.path]);
  if (removed.error) throw new Error(removed.error.message);
  await db.from('media').delete().eq('id', id);
  revalidatePath('/admin/media');
}
