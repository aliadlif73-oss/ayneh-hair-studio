// Telegram bot: the salon's only tool.
// - The project owner creates a one-time link in /admin; the salon taps it, the bot runs
//   /start <code> and that chat becomes the salon's inbox.
// - Every customer submission is delivered to that chat as an album (selfie, reference,
//   simulation) with the customer's name, mobile and optional Telegram handle.
// - Any photo the salon sends to the bot is published as a portfolio item on the salon page.
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET; TELEGRAM_BOT_USERNAME builds links.
import {Problem,must,uid,hash,text} from './domain.js';
import {bucketFor,putImage} from './storage.js';

const one=(db,sql,...a)=>db.prepare(sql).bind(...a).first();
const run=(db,sql,...a)=>db.prepare(sql).bind(...a).run();
const all=async(db,sql,...a)=>(await db.prepare(sql).bind(...a).all()).results;
const J=(v,s=200)=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}});
export const botReady=env=>!!env?.TELEGRAM_BOT_TOKEN;
const CATEGORIES=['بالیاژ','آمبره','هایلایت','لایت','رنگ','کوتاهی','کراتین','شینیون','فر','صافی'];

export async function tg(env,method,payload){
 must(botReady(env),'ربات تلگرام هنوز تنظیم نشده است',503);
 const isForm=payload instanceof FormData;
 const res=await fetch('https://api.telegram.org/bot'+env.TELEGRAM_BOT_TOKEN+'/'+method,{method:'POST',...(isForm?{body:payload}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(payload||{})}),signal:AbortSignal.timeout(25000)});
 const d=await res.json().catch(()=>({}));
 if(!res.ok||!d.ok)throw new Problem(502,'تلگرام درخواست را نپذیرفت'+(d.description?': '+d.description:''));
 return d.result;
}

// One-time link the owner hands to the salon. Only its hash is stored.
export async function newLinkCode(db,salon,env){
 const raw=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>x.toString(16).padStart(2,'0')).join('');
 await run(db,'UPDATE salons SET telegram_code_hash=?,telegram_code_expires=? WHERE id=?',await hash(raw),Date.now()+7*86400000,salon.id);
 const bot=(env.TELEGRAM_BOT_USERNAME||'').replace(/^@/,'');
 return {code:raw,link:bot?'https://t.me/'+bot+'?start='+raw:null};
}

const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const help=name=>'<b>ربات آینه'+(name?' — '+esc(name):'')+'</b>\n\n'+
 '📥 هر مشتری که عکس و مدلش را از صفحهٔ سالن بفرستد، همین‌جا با اسم و شماره‌اش می‌آید. خودتان تماس بگیرید یا در تلگرام پیام بدهید.\n\n'+
 '🖼 برای اضافه‌کردن نمونه‌کار، عکس را همین‌جا بفرستید. متن زیر عکس (کپشن) اسم کار می‌شود، مثلاً «بالیاژ عسلی». عکس بلافاصله روی صفحهٔ سالن می‌نشیند و مشتری می‌تواند روی عکس خودش امتحانش کند.\n'+
 'با فرستادن عکس تأیید می‌کنید اجازهٔ انتشار آن را دارید.\n\n'+
 '/list فهرست نمونه‌کارها و حذف\n/help همین راهنما';

async function salonByChat(db,chat){return one(db,'SELECT * FROM salons WHERE telegram_chat_id=?',String(chat))}

