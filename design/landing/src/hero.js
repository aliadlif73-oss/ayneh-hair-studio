/* Film hero. Data-driven: STYLES / COLORS below are the only things to extend.
   - Colour changes are real: the model's hair is recoloured on a canvas through a hair mask (assets/hair-mask.png).
   - Style changes use the catalogue photo as the reference card plus a scan pass over the model; a true re-render of the
     model in that style is the AI simulation (product feature), not faked here. */
(()=>{
 const $=id=>document.getElementById(id);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'assets/')+k+'.'+(e||'webp'));
 const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
 const STYLES=['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
 // first four = approved swatches (D060); the rest are proposed additions
 const COLORS=[
  {id:'champagne',name:'بلوند شامپاینی',h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {id:'caramel',name:'کاراملی',h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {id:'espresso',name:'اسپرسو',h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {id:'ombre',name:'آمبره',ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {id:'copper',name:'مسی',h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {id:'platinum',name:'بلوند پلاتینی',h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {id:'wine',name:'شرابی',h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const st={style:null,color:null,shown:null,look:'long'};
 const stage=$('stage'),film=$('intro'),track=$('track'),colList=$('colList');
 if(!reduced)stage.classList.add('js-film');

 /* ---------- build rails ---------- */
 const frame='<svg class="frame" aria-hidden="true"><rect pathLength="1"/></svg>';
 const cards=STYLES.map((name,i)=>{
  const b=document.createElement('button');b.type='button';b.className='card'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  const n=String(i+1).padStart(2,'0');
  b.innerHTML='<span class="ph"><img src="'+SRC('s'+n)+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>'+frame;
  b.addEventListener('click',()=>pickStyle(i));track.append(b);return b});
 $('styCount').textContent='· '+fa(STYLES.length)+' مدل';
 const sws=COLORS.map((c,i)=>{
  const b=document.createElement('button');b.type='button';b.className='sw'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  b.innerHTML='<span class="dot"><i style="background:'+c.css+'"></i></span><span>'+c.name+'</span>'+frame;
  b.addEventListener('click',()=>pickColor(i));colList.append(b);return b});


 /* ---------- dock on the podium (approved icon selector) ---------- */
 const dockTrack=$('dockTrack'),dock=$('dock'),room=$('room');
 // Icon-to-style pairing is a placeholder until one 3D icon exists per style; the four icons are the approved set.
 const dItems=STYLES.map((name,i)=>{
  const b=document.createElement('button');b.type='button';b.className='d-item'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  const flip=(i%8)>=4?' style="transform:scaleX(-1)"':'';
  b.innerHTML='<span class="ic"><img src="'+SRC('ic'+(i%4+1))+'" alt=""'+flip+' draggable="false"></span><span>'+name+'</span>'+frame;
  b.addEventListener('click',()=>pickStyle(i));dockTrack.append(b);return b});
 function layout(){
  const W=room.clientWidth,H=room.clientHeight;if(!W||!H)return;
  const s=Math.max(W/1376,H/768),ox=(W-1376*s)*.5,oy=(H-768*s)*.36;
  dock.style.setProperty('--dk-x',(ox+686*s)+'px');dock.style.setProperty('--dk-y',(oy+503*s)+'px');dock.style.setProperty('--dk-w',(372*s*.86)+'px')}
 let dDrag=null,dMoved=false;
 dockTrack.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dDrag={x:e.clientX,s:dockTrack.scrollLeft};dMoved=false});
 addEventListener('pointermove',e=>{if(!dDrag)return;const dx=e.clientX-dDrag.x;if(Math.abs(dx)>5){dMoved=true;dockTrack.classList.add('dragging')}if(dMoved)dockTrack.scrollLeft=dDrag.s+dx*(getComputedStyle(dockTrack).direction==='rtl'?1:-1)});
 addEventListener('pointerup',()=>{if(dDrag){dDrag=null;setTimeout(()=>dockTrack.classList.remove('dragging'),0)}});
 dockTrack.addEventListener('click',e=>{if(dMoved){e.stopPropagation();e.preventDefault();dMoved=false}},true);
 const dStep=()=>dockTrack.clientWidth*.6,sgn=el=>getComputedStyle(el).direction==='rtl'?1:-1;
 $('dkPrev').addEventListener('click',()=>dockTrack.scrollBy({left:dStep()*sgn(dockTrack),behavior:reduced?'auto':'smooth'}));
 $('dkNext').addEventListener('click',()=>dockTrack.scrollBy({left:-dStep()*sgn(dockTrack),behavior:reduced?'auto':'smooth'}));
 /* arrow on the dock opens the photo rail */
 const rail=$('styles'),more=$('more');let railSeen=false;
 function setRail(open){
  rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open&&!railSeen){railSeen=true;flyIn(cards,0)}
  if(open)setTimeout(()=>{const sel=cards[st.style??0];sel&&sel.scrollIntoView({inline:'center',block:'nearest',behavior:'auto'})},60);
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 const R={x:500,y:150,w:380,h:310},TOP=185,BOT=430;
 let px=null,rafId=0,lookTok=0;
 const img2=$('roomImg2');
 /* looks: each look = a full render of the mirror scene + its own hair mask. Today lob/bob are cut from the photo;
    the same slots take AI renders per style later (see LOOK_OF). */
 const LOOKS={long:{img:'hero',mask:'hair-mask'},lob:{img:'look-lob',mask:'hair-mask-lob'},bob:{img:'look-bob',mask:'hair-mask-bob'}};
 const LOOK_OF=['long','long','lob','lob','lob','bob','bob','bob','long','long','long','long','long','long','long','long','long','long','long'];
 const SHAPED=[0,1,2,3,4,5,6,7]; // styles whose shape is applied to the model today
 const preps={};
 function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
 function prepare(key){
  if(preps[key])return preps[key];
  const L=LOOKS[key];
  return preps[key]=Promise.all([loadImg(SRC(L.img)),loadImg(SRC(L.mask,'png'))]).then(([im,mi])=>{
   const W=cv.width,H=cv.height,a=document.createElement('canvas');a.width=W;a.height=H;const c=a.getContext('2d',{willReadFrequently:true});
   c.drawImage(im,0,0,W,H);const base=c.getImageData(R.x,R.y,R.w,R.h).data;
   c.clearRect(0,0,W,H);c.drawImage(mi,0,0,W,H);const mk=c.getImageData(R.x,R.y,R.w,R.h).data;
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mk[i*4]>6)idx.push(i);
   return {src:im.src,base,mk,idx,out:ctx.createImageData(R.w,R.h)}}).catch(()=>null);
 }
 function startPrep(){prepare('long').then(p=>{px=p});prepare('lob');prepare('bob')}
 if(img.complete)startPrep();else img.addEventListener('load',startPrep);
 async function setLook(key,after){
  if(key===st.look){after&&after();return}
  const my=++lookTok;st.look=key;cancelAnimationFrame(rafId);px=null;ctx.clearRect(0,0,cv.width,cv.height);
  const p=await prepare(key);if(my!==lookTok||!p)return;
  img2.src=p.src;try{await img2.decode()}catch(e){}
  img2.classList.add('show');
  setTimeout(()=>{if(my!==lookTok)return;img.src=p.src;const done=()=>{img2.style.transition='none';img2.classList.remove('show');void img2.offsetWidth;img2.style.transition='';px=p;after&&after()};img.decode?img.decode().then(done,done):done()},reduced?0:500);
 }
 const cl=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function hsl(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
 function tint(c,Y,yn){let l=c.ombre?.16+(.7-.16)*sm(.3,.85,yn):c.l;l=cl(l+(Y-.4)*1.2,.03,.96);const s=c.s*(1-cl((l-.72)*2.2,0,.8));return hsl(c.h,s,l)}
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px){return}
  const {base,mk,idx,out}=px,o=out.data;o.fill(0);
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,cv.width,cv.height);return}
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,y=R.y+((i/R.w)|0),yn=cl((y-TOP)/(BOT-TOP),0,1);
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   let A=from?tint(from,Y,yn):[r0,g0,b0],B=to?tint(to,Y,yn):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=B[2]*t+A[2]*(1-t);
   if(scan>=0){const d=(y-R.y)/R.h-scan,w=Math.exp(-(d*d)/.0045)*.75;r+=(255-r)*w*.8+30*w;g+=(255-g)*w*.7+18*w;b+=(255-b)*w*.45}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,cv.width,cv.height);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){run(820,x=>draw(prev,next,ease(x),x*1.3-.15),()=>draw(null,next,1,-1))}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 function mark(list,idx){list.forEach((b,i)=>b.setAttribute('aria-checked',String(i===idx)))}
 function pickColor(i){const prev=st.shown;st.color=i;st.shown=COLORS[i];mark(sws,i);paintColor(prev,st.shown);summary()}
 function pickStyle(i){st.style=i;mark(cards,i);mark(dItems,i);
  const n=String(i+1).padStart(2,'0');$('refImg').src=SRC('s'+n);$('refName').textContent=STYLES[i];$('ref').classList.add('on');
  const key=LOOK_OF[i];
  $('refNote').textContent=SHAPED.includes(i)?'شکل مو روی مدل اعمال شد':'شکل این مدل با شبیه‌سازی روی عکس خودت دیده می‌شود';
  if(key!==st.look)setLook(key,()=>st.shown?paintColor(null,st.shown):paintScan(null));else paintScan(st.shown);
  summary()}
 function summary(){
  const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
  $('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
  const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}

 /* ---------- rail controls: drag, buttons ---------- */
 let drag=null,moved=false;
 const dirSign=()=>getComputedStyle(track).direction==='rtl'?1:-1;
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,s:track.scrollLeft};moved=false});
 addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5){moved=true;track.classList.add('dragging')}if(moved)track.scrollLeft=drag.s+dx*dirSign()*-1*-1});
 addEventListener('pointerup',()=>{if(drag){drag=null;setTimeout(()=>track.classList.remove('dragging'),0)}});
 track.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 const step=()=>track.clientWidth*.7;
 $('stPrev').addEventListener('click',()=>track.scrollBy({left:step()*dirSign(),behavior:reduced?'auto':'smooth'}));
 $('stNext').addEventListener('click',()=>track.scrollBy({left:-step()*dirSign(),behavior:reduced?'auto':'smooth'}));

 /* arrow keys move between options inside each radio group */
 [[cards,track],[dItems,dockTrack],[sws,colList]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
  const k=e.key,i=list.indexOf(document.activeElement);if(i<0)return;
  const dir=(k==='ArrowRight'||k==='ArrowDown')?(box===colList||k==='ArrowDown'?1:-1):(k==='ArrowLeft'||k==='ArrowUp')?(box===colList||k==='ArrowUp'?-1:1):0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus();n.scrollIntoView({inline:'center',block:'nearest'})}));
 /* ---------- act I/II: entrance ---------- */
 function flyIn(list,base){
  list.forEach((c,i)=>{
   const a=c.animate([{transform:'translateX('+(110+i*6)+'vw) skewX(-16deg)',filter:'blur(8px)',opacity:0},{opacity:1,offset:.18},{transform:'translateX(0) skewX(0)',filter:'blur(0)',opacity:1}],{duration:1700,delay:base+i*55,easing:'cubic-bezier(.08,.82,.12,1)',fill:'both'});
   a.onfinish=()=>{c.classList.remove('pre');a.cancel()}})}
 function entrance(){
  if(reduced)return;
  flyIn(dItems,700);
  sws.forEach((c,i)=>{
   const a=c.animate([{transform:'translateY(90px)',opacity:0},{transform:'none',opacity:1}],{duration:900,delay:500+i*80,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
   a.onfinish=()=>{c.classList.remove('pre');a.cancel()}});
  setTimeout(()=>paintScan(null),2300);
  /* hint that the dock scrolls: a short nudge, then back */
  setTimeout(()=>{dockTrack.scrollBy({left:-52*sgn(dockTrack),behavior:'smooth'});setTimeout(()=>dockTrack.scrollBy({left:52*sgn(dockTrack),behavior:'smooth'}),900)},3200);
 }
 setTimeout(entrance,reduced?0:900);

 /* ---------- act III: scroll plays the scene ---------- */
 const hdr=document.querySelector('.site-header');let tick=false;
 function frameUpdate(){tick=false;
  const hh=hdr?hdr.offsetHeight:76;document.documentElement.style.setProperty('--hh',hh+'px');
  const span=film.offsetHeight-stage.offsetHeight;if(span<=0)return;
  const p=cl((hh-film.getBoundingClientRect().top)/span,0,1);
  stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--z',(1+p*.12).toFixed(4));
  $('fade').style.opacity=sm(.55,1,p).toFixed(3)}
 const req=()=>{if(!tick){tick=true;requestAnimationFrame(frameUpdate)}};
 addEventListener('scroll',req,{passive:true});addEventListener('resize',()=>{layout();req()});layout();frameUpdate();if(img.complete)layout();else img.addEventListener('load',layout);
})();
