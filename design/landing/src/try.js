/* "Make an image on my photo" links: open the demo salon on the line (and look) the visitor picked. */
(()=>{
 const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
 const PREVIEW=!!window.__AYN_PREVIEW;
 function href(line){
  const sel=window.__AYN_SEL||{};
  // the salon page has separate hairstyle and hair-colour services: a picked style opens the first, a colour alone the second
  if(line==='hair'&&sel.styleIdx==null&&sel.color)return '/s/demo?l=color&c='+encodeURIComponent(sel.color);
  const q=['l='+line];if(line==='hair'&&sel.styleIdx!=null)q.push('s='+sel.styleIdx);
  return '/s/demo?'+q.join('&');
 }
 function sync(){links.forEach(a=>{a.href=href(a.dataset.try)})}
 addEventListener('ayneh:selection',sync);sync();
 links.forEach(a=>a.addEventListener('click',e=>{
  if(!PREVIEW)return;e.preventDefault();
  let n=a.parentElement.querySelector('.try-note');
  if(!n){n=document.createElement('small');n.className='try-note';a.after(n)}
  n.textContent='در پیش‌نمایش کار نمی‌کند. روی سایت اصلی به صفحهٔ نمونه می‌رود و آنجا بعد از تأیید موبایل تصویر ساخته می‌شود.';
 }));
})();
