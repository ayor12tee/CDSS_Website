// Site pop-ups: festive greetings and announcements shown over the public site for a set period.
// Shared by the public site (client component) and the admin, so nothing here may be server-only.
import type { IconName } from '@/components/ui/Icon';

export type PopupOccasion = 'christmas' | 'new-year' | 'easter' | 'ramadan' | 'eid' | 'independence' | 'general' | 'announcement';
export type PopupFrequency = 'once' | 'daily' | 'session';
export type PopupShowOn = 'all' | 'home';

/** What the public site needs to show a pop-up. */
export interface PopupContent {
  id: string;
  occasion: PopupOccasion;
  title: string;
  /** plain text; blank lines separate paragraphs */
  message: string;
  image: string | null;
  ctaLabel: string | null;
  /** https:// link or a page on this site (/contact) */
  ctaUrl: string | null;
  /** ISO timestamps (UTC) */
  startsAt: string;
  endsAt: string;
  frequency: PopupFrequency;
  showOn: PopupShowOn;
}

export interface Popup extends PopupContent {
  published: boolean;
}

/** Look of each occasion: the label in the admin, the small heading on the pop-up, its icon and two brand colours. */
export const OCCASIONS: Record<PopupOccasion, { label: string; eyebrow: string; icon: IconName; colors: [string, string] }> = {
  christmas: { label: 'Christmas', eyebrow: 'Season’s greetings', icon: 'gift', colors: ['#a4161a', '#1b5e3a'] },
  'new-year': { label: 'New Year', eyebrow: 'Happy New Year', icon: 'sparkles', colors: ['#0d0a86', '#b8862b'] },
  easter: { label: 'Easter', eyebrow: 'Happy Easter', icon: 'sun', colors: ['#5b3b8c', '#c8901f'] },
  ramadan: { label: 'Ramadan', eyebrow: 'Ramadan Kareem', icon: 'moon', colors: ['#0b3954', '#b8902a'] },
  eid: { label: 'Eid', eyebrow: 'Eid Mubarak', icon: 'moon', colors: ['#0f6b4f', '#b8902a'] },
  independence: { label: 'Independence Day', eyebrow: 'Happy Independence Day', icon: 'flag', colors: ['#008751', '#0b4d31'] },
  general: { label: 'General greeting', eyebrow: 'From all of us at CDSS', icon: 'star', colors: ['#0d0a86', '#3b3fd8'] },
  announcement: { label: 'Announcement', eyebrow: 'Announcement', icon: 'megaphone', colors: ['#0d0a86', '#1d2bb8'] },
};

export const FREQUENCIES: Record<PopupFrequency, { label: string; hint: string }> = {
  once: { label: 'Once per visitor', hint: 'Shown once; after it’s closed it doesn’t come back on that device.' },
  daily: { label: 'Once a day', hint: 'Comes back the next day after it’s closed.' },
  session: { label: 'Once per visit', hint: 'Comes back each time the visitor returns to the site.' },
};

export const SHOW_ON: Record<PopupShowOn, string> = { all: 'Every page', home: 'Home page only' };

export function popupStatus(p: Pick<Popup, 'published' | 'startsAt' | 'endsAt'>, now = new Date()) {
  if (!p.published) return { label: 'Turned off', cls: 'warn' };
  if (new Date(p.endsAt) <= now) return { label: 'Ended', cls: '' };
  if (new Date(p.startsAt) > now) return { label: 'Scheduled', cls: 'brand' };
  return { label: 'Showing now', cls: 'ok' };
}

/** "12 Dec 2026, 09:00" in Lagos time. */
export function formatLagos(iso: string) {
  return new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Lagos', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(iso));
}

/** Paragraphs of a pop-up message. */
export const paragraphs = (message: string) =>
  message
    .split(/\r?\n\s*\r?\n|\r?\n/)
    .map(s => s.trim())
    .filter(Boolean);

export const toPopup = (r: Record<string, unknown>): Popup => ({
  id: String(r.id),
  occasion: (r.occasion as PopupOccasion) in OCCASIONS ? (r.occasion as PopupOccasion) : 'announcement',
  title: String(r.title ?? ''),
  message: String(r.message ?? ''),
  image: (r.image as string | null) ?? null,
  ctaLabel: (r.cta_label as string | null) ?? null,
  ctaUrl: (r.cta_url as string | null) ?? null,
  startsAt: String(r.starts_at),
  endsAt: String(r.ends_at),
  frequency: (r.frequency as PopupFrequency) in FREQUENCIES ? (r.frequency as PopupFrequency) : 'once',
  showOn: r.show_on === 'home' ? 'home' : 'all',
  published: Boolean(r.published),
});

export const fromPopup = (p: Omit<Popup, 'id'>) => ({
  occasion: p.occasion,
  title: p.title,
  message: p.message,
  image: p.image,
  cta_label: p.ctaLabel,
  cta_url: p.ctaUrl,
  starts_at: p.startsAt,
  ends_at: p.endsAt,
  frequency: p.frequency,
  show_on: p.showOn,
  published: p.published,
});
