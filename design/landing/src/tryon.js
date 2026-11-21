/* The demo salon, embedded. The customer journey (photo → phone code → pick the model) is
   the real one from /s/demo; this only decides when to load it and which service it opens on.
   The frame is created on a real click, so nothing is fetched for a visitor who never gets
   here, and no cookie or form field exists on this page before that click. */
(()=>{
  const root = document.getElementById('demo'); if (!root) return;
  const obj = document.getElementById('tryonFrame'), curtain = document.getElementById('tryonCurtain');
  const start = document.getElementById('tryonStart'), stage = document.getElementById('tryonStage');
  const name = document.getElementById('tryonLineName'), hint = document.getElementById('tryonLineHint');
  const tabs = [...root.querySelectorAll('[data-line]')];
  const LINES = {
    hair:   ['مدل مو',   'یه عکس روبه‌رو با صورت کامل، بدون کلاه و عینک آفتابی، توی نور طبیعی.'],
    color:  ['رنگ مو',   'عکسی که موهاتون کامل و واضح توش دیده شه؛ نور زرد لامپ رنگ رو عوض می‌کنه.'],
    nails:  ['ناخن',     'پشت دست، انگشت‌ها کنار هم و همهٔ ناخن‌ها توی قاب، توی نور روز.'],
    lashes: ['مژه',      'از نزدیک و روبه‌رو، هر دو چشم باز و کامل توی قاب، بدون عینک.'],
  };
  const PAIR = { hair: 'style', color: 'color', nails: 'nails', lashes: 'lashes' };
  /* where «این را برای مشتریان خودم می‌خواهم» goes: the plans of the service being tried */
  const PAGE = { hair: '/hair', color: '/color', nails: '/nails', lashes: '/lashes' };
  const buy = [...root.querySelectorAll('.js-svc-link')];
  let line = 'hair', loaded = false, photo = null;

  function select(key) {
    if(loaded && line===key)return;
    line = LINES[key] ? key : 'hair';
    if (name) name.textContent = LINES[line][0];
    if (hint) hint.textContent = LINES[line][1];
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.line === line)));
    /* the mirror shows the sample pair of the chosen service; the buy link follows it */
    if (window.__AYN_PAIR && !loaded) window.__AYN_PAIR(PAIR[line], LINES[line][0]);
    buy.forEach(a => { a.setAttribute('href', document.getElementById('services') ? '#services' : PAGE[line] + '#services'); });
    /* Switching the service after the demo is open reloads it on the other line, so the
       choice made here is never only cosmetic. */
    if(loaded && photo)openPhoto(photo);
  }
  tabs.forEach(t => t.addEventListener('click', () => {
    select(t.dataset.line);
    window.__AYN_SET_TAB?.(t.dataset.line);
  }));

  /* A photo chosen here is carried the same way the rest of the page carries one: into the
     browser's own handoff store, then into the demo as a draft. It is the demo's own input
     file, so the visitor uploads once instead of twice. */
  const input = document.createElement('input');
  input.type = 'file'; input.accept = 'image/jpeg,image/png,image/webp'; input.hidden = true;
  input.setAttribute('aria-label', 'انتخاب عکس خودم');
  root.append(input);

  function ready(q) {
    obj.src = '/s/demo?' + q.toString();
    /* until this moment the frame has no height at all; opening it is what makes the box
       grow to the demo, so the closed state is exactly as tall as its own copy */
    stage.classList.add('is-open');
    loaded = true;
    curtain.classList.add('is-gone');
    const post = document.getElementById('tryonPost');
    if (post) post.hidden = false;
    dispatchEvent(new CustomEvent('ayneh:pay-state'));
    setTimeout(() => { curtain.hidden = true; obj.focus({ preventScroll: true }); }, 420);
  }

  start.addEventListener('click', () => {
    /* The demo asks for the photo itself, and this button opens the picker first so the
       visitor arrives with one; either way the phone step stays exactly where it was. */
    window.__AYN_TRACK?.('cta_click', { label: 'شروع دمو با عکس', href: '/s/demo', where: 'try-on' });
    input.value = ''; input.click();
  });

  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 25 * 1024 * 1024) {
      alert('یک تصویر JPG، PNG یا WebP با حجم کمتر از ۲۵ مگابایت انتخاب کنید.'); return;
    }
    photo=file;
    await openPhoto(file);
  });
  async function openPhoto(file) {
    const selectedLine=line;
    const selection = { ...(window.__AYN_SEL || {}) };
    try { await window.__AYN_DRAFT.put({ file, line:selectedLine, selection }); }
    catch (_) { alert('باز کردن عکس ممکن نشد. دوباره انتخاب کنید.'); return; }
    if(selectedLine!==line||photo!==file)return;
    const q = new URLSearchParams({ l: selectedLine, draft: '1', embed: '1' });
    ready(q);
  }

  /* The demo reports how tall its screen really is. The frame follows, between a floor and a
     ceiling, so the visitor never has to scroll inside a scroll — and a short step (the
     upload) does not leave a screen of empty white below it. */
  const MIN = 420, MAX = 4000; /* no inner scroll: a scroll inside a scroll traps the thumb on phones */
  addEventListener('message', e => {
    if (e.source !== obj.contentWindow || e.origin !== location.origin || !e.data || typeof e.data.aynehDemoHeight !== 'number') return;
    const h = Math.max(MIN, Math.min(MAX, Math.round(e.data.aynehDemoHeight)));
    obj.style.height = h + 'px';
  });

  /* ── photo → phone code → model, the same order as before ──
     This section is a window onto the real demo, not a copy of it: the file goes into the
     browser-local handoff, the demo reads it on load, and the code is the one the demo's own
     screen sends. Nothing here can skip the phone step, because the step is in the demo. */

  /* If the demo cannot be framed (blocked, offline), say so and offer the full page instead
     of leaving an empty grey box. */
  obj.addEventListener('error', () => {
    stage.classList.add('is-broken');
    if (curtain.hidden) curtain.hidden = false;
    curtain.querySelector('strong').textContent = 'باز کردن نمونه ممکن نشد';
    curtain.querySelector('p').textContent = 'اتصال اینترنت رو بررسی کنید و دوباره امتحان کنید.';
    start.textContent = 'باز کردن نمونه';
    start.onclick = () => location.assign('/s/demo?l=' + line + '&from=landing');
  });

  /* /try?l=nails opens on that service; a service page opens on its own */
  const want = new URLSearchParams(location.search).get('l');
  select(LINES[want] ? want : (tabs[0] ? tabs[0].dataset.line : 'hair'));
})();
