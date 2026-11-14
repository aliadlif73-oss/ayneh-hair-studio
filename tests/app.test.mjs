import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';import app from '../worker/index.js';
import {phone,transferPrompt} from '../worker/domain.js';import {appHTML} from '../worker/ui.js';import {customerHTML,customerJS} from '../worker/customer.js';import {landingHTML} from '../worker/landing.js';
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
 assert.match(html,/id="builderLive"/);assert.match(html,/دستیار هوشمند رشد سالن زیبایی شما/);assert.match(html,/id="start"/);assert.doesNotMatch(html,/noindex/);
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

test('landing carries an absolute share image and revalidates instead of going stale',async()=>{const e=fixture();const r=await app.fetch(new Request(origin+'/'),e);const html=await r.text();
 // Cacheable was the reason the owner kept seeing an old build: max-age=300 plus an hour of
 // stale-while-revalidate meant a reload could serve a page from an hour ago.
 assert.match(r.headers.get('cache-control'),/no-cache/);
 assert.doesNotMatch(r.headers.get('cache-control'),/stale-while-revalidate/);
 // And the served page names its build, so "is this the new one?" has an answer that does
 // not need devtools. The stamp is a meta tag because the minifier strips comments.
 assert.match(html,/<meta name="ayneh-build" content="[a-f0-9]{12}">/,'the page names its build');
 assert.match(html,new RegExp('og:image" content="'+origin+'/landing/og.jpg"'));assert.doesNotMatch(html,/__ORIGIN__/);assert.ok(readFileSync(new URL('../public/landing/og.jpg',import.meta.url)).length>10000)});

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

// ---------- Step 24: the reference rebuild ----------
// These guards replace the espresso/brass funnel audit. They lock the visual
// system taken from the six reference sheets (cream/emerald, the teal face mark,
// the section order 1 hero → 2 امکانات → 3 نحوهٔ کار → 4 مزایا → 5 نظرات →
// 6 تعرفه → 7 فراخوان → FAQ → footer) and the honesty rules that still apply.

test('step 24 reference: the page opens with one hero, one headline and the four benefit cards',()=>{
 assert.equal((landingHTML.match(/<h1[\s>]/g)||[]).length,1,'exactly one h1');
 assert.match(landingHTML,/آینه، دستیار هوشمند<span class="h1__accent">رشد سالن زیبایی شما<\/span>/,'the two-tone reference headline');
 assert.match(landingHTML,/id="heroCompare"/,'the before/simulation card leads the visual');
 assert.match(landingHTML,/compare__badge[^>]*>[\s\S]{0,200}نتیجه با هوش مصنوعی/,'the AI result badge is labelled');
 assert.equal((landingHTML.match(/class="hero-thumb"/g)||[]).length,4,'four services in the hero thumbnail rail');
 assert.equal((landingHTML.match(/class="hero-benefits__icon"/g)||[]).length,4,'four benefit cards under the fold');
 for(const label of ['رشد رزروها و درآمد','مدیریت آسان مشتریان','نوبت‌دهی آنلاین ۲۴ ساعته','اعتماد و رضایت بیشتر'])
  assert.ok(landingHTML.includes(label),'benefit '+label);
 assert.match(landingHTML,/نمونهٔ موقت؛ شبیه‌سازی تقریبی است/,'the simulation is not sold as a guarantee');
});

