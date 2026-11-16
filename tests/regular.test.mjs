// Regular customers (/try, image packs), referral rewards and generation timing.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';
import {panelHTML} from '../worker/panel.js';import {customerHTML} from '../worker/customer.js';
import {CUSTOMER_IMAGE_PRICE,CUSTOMER_PACKS,REFERRAL_IMAGES} from '../worker/customerprices.js';
import {PLANS} from '../worker/prices.js';

const origin='https://test.example';
const migrations=readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort();
function fixture(){const DB=database();for(const f of migrations)DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));return {DB,BUCKET:memoryBucket(),OWNER_EMAIL:'owner@test',JOB_TOKEN:'job-test',TRUST_PLATFORM_IDENTITY:'true',KIE_API_KEY:'mock'};}
const OWNER={user:'owner-a',email:'owner@test'};
async function call(env,path,body,{cookie='',user='',email='',headers:extra={}}={}){const headers={origin,'oai-authenticated-user-id':user,'oai-authenticated-user-email':email,cookie,...extra};let payload;if(body!==undefined){if(body instanceof Uint8Array){payload=body}else{headers['content-type']='application/json';payload=JSON.stringify(body)}}const res=await app.fetch(new Request(origin+path,{method:body===undefined?'GET':'POST',headers,body:payload}),env);let d;try{d=await res.json()}catch{d=null}return {status:res.status,data:d,cookie:res.headers.get('set-cookie')?.split(';')[0]};}
const png=()=>{const b=new Uint8Array(150);b.set([137,80,78,71,13,10,26,10]);return b};
async function guest(env,slug){const r=await call(env,'/api/s/'+slug+'/session',{});assert.equal(r.status,200,JSON.stringify(r));return {cookie:r.cookie};}
async function upload(env,slug,g){const r=await call(env,'/api/s/'+slug+'/upload?kind=original',png(),g);assert.equal(r.status,200,JSON.stringify(r));return r.data.id;}
const orderBody=(plan='pro',extra={})=>({plan,service:PLANS[plan]?.seats?'all':'hair',salon:'سالن نمونه',name:'سارا محمدی',phone:'۰۹۱۲۱۲۳۴۵۶۷',city:'تهران',consent:true,...extra});
const confirm=(e,id)=>call(e,'/api/owner/orders/'+id+'/confirm',{},OWNER);
async function planSalon(e,plan,phone,name,cookie=''){
 const o=await call(e,'/api/order',orderBody(plan,{phone,salon:name}),{cookie});assert.equal(o.status,200,JSON.stringify(o));
 await confirm(e,o.data.id);
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});
 const row=e.DB.sql.prepare('SELECT s.id,s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id);
 return {...row,cookie:login.cookie,order:o.data};
}
const credits=(e,salonId)=>e.DB.sql.prepare('SELECT COALESCE(SUM(delta),0) n FROM credit_ledger WHERE salon_id=?').get(salonId).n;
/* The image service stand-in: uploads, tasks and a finished task record with timestamps. */
function mockProvider(){const prev=globalThis.fetch;let n=0;globalThis.fetch=async(url,opts)=>{const u=String(url);
 if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});
 if(u.includes('createTask'))return Response.json({code:200,data:{taskId:'task'+(++n)}});
 if(u.includes('recordInfo'))return Response.json({code:200,data:{state:'success',model:'nano-banana-pro',createTime:1790000000000,completeTime:1790000041000,resultJson:JSON.stringify({resultUrls:['https://provider.example/out.png']})}});
 if(u.startsWith('https://provider.example/'))return new Response(png());
 if(u.includes('api.telegram.org')||u.includes('bale'))return Response.json({ok:true,result:{}});
 return prev(url,opts)};return {restore(){globalThis.fetch=prev}};}
const gen=(e,slug,g,original,v,line='hair',extra={})=>call(e,'/api/s/'+slug+'/generate',{image_consent:true,idem:crypto.randomUUID(),line,original_id:original,style:0,v,...extra},g);
async function webhookPay(e,ref,amount){const key=(await call(e,'/api/owner/payment',undefined,OWNER)).data.webhook.key;
 return app.fetch(new Request(origin+'/api/pay/confirm',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key},body:JSON.stringify({ref,amount,status:'paid'})}),e);}

