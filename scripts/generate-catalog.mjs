// Generates one lookbook photo per ready-made style (worker/legacy.js `styles`) with the
// project's own KIE key and writes public/catalog/NN.webp (NN = style index + 1).
// Run by .github/workflows/catalog.yml; existing files are skipped unless FORCE=1, so a rerun
// only pays for what is missing. Needs KIE_API_KEY in the environment and `sharp` installed.
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {styles} from '../worker/legacy.js';

const key=process.env.KIE_API_KEY;
if(!key){console.log('KIE_API_KEY is not set; nothing generated.');process.exit(0)}
const force=process.env.FORCE==='1';
const only=(process.env.ONLY||'').split(',').map(x=>x.trim()).filter(Boolean).map(Number);
const out='public/catalog';mkdirSync(out,{recursive:true});
const sharp=(await import('sharp')).default;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

// Varied, ordinary-looking adult women so the catalog is about the hair, not one face.
const people=['a woman in her late twenties with olive skin','a woman in her thirties with fair skin','a woman in her twenties with light-brown skin','a woman in her forties with warm beige skin'];
const prompt=(s,i)=>'Photorealistic salon lookbook photograph of '+people[i%people.length]+' wearing a simple plain top, showing the hairstyle "'+s[1]+'". '+
 'Head and shoulders, three-quarter view so the cut, length and shape are clearly visible, hair fully in frame. Natural healthy hair, '+(i%3===0?'dark brown':i%3===1?'medium chestnut brown':'soft black')+' color. '+
 'Soft even studio light, seamless pale grey-green background, sharp focus on hair, natural skin texture, no heavy retouching. No text, no logo, no watermark, no jewelry close-ups.';

async function kie(path,body){const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200)throw new Error('KIE '+r.status+' '+(d.msg||JSON.stringify(d)).slice(0,200));return d.data}

let made=0,failed=0;
for(const [i,s] of styles.entries()){
 const n=String(i+1).padStart(2,'0'),file=out+'/'+n+'.webp';
 if(only.length&&!only.includes(i+1))continue;
 if(existsSync(file)&&!force){console.log(n,'exists, skipped');continue}
 try{
  const task=await kie('/api/v1/jobs/createTask',{model:'nano-banana-2',input:{prompt:prompt(s,i),image_input:[],aspect_ratio:'4:5',resolution:'1K',output_format:'jpg'}});
  let url=null;
  for(let t=0;t<60&&!url;t++){await sleep(5000);const d=await kie('/api/v1/jobs/recordInfo?taskId='+encodeURIComponent(task.taskId));if(d.state==='success')url=JSON.parse(d.resultJson).resultUrls?.[0];else if(d.state==='fail')throw new Error('task failed: '+(d.failMsg||''));}
  if(!url)throw new Error('timed out');
  const img=Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(file,await sharp(img).resize(480,600,{fit:'cover',position:'top'}).webp({quality:78}).toBuffer());
  console.log(n,s[0],'✓');made++;
 }catch(e){console.log(n,s[0],'failed:',e.message);failed++}
}
console.log('done: '+made+' made, '+failed+' failed');
if(failed&&!made)process.exit(1);
