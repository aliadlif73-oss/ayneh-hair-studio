/* Visible-only, four-second carousel; document scroll is never trapped. */
(()=>{
 const root=document.querySelector('.cinema-story');if(!root)return;
 document.documentElement.classList.add('cinema-enabled');
 const shots=[...root.querySelectorAll('[data-cinema-shot]')],dots=[...root.querySelectorAll('[data-cinema-go]')],toggle=root.querySelector('[data-slide-toggle]');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');let current=0,visible=false,paused=reduced.matches,timer;
 function show(n){current=(n+shots.length)%shots.length;root.dataset.cinemaChapter=String(current);shots.forEach((s,i)=>{s.classList.toggle('is-current',i===current);s.inert=i!==current;s.setAttribute('aria-hidden',String(i!==current))});dots.forEach((d,i)=>{if(i===current)d.setAttribute('aria-current','step');else d.removeAttribute('aria-current')});restart()}
 function restart(){clearTimeout(timer);if(visible&&!paused&&!document.hidden)timer=setTimeout(()=>show(current+1),4000)}
 root.querySelector('[data-slide-prev]').onclick=()=>show(current-1);root.querySelector('[data-slide-next]').onclick=()=>show(current+1);
 toggle.onclick=()=>{paused=!paused;toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-label',paused?'پخش خودکار اسلایدها':'توقف تعویض خودکار اسلایدها');restart()};dots.forEach((d,i)=>d.onclick=()=>show(i));
 root.addEventListener('focusin',()=>{clearTimeout(timer)});root.addEventListener('focusout',restart);document.addEventListener('visibilitychange',restart);
 new IntersectionObserver(es=>{visible=es[0].isIntersecting;restart()},{threshold:.35}).observe(root);
 root.querySelectorAll('[data-cinema-image]').forEach(img=>{const k=img.dataset.cinemaImage;img.src=window.__AYN_IMG?.[k]||((window.__AYN_BASE||'assets/')+k+'.webp')});show(0);
})();

/* First two films play on visibility. Only the stone and nails follow native scroll. */
(()=>{
 const root=document.querySelector('.service-journey');if(!root)return;document.documentElement.classList.add('journey-enabled');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const states=[...root.querySelectorAll('[data-journey-film]')].map(v=>({v,key:v.dataset.journeyFilm,target:0,visible:false,userPaused:false,loaded:false}));
 async function load(s){if(s.loaded)return;s.loaded=true;s.v.muted=true;s.v.preload='auto';if(s.key==='hair')s.v.defaultPlaybackRate=s.v.playbackRate=1.5;try{const r=await fetch((window.__AYN_BASE||'assets/')+s.v.dataset.src+'?v='+window.__AYN_ASSET_VERSION,{credentials:'same-origin',priority:'low'});if(!r.ok||!(r.headers.get('content-type')||'').includes('video/'))throw Error('HTTP '+r.status+' '+r.headers.get('content-type'));s.v.src=URL.createObjectURL(await r.blob());s.v.load()}catch(e){console.warn('Video unavailable:',s.key,e.message);s.v.controls=true}}
 function playback(s){if(s.key==='nails')return;if(s.visible&&!s.userPaused&&!document.hidden&&!reduced.matches){if(s.v.ended)s.v.currentTime=0;s.v.play().catch(()=>{s.v.controls=true})}else s.v.pause()}
 states.forEach(s=>{s.v.addEventListener('loadedmetadata',()=>{s.v.playbackRate=s.key==='hair'?1.5:1});s.v.controls=reduced.matches;s.v.addEventListener('loadeddata',()=>{playback(s);schedule()});if(s.key!=='nails'){const panel=s.v.closest('.auto-film'),button=panel.querySelector('.film-toggle');new IntersectionObserver(es=>{s.visible=es[0].intersectionRatio>=.4;playback(s)},{threshold:[0,.4,.7]}).observe(panel);button.onclick=()=>{s.userPaused=!s.v.paused;if(s.userPaused)s.v.pause();else{s.v.play().catch(()=>{s.v.controls=true})}button.textContent=s.userPaused?'▶':'Ⅱ';button.setAttribute('aria-label',s.userPaused?'پخش ویدئو':'توقف پخش ویدئو')};s.v.addEventListener('ended',()=>{button.textContent='↻';button.setAttribute('aria-label','پخش دوبارهٔ ویدئو');if(s.key==='hair'&&s.visible&&!document.hidden){root.querySelector('[data-auto-film=lashes]').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'})}})}});
 document.addEventListener('visibilitychange',()=>states.forEach(playback));reduced.addEventListener('change',()=>{states.forEach(s=>{s.v.addEventListener('loadedmetadata',()=>{s.v.playbackRate=s.key==='hair'?1.5:1});s.v.controls=reduced.matches;playback(s)});schedule()});
 const area=root.querySelector('.nail-journey'),stage=area.querySelector('.journey-stage'),s=states.find(s=>s.key==='nails'),bridge=area.querySelector('.journey-bridge'),stone=area.querySelector('.journey-stone'),space=area.querySelector('.journey-bridge-space'),copy=area.querySelector('.journey-copy');let pending=false,position=0,target=0;
 function seek(){if(s.v.seeking||s.v.readyState<1||!Number.isFinite(s.v.duration))return;const t=cl(s.target,0,s.v.duration-.05);if(Math.abs(s.v.currentTime-t)>.045)s.v.currentTime=t}s.v.addEventListener('seeked',seek);
 function update(){pending=false;area.classList.toggle('is-static',reduced.matches);if(reduced.matches){s.v.controls=true;bridge.hidden=true;return}bridge.hidden=false;
 const hh=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||65;target=cl((hh-area.getBoundingClientRect().top)/Math.max(1,area.offsetHeight-stage.offsetHeight));position+= (target-position)*.18;if(Math.abs(target-position)<.0004)position=target;const p=position,q=cl(p/.27),n=cl((p-.27)/.73);
 area.dataset.phase=p<.27?'bridge':'nails';bridge.style.opacity=p<.27?'1':'0';bridge.style.visibility=p<.27?'visible':'hidden';s.v.classList.toggle('is-active',p>=.27);copy.classList.toggle('is-active',p>=.27);
 space.style.opacity=String(cl(q/.18)*(1-cl((q-.73)/.27)));stone.style.opacity=String(cl(q/.1)*(1-cl((q-.9)/.1)));stone.style.top=(40+q*43)+'%';stone.style.transform='translate(-50%,-50%) scale('+(1-q*.35)+')';bridge.querySelector('p').style.opacity=String(cl((q-.18)/.15)*(1-cl((q-.65)/.15)));if(Number.isFinite(s.v.duration)){s.target=n*(s.v.duration-.05);seek()}if(position!==target)schedule();
 }
 function schedule(){if(!pending){pending=true;requestAnimationFrame(update)}}addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);
 Promise.resolve(window.__AYN_HERO_READY).finally(()=>states.forEach(load));schedule();
})();
