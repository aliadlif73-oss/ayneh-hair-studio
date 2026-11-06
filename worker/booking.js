// Booking (نوبت‌دهی) exists ONLY in the four specialist editions, at the owner's request. It is a
// standalone tool: the specialist sends her own clients the page /s/<slug>/book (or the button at the
// top of her page); no photo, simulation or image quota is involved.
// worker/edition-entry.js is the only importer: the main multi-salon Worker (worker/index.js) never
// loads this file, and every entry point below also refuses to run without env.SERVICE_LINE.
// - Customer: picks a day and a free slot, confirms with her verified mobile (existing SMS code),
//   and follows the status on the page. One open booking per mobile; slots never overlap.
// - Specialist (her own Telegram/Bale chat, the same chat that receives leads): ✅ / ❌ / 🔁 on each
//   request, /hours, /off, /today, /link (booking link), and a 21:00 digest of tomorrow.
// - A pending request holds its slot for 12 hours, then expires and frees it (cron tick).
// Times are Asia/Tehran (UTC+3:30, no DST); dates are shown in the Persian calendar.
// Settings live in salons.settings.booking: {days:[0..6 from Saturday],from,to,off:[YYYY-MM-DD],
// dur:{line:minutes},step,services:[{name,min}],wait}. Defaults: Sat–Thu 10–19, DURATION below.
import {Problem,must,uid,text,phone as mobile,digits,limited} from './domain.js';
import {session} from './server.js';
import {call,PLATFORMS,inboxes,webhook,baleWebhook,baleSecret} from './telegram.js';
import {notifyOwner} from './alerts.js';
import {sendBookingConfirm,smsReady} from './sms.js';
import {LINE_LABEL} from './lines.js';
import {trialOf,trialLive} from './trial.js';

export const DURATION={hair:60,color:180,nails:120,lashes:120};
export const DEFAULT_HOURS={days:[0,1,2,3,4,5],from:10,to:19};
export const HOLD=12*3600000;
export const WEEK=['شنبه','یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه'];
const OFFSET=210*60000,DAY=86400000,LEAD=30*60000,DAYS=14,OPEN="('pending','confirmed')";
const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const all=async(db,sql,...a)=>(await db.prepare(sql).bind(...a).all()).results;
const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}});
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const faNum=v=>String(v).replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]);
const local=p=>String(p||'').replace(/^\+98/,'0');
const enabledLine=env=>DURATION[env?.SERVICE_LINE]?env.SERVICE_LINE:null;

