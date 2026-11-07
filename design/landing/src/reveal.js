/* Scroll progress hairline, header condensation, and active section link tracking.
   (Section and component entrance choreography lives in cinema.js + cinema.css so there is no transform conflict.) */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches,header=document.querySelector('.site-header');
 const bar=document.createElement('div');bar.className='scroll-line';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const links=[...document.querySelectorAll('.site-header .nav a[href^="#"]')],secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
 let busy=false;
 function frame(){
  busy=false;
  const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  header&&header.classList.toggle('is-tight',y>80);
  let cur=null;
  for(const s of secs){if(s.getBoundingClientRect().top<innerHeight*.42)cur=s.id}
  links.forEach(a=>{if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
 }
 const ask=()=>{if(!busy){busy=true;requestAnimationFrame(frame)}};
 addEventListener('scroll',ask,{passive:true});
 addEventListener('resize',ask);
 frame();
 if(still)return;
})();
