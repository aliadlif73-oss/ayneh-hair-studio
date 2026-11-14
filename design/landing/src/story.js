/* The storybook behind the page. Six illustrated chapters, one salon day from dawn to dusk,
   sit in a fixed layer under the content; every pair of sections is one chapter. When the
   reader scrolls into the next chapter the current page turns over like a book page, and
   scrolling back turns it the other way. The art lives only in the side margins (the middle
   of every illustration is blank paper), so it never sits under the text.
   Decorative only: aria-hidden, no focusable content, nothing here is needed to use the page. */
(()=>{
  const CHAPTERS = [
    {ids:['intro','features'],          name:'سپیده‌دمِ سالن'},
    {ids:['films','try-on'],             name:'انتخاب در خانه'},
    {ids:['play','how'],                 name:'روبه‌روی آینه'},
    {ids:['why','proof'],                name:'روزِ پرکار سالن'},
    {ids:['services','cta'],             name:'دفترِ صاحب سالن'},
    {ids:['faq','salon-example'],        name:'پایان روز، آغاز صفحهٔ شما'},
  ];
  const sections = CHAPTERS.map(c => c.ids.map(id => document.getElementById(id)).filter(Boolean));
  if (!sections.some(s => s.length)) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const base = (window.__AYN_BASE || 'assets/');
  const fa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  const layer = document.createElement('div');
  layer.className = 'story'; layer.setAttribute('aria-hidden', 'true');
  const pages = CHAPTERS.map((c, i) => {
    const p = document.createElement('div');
    p.className = 'story__page'; p.dataset.chapter = String(i + 1);
    ['l', 'r'].forEach(side => {
      const img = document.createElement('img');
      img.className = 'story__art story__art--' + side;
      img.alt = ''; img.decoding = 'async'; img.width = 429; img.height = 780;
      img.dataset.src = base + 'story-' + (i + 1) + side + '.webp';
      p.append(img);
    });
    layer.append(p); return p;
  });
  const folio = document.createElement('div');
  folio.className = 'story__folio';
  folio.innerHTML = '<span class="story__num"></span><span class="story__name"></span>';
  layer.append(folio);
  document.body.prepend(layer);

  /* Only the chapter on screen and its neighbours are fetched. */
  const load = i => { const p = pages[i]; if (!p) return; p.querySelectorAll('img[data-src]').forEach(img => { img.src = img.dataset.src; img.removeAttribute('data-src'); }); };

  let current = -1, turning = null;
  function show(i){
    if (i === current) return;
    load(i); load(i + 1); load(i - 1);
    const prev = pages[current], next = pages[i], forward = i > current;
    folio.querySelector('.story__num').textContent = 'فصل ' + fa(i + 1) + ' از ' + fa(CHAPTERS.length);
    folio.querySelector('.story__name').textContent = CHAPTERS[i].name;
    layer.dataset.chapter = String(i + 1);
    pages.forEach(p => p.classList.remove('is-under'));
    next.classList.add('is-on');
    if (!prev || reduced) { pages.forEach(p => p !== next && p.classList.remove('is-on', 'is-turning', 'is-back')); current = i; return; }
    /* The page we are leaving lifts and turns away over the spine; the new chapter is
       already lying underneath it. */
    if (turning) { turning.classList.remove('is-on', 'is-turning', 'is-back'); }
    next.classList.add('is-under');
    prev.classList.remove('is-turning', 'is-back');
    void prev.offsetWidth;
    prev.classList.add('is-turning'); if (!forward) prev.classList.add('is-back');
    turning = prev;
    const done = () => { prev.classList.remove('is-on', 'is-turning', 'is-back'); next.classList.remove('is-under'); if (turning === prev) turning = null; };
    prev.addEventListener('animationend', done, {once: true});
    setTimeout(done, 1200);
    current = i;
  }

  /* The chapter is the one whose sections hold the middle of the viewport. Section tops are
     measured once (and again when the layout changes), so scrolling reads no layout. */
  let tops = [], tick = false;
  const remember = () => { tops = sections.map(list => list.length ? list[0].getBoundingClientRect().top + scrollY : Infinity); };
  function measure(){
    tick = false;
    const mid = scrollY + innerHeight * .5;
    let pick = 0;
    tops.forEach((t, i) => { if (t <= mid) pick = i; });
    show(pick);
  }
  const relayout = () => { remember(); measure(); };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(measure); } }, {passive: true});
  addEventListener('resize', relayout, {passive: true});
  addEventListener('load', relayout);
  if (window.ResizeObserver) new ResizeObserver(relayout).observe(document.body);
  relayout();
})();
