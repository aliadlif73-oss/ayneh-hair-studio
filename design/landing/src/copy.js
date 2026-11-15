/* Pricing tabs. The price cards are drawn by build.py; when they come wrapped as
   <div data-plans-panel="hair|color|nails|lashes|salon"> this turns the tab row on and shows one
   panel at a time (the page's own service first). Without panels the row stays hidden and the
   cards show as they are. [data-for="single"] is the «دو نفرید؟» bar and comparison, shown on
   every tab but the salon one; [data-for="salon"] is the extra-user line, salon tab only. */
(() => {
  const sec = document.getElementById('services'); if (!sec) return;
  const bar = sec.querySelector('[data-ptabs]');
  const panels = [...sec.querySelectorAll('[data-plans-panel]')];
  const single = [...sec.querySelectorAll('[data-for="single"]')];
  const extra = [...sec.querySelectorAll('[data-for="salon"]')];
  if (!bar || !panels.length) return;
  const tabs = [...bar.querySelectorAll('[data-tab]')].filter(t => panels.some(p => p.dataset.plansPanel === t.dataset.tab));
  [...bar.querySelectorAll('[data-tab]')].forEach(t => { if (!tabs.includes(t)) t.hidden = true; });
  const show = key => {
    panels.forEach(p => { p.hidden = p.dataset.plansPanel !== key; });
    tabs.forEach(t => { t.setAttribute('aria-selected', String(t.dataset.tab === key)); t.tabIndex = t.dataset.tab === key ? 0 : -1; });
    single.forEach(el => { el.hidden = key === 'salon'; });
    extra.forEach(el => el.classList.toggle('is-on', key === 'salon'));
  };
  bar.hidden = false;
  tabs.forEach(t => t.addEventListener('click', () => show(t.dataset.tab)));
  bar.addEventListener('keydown', e => {
    const i = tabs.indexOf(document.activeElement); if (i < 0 || !/Arrow/.test(e.key)) return;
    const next = tabs[(i + (e.key === 'ArrowLeft' ? 1 : -1) + tabs.length) % tabs.length];
    e.preventDefault(); next.focus(); show(next.dataset.tab);
  });
  const want = sec.dataset.defaultTab;
  show(tabs.some(t => t.dataset.tab === want) ? want : tabs[0].dataset.tab);
})();
