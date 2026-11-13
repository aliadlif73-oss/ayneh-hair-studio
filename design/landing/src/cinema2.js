/* Section entrance choreography for the redesigned page.
   The prev-page engine (cinema.js) was tied to the retired layout — .sec-head, .kicker,
   .benefit, #transform, a navy palette — so only the idea survives here: every entrance is
   SCRUBBED BY SCROLL, back and forth, not fired once by an observer. Scroll down and the
   words fly in; scroll back up and they leave again. The visual language is this page's own:
   emerald hairlines, cream light, soft rise.

   Nothing is hidden that a keyboard or a search engine could not see: the effects only move
   and fade, the text is in the DOM from the first byte, and prefers-reduced-motion turns the
   whole file off to a plain page. */
(() => {
  const root = document.documentElement;
  /* take the plain page off as soon as this file runs — before any keyframe can hide text */
  root.classList.remove('no-cinema');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  /* ── tunables ── */
  const ENTER = 0.94;      // a section starts moving when its top is this far down the screen
  const FULL  = 0.42;      // …and is fully home by the time it reaches this line
  const GOLD  = new Set(['آینه', 'شما', 'خودش', 'سالن', 'آینه،', 'رشد', 'حرفه‌ای', 'مجموعه', 'زیبایی', 'مشتری']);

  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const sub = (p, s, e) => clamp((p - s) / ((e - s) || 1));
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  root.classList.add('cinema-ready');
  $$('#intro .hero-benefits li').forEach((el, i) => el.style.setProperty('--i', i));

  /* ── one rAF loop for every track ── */
  const tracks = [];
  let raf = 0;
  const add = (el, target, apply) => {
    if (!el) return;
    const t = { el, target, apply, last: -1 };
    apply(0);           // draw the "before" state now, so nothing flashes in at full size
    tracks.push(t);
  };

  /* a section's progress: 0 when its top is still low on the screen, 1 when it has risen */
  let tops = new WeakMap(), measureV = 0;
  const topOf = el => {
    let c = tops.get(el);
    if (!c || c.v !== measureV) {
      c = { v: measureV, top: el.getBoundingClientRect().top + scrollY };
      tops.set(el, c);
    }
    return c.top;
  };
  const measure = () => { measureV++; tops = new WeakMap(); };
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); schedule(); });

  /* Where a block is in its own entrance. Anchored on the ELEMENT, not the section, so a tall
     section (the demo, the mirror) still animates when its own head arrives. */
  const enter = (el, from = ENTER, to = FULL) => {
    const vh = innerHeight || 800;
    const s = vh * from, e = vh * to;
    return clamp((s - (topOf(el) - scrollY)) / ((s - e) || 1));
  };

  /* ── headline: words arrive one after another, the keywords in emerald ── */
  function words(h2) {
    const parts = [];
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          n.textContent.split(/(\s+)/).forEach(w => {
            if (!w.trim()) { parts.push({ text: w }); return; }
            const bare = w.replace(/[،؛.:؟!«»"']/g, '');
            parts.push({ text: w, gold: GOLD.has(bare) });
          });
        } else if (n.nodeType === 1) {
          /* the <em> accent keeps its emerald colour, but its words still fly in */
          [...n.textContent.split(/(\s+)/)].forEach(w => {
            if (!w.trim()) { parts.push({ text: w }); return; }
            const bare = w.replace(/[،؛.:؟!«»"']/g, '');
            parts.push({ text: w, accent: true, gold: GOLD.has(bare) });
          });
        }
      });
    };
    walk(h2);
    const plain = parts.map(p => p.text).join('');
    h2.setAttribute('aria-label', plain.trim());
    h2.textContent = '';
    const spans = parts.map(p => {
      if (!p.text.trim()) { h2.append(document.createTextNode(p.text)); return null; }
      const s = document.createElement('span');
      s.className = 'cine-word' + (p.accent || p.gold ? ' cine-word--accent' : '');
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p.text;
      h2.append(document.createTextNode(' '));
      h2.append(s);
      return s;
    }).filter(Boolean);
    /* One wave, not a queue. The spread between the first and last word is capped at SPREAD of
       the progress and every word takes RAMPS to land, so the words overlap heavily: the line
       reads as a single gesture. A wider spread leaves the last word hanging in the air after
       the eye has already read the sentence, which looks like a bug, not a design. */
    const SPREAD = .26, RAMPS = .60;
    return p => spans.forEach((s, i) => {
      const start = spans.length > 1 ? (i / (spans.length - 1)) * SPREAD : 0;
      s.style.setProperty('--wp', sub(p, start, start + RAMPS).toFixed(3));
    });
  }

  /* ── the section heads ── */
  const heads = $$('section.section .head, #try-on .tryon__head > div:first-child, #play .play__head > div:first-child, #faq .faq-head');
  heads.forEach(head => {
    const h2 = head.querySelector('h2');
    const kicker = head.querySelector('.eyebrow');
    const say = h2 ? words(h2) : () => {};
    add(head, () => enter(head), p => {
      head.style.setProperty('--hp', p.toFixed(3));
      head.style.setProperty('--sp', sub(p, .22, .86).toFixed(3));
      if (kicker) kicker.style.setProperty('--kp', sub(p, 0, .46).toFixed(3));
      say(sub(p, .10, .92));
    });
  });

  /* the very first screen: the headline is already there, so it only rises, never hides */
  const h1 = $('#h1');
  if (h1) {
    add(h1, () => clamp(1 - scrollY / (innerHeight * .72), 0, 1), p => h1.style.setProperty('--hp', p.toFixed(3)));
  }

  /* ── a list of cards: each one enters on its own beat, left to right in reading order ── */
  function fan(grid, items, stagger = .13) {
    if (!grid || !items.length) return [];
    const targets = [];
    items.forEach((el, i) => el.style.setProperty('--i', i));
    items.forEach((el, i) => {
      /* on a phone a row becomes a stack, so each card is timed on itself instead of on a
         row that is no longer there */
      const narrow = innerWidth <= 760;
      /* On a phone the row is gone, so the card times itself. On a wide screen it rides the
         ROW — but never to a dead 0: a card in the last row of a tall grid can still be below
         the fold while the grid's own top has already passed. The card's own position is the
         floor, so nothing is ever left permanently invisible. */
      const target = () => narrow
        ? enter(el, .92, .52)
        : Math.max(sub(enter(grid, .90, .30), i * stagger, i * stagger + .54), enter(el, .99, .62));
      targets.push(target);
      add(el, target, p => {
        el.style.setProperty('--p', p.toFixed(3));
        el.classList.toggle('cine-done', p > .995);
      });
    });
    return targets;
  }

  /* Let a card arrive first; then its photo and icon get their own, clearly visible beat.
     These are separate scroll tracks (not a one-shot observer), so they reverse cleanly. */
  function cardDetails(cards, progress, selector, property, offset = .10, span = .78) {
    cards.forEach((card, i) => {
      const part = card.querySelector(selector);
      if (!part || !progress[i]) return;
      add(part, () => sub(progress[i](), offset, offset + span),
        p => part.style.setProperty(property, p.toFixed(3)));
    });
  }

  const svcCards = $$('#features .svc');
  const svcProgress = fan($('#features .svc-grid'), svcCards);
  cardDetails(svcCards, svcProgress, '.svc__media', '--vp', .08, .78);
  cardDetails(svcCards, svcProgress, '.svc__icon', '--ip', .22, .60);

  const howCards = $$('#how .step');
  const howProgress = fan($('#how .steps'), howCards);
  cardDetails(howCards, howProgress, '.step__media', '--vp', .08, .78);
  cardDetails(howCards, howProgress, '.step__icon', '--ip', .22, .60);

  const whyCards = $$('#why .why');
  const whyProgress = fan($('#why .why-grid'), whyCards);
  cardDetails(whyCards, whyProgress, '.why__icon', '--ip', .20, .62);

  const planCards = $$('#services .plan');
  const planProgress = fan($('#services .plans'), planCards);
  cardDetails(planCards, planProgress, '.plan__badge', '--ip', .20, .58);
  planCards.forEach((card, i) => [...card.querySelectorAll('li')].forEach((li, j) => {
    add(li, () => sub(planProgress[i](), .16 + j * .045, .16 + j * .045 + .48),
      p => li.style.setProperty('--lp', p.toFixed(3)));
  }));

  /* the FAQ: each row slides from its own side */
  $$('#faq .faq-item').forEach((item, i) => {
    item.style.setProperty('--dir', i % 2 ? -1 : 1);
    add(item, () => enter(item, .94, .54), p => item.style.setProperty('--p', p.toFixed(3)));
  });

  /* the payment explainer list */
  $$('#services .plan-how li').forEach((li, i) => {
    li.style.setProperty('--i', i);
    add(li, () => sub(enter($('#services .plan-how'), .94, .40), i * .12, i * .12 + .5),
      p => li.style.setProperty('--p', p.toFixed(3)));
  });

  /* ── the films: the player lifts out of the page as it arrives ── */
  const filmSection = $('#films');
  if (filmSection) {
    const stage = $('.films__frame', filmSection);
    add(stage, () => enter(filmSection, .95, .40), p => {
      filmSection.style.setProperty('--p', p.toFixed(3));
      stage.style.setProperty('--fp', p.toFixed(3));
    });
    $$('#films .film-tab').forEach((tab, i) => {
      tab.style.setProperty('--i', i);
      add(tab, () => sub(enter($('#films .films__tabs') || filmSection, .95, .48), i * .16, i * .16 + .5),
        p => tab.style.setProperty('--tp', p.toFixed(3)));
    });
  }

  /* ── the two interactive sections ──
     Only the frame and the copy move; the demo's own iframe is never transformed, because a
     transformed ancestor would make its fixed/scroll behaviour jumpy. */
  const tryOn = $('#try-on');
  if (tryOn) {
    add($('#tryonFrame') ? $('#try-on .tryon__frame') : tryOn, () => enter(tryOn, .96, .46), p => {
      tryOn.style.setProperty('--p', p.toFixed(3));
      const f = $('#try-on .tryon__frame'); if (f) f.style.setProperty('--fp', p.toFixed(3));
    });
    $$('#try-on .tryon__line').forEach((b, i) => {
      b.style.setProperty('--i', i);
      add(b, () => sub(enter($('#try-on .tryon__lines'), .96, .56), i * .10, i * .10 + .42),
        p => b.style.setProperty('--p', p.toFixed(3)));
    });
  }
  const play = $('#play');
  if (play) {
    add($('#play .mirror'), () => enter(play, .96, .46), p => {
      play.style.setProperty('--p', p.toFixed(3));
      $('#play .mirror') && $('#play .mirror').style.setProperty('--fp', p.toFixed(3));
    });
    add($('#play .play__side'), () => enter(play, .96, .52), p => $('#play .play__side').style.setProperty('--sp', p.toFixed(3)));
    /* each thumbnail deals in on the section's progress, staggered, so the rail fills left to
       right once the mirror has landed — and empties again on the way back up */
    $$('#play .play-card').forEach((c, i) => {
      c.style.setProperty('--i', Math.min(i, 10));
      add(c, () => sub(enter(play, .97, .50), Math.min(i, 10) * .045, Math.min(i, 10) * .045 + .30),
        p => c.style.setProperty('--mp', p.toFixed(3)));
    });
  }

  /* ── trust, pricing headline and the closing call ── */
  const proof = $('#proof');
  if (proof) {
    const stats = $$('#proof .proof-stat');
    const progress = fan(proof, stats, .10);
    cardDetails(stats, progress, '.proof-stat__icon', '--ip', .18, .58);
  }
  const builderSteps = $$('#salon-example .sb-steps li');
  fan($('#salon-example .sb-steps'), builderSteps, .12);
  const closing = $('#cta');
  if (closing) add(closing, () => enter(closing, .97, .50), p => {
    closing.style.setProperty('--p', p.toFixed(3));
    const image = $('.cta-hero__media img', closing);
    if (image) image.style.setProperty('--vp', p.toFixed(3));
  });

  /* the footer mark draws itself, like the ring in the old page */
  const foot = $('.site-footer');
  if (foot) add(foot, () => enter(foot, .99, .74), p => foot.style.setProperty('--p', p.toFixed(3)));

  /* The card keyframes are scoped to [data-cine] so they can never leak into a component
     that sets its own transform. Mark the sections that use them. */
  ['#features', '#how', '#why', '#services', '#proof', '#salon-example'].forEach(sel => {
    const el = $(sel); if (el) el.dataset.cine = 'on';
  });


  /* ── the loop: one pass per scroll frame, nothing while idle ── */
  function tick() {
    raf = 0;
    for (const t of tracks) {
      const v = Math.round(t.target() * 90) / 90;
      if (v !== t.last) { t.last = v; t.apply(v); }
    }
  }
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', () => { schedule(); }, { passive: true });

  /* Sections far below the fold start hidden; without a first tick they would paint at their
     start state for one frame. Two rAFs is enough for fonts and the first layout to settle. */
  requestAnimationFrame(() => requestAnimationFrame(schedule));

  /* ── what cannot be scrubbed has to be reachable anyway ──
     A link that jumps mid-page lands without a scroll event; so does a hash load. Run the
     pass once after any hash change, and once when the page is restored from the bfcache. */
  addEventListener('hashchange', schedule);
  addEventListener('pageshow', schedule);
})();
