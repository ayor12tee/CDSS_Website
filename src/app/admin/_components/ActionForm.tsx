'use client';

import { createContext, startTransition, useActionState, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import { initialActionState, type ActionState } from '../_lib/state';
import { BackupCodes } from './BackupCodes';

const FormStateContext = createContext<ActionState>(initialActionState);
export const useFormState = () => useContext(FormStateContext);

interface ActionFormProps {
  action: (prev: ActionState, fd: FormData) => Promise<ActionState>;
  children: ReactNode;
  submitLabel?: string;
  /** extra buttons shown in the save bar (e.g. delete, view on site) */
  extra?: ReactNode;
  /** message shown on first render, e.g. "Created" after a redirect */
  initialMessage?: string;
  /** render as a compact inline form without the sticky save bar */
  compact?: boolean;
  className?: string;
}

/**
 * Wraps an admin server action. Submits via a transition (instead of <form action>) so React
 * does not auto-reset the fields, which would wipe the editor's changes when validation fails.
 */
export function ActionForm({ action, children, submitLabel = 'Save changes', extra, initialMessage, compact, className }: ActionFormProps) {
  const [state, formAction, pending] = useActionState(action, initialMessage ? { ok: true, message: initialMessage } : initialActionState);
  const [dirty, setDirty] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // a successful save clears the "unsaved changes" flag (adjusting state during render, not in an effect)
  const [seenAt, setSeenAt] = useState(state.at);
  if (state.at !== seenAt) {
    setSeenAt(state.at);
    if (state.ok) setDirty(false);
  }

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => formAction(fd));
  }

  const status = pending ? (
    <span className="status">Saving…</span>
  ) : state.error ? (
    <span className="status err">{state.error}</span>
  ) : state.message ? (
    <span className="status ok">{state.message}</span>
  ) : dirty ? (
    <span className="status">Unsaved changes</span>
  ) : null;

  return (
    <FormStateContext.Provider value={state}>
      <form ref={formRef} className={`adm-form ${className ?? ''}`} onSubmit={onSubmit} onInput={() => setDirty(true)} onChange={() => setDirty(true)} noValidate>
        {state.error && !compact && (
          <div className="adm-notice err" role="alert">
            <Icon name="alert" />
            <div>
              {state.error}
              {state.fieldErrors && Object.keys(state.fieldErrors).length > 0 && (
                <ul>
                  {Object.entries(state.fieldErrors).map(([k, v]) => (
                    <li key={k}>
                      <b>{labelize(k)}:</b> {v}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
        {state.ok && state.message && !compact && state.message.length > 90 && (
          <div className="adm-notice ok" role="status">
            <Icon name="check" />
            <div style={{ wordBreak: 'break-all' }}>{state.message}</div>
          </div>
        )}
        {state.backupCodes && <BackupCodes codes={state.backupCodes} />}
        {children}
        {compact ? (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <button className="adm-btn primary sm" type="submit" disabled={pending}>
              {pending ? 'Saving…' : submitLabel}
            </button>
            {status}
          </div>
        ) : (
          <div className="adm-savebar">
            <div role="status" aria-live="polite">
              {status}
            </div>
            <div className="adm-savebar-actions">
              {extra}
              <button className="adm-btn primary" type="submit" disabled={pending}>
                <Icon name="check" />
                {pending ? 'Saving…' : submitLabel}
              </button>
            </div>
          </div>
        )}
      </form>
    </FormStateContext.Provider>
  );
}

function labelize(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}
