import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const window={};vm.runInNewContext(readFileSync(new URL('../design/landing/src/journey-timeline.js',import.meta.url),'utf8'),{window});
test('automatic handoff and manual scroll meet at exactly three seconds of nails',()=>{
 const t=window.__AYN_JOURNEY;
 for(const duration of [8,10,15]){const end=t.progressAt(3,duration);assert(end>t.bridge);assert(Math.abs(t.timeAt(end,duration)-3)<1e-9);assert(t.timeAt(end+.01,duration)>3);assert.equal(t.timeAt(t.bridge,duration),0)}
});
test('timeline clamps the stone phase, reverse scroll and short films safely',()=>{
 const t=window.__AYN_JOURNEY;assert.equal(t.timeAt(-1,8),0);assert.equal(t.timeAt(2,8),7.95);assert.equal(t.progressAt(3,2),1);
});
