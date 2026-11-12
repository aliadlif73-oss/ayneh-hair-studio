import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';
import {phone,transferPrompt} from '../worker/domain.js';import {appHTML} from '../worker/ui.js';import {customerHTML} from '../worker/customer.js';import {landingHTML} from '../worker/landing.js';import {tick} from '../worker/server.js';import {styles} from '../worker/legacy.js';

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
 assert.match(transferPrompt('style','',''),/ignore the hair colour of photo 2 completely[\s\S]*Keep her exact hair colour/);assert.match(transferPrompt('color','',''),/Keep her exact haircut/);assert.match(transferPrompt('both','',''),/Never take the face from photo 2/);
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

test('hairstyle copies only the cut and keeps her colour; hair colour keeps the cut, can use the new hairstyle as its base, and paid tasks are deduplicated (mock provider)',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const original=await upload(e,s,g),reference=await upload(e,s,g,'reference');let previous=globalThis.fetch,taskCalls=0,captured=[],uploads=[];
 globalThis.fetch=async(url,opts)=>{if(String(url).includes('file-base64-upload')){const u='https://provider.example/'+crypto.randomUUID()+'.jpg';uploads.push(JSON.parse(opts.body));return Response.json({success:true,data:{downloadUrl:u}})}if(String(url).includes('createTask')){taskCalls++;captured.push(JSON.parse(opts.body));return Response.json({code:200,data:{taskId:'task'+taskCalls}})}if(String(url).includes('recordInfo'))return Response.json({code:200,data:{state:'success',resultJson:JSON.stringify({resultUrls:['https://provider.example/output.png']})}});return new Response(png())};
 try{
  // Hairstyle from a reference photo: two distinct images, only the cut, colour kept even if one is sent.
  const body={image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:original,reference_id:reference,transfer:'both',color:'شرابی'};
  const a=await call(e,'/api/s/salon-a/generate',body,g);assert.equal(a.status,200,JSON.stringify(a));
  const again=await call(e,'/api/s/salon-a/generate',body,g);assert.equal(again.data.id,a.data.id);
  let input=captured.at(-1).input;assert.equal(input.image_input.length,2);assert.notEqual(input.image_input[0],input.image_input[1]);
  assert.match(input.prompt,/copy ONLY the haircut/);assert.match(input.prompt,/Keep her exact hair colour/);assert.match(input.prompt,/DIFFERENT woman/);assert.doesNotMatch(input.prompt,/burgundy/);
  assert.equal(captured.at(-1).model,'nano-banana-pro');assert.equal(input.resolution,'2K');assert.equal(input.output_format,'jpg');
  const hair=await call(e,'/api/s/salon-a/generation/'+a.data.id,undefined,g);assert.equal(hair.data.state,'success');assert.equal((await call(e,'/api/s/salon-a/media/'+hair.data.result_id,undefined,g)).status,200);
  const v=await call(e,'/api/s/salon-a/views',{idem:crypto.randomUUID(),parent:a.data.id},g);assert.equal(v.status,200,JSON.stringify(v));assert.match(captured.at(-1).input.prompt,/Exactly 3 equal tiles[\s\S]*BACK of her head/);assert.equal(captured.at(-1).input.aspect_ratio,'16:9');
  const cat=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:0,color:'عسلی'},g);assert.equal(cat.status,200);
  assert.match(captured.at(-1).input.prompt,new RegExp(styles[0][1]));assert.match(captured.at(-1).input.prompt,/HAIR COLOR: keep her exact hair colour/);
  // Hair colour from the catalog, on the new hairstyle: the hair result is the photo sent.
  const n=uploads.length;
  const c1=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original,base_id:hair.data.result_id,style:4},g);assert.equal(c1.status,200,JSON.stringify(c1));
  input=captured.at(-1).input;assert.equal(input.image_input.length,1);assert.match(input.prompt,/HAIRCUT LOCK/);assert.match(input.prompt,/smoky olive brown/);
  assert.equal(uploads.length,n+1);assert.equal((await e.DB.prepare('SELECT base_id FROM generations WHERE id=?').bind(c1.data.id).first()).base_id,hair.data.result_id);
  // Typed colour, on the original photo; and a colour reference.
  const c2=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original,color:'شرابی'},g);assert.equal(c2.status,200);assert.match(captured.at(-1).input.prompt,/HAIR COLOR: burgundy wine red/);assert.match(captured.at(-1).input.prompt,/HAIRCUT LOCK/);
  const c3=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original,reference_id:reference},g);assert.equal(c3.status,200);assert.match(captured.at(-1).input.prompt,/copy ONLY the hair colour/);assert.equal(captured.at(-1).input.image_input.length,2);
  // A colour with nothing chosen, or a base that is not her own hairstyle result, is refused before paying.
  const before=taskCalls;
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original},g)).status,400);
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original,base_id:reference,style:1},g)).status,400);
  const c1r=await call(e,'/api/s/salon-a/generation/'+c1.data.id,undefined,g);
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'color',original_id:original,base_id:c1r.data.result_id,style:1},g)).status,400);
  assert.equal(taskCalls,before);
  // A request can carry the colour result made on the hairstyle.
  const lead=await call(e,'/api/s/salon-a/leads',{data_consent:true,idem:crypto.randomUUID(),name:'مریم',phone:'09121234567',original_id:original,preview_id:c1r.data.result_id,look:'رنگ مو: دودی زیتونی',color:'دودی زیتونی',line:'color'},g);
  assert.notEqual(lead.status,400,JSON.stringify(lead));
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
 const e2=tgEnv(fixture()),s2=await salon(e2,'salon-b');const tg2=mockTelegram();try{await linkSalon(e2,s2,555);await hook(e2,{message:{chat:{id:555,type:'private'},text:'09121234567'}});const m=tg2.calls.filter(c=>c.method==='sendMessage').at(-1).body;assert.match(m.text,/لینک برای <b>09121234567/);const btn=m.reply_markup.inline_keyboard.flat();assert.match(btn[0].url,/^https:\/\/wa\.me\/989121234567\?text=/);assert.match(btn[1].url,/^https:\/\/t\.me\/share\/url\?url=/);assert.match(btn[2].url,/\/i\/salon-b\?to=09121234567$/)}finally{tg2.restore()}
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
  const p=captured.at(-1).input;assert.match(p.prompt,/Edit ONLY her fingernails/);assert.match(p.prompt,/French manicure/);assert.match(p.prompt,/NAIL SHAPE: almond/);assert.match(p.prompt,/NAIL LENGTH: keep her own nail length/,'an invalid length index is dropped');assert.match(p.prompt,/nude beige/);assert.equal(p.aspect_ratio,'4:5');
  const row=e.DB.sql.prepare('SELECT line,opts FROM generations WHERE id=?').get(n.data.id);assert.equal(row.line,'nails');assert.deepEqual(JSON.parse(row.opts),{shape:4});
  const l=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'lashes',original_id:hand,reference_id:ref,opts:{map:1},ratio:'weird'},g);assert.equal(l.status,200,JSON.stringify(l));
  assert.match(captured.at(-1).input.prompt,/upper eyelashes[\s\S]*Photo 2 is ONLY a lash reference[\s\S]*cat eye/);assert.equal(captured.at(-1).input.aspect_ratio,'3:4');
  assert.equal((await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'nails',original_id:hand,style:NAIL_STYLES.length},g)).status,400);
  await call(e,'/api/s/salon-a/generation/'+n.data.id,undefined,g);
  assert.equal((await call(e,'/api/s/salon-a/views',{idem:crypto.randomUUID(),parent:n.data.id},g)).status,400,'no 360 for nails');
  const hair=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:hand,style:0},g);assert.match(captured.at(-1).input.prompt,/Edit ONLY her hair/);assert.equal(hair.status,200);
 }finally{globalThis.fetch=previous}
 assert.equal(guessLine('فرنچ بادامی'),'nails');assert.equal(guessLine('کاشت مژه والیوم'),'lashes');assert.equal(guessLine('بالیاژ عسلی'),'color');assert.equal(guessLine('کوتاهی ولف'),'hair');assert.equal(guessLine('رنگ مو'),'color');assert.equal(guessLine('عکس جدید'),null);assert.equal(guessLine('رنگ ناخن'),'nails');
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
  const keys=tg.calls.filter(c=>c.body.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('pfl:')).at(-1).body.reply_markup.inline_keyboard.flat();
  assert.deepEqual(keys.filter(k=>k.callback_data.startsWith('pfl:')).map(k=>k.callback_data.split(':')[1]),['hair','color','nails','lashes']);
  await hook(e,{callback_query:{id:'x',data:keys.find(k=>k.callback_data.startsWith('pfl:nails')).callback_data,message:{chat:{id:777},message_id:4}}});
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

test('console token is taken from a pasted full API address or padded value',async()=>{const {consoleToken}=await import('../worker/sms.js');
 const t='81a6aaaabbbbccccddddeeeeffff0000';
 for(const v of [t,' '+t+'\n','https://console.melipayamak.com/api/send/shared/'+t,'https://console.melipayamak.com/api/send/otp/'+t+'/ '])assert.equal(consoleToken({MELIPAYAMAK_TOKEN:v}),t);
});

test('without SMS invites the bot offers messenger buttons and /i/ is a send page with the referral link',async()=>{const e=tgEnv(fixture()),s=await salon(e,'salon-a');const tg=mockTelegram();
 try{await linkSalon(e,s,777);
  await hook(e,{message:{chat:{id:777,type:'private'},text:'/share'}});const m=tg.calls.filter(c=>c.method==='sendMessage').at(-1).body;
  assert.match(m.text,/salon-a/);assert.equal(m.reply_markup.inline_keyboard.flat().length,3);assert.match(m.reply_markup.inline_keyboard[0][0].url,/^https:\/\/wa\.me\/\?text=/);
  const t=e.DB.sql.prepare("SELECT id FROM salons WHERE slug='salon-a'").get();e.DB.sql.prepare("INSERT INTO team(id,salon_id,name,specialty,ref_code,created_at) VALUES('t1',?,'مریم','',?,1)").run(t.id,'sabcdefg');
  const page=await app.fetch(new Request(origin+'/i/salon-a?r=sabcdefg&to=09121234567'),e);assert.equal(page.status,200);const html=await page.text();
  assert.match(html,/sms:09121234567\?&amp;body=/);assert.match(html,/wa\.me\/989121234567/);assert.match(html,/\/s\/salon-a\?r=sabcdefg/);assert.match(html,/مریم از «سالن salon-a»/);assert.match(html,/noindex/);
  new Function(html.match(/<script>([\s\S]*?)<\/script>/)[1]);
  const bad=await app.fetch(new Request(origin+'/i/salon-a?r=<x>&to=javascript:1'),e);const bh=await bad.text();assert.doesNotMatch(bh,/javascript:1|<x>/);assert.match(bh,/\/s\/salon-a/);
  assert.equal((await app.fetch(new Request(origin+'/i/nope'),e)).status,404);
 }finally{tg.restore()}});

