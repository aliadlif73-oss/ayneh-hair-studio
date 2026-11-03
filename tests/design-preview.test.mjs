import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
test('review Site serves the real customer flow, restricts its proxy, and labels MP4 responses correctly',async()=>{
 const folder=mkdtempSync(join(tmpdir(),'ayneh-preview-'));const net=globalThis.fetch;
 try{
  mkdirSync(join(folder,'.openai'));writeFileSync(join(folder,'.openai/hosting.json'),JSON.stringify({project_id:'unchanged-review-id',static:{directory:'dist'}}));writeFileSync(join(folder,'package.json'),'{}');
  execFileSync(process.execPath,['scripts/prepare-design-preview.mjs',folder],{cwd:new URL('..',import.meta.url)});
  const {default:app}=await import(pathToFileURL(join(folder,'worker/index.js')));
  const calls=[];globalThis.fetch=async(url,options)=>{calls.push({url,options});return new Response(new Uint8Array([1,2,3]),{headers:{'Content-Type':'application/octet-stream'}})};
  const page=await app.fetch(new Request('https://review.example/s/demo?draft=1'));assert.equal(page.status,200);assert.match(await page.text(),/برای ساخت تصویر، ابتدا وارد شوید/);
  const video=await app.fetch(new Request('https://review.example/assets/video/hair.mp4'));assert.equal(video.headers.get('Content-Type'),'video/mp4');assert.match(calls[0].url,/raw\.githubusercontent\.com.*\/public\/landing\/video\/hair.mp4$/);
  assert.equal((await app.fetch(new Request('https://review.example/api/login',{method:'POST'}))).status,404);
  assert.equal((await app.fetch(new Request('https://review.example/api/s/demo/otp/send',{method:'POST',headers:{Origin:'https://elsewhere.example'}}))).status,403);assert.equal(calls.length,1);
  await app.fetch(new Request('https://review.example/api/s/demo/public'));assert.equal(calls[1].url,'https://ayneh-salon.site/api/s/demo/public');
 }finally{globalThis.fetch=net;rmSync(folder,{recursive:true,force:true})}
});
