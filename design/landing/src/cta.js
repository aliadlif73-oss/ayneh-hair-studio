/* Keep the mobile action out of the hero, inquiry and try-on dialog. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 const player=document.querySelector('.film-player');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false,geo=null;
 const twins=[...document.querySelectorAll('main a[href="#salon-example"]')];
 const docTop=el=>el.getBoundingClientRect().top+window.scrollY;
 /* Geometry is measured only when the document actually changes. Reading
    getBoundingClientRect() inside a scroll handler forces a synchronous
    layout on every frame — the single biggest cause of sticky scrolling. */
 function measure(){
  const ht=docTop(hero),ft=docTop(inquiry),pt=player?docTop(player):0;
  geo={heroBottom:ht+hero.offsetHeight,formTop:ft,
       filmTop:player?pt:Infinity,filmBottom:player?pt+player.offsetHeight:-Infinity,
       twins:twins.map(a=>{const t=docTop(a);return {t,b:t+a.offsetHeight}})};
 }
 function sync(){
  queued=false;if(!geo)measure();
  const y=window.scrollY,vh=window.innerHeight;
  const afterHero=geo.heroBottom-y<80;
  const beforeForm=geo.formTop-y>=vh;
  const overFilm=geo.filmTop-y<vh&&geo.filmBottom-y>0;
  // Never show the same action twice on screen.
  const twin=geo.twins.some(r=>r.b-y>0&&r.t-y<vh);
  bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!overFilm&&!twin&&!document.querySelector('dialog[open]'));
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
