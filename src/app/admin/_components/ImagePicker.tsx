'use client';

import { useState } from 'react';
import { artSrc } from '@/components/ui/primitives';
import { useFormState } from './ActionForm';

export const ILLUSTRATIONS = ['hero', 'award', 'history', 'archive', 'bim', 'pipeline', 'simulation', 'training', 'industry-oil-gas', 'industry-aec', 'industry-gis', 'industry-mining'];

interface ImagePickerProps {
  name: string;
  label: string;
  defaultValue?: string;
  images?: { url: string; filename: string }[];
  hint?: string;
}

/** Choose a built-in illustration or an uploaded image. Submits the illustration name or the image URL. */
export function ImagePicker({ name, label, defaultValue = 'hero', images = [], hint }: ImagePickerProps) {
  const [value, setValue] = useState(defaultValue);
  const error = useFormState().fieldErrors?.[name];

  return (
    <div className={`adm-field full${error ? ' invalid' : ''}`}>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={value} />
      <div className="adm-cover-preview">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={artSrc(value)} alt="Selected image" />
      </div>
      <span className="hint">Built-in illustrations</span>
      <div className="adm-picker" role="listbox" aria-label="Illustrations">
        {ILLUSTRATIONS.map(n => (
          <button type="button" key={n} className="adm-pick" aria-pressed={value === n} onClick={() => setValue(n)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/img/${n}.svg`} alt="" />
            <span>{n}</span>
          </button>
        ))}
      </div>
      {images.length > 0 && (
        <>
          <span className="hint" style={{ marginTop: 8 }}>
            Uploaded images
          </span>
          <div className="adm-picker" role="listbox" aria-label="Uploaded images">
            {images.map(img => (
              <button type="button" key={img.url} className="adm-pick" aria-pressed={value === img.url} onClick={() => setValue(img.url)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" />
                <span>{img.filename}</span>
              </button>
            ))}
          </div>
        </>
      )}
      {error ? <span className="field-err">{error}</span> : <span className="hint">{hint ?? 'Upload your own images under Media.'}</span>}
    </div>
  );
}
