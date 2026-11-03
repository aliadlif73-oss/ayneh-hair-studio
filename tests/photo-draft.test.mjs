import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const script=readFileSync(new URL('../design/landing/src/draft.js',import.meta.url),'utf8');
function browser(){
 const records=new Map();let now=1000000;
 const indexedDB={open(){const request={};queueMicrotask(()=>{request.result={createObjectStore(){},close(){},transaction(){const t={};let count=0;const op=fn=>{count++;const r={};queueMicrotask(()=>{r.result=fn();r.onsuccess?.();if(!--count)queueMicrotask(()=>t.oncomplete?.())});return r};t.objectStore=()=>({put:(v,k)=>op(()=>records.set(k,v)),get:k=>op(()=>records.get(k)),delete:k=>op(()=>records.delete(k))});return t}};request.onupgradeneeded?.();request.onsuccess()});return request}};
 const window={};vm.runInNewContext(script,{window,indexedDB,Date:{now:()=>now}});
 return {draft:window.__AYN_DRAFT,records,advance:n=>now+=n};
}
test('gallery handoff keeps the photo and both choices, then consumes its local draft',async()=>{
 const b=browser(),photo={type:'image/jpeg',bytes:[1,2,3]},selection={styleIdx:18,color:'شرابی'};
 await b.draft.put({file:photo,line:'hair',selection});const got=await b.draft.take();
 assert.equal(got.file,photo);assert.equal(got.selection,selection);assert.equal(got.line,'hair');assert.equal(b.records.size,0);assert.equal(await b.draft.take(),null);
});
test('an abandoned gallery draft expires after fifteen minutes and is removed',async()=>{
 const b=browser();await b.draft.put({file:{},line:'hair'});b.advance(15*60*1000);assert.equal(await b.draft.take(),null);assert.equal(b.records.size,0);
});
