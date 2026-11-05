// Deployed only by build-editions.mjs, never the original Worker's entrypoint.
import original from './index.js';
import {edition,editionEnv,editionAPI,scopeRequest,editionHTML,setupHTML,integrationsHTML,editionLanding,specialistText} from './edition.js';
import {identity} from './auth.js';
import {errorResponse,tick} from './server.js';
import {LINE,ASSETS} from './edition-assets.js';
const headers={'Content-Type':'text/html;charset=utf-8','Cache-Control':'no-store','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:; media-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",'Permissions-Policy':'camera=(self), microphone=()'};
const html=value=>new Response(value,{headers});
export default {
 async fetch(request,bindings,ctx){try{
  const env=await editionEnv({...bindings,SERVICE_LINE:LINE}),u=new URL(request.url),e=edition(env);
  if(u.pathname.startsWith('/catalog/')){const b=ASSETS[u.pathname];if(!b)return new Response('Not found',{status:404});return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(b),c=>c.charCodeAt(0)),{headers:{'Content-Type':'image/webp','Cache-Control':'public,max-age=86400','X-Content-Type-Options':'nosniff'}});}
  request=await scopeRequest(request,env);
  if(u.pathname==='/admin/setup')return html(setupHTML(env));
  if(u.pathname==='/admin/integrations'){
   const who=await identity(request,env);if(who?.via!=='password')return new Response(null,{status:303,headers:{Location:'/admin'}});
   return html(integrationsHTML(env));
  }
  const config=await editionAPI(request,env);if(config)return config;
  if(u.pathname==='/')return html(editionLanding(env));
  const response=await original.fetch(request,env,ctx);
  if(response.headers.get('content-type')?.includes('text/html')){
   let value=editionHTML(await response.text(),env);
   value=value.replace('مو، ناخن و مژهٔ بعدی‌ات',e.label+' دلخواهت').replace('مدل مو، طرح ناخن یا مژه',e.label);
   const h=new Headers(response.headers);h.delete('content-length');return new Response(value,{status:response.status,headers:h});
  }
  if(response.headers.get('content-type')?.includes('application/json')){
   const d=await response.json();
   if(d.error)d.error=specialistText(d.error);
   if(/\/public$/.test(u.pathname)){d.edition=e;if(d.portfolio)d.portfolio=d.portfolio.filter(p=>(p.line||'hair')===LINE);}
   return Response.json(d,{status:response.status,headers:response.headers});
  }
  return response;
 }catch(e){return errorResponse(e)}},
 async scheduled(event,bindings,ctx){ctx.waitUntil((async()=>{const env=await editionEnv({...bindings,SERVICE_LINE:LINE});return tick(env,env.APP_ORIGIN||'')})())}
};
