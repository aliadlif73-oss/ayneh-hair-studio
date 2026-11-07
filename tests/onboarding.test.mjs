// Self-serve page creation in the specialist editions' bot (onboarding.js): editions only.
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';
import {hash} from '../worker/domain.js';
const apps={};for(const l of ['nails','lashes'])apps[l]=(await import('../editions-dist/'+l+'/worker/edition-entry.js')).default;
const main=(await import('../worker/index.js')).default;
const password='Only-new-editions-2026!',CHAT=900,OWNER=555,PHONE='989121234567';
function migrate(DB){for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort())DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));return DB}
async function fixture(line){const DB=migrate(database()),token=crypto.randomUUID();DB.sql.exec("INSERT INTO owner_chats(platform,chat_id,created_at) VALUES('telegram','"+OWNER+"',1)");
 return {DB,BUCKET:memoryBucket(),APP_ORIGIN:'https://'+line+'.test',SESSION_SECRET:crypto.randomUUID(),CONFIG_ENCRYPTION_KEY:'b'.repeat(64),BOOTSTRAP_HASH:await hash(token),BOOTSTRAP_EXPIRES:Date.now()+60000,TELEGRAM_WEBHOOK_SECRET:'hook-secret',TELEGRAM_BOT_TOKEN:'123:abc',TELEGRAM_BOT_USERNAME:'ed_bot',MELIPAYAMAK_TOKEN:'dev-mock',KIE_API_KEY:'mock',token};}
async function call(app,e,path,body,cookie='',raw=false){const r=await app.fetch(new Request(e.APP_ORIGIN+path,{method:body===undefined?'GET':'POST',headers:{origin:e.APP_ORIGIN,cookie,...(raw?{}:{'content-type':'application/json'})},body:body===undefined?undefined:raw?body:JSON.stringify(body)}),e);const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}return {status:r.status,data:d,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const png=()=>{const b=new Uint8Array(150);b.set([137,80,78,71,13,10,26,10]);return b};
// Telegram, Bale, Melipayamak and KIE are mocked; every bot call is recorded with its platform.
function mockNet(){const calls=[],previous=globalThis.fetch;let tasks=0;globalThis.fetch=async(url,init)=>{const u=String(url);
 const bot=u.match(/^https:\/\/(api\.telegram\.org|tapi\.bale\.ai)\/(file\/)?bot[^/]+\/(.+)$/);
 if(bot){if(bot[2])return new Response(png());const body=JSON.parse(init?.body||'{}');calls.push({p:bot[1].includes('bale')?'bale':'telegram',method:bot[3],body});return Response.json({ok:true,result:bot[3]==='getFile'?{file_path:'photos/logo.png'}:{message_id:calls.length}})}
 if(u.startsWith('https://console.melipayamak.com/'))return Response.json({recId:'98765432101',status:'ok'});
 if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});
 if(u.includes('createTask')){tasks++;return Response.json({code:200,data:{taskId:'t'+tasks}})}
 throw Error('Unexpected network '+u)};
 return {calls,restore(){globalThis.fetch=previous},sent:()=>calls.filter(c=>c.method==='sendMessage'),to:chat=>calls.filter(c=>c.method==='sendMessage'&&c.body.chat_id===String(chat)),get tasks(){return tasks}};}
