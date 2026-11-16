import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';
import {phone,transferPrompt} from '../worker/domain.js';import {appHTML} from '../worker/ui.js';import {customerHTML,customerJS} from '../worker/customer.js';import {tryHTML} from '../worker/regularpage.js';import {landingHTML,servicePages} from '../worker/landing.js';
import {brandMark as generatedMark,favicon as faviconMark} from '../worker/brand.js';
const brand=()=>({brandMark:generatedMark,faviconMark});import {tick} from '../worker/server.js';import {styles} from '../worker/legacy.js';

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

test('custom salon colours keep white actions and dark labels readable',()=>{
 const body=customerHTML.match(/function applyBrand\(brand\)\{[\s\S]*?\n\}/)?.[0];
 assert.ok(body,'customer brand tint helper ships');
 const vars={},apply=new Function('document',body+';return applyBrand')({documentElement:{style:{setProperty:(k,v)=>vars[k]=v}}});
 const rgb=value=>value.match(/[0-9.]+/g).slice(0,3).map(Number);
 const luminance=value=>rgb(value).map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4}).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);
 const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 for(const color of ['#068F6C','#FFFF00','#FFFFFF','#FF00FF','#1267FF','#000000']){
  apply(color);
  assert.ok(ratio('rgb(255,255,255)',vars['--accent'])>=4.5,'white button text on '+color);
  assert.ok(ratio(vars['--accent-ink'],vars['--accent-soft'])>=4.5,'dark text on soft brand surface '+color);
 }
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
 {const fs=await import('node:fs');for(const f of ['favicon.ico','favicon-32.png','apple-touch-icon.png','icon-192.png','icon-512.png','site.webmanifest'])assert.ok(fs.existsSync(new URL('../public/'+f,import.meta.url)),'static icon '+f)}
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
 assert.match(tg.calls.filter(c=>c.method==='sendMessage'&&c.body.chat_id==='5150').at(-1).body.text,/نوبتت را هماهنگ کرد/);
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
 const r=await call(e,'/api/s/salon-a/owner/team/remove',{id:maryam.id,to:sara.id},OWNER);assert.equal(r.status,200);assert.equal(r.data.pending,true,'a member with customers is only asked');
 assert.equal((await visit(e,s,V(1),'')).mine,maryam.id,'nothing moves before she agrees');assert.equal(e.DB.sql.prepare('SELECT active FROM team WHERE id=?').get(maryam.id).active,1);
 const ask=sentTo(tg,4001).find(c=>c.body.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('tr:y:'));assert(ask,'Maryam gets the ask in her own chat');assert(!ask.body.text.includes('نگار'));
 await hook(e,{callback_query:{id:'ok',data:ask.body.reply_markup.inline_keyboard[0][0].callback_data,message:{chat:{id:4001},message_id:9}}});
 assert(sentTo(tg,4002).some(c=>c.body.text?.includes('نگار')));
 assert.equal((await visit(e,s,V(7),maryam.ref.split('r=')[1])).mine,sara.id,'old links now bring customers to Sara');
 assert.equal((await visit(e,s,V(1),'')).mine,sara.id);
 assert.equal((await call(e,'/api/s/salon-a/owner',undefined,OWNER)).data.team.length,1);
}finally{tg.restore()}});

test('transfer consent: only the member can approve, decline keeps everything, no customers means no ask, expiry closes it',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const maryam=await addMember(e,s,'مریم',4001),sara=await addMember(e,s,'سارا',4002),lone=await addMember(e,s,'لیلا',4003);
 await visit(e,s,V(1),maryam.ref.split('r=')[1]);
 const rm=()=>call(e,'/api/s/salon-a/owner/team/remove',{id:maryam.id,to:sara.id},OWNER);
 let r=await rm();assert.equal(r.data.pending,true);
 const tm=await call(e,'/api/s/salon-a/owner',undefined,OWNER);assert(tm.data.team.find(t=>t.id===maryam.id).transfer,'pending shows to the manager');
 const ask=sentTo(tg,4001).find(c=>c.body.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('tr:'));const [yes,no]=ask.body.reply_markup.inline_keyboard[0].map(b=>b.callback_data);
 // another member and the manager cannot approve for her
 await hook(e,{callback_query:{id:'x1',data:yes,message:{chat:{id:4002},message_id:1}}});
 await hook(e,{callback_query:{id:'x2',data:yes,message:{chat:{id:777},message_id:1}}});
 assert.equal(e.DB.sql.prepare('SELECT status FROM staff_transfer_requests').get().status,'pending');assert.equal((await visit(e,s,V(1),'')).mine,maryam.id);
 // she declines
 await hook(e,{callback_query:{id:'x3',data:no,message:{chat:{id:4001},message_id:1}}});
 assert.equal(e.DB.sql.prepare('SELECT status FROM staff_transfer_requests').get().status,'declined');assert.equal((await visit(e,s,V(1),'')).mine,maryam.id);assert.equal(e.DB.sql.prepare('SELECT active FROM team WHERE id=?').get(maryam.id).active,1);
 assert(sentTo(tg,777).some(c=>/موافقت نکرد/.test(c.body.text||'')),'manager hears the decline');
 // a decided request cannot be replayed
 await hook(e,{callback_query:{id:'x4',data:yes,message:{chat:{id:4001},message_id:1}}});assert.equal((await visit(e,s,V(1),'')).mine,maryam.id);
 // asked again, then it expires with no answer
 r=await rm();assert.equal(r.data.pending,true);
 await tick(e,origin);assert.equal(e.DB.sql.prepare("SELECT status FROM staff_transfer_requests WHERE status='pending'").all().length,1);
 e.DB.sql.exec('UPDATE staff_transfer_requests SET expires_at=1 WHERE status=\'pending\'');await tick(e,origin);
 assert.equal(e.DB.sql.prepare("SELECT status FROM staff_transfer_requests ORDER BY created_at DESC").get().status,'expired');assert.equal((await visit(e,s,V(1),'')).mine,maryam.id);
 assert(sentTo(tg,777).some(c=>/مهلت درخواست انتقال/.test(c.body.text||'')));
 // a member without any customers leaves at once, no ask
 r=await call(e,'/api/s/salon-a/owner/team/remove',{id:lone.id,to:null},OWNER);assert.equal(r.data.pending,false);assert.equal(e.DB.sql.prepare('SELECT active FROM team WHERE id=?').get(lone.id).active,0);
 // manager cancels a pending ask
 await rm();r=await call(e,'/api/s/salon-a/owner/team/remove/cancel',{id:maryam.id},OWNER);assert.equal(r.data.cancelled,true);
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM staff_transfer_requests WHERE status='pending'").get().n,0);
}finally{tg.restore()}});

test('transfer consent through the bot: the manager button asks, an unlinked member is asked when she links, the ask carries no customer data',async()=>{const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const maryam=await addMember(e,s,'مریم',null),sara=await addMember(e,s,'سارا',4002);
 await visit(e,s,V(1),maryam.ref.split('r=')[1]);
 await hook(e,{callback_query:{id:'m',data:'tm:x:'+maryam.id+':'+sara.id,message:{chat:{id:777},message_id:3}}});
 assert.equal(e.DB.sql.prepare('SELECT active FROM team WHERE id=?').get(maryam.id).active,1,'not removed by the manager alone');
 assert(tg.calls.some(c=>c.method==='editMessageText'&&/هنوز ربات را وصل نکرده/.test(c.body.text)));
 assert.equal(e.DB.sql.prepare('SELECT notified FROM staff_transfer_requests').get().notified,0);
 await hook(e,{message:{chat:{id:4001,type:'private'},text:'/start '+maryam.code}});await tick(e,origin);
 const ask=sentTo(tg,4001).find(c=>c.body.reply_markup?.inline_keyboard?.[0]?.[0]?.callback_data?.startsWith('tr:y:'));assert(ask,'asked after linking');assert.equal(e.DB.sql.prepare('SELECT notified FROM staff_transfer_requests').get().notified,1);
 assert(!/09\d{9}/.test(ask.body.text));
}finally{tg.restore()}});

test('result sharing: three actions, approximate note, friend share with the same link, Ayneh mark on the saved image, privacy text is the true one',()=>{
 for(const x of ['درخواست نوبت می‌دهم','از دوستم نظر بپرسم','ذخیره تصویر','یک نمونه است؛ برای انتخاب قبل از نوبت.','کدوم مدل بیشتر بهم میاد؟','function openAsk','fillText(\'آینه\''])assert(customerJS.includes(x),x);
 assert(customerJS.includes('openAsk')&&/var url=shareUrl\(\),both=ASK_TEXT/.test(customerJS),'the friend link is the visitor tag link of this salon');
 const PRIV='عکس شما فقط برای ساخت نمونه و دیدنِ سالن استفاده می‌شود؛ نسخهٔ فشردهٔ آن برای ساخت تصویر به سرویس تصویر ارسال می‌شود.';
 assert(customerJS.includes(PRIV)&&customerHTML.includes(PRIV),'one agreed privacy sentence');
 assert(!customerJS.includes('عکس فقط برای همین سالن استفاده می‌شود')&&!customerHTML.includes('عکس‌ها فقط برای همین سالن'),'the old inaccurate sentence is gone');
 assert(!/عکس‌ها خصوصی‌اند و برای کسی/.test(customerJS));
});

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
 assert.match(html,/id="choose"/);assert.match(html,/<title>آینه \| مشتری مدل را روی عکس خودش می‌بیند<\/title>/);assert.doesNotMatch(html,/noindex/);
 new Function(html.match(/<script>([\s\S]*?)<\/script>/g).map(s=>s.replace(/<\/?script>/g,'')).join('\n'));
 // one page per service, each with its own studio, plans and checkout, and scripts that parse
 for(const key of ['hair','color','nails','lashes']){
  for(const path of ['/'+key,'/'+key+'/']){const s=await app.fetch(new Request(origin+path),e);assert.equal(s.status,200,path)}
  const page=await (await app.fetch(new Request(origin+'/'+key),e)).text();
  assert.match(page,/id="builderLive"/,key+' carries the page builder');assert.match(page,/id="services"/);assert.match(page,/id="payForm"/);
  assert.match(page,new RegExp('<body data-service="'+key+'">'),key+' tells the checkout its service');
  new Function(page.match(/<script>([\s\S]*?)<\/script>/g).map(s=>s.replace(/<\/?script>/g,'')).join('\n'));
 }
 // the salon-panel page and the demo page are real routes too, on the same headers
 for(const [path,marker] of [['/salon-panel','data-service="salon"'],['/sample','ساخت نمونه']]){
  const r2=await app.fetch(new Request(origin+path),e);assert.equal(r2.status,200,path);assert.ok((await r2.text()).includes(marker),path+' serves its own page');
 }
 assert.equal((await app.fetch(new Request(origin+'/hairs'),e)).status,404,'only the listed page paths exist');
 assert.equal((await app.fetch(new Request(origin+'/admin'),e)).status,200);});

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

test('landing carries an absolute share image and revalidates instead of going stale',async()=>{const e=fixture();const r=await app.fetch(new Request(origin+'/'),e);const html=await r.text();
 // Cacheable was the reason the owner kept seeing an old build: max-age=300 plus an hour of
 // stale-while-revalidate meant a reload could serve a page from an hour ago.
 assert.match(r.headers.get('cache-control'),/no-cache/);
 assert.doesNotMatch(r.headers.get('cache-control'),/stale-while-revalidate/);
 // And the served page names its build, so "is this the new one?" has an answer that does
 // not need devtools. The stamp is a meta tag because the minifier strips comments.
 assert.match(html,/<meta name="ayneh-build" content="[a-f0-9]{12}">/,'the page names its build');
 assert.match(html,new RegExp('og:image" content="'+origin+'/landing/og.jpg"'));assert.doesNotMatch(html,/__ORIGIN__/);assert.ok(readFileSync(new URL('../public/landing/og.jpg',import.meta.url)).length>10000)});

