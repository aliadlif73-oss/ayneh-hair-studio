// The salon panel a paid plan opens at /panel. The owner's console (/admin) is for the
// project team; this is the salon's own door: enter the access key once, then see the page
// link, what is still missing, the last requests and the first portfolio items.
import {baseCSS, markSVG} from './design.js';

const css = String.raw`
.pn{max-width:1080px;margin:0 auto;padding:16px 16px 56px}
.pn-bar{display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:18px}
.pn-brand{display:flex;gap:10px;align-items:center;font-weight:800;color:var(--ink)}
.pn-brand svg{width:34px;height:34px}
.pn-card{background:var(--surface);border:1px solid var(--line-2);border-radius:18px;padding:18px 20px;display:grid;gap:12px}
.pn-card h2{margin:0;font-size:17px}
.pn-card p{margin:0;color:var(--muted);font-size:13.5px;line-height:1.9}
.pn-hero{background:linear-gradient(180deg,#fff,#f2f7f4);border-color:#cfe3da}
.pn-hero h1{margin:0;font-size:26px;font-weight:800}
.pn-hero .pn-link{display:flex;gap:8px;flex-wrap:wrap;align-items:center;direction:ltr;justify-content:flex-end}
.pn-hero .pn-link code{font-family:ui-monospace,Menlo,monospace;background:#0b3b32;color:#e8f4ef;border-radius:10px;padding:8px 10px;font-size:13px}
.pn-grid{display:grid;gap:14px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));margin-top:16px}
.pn-steps{display:grid;gap:8px;margin:0;padding:0;list-style:none}
.pn-steps li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.8;color:var(--ink-2)}
.pn-tick{width:20px;height:20px;border-radius:50%;border:1.5px solid #c9b49c;flex:none;display:grid;place-items:center;font-size:11px;color:transparent}
.pn-steps li.is-done .pn-tick{background:#068f6c;border-color:#068f6c;color:#fff}
.pn-progress{height:8px;border-radius:99px;background:#efe5da;overflow:hidden}
.pn-progress span{display:block;height:100%;background:#068f6c;border-radius:99px;transition:width .4s}
.pn-start{gap:10px}
.pn-start .field{display:grid;gap:6px;font-size:13.5px;font-weight:600}
.pn-start input{min-height:50px;border:1px solid #d9c7b2;border-radius:12px;padding:0 14px;font:inherit;direction:ltr;text-align:left;letter-spacing:.06em}
.pn-who{font-size:12.5px;color:var(--muted)}
`;

const lib = String.raw`
var $=function(s,r){return (r||document).querySelector(s)};
var api=function(path,body){var init={};if(body!==undefined){init.method='POST';init.headers={'Content-Type':'application/json'};init.body=JSON.stringify(body)}return fetch(path,init).then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok)throw new Error(d.error||'خطای ارتباط');return d})})};
var fa=function(n){return new Intl.NumberFormat('fa-IR').format(n)};
var fmt=function(ms){try{return new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(ms)}catch(e){return ''}};
function el(tag,attrs,children){var e=document.createElement(tag);attrs=attrs||{};Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v===undefined||v===null||v===false)return;if(k==='text')e.textContent=v;else if(k==='html')e.innerHTML=v;else if(k==='class')e.className=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v)});(children||[]).forEach(function(c){if(c!==null&&c!==undefined&&c!==false)e.append(c)});return e}
function h(tag,t,cls){return el(tag,{text:t,class:cls||''})}
`;

// First paint: a key box. The key is 9 chars after "AY-"; input is forgiving (spaces, case).
const gate = String.raw`
function gate(msg){
 var input=el('input',{id:'pnKey',placeholder:'AY-XXXXXX XXX',autocomplete:'off',spellcheck:'false','aria-label':'کلید ورود به پنل'});
 var go=el('button',{class:'btn btn--primary',type:'button',text:'ورود به پنل',onclick:function(){
  var key=input.value.trim().toUpperCase().replace(/\s+/g,'');
  if(!key)return;
  go.disabled=true;
  api('/api/panel/login',{key:key}).then(function(){location.reload()}).catch(function(e){err.textContent=e.message;err.hidden=false;go.disabled=false});
 }});
 input.addEventListener('keydown',function(e){if(e.key==='Enter')go.click()});
 var err=el('p',{class:'notice notice--warn',hidden:true});
 $('#app').replaceChildren(el('section',{class:'pn'},[
  el('div',{class:'pn-bar'},[el('a',{class:'pn-brand',href:'/'},[el('span',{html:MARK}),'آینه'])]),
  el('div',{class:'pn-card'},[h('h1','پنل سالن'),h('p','کلیدی که بعد از تأیید پرداخت گرفتید را اینجا وارد کنید. اگر کلید را ندارید، از پشتیبانی آینه بخواهید دوباره بفرستد.'),input,go,err]),
  msg?el('p',{class:'pn-who',text:msg}):null
 ]));
}
`;

