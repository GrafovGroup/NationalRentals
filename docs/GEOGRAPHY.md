# Geographic discovery and publication

Phase 1C extends the existing catch-all route resolver. There are 13 province/territory hubs and 12 metro guides in each language. The original Toronto/GTA, Montréal and Vancouver URLs remain stable. Québec province uses `/fr/regions/quebec/`; Québec City uses `/fr/regions/ville-de-quebec/`.

## Data and editorial boundaries

- `src/lib/region-content.json`: canonical EN/FR province slugs, distinctive project context, transport planning, principal cities and relevant category IDs.
- `src/lib/metro-content.json`: nine new reviewed bilingual guides; the three existing guides remain in `locations.ts`.
- `src/lib/locations.ts`: typed region codes, market IDs, explicit commercial metro groupings, publication registry and geographic prefill. Commercial groupings are discovery aids, not claims of exact census boundaries. Market membership in a cross-border metro never overrides the market's province.
- `src/components/Geography.tsx`: server-rendered discovery and reusable province/metro templates. Search uses GET and works without JavaScript. City cards lead directly to a prefilled request; only reviewed metros receive guide links.

To add a substantial metro guide, add complete bilingual description/planning and unique slugs to the metro data, identify its municipalities and province, and test its route and breadcrumb. Check for collisions against both province and existing city slugs in both languages. Add any cross-province relationship explicitly; do not infer provinces from place-name substrings. To add a discovery-only municipality, update the relevant city list or commercial grouping. Doing so must not create an indexable page.

## Category-by-location architecture

`LocalizedCategoryPage` and the empty `localizedCategoryPages` registry define the editorial record (stable ID, location ID, category ID, bilingual description and planning) for future combinations. The reserved URL design is `/en/locations/{metro-slug}/{category-slug}/` and `/fr/regions/{metro-slug}/{category-slug}/`, using existing canonical slug mappings. No combinations are enabled in the resolver in 1C: all such requests return HTTP 404 and remain absent from the sitemap. A future publication must wire reviewed records into the resolver, metadata and template, add location/category breadcrumbs, and retain the same explicit registry approach. Do not build a Cartesian product of cities and categories.

No distinct combination content was needed to improve this phase's inquiry flow: each regional guide already links relevant categories and offers category-and-location-prefilled quote links. Broader standalone city guides and localized category pages remain an editorial expansion, not empty published placeholders.

## Conversion and indexing

Market IDs select trusted bilingual city names and region codes. Province hubs prefill the province and leave the city for the customer. Metro CTAs choose the primary city; municipality links choose the exact city. Ottawa–Gatineau defaults to Ottawa/ON, while Gatineau, Chelsea and Cantley select QC. The quote form remains editable.

Equipment pages link to geography with a stable equipment ID. Discovery forms, regional links, language switches and quote CTAs preserve that equipment and derive its category/source from the catalog. Arbitrary query values are not accepted as trusted geography. Phone visibility still requires explicit verification. No new email backend or quote success logic was introduced.

Clean substantive pages have unique titles/descriptions, reciprocal EN/FR hreflang and canonical URLs. Search/filter/equipment-context variants use noindex/follow with clean canonicals. Sitemap entries come only from the shared route registry. Structured data remains Organization and BreadcrumbList, without invented offices or LocalBusiness addresses.

## Factual references and limits

Geographic names and cross-border context were checked against primary references on October 19, 2026:

- [Government of Canada: provinces and territories](https://www.canada.ca/en/intergovernmental-affairs/services/provinces-territories.html)
- [Statistics Canada: census metropolitan areas](https://www.statcan.gc.ca/en/subjects/standard/daily/5000059)
- [Statistics Canada: Ottawa–Gatineau reference map](https://www12.statcan.gc.ca/census-recensement/2021/geo/maps-cartes/referencemaps-cartesdereference/cma_ca_ct-rmr_ar_sr/files-fichiers/2021-92146-505-00.pdf)

Project examples and planning checklists are original editorial guidance, not claims about specific customers, fleet availability or supplier coverage. No delivery times, physical offices or local inventory are asserted. Remote destinations require case-specific transport confirmation; the pages do not supply transport schedules or regulatory advice.

No content images were added or reassigned in 1C. Existing asset-register limits and product-image gaps remain unchanged. The approved logo asset is unchanged; UI accents now use red and charcoal as specified by the 1C brand requirement.
