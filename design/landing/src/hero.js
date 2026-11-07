/* Film hero. STYLES / COLORS are the only lists to extend.
   - One plate (1376x768 design pixels) carries the photo, the hair canvas and the podium dock; JS only sizes and
     places the plate, so the recolour can never drift off the hair whatever the screen.
   - Colour changes are real: the hair is recoloured on the canvas through its mask.
   - A style changes the hair shape on the mirror only when a render for it exists (window.__AYN_LOOKS lists the
     style numbers that have assets/look-sNN.webp + mask-sNN.png). Otherwise the style card says, truthfully,
     that the shape is made on the customer's own photo, and links to the demo salon. */
(()=>{
 const $=id=>document.getElementById(id);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.'+(e||'webp')+'?v='+(window.__AYN_ASSET_VERSION||'1'));
 const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
 const STYLES=['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
 const COLORS=[
  {name:'بلوند شامپاینی',rgb:[190, 166, 120],h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {name:'کاراملی',rgb:[139, 94, 57],h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {name:'اسپرسو',rgb:[49, 36, 29],h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {name:'آمبره',rgb:[180, 146, 99],ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {name:'مسی',rgb:[150, 79, 47],h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {name:'بلوند پلاتینی',rgb:[211, 201, 181],h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {name:'شرابی',rgb:[91, 39, 53],h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const READY=new Set([1,...(window.__AYN_LOOKS||[])]);
 const st={style:null,color:null,look:'base'};
 const film=$('intro'),stage=$('stage'),studio=$('studio'),mirror=$('mirror'),plate=$('plate'),dock=$('dock'),palette=$('colors');
 const frame='<svg class="frame" aria-hidden="true"><rect class="edge"/><rect class="orbit" pathLength="100"/></svg>';
 const ring='<svg class="frame" viewBox="0 0 48 48" aria-hidden="true"><circle class="edge" cx="24" cy="24" r="22"/><circle class="orbit" cx="24" cy="24" r="22" pathLength="100"/></svg>';
 const mobile=matchMedia('(max-width:900px)');

 /* ---------- build the three pickers ---------- */
 const make=(cls,html,onPick,box)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.tabIndex=box.children.length? -1:0;b.innerHTML=html;(b.querySelector('.ic,.ph,.dot')||b).insertAdjacentHTML('beforeend',cls==='sw'?ring:frame);b.addEventListener('click',()=>{if(!b.closest('.hscroll')?.classList.contains('was-dragged'))onPick()});box.append(b);return b};
 const n2=i=>String(i+1).padStart(2,'0');
 const cards=STYLES.map((name,i)=>make('card','<span class="ph"><img src="'+SRC('s'+n2(i))+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>',()=>pickStyle(i),$('track')));
 const dItems=[];
 STYLES.forEach((name,i)=>{
  dItems[i]=make('d-item','<span class="ic"><img src="'+SRC('s'+n2(i))+'" alt="" loading="lazy" draggable="false"></span><span>'+name+'</span>',()=>pickStyle(i),$('dockTrack'));
 });
 cards.forEach((b,i)=>{const note=document.createElement('small');note.className='preview-kind';note.textContent=READY.has(i+1)?'پیش‌نمایش روی آینه':'عکس مرجع';b.append(note)});
 const sws=COLORS.map((c,i)=>make('sw','<span class="dot"><i style="background:'+c.css+'"></i></span><span>'+c.name+'</span>',()=>pickColor(i),$('colList')));
 $('styCount').textContent='· '+fa(STYLES.length)+' مدل';

 /* ---------- plate placement: cover the mirror box, keep the mirror in view ---------- */
 const FX=.4985,FY=.44;
 function layout(){
  const W=mirror.clientWidth,H=mirror.clientHeight;if(!W||!H)return;
  const s=Math.max(W/1376,H/768)*(mobile.matches?1.5:1),pw=1376*s,ph=768*s;
  const x=Math.min(0,Math.max(W-pw,W/2-FX*pw)),y=Math.min(0,Math.max(H-ph,H*.5-FY*ph));
  Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:x+'px',top:y+'px'});
  plate.style.setProperty('--scene-scale',s.toFixed(3));
  dock.style.setProperty('--u',mobile.matches?'1':Math.max(.62,Math.min(1.35,s/.84)).toFixed(3));
  // phones: the podium is too small for the dock, so it sits under the mirror instead
  // phones: colours and the style dock sit under the mirror, where thumbs can reach them
  if(mobile.matches){let lab=$('heroPlayground');if(!lab){lab=document.createElement('div');lab.id='heroPlayground';lab.className='hero-playground';studio.before(lab)}lab.append(studio,palette,dock);dock.classList.add('mobile');palette.classList.add('mobile')}
  else if(dock.parentElement!==plate){const lab=$('heroPlayground');if(lab){lab.before(studio);lab.remove()}plate.append(dock);mirror.append(palette);dock.classList.remove('mobile');palette.classList.remove('mobile')}
  if(!mobile.matches)plate.style.setProperty('--dock-limit',Math.max(0,H-y-dock.offsetHeight-16)+'px');
  syncArrows();
 }

 /* ---------- horizontal scrollers: wheel, drag, arrows ---------- */
 const rtl=el=>getComputedStyle(el).direction==='rtl';
 function room(el){const max=el.scrollWidth-el.clientWidth,pos=rtl(el)?-el.scrollLeft:el.scrollLeft;return {back:pos>2,fwd:pos<max-2}}
 function scrollFwd(el,dist){el.scrollBy({left:rtl(el)?-dist:dist,behavior:reduced?'auto':'smooth'})}
 function hscroll(el,prev,next){
  el.addEventListener('wheel',e=>{
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;            // trackpads already scroll sideways
   const r=room(el);if((e.deltaY>0&&!r.fwd)||(e.deltaY<0&&!r.back))return; // at the end: let the page scroll
   e.preventDefault();el.scrollLeft+=(rtl(el)?-1:1)*e.deltaY;
  },{passive:false});
  let d=null;
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;d={x:e.clientX,s:el.scrollLeft,moved:false};el.classList.remove('was-dragged')});
  addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x;if(Math.abs(dx)>6){d.moved=true;el.classList.add('dragging','was-dragged')}if(d.moved)el.scrollLeft=d.s-dx});
  addEventListener('pointerup',()=>{if(!d)return;d=null;el.classList.remove('dragging');setTimeout(()=>el.classList.remove('was-dragged'),0)});
  const step=()=>el.clientWidth*.7;
  prev.addEventListener('click',()=>scrollFwd(el,-step()));next.addEventListener('click',()=>scrollFwd(el,step()));
  el.addEventListener('scroll',()=>sync1(el,prev,next),{passive:true});
  return ()=>sync1(el,prev,next);
 }
 function sync1(el,prev,next){const r=room(el);prev.disabled=!r.back;next.disabled=!r.fwd}
 const syncs=[hscroll($('dockTrack'),$('dkPrev'),$('dkNext')),hscroll($('track'),$('stPrev'),$('stNext'))];
 function syncArrows(){syncs.forEach(f=>f())}

 /* arrow keys move between options inside each radio group */
 [[cards,$('track')],[dItems.filter(Boolean),$('dockTrack')],[sws,$('colList')]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
  const i=list.indexOf(document.activeElement);if(i<0)return;
  const k=e.key;
  const dir=k==='ArrowDown'||k==='ArrowLeft'?1:k==='ArrowUp'||k==='ArrowRight'?-1:0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus({preventScroll:true});n.click();n.scrollIntoView({inline:'center',block:'nearest'})}));

 /* ---------- all-styles rail ---------- */
 const rail=$('styles'),more=$('more');rail.inert=true;
 function setRail(open){
  rail.inert=!open;rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open){setTimeout(()=>{(cards[st.style??0]).scrollIntoView({inline:'center',block:'nearest'});syncArrows();cards[st.style??0].focus({preventScroll:true})},60)}
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),img2=$('roomImg2'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 let px=null,rafId=0,lookTok=0;const preps={};
 const imagePromises=new Map();const loadImg=src=>{if(!imagePromises.has(src))imagePromises.set(src,new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>{imagePromises.delete(src);rej(new Error("Image unavailable"))};i.src=src}));return imagePromises.get(src)};
 const lookAssets=key=>key==='base'?['hero','hair-mask']:['look-'+key,'mask-'+key];
 let identitySource=null;
 function canonical(){
  if(identitySource)return identitySource;
  identitySource=Promise.all([loadImg(SRC('hero')),loadImg(SRC('hair-mask','png'))]).then(([photo,mask])=>{
   const c=document.createElement('canvas');c.width=1376;c.height=768;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(photo,0,0);const original=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);g.drawImage(mask,0,0);
   // Include dark loose ends that the original colour-segmented mask misses on the blouse.
   g.fillStyle='#fff';
   const removal=[[[622,334],[653,334],[666,419],[651,441],[620,433],[618,389]],[[712,331],[748,331],[762,430],[729,441],[710,412],[705,368]],[[520,333],[582,333],[582,451],[515,450]],[[785,333],[863,333],[863,452],[785,452]]];
   removal.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   g.fillRect(610,240,148,106);g.fillRect(508,255,76,91);g.fillRect(786,255,75,91);
   g.fillRect(606,346,154,125);g.fillRect(508,346,76,108);g.fillRect(786,346,75,108);
   const oldHair=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);g.fillStyle='#fff';
   // Protect the same eyes, nose, lips and facial contours in all three reflections.
   // The upper forehead remains available for bangs.
   const faces=[[[660,298],[668,293],[699,293],[711,301],[711,325],[700,343],[682,350],[664,339],[654,323],[654,307]],[[522,291],[537,288],[547,301],[547,319],[549,333],[541,347],[526,347],[517,335],[513,323],[520,312]],[[825,288],[840,291],[843,308],[850,321],[846,335],[837,347],[823,347],[815,335],[816,315],[817,300]]];
   faces.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   const identity=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);
   const fullFaces=[[[676,267],[693,268],[704,280],[711,295],[713,314],[707,333],[697,344],[682,350],[665,339],[655,322],[653,302],[658,282]],[[523,280],[539,283],[548,300],[550,324],[542,347],[525,349],[513,328],[519,308]],[[828,280],[842,284],[844,307],[852,324],[840,348],[824,350],[814,332],[816,304]]];
   fullFaces.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   const face=g.getImageData(0,0,1376,768).data;
   return {original,oldHair,identity,face};
  }).catch(error=>{identitySource=null;throw error});
  return identitySource;
 }
 function prepare(key){
  if(preps[key])return preps[key];
  const [im,mk]=lookAssets(key);
  return preps[key]=Promise.all([loadImg(SRC(im)),loadImg(SRC(mk,'png')),canonical()]).then(([a,m,person])=>{
   const W=1376,H=768,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(m,0,0,W,H);let full=g.getImageData(0,0,W,H).data;
   g.clearRect(0,0,W,H);g.drawImage(a,0,0,W,H);let scene=g.getImageData(0,0,W,H);
   // Source renders contribute hair/removal pixels only, never a replacement face or room.
   const composed=window.__AYN_PORTRAIT.compose(person.original,scene.data,person.oldHair,full,person.identity,person.face);
   scene.data.set(composed.scene);full=composed.mask;
   g.putImageData(scene,0,0);
   const src=key==='base'?a.src:c.toDataURL('image/webp',.92);
   const thumbCanvas=document.createElement('canvas');thumbCanvas.width=240;thumbCanvas.height=300;
   thumbCanvas.getContext('2d').drawImage(c,605,235,160,235,0,0,240,300);
   const thumb=thumbCanvas.toDataURL('image/webp',.85),index=key==='base'?0:Number(key.slice(1))-1;
   [cards[index],dItems[index]].forEach(button=>{if(button)button.querySelector('img').src=thumb});
   let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(full[(y*W+x)*4]>6){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
   if(x1<x0)throw new Error('Empty hair mask');
   const R={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},base=g.getImageData(R.x,R.y,R.w,R.h).data;
   const mkd=new Uint8ClampedArray(R.w*R.h*4);
   for(let y=0;y<R.h;y++)mkd.set(full.subarray(((R.y+y)*W+R.x)*4,((R.y+y)*W+R.x+R.w)*4),y*R.w*4);
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mkd[i*4]>6)idx.push(i);
   const channels=[[],[],[]];for(const i of idx){const p=i*4,Y=(base[p]+base[p+1]+base[p+2])/765;if(mkd[p]>180&&Y>.15&&Y<.65)for(let c=0;c<3;c++)channels[c].push(base[p+c])}const anchor=channels.map((v,i)=>v.length?v.sort((a,b)=>a-b)[v.length>>1]:[143,95,60][i]);
   return {src,thumb,R,base,mk:mkd,idx,anchor,out:ctx.createImageData(R.w,R.h)};
  }).catch(()=>{delete preps[key];return null});
 }
 let transitionAnimation=null;
 const renderError=()=>{$('demoCaption').textContent='تصویر بارگذاری نشد. مدل یا رنگ را دوباره انتخاب کنید.';stage.dataset.renderState='error'};
 async function setLook(key){
  const my=++lookTok;
  stage.dataset.renderState='loading';
  const p=await prepare(key);if(my!==lookTok)return false;
  if(!p){renderError();return false}
  transitionAnimation?.cancel();cancelAnimationFrame(rafId);
  // Commit the decoded image and its own mask together. No old timeout can restore a previous selection.
  const changed=st.look!==key;
  img.src=p.src;px=p;st.look=key;
  if(st.style!=null)$('refImg').src=p.thumb;
  img2.classList.remove('show');
  draw(null,st.color!=null?COLORS[st.color]:null,1,-1);
  if(changed&&!reduced)transitionAnimation=$('mirrorFront').animate([{filter:'brightness(1.05)'},{filter:'brightness(1)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
  stage.dataset.renderState='ready';stage.dataset.look=key;
  return true;
 }
 const startPrep=()=>setLook('base');
 startPrep();
 const cl=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function hsl(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
 const tint=window.__AYN_HAIR_COLOR.tint;
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px)return;
  const {R,base,mk,idx,out}=px,o=out.data;
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,1376,768);return}
  o.fill(0);
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,yr=(i/R.w)|0,yn=yr/R.h;
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   const A=from?tint(from,Y,yn,[r0,g0,b0],px.anchor):[r0,g0,b0],B=to?tint(to,Y,yn,[r0,g0,b0],px.anchor):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=A[2]+(B[2]-A[2])*t;
   if(scan>=0){const d=yn-scan,w=Math.exp(-(d*d)/.0045)*.7;r+=(255-r)*w*.75+26*w;g+=(255-g)*w*.65+14*w;b+=(255-b)*w*.4}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,1376,768);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){cancelAnimationFrame(rafId);draw(null,next,1,-1);if(!reduced)cv.animate([{opacity:.65},{opacity:1}],{duration:180})}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 const mark=(list,idx)=>list.forEach((button,i)=>{
  if(!button)return;
  button.setAttribute('aria-checked',String(i===idx));
  button.tabIndex=i===Math.max(0,idx)?0:-1;
 });
 async function pickColor(i){
  showFront();revealPortrait();
  const prev=st.color!=null?COLORS[st.color]:null;st.color=i;mark(sws,i);summary();
  // A click made before the mask finishes loading is queued, rather than silently doing nothing.
  if(!px){const p=await prepare(st.look);if(!p){renderError();return}if(!px)px=p}
  if(st.color===i){paintColor(prev,COLORS[i]);stage.dataset.color=String(i)}
 }
 async function pickStyle(i){
  showFront();
  st.style=i;mark(cards,i);mark(dItems,i);
  $('refImg').src=cards[i].querySelector('img').src;$('refName').textContent=STYLES[i];$('ref').inert=false;$('ref').classList.add('on');
  if(READY.has(i+1)){
   $('refNote').textContent='پیش‌نمایش این مدل روی چهرهٔ نمونه';
   await setLook(i===0?'base':'s'+n2(i));
  }else{
   $('refNote').textContent='عکس مرجع؛ برای دیدن این مدل روی چهره‌تان، با عکس خودتان امتحان کنید.';
   // Do not replace the current hairstyle with an unrelated render.
  }
  summary();
 }
 function summary(){
  const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
  $('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
  const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}

 /* ---------- one-shot walkthrough, after the page and hero assets are ready ---------- */
 const hand=$('demoHand'),file=$('demoFile'),caption=$('demoCaption'),invite=$('mirrorInvite');
 let demoController=null,demonstrating=false,played=false;
 let inviteTimer=0;
 function showFront(){clearTimeout(inviteTimer);stage.classList.remove('mirror-flipped');invite.inert=true;}
 // The invitation is a moment, not the end state: the model returns unless the visitor is using it.
 function returnLater(){clearTimeout(inviteTimer);inviteTimer=setTimeout(()=>{if(invite.matches(':hover,:focus-within')){returnLater();return}showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'},6500)}
 function revealPortrait(){stage.classList.add('portrait-visible');}
 function endDemo(message){
  demoController?.abort();demoController=null;demonstrating=false;
  stage.dataset.demo='idle';revealPortrait();
  hand.getAnimations().forEach(a=>a.cancel());file.getAnimations().forEach(a=>a.cancel());
  hand.classList.remove('visible','press');file.classList.remove('visible');
  film.querySelectorAll('.demo-highlight').forEach(el=>el.classList.remove('demo-highlight'));
  $('skipDemo').hidden=true;$('replayDemo').hidden=false;
  if(message)caption.textContent=message;
 }
 const delay=(ms,signal)=>new Promise((resolve,reject)=>{
  if(signal.aborted){reject(new DOMException('Aborted','AbortError'));return}
  const done=()=>{signal.removeEventListener('abort',abort);resolve()};
  const timer=setTimeout(done,ms);
  const abort=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'))};
  signal.addEventListener('abort',abort,{once:true});
 });
 function pointAt(el){const a=stage.getBoundingClientRect(),b=el.getBoundingClientRect();return {left:b.left-a.left+b.width*.55,top:b.top-a.top+b.height*.45}}
 async function moveHand(el,signal){
  const p=pointAt(el);hand.classList.add('visible');
  const previous={left:hand.style.left||'60%',top:hand.style.top||'30%'};
  hand.style.left=p.left+'px';hand.style.top=p.top+'px';
  hand.animate([previous,{left:p.left+'px',top:p.top+'px'}],{duration:650,easing:'ease-in-out'});
  await delay(700,signal);hand.classList.add('press');await delay(180,signal);hand.classList.remove('press');
 }
 async function walkthrough(){
  if(demonstrating)return;
  showFront();played=true;endDemo();
  if(reduced){caption.textContent='مدل و رنگ دلخواهتان را روی آینه انتخاب کنید.';return}
  const controller=new AbortController(),signal=controller.signal;demoController=controller;demonstrating=true;
  stage.dataset.demo='playing';stage.classList.remove('portrait-visible');$('skipDemo').hidden=false;$('replayDemo').hidden=true;
  st.color=null;st.style=null;mark(sws,-1);mark(cards,-1);mark(dItems,-1);$('ref').inert=true;$('ref').classList.remove('on');summary();
  try{
   const loaded=await setLook('base');if(signal.aborted)return;if(!loaded){endDemo();return}
   caption.textContent='۱ · عکس چهره یا دستتان را بارگذاری کنید';
   await delay(450,signal);
   const m=mirror.getBoundingClientRect(),r=stage.getBoundingClientRect();
   const dest={left:m.left-r.left+m.width*.48,top:m.top-r.top+m.height*.4};
   const begin={left:Math.max(20,dest.left-130),top:Math.max(35,dest.top-160)};
   file.style.left=begin.left+'px';file.style.top=begin.top+'px';file.classList.add('visible');
   hand.style.left=(begin.left+60)+'px';hand.style.top=(begin.top+65)+'px';hand.classList.add('visible');
   const px=p=>({left:p.left+'px',top:p.top+'px'});
   file.animate([px(begin),px(dest)],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
   hand.animate([{left:(begin.left+60)+'px',top:(begin.top+65)+'px'},{left:(dest.left+60)+'px',top:(dest.top+65)+'px'}],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
   await delay(1250,signal);file.classList.remove('visible');file.getAnimations().forEach(a=>a.cancel());hand.getAnimations().forEach(a=>a.cancel());
   hand.style.left=(dest.left+60)+'px';hand.style.top=(dest.top+65)+'px';revealPortrait();
   await delay(1000,signal);
   const demoStyle=dItems[5]?5:0;
   caption.textContent='۲ · مدل دلخواهتان را روی چهرهٔ خود ببینید';
   // On phones the dock is below the mirror: leave the viewport under the visitor's control.
   if(!mobile.matches)await moveHand(dItems[demoStyle],signal);
   else dItems[demoStyle].classList.add('demo-highlight');
   await pickStyle(demoStyle);if(signal.aborted)return;
   await delay(1100,signal);dItems[demoStyle].classList.remove('demo-highlight');
   caption.textContent='۳ · رنگ مو را هم امتحان کنید';
   if(!mobile.matches)await moveHand(sws[4],signal);else sws[4].classList.add('demo-highlight');
   await pickColor(4);await delay(1300,signal);sws[4].classList.remove('demo-highlight');
   hand.classList.remove('visible');
   caption.textContent='انتخابتان را همراه تصویر برای تأیید یا رد به سالن بفرستید.';
   await delay(1300,signal);
   endDemo('همین حالا با تصویر خودتان امتحان کنید.');
   stage.classList.add('mirror-flipped');invite.inert=false;returnLater();
  }catch(error){if(error.name!=='AbortError')endDemo('مدل و رنگ دلخواهتان را روی آینه انتخاب کنید.')}
 }
 $('openHeroDemo').addEventListener('click',e=>{
  e.preventDefault();played=true;endDemo('مدل و رنگ دلخواهتان را انتخاب کنید.');showFront();
  const target=$('heroPlayground')||studio;
  target.scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});
  const choice=dock.querySelector('[aria-checked="true"]')||dock.querySelector('[role="radio"]');
  choice?.focus({preventScroll:true});
 });
 $('skipDemo').addEventListener('click',()=>endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.'));
 $('replayDemo').addEventListener('click',walkthrough);
 $('backToMirror').addEventListener('click',()=>{showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'});
 // Human interaction always wins. No scripted cursor intercepts a real click or keyboard action.
 const human=e=>{if(!e.isTrusted||e.target.closest('.demo-controls'))return;if(demonstrating)endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.');if(e.target.closest('#dock,#colors,#styles')){revealPortrait();showFront()}};
 film.addEventListener('pointerdown',human,true);film.addEventListener('keydown',human,true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')});
 const loader=$('siteLoader');
 const essential=Promise.allSettled([prepare('base'),prepare('s06')]);
 loader.hidden=false;
 document.documentElement.classList.add('hero-loading');
 let loadingTimeout;
 const deadline=new Promise(resolve=>{loadingTimeout=setTimeout(()=>resolve(false),1800)});
 window.__AYN_HERO_READY=Promise.race([essential.then(results=>results.every(result=>result.status==='fulfilled'&&result.value)),deadline]).finally(()=>{
  clearTimeout(loadingTimeout);
  $('loaderProgress').style.width='100%';
  document.documentElement.classList.remove('hero-loading');
  loader.classList.add('is-done');
  setTimeout(()=>loader.remove(),450);
 });
 window.__AYN_HERO_READY.then(ready=>{
  // Never steal attention back if the visitor started interacting or scrolled past the hero while loading.
  const r=film.getBoundingClientRect();if(!ready||played||r.bottom<innerHeight*.5||r.top>innerHeight){endDemo();return}
  walkthrough();
 });
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')},{threshold:0}).observe(studio);
 film.addEventListener('pointerdown',()=>{played=true},{once:true});
 /* ---------- scroll plays the scene (desktop pin only) ---------- */
 const hdr=document.querySelector('.site-header');let tick=false;
 function frameUpdate(){tick=false;
  const hh=hdr?hdr.offsetHeight:76;document.documentElement.style.setProperty('--hh',hh+'px');
  if(mobile.matches){stage.style.setProperty('--p','0');stage.style.setProperty('--z','1');return}
  const span=film.offsetHeight-stage.offsetHeight;if(span<=0)return;
  const p=cl((hh-film.getBoundingClientRect().top)/span,0,1);
  stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--z',(1+p*.08).toFixed(4));
  $('fade').style.opacity=sm(.6,1,p).toFixed(3)}
 const req=()=>{if(!tick){tick=true;requestAnimationFrame(frameUpdate)}};
 addEventListener('scroll',req,{passive:true});
 new ResizeObserver(()=>{layout();req()}).observe(mirror);
 layout();frameUpdate();
})();
