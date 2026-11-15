// The regular customer's page (/try) and the image-pack sheet it shares with salon pages.
//
// /try: a woman who arrives without a salon link tries hairstyle, hair colour, nails and lashes
// on her own photo. The try-on itself is the real customer page of the direct salon, embedded
// (the same code path every salon page uses, so every server rule still applies). Around it:
// her free images, the packs once they are used, and her own referral link.
//
// On a salon page the same packs open in a sheet once her free images for a service are used
// (no referral card there); «درخواست نوبت» / sending to the salon stays where it was.
// Copy is the owner's plan wording; amounts are only displayed here, the server computes them.
import {baseCSS, markSVG} from './design.js';

const packsCSS = String.raw`
.ap{display:grid;gap:12px}
.ap-packs{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(150px,1fr))}
.ap-pack{display:grid;gap:2px;justify-items:start;text-align:right;padding:14px 16px;border-radius:var(--r);border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;cursor:pointer;min-height:var(--tap)}
.ap-pack b{font-family:var(--display);font-size:18px;font-weight:800}
.ap-pack span{font-size:13px;color:var(--muted)}
.ap-pack:hover,.ap-pack:focus-visible{border-color:var(--accent);outline:none;box-shadow:0 0 0 3px var(--accent-ring)}
.ap-more{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:12px 14px;border-radius:var(--r);border:1px dashed var(--line);background:var(--surface-2)}
.ap-more label{display:flex;gap:8px;align-items:center;font-size:14px}
.ap-more input{width:84px;min-height:44px;border:1px solid var(--line);border-radius:var(--r-sm);padding:0 10px;font:inherit;text-align:center;background:#fff;color:var(--ink)}
.ap-more output{font-size:13px;color:var(--muted)}
.ap-pay{display:grid;gap:10px;padding:16px;border-radius:var(--r);background:var(--surface);border:1px solid var(--line-2)}
.ap-row{display:flex;flex-wrap:wrap;gap:6px 12px;justify-content:space-between;font-size:14px}
.ap-row b{font-weight:800}
.ap-card{direction:ltr;text-align:left;font:700 18px/1.4 ui-monospace,Menlo,monospace;letter-spacing:.08em;word-break:break-all}
.ap-note{font-size:12.5px;color:var(--muted);line-height:1.9}
.ap-sheet{position:fixed;inset:0;z-index:80;display:grid;align-items:end;justify-items:center;background:rgba(35,23,15,.45)}
.ap-sheet__panel{width:min(560px,100%);max-height:92vh;overflow:auto;background:var(--glass);border-radius:var(--r-lg) var(--r-lg) 0 0;padding:18px 16px calc(18px + var(--safe-b));display:grid;gap:12px}
.ap-sheet__head{display:flex;justify-content:space-between;align-items:center;gap:8px}
.ap-sheet__head h2{font-family:var(--display);font-size:18px}
.ap-x{border:0;background:transparent;font-size:26px;line-height:1;color:var(--ink);cursor:pointer;min-width:var(--tap);min-height:var(--tap)}
.ap [hidden]{display:none!important}
`;

