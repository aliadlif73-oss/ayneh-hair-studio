/* Keep the mobile action out of the hero, salon builder, inquiry and dialogs. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 const studio=document.getElementById('salon-example');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false,geo=null;
 const twins=[...document.querySelectorAll('main a[href="#salon-example"]')];
 const docTop=el=>el.getBoundingClientRect().top+window.scrollY;
 /* Geometry is measured only when the document actually changes. Reading
    getBoundingClientRect() inside a scroll handler forces a synchronous
    layout on every frame — the single biggest cause of sticky scrolling. */
 function measure(){
  const ht=docTop(hero),ft=docTop(inquiry);
  geo={heroBottom:ht+hero.offsetHeight,formTop:ft,
       twins:twins.map(a=>{const t=docTop(a);return {t,b:t+a.offsetHeight}})};
 }
 function sync(){
  queued=false;if(!geo)measure();
  const y=window.scrollY,vh=window.innerHeight;
  const afterHero=geo.heroBottom-y<80;
  const beforeForm=geo.formTop-y>=vh;
  const studioRect=studio?studio.getBoundingClientRect():null;
  const overStudio=!!studioRect&&studioRect.bottom>0&&studioRect.top<vh;
  // Keep the bar out of the salon-page builder as well: it must not cover the
  // preview or its purchase form while someone is actively creating a page.
  const twin=geo.twins.some(r=>r.b-y>0&&r.t-y<vh);
  bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!overStudio&&!twin&&!document.querySelector('dialog[open]'));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',()=>{measure();schedule()},{passive:true});
 addEventListener('load',()=>{measure();schedule()});
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measure();schedule()});
 document.addEventListener('focusin',schedule);
 document.addEventListener('focusout',schedule);
 measure();sync();
})();
