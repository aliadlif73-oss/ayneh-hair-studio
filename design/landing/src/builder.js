(()=>{
 const $=id=>document.getElementById(id);
 const form=$('start'),live=$('builderLive');
 if(!form||!live)return;
 const loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
 const dialog=$('builderDialog'),phone=$('builderPhone'),otp=$('builderOtp'),thanks=$('builderThanks'),dialogError=$('builderDialogError');
 const availability=$('builderAvailability');
 const fallback=$('leadFallback'),fallbackToggle=$('leadFallbackToggle'),
       fallbackBody=$('leadFallbackBody'),fallbackLead=$('leadFallbackLead');
 const add=$('builderAdd'),works=$('builderWorks'),build=$('builderBuild');
 const profileFields=['bio','manager','address','hours','phone','instagram','website','map','telegram'];
 const brandFields=['logo','cover','portrait'];
 let draft,otpBody,busy=false,submitted=false,dirty=false,canActivate=false,checkingAvailability=false,availabilityKnown=false;
 let availabilityState=null,lastWizardName='',wizardReady=false;
 /* OTP stays primary. A quiet request form is ALWAYS offered and becomes the
    primary route whenever SMS activation is unavailable. */
 function setFallback(primary){
  if(!fallback||availabilityState===primary)return;
  availabilityState=primary;
  fallback.hidden=false;
  fallback.classList.toggle('is-primary',primary);
  fallback.classList.toggle('is-secondary',!primary);
  fallbackLead.hidden=primary;
  fallbackLead.textContent='همچنین می‌توانید، بدون تأیید پیامکی:';
  fallbackToggle.hidden=primary;
  fallbackToggle.setAttribute('aria-expanded',String(primary));
  fallbackBody.hidden=!primary;
 }
 if(fallbackToggle)fallbackToggle.addEventListener('click',()=>{
  const open=fallbackBody.hidden;
  fallbackBody.hidden=!open;
  fallbackToggle.setAttribute('aria-expanded',String(open));
  fallbackLead.hidden=open;
  if(open){
   fallbackLead.hidden=true;
   const name=form.elements.name?.value.trim();
   if(name&&!$('lf-salon').value)$('lf-salon').value=name;
   $('lf-salon').focus({preventScroll:true});
  }
 });
 const objectURLs=new Map();
 const imageTypes=['image/jpeg','image/png','image/webp'];
 const validPhoto=file=>imageTypes.includes(file.type)&&file.size>0&&file.size<=12_000_000;
 const photoHelp='عکس JPG، PNG یا WebP با حجم حداکثر ۱۲ مگابایت انتخاب کنید.';

 const api=async(path,body,signal)=>{
  const options=body===undefined?{}:{method:'POST',...(body instanceof FormData?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})};
  const response=await fetch(path,{...options,signal});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'ارتباط با آینه برقرار نشد. دوباره تلاش کنید.');
  return data;
 };
 function showAvailability(available){
  window.__AYN_TRACK?.('activation_available',{available:!!available});
  canActivate=available;
  availability.textContent=available
   ?'پیش‌نمایش رایگان است. برای درخواست راه‌اندازی، تأیید شمارهٔ موبایل لازم است.'
   :'پیش‌نمایش رایگان است. برای درخواست راه‌اندازی، شماره‌تان را همین‌جا بگذارید؛ بدون پرداخت و بدون انتشار صفحه، برای هماهنگی با شما تماس می‌گیریم.';
  activate.hidden=!available||!wizardReady;
  setFallback(!available);
  if(wizardReady&&!submitted)hint.textContent=available
   ?'پیش‌نمایش آماده است. اگر مایلید، درخواست راه‌اندازی را ثبت کنید.'
   :'پیش‌نمایش آماده است. درخواست‌تان را از فرم زیر بفرستید.';
 }
 async function checkAvailability(){
  if(checkingAvailability)return;
  checkingAvailability=true;
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
  try{await api('/api/activation',undefined,controller.signal);showAvailability(true)}
  catch{showAvailability(false)}
  finally{clearTimeout(timer);checkingAvailability=false;availabilityKnown=true}
 }
 const serviceNames={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
 const linkNames={instagram:'اینستاگرام',website:'وب‌سایت',map:'نقشه',telegram:'تلگرام'};
 function urlFor(file){
  if(!file||!validPhoto(file))return '';
  if(!objectURLs.has(file))objectURLs.set(file,URL.createObjectURL(file));
  return objectURLs.get(file);
 }
 function image(element,file){
  const url=urlFor(file);if(url)element.src=url;else element.removeAttribute('src');
  element.hidden=!url;
 }
 function render(){
  const fields=form.elements;
  const get=key=>fields[key].value.trim();
  const name=get('name')||'نام سالن شما';
  const slug=get('slug')||'your-salon';
  const lfSalon=$('lf-salon');
  if(lfSalon&&(!lfSalon.value||lfSalon.value===lastWizardName))lfSalon.value=get('name')||'';
  lastWizardName=get('name')||'';
  $('builderAddress').textContent='ayneh-salon.site/s/'+slug;
  live.style.setProperty('--salon-brand',get('brand'));
  $('builderBrandHex').textContent=get('brand').toUpperCase();
  $('liveName').textContent=name;$('liveInitial').textContent=get('name')[0]||'س';
  $('liveBio').textContent=get('bio')||'مدل دلخواهت را روی عکس خودت ببین و انتخابت را برای سالن بفرست.';
  for(const [id,key] of [['liveAddress','address'],['liveHours','hours'],['liveManager','manager'],['livePhone','phone']]){
   $(id).textContent=get(key);$(id).hidden=!get(key);
  }
  for(const [id,key] of [['liveCover','cover'],['liveLogo','logo'],['livePortrait','portrait']])image($(id),fields[key].files[0]);
  $('liveInitial').hidden=!$('liveLogo').hidden;
  const links=Object.entries(linkNames).flatMap(([key,label])=>{
   if(!get(key))return [];
   const item=document.createElement('span');item.textContent=label+' · ';
   const value=document.createElement('bdi');value.textContent=get(key);item.append(value);return [item];
  });
  $('liveLinks').replaceChildren(...links);
  $('liveContact').hidden=!get('manager')&&!get('phone')&&!links.length&&$('livePortrait').hidden;
  const cards=[...works.children].map(row=>{
   const field=key=>row.querySelector('[data-work="'+key+'"]');
   const card=document.createElement('article'),img=document.createElement('img'),label=document.createElement('small'),title=document.createElement('strong'),text=document.createElement('p');
   img.alt='';image(img,field('file').files[0]);label.textContent=serviceNames[field('line').value];title.textContent=field('title').value.trim()||'عنوان نمونه‌کار';text.textContent=field('description').value.trim();
   card.append(img,label,title,text);return card;
  });
  $('liveWorks').replaceChildren(...cards);$('liveEmpty').hidden=cards.length>0;
  const kept=new Set();
  for(const input of form.querySelectorAll('input[type=file]')){
   const file=input.files[0];
   if(file)kept.add(file);
   const control=input.closest('.upload-control');
   const invalid=!!file&&!validPhoto(file);
   input.setCustomValidity(invalid?photoHelp:'');
   if(invalid)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid');
   control.querySelector('.upload-name').textContent=invalid?photoHelp:file?.name||'JPG، PNG یا WebP';
  }
  for(const [file,url] of objectURLs)if(!kept.has(file)){URL.revokeObjectURL(url);objectURLs.delete(file)}
 }
 function change(){
  render();
  /* The fitted preview shows the whole page at once; refine.js highlights the
     changed element instead of jumping the page on every keystroke. Optional
     details stay editable after 'ready' — packageDraft() reads the CURRENT
     form whenever the owner actually asks for setup. */
 }
 form.elements.slug.addEventListener('input',e=>{
  e.target.value=e.target.value.toLowerCase().replace(/[\s_]+/g,'-').replace(/[^a-z0-9-]/g,'');
 });
 form.addEventListener('input',change);
 form.addEventListener('change',change);
 form.addEventListener('invalid',e=>{const details=e.target.closest('details');if(details)details.open=true},true);
 render();
 add.addEventListener('click',()=>{
  const item=$('builderWorkTemplate').content.firstElementChild.cloneNode(true);
  item.querySelector('.builder-remove').onclick=()=>{item.remove();add.disabled=false;change();add.focus()};
  works.append(item);add.disabled=works.children.length>=6;change();
  item.querySelector('input').focus();
 });
 async function photo(file){
  if(!file||!validPhoto(file))throw new Error(photoHelp);
  const image=await createImageBitmap(file).catch(()=>{throw new Error('یکی از عکس‌ها خوانده نشد.')});
  try{
   if(file.size<=400_000)return file;
   const scale=Math.min(1,1440/Math.max(image.width,image.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
   canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
   for(const quality of [.86,.68,.45,.28]){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if(blob?.size<=400_000)return blob;
   }
   throw new Error('یکی از عکس‌ها خیلی حجیم است. نسخهٔ کوچک‌تر آن را انتخاب کنید.');
  }finally{image.close()}
 }
 async function packageDraft(){
  const name=form.elements.name.value.trim(),slug=form.elements.slug.value;
  if(name.length<2)throw new Error('نام سالن را وارد کنید.');
  if(!/^[a-z][a-z0-9-]{1,44}[a-z0-9]$/.test(slug))throw new Error('نشانی صفحه را با حروف انگلیسی، عدد یا خط تیره وارد کنید.');
  const profile=Object.fromEntries(profileFields.map(key=>[key,form.elements[key].value.trim()]));
  for(const key of ['instagram','website','map','telegram'])if(profile[key]&&!/^https?:\/\//i.test(profile[key]))throw new Error('لینک‌ها باید با http:// یا https:// شروع شوند.');
  const files=new Map();
  for(const key of brandFields){const file=form.elements[key].files[0];if(file)files.set(key,await photo(file))}
  const portfolio=[];
  for(const row of works.children){
   const get=key=>row.querySelector('[data-work="'+key+'"]');
   const slot='work-'+portfolio.length;
   const title=get('title').value.trim();
   if(title.length<2)throw new Error('برای هر نمونه‌کار عنوان وارد کنید.');
   files.set(slot,await photo(get('file').files[0]));
   portfolio.push({title,line:get('line').value,description:get('description').value.trim(),slot});
  }
  dirty=false;
  return {id:crypto.randomUUID(),data:{name,slug,brand:form.elements.brand.value,profile,portfolio,attribution:window.__AYN_ATTR?.()||{}},files};
 }
 form.addEventListener('submit',e=>{
  e.preventDefault();
  /* Enter advances the two-question wizard; once ready it opens the request. */
  if(busy)return;
  if(!wizardReady){document.getElementById('wizardNext')?.click();return}
  if(canActivate&&!activate.hidden)activate.click();
 });
 const sessionPath='/api/s/demo/session';
 async function session(){
  try{return await api(sessionPath)}catch(error){await api(sessionPath,{});return api(sessionPath)}
 }
 async function send(){
  if(dirty||!draft)throw new Error('اطلاعات کامل نیست. دوباره تلاش کنید.');
  const payload=new FormData();
  payload.append('id',draft.id);payload.append('draft',JSON.stringify(draft.data));
  for(const [key,file] of draft.files)payload.append(key,file,key);
  const sentDraft=draft;
  await api('/api/activation',payload);
  window.__AYN_TRACK?.('lead_submit',{path:'activation'});
  if(draft!==sentDraft||dirty)return;
  submitted=true;phone.hidden=true;otp.hidden=true;thanks.hidden=false;
  $('builderDialogTitle').textContent='درخواست راه‌اندازی ثبت شد';
  if(!dialog.open)dialog.showModal();
  activate.disabled=true;hint.textContent='درخواست راه‌اندازی ثبت شد.';
 }
 async function run(action,control){
  if(busy)return;
  busy=true;control.disabled=true;dialogError.textContent='';$('builderError').textContent='';
  try{await action()}catch(error){if(dialog.open)dialogError.textContent=error.message;else hint.textContent=error.message;$('builderError').textContent=error.message}
  finally{busy=false;control.disabled=control===activate&&submitted}
 }
 activate.onclick=()=>run(async()=>{
  if(submitted||!canActivate)return;
  try{await api('/api/activation')}catch{
   showAvailability(false);
   window.__AYN_TRACK?.('lead_submit_failed',{reason:'activation_unavailable'});
   throw new Error('ثبت درخواست راه‌اندازی از این مسیر در دسترس نیست. می‌توانید درخواست‌تان را از فرم زیر بفرستید.');
  }
  draft=await packageDraft();
  const current=await session();
  if(current.verified){await send();return}
  thanks.hidden=true;phone.hidden=false;otp.hidden=true;
  $('builderDialogTitle').textContent='تأیید شمارهٔ موبایل';
  dialog.showModal();
 },activate);
 phone.addEventListener('submit',e=>{
  e.preventDefault();
  run(async()=>{
   const data=Object.fromEntries(new FormData(phone));
   await api('/api/s/demo/otp/send',data);otpBody=data;window.__AYN_TRACK?.('otp_sent');
   phone.hidden=true;otp.hidden=false;otp.elements.code.focus();
  },e.submitter);
 });
 otp.addEventListener('submit',e=>{
  e.preventDefault();
  run(async()=>{if(!(await api(sessionPath)).verified)await api('/api/s/demo/otp/verify',{code:otp.elements.code.value});window.__AYN_TRACK?.('otp_verified');await send()},e.submitter);
 });
 $('builderRetry').onclick=e=>run(async()=>{await api('/api/s/demo/otp/send',otpBody);dialogError.textContent='کد جدید فرستاده شد.'},e.currentTarget);
 dialog.querySelector('.builder-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{if(!activate.hidden&&!activate.disabled)activate.focus({preventScroll:true})});
 addEventListener('ayneh:wizard-ready',()=>{
  if(wizardReady)return;
  wizardReady=true;
  window.__AYN_TRACK?.('preview_ready');
  activate.hidden=!canActivate;
  hint.textContent=canActivate?'پیش‌نمایش آماده است. اگر مایلید، درخواست راه‌اندازی را ثبت کنید.':'پیش‌نمایش آماده است. درخواست‌تان را از فرم زیر بفرستید.';
 });
 build.disabled=false;
 checkAvailability();
})();
