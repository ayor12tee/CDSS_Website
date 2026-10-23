'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type FocusEvent, type KeyboardEvent, type ReactNode, type TouchEvent } from 'react';
import { Icon } from '@/components/ui/Icon';

export interface HeroSlide {
  /** 3:1 banner from /public/img; the subject sits on the right, the hero copy goes over the left */
  image: string;
  /** names the slide for the dot buttons */
  label: string;
  /** brightness of the image's left side: light gets navy copy, dark gets white copy */
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
 * Full-width homepage hero: fixed copy (children) over cross-fading banner images. The copy takes the
 * active image's tone. Auto-advances unless the visitor prefers reduced motion, pauses while hovered or
 * focused, and has a pause button, arrows, dots, swipe and arrow keys.
 */
export function HeroCarousel({ slides, label, children }: { slides: HeroSlide[]; label: string; children: ReactNode }) {
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
      className={`hero-carousel tone-${slides[index].tone}`}
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
      <div className="hc-track">
        {slides.map((s, i) => (
          <div
            key={s.image}
            className={`hc-slide tone-${s.tone}${i === index ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}: ${s.label}`}
            aria-hidden={i !== index}
          >
            <Image src={s.image} alt="" width={2000} height={667} unoptimized priority={i === 0} />
          </div>
        ))}
      </div>

      <div className="container hc-content">
        <div className="hc-copy">{children}</div>
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
                    aria-label={`Slide ${i + 1}: ${s.label}`}
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
