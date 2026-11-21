/* Keep the mobile action out of the hero, active demo, salon builder, pricing, checkout and dialogs. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 const studio=document.getElementById('salon-example');
 const pricing=document.getElementById('services');
 const pay=document.getElementById('pay');
 const stage=document.getElementById('tryonStage');
 const modal=document.getElementById('previewModal');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false,geo=null;
 const twins=[...document.querySelectorAll('main a[href="#salon-example"]')];
 const docTop=el=>el.getBoundingClientRect().top+window.scrollY;
 const inView=el=>{if(!el||el.hidden)return false;const r=el.getBoundingClientRect();return r.bottom>0&&r.top<window.innerHeight};
 function measure(){
  const ht=docTop(hero);
  geo={heroBottom:ht+hero.offsetHeight,
       twins:twins.map(a=>{const t=docTop(a);return {t,b:t+a.offsetHeight}})};
 }
 function sync(){
  queued=false;if(!geo)measure();
  const y=window.scrollY,vh=window.innerHeight;
  const afterHero=geo.heroBottom-y<80;
  const overStudio=inView(studio);
  const busy=document.body.classList.contains('is-paying')||(modal&&!modal.hidden)||!!document.querySelector('dialog[open]')
   ||inView(pricing)||inView(pay)||(stage&&stage.classList.contains('is-open')&&inView(stage));
  const twin=geo.twins.some(r=>r.b-y>0&&r.t-y<vh);
  bar.hidden=!(mobile.matches&&afterHero&&!overStudio&&!busy&&!twin);
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',()=>{measure();schedule()},{passive:true});
 addEventListener('load',()=>{measure();schedule()});
 addEventListener('ayneh:pay-state',schedule);
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measure();schedule()});
 document.addEventListener('focusin',schedule);
 document.addEventListener('focusout',schedule);
 measure();sync();
})();
