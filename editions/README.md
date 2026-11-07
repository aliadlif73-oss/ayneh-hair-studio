# Independent specialist editions

The four editions live on `hair`, `color`, `nails` and `lashes.ayneh-salon.site`.
They use separate Workers, D1 databases, KV namespaces, signing/encryption secrets and bot connections.
No customer, specialist, portfolio or bot chat from the original application is copied.

The original `worker/index.js`, `wrangler.toml`, published main branch and original deployment are not changed.
All work is on the `specialist-editions` branch. Do not merge it into main just to publish editions.

`node scripts/build-editions.mjs` copies the existing app to ignored `editions-dist/<line>`, applies bounded specialist changes, and embeds only that line's existing public catalog images.
`npm test` builds the editions and runs original and edition tests.

The specialist entrypoint rejects other service lines on the server, isolates private media and sessions, and preserves the existing specialist page, portfolio, upload/reference, simulation, status and Telegram/Bale flow.

The deployment workflow targets only `ayneh-specialist-*`; it copies the owner's configured login and KIE secret through GitHub Actions without exposing them. It generates fresh per-instance secrets once and preserves them on later deployments. It also copies the SMS key, the one-time-code template and the optional booking-confirmed template (`MELIPAYAMAK_TOKEN`, `MELIPAYAMAK_OTP_BODY_ID`, `MELIPAYAMAK_BOOKING_BODY_ID`) so free demos and trial pages require a verified mobile; without them demo generation stays off and trials could be created without limit. It never copies the original bot tokens or the invitation SMS template, whose text names the main host.

## Booking (نوبت‌دهی), editions only

At the owner's request the editions (not the main app) have a standalone booking tool in `worker/booking.js` (server and bot) and `worker/booking-ui.js` (page). Only `worker/edition-entry.js` loads them, and every entry point also requires `SERVICE_LINE`.

- Booking link: `/s/<slug>/book`; the specialist's page also shows a «رزرو نوبت» button at the top and the customer's booking status. No photo or simulation is needed and no image quota is used.
- The customer picks a day (next 14 days) and a free slot, confirms with her mobile (verified with the existing SMS code when SMS is configured) and an optional note, and follows the status on the page: waiting, confirmed (with the address), not accepted, or expired. «لغو یا تغییر نوبت» cancels (change = cancel and pick again). One open booking per mobile per page; overlapping bookings are refused inside the insert and by a database trigger.
- The request arrives in the specialist's own bot chat (Telegram and Bale) with name, mobile, Persian date and time, duration and note, and the buttons ✅ تأیید / ❌ رد / 🔁 پیشنهاد ساعت دیگر. Only that chat can press them. Bot commands: `/hours` (working days, then 9–17, 10–19, 12–20 or a typed range like «10-19»), `/off` (close or reopen one of the next 14 days), `/today`, `/link` (also sends the booking link). A digest of tomorrow's confirmed bookings comes at 21:00 Tehran.
- Defaults: Saturday–Thursday 10–19; hair 60, colour 180, nails 120, lashes 120 minutes; slots every 60 minutes (or the duration if shorter). They live in the page's `salons.settings.booking` and can be changed later.
- A pending request holds its slot for 12 hours; then the cron tick expires it and frees the slot (the specialist gets nothing; the customer sees «دوباره انتخاب کن»).
- Table `bookings` (migration `drizzle/0012_bookings.sql`); the deploy workflow applies migrations to each edition's D1 database before deploying.
- Confirmation SMS (optional): set the GitHub secret `MELIPAYAMAK_BOOKING_BODY_ID` to the number of an approved shared-line text with two variables, {0} = the specialist's page name and {1} = Persian day, date and time. Suggested text: «نوبت شما نزد {0} برای {1} تأیید شد. آینه». It has no link (no starred eNamad). Without it nothing is texted and the page status still updates. Names, mobiles and photos are never written to `events_log`, and owner alerts about booking never contain them.

## Self-serve pages in the bot (ساخت صفحه در ربات), editions only

At the owner's request a specialist can build her own page inside the edition's bot (`worker/onboarding.js`, loaded only by `worker/edition-entry.js` and gated on `SERVICE_LINE`; the main bot is not changed). The owner just shares the bot link.

- `/start` without a code (or `/new`) in a chat that is linked to no page: a short welcome and «✨ ساخت صفحهٔ من», then seven questions, each with «⬅️ قبلی» / «❌ انصراف»: name, page name, city (six buttons or typed), address (optional), mobile through the contact button (only the sender's own contact is accepted; this is the verification, no SMS), Instagram (optional), logo (optional). A summary offers «✅ ساخت صفحه» or «✏️ ویرایش». `/start <code>` and linked chats behave as before.
- On ✅ the page is created with `trial.js makePage` (the landing trial's code), the slug comes from the Instagram handle, else the latinized page name, else `p-xxxxxx`; the chat becomes the page's chat, booking defaults apply, and the bot sends the page link, the booking link and three next steps. The owner gets an alert (page, name, city, line, link; no mobile) with «🔓 فعال‌سازی کامل».
- One bot-made page per bot user and per mobile (they get their link again); wizard starts are rate-limited; bots are ignored. Unfinished wizards live in table `onboarding` (migration `drizzle/0013_onboarding.sql`) and are dropped after 24 idle hours.
- Free images: the page's `trials` row holds 20 images for all customers together, no expiry (`settings.trial` + `settings.bot_made`); each customer's own quota still applies. When they are used up, customers see that generation is not available (page and booking keep working), the specialist gets one message and the owner one alert. «فعال‌سازی کامل» (owner's chat) or the «تصویر رایگان» card on the page in `/admin` removes the cap or sets another number; that card also shows the specialist's mobile.

## Initial operation

1. Open the chosen subdomain's `/admin` and sign in with the configured owner password.
2. Open `/admin/integrations` and add a **new** Telegram/Bale bot token. A bot attached to any different origin is refused; the old webhook is never replaced.
3. Use the connect button. The provider must acknowledge webhook setup; this is not a delivery test.
4. Create the specialist's page from the owner console; add name, image and profile; issue its one-time bot link. (Or share the bot link and let her build her own page in the bot, above.)
5. The specialist opens that link in her own chat. Portfolio uploads and customer requests use that chat.
6. Perform a permitted real image and message test before treating the integration as verified. Reference quality starts unverified and needs owner acceptance.

Keys added in `/admin/integrations` are encrypted with AES-GCM in the edition's own D1 database. They are never returned by the settings API. Empty input preserves the stored key. A key entered there replaces the copied SMS key for that edition; any invitation template must use this edition's host.

The one-time bootstrap route is available for an installation with no owner password, but requires an explicitly provisioned token hash and expiry; no public default password exists.
