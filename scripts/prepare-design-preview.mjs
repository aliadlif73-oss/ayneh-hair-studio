// Same-origin customer handoff for the design review Site. API operations use
// the owner's existing demo service; credentials and photos are never embedded.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const mediaRevision=execFileSync('git',['rev-parse','HEAD'],{cwd:new URL('..',import.meta.url),encoding:'utf8'}).trim();
import {customerHTML} from '../worker/customer.js';
import {favicon} from '../worker/brand.js';
const target=resolve(process.argv[2]);
const artifact=readFileSync(new URL('../design/landing/out/artifact.html',import.meta.url),'utf8');
const split=artifact.indexOf('</style>')+8;
const html='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+artifact.slice(0,split)+'</head><body>'+artifact.slice(split)+'</body></html>';
mkdirSync(target+'/worker',{recursive:true});mkdirSync(target+'/scripts',{recursive:true});
writeFileSync(target+'/worker/index.js',`const landing=${JSON.stringify(html)},customer=${JSON.stringify(customerHTML)};
const icon=${JSON.stringify(favicon)};
const upstream='https://ayneh-salon.site';
export default {async fetch(request){
 const u=new URL(request.url),p=u.pathname;
 if(p==='/favicon.svg')return new Response(icon,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=3600'}});
 if(p==='/'||p==='/s/demo')return new Response(p==='/'?landing:customer,{headers:{'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':"frame-ancestors 'self'"}});
 const api=/^\\/api\\/s\\/demo\\//.test(p)||['/api/inquiry','/api/trial'].includes(p);
 const asset=/^\\/(catalog|fonts|landing|assets)\\/[a-zA-Z0-9_./-]+$/.test(p);
 if(!api&&!asset)return new Response('Not found',{status:404});
 if(request.method!=='GET'&&request.method!=='HEAD'&&(!api||!['POST','DELETE'].includes(request.method)))return new Response('Method not allowed',{status:405});
 const origin=request.headers.get('Origin');if(api&&origin&&origin!==u.origin)return new Response('Forbidden',{status:403});
 const headers=new Headers({'Accept-Encoding':'identity'});for(const k of ['Content-Type','Cookie','Range','Accept'])if(request.headers.has(k))headers.set(k,request.headers.get(k));
 if(api)headers.set('Origin',upstream);
 const path=p.replace(/^\\/assets\\/video\\//,'/landing/video/');
 const isVideo=/^\\/landing\\/video\\/(hair|lashes|nails)\\.mp4$/.test(path);
 const source=isVideo?'https://raw.githubusercontent.com/aliadlif73-oss/ayneh-hair-studio/${mediaRevision}/public':upstream;
 const response=await fetch(source+path+u.search,{method:request.method,headers,body:['GET','HEAD'].includes(request.method)?undefined:request.body,redirect:'manual',duplex:'half'});
 const out=new Headers(response.headers);if(isVideo&&response.ok)out.set('Content-Type','video/mp4');out.delete('Access-Control-Allow-Origin');if(api)out.set('Cache-Control','private,no-store');
 return new Response(response.body,{status:response.status,headers:out});
}};`);
writeFileSync(target+'/scripts/build.sh',`#!/usr/bin/env bash
set -euo pipefail
rm -rf dist
mkdir -p dist/server dist/.openai
cp worker/index.js dist/server/index.js
cp .openai/hosting.json dist/.openai/hosting.json
`);
writeFileSync(target+'/scripts/validate-artifact.mjs',`import {readFileSync} from 'node:fs';const s=readFileSync('dist/server/index.js','utf8');if(!s.includes('export default')||s.includes('undefinedundefined'))throw Error('Invalid preview');console.log('Preview Worker validated');`);
const manifest=JSON.parse(readFileSync(target+'/.openai/hosting.json'));delete manifest.static;writeFileSync(target+'/.openai/hosting.json',JSON.stringify(manifest,null,2)+'\n');
// The preview daemon is isolated to its checkout; QA-only films are not deployed.
mkdirSync(target+'/qa-video',{recursive:true});
for(const n of ['hair','lashes','nails'])copyFileSync(new URL('../public/landing/video/'+n+'.mp4',import.meta.url),target+'/qa-video/'+n+'.mp4');
writeFileSync(target+'/.gitignore','qa-video/\n');
// The preview daemon uses this only for browser QA, never in production.
writeFileSync(target+'/package.json',JSON.stringify({type:'module',scripts:{dev:'node --use-env-proxy dev.mjs'}},null,2));
writeFileSync(target+'/dev.mjs',`import http from 'node:http';import {readFileSync} from 'node:fs';import app from './worker/index.js';http.createServer(async(req,res)=>{try{const v=req.url.match(/^\\/assets\\/video\\/(hair|lashes|nails)\\.mp4/);if(v){const bytes=readFileSync(new URL('./qa-video/'+v[1]+'.mp4',import.meta.url));res.writeHead(200,{'Content-Type':'video/mp4','Content-Length':bytes.length});res.end(bytes);return}if(req.url==='/mobile-qa'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><iframe title=Mobile src=/ style="width:390px;height:844px;border:0"></iframe>');return}const chunks=[];for await(const c of req)chunks.push(c);const r=await app.fetch(new Request('http://localhost'+req.url,{method:req.method,headers:req.headers,body:['GET','HEAD'].includes(req.method)?undefined:Buffer.concat(chunks)}));res.writeHead(r.status,Object.fromEntries(r.headers));res.end(Buffer.from(await r.arrayBuffer()))}catch{res.writeHead(502);res.end('Preview service unavailable')}}).listen(process.env.PORT||process.argv[process.argv.indexOf('--port')+1]||3000,'0.0.0.0');`);
