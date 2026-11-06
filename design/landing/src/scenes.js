(()=>{
 const root=document.querySelector('.film-player');
 if(!root)return;
 const video=root.querySelector('video'),buttons=[...root.querySelectorAll('[data-film]')];
 const titles=['مدل و رنگ مو','مدل مژه','طرح و رنگ ناخن'];
 const descriptions=['مدل و رنگ‌های مختلف را روی یک چهره ببینید.','حالت و حجم مژه را روی چشم‌ها مقایسه کنید.','تغییر فرم، طرح و رنگ ناخن را روی دست ببینید.'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,visible=false,userPaused=false,systemPause=false,completed=false;
 function play(){
  if(!visible||document.hidden||completed||userPaused)return;
  video.play().catch(()=>{});
 }
 function pause(){
  if(video.paused)return;
  systemPause=true;
  video.pause();
 }
 function select(index){
  if(index!==current){
   root.classList.remove("is-playing");
   pause();
   current=index;
   const key=buttons[index].dataset.film,base=window.__AYN_BASE||'assets/';
   video.poster=base+key+'-poster.webp';
   video.src=base+'video/'+key+'.mp4?v='+window.__AYN_ASSET_VERSION;
  }else if(video.ended)video.currentTime=0;
  completed=false;userPaused=false;
  video.playbackRate=index===0?1.5:1;
  video.setAttribute('aria-label',titles[index]);
  root.querySelector('#filmTitle').textContent=titles[index];
  root.querySelector('#filmText').textContent=descriptions[index];
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 }
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{select(index);visible=true;play()}));
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=current===0?1.5:1});
 video.addEventListener('playing',()=>{userPaused=false;completed=false;root.classList.add('is-playing')});
 video.addEventListener('waiting',()=>root.classList.remove('is-playing'));
 video.addEventListener('pause',()=>{
  root.classList.remove('is-playing');
  if(!systemPause&&video.paused&&!video.ended)userPaused=true;
  systemPause=false;
 });
 video.addEventListener('error',()=>root.classList.remove('is-playing'));
 video.addEventListener('ended',()=>{
  root.classList.remove('is-playing');
  if(current+1===buttons.length){completed=true;return}
  select(current+1);play();
 });
 new IntersectionObserver(([entry])=>{
  visible=entry.intersectionRatio>=.3;
  if(!visible)pause();
  else if(!reduced.matches)play();
 },{threshold:.3}).observe(video);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(!reduced.matches)play()});
 select(0);
})();