// window.AynehPacks: mount(box,{referral,onCredited}), open(), out(), button(). Inside the /try
// frame it hands everything to the page around it (window.parent.AynehTry).
export const packsJS = String.raw`
(function(){
 if(window.AynehPacks)return;
 var fa=function(n){return new Intl.NumberFormat('fa-IR').format(n)};
 function el(tag,attrs,kids){var e=document.createElement(tag);attrs=attrs||{};Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v===undefined||v===null||v===false)return;if(k==='text')e.textContent=v;else if(k==='class')e.className=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v)});(kids||[]).forEach(function(c){if(c!==null&&c!==undefined&&c!==false)e.append(c)});return e}
 function api(path,body){var init={credentials:'same-origin'};if(body!==undefined){init.method='POST';init.headers={'Content-Type':'application/json'};init.body=JSON.stringify(body)}return fetch(path,init).then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok)throw new Error(d.error||'خطای ارتباط؛ دوباره امتحان کنید');return d})})}
 function visitor(){var v='';try{v=localStorage.getItem('ayneh-v')||''}catch(e){}if(!/^[a-f0-9]{32}$/.test(v)){v=Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(16)),function(b){return b.toString(16).padStart(2,'0')}).join('');try{localStorage.setItem('ayneh-v',v)}catch(e){}}return v}
 var KEY='ayneh-pack-order';
 function me(ref){return api('/api/c/me?v='+visitor()+(ref?'&ref=1':''))}
 function mount(box,opts){
  opts=opts||{};var err=el('p',{class:'notice notice--warn',hidden:true});
  function fail(m){err.textContent=m;err.hidden=false}
  function choose(count,btn){
   err.hidden=true;if(btn)btn.disabled=true;
   api('/api/c/order',{count:count,v:visitor()}).then(function(o){try{localStorage.setItem(KEY,o.id)}catch(e){}pay(o)}).catch(function(x){fail(x.message);if(btn)btn.disabled=false});
  }
  function list(d){
   var packs=el('div',{class:'ap-packs'},d.packs.map(function(p){var b=el('button',{class:'ap-pack',type:'button',onclick:function(){choose(p.count,b)}},[el('b',{text:fa(p.count)+' تصویر'}),el('span',{text:fa(p.amount)+' تومان'})]);return b}));
   var n=el('input',{type:'number',min:'1',max:String(d.max),step:'1',value:String(d.custom_default),inputmode:'numeric','aria-label':'تعداد تصویر'});
   var total=el('output',{});var upd=function(){var c=Math.max(1,Math.min(d.max,Math.floor(Number(n.value)||0)));total.textContent=fa(c*d.price)+' تومان'};n.addEventListener('input',upd);upd();
   var more=el('div',{class:'ap-more'},[el('label',{},['تعداد بیشتر می‌خواهم',n]),total,el('button',{class:'btn btn--primary btn--sm',type:'button',text:'خرید',onclick:function(e){choose(Math.floor(Number(n.value)||0),e.target)}})]);
   box.replaceChildren(el('div',{class:'ap'},[packs,more,el('p',{class:'ap-note',text:'هر تصویر '+fa(d.price)+' تومان. پرداخت کارت‌به‌کارت است و بعد از تأیید، تصاویر به حساب شما اضافه می‌شود.'}),err]));
  }
  function pay(o){
   if(o.status==='paid'){done();return}
   if(o.status==='expired'||o.status==='cancelled'){try{localStorage.removeItem(KEY)}catch(e){}start();return}
   var left=el('span',{}),msg=el('p',{class:'ap-note'});
   var sent=el('button',{class:'btn btn--primary',type:'button',text:'واریز کردم',onclick:function(){sent.disabled=true;api('/api/order/'+o.id+'/receipt',{note:''}).then(function(r){o.status=r.status;show()}).catch(function(x){fail(x.message);sent.disabled=false})}});
   var back=el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'انتخاب بستهٔ دیگر',onclick:function(){try{localStorage.removeItem(KEY)}catch(e){}stop();start()}});
   function show(){
    var review=o.status==='reviewing';sent.hidden=review;back.hidden=review;
    msg.textContent=review?'رسید ثبت شد. بعد از تأیید پرداخت، تصاویر خودکار به حساب شما اضافه می‌شود؛ همین صفحه را باز نگه دارید یا بعداً برگردید.':'مبلغ را دقیقاً به این کارت بزنید و بعد «واریز کردم» را بزنید.';
   }
   var t=setInterval(function(){var s=Math.max(0,Math.round((o.expires_at-Date.now())/1000));left.textContent=o.status==='open'?(Math.floor(s/60)+':'+String(s%60).padStart(2,'0')):'';},1000);
   var p=setInterval(function(){api('/api/c/order/'+o.id).then(function(r){o=Object.assign(o,r);if(r.status==='paid'){stop();done()}else if(r.status==='expired'||r.status==='cancelled'){stop();try{localStorage.removeItem(KEY)}catch(e){}fail('مهلت این سفارش تمام شد؛ اگر واریز کرده‌اید با کد پیگیری به پشتیبانی خبر بدهید.');start(true)}else show()}).catch(function(){})},5000);
   function stop(){clearInterval(t);clearInterval(p)}
   box.replaceChildren(el('div',{class:'ap-pay'},[
    el('div',{class:'ap-row'},[el('span',{text:'تعداد'}),el('b',{text:fa(o.count)+' تصویر'})]),
    el('div',{class:'ap-row'},[el('span',{text:'مبلغ'}),el('b',{text:fa(o.amount)+' تومان'})]),
    el('div',{class:'ap-row'},[el('span',{text:'کد پیگیری'}),el('b',{dir:'ltr',text:o.ref})]),
    o.card?el('div',{},[el('div',{class:'ap-card',text:o.card.replace(/(\d{4})(?=\d)/g,'$1 ')}),o.card_owner?el('div',{class:'ap-note',text:'به نام '+o.card_owner}):null]):el('p',{class:'notice notice--warn',text:'پرداخت هنوز آماده نیست؛ کمی بعد دوباره سر بزنید.'}),
    el('div',{class:'ap-row'},[el('span',{text:'مهلت واریز'}),left]),
    msg,sent,back,err
   ]));show();
  }
  function done(){try{localStorage.removeItem(KEY)}catch(e){}box.replaceChildren(el('p',{class:'notice notice--ok',text:'تصاویر به حساب شما اضافه شد.'}));if(opts.onCredited)opts.onCredited()}
  function start(keepErr){if(!keepErr)err.hidden=true;me(false).then(list).catch(function(x){box.replaceChildren(el('p',{class:'notice notice--warn',text:x.message}))})}
  var pending='';try{pending=localStorage.getItem(KEY)||''}catch(e){}
  if(/^[a-f0-9-]{36}$/.test(pending))api('/api/c/order/'+pending).then(pay).catch(function(){start()});else start();
 }
 var framed=null;try{if(window.parent!==window&&window.parent.AynehTry)framed=window.parent.AynehTry}catch(e){}
 function credited(){try{window.dispatchEvent(new Event('ayneh:credited'))}catch(e){}}
 function open(){
  if(framed){framed.out();return}
  var body=el('div',{});
  var sheet=el('div',{class:'ap-sheet',role:'dialog','aria-modal':'true','aria-label':'بستهٔ تصویر'},[el('div',{class:'ap-sheet__panel'},[el('div',{class:'ap-sheet__head'},[el('h2',{text:'نمونهٔ بیشتر می‌خواهید؟ یک بسته انتخاب کنید.'}),el('button',{class:'ap-x',type:'button','aria-label':'بستن',text:'×',onclick:function(){sheet.remove()}})]),body])]);
  sheet.addEventListener('click',function(e){if(e.target===sheet)sheet.remove()});
  document.body.append(sheet);mount(body,{referral:false,onCredited:credited});
 }
 function button(){return el('button',{class:'btn btn--soft btn--sm',type:'button',text:'نمونهٔ بیشتر می‌خواهید؟ یک بسته انتخاب کنید.',onclick:open})}
 window.AynehPacks={mount:mount,open:open,out:open,button:button,me:me,visitor:visitor};
})();
`;

