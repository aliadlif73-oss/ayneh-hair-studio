// Self-serve page creation inside a specialist edition's bot (owner-approved). EDITIONS ONLY:
// worker/edition-entry.js is the only importer and every entry point also requires env.SERVICE_LINE,
// so the main multi-salon bot never runs this code.
// - /start (no code) in a chat linked to no page → welcome + «✨ ساخت صفحهٔ من»; /new starts directly.
//   /start <code> and linked chats go to worker/telegram.js unchanged.
// - Seven short questions (name, page name, city, address, mobile via the contact button, Instagram,
//   logo), a summary with ✅ / ✏️, then the page is created with trial.js makePage (shared with the
//   landing trial form), this chat becomes its manager chat and the page and booking links are sent.
// - Wizard state: table onboarding (key "platform:chat"), dropped after 24 idle hours.
// - One bot-made page per bot user (trials.maker) and per mobile (trials.phone); bots are ignored;
//   wizard starts are rate-limited with limited().
// - Free allowance: the page's trials row holds FREE_IMAGES in all, no expiry (settings.trial and
//   settings.bot_made); the per-customer quota still applies (build-editions.mjs patch in server.js).
//   When they run out customers see «generation not available», the specialist gets one message and
//   the owner one alert with «فعال‌سازی کامل», which (like the /admin switch) removes the cap.
// Owner alerts carry no customer or specialist mobile; the specialist's mobile is shown in /admin only.
import {Problem,must,phone as mobile,digits,limited} from './domain.js';
import {call,PLATFORMS,inboxes,fileBytes,baleSecret} from './telegram.js';
import {putImage} from './storage.js';
import {notifyOwner,isOwnerChat} from './alerts.js';
import {makePage,trialOf,NO_EXPIRY} from './trial.js';
import {owner} from './server.js';
import {LINE_LABEL} from './lines.js';

export const FREE_IMAGES=20;
export const UNAVAILABLE='ساخت تصویر در این صفحه فعلاً در دسترس نیست؛ می‌توانی عکس و انتخابت را برای بررسی بفرستی.';
const IDLE=24*3600000,CITIES=['تهران','کرج','مشهد','اصفهان','شیراز','تبریز'],STEPS=['name','brand','city','address','phone','insta','logo'],OPTIONAL=['address','insta','logo'];
const SEE={hair:'مدل موهای تازه',color:'رنگ موهای تازه',nails:'طرح‌های ناخن',lashes:'مدل‌های مژه'};
const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}});
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const fa=n=>Number(n).toLocaleString('fa-IR');
const local=p=>String(p||'').replace(/^\+98/,'0');
const lineOf=env=>LINE_LABEL[env?.SERVICE_LINE]?env.SERVICE_LINE:null;

/* ---------- wizard state ---------- */
const skey=(p,chat)=>p+':'+chat;
async function load(db,p,chat){const r=await one(db,'SELECT data,updated_at FROM onboarding WHERE key=?',skey(p,chat));return r&&Date.now()-r.updated_at<=IDLE?parse(r.data):null}
const save=(ctx,st)=>run(ctx.db,'INSERT INTO onboarding(key,data,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at',skey(ctx.p,ctx.chat),JSON.stringify(st),Date.now());
const drop=ctx=>run(ctx.db,'DELETE FROM onboarding WHERE key=?',skey(ctx.p,ctx.chat));
// A chat that already serves a page (manager or team member) keeps the normal bot.
async function linked(db,p,chat){const col=PLATFORMS[p].col;return !!(await one(db,'SELECT 1 FROM salons WHERE '+col+'=?',chat)||await one(db,'SELECT 1 FROM team WHERE '+col+'=? AND active=1',chat))}
const existing=(db,maker,tel)=>one(db,"SELECT s.slug,s.name FROM trials t JOIN salons s ON s.id=t.salon_id WHERE (?<>'' AND t.maker=?) OR (?<>'' AND t.phone=?) LIMIT 1",maker||'',maker||'',tel||'',tel||'');
const makerOf=ctx=>ctx.p+':'+ctx.from.id;

