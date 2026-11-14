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
.pn-credit{display:grid;gap:4px}
.pn-credit b{font-size:30px;font-weight:900;color:var(--ink);line-height:1.2}
.pn-credit.is-low b{color:#B4553C}
.pn-packs{display:flex;flex-wrap:wrap;gap:8px}
.pn-packs .btn{min-height:44px}
.pn-note{font-size:12.5px;color:var(--muted)}
.pn [hidden]{display:none!important}
.pn-tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:0 0 14px;padding:4px;border-radius:16px;background:var(--surface);border:1px solid var(--line-2)}
.pn-tabs::-webkit-scrollbar{display:none}
.pn-tab{flex:0 0 auto;min-height:44px;padding:0 16px;border:0;border-radius:12px;background:transparent;font:inherit;font-size:14px;font-weight:700;color:var(--ink-2);cursor:pointer;display:inline-flex;align-items:center;gap:6px}
.pn-tab[aria-selected="true"]{background:#0b3b32;color:#fff}
.pn-tab .lock{font-size:12px;opacity:.7}
.pn-list{display:grid;gap:10px}
.pn-item{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;padding:12px;border:1px solid var(--line-2);border-radius:14px;background:#fff}
.pn-item img{width:72px;height:90px;object-fit:cover;border-radius:10px;background:#efe5da}
.pn-item b{font-size:15px}
.pn-item .meta{font-size:12.5px;color:var(--muted);line-height:1.8}
.pn-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
.pn-acts .btn{min-height:40px;font-size:13px}
.pn-acts .btn[aria-pressed="true"]{background:#0b3b32;color:#fff;border-color:#0b3b32}
.pn-badge{display:inline-flex;align-items:center;min-height:24px;padding:0 9px;border-radius:99px;background:#e4f4ee;color:#0a6b54;font-size:12px;font-weight:800}
.pn-days{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}
.pn-days::-webkit-scrollbar{display:none}
.pn-day{flex:0 0 auto;min-width:76px;min-height:52px;border:1px solid var(--line-2);border-radius:12px;background:#fff;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;line-height:1.5}
.pn-day[aria-pressed="true"]{background:#0b3b32;color:#fff;border-color:#0b3b32}
.pn-form{display:grid;gap:10px;padding:12px;border-radius:14px;background:#f6efe7}
.pn-form label{display:grid;gap:5px;font-size:13px;font-weight:700}
.pn-form input,.pn-form select,.pn-form textarea{min-height:44px;border:1px solid #d9c7b2;border-radius:11px;padding:0 12px;font:inherit;background:#fff}
.pn-form textarea{min-height:90px;padding:10px 12px}
.pn-row{display:flex;gap:8px;flex-wrap:wrap;align-items:end}
.pn-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
.pn-kpi{padding:12px;border-radius:14px;background:#fff;border:1px solid var(--line-2);display:grid;gap:2px}
.pn-kpi b{font-size:24px;font-weight:900;color:var(--ink)}
.pn-kpi span{font-size:12.5px;color:var(--muted)}
.pn-bars{display:grid;gap:6px}
.pn-barrow{display:grid;grid-template-columns:minmax(90px,34%) 1fr auto;gap:8px;align-items:center;font-size:13px}
.pn-barrow i{display:block;height:10px;border-radius:99px;background:#068f6c}
.pn-locked{display:grid;gap:10px;justify-items:start;padding:22px;border:1px dashed #c9b49c;border-radius:18px;background:#fbf6f0}
.pn-locked b{font-size:16px}
.pn-search{display:flex;gap:8px}
.pn-search input{flex:1;min-height:44px;border:1px solid #d9c7b2;border-radius:11px;padding:0 12px;font:inherit}
@media(max-width:520px){.pn-item{grid-template-columns:60px minmax(0,1fr)}.pn-item img{width:60px;height:76px}}
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
/* Plan and image credits: what is left, until when, and buying more through the same checkout. */
function creditCard(d){
 var c=d.credits;
 if(!c)return el('div',{class:'pn-card'},[h('h2','اعتبار تصویر'),h('p','این سالن پلن فعالی ندارد؛ تصویرها محدودیت اعتباری ندارند.')]);
 var low=c.left<=Math.max(3,Math.round(c.granted*.1));
 var err=el('p',{class:'notice notice--warn',hidden:true});
 var buy=function(packs){return el('button',{class:'btn btn--primary btn--sm',type:'button',text:fa(packs*d.topup.images)+' عکس · '+fa(packs*d.topup.amount)+' تومان',onclick:function(e){
  e.target.disabled=true;err.hidden=true;
  api('/api/panel/topup',{packs:packs}).then(function(o){location.href='/pay?order='+encodeURIComponent(o.id)}).catch(function(x){err.textContent=x.message;err.hidden=false;e.target.disabled=false});
 }})};
 return el('div',{class:'pn-card'},[
  h('h2','پلن '+d.plan+' و اعتبار تصویر'),
  el('div',{class:'pn-credit'+(low?' is-low':'')},[h('span','عکس باقی‌مانده','pn-who'),h('b',fa(c.left)+' از '+fa(c.granted)),h('span',fa(c.used)+' عکس ساخته شده؛ عکس‌های ناموفق حساب نمی‌شوند.','pn-who')]),
  h('p',c.expired?'مهلت پلن تمام شده و ساخت تصویر متوقف است؛ برای تمدید با پشتیبانی آینه تماس بگیرید یا از صفحهٔ خدمت خود پلن تازه بخرید.':'پلن تا '+fmt(c.until)+' فعال است ('+fa(c.days_left)+' روز مانده).'),
  h('p','خرید اعتبار بیشتر: هر '+fa(d.topup.images)+' عکس '+fa(d.topup.amount)+' تومان.','pn-note'),
  el('div',{class:'pn-packs'},[buy(1),buy(2),buy(5)]),
  err
 ]);
}

var LINE={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
var STATUS_LABEL={called:'📞 تماس گرفتم',booked:'✅ نوبت دادم',declined:'🚫 قابل اجرا نیست'};
var STATUS_TEXT={new:'تازه',called:'تماس گرفته شد',booked:'نوبت داده شد',declined:'قابل اجرا نبود'};
var has=function(d,f){return (d.features||[]).indexOf(f)>=0};
function locked(d,f,title,why){
 return el('div',{class:'pn-locked'},[h('b',title),h('p',why),h('span','این بخش در پلن '+d.opened_by[f]+' و بالاتر باز است.','pn-badge'),el('a',{class:'btn btn--primary btn--sm',href:'/'+(d.service||'hair')+'#services',text:'دیدن پلن‌ها'})]);
}
/* Persian day chips for the next 14 days and a 24-hour time: Tehran midnight + hh:mm. */
var DAY=86400000,TEH=12600000;
function tehranMidnight(k){return Math.floor((Date.now()+TEH)/DAY)*DAY-TEH+k*DAY}
function dayChips(onPick){
 var box=el('div',{class:'pn-days',role:'group','aria-label':'روز نوبت'}),chosen=0,btns=[];
 for(var k=0;k<14;k++)(function(k){var t=tehranMidnight(k)+12*3600000;
  var label=k===0?'امروز':k===1?'فردا':new Intl.DateTimeFormat('fa-IR',{weekday:'long',timeZone:'Asia/Tehran'}).format(t);
  var b=el('button',{class:'pn-day',type:'button','aria-pressed':String(k===0),onclick:function(){chosen=k;btns.forEach(function(x,i){x.setAttribute('aria-pressed',String(i===k))});onPick&&onPick(k)}},[label,el('br'),new Intl.DateTimeFormat('fa-IR',{day:'numeric',month:'short',timeZone:'Asia/Tehran'}).format(t)]);
  btns.push(b);box.append(b)})(k);
 return {box:box,day:function(){return chosen}};
}
function bookingForm(d,lead,done){
 var days=dayChips(),time=el('input',{type:'time',value:'16:00',step:'900','aria-label':'ساعت'});
 var name=lead?null:el('input',{placeholder:'نام مشتری','aria-label':'نام مشتری'}),tel=lead?null:el('input',{placeholder:'موبایل (اختیاری)',inputmode:'tel',dir:'ltr','aria-label':'موبایل مشتری'});
 var dur=el('select',{'aria-label':'مدت'},[30,60,90,120,180].map(function(m){return el('option',{value:String(m),text:fa(m)+' دقیقه',selected:m===60})}));
 var note=el('input',{placeholder:'یادداشت (اختیاری)','aria-label':'یادداشت'}),err=el('p',{class:'notice notice--warn',hidden:true});
 var save=el('button',{class:'btn btn--primary',type:'button',text:'ثبت نوبت',onclick:function(){
  var hm=(time.value||'16:00').split(':');var at=tehranMidnight(days.day())+Number(hm[0])*3600000+Number(hm[1]||0)*60000;
  save.disabled=true;err.hidden=true;
  api('/api/panel/bookings',{lead_id:lead?lead.id:undefined,name:name?name.value:undefined,phone:tel?tel.value:undefined,starts_at:at,duration_min:Number(dur.value),note:note.value}).then(function(r){
   done&&done(r);
  }).catch(function(x){err.textContent=x.message;err.hidden=false;save.disabled=false});
 }});
 return el('div',{class:'pn-form'},[h('b',lead?'نوبت برای '+lead.name:'نوبت تازه'),days.box,el('div',{class:'pn-row'},[name?el('label',{},['نام',name]):null,tel?el('label',{},['موبایل',tel]):null,el('label',{},['ساعت',time]),el('label',{},['مدت',dur])]),el('label',{},['یادداشت',note]),save,err]);
}
function requestsTab(d,box){
 var page=0;
 function load(){
  box.replaceChildren(h('p','در حال بارگذاری…','pn-who'));
  api('/api/panel/requests?page='+page).then(function(r){
   if(!r.requests.length){box.replaceChildren(h('p','هنوز درخواستی نیامده؛ لینک صفحه را برای مشتری‌ها بفرستید.'));return}
   var list=el('div',{class:'pn-list'});
   r.requests.forEach(function(l){
    var img=l.preview_id||l.original_id;
    var acts=el('div',{class:'pn-acts'});
    ['called','booked','declined'].forEach(function(st){acts.append(el('button',{class:'btn btn--ghost btn--sm',type:'button','aria-pressed':String(l.salon_status===st),text:STATUS_LABEL[st],onclick:function(){
     api('/api/panel/requests/'+l.id+'/status',{status:st}).then(function(x){l.salon_status=st;load()}).catch(function(x){alert(x.message)});
    }}))});
    var slot=el('div');
    if(has(d,'booking'))acts.append(el('button',{class:'btn btn--primary btn--sm',type:'button',text:l.booking_at?'📅 '+fmt(l.booking_at):'📅 ثبت نوبت',onclick:function(){slot.replaceChildren(bookingForm(d,l,function(){load()}))}}));
    list.append(el('div',{class:'pn-item'},[
     img?el('img',{src:'/api/panel/media/'+img,alt:'عکس درخواست '+l.name,loading:'lazy'}):el('span'),
     el('div',{},[
      el('div',{style:'display:flex;gap:8px;align-items:center;flex-wrap:wrap'},[h('b',l.name),h('span',STATUS_TEXT[l.salon_status]||'تازه','pn-badge')]),
      h('div',[LINE[l.line]||'',l.look,l.color].filter(Boolean).join(' · '),'meta'),
      el('div',{class:'meta'},[el('a',{href:'tel:'+String(l.phone).replace(/^\+98/,'0'),dir:'ltr',text:String(l.phone).replace(/^\+98/,'0')}),' · '+fmt(l.created_at)+(l.following?' · مشتری پیگیر است':'')]),
      l.note?h('div',l.note,'meta'):null,
      acts,slot
     ])
    ]));
   });
   var nav=el('div',{class:'pn-row'},[page>0?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'قبلی',onclick:function(){page--;load()}}):null,r.more?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'بعدی',onclick:function(){page++;load()}}):null]);
   box.replaceChildren(list,nav);
  }).catch(function(x){box.replaceChildren(el('p',{class:'notice notice--warn',text:x.message}))});
 }
 load();
}
function bookingsTab(d,box){
 if(!has(d,'booking'))return box.replaceChildren(locked(d,'booking','نوبت‌دهی و پیگیری','روز و ساعت نوبت هر مشتری را ثبت کنید؛ مشتری در تلگرام یا بله تأیید و یک روز قبل یادآوری می‌گیرد.'));
 function load(){
  api('/api/panel/bookings').then(function(r){
   var list=el('div',{class:'pn-list'});
   if(!r.bookings.length)list.append(h('p','نوبت پیش‌رویی ثبت نشده است.'));
   r.bookings.forEach(function(b){
    var acts=el('div',{class:'pn-acts'});
    if(b.status==='scheduled'){
     acts.append(el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'انجام شد',onclick:function(){act(b,'done')}}));
     acts.append(el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'نیامد',onclick:function(){act(b,'no_show')}}));
     acts.append(el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'لغو',onclick:function(){if(confirm('نوبت لغو شود؟'))act(b,'cancel')}}));
    }
    list.append(el('div',{class:'pn-item',style:'grid-template-columns:minmax(0,1fr)'},[el('div',{},[
     el('div',{style:'display:flex;gap:8px;align-items:center;flex-wrap:wrap'},[h('b',b.customer_name),h('span',{scheduled:'فعال',done:'انجام شد',no_show:'نیامد'}[b.status]||b.status,'pn-badge')]),
     h('div','📅 '+b.when+' · '+fa(b.duration_min)+' دقیقه'+(b.staff_name?' · '+b.staff_name:''),'meta'),
     b.phone?el('div',{class:'meta'},[el('a',{href:'tel:'+String(b.phone).replace(/^\+98/,'0'),dir:'ltr',text:String(b.phone).replace(/^\+98/,'0')})]):null,
     b.note?h('div',b.note,'meta'):null,acts])]));
   });
   var slot=el('div');
   box.replaceChildren(el('div',{class:'pn-row'},[el('button',{class:'btn btn--primary btn--sm',type:'button',text:'+ نوبت تازه',onclick:function(){slot.replaceChildren(bookingForm(d,null,load))}})]),slot,list);
  }).catch(function(x){box.replaceChildren(el('p',{class:'notice notice--warn',text:x.message}))});
 }
 function act(b,a){api('/api/panel/bookings/'+b.id,{action:a}).then(load).catch(function(x){alert(x.message)})}
 load();
}
function kpi(n,label,prev){return el('div',{class:'pn-kpi'},[h('b',fa(n)),h('span',label+(prev!=null?' · دورهٔ قبل '+fa(prev):''))])}
function bars(rows,label,value){var max=Math.max.apply(null,[1].concat(rows.map(value)));return el('div',{class:'pn-bars'},rows.map(function(r){return el('div',{class:'pn-barrow'},[h('span',label(r)),el('i',{style:'width:'+Math.max(4,Math.round(value(r)/max*100))+'%'}),h('b',fa(value(r)))])}))}
function reportTab(d,box){
 if(!has(d,'report_simple'))return box.replaceChildren(locked(d,'report_simple','گزارش عملکرد','بازدید، امتحان روی عکس، درخواست و نوبت‌های ماه را با ماه قبل مقایسه کنید.'));
 api('/api/panel/report').then(function(r){
  var c=r.current,p=r.previous;
  var parts=[h('h2','گزارش ۳۰ روز اخیر'),el('div',{class:'pn-kpis'},[kpi(c.visitors,'بازدید صفحه'),kpi(c.tries,'امتحان روی عکس'),kpi(c.requests,'درخواست',p.requests),kpi(c.booked,'نوبت داده شد',p.booked),kpi(c.bookings,'نوبت ثبت‌شده',p.bookings),kpi(c.visits,'مراجعهٔ انجام‌شده',p.visits)])];
  if(r.level==='full'){
   parts.push(el('div',{class:'pn-kpis'},[kpi(r.conversion,'٪ تبدیل درخواست به نوبت'),r.response_minutes!=null?kpi(r.response_minutes,'دقیقه، میانهٔ زمان پاسخ'):null]));
   if(r.funnel.length)parts.push(h('h2','مسیر مشتری'),bars(r.funnel,function(x){return x.label},function(x){return x.count}));
   if(r.looks.length)parts.push(h('h2','پرطرفدارترین مدل‌ها'),bars(r.looks,function(x){return x.label},function(x){return x.count}));
   if(r.colors&&r.colors.length)parts.push(h('h2','پرطرفدارترین رنگ‌ها'),bars(r.colors,function(x){return x.label},function(x){return x.count||x.n||0}));
   if(r.staff.length)parts.push(h('h2','عملکرد هر نفر'),bars(r.staff,function(x){return x.name},function(x){return x.requests}));
  }else parts.push(el('p',{class:'pn-note',text:'نمودارها، پرطرفدارترین مدل‌ها و عملکرد هر نفر در پلن SIGNATURE.'}));
  box.replaceChildren.apply(box,parts);
 }).catch(function(x){box.replaceChildren(el('p',{class:'notice notice--warn',text:x.message}))});
}
function customersTab(d,box){
 if(!has(d,'archive'))return box.replaceChildren(locked(d,'archive','آرشیو مشتریان','همهٔ مشتری‌ها با شماره، مدل‌ها و رنگ‌های انتخابی، نوبت‌ها و مراجعه‌ها؛ با جستجو و خروجی اکسل.'));
 var q=el('input',{type:'search',placeholder:'جستجوی نام یا موبایل','aria-label':'جستجوی مشتری'}),list=el('div',{class:'pn-list'}),page=0;
 function load(){
  api('/api/panel/customers?q='+encodeURIComponent(q.value)+'&page='+page).then(function(r){
   list.replaceChildren();
   if(!r.customers.length)list.append(h('p','مشتری‌ای پیدا نشد.'));
   r.customers.forEach(function(c){list.append(el('div',{class:'pn-item'},[
    c.last_preview?el('img',{src:'/api/panel/media/'+c.last_preview,alt:'آخرین انتخاب '+c.name,loading:'lazy'}):el('span'),
    el('div',{},[h('b',c.name||'—'),el('div',{class:'meta'},[el('a',{href:'tel:'+c.phone,dir:'ltr',text:c.phone})]),
     h('div',fa(c.requests)+' درخواست · '+fa(c.booked)+' نوبت · '+fa(c.visits)+' مراجعه','meta'),
     h('div',(c.lines||'').split(',').map(function(x){return LINE[x]||x}).join('، ')+(c.last_choice?' · '+c.last_choice:''),'meta'),
     h('div','آخرین درخواست: '+fmt(c.last_at),'meta')])]))});
   if(r.more||page>0)list.append(el('div',{class:'pn-row'},[page>0?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'قبلی',onclick:function(){page--;load()}}):null,r.more?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'بعدی',onclick:function(){page++;load()}}):null]));
  }).catch(function(x){list.replaceChildren(el('p',{class:'notice notice--warn',text:x.message}))});
 }
 var t=0;q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){page=0;load()},300)});
 box.replaceChildren(el('div',{class:'pn-search'},[q,el('a',{class:'btn btn--ghost btn--sm',href:'/api/panel/customers.csv',download:'ayneh-customers.csv',text:'خروجی اکسل'})]),list);
 load();
}
function supportTab(d,box){
 if(!has(d,'priority_support'))return box.replaceChildren(locked(d,'priority_support','پشتیبانی ویژه','پیام شما مستقیم و در اولویت به تیم آینه می‌رسد.'));
 var topic=el('input',{placeholder:'موضوع','aria-label':'موضوع'}),msg=el('textarea',{placeholder:'پیام شما','aria-label':'پیام پشتیبانی',maxlength:'1000'}),out=el('p',{class:'pn-note',hidden:true});
 var send=el('button',{class:'btn btn--primary',type:'button',text:'ارسال به پشتیبانی',onclick:function(){send.disabled=true;api('/api/panel/support',{topic:topic.value,message:msg.value}).then(function(){out.textContent='پیام شما رسید؛ به‌زودی با شما تماس می‌گیریم.';out.hidden=false;msg.value=''}).catch(function(x){out.textContent=x.message;out.hidden=false}).then(function(){send.disabled=false})}});
 box.replaceChildren(h('p','پشتیبانی ویژهٔ SIGNATURE: پیام شما در اولویت به تیم آینه می‌رسد. برای کار فوری تماس بگیرید: ۰۹۱۰۵۶۴۷۴۹۷'),el('div',{class:'pn-form'},[el('label',{},['موضوع',topic]),el('label',{},['پیام',msg]),send,out]));
}
function botCard(d){
 if(!has(d,'bot'))return locked(d,'bot','اتصال ربات تلگرام یا بله','درخواست‌ها و نمونه‌کارها را مستقیم در پیام‌رسان بگیرید و بفرستید.');
 var out=el('div',{class:'pn-acts'});
 return el('div',{class:'pn-card'},[h('h2','اتصال ربات'),h('p',d.bot_linked?'ربات وصل است؛ درخواست‌ها در پیام‌رسان هم می‌رسند.':'با یکی از لینک‌های زیر، ربات آینه را در تلگرام یا بله باز کنید و «شروع» را بزنید.'),
  el('button',{class:'btn btn--primary btn--sm',type:'button',text:d.bot_linked?'لینک تازه برای دستگاه دیگر':'ساخت لینک اتصال',onclick:function(e){e.target.disabled=true;api('/api/panel/bot-link',{}).then(function(r){out.replaceChildren.apply(out,Object.keys(r.links).map(function(k){return el('a',{class:'btn btn--ghost btn--sm',href:r.links[k],target:'_blank',rel:'noopener',text:k==='bale'?'باز کردن در بله':'باز کردن در تلگرام'})}))}).catch(function(x){out.replaceChildren(h('p',x.message,'pn-note'))}).then(function(){e.target.disabled=false})}}),out]);
}
function dash(d){
 var copy=function(){
  var code=$('#pnLink').textContent;
  if(navigator.clipboard)navigator.clipboard.writeText(code).then(function(){$('#pnCopy').textContent='کپی شد';setTimeout(function(){$('#pnCopy').textContent='کپی'},1600)});
 };
 var home=el('div',{class:'pn-grid'},[
   creditCard(d),
   botCard(d),
   el('div',{class:'pn-card'},[
    h('h2','راه‌اندازی'),
    h('p',fa(d.setup.done)+' از '+fa(d.setup.total)+' قدم انجام شده.'),
    el('div',{class:'pn-progress'},[el('span',{style:'width:'+Math.round(d.setup.done/d.setup.total*100)+'%'})]),
    el('ul',{class:'pn-steps'},d.setup.steps.map(stepRow))
   ]),
   el('div',{class:'pn-card'},[
    h('h2','نمونه‌کارها'),
    d.portfolio.length?el('div',{style:'display:grid;gap:6px'},d.portfolio.map(function(p){return el('div',{class:'pn-who',text:p.title+' · '+(LINE[p.line]||p.line)})})):h('p','هنوز نمونه‌کاری نیست. '+(has(d,'bot')?'عکس‌ها را به ربات تلگرام یا بله بفرستید تا همین‌جا بنشینند.':'برای افزودن نمونه‌کار با پشتیبانی آینه هماهنگ کنید.'))
   ])
  ]);
 var TABS=[['home','خانه',null],['requests','درخواست‌ها','inbox'],['bookings','نوبت‌ها','booking'],['report','گزارش','report_simple'],['customers','مشتریان','archive'],['support','پشتیبانی','priority_support']];
 var body=el('div',{}),tabs=el('div',{class:'pn-tabs',role:'tablist','aria-label':'بخش‌های پنل'});
 function show(key){
  [].forEach.call(tabs.children,function(t){t.setAttribute('aria-selected',String(t.dataset.key===key))});
  if(key==='home')body.replaceChildren(home);
  else{var box=el('div',{class:'pn-card'});body.replaceChildren(box);
   ({requests:requestsTab,bookings:bookingsTab,report:reportTab,customers:customersTab,support:supportTab})[key](d,box)}
  try{history.replaceState(null,'','#'+key)}catch(e){}
 }
 TABS.forEach(function(t){tabs.append(el('button',{class:'pn-tab',role:'tab',type:'button','data-key':t[0],'aria-selected':'false',onclick:function(){show(t[0])}},[t[1],t[2]&&!has(d,t[2])?el('span',{class:'lock','aria-label':'قفل',text:'🔒'}):null]))});
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
  tabs,body
 ]));
 var start=(location.hash||'').slice(1);show(TABS.some(function(t){return t[0]===start})?start:'home');
 /* A link like /panel#requests (from a bot message or a bookmark) opens that tab, also on the open page. */
 addEventListener('hashchange',function(){var k=(location.hash||'').slice(1);if(TABS.some(function(t){return t[0]===k}))show(k)});
}
`;

const boot = String.raw`
(function(){
 /* The checkout hands the key over in the query string so the last step is one tap, not
    "copy this, go there, paste it". It is traded for the cookie here, then scrubbed from
    the address bar so it does not survive in history or in a shared screenshot. */
 var fromUrl=(location.search.match(/[?&]key=([^&]+)/)||[])[1];
 fromUrl=fromUrl?decodeURIComponent(fromUrl.replace(/\+/g,' ')).trim().toUpperCase():'';
 function enter(){
  api('/api/panel/login',{key:fromUrl}).then(function(){
   try{localStorage.removeItem('ayneh-order')}catch(e){}
   try{history.replaceState(null,'',location.pathname)}catch(e){}
   location.replace('/panel');
  }).catch(function(){
   try{history.replaceState(null,'',location.pathname)}catch(e){}
   gate('این کلید پذیرفته نشد؛ کلید را دستی وارد کنید.');
  });
 }
 api('/api/panel/me').then(function(d){
  if(d.salon)return dash(d);
  if(fromUrl)return enter();
  gate('');
 }).catch(function(e){gate('')});
})();
`;

export const panelHTML = String.raw`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#fcf3eb"><meta name="robots" content="noindex"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>پنل سالن | آینه</title><style>__CSS__</style></head><body class="admin-body"><main id="app"><div class="pn" style="padding:40px 16px;color:#6B7A78">در حال باز کردن…</div></main><script>__JS__</script></body></html>`
  .replace('__CSS__', () => baseCSS + css)
  .replace('__JS__', () => `var MARK=${JSON.stringify(markSVG)};` + lib + gate + dash + boot);
