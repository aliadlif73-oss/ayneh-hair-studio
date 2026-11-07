/* Interactive Bidirectional Scroll-Scrubbed Cinema Engine */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
 const subP=(p,s,e)=>clamp((p-s)/((e-s)||1),0,1);

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

 if(still)return;

 const carvedSelector='.svc,.benefit,.builder-steps>li,.salon-invite-card,.film-screen,.faq>details,.builder-form,.builder-preview';
 if(matchMedia('(hover:hover)').matches){
  let activeCard=null,raf=0,px=0,py=0;
  document.addEventListener('pointermove',e=>{
   const card=e.target.closest(carvedSelector);
   if(activeCard&&activeCard!==card){activeCard.style.removeProperty('--rx');activeCard.style.removeProperty('--ry');activeCard=null}
   if(!card)return;
   activeCard=card;px=e.clientX;py=e.clientY;
   if(!raf)raf=requestAnimationFrame(()=>{
    raf=0;if(!activeCard)return;
    const r=activeCard.getBoundingClientRect();if(!r.width||!r.height)return;
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

 const goldWords=new Set(['عکس','خودش','اختصاصی','سالن','شماست','همه','یک','صفحه','چشم','مشتری','ببینید','رایج']);
 function prepareSlam(el){
  if(!el)return()=>{};
  const text=el.textContent.trim();
  el.setAttribute('aria-label',text);
  el.classList.add('cine-slam');
  el.innerHTML=text.split(/\s+/).map(w=>{
   const clean=w.replace(/[،؛.:؟!]/g,'');
   return '<span class="'+(goldWords.has(clean)?'cine-word cine-word--gold':'cine-word')+'" aria-hidden="true">'+w+'</span>';
  }).join(' ');
  const spans=$$('.cine-word',el),n=spans.length||1;
  return p=>{for(let i=0;i<n;i++){const st=(i/n)*0.56;spans[i].style.setProperty('--wp',subP(p,st,st+0.44).toFixed(3))}};
 }

 function prepareType(el){
  if(!el)return()=>{};
  const text=el.textContent.trim();
  el.classList.add('type-wrap');
  el.innerHTML='<span class="type-sr">'+text+'</span><span class="type-reserve" aria-hidden="true">'+text+'</span><span class="type-live" aria-hidden="true"></span>';
  const live=el.querySelector('.type-live'),len=text.length;
  let last=-1;
  return p=>{
   const c=Math.round(clamp(p,0,1)*len);
   if(c!==last){last=c;live.textContent=text.slice(0,c)}
   live.classList.toggle('is-typing',p>0.02&&p<0.98);
  };
 }

 const tracks=[];
 const addTrack=(initP,targetFn,applyFn)=>{const t={cur:initP,target:targetFn,apply:applyFn};t.apply(initP);tracks.push(t)};
 const rectP=(el,enterVh=0.92,fullVh=0.44)=>{
  const r=el.getBoundingClientRect(),vh=window.innerHeight||800,s=vh*enterVh,e=vh*fullVh;
  return clamp((s-r.top)/((s-e)||1),0,1);
 };

 const heroCopy=$('#copy'),heroH1=$('#h1'),heroEyebrow=$('#intro .eyebrow');
 if(heroCopy){
  const slamHero=prepareSlam(heroH1),typeHero=prepareType(heroEyebrow);
  let boot=0;const t0=performance.now();
  const bootTick=now=>{boot=clamp((now-t0)/900,0,1);if(boot<1)requestAnimationFrame(bootTick);scheduleScrub()};
  requestAnimationFrame(bootTick);
  addTrack(0,()=>{
   const r=heroCopy.getBoundingClientRect(),vh=window.innerHeight||800;
   const sf=r.bottom<vh*0.72?clamp((r.bottom-vh*0.14)/(vh*0.58),0,1):1;
   return Math.min(boot,sf);
  },p=>{
   heroCopy.style.setProperty('--kp',subP(p,0,0.45).toFixed(3));
   typeHero(subP(p,0.02,0.62));
   slamHero(subP(p,0.08,0.82));
   heroCopy.style.setProperty('--lp',subP(p,0.32,0.88).toFixed(3));
   heroCopy.style.setProperty('--cp',subP(p,0.46,0.96).toFixed(3));
   heroCopy.style.setProperty('--fp',subP(p,0.58,1).toFixed(3));
  });
 }

 $$('.sec-head').forEach(head=>{
  head.dataset.stage='head';
  const slamH2=prepareSlam(head.querySelector('h2')),typeKicker=prepareType(head.querySelector('.kicker'));
  addTrack(0,()=>rectP(head,0.92,0.48),p=>{
   head.style.setProperty('--hp',p.toFixed(3));
   head.style.setProperty('--kp',subP(p,0,0.45).toFixed(3));
   typeKicker(subP(p,0.04,0.68));
   slamH2(subP(p,0.12,0.88));
   head.style.setProperty('--sp',subP(p,0.46,1).toFixed(3));
  });
 });

 const how=$('#how');
 if(how){
  how.dataset.cine='glint';
  const grid=$('.benefits-five',how),cards=$$('.benefits-five>.benefit',how);
  cards.forEach((c,i)=>c.style.setProperty('--i',i));
  if(grid)addTrack(0,()=>rectP(grid,0.88,0.28),rowP=>{
   const st=window.innerWidth<=580;
   cards.forEach((card,i)=>{
    const cp=st?rectP(card,0.92,0.48):subP(rowP,i*0.14,i*0.14+0.44);
    card.style.setProperty('--p',cp.toFixed(3));
    card.classList.toggle('scrub-done',cp>0.99);
   });
  });
 }

 const invite=$('.salon-invite');
 if(invite){
  invite.dataset.cine='curtain';
  const card=$('.salon-invite-card',invite),slamInv=prepareSlam($('#salon-invite-title',invite)),typeInv=prepareType($('.journey-kicker',invite)),copyEls=$$('.salon-invite-copy>*:not(h2)',invite);
  if(card)addTrack(0,()=>rectP(card,0.92,0.34),p=>{
   invite.style.setProperty('--p',p.toFixed(3));
   invite.style.setProperty('--kp',subP(p,0.1,0.5).toFixed(3));
   typeInv(subP(p,0.14,0.66));
   slamInv(subP(p,0.20,0.86));
   copyEls.forEach((el,i)=>{const s=0.26+i*0.12;el.style.setProperty('--cp',subP(p,s,s+0.46).toFixed(3))});
  });
 }

 const services=$('#services');
 if(services){
  services.dataset.cine='fan';
  const grid=$('.cards3',services),cards=$$('.cards3>.svc',services);
  cards.forEach((c,i)=>c.style.setProperty('--i',i));
  if(grid)addTrack(0,()=>rectP(grid,0.90,0.32),rowP=>{
   const st=window.innerWidth<=1100;
   cards.forEach((card,i)=>{
    const cp=st?rectP(card,0.92,0.46):subP(rowP,i*0.18,i*0.18+0.64);
    card.style.setProperty('--p',cp.toFixed(3));
    card.classList.toggle('scrub-done',cp>0.99);
   });
  });
 }

 const transform=$('#transform');
 if(transform){
  transform.dataset.cine='lights';
  const player=$('.film-player',transform),tabs=$$('.service-timeline>button',transform),typeFilm=prepareType($('.film-caption>span',transform));
  if(player)addTrack(0,()=>rectP(player,0.92,0.36),p=>{
   transform.style.setProperty('--p',p.toFixed(3));
   tabs.forEach((btn,i)=>{const s=i*0.14;btn.style.setProperty('--tp',subP(p,s,s+0.56).toFixed(3))});
   typeFilm(subP(p,0.36,0.92));
  });
 }

 const builder=$('#salon-example');
 if(builder){
  builder.dataset.cine='desk';
  const stepsList=$('.builder-steps',builder),steps=$$('.builder-steps>li',builder);
  steps.forEach((li,i)=>li.style.setProperty('--i',i));
  if(stepsList)addTrack(0,()=>rectP(stepsList,0.90,0.42),rowP=>{
   const st=window.innerWidth<=850;
   steps.forEach((li,i)=>{
    const sp=st?rectP(li,0.92,0.48):subP(rowP,i*0.18,i*0.18+0.64);
    li.style.setProperty('--p',sp.toFixed(3));
    li.classList.toggle('scrub-done',sp>0.99);
   });
  });
  const form=$('.builder-form',builder),preview=$('.builder-preview',builder);
  if(form)addTrack(0,()=>rectP(form,0.92,0.42),p=>form.style.setProperty('--p',p.toFixed(3)));
  if(preview)addTrack(0,()=>rectP(preview,0.92,0.42),p=>preview.style.setProperty('--p',p.toFixed(3)));
 }

 const faq=$('#faq');
 if(faq){
  faq.dataset.cine='focus';
  $$('.faq>details,.faq-next',faq).forEach((item,i)=>{
   item.style.setProperty('--dir',i%2===0?1:-1);
   addTrack(0,()=>rectP(item,0.93,0.52),p=>item.style.setProperty('--p',p.toFixed(3)));
  });
 }

 const footer=$('.site-footer');
 if(footer){
  footer.dataset.cine='draw';
  const links=$$('.foot ul li,.legal',footer);
  $$('.site-footer .brand-symbol path').forEach(p=>{try{p.style.setProperty('--len',Math.ceil(p.getTotalLength()))}catch{}});
  addTrack(0,()=>{
   const base=rectP(footer,0.98,0.72),maxS=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);
   return Math.max(base,clamp((window.scrollY-(maxS-120))/120,0,1));
  },p=>{
   footer.style.setProperty('--p',p.toFixed(3));
   links.forEach((el,i)=>{const s=0.2+i*0.1;el.style.setProperty('--lp',subP(p,s,Math.min(1,s+0.5)).toFixed(3))});
  });
 }

 let rafId=0;
 function tick(){
  rafId=0;let moving=false;
  for(let i=0;i<tracks.length;i++){
   const t=tracks[i],tgt=t.target(),diff=tgt-t.cur;
   if(Math.abs(diff)>0.0015){t.cur+=diff*0.28;t.apply(t.cur);moving=true}
   else if(t.cur!==tgt){t.cur=tgt;t.apply(t.cur)}
  }
  if(moving)rafId=requestAnimationFrame(tick);
 }
 function scheduleScrub(){if(!rafId)rafId=requestAnimationFrame(tick)}
 window.addEventListener('scroll',scheduleScrub,{passive:true});
 window.addEventListener('resize',scheduleScrub,{passive:true});
 scheduleScrub();
})();
