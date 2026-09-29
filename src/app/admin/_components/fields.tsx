'use client';

import type { ReactNode } from 'react';
import { useFormState } from './ActionForm';

interface BaseProps {
  name: string;
  label: string;
  hint?: ReactNode;
  required?: boolean;
  full?: boolean;
}

function Shell({ name, label, hint, required, full, children, htmlFor = true }: BaseProps & { children: ReactNode; htmlFor?: boolean }) {
  const error = useFormState().fieldErrors?.[name];
  const Label = htmlFor ? 'label' : 'span';
  return (
    <div className={`adm-field${full ? ' full' : ''}${error ? ' invalid' : ''}`}>
      <Label className="label" {...(htmlFor ? { htmlFor: `f-${name}` } : {})}>
        {label}
        {required && <span className="req"> *</span>}
      </Label>
      {children}
      {error ? <span className="field-err">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

export function TextField({
  type = 'text',
  defaultValue,
  placeholder,
  autoComplete,
  maxLength,
  ...base
}: BaseProps & { type?: string; defaultValue?: string | number | null; placeholder?: string; autoComplete?: string; maxLength?: number }) {
  return (
    <Shell {...base}>
      <input
        id={`f-${base.name}`}
        name={base.name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        required={base.required}
      />
    </Shell>
  );
}

export function TextAreaField({ defaultValue, rows = 4, placeholder, maxLength, ...base }: BaseProps & { defaultValue?: string | null; rows?: number; placeholder?: string; maxLength?: number }) {
  return (
    <Shell {...base}>
      <textarea id={`f-${base.name}`} name={base.name} rows={rows} defaultValue={defaultValue ?? ''} placeholder={placeholder} maxLength={maxLength} required={base.required} />
    </Shell>
  );
}

/** A list edited as one item per line. */
export function LinesField({ defaultValue, rows = 5, placeholder, ...base }: BaseProps & { defaultValue?: string[]; rows?: number; placeholder?: string }) {
  return (
    <Shell {...base} hint={base.hint ?? 'One item per line.'}>
      <textarea id={`f-${base.name}`} name={base.name} rows={rows} defaultValue={(defaultValue ?? []).join('\n')} placeholder={placeholder} />
    </Shell>
  );
}

export function SelectField({ options, defaultValue, ...base }: BaseProps & { options: { value: string; label: string }[]; defaultValue?: string | null }) {
  return (
    <Shell {...base}>
      <select id={`f-${base.name}`} name={base.name} defaultValue={defaultValue ?? ''} required={base.required}>
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Shell>
  );
}

export function CheckboxField({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="adm-check">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      <span>
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

export function CheckboxGroupField({ options, defaultValue = [], ...base }: BaseProps & { options: { value: string; label: string }[]; defaultValue?: string[] }) {
  return (
    <Shell {...base} htmlFor={false}>
      {options.length === 0 ? (
        <span className="hint">Nothing to choose from yet.</span>
      ) : (
        <div className="adm-checks" role="group" aria-label={base.label}>
          {options.map(o => (
            <label className="adm-check" key={o.value}>
              <input type="checkbox" name={base.name} value={o.value} defaultChecked={defaultValue.includes(o.value)} />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      )}
    </Shell>
  );
}
