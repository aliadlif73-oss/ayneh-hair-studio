import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {inflateSync} from 'node:zlib';
const w={};vm.runInNewContext(readFileSync(new URL('../design/landing/src/hair-color.js',import.meta.url),'utf8'),{window:w});
test('hair tint preserves deep shadows and bright strand detail without clipping',()=>{
 for(const rgb of [[139,94,57],[211,201,181],[91,39,53],[49,36,29]]){
  const dark=w.__AYN_HAIR_COLOR.tint({rgb},.04,.5),mid=w.__AYN_HAIR_COLOR.tint({rgb},.32,.5),light=w.__AYN_HAIR_COLOR.tint({rgb},.62,.5);
  for(let i=0;i<3;i++){assert(dark[i]<mid[i]*.55);assert(light[i]>mid[i]);assert(light[i]<=248)}
 }
});
function grayPng(path){
 const bytes=readFileSync(path);let at=8,w,h,parts=[];
 while(at<bytes.length){const n=bytes.readUInt32BE(at),type=bytes.toString('ascii',at+4,at+8),data=bytes.subarray(at+8,at+8+n);if(type==='IHDR'){w=data.readUInt32BE(0);h=data.readUInt32BE(4);assert.equal(data[8],8);assert.equal(data[9],0)}if(type==='IDAT')parts.push(data);at+=n+12}
 const raw=inflateSync(Buffer.concat(parts)),out=new Uint8Array(w*h);let p=0;
 for(let y=0;y<h;y++){const f=raw[p++];for(let x=0;x<w;x++){const a=x?out[y*w+x-1]:0,b=y?out[(y-1)*w+x]:0,c=x&&y?out[(y-1)*w+x-1]:0;let v=raw[p++];if(f===1)v+=a;if(f===2)v+=b;if(f===3)v+=Math.floor((a+b)/2);if(f===4){const z=a+b-c,da=Math.abs(z-a),db=Math.abs(z-b),dc=Math.abs(z-c);v+=da<=db&&da<=dc?a:db<=dc?b:c}out[y*w+x]=v&255}}
 return {w,out};
}
test('all 19 coverage masks exclude eyes, neck, chest, brass rim and room',()=>{
 for(let n=1;n<=19;n++){
  const file=n===1?'hair-mask.png':'mask-s'+String(n).padStart(2,'0')+'.png';
  const {w,out}=grayPng(new URL('../design/landing/assets/'+file,import.meta.url));
  for(const [x,y] of [[682,315],[682,360],[682,395],[750,212],[300,300],[1000,300]])assert(out[y*w+x]<4,`${file} spills at ${x},${y}`);
  if(n===8)for(const [x,y] of [[535,367],[831,367],[682,280]])assert(out[y*w+x]<4,`${file}: exposed skin must stay clear`);
  if(n===12)assert(out[367*w+831]>128,'long hair covering the neck must receive colour too');
  assert(out.reduce((s,v)=>s+(v>128),0)>1500,`${file}: missing hair`);
 }
});

test('strand chroma survives grading even at the same luminance',()=>{const c={rgb:[139,94,57]},a=w.__AYN_HAIR_COLOR.tint(c,.3,.5,[150,90,40],[143,95,60]),b=w.__AYN_HAIR_COLOR.tint(c,.3,.5,[130,100,70],[143,95,60]);assert.notDeepEqual(a,b);assert(a[0]>b[0]);assert(a[2]<b[2])});
