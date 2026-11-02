// Generates one lookbook photo per ready-made style with the project's own KIE key:
//  - hair (worker/legacy.js `styles`) → public/catalog/NN.webp, plus demo-before/after.webp;
//  - nails and lashes (worker/lines.js) → public/catalog/nails/NN.webp, public/catalog/lashes/NN.webp,
//    each with its own demo-before/after.webp.
// ONLY limits a run: hair numbers (3,7), 'demo', 'nails' / 'n3', 'lashes' / 'l2', 'demo-nails', 'demo-lashes'.
// Run by .github/workflows/catalog.yml; existing files are skipped unless FORCE=1, so a rerun
// only pays for what is missing. Needs KIE_API_KEY in the environment and `sharp` installed.
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {styles} from '../worker/legacy.js';
import {STYLE_DETAILS} from '../worker/domain.js';
import {NAIL_STYLES,LASH_STYLES,LINE_OPTIONS,linePrompt} from '../worker/lines.js';

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
  const b=await generate({prompt:'Photorealistic casual smartphone selfie of an Iranian woman in her late twenties with olive skin, at home by a window in soft daylight, looking at the camera with a slight smile. Her hair is plain shoulder-length straight dark brown hair, no styling, visible and uncovered. Head and shoulders, vertical framing, plain light wall behind her. Natural skin, no filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  const a=await generate({prompt:'Professional hair-salon consultation preview. Photo 1 is the client. Edit ONLY her hair. Keep her exact face, skin, expression, clothing, background, framing and lighting unchanged. HAIR: give her a butterfly haircut: long hair with short face-framing layers from the chin and long layers below, big bouncy blow-out volume, reaching past the shoulders. HAIR COLOR: hand-painted honey balayage on a darker brown base, soft blended root. Real strand detail, natural hairline, light matching the photo. One photorealistic photo, same composition. No text.',image_input:[b],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  await save(b,before,450,600);await save(a,after,450,600);console.log('demo ✓');made+=2;
 }catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log('demo failed:',e.message);failed++}
}
// Nails and lashes: close-ups of Iranian women's hands and eyes.
const hands=['light-olive','fair','warm beige','medium olive','light-brown'];
const nailShot=(d,i)=>'Photorealistic beauty close-up photograph of the hand of an Iranian woman with '+hands[i%hands.length]+' skin, back of the hand toward the camera, fingers relaxed and slightly apart, resting on a soft pale grey-green fabric, showing these nails: '+d+'. Medium-length almond-shaped nails unless the design calls for another shape. Soft even studio light, sharp focus on the nails, natural skin texture, no rings. No text, no logo, no watermark.';
const lashShot=(d,i)=>'Photorealistic beauty close-up portrait of '+people[i%people.length]+', framed from the forehead to the lips with the eyes in the upper third, looking straight at the camera with a soft expression, light natural makeup and groomed natural brows, showing these eyelashes: '+d+'. Both eyes sharp, soft even studio light, natural skin texture, seamless pale grey-green background. No text, no logo, no watermark.';
const want=(tag,i)=>!only.length||only.includes(tag)||only.includes(tag[0]+String(i+1));
for(const [line,list,shot] of [['nails',NAIL_STYLES,nailShot],['lashes',LASH_STYLES,lashShot]]){
 const dir=out+'/'+line;mkdirSync(dir,{recursive:true});
 for(const [i,s] of list.entries()){
  const n=String(i+1).padStart(2,'0'),file=dir+'/'+n+'.webp';
  if(!want(line,i))continue;
  if(existsSync(file)&&!force){console.log(line,n,'exists, skipped');continue}
  try{await save(await generate({prompt:shot(s[3],i),image_input:[],aspect_ratio:'4:5',resolution:'1K',output_format:'jpg'}),file,480,600);console.log(line,n,s[0],'✓');made++}
  catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log(line,n,s[0],'failed:',e.message);failed++}
 }
 // Demo pair, edited by the same prompt customers get.
 const b1=dir+'/demo-before.webp',a1=dir+'/demo-after.webp';
 if((!existsSync(b1)||!existsSync(a1)||force)&&(!only.length||only.includes('demo-'+line))){
  try{
   const before=line==='nails'
    ?await generate({prompt:'Photorealistic casual smartphone photo of the hand of an Iranian woman with light-olive skin, back of the hand toward the camera, fingers slightly apart, resting on a wooden table at home in soft daylight. Short natural bare nails, clean, no polish, no rings. No text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'})
    :await generate({prompt:'Photorealistic casual close-up selfie of an Iranian woman in her late twenties with olive skin, framed from the forehead to the lips, looking at the camera, soft daylight from a window, natural short lashes with no mascara and no extensions, light natural makeup. No filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
   const prompt=line==='nails'?linePrompt('nails','catalog',NAIL_STYLES[1][3],{shape:4,length:1},''):linePrompt('lashes','catalog',LASH_STYLES[2][3],{map:1,length:1},'');
   const after=await generate({prompt,image_input:[before],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
   await save(before,b1,450,600);await save(after,a1,450,600);console.log(line,'demo ✓');made+=2;
  }catch(e){if(e instanceof NoCredit){console.log(e.message+' — top up KIE and run this workflow again.');process.exit(1)}console.log(line,'demo failed:',e.message);failed++}
 }
}
console.log('done: '+made+' made, '+failed+' failed');
if(failed&&!made)process.exit(1);
