import type { Metadata } from 'next';
import Link from 'next/link';
import { tel } from '@/content/site';
import { getProducts, getSettings } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from '@/components/forms/Forms';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Talk to CDSS about software licensing, hardware, training or technical support. Call +234 807 685 7178, email info@cdss-nigeria.com, or visit us in Gbagada, Lagos.',
  alternates: { canonical: '/contact' },
};

const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent('Shittu Animashaun Street, Gbagada Phase II, Lagos, Nigeria')}&output=embed`;

export default async function ContactPage() {
  const [products, { company, otherLines }] = await Promise.all([getProducts(), getSettings()]);
  return (
    <>
      <PageHero
        trail={[['Contact']]}
        eyebrow="Contact us"
        title="Speak to an expert."
        lede="Tell us what you're working on. We'll match you with the right software, hardware, training or support plan."
      />
      <section className="section">
        <div className="container split top contact-split">
          <div className="reveal">
            <div className="contact-list">
              <div className="contact-item">
                <div className="icon-box">
                  <Icon name="phone" />
                </div>
                <div>
                  <h3>Call us</h3>
                  {company.phones.map(p => (
                    <a href={tel(p)} style={{ display: 'block' }} key={p}>
                      {p}
                    </a>
                  ))}
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-box">
                  <Icon name="mail" />
                </div>
                <div>
                  <h3>Email</h3>
                  <a href={`mailto:${company.email}`}>{company.email}</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-box">
                  <Icon name="pin" />
                </div>
                <div>
                  <h3>Visit</h3>
                  <p>{company.address}</p>
                  <p>{company.poBox}</p>
                </div>
              </div>
              <div className="contact-item">
                <div className="icon-box">
                  <Icon name="monitor" />
                </div>
                <div>
                  <h3>Existing client?</h3>
                  <p>
                    For urgent technical issues, see{' '}
                    <Link href="/training#remote" style={{ color: 'var(--brand)', fontWeight: 600 }}>
                      remote support
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
            <div className="map-frame" style={{ marginTop: 14 }}>
              <iframe title="CDSS office location, Gbagada, Lagos" src={MAP_SRC} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <div className="reveal">
            <ContactForm productOptions={[...products.map(p => p.name), ...otherLines]} />
          </div>
        </div>
      </section>
    </>
  );
}
