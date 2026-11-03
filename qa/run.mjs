// One-off check of the new 360 view with the real model (Nano Banana Pro, 2K, 16:9).
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const key=process.env.KIE_API_KEY;if(!key){console.log('no key');process.exit(1)}
mkdirSync('qa/out',{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function kie(path,body){await sleep(1500);const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200)throw new Error(JSON.stringify(d).slice(0,200));return d.data}
async function up(file){const b=readFileSync(file).toString('base64');const r=await fetch('https://kieai.redpandaai.co/api/file-base64-upload',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({base64Data:'data:image/jpeg;base64,'+b,uploadPath:'ayneh-qa',fileName:Date.now()+'-'+file.split('/').pop()})});const d=await r.json();if(!d.success)throw new Error('upload');return d.data.downloadUrl}
const prompt=readFileSync('qa/views-prompt.txt','utf8');
for(const [name,face] of [['v1-bob','qa/out/h2-look-bob.jpg'],['v2-lir','qa/out/h1-look-lir.jpg']]){
 try{const t=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input:{prompt,image_input:[await up(face)],aspect_ratio:'16:9',resolution:'2K',output_format:'jpg'}});
  let url=null;for(let i=0;i<70&&!url;i++){await sleep(5000);const d=await kie('/api/v1/jobs/recordInfo?taskId='+t.taskId);if(d.state==='success')url=JSON.parse(d.resultJson).resultUrls[0];if(d.state==='fail')throw new Error('fail '+d.failMsg)}
  writeFileSync('qa/out/'+name+'.jpg',Buffer.from(await (await fetch(url)).arrayBuffer()));console.log(name,'✓')}catch(e){console.log(name,'failed',e.message)}
}
