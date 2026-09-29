'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/auth';
import { requireDb } from '@/lib/supabase';

export async function setSubmissionRead(id: string, isRead: boolean) {
  await requireUser();
  const { error } = await requireDb().from('submissions').update({ is_read: isRead }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
}

export async function markAllRead() {
  await requireUser();
  const { error } = await requireDb().from('submissions').update({ is_read: true }).eq('is_read', false);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
}

export async function deleteSubmission(id: string) {
  await requireUser();
  const { error } = await requireDb().from('submissions').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin', 'layout');
  redirect('/admin/inbox?deleted=1');
}

export async function deleteSubscriber(id: string) {
  await requireUser();
  const { error } = await requireDb().from('subscribers').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/subscribers');
}
