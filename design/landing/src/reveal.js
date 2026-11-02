/* Section reveals: content below the first screen rises in as it enters. Nothing is hidden without JS, and anything
   already on screen at load is left alone. */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 const sel='.sec-head,.svc,.step,.feat li,.plan,.faq details,.cta-band__in,.s2-copy,.s2-demo,.trial-mock,#leadForm,.selection-copy,.compare';
 const els=[...document.querySelectorAll(sel)].filter(e=>e.getBoundingClientRect().top>innerHeight);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;
  const sib=[...el.parentElement.children].filter(x=>x.classList.contains('rv'));el.style.transitionDelay=Math.min(sib.indexOf(el),5)*70+'ms';
  el.classList.add('in');io.unobserve(el)}),{rootMargin:'0px 0px -8% 0px'});
 els.forEach(e=>{e.classList.add('rv');io.observe(e)});
})();
