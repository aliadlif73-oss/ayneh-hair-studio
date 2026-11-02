import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';
import {phone,transferPrompt} from '../worker/domain.js';import {appHTML} from '../worker/ui.js';import {customerHTML} from '../worker/customer.js';import {tick} from '../worker/server.js';import {styles} from '../worker/legacy.js';

const origin='https://test.example';
const migrations=readdirSync(new URL('../drizzle/',import.meta.url)).filter(f=>f.endsWith('.sql')).sort();
function fixture(){const DB=database();for(const f of migrations)DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));return {DB,BUCKET:memoryBucket(),OWNER_EMAIL:'owner@test',JOB_TOKEN:'job-test',TRUST_PLATFORM_IDENTITY:'true'};}
const OWNER={user:'owner-a',email:'owner@test'};
async function call(env,path,body,{cookie='',user='',email='',headers:extra={}}={}){const headers={origin,'oai-authenticated-user-id':user,'oai-authenticated-user-email':email,cookie,...extra};let payload;if(body!==undefined){if(body instanceof Uint8Array){payload=body}else{headers['content-type']='application/json';payload=JSON.stringify(body)}}const res=await app.fetch(new Request(origin+path,{method:body===undefined?'GET':'POST',headers,body:payload}),env);let d;try{d=await res.json()}catch{d=null}return {status:res.status,data:d,cookie:res.headers.get('set-cookie')?.split(';')[0]};}
async function salon(env,slug='salon-a'){const r=await call(env,'/api/salons',{slug,name:'سالن '+slug},OWNER);assert.equal(r.status,200,JSON.stringify(r));return {id:r.data.id,slug};}
async function guest(env,s){const r=await call(env,'/api/s/'+s.slug+'/session',{});assert.equal(r.status,200);return {cookie:r.cookie};}
const png=()=>{const b=new Uint8Array(150);b.set([137,80,78,71,13,10,26,10]);return b};
async function upload(env,s,g,kind='original'){const r=await call(env,'/api/s/'+s.slug+'/upload?kind='+kind,png(),g);assert.equal(r.status,200,JSON.stringify(r));return r.data.id;}
const lead=(original,extra={})=>({data_consent:true,idem:crypto.randomUUID(),name:'سارا محمدی',phone:'۰۹۱۲۱۲۳۴۵۶۷',original_id:original,look:'باب کوتاه',color:'بالیاژ عسلی',...extra});
// Telegram stand-in: records every call, never reaches the network.
function mockTelegram({fail=false}={}){const calls=[];const previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url);if(u.startsWith('https://api.telegram.org/file/'))return new Response(png());if(!u.startsWith('https://api.telegram.org/'))return previous(url,init);const method=u.split('/').pop();let body=init?.body;if(body instanceof FormData){const o={};for(const [k,v] of body.entries())o[k]=typeof v==='string'?v:'<file>';body=o}else body=JSON.parse(body||'{}');calls.push({method,body});if(fail)return Response.json({ok:false,description:'Bad Gateway'},{status:502});if(method==='getFile')return Response.json({ok:true,result:{file_path:'photos/x.jpg'}});if(method==='getMe')return Response.json({ok:true,result:{username:'ayneh_bot'}});if(method==='sendMediaGroup')return Response.json({ok:true,result:[{message_id:1},{message_id:2}]});return Response.json({ok:true,result:{message_id:1}})};return {calls,restore(){globalThis.fetch=previous}};}
const tgEnv=e=>Object.assign(e,{TELEGRAM_BOT_TOKEN:'123:abc',TELEGRAM_WEBHOOK_SECRET:'hook-secret',TELEGRAM_BOT_USERNAME:'ayneh_bot'});
const hook=(env,update,secret='hook-secret')=>app.fetch(new Request(origin+'/api/telegram/webhook',{method:'POST',headers:{'content-type':'application/json','x-telegram-bot-api-secret-token':secret},body:JSON.stringify(update)}),env);
async function linkSalon(env,s,chat=777,wizard=false){const r=await call(env,'/api/s/'+s.slug+'/owner/telegram-link',{},OWNER);assert.equal(r.status,200,JSON.stringify(r));assert.match(r.data.link,/^https:\/\/t\.me\/ayneh_bot\?start=[a-f0-9]{24}$/);await hook(env,{message:{chat:{id:chat,type:'private'},text:'/start '+r.data.code}});if(wizard===false)await hook(env,{message:{chat:{id:chat,type:'private'},text:'/stop'}});return r.data.code;}

test('pages parse; typed colour overrides the reference colour in every mode; Iranian mobiles normalise',()=>{
 new Function(appHTML.split('<script>')[1].split('</script>')[0]);
 new Function(customerHTML.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1]);
 assert.match(transferPrompt('style','',''),/Keep her original hair color/);assert.match(transferPrompt('color','',''),/Keep her exact haircut/);assert.match(transferPrompt('both','',''),/Never take the face from photo 2/);
 for(const m of ['style','color','both'])assert.match(transferPrompt(m,'','مسی'),/HAIR COLOR: copper .*overrides any hair color in photo 2/);
 assert.match(transferPrompt('catalog','Short bob','عسلی'),/chin-length bob[\s\S]*HAIR COLOR: honey brown/);
 assert.match(transferPrompt('catalog','Wolf cut','رنگی که نمی‌شناسم'),/a Persian hair-color name/);
 for(const m of ['style','color','both','catalog'])assert.match(transferPrompt(m,'Short bob',''),/IDENTITY LOCK[\s\S]*headscarf/);
 assert.equal(phone('۰۹۱۲۱۲۳۴۵۶۷'),'+989121234567');
 assert(!/appointment|services|staff|kavenegar/i.test(customerHTML.match(/<script>([\s\S]*?)<\/script>/)[1]),'customer page no longer books or texts');
});

test('only the project owner manages salons; salon panel routes are gone',async()=>{const e=fixture();
 assert.equal((await call(e,'/api/salons',{slug:'x-salon',name:'x'},{user:'stranger',email:'someone@else'})).status,403);
 const s=await salon(e);
 assert.equal((await call(e,'/api/s/salon-a/owner',undefined,{user:'stranger',email:'someone@else'})).status,403);
 assert.equal((await call(e,'/api/s/salon-a/owner')).status,401);
 assert.equal((await call(e,'/api/s/salon-a/owner',undefined,OWNER)).status,200);
 assert([404,405].includes((await call(e,'/api/s/salon-a/admin',undefined,OWNER)).status),'old panel API is gone');
 assert.equal((await call(e,'/api/s/salon-a/owner/profile',undefined,OWNER)).status,405,'mutations reject GET');
 const me=await call(e,'/api/me',undefined,OWNER);assert.equal(me.data.owner,true);
});

test('owner edits the salon profile; landline phones and links are accepted, bad links are not',async()=>{const e=fixture(),s=await salon(e);
 const ok=await call(e,'/api/s/salon-a/owner/profile',{name:'سالن آینه',profile:{bio:'معرفی',address:'تهران',hours:'۱۰ تا ۲۰',phone:'۰۲۱-۲۲۳۳۴۴۵۵',instagram:'https://instagram.com/x',map:'',telegram:'',website:''}},OWNER);
 assert.equal(ok.status,200,JSON.stringify(ok));
 const pub=await call(e,'/api/s/salon-a/public');assert.equal(pub.data.salon.name,'سالن آینه');assert.equal(pub.data.salon.profile.phone,'02122334455');assert.equal(pub.data.telegram,false);
 assert.equal((await call(e,'/api/s/salon-a/owner/profile',{name:'x',profile:{instagram:'javascript:alert(1)'}},OWNER)).status,400);
});

test('salon isolation and private photos: other guests and other salons cannot read an original',async()=>{const e=fixture(),a=await salon(e),b=await salon(e,'salon-b'),g=await guest(e,a),g2=await guest(e,a);
 const id=await upload(e,a,g);
 assert.equal((await call(e,'/api/s/salon-a/media/'+id,undefined,g)).status,200);
 assert.equal((await call(e,'/api/s/salon-a/media/'+id,undefined,g2)).status,403);
 assert.equal((await call(e,'/api/s/salon-b/media/'+id,undefined,g)).status,404);
 assert.equal((await call(e,'/api/s/salon-a/media/'+id)).status,401);
 assert.equal((await call(e,'/api/s/salon-a/media/'+id,undefined,OWNER)).status,200);
 assert.equal((await call(e,'/api/s/salon-a/session',undefined,g)).status,200);
 assert.equal((await call(e,'/api/s/salon-b/session',undefined,g)).status,401,'a session is bound to its salon');
 assert.equal((await call(e,'/api/s/salon-a/upload?kind=brand',png(),g)).status,401,'customers cannot upload brand images');
});

