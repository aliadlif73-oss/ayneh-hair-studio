import legacy from './legacy.js';
import {appHTML} from './ui.js';
import {api,errorResponse,tick} from './server.js';
import {must} from './domain.js';
const htmlHeaders={'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"};
export default {
 async fetch(request,env){try{const u=new URL(request.url);if(u.pathname==='/api/internal/tick'){must(env.JOB_TOKEN&&request.headers.get('Authorization')==='Bearer '+env.JOB_TOKEN,'دسترسی مجاز نیست',403);must(request.method==='POST','متد مجاز نیست',405);return Response.json(await tick(env,u.origin));}
 const oldApi=['/api/config','/api/create','/api/status','/api/views'].includes(u.pathname);if(u.pathname==='/legacy'||oldApi){must(request.headers.get('oai-authenticated-user-id')&&request.headers.get('oai-authenticated-user-email')===env.OWNER_EMAIL,'این استودیو فقط برای مدیر پروژه است',403);return legacy.fetch(request,env);}
 if(u.pathname.startsWith('/api/'))return await api(request,env);
 return new Response(appHTML,{headers:htmlHeaders});
 }catch(e){return errorResponse(e)}},
 async scheduled(event,env,ctx){if(env.APP_ORIGIN)ctx.waitUntil(tick(env,env.APP_ORIGIN));}
};
