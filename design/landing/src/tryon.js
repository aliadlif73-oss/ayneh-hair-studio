/* The demo salon, embedded. The customer journey (photo → phone code → pick the model) is
   the real one from /s/demo; this only decides when to load it and which service it opens on.
   The frame is created on a real click, so nothing is fetched for a visitor who never gets
   here, and no cookie or form field exists on this page before that click. */
(()=>{
  const root = document.getElementById('try-on'); if (!root) return;
  const obj = document.getElementById('tryonFrame'), curtain = document.getElementById('tryonCurtain');
  const start = document.getElementById('tryonStart'), stage = document.getElementById('tryonStage');
  const name = document.getElementById('tryonLineName'), hint = document.getElementById('tryonLineHint');
  const tabs = [...root.querySelectorAll('[data-line]')];
  const LINES = {
    hair:   ['مدل مو',   'یک عکس روبه‌رو با صورت کامل، بدون کلاه و عینک آفتابی، در نور طبیعی.'],
    color:  ['رنگ مو',   'عکسی که موهایتان کامل و واضح در آن دیده شود؛ نور زرد لامپ رنگ را عوض می‌کند.'],
    nails:  ['ناخن',     'پشت دست، انگشت‌ها کنار هم و همهٔ ناخن‌ها در قاب، در نور روز.'],
    lashes: ['مژه',      'از نزدیک و روبه‌رو، هر دو چشم باز و کامل در قاب، بدون عینک.'],
  };
  let line = 'hair', loaded = false, photo = null;

  function select(key) {
    if(loaded && line===key)return;
    line = LINES[key] ? key : 'hair';
    name.textContent = LINES[line][0];
    hint.textContent = LINES[line][1];
    tabs.forEach(t => t.setAttribute('aria-pressed', String(t.dataset.line === line)));
    /* Switching the service after the demo is open reloads it on the other line, so the
       choice made here is never only cosmetic. */
    if(loaded && photo)openPhoto(photo);
  }
  tabs.forEach(t => t.addEventListener('click', () => select(t.dataset.line)));

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
    if (selectedLine === 'hair') { q.set('s', selection.styleIdx ?? 0); if (selection.color) q.set('c', selection.color); }
    ready(q);
  }

  /* The demo reports how tall its screen really is. The frame follows, between a floor and a
     ceiling, so the visitor never has to scroll inside a scroll — and a short step (the
     upload) does not leave a screen of empty white below it. */
  const MIN = 420, MAX = 1240;
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
    curtain.querySelector('strong').textContent = 'باز کردن دموی نمونه ممکن نشد';
    curtain.querySelector('p').textContent = 'اتصال را بررسی کنید، یا دموی نمونه را در همین مرورگر باز کنید.';
    start.textContent = 'باز کردن دموی نمونه';
    start.onclick = () => location.assign('/s/demo?l=' + line + '&from=landing');
  });

  select('hair');
})();
