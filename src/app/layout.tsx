import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { SITE_URL } from '@/content/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-jakarta', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'CDSS (Nig.) Limited | Engineering Software, Hardware, Training & Support Since 1989',
    template: '%s | CDSS (Nig.) Limited',
  },
  description:
    "Nigeria's first CADD technology company. Authorised partner for Autodesk, Bentley, Seequent, ANSYS, Technical Toolboxes, Contex and more — with certified training and local support since 1989.",
  applicationName: 'CDSS (Nig.) Limited',
  icons: { icon: '/brand/cdss-logo.png' },
  openGraph: { type: 'website', siteName: 'CDSS (Nig.) Limited', locale: 'en_NG' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0d0a86' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content is never hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
