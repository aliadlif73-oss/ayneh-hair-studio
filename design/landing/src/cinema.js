/* Cinematic section entrances and water-ripple buttons.
   Each section gets its own entrance (data-cine) and its children a stagger index (--i). Content is only hidden once
   JS has marked it and only when it starts below the first screen, so nothing is lost without JS or with reduced
   motion. The ripple is purely decorative and never blocks the click. */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

 // ---- water ripple on every action -----------------------------------------------------------
 const actions='.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.header-cta';
 document.addEventListener('pointerdown',e=>{
  const el=e.target.closest(actions);if(!el||el.disabled||still)return;
  let host=el.querySelector(':scope>.ripple-host');
  if(!host){host=document.createElement('span');host.className='ripple-host';host.setAttribute('aria-hidden','true');el.appendChild(host)}
  const r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  const size=Math.hypot(Math.max(x,r.width-x),Math.max(y,r.height-y))*2;
  for(let k=0;k<3;k++){
   const ring=document.createElement('i');ring.className='ripple';
   ring.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;animation-delay:'+(k*140)+'ms';
   host.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true});
  }
  el.classList.remove('is-pressed');void el.offsetWidth;el.classList.add('is-pressed');
  setTimeout(()=>el.classList.remove('is-pressed'),520);
 },{passive:true});

 if(still||!('IntersectionObserver' in window))return;

 // ---- per-section entrances ------------------------------------------------------------------
 const plan=[
  ['#how','glint','.benefits-five>.benefit'],
  ['.salon-invite','curtain','.salon-invite-copy>*'],
  ['#services','fan','.cards3>.svc'],
  ['#transform','lights','.service-timeline>button'],
  ['#salon-example','desk','.builder-steps>li'],
  ['#faq','focus','.faq>details,.faq-next'],
  ['.site-footer','draw','.foot ul li,.legal'],
 ];
 const narrow=innerWidth<=900;
 const kio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('k-in');kio.unobserve(e.target)}),{rootMargin:'0px 0px -10% 0px'});
 const below=el=>el.getBoundingClientRect().top>innerHeight*.9;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('cine-in');io.unobserve(e.target)}),{rootMargin:'0px 0px -14% 0px',threshold:0.01});
 for(const [sel,kind,kids] of plan){
  const sec=$(sel);if(!sec||!below(sec))continue;
  sec.dataset.cine=kind;
  const list=$$(kids,sec);
  // On a narrow screen a section is taller than the view: each item enters when it is actually reached.
  list.forEach((k,i)=>{k.style.setProperty('--i',narrow?0:i);if(narrow)kio.observe(k)});
  io.observe(sec);
 }
 // Footer mark draws its own strokes.
 $$('.site-footer .brand-symbol path').forEach(p=>{try{const L=Math.ceil(p.getTotalLength());p.style.setProperty('--len',L)}catch{}});
})();
