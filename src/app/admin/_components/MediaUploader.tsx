'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,application/pdf';
const MAX_MB = 10;

/** Drag-and-drop uploader that posts to /admin/api/media, then refreshes the library. */
export function MediaUploader() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    const tooBig = list.find(f => f.size > MAX_MB * 1024 * 1024);
    if (tooBig) return setMessage({ kind: 'err', text: `${tooBig.name} is larger than ${MAX_MB} MB.` });

    setBusy(true);
    setMessage(null);
    const fd = new FormData();
    list.forEach(f => fd.append('files', f));
    try {
      const res = await fetch('/admin/api/media', { method: 'POST', body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setMessage({ kind: 'ok', text: `Uploaded ${json.uploaded} file${json.uploaded === 1 ? '' : 's'}.` });
      router.refresh();
    } catch (err) {
      setMessage({ kind: 'err', text: err instanceof Error ? err.message : 'Upload failed' });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  }

  return (
    <div
      className={`adm-dropzone${drag ? ' drag' : ''}`}
      onDragOver={e => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={e => {
        e.preventDefault();
        setDrag(false);
        upload(e.dataTransfer.files);
      }}
    >
      <Icon name="upload" />
      <p style={{ fontWeight: 600, color: 'var(--ink)' }}>Drag images or PDFs here</p>
      <p className="hint" style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 14px' }}>
        PNG, JPG, WebP, GIF or PDF, up to {MAX_MB} MB each
      </p>
      <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={e => e.target.files && upload(e.target.files)} />
      <button type="button" className="adm-btn primary" disabled={busy} onClick={() => input.current?.click()}>
        {busy ? 'Uploading…' : 'Choose files'}
      </button>
      {message && (
        <p style={{ marginTop: 12, fontSize: 13.5, color: message.kind === 'ok' ? 'var(--ok)' : 'var(--err)' }} role="status">
          {message.text}
        </p>
      )}
    </div>
  );
}
