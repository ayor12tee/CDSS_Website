'use client';

import Link from 'next/link';
import { startTransition, useActionState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { BackupCodes } from '../../_components/BackupCodes';
import { enrolAction } from '../../_lib/auth-actions';
import { initialActionState } from '../../_lib/state';

interface SetupFormProps {
  qrSvg?: string;
  secret?: string;
  pendingSecret?: string;
  email?: string;
}

export function SetupForm({ qrSvg, secret, pendingSecret, email }: SetupFormProps) {
  const [state, action, pending] = useActionState(enrolAction, initialActionState);

  if (state.ok && state.backupCodes) {
    return (
      <>
        <h1>Two-factor authentication is on</h1>
        <p className="sub">From now on you will sign in with your password and a code from your authenticator app.</p>
        <BackupCodes codes={state.backupCodes} />
        <Link className="adm-btn primary" href="/admin" style={{ marginTop: 20 }}>
          I&apos;ve saved my codes. Continue to the dashboard
          <Icon name="arrow" />
        </Link>
      </>
    );
  }

  if (!qrSvg || !pendingSecret) {
    return (
      <>
        <h1>You&apos;re signed in</h1>
        <p className="sub">Two-factor authentication is already set up for your account.</p>
        <Link className="adm-btn primary" href="/admin">
          Go to the dashboard
        </Link>
      </>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <>
      <h1>Set up two-factor authentication</h1>
      <p className="sub">Every admin account is protected by a one-time code from an authenticator app. This takes about a minute.</p>
      <ol className="adm-steps">
        <li>
          Install an authenticator app on your phone, such as <b>Google Authenticator</b>, <b>Microsoft Authenticator</b> or <b>Authy</b>.
        </li>
        <li>
          In the app, add an account and scan this QR code{email ? ` for ${email}` : ''}:
          <div className="adm-qr" dangerouslySetInnerHTML={{ __html: qrSvg }} />
          <details className="adm-manual">
            <summary>Can&apos;t scan it? Enter this key instead</summary>
            <code>{secret}</code>
            <span className="hint">Account: CDSS Admin · Type: time-based</span>
          </details>
        </li>
        <li>Enter the 6-digit code the app shows to finish.</li>
      </ol>
      <form className="adm-form" onSubmit={onSubmit}>
        {state.error && (
          <div className="adm-notice err" role="alert">
            <Icon name="alert" />
            {state.error}
          </div>
        )}
        <input type="hidden" name="pendingSecret" value={pendingSecret} />
        <div className="adm-field">
          <label className="label" htmlFor="otp-code">
            6-digit code
          </label>
          <input id="otp-code" className="adm-otp" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]*" maxLength={7} placeholder="123 456" required autoFocus />
        </div>
        <button className="adm-btn primary" type="submit" disabled={pending}>
          {pending ? 'Checking…' : 'Turn on two-factor authentication'}
        </button>
      </form>
    </>
  );
}
