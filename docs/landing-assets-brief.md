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

## A6: hairstyles on the hero mirror (so a picked style sits on the model)
Why: the hero mirror can only show a style's shape when a render of the same scene with that style exists. Colour is applied in the browser, so every render keeps the **same warm auburn hair colour** as the hero photo; only the cut and styling change.

How (ChatGPT image edit or Gemini, one image per style):
- Upload the hero frame (`hero.webp`, the three-panel brass mirror on the fluted stone podium) and ask for an **edit, not a new image**.
- Prompt: "Edit this exact photo. Keep everything identical: camera, framing, crop, lighting, the room, the three brass mirror panels, the podium, the woman's face, expression, skin, makeup and black top, and her warm auburn hair colour. Change only her hairstyle to: {STYLE}. The hairstyle must appear consistently in all three mirror reflections (front and both side profiles). Photorealistic, no text."
- Output the same size and aspect as the original (1376 × 768 or larger, same ratio). If the tool changes the framing, discard and retry.
- Name the files `look-s01.webp` … `look-s19.webp` (PNG is fine; it will be converted) and put them in the Drive folder.

| # | {STYLE} |
|---|---|
| 01 | long layered haircut with soft face-framing layers |
| 02 | butterfly haircut: short face-framing layers from the chin, long layers below, bouncy volume |
| 03 | wolf cut: shaggy choppy layers at the crown, shoulder length |
| 04 | hush cut: soft feathery layers, shoulder length, see-through bangs |
| 05 | lob: collarbone-length bob with soft layers |
| 06 | short chin-length blunt bob |
| 07 | A-line bob, short at the back and longer at the front |
| 08 | pixie cut with a soft side-swept fringe |
| 09 | curtain bangs parted in the middle with medium-long hair |
| 10 | butterfly bangs: long layered bangs sweeping outward |
| 11 | long side-swept bangs with long layered hair |
| 12 | long straight hair with thick blunt bangs at eyebrow level |
| 13 | voluminous salon blowout with big round-brush volume |
| 14 | sleek straight keratin-smooth long hair |
| 15 | big soft glossy waves |
| 16 | natural defined curls, shoulder length |
| 17 | big spiral corkscrew curls |
| 18 | messy high top bun with loose face-framing strands |
| 19 | elegant low bun at the nape with soft tendrils |

After delivery: `python tools/make_masks.py` (in `design/landing`) builds `mask-sNN.png` for each render and an overlay check image; the build then turns those styles on in the mirror automatically. Styles without a render keep the honest card: "this style is made on the customer's own photo".

Also useful: a larger hero frame (2752 × 1536, same scene) so the mirror stays sharp on big screens, and the A3 to A5 videos exported at 1080p or 4K (they arrived at 1280 × 720, which is the sharpness limit of the scroll scenes today).