/* ---------- questions ---------- */
const btn=(t,d)=>({text:t,callback_data:'ob:'+d});
const inline=rows=>({reply_markup:{inline_keyboard:rows}});
const nav=(st,skip)=>[...(skip?[[btn('⏭ رد شدن','skip')]]:[]),[...(st.edit||st.step!=='name'?[btn(st.edit?'↩️ خلاصه':'⬅️ قبلی','back')]:[]),btn('❌ انصراف','x')]];
const SUMKEYS=[[btn('✅ ساخت صفحه','ok'),btn('✏️ ویرایش','ed')],[btn('❌ انصراف','x')]];
const EDITS=[[['name','نام'],['brand','نام صفحه']],[['city','شهر'],['address','آدرس']],[['phone','موبایل'],['insta','اینستاگرام']],[['logo','لوگو']]];
function question(st,line){
 const head=st.edit?'':fa(STEPS.indexOf(st.step)+1)+' از '+fa(STEPS.length)+' — ';
 if(st.step==='name')return [head+'اسم و فامیلت چیه؟\nمثلاً «نگار احمدی»',inline(nav(st))];
 if(st.step==='brand')return [head+'اسم صفحه یا برندت؟ همین بالای صفحه‌ات می‌آید.\nمثلاً «'+LINE_LABEL[line]+' نگار»',inline(nav(st))];
 if(st.step==='city')return st.other?['اسم شهرت را بنویس:',inline(nav(st))]:[head+'کدام شهر کار می‌کنی؟',inline([CITIES.slice(0,3).map((c,i)=>btn(c,'city:'+i)),CITIES.slice(3).map((c,i)=>btn(c,'city:'+(i+3))),[btn('شهر دیگر','city:o')],...nav(st)])];
 if(st.step==='address')return [head+'آدرس یا محله‌ات؟ (اختیاری)\nمثلاً «سعادت‌آباد، خیابان سرو»',inline(nav(st,true))];
 if(st.step==='phone')return [head+'شمارهٔ موبایلت را با دکمهٔ «📱 ارسال شماره» پایین صفحه بفرست.\nفقط برای تأیید و تماس آینه است و روی صفحه نمی‌آید.',{reply_markup:{keyboard:[[{text:'📱 ارسال شماره',request_contact:true}],[{text:st.edit?'↩️ خلاصه':'⬅️ قبلی'},{text:'❌ انصراف'}]],resize_keyboard:true}}];
 if(st.step==='insta')return [head+'آیدی اینستاگرامت؟ (اختیاری)\nمثلاً @negar.studio',inline(nav(st,true))];
 return [head+'لوگو یا عکس پروفایلت را بفرست (اختیاری). عکس مربعی بهتر است.',inline(nav(st,true))];
}
const summary=a=>'📋 <b>خلاصهٔ صفحه‌ات</b>\n\n👤 نام: '+esc(a.name)+'\n🏷 نام صفحه: '+esc(a.brand)+'\n🏙 شهر: '+esc(a.city)+'\n📍 آدرس: '+(a.address?esc(a.address):'—')+'\n📱 موبایل: '+local(a.phone)+'\n📸 اینستاگرام: '+(a.insta?'@'+esc(a.insta):'—')+'\n🖼 لوگو: '+(a.logo?'دارد':'ندارد')+'\n\nهمه درست است؟';
async function ask(ctx,st,err='',intro=''){
 const pre=(err?'⚠️ '+err+'\n\n':'')+intro;
 if(st.step==='sum')return ctx.say(pre+summary(st.a),{parse_mode:'HTML',...inline(SUMKEYS)});
 const [t,extra]=question(st,ctx.line);return ctx.say(pre+t,extra);
}
// The contact button lives on a reply keyboard; it is removed whenever the phone question is left.
const unkey=(ctx,t)=>ctx.say(t,{reply_markup:{remove_keyboard:true}});
async function go(ctx,st,step,{edit=false,note=''}={}){
 if(st.step==='phone'&&step!=='phone')await unkey(ctx,note||'باشه.');
 st.step=step;st.edit=edit;st.other=false;await save(ctx,st);await ask(ctx,st);
}
const advance=(ctx,st,o)=>go(ctx,st,st.edit?'sum':STEPS[STEPS.indexOf(st.step)+1]||'sum',o);
const back=(ctx,st)=>st.edit||st.step==='sum'?go(ctx,st,'sum'):st.step==='name'?ask(ctx,st):go(ctx,st,STEPS[STEPS.indexOf(st.step)-1]);
async function already(ctx,had){
 await drop(ctx);
 return ctx.say('تو قبلاً صفحه‌ات را ساخته‌ای 🙂\n«'+esc(had.name)+'»\n'+ctx.origin+'/s/'+had.slug+'\n\nاگر این گفتگو به صفحه‌ات وصل نیست، لینک اتصال را از آینه بگیر.',{reply_markup:{remove_keyboard:true}});
}