export async function webhook(req,env){
 must(req.method==='POST','متد مجاز نیست',405);
 must(env.TELEGRAM_WEBHOOK_SECRET&&req.headers.get('x-telegram-bot-api-secret-token')===env.TELEGRAM_WEBHOOK_SECRET,'دسترسی مجاز نیست',403);
 const u=await req.json().catch(()=>({}));const db=env.DB;
 try{
  if(u.callback_query)return J(await onCallback(env,db,u.callback_query));
  const m=u.message;if(!m||m.chat?.type!=='private')return J({ok:true});
  const chat=String(m.chat.id),textIn=(m.text||'').trim();
  if(textIn.startsWith('/start')){
   const code=textIn.split(/\s+/)[1]||'';
   if(/^[a-f0-9]{24}$/.test(code)){
    const salon=await one(db,'SELECT * FROM salons WHERE telegram_code_hash=? AND telegram_code_expires>?',await hash(code),Date.now());
    if(!salon){await tg(env,'sendMessage',{chat_id:chat,text:'این لینک اتصال منقضی یا قبلاً استفاده شده است. لینک تازه را از مدیر آینه بگیرید.'});return J({ok:true});}
    // A chat serves one salon; linking moves it.
    await run(db,'UPDATE salons SET telegram_chat_id=NULL WHERE telegram_chat_id=? AND id<>?',chat,salon.id);
    await run(db,'UPDATE salons SET telegram_chat_id=?,telegram_code_hash=NULL,telegram_code_expires=NULL WHERE id=?',chat,salon.id);
    await tg(env,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:'✅ این گفتگو به «'+esc(salon.name)+'» وصل شد.\n\n'+help()});
    return J({ok:true});
   }
   const s=await salonByChat(db,chat);
   await tg(env,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:s?help(s.name):'سلام! این ربات مخصوص سالن‌های عضو آینه است. برای اتصال، لینک اختصاصی را از مدیر آینه بگیرید و باز کنید.'});
   return J({ok:true});
  }
  const salon=await salonByChat(db,chat);
  if(!salon){await tg(env,'sendMessage',{chat_id:chat,text:'این گفتگو به هیچ سالنی وصل نیست. لینک اتصال را از مدیر آینه بگیرید.'});return J({ok:true});}
  if(textIn==='/help'){await tg(env,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:help(salon.name)});return J({ok:true});}
  if(textIn==='/list'){await sendList(env,db,salon,chat);return J({ok:true});}
  const photo=m.photo?.length?m.photo[m.photo.length-1]:(m.document&&/^image\/(jpeg|png|webp)$/.test(m.document.mime_type||'')?m.document:null);
  if(photo){await addPortfolio(env,db,salon,chat,photo,m.caption||'');return J({ok:true});}
  await tg(env,'sendMessage',{chat_id:chat,text:'برای اضافه‌کردن نمونه‌کار، عکس بفرستید. /help راهنما را نشان می‌دهد.'});
  return J({ok:true});
 }catch(e){
  // Always 200 to Telegram so a bad update is not redelivered forever; the error is logged.
  console.error('telegram webhook',e?.message);return J({ok:false});
 }
}

async function addPortfolio(env,db,salon,chat,photo,caption){
 must((photo.file_size||0)<=5*1024*1024,'عکس بزرگ‌تر از ۵ مگابایت است');
 const f=await tg(env,'getFile',{file_id:photo.file_id});
 const res=await fetch('https://api.telegram.org/file/bot'+env.TELEGRAM_BOT_TOKEN+'/'+f.file_path,{signal:AbortSignal.timeout(25000)});
 must(res.ok,'دریافت عکس از تلگرام ممکن نشد',502);
 const bytes=new Uint8Array(await res.arrayBuffer());
 const media=await putImage(env,salon,null,bytes,'portfolio');
 const lines=String(caption).trim().split('\n').map(x=>x.trim()).filter(Boolean);
 const title=(lines[0]||'نمونه‌کار').slice(0,150);
 const category=CATEGORIES.find(c=>caption.includes(c))||'';
 const id=uid();
 await run(db,'INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at) VALUES(?,?,?,?,?,?,?,1,1,1,?)',id,salon.id,title,category,lines.slice(1).join(' ').slice(0,500),'',JSON.stringify([media]),Date.now());
 await tg(env,'sendMessage',{chat_id:chat,parse_mode:'HTML',text:'✅ «'+esc(title)+'» روی صفحهٔ سالن نشست.',reply_markup:{inline_keyboard:[[{text:'🗑 حذف از صفحه',callback_data:'del:'+id}]]}});
}

async function sendList(env,db,salon,chat){
 const items=await all(db,'SELECT id,title FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 20',salon.id);
 if(!items.length){await tg(env,'sendMessage',{chat_id:chat,text:'هنوز نمونه‌کاری ندارید. یک عکس بفرستید تا اضافه شود.'});return}
 await tg(env,'sendMessage',{chat_id:chat,text:'نمونه‌کارهای روی صفحه ('+items.length+'). برای حذف روی هر کدام بزنید:',reply_markup:{inline_keyboard:items.map(x=>[{text:'🗑 '+x.title,callback_data:'del:'+x.id}])}});
}

