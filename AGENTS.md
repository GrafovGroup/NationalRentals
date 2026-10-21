<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## National Rentals project requirements

- Implement only the requested phase. Phase 1A scope is in PHASE_1A_CODEX_MASTER_PROMPT.md; Phase 1B catalog scope is in PHASE_1B_CODEX_MASTER_PROMPT.md. Phase 1C geographic scope is in PHASE_1C_CODEX_MASTER_PROMPT.md. Phase 1D inquiry operations scope is in PHASE_1D_CODEX_MASTER_PROMPT.md. Phase 2A industry scope is in PHASE_2A_CODEX_MASTER_PROMPT.md. Do not start Phase 2B without instruction.
- English and Québec-appropriate French are required for all user-facing changes, validation, metadata and routes.
- Keep contact details central in src/lib/config.ts. Use info@nationalrentals.ca. The user-instructed standard placeholder is (833) 696-9996, with tel:+18336969996; a supplied project-specific number takes precedence. Phase 1B call links require NEXT_PUBLIC_PHONE_VERIFIED=true after owner verification.
- Treat any deployed business website as a live operation. Do not add coming-soon, demo, prototype, unconnected, pre-launch or legal-review-before-launch wording to customer-facing content.
- Use uppercase navigation and button labels in both languages.
- Never invent fleet ownership, availability, branches, supplier agreements, reviews, certifications, prices or service guarantees.
- Every content-image placement must be unique within/across pages, languages and other sites. Crops, mirrors, recolours and renamed exports are not unique images. Responsive variants belong to one placement only. No shared photo fallbacks.
- Maintain docs/asset-register.json and audit exact/perceptual duplicates against accessible previous-site inventories before publishing image changes. Report inaccessible inventories privately; do not claim portfolio-wide verification.
- Do not add customer-facing AI/provenance disclaimers or invented completed-project claims. Use neutral alt text; keep provenance internal.
- Report inquiry acceptance only after durable persistence; distinguish email notification status. Never claim email delivery without provider acceptance. Keep credentials out of Git and quote personal data out of logs.
- Run lint, typecheck, unit/API tests, production build and relevant browser tests. Keep IMPLEMENTATION_REPORT.md accurate about delivery, deployment and owner-only requirements.
