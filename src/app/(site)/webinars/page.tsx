import type { Metadata } from 'next';
import Link from 'next/link';
import { getWebinars } from '@/lib/content';
import { isUpcoming, youtubeId } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { RecordingCard, UpcomingWebinar } from '@/components/webinars/WebinarCards';

export const metadata: Metadata = {
  title: 'Webinars',
  description:
    'CDSS webinars on engineering software, BIM, simulation and document digitisation. Register for upcoming sessions on Microsoft Teams, or watch past recordings.',
  alternates: { canonical: '/webinars' },
};

// sessions move from "Upcoming" to "Recordings" once they end, without waiting for an admin save
export const revalidate = 900;

export default async function WebinarsPage() {
  const all = await getWebinars();
  const now = new Date();
  const upcoming = all.filter(w => isUpcoming(w, now));
  const recordings = all.filter(w => !isUpcoming(w, now) && youtubeId(w.recordingUrl)).reverse();

  return (
    <>
      <PageHero
        trail={[['Training & Support', '/training'], ['Webinars']]}
        eyebrow="Webinars"
        title="Learn from the people behind the tools."
        lede="Live sessions on Microsoft Teams covering engineering software, BIM, simulation and document digitisation, with time for your questions. Missed one? Watch the recording."
        actions={
          <>
            <a className="btn btn-light" href="#upcoming">
              Upcoming webinars
              <Icon name="arrow" />
            </a>
            <a className="btn btn-ghost" href="#recordings">
              Watch recordings
            </a>
          </>
        }
      />

      <section className="section" id="upcoming">
        <div className="container">
          <SectionHead eyebrow="Upcoming" title="Register for a live session." lead="Registration takes place on Microsoft Teams, which emails you the joining link and reminders. All times are West Africa Time (WAT)." />
          {upcoming.length ? (
            <div className="webinar-list reveal-stagger">
              {upcoming.map(w => (
                <UpcomingWebinar key={w.id} webinar={w} />
              ))}
            </div>
          ) : (
            <div className="callout">
              <Icon name="calendar" />
              <p>
                <strong>No sessions are scheduled right now.</strong>
                New webinars are announced in our newsletter. You can also <Link href="/contact">tell us which topics you&apos;d like covered</Link>.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-soft" id="recordings">
        <div className="container">
          <SectionHead eyebrow="On demand" title="Past webinar recordings." />
          {recordings.length ? (
            <div className="grid-3 reveal-stagger">
              {recordings.map(w => (
                <RecordingCard key={w.id} webinar={w} />
              ))}
            </div>
          ) : (
            <div className="callout">
              <Icon name="play" />
              <p>
                <strong>Recordings will appear here.</strong>
                Recordings of past sessions are published here once they are available.
              </p>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
