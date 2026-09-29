'use client';

import { useState } from 'react';
import { Icon, ICON_NAMES, type IconName } from '@/components/ui/Icon';
import type { Capability } from '@/lib/types';
import { useFormState } from './ActionForm';

/** Repeatable icon + title + text rows, submitted as JSON in a hidden field. */
export function CapabilitiesEditor({ name, defaultValue = [] }: { name: string; defaultValue?: Capability[] }) {
  const [rows, setRows] = useState<Capability[]>(defaultValue);
  const error = useFormState().fieldErrors?.[name];

  const update = (i: number, patch: Partial<Capability>) => setRows(rs => rs.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  const move = (i: number, dir: -1 | 1) =>
    setRows(rs => {
      const next = [...rs];
      const j = i + dir;
      if (j < 0 || j >= next.length) return rs;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  return (
    <div className={`adm-field full${error ? ' invalid' : ''}`}>
      <span className="label">Capabilities (&ldquo;How we help&rdquo; cards)</span>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <div className="adm-repeater">
        {rows.map((r, i) => (
          <div className="adm-repeat-row" key={i}>
            <select className="adm-input" value={r.icon} aria-label="Icon" onChange={e => update(i, { icon: e.target.value as IconName })}>
              {ICON_NAMES.map(n => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <input className="adm-input" value={r.title} placeholder="Title" aria-label="Title" onChange={e => update(i, { title: e.target.value })} />
            <textarea className="adm-input" value={r.text} rows={2} placeholder="Short description" aria-label="Description" onChange={e => update(i, { text: e.target.value })} />
            <div className="adm-row-actions">
              <button type="button" className="adm-icon-btn" aria-label="Move up" onClick={() => move(i, -1)}>
                <Icon name="chevronUp" />
              </button>
              <button type="button" className="adm-icon-btn" aria-label="Move down" onClick={() => move(i, 1)}>
                <Icon name="chevron" />
              </button>
              <button type="button" className="adm-icon-btn danger" aria-label="Remove" onClick={() => setRows(rs => rs.filter((_, j) => j !== i))}>
                <Icon name="trash" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <button type="button" className="adm-btn secondary sm" onClick={() => setRows(rs => [...rs, { icon: 'layers', title: '', text: '' }])}>
          <Icon name="plus" />
          Add capability
        </button>
      </div>
      {error && <span className="field-err">{error}</span>}
    </div>
  );
}
