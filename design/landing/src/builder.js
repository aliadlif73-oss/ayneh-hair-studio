(()=>{
 const $=id=>document.getElementById(id);
 const form=$('start'),frame=$('builderFrame');
 if(!form||!frame)return;
 const preview=$('builderPreview'),loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
 const dialog=$('builderDialog'),phone=$('builderPhone'),otp=$('builderOtp'),thanks=$('builderThanks'),dialogError=$('builderDialogError');
 const add=$('builderAdd'),works=$('builderWorks'),build=$('builderBuild');
 const profileFields=['bio','manager','address','hours','phone','instagram','website','map','telegram'];
 const brandFields=['logo','cover','portrait'];
 let draft,urls=[],ready=false,ack,otpBody,busy=false,submitted=false,dirty=false;
 const api=async(path,body)=>{
  const options=body===undefined?{}:{method:'POST',...(body instanceof FormData?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})};
  const response=await fetch(path,options);
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'ارتباط با آینه برقرار نشد. دوباره تلاش کنید.');
  return data;
 };
 function change(){
  if(!draft)return;
  dirty=true;activate.hidden=true;
  hint.textContent='برای دیدن تغییرات و فعال‌سازی، پیش‌نمایش را دوباره بسازید.';
 }
 form.addEventListener('input',change);
 form.addEventListener('invalid',e=>{const details=e.target.closest('details');if(details)details.open=true},true);
 form.elements.slug.addEventListener('input',e=>{
  e.target.value=e.target.value.toLowerCase().replace(/[\s_]+/g,'-').replace(/[^a-z0-9-]/g,'');
 });
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
 function post(){
  if(!ready||!draft)return;
  frame.contentWindow.postMessage({type:'ayneh-salon-draft',id:draft.id,brand:draft.data.brand,page:draft.page},location.origin);
 }
 frame.addEventListener('load',()=>{ready=true;post()});
 addEventListener('message',event=>{
  if(event.source!==frame.contentWindow||event.origin!==location.origin||event.data?.type!=='ayneh-salon-rendered'||event.data.id!==draft?.id)return;
  ack?.();
 });
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(build.disabled)return;
  $('builderError').textContent='';build.disabled=true;activate.hidden=true;hint.textContent='';
  loading.hidden=false;preview.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
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
   const prev=urls;urls=[];
   const imageUrl=slot=>{const url=URL.createObjectURL(files.get(slot));urls.push(url);return url};
   const media={...profile};brandFields.forEach(key=>{if(files.has(key))media[key]=imageUrl(key)});
   const data={name,slug,brand:form.elements.brand.value,profile,portfolio};
   draft={id:crypto.randomUUID(),data,files,page:{salon:{name,slug,profile:media},portfolio:portfolio.map(item=>({...item,id:item.slot,images:JSON.stringify([imageUrl(item.slot)]),published:1,try_on:1})),generation:false,reference:false,telegram:false}};
   dirty=false;submitted=false;
   const rendered=new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('پیش‌نمایش آماده نشد. دوباره تلاش کنید.')),10000);
    ack=()=>{clearTimeout(timer);resolve()};
   });
   frame.loading='eager';post();
   try{await rendered}finally{ack=null;prev.forEach(URL.revokeObjectURL)}
   $('builderAddress').textContent='ayneh-salon.site/s/'+slug;
   $('builderPreviewLabel').textContent='پیش‌نمایش '+name;
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
  run(async()=>{await api('/api/s/demo/otp/verify',{code:otp.elements.code.value});await send()},e.submitter);
 });
 $('builderRetry').onclick=e=>run(async()=>{await api('/api/s/demo/otp/send',otpBody);dialogError.textContent='کد جدید فرستاده شد.'},e.currentTarget);
 dialog.querySelector('.builder-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{if(!activate.hidden&&!activate.disabled)activate.focus({preventScroll:true})});
})();