async function welcome(ctx){
 const had=await existing(ctx.db,makerOf(ctx),'');if(had)return already(ctx,had);
 await ctx.say('سلام! 👋\nاینجا در چند دقیقه صفحهٔ اختصاصی خودت را می‌سازی:\n• مشتری‌هایت '+SEE[ctx.line]+' را روی عکس خودشان می‌بینند\n• آنلاین نوبت می‌گیرند و درخواستشان همین‌جا برایت می‌آید\n\n🎁 '+fa(FREE_IMAGES)+' تصویر رایگان هم برای شروع داری.\n\n(اگر مشتری هستی، از صفحهٔ متخصصت درخواست بفرست.)',inline([[btn('✨ ساخت صفحهٔ من','go')]]));
}
async function begin(ctx){
 const had=await existing(ctx.db,makerOf(ctx),'');if(had)return already(ctx,had);
 try{await limited(ctx.db,'onboard:'+makerOf(ctx),5,'امروز چند بار ساخت صفحه را شروع کردی؛ فردا دوباره امتحان کن.')}
 catch(e){if(e instanceof Problem&&e.status===429)return ctx.say(e.message);throw e}
 await run(ctx.db,'DELETE FROM onboarding WHERE updated_at<?',Date.now()-IDLE);
 const st={step:'name',a:{}};await save(ctx,st);
 await ask(ctx,st,'','عالی! '+fa(STEPS.length)+' سؤال کوتاه است؛ هر وقت خواستی «❌ انصراف» را بزن.\n\n');
}
async function cancel(ctx){await drop(ctx);await unkey(ctx,'باشه، لغو شد. هر وقت خواستی /new را بزن.')}

