'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type { VendorStore } from '@/content/vendor-promos';

/**
 * Banner card for a vendor's online store. The store loads only when the card is clicked: into a panel
 * below the card on origins the store allows to embed it, otherwise in a new tab.
 */
export function StoreEmbed({ store, span }: { store: VendorStore; span: number }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  const show = () => {
    if (!store.embedOrigins.includes(window.location.origin)) {
      window.open(store.url, '_blank', 'noopener,noreferrer');
      return;
    }
    setOpen(true);
    requestAnimationFrame(() => panel.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <>
      <button type="button" className={`info-card promo-card span-${span}`} onClick={show} aria-expanded={open} aria-controls="store">
        <Image src={store.banner} alt={store.bannerAlt} width={500} height={100} unoptimized />
        <span className="kicker">{store.kicker}</span>
        <span className="promo-title">{store.title}</span>
        <span className="promo-text">{store.text}</span>
        <span className="link-arrow">
          {store.cta}
          <Icon name="arrow" />
        </span>
      </button>

      {open && (
        <div className="store-embed" id="store" ref={panel}>
          <div className="store-head">
            <h3 className="h3">{store.title}</h3>
            <button type="button" className="store-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
              Close
            </button>
          </div>
          <div className="store-frame">
            <iframe
              src={store.url}
              title={store.frameTitle}
              referrerPolicy="strict-origin-when-cross-origin"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
            />
          </div>
          <p className="fine-print">
            Store not loading?{' '}
            <a href={store.url} target="_blank" rel="noopener noreferrer">
              Open it in a new tab
            </a>
            .
          </p>
        </div>
      )}
    </>
  );
}
