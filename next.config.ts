import type { NextConfig } from 'next';

const dev = process.env.NODE_ENV !== 'production';

// Content-Security-Policy. 'unsafe-inline' scripts are needed for Next.js's inline hydration scripts on
// statically rendered pages (nonces would force every page to render per request). Dev adds eval and the
// hot-reload websocket. Images may come from any https host because the admin accepts pasted image links.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${dev ? ' ws: wss:' : ''}`,
  // webinar recordings (YouTube), the office map on /contact (Google Maps) and the Bentley subscription store on /products/bentley
  'frame-src https://www.youtube-nocookie.com https://www.youtube.com https://www.google.com https://www.bentley.com',
  "frame-ancestors 'self'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(dev ? [] : ['upgrade-insecure-requests']),
].join('; ');

// The WordPress site this one replaces at www.cdss-nigeria.com used these page addresses (its sitemap,
// November 2026). Redirecting them keeps old links and search results working after the domain moves.
const WORDPRESS_PAGES: [string, string][] = [
  ['/about-us', '/about'],
  ['/about-cdss/software-solutions', '/products'],
  ['/about-cdss', '/about'],
  ['/our-values', '/about/our-values'],
  ['/client-base', '/about/client-base'],
  ['/vendor-partners', '/about/vendor-partners'],
  ['/news', '/about/news'],
  ['/bureau-services', '/about/bureau-services'],
  ['/contact-us', '/contact'],
  ['/training-centre', '/training'],
  ['/bentley-institute-training', '/training'],
  ['/hardware', '/products'],
  ['/other-software', '/products'],
  ['/:vendor(autodesk|bentley|ansys|technical-toolboxes|contex|avision)', '/products/:vendor'],
  ['/masterseries', '/about/vendor-partners'],
  // no downloads page on the new site; publications is the nearest match
  ['/downloads', '/publications'],
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Every image is already rendered unoptimized; switching the optimizer off removes the /_next/image endpoint,
  // the component behind several published Next.js advisories.
  images: { unoptimized: true },
  // The site used to be plain HTML files; keep every old URL working.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:section(products|about|industries|publications|training|contact)/index.html', destination: '/:section', permanent: true },
      { source: '/:section(products|about|industries|publications)/:slug([a-z0-9-]+).html', destination: '/:section/:slug', permanent: true },
      ...WORDPRESS_PAGES.map(([source, destination]) => ({ source, destination, permanent: true })),
    ];
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: csp },
    ];
    return [
      { source: '/:path*', headers: security },
      // keep the admin out of search engines and caches
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

export default nextConfig;
