# Landing page (`/`)

Status: **work in progress, design tokens PROPOSED**. The owner console moved to `/admin`; `/` is now the public landing page.

Source of truth for the page is `design/landing/` (HTML, CSS and JS sources, image assets, build script). The Worker serves a generated module, `worker/landing.js`. Do not edit `worker/landing.js` by hand; change the sources and rebuild:

```sh
cd design/landing && python build.py   # writes worker/landing.js and out/ (preview + single-file artifact)
npm test && npm run build && node scripts/validate-artifact.mjs
```

Shipped images live in `public/landing/` and are served as static assets (same mechanism as `public/catalog/`).

## Design system in use

Decisions recorded in the project Master handoff (Google Drive): D057 (reference 15 = swatch/selector/before-after model, reference 16 = palette), D059 (Estedad), D060 (visual direction), D061 (mirror frame proportion), D062 (mobile menu), D063 (documentation then skeleton), D064 (landing on `/`, console on `/admin`; nails and lashes included).

| Role | Value |
|---|---|
| Canvas / surface / sunken | `#F8F2EB` / `#FCFAF6` / `#EDE5D9` |
| Text / muted | `#1E140B` / `#5C5045` |
| Espresso (dark sections, primary action) | `#160D07`, raised `#211409` |
| Brass (frames, rings, dividers) | `#B9975B`, soft `#D6BE8C`, readable text `#7A5A32` |
| Type | Estedad (Persian, self-hosted via `/fonts/*`), Vazirmatn fallback and Latin |
| Scale | display `clamp(40px,4vw,60px)`, h2 `clamp(32px,4vw,48px)`, body 16/1.9, UI 15 |
| Radius | control 12, card 20, frame 28, pill 999 |
| Motion | micro 120-180ms, component 240-320ms, scene 500-700ms; `prefers-reduced-motion` removes decorative motion |

Tokens are declared as CSS variables at the top of `design/landing/index.html`. Exact values remain PROPOSED until approved.

## Page structure

1. Film hero: pinned stage; scroll plays the scene. A 3D-icon dock sits on the podium (scrollable, arrow opens a photo rail with all 19 catalog styles); a vertical colour column recolours the model's hair on a canvas through a hair mask; length looks (`long`, `lob`, `bob`) swap the mirror scene.
2. From mirror to salon: the visitor's selection becomes the request that arrives in a sample salon chat, with the one-tap statuses.
3. Services: hair, nails, lashes.
4. How it works, for salons, plans, FAQ.
5. Start: customer path and the salon inquiry form.

Extension points in `design/landing/src/hero.js`: `STYLES`, `COLORS`, `LOOKS` and `LOOK_OF` (which style uses which look). A look is a full mirror image plus its own hair mask (`public/landing/look-*.webp`, `hair-mask-*.png`); `design/landing/looks.py` produced the current two by cutting the photo.

## Salon inquiry form

`POST /api/inquiry` (same-origin only, honeypot field, 5 per IP per day) stores the request in `inquiries` (migration `0008_inquiries.sql`) and sends the details to the owner's linked Telegram/Bale chat through `notifyOwner`. The phone number is in the bot message and the table only; it is not written to the `activity` log. Link an owner chat from `/admin` ("reports and alerts") first, otherwise the inquiry is saved but no message is sent.

## Open items

- CTA targets: "امتحان آینه" should open a demo salon page `/s/<slug>` (none chosen); until then it scrolls to the start section.
- Hairstyle shape is applied on the model only for length looks. Curls, bangs, buns and the rest need a render per style (a photo plus a mask in the same slots); the current dock icons are four approved 3D icons reused as placeholders.
- Some colours do not cover every strand of hair; the mask is colour-segmented, not hand-drawn.
- Plans: names (VIP vs Elite), "from 80M", monthly image charge and plan gating are business definitions, not enforced in code.
- Hosting target (AGENTS.md says Sites, `wrangler.toml` deploys to Cloudflare), retention wording (AGENTS.md: kept permanently; UI text elsewhere says 30 days), privacy and terms pages.
- Mobile: result chip and colour column overlap the mirror a little; needs one more pass.
- No real-device, Safari/Firefox, screen-reader or WCAG audit yet.
