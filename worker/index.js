import legacy from './legacy.js';
import {appHTML} from './ui.js';
import {customerHTML} from './customer.js';
import {panelHTML} from './panel.js';
import {api,errorResponse,tick} from './server.js';
import {must} from './domain.js';
import {identity} from './auth.js';
import {fontResponse} from './fonts.js';
import {webhook,baleWebhook} from './telegram.js';
import {favicon,baseCSS} from './design.js';
import {sharePage} from './share.js';
import {landingHTML,servicePages} from './landing.js';
import {tryHTML,packsTag} from './regularpage.js';
import {directSalon} from './customers.js';
import {refCookie} from './rewards.js';
const htmlHeaders={'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; media-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",'Permissions-Policy':'camera=(self), geolocation=(), microphone=()'};
// Only real pages are served the app shell; everything else is a 404, never a blank app page.
const pages=[/^\/admin\/?$/,/^\/admin\/[a-z0-9-]{1,64}\/?$/,/^\/s\/[a-z0-9-]{1,64}\/?$/,/^\/i\/[a-z0-9-]{1,64}\/?$/,/^\/panel\/?$/,/^\/pay\/?$/,/^\/signin-with-chatgpt(\/.*)?$/];
const notFound='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#e8edeb"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><title>صفحه پیدا نشد | آینه</title><style>'+baseCSS+'.nf{min-height:100vh;display:grid;place-items:center;padding:32px 20px;text-align:center}.nf main{display:grid;justify-items:center;gap:18px;max-width:420px}.nf .mirror{width:150px}.nf .mirror__glass{aspect-ratio:3/4}.nf h1{font-family:var(--display);font-weight:800;font-size:32px}.nf p{color:var(--muted);line-height:2}</style></head><body class="nf"><main><div class="mirror"><div class="mirror__glass"></div></div><h1>این صفحه پیدا نشد</h1><p>نشانی اشتباه است یا صفحهٔ سالن برداشته شده. لینک اختصاصی سالن را دوباره باز کنید.</p><a class="btn btn--primary" href="/">صفحهٔ اصلی آینه</a></main></body></html>';
// Link previews (Telegram, WhatsApp, Instagram, iMessage) read these tags, so each salon page
// carries its own name, description and cover instead of the generic Ayneh ones.
const attr=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RESERVED_SUBS=new Set(['www','api','admin','panel','pay','app','mail','ftp','cdn','static','assets']);
function subdomainOf(u,env){
 const host=u.hostname.toLowerCase();
 const roots=['ayneh-salon.site'];
 try{const h=new URL(env.APP_ORIGIN||'').hostname.toLowerCase().replace(/^www\./,'');if(h&&!roots.includes(h)&&h!=='localhost'&&!/^\d+\.\d+\.\d+\.\d+$/.test(h)&&!h.endsWith('.run.app'))roots.push(h)}catch{}
 for(const r of roots){
  if(host.endsWith('.'+r)){
   const sub=host.slice(0,-(r.length+1));
   if(/^[a-z][a-z0-9-]{1,45}[a-z0-9]$/.test(sub)&&!RESERVED_SUBS.has(sub))return sub;
  }
 }
 return '';
}
async function salonPage(u,env,forcedSlug=''){
 const slug=forcedSlug||u.pathname.split('/')[2];let salon=null;
 let failed=!env.DB;try{salon=env.DB?await env.DB.prepare('SELECT slug,name,profile FROM salons WHERE slug=?').bind(slug).first():null}catch{failed=true}
 // A database hiccup still serves the page (it shows its own error); only a missing salon is a 404.
 if(!salon)return failed||slug==='demo'?customerHTML:null;
 let p={};try{p=JSON.parse(salon.profile||'{}')}catch{}
 const origin=env.APP_ORIGIN||u.origin,url=forcedSlug?(u.origin+'/'):(origin+'/s/'+salon.slug);
 const title=salon.name+' | مو، ناخن و مژهٔ بعدی‌ات را روی عکس خودت ببین';
 const desc=(p.bio?String(p.bio).slice(0,150)+' ':'')+'مدل مو، طرح ناخن یا مژه را روی عکس خودت امتحان کن و برای سالن بفرست.';
 const img=p.cover||p.logo?(forcedSlug?u.origin:origin)+'/api/s/'+salon.slug+'/media/'+(p.cover||p.logo):'';
 const tags='<title>'+attr(title)+'</title>\n<meta name="ayneh-slug" content="'+attr(salon.slug)+'">\n<meta name="description" content="'+attr(desc)+'">\n<meta property="og:title" content="'+attr(title)+'">\n<meta property="og:description" content="'+attr(desc)+'">\n<meta property="og:type" content="website">\n<meta property="og:url" content="'+attr(url)+'">\n<meta property="og:site_name" content="آینه">\n<meta property="og:locale" content="fa_IR">\n'+(img?'<meta property="og:image" content="'+attr(img)+'">\n<meta property="og:image:alt" content="'+attr(salon.name)+'">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="'+attr(img)+'">\n':'<meta name="twitter:card" content="summary">\n')+'<link rel="canonical" href="'+attr(url)+'">';
 return customerHTML.replace(/<meta name="description"[^>]*>\n?/,'').replace(/<meta property="og:[a-z:]+"[^>]*>\n?/g,'').replace(/<title>[^<]*<\/title>/,tags).replace('</body>',()=>packsTag+'</body>');
}
function appPage(ready,ver=''){
 const steps=['فایل را دانلود و نصب کنید. اگر اندروید پرسید، «اجازه از این منبع» را روشن کنید.','اپ «آینه‌پی» را باز کنید و کد ۶ رقمی را از پنل مدیر (پرداخت و پنل) وارد کنید.','سه دکمهٔ «اجازه بده» را بزنید. تمام؛ واریزها خودکار تأیید می‌شوند.'];
 return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#FCF3EB"><link rel="icon" href="/favicon.ico" sizes="48x48"><title>آینه‌پی | اپ تأیید خودکار واریز</title><style>@font-face{font-family:Vazirmatn;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");font-weight:100 900}body{margin:0;min-height:100vh;display:grid;place-items:center;background:#FCF3EB;color:#0A202A;font-family:Vazirmatn,system-ui,sans-serif;padding:24px}main{max-width:440px;width:100%;display:grid;gap:18px;text-align:center}.logo{width:76px;height:76px;margin:0 auto;border-radius:22px;background:linear-gradient(155deg,#0A8F6C,#0A6B54);display:grid;place-items:center;color:#fff;font-size:34px;font-weight:900;box-shadow:0 10px 26px rgba(6,143,108,.3)}h1{margin:0;font-size:26px}p{margin:0;color:#4A5C5C;line-height:1.9}.btn{display:block;padding:16px;border-radius:999px;background:#068F6C;color:#fff;font-weight:800;font-size:17px;text-decoration:none;box-shadow:0 8px 20px rgba(6,143,108,.3)}.btn[aria-disabled=true]{background:#9BB5AC;box-shadow:none}ol{text-align:start;background:#fff;border-radius:20px;padding:18px 36px 18px 18px;margin:0;line-height:2;color:#12333C;border:1px solid #EDE0D2}small{color:#5D6B68}</style></head><body><main><div class="logo">آ</div><h1>آینه‌پی</h1><p>پیامک واریز بلو را می‌خواند و سفارش آینه را خودکار تأیید می‌کند.</p>'+(ready?'<a class="btn" href="/app/ayneh-pay.apk" download>دانلود اپ اندروید</a>'+(ver?'<small>نسخهٔ '+attr(ver)+'</small>':''):'<a class="btn" aria-disabled="true">اپ در حال آماده‌سازی است؛ چند دقیقهٔ دیگر سر بزنید</a>')+'<ol>'+steps.map(s=>'<li>'+s+'</li>').join('')+'</ol></main></body></html>';
}
export default {
 async fetch(request,env){try{const u=new URL(request.url);
  if(u.pathname==='/api/internal/tick'){must(request.method==='POST','متد مجاز نیست',405);must(env.JOB_TOKEN&&request.headers.get('Authorization')==='Bearer '+env.JOB_TOKEN,'دسترسی مجاز نیست',403);return Response.json(await tick(env,u.origin));}
  const oldApi=['/api/config','/api/create','/api/status','/api/views'].includes(u.pathname);if(u.pathname==='/legacy'||oldApi){const who=await identity(request,env);must(who&&(who.via==='password'||who.email===env.OWNER_EMAIL),'این استودیو فقط برای مدیر پروژه است',403);return legacy.fetch(request,env);}
  if(u.pathname==='/api/telegram/webhook')return await webhook(request,env);
  if(u.pathname.startsWith('/api/bale/webhook/'))return await baleWebhook(request,env,decodeURIComponent(u.pathname.slice(18)));
  if(u.pathname.startsWith('/api/'))return await api(request,env);
  if(u.pathname==='/favicon.svg')return new Response(favicon,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=86400'}});
  if(u.pathname.startsWith('/fonts/')){const f=fontResponse(u.pathname.slice(7));if(f)return f;}
  const sub=subdomainOf(u,env);
  if(sub){
   if(/^\/(?:admin|panel)\/?$/.test(u.pathname))return new Response(panelHTML.replace('</head>','<meta name="ayneh-user" content="'+attr(sub)+'"></head>'),{headers:{...htmlHeaders,'X-Robots-Tag':'noindex'}});
   if(u.pathname==='/'||u.pathname===''){const html=await salonPage(u,env,sub);return html?new Response(html,{headers:{...htmlHeaders,'X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':htmlHeaders['Content-Security-Policy'].replace("frame-ancestors 'none'","frame-ancestors 'self'")}}):new Response(notFound,{status:404,headers:htmlHeaders});}
  }
  // /pay is the checkout's own address (shared links and the QR on a receipt); the landing
  // page carries the same sheet inline, so both land on the same server-side order.
  if(/^\/panel\/?$/.test(u.pathname))return new Response(panelHTML,{headers:{...htmlHeaders,'X-Robots-Tag':'noindex'}});
  if(/^\/pay\/?$/.test(u.pathname))return new Response(servicePages.hair.replaceAll('__ORIGIN__',env.APP_ORIGIN||u.origin).replaceAll('__CANON__','/hair'),{headers:{...htmlHeaders,'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
  if(u.pathname==='/salon-preview')return new Response(customerHTML,{headers:{...htmlHeaders,'X-Frame-Options':'SAMEORIGIN','X-Robots-Tag':'noindex','Content-Security-Policy':htmlHeaders['Content-Security-Policy'].replace("frame-ancestors 'none'","frame-ancestors 'self'")}});
  /* The landing page is the one thing the owner keeps reloading while we work on it, and a
     five-minute max-age with an hour of stale-while-revalidate meant a phone could show a
     build from an hour ago while the server was already serving the new one. The page is not
     an asset: let the browser revalidate it every time, cheaply (304 via ETag below). */
  /* ?ref=CODE on a public page keeps the referral in a first-party cookie (worker/rewards.js). */
  // Search engines: the public pages only; panels, the owner console, the API and salon pages stay out.
  if(u.pathname==='/robots.txt')return new Response('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /panel\nDisallow: /pay\nDisallow: /new\nDisallow: /s/\n\nSitemap: '+(env.APP_ORIGIN||u.origin)+'/sitemap.xml\n',{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public,max-age=3600'}});
  if(u.pathname==='/sitemap.xml'){const o=env.APP_ORIGIN||u.origin;return new Response('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+['/','/hair','/color','/nails','/lashes','/salon-panel','/sample','/try'].map(p=>'<url><loc>'+o+p+'</loc></url>').join('\n')+'\n</urlset>\n',{headers:{'Content-Type':'application/xml; charset=utf-8','Cache-Control':'public,max-age=3600'}})}
  if(u.pathname==='/')return new Response(landingHTML.replaceAll('__ORIGIN__',env.APP_ORIGIN||u.origin).replaceAll('__CANON__','/'),{headers:{...htmlHeaders,'Cache-Control':'no-cache',...refCookie(u,request)}});
  /* One page per service: /hair (style and colour), /nails, /lashes. Same headers as the home page. */
  const svc=u.pathname.match(/^\/(hair|color|nails|lashes|salon-panel|sample)\/?$/);
  if(svc)return new Response(servicePages[svc[1]==='salon-panel'?'salon':svc[1]].replaceAll('__ORIGIN__',env.APP_ORIGIN||u.origin).replaceAll('__CANON__','/'+svc[1]),{headers:{...htmlHeaders,'Cache-Control':'no-cache',...refCookie(u,request)}});
  /* The regular customer's page: no salon link, 3 free images, then her own packs. */
  if(/^\/try\/?$/.test(u.pathname)){must(env.DB,'پایگاه داده هنوز آماده نیست',503);const d=await directSalon(env.DB);return new Response(tryHTML(d.slug),{headers:{...htmlHeaders,...refCookie(u,request)}});}
  /* Hit when a preview is holding an old copy and no amount of reloading helps: a URL that
     has never existed cannot be cached, so /new serves the current build under a fresh path.
     It carries no robots policy change — it is the same page, just honest about being new. */
  if(u.pathname==='/new')return new Response(landingHTML.replaceAll('__ORIGIN__',env.APP_ORIGIN||u.origin).replaceAll('__CANON__','/'),{headers:{...htmlHeaders,'Cache-Control':'no-store','X-Robots-Tag':'noindex'}});
  /* The owner's Android payment app (android/): the APK is a static file built by deploy.yml
     (public/app/ayneh-pay.apk, served before the worker); this is its download page. */
  if(/^\/app\/?$/.test(u.pathname)){let ver='';try{const r=env.ASSETS?await env.ASSETS.fetch(new Request(u.origin+'/app/version.txt')):null;if(r&&r.ok)ver=(await r.text()).trim().slice(0,20)}catch{}return new Response(appPage(!!ver,ver),{headers:{...htmlHeaders,'X-Robots-Tag':'noindex'}});}
  if(!pages.some(r=>r.test(u.pathname)))return new Response(notFound,{status:404,headers:htmlHeaders});
  if(/^\/i\/[a-z0-9-]{1,64}\/?$/.test(u.pathname)){const html=await sharePage(u,env);return new Response(html||notFound,{status:html?200:404,headers:htmlHeaders});}
  if(/^\/s\/[a-z0-9-]{1,64}\/?$/.test(u.pathname)){const html=await salonPage(u,env);return html?new Response(html,{headers:{...htmlHeaders,'X-Frame-Options':'SAMEORIGIN','Content-Security-Policy':htmlHeaders['Content-Security-Policy'].replace("frame-ancestors 'none'","frame-ancestors 'self'")}}):new Response(notFound,{status:404,headers:htmlHeaders});}
  return new Response(appHTML,{headers:htmlHeaders});
 }catch(e){return errorResponse(e)}},
 async scheduled(event,env,ctx){ctx.waitUntil(tick(env,env.APP_ORIGIN||''))}
};
