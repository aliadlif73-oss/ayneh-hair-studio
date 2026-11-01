# آینه | Ayneh Hair Studio

Persian, mobile-first hair consultation for salons. A customer opens the salon's page, adds a selfie, picks a look (the salon's own work, one of 20 ready-made styles, or a photo of their own) and a colour, optionally sees an AI simulation on their own face, and sends it all to the salon. **The salon works only in its messenger bot** (Telegram, Bale, or both): submissions arrive in the salon's private chat with the bot, the salon marks each one with one tap (called / booked / won't do), and any photo the salon sends to the bot is published on its page as portfolio. There is no salon panel and no booking; the salon calls or messages the customer itself. The customer sees what happened to the request on the page, and can opt in to be told in Telegram or Bale.

Source repository: https://github.com/aliadlif73-oss/ayneh-hair-studio
Cloudflare deployment: `DEPLOY-CLOUDFLARE.md`. Telegram bot setup: `SETUP-TELEGRAM.md`. Bale bot: `SETUP-BALE.md`.

## Run and verify

Node.js 22.13+ (tests use `node:sqlite`) and Bash; no npm dependencies.

```sh
npm run dev      # port 4173, local SQLite, in-memory photos, development-only owner identity
npm test
npm run build && node scripts/validate-artifact.mjs
npm run check:kie
```

For a local end-to-end run without a real bot, put `TELEGRAM_BOT_TOKEN=dev-mock`, `TELEGRAM_WEBHOOK_SECRET=…` and `TELEGRAM_BOT_USERNAME=…` in the git-ignored `.dev.vars` (and `BALE_BOT_TOKEN=dev-mock`, `BALE_BOT_USERNAME=…` for Bale): the dev server answers bot calls itself and prints what would be sent.

## Routes

