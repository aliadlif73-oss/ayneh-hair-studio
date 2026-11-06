// Booking (نوبت‌دهی): specialist editions only.
import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';
import {hash} from '../worker/domain.js';
const lines=['hair','color','nails','lashes'],apps={},mods={};
for(const l of lines){apps[l]=(await import('../editions-dist/'+l+'/worker/edition-entry.js')).default;mods[l]=await import('../editions-dist/'+l+'/worker/booking.js');}
const main=(await import('../worker/index.js')).default;
const password='Only-new-editions-2026!',CHAT=900;
function migrate(DB){for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort())DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));return DB}
async function fixture(line){const DB=migrate(database()),token=crypto.randomUUID();return {DB,BUCKET:memoryBucket(),APP_ORIGIN:'https://'+line+'.test',SESSION_SECRET:crypto.randomUUID(),CONFIG_ENCRYPTION_KEY:'b'.repeat(64),BOOTSTRAP_HASH:await hash(token),BOOTSTRAP_EXPIRES:Date.now()+60000,TELEGRAM_WEBHOOK_SECRET:'hook-secret',TELEGRAM_BOT_TOKEN:'123:abc',TELEGRAM_BOT_USERNAME:'ed_bot',MELIPAYAMAK_TOKEN:'dev-mock',token};}
async function call(app,e,path,body,cookie=''){const r=await app.fetch(new Request(e.APP_ORIGIN+path,{method:body===undefined?'GET':'POST',headers:{origin:e.APP_ORIGIN,cookie,'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)}),e);const t=await r.text();let d;try{d=JSON.parse(t)}catch{d=t}return {status:r.status,data:d,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const hook=(l,e,update)=>apps[l].fetch(new Request(e.APP_ORIGIN+'/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':'hook-secret'},body:JSON.stringify({update_id:Math.floor(Math.random()*1e9),...update})}),e);
const press=(l,e,data,chat=CHAT)=>hook(l,e,{callback_query:{id:'q'+Math.random(),data,message:{message_id:5,chat:{id:chat,type:'private'}}}});
const say=(l,e,text,chat=CHAT)=>hook(l,e,{message:{message_id:7,chat:{id:chat,type:'private'},text}});
// Telegram and Melipayamak are mocked; every outgoing call is recorded.
function mockNet(){const calls=[],previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url);const body=JSON.parse(init?.body||'{}');
 if(u.startsWith('https://api.telegram.org/')){calls.push({method:u.split('/').pop(),body});return Response.json({ok:true,result:{message_id:calls.length}})}
 if(u.startsWith('https://console.melipayamak.com/')){calls.push({method:'sms:'+u.split('/')[5],body});return Response.json({recId:'98765432101',status:'ok'})}
 throw Error('Unexpected network '+u)};return {calls,restore(){globalThis.fetch=previous},sent:()=>calls.filter(c=>c.method==='sendMessage')};}
async function specialist(l='nails'){
 const e=await fixture(l),app=apps[l],c=(await call(app,e,'/api/edition/setup',{token:e.token,password})).cookie;
 assert.equal((await call(app,e,'/api/salons',{slug:'sara',name:'سارا'},c)).status,200);
 e.DB.sql.exec("UPDATE salons SET telegram_chat_id='"+CHAT+"' WHERE slug='sara'");return {e,app};
}
async function customer(app,e,number='09120000001',first='مینا'){
 const g=(await call(app,e,'/api/s/sara/session',{})).cookie;
 assert.equal((await call(app,e,'/api/s/sara/otp/send',{first_name:first,last_name:'رضایی',phone:number},g)).status,200);
 assert.equal((await call(app,e,'/api/s/sara/otp/verify',{code:'12345'},g)).status,200);return g;
}
const freeAt=(d,skip=0)=>d.days.flatMap(x=>x.slots.filter(s=>!s.taken)).map(s=>s.at)[skip];
const status=(e,id)=>e.DB.sql.prepare('SELECT status,start_at FROM bookings WHERE id=?').get(id);

test('main multi-salon app has no booking routes, page or UI',async()=>{
 const src=readFileSync(new URL('../worker/index.js',import.meta.url),'utf8');assert(!src.includes('booking'));
 const e={DB:migrate(database()),BUCKET:memoryBucket(),SESSION_SECRET:'x'.repeat(32)};
 e.DB.sql.exec("INSERT INTO salons(id,slug,owner_id,name,profile,settings,created_at) VALUES('s1','sara','o','سارا','{}','{}',1)");
 const page=await main.fetch(new Request('https://ayneh.test/s/sara'),e),html=await page.text();
 assert.equal(page.status,200);assert(!/bookcard|__AYNEH_BOOK__|رزرو نوبت|bk-slot/.test(html));
 assert.equal((await main.fetch(new Request('https://ayneh.test/s/sara/book'),e)).status,404);
 const api=await main.fetch(new Request('https://ayneh.test/api/s/sara/booking'),e);assert.notEqual(api.status,200);
 const {bookingAPI,bookingWebhook,bookingTick}=await import('../worker/booking.js');
 assert.equal(await bookingAPI(new Request('https://ayneh.test/api/s/sara/booking'),e),null,'no SERVICE_LINE, no booking');
 assert.equal(await bookingWebhook(new Request('https://ayneh.test/api/telegram/webhook',{method:'POST',body:'{}'}),e),null);
 assert.equal(await bookingTick(e),null);
});

test('slots respect working hours, closed days and existing bookings; defaults per line',()=>{
 const m=mods.color,now=Date.parse('2026-11-07T03:00:00Z');// Saturday 06:30 Tehran
 assert.deepEqual(Object.fromEntries(lines.map(l=>[l,m.bookingConfig({settings:'{}'},l).dur])),{hair:60,color:180,nails:120,lashes:120});
 const def=m.bookingConfig({settings:'{}'},'color');assert.deepEqual(def.days,[0,1,2,3,4,5]);assert.equal(def.from,10);assert.equal(def.to,19);
 const days=m.schedule(def,180,[],now,7);assert.equal(days[0].wd,'شنبه');assert.equal(days[6].wd,'جمعه');assert(days[6].closed,'Friday is closed by default');
 assert.deepEqual(days[0].slots.map(s=>s.t),['۱۰:۰۰','۱۱:۰۰','۱۲:۰۰','۱۳:۰۰','۱۴:۰۰','۱۵:۰۰','۱۶:۰۰'],'3-hour colour slots end by 19:00, hourly step');
 const cfg=m.bookingConfig({settings:JSON.stringify({booking:{days:[0,2,3],from:9,to:12,off:['2026-11-09']}})},'hair');
 const at=m.dayStart('2026-11-07')+10*3600000,list=m.schedule(cfg,60,[{start_at:at,end_at:at+3600000}],now,4);
 assert.deepEqual(list[0].slots.map(s=>[s.t,s.taken]),[['۰۹:۰۰',false],['۱۰:۰۰',true],['۱۱:۰۰',false]]);
 assert(list[1].closed,'Sunday not a working day');assert(list[2].closed,'Monday closed with /off');assert(!list[3].closed,'Tuesday open');
 const late=m.schedule(cfg,60,[],m.dayStart('2026-11-07')+10.75*3600000,1);assert.deepEqual(late[0].slots,[],'slots starting within 30 minutes are not offered');assert(late[0].full);
 assert.match(m.dayLabel(at),/^شنبه ۱۶ آبان$/);assert.equal(m.durationText(120),'حدود ۲ ساعت');
});

test('booking flow: verified mobile, request reaches only the specialist chat, overlap and one-open-per-mobile rejected',async()=>{
 const net=mockNet();try{const {e,app}=await specialist();
  const page=await call(app,e,'/s/sara/book');assert.equal(page.status,200);assert.match(page.data,/__AYNEH_BOOK__/);assert.match(page.data,/bk-slot/);assert.match(page.data,/id="bookcard"/);
  const plain=await call(app,e,'/s/sara');assert.match(plain.data,/bookcard/);assert(!plain.data.includes('window.__AYNEH_BOOK__=true'));
  const anon=await call(app,e,'/api/s/sara/booking');assert.equal(anon.status,200);assert.equal(anon.data.enabled,true);assert.equal(anon.data.duration,120);assert.equal(anon.data.booking,null);assert(anon.data.first);
  const g0=(await call(app,e,'/api/s/sara/session',{})).cookie;
  assert.equal((await call(app,e,'/api/s/sara/booking',{at:freeAt(anon.data)},g0)).status,403,'mobile must be verified when SMS is on');
  const g=await customer(app,e),d=(await call(app,e,'/api/s/sara/booking',undefined,g)).data,at=freeAt(d);
  const r=await call(app,e,'/api/s/sara/booking',{at,note:'اولین بار'},g);assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(r.data.booking.status,'pending');assert.equal(r.data.booking.phone,'۰۹۱۲•••۰۰۰۱');
  const msg=net.sent().at(-1);assert.equal(msg.body.chat_id,String(CHAT));assert.match(msg.body.text,/مینا رضایی/);assert.match(msg.body.text,/09120000001/);assert.match(msg.body.text,/حدود ۲ ساعت/);assert.match(msg.body.text,/اولین بار/);
  assert.deepEqual(msg.body.reply_markup.inline_keyboard.flat().map(b=>b.callback_data.split(':')[1]),['ok','no','mv']);assert(!net.calls.some(c=>c.method.startsWith('sendPhoto')||c.method==='sendMediaGroup'),'no photo is sent');
  assert.equal((await call(app,e,'/api/s/sara/booking',{at:freeAt(d,3)},g)).status,409,'one open booking per mobile');
  const other=await customer(app,e,'09120000002','نسترن');
  const taken=await call(app,e,'/api/s/sara/booking',{at},other);assert.equal(taken.status,409,'overlap rejected');
  const off=await call(app,e,'/api/s/sara/booking',{at:at+30*60000},other);assert.equal(off.status,409,'a time that is not a free slot is rejected');
  const view=(await call(app,e,'/api/s/sara/booking',undefined,other)).data;assert(view.days.flatMap(x=>x.slots).find(s=>s.at===at).taken,'pending holds the slot');
  // Race: a second row for the same time can never be written, even straight into the table.
  assert.throws(()=>e.DB.sql.prepare("INSERT INTO bookings(id,salon_id,session_id,phone,name,line,start_at,end_at,status,created_at) SELECT 'x',id,'s','+989120000003','x','nails',?,?,'pending',1 FROM salons WHERE slug='sara'").run(at+3600000,at+3*3600000),/BOOKING_CONFLICT/);
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM events_log WHERE meta LIKE ? OR meta LIKE ?').get('%0912%','%مینا%').n,0);
  // Cancel frees the slot and tells the specialist; then the same mobile may book again.
  assert.equal((await call(app,e,'/api/s/sara/booking/cancel',{id:r.data.booking.id},g)).status,200);assert.match(net.sent().at(-1).body.text,/لغو کرد/);
  assert.equal((await call(app,e,'/api/s/sara/booking',undefined,g)).data.booking,null);
  assert.equal((await call(app,e,'/api/s/sara/booking',{at},other)).status,200,'freed slot can be booked');
 }finally{net.restore()}
});

test('bot ✅ / ❌ / 🔁 change the status; only the edition\'s own specialist chat may press them; SMS only with the booking text id',async()=>{
 const net=mockNet();try{const {e,app}=await specialist('lashes');
  const g=await customer(app,e),d=(await call(app,e,'/api/s/sara/booking',undefined,g)).data;
  const id=(await call(app,e,'/api/s/sara/booking',{at:freeAt(d)},g)).data.booking.id;
  e.MELIPAYAMAK_TOKEN='console-token';
  await press('lashes',e,'bk:ok:'+id,4242);assert.equal(status(e,id).status,'pending','another chat cannot confirm');
  assert.match(net.calls.filter(c=>c.method==='answerCallbackQuery').at(-1).body.text,/فقط گفتگوی متخصص/);
  await press('lashes',e,'bk:ok:'+id);assert.equal(status(e,id).status,'confirmed');
  assert.equal(net.calls.filter(c=>c.method.startsWith('sms:')).length,0,'no booking SMS without MELIPAYAMAK_BOOKING_BODY_ID');
  const page=(await call(app,e,'/api/s/sara/booking',undefined,g)).data.booking;assert.equal(page.status,'confirmed');
  await press('lashes',e,'bk:no:'+id);assert.equal(status(e,id).status,'rejected');assert.equal((await call(app,e,'/api/s/sara/booking',undefined,g)).data.booking.status,'rejected');
  // 🔁 offers the next free times; choosing one moves the booking there and confirms it.
  e.MELIPAYAMAK_BOOKING_BODY_ID='424242';
  const d2=(await call(app,e,'/api/s/sara/booking',undefined,g)).data,id2=(await call(app,e,'/api/s/sara/booking',{at:freeAt(d2)},g)).data.booking.id,before=status(e,id2).start_at;
  await press('lashes',e,'bk:mv:'+id2);const offer=net.sent().at(-1).body.reply_markup.inline_keyboard.flat();assert(offer.length>=2&&offer.every(b=>b.callback_data.startsWith('bk:to:'+id2+':')));
  await press('lashes',e,offer[1].callback_data,4242);assert.equal(status(e,id2).status,'pending');
  await press('lashes',e,offer[1].callback_data);const moved=status(e,id2);assert.equal(moved.status,'confirmed');assert.notEqual(moved.start_at,before);assert.equal(moved.start_at,Number(offer[1].callback_data.split(':')[3])*60000);
  const now=(await call(app,e,'/api/s/sara/booking',undefined,g)).data.booking;assert.equal(now.at,moved.start_at);assert.equal(now.status,'confirmed');
  const sms=net.calls.filter(c=>c.method==='sms:shared');assert.equal(sms.length,1);assert.equal(sms[0].body.bodyId,424242);assert.equal(sms[0].body.to,'09120000001');assert.equal(sms[0].body.args[0],'سارا');assert.match(sms[0].body.args[1],/ساعت/);assert(!JSON.stringify(sms[0].body).includes('http'));
 }finally{net.restore()}
});

test('pending requests expire after 12 hours via tick and free the slot',async()=>{
 const net=mockNet();try{const {e,app}=await specialist('hair');
  const g=await customer(app,e),d=(await call(app,e,'/api/s/sara/booking',undefined,g)).data,at=freeAt(d);
  const id=(await call(app,e,'/api/s/sara/booking',{at},g)).data.booking.id,sent=net.sent().length;
  const env={...e,SERVICE_LINE:'hair'};
  assert.equal((await mods.hair.bookingTick(env,Date.now()+11*3600000)).expired,0);
  assert.equal((await mods.hair.bookingTick(env,Date.now()+12*3600000+60000)).expired,1);
  assert.equal(status(e,id).status,'expired');assert.equal(net.sent().length,sent,'the specialist gets nothing on expiry');
  const view=(await call(app,e,'/api/s/sara/booking',undefined,g)).data;assert.equal(view.booking.status,'expired');assert(!view.days.flatMap(x=>x.slots).find(s=>s.at===at)?.taken);
  await press('hair',e,'bk:ok:'+id);assert.equal(status(e,id).status,'expired','an expired request cannot be confirmed');
 }finally{net.restore()}
});

test('nightly digest of tomorrow is sent once per day at 21:00 Tehran',async()=>{
 const net=mockNet();try{const {e,app}=await specialist('color');const m=mods.color,env={...e,SERVICE_LINE:'color'};
  const g=await customer(app,e),d=(await call(app,e,'/api/s/sara/booking',undefined,g)).data,today=m.tehran(Date.now()).date;
  const tomorrow=d.days.find(x=>x.date>today&&x.slots.some(s=>!s.taken));const at=tomorrow.slots.find(s=>!s.taken).at;
  const id=(await call(app,e,'/api/s/sara/booking',{at},g)).data.booking.id;await press('color',e,'bk:ok:'+id);
  const day=m.dayStart(tomorrow.date)-86400000;// the evening before that day
  assert.equal(await m.bookingDigest(env,day+20.5*3600000),0,'not before 21:00');
  assert.equal(await m.bookingDigest(env,day+21.2*3600000),1);const msg=net.sent().at(-1).body.text;assert.match(msg,/نوبت‌های فردا/);assert.match(msg,/مینا رضایی/);
  assert.equal(await m.bookingDigest(env,day+21.4*3600000),0,'same day: not again');
  assert.equal(await m.bookingDigest(env,day+23*3600000),0);
 }finally{net.restore()}
});

test('/hours, custom hours, /off, /today and /link in the specialist bot',async()=>{
 const net=mockNet();try{const {e,app}=await specialist('nails');const cfg=()=>JSON.parse(e.DB.sql.prepare("SELECT settings FROM salons WHERE slug='sara'").get().settings).booking||{};
  await say('nails',e,'/hours');const kb=net.sent().at(-1).body.reply_markup.inline_keyboard.flat();assert.equal(kb.length,8);assert.match(kb[0].text,/✅ شنبه/);assert.match(kb[6].text,/▫️ جمعه/);
  await press('nails',e,'bk:hd:63:6');assert.equal(net.calls.at(-2).method,'editMessageReplyMarkup');assert.match(net.calls.at(-2).body.reply_markup.inline_keyboard[1][2].text,/✅ جمعه/);
  await press('nails',e,'bk:hn:127');const presets=net.sent().at(-1).body.reply_markup.inline_keyboard.flat().map(b=>b.text);assert.deepEqual(presets,['۹ تا ۱۷','۱۰ تا ۱۹','۱۲ تا ۲۰','ساعت دیگر']);
  await press('nails',e,'bk:hp:127:9:17');assert.deepEqual([cfg().days,cfg().from,cfg().to],[[0,1,2,3,4,5,6],9,17]);assert.match(net.sent().at(-1).body.text,/حدود ۲ ساعت/);assert.match(net.sent().at(-1).body.text,/\/off/);
  await press('nails',e,'bk:hc:3');await say('nails',e,'۱۰ تا ۱۹');assert.deepEqual([cfg().days,cfg().from,cfg().to,cfg().wait],[[0,1],10,19,undefined]);
  await say('nails',e,'/hours',4242);assert.match(net.sent().at(-1).body.text,/هیچ|وصل نیست/,'a stranger gets the original bot reply, not booking');
  await press('nails',e,'bk:hc:127');await say('nails',e,'10-18');assert.deepEqual([cfg().from,cfg().to],[10,18]);
  await say('nails',e,'/off');const days=net.sent().at(-1).body.reply_markup.inline_keyboard.flat(),open=days.find(b=>b.callback_data.startsWith('bk:off:'));
  await press('nails',e,open.callback_data);const date=open.callback_data.slice(7).replace(/(\d{4})(\d\d)(\d\d)/,'$1-$2-$3');assert.deepEqual(cfg().off,[date]);
  const g=(await call(app,e,'/api/s/sara/session',{})).cookie;assert((await call(app,e,'/api/s/sara/booking',undefined,g)).data.days.find(x=>x.date===date).closed);
  await press('nails',e,open.callback_data);assert.deepEqual(cfg().off,[]);
  await say('nails',e,'/today');assert.match(net.sent().at(-1).body.text,/نوبت‌های امروز/);
  const before=net.sent().length;await say('nails',e,'/link');const replies=net.sent().slice(before);assert.equal(replies.length,2,'original link reply plus the booking link');assert.match(replies[1].body.text,new RegExp(e.APP_ORIGIN.replace(/\./g,'\\.')+'/s/sara/book'));
 }finally{net.restore()}
});

test('demo page and a specialist without a bot chat cannot take bookings',async()=>{
 const net=mockNet();try{const {e,app}=await specialist('hair');e.DB.sql.exec("UPDATE salons SET telegram_chat_id=NULL");
  const g=await customer(app,e),d=(await call(app,e,'/api/s/sara/booking',undefined,g)).data;assert.equal(d.enabled,false);
  assert.equal((await call(app,e,'/api/s/sara/booking',{at:Date.now()+86400000},g)).status,503);
  await call(app,e,'/api/s/demo/public');assert.equal((await call(app,e,'/api/s/demo/booking')).data.enabled,false);
 }finally{net.restore()}
});
