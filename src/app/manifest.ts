import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CDSS (Nig.) Limited',
    short_name: 'CDSS',
    start_url: '/',
    display: 'browser',
    background_color: '#0d0a86',
    theme_color: '#0d0a86',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
