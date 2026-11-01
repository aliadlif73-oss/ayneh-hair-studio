// Generates one lookbook photo per ready-made style (worker/legacy.js `styles`) with the
// project's own KIE key and writes public/catalog/NN.webp (NN = style index + 1), plus a
// before/after demo pair (demo-before.webp, demo-after.webp) for the customer page.
// Run by .github/workflows/catalog.yml; existing files are skipped unless FORCE=1, so a rerun
// only pays for what is missing. Needs KIE_API_KEY in the environment and `sharp` installed.
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {styles} from '../worker/legacy.js';
import {STYLE_DETAILS} from '../worker/domain.js';

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

async function kie(path,body){const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200)throw new Error('KIE '+r.status+' '+(d.msg||JSON.stringify(d)).slice(0,200));return d.data}
// Best model first; if the account does not have it, fall back once.
async function generate(input){
 let task;
 try{task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input})}
 catch(e){console.log('  nano-banana-pro rejected ('+e.message+'), using nano-banana-2');task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-2',input})}
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
 catch(e){console.log(n,s[0],'failed:',e.message);failed++}
}

// Demo pair: an everyday selfie, then the same photo edited by the same pipeline customers use.
const before=out+'/demo-before.webp',after=out+'/demo-after.webp';
if((!existsSync(before)||!existsSync(after)||force)&&(!only.length||only.includes('demo'))){
 try{
  const b=await generate({prompt:'Photorealistic casual smartphone selfie of an Iranian woman in her late twenties with olive skin, at home by a window in soft daylight, looking at the camera with a slight smile. Her hair is plain shoulder-length straight dark brown hair, no styling, visible and uncovered. Head and shoulders, vertical framing, plain light wall behind her. Natural skin, no filter, no text.',image_input:[],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  const a=await generate({prompt:'Professional hair-salon consultation preview. Photo 1 is the client. Edit ONLY her hair. Keep her exact face, skin, expression, clothing, background, framing and lighting unchanged. HAIR: give her a butterfly haircut: long hair with short face-framing layers from the chin and long layers below, big bouncy blow-out volume, reaching past the shoulders. HAIR COLOR: hand-painted honey balayage on a darker brown base, soft blended root. Real strand detail, natural hairline, light matching the photo. One photorealistic photo, same composition. No text.',image_input:[b],aspect_ratio:'3:4',resolution:'1K',output_format:'jpg'});
  await save(b,before,450,600);await save(a,after,450,600);console.log('demo ✓');made+=2;
 }catch(e){console.log('demo failed:',e.message);failed++}
}
console.log('done: '+made+' made, '+failed+' failed');
if(failed&&!made)process.exit(1);
