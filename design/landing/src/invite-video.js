/* Invitation film: loads only when the section is near, plays only while it is on screen, and never plays for
   visitors who ask for reduced motion or data saving (they keep the poster frame). */
(()=>{
 const v=document.querySelector('.invite-video');if(!v)return;
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches||navigator.connection?.saveData;
 if(still||!('IntersectionObserver' in window))return;
 let loaded=false;
 new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){if(!loaded){v.preload='auto';v.load();loaded=true}v.play().catch(()=>{})}
  else if(loaded)v.pause();
 }),{rootMargin:'200px 0px'}).observe(v);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause()});
})();
