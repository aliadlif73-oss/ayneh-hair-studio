/* Interactive Bidirectional Scroll-Scrubbed Cinema Engine */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
 const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
 const subP=(p,s,e)=>clamp((p-s)/((e-s)||1),0,1);

 const actions='button,.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,summary,[role="button"]';
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
 document.addEventListener('click',e=>{
  if(e.detail!==0)return;
  const el=e.target.closest(actions);if(!el||el.disabled||still)return;
  const g=layer(el),r=el.getBoundingClientRect(),x=r.width/2,y=r.height/2,size=Math.hypot(x,y)*2;
  for(let k=0;k<3;k++){const ring=document.createElement('i');ring.className='ripple';
   ring.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;animation-delay:'+(k*140)+'ms';
   g.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true})}
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

 /* Static word highlighting. The scrub used to retime a paused animation on
    every one of these spans on every scroll frame; --wp defaults to 1, so the
    words and their gold underlines simply render in their final state. */
 const goldWords=new Set(['عکس','خودش','اختصاصی','سالن','شماست','همه','یک','صفحه','چشم','مشتری','ببینید','رایج']);
 function prepareSlam(el){
  if(!el)return;
  const text=el.textContent.trim();
  el.setAttribute('aria-label',text);
  el.classList.add('cine-slam');
  el.innerHTML=text.split(/\s+/).map(w=>{
   const clean=w.replace(/[،؛.:؟!]/g,'');
   return '<span class="'+(goldWords.has(clean)?'cine-word cine-word--gold':'cine-word')+'" aria-hidden="true">'+w+'</span>';
  }).join(' ');
 }
 function prepareType(el){
  if(!el)return;
  const text=el.textContent.trim();
  el.classList.add('type-wrap');
  el.innerHTML='<span class="type-sr">'+text+'</span><span class="type-reserve" aria-hidden="true">'+text+'</span><span class="type-live" aria-hidden="true">'+text+'</span>';
 }

 /* Hooks kept for the colour/styling rules in the cascade. */
 const cine=(sel,v)=>{const el=$(sel);if(el)el.dataset.cine=v};
 cine('#how','glint');cine('.salon-invite','curtain');cine('#services','fan');
 cine('#transform','lights');cine('#salon-example','desk');cine('#faq','focus');
 cine('.site-footer','draw');

 $$('.sec-head').forEach(h=>{prepareSlam(h.querySelector('h2'));prepareType(h.querySelector('.kicker'))});
 prepareSlam($('#h1'));prepareType($('#intro .eyebrow'));
 const inv=$('.salon-invite');
 if(inv){prepareSlam($('#salon-invite-title',inv));prepareType($('.journey-kicker',inv))}
 prepareType($('.film-caption>span'));
 $$('.cards3>.svc,.benefits-five>.benefit,.builder-steps>li,.faq>details,.faq-next,.service-timeline>button,.foot ul li,.legal')
  .forEach((el,i)=>el.style.setProperty('--i',i%6));
 $$('.site-footer .brand-symbol path').forEach(path=>{try{path.style.setProperty('--len',Math.ceil(path.getTotalLength()))}catch{}});

})();
