'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import { PopupDialog } from '@/components/popup/PopupDialog';
import type { PopupContent } from '@/lib/popups';

/** Shows a pop-up exactly as visitors will see it, ignoring its dates and how often it's shown. */
export function PopupPreview({ popup, label = 'Preview' }: { popup: PopupContent; label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="adm-btn secondary" onClick={() => setOpen(true)}>
        <Icon name="eye" />
        {label}
      </button>
      {open && <PopupDialog popup={popup} open onClose={() => setOpen(false)} />}
    </>
  );
}
