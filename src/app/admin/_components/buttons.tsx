'use client';

import { useTransition } from 'react';
import { Icon, type IconName } from '@/components/ui/Icon';

interface ConfirmButtonProps {
  /** bound server action, e.g. deletePublication.bind(null, id) */
  action: () => Promise<void>;
  label: string;
  confirm?: string;
  icon?: IconName;
  variant?: 'danger' | 'secondary' | 'primary';
  size?: 'sm';
}

/** Runs a server action after an optional confirmation prompt. */
export function ConfirmButton({ action, label, confirm, icon = 'trash', variant = 'danger', size }: ConfirmButtonProps) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      className={`adm-btn ${variant}${size ? ` ${size}` : ''}`}
      disabled={pending}
      onClick={() => {
        if (confirm && !window.confirm(confirm)) return;
        start(async () => {
          try {
            await action();
          } catch (err) {
            // redirects are thrown as special errors and must propagate
            if (err && typeof err === 'object' && 'digest' in err && String((err as { digest: unknown }).digest).startsWith('NEXT_REDIRECT')) throw err;
            window.alert(err instanceof Error ? err.message : 'Something went wrong.');
          }
        });
      }}
    >
      <Icon name={icon} />
      {pending ? 'Working…' : label}
    </button>
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