async function onCallback(env,db,q){
 const chat=String(q.message?.chat?.id||''),salon=await salonByChat(db,chat);
 const id=(q.data||'').startsWith('del:')?q.data.slice(4):'';
 let note='انجام نشد';
 if(salon&&/^[a-f0-9-]{36}$/.test(id)){const r=await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',id,salon.id);note=r.meta.changes?'از صفحهٔ سالن حذف شد':'قبلاً حذف شده بود';}
 await tg(env,'answerCallbackQuery',{callback_query_id:q.id,text:note});
 return {ok:true};
}

// Deliver one customer submission. Returns true when Telegram accepted it.
export async function deliverLead(env,lead){
 const db=env.DB,salon=await one(db,'SELECT * FROM salons WHERE id=?',lead.salon_id);
 if(!salon?.telegram_chat_id||!botReady(env))return false;
 const lock=await run(db,"UPDATE leads SET status='sending',attempts=attempts+1 WHERE id=? AND status IN('queued','retry')",lead.id);
 if(!lock.meta.changes)return false;
 try{
  const photos=[[lead.original_id,'عکس مشتری'],[lead.preview_id,'شبیه‌سازی آینه'],[lead.reference_id,'عکس مدل دلخواه']].filter(x=>x[0]);
  const form=new FormData();form.append('chat_id',salon.telegram_chat_id);
  const media=[];
  for(const [id,label] of photos){const m=await one(db,'SELECT * FROM media WHERE id=? AND salon_id=?',id,salon.id);if(!m)continue;const o=await bucketFor(env).get(m.object_key);if(!o)continue;const name='p'+media.length;form.append(name,new Blob([await o.arrayBuffer()],{type:m.mime}),name+'.jpg');media.push({type:'photo',media:'attach://'+name,caption:label});}
  const caption='💇‍♀️ <b>درخواست تازه از صفحهٔ سالن</b>\n\n'+
   '<b>'+esc(lead.name)+'</b>\n📞 '+esc(lead.phone.replace(/^\+98/,'0'))+(lead.telegram?'\n✈️ @'+esc(lead.telegram):'')+
   (lead.look?'\n\n✂️ مدل: '+esc(lead.look):'')+(lead.color?'\n🎨 رنگ: '+esc(lead.color):'')+(lead.note?'\n📝 '+esc(lead.note):'')+
   '\n\nبرای جواب، تماس بگیرید'+(lead.telegram?' یا در تلگرام پیام بدهید':'')+'.';
  if(media.length){media[0].caption=caption;media[0].parse_mode='HTML';form.append('media',JSON.stringify(media));await tg(env,media.length>1?'sendMediaGroup':'sendPhoto',media.length>1?form:photoForm(form,media[0]));}
  else await tg(env,'sendMessage',{chat_id:salon.telegram_chat_id,parse_mode:'HTML',text:caption});
  await run(db,"UPDATE leads SET status='sent',last_error=NULL WHERE id=?",lead.id);
  return true;
 }catch(e){
  await run(db,"UPDATE leads SET status=CASE WHEN attempts>=3 THEN 'failed' ELSE 'retry' END,last_error=? WHERE id=?",String(e?.message||'error').slice(0,300),lead.id);
  return false;
 }
}
function photoForm(form,item){const f=new FormData();f.append('chat_id',form.get('chat_id'));f.append('photo',form.get('p0'));f.append('caption',item.caption);f.append('parse_mode','HTML');return f}

export async function deliverPending(env){
 if(!botReady(env)||!env.DB)return 0;let n=0;
 for(const l of await all(env.DB,"SELECT * FROM leads WHERE status IN('queued','retry') AND attempts<3 ORDER BY created_at LIMIT 20"))if(await deliverLead(env,l))n++;
 // A send interrupted mid-flight is retried: a duplicate Telegram message is harmless and free.
 await run(env.DB,"UPDATE leads SET status='retry' WHERE status='sending' AND created_at<?",Date.now()-5*60000);
 return n;
}

export async function setWebhook(env,origin){
 must(env.TELEGRAM_WEBHOOK_SECRET,'TELEGRAM_WEBHOOK_SECRET تنظیم نشده است',503);
 await tg(env,'setWebhook',{url:origin+'/api/telegram/webhook',secret_token:env.TELEGRAM_WEBHOOK_SECRET,allowed_updates:['message','callback_query'],drop_pending_updates:false});
 const me=await tg(env,'getMe',{});
 return {ok:true,bot:me.username};
}
