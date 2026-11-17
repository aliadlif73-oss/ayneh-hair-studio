/* Home #process stop-motion: start when in view and decoded, hold when out of view, pause button.
   Reduced motion shows the still result until the visitor presses play. */
(()=>{const box=document.querySelector('.proc');if(!box)return;
 const button=box.querySelector('.proc__toggle'),imgs=[...box.querySelectorAll('.proc__f img')];
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=motion.matches,ready=false,seen=false;
 function render(){box.classList.toggle('is-paused',paused);box.classList.toggle('is-playing',!paused);box.classList.toggle('is-started',ready&&seen&&(!paused||box.classList.contains('is-started')));
  const t=paused?'پخش نمایش':'توقف نمایش';button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',t);button.textContent=t}
 button.addEventListener('click',()=>{paused=!paused;render()});
 motion.addEventListener?.('change',e=>{if(e.matches){paused=true;render()}});
 function go(){if(ready)return;
  const all=imgs.map(i=>{i.loading='eager';return i.decode?i.decode().catch(()=>{}):Promise.resolve()});
  Promise.race([Promise.all(all),new Promise(r=>setTimeout(r,4000))]).then(()=>{ready=true;render()})}
 if('IntersectionObserver' in window){
  new IntersectionObserver(es=>{const on=es.some(e=>e.isIntersecting);box.classList.toggle('is-on',on);if(on){seen=true;go()}render()},{rootMargin:'200px 0px'}).observe(box);
 }else{box.classList.add('is-on');seen=true;go()}
 render();
})();
