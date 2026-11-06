(()=>{
 const $=id=>document.getElementById(id);
 const form=$('start'),live=$('builderLive');
 if(!form||!live)return;
 const loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
 const dialog=$('builderDialog'),phone=$('builderPhone'),otp=$('builderOtp'),thanks=$('builderThanks'),dialogError=$('builderDialogError');
 const add=$('builderAdd'),works=$('builderWorks'),build=$('builderBuild');
 const profileFields=['bio','manager','address','hours','phone','instagram','website','map','telegram'];
 const brandFields=['logo','cover','portrait'];
 let draft,otpBody,busy=false,submitted=false,dirty=false;
 const objectURLs=new Map();
 const api=async(path,body)=>{
  const options=body===undefined?{}:{method:'POST',...(body instanceof FormData?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})};
  const response=await fetch(path,options);
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'ارتباط با آینه برقرار نشد. دوباره تلاش کنید.');
  return data;
 };
 const serviceNames={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
 const linkNames={instagram:'اینستاگرام',website:'وب‌سایت',map:'نقشه',telegram:'تلگرام'};
 function urlFor(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)return '';
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
  $('builderAddress').textContent='ayneh-salon.site/s/'+slug;
  live.style.setProperty('--salon-brand',get('brand'));
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
  const kept=new Set([...form.querySelectorAll('input[type=file]')].map(input=>input.files[0]));
  for(const [file,url] of objectURLs)if(!kept.has(file)){URL.revokeObjectURL(url);objectURLs.delete(file)}
 }
 function change(event){
  render();
  if(event?.target instanceof HTMLElement&&matchMedia('(max-width:850px)').matches){
   const key=event.target.name;
   const target=event.target.closest('.builder-work')?$('liveWorks')
    :['manager','portrait','phone','map','instagram','website','telegram'].includes(key)?$('liveContact')
    :['name','bio','address','hours'].includes(key)?$('liveName'):null;
   if(target)live.scrollTop+=target.getBoundingClientRect().top-live.getBoundingClientRect().top-8;
   else if(['logo','cover','brand','slug'].includes(key))live.scrollTop=0;
  }
  if(!draft)return;
  dirty=true;activate.hidden=true;
  hint.textContent='پیش‌نمایش به‌روز شد. برای ادامه، اطلاعات را تأیید کنید.';
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
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)throw new Error('عکس JPG، PNG یا WebP با حجم حداکثر ۱۲ مگابایت انتخاب کنید.');
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
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(build.disabled)return;
  $('builderError').textContent='';build.disabled=true;activate.hidden=true;hint.textContent='';
  loading.hidden=false;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const fields=[...form.elements].filter(input=>!input.disabled);fields.forEach(input=>input.disabled=true);
  try{
   const name=form.elements.name.value.trim(),slug=form.elements.slug.value;
   if(name.length<2)throw new Error('نام سالن را وارد کنید.');
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
   draft={id:crypto.randomUUID(),data:{name,slug,brand:form.elements.brand.value,profile,portfolio},files};
   dirty=false;submitted=false;
   activate.hidden=false;activate.disabled=false;
   hint.textContent='پیش‌نمایش آماده است. برای بررسی نشانی و راه‌اندازی، درخواست فعال‌سازی بفرستید.';
  }catch(error){$('builderError').textContent=error.message;hint.textContent=error.message}
  finally{build.disabled=false;loading.hidden=true;fields.forEach(input=>input.disabled=false);add.disabled=works.children.length>=6}
 });
 const sessionPath='/api/s/demo/session';
 async function session(){
  try{return await api(sessionPath)}catch(error){await api(sessionPath,{});return api(sessionPath)}
 }
 async function send(){
  if(dirty||!draft)throw new Error('پیش‌نمایش را دوباره بسازید.');
  const payload=new FormData();
  payload.append('id',draft.id);payload.append('draft',JSON.stringify(draft.data));
  for(const [key,file] of draft.files)payload.append(key,file,key);
  await api('/api/activation',payload);
  submitted=true;phone.hidden=true;otp.hidden=true;thanks.hidden=false;
  $('builderDialogTitle').textContent='درخواست فعال‌سازی ثبت شد';
  if(!dialog.open)dialog.showModal();
  activate.disabled=true;hint.textContent='درخواست فعال‌سازی ثبت شد.';
 }
 async function run(action,control){
  if(busy)return;
  busy=true;control.disabled=true;dialogError.textContent='';
  try{await action()}catch(error){if(dialog.open)dialogError.textContent=error.message;else hint.textContent=error.message}
  finally{busy=false;control.disabled=control===activate&&submitted}
 }
 activate.onclick=()=>run(async()=>{
  if(submitted||dirty)return;
  try{await api('/api/activation')}catch(error){
   throw new Error('ثبت فعال‌سازی در این محیط در دسترس نیست. پیش‌نمایش شما آماده است.');
  }
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
   await api('/api/s/demo/otp/send',data);otpBody=data;
   phone.hidden=true;otp.hidden=false;otp.elements.code.focus();
  },e.submitter);
 });
 otp.addEventListener('submit',e=>{
  e.preventDefault();
  run(async()=>{if(!(await api(sessionPath)).verified)await api('/api/s/demo/otp/verify',{code:otp.elements.code.value});await send()},e.submitter);
 });
 $('builderRetry').onclick=e=>run(async()=>{await api('/api/s/demo/otp/send',otpBody);dialogError.textContent='کد جدید فرستاده شد.'},e.currentTarget);
 dialog.querySelector('.builder-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{if(!activate.hidden&&!activate.disabled)activate.focus({preventScroll:true})});
})();
