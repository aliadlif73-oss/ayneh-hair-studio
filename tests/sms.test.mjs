import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';import {customerHTML} from '../worker/customer.js';

const origin='https://test.example',OWNER={user:'owner-a',email:'owner@test'};
const migrations=readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort();
function fixture(extra={}){const DB=database();for(const f of migrations)DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));return {DB,BUCKET:memoryBucket(),OWNER_EMAIL:'owner@test',JOB_TOKEN:'job-test',TRUST_PLATFORM_IDENTITY:'true',...extra}}
const sms={MELIPAYAMAK_TOKEN:'tok',MELIPAYAMAK_OTP_BODY_ID:'1001',MELIPAYAMAK_INVITE_BODY_ID:'1002'};
async function call(env,path,body,{cookie='',user='',email=''}={}){const headers={origin,'oai-authenticated-user-id':user,'oai-authenticated-user-email':email,cookie};let payload;if(body!==undefined){if(body instanceof Uint8Array)payload=body;else{headers['content-type']='application/json';payload=JSON.stringify(body)}}const res=await app.fetch(new Request(origin+path,{method:body===undefined?'GET':'POST',headers,body:payload}),env);let d;try{d=await res.json()}catch{d=null}return {status:res.status,data:d,cookie:res.headers.get('set-cookie')?.split(';')[0]};}
async function salon(env,slug='salon-a'){const r=await call(env,'/api/salons',{slug,name:'سالن '+slug},OWNER);assert.equal(r.status,200);return {slug};}
async function guest(env,s){const r=await call(env,'/api/s/'+s.slug+'/session',{});return {cookie:r.cookie};}
const png=()=>{const b=new Uint8Array(150);b.set([137,80,78,71,13,10,26,10]);return b};
// Melipayamak + Telegram + image provider stand-in.
function mock({reject=false,offline=false}={}){const calls={sms:[],tg:[]};const previous=globalThis.fetch;
 globalThis.fetch=async(url,init)=>{const u=String(url);
  if(u.startsWith('https://console.melipayamak.com/')){if(offline)throw new TypeError('fetch failed');const b=JSON.parse(init.body);calls.sms.push({url:u,...b});return Response.json(reject?{recId:0,status:'invalid bodyId'}:{recId:'5800000000012345'+calls.sms.length,status:''});}
  if(u.startsWith('https://rest.payamak-panel.com/')){const b=Object.fromEntries(new URLSearchParams(init.body));calls.sms.push({url:u,...b});return Response.json(reject?{Value:'-110',RetStatus:35,StrRetStatus:'InvalidData'}:{Value:'1234567890123456',RetStatus:1,StrRetStatus:'Ok'});}
  if(u.startsWith('https://api.telegram.org/')){calls.tg.push({method:u.split('/').pop(),body:JSON.parse(init?.body||'{}')});return Response.json({ok:true,result:{message_id:1}});}
  if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/a.jpg'}});
  if(u.includes('createTask'))return Response.json({code:200,data:{taskId:'t1'}});
  return previous(url,init)};
 return {calls,restore(){globalThis.fetch=previous}};}
const codeOf=m=>m.calls.sms.at(-1).args?.[0]??m.calls.sms.at(-1).text;

test('customer page script still parses with the verification sheet',()=>{new Function(customerHTML.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1]);assert.match(customerHTML,/otp\/verify/);});

test('OTP: generation is blocked until the mobile is verified, then the verified identity is used',async()=>{const e=fixture({...sms,KIE_API_KEY:'mock',SESSION_SECRET:'s'}),s=await salon(e),g=await guest(e,s),m=mock();
 try{
  assert.equal((await call(e,'/api/s/salon-a/public')).data.otp,true);
  const up=await call(e,'/api/s/salon-a/upload?kind=original',png(),g);
  const gen={image_consent:true,idem:crypto.randomUUID(),original_id:up.data.id,style:0};
  const blocked=await call(e,'/api/s/salon-a/generate',gen,g);assert.equal(blocked.status,403);assert.match(blocked.data.error,/تأیید شمارهٔ موبایل/);
  assert.equal((await call(e,'/api/s/salon-a/otp/send',{name:'سا',phone:'09121234567'},g)).status,400,'name required');
  const sent=await call(e,'/api/s/salon-a/otp/send',{name:'سارا محمدی',phone:'۰۹۱۲۱۲۳۴۵۶۷'},g);assert.equal(sent.status,200,JSON.stringify(sent));
  const sm=m.calls.sms.at(-1);assert.equal(sm.to,'09121234567');assert.equal(sm.bodyId,1001);assert.match(sm.args[0],/^\d{5}$/);assert.match(sm.url,/\/api\/send\/shared\/tok$/);
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps WHERE code_hash=?').get(sm.args[0]).n,0,'code is stored hashed');
  assert.equal((await call(e,'/api/s/salon-a/otp/send',{name:'سارا محمدی',phone:'09121234567'},g)).status,429,'two-minute gap');
  const wrong=sm.args[0]==='11111'?'22222':'11111';
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:wrong},g)).status,400);
  const ok=await call(e,'/api/s/salon-a/otp/verify',{code:sm.args[0].replace(/\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])},g);assert.equal(ok.status,200,JSON.stringify(ok));assert.equal(ok.data.phone,'+989121234567');
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:sm.args[0]},g)).status,410,'a code works once');
  const sess=await call(e,'/api/s/salon-a/session',undefined,g);assert.equal(sess.data.verified,true);assert.equal(sess.data.name,'سارا محمدی');
  assert.equal((await call(e,'/api/s/salon-a/generate',gen,g)).status,200,'verified session may generate');
  const other=await guest(e,s);assert.equal((await call(e,'/api/s/salon-a/session',undefined,other)).data.verified,false,'verification belongs to one session');
 }finally{m.restore()}});

