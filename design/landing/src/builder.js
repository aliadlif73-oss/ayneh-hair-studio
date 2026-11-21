(()=>{
 const $=id=>document.getElementById(id);
 const form=$('start'),live=$('builderLive');
 if(!form||!live)return;
 const loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
 const add=$('builderAdd'),works=$('builderWorks');
 let wizardReady=false;
 const objectURLs=new Map();
 const imageTypes=['image/jpeg','image/png','image/webp'];
 const validPhoto=file=>imageTypes.includes(file.type)&&file.size>0&&file.size<=12_000_000;
 /* The salon may choose a very pale brand colour. Keep the tint, but darken the
    button/icon variant just enough that white action text stays readable. */
 function actionBrand(hex){
  const rgb=hex.match(/[0-9a-f]{2}/gi)?.map(v=>parseInt(v,16))||[6,143,108];
  const lum=color=>color.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4})
    .reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  let factor=.82,action=rgb.map(v=>Math.round(v*factor));
  while(1.05/(lum(action)+.05)<4.5&&factor>.04){factor-=.02;action=rgb.map(v=>Math.round(v*factor))}
  return '#'+action.map(v=>v.toString(16).padStart(2,'0')).join('');
 }
 const photoHelp='عکس JPG، PNG یا WebP با حجم حداکثر ۱۲ مگابایت انتخاب کنید.';

 const serviceNames={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
 const linkNames={instagram:'اینستاگرام',website:'وب‌سایت',map:'نقشه',telegram:'تلگرام'};
 const TR={'ا':'a','آ':'a','أ':'a','إ':'a','ب':'b','پ':'p','ت':'t','ط':'t','ث':'s','س':'s','ص':'s','ج':'j','چ':'ch','ح':'h','ه':'h','ة':'h','خ':'kh','د':'d','ذ':'z','ز':'z','ض':'z','ظ':'z','ر':'r','ژ':'zh','ش':'sh','ع':'a','غ':'gh','ق':'gh','ف':'f','ک':'k','ك':'k','گ':'g','ل':'l','م':'m','ن':'n','و':'o','ی':'i','ي':'i','ئ':'i','۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9'};
 function toSlug(raw){
  let s=String(raw||'').trim().replace(/^(?:آرایشگاه|سالن\s+زیبایی|سالن|استودیو\s+زیبایی|استودیو|کلینیک\s+زیبایی|کلینیک)\s+/,'');
  if(!s)s=String(raw||'').trim();
  let out='';
  for(const ch of s)out+=TR[ch]!==undefined?TR[ch]:(/[a-zA-Z0-9]/.test(ch)?ch.toLowerCase():(/[\s\u200c_-]/.test(ch)?'-':''));
  out=out.replace(/-+/g,'-').replace(/^-+|-+$/g,'');
  if(!out)return '';
  if(!/^[a-z]/.test(out))out='s-'+out;
  if(out.length<3)out=out+'-salon';
  return out.slice(0,46).replace(/-+$/,'');
 }
 let slugTouched=false;
 const synced={};
 function syncCheckout(){
  const f=form.elements;
  const v=k=>String(f[k]?.value||'').trim();
  const draft={};
  for(const k of ['slug','brand','bio','hours','address','phone','manager','instagram','telegram','website','map']){if(v(k))draft[k]=v(k)}
  const data={salon:v('name'),slug:v('slug'),name:v('manager'),phone:v('phone'),draft};
  for(const [id,val] of [['paySalon',data.salon],['payName',data.name],['payPhone',data.phone]]){
   const el=$(id);
   if(el&&val&&(!el.value.trim()||el.value.trim()===synced[id])){el.value=val;synced[id]=val}
  }
  return data;
 }
 window.__AYN_BUILDER=syncCheckout;
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
  const name=get('name')||'نام شما';
  const slug=get('slug')||'your-salon';
  $('builderAddress').textContent='ayneh-salon.site/s/'+slug;
  live.style.setProperty('--salon-brand',get('brand'));
  live.style.setProperty('--brand-action',actionBrand(get('brand')));
  $('livePage').style.setProperty('--brand',get('brand'));
  $('builderBrandHex').textContent=get('brand').toUpperCase();
  $('liveName').textContent=name;$('liveInitial').textContent=get('name')[0]||'س';
  $('liveBio').textContent=get('bio')||'مدل دلخواهت رو روی عکس خودت ببین و بدون تردید همون رو برای رزرو وقت بفرست.';
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
  syncCheckout();
 }
 form.elements.name.addEventListener('input',()=>{
  if(!slugTouched){
   const sug=toSlug(form.elements.name.value);
   if(sug)form.elements.slug.value=sug;
  }
 });
 form.elements.slug.addEventListener('input',e=>{
  if(e.isTrusted)slugTouched=!!e.target.value.trim();
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
 const modal=$('previewModal'),closeBtn=$('previewClose');
 function closePreview(){
  if(!modal||modal.hidden)return;
  modal.hidden=true;
  document.body.style.overflow='';
  dispatchEvent(new CustomEvent('ayneh:pay-state'));
 }
 function openPreview(){
  render();
  if(!modal)return;
  modal.hidden=false;
  document.body.style.overflow='hidden';
  if(hint)hint.textContent='برای ویرایش جزئیات، پنجره رو ببندید و فرم رو تغییر بدید.';
  dispatchEvent(new Event('resize'));
  dispatchEvent(new CustomEvent('ayneh:pay-state'));
  closeBtn?.focus({preventScroll:true});
 }
 closeBtn?.addEventListener('click',closePreview);
 modal?.addEventListener('click',e=>{if(e.target===modal)closePreview()});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal&&!modal.hidden)closePreview()});
 form.addEventListener('submit',e=>{
  e.preventDefault();
  document.getElementById('wizardNext')?.click();
 });
 activate.addEventListener('click',e=>{
  e.preventDefault();
  const data=syncCheckout();
  closePreview();
  window.__AYN_TRACK?.('cta_click',{label:'فعال‌سازی سریع صفحه',href:'#services',where:'studio'});
  const note=$('servicesActivateNote'),sec=$('services');
  if(note&&data.salon){
   const p=note.querySelector('p');
   if(p){
    p.textContent='';
    p.append('صفحهٔ «'+data.salon+'» ');
    if(data.slug){
     const b=document.createElement('bdi');b.dir='ltr';b.className='pricing-activate__url';b.textContent='(ayneh-salon.site/s/'+data.slug+')';
     p.append(b,' ');
    }
    p.append('آمادهٔ راه‌اندازیه؛ یکی از پلن‌های زیر رو انتخاب کنید تا بعد از تکمیل خرید، صفحه‌تون فوراً فعال شه.');
   }
  }
  (note||sec)?.scrollIntoView({behavior:'smooth',block:'start'});
  if(note){note.classList.remove('is-flash');void note.offsetWidth;note.classList.add('is-flash')}
  history.replaceState(null,'','#services');
 });
 addEventListener('ayneh:wizard-ready',()=>{
  if(wizardReady)return;
  wizardReady=true;
  window.__AYN_TRACK?.('preview_ready');
 });
 addEventListener('ayneh:preview-open',openPreview);
})();