test('submissions need a linked salon; once linked they reach the salon chat with photos, name, mobile and handle',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s),original=await upload(e,s,g),reference=await upload(e,s,g,'reference');
 assert.equal((await call(e,'/api/s/salon-a/leads',lead(original),g)).status,503,'not linked yet');
 const tg=mockTelegram();try{
  await linkSalon(e,s);
  assert.equal(e.DB.sql.prepare('SELECT telegram_chat_id c FROM salons').get().c,'777');
  assert.equal((await call(e,'/api/s/salon-a/public')).data.telegram,true);
  const body=lead(original,{reference_id:reference,telegram:'@sara_m',note:'حنا دارم'});
  const r=await call(e,'/api/s/salon-a/leads',body,g);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.data.delivered,true);
  const sent=tg.calls.find(c=>c.method==='sendMediaGroup');assert(sent,'album sent');assert.equal(sent.body.chat_id,'777');
  const media=JSON.parse(sent.body.media);assert.equal(media.length,2);assert(media.every(m=>!m.caption),'no per-photo captions (Telegram hides captions when several exist)');
  const msg=tg.calls.find(c=>c.method==='sendMessage'&&c.body.chat_id==='777'&&/درخواست تازه/.test(c.body.text));assert(msg,'details message sent');const text=msg.body.text;
  for(const part of [/سارا محمدی/,/09121234567/,/\+989121234567/,/@sara_m/,/باب کوتاه/,/بالیاژ عسلی/,/حنا دارم/,/قبل: عکس خود مشتری/,/عکس مدلی که مشتری انتخاب کرده/,/شبیه‌سازی تصویری برای این درخواست ساخته نشده/])assert.match(text,part);
  assert.equal(msg.body.reply_parameters.message_id,1,'details reply to the album');const kb=msg.body.reply_markup.inline_keyboard.flat();assert.equal(kb.find(b=>b.url).url,'https://t.me/sara_m');assert.deepEqual(kb.filter(b=>b.callback_data).map(b=>b.callback_data.split(':')[1]),['called','booked','declined']);assert.match(r.data.follow.telegram,/^https:\/\/t\.me\/ayneh_bot\?start=f_[a-f0-9]{24}$/);
  const again=await call(e,'/api/s/salon-a/leads',body,g);assert.equal(again.data.id,r.data.id,'same idem is not sent twice');
  assert.equal(tg.calls.filter(c=>c.method==='sendMediaGroup').length,1);
  assert.equal((await call(e,'/api/s/salon-a/leads',{...lead(original),data_consent:false},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/leads',lead(original,{telegram:'not a handle!'}),g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/leads',lead(original,{phone:'12345'}),g)).status,400);
  const other=await guest(e,s);assert.equal((await call(e,'/api/s/salon-a/leads',lead(original),other)).status,403,'cannot send someone else\'s photo');
  const log=await call(e,'/api/s/salon-a/owner',undefined,OWNER);assert.equal(log.data.leads[0].status,'sent');assert(!('phone' in log.data.leads[0]),'owner log does not repeat the phone');
 }finally{tg.restore()}
});

test('a failed Telegram send is retried by the scheduler, then given up after three attempts',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s),original=await upload(e,s,g);
 let tg=mockTelegram();await linkSalon(e,s);tg.restore();
 tg=mockTelegram({fail:true});try{
  const r=await call(e,'/api/s/salon-a/leads',lead(original),g);assert.equal(r.status,200);assert.equal(r.data.delivered,false);
  assert.equal(e.DB.sql.prepare('SELECT status FROM leads').get().status,'retry');
  await tick(e,origin);await tick(e,origin);
  const row=e.DB.sql.prepare('SELECT status,attempts FROM leads').get();assert.equal(row.status,'failed');assert.equal(row.attempts,3);
  await tick(e,origin);assert.equal(e.DB.sql.prepare('SELECT attempts FROM leads').get().attempts,3,'no fourth attempt');
 }finally{tg.restore()}
 tg=mockTelegram();try{
  const id=e.DB.sql.prepare('SELECT id FROM leads').get().id;
  const retry=await call(e,'/api/s/salon-a/owner/leads/retry',{id},OWNER);assert.equal(retry.data.delivered,true);
  assert.equal(e.DB.sql.prepare('SELECT status FROM leads').get().status,'sent');
 }finally{tg.restore()}
});

test('Telegram webhook: secret required, link codes are one-time, photos become portfolio items and can be deleted',async()=>{const e=tgEnv(fixture()),s=await salon(e),b=await salon(e,'salon-b');const tg=mockTelegram();try{
 assert.equal((await hook(e,{message:{chat:{id:1,type:'private'},text:'/start'}},'wrong')).status,403);
 const code=await linkSalon(e,s,777);
 await hook(e,{message:{chat:{id:888,type:'private'},text:'/start '+code}});
 assert.equal(e.DB.sql.prepare("SELECT telegram_chat_id c FROM salons WHERE slug='salon-a'").get().c,'777','a used code cannot be reused by another chat');
 assert.equal(e.DB.sql.prepare("SELECT telegram_chat_id c FROM salons WHERE slug='salon-b'").get().c,null);
 await hook(e,{message:{chat:{id:999,type:'private'},photo:[{file_id:'small',file_size:10},{file_id:'big',file_size:2000}],caption:'بالیاژ عسلی\nکار نگار'}});
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM portfolio').get().n,0,'unlinked chats cannot publish');
 await hook(e,{message:{chat:{id:777,type:'private'},photo:[{file_id:'small',file_size:10},{file_id:'big',file_size:2000}],caption:'بالیاژ عسلی\nکار نگار'}});
 assert.equal(tg.calls.find(c=>c.method==='getFile').body.file_id,'big','largest size is used');
 const pub=await call(e,'/api/s/salon-a/public');assert.equal(pub.data.portfolio.length,1);const item=pub.data.portfolio[0];assert.equal(item.title,'بالیاژ عسلی');assert.equal(item.category,'بالیاژ');
 assert.equal((await call(e,'/api/s/salon-a/media/'+JSON.parse(item.images)[0])).status,200,'published portfolio is public');
 assert.equal((await call(e,'/api/s/salon-b/public')).data.portfolio.length,0);
 await hook(e,{callback_query:{id:'q1',data:'del:'+item.id,message:{chat:{id:888}}}});
 assert.equal((await call(e,'/api/s/salon-a/public')).data.portfolio.length,1,'another chat cannot delete');
 await hook(e,{callback_query:{id:'q2',data:'del:'+item.id,message:{chat:{id:777}}}});
 assert.equal((await call(e,'/api/s/salon-a/public')).data.portfolio.length,0);
 e.DB.sql.exec("UPDATE salons SET telegram_code_hash='x',telegram_code_expires=0");
 const stale=await call(e,'/api/s/salon-b/owner/telegram-link',{},OWNER);e.DB.sql.exec("UPDATE salons SET telegram_code_expires=1 WHERE slug='salon-b'");
 await hook(e,{message:{chat:{id:555,type:'private'},text:'/start '+stale.data.code}});
 assert.equal(e.DB.sql.prepare("SELECT telegram_chat_id c FROM salons WHERE slug='salon-b'").get().c,null,'expired code rejected');
 const unlink=await call(e,'/api/s/salon-a/owner/telegram-unlink',{},OWNER);assert.equal(unlink.status,200);assert.equal((await call(e,'/api/s/salon-a/public')).data.telegram,false);
}finally{tg.restore()}});

test('generation uses two distinct images for references, passes the typed colour and deduplicates paid tasks (mock provider)',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const original=await upload(e,s,g),reference=await upload(e,s,g,'reference');let previous=globalThis.fetch,taskCalls=0,captured=[];
 globalThis.fetch=async(url,opts)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){taskCalls++;captured.push(JSON.parse(opts.body));return Response.json({code:200,data:{taskId:'task'+taskCalls}})}if(String(url).includes('recordInfo'))return Response.json({code:200,data:{state:'success',resultJson:JSON.stringify({resultUrls:['https://provider.example/output.png']})}});return new Response(png())};
 try{for(const mode of ['style','color','both']){const body={image_consent:true,idem:crypto.randomUUID(),original_id:original,reference_id:reference,transfer:mode,color:'شرابی'};const a=await call(e,'/api/s/salon-a/generate',body,g);assert.equal(a.status,200,JSON.stringify(a));const again=await call(e,'/api/s/salon-a/generate',body,g);assert.equal(again.data.id,a.data.id);const input=captured.at(-1).input;assert.equal(input.image_input.length,2);assert.notEqual(input.image_input[0],input.image_input[1]);assert.match(input.prompt,/HAIR COLOR: burgundy wine red/);assert.equal(captured.at(-1).model,'nano-banana-pro');assert.equal(input.resolution,'2K');assert.equal(input.output_format,'jpg');const result=await call(e,'/api/s/salon-a/generation/'+a.data.id,undefined,g);assert.equal(result.data.state,'success');assert.equal((await call(e,'/api/s/salon-a/media/'+result.data.result_id,undefined,g)).status,200);
   if(mode==='both'){const v=await call(e,'/api/s/salon-a/views',{idem:crypto.randomUUID(),parent:a.data.id},g);assert.equal(v.status,200,JSON.stringify(v));assert.match(captured.at(-1).input.prompt,/360-degree/);}}
  assert.equal(taskCalls,4);
  const cat=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:0,color:'عسلی'},g);assert.equal(cat.status,200);assert.match(captured.at(-1).input.prompt,new RegExp(styles[0][1]));
 }finally{globalThis.fetch=previous}});

test('server enforces consent and limits before paid processing',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';
 assert.equal((await call(e,'/api/s/salon-a/generate',{idem:crypto.randomUUID()},g)).status,400);
 assert.equal((await call(e,'/api/s/salon-a/leads',{idem:crypto.randomUUID()},g)).status,400);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM leads').get().n,0);
});

test('expired sessions, CSRF and legacy API are rejected',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);
 e.DB.sql.exec('UPDATE sessions SET expires_at=0');assert.equal((await call(e,'/api/s/salon-a/session',undefined,g)).status,401);
 assert.equal((await app.fetch(new Request(origin+'/api/salons',{method:'POST',headers:{origin:'https://evil.example'}}),e)).status,403);
 assert.equal((await app.fetch(new Request(origin+'/api/create',{method:'POST',headers:{origin}}),e)).status,403);
});

test('unknown pages and APIs return 404; old access links are gone; HEAD and favicon are handled',async()=>{const e=fixture();
 const missing=await app.fetch(new Request(origin+'/whatever'),e);assert.equal(missing.status,404);assert.match(await missing.text(),/پیدا نشد/);
 assert.equal((await app.fetch(new Request(origin+'/api/nope'),e)).status,404);
 assert.equal((await app.fetch(new Request(origin+'/',{method:'HEAD'}),e)).status,200);
 assert.equal((await app.fetch(new Request(origin+'/favicon.ico'),e)).status,204);
 assert.equal((await app.fetch(new Request(origin+'/s/salon-a'),e)).status,404,'a salon that does not exist is a real 404');
 assert.equal((await app.fetch(new Request(origin+'/s/salon-a/access'),e)).status,404);
 assert.equal((await app.fetch(new Request(origin+'/s/Bad Slug'),e)).status,404);
 assert.match(await (await app.fetch(new Request(origin+'/admin'),e)).text(),/<title>آینه \| مدیریت سالن‌ها/);
});

