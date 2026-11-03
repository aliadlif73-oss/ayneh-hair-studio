import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const context={window:{},Uint8ClampedArray};
vm.runInNewContext(readFileSync(new URL('../design/landing/src/portrait.js',import.meta.url),'utf8'),context);
const {compose}=context.window.__AYN_PORTRAIT;
const rgba=(r,g,b,a=255)=>[r,g,b,a];
test('hairstyle composition keeps the original face and room, replacing only old/new hair',()=>{
 const original=new Uint8ClampedArray([...rgba(110,80,60),...rgba(120,90,70),...rgba(130,100,80),...rgba(140,110,90)]);
 const render=new Uint8ClampedArray(16).fill(220);
 const oldHair=new Uint8ClampedArray([...rgba(255,255,255),...rgba(255,255,255),...rgba(0,0,0),...rgba(0,0,0)]);
 const newHair=new Uint8ClampedArray([...rgba(255,255,255),...rgba(0,0,0),...rgba(0,0,0),...rgba(255,255,255)]);
 const identity=new Uint8ClampedArray([...rgba(255,255,255),...rgba(0,0,0),...rgba(0,0,0),...rgba(0,0,0)]);
 const result=compose(original,render,oldHair,newHair,identity);
 assert.deepEqual([...result.scene.slice(0,4)],[...original.slice(0,4)],'facial identity cannot be replaced by a render');
 assert.deepEqual([...result.scene.slice(8,12)],[...original.slice(8,12)],'the room stays fixed');
 assert.deepEqual([...result.scene.slice(4,7)],[220,220,220],'old long hair is removed when choosing a bob');
 assert.deepEqual([...result.scene.slice(12,15)],[220,220,220],'new hair can extend into the old background');
 assert.equal(result.mask[0],0,'recolouring must also leave the face untouched');
 assert.equal(result.mask[4],0,'removed long hair must not receive the new colour');
 assert.equal(result.mask[12],255,'the current cut receives the selected colour');
 assert.deepEqual([...original.slice(0,4)],rgba(110,80,60),'the canonical portrait is immutable');
});
test('hair edges blend without changing pixels outside the mask',()=>{
 const original=new Uint8ClampedArray(rgba(20,40,60));
 const result=compose(original,new Uint8ClampedArray(rgba(220,140,160)),new Uint8ClampedArray(rgba(0,0,0)),new Uint8ClampedArray(rgba(128,128,128)),new Uint8ClampedArray(rgba(0,0,0)));
 assert.deepEqual([...result.scene],[120,90,110,255]);
 assert.equal(result.mask[0],128);
});

test('clearing old hair preserves the original forehead while new bangs may cover it',()=>{
 const original=new Uint8ClampedArray(rgba(180,130,100)),render=new Uint8ClampedArray(rgba(60,30,20));
 const full=new Uint8ClampedArray(rgba(255,255,255)),empty=new Uint8ClampedArray(rgba(0,0,0));
 assert.deepEqual([...compose(original,render,full,empty,empty,full).scene],[...original]);
 assert.deepEqual([...compose(original,render,full,full,empty,full).scene.slice(0,3)],[60,30,20]);
});
