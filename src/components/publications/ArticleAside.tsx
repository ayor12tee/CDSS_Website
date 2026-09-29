'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** "On this page" navigation that highlights the section currently in view. */
export function ArticleToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-20% 0px -70% 0px' },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="toc" aria-label="On this page">
      <h2>On this page</h2>
      <ol>
        {items.map(({ id, title }) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? 'active' : undefined}>
              {title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link:', window.location.href);
    }
  };
  return (
    <button className={`share-btn${copied ? ' copied' : ''}`} type="button" onClick={copy} aria-label={copied ? 'Link copied' : 'Copy link'}>
      <Icon name={copied ? 'check' : 'link'} />
    </button>
  );
}
