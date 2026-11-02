/* Section 2: the hero selection becomes the request that "arrives" in the salon chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.'+(e||'webp'));
 const demo=$('s2demo');if(!demo)return;
 const DEFAULT={style:'ولف‌کات',idx:2,color:'کاراملی'};
 let sel=window.__AYN_SEL||null;
 function render(){
  const has=sel&&(sel.style!=null||sel.color!=null);
  const s=sel&&sel.style!=null?sel.style:DEFAULT.style,i=sel&&sel.styleIdx!=null?sel.styleIdx:DEFAULT.idx,c=sel&&sel.color!=null?sel.color:DEFAULT.color;
  $('s2style').textContent=s;$('s2color').textContent=c;$('s2img').src=SRC('s'+String(i+1).padStart(2,'0'));
  $('s2tag').textContent=has?'ترکیبی که همین الان در آینه انتخاب کردی':'نمونه؛ با انتخاب در آینه عوض می‌شود'}
 addEventListener('ayneh:selection',e=>{sel=e.detail;render()});
 render();
 /* status buttons: one tap by the salon, shown to the customer */
 const TEXT={called:['وضعیت: تماس گرفتم','سالن با تو تماس گرفت یا به‌زودی تماس می‌گیرد.'],booked:['وضعیت: نوبت شد','نوبتت ثبت شد. جزئیات را سالن اعلام می‌کند.'],declined:['وضعیت: انجام نمی‌دهم','سالن این مدل را انجام نمی‌دهد؛ می‌توانی مدل دیگری بفرستی.']};
 const btns=[...document.querySelectorAll('#s2acts button')];
 btns.forEach(b=>b.addEventListener('click',()=>{
  btns.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const t=TEXT[b.dataset.s];$('s2out').hidden=false;$('s2outText').textContent=t[0];$('s2custText').textContent=t[1]}));
 /* plays once when first scrolled into view; everything is visible at rest */
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){demo.classList.add('play');io.disconnect()}},{threshold:.25});io.observe(demo)}
})();