test('step 24 reference: header, nav and the two header actions follow the sheet',()=>{
 const header=(landingHTML.match(/<header class="site-header">[\s\S]*?<\/header>/)||[])[0]||'';
 assert.ok(header,'header exists');
 assert.match(header,/class="brand__mark"/);assert.match(header,/class="brand__word">آینه</);
 for(const item of ['#intro">خانه','#features">امکانات','#why">چرا آینه؟','#services">تعرفه‌ها','#faq">سوالات متداول'])
  assert.ok(header.includes(item),'nav '+item);
 assert.match(header,/aria-current="page"/,'the active item keeps the underline');
 const actions=(header.match(/<div class="header-cta">[\s\S]*?<\/div>/)||[])[0]||'';
 assert.match(actions,/class="btn--login"[\s\S]*?ورود به پنل/,'login button');
 assert.match(actions,/class="btn" href="#services"[\s\S]*?خرید پنل/,'primary header CTA sells a panel');
 assert.match(header,/class="menu-toggle"/,'mobile menu hook');
 assert.match(landingHTML,/@media\(max-width:1120px\)\{[\s\S]{0,120}\.nav\{display:none\}/,'nav collapses before it can crowd the bar');
});

test('step 24 reference: section order matches the six reference sheets',()=>{
 const order=['id="intro"','id="features"','id="how"','id="why"','id="proof"','id="services"',
  'id="cta"','id="faq"','id="salon-example"'];
 let at=-1;
 for(const token of order){
  const next=landingHTML.indexOf(token,at+1);
  assert.ok(next>at,'section '+token+' appears in reference order');
  at=next;
 }
 // The section titles of the sheets land verbatim.
 for(const title of ['امکانات و خدمات <em>آینه</em>','آینه <em>چگونه کار می‌کند؟</em>',
  'چرا سالن‌داران <em>«آینه»</em> را انتخاب می‌کنند؟','اعتماد حرفه‌ای‌ها <em>به آینه</em>',
  'پرسش‌های متداول <em>صاحبان سالن‌های زیبایی</em>','یک قدم تا <em>مدیریت حرفه‌ای</em>'])
  assert.ok(landingHTML.includes(title),'title '+title);
});

test('step 24 reference: the five service cards and the four numbered steps are all there',()=>{
 for(const card of ['پیش‌نمایش مدل مو','خدمات مژه','پیش‌نمایش رنگ مو','درخواست مستقیم سالن','خدمات ناخن'])
  assert.ok(landingHTML.includes(card),'service card '+card);
 assert.equal((landingHTML.match(/class="svc[\s"]/g)||[]).length,5,'five service cards');
 assert.equal((landingHTML.match(/class="step__num"/g)||[]).length,4,'four numbered steps');
 for(const step of ['بارگذاری عکس مشتری','انتخاب خدمت و مدل','ساخت پیش‌نمایش با هوش مصنوعی','ارسال درخواست به سالن'])
  assert.ok(landingHTML.includes(step),'step '+step);
 assert.match(landingHTML,/<span class="step__num" aria-hidden="true">۱<\/span>/,'steps are numbered right-to-left');
 assert.equal((landingHTML.match(/class="why__icon"/g)||[]).length,6,'six benefit cards in the why grid');
});

