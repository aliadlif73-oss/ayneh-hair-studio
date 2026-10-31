# آینه | Ayneh Hair Studio

Persian, mobile-first hair consultation and salon coordination application. This is the independently rebuilt project, with a tenant-isolated salon layer added to the original private studio.

Source repository: https://github.com/aliadlif73-oss/ayneh-hair-studio
Hosted app: https://ayneh-hair-studio.roya-mh96.chatgpt.site

## Run and verify

Node.js 22.13+ (the tests use `node:sqlite`) and Bash; no npm dependencies. CI runs the same commands on Node 24.

```sh
npm run dev
npm test
npm run build
node scripts/validate-artifact.mjs
npm run check:kie   # only checks whether the configured provider key is accepted
```

The development server runs on port 4173, uses a local SQLite database and in-memory photo bucket, and injects a **development-only** identity. Development data is not production data. Restarting the development server clears its photo bucket. Production deploys only `dist/server/` and the hosting manifest, never `dev.mjs` or the development identity.

### Secrets

Provider keys belong in the hosting provider's runtime secret store (Sites/Cloudflare bindings) and, for local runs only, in git-ignored `.dev.vars` or `.env`. The development server and `npm run check:kie` read those files and never print or commit a value. Never paste a key into chat, an issue, a commit or a screenshot. `npm run check:kie` reports only whether KIE accepted the key, using a bogus task id, so no image is generated and no credit is spent.

## Routes and source

- `/admin`: authorized salon list and owner-controlled creation.
- `/admin/<slug>`: salon requests, appointments, customers, portfolio, profile, staff/services and message settings/logs.
- `/s/<slug>`: branded customer page and consultation.
- `/s/<slug>/access#<random-token>`: seven-day customer access; token exchanged for an HttpOnly cookie and removed from the address bar.
- `/legacy`: original studio, restricted to the project owner.
- `worker/domain.js`: input validation, state transitions and distinct reference-transfer prompts.
- `worker/server.js`: D1/R2 operations, authorization, KIE, durable message outbox and bounded sending.
- `worker/ui.js`: embedded RTL salon/customer UI with Persian calendar and Tehran time.
- `drizzle/0000_salons.sql`: initial tenant schema and database-level overlap triggers. Once deployed, append migrations; do not edit it.

## Identity and privacy

Sites dispatch supplies authenticated identity headers. The project owner email is an environment value used only to restrict new salon creation and the legacy studio. Salon authorization uses stable user IDs; owner/member records are checked on the server. Do not trust raw identity headers on an independently hosted deployment without a trusted gateway stripping and setting them.

All private images are served after session or salon-member checks. Gallery images become public only when the salon publishes a portfolio item with independent publication permission. Original, reference and simulation media have different server-owned types; simulations cannot be published as real portfolio images. Private photo access expires after 30 days; customer capability tokens expire after seven days. Provider retention is separate. Deleting a gallery item unpublishes it; it does not erase an image already attached to an authorized request. Each queue tick also erases private media older than 30 days (with the stored object), expired customer sessions and expired rate-limit rows; brand and published portfolio media are kept. Records that still reference an erased file keep their history but the file itself is gone.

Booking proposals use compare-and-swap versions and customer links are bound to the request/proposal version. A stale proposal cannot confirm a newer one. Database triggers reject overlapping confirmed appointments for the same stylist, including concurrent confirmations. Technical review and appointment status are independent. All timestamps are UTC milliseconds, displayed through `Asia/Tehran`; customer date selection is Persian.

## External activation

Configure keys only as Sites runtime secrets; see `.env.example` for names and `SETUP-KIE.md` for the step-by-step Sites panel walkthrough, the GitHub scheduler setup and the local `.dev.vars` route.

Managers sign in and copy their account ID from `/admin`; the salon owner adds that ID under page settings. Membership can be revoked without altering other salons.

1. `OWNER_EMAIL`: owner account authorized to create salons. Sign in through ChatGPT and create a salon, staff and services in `/admin`.
2. `KIE_API_KEY`: real image provider. Generation is separately enabled for each salon. Reference transfer is disabled until an actual quality test has been performed and acknowledged in salon settings. Multiple reference modes and eight-view job paths are implemented but **visual quality has not been tested live**.
3. `KAVENEGAR_API_KEY`, `KAVENEGAR_SENDER`: SMS credentials and authorized sender. Account/line eligibility, blacklists and delivery must be verified with the provider. No real number was used during development.
4. `SMS_LIVE_ENABLED=true`: set only after an authorized real-send test succeeds; enable each salon's consent-aware SMS setting separately. Without it messages remain queued, never labelled sent. `submitted` means accepted by provider, not delivered.
5. `JOB_TOKEN`: strong runtime secret protecting the unattended queue endpoint. Configure the same value as GitHub repository secret `AYNEH_JOB_TOKEN` **and** the public origin as repository variable `AYNEH_APP_URL` to activate `.github/workflows/messages.yml`, which calls `/api/internal/tick` every ten minutes (and on manual dispatch). Without either value the workflow exits successfully and does nothing. The workflow also runs the retention cleanup. Prefer a hosting-native cron if the platform offers one; the endpoint is idempotent, so both may run.

Unambiguous provider rejections retry up to three attempts. Ambiguous network failures and interrupted in-flight sends enter `unknown` and never auto-resend; reconcile in the provider console before any manual recovery. Unique event/version keys prevent duplicate messages. Followups require individual opt-in and occur at most once per relevant proposal; cancellation, rejection and opt-out stop pending followups. Queue bodies contain protected links, not images. Staff can preview the recipient and message before preparing a manual invitation.

## Delivery and GitHub

GitHub stores source and runs tests/build validation. Production is hosted by Sites; pushing to GitHub alone does not publish the app. Keep both destinations synchronized for every user-requested change. Do not commit credentials, customer data, the local database or deployment archives.

See `TEST_REPORT.md` for evidence and limitations. This scope includes no salon service prices, invoices, payment, deposits, loyalty, product sales, accounting or automatic diagnosis/color formula.

## Provider documentation checked

- https://docs.kie.ai/market/google/nanobanana2
- https://docs.kie.ai/file-upload-api/upload-file-base-64
- https://docs.kie.ai/market/common/get-task-detail
- https://kavenegar.com/rest.html
