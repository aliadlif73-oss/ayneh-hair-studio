import {Problem,must,phone,text,safeLink,transferPrompt,uid,token,hash,digits} from './domain.js';
import {styles} from './legacy.js';
import {identity,issueCookie,clearCookie,same,passwordLoginEnabled} from './auth.js';
import {bucketFor,putImage} from './storage.js';
import {botReady,deliverLead,deliverPending,newLinkCode,setWebhook} from './telegram.js';
import {smsReady,otpEnabled,inviteEnabled,sendPattern,logSms} from './sms.js';
export {putImage};

const J=(v,s=200,h={})=>new Response(JSON.stringify(v),{status:s,headers:{'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store',...h}});
const parse=s=>{try{return JSON.parse(s||'{}')}catch{return {}}};
const one=(db,sql,...args)=>db.prepare(sql).bind(...args).first();
const run=(db,sql,...args)=>db.prepare(sql).bind(...args).run();
const all=async(db,sql,...args)=>(await db.prepare(sql).bind(...args).all()).results;
const cookie=t=>'ayneh='+t+'; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800';
const PROFILE_TEXT=['bio','address','hours','manager'],PROFILE_LINKS=['map','instagram','website','telegram'],PROFILE_IMAGES=['logo','cover','portrait'];
function publicSalon(s){return {id:s.id,slug:s.slug,name:s.name,profile:parse(s.profile)};}

