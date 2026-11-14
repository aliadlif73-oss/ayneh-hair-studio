/* First-party funnel telemetry. Anonymous per-tab session held in sessionStorage:
   no cookies, no persistent identifier, no PII, no third-party script. Events are
   best-effort (keepalive) and never block or break the visitor's journey. */
(()=>{
 const KINDS=['cta_click','demo_open','wizard_start','wizard_step_complete','wizard_skip',
  'preview_ready','activation_available','otp_sent','otp_verified','lead_submit','lead_submit_failed'];
 let session='';
 try{
  session=sessionStorage.getItem('ayneh_funnel')||'';
  if(!session){
   session=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2);
   sessionStorage.setItem('ayneh_funnel',session);
  }
 }catch{session=''}
 const q=new URLSearchParams(location.search),p=k=>(q.get(k)||'').slice(0,80);
 let ref='';try{ref=new URL(document.referrer).origin}catch{}
 /* Only the referrer ORIGIN is kept: full URLs can carry private query strings. */
 const attribution={utm_source:p('utm_source'),utm_medium:p('utm_medium'),
  utm_campaign:p('utm_campaign'),utm_content:p('utm_content'),utm_term:p('utm_term'),
  referrer:ref.slice(0,120),landing:location.pathname.slice(0,60),host:location.hostname.slice(0,80)};
 const send=(kind,extra)=>{
  if(!KINDS.includes(kind))return;
  const e=extra&&typeof extra==='object'?extra:{};
  const meta=JSON.stringify(e).slice(0,300);
  const step=Number.isInteger(e.step)&&e.step>=0&&e.step<=20?e.step:null;
  const body=JSON.stringify({session,kind,step,meta,attribution});
  try{fetch('/api/event',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{})}catch{}
 };
 window.__AYN_TRACK=send;
 window.__AYN_ATTR=()=>({...attribution});
 /* Delegated so no CTA can be added later without being measured. Capture phase
    records the click before an off-site navigation discards the document. */
 document.addEventListener('click',e=>{
  const t=e.target instanceof Element?e.target:e.target?.parentElement;if(!t)return;
  const a=t.closest('a,button');if(!a)return;
  const href=a.getAttribute('href')||'';
  const label=(a.textContent||'').trim().replace(/\s+/g,' ').slice(0,60);
  if(href.startsWith('/s/')||/ayneh-salon\.site\/s\//.test(href)){
   send('demo_open',{label,href:href.slice(0,120)});return
  }
  if(href==='#salon-example'||a.id==='builderActivate'||
     a.classList.contains('sticky-cta')||a.id==='leadFallbackToggle'){
   send('cta_click',{label,href:href.slice(0,60),
    where:a.classList.contains('sticky-cta')?'sticky':(a.closest('header')?'header':'page')});
  }
 },{capture:true,passive:true});
})();