test('/try: the regular customer page carries the owner\'s copy and embeds the real try-on of the direct salon',async()=>{
 const e=fixture();
 const res=await app.fetch(new Request(origin+'/try'),e);assert.equal(res.status,200);const html=await res.text();
 for(const t of ['مدل مو، رنگ، ناخن و مژه را روی عکس خودتان ببینید.','یک نمونهٔ رایگان. بدون نصب.','نمونهٔ رایگانتان استفاده شد.','ثبت‌نام کنید و حسابتان را شارژ کنید.','آرایشگر یا آرایشگاه‌دار می‌شناسید؟ لینک شما را به او بدهید؛ اگر پلن آینه بگیرد، ۱۰ تصویر هدیه می‌گیرید.','نتیجه تقریبی است. عکس شما فقط برای ساخت نمونه استفاده می‌شود؛ نسخهٔ فشردهٔ آن برای ساخت تصویر به سرویس تصویر ارسال می‌شود.','تعداد بیشتر می‌خواهم','تصاویر به حساب شما اضافه شد.'])
  assert.ok(html.includes(t),'copy: '+t);
 assert.match(html,/<iframe id="trFrame" src="\/s\/try\?embed=1"/);
 // what a salon buys is a «پلن» (AGENTS.md); the photo line says where the photo goes, honestly
 assert.doesNotMatch(html,/پنل آینه بگیرد|فقط برای ساخت همین نمونه/);
 const row=e.DB.sql.prepare("SELECT id,slug,owner_id FROM salons WHERE id='ayneh-direct'").get();assert.equal(row.slug,'try');assert.equal(row.owner_id,'direct');
 assert.equal((await app.fetch(new Request(origin+'/try'),e)).status,200);assert.equal(e.DB.sql.prepare("SELECT COUNT(*) n FROM salons WHERE owner_id='direct'").get().n,1,'made once');
 const pub=await call(e,'/api/s/try/public');assert.equal(pub.data.demo,false);assert.equal(pub.data.generation,true);
 // Every salon page carries the pack sheet; the inline scripts still parse.
 const salonPage=await (await app.fetch(new Request(origin+'/s/try'),e)).text();assert.ok(salonPage.includes('window.AynehPacks='));
 for(const src of [html,salonPage].flatMap(x=>[...x.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1])))assert.doesNotThrow(()=>new Function(src));
 // A paid salon called "Try" never takes over the direct page.
 const plan=await planSalon(e,'essential','09125550001','Try');assert.notEqual(plan.slug,'try');
});

