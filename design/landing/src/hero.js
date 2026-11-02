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
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.'+(e||'webp'));
 const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
 const STYLES=['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
 const COLORS=[
  {name:'بلوند شامپاینی',h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {name:'کاراملی',h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {name:'اسپرسو',h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {name:'آمبره',ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {name:'مسی',h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {name:'بلوند پلاتینی',h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {name:'شرابی',h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const READY=new Set(window.__AYN_LOOKS||[]);
 const st={style:null,color:null,look:'base'};
 const film=$('intro'),stage=$('stage'),studio=$('studio'),mirror=$('mirror'),plate=$('plate'),dock=$('dock'),palette=$('colors');
 const frame='<svg class="frame" aria-hidden="true"><rect pathLength="1"/></svg>';
 const mobile=matchMedia('(max-width:900px)');

 /* ---------- build the three pickers ---------- */
 const make=(cls,html,onPick,box)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.innerHTML=html+frame;b.addEventListener('click',()=>{if(!b.closest('.hscroll')?.classList.contains('was-dragged'))onPick()});box.append(b);return b};
 const n2=i=>String(i+1).padStart(2,'0');
 const cards=STYLES.map((name,i)=>make('card','<span class="ph"><img src="'+SRC('s'+n2(i))+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>',()=>pickStyle(i),$('track')));
 const dItems=STYLES.map((name,i)=>make('d-item','<span class="ic"><img src="'+SRC('ic'+(i%4+1))+'" alt=""'+((i%8)>=4?' style="transform:scaleX(-1)"':'')+' draggable="false"></span><span>'+name+'</span>',()=>pickStyle(i),$('dockTrack')));
 const sws=COLORS.map((c,i)=>make('sw','<span class="dot"><i style="background:'+c.css+'"></i></span><span>'+c.name+'</span>',()=>pickColor(i),$('colList')));
 $('styCount').textContent='· '+fa(STYLES.length)+' مدل';

 /* ---------- plate placement: cover the mirror box, keep the mirror in view ---------- */
 const FX=.4985,FY=.44;
 function layout(){
  const W=mirror.clientWidth,H=mirror.clientHeight;if(!W||!H)return;
  const s=Math.max(W/1376,H/768)*(mobile.matches?1.5:1),pw=1376*s,ph=768*s;
  const x=Math.min(0,Math.max(W-pw,W/2-FX*pw)),y=Math.min(0,Math.max(H-ph,H*.5-FY*ph));
  Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:x+'px',top:y+'px'});
  dock.style.setProperty('--u',mobile.matches?'1':Math.max(.62,Math.min(1.35,s/.84)).toFixed(3));
  // phones: the podium is too small for the dock, so it sits under the mirror instead
  // phones: colours and the style dock sit under the mirror, where thumbs can reach them
  if(mobile.matches){if(dock.parentElement===plate){studio.after(palette);palette.after(dock);dock.classList.add('mobile');palette.classList.add('mobile')}}
  else if(dock.parentElement!==plate){plate.append(dock);mirror.append(palette);dock.classList.remove('mobile');palette.classList.remove('mobile')}
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
 [[cards,$('track')],[dItems,$('dockTrack')],[sws,$('colList')]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
  const i=list.indexOf(document.activeElement);if(i<0)return;
  const k=e.key,vertical=box.id==='colList';
  const dir=k==='ArrowDown'||(!vertical&&k==='ArrowLeft')?1:k==='ArrowUp'||(!vertical&&k==='ArrowRight')?-1:0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus();n.scrollIntoView({inline:'center',block:'nearest'})}));

 /* ---------- all-styles rail ---------- */
 const rail=$('styles'),more=$('more');
 function setRail(open){
  rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open){setTimeout(()=>{(cards[st.style??0]).scrollIntoView({inline:'center',block:'nearest'});syncArrows();cards[st.style??0].focus({preventScroll:true})},60)}
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),img2=$('roomImg2'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 let px=null,rafId=0,lookTok=0;const preps={};
 const loadImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
 const lookAssets=key=>key==='base'?['hero','hair-mask']:['look-'+key,'mask-'+key];
 function prepare(key){
  if(preps[key])return preps[key];
  const [im,mk]=lookAssets(key);
  return preps[key]=Promise.all([loadImg(SRC(im)),loadImg(SRC(mk,'png'))]).then(([a,m])=>{
   const W=1376,H=768,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(m,0,0,W,H);const full=g.getImageData(0,0,W,H).data;
   let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(full[(y*W+x)*4]>6){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
   if(x1<x0)return null;
   const R={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1};
   const mkd=g.getImageData(R.x,R.y,R.w,R.h).data;g.clearRect(0,0,W,H);g.drawImage(a,0,0,W,H);const base=g.getImageData(R.x,R.y,R.w,R.h).data;
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mkd[i*4]>6)idx.push(i);
   return {src:a.src,R,base,mk:mkd,idx,out:ctx.createImageData(R.w,R.h)}}).catch(()=>null);
 }
 const startPrep=()=>prepare('base').then(p=>{if(st.look==='base'){px=p;if(st.color!=null)draw(null,COLORS[st.color],1,-1)}});
 if(img.complete)startPrep();else img.addEventListener('load',startPrep);
 async function setLook(key){
  if(key===st.look)return;
  const my=++lookTok,p=await prepare(key);if(my!==lookTok||!p)return;
  st.look=key;cancelAnimationFrame(rafId);
  img2.src=p.src;try{await img2.decode()}catch(e){}
  ctx.clearRect(0,0,1376,768);img2.classList.add('show');
  setTimeout(()=>{if(my!==lookTok)return;img.src=p.src;const done=()=>{img2.style.transition='none';img2.classList.remove('show');void img2.offsetWidth;img2.style.transition='';px=p;st.color!=null?paintColor(null,COLORS[st.color]):paintScan(null)};img.decode?img.decode().then(done,done):done()},reduced?0:480);
 }
 const cl=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function hsl(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
 function tint(c,Y,yn){let l=c.ombre?.16+(.7-.16)*sm(.3,.85,yn):c.l;l=cl(l+(Y-.4)*1.2,.03,.96);const s=c.s*(1-cl((l-.72)*2.2,0,.8));return hsl(c.h,s,l)}
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px)return;
  const {R,base,mk,idx,out}=px,o=out.data;
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,1376,768);return}
  o.fill(0);
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,yr=(i/R.w)|0,yn=yr/R.h;
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   const A=from?tint(from,Y,yn):[r0,g0,b0],B=to?tint(to,Y,yn):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=A[2]+(B[2]-A[2])*t;
   if(scan>=0){const d=yn-scan,w=Math.exp(-(d*d)/.0045)*.7;r+=(255-r)*w*.75+26*w;g+=(255-g)*w*.65+14*w;b+=(255-b)*w*.4}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,1376,768);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){run(820,x=>draw(prev,next,ease(x),x*1.3-.15),()=>draw(null,next,1,-1))}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 const mark=(list,idx)=>list.forEach((b,i)=>b.setAttribute('aria-checked',String(i===idx)));
 function pickColor(i){const prev=st.color!=null?COLORS[st.color]:null;st.color=i;mark(sws,i);paintColor(prev,COLORS[i]);summary()}
 function pickStyle(i){
  st.style=i;mark(cards,i);mark(dItems,i);
  $('refImg').src=SRC('s'+n2(i));$('refName').textContent=STYLES[i];$('ref').classList.add('on');
  const key='s'+n2(i);
  if(READY.has(i+1)){$('refNote').textContent='شکل مو روی مدل نشست.';setLook(key)}
  else{$('refNote').textContent='این مدل روی عکس خود مشتری ساخته می‌شود.';setLook('base');const cur=st.color!=null?COLORS[st.color]:null;if(st.look==='base')paintScan(cur)}
  summary()}
 function summary(){
  const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
  $('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
  const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}

 /* ---------- entrance: everything is visible without it; the motion only adds ---------- */
 function entrance(){
  if(reduced)return;
  dItems.forEach((c,i)=>c.animate([{transform:'translateX(-60px)',opacity:0},{transform:'none',opacity:1}],{duration:900,delay:500+i*45,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
  sws.forEach((c,i)=>c.animate([{transform:'translateY(24px)',opacity:0},{transform:'none',opacity:1}],{duration:700,delay:400+i*70,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
  setTimeout(()=>paintScan(null),1900);
 }
 setTimeout(entrance,300);

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
