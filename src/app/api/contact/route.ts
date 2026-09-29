import { NextResponse } from 'next/server';
import { getDb } from '@/lib/supabase';
import { bodyFor, CONTACT_EMAIL, subjectFor, validate, type FormKind, type FormPayload } from '@/lib/forms';

const KINDS: FormKind[] = ['contact', 'newsletter'];
const MAX_FIELD = 5000;

/**
 * Receives contact and newsletter submissions.
 *  1. Saves them to Supabase (they appear in /admin/inbox; newsletter sign-ups also in /admin/subscribers).
 *  2. Optionally notifies by email (Resend) or webhook, when configured.
 * If neither storage nor notification is available it responds 503, and the browser falls back to the email app.
 */
export async function POST(request: Request) {
  let payload: FormPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const kind = payload?.kind;
  const raw = payload?.fields;
  if (!KINDS.includes(kind) || typeof raw !== 'object' || raw === null) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }

  // Keep only string fields, trimmed and length-capped.
  const fields: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw).slice(0, 30)) {
    if (typeof v === 'string') fields[k.slice(0, 40)] = v.trim().slice(0, MAX_FIELD);
  }

  // Honeypot: bots fill the hidden "website" field. Pretend success.
  if (fields.website) return NextResponse.json({ ok: true });
  delete fields.website;

  const invalid = validate(kind, fields);
  if (invalid.length) return NextResponse.json({ ok: false, error: 'validation', fields: invalid }, { status: 400 });

  const email = fields.email.toLowerCase();
  const subject = subjectFor(kind, fields);
  const text = bodyFor(fields);

  let stored = false;
  const db = getDb();
  if (db) {
    const { error } = await db.from('submissions').insert({ kind, email, name: fields.name ?? '', fields });
    if (error) console.error('[contact] failed to store submission:', error);
    else stored = true;
    if (kind === 'newsletter') {
      const { error: subError } = await db.from('subscribers').upsert({ email, source: 'website' }, { onConflict: 'email', ignoreDuplicates: true });
      if (subError) console.error('[contact] failed to store subscriber:', subError);
    }
  }

  const notified = await notify(kind, subject, text, fields);
  if (stored || notified === true) return NextResponse.json({ ok: true });
  if (notified === false) return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 });
  return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
}

/** true = sent, false = configured but failed, null = no notification channel configured. */
async function notify(kind: FormKind, subject: string, text: string, fields: Record<string, string>): Promise<boolean | null> {
  const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, CONTACT_WEBHOOK_URL } = process.env;
  try {
    if (RESEND_API_KEY && CONTACT_FROM_EMAIL) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: CONTACT_FROM_EMAIL, to: [CONTACT_TO_EMAIL || CONTACT_EMAIL], reply_to: fields.email, subject, text }),
      });
      if (!res.ok) throw new Error(`Resend responded ${res.status}`);
      return true;
    }
    if (CONTACT_WEBHOOK_URL) {
      const res = await fetch(CONTACT_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, subject, fields, text, submittedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      return true;
    }
  } catch (err) {
    console.error('[contact] notification failed:', err);
    return false;
  }
  return null;
}