/* ---------- answers ---------- */
const photoOf=m=>m.photo?.length?m.photo[m.photo.length-1]:(m.document&&/^image\/(jpeg|png|webp)$/.test(m.document.mime_type||'')?m.document:null);
async function answer(ctx,st,m){
 const t=(m.text||'').trim(),a=st.a;
 if(t==='❌ انصراف'||t==='/cancel')return cancel(ctx);
 if(t==='⬅️ قبلی'||t==='↩️ خلاصه')return back(ctx,st);
 if(t==='/skip'&&OPTIONAL.includes(st.step)){a[st.step]='';return advance(ctx,st)}
 if(st.step==='sum')return ask(ctx,st,'یکی از دکمه‌های زیر را بزن.');
 if(t.startsWith('/'))return ask(ctx,st,'اول همین سؤال را جواب بده، یا «❌ انصراف» را بزن.');
 if(st.step==='phone'){
  const c=m.contact;
  if(!c)return ask(ctx,st,'شماره را فقط با دکمهٔ «📱 ارسال شماره» بفرست تا تأیید شود.');
  if(!c.user_id||String(c.user_id)!==String(ctx.from.id))return ask(ctx,st,'این شمارهٔ خودت نیست. با دکمهٔ «📱 ارسال شماره» شمارهٔ همین حساب را بفرست.');
  let n=String(c.phone_number||'').replace(/[^\d+]/g,''),tel;if(/^98\d{10}$/.test(n))n='+'+n;
  try{tel=mobile(n)}catch{return ask(ctx,st,'فعلاً فقط شمارهٔ موبایل ایران پذیرفته می‌شود.')}
  const had=await existing(ctx.db,'',tel);if(had)return already(ctx,had);
  a.phone=tel;return advance(ctx,st,{note:'✅ شماره‌ات تأیید شد.'});
 }
 if(st.step==='logo'){
  const ph=photoOf(m);if(!ph)return ask(ctx,st,'یک عکس بفرست، یا «⏭ رد شدن» را بزن.');
  if((ph.file_size||0)>5*1024*1024)return ask(ctx,st,'عکس بزرگ‌تر از ۵ مگابایت است.');
  a.logo=ph.file_id;return advance(ctx,st);
 }
 if(!t)return ask(ctx,st,'لطفاً جواب را بنویس.');
 if(st.step==='name'){if(t.length<2||t.length>60)return ask(ctx,st,'اسم باید بین ۲ تا ۶۰ حرف باشد.');a.name=t}
 else if(st.step==='brand'){if(t.length<2||t.length>80)return ask(ctx,st,'نام صفحه باید بین ۲ تا ۸۰ حرف باشد.');a.brand=t}
 else if(st.step==='city'){if(t.length<2||t.length>40)return ask(ctx,st,'اسم شهر را درست بنویس.');a.city=t}
 else if(st.step==='address'){if(t.length>200)return ask(ctx,st,'آدرس را کوتاه‌تر بنویس (حداکثر ۲۰۰ حرف).');a.address=t}
 else if(st.step==='insta'){
  const id=t.replace(/^https?:\/\/(www\.)?instagram\.com\//i,'').replace(/^@/,'').replace(/[/?#].*$/,'');
  if(!/^[A-Za-z0-9._]{1,30}$/.test(id))return ask(ctx,st,'آیدی اینستاگرام فقط حروف انگلیسی، عدد، نقطه و _ دارد.');a.insta=id;
 }
 return advance(ctx,st);
}

/* ---------- create the page ---------- */
const FA={'ا':'a','آ':'a','أ':'a','إ':'e','ب':'b','پ':'p','ت':'t','ث':'s','ج':'j','چ':'ch','ح':'h','خ':'kh','د':'d','ذ':'z','ر':'r','ز':'z','ژ':'zh','س':'s','ش':'sh','ص':'s','ض':'z','ط':'t','ظ':'z','ع':'','غ':'gh','ف':'f','ق':'gh','ک':'k','ك':'k','گ':'g','ل':'l','م':'m','ن':'n','و':'v','ه':'h','ة':'h','ی':'i','ي':'i','ئ':'i','ء':'','ؤ':'v'};
export const slugify=s=>[...digits(String(s||'')).toLowerCase()].map(c=>FA[c]??c).join('').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,40).replace(/-+$/,'');
const okSlug=s=>/^[a-z][a-z0-9-]{2,45}$/.test(s)&&!['demo','admin','api','new'].includes(s);
const b32=n=>Array.from(crypto.getRandomValues(new Uint8Array(n)),x=>'abcdefghijklmnopqrstuvwxyz234567'[x&31]).join('');
async function pickSlug(db,a){
 for(const c of [a.insta&&slugify(a.insta),slugify(a.brand)])if(c&&okSlug(c)&&!await one(db,'SELECT 1 FROM salons WHERE slug=?',c))return c;
 for(;;){const c='p-'+b32(6);if(!await one(db,'SELECT 1 FROM salons WHERE slug=?',c))return c}
}
const fullKeys=id=>({inline_keyboard:[[{text:'🔓 فعال‌سازی کامل',callback_data:'ob:full:'+id}]]});
async function create(ctx,st){
 const {env,db,p,line}=ctx,a=st.a,miss=['name','brand','city','phone'].find(k=>!a[k]);
 if(miss)return go(ctx,st,miss);
 const maker=makerOf(ctx),had=await existing(db,maker,a.phone);if(had)return already(ctx,had);
 const slug=await pickSlug(db,a),profile={address:a.city+(a.address?'، '+a.address:''),manager:a.name,...(a.insta?{instagram:'https://instagram.com/'+a.insta}:{})};
 let page;
 try{page=await makePage(db,{name:a.name,salon:a.brand,city:a.city,tel:a.phone,slug,profile,settings:JSON.stringify({generation_enabled:true,reference_verified:false,trial:true,bot_made:true}),images:FREE_IMAGES,expires:NO_EXPIRY,maker,chosen:'صفحهٔ ربات '+LINE_LABEL[line]+' '+slug})}
 catch(e){const twin=/UNIQUE/i.test(String(e?.message))&&await existing(db,maker,a.phone);if(twin)return already(ctx,twin);throw e}
 const col=PLATFORMS[p].col;
 await run(db,'UPDATE salons SET '+col+'=? WHERE id=?',ctx.chat,page.id);
 await drop(ctx);
 let logoFailed=false;
 if(a.logo){try{const id=await putImage(env,{id:page.id},null,await fileBytes(env,p,a.logo),'brand');await run(db,'UPDATE salons SET profile=? WHERE id=?',JSON.stringify({...profile,logo:id}),page.id)}catch(e){console.error('onboarding logo',e?.message);logoFailed=true}}
 const url=ctx.origin+'/s/'+slug;
 await ctx.say('🎉 <b>صفحه‌ات ساخته شد!</b>\n\n🔗 صفحهٔ تو:\n'+url+'\n\n📅 لینک مستقیم رزرو نوبت:\n'+url+'/book\n\n<b>سه قدم بعدی:</b>\n۱. عکس نمونه‌کار بفرست تا روی صفحه بیاید\n۲. /hours برای ساعت کاری\n۳. /link برای لینک صفحه\n\n🎁 '+fa(FREE_IMAGES)+' تصویر رایگان برای مشتری‌هایت فعال است.'+(logoFailed?'\n\n⚠️ لوگو ذخیره نشد؛ بعداً با /setup دوباره بفرست.':''),{parse_mode:'HTML'});
 await notifyOwner(env,{salon:{id:page.id,name:a.brand},kind:'trial',level:'good',text:'صفحهٔ تازه در ربات '+LINE_LABEL[line]+' ساخته شد',detail:'👤 '+a.name+'\n🏙 '+a.city+'\n✨ '+LINE_LABEL[line]+'\n🔗 '+url+'\n🎁 '+fa(FREE_IMAGES)+' تصویر رایگان',keys:fullKeys(page.id)});
}

