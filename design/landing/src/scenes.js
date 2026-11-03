/* Scenes: scroll scrubs a frame sequence painted on a canvas (video.currentTime stutters on iOS).
   Frames load only when a scene is near the viewport; the first and last frame come first. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const FR=window.__AYN_FRAMES,base=(window.__AYN_BASE||'assets/')+'f/';
 const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const url=(set,i)=>FR?FR[set][i]:base+set+'/'+String(i+1).padStart(3,'0')+'.webp';

 function seq(canvas){
  const set=canvas.dataset.set,n=+canvas.dataset.n,fx=+canvas.dataset.fx||.5,imgs=new Array(n);
  let started=false,prog=0,cw=0,ch=0;
  const ok=im=>im&&im.complete&&im.naturalWidth;
  function load(i){if(imgs[i])return;const im=new Image();im.decoding='async';im.onload=()=>paint();im.src=url(set,i);imgs[i]=im}
  function start(){if(started)return;started=true;load(0);load(n-1);for(let i=1;i<n-1;i++)setTimeout(()=>load(i),40+i*35)}
  function size(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cw=canvas.width=Math.max(2,Math.round(r.width*d));ch=canvas.height=Math.max(2,Math.round(r.height*d));paint()}
  function paint(){
   const f=Math.round(cl(prog)*(n-1));let im=null;if(started)load(f);
   for(let k=0;k<n&&!im;k++){if(ok(imgs[f-k]))im=imgs[f-k];else if(ok(imgs[f+k]))im=imgs[f+k]}
   if(!im||!cw)return;
   const s=Math.max(cw/im.naturalWidth,ch/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
   canvas.getContext('2d').drawImage(im,(cw-w)*fx,(ch-h)/2,w,h);
  }
  return {start,size,set(p){prog=p;paint()},canvas};
 }

 const scenes=[...document.querySelectorAll('.scene[data-scene]')].map(el=>({el,kind:el.dataset.scene,seqs:[...el.querySelectorAll('.film-canvas')].map(seq),caps:[...el.querySelectorAll('.cap')],img:el.querySelector('#painImg'),rail:el.querySelector('.rail i')}));
 if(!scenes.length)return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const s=scenes.find(x=>x.el===e.target);s.seqs.forEach(q=>q.start())}}),{rootMargin:'160% 0px'});
 scenes.forEach(s=>{io.observe(s.el);s.seqs.forEach(q=>q.size())});
 addEventListener('resize',()=>scenes.forEach(s=>s.seqs.forEach(q=>q.size())));

 function update(){
  const vh=innerHeight;
  for(const s of scenes){
   const r=s.el.getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;
   const p=cl(-r.top/Math.max(1,r.height-vh));
   s.caps.forEach(c=>c.classList.toggle('is-on',p>=+c.dataset.from&&p<+c.dataset.to));
   if(s.rail)s.el.style.setProperty('--rp',p);
   if(s.kind==='pain'&&s.img){const e=cl(p/.6);s.img.style.setProperty('--ps',1.14-.14*e);s.img.style.setProperty('--pr',(-2*(1-e))+'deg');s.img.style.setProperty('--po',.35+.65*e)}
   else if(s.kind==='transform'){s.seqs[0].set(cl(p/.92))}
   else if(s.kind==='lines'){
    const [a,b]=s.seqs,pa=cl(p/.46),pb=cl((p-.54)/.46),mix=cl((p-.46)/.08);
    a.set(pa);b.set(pb);a.canvas.style.opacity=1-mix;b.canvas.style.opacity=mix;
   }
  }
 }
 if(reduce){scenes.forEach(s=>{s.seqs.forEach(q=>{q.start();q.set(1)})});return}
 let tick=false;addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;update()})}},{passive:true});
 update();
})();

/* A continuous editorial stage: scroll position selects a chapter; scrolling stays native. */
(()=>{
 const section=document.getElementById('pain');if(!section?.classList.contains('value-story'))return;
 const stage=section.querySelector('.value-stage'),world=section.querySelector('.value-world');
 const chapters=[...section.querySelectorAll('[data-value-chapter]')],buttons=[...section.querySelectorAll('[data-value-go]')];
 const staticMode=matchMedia('(prefers-reduced-motion:reduce), (max-height:640px)');
 const source=k=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.webp');
 section.querySelectorAll('[data-value-asset]').forEach(img=>{img.src=source(img.dataset.valueAsset)});
 let selectionTimer=0;
 function selection(detail){
  clearTimeout(selectionTimer);
  // The hero colours hair on a separate canvas; copy the finished composition, not just its base image.
  selectionTimer=setTimeout(()=>{
   const photo=document.getElementById('roomImg'),hair=document.getElementById('hairCanvas');if(!photo?.complete||!photo.naturalWidth)return;
   const canvas=document.createElement('canvas');canvas.width=1376;canvas.height=768;
   const g=canvas.getContext('2d');g.drawImage(photo,0,0,1376,768);if(hair)g.drawImage(hair,0,0);
   const image=canvas.toDataURL('image/png');document.getElementById('valuePortrait').src=image;document.getElementById('valueRequestPhoto').src=image;
  },1000);
  const selected=[detail?.style,detail?.color].filter(Boolean).join(' · ')||'مدل و رنگ دلخواه مشتری';
  document.getElementById('valueChoiceText').textContent=selected;document.getElementById('valueRequestChoice').textContent=selected;
 }
 addEventListener('ayneh:selection',event=>selection(event.detail));selection(window.__AYN_SEL);
 let queued=false,current=-1;
 function update(){
  queued=false;
  if(staticMode.matches){chapters.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});current=-1;return}
  const rect=section.getBoundingClientRect(),header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;
  const span=Math.max(1,section.offsetHeight-stage.offsetHeight),p=Math.max(0,Math.min(1,(header-rect.top)/span));
  section.style.setProperty('--value-p',p.toFixed(4));section.style.setProperty('--value-local',((p*chapters.length)%1).toFixed(4));
  const index=Math.min(chapters.length-1,Math.floor(p*chapters.length));
  if(index===current)return;current=index;world.dataset.valueState=String(index);section.dataset.valueChapter=String(index);
  chapters.forEach((chapter,i)=>{const active=i===index;chapter.classList.toggle('is-current',active);chapter.inert=!active;chapter.setAttribute('aria-hidden',String(!active))});
  buttons.forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);staticMode.addEventListener('change',schedule);
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{
  if(staticMode.matches)return;
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;
  const span=section.offsetHeight-stage.offsetHeight,target=scrollY+section.getBoundingClientRect().top-header+span*((i+.25)/chapters.length);
  scrollTo({top:target,behavior:'smooth'});
 }));
 update();
})();
