// Salon bot for Telegram and Bale (بله). Bale speaks the Telegram Bot API at tapi.bale.ai, so
// one code path serves both; a salon can link either or both, and gets every submission in each.
// - The owner creates a one-time link in /admin; /start <code> links that chat to the salon and
//   starts a short setup wizard that fills the salon page field by field.
// - Every customer submission arrives as a photo album plus a details message with three
//   one-tap buttons (called / booked / not possible). Untouched submissions are reminded twice.
// - A customer may follow her submission through the bot and is told when the salon acts.
// - Any photo the salon sends (outside the wizard) is published as portfolio.
// - A mobile number typed to the bot is texted the salon's page link (Melipayamak, sms.js).
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_USERNAME, TELEGRAM_WEBHOOK_SECRET,
//          BALE_BOT_TOKEN, BALE_BOT_USERNAME (BALE_WEBHOOK_SECRET defaults to the Telegram one).
import {Problem,must,uid,hash,text,phone,safeLink,digits,limited} from './domain.js';
import {inviteReady,sendInvite} from './sms.js';
import {bucketFor,putImage} from './storage.js';

const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const all=async(db,sql,...a)=>(await db.prepare(sql).bind(...a).all()).results;
const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}});
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
const CATEGORIES=['بالیاژ','آمبره','هایلایت','لایت','مش','رنگ','کوتاهی','کراتین','شینیون','فر','صافی','براشینگ'];

export const PLATFORMS={
 telegram:{name:'telegram',label:'تلگرام',api:'https://api.telegram.org',col:'telegram_chat_id',html:true,token:e=>e?.TELEGRAM_BOT_TOKEN,user:e=>(e?.TELEGRAM_BOT_USERNAME||'').replace(/^@/,''),link:(u,c)=>'https://t.me/'+u+'?start='+c},
 bale:{name:'bale',label:'بله',api:'https://tapi.bale.ai',col:'bale_chat_id',html:false,token:e=>e?.BALE_BOT_TOKEN,user:e=>(e?.BALE_BOT_USERNAME||'').replace(/^@/,''),link:(u,c)=>'https://ble.ir/'+u+'?start='+c}
};
export const platformReady=(env,p)=>!!PLATFORMS[p].token(env);
export const botReady=env=>platformReady(env,'telegram')||platformReady(env,'bale');
export const baleSecret=env=>env?.BALE_WEBHOOK_SECRET||env?.TELEGRAM_WEBHOOK_SECRET||'';
// Platforms on which this salon can actually receive messages right now.
export const inboxes=(env,salon)=>Object.values(PLATFORMS).filter(P=>salon?.[P.col]&&P.token(env)).map(P=>P.name);
export function followLinks(env,token){const out={};for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)out[P.name]=P.link(u,'f_'+token)}return out}

const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const plain=s=>String(s??'').replace(/<\/?b>/g,'').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const local=p=>String(p||'').replace(/^\+98/,'0');
const fa=n=>Number(n).toLocaleString('fa-IR');

// One API call. Bale gets plain text (no parse_mode) and the classic reply_to_message_id.
export async function call(env,p,method,payload){
 const P=PLATFORMS[p];must(P.token(env),'ربات '+P.label+' هنوز تنظیم نشده است',503);
 let body=payload||{};
 if(!(body instanceof FormData)){
  body={...body};
  if(!P.html&&body.parse_mode){delete body.parse_mode;if(body.text)body.text=plain(body.text);if(body.caption)body.caption=plain(body.caption)}
  if(p!=='telegram'&&body.reply_parameters){body.reply_to_message_id=body.reply_parameters.message_id;delete body.reply_parameters}
 }
 const isForm=body instanceof FormData;
 const res=await fetch(P.api+'/bot'+P.token(env)+'/'+method,{method:'POST',...(isForm?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),signal:AbortSignal.timeout(25000)});
 const d=await res.json().catch(()=>({}));
 if(!res.ok||!d.ok)throw new Problem(502,P.label+' درخواست را نپذیرفت'+(d.description?': '+d.description:''));
 return d.result;
}
export const tg=(env,method,payload)=>call(env,'telegram',method,payload);
async function fileBytes(env,p,file_id){
 const P=PLATFORMS[p],f=await call(env,p,'getFile',{file_id});
 const res=await fetch(P.api+'/file/bot'+P.token(env)+'/'+f.file_path,{signal:AbortSignal.timeout(25000)});
 must(res.ok,'دریافت عکس از '+P.label+' ممکن نشد',502);
 return new Uint8Array(await res.arrayBuffer());
}