test('queue endpoint rejects the wrong method before evaluating its token',async()=>{const e=fixture();
 assert.equal((await app.fetch(new Request(origin+'/api/internal/tick',{headers:{authorization:'Bearer job-test'}}),e)).status,405);
 assert.equal((await app.fetch(new Request(origin+'/api/internal/tick',{method:'POST'}),e)).status,403);
 assert.equal((await app.fetch(new Request(origin+'/api/internal/tick',{method:'POST',headers:{authorization:'Bearer job-test'}}),e)).status,200);
});

test('tiny uploads get a size-specific error',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);
 const r=await call(e,'/api/s/salon-a/upload?kind=original',new Uint8Array([1,2,3]),g);assert.equal(r.status,400);assert.match(r.data.error,/کوچک/);
});

test('retention keeps customer photos and submissions for good; only expired sessions and rate limits go',async()=>{const e=tgEnv(fixture()),s=await salon(e),old=Date.now()-40*86400000;
 e.DB.sql.exec("INSERT INTO sessions(id,salon_id,customer_id,token_hash,expires_at,created_at) VALUES('s-exp','"+s.id+"',NULL,'h-exp',"+(Date.now()-1000)+","+old+")");
 e.DB.sql.exec("INSERT INTO sessions(id,salon_id,customer_id,token_hash,expires_at,created_at) VALUES('s-old','"+s.id+"',NULL,'h-old',"+(Date.now()+1000)+","+old+")");
 e.DB.sql.exec("INSERT INTO limits(key,count,expires_at) VALUES('k-exp',1,"+(Date.now()-1000)+")");
 await e.BUCKET.put(s.id+'/m-exp',new Uint8Array([1,2,3]));
 e.DB.sql.exec("INSERT INTO media(id,salon_id,session_id,kind,object_key,mime,created_at) VALUES('m-exp','"+s.id+"',NULL,'original','"+s.id+"/m-exp','image/jpeg',"+old+")");
 e.DB.sql.exec("INSERT INTO leads(id,salon_id,session_id,name,phone,original_id,idem,status,created_at) VALUES('l-old','"+s.id+"','s-old','x','+989121234567','m-exp','i','sent',"+old+")");
 await tick(e,origin);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM sessions WHERE id='s-exp'").get().n,0);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM limits WHERE key='k-exp'").get().n,0);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM media WHERE id='m-exp'").get().n,1);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM leads").get().n,1);
 assert.equal(e.BUCKET.objects.has(s.id+'/m-exp'),true);
});

test('pages keep framing denied, use no third-party fonts and serve our own fonts and favicon',async()=>{const e=fixture();
 const r=await app.fetch(new Request(origin+'/'),e);assert.match(r.headers.get('content-security-policy'),/frame-ancestors 'none'/);
 for(const html of [customerHTML,appHTML]){assert(!/fonts\.googleapis|gstatic|\/\/[a-z.]*cdn/i.test(html));assert.match(html,/\/fonts\/vazirmatn-arabic\.woff2/);assert(!/type:'date'|type:'time'|datetime-local/.test(html));}
 for(const f of ['vazirmatn-arabic.woff2','vazirmatn-latin.woff2','estedad-arabic.woff2']){const res=await app.fetch(new Request(origin+'/fonts/'+f),e);assert.equal(res.status,200,f);assert.equal(res.headers.get('content-type'),'font/woff2');const b=new Uint8Array(await res.arrayBuffer());assert.equal(String.fromCharCode(...b.slice(0,4)),'wOF2');}
 assert.equal((await app.fetch(new Request(origin+'/fonts/nope.woff2'),e)).status,404);
 assert.match(await (await app.fetch(new Request(origin+'/favicon.svg'),e)).text(),/<svg/);
});

test('owner signs in with a password on hosts without a platform identity gateway',async()=>{const e={...fixture(),TRUST_PLATFORM_IDENTITY:'',OWNER_PASSWORD:'correct horse battery',SESSION_SECRET:'session-secret-for-tests',OWNER_EMAIL:'owner@test',OWNER_ID:'owner-1'};
 const anon=await call(e,'/api/me');assert.equal(anon.data.owner,false);assert.equal(anon.data.passwordLogin,true);
 assert.equal((await call(e,'/api/login',{password:'wrong'})).status,401);
 const ok=await call(e,'/api/login',{password:'correct horse battery'});assert.equal(ok.status,200);assert.match(ok.cookie,/^ayneh_admin=/);
 assert.equal((await call(e,'/api/me',undefined,{cookie:ok.cookie})).data.owner,true);
 assert.equal((await call(e,'/api/salons',{slug:'salon-p',name:'سالن رمز'},{cookie:ok.cookie})).status,200);
 assert.equal((await call(e,'/api/s/salon-p/owner',undefined,{cookie:ok.cookie})).status,200);
 assert.equal((await call(e,'/api/s/salon-p/owner',undefined,{cookie:ok.cookie.replace(/.$/,c=>c==='0'?'1':'0')})).status,401);
 const out=await call(e,'/api/logout',{},{cookie:ok.cookie});assert.equal(out.cookie,'ayneh_admin=');
});

test('password login stays disabled until a secret is configured',async()=>{const e=fixture();assert.equal((await call(e,'/api/login',{password:'anything'})).status,503);assert.equal((await call(e,'/api/me')).data.passwordLogin,false);});

test('hosting identity headers are ignored unless the deployment opts in',async()=>{const base=fixture();await salon(base);const untrusted={...base,TRUST_PLATFORM_IDENTITY:'false'};
 assert.equal((await call(untrusted,'/api/s/salon-a/owner',undefined,OWNER)).status,401);
 assert.equal((await call(untrusted,'/api/salons',{slug:'salon-z',name:'z'},OWNER)).status,401);
});

test('photos fall back to D1 blobs when no object storage is bound',async()=>{const e=fixture();delete e.BUCKET;const s=await salon(e),g=await guest(e,s);
 const id=await upload(e,s,g);const got=await app.fetch(new Request(origin+'/api/s/salon-a/media/'+id,{headers:{cookie:g.cookie}}),e);assert.equal(got.status,200);
 assert.equal(new Uint8Array(await got.arrayBuffer())[0],137);assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM blobs').get().n,1);
});

test('KV adapter round-trips a photo when R2 is unavailable',async()=>{const e=fixture();const store=new Map();e.KV={async put(k,v,o){store.set(k,{v,o})},async getWithMetadata(k){const x=store.get(k);return x?{value:x.v,metadata:x.o?.metadata||null}:{value:null,metadata:null}},async delete(k){store.delete(k)}};delete e.BUCKET;const s=await salon(e),g=await guest(e,s);
 const id=await upload(e,s,g);const got=await app.fetch(new Request(origin+'/api/s/salon-a/media/'+id,{headers:{cookie:g.cookie}}),e);assert.equal(got.status,200);assert.equal(new Uint8Array(await got.arrayBuffer())[0],137);
});

test('catalog generator covers every ready-made style and the catalog folder is served as static assets',()=>{
 const src=readFileSync(new URL('../scripts/generate-catalog.mjs',import.meta.url),'utf8');assert.match(src,/styles\.entries\(\)/);assert.match(src,/padStart\(2,'0'\)/);
 assert.match(readFileSync(new URL('../wrangler.toml',import.meta.url),'utf8'),/\[assets\]\s*directory = "\.\/public"/);
 assert.equal(styles.length,20);
});

test('salon can pick the faster model; a rejected model falls back once, network errors never retry a paid task',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';
 const original=await upload(e,s,g);let previous=globalThis.fetch,models=[],mode='ok';
 globalThis.fetch=async(url,opts)=>{const u=String(url);if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/x.jpg'}});if(u.includes('createTask')){const m=JSON.parse(opts.body).model;models.push(m);if(mode==='network')throw new Error('reset');if(mode==='reject'&&m!=='nano-banana-2')return Response.json({code:422,msg:'model not available'});return Response.json({code:200,data:{taskId:'t'+models.length}})}return new Response(png())};
 try{
  await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,image_model:'fast'},OWNER);
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1},g)).status,200);assert.equal(models.at(-1),'nano-banana-2-1');
  await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,image_model:'pro'},OWNER);mode='reject';models=[];
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1},g)).status,200);assert.deepEqual(models,['nano-banana-pro','nano-banana-2']);
  mode='network';models=[];
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1},g)).status,502);assert.deepEqual(models,['nano-banana-pro'],'no second paid attempt after an ambiguous failure');
 }finally{globalThis.fetch=previous}});

// Melipayamak stand-in: records every call, never reaches the network.
function mockSms({otpCode='48213',recId=123456789012,fail=false}={}){const calls=[];const previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url),base='https://console.melipayamak.com/api/send/';if(!u.startsWith(base))return previous(url,init);const [kind,token]=u.slice(base.length).split('/');calls.push({kind,token,body:JSON.parse(init.body)});if(fail)return Response.json({code:'',recId:3,status:'اعتبار کافی نیست'});return Response.json(kind==='otp'?{code:otpCode,status:''}:{recId,status:''})};return {calls,restore(){globalThis.fetch=previous}};}
const smsEnv=e=>Object.assign(e,{MELIPAYAMAK_TOKEN:'tok-secret',MELIPAYAMAK_BODY_ID:'524',APP_ORIGIN:'https://ayneh.example'});
const otpBody=(extra={})=>({first_name:'سارا',last_name:'محمدی',phone:'۰۹۱۲۱۲۳۴۵۶۷',...extra});

test('SMS is optional: without MELIPAYAMAK_TOKEN nothing is gated and the code routes refuse',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);
 assert.equal((await call(e,'/api/s/salon-a/public')).data.otp,false);
 assert.equal((await call(e,'/api/s/salon-a/otp/send',otpBody(),g)).status,503);
 const original=await upload(e,s,g);assert.equal((await call(e,'/api/s/salon-a/leads',lead(original),g)).status,503,'only the missing Telegram link blocks it, not verification');
});