- `/s/<slug>`: customer page. Hero with the salon in an arched mirror, "about the salon" sheet (bio, address, hours, phone, map, links), a looping before/after demo shown before any photo is asked for, three steps: photo → look and colour → result and send, then a status card for the last request. At the bottom, an "invite friends" banner opens a share sheet (Telegram, WhatsApp, SMS, Instagram via copied link, copy link, and the phone's own share menu for Bale/Eitaa); shared links carry `?r=share` so the dashboard counts visitors who came from them. Each salon page has its own title, description and cover image for link previews (Telegram, WhatsApp, Instagram).
- `/admin`, `/admin/<slug>`: owner console (project owner only). Opens on a stats dashboard (7/30/90 days, all salons or one): visitors, funnel, salon response rate and time, daily visitors and requests, most-chosen looks and colours, simulation ratings, tour/360/follow use, salon comparison; every chart has a table view. Create salons, fill in their details and images, turn simulation on/off, create the salon's one-time Telegram/Bale link, remove portfolio items, see delivery and salon status of submissions.
- `/api/telegram/webhook`: Telegram updates, accepted only with `TELEGRAM_WEBHOOK_SECRET` in the `X-Telegram-Bot-Api-Secret-Token` header.
- `/api/bale/webhook/<secret>`: Bale updates; the path must carry `BALE_WEBHOOK_SECRET` (default: `TELEGRAM_WEBHOOK_SECRET`).
- `/catalog/NN.webp`, `/catalog/demo-before.webp`, `/catalog/demo-after.webp`: photos for the 20 ready-made styles (names Iranian salons and customers actually use, e.g. ولف‌کات، پروانه‌ای، چتری پرده‌ای) and the demo pair, served as static assets (`public/`).
- `/legacy`: the original studio, owner only.

## Source

- `worker/customer.js`: customer page (style catalog with photos, colour box with suggestions in all three modes, 360° viewer, Telegram send form).
- `worker/ui.js`: owner console.
- `worker/telegram.js`: one bot for Telegram and Bale: `/start <code>` linking, step-by-step salon page wizard (`/setup`), portfolio from photos (caption = title), `/list` and delete buttons, delivery of submissions as a photo album plus details with status buttons, reminders to the salon (2 h and 24 h, 9:00–21:00 Tehran), customer follow (`/start f_<token>`).
- `worker/referral.js`: staff referrals. A member's link (`?r=s…`) or a visitor's own share link (`?r=v…`) places each visitor in a per-salon tree; the first link wins for good and is inherited by everyone that visitor brings. A verified mobile is locked to the same member (keyed hash in `ref_phones`). The manager can hand a salon customer to a member or move a customer; removing a member hands all their customers, links and open requests to whoever the manager picks. `report()` feeds the owner dashboard (per member generations, top referrers, who-brought-whom tree).
- `worker/stats.js`: dashboard numbers from `events_log` (anonymous visitor id from the browser, no personal data) and `leads`.
- `worker/server.js`: API, sessions, private media, KIE generation, submissions, retention.
- `worker/design.js`, `worker/fonts.js`: shared design system and self-hosted Vazirmatn / Estedad (SIL OFL 1.1) served from `/fonts/*`.
- `drizzle/`: migrations. `0002_telegram.sql` adds the Telegram link and the `leads` table; `0003_sms.sql` adds mobile verification (`otps`) and salon link texts (`invites`, see SETUP-SMS.md); `0004_engagement.sql` adds `events_log`, lead salon status/reminders/follow and the Bale chat and wizard state; `0005_team.sql` adds `team`, `ref_visitors`, `ref_phones` and the member on leads and portfolio; `0006_alerts.sql` adds `app_settings`, `owner_chats`, `activity`, `bot_seen` (update dedupe), the manager's own member row, album grouping and the owner-alerted flag. Older booking tables are kept, unused, so no data is destroyed. Append new migrations; never edit applied ones.
- `scripts/generate-catalog.mjs` + `.github/workflows/catalog.yml`: generates the 20 catalog photos (Iranian women, Nano Banana Pro) and the demo pair with the project's `KIE_API_KEY` and commits them. Runs when the script changes or from the Actions tab; only missing photos are generated.

## Team and referrals

- The salon manager adds staff in the bot (`/team`) or the owner adds them on the salon page in /admin (name + specialty). Each member opens their one-time invite in Telegram or Bale and gets a permanent personal link (`/link`).
- Whoever arrives through a member's link, and everyone they share the page with at any depth, is that member's customer for good. Their requests, reminders and status buttons go only to that member; other members and the manager never see them (the manager sees numbers only, on the owner dashboard). A request from a member who has not linked yet waits and is delivered when they link.
- Customers who arrive with no member link belong to the salon: their requests go to the manager with one "give to <member>" button per member. If a member's customer later comes through another member's link, the request still goes to the first member and the manager gets a note with a button to move the customer.
- The customer page only shows the salon; portfolio items carry the member's name, and a member's own work is shown first to their customers.

## Owner alerts and reports

- In /admin, "گزارش‌ها و هشدارها" links the owner's own Telegram chat (one-time `/start o_<code>`). Instant alerts go there: a salon or member linked the bot, a page setup finished or was abandoned (with what is missing), a member added or removed, a request waiting for an unlinked manager or member, a failed delivery, a request unanswered for 24 hours, and bot errors. Each repeated warning is sent at most once every 6 hours.
- Every night at 21:00 Tehran the owner gets a digest per salon (visitors, requests, answered, unanswered, waiting, failed, page completeness, and per member requests and new referrals). `/report` in the owner chat sends it now; /admin can preview it.
- The same events are listed in /admin (`activity`, kept 400 days), and each salon shows its page completeness (x of 11 and what is missing), team linked, waiting and overdue requests.

## Privacy and delivery

- Selfies, reference photos and simulations are private to the customer's session (and the owner). They and submissions (`leads`: name, mobile, optional handle) are kept permanently (the owner asked for permanent records; referrals and customer ownership depend on them). Only expired sessions, codes and rate-limit rows are removed.
- Usage events (`events_log`) hold only an event name, a short detail (e.g. the chosen look) and a random browser id; they are kept 400 days for the dashboard.
- Published portfolio and brand images are public. Sending a photo to the bot is the salon's confirmation that it may be published; it can be removed from Telegram (`/list`) or the owner console.
- A submission is sent to every linked bot immediately. If none accepts it, the scheduler (Cloudflare cron every 10 minutes, or `/api/internal/tick`) retries up to three attempts in total; the owner console can retry a failed one. A duplicate Telegram message is harmless, so an interrupted send is retried.
- Requests are idempotent per session (`idem`), rate-limited per session and per IP, and must use the session's own photos or published try-on portfolio.

## Secrets

Runtime secrets only (Cloudflare via GitHub secrets, or `.dev.vars` locally), never in the repo:

`OWNER_PASSWORD` or `OWNER_PASSWORD_HASH`, `SESSION_SECRET`, `OWNER_EMAIL`, `OWNER_ID`, `KIE_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_BOT_USERNAME`, `BALE_BOT_TOKEN`, `BALE_BOT_USERNAME`, `BALE_WEBHOOK_SECRET` (optional), `APP_ORIGIN`, `JOB_TOKEN`. Platform identity headers are ignored unless `TRUST_PLATFORM_IDENTITY=true`.

Simulations use Nano Banana Pro at 2K by default (per-salon switch to Nano Banana 2.1 in /admin; a rejected model falls back to nano-banana-2). Prompts lock identity and headscarves and describe each catalog style and Persian colour name in English. Simulation quality (catalog and reference transfer) and the 360° view depend on the image provider and have not been verified with real customer photos; the viewer plays 8 estimated angles, it is not a 3D scan.

## Provider documentation

- https://docs.kie.ai/market/google/nanobanana2
- https://docs.kie.ai/file-upload-api/upload-file-base-64
- https://docs.kie.ai/market/common/get-task-detail
- https://core.telegram.org/bots/api
- https://dev.bale.ai (Bale Bot API, Telegram-compatible at `tapi.bale.ai`)
