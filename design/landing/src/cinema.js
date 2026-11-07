/* Cinematic section & component choreography:
   1. Expressive Typography:
      - Key headlines (.cine-slam) split into 3D impact words (.cine-word) that slam onto the stone surface,
        with signature gold chisel highlights (.cine-word--gold) on the core value words.
      - Conversational kickers and narrative lines type out live character-by-character (.type-wrap / .type-live)
        with a glowing brass caret when they enter the viewport.
   2. Multi-Stage Scroll Choreography:
      - Section headers (.sec-head) enter first when scrolled into view.
      - Cards, triptych panels, builder steps, and FAQ tablets are observed as distinct scroll stages so the
        salon owner sees the text arrive first and then watches each 3D carved component animate in as they scroll. */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];

 // ---- 1. Glass layer + water ripple on every action -------------------------------------------
 const actions='.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button';
 const layer=el=>{let g=el.querySelector(':scope>.glass-layer');if(!g){g=document.createElement('span');g.className='glass-layer';g.setAttribute('aria-hidden','true');el.prepend(g)}return g};
 const dress=()=>$$(actions).forEach(layer);dress();
 new MutationObserver(()=>{clearTimeout(dress.t);dress.t=setTimeout(dress,120)}).observe(document.body,{childList:true,subtree:true});
 document.addEventListener('pointerdown',e=>{
  const el=e.target.closest(actions);if(!el||el.disabled||still)return;
  const g=layer(el),r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  const size=Math.hypot(Math.max(x,r.width-x),Math.max(y,r.height-y))*2;
  for(let k=0;k<3;k++){
   const ring=document.createElement('i');ring.className='ripple';
   ring.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;animation-delay:'+(k*140)+'ms';
   g.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true});
  }
  g.classList.remove('flash');void g.offsetWidth;g.classList.add('flash');
 },{passive:true});

 if(still||!('IntersectionObserver' in window))return;

 // ---- 2. Interactive 3D carved surface light & tilt tracking ----------------------------------
 const carvedSelector='.svc,.benefit,.builder-steps>li,.salon-invite-card,.film-screen,.faq>details,.builder-form,.builder-preview';
 if(matchMedia('(hover:hover)').matches){
  let activeCard=null,raf=0,px=0,py=0;
  document.addEventListener('pointermove',e=>{
   const card=e.target.closest(carvedSelector);
   if(activeCard&&activeCard!==card){
    activeCard.style.removeProperty('--rx');
    activeCard.style.removeProperty('--ry');
    activeCard=null;
   }
   if(!card)return;
   activeCard=card;px=e.clientX;py=e.clientY;
   if(!raf)raf=requestAnimationFrame(()=>{
    raf=0;if(!activeCard)return;
    const r=activeCard.getBoundingClientRect();
    if(!r.width||!r.height)return;
    const x=px-r.left,y=py-r.top,nx=x/r.width-.5,ny=y/r.height-.5;
    activeCard.style.setProperty('--mx',x.toFixed(0)+'px');
    activeCard.style.setProperty('--my',y.toFixed(0)+'px');
    if(activeCard.matches('.svc,.benefit,.builder-steps>li')){
     activeCard.style.setProperty('--rx',(-ny*5).toFixed(2)+'deg');
     activeCard.style.setProperty('--ry',(nx*5).toFixed(2)+'deg');
    }
   });
  },{passive:true});
 }

 // ---- 3. Expressive Typography: 3D Word Slam + Live Typewriter --------------------------------
 const goldWords=new Set(['عکس','خودش','اختصاصی','سالن','شماست','همه','یک','صفحه','چشم','مشتری','ببینید','رایج']);
 function prepareSlam(el){
  if(!el||el.dataset.slammed)return;
  el.dataset.slammed='1';
  const text=el.textContent.trim();
  el.setAttribute('aria-label',text);
  el.classList.add('cine-slam');
  const words=text.split(/\s+/);
  el.innerHTML=words.map((w,i)=>{
   const clean=w.replace(/[،؛.:؟!]/g,'');
   const cls=goldWords.has(clean)?'cine-word cine-word--gold':'cine-word';
   return '<span class="'+cls+'" style="--w:'+i+'" aria-hidden="true">'+w+'</span>';
  }).join(' ');
 }

 function prepareType(el,speed=26,delay=60){
  if(!el||el.dataset.typed)return ()=>{};
  el.dataset.typed='1';
  const text=el.textContent.trim();
  el.classList.add('type-wrap');
  el.innerHTML='<span class="type-sr">'+text+'</span><span class="type-reserve" aria-hidden="true">'+text+'</span><span class="type-live" aria-hidden="true"></span>';
  const live=el.querySelector('.type-live');
  let started=false;
  return ()=>{
   if(started)return;started=true;
   setTimeout(()=>{
    live.classList.add('is-typing');
    let idx=0;
    const step=()=>{
     idx+=1;
     live.textContent=text.slice(0,idx);
     if(idx<text.length)setTimeout(step,speed);
     else setTimeout(()=>live.classList.remove('is-typing'),550);
    };
    step();
   },delay);
  };
 }

 // Hero #intro: slam the main H1 and live-type the eyebrow immediately on load
 const heroH1=$('#h1'),heroEyebrow=$('#intro .eyebrow'),heroCopy=$('#copy');
 if(heroH1)prepareSlam(heroH1);
 const runHeroType=heroEyebrow?prepareType(heroEyebrow,30,180):null;
 if(heroCopy){
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
   heroCopy.classList.add('stage-in');
   runHeroType&&runHeroType();
  }));
 }

 // Prepare section headers (.sec-head) as Stage 1 (Slam H2 + Live-Type Kicker)
 const headerIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const head=e.target;
  head.classList.add('stage-in');
  head._runType&&head._runType();
  headerIO.unobserve(head);
 }),{rootMargin:'0px 0px -16% 0px',threshold:0.25});

 $$('.sec-head').forEach(head=>{
  head.dataset.stage='head';
  const h2=head.querySelector('h2'),kicker=head.querySelector('.kicker');
  if(h2)prepareSlam(h2);
  if(kicker)head._runType=prepareType(kicker,28,100);
  headerIO.observe(head);
 });

 // ---- 4. Staged Scroll Choreography for Sections & Components ---------------------------------
 // Helper to observe individual items or groups only when the user actually scrolls to them
 const itemIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('item-in');
  e.target._onEnter&&e.target._onEnter();
  itemIO.unobserve(e.target);
 }),{rootMargin:'0px 0px -14% 0px',threshold:0.2});

 const tallIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('item-in');
  tallIO.unobserve(e.target);
 }),{rootMargin:'0px 0px -8% 0px',threshold:0.05});

 const secIO=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  e.target.classList.add('cine-in');
  e.target._onEnter&&e.target._onEnter();
  secIO.unobserve(e.target);
 }),{rootMargin:'0px 0px -16% 0px',threshold:0.22});

 // Section 2 (#how): Stage 1 is .sec-head; Stage 2 stamps each .benefit card sequentially on scroll
 const how=$('#how');
 if(how){
  how.dataset.cine='glint';
  $$('.benefits-five>.benefit',how).forEach((card,i)=>{
   card.style.setProperty('--base','380ms');
   card.style.setProperty('--i',i);
   itemIO.observe(card);
  });
 }

 // Section 3 (.salon-invite): Arched mirror portal + Wax seal slam + Typewriter kicker + H2 slam
 const invite=$('.salon-invite');
 if(invite){
  invite.dataset.cine='curtain';
  const invKicker=$('.journey-kicker',invite),invH2=$('#salon-invite-title',invite);
  if(invH2)prepareSlam(invH2);
  const runInvType=invKicker?prepareType(invKicker,28,450):null;
  $$('.salon-invite-copy>*',invite).forEach((el,i)=>el.style.setProperty('--i',i));
  invite._onEnter=()=>{runInvType&&runInvType()};
  secIO.observe(invite);
 }

 // Section 4 (#services): Stage 1 is .sec-head; Stage 2 unfolds the 3 Triptych Mirror service cards
 const services=$('#services');
 if(services){
  services.dataset.cine='fan';
  $$('.cards3>.svc',services).forEach((card,i)=>{
   card.style.setProperty('--base','360ms');
   card.style.setProperty('--i',i);
   itemIO.observe(card);
  });
 }

 // Section 5 (#transform): Medallions stamp in, screen lights up, and caption types out
 const transform=$('#transform');
 if(transform){
  transform.dataset.cine='lights';
  $$('.service-timeline>button',transform).forEach((btn,i)=>btn.style.setProperty('--i',i));
  const filmKicker=$('.film-caption>span',transform);
  const runFilmType=filmKicker?prepareType(filmKicker,26,550):null;
  transform._onEnter=()=>{runFilmType&&runFilmType()};
  secIO.observe(transform);
 }

 // Section 6 (#salon-example): Stage 1 .sec-head -> Stage 2 step stones -> Stage 3 form & live preview
 const builder=$('#salon-example');
 if(builder){
  builder.dataset.cine='desk';
  $$('.builder-steps>li',builder).forEach((li,i)=>{
   li.style.setProperty('--base','340ms');
   li.style.setProperty('--i',i);
   itemIO.observe(li);
  });
  const form=$('.builder-form',builder),preview=$('.builder-preview',builder);
  if(form)tallIO.observe(form);
  if(preview)tallIO.observe(preview);
 }

 // Section 7 (#faq): Stage 1 .sec-head -> Stage 2 each question tablet chisels in as user scrolls
 const faq=$('#faq');
 if(faq){
  faq.dataset.cine='focus';
  $$('.faq>details,.faq-next',faq).forEach((item,i)=>{
   item.style.setProperty('--i',0);
   item.style.setProperty('--dir',i%2===0?1:-1);
   itemIO.observe(item);
  });
 }

 // Section 8 (.site-footer): Self-drawing brass emblem
 const footer=$('.site-footer');
 if(footer){
  footer.dataset.cine='draw';
  $$('.foot ul li,.legal',footer).forEach((el,i)=>el.style.setProperty('--i',i));
  $$('.site-footer .brand-symbol path').forEach(p=>{try{const L=Math.ceil(p.getTotalLength());p.style.setProperty('--len',L)}catch{}});
  secIO.observe(footer);
 }
})();
