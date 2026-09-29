// Shared form contract between the client forms and /api/contact.

export type FormKind = 'contact' | 'newsletter';

export interface FormPayload {
  kind: FormKind;
  fields: Record<string, string>;
}

export const CONTACT_EMAIL = 'info@cdss-nigeria.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const REQUIRED: Record<FormKind, string[]> = {
  contact: ['name', 'email', 'enquiry', 'message', 'consent'],
  newsletter: ['email'],
};

/** Returns the names of invalid fields (empty array = valid). */
export function validate(kind: FormKind, fields: Record<string, string>): string[] {
  const bad = REQUIRED[kind].filter(k => !fields[k]?.trim());
  if (fields.email && !EMAIL_RE.test(fields.email.trim()) && !bad.includes('email')) bad.push('email');
  return bad;
}

export function subjectFor(kind: FormKind, fields: Record<string, string>) {
  return kind === 'newsletter' ? 'Newsletter subscription' : `Website enquiry: ${fields.enquiry || 'General'}`;
}

export function bodyFor(fields: Record<string, string>) {
  return Object.entries(fields)
    .filter(([k, v]) => k !== 'consent' && v.trim())
    .map(([k, v]) => `${k.charAt(0).toUpperCase() + k.slice(1)}: ${v}`)
    .join('\n');
}

export type SubmitResult = 'sent' | 'mailto' | 'error';

/**
 * Posts to /api/contact. If no delivery backend is configured (503) or the API is unavailable
 * (e.g. a static export), falls back to opening the visitor's email app.
 */
export async function submitForm(payload: FormPayload): Promise<SubmitResult> {
  let status = 0;
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) return 'sent';
    status = res.status;
  } catch {
    status = 0;
  }
  if (status === 0 || status === 404 || status === 405 || status === 503) {
    const { kind, fields } = payload;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subjectFor(kind, fields))}&body=${encodeURIComponent(bodyFor(fields))}`;
    return 'mailto';
  }
  return 'error';
}
