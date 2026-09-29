import { NewsletterForm } from './Forms';

export function Newsletter() {
  return (
    <div className="newsletter reveal">
      <div>
        <span className="eyebrow on-dark">Newsletter</span>
        <h2>Engineering technology, in your inbox.</h2>
        <p>Product updates, training schedules and practical guides from the CDSS team. No spam, and you can unsubscribe at any time.</p>
      </div>
      <NewsletterForm />
    </div>
  );
}
