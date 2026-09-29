import type { Metadata } from 'next';
import { Icon } from '@/components/ui/Icon';
import { ActionForm } from '../../_components/ActionForm';
import { ConfirmButton, CopyText } from '../../_components/buttons';
import { TextField } from '../../_components/fields';
import { MediaUploader } from '../../_components/MediaUploader';
import { PageHeader } from '../../_components/PageHeader';
import { deleteMedia, updateMediaAlt } from '../../_lib/media-actions';
import { listMedia } from '../../_lib/queries';

export const metadata: Metadata = { title: 'Media library' };

const size = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default async function MediaAdmin() {
  const media = await listMedia();
  return (
    <>
      <PageHeader title="Media library" />
      <div className="adm-content">
        <MediaUploader />
        {media.length === 0 ? (
          <section className="adm-card adm-empty">
            <h3>No files yet</h3>
            <p>Uploaded images can be used as article covers, industry images or inside articles. PDFs can be linked from articles.</p>
          </section>
        ) : (
          <div className="adm-media-grid">
            {media.map(m => (
              <div className="adm-media" key={m.id}>
                <a className="thumb" href={m.url} target="_blank" rel="noreferrer">
                  {m.mimeType.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.alt} loading="lazy" />
                  ) : (
                    <Icon name="file" />
                  )}
                </a>
                <div className="meta">
                  <strong title={m.filename}>{m.filename}</strong>
                  <span style={{ color: 'var(--muted)' }}>
                    {size(m.sizeBytes)} · {new Date(m.createdAt).toLocaleDateString('en-GB')}
                  </span>
                  {m.mimeType.startsWith('image/') && (
                    <ActionForm action={updateMediaAlt} compact submitLabel="Save alt text">
                      <input type="hidden" name="id" value={m.id} />
                      <TextField name="alt" label="Alt text" defaultValue={m.alt} placeholder="Describe the image" />
                    </ActionForm>
                  )}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <CopyText text={m.url} />
                    <ConfirmButton action={deleteMedia.bind(null, m.id)} label="Delete" size="sm" confirm={`Delete ${m.filename}? Pages using it will show a broken image.`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
