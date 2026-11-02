/* Sticky CTA on phones: appears after the hero, hides while the trial form is on screen. */
(()=>{
 const bar=document.getElementById('stickyCta'),form=document.getElementById('start');if(!bar||!form)return;
 let formIn=false,past=false;
 const sync=()=>{const on=past&&!formIn;bar.hidden=!on;bar.classList.toggle('show',on)};
 const seen=new Set();
 new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));formIn=seen.size>0;sync()},{threshold:.15}).observe(form);
 document.querySelectorAll('.cta-band').forEach(b=>new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));formIn=seen.size>0;sync()},{threshold:.2}).observe(b));
 addEventListener('scroll',()=>{const p=scrollY>innerHeight*1.1;if(p!==past){past=p;sync()}},{passive:true});
})();
