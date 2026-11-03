// One-off check of the identity fix with the real image model (Nano Banana Pro, 2K, like production).
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {transferPrompt} from '../worker/domain.js';
import {linePrompt} from '../worker/lines.js';
const key=process.env.KIE_API_KEY;if(!key){console.log('no key');process.exit(1)}
mkdirSync('qa/out',{recursive:true});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function kie(path,body){await sleep(1500);const r=await fetch('https://api.kie.ai'+path,{method:body?'POST':'GET',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});const d=await r.json();if(!r.ok||d.code!==200)throw new Error(JSON.stringify(d).slice(0,200));return d.data}
async function up(file){const b=readFileSync(file).toString('base64');const r=await fetch('https://kieai.redpandaai.co/api/file-base64-upload',{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify({base64Data:'data:image/jpeg;base64,'+b,uploadPath:'ayneh-qa',fileName:Date.now()+'-'+file.split('/').pop()})});const d=await r.json();if(!d.success)throw new Error('upload '+JSON.stringify(d).slice(0,200));return d.data.downloadUrl}
const cases=[
 ['h1-look-lir','qa/in/face1.jpg',null,transferPrompt('catalog','long sleek straight hair falling well past the chest, long V-shaped layers with face-framing pieces starting at the chin, middle part, smooth glossy blow-dried finish','')],
 ['h2-look-bob','qa/in/face1.jpg',null,transferPrompt('catalog','a layered bob ending just above the shoulders, blow-dried with round-brush volume and softly flicked-out layered ends, deep side part, face-framing layers','')],
 ['h3-ref-bob','qa/in/face1.jpg','qa/in/ref-hair-bob.jpg',transferPrompt('style','','')],
 ['c1-look-choc','qa/in/face2.jpg',null,linePrompt('color','catalog','chocolate-caramel ombré: a deep chocolate-brown root and top with warm caramel-blonde ribbons starting around cheek level and getting brighter toward the ends',{},'')],
 ['n1-look-lemon','qa/in/hand.jpg',null,linePrompt('nails','salon','an ombré gel manicure fading from lemon yellow at the cuticle to peach-coral at the tip, glossy, almond shape, medium-long',{},'')],
 ['l1-look-cat','qa/in/eyes.jpg',null,linePrompt('lashes','catalog','black cat-eye volume eyelash extensions: fluffy fans, longest at the outer corners, lifted and elongated',{},'')]
];
for(const [name,face,ref,prompt] of cases){
 try{
  const imgs=[await up(face)];if(ref)imgs.push(await up(ref));
  const t=await kie('/api/v1/jobs/createTask',{model:'nano-banana-pro',input:{prompt,image_input:imgs,aspect_ratio:'3:4',resolution:'2K',output_format:'jpg'}});
  let url=null;for(let i=0;i<60&&!url;i++){await sleep(5000);const d=await kie('/api/v1/jobs/recordInfo?taskId='+t.taskId);if(d.state==='success')url=JSON.parse(d.resultJson).resultUrls[0];if(d.state==='fail')throw new Error('fail '+d.failMsg)}
  writeFileSync('qa/out/'+name+'.jpg',Buffer.from(await (await fetch(url)).arrayBuffer()));console.log(name,'✓');
 }catch(e){console.log(name,'failed',e.message)}
}