// ---------- landing page and salon inquiries ----------
test('landing page is public at / and the owner console stays at /admin',async()=>{const e=tgEnv(fixture());
 const r=await app.fetch(new Request(origin+'/'),e);assert.equal(r.status,200);const html=await r.text();
 assert.match(html,/id="builderLive"/);assert.match(html,/انتخاب مشتری را با عکس ببینید/);assert.match(html,/id="start"/);assert.doesNotMatch(html,/noindex/);
 new Function(html.match(/<script>([\s\S]*?)<\/script>/g).map(s=>s.replace(/<\/?script>/g,'')).join('\n'));
 assert.equal((await app.fetch(new Request(origin+'/admin'),e)).status,200);});

test('salon inquiry from the landing form: saved, sent to the owner chat with the phone, phone kept out of the activity log',async()=>{const e=tgEnv(fixture());const tg=mockTelegram();try{
 await linkOwnerChat(e);
 const bad=await call(e,'/api/inquiry',{name:'سارا',salon:'سالن رز',city:'تهران',phone:'123',consent:true});assert.equal(bad.status,400);
 assert.equal((await call(e,'/api/inquiry',{name:'سارا',salon:'سالن رز',phone:'09121234567',consent:false})).status,400);
 const bot=await call(e,'/api/inquiry',{name:'ربات',salon:'x',phone:'09121234567',consent:true,website:'http://spam'});assert.equal(bot.status,200);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM inquiries').get().n,0,'honeypot is dropped silently');
 const ok=await call(e,'/api/inquiry',{name:'سارا',salon:'سالن رز',city:'تهران',phone:'۰۹۱۲۱۲۳۴۵۶۷',note:'سه آرایشگر داریم',chosen:'ولف‌کات · اسپرسو',consent:true});assert.equal(ok.status,200,JSON.stringify(ok));
 const row=e.DB.sql.prepare('SELECT * FROM inquiries').get();assert.equal(row.phone,'+989121234567');assert.equal(row.salon,'سالن رز');
 const msg=toOwner(tg).find(t=>/سالن رز/.test(t)&&/درخواست معرفی آینه/.test(t));assert(msg,'owner chat got the inquiry');assert.match(msg,/\+989121234567/);assert.match(msg,/ولف‌کات · اسپرسو/);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM activity WHERE text LIKE '%989121234567%'").get().n,0,'phone is not stored in the activity log');
 assert.equal((await app.fetch(new Request(origin+'/api/inquiry',{method:'POST',headers:{'content-type':'application/json'},body:'{}'}),e)).status,403,'cross-origin post is refused');
}finally{tg.restore()}});

test('salon address: capitals and spaces are normalised, duplicates and bad addresses get a clear message',async()=>{const e=fixture();
 const r=await call(e,'/api/salons',{slug:'Aliadli Salon',name:'Ali adli'},OWNER);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.data.slug,'aliadli-salon');
 const dup=await call(e,'/api/salons',{slug:'ALIADLI-salon',name:'x y'},OWNER);assert.equal(dup.status,400);assert.match(dup.data.error,/سالن دیگری گرفته/);
 const bad=await call(e,'/api/salons',{slug:'سالن',name:'x y'},OWNER);assert.equal(bad.status,400);assert.match(bad.data.error,/aliadli-salon/);
});

