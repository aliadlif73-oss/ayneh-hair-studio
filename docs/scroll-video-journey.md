# Scroll-controlled service films

Approved scope: retain the five photographic salon-benefit slides. Replace only the retired transformation/frame sequences with the three user-supplied films from the provided Drive folder. Hero, application flows and backend are unchanged.

## Media

| Film | Drive source ID | Source duration |
|---|---|---|
| Hair and colour | 182ScO8D2tul3lSCYByg1RpJhtZSMInIF | 36.250 s |
| Lashes | 1OIQVjqKMRnowF_B7_IRZY8RVSCVQQHgT | 14.933 s |
| Nails | 1fqxj8lEBH7QjoFMwqi56PmynXzRkaQZZ | 8.043 s |

The shipped MP4 copies have no audio, H.264/yuv420p, 960×540, fast-start metadata and short six-frame keyframe intervals for responsive seeking. Original source files remain untouched. Posters and bridge endpoint images are extracted from the supplied films. The transparent generated pedestal is used as a separate DOM element.

## Interaction and responsive UX

Hair and lashes are now ordinary document-flow sections. Muted inline video playback starts at 40% visibility and pauses when the panel leaves view or the document is hidden. Each film has a play/pause/replay control; blocked autoplay exposes native controls. Reduced motion keeps playback under user control.

Only the pedestal handoff and nails remain pinned, over a compact 270svh desktop / 260svh mobile section. A requestAnimationFrame interpolation smooths the scroll target and a seek queue keeps only the newest requested nail frame. There is no wheel/touch interception. The transparent DOM pedestal and actual boundary frames connect the two supplied films.

The five salon-benefit images now occupy one compact carousel, advancing every four seconds only while visible. Previous/next arrows, direct chapter buttons and a pause control allow manual navigation. Reduced motion starts the carousel paused.

On mobile the hero mirror, all seven color swatches and the three renderable styles share one bounded playground. This keeps the result visible during selection. The introductory walkthrough is desktop-only; mobile immediately shows the portrait. Color selection draws one final masked tint instead of computing an 820ms pixel animation; seven hues use more restrained luminance adjustment. Prepared portrait/thumbnail encodings use WebP. Existing backend and salon features are unchanged.

Film downloads wait for the small hero preparation promises, then buffer complete MP4s to local Blob URLs so seek behavior does not depend on server byte ranges. No technical loading or scroll instructions are displayed.

## Validation

61 offline tests passed; landing regenerated; scripts/build.sh and scripts/validate-artifact.mjs passed. Browser checks in a real 390px iframe viewport verified all seven color selections, visible recoloring, compact mirror/control layout, no horizontal overflow and visible-triggered film playback. This is a responsive browser check, not a claim of testing physical iOS or Android hardware.
