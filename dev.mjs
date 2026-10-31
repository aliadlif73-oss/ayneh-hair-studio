import http from 'node:http';import app from './worker/index.js';import {database,memoryBucket} from './scripts/local-adapter.mjs';import {readFileSync,mkdirSync,existsSync} from 'node:fs';
mkdirSync('.local',{recursive:true});
// Local secrets are read from git-ignored files only. Values are never printed or committed.
function localSecrets(){const out={};for(const file of ['.env','.dev.vars']){if(!existsSync(file))continue;for(const line of readFileSync(file,'utf8').split('\n')){if(/^\s*#/.test(line))continue;const m=line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);if(!m)continue;let v=m[2];if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'")))v=v.slice(1,-1);if(v)out[m[1]]=v}}return out}
const secrets=localSecrets();
const db=database('.local/preview.sqlite');try{db.sql.exec(readFileSync('drizzle/0000_salons.sql','utf8'))}catch(e){if(!e.message.includes('already exists'))throw e}
const env={...secrets,DB:db,BUCKET:memoryBucket(),OWNER_EMAIL:secrets.OWNER_EMAIL||'owner@local.test',TRUST_PLATFORM_IDENTITY:secrets.TRUST_PLATFORM_IDENTITY||'true'};
// Deliberate development-only identity; this file is never included in deployment.
http.createServer(async(req,res)=>{try{const isRead=req.method==='GET'||req.method==='HEAD';const body=isRead?undefined:await new Promise(r=>{let b=[];req.on('data',d=>b.push(d));req.on('end',()=>r(Buffer.concat(b)))});const headers={...req.headers,'oai-authenticated-user-id':'dev-owner','oai-authenticated-user-email':env.OWNER_EMAIL};const response=await app.fetch(new Request('http://'+req.headers.host+req.url,{method:req.method,headers,body}),env);const out=Object.fromEntries(response.headers);if(out['set-cookie'])out['set-cookie']=out['set-cookie'].replace('; Secure','');
// Development preview may be embedded in the editor; production keeps framing denied.
delete out['x-frame-options'];if(out['content-security-policy'])out['content-security-policy']=out['content-security-policy'].replace(/frame-ancestors[^;]*;\s*/,'');
res.writeHead(response.status,out);res.end(req.method==='HEAD'?undefined:Buffer.from(await response.arrayBuffer()));}catch(e){res.writeHead(500,{'content-type':'text/plain;charset=utf-8'});res.end('Preview error')}}).listen(Number(process.env.PORT||process.argv[process.argv.indexOf('--port')+1]||4173),'0.0.0.0');
