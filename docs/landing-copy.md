# Landing copy: voice, CTA map, form (2026-11-02)

Written with the persian-writing, copywriting and cro skills. The pass itself is `design/landing/tools/copy_pass.py`.

## Voice
- Reader: the salon owner (the buyer). Address is **شما**, never تو. تو with a stranger who runs a business reads as rude.
- Register: formal-but-human website copy. Written forms (می‌شود), short sentences, one idea each, scenes instead of adjectives (صندلی، گوشی، اینستاگرام).
- No invented numbers, clients or reviews. Claims that depend on the salon's settings say so («اگر شبیه‌سازی برای سالن روشن باشد»).
- `fa_lint.py --check` on the rendered text: 0 issues.

## One-line product explanation (hero)
آینه یک صفحهٔ اینترنتی برای سالن شماست. مشتری عکسش را می‌گذارد، مدل مو، رنگ، طرح ناخن یا مژه را روی خودش می‌بیند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد.

## CTA map (one promise: «صفحهٔ آزمایشی رایگان سالن من», same verb each time)
| Where | Why there |
|---|---|
| Header button | always reachable on desktop |
| Hero primary and ghost «امتحان روی عکس خودم» | the promise has just been read; the ghost link lets the curious try the demo salon first |
| Band after the pain, transformation and nails/lashes scenes | peak desire, right after the product has been shown |
| Section «بعد از انتخاب مشتری» | answers «what do I get as the owner» next to the phone mock |
| Service cards «امتحان روی عکس خودم» | per-line try-it (hair, nails, lashes) |
| Each plan «شروع با صفحهٔ آزمایشی» | price is a decision point; the plan name travels to the form and to the owner's bot message |
| Final band after the FAQ | catches visitors who read everything |
| Sticky bar on phones (hides while a CTA band or the form is on screen) | thumb-reach CTA after the hero |

## The form (section `#start`)
- Required: salon name, mobile, consent tick. Optional: your name, city. The free-text note was removed.
- Button: «صفحهٔ سالن مرا بساز» (first person, says what happens). Under it: «۱۰ ساعت · ۵ تصویر · بدون پرداخت و کارت بانکی».
- The live mockup beside the form (name and brand colour) shows the reward before the visitor commits.
- After submit: the link to the new salon page, not a "we will call you" message. The owner's bot gets name, mobile, link, and the chosen look, brand colour and plan.

## Open
- Privacy and terms text (the footer says they will be added).
- Public prices stay (owner decision); plan names Basic / Pro / VIP unchanged.
- No testimonials or numbers until real ones exist.
