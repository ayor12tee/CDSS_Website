import { randomUUID } from 'node:crypto';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import { MEDIA_BUCKET, requireDb } from '@/lib/supabase';

const ALLOWED: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'application/pdf': 'pdf',
};
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 20;

/** Magic-byte check so a renamed file cannot pretend to be an image. */
function sniff(buf: Uint8Array): string | null {
  const hex = (n: number) => Array.from(buf.slice(0, n), b => b.toString(16).padStart(2, '0')).join('');
  if (hex(8) === '89504e470d0a1a0a') return 'image/png';
  if (hex(3) === 'ffd8ff') return 'image/jpeg';
  if (hex(4) === '47494638') return 'image/gif';
  if (hex(4) === '52494646' && String.fromCharCode(...buf.slice(8, 12)) === 'WEBP') return 'image/webp';
  if (String.fromCharCode(...buf.slice(0, 5)) === '%PDF-') return 'application/pdf';
  return null;
}

const safeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'file';

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Please sign in again.' }, { status: 401 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid upload.' }, { status: 400 });
  }
  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (!files.length) return NextResponse.json({ error: 'No files received.' }, { status: 400 });
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Upload at most ${MAX_FILES} files at a time.` }, { status: 400 });

  const db = requireDb();
  let uploaded = 0;
  for (const file of files) {
    if (file.size > MAX_BYTES) return NextResponse.json({ error: `${file.name} is larger than 10 MB.` }, { status: 413 });
    const bytes = new Uint8Array(await file.arrayBuffer());
    const type = sniff(bytes);
    if (!type || !ALLOWED[type]) return NextResponse.json({ error: `${file.name} is not a supported file type (PNG, JPG, WebP, GIF or PDF).` }, { status: 415 });

    const now = new Date();
    const path = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${randomUUID().slice(0, 8)}-${safeName(file.name)}.${ALLOWED[type]}`;
    const { error: upErr } = await db.storage.from(MEDIA_BUCKET).upload(path, bytes, { contentType: type, cacheControl: '31536000', upsert: false });
    if (upErr) return NextResponse.json({ error: `Upload failed: ${upErr.message}` }, { status: 502 });

    const { error: dbErr } = await db.from('media').insert({ path, filename: file.name.slice(0, 200), mime_type: type, size_bytes: file.size, uploaded_by: user.id });
    if (dbErr) {
      await db.storage.from(MEDIA_BUCKET).remove([path]);
      return NextResponse.json({ error: `Could not record ${file.name}: ${dbErr.message}` }, { status: 500 });
    }
    uploaded++;
  }

  revalidatePath('/admin/media');
  return NextResponse.json({ uploaded });
}
