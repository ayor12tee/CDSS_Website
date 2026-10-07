// Site URL and navigation. Company details and other editable copy live in Settings (/admin/settings).
import type { Industry } from '@/lib/types';
import { CATEGORIES } from '@/lib/types';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.cdss-nigeria.com').replace(/\/$/, '');

export const tel = (phone: string) => 'tel:' + phone.replace(/\s+/g, '');

export type NavLink = { title: string; desc: string; href: string };

export type NavItem =
  | {
      key: string;
      label: string;
      href: string;
      type: 'mega';
      cols: number;
      groups: { heading: string; links: NavLink[] }[];
      feature: { img: string; small: string; title: string; href: string; cta: string };
      all: { title: string; href: string };
    }
  | { key: string; label: string; href: string; type: 'dropdown'; links: NavLink[] };

/** Main navigation. Industry links come from the database so new industries appear automatically. */
export function buildNav(industries: Industry[]): NavItem[] {
  const industryLinks = industries.map(i => ({ title: i.name, desc: i.summary, href: `/industries/${i.slug}` }));
  const half = Math.ceil(industryLinks.length / 2);
  return [
    {
      key: 'solutions',
      label: 'Solutions',
      href: '/products',
      type: 'mega',
      cols: 3,
      groups: [
        {
          heading: 'Design & Engineering',
          links: [
            { title: 'Autodesk', desc: 'AutoCAD, Revit, Civil 3D, Inventor', href: '/products/autodesk' },
            { title: 'Bentley Systems', desc: 'MicroStation, STAAD.Pro, OpenPlant, AutoPIPE', href: '/products/bentley' },
            { title: 'Seequent', desc: 'Leapfrog Geo, MX Deposit, Oasis montaj', href: '/products/seequent' },
          ],
        },
        {
          heading: 'Simulation & Pipeline',
          links: [
            { title: 'ANSYS', desc: 'Structural, thermal & CFD simulation', href: '/products/ansys' },
            { title: 'Technical Toolboxes', desc: 'Pipeline integrity & design', href: '/products/technical-toolboxes' },
            { title: 'All vendor partners', desc: 'Every authorised vendor relationship', href: '/about/vendor-partners' },
          ],
        },
        {
          heading: 'Hardware & Services',
          links: [
            { title: 'Contex', desc: 'Large-format scanners up to 60″', href: '/products/contex' },
            { title: 'Avision', desc: 'A3/A4 document scanners', href: '/products/avision' },
            { title: 'Bureau Services', desc: 'Scanning, conversion & archiving', href: '/about/bureau-services' },
            { title: 'BIM Implementation', desc: 'Workflows, CDE setup & role-based training', href: '/bim-implementation' },
          ],
        },
      ],
      feature: {
        img: 'award',
        small: 'Bentley Systems · 2025',
        title: 'Top-Performing Partner in Sub-Saharan Africa',
        href: '/publications/bentley-top-partner-africa-2025',
        cta: 'Read the news',
      },
      all: { title: 'View all solutions', href: '/products' },
    },
    {
      key: 'industries',
      label: 'Industries',
      href: '/industries',
      type: 'mega',
      cols: 2,
      groups: [
        { heading: 'Industries we serve', links: industryLinks.slice(0, half) },
        { heading: ' ', links: industryLinks.slice(half) },
      ],
      feature: {
        img: 'industry-oil-gas',
        small: 'Since 1992',
        title: 'Engineering technology for the sectors that build Nigeria',
        href: '/industries',
        cta: 'All industries',
      },
      all: { title: 'All industries', href: '/industries' },
    },
    {
      key: 'training',
      label: 'Training & Support',
      href: '/training',
      type: 'dropdown',
      links: [
        { title: 'Certified Training', desc: 'In person in Lagos or online via Zoom & Teams', href: '/training#training' },
        { title: 'Support Plans', desc: 'Three tiers, from phone & email to on-site', href: '/training#support' },
        { title: 'Remote Support', desc: 'Fast diagnosis via AnyDesk', href: '/training#remote' },
      ],
    },
    {
      key: 'publications',
      label: 'Publications',
      href: '/publications',
      type: 'dropdown',
      links: [
        { title: 'All Publications', desc: 'The latest from CDSS', href: '/publications' },
        { title: 'Insights', desc: CATEGORIES.insights.blurb, href: '/publications?category=insights' },
        { title: 'Guides', desc: CATEGORIES.guides.blurb, href: '/publications?category=guides' },
        { title: 'News', desc: CATEGORIES.news.blurb, href: '/publications?category=news' },
      ],
    },
    {
      key: 'about',
      label: 'About',
      href: '/about',
      type: 'dropdown',
      links: [
        { title: 'About CDSS', desc: '35+ years of engineering technology', href: '/about' },
        { title: 'Company Profile', desc: 'What we offer and how we deliver', href: '/about/profile' },
        { title: 'Client Base', desc: 'Organisations that rely on CDSS', href: '/about/client-base' },
        { title: 'Our Values', desc: 'The principles behind the business', href: '/about/our-values' },
        { title: 'Vendor Partners', desc: 'Every line we are authorised to carry', href: '/about/vendor-partners' },
        { title: 'Contact Us', desc: 'Talk to our team', href: '/contact' },
      ],
    },
  ];
}

/** Which top-level nav item a pathname belongs to. */
export function navKeyFor(pathname: string): string {
  if (pathname.startsWith('/products') || pathname.startsWith('/about/bureau-services') || pathname.startsWith('/bim-implementation')) return 'solutions';
  if (pathname.startsWith('/industries')) return 'industries';
  if (pathname.startsWith('/training')) return 'training';
  if (pathname.startsWith('/publications') || pathname.startsWith('/about/news')) return 'publications';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  return 'home';
}
