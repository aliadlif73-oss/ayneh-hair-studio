/* Keep the mobile action out of the hero, inquiry and try-on dialog. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false;
 function sync(){
  queued=false;
  const form=inquiry.getBoundingClientRect();
  const afterHero=hero.getBoundingClientRect().bottom<80;
  const beforeForm=form.top>=innerHeight;
  bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!document.querySelector('dialog[open]'));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 document.addEventListener('focusin',schedule);
 document.addEventListener('focusout',schedule);
 sync();
})();
