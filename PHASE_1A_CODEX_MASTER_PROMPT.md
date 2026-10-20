# NationalRentals.ca — Phase 1A Codex Master Prompt

## Mission
Build a production-quality, bilingual English/French Canadian B2B commercial rental website operated by Grafov Group Inc. National Rentals is a national commercial rental coordination brand, not a marketplace, event-only company, or directory. Launch with qualified quote requests and phone inquiries, not checkout or live bookings.

## Autonomous execution
Inspect the repository. If empty, initialize a maintainable Next.js/TypeScript application with accessible components and production-ready architecture. Implement actual code, not only a plan. Make reasonable decisions independently. Never invent business facts. Keep secrets out of Git. Run lint, typecheck, tests and build; fix failures. Document owner-only requirements at the end in IMPLEMENTATION_REPORT.md. Commit work where authorized.

## Brand and design
Create a unique premium industrial visual identity, not a clone of another Grafov Group website. Suggested palette: deep navy #10243A, orange #F58220, graphite #263340, warm white #F7F8FA. Create original vector logo and favicon. Responsive, image-rich, restrained animation, strong accessibility and mobile experience. Main CTAs: REQUEST A QUOTE / CALL NOW; French: DEMANDER UNE SOUMISSION / APPELER MAINTENANT.

## Business positioning
Commercial Equipment & Rental Solutions Across Canada. Customer submits requirements; National Rentals reviews and coordinates sourcing/fulfillment through owned resources or approved regional suppliers, as applicable. Do not claim owned fleets, guaranteed availability, local branches, certified crews, instant response, or established supplier agreements without verification.

## Rental categories
Create bilingual structured category and equipment data with extensible slugs, SEO fields and descriptions:
1. Construction and earthmoving: excavators, skid steers, compactors, loaders, trenchers, concrete equipment.
2. Aerial access and handling: scissor lifts, boom lifts, telehandlers, forklifts, material lifts.
3. Industrial and power: generators, compressors, pumps, light towers, temporary heating/cooling.
4. Temporary infrastructure: office trailers, containers, portable toilets, handwashing, fencing, shelters.
5. Commercial vehicles and trailers: box trucks, cargo vans, refrigerated vehicles, flatbeds, trailers.
6. Technology and AV: tablets, laptops, kiosks, signage, screens, event technology.
7. Cleaning and restoration: scrubbers, sweepers, extractors, vacuums, dehumidifiers.
8. Landscaping and grounds: mowers, aerators, chippers, stump grinders.
9. Safety and traffic control: barricades, cones, signs, message boards, road plates.
10. Specialty rentals: custom commercial requirements.
11. Events and crowd control: stanchions, barriers, turf, tents, furniture, flooring (secondary, distinct from I Love Events).

## Phase 1A deliverables
Build polished homepage with header/mega menu, hero, category discovery, featured equipment, industries, how-it-works, national coverage, corporate multi-site programs, prominent quote form and complete footer. Build substantial bilingual primary category pages, About, Contact, Industries, Locations overview, Corporate Rentals, Privacy and Terms drafts flagged for legal review. Avoid unverified legal assertions.

## Bilingual standards
English and natural Québec-appropriate French live on day one. Routes /en/ and /fr/; translate every navigation label, heading, category description, form, validation message, contact and metadata. Functional context-preserving language switcher, lang tags, hreflang, canonical URLs. No untranslated placeholders.

## National SEO
Data model for 10 provinces, 3 territories, major cities, metros and surrounding municipalities, including Greater Toronto Area municipalities and Québec-specific names. Build limited high-value sample location pages with real, useful differentiating content; no thin mass-generated city pages. Include sitemap, robots, semantic headings, internal links, breadcrumbs, structured data only for verified facts, OG metadata, accessible images, fast loading and Core Web Vitals foundations.

## Inquiry handling
Primary email: **info@nationalrentals.ca**. Configure centrally as contact address and intended notification recipient; do not use info@grafovgroup.com. Form: name, company, email, phone, category, equipment, quantity, dates, delivery city/province, delivery needs, project details, privacy acknowledgment. Server-side validation, accessible errors, honeypot, rate limiting, safe handling, bilingual confirmations. Do not falsely show success if delivery/persistence fails. If email service credentials are missing, implement provider adapter and clearly mark delivery unconfigured, without silently losing submissions. Phone CTAs only when owner supplies verified phone number; otherwise use email/form. No fabricated phone number.

## Architecture and safety
Reusable UI, typed category/equipment/location datasets, translations, form handling, SEO config, contact config, tests. No pricing, cart, online payments, customer accounts, booking calendar, inventory availability or supplier directory. Meet WCAG 2.2 AA principles. No fabricated reviews or testimonials.

## Acceptance and reporting
Build and validate a working Phase 1A app; report implemented routes, tests/build, translations, form delivery state, SEO, limitations, and owner actions in IMPLEMENTATION_REPORT.md. Add README setup and environment-variable example. Do not claim deployment without verification. Do not begin Phase 1B until separately instructed.