// One-time link the owner hands to the salon; the same code works in Telegram and Bale.
export async function newLinkCode(db,salon,env){
 const raw=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');
 await run(db,'UPDATE salons SET telegram_code_hash=?,telegram_code_expires=? WHERE id=?',await hash(raw),Date.now()+7*86400000,salon.id);
 const links={};for(const P of Object.values(PLATFORMS)){const u=P.user(env);if(P.token(env)&&u)links[P.name]=P.link(u,raw)}
 return {code:raw,link:links.telegram||null,links};
}

const help=(name,sms,P)=>'<b>ربات آینه'+(name?' — '+esc(name):'')+'</b>\n\n'+
 '📥 هر مشتری که عکس و مدلش را از صفحهٔ سالن بفرستد، همین‌جا با اسم و شماره‌اش می‌آید. زیر هر درخواست یک دکمه بزنید («تماس گرفتم»، «نوبت دادم» یا «قابل اجرا نیست») تا مشتری هم خبردار شود. اگر دکمه‌ای نزنید، بعد از دو ساعت یادآوری می‌آید.\n\n'+
 '🖼 برای اضافه‌کردن نمونه‌کار، عکس را همین‌جا بفرستید. متن زیر عکس (کپشن) اسم کار می‌شود، مثلاً «بالیاژ عسلی». عکس بلافاصله روی صفحهٔ سالن می‌نشیند و مشتری می‌تواند روی عکس خودش امتحانش کند.\n'+
 'با فرستادن عکس تأیید می‌کنید اجازهٔ انتشار آن را دارید.\n\n'+
 (sms?'📲 برای فرستادن لینک سالن به یک مشتری، شمارهٔ موبایلش را همین‌جا بنویسید (مثلاً ۰۹۱۲۱۲۳۴۵۶۷). می‌توانید تا ۵ شماره را با فاصله جدا بفرستید.\n\n':'')+
 '/setup تکمیل یا تغییر اطلاعات صفحهٔ سالن\n/list فهرست نمونه‌کارها و حذف\n/help همین راهنما';

async function salonByChat(db,p,chat){return one(db,'SELECT * FROM salons WHERE '+PLATFORMS[p].col+'=?',String(chat))}

export async function webhook(req,env){
 must(req.method==='POST','متد مجاز نیست',405);
 must(env.TELEGRAM_WEBHOOK_SECRET&&req.headers.get('x-telegram-bot-api-secret-token')===env.TELEGRAM_WEBHOOK_SECRET,'دسترسی مجاز نیست',403);
 return handle(req,env,'telegram');
}
// Bale is authenticated by a secret in the webhook path (works whether or not Bale sends the
// secret-token header).
export async function baleWebhook(req,env,secret){
 must(req.method==='POST','متد مجاز نیست',405);
 const want=baleSecret(env);must(want&&secret===want,'دسترسی مجاز نیست',403);
 return handle(req,env,'bale');
}
async function handle(req,env,p){
 const u=await req.json().catch(()=>({}));const db=env.DB,origin=env.APP_ORIGIN||new URL(req.url).origin;
 const ctx={env,db,p,origin};
 try{
  if(u.callback_query){await onCallback(ctx,u.callback_query);return J({ok:true})}
  const m=u.message;if(!m||m.chat?.type!=='private')return J({ok:true});
  ctx.chat=String(m.chat.id);ctx.say=(t,extra={})=>call(env,p,'sendMessage',{chat_id:ctx.chat,text:t,...extra});
  const textIn=(m.text||'').trim();
  if(textIn.startsWith('/start')){await onStart(ctx,textIn.split(/\s+/)[1]||'');return J({ok:true})}
  const salon=await salonByChat(db,p,ctx.chat);ctx.salon=salon;
  if(!salon){await ctx.say('این گفتگو به هیچ سالنی وصل نیست. لینک اتصال را از مدیر آینه بگیرید.');return J({ok:true})}
  if(textIn==='/help'){await ctx.say(help(salon.name,inviteReady(env),PLATFORMS[p]),{parse_mode:'HTML'});return J({ok:true})}
  if(textIn==='/list'){await sendList(ctx);return J({ok:true})}
  if(textIn==='/setup'){await wizardStart(ctx,0);return J({ok:true})}
  const state=parse(salon.bot_state);
  if(state.p===p&&Number.isInteger(state.step)){await wizardAnswer(ctx,state,m);return J({ok:true})}
  const numbers=mobilesIn(textIn);
  if(numbers.length){await sendInvites(env,db,salon,ctx.chat,numbers,ctx.say);return J({ok:true})}
  const photo=photoOf(m);
  if(photo){await addPortfolio(ctx,photo,m.caption||'');return J({ok:true})}
  await ctx.say('برای اضافه‌کردن نمونه‌کار، عکس بفرستید'+(inviteReady(env)?' و برای فرستادن لینک سالن به مشتری، شمارهٔ موبایلش را بنویسید':'')+'. /help راهنما را نشان می‌دهد.');
  return J({ok:true});
 }catch(e){
  // Always 200 so a bad update is not redelivered forever; the error is logged.
  console.error(p+' webhook',e?.message);return J({ok:false});
 }
}
const photoOf=m=>m.photo?.length?m.photo[m.photo.length-1]:(m.document&&/^image\/(jpeg|png|webp)$/.test(m.document.mime_type||'')?m.document:null);

