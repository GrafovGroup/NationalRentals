# Inquiry operations — Phase 1D

## Hosting contract and setup

This implementation uses Node's built-in SQLite driver (Node **22.16+**, tested with Node 24) and an encrypted private store. It requires a long-lived Node deployment with a **persistent local volume on one host**. Do not use an ephemeral serverless filesystem or separate replicas with independent copies of the file. No existing database was configured in the repository. A managed database adapter is a future hosting alternative, not an implemented deployment option.

1. Provision a private persistent directory outside the repository, web root, build directory and static file server. Own it with the application service account and restrict it to mode `0700`.
2. Set `LEAD_DB_PATH` to an absolute filename in that directory. The app creates the SQLite schema; the database file is restricted to `0600`. Project-local paths and database symlinks are rejected.
3. Generate `LEAD_ENCRYPTION_KEY` with `openssl rand -base64 32`. Put it in the host secret manager, separately from the database and backups. Never paste it into Git, reports or logs. There is no default key. Losing the key makes stored payloads unreadable. Key rotation requires an explicit decrypt/re-encrypt migration; replacing the variable alone is not a migration.
4. Set `RESEND_API_KEY` and `QUOTE_FROM_EMAIL` after verifying the sender domain in Resend and applying its actual DNS records. Recipient is always `info@nationalrentals.ca`; no customer acknowledgment email is sent.
5. Set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS public origin. Configure shared REST Redis rate limiting, or explicitly select `RATE_LIMIT_MODE=single-instance` for a single Node process. Set `TRUSTED_CLIENT_IP_HEADER` only if the deployment proxy overwrites that header. Without it, clients share a conservative bucket.
6. Build and run the app with the service's environment and persistent volume. Submit an owner-authorized test inquiry in each language; confirm the returned ID in the private store and confirm email reception. No real email was sent during development tests.

## Acceptance and notification are different

The server validates a bounded JSON request, checks origin/honeypot/rate limit and inserts an encrypted record before attempting email. Records include an inquiry ID, creation timestamp, language, canonical source path, equipment/category, delivery city/province, quantities, optional dates, contact/project data, optional validated industry and up to eight catalog product IDs, consent acknowledgment and private campaign attribution. Operator export includes the full canonical source URL and a basic multiple-link spam indicator; the honeypot rejects obvious automated submissions before acceptance.

Personal request data and attribution are AES-256-GCM encrypted with a fresh nonce. IDs, timestamps, notification status, attempt counts, provider IDs and a keyed fingerprint are operational metadata in the database. SQL statements use bound parameters. Provider messages are plain text, not interpolated HTML. Neither HTTP responses nor logs contain contact/project data. A successful HTTP response means durable acceptance, not a booking or a promise that notification succeeded.

Statuses: `pending` (not attempted), `sending` (leased attempt), `sent` (provider accepted), `failed` (attempt not confirmed), `review` (old uncertain attempt). The UI says the request was saved and separately reports notification confirmation or a retained request awaiting confirmation. Missing/failed storage returns an error, even when email credentials exist. Missing email credentials leave a saved inquiry pending.

The client reuses its submission UUID for unchanged retries, including a page reload while the tab draft is valid. A unique database ID and keyed payload fingerprint prevent resending a completed inquiry and reject a changed payload under the same key. Concurrent notification attempts use a 60-second database lease and the same Resend idempotency key. Provider confirmation is required before recording `sent`.

Resend documents a 24-hour idempotency window. Attempts older than 23 hours enter `review` instead of automatically sending again; an operator must reconcile uncertain delivery. This prevents a crash followed by a late retry from silently duplicating an email. There is no background scheduler installed by this phase: operators must monitor pending/failed/review records and execute retries, or configure an authorized operational schedule on the host.

## Authorized operator workflow

There is **no web admin API, dashboard or customer login**. SSH/service-account access and the private database/key are required. Load the same protected runtime environment used by the app. From the repository, for example:

```sh
node --env-file=/etc/nationalrentals/runtime.env --import tsx scripts/leads.ts list
node --env-file=/etc/nationalrentals/runtime.env --import tsx scripts/leads.ts export INQUIRY_ID /private/exports/inquiry.json
node --env-file=/etc/nationalrentals/runtime.env --import tsx scripts/leads.ts retry INQUIRY_ID
node --env-file=/etc/nationalrentals/runtime.env --import tsx scripts/leads.ts delete INQUIRY_ID
```