// The salon panel is gone; only the project owner manages salons.
export async function owner(req,env){const who=await identity(req,env);must(who,'برای ورود، رمز مدیر را وارد کنید',401);must(who.via==='password'||(env.OWNER_EMAIL&&who.email===env.OWNER_EMAIL),'فقط مدیر آینه به این بخش دسترسی دارد',403);return who;}
export async function session(req,db,salon){const t=(req.headers.get('cookie')||'').match(/(?:^|; )ayneh=([a-f0-9]{64})(?:;|$)/)?.[1];must(t,'جلسه پیدا نشد؛ صفحه را تازه کنید',401);const s=await one(db,'SELECT * FROM sessions WHERE token_hash=? AND salon_id=? AND expires_at>?',await hash(t),salon.id,Date.now());must(s,'جلسه منقضی شده؛ صفحه را تازه کنید',401);return s;}
async function newSession(db,salon){const raw=token(),s={id:uid(),salon_id:salon.id,customer_id:null,token_hash:await hash(raw),expires_at:Date.now()+7*86400000,created_at:Date.now()};await run(db,'INSERT INTO sessions(id,salon_id,customer_id,token_hash,expires_at,created_at) VALUES(?,?,?,?,?,?)',...Object.values(s));return {s,raw};}
const clientIp=req=>req.headers.get('cf-connecting-ip')||(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||req.headers.get('x-real-ip')||'unknown';
// Mobile verification before paid image generation (only once Melipayamak is configured).
const OTP_TTL=120000,OTP_GAP=120000,OTP_TRIES=5;
const otpHash=(env,s,number,code)=>hash(['otp',s.id,number,code,env.SESSION_SECRET||env.JOB_TOKEN||''].join(':'));
function needVerified(env,s){if(otpEnabled(env))must(s.verified_at,'تأیید شمارهٔ موبایل لازم است',403);}
async function limited(db,key,max){const n=Date.now(),k=await hash(key);await run(db,'INSERT INTO limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires_at<? THEN 1 ELSE count+1 END,expires_at=CASE WHEN expires_at<? THEN excluded.expires_at ELSE expires_at END',k,n+86400000,n,n);const row=await one(db,'SELECT count FROM limits WHERE key=?',k);must(row.count<=max,'سقف استفادهٔ روزانه پر شده است',429);}
// A customer may only use their own uploads, or published portfolio items the salon marked for try-on.
async function ownMedia(db,s,id){const m=await one(db,'SELECT * FROM media WHERE id=? AND salon_id=?',id,s.salon_id);must(m,'عکس یافت نشد');if(m.session_id!==s.id)must(await one(db,"SELECT 1 FROM portfolio WHERE salon_id=? AND published=1 AND try_on=1 AND EXISTS(SELECT 1 FROM json_each(images) WHERE value=?)",s.salon_id,id),'عکس متعلق به این جلسه نیست',403);return m;}

// Retention: private media is erased after 30 days, and so are customer submissions (the salon
// already has them in Telegram). Brand and published portfolio media are kept.
async function cleanup(env){const now=Date.now(),cut=now-30*86400000;
 const stale=await all(env.DB,"SELECT id,object_key FROM media WHERE kind IN ('original','reference','simulation') AND created_at<? LIMIT 50",cut);
 for(const m of stale){await bucketFor(env).delete(m.object_key);await run(env.DB,'DELETE FROM media WHERE id=?',m.id)}
 const leads=await run(env.DB,'DELETE FROM leads WHERE created_at<?',cut);
 await run(env.DB,'DELETE FROM otps WHERE expires_at<? OR session_id IN(SELECT id FROM sessions WHERE expires_at<?)',now-86400000,now);
 await run(env.DB,'DELETE FROM sms_log WHERE created_at<?',cut);
 await run(env.DB,'DELETE FROM sessions WHERE expires_at<? AND id NOT IN(SELECT session_id FROM requests) AND id NOT IN(SELECT session_id FROM leads) AND id NOT IN(SELECT session_id FROM generations) AND id NOT IN(SELECT session_id FROM media WHERE session_id IS NOT NULL)',now);
 await run(env.DB,'DELETE FROM limits WHERE expires_at<?',now);
 return {media:stale.length,leads:Number(leads.meta.changes||0)};
}
export async function tick(env,origin){if(!env.DB)return {ready:false};const delivered=await deliverPending(env);const cleaned=await cleanup(env);return {ready:true,delivered,...cleaned};}

async function provider(env,path,body){must(env.KIE_API_KEY,'تولید واقعی هنوز متصل نشده است',503);const res=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+env.KIE_API_KEY,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await res.json();must(res.ok&&d.code===200,'سرویس تصویر درخواست را نپذیرفت',502);return d.data;}
// Image model per salon: 'pro' (Nano Banana Pro, best quality, default) or 'fast' (Nano Banana 2.1).
// A definite rejection of the chosen model (e.g. not enabled on the account) falls back to the
// previous model; network failures are not retried so a paid task is never created twice.
export const IMAGE_MODELS={pro:'nano-banana-pro',fast:'nano-banana-2-1'};
const FALLBACK_MODEL='nano-banana-2';
async function createImageTask(env,cfg,input){const model=IMAGE_MODELS[cfg.image_model]||IMAGE_MODELS.pro;try{return {...await provider(env,'/api/v1/jobs/createTask',{model,input}),model}}catch(e){if(!(e instanceof Problem)||e.status!==502||model===FALLBACK_MODEL)throw e;return {...await provider(env,'/api/v1/jobs/createTask',{model:FALLBACK_MODEL,input}),model:FALLBACK_MODEL}}}
async function uploadProvider(env,m){const object=await bucketFor(env).get(m.object_key);must(object,'عکس در دسترس نیست',410);const bytes=new Uint8Array(await object.arrayBuffer());let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.slice(i,i+8192));const res=await fetch('https://kieai.redpandaai.co/api/file-base64-upload',{method:'POST',headers:{Authorization:'Bearer '+env.KIE_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({base64Data:'data:'+m.mime+';base64,'+btoa(binary),uploadPath:'ayneh',fileName:uid()+'.jpg'})});const d=await res.json();must(d.success&&d.data?.downloadUrl,'ارسال عکس انجام نشد',502);return d.data.downloadUrl;}

export async function api(req,env){const u=new URL(req.url),path=u.pathname;must(env.DB,'پایگاه داده هنوز آماده نیست',503);const db=env.DB;
 if(req.method!=='GET'){must(req.headers.get('origin')===u.origin,'مبدأ درخواست مجاز نیست',403);must(Number(req.headers.get('content-length')||0)<12000000,'حجم درخواست زیاد است',413);}
 if(path==='/api/me'){const who=await identity(req,env);const isOwner=!!who&&(who.via==='password'||(!!env.OWNER_EMAIL&&who.email===env.OWNER_EMAIL));return J({user:!!who,owner:isOwner,email:who?.email||'',passwordLogin:passwordLoginEnabled(env)});}
 if(path==='/api/login'&&req.method==='POST'){must(passwordLoginEnabled(env),'ورود با رمز روی این میزبان فعال نیست',503);await limited(db,'login:'+clientIp(req),20);const b=await req.json();const given=await hash(String(b?.password||''));const expected=env.OWNER_PASSWORD_HASH?String(env.OWNER_PASSWORD_HASH).toLowerCase():await hash(String(env.OWNER_PASSWORD));must(same(given,expected),'رمز عبور نادرست است',401);return J({ok:true},200,{'Set-Cookie':await issueCookie(env,env.OWNER_ID||'owner',env.OWNER_EMAIL||'',u.protocol==='https:')});}
 if(path==='/api/logout'&&req.method==='POST')return J({ok:true},200,{'Set-Cookie':clearCookie(u.protocol==='https:')});
 if(path==='/api/owner'&&req.method==='GET'){await owner(req,env);return J({salons:await all(db,'SELECT id,slug,name,telegram_chat_id IS NOT NULL AS telegram,(SELECT count(*) FROM portfolio p WHERE p.salon_id=salons.id AND p.published=1) AS portfolio,(SELECT count(*) FROM leads l WHERE l.salon_id=salons.id) AS leads FROM salons ORDER BY created_at DESC'),bot:{token:botReady(env),secret:!!env.TELEGRAM_WEBHOOK_SECRET,username:(env.TELEGRAM_BOT_USERNAME||'').replace(/^@/,'')},image:!!env.KIE_API_KEY,sms:{ready:smsReady(env),otp:otpEnabled(env),invite:inviteEnabled(env)}});}
 if(path==='/api/owner/webhook'&&req.method==='POST'){await owner(req,env);return J(await setWebhook(env,env.APP_ORIGIN||u.origin));}
 if(path==='/api/salons'&&req.method==='POST'){const who=await owner(req,env);const b=await req.json(),id=uid();must(/^[a-z][a-z0-9-]{2,45}$/.test(b.slug),'نشانی سالن باید انگلیسی و حداقل سه حرف باشد');must(text(b.name||'',100).length>=2,'نام سالن را بنویسید');await run(db,'INSERT INTO salons(id,slug,owner_id,name,created_at,settings) VALUES(?,?,?,?,?,?)',id,b.slug,who.user||'owner',text(b.name,100),Date.now(),JSON.stringify({generation_enabled:true}));return J({id,slug:b.slug});}
 const match=path.match(/^\/api\/s\/([a-z0-9-]+)(?:\/(.*))?$/);must(match,'مسیر پیدا نشد',404);const salon=await one(db,'SELECT * FROM salons WHERE slug=?',match[1]);must(salon,'سالن پیدا نشد',404);const route=match[2]||'',cfg=parse(salon.settings);
 const readOnly=route==='public'||route==='owner'||route.startsWith('media/')||route.startsWith('generation/');
 must(route==='session'?['GET','POST'].includes(req.method):req.method===(readOnly?'GET':'POST'),'متد مجاز نیست',405);
 if(route==='public')return J({salon:publicSalon(salon),portfolio:await all(db,'SELECT id,title,category,description,stylist,images,try_on,1 AS published FROM portfolio WHERE salon_id=? AND published=1 AND permission=1 ORDER BY created_at DESC',salon.id),generation:!!env.KIE_API_KEY&&!!cfg.generation_enabled,reference:!!cfg.reference_verified,telegram:!!salon.telegram_chat_id&&botReady(env),otp:otpEnabled(env),notice:'خروجی شبیه‌سازی پیشنهادی است و تضمین اجرا نیست.'});
 if(route==='session'&&req.method==='POST'){await limited(db,'session:'+salon.id+':'+clientIp(req),30);const {raw}=await newSession(db,salon);return J({ok:true},200,{'Set-Cookie':cookie(raw)});}
 if(route.startsWith('owner')){
  await owner(req,env);const r=route.slice(6),b=req.method==='GET'?{}:await req.json();
  if(!r&&req.method==='GET')return J({salon:{...publicSalon(salon),settings:cfg,telegram:!!salon.telegram_chat_id,link_pending:!!salon.telegram_code_hash&&salon.telegram_code_expires>Date.now()},portfolio:await all(db,'SELECT id,title,category,images,created_at FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC',salon.id),leads:await all(db,'SELECT id,name,look,status,attempts,last_error,created_at FROM leads WHERE salon_id=? ORDER BY created_at DESC LIMIT 50',salon.id),bot:{token:botReady(env),secret:!!env.TELEGRAM_WEBHOOK_SECRET,username:(env.TELEGRAM_BOT_USERNAME||'').replace(/^@/,'')},image:!!env.KIE_API_KEY});
  if(r==='profile'){const p={...parse(salon.profile),...(b.profile||{})};for(const k of PROFILE_LINKS)p[k]=safeLink(p[k]||'');for(const k of PROFILE_TEXT)p[k]=text(p[k]||'',1000);p.phone=digits(p.phone||'').replace(/[\s()-]/g,'');must(!p.phone||/^\+?\d{5,15}$/.test(p.phone),'شمارهٔ تماس سالن معتبر نیست');for(const k of PROFILE_IMAGES)if(p[k])must(await one(db,"SELECT 1 FROM media WHERE id=? AND salon_id=? AND kind='brand'",p[k],salon.id),'عکس برند معتبر نیست');await run(db,'UPDATE salons SET name=?,profile=? WHERE id=?',text(b.name||salon.name,100),JSON.stringify(p),salon.id);return J({ok:true});}
  if(r==='settings'){const s={generation_enabled:!!b.generation_enabled,reference_verified:!!b.reference_verified,image_model:b.image_model==='fast'?'fast':'pro'};await run(db,'UPDATE salons SET settings=? WHERE id=?',JSON.stringify(s),salon.id);return J({ok:true});}
  if(r==='telegram-link')return J(await newLinkCode(db,salon,env));
  if(r==='telegram-unlink'){await run(db,'UPDATE salons SET telegram_chat_id=NULL,telegram_code_hash=NULL,telegram_code_expires=NULL WHERE id=?',salon.id);return J({ok:true});}
  if(r==='portfolio/delete'){await run(db,'DELETE FROM portfolio WHERE id=? AND salon_id=?',b.id,salon.id);return J({ok:true});}
  if(r==='leads/retry'){await run(db,"UPDATE leads SET status='retry',attempts=0 WHERE id=? AND salon_id=? AND status='failed'",b.id,salon.id);const l=await one(db,'SELECT * FROM leads WHERE id=? AND salon_id=?',b.id,salon.id);must(l,'درخواست یافت نشد',404);return J({delivered:await deliverLead(env,l)});}
  throw new Problem(404,'مسیر مدیریت یافت نشد');
 }
 if(route==='upload'&&req.method==='POST'){const kind=u.searchParams.get('kind')||'original';let s=null;if(kind==='brand')await owner(req,env);else{must(['original','reference'].includes(kind));s=await session(req,db,salon);await limited(db,'upload:'+s.id,30);}const bytes=new Uint8Array(await req.arrayBuffer());return J({id:await putImage(env,salon,s,bytes,kind)});}
 if(route.startsWith('media/')){const id=route.slice(6),m=await one(db,'SELECT * FROM media WHERE id=? AND salon_id=?',id,salon.id);must(m,'عکس یافت نشد',404);const profile=parse(salon.profile);let visible=m.kind==='brand'&&PROFILE_IMAGES.some(k=>profile[k]===id);if(!visible)visible=!!await one(db,'SELECT 1 FROM portfolio WHERE salon_id=? AND published=1 AND permission=1 AND EXISTS(SELECT 1 FROM json_each(images) WHERE value=?)',salon.id,id);if(!visible){let isOwner=false;try{await owner(req,env);isOwner=true}catch{}if(!isOwner){const s=await session(req,db,salon);await ownMedia(db,s,id);}must(m.kind==='brand'||m.kind==='portfolio'||m.created_at>Date.now()-30*86400000,'مهلت نگهداری عکس تمام شده است',410);}const object=await bucketFor(env).get(m.object_key);must(object,'عکس در دسترس نیست',410);return new Response(object.body,{headers:{'Content-Type':m.mime,'Cache-Control':visible?'public,max-age=300':'private,no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'"}});}
 const s=await session(req,db,salon);
 if(route==='session')return J({ok:true,verified:!!s.verified_at,name:s.verified_at?s.name:'',phone:s.verified_at?s.phone:''});
 if(route==='otp/send'&&req.method==='POST'){
  must(otpEnabled(env),'تأیید با پیامک فعال نیست',503);
  const b=await req.json(),name=text(String(b.name||''),100);must(name.length>=3,'نام و نام خانوادگی را بنویس');const number=phone(b.phone),now=Date.now();
  // Two minutes between codes, for this session and for this number across sessions.
  const last=await one(db,'SELECT max(sent_at) AS t FROM otps WHERE session_id=? OR phone=?',s.id,number);
  if(last?.t&&last.t>now-OTP_GAP){const wait=Math.ceil((last.t+OTP_GAP-now)/1000);throw new Problem(429,'برای کد تازه '+wait.toLocaleString('fa-IR')+' ثانیهٔ دیگر صبر کن');}
  await limited(db,'otp-session:'+s.id,5);await limited(db,'otp-phone:'+number,6);await limited(db,'otp-ip:'+clientIp(req),12);await limited(db,'otp-salon:'+salon.id,300);
  const code=String(10000+crypto.getRandomValues(new Uint32Array(1))[0]%90000);
  await run(db,'INSERT INTO otps(session_id,salon_id,phone,name,code_hash,tries,sent_at,expires_at) VALUES(?,?,?,?,?,0,?,?) ON CONFLICT(session_id) DO UPDATE SET phone=excluded.phone,name=excluded.name,code_hash=excluded.code_hash,tries=0,sent_at=excluded.sent_at,expires_at=excluded.expires_at',s.id,salon.id,number,name,await otpHash(env,s,number,code),now,now+OTP_TTL);
  const r=await sendPattern(env,number,env.MELIPAYAMAK_OTP_BODY_ID,[code]);await logSms(db,{salon_id:salon.id,kind:'otp',phone:number,...r});
  if(!r.ok&&!r.uncertain){await run(db,'DELETE FROM otps WHERE session_id=?',s.id);console.error('otp sms rejected',r.error);throw new Problem(502,'ارسال پیامک انجام نشد؛ کمی بعد دوباره امتحان کن');}
  return J({ok:true,expires_in:OTP_TTL/1000,resend_in:OTP_GAP/1000});
 }
 if(route==='otp/verify'&&req.method==='POST'){
  await limited(db,'otp-verify:'+s.id,30);
  const b=await req.json(),code=digits(String(b.code||'')).replace(/\D/g,'');const o=await one(db,'SELECT * FROM otps WHERE session_id=?',s.id);
  must(o&&o.expires_at>Date.now(),'کد منقضی شده؛ کد تازه بگیر',410);must(o.tries<OTP_TRIES,'تلاش‌های اشتباه زیاد شد؛ کد تازه بگیر',429);
  await run(db,'UPDATE otps SET tries=tries+1 WHERE session_id=?',s.id);
  must(/^\d{5}$/.test(code)&&same(await otpHash(env,s,o.phone,code),o.code_hash),'کد درست نیست',400);
  await run(db,'UPDATE sessions SET phone=?,name=?,verified_at=? WHERE id=?',o.phone,o.name,Date.now(),s.id);await run(db,'DELETE FROM otps WHERE session_id=?',s.id);
  return J({ok:true,verified:true,name:o.name,phone:o.phone});
 }
 if(route==='leads'&&req.method==='POST'){
  const b=await req.json();must(b.data_consent===true,'رضایت ارسال عکس برای سالن لازم است');must(/^[a-f0-9-]{36}$/.test(b.idem),'شناسه درخواست معتبر نیست');
  const old=await one(db,'SELECT id,status FROM leads WHERE session_id=? AND idem=?',s.id,b.idem);if(old)return J({id:old.id,delivered:old.status==='sent'});
  must(salon.telegram_chat_id&&botReady(env),'این سالن هنوز ارسال آنلاین را فعال نکرده؛ مستقیم با سالن تماس بگیرید',503);
  const verified=!!s.verified_at;const name=verified?s.name:text(b.name||'',100);must(name.length>=2,'نام را وارد کنید');const number=verified?s.phone:phone(b.phone);
  let handle=text(String(b.telegram||''),40).replace(/^@/,'').replace(/^https?:\/\/t\.me\//,'');if(handle)must(/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(handle),'آیدی تلگرام معتبر نیست');
  const original=await ownMedia(db,s,b.original_id);must(original.kind==='original','عکس خودتان لازم است');
  if(b.reference_id)await ownMedia(db,s,b.reference_id);
  if(b.preview_id){const p=await ownMedia(db,s,b.preview_id);must(p.kind==='simulation','نتیجهٔ معتبر انتخاب کنید');must(await one(db,"SELECT 1 FROM generations WHERE result_id=? AND original_id=? AND COALESCE(reference_id,'')=? AND salon_id=?",b.preview_id,b.original_id,b.reference_id||'',salon.id),'نتیجه باید با عکس و مدل انتخابی مطابقت داشته باشد');}
  await limited(db,'lead:'+s.id,10);await limited(db,'lead-ip:'+salon.id+':'+clientIp(req),20);
  const id=uid();
  await run(db,'INSERT INTO leads(id,salon_id,session_id,name,phone,telegram,original_id,reference_id,preview_id,look,color,note,idem,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)',id,salon.id,s.id,name,number,handle,b.original_id,b.reference_id||null,b.preview_id||null,text(b.look||'',150),text(b.color||'',120),text(b.note||'',1000),b.idem,Date.now());
  const delivered=await deliverLead(env,await one(db,'SELECT * FROM leads WHERE id=?',id));
  return J({id,delivered});
 }
 if(route==='views'&&req.method==='POST'){
  needVerified(env,s);const b=await req.json();must(env.KIE_API_KEY&&cfg.generation_enabled,'تولید فعال نیست',503);must(/^[a-f0-9-]{36}$/.test(b.idem));const existing=await one(db,'SELECT id,state FROM generations WHERE session_id=? AND idem=?',s.id,b.idem);if(existing)return J(existing);const base=await one(db,"SELECT * FROM generations WHERE id=? AND session_id=? AND salon_id=? AND state='success'",b.parent,s.id,salon.id);must(base?.result_id,'عکس پایه معتبر نیست');const m=await ownMedia(db,s,base.result_id),id=uid(),now=Date.now();await limited(db,'views:'+salon.id,20);await run(db,"INSERT INTO generations(id,salon_id,session_id,idem,kind,state,original_id,created_at,updated_at) VALUES(?,?,?,?,'views','creating',?,?,?)",id,salon.id,s.id,b.idem,base.original_id,now,now);
  try{const img=await uploadProvider(env,m);const task=await createImageTask(env,cfg,{prompt:'Turntable sheet for a 360-degree hair viewer. Exact 4 columns by 2 rows grid of 8 equal tiles of this same adult woman with identical hair color and hairstyle, head and shoulders, camera orbiting her at eye level in row-major order: 0 (front), 45, 90 (her left profile), 135, 180 (back of head), 225, 270 (her right profile), 315 degrees. Same framing, scale, lighting and plain background in every tile so the tiles play as a smooth rotation. No labels, borders, gaps or text. Identity must stay the same. Unseen views are estimates.',image_input:[img],aspect_ratio:'3:2',resolution:'2K',output_format:'jpg'});await run(db,"UPDATE generations SET state='waiting',task_id=? WHERE id=?",task.taskId,id);return J({id,state:'waiting'});}catch{await run(db,"UPDATE generations SET state='unknown' WHERE id=?",id);throw new Problem(502,'ارسال نامشخص؛ بدون بازتولید خودکار');}
 }
 if(route==='generate'&&req.method==='POST'){needVerified(env,s);const b=await req.json();must(b.image_consent===true,'رضایت ارسال عکس برای پردازش لازم است');must(cfg.generation_enabled&&env.KIE_API_KEY,'تولید واقعی این سالن هنوز فعال نشده است',503);must(/^[a-f0-9-]{36}$/.test(b.idem));const old=await one(db,'SELECT * FROM generations WHERE session_id=? AND idem=?',s.id,b.idem);if(old)return J({id:old.id,state:old.state});const original=await ownMedia(db,s,b.original_id);must(original.kind==='original','عکس چهره لازم است');let reference=null;if(b.reference_id){must(cfg.reference_verified,'انتقال عکس مرجع هنوز آزمون واقعی و فعال‌سازی نشده است',503);reference=await ownMedia(db,s,b.reference_id);must(['style','color','both'].includes(b.transfer));}else must(Number.isInteger(b.style)&&styles[b.style],'مدل معتبر انتخاب کنید');const color=text(b.color||'',120);await limited(db,'generation:'+salon.id+':'+new Date().toISOString().slice(0,10),50);const id=uid(),now=Date.now();await run(db,'INSERT INTO generations(id,salon_id,session_id,idem,state,original_id,reference_id,style,transfer,color,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',id,salon.id,s.id,b.idem,'creating',b.original_id,b.reference_id||null,b.style??null,b.transfer||'catalog',color,now,now);
  try{const images=[await uploadProvider(env,original)];if(reference)images.push(await uploadProvider(env,reference));const job=await createImageTask(env,cfg,{prompt:transferPrompt(reference?b.transfer:'catalog',styles[b.style]?.[1]||'',color),image_input:images,aspect_ratio:'3:4',resolution:'2K',output_format:'jpg'});await run(db,"UPDATE generations SET state='waiting',task_id=? WHERE id=?",job.taskId,id);return J({id,state:'waiting'});}catch{await run(db,"UPDATE generations SET state='unknown' WHERE id=?",id);throw new Problem(502,'وضعیت ارسال نامشخص است؛ برای جلوگیری از هزینه تکراری، درخواست تازه خودکار ساخته نمی‌شود');}
 }
 if(route.startsWith('generation/')){const id=route.slice(11),g=await one(db,'SELECT * FROM generations WHERE id=? AND salon_id=? AND session_id=?',id,salon.id,s.id);must(g,'درخواست تولید یافت نشد',404);if(g.result_id)return J({state:'success',result_id:g.result_id});if(!g.task_id)return J({state:g.state});const d=await provider(env,'/api/v1/jobs/recordInfo?taskId='+encodeURIComponent(g.task_id));if(d.state==='success'){const link=parse(d.resultJson).resultUrls?.[0];must(link&&new URL(link).protocol==='https:','خروجی سرویس معتبر نیست',502);const res=await fetch(link,{signal:AbortSignal.timeout(20000)});must(res.ok,'دریافت خروجی ممکن نشد',502);must(Number(res.headers.get('content-length')||0)<=12*1024*1024,'خروجی بیش از حد بزرگ است',502);const bytes=new Uint8Array(await res.arrayBuffer());const media=await putImage(env,salon,s,bytes,'simulation');const win=await run(db,"UPDATE generations SET state='success',result_id=?,updated_at=? WHERE id=? AND result_id IS NULL",media,Date.now(),g.id);if(!win.meta.changes){await bucketFor(env).delete(salon.id+'/'+media);await run(db,'DELETE FROM media WHERE id=?',media);}const done=await one(db,'SELECT result_id FROM generations WHERE id=?',g.id);return J({state:'success',result_id:done.result_id});}await run(db,'UPDATE generations SET state=?,updated_at=? WHERE id=?',d.state,Date.now(),g.id);return J({state:d.state});}
 throw new Problem(404,'مسیر یافت نشد');
}
export function errorResponse(e){if(String(e.message).includes('UNIQUE constraint'))return J({error:'این مورد قبلاً ثبت شده است؛ صفحه را تازه کنید'},409);return J({error:e instanceof Problem?e.message:'خطای داخلی؛ درخواست تازه تکراری ارسال نکنید'},e.status||500);}
