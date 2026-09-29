import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'CDSS (Nig.) Limited — engineering software, hardware, training and support since 1989';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({
    eyebrow: "Nigeria's first CADD technology company",
    title: 'Powering industry through technology.',
    footer: 'Autodesk · Bentley · Seequent · ANSYS · Technical Toolboxes · Contex',
  });
}
