# Industry guides — Phase 2A

`src/lib/industries.ts` owns ten published bilingual industry records. Each has stable IDs, localized slugs, original overview/hero copy, three work scenarios, three planning considerations, curated equipment and category IDs, location IDs, an industry-specific FAQ, SEO metadata and a publication flag. Only published records produce routes or accepted industry attribution. Do not publish future sectors until both languages have substantive content.

## Routes and navigation

Twenty industry pages extend the existing 218 content routes to **238**. The English hub is `/en/industries/`; the existing French canonical hub remains `/fr/secteurs/`. `/fr/industries/` redirects permanently to it, preserving queries and French child slugs. Existing paths remain valid. Industry breadcrumbs, canonical/hreflang, organization identity and sitemap use the shared route/SEO infrastructure. No industry-by-city pages, branch schema, prices, ratings or stock claims were introduced.

Homepage and hub cards link to the guides. Equipment pages link to associated guides; regional pages link to industries relevant to their equipment categories. The catalog industry selector now uses the ten published records, with legacy filter identifiers still supported. Publication and valid equipment/geographic links are covered by tests.

## Project inquiry flow

An industry guide offers a native GET equipment checklist. Selected catalog IDs and the industry ID go to the existing contact form; no personal information enters these links. Up to eight unique, published equipment IDs are accepted by server validation. Visitors can adjust the optional industry and equipment list in the form, then describe quantities, delivery addresses and dates per item/site in project details. The primary equipment description/category and quantity fields remain compatible with existing inquiries.

Repeated products query parameters and comma-separated selections are supported. Language switching, regional context links and tab drafts retain the selection. Drafts use the existing 30-minute lifetime and deletion after acceptance. The industry and product IDs are stored inside the encrypted request payload and rendered as readable names in internal notifications. They are not added to analytics events. Existing CSRF, rate limits, idempotency and private operator workflows apply unchanged; no second API or public administration was created.

## Editorial and visual policy

Each guide has a sector-specific text-led hero and numbered project brief, followed by scenarios and a relevant equipment checklist. No new photos, duplicated stock images or image placeholders were added. The approved Phase 1D logo and current content-image placements remain unchanged. New photography must follow the unique-placement register and prior-inventory audit rules before publication.

Public procurement copy requests RFQ references and documentation requirements without claiming standing offers or registration. Multi-site copy requires feasibility per location. Healthcare pages concern non-clinical facility work and exclude patient information. Restoration inquiries do not imply emergency dispatch or promised response times. No owned fleet, guaranteed fulfillment or certifications are asserted.

## Operations and scope

Phase 1D's production storage/email configuration remains owner-dependent; see `INQUIRY_OPERATIONS.md`. No new credentials are required for Phase 2A. No public deployment or live email delivery is claimed. Phase 2B is outside scope.
