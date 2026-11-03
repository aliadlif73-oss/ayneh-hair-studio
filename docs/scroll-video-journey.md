# Scroll-controlled service films

Approved scope: retain the five photographic salon-benefit slides. Replace only the retired transformation/frame sequences with the three user-supplied films from the provided Drive folder. Hero, application flows and backend are unchanged.

## Media

| Film | Drive source ID | Source duration |
|---|---|---|
| Hair and colour | 182ScO8D2tul3lSCYByg1RpJhtZSMInIF | 36.250 s |
| Lashes | 1OIQVjqKMRnowF_B7_IRZY8RVSCVQQHgT | 14.933 s |
| Nails | 1fqxj8lEBH7QjoFMwqi56PmynXzRkaQZZ | 8.043 s |

The shipped MP4 copies have no audio, H.264/yuv420p, 960×540, fast-start metadata and short six-frame keyframe intervals for responsive seeking. Original source files remain untouched. Posters and bridge endpoint images are extracted from the supplied films. The transparent generated pedestal is used as a separate DOM element.

## Interaction

Native document scrolling maps to a pinned stage: hair (0–43%), a breathing interval (43–50%), lashes (50–74%), a stone handoff (74–85%), nails (85–100%). Scroll reversal reverses the media. No wheel/touch interception, autoplay, timer-driven playback or external animation dependency is used. Navigation buttons jump to the three services. Videos load as their phases approach. A seek queue coalesces rapid input to the latest requested frame.

The bridge uses the actual final lash frame and initial nail frame. A transparent DOM pedestal emerges into a shared warm background, moves downward with scroll, then dissolves into the incoming film. This is an authored visual transition, not object tracking or a claim that the original films share identical geometry.

Text stays live Persian HTML, with a CTA for each existing service. Films preserve their full 16:9 compositions so eyes and all fingers remain visible. Small screens place text beneath the image. Reduced-motion and short viewports get normal-flow videos with native controls. With JavaScript disabled, source elements and native controls remain available.

## Validation

Run the offline test suite with network disabled, regenerate the landing, run scripts/build.sh and scripts/validate-artifact.mjs. Inspect browser media readiness, forward/reverse seeking, breathing phase, bridge and all three service CTAs. Real-device Safari performance is not claimed.

## Hosted-media loading fix

The private static host returned HTTP 200 for a byte-range request. Films now explicitly preload and fetch the entire same-origin MP4 into a Blob URL before seeking, avoiding dependence on server range support and paused preload=none behavior. Poster images remain only as loading placeholders; loading failures are surfaced. Video requests and Blob URLs stay browser-local.

## Early preload and gaze handoff

All three complete-file downloads now start immediately when the landing script runs, before visitors reach the service section. Removed visible scroll/loading instructions. The first bridge uses the actual final downward-looking hair frame above the upward-looking lash opening frame; a scroll-driven split holds the two gazes together before expanding the incoming shot. No claim of guaranteed readiness on an arbitrarily slow network is made.
