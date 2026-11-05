// Optional online store for a vendor page, by product slug: a banner card at the end of the capability grid.
// Clicking it loads the store into the page. The store's site only allows embedding on the origins it has
// approved (its frame-ancestors list), so anywhere else the click opens the store in a new tab instead.
export interface VendorStore {
  banner: string;
  bannerAlt: string;
  kicker: string;
  title: string;
  text: string;
  cta: string;
  /** store page; its host must also be allowed in frame-src (next.config.ts) */
  url: string;
  frameTitle: string;
  /** origins the store's site lets embed it */
  embedOrigins: string[];
}

const VENDOR_STORES: Record<string, VendorStore> = {
  bentley: {
    banner: '/brand/vendors/bentley-estore.jpg',
    bannerAlt: 'Bentley: 12-month software subscriptions',
    kicker: 'Buy online',
    title: 'Bentley annual subscriptions',
    text: 'Browse and buy 12-month subscriptions to Bentley software online.',
    cta: 'Shop Bentley subscriptions',
    // Bentley's product catalogue filtered to subscriptions, carrying CDSS's reseller ID (as Bentley's partner showcase links it)
    url: 'https://www.bentley.com/en/products/?utm_ResellerID=0004085030&Resellername=C.D.S.S.%20(Nig.)%20Limited&utm_Source=Showcase&filter-AccessAndTrialOptions=Subscription',
    frameTitle: 'Bentley software subscriptions',
    // checked against bentley.com's frame-ancestors on 5 November 2026
    embedOrigins: ['https://www.cdss-nigeria.com'],
  },
};

export const vendorStore = (slug: string): VendorStore | undefined => VENDOR_STORES[slug];