test('regular customer: 1 free image in all, then packs priced only by the server, confirmed by the webhook, never from a salon credit',async()=>{
 const e=fixture(),p=mockProvider();
 try{
  await app.fetch(new Request(origin+'/try'),e);
  const g=await guest(e,'try'),original=await upload(e,'try',g),v='cd'.repeat(16);
  assert.equal((await gen(e,'try',g,original,v,'hair')).status,200,'the one free try');
  const out=await gen(e,'try',g,original,v,'color',{color:'شرابی',style:undefined});
  assert.equal(out.status,429);assert.match(out.data.error,/نمونهٔ رایگانتان استفاده شد/);
  let sess=await call(e,'/api/s/try/session?v='+v,undefined,g);assert.equal(sess.data.quota.free,0);assert.deepEqual(Object.values(sess.data.quota.left),[0,0,0,0]);
  let me=await call(e,'/api/c/me?v='+v,undefined,g);
  assert.equal(me.data.free.left,0);assert.equal(me.data.own.left,0);assert.equal(me.data.price,30000);assert.equal(me.data.custom_default,13);
  assert.deepEqual(me.data.packs,[{count:6,amount:180000},{count:9,amount:270000},{count:12,amount:360000}]);
  // Counts outside 1..500 are refused; the browser never sets the amount.
  for(const count of [0,-3,1.5,501,'x'])assert.equal((await call(e,'/api/c/order',{count,v},g)).status,400,String(count));
  const six=await call(e,'/api/c/order',{count:6,v,amount:1},g);assert.equal(six.status,200,JSON.stringify(six));
  assert.equal(six.data.amount,180000);assert.equal(six.data.kind,'customer_pack');assert.match(six.data.ref,/^AY[2-9A-HJ-NP-Z]{6}$/);
  const more=await call(e,'/api/c/order',{count:13,v},g);assert.equal(more.data.amount,13*CUSTOMER_IMAGE_PRICE,'13 × 30,000 toman');
  assert.equal((await call(e,'/api/c/order/'+six.data.id)).data.status,'cancelled','a new pack replaces her open one');
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,0,'nothing before payment');
  assert.equal((await call(e,'/api/panel/login',{key:'AY-'+'2'.repeat(9)})).status,401);
  // The payment site confirms it like any order; the amount must match.
  assert.equal((await webhookPay(e,more.data.ref,1000)).status,409);
  const paid=await webhookPay(e,more.data.ref,390000);assert.equal(paid.status,200);
  assert.equal((await call(e,'/api/c/order/'+more.data.id)).data.status,'paid');
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,13,'تصاویر به حساب شما اضافه شد');
  await confirm(e,more.data.id);assert.equal((await webhookPay(e,more.data.ref,390000)).status,200);
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,13,'a second confirmation grants nothing');
  // Her own images now make images; a failed one is given back.
  const next=await gen(e,'try',g,original,v,'hair');assert.equal(next.status,200,JSON.stringify(next));
  const acc=e.DB.sql.prepare('SELECT id FROM customer_accounts WHERE visitor=?').get(v).id;
  assert.equal(e.DB.sql.prepare('SELECT paid_by FROM generations WHERE id=?').get(next.data.id).paid_by,acc);
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,12);
  e.DB.sql.prepare("UPDATE generations SET state='fail' WHERE id=?").run(next.data.id);
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,13);
  sess=await call(e,'/api/s/try/session?v='+v,undefined,g);assert.equal(sess.data.quota.left.hair,13);
  const list=(await call(e,'/api/owner/orders',undefined,OWNER)).data.orders.find(o=>o.id===more.data.id);
  assert.equal(list.plan,'بستهٔ ۱۳ تصویر مشتری');assert.equal(list.kind,'customer_pack');
 }finally{p.restore()}
});

test('salon page: past the 3 images per service the customer buys her own pack; the salon credit is untouched and sending stays open',async()=>{
 const e=fixture(),p=mockProvider();
 try{
  const salon=await planSalon(e,'essential','09125550010','Credit Salon');
  const g=await guest(e,salon.slug),original=await upload(e,salon.slug,g),v='ef'.repeat(16);
  for(let i=0;i<3;i++)assert.equal((await gen(e,salon.slug,g,original,v)).status,200);
  const out=await gen(e,salon.slug,g,original,v);assert.equal(out.status,429);assert.match(out.data.error,/سهم امتحان «مدل مو»/);
  const order=await call(e,'/api/c/order',{count:6,v},g);assert.equal(order.status,200,JSON.stringify(order));
  await confirm(e,order.data.id);
  const sess=await call(e,'/api/s/'+salon.slug+'/session?v='+v,undefined,g);assert.equal(sess.data.quota.left.hair,6);assert.equal(sess.data.quota.left.nails,9,'3 free + 6 own');
  const usedBefore=(await (await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:salon.cookie}}),e)).json()).credits.used;
  assert.equal((await gen(e,salon.slug,g,original,v)).status,200,'her own image');
  const after=(await (await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:salon.cookie}}),e)).json()).credits;
  assert.equal(after.used,usedBefore,'a customer-paid image is not taken from the salon credit');
  assert.equal(usedBefore,3);
  // The pack sheet is offered from the quota notice; the send button is untouched.
  assert.ok(customerHTML.includes('window.AynehPacks.button()'));assert.ok(customerHTML.includes("window.addEventListener('ayneh:credited'"));
 }finally{p.restore()}
});

