/* Scroll progress hairline, header condensation, and active section link tracking.
   (Section and component entrance choreography lives in cinema.js + cinema.css so there is no transform conflict.) */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches,header=document.querySelector('.site-header');
 const bar=document.createElement('div');bar.className='scroll-line';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const links=[...document.querySelectorAll('.site-header .nav a[href^="#"]')].filter(a=>a.getAttribute('href')!=='#studio'),secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
 let busy=false,docTops=[],docH=1,tight=false;
 const measure=()=>{docTops=secs.map(s=>s.getBoundingClientRect().top+scrollY);docH=Math.max(1,document.documentElement.scrollHeight-innerHeight)};
 addEventListener('resize',measure,{passive:true});addEventListener('load',measure);
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
 measure();
 function frame(){
  busy=false;
  const y=scrollY;
  bar.style.transform='scaleX('+Math.min(1,y/docH)+')';
  const t=y>80;if(t!==tight){tight=t;header&&header.classList.toggle('is-tight',t)}
  let cur=null;
  for(let k=0;k<secs.length;k++){if(docTops[k]-y<innerHeight*.42)cur=secs[k].id}
  links.forEach(a=>{if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 }
 const ask=()=>{if(!busy){busy=true;requestAnimationFrame(frame)}};
 addEventListener('scroll',ask,{passive:true});
 addEventListener('resize',ask);
 frame();
 if(still)return;
})();