`list` returns at most 1,000 recent IDs/statuses/timestamps, without personal fields. `export` writes a new `0600` JSON file outside the project; it does not print personal details and will not overwrite an existing file. Export files are plaintext: restrict operator access, transfer securely, and delete them according to the approved retention policy. `delete` refuses an active lease.

For a `review` record, check the provider's delivery history using the inquiry ID/idempotency key:

```sh
# Only after verifying that the provider accepted the message:
pnpm leads resolve-sent INQUIRY_ID VERIFIED_PROVIDER_ID
# Only after verifying no message was accepted; then retry:
pnpm leads requeue INQUIRY_ID --confirmed-not-sent
pnpm leads retry INQUIRY_ID
```

These commands require the environment to be exported already (or use the `node --env-file` form above). If the provider's history is inconclusive, retain the record for manual review rather than requeueing it blindly. A customer request remains safely retained regardless of that notification decision.

No new/contacted/quoted/won/lost CRM administration was added: there is no existing authenticated administration infrastructure. Operators can use the secure export/notification workflow in their existing system.

## Retention, deletion, backup and access

The owner must approve a retention period and access policy. `pnpm leads purge DAYS` removes records older than the explicitly supplied positive day count, excluding active notification leases; no automatic deletion schedule is enabled. Individual deletion and purge affect this database only. Review associated email messages, private exports and backup copies separately when fulfilling retention/deletion requests. Verify the requester before disclosure or deletion. This is an operational design, not a claim of legal compliance.

Back up the encrypted database consistently: stop the service before copying the database, or use a separately validated SQLite online backup procedure. Store keys separately and test restoration on a private host before relying on backups. Limit filesystem/service/SSH access to authorized operators. Do not attach production database files or exports to support tickets, Git commits, analytics, screenshots or build artifacts. Do not log request bodies at the reverse proxy or hosting layer.

## Drafts, attribution and measurement

Form fields are retained in `sessionStorage` for this browser tab, with a 30-minute expiry, an explicit clear button and deletion after accepted submission. Consent and honeypot fields are not restored. Dates are optional; supplied dates are validated. Explicit new equipment/geography selections override their own draft fields while retaining contact/project text. Recognized equipment names localize; free text is preserved. Shared-device users can clear the draft. If browser storage is blocked, the form still works without recovery.

UTM source/medium/campaign/term/content and external referrer **origin only** are kept privately with the inquiry when available. Query strings never enter the canonical source URL or event payload. Attribution is not sent to analytics.

Measurement is off by default. If configured, the visitor must opt in using the non-obstructive footer control; they can revoke that choice there. Consent is scoped to the tab. The supported events are `quote_start`, `quote_submit_success`, `quote_submit_error`, `phone_click`, `email_click`, `equipment_view` and `location_view`.

`NEXT_PUBLIC_ANALYTICS_ENABLED=true` enables the control and first-party `/api/measurement/` relay. `ANALYTICS_ENDPOINT` must be HTTPS and accept `{event,url}`; optional `ANALYTICS_TOKEN` stays server-side. This is a generic adapter, not a claim that a particular vendor integration is configured. The relay validates an allowlist and known canonical paths, and forwards no incoming IP, browser headers, cookies, user/session identifiers, inquiry ID, form data, campaign data or referrer. The server's outbound network address is visible to the receiving service. Failures never block the quote form. Do not add upstream body logging or automatic request enrichment.

Review the selected host/provider, processing region, consent language, retention and privacy notice for the jurisdictions served before enabling measurement. No legal-compliance certification is claimed.

## Verification and live blocker

Automated tests exercise real encrypted SQLite persistence using temporary test-only keys/files, mocked provider success/outage/recovery, duplicate/concurrent attempts, operator-review gating, CSRF, plaintext absence and deletion. Browser tests cover drafts, bilingual prefill and saved-but-not-notified messaging. The temporary test files are removed afterward.

**Live end-to-end acceptance and email reception: BLOCKED** until the owner provisions the persistent hosting volume, encryption secret, verified email provider/domain and production origin/rate-limit settings. No production credentials were fabricated. Public deployment, production mailbox reception and remote CI are not claimed.

References: [Node SQLite API](https://nodejs.org/download/release/latest-jod/docs/api/sqlite.html), [Resend idempotency window](https://resend.com/changelog/idempotency-keys).