// One chat with the bot (Telegram or Bale), as a specialist would use it.
function chat(l,e,{id=CHAT,user=id,p='telegram',bot=false}={}){
 const path=p==='telegram'?'/api/telegram/webhook':'/api/bale/webhook/hook-secret',headers={'content-type':'application/json',...(p==='telegram'?{'x-telegram-bot-api-secret-token':'hook-secret'}:{})};
 const from={id:user,is_bot:bot,first_name:'نگار'},send=update=>apps[l].fetch(new Request(e.APP_ORIGIN+path,{method:'POST',headers,body:JSON.stringify({update_id:Math.floor(Math.random()*1e9),...update})}),e);
 const msg=extra=>send({message:{message_id:7,chat:{id,type:'private'},from,...extra}});
 return {id,say:text=>msg({text}),contact:(phone_number,user_id=user)=>msg({contact:{phone_number,user_id,first_name:'نگار'}}),photo:file_id=>msg({photo:[{file_id:file_id+'s',file_size:100},{file_id,file_size:1000}]}),
  press:data=>send({callback_query:{id:'q'+Math.random(),from,data,message:{message_id:5,chat:{id,type:'private'}}}})};
}
const last=(net,c=CHAT)=>net.to(c).at(-1)?.body;
const buttons=b=>(b?.reply_markup?.inline_keyboard||b?.reply_markup?.keyboard||[]).flat();
const datas=b=>buttons(b).map(x=>x.callback_data);
const state=(e,c=CHAT,p='telegram')=>{const r=e.DB.sql.prepare('SELECT data FROM onboarding WHERE key=?').get(p+':'+c);return r?JSON.parse(r.data):null};
// The whole happy path; returns the new page's slug. log(label) is called before each user action.
async function build(l,e,net,{c=chat(l,e),log=()=>{},insta='@Negar.Nails',phone=PHONE}={}){
 log('/start');await c.say('/start');assert.deepEqual(datas(last(net,c.id)),['ob:go']);
 log('«✨ ساخت صفحهٔ من»');await c.press('ob:go');
 log('نگار احمدی');await c.say('نگار احمدی');
 log('ناخن نگار');await c.say('ناخن نگار');
 log('«تهران»');await c.press('ob:city:0');
 log('سعادت‌آباد، خیابان سرو');await c.say('سعادت‌آباد، خیابان سرو');
 log('«📱 ارسال شماره» (شمارهٔ خودش)');await c.contact(phone);
 log(insta);await c.say(insta);
 log('[عکس لوگو]');await c.photo('logo1');
 log('«✅ ساخت صفحه»');await c.press('ob:ok');
}
function render(b){const lines=[String(b.text).replace(/<\/?b>/g,'')];const k=b.reply_markup;
 if(k?.inline_keyboard)lines.push(...k.inline_keyboard.map(r=>'   '+r.map(x=>'[ '+x.text+' ]').join(' ')));
 if(k?.keyboard)lines.push('   (دکمه‌های پایین صفحه)',...k.keyboard.map(r=>'   '+r.map(x=>'[ '+x.text+' ]').join(' ')));
 if(k?.remove_keyboard)lines.push('   (دکمه‌های پایین صفحه برداشته شد)');return lines.join('\n');}