test('demo salon behind the landing: no sign-up, 1 image per visitor, a coarse network cap, no 360 view, look handed over by the landing',async()=>{
 const e=tgEnv(fixture());e.KIE_API_KEY='mock';const s={slug:'demo'};
 // Even with SMS configured, the visitor demo asks for no mobile (owner's decision).
 smsEnv(e);
 const pub=await call(e,'/api/s/demo/public');assert.equal(pub.status,200);assert.equal(pub.data.demo,true);
 assert.equal(pub.data.generation,true,'the demo makes images without a sign-up');assert.equal(pub.data.otp,false,'no code in front of the demo');
 const ip={'cf-connecting-ip':'198.51.100.7'},v='ab'.repeat(16);
 let g=await guest(e,s);const original=await upload(e,s,g);
 const gen=(extra={},who=g,img=original)=>call(e,'/api/s/demo/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:img,style:1,v,...extra},{...who,headers:ip});
 const net=globalThis.fetch,prompts=[];
 globalThis.fetch=async(url,opts)=>{const u=String(url);if(u.includes('createTask'))prompts.push(JSON.parse(opts.body).input.prompt);if(u.includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(u.includes('createTask'))return Response.json({code:200,data:{taskId:'t'+crypto.randomUUID()}});return net(url,opts)};
 try{
  const first=await gen({apply_color:true,color:'شرابی'});assert.equal(first.status,200,JSON.stringify(first));assert.match(prompts[0],/burgundy/i);
  const second=await gen();assert.equal(second.status,429,'one free try per visitor');assert.match(second.data.error,/ثبت‌نام کنید و حسابتان را شارژ کنید/);
  // A new session in the same browser is the same visitor.
  const g2=await guest(e,s),img2=await upload(e,s,g2);
  assert.equal((await gen({},g2,img2)).status,429,'same browser id, same one image');
  // A failed image does not count.
  e.DB.sql.prepare("UPDATE generations SET state='fail' WHERE id=?").run(first.data.id);
  assert.equal((await gen()).status,200,'the failed image gave its turn back');
  {const gc=await guest(e,s),ic=await upload(e,s,gc),n=prompts.length;
   const r=await call(e,'/api/s/demo/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:ic,custom:'مدل موی پیکسی کوتاه با چتری',v:'cf'.repeat(16)},{...gc,headers:{'cf-connecting-ip':'198.51.100.99'}});
   assert.equal(r.status,200,'a look she typed herself is made');assert.ok(prompts[n]&&prompts[n].includes('مدل موی پیکسی کوتاه با چتری'),'her own words reach the prompt')}
  const pubd=await call(e,'/api/s/demo/public');assert.equal(pubd.data.salon.name,'سالن آینه');assert.equal(pubd.data.salon.profile.cover_url,'/landing/salon-cover.webp');
  const views=await call(e,'/api/s/demo/views',{idem:crypto.randomUUID(),parent:'x'},g);assert.equal(views.status,400,'no 360 view in the demo');
  // Fresh browsers on one network: the hashed-IP counter stops them after DEMO_IP_DAILY images.
  const {DEMO_IP_DAILY}=await import('../worker/demo.js');let stopped=null;
  for(let i=0;i<DEMO_IP_DAILY+2&&!stopped;i++){const gi=await guest(e,s),im=await upload(e,s,gi);const r=await call(e,'/api/s/demo/generate',{image_consent:true,idem:crypto.randomUUID(),original_id:im,style:1,v:crypto.randomUUID().replace(/-/g,'')},{...gi,headers:ip});if(r.status===429)stopped=r}
  assert.ok(stopped,'the network counter stops a run of fresh visitors');assert.match(stopped.data.error,/از این شبکه/);
  assert.equal(e.DB.sql.prepare("SELECT COUNT(*) n FROM limits").get().n>0,true);
  assert.equal(e.DB.sql.prepare("SELECT COUNT(*) n FROM limits WHERE key LIKE '%198.51%'").get().n,0,'the address is stored only as a hash');
 }finally{globalThis.fetch=net}
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
 // Photo and look in → «بساز» comes into view and takes the focus, on every line. No service
 // stops at the optional shape, length or colour rows on the way there.
 assert.match(js,/function chooseLook\(fn\)\{pickLook\(fn\);scrollToBuild\(\)\}/,'picking a look goes straight to the build button');
 // buildButton() looks in the flow and in the dock, so the phone's «بساز» is found too.
 assert.match(js,/function buildButton\(\)\{[\s\S]*?return inFlow\|\|inDock;\n\}/,'one place knows which button builds');
 assert.match(js,/inFlow=f\?f\.querySelector\('\.btn--build'\):null/,'the flow carries the hook');
 assert.match(js,/inDock=d&&!d\.hidden\?d\.querySelector\('\.btn--build'\):null/,'and so does the dock');
 assert.match(js,/class:'btn btn--primary btn--build',type:'button',disabled:!ready,onclick:build/,'the dock «بساز» is the same button');
 const stb=js.match(/function scrollToBuild\(\)\{[\s\S]*?\n\}/)[0];
 assert.match(stb,/if\(btn&&hasChoice\(\)\)\{[\s\S]*?window\.scrollTo[\s\S]*?btn\.focus\(\{preventScroll:true\}\)\}[\s\S]*?return;\n  \}/,'the build button is scrolled to and focused as soon as both are in');
 assert.ok(stb.indexOf('if(btn&&hasChoice())')<stb.indexOf('if(opt)'),'the optional rows never come before «بساز»');
 assert.match(stb,/reduce=window\.matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches,beh=reduce\?'auto':'smooth'/,'no smooth scroll when she asked for none');
 assert.match(js,/setTimeout\(scrollToBuild,60\)/,'uploading her own model photo does the same');
 // She changed her photo with a look already chosen: the auto-advance lands on «بساز» too.
 assert.match(js,/go\(2,true\);scrollToBuild\(\)\}\},1600\)\}/,'a re-upload with a look already chosen lands on «بساز»');
 // Nothing builds by itself: build() only ever runs from her tap on «بساز» (or the dock).
 assert.ok(!/scrollToBuild[\s\S]{0,200}build\(\)/.test(js),'coming into view never starts the build');
 // The four services are four LINE tabs of ONE page, so «بساز» behaves identically on every
 // one of them — there is no per-service copy of the flow that could drift. The table is
 // inlined at build time, so read it back out of the served page.
 {
  const at=js.indexOf('var LINES=');assert.ok(at>0,'one table drives every line');
  let i=js.indexOf('{',at),depth=0,end=i;
  for(;i<js.length;i++){const c=js[i];if(c==='{')depth++;else if(c==='}'){depth--;if(!depth){end=i;break}}}
  const lines=JSON.parse(js.slice(js.indexOf('{',at),end+1));
  for(const [k,w] of [['hair','مدل مو'],['color','رنگ مو'],['nails','ناخن'],['lashes','مژه']]){
   assert.equal(lines.label[k],w,'the '+k+' line is served by the same page');
   assert.ok(lines.photo[k]&&lines.photo[k].drop,k+' has its own upload step');
  }
  // every line tab on the page comes out of that table, through one switch
  assert.match(js,/function switchLine\(to,opts\)\{/,'one place switches line');
  assert.match(js,/class:'linesw__btn'\+\(on\?' is-on':''\)/,'the tab is built per line');
  assert.match(js,/'data-line':x\[0\][\s\S]{0,80}switchLine\(x\[0\]\)/,'the tab hands its key to the one switch');
  // the two cross-line shortcuts («رفتن به مدل مو» and «رنگ را روی همین مدل امتحان کن») use it too
  assert.match(js,/switchLine\('hair',\{scroll:true\}\)/,'the colour hint switches line through it');
  assert.match(js,/switchLine\('color',\{step:2,onHair:true,scroll:true\}\)/,'and so does the hair step');
 }
 // The page that /s/<slug> and /salon-preview serve carries the hook twice: once in the flow,
 // once in the phone dock. Served, not just written.
 const tryOn=customerHTML,tryPage=tryHTML('try');
 assert.ok((tryOn.match(/btn--build/g)||[]).length>=2,'the try-on ships «بساز» in the flow AND in the dock');
 assert.match(tryOn,/id="flow"/,'the flow is where a look is chosen');
 assert.match(tryOn,/id="dock"/,'the phone dock carries the same button');
 // /try is the same engine in a frame, so she cannot get a different behaviour there.
 assert.match(tryPage,/src="\/s\/[a-z0-9-]+\?embed=1"/,'/try embeds the salon try-on rather than repeating it');
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

// ---------- Step 24: the reference rebuild ----------
// These guards replace the espresso/brass funnel audit. They lock the visual
// system taken from the six reference sheets (cream/emerald, the teal face mark,
// the section order 1 hero → 2 امکانات → 3 نحوهٔ کار → 4 مزایا → 5 نظرات →
// 6 تعرفه → 7 فراخوان → FAQ → footer) and the honesty rules that still apply.

test('copy plan: the home page opens with one hero, the approved headline, one main button and the 8-second loop',()=>{
 assert.equal((landingHTML.match(/<h1[\s>]/g)||[]).length,1,'exactly one h1');
 assert.match(landingHTML,/«این مدل بهم می‌اد؟» را<span class="h1__accent">دیگر حدسی جواب ندهید\.<\/span>/,'the headline states the real promise');
 assert.ok(landingHTML.includes('مشتری مدل مو، رنگ، ناخن و مژه را روی عکس خودش می‌بیند و با خیال راحت نوبت می‌گیرد.'),'the approved subtitle');
 const hero=(landingHTML.match(/<section id="intro"[\s\S]*?<\/section>/)||[])[0]||'';
 assert.equal((hero.match(/class="btn btn--lg"/g)||[]).length,1,'one main button in the hero');
 assert.match(hero,/class="btn btn--lg" href="#demo">روی عکس خودم امتحان کنم</,'it opens the live demo');
 assert.match(hero,/class="hero-link" href="#services">قیمت پلن‌ها/,'the price link is a text link');
 assert.doesNotMatch(hero,/ساخت صفحهٔ من|خرید پلن/,'no second sales button in the hero');
 assert.equal((hero.match(/<figure class="loop__f /g)||[]).length,8,'every service gets a before and an after frame');assert.ok(hero.includes('loop--svc'),'the loop covers every service');
 for(const f of ['مدل مو: عکس مشتری','مدل مو: نتیجهٔ نمایشی','رنگ مو: عکس مشتری','رنگ مو: نتیجهٔ نمایشی','مژه: عکس مشتری','مژه: نتیجهٔ نمایشی','ناخن: عکس مشتری','ناخن: نتیجهٔ نمایشی'])assert.ok(hero.includes(f),'frame '+f);
 assert.ok(hero.includes('نمونهٔ نمایشی'),'the loop is labelled a sample');
 assert.match(landingHTML,/\.loop__f\{[^}]*animation:loopFrame 8s linear infinite/,'a self-running 8-second loop, no scroll and no sound');
 assert.doesNotMatch(hero,/<video|<audio/,'no sound');
 assert.doesNotMatch(landingHTML,/id="heroCompare"|class="hero-thumb"|class="hero-benefits__icon"/,'the old hero mirror and benefit cards are gone');
});
test('copy plan: header has the logo, three links, one fixed «نمونه بساز» and a small «ورود»',()=>{
 const headerOf=html=>(html.match(/<header class="site-header">[\s\S]*?<\/header>/)||[])[0]||'';
 const header=headerOf(landingHTML);
 assert.ok(header,'header exists');
 assert.match(header,/class="brand__mark"/);assert.match(header,/class="brand__word">آینه</);
 const nav=(header.match(/<nav class="nav"[\s\S]*?<\/nav>/)||[])[0];
 assert.equal((nav.match(/<a /g)||[]).length,3,'three menu items');
 for(const item of ['#choose">خدمات','#services">تعرفه‌ها','#faq">سؤالات'])assert.ok(nav.includes(item),'home nav '+item);
 const actions=(header.match(/<div class="header-cta">[\s\S]*?<\/div>/)||[])[0]||'';
 assert.match(actions,/class="btn--login"[\s\S]*?<span>ورود<\/span>/,'a small login for current members');
 assert.match(actions,/class="btn" href="#demo">نمونه بساز</,'the fixed button builds a sample');
 for(const k of ['hair','color','nails','lashes','salon','sample']){
  const h=headerOf(servicePages[k]);
  assert.match(h,/class="btn" href="#demo">نمونه بساز</,k+' header button');
  assert.ok(h.includes('href="/#choose">خدمات')&&h.includes('href="/#faq">سؤالات')&&h.includes(k==='sample'?'href="/#services">تعرفه‌ها':'href="#services">تعرفه‌ها'),k+' links home for what it does not carry');
 }
 assert.match(header,/class="menu-toggle"/,'mobile menu hook');
 assert.match(landingHTML,/@media\(max-width:1120px\)\{[\s\S]{0,120}\.nav\{display:none\}/,'nav collapses before it can crowd the bar');
 assert.match(landingHTML,/@media\(max-width:640px\)\{\.btn--login\{display:none\}\}/,'on a phone the bar is logo, «نمونه بساز» and the menu');
});
test('copy plan: home sections come in the approved order and every page has one h1',()=>{
 const ids=html=>[...html.matchAll(/<main id="main">[\s\S]*?<\/main>/g)][0][0].match(/<section id="[\w-]+"/g).map(s=>s.slice(13,-1));
 assert.deepEqual(ids(landingHTML),['intro','demo','how','salon-example','get','choose','why','services','pay','faq','cta'],'home');
 assert.deepEqual(ids(servicePages.hair),['intro','play','demo','sample','benefits','salon-example','services','pay','cta'],'hairstyle page (with the sample-face mirror)');
 for(const k of ['color','nails','lashes'])assert.deepEqual(ids(servicePages[k]),['intro','demo','sample','benefits','salon-example','services','pay','cta'],k+' page: one template with its illustrative sample');
 assert.deepEqual(ids(servicePages.salon),['intro','glance','team','demo','salon-example','bundle','services','pay','cta'],'salon panel page');
 assert.deepEqual(ids(servicePages.sample),['intro','demo'],'the demo page');
 for(const html of [landingHTML,...Object.values(servicePages)])assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,'one h1');
 for(const title of ['خودتان <em>امتحان کنید.</em>','راه‌اندازی در <em>۳ گام</em>','دیگر «یک عکس بفرست ببینم» <em>نمی‌خواهد.</em>',
  'خدمت شما <em>کدام است؟</em>','قبل از خرید بدانید','سؤال‌های <em>پرتکرار</em>','اولین نمونه را همین الان روی عکس خودتان بسازید.'])
  assert.ok(landingHTML.includes(title),'home title '+title);
 assert.ok(landingHTML.includes('عکس، مدل و شمارهٔ مشتری یک‌جا می‌رسد.')&&landingHTML.includes('وضعیت را با یک لمس ثبت کنید؛ مشتری هم همان را می‌بیند.'));
 // the services section is the sample work and the door in one: four cards, four prices pages
 assert.equal((landingHTML.match(/class="sample-card"/g)||[]).length,4,'four service cards');
 for(const [line,href] of [['مدل را قبل از کوتاهی می‌بیند.','/hair'],['رنگ را قبل از رنگ کردن می‌بیند.','/color'],['طرح را روی دست خودش می‌بیند.','/nails'],['حجم مژه را روی چشم خودش می‌بیند.','/lashes']])
  assert.ok(landingHTML.includes(line)&&landingHTML.includes('<a class="btn" href="'+href+'">امتحان و قیمت</a>'),'card '+line);
 assert.equal((landingHTML.match(/class="why__icon"/g)||[]).length,3,'three trust cards');
 assert.equal((landingHTML.match(/class="setup__step"/g)||[]).length,3,'three setup steps');
 assert.ok(landingHTML.includes('اسم سالن را بنویسید')&&landingHTML.includes('خدمت خودتان را انتخاب کنید')&&landingHTML.includes('لینک را در بیو بگذارید')&&landingHTML.includes('بدون نصب اپ، روی گوشی.'));
 assert.doesNotMatch(landingHTML,/۱۹ مدل|۷ رنگ/,'the model and colour counts are gone');
 for(const html of Object.values(servicePages))assert.doesNotMatch(html,/۱۹ مدل|۷ رنگ/,'no model or colour count on a service page');
});
test('copy plan: the four service pages share one template with their own lines, no invented sample',()=>{
 for(const [k,h1,lead,benefit] of [
  ['hair','مشتری می‌پرسد «این مدل به من می‌آید؟»','آینه جواب را روی عکس خودش نشان می‌دهد.','مشتری قبل از آمدن مدل را روی عکس خودش می‌بیند.'],
  ['color','مشتری می‌گوید «این نبود که فکر می‌کردم.»','آینه رنگ را قبل از شروع، روی عکس خودش نشان می‌دهد.','رنگ را قبل از شروع روی عکس خودش می‌بیند.'],
  ['nails','مشتری عکس طرحی را از اینستاگرام نشانتان می‌دهد، ولی مطمئن نیست به دستش بیاید.','آینه طرح را روی دست خودش نشان می‌دهد.','طرح را روی دست خودش می‌بیند.'],
  ['lashes','مشتری از حجم و فرم مژه می‌ترسد.','آینه حالت را قبل از نوبت نشان می‌دهد.','حالت مژه را قبل از نوبت می‌بیند.']]){
  const html=servicePages[k];
  assert.ok(html.includes('<h1 id="h1" class="h1">'+h1),k+' hero line');assert.ok(html.includes(lead),k+' solution line');assert.ok(html.includes(benefit),k+' benefit');
  assert.equal((html.match(/<ul class="benefits__list">[\s\S]*?<\/ul>/)[0].match(/<li>/g)||[]).length,3,k+': three benefits');
  assert.ok(html.includes('نمونهٔ نمایشی؛ برای انتخاب قبل از نوبت.'),k+' near-image note');
  assert.match(html,/id="sample"/,k+': illustrative before/after');assert.ok(html.includes('نمونهٔ نمایشی'),k+': labelled illustrative');assert.doesNotMatch(html,/نمونهٔ ساخته‌شده با آینه/,k+': never claimed as made by Ayneh');
  assert.equal((html.match(/data-line="/g)||[]).length,1,k+' demo offers its own service only');
  assert.ok(html.includes('data-line="'+({hair:'hair',color:'color',nails:'nails',lashes:'lashes'})[k]+'"'));
  assert.doesNotMatch(html,/id="faq"|id="choose"|id="why"/,k+' does not repeat the home page');
 }
 assert.match(servicePages.hair,/id="trySwitch"/,'the sample-face mirror stays on the hairstyle page');
 for(const k of ['color','nails','lashes'])assert.doesNotMatch(servicePages[k],/id="trySwitch"|id="play"/,k+' has no mirror tabs');
});
test('copy plan: salon-panel page and the demo page',()=>{
 const salon=servicePages.salon;
 assert.ok(salon.includes('هر همکار، مشتری‌های خودش؛ همه روی یک تصویر.'),'pain of the salon owner');
 assert.equal((salon.match(/class="glance__card"/g)||[]).length,4,'four services at a glance');
 assert.equal((salon.match(/<article class="why">/g)||[]).length,3,'teamwork in three cards');
 assert.ok(salon.includes('لینک اختصاصی')&&salon.includes('درخواست‌ها فقط پیش خودش می‌رسد.'));
 assert.ok(salon.includes('سه پلن جدا یا <em>یک پنل آرایشگاه؟</em>')&&salon.includes('همه در سالن، روی یک تصویر با مشتری هماهنگ می‌شوند.'));
 assert.doesNotMatch(salon,/class="pbar"|class="pcompare" id="compare"/,'the single-service bar and table are not on the salon page');
 const demo=servicePages.sample;
 for(const step of ['خدمت را انتخاب کنید.','عکس روبه‌رو و روشن بگذارید.','مدل و نتیجه را ببینید.'])assert.ok(demo.includes(step),'step '+step);
 assert.equal((demo.match(/data-line="/g)||[]).length,4,'the demo page offers all four services');
 assert.ok(demo.includes('عکس شما فقط برای ساخت نمونه و دیدنِ سالن استفاده می‌شود.'),'the short privacy line near the upload');
 assert.doesNotMatch(demo,/فقط برای ساخت همین نمونه/);
});
test('copy plan: hard claims that are not built never appear on any page',()=>{
 for(const html of [landingHTML,...Object.values(servicePages)]){
  const text=html.replace(/<script>[\s\S]*?<\/script>|<style>[\s\S]*?<\/style>/g,'');
  assert.doesNotMatch(text,/جابه‌جایی|جابجایی|استوری|کمتر از یک دقیقه|پنل جدا برای هر همکار|پنل اختصاصی هر همکار|گزارش روزانه/,'no transfer, story template, one-minute or per-colleague panel claim');
  assert.doesNotMatch(text,/پلن بالاتر|پلن‌های بالاتر|مخصوص پلن/,'the bot is not presented as a higher-plan feature');
  assert.doesNotMatch(text,/عکس[^.<]*فقط در مرورگر|بدون ارسال به سرور/,'the customer photo is not said to stay in the browser');
  assert.doesNotMatch(text,/نظر مشتریان|⭐|[0-9۰-۹]+\s*(?:هزار\s*)?مشتری راضی/,'no testimonial or satisfaction counter');
 }
 assert.ok(landingHTML.includes('عکس فقط برای ساخت نمونه و دیدن سالن شما استفاده می‌شود.'),'the true privacy sentence');
 assert.ok(landingHTML.includes('عکس فقط برای ساخت نمونه و دیدن سالن شما استفاده می‌شود؛ نسخهٔ فشردهٔ آن برای ساخت تصویر به سرویس تصویر ارسال می‌شود.'),'the image service is named honestly, in the one long sentence');
 assert.ok(landingHTML.includes('بدون نصب، روی گوشی.'));
});
test('honesty: no fake proof, no promises the product does not keep, plan is never called panel',()=>{
 // The owner's standing rule: no invented clients, quotes, ratings or totals. Placeholder
 // testimonials and sample counters read as fake, so the section is gone until real ones exist.
 for(const html of [landingHTML,...Object.values(servicePages)]){
  assert.doesNotMatch(html,/class="quote"|class="proof-stat"|\+۱۲٬۰۰۰|هزاران مدیر سالن/,'no placeholder proof');
  assert.doesNotMatch(html,/نوبت‌دهی آنلاین ۲۴ ساعته|رزرو و نوبت‌دهی آنلاین|پلتفرم مدیریت سالن|بدون نوبت‌های خالی|گزارش روزانه/,'no self-booking or daily-report promise');
  assert.doesNotMatch(html,/خرید پنل|پنل‌ها و خرید|دیدن پنل‌ها|پنل خودتان را بخرید|مشاوره تخصصی <br>و رایگان/,'what you buy is a plan (پلن), the panel is where you log in');
 }
});
test('copy plan: the FAQ is six short answers in the order they block a purchase, and the footer is plain',()=>{
 const faq=(landingHTML.match(/<section id="faq"[\s\S]*?<\/section>/)||[])[0]||'';
 const qs=[...faq.matchAll(/<summary>([^<]*)<\/summary>\s*<div class="faq-item__body">([\s\S]*?)<\/div>/g)];
 assert.equal(qs.length,6,'six questions');
 assert.deepEqual(qs.map(m=>m[1]),['عکس مشتری کجا می‌رود؟','نتیجه دقیق است؟','مشتری‌ها چیزی نصب کنند؟','آرایشگاه چند نفره‌ام. چه کنم؟','پرداخت و تمدید چطور است؟','اگر عکس‌ها تمام شد؟']);
 for(const [,q,a] of qs)assert.ok((a.replace(/<[^>]*>/g,'').match(/[.؛]/g)||[]).length<=3,'short answer: '+q);
 assert.match(faq,/بستهٔ ۱۰ تایی جدا می‌خرید\. قیمت فعلی هر بسته ۲۰۰ هزار تومان است\./,'the top-up price comes from the price table');
 assert.match(faq,/href="\/salon-panel">پنل آرایشگاه/,'the salon answer links to the salon page');
 const foot=(landingHTML.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)||[])[0]||'';
 assert.ok(foot,'footer exists');
 for(const link of ['href="/hair">مدل مو','href="/color">رنگ مو','href="/nails">ناخن','href="/lashes">مژه','href="/salon-panel">پنل آرایشگاه','href="#services">تعرفه‌ها','href="/sample">ساخت نمونه'])assert.ok(foot.includes(link),'footer link '+link);
 assert.match(foot,/مو، رنگ، ناخن و مژه،<br>روی عکس خودِ مشتری\./,'one line of introduction');
 assert.match(foot,/0993 377 3515/,'the one public support number');
 assert.doesNotMatch(foot,/mailto:|@gmail\.com|ble\.ir/,'no email or Bale contact');
 assert.match(foot,/t\.me\/\+989933773515/,'Telegram contact');assert.match(foot,/wa\.me\/989933773515/,'WhatsApp contact');
 assert.match(foot,/<p>یک نمونه است؛ برای انتخاب قبل از نوبت.<\/p>/);
 assert.match(foot,/© ۱۴۰۵ آینه/);
 assert.equal((foot.match(/class="brand__mark"/g)||[]).length,1,'the teal mark returns in the footer');
});
test('step 24 brand: the owner\'s mirror logo is the one mark everywhere',()=>{
 const {brandMark,faviconMark}=brand();
 const svg=readFileSync(new URL('../design/landing/assets/ayneh-mark.svg',import.meta.url),'utf8');
 assert.match(svg,/viewBox="0 0 76 112"/,'the arched mirror keeps its upright shape');
 assert.match(svg,/data:image\/webp;base64,/,'the cleaned logo (transparent outside the mirror) is embedded');
 assert.equal(brandMark,svg,'the generated mark is the logo file');
 assert.equal((landingHTML.match(/viewBox="0 0 76 112"/g)||[]).length,2,'header and footer');
 for(const slot of ['brand__mark','foot-brand'])assert.ok(landingHTML.includes(slot),slot+' slot exists');
 assert.ok(faviconMark.length>100,'favicon is generated from the logo');
});

test('step 24 palette: cream ground, ink type, a single emerald accent',()=>{
 assert.match(landingHTML,/--cream:#FCF3EB/);
 assert.match(landingHTML,/--ink:#0A202A/);
 assert.match(landingHTML,/--emerald:#068F6C/);
 assert.match(landingHTML,/--emerald-deep:#0A6B54/);
 assert.match(landingHTML,/--emerald-soft:#9BD9C5/);
 assert.match(landingHTML,/--font:"Estedad","Vazirmatn"/,'the app font stack is shared');
 const siteCSS=readFileSync(new URL('../design/landing/src/site.css',import.meta.url),'utf8');
 // Every icon tile is the same clay: a radial highlight over an emerald body, an inset
 // rim light and an inset shade for the bevel, an emerald drop shadow, a specular
 // ellipse and a white embossed glyph.
 const CLAY=/:is\(\.why__icon,\.setup__icon,\.step__icon,\.svc__icon,\.proof-stat__icon,\.hero-benefits__icon,\s*\.film-tab__icon,\.tryon__line-ico,\.tryon__curtain-ico,\.pay-done__tick,\.compare__knob,\s*\.foot-social a\)/;
 assert.match(siteCSS,CLAY,'one recipe lists every icon tile');
 assert.match(siteCSS,/:is\(\.why__icon[\s\S]*?\)(\s*\{)[\s\S]*?box-shadow:\s*inset 2px 2px 3px var\(--clay-hi\),\s*inset -2px -3px 5px var\(--clay-shade\),[\s\S]*?0 8px 16px var\(--clay-glow\)/,'every icon tile uses dimensional highlights and shadows');
 assert.match(siteCSS,/::after\{\s*content:"";position:absolute;z-index:1;pointer-events:none;\s*inset-inline-start:14%[\s\S]*?radial-gradient\(closest-side/,'every icon tile carries the specular highlight');
 assert.match(siteCSS,/drop-shadow\(0 1px 0 rgba\(255,255,255,\.95\)\) drop-shadow\(0 -1px 0 rgba\(7,66,55,\.22\)\)/,'icon glyphs keep a white embossed stroke');
 // The old espresso/brass tokens must not survive.
 assert.doesNotMatch(landingHTML,/--brass:#/);
 assert.doesNotMatch(landingHTML,/--espresso:#/);
 assert.doesNotMatch(landingHTML,/16100B|101E38/i,'no left-over espresso surface');
 assert.doesNotMatch(landingHTML,/#D8A63C|#7A5712/i,'no left-over brass');
 // WCAG AA for normal text: the quiet labels and white action text must meet 4.5:1,
 // including the pale cream and green-wash surfaces used across the page.
 assert.match(landingHTML,/--ink-soft:#4A5C5C/);
 assert.match(landingHTML,/--muted:#5D6B68/);
 const lum=hex=>{const c=hex.match(/[0-9A-F]{2}/gi).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 const contrast=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const muted='#5D6B68';
 for(const bg of ['#FCF3EB','#F8F0E8','#E4F4EE','#FFFFFF'])assert.ok(contrast(muted,bg)>=4.5,'muted body copy passes on '+bg);
 for(const bg of ['#0A6B54','#057A5C'])assert.ok(contrast('#FFFFFF',bg)>=4.5,'white action text passes on '+bg);
});

test('step 27 material: one glass recipe for every control, one clay recipe for every icon',()=>{
 const siteCSS=readFileSync(new URL('../design/landing/src/site.css',import.meta.url),'utf8');
 const copyCSS=readFileSync(new URL('../design/landing/src/copy.css',import.meta.url),'utf8');
 const studioCSS=readFileSync(new URL('../design/landing/src/studio.css',import.meta.url),'utf8');
 // ONE recipe, and every control is listed inside :where() so the recipe can never
 // out-specify the component that wears it. Two bodies: the light one by default, the
 // emerald one for the primary action — both at rest, never only on :hover.
 const L=':where\\(\\.btn,\\.btn--login,\\.nav-btn,\\.sticky-cta,\\.film-tab,\\.ptabs__row button,\\.try-switch button,';
 assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\)\\{[\\s\\S]*?background-color:var\\(--glass-bg\\)[\\s\\S]*?backdrop-filter:var\\(--glass-blur\\)'),'one recipe, every control on it');
 assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\)\\{[\\s\\S]*?--glass-bg:var\\(--glass-bg-l\\)'),'the light body is the default');
 assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\)::after\\{[\\s\\S]*?background:var\\(--glass-sheen\\)'),'and the glossy sheen over it');
 assert.match(siteCSS,/--glass-blur:blur\(14px\) saturate\(160%\)/,'the same blur everywhere');
 assert.match(siteCSS,/:where\(\.btn,\.sticky-cta,\.sb-build,\.sb-activate,[\s\S]*?--glass-bg:var\(--glass-bg-p\)/,'the primary action is the emerald body at rest');
 assert.match(siteCSS,/\.plan \.btn\{width:100%[^}]*\}/,'every plan button shares the plan rule');
 // All plan purchase buttons now use the primary glass body, not just the featured card.
 assert.match(siteCSS,/\.plan \.btn\{[\s\S]*?--glass-bg:var\(--glass-bg-p\)[\s\S]*?color:#fff/);
 // The four states are written once, for the whole list.
 for(const state of [':hover:not\\(\\[disabled\\]\\)',':active:not\\(\\[disabled\\]\\)',':focus-visible','\\[aria-disabled="true"\\]'])
  assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\)'+state+'[\\s\\S]{0,420}?(box-shadow|cursor:not-allowed)'),'the '+state+' state is drawn on the same body');
 assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\):focus-visible\\{[\\s\\S]*?outline:3px solid var\\(--emerald-deep\\)'),'a visible 3px focus ring');
 assert.match(siteCSS,new RegExp(L+'[\\s\\S]*?\\):active:not[\\s\\S]*?scale\\(\\.98\\)'),'pressing down presses the control');
 // Nothing may repaint a control's own body: the recipe is the only place that does it.
 const controls=['.btn','.btn--login','.nav-btn','.sticky-cta','.film-tab','.ptabs__row button','.try-switch button',
  '.tryon__line','.sb-upload__btn','.sb-add','.chip','.menu-toggle','.salon-strip','.play-replay','.quote-nav','.plan__buy'];
 const stripAtRules=css=>css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/@supports not \([\s\S]*?\n\}\n/g,'')
   .replace(/@media \(prefers-reduced-transparency[\s\S]*?\n\}\n/g,'');
 for(const [name,css] of [['site.css',siteCSS],['copy.css',copyCSS],['studio.css',studioCSS]])
  for(const m of stripAtRules(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)){
   const sel=m[1].trim(); if(sel.startsWith('@'))continue;
   if(!/(^|;)background(-color|-image)?:/.test(m[2]))continue;
   const bare=sel.replace(/\s+/g,'');
   if(!controls.some(c=>bare.includes(c.replace(/\s+/g,''))&&/^([.\w\[\]:()'"=-]|>|\+|~|,|\s)*$/.test(sel)))continue;
   if(!controls.some(c=>{const i=bare.indexOf(c.replace(/\s+/g,''));if(i<0)return false;
     const after=bare[i+c.replace(/\s+/g,'').length]||'';return after===''||' ,:>.#['.includes(after)}))continue;
   assert.fail(name+' repaints a control outside the shared recipe: '+sel.slice(0,60));
  }
 // No glass control waits for :hover to become green: its own body is already green at rest.
 for(const m of stripAtRules(siteCSS+copyCSS+studioCSS).matchAll(/([^{}]*:hover[^{}]*)\{([^{}]*)\}/g)){
  const sel=m[1].trim(); if(sel.startsWith('@'))continue;
  if(!controls.some(c=>sel.includes(c)))continue;
  assert.ok(!/(^|;)background(-color)?:\s*(var\(--emerald|#0)/.test(m[2]),'no control turns emerald only on hover: '+sel.slice(0,50));
 }
 // Fallbacks: no blur, and no transparency at all.
 assert.match(siteCSS,/@supports not \(\(backdrop-filter:blur\(1px\)\) or \(-webkit-backdrop-filter:blur\(1px\)\)\)\{[\s\S]*?--glass-bg:#fff/,'a solid body where the blur is missing');
 assert.match(siteCSS,/@supports not \(\(backdrop-filter[\s\S]*?--glass-bg:var\(--emerald-deep\);color:#fff\}/,'the primary action stays emerald without the blur');
 assert.match(siteCSS,/@media \(prefers-reduced-transparency:reduce\)\{[\s\S]*?backdrop-filter:none/,'and a solid body when transparency is not wanted');
 // AA, measured on the real tokens: the fill composited over the ground it sits on, then
 // the top gloss, then the sheen at its brightest — the worst case, and the point where
 // the label actually sits. Nothing here is a hand-copied number.
 const over=(a,b,alpha)=>a.map((c,i)=>alpha*c+(1-alpha)*b[i]);
 const lum=c=>{const x=c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*x[0]+.7152*x[1]+.0722*x[2]};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 const white=[255,255,255],ink=[18,51,60];
 const body=name=>{
  const rgb=siteCSS.match(new RegExp('--glass-bg-'+name+':rgba\\((\\d+),(\\d+),(\\d+),(\\.?[\\d.]+)?\\)'));
  const top=siteCSS.match(new RegExp('--glass-top-'+name+':rgba\\((\\d+),(\\d+),(\\d+),(\\.?[\\d.]+)\\)'));
  const sheen=siteCSS.match(new RegExp('--glass-sheen-'+name+':([^;}]+)'));
  assert.ok(rgb&&top&&sheen,'the '+name+' body is complete');
  const peak=Math.max(...[...sheen[1].matchAll(/rgba\(\d+,\d+,\d+,(\.?[\d.]+)\)/g)].map(m=>Number(m[1])));
  return {fill:[+rgb[1],+rgb[2],+rgb[3]],alpha:rgb[4]!==undefined?Number(rgb[4]):1,
          gloss:Number(top[4]),sheen:peak};
 };
 const grounds=[[252,243,235],[255,255,255],[244,251,248],[228,244,238]];
 for(const [name,label,fg] of [['p','white label on the emerald glass',white],['l','ink label on the light glass',ink]]){
  const b=body(name);
  assert.ok(b.alpha<=.92,name+' body is still glass, not paint');
  for(const bg of grounds){
   const lit=over(white,over(white,over(b.fill,bg,b.alpha),b.gloss),b.sheen);
   assert.ok(ratio(fg,lit)>=4.5,label+' over '+bg+' ('+ratio(fg,lit).toFixed(2)+')');
  }
 }
 // The three copies of the recipe (landing, the customer page, the pack sheet) agree.
 for(const [name,src] of [['customer.js',readFileSync(new URL('../worker/customer.js',import.meta.url),'utf8')],
                          ['regularpage.js',readFileSync(new URL('../worker/regularpage.js',import.meta.url),'utf8')]])
  for(const tok of ['--glass-bg-p','--glass-top-p','--glass-sheen-p']){
   const mine=siteCSS.match(new RegExp(tok+':([^;}]+)'));assert.ok(mine,'site.css defines '+tok);
   assert.ok(src.includes(tok+':'+mine[1]),name+' uses the same '+tok);
  }
 // The customer page (/try, and the embedded try-on on every salon page) lists every one of
 // its own controls on the recipe, and none of them paints a body of its own afterwards.
 const cust=readFileSync(new URL('../worker/customer.js',import.meta.url),'utf8');
 const CUST='\.btn,\.chip,\.linesw__btn,\.share__opt,\.base__opt,\.icon-btn,button\.hchip,a\.hchip';
 assert.match(cust,new RegExp(CUST+'\\{[\\s\\S]*?background-color:var\\(--glass-bg\\)[\\s\\S]*?backdrop-filter:var\\(--glass-blur\\)'),'the customer page shares the one recipe');
 assert.match(cust,new RegExp('\\.btn::after[\\s\\S]*?\\{[^}]*background:var\\(--glass-sheen\\)'),'with the same sheen on every one of them');
 for(const c of ['.chip','.linesw__btn','.share__opt','.base__opt','.icon-btn','button.hchip','a.hchip'])
  assert.ok(cust.includes(c+'::after'),'the sheen covers '+c);
 assert.match(cust,/\.btn--primary,\.btn--build,\.chip\[aria-pressed="true"\],\.chip\.is-on,\.linesw__btn\.is-on\{/,'the selected line tab and «بساز» are the emerald body');
 const custStrip=cust.replace(/\/\*[\s\S]*?\*\//g,'').replace(/@supports not \([\s\S]*?\n\}\n/g,'');
 for(const [sel,rule] of [['the line tab','\.linesw__btn\{'],['the selected line tab','\.linesw__btn\.is-on\{'],
                          ['the share tile','\.share__opt\{'],['the base option','\.base__opt\{']]){
  const m=custStrip.match(new RegExp(rule+'([^}]*)\}'));
  assert.ok(m,sel+' is defined');
  assert.ok(!/(^|;)background(-color)?:\s*(var\(--surface|var\(--accent\)|#)/.test(m[1]),
   sel+' no longer paints its own body: '+m[1].slice(0,60));
 }
});

test('step 28 depth: one clay recipe for every box, glass price panels, 3D arrows and ticks',()=>{
 const siteCSS=readFileSync(new URL('../design/landing/src/site.css',import.meta.url),'utf8');
 const copyCSS=readFileSync(new URL('../design/landing/src/copy.css',import.meta.url),'utf8');
 const studioCSS=readFileSync(new URL('../design/landing/src/studio.css',import.meta.url),'utf8');
 const all=siteCSS+'\n'+copyCSS+'\n'+studioCSS;
 // ONE card recipe: every box listed inside :where(), the recipe (not the component) paints
 // the body, and the depth comes from the inset rim, the cast shadow and the clay foot.
 const CARD=':where\\(\\.plan,\\.why,\\.step,\\.setup__step,\\.svc,\\.quote,\\.faq-item,\\.pbar,\\.sample-card,\\.choose-card,';
 assert.match(siteCSS,new RegExp(CARD+'[\\s\\S]*?\\)\\{[\\s\\S]*?background:[\\s\\S]*?radial-gradient[\\s\\S]*?linear-gradient[\\s\\S]*?--card-c[\\s\\S]*?\\)'),'one recipe: gloss, specular pool and body');
 assert.match(siteCSS,new RegExp(CARD+'[\\s\\S]*?\\)\\{[\\s\\S]*?box-shadow:[\\s\\S]*?inset 0 1px 0 var\\(--clay-hi\\)[\\s\\S]*?inset 0 -2px 5px var\\(--card-shade\\)[\\s\\S]*?0 2px 0 var\\(--clay-foot\\)[\\s\\S]*?0 10px 24px var\\(--card-drop\\)'),'with a rim on top, a shade below, a foot and a cast shadow');
 // A listed box must not paint its own body or carry a flat shadow of its own, or the
 // recipe's depth would be silently overridden at component specificity.
 const boxes=['.plan','.why','.step','.setup__step','.svc','.quote','.faq-item','.sample-card','.choose-card',
  '.pay-card','.form-card','.plan-note','.req-mini','.wiz-ready','.sb-work','.sb-details','.sb-steps li',
  '.mini__services span','.setup__step','.pbar','.glance__card','.benefits__list li','.tryhead__steps li'];
 const strip=css=>css.replace(/\/\*[\s\S]*?\*\//g,'');
 for(const [name,css] of [['site.css',siteCSS],['copy.css',copyCSS],['studio.css',studioCSS]]){
  for(const m of strip(css).matchAll(/([^{}@]+)\{([^{}]*)\}/g)){
   const sel=' '+m[1].trim().replace(/\s+/g,' ')+' ',body=m[2];
   if(sel.trim().startsWith(':where('))continue;          // the recipe itself
   if(!/(^|\)|:|\s)box-shadow:/.test(body)&&!/(^|;)background(-color)?:/.test(body))continue;
   const hit=boxes.find(b=>sel.includes(' '+b+'{')||sel.endsWith(' '+b+' ')||sel.includes(' '+b+','));
   if(!hit)continue;
   if(sel.includes(':hover')||sel.includes('[open]')||sel.includes('[aria-'))continue;
   assert.fail(name+' still paints or flattens '+hit+' outside the recipe: '+sel.trim().slice(0,50));
  }
 }
 // The customer and try-on pages carry their own CSS, so the treatment has to live there too
 // (design.js baseCSS is shared by customer.js and regularpage.js).
 const baseCSS=readFileSync(new URL('../worker/design.js',import.meta.url),'utf8');
 assert.match(baseCSS,/--card-a:#FFFFFF;--card-b:#FAFBFA;--card-c:#EDF1F0/,'the try-on surface has its own card tokens');
 assert.match(baseCSS,/:where\(\.panel\)\{[\s\S]*?radial-gradient[\s\S]*?--card-c\)[\s\S]*?0 2px 0 var\(--card-foot\)/,'and the shared card body');
 assert.ok(!/\.panel\{background:var\(--surface\)/.test(baseCSS),'the panel no longer paints a flat fill of its own');
 // The recommended card keeps its gold seal but tints the shared body emerald.
 assert.match(siteCSS,/\.plan--lead\{--card-a:#FFFFFF;--card-b:#F3FBF7;--card-c:#E3F3EB\}/,'«پیشنهاد آینه» tints the shared body');
 assert.match(siteCSS,/\.plan--lead\{border:2px solid #D8B46A\}/,'and keeps its gold seal');
 assert.ok(!/\.plan--lead\{[^}]*background:/.test(siteCSS),'without painting a body of its own');
 // The price box is glass, and the amount on it is the emerald glass body.
 assert.match(siteCSS,/\.plan__price\{[\s\S]*?background-color:rgba\(255,255,255,\.42\)[\s\S]*?backdrop-filter/,'the price panel is glass');
 assert.match(siteCSS,/\.plan__amount\{[\s\S]*?background-color:var\(--glass-bg-p\)[\s\S]*?box-shadow:var\(--glass-lift-p\)/,'the amount is the emerald glass body');
 // Arrows and the plan ticks sit on their own miniature clay disc.
 assert.match(siteCSS,/plan li svg,\.plan-how li>span,\.pay-done__tick svg\{/,'the tick shares the small clay disc');
 assert.match(siteCSS,/width:1\.55em;height:1\.55em;padding:\.22em;border-radius:50%/,'the disc is drawn with padding, no wrapper element');
 assert.match(siteCSS,/span\[aria-hidden="true"\]/,'every arrow glyph is on it too');
 // The footer was the one dark slab; it is the shared card now, with the page's own ink.
 assert.ok(!/background:#0B3B32/.test(all),'the footer is no longer a dark slab');
 assert.match(siteCSS,/\.site-footer\{[\s\S]*?--card-a:#FFFFFF;--card-b:#F4FBF8;--card-c:#E4F3EC/,'the footer wears the shared card, tinted emerald');
 assert.match(siteCSS,/\.foot-col a,\.foot-col span\{[\s\S]*?color:var\(--ink-soft\)\}/,'footer links carry the page ink, not cream');
 assert.ok(!/rgba\(252,243,235,\.\d+\)/.test(siteCSS.match(/\.foot-[^{]*\{[^}]*\}/g)?.join('\n')||''),'nothing in the footer is cream-on-dark any more');
 // AA on the footer's DARKEST body stop, which is the worst case for the small legal type.
 const lum=c=>{const x=c.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*x[0]+.7152*x[1]+.0722*x[2]};
 const ratio=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
 for(const [n,c] of [['brand',[10,32,42]],['links',[74,92,92]],['legal',[93,107,104]]])
  assert.ok(ratio(c,[228,243,236])>=4.5,'footer '+n+' passes on the darkest stop ('+ratio(c,[228,243,236]).toFixed(2)+')');
});

test('step 24 layout: the grids collapse cleanly at 1120 / 900 / 600',()=>{
 for(const rule of [
  /@media\(max-width:1120px\)\{[\s\S]{0,80}\.nav\{display:none\}/,
  /@media\(max-width:900px\)\{[\s\S]{0,200}\.hero-grid\{grid-template-columns:1fr/,
  /@media\(max-width:1000px\)\{\.steps\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,
  /@media\(max-width:860px\)\{\.svc-grid\{grid-template-columns:1fr\}/,
  /@media\(max-width:900px\)\{\.why-grid\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/,
  /@media\(max-width:900px\)\{\.plans\{grid-template-columns:1fr/,
  /@media\(max-width:940px\)\{\.foot-grid\{grid-template-columns:1fr 1fr\}\}/])
  assert.match(landingHTML,rule);
 assert.match(landingHTML,/:focus-visible\{outline:3px solid var\(--emerald-deep\)/,'focus ring everywhere');
 assert.match(landingHTML,/@media\(prefers-reduced-motion:reduce\)/,'motion is opt-out');
 assert.match(landingHTML,/\[hidden\]\{display:none!important\}/,'hidden always wins over a display rule');
});

test('step 24 pricing: the three plans of the owner\'s price sheet, on the home page and every service page',()=>{
 for(const k of ['home','hair','color','nails','lashes']){
  const html=k==='home'?landingHTML:servicePages[k];
  for(const [name,months,price,was,key] of [['پایه','۱','۲٫۹','','essential'],['حرفه‌ای','۳','۶','۸٫۷','pro'],['کامل','۶','۱۰','۱۷٫۴','signature']]){
   const card=html.match(new RegExp('<article class="plan[^"]*" data-plan="'+key+'">[\\s\\S]*?</article>'))[0];
   assert.ok(card.includes('>'+name+'</h3>'),k+' '+name);
   assert.ok(card.includes(months+' ماهه'),name+' runs '+months+' months');
   assert.ok(card.includes('<b>'+price+'</b> میلیون تومان'),name+' costs '+price);
   if(was)assert.ok(card.includes('<s>'+was+' میلیون تومان</s>'),name+' was '+was);
  }
  for(const f of ['صفحهٔ اختصاصی شما','گالری نمونه‌کار','امتحان مدل با عکس دلخواه مشتری','دریافت درخواست مشتری','۲۰ عکس هدیه',
   'همهٔ امکانات پلن پایه','۷۵ عکس هدیه','اتصال پیام‌رسان','نوبت‌دهی و پیگیری','گزارش عملکرد ساده',
   'همهٔ امکانات پلن حرفه‌ای','۱۸۰ عکس هدیه','گزارش عملکرد کامل','آرشیو مشتریان','پشتیبانی ویژه'])
   assert.ok(html.includes(f),k+' lists «'+f+'» as on the sheet');
  assert.match(html,/data-plan="signature">[\s\S]*?class="plan__badge">[\s\S]*?پیشنهاد آینه/,'SIGNATURE carries the badge');
  assert.ok(html.includes('بعد از تمام شدن عکس‌های هدیه، هر ۱۰ عکس ۲۰۰ هزار تومان'),'the top-up note');
 }
 // five visible tabs (four services and the salon); the home page opens «مدل مو»
 assert.match(landingHTML,/<div class="ptabs" data-ptabs>/,'the tab row is on');
 assert.match(landingHTML,/id="ptab-hair" aria-controls="plans-single" data-tab="hair" aria-selected="true"/);
 for(const t of ['hair','color','nails','lashes','salon'])assert.match(landingHTML,new RegExp('data-tab="'+t+'"'),t+' tab');
 // the server charges from the same table
 assert.deepEqual(Object.fromEntries(Object.entries(PLANS).map(([k,v])=>[k,[v.months,v.amount,v.credits]])),
  {essential:[1,2900000,20],pro:[3,6000000,75],signature:[6,10000000,180],
   salon1:[1,5000000,40],salon3:[3,10000000,150],salon6:[6,15000000,360]});
 // «پنل آرایشگاه»: 3 users included; each user beyond is priced for the whole period
 assert.deepEqual(['salon1','salon3','salon6'].map(k=>[PLANS[k].seats,PLANS[k].seat_amount,PLANS[k].tier]),
  [[3,2000000,'essential'],[3,1500000,'pro'],[3,1000000,'signature']]);
 for(const k of ['essential','pro','signature'])assert.equal(PLANS[k].seats,0,k+' has no user count');
 assert.deepEqual(TOPUP,{images:10,amount:200000});
});

test('step 27 films: the clips are no longer a section of any page, their assets stay for reuse',()=>{
 for(const html of [landingHTML,...Object.values(servicePages)])assert.doesNotMatch(html,/id="films"|id="filmVideo"/,'the film player is not on the page');
 for(const key of ['hair','lashes','nails'])assert.ok(readFileSync(new URL('../public/landing/'+key+'-poster.webp',import.meta.url)).length>2000,key+' poster stays on disk');
});

test('step 24 studio: the live salon preview survives the rebuild',()=>{
 assert.match(servicePages.hair,/id="salon-example"/);
 assert.match(servicePages.hair,/id="builderLive"/);assert.match(servicePages.hair,/id="livePage"/);
 assert.equal((servicePages.hair.match(/class="wiz-step/g)||[]).length,2,'only name + slug gate the preview');
 assert.match(servicePages.hair,/id="wizardCount">۱ از ۲</);
 assert.match(servicePages.hair,/id="builderDetails"[\s\S]*?تکمیل جزئیات صفحه/);
 for(const key of ['name','slug','brand','logo','cover','bio','manager','phone','hours','address',
  'portrait','map','instagram','telegram','website'])
  assert.match(servicePages.hair,new RegExp('name="'+key+'"'),'field '+key+' kept');
 const sections=[...servicePages.hair.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 for(const src of sections)new Function(src);
 const bundle=sections.join('\n');
 assert.match(bundle,/ayneh:wizard-ready/);
 /* The studio is preview-only now: it never posts a request, and the button it grows
    when the preview is ready leads to the panels instead of a form. */
 assert.doesNotMatch(bundle,/\/api\/activation/,'the studio uploads nothing');
 assert.doesNotMatch(bundle,/demo\/otp/,'no phone verification on the landing page');
 assert.match(servicePages.hair,/id="builderActivate" href="#services"/,'the studio hands over to the panels');
 assert.match(servicePages.hair,/const studio=document\.getElementById\('salon-example'\)/,'mobile sticky action knows the builder section');
 assert.match(servicePages.hair,/!overStudio/,'mobile sticky action stays out of the live builder');
 assert.match(bundle,/querySelector\('\.upload-name'\)/,'the file label keeps a node to update');
 const builder=readFileSync(new URL('../design/landing/src/builder.js',import.meta.url),'utf8');
 const studioCss=readFileSync(new URL('../design/landing/src/studio.css',import.meta.url),'utf8');
 assert.ok(builder.includes("style.setProperty('--brand',get('brand'))"),'the selected salon colour reaches the live preview');
 assert.ok(builder.includes("style.setProperty('--brand-action',actionBrand(get('brand')))")&&studioCss.includes('var(--brand-action,var(--brand))'),'white action labels use a contrast-safe tint');
 const actionSource=builder.match(/function actionBrand\(hex\)\{[\s\S]*?\n \}/)?.[0];assert.ok(actionSource);
 const actionBrand=new Function(actionSource+';return actionBrand')();
 const lightness=hex=>{const c=hex.slice(1).match(/.{2}/g).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
 for(const color of ['#068F6C','#FFFF00','#FFFFFF','#FF00FF','#1267FF','#000000'])assert.ok(1.05/(lightness(actionBrand(color))+.05)>=4.5,'live preview action remains legible for '+color);
});

test('step 24 budget: payload and markup stay inside the review envelope',()=>{
 // Step 26 gave every button the glass material (blur, sheen, four states and a solid
 // fallback) and every icon the clay material: ~8k of design-system CSS on top of the
 // page (255.3k shipped). Still far below the Worker script limit.
 assert.ok(landingHTML.length<260000,'landing under 260k ('+landingHTML.length+')');
 assert.ok(landingHTML.length>60000,'the page still carries its content');
 assert.match(landingHTML,/og:image" content="__ORIGIN__\/landing\/og\.jpg"/,'the share image is origin-relative in source');
 assert.equal((landingHTML.match(/__ORIGIN__/g)||[]).length,12,'signup links, the share image, the canonical and the organisation data carry the origin token');
 assert.equal((landingHTML.match(/<h1[\s>]/g)||[]).length,1);
 // The retired engine is the NAVY one (cinema.css / cinema.js with .sec-head, .kicker,
 // .film-player, #transform). The redesigned page has its own scroll-scrubbed entrances in
 // cinema2.js, so the guard names what actually had to disappear, not the word.
 assert.doesNotMatch(landingHTML,/film-player|service-journey|sec-head|class="kicker"/,'the retired film sections are gone');
 assert.ok(!landingHTML.includes('cinema.css'),'the retired stylesheet is not shipped');
 assert.ok(!landingHTML.includes('cinema.js'),'the retired script is not shipped');
 assert.equal((landingHTML.match(/ساخت صفحهٔ من/g)||[]).length,0,'the retired CTA label is gone');
 assert.ok(customerHTML.includes('ساخت صفحهٔ من'),'the customer return bar keeps its own label');
});

/* ============================================================================
   Step 25: paid plans — a card transfer, a 10-minute window, an owner or
   webhook confirmation, and the salon panel the payment opens.
   ========================================================================== */
import {PLANS, PRICE_MINUTES, TOPUP} from '../worker/prices.js';
import {cardValid} from '../worker/orders.js';
import {panelHTML} from '../worker/panel.js';
/* The checkout source (not the generated bundle) — the funnel guard reads its guard clause. */
const payJS = readFileSync(new URL('../design/landing/src/pay.js', import.meta.url), 'utf8');

const CARD = '6037-9911-2233-4455';      // passes the Luhn check, expires nowhere
const orderBody = (plan = 'pro', extra = {}) => ({plan, service: PLANS[plan]?.seats ? 'all' : 'hair', salon: 'سالن نمونه', name: 'سارا محمدی', phone: '۰۹۱۲۱۲۳۴۵۶۷', city: 'تهران', consent: true, ...extra});
/* A priced plan is needed to test a checkout; the shipped page stays unpriced until the
   owner approves numbers. This only mutates the in-memory import for these tests. */
function priced(plan, amount, quota = 30) {
  const before = {...PLANS[plan]};
  PLANS[plan].amount = amount; PLANS[plan].quota = quota;
  return () => Object.assign(PLANS[plan], before);
}

test('step 25 funnel: every plan sells with «خرید» and opens the checkout on its own page',()=>{
 for(const k of ['hair','nails','lashes']){
  const html=servicePages[k];
  const labels=[...html.matchAll(/<a\b[^>]*data-buy="([a-z]+)"[^>]*>([^<]*)<\/a>/g)];
  assert.deepEqual(labels.map(m=>m[1]),['essential','pro','signature']);
  for(const [tag,plan,text] of labels){
   assert.equal(text,'خرید',plan+' says خرید');
   assert.match(tag,/data-state="open"/);assert.match(tag,new RegExp('data-amount="'+PLANS[plan].amount+'"'),plan+' carries the sheet amount');
   assert.match(tag,/href="#pay"/,'the anchor lands on the checkout');
  }
  assert.match(html,/id="pay"/);
 }
 assert.match(payJS,/service,/,'the checkout tells the server which service page it came from');
});

test('step 25 narrow phones: nothing in the header or the studio preview widens the page under 430px', () => {
  // Measured in Chromium: at 320/360/390 the page used to be 3–49px wider than the viewport
  // because the header pills and the studio's address row and submit pill could not shrink.
  // These are the three rules that made scrollW == clientW; losing any of them reopens it.
  const site = readFileSync(new URL('../design/landing/src/site.css', import.meta.url), 'utf8');
  const studio = readFileSync(new URL('../design/landing/src/studio.css', import.meta.url), 'utf8');
  const narrow = site.match(/@media\(max-width:380px\)\{[\s\S]*?\n\}/);
  assert.ok(narrow, 'the small-phone header block exists');
  for (const rule of ['.brand__mark{width:29px', '.brand__word{font-size:20px', '.header-cta .btn svg{display:none}'])
    assert.ok(narrow[0].includes(rule), 'small-phone header: ' + rule);
  assert.match(studio, /@media \(max-width:430px\)\{[\s\S]*?\.sb-browser\{flex-wrap:wrap/,
    'the studio address row wraps instead of overflowing');
  assert.match(studio, /@media \(max-width:430px\)\{[\s\S]*?\.sb-fallback \.btn\{[^}]*white-space:normal/,
    'the preview form submit may wrap its label');
  assert.match(site, /\.site-footer\{[^}]*overflow:clip/, 'the clipped footer ornament stays clipped');
  assert.match(site, /html\{[^}]*overflow-x:clip/, 'cinematic transforms cannot create page-level horizontal scroll');
});

test('step 25 pricing: an unknown plan is refused and the browser never sets the amount',async()=>{
 const e=fixture();
 const unknown=await call(e,'/api/order',orderBody('platinum'));
 assert.equal(unknown.status,404);
 const r=await call(e,'/api/order',orderBody('essential',{amount:1,service:'nails'}));
 assert.equal(r.status,200);assert.equal(r.data.amount,2900000,'a sent amount is ignored');assert.equal(r.data.service,'nails');
 assert.equal(e.DB.sql.prepare('SELECT credits FROM orders WHERE id=?').get(r.data.id).credits,20,'the plan\'s gift images ride on the order');
});

test('step 25 order: a valid order returns the amount in toman, a 10-minute window and a card once the owner sets one', async () => {
  const e = fixture();
  const restore = priced('pro', 2900000);
  try {
    // No card yet: the order still opens, the page is told to warn instead of inventing a number.
    const first = await call(e, '/api/order', orderBody());
    assert.equal(first.status, 200, JSON.stringify(first));
    assert.equal(first.data.amount, 2900000, 'toman, not rial');
    assert.equal(first.data.card, '');
    assert.equal(first.data.status, 'open');
    assert.equal(first.data.expires_at - first.data.created_at, PRICE_MINUTES * 60000, '10 minutes');
    assert.match(first.data.ref, /^AY[2-9A-HJ-NP-Z]{6}$/);
    assert.match(first.data.access_key, /^AY-[2-9A-HJ-NP-Z]{9}$/, 'the key is handed out once');

    // The owner's card is normalised, owner name kept, and the same order now carries it.
    assert.equal((await call(e, '/api/salon-a', {}, {})).status, 404); // sanity: no such shortcut
    const saved = await call(e, '/api/owner/payment', {card: CARD, owner: 'علی ادلی'}, OWNER);
    assert.equal(saved.status, 200, JSON.stringify(saved));
    assert.deepEqual(saved.data.card, {number: '6037991122334455', owner: 'علی ادلی'});
    const again = await call(e, '/api/order/' + first.data.id);
    assert.equal(again.data.card, '6037991122334455');
    assert.equal(again.data.card_owner, 'علی ادلی');
    assert.equal(again.data.access_key, '', 'the key is never re-sent');
  } finally { restore() }
});

test('step 25 card: 16 digits, Luhn-checked, and digits alone never become an owner name', () => {
  assert.equal(cardValid(CARD), true);
  assert.equal(cardValid('6037991122334456'), false, 'wrong check digit');
  assert.equal(cardValid('1111111111111111'), false, 'repeated digits');
  assert.equal(cardValid('603799112233445'), false, '15 digits');
  assert.equal(cardValid('۶۰۳۷۹۹۱۱۲۲۳۳۴۴۵۵'), true, 'Persian digits are accepted');
});

test('step 25 expiry: the window is enforced by the server, and a closed order cannot be confirmed or paid', async () => {
  const e = fixture();
  const restore = priced('pro', 1000000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.equal(r.status, 200);
    e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now() - 1000, r.data.id);
    const after = await call(e, '/api/order/' + r.data.id);
    assert.equal(after.data.status, 'expired');
    const confirm = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(confirm.status, 409);
    const receipt = await call(e, '/api/order/' + r.data.id + '/receipt', {note: '123456'});
    assert.equal(receipt.status, 404, 'there is no receipt step any more');
    const panel = await call(e, '/api/panel/me');
    assert.equal(panel.data.salon, null, 'no panel before payment');
  } finally { restore() }
});

test('step 25 one open order per mobile: a second order replaces the first and reveals nothing about it',async()=>{
 const e=fixture();
 const a=await call(e,'/api/order',orderBody('essential'));
 const b=await call(e,'/api/order',orderBody('pro',{name:'کسی دیگر',salon:'سالن دیگر'}));
 assert.notEqual(a.data.id,b.data.id,'whoever types the same mobile gets a new order, not the first one');
 assert.equal(b.data.salon,'سالن دیگر');assert.match(b.data.access_key,/^AY-/);
 assert.equal((await call(e,'/api/order/'+a.data.id)).data.status,'cancelled','the earlier open order is closed, not resumed');
 assert.equal(e.DB.sql.prepare("SELECT count(*) n FROM orders WHERE status='open'").get().n,1);
 assert.match(payJS,/localStorage\.setItem\(STORE/,'resuming happens in the same browser, from its own store');
});

test('step 25 coupons: one code per order lowers the toman amount; a bad code is refused and a max:1 code is spent only on commit', async () => {
  const e = fixture();
  const restore = priced('pro', 2000000);
  try {
    e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('pay_coupons','{\"AYNEH20\":{\"percent\":20,\"max\":1},\"OFF500\":{\"amount\":500000,\"max\":0}}',?)").run(Date.now());
    const r = await call(e, '/api/order', orderBody());
    const c = await call(e, '/api/order/' + r.data.id + '/coupon', {coupon: 'ayneh20'});
    assert.equal(c.status, 200, JSON.stringify(c));
    assert.equal(c.data.discount, 400000);
    assert.equal(c.data.amount, 1600000);
    const bad = await call(e, '/api/order/' + r.data.id + '/coupon', {coupon: 'NOPE'});
    assert.equal(bad.status, 422);
    // The code is spent when the payment is confirmed, not when a window opens.
    const other0 = await call(e, '/api/order', orderBody('pro', {phone: '۰۹۱۲۰۰۰۰۰۰۱'}));
    assert.equal((await call(e, '/api/order/' + other0.data.id + '/coupon', {coupon: 'AYNEH20'})).status, 200, 'an unpaid order has not spent it');
    assert.equal((await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER)).data.order.status, 'paid');
    const other = await call(e, '/api/order', orderBody('pro', {phone: '۰۹۱۲۰۰۰۰۰۰۰'}));
    const used = await call(e, '/api/order/' + other.data.id + '/coupon', {coupon: 'AYNEH20'});
    assert.equal(used.status, 422, 'max:1 is used up');
    const fixed = await call(e, '/api/order/' + other.data.id + '/coupon', {coupon: 'OFF500'});
    assert.equal(fixed.status, 200);
    assert.equal(fixed.data.amount, 1500000);
  } finally { restore() }
});

test('step 25 confirm: the owner turns an order into a salon page + a working panel key, exactly once', async () => {
  const e = fixture();
  const restore = priced('pro', 1200000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.equal((await call(e, '/api/owner/orders', undefined, OWNER)).data.orders.length, 1);
    assert.equal((await call(e, '/api/owner/orders')).status, 401);
    const ok = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(ok.status, 200, JSON.stringify(ok));
    assert.equal(ok.data.order.status, 'paid');
    assert.match(ok.data.order.page_url, /\/s\/salon-[a-z2-9]{6}$/, 'a Persian salon name gets a slug from the order code, never from a person\'s name');
    // The salon exists and its public page answers.
    assert.equal((await app.fetch(new Request(origin + ok.data.order.page_url.slice(origin.length)), e)).status, 200);
    // Idempotent: a second confirm does not make a second salon.
    const twice = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(twice.data.order.status, 'paid');
    assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n, 1);

    // The key the customer kept opens the panel.
    const login = await call(e, '/api/panel/login', {key: r.data.access_key});
    assert.equal(login.status, 200, JSON.stringify(login));
    // Only a live session token is accepted; a cookie without one is a 401.
    assert.equal((await call(e, '/api/panel/me')).data.salon, null, 'no cookie, no panel');
    assert.equal((await call(e, '/api/panel/me', undefined, {cookie: 'ayneh_panel=deadbeef'})).data.salon, null);
    const me = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: login.cookie}}), e);
    assert.equal(me.status, 200);
    const authed = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: login.cookie}}), e);
    const dash = await (authed).json();
    assert.equal(dash.salon.name, 'سالن نمونه');
    assert.match(dash.salon.url, /\/s\/salon-[a-z2-9]{6}$/);
    assert.equal(dash.credits.granted, 75, 'the PRO plan granted its 75 gift images');
    assert.equal(dash.credits.left, 75);
    assert.equal(dash.credits.days_left, 90, 'three months');
    assert.equal(dash.setup.total, 6, 'PRO: page details, page phone, portfolio, first request, bot, team');
    assert.ok(dash.setup.steps.some(x => x.key === 'telegram'), 'PRO is asked to link its bot');
    assert.equal((await app.fetch(new Request(origin + '/panel'), e)).status, 200);
  } finally { restore() }
});

test('step 25 webhook: the payment site confirms with its token; a wrong token, a bad status or an unknown ref changes nothing', async () => {
  const e = fixture();
  const restore = priced('signature', 3000000);
  try {
    const r = await call(e, '/api/order', orderBody('signature'));
    const conf = await call(e, '/api/owner/payment', undefined, OWNER);
    const key = conf.data.webhook.key;
    assert.match(key, /^whk_[a-f0-9]{48}$/);
    assert.equal(conf.data.webhook.url, origin + '/api/pay/confirm');
    /* A real payment site is a server: it sends no Origin, only the bearer token. Sending one
       here would hide the bug this test caught — the CSRF guard refusing every cross-origin
       POST before the token was ever looked at. */
    const post = (body, headers = {}) => app.fetch(new Request(origin + '/api/pay/confirm', {method: 'POST', headers: {'content-type': 'application/json', ...headers}, body: JSON.stringify(body)}), e);
    assert.equal((await post({ref: r.data.ref})).status, 401, 'no token');
    assert.equal((await post({ref: r.data.ref}, {authorization: 'Bearer wrong'})).status, 401);
    const ignored = await post({ref: r.data.ref, status: 'failed'}, {authorization: 'Bearer ' + key});
    assert.equal((await ignored.json()).ignored, true);
    assert.equal((await call(e, '/api/owner/orders', undefined, OWNER)).data.orders[0].status, 'open');
    const ok = await post({ref: r.data.ref, status: 'paid'}, {'x-webhook-key': key});
    const body = await ok.json();
    assert.equal(body.status, 'paid');
    assert.match(body.page, /\/s\//);
    // The webhook path never hands out the access key; the owner resends it instead.
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.access_key, '');
    // Rotating the token invalidates the old one.
    const rotated = await call(e, '/api/owner/payment', {rotate: true}, OWNER);
    assert.notEqual(rotated.data.key, key);
    assert.equal((await post({ref: r.data.ref}, {authorization: 'Bearer ' + key})).status, 401);
  } finally { restore() }
});

test('step 25 webhook: a server with no Origin reaches the token; every other route still needs one', async () => {
  const e = fixture();
  const restore = priced('pro', 1100000);
  try {
    const r = await call(e, '/api/order', orderBody());
    const key = (await call(e, '/api/owner/payment', undefined, OWNER)).data.webhook.key;
    const post = (path, body, headers = {}) => app.fetch(new Request(origin + path, {method: 'POST', headers: {'content-type': 'application/json', ...headers}, body: JSON.stringify(body)}), e);
    // Exactly what the payment site sends: no Origin, a bearer token.
    const ok = await post('/api/pay/confirm', {ref: r.data.ref, status: 'paid'}, {authorization: 'Bearer ' + key});
    assert.equal(ok.status, 200, 'a token-bearing webhook is not blocked for lacking an Origin');
    assert.equal((await ok.json()).status, 'paid');
    // The exemption is that one path only: a cross-site POST is still refused everywhere else.
    const crossSite = await post('/api/order', orderBody(), {origin: 'https://evil.example'});
    assert.equal(crossSite.status, 403);
    assert.equal((await post('/api/panel/logout', {}, {origin: 'https://evil.example'})).status, 403);
    // And the webhook is still worthless without the token, Origin or no Origin.
    assert.equal((await post('/api/pay/confirm', {ref: r.data.ref}, {})).status, 401);
    assert.equal((await post('/api/pay/confirm', {ref: r.data.ref}, {authorization: 'Bearer whk_' + '0'.repeat(48)})).status, 401);
  } finally { restore() }
});

test('step 25 last step: the paid page opens the customer\'s own panel with one tap, then scrubs the key', async () => {
  const e = fixture();
  const restore = priced('essential', 800000);
  try {
    const r = await call(e, '/api/order', orderBody('essential'));
    await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    // The done screen: the panel button carries the key, so the customer does not retype it.
    assert.match(payJS, /panel\.href = '\/panel\?key=' \+ encodeURIComponent\(shown\)/,
      'the paid screen hands the key to the panel door');
    assert.match(payJS, /state\.entered/, 'it does it once, not on every poll');
    // The panel trades the key for its cookie, then removes it from the address bar.
    const panel = panelHTML;
    assert.match(panel, /\[\?&\]key=\(\[\^&\]\+\)/, 'the panel reads the key from the URL');
    assert.match(panel, /api\('\/api\/panel\/login',\{key:fromUrl\}\)/, 'and logs in with it');
    assert.match(panel, /history\.replaceState\(null,'',location\.pathname\)/, 'then scrubs it from history');
    // The key really is valid at that moment (that is what the button relies on).
    const login = await call(e, '/api/panel/login', {key: r.data.access_key});
    assert.equal(login.status, 200);
    const me = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: login.cookie}}), e);
    assert.equal((await me.json()).salon.name, 'سالن نمونه');
  } finally { restore() }
});

test('step 25 no receipt: the customer never sends one; an old reviewing order still confirms and never expires', async () => {
  const e = fixture();
  const restore = priced('essential', 900000);
  try {
    const r = await call(e, '/api/order', orderBody('essential'));
    assert.equal((await call(e, '/api/order/' + r.data.id + '/receipt', {note: '۴ رقم آخر ۴۵۵'})).status, 404, 'the receipt route is gone');
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.status, 'open');
    const list = (await call(e, '/api/owner/orders', undefined, OWNER)).data.orders[0];
    assert.equal(list.plan, 'پایه', 'the console shows the plan name from the sheet');
    assert.equal(list.contact_phone, '09121234567', 'and a local mobile, not +98');
    assert.equal(list.amount, 900000, 'amount in toman');
    // An order left in 'reviewing' by the retired receipt step is never closed by the clock.
    e.DB.sql.prepare("UPDATE orders SET status='reviewing',expires_at=? WHERE id=?").run(Date.now() - 1, r.data.id);
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.status, 'reviewing');
    assert.equal((await call(e, '/api/panel/me')).data.salon, null);
    assert.equal((await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER)).data.order.status, 'paid');
  } finally { restore() }
});

test('step 25 key: the panel key is handed out when the order opens (once), never on a plain read, and login exchanges it for a cookie', async () => {
  const e = fixture();
  const restore = priced('pro', 700000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.match(r.data.access_key, /^AY-[2-9A-HJ-NP-Z]{9}$/);
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.access_key, '', 'a plain read never returns the key');
    assert.equal((await call(e, '/api/panel/login', {key: 'AY-AAAAAAAAA'})).status, 401);
    assert.equal((await call(e, '/api/panel/login', {key: 'nonsense'})).status, 401);
    await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    // The key alphabet is upper-case only, so a phone keyboard's lower case is forgiven.
    const lower = await call(e, '/api/panel/login', {key: r.data.access_key.toLowerCase()});
    assert.equal(lower.status, 200);
    const ok = await call(e, '/api/panel/login', {key: r.data.access_key});
    assert.equal(ok.status, 200);
    assert.match(ok.cookie, /^ayneh_panel=[a-f0-9]{64}$/, 'the cookie is a random session token');
    const stored = e.DB.sql.prepare('SELECT access_key_hash h FROM orders WHERE id=?').get(r.data.id).h;
    assert.notEqual(ok.cookie.split('=')[1], stored, 'never the key hash from the database');
    assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM panel_sessions').get().n, 2, 'one session per login');
    // A new key ends every open session at once.
    await call(e, '/api/owner/orders/' + r.data.id + '/rekey', {}, OWNER);
    const after = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: ok.cookie}}), e);
    assert.equal((await after.json()).salon, null, 'the old session is gone');
  } finally { restore() }
});

test('step 25 pages: /panel and /pay are real routes, the panel page parses, and only service pages sell',async()=>{
  new Function(panelHTML.split('<script>')[1].split('</script>')[0]);
  assert.match(landingHTML,/id="pay"/,'the home page carries the checkout its price cards open');
  for(const k of ['home','hair','color','nails','lashes','salon']){
   const html=k==='home'?landingHTML:servicePages[k];
   assert.equal((html.match(/data-state="open"/g)||[]).length,k==='salon'?3:6,k+': every plan on the page sells (three single-service, three «پنل آرایشگاه»)');
   assert.match(html,/پرداخت موقتاً ممکن نیست: شمارهٔ کارت آینه هنوز ثبت نشده/);
   assert.match(html,/هر سفارش فقط ۱۰ دقیقه اعتبار دارد/);
   assert.doesNotMatch(html,/[0-9۰-۹]{16}/,'no card number is ever baked into the page');
  }
  const e=fixture();
  const pay=await app.fetch(new Request(origin+'/pay'),e);
  assert.equal(pay.status,200);assert.match(await pay.text(),/id="payForm"/,'/pay serves a page with the checkout');
  assert.match(panelHTML,/\/api\/panel\/topup/,'the panel can buy more images');
});

test('step 25 owner console: the payment card, the webhook token and the order queue are wired without a fake control', () => {
  const js = appHTML.split('<script>')[1].split('</script>')[0];
  new Function(js);
  for (const id of ['payCardNumber', 'payCardOwner'])
    assert.ok(js.includes("id:'" + id + "'"), 'field ' + id);
  assert.match(js, /api\('\/api\/owner\/payment'/, 'card + token come from the owner endpoints');
  assert.match(js, /api\('\/api\/owner\/orders\/'\+o\.id\+'\/confirm'/, 'an order is confirmed by the owner');
  assert.match(js, /api\('\/api\/owner\/orders\/'\+o\.id\+'\/rekey'/, 'a lost panel key can be minted again');
  assert.match(js, /شمارهٔ کارت هنوز ذخیره نشده/, 'an empty card says so instead of showing digits');
  // The card form never ships a number of its own.
  assert.doesNotMatch(js, /6037|6219|5022/, 'no card digits in the console source');
});

test('step 25 checkout never leaves a "buy a panel" bar over a payment, and an unpriced panel never opens a sheet', () => {
  const js = landingHTML.match(/<script>([\s\S]*?)<\/script>/g).map(s => s.slice(8, -9)).join('\n');
  assert.match(js, /is-paying/, 'the sheet flags the page while paying');
  assert.match(js, /ayneh:pay-state/, 'the sticky bar listens for that flag');
  assert.match(js, /await call\('\/api\/order', body\)/, 'the order is opened on the server');
  assert.match(js, /order\//, 'status, receipt and coupon all go through the order endpoints');
  assert.match(js, /expires_at/, 'the countdown mirrors the server deadline');
  assert.doesNotMatch(js, /تومان\/\s*\d/, 'the page does not compute its own prices');
  assert.equal((landingHTML.match(/data-state="open"/g) || []).length, 6, 'the home page sells the three plans and the three salon plans');
});

test('step 25 brand: the favicon is the owner\'s mirror logo, never the retired brass mark', () => {
  assert.doesNotMatch(faviconMark, /#D9B775|#1B130E/i, 'no brass-on-espresso favicon');
  assert.match(faviconMark, /data:image\/png;base64,/, 'the cleaned mirror logo, scaled for a tab');
  assert.match(generatedMark, /data:image\/webp;base64,/, 'the same logo everywhere');
});

test('step 28 demo: the demo salon is on the page as «خودتان امتحان کنید.», opened only on a click',()=>{
 // The visitor's journey — service, photo, model, result — is the real demo page embedded, so
 // the gate itself (whatever the demo salon asks for) cannot be bypassed by the landing page.
 const section=landingHTML.match(/<section id="demo"[\s\S]*?<\/section>/)[0]||'';
 assert.ok(section,'the demo section ships');
 for(const [page,lines] of [['hair',['hair']],['color',['color']],['nails',['nails']],['lashes',['lashes']],['salon',['hair','color','nails','lashes']],['sample',['hair','color','nails','lashes']]]){
  const own=servicePages[page].match(/<section id="demo"[\s\S]*?<\/section>/)[0];
  assert.equal((servicePages[page].match(/id="demo"/g)||[]).length,1,page+': one demo');
  for(const line of ['hair','color','nails','lashes'])
   assert.equal(own.includes('data-line="'+line+'"'),lines.includes(line),page+' page offers '+line+': '+lines.includes(line));
 }
 assert.equal((section.match(/data-line="/g)||[]).length,4,'home: four service chips');
 assert.ok(section.includes('عکس خودم را انتخاب کنم')&&section.includes('عکس شما فقط برای ساخت نمونه و دیدنِ سالن استفاده می‌شود.')&&section.includes('یک نمونه است؛ برای انتخاب قبل از نوبت.'));
 assert.ok(section.includes('id="demoCompare"'),'the interactive mirror lives here, not in the hero');
 assert.ok(section.includes('صفحهٔ سالن من همین را داشته باشد')&&section.includes('این را برای مشتریان خودم می‌خواهم'),'what to do after a result');
 // The frame is not fetched until the visitor asks for it.
 assert.ok(!/<iframe id="tryonFrame"[^>]*src="/.test(section),'the demo is not embedded until asked');
 const js=landingHTML.match(/<script>([\s\S]*?)<\/script>/g).map(x=>x.slice(8,-9)).join('\n');
 assert.ok(js.includes("'/s/demo?'"),'it opens the real demo');
 assert.ok(js.includes('__AYN_DRAFT.put'),'a photo from here reaches the demo through the same handoff');
 // The demo reports its height and the frame follows, so there is no scroll inside a scroll.
 assert.ok(js.includes('aynehDemoHeight'),'the frame follows the demo height');
 assert.ok(customerJS.includes('parent.postMessage({aynehDemoHeight:h},location.origin)'),'the demo reports it');
});

test('step 29 mirror: the character can restyle hair and colour, on a real photo',()=>{
 const section=servicePages.hair.match(/<section id="play"[\s\S]*?<\/section>/)[0]||'';
 assert.ok(section,'the mirror section ships');
 assert.match(section,/id="playRoom"[^>]*src="(?:\/landing\/|assets\/)hero-hd\.webp"/,'the original photo, at 2x, remains the single base render');
 assert.doesNotMatch(section,/class="play-backdrop"/,'no second photograph is layered under the selected character');
 // 19 styles and 7 colours, as in the version that earned the request for it.
 const js=servicePages.hair.match(/<script>([\s\S]*?)<\/script>/g).map(x=>x.slice(8,-9)).join('\n');
 const start=js.indexOf("const STYLES = ['"), end=js.indexOf('];',start);
 const styles=js.slice(start,end).split("','").length;
 assert.equal(styles,19,'19 hairstyles');
 // The shipped page is minified, so count the swatch gradients inside the colour array
 // itself rather than assuming where a line break falls.
 const cstart=js.indexOf('const COLORS = [');
 assert.ok(cstart>0,'the colour list ships');
 const cblock=js.slice(cstart,js.indexOf('];',cstart)+2);
 assert.equal(cblock.split('linear-gradient').length-1,7,'7 colours');
 for(const nm of ['بلوند شامپاینی','کاراملی','اسپرسو','آمبره','مسی','بلوند پلاتینی','شرابی'])
  assert.ok(cblock.includes(nm),nm+' ships');
 // The recolour is painted through the mask, not faked with a CSS filter.
 assert.ok(section.includes('id="playCanvas"'),'there is a canvas to paint on');
 assert.ok(customerJS.length>0);
 assert.ok(js.includes('__AYN_HAIR_COLOR.tint'),'the real tint engine is used');
 assert.ok(js.includes("loadImg(SRC('hair-mask','png'))"),'the hair mask is in the bundle');
 // The plate frames the mirror assembly, whose side panels are real reflections baked into
 // the single source photo; there is no independent portrait overlay.
 assert.ok(js.includes('const WIDE = {x:440,y:118,w:496,h:440}'),'the wide frame holds the central mirror and both side reflections');
 assert.ok(js.includes('NARROW = {x:556,y:122,w:264,h:398}')&&js.includes('MAX = 1.3'),'phones frame the central mirror, and the render is never blown up past 1.3x');
 assert.ok(/name:'آمبره'[^}]*ombre:true/.test(js),'آمبره keeps its root-to-ends gradient, as on the live studio');
 // Nothing is laid over the photo except the colour rail on the empty wall: the dock and the
 // selection sit under the stage, so no panel can cover the face or the hair.
 const stage=section.match(/<div class="play-screen"[\s\S]*?<\/button>\s*<\/div>/)[0];
 assert.ok(!stage.includes('play-dock')&&!stage.includes('play-picked'),'the dock and the selection are outside the photo stage');
 assert.ok(js.includes('window.__AYN_PORTRAIT.compose'),'style changes preserve one shared face instead of layering another portrait');
 assert.ok(js.includes('const fit=Math.min(W/(box.w*PAD),H/(box.h*PAD))'),'the complete mirror assembly stays centered and proportional');
 assert.ok(section.includes('id="playChoiceThumb"')&&section.includes('id="playReplay"'),'the selected model card and replay control ship');
 assert.ok(js.includes('choiceThumb.src = thumb.currentSrc || thumb.src')&&js.includes("$('playReplay').addEventListener('click'"),'the card follows the selection and replay control is wired');
 assert.ok(js.includes('id="playStyles"')||section.includes('id="playStyles"'),'the style rail exists');
 assert.ok(section.includes('id="playSwatches"'),'the colour palette exists');
 // Every style that claims to render on the mirror has its two files.
 const looks=[...servicePages.hair.matchAll(/look-s(\d\d)\.webp/g)].map(m=>m[1]);
 assert.ok(looks.length>=1,'the rails reference render files');
 for(const n of new Set(looks)){
  assert.ok(existsSync(new URL('../public/landing/look-s'+n+'.webp',import.meta.url)),'look '+n+' ships');
  assert.ok(existsSync(new URL('../public/landing/mask-s'+n+'.png',import.meta.url)),'mask '+n+' ships');
 }
});

test('step 30 cinema: every section has a scroll-scrubbed entrance, and none can strand content',()=>{
 // The redesign dropped the old navy choreography (cinema.js) along with the film sections.
 // These entrances are the same idea rebuilt for this page: progress comes from the scroll
 // position, so an entrance plays backwards on the way up, and nothing depends on a timer.
 const js=readFileSync(new URL('../design/landing/src/cinema2.js', import.meta.url), 'utf8');
 assert.ok(js.includes("root.classList.remove('no-cinema')"),'the plain page is released as soon as the script runs');
 assert.ok(js.includes('prefers-reduced-motion'),'reduced motion turns it off');
 for(const sel of ["'#features'","'#how'","'#why'","'#services'","'#films'","'#try-on'","'#play'","'#faq .faq-item'","'#cta'","'.site-footer'"])
  assert.ok(js.includes(sel),'a track exists for '+sel);
 // A card must never be left at 0 by a row that has already passed: each one also reads its
 // own position as a floor.
 assert.ok(js.includes('Math.max(sub(enter(grid'),'the row stagger has a per-card floor');
 assert.ok(js.includes("c.style.setProperty('--mp'"),'the mirror rail cards ride their own progress');
 // Scroll-scrubbing needs the first frame held while the element is still below the fold.
 // fill-mode must be backwards: 'both' would freeze the last frame and kill hover/sticky.
 const css=readFileSync(new URL('../design/landing/src/site.css', import.meta.url), 'utf8');
 assert.ok(css.includes('backwards paused'),'seeking uses a backwards fill');
 assert.ok(!css.includes('both paused'),'no animation is frozen at its last frame');
 for(const prop of ['--hp','--sp','--wp','--ul','--p','--fp','--mp','--tp','--i','--dir','--vp','--ip','--lp'])
  assert.ok(css.includes('@property '+prop+'{'),'scrub value '+prop+' has a registered type');
 assert.ok(css.includes('inset-inline:.14em;bottom:-.02em;height:2px'),'accent underline is a fine inset hairline');
 assert.ok(css.includes('clamp(300px,42vw,400px)'),'closed demo stage fits its own curtain');
 assert.ok(css.includes('.tryon__iframe{display:block;width:100%;height:0;'),'closed iframe does not reserve a phantom page');
 assert.ok(css.includes('.tryon__stage.is-open .tryon__iframe{height:clamp(560px,74vw,760px)}'),'opened demo gets its frame height');
 assert.ok(js.includes('function cardDetails('),'cards animate their visual components separately');
 assert.ok(js.includes("cardDetails(svcCards, svcProgress, '.svc__media'"),'feature imagery gets its own entrance beat');
 assert.ok(js.includes("cardDetails(whyCards, whyProgress, '.why__icon'"),'feature icons get a separate entrance beat');
 assert.ok(js.includes("'#proof', '#salon-example'"),'proof and builder sections are included in the choreography');
 assert.ok(css.includes('@keyframes cine-visual') && css.includes('@keyframes cine-icon'),'component keyframes ship');
 assert.ok(css.includes('[data-cine] .proof-stat'),'proof stat cards use the same entrance track');
 assert.ok(css.includes('animation-delay:calc(var(--mp,1) * -999ms);'),'the play rail is staggered once, not twice');
 assert.ok(css.includes('#services .plan ul li') && css.includes('#salon-example .sb-steps li'),'pricing and builder rows animate on arrival');
 assert.ok(css.includes('.cinema-ready #intro .hero-stage'),'the hero visual has a first-fold arrival');
 const tryon=readFileSync(new URL('../design/landing/src/tryon.js', import.meta.url), 'utf8');
 assert.ok(tryon.includes("stage.classList.add('is-open')"),'opening the demo expands its stage');
 assert.ok(landingHTML.includes('.cine-word'),'the word keyframes ship');
 assert.ok(landingHTML.includes('class="no-cinema"'),'the no-JS guard is on the root element');
 assert.ok(landingHTML.includes('cine-word'),'headlines are split into words at runtime');
});

test('storybook: six illustrated chapters turn like pages behind the sections, on every page',()=>{
 for(const html of [landingHTML,servicePages.hair,servicePages.nails,servicePages.lashes]){
  assert.ok(html.includes("className = 'story'")&&html.includes("setAttribute('aria-hidden', 'true')"),'the story layer ships and is decorative');
  assert.ok(html.includes("document.querySelectorAll('main > section[id]')"),'chapters are cut from the sections the page has');
  assert.match(html,/\.story\{position:fixed;inset:0;z-index:-1;pointer-events:none/,'the art sits under the content and never takes a click');
  assert.match(html,/prefers-reduced-motion:reduce\)\{[^}]*\.story__page\.is-turning\{animation:none/,'reduced motion gets a fade, not a turning page');
 }
 for(let n=1;n<=6;n++)for(const s of ['l','r'])
  assert.ok(existsSync(new URL('../public/landing/story-'+n+s+'.webp',import.meta.url)),'chapter '+n+s+' art ships');
});

test('before/after follows the finger in RTL, plays itself first, and step labels clear their numbers',()=>{
 // --split is measured from the RIGHT edge, so pointer maths and the range direction must be too
 assert.ok(servicePages.hair.includes('set((r.right-e.clientX)/r.width*100)'),'the divider follows the pointer');
 assert.equal((servicePages.hair.match(/class="compare__range"[^>]*dir="rtl"/g)||[]).length,2,'the demo and sample sliders run right-to-left');
 assert.match(servicePages.hair,/\.compare__img--after\{clip-path:inset\(0 var\(--split,50%\) 0 0\)\}/,'«بعد» is the left side, under its tag');
 assert.ok(servicePages.hair.includes('engines.set(box,play)')&&servicePages.hair.includes('engines.get(demoBox)'),'each item plays its own before → after');
 // RTL: the step number sits at the inline start, so the padding that clears it must too
 assert.match(servicePages.hair,/\.sb-steps li\{[^}]*padding-inline:46px 14px/,'studio step titles are not under their numbers');
 assert.doesNotMatch(servicePages.hair,/\.nav\{[^}]*margin-inline-start:auto/,'the header menu sits beside the logo, not pushed to the left');
 // «قبل» on the right, «بعد» on the left: the tags are placed with logical edges, so they
 // follow the writing direction rather than sitting on a hard-coded side.
 assert.match(servicePages.hair,/\.compare__tag--before\{inset-inline-start:10px\}/,'«قبل» is on the start (right) edge');
 assert.match(servicePages.hair,/\.compare__tag--after\{inset-inline-end:10px/,'«بعد» is on the end (left) edge');
 // The 2px divider has to sit ON the split: it is pulled back with a logical margin. A
 // physical translateX(-1px) would push it off the split in one writing direction.
 assert.match(servicePages.hair,/\.compare__divider\{[^}]*inset-inline-start:var\(--split,50%\);width:2px[^}]*margin-inline-start:-1px\}/,'the divider is centred on the split logically');
 assert.match(servicePages.hair,/\.compare__knob\{[^}]*margin-inline-start:-20px;/,'and so is its handle');
 // Keyboard: the range runs right-to-left, so the native thumb sits where the divider is and
 // each arrow key moves it the way it points. aria-valuenow is the range's own value.
 assert.match(servicePages.hair,/range\.value=v;box\.style\.setProperty\('--split',v\+'%'\)/,'the value and the split can never disagree');
 assert.match(servicePages.hair,/if\(still\)\{set\(50\);return\}/,'with no motion the slider just sits in the middle');
 // A centred badge must not depend on the writing direction: stretching the abspos box and
 // letting auto inline margins centre it works in either one; translateX(50%) only works in RTL.
 const rtlSource=['site.css','studio.css','copy.css'].map(f=>readFileSync(new URL('../design/landing/src/'+f,import.meta.url),'utf8')).join('\n');
 for(const [name,sel] of [['the step number','\\.step__num'],['the setup number','\\.setup__num'],['the recommended card\'s badge','\\.plan--lead \\.plan__badge']]){
  // anchored to the start of a line, so a compound rule like .section--soft .step__num
  // is not mistaken for the .step__num rule itself
  const all=[...rtlSource.matchAll(new RegExp('^'+sel+'\\{[^}]*\\}','gm'))].map(m=>m[0]);
  assert.ok(all.length,name+' rule exists');
  const win=all[all.length-1];   // the last one is the one that sticks
  if(name==='the setup number'){assert.match(win,/inset-inline-start:14px/);assert.match(win,/inset-inline-end:auto/)}else{
   assert.match(win,/inset-inline:0/,'inset-inline:0 stretches the box of '+name);
   assert.match(win,/margin-inline:auto/,'margin-inline:auto centres the box of '+name);}
  assert.doesNotMatch(win,/translateX/,'no physical translate centres the box of '+name);
 }
 // The only physical edges left are the ones that must stay physical, each with its reason.
 const ship=['site.css','studio.css','copy.css'].map(f=>readFileSync(new URL('../design/landing/src/'+f,import.meta.url),'utf8')).join('\n');
 const physical=[...ship.replace(/\/\*[\s\S]*?\*\//g,'').matchAll(/([^{}]+)\{([^{}]*)\}/g)]
  .filter(m=>/(^|;|\s)(left|right|margin-left|margin-right|padding-left|padding-right):/.test(m[2]));
 for(const m of physical)
  assert.ok(/play-plate|^\s*\.quote\s*$|^\s*\.quote,/m.test(m[1]),'an unexpected physical edge on '+m[1].trim().slice(0,50));
});

test('payment: concurrent confirmations make one salon; a webhook amount must match; an expired order can be reopened',async()=>{
 const e=fixture();
 const r=await call(e,'/api/order',orderBody('signature'));
 // the owner and the payment site at the same instant
 const [a,b]=await Promise.all([call(e,'/api/owner/orders/'+r.data.id+'/confirm',{},OWNER),call(e,'/api/owner/orders/'+r.data.id+'/confirm',{},OWNER)]);
 assert.equal(a.data.order.status,'paid');assert.equal(b.data.order.status,'paid');
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,1,'one salon');
 assert.equal(e.DB.sql.prepare('SELECT COALESCE(SUM(delta),0) n FROM credit_ledger').get().n,180,'SIGNATURE credits granted once');
 // webhook amount
 const o=await call(e,'/api/order',orderBody('essential',{phone:'09120000001'}));
 const key=(await call(e,'/api/owner/payment',undefined,OWNER)).data.webhook.key;
 const post=body=>app.fetch(new Request(origin+'/api/pay/confirm',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key},body:JSON.stringify(body)}),e);
 assert.equal((await post({ref:o.data.ref,status:'paid',amount:2000000})).status,409,'a short payment does not open the panel');
 assert.equal((await call(e,'/api/order/'+o.data.id)).data.status,'open');
 assert.equal((await post({ref:o.data.ref,status:'paid',amount:2900000})).status,200);
 // reopen
 const x=await call(e,'/api/order',orderBody('essential',{phone:'09120000002'}));
 e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now()-1,x.data.id);
 assert.equal((await call(e,'/api/order/'+x.data.id)).data.status,'expired');
 assert.equal((await call(e,'/api/owner/orders/'+x.data.id+'/reopen',{},OWNER)).status,200);
 const back=(await call(e,'/api/order/'+x.data.id)).data;
 assert.equal(back.status,'open');assert.ok(back.expires_at>Date.now()+9*60000,'another 10 minutes');
 assert.equal((await call(e,'/api/owner/orders/'+x.data.id+'/reopen',{},OWNER)).status,409,'only an expired order reopens');
});

test('payment: a renewing buyer keeps one salon; a top-up from the panel adds 10 images per pack once paid',async()=>{
 const e=fixture();
 const first=await call(e,'/api/order',orderBody('essential'));
 await call(e,'/api/owner/orders/'+first.data.id+'/confirm',{},OWNER);
 const renew=await call(e,'/api/order',orderBody('pro'));
 await call(e,'/api/owner/orders/'+renew.data.id+'/confirm',{},OWNER);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,1,'a renewal extends the same salon');
 const login=await call(e,'/api/panel/login',{key:renew.data.access_key});
 const me=async()=>(await (await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:login.cookie}}),e)).json());
 let d=await me();
 assert.equal(d.credits.granted,95,'20 + 75');assert.ok(d.credits.days_left>=119&&d.credits.days_left<=121,'1 + 3 months');
 assert.equal((await call(e,'/api/panel/topup',{packs:2})).status,401,'only a logged-in salon buys images');
 const t=await app.fetch(new Request(origin+'/api/panel/topup',{method:'POST',headers:{'content-type':'application/json',origin,cookie:login.cookie},body:JSON.stringify({packs:2})}),e);
 const top=await t.json();
 assert.equal(t.status,200,JSON.stringify(top));assert.equal(top.kind,'topup');assert.equal(top.amount,400000,'2 × 200,000 toman');assert.equal(top.credits,20);
 assert.equal(top.access_key,'','a top-up mints no new key');
 assert.equal((await me()).credits.granted,95,'nothing is granted before payment');
 await call(e,'/api/owner/orders/'+top.id+'/confirm',{},OWNER);
 assert.equal((await me()).credits.granted,115,'paid: +20 images');
 await call(e,'/api/owner/orders/'+top.id+'/confirm',{},OWNER);
 assert.equal((await me()).credits.granted,115,'a second confirm grants nothing');
 assert.equal((await call(e,'/api/owner/orders',undefined,OWNER)).data.orders.find(o=>o.id===top.id).plan,'اعتبار ۲۰ عکس');
});

test('credits: a plan salon stops making images at zero or after its end; failed images never cost a credit; other salons are not metered',async()=>{const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const original=await upload(e,s,g);let previous=globalThis.fetch,n=0;
 globalThis.fetch=async(url,opts)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask')){n++;return Response.json({code:200,data:{taskId:'task'+n}})}if(String(url).includes('api.telegram.org')||String(url).includes('bale'))return Response.json({ok:true,result:{}});return new Response(png())};
 const gen=()=>call(e,'/api/s/salon-a/generate',{image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:original,style:0},g);
 try{
  // no plan: not metered
  assert.equal((await gen()).status,200,'a salon without a plan is not metered');
  // put the salon on a plan with 2 credits, starting now
  const row=e.DB.sql.prepare("SELECT id,settings FROM salons WHERE slug='salon-a'").get();
  // the plan starts after the unmetered image above (same-millisecond starts would count it)
  const last=e.DB.sql.prepare('SELECT MAX(created_at) t FROM generations').get().t;
  const st=JSON.parse(row.settings||'{}');const now=last+1;st.plan={key:'essential',start:now,until:Date.now()+30*86400000};
  e.DB.sql.prepare('UPDATE salons SET settings=? WHERE id=?').run(JSON.stringify(st),row.id);
  e.DB.sql.prepare("INSERT INTO credit_ledger(id,salon_id,delta,reason,order_id,created_at) VALUES(?,?,?,?,?,?)").run(crypto.randomUUID(),row.id,1,'plan:essential',null,now);
  // the next image must be stamped at or after the plan start, or it would not be counted
  while(Date.now()<=now)await new Promise(r=>setTimeout(r,1));
  const ok=await gen();assert.equal(ok.status,200,JSON.stringify(ok));
  const empty=await gen();assert.equal(empty.status,402,'no credit left');assert.match(empty.data.error,/ساخت تصویر در این سالن فعلاً متوقف است[\s\S]*بدون شبیه‌سازی/);
  // a failed image gives its credit back
  e.DB.sql.prepare("UPDATE generations SET state='fail' WHERE id=?").run(ok.data.id);
  assert.equal((await gen()).status,200,'the failed image did not count');
  // plan over
  e.DB.sql.prepare("INSERT INTO credit_ledger(id,salon_id,delta,reason,order_id,created_at) VALUES(?,?,?,?,?,?)").run(crypto.randomUUID(),row.id,10,'topup',null,now);
  st.plan.until=Date.now()-1;e.DB.sql.prepare('UPDATE salons SET settings=? WHERE id=?').run(JSON.stringify(st),row.id);
  const over=await gen();assert.equal(over.status,402);assert.match(over.data.error,/ساخت تصویر در این سالن فعلاً متوقف است/);
 }finally{globalThis.fetch=previous}
});

import {bookingTick, whenText} from '../worker/panelapi.js';
import {weeklyText} from '../worker/reports.js';
import {can, FEATURES, OPENED_BY, panelInbox} from '../worker/plans.js';

/* A salon bought through the checkout, logged in to its panel. */
async function planSalon(e,plan,phone='09125550000'){
 const o=await call(e,'/api/order',orderBody(plan,{phone,salon:'Plan Salon'}));
 await call(e,'/api/owner/orders/'+o.data.id+'/confirm',{},OWNER);
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug;
 return {slug,cookie:login.cookie,order:o.data};
}
const panel=(e,ctx,path,body)=>call(e,'/api/panel/'+path,body,{cookie:ctx.cookie});

test('plans: features open per plan; a salon without a plan keeps everything',()=>{
 const withPlan=key=>({settings:JSON.stringify({plan:{key,start:1,until:Date.now()+86400000}})});
 for(const f of ['page','gallery','reference','inbox','bot'])assert.ok(can(withPlan('essential'),f),'ESSENTIAL '+f+' (every paid plan has the bot)');
 for(const f of ['booking','report_simple','report_full','archive','priority_support'])assert.equal(can(withPlan('essential'),f),false,'ESSENTIAL has no '+f);
 assert.equal(OPENED_BY.bot,'پایه');
 // «پنل آرایشگاه» opens the features of its tier
 assert.deepEqual(['salon1','salon3','salon6'].map(k=>FEATURES.signature.filter(f=>can(withPlan(k),f)).length),[FEATURES.essential.length,FEATURES.pro.length,FEATURES.signature.length]);
 for(const f of ['bot','booking','report_simple'])assert.ok(can(withPlan('pro'),f),'PRO '+f);
 for(const f of ['report_full','archive','priority_support'])assert.equal(can(withPlan('pro'),f),false,'PRO has no '+f);
 for(const f of FEATURES.signature)assert.ok(can(withPlan('signature'),f),'SIGNATURE '+f);
 for(const f of FEATURES.signature)assert.ok(can({settings:'{}'},f),'no plan, nothing locked: '+f);
});

test('panel inbox: an ESSENTIAL salon receives requests in /panel with photos and status buttons; locked features say so',async()=>{
 const e=tgEnv(fixture());const tg=mockTelegram();try{
 const ctx=await planSalon(e,'essential');
 const s={slug:ctx.slug},g=await guest(e,s);
 const pub=await call(e,'/api/s/'+ctx.slug+'/public');assert.equal(pub.data.telegram,true,'the page offers sending even with no bot');
 const original=await upload(e,s,g);
 const sent=await call(e,'/api/s/'+ctx.slug+'/leads',lead(original),g);assert.equal(sent.status,200,JSON.stringify(sent));
 const row=e.DB.sql.prepare('SELECT status,waiting FROM leads').get();assert.equal(row.status,'panel');assert.equal(row.waiting,0);
 assert.equal(tg.calls.filter(c=>c.method==='sendPhoto'||c.method==='sendMediaGroup').length,0,'nothing is sent to a bot');
 assert.equal(tg.calls.filter(c=>/منتظر مدیر/.test(JSON.stringify(c.body))).length,0,'no stuck alert: the panel is the inbox');
 const list=await panel(e,ctx,'requests');assert.equal(list.status,200,JSON.stringify(list));assert.equal(list.data.requests.length,1);
 const r=list.data.requests[0];assert.equal(r.name,'سارا محمدی');
 const img=await app.fetch(new Request(origin+'/api/panel/media/'+r.original_id,{headers:{cookie:ctx.cookie}}),e);assert.equal(img.status,200,'the panel sees its own photo');
 assert.equal((await app.fetch(new Request(origin+'/api/panel/media/'+r.original_id),e)).status,401,'not without the session');
 const st=await panel(e,ctx,'requests/'+r.id+'/status',{status:'called'});assert.equal(st.status,200);
 assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads').get().s,'called');
 for(const [path,body] of [['bookings',undefined],['report',undefined],['customers',undefined],['support',{message:'سلام سلام'}]]){
  const x=await panel(e,ctx,path,body);assert.equal(x.status,403,path+' is locked on ESSENTIAL');assert.match(x.data.error,/در پلن (حرفه‌ای|کامل) و بالاتر باز است/);
 }
 const me=await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:ctx.cookie}}),e);const d=await me.json();
 assert.deepEqual(d.features,['page','gallery','reference','inbox','bot']);assert.equal(d.opened_by.archive,'کامل');
 assert.equal((await panel(e,ctx,'bot-link',{})).status,200,'every paid plan links the bot');
 }finally{tg.restore()}
});

test('booking (PRO): a dated booking from a request marks it booked, tells a following customer, reminds once and follows up once',async()=>{
 const e=tgEnv(fixture());const tg=mockTelegram();try{
 const ctx=await planSalon(e,'pro');
 const s={slug:ctx.slug},g=await guest(e,s);const original=await upload(e,s,g);
 await call(e,'/api/s/'+ctx.slug+'/leads',lead(original),g);
 const l=e.DB.sql.prepare('SELECT id FROM leads').get();
 e.DB.sql.prepare("UPDATE leads SET follow_chat='555',follow_platform='telegram' WHERE id=?").run(l.id);
 // a fixed moment at 12:00 Tehran (08:30 UTC)
 const noon=Date.UTC(2026,10,16,8,30);
 const at=noon+20*3600000;
 const b=await panel(e,ctx,'bookings',{lead_id:l.id,starts_at:Date.now()+20*3600000,duration_min:90,note:'رنگ'});assert.equal(b.status,200,JSON.stringify(b));
 assert.equal(e.DB.sql.prepare('SELECT salon_status s FROM leads').get().s,'booked');
 assert.ok(b.data.told,'the following customer is told');
 assert.ok(tg.calls.some(c=>c.body.chat_id==555&&/نوبتت در/.test(c.body.text)),'confirmation reached her chat');
 assert.equal((await panel(e,ctx,'bookings',{lead_id:l.id,starts_at:Date.now()+30*3600000})).status,409,'one active booking per request');
 const list=await panel(e,ctx,'bookings');assert.equal(list.data.bookings.length,1);assert.match(list.data.bookings[0].when,/ساعت/);
 // reminder: once, inside Tehran hours
 e.DB.sql.prepare('UPDATE bookings SET starts_at=?').run(at);
 const before=tg.calls.length;
 assert.equal((await bookingTick(e,origin,noon)).reminded,1);
 assert.equal((await bookingTick(e,origin,noon)).reminded,0,'never twice');
 assert.ok(tg.calls.slice(before).some(c=>/یادآوری/.test(c.body.text)));
 e.DB.sql.prepare('UPDATE bookings SET reminded_at=NULL').run();
 assert.equal((await bookingTick(e,origin,Date.UTC(2026,10,16,19,30))).reminded,0,'not at 23:00 Tehran');
 // follow-up the day after
 e.DB.sql.prepare("UPDATE bookings SET status='done',starts_at=?",).run(noon-26*3600000);
 assert.equal((await bookingTick(e,origin,noon)).followed,1);
 assert.equal((await bookingTick(e,origin,noon)).followed,0);
 // move and cancel tell her too
 const nb=await panel(e,ctx,'bookings',{name:'مشتری حضوری',phone:'09121112233',starts_at:Date.now()+48*3600000});assert.equal(nb.status,200);
 const mv=await panel(e,ctx,'bookings/'+nb.data.id,{action:'move',starts_at:Date.now()+72*3600000});assert.equal(mv.status,200);
 const cx=await panel(e,ctx,'bookings/'+nb.data.id,{action:'cancel'});assert.equal(cx.data.status,'cancelled');
 // PRO: simple report, no archive
 const rep=await panel(e,ctx,'report');assert.equal(rep.status,200);assert.equal(rep.data.level,'simple');assert.equal(rep.data.current.requests,1);assert.equal(rep.data.current.booked,1);
 assert.equal(rep.data.current.bookings,1,'a booking made this month counts even when it falls on a later day (the cancelled one does not)');
 assert.equal((await panel(e,ctx,'customers')).status,403);
 }finally{tg.restore()}
});

test('SIGNATURE: full report, customer archive with search and an Excel-ready CSV, priority support',async()=>{
 const e=tgEnv(fixture());const tg=mockTelegram();try{
 const ctx=await planSalon(e,'signature');
 const s={slug:ctx.slug},g=await guest(e,s);const original=await upload(e,s,g);
 await call(e,'/api/s/'+ctx.slug+'/leads',lead(original),g);
 await call(e,'/api/s/'+ctx.slug+'/leads',lead(original,{name:'سارا م.'}),g);
 const rep=await panel(e,ctx,'report');assert.equal(rep.data.level,'full');assert.ok(Array.isArray(rep.data.funnel));assert.ok(Array.isArray(rep.data.staff));
 const cs=await panel(e,ctx,'customers');assert.equal(cs.status,200);assert.equal(cs.data.customers.length,1,'grouped by mobile');
 assert.equal(cs.data.customers[0].requests,2);assert.equal(cs.data.customers[0].phone,'09121234567');
 assert.equal((await panel(e,ctx,'customers?q=0912123')).data.customers.length,1,'search by mobile');
 assert.equal((await panel(e,ctx,'customers?q=نیست')).data.customers.length,0);
 const csv=await app.fetch(new Request(origin+'/api/panel/customers.csv',{headers:{cookie:ctx.cookie}}),e);
 const raw=new Uint8Array(await csv.arrayBuffer());assert.deepEqual([...raw.slice(0,3)],[0xEF,0xBB,0xBF],'UTF-8 BOM so Excel reads Persian');
 assert.match(new TextDecoder().decode(raw),/09121234567/);
 assert.equal((await app.fetch(new Request(origin+'/api/panel/customers.csv'),e)).status,401);
 const sup=await panel(e,ctx,'support',{topic:'راه‌اندازی',message:'ربات را چطور وصل کنم؟'});assert.equal(sup.status,200);
 for(let i=0;i<8;i++)await panel(e,ctx,'support',{message:'پیام شمارهٔ '+i});
 assert.equal((await panel(e,ctx,'support',{message:'یکی دیگر'})).status,429,'rate-limited');
 }finally{tg.restore()}
});

test('weekly summary text carries counts only, never a mobile; booking times read in Persian',()=>{
 const t=weeklyText({name:'سالن نمونه'},{level:'full',current:{visitors:12,tries:5,requests:3,booked:2,declined:1,bookings:2,visits:1},previous:{requests:1},response_minutes:14});
 assert.match(t,/خلاصهٔ هفتگی/);assert.doesNotMatch(t,/09\d{9}|\+98/);
 assert.match(whenText(Date.UTC(2026,10,16,12,30)),/ساعت ۱۶:۰۰/,'12:30 UTC is 16:00 in Tehran');
});

test('a request without a valid photo id is a clear 400, not a server error',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);
 await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true},OWNER);
 for(const bad of [undefined,'','not-an-id']){
  const r=await call(e,'/api/s/salon-a/leads',lead(bad),g);
  assert.notEqual(r.status,500,'never a 500 for '+JSON.stringify(bad));
 }
});

test('panel own page (ESSENTIAL): setup asks for nothing the plan lacks; portfolio and page details are self-service; renewal keeps salon and key',async()=>{
 const e=fixture();
 const ctx=await planSalon(e,'essential');
 const me=async()=>(await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:ctx.cookie}}),e)).json();
 let d=await me();
 assert.deepEqual(d.setup.steps.map(x=>x.key),['profile','phone','portfolio','share','telegram','team'],'ESSENTIAL has the bot, so it is asked to link it');
 // Privacy: the buyer's own name and mobile never land on the public page.
 const first=await call(e,'/api/s/'+ctx.slug+'/public');
 assert.equal(first.data.salon.profile.phone,undefined,'no phone until the salon writes one');
 assert.equal(first.data.salon.profile.manager,undefined,'no buyer name on the page');
 assert.doesNotMatch(JSON.stringify(first.data),/09125550000|9125550000/,'the buyer mobile is not in the public payload');
 assert.deepEqual(d.plans.map(p=>p.key),['essential','pro','signature','salon1','salon3','salon6'],'renew/upgrade options are listed, «پنل آرایشگاه» included');
 // Page details
 const bad=await panel(e,ctx,'profile',{phone:'abc'});assert.equal(bad.status,400);
 const ok=await panel(e,ctx,'profile',{name:'سالن آینه‌ای',bio:'رنگ و لایت',hours:'شنبه تا پنجشنبه',phone:'۰۹۱۲۰۰۰۰۰۰۰',instagram:'@my.salon'});
 assert.equal(ok.status,200,JSON.stringify(ok));assert.equal(ok.data.profile.instagram,'https://instagram.com/my.salon');
 const pub=await call(e,'/api/s/'+ctx.slug+'/public');assert.equal(pub.data.salon.name,'سالن آینه‌ای');assert.equal(pub.data.salon.profile.bio,'رنگ و لایت');
 // Portfolio: upload, list, served to the panel, delete; another salon cannot delete it.
 const add=await call(e,'/api/panel/portfolio?title='+encodeURIComponent('بالیاژ')+'&line=color',png(),{cookie:ctx.cookie});
 assert.equal(add.status,200,JSON.stringify(add));assert.equal(add.data.line,'color');assert.equal(add.data.title,'بالیاژ');
 assert.equal((await call(e,'/api/panel/portfolio?title=x',png())).status,401,'not without the panel session');
 d=await me();assert.equal(d.portfolio.length,1);assert.ok(d.setup.steps.find(x=>x.key==='portfolio').done);assert.ok(d.setup.steps.find(x=>x.key==='profile').done);
 assert.equal((await app.fetch(new Request(origin+'/api/panel/media/'+add.data.image,{headers:{cookie:ctx.cookie}}),e)).status,200,'the panel shows its own portfolio photo');
 assert.equal((await call(e,'/api/s/'+ctx.slug+'/public')).data.portfolio.length,1,'and the customer page lists it');
 const other=await planSalon(e,'essential','09125550001');
 const steal=await app.fetch(new Request(origin+'/api/panel/portfolio/'+add.data.id,{method:'DELETE',headers:{origin,cookie:other.cookie}}),e);assert.equal(steal.status,404);
 const del=await app.fetch(new Request(origin+'/api/panel/portfolio/'+add.data.id,{method:'DELETE',headers:{origin,cookie:ctx.cookie}}),e);assert.equal(del.status,200);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM portfolio').get().n,0);
 // Renewal / upgrade from the panel: same salon, no new key, the new plan applies once confirmed.
 const salons=e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n;
 const r2=await call(e,'/api/panel/renew',{plan:'pro'},{cookie:ctx.cookie});
 assert.equal(r2.status,200,JSON.stringify(r2));assert.equal(r2.data.same_key,true);assert.equal(r2.data.access_key,'','no new key is minted');
 const conf=await call(e,'/api/owner/orders/'+r2.data.id+'/confirm',{},OWNER);assert.equal(conf.status,200,JSON.stringify(conf));
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,salons,'no second salon');
 d=await me();assert.equal(d.plan,'حرفه‌ای','the same panel session now shows the 3-month plan');assert.ok(d.features.includes('booking'));
 assert.ok(d.setup.steps.some(x=>x.key==='telegram'),'and still asks for the bot');
});

test('customer page offers only the service the salon bought (hair = hairstyle + colour)',async()=>{
 const e=fixture();
 const o=await call(e,'/api/order',orderBody('essential',{phone:'09125550009',salon:'Nail Bar',service:'nails'}));
 await call(e,'/api/owner/orders/'+o.data.id+'/confirm',{},OWNER);
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug;
 const pub=await call(e,'/api/s/'+slug+'/public');assert.deepEqual(pub.data.lines,['nails']);
 const hair=await planSalon(e,'pro','09125550010');
 e.DB.sql.prepare("UPDATE salons SET settings=json_remove(json_set(settings,'$.service','hair'),'$.lines') WHERE slug=?").run(hair.slug);
 assert.deepEqual((await call(e,'/api/s/'+hair.slug+'/public')).data.lines,['hair','color']);
 // the server refuses a line the salon does not offer
 const s={slug},g=await guest(e,s);
 const gen=await call(e,'/api/s/'+slug+'/generate',{line:'hair',idem:'00000000-0000-4000-8000-000000000000'},g);
 assert.equal(gen.status,403,JSON.stringify(gen));assert.match(gen.data.error,/فقط «ناخن»/);
 e.DB.sql.prepare("UPDATE salons SET settings='{\"service\":\"nails\"}' WHERE slug=?").run(hair.slug);
 const legacy=await call(e,'/api/s/'+hair.slug+'/public');assert.equal(legacy.status,200);assert.equal(legacy.data.lines,null,'a salon without a plan keeps every line');
});

test('/hair: the mirror and the photo try-on are one block with two tabs; one support number everywhere',async()=>{
 const hair=servicePages.hair;
 assert.match(hair,/id="trySwitch" role="tablist"[\s\S]{0,400}data-try="play"[\s\S]{0,200}data-try="demo"/,'two tabs, the mirror first');
 assert.ok(hair.indexOf('id="trySwitch"')<hair.indexOf('<section id="play"'),'the tab bar sits above both');
 for(const k of ['color','nails','lashes'])assert.doesNotMatch(servicePages[k],/id="trySwitch"/,k+' has one try section, no tabs');
 const {SUPPORT_TEL}=await import('../worker/support.js');
 for(const html of [landingHTML,...Object.values(servicePages)])assert.deepEqual([...new Set([...html.matchAll(/tel:(\d+)/g)].map(m=>m[1]))],[SUPPORT_TEL]);
 assert.ok(panelHTML.includes(JSON.stringify(SUPPORT_TEL)),'the panel gate offers the same number for a lost key');
});

test('migration 0017: salons made before the fix lose the copied buyer mobile and name, nothing else',async()=>{
 const e=fixture();
 const a=await planSalon(e,'essential','09125550101'),b=await planSalon(e,'essential','09125550102');
 // Recreate the old provisioning: the buyer's mobile and name copied onto the public profile.
 const old=(slug,phone)=>e.DB.sql.prepare("UPDATE salons SET profile=json_object('manager','سارا محمدی','phone',?,'address','تهران') WHERE slug=?").run(phone,slug);
 old(a.slug,'09125550101');old(b.slug,'09129998877'); // b later wrote its own page phone
 e.DB.sql.prepare("INSERT INTO salons(id,slug,owner_id,name,profile,settings,created_at) VALUES('legacy-1','legacy-one','owner-x','قدیمی',json_object('manager','سارا محمدی','phone','09125550101'),'{}',1)").run();
 e.DB.sql.exec(readFileSync(new URL('../drizzle/0017_buyer_contact_cleanup.sql',import.meta.url),'utf8'));
 const prof=slug=>JSON.parse(e.DB.sql.prepare('SELECT profile FROM salons WHERE slug=?').get(slug).profile);
 assert.deepEqual(prof(a.slug),{address:'تهران'},'copied mobile and name removed, the rest kept');
 assert.equal(prof(b.slug).phone,'09129998877','a phone the salon wrote itself is kept');
 assert.equal(prof(b.slug).manager,undefined);
 assert.deepEqual(prof('legacy-one'),{manager:'سارا محمدی',phone:'09125550101'},'a salon not made by the checkout is untouched');
 assert.doesNotMatch(JSON.stringify((await call(e,'/api/s/'+a.slug+'/public')).data),/9125550101|سارا محمدی/,'nothing of the buyer on the public page');
});

test('quota message on a paid hair salon names only its own services (no nails or lashes)',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const {applyPlan}=await import('../worker/credits.js');
 const id=e.DB.sql.prepare("SELECT id FROM salons WHERE slug='salon-a'").get().id;
 await applyPlan(e.DB,id,{key:'pro',months:3,credits:75},null);
 e.DB.sql.prepare("UPDATE salons SET settings=json_set(settings,'$.service','hair') WHERE id=?").run(id);
 const previous=globalThis.fetch;
 globalThis.fetch=async(url)=>{if(String(url).includes('file-base64-upload'))return Response.json({success:true,data:{downloadUrl:'https://provider.example/'+crypto.randomUUID()+'.jpg'}});if(String(url).includes('createTask'))return Response.json({code:200,data:{taskId:'t'+crypto.randomUUID()}});return previous(url)};
 try{
  const v='cd'.repeat(16),original=await upload(e,s,g);
  const gen=()=>call(e,'/api/s/salon-a/generate',{v,image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:original,style:0},g);
  for(let i=0;i<3;i++)assert.equal((await gen()).status,200);
  const fourth=await gen();assert.equal(fourth.status,429);
  assert.match(fourth.data.error,/برای تو تمام شد[\s\S]*«رنگ مو»/);
  assert.doesNotMatch(fourth.data.error,/ناخن|مژه/,'a hair salon never suggests nails or lashes');
 }finally{globalThis.fetch=previous}
});

test('a build whose photo is gone from storage stops with a plain message before any quota, credit or provider call',async()=>{
 const e=fixture(),s=await salon(e),g=await guest(e,s);e.KIE_API_KEY='mock';await call(e,'/api/s/salon-a/owner/settings',{generation_enabled:true,reference_verified:true},OWNER);
 const previous=globalThis.fetch;let calls=0;globalThis.fetch=async u=>{calls++;return previous(u)};
 try{
  const original=await upload(e,s,g);
  const key=e.DB.sql.prepare('SELECT object_key FROM media WHERE id=?').get(original).object_key;await e.BUCKET.delete(key);
  const r=await call(e,'/api/s/salon-a/generate',{v:'ef'.repeat(16),image_consent:true,idem:crypto.randomUUID(),line:'hair',original_id:original,style:0},g);
  assert.equal(r.status,410,JSON.stringify(r));assert.match(r.data.error,/در دسترس نیست/);
  assert.equal(calls,0,'no provider call');assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM generations').get().n,0,'nothing counted');
 }finally{globalThis.fetch=previous}
});

/* =====================================================================
   Plans per service, «پنل آرایشگاه» with users, the bot on every paid plan.
   ========================================================================== */
import {orderTotal, orderUsers} from '../worker/orders.js';
import {createStaff, seatRoom} from '../worker/referral.js';
import {linesOf, seatsOf} from '../worker/plans.js';
const salonRow=(e,slug)=>e.DB.sql.prepare('SELECT * FROM salons WHERE slug=?').get(slug);
const settingsOfSlug=(e,slug)=>JSON.parse(salonRow(e,slug).settings);

test('«پنل آرایشگاه» pricing: base + users beyond 3 × the per-user rate for the whole period, computed on the server only',async()=>{
 // the sheet: 5M / 10M / 15M for 3 users; extra users 2M / 1.5M / 1M each for the whole period
 for(const [k,base,rate] of [['salon1',5000000,2000000],['salon3',10000000,1500000],['salon6',15000000,1000000]]){
  assert.equal(orderTotal(k,3),base,k+' with 3 users');
  assert.equal(orderTotal(k,4),base+rate,k+' with 4 users');
  assert.equal(orderTotal(k,10),base+7*rate,k+' with 10 users');
 }
 for(const [k,amount] of [['essential',2900000],['pro',6000000],['signature',10000000]])assert.equal(orderTotal(k,orderUsers(k,9)),amount,k+' is not priced per user');
 assert.equal(orderUsers('salon1'),3,'3 users when none is sent');assert.equal(orderUsers('salon1',1),3,'never below the included 3');
 assert.equal(orderUsers('salon1','۵'),5,'Persian digits');assert.throws(()=>orderUsers('salon1','abc'));assert.throws(()=>orderUsers('salon1',51));
 const e=fixture();
 const o=await call(e,'/api/order',orderBody('salon3',{users:5,amount:1}));
 assert.equal(o.status,200,JSON.stringify(o));
 assert.equal(o.data.amount,13000000,'10M + 2 × 1.5M, the sent amount is ignored');
 assert.equal(o.data.users,5);assert.equal(o.data.extra_users,2);assert.equal(o.data.seat_amount,1500000);
 assert.equal(o.data.service,'all','the salon plan is every service, whatever page it came from');
 const row=e.DB.sql.prepare('SELECT users,credits,amount FROM orders WHERE id=?').get(o.data.id);
 assert.deepEqual([row.users,row.credits,row.amount],[5,150,130000000],'users, gift images and rials ride on the order');
 assert.equal((await call(e,'/api/order',orderBody('salon1',{users:'x',phone:'09125550300'}))).status,400,'a bad user count is refused');
 // a coupon discounts the whole total, users included
 e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('pay_coupons','{\"HALF\":{\"percent\":50}}',?)").run(Date.now());
 const c=await call(e,'/api/order/'+o.data.id+'/coupon',{coupon:'HALF'});
 assert.equal(c.status,200,JSON.stringify(c));assert.equal(c.data.amount,6500000);assert.equal(c.data.discount,6500000);
});

test('«پنل آرایشگاه» confirmed: every service, the tier\'s features, the paid users on the plan; the team cap holds in the console and the bot',async()=>{
 const e=tgEnv(fixture());const tg=mockTelegram();try{
 const o=await call(e,'/api/order',orderBody('salon1',{users:4,phone:'09125550400',salon:'Big Salon'}));
 assert.equal(o.data.amount,7000000);
 await call(e,'/api/owner/orders/'+o.data.id+'/confirm',{},OWNER);
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug;
 const st=settingsOfSlug(e,slug);
 assert.equal(st.plan.key,'salon1');assert.equal(st.plan.seats,4,'3 included + 1 paid');assert.equal(st.service,'all');
 assert.equal((await call(e,'/api/s/'+slug+'/public')).data.lines,null,'all four lines on the customer page');
 const s=salonRow(e,slug);assert.equal(seatsOf(s),4);
 assert.ok(can(s,'bot'));assert.equal(can(s,'booking'),false,'1-month salon plan opens the ESSENTIAL features');
 assert.equal(e.DB.sql.prepare("SELECT SUM(delta) n FROM credit_ledger").get().n,40,'gift images: 2 × ESSENTIAL');
 // the panel shows the users and offers only salon plans
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});
 const d=await (await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:login.cookie}}),e)).json();
 assert.deepEqual(d.seats,{cap:4,used:1});assert.deepEqual(d.plans.map(p=>p.key),['salon1','salon3','salon6']);
 // 4 users = the manager + 3 members; the 4th member is refused in plain Persian
 for(const n of ['مریم','سارا','نگار'])assert.equal((await call(e,'/api/s/'+slug+'/owner/team',{name:n,specialty:'کوتاهی'},OWNER)).status,200,n);
 const full=await call(e,'/api/s/'+slug+'/owner/team',{name:'لیلا',specialty:'ناخن'},OWNER);
 assert.equal(full.status,409);assert.match(full.data.error,/پلن شما برای ۴ کاربر است \(با خود مدیر\)/);
 assert.deepEqual(await seatRoom(e.DB,salonRow(e,slug)),{cap:4,used:4,left:0});
 // the manager's own member row is the manager's seat: never refused
 const me=await createStaff(e.DB,salonRow(e,slug),'مدیر','مدیر سالن',{manager:true});assert.ok(me.id);
 // the bot says the same when the manager taps «افزودن نیرو»
 await linkSalon(e,{slug},777);
 const before=tg.calls.length;
 await hook(e,{callback_query:{id:'a',data:'tm:add',message:{chat:{id:777},message_id:3}}});
 assert.ok(tg.calls.slice(before).some(c=>/پلن شما برای ۴ کاربر است/.test(c.body.text||'')),'the manager is told why');
 assert.equal(JSON.parse(e.DB.sql.prepare('SELECT bot_state FROM salons WHERE slug=?').get(slug).bot_state||'{}').team,undefined,'no name question is asked');
 // a removed member frees a seat
 const maryam=e.DB.sql.prepare("SELECT id FROM team WHERE name='مریم'").get().id;
 await call(e,'/api/s/'+slug+'/owner/team/remove',{id:maryam},OWNER);
 assert.equal((await call(e,'/api/s/'+slug+'/owner/team',{name:'لیلا',specialty:'ناخن'},OWNER)).status,200,'room again after a removal');
 // single-service plans have no user cap
 const solo=await planSalon(e,'essential','09125550401');
 for(let i=0;i<5;i++)await createStaff(e.DB,salonRow(e,solo.slug),'نیرو '+i,'');
 assert.equal(await seatRoom(e.DB,salonRow(e,solo.slug)),null);
 }finally{tg.restore()}
});

test('renewal: a single-service salon upgrades to «پنل آرایشگاه» with users; a salon on it cannot drop to one service from the panel',async()=>{
 const e=fixture();
 const o=await call(e,'/api/order',orderBody('essential',{phone:'09125550500',service:'nails',salon:'Nail Bar'}));
 await call(e,'/api/owner/orders/'+o.data.id+'/confirm',{},OWNER);
 const login=await call(e,'/api/panel/login',{key:o.data.access_key}),ctx={cookie:login.cookie};
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug;
 assert.deepEqual((await call(e,'/api/s/'+slug+'/public')).data.lines,['nails']);
 const up=await call(e,'/api/panel/renew',{plan:'salon6',users:6},ctx);
 assert.equal(up.status,200,JSON.stringify(up));assert.equal(up.data.amount,18000000,'15M + 3 × 1M');assert.equal(up.data.service,'all');
 await call(e,'/api/owner/orders/'+up.data.id+'/confirm',{},OWNER);
 const st=settingsOfSlug(e,slug);assert.equal(st.plan.key,'salon6');assert.equal(st.plan.seats,6);
 assert.equal((await call(e,'/api/s/'+slug+'/public')).data.lines,null,'now every service');
 const down=await call(e,'/api/panel/renew',{plan:'pro'},ctx);
 assert.equal(down.status,409);assert.match(down.data.error,/پشتیبانی آینه/);
 const again=await call(e,'/api/panel/renew',{plan:'salon3'},ctx);
 assert.equal(again.status,200);assert.equal(again.data.users,6,'renewing keeps the paid users by default');assert.equal(again.data.amount,10000000+3*1500000);
});

test('four services: hairstyle and hair colour are sold apart; a salon that bought «مدل و رنگ مو» before the split keeps both',async()=>{
 const e=fixture();
 const bought=async(service,phone)=>{const o=await call(e,'/api/order',orderBody('pro',{phone,service,salon:'S '+service}));assert.equal(o.data.service,service);await call(e,'/api/owner/orders/'+o.data.id+'/confirm',{},OWNER);return e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug};
 for(const [service,phone] of [['hair','09125550601'],['color','09125550602'],['nails','09125550603'],['lashes','09125550604']]){
  const slug=await bought(service,phone);
  assert.deepEqual((await call(e,'/api/s/'+slug+'/public')).data.lines,[service],service+' only');
  assert.deepEqual(settingsOfSlug(e,slug).lines,[service]);
 }
 // a request names one of the salon's lines; a single-service salon's own line when none is sent
 const colorSlug=e.DB.sql.prepare("SELECT slug FROM salons WHERE name='S color'").get().slug;
 const s={slug:colorSlug},g=await guest(e,s);const original=await upload(e,s,g);
 assert.equal((await call(e,'/api/s/'+colorSlug+'/leads',lead(original,{line:'nails'}),g)).status,403,'not a service this salon offers');
 const ok=await call(e,'/api/s/'+colorSlug+'/leads',lead(original,{line:undefined}),g);assert.equal(ok.status,200,JSON.stringify(ok));
 assert.equal(e.DB.sql.prepare('SELECT line FROM leads WHERE id=?').get(ok.data.id).line,'color');
 // legacy: settings.service 'hair' without settings.lines = hairstyle + colour, before and after migration 0018
 const old=salonRow(e,e.DB.sql.prepare("SELECT slug FROM salons WHERE name='S hair'").get().slug);
 const legacy=JSON.parse(old.settings);delete legacy.lines;legacy.service='hair';
 e.DB.sql.prepare('UPDATE salons SET settings=? WHERE id=?').run(JSON.stringify(legacy),old.id);
 assert.deepEqual(linesOf(salonRow(e,old.slug)),['hair','color'],'the code fallback');
 e.DB.sql.exec(readFileSync(new URL('../drizzle/0018_services_seats.sql',import.meta.url),'utf8').split('--> statement-breakpoint')[1]);
 assert.deepEqual(settingsOfSlug(e,old.slug).lines,['hair','color'],'the migration writes it out');
 assert.deepEqual(settingsOfSlug(e,colorSlug).lines,['color'],'and leaves a new salon alone');
 // renewing the legacy salon keeps both
 const {applyPlan}=await import('../worker/credits.js');
 const renewal=e.DB.sql.prepare("SELECT id FROM orders WHERE salon_id=?").get(old.id).id;
 e.DB.sql.prepare("UPDATE salons SET settings=json_remove(settings,'$.lines') WHERE id=?").run(old.id);
 await applyPlan(e.DB,old.id,{key:'pro',months:3,credits:0},renewal);
 assert.deepEqual(linesOf(salonRow(e,old.slug)),['hair','color'],'a renewal does not narrow an old salon');
 assert.equal(e.DB.sql.prepare("SELECT COUNT(*) n FROM pragma_table_info('orders') WHERE name='users'").get().n,1,'orders carry a user count');
});

test('every paid plan has the bot: an ESSENTIAL salon that links it gets requests there, nails and lashes like hairstyle; until then /panel',async()=>{
 const e=tgEnv(fixture());const tg=mockTelegram();try{
 const ctx=await planSalon(e,'essential');const s={slug:ctx.slug};
 assert.equal(panelInbox(salonRow(e,ctx.slug)),true,'not linked yet: requests wait in /panel');
 const link=await panel(e,ctx,'bot-link',{});assert.equal(link.status,200,JSON.stringify(link));
 const code=link.data.links.telegram.split('start=')[1];
 await hook(e,{message:{chat:{id:888,type:'private'},text:'/start '+code}});
 await hook(e,{message:{chat:{id:888,type:'private'},text:'/stop'}});
 assert.equal(salonRow(e,ctx.slug).telegram_chat_id,'888');assert.equal(panelInbox(salonRow(e,ctx.slug)),false);
 const g=await guest(e,s);const original=await upload(e,s,g);
 const sent=await call(e,'/api/s/'+ctx.slug+'/leads',lead(original),g);assert.equal(sent.status,200,JSON.stringify(sent));
 assert.equal(e.DB.sql.prepare('SELECT status FROM leads WHERE id=?').get(sent.data.id).status,'sent','delivered by the bot, not parked in /panel');
 assert.ok(sentTo(tg,888).some(c=>/درخواست تازه/.test(c.body.text||'')&&/سارا محمدی/.test(c.body.text||'')));
 }finally{tg.restore()}
});

test('nails and lashes requests are recorded and delivered like hairstyle ones: the line, the bot message, the member who owns her',async()=>{
 const e=tgEnv(fixture()),s=await salon(e);const tg=mockTelegram();try{
 await linkSalon(e,s,777);const maryam=await addMember(e,s,'مریم',4001);
 const cases=[['hair','مدل مو',{color:''}],['color','رنگ مو',{color:'بالیاژ عسلی'}],['nails','ناخن',{look:'فرنچ',color:'نود'}],['lashes','مژه',{look:'کلاسیک',color:''}]];
 for(const [i,[line,label,extra]] of cases.entries()){
  const g=await guest(e,s);const before=sentTo(tg,777).length;
  const d=await sendLead(e,s,g,{line,v:V(i+1),phone:'0912000010'+i,name:'مشتری '+label,...extra});
  assert.equal(d.delivered,true,line+' delivered');
  assert.equal(e.DB.sql.prepare('SELECT line FROM leads WHERE id=?').get(d.id).line,line,line+' recorded');
  const msg=sentTo(tg,777).slice(before).find(c=>c.method==='sendMessage'&&/درخواست تازه/.test(c.body.text||''));
  assert.ok(msg,line+' reaches the manager');assert.match(msg.body.text,new RegExp('خدمت:</b> '+label));
  assert.ok(msg.body.reply_markup.inline_keyboard.flat().some(b=>/^ls:called:/.test(b.callback_data)),line+' carries the status buttons');
  if(line==='lashes')assert.doesNotMatch(msg.body.text,/همان رنگ فعلی/,'no hair-colour default on a lashes request');
  if(line==='hair')assert.match(msg.body.text,/همان رنگ فعلی/);
 }
 // a member's nails and lashes customers go only to her
 for(const [n,line] of [[7,'nails'],[8,'lashes']]){
  await visit(e,s,V(n),maryam.ref.split('r=')[1]);
  const g=await guest(e,s),mgr=sentTo(tg,777).length;
  const d=await sendLead(e,s,g,{line,v:V(n),phone:'0912000020'+n,name:'مشتری مریم '+n});
  assert.equal(e.DB.sql.prepare('SELECT staff_id,line FROM leads WHERE id=?').get(d.id).staff_id,maryam.id);
  assert.ok(sentTo(tg,4001).some(c=>(c.body.text||'').includes('مشتری مریم '+n)),line+' reaches Maryam');
  assert.ok(!sentTo(tg,777).slice(mgr).some(c=>(c.body.text||'').includes('مشتری مریم '+n)),line+' never reaches the manager');
 }
 }finally{tg.restore()}
});

/* ---------- automatic payment: the webhook alone confirms (no receipt, no manager approval) ---------- */
async function hookKey(e){return (await call(e,'/api/owner/payment',undefined,OWNER)).data.webhook.key}
const payHook=(e,key,body)=>app.fetch(new Request(origin+'/api/pay/confirm',{method:'POST',headers:{'content-type':'application/json',authorization:'Bearer '+key},body:JSON.stringify(body)}),e);
const warnings=e=>e.DB.sql.prepare("SELECT text FROM activity WHERE level='warn' AND kind='order'").all().map(x=>x.text);

test('pay webhook happy path: the payment site\'s call alone opens the salon, its credits and the panel the customer\'s key logs into',async()=>{
 const e=fixture();const key=await hookKey(e);
 const o=await call(e,'/api/order',orderBody('pro',{service:'hair'}));
 assert.equal(o.data.summary.title,'مدل مو');assert.equal(o.data.summary.months,3,'the order line reads «پلن مدل مو · ۳ ماهه»');
 const res=await payHook(e,key,{ref:o.data.ref.toLowerCase(),status:'paid',amount:o.data.amount});
 const body=await res.json();
 assert.equal(res.status,200,JSON.stringify(body));assert.equal(body.status,'paid');assert.match(body.page,/\/s\//);
 const row=e.DB.sql.prepare('SELECT status,confirmed_by,salon_id FROM orders WHERE id=?').get(o.data.id);
 assert.equal(row.status,'paid');assert.equal(row.confirmed_by,'webhook','no owner click involved');
 // the page polling the order sees it paid, with the panel address, and never the key again
 const seen=(await call(e,'/api/order/'+o.data.id)).data;
 assert.equal(seen.status,'paid');assert.match(seen.panel_url,/\/panel$/);assert.equal(seen.access_key,'');
 // the key handed out when the order opened now logs in, and the plan clock started at confirmation
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});assert.equal(login.status,200);
 const d=await (await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:login.cookie}}),e)).json();
 assert.equal(d.credits.granted,75);assert.equal(d.credits.days_left,90);
 assert.equal(d.checklist.total,4);assert.deepEqual(d.checklist.items.map(i=>i.key),['portfolio','bot','try','share']);
 assert.ok(d.checklist.started_at>=row.confirmed_at||d.checklist.started_at>0,'the start date comes from the server');
 assert.equal(d.checklist.until,d.credits.until,'the end date is the plan\'s');
});

test('pay webhook is idempotent: a repeated or simultaneous call makes one salon and grants once (plan, renewal and top-up)',async()=>{
 const e=fixture();const key=await hookKey(e);
 const o=await call(e,'/api/order',orderBody('signature'));
 const [a,b]=await Promise.all([payHook(e,key,{ref:o.data.ref,status:'paid',amount:o.data.amount}),payHook(e,key,{ref:o.data.ref,status:'paid',amount:o.data.amount})]);
 assert.equal(a.status,200);assert.equal(b.status,200);
 assert.equal((await payHook(e,key,{ref:o.data.ref,status:'paid'})).status,200,'a late retry is still a 200');
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,1,'one salon');
 assert.equal(e.DB.sql.prepare('SELECT COALESCE(SUM(delta),0) n FROM credit_ledger').get().n,180,'granted once');
 // a renewal from the panel, paid twice by the payment site, extends once
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});
 const until0=JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons').get().settings).plan.until;
 const ren=await call(e,'/api/panel/renew',{plan:'essential'},{cookie:login.cookie});assert.equal(ren.status,200,JSON.stringify(ren));
 for(let i=0;i<3;i++)assert.equal((await payHook(e,key,{ref:ren.data.ref,status:'paid',amount:ren.data.amount})).status,200);
 const until1=JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons').get().settings).plan.until;
 assert.equal(until1-until0,30*86400000,'one month added once');
 assert.equal(e.DB.sql.prepare('SELECT COALESCE(SUM(delta),0) n FROM credit_ledger').get().n,200,'180 + 20, not + 60');
 // a top-up, paid twice
 const top=await call(e,'/api/panel/topup',{packs:1},{cookie:login.cookie});
 await payHook(e,key,{ref:top.data.ref,status:'paid',amount:200000});await payHook(e,key,{ref:top.data.ref,status:'paid',amount:200000});
 assert.equal(e.DB.sql.prepare('SELECT COALESCE(SUM(delta),0) n FROM credit_ledger').get().n,210);
});

test('pay webhook: a wrong amount or an unknown order opens nothing and tells the owner',async()=>{
 const e=fixture();const key=await hookKey(e);
 const o=await call(e,'/api/order',orderBody('essential'));
 const short=await payHook(e,key,{ref:o.data.ref,status:'paid',amount:o.data.amount-1000});
 assert.equal(short.status,409);
 assert.equal((await call(e,'/api/order/'+o.data.id)).data.status,'open','still waiting for the right amount');
 assert.ok(warnings(e).some(t=>t.includes(o.data.ref)),'the owner hears the code that did not match');
 assert.equal((await payHook(e,key,{ref:'AYZZZZZZ',status:'paid',amount:1})).status,404);
 assert.equal((await payHook(e,key,{order:'00000000-0000-4000-8000-000000000000',status:'paid'})).status,404);
 assert.equal((await payHook(e,key,{status:'paid'})).status,404,'no code at all');
 assert.ok(warnings(e).some(t=>t.includes('ناشناس')),'an unknown payment is reported');
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,0);
 assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM credit_ledger').get().n,0);
 // a coupon is spent only when the money is in
 e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('pay_coupons','{\"ONE\":{\"percent\":10,\"max\":1}}',?)").run(Date.now());
 const c=await call(e,'/api/order/'+o.data.id+'/coupon',{coupon:'ONE'});assert.equal(c.data.amount,2610000);
 assert.equal((await payHook(e,key,{ref:o.data.ref,status:'paid',amount:2610000})).status,200);
 assert.equal(JSON.parse(e.DB.sql.prepare("SELECT value FROM app_settings WHERE key='pay_coupons'").get().value).ONE.used,1);
});

test('pay webhook after the 10 minutes: confirmed when the reported amount proves the payment; never without it, never for a cancelled order',async()=>{
 const e=fixture();const key=await hookKey(e);
 const late=await call(e,'/api/order',orderBody('essential',{phone:'09120000011'}));
 e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now()-60000,late.data.id);
 assert.equal((await call(e,'/api/order/'+late.data.id)).data.status,'expired');
 const bare=await payHook(e,key,{ref:late.data.ref,status:'paid'});
 assert.equal(bare.status,409,'no amount, no proof: the clock wins');
 assert.ok(warnings(e).some(t=>t.includes(late.data.ref)),'and the owner is told to look');
 const proven=await payHook(e,key,{ref:late.data.ref,status:'paid',amount:late.data.amount});
 assert.equal(proven.status,200);assert.equal((await proven.json()).status,'paid');
 assert.equal((await call(e,'/api/panel/login',{key:late.data.access_key})).status,200,'the late payer gets the panel too');
 // the owner's console still cannot confirm an expired order without reopening it
 const x=await call(e,'/api/order',orderBody('essential',{phone:'09120000012'}));
 e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now()-1,x.data.id);
 assert.equal((await call(e,'/api/owner/orders/'+x.data.id+'/confirm',{},OWNER)).status,409);
 // an order replaced by a newer one from the same buyer: a transfer already made to it is not lost.
 // With the exact amount it is confirmed (and the owner is told); without the amount it is not.
 const first=await call(e,'/api/order',orderBody('essential',{phone:'09120000013'}));
 const second=await call(e,'/api/order',orderBody('pro',{phone:'09120000013'}));
 assert.equal((await call(e,'/api/order/'+first.data.id)).data.status,'cancelled');
 assert.equal(e.DB.sql.prepare('SELECT replaced_by FROM orders WHERE id=?').get(first.data.id).replaced_by,second.data.id);
 assert.equal((await payHook(e,key,{ref:first.data.ref,status:'paid'})).status,409,'no amount, no proof');
 const wrong=await payHook(e,key,{ref:first.data.ref,status:'paid',amount:first.data.amount+1});assert.equal(wrong.status,409,'a wrong amount opens nothing');
 const ok=await payHook(e,key,{ref:first.data.ref,status:'paid',amount:first.data.amount});assert.equal(ok.status,200,'the money in flight is honoured');
 assert.equal((await call(e,'/api/panel/login',{key:first.data.access_key})).status,200);
 assert.ok(e.DB.sql.prepare("SELECT text FROM activity WHERE kind='order'").all().some(x=>x.text.includes(first.data.ref)&&x.text.includes('دیر رسید')),'the owner hears about it');
 // ...but not when the order that replaced it was paid already: a second payment, the owner handles it
 const a=await call(e,'/api/order',orderBody('essential',{phone:'09120000014'}));
 const b=await call(e,'/api/order',orderBody('essential',{phone:'09120000014'}));
 assert.equal((await payHook(e,key,{ref:b.data.ref,status:'paid',amount:b.data.amount})).status,200);
 assert.equal((await payHook(e,key,{ref:a.data.ref,status:'paid',amount:a.data.amount})).status,409);
 assert.ok(warnings(e).some(t=>t.includes(a.data.ref)),'the double payment is flagged');
 assert.equal(e.DB.sql.prepare("SELECT COUNT(*) n FROM credit_ledger WHERE order_id=?").get(a.data.id).n,0,'nothing granted twice');
 // an order the owner cancelled never opens by itself
 const c=await call(e,'/api/order',orderBody('essential',{phone:'09120000015'}));
 await call(e,'/api/owner/orders/'+c.data.id+'/cancel',{},OWNER);
 assert.equal((await call(e,'/api/order/'+c.data.id)).data.status,'cancelled');
 assert.equal((await payHook(e,key,{ref:c.data.ref,status:'paid',amount:c.data.amount})).status,409);
 assert.ok(warnings(e).some(t=>t.includes(c.data.ref)));
});

test('end of credit: the panel stays open with its data, generation stops, and the panel says renew; a soft warning comes 7 days before',async()=>{
 const e=fixture();
 const ctx=await planSalon(e,'essential');
 const me=async()=>(await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:ctx.cookie}}),e)).json();
 await call(e,'/api/panel/portfolio?title='+encodeURIComponent('بالیاژ')+'&line=color',png(),{cookie:ctx.cookie});
 const set=until=>{const r=e.DB.sql.prepare('SELECT id,settings FROM salons WHERE slug=?').get(ctx.slug);const st=JSON.parse(r.settings);st.plan.until=until;e.DB.sql.prepare('UPDATE salons SET settings=? WHERE id=?').run(JSON.stringify(st),r.id)};
 set(Date.now()+5*86400000);
 let d=await me();assert.equal(d.credits.expired,false);assert.ok(d.credits.days_left<=7,'inside the warning window');
 set(Date.now()-1000);
 d=await me();
 assert.ok(d.salon,'the panel still opens');assert.equal(d.credits.expired,true);
 assert.equal(d.portfolio.length,1,'portfolio kept');
 assert.equal((await panel(e,ctx,'requests')).status,200,'requests (customers) still readable');
 assert.equal((await call(e,'/api/s/'+ctx.slug+'/public')).status,200,'the public page stays up');
 // the copy the owner approved, and the renew button, ship in the panel
 assert.match(panelHTML,/اعتبار پنل تمام شد\. نمونه‌سازی متوقف شده\. برای ادامه تمدید کنید\./);
 assert.match(panelHTML,/اعتبار پنل نزدیک به پایان است\./);
 assert.match(panelHTML,/'تمدید پنل'/);
 assert.match(panelHTML,/days_left<=7/,'the existing 7-day rule drives the warning');
 // renewing from the panel after the end still works
 const r=await call(e,'/api/panel/renew',{plan:'essential'},{cookie:ctx.cookie});assert.equal(r.status,200);
});

test('renewal extends from the later of now and the previous end',async()=>{
 const e=fixture(),s=await salon(e);
 const {applyPlan,MONTH}=await import('../worker/credits.js');
 const id=e.DB.sql.prepare("SELECT id FROM salons WHERE slug='salon-a'").get().id;
 const plan=()=>JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons WHERE id=?').get(id).settings).plan;
 const t0=Date.now();await applyPlan(e.DB,id,{key:'essential',months:1,credits:20},null);
 const first=plan();assert.ok(first.until>=t0+MONTH&&first.until<=Date.now()+MONTH);
 // still running: the new months stack on the current end
 await applyPlan(e.DB,id,{key:'pro',months:3,credits:75},null);
 assert.equal(plan().until,first.until+3*MONTH,'from the previous end, not from now');assert.equal(plan().start,first.start,'the start stays');
 // already over: the new months start now
 const st=JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons WHERE id=?').get(id).settings);st.plan.until=Date.now()-10*86400000;
 e.DB.sql.prepare('UPDATE salons SET settings=? WHERE id=?').run(JSON.stringify(st),id);
 const t1=Date.now();await applyPlan(e.DB,id,{key:'essential',months:1,credits:20},null);
 assert.ok(plan().until>=t1+MONTH&&plan().until<=Date.now()+MONTH,'from now, the lost days are not back-dated');
});

test('«پنل شما باز شد» checklist: four steps tick themselves or by hand; only known steps; dates from the server',async()=>{
 const e=fixture();
 const ctx=await planSalon(e,'pro');
 const me=async()=>(await app.fetch(new Request(origin+'/api/panel/me',{headers:{cookie:ctx.cookie}}),e)).json();
 let d=await me();
 assert.deepEqual(d.checklist.items.map(i=>i.label),['نمونه‌های کارتان را اضافه کنید','ربات تلگرام یا بله را وصل کنید','نمونه‌ای بسازید و نتیجه را ببینید','لینک خودتان را به مشتریان بدهید']);
 assert.equal(d.checklist.done,0);assert.ok(d.checklist.started_at>0&&d.checklist.until>d.checklist.started_at);
 await call(e,'/api/panel/portfolio?title=x&line=hair',png(),{cookie:ctx.cookie});
 d=await me();assert.ok(d.checklist.items[0].done&&d.checklist.items[0].auto,'adding a portfolio photo ticks step 1');
 const tick=(key,done)=>app.fetch(new Request(origin+'/api/panel/checklist',{method:'POST',headers:{'content-type':'application/json',origin,cookie:ctx.cookie},body:JSON.stringify({key,done})}),e);
 assert.equal((await tick('share',true)).status,200);
 d=await me();assert.ok(d.checklist.items[3].done,'ticked by hand');assert.equal(d.checklist.done,2);
 assert.equal((await tick('share',false)).status,200);
 d=await me();assert.equal(d.checklist.items[3].done,false,'and unticked');
 assert.equal((await tick('nonsense',true)).status,400);
 assert.equal((await call(e,'/api/panel/checklist',{key:'share'})).status,401,'only the salon itself');
 // the page copy
 for(const t of ['پنل شما باز شد.','چهار کار تا اولین مشتری','اعتبار پنل از امروز شروع شد.'])assert.ok(panelHTML.includes(t),t);
 assert.doesNotMatch(panelHTML,/استوری/,'no story template is promised');
});

test('pay page: the owner\'s final copy, no receipt or manager step anywhere, the one support number, a late payment still watched',()=>{
 for(const k of ['hair','nails','lashes']){
  const html=servicePages[k];
  for(const t of ['مبلغ را به کارت زیر واریز کنید.','۱۰ دقیقه مهلت دارید.','پرداخت شما خودکار تأیید می‌شود.','پرداخت تأیید شد. پنل شما باز شد.','اعتبار از لحظهٔ باز شدن پنل شروع می‌شود. تمدید خودکار ندارد.','اگر بعد از واریز تأیید نشد، به ما پیام بدهید'])
   assert.ok(html.includes(t),k+': '+t);
  assert.doesNotMatch(html,/id="payReceipt"|رسید را|پرداخت کردم|شمارهٔ پیگیری بانک|در انتظار تأیید|بررسی واریز/,k+': no receipt and no manual review');
  assert.match(html,/id="paySummary"/,k+': the order line');
 }
 assert.doesNotMatch(payJS,/\/receipt|payReceipt|payWait/,'the checkout never posts a receipt');
 assert.match(payJS,/'پلن ' \+ title \+ '\\u200f · ' \+ fa\(s\.months\) \+ ' ماهه'/,'«پلن … · ۳ ماهه», bidi-safe');
 assert.match(payJS,/s\.users > 1/,'a multi-user plan shows its user count');
 assert.match(payJS,/Date\.now\(\) - Number\(order\.expires_at \|\| 0\) < LATE/,'an expired order keeps being polled for a late webhook');
});

/* ---------- integration gaps: pricing tabs, checkout per service, honest copy, sample links ---------- */
import {SERVICE_TITLES} from '../worker/prices.js';
const mil=t=>String(t/1e6).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d]).replace('.','٫');
const panelOf=(html,key)=>(html.match(new RegExp('<div class="plans-panel"[^>]*data-plans-panel="'+key+'"[^>]*>[\\s\\S]*?</article></div></div>'))||[])[0]||'';
test('pricing tabs: five visible tabs, each service page opens its own, /salon-panel sells only the salon plans',()=>{
 for(const [k,own] of [['home','hair'],['hair','hair'],['color','color'],['nails','nails'],['lashes','lashes']]){
  const html=k==='home'?landingHTML:servicePages[k];
  assert.match(html,/<div class="ptabs" data-ptabs>/,k+': the tab row is visible');
  assert.match(html,new RegExp('id="ptab-'+own+'"[^>]*aria-selected="true"'),k+' opens the '+own+' tab');
  assert.equal((html.match(/aria-selected="true" tabindex="0"/g)||[]).length,1,k+': one selected tab');
  const single=panelOf(html,'hair color nails lashes');assert.ok(single,k+': the single-service panel');
  assert.doesNotMatch(single.slice(0,200),/ hidden>/,k+': the own panel is visible without a script');
  const buys=[...single.matchAll(/data-buy="(\w+)" data-service="(\w+)" data-title="([^"]+)" data-months="(\d)"/g)];
  assert.deepEqual(buys.map(m=>m[1]),['essential','pro','signature']);
  for(const m of buys){assert.equal(m[2],own,k+' sells '+own);assert.equal(m[3],SERVICE_TITLES[own]);assert.equal(Number(m[4]),PLANS[m[1]].months)}
  const salon=panelOf(html,'salon');assert.match(salon,/data-plans-panel="salon" hidden>/,k+': the salon tab waits behind its tab');
 }
 const s=servicePages.salon;
 assert.match(s,/<div class="ptabs" data-ptabs hidden>/,'one tab: no tab row');
 assert.doesNotMatch(s,/data-plans-panel="hair/,'no single-service cards on the salon page');
 const sp=panelOf(s,'salon');assert.ok(sp&&!/data-plans-panel="salon" hidden/.test(sp),'the salon cards are visible');
 assert.ok(sp.includes('به‌صرفه‌ترین برای ۲ نفر به بعد'),'the value badge');
 for(const k of ['salon1','salon3','salon6']){
  const p=PLANS[k],card=sp.match(new RegExp('<article class="plan[^"]*" data-plan="'+k+'">[\\s\\S]*?</article>'))[0];
  assert.ok(card.includes('<b>'+mil(p.amount)+'</b> میلیون تومان'),k+' price from the table');
  const each=Math.round(p.amount/p.seats/1e5)/10;
  assert.ok(card.includes('برای ۳ نفر: نفری '+(each*1e6*p.seats===p.amount?'':'حدود ')+mil(each*1e6)+' میلیون تومان'),k+' per-person share computed');
  assert.ok(card.includes('نفر چهارم به بعد: هر نفر '+mil(p.seat_amount)+' میلیون تومان برای کل دوره'),k+' extra-user line');
  assert.ok(card.includes('اعتبار هدیه '+String(p.credits).replace(/[0-9]/g,d=>'۰۱۲۳۴۵۶۷۸۹'[d])+' عکس'),k+' gift images');
  assert.match(card,new RegExp('data-buy="'+k+'" data-service="all" data-title="آرایشگاه" data-months="'+p.months+'" data-state="open" data-amount="'+p.amount+'" data-seats="3" data-seat-amount="'+p.seat_amount+'"'));
  assert.equal(/class="plan__badge"[\s\S]*?پیشنهاد آینه/.test(card),k==='salon6',k+' «پیشنهاد آینه» only on 6 months');
 }
 for(const k of ['salon1','salon3','salon6'])assert.ok(panelOf(landingHTML,'salon').includes('data-buy="'+k+'"'),'the home salon tab sells '+k);
 // amounts enter only through build.py: no partial carries a price
 for(const f of readdirSync(new URL('../design/landing/src/',import.meta.url)).filter(f=>f.endsWith('.html')))
  assert.doesNotMatch(readFileSync(new URL('../design/landing/src/'+f,import.meta.url),'utf8'),/[0-9۰-۹][0-9۰-۹٫.]*\s*میلیون/,f+' types no price');
});
test('pricing tabs: copy.js switches panels and moves the shared buy buttons to the chosen service',()=>{
 const js=readFileSync(new URL('../design/landing/src/copy.js',import.meta.url),'utf8');
 const ev=()=>({l:{},addEventListener(t,f){(this.l[t]||=[]).push(f)},fire(t,e={}){(this.l[t]||[]).forEach(f=>f({preventDefault(){},...e}))}});
 const el=(o={})=>Object.assign(ev(),{hidden:false,attrs:{},dataset:{},setAttribute(k,v){this.attrs[k]=v},getAttribute(k){return this.attrs[k]},focus(){},scrollIntoView(){},querySelectorAll:()=>[]},o);
 const tabs=['hair','color','nails','lashes','salon'].map(k=>el({id:'ptab-'+k,dataset:{tab:k},textContent:SERVICE_TITLES[k==='salon'?'all':k],attrs:{'aria-selected':String(k==='nails')}}));
 const buys=['essential','pro','signature'].map(k=>el({dataset:{buy:k,service:'nails',title:'ناخن'}}));
 const single=el({dataset:{plansPanel:'hair color nails lashes'},querySelectorAll:()=>buys}),salon=el({hidden:true,dataset:{plansPanel:'salon'}});
 const bar=el({hidden:true,querySelectorAll:()=>tabs}),pbar=el({dataset:{for:'single'}}),open=el({dataset:{openTab:'salon'}});
 const sec=el({dataset:{defaultTab:'nails'},querySelector:()=>bar,querySelectorAll:q=>q==='[data-plans-panel]'?[single,salon]:q==='[data-for="single"]'?[pbar]:q==='[data-open-tab]'?[open]:[]});
 new Function('document',js)({getElementById:()=>sec,activeElement:null});
 assert.equal(bar.hidden,false,'the row is on');assert.equal(single.hidden,false);assert.equal(salon.hidden,true);
 assert.deepEqual(buys.map(b=>b.dataset.service),['nails','nails','nails'],'the page\'s own service first');
 tabs[1].fire('click');
 assert.deepEqual(buys.map(b=>[b.dataset.service,b.dataset.title]),[['color','رنگ مو'],['color','رنگ مو'],['color','رنگ مو']],'«رنگ مو» buys colour');
 assert.equal(tabs[1].attrs['aria-selected'],'true');assert.equal(tabs[2].attrs['aria-selected'],'false');
 open.fire('click');
 assert.equal(single.hidden,true);assert.equal(salon.hidden,false);assert.equal(pbar.hidden,true,'the «دو نفرید؟» bar is not on the salon tab');
 assert.deepEqual(buys.map(b=>b.dataset.service),['color','color','color'],'the salon tab leaves the single cards alone');
});
test('checkout: the clicked card names the service, salon plans send users, the line reads «پلن مدل مو · ۳ ماهه»',async()=>{
 assert.match(payJS,/state\.service = btn\.dataset\.service/,'the service comes from the clicked card');
 assert.doesNotMatch(payJS,/const service = document\.body\.dataset\.service/,'not from the page');
 assert.match(payJS,/body\.users = usersWanted\(\)/,'salon plans send the user count');
 assert.match(payJS,/base \+ extra \* rate/,'the preview total: base + extra users × rate, from the card data');
 for(const k of ['home','hair','salon']){const html=k==='home'?landingHTML:servicePages[k];
  assert.match(html,/id="payUsers" name="users" type="number"[^>]*min="1"[^>]*value="3"/,k+': the user count input');}
 const e=fixture();
 const a=await call(e,'/api/order',orderBody('pro',{service:'color',phone:'09125550701'}));
 assert.deepEqual([a.data.summary.title,a.data.summary.months],['رنگ مو',3]);
 const b=await call(e,'/api/order',orderBody('salon6',{service:'all',users:4,phone:'09125550702'}));
 assert.deepEqual([b.data.summary.title,b.data.summary.months,b.data.summary.users,b.data.amount],['آرایشگاه',6,4,PLANS.salon6.amount+PLANS.salon6.seat_amount]);
});
test('honest copy: no stale plan claims, no SMS step for the visitor demo, no unmeasured durations, one privacy sentence',()=>{
 const pages=[landingHTML,...Object.values(servicePages)];
 for(const html of pages){
  assert.doesNotMatch(html,/در پلن ESSENTIAL درخواست|در PRO در تلگرام|تأیید شماره|کد پیامک/,'no stale plan or SMS claim');
  assert.doesNotMatch(html.replace(/<script>[\s\S]*?<\/script>/g,''),/[0-9۰-۹]+\s*(?:تا\s*[0-9۰-۹]+\s*)?(?:ثانیه|دقیقه) طول|یک دقیقه طول|حدود یک دقیقه/,'no generation time in public copy');
  assert.doesNotMatch(html,/فقط برای ساخت همین نمونه/,'the old privacy line is gone');
 }
 for(const t of [/معمولاً حدود یک دقیقه/,/۲ تا ۳ دقیقه/,/در یک دقیقه نشانت/])assert.doesNotMatch(customerJS,t,'customer page: '+t);
 assert.doesNotMatch(customerJS,/چند لحظه طول می‌کشد/);
 assert.doesNotMatch(customerJS,/state\.pub\.demo\?'شمارهٔ موبایلت را وارد کن/,'the demo never asks for a mobile, and its host text does not say so');
 const faq=landingHTML.match(/<section id="faq"[\s\S]*?<\/section>/)[0];
 assert.ok(faq.includes('عکس فقط برای ساخت نمونه و دیدن سالن شما استفاده می‌شود؛ نسخهٔ فشردهٔ آن برای ساخت تصویر به سرویس تصویر ارسال می‌شود.'));
 for(const html of pages)if(html.includes('id="tryonStart"'))assert.ok(html.includes('<small>عکس شما فقط برای ساخت نمونه و دیدنِ سالن استفاده می‌شود.</small>'),'the short line near the upload');
});
test('sample links: every public page sends the sample builder to /sample; /try is only the regular-customer page',()=>{
 for(const [k,html] of [['home',landingHTML],...Object.entries(servicePages)]){
  assert.ok(html.includes('href="/sample">ساخت نمونه'),k+' footer links /sample');
  assert.doesNotMatch(html,/href="(?:__ORIGIN__)?\/try[/"?#]/,k+' never links the builder to /try');
  for(const m of html.matchAll(/<a\b[^>]*>(?:[^<]|<(?!\/a>))*?نمونه بساز/g))assert.match(m[0],/href="(?:#demo|\/sample)"/,k+': «نمونه بساز» goes to the builder');
 }
 assert.deepEqual(Object.keys(servicePages).sort(),['color','hair','lashes','nails','salon','sample']);
});

/* ---------- review fixes: the service on an order, lines on a second plan, seats on renewal ---------- */
const salonSettings=(e,slug)=>JSON.parse(e.DB.sql.prepare('SELECT settings FROM salons WHERE slug=?').get(slug).settings);
const confirmOwner=(e,id)=>call(e,'/api/owner/orders/'+id+'/confirm',{},OWNER);
test('createOrder: a single-service plan needs a real service, «پنل آرایشگاه» is «all», users only on the salon plan',async()=>{
 const e=fixture();
 for(const [plan,extra,why] of [['pro',{service:''},'empty service'],['pro',{service:'salon'},'the old /salon-panel value'],['essential',{service:undefined},'no service'],
  ['signature',{service:'all'},'«all» on a single plan'],['pro',{service:'hair',users:5},'users on a single plan'],['salon3',{service:'nails'},'one service on the salon plan']]){
  const r=await call(e,'/api/order',{...orderBody(plan,{phone:'09125551000'}),...extra});
  assert.equal(r.status,400,why+': '+JSON.stringify(r.data));assert.match(r.data.error,/[آ-ی]/,why+' answers in Persian');
 }
 assert.equal(e.DB.sql.prepare('SELECT COUNT(*) n FROM orders').get().n,0,'nothing was stored');
 const ok=await call(e,'/api/order',orderBody('salon1',{service:'all',users:3,phone:'09125551001'}));assert.equal(ok.status,200);assert.equal(ok.data.service,'all');
 const none=await call(e,'/api/order',{...orderBody('salon1',{phone:'09125551002'}),service:undefined});assert.equal(none.status,200,'the salon plan may omit the service');assert.equal(none.data.service,'all');
});
test('a second single-service plan adds its service; a salon on «پنل آرایشگاه» cannot be moved down by a purchase',async()=>{
 const e=fixture();
 const a=await call(e,'/api/order',orderBody('essential',{service:'nails',phone:'09125552000',salon:'Nails First'}));await confirmOwner(e,a.data.id);
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(a.data.id).slug;
 assert.deepEqual(salonSettings(e,slug).lines,['nails']);
 const until1=salonSettings(e,slug).plan.until;
 const b=await call(e,'/api/order',orderBody('essential',{service:'lashes',phone:'09125552000',salon:'Nails First'}));await confirmOwner(e,b.data.id);
 assert.deepEqual(salonSettings(e,slug).lines,['nails','lashes'],'lashes paid for, nails kept');
 assert.ok(salonSettings(e,slug).plan.until>until1,'the plan is extended');
 assert.deepEqual((await call(e,'/api/s/'+slug+'/public')).data.lines,['nails','lashes']);
 // the same service again changes nothing
 const c=await call(e,'/api/order',orderBody('essential',{service:'nails',phone:'09125552000',salon:'Nails First'}));await confirmOwner(e,c.data.id);
 assert.deepEqual(salonSettings(e,slug).lines,['nails','lashes']);
 // a salon plan buyer: a single-service order from the same mobile is refused
 const s=await call(e,'/api/order',orderBody('salon1',{users:4,phone:'09125552001',salon:'Big One'}));await confirmOwner(e,s.data.id);
 const down=await call(e,'/api/order',orderBody('pro',{service:'hair',phone:'09125552001',salon:'Big One'}));
 assert.equal(down.status,409);assert.match(down.data.error,/پشتیبانی/);
 const big=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(s.data.id).slug;
 assert.equal(salonSettings(e,big).service,'all');
});
test('salon plan renewal: a new user count starts with the period it pays for; paid users are never cut mid-period',async()=>{
 const {seatsAt}=await import('../worker/credits.js');const {seatsOf}=await import('../worker/plans.js');
 const e=fixture();
 const o=await call(e,'/api/order',orderBody('salon1',{users:6,phone:'09125553000',salon:'Seat Salon'}));await confirmOwner(e,o.data.id);
 const login=await call(e,'/api/panel/login',{key:o.data.access_key});const ctx={cookie:login.cookie};
 const slug=e.DB.sql.prepare('SELECT s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.id=?').get(o.data.id).slug;
 const row=()=>e.DB.sql.prepare('SELECT * FROM salons WHERE slug=?').get(slug);
 assert.equal(seatsOf(row()),6);
 // fewer users next period: the 6 paid now stay until this period ends
 const less=await call(e,'/api/panel/renew',{plan:'salon1',users:3},ctx);await confirmOwner(e,less.data.id);
 const p1=salonSettings(e,slug).plan;
 assert.equal(seatsOf(row()),6,'paid users are kept for the rest of the period');
 assert.equal(seatsAt(p1,p1.until-1),3,'the cheaper count starts with the new period');assert.equal(seatsAt(p1,Date.now()),6);
 // more users: not free before the period they were paid for
 const more=await call(e,'/api/panel/renew',{plan:'salon1',users:9},ctx);await confirmOwner(e,more.data.id);
 const p2=salonSettings(e,slug).plan;
 assert.equal(seatsOf(row()),6,'still 6 today');
 assert.deepEqual(p2.seat_steps.map(s=>s.seats),[3,9],'each renewal starts when its own period starts');
 assert.equal(seatsAt(p2,p2.until-1),9);
});
test('panel checklist: «دعوت همکار» shows for «پنل آرایشگاه» (its paid users), never on a single-service plan',async()=>{
 const e=fixture();
 const big=await call(e,'/api/order',orderBody('salon3',{users:5,phone:'09125554000',salon:'Team Salon'}));await confirmOwner(e,big.data.id);
 const bl=await call(e,'/api/panel/login',{key:big.data.access_key});
 assert.equal((await call(e,'/api/panel/me',undefined,{cookie:bl.cookie})).data.checklist.users,5);
 const solo=await call(e,'/api/order',orderBody('pro',{service:'nails',phone:'09125554001',salon:'Solo'}));await confirmOwner(e,solo.data.id);
 const sl=await call(e,'/api/panel/login',{key:solo.data.access_key});
 assert.equal((await call(e,'/api/panel/me',undefined,{cookie:sl.cookie})).data.checklist.users,0);
 assert.match(panelHTML,/if\(c\.users>1\)acts\.append/,'the panel shows the invite for more than one user');
 const server=readFileSync(new URL('../worker/server.js',import.meta.url),'utf8');
 assert.doesNotMatch(server,/UPDATE generations SET paid_by/,'paid_by is written with the generation row, never after it');
 assert.equal((server.match(/visitor,paid_by\) VALUES/g)||[]).length,2,'both the image and the 360 view write paid_by in their INSERT');
});
test('result: Instagram story keeps the result untouched and signs it with the right logo',()=>{
 const js=customerHTML;
 assert.ok(js.includes('قالب استوری اینستاگرام'),'story button on the result');
 assert.ok(js.includes("g.filter='none';rr(dx,dy,dw,dh,rad);g.clip();g.drawImage(img,dx,dy,dw,dh)"),'the result itself is drawn whole and unfiltered');
 assert.match(js,/\(state\.pub\.direct\|\|state\.pub\.demo\)\?\{name:'آینه',logo:'\/landing\/ayneh-logo-lg\.webp'/,'Ayneh pages sign with Ayneh');
 assert.match(js,/logo:p\.logo\?media\(p\.logo\):''/,'salon pages sign with the salon logo');
});
test('search engines: canonical per page, robots.txt, sitemap.xml and organisation data',async()=>{
 const e=fixture();
 for(const p of ['/','/hair','/color','/nails','/lashes','/salon-panel','/sample']){
  const html=await (await app.fetch(new Request(origin+p),e)).text();
  assert.ok(html.includes('<link rel="canonical" href="'+origin+p+'">'),'canonical '+p);
  assert.doesNotMatch(html,/__CANON__|__ORIGIN__/,'no placeholder left on '+p);
  assert.ok(html.includes('"@type":"Organization"'),'organisation data on '+p);
 }
 assert.doesNotMatch(await (await app.fetch(new Request(origin+'/pay'),e)).text(),/__CANON__/);
 const robots=await (await app.fetch(new Request(origin+'/robots.txt'),e)).text();
 assert.match(robots,/Disallow: \/admin/);assert.match(robots,/Disallow: \/api\//);assert.ok(robots.includes('Sitemap: '+origin+'/sitemap.xml'));
 const map=await (await app.fetch(new Request(origin+'/sitemap.xml'),e)).text();
 for(const p of ['/hair','/salon-panel','/try'])assert.ok(map.includes('<loc>'+origin+p+'</loc>'),'sitemap '+p);
 assert.doesNotMatch(map,/admin|example\/panel|\/s\//);
});

test('no page calls the simulation «تقریبی»: the sample label stays, the vague word is gone',()=>{
 for(const [name,src] of [['landing',landingHTML],['customer page',customerHTML],['customer script',customerJS],['salon panel',panelHTML],['regular page',readFileSync(new URL('../worker/regularpage.js',import.meta.url),'utf8')],...Object.entries(servicePages)])
  assert.doesNotMatch(src,/تقریبی/,name+' must not call the result approximate');
 for(const k of Object.keys(servicePages))assert.ok(servicePages[k].includes('نمونهٔ نمایشی'),k+' keeps the sample label');
 assert.ok(landingHTML.includes('نمونهٔ نمایشی'),'the home page keeps the sample label');
 assert.ok(customerJS.includes('نمونهٔ نمایشی'),'the shared story image keeps the sample label');
});

test('audit: hero loads eagerly and waits for decoding; hairstyle mirror excludes colour',()=>{
 const hero=landingHTML.match(/<div class="hero-stage loop loop--svc"[\s\S]*?<\/ol>/)[0];
 const frames=[...hero.matchAll(/<figure class="loop__f[^>]*><img[^>]+>/g)].map(m=>m[0]);
 assert.equal(frames.length,8);for(const frame of frames)assert.match(frame,/loading="eager"/);
 assert.match(frames[0],/fetchpriority="high"/);assert.match(hero,/class="loop__toggle"/);
 const js=readFileSync(new URL('../design/landing/src/copy.js',import.meta.url),'utf8');
 assert.match(js,/img\.decode\(\)/);assert.match(js,/prefers-reduced-motion/);
 assert.match(servicePages.hair,/id="playColors" hidden/);
 assert.ok(servicePages.nails.includes('با عکس واضح و پرنور'));assert.ok(servicePages.lashes.includes('با عکس واضح و پرنور'));
});

test('audit follow-up: mobile controls and reduced-motion playback',()=>{
 const css=readFileSync(new URL('../design/landing/src/copy.css',import.meta.url),'utf8');
 const site=readFileSync(new URL('../design/landing/src/site.css',import.meta.url),'utf8');
 const studio=readFileSync(new URL('../design/landing/src/studio.css',import.meta.url),'utf8');
 const js=readFileSync(new URL('../design/landing/src/copy.js',import.meta.url),'utf8');
 assert.match(studio,/\.sb-add\{[^}]*min-height:44px/);
 assert.match(site,/\.plan \.btn\.plan__buy\{min-height:48px\}/);
 assert.match(css,/\.loop:not\(\.is-playing\) \.loop__f/);
 assert.match(css,/animation-duration:var\(--loop-duration,8s\)!important/);
 assert.match(js,/classList\.toggle\('is-playing',motion\.matches&&!paused\)/);
 assert.match(customerHTML,/\.btn--sm,\.picked \.btn,a\.hchip,button\.hchip\{min-height:44px\}/);
});