test('referral: both sides get 10 images once the plan is paid; never twice, never to yourself, with no cap',async()=>{
 const e=fixture();
 const a=await planSalon(e,'essential','09120000001','Referrer Salon');
 const card=await call(e,'/api/panel/referral',undefined,{cookie:a.cookie});assert.equal(card.status,200);
 assert.match(card.data.link,/\/\?ref=R[2-9A-HJ-NP-Z]{7}$/);assert.equal(card.data.rewarded,0);assert.equal(card.data.cap,undefined);
 assert.equal((await call(e,'/api/panel/referral')).status,401);
 assert.ok(panelHTML.includes('آرایشگر دیگری را معرفی کنید. هر دو ۱۰ عکس هدیه می‌گیرید.'));
 const code=card.data.link.split('ref=')[1];
 // The link sets a first-party cookie; the first valid link wins; junk is ignored.
 const land=await app.fetch(new Request(origin+'/?ref='+code),e);assert.match(land.headers.get('set-cookie'),new RegExp('^ayneh_ref='+code+'; HttpOnly; Secure; SameSite=Lax'));
 assert.equal((await app.fetch(new Request(origin+'/hair?ref=RXXXXXXX',{headers:{cookie:'ayneh_ref='+code}}),e)).headers.get('set-cookie'),null);
 assert.equal((await app.fetch(new Request(origin+'/nails?ref=<x>'),e)).headers.get('set-cookie'),null);
 const ref={cookie:'ayneh_ref='+code};
 const before=credits(e,a.id);
 const o=await call(e,'/api/order',orderBody('pro',{phone:'09120000002',salon:'Second Salon'}),ref);
 assert.equal(credits(e,a.id),before,'nothing before the payment is confirmed');
 assert.equal(e.DB.sql.prepare('SELECT COUNT(*) n FROM referral_rewards').get().n,0);
 await confirm(e,o.data.id);
 const b=e.DB.sql.prepare('SELECT salon_id FROM orders WHERE id=?').get(o.data.id).salon_id;
 assert.equal(credits(e,b),PLANS.pro.credits+REFERRAL_IMAGES,'buyer: plan gift + 10');
 assert.equal(credits(e,a.id),before+REFERRAL_IMAGES,'referrer: +10');
 await confirm(e,o.data.id);
 assert.equal(credits(e,a.id),before+REFERRAL_IMAGES,'idempotent per order');assert.equal(credits(e,b),PLANS.pro.credits+REFERRAL_IMAGES);
 assert.equal((await call(e,'/api/panel/referral',undefined,{cookie:a.cookie})).data.rewarded,1);
 // Self-referral: the referrer renews through its own link.
 const self=await call(e,'/api/order',orderBody('essential',{phone:'09120000001',salon:'Referrer Salon'}),ref);await confirm(e,self.data.id);
 assert.equal(e.DB.sql.prepare('SELECT outcome FROM referral_rewards WHERE order_id=?').get(self.data.id).outcome,'self');
 assert.equal(credits(e,a.id),before+REFERRAL_IMAGES+PLANS.essential.credits,'only the renewal gift, no referral images');
 // The buyer renewing later through the same link is not a new referral.
 const again=await call(e,'/api/order',orderBody('essential',{phone:'09120000002',salon:'Second Salon'}),ref);await confirm(e,again.data.id);
 assert.match(e.DB.sql.prepare('SELECT outcome FROM referral_rewards WHERE order_id=?').get(again.data.id).outcome,/existing|repeat/);
 // No cap (owner's decision): a later referral still rewards both sides, even with an old cap setting left in the database.
 e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('referral_cap','1',0)").run();
 const third=await call(e,'/api/order',orderBody('essential',{phone:'09120000003',salon:'Third Salon'}),ref);await confirm(e,third.data.id);
 const c=e.DB.sql.prepare('SELECT salon_id FROM orders WHERE id=?').get(third.data.id).salon_id;
 assert.equal(e.DB.sql.prepare('SELECT outcome FROM referral_rewards WHERE order_id=?').get(third.data.id).outcome,'rewarded');
 assert.equal(credits(e,c),PLANS.essential.credits+REFERRAL_IMAGES);assert.equal(credits(e,a.id),before+2*REFERRAL_IMAGES+PLANS.essential.credits);
 // A code in the body works too; an unknown one is ignored.
 const junk=await call(e,'/api/order',orderBody('essential',{phone:'09120000004',salon:'Fourth Salon',ref:'R2222222'}));
 assert.equal(e.DB.sql.prepare('SELECT COUNT(*) n FROM order_referrals WHERE order_id=?').get(junk.data.id).n,0);
});

