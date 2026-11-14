/* Hero proof: the real before/simulation comparison from the customer demo. */
(()=>{
 const byId=id=>document.getElementById(id);
 const proof=byId('heroProof'),box=byId('liveCompare'),range=byId('compareRange');
 const before=byId('compareBefore'),after=byId('compareAfter'),stage=byId('stage');
 if(!proof||!box||!range||!before||!after)return;
 const clamp=v=>Math.max(0,Math.min(100,Number(v)||0));
 const set=v=>{v=clamp(v);range.value=v;box.style.setProperty('--split',v+'%')};
 set(50);
 range.addEventListener('input',()=>set(range.value));
 const fromX=e=>{const r=box.getBoundingClientRect();if(r.width)set((e.clientX-r.left)/r.width*100)};
 box.addEventListener('pointerdown',fromX);
 box.addEventListener('pointermove',e=>{if(e.buttons&1)fromX(e)});
 const POS={style:'50% 45%',color:'50% 45%',lashes:'50% 30%',nails:'50% 22%'};
 const tabs=[...proof.querySelectorAll('[data-pair]')];
 tabs.forEach(b=>b.addEventListener('click',()=>{
  if(b.getAttribute('aria-pressed')==='true')return;
  tabs.forEach(x=>{const on=x===b;x.setAttribute('aria-pressed',String(on));x.classList.toggle('is-active',on)});
  before.src=b.dataset.before;after.src=b.dataset.after;
  const pos=POS[b.dataset.pair];before.style.objectPosition=pos;after.style.objectPosition=pos;
  box.dataset.pair=b.dataset.pair;
  box.setAttribute('aria-label','مقایسهٔ قبل و شبیهسازی: '+b.textContent.trim());
 }));
 /* Once the proof fades into the mirror scene it must stop intercepting input. */
 const sync=()=>{const p=parseFloat(stage&&stage.style.getPropertyValue('--p'))||0;
  proof.style.pointerEvents=p>.42?'none':'';proof.inert=p>.42};
 addEventListener('scroll',sync,{passive:true});sync();
 /* One quiet reveal so the transformation is visible before anyone drags. */
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches){
  let raf=0,t0=0,done=0;
  const halt=()=>{if(done)return;done=1;cancelAnimationFrame(raf);set(50)};
  ['pointerdown','keydown','wheel'].forEach(e=>addEventListener(e,halt,{once:true,passive:true}));
  setTimeout(()=>{if(done)return;const tick=n=>{if(done)return;t0=t0||n;const x=(n-t0)/1500;
   if(x>1){done=1;set(50);return}set(50-32*Math.sin(x*6.283));raf=requestAnimationFrame(tick)};
   raf=requestAnimationFrame(tick)},260);
 }
})();