/* ---------- buttons ---------- */
async function onButton(ctx,q){
 const d=String(q.data).slice(3);
 if(d==='noop')return 'ثبت شده';
 if(d.startsWith('full:')){
  if(!await isOwnerChat(ctx.db,ctx.p,ctx.chat))return 'فقط مدیر آینه';
  const s=await lift(ctx.env,d.slice(5));if(!s)return 'این صفحه پیدا نشد';
  await call(ctx.env,ctx.p,'editMessageReplyMarkup',{chat_id:ctx.chat,message_id:q.message?.message_id,reply_markup:{inline_keyboard:[[{text:'✅ فعال‌سازی کامل شد',callback_data:'ob:noop'}]]}}).catch(()=>{});
  return 'سقف تصویر رایگان «'+s.name+'» برداشته شد';
 }
 if(q.message?.chat?.type!=='private'||ctx.from.is_bot)return 'فقط در گفتگوی خصوصی';
 if(await linked(ctx.db,ctx.p,ctx.chat))return 'این گفتگو به یک صفحه وصل است';
 if(d==='go'){await begin(ctx);return ''}
 const st=await load(ctx.db,ctx.p,ctx.chat);if(!st)return 'ساخت صفحه در جریان نیست؛ /new را بزن';
 if(d==='x'){await cancel(ctx);return 'لغو شد'}
 if(d==='back'){await back(ctx,st);return ''}
 if(d==='skip'){if(!OPTIONAL.includes(st.step))return 'این سؤال لازم است';st.a[st.step]='';await advance(ctx,st);return 'رد شد'}
 if(d.startsWith('city:')){
  if(st.step!=='city')return 'این سؤال گذشته است';
  if(d==='city:o'){st.other=true;await save(ctx,st);await ask(ctx,st);return ''}
  const c=CITIES[Number(d.slice(5))];if(!c)return 'شهر معتبر نیست';st.a.city=c;await advance(ctx,st);return c;
 }
 if(d==='ok'){if(st.step!=='sum')return 'اول سؤال‌ها را تمام کن';await create(ctx,st);return ''}
 if(d==='ed'){await ctx.say('کدام را عوض کنیم؟',inline([...EDITS.map(r=>r.map(([k,l])=>btn(l,'ed:'+k))),[btn('↩️ خلاصه','sum')]]));return ''}
 if(d.startsWith('ed:')&&STEPS.includes(d.slice(3))){await go(ctx,st,d.slice(3),{edit:true});return ''}
 if(d==='sum'){await go(ctx,st,'sum');return ''}
 return 'انجام نشد';
}
async function guard(ctx,fn){
 try{return await fn()}catch(e){
  console.error('onboarding bot',e?.message);const why=e instanceof Problem?e.message:'یک مشکل پیش آمد و کار انجام نشد';
  await ctx.say('⚠️ '+why+'. دوباره امتحان کن؛ اگر باز نشد، به آینه خبر بده.').catch(()=>{});
  await notifyOwner(ctx.env,{kind:'error',level:'error',text:'خطای ساخت صفحه در ربات: '+String(e?.message||e).slice(0,200)});
  return 'انجام نشد';
 }
}

