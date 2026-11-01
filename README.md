# آینه | Ayneh Hair Studio

Persian, mobile-first hair consultation for salons. A customer opens the salon's page, adds a selfie, picks a look (the salon's own work, one of 20 ready-made styles, or a photo of their own) and a colour, optionally sees an AI simulation on their own face, and sends it all to the salon. **The salon works only in Telegram**: submissions arrive in the salon's private chat with the bot, and any photo the salon sends to the bot is published on its page as portfolio. There is no salon panel and no booking; the salon calls or messages the customer itself.

Source repository: https://github.com/aliadlif73-oss/ayneh-hair-studio
Cloudflare deployment: `DEPLOY-CLOUDFLARE.md`. Telegram bot setup: `SETUP-TELEGRAM.md`.

## Run and verify

Node.js 22.13+ (tests use `node:sqlite`) and Bash; no npm dependencies.

```sh
npm run dev      # port 4173, local SQLite, in-memory photos, development-only owner identity
npm test
npm run build && node scripts/validate-artifact.mjs
npm run check:kie
```

For a local end-to-end run without a real bot, put `TELEGRAM_BOT_TOKEN=dev-mock`, `TELEGRAM_WEBHOOK_SECRET=…` and `TELEGRAM_BOT_USERNAME=…` in the git-ignored `.dev.vars`: the dev server answers Telegram calls itself and prints what would be sent.

## Routes

- `/s/<slug>`: customer page. Hero with the salon in an arched mirror, "about the salon" sheet (bio, address, hours, phone, map, links), three steps: photo → look and colour → result and send.
- `/admin`, `/admin/<slug>`: owner console (project owner only). Create salons, fill in their details and images, turn simulation on/off, create the salon's one-time Telegram link, remove portfolio items, see delivery status of submissions.
- `/api/telegram/webhook`: Telegram updates, accepted only with `TELEGRAM_WEBHOOK_SECRET` in the `X-Telegram-Bot-Api-Secret-Token` header.
- `/catalog/NN.webp`: photos for the 20 ready-made styles, served as static assets (`public/`).
- `/legacy`: the original studio, owner only.

## Source

- `worker/customer.js`: customer page (style catalog with photos, colour box with suggestions in all three modes, 360° viewer, Telegram send form).
- `worker/ui.js`: owner console.
- `worker/telegram.js`: bot: `/start <code>` linking, portfolio from photos (caption = title), `/list` and delete buttons, delivery of submissions as a photo album with name, mobile and optional Telegram handle.
- `worker/server.js`: API, sessions, mobile verification (OTP), private media, KIE generation, submissions, retention.
- `worker/sms.js`: Melipayamak shared-line pattern SMS (console token or classic REST).
- `worker/design.js`, `worker/fonts.js`: shared design system and self-hosted Vazirmatn / Estedad (SIL OFL 1.1) served from `/fonts/*`.
- `drizzle/`: migrations. `0002_telegram.sql` adds the Telegram link and the `leads` table. Older booking/SMS tables are kept, unused, so no data is destroyed. Append new migrations; never edit applied ones.
- `scripts/generate-catalog.mjs` + `.github/workflows/catalog.yml`: generates the 20 catalog photos with the project's `KIE_API_KEY` and commits them. Runs when the script changes or from the Actions tab; only missing photos are generated.

## Privacy and delivery

- Selfies, reference photos and simulations are private to the customer's session (and the owner) and erased after 30 days. Submissions (`leads`: name, mobile, optional handle) are also erased after 30 days; the salon keeps its copy in Telegram.
- Published portfolio and brand images are public. Sending a photo to the bot is the salon's confirmation that it may be published; it can be removed from Telegram (`/list`) or the owner console.
- A submission is sent to Telegram immediately. If Telegram does not accept it, the scheduler (Cloudflare cron every 10 minutes, or `/api/internal/tick`) retries up to three attempts in total; the owner console can retry a failed one. A duplicate Telegram message is harmless, so an interrupted send is retried.
- When Melipayamak is configured, image generation needs a verified mobile: a 5-digit code (hashed, 2 minutes, 5 tries, 2-minute resend gap, daily caps per session, number, IP and salon). The verified name and mobile are then used for the submission.
- A linked salon can send a customer's mobile (typed or as a shared contact) to the bot; the customer gets the salon page link by SMS. One invite per number per salon per day, 40 per salon per day. SMS attempts are logged in `sms_log` for 30 days.
- Requests are idempotent per session (`idem`), rate-limited per session and per IP, and must use the session's own photos or published try-on portfolio.

## Secrets

Runtime secrets only (Cloudflare via GitHub secrets, or `.dev.vars` locally), never in the repo:

`OWNER_PASSWORD` or `OWNER_PASSWORD_HASH`, `SESSION_SECRET`, `OWNER_EMAIL`, `OWNER_ID`, `KIE_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_BOT_USERNAME`, `APP_ORIGIN`, `JOB_TOKEN`, and for SMS `MELIPAYAMAK_TOKEN` (or `MELIPAYAMAK_USERNAME` + `MELIPAYAMAK_PASSWORD`), `MELIPAYAMAK_OTP_BODY_ID`, `MELIPAYAMAK_INVITE_BODY_ID` (see `SETUP-SMS.md`). Platform identity headers are ignored unless `TRUST_PLATFORM_IDENTITY=true`.

Simulations use Nano Banana Pro at 2K by default (per-salon switch to Nano Banana 2.1 in /admin; a rejected model falls back to nano-banana-2). Prompts lock identity and headscarves and describe each catalog style and Persian colour name in English. Simulation quality (catalog and reference transfer) and the 360° view depend on the image provider and have not been verified with real customer photos; the viewer plays 8 estimated angles, it is not a 3D scan.

## Provider documentation

- https://docs.kie.ai/market/google/nanobanana2
- https://docs.kie.ai/file-upload-api/upload-file-base-64
- https://docs.kie.ai/market/common/get-task-detail
- https://core.telegram.org/bots/api
