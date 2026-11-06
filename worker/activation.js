import {digits,must,safeLink,text} from './domain.js';
import {imageType} from './storage.js';
import {LINE_KEYS} from './lines.js';

const idPattern=/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/;
const profileText={bio:1000,manager:100,address:250,hours:150};
const profileLinks=['instagram','website','map','telegram'];
const brandSlots=['logo','cover','portrait'];

export async function saveActivation(req,db,session){
 must(session.verified_phone,'ابتدا شمارهٔ موبایل را تأیید کنید.',403);
 const buffer=await req.arrayBuffer();
 must(buffer.byteLength<=4_000_000,'حجم تصاویر بیش از حد مجاز است.',413);
 const form=await new Response(buffer,{headers:{'Content-Type':req.headers.get('Content-Type')||''}}).formData().catch(()=>null);
 must(form,'فرم درخواست معتبر نیست.');
 const id=form.get('id');
 must(typeof id==='string'&&idPattern.test(id),'شناسهٔ درخواست معتبر نیست.');
 const existing=await db.prepare('SELECT contact_phone FROM salon_activations WHERE id=?').bind(id).first();
 if(existing){must(existing.contact_phone===session.verified_phone,'شناسهٔ درخواست معتبر نیست.',409);return {ok:true,id}}
 let input;
 try{input=JSON.parse(form.get('draft'));}catch{}
 must(input&&typeof input==='object'&&input.profile,'مشخصات سالن را وارد کنید.');
 const slug=String(input.slug||'');
 must(/^[a-z][a-z0-9-]{1,44}[a-z0-9]$/.test(slug),'نشانی انگلیسی صفحه معتبر نیست.');
 must(!await db.prepare('SELECT 1 FROM salons WHERE slug=?').bind(slug).first(),'این نشانی قبلاً گرفته شده است. نشانی دیگری انتخاب کنید.',409);
 const name=text(String(input.name||''),100);
 must(name.length>=2,'نام سالن را وارد کنید.');
 must(/^#[0-9a-f]{6}$/i.test(input.brand||''),'رنگ برند معتبر نیست.');
 const profile={};
 for(const [key,max] of Object.entries(profileText))profile[key]=text(String(input.profile[key]||''),max);
 for(const key of profileLinks)profile[key]=safeLink(String(input.profile[key]||''));
 profile.phone=digits(String(input.profile.phone||'')).replace(/[\s()-]/g,'');
 must(!profile.phone||/^\+?\d{5,15}$/.test(profile.phone),'شمارهٔ تماس سالن معتبر نیست.');
 must(Array.isArray(input.portfolio)&&input.portfolio.length<=6,'حداکثر ۶ نمونه‌کار بفرستید.');
 const portfolio=input.portfolio.map((item,i)=>{
  must(item&&LINE_KEYS.includes(item.line),'خدمت نمونه‌کار معتبر نیست.');
  const title=text(String(item.title||''),100);
  must(title.length>=2,'برای هر نمونه‌کار یک عنوان بنویسید.');
  return {title,line:item.line,description:text(String(item.description||''),300),slot:'work-'+i};
 });
 const assets=[];
 for(const slot of [...brandSlots,...portfolio.map(item=>item.slot)]){
  const file=form.get(slot);
  if(!file){must(brandSlots.includes(slot),'تصویر نمونه‌کار را اضافه کنید.');continue}
  must(typeof file==='object'&&file.size>=100&&file.size<=400_000,'حجم هر عکس باید کمتر از ۴۰۰ کیلوبایت باشد.');
  const bytes=new Uint8Array(await file.arrayBuffer()),mime=imageType(bytes);
  if(brandSlots.includes(slot))profile[slot]=slot;
  assets.push(db.prepare('INSERT INTO salon_activation_assets VALUES(?,?,?,?)').bind(id,slot,mime,bytes));
 }
 try{
  await db.batch([db.prepare('INSERT INTO salon_activations VALUES(?,?,?,?,?)').bind(id,session.verified_name,session.verified_phone,JSON.stringify({name,slug,brand:input.brand,profile,portfolio}),Date.now()),...assets]);
 }catch(error){
  const duplicate=await db.prepare('SELECT contact_phone FROM salon_activations WHERE id=?').bind(id).first();
  if(duplicate?.contact_phone!==session.verified_phone)throw error;
 }
 return {ok:true,id};
}

export async function activationAsset(db,id,slot){
 const item=await db.prepare('SELECT mime,bytes FROM salon_activation_assets WHERE activation_id=? AND slot=?').bind(id,slot).first();
 must(item,'عکس پیدا نشد.',404);
 return new Response(item.bytes,{headers:{'Content-Type':item.mime,'Cache-Control':'private,no-store','X-Content-Type-Options':'nosniff'}});
}
