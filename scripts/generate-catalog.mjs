// Generates one lookbook photo per ready-made style with the project's own KIE key:
//  - hair (worker/legacy.js `styles`) → public/catalog/NN.webp, plus demo-before/after.webp;
//  - hair colour, nails and lashes (worker/lines.js) → public/catalog/color/NN.webp,
//    public/catalog/nails/NN.webp, public/catalog/lashes/NN.webp, each with its own demo-before/after.webp.
// ONLY limits a run: hair numbers (3,7), 'demo', 'color' / 'r3', 'nails' / 'n3', 'lashes' / 'l2',
// 'demo-color', 'demo-nails', 'demo-lashes'.
// Run by .github/workflows/catalog.yml; existing files are skipped unless FORCE=1, so a rerun
// only pays for what is missing. Needs KIE_API_KEY in the environment and `sharp` installed.
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {styles} from '../worker/legacy.js';
import {STYLE_DETAILS,transferPrompt} from '../worker/domain.js';
import {NAIL_STYLES,LASH_STYLES,COLOR_STYLES,NAIL_SHOTS,LASH_SHOTS,COLOR_SHOTS,linePrompt} from '../worker/lines.js';

const key=process.env.KIE_API_KEY;
if(!key){console.log('KIE_API_KEY is not set; nothing generated.');process.exit(0)}
const force=process.env.FORCE==='1';
const only=(process.env.ONLY||'').split(',').map(x=>x.trim()).filter(Boolean);
const out='public/catalog';mkdirSync(out,{recursive:true});
const sharp=(await import('sharp')).default;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// Iranian women with varied, everyday looks, so customers see faces and colours like their own.
// Hair is visible: this is a women-only salon lookbook.
const people=[
 'an Iranian woman in her late twenties with olive skin, dark brown eyes and natural thick brows',
 'an Iranian woman in her thirties with fair skin and hazel eyes',
 'an Iranian woman in her early twenties with light-brown skin and dark eyes',
 'an Iranian woman in her forties with warm beige skin and a kind expression',
 'an Iranian woman in her thirties with medium olive skin and green-brown eyes'
];
const shades=['dark chocolate brown','smoky olive brown (دودی زیتونی)','warm coffee-with-milk brown (نسکافه‌ای)','soft black','dark brown with subtle honey balayage','medium chestnut brown'];
const prompt=(s,i)=>'Photorealistic salon lookbook photograph of '+people[i%people.length]+', wearing a simple plain top, showing this hairstyle: '+(STYLE_DETAILS[s[1]]||s[1])+'. '+
 'Head and shoulders, three-quarter view so the cut, length and shape are clearly visible, hair fully in frame. Natural healthy '+shades[i%shades.length]+' hair. '+
 'Soft even studio light, seamless pale grey-green background, sharp focus on the hair, natural skin texture, light natural makeup, no heavy retouching. No text, no logo, no watermark.';

// Out of credit: stop the whole run at once (every further call would fail the same way).
class NoCredit extends Error{}
let lastCall=0;
async function kie(path,body){
 const wait=lastCall+1500-Date.now();if(wait>0)await sleep(wait);lastCall=Date.now();const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200){const msg=(d.msg||JSON.stringify(d)).slice(0,200);if(/credit|balance|top up/i.test(msg))throw new NoCredit('KIE credit is used up: '+msg);throw new Error('KIE '+r.status+' '+msg)}return d.data}
// Best model first; if the account does not have it, fall back once.
async function generate(input){
 let task;
 try{task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input})}
 catch(e){if(e instanceof NoCredit)throw e;console.log('  nano-banana-pro rejected ('+e.message+'), using nano-banana-2');task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-2',input})}
 for(let t=0;t<72;t++){await sleep(5000);const d=await kie('/api/v1/jobs/recordInfo?taskId='+encodeURIComponent(task.taskId));if(d.state==='success')return JSON.parse(d.resultJson).resultUrls?.[0];if(d.state==='fail')throw new Error('task failed: '+(d.failMsg||''))}
 throw new Error('timed out');
}
async function save(url,file,w,h){const img=Buffer.from(await (await fetch(url)).arrayBuffer());writeFileSync(file,await sharp(img).resize(w,h,{fit:'cover',position:'top'}).webp({quality:80}).toBuffer())}

let made=0,failed=0;
for(const [i,s] of styles.entries()){
 const n=String(i+1).padStart(2,'0'),file=out+'/'+n+'.webp';
 if(only.length&&!only.includes(String(i+1)))continue;
 if(existsSync(file)&&!force){console.log(n,'exists, skipped');continue}
 try{await save(await generate({prompt:prompt(s,i),image_input:[],aspect_ratio:'4:5',resolution:'1K',output_format:'jpg'}),file,480,600);console.log(n,s[0],'✓');made++}
 catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log(n,s[0],'failed:',e.message);failed++}
}

