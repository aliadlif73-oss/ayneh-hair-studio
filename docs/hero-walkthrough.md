# Hero walkthrough

The hero now explains the customer journey explicitly: upload a face/hand photo, preview a hairstyle, hair colour, nail design or lash style, send the chosen image to the salon, and receive the salon's decision through the existing Telegram/Bale flow. No submission or generation backend was changed.

After window load, fonts and the three hero render/mask pairs are ready, the one-shot native walkthrough shows empty mirror glass, a dragged photo card, the original portrait, a short bob, copper colour, then a 3D turn to the try-it invitation. It never uploads a file or calls a generation provider. Visitor input cancels the walkthrough. Replay and skip controls are available. Reduced motion bypasses the walkthrough; hidden tabs and leaving the scene cancel it.

## Real previews and reference photos

The compact hero picker offers three real renders of the same woman: the existing layered long hair, short bob (`s06`) and straight full bangs (`s12`). All 19 reference styles remain in the expanded rail and the actual customer catalog remains unchanged. Unsupported references are explicitly labelled and are not misrepresented as changing the model's hairstyle. Seven colour swatches apply through each render's own hair mask.

Image/mask preparation is asynchronous. A colour click waits for the mask if necessary. A token protects hairstyle changes from stale loads; old delayed transitions cannot restore an earlier style. A failed image load has visible feedback and may be retried.

## Assets and build

`design/landing/assets/look-s06.webp`, `look-s12.webp`, `mask-s06.png`, `mask-s12.png` are also shipped in `public/landing/`. `build.py` synchronizes these files. Rebuild from `design/landing` with `python build.py`; do not edit `worker/landing.js` directly. `python tools/make_masks.py` recreates the masks with explicit face/neck protection for the two new renders.

The blank mirror uses aligned SVG glass surfaces over the existing scene, so the original frames and room do not shift. UI choreography is native HTML/CSS/JS rather than video: its hand cursor can click the actual controls, visitors can interrupt it, and text stays sharp.

## Image-generation prompts

Created using the built-in image tool, editing the repository's `hero.webp`:

**Short bob:** Use case: identity-preserve. Change ONLY the hairstyle of the SAME woman in ALL THREE mirror reflections to a clearly SHORT sleek chin-length blunt bob, middle part, soft ends, same warm brown hair colour. Keep exactly the same face, pose, facial expression, black clothing, skin, body, lighting, mirror geometry, room, pedestal, shadows, camera framing and 1376x768 composition. Reveal natural neck and black blouse where long hair was. Side mirrors must consistently reflect the identical short bob. No text, no new objects. Needed for pixel-aligned hairstyle crossfade.

**Straight bangs:** Use case: identity-preserve. Change ONLY the hairstyle of the SAME woman in ALL THREE mirror reflections to LONG PERFECTLY STRAIGHT sleek glossy hair with full blunt eyebrow-length bangs, same warm brown colour. Keep exactly the same face, pose, facial expression, black clothing, skin, body, lighting, mirror geometry, room, pedestal, shadows, camera framing and 1376x768 composition. Side mirrors must consistently reflect identical straight hair and bangs. No text, no new objects. Needed for pixel-aligned hairstyle crossfade.

## Verification and limits

58 existing server tests passed (after rebasing onto the latest main) with external fetch disabled in the test process. This safeguard prevents incomplete provider mocks from reaching KIE. Build and artifact validation passed. Desktop Chrome was used to verify the walkthrough, final invitation, replay/skip, real model changes and colour selection. Real-device mobile, Safari and screen-reader testing remain unverified.

The configured Sites project returned `Sites project not found`; the connected account's Sites list was empty. No project identity was replaced, and no production deployment was attempted through an alternative host.
