/* Pricing tabs. build.py draws the panels with the page's own tab already selected in the HTML
   (each service page opens its own tab, the home page opens «مدل مو», /salon-panel has the salon
   tab only and no tab row). <div data-plans-panel="hair color nails lashes"> is the one panel of
   single-service cards the four service tabs share: picking a tab moves its buy buttons to that
   service (data-service, and data-title for the checkout line «پلن رنگ مو · ۳ ماهه»), so the
   order always names the service the visitor chose. data-plans-panel="salon" is the salon panel.
   [data-for="single"] is the «دو نفرید؟» bar and comparison, shown on every tab but the salon one.
   [data-open-tab] (the bar's «پلن آرایشگاه» button) jumps to a tab. */
(() => {
  const sec = document.getElementById('services'); if (!sec) return;
  const bar = sec.querySelector('[data-ptabs]');
  const panels = [...sec.querySelectorAll('[data-plans-panel]')];
  const single = [...sec.querySelectorAll('[data-for="single"]')];
  if (!bar || !panels.length) return;
  const keysOf = p => p.dataset.plansPanel.split(/\s+/);
  const tabs = [...bar.querySelectorAll('[data-tab]')].filter(t => panels.some(p => keysOf(p).includes(t.dataset.tab)));
  [...bar.querySelectorAll('[data-tab]')].forEach(t => { if (!tabs.includes(t)) t.hidden = true; });
  const show = key => {
    const tab = tabs.find(t => t.dataset.tab === key);
    panels.forEach(p => {
      p.hidden = !keysOf(p).includes(key);
      if (p.hidden || key === 'salon') return;
      p.setAttribute('aria-labelledby', tab.id);
      p.querySelectorAll('[data-buy]').forEach(b => { b.dataset.service = key; b.dataset.title = tab.textContent.trim(); });
    });
    tabs.forEach(t => { t.setAttribute('aria-selected', String(t.dataset.tab === key)); t.tabIndex = t.dataset.tab === key ? 0 : -1; });
    single.forEach(el => { el.hidden = key === 'salon'; });
  };
  bar.hidden = tabs.length < 2;
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));
  bar.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0 || !/Arrow/.test(e.key)) return;
    const next = tabs[(i + (e.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length];
    e.preventDefault(); next.focus(); show(next.dataset.tab);
  });
  sec.querySelectorAll('[data-open-tab]').forEach(a => a.addEventListener('click', e => {
    const key = a.dataset.openTab; const tab = tabs.find(t => t.dataset.tab === key); if (!tab) return;
    e.preventDefault(); show(key);
    bar.scrollIntoView({behavior: 'smooth', block: 'start'});
    tab.focus({preventScroll: true});
  }));
  const want = sec.dataset.defaultTab;
  const first = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  show(tabs.some(t => t.dataset.tab === want) ? want : first.dataset.tab);
})();

/* Do not advance past an image that has not been decoded. */
(()=>{if(!document.querySelectorAll)return;document.querySelectorAll('.loop').forEach(loop=>{
 const img=loop.querySelector('.loop__f img'),button=loop.querySelector('.loop__toggle');
 if(!img||!button)return;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=motion.matches;
 function render(){loop.classList.toggle('is-paused',paused);loop.classList.toggle('is-playing',motion.matches&&!paused);button.setAttribute('aria-pressed',String(paused));button.textContent=paused?'پخش نمایش':'توقف نمایش'}
 button.addEventListener('click',()=>{paused=!paused;render()});
 motion.addEventListener?.('change',e=>{if(e.matches){paused=true;render()}});
 render();
 const loaded=img.decode?img.decode():new Promise((resolve,reject)=>{if(img.complete)return img.naturalWidth?resolve():reject();img.addEventListener('load',resolve,{once:true});img.addEventListener('error',reject,{once:true})});
 loaded.then(()=>loop.classList.add('is-ready')).catch(()=>{});
})})();
