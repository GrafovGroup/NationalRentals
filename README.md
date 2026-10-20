# National Rentals — Phases 1A–1D

Bilingual Canadian commercial rental coordination website operated by Grafov Group Inc. This repository implements the scopes in `PHASE_1A_CODEX_MASTER_PROMPT.md`, `PHASE_1B_CODEX_MASTER_PROMPT.md`, `PHASE_1C_CODEX_MASTER_PROMPT.md` and `PHASE_1D_CODEX_MASTER_PROMPT.md`: quote inquiries, not bookings or checkout.

## Run locally

Use Node.js 22.16+ and pnpm 11.25.0 (the version pinned in `package.json`).

```sh
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

Open `http://localhost:3000/en/` or `/fr/`. `/` redirects to English. For local form testing, set `NEXT_PUBLIC_SITE_URL=http://localhost:3000` in `.env.local`, matching the actual browser origin. Without storage configuration the form returns an honest error; with private storage configured and email credentials empty it saves the inquiry with notification pending. Tests use mocked email responses and send no real messages.

```sh
pnpm lint
pnpm typecheck
pnpm test
pnpm check:assets
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Browser tests start a production server on port 3000 if one is not already running. Use `PLAYWRIGHT_EXECUTABLE_PATH` to use an existing compatible Chromium executable. Build before browser tests. Tests cover all 218 pages, desktop/mobile navigation, language context, selected equipment, form validation, provider failure/success UI, sitemap and automated accessibility.

## Production operation

Deploy as a Next.js Node application, not a static export: `/api/quote/` requires server execution. `pnpm build && pnpm start` is the production command. Set `NEXT_PUBLIC_SITE_URL` **before building** to the final HTTPS origin. No deployment is performed by this repository alone.

### Quote delivery

- Recipient is centrally fixed to **info@nationalrentals.ca** in `src/lib/config.ts`.
- Configure `RESEND_API_KEY` and `QUOTE_FROM_EMAIL` with a verified sending domain. Never commit credentials.
- Configure an Upstash-compatible REST Redis service with `RATE_LIMIT_REDIS_URL` and `RATE_LIMIT_REDIS_TOKEN` for shared production rate limits.
- Configure `TRUSTED_CLIENT_IP_HEADER` only if the ingress proxy strips/overwrites client-provided values. Without it, all clients share a conservative rate-limit bucket; this is secure but operationally restrictive.
- `RATE_LIMIT_MODE=single-instance` deliberately opts into in-memory limiting for a single long-lived Node server. It resets on process restart and is unsuitable for serverless or multiple replicas. Production otherwise fails closed without a configured shared store.
- A request is validated, rate-limited and durably saved in the encrypted private inquiry store before a plain-text notification is attempted through Resend. Acceptance and notification status are reported separately. Provider acceptance is not a guarantee of inbox delivery; monitor the private queue, provider delivery/bounce events and recipient mailbox.
- The encrypted local database retains accepted inquiries. Tab-local drafts expire after 30 minutes. Missing storage configuration produces HTTP 503; email failure after persistence preserves acceptance and reports notification separately.
- A stable request UUID serves as an email idempotency key during retries; editing request fields generates a new UUID. The provider controls its idempotency retention window.
- Logs intentionally exclude quote bodies and credentials. Align mailbox retention, provider retention and privacy procedures with the owner’s policies.

### Owner inputs

See `IMPLEMENTATION_REPORT.md` and `docs/LEGAL_REVIEW.md`. The standard number `(833) 696-9996` remains the configuration default. Phase 1B requires verified phone routing: call links are hidden until `NEXT_PUBLIC_PHONE_VERIFIED=true`. Set `NEXT_PUBLIC_PHONE_NUMBER` in E.164 format and `NEXT_PUBLIC_PHONE_DISPLAY` together if using a project-specific number, then rebuild. No phone ownership claim is made in structured data.

## Code map

- `src/lib/catalog.ts`: typed bilingual category/equipment records and planning guidance.
- `src/lib/locations.ts`: all 13 provinces/territories, cities, metros and nearby municipalities.
- `src/lib/routes.ts`: authoritative bilingual route map and context-preserving links.
- `src/lib/copy.ts`, `quote.ts`, `legal.ts`: translated page, validation and legal copy.
- `src/components`: accessible navigation, shared page components and client quote form.
- `src/app/[locale]/[[...slug]]/page.tsx`: static-first pages; contact reads validated selection IDs from query parameters.
- `src/app/api/quote/route.ts`: bounded JSON body, origin check, server validation and delivery.
- `src/lib/rate-limit.ts`, `delivery.ts`: replaceable service boundaries for Redis and email.
- `src/app/sitemap.ts`, `robots.ts`: generated SEO endpoints.
- `src/proxy.ts`: server-side localized 404 responses for unknown English/French URLs, including visitors without JavaScript.
- `docs/asset-register.json`: authoritative image placement register; content images have one placement each, including across languages.

Adding a category or region does not automatically create thin city pages. Only explicitly authored `locations` records receive indexed pages. Adding a page requires both translations and route/metadata coverage. Public content never presents illustrative imagery as completed company work.

## Image audit

`pnpm check:assets` checks current assets and updates the register. For comparison with accessible other projects:

```sh
ASSET_AUDIT_PRIOR_ROOT=/absolute/path/to/projects pnpm check:assets
```

The audit checks SHA-256 exact matches and 64-bit perceptual difference-hash candidates. Near matches require human visual review. Inaccessible, remote-only inventories cannot be certified. Original image-generation prompts and review scope are in `docs/ASSETS.md`. The shared logo source is `public/brand/national-rentals-logo.svg`; header/footer use that outlined SVG, with derived aliases and favicon.

## Reference documentation

Implementation follows [Next.js App Router documentation](https://nextjs.org/docs/app/getting-started) and [Resend idempotency documentation](https://resend.com/changelog/idempotency-keys). Package versions are locked in `pnpm-lock.yaml`. Phase 1B catalog and Phase 1C geographic functionality are described below.


## Phase 1B equipment catalog

64 equipment types across all 11 categories and 22 subcategories, with 128 localized
product pages. The catalog and category pages offer keyword, category, subcategory
and associated-industry search with server-rendered results, including without JavaScript.
Equipment pages provide distinct applications, selection criteria, specification
fields to define, delivery planning, related items and regional/industry links.
Every equipment CTA prefills category, localized equipment and validated page context.

Authoring and imagery policy: `docs/CATALOG.md`. Product-specific image slots remain
empty rather than repeating category pictures or implying a particular supplied model;
existing industrial photography and original category illustrations are preserved.
Phase 1C geographic expansion and Phase 1D measurement/logo updates are documented below.

## Phase 1C geographic discovery

The national hub links all 13 province/territory pages and searchable city/municipality entries. Twelve substantive metro guides are available in English and French; all previous 1A/1B paths remain stable. There are 218 content routes in total. Geographic and equipment selections carry into quote forms, including correct province selection for Ottawa–Gatineau municipalities.

See `docs/GEOGRAPHY.md` for data ownership, publication rules, cross-border handling, reserved category/location architecture and coverage limits. No category/location combinations or discovery-only city pages are indexed. The approved wordmark is preserved; interface accents use red and charcoal.

## Phase 1D inquiry operations

Inquiries are accepted only after durable encrypted SQLite persistence. Email notification status is separate and recoverable. Hosting requires a private persistent volume on a long-lived Node host; an ephemeral serverless filesystem is unsupported. Configure `LEAD_DB_PATH` outside the repository and a unique `LEAD_ENCRYPTION_KEY`, then configure Resend and rate limiting. See [inquiry operations](docs/INQUIRY_OPERATIONS.md) for exact setup, private export/retry/deletion commands, backup/retention requirements, consent-based analytics and the live end-to-end blocker.

The form preserves tab-local drafts for 30 minutes and accepts unknown rental dates. Measurement is opt-in and off by default. No public admin interface or customer accounts were added. The stacked wordmark now uses clean original outlined geometry with identical line bounds and cap heights; see `docs/logo-geometry.json`.
