/* AYN-D063 — Studio wizard: one-screen console, fitted live preview, instant feedback.
   The preview is scaled to fit its box so the WHOLE salon page stays visible while
   typing; nothing inside the studio ever needs its own scrollbar. */
(()=>{
 /* ---- 1. Decode images asynchronously; defer the ones below the fold ---- */
 const imgs=[...document.querySelectorAll('img')];
 for(const img of imgs){
  if(!img.hasAttribute('decoding'))img.setAttribute('decoding','async');
  if(!img.hasAttribute('loading')&&!img.hasAttribute('fetchpriority')){
   const r=img.getBoundingClientRect();
   if(r.top>innerHeight*1.15)img.setAttribute('loading','lazy');
  }
 }

 const form=document.getElementById('start'),wizard=document.getElementById('builderWizard');
 if(!form||!wizard)return;
 const steps=[...wizard.querySelectorAll('.wizard-step')];
 if(!steps.length)return;
 const $=(id)=>document.getElementById(id);
 const q=$('wizardQuestion'),hint=$('wizardHintText'),count=$('wizardCount'),bar=$('wizardBar');
 const err=$('wizardError'),prev=$('wizardPrev'),next=$('wizardNext'),skip=$('wizardSkip');
 const build=$('builderBuild'),preview=$('builderPreview'),live=$('builderLive');
 const page=$('livePage');
 const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]);
 form.noValidate=true;

 /* ---- 2. Fit the entire mini salon page into the preview box ---- */
 /* transform does not change layout height, so offsetHeight stays measurable.
    Width is compensated (100%/scale) so the mock still fills the frame. */
 let fitRaf=0;
 const queueFit=()=>{if(fitRaf)return;fitRaf=requestAnimationFrame(()=>{fitRaf=0;fit()})};
 function fit(){
  if(!page)return;
  /* Desktop, very narrow and very short screens show the mock at natural size;
     only roomy phone viewports need the fitted scale. */
  if(innerWidth>850||innerWidth<=380||innerHeight<=720){
   page.style.removeProperty('--fit');return
  }
  const box=live.clientHeight;
  if(!box)return;
  let z=1;
  for(let k=0;k<6;k++){
   page.style.setProperty('--fit',z.toFixed(3));
   const need=page.offsetHeight||1;
   const target=Math.max(.58,Math.min(1.65,(box-6)/need));
   if(Math.abs(target-z)<.012){z=target;break}
   z+=(target-z)*.72;
  }
  page.style.setProperty('--fit',z.toFixed(3));
 }
 addEventListener('resize',queueFit,{passive:true});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(queueFit);
 if(window.ResizeObserver){
  new ResizeObserver(queueFit).observe(live);
  let lastH=0;
  new ResizeObserver(es=>{
   const h=es[0].contentRect.height;
   if(Math.abs(h-lastH)>2){lastH=h;remeasure();queueFit()}
  }).observe(form);
 }
 if(page){
  /* Content changes (name, bio, works, hidden contact block) resize the mock. */
  new MutationObserver(queueFit).observe(page,{
   childList:true,subtree:true,characterData:true,
   attributes:true,attributeFilter:['hidden','src']
  });
 }

 let i=0,reflow=0;
 /* Only content-driven height changes need a synthetic resize; a real viewport
    resize is already handled by cinema.js / reveal.js. */
 const remeasure=()=>{clearTimeout(reflow);reflow=setTimeout(()=>dispatchEvent(new Event('resize')),220)};

 function show(n,focus=true){
  i=Math.max(0,Math.min(steps.length-1,n));
  steps.forEach((s,k)=>s.classList.toggle('is-active',k===i));
  const st=steps[i],last=i===steps.length-1;
  q.textContent=st.dataset.q||'';hint.textContent=st.dataset.h||'';
  count.textContent=fa(i+1)+' از '+fa(steps.length);
  bar.style.width=(((i+1)/steps.length)*100).toFixed(1)+'%';
  prev.hidden=i===0;
  next.hidden=last;skip.hidden=last||!st.dataset.optional;build.hidden=!last;
  err.textContent='';
  /* No scrollIntoView: the console is already a single screen. A page jump on
     every "ادامه" was the main reason working with the studio felt awkward. */
  if(focus&&innerWidth>850){
   const field=st.querySelector('input:not([type=hidden]),textarea,select');
   if(field)field.focus({preventScroll:true});
  }
  /* Show where this answer will land before the user starts typing. */
  const first=st.querySelector('input,textarea,select');
  if(first)setTimeout(()=>flash(first),240);
  remeasure();queueFit();
 }
 function validate(st){
  const key=st.dataset.key,ctrl=st.querySelector('input,textarea,select');
  if(st.dataset.required&&ctrl&&!ctrl.checkValidity()){
   err.textContent=key==='slug'
    ?'نشانی باید ۳ تا ۴۶ کاراکتر انگلیسی، عدد یا خط تیره باشد و با حرف شروع شود.'
    :'نام سالن را دستکم با دو حرف وارد کنید.';
   ctrl.focus();return false;
  }
  for(const el of st.querySelectorAll('input[type=url]')){
   const v=el.value.trim();
   if(v&&!/^https?:\/\//i.test(v)){err.textContent='لینکها باید با http:// یا https:// شروع شوند.';el.focus();return false}
  }
  return true;
 }
 next.addEventListener('click',()=>{if(validate(steps[i]))show(i+1)});
 skip.addEventListener('click',()=>show(i+1));
 prev.addEventListener('click',()=>show(i-1));

 /* ---- 3. Every answered field is visibly acknowledged in the live preview ---- */
 const flashFor={
  name:'liveName',slug:'builderAddress',brand:'liveInitial',logo:'liveLogo',cover:'liveCover',
  bio:'liveBio',manager:'liveManager',phone:'livePhone',hours:'liveHours',address:'liveAddress',
  portrait:'livePortrait',map:'liveLinks',instagram:'liveLinks',telegram:'liveLinks',website:'liveLinks'
 };
 function flash(target){
  if(!target)return;
  const key=target.name||(target.hasAttribute('data-work')?'works':'');
  const id=flashFor[key]||(key==='works'?'liveWorks':'');
  const el=id&&$(id);if(!el||el.hidden)return;
  /* Exactly one highlight at a time; overlapping flashes smear the preview. */
  for(const old of live.querySelectorAll('.live-flash'))old.classList.remove('live-flash');
  if(preview)for(const old of preview.querySelectorAll('.live-flash'))old.classList.remove('live-flash');
  void el.offsetWidth;el.classList.add('live-flash');
 }
 form.addEventListener('input',e=>flash(e.target));
 form.addEventListener('change',e=>flash(e.target));
 show(0,false);
 queueFit();
})();
