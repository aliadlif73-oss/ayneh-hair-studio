/* Keep the mobile action out of the hero, inquiry and try-on dialog. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 const player=document.querySelector('.film-player');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false;
 function sync(){
  queued=false;
  const form=inquiry.getBoundingClientRect();
  const afterHero=hero.getBoundingClientRect().bottom<80;
  const beforeForm=form.top>=innerHeight;
  const film=player?.getBoundingClientRect();
  const overFilm=film&&film.top<innerHeight&&film.bottom>0;
  // Never show the same action twice on screen.
  const twin=[...document.querySelectorAll('main a[href="#salon-example"],main a[href="#start"]')].some(a=>{const r=a.getBoundingClientRect();return r.height&&r.bottom>0&&r.top<innerHeight});
  bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!overFilm&&!twin&&!document.querySelector('dialog[open]'));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 document.addEventListener('focusin',schedule);
 document.addEventListener('focusout',schedule);
 sync();
})();