/* The sheet on every salon page (index.js adds it). Inert until the page runs out of images. */
export const packsTag = '<style>' + packsCSS + '</style><script>' + packsJS + '</script>';

const tryCSS = String.raw`
.tr{max-width:760px;margin:0 auto;padding:16px 16px 40px;display:grid;gap:16px}
.tr-bar{display:flex;align-items:center;justify-content:space-between;gap:12px}
.tr-brand{display:flex;gap:10px;align-items:center;font-weight:800;color:var(--ink);text-decoration:none}
.tr-brand svg{width:26px;height:38px}
.tr-hero{display:grid;gap:8px;padding:8px 0 0}
.tr-hero h1{font-family:var(--display);font-weight:800;font-size:clamp(24px,6vw,34px);line-height:1.45}
.tr-hero p{color:var(--ink-2);font-size:16px}
.tr-left{font-size:13.5px;color:var(--muted)}
.tr-frame{border-radius:var(--r-lg);overflow:hidden;background:var(--surface);box-shadow:var(--lift)}
.tr-frame iframe{display:block;width:100%;height:760px;border:0;background:transparent}
.tr-card{display:grid;gap:10px;padding:18px 16px;border-radius:var(--r-lg);background:var(--surface);border:1px solid var(--line-2)}
.tr-card h2{font-family:var(--display);font-size:19px;font-weight:800}
.tr-card p{color:var(--ink-2)}
.tr-ref{background:var(--surface-2)}
.tr-ref .tr-link{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.tr-ref code{direction:ltr;text-align:left;flex:1 1 220px;background:#fff;border:1px solid var(--line);border-radius:var(--r-sm);padding:9px 12px;font:13px ui-monospace,Menlo,monospace;word-break:break-all;color:var(--ink)}
.tr-more{justify-self:start}
.tr-foot{max-width:760px;margin:0 auto;padding:0 16px 32px;font-size:12.5px;color:var(--muted);line-height:1.9}
.tr [hidden]{display:none!important}
`;

