'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { requireUser } from '@/lib/auth';
import { requireDb } from '@/lib/supabase';
import { lagosToIso } from '@/lib/webinars';
import { OCCASIONS, fromPopup, type PopupOccasion } from '@/lib/popups';
import { bool, fail, fromDb, fromZod, ok, revalidateSite, str } from './form';
import type { ActionState } from './state';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a date');
const time = z.string().regex(/^\d{2}:\d{2}$/, 'Choose a time');

const popupSchema = z.object({
  occasion: z.enum(Object.keys(OCCASIONS) as [PopupOccasion, ...PopupOccasion[]]),
  title: z.string().trim().min(1, 'Required').max(120),
  message: z.string().trim().max(800),
  image: z
    .string()
    .trim()
    .max(500)
    .regex(/^(https:\/\/\S+|\/[\w./-]+)?$/, 'Choose an image, or paste a link starting with https://')
    .transform(v => v || null),
  ctaLabel: z
    .string()
    .trim()
    .max(40)
    .transform(v => v || null),
  ctaUrl: z
    .string()
    .trim()
    .max(500)
    .regex(/^(https:\/\/\S+|\/\S*)?$/, 'Use a link starting with https://, or a page on this site such as /contact')
    .transform(v => v || null),
  frequency: z.enum(['once', 'daily', 'session']),
  showOn: z.enum(['all', 'home']),
  published: z.boolean(),
  startDate: date,
  startTime: time,
  endDate: date,
  endTime: time,
});

const NEEDS_MIGRATION = 'The pop-ups table doesn’t exist yet. In Supabase, open the SQL Editor and run supabase/migrations/20261105000000_popups.sql, then try again.';
const missingTable = (code?: string) => code === '42P01' || code === 'PGRST205';

export async function savePopup(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireUser();
  const parsed = popupSchema.safeParse({
    occasion: str(fd, 'occasion'),
    title: str(fd, 'title'),
    message: String(fd.get('message') ?? ''),
    image: str(fd, 'image'),
    ctaLabel: str(fd, 'ctaLabel'),
    ctaUrl: str(fd, 'ctaUrl'),
    frequency: str(fd, 'frequency') || 'once',
    showOn: str(fd, 'showOn') || 'all',
    published: bool(fd, 'published'),
    startDate: str(fd, 'startDate'),
    startTime: str(fd, 'startTime'),
    endDate: str(fd, 'endDate'),
    endTime: str(fd, 'endTime'),
  });
  if (!parsed.success) return fromZod(parsed.error);
  const { startDate, startTime, endDate, endTime, ...p } = parsed.data;

  if (!!p.ctaLabel !== !!p.ctaUrl) {
    return fail('A button needs both a label and a link, or neither.', p.ctaLabel ? { ctaUrl: 'Add the link' } : { ctaLabel: 'Add the button text' });
  }
  const startsAt = lagosToIso(startDate, startTime);
  const endsAt = lagosToIso(endDate, endTime);
  if (new Date(endsAt) <= new Date(startsAt)) return fail('The end must be after the start.', { endDate: 'Must be after the start' });

  const values = fromPopup({ ...p, startsAt, endsAt });
  const db = requireDb();
  const id = str(fd, 'id');
  if (id) {
    const { error } = await db.from('popups').update(values).eq('id', id);
    if (missingTable(error?.code)) return fail(NEEDS_MIGRATION);
    if (error) return fromDb(error, 'pop-up');
    revalidateSite();
    return ok('Pop-up saved.');
  }
  const { data, error } = await db.from('popups').insert(values).select('id').single();
  if (missingTable(error?.code)) return fail(NEEDS_MIGRATION);
  if (error) return fromDb(error, 'pop-up');
  revalidateSite();
  redirect(`/admin/popups/${data.id}?created=1`);
}

export async function deletePopup(id: string) {
  await requireUser();
  const { error } = await requireDb().from('popups').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidateSite();
  redirect('/admin/popups?deleted=1');
}