// Handles only the wizard (unlinked chats) and its buttons; everything else returns null so the
// booking and original bot code paths run unchanged.
export async function onboardingWebhook(req,env){
 const line=lineOf(env);if(!line||!env.DB||req.method!=='POST')return null;
 const u=new URL(req.url);let p;
 if(u.pathname==='/api/telegram/webhook'){p='telegram';if(!env.TELEGRAM_WEBHOOK_SECRET||req.headers.get('x-telegram-bot-api-secret-token')!==env.TELEGRAM_WEBHOOK_SECRET)return null}
 else if(u.pathname.startsWith('/api/bale/webhook/')){p='bale';if(!baleSecret(env)||decodeURIComponent(u.pathname.slice(18))!==baleSecret(env))return null}
 else return null;
 const upd=await req.clone().json().catch(()=>null);if(!upd)return null;
 const q=upd.callback_query,m=upd.message;
 if(q&&!String(q.data||'').startsWith('ob:'))return null;
 if(!q&&(!m||m.chat?.type!=='private'))return null;
 const db=env.DB,chat=String(q?q.message?.chat?.id||'':m.chat.id),from=(q||m).from||{};
 const ctx={env,db,p,line,chat,from,origin:env.APP_ORIGIN||u.origin,say:(t,extra={})=>call(env,p,'sendMessage',{chat_id:chat,text:t,...extra})};
 const first=async()=>!Number.isInteger(upd.update_id)||!!(await run(db,'INSERT OR IGNORE INTO bot_seen(key,created_at) VALUES(?,?)',p+':'+upd.update_id,Date.now())).meta.changes;
 if(q){
  if(chat&&await first()){const note=await guard(ctx,()=>onButton(ctx,q));await call(env,p,'answerCallbackQuery',{callback_query_id:q.id,...(note?{text:note}:{})}).catch(()=>{})}
  return J({ok:true});
 }
 if(await linked(db,p,chat))return null;
 const [cmd0,arg]=(m.text||'').trim().split(/\s+/),cmd=(cmd0||'').split('@')[0];
 if(cmd==='/start'&&arg)return null;
 const st=['/start','/new'].includes(cmd)?null:await load(db,p,chat);
 if(!st&&!['/start','/new'].includes(cmd))return null;
 if(from.is_bot)return J({ok:true});
 if(await first())await guard(ctx,()=>cmd==='/start'?welcome(ctx):cmd==='/new'?begin(ctx):answer(ctx,st,m));
 return J({ok:true});
}

