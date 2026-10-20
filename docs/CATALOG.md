# Phase 1B catalog authoring

The eleven existing categories and stable equipment IDs remain in `src/lib/catalog.ts`.
The 64 equipment profiles live in `src/lib/equipment-content.json`; `equipment.ts`
adds typed subcategories, delivery guidance, industry relationships, related items,
metadata and inquiry identifiers. Generic custom requirements remain available
through the form without generating a thin product page.

Each profile contains a stable bilingual slug, overview, three applications,
equipment-specific selection guidance and three specification fields to define.
These are not numeric model specifications or availability claims. The explicit
`published` flag controls lookup, search, routes and sitemap eligibility.

The `images` map is keyed by language and intentionally empty pending appropriate,
unique equipment imagery. No generic or inaccurate product-photo fallback is used.
Existing industrial homepage photography and category illustrations remain in place.
Add a distinct image for each language/page placement, neutral alt text and an entry
in the asset register/audit before publishing an image. Do not reuse a product image
on cards or related-product tiles.

URLs follow `/en/rentals/{category}/{equipment}/` and
`/fr/locations-equipement/{categorie}/{equipement}/`.
Existing category URLs and all other Phase 1A routes are preserved.

Search is an accessible GET form that works without JavaScript. It combines
localized keyword tokens (case/accent/punctuation insensitive), category,
subcategory and associated industry. No power/capacity/stock filters are offered
without corresponding verified data. Search URLs are shareable and noindex/follow
with the unfiltered catalog/category canonical; the sitemap contains clean
published URLs only.

Inquiry links carry stable category/equipment IDs plus `source`. Only matching,
known context is accepted. The form submits `sourceEquipment`; server validation
rejects unknown or category-mismatched IDs. Delivery derives the canonical localized
page URL from trusted application routes rather than accepting an arbitrary URL.
Changing the category clears source context. Manual equipment descriptions remain
supported. Provider acceptance, consent, dates, quantities and anti-spam behavior
are preserved. No analytics infrastructure exists; no new tracking was installed.

## Editorial reference checks

Selection terminology was checked against primary sources without importing
model ratings, manufacturer images or availability claims:

- [Caterpillar excavator selection](https://www.cat.com/en_US/articles/ci-articles/one-size-doesnt-fit-all-tips-for-right-sizing-your-excavator.html)
- [Caterpillar loader categories](https://www.cat.com/en_US/products/new/equipment/skid-steer-and-compact-track-loaders.html)
- [Genie aerial lift selection](https://www.genielift.com/en/aerialpros/best-aerial-lift)
- [Genie telehandler selection](https://www.genielift.com/en/aerialpros/telehandler-size)
- [Atlas Copco rental sizing tools](https://www.atlascopco.com/en-us/rental/resources/calculation-tools)

Copy describes applications and information to include in a request; it is not an
operating manual, engineering design or product specification sheet. Source brands
are not presented as partners or supplied equipment.
