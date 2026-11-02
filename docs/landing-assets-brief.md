# Landing assets brief (for ChatGPT / Flow / Gemini)

Audience of the landing: **salon owners** (the buyer). Lead magnet: **free trial salon page**. Story: eight scenes, scroll plays the film (see the plan in `docs/landing.md`). This brief lists what has to be generated, with prompts, so the page can be built without guessing. Everything generated here is AI imagery: the page labels it "نمونهٔ تصویری" and never presents it as a real client.

## Rules for every asset
- **Palette and light:** warm espresso `#160D07`, brass `#B9975B`, alabaster `#F8F2EB`. Soft window light with long diagonal shadows, a quiet luxury salon (stone, brushed brass, linen). No saturated colours except the hair, nail or lash change itself.
- **Subject:** the same woman as the hero mirror (Iranian, mid-20s to early 30s, natural makeup, black blazer or neutral knit) so the story feels like one person. Use the existing hero frame (`public/landing/hero.webp`) as the style reference in every prompt.
- **No text, logos, watermarks or UI** inside any frame. Persian text is added by the page.
- **Locked camera** for every video: no pan, zoom or shake. Exactly one thing changes (hair, nail design or lashes). That is what makes scroll scrubbing smooth.
- **Anatomy check before delivery:** hands have five fingers, eyes are symmetrical, hair does not merge into the background.
- **Formats:** images WebP or PNG, min 2400 px on the long side. Videos MP4 (H.264), 24 fps, 1080p minimum, 5 to 8 seconds. Deliver each video in 16:9 and 9:16 (same scene, re-framed, not cropped).

## Drive naming
`A<number>-<name>_<ratio>.<ext>`, for example `A3-hair-transform_16x9.mp4`. Put every file in the Drive folder "Landing Assets (generate here)".

## A2: reference chaos (scene 2, "the pain")
One image, 16:9, `A2-reference-chaos_16x9.png`.
> A messy phone-gallery collage of eight different women's hair inspiration photos (long layers, bob, curtain bangs, curls, blonde balayage, espresso brunette, copper, pixie), different lighting and crops, slightly overlapping at random angles on a warm alabaster background with soft shadows. Looks like screenshots saved from social media but with no app interface, no text, no usernames, no watermarks. Editorial, muted warm tones, a touch of brass.

## A3: hair transformation (scene 3)
Start frame `A3-hair-start_16x9.png`, then a video made from it.
Start frame (ChatGPT image, attach `hero.webp` as style reference):
> Portrait of a young Iranian woman facing the camera, shoulders square, long wavy auburn hair past the shoulders, black blazer, neutral stone-coloured wall behind her, soft window light from the left, shallow depth of field, centered composition with room around the head, photoreal, 85 mm.

Video (Flow, image to video, optionally first and last frame):
> Locked camera. Keep the woman's face, pose and clothing exactly the same. Over six seconds her long auburn hair smoothly transforms into a chin-length bob in champagne blonde, strands re-form naturally, soft light stays constant. No camera movement, no background change.

Last frame to use if the tool supports it (`A3-hair-end_16x9.png`): same portrait with the chin-length champagne-blonde bob.

## A4: nails (scene 4)
`A4-nails_16x9.mp4` and `A4-nails_9x16.mp4`.
Start frame:
> Close-up of a woman's hand resting on pale stone, natural short nails with no polish, soft daylight, shallow depth of field, warm neutral palette, photoreal.

Video:
> Locked camera, hand does not move. Over five seconds the bare nails change into a glossy almond-shaped french manicure with a thin brass-gold accent line. Smooth, realistic polish reflections.

## A5: lashes (scene 4)
`A5-lashes_16x9.mp4` and `A5-lashes_9x16.mp4`.
Start frame:
> Extreme close-up of a woman's closed-to-half-open eye, natural lashes, no mascara, soft window light, warm skin tone, photoreal macro.

Video:
> Locked camera. Over five seconds the natural lashes become full, curled volume lashes, eye stays still and relaxed. No camera movement.

## What the page builds itself (nothing to generate)
Scene 1 hero (done), scene 5 phone chat (done), scene 6 headlines, scene 7 live salon-page mockup, scene 8 plans and FAQ, the 1200x630 sharing image (made from the page), the video poster frames (taken from the first frames).

## After delivery
I convert each video into 50 to 90 WebP frames, paint them on a canvas scrubbed by scroll (so iOS does not stutter), keep the first frame as the poster, and ship under 500 KB for the first paint.
