import type { ReactNode } from 'react';
import { buildNav, SITE_URL } from '@/content/site';
import { getIndustries, getProducts, getSettings } from '@/lib/content';
import { JsonLd } from '@/components/ui/primitives';
import { Header } from './Header';
import { Footer } from './Footer';
import { RevealObserver } from './Motion';

/** Public-site header, footer and organisation structured data around page content. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [settings, industries, products] = await Promise.all([getSettings(), getIndustries(), getProducts()]);
  const { company } = settings;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: company.name,
          legalName: company.legal,
          url: SITE_URL,
          logo: `${SITE_URL}/brand/cdss-logo.png`,
          foundingDate: '1989',
          email: company.email,
          telephone: company.phones[0],
          address: { '@type': 'PostalAddress', streetAddress: company.address, addressCountry: 'NG' },
        }}
      />
      <Header nav={buildNav(industries)} company={company} announcement={settings.announcement} />
      <main id="main">{children}</main>
      <Footer company={company} industries={industries} products={products} />
      <RevealObserver />
    </>
  );
}
