(()=>{const b=document.getElementById('menuBtn'),n=document.getElementById('mainnav');b.addEventListener('click',()=>{const open=n.classList.toggle('open');b.setAttribute('aria-expanded',String(open));b.textContent=open?'×':'☰'});n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{n.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='☰'}));const c=document.getElementById('comparison'),r=c.querySelector('.range'),after=c.querySelector('.after-img'),h=c.querySelector('.handle');function update(){const v=Number(r.value);after.style.clipPath='inset(0 '+(100-v)+'% 0 0)';h.style.left=v+'%';c.style.setProperty('--split',v+'%')}r.addEventListener('input',update);update();
const previews={
 hair:{before:'assets/demo-hair-before.webp',after:'assets/demo-hair-after.webp',label:'نمونه شبیه‌سازی مدل مو'},
 color:{before:'assets/demo-color-before.webp',after:'assets/demo-color-after.webp',label:'نمونه شبیه‌سازی رنگ مو'},
 lashes:{before:'assets/demo-lashes-before.webp',after:'assets/demo-lashes-after.webp',label:'نمونه شبیه‌سازی مژه'}
};
const previewImgs=c.querySelectorAll('img'),badge=document.getElementById('previewBadge');
document.querySelectorAll('[data-preview]').forEach(btn=>btn.addEventListener('click',()=>{
 const p=previews[btn.dataset.preview];if(!p)return;
 previewImgs[0].src=p.before;previewImgs[0].alt='تصویر قبل از '+btn.textContent.trim();
 previewImgs[1].src=p.after;previewImgs[1].alt='تصویر بعد از '+btn.textContent.trim();
 badge.textContent=p.label;r.value='50';update();
 document.querySelectorAll('[data-preview]').forEach(b=>{const selected=b===btn;b.classList.toggle('is-selected',selected);b.setAttribute('aria-pressed',String(selected))});
}));
const form=document.getElementById('leadForm'),status=document.getElementById('formStatus'),submit=document.getElementById('formSubmit');
form.addEventListener('submit',async event=>{event.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);const body=Object.fromEntries(data.entries());body.consent=data.get('consent')==='on';status.textContent='در حال ارسال درخواست…';status.classList.remove('error');submit.disabled=true;submit.textContent='در حال ارسال…';try{const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const result=await response.json().catch(()=>({}));if(!response.ok||result.ok!==true)throw Error(result.error||result.message||'ارسال درخواست با مشکل روبه‌رو شد. دوباره تلاش کنید.');form.reset();status.textContent='درخواست شما ثبت شد. برای هماهنگی با شما تماس گرفته می‌شود.';}catch(error){status.textContent=error.message||'ارتباط برقرار نشد؛ دوباره امتحان کنید.';status.classList.add('error')}finally{submit.disabled=false;submit.textContent='ارسال درخواست معرفی ←'}});
})();