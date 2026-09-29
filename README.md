# CDSS_Website

Website, publications hub and admin dashboard for **CDSS (Nig.) Limited**. Built with [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript and [Supabase](https://supabase.com) (Postgres + Storage).

- **Public site:** pre-rendered static pages. Content comes from Supabase and each page refreshes automatically when content is saved in the admin.
- **Admin dashboard** (`/admin`): publications (Markdown editor with live preview), products, industries, vendor partners, clients, FAQs, site settings, media library, enquiry inbox, newsletter subscribers and user management.
- **Sign-in:** built-in email and password, plus a **one-time code from an authenticator app** (two-factor authentication) for every account. No third-party auth service.

## Getting started

Requires Node.js 20.9 or later and a Supabase project.

1. `npm install`
2. In the Supabase **SQL Editor**, run each file in `supabase/migrations/`, oldest first. They create the tables, lock them down with row-level security and add a public `media` storage bucket.
3. Copy `.env.example` to `.env.local` and fill it in (see [Environment](#environment)).
4. `npm run db:seed` loads the current website content into Supabase.
5. `npm run user:create -- --email you@company.com --name "Your Name" --role admin` creates the first admin. It prints a temporary password.
6. `npm run dev`, then sign in at http://localhost:3000/admin/login.

On first sign-in you will scan a QR code with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy, 1Password, …) and save 10 backup codes.

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run lint` · `npm run typecheck` | ESLint · TypeScript |
| `npm run db:seed` | Load the built-in content into empty tables (`-- --force` replaces all content) |
| `npm run user:create -- --email … --name … --role admin\|editor` | Create a user, or reset an existing user's password and two-factor setup |
| `npm run illustrations` | Regenerate the blueprint SVGs in `public/img/` |

## Environment

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes (production) | Live domain; used for canonical URLs, the sitemap and share links |
| `SUPABASE_URL` | yes | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | The **service_role** secret key. Server-only; never expose it. The anon key is not used. |
| `AUTH_SECRET` | yes | Random string, 32+ chars. Signs session cookies; changing it signs everyone out |
| `TOTP_ENCRYPTION_KEY` | yes | Random string, 32+ chars. Encrypts authenticator secrets; **keep it stable** (changing it forces everyone to set up 2FA again) |
| `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL` | optional | Email alerts for new enquiries |
| `CONTACT_WEBHOOK_URL` | optional | POST each enquiry as JSON to a CRM, Zapier, Slack, … |

Generate secrets with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`.

Without the Supabase variables the public site still builds and runs from the built-in content in `src/content/seed.ts`, but the admin is disabled.

## Security model

- **Database access:** the browser never talks to Supabase. All reads and writes go through the Next.js server using the service-role key. Every table has RLS enabled with no policies, so the public anon key has no access.
- **Accounts:**
  - Users live in `public.users`, with passwords hashed with scrypt.
  - Sessions are HS256-signed, httpOnly cookies (7 days), re-checked against the database on every request.
  - Changing a password or role, resetting 2FA, or using "Sign out everywhere" bumps `session_version`, which revokes all existing sessions.
- **Two-factor authentication:**
  - RFC 6238 TOTP (6 digits, 30 s).
  - Secrets are encrypted with AES-256-GCM, codes cannot be replayed, and failed attempts are rate-limited.
  - Backup codes are stored as SHA-256 hashes and each works once.
  - The password alone never grants access: it only issues a 10-minute "pending" cookie that is valid for the 2FA step.
- **Sign-in rate limits:** 5 failed attempts per email, or 20 per IP address, within 15 minutes.
- **Roles:**
  - **Editors** manage content, media, the inbox and subscribers.
  - **Admins** can also change site settings and manage users. The last admin cannot be deleted or demoted.
- **Uploads:** checked by file signature (PNG, JPG, WebP, GIF, PDF only), max 10 MB each.
- **Admin pages:** served with `noindex` and `no-store` headers.

**Locked out?**
- **Lost phone:** sign in with a backup code, or ask an admin to use *Reset two-factor* on the Users page.
- **The only admin is locked out:** run `npm run user:create -- --email their@email.com --role admin`. This resets their password and 2FA from the server.

## Project structure

```
src/
  app/
    (site)/               Public pages (home, products, industries, training, publications, about, contact)
    admin/
      login/              Sign-in, authenticator setup, code entry
      (panel)/            Dashboard and content management screens
      api/                Media upload, subscriber CSV export
      _components/        Admin UI (forms, Markdown editor, image picker, …)
      _lib/               Server actions, admin queries, validation helpers
    api/contact/          Contact + newsletter form endpoint
  components/             Public-site UI, shared Markdown renderer
  content/                Site navigation + seed content
  lib/                    Supabase client, content queries, auth (passwords, sessions, TOTP), types
  proxy.ts                Guards /admin/*
supabase/migrations/      Database schema
scripts/                  seed, create-user, illustration generator
```

## Writing articles

Articles are written in Markdown in the admin editor, which has a live preview. On top of standard Markdown:

- The first paragraph is styled as the introduction.
- `## Headings` build the article's "On this page" menu.
- End a blockquote with a `— Name, Title` line to credit the quote.
- Callouts and key-fact rows are available from the toolbar:

```
:::callout{icon=award title="Heading"}
Body text with [a link](/contact).
:::

:::facts
- **1989** First fact
- **2025** Second fact
:::
```

Raw HTML is never rendered.

## Deployment

Works on any Node host (Vercel, Netlify, Render, a VPS with `npm run build && npm start`). Set the environment variables above in the host's dashboard. Old `.html` URLs from the original static site permanently redirect to the new clean URLs.
