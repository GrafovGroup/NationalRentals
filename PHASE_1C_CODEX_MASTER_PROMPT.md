# NationalRentals.ca — Phase 1C Codex Master Prompt

## Mission
Implement Phase 1C: national Canadian location SEO and geographic rental discovery, building on completed Phases 1A and 1B. Inspect the actual implementation branch, reports, routes, translations and equipment data before editing. **Do not rebuild, overwrite or duplicate the existing application.** If 1B is not on the checked-out branch, identify the correct branch and document the blocker rather than proceeding on an outdated foundation.

## Business rules
- NationalRentals.ca is a Canadian B2B commercial rental brand serving inquiries across Canada, coordinating fulfillment based on project requirements.
- Primary email: **info@nationalrentals.ca**.
- Conversion: REQUEST A QUOTE / CALL NOW, and appropriate Québec French. No prices, checkout, bookings, unverified availability, or supplier directory.
- Approved red, stacked NATIONAL / RENTALS wordmark from BRAND_LOGO_STANDARD.md. No prior navy/orange branding.
- Fully functional Canadian English and natural Québec French on all published pages, metadata, forms and navigation.
- Do not fabricate branches, offices, local inventory, crews, delivery times, service guarantees, certifications or supplier relationships.

## Geographic data architecture
Create/extend typed, maintainable geographic datasets covering all 10 provinces and 3 territories; major metropolitan areas; principal cities; and meaningful surrounding municipalities. Preserve bilingual official place names and Québec French conventions. Explicitly model metro relationships (e.g. Toronto/GTA including Mississauga, Brampton, Vaughan, Markham, Richmond Hill, Oakville, Burlington; Metro Vancouver including Vancouver, Surrey, Burnaby, Richmond, Coquitlam; Greater Montréal including Laval and Longueuil; Ottawa-Gatineau). Cover Calgary, Edmonton, Québec City, Hamilton, Kitchener-Waterloo-Cambridge, London, Niagara, Barrie, Kingston, Windsor, Winnipeg, Regina, Saskatoon, Halifax, Moncton, Fredericton, Saint John, Charlottetown, St. John's, Victoria, Kelowna, Kamloops, Prince George, Whitehorse, Yellowknife, Iqaluit and other commercially relevant markets. Use province/territory identifiers and canonical slug mapping, not brittle string matching.

## Routes and page templates
Implement bilingual national Locations hub, province/territory landing pages and selected high-quality metro/city pages. Each published page must provide distinctive useful content: local commercial sectors and equipment use cases, relevant category links, practical rental planning factors (transport, access, seasonality where defensible), a clear inquiry path, and accurate language about fulfillment subject to confirmation. Use reusable page components but do not create thin boilerplate doorway pages.

Design extensible category-by-location route architecture, but **publish only combinations with meaningful, differentiated content** and clear user value. Do not mass-publish thousands of nearly identical pages. Unsupported or incomplete location/category combinations should be absent, nonindexable or return appropriate not-found responses. No indexable empty pages.

## SEO
Unique EN/FR titles, meta descriptions, H1, canonical and reciprocal hreflang; appropriate language tags; sitemap including only substantial indexable pages; robots; breadcrumbs and valid factual structured data; strong links from homepage, categories, equipment pages and location hubs; readable URLs; no keyword stuffing. Audit indexing duplication, language parity and broken links. Do not invent business addresses or LocalBusiness location markup for places without verified offices.

## UX and conversion
Create intuitive location discovery by province, metro and city, with search/filter where practical. Maintain responsive design and accessible keyboard navigation. Quote forms should prefill city/province and preserve equipment selection when users navigate from equipment/location combinations. Phone CTAs must only display verified configured phone numbers. Ensure French copy is written for Québec customers, not literal low-quality translations.

## Delivery priorities
1. Integrate with existing Phase 1A/1B application and preserve working features.
2. Publish complete bilingual province/territory hubs and an initial set of substantive high-priority metro/city pages.
3. Add reusable geographic data, navigation, breadcrumbs, and links.
4. Add selected valuable localized category pages only when distinct content is available.
5. Validate localization, metadata, sitemaps, quote prefill, responsive layouts, and accessibility.
6. Extend automated tests for geographic slug resolution, EN/FR page equivalence, canonical/hreflang, sitemap exclusion of unpublished pages, and quote prefill.

## Acceptance criteria
- All 13 provinces/territories represented in geographic navigation and content architecture.
- Major Canadian metro areas and surrounding municipalities represented in the structured location dataset.
- Published landing pages have substantive EN/FR content, working internal links and CTAs.
- No duplicate or thin page explosion.
- No invented physical locations or guaranteed availability.
- Existing 1A/1B routes, catalog, forms, translations, and brand unaffected.
- Lint, typecheck, tests and production build pass (report any exceptions honestly).
- Update IMPLEMENTATION_REPORT.md with Phase 1C summary, published route inventory, coverage gaps, tests, blockers, and owner-only actions. Update README if necessary.
- Commit work to the active Codex implementation branch where authorized. Do not claim deployment or merging unless verified.

## Execution
Implement Phase 1C autonomously now. Do not stop at a proposal. Make reasonable decisions independently and leave only genuinely owner-dependent questions for the final report. Do not begin Phase 1D until separately instructed.
