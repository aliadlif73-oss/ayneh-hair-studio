// Independent marketing site: only /api/inquiry is proxied to the Ayneh application.
// Existing application data, routes, and auth remain on the original Worker.
const APP='https://ayneh-salon.site';
const security={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','X-Frame-Options':'DENY'};
export default {async fetch(request,env){const url=new URL(request.url);
if(url.pathname==='/api/inquiry'){
 if(request.method!=='POST')return Response.json({error:'متد نامعتبر است'},{status:405,headers:security});
 if(request.headers.get('Origin')!==url.origin)return Response.json({error:'مبدأ درخواست مجاز نیست'},{status:403,headers:security});
 if(Number(request.headers.get('content-length')||0)>8192)return Response.json({error:'درخواست بیش از حد بزرگ است'},{status:413,headers:security});
 const body=await request.text();if(body.length>8192)return Response.json({error:'درخواست بیش از حد بزرگ است'},{status:413,headers:security});
 let data;try{data=JSON.parse(body)}catch{return Response.json({error:'فرم معتبر نیست'},{status:400,headers:security})}
 if(!data.consent||!data.name||!data.salon||!data.phone)return Response.json({error:'فیلدهای ضروری را کامل کنید'},{status:400,headers:security});
 try{const remote=await fetch(APP+'/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json','Origin':APP},body:JSON.stringify(data)});return new Response(remote.body,{status:remote.status,headers:{...security,'Content-Type':'application/json;charset=utf-8','Cache-Control':'no-store'}})}catch{return Response.json({error:'اتصال به سامانه درخواست‌ها برقرار نشد'},{status:502,headers:security})}
}
if(env.ASSETS)return env.ASSETS.fetch(request);
return new Response('Not found',{status:404,headers:security});
}};