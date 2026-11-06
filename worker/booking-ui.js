// Customer side of booking, injected by worker/edition-entry.js into the specialist editions' page only
// (never into the main app). It runs after the page script and reuses its helpers (el, api, openSheet,
// openOtp, ensureSession…). /s/<slug>/book shows only the booking flow; /s/<slug> gets a «رزرو نوبت»
// button at the top and the booking status card. No photo, simulation or image quota is involved.
export const bookingCSS=String.raw`
.bk-cta-wrap{display:grid;gap:6px;margin-top:10px}
.bk-cta{gap:8px}
.bk-cta__hint{font-size:12.5px;color:var(--muted);text-align:center}
.bk-panel{display:block}
.bk-panel .flow__head{margin-bottom:4px}
#bookcard{scroll-margin-top:96px}
.bk-label{font-size:13px;font-weight:700;color:var(--ink-2);margin:16px 0 8px}
.bk-days{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 10px;margin:0 -2px;scroll-snap-type:x proximity;scrollbar-width:none;-webkit-overflow-scrolling:touch}
.bk-days::-webkit-scrollbar{display:none}
.bk-day{flex:none;min-width:70px;min-height:64px;display:grid;place-items:center;gap:2px;padding:8px 6px;border:1px solid var(--line);border-radius:16px;background:var(--surface);color:var(--ink);font:inherit;cursor:pointer;scroll-snap-align:start;transition:background-color .14s var(--ease),border-color .14s var(--ease)}
.bk-day b{font-size:13px;font-weight:700}
.bk-day span{font-size:12px;color:var(--muted)}
.bk-day.is-on{border-color:var(--accent);background:var(--accent-soft);box-shadow:0 0 0 3px var(--accent-ring)}
.bk-day:disabled{cursor:not-allowed;background:var(--glass);opacity:.55}
.bk-day:disabled b,.bk-day:disabled span{text-decoration:line-through}
.bk-day small{font-size:10.5px;color:var(--muted)}
.bk-services{display:flex;flex-wrap:wrap;gap:8px}
.bk-services .chip{min-height:44px}
.bk-services .chip.is-on{border-color:var(--accent);background:var(--accent-soft);color:var(--accent-ink)}
.bk-group{font-size:13px;color:var(--muted);margin:14px 0 8px;display:flex;align-items:center;gap:8px}
.bk-group::after{content:"";flex:1;height:1px;background:var(--line)}
.bk-slots{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.bk-slot{min-height:48px;border:1px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font:700 15px/1 var(--text);cursor:pointer;font-variant-numeric:tabular-nums}
.bk-slot.is-on{border:2px solid var(--accent);background:var(--accent-soft);color:var(--accent-ink);box-shadow:0 0 0 3px var(--accent-ring)}
.bk-slot:disabled{cursor:not-allowed;background:var(--glass);color:var(--muted);text-decoration:line-through;opacity:.6}
.bk-empty{font-size:13.5px;color:var(--muted);padding:14px 0}
.bk-go{margin-top:18px}
.bk-go .btn{width:100%}
.bk-sum{display:grid;gap:0;margin:14px 0 0;border:1px solid var(--line);border-radius:var(--r);background:var(--surface);overflow:hidden}
.bk-sum__row{display:flex;gap:12px;align-items:center;padding:12px 14px;border-top:1px solid var(--line)}
.bk-sum__row:first-child{border-top:0}
.bk-sum__row .ico{width:22px;height:22px;flex:none;color:var(--accent)}
.bk-sum__row .ico svg{width:100%;height:100%}
.bk-sum__row div{display:grid;gap:2px;min-width:0}
.bk-sum__row small{font-size:12px;color:var(--muted)}
.bk-sum__row b{font-size:14.5px;overflow-wrap:anywhere}
.bk-note{display:grid;gap:6px;margin-top:14px}
.bk-note textarea{min-height:76px}
.bk-actions{display:grid;gap:10px;margin-top:16px}
.bk-actions .btn{width:100%}
.bk-status{border-radius:var(--r-lg);padding:16px 18px;background:var(--warn-soft);border:1px solid #e8d3a8;color:var(--warn);margin-bottom:14px}
.bk-status--ok{background:var(--ok-soft);border-color:#bcdcc5;color:var(--ok)}
.bk-status--bad{background:var(--danger-soft);border-color:#ebc6cb;color:var(--danger)}
.bk-status__head{display:flex;gap:12px;align-items:center}
.bk-status__icon{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.7);flex:none}
.bk-status__icon svg{width:24px;height:24px}
.bk-status__head b{display:block;font:800 17px/1.6 var(--display)}
.bk-status__head span{display:block;font-size:13px;line-height:1.8}
.bk-status__when{margin-top:12px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.65);color:var(--ink);font-size:14px;display:grid;gap:3px}
.bk-status__when b{font-size:15px}
.bk-status__when small{color:var(--muted);font-size:12.5px}
.bk-status__actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.bk-status__actions .btn{flex:1 1 auto}
@media(min-width:760px){.bk-slots{grid-template-columns:repeat(4,minmax(0,1fr))}.bk-go .btn,.bk-actions .btn{width:auto;min-width:260px}.bk-actions{display:flex;flex-wrap:wrap}}
`;
export const bookingJS=String.raw`
(function(){
var BOOK=!!window.__AYNEH_BOOK__,BK={d:null,day:0,at:null,svc:-1,step:'pick',note:'',loading:null,timer:0};
var CAL='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>';
function bkFa(v){return String(v).replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}
function dur(min){var hh=Math.floor(min/60),mm=min%60;return 'حدود '+(hh?bkFa(hh)+' ساعت':'')+(hh&&mm?' و ':'')+(mm?bkFa(mm)+' دقیقه':'')}
function who(){return state.pub&&state.pub.salon?state.pub.salon.name:'متخصص'}
function bookUrl(){return '/s/'+SLUG+'/book'}
function load(){
 var q=BK.svc>=0?'?service='+BK.svc:'';
 BK.loading=api('booking'+q).then(function(d){BK.d=d;if(BK.svc<0&&d.services&&d.services.length)BK.svc=d.service||0;var di=(d.days||[]).findIndex(function(x){return x.slots.some(function(s){return !s.taken})});if(BK.day>=((d.days||[]).length)||!d.days[BK.day]||!d.days[BK.day].slots.some(function(s){return !s.taken}))BK.day=di<0?0:di;BK.loading=null;paint();return d}).catch(function(e){BK.loading=null;BK.err=e.message;paint()});
 return BK.loading;
}
function paint(){if(BOOK)renderBook();else{headButton();statusOnPage()}watch()}
// While a request waits for the specialist, check again every 30 seconds.
function watch(){clearTimeout(BK.timer);if(BK.d&&BK.d.booking&&BK.d.booking.status==='pending')BK.timer=setTimeout(function(){if(!document.hidden)load();else watch()},30000)}

/* ---------- status card ---------- */
var LOOK={pending:['warn','clock',function(){return 'منتظر تأیید '+who()},function(){return 'درخواستت فرستاده شد. وقتی '+who()+' تأیید کند، همین‌جا می‌بینی'+(BK.d.otp?' و پیامک می‌گیری':'')+'.'}],
 confirmed:['ok','check',function(){return 'نوبتت قطعی شد'},function(){return who()+' نوبتت را تأیید کرد. منتظرت است.'}],
 rejected:['bad','warn',function(){return 'این ساعت تأیید نشد'},function(){return who()+' نتوانست این ساعت را قبول کند. یک ساعت دیگر انتخاب کن.'}],
 expired:['bad','clock',function(){return 'جوابی نیامد'},function(){return who()+' در ۱۲ ساعت جواب نداد و درخواستت آزاد شد. دوباره انتخاب کن.'}]};
function statusCard(b){
 var L=LOOK[b.status];if(!L)return null;
 var card=el('section',{class:'bk-status'+(L[0]==='warn'?'':' bk-status--'+L[0]),role:'status','aria-live':'polite'});
 card.append(el('div',{class:'bk-status__head'},[el('span',{class:'bk-status__icon','aria-hidden':'true',html:ICO[L[1]]}),el('div',{},[h('b',L[2]()),h('span',L[3]())])]));
 card.append(el('div',{class:'bk-status__when'},[h('b',b.day+'، ساعت '+b.time),h('small',b.service+' · '+dur(b.duration)),b.address?h('small','نشانی: '+b.address):null]));
 var acts=el('div',{class:'bk-status__actions'});
 if(b.status==='pending'||b.status==='confirmed'){
  if(b.map)acts.append(el('a',{class:'btn btn--ghost btn--sm',href:b.map,target:'_blank',rel:'noopener noreferrer',html:ICO.pin+'<span>مسیریابی</span>'}));
  acts.append(el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){changeSheet(b)},text:'لغو یا تغییر نوبت'}));
 }else acts.append(el('button',{class:'btn btn--primary btn--sm',type:'button',onclick:again,text:'دوباره انتخاب کن'}));
 card.append(acts);return card;
}
function again(){if(!BOOK){location.href=bookUrl();return}BK.d.booking=null;BK.step='pick';BK.at=null;load()}
function changeSheet(b){
 var panel=el('div',{class:'sheet__panel'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','لغو یا تغییر نوبت'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 panel.append(h('p','نوبت '+b.day+'، ساعت '+b.time+'. برای تغییر، این نوبت لغو می‌شود و یک ساعت تازه انتخاب می‌کنی.','muted'));
 function cancel(next){return api('booking/cancel',{id:b.id}).then(function(){closeSheet();toast(next?'نوبت قبلی لغو شد؛ ساعت تازه را انتخاب کن':'نوبتت لغو شد');if(next&&!BOOK){location.href=bookUrl();return}BK.d.booking=null;BK.step='pick';BK.at=null;load()}).catch(function(e){toast(e.message,'error')})}
 panel.append(el('div',{class:'bk-actions'},[
  el('button',{class:'btn btn--primary',type:'button',onclick:function(){cancel(true)},text:'انتخاب ساعت دیگر'}),
  el('button',{class:'btn btn--ghost',type:'button',onclick:function(){cancel(false)},text:'لغو نوبت'}),
  el('button',{class:'btn btn--ghost',type:'button',onclick:closeSheet,text:'منصرف شدم'})]));
 openSheet(panel);
}
function statusOnPage(){var box=$('#bookcard');if(!box)return;var c=BK.d&&BK.d.booking?statusCard(BK.d.booking):null;box.replaceChildren();if(c)box.append(c);box.hidden=!c}

/* ---------- the button at the top of the try-on page ---------- */
function headButton(){
 var cta=$('.hero__cta');if(!cta||!BK.d||!BK.d.enabled)return;var old=$('.bk-cta-wrap',cta);if(old)old.remove();
 var f=BK.d.booking&&/pending|confirmed/.test(BK.d.booking.status)?null:BK.d.first;
 cta.append(el('div',{class:'bk-cta-wrap'},[el('a',{class:'btn btn--soft btn--lg bk-cta',href:bookUrl(),html:'<span aria-hidden="true">📅</span><span>رزرو نوبت</span>'}),f?h('span','اولین نوبت خالی: '+f.label,'bk-cta__hint'):null]));
}

/* ---------- /s/<slug>/book ---------- */
function shell(){var flow=$('#flow');if(!flow)return null;var box=el('div',{class:'panel flow bk-panel'});flow.replaceChildren(box);return box}
function renderBook(){
 var box=shell();if(!box)return;var d=BK.d;
 if(!d){box.append(BK.err?notice('danger',BK.err):el('div',{class:'skel',style:'height:180px'}));return}
 if(d.booking){box.replaceWith(el('div',{},[statusCard(d.booking)]));if(d.booking.status==='pending'||d.booking.status==='confirmed')$('#flow').append(el('a',{class:'btn btn--ghost',href:'/s/'+SLUG,style:'width:100%',text:'برگشت به صفحهٔ '+who()}));return}
 if(!d.enabled){box.append(flowHead('رزرو نوبت',''),notice('info','نوبت‌دهی آنلاین برای «'+who()+'» هنوز فعال نیست. از راه‌های تماس صفحه نوبت بگیر.'),el('div',{class:'bk-actions'},[el('a',{class:'btn btn--primary',href:'/s/'+SLUG,text:'صفحهٔ '+who()})]));return}
 if(BK.step==='confirm'&&BK.at){confirmStep(box);return}
 pickStep(box);
}
function pickStep(box){
 var d=BK.d,days=d.days||[],day=days[BK.day];
 box.append(flowHead('کِی بیایی؟',(d.services.length?'':d.label+' · ')+dur(d.duration)+' طول می‌کشد'));
 if(d.services.length){
  box.append(h('div','خدمت','bk-label'));
  box.append(el('div',{class:'bk-services',role:'radiogroup'},d.services.map(function(s,i){return el('button',{class:'chip'+(i===BK.svc?' is-on':''),type:'button',role:'radio','aria-checked':i===BK.svc?'true':'false',onclick:function(){if(BK.svc===i)return;BK.svc=i;BK.at=null;load()},text:s.name+' · '+dur(s.min)})})));
 }
 box.append(h('div','روز','bk-label'));
 var strip=el('div',{class:'bk-days',role:'radiogroup','aria-label':'روز'});
 days.forEach(function(x,i){var off=x.closed||x.full;strip.append(el('button',{class:'bk-day'+(i===BK.day?' is-on':''),type:'button',role:'radio','aria-checked':i===BK.day?'true':'false',disabled:off,'aria-label':x.wd+' '+x.dm+(x.closed?' (تعطیل)':x.full?' (پر)':''),onclick:function(){BK.day=i;BK.at=null;renderBook()}},[h('b',i===0?'امروز':i===1?'فردا':x.wd),h('span',x.dm),x.closed||x.full?h('small',x.closed?'تعطیل':'پر'):null]))});
 box.append(strip);
 if(!day||!day.slots.length||day.closed){box.append(h('p','برای این روز ساعت خالی نمانده؛ روز دیگری انتخاب کن.','bk-empty'))}
 else{
  var am=day.slots.filter(function(s){return Number(s.t.replace(/[۰-۹]/g,function(c){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(c)}).split(':')[0])<12}),pm=day.slots.filter(function(s){return am.indexOf(s)<0});
  [['صبح',am],['بعدازظهر',pm]].forEach(function(g){if(!g[1].length)return;box.append(h('div',g[0],'bk-group'));box.append(el('div',{class:'bk-slots',role:'radiogroup','aria-label':g[0]},g[1].map(function(s){return el('button',{class:'bk-slot'+(s.at===BK.at?' is-on':''),type:'button',role:'radio','aria-checked':s.at===BK.at?'true':'false',disabled:s.taken,'aria-label':s.t+(s.taken?' (پر)':''),onclick:function(){BK.at=s.at;renderBook()},text:s.t})})))});
 }
 var sel=BK.at&&day&&day.slots.find(function(s){return s.at===BK.at});
 box.append(el('div',{class:'bk-go'},[el('button',{class:'btn btn--primary btn--lg',type:'button',disabled:!sel,onclick:function(){BK.step='confirm';renderBook();scrollTo({top:0,behavior:'smooth'})},text:sel?'ادامه · '+day.wd+' '+day.dm+'، '+sel.t:'یک ساعت انتخاب کن'})]));
}
function row(icon,label,value){return el('div',{class:'bk-sum__row'},[el('span',{class:'ico',html:icon}),el('div',{},[h('small',label),h('b',value)])])}
function confirmStep(box){
 var d=BK.d,day=d.days[BK.day],slot=day&&day.slots.find(function(s){return s.at===BK.at});if(!slot){BK.step='pick';renderBook();return}
 var me=state.me||{},verified=state.verified&&me.phone,svc=d.services.length?d.services[BK.svc]:null;
 box.append(flowHead('تأیید نوبت','درخواستت برای «'+who()+'» فرستاده می‌شود و بعد از تأییدش قطعی است.'));
 var sum=el('div',{class:'bk-sum'},[row(ICO.spark,'خدمت',svc?svc.name:d.label),row(CAL,'زمان',day.wd+' '+day.dm+'، ساعت '+slot.t),row(ICO.clock,'مدت',dur(svc?svc.min:d.duration))]);
 if(verified)sum.append(row(ICO.user,'به نام',me.name+' · '+bkFa(me.phone.slice(0,4)+'•••'+me.phone.slice(-4))));
 box.append(sum);
 var nameWrap=null,phoneWrap=null;
 if(!verified&&!d.otp){nameWrap=wrapField('bkName','نام و نام خانوادگی','text',me.name||'','',{autocomplete:'name'});phoneWrap=wrapField('bkPhone','شمارهٔ موبایل','tel',me.phone||'','۰۹۱۲۱۲۳۴۵۶۷',{inputmode:'tel',autocomplete:'tel'});box.append(nameWrap,phoneWrap)}
 var note=el('textarea',{id:'bkNote',maxlength:'200',placeholder:'مثلاً اولین بار است می‌آیم، یا هر چیزی که '+who()+' باید بداند'});note.value=BK.note;note.addEventListener('input',function(){BK.note=note.value});
 box.append(el('label',{class:'field bk-note'},[el('span',{class:'lbl',text:'توضیح (اختیاری)'}),note]));
 var submit=el('button',{class:'btn btn--primary btn--lg',type:'button',text:!verified&&d.otp?'تأیید شماره و ثبت درخواست':'ثبت درخواست نوبت'});
 box.append(el('div',{class:'bk-actions'},[submit,el('button',{class:'btn btn--ghost',type:'button',onclick:function(){BK.step='pick';renderBook()},text:'تغییر زمان'})]));
 if(!verified&&d.otp)box.append(h('p','برای ثبت نوبت یک کد پیامکی برای تأیید شماره‌ات می‌فرستیم.','fine-print'));
 submit.onclick=function(){send(submit,nameWrap,phoneWrap)};
}
function otpThenSend(){
 openOtp(function(){renderBook();send()});
 var p=$('#sheet .sheet__panel > p.muted');if(p)p.textContent='برای ثبت نوبت، اول شمارهٔ موبایلت را تأیید می‌کنیم. یک کد پیامکی برایت می‌فرستیم. نام و شماره‌ات فقط برای «'+who()+'» و همین نوبت استفاده می‌شود.';
}
function send(btn,nameWrap,phoneWrap){
 var d=BK.d,body={at:BK.at,note:BK.note.trim().slice(0,200)};if(d.services.length)body.service=BK.svc;
 if(nameWrap){var okN=validate(nameWrap,function(){return nameWrap.querySelector('input').value.trim().length>=3},'نام و نام خانوادگی‌ات را بنویس');body.phone=normalizePhone(phoneWrap.querySelector('input').value);var okP=validate(phoneWrap,function(){return /^\+989\d{9}$/.test(body.phone)},'شمارهٔ موبایل درست نیست؛ مثل ۰۹۱۲۱۲۳۴۵۶۷');if(!okN||!okP)return;body.name=nameWrap.querySelector('input').value.trim();state.me=Object.assign({},state.me||{},{name:body.name,phone:phoneWrap.querySelector('input').value.trim()})}
 if(d.otp&&!state.verified){ensureSession().then(function(){if(state.verified){renderBook();send();return}otpThenSend()}).catch(function(e){toast(e.message,'error')});return}
 if(btn){btn.disabled=true;btn.textContent='در حال ثبت…'}
 ensureSession().then(function(){return api('booking',body)}).then(function(r){BK.note='';BK.step='pick';BK.at=null;toast('درخواست نوبت فرستاده شد');return load()}).catch(function(e){
  if(btn){btn.disabled=false;btn.textContent='ثبت درخواست نوبت'}
  if(needsVerify(e.message)){state.verified=false;otpThenSend();return}
  toast(e.message,'error');if(/خالی نیست|گرفته شد/.test(e.message)){BK.step='pick';BK.at=null;load()}
 });
}

/* ---------- wiring into the page script ---------- */
var baseHead=renderHead;
renderHead=function(){baseHead();if(BOOK){var tag=$('.hero__tag');if(tag)tag.textContent='نوبتت را آنلاین بگیر: روز و ساعت خالی را انتخاب کن تا «'+who()+'» تأیید کند.';var cta=$('.hero__cta');if(cta)cta.replaceChildren(el('a',{class:'btn btn--ghost btn--lg',href:'/s/'+SLUG,html:ICO.camera+'<span>امتحان روی عکس خودم</span>'}))}else headButton()};
if(BOOK){
 var foot=$('#foot');if(foot)foot.textContent='نوبت بعد از تأیید متخصص قطعی می‌شود. نام و شماره‌ات فقط برای همین نوبت استفاده می‌شود.';
 renderAll=function(){renderHead();var st=$('#steps');if(st)st.hidden=true;renderSide();var dk=$('#dock');if(dk)dk.hidden=true;document.title='رزرو نوبت | '+who();if(!BK.d&&!BK.loading)load();else renderBook()};
 renderFlow=function(){renderBook()};renderDock=function(){};maybeTour=function(){};renderInvite=function(){};loadMine=function(){};poll=function(){};
 try{sessionStorage.removeItem('ayneh-job-'+SLUG)}catch(e){}
}else{
 var baseAll=renderAll;renderAll=function(){baseAll();if(!BK.d&&!BK.loading)load();else{headButton();statusOnPage()}};
}
})();
`;
