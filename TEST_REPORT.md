# Development verification — 31 October 2026

## Automated integration tests

Latest local result: **16 tests passed, 0 failed**. Run `npm test`. Tests exercise the real Worker router against SQLite with foreign keys and the actual schema/triggers, plus a test-only object bucket. They do not use paid providers.

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

16. Only salon owners can grant/revoke managers; managers cannot expand access or read another salon.
17. GET requests cannot trigger mutations; image-processing and salon-review consents are independently required by the server.

## Pending real-service acceptance

- Real preservation of customer identity, all three reference modes and transfer of salon portfolio photos: requires KIE key, authorized photos and visual review by customer/stylist.
- Eight estimated views: protocol implemented; output geometry and consistency unverified.
- Real SMS acceptance, delivery and authorized sender eligibility: requires Kavenegar credentials, line and permitted test phone.
- Unattended reminders: workflow prepared, inactive until the protected job token is configured and the endpoint is exercised.

## Browser QA

Local browser verification used a synthetic image and fictional customer, with SMS and KIE disconnected: original upload, request submission, Persian date and Tehran time, correct salon panel, independent stylist review and alternative-time proposal were exercised successfully. Test fixtures are not real salons or customer records. Hosting deployment results are recorded separately in the delivery conversation.

Responsive CSS is implemented; dedicated physical-device testing is still pending.