test('mobile verification: code is texted, checked server-side, gates generation and fixes the lead identity',async()=>{const e=smsEnv(tgEnv(fixture())),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';
 assert.equal((await call(e,'/api/s/salon-a/public')).data.otp,true);
 const original=await upload(e,s,g);
 assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1},g)).status,403,'generation needs a verified mobile');
 const sms=mockSms(),tg=mockTelegram();try{
  assert.equal((await call(e,'/api/s/salon-a/otp/send',otpBody({phone:'12345'}),g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/otp/send',otpBody({first_name:'س'}),g)).status,400);
  assert.equal(sms.calls.length,0,'nothing texted for invalid input');
  const sent=await call(e,'/api/s/salon-a/otp/send',otpBody(),g);assert.equal(sent.status,200,JSON.stringify(sent));
  assert.deepEqual(sms.calls[0],{kind:'otp',token:'tok-secret',body:{to:'09121234567'}});
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps').get().n,1);
  assert(!JSON.stringify(e.DB.sql.prepare('SELECT * FROM otps').all()).includes('48213'),'only a hash of the code is stored');
  assert.equal((await call(e,'/api/s/salon-a/otp/send',otpBody(),g)).status,429,'resend cooldown');
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'11111'},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/leads',lead(original),g)).status,403,'unverified sessions cannot send requests');
  const other=await guest(e,s);assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'48213'},other)).status,400,'a code only works in the session that asked for it');
  const ok=await call(e,'/api/s/salon-a/otp/verify',{code:'۴۸۲۱۳'},g);assert.equal(ok.status,200,JSON.stringify(ok));assert.equal(ok.data.phone,'+989121234567');
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps').get().n,0,'a used code is gone');
  const me=await call(e,'/api/s/salon-a/session',undefined,g);assert.equal(me.data.verified,true);assert.equal(me.data.name,'سارا محمدی');
  assert.equal((await call(e,'/api/s/salon-a/session',undefined,other)).data.verified,false);
  const gen=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1},g);assert.notEqual(gen.status,403,'verified sessions pass the gate');
  await linkSalon(e,s);
  const r=await call(e,'/api/s/salon-a/leads',lead(original,{name:'کس دیگر',phone:'09351112233'}),g);assert.equal(r.status,200,JSON.stringify(r));
  const row=e.DB.sql.prepare('SELECT name,phone FROM leads').get();assert.equal(row.phone,'+989121234567','the verified mobile wins over the form');assert.equal(row.name,'سارا محمدی');
 }finally{sms.restore();tg.restore()}
});

test('verification limits: five wrong guesses burn the code, expired codes are refused, provider failures are reported without leaking the token',async()=>{const e=smsEnv(fixture()),s=await salon(e);
 const sms=mockSms();try{
  let g=await guest(e,s);await call(e,'/api/s/salon-a/otp/send',otpBody(),g);
  for(let i=0;i<5;i++)assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'00000'},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'48213'},g)).status,429,'right code too late: attempts are spent');
  assert.equal(e.DB.sql.prepare('SELECT verified_phone p FROM sessions WHERE id IS NOT NULL LIMIT 1').get().p,null);
  g=await guest(e,s);await call(e,'/api/s/salon-a/otp/send',otpBody({phone:'09351112233'}),g);
  e.DB.sql.exec('UPDATE otps SET expires_at=1');assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'48213'},g)).status,410);
  await tick(e,origin);assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps').get().n,0,'expired codes are cleaned up');
  // one mobile cannot be used to spam: 5 codes a day
  for(let i=0;i<7;i++){const x=await guest(e,s);const r=await call(e,'/api/s/salon-a/otp/send',otpBody({phone:'09361110000'}),x);if(i>=5)assert.equal(r.status,429,'per-number daily cap');else assert.equal(r.status,200);}
 }finally{sms.restore()}
 const bad=mockSms({fail:true});try{
  const g2=await guest(e,s);const r=await call(e,'/api/s/salon-a/otp/send',otpBody({phone:'09371110000'}),g2);assert.equal(r.status,502);assert(!JSON.stringify(r.data).includes('tok-secret'));
  assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM otps WHERE phone=?').get('+989371110000').n,0,'no code stored when the text was not sent');
 }finally{bad.restore()}
});

test('a salon texts its page link to a customer by typing the mobile number in the Telegram bot',async()=>{const e=smsEnv(tgEnv(fixture())),s=await salon(e,'salon-a');await call(e,'/api/s/salon-a/owner/profile',{name:'سالن آینه',profile:{}},OWNER);
 const tg=mockTelegram(),sms=mockSms();try{
  await linkSalon(e,s,777);
  const say=t=>hook(e,{message:{chat:{id:777,type:'private'},text:t}});
  const last=()=>tg.calls.filter(c=>c.method==='sendMessage').at(-1).body.text;
  await say('۰۹۱۲۱۲۳۴۵۶۷');
  assert.deepEqual(sms.calls.at(-1),{kind:'shared',token:'tok-secret',body:{bodyId:524,to:'09121234567',args:['سالن آینه','salon-a']}});
  assert.match(last(),/✅ 09121234567/);
  assert.equal(e.DB.sql.prepare("SELECT status FROM invites").get().status,'sent');
  const n=sms.calls.length;await say('09121234567');assert.equal(sms.calls.length,n,'same number is not texted twice within an hour');assert.match(last(),/↩️/);
  await say('09351112233 09361112233');assert.equal(sms.calls.length,n+2,'several numbers in one message');
  await say('سلام ۰۹۱۲');assert.equal(sms.calls.length,n+2,'ordinary text never sends a text message');
  await say('0912111222 0912111223 0912111224 0912111225 0912111226 0912111227');assert.equal(sms.calls.length,n+2,'more than five numbers is not a number message');
  assert.equal((await hook(e,{message:{chat:{id:999,type:'private'},text:'09371112233'}})).status,200);assert.equal(sms.calls.length,n+2,'unlinked chats cannot send texts');
  // credit problems are shown to the salon, not hidden
  const bad=mockSms({fail:true});try{await say('09381112233');assert.match(last(),/❌ 09381112233/);assert.equal(e.DB.sql.prepare("SELECT status FROM invites WHERE phone='+989381112233'").get().status,'failed')}finally{bad.restore()}
  // the daily cap per salon
  e.DB.sql.exec("DELETE FROM limits");for(let i=0;i<30;i++)await say('09'+String(100000000+i).slice(-9));
  const before=sms.calls.length;await say('09391112233');assert.equal(sms.calls.length,before,'31st text of the day is refused');assert.match(last(),/سقف/);
 }finally{sms.restore();tg.restore()}
 // not configured: the bot says so instead of silently ignoring the number
 const e2=tgEnv(fixture()),s2=await salon(e2,'salon-b');const tg2=mockTelegram();try{await linkSalon(e2,s2,555);await hook(e2,{message:{chat:{id:555,type:'private'},text:'09121234567'}});assert.match(tg2.calls.filter(c=>c.method==='sendMessage').at(-1).body.text,/فعال نشده/)}finally{tg2.restore()}
});

test('owner console reports SMS state; verified mobiles and invite records are kept; dev-mock never calls the network',async()=>{const e=smsEnv(fixture());await salon(e);
 assert.deepEqual((await call(e,'/api/owner',undefined,OWNER)).data.sms,{otp:true,invite:true});
 assert.deepEqual((await call(fixture(),'/api/owner',undefined,OWNER)).data.sms,{otp:false,invite:false});
 const old=Date.now()-40*86400000,sid=e.DB.sql.prepare('SELECT id FROM salons').get().id;
 e.DB.sql.exec("INSERT INTO sessions(id,salon_id,customer_id,token_hash,expires_at,created_at,verified_phone,verified_name) VALUES('s-v','"+sid+"',NULL,'h-v',"+(Date.now()+1000)+","+old+",'+989121234567','x y')");
 e.DB.sql.exec("INSERT INTO invites(id,salon_id,phone,status,created_at) VALUES('i-old','"+sid+"','+989121234567','sent',"+old+")");
 await tick(e,origin);
 assert.equal(e.DB.sql.prepare("SELECT verified_phone p FROM sessions WHERE id='s-v'").get()?.p,'+989121234567');
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM invites').get().n,1);
 const {sendOtp,DEV_CODE}=await import('../worker/sms.js');const previous=globalThis.fetch;globalThis.fetch=()=>{throw new Error('network used')};try{assert.equal(await sendOtp({MELIPAYAMAK_TOKEN:'dev-mock'},'+989121234567'),DEV_CODE)}finally{globalThis.fetch=previous}
});

test('with an approved code text the code is generated here and sent from the shared line',async()=>{const e=smsEnv(fixture()),s=await salon(e);e.MELIPAYAMAK_OTP_BODY_ID='573875';
 const sms=mockSms();try{
  const g=await guest(e,s);const r=await call(e,'/api/s/salon-a/otp/send',otpBody(),g);assert.equal(r.status,200,JSON.stringify(r));
  const c=sms.calls.at(-1);assert.equal(c.kind,'shared');assert.equal(c.body.bodyId,573875);assert.equal(c.body.to,'09121234567');assert.match(c.body.args[0],/^\d{6}$/);
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:'000000'},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/otp/verify',{code:c.body.args[0]},g)).status,200,'the code we generated verifies');
 }finally{sms.restore()}
});

// ---------- follow-up, wizard, Bale, tracking, stats, link previews ----------
const baleHook=(env,update,secret='hook-secret')=>app.fetch(new Request(origin+'/api/bale/webhook/'+secret,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(update)}),env);
async function sendLead(e,s,g,extra={}){const original=await upload(e,s,g);const r=await call(e,'/api/s/'+s.slug+'/leads',lead(original,{v:'a'.repeat(32),...extra}),g);assert.equal(r.status,200,JSON.stringify(r));return r.data;}

