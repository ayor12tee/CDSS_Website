import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/content/site';
import { getProducts, getSettings, getWebinar, getWebinars } from '@/lib/content';
import { truncate } from '@/lib/format';
import { PLATFORMS, endsAt, formatWebinarDay, formatWebinarTime, isUpcoming, joinLabel, joinSteps, youtubeId } from '@/lib/webinars';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { JsonLd, SectionHead } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';
import { Markdown } from '@/components/markdown/Markdown';
import { RecordingCard } from '@/components/webinars/WebinarCards';

type Props = { params: Promise<{ slug: string }> };

// a session's page switches from "register" to "recording" once it ends
export const revalidate = 900;

export async function generateStaticParams() {
  return (await getWebinars()).map(w => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = await getWebinar((await params).slug);
  if (!w) return {};
  return {
    title: `${w.title} — Webinar`,
    description: w.summary || `CDSS webinar: ${w.title}.`,
    alternates: { canonical: `/webinars/${w.slug}` },
  };
}

export default async function WebinarPage({ params }: Props) {
  const { slug } = await params;
  const [w, all, products, settings] = await Promise.all([getWebinar(slug), getWebinars(), getProducts(), getSettings()]);
  if (!w) notFound();

  const upcoming = isUpcoming(w);
  const platform = PLATFORMS[w.platform];
  const videoId = youtubeId(w.recordingUrl);
  const related = products.filter(p => w.products.includes(p.slug));
  const moreRecordings = all.filter(o => o.slug !== slug && !isUpcoming(o) && youtubeId(o.recordingUrl)).reverse().slice(0, 3);
  const url = `${SITE_URL}/webinars/${w.slug}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: w.title,
          ...(w.summary ? { description: w.summary } : {}),
          startDate: w.startsAt,
          endDate: endsAt(w).toISOString(),
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          location: { '@type': 'VirtualLocation', url: w.registrationUrl ?? url },
          organizer: { '@type': 'Organization', name: settings.company.name, url: SITE_URL },
          ...(w.speakers.length ? { performer: w.speakers.map(name => ({ '@type': 'Person', name: name.split(',')[0].trim() })) } : {}),
        }}
      />
      <PageHero
        trail={[['Webinars', '/webinars'], [truncate(w.title, 48)]]}
        eyebrow={upcoming ? 'Upcoming webinar' : videoId ? 'Webinar recording' : 'Past webinar'}
        title={w.title}
        lede={w.summary || undefined}
        actions={
          upcoming && w.registrationUrl ? (
            <a className="btn btn-light" href={w.registrationUrl} target="_blank" rel="noopener noreferrer">
              {joinLabel(w)}
              <Icon name="external" />
            </a>
          ) : videoId ? (
            <a className="btn btn-light" href="#recording">
              Watch the recording
              <Icon name="play" />
            </a>
          ) : undefined
        }
      />

      <section className="section">
        <div className="container webinar-layout">
          <div>
            {!upcoming && videoId && (
              <div className="video-embed" id="recording">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                  title={`Recording: ${w.title}`}
                  loading="lazy"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            )}
            {!upcoming && !videoId && (
              <div className="callout" style={{ marginBottom: 32 }}>
                <Icon name="play" />
                <p>
                  <strong>The recording isn&apos;t available yet.</strong>
                  Check back soon, or <Link href="/contact">contact us</Link> about this session.
                </p>
              </div>
            )}
            {w.description.trim() ? (
              <div className="prose">
                <Markdown>{w.description}</Markdown>
              </div>
            ) : null}
          </div>

          <aside className="webinar-facts">
            <dl>
              <div>
                <dt>
                  <Icon name="calendar" />
                  Date
                </dt>
                <dd>
                  <time dateTime={w.startsAt}>{formatWebinarDay(w.startsAt)}</time>
                </dd>
              </div>
              {upcoming && (
                <div>
                  <dt>
                    <Icon name="clock" />
                    Time
                  </dt>
                  <dd>{formatWebinarTime(w)}</dd>
                </div>
              )}
              <div>
                <dt>
                  <Icon name="monitor" />
                  Where
                </dt>
                <dd>Online, on {platform.name}</dd>
              </div>
              {w.speakers.length > 0 && (
                <div>
                  <dt>
                    <Icon name="user" />
                    {w.speakers.length > 1 ? 'Speakers' : 'Speaker'}
                  </dt>
                  <dd>
                    {w.speakers.map(s => (
                      <span key={s}>{s}</span>
                    ))}
                  </dd>
                </div>
              )}
              {related.length > 0 && (
                <div>
                  <dt>
                    <Icon name="layers" />
                    Products covered
                  </dt>
                  <dd>
                    {related.map(p => (
                      <Link key={p.slug} href={`/products/${p.slug}`}>
                        {p.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {upcoming && (
              <div className="webinar-join">
                <h2>How to join</h2>
                <ol>
                  {joinSteps(w).map(step => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {w.registrationUrl ? (
                  <a className="btn btn-primary btn-block" href={w.registrationUrl} target="_blank" rel="noopener noreferrer">
                    {joinLabel(w)}
                    <Icon name="external" />
                  </a>
                ) : (
                  <p className="webinar-note">Registration opens soon.</p>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>

      {moreRecordings.length > 0 && (
        <section className="section bg-soft">
          <div className="container">
            <SectionHead eyebrow="On demand" title="More webinar recordings." link={{ href: '/webinars#recordings', label: 'All webinars' }} />
            <div className="grid-3 reveal-stagger">
              {moreRecordings.map(o => (
                <RecordingCard key={o.id} webinar={o} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