test('free trial salon: built from the landing form, one per mobile, 5 images and 10 hours enforced by the server',async()=>{const e=tgEnv(fixture());e.KIE_API_KEY='mock';const tg=mockTelegram();const previous=globalThis.fetch;let tasks=0;
 const net=globalThis.fetch;globalThis.fetch=async(url,opts)=>{const u=String(url);if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(u.includes('createTask')){tasks++;return Response.json({code:200,data:{taskId:'t'+tasks}})}return net(url,opts)};
 try{await linkOwnerChat(e);
  const body={name:'سارا',salon:'سالن رز',city:'تهران',phone:'۰۹۱۲۱۲۳۴۵۶۷',brand:'#8E3050',consent:true};
  assert.equal((await call(e,'/api/trial',{...body,consent:false})).status,400);
  assert.equal((await call(e,'/api/trial',{...body,website:'x'})).status,200);assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM trials').get().n,0,'honeypot is dropped');
  const r=await call(e,'/api/trial',body);assert.equal(r.status,200,JSON.stringify(r));assert.match(r.data.path,/^\/s\/t-[a-f0-9]{8}$/);assert.equal(r.data.images,5);assert.equal(r.data.hours,10);
  assert.equal((await call(e,'/api/trial',body)).status,409,'one trial per mobile');
  const slug=r.data.path.slice(3),row=e.DB.sql.prepare('SELECT * FROM trials').get();assert.ok(Math.abs(row.expires_at-row.created_at-36000000)<1000);
  assert(toOwner(tg).find(t=>/سالن رز/.test(t)&&new RegExp(slug).test(t)),'owner chat got the trial link');
  const pub=await call(e,'/api/s/'+slug+'/public');assert.equal(pub.status,200);assert.equal(pub.data.trial.images_left,5);assert.equal(pub.data.trial.brand,'#8E3050');
  const g=await guest(e,{slug}),original=await upload(e,{slug},g);
  const gen=()=>call(e,'/api/s/'+slug+'/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:0,color:'عسلی'},g);
  for(let i=0;i<5;i++)assert.equal((await gen()).status,200);assert.equal(tasks,5);
  const sixth=await gen();assert.equal(sixth.status,402);assert.equal(tasks,5,'no paid task after the budget');
  assert.equal((await call(e,'/api/s/'+slug+'/public')).data.trial.images_left,0);
  e.DB.sql.prepare('UPDATE trials SET expires_at=?, images_used=0').run(Date.now()-1000);
  assert.equal((await gen()).status,410);assert.equal((await call(e,'/api/s/'+slug+'/session',{})).status,410);
  const done=await call(e,'/api/s/'+slug+'/public');assert.equal(done.status,200);assert.equal(done.data.trial.expired,true);
 }finally{globalThis.fetch=previous;tg.restore()}});

test('landing carries an absolute share image and is cacheable',async()=>{const e=fixture();const r=await app.fetch(new Request(origin+'/'),e);const html=await r.text();assert.match(html,new RegExp('og:image" content="'+origin+'/landing/og.jpg"'));assert.doesNotMatch(html,/__ORIGIN__/);assert.match(r.headers.get('cache-control'),/max-age=300/);assert.ok(readFileSync(new URL('../public/landing/og.jpg',import.meta.url)).length>10000)});

test('demo salon behind the landing: mobile confirmation first, 3 images a day per mobile, no 360 view, look handed over by the landing',async()=>{
 const e=tgEnv(fixture());e.KIE_API_KEY='mock';const s={slug:'demo'};
 const pub=await call(e,'/api/s/demo/public');assert.equal(pub.status,200);assert.equal(pub.data.demo,true);assert.equal(pub.data.generation,false,'no SMS configured: demo generation stays off');
 let g=await guest(e,s);const original=await upload(e,s,g);
 const gen=(extra={})=>call(e,'/api/s/demo/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:original,style:1,...extra},g);
 assert.equal((await gen()).status,503,'without SMS nobody can spend paid images');
 smsEnv(e);assert.equal((await call(e,'/api/s/demo/public')).data.generation,true);
 const need=await gen();assert.equal(need.status,403);assert.match(need.data.error,/را تأیید کن/,'the page opens its mobile dialog on this message');
 const sms=mockSms(),net=globalThis.fetch,prompts=[];
 globalThis.fetch=async(url,opts)=>{const u=String(url);if(u.includes('createTask'))prompts.push(JSON.parse(opts.body).input.prompt);if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(u.includes('createTask'))return Response.json({code:200,data:{taskId:'t'+crypto.randomUUID()}});return net(url,opts)};
 try{assert.equal((await call(e,'/api/s/demo/otp/send',otpBody(),g)).status,200);assert.equal((await call(e,'/api/s/demo/otp/verify',{code:'48213'},g)).status,200);
  assert.equal((await gen({apply_color:true,color:'شرابی'})).status,200);assert.match(prompts[0],/burgundy/i);
  assert.equal((await gen()).status,200);assert.match(prompts[1],/original.*colou?r|colou?r.*original/i);
  assert.equal((await gen()).status,200);
  const fourth=await gen();assert.equal(fourth.status,429);
  const v=await call(e,'/api/s/demo/views',{idem:crypto.randomUUID(),parent:'x'},g);assert.equal(v.status,400,'no 360 view in the demo');
 }finally{globalThis.fetch=net;sms.restore()}
 assert.match(customerHTML,/location\.search\.match\(\/\[\?&\]s=/,'customer page reads the landing look');
});
test('customer page: four services, «بساز» starts building with no consent checkbox, one name per saved photo',()=>{
 const js=customerHTML.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1];
 for(const w of ['مدل مو','رنگ مو','ناخن','مژه'])assert(js.includes("'"+w+"'"),w);
 assert(!/id:'consent'|id:'dataConsent'|type:'checkbox'/.test(js),'no consent checkboxes');
 assert.match(js,/function build\(\)\{[\s\S]*?go\(3\);generate\(\)/);
 assert(!/download:'ayneh\.png'/.test(js));assert.match(js,/function saveName\(id\)/);
 // Only the landing demo explicitly combines hairstyle and colour; salon hair keeps its original colour.
 assert.match(js,/var col=state\.line==='hair'\?\(state\.pub\.demo\?state\.color:''\)/);assert.match(js,/base_id:state\.line==='color'/);
 assert.match(js,/function maybeTour\(\)\{if\(SLUG==='demo'&&/,'gallery handoff is not interrupted by the welcome tour');
 // Every service has its building scene and stages.
 for(const l of ['hair','color','nails','lashes'])assert.match(js,new RegExp('\\n '+l+":\\{title:'"));
});
test('hair colour: catalog, prompt keeps the haircut, captions and specialties pick the colour line, stats name it',async()=>{
 const {COLOR_STYLES,COLOR_SWATCHES,LINE_KEYS,LINE_LABEL,colorPrompt,lineFromSpecialty,lineStyles}=await import('../worker/lines.js');
 assert.deepEqual(LINE_KEYS,['hair','color','nails','lashes']);assert.equal(LINE_LABEL.color,'رنگ مو');
 assert.equal(COLOR_STYLES.length,COLOR_SWATCHES.length);assert.equal(lineStyles('color'),COLOR_STYLES);
 for(const m of ['catalog','reference','text'])assert.match(colorPrompt(m,COLOR_STYLES[0][3],'عسلی'),/HAIRCUT LOCK[\s\S]*headscarf/);
 assert.match(colorPrompt('text','','عسلی'),/honey brown/);assert.match(colorPrompt('reference','',''),/ignore its face, skin, haircut/);
 assert.equal(lineFromSpecialty('رنگ و مش'),'color');assert.equal(lineFromSpecialty('کوتاهی'),null);
});
test('owner adds portfolio from the console: photo, title and section; published and usable for try-on',async()=>{
 const e=fixture(),s=await salon(e);
 const up=await call(e,'/api/s/salon-a/upload?kind=portfolio',png(),OWNER);assert.equal(up.status,200,JSON.stringify(up));
 assert.equal((await call(e,'/api/s/salon-a/upload?kind=portfolio',png())).status,401,'owner only');
 const a=await call(e,'/api/s/salon-a/owner/portfolio/add',{media_id:up.data.id,title:'بالیاژ موکا بژ',line:'color'},OWNER);assert.equal(a.status,200,JSON.stringify(a));
 assert.equal((await call(e,'/api/s/salon-a/owner/portfolio/add',{media_id:up.data.id,title:'دوباره',line:'color'},OWNER)).status,400,'no duplicates');
 assert.equal((await call(e,'/api/s/salon-a/owner/portfolio/add',{media_id:'nope',title:'x',line:'color'},OWNER)).status,400);
 const pub=(await call(e,'/api/s/salon-a/public')).data.portfolio;assert.equal(pub.length,1);assert.equal(pub[0].line,'color');assert.equal(pub[0].title,'بالیاژ موکا بژ');
 assert.equal((await call(e,'/api/s/salon-a/media/'+up.data.id)).status,200,'public once published');
});

test('free trial with SMS on: the mobile is confirmed by a texted code before the page is built',async()=>{const e=smsEnv(tgEnv(fixture()));const tg=mockTelegram(),sms=mockSms();try{await linkOwnerChat(e);
 const body={salon:'سالن یاس',phone:'۰۹۱۲۷۶۵۴۳۲۱',consent:true};
 const sent=await call(e,'/api/trial',body);assert.equal(sent.status,200,JSON.stringify(sent));assert.equal(sent.data.code_sent,true);assert.equal(sms.calls.length,1);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM trials').get().n,0,'nothing is built before the code');
 assert.equal((await call(e,'/api/trial',body)).status,429,'resend cooldown');
 assert.equal((await call(e,'/api/trial',{...body,code:'11111'})).status,400);
 const ok=await call(e,'/api/trial',{...body,code:'۴۸۲۱۳'});assert.equal(ok.status,200,JSON.stringify(ok));assert.match(ok.data.path,/^\/s\/t-/);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM otps WHERE session_id LIKE 'trial:%'").get().n,0,'a used code is gone');
 assert.equal((await call(e,'/api/trial',{...body,code:'48213'})).status,409);
}finally{tg.restore();sms.restore()}});
test('each person gets 3 images per service: a new session in the same browser still counts, failures do not, the message names what is left',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const previous=globalThis.fetch;let tasks=0;
 globalThis.fetch=async(url)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){tasks++;return Response.json({code:200,data:{taskId:'t'+tasks}})}return new Response(png())};
 try{
  const v='ab'.repeat(16),original=await upload(e,s,g);
  const gen=(who,o,line='hair',extra={})=>call(e,'/api/s/salon-a/generate',{v,image_consent:true,idem:crypto.randomUUID(),line,original_id:o,style:0,...extra},who);
  assert.deepEqual((await call(e,'/api/s/salon-a/session?v='+v,undefined,g)).data.quota.left,{hair:3,color:3,nails:3,lashes:3});
  for(let i=0;i<3;i++)assert.equal((await gen(g,original)).status,200);
  const fourth=await gen(g,original);assert.equal(fourth.status,429);assert.match(fourth.data.error,/سهم امتحان «مدل مو»[\s\S]*«رنگ مو»، «ناخن»، «مژه»/);
  // A fresh session in the same browser is the same person.
  const g2=await guest(e,s),o2=await upload(e,s,g2);assert.equal((await gen(g2,o2)).status,429);
  assert.equal((await gen(g2,o2,'nails')).status,200);
  // A failed image is given back.
  e.DB.sql.prepare("UPDATE generations SET state='fail' WHERE session_id=(SELECT session_id FROM generations WHERE line='hair' LIMIT 1) AND line='hair' AND rowid=(SELECT MIN(rowid) FROM generations WHERE line='hair')").run();
  assert.equal((await call(e,'/api/s/salon-a/session?v='+v,undefined,g)).data.quota.left.hair,1);
  assert.equal((await gen(g,original)).status,200);
  assert.equal(tasks,5,'nothing paid beyond the quota');
 }finally{globalThis.fetch=previous}
});

test('activation requires verified mobile and stores the complete private draft and media once',async()=>{
 const env=smsEnv(fixture()),sms=mockSms();
 try{
  assert.equal((await call(fixture(),'/api/activation')).status,503);
  assert.equal((await call(env,'/api/activation')).status,200);
  const g=await guest(env,{slug:'demo'}),id=crypto.randomUUID();
  const draft={name:'سالن نمونه',slug:'sample-beauty',brand:'#ac923a',profile:{bio:'معرفی سالن',phone:'۰۲۱-۲۲۳۳۴۴۵۵',instagram:'https://instagram.com/test'},portfolio:[{title:'فرنچ کلاسیک',line:'nails',description:'طرح سفید'}]};
  const submit=()=>{
   const data=new FormData();
   data.set('id',id);data.set('draft',JSON.stringify(draft));
   data.set('logo',new Blob([png()],{type:'image/png'}),'logo.png');
   data.set('work-0',new Blob([png()],{type:'image/png'}),'nails.png');
   return app.fetch(new Request(origin+'/api/activation',{method:'POST',headers:{origin,cookie:g.cookie},body:data}),env);
  };
  assert.equal((await submit()).status,403);
  assert.equal((await call(env,'/api/s/demo/otp/send',otpBody(),g)).status,200);
  assert.equal((await call(env,'/api/s/demo/otp/verify',{code:'۴۸۲۱۳'},g)).status,200);
  let cancelled=false;
  const oversized=new ReadableStream({
   start(controller){for(let i=0;i<5;i++)controller.enqueue(new Uint8Array(1_000_000));},
   cancel(){cancelled=true;}
  });
  const rejected=await app.fetch(new Request(origin+'/api/activation',{method:'POST',headers:{origin,cookie:g.cookie,'Content-Type':'multipart/form-data; boundary=test'},body:oversized,duplex:'half'}),env);
  assert.equal(rejected.status,413);
  assert.equal(cancelled,true);
  assert.deepEqual(await (await submit()).json(),{ok:true,id});
  assert.deepEqual(await (await submit()).json(),{ok:true,id});
  assert.equal((await call(env,'/api/owner/activations')).status,401);
  const result=await call(env,'/api/owner/activations',undefined,OWNER);
  assert.equal(result.data.requests.length,1);
  const row=result.data.requests[0];
  assert.equal(row.contact_phone,'+989121234567');
  assert.equal(row.draft.profile.phone,'02122334455');
  assert.deepEqual(row.draft.portfolio,[{...draft.portfolio[0],slot:'work-0'}]);
  const path='/api/owner/activations/'+id+'/work-0';
  assert.equal((await call(env,path)).status,401);
  const asset=await app.fetch(new Request(origin+path,{headers:{'oai-authenticated-user-id':OWNER.user,'oai-authenticated-user-email':OWNER.email}}),env);
  assert.equal(asset.status,200);
  assert.deepEqual(new Uint8Array(await asset.arrayBuffer()),png());
  assert.equal((await app.fetch(new Request(origin+'/s/'+draft.slug),env)).status,404);
 }finally{sms.restore()}
});

test('activation pagination keeps requests with the same timestamp',async()=>{
 const env=fixture();
 for(let i=0;i<31;i++){
  env.DB.sql.prepare('INSERT INTO salon_activations VALUES(?,?,?,?,?)').run(crypto.randomUUID(),'نام آزمون','+989121234567','{}',1000);
 }
 const first=await call(env,'/api/owner/activations',undefined,OWNER);
 assert.equal(first.data.requests.length,30);
 const last=await call(env,'/api/owner/activations?before='+first.data.next,undefined,OWNER);
 assert.equal(last.data.requests.length,1);
 assert.equal(last.data.next,null);
 assert.equal(new Set([...first.data.requests,...last.data.requests].map(row=>row.id)).size,31);
});
test('salon daily image cap is an owner setting: 0 removes it, a number enforces it, other settings are kept',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';
 const previous=globalThis.fetch;let tasks=0;
 globalThis.fetch=async(url)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){tasks++;return Response.json({code:200,data:{taskId:'t'+tasks}})}return new Response(png())};
 try{
  const o=await upload(e,s,g),gen=line=>call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line,original_id:o,style:0},g);
  assert.equal((await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true,daily_limit:2},OWNER)).status,200);
  assert.equal((await gen('hair')).status,200);assert.equal((await gen('nails')).status,200);
  const third=await gen('lashes');assert.equal(third.status,429);assert.match(third.data.error,/سقف استفادهٔ روزانه/);
  assert.equal((await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true,daily_limit:0},OWNER)).status,200);
  assert.equal((await gen('lashes')).status,200,'no cap');
  const st=(await call(e,'/api/s/salon-a/owner',undefined,OWNER)).data.salon.settings;assert.equal(st.daily_limit,0);assert.equal(st.generation_enabled,true);
  // Saving without the field keeps the cap; flags set elsewhere survive.
  e.DB.sql.prepare("UPDATE salons SET settings=json_set(settings,'$.demo',json('true')) WHERE slug='salon-a'").run();
  await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
  const st2=(await call(e,'/api/s/salon-a/owner',undefined,OWNER)).data.salon.settings;assert.equal(st2.daily_limit,0);assert.equal(st2.demo,true);
 }finally{globalThis.fetch=previous}
});
test('a salon work with a written look is tried on from the text only: one photo (hers), the work photo never sent',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const previous=globalThis.fetch,captured=[];
 globalThis.fetch=async(url,opts)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){captured.push(JSON.parse(opts.body));return Response.json({code:200,data:{taskId:'t'+captured.length}})}return new Response(png())};
 try{
  const up=(await call(e,'/api/s/salon-a/upload?kind=portfolio',png(),OWNER)).data.id;
  const added=await call(e,'/api/s/salon-a/owner/portfolio/add',{media_id:up,title:'لیر بلند صاف',line:'hair',look:'long sleek straight hair with long V-shaped layers'},OWNER);assert.equal(added.status,200);
  const o=await upload(e,s,g);
  const r=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:o,reference_id:up},g);assert.equal(r.status,200,JSON.stringify(r));
  const inp=captured.at(-1).input;assert.equal(inp.image_input.length,1,'only her photo');assert.match(inp.prompt,/give her long sleek straight hair with long V-shaped layers/);assert.match(inp.prompt,/keep her exact hair colour/);assert.doesNotMatch(inp.prompt,/Photo 2/);
  // Without a look the work photo is still used, with the stronger lock.
  await call(e,'/api/s/salon-a/owner/portfolio/look',{id:added.data.id,look:''},OWNER);
  await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:o,reference_id:up},g);
  assert.equal(captured.at(-1).input.image_input.length,2);assert.match(captured.at(-1).input.prompt,/DIFFERENT woman/);
 }finally{globalThis.fetch=previous}
});
test('the team\'s own verified mobiles (app_settings unlimited_phones) have no image limits',async()=>{
 const e=fixture(),s=await salon(e);e.KIE_API_KEY='mock';
 const previous=globalThis.fetch;let tasks=0;
 globalThis.fetch=async(url)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){tasks++;return Response.json({code:200,data:{taskId:'t'+tasks}})}return new Response(png())};
 try{
  await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true,daily_limit:2},OWNER);
  e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('unlimited_phones',?,?)").run(JSON.stringify(['+989120000001']),Date.now());
  const g=await guest(e,s),sid=e.DB.sql.prepare('SELECT id FROM sessions ORDER BY created_at DESC LIMIT 1').get().id;
  e.DB.sql.prepare('UPDATE sessions SET verified_phone=? WHERE id=?').run('+989120000001',sid);
  const o=await upload(e,s,g);
  assert.equal((await call(e,'/api/s/salon-a/session',undefined,g)).data.quota,null);
  for(let i=0;i<5;i++){const r=await call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:o,style:0},g);assert.equal(r.status,200,JSON.stringify(r))}
  // Anyone else still has the limits.
  const g2=await guest(e,s),o2=await upload(e,s,g2);
  const other=()=>call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:o2,style:0},g2);
  assert.equal((await other()).status,200);assert.equal((await other()).status,200);assert.equal((await other()).status,429,'the daily cap of 2 still applies to others');
 }finally{globalThis.fetch=previous}
});

