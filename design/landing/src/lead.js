/* Low-friction activation request. Always available, even when SMS OTP is
   down; posts to the existing /api/inquiry endpoint (honeypot + owner alert). */
(()=>{
 const $=id=>document.getElementById(id),form=$('leadForm');if(!form)return;
 const digits=s=>s.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  const err=$('lf-err'),send=$('lf-send');err.textContent='';
  const salon=$('lf-salon').value.trim(),name=$('lf-name').value.trim();
  const phone=digits($('lf-phone').value).replace(/[\s-]/g,'');
  const slug=$('slugHintInput')?.value.trim();
  const chosen='صفحهٔ اختصاصی آرایشگر · '+salon+(slug?' ('+slug+')':'');
  const data={name,salon,phone,city:$('lf-city').value.trim(),website:$('lf-web').value,consent:$('lf-consent').checked,chosen,attribution:window.__AYN_ATTR?.()||{}};
  if(name.length<2){err.textContent='نام خودتان را بنویسید.';return}
  if(salon.length<2){err.textContent='نام خودتان یا آرایشگاه را بنویسید.';return}
  if(!/^(\+98|0098|98|0)?9\d{9}$/.test(phone)){err.textContent='شمارهٔ موبایل درست را وارد کنید.';return}
  if(!data.consent){err.textContent='تأیید تماس را انتخاب کنید.';return}
  send.disabled=true;send.setAttribute('aria-busy','true');
  try{
   const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
   const result=await response.json();
   if(!response.ok||!result.ok)throw Error(result.error||'ثبت درخواست ممکن نشد. دوباره تلاش کنید.');
   window.__AYN_TRACK?.('lead_submit',{path:'inquiry'});
   const done=$('lf-done');
   window.__AYN_FOLLOWUP?.(done); /* role=status announces it; no focus ring on a static message */
   form.querySelectorAll('input,button').forEach(i=>i.disabled=true);send.hidden=true;
  }catch(error){window.__AYN_TRACK?.('lead_submit_failed',{path:'inquiry'});err.textContent=error.message}
  finally{send.disabled=false;send.removeAttribute('aria-busy')}
 });
})();
