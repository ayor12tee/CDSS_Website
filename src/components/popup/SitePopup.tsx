'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { PopupContent } from '@/lib/popups';
import { PopupDialog } from './PopupDialog';

const DAY = 24 * 60 * 60 * 1000;
const DELAY_MS = 1200;

// Re-scheduling a pop-up (a new start date) shows it again; fixing a typo doesn't.
const storageKey = (p: PopupContent) => `cdss-popup:${p.id}:${p.startsAt}`;

function store(p: PopupContent) {
  return p.frequency === 'session' ? window.sessionStorage : window.localStorage;
}

function seenRecently(p: PopupContent, now: number) {
  try {
    const value = store(p).getItem(storageKey(p));
    if (value === null) return false;
    return p.frequency === 'daily' ? now - Number(value) < DAY : true;
  } catch {
    return false; // storage blocked: fall back to the in-memory record below
  }
}

function remember(p: PopupContent) {
  try {
    store(p).setItem(storageKey(p), String(Date.now()));
  } catch {
    // storage blocked (private mode, strict settings): it won't come back during this page session anyway
  }
}

/**
 * Shows the current pop-up a moment after the page loads. Pages are pre-rendered, so the schedule is checked
 * here in the browser: a pop-up starts and stops at its set times without the site being rebuilt.
 */
export function SitePopup({ popups }: { popups: PopupContent[] }) {
  const pathname = usePathname();
  const [active, setActive] = useState<PopupContent | null>(null);
  const [open, setOpen] = useState(false);
  const closed = useRef(new Set<string>());

  useEffect(() => {
    if (open || !popups.length) return;
    const now = Date.now();
    const next = popups.find(
      p =>
        Date.parse(p.startsAt) <= now &&
        now < Date.parse(p.endsAt) &&
        (p.showOn === 'all' || pathname === '/') &&
        !closed.current.has(storageKey(p)) &&
        !seenRecently(p, now),
    );
    if (!next) return;
    const timer = window.setTimeout(() => {
      setActive(next);
      setOpen(true);
    }, DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [pathname, popups, open]);

  if (!active) return null;
  return (
    <PopupDialog
      popup={active}
      open={open}
      onClose={() => {
        closed.current.add(storageKey(active));
        remember(active);
        setOpen(false);
      }}
    />
  );
}