test('landing funnel events are first-party, validated and attributed',async()=>{
 const e=fixture();
 const sid='abcdef12-3456-7890-abcd-ef1234567890';
 const attribution={utm_source:'instagram',utm_medium:'social',utm_campaign:'salon-launch',
  referrer:'https://t.me',landing:'/',host:'test.example'};
 const ok=await call(e,'/api/event',{session:sid,kind:'wizard_step_complete',step:3,meta:'{"key":"bio"}',attribution});
 assert.equal(ok.status,200,JSON.stringify(ok));assert.equal(ok.data.ok,true);
 const row=e.DB.sql.prepare('SELECT session,kind,step,utm_source,attribution FROM landing_events').get();
 assert.equal(row.kind,'wizard_step_complete');assert.equal(row.step,3);
 assert.equal(row.utm_source,'instagram');
 assert.equal(row.session,sid);
 assert.equal(JSON.parse(row.attribution).utm_campaign,'salon-launch');
 assert.equal(JSON.parse(row.attribution).referrer,'https://t.me');
 assert.equal((await call(e,'/api/event',{session:sid,kind:'not_a_real_event'})).status,400,'unknown kind rejected');
 assert.equal((await call(e,'/api/event',{session:'x',kind:'cta_click'})).status,400,'bogus session rejected');
 // Attribution travels with the fallback lead, not only with events.
 const lead=await call(e,'/api/inquiry',{name:'علی رضایی',salon:'سالن تست',phone:'09123456789',
  city:'',website:'',consent:true,chosen:'صفحهٔ اختصاصی سالن',attribution});
 assert.equal(lead.status,200,JSON.stringify(lead));
 const inquiry=e.DB.sql.prepare('SELECT attribution FROM inquiries').get();
 assert.equal(JSON.parse(inquiry.attribution).utm_source,'instagram');
 assert.equal(JSON.parse(inquiry.attribution).host,'test.example');
 // Oversized / hostile values are clamped, never stored verbatim.
 await call(e,'/api/event',{session:sid,kind:'cta_click',meta:'x'.repeat(2000),
  attribution:{utm_source:'y'.repeat(500)}});
 const stored=e.DB.sql.prepare("SELECT meta,utm_source FROM landing_events WHERE kind='cta_click'").get();
 assert.equal(stored.meta.length,300);
 assert.equal(stored.utm_source.length,60);
});

