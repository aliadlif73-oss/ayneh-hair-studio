// Owner console (/ and /admin). Salons have no panel: they use the Telegram bot.
// Only the project owner signs in here to create salons, fill in their details and hand
// each salon its one-time Telegram link.
import {baseCSS,markSVG} from './design.js';

const css=String.raw`
.appbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;max-width:1080px;margin:0 auto}
.appbar__brand{display:inline-flex;align-items:center;gap:9px;color:var(--ink);font-family:var(--display);font-weight:800;font-size:22px}
.appbar__brand svg{width:22px;height:28px}
main#app{max-width:1080px;margin:0 auto;padding:6px 20px 80px;min-height:70vh}
.page-head{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;flex-wrap:wrap;margin:10px 0 22px}
.page-head h1{font-family:var(--display);font-weight:800;font-size:clamp(26px,6vw,34px)}
.page-head p{color:var(--muted);margin-top:4px;max-width:60ch;line-height:1.9}
.back{display:inline-flex;align-items:center;gap:6px;font-size:13.5px;font-weight:600;margin-bottom:6px}
.grid{display:grid;gap:16px}
@media(min-width:900px){.grid--2{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start}}
.card{background:var(--surface);border:1px solid var(--line-2);border-radius:22px;padding:22px;box-shadow:0 1px 2px rgba(35,23,15,.05)}
.card>h2{font-family:var(--display);font-weight:800;font-size:21px;margin-bottom:6px}
.card>.lead{color:var(--muted);font-size:13.5px;line-height:1.9;margin-bottom:16px}
.stack{display:grid;gap:16px}
.salons{display:grid;gap:12px}
.salon{display:flex;align-items:center;gap:14px;flex-wrap:wrap;padding:16px 18px;border-radius:18px;background:var(--surface);border:1px solid var(--line-2)}
.salon strong{font-size:17px;display:block}
.salon small{color:var(--muted);font-size:12.5px;direction:ltr;display:inline-block}
.salon .grow{min-width:160px}
.status{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.status li{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.75;padding:5px 0}
.status .dot{width:22px;height:22px;border-radius:50%;flex:none;display:grid;place-items:center;font-size:12px;font-weight:700;margin-top:1px}
.status .on .dot{background:var(--ok-soft);color:var(--ok)}
.status .off{color:var(--muted)}
.status .off .dot{background:var(--glass-2)}
.linkbox{display:flex;gap:8px;align-items:center;margin-top:12px;padding:10px 10px 10px 14px;border-radius:14px;background:var(--glass)}
.linkbox code{flex:1;min-width:0;direction:ltr;text-align:left;font-size:13px;overflow-wrap:anywhere}
.tg-state{display:flex;align-items:center;gap:12px;padding:14px;border-radius:16px;margin-bottom:14px}
.tg-state--on{background:var(--ok-soft);color:#1f4f30}
.tg-state--off{background:#f8efdd;color:#674511}
.tg-state b{display:block;font-size:15px}
.tg-state span{font-size:13px;line-height:1.8}
.tg-state svg{width:30px;height:30px;flex:none}
.uploads{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-bottom:16px}
.uploadbox{display:flex;align-items:center;gap:12px;padding:10px;border:1.5px dashed #b2c0ba;border-radius:16px;background:var(--surface-2);cursor:pointer;margin:0}
.uploadbox:hover{border-color:var(--accent);background:#eef6f4}
.uploadbox.is-busy{opacity:.6;pointer-events:none}
.uploadbox__img{width:48px;height:62px;flex:none;border-radius:999px 999px 8px 8px;overflow:hidden;background:var(--glass-2);display:grid;place-items:center;color:var(--accent);font-size:22px}
.uploadbox__img img{width:100%;height:100%;object-fit:cover}
.uploadbox__txt{display:grid;line-height:1.5}
.uploadbox__txt strong{font-size:13.5px}
.uploadbox__txt small{color:var(--muted);font-size:12px}
.two{display:grid;gap:0 14px}
@media(min-width:620px){.two{grid-template-columns:1fr 1fr}}
.field input[type=url],.field input[type=tel],#slug{direction:ltr;text-align:right}
.ports{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:12px}
.port{display:grid;gap:6px}
.port img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:999px 999px 12px 12px;background:var(--glass-2)}
.port b{font-size:13px;line-height:1.5}
.port .btn{min-height:34px;font-size:12.5px}
.log{display:grid}
.log__row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--line-2);font-size:13.5px}
.log__row:last-child{border-bottom:0}
.log__row small{color:var(--muted);font-size:12px}
.empty-note{color:var(--muted);font-size:13.5px;line-height:1.9;padding:8px 0}
.login{max-width:420px;margin:30px auto 0}
.login .mirror{width:120px;margin:0 auto 18px}
.login .mirror__glass{aspect-ratio:3/4;display:grid;place-items:center}
.login .mirror__glass span{display:block;width:40%;position:relative;z-index:1}
.login h1{font-family:var(--display);font-weight:800;font-size:28px;text-align:center}
.login p{text-align:center;color:var(--muted);margin:6px 0 18px;line-height:1.9}
.loading{padding:60px 20px;text-align:center;color:var(--muted)}
.foot{padding:26px 20px 34px;text-align:center;color:var(--muted);font-size:12px}
`;

