/* AYN-D063 — Studio wizard, live-preview feedback, and crisp asset loading. */
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
 const fa=n=>String(n).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]);
 /* Hidden steps would otherwise block a native submit on their required inputs. */
 form.noValidate=true;
 let i=0,reflow=0;
 const remeasure=()=>{clearTimeout(reflow);reflow=setTimeout(()=>dispatchEvent(new Event('resize')),260)};

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
  if(focus){
   const field=st.querySelector('input:not([type=hidden]),textarea,select');
   if(field&&innerWidth>850)field.focus({preventScroll:true});
   const stage=preview&&preview.parentElement;
   if(stage&&innerWidth<=850)stage.scrollIntoView({block:'start'});
  }
  remeasure();
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

 /* ---- 2. Every answered field is visibly acknowledged in the live preview ---- */
 const flashFor={
  name:'liveName',slug:'builderAddress',brand:'builderLive',logo:'liveLogo',cover:'liveCover',
  bio:'liveBio',manager:'liveManager',phone:'livePhone',hours:'liveHours',address:'liveAddress',
  portrait:'livePortrait',map:'liveLinks',instagram:'liveLinks',telegram:'liveLinks',website:'liveLinks'
 };
 function flash(target){
  if(!target)return;
  const key=target.name||(target.hasAttribute('data-work')?'works':'');
  const id=flashFor[key]||(key==='works'?'liveWorks':'');
  const el=id&&$(id);if(!el)return;
  el.classList.remove('live-flash');void el.offsetWidth;el.classList.add('live-flash');
 }
 form.addEventListener('input',e=>flash(e.target));
 form.addEventListener('change',e=>flash(e.target));
 show(0,false);
})();
