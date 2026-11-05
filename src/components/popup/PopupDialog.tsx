'use client';

import Image from 'next/image';
import { useEffect, useId, useRef, type CSSProperties } from 'react';
import { Icon } from '@/components/ui/Icon';
import { OCCASIONS, paragraphs, type PopupContent } from '@/lib/popups';

/** The pop-up itself, as a modal dialog. Used by the public site and by the admin preview. */
export function PopupDialog({ popup, open, onClose }: { popup: PopupContent; open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const look = OCCASIONS[popup.occasion];
  const external = !!popup.ctaUrl && /^https?:\/\//.test(popup.ctaUrl);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="site-popup"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{ '--pop-a': look.colors[0], '--pop-b': look.colors[1] } as CSSProperties}
    >
      <div className="site-popup-card">
        <button type="button" className="site-popup-x" onClick={onClose} aria-label="Close">
          <Icon name="close" />
        </button>
        {popup.image ? (
          <div className="site-popup-image">
            <Image src={popup.image} alt="" width={640} height={360} unoptimized />
          </div>
        ) : (
          <div className="site-popup-band" aria-hidden="true">
            <span className="site-popup-icon">
              <Icon name={look.icon} />
            </span>
          </div>
        )}
        <div className="site-popup-body">
          <span className="site-popup-eyebrow">{look.eyebrow}</span>
          <h2 id={titleId}>{popup.title}</h2>
          {paragraphs(popup.message).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div className="site-popup-actions">
            {popup.ctaLabel && popup.ctaUrl && (
              <a className="btn site-popup-cta" href={popup.ctaUrl} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} onClick={onClose}>
                {popup.ctaLabel}
                <Icon name="arrow" />
              </a>
            )}
            <button type="button" className="site-popup-dismiss" onClick={onClose} autoFocus={!popup.ctaUrl}>
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
