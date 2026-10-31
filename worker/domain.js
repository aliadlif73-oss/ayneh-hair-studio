export class Problem extends Error {constructor(status,message){super(message);this.status=status;}}
export function must(test,message='درخواست معتبر نیست',status=400){if(!test)throw new Problem(status,message);}
export const digits=s=>String(s??'').replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g,x=>'٠١٢٣٤٥٦٧٨٩'.indexOf(x));
export function phone(s){let n=digits(s).replace(/[\s()-]/g,'').replace(/^0098/,'+98');if(/^09\d{9}$/.test(n))n='+98'+n.slice(1);if(/^9\d{9}$/.test(n))n='+98'+n;must(/^\+989\d{9}$/.test(n),'شماره موبایل ایران معتبر نیست');return n;}
export function text(s,max=500){must(typeof s==='string'&&s.length<=max,'متن بیش از حد مجاز است');return s.trim();}
export function safeLink(s){if(!s)return '';try{const u=new URL(s);must(['https:','http:'].includes(u.protocol),'لینک معتبر نیست');return u.href;}catch{throw new Problem(400,'لینک معتبر نیست');}}
export function appointment(a,actor,action,b,now=Date.now()){
 must(['customer','salon'].includes(actor));must(Number.isInteger(b.version)&&b.version===a.version,'این پیشنهاد قدیمی است؛ آخرین وضعیت را باز کنید',409);
 if(action==='cancel'&&a.status==='cancelled')return null;
 if(action==='accept'&&a.status==='confirmed')return null;
 must(!['cancelled','rejected','done'].includes(a.status),'این نوبت بسته شده است',409);
 let next={...a,version:a.version+1,last_actor:actor,updated_at:now,note:text(b.note||'',500)};
 if(action==='cancel'){next.status='cancelled';return next;}
 if(action==='reject'){must(actor==='salon');next.status='rejected';return next;}
 if(action==='done'){must(actor==='salon'&&a.status==='confirmed','فقط نوبت قطعی قابل انجام‌شدن است');must(a.end_at<=now,'هنوز زمان انجام خدمت نرسیده است');next.status='done';return next;}
 if(action==='propose'){
  must(a.status!=='confirmed','برای تغییر نوبت قطعی، ابتدا آن را لغو کنید',409);
  must(Number.isInteger(b.start_at)&&b.start_at>now&&b.start_at<now+366*86400000,'زمان آینده معتبر انتخاب کنید');
  next.start_at=b.start_at;next.end_at=b.start_at+a.duration*60000;next.status=actor==='salon'?'awaiting_customer':'awaiting_salon';return next;
 }
 if(action==='accept'){
  must((actor==='salon'&&a.status==='awaiting_salon')||(actor==='customer'&&a.status==='awaiting_customer'),'اکنون نوبت پاسخ طرف مقابل است',409);
  must(a.start_at>now,'زمان پیشنهاد گذشته است');next.status='confirmed';return next;
 }
 throw new Problem(400,'اقدام شناخته نشد');
}
export function transferPrompt(mode,style,color){
 const common='Photo 1 is the ONLY identity source: keep her EXACT face, age, skin tone, expression, body, outfit and background. Edit hair only. Do not beautify, retouch or swap faces. If a second photo exists it is a HAIR reference, NEVER an identity reference. No text or watermark. Photorealistic proposed simulation. ';
 if(mode==='style')return common+'Transfer ONLY haircut, length, texture and styling from photo 2 onto photo 1. Preserve original hair color of photo 1.';
 if(mode==='color')return common+'Transfer ONLY hair color, roots, highlights and color placement from photo 2. Preserve exact haircut, length, part and style of photo 1.';
 if(mode==='both')return common+'Transfer hairstyle AND hair color from photo 2 onto photo 1, never its face.';
 return common+'Requested hairstyle: '+style+'. Hair color: '+(color||'preserve photo 1 hair color');
}
export const uid=()=>crypto.randomUUID();
export const token=()=>{let a=crypto.getRandomValues(new Uint8Array(32));return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');};
export const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export const formatTime=ms=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(ms);
