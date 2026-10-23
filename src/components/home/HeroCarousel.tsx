'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type KeyboardEvent, type TouchEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { Eyebrow } from '@/components/ui/primitives';

export interface HeroSlide {
  /** 3:1 banner from /public/img; the subject sits on the right, copy goes over the left */
  image: string;
  kicker: string;
  headline: string;
  body: string;
  cta: { label: string; href: string };
  /** brightness of the image's left side: light gets navy text, dark gets white text */
  tone: 'light' | 'dark';
}

const INTERVAL = 7000;
const SWIPE_PX = 50;
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

const subscribeReducedMotion = (cb: () => void) => {
  const mq = matchMedia(REDUCED_MOTION);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};

/**
 * Full-width homepage banner carousel. Auto-advances unless the visitor prefers reduced motion,
 * pauses while hovered or focused, and has a pause button, arrows, dots, swipe and arrow keys.
 */
export function HeroCarousel({ slides, label }: { slides: HeroSlide[]; label: string }) {
  const count = slides.length;
  const [index, setIndex] = useState(0);
  // null until the visitor presses pause/play; until then autoplay follows their motion preference
  const [paused, setPaused] = useState<boolean | null>(null);
  const [held, setHeld] = useState(false);
  const touchX = useRef<number | null>(null);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, () => matchMedia(REDUCED_MOTION).matches, () => false);
  const playing = paused === null ? !reducedMotion : !paused;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (!playing || held || count < 2) return;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [playing, held, index, count, go]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    else if (e.key === 'ArrowRight') go(index + 1);
  };
  const onBlur = (e: FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false);
  };
  const onTouchStart = (e: TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div
      className="hero-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={e => e.pointerType === 'mouse' && setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={onBlur}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hc-track" aria-live={playing ? 'off' : 'polite'}>
        {slides.map((s, i) => {
          const active = i === index;
          return (
            <div
              key={s.image}
              className={`hc-slide tone-${s.tone}${active ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={!active}
              inert={!active}
            >
              <div className="hc-media">
                <Image src={s.image} alt="" width={2000} height={667} unoptimized priority={i === 0} />
              </div>
              <div className="container hc-content">
                <div className="hc-copy">
                  <Eyebrow onDark={s.tone === 'dark'}>{s.kicker}</Eyebrow>
                  <h2>{s.headline}</h2>
                  <p>{s.body}</p>
                  <Link className={`btn ${s.tone === 'dark' ? 'btn-light' : 'btn-primary'}`} href={s.cta.href}>
                    {s.cta.label}
                    <Icon name="arrow" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="hc-controls">
          <div className="container">
            <div className="hc-bar">
              <button type="button" className="hc-btn hc-prev" onClick={() => go(index - 1)} aria-label="Previous slide">
                <Icon name="chevron" />
              </button>
              <div className="hc-dots">
                {slides.map((s, i) => (
                  <button
                    type="button"
                    key={s.image}
                    className="hc-dot"
                    onClick={() => go(i)}
                    aria-label={`Slide ${i + 1}: ${s.kicker}`}
                    aria-current={i === index || undefined}
                  />
                ))}
              </div>
              <button type="button" className="hc-btn hc-next" onClick={() => go(index + 1)} aria-label="Next slide">
                <Icon name="chevron" />
              </button>
              <button type="button" className="hc-btn" onClick={() => setPaused(playing)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
                <Icon name={playing ? 'pause' : 'play'} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