test('happy path: the bot builds the page, links the chat, sends the links; owner alert without the mobile',async()=>{
 const net=mockNet(),e=await fixture('nails'),log=[];try{
  let seen=0;const flush=()=>{for(const m of net.sent().slice(seen)){log.push((m.body.chat_id===String(OWNER)?'🔔 به مدیر آینه:\n':'🤖 ربات:\n')+render(m.body))}seen=net.sent().length};
  await build('nails',e,net,{log:a=>{flush();log.push('👤 متخصص: '+a)}});flush();
  const s=e.DB.sql.prepare("SELECT * FROM salons WHERE slug='negar-nails'").get();assert(s,'slug from the Instagram handle');
  assert.equal(s.name,'ناخن نگار');assert.equal(s.telegram_chat_id,String(CHAT),'this chat is the page manager chat');
  const prof=JSON.parse(s.profile),cfg=JSON.parse(s.settings);assert.equal(prof.address,'تهران، سعادت‌آباد، خیابان سرو');assert.equal(prof.manager,'نگار احمدی');assert.equal(prof.instagram,'https://instagram.com/Negar.Nails');assert.match(prof.logo,/^[a-f0-9-]{36}$/);assert(!prof.phone,'the mobile is not published');
  assert.deepEqual([cfg.trial,cfg.bot_made,cfg.generation_enabled],[true,true,true]);
  assert(e.DB.sql.prepare("SELECT 1 FROM media WHERE id=? AND salon_id=? AND kind='brand'").get(prof.logo,s.id),'logo stored like the brand upload');
  const t=e.DB.sql.prepare('SELECT * FROM trials WHERE salon_id=?').get(s.id);assert.equal(t.images_limit,20);assert.equal(t.phone,'+989121234567');assert.equal(t.maker,'telegram:'+CHAT);assert(t.expires_at>Date.now()+50*365*86400000,'no expiry');
  const done=net.to(CHAT).at(-1).body;assert.match(done.text,/https:\/\/nails\.test\/s\/negar-nails\n/);assert.match(done.text,/https:\/\/nails\.test\/s\/negar-nails\/book/);assert.match(done.text,/\/hours/);assert.match(done.text,/\/link/);assert.match(done.text,/نمونه‌کار/);
  assert.equal(state(e),null,'wizard state removed');
  const alert=net.to(OWNER).at(-1).body;assert.match(alert.text,/ناخن نگار/);assert.match(alert.text,/نگار احمدی/);assert.match(alert.text,/تهران/);assert.match(alert.text,/ناخن/);assert.match(alert.text,/nails\.test\/s\/negar-nails/);
  assert(!/0912|\+98912|989121234567/.test(alert.text),'no mobile in the owner alert');assert.deepEqual(datas(alert),['ob:full:'+s.id]);
  const phoneQ=net.to(CHAT).find(m=>m.body.reply_markup?.keyboard)?.body;assert(phoneQ.reply_markup.keyboard[0][0].request_contact);
  assert(net.to(CHAT).some(m=>m.body.reply_markup?.remove_keyboard),'reply keyboard removed after the contact');
  // The chat is now linked: /start shows the normal bot, the page and booking work with the defaults.
  const before=net.sent().length;await chat('nails',e).say('/start');const menu=net.sent().slice(before);assert(menu.length&&!menu.some(m=>datas(m.body).includes('ob:go')));
  const pub=await call(apps.nails,e,'/api/s/negar-nails/public');assert.equal(pub.status,200);assert.equal(pub.data.trial,null,'no trial strip for customers');assert.equal(pub.data.generation,true);
  const bk=await call(apps.nails,e,'/api/s/negar-nails/booking');assert.equal(bk.data.enabled,true);assert.equal(bk.data.duration,120);
  if(process.env.ONBOARDING_TRANSCRIPT)writeFileSync(process.env.ONBOARDING_TRANSCRIPT,'آینه ناخن — ساخت صفحه در ربات (گفتگوی شبیه‌سازی‌شده، خروجی کد واقعی)\n\n'+log.join('\n\n')+'\n');
 }finally{net.restore()}
});

test('forwarded or typed numbers are refused; bots are ignored; bad answers are asked again',async()=>{
 const net=mockNet(),e=await fixture('nails');try{const c=chat('nails',e);
  await chat('nails',e,{id:901,bot:true}).say('/start');assert.equal(net.to(901).length,0,'bots get nothing');
  await c.say('/new');await c.say('ن');assert.match(last(net).text,/بین ۲ تا ۶۰/);assert.equal(state(e).step,'name');
  await c.say('نگار احمدی');await c.say('ناخن نگار');await c.press('ob:city:o');assert.match(last(net).text,/اسم شهرت/);await c.say('رشت');assert.equal(state(e).a.city,'رشت');
  await c.press('ob:skip');assert.equal(state(e).step,'phone');
  await c.say('09121234567');assert.match(last(net).text,/فقط با دکمه/);
  await c.contact(PHONE,12345);assert.match(last(net).text,/شمارهٔ خودت نیست/);
  await c.contact(PHONE,null);assert.match(last(net).text,/شمارهٔ خودت نیست/);
  await c.contact('447700900123');assert.match(last(net).text,/موبایل ایران/);
  assert.equal(state(e).step,'phone');assert(!state(e).a.phone);
  await c.contact('+98 912 123 4567');assert.equal(state(e).a.phone,'+989121234567');assert.equal(state(e).step,'insta');
  await c.say('نگار!');assert.match(last(net).text,/حروف انگلیسی/);await c.say('https://www.instagram.com/negar_art/?hl=fa');assert.equal(state(e).a.insta,'negar_art');
  await c.say('متن به جای عکس');assert.match(last(net).text,/یک عکس بفرست/);
 }finally{net.restore()}
});

