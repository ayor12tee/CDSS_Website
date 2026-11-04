'use client';

import { useId, useRef, useState, useTransition } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

const isRedirect = (err: unknown) => !!err && typeof err === 'object' && 'digest' in err && String((err as { digest: unknown }).digest).startsWith('NEXT_REDIRECT');

/** "Delete X? Pages using it will break." -> title "Delete X?", detail "Pages using it will break." */
function splitPrompt(text: string) {
  const i = text.indexOf('? ');
  return i === -1 ? { title: text, detail: '' } : { title: text.slice(0, i + 1), detail: text.slice(i + 2) };
}

interface ConfirmButtonProps {
  /** bound server action, e.g. deletePublication.bind(null, id) */
  action: () => Promise<void>;
  label: string;
  confirm?: string;
  icon?: IconName;
  variant?: 'danger' | 'secondary' | 'primary';
  size?: 'sm';
}

/** Runs a server action, after asking for confirmation in a modal dialog when `confirm` is set. */
export function ConfirmButton({ action, label, confirm, icon = 'trash', variant = 'danger', size }: ConfirmButtonProps) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const prompt = splitPrompt(confirm ?? '');

  const close = () => {
    if (!pending) dialog.current?.close();
  };

  const run = () =>
    start(async () => {
      try {
        await action();
        dialog.current?.close();
      } catch (err) {
        // redirects are thrown as special errors and must propagate
        if (isRedirect(err)) throw err;
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        if (!dialog.current?.open) dialog.current?.showModal();
      }
    });

  return (
    <>
      <button
        type="button"
        className={`adm-btn ${variant}${size ? ` ${size}` : ''}`}
        disabled={pending}
        onClick={() => {
          setError(null);
          if (confirm) dialog.current?.showModal();
          else run();
        }}
      >
        <Icon name={icon} />
        {pending ? 'Working…' : label}
      </button>

      <dialog
        ref={dialog}
        className={`adm-dialog ${variant}`}
        aria-labelledby={titleId}
        onCancel={e => pending && e.preventDefault()}
        onClick={e => e.target === e.currentTarget && close()}
      >
        <div className="adm-dialog-body">
          <span className={`adm-dialog-icon${error ? ' err' : ''}`} aria-hidden="true">
            <Icon name={error ? 'alert' : icon} />
          </span>
          <div>
            <h2 id={titleId}>{error ? 'That didn’t work' : prompt.title || 'Are you sure?'}</h2>
            {error ? <p className="adm-dialog-error">{error}</p> : prompt.detail && <p>{prompt.detail}</p>}
          </div>
        </div>
        <div className="adm-dialog-actions">
          <button type="button" className="adm-btn secondary" onClick={close} disabled={pending} autoFocus>
            {error ? 'Close' : 'Cancel'}
          </button>
          {(!error || confirm) && (
            <button type="button" className={`adm-btn ${variant === 'danger' ? 'danger-solid' : variant}`} onClick={run} disabled={pending}>
              <Icon name={icon} />
              {pending ? 'Working…' : error ? 'Try again' : label}
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}

export function CopyText({ text, label = 'Copy URL' }: { text: string; label?: string }) {
  return (
    <button
      type="button"
      className="adm-btn secondary sm"
      onClick={async e => {
        const btn = e.currentTarget;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied';
          setTimeout(() => (btn.textContent = label), 1500);
        } catch {
          window.prompt('Copy:', text);
        }
      }}
    >
      {label}
    </button>
  );
}
