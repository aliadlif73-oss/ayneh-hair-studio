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
    const act = document.getElementById('ptabsActive');
    if (act) {
      act.hidden = key === 'salon';
      if (key !== 'salon' && tab) {
        const b = act.querySelector && act.querySelector('b'); if (b) b.textContent = tab.textContent.trim();
        if (act.classList) { act.classList.remove('is-pop'); void act.offsetWidth; act.classList.add('is-pop'); }
      }
    }
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
  if (typeof window !== 'undefined') window.__AYN_SET_TAB = key => { if (tabs.some(t => t.dataset.tab === key)) show(key); };
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

/* Hero stop-motion showcase: sync service pills & progress, allow direct jump, honour reduced motion. */
(()=>{if(!document.querySelector)return;
 const s=document.querySelector('.hero-stage--video');if(!s)return;
 const v=s.querySelector('.hero-video'),b=s.querySelector('.hero-video__toggle'),f=s.querySelector('.hero-stage__fill'),c=[...s.querySelectorAll('.hero-stage__chip[data-seek]')];
 if(!v)return;
 const m=matchMedia('(prefers-reduced-motion: reduce)');
 let p=m.matches;
 const st=()=>{if(b){b.setAttribute('aria-pressed',String(v.paused));b.textContent=v.paused?'پخش نمایش':'توقف نمایش'}};
 const sp=()=>{
  const t=v.currentTime||0,d=v.duration||18.44;
  if(f)f.style.width=Math.min(100,Math.max(0,t/d*100)).toFixed(2)+'%';
  c.forEach(k=>{const on=t>=+k.dataset.seek&&t<+k.dataset.end;k.classList.toggle('is-active',on);k.setAttribute('aria-selected',String(on))});
 };
 if(b)b.addEventListener('click',()=>{if(v.paused){p=false;v.play().catch(()=>{})}else{p=true;v.pause()}st()});
 c.forEach(k=>k.addEventListener('click',()=>{try{v.currentTime=+k.dataset.seek||0}catch{}if(v.paused){p=false;v.play().catch(()=>{})}sp();st()}));
 ['timeupdate','seeked'].forEach(e=>v.addEventListener(e,sp));
 ['play','pause'].forEach(e=>v.addEventListener(e,st));
 v.addEventListener('loadedmetadata',()=>{if(m.matches&&p)v.pause();sp();st()});
 if(m.matches){v.autoplay=false;v.pause()}else v.play().catch(()=>{});
 m.addEventListener?.('change',e=>{if(e.matches){p=true;v.pause();st()}});
 st();
})();

/* Post-loader hero choreography: type headline center-stage (joined Persian glyphs), hold 1s, lift #h1 up, type lead, reveal perks one-by-one. */
(()=>{
if(!document.querySelector||typeof matchMedia!=='function'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const hero=document.getElementById('intro'),box=hero&&hero.querySelector('.hero-copy');if(!box)return;
const h1=box.querySelector('#h1'),lead=box.querySelector('.hero-lead');if(!h1||!lead)return;
const acc=h1.querySelector('.h1__accent'),perks=[...box.querySelectorAll('.hero-perk')],acts=box.querySelector('.hero-actions');
const accTxt=acc?acc.textContent:'',mainTxt=acc?h1.textContent.slice(0,h1.textContent.length-accTxt.length):h1.textContent,leadTxt=lead.textContent.trim();
if(!mainTxt.trim())return;
h1.setAttribute('aria-label',(mainTxt+' '+accTxt).trim());lead.setAttribute('aria-label',leadTxt);
const h1H=h1.getBoundingClientRect().height,leadH=lead.getBoundingClientRect().height;
if(h1H>20)h1.style.minHeight=Math.ceil(h1H)+'px';if(leadH>16)lead.style.minHeight=Math.ceil(leadH)+'px';
const caret=document.createElement('span');caret.className='ayn-caret';caret.setAttribute('aria-hidden','true');
const mainNode=document.createTextNode(''),accNode=document.createTextNode(''),leadNode=document.createTextNode('');
h1.textContent='';h1.append(mainNode,caret);if(acc){acc.textContent='';acc.append(accNode);h1.append(acc)}lead.textContent='';lead.append(leadNode);
hero.classList.add('is-choreo','is-stage');box.classList.add('is-choreo','is-stage');
let off=false,go=false;const tm=[],w=ms=>new Promise(r=>{tm.push(setTimeout(r,ms))});
const fin=()=>{if(off)return;off=true;tm.forEach(clearTimeout);caret.remove();mainNode.textContent=mainTxt;if(acc)accNode.textContent=accTxt;leadNode.textContent=leadTxt;hero.classList.remove('is-stage','is-choreo');hero.classList.add('is-vis');box.classList.remove('is-stage','is-choreo');lead.classList.add('is-in');perks.forEach(p=>p.classList.add('is-in'));if(acts)acts.classList.add('is-in');h1.style.minHeight='';lead.style.minHeight=''};
const typ=async(node,s,sp)=>{const a=[...s];for(let i=0;i<a.length;i++){if(off)return;node.textContent=a.slice(0,i+1).join('');await w(a[i]===' '?Math.round(sp*.5):sp)}};
const onS=()=>{if(scrollY>260){fin();removeEventListener('scroll',onS)}};
const run=async()=>{if(go||off)return;go=true;if(scrollY>260){fin();return}setTimeout(()=>{if(!off)addEventListener('scroll',onS,{passive:true})},350);await w(120);await typ(mainNode,mainTxt,36);if(acc&&accTxt&&!off){await w(180);acc.append(caret);await typ(accNode,accTxt,34)}if(off)return;await w(1000);if(off)return;hero.classList.remove('is-stage');box.classList.remove('is-stage');setTimeout(()=>{if(!off)hero.classList.add('is-vis')},180);await w(680);if(off)return;lead.classList.add('is-in');lead.append(caret);await typ(leadNode,leadTxt,22);if(off)return;caret.remove();await w(180);for(const p of perks){if(off)return;p.classList.add('is-in');await w(340)}if(off)return;await w(120);if(acts)acts.classList.add('is-in');await w(600);if(!off){hero.classList.remove('is-choreo');box.classList.remove('is-choreo');h1.style.minHeight='';lead.style.minHeight='';removeEventListener('scroll',onS)}};
box.addEventListener('click',e=>{if(e.target&&e.target.closest&&e.target.closest('a,button'))fin()});
if(window.__AYN_READY)run();else{addEventListener('ayneh:ready',run,{once:true});tm.push(setTimeout(run,5000))}
})();

