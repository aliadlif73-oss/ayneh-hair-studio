/* Salon lead form: POST /api/inquiry, which saves the request and sends it to the owner's Telegram/Bale chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const form=$('leadForm');if(!form)return;
 /* live mockup of the trial salon page: salon name and brand colour update the card */
 const mock=$('mock'),SRCI=(k)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.webp');
 let brandName='',brandHex='#B9975B';
 if(mock){
  mock.querySelectorAll('img[data-k]').forEach(i=>{i.src=SRCI(i.dataset.k)});
  const nm=$('mockName'),ini=$('mockInit'),DEFAULT_NAME=nm.textContent;
  $('lf-salon').addEventListener('input',e=>{const t=e.target.value.trim();nm.textContent=t||DEFAULT_NAME;ini.textContent=t?[...t][0]:'س'});
  const picks=[...document.querySelectorAll('.brand-pick button')];
  picks.forEach(b=>b.addEventListener('click',()=>{picks.forEach(x=>x.setAttribute('aria-checked',String(x===b)));mock.style.setProperty('--brand',b.dataset.brand);brandName=b.getAttribute('aria-label');brandHex=b.dataset.brand}));
 }
 const PREVIEW=!!window.__AYN_PREVIEW;
 const err=$('lf-err'),done=$('lf-done'),send=$('lf-send');
 const faDigits=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
 function fail(msg,field){err.textContent=msg;[...form.querySelectorAll('input,textarea')].forEach(i=>i.removeAttribute('aria-invalid'));if(field){field.setAttribute('aria-invalid','true');field.focus()}}
 form.addEventListener('submit',async e=>{
  e.preventDefault();err.textContent='';
  const v={name:$('lf-name').value.trim(),salon:$('lf-salon').value.trim(),city:$('lf-city').value.trim(),phone:faDigits($('lf-phone').value).replace(/[\s-]/g,''),note:$('lf-note').value.trim(),website:$('lf-web').value,consent:$('lf-consent').checked,brand:brandHex};
  if(v.name.length<2)return fail('نام خودت را بنویس.',$('lf-name'));
  if(v.salon.length<2)return fail('نام سالن را بنویس.',$('lf-salon'));
  if(!/^(\+98|0098|98|0)?9\d{9}$/.test(v.phone))return fail('شمارهٔ موبایل را مثل ۰۹۱۲۰۰۰۰۰۰۰ بنویس.',$('lf-phone'));
  if(!v.consent)return fail('برای ارسال، تأیید تماس لازم است.',$('lf-consent'));
  const sel=window.__AYN_SEL||{};v.chosen=[sel.style,sel.color,brandName&&('برند '+brandName)].filter(Boolean).join(' · ');
  send.disabled=true;send.setAttribute('aria-busy','true');
  try{
   if(PREVIEW){await new Promise(r=>setTimeout(r,700));done.textContent='پیش‌نمایش: این فرم روی سایت اصلی به ربات می‌رسد و در این نسخه چیزی ارسال نشد.'}
   else{
    const r=await fetch('/api/trial',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'ارسال نشد. کمی بعد دوباره امتحان کن.');
    done.textContent='صفحهٔ سالنت ساخته شد. ۱۰ ساعت و ۵ تصویر داری. ';const a=document.createElement('a');a.href=j.path;a.className='btn';a.textContent='صفحهٔ سالن مرا باز کن ←';a.style.marginTop='12px';a.style.display='inline-flex';done.append(a);
   }
   done.hidden=false;form.querySelectorAll('input,textarea').forEach(i=>i.disabled=true);send.hidden=true;done.focus&&done.setAttribute('tabindex','-1');done.focus();
  }catch(x){fail(x.message||'ارسال نشد. کمی بعد دوباره امتحان کن.')}
  finally{send.disabled=false;send.removeAttribute('aria-busy')}
 });
})();