test('back, cancel and edit work; the wizard survives in the database',async()=>{
 const net=mockNet(),e=await fixture('nails');try{const c=chat('nails',e);
  await c.say('/new');await c.say('نگار احمدی');assert.equal(state(e).step,'brand');
  await c.press('ob:back');assert.equal(state(e).step,'name');assert.match(last(net).text,/اسم و فامیلت/);
  await c.say('نگار احمدی');await c.say('ناخن نگار');await c.press('ob:city:2');await c.say('وکیل‌آباد');assert.equal(state(e).step,'phone');
  await c.say('⬅️ قبلی');assert.equal(state(e).step,'address');assert(net.to(CHAT).slice(-2)[0].body.reply_markup.remove_keyboard,'leaving the phone question removes its keyboard');
  await c.press('ob:skip');await c.contact(PHONE);await c.press('ob:skip');await c.press('ob:skip');
  assert.equal(state(e).step,'sum');assert.match(last(net).text,/مشهد/);assert.deepEqual(datas(last(net)),['ob:ok','ob:ed','ob:x']);
  await c.press('ob:ed');assert(datas(last(net)).includes('ob:ed:brand'));
  await c.press('ob:ed:brand');assert.equal(state(e).edit,true);assert.doesNotMatch(last(net).text,/از ۷/);
  await c.say('ناخن‌های نگار');assert.equal(state(e).step,'sum');assert.match(last(net).text,/ناخن‌های نگار/);
  await c.press('ob:ed:city');await c.press('ob:back');assert.equal(state(e).step,'sum','back while editing returns to the summary');
  await c.press('ob:x');assert.equal(state(e),null);assert.match(last(net).text,/لغو شد/);
  await c.say('سلام');assert.match(last(net).text,/به هیچ متخصصی وصل نیست|وصل نیست/,'after cancel the original stranger reply comes back');
  await c.say('/new');assert.equal(state(e).step,'name');
  e.DB.sql.exec("UPDATE onboarding SET updated_at="+(Date.now()-25*3600000));await c.say('نگار');assert.notEqual(state(e)?.a?.name,'نگار','a wizard idle for 24 hours is dropped');
  // Without SLUG candidates the page gets p-xxxxxx; with ✅ from a stale summary nothing is created twice.
  await c.say('/new');await c.say('نگار احمدی');await c.say('!!');await c.press('ob:city:1');await c.press('ob:skip');await c.contact(PHONE);await c.press('ob:skip');await c.press('ob:skip');await c.press('ob:ok');
  const s=e.DB.sql.prepare('SELECT slug FROM salons').all();assert.equal(s.length,1);assert.match(s[0].slug,/^p-[a-z2-7]{6}$/);
  await c.press('ob:ok');assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,1);
 }finally{net.restore()}
});

test('one page per bot user and per mobile: they get their existing link; wizard starts are rate-limited',async()=>{
 const net=mockNet(),e=await fixture('nails');try{
  await build('nails',e,net);e.DB.sql.exec('UPDATE salons SET telegram_chat_id=NULL');
  await chat('nails',e).say('/start');assert.match(last(net).text,/قبلاً صفحه‌ات را ساخته‌ای/);assert.match(last(net).text,/nails\.test\/s\/negar-nails/);
  await chat('nails',e).say('/new');assert.match(last(net).text,/قبلاً/);
  const other=chat('nails',e,{id:902});await other.say('/new');await other.say('مینا');await other.say('ناخن مینا');await other.press('ob:city:0');await other.press('ob:skip');
  await other.contact(PHONE);assert.match(last(net,902).text,/قبلاً صفحه‌ات را ساخته‌ای/);assert.match(last(net,902).text,/negar-nails/);assert.equal(state(e,902),null);
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,1);
  const r=chat('nails',e,{id:903});for(let i=0;i<5;i++)await r.say('/new');await r.say('/new');assert.match(last(net,903).text,/فردا دوباره/);
 }finally{net.restore()}
});

