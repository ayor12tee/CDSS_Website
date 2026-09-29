'use client';

import { startTransition, useActionState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { loginAction } from '../_lib/auth-actions';
import { initialActionState } from '../_lib/state';

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(loginAction, initialActionState);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => action(fd));
  }

  return (
    <form className="adm-form" onSubmit={onSubmit}>
      {state.error && (
        <div className="adm-notice err" role="alert">
          <Icon name="alert" />
          {state.error}
        </div>
      )}
      <input type="hidden" name="next" value={next} />
      <div className="adm-field">
        <label className="label" htmlFor="login-email">
          Email
        </label>
        <input id="login-email" name="email" type="email" autoComplete="username" required autoFocus />
      </div>
      <div className="adm-field">
        <label className="label" htmlFor="login-password">
          Password
        </label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="adm-btn primary" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