test('salon taps a status button: the lead updates, the keyboard marks it, a following customer is told',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const d=await sendLead(e,s,g);
 const token=d.follow.telegram.split('start=f_')[1];
 await hook(e,{message:{chat:{id:5150,type:'private'},text:'/start f_'+token}});
 assert.equal(e.DB.sql.prepare('SELECT follow_chat c FROM leads').get().c,'5150');
 assert.match(tg.calls.filter(c=>c.method==='sendMessage'&&c.body.chat_id==='5150').at(-1).body.text,/هر وقت/);
 await hook(e,{callback_query:{id:'q1',data:'ls:called:'+d.id,message:{chat:{id:888},message_id:9}}});
 assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads').get().s,'new','another chat cannot change it');
 await hook(e,{callback_query:{id:'q2',data:'ls:booked:'+d.id,message:{chat:{id:777},message_id:9}}});
 const row=e.DB.sql.prepare('SELECT salon_status s,handled_at h FROM leads').get();assert.equal(row.s,'booked');assert(row.h>0);
 const edit=tg.calls.find(c=>c.method==='editMessageReplyMarkup');assert(edit.body.reply_markup.inline_keyboard.flat().some(b=>b.text.startsWith('✔︎ ')&&b.callback_data.startsWith('ls:booked')));
 assert.match(tg.calls.filter(c=>c.method==='sendMessage'&&c.body.chat_id==='5150').at(-1).body.text,/نوبت شما را هماهنگ کرد/);
 const mine=await call(e,'/api/s/salon-a/requests',undefined,g);assert.equal(mine.data.requests[0].salon_status,'booked');assert.equal(mine.data.requests[0].followed,1);
 const other=await guest(e,s);assert.equal((await call(e,'/api/s/salon-a/requests',undefined,other)).data.requests.length,0,'a customer sees only her own requests');
 await hook(e,{message:{chat:{id:6000,type:'private'},text:'/start f_'+'0'.repeat(24)}});assert.match(tg.calls.at(-1).body.text,/منقضی/);
}finally{tg.restore()}});

test('untouched submissions are reminded at 2h and 24h during Tehran working hours, then the customer is told',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const d=await sendLead(e,s,g);e.DB.sql.exec("UPDATE leads SET follow_chat='5150',follow_platform='telegram'");
 const {remind}=await import('../worker/telegram.js');
 const noon=Date.parse('2026-11-03T08:30:00Z'),night=Date.parse('2026-11-03T20:00:00Z'); // 12:00 and 23:30 Tehran
 e.DB.sql.exec('UPDATE leads SET created_at='+(noon-3*3600000));
 assert.equal(await remind(e,origin,night),0,'quiet at night');
 assert.equal(await remind(e,origin,noon),1);assert.equal(await remind(e,origin,noon),0,'not twice');
 assert.match(tg.calls.filter(c=>c.body.chat_id==='777').at(-1).body.text,/یادآوری/);
 e.DB.sql.exec('UPDATE leads SET created_at='+(noon-25*3600000));
 assert.equal(await remind(e,origin,noon),1);
 assert.match(tg.calls.filter(c=>c.body.chat_id==='5150').at(-1).body.text,/هنوز درخواستت را جواب نداده/);
 assert.equal(await remind(e,origin,noon),0,'two reminders at most');
 await hook(e,{callback_query:{id:'q',data:'ls:called:'+d.id,message:{chat:{id:777},message_id:1}}});
}finally{tg.restore()}});

test('linking starts a setup wizard that fills the salon page one answer at a time',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 const say=m=>hook(e,{message:{chat:{id:777,type:'private'},...m}});const tap=d=>hook(e,{callback_query:{id:'q',data:d,message:{chat:{id:777},message_id:3}}});
 await linkSalon(e,s,777,true);
 assert.match(tg.calls.filter(c=>c.method==='sendMessage').at(-1).body.text,/۱ از ۱۱/);
 await say({text:'سالن زیبایی ساناز'});
 await say({photo:[{file_id:'logo',file_size:100}]});
 await tap('wz:skip');
 await say({text:'تخصص ما رنگ است.'});
 await say({text:'تهران، ونک'});
 await say({location:{latitude:35.7575,longitude:51.4101}});
 await say({text:'۱۰ تا ۲۰'});
 await say({text:'abc'});assert.match(tg.calls.at(-1).body.text,/شماره درست نیست/);
 await say({text:'۰۲۱-۲۲۳۳۴۴۵۵'});
 await say({text:'@sanaz.salon'});
 await say({text:'ساناز احمدی'});
 await tap('wz:skip');
 const pub=(await call(e,'/api/s/salon-a/public')).data.salon;
 assert.equal(pub.name,'سالن زیبایی ساناز');assert.equal(pub.profile.bio,'تخصص ما رنگ است.');assert.equal(pub.profile.phone,'02122334455');assert.equal(pub.profile.instagram,'https://instagram.com/sanaz.salon');assert.equal(pub.profile.map,'https://www.google.com/maps?q=35.757500,51.410100');assert.equal(pub.profile.manager,'ساناز احمدی');assert(pub.profile.logo);assert(!pub.profile.cover);
 assert.match(tg.calls.filter(c=>c.method==='sendMessage').at(-1).body.text,/آماده است[\s\S]*\/s\/salon-a/);
 assert.equal(e.DB.sql.prepare('SELECT bot_state b FROM salons').get().b,'');
 await say({photo:[{file_id:'work',file_size:100}],caption:'بالیاژ'});assert.equal((await call(e,'/api/s/salon-a/public')).data.portfolio.length,1,'after the wizard photos are portfolio again');
 await say({text:'/setup'});await tap('wz:keep');assert.match(tg.calls.filter(c=>c.method==='sendMessage').at(-1).body.text,/۲ از ۱۱/);
}finally{tg.restore()}});

test('Bale: path secret required, same link code works, submissions reach both inboxes, plain text only',async()=>{const e=tgEnv(fixture());e.BALE_BOT_TOKEN='777:bale';e.BALE_BOT_USERNAME='ayneh_bale_bot';const s=await salon(e),g=await guest(e,s);
 const calls=[];const previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url);if(!/api\.telegram\.org|tapi\.bale\.ai/.test(u))return previous(url,init);const host=u.includes('bale')?'bale':'tg',method=u.split('/').pop();let body=init?.body;if(body instanceof FormData){const o={};for(const [k,v] of body.entries())o[k]=typeof v==='string'?v:'<file>';body=o}else body=JSON.parse(body||'{}');calls.push({host,method,body});if(host==='bale'&&method==='sendMediaGroup')return Response.json({ok:false,description:'not supported'},{status:400});if(method==='sendMediaGroup')return Response.json({ok:true,result:[{message_id:1}]});return Response.json({ok:true,result:{message_id:2,username:host==='bale'?'ayneh_bale_bot':'ayneh_bot'}})};
 try{
  assert.equal((await baleHook(e,{message:{chat:{id:1,type:'private'},text:'/start'}},'wrong')).status,403);
  const link=await call(e,'/api/s/salon-a/owner/telegram-link',{},OWNER);assert.match(link.data.links.bale,/^https:\/\/ble\.ir\/ayneh_bale_bot\?start=[a-f0-9]{24}$/);assert.match(link.data.links.telegram,/t\.me/);
  await baleHook(e,{message:{chat:{id:9001,type:'private'},text:'/start '+link.data.code}});await baleHook(e,{message:{chat:{id:9001,type:'private'},text:'/stop'}});
  assert.equal(e.DB.sql.prepare('SELECT bale_chat_id b FROM salons').get().b,'9001');
  assert.equal((await call(e,'/api/s/salon-a/public')).data.telegram,true,'a Bale-only salon can receive submissions');
  const d=await sendLead(e,s,g);assert.equal(d.delivered,true);assert(d.follow.bale.startsWith('https://ble.ir/ayneh_bale_bot?start=f_'));
  const details=calls.find(c=>c.host==='bale'&&c.method==='sendMessage'&&/درخواست تازه/.test(c.body.text||''));assert(details,'details sent to Bale');assert(!details.body.parse_mode&&!/<b>/.test(details.body.text),'Bale gets plain text');assert.equal(details.body.reply_to_message_id,2);
  assert(calls.filter(c=>c.host==='bale'&&c.method==='sendPhoto').length>=1,'album falls back to single photos on Bale');
  const hook2=await call(e,'/api/owner/webhook',{},OWNER);assert.equal(hook2.status,200);assert.equal(calls.find(c=>c.host==='bale'&&c.method==='setWebhook').body.url,origin+'/api/bale/webhook/hook-secret');
 }finally{globalThis.fetch=previous}});

test('tracking accepts only known events; stats count visitors, funnel, looks, colours, ratings and salon response',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s);const tg=mockTelegram();try{
 const v1='1'.repeat(32),v2='2'.repeat(32),tr=(kind,v,meta)=>call(e,'/api/s/salon-a/track',{kind,v,meta});
 assert.equal((await tr('hack',v1)).status,400);assert.equal((await tr('sent',v1)).status,400,'sent is logged by the server only');
 for(const v of [v1,v2])await tr('view',v);await tr('view',v1);
 await tr('photo',v1);await tr('look',v1,'c:0');await tr('look',v2,'c:0');await tr('look',v1,'s:بالیاژ');await tr('color',v1,'بالیاژ عسلی');await tr('result',v1);await tr('rating',v1,'4');await tr('rating',v2,'2');
 await linkSalon(e,s,777);const d=await sendLead(e,s,g,{v:v1});
 await hook(e,{callback_query:{id:'q',data:'ls:called:'+d.id,message:{chat:{id:777},message_id:1}}});
 const st=(await call(e,'/api/owner/stats?days=7',undefined,OWNER)).data;
 assert.equal(st.kpi.visitors,2);assert.equal(st.kpi.sent,1);assert.equal(st.kpi.conversion,0.5);
 assert.deepEqual(st.funnel.map(f=>f.count),[2,1,2,1,1]);
 assert.equal(st.looks[0].label,styles[0][0]);assert.equal(st.looks[0].count,2);assert(st.looks.some(l=>l.label==='کار سالن: بالیاژ'));
 assert.deepEqual(st.colors[0],{label:'بالیاژ عسلی',count:1});
 assert.equal(st.rating.avg,3);assert.deepEqual(st.rating.dist,[0,1,0,1,0]);
 assert.equal(st.response.total,1);assert.equal(st.response.called,1);assert.equal(st.response.handled,1);
 assert.equal(st.daily.length,7);assert.equal(st.daily.at(-1).visitors,2);
 assert.equal(st.salons[0].slug,'salon-a');
 const v3='3'.repeat(32);await tr('share_open',v1);await tr('share',v1,'telegram');await tr('share',v1,'whatsapp');await tr('share',v2,'telegram');await tr('view',v3,'share');
 const sh=(await call(e,'/api/owner/stats?days=7',undefined,OWNER)).data.share;
 assert.deepEqual([sh.opened,sh.sent,sh.visitors],[1,3,1]);assert.deepEqual(sh.byApp[0],{label:'telegram',count:2});
 assert.equal((await call(e,'/api/owner/stats?days=7&salon=salon-a',undefined,OWNER)).data.salons.length,0);
 assert.equal((await call(e,'/api/owner/stats')).status,401);
}finally{tg.restore()}});

