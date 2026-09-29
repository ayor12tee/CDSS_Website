'use client';

import { startTransition, useActionState, useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { verifyCodeAction } from '../../_lib/auth-actions';
import { initialActionState } from '../../_lib/state';

export function VerifyForm() {
  const [state, action, pending] = useActionState(verifyCodeAction, initialActionState);
  const [backup, setBackup] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <>
      <h1>{backup ? 'Use a backup code' : 'Enter your code'}</h1>
      <p className="sub">
        {backup
          ? 'Enter one of the backup codes you saved when you set up two-factor authentication. Each code works once.'
          : 'Open your authenticator app and enter the 6-digit code for CDSS Admin.'}
      </p>
      <form className="adm-form" onSubmit={onSubmit} key={backup ? 'backup' : 'totp'}>
        {state.error && (
          <div className="adm-notice err" role="alert">
            <Icon name="alert" />
            {state.error}
          </div>
        )}
        <input type="hidden" name="mode" value={backup ? 'backup' : 'totp'} />
        <div className="adm-field">
          <label className="label" htmlFor="otp-code">
            {backup ? 'Backup code' : '6-digit code'}
          </label>
          {backup ? (
            <input id="otp-code" className="adm-otp" name="code" autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="abcd-efgh" required autoFocus />
          ) : (
            <input id="otp-code" className="adm-otp" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" maxLength={7} placeholder="123 456" required autoFocus />
          )}
        </div>
        <button className="adm-btn primary" type="submit" disabled={pending}>
          {pending ? 'Checking…' : 'Verify and sign in'}
        </button>
      </form>
      <button type="button" className="adm-link" style={{ marginTop: 18, fontSize: 14 }} onClick={() => setBackup(b => !b)}>
        {backup ? 'Use my authenticator app instead' : 'Lost your phone? Use a backup code'}
      </button>
    </>
  );
}
