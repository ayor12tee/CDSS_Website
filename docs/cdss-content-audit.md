# CDSS website content audit — October 2026

Internal working document. Not published on the site.

- **Audited:** 23–24 October 2026, branch `content-updates`
- **Sources compared:** live deployment (https://cdss-website-henna.vercel.app), local build of this branch, the Supabase content tables, and `src/content/seed.ts`
- **Companion documents:** [technology portfolio review](cdss-technology-portfolio-review.md), [research evidence](cdss-content-research.md)

## How content reaches the site

Two kinds of content, and they are updated differently:

| Content | Where it lives | How a change goes live |
| --- | --- | --- |
| Products, industries, vendor partners, clients, FAQs, publications, hero copy, company details, "other lines" | Supabase (edited in `/admin`); `seed.ts` holds the same content as the default and fallback | Edit in `/admin`, or edit `seed.ts` and run `npm run db:sync -- --apply` |
| Page layouts and fixed copy (About pages, Training, Bureau Services, BIM, homepage sections, navigation, metadata) | `src/app/(site)/**`, `src/content/site.ts`, `src/app/layout.tsx` | Deploy |

Before this audit, the database matched `seed.ts` except for two additions made in `/admin` (client "Advanced Engineering Consultants" and other line "Peachel Innovations"). Both were copied into `seed.ts` so the two stay in step.

**Deployment order:** deploy this branch first, then run `npm run db:sync -- --apply`. The sync writes the new industry photo paths, which only exist on the live site after the deploy.

## Crawl coverage

Breadth-first crawl of every internal link from `/`, plus every `sitemap.xml` entry. Run against both the live site and the local build.

| | Live | Local |
| --- | --- | --- |
| Unique public paths | 34 | 34 |
| Non-200 responses | 0 | 0 |
| Pages without exactly one `<h1>` | 0 | 0 |
| Images without `alt` | 0 | 0 |
| Broken external links | 0 (AnyDesk returns 403 to scripts, 200 to browsers) | same |
| Duplicate page titles (outside publication filters) | 0 | 0 |

The live and local route lists and page titles matched exactly; the live site runs `main`, so differences are content only.

Non-HTML routes checked: `/sitemap.xml` (31 URLs), `/robots.txt` (blocks `/api/` and `/admin`), `/opengraph-image`, `/publications/[slug]/opengraph-image`, the 404 page.

Excluded: `/admin/*` (private, behind sign-in and blocked in robots.txt); `/api/contact` (POST endpoint, not content).

## Review outcomes by route

Outcomes: **KEEP** (no change), **CORRECT** (factual or naming error fixed), **UPDATE** (outdated, now current), **REFINE** (wording improved), **FLAG** (needs CDSS confirmation, see bottom). "DB" means the fix goes live through `db:sync`.

| Route | Type | Outcome | Notes | Status |
| --- | --- | --- | --- | --- |
| `/` | Home | KEEP / FLAG | Carousel, services, approach, workflows and FAQ copy kept. Stats "35+ years as authorised Autodesk reseller" and "20+ partners" flagged (17 partner records plus 3 other lines). Hero paragraph uses "world-class" (owner-supplied copy, kept). | Done |
| `/products` | Listing | CORRECT | "ANSYS" → "Ansys" in metadata | Done |
| `/products/autodesk` | Vendor | REFINE (DB) | "supports the full Autodesk AEC and manufacturing line-up" → "Autodesk's AEC and manufacturing software" (no evidence CDSS carries the whole catalogue) | Ready to sync |
| `/products/bentley` | Vendor | UPDATE / CORRECT (DB) | AutoPLANT (retired 2024) removed; ProSteel/ProConcrete → ProStructures; ContextCapture → iTwin Capture Modeler; OpenRoads → OpenRoads Designer; "Plaxis" → "PLAXIS"; added a PLAXIS line to "uses" so it matches the product chips | Ready to sync |
| `/products/seequent` | Vendor | KEEP | Accurate; "part of Bentley Systems" verified | — |
| `/products/ansys` | Vendor | CORRECT / UPDATE (DB) | Name styling "Ansys"; now part of Synopsys (July 2025); "the industry standard" → "one of the most widely used engineering simulation portfolios" | Ready to sync |
| `/products/technical-toolboxes` | Vendor | KEEP | Accurate at category level; specific product names recorded in portfolio review | — |
| `/products/contex` | Hardware | KEEP (DB: GTX naming) | 24/36/42/44/60″ widths verified against Contex ranges. GTX product names corrected in "why" | Ready to sync |
| `/products/avision` | Hardware | KEEP | — | — |
| `/industries` | Listing | KEEP / FLAG | "Vendor-certified instructors" flagged | — |
| `/industries/oil-gas` | Industry | UPDATE (DB) | AutoPLANT → OpenPlant (successor); "ANSYS" → "Ansys" | Ready to sync |
| `/industries/aec` | Industry | CORRECT (DB) | "rebar detailing with InnoDraw" removed (InnoDraw is a measuring tool); ProSteel → ProStructures; "Robot" → "Robot Structural Analysis" | Ready to sync |
| `/industries/government-gis` | Industry | UPDATE / CORRECT (DB) | ContextCapture → iTwin Capture Modeler; "ClearEdge3D" → "ClearEdge3D EdgeWise"; GTX names | Ready to sync |
| `/industries/mining-geoscience` | Industry | KEEP | Photo only (already shipped in code) | — |
| `/training` | Service | UPDATE / CORRECT / FLAG | "ANSYS" → "Ansys"; Bentley Institute → Bentley training partner; Zigurat → ZIGURAT Institute of Technology. Training credentials and support tiers flagged | Done |
| `/publications` + 3 category filters | Listing | KEEP | — | — |
| `/publications/bentley-top-partner-africa-2025` | News | UPDATE (DB) | Award and Allan Murphy quote verified. Product list updated (OpenPlant, ProStructures, iTwin Capture Modeler); Bentley Institute; Ansys. News itself unchanged | Ready to sync |
| `/publications/thirty-five-years-of-cad-in-nigeria` | Insight | UPDATE / CORRECT (DB) | Hexagon PPM → Octave; InnoDraw moved from "design and engineering" to "capture"; Ansys. 1992 Chevron claim flagged | Ready to sync |
| `/publications/digitising-paper-drawing-archives` | Guide | CORRECT (DB) | GTX product names | Ready to sync |
| `/publications/cad-to-bim-transition-guide` | Guide | KEEP | ISO 19650 reference correct | — |
| `/publications/pipeline-integrity-software-upstream` | Insight | CORRECT (DB) | Ansys styling; ASME B31G reference correct | Ready to sync |
| `/publications/simulation-before-construction` | Insight | CORRECT (DB) | Ansys styling (text and tag) | Ready to sync |
| `/about` | Company | KEEP | 1989 incorporation and founder verified (Autodesk partner profile, Bentley post) | — |
| `/about/profile` | Company | KEEP | Contex widths verified | — |
| `/about/client-base` | Company | KEEP | Heading updated earlier this branch | — |
| `/about/our-values` | Company | KEEP | Country list matches Autodesk partner profile | — |
| `/about/vendor-partners` | Company | CORRECT / UPDATE (DB) | Ansys; Octave (formerly Hexagon PPM); GTX, ClearEdge3D and InnoDraw descriptions corrected; Bentley training; ZIGURAT. VSee and BeyondWare flagged | Ready to sync |
| `/about/bureau-services` | Service | CORRECT | "up to A0+ (44″ wide)" was inconsistent (A0+ is about 36″, and the page also says 60″) → "from A4 to A0+ and wider"; GTX names | Done |
| `/about/news` | Listing | KEEP | — | — |
| `/bim-implementation` | Service | KEEP | Tools list accurate | — |
| `/contact` | Contact | KEEP | Details match settings | — |
| Site-wide (nav, footer, metadata, OG image, structured data) | Shared | CORRECT / REFINE | "ANSYS" → "Ansys" in nav, root metadata and share image; `addressLocality` added to Organization structured data | Done |

## Validation

- `npx tsc --noEmit` and `eslint` on changed files: pass
- `npm run build`: see the final report for this run's result
- Crawl after changes: see the final report
- `npm run db:sync` (preview only): 52 field changes across settings, 7 products, 4 industries, 7 partners, 2 FAQs, 5 publications. No inserts, no deletions

## Items flagged for CDSS confirmation

1. **Founding year.** The site and Autodesk's partner profile say incorporated June 1989; CDSS's original website (cdss-nigeria.com) says "since 1991". The site keeps 1989.
2. **First AutoCAD installation, Chevron, 1992.** Autodesk's profile only says CDSS introduced AutoCAD to Nigeria "in the early 1990s". No public source names Chevron or 1992.
3. **"Authorised reseller or partner for every vendor line"** (home FAQ). Verified for Autodesk and Bentley (partner directories); not verifiable publicly for the others.
4. **Octave (formerly Hexagon PPM).** Hexagon spun this business off as Octave Intelligence plc in May 2026. Confirm CDSS's reseller agreement carried over.
5. **InnoDraw.** The only InnoDraw found is a laser-measurement drawing tool (sold with Leica DISTO). If CDSS sells a different product of that name, tell us and the description will be restored.
6. **BeyondWare.** No company of this name found. Confirm the name and what it supplies.
7. **VSee** (telehealth software). Confirm it is still offered; it is outside CDSS's engineering focus.
8. **Bentley training partner status.** Bentley's training arm was the Bentley Institute; the academic side is now Bentley Education. Confirm CDSS's current training-partner designation.
9. **Training and support claims:** "vendor-certified instructors across every product line", the three support tiers (6 site visits a year for Tier 2), Zoom/Teams delivery, ZIGURAT postgraduate partnership.
10. **Bureau scanner width.** Confirm the widest sheet the bureau service handles (the page previously said 44″, the equipment list says 60″).
11. **Stats:** "35+ years as an authorised Autodesk reseller" (continuous since December 1989?) and "20+ vendor, training and technology partners".
12. **Contex "trusted in over 100 countries".** Contex's own claim; not independently verified.
