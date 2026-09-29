import Image from 'next/image';
import Link from 'next/link';
import { tel } from '@/content/site';
import type { Industry, Product, SiteSettings } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { BackToTop } from './BackToTop';

type Col = { title: string; links: [string, string][] };

interface FooterProps {
  company: SiteSettings['company'];
  industries: Industry[];
  products: Product[];
}

export function Footer({ company, industries, products }: FooterProps) {
  const columns: Col[] = [
    { title: 'Solutions', links: [...products.map(p => [p.name, `/products/${p.slug}`] as [string, string]), ['Bureau Services', '/about/bureau-services']] },
    { title: 'Industries', links: [...industries.map(i => [i.name, `/industries/${i.slug}`] as [string, string]), ['All industries', '/industries']] },
    {
      title: 'Resources',
      links: [
        ['Publications', '/publications'],
        ['Insights', '/publications?category=insights'],
        ['Guides', '/publications?category=guides'],
        ['News', '/about/news'],
        ['Training', '/training#training'],
        ['Support Plans', '/training#support'],
        ['Remote Support', '/training#remote'],
      ],
    },
    {
      title: 'Company',
      links: [
        ['About CDSS', '/about'],
        ['Company Profile', '/about/profile'],
        ['Client Base', '/about/client-base'],
        ['Our Values', '/about/our-values'],
        ['Vendor Partners', '/about/vendor-partners'],
        ['Contact Us', '/contact'],
      ],
    },
  ];

  return (
    <>
      <footer className="site-footer">
        <div className="container footer-top">
          <div className="footer-brand">
            <Image src="/brand/cdss-logo.png" alt="CDSS" width={166} height={38} />
            <p>{company.legal}. Nigeria&apos;s first CADD technology company. Since 1989 we have supplied engineering software, hardware, training and support.</p>
            <div className="footer-contact">
              <div>
                <Icon name="pin" />
                <span>
                  {company.address}
                  <br />
                  {company.poBox}
                </span>
              </div>
              <a href={tel(company.phones[0])}>
                <Icon name="phone" />
                <span>{company.phones.join(' · ')}</span>
              </a>
              <a href={`mailto:${company.email}`}>
                <Icon name="mail" />
                <span>{company.email}</span>
              </a>
            </div>
          </div>
          {columns.map(col => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href}>{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container footer-bottom">
          <div>
            © {new Date().getFullYear()} {company.legal}. All rights reserved.
          </div>
          <nav aria-label="Footer">
            <Link href="/contact">Contact</Link>
            <Link href="/training#remote">Remote Support</Link>
            <Link href="/publications">Publications</Link>
          </nav>
        </div>
      </footer>
      <BackToTop />
    </>
  );
}
