/* Select the photo first; authentication happens only after Build on the demo page. */
(()=>{
 const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
 const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.hidden=true;input.setAttribute('aria-label','انتخاب تصویر خودم');document.body.append(input);let line='hair';
 function href(l){const sel=window.__AYN_SEL||{},q=new URLSearchParams({l});if(l==='hair'&&sel.styleIdx!=null)q.set('s',sel.styleIdx);if(l==='hair'&&sel.color)q.set('c',sel.color);return '/s/demo?'+q}
 function sync(){links.forEach(a=>a.href=href(a.dataset.try))}addEventListener('ayneh:selection',sync);sync();
 links.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();line=a.dataset.try;input.value='';input.click()}));
 input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>25*1024*1024){alert('یک تصویر JPG، PNG یا WebP با حجم کمتر از ۲۵ مگابایت انتخاب کنید.');return}try{await window.__AYN_DRAFT.put({file,line,selection:window.__AYN_SEL||{}});location.assign(href(line)+'&draft=1')}catch(_){alert('ذخیرهٔ موقت عکس در مرورگر ممکن نشد؛ در صفحهٔ بعد دوباره عکس را انتخاب کنید.');location.assign(href(line))}});
})();
