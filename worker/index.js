import legacy from './legacy.js';
import {appHTML} from './ui.js';
import {customerHTML} from './customer.js';
import {api,errorResponse,tick} from './server.js';
import {must} from './domain.js';
import {identity} from './auth.js';
import {fontResponse} from './fonts.js';
import {favicon,baseCSS} from './design.js';
const htmlHeaders={'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; media-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",'Permissions-Policy':'camera=(self), geolocation=(), microphone=()'};
// Only real pages are served the app shell; everything else is a 404, never a blank app page.
const pages=[/^\/$/,/^\/admin\/?$/,/^\/admin\/[a-z0-9-]{1,64}\/?$/,/^\/s\/[a-z0-9-]{1,64}\/?$/,/^\/s\/[a-z0-9-]{1,64}\/access\/?$/,/^\/signin-with-chatgpt(\/.*)?$/];
const notFound='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#e8edeb"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><title>صفحه پیدا نشد | آینه</title><style>'+baseCSS+'.nf{min-height:100vh;display:grid;place-items:center;padding:32px 20px;text-align:center}.nf main{display:grid;justify-items:center;gap:18px;max-width:420px}.nf .mirror{width:150px}.nf .mirror__glass{aspect-ratio:3/4}.nf h1{font-family:var(--display);font-size:32px}.nf p{color:var(--muted);line-height:2}</style></head><body class="nf"><main><div class="mirror"><div class="mirror__glass"></div></div><h1>این صفحه پیدا نشد</h1><p>نشانی اشتباه است یا صفحهٔ سالن برداشته شده. لینک اختصاصی سالن را دوباره باز کنید.</p><div class="row" style="justify-content:center"><a class="btn btn--primary" href="/">صفحهٔ اصلی آینه</a><a class="btn btn--ghost" href="/admin">پنل سالن</a></div></main></body></html>';
export default {
 async fetch(request,env){try{const u=new URL(request.url);
  if(u.pathname==='/api/internal/tick'){must(request.method==='POST','متد مجاز نیست',405);must(env.JOB_TOKEN&&request.headers.get('Authorization')==='Bearer '+env.JOB_TOKEN,'دسترسی مجاز نیست',403);return Response.json(await tick(env,u.origin));}
  const oldApi=['/api/config','/api/create','/api/status','/api/views'].includes(u.pathname);if(u.pathname==='/legacy'||oldApi){const who=await identity(request,env);must(who&&(who.via==='password'||who.email===env.OWNER_EMAIL),'این استودیو فقط برای مدیر پروژه است',403);return legacy.fetch(request,env);}
  if(u.pathname.startsWith('/api/'))return await api(request,env);
  if(u.pathname==='/favicon.ico')return new Response(null,{status:204,headers:{'Cache-Control':'public,max-age=86400'}});
  if(u.pathname==='/favicon.svg')return new Response(favicon,{headers:{'Content-Type':'image/svg+xml','Cache-Control':'public,max-age=86400'}});
  if(u.pathname.startsWith('/fonts/')){const f=fontResponse(u.pathname.slice(7));if(f)return f;}
  if(!pages.some(r=>r.test(u.pathname)))return new Response(notFound,{status:404,headers:htmlHeaders});
  if(/^\/s\/[a-z0-9-]{1,64}(\/access)?\/?$/.test(u.pathname))return new Response(customerHTML,{headers:htmlHeaders});
  return new Response(appHTML,{headers:htmlHeaders});
 }catch(e){return errorResponse(e)}},
 async scheduled(event,env,ctx){if(env.APP_ORIGIN)ctx.waitUntil(tick(env,env.APP_ORIGIN))}
};