const dash = String.raw`
function stepRow(s){return el('li',{'class':s.done?'is-done':''},[h('span','✓','pn-tick'),h('span',s.label)])}
function dash(d){
 var copy=function(){
  var code=$('#pnLink').textContent;
  if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){$('#pnCopy').textContent='کپی شد';setTimeout(function(){$('#pnCopy').textContent='کپی'},1600)});
 };
 $('#app').replaceChildren(el('section',{class:'pn'},[
  el('div',{class:'pn-bar'},[
   el('a',{class:'pn-brand',href:'/'},[el('span',{html:MARK}),'آینه']),
   el('div',{style:'display:flex;gap:8px;align-items:center'},[h('span',d.salon.name,'pn-who'),el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'خروج',onclick:function(){api('/api/panel/logout',{}).then(function(){location.href='/panel'})}})])
  ]),
  el('div',{class:'pn-card pn-hero'},[
   h('span','پنل '+d.plan,'pn-who'),
   h('h1','صفحهٔ '+d.salon.name+' باز است'),
   h('p','این لینک را برای مشتری‌ها بفرستید؛ هر کسی مدل مو، رنگ، ناخن یا مژه را روی عکس خودش می‌بیند و برای شما می‌فرستد.'),
   el('div',{class:'pn-link'},[el('code',{id:'pnLink',text:d.salon.url}),el('button',{class:'btn btn--ghost btn--sm',type:'button',id:'pnCopy',text:'کپی',onclick:copy}),el('a',{class:'btn btn--primary btn--sm',href:d.salon.url,target:'_blank',rel:'noopener',text:'دیدن صفحه'})]),
   h('small','سفارش '+d.ref+' · تأیید‌شده در '+fmt(d.paid_at),'pn-who')
  ]),
  el('div',{class:'pn-grid'},[
   el('div',{class:'pn-card'},[
    h('h2','راه‌اندازی'),
    h('p',fa(d.setup.done)+' از '+fa(d.setup.total)+' قدم انجام شده.'),
    el('div',{class:'pn-progress'},[el('span',{style:'width:'+Math.round(d.setup.done/d.setup.total*100)+'%'})]),
    el('ul',{class:'pn-steps'},d.setup.steps.map(stepRow))
   ]),
   el('div',{class:'pn-card'},[
    h('h2','آخرین درخواست‌ها'),
    d.leads.length?el('div',{style:'display:grid;gap:6px'},d.leads.map(function(l){return el('div',{class:'pn-who',text:fmt(l.created_at)+' · '+l.status})})):h('p','هنوز درخواستی نیامده؛ اول لینک صفحه را بفرستید.'),
    el('a',{class:'btn btn--ghost btn--sm',href:'/s/'+d.salon.slug,target:'_blank',rel:'noopener',text:'دیدن صفحهٔ مشتری'})
   ]),
   el('div',{class:'pn-card'},[
    h('h2','نمونه‌کارها'),
    d.portfolio.length?el('div',{style:'display:grid;gap:6px'},d.portfolio.map(function(p){return el('div',{class:'pn-who',text:p.title+' · '+p.line})})):h('p','هنوز نمونه‌کاری نیست. عکس‌ها را به ربات تلگرام یا بله بفرستید تا همین‌جا بنشینند.'),
    el('p','اتصال ربات: '+(d.bot.telegram||d.bot.bale?'از پنل مدیر برای شما فعال می‌شود.':'در حال آماده‌سازی.')+'')
   ])
  ])
 ]));
}
`;

const boot = String.raw`
(function(){
 api('/api/panel/me').then(function(d){if(!d.salon)return gate('');dash(d)})
  .catch(function(e){gate(e.status===401?'':e.message)});
})();
`;

export const panelHTML = String.raw`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fcf3eb"><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>پنل سالن | آینه</title><style>__CSS__</style></head><body class="admin-body"><main id="app"><div class="pn" style="padding:40px 16px;color:#6B7A78">در حال باز کردن…</div></main><script>__JS__</script></body></html>`
  .replace('__CSS__', () => baseCSS + css)
  .replace('__JS__', () => `var MARK=${JSON.stringify(markSVG)};` + lib + gate + dash + boot);
