/* /hair: the two ways to try a look are one block with two tabs, so the visitor never wonders
   why there are two similar sections. «روی چهرهٔ نمونه» (the mirror, no photo) is open first;
   «روی عکس خودتان» is the real try-on with mobile verification. Any link to #try-on (the hero
   button, the mirror's «حالا روی عکس خودتان») opens the second tab. Without this script both
   sections simply stay visible, one after the other. */
(() => {
  const bar = document.getElementById('trySwitch');
  const play = document.getElementById('play'), tryon = document.getElementById('try-on');
  if (!bar || !play || !tryon) return;
  const tabs = [...bar.querySelectorAll('[data-try]')];
  const show = (which, scroll) => {
    play.hidden = which !== 'play';
    tryon.hidden = which !== 'try-on';
    tabs.forEach(t => t.setAttribute('aria-selected', String(t.dataset.try === which)));
    dispatchEvent(new Event('resize'));
    if (scroll) bar.scrollIntoView({behavior: 'smooth', block: 'start'});
  };
  bar.hidden = false;
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.try, false)));
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href="#try-on"],a[href="#play"]');
    if (!a) return;
    e.preventDefault();
    show(a.getAttribute('href').slice(1), true);
  });
  show(location.hash === '#try-on' ? 'try-on' : 'play', location.hash === '#try-on');
})();
