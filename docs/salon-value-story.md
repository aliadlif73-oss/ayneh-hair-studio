# Salon value story — section two

Scope: replace only the old `#pain` single-image section. Hero, the subsequent transformation films, the existing request demonstration, plans and backend are unchanged.

The section is now a five-shot photographic slideshow: hesitation, shared consultation, salon portfolio, pre-visit contact and a clear request. Each slide has its own generated image, short headline and one benefit. The same customer, stylist, salon, cream/espresso/brass palette and golden window light connect the images as a single film sequence.

Native scrolling advances the five full-bleed images inside one pinned stage, with crossfades, subtle image movement, a shared fine brass frame and chapter progress. Chapter buttons navigate within the same section; wheel and touch input are not intercepted. `overflow:clip` prevents a nested scroll position. Reduced motion, short viewports and no JavaScript show all five images in document flow. Generated scenes are labelled illustrative. No app feature or API was added.

## Claim audit of the supplied business-value notes

| Topic | Existing code and claim boundary |
| --- | --- |
| Preview on the customer's own image | Supported for hairstyle, colour, nails and lashes when salon generation is enabled and the provider is configured. It is a simulation, not a guaranteed physical result. |
| Higher-value services / sales | Visual choices may support a sales conversation. Increased sales, higher conversion or more expensive purchases have not been measured. Dedicated mesh, bleach or keratin workflows are not claimed. |
| Faster consultation | A shared reference image is supported. No specific minutes saved or extra daily capacity is claimed. |
| Fewer complaints / rework | A clearer visual reference is supported. A reduction in complaints or rework requires real salon evidence; it is not guaranteed. |
| Acquisition and sharing | A salon link can be shared, including through the existing sharing tools. The current share sheet shares the salon link, not a public customer-result gallery. No claim of free acquisition or replacing advertising is made. |
| Salon portfolio | Bot photo uploads become published portfolio items. Customer try-on uses permitted/published items and the relevant settings. This is not technically enforced by a 20-million plan gate. |
| Customer reference uploads | Implemented, controlled by the salon reference setting; not universally enabled for the demo salon. No pricing gate is invented. |
| SMS and OTP | Salon-link SMS and mobile verification exist when the corresponding SMS services are configured. Verification is not unconditional on every deployment. |
| Request to salon | Photos, chosen look and notes reach the linked Telegram/Bale bot, with status responses. It is a bot chat, not necessarily the salon owner's personal direct-message inbox. No 10-million/20-million sending restriction exists in current code. |
| Follow-up data and campaigns | Existing requests retain customer details and status for the existing flow. A new CRM, segmentation tool or campaign engine is not implied. |
| Automatic upsell | Not implemented. Showing a look is different from automatically recommending another paid service. |
| Branding and costs | A dedicated salon page and profile are existing features. Stronger brand perception, advertising savings and return on investment require business evidence. Pricing and custom VIP scope need a separate product decision. |

Evidence: `worker/server.js` public settings, media/reference/generation/OTP/request routes; `worker/customer.js` reference uploads, generate/lead and share flow; `worker/telegram.js` portfolio uploads, sharing/invites and request statuses. No SQL or live customer content was read.

Verification: complete offline server and portrait tests, build and artifact checks; desktop browser inspection of the five chapters, native scroll navigation and fixed stage positioning. No real-device mobile or Safari claim is made.
