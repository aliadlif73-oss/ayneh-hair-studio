import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
const root=dirname(fileURLToPath(import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
const worker=readFileSync(join(root,'worker.js'),'utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
test('Persian RTL, standalone page and complete sales funnel',()=>{
 assert.match(html,/<html lang="fa" dir="rtl">/);assert.match(html,/<meta name="viewport"/);
 for(const id of ['top','benefits','how','features','proof','contact','faq','leadForm'])assert.ok(ids.includes(id),id);
 assert.equal(new Set(ids).size,ids.length,'duplicate IDs');
 assert.match(html,/سبز|آینه/);
});
test('all bundled images exist',()=>{
 for(const [,path] of html.matchAll(/(?:src|href)="(assets\/[^"]+)"/g))assert.ok(existsSync(join(root,path)),path);
});
test('the form sends to a protected server endpoint and displays status',()=>{
 assert.match(html,/fetch\('\/api\/inquiry'/);assert.match(html,/form\.reportValidity\(\)/);
 assert.match(html,/name="consent" required/);
 assert.match(html,/aria-live="polite"/);
 assert.match(worker,/url\.pathname==='\/api\/inquiry'/);
 assert.match(worker,/request\.method!=='POST'/);
 assert.match(worker,/request\.headers\.get\('Origin'\)/);
 assert.match(worker,/'Origin':APP/);
});
test('responsiveness and accessible interaction',()=>{
 assert.match(html,/@media\(max-width:720px\)/);
 assert.match(html,/prefers-reduced-motion/);
 assert.match(html,/aria-expanded/);
 assert.match(html,/aria-label="مقایسه/);
 assert.doesNotMatch(html,/left:-9999px/);
 assert.match(html,/\.honeypot\{[^}]*clip-path:inset\(50%\)/);
});
test('only the separate marketing files are wired',()=>{
 assert.match(readFileSync(join(root,'wrangler.toml'),'utf8'),/name = "ayneh-marketing"/);
 assert.match(worker,/if\(env\.ASSETS\)/);
});
