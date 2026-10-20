# NationalRentals.ca — Phase 1D Codex Master Prompt

## Mission
Implement Phase 1D: lead conversion, reliable inquiry operations, measurement, security and launch readiness for NationalRentals.ca. Continue from the actual completed Phase 1C code and do not rebuild or overwrite Phases 1A–1C. Inspect the active implementation branch and reports before editing. If the expected implementation is missing, identify the correct branch and report the blocker rather than applying changes to an obsolete branch.

## Brand and commercial rules
- Canadian national B2B commercial rentals, all major categories, with events secondary.
- Approved stacked red NATIONAL / RENTALS logo per BRAND_LOGO_STANDARD.md.
- English and Québec-appropriate French live across the site.
- Quote-first and call-first, no public prices, checkout, booking calendar, accounts or marketplace.
- Official inquiry email: **info@nationalrentals.ca** (never info@grafovgroup.com).
- Use only a verified configured business phone number; do not invent one.
- Do not fabricate inventory, physical locations, fleet, supplier agreements, guarantees, response times or certifications.

## 1. Reliable inquiry capture
Audit and improve all existing quote and contact forms on homepage, category, equipment, location and corporate pages. Preserve context across navigation: equipment ID/name, category, location, locale, source URL, quantity, dates and any existing user-entered fields.

Required fields: contact name, company, email, phone, equipment/request description, delivery city and province/territory, rental period where known, project details, and privacy acknowledgement. Allow sensible optionality; avoid excessively long mobile forms.

Use a server-side validated schema and sanitized inputs; protect against injection, unsafe HTML and malicious payloads. Accessible inline errors and clear bilingual success/error messaging.

## 2. Delivery and persistence
- Central notification destination: info@nationalrentals.ca.
- Use an email provider adapter configured through environment variables; never commit credentials.
- Persist accepted inquiries securely with a unique ID, timestamp, locale, source URL, equipment/category, delivery geography, request data and delivery status. Use an existing supported database if available; otherwise choose the simplest production-compatible secure storage and document its hosting requirements.
- Send a concise, readable internal notification with all relevant lead details and the inquiry ID.
- Optional customer acknowledgment email, but only if delivery is configured and legally appropriate; never promise a response deadline.
- Explicitly distinguish saved/accepted from notification-sent status. If email fails after safe persistence, retain the inquiry and expose operational retry/recovery. If neither persistence nor notification can work, show a truthful error rather than success.
- Avoid duplicate submissions through reasonable idempotency or duplicate detection.
- No inquiry data in public pages, build artifacts, source control or analytics payloads.
- Document privacy, retention, access control and deletion requirements; do not claim legal compliance without review.

## 3. Lightweight lead operations
Implement a minimal secure lead status model (new, contacted, quoted, won, lost) only if existing infrastructure can support authenticated administration without substantial new complexity. Otherwise prioritize a secure export/notification workflow and document admin UI as a future enhancement. Do not create a public dashboard or customer login. Include basic spam indicators and source attribution.

## 4. Conversion optimization
Audit quote CTAs, equipment-page prefills, location-page context, corporate program pages and mobile navigation. Keep REQUEST A QUOTE and CALL NOW prominent without obstructing content. Phone CTAs only when verified number exists. Test keyboard/screen reader access, reduced motion, form completion and French translations. Do not add fake urgency, fake testimonials or unsupported trust claims.

## 5. Analytics and attribution
Add privacy-conscious event instrumentation for quote_start, quote_submit_success, quote_submit_error, phone_click, email_click, equipment_view and location_view. Never send names, phone numbers, emails, free-text inquiry details or other personal information to analytics. Provide an adapter so analytics works when configured and degrades safely when not configured. Preserve UTM campaign parameters and referring source in the private inquiry record when available. Document consent requirements for deployment jurisdictions.

## 6. Security and reliability
Server-side validation, CSRF protections appropriate to the stack, honeypot, practical rate limits, bot mitigation without unnecessary paid dependencies, secure headers, environment-variable hygiene, safe error handling and privacy-preserving logs. Review for accidental data leakage. Ensure only authorized operators can access lead records.

## 7. SEO and regression protection
Preserve all bilingual category, equipment and location routes, canonicals, hreflang, sitemap, structured data and brand. Avoid new indexable thin pages. Ensure no regressions in search/filter, equipment-to-form and location-to-form prefill.

## 8. Test plan
Implement or expand automated tests for:
- EN/FR form validation and error/success states
- Equipment and location prefill
- Successful persistence and email notification
- Email provider outage and recovery
- Duplicate submission handling
- Spam/rate limit rejection
- Analytics events without personally identifying information
- Mobile and accessibility flows where test infrastructure permits
Run lint, typecheck, unit/integration tests and production build. Report results and limitations accurately.

## 9. Owner configuration
List only actual owner-required inputs at the end: email provider/domain DNS credentials if needed, verified phone number, hosting/database connection, analytics IDs, privacy/legal review, deployment secrets. Do not block unrelated implementation while waiting. Never use fabricated credentials or dummy contact information in production.

## Acceptance criteria
A real inquiry can be submitted from every relevant page in both languages, accepted securely, retained with an ID, and routed to info@nationalrentals.ca once provider configuration is available. The UI never falsely claims success. Events are privacy-safe, phone CTAs are accurate, security controls exist, prior phases are preserved, and tests/build pass. If external setup prevents a live end-to-end test, clearly mark it BLOCKED and provide exact owner setup steps.

## Report and execution
Implement the actual code autonomously, not just a proposal. Update IMPLEMENTATION_REPORT.md with Phase 1D implementation details, inquiry flow, delivery configuration, security/analytics, test evidence, deployment status, blockers and owner-only tasks. Update README and .env.example. Commit on the active Codex branch where authorized. Do not claim merging or deployment unless verified. Do not start Phase 2A until instructed.
