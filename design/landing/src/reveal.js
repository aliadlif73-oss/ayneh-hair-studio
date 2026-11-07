/* Section reveals: content below the first screen rises in as it enters. Nothing is hidden without JS, and anything
   already on screen at load is left alone. */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 const sel='.sec-head,.svc,.step,.feat li,.plan,.faq details,.cta-band__in,.s2-copy,.s2-demo,.trial-mock,#leadForm,.selection-copy,.compare,.salon-invite-card';
 const els=[...document.querySelectorAll(sel)].filter(e=>e.getBoundingClientRect().top>innerHeight&&(!e.closest('[data-cine]')||e.matches('.sec-head')));
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;
  const sib=[...el.parentElement.children].filter(x=>x.classList.contains('rv'));el.style.transitionDelay=Math.min(sib.indexOf(el),5)*70+'ms';
  el.classList.add('in');io.unobserve(el)}),{rootMargin:'0px 0px -8% 0px'});
 els.forEach(e=>{e.classList.add('rv');io.observe(e)});
})();

/* Cinematic layer: a brass progress hairline, a header that tightens once you leave the hero and marks the section in
   view, headings that wipe in line by line, and slow depth on section media. All of it is transform/opacity on rAF,
   so scrolling stays on the compositor; reduced motion keeps only the progress line and the active link. */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches,header=document.querySelector('.site-header');
 const bar=document.createElement('div');bar.className='scroll-line';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const links=[...document.querySelectorAll('.site-header .nav a[href^="#"]')],secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
 const deep=still||innerWidth<900?[]:[...document.querySelectorAll('.s2-demo img,.trial-mock img,.svc .ico')];
 let busy=false;
 function frame(){busy=false;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  header&&header.classList.toggle('is-tight',y>80);
  let cur=null;for(const s of secs){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id}
  links.forEach(a=>{if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
  for(const el of deep){const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
   const p=(r.top+r.height/2)/innerHeight-.5;el.style.transform='translate3d(0,'+(p*-28).toFixed(1)+'px,0)'}}
 const ask=()=>{if(!busy){busy=true;requestAnimationFrame(frame)}};addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);frame();
 if(still||!('IntersectionObserver' in window))return;
 const heads=[...document.querySelectorAll('.sec-head h2,.cta-band h2')].filter(h=>h.getBoundingClientRect().top>innerHeight);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
 heads.forEach(h=>{h.classList.add('wipe');io.observe(h)});
})();