// Demo pair: an everyday selfie, then the same photo edited by the same pipeline customers use.
const before=out+'/demo-before.webp',after=out+'/demo-after.webp';
if((!existsSync(before)||!existsSync(after)||force)&&(!only.length||only.includes('demo'))){
 try{
  const b=await generate({prompt:'Photorealistic casual smartphone selfie of an Iranian woman in her late twenties with olive skin, at home by a window in soft daylight, looking at the camera with a slight smile. She wears a modest crew-neck knit sweater in oatmeal beige, clearly visible. Her hair is long, straight, plain dark brown hair reaching well below her shoulders to mid-chest, no styling, visible and uncovered. Head and shoulders, vertical framing, both hands out of frame (the phone is not visible), plain light wall behind her. Natural skin, no filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  // Hairstyle only: the same pipeline customers get, her own colour kept.
  const a=await generate({prompt:transferPrompt('catalog','Short bob',''),image_input:[b],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  await save(b,before,450,600);await save(a,after,450,600);console.log('demo ✓');made+=2;
 }catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log('demo failed:',e.message);failed++}
}
// Nails and lashes: close-ups of Iranian women's hands and eyes.
const hands=['light-olive','fair','warm beige','medium olive','light-brown'];
// The look itself comes from NAIL_SHOTS / LASH_SHOTS (exact colour, finish, shape, placement).
const nailShot=(d,i)=>'Professional nail-salon lookbook photograph. ONE hand of an Iranian woman with '+hands[i%hands.length]+' skin, back of the hand toward the camera, all five fingers relaxed and slightly apart, every fingernail fully visible and in sharp focus, resting on a soft pale grey-green fabric. THE NAILS: '+d+'. The nail design must match this description exactly and be identical on the nails it names; nothing else on the nails. No rings, bracelets or other hand. Soft even studio light, natural skin texture, true colours. No text, no logo, no watermark.';
const lashShot=(d,i)=>'Professional lash-studio lookbook photograph: extreme close-up of the eye area of '+people[i%people.length]+': framed from just above the eyebrows to the middle of the nose, both eyes filling the width of the photo, eyes open and looking straight at the camera. THE UPPER EYELASHES: '+d+'. The lashes must match this description exactly and be clearly the focus of the photo. Light natural makeup, NO eyeliner, NO mascara on the lower lashes, groomed natural brows, no glasses. Both eyes sharp, soft even studio light, natural skin texture, seamless pale grey-green background. No text, no logo, no watermark.';
// Hair colour: the same long, softly waved cut from behind in every photo, so only the colour differs.
const colorShot=(d,i)=>'Professional hair-colour lookbook photograph of an Iranian woman seen from behind at a slight three-quarter angle, head and upper back, her long loose hair with soft natural waves reaching the middle of her back, fully in frame and filling most of the photo, every strand in sharp focus. THE HAIR COLOUR: '+d+'. The colour must match this description exactly, from roots to ends; nothing else in the photo competes with it. Plain off-white top, soft even daylight-balanced studio light that shows the true colour, seamless pale grey-green background. No text, no logo, no watermark.';
const PREFIX={nails:'n',lashes:'l',color:'r'};
const want=(tag,i)=>!only.length||only.includes(tag)||only.includes(PREFIX[tag]+String(i+1));
for(const [line,list,shot,shots] of [['color',COLOR_STYLES,colorShot,COLOR_SHOTS],['nails',NAIL_STYLES,nailShot,NAIL_SHOTS],['lashes',LASH_STYLES,lashShot,LASH_SHOTS]]){
 const dir=out+'/'+line;mkdirSync(dir,{recursive:true});
 for(const [i,s] of list.entries()){
  const n=String(i+1).padStart(2,'0'),file=dir+'/'+n+'.webp';
  if(!want(line,i))continue;
  if(existsSync(file)&&!force){console.log(line,n,'exists, skipped');continue}
  try{await save(await generate({prompt:shot(shots[i]||s[3],i),image_input:[],aspect_ratio:'4:5',resolution:'1K',output_format:'jpg'}),file,480,600);console.log(line,n,s[0],'✓');made++}
  catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log(line,n,s[0],'failed:',e.message);failed++}
 }
 // Demo pair, edited by the same prompt customers get.
 const b1=dir+'/demo-before.webp',a1=dir+'/demo-after.webp';
 if((!existsSync(b1)||!existsSync(a1)||force)&&(!only.length||only.includes('demo-'+line))){
  try{
   const before=line==='color'
    ?await generate({prompt:'Photorealistic casual smartphone selfie of an Iranian woman in her thirties with fair olive skin, at home by a window in soft daylight, looking at the camera with a slight smile. Her hair is long, loose, softly wavy, natural plain dark brown, uncovered and fully visible over her shoulders. Head and shoulders, vertical framing, plain light wall behind her. Natural skin, no filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'})
    :line==='nails'
    ?await generate({prompt:'Photorealistic casual smartphone close-up of the hand of an Iranian woman with light-olive skin: the hand fills most of the frame, back of the hand toward the camera, fingers slightly apart, every nail clearly visible, resting on a wooden table at home in soft daylight. Short natural bare nails, clean, no polish, no rings. No text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'})
    :await generate({prompt:'Photorealistic casual smartphone close-up of the eye area of an Iranian woman in her late twenties with olive skin: framed from the eyebrows to the middle of the nose, both eyes filling the width, eyes open and looking at the camera, soft daylight from a window, her own short natural lashes with no mascara and no extensions, no makeup. No filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
   // The change must be obvious in a small card: honey balayage; glossy red almond nails; dense cat-eye volume lashes.
   const prompt=line==='color'?linePrompt('color','catalog',COLOR_STYLES[14][3],{},''):line==='nails'?linePrompt('nails','catalog',NAIL_STYLES[0][3],{shape:4,length:1},'قرمز'):linePrompt('lashes','catalog',LASH_STYLES[2][3],{map:1,length:2},'مشکی');
   const after=await generate({prompt,image_input:[before],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
   await save(before,b1,450,600);await save(after,a1,450,600);console.log(line,'demo ✓');made+=2;
  }catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log(line,'demo failed:',e.message);failed++}
 }
}
console.log('done: '+made+' made, '+failed+' failed');
if(failed&&!made)process.exit(1);
