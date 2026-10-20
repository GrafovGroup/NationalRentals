# NationalRentals.ca — Phase 1B Codex Master Prompt

## Objective
Continue the completed Phase 1A implementation. Build a production-quality, bilingual, quote-first commercial rental equipment catalog for NationalRentals.ca. **Do not restart the application or overwrite Phase 1A.** Inspect the repository, working branch, Phase 1A implementation report (wherever it resides), current routes, existing data models, and approved brand standards before modifying code.

## Non-negotiable business requirements
- National Canadian B2B rental company, not a peer-to-peer marketplace or vendor directory.
- All commercial rental categories, with construction, industrial, infrastructure and facilities emphasized; events remain a secondary category.
- No public pricing, shopping cart, online checkout, customer accounts, live inventory, or unverified availability claims.
- Conversion via **REQUEST A QUOTE** and **CALL NOW**, with natural Québec French equivalents.
- Primary contact and notification email: **info@nationalrentals.ca**. Never substitute info@grafovgroup.com.
- Phone links only if a verified phone number is configured.
- Use the approved red two-line National Rentals wordmark and `BRAND_LOGO_STANDARD.md`; do not revert to navy/orange or graphite/teal. The provisional SVG must not be represented as an exact trace of the approved concept.
- English and Québec-appropriate French live and complete from day one. Preserve /en/ and /fr/ architecture.
- No fabricated branches, warehouses, owned fleet, reviews, certifications, inventory, fulfillment guarantees, or supplier partnerships.

## Catalog data architecture
Extend Phase 1A's existing taxonomy rather than duplicate it. Create typed structured data for categories, subcategories and equipment items: stable ID, bilingual names, localized slugs, descriptions, typical applications, key specifications (only verifiable or clearly marked typical), selection guidance, related equipment, associated industries, appropriate image and alt text, SEO fields, inquiry prefill, and publication status.

Cover all eleven established categories:
1. Construction and earthmoving
2. Aerial access and material handling
3. Industrial power and climate
4. Temporary facilities and site infrastructure
5. Commercial vehicles and trailers
6. Technology and audiovisual
7. Cleaning and restoration
8. Landscaping and grounds maintenance
9. Safety and traffic control
10. Specialty equipment
11. Events and crowd control

Implement a substantive initial catalog, prioritizing approximately 60–100 commercially relevant equipment types across the categories. Depth and accuracy matter more than an arbitrary count. Avoid thin programmatically generated pages. Do not invent precise model-specific specs or use misleading product images.

## Pages and user experience
- Bilingual catalog landing page with prominent category navigation and clear discovery.
- Bilingual category landing pages with descriptions, use cases, equipment cards and contextual inquiry CTA.
- Bilingual individual equipment pages with H1, clear overview, common uses, rental considerations, typical specification fields where supportable, delivery and rental-duration guidance, related equipment, breadcrumbs and prominent CTA.
- Functional search and filters over the actual catalog (category, keyword and meaningful applicable attributes); responsive, keyboard-accessible, graceful empty states. Do not add unsupported filters.
- Mobile-first performance, professional industrial imagery, consistent approved brand, restrained motion and accessibility.
- Keep all existing Phase 1A routes functional. Do not break homepage, location architecture or corporate rental pages.

## Inquiry conversion
From every equipment page, prefill the existing quote form with selected equipment, category and page context. Support quantities, requested rental dates, city/province, company/contact details and project notes. Preserve server validation, privacy acknowledgement, anti-spam and reliable delivery/error handling. Never show a success message unless the submission is accepted by a real configured backend. If notification credentials are missing, document the limitation and prevent misleading submissions. Track privacy-conscious CTA and form events where analytics infrastructure exists.

## SEO and content
- Unique human-useful English/French copy, metadata and page headings.
- Canonical and hreflang equivalents; sitemap only for indexable, substantive published pages.
- Structured data and breadcrumbs only when factually supported; no prices, ratings, or inventory claims.
- Cross-link related products, industries and relevant location hubs.
- Establish clean extensible URLs and scalable templates for Phase 1C city/province SEO.
- Avoid duplicate content, keyword stuffing and mass-generated category-city combinations.
- Ensure correct French localization and useful rental terminology for Québec customers.

## Engineering and quality
Inspect existing framework, use established components and design tokens, typed data and translation patterns, image optimization, semantic markup and responsive layout. Add unit/integration tests for catalog lookup, localized routes, search/filtering, inquiry prefill, and metadata. Run lint, typecheck, tests and production build; resolve failures. Do not commit secrets. Do not introduce unnecessary paid services.

## Completion criteria
1. All eleven categories navigable in English and French.
2. Meaningful equipment catalog and individual product pages implemented.
3. Search/filter works with real catalog data.
4. Equipment-to-quote prefill functions without breaking validation.
5. SEO, responsive and accessibility checks pass.
6. Approved logo/branding preserved.
7. No regressions to Phase 1A.
8. Update `IMPLEMENTATION_REPORT.md` with Phase 1B completed/partial/blocked status, routes, item counts, test results, screenshots if available, deployment status, and owner-only action items.
9. Update README as needed.
10. Commit to the active implementation branch where authorized. Do not claim deployment or merging without verification.

## Execution
Implement Phase 1B now, not just a plan. Work autonomously and consolidate any required owner inputs at the end. Do not begin Phase 1C until instructed.
