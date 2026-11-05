import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {database,memoryBucket} from '../scripts/local-adapter.mjs';
import {hash} from '../worker/domain.js';
const lines=['hair','color','nails','lashes'],apps={};
for(const l of lines)apps[l]=(await import('../editions-dist/'+l+'/worker/edition-entry.js')).default;
const password='Only-new-editions-2026!';
async function fixture(line){const DB=database();for(const f of readdirSync(new URL('../drizzle/',import.meta.url)).filter(x=>x.endsWith('.sql')).sort())DB.sql.exec(readFileSync(new URL('../drizzle/'+f,import.meta.url),'utf8'));const token=crypto.randomUUID()+crypto.randomUUID();return {DB,BUCKET:memoryBucket(),APP_ORIGIN:'https://'+line+'.test',SESSION_SECRET:crypto.randomUUID(),CONFIG_ENCRYPTION_KEY:'b'.repeat(64),BOOTSTRAP_HASH:await hash(token),BOOTSTRAP_EXPIRES:Date.now()+60000,TELEGRAM_WEBHOOK_SECRET:crypto.randomUUID(),token};}
async function call(l,e,path,body,cookie=''){const r=await apps[l].fetch(new Request(e.APP_ORIGIN+path,{method:body===undefined?'GET':'POST',headers:{origin:e.APP_ORIGIN,cookie,...(body instanceof Uint8Array?{}:{'content-type':'application/json'})},body:body===undefined?undefined:body instanceof Uint8Array?body:JSON.stringify(body)}),e);let d;const text=await r.text();try{d=JSON.parse(text)}catch{d=text}return {status:r.status,data:d,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function owner(l,e){const r=await call(l,e,'/api/edition/setup',{token:e.token,password});assert.equal(r.status,200,JSON.stringify(r));return r.cookie;}
const image=()=>{const x=new Uint8Array(150);x.set([137,80,78,71,13,10,26,10]);return x;};
const scripts=html=>[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1]));
for(const l of lines){
 test(l+': empty independent edition, one-time bootstrap, protected manager and specialist identity',async()=>{const e=await fixture(l),root=await call(l,e,'/');assert.equal(root.status,200);scripts(root.data);assert.match(root.data,new RegExp('/s/demo\\?l='+l));assert.equal(e.DB.sql.prepare('SELECT count(*) n FROM salons').get().n,0);assert.equal((await call(l,e,'/api/edition/config')).status,401);
  const c=await owner(l,e);assert.equal((await call(l,e,'/api/edition/setup',{token:e.token,password})).status,409);assert.equal((await call(l,e,'/api/me',undefined,c)).data.owner,true);
  const row=e.DB.sql.prepare("SELECT value FROM app_settings WHERE key='edition_config'").get();assert(!row.value.includes(password));
  const created=await call(l,e,'/api/salons',{slug:'sara',name:'سارا متخصص'},c);assert.equal(created.status,200,JSON.stringify(created));assert.equal((await call(l,e,'/api/s/sara/public')).data.reference,false,'reference quality is not claimed verified');
  const html=await call(l,e,'/s/sara');assert.equal(html.status,200);assert.match(html.data,/__AYNEH_EDITION__/);assert.match(html.data,new RegExp("state.line='"+l+"'"));scripts(html.data);
  const admin=await call(l,e,'/admin');scripts(admin.data);assert.match(admin.data,/admin\/integrations/);
  const setup=await call(l,e,'/admin/setup');scripts(setup.data);assert(!setup.data.includes(e.token));
  const panel=await call(l,e,'/admin/integrations',undefined,c);assert.equal(panel.status,200);scripts(panel.data);
  const jpg=await call(l,e,'/catalog/'+(l==='hair'?'':l+'/')+'01.webp');assert.equal(jpg.status,200);
  const wrong=l==='hair'?'nails':'hair';const path='/catalog/'+(wrong==='hair'?'':wrong+'/')+'01.webp';assert.equal((await call(l,e,path)).status,404);
  assert.equal((await call(l,e,'/legacy')).status,404);assert.equal((await call(l,e,'/api/status')).status,404);
 });
 test(l+': other service requests fail before paid calls; private media and cookies stay isolated',async()=>{const e=await fixture(l),c=await owner(l,e);await call(l,e,'/api/salons',{slug:'sara',name:'سارا'},c);const g=(await call(l,e,'/api/s/sara/session',{})).cookie;const original=(await call(l,e,'/api/s/sara/upload?kind=original',image(),g)).data.id;
  assert.equal((await call(l,e,'/api/s/sara/generate',{line:lines.find(x=>x!==l),original_id:original,idem:crypto.randomUUID()},g)).status,400);
  assert.equal((await call(l,e,'/api/s/sara/leads',{line:lines.find(x=>x!==l)},g)).status,400);
  assert.equal((await call(l,e,'/api/s/sara/owner/portfolio/add',{line:lines.find(x=>x!==l)},c)).status,400);
  if(l!=='hair')assert.equal((await call(l,e,'/api/s/sara/views',{},g)).status,404);
  const other=await fixture(l);await owner(l,other);assert.equal((await call(l,other,'/api/owner',undefined,c)).status,401,'signing keys cannot be used in another instance');
  assert.equal((await call(l,e,'/api/s/sara/media/'+original)).status,401);assert.equal((await call(l,e,'/api/s/sara/media/'+original,undefined,g)).status,200);
 });
}
test('encrypted provider setup, no secret readback, and existing bot webhook is never displaced',async()=>{const l='nails',e=await fixture(l),c=await owner(l,e),previous=globalThis.fetch;let activeOrigin='https://ayneh-salon.site',sets=0,creates=0;globalThis.fetch=async(url,opts={})=>{const u=String(url);if(u.includes('/chat/credit'))return Response.json({code:200,data:1000});if(u.endsWith('/getMe'))return Response.json({ok:true,result:{username:'nails_new_bot'}});if(u.endsWith('/getWebhookInfo'))return Response.json({ok:true,result:{url:activeOrigin?activeOrigin+'/api/telegram/webhook':''}});if(u.endsWith('/setWebhook')){sets++;assert.equal(JSON.parse(opts.body).url,e.APP_ORIGIN+'/api/telegram/webhook');return Response.json({ok:true,result:true})}if(u.includes('createTask'))creates++;throw Error('Unexpected network');};
 try{assert.equal((await call(l,e,'/api/edition/config',{telegram:'123:existing'},c)).status,409);assert.equal(sets,0);assert.equal((await call(l,e,'/api/edition/config',undefined,c)).data.telegram.configured,false);
  activeOrigin='';assert.equal((await call(l,e,'/api/edition/config',{kie:'private-kie-key-test',telegram:'123:new_token'},c)).status,200);
  const config=await call(l,e,'/api/edition/config',undefined,c);assert(config.data.image);assert(config.data.telegram.configured);assert(!JSON.stringify(config).includes('private-kie-key'));assert(!JSON.stringify(config).includes('123:new_token'));assert(!e.DB.sql.prepare("SELECT value FROM app_settings WHERE key='edition_config'").get().value.includes('private-kie-key'));
  assert.equal((await call(l,e,'/api/edition/connect',{platform:'telegram'},c)).status,200);assert.equal(sets,1);assert.equal(creates,0,'connection validation never starts a paid image generation');
 }finally{globalThis.fetch=previous}
});
test('fresh specialist instance keeps baseline source and public catalog assets unchanged',()=>{
 const cfg=readFileSync(new URL('../wrangler.toml',import.meta.url),'utf8');assert.match(cfg,/name = "ayneh-hair-studio"/);assert(!cfg.includes('specialist'));assert(!readFileSync(new URL('../worker/index.js',import.meta.url),'utf8').includes('editionEnv'));
});
