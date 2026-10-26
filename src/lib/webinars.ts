// Webinar helpers shared by the public pages and the admin. Times are entered and shown in Lagos time
// (WAT, UTC+1, no daylight saving), so server-rendered pages never depend on the server's timezone.
import type { Webinar, WebinarPlatform } from './types';

export const WEBINAR_TZ = 'Africa/Lagos';
const LAGOS_OFFSET = '+01:00';

/** "2026-11-12" + "14:00" in Lagos time -> ISO timestamp. */
export function lagosToIso(date: string, time: string) {
  return new Date(`${date}T${time}:00${LAGOS_OFFSET}`).toISOString();
}

/** ISO timestamp -> { date: "2026-11-12", time: "14:00" } in Lagos time, for the admin form. */
export function isoToLagos(iso: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: WEBINAR_TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(iso))
      .map(p => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

export const endsAt = (w: Pick<Webinar, 'startsAt' | 'durationMinutes'>) => new Date(new Date(w.startsAt).getTime() + w.durationMinutes * 60_000);

/** Upcoming until the session ends, so a live webinar still shows its join button. */
export const isUpcoming = (w: Pick<Webinar, 'startsAt' | 'durationMinutes'>, now = new Date()) => endsAt(w) > now;

/** "Thursday 12 November 2026" (built from parts: ICU versions disagree on the comma after the weekday) */
export function formatWebinarDay(iso: string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: WEBINAR_TZ, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      .formatToParts(new Date(iso))
      .map(x => [x.type, x.value]),
  );
  return `${p.weekday} ${p.day} ${p.month} ${p.year}`;
}

/** "14:00–15:00 WAT" */
export function formatWebinarTime(w: Pick<Webinar, 'startsAt' | 'durationMinutes'>) {
  const t = (d: Date) => new Intl.DateTimeFormat('en-GB', { timeZone: WEBINAR_TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
  return `${t(new Date(w.startsAt))}–${t(endsAt(w))} WAT`;
}

/** Day and short month for the calendar badge on cards. */
export function dateBadge(iso: string) {
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: WEBINAR_TZ, ...o }).format(new Date(iso));
  return { day: f({ day: 'numeric' }), month: f({ month: 'short' }) };
}

/** Joining instructions for the webinar page. */
export function joinSteps(w: Pick<Webinar, 'platform' | 'registrationUrl'>) {
  if (w.platform === 'teams') {
    return [
      'Register on the Microsoft Teams page.',
      'Teams emails you a confirmation with your personal joining link.',
      'At the start time, open the link in the Teams app or your web browser.',
    ];
  }
  if (w.registrationUrl && host(w.registrationUrl) !== 'meet.google.com') {
    return ['Register using the form.', 'We will send you the Google Meet link before the session.', 'At the start time, open the link in your browser or the Google Meet app.'];
  }
  return ['Save the date and keep this page handy.', 'At the start time, use the button to open Google Meet in your browser or the Meet app.', 'Join a few minutes early to check your audio.'];
}

/** "17/09/2026" (Nigerian order) or "2026-09-17" -> "2026-09-17"; null if it isn't a real date. */
export function parseDate(text: string) {
  const ymd = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const dmy = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const parts = ymd ? [ymd[1], ymd[2], ymd[3]] : dmy ? [dmy[3], dmy[2], dmy[1]] : null;
  if (!parts) return null;
  const [y, mo, d] = parts;
  const iso = `${y}-${mo.padStart(2, '0')}-${d.padStart(2, '0')}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(iso) ? iso : null;
}

/** Video id from youtube.com/watch?v=, youtu.be/, /embed/, /shorts/ or /live/ links; null for anything else. */
export function youtubeId(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^(www\.|m\.)/, '');
    const id =
      host === 'youtu.be'
        ? u.pathname.slice(1)
        : host === 'youtube.com' || host === 'youtube-nocookie.com'
          ? (u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1])
          : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const PLATFORMS: Record<WebinarPlatform, { name: string; linkHint: string }> = {
  teams: { name: 'Microsoft Teams', linkHint: 'a https://teams.microsoft.com or events.teams.microsoft.com link' },
  meet: { name: 'Google Meet', linkHint: 'a meet.google.com link, or a Google Forms or Calendar registration link' },
};

const host = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.hostname : null;
  } catch {
    return null;
  }
};

/** Whether a registration or joining link belongs to the chosen platform. */
export function isPlatformUrl(platform: WebinarPlatform, url: string) {
  const h = host(url);
  if (!h) return false;
  if (platform === 'teams') return /(^|\.)(teams\.microsoft\.com|teams\.live\.com)$/.test(h);
  if (h === 'docs.google.com') return new URL(url).pathname.startsWith('/forms/');
  return ['meet.google.com', 'calendar.google.com', 'forms.gle'].includes(h);
}

/** Button text: Teams links and Google Forms/Calendar pages are registrations; a bare Meet link is joined directly. */
export function joinLabel(w: Pick<Webinar, 'platform' | 'registrationUrl'>) {
  if (w.platform === 'teams') return 'Register on Teams';
  return w.registrationUrl && host(w.registrationUrl) === 'meet.google.com' ? 'Join on Google Meet' : 'Register for this webinar';
}
