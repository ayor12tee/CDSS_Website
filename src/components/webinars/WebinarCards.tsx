import Image from 'next/image';
import Link from 'next/link';
import type { Webinar } from '@/lib/types';
import { dateBadge, formatWebinarDay, formatWebinarTime, youtubeId } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';

/** Upcoming session: date badge, details and a Teams registration button. */
export function UpcomingWebinar({ webinar: w }: { webinar: Webinar }) {
  const { day, month } = dateBadge(w.startsAt);
  return (
    <article className="webinar-row">
      <div className="date-badge" aria-hidden="true">
        <span>{month}</span>
        <strong>{day}</strong>
      </div>
      <div className="webinar-row-body">
        <div className="post-meta">
          <span>
            <Icon name="calendar" />
            <time dateTime={w.startsAt}>{formatWebinarDay(w.startsAt)}</time>
          </span>
          <span>
            <Icon name="clock" />
            {formatWebinarTime(w)}
          </span>
        </div>
        <h3>
          <Link href={`/webinars/${w.slug}`}>{w.title}</Link>
        </h3>
        <p>{w.summary}</p>
        {w.speakers.length > 0 && (
          <p className="webinar-speakers">
            <Icon name="user" />
            {w.speakers.join(' · ')}
          </p>
        )}
      </div>
      <div className="webinar-row-actions">
        {w.registrationUrl ? (
          <a className="btn btn-primary" href={w.registrationUrl} target="_blank" rel="noopener noreferrer">
            Register on Teams
            <Icon name="external" />
          </a>
        ) : (
          <span className="cat-pill">Registration opens soon</span>
        )}
        <Link className="link-arrow" href={`/webinars/${w.slug}`}>
          Details
          <Icon name="arrow" />
        </Link>
      </div>
    </article>
  );
}

/** Past session with a YouTube recording. */
export function RecordingCard({ webinar: w }: { webinar: Webinar }) {
  const id = youtubeId(w.recordingUrl);
  return (
    <Link className="post-card" href={`/webinars/${w.slug}`}>
      <div className="post-cover recording-cover">
        {id && <Image src={`https://i.ytimg.com/vi/${id}/mqdefault.jpg`} alt="" width={320} height={180} unoptimized />}
        <span className="play-badge" aria-hidden="true">
          <Icon name="play" />
        </span>
        <span className="cat-pill">Recording</span>
      </div>
      <div className="post-body">
        <div className="post-meta">
          <span>
            <Icon name="calendar" />
            <time dateTime={w.startsAt}>{formatWebinarDay(w.startsAt)}</time>
          </span>
        </div>
        <h3>{w.title}</h3>
        <p>{w.summary}</p>
        <span className="link-arrow">
          Watch recording
          <Icon name="arrow" />
        </span>
      </div>
    </Link>
  );
}