async function onStart(ctx,arg){
 const {env,db,p}=ctx,P=PLATFORMS[p];
 if(/^[a-f0-9]{24}$/.test(arg)){
  const salon=await one(db,'SELECT * FROM salons WHERE telegram_code_hash=? AND telegram_code_expires>?',await hash(arg),Date.now());
  if(!salon){await ctx.say('این لینک اتصال منقضی یا قبلاً استفاده شده است. لینک تازه را از مدیر آینه بگیرید.');return}
  // A chat serves one salon; linking moves it.
  await run(db,'UPDATE salons SET '+P.col+'=NULL WHERE '+P.col+'=? AND id<>?',ctx.chat,salon.id);
  await run(db,'UPDATE salons SET '+P.col+'=?,telegram_code_hash=NULL,telegram_code_expires=NULL WHERE id=?',ctx.chat,salon.id);
  ctx.salon={...salon,[P.col]:ctx.chat};
  const prof=parse(salon.profile),missing=['logo','cover','address','phone'].filter(k=>!prof[k]).length;
  await ctx.say('✅ این گفتگو به «'+esc(salon.name)+'» وصل شد. از این به بعد درخواست مشتری‌ها همین‌جا می‌آید.',{parse_mode:'HTML'});
  if(missing>=2)await wizardStart(ctx,0,true);
  else await ctx.say(help('',inviteReady(env),P),{parse_mode:'HTML'});
  return;
 }
 if(/^f_[a-f0-9]{24}$/.test(arg)){await follow(ctx,arg.slice(2));return}
 const s=await salonByChat(db,p,ctx.chat);
 await ctx.say(s?help(s.name,inviteReady(env),P):'سلام! این ربات مخصوص سالن‌های عضو آینه است. اگر از صفحهٔ یک سالن آمده‌اید، دکمهٔ «خبرم کن» را همان‌جا بزنید.',{parse_mode:'HTML'});
}

