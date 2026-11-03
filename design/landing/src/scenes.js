/* Section two is a five-shot film: one dedicated image and a short caption per slide. */
(()=>{
 const section=document.getElementById('pain');if(!section?.classList.contains('cinema-story'))return;
 document.documentElement.classList.add('cinema-enabled');
 const stage=section.querySelector('.cinema-stage'),shots=[...section.querySelectorAll('[data-cinema-shot]')],buttons=[...section.querySelectorAll('[data-cinema-go]')];
 const staticMode=matchMedia('(prefers-reduced-motion:reduce), (max-height:540px)');
 const source=k=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.webp?v='+(window.__AYN_ASSET_VERSION||'1'));
 function load(i){const img=shots[i]?.querySelector('[data-cinema-image]');if(img&&!img.dataset.cinemaLoaded){img.src=source(img.dataset.cinemaImage);img.dataset.cinemaLoaded='1'}}
 let current=-1,queued=false;
 function update(){
  queued=false;
  if(staticMode.matches){shots.forEach((shot,i)=>{shot.inert=false;shot.removeAttribute('aria-hidden');load(i)});current=-1;return}
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;
  const rect=section.getBoundingClientRect(),span=Math.max(1,section.offsetHeight-stage.offsetHeight);
  const p=Math.max(0,Math.min(1,(header-rect.top)/span)),position=p*shots.length,index=Math.min(shots.length-1,Math.floor(position)),local=index===shots.length-1?Math.min(1,position-index):position-index;
  section.style.setProperty('--cinema-local',local.toFixed(4));
  if(index===current)return;
  current=index;section.dataset.cinemaChapter=String(index);load(index);load(index+1);
  shots.forEach((shot,i)=>{const active=i===index;shot.classList.toggle('is-current',active);shot.inert=!active;shot.setAttribute('aria-hidden',String(!active))});
  buttons.forEach((button,i)=>{button.classList.toggle('is-past',i<index);if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
 const near=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){shots.forEach((_,i)=>load(i));near.disconnect()}},{rootMargin:'100% 0px'});near.observe(section);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);staticMode.addEventListener('change',schedule);
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{if(staticMode.matches)return;const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;scrollTo({top:scrollY+section.getBoundingClientRect().top-header+(section.offsetHeight-stage.offsetHeight)*(i+.25)/shots.length,behavior:'smooth'})}));
 update();
})();

