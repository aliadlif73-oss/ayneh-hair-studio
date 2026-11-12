# Landing: QA results and deploy checklist (PR #18)

Status date: 2026-11-02. Nothing here is deployed. Merge and deploy need the project owner's approval.

## What was checked (local dev server, built-in browser)
| Check | Result |
|---|---|
| Tests (`npm test`), `npm run build`, `validate-artifact` | 52/52 pass, build and validator pass |
| Horizontal overflow at 320, 375 and desktop widths | none |
| Console errors on the landing | none |
| Trial form end to end (fill, submit, open the new salon page) | works: page carries salon name, brand colour, countdown bar and image count |
| Landing images with alt text, labelled form fields, one `h1`, no duplicate ids | pass |
| Scroll scenes (pain, hair, nails, lashes) at desktop and phone width | work; frames load near the viewport |
| `prefers-reduced-motion` | scenes become static (code path only; not exercised in a browser) |

## Not checked (needs a real device or the deployed site)
- iPhone Safari and Android Chrome on a real phone (scroll scrubbing, sticky stage, 100svh).
- Lighthouse and real-network first paint. Local measure before image slimming: about 650 KB first load (HTML 100 KB uncompressed, fonts 90 KB, images 460 KB); images are now about 275 KB lighter.
- Link preview in Telegram, Bale, Instagram, WhatsApp (needs the public origin; `og:image` is built from `APP_ORIGIN`).
- Screen reader pass; colour contrast of every pairing.

## Known small issues
- Dock arrows and the "more" control are 30 px tall (WCAG 2.2 minimum is 24 px; 44 px is the comfortable size).
- The hero dock heading "مدل مو" comes before the `h1` in document order.
- Frames of the nails and lashes clips show slight camera drift (source videos were not locked).
- Videos exist only in 16:9; on phones the frame is cropped to 4:5 around the subject.

## Before deploy: owner decisions
1. **F03 hosting**: Cloudflare Workers (current repo setup) versus Sites. The deploy workflow only runs on `main` and needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
2. **F11 photo retention**: trial salons are created from a public form; customer photos in trial pages follow the same permanent-retention rule as every salon (see `cleanup()` in `worker/server.js`). Decide whether trial photos should be deleted after expiry. Not implemented.
3. **Privacy and terms pages**: the form collects name, mobile, salon and city and says the owner will call. A privacy page and terms link are not written yet.
4. **Plan names and public prices**: panels stay as they are (owner decision 2026-11-02). Names still read Basic / Pro / VIP.
5. **Trial abuse**: limits are one trial per mobile and 5 creations per network per day. There is no SMS or Turnstile check, so someone can type a mobile number that is not theirs and spend up to 5 paid images. Decide whether to add Turnstile (or the existing SMS verification) before public launch.
6. **KIE spend**: every trial can use up to 5 images. Set a KIE account budget alert before launch.

## Deploy steps (after approval)
1. Merge PR #18 into `main`. The GitHub workflow applies D1 migrations `0008_inquiries` and `0009_trials`, deploys the Worker, then pushes secrets.
2. Confirm repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `APP_ORIGIN` (final address), `KIE_API_KEY`, `OWNER_EMAIL`, `OWNER_PASSWORD_HASH` (or `OWNER_PASSWORD`), `SESSION_SECRET`, `TELEGRAM_BOT_TOKEN` and webhook secret.
3. Link the owner chat in the bot so inquiries and new trial pages reach the owner (`/admin`, then the bot link).
4. Smoke test on the live origin: open `/`, submit the trial form with a real number you control, open the returned `/s/t-...` page, make one image, confirm the owner chat got the message.
5. Share the link in Telegram once to check the preview image.
6. Remove the `noindex` meta only when the owner approves the page for search engines (the Worker build already omits it; check `curl -s <origin>/ | grep robots`).

## Cloudflare "Workers Builds" check is red
The failing check is Cloudflare's own Git integration (build 77aac3f9 in the dashboard), not the GitHub `build` jobs, which pass. It also fails on PRs #16 and #17, so it predates this work. The log is only visible in the Cloudflare dashboard. The repo already deploys through `.github/workflows/deploy.yml`, so this integration is probably redundant: either read its log and fix it, or disconnect it to avoid two deploy paths.
