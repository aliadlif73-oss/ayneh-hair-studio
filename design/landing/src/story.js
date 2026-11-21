/* Scroll-scrubbed cinematic brand film behind every page and section. */
(()=>{
const secs=[...document.querySelectorAll('main > section[id]')].filter(el=>!el.hidden);
if(!secs.length)return;
const rm=matchMedia('(prefers-reduced-motion: reduce)').matches,base=window.__AYN_BASE||'assets/';
const svc=(document.body.dataset&&document.body.dataset.service)||(location.pathname==='/sample'?'sample':'home');
const nl=svc==='nails'||svc==='lashes';
/* [art, pos, z0, z1, x0, x1, y0, y1, veilAlpha] */
const S={
intro:nl?[3,'50% 44%',1.03,1.1,0,1.2,0,-2.4,.44]:svc==='hair'?[2,'54% 40%',1.03,1.1,0,-1.2,0,-2.4,.44]:svc==='color'?[5,'52% 44%',1.03,1.1,0,1.1,0,-2.2,.44]:svc==='salon'?[4,'50% 44%',1.03,1.1,0,1.1,0,-2.4,.44]:[1,'52% 42%',1.02,1.09,0,1,0,-2.2,.46],
'try-head':[2,'50% 42%',1.03,1.09,0,.9,0,-2,.44],play:[1,'48% 46%',1.04,1.11,-.9,1,1.4,-1.8,.42],
demo:[nl?3:svc==='color'?5:2,'52% 44%',1.04,1.12,-1.1,1.1,1.6,-2,.4],sample:[nl?3:2,'46% 48%',1.05,1.12,1,-1,1.4,-1.8,.42],
choose:[3,'50% 46%',1.04,1.12,1,-1.1,1.6,-2,.38],glance:[3,'50% 46%',1.04,1.11,-.9,.9,1.4,-1.8,.4],
team:[2,'48% 46%',1.04,1.11,1,-.9,1.4,-1.8,.4],flow:[4,'52% 46%',1.03,1.11,-1,1,1.5,-2,.4],
benefits:[4,'48% 48%',1.04,1.12,.9,-1,1.5,-1.8,.42],'salon-example':[4,'46% 52%',1.05,1.13,-.9,1.2,1.6,-2,.42],
bundle:[1,'50% 48%',1.04,1.11,-.8,.8,1.3,-1.7,.42],services:[5,'50% 46%',1.03,1.1,-1,1,1.4,-1.8,.44],
pay:[5,'54% 50%',1.05,1.12,.9,-.9,1,-1.5,.5],cta:[5,'50% 50%',1.04,1.11,-.8,.9,1.3,-1.7,.44],
faq:[1,'50% 54%',1.09,1.02,.9,-.7,-1.4,1.3,.46]
};
const frames=secs.map((el,i)=>({el,s:S[el.id]||[(i%5)+1,'50% 48%',1.04,1.11,-.9,.9,1.3,-1.7,.42]}));
const layer=document.createElement('div');
layer.className = 'story';layer.setAttribute('aria-hidden', 'true');
const nodes=frames.map((f,i)=>{
const w=document.createElement('div');w.className='story__frame'+(i===0?' is-on':'');w.dataset.scene=f.el.id;
const img=document.createElement('img');img.className='story__img';img.alt='';img.decoding='async';img.width=1600;img.height=900;img.style.objectPosition=f.s[1];
const u=base+'film-bg-'+f.s[0]+'.webp';if(i<2)img.src=u;else img.dataset.src=u;
w.append(img);layer.append(w);return{w,img,s:f.s,op:i===0?1:0};
});
const veil=document.createElement('div');veil.className='story__veil';
const rail=document.createElement('div');rail.className='story__rail';rail.innerHTML='<i></i>';
const bar=document.createElement('div');bar.className='story__bar';bar.innerHTML='<i></i>';
const fill=rail.firstChild,bfill=bar.firstChild;layer.append(veil,rail,bar);document.body.prepend(layer);
const load=i=>{const n=nodes[i];if(n&&n.img.dataset.src){n.img.src=n.img.dataset.src;n.img.removeAttribute('data-src')}};
let spans=[],maxS=1,raf=0;
const measure=()=>{spans=secs.map(el=>{const r=el.getBoundingClientRect();return{top:r.top+scrollY,h:Math.max(240,r.height)}});maxS=Math.max(1,document.documentElement.scrollHeight-innerHeight)};
const cl=(v,a,b)=>v<a?a:v>b?b:v,lp=(a,b,t)=>a+(b-a)*t;
function render(){
raf=0;const vh=innerHeight||800,f=scrollY+vh*.46;let idx=0;
for(let i=0;i<spans.length;i++)if(spans[i].top<=f)idx=i;
load(idx);load(idx+1);load(idx-1);
const cur=spans[idx],p=cl((f-cur.top)/Math.max(1,cur.h),0,1),bl=spans[idx+1]?cl((p-.68)/.32,0,1):0;
for(let i=0;i<nodes.length;i++){
const n=nodes[i],op=i===idx?1-bl:(i===idx+1&&bl>0?bl:0),on=op>.005;
n.w.classList.toggle('is-on',on);
if(on){
n.w.style.opacity=op.toFixed(3);
if(!rm){const t=i===idx?p:cl((f-spans[i].top+vh*.35)/Math.max(1,spans[i].h),0,1),s=n.s;
n.img.style.transform='translate3d('+lp(s[4],s[5],t).toFixed(2)+'%,'+lp(s[6],s[7],t).toFixed(2)+'%,0) scale('+lp(s[2],s[3],t).toFixed(4)+')'}
}else if(n.op!==0)n.w.style.opacity='0';
n.op=op;
}
const a=nodes[idx].s[8],na=nodes[idx+1]?lp(a,nodes[idx+1].s[8],bl):a;
veil.style.setProperty('--veil-tone','rgba(252,243,235,'+na.toFixed(3)+')');
layer.dataset.scene=frames[idx].el.id;
const prog=cl(scrollY/maxS,0,1).toFixed(4);
fill.style.transform='scaleY('+prog+')';bfill.style.transform='scaleX('+prog+')';
}
const sched=()=>{if(!raf)raf=requestAnimationFrame(render)},re=()=>{measure();sched()};
addEventListener('scroll',sched,{passive:true});addEventListener('resize',re,{passive:true});addEventListener('load',re);
if(window.ResizeObserver)new ResizeObserver(re).observe(document.body);
re();
})();