test('referral by a regular customer: her 10 images land in her own account; her own mobile is no referral',async()=>{
 const e=fixture();await app.fetch(new Request(origin+'/try'),e);
 const g=await guest(e,'try'),v='12'.repeat(16);
 const me=await call(e,'/api/c/me?v='+v+'&ref=1',undefined,g);assert.ok(me.data.referral,JSON.stringify(me.data));
 const code=me.data.referral.link.split('ref=')[1];
 const o=await call(e,'/api/order',orderBody('essential',{phone:'09120000020',salon:'Friend Salon'}),{cookie:'ayneh_ref='+code});await confirm(e,o.data.id);
 assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,REFERRAL_IMAGES);
 const salonId=e.DB.sql.prepare('SELECT salon_id FROM orders WHERE id=?').get(o.data.id).salon_id;assert.equal(credits(e,salonId),PLANS.essential.credits+REFERRAL_IMAGES);
 e.DB.sql.prepare("UPDATE customer_accounts SET phone='+989120000021' WHERE visitor=?").run(v);
 const own=await call(e,'/api/order',orderBody('essential',{phone:'09120000021',salon:'Her Own Salon'}),{cookie:'ayneh_ref='+code});await confirm(e,own.data.id);
 assert.equal(e.DB.sql.prepare('SELECT outcome FROM referral_rewards WHERE order_id=?').get(own.data.id).outcome,'self');
});

test('timing: a successful image stores how long it took; the owner sees it, nobody else; nothing is claimed before a measurement',async()=>{
 const e=fixture(),p=mockProvider();
 try{
  const empty=await call(e,'/api/owner/timing',undefined,OWNER);assert.equal(empty.status,200);assert.equal(empty.data.measured,false);assert.match(empty.data.note,/هنوز هیچ تصویر واقعی/);
  assert.equal((await call(e,'/api/owner/timing')).status,401);
  await app.fetch(new Request(origin+'/try'),e);
  const g=await guest(e,'try'),original=await upload(e,'try',g),v='34'.repeat(16);
  const job=await gen(e,'try',g,original,v);assert.equal(job.status,200);
  const done=await call(e,'/api/s/try/generation/'+job.data.id,undefined,g);assert.equal(done.data.state,'success',JSON.stringify(done));
  await call(e,'/api/s/try/generation/'+job.data.id,undefined,g);
  const t=await call(e,'/api/owner/timing',undefined,OWNER);
  assert.equal(t.data.measured,true);assert.equal(t.data.wall.count,1,'stored once');assert.ok(t.data.wall.median>=0&&t.data.wall.median<60000);
  assert.equal(t.data.provider.median,41000,'the service\'s own createTime → completeTime');
  assert.equal(e.DB.sql.prepare('SELECT model FROM generation_timings').get().model,'nano-banana-pro');
 }finally{p.restore()}
});

test('/try: a pack replaced by a newer one is still honoured when its exact amount arrives; paid images are not stopped by the shared daily cap',async()=>{
 const e=fixture(),p=mockProvider();
 try{
  await app.fetch(new Request(origin+'/try'),e);
  // the direct salon is shared by every visitor: give it a tiny daily cap so other people's free images fill it
  e.DB.sql.prepare("UPDATE salons SET settings=json_set(settings,'$.daily_limit',1) WHERE id='ayneh-direct'").run();
  const g=await guest(e,'try'),original=await upload(e,'try',g),v='ab'.repeat(16);
  assert.equal((await gen(e,'try',g,original,v,'hair')).status,200);
  const capped=await gen(e,'try',g,original,v,'nails');assert.equal(capped.status,429,'the free images hit the cap');
  // two packs: the first is replaced, but its transfer was already made
  const six=await call(e,'/api/c/order',{count:6,v},g),nine=await call(e,'/api/c/order',{count:9,v},g);
  assert.equal((await call(e,'/api/c/order/'+six.data.id)).data.status,'cancelled');
  assert.equal((await webhookPay(e,six.data.ref,180000)).status,200,'the exact amount of the replaced pack confirms it');
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,6);
  // her own images ignore the salon's daily cap (they are hers, not the salon's free images)
  const own=await gen(e,'try',g,original,v,'lashes');assert.equal(own.status,200,JSON.stringify(own.data));
  const acc=e.DB.sql.prepare('SELECT id FROM customer_accounts WHERE visitor=?').get(v).id;
  assert.equal(e.DB.sql.prepare('SELECT paid_by FROM generations WHERE id=?').get(own.data.id).paid_by,acc,'paid_by is on the row from the start');
  assert.equal((await call(e,'/api/c/me?v='+v,undefined,g)).data.own.left,5,'one of her six');
  assert.equal(nine.data.status,'open');
 }finally{p.restore()}
});
