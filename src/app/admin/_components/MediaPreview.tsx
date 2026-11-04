'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';

/** Media library thumbnail that opens the full image in a dialog. */
export function MediaPreview({ url, alt, filename, children }: { url: string; alt: string; filename: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [dims, setDims] = useState('');
  const close = () => dialog.current?.close();

  return (
    <>
      <button type="button" className="thumb" onClick={() => dialog.current?.showModal()} aria-label={`View ${filename}`}>
        {children}
      </button>

      <dialog ref={dialog} className="adm-dialog adm-viewer" aria-labelledby={titleId} onClick={e => e.target === e.currentTarget && close()}>
        <div className="adm-viewer-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={alt} loading="lazy" onLoad={e => setDims(`${e.currentTarget.naturalWidth} × ${e.currentTarget.naturalHeight} px`)} />
        </div>
        <div className="adm-dialog-actions">
          <div className="adm-viewer-name">
            <strong id={titleId} title={filename}>
              {filename}
            </strong>
            {dims && <span>{dims}</span>}
          </div>
          <a className="adm-btn secondary" href={url} target="_blank" rel="noreferrer">
            <Icon name="external" />
            Open original
          </a>
          <button type="button" className="adm-btn primary" onClick={close} autoFocus>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
