'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui/Icon';

/** Shows freshly generated backup codes once, with copy and download helpers. */
export function BackupCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);
  const text = `CDSS Admin backup codes\nEach code works once. Keep them somewhere safe.\n\n${codes.join('\n')}\n`;

  return (
    <div className="adm-backup">
      <div className="adm-notice warn">
        <Icon name="alert" />
        <div>
          <b>Save these backup codes now.</b> They will not be shown again. Each one lets you sign in once if you lose your phone.
        </div>
      </div>
      <ol className="adm-codes">
        {codes.map(c => (
          <li key={c}>
            <code>{c}</code>
          </li>
        ))}
      </ol>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button
          type="button"
          className="adm-btn secondary sm"
          onClick={async () => {
            await navigator.clipboard.writeText(text);
            setCopied(true);
          }}
        >
          <Icon name={copied ? 'check' : 'link'} />
          {copied ? 'Copied' : 'Copy codes'}
        </button>
        <a className="adm-btn secondary sm" href={`data:text/plain;charset=utf-8,${encodeURIComponent(text)}`} download="cdss-admin-backup-codes.txt">
          <Icon name="download" />
          Download .txt
        </a>
      </div>
    </div>
  );
}