test('main app: /start without a code is unchanged and never loads the wizard',async()=>{
 const src=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8')+readFileSync(new URL('../worker/telegram.js',import.meta.url),'utf8')+readFileSync(new URL('../worker/server.js',import.meta.url),'utf8');assert(!src.includes('onboarding'));
 const net=mockNet();try{const e={DB:migrate(database()),BUCKET:memoryBucket(),SESSION_SECRET:'x'.repeat(32),TELEGRAM_WEBHOOK_SECRET:'hook-secret',TELEGRAM_BOT_TOKEN:'1:a',TELEGRAM_BOT_USERNAME:'ayneh_salon_bot'};
  await main.fetch(new Request('https://ayneh.test/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':'hook-secret'},body:JSON.stringify({update_id:1,message:{chat:{id:CHAT,type:'private'},from:{id:CHAT},text:'/start'}})}),e);
  assert.match(last(net).text,/این ربات مخصوص سالن‌های عضو آینه است/);assert.deepEqual(datas(last(net)),[]);
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM onboarding').get().n,0);
  const {onboardingWebhook,freeGate}=await import('../worker/onboarding.js');
  assert.equal(await onboardingWebhook(new Request('https://ayneh.test/api/telegram/webhook',{method:'POST',body:'{}'}),e),null,'no SERVICE_LINE, no wizard');
  assert.equal(await freeGate(new Request('https://ayneh.test/api/s/x/generate',{method:'POST'}),e),null);
 }finally{net.restore()}
});

