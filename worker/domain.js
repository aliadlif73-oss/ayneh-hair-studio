export class Problem extends Error {constructor(status,message){super(message);this.status=status;}}
export function must(test,message='درخواست معتبر نیست',status=400){if(!test)throw new Problem(status,message);}
export const digits=s=>String(s??'').replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g,x=>'٠١٢٣٤٥٦٧٨٩'.indexOf(x));
export function phone(s){let n=digits(s).replace(/[\s()-]/g,'').replace(/^0098/,'+98');if(/^09\d{9}$/.test(n))n='+98'+n.slice(1);if(/^9\d{9}$/.test(n))n='+98'+n;must(/^\+989\d{9}$/.test(n),'شماره موبایل ایران معتبر نیست');return n;}
export function text(s,max=500){must(typeof s==='string'&&s.length<=max,'متن بیش از حد مجاز است');return s.trim();}
export function safeLink(s){if(!s)return '';try{const u=new URL(s);must(['https:','http:'].includes(u.protocol),'لینک معتبر نیست');return u.href;}catch{throw new Problem(400,'لینک معتبر نیست');}}
export function transferPrompt(mode,style,color){
 const common='Photo 1 is the ONLY identity source: keep her EXACT face, age, skin tone, expression, body, outfit and background. Edit hair only. Do not beautify, retouch or swap faces. If a second photo exists it is a HAIR reference, NEVER an identity reference. No text or watermark. Photorealistic proposed simulation. ';
 // A typed colour always wins over the colour in a reference photo.
 const tint=color?' Hair color must be: '+color+' (this overrides any color in photo 2).':'';
 if(mode==='style')return common+'Transfer ONLY haircut, length, texture and styling from photo 2 onto photo 1.'+(color?tint:' Preserve original hair color of photo 1.');
 if(mode==='color')return common+'Transfer ONLY hair color, roots, highlights and color placement from photo 2. Preserve exact haircut, length, part and style of photo 1.'+tint;
 if(mode==='both')return common+'Transfer hairstyle AND hair color from photo 2 onto photo 1, never its face.'+tint;
 return common+'Requested hairstyle: '+style+'. Hair color: '+(color||'preserve photo 1 hair color');
}
export const uid=()=>crypto.randomUUID();
export const token=()=>{let a=crypto.getRandomValues(new Uint8Array(32));return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');};
export const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export const formatTime=ms=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(ms);
