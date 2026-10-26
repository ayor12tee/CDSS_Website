'use client';

import { useRef, useState } from 'react';
import { artSrc } from '@/components/ui/primitives';
import { Icon } from '@/components/ui/Icon';
import { useFormState } from './ActionForm';

export const ILLUSTRATIONS = [
  'hero', 'award', 'history', 'archive', 'bim', 'pipeline', 'simulation', 'training',
  'industry-oil-gas', 'industry-aec', 'industry-gis', 'industry-mining',
  '/img/industry-oil-gas.jpg', '/img/industry-aec.jpg', '/img/industry-gis.jpg', '/img/industry-mining.jpg',
];

const MAX_MB = 10;

interface ImagePickerProps {
  name: string;
  label: string;
  defaultValue?: string | null;
  images?: { url: string; filename: string }[];
  hint?: string;
  /** offer the built-in blueprint illustrations (off for logos) */
  illustrations?: boolean;
  /** allow "No image"; the field then submits an empty value */
  optional?: boolean;
  /** "contain" shows the whole image, for logos; "cover" fills the frame */
  fit?: 'cover' | 'contain';
}

/**
 * Choose an image from the media library, upload a new one without leaving the form, paste an image link,
 * or (where offered) pick a built-in illustration. Submits the illustration name or the image URL.
 */
export function ImagePicker({ name, label, defaultValue, images = [], hint, illustrations = true, optional = false, fit = 'cover' }: ImagePickerProps) {
  const [value, setValue] = useState(defaultValue ?? (optional ? '' : 'hero'));
  const [library, setLibrary] = useState(images);
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const error = useFormState().fieldErrors?.[name];

  async function upload(file: File) {
    if (file.size > MAX_MB * 1024 * 1024) return setMessage(`${file.name} is larger than ${MAX_MB} MB.`);
    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    fd.append('files', file);
    try {
      const res = await fetch('/admin/api/media', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      const saved = json.files?.[0] as { url: string; filename: string } | undefined;
      if (!saved) throw new Error('Upload failed');
      setLibrary(l => [saved, ...l]);
      setValue(saved.url);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function applyLink() {
    const url = link.trim();
    if (!/^https:\/\/\S+$/.test(url)) return setMessage('Paste a full image link starting with https://');
    setMessage(null);
    setValue(url);
    setLink('');
  }

  const isLibrary = library.some(i => i.url === value);
  const isIllustration = ILLUSTRATIONS.includes(value);

  return (
    <div className={`adm-field full${error ? ' invalid' : ''}`}>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={value} />

      <div className={`adm-cover-preview${fit === 'contain' ? ' contain' : ''}`}>
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artSrc(value)} alt="Selected image" />
        ) : (
          <span className="adm-preview-empty">No image</span>
        )}
      </div>

      <div className="adm-picker-actions">
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={e => e.target.files?.[0] && upload(e.target.files[0])} />
        <button type="button" className="adm-btn secondary sm" disabled={busy} onClick={() => fileInput.current?.click()}>
          <Icon name="upload" />
          {busy ? 'Uploading…' : 'Upload new'}
        </button>
        {optional && value && (
          <button type="button" className="adm-btn secondary sm" onClick={() => setValue('')}>
            <Icon name="close" />
            Remove image
          </button>
        )}
      </div>

      {library.length > 0 && (
        <>
          <span className="hint">From the media library</span>
          <div className="adm-picker" role="listbox" aria-label="Uploaded images">
            {library.map(img => (
              <button type="button" key={img.url} className={`adm-pick${fit === 'contain' ? ' contain' : ''}`} aria-pressed={value === img.url} onClick={() => setValue(img.url)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" />
                <span>{img.filename}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {illustrations && (
        <>
          <span className="hint" style={{ marginTop: 8 }}>
            Built-in illustrations
          </span>
          <div className="adm-picker" role="listbox" aria-label="Illustrations">
            {ILLUSTRATIONS.map(n => (
              <button type="button" key={n} className="adm-pick" aria-pressed={value === n} onClick={() => setValue(n)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artSrc(n)} alt="" />
                <span>{n.replace(/^\/img\//, '')}</span>
              </button>
            ))}
          </div>
        </>
      )}

      <div className="adm-link-row">
        <input
          type="url"
          value={link}
          onChange={e => setLink(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              applyLink();
            }
          }}
          placeholder="…or paste an image link (https://)"
          aria-label={`${label}: image link`}
        />
        <button type="button" className="adm-btn secondary sm" onClick={applyLink}>
          Use link
        </button>
      </div>
      {value && !isLibrary && !isIllustration && <span className="hint">Using a linked image: {value}</span>}

      {message ? <span className="field-err">{message}</span> : error ? <span className="field-err">{error}</span> : <span className="hint">{hint ?? 'Uploads are saved to the media library.'}</span>}
    </div>
  );
}
