# Independent specialist editions

The four editions live on `hair`, `color`, `nails` and `lashes.ayneh-salon.site`.
They use separate Workers, D1 databases, KV namespaces, signing/encryption secrets and bot connections.
No customer, specialist, portfolio or bot chat from the original application is copied.

The original `worker/index.js`, `wrangler.toml`, published main branch and original deployment are not changed.
All work is on the `specialist-editions` branch. Do not merge it into main just to publish editions.

`node scripts/build-editions.mjs` copies the existing app to ignored `editions-dist/<line>`, applies bounded specialist changes, and embeds only that line's existing public catalog images.
`npm test` builds the editions and runs original and edition tests.

The specialist entrypoint rejects other service lines on the server, isolates private media and sessions, and preserves the existing specialist page, portfolio, upload/reference, simulation, status and Telegram/Bale flow.

The deployment workflow targets only `ayneh-specialist-*`; it copies the owner's configured login and KIE secret through GitHub Actions without exposing them. It generates fresh per-instance secrets once and preserves them on later deployments. It also copies the SMS key and the one-time-code template (`MELIPAYAMAK_TOKEN`, `MELIPAYAMAK_OTP_BODY_ID`) so free demos and trial pages require a verified mobile; without them demo generation stays off and trials could be created without limit. It never copies the original bot tokens or the invitation SMS template, whose text names the main host.

## Initial operation

1. Open the chosen subdomain's `/admin` and sign in with the configured owner password.
2. Open `/admin/integrations` and add a **new** Telegram/Bale bot token. A bot attached to any different origin is refused; the old webhook is never replaced.
3. Use the connect button. The provider must acknowledge webhook setup; this is not a delivery test.
4. Create the specialist's page from the owner console; add name, image and profile; issue its one-time bot link.
5. The specialist opens that link in her own chat. Portfolio uploads and customer requests use that chat.
6. Perform a permitted real image and message test before treating the integration as verified. Reference quality starts unverified and needs owner acceptance.

Keys added in `/admin/integrations` are encrypted with AES-GCM in the edition's own D1 database. They are never returned by the settings API. Empty input preserves the stored key. A key entered there replaces the copied SMS key for that edition; any invitation template must use this edition's host.

The one-time bootstrap route is available for an installation with no owner password, but requires an explicitly provisioned token hash and expiry; no public default password exists.