test('step 24 reference: social proof ships as clearly marked temporary samples',()=>{
 // The owner's standing rule: no invented clients, quotes, ratings or totals.
 assert.equal((landingHTML.match(/class="quote"/g)||[]).length,3,'three quote slots');
 assert.equal((landingHTML.match(/نمونهٔ موقت<\/b>/g)||[]).length,3,'each quote is flagged as a sample');
 assert.match(landingHTML,/نقل‌قول ساختگی منتشر نمی‌کنیم/,'no fabricated quote is presented as real');
 for(const stat of ['+۱۲٬۰۰۰','۴.۸','+۱٬۵۰۰٬۰۰۰']){
  assert.ok(landingHTML.includes(stat),'counter '+stat);
  assert.match(landingHTML,new RegExp(stat.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[\\s\\S]{0,160}نمونه'),'counter '+stat+' is marked نمونه');
 }
 assert.match(landingHTML,/ارقام این بخش نمونهٔ موقت‌اند/,'the counters are declared as samples in prose');
 assert.match(landingHTML,/انتخاب مطمئن مدیران/,'the trust badge from the sheet');
 assert.equal((landingHTML.match(/class="quote-dots"/g)||[]).length,1,'one dot navigator');
});

test('step 24 reference: FAQ answers the five sheet questions and never names a price',()=>{
 const faq=(landingHTML.match(/<section id="faq"[\s\S]*?<\/section>/)||[])[0]||'';
 assert.equal((faq.match(/class="faq-item"/g)||[]).length,7,'seven questions');
 for(const q of ['آینه دقیقاً چه کمکی به مدیریت سالن من می‌کند؟','راه‌اندازی و آموزش چقدر زمان می‌برد؟',
  'آیا امکان استفاده روی موبایل وجود دارد؟','هزینهٔ استفاده از آینه چگونه است؟',
  'آیا پشتیبانی و مشاوره در طول استفاده دارم؟'])
  assert.ok(faq.includes(q),'faq '+q);
 assert.match(faq,/مبلغ و سهمیهٔ تصویر در حال نهایی‌شدن است/,'the cost answer stays honest');
 assert.doesNotMatch(faq,/میلیون|\d+\s*تومان/,'no figure is invented');
 assert.match(faq,/href="#services"/,'the cost answer points at the panels');
});

test('step 24 reference: footer keeps the four columns, contacts and the copyright line',()=>{
 const foot=(landingHTML.match(/<footer class="site-footer">[\s\S]*?<\/footer>/)||[])[0]||'';
 assert.ok(foot,'footer exists');
 for(const col of ['دسترسی سریع','لینک‌های مفید','ارتباط با ما'])assert.ok(foot.includes(col),'column '+col);
 assert.match(foot,/دستیار هوشمند مدیریت<br>سالن‌های زیبایی/);
 assert.match(foot,/0910 564 7497/);assert.match(foot,/omidadli78@gmail\.com/);
 assert.match(foot,/© ۱۴۰۵ آینه/);
 assert.equal((foot.match(/class="foot-social"/g)||[]).length,1);
 assert.equal((foot.match(/class="brand__mark"/g)||[]).length,1,'the teal mark returns in the footer');
});

test('step 24 brand: one teal face mark, no leftover brass mirror',()=>{
 const {brandMark,faviconMark}=brand();
 const svg=readFileSync(new URL('../design/landing/assets/ayneh-mark.svg',import.meta.url),'utf8');
 assert.match(svg,/viewBox="0 0 64 64"/);
 assert.match(svg,/fill="currentColor"/,'the disc takes the brand colour');
 assert.equal((svg.match(/stroke="#FCF3EB"/g)||[]).length,1,'the strands are punched in cream');
 assert.doesNotMatch(svg,/brass|#D6BE8C|#C9A227/i,'the brass mark is retired');
 assert.ok(brandMark.includes('aynDisc'),'the generated mark is the traced face');
 // Every place that prints the mark prints this one.
 for(const slot of ['brand__mark','foot-brand']){
  assert.ok(landingHTML.includes(slot),slot+' slot exists');
 }
 const markIds=[...landingHTML.matchAll(/id="(aynDisc[^"]*)"/g)].map(m=>m[1]);
 assert.equal(markIds.length,2,'the landing page prints a header and footer mark');
 assert.equal(new Set(markIds).size,markIds.length,'each inline SVG clip path has a unique document ID');
 assert.ok(faviconMark.length>100,'favicon is generated from the new brand');
});

test('step 24 palette: cream ground, ink type, a single emerald accent',()=>{
 assert.match(landingHTML,/--cream:#FCF3EB/);
 assert.match(landingHTML,/--ink:#0A202A/);
 assert.match(landingHTML,/--emerald:#068F6C/);
 assert.match(landingHTML,/--emerald-deep:#0A6B54/);
 assert.match(landingHTML,/--emerald-soft:#9BD9C5/);
 assert.match(landingHTML,/--font:"Estedad","Vazirmatn"/,'the app font stack is shared');
 const siteCSS=readFileSync(new URL('../design/landing/src/site.css',import.meta.url),'utf8');
 assert.match(siteCSS,/:is\(\.svc__icon,\.step__icon,\.why__icon,\.proof-stat__icon,\.hero-benefits__icon\)\{[\s\S]*?box-shadow:inset 2px 2px 4px/,'the main icon tiles use dimensional highlights and shadows');
 assert.match(siteCSS,/drop-shadow\(0 1px 0 rgba\(255,255,255,\.92\)\) drop-shadow\(0 2px 1px rgba\(11,59,50,\.24\)\)/,'icon glyphs keep a raised 3D edge');
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
 assert.match(landingHTML,/:focus-visible\{outline:3px solid var\(--emerald\)/,'focus ring everywhere');
 assert.match(landingHTML,/@media\(prefers-reduced-motion:reduce\)/,'motion is opt-out');
 assert.match(landingHTML,/\[hidden\]\{display:none!important\}/,'hidden always wins over a display rule');
});

test('step 24 pricing: three named panels, two figure slots each, no invented number',()=>{
 assert.equal((landingHTML.match(/data-price="(?:solo|salon|chain)"/g)||[]).length,6,'amount + quota for three panels');
 assert.equal((landingHTML.match(/<b class="slot">/g)||[]).length,6,'all six slots render');
 for(const name of ['<h3>آرایشگر</h3>','<h3>آرایشگاه</h3>','<h3>مجموعه</h3>'])
  assert.ok(landingHTML.includes(name),'panel '+name);
 assert.equal((landingHTML.match(/تومان/g)||[]).length,5,'three plan amounts, the checkout figure and its toman formatter');
 assert.doesNotMatch(landingHTML,/میلیون|[۰-۹0-9]\s*تومان/,'no number before the owner decides');
 assert.match(landingHTML,/مبلغ و سهمیهٔ تصویر در حال نهایی‌شدن است/);
 assert.match(landingHTML,/لینک شخصی برای هر آرایشگر/);
 assert.match(landingHTML,/جابه‌جایی درخواست‌های بی‌پاسخ/);
});

test('step 27 films: the three service clips ship in one player, with a poster each',()=>{
 // The owner's three films (hair, lashes, nails) had been orphaned when the reference rebuild
 // dropped the old film strip. They live in one tabbed player now, and each tab has to be
 // usable: a real source, a poster so the box is never empty, and a poster file on disk.
 const section=landingHTML.match(/<section id="films"[\s\S]*?<\/section>/)[0]||'';
 assert.ok(section,'the films section ships');
 assert.equal((landingHTML.match(/id="films"/g)||[]).length,1,'one player, not three');
 for(const key of ['hair','lashes','nails']){
  assert.match(section,new RegExp('data-film="'+key+'"'),key+' has a tab');
  const poster=readFileSync(new URL('../public/landing/'+key+'-poster.webp',import.meta.url));
  assert.ok(poster.length>2000,key+' poster is a real image');
 }
 // One <video>, and it starts on the hair clip without downloading the other two.
 const video=section.match(/<video[^>]*>/)[0];
 assert.match(video,/preload="none"/,'nothing downloads until the tab is asked for');
 assert.match(video,/muted/,'autoplay is always muted');
 assert.match(video,/playsinline/,'a phone must not open a full-screen player');
 assert.ok(section.includes('video/hair.mp4'),'the first clip is the hair film');
 const js=landingHTML.match(/<script>([\s\S]*?)<\/script>/g).map(x=>x.slice(8,-9)).join('\n');
 for(const key of ['hair','lashes','nails'])assert.ok(new RegExp("/' \\+ key \\+ '\\.mp4").test(js),'one swap serves all three');
 // Each tab points the one <video> at its own clip AND its own poster, so switching tabs
 // never shows the previous service's still.
 assert.ok(js.includes("poster = '/landing/' + key + '-poster.webp'")||js.includes("poster = 'assets/' + key + '-poster.webp'"),'the poster follows the tab');
 assert.match(js,/IntersectionObserver/,'scrolling away pauses the film');
 assert.match(js,/prefers-reduced-motion/,'motion-sensitive visitors get a poster and a play button');
 // The three clips are on disk and small enough for a phone to consider them.
 for(const key of ['hair','lashes','nails']){
  const clip=readFileSync(new URL('../public/landing/video/'+key+'.mp4',import.meta.url));
  assert.ok(clip.length>50_000&&clip.length<3_500_000,key+' clip is present and under 3.5 MB ('+clip.length+')');
  assert.equal(clip.subarray(4,8).toString(),'ftyp','a real mp4 container');
 }
});

test('step 24 studio: the live salon preview survives the rebuild',()=>{
 assert.match(landingHTML,/id="salon-example"/);
 assert.match(landingHTML,/id="builderLive"/);assert.match(landingHTML,/id="livePage"/);
 assert.equal((landingHTML.match(/class="wiz-step/g)||[]).length,2,'only name + slug gate the preview');
 assert.match(landingHTML,/id="wizardCount">۱ از ۲</);
 assert.match(landingHTML,/id="builderDetails"[\s\S]*?تکمیل جزئیات صفحه/);
 for(const key of ['name','slug','brand','logo','cover','bio','manager','phone','hours','address',
  'portrait','map','instagram','telegram','website'])
  assert.match(landingHTML,new RegExp('name="'+key+'"'),'field '+key+' kept');
 const sections=[...landingHTML.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 for(const src of sections)new Function(src);
 const bundle=sections.join('\n');
 assert.match(bundle,/ayneh:wizard-ready/);
 /* The studio is preview-only now: it never posts a request, and the button it grows
    when the preview is ready leads to the panels instead of a form. */
 assert.doesNotMatch(bundle,/\/api\/activation/,'the studio uploads nothing');
 assert.doesNotMatch(bundle,/demo\/otp/,'no phone verification on the landing page');
 assert.match(landingHTML,/id="builderActivate" href="#services"/,'the studio hands over to the panels');
 assert.match(landingHTML,/const studio=document\.getElementById\('salon-example'\)/,'mobile sticky action knows the builder section');
 assert.match(landingHTML,/!overStudio/,'mobile sticky action stays out of the live builder');
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
 assert.ok(landingHTML.length<250000,'landing under 250k ('+landingHTML.length+')');
 assert.ok(landingHTML.length>60000,'the page still carries its content');
 assert.match(landingHTML,/og:image" content="__ORIGIN__\/landing\/og\.jpg"/,'the share image is origin-relative in source');
 assert.equal((landingHTML.match(/__ORIGIN__/g)||[]).length,4,'signup links and the share image carry the origin token');
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
import {PLANS, PRICE_MINUTES} from '../worker/prices.js';
import {cardValid} from '../worker/orders.js';
import {panelHTML} from '../worker/panel.js';
/* The checkout source (not the generated bundle) — the funnel guard reads its guard clause. */
const payJS = readFileSync(new URL('../design/landing/src/pay.js', import.meta.url), 'utf8');

const CARD = '6037-9911-2233-4455';      // passes the Luhn check, expires nowhere
const orderBody = (plan = 'salon', extra = {}) => ({plan, salon: 'سالن نمونه', name: 'سارا محمدی', phone: '۰۹۱۲۱۲۳۴۵۶۷', city: 'تهران', consent: true, ...extra});
/* A priced plan is needed to test a checkout; the shipped page stays unpriced until the
   owner approves numbers. This only mutates the in-memory import for these tests. */
function priced(plan, amount, quota = 30) {
  const before = {...PLANS[plan]};
  PLANS[plan].amount = amount; PLANS[plan].quota = quota;
  return () => Object.assign(PLANS[plan], before);
}

test('step 25 funnel: the button says «خرید» and, with no price, still explains itself', () => {
  // The owner asked for one flow: the visitor sees the panels, clicks buy on the one she
  // wants, and gets a card number with a deadline. With the amounts unapproved there is no
  // money to take yet, so the same button carries her to the note under the panels and says
  // why — never a dead button, never a checkout that cannot take payment, never a figure.
  const labels = [...landingHTML.matchAll(/<a\b[^>]*data-buy="([a-z]+)"[^>]*>([^<]*)<\/a>/g)];
  assert.equal(labels.length, 3, 'three plan buttons');
  for (const [, plan, text] of labels) {
    const tag = landingHTML.match(new RegExp('<a\\b[^>]*data-buy="' + plan + '"[^>]*>'))[0];
    assert.equal(text.trim(), 'خرید', plan + ' is a buy button');
    assert.match(tag, /href="#plan-note"/, plan + ' lands on the note that explains the figure');
    assert.doesNotMatch(tag, /href="#pay"/, plan + ' does not open a payment it cannot take');
  }
  // Every unpriced panel explains itself in words next to the button.
  assert.equal((landingHTML.match(/مبلغ در حال نهایی‌شدن است و پیش از خرید نوشته می‌شود\./g) || []).length, 3,
    'each unpriced panel says the amount is being finalized');
  // The click is not swallowed: it falls through to the anchor and leaves a note behind.
  assert.match(payJS, /if \(!open\) \{[\s\S]{0,400}?return; \/\/ the anchor still carries/,
    'an unpriced click explains itself and then lets the anchor do the work');
  assert.match(landingHTML, /id="plan-note"/, 'the anchor has a real destination');
  assert.match(landingHTML, /data-state="soon"/, 'and the shipped panels are still unpriced');
  assert.equal(PLANS.solo.amount + PLANS.salon.amount + PLANS.chain.amount, 0,
    'no plan carries a figure the owner has not approved');
});

test('step 25 narrow phones: nothing in the header or the studio preview widens the page under 430px', () => {
  // Measured in Chromium: at 320/360/390 the page used to be 3–49px wider than the viewport
  // because the header pills and the studio's address row and submit pill could not shrink.
  // These are the three rules that made scrollW == clientW; losing any of them reopens it.
  const site = readFileSync(new URL('../design/landing/src/site.css', import.meta.url), 'utf8');
  const studio = readFileSync(new URL('../design/landing/src/studio.css', import.meta.url), 'utf8');
  const narrow = site.match(/@media\(max-width:380px\)\{[\s\S]*?\n\}/);
  assert.ok(narrow, 'the small-phone header block exists');
  for (const rule of ['.brand__mark{width:32px', '.brand__word{font-size:20px', '.header-cta .btn svg{display:none}'])
    assert.ok(narrow[0].includes(rule), 'small-phone header: ' + rule);
  assert.match(studio, /@media \(max-width:430px\)\{[\s\S]*?\.sb-browser\{flex-wrap:wrap/,
    'the studio address row wraps instead of overflowing');
  assert.match(studio, /@media \(max-width:430px\)\{[\s\S]*?\.sb-fallback \.btn\{[^}]*white-space:normal/,
    'the preview form submit may wrap its label');
  assert.match(site, /\.site-footer\{[^}]*overflow:clip/, 'the clipped footer ornament stays clipped');
  assert.match(site, /html\{[^}]*overflow-x:clip/, 'cinematic transforms cannot create page-level horizontal scroll');
});

test('step 25 pricing: with no approved amount a plan cannot be bought, and the server says so', async () => {
  const e = fixture();
  assert.equal(PLANS.salon.amount, 0, 'the shipped table has no invented figure');
  const r = await call(e, '/api/order', orderBody());
  assert.equal(r.status, 409);
  assert.match(r.data.error, /مبلغ این پنل هنوز نهایی نشده/);
  const unknown = await call(e, '/api/order', orderBody('platinum'));
  assert.equal(unknown.status, 404);
});

test('step 25 order: a valid order returns the amount in toman, a 10-minute window and a card once the owner sets one', async () => {
  const e = fixture();
  const restore = priced('salon', 2900000);
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
  const restore = priced('salon', 1000000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.equal(r.status, 200);
    e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now() - 1000, r.data.id);
    const after = await call(e, '/api/order/' + r.data.id);
    assert.equal(after.data.status, 'expired');
    const confirm = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(confirm.status, 409);
    const receipt = await call(e, '/api/order/' + r.data.id + '/receipt', {note: '123456'});
    assert.equal(receipt.status, 410);
    const panel = await call(e, '/api/panel/me');
    assert.equal(panel.data.salon, null, 'no panel before payment');
  } finally { restore() }
});

test('step 25 one open order per mobile: a second click resumes the first instead of stacking countdowns', async () => {
  const e = fixture();
  const restore = priced('solo', 500000);
  try {
    const a = await call(e, '/api/order', orderBody('solo'));
    const b = await call(e, '/api/order', orderBody('solo'));
    assert.equal(a.data.id, b.data.id);
    assert.equal(b.data.access_key, '', 'a resumed order never re-issues the key');
    const count = e.DB.sql.prepare('SELECT count(*) n FROM orders').get().n;
    assert.equal(count, 1);
  } finally { restore() }
});

test('step 25 coupons: one code per order lowers the toman amount; a bad code is refused and a max:1 code is spent only on commit', async () => {
  const e = fixture();
  const restore = priced('salon', 2000000);
  try {
    e.DB.sql.prepare("INSERT INTO app_settings(key,value,updated_at) VALUES('pay_coupons','{\"AYNEH20\":{\"percent\":20,\"max\":1},\"OFF500\":{\"amount\":500000,\"max\":0}}',?)").run(Date.now());
    const r = await call(e, '/api/order', orderBody());
    const c = await call(e, '/api/order/' + r.data.id + '/coupon', {coupon: 'ayneh20'});
    assert.equal(c.status, 200, JSON.stringify(c));
    assert.equal(c.data.discount, 400000);
    assert.equal(c.data.amount, 1600000);
    const bad = await call(e, '/api/order/' + r.data.id + '/coupon', {coupon: 'NOPE'});
    assert.equal(bad.status, 422);
    // The code is spent when the customer commits (sends a receipt), not when a window opens.
    assert.equal((await call(e, '/api/order/' + r.data.id + '/receipt', {note: '۱۲۳۴'})).data.status, 'reviewing');
    const other = await call(e, '/api/order', orderBody('salon', {phone: '۰۹۱۲۰۰۰۰۰۰۰'}));
    const used = await call(e, '/api/order/' + other.data.id + '/coupon', {coupon: 'AYNEH20'});
    assert.equal(used.status, 422, 'max:1 is used up');
    const fixed = await call(e, '/api/order/' + other.data.id + '/coupon', {coupon: 'OFF500'});
    assert.equal(fixed.status, 200);
    assert.equal(fixed.data.amount, 1500000);
  } finally { restore() }
});

test('step 25 confirm: the owner turns an order into a salon page + a working panel key, exactly once', async () => {
  const e = fixture();
  const restore = priced('salon', 1200000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.equal((await call(e, '/api/owner/orders', undefined, OWNER)).data.orders.length, 1);
    assert.equal((await call(e, '/api/owner/orders')).status, 401);
    const ok = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(ok.status, 200, JSON.stringify(ok));
    assert.equal(ok.data.order.status, 'paid');
    assert.match(ok.data.order.page_url, /\/s\/salon$/);
    // The salon exists and its public page answers.
    assert.equal((await app.fetch(new Request(origin + ok.data.order.page_url.slice(origin.length)), e)).status, 200);
    // Idempotent: a second confirm does not make a second salon.
    const twice = await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    assert.equal(twice.data.order.status, 'paid');
    assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n, 1);

    // The key the customer kept opens the panel.
    const login = await call(e, '/api/panel/login', {key: r.data.access_key});
    assert.equal(login.status, 200, JSON.stringify(login));
    // Only the exact cookie value (the key's hash) is accepted; a cookie without it is a 401.
    assert.equal((await call(e, '/api/panel/me')).data.salon, null, 'no cookie, no panel');
    assert.equal((await call(e, '/api/panel/me', undefined, {cookie: 'ayneh_panel=deadbeef'})).data.salon, null);
    const me = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: login.cookie}}), e);
    assert.equal(me.status, 200);
    const authed = await app.fetch(new Request(origin + '/api/panel/me', {headers: {cookie: login.cookie}}), e);
    const dash = await (authed).json();
    assert.equal(dash.salon.name, 'سالن نمونه');
    assert.match(dash.salon.url, /\/s\/salon$/);
    assert.equal(dash.setup.total, 4);
    assert.equal((await app.fetch(new Request(origin + '/panel'), e)).status, 200);
  } finally { restore() }
});

test('step 25 webhook: the payment site confirms with its token; a wrong token, a bad status or an unknown ref changes nothing', async () => {
  const e = fixture();
  const restore = priced('chain', 3000000);
  try {
    const r = await call(e, '/api/order', orderBody('chain'));
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
  const restore = priced('salon', 1100000);
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
  const restore = priced('solo', 800000);
  try {
    const r = await call(e, '/api/order', orderBody('solo'));
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

test('step 25 receipt: sending one moves the order to reviewing and the panel stays shut until confirmation', async () => {
  const e = fixture();
  const restore = priced('solo', 900000);
  try {
    const r = await call(e, '/api/order', orderBody('solo'));
    const v = await call(e, '/api/order/' + r.data.id + '/receipt', {note: '۴ رقم آخر ۴۵۵'});
    assert.equal(v.data.status, 'reviewing');
    assert.equal((await call(e, '/api/panel/me')).data.salon, null);
    const list = (await call(e, '/api/owner/orders', undefined, OWNER)).data.orders[0];
    assert.equal(list.receipt_note, '۴ رقم آخر ۴۵۵');
    assert.equal(list.plan, 'آرایشگر', 'the console shows the Persian plan name');
    assert.equal(list.contact_phone, '09121234567', 'and a local mobile, not +98');
    assert.equal(list.amount, 900000, 'amount in toman');
    e.DB.sql.prepare('UPDATE orders SET expires_at=? WHERE id=?').run(Date.now() - 1, r.data.id);
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.status, 'expired');
  } finally { restore() }
});

test('step 25 key: the panel key is handed out when the order opens (once), never on a plain read, and login exchanges it for a cookie', async () => {
  const e = fixture();
  const restore = priced('salon', 700000);
  try {
    const r = await call(e, '/api/order', orderBody());
    assert.match(r.data.access_key, /^AY-[2-9A-HJ-NP-Z]{9}$/);
    assert.equal((await call(e, '/api/order/' + r.data.id)).data.access_key, '', 'a plain read never returns the key');
    assert.equal((await call(e, '/api/panel/login', {key: 'AY-AAAAAAAAA'})).status, 401);
    assert.equal((await call(e, '/api/panel/login', {key: 'nonsense'})).status, 401);
    await call(e, '/api/owner/orders/' + r.data.id + '/confirm', {}, OWNER);
    const login = await call(e, '/api/panel/login', {key: r.data.access_key.toLowerCase()});
    assert.equal(login.status, 401, 'case matters; a mistyped key is not trusted');
    const ok = await call(e, '/api/panel/login', {key: r.data.access_key});
    assert.equal(ok.status, 200);
    assert.match(ok.cookie, /^ayneh_panel=[a-f0-9]{64}$/, 'the cookie is the key hash, never the key');
  } finally { restore() }
});

test('step 25 pages: /panel and /pay are real routes, the panel page parses, and the landing checkout is off until a price exists', () => {
  new Function(panelHTML.split('<script>')[1].split('</script>')[0]);
  assert.match(landingHTML, /id="pay"/);
  assert.equal((landingHTML.match(/data-state="open"/g) || []).length, 0, 'no plan sells itself before the owner sets an amount');
  assert.equal((landingHTML.match(/data-state="soon"/g) || []).length, 3);
  assert.equal((landingHTML.match(/data-amount="0"/g) || []).length, 3);
  assert.match(landingHTML, /شمارهٔ کارت هنوز از پنل مدیر پر نشده است/);
  assert.match(landingHTML, /هر سفارش ۱۰ دقیقه اعتبار دارد/);
  assert.doesNotMatch(landingHTML, /[0-9۰-۹]{16}/, 'no card number is ever baked into the page');
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
  assert.equal((landingHTML.match(/data-state="open"/g) || []).length, 0);
});

test('step 25 brand: the favicon carries the cream/emerald palette, never the retired brass', () => {
  assert.doesNotMatch(faviconMark, /#D9B775|#1B130E/i, 'no brass-on-espresso favicon');
  assert.match(faviconMark, /#FCF3EB/i, 'the cream ground');
  assert.match(faviconMark, /#068F6C/i, 'the emerald disc');
  assert.ok(generatedMark.includes('aynDisc'), 'the same one-face mark everywhere');
});

test('step 28 try-on: the demo salon is on the page, with the phone step still in front',()=>{
 // The owner's sample-salon journey — photo, then the number, then the texted code, then the
 // model — has to be visible on the new page, not only behind a link. It is the real demo
 // page embedded, so the gate itself cannot be bypassed by the landing page.
 const section=landingHTML.match(/<section id="try-on"[\s\S]*?<\/section>/)[0]||'';
 assert.ok(section,'the try-on section ships');
 assert.equal((landingHTML.match(/id="try-on"/g)||[]).length,1,'one try-on section');
 for(const line of ['hair','color','nails','lashes'])
  assert.ok(section.includes('data-line="'+line+'"'),line+' is offered');
 // Four steps are named in order: photo, phone, code, model.
 assert.ok(section.includes('عکس'),'the photo step is named');
 assert.ok(section.includes('تأیید شماره'),'the phone step is named');
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
 const section=landingHTML.match(/<section id="play"[\s\S]*?<\/section>/)[0]||'';
 assert.ok(section,'the mirror section ships');
 assert.match(section,/id="playRoom"[^>]*src="(?:\/landing\/|assets\/)hero\.webp\?v=mirror-original"/,'the original photo remains the single base render');
 assert.doesNotMatch(section,/class="play-backdrop"/,'no second photograph is layered under the selected character');
 // 19 styles and 7 colours, as in the version that earned the request for it.
 const js=landingHTML.match(/<script>([\s\S]*?)<\/script>/g).map(x=>x.slice(8,-9)).join('\n');
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
 assert.ok(js.includes('const MIRROR = {x:478,y:145,w:436,h:580}'),'the mirror frame includes its central and side reflections');
 assert.ok(js.includes('window.__AYN_PORTRAIT.compose'),'style changes preserve one shared face instead of layering another portrait');
 assert.ok(js.includes('const zoom=Math.min(W/boxW,H/boxH)'),'the complete mirror assembly stays centered and proportional');
 assert.ok(section.includes('id="playChoiceThumb"')&&section.includes('id="playReplay"'),'the selected model card and replay control ship');
 assert.ok(js.includes('choiceThumb.src = thumb.currentSrc || thumb.src')&&js.includes("$('playReplay').addEventListener('click'"),'the card follows the selection and replay control is wired');
 assert.ok(js.includes('id="playStyles"')||section.includes('id="playStyles"'),'the style rail exists');
 assert.ok(section.includes('id="playSwatches"'),'the colour palette exists');
 // Every style that claims to render on the mirror has its two files.
 const looks=[...landingHTML.matchAll(/look-s(\d\d)\.webp/g)].map(m=>m[1]);
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
