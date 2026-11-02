/* Salon lead form: POST /api/inquiry, which saves the request and sends it to the owner's Telegram/Bale chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const form=$('leadForm');if(!form)return;
 /* live mockup of the trial salon page: salon name and brand colour update the card */
 const mock=$('mock'),SRCI=(k)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.webp');
 let brandName='',brandHex='#B9975B',planName='';
 document.querySelectorAll('[data-plan]').forEach(a=>a.addEventListener('click',()=>{planName=a.dataset.plan;const p=$('lf-plan');if(p){p.textContent='پلن موردنظر شما: '+planName;p.hidden=false}}));
 if(mock){
  mock.querySelectorAll('img[data-k]').forEach(i=>{i.src=SRCI(i.dataset.k)});
  const nm=$('mockName'),ini=$('mockInit'),DEFAULT_NAME=nm.textContent;
  $('lf-salon').addEventListener('input',e=>{const t=e.target.value.trim();nm.textContent=t||DEFAULT_NAME;ini.textContent=t?[...t][0]:'س'});
  const picks=[...document.querySelectorAll('.brand-pick button')];
  picks.forEach(b=>b.addEventListener('click',()=>{picks.forEach(x=>x.setAttribute('aria-checked',String(x===b)));mock.style.setProperty('--brand',b.dataset.brand);brandName=b.getAttribute('aria-label');brandHex=b.dataset.brand}));
 }
 const PREVIEW=!!window.__AYN_PREVIEW;
 const err=$('lf-err'),done=$('lf-done'),send=$('lf-send');
 const code=$('lf-code'),codeBox=$('lf-codebox'),resend=$('lf-resend');let codeOn=false,tick=0;
 /* With SMS on, the server first texts a code; the same button then confirms it and builds the page. */
 function askCode(wait){codeOn=true;codeBox.hidden=false;$('lf-phone').readOnly=true;send.querySelector('span').textContent='تأیید کد و ساخت صفحه';err.textContent='کد به '+$('lf-phone').value+' پیامک شد.';code.value='';code.focus();
  clearInterval(tick);let t=wait;resend.disabled=true;const show=()=>{resend.textContent=t>0?'ارسال دوباره تا '+t.toLocaleString('fa-IR')+' ثانیه':'ارسال دوبارهٔ کد'};show();
  tick=setInterval(()=>{t--;show();if(t<=0){clearInterval(tick);resend.disabled=false}},1000)}
 resend&&resend.addEventListener('click',()=>{codeOn=false;code.value='';form.requestSubmit()});
 const faDigits=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
 function fail(msg,field){err.textContent=msg;[...form.querySelectorAll('input,textarea')].forEach(i=>i.removeAttribute('aria-invalid'));if(field){field.setAttribute('aria-invalid','true');field.focus()}}
 form.addEventListener('submit',async e=>{
  e.preventDefault();err.textContent='';
  const v={name:$('lf-name').value.trim(),salon:$('lf-salon').value.trim(),city:$('lf-city').value.trim(),phone:faDigits($('lf-phone').value).replace(/[\s-]/g,''),website:$('lf-web').value,consent:$('lf-consent').checked,brand:brandHex};
    if(v.salon.length<2)return fail('نام سالن را بنویسید.',$('lf-salon'));
  if(!/^(\+98|0098|98|0)?9\d{9}$/.test(v.phone))return fail('شمارهٔ موبایل را مثل ۰۹۱۲۰۰۰۰۰۰۰ بنویسید.',$('lf-phone'));
  if(!v.consent)return fail('برای ساخت صفحه، تیک تأیید تماس را بزنید.',$('lf-consent'));
  const sel=window.__AYN_SEL||{};v.chosen=[sel.style,sel.color,brandName&&('برند '+brandName),planName&&('پلن '+planName)].filter(Boolean).join(' · ');
  send.disabled=true;send.setAttribute('aria-busy','true');
  try{
   if(PREVIEW){await new Promise(r=>setTimeout(r,700));done.textContent='پیش‌نمایش: این فرم روی سایت اصلی به ربات می‌رسد و در این نسخه چیزی ارسال نشد.'}
   else{
    if(codeOn){v.code=faDigits(code.value).replace(/\D/g,'');if(v.code.length<3)throw new Error('کد پیامک‌شده را وارد کنید.')}
    const r=await fetch('/api/trial',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'ارسال نشد. کمی بعد دوباره امتحان کنید.');
    if(j.code_sent){askCode(j.resend_in||60);return}
    done.textContent='صفحهٔ سالن شما آماده است. ۱۰ ساعت و ۵ تصویر دارید. ';const a=document.createElement('a');a.href=j.path;a.className='btn';a.textContent='باز کردن صفحهٔ سالن من ←';a.style.marginTop='12px';a.style.display='inline-flex';done.append(a);
   }
   done.hidden=false;form.querySelectorAll('input,textarea').forEach(i=>i.disabled=true);send.hidden=true;done.focus&&done.setAttribute('tabindex','-1');done.focus();
  }catch(x){fail(x.message||'ارسال نشد. کمی بعد دوباره امتحان کنید.')}
  finally{send.disabled=false;send.removeAttribute('aria-busy')}
 });
})();