test('salon pages carry their own link preview; salon work is tryable by default',async()=>{const e=fixture(),s=await salon(e);
 const brand=await call(e,'/api/s/salon-a/upload?kind=brand',png(),OWNER);
 await call(e,'/api/s/salon-a/owner/profile',{name:'سالن "ساناز" & دوستان',profile:{bio:'تخصص ما رنگ است.',cover:brand.data.id}},OWNER);
 const html=await (await app.fetch(new Request(origin+'/s/salon-a'),e)).text();
 assert.match(html,/<title>سالن &quot;ساناز&quot; &amp; دوستان \| /);assert.match(html,/og:image" content="https:\/\/test\.example\/api\/s\/salon-a\/media\//);assert.match(html,/og:description" content="تخصص ما رنگ است\./);
 assert.equal((html.match(/property="og:title"/g)||[]).length,1,'no duplicate tags');
 const unknown=await app.fetch(new Request(origin+'/s/unknown-salon'),e);assert.equal(unknown.status,404);assert.match(await unknown.text(),/پیدا نشد/);
 assert.equal((await call(e,'/api/s/salon-a/public')).data.reference,true);
 await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:false},OWNER);assert.equal((await call(e,'/api/s/salon-a/public')).data.reference,false);
});

// ---------- team members and staff referrals ----------
const V=n=>String(n).repeat(32).slice(0,32);
async function addMember(e,s,name,chat){const r=await call(e,'/api/s/'+s.slug+'/owner/team',{name,specialty:'کوتاهی'},OWNER);assert.equal(r.status,200,JSON.stringify(r));const code=r.data.links.telegram.split('start=')[1];if(chat)await hook(e,{message:{chat:{id:chat,type:'private'},text:'/start '+code}});return {...r.data.member,ref:r.data.ref,code};}
const visit=async(e,s,v,r)=>(await call(e,'/api/s/'+s.slug+'/ref',{v,r})).data;
const sentTo=(tg,chat)=>tg.calls.filter(c=>(c.method==='sendMessage'||c.method==='sendMediaGroup'||c.method==='sendPhoto')&&String(c.body.chat_id)===String(chat));

test('manager builds the team in the bot; a member links their own chat and gets a personal link',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);
 await hook(e,{message:{chat:{id:777,type:'private'},text:'/team'}});assert.match(tg.calls.at(-1).body.text,/هنوز نیرویی/);
 await hook(e,{callback_query:{id:'a',data:'tm:add',message:{chat:{id:777},message_id:3}}});
 await hook(e,{message:{chat:{id:777,type:'private'},text:'مریم محمدی'}});
 await hook(e,{callback_query:{id:'b',data:'tm:s:0',message:{chat:{id:777},message_id:4}}});
 const t=e.DB.sql.prepare('SELECT * FROM team').get();assert.equal(t.name,'مریم محمدی');assert.equal(t.specialty,'کوتاهی');assert.match(t.ref_code,/^s[a-z2-9]{7}$/);
 const msg=tg.calls.filter(c=>c.method==='sendMessage'&&c.body.chat_id==='777').at(-1).body.text;assert.match(msg,/start=[a-f0-9]{24}/);assert(msg.includes('/s/salon-a?r='+t.ref_code));
 const code=msg.match(/start=([a-f0-9]{24})/)[1];
 await hook(e,{message:{chat:{id:777,type:'private'},text:'/start '+code}});assert.equal(e.DB.sql.prepare('SELECT telegram_chat_id c FROM team').get().c,null,'the manager chat cannot become a member');
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/start '+code}});
 assert.equal(e.DB.sql.prepare('SELECT telegram_chat_id c FROM team').get().c,'4001');
 assert(sentTo(tg,4001).some(c=>c.body.text?.includes('?r='+t.ref_code)));
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/team'}});assert(!/تیم «/.test(sentTo(tg,4001).at(-1).body.text),'members cannot manage the team');
 await hook(e,{message:{chat:{id:4001,type:'private'},photo:[{file_id:'p1',file_size:100}],caption:'بالیاژ عسلی'}});
 const pf=e.DB.sql.prepare('SELECT stylist,staff_id FROM portfolio').get();assert.equal(pf.stylist,'مریم محمدی');assert.equal(pf.staff_id,t.id);
 assert.equal((await call(e,'/api/s/salon-a/public')).data.portfolio[0].maker,t.id);
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/start '+code}});assert.match(sentTo(tg,4001).at(-1).body.text,/منقضی|لینک اختصاصی/);
}finally{tg.restore()}});

test('referral chain: a member keeps every generation, first link wins, a mobile keeps its owner, requests reach only the owner',async()=>{const e=tgEnv(fixture()),s=await salon(e),other=await salon(e,'salon-b');const tg=mockTelegram();try{
 await linkSalon(e,s,777);const maryam=await addMember(e,s,'مریم محمدی',4001),sara=await addMember(e,s,'سارا',4002);
 // Maryam → Nazanin → friend → friend's friend
 const nazanin=await visit(e,s,V(1),maryam.ref.split('r=')[1]);assert.equal(nazanin.mine,maryam.id);
 const f1=await visit(e,s,V(2),nazanin.tag);assert.equal(f1.mine,maryam.id);
 const f2=await visit(e,s,V(3),f1.tag);assert.equal(f2.mine,maryam.id);
 assert.equal(e.DB.sql.prepare("SELECT gen FROM ref_visitors WHERE visitor=?").get(V(3)).gen,3);
 assert.equal((await visit(e,s,V(1),sara.ref.split('r=')[1])).mine,maryam.id,'a later link does not move her');
 assert.equal((await visit(e,other,V(1),'')).mine,null,'attribution is per salon');
 assert.equal((await visit(e,s,V(9),'vzzzzzzzz')).mine,null,'unknown codes make a salon customer');
 // Nazanin sends a request: only Maryam gets it, the manager gets nothing about her (but a conflict note).
 const before=sentTo(tg,777).length,g=await guest(e,s);const d=await sendLead(e,s,g,{v:V(1),phone:'09120000001',name:'نازنین احمدی'});
 assert.equal(d.delivered,true);assert(sentTo(tg,4001).some(c=>c.body.text?.includes('نازنین احمدی')));
 assert(!sentTo(tg,4002).some(c=>c.body.text?.includes('نازنین')),'not to Sara');
 const mgr=sentTo(tg,777).slice(before);assert(!mgr.some(c=>c.body.text?.includes('09120000001')),'manager never sees her mobile');
 assert(mgr.some(c=>/با لینک سارا آمد/.test(c.body.text||'')),'manager is told about the conflict');
 // Sara cannot press Maryam's buttons; Maryam can.
 await hook(e,{callback_query:{id:'x',data:'ls:called:'+d.id,message:{chat:{id:4002},message_id:1}}});assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads WHERE id=?').get(d.id).s,'new');
 await hook(e,{callback_query:{id:'y',data:'ls:called:'+d.id,message:{chat:{id:777},message_id:1}}});assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads WHERE id=?').get(d.id).s,'new','nor can the manager');
 await hook(e,{callback_query:{id:'z',data:'ls:called:'+d.id,message:{chat:{id:4001},message_id:1}}});assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads WHERE id=?').get(d.id).s,'called');
 // Same mobile on a new phone that arrived via Sara's link stays Maryam's.
 await visit(e,s,V(4),sara.ref.split('r=')[1]);const g2=await guest(e,s);const d2=await sendLead(e,s,g2,{v:V(4),phone:'09120000001',name:'نازنین احمدی'});
 assert.equal(e.DB.sql.prepare('SELECT staff_id FROM leads WHERE id=?').get(d2.id).staff_id,maryam.id);
 // A salon customer goes to the manager with hand-over buttons; handing over locks her subtree.
 const solo=await visit(e,s,V(5),'');await visit(e,s,V(6),solo.tag);
 const g3=await guest(e,s);const d3=await sendLead(e,s,g3,{v:V(5),phone:'09120000005',name:'لیلا'});
 const card=sentTo(tg,777).filter(c=>c.body.reply_markup).at(-1);assert(card.body.text.includes('لیلا'));
 const btn=card.body.reply_markup.inline_keyboard.flat().find(b=>b.callback_data==='la:'+sara.id+':'+d3.id);assert(btn,'hand-over button for Sara');assert(btn.callback_data.length<=64);
 await hook(e,{callback_query:{id:'h',data:btn.callback_data,message:{chat:{id:777},message_id:5}}});
 assert.equal(e.DB.sql.prepare('SELECT staff_id FROM leads WHERE id=?').get(d3.id).staff_id,sara.id);
 assert(sentTo(tg,4002).some(c=>c.body.text?.includes('لیلا')));
 assert.equal((await visit(e,s,V(6),'')).mine,sara.id,'her friend follows her to Sara');
 assert.equal(e.DB.sql.prepare('SELECT staff_id FROM ref_phones WHERE staff_id=?').all(sara.id).length,1);
 // The conflict button gives Nazanin to Sara for good.
 const cf=sentTo(tg,777).find(c=>/با لینک سارا آمد/.test(c.body.text||'')).body.reply_markup.inline_keyboard[0][0].callback_data;
 await hook(e,{callback_query:{id:'c',data:cf,message:{chat:{id:777},message_id:6}}});
 assert.equal((await visit(e,s,V(1),'')).mine,sara.id);assert.equal((await visit(e,s,V(3),'')).mine,sara.id,'her whole tree moves');
 // Report
 const rep=(await call(e,'/api/owner/referrals?salon=salon-a',undefined,OWNER)).data;
 const sr=rep.staff.find(x=>x.id===sara.id);assert(sr.visitors>=5);assert(sr.requests>=2);
 assert(rep.top.some(t=>t.name==='نازنین احمدی'&&t.brought===2));
 assert(rep.trees.find(t=>t.staff_id===sara.id).nodes.length>=1);
 assert.equal((await call(e,'/api/owner/referrals')).status,401);
}finally{tg.restore()}});