const tryJS = String.raw`
(function(){
 var $=function(s){return document.querySelector(s)};
 var fa=function(n){return new Intl.NumberFormat('fa-IR').format(n)};
 var frame=$('#trFrame'),packs=$('#trPacks'),box=$('#trPackBox'),mounted=false,last=0;
 function credited(){try{frame.contentWindow.dispatchEvent(new Event('ayneh:credited'))}catch(e){}refresh(true)}
 function showPacks(out){
  $('#trOutTitle').hidden=!out;packs.hidden=false;$('#trMore').hidden=true;
  if(!mounted){mounted=true;AynehPacks.mount(box,{referral:false,onCredited:function(){mounted=false;credited()}})}
 }
 window.AynehTry={out:function(){showPacks(true);packs.scrollIntoView({behavior:'smooth',block:'start'})}};
 function refresh(force){
  if(!force&&Date.now()-last<4000)return;last=Date.now();
  AynehPacks.me(true).then(function(d){
   var free=d.free.left,own=d.own.left;
   $('#trLeft').textContent=(free>0?fa(free)+' نمونهٔ رایگان مانده':'نمونه‌های رایگان استفاده شد')+(own>0?' · '+fa(own)+' تصویر در حساب شما':'');
   if(free+own<=0)showPacks(true);else if(!mounted)$('#trMore').hidden=false;
   if(d.referral){$('#trRef').hidden=false;$('#trRefLink').textContent=d.referral.link}
  }).catch(function(){});
 }
 $('#trMore').addEventListener('click',function(){showPacks(false)});
 $('#trCopy').addEventListener('click',function(e){var t=$('#trRefLink').textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){e.target.textContent='کپی شد'},function(){e.target.textContent='لینک را نگه دارید و بفرستید'})});
 window.addEventListener('message',function(e){if(e.origin!==location.origin||!e.data)return;if(e.data.aynehDemoHeight){frame.style.height=Math.max(520,Math.min(4000,Number(e.data.aynehDemoHeight)||0))+'px';refresh(false)}});
 AynehPacks.visitor();refresh(true);
})();
`;

const attr = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

/* The page for one direct salon slug; the slug is only ever the system salon's own. */
export function tryHTML(slug) {
  return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#e8edeb"><link rel="icon" href="/favicon.svg" type="image/svg+xml">'
    + '<title>امتحان روی عکس خودتان | آینه</title><meta name="description" content="مدل مو، رنگ، ناخن و مژه را روی عکس خودتان ببینید. ۳ نمونهٔ رایگان. بدون نصب.">'
    + '<style>' + baseCSS + packsCSS + tryCSS + '</style></head><body>'
    + '<main class="tr">'
    + '<div class="tr-bar"><a class="tr-brand" href="/"><span aria-hidden="true">' + markSVG + '</span>آینه</a></div>'
    + '<section class="tr-hero"><h1>مدل مو، رنگ، ناخن و مژه را روی عکس خودتان ببینید.</h1><p>۳ نمونهٔ رایگان. بدون نصب.</p><p id="trLeft" class="tr-left" aria-live="polite"></p></section>'
    + '<div class="tr-frame"><iframe id="trFrame" src="/s/' + attr(slug) + '?embed=1" title="امتحان روی عکس خودتان" allow="camera"></iframe></div>'
    + '<button id="trMore" class="btn btn--ghost btn--sm tr-more" type="button" hidden>نمونهٔ بیشتر می‌خواهید؟</button>'
    + '<section id="trPacks" class="tr-card" hidden><h2 id="trOutTitle">۳ نمونهٔ رایگانتان تمام شد.</h2><p>نمونهٔ بیشتر می‌خواهید؟ یک بسته انتخاب کنید.</p><div id="trPackBox"></div></section>'
    + '<section id="trRef" class="tr-card tr-ref" hidden><p>آرایشگر یا آرایشگاه‌دار می‌شناسید؟ لینک شما را به او بدهید؛ اگر پنل آینه بگیرد، ۱۰ تصویر هدیه می‌گیرید.</p><div class="tr-link"><code id="trRefLink"></code><button id="trCopy" class="btn btn--soft btn--sm" type="button">کپی لینک</button></div></section>'
    + '</main>'
    + '<footer class="tr-foot">نتیجه تقریبی است. عکس شما فقط برای ساخت همین نمونه استفاده می‌شود.</footer>'
    + '<script>' + packsJS + tryJS + '</script></body></html>';
}
