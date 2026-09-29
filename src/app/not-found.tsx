import Link from 'next/link';
import { SiteChrome } from '@/components/layout/SiteChrome';
import { Icon } from '@/components/ui/Icon';

export default function NotFound() {
  return (
    <SiteChrome>
      <section className="page-hero">
        <div className="blueprint" />
        <div className="container error-page">
          <div>
            <div className="code chrome-text">404</div>
            <h1 style={{ margin: '12px auto 0' }}>We couldn&apos;t find that page.</h1>
            <p className="lede" style={{ margin: '18px auto 0' }}>
              It may have moved when we updated the site. Try one of these instead.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-light" href="/">
                Back to home
                <Icon name="arrow" />
              </Link>
              <Link className="btn btn-ghost" href="/products">
                Our solutions
              </Link>
              <Link className="btn btn-ghost" href="/contact">
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