test('a member who has not linked yet: the request waits, the manager only hears that, and it goes out on link; removal hands everything over',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const maryam=await addMember(e,s,'مریم',null),sara=await addMember(e,s,'سارا',4002);
 await visit(e,s,V(1),maryam.ref.split('r=')[1]);const g=await guest(e,s);const d=await sendLead(e,s,g,{v:V(1),phone:'09120000011',name:'نگار'});
 assert.equal(d.delivered,false);assert.equal(d.waiting,true);
 const note=sentTo(tg,777).at(-1).body.text;assert.match(note,/هنوز ربات را وصل نکرده/);assert(!note.includes('نگار')&&!note.includes('0912'));
 await tick(e,origin);assert.equal(e.DB.sql.prepare('SELECT status FROM leads').get().status,'queued','the scheduler leaves it waiting');
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/start '+maryam.code}});
 assert(sentTo(tg,4001).some(c=>c.body.text?.includes('نگار')));assert.equal(e.DB.sql.prepare('SELECT waiting,status FROM leads').get().status,'sent');
 // Remove Maryam → Sara inherits customers, links and the open request.
 const r=await call(e,'/api/s/salon-a/owner/team/remove',{id:maryam.id,to:sara.id},OWNER);assert.equal(r.status,200);assert.equal(r.data.moved,1);
 assert(sentTo(tg,4002).some(c=>c.body.text?.includes('نگار')));
 assert.equal((await visit(e,s,V(7),maryam.ref.split('r=')[1])).mine,sara.id,'old links now bring customers to Sara');
 assert.equal((await visit(e,s,V(1),'')).mine,sara.id);
 assert.equal((await call(e,'/api/s/salon-a/owner',undefined,OWNER)).data.team.length,1);
}finally{tg.restore()}});

test('Bale: a member links through Bale and gets their customers there, in plain text',async()=>{const e=tgEnv(fixture());e.BALE_BOT_TOKEN='777:bale';e.BALE_BOT_USERNAME='ayneh_bale_bot';const s=await salon(e);
 const calls=[];const previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url);if(!/api\.telegram\.org|tapi\.bale\.ai/.test(u))return previous(url,init);const host=u.includes('bale')?'bale':'tg',method=u.split('/').pop();let body=init?.body;if(body instanceof FormData){const o={};for(const [k,v] of body.entries())o[k]=typeof v==='string'?v:'<file>';body=o}else body=JSON.parse(body||'{}');calls.push({host,method,body});if(method==='sendMediaGroup')return Response.json({ok:true,result:[{message_id:1}]});return Response.json({ok:true,result:{message_id:2}})};
 try{
  await linkSalon(e,s,777);
  const r=await call(e,'/api/s/salon-a/owner/team',{name:'مریم',specialty:'رنگ و مش'},OWNER);assert.match(r.data.links.bale,/^https:\/\/ble\.ir\/ayneh_bale_bot\?start=[a-f0-9]{24}$/);
  await baleHook(e,{message:{chat:{id:9101,type:'private'},text:'/start '+r.data.links.bale.split('start=')[1]}});
  assert.equal(e.DB.sql.prepare('SELECT bale_chat_id b FROM team').get().b,'9101');
  await visit(e,s,V(1),r.data.ref.split('r=')[1]);const g=await guest(e,s);await sendLead(e,s,g,{v:V(1),phone:'09120000021',name:'رها'});
  const msg=calls.filter(c=>c.host==='bale'&&c.method==='sendMessage'&&c.body.chat_id==='9101').at(-1).body;
  assert(msg.text.includes('رها'));assert(!msg.text.includes('<b>'));assert.equal(msg.parse_mode,undefined);
  assert(!calls.some(c=>c.host==='tg'&&String(c.body.chat_id)==='777'&&String(c.body.text||'').includes('رها')),'not to the manager');
 }finally{globalThis.fetch=previous}
});

// ---------- bot reliability and owner alerts ----------
async function linkOwnerChat(e,chat=1000){const r=await call(e,'/api/owner/alerts-link',{},OWNER);assert.equal(r.status,200,JSON.stringify(r));await hook(e,{message:{chat:{id:chat,type:'private'},text:'/start '+r.data.links.telegram.split('start=')[1]}});return chat;}
const toOwner=(tg,chat=1000)=>tg.calls.filter(c=>c.method==='sendMessage'&&String(c.body.chat_id)===String(chat)).map(c=>c.body.text);
const say=(e,chat,text)=>hook(e,{message:{chat:{id:chat,type:'private'},text}});

test('owner alerts: linking, setup events, abandoned wizard frees later photos, /report and the nightly digest',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkOwnerChat(e);assert(toOwner(tg).some(t=>/گزارش‌های آینه/.test(t)));
 assert.deepEqual((await call(e,'/api/owner',undefined,OWNER)).data.alerts.chats,['telegram']);
 const r=await call(e,'/api/s/salon-a/owner/telegram-link',{},OWNER);await say(e,777,'/start '+r.data.code);
 assert(toOwner(tg).some(t=>/ربات را در تلگرام وصل کرد/.test(t)),'owner hears the salon linked');
 // The wizard started on link (profile empty). Answer the name, then abandon at the logo step.
 await say(e,777,'سالن ساناز');assert.equal(JSON.parse(e.DB.sql.prepare('SELECT bot_state b FROM salons').get().b).step,1);
 e.DB.sql.exec("UPDATE salons SET bot_state=json_set(bot_state,'$.ts',"+(Date.now()-30*60000)+")");
 await hook(e,{message:{chat:{id:777,type:'private'},photo:[{file_id:'p1',file_size:100}],caption:'بالیاژ عسلی'}});
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM portfolio').get().n,1,'the photo became portfolio, not the logo');
 assert.equal(JSON.parse(e.DB.sql.prepare('SELECT profile FROM salons').get().profile).logo,undefined);
 assert(toOwner(tg).some(t=>/نیمه‌کاره رها کرد/.test(t)&&/مانده:/.test(t)));
 // Finishing early gives a summary to the salon and the owner.
 await say(e,777,'/setup');await hook(e,{callback_query:{id:'d',data:'wz:done',message:{chat:{id:777},message_id:3}}});
 assert(tg.calls.some(c=>c.body.chat_id==='777'&&/از ۱۱ مورد پر شده/.test(c.body.text||'')));assert(toOwner(tg).some(t=>/زودتر تمام کرد/.test(t)));
 const owner=(await call(e,'/api/owner',undefined,OWNER)).data;assert.equal(owner.salons[0].setup.total,11);assert(owner.activity.length>=3);
 // /report and the 21:00 digest (once a day).
 await say(e,1000,'/report');assert(toOwner(tg).some(t=>/گزارش امروز آینه/.test(t)));
 const {maybeDigest}=await import('../worker/alerts.js');const nine=Date.parse('2026-11-02T17:45:00Z');
 assert.equal(await maybeDigest(e,nine),true);assert.equal(await maybeDigest(e,nine+60000),false,'once a day');
 assert.equal(await maybeDigest(e,Date.parse('2026-11-03T10:00:00Z')),false,'not before 21:00');
 // A stranger link cannot subscribe; stale/abandoned states expire on the scheduler too.
 await say(e,2000,'/start o_'+'0'.repeat(24));assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM owner_chats').get().n,1);
 assert.equal((await call(e,'/api/owner/alerts-link',{})).status,401);
}finally{tg.restore()}});

test('team question: an abandoned or wrong answer never becomes a member; errors are explained to the sender',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);
 await hook(e,{callback_query:{id:'a',data:'tm:add',message:{chat:{id:777},message_id:3}}});
 await say(e,777,'09121234567');assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM team').get().n,0);assert.match(tg.calls.at(-1).body.text,/اسم درست نیست/);
 e.DB.sql.exec("UPDATE salons SET bot_state=json_set(bot_state,'$.ts',"+(Date.now()-30*60000)+")");
 await say(e,777,'مریم');assert.equal(e.DB.sql.prepare('SELECT bot_state b FROM salons').get().b,'','expired: not taken as a name');
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM team').get().n,0);
 // Oversized photo: the salon is told why.
 await hook(e,{message:{chat:{id:777,type:'private'},document:{file_id:'big',mime_type:'image/jpeg',file_size:9*1024*1024},caption:'x'}});
 assert.match(tg.calls.filter(c=>c.body.chat_id==='777').at(-1).body.text,/بزرگ‌تر از ۵ مگابایت/);
 // Same update delivered twice is handled once.
 const u={update_id:42,message:{chat:{id:777,type:'private'},photo:[{file_id:'p9',file_size:100}],caption:'لایت'}};await hook(e,u);await hook(e,u);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM portfolio WHERE title='لایت'").get().n,1);
 // An album: the caption arrives on the second photo but names both.
 await hook(e,{message:{chat:{id:777,type:'private'},media_group_id:'g1',photo:[{file_id:'a1',file_size:100}]}});
 await hook(e,{message:{chat:{id:777,type:'private'},media_group_id:'g1',photo:[{file_id:'a2',file_size:100}],caption:'شینیون عروس'}});
 await hook(e,{message:{chat:{id:777,type:'private'},media_group_id:'g1',photo:[{file_id:'a3',file_size:100}]}});
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM portfolio WHERE title='شینیون عروس'").get().n,3);
}finally{tg.restore()}});

