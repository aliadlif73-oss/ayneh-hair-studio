// «آینه‌پی» for iPhone (/app/i): a page the owner's iPhone opens from a Shortcuts automation
// on the bank's deposit SMS (…/app/i?sms=<the SMS>). It sends the SMS to /api/pay/sms and shows
// what became of every deposit, like the Android app. Pairing is the same one-time 6-digit code;
// the token then lives in a SameSite=Strict, HttpOnly cookie (worker/server.js payToken), so
// nothing secret is in the page, the URL or localStorage. iOS 16 asks for one tap per SMS
// (Message automations cannot run unattended before iOS 17).
export const iphonePage = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#FCF3EB">
<meta name="robots" content="noindex"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><title>آینه‌پی</title>
<style>
@font-face{font-family:Vazirmatn;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");font-weight:100 900}
*{box-sizing:border-box}body{margin:0;background:#FCF3EB;color:#0A202A;font-family:Vazirmatn,system-ui,-apple-system,sans-serif;padding:max(18px,env(safe-area-inset-top)) 16px 32px}
main{max-width:520px;margin:0 auto;display:grid;gap:14px}
.head{display:flex;align-items:center;gap:12px}.logo{width:52px;height:52px;border-radius:16px;background:#068F6C;color:#fff;display:grid;place-items:center;font-size:26px;font-weight:900}
h1{margin:0;font-size:24px}.muted{color:#5D6B68;font-size:13px;margin:0;line-height:1.9}
.card{background:#fff;border:1px solid #EDE0D2;border-radius:22px;padding:16px 18px;display:grid;gap:8px}
.big{font-size:20px;font-weight:800}.row{display:flex;align-items:center;justify-content:space-between;gap:10px}
.chip{font-size:12px;font-weight:800;border-radius:99px;padding:5px 12px;white-space:nowrap}
.ok{background:#E4F4EE;color:#0A6B54}.warn{background:#FFF1E0;color:#A35A00}.bad{background:#FDE8E8;color:#B42318}.gray{background:#EEF0EF;color:#4A5C5C}
input{font:inherit;font-size:30px;letter-spacing:.35em;text-align:center;direction:ltr;width:100%;padding:14px;border-radius:16px;border:1px solid #EDE0D2;background:#FCF3EB}
button{font:inherit;font-weight:800;font-size:16px;border:0;border-radius:99px;padding:15px;background:#068F6C;color:#fff;width:100%}
button.ghost{background:#fff;color:#0A6B54;border:1px solid #BFE3D6}
.banner{border-radius:22px;padding:18px;text-align:center;font-weight:800;font-size:18px}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:10px}.stat{background:#E4F4EE;border-radius:16px;padding:12px 14px}.stat b{display:block;font-size:20px;color:#0A6B54}.stat span{font-size:12px;color:#4A5C5C}
ol{margin:0;padding-inline-start:20px;line-height:2;font-size:14px;color:#12333C}code{direction:ltr;display:inline-block;background:#F6E7DB;border-radius:6px;padding:0 6px;font-size:12px;word-break:break-all}
details summary{cursor:pointer;font-weight:800}
</style></head><body><main>
<div class="head"><div class="logo">آ</div><div><h1>آینه‌پی</h1><p class="muted">تأیید خودکار واریزهای کارت به کارت آینه</p></div></div>
<div id="app"></div>
</main><script>
(function(){
var app=document.getElementById('app');
function el(t,a,k){var e=document.createElement(t);a=a||{};for(var x in a){if(x==='text')e.textContent=a[x];else if(x==='class')e.className=a[x];else if(x.slice(0,2)==='on')e.addEventListener(x.slice(2),a[x]);else e.setAttribute(x,a[x])}(k||[]).forEach(function(c){if(c)e.append(c)});return e}
function post(p,b){return fetch(p,{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(b||{})}).then(function(r){return r.json().catch(function(){return {}}).then(function(d){d._status=r.status;return d})})}
function fa(n){return Number(n||0).toLocaleString('fa-IR')}
function when(t){try{return new Date(t).toLocaleString('fa-IR-u-ca-persian',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})}catch(e){return new Date(t).toLocaleString('fa-IR')}}
var CHIP={paid:['تأیید شد','ok'],none:['سفارشی پیدا نشد','warn'],many:['نیاز به بررسی','warn'],closed:['تأیید نشد','bad'],error:['خطا','bad']};
var DETAIL={none:'سفارش بازی با این مبلغ نبود. اگر پول مشتری است، در پنل مدیر بررسی کنید.',many:'این مبلغ با چند سفارش یکی بود؛ در پنل مدیر تأیید کنید.',closed:'سفارش بسته یا لغو شده بود؛ به مدیر هشدار رفت.'};
var params=new URLSearchParams(location.search),sms=params.get('sms')||'';
if(sms)history.replaceState(null,'',location.pathname);
/* An SMS that arrived before this iPhone was paired waits here and is sent right after pairing. */
try{if(!sms)sms=sessionStorage.getItem('aynehpay_sms')||''}catch(e){}
function pairView(msg){
 var code=el('input',{inputmode:'numeric',maxlength:'6',placeholder:'••••••',autocomplete:'one-time-code'});
 var err=el('p',{class:'muted',style:'color:#B42318'});if(msg)err.textContent=msg;
 var go=el('button',{text:'وصل شو',onclick:function(){var c=code.value.replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/\\D/g,'');if(c.length!==6){err.textContent='کد ۶ رقمی را کامل بنویسید.';return}go.disabled=true;go.textContent='در حال اتصال…';post('/api/pay/pair',{code:c,web:true}).then(function(d){if(d.ok)start();else{go.disabled=false;go.textContent='وصل شو';err.textContent=d.error||'اتصال نشد'}}).catch(function(){go.disabled=false;go.textContent='وصل شو';err.textContent='اینترنت در دسترس نیست.'})}});
 app.replaceChildren(el('div',{class:'card'},[el('div',{class:'big',text:'اتصال این آیفون'}),el('p',{class:'muted',text:'این صفحه را در Safari باز کنید. در پنل مدیر (پرداخت و پنل) «ساخت کد اتصال اپ» را بزنید و کد ۶ رقمی را این‌جا بنویسید.'}),code,err,go]),guide());
}
function guide(){
 var url=location.origin+'/app/i?sms=';
 return el('details',{class:'card'},[el('summary',{text:'راهنمای تنظیم آیفون (یک بار)'}),el('ol',{},[
  el('li',{text:'اول شمارهٔ پیامک بانک (بلو: +989999987641) را در مخاطبین با نام «بلو» ذخیره کنید.'}),
  el('li',{text:'اپ Shortcuts ← Automation ← + ← Create Personal Automation ← Message.'}),
  el('li',{text:'Sender: مخاطب «بلو». Message Contains: واریز ← Next.'}),
  el('li',{text:'Add Action ← «URL Encode» (ورودی: Shortcut Input).'}),
  el('li',{},[document.createTextNode('Add Action ← «Text» و این را بنویسید، بعد متغیر «URL Encoded Text» را دقیقاً بعدش بچسبانید: '),el('code',{text:url})]),
  el('li',{text:'Add Action ← «Open URLs» (ورودی: Text) ← Next ← Done.'}),
  el('li',{text:'از این به بعد با هر پیامک واریز، اعلانی می‌آید؛ رویش بزنید. این صفحه باز می‌شود و واریز خودش تأیید می‌شود.'})
 ]),el('p',{class:'muted',text:'در iOS ۱۶ (آیفون X) اپل اجازهٔ اجرای کاملاً خودکار پیامک را نمی‌دهد؛ برای همین با هر واریز یک لمس لازم است.'})]);
}
function render(hist,last){
 var items=hist.items||[],today=new Date().toDateString(),n=0,sum=0;
 items.forEach(function(i){if(i.result==='paid'&&new Date(i.at).toDateString()===today){n++;sum+=i.amount}});
 var kids=[];
 if(last){var tone=last.matched?'ok':last.duplicate||last.ignored?'gray':last.many||!last.error?'warn':'bad';
  var t=last.matched?'✅ واریز '+fa(last.amount)+' تومان تأیید شد'+(last.name?' · '+last.name:''):last.duplicate?'این پیامک قبلاً ثبت شده بود':last.ignored?'این پیامک واریز نبود':last.many?'⚠️ با چند سفارش یکی بود؛ در پنل مدیر بررسی کنید':last.error?'⛔ '+last.error:'⚠️ سفارشی با مبلغ '+fa(last.amount)+' تومان پیدا نشد';
  kids.push(el('div',{class:'banner '+tone,text:t}))}
 kids.push(el('div',{class:'stats'},[el('div',{class:'stat'},[el('b',{text:fa(n)}),el('span',{text:'واریز تأییدشدهٔ امروز'})]),el('div',{class:'stat'},[el('b',{text:fa(sum)}),el('span',{text:'جمع امروز (تومان)'})])]));
 kids.push(el('div',{class:'big',text:'واریزها',style:'margin-top:6px'}));
 if(!items.length)kids.push(el('div',{class:'card'},[el('p',{class:'muted',text:'هنوز واریزی نیامده. اولین پیامک واریز این‌جا دیده می‌شود.'})]));
 items.forEach(function(i){var c=CHIP[i.result]||['ثبت شد','gray'];var d=i.result==='paid'?[i.name,i.label,i.ref?'کد '+i.ref:''].filter(Boolean).join(' · '):(DETAIL[i.result]||'');
  kids.push(el('div',{class:'card'},[el('div',{class:'row'},[el('div',{class:'big',text:fa(i.amount)+' تومان'}),el('span',{class:'chip '+c[1],text:c[0]})]),el('p',{class:'muted',text:when(i.at)}),d?el('p',{class:'muted',style:'color:#4A5C5C',text:d}):null]))});
 kids.push(el('button',{class:'ghost',text:'تازه‌سازی',onclick:function(){start()}}));
 kids.push(guide());
 app.replaceChildren.apply(app,kids);
}
function start(){
 var first=sms?post('/api/pay/sms',{text:sms}):Promise.resolve(null);sms='';
 var sent=sms;first.then(function(last){if(last&&last._status===401){try{sessionStorage.setItem('aynehpay_sms',sent)}catch(e){}return pairView('اول این آیفون را وصل کنید؛ واریز بعد از اتصال خودش فرستاده می‌شود.')}
  if(last){try{sessionStorage.removeItem('aynehpay_sms')}catch(e){}}
  return post('/api/pay/history').then(function(h){if(h._status===401)return pairView('');render(h,last)})})
 .catch(function(){app.replaceChildren(el('div',{class:'card'},[el('p',{class:'muted',text:'اینترنت در دسترس نیست. دوباره امتحان کنید.'}),el('button',{text:'دوباره',onclick:start})]))});
}
start();
})();
</script></body></html>`;