/* ---------- setup wizard: the salon fills its own page, one question at a time ---------- */
const WIZ=[
 {k:'name',type:'text',ask:'اسم سالن چیست؟ همان اسمی که مشتری‌ها می‌شناسند.'},
 {k:'logo',type:'photo',ask:'لوگوی سالن را بفرستید (عکس).'},
 {k:'cover',type:'photo',ask:'یک عکس خوب برای بالای صفحه بفرستید: داخل سالن یا یکی از بهترین کارهایتان. عکس عمودی بهتر می‌نشیند.'},
 {k:'bio',type:'text',ask:'یکی دو خط دربارهٔ سالن بنویسید. تخصصتان چیست؟ مثلاً «تخصص ما رنگ و بالیاژ طبیعی است.»'},
 {k:'address',type:'text',ask:'آدرس سالن را بنویسید.'},
 {k:'map',type:'location',ask:'اگر می‌خواهید مشتری بتواند مسیریابی کند، موقعیت سالن را بفرستید (📎 ← Location / موقعیت مکانی).'},
 {k:'hours',type:'text',ask:'ساعت کاری؟ مثلاً «شنبه تا پنج‌شنبه ۱۰ تا ۲۰».'},
 {k:'phone',type:'phone',ask:'شمارهٔ تماس سالن؟ (موبایل یا تلفن ثابت)'},
 {k:'instagram',type:'insta',ask:'آیدی اینستاگرام سالن؟ مثلاً @sanaz.salon'},
 {k:'manager',type:'text',ask:'اسم مدیر یا آرایشگر اصلی؟'},
 {k:'portrait',type:'photo',ask:'یک عکس از مدیر یا آرایشگر بفرستید (اختیاری).'}
];
const wizKeys=(salon,step)=>{const row=[{text:'⏭ رد شو',callback_data:'wz:skip'},{text:'⏸ بعداً',callback_data:'wz:stop'}];return {inline_keyboard:step===0&&salon?.name?[[{text:'✔️ همین: '+salon.name.slice(0,30),callback_data:'wz:keep'}],row]:[row]}};
async function wizardStart(ctx,step,first){
 await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,step}),ctx.salon.id);
 if(first)await ctx.say('بیایید صفحهٔ سالن را با هم کامل کنیم. '+fa(WIZ.length)+' سؤال کوتاه است و هر کدام را می‌توانید رد کنید.');
 await wizardAsk(ctx,step);
}
async function wizardAsk(ctx,step){
 const s=WIZ[step];
 await ctx.say(fa(step+1)+' از '+fa(WIZ.length)+' — '+s.ask,{reply_markup:wizKeys(ctx.salon,step)});
}
async function wizardNext(ctx,step){
 const next=step+1;
 if(next>=WIZ.length){
  await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);
  const s=await one(ctx.db,'SELECT slug,name FROM salons WHERE id=?',ctx.salon.id);
  await ctx.say('🎉 صفحهٔ «'+s.name+'» آماده است:\n'+ctx.origin+'/s/'+s.slug+'\n\nحالا عکس نمونه‌کارهایتان را یکی‌یکی همین‌جا بفرستید تا روی صفحه بنشیند. هر وقت خواستید اطلاعات را عوض کنید، /setup را بزنید.');
  return;
 }
 await run(ctx.db,'UPDATE salons SET bot_state=? WHERE id=?',JSON.stringify({p:ctx.p,step:next}),ctx.salon.id);
 await wizardAsk(ctx,next);
}
async function saveProfile(ctx,patch,name){
 const cur=await one(ctx.db,'SELECT name,profile FROM salons WHERE id=?',ctx.salon.id);
 const prof={...parse(cur.profile),...patch};
 await run(ctx.db,'UPDATE salons SET name=?,profile=? WHERE id=?',name||cur.name,JSON.stringify(prof),ctx.salon.id);
 if(name)ctx.salon.name=name;
}
async function wizardAnswer(ctx,state,m){
 const step=WIZ[state.step],t=(m.text||'').trim();
 if(!step){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);return}
 if(t==='/skip'||t==='رد'){await wizardNext(ctx,state.step);return}
 if(t==='/stop'){await run(ctx.db,"UPDATE salons SET bot_state='' WHERE id=?",ctx.salon.id);await ctx.say('باشه. هر وقت خواستید با /setup ادامه بدهید.');return}
 try{
  if(step.type==='photo'){
   const ph=photoOf(m);if(!ph){await ctx.say('لطفاً یک عکس بفرستید، یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
   must((ph.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است');
   const id=await putImage(ctx.env,ctx.salon,null,await fileBytes(ctx.env,ctx.p,ph.file_id),'brand');
   await saveProfile(ctx,{[step.k]:id});
  }else if(step.type==='location'){
   const loc=m.location||m.venue?.location;
   if(loc&&Number.isFinite(loc.latitude)&&Number.isFinite(loc.longitude))await saveProfile(ctx,{map:'https://www.google.com/maps?q='+loc.latitude.toFixed(6)+','+loc.longitude.toFixed(6)});
   else if(/^https?:\/\//.test(t))await saveProfile(ctx,{map:safeLink(t)});
   else{await ctx.say('موقعیت را از 📎 ← Location بفرستید، یا لینک نقشه را بچسبانید، یا «⏭ رد شو».',{reply_markup:wizKeys(ctx.salon,state.step)});return}
  }else{
   if(!t){await ctx.say('لطفاً جواب را بنویسید، یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
   if(step.type==='phone'){const n=digits(t).replace(/[\s()-]/g,'');must(/^\+?\d{5,15}$/.test(n),'شماره درست نیست؛ فقط عدد بنویسید.');await saveProfile(ctx,{phone:n})}
   else if(step.type==='insta'){const id=t.replace(/^https?:\/\/(www\.)?instagram\.com\//,'').replace(/^@/,'').replace(/\/.*$/,'');must(/^[A-Za-z0-9._]{1,30}$/.test(id),'آیدی اینستاگرام فقط حروف انگلیسی، عدد، نقطه و _ دارد.');await saveProfile(ctx,{instagram:'https://instagram.com/'+id})}
   else if(step.k==='name'){const n=text(t,100);must(n.length>=2,'اسم کوتاه است.');await saveProfile(ctx,{},n)}
   else await saveProfile(ctx,{[step.k]:text(t,1000)});
  }
 }catch(e){await ctx.say((e instanceof Problem?e.message:'ذخیره نشد')+' دوباره بفرستید یا «⏭ رد شو» را بزنید.',{reply_markup:wizKeys(ctx.salon,state.step)});return}
 await wizardNext(ctx,state.step);
}

/* ---------- customer follow: she taps "خبرم کن" on the page and starts the bot ---------- */
const STATUS={new:'هنوز منتظر تماس سالن',called:'سالن با شما تماس گرفته',booked:'نوبت هماهنگ شد',declined:'سالن گفت این مدل قابل اجرا نیست'};
async function follow(ctx,token){
 const lead=await one(ctx.db,'SELECT l.*,s.name AS salon_name FROM leads l JOIN salons s ON s.id=l.salon_id WHERE l.follow_hash=?',await hash(token));
 if(!lead){await ctx.say('این لینک پیگیری منقضی شده یا درست نیست.');return}
 await run(ctx.db,'UPDATE leads SET follow_chat=?,follow_platform=? WHERE id=?',ctx.chat,ctx.p,lead.id);
 await ctx.say('✅ هر وقت «'+lead.salon_name+'» درخواستت را بررسی کرد، همین‌جا خبرت می‌کنم.\n\nوضعیت الان: '+STATUS[lead.salon_status||'new']+'.');
}
async function notifyCustomer(env,lead,salon,textOut){
 if(!lead.follow_chat||!lead.follow_platform||!platformReady(env,lead.follow_platform))return;
 try{await call(env,lead.follow_platform,'sendMessage',{chat_id:lead.follow_chat,text:textOut})}catch(e){console.error('notify customer',e?.message)}
}
const customerText=(status,salon,origin)=>{const prof=parse(salon.profile),tel=prof.phone?'\n📞 شمارهٔ سالن: '+local(prof.phone):'';
 if(status==='called')return '📞 «'+salon.name+'» اعلام کرد که با شما تماس گرفته است. اگر تماسی نداشتید، خودتان زنگ بزنید.'+tel;
 if(status==='booked')return '✅ «'+salon.name+'» نوبت شما را هماهنگ کرد. منتظر دیدنتان هستند!';
 if(status==='declined')return '«'+salon.name+'» گفت مدلی که انتخاب کردید در سالن قابل اجرا نیست. می‌توانید مدل دیگری را امتحان کنید'+(origin?':\n'+origin+'/s/'+salon.slug:'.')+tel;
 return '⏳ «'+salon.name+'» هنوز درخواستت را جواب نداده. اگر عجله داری، مستقیم تماس بگیر.'+tel;
};

/* ---------- salon buttons under each submission ---------- */
const LABEL={called:'📞 تماس گرفتم',booked:'✅ نوبت دادم',declined:'🚫 قابل اجرا نیست'};
export function leadKeyboard(lead,p){
 const mark=k=>(lead.salon_status===k?'✔︎ ':'')+LABEL[k];
 const rows=[[{text:mark('called'),callback_data:'ls:called:'+lead.id},{text:mark('booked'),callback_data:'ls:booked:'+lead.id}],[{text:mark('declined'),callback_data:'ls:declined:'+lead.id}]];
 if(lead.telegram&&p==='telegram')rows.push([{text:'💬 پیام به '+lead.name.slice(0,24)+' در تلگرام',url:'https://t.me/'+lead.telegram}]);
 return {inline_keyboard:rows};
}
async function onCallback(ctx,q){
 const {env,db,p}=ctx,chat=String(q.message?.chat?.id||''),salon=await salonByChat(db,p,chat);ctx.chat=chat;ctx.salon=salon;
 ctx.say=(t,extra={})=>call(env,p,'sendMessage',{chat_id:chat,text:t,...extra});
 const data=String(q.data||'');let note='انجام نشد';
 try{
  if(!salon)note='این گفتگو به سالنی وصل نیست';
  else if(data.startsWith('del:')){const id=data.slice(4);if(/^[a-f0-9-]{36}$/.test(id)){const r=await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',id,salon.id);note=r.meta.changes?'از صفحهٔ سالن حذف شد':'قبلاً حذف شده بود'}}
  else if(data.startsWith('ls:')){
   const [,status,id]=data.split(':');
   if(LABEL[status]&&/^[a-f0-9-]{36}$/.test(id)){
    const lead=await one(db,'SELECT * FROM leads WHERE id=? AND salon_id=?',id,salon.id);
    if(!lead)note='این درخواست دیگر در سیستم نیست';
    else{
     const changed=lead.salon_status!==status;
     await run(db,'UPDATE leads SET salon_status=?,handled_at=COALESCE(handled_at,?) WHERE id=?',status,Date.now(),lead.id);
     const fresh={...lead,salon_status:status};
     try{await call(env,p,'editMessageReplyMarkup',{chat_id:chat,message_id:q.message.message_id,reply_markup:leadKeyboard(fresh,p)})}catch{}
     if(changed)await notifyCustomer(env,fresh,salon,customerText(status,salon,ctx.origin));
     note=lead.follow_chat?'ثبت شد و به مشتری خبر دادیم':'ثبت شد';
    }
   }
  }
  else if(data==='wz:start')await wizardStart(ctx,0,true);
  else if(data.startsWith('wz:')){
   const state=parse(salon.bot_state);
   if(state.p!==p||!Number.isInteger(state.step))note='تنظیمات در جریان نیست؛ /setup را بزنید';
   else if(data==='wz:stop'){await run(db,"UPDATE salons SET bot_state='' WHERE id=?",salon.id);await ctx.say('باشه. هر وقت خواستید با /setup ادامه بدهید.');note='متوقف شد'}
   else{note=data==='wz:keep'?'همین ماند':'رد شد';await wizardNext(ctx,state.step)}
  }
 }catch(e){console.error('callback',e?.message)}
 await call(env,p,'answerCallbackQuery',{callback_query_id:q.id,text:note}).catch(()=>{});
}

// A message made only of Iranian mobile numbers (max 5, split by spaces, commas or new lines)
// means "text this customer my page link". Anything else is not a number message.
export function mobilesIn(textIn){
 const parts=String(textIn||'').split(/[\s,،;؛]+/).filter(Boolean);
 if(!parts.length||parts.length>5)return [];
 const out=[];
 for(const p of parts){let n;try{n=phone(p)}catch{return []}if(!out.includes(n))out.push(n)}
 return out;
}

// Texts the salon's page link to each number. Limits keep a mistyped or abusive chat from burning
// SMS credit: 30 texts a day per salon, 3 a day per number across all salons, and the same salon
// cannot text the same number again within an hour.
async function sendInvites(env,db,salon,chat,numbers,say){
 if(!inviteReady(env)){await say('ارسال پیامک برای مشتری هنوز فعال نشده است. از مدیر آینه بخواهید فعالش کند.');return}
 const lines=[];
 for(const n of numbers){
  const local=n.replace(/^\+98/,'0');
  try{
   if(await one(db,"SELECT 1 FROM invites WHERE salon_id=? AND phone=? AND status='sent' AND created_at>?",salon.id,n,Date.now()-3600000)){lines.push('↩️ '+local+' — همین الان برایش پیامک رفته بود');continue}
   await limited(db,'invite:'+salon.id,30,'سقف ۳۰ پیامک در روز برای این سالن پر شده است');
   await limited(db,'invite-phone:'+n,3,'برای این شماره امروز چند پیامک رفته است');
   const r=await sendInvite(env,n,[salon.name,salon.slug]);
   await run(db,'INSERT INTO invites(id,salon_id,phone,rec_id,status,created_at) VALUES(?,?,?,?,?,?)',uid(),salon.id,n,r.recId,'sent',Date.now());
   lines.push('✅ '+local);
  }catch(e){
   const why=e instanceof Problem?e.message:'ارسال نشد';
   await run(db,'INSERT INTO invites(id,salon_id,phone,status,error,created_at) VALUES(?,?,?,?,?,?)',uid(),salon.id,n,'failed',String(why).slice(0,200),Date.now()).catch(()=>{});
   lines.push('❌ '+local+' — '+why);
  }
 }
 await say((lines.some(l=>l.startsWith('✅'))?'📲 لینک «'+salon.name+'» برای مشتری پیامک شد:\n':'پیامک فرستاده نشد:\n')+lines.join('\n'));
}


async function addPortfolio(ctx,photo,caption){
 must((photo.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است');
 const media=await putImage(ctx.env,ctx.salon,null,await fileBytes(ctx.env,ctx.p,photo.file_id),'portfolio');
 const lines=String(caption).trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const title=(lines[0]||'نمونه‌کار').slice(0,150);
 const category=CATEGORIES.find(c=>caption.includes(c))||'';
 const id=uid();
 await run(ctx.db,'INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at) VALUES(?,?,?,?,?,?,?,1,1,1,?)',id,ctx.salon.id,title,category,lines.slice(1).join(' ').slice(0,500),'',JSON.stringify([media]),Date.now());
 await ctx.say('✅ «'+esc(title)+'» روی صفحهٔ سالن نشست.'+(lines.length?'':'\nنکته: دفعهٔ بعد زیر عکس اسم کار را بنویسید (مثلاً «بالیاژ عسلی») تا مشتری بهتر بفهمد.'),{parse_mode:'HTML',reply_markup:{inline_keyboard:[[{text:'🗑 حذف از صفحه',callback_data:'del:'+id}]]}});
}

async function sendList(ctx){
 const items=await all(ctx.db,'SELECT id,title FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 20',ctx.salon.id);
 if(!items.length){await ctx.say('هنوز نمونه‌کاری ندارید. یک عکس بفرستید تا اضافه شود.');return}
 await ctx.say('نمونه‌کارهای روی صفحه ('+fa(items.length)+'). برای حذف روی هر کدام بزنید:',{reply_markup:{inline_keyboard:items.map(x=>[{text:'🗑 '+x.title,callback_data:'del:'+x.id}])}});
}

/* ---------- delivery ---------- */
// A clean photo album in a fixed order (before, after, reference), then one details message
// replying to it with the three status buttons. Albums get no per-photo captions on purpose:
// when several photos carry captions, Telegram hides them all.
export function leadText(lead,salon,photos){
 const when=new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',dateStyle:'medium',timeStyle:'short'}).format(lead.created_at||Date.now());
 const names={original:'قبل: عکس خود مشتری',preview:'بعد: شبیه‌سازی آینه',reference:'عکس مدلی که مشتری انتخاب کرده'};
 const lines=['💇‍♀️ <b>درخواست تازه برای '+esc(salon.name)+'</b>','',
  '👤 <b>نام:</b> '+esc(lead.name),
  '📞 <b>موبایل:</b> '+esc(local(lead.phone))+' ('+esc(lead.phone)+')',
  '✈️ <b>تلگرام:</b> '+(lead.telegram?'@'+esc(lead.telegram):'ثبت نکرده'),'',
  '✂️ <b>مدل انتخابی:</b> '+(lead.look?esc(lead.look):'مشخص نکرده'),
  '🎨 <b>رنگ:</b> '+(lead.color?esc(lead.color):'همان رنگ فعلی'),
  '📝 <b>توضیح مشتری:</b> '+(lead.note?esc(lead.note):'ندارد'),''];
 if(photos.length)lines.push('🖼 <b>عکس‌های بالا به ترتیب:</b>',...photos.map((p,i)=>'  '+fa(i+1)+'. '+names[p]));
 if(!photos.includes('preview'))lines.push('  (شبیه‌سازی تصویری برای این درخواست ساخته نشده)');
 lines.push('','🕒 '+esc(when),'','بعد از تماس، یکی از دکمه‌های زیر را بزنید'+(lead.follow_chat?' تا مشتری هم خبردار شود':'')+'.');
 return lines.join('\n');
}
async function sendTo(env,p,salon,lead,files){
 const chat=salon[PLATFORMS[p].col],kinds=files.map(f=>f.kind);let album=null;
 if(files.length>1){
  const form=new FormData();form.append('chat_id',chat);files.forEach((f,i)=>form.append('p'+i,new Blob([f.bytes],{type:f.mime}),'p'+i+'.jpg'));
  form.append('media',JSON.stringify(files.map((f,i)=>({type:'photo',media:'attach://p'+i}))));
  try{const r=await call(env,p,'sendMediaGroup',form);album=r?.[0]?.message_id||null}
  catch(e){if(p==='telegram')throw e;for(const f of files){const g=new FormData();g.append('chat_id',chat);g.append('photo',new Blob([f.bytes],{type:f.mime}),'p.jpg');const r=await call(env,p,'sendPhoto',g);album=album||r?.message_id||null}}
 }else if(files.length===1){const g=new FormData();g.append('chat_id',chat);g.append('photo',new Blob([files[0].bytes],{type:files[0].mime}),'p.jpg');const r=await call(env,p,'sendPhoto',g);album=r?.message_id||null}
 const d=await call(env,p,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:leadText(lead,salon,kinds),reply_markup:leadKeyboard(lead,p),...(album?{reply_parameters:{message_id:album,allow_sending_without_reply:true}}:{})});
 return d?.message_id||album;
}
export async function deliverLead(env,lead){
 const db=env.DB,salon=await one(db,'SELECT * FROM salons WHERE id=?',lead.salon_id);
 const targets=inboxes(env,salon);if(!targets.length)return false;
 const lock=await run(db,"UPDATE leads SET status='sending',attempts=attempts+1 WHERE id=? AND status IN('queued','retry')",lead.id);
 if(!lock.meta.changes)return false;
 const files=[];
 for(const [id,kind] of [[lead.original_id,'original'],[lead.preview_id,'preview'],[lead.reference_id,'reference']]){if(!id)continue;const m=await one(db,'SELECT * FROM media WHERE id=? AND salon_id=?',id,salon.id);if(!m)continue;const o=await bucketFor(env).get(m.object_key);if(!o)continue;files.push({kind,mime:m.mime,bytes:await o.arrayBuffer()})}
 const messages=parse(lead.messages),errors=[];
 for(const p of targets){if(messages[p])continue;try{messages[p]=await sendTo(env,p,salon,lead,files)}catch(e){errors.push(String(e?.message||e))}}
 const ok=Object.keys(messages).length>0;
 await run(db,"UPDATE leads SET status=?,messages=?,last_error=? WHERE id=?",ok?'sent':(lead.attempts+1>=3?'failed':'retry'),JSON.stringify(messages),errors.join(' | ').slice(0,300)||null,lead.id);
 return ok;
}

// Scheduler: retry undelivered submissions, then remind salons about untouched ones (after 2 hours
// and after 24 hours, only between 9:00 and 21:00 Tehran time). After 24 hours a following
// customer is told the salon has not answered yet, with the salon's number.
const tehranHour=t=>Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tehran',hour:'2-digit',hour12:false}).format(t))%24;
export async function deliverPending(env,origin=''){
 if(!botReady(env)||!env.DB)return 0;let n=0;
 for(const l of await all(env.DB,"SELECT * FROM leads WHERE status IN('queued','retry') AND attempts<3 ORDER BY created_at LIMIT 20"))if(await deliverLead(env,l))n++;
 await run(env.DB,"UPDATE leads SET status='retry' WHERE status='sending' AND created_at<?",Date.now()-5*60000);
 await remind(env,origin);
 return n;
}
export async function remind(env,origin,now=Date.now()){
 const h=tehranHour(now);if(h<9||h>=21)return 0;let n=0;
 const due=await all(env.DB,"SELECT * FROM leads WHERE status='sent' AND salon_status='new' AND ((reminders=0 AND created_at<?) OR (reminders=1 AND created_at<?)) ORDER BY created_at LIMIT 20",now-2*3600000,now-24*3600000);
 for(const lead of due){
  const salon=await one(env.DB,'SELECT * FROM salons WHERE id=?',lead.salon_id);if(!salon)continue;
  const claim=await run(env.DB,'UPDATE leads SET reminders=reminders+1 WHERE id=? AND reminders=?',lead.id,lead.reminders);if(!claim.meta.changes)continue;
  const messages=parse(lead.messages);
  for(const p of inboxes(env,salon)){try{await call(env,p,'sendMessage',{chat_id:salon[PLATFORMS[p].col],parse_mode:'HTML',text:'⏰ <b>یادآوری'+(lead.reminders?' دوم':'')+':</b> '+esc(lead.name)+' هنوز منتظر تماس شماست.\n📞 '+esc(local(lead.phone))+(lead.look?'\n✂️ '+esc(lead.look):'')+'\n\nبعد از تماس یکی از دکمه‌ها را بزنید.',reply_markup:leadKeyboard(lead,p),...(messages[p]?{reply_parameters:{message_id:messages[p],allow_sending_without_reply:true}}:{})})}catch(e){console.error('remind',e?.message)}}
  if(lead.reminders===1)await notifyCustomer(env,lead,salon,customerText('new',salon,origin));
  n++;
 }
 return n;
}

export async function setWebhook(env,origin){
 const out={ok:true,bots:{}};
 if(platformReady(env,'telegram')){
  must(env.TELEGRAM_WEBHOOK_SECRET,'TELEGRAM_WEBHOOK_SECRET تنظیم نشده است',503);
  await call(env,'telegram','setWebhook',{url:origin+'/api/telegram/webhook',secret_token:env.TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message','callback_query'],drop_pending_updates:false});
  out.bots.telegram=(await call(env,'telegram','getMe',{})).username;out.bot=out.bots.telegram;
 }
 if(platformReady(env,'bale')){
  must(baleSecret(env),'TELEGRAM_WEBHOOK_SECRET تنظیم نشده است',503);
  await call(env,'bale','setWebhook',{url:origin+'/api/bale/webhook/'+baleSecret(env)});
  out.bots.bale=(await call(env,'bale','getMe',{})).username;out.bot=out.bot||out.bots.bale;
 }
 must(Object.keys(out.bots).length,'هیچ رباتی تنظیم نشده است',503);
 return out;
}
