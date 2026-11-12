// Read-only public preview of the independent marketing branch.
// Production Worker and customer data are untouched. Static files are fetched from GitHub.
const RAW='https://raw.githubusercontent.com/aliadlif73-oss/ayneh-hair-studio/design/independent-marketing-site-teal/marketing-site';
const APP='https://ayneh-salon.site';
const safe={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'};
export default {async fetch(request){
 const u=new URL(request.url);
 if(u.pathname==='/api/inquiry'){
  if(request.method!=='POST')return Response.json({error:'متد نامعتبر است'},{status:405,headers:safe});
  if(Number(request.headers.get('content-length')||0)>8192)return Response.json({error:'درخواست طولانی است'},{status:413,headers:safe});
  const body=await request.text();
  if(body.length>8192)return Response.json({error:'درخواست طولانی است'},{status:413,headers:safe});
  let data;try{data=JSON.parse(body)}catch{return Response.json({error:'فرم نامعتبر است'},{status:400,headers:safe})}
  if(typeof data!=='object'||!data||!data.consent||!data.name||!data.salon||!data.phone)return Response.json({error:'فیلدهای ضروری را تکمیل کنید'},{status:400,headers:safe});
  try{const remote=await fetch(APP+'/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body});return new Response(remote.body,{status:remote.status,headers:{...safe,'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}})}
  catch{return Response.json({error:'سامانه ثبت درخواست در دسترس نیست'},{status:502,headers:safe})}
 }
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method Not Allowed',{status:405,headers:safe});
 const path=u.pathname==='/'||u.pathname==='/index.html'?'/index.html':u.pathname;
 if(path!=='/index.html'&&!/^\/assets\/[A-Za-z0-9_.-]+$/.test(path))return new Response('Not Found',{status:404,headers:safe});
 try{const upstream=await fetch(RAW+path,{cf:{cacheEverything:true,cacheTtl:path==='/index.html'?45:86400}});
 if(!upstream.ok)return new Response('Asset Not Found',{status:404,headers:safe});
 // GitHub raw adds a restrictive CSP/sandbox and disposition. Do not forward upstream headers.
 const ext=path.split('.').pop().toLowerCase();
 const mime=path==='/index.html'?'text/html;charset=utf-8':({webp:'image/webp',jpg:'image/jpeg',png:'image/png',woff2:'font/woff2'})[ext]||'application/octet-stream';
 const headers=new Headers({...safe,'Content-Type':mime,'Cache-Control':path==='/index.html'?'public,max-age=45':'public,max-age=86400'});
 if(path==='/index.html')headers.set('X-Robots-Tag','noindex,nofollow');
 return new Response(request.method==='HEAD'?null:upstream.body,{status:200,headers});
 }catch{return new Response('Preview source temporarily unavailable',{status:502,headers:safe})}
}};