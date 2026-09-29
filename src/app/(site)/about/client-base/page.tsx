import type { Metadata } from 'next';
import { getClientGroups } from '@/lib/content';
import { PageHero } from '@/components/ui/PageHero';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Client Base',
  description:
    'CDSS clients include key players across oil & gas, government and its agencies, educational institutions, engineering consultancies, contractors and utilities.',
  alternates: { canonical: '/about/client-base' },
};

export default async function ClientBasePage() {
  const clientGroups = await getClientGroups();
  return (
    <>
      <PageHero
        trail={[['About', '/about'], ['Client Base']]}
        eyebrow="Client base"
        title="Trusted across oil & gas, government and engineering consultancy."
        lede="Over the years CDSS has built a strong client base. It includes government and its agencies, educational institutions, architectural and engineering consultancies, contractors, property developers, utilities and other institutions. Below is a sample of the organisations that rely on CDSS."
      />
      <section className="section">
        <div className="container">
          {clientGroups.map(([group, list]) => (
            <div className="client-group reveal" key={group}>
              <h3>{group}</h3>
              <div className="client-grid">
                {list.map(c => (
                  <div className="client-chip" key={c}>
                    {c}
                  </div>
                ))}
              </div>
            </div>
          ))}
          <p className="fine-print" style={{ marginTop: 40 }}>
            Client names come from CDSS&apos;s own public client history. Each organisation&apos;s logo is its own trademark and is deliberately not reproduced
            here. Names are listed as a factual record of relationships, not as endorsements.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
