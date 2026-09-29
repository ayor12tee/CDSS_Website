import Link from 'next/link';
import { tel } from '@/content/site';
import { getSettings } from '@/lib/content';
import { Icon } from '@/components/ui/Icon';

export async function CtaBand() {
  const { company } = await getSettings();
  return (
    <section className="cta-band">
      <div className="blueprint" />
      <div className="container">
        <div>
          <span className="eyebrow">Get in touch</span>
          <h2 className="h2">Ready to talk about your next project?</h2>
          <p>Tell us what you are working on. We will recommend the right software, hardware, training or support plan.</p>
        </div>
        <div className="cta-actions">
          <Link className="btn btn-light" href="/contact">
            Speak to an Expert
            <Icon name="arrow" />
          </Link>
          <a className="btn btn-ghost" href={tel(company.phones[0])}>
            <Icon name="phone" />
            Call {company.phones[0]}
          </a>
        </div>
      </div>
    </section>
  );
}
