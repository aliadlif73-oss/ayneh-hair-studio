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
     changed element instead of jumping the page on every keystroke. Everything
     here is browser-local: nothing is uploaded and no request is sent. */
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
 form.addEventListener('submit',e=>{
  e.preventDefault();
  /* Enter advances the two-question wizard; once the preview is ready the same
     Enter goes on to the panels, which is the only paid step on the page. */
  if(!wizardReady){document.getElementById('wizardNext')?.click();return}
  location.hash='#services';
 });
 activate.addEventListener('click',()=>{window.__AYN_TRACK?.('cta_click',{label:'خرید پنل',href:'#services',where:'studio'})});
 addEventListener('ayneh:wizard-ready',()=>{
  if(wizardReady)return;
  wizardReady=true;
  window.__AYN_TRACK?.('preview_ready');
  /* The preview is the free half of the journey; the paid half is one anchor away.
     The button under the preview appears with it, so the next step is always visible. */
  activate.hidden=false;
  hint.textContent='پیش‌نمایش آماده است. برای باز کردن این صفحه با نشانی خودتان، پنل مناسب را بخرید.';
 });
})();
