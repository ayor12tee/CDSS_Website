import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The site used to be plain HTML files; keep every old URL working.
  async redirects() {
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/:section(products|about|industries|publications|training|contact)/index.html', destination: '/:section', permanent: true },
      { source: '/:section(products|about|industries|publications)/:slug([a-z0-9-]+).html', destination: '/:section/:slug', permanent: true },
    ];
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ];
    return [
      { source: '/:path*', headers: security },
      // keep the admin out of search engines and caches
      { source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }, { key: 'Cache-Control', value: 'no-store' }] },
    ];
  },
};

export default nextConfig;
