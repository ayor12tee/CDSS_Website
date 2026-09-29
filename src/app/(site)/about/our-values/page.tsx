import type { Metadata } from 'next';
import type { IconName } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { Eyebrow, InfoCard } from '@/components/ui/primitives';
import { CtaBand } from '@/components/layout/CtaBand';

export const metadata: Metadata = {
  title: 'Our Values',
  description: 'Integrity, partnership, ahead-of-the-curve technology and a pan-African footprint — the values that have kept clients with CDSS for 35+ years.',
  alternates: { canonical: '/about/our-values' },
};

const VALUES: [IconName, string, string][] = [
  ['shield', 'Integrity & Equity', 'We hold every client relationship to strict standards of honesty, fairness and quality service. That standard has kept clients with CDSS for over three decades.'],
  ['handshake', 'Partnership Over Transactions', 'We see ourselves as facilitators and consultants for our clients’ growth, not just a software vendor. We provide the best available solutions, then train and support clients in using them.'],
  ['target', 'Ahead-of-the-Curve Technology', 'From the start, CDSS has looked for technologies ahead of the market’s needs and introduced them to Nigeria, together with the skills to use them.'],
  ['globe', 'A Pan-African Footprint', 'Through partnerships built over 30+ years, CDSS now works across East, West and Southern Africa, including Kenya, Zambia, Angola, South Africa, Ghana and, more recently, Côte d’Ivoire.'],
];

const COUNTRIES = ['Nigeria', 'Ghana', "Côte d'Ivoire", 'Kenya', 'Zambia', 'Angola', 'South Africa'];

export default function ValuesPage() {
  return (
    <>
      <PageHero
        trail={[['About', '/about'], ['Our Values']]}
        eyebrow="Our values"
        title="What has kept clients with us for 35+ years."
        lede="We aim to offer our clients the best solutions available in the industry, and to partner with them as their business grows. That means more than supplying a product: we also train and support the people who use it. With decades of experience building solutions around each client, CDSS makes sure you're well supported as you compete."
      />
      <section className="section">
        <div className="container grid-2 reveal-stagger">
          {VALUES.map(([icon, title, text]) => (
            <InfoCard key={title} icon={icon} title={title} text={text} />
          ))}
        </div>
      </section>
      <section className="section-sm bg-soft">
        <div className="container split">
          <div className="reveal">
            <Eyebrow>Footprint</Eyebrow>
            <h2 className="h3">Where we work</h2>
          </div>
          <div className="chip-list reveal">
            {COUNTRIES.map(c => (
              <span className="chip" key={c}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