test('waiting for the manager, the manager as a member, follower replies, album fallback, unanswered alert',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkOwnerChat(e);
 const m=await addMember(e,s,'سارا',4002);
 // No manager chat yet: a salon customer's request waits and the owner is told.
 const g=await guest(e,s);const d=await sendLead(e,s,g,{v:V(1),phone:'09120000031',name:'آیدا'});assert.equal(d.waiting,true);
 assert(toOwner(tg).some(t=>/منتظر مدیر سالن/.test(t)));
 await linkSalon(e,s,777);assert(tg.calls.some(c=>c.body.chat_id==='777'&&(c.body.text||'').includes('آیدا')),'delivered when the manager links');
 // The manager works too: /link gives their own code; their customers come to the manager chat as a member.
 await say(e,777,'/link');const me=e.DB.sql.prepare('SELECT * FROM team WHERE is_manager=1').get();assert(me);assert.equal(me.telegram_chat_id,'777');
 await visit(e,s,V(2),me.ref_code);const d2=await sendLead(e,s,await guest(e,s),{v:V(2),phone:'09120000032',name:'لیلی'});
 assert.equal(e.DB.sql.prepare('SELECT staff_id FROM leads WHERE id=?').get(d2.id).staff_id,me.id);
 await hook(e,{callback_query:{id:'b',data:'ls:booked:'+d2.id,message:{chat:{id:777},message_id:1}}});assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads WHERE id=?').get(d2.id).s,'booked');
 // A customer who follows and writes gets her status, not "get a link from the owner".
 const token=d2.follow.telegram.split('start=f_')[1];await say(e,6100,'/start f_'+token);await say(e,6100,'سلام کی زنگ میزنید؟');
 assert.match(tg.calls.at(-1).body.text,/نوبت هماهنگ شد|وضعیت درخواستت/);
 // 24h unanswered: the owner is told once.
 e.DB.sql.exec("UPDATE leads SET created_at="+(Date.now()-25*3600000)+" WHERE id='"+d.id+"'");
 const {alertUnanswered}=await import('../worker/alerts.js');assert.equal(await alertUnanswered(e),1);assert.equal(await alertUnanswered(e),0);
 assert(toOwner(tg).some(t=>/بیش از ۲۴ ساعت/.test(t)));
}finally{tg.restore()}});

test('Telegram album refused: photos go one by one and the details still arrive',async()=>{const e=tgEnv(fixture()),s=await salon(e);
 const calls=[];const previous=globalThis.fetch;globalThis.fetch=async(url,init)=>{const u=String(url);if(!u.startsWith('https://api.telegram.org/'))return previous(url,init);const method=u.split('/').pop();let body=init?.body;if(body instanceof FormData){const o={};for(const [k,v] of body.entries())o[k]=typeof v==='string'?v:'<file>';body=o}else body=JSON.parse(body||'{}');calls.push({method,body});if(method==='sendMediaGroup')return Response.json({ok:false,description:'Bad Request: wrong file'},{status:400});return Response.json({ok:true,result:{message_id:5}})};
 try{await linkSalon(e,s,777);const g=await guest(e,s);const d=await sendLead(e,s,g);assert.equal(d.delivered,true);
  assert(calls.some(c=>c.method==='sendPhoto'));assert(calls.some(c=>c.method==='sendMessage'&&(c.body.text||'').includes('درخواست تازه')));
  assert.equal(e.DB.sql.prepare('SELECT status FROM leads').get().status,'sent');
 }finally{globalThis.fetch=previous}
});

test('a member texts their own link, so the referral is kept',async()=>{const e=smsEnv(tgEnv(fixture())),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const m=await addMember(e,s,'مریم',4001);
 const sms=mockSms();try{await say(e,4001,'09121112233');
  const inv=sms.calls.find(c=>c.kind==='shared');assert(inv,'texted');assert.deepEqual(inv.body.args,['سالن salon-a','salon-a?r='+m.ref_code]);
 }finally{sms.restore()}
 await say(e,4001,'/list');assert.match(tg.calls.at(-1).body.text,/هنوز نمونه‌کاری از تو/);
}finally{tg.restore()}});

// ---------- nails and lashes ----------
test('nails and lashes: line prompts with options, photo-shaped output, no 360, request and portfolio carry the line',async()=>{const e=tgEnv(fixture()),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const {NAIL_STYLES,LASH_STYLES,guessLine,linePrompt}=await import('../worker/lines.js');
 const hand=await upload(e,s,g),ref=await upload(e,s,g,'reference');let previous=globalThis.fetch,captured=[];
 globalThis.fetch=async(url,opts)=>{const u=String(url);if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(u.includes('createTask')){captured.push(JSON.parse(opts.body));return Response.json({code:200,data:{taskId:'t'+captured.length}})}if(u.includes('recordInfo'))return Response.json({code:200,data:{state:'success',resultJson:JSON.stringify({resultUrls:['https://provider.example/o.png']})}});return new Response(png())};
 try{
  const n=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'nails',original_id:hand,style:1,opts:{shape:4,length:9},ratio:'4:5',color:'نود'},g);assert.equal(n.status,200,JSON.stringify(n));
  const p=captured.at(-1).input;assert.match(p.prompt,/Edit ONLY her fingernails/);assert.match(p.prompt,/French manicure/);assert.match(p.prompt,/NAIL SHAPE: almond/);assert.match(p.prompt,/NAIL LENGTH: medium/,'an invalid length index is dropped');assert.match(p.prompt,/nude beige/);assert.equal(p.aspect_ratio,'4:5');
  const row=e.DB.sql.prepare('SELECT line,opts FROM generations WHERE id=?').get(n.data.id);assert.equal(row.line,'nails');assert.deepEqual(JSON.parse(row.opts),{shape:4});
  const l=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'lashes',original_id:hand,reference_id:ref,opts:{map:1},ratio:'weird'},g);assert.equal(l.status,200,JSON.stringify(l));
  assert.match(captured.at(-1).input.prompt,/upper eyelashes[\s\S]*Photo 2 is ONLY a lash reference[\s\S]*cat eye/);assert.equal(captured.at(-1).input.aspect_ratio,'3:4');
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'nails',original_id:hand,style:NAIL_STYLES.length},g)).status,400);
  await call(e,'/api/s/salon-a/generation/'+n.data.id,undefined,g);
  assert.equal((await call(e,'/api/s/salon-a/views',{idem:crypto.randomUUID(),parent:n.data.id},g)).status,400,'no 360 for nails');
  const hair=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:hand,style:0},g);assert.match(captured.at(-1).input.prompt,/Edit ONLY her hair/);assert.equal(hair.status,200);
 }finally{globalThis.fetch=previous}
 assert.equal(guessLine('فرنچ بادامی'),'nails');assert.equal(guessLine('کاشت مژه والیوم'),'lashes');assert.equal(guessLine('بالیاژ عسلی'),'hair');assert.equal(guessLine('عکس جدید'),null);assert.equal(guessLine('رنگ ناخن'),'nails');
 assert.equal(linePrompt('lashes','catalog',LASH_STYLES[0][3],{},'').includes('LASH MAPPING'),false,'no mapping when not chosen');
 // Requests carry the line; the salon sees the service.
 const tg=mockTelegram();try{
  await linkSalon(e,s,777);const d=await sendLead(e,s,g,{line:'nails',look:'ناخن: فرنچ کلاسیک (بادامی)'});
  assert.equal(e.DB.sql.prepare('SELECT line FROM leads WHERE id=?').get(d.id).line,'nails');
  assert(tg.calls.some(c=>(c.body.text||'').includes('خدمت:</b> ناخن')));
  // Portfolio: caption picks the line, otherwise one tap corrects it.
  await hook(e,{message:{chat:{id:777,type:'private'},photo:[{file_id:'p1',file_size:100}],caption:'مژه والیوم گربه‌ای'}});
  await hook(e,{message:{chat:{id:777,type:'private'},photo:[{file_id:'p2',file_size:100}],caption:'کار جدید'}});
  const rows=e.DB.sql.prepare('SELECT id,title,line FROM portfolio ORDER BY created_at').all();assert.equal(rows[0].line,'lashes');assert.equal(rows[1].line,'hair');
  const keys=tg.calls.filter(c=>c.body.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('pfl:')).at(-1).body.reply_markup.inline_keyboard[0];
  await hook(e,{callback_query:{id:'x',data:keys[1].callback_data,message:{chat:{id:777},message_id:4}}});
  assert.equal(e.DB.sql.prepare('SELECT line FROM portfolio WHERE id=?').get(rows[1].id).line,'nails');
  assert.deepEqual((await call(e,'/api/s/salon-a/public')).data.portfolio.map(x=>x.line).sort(),['lashes','nails']);
  const st=(await call(e,'/api/owner/stats?days=7',undefined,OWNER)).data;assert.equal(st.lines.requests.nails,1);
 }finally{tg.restore()}
});

test('review fixes: send form shows when only members can receive; long free text is cut, not rejected',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 assert.equal((await call(e,'/api/s/salon-a/public')).data.telegram,false);
 const r=await call(e,'/api/s/salon-a/owner/team',{name:'مریم',specialty:'ناخن'},OWNER);
 assert.equal((await call(e,'/api/s/salon-a/public')).data.telegram,true,'a member can receive (or the request waits for them)');
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/start '+r.data.links.telegram.split('start=')[1]}});
 await visit(e,s,V(1),r.data.ref.split('r=')[1]);const g=await guest(e,s);
 const d=await sendLead(e,s,g,{v:V(1),phone:'09120000041',name:'ن'.repeat(140),look:'ل'.repeat(300),note:'x'.repeat(2000),color:'ر'.repeat(200)});
 const row=e.DB.sql.prepare('SELECT name,look,note,color FROM leads WHERE id=?').get(d.id);assert.equal(row.name.length,100);assert.equal(row.look.length,150);assert.equal(row.note.length,1000);assert.equal(row.color.length,120);
 assert(tg.calls.some(c=>String(c.body.chat_id)==='4001'&&(c.body.text||'').includes('درخواست تازه')));
}finally{tg.restore()}});
