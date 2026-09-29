import type { Metadata } from 'next';
import { getPartners } from '@/lib/content';
import { PageHero } from '@/components/ui/PageHero';
import { InfoCard } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Vendor Partners',
  description: 'CDSS is an authorised vendor and distributor for Autodesk, Bentley, Seequent, ANSYS, Technical Toolboxes, Contex, Avision, CYPE, MasterSeries, GTX and more.',
  alternates: { canonical: '/about/vendor-partners' },
};

export default async function VendorPartnersPage() {
  const vendorPartners = await getPartners();
  return (
    <>
      <PageHero
        trail={[['About', '/about'], ['Vendor Partners']]}
        eyebrow="Vendor partners"
        title="One partner, every major engineering software and hardware line."
        lede="CDSS partners with industry leaders from around the world to give you a broad range of tools. As an authorised vendor and distributor for Nigeria and the wider West African market, CDSS is a one-stop shop for the Architecture, Engineering, Construction and Oil & Gas industries."
      />
      <section className="section">
        <div className="container">
          <div className="grid-3 reveal-stagger">
            {vendorPartners.map(v => (
              <InfoCard
                key={v.id}
                href={v.productSlug ? `/products/${v.productSlug}` : undefined}
                kicker={v.tag}
                title={v.name}
                text={v.description}
                cta={v.productSlug ? 'View product page' : undefined}
              />
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
