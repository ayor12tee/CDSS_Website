// Webinar helpers shared by the public pages and the admin. Times are entered and shown in Lagos time
// (WAT, UTC+1, no daylight saving), so server-rendered pages never depend on the server's timezone.
import type { Webinar } from './types';

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

/** Accepts Teams webinar registration and meeting links (teams.microsoft.com, events.teams.microsoft.com, teams.live.com). */
export function isTeamsUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && /(^|\.)(teams\.microsoft\.com|teams\.live\.com)$/.test(u.hostname);
  } catch {
    return false;
  }
}
