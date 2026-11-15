/* The original interactive mirror studio, brought back inside the current page system.
   One live photo node and a hair-only canvas carry the experience; style renders are composed
   onto the same face, and the mirror, colour rail, and model dock remain one responsive unit. */
(()=>{
  const root = document.getElementById('play'); if (!root) return;
  const $ = id => document.getElementById(id);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SRC = (k, e) => 'assets/' + k + '.' + (e || 'webp');
  const fa = n => new Intl.NumberFormat('fa-IR').format(n);
  const STYLES = ['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
  /* The same colour table as the live studio. «ombre» is what makes آمبره a gradient (dark
     roots into light ends) in hair-color.js; without it the swatch paints one flat colour. */
  const COLORS = [
    {name:'بلوند شامپاینی', rgb:[190,166,120], h:43,  s:.36, l:.7,  css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
    {name:'کاراملی',        rgb:[139,94,57],   h:28,  s:.62, l:.46, css:'linear-gradient(145deg,#C98745,#8A5424)'},
    {name:'اسپرسو',         rgb:[49,36,29],    h:22,  s:.42, l:.17, css:'linear-gradient(145deg,#4F3322,#1C110A)'},
    {name:'آمبره',          rgb:[180,146,99],  h:30,  s:.5,  l:.4,  ombre:true, css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
    {name:'مسی',            rgb:[150,79,47],   h:16,  s:.72, l:.43, css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
    {name:'بلوند پلاتینی',  rgb:[211,201,181], h:50,  s:.2,  l:.86, css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
    {name:'شرابی',          rgb:[91,39,53],    h:343, s:.55, l:.27, css:'linear-gradient(145deg,#8E3050,#481327)'},
  ];
  /* look-sNN exists for NN 02..19; style 1 (index 0) is the untouched photo. */
  const READY = new Set([1, ...Array.from({length:18}, (_, i) => i + 2)]);
  const st = {style:null, color:null, look:'base'};
  const screen = $('playScreen'), plate = $('playPlate');

  const ring = '<svg class="play-ring" viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22"/></svg>';
  const n2 = i => String(i + 1).padStart(2,'0');

  /* ---------- the two pickers ---------- */
  function make(cls, html, onPick, box){
    const b = document.createElement('button');
    b.type = 'button'; b.className = cls; b.setAttribute('role','radio');
    b.setAttribute('aria-checked','false'); b.tabIndex = box.children.length ? -1 : 0;
    b.innerHTML = html; b.insertAdjacentHTML('beforeend', ring);
    b.addEventListener('click', onPick);
    box.append(b); return b;
  }
  const cards = STYLES.map((nm, i) => make('play-card',
    '<span class="play-card__ph"><img src="' + SRC('s' + n2(i)) + '" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="play-card__nm">' + nm + '</span>',
    () => pickStyle(i), $('playStyles')));
  cards.forEach((b, i) => {
    const note = document.createElement('small'); note.className = 'play-card__kind';
    note.textContent = READY.has(i + 1) ? 'روی آینه' : 'عکس مرجع'; b.append(note);
  });
  const sws = COLORS.map((c, i) => make('play-sw',
    '<span class="play-sw__dot" aria-hidden="true"><i style="background:' + c.css + '"></i></span><span class="play-sw__nm">' + c.name + '</span>',
    () => pickColor(i), $('playSwatches')));
  $('playCount').textContent = '· ' + fa(STYLES.length) + ' مدل';

  const mark = (list, idx) => list.forEach((b, i) => {
    b.setAttribute('aria-checked', String(i === idx));
    b.tabIndex = i === Math.max(0, idx) ? 0 : -1;
  });

  /* Frame the vanity, not the room. The stage holds only the photo (the dock and the selection
     sit under it), so the three mirrors and the top of the podium fill it. A narrow phone stage
     frames the central mirror and lets the side reflections run off the edges, as the live
     studio does, so the face stays large. The renders are 2x, so even the 1.3x stage
     draws from real pixels. */
  const WIDE = {x:440,y:118,w:496,h:440}, NARROW = {x:556,y:122,w:264,h:398}, PAD = 1.04, MAX = 1.3;

  function layout(){
    const W=screen.clientWidth,H=screen.clientHeight;if(!W||!H)return;
    const box=W<560?NARROW:WIDE;
    const cover=Math.max(W/1376,H/768);
    const fit=Math.min(W/(box.w*PAD),H/(box.h*PAD));
    const s=Math.max(cover,Math.min(MAX,fit));
    const pw=1376*s,ph=768*s;
    const cx=(box.x+box.w/2)*s,cy=(box.y+box.h/2)*s;
    const x=Math.round(Math.min(0,Math.max(W-pw,W/2-cx)));
    const y=Math.round(Math.min(0,Math.max(H-ph,H/2-cy)));
    Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:x+'px',top:y+'px'});
  }
  if (window.ResizeObserver) new ResizeObserver(layout).observe(screen);
  addEventListener('resize', layout, {passive: true});

  /* ---------- horizontal scroller: wheel, drag, arrows ---------- */
  const track = $('playStyles'), prev = $('playPrev'), next = $('playNext');
  const rtl = el => getComputedStyle(el).direction === 'rtl';
  const room = el => { const max = el.scrollWidth - el.clientWidth, pos = rtl(el) ? -el.scrollLeft : el.scrollLeft; return {back: pos > 2, fwd: pos < max - 2}; };
  const sync = () => { const r = room(track); prev.disabled = !r.back; next.disabled = !r.fwd; };
  const scrollFwd = d => track.scrollBy({left: rtl(track) ? -d : d, behavior: reduced ? 'auto' : 'smooth'});
  prev.addEventListener('click', () => scrollFwd(-track.clientWidth * .7));
  next.addEventListener('click', () => scrollFwd(track.clientWidth * .7));
  track.addEventListener('scroll', sync, {passive: true});
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    const r = room(track); if ((e.deltaY > 0 && !r.fwd) || (e.deltaY < 0 && !r.back)) return;
    e.preventDefault(); track.scrollLeft += (rtl(track) ? -1 : 1) * e.deltaY;
  }, {passive: false});
  let drag = null;
  track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse' || e.button !== 0) return; drag = {x: e.clientX, s: track.scrollLeft}; track.classList.add('dragging'); });
  addEventListener('pointermove', e => { if (drag) track.scrollLeft = drag.s - (e.clientX - drag.x); });
  addEventListener('pointerup', () => { track.classList.remove('dragging'); drag = null; });

  /* arrow keys move between options inside each radio group */
  [[cards, track], [sws, $('playSwatches')]].forEach(([list, box]) => box.addEventListener('keydown', e => {
    const i = list.indexOf(document.activeElement); if (i < 0) return;
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowLeft' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowRight' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const n = list[(i + dir + list.length) % list.length];
    n.focus({preventScroll: true}); n.click(); n.scrollIntoView({inline: 'center', block: 'nearest'});
  }));

  /* ---------- the hair recolour engine ---------- */
  const img = $('playRoom'), cv = $('playCanvas'), ctx = cv.getContext('2d');
  let px = null, lookTok = 0;
  const preps = {};
  const cache = new Map();
  const loadImg = src => {
    if (!cache.has(src)) cache.set(src, new Promise((res, rej) => {
      const i = new Image(); i.onload = () => res(i);
      i.onerror = () => { cache.delete(src); rej(new Error('image')); }; i.src = src;
    }));
    return cache.get(src);
  };
  /* The renders ship at twice the design size (2752x1536, upscaled offline from the 1376x768
     originals: hero-hd.webp, look-sNN-hd.webp), so the face stays sharp on phones and on a
     zoomed stage. Every coordinate below is in DESIGN pixels (1376x768); K maps them to the
     render. The hair masks stay at design size and are scaled up smoothly when drawn. */
  const K = 2, DW = 1376, DH = 768, W = DW * K, H = DH * K;
  const lookAssets = key => key === 'base' ? ['hero-hd','hair-mask'] : ['look-' + key + '-hd', 'mask-' + key];
  const canvas2d = () => {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d', {willReadFrequently: true});
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    return [c, g];
  };
  const poly = (g, list) => list.forEach(pts => { g.beginPath(); pts.forEach(([x,y],i) => i ? g.lineTo(x,y) : g.moveTo(x,y)); g.closePath(); g.fill(); });
  let canonicalSrc = null;
  function canonical(){
    if (canonicalSrc) return canonicalSrc;
    canonicalSrc = Promise.all([loadImg(SRC('hero-hd')), loadImg(SRC('hair-mask','png'))]).then(([photo, mask]) => {
      const [, g] = canvas2d();
      g.drawImage(photo, 0, 0, W, H); const original = g.getImageData(0,0,W,H).data;
      g.clearRect(0,0,W,H); g.drawImage(mask, 0, 0, W, H);
      g.setTransform(K,0,0,K,0,0); g.fillStyle = '#fff';
      poly(g, [[[622,334],[653,334],[666,419],[651,441],[620,433],[618,389]],[[712,331],[748,331],[762,430],[729,441],[710,412],[705,368]],[[520,333],[582,333],[582,451],[515,450]],[[785,333],[863,333],[863,452],[785,452]]]);
      g.fillRect(610,240,148,106); g.fillRect(508,255,76,91); g.fillRect(786,255,75,91);
      g.fillRect(606,346,154,125); g.fillRect(508,346,76,108); g.fillRect(786,346,75,108);
      g.setTransform(1,0,0,1,0,0);
      const oldHair = g.getImageData(0,0,W,H).data;
      g.clearRect(0,0,W,H); g.setTransform(K,0,0,K,0,0); g.fillStyle = '#fff';
      poly(g, [[[660,298],[668,293],[699,293],[711,301],[711,325],[700,343],[682,350],[664,339],[654,323],[654,307]],[[522,291],[537,288],[547,301],[547,319],[549,333],[541,347],[526,347],[517,335],[513,323],[520,312]],[[825,288],[840,291],[843,308],[850,321],[846,335],[837,347],[823,347],[815,335],[816,315],[817,300]]]);
      g.setTransform(1,0,0,1,0,0);
      const identity = g.getImageData(0,0,W,H).data;
      g.clearRect(0,0,W,H); g.setTransform(K,0,0,K,0,0);
      poly(g, [[[676,267],[693,268],[704,280],[711,295],[713,314],[707,333],[697,344],[682,350],[665,339],[655,322],[653,302],[658,282]],[[523,280],[539,283],[548,300],[550,324],[542,347],[525,349],[513,328],[519,308]],[[828,280],[842,284],[844,307],[852,324],[840,348],[824,350],[814,332],[816,304]]]);
      g.setTransform(1,0,0,1,0,0);
      const face = g.getImageData(0,0,W,H).data;
      return {original, oldHair, identity, face};
    }).catch(e => { canonicalSrc = null; throw e; });
    return canonicalSrc;
  }
  /* A composed look is handed to the <img> as a lossless PNG blob: no second lossy encode on
     top of the render's own. */
  const toURL = c => new Promise(res => c.toBlob(b => res(b ? URL.createObjectURL(b) : c.toDataURL('image/png')), 'image/png'));
  function prepare(key){
    if (preps[key]) return preps[key];
    const [im, mk] = lookAssets(key);
    return preps[key] = Promise.all([loadImg(SRC(im)), loadImg(SRC(mk,'png')), canonical()]).then(async ([a, m, person]) => {
      const [c, g] = canvas2d();
      g.drawImage(m, 0, 0, W, H); let full = g.getImageData(0,0,W,H).data;
      g.clearRect(0,0,W,H); g.drawImage(a, 0, 0, W, H); const scene = g.getImageData(0,0,W,H);
      const composed = window.__AYN_PORTRAIT.compose(person.original, scene.data, person.oldHair, full, person.identity, person.face);
      scene.data.set(composed.scene); full = composed.mask;
      g.putImageData(scene, 0, 0);
      const thumbCanvas = document.createElement('canvas'); thumbCanvas.width = 240; thumbCanvas.height = 300;
      const tg = thumbCanvas.getContext('2d'); tg.imageSmoothingQuality = 'high';
      tg.drawImage(c, 605*K, 235*K, 160*K, 235*K, 0, 0, 240, 300);
      const index = key === 'base' ? 0 : Number(key.slice(1)) - 1;
      if (cards[index]) cards[index].querySelector('img').src = thumbCanvas.toDataURL('image/webp', .9);
      let x0 = W, y0 = H, x1 = 0, y1 = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (full[(y*W+x)*4] > 6){ if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 < x0) throw new Error('empty mask');
      const R = {x:x0, y:y0, w:x1-x0+1, h:y1-y0+1}, base = g.getImageData(R.x,R.y,R.w,R.h).data;
      const mkd = new Uint8ClampedArray(R.w * R.h * 4);
      for (let y = 0; y < R.h; y++) mkd.set(full.subarray(((R.y+y)*W+R.x)*4, ((R.y+y)*W+R.x+R.w)*4), y*R.w*4);
      const idx = []; for (let i = 0; i < R.w * R.h; i++) if (mkd[i*4] > 6) idx.push(i);
      const ch = [[],[],[]];
      for (const i of idx){ const p = i*4, Y = (base[p]+base[p+1]+base[p+2]) / 765; if (mkd[p] > 180 && Y > .15 && Y < .65) for (let k = 0; k < 3; k++) ch[k].push(base[p+k]); }
      const anchor = ch.map((v,i) => v.length ? v.sort((a,b) => a-b)[v.length >> 1] : [143,95,60][i]);
      const src = key === 'base' ? a.src : await toURL(c);
      return {src, R, base, mk: mkd, idx, anchor, out: ctx.createImageData(R.w, R.h)};
    }).catch(() => { delete preps[key]; return null; });
  }
  const cl = (v,a,b) => v < a ? a : v > b ? b : v;
  const tint = (c, Y, yn, source, anchor) => window.__AYN_HAIR_COLOR.tint(c, Y, yn, source, anchor);

  /* One pass per change: the hair is recoloured once and the canvas fades in, so a change is
     smooth without re-tinting every hair pixel on every animation frame. */
  function draw(to){
    if (!px) return;
    const {R, base, mk, idx, out} = px, o = out.data;
    if (!to){ ctx.clearRect(0,0,W,H); return; }
    o.fill(0);
    const src = [0,0,0];
    for (let k = 0; k < idx.length; k++){
      const i = idx[k], p = i*4, yn = ((i/R.w)|0) / R.h;
      src[0] = base[p]; src[1] = base[p+1]; src[2] = base[p+2];
      const Y = (.2126*src[0] + .7152*src[1] + .0722*src[2]) / 255;
      const B = tint(to, Y, yn, src, px.anchor);
      o[p] = B[0]; o[p+1] = B[1]; o[p+2] = B[2]; o[p+3] = mk[p];
    }
    ctx.clearRect(0,0,W,H); ctx.putImageData(out, R.x, R.y);
  }
  function paint(next){
    draw(next);
    if (next && !reduced) cv.animate([{opacity:.55},{opacity:1}], {duration:240, easing:'ease-out'});
  }

  const choice = $('playChoice'), choiceThumb = $('playChoiceThumb');
  function summary(){
    const parts = [];
    if (st.style != null) parts.push(STYLES[st.style]);
    if (st.color != null) parts.push(COLORS[st.color].name);
    choice.textContent = parts.length ? parts.join(' · ') : 'هنوز چیزی انتخاب نشده';
    if (parts.length) {
      const i = st.style ?? 0, thumb = cards[i]?.querySelector('img');
      if (thumb) { choiceThumb.src = thumb.currentSrc || thumb.src; choiceThumb.alt = 'پیش‌نمایش ' + STYLES[i]; }
    }
    root.classList.toggle('has-choice', parts.length > 0);
  }
  $('playReplay').addEventListener('click', () => {
    if (reduced) return;
    screen.classList.remove('is-replaying');
    void screen.offsetWidth;
    screen.classList.add('is-replaying');
    setTimeout(() => screen.classList.remove('is-replaying'), 1150);
    $('playReplay').animate([{transform:'translateY(0)'},{transform:'translateY(-2px)'},{transform:'translateY(0)'}],{duration:260,easing:'ease-out'});
  });
  async function pickColor(i){
    const next = COLORS[i];
    st.color = i; mark(sws, i); summary();
    if (!px){ const p = await prepare(st.look); if (!p) return; px = p; }
    paint(next);
  }
  async function pickStyle(i){
    st.style = i; mark(cards, i); mark(sws, st.color);
    cards[i].scrollIntoView({inline: 'center', block: 'nearest', behavior: reduced ? 'auto' : 'smooth'});
    if (READY.has(i + 1)){
      const my = ++lookTok;
      const p = await prepare(i === 0 ? 'base' : 's' + n2(i));
      if (my !== lookTok || !p) return;
      const changed = st.look !== (i === 0 ? 'base' : 's' + n2(i));
      img.src = p.src; px = p; st.look = i === 0 ? 'base' : 's' + n2(i);
      if (changed && !reduced) img.animate([{filter:'brightness(1.06)'},{filter:'brightness(1)'}], {duration:600, easing:'ease-out'});
      draw(st.color != null ? COLORS[st.color] : null);
    }
    summary();
  }

  /* load the base render only when the section is anywhere near the viewport */
  let started = false;
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting || started) return;
    started = true; layout();
    prepare('base').then(p => {
      if (!p) return;
      img.src = p.src; px = p;
    });
  }, {rootMargin: '300px'}).observe(root);
  layout(); sync();
})();
