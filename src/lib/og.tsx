// Shared Open Graph card (1200×630) rendered with next/og.
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

export async function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  const logo = await readFile(path.join(process.cwd(), 'public', 'brand', 'cdss-logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          color: '#fff',
          backgroundColor: '#030417',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(36,27,184,.75), transparent 55%), linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 60px 60px, 60px 60px',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={262} height={60} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: '#8f95ea', fontWeight: 700 }}>{eyebrow}</div>
          <div style={{ fontSize: title.length > 70 ? 54 : 64, fontWeight: 800, lineHeight: 1.1, marginTop: 20, maxWidth: 1000, letterSpacing: -1.5 }}>{title}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24, color: '#aab0c9', borderTop: '1px solid rgba(255,255,255,.18)', paddingTop: 24 }}>
          <span>{footer}</span>
          <span>cdss-nigeria.com</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
