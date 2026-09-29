'use client';

import { useState, type FormEvent } from 'react';
import { CONTACT_EMAIL, submitForm, validate, type FormKind } from '@/lib/forms';
import { Icon } from '@/components/ui/Icon';

type Status = { kind: '' | 'ok' | 'err'; message: string };

const MESSAGES = {
  sent: { contact: 'Thank you. Your message has been sent and our team will be in touch.', newsletter: 'Thank you for subscribing.' },
  mailto: 'Your email app should now open with your message ready to send.',
  error: `Something went wrong. Please email ${CONTACT_EMAIL} directly.`,
};

function useFormSubmit(kind: FormKind) {
  const [invalid, setInvalid] = useState<string[]>([]);
  const [status, setStatus] = useState<Status>({ kind: '', message: '' });
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const fields: Record<string, string> = {};
    data.forEach((v, k) => {
      fields[k] = typeof v === 'string' ? v : '';
    });

    const bad = validate(kind, fields);
    setInvalid(bad);
    if (bad.length) {
      setStatus({ kind: 'err', message: 'Please complete the highlighted fields.' });
      (form.elements.namedItem(bad[0]) as HTMLElement | null)?.focus();
      return;
    }

    setPending(true);
    setStatus({ kind: '', message: 'Sending…' });
    const result = await submitForm({ kind, fields });
    setPending(false);
    if (result === 'sent') {
      form.reset();
      setStatus({ kind: 'ok', message: MESSAGES.sent[kind] });
    } else if (result === 'mailto') {
      setStatus({ kind: 'ok', message: MESSAGES.mailto });
    } else {
      setStatus({ kind: 'err', message: MESSAGES.error });
    }
  }

  const clear = (name: string) => setInvalid(prev => prev.filter(n => n !== name));
  return { invalid, status, pending, onSubmit, clear };
}

/** Hidden field that only bots fill in. */
function Honeypot() {
  return (
    <div className="hp-field" aria-hidden="true">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function NewsletterForm() {
  const { invalid, status, pending, onSubmit, clear } = useFormSubmit('newsletter');
  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="inline-form">
        <label className="sr-only" htmlFor="nl-email">
          Work email
        </label>
        <input
          id="nl-email"
          type="email"
          name="email"
          placeholder="you@company.com"
          autoComplete="email"
          aria-invalid={invalid.includes('email')}
          onInput={() => clear('email')}
        />
        <button className="btn btn-light" type="submit" disabled={pending}>
          Subscribe
          <Icon name="arrow" />
        </button>
      </div>
      <Honeypot />
      <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}

const ENQUIRIES = ['Sales / Software Licensing', 'Technical Support', 'Product Enquiry', 'Corporate Training', 'Personal Training', 'Certified Training', 'Bureau Services', 'Something else'];

export function ContactForm({ productOptions }: { productOptions: string[] }) {
  const { invalid, status, pending, onSubmit, clear } = useFormSubmit('contact');
  const cls = (name: string, extra = '') => `field${extra}${invalid.includes(name) ? ' invalid' : ''}`;
  const onInput = (e: FormEvent<HTMLElement>) => clear((e.target as HTMLInputElement).name);

  return (
    <form className="form-card" onSubmit={onSubmit} onInput={onInput} onChange={onInput} noValidate>
      <h2 className="h3" style={{ marginBottom: 8 }}>
        Send us a message
      </h2>
      <p style={{ color: 'var(--muted)', marginBottom: 28 }}>
        Fields marked <span style={{ color: 'var(--brand)' }}>*</span> are required.
      </p>
      <div className="form-grid">
        <div className={cls('name')}>
          <label htmlFor="f-name">
            Full name <i>*</i>
          </label>
          <input id="f-name" name="name" autoComplete="name" required />
          <span className="err-msg">Please enter your name.</span>
        </div>
        <div className={cls('email')}>
          <label htmlFor="f-email">
            Work email <i>*</i>
          </label>
          <input id="f-email" name="email" type="email" autoComplete="email" required />
          <span className="err-msg">Please enter a valid email address.</span>
        </div>
        <div className="field">
          <label htmlFor="f-phone">Phone</label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="f-company">Company</label>
          <input id="f-company" name="company" autoComplete="organization" />
        </div>
        <div className={cls('enquiry')}>
          <label htmlFor="f-enquiry">
            What do you need help with? <i>*</i>
          </label>
          <select id="f-enquiry" name="enquiry" required defaultValue="">
            <option value="">Select an option</option>
            {ENQUIRIES.map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <span className="err-msg">Please choose an option.</span>
        </div>
        <div className="field">
          <label htmlFor="f-product">Product of interest</label>
          <select id="f-product" name="product" defaultValue="">
            <option value="">Not sure yet</option>
            {productOptions.map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className={cls('message', ' full')}>
          <label htmlFor="f-message">
            How can we help? <i>*</i>
          </label>
          <textarea id="f-message" name="message" required placeholder="Tell us about your team, project or the issue you're facing." />
          <span className="err-msg">Please add a short message.</span>
        </div>
        <div className={cls('consent', ' full')}>
          <label className="consent">
            <input type="checkbox" name="consent" value="yes" required /> I agree to CDSS contacting me about this enquiry.
          </label>
          <span className="err-msg">Please confirm so we can reply.</span>
        </div>
      </div>
      <Honeypot />
      <button className="btn btn-primary" type="submit" style={{ marginTop: 26 }} disabled={pending}>
        Send message
        <Icon name="arrow" />
      </button>
      <p className={`form-status ${status.kind}`} role="status" aria-live="polite">
        {status.message}
      </p>
    </form>
  );
}