test('20 free images: per-customer quota on top, the 21st is blocked, one message each, «فعال‌سازی کامل» and /admin lift it',async()=>{
 const net=mockNet(),e=await fixture('nails'),app=apps.nails;try{
  await build('nails',e,net);const s=e.DB.sql.prepare("SELECT * FROM salons WHERE slug='negar-nails'").get(),slug=s.slug;
  async function customer(number){const g=(await call(app,e,'/api/s/'+slug+'/session',{})).cookie;
   assert.equal((await call(app,e,'/api/s/'+slug+'/otp/send',{first_name:'مینا',last_name:'رضایی',phone:number},g)).status,200);assert.equal((await call(app,e,'/api/s/'+slug+'/otp/verify',{code:'12345'},g)).status,200);
   const up=await call(app,e,'/api/s/'+slug+'/upload?kind=original',png(),g,true);assert.equal(up.status,200,JSON.stringify(up.data));
   return ()=>call(app,e,'/api/s/'+slug+'/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:up.data.id,style:1},g);}
  const a=await customer('09120000001');for(let i=0;i<3;i++)assert.equal((await a()).status,200);
  const q=await a();assert.equal(q.status,429,'per-customer quota still applies');assert.equal(net.tasks,3);
  const used=()=>e.DB.sql.prepare('SELECT images_used FROM trials WHERE salon_id=?').get(s.id).images_used;assert.equal(used(),3);
  e.DB.sql.prepare('UPDATE trials SET images_used=19 WHERE salon_id=?').run(s.id);
  const b=await customer('09120000002'),n0=net.to(CHAT).length,o0=net.to(OWNER).length;
  assert.equal((await b()).status,200,'the 20th image');assert.equal(used(),20);
  const spent=net.to(CHAT).slice(n0);assert.equal(spent.length,1);assert.match(spent[0].body.text,/۲۰ تصویر رایگان/);assert.match(spent[0].body.text,/با آینه تماس بگیر/);
  const al=net.to(OWNER).slice(o0);assert.equal(al.length,1);assert.deepEqual(datas(al[0].body),['ob:full:'+s.id]);
  const blocked=await b();assert.equal(blocked.status,503);assert.match(blocked.data.error,/فعلاً در دسترس نیست/);assert.equal(net.tasks,4,'no paid task for the 21st');
  await b();assert.equal(net.to(CHAT).length,n0+1,'the specialist is told once');assert.equal(net.to(OWNER).length,o0+1,'the owner is told once');
  const pub=await call(app,e,'/api/s/'+slug+'/public');assert.equal(pub.data.generation,false,'customers see the unavailable state');assert.equal(pub.data.trial,null);
  assert.equal((await call(app,e,'/api/s/'+slug+'/booking')).data.enabled,true,'booking keeps working');
  // Only the owner's chat may press «فعال‌سازی کامل».
  await chat('nails',e).press('ob:full:'+s.id);assert.match(net.calls.filter(c=>c.method==='answerCallbackQuery').at(-1).body.text,/فقط مدیر آینه/);
  await chat('nails',e,{id:OWNER}).press('ob:full:'+s.id);
  assert.equal(JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons WHERE id=?').get(s.id).settings).trial,undefined);
  assert.match(last(net).text,/دوباره فعال شد/);assert.equal(net.calls.filter(c=>c.method==='editMessageReplyMarkup').at(-1).body.reply_markup.inline_keyboard[0][0].text,'✅ فعال‌سازی کامل شد');
  assert.equal((await b()).status,200,'generation works again');assert.equal((await call(app,e,'/api/s/'+slug+'/public')).data.generation,true);
  // /admin shows the allowance (with the specialist's mobile) and can put a cap back.
  const c=(await call(app,e,'/api/edition/setup',{token:e.token,password})).cookie;
  assert.equal((await call(app,e,'/api/s/'+slug+'/public')).data.free,undefined);
  const o=await call(app,e,'/api/s/'+slug+'/owner',undefined,c);assert.equal(o.status,200);assert.deepEqual(o.data.free,{full:true,limit:20,used:20,phone:'09121234567'});
  assert.equal((await call(app,e,'/api/s/'+slug+'/owner/free',{limit:25})).status,401,'owner only');
  assert.equal((await call(app,e,'/api/s/'+slug+'/owner/free',{limit:25},c)).status,200);
  const o2=(await call(app,e,'/api/s/'+slug+'/owner',undefined,c)).data.free;assert.deepEqual([o2.full,o2.limit],[false,25]);
  assert.equal((await call(app,e,'/api/s/'+slug+'/owner/free',{full:true},c)).status,200);assert.equal((await call(app,e,'/api/s/'+slug+'/owner',undefined,c)).data.free.full,true);
  const html=await call(app,e,'/admin',undefined,c);assert.match(String(html.data),/freeCard/);
 }finally{net.restore()}
});

test('Bale: the same wizard in plain text builds a page linked to the Bale chat',async()=>{
 const net=mockNet(),e=await fixture('lashes');e.BALE_BOT_TOKEN='777:bale';e.BALE_BOT_USERNAME='ed_bale_bot';try{
  const c=chat('lashes',e,{p:'bale',id:4242});await build('lashes',e,net,{c,insta:'@mina.lash'});
  const s=e.DB.sql.prepare("SELECT * FROM salons WHERE slug='mina-lash'").get();assert(s);assert.equal(s.bale_chat_id,'4242');assert.equal(s.telegram_chat_id,null);
  assert.equal(e.DB.sql.prepare('SELECT maker FROM trials').get().maker,'bale:4242');
  const out=net.calls.filter(x=>x.p==='bale'&&x.method==='sendMessage');assert(out.length>8);assert(out.every(x=>!x.body.parse_mode&&!/<\/?b>/.test(x.body.text)),'Bale gets plain text');
  assert.match(out.at(-1).body.text,/https:\/\/lashes\.test\/s\/mina-lash\/book/);assert(out.some(x=>x.body.reply_markup?.keyboard?.[0]?.[0]?.request_contact));
  assert.match(String(s.name),/ناخن نگار/);
 }finally{net.restore()}
});
