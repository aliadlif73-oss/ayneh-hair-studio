// Builds the fictional demo salon «سالن زیبایی آینه» on the live site, for the owner to try the
// whole product end to end. Run by .github/workflows/demo-salon.yml (never by the Worker).
//  MODE=images: makes the logo, cover and manager portrait with the project's KIE key into
//               demo/ayneh/ (missing ones only, unless FORCE=1; ONLY=logo,cover,portrait).
//  MODE=create: signs in as the owner (OWNER_PASSWORD), creates /s/ayneh if it does not exist,
//               uploads the three images and fills the whole profile. It never prints the bot
//               link: the owner takes it from /admin/ayneh («اتصال ربات»).
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const mode=process.env.MODE||'images',dir='demo/ayneh';mkdirSync(dir,{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const SLUG='ayneh',NAME='سالن زیبایی آینه';
const PROFILE={
 bio:'سالن زیبایی آینه از سال ۱۳۹۸ در سعادت‌آباد تهران کنار شماست. تخصص ما رنگ‌های طبیعی و بالیاژ دست‌ساز، کوتاهی‌های مدرن، کاشت و طراحی ناخن و اکستنشن مژه است. قبل از هر خدمت، نتیجه را روی عکس خودتان می‌بینید و با آرایشگر مشاورهٔ رایگان می‌گیرید. ابزارها استریل و محصولات اورجینال است و فضای سالن آرام و خصوصی، فقط برای بانوان.',
 address:'تهران، سعادت‌آباد، خیابان سرو غربی، کوچهٔ نهم، پلاک ۱۴، طبقهٔ دوم',
 map:'https://www.google.com/maps/search/?api=1&query=Sarv+Gharbi+Saadat+Abad+Tehran',
 hours:'شنبه تا پنج‌شنبه، ۱۰ صبح تا ۸ شب (جمعه‌ها با هماهنگی قبلی)',
 phone:'02100000000',
 instagram:'https://instagram.com/ayneh.salon.demo',
 manager:'مهسا کریمی'
};
const IMAGES={
 logo:{ratio:'1:1',size:[640,640],prompt:'A refined minimalist emblem logo for a luxury women\'s beauty salon called "Mirror". A slim tall arched mirror outline, like a Persian iwan window, drawn in elegant brushed-gold line art; inside the arch a single graceful flowing S-shaped hair-wave stroke in the same gold. Centred on a solid deep teal background (#0c6b6b) that fills the whole square edge to edge. Flat vector style, crisp clean lines, perfectly symmetrical, generous even margin so it still reads inside a circle crop. Absolutely no letters, no text, no words, no watermark.'},
 cover:{ratio:'16:9',size:[1600,800],prompt:'Wide interior photograph of a modern upscale women-only hair and beauty salon in Tehran: a row of tall arched mirrors with warm brass frames, deep teal velvet styling chairs, pale travertine floor, soft warm daylight from large windows, a few green plants, a neat manicure table and a lash bed visible further back, calm, clean and luxurious. No people, no faces, no text, no logos, no signage. Professional architectural photography, natural colours, high detail.'},
 portrait:{ratio:'4:5',size:[600,750],prompt:'Professional head-and-shoulders portrait of a confident, friendly Iranian woman in her late thirties, the manager of a beauty salon, wearing a stylish loose silk headscarf in soft beige over her hair and an elegant black blazer, warm natural smile, looking at the camera. Soft studio light, softly blurred salon interior behind her in teal and brass tones. Natural skin texture, light natural makeup, photorealistic. No text, no watermark.'}
};
async function images(){
 const key=process.env.KIE_API_KEY;if(!key){console.log('KIE_API_KEY is not set');process.exit(1)}
 const sharp=(await import('sharp')).default,force=process.env.FORCE==='1',only=(process.env.ONLY||'').split(',').map(x=>x.trim()).filter(Boolean);
 let last=0;
 async function kie(path,body){const w=last+1500-Date.now();if(w>0)await sleep(w);last=Date.now();const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200)throw new Error('KIE '+r.status+' '+(d.msg||JSON.stringify(d)).slice(0,200));return d.data}
 for(const [name,x] of Object.entries(IMAGES)){
  const file=dir+'/'+name+'.jpg';
  if(only.length&&!only.includes(name))continue;
  if(existsSync(file)&&!force){console.log(name,'exists, skipped');continue}
  const task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input:{prompt:x.prompt,image_input:[],aspect_ratio:x.ratio,resolution:'2K',output_format:'jpg'}});
  let url=null;for(let t=0;t<72&&!url;t++){await sleep(5000);const d=await kie('/api/v1/jobs/recordInfo?taskId='+encodeURIComponent(task.taskId));if(d.state==='success')url=JSON.parse(d.resultJson).resultUrls?.[0];if(d.state==='fail')throw new Error(name+' failed: '+(d.failMsg||''))}
  if(!url)throw new Error(name+' timed out');
  const img=Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(file,await sharp(img).resize(x.size[0],x.size[1],{fit:'cover',position:'attention'}).jpeg({quality:84,mozjpeg:true}).toBuffer());
  console.log(name,'✓');
 }
}
async function signIn(){
 const base=String(process.env.APP_ORIGIN||'').replace(/\/$/,'');if(!base){console.log('APP_ORIGIN is not set');process.exit(1)}
 if(!process.env.OWNER_PASSWORD){console.log('OWNER_PASSWORD secret is not set; cannot sign in');process.exit(1)}
 const login=await fetch(base+'/api/login',{method:'POST',headers:{'Content-Type':'application/json',Origin:base},body:JSON.stringify({password:process.env.OWNER_PASSWORD})});
 if(!login.ok){console.log('sign-in failed:',login.status,(await login.text()).slice(0,200));process.exit(1)}
 const cookie=login.headers.getSetCookie().map(c=>c.split(';')[0]).join('; ');
 const call=async(path,body,raw)=>{const r=await fetch(base+path,{method:body===undefined?'GET':'POST',headers:{Cookie:cookie,Origin:base,...(raw?{'Content-Type':'image/jpeg'}:{'Content-Type':'application/json'})},...(body===undefined?{}:{body:raw?body:JSON.stringify(body)})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(path+' '+r.status+' '+(d.error||''));return d};
 return {base,call};
}
async function create(){
 const {base,call}=await signIn();
 let exists=true;try{await call('/api/s/'+SLUG+'/owner')}catch{exists=false}
 if(!exists){await call('/api/salons',{slug:SLUG,name:NAME});console.log('salon created: /s/'+SLUG)}else console.log('salon exists: /s/'+SLUG+' (updating its profile)');
 const ids={};for(const k of Object.keys(IMAGES)){ids[k]=(await call('/api/s/'+SLUG+'/upload?kind=brand',readFileSync(dir+'/'+k+'.jpg'),true)).id;console.log(k,'uploaded')}
 await call('/api/s/'+SLUG+'/owner/profile',{name:NAME,profile:{...PROFILE,...ids}});console.log('profile filled');
 await call('/api/s/'+SLUG+'/owner/settings',{generation_enabled:true,reference_verified:true,image_model:'pro'});console.log('simulation on');
 const o=await call('/api/s/'+SLUG+'/owner');console.log('telegram linked:',!!o.salon.telegram,'· portfolio items:',o.portfolio.length);
 console.log('Page: '+base+'/s/'+SLUG+' · Console: '+base+'/admin/'+SLUG);
}
// MODE=portfolio: adds demo/ayneh/portfolio/list.json ([{file,title,line,category}]) as the salon's
// own work; a title already on the page is skipped, so reruns add only what is missing.
async function portfolio(){
 const {call}=await signIn();
 const list=JSON.parse(readFileSync(dir+'/portfolio/list.json','utf8'));
 // REPLACE=1 swaps photos already on the page (same title) for the files here.
 const current=(await call('/api/s/'+SLUG+'/owner')).portfolio,replace=process.env.REPLACE==='1';
 for(const it of list){
  const old=current.filter(x=>x.title===it.title);
  if(old.length&&!replace){console.log('exists:',it.line,it.title);continue}
  for(const o of old)await call('/api/s/'+SLUG+'/owner/portfolio/delete',{id:o.id});
  const m=await call('/api/s/'+SLUG+'/upload?kind=portfolio',readFileSync(dir+'/portfolio/'+it.file),true);
  await call('/api/s/'+SLUG+'/owner/portfolio/add',{media_id:m.id,title:it.title,line:it.line,category:it.category||''});
  console.log(old.length?'replaced:':'added:',it.line,it.title);
 }
 const pub=(await call('/api/s/'+SLUG+'/public')).portfolio;const by={};for(const x of pub)by[x.line]=(by[x.line]||0)+1;
 console.log('on the page:',JSON.stringify(by));
}
// MODE=settings: sets the salon's daily image cap (DAILY_LIMIT, 0 = no cap), keeping its other settings.
async function settings(){
 const {call}=await signIn();const cur=(await call('/api/s/'+SLUG+'/owner')).salon.settings||{};
 const lim=Number(process.env.DAILY_LIMIT??50);
 await call('/api/s/'+SLUG+'/owner/settings',{generation_enabled:!!cur.generation_enabled,reference_verified:!!cur.reference_verified,image_model:cur.image_model||'pro',daily_limit:lim});
 const now=(await call('/api/s/'+SLUG+'/owner')).salon.settings;console.log('daily_limit:',now.daily_limit,'· generation:',now.generation_enabled,'· model:',now.image_model);
}
if(mode==='settings')await settings();else if(mode==='images')await images();else if(mode==='create')await create();else if(mode==='portfolio')await portfolio();else{console.log('MODE must be images, create or portfolio');process.exit(1)}