/* ---------- the free allowance ---------- */
async function toSalon(env,salon,t){for(const p of inboxes(env,salon)){try{await call(env,p,'sendMessage',{chat_id:salon[PLATFORMS[p].col],text:t})}catch(e){console.error('onboarding send',p,e?.message)}}}
async function freeState(env,slug){
 const salon=await one(env.DB,'SELECT * FROM salons WHERE slug=?',slug);if(!salon)return null;
 const cfg=parse(salon.settings);if(!cfg.bot_made)return null;
 const t=await trialOf(env.DB,salon.id);return {salon,cfg,t,out:!!(cfg.trial&&t&&t.images_used>=t.images_limit)};
}
// The one-time messages when the free images are used up (claimed atomically, so sent once).
async function spent(env,salon,t){
 const claim=await run(env.DB,'UPDATE trials SET spent_alert=1 WHERE id=? AND spent_alert=0',t.id);if(!claim.meta.changes)return;
 await toSalon(env,salon,'🎁 '+fa(t.images_limit)+' تصویر رایگان صفحهٔ «'+salon.name+'» تمام شد.\nصفحه و نوبت‌دهی مثل قبل کار می‌کند؛ فقط ساخت تصویر برای مشتری‌ها فعلاً خاموش است. برای ادامه با آینه تماس بگیر.');
 await notifyOwner(env,{salon,kind:'trial',level:'warn',text:fa(t.images_limit)+' تصویر رایگان صفحهٔ ربات تمام شد.',keys:fullKeys(salon.id)});
}
// «فعال‌سازی کامل»: the page becomes a normal page (per-customer quota only). The trials row stays
// for the one-page-per-user/mobile rule.
export async function lift(env,salonId){
 const db=env.DB,s=await one(db,'SELECT * FROM salons WHERE id=?',String(salonId||''));if(!s)return null;
 const cfg=parse(s.settings);if(!cfg.bot_made)return null;
 if(cfg.trial){delete cfg.trial;await run(db,'UPDATE salons SET settings=? WHERE id=?',JSON.stringify(cfg),s.id)}
 const t=await trialOf(db,s.id);
 if(t?.spent_alert){await run(db,'UPDATE trials SET spent_alert=0 WHERE id=?',t.id);await toSalon(env,s,'✅ ساخت تصویر صفحهٔ «'+s.name+'» دوباره فعال شد؛ مشتری‌هایت می‌توانند ادامه بدهند.')}
 return s;
}
// Before the original Worker: a used-up page never reaches the paid image request.
export async function freeGate(req,env){
 if(!lineOf(env)||!env.DB||req.method!=='POST')return null;
 const m=new URL(req.url).pathname.match(/^\/api\/s\/([a-z0-9-]{1,64})\/(?:generate|views)$/);if(!m)return null;
 const f=await freeState(env,m[1]);if(!f?.out)return null;
 await spent(env,f.salon,f.t);return J({error:UNAVAILABLE},503);
}
// After the original Worker (JSON responses): customers never see the trial strip on a bot-made page,
// generation shows as unavailable once the images are used up, and /admin gets the allowance.
export async function freeJSON(u,env,d,status){
 if(!lineOf(env)||!env.DB||!d||typeof d!=='object')return;
 const m=u.pathname.match(/^\/api\/s\/([a-z0-9-]{1,64})\/(public|generate|views|owner)$/);if(!m)return;
 const f=await freeState(env,m[1]);if(!f)return;
 if(m[2]==='public'){d.trial=null;if(f.out)d.generation=false;return}
 if(m[2]==='owner'){if(status===200&&!d.error&&f.t)d.free={full:!f.cfg.trial,limit:f.t.images_limit,used:f.t.images_used,phone:local(f.t.phone)};return}
 if(status===402&&f.out)d.error=UNAVAILABLE;
 if(f.out)await spent(env,f.salon,f.t);
}
// /admin: POST /api/s/<slug>/owner/free {full} or {limit}.
export async function freeAPI(req,env){
 if(!lineOf(env)||!env.DB)return null;
 const u=new URL(req.url),m=u.pathname.match(/^\/api\/s\/([a-z0-9-]{1,64})\/owner\/free$/);if(!m)return null;
 must(req.method==='POST','متد مجاز نیست',405);must(req.headers.get('origin')===u.origin,'مبدأ درخواست مجاز نیست',403);
 await owner(req,env);
 const f=await freeState(env,m[1]);must(f?.t,'این صفحه با ربات ساخته نشده است',404);
 const b=await req.json().catch(()=>({}));
 if(b.full){await lift(env,f.salon.id);return J({ok:true,full:true})}
 const lim=Number(b.limit);must(Number.isInteger(lim)&&lim>=0&&lim<=100000,'سقف تصویر رایگان را با عدد بنویسید');
 await run(env.DB,'UPDATE salons SET settings=? WHERE id=?',JSON.stringify({...f.cfg,trial:true}),f.salon.id);
 await run(env.DB,'UPDATE trials SET images_limit=?,spent_alert=CASE WHEN images_used<? THEN 0 ELSE spent_alert END WHERE id=?',lim,lim,f.t.id);
 return J({ok:true,full:false,limit:lim});
}
