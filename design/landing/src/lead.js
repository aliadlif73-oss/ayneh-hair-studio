/* Salon lead form: POST /api/inquiry, which saves the request and sends it to the owner's Telegram/Bale chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const form=$('leadForm');if(!form)return;
 const PREVIEW=!!window.__AYN_PREVIEW;
 const err=$('lf-err'),done=$('lf-done'),send=$('lf-send');
 const faDigits=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
 function fail(msg,field){err.textContent=msg;[...form.querySelectorAll('input,textarea')].forEach(i=>i.removeAttribute('aria-invalid'));if(field){field.setAttribute('aria-invalid','true');field.focus()}}
 form.addEventListener('submit',async e=>{
  e.preventDefault();err.textContent='';
  const v={name:$('lf-name').value.trim(),salon:$('lf-salon').value.trim(),city:$('lf-city').value.trim(),phone:faDigits($('lf-phone').value).replace(/[\s-]/g,''),note:$('lf-note').value.trim(),website:$('lf-web').value,consent:$('lf-consent').checked};
  if(v.name.length<2)return fail('نام خودت را بنویس.',$('lf-name'));
  if(v.salon.length<2)return fail('نام سالن را بنویس.',$('lf-salon'));
  if(!/^(\+98|0098|98|0)?9\d{9}$/.test(v.phone))return fail('شمارهٔ موبایل را مثل ۰۹۱۲۰۰۰۰۰۰۰ بنویس.',$('lf-phone'));
  if(!v.consent)return fail('برای ارسال، تأیید تماس لازم است.',$('lf-consent'));
  const sel=window.__AYN_SEL||{};v.chosen=[sel.style,sel.color].filter(Boolean).join(' · ');
  send.disabled=true;send.setAttribute('aria-busy','true');
  try{
   if(PREVIEW){await new Promise(r=>setTimeout(r,700));done.textContent='پیش‌نمایش: این فرم روی سایت اصلی به ربات می‌رسد و در این نسخه چیزی ارسال نشد.'}
   else{
    const r=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'ارسال نشد. کمی بعد دوباره امتحان کن.');
    done.textContent='درخواستت ثبت شد. برای معرفی آینه با شمارهٔ '+v.phone+' تماس می‌گیریم.';
   }
   done.hidden=false;form.querySelectorAll('input,textarea').forEach(i=>i.disabled=true);send.hidden=true;done.focus&&done.setAttribute('tabindex','-1');done.focus();
  }catch(x){fail(x.message||'ارسال نشد. کمی بعد دوباره امتحان کن.')}
  finally{send.disabled=false;send.removeAttribute('aria-busy')}
 });
})();