/* Native scroll controls paused HTML videos. Never intercept wheel/touch or autoplay. */
(()=>{
 const root=document.querySelector('.tryon-journey');if(!root)return;
 document.documentElement.classList.add('journey-enabled');
 const stage=root.querySelector('.journey-stage'),videos=[...root.querySelectorAll('[data-journey-film]')],copies=[...root.querySelectorAll('[data-journey-copy]')],buttons=[...root.querySelectorAll('[data-journey-go]')],status=root.querySelector('.journey-load');
 const bridge=root.querySelector('.journey-bridge'),stone=bridge.querySelector('.journey-stone'),out=bridge.querySelector('.journey-bridge-out'),incoming=bridge.querySelector('.journey-bridge-in'),space=bridge.querySelector('.journey-bridge-space'),bridgeText=bridge.querySelector('p');
 const reduced=matchMedia('(prefers-reduced-motion:reduce), (max-height:500px)');
 const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const phases=[{key:'hair',from:0,to:.43},{key:'breath',from:.43,to:.50},{key:'lashes',from:.50,to:.74},{key:'bridge',from:.74,to:.85},{key:'nails',from:.85,to:1}];
 const state=videos.map(el=>({el,key:el.dataset.journeyFilm,target:0,loaded:false,error:false,objectURL:null,received:false}));
 let scheduled=false,active='hair';
 function seek(s){const v=s.el;if(!s.loaded||v.seeking||!Number.isFinite(v.duration)||v.readyState<1||s.error)return;const t=clamp(s.target,0,Math.max(0,v.duration-.045));if(Math.abs(v.currentTime-t)>.035){try{v.currentTime=t}catch(_){}}}
 async function load(s){
  if(s.loaded)return;s.loaded=true;s.el.preload='auto';
  const url=(window.__AYN_BASE||'assets/')+s.el.dataset.src+'?v='+(window.__AYN_ASSET_VERSION||'1');
  try{
   // Fetch the complete file first: private/static hosts can ignore Range requests.
   // Blob URLs make subsequent paused seeks local and independent of HTTP streaming.
   const response=await fetch(url,{credentials:'same-origin'});
   if(!response.ok||!(response.headers.get('content-type')||'').includes('video/'))throw new Error('Invalid video response');
   const blob=await response.blob();if(blob.size<1024)throw new Error('Empty video');
   s.objectURL=URL.createObjectURL(blob);s.received=true;s.el.src=s.objectURL;s.el.load();schedule();
  }catch(_){s.error=true;schedule()}
 }

 state.forEach(s=>{s.el.addEventListener('loadedmetadata',()=>{seek(s);schedule()});s.el.addEventListener('loadeddata',()=>{seek(s);schedule()});s.el.addEventListener('seeked',()=>{seek(s);schedule()});s.el.addEventListener('canplay',schedule);s.el.addEventListener('error',()=>{s.error=true;schedule()})});
 function update(){
  scheduled=false;
  const isStatic=reduced.matches;root.classList.toggle('is-static',isStatic);
  if(isStatic){state.forEach(s=>{load(s);s.el.controls=true;s.el.inert=false;s.el.removeAttribute('aria-hidden')});copies.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});return}
  state.forEach(s=>{s.el.controls=false;s.el.pause()});
  const hh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76,rect=root.getBoundingClientRect(),span=Math.max(1,root.offsetHeight-stage.offsetHeight),p=clamp((hh-rect.top)/span);
  const phase=phases.find(x=>p<x.to)||phases[4],q=clamp((p-phase.from)/(phase.to-phase.from));active=phase.key;root.dataset.phase=active;root.dataset.progress=p.toFixed(4);root.style.setProperty('--film-progress',q.toFixed(4));
  state.forEach((s,i)=>{const ph=phases.find(x=>x.key===s.key),local=clamp((p-ph.from)/(ph.to-ph.from));if(rect.top<innerHeight*2&&p>ph.from-.12)load(s);if(s.loaded&&Number.isFinite(s.el.duration)){s.target=local*(s.el.duration-.045);seek(s)}const shown=s.key===active;s.el.classList.toggle('is-active',shown);s.el.inert=!shown;s.el.setAttribute('aria-hidden',String(!shown))});
  copies.forEach(c=>{const on=c.dataset.journeyCopy===active;c.classList.toggle('is-active',on);c.inert=!on;c.setAttribute('aria-hidden',String(!on))});
  buttons.forEach(b=>{if(b.dataset.journeyGo===active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
  if(active==='bridge'){
   const mobile=innerWidth<=600;out.style.opacity=String(1-clamp(q/.22));space.style.opacity=String(clamp(q/.18)*(1-clamp((q-.73)/.27)));incoming.style.opacity=String(clamp((q-.76)/.24));
   stone.style.opacity=String(clamp(q/.1)*(1-clamp((q-.90)/.1)));const y=mobile?30+q*31:48+q*35;stone.style.top=y+'%';stone.style.transform='translate(-50%,-50%) rotate('+(-4*Math.sin(q*Math.PI))+'deg) scale('+(1-q*.35)+')';bridgeText.style.opacity=String(clamp((q-.18)/.15)*(1-clamp((q-.65)/.15)));
   load(state[2]);
  }
  const s=state.find(s=>s.key===active);status.textContent=s?.error?'بارگذاری فیلم انجام نشد؛ صفحه را دوباره باز کنید.':s&&(!s.received||s.el.readyState<2)?'در حال دریافت و آماده‌سازی فیلم…':'';
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);reduced.addEventListener('change',schedule);
 buttons.forEach(b=>b.addEventListener('click',()=>{const ph=phases.find(x=>x.key===b.dataset.journeyGo),hh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;scrollTo({top:scrollY+root.getBoundingClientRect().top-hh+(root.offsetHeight-stage.offsetHeight)*(ph.from+.002),behavior:'smooth'})}));
 const near=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){load(state[0]);near.disconnect()}},{rootMargin:'100% 0px'});near.observe(root);update();
})();