test('funnel step 4: demos keep the owner on the landing and give demo visitors a way back',()=>{
 const canon='ساخت صفحهٔ من';
 // The three genuinely off-site demos open in a new tab and carry campaign attribution.
 const offsite=[...landingHTML.matchAll(/<a class="btn btn--ghost svc-try" href="([^"]+)"([^>]*)>/g)];
 assert.equal(offsite.length,3,'three service demo links');
 for(const [,href,attrs] of offsite){
  assert.match(href,/^https:\/\/ayneh-salon\.site\/s\//);
  assert.match(href,/from=landing/);assert.match(href,/utm_source=landing/);
  assert.match(href,/utm_campaign=owner_preview/);assert.match(href,/utm_content=(hair|nails|lashes)/);
  assert.match(attrs,/target="_blank"/);assert.match(attrs,/rel="noopener noreferrer"/);
 }
 // The four in-page demo openers stay in-page, but their no-JS fallback is identified too.
 assert.equal((landingHTML.match(/href="\/s\/demo\?l=hair&amp;from=landing"/g)||[]).length,4);
 assert.match(landingHTML,/ببینید مشتری چه می\u200cبیند/,'hero secondary CTA is owner-framed');
 assert.equal((landingHTML.match(/چطور کار می\u200cکند/g)||[]).length,3,'nav labels tell what the demo does');
 assert.doesNotMatch(landingHTML,/تجربهٔ آینه/);
 // The customer shell has exactly one owner-return bar, gated to demo / explicit landing visits.
 assert.match(customerHTML,/var FROM_LANDING=\/\[\?&\]from=landing/);
 assert.match(customerHTML,/\(state\.pub\.demo\|\|FROM_LANDING\)&&!\$\('\.trialbar'\)/);
 assert.match(customerHTML,/class:'trialbar owner-return'/);
 assert.match(customerHTML,/utm_medium=demo_return&utm_campaign=owner_preview#salon-example/);
 assert.doesNotMatch(customerHTML,/\/#start/,'no stale studio anchor');
 assert.doesNotMatch(customerHTML,/صفحهٔ آزمایشی رایگان سالن من/,'no rejected CTA label');
 assert.ok(customerHTML.includes(canon),'canonical CTA label on the return bar');
 // Bar and CTA render from the same script that is syntax-checked above.
 new Function(customerHTML.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/)[1]);
});

test('funnel step 5: two questions reach a ready preview, optional details stay live and are never lost',()=>{
 const landing=landingHTML;
 assert.equal((landing.match(/class="wizard-step/g)||[]).length,2,'only name + slug gate the preview');
 assert.match(landing,/id="wizardCount">۱ از ۲</);
 assert.match(landing,/id="builderDetails"/);
 assert.equal((landing.match(/class="detail-group"/g)||[]).length,7,'seven optional groups moved into one panel');
 assert.match(landing,/id="builderBuild"[^>]*disabled hidden/,'no extra build click');
 // Every field of the old nine-step wizard survives, so the draft keeps all of it.
 for(const key of ['name','slug','brand','logo','cover','bio','manager','phone','hours','address',
  'portrait','map','instagram','telegram','website'])
  assert.match(landing,new RegExp('name="'+key+'"'),'field '+key+' kept');
 const scripts=[...landing.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 for(const src of scripts)new Function(src);
 const bundle=scripts.join('\n');
 assert.match(bundle,/ayneh:wizard-ready/);
 assert.match(bundle,/async function packageDraft/);
 assert.match(bundle,/draft=await packageDraft\(\)/,'request is packaged from current values at click time');
 assert.doesNotMatch(bundle,/activate\.hidden=!available\|\|!draft\|\|dirty/,'no rebuild-after-edit dead end');
 assert.doesNotMatch(bundle,/href="#start"/);
 assert.ok(landing.length<250000,'landing stays inside its size budget');
});

test('funnel step 6: cost, time and privacy are answered with no new claims',()=>{
 // Step 13 moved the strip to the third section, directly before its CTA.
 const strip=(landingHTML.match(/<ul class="reassure"[^>]*>[\s\S]*?<\/ul>/)||[])[0]||'';
 const inline=(landingHTML.match(/<p class="reassure-inline">[\s\S]*?<\/p>/)||[])[0]||'';
 assert.equal((strip.match(/<li>/g)||[]).length,3,'three objections answered');
 for(const label of ['اعلام مبلغ','زمان','حریم خصوصی'])assert.ok(strip.includes(label),'answers '+label);
 assert.ok(inline.includes('درخواستتان'),'studio restates the next action without another free claim');
 // Owner pivot: the strip points at the price panels instead of refusing a figure.
 // No invented number or time promise is allowed in that strip either.
 assert.match(strip,/href="#pricing">بخش قیمت/,'cost objection links to the panels');
 for(const banned of [/میلیون/,/\d+\s*(?:روز|ساعت|دقیقه|هفته)/,/شارژ ماهانه/])
  assert.doesNotMatch(strip+inline,banned);
 // Step 3's "unify درخواست راهاندازی" is now complete in the OTP path too.
 assert.doesNotMatch(landingHTML,/فعال\u200cسازی/);
 assert.match(landingHTML,/id="builderActivate"[^>]*>درخواست راه\u200cاندازی</);
 // The canonical CTA label from step 3 is untouched.
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.ok(landingHTML.length<250000,'raised bloat guard still respected');
});

test('funnel step 7: hero speaks to the salon owner and has one clear primary CTA',()=>{
 const h1=(landingHTML.match(/<h1 id="h1"[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'';
 // Step 13 explicitly replaced the step-7 owner-fact headline with the owner's
 // short brand line. The owner framing still lives in the lead below it.
 assert.equal(h1,'انتخاب مشتری را با عکس ببینید');
 assert.ok(h1.includes('مشتری')&&h1.includes('عکس'),'customer choice and photo are named');
 assert.match(landingHTML,/<p class="hero-sub">صفحه\u200cای به نام شما یا آرایشگاه\u200cتان، انتخاب مشتری را همراه عکس خودش، پیش از مراجعه نشان می\u200cدهد\./,'one support sentence names the product and owner benefit');
 assert.equal((h1.match(/<span/g)||[]).length,0,'headline stays plain static text');
 assert.match(landingHTML,/صفحه\u200cای با نام و رنگ خودتان/,'lead is owner-framed');
 const row=(landingHTML.match(/<div class="cta-row">([\s\S]*?)<\/div>/)||[])[1]||'';
 assert.match(row,/class="btn btn--lg" href="#salon-example"><span>ساخت صفحهٔ من/);
 assert.match(row,/class="btn btn--ghost btn--quiet" data-try="hair"/,'demo CTA demoted but still a .btn');
 assert.doesNotMatch(row,/class="btn btn--lg"[^>]*data-try/,'primary and demo are not both prominent');
 // Everything from the earlier steps stays intact.
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.match(landingHTML,/<ul class="reassure"/,'three-fact strip survives (step 13 moved it)');
 assert.match(landingHTML,/id="builderDetails"/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.equal((landingHTML.match(/href="#start"/g)||[]).length,1,'only the step-14 sticky CTA jumps straight to the form');
 assert.ok(landingHTML.length<250000);
});

test('funnel step 8: every success state answers what happens next, with no new claims',()=>{
 const tpl=(landingHTML.match(/<template id="followUpTemplate">([\s\S]*?)<\/template>/)||[])[1]||'';
 assert.ok(tpl,'the follow-up copy has a single source of truth');
 assert.equal((tpl.match(/<li>/g)||[]).length,3,'three steps: received/reviewed, who calls, what is needed');
 for(const label of ['دریافت و بررسی','تماس تیم آینه','از طرف شما'])assert.ok(tpl.includes(label),label);
 assert.match(tpl,/کارشناسان ما/,'who reviews');
 assert.match(tpl,/گفتگو و هماهنگی راه\u200cاندازی/,'who calls and why');
 assert.match(tpl,/نیازی به پرداخت یا کاری از طرف شما نیست/,'nothing needed from the owner');
 assert.match(tpl,/شماره فقط برای پیگیری همین درخواست استفاده می\u200cشود/,'existing privacy line');
 // No invented proof, price, timeframe or social proof anywhere in the new copy.
 assert.doesNotMatch(tpl,/میلیون|تومان|شارژ ماهانه|[۰-۹0-9]+\s*(روز|ساعت|دقیقه|هفته|ماه)/);
 assert.doesNotMatch(tpl,/رضایت|ستاره|نظر مشتری|مشتریان ما|سالن\u200cهای همکار|تضمین/);
 // Both success paths use the same template; neither writes a drifting sentence.
 assert.match(landingHTML,/id="builderThanks" class="follow-up-slot" role="status" hidden/);
 assert.match(landingHTML,/class="lf-done follow-up-slot" id="lf-done" role="status" hidden/);
 assert.match(landingHTML,/window\.__AYN_FOLLOWUP=slot=>/,'helper bundled');
 assert.match(landingHTML,/__AYN_FOLLOWUP\?\.\(thanks\)/,'OTP dialog path');
 assert.match(landingHTML,/__AYN_FOLLOWUP\?\.\(done\)/,'always-available phone path');
 // Analytics and every earlier funnel step are unchanged.
 assert.equal((landingHTML.match(/lead_submit'/g)||[]).length>=2,true);
 assert.match(landingHTML,/انتخاب مشتری را با عکس ببینید/);
 assert.match(landingHTML,/<ul class="reassure"/,'three-fact strip survives (step 13 moved it)');
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.ok(landingHTML.length<250000,'bloat guard still respected');
});

test('final funnel audit: structure, anchors, labels and the two legibility fixes hold',()=>{
 const ids=[...landingHTML.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,'no duplicate id in the shipped page');
 const idSet=new Set(ids);
 const anchors=[...landingHTML.matchAll(/href="#([^"]+)"/g)].map(m=>m[1]);
 assert.ok(anchors.length>=20,'internal navigation is present');
 for(const a of new Set(anchors))assert.ok(idSet.has(a),'anchor #'+a+' resolves');
 for(const attr of ['aria-controls','aria-labelledby','aria-describedby']){
  const refs=[...landingHTML.matchAll(new RegExp(attr+'="([^"]+)"','g'))].flatMap(m=>m[1].split(/\s+/));
  for(const r of refs)assert.ok(idSet.has(r),attr+' '+r+' resolves');
 }
 assert.equal((landingHTML.match(/<h1[\s>]/g)||[]).length,1,'exactly one h1');
 assert.match(landingHTML,/<img id="roomImg2"[^>]*alt=""[^>]*aria-hidden="true"/);
 assert.doesNotMatch(landingHTML,/R0lGODlhAQABAAAAACw=/,'truncated 1x1 GIF placeholder is gone');
 assert.match(landingHTML,/R0lGODlhAQABAIAAAAAAAP/, 'valid transparent GIF placeholder');
 // .builder-note has an !important dark colour; the dark preview panel needs an
 // equally important, more specific light override or its runtime hint is unreadable.
 assert.match(landingHTML,/\.builder-preview>\.builder-note\{color:#E4ECF5!important\}/);
 assert.ok(landingHTML.indexOf('.builder-preview>.builder-note{color:#E4ECF5!important}')>
          landingHTML.indexOf('.builder-note{color:#39455A!important}'),'override comes later');
 assert.equal((landingHTML.match(/href="#start"/g)||[]).length,1,'only the step-14 sticky CTA jumps straight to the form');
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.ok(landingHTML.length<250000);
});

test('funnel step 10: secondary buttons stay legible and controls share one visual language',()=>{
 // polish.css gives every .btn a blue gradient with --button-text:#F7FAFF; the
 // old .btn--ghost !important dark navy produced 2.43:1 on six buttons.
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/);
 assert.doesNotMatch(landingHTML,/\.btn--ghost\{[^}]*color:#1B2B45!important\}/);
 assert.match(landingHTML,/:where\(\.wizard-step,\.detail-group,\.builder-dialog,\.lead-fallback\)/,'section 19 shipped');
 assert.match(landingHTML,/:is\(input,select,textarea\):not\(\[type=file\]\)/,'one field token');
 assert.match(landingHTML,/\.lead-fallback \.lf-check input\{appearance:none/,'designed checkbox');
 assert.doesNotMatch(landingHTML,/\.detail-group\{[^}]*border-top:1px dashed/,'no dashed group dividers');
 // cinema.css paints the upload wells dashed/grey; the later override must win.
 assert.match(landingHTML,/\.upload-control\{border:1px solid rgba\(198,172,116,\.85\)!important/);
 assert.ok(landingHTML.indexOf('.upload-control{border:1px solid rgba(198,172,116,.85)!important')>
          landingHTML.indexOf('border:1.5px dashed #6c757f'),'override is bundled later');
 // Everything from the earlier steps survives.
 assert.match(landingHTML,/انتخاب مشتری را با عکس ببینید/);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.match(landingHTML,/R0lGODlhAQABAIAAAAAAAP/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.ok(landingHTML.length<250000);
});

test('funnel step 11: page-wide surfaces and readability floors',()=>{
 // The light-section kicker colour was forced onto the dark invite section (3:1).
 assert.match(landingHTML,/\.salon-invite-copy \.journey-kicker,\.salon-invite-copy \.journey-kicker \.type-live\{color:#E7C892!important\}/);
 // FAQ now uses the same flat cream / gold-hairline language as every other card.
 assert.match(landingHTML,/\.faq>details\{background:#FFFDF8/,'flat FAQ card');
 assert.match(landingHTML,/\.faq>details>p\{background:#FFFBF0/,'flat FAQ panel');
 assert.match(landingHTML,/\.faq summary::after\{background:linear-gradient\(145deg,#F7E7BD/,'gold accordion control');
 // A floor for real UI labels (the miniature phone preview keeps its own scale).
 assert.match(landingHTML,/\.salon-builder \.wizard-step label\{font-size:12px!important\}/);
 assert.match(landingHTML,/\.upload-name,\.salon-builder \.upload-name\{font-size:12px!important\}/);
 assert.match(landingHTML,/\.lead-fallback \.lf-privacy\{font-size:13px!important\}/);
 assert.match(landingHTML,/\.reassure li,\.reassure b,\.reassure-inline\{font-size:12\.5px!important\}/);
 // Steps 1-10 remain intact.
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/);
 assert.match(landingHTML,/\.upload-control\{border:1px solid rgba\(198,172,116,\.85\)!important/);
 assert.match(landingHTML,/\.lead-fallback \.lf-check input\{appearance:none/);
 assert.match(landingHTML,/انتخاب مشتری را با عکس ببینید/);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.ok(landingHTML.length<250000);
});

test('funnel step 12: the mirror leads the mobile first fold and three gold medallions survived',()=>{
 // Desktop stays untouched: the teaser and the scroll cue are display:none, and
 // the medallions are suppressed there (the desktop reassure band is a tight
 // inline strip inside a fixed-height sticky stage).
 assert.match(landingHTML,/\.hero-scroll-cue\{display:none!important\}/,'the cue, not the product UI, is hidden on desktop');
 // On phones/tablets .copy is display:contents, so orders are on .stage itself.
 // Step 14 inserted a sub-line and a caption, so the effective order is now
 // h1 2, sub 3, visual 4, note 5, CTA 6, copy 7/8, cue 9, demo 10.
 assert.match(landingHTML,/\.hero-proof\{[^}]*order:4/);
 assert.match(landingHTML,/\.salon-invite-copy>\.reassure\{grid-column:1 \/ -1;grid-row:4/);
 assert.match(landingHTML,/\.hero-scroll-cue\{[^}]*order:9/);
 assert.match(landingHTML,/\.stage \.copy \.lead\{display:none!important\}/);
 assert.match(landingHTML,/\.hero-details \.fineprint/,'disclosures moved below the fold');
 assert.match(landingHTML,/\.hero-playground\{order:10\}/);
 // Section 23 ships last, so its order wins over the section-21/hero.css rules.
 assert.ok(landingHTML.indexOf('.hero-playground{order:10}')>
          landingHTML.indexOf('.hero-playground{order:9}'),'section 23 wins');
 // The cue is decorative and must stop animating for reduced-motion users.
 assert.match(landingHTML,/@media\(prefers-reduced-motion:reduce\)\{\.hero-scroll-cue svg\{animation:none\}\}/);
 // Three new 3D medallions reuse the exact site component (8 already exist in
 // the services / benefits sections), with cost, time and privacy glyphs.
 assert.equal((landingHTML.match(/class="gold-icon"/g)||[]).length,11);
 assert.match(landingHTML,/M8 11h24v19H8V11Zm0 6h24M14 23h7/);
 assert.match(landingHTML,/M20 6a14 14 0 1 0 0 28 14 14 0 1 0 0-28Zm0 6v8l5 3/);
 assert.match(landingHTML,/M20 6l12 4v9c0 7-5 12-12 15/);
 assert.match(landingHTML,/\.salon-invite-copy \.reassure \.gold-icon\{display:grid;grid-column:1;grid-row:1\/span 2/);
 // No copy was rewritten, added or deleted: all three approved sentences, the
 // owner-framed h1 and the canonical CTA are byte-identical.
 assert.match(landingHTML,/سه پنل در <a href="#pricing">بخش قیمت<\/a> آمده‌اند؛ مبلغ و سهمیهٔ تصویر پیش از هر پرداختی نوشته می\u200cشود\./,'panel pointer replaces the no-price sentence');
 assert.match(landingHTML,/همین حالا ببینید؛ راه\u200cاندازی بعد از گفتگو و هماهنگی\./);
 assert.match(landingHTML,/عکس\u200cها و اطلاعات پیش\u200cنمایش تا پیش از درخواست فقط در مرورگر شماست\./);
 assert.match(landingHTML,/انتخاب مشتری را با عکس ببینید/);
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 // Steps 1-11 remain intact, including the ripple on every button.
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 // 241.2k shipped. The 250k cap is an internal bloat guard, not a Worker limit.
 assert.ok(landingHTML.length<250000);
});

test('funnel step 13: static benefit headline and the three facts before the third-section CTA',()=>{
 // Owner decisions: headline (new h1), inplace_keep (image and demo stay),
 // invite (third section), approve. No other copy is rewritten.
 assert.match(landingHTML,/<h1 id="h1">انتخاب مشتری را با عکس ببینید<\/h1>/);
 assert.doesNotMatch(landingHTML,/<p class="eyebrow reveal">/,'bland opening kicker is gone');
 const intro=(landingHTML.match(/<section id="intro"[\s\S]*?<\/section>/)||[])[0]||'';
 assert.ok(intro&&!intro.includes('class="reassure"'),'the three facts left the hero');
 assert.equal((intro.match(/class="gold-icon"/g)||[]).length,0,'no medallions left in the hero');
 // They now sit in the third section, immediately before its own CTA.
 const invite=(landingHTML.match(/<section class="salon-invite"[\s\S]*?<\/section>/)||[])[0]||'';
 assert.ok(invite.includes('class="reassure"'),'facts are in the third section');
 assert.ok(invite.indexOf('class="reassure"')<invite.indexOf('ساخت صفحهٔ من'),
  'facts come before the CTA');
 assert.equal((invite.match(/class="gold-icon"/g)||[]).length,3,'all three medallions moved too');
 assert.match(landingHTML,/\.copy h1::after\{content:"";display:block;width:46px/,'gold dash survives');
 assert.match(landingHTML,/\.salon-invite-copy>\.reassure\{margin:20px 0 0/,'dark-card restyle shipped');
 assert.match(landingHTML,/\.salon-invite-copy>\.btn\{grid-row:5/,'desktop grid made room');
 // Step 15 removed the typing engine from the h1; section cinema stays.
 assert.doesNotMatch(landingHTML,/prepareType\(heroH1\)/,'no typing ceremony');
 assert.match(landingHTML,/window\.__AYN_HERO_READY=Promise\.resolve\(false\)/,'loader is gone');
 assert.doesNotMatch(landingHTML,/slamHero/);
 assert.match(landingHTML,/if\(still\)return;/,'reduced motion still short-circuits cinema');
 assert.match(landingHTML,/const n=copyEls\.length\|\|1/,'invite reveal reaches the CTA');
 // Step 14 shortens the step-6 sentence and moves the cue to the end of the fold.
 assert.match(landingHTML,/\.hero-proof\{[^}]*order:4/);
 assert.match(landingHTML,/\.hero-playground\{order:10\}/);
 // The three approved sentences, the canonical CTA and the rest of the funnel.
 for(const t of ['سه پنل در <a href="#pricing">بخش قیمت<\/a> آمده‌اند؛ مبلغ و سهمیهٔ تصویر پیش از هر پرداختی نوشته می\u200cشود.',
  'همین حالا ببینید؛ راه\u200cاندازی بعد از گفتگو و هماهنگی.',
  'عکس\u200cها و اطلاعات پیش\u200cنمایش تا پیش از درخواست فقط در مرورگر شماست.'])assert.ok(landingHTML.includes(t));
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2);
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/);
 assert.ok(landingHTML.length<250000);
});

test('funnel step 14: one honest round against the picky-user audit',()=>{
 // Owner decisions: honest_once (no invented price), give_all with real contact
 // details, keep_plus_sub, tune, dedupe_label, approve_all.
 // 1. The brand line stays but is no longer vague or repeated in the loader.
 assert.match(landingHTML,/<p class="hero-sub">صفحه\u200cای به نام شما یا آرایشگاه\u200cتان، انتخاب مشتری را همراه عکس خودش، پیش از مراجعه نشان می\u200cدهد\./,'product is named in the first fold');
 assert.doesNotMatch(landingHTML,/id="siteLoader"/,'loader markup removed');
 assert.doesNotMatch(landingHTML,/site-loader/,'loader styles removed');
 assert.doesNotMatch(landingHTML,/انتخابی که به شما می\u200cآید/,'loader no longer repeats the headline');
 // 2/11. The pivot replaces "no price" with three panels whose figures are still
 // empty: the structure ships, not a made-up number. Every amount is a slot.
 assert.doesNotMatch(landingHTML,/میلیون|شارژ ماهانه/,'no invented figure ships');
 assert.equal((landingHTML.match(/<p class="plan-amount" data-price="/g)||[]).length,3,'one amount slot per panel');
 assert.equal((landingHTML.match(/<p class="plan-quota" data-price="/g)||[]).length,3,'one quota slot per panel');
 assert.equal((landingHTML.match(/<b class="slot">/g)||[]).length,6,'six unfilled figures');
 assert.doesNotMatch(landingHTML,/<b class="slot">[۰-۹0-9]/,'a slot never holds a digit');
 assert.equal((landingHTML.match(/رایگان/g)||[]).length,1,'free is defined once');
 assert.match(landingHTML,/منظور از رایگان: ساخت پیش\u200cنمایش، ثبت درخواست و امتحان خدمات روی عکس خودتان، بدون پرداخت و بدون ثبت\u200cنام است/);
 assert.match(landingHTML,/class="sticky-cta" id="stickyCta" href="#start" hidden/,'contextual CTA jumps to the form');
 assert.match(landingHTML,/تنها تأیید شمارهٔ موبایل لازم دارد/,'free boundary and OTP are explicit');
 assert.doesNotMatch(landingHTML,/پیش\u200cنمایش و درخواست رایگان است؛/,'step-6 repetition removed');
 // 4. Real owner-supplied identity, plus honest disclosure where data was absent.
 assert.match(landingHTML,/href="tel:09105647497" dir="ltr"/);
 assert.match(landingHTML,/href="mailto:omidadli78@gmail.com" dir="ltr"/);
 assert.match(landingHTML,/تیم سازنده: <b>آینه<\/b>/);
 assert.doesNotMatch(landingHTML,/منتشر نکرده\u200cایم/,'temporary samples replaced the unpublished labels');
 assert.match(landingHTML,/نمونهٔ موقت/,'temporary product UI is labelled');
 assert.doesNotMatch(landingHTML,/sticky-cta-note/,'phone is no longer repeated on the sticky bar');
 // 5/6. Distinct crop, accuracy warning beside the image, three services named.
 assert.match(landingHTML,/\.hero-proof \.live-img\{[^}]*transform:none!important/,'real before/after plates stay aligned');
 assert.match(landingHTML,/شبیه\u200cسازی تقریبی است و نتیجهٔ نهایی را تضمین نمی\u200cکند/);
 assert.match(landingHTML,/خدمات قابل امتحان: مدل و رنگ مو، طرح ناخن یا مدل مژه، روی عکس خود مشتری\./);
 // The desktop copy of the accuracy warning is static, not a scrubbed .reveal
 // element: a measured screenshot caught a paused hero animation dimming it.
 assert.match(landingHTML,/<p class="hero-honesty">شبیه\u200cسازی تقریبی است/);
 assert.doesNotMatch(landingHTML,/hero-honest-desktop/,'one honesty line, no duplicate');
 assert.match(landingHTML,/\.hero-honesty\{[^}]*opacity:1!important/,'warning stays fully opaque');
 // 7/9. The cue is last in the fold and the dark-card text is larger.
 assert.match(landingHTML,/\.hero-scroll-cue\{[^}]*order:9/);
 assert.match(landingHTML,/\.salon-invite-copy \.reassure li>span:last-child,\.salon-invite-copy \.reassure b\{font-size:15\.5px!important/);
 // 10. Faster typing and loader, but no cinema/ripple deletion.
 assert.doesNotMatch(landingHTML,/clamp\(\(now-t0\)/,'no typing boot track');
 assert.doesNotMatch(landingHTML,/resolve\(false\),1100\)/,'no loader deadline');
 assert.doesNotMatch(landingHTML,/loader\.remove\(\),250\)/,'no delayed loader removal');
 assert.match(landingHTML,/invite-play/,'film is visibly a film');
 assert.doesNotMatch(landingHTML,/const typeH1=prepareType\(heroH1\)/,'typing removed');
 assert.match(landingHTML,/if\(still\)return;/);
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/);
 assert.match(landingHTML,/<template id="followUpTemplate">/);
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2,'step-5 form unchanged');
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.ok(landingHTML.length<250000);
});

test('funnel step 15: zero-criticism round against the second picky-user review',()=>{
 // Owner decisions: no_number_clear, all (temporary samples), new_composite,
 // full. Free boundary confirmed as free_yes. PR #41 stays open, not merged.
 // 1. A benefit-oriented static headline, with no typing or loader ceremony.
 assert.match(landingHTML,/<h1 id="h1">انتخاب مشتری را با عکس ببینید<\/h1>/);
 assert.doesNotMatch(landingHTML,/prepareType\(heroH1\)/,'no typing');
 assert.doesNotMatch(landingHTML,/clamp\(\(now-t0\)/,'no boot track');
 assert.doesNotMatch(landingHTML,/resolve\(false\),1100\)/,'no loader deadline');
 assert.doesNotMatch(landingHTML,/loader\.remove\(\),250\)/,'no delayed loader removal');
 assert.match(landingHTML,/window\.__AYN_HERO_READY=Promise\.resolve\(false\)/,'loader removed at once');
 assert.doesNotMatch(landingHTML,/id="siteLoader"|site-loader/,'no loader markup or styles');
 assert.match(landingHTML,/if\(still\)return;/,'section cinema and reduced-motion path survive');
 assert.match(landingHTML,/\.btn--ghost\{[^}]*color:var\(--button-text,#F7FAFF\)!important\}/,'ripples/buttons survive');
 // 2. Why there is no number, plus an unambiguous free boundary.
 // Pricing is now a named section, and the old "no figure at all" stance is gone.
 assert.doesNotMatch(landingHTML,/میلیون|شارژ ماهانه/);
 assert.doesNotMatch(landingHTML,/قیمت ثابت از قبل اعلام نمی\u200cشود|چرا عدد ثابت اعلام نمی\u200cشود؟/,'stale no-price copy removed');
 assert.match(landingHTML,/<section id="pricing"[^>]*class="section section--sunken pricing"/,'panels are a real section');
 assert.match(landingHTML,/href="#pricing"/,'the funnel can reach the panels');
 assert.equal((landingHTML.match(/رایگان/g)||[]).length,1,'free defined once');
 assert.match(landingHTML,/امتحان خدمات روی عکس خودتان، بدون پرداخت و بدون ثبت\u200cنام است/);
 assert.match(landingHTML,/تنها تأیید شمارهٔ موبایل لازم دارد/);
 // 3. Real contact stays verbatim; temporary sample values are explicitly labelled.
 assert.match(landingHTML,/href="tel:09105647497" dir="ltr"/);
 assert.match(landingHTML,/href="mailto:omidadli78@gmail.com" dir="ltr"/);
 assert.match(landingHTML,/تیم سازنده: <b>آینه<\/b>/);
 assert.match(landingHTML,/data-sample="hours"/);
 assert.match(landingHTML,/data-sample="salon"/);
 assert.match(landingHTML,/data-sample="email" dir="ltr">sample@ayneh\.example/);
 assert.match(landingHTML,/data-sample="beforeafter"/);
 assert.match(landingHTML,/data-sample="bot"/);
 assert.equal((landingHTML.match(/نمونهٔ موقت/g)||[]).length>=5,true);
 assert.match(landingHTML,/نمونهٔ موقت/,'temporary product UI is labelled');
 // 4. New composite asset; the studio mirror keeps hero.webp for mask alignment.
 assert.match(landingHTML,/src="\/landing\/demo-style-before\.webp"/,'real before plate shipped');
 assert.match(landingHTML,/src="\/landing\/hero\.webp"/,'hair canvas base image unchanged');
 const buildScript=readFileSync(new URL('../design/landing/build.py',import.meta.url),'utf8');
 assert.match(buildScript,/DEMOS = \[/,'real before/after pairs are declared once');
 assert.match(buildScript,/asset in DEMOS or re\.match/,'pairs are synced to public/landing');
 assert.ok(readFileSync(new URL('../public/landing/demo-style-before.webp',import.meta.url)).length>20000,
  'synced real sample exists');
 assert.match(landingHTML,/window\.__AYN_ASSET_VERSION="[a-f0-9]{12}"/);
 // 5. One honesty line on every viewport, larger type, no duplicate FAQ wording.
 assert.equal((landingHTML.match(/تقریبی/g)||[]).length,1);
 assert.match(landingHTML,/<p class="hero-honesty">شبیه\u200cسازی تقریبی است/);
 assert.match(landingHTML,/\.hero-honesty\{[^}]*font-size:14px/);
 assert.match(landingHTML,/\.salon-invite-copy \.reassure li>span:last-child,\.salon-invite-copy \.reassure b\{font-size:15\.5px!important/);
 assert.doesNotMatch(landingHTML,/hero-honest-desktop|hero-teaser-note/,'duplicates gone');
 assert.match(landingHTML,/آینهٔ تعاملی این صفحه مخصوص مو است/,'hair-only interactive mirror disclosed');
 // 6. Form moved before services; page compacted; cue brought into the fold.
 assert.ok(landingHTML.indexOf('id="salon-example"')<landingHTML.indexOf('id="services"'),
  'form no longer sits after all service chapters');
 assert.match(landingHTML,/\.section\{padding-block:36px\}/);
 assert.match(landingHTML,/height:clamp\(210px,34svh,300px\)/,'mobile comparison sized for the fold');
 assert.match(landingHTML,/\.hero-scroll-cue\{[^}]*order:9;height:24px/);
 assert.match(landingHTML,/\.hero-details \.hero-honesty\{[^}]*order:initial!important/,'disclosures sit in the below-fold panel');
 // 7. Phone appears twice (visible text + tel href), sticky bar is one line again.
 assert.equal((landingHTML.match(/09105647497/g)||[]).length,2);
 assert.doesNotMatch(landingHTML,/sticky-cta-note/);
 assert.match(landingHTML,/\.sticky-cta:not\(\[hidden\]\)\{flex-direction:row/);
 assert.match(landingHTML,/class="sticky-cta" id="stickyCta" href="#start" hidden/);
 assert.equal((landingHTML.match(/href="#start"/g)||[]).length,1,'contextual jump still unique');
 // Scope guards: no invented proof, no removed sections/FAQ/form groups, no merge.
 assert.equal((landingHTML.match(/<details/g)||[]).length,11,'FAQ kept');
 assert.equal((landingHTML.match(/class="detail-group"/g)||[]).length,7,'7 optional groups kept');
 assert.equal((landingHTML.match(/class="wizard-step/g)||[]).length,2,'two-question wizard kept');
 assert.match(landingHTML,/alt="نمونهٔ موقت از عکس مشتری"/,'temporary customer photo is labelled');
 assert.match(landingHTML,/\.hero-details \.fineprint/,'14px below-fold body copy');
 assert.match(landingHTML,/\.salon-builder \.wizard-step label,[^}]*font-size:14px!important/,'14px form labels');
 assert.match(landingHTML,/\.foot-samples>div\{[^}]*border:1px solid/,'solid sample panels');
 assert.match(landingHTML,/آینهٔ تعاملی فعلاً مخصوص مو است/,'desktop hair-only mirror disclosed');
 assert.ok(landingHTML.length<250000);
});


test('funnel step 19: competitor-inspired first-glance clarity and one CTA hierarchy',()=>{
 // Nearest competitors all open with "what it is / why a salon would use it",
 // repeat ONE action and put the objections just before the final CTA.
 assert.match(landingHTML,/<p class="hero-sub">صفحه\u200cای به نام شما یا آرایشگاه\u200cتان، انتخاب مشتری را همراه عکس خودش، پیش از مراجعه نشان می\u200cدهد\./);
 assert.match(landingHTML,/خدمات قابل امتحان: مدل و رنگ مو، طرح ناخن یا مدل مژه، روی عکس خود مشتری\./);
 assert.match(landingHTML,/\.stage \.copy \.lead\{display:none!important\}/,'no duplicate lead on desktop');
 assert.equal((landingHTML.match(/چطور کار می\u200cکند/g)||[]).length,3,'nav label still appears three times');
 assert.match(landingHTML,/href="#how">چطور کار می\u200cکند/,'how it works jumps to the real section');
 assert.match(landingHTML,/href="#studio">دموی زنده/,'live demo keeps its own door');
 assert.match(landingHTML,/مشتری انتخاب می\u200cکند، شما همان را با عکس می\u200cبینید/);
 assert.match(landingHTML,/عکس مشتری کجا می\u200cرود؟/,'photo handling is no longer a gap');
 assert.match(landingHTML,/نسخهٔ فشردهٔ عکس/);
 assert.doesNotMatch(landingHTML,/رضایت مشتری/,'no consent jargon in the owner copy');
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.equal((landingHTML.match(/href="#start"/g)||[]).length,1,'one sticky jump to the form');
 assert.ok(landingHTML.indexOf('id="salon-example"')<landingHTML.indexOf('id="services"'),'form still before services');
 assert.ok(landingHTML.length<250000);
});


test('funnel step 20: self-audit closes the last first-glance and privacy objections',()=>{
 // Picky buyer: the H1 itself must name the product, not only the benefit.
 assert.match(landingHTML,/<h1 id="h1">انتخاب مشتری را با عکس ببینید<\/h1>/);
 assert.match(landingHTML,/مدل و رنگ مو، طرح ناخن یا مدل مژه، روی عکس خود مشتری\./);
 // UI/UX pro: the owner-preview privacy line must not contradict customer photo handling.
 assert.match(landingHTML,/عکس\u200cها و اطلاعات پیش\u200cنمایش تا پیش از درخواست فقط در مرورگر شماست/);
 assert.match(landingHTML,/پیش از ارسال درخواست، خود مشتری تأیید می\u200cکند/);
 assert.doesNotMatch(landingHTML,/اجازهٔ مشتری گرفته می\u200cشود/,'passive consent wording is gone');
 assert.doesNotMatch(landingHTML,/رضایت مشتری/);
 assert.doesNotMatch(landingHTML,/ناخن یا مژه/,'every service list names the nail design and lash model');
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true);
 assert.equal((landingHTML.match(/href="#start"/g)||[]).length,1);
 assert.ok(landingHTML.indexOf('id="salon-example"')<landingHTML.indexOf('id="services"'));
 assert.ok(landingHTML.length<250000);
});

test('funnel step 22: the first fold is the real before/simulation comparison, not a poster or a mock',()=>{
 // Deep rethink: two rejected heroes were *pictures* of the product (a mood
 // photo, then a mocked dashboard). The fold now IS the product: the real
 // before/simulation pairs shipped in the customer demo, with a live divider.
 const h1=(landingHTML.match(/<h1 id="h1">([\s\S]*?)<\/h1>/)||[])[1]||'';
 assert.equal(h1,'انتخاب مشتری را با عکس ببینید','short, one-line owner benefit');
 assert.ok(h1.length<40);
 assert.match(landingHTML,/<p class="hero-sub">صفحه\u200cای به نام شما یا آرایشگاه\u200cتان، انتخاب مشتری را همراه عکس خودش، پیش از مراجعه نشان می\u200cدهد\./);
 assert.equal((landingHTML.match(/<p class="hero-sub">/g)||[]).length,1,'one support sentence');
 const stage=(landingHTML.match(/<div class="stage"[\s\S]*?<div class="hero-details"/)||[])[0]||'';
 assert.ok(stage,'stage and below-fold panel both exist');
 assert.match(stage,/data-live="customer-simulation"/,'the live comparison is in the fold');
 assert.doesNotMatch(landingHTML,/data-mock=|proof-photo|proof-sent|همین انتخاب با عکس برای سالن فرستاده شد/,'no mocked dashboard state');
 assert.doesNotMatch(stage,/hero-teaser\.webp|hair-poster\.webp/,'no unrelated mood photo or stock poster');
 assert.match(landingHTML,/src="\/landing\/demo-style-before\.webp"/);
 assert.match(landingHTML,/src="\/landing\/demo-style-after\.webp"/);
 assert.equal((landingHTML.match(/data-pair="/g)||[]).length,4,'four real services are selectable');
 assert.match(landingHTML,/data-before="\/landing\/demo-color-before\.webp"/);
 assert.match(landingHTML,/data-after="\/landing\/demo-nails-after\.webp"/);
 assert.match(landingHTML,/before\.src=b\.dataset\.before/,'switching a service changes the real image');
 assert.match(landingHTML,/id="compareRange" type="range"/,'keyboard-operable divider');
 assert.match(landingHTML,/clip-path:inset\(0 calc\(100% - var\(--split,50%\)\) 0 0\)/,'live reveal, not a flattened screenshot');
 assert.match(landingHTML,/live-tag--before">قبل/);
 assert.match(landingHTML,/live-tag--after">شبیه\u200cسازی/);
 assert.match(landingHTML,/نمونهٔ موقت/,'real samples are labelled temporary');
 assert.match(landingHTML,/alt="نمونهٔ موقت از عکس مشتری"/);
 assert.doesNotMatch(stage,/class="fineprint"|class="hero-honesty"|class="service-note"/,'disclosures left the first fold');
 assert.match(landingHTML,/<div class="hero-details"/,'disclosures remain below the fold');
 assert.match(stage,/class="btn btn--lg" href="#salon-example"/,'one primary action');
 assert.match(stage,/class="btn btn--ghost btn--quiet" data-try="hair"/,'one quiet demo link');
 assert.match(landingHTML,/\.hero-proof\{[^}]*opacity:calc\(1 - var\(--p\)\*2\.4\)/,'comparison yields to the studio');
 assert.match(landingHTML,/\.studio\{[^}]*opacity:calc\(var\(--p\)\*2\.4\)/,'studio is the later demo layer');
 assert.match(landingHTML,/@media\(prefers-reduced-motion:reduce\)\{\.hero-scroll-cue svg\{animation:none\}\}/);
 assert.match(landingHTML,/window\.__AYN_HERO_READY=Promise\.resolve\(false\)/);
 assert.match(landingHTML,/if\(still\)return;/);
 assert.doesNotMatch(landingHTML,/رضایت مشتری|اجازهٔ مشتری گرفته می\u200cشود/,'no passive consent wording');
 assert.equal((landingHTML.match(/تقریبی/g)||[]).length,1,'one honesty line');
 // The header box is part of the first impression, not a hairline strip.
 assert.match(landingHTML,/\.site-header\{[^}]*--brand-fs:36px[^}]*--mark-w:56px/,'desktop brand lockup has real scale');
 assert.match(landingHTML,/\.site-header::before\{[^}]*border-radius:22px/,'header reads as a deliberate box');
 assert.match(landingHTML,/@media\(max-width:360px\)\{\.site-header\{[^}]*--mark-w:42px/,'small phones keep a full-size mark');
 assert.match(landingHTML,/\.site-header \.header-cta\{min-height:56px/,'desktop header action is enlarged too');
 assert.ok(landingHTML.length<250000);
});

test('funnel step 23: the buyer is the hairdresser, and the price panels ship as structure without invented figures',()=>{
 // Owner pivot: «می‌خوایم به آرایشگرها بفروشیم و پنل‌های قیمتی مون هم مشخص می‌کنیم».
 // The buyer sentence must name both a solo hairdresser and a salon/team.
 assert.match(landingHTML,/صفحه\u200cای به نام شما یا آرایشگاه\u200cتان/,'hero names the hairdresser, not only the salon owner');
 assert.match(landingHTML,/آرایشگر/,'the word hairdresser appears');
 assert.doesNotMatch(landingHTML,/برای سالن\u200cها/,'the old salon-only section label is gone');
 // The three panels are named for the solo hairdresser, the team and the chain.
 assert.match(landingHTML,/<h3>آرایشگر<\/h3>/);
 assert.match(landingHTML,/<h3>آرایشگاه<\/h3>/);
 assert.match(landingHTML,/<h3>مجموعه<\/h3>/);
 // Every panel promises what the code really does, and nothing more.
 assert.match(landingHTML,/لینک شخصی برای هر آرایشگر/);
 assert.match(landingHTML,/گزارش روزانهٔ درخواست\u200cها/);
 assert.match(landingHTML,/جابه\u200cجایی درخواست\u200cهای بی\u200cپاسخ/);
 // Figures are slots: the structure ships, a number only when the owner approves one.
 assert.equal((landingHTML.match(/data-price="/g)||[]).length,6,'amount + quota for three panels');
 assert.equal((landingHTML.match(/<b class="slot">/g)||[]).length,6);
 assert.match(landingHTML,/مبلغ و سهمیهٔ تصویر در حال نهایی\u200cشدن است و پیش از هر پرداختی نوشته می\u200cشود/,'the open figure is stated plainly');
 assert.equal((landingHTML.match(/تومان/g)||[]).length,3,'currency label only, once per amount slot');
 assert.doesNotMatch(landingHTML,/میلیون|[۰-۹0-9]\s*تومان/,'no number is invented before the owner decides');
 // The stale "we never name a price" stance must not come back.
 assert.doesNotMatch(landingHTML,/هزینه ثابت از قبل وجود ندارد|قیمت ثابت از قبل اعلام نمی\u200cشود|چرا عدد ثابت اعلام نمی\u200cشود؟/);
 // One canonical action label everywhere, including the customer demo's return bar.
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length>=6,true,'one canonical CTA label');
 assert.doesNotMatch(landingHTML,/ساخت پیش\u200cنمایش سالن من/,'old owner-only CTA label retired');
 assert.ok(customerHTML.includes('ساخت صفحهٔ من'),'demo return bar uses the same label');
 // Panels are reachable from the header and the FAQ, and the section is real markup.
 assert.match(landingHTML,/id="pricing"/);
 assert.match(landingHTML,/href="#pricing"/);
 assert.equal((landingHTML.match(/<section id="pricing"/g)||[]).length,1);
 // The panel grid collapses to one column on phones.
 assert.match(landingHTML,/@media\(max-width:860px\)\{\.plan-grid\{grid-template-columns:1fr;gap:12px\}/);
 assert.ok(landingHTML.length<250000,'payload stays under the review cap');
});