test('OTP: five wrong guesses burn the code; rejected sends store nothing; network doubt keeps the code',async()=>{const e=fixture({...sms,SESSION_SECRET:'s'}),s=await salon(e),g=await guest(e,s);
 let m=mock();try{await call(e,'/api/s/salon-a/otp/send',{name:'سارا محمدی',phone:'09121234567'},g);const real=codeOf(m),bad=real==='11111'?'22222':'11111';
  for(let i=0;i<5;i++)assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:bad},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:real},g)).status,429,'locked after five tries');}finally{m.restore()}
 const g2=await guest(e,s);m=mock({reject:true});try{const r=await call(e,'/api/s/salon-a/otp/send',{name:'مینا رضایی',phone:'09351112233'},g2);assert.equal(r.status,502);assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps WHERE phone=?').get('+989351112233').n,0);}finally{m.restore()}
 const g3=await guest(e,s);m=mock({offline:true});try{const r=await call(e,'/api/s/salon-a/otp/send',{name:'نگار احمدی',phone:'09191112233'},g3);assert.equal(r.status,200);assert.equal(e.DB.sql.prepare("SELECT status FROM sms_log WHERE phone=?").get('+989191112233').status,'unknown');}finally{m.restore()}
});

test('classic REST credentials send the pattern with ;-joined variables',async()=>{const e=fixture({MELIPAYAMAK_USERNAME:'u',MELIPAYAMAK_PASSWORD:'p',MELIPAYAMAK_OTP_BODY_ID:'77',SESSION_SECRET:'s'}),s=await salon(e),g=await guest(e,s),m=mock();
 try{assert.equal((await call(e,'/api/s/salon-a/otp/send',{name:'سارا محمدی',phone:'09121234567'},g)).status,200);const c=m.calls.sms.at(-1);assert.match(c.url,/BaseServiceNumber$/);assert.equal(c.bodyId,'77');assert.equal(c.to,'09121234567');assert.match(c.text,/^\d{5}$/);}finally{m.restore()}
 const g2=await guest(e,s),bad=mock({reject:true});try{assert.equal((await call(e,'/api/s/salon-a/otp/send',{name:'مینا رضایی',phone:'09351112233'},g2)).status,502);assert.match(e.DB.sql.prepare("SELECT error FROM sms_log WHERE phone=?").get('+989351112233').error,/code_-110 .*ApiKey/);}finally{bad.restore()}});

test('without Melipayamak settings nothing changes: no OTP gate',async()=>{const e=fixture({KIE_API_KEY:'mock'}),s=await salon(e),g=await guest(e,s),m=mock();
 try{assert.equal((await call(e,'/api/s/salon-a/public')).data.otp,false);const up=await call(e,'/api/s/salon-a/upload?kind=original',png(),g);assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:up.data.id,style:0},g)).status,200);assert.equal((await call(e,'/api/s/salon-a/otp/send',{name:'سارا محمدی',phone:'09121234567'},g)).status,503);}finally{m.restore()}});

test('Telegram: a salon sends a mobile number and the customer gets the salon link by SMS, once a day',async()=>{const e=fixture({...sms,TELEGRAM_BOT_TOKEN:'1:a',TELEGRAM_WEBHOOK_SECRET:'h',TELEGRAM_BOT_USERNAME:'ayneh_bot'}),s=await salon(e),m=mock();
 const hook=u=>app.fetch(new Request(origin+'/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':'h'},body:JSON.stringify(u)}),e);
 try{const link=await call(e,'/api/s/salon-a/owner/telegram-link',{},OWNER);await hook({message:{chat:{id:9,type:'private'},text:'/start '+link.data.code}});
  await hook({message:{chat:{id:9,type:'private'},text:'۰۹۱۲ ۱۲۳ ۴۵۶۷'}});
  const c=m.calls.sms.at(-1);assert.equal(c.bodyId,1002);assert.equal(c.to,'09121234567');assert.deepEqual(c.args,['سالن salon-a','salon-a']);
  assert.match(m.calls.tg.at(-1).body.text,/پیامک شد/);
  await hook({message:{chat:{id:9,type:'private'},text:'09121234567'}});assert.equal(m.calls.sms.length,1,'same number not texted twice a day');assert.match(m.calls.tg.at(-1).body.text,/امروز یک بار/);
  await hook({message:{chat:{id:9,type:'private'},contact:{phone_number:'+989351112233'}}});assert.equal(m.calls.sms.at(-1).to,'09351112233','shared contacts work');
  await hook({message:{chat:{id:9,type:'private'},text:'0912123'}});assert.equal(m.calls.sms.length,2);
  await hook({message:{chat:{id:12345,type:'private'},text:'09191112233'}});assert.equal(m.calls.sms.length,2,'unlinked chats cannot send');
 }finally{m.restore()}});