/* ---------- Tehran time and Persian dates ---------- */
export const tehran=ms=>{const d=new Date(ms+OFFSET);return {date:d.toISOString().slice(0,10),min:d.getUTCHours()*60+d.getUTCMinutes(),wd:(d.getUTCDay()+1)%7}};
export const dayStart=date=>Date.parse(date+'T00:00:00Z')-OFFSET;
const addDays=(date,n)=>new Date(Date.parse(date+'T00:00:00Z')+n*DAY).toISOString().slice(0,10);
const DM=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{timeZone:'Asia/Tehran',day:'numeric',month:'long'});
export const dayMonth=ms=>DM.format(ms);
export const dayLabel=ms=>WEEK[tehran(ms).wd]+' '+DM.format(ms);
export const timeLabel=ms=>{const m=tehran(ms).min;return faNum(String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0'))};
export const whenLabel=ms=>dayLabel(ms)+'، ساعت '+timeLabel(ms);
export function durationText(min){const h=Math.floor(min/60),m=min%60;return 'حدود '+(h?faNum(h)+' ساعت':'')+(h&&m?' و ':'')+(m?faNum(m)+' دقیقه':'')}

/* ---------- settings and free slots ---------- */
export function bookingConfig(salon,line){
 const s=parse(salon?.settings).booking||{},dur=Math.round(Number(s.dur?.[line]))||DURATION[line]||60;
 const days=Array.isArray(s.days)?s.days.filter(d=>Number.isInteger(d)&&d>=0&&d<7):DEFAULT_HOURS.days;
 const from=Number.isInteger(s.from)&&s.from>=0&&s.from<24?s.from:DEFAULT_HOURS.from,to=Number.isInteger(s.to)&&s.to>from&&s.to<=24?s.to:Math.max(from+1,DEFAULT_HOURS.to);
 const services=(Array.isArray(s.services)?s.services:[]).filter(x=>x&&x.name).slice(0,8).map(x=>({name:String(x.name).slice(0,40),min:Math.round(Number(x.min))||dur}));
 return {days,from,to,off:Array.isArray(s.off)?s.off.filter(x=>/^\d{4}-\d\d-\d\d$/.test(x)):[],dur,step:Math.min(Math.round(Number(s.step))||60,dur),services,wait:s.wait||null};
}
async function saveConfig(db,salon,patch){
 const fresh=await one(db,'SELECT settings FROM salons WHERE id=?',salon.id),all=parse(fresh?.settings);
 all.booking={...(all.booking||{}),...patch};for(const k of Object.keys(all.booking))if(all.booking[k]===undefined)delete all.booking[k];
 await run(db,'UPDATE salons SET settings=? WHERE id=?',JSON.stringify(all),salon.id);salon.settings=JSON.stringify(all);
}
// Days from today (Tehran) with their slots; `taken` are the open bookings that block a slot.
export function schedule(cfg,dur,taken,now=Date.now(),count=DAYS){
 const today=tehran(now).date,out=[];
 for(let i=0;i<count;i++){
  const date=addDays(today,i),start=dayStart(date),wd=tehran(start).wd,closed=!cfg.days.includes(wd)||cfg.off.includes(date),slots=[];
  if(!closed)for(let m=cfg.from*60;m+dur<=cfg.to*60;m+=cfg.step){const at=start+m*60000,end=at+dur*60000;if(at<now+LEAD)continue;slots.push({at,t:timeLabel(at),taken:taken.some(b=>b.start_at<end&&b.end_at>at)})}
  out.push({date,wd:WEEK[wd],dm:dayMonth(start+3600000),closed,full:!closed&&!slots.some(s=>!s.taken),slots});
 }
 return out;
}
const takenFor=(db,salonId,now,except='')=>all(db,'SELECT start_at,end_at FROM bookings WHERE salon_id=? AND status IN '+OPEN+' AND end_at>? AND id<>?',salonId,now,except);
export const freeSlots=days=>days.flatMap(d=>d.slots.filter(s=>!s.taken));
export async function expirePending(db,now=Date.now(),salonId=null){
 const r=salonId?await run(db,"UPDATE bookings SET status='expired',decided_at=? WHERE status='pending' AND created_at<? AND salon_id=?",now,now-HOLD,salonId):await run(db,"UPDATE bookings SET status='expired',decided_at=? WHERE status='pending' AND created_at<?",now,now-HOLD);
 return r.meta.changes;
}
const pageName=salon=>salon.name;
const durOf=b=>Math.round((b.end_at-b.start_at)/60000);
function view(b,salon,now=Date.now()){
 if(!b||b.status==='cancelled')return null;
 if(['pending','confirmed'].includes(b.status)&&b.end_at<=now)return null;
 if(['rejected','expired'].includes(b.status)&&(b.decided_at||b.created_at)<now-3*DAY)return null;
 const prof=parse(salon.profile),n=local(b.phone);
 return {id:b.id,status:b.status,at:b.start_at,day:dayLabel(b.start_at),time:timeLabel(b.start_at),duration:durOf(b),service:b.service||LINE_LABEL[b.line]||'',name:b.name,phone:faNum(n.slice(0,4)+'•••'+n.slice(-4)),address:b.status==='confirmed'?String(prof.address||''):'',map:b.status==='confirmed'?String(prof.map||''):''};
}
async function current(db,salon,s){
 if(!s)return null;
 return one(db,"SELECT * FROM bookings WHERE salon_id=? AND (session_id=? OR (?<>'' AND phone=?)) AND status<>'cancelled' ORDER BY created_at DESC LIMIT 1",salon.id,s.id,s.verified_phone||'',s.verified_phone||'');
}
async function ready(env,salon){
 if(salon.owner_id==='system'||!inboxes(env,salon).length)return false;
 const cfg=parse(salon.settings);if(cfg.trial)return trialLive(await trialOf(env.DB,salon.id));
 return true;
}

/* ---------- customer API: /api/s/<slug>/booking[/cancel] ---------- */
export async function bookingAPI(req,env){
 const line=enabledLine(env);if(!line)return null;
 const u=new URL(req.url),m=u.pathname.match(/^\/api\/s\/([a-z0-9-]{1,64})\/booking(?:\/(cancel))?$/);if(!m)return null;
 must(env.DB,'پایگاه داده هنوز آماده نیست',503);const db=env.DB,now=Date.now();
 must(m[2]?req.method==='POST':['GET','POST'].includes(req.method),'متد مجاز نیست',405);
 if(req.method==='POST')must(req.headers.get('origin')===u.origin,'مبدأ درخواست مجاز نیست',403);
 const salon=await one(db,'SELECT * FROM salons WHERE slug=?',m[1]);must(salon,'این صفحه پیدا نشد',404);
 const enabled=await ready(env,salon),cfg=bookingConfig(salon,line);
 await expirePending(db,now,salon.id);
 if(req.method==='GET'){
  let s=null;try{s=await session(req,db,salon)}catch{}
  const svc=cfg.services.length>1?Math.max(0,Math.min(cfg.services.length-1,Number(u.searchParams.get('service'))||0)):-1,dur=svc>=0?cfg.services[svc].min:cfg.dur;
  const days=enabled?schedule(cfg,dur,await takenFor(db,salon.id,now),now):[],first=freeSlots(days)[0];
  return J({enabled,line,label:LINE_LABEL[line],duration:dur,services:cfg.services.length>1?cfg.services:[],service:svc,days,first:first?{at:first.at,label:dayLabel(first.at)+'، '+first.t}:null,booking:view(await current(db,salon,s),salon,now),otp:smsReady(env),verified:!!s?.verified_phone});
 }
 const s=await session(req,db,salon),b=await req.json().catch(()=>({}));
 if(m[2]==='cancel'){
  must(/^[a-f0-9-]{36}$/.test(String(b.id||'')),'نوبت معتبر نیست');
  const bk=await one(db,"SELECT * FROM bookings WHERE id=? AND salon_id=? AND (session_id=? OR (?<>'' AND phone=?)) AND status IN "+OPEN,b.id,salon.id,s.id,s.verified_phone||'',s.verified_phone||'');
  must(bk,'این نوبت دیگر باز نیست؛ صفحه را تازه کن',409);
  await run(db,"UPDATE bookings SET status='cancelled',decided_at=? WHERE id=? AND status IN "+OPEN,now,bk.id);
  await toSalon(env,salon,'↩️ <b>نوبت لغو شد</b>\n'+esc(bk.name)+' نوبت '+whenLabel(bk.start_at)+' را لغو کرد. این ساعت دوباره آزاد است.').catch(()=>0);
  return J({ok:true});
 }
 must(enabled,'نوبت‌دهی آنلاین برای این صفحه هنوز فعال نیست؛ مستقیم تماس بگیر',503);
 await limited(db,'booking:'+s.id,8,'امروز چند بار نوبت ثبت کردی؛ فردا دوباره امتحان کن');
 await limited(db,'booking-ip:'+salon.id+':'+(req.headers.get('cf-connecting-ip')||'unknown'),30);
 must(!smsReady(env)||s.verified_phone,'اول شمارهٔ موبایلت را تأیید کن',403);
 const name=s.verified_name||text(String(b.name??'').slice(0,100),100);must(name.length>=2,'نام را بنویس');
 const number=s.verified_phone||mobile(b.phone),note=text(String(b.note??'').slice(0,200),200);
 const svc=cfg.services.length>1?cfg.services[Number(b.service)]:null;if(cfg.services.length>1)must(svc,'خدمت را انتخاب کن');
 const dur=svc?svc.min:cfg.dur,at=Number(b.at);must(Number.isSafeInteger(at),'زمان را انتخاب کن');
 const free=freeSlots(schedule(cfg,dur,await takenFor(db,salon.id,now),now));
 must(free.some(x=>x.at===at),'این ساعت دیگر خالی نیست؛ ساعت دیگری انتخاب کن',409);
 const id=uid(),end=at+dur*60000;let r;
 // One statement: the slot must still be free and this mobile must have no other open booking.
 try{r=await run(db,"INSERT INTO bookings(id,salon_id,session_id,phone,name,line,service,note,start_at,end_at,status,created_at) SELECT ?,?,?,?,?,?,?,?,?,?,'pending',? WHERE NOT EXISTS(SELECT 1 FROM bookings WHERE salon_id=? AND phone=? AND status IN "+OPEN+" AND end_at>?) AND NOT EXISTS(SELECT 1 FROM bookings WHERE salon_id=? AND status IN "+OPEN+" AND start_at<? AND end_at>?)",id,salon.id,s.id,number,name,line,svc?svc.name:'',note,at,end,now,salon.id,number,now,salon.id,end,at)}
 catch(e){if(String(e?.message).includes('BOOKING_CONFLICT'))throw new Problem(409,'این ساعت همین الان گرفته شد؛ ساعت دیگری انتخاب کن');throw e}
 if(!r.meta.changes){
  if(await one(db,'SELECT 1 FROM bookings WHERE salon_id=? AND phone=? AND status IN '+OPEN+' AND end_at>?',salon.id,number,now))throw new Problem(409,'یک نوبت باز داری؛ اول همان را لغو یا تغییر بده');
  throw new Problem(409,'این ساعت همین الان گرفته شد؛ ساعت دیگری انتخاب کن');
 }
 const bk=await one(db,'SELECT * FROM bookings WHERE id=?',id);
 if(!await toSalon(env,salon,requestText(bk),{reply_markup:requestKeys(bk)})){
  await run(db,"UPDATE bookings SET status='cancelled',decided_at=? WHERE id=?",Date.now(),id);
  await notifyOwner(env,{salon,kind:'error',level:'error',text:'درخواست نوبت به ربات متخصص نرسید.'});
  throw new Problem(502,'درخواست به '+pageName(salon)+' نرسید؛ چند دقیقهٔ دیگر دوباره امتحان کن');
 }
 return J({booking:view(bk,salon)});
}

/* ---------- specialist bot ---------- */
async function toSalon(env,salon,textOut,extra={}){
 let n=0;for(const p of inboxes(env,salon)){try{await call(env,p,'sendMessage',{chat_id:salon[PLATFORMS[p].col],text:textOut,parse_mode:'HTML',...extra});n++}catch(e){console.error('booking send',p,e?.message)}}
 return n;
}
export function requestText(b){
 return '📅 <b>درخواست نوبت تازه</b>\n\n👤 '+esc(b.name)+'\n📞 '+local(b.phone)+'\n🗓 '+whenLabel(b.start_at)+'\n⏱ '+durationText(durOf(b))+'\n✨ '+esc(b.service||LINE_LABEL[b.line]||'')+(b.note?'\n📝 '+esc(b.note):'')+'\n\nاگر تا ۱۲ ساعت جواب ندهید، درخواست خودکار لغو و ساعتش آزاد می‌شود.';
}
export const requestKeys=b=>({inline_keyboard:[[{text:'✅ تأیید',callback_data:'bk:ok:'+b.id},{text:'❌ رد',callback_data:'bk:no:'+b.id}],[{text:'🔁 پیشنهاد ساعت دیگر',callback_data:'bk:mv:'+b.id}]]});
const doneKeys=label=>({inline_keyboard:[[{text:label,callback_data:'bk:x'}]]});
async function confirmSms(env,salon,b){
 try{await sendBookingConfirm(env,b.phone,[pageName(salon),whenLabel(b.start_at)])}
 catch(e){console.error('booking sms',e?.message);await notifyOwner(env,{salon,kind:'error',level:'warn',text:'پیامک تأیید نوبت ارسال نشد.'})}
}
const daysMask=days=>days.reduce((m,d)=>m|(1<<d),0);
const maskDays=mask=>[0,1,2,3,4,5,6].filter(d=>mask&(1<<d));
const hoursKeys=mask=>({inline_keyboard:[[0,1,2,3],[4,5,6]].map(r=>r.map(d=>({text:(mask&(1<<d)?'✅ ':'▫️ ')+WEEK[d],callback_data:'bk:hd:'+mask+':'+d}))).concat([[{text:'ادامه ←',callback_data:'bk:hn:'+mask}]])});
const PRESETS=[[9,17],[10,19],[12,20]];
const rangeKeys=mask=>({inline_keyboard:[PRESETS.map(([a,b])=>({text:faNum(a)+' تا '+faNum(b),callback_data:'bk:hp:'+mask+':'+a+':'+b})),[{text:'ساعت دیگر',callback_data:'bk:hc:'+mask}]]});
function offKeys(cfg,now=Date.now()){
 const today=tehran(now).date,rows=[];
 for(let i=0;i<DAYS;i++){const date=addDays(today,i),start=dayStart(date),wd=tehran(start).wd,work=cfg.days.includes(wd),off=cfg.off.includes(date);
  rows.push({text:(work?(off?'🚫 ':'🟢 '):'— ')+WEEK[wd]+' '+dayMonth(start+3600000),callback_data:work?'bk:off:'+date.replaceAll('-',''):'bk:x'})}
 const out=[];for(let i=0;i<rows.length;i+=2)out.push(rows.slice(i,i+2));return {inline_keyboard:out};
}
const savedHours=(cfg,line)=>'✅ ساعت کاری ذخیره شد: '+cfg.days.map(d=>WEEK[d]).join('، ')+'، از ساعت '+faNum(cfg.from)+' تا '+faNum(cfg.to)+'.\nهر نوبت '+LINE_LABEL[line]+' '+durationText(cfg.dur)+' در نظر گرفته می‌شود.\nبرای بستن یک روز خاص (مرخصی یا تعطیلی) /off را بزنید.';
export const bookingHelp=(origin,salon)=>'<b>📅 نوبت‌دهی</b>\nلینک رزرو: '+origin+'/s/'+salon.slug+'/book\nمشتری روز و ساعت خالی را انتخاب می‌کند و درخواستش همین‌جا با دکمه‌های ✅ تأیید، ❌ رد و 🔁 پیشنهاد ساعت دیگر می‌آید.\n/hours روزها و ساعت کاری\n/off بستن یک روز خاص\n/today نوبت‌های امروز\n/link لینک رزرو برای فرستادن به مشتری‌ها\nهر شب ساعت ۲۱ فهرست نوبت‌های فردا می‌آید.';
const HOURS_RE=/^\s*(\d{1,2})\s*(?:-|–|تا|الی|to)\s*(\d{1,2})\s*$/;

async function onCommand(ctx,cmd){
 const {db,salon,line}=ctx,cfg=bookingConfig(salon,line);
 if(cmd==='/hours'){await saveConfig(db,salon,{wait:undefined});await ctx.say('روزهای کاری‌تان را انتخاب کنید (هر دکمه روشن/خاموش می‌شود)، بعد «ادامه» را بزنید.',{reply_markup:hoursKeys(daysMask(cfg.days))});return}
 if(cmd==='/off'){await ctx.say('روزی را که کار نمی‌کنید بزنید تا برای مشتری‌ها بسته شود؛ دوباره بزنید باز می‌شود.\n🟢 باز · 🚫 بسته · — روز غیرکاری\nنوبت‌هایی که قبلاً ثبت شده‌اند سر جایشان می‌مانند.',{reply_markup:offKeys(cfg)});return}
 if(cmd==='/today'){
  const today=tehran(Date.now()).date,start=dayStart(today);
  const rows=await all(db,"SELECT * FROM bookings WHERE salon_id=? AND status='confirmed' AND start_at>=? AND start_at<? ORDER BY start_at",salon.id,start,start+DAY);
  const waiting=(await one(db,"SELECT COUNT(*) n FROM bookings WHERE salon_id=? AND status='pending'",salon.id))?.n||0;
  await ctx.say('<b>📅 نوبت‌های امروز، '+dayLabel(start+3600000)+'</b>\n\n'+(rows.length?rows.map(b=>'• '+timeLabel(b.start_at)+' — '+esc(b.name)+' — '+local(b.phone)+' ('+durationText(durOf(b))+')').join('\n'):'امروز نوبت قطعی ندارید.')+(waiting?'\n\n⏳ '+faNum(waiting)+' درخواست منتظر جواب شماست.':''),{parse_mode:'HTML'});return;
 }
 if(cmd==='/link'||cmd==='/book'){await ctx.say('<b>📅 لینک رزرو نوبت شما</b>\n'+ctx.origin+'/s/'+salon.slug+'/book\n\nاین لینک را برای مشتری‌هایتان بفرستید (پیام، استوری، بیو). روز و ساعت خالی را خودشان انتخاب می‌کنند و درخواست همین‌جا برای تأیید شما می‌آید. روزها و ساعت کاری با /hours.',{parse_mode:'HTML'});return}
}
async function customHours(ctx,textIn,wait){
 const m=digits(textIn).match(HOURS_RE),from=Number(m[1]),to=Number(m[2]);
 if(!(from>=0&&to<=24&&to>from)){await ctx.say('ساعت را به شکل «10-19» یا «۱۰ تا ۱۹» بنویسید؛ پایان باید بعد از شروع باشد.');return}
 const days=maskDays(Number(wait.mask)||0);
 await saveConfig(ctx.db,ctx.salon,{days:days.length?days:DEFAULT_HOURS.days,from,to,wait:undefined});
 await ctx.say(savedHours(bookingConfig(ctx.salon,ctx.line),ctx.line));
}
async function onCallback(ctx,q){
 const {env,db,p,salon,line}=ctx,data=String(q.data||''),[,act,a,b,c]=data.split(':'),now=Date.now(),msg=q.message?.message_id;
 const edit=keys=>call(env,p,'editMessageReplyMarkup',{chat_id:ctx.chat,message_id:msg,reply_markup:keys}).catch(()=>{});
 if(act==='x')return 'ثبت شده';
 if(['ok','no','mv','to'].includes(act)){
  must(/^[a-f0-9-]{36}$/.test(a||''),'دکمه معتبر نیست');
  await expirePending(db,now,salon.id);
  const bk=await one(db,'SELECT * FROM bookings WHERE id=? AND salon_id=?',a,salon.id);
  if(!bk)return 'این نوبت پیدا نشد';
  const closed={rejected:'قبلاً رد شده',cancelled:'مشتری لغوش کرده',expired:'۱۲ ساعت گذشت و خودکار لغو شد'}[bk.status];
  if(closed){await edit(doneKeys(closed));return closed}
  if(act==='ok'){
   if(bk.status==='confirmed')return 'قبلاً تأیید شده';
   if(bk.start_at<now)return 'زمان این نوبت گذشته است';
   const r=await run(db,"UPDATE bookings SET status='confirmed',decided_at=? WHERE id=? AND status='pending'",now,bk.id);if(!r.meta.changes)return 'وضعیت این نوبت عوض شده';
   await edit(doneKeys('✅ تأیید شد · '+timeLabel(bk.start_at)));await confirmSms(env,salon,bk);return 'تأیید شد؛ صفحهٔ مشتری به‌روز شد';
  }
  if(act==='no'){
   await run(db,"UPDATE bookings SET status='rejected',decided_at=? WHERE id=? AND status IN "+OPEN,now,bk.id);
   await edit(doneKeys('❌ رد شد'));return 'رد شد؛ ساعت آزاد شد';
  }
  const cfg=bookingConfig(salon,line),dur=durOf(bk),free=freeSlots(schedule(cfg,dur,await takenFor(db,salon.id,now,bk.id),now));
  if(act==='mv'){
   const next=free.filter(x=>x.at!==bk.start_at).slice(0,6);
   if(!next.length)return 'در ۱۴ روز آینده ساعت خالی دیگری نیست';
   const rows=[];for(let i=0;i<next.length;i+=2)rows.push(next.slice(i,i+2).map(x=>({text:dayLabel(x.at)+' '+x.t,callback_data:'bk:to:'+bk.id+':'+Math.round(x.at/60000)})));
   await ctx.say('ساعت‌های خالی بعدی برای '+esc(bk.name)+' ('+durationText(dur)+'). با انتخاب هر کدام، نوبت به همان ساعت منتقل و قطعی می‌شود:',{parse_mode:'HTML',reply_markup:{inline_keyboard:rows}});
   return 'یکی از ساعت‌ها را انتخاب کنید';
  }
  const at=Number(b)*60000;if(!free.some(x=>x.at===at))return 'این ساعت دیگر خالی نیست؛ دوباره 🔁 بزنید';
  try{const r=await run(db,"UPDATE bookings SET start_at=?,end_at=?,status='confirmed',decided_at=? WHERE id=? AND status IN "+OPEN,at,at+dur*60000,now,bk.id);if(!r.meta.changes)return 'وضعیت این نوبت عوض شده'}
  catch(e){if(String(e?.message).includes('BOOKING_CONFLICT'))return 'این ساعت همین الان پر شد';throw e}
  const moved={...bk,start_at:at,end_at:at+dur*60000};
  await edit(doneKeys('✅ منتقل و قطعی شد · '+dayLabel(at)+' '+timeLabel(at)));await confirmSms(env,salon,moved);
  return 'نوبت به '+dayLabel(at)+' ساعت '+timeLabel(at)+' منتقل و قطعی شد';
 }
 if(act==='hd'){const d=Number(b);must(d>=0&&d<7,'روز معتبر نیست');await edit(hoursKeys((Number(a)||0)^(1<<d)));return WEEK[d]}
 if(act==='hn'){if(!(Number(a)&127))return 'حداقل یک روز را انتخاب کنید';await ctx.say('ساعت کار در این روزها؟',{reply_markup:rangeKeys(Number(a)&127)});return 'ساعت را انتخاب کنید'}
 if(act==='hp'){const from=Number(b),to=Number(c);must(PRESETS.some(x=>x[0]===from&&x[1]===to),'ساعت معتبر نیست');const days=maskDays(Number(a)&127);must(days.length,'روزی انتخاب نشده');
  await saveConfig(db,salon,{days,from,to,wait:undefined});await edit(doneKeys('✅ '+faNum(from)+' تا '+faNum(to)));await ctx.say(savedHours(bookingConfig(salon,line),line));return 'ذخیره شد'}
 if(act==='hc'){await saveConfig(db,salon,{wait:{k:'hours',mask:Number(a)&127,p,ts:now}});await ctx.say('ساعت شروع و پایان کار را بنویسید، مثلاً «10-19» یا «۱۰ تا ۱۹».');return 'منتظر ساعت شما'}
 if(act==='off'){
  must(/^\d{8}$/.test(a||''),'روز معتبر نیست');const date=a.slice(0,4)+'-'+a.slice(4,6)+'-'+a.slice(6),cfg=bookingConfig(salon,line),today=tehran(now).date;
  const off=cfg.off.filter(x=>x>=today),closing=!off.includes(date),next=closing?off.concat(date):off.filter(x=>x!==date);
  await saveConfig(db,salon,{off:next});await edit(offKeys(bookingConfig(salon,line),now));return (closing?'بسته شد: ':'باز شد: ')+dayLabel(dayStart(date)+3600000);
 }
 return 'انجام نشد';
}
async function guard(ctx,fn){
 try{return await fn()}catch(e){
  console.error('booking bot',e?.message);const why=e instanceof Problem?e.message:'یک مشکل پیش آمد و کار انجام نشد';
  await ctx.say('⚠️ '+why+'. دوباره امتحان کنید؛ اگر باز نشد، به مدیر آینه خبر بدهید.').catch(()=>{});
  await notifyOwner(ctx.env,{salon:ctx.salon,kind:'error',level:'error',text:'خطای نوبت‌دهی ربات: '+String(e?.message||e).slice(0,200)});
 }
}
// Handles only booking updates from the specialist's own chat; returns null for everything else so
// the original bot code path (worker/telegram.js) runs unchanged.
export async function bookingWebhook(req,env){
 const line=enabledLine(env);if(!line||!env.DB||req.method!=='POST')return null;
 const u=new URL(req.url);let p,secret='';
 if(u.pathname==='/api/telegram/webhook'){p='telegram';if(!env.TELEGRAM_WEBHOOK_SECRET||req.headers.get('x-telegram-bot-api-secret-token')!==env.TELEGRAM_WEBHOOK_SECRET)return null}
 else if(u.pathname.startsWith('/api/bale/webhook/')){p='bale';secret=decodeURIComponent(u.pathname.slice(18));if(!baleSecret(env)||secret!==baleSecret(env))return null}
 else return null;
 const upd=await req.clone().json().catch(()=>null);if(!upd)return null;
 const db=env.DB,key=p+':'+upd.update_id,origin=env.APP_ORIGIN||u.origin;
 const first=async()=>!Number.isInteger(upd.update_id)||!!(await run(db,'INSERT OR IGNORE INTO bot_seen(key,created_at) VALUES(?,?)',key,Date.now())).meta.changes;
 const q=upd.callback_query,m=upd.message;
 const chat=String(q?q.message?.chat?.id||'':m?.chat?.id||'');
 if(q&&!String(q.data||'').startsWith('bk:'))return null;
 if(!q&&(!m||m.chat?.type!=='private'||typeof m.text!=='string'))return null;
 // Only the specialist's own linked chat (the page's bot chat) may use booking commands or buttons.
 const salon=chat?await one(db,'SELECT * FROM salons WHERE '+PLATFORMS[p].col+'=?',chat):null;
 const ctx={env,db,p,chat,salon,line,origin,say:(t,extra={})=>call(env,p,'sendMessage',{chat_id:chat,text:t,...extra})};
 if(q){
  if(await first()){const note=salon?await guard(ctx,()=>onCallback(ctx,q)):'فقط گفتگوی متخصص همین صفحه';await call(env,p,'answerCallbackQuery',{callback_query_id:q.id,text:note||'انجام نشد'}).catch(()=>{})}
  return J({ok:true});
 }
 if(!salon)return null;
 const textIn=m.text.trim(),cmd=textIn.split(/[\s@]/)[0];
 if(['/hours','/off','/today','/book'].includes(cmd)){if(await first())await guard(ctx,()=>onCommand(ctx,cmd));return J({ok:true})}
 const wait=bookingConfig(salon,line).wait;
 if(wait?.k==='hours'&&wait.p===p&&Date.now()-wait.ts<20*60000&&HOURS_RE.test(digits(textIn))){if(await first())await guard(ctx,()=>customHours(ctx,textIn,wait));return J({ok:true})}
 if(cmd==='/link'||cmd==='/help'){
  // The original reply comes first (team/referral link or help), then the booking part.
  const dup=Number.isInteger(upd.update_id)&&!!await one(db,'SELECT 1 FROM bot_seen WHERE key=?',key);
  const res=p==='telegram'?await webhook(req,env):await baleWebhook(req,env,secret);
  if(!dup)await guard(ctx,()=>cmd==='/link'?onCommand(ctx,'/link'):ctx.say(bookingHelp(origin,salon),{parse_mode:'HTML'}));
  return res;
 }
 return null;
}

/* ---------- cron: 12-hour expiry and the 21:00 digest of tomorrow ---------- */
export async function bookingDigest(env,now=Date.now()){
 const db=env.DB,t=tehran(now);if(t.min<21*60)return 0;
 // Claim the day first so overlapping ticks never send it twice.
 const claim=await run(db,"INSERT INTO app_settings(key,value,updated_at) VALUES('booking_digest_day',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at WHERE app_settings.value<>excluded.value",t.date,now);
 if(!claim.meta.changes)return 0;
 const start=dayStart(addDays(t.date,1)),rows=await all(db,"SELECT * FROM bookings WHERE status='confirmed' AND start_at>=? AND start_at<? ORDER BY salon_id,start_at",start,start+DAY);
 const by={};for(const b of rows)(by[b.salon_id]||=[]).push(b);let sent=0;
 for(const [id,list] of Object.entries(by)){
  const salon=await one(db,'SELECT * FROM salons WHERE id=?',id);if(!salon)continue;
  sent+=await toSalon(env,salon,'<b>🌙 نوبت‌های فردا، '+dayLabel(start+3600000)+'</b>\n\n'+list.map(b=>'• '+timeLabel(b.start_at)+' — '+esc(b.name)+' — '+local(b.phone)+' ('+durationText(durOf(b))+')').join('\n'))?1:0;
 }
 return sent;
}
export async function bookingTick(env,now=Date.now()){
 if(!enabledLine(env)||!env.DB)return null;
 const expired=await expirePending(env.DB,now).catch(e=>{console.error('booking expire',e?.message);return 0});
 const digest=await bookingDigest(env,now).catch(e=>{console.error('booking digest',e?.message);return 0});
 return {expired,digest};
}