const clientJS=String.raw`
var MARK=__MARK__;
var $=function(s,r){return (r||document).querySelector(s)};
function el(tag,attrs,children){var e=document.createElement(tag);attrs=attrs||{};Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v===undefined||v===null||v===false)return;if(k==='text')e.textContent=v;else if(k==='html')e.innerHTML=v;else if(k==='class')e.className=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else e.setAttribute(k,v===true?'':v)});(children||[]).forEach(function(c){if(c!==null&&c!==undefined&&c!==false)e.append(c)});return e}
function h(tag,text,cls){return el(tag,{text:text,class:cls||''})}
function fa(n){return new Intl.NumberFormat('fa-IR').format(n)}
function fmt(ms){try{return new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',dateStyle:'medium',timeStyle:'short'}).format(ms)}catch(e){return ''}}
function toast(msg,err){var t=$('#toast');t.textContent=msg;t.className='toast is-on'+(err?' is-error':'');clearTimeout(window.__t);window.__t=setTimeout(function(){t.className='toast'},6000)}
function api(path,body,raw){var init={};if(body!==undefined){init.method='POST';init.headers=raw?{}:{'Content-Type':'application/json'};init.body=raw?body:JSON.stringify(body)}return fetch(path,init).then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok)throw new Error(d.error||'خطای ارتباط');return d})})}
function act(fn){return function(){var b=this;if(b&&b.disabled!==undefined)b.disabled=true;Promise.resolve().then(fn).catch(function(e){toast(e.message,true)}).then(function(){if(b&&b.disabled!==undefined)b.disabled=false})}}
function field(id,label,value,type,hint){var input=type==='area'?el('textarea',{id:id}):el('input',{id:id,type:type||'text',value:value||''});if(type==='area')input.value=value||'';return el('label',{class:'field'},[el('span',{class:'lbl',text:label}),input,hint?el('span',{class:'hint',text:hint}):null])}
function check(id,label,on){var i=el('input',{type:'checkbox',id:id});i.checked=!!on;return el('label',{class:'check'},[i,el('span',{text:label})])}
function badge(t,tone){return el('span',{class:'badge'+(tone?' badge--'+tone:''),text:t})}
var path=location.pathname.split('/').filter(Boolean),slug=path[0]==='admin'?path[1]||'':'';
var TG='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.4 4.2 2.9 11.3c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.9.8.9.5 0 .7-.2 1-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8l3.1-14.6c.3-1.3-.5-1.9-1.4-1.5zM9.2 14.6l8.6-5.4c.4-.2.8-.1.5.2l-7.3 6.6-.3 3z"/></svg>';

(function boot(){api('/api/me').then(function(me){
 if(!me.owner){return login(me)}
 $('#logout').hidden=false;
 return slug?salonPage():home();
}).catch(function(e){$('#app').replaceChildren(el('div',{class:'loading',text:e.message}))})})();

function login(me){
 var box=el('section',{class:'card login'},[el('div',{class:'mirror'},[el('div',{class:'mirror__glass'},[el('span',{html:MARK})])]),h('h1','مدیریت آینه'),h('p','اینجا فقط برای مدیر آینه است. سالن‌ها با ربات تلگرام کار می‌کنند و مشتری‌ها از لینک اختصاصی سالن وارد می‌شوند.')]);
 if(me.passwordLogin){var f=field('pw','رمز مدیر','', 'password');var go=el('button',{class:'btn btn--primary btn--block',type:'button',text:'ورود',onclick:act(function(){return api('/api/login',{password:$('#pw').value}).then(function(){location.reload()})})});f.querySelector('input').addEventListener('keydown',function(e){if(e.key==='Enter')go.click()});box.append(f,go)}
 else box.append(el('p',{class:'notice notice--warn',text:'ورود با رمز روی این میزبان تنظیم نشده است (OWNER_PASSWORD و SESSION_SECRET).'}));
 $('#app').replaceChildren(box);
}

function botCard(bot){
 var st=function(ok,on,off){return el('li',{class:ok?'on':'off'},[h('span',ok?'✓':'–','dot'),h('span',ok?on:off)])};
 var c=el('section',{class:'card'},[h('h2','ربات تلگرام'),h('p','همهٔ سالن‌ها از یک ربات استفاده می‌کنند. یک بار تنظیمش کنید.','lead'),el('ul',{class:'status'},[
  st(bot.token,'توکن ربات تنظیم شده است.','TELEGRAM_BOT_TOKEN تنظیم نشده (از BotFather بگیرید).'),
  st(bot.secret,'رمز وبهوک تنظیم شده است.','TELEGRAM_WEBHOOK_SECRET تنظیم نشده.'),
  st(!!bot.username,'نام ربات: @'+bot.username,'TELEGRAM_BOT_USERNAME تنظیم نشده؛ لینک اتصال بدون آن ساخته نمی‌شود.')
 ])]);
 if(bot.token&&bot.secret)c.append(el('button',{class:'btn btn--ghost',type:'button',style:'margin-top:12px',text:'اتصال ربات به این سایت',onclick:act(function(){return api('/api/owner/webhook',{}).then(function(d){toast('ربات @'+d.bot+' به سایت وصل شد.')})})}));
 return c;
}

function home(){return api('/api/owner').then(function(d){
 var head=el('div',{class:'page-head'},[el('div',{},[h('h1','سالن‌ها'),h('p','هر سالن یک صفحهٔ مشتری دارد و درخواست‌ها را در تلگرام می‌گیرد.')])]);
 var list=el('div',{class:'salons'});
 d.salons.forEach(function(s){list.append(el('div',{class:'salon'},[el('div',{class:'grow'},[h('strong',s.name),h('small','/s/'+s.slug)]),badge(s.telegram?'تلگرام وصل':'تلگرام وصل نیست',s.telegram?'ok':'warn'),h('small',fa(s.portfolio)+' نمونه‌کار، '+fa(s.leads)+' درخواست'),el('a',{class:'btn btn--ghost btn--sm',href:'/s/'+s.slug,target:'_blank',rel:'noopener',text:'صفحهٔ مشتری'}),el('a',{class:'btn btn--primary btn--sm',href:'/admin/'+s.slug,text:'تنظیمات'})]))});
 if(!d.salons.length)list.append(h('p','هنوز سالنی نساخته‌اید.','empty-note'));
 var create=el('section',{class:'card'},[h('h2','سالن تازه'),field('name','نام سالن'),field('slug','نشانی انگلیسی صفحه','', 'text','مثل ayneh-saadatabad؛ صفحهٔ مشتری می‌شود /s/ayneh-saadatabad'),el('button',{class:'btn btn--primary',type:'button',text:'ساخت سالن',onclick:act(function(){return api('/api/salons',{name:$('#name').value,slug:$('#slug').value.trim()}).then(function(s){location.href='/admin/'+s.slug})})})]);
 $('#app').replaceChildren(head,el('div',{class:'grid grid--2'},[el('div',{class:'stack'},[list,create]),el('div',{class:'stack'},[botCard(d.bot),imageCard(d.image)])]));
})}
function imageCard(on){return el('section',{class:'card'},[h('h2','شبیه‌سازی تصویر'),el('ul',{class:'status'},[el('li',{class:on?'on':'off'},[h('span',on?'✓':'–','dot'),h('span',on?'کلید KIE تنظیم شده؛ مشتری‌ها می‌توانند مدل را روی عکس خودشان ببینند.':'KIE_API_KEY تنظیم نشده؛ مشتری فقط عکس و مدل را برای سالن می‌فرستد.')])])])}

function uploadBox(id,title,current,onDone){
 var input=el('input',{type:'file',accept:'image/jpeg,image/png,image/webp',id:id,class:'sr-only'});
 var img=el('span',{class:'uploadbox__img',html:current?'':'+'});if(current)img.append(el('img',{src:'/api/s/'+slug+'/media/'+current,alt:''}));
 var hint=h('small',current?'برای تعویض بزنید':'انتخاب عکس');
 var box=el('label',{class:'uploadbox',for:id},[img,el('span',{class:'uploadbox__txt'},[h('strong',title),hint]),input]);
 input.addEventListener('change',function(){var f=input.files&&input.files[0];if(!f)return;box.classList.add('is-busy');hint.textContent='در حال بارگذاری…';
  shrink(f).then(function(b){return api('/api/s/'+slug+'/upload?kind=brand',b,true)}).then(function(d){onDone(d.id);img.replaceChildren(el('img',{src:'/api/s/'+slug+'/media/'+d.id,alt:''}));hint.textContent='بارگذاری شد؛ «ذخیره» را بزنید'}).catch(function(e){toast(e.message,true);hint.textContent='دوباره امتحان کنید'}).then(function(){box.classList.remove('is-busy');input.value=''})});
 return box;
}
function shrink(file){return createImageBitmap(file).then(function(b){var c=document.createElement('canvas'),s=Math.min(1,1600/Math.max(b.width,b.height));c.width=Math.round(b.width*s);c.height=Math.round(b.height*s);c.getContext('2d').drawImage(b,0,0,c.width,c.height);b.close();return new Promise(function(r){c.toBlob(r,'image/jpeg',.85)})})}

function salonPage(){return api('/api/s/'+slug+'/owner').then(function(d){
 var S=d.salon,p=S.profile||{},images={logo:p.logo,cover:p.cover,portrait:p.portrait};
 document.title=S.name+' | مدیریت آینه';
 var head=el('div',{class:'page-head'},[el('div',{},[el('a',{class:'back',href:'/admin',text:'→ همهٔ سالن‌ها'}),h('h1',S.name),h('p','اطلاعاتی که اینجا وارد می‌کنید در بخش «دربارهٔ سالن» صفحهٔ مشتری دیده می‌شود.')]),el('a',{class:'btn btn--ghost',href:'/s/'+S.slug,target:'_blank',rel:'noopener',text:'دیدن صفحهٔ مشتری'})]);

 // Telegram
 var tg=el('section',{class:'card'},[h('h2','تلگرام سالن')]);
 tg.append(el('div',{class:'tg-state tg-state--'+(S.telegram?'on':'off')},[el('span',{html:TG}),el('div',{},[h('b',S.telegram?'وصل است':'هنوز وصل نیست'),h('span',S.telegram?'درخواست مشتری‌ها در پی‌وی ربات برای سالن می‌رود و هر عکسی که سالن برای ربات بفرستد نمونه‌کار می‌شود.':'تا وصل نشود، مشتری‌ها نمی‌توانند درخواست آنلاین بفرستند و فقط اطلاعات تماس سالن را می‌بینند.')])]));
 var linkOut=el('div');
 if(d.bot.token&&d.bot.username)tg.append(el('button',{class:'btn btn--primary',type:'button',text:S.telegram?'وصل‌کردن یک گفتگوی دیگر':'ساخت لینک اتصال',onclick:act(function(){return api('/api/s/'+slug+'/owner/telegram-link',{}).then(function(r){linkOut.replaceChildren(el('div',{class:'linkbox'},[el('code',{text:r.link}),el('button',{class:'btn btn--soft btn--sm',type:'button',text:'کپی',onclick:function(){navigator.clipboard&&navigator.clipboard.writeText(r.link).then(function(){toast('لینک کپی شد.')})}})]),el('p',{class:'tiny muted',style:'margin-top:8px',text:'این لینک را برای آرایشگاه بفرستید. با باز کردنش در تلگرام و زدن «Start»، گفتگو به این سالن وصل می‌شود. یک‌بار مصرف است و ۷ روز اعتبار دارد.'}))})})}));
 else tg.append(el('p',{class:'notice notice--warn',text:'اول ربات را در صفحهٔ «همهٔ سالن‌ها» تنظیم کنید.'}));
 tg.append(linkOut);
 if(S.telegram)tg.append(el('button',{class:'btn btn--danger btn--sm',type:'button',style:'margin-top:12px',text:'قطع اتصال',onclick:act(function(){if(!confirm('اتصال تلگرام این سالن قطع شود؟'))return;return api('/api/s/'+slug+'/owner/telegram-unlink',{}).then(salonPage)})}));

 // Profile
 var prof=el('section',{class:'card'},[h('h2','دربارهٔ سالن'),h('p','همهٔ این‌ها اختیاری است جز نام.','lead'),
  el('div',{class:'uploads'},[uploadBox('up-logo','لوگو',p.logo,function(id){images.logo=id}),uploadBox('up-cover','عکس کاور',p.cover,function(id){images.cover=id}),uploadBox('up-portrait','عکس مدیر',p.portrait,function(id){images.portrait=id})]),
  field('f-name','نام سالن',S.name),field('f-bio','معرفی کوتاه',p.bio,'area'),
  el('div',{class:'two'},[field('f-manager','نام مدیر یا آرایشگر',p.manager),field('f-hours','ساعات کاری',p.hours,'text','مثل شنبه تا پنج‌شنبه ۱۰ تا ۲۰'),field('f-phone','شمارهٔ تماس',p.phone?p.phone.replace(/^\+98/,'0'):'','tel'),field('f-address','آدرس',p.address)]),
  el('div',{class:'two'},[field('f-map','لینک نقشه',p.map,'url'),field('f-instagram','لینک اینستاگرام',p.instagram,'url'),field('f-telegram','لینک کانال یا آیدی تلگرام',p.telegram,'url'),field('f-website','وب‌سایت',p.website,'url')]),
  el('button',{class:'btn btn--primary',type:'button',text:'ذخیره',onclick:act(function(){var out={};['bio','manager','hours','phone','address','map','instagram','telegram','website'].forEach(function(k){out[k]=$('#f-'+k).value.trim()});if(out.telegram&&!/^https?:/.test(out.telegram))out.telegram='https://t.me/'+out.telegram.replace(/^@/,'');if(out.instagram&&!/^https?:/.test(out.instagram))out.instagram='https://instagram.com/'+out.instagram.replace(/^@/,'');Object.assign(out,images);return api('/api/s/'+slug+'/owner/profile',{name:$('#f-name').value,profile:out}).then(function(){toast('ذخیره شد.')})})})]);

 // Settings
 var set=el('section',{class:'card'},[h('h2','شبیه‌سازی'),check('s-gen','مشتری بتواند مدل را روی عکس خودش ببیند'+(d.image?'':' (کلید KIE هنوز تنظیم نشده)'),S.settings.generation_enabled),check('s-ref','انتقال از «عکس مدل من» و نمونه‌کارها آزمایش شده و کیفیتش تأیید شده است',S.settings.reference_verified),el('button',{class:'btn btn--ghost',type:'button',text:'ذخیرهٔ تنظیمات',onclick:act(function(){return api('/api/s/'+slug+'/owner/settings',{generation_enabled:$('#s-gen').checked,reference_verified:$('#s-ref').checked}).then(function(){toast('تنظیمات ذخیره شد.')})})})]);

 // Portfolio
 var ports=el('div',{class:'ports'});
 d.portfolio.forEach(function(it){var ids=[];try{ids=JSON.parse(it.images)}catch(e){}ports.append(el('div',{class:'port'},[ids[0]?el('img',{src:'/api/s/'+slug+'/media/'+ids[0],alt:'',loading:'lazy'}):null,h('b',it.title),el('button',{class:'btn btn--danger btn--sm',type:'button',text:'حذف',onclick:act(function(){if(!confirm('«'+it.title+'» از صفحهٔ سالن حذف شود؟'))return;return api('/api/s/'+slug+'/owner/portfolio/delete',{id:it.id}).then(salonPage)})})]))});
 var port=el('section',{class:'card'},[h('h2','نمونه‌کارها'),h('p','سالن عکس را برای ربات تلگرام می‌فرستد و همان لحظه اینجا و روی صفحهٔ مشتری می‌نشیند.','lead'),d.portfolio.length?ports:h('p','هنوز نمونه‌کاری نیامده.','empty-note')]);

 // Delivery log
 var tone={sent:'ok',queued:'',sending:'accent',retry:'warn',failed:'danger'},label={sent:'به تلگرام رسید',queued:'در صف',sending:'در حال ارسال',retry:'تلاش دوباره',failed:'ناموفق'};
 var log=el('div',{class:'log'});
 d.leads.forEach(function(l){log.append(el('div',{class:'log__row'},[el('div',{class:'grow'},[h('b',l.name),el('br'),h('small',(l.look?l.look+'، ':'')+fmt(l.created_at))]),badge(label[l.status]||l.status,tone[l.status]),l.status==='failed'?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'ارسال دوباره',onclick:act(function(){return api('/api/s/'+slug+'/owner/leads/retry',{id:l.id}).then(salonPage)})}):null]))});
 var leads=el('section',{class:'card'},[h('h2','درخواست‌های فرستاده‌شده'),h('p','فقط وضعیت ارسال؛ عکس‌ها و شمارهٔ مشتری در تلگرام سالن است. سوابق بعد از ۳۰ روز پاک می‌شوند.','lead'),d.leads.length?log:h('p','هنوز درخواستی نیامده.','empty-note')]);

 $('#app').replaceChildren(head,el('div',{class:'grid grid--2'},[el('div',{class:'stack'},[prof,port]),el('div',{class:'stack'},[tg,set,leads])]));
})}
$('#logout').addEventListener('click',function(){api('/api/logout',{}).then(function(){location.href='/'})});
`;

export const appHTML=String.raw`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#e8edeb"><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/vazirmatn-arabic.woff2" as="font" type="font/woff2" crossorigin><title>آینه | مدیریت سالن‌ها</title><style>__CSS__</style></head><body>
<a class="skip" href="#app">پرش به محتوای اصلی</a>
<header class="appbar"><a href="/admin" class="appbar__brand">__MARKHTML__<span>آینه</span></a><button class="btn btn--ghost btn--sm" id="logout" type="button" hidden>خروج</button></header>
<main id="app"><div class="loading">در حال باز کردن…</div></main>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<footer class="foot">آینه: شبیه‌سازی پیشنهادی برای مشاورهٔ مو.</footer>
<script>__JS__</script>
</body></html>`
 .replace('__CSS__',()=>baseCSS+css)
 .replace('__MARKHTML__',()=>markSVG)
 .replace('__JS__',()=>clientJS.replace('__MARK__',()=>JSON.stringify(markSVG)));
