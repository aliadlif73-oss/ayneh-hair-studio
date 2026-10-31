# Development verification — 31 October 2026

## Automated integration tests

Latest local result: **24 tests passed, 0 failed**. Run `npm test`; CI runs the same command on Node 24. Tests exercise the real Worker router against SQLite with foreign keys and the actual schema/triggers, plus a test-only object bucket. They do not use paid providers. The list below summarises the behaviours covered; one test may assert more than one, and unit-level assertions (digit normalisation, client script syntax) are included in the first test.

1. Persian/Arabic mobile digits normalize to Iranian E.164; invalid numbers rejected.
2. Customer sessions cannot read another session's photos or a different salon's records.
3. Random or expired capability tokens and unauthorized manager requests rejected.
4. Repeated customer submission uses the same request and one receipt message.
5. Knowing an existing phone number does not grant access or create a duplicate customer.
6. Stylist review is independent of appointment state and has no pricing fields.
7. Alternative salon time stays unconfirmed until customer accepts.
8. Customer counterproposal returns responsibility to the salon; stale versions rejected.
9. Concurrent overlapping confirmations yield one success and one conflict at the database layer. Nonoverlapping times succeed.
10. Manual customers upsert by normalized phone; message preview exists; disconnected SMS remains queued with zero send attempts.
11. Published portfolio uses only independently uploaded salon-owned portfolio media; cross-salon publication is denied.
12. Followup is unique; cancellation and opt-out stop queued followups.
13. Old proposal capability cannot confirm a new proposal even when supplied the current version manually.
14. Mock image provider verifies two distinct input images, independent transfer prompts, idempotent task creation, result retrieval and private result access. **This is protocol validation, not facial-similarity or hair-transfer quality validation.**
15. Mock SMS provider verifies bounded rejection retries, attempt logging and no automatic resend after an uncertain network failure. **No SMS was sent.**
16. GET requests cannot trigger mutations; only salon owners can grant/revoke managers; managers cannot expand access or read another salon.
17. Image-processing and salon-review consents are independently required by the server.
18. Unknown pages and unknown APIs answer `404` (not a blank app shell); `HEAD` returns `200`; `favicon.ico` returns `204`.
19. The queue endpoint answers `405` for a wrong method before it evaluates the job token.
20. A tiny upload reports a size-specific error instead of the five-megabyte message.
21. Retention cleanup erases private media older than 30 days (database row and stored object), expired sessions and expired rate-limit rows. The page loads no external font and the production CSP keeps `frame-ancestors 'none'`.
22. On a host without a platform identity gateway the owner signs in with a password, receives a signed cookie, creates a salon, and a tampered cookie or a signed-out request is rejected. Password login stays disabled (`503`) until a secret is configured. **Verified end to end in `wrangler dev` against local D1 and R2.**
23. Platform identity headers are ignored unless `TRUST_PLATFORM_IDENTITY=true`, so a Cloudflare deployment cannot be impersonated with a header.

## Pending real-service acceptance

- Real preservation of customer identity, all three reference modes and transfer of salon portfolio photos: requires KIE key, authorized photos and visual review by customer/stylist. The configured key can be sanity-checked with `npm run check:kie` without spending credit.
- Eight estimated views: protocol implemented; output geometry and consistency unverified.
- Real SMS acceptance, delivery and authorized sender eligibility: requires Kavenegar credentials, line and permitted test phone. Delivery receipts and opt-out keywords are not implemented.
- Unattended reminders: `.github/workflows/messages.yml` is present and validates; it stays inactive until `AYNEH_JOB_TOKEN` (secret) and `AYNEH_APP_URL` (variable) exist, and the endpoint has not yet been exercised against production.

## Browser QA

Local browser verification used a synthetic image and fictional customer, with SMS and KIE disconnected: original upload, request submission, Persian date and Tehran time, correct salon panel, independent stylist review and alternative-time proposal were exercised successfully. Test fixtures are not real salons or customer records. Hosting deployment results are recorded separately in the delivery conversation.

Responsive CSS is implemented; dedicated physical-device testing is still pending. Fonts now use the system stack, so the page no longer depends on a blocked external font.
