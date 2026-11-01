export class Problem extends Error {constructor(status,message){super(message);this.status=status;}}
export function must(test,message='درخواست معتبر نیست',status=400){if(!test)throw new Problem(status,message);}
export const digits=s=>String(s??'').replace(/[۰-۹]/g,x=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g,x=>'٠١٢٣٤٥٦٧٨٩'.indexOf(x));
export function phone(s){let n=digits(s).replace(/[\s()-]/g,'').replace(/^0098/,'+98');if(/^09\d{9}$/.test(n))n='+98'+n.slice(1);if(/^9\d{9}$/.test(n))n='+98'+n;must(/^\+989\d{9}$/.test(n),'شماره موبایل ایران معتبر نیست');return n;}
export function text(s,max=500){must(typeof s==='string'&&s.length<=max,'متن بیش از حد مجاز است');return s.trim();}
export function safeLink(s){if(!s)return '';try{const u=new URL(s);must(['https:','http:'].includes(u.protocol),'لینک معتبر نیست');return u.href;}catch{throw new Problem(400,'لینک معتبر نیست');}}
// What each ready-made style actually looks like, so the image model is not guessing from a
// two-word name. Keys are the English names in legacy.js `styles`.
export const STYLE_DETAILS={
 'Short bob':'a short chin-length bob, blunt even ends at jaw level, sleek and smooth, slight inward bend at the ends',
 'Long bob':'a lob: collarbone-length bob, ends just above the shoulders, soft subtle layers, gentle movement',
 'Pixie cut':'a pixie cut: very short on the back and sides, slightly longer textured top, soft side-swept fringe',
 'Long layers':'long hair well past the shoulders with long cascading layers, face-framing pieces starting at the cheekbones, bouncy blow-dried finish',
 'Curtain bangs':'curtain bangs parted in the middle, sweeping to both sides and framing the face at cheekbone level, with medium-long hair',
 'Wolf cut':'a wolf cut: shaggy, choppy layers concentrated at the crown, wispy face-framing pieces, mullet-like shape, tousled texture, shoulder length',
 'Beach waves':'long loose beachy waves, effortless tousled S-shaped waves from mid-length to ends, soft volume',
 'Long straight hair':'long sleek straight hair, glossy and smooth, one length, falling well below the shoulders',
 'Natural curly hair':'natural defined curls, voluminous rounded shape, springy ringlets, shoulder length to below',
 'Low bun updo':'an elegant low bun at the nape, smooth sides, a few soft face-framing tendrils',
 'Bixie cut':'a bixie: hybrid of bob and pixie, ear-to-chin length, piecey layers and volume at the crown, textured ends',
 'Asymmetric bob':'an asymmetric bob, noticeably longer on one side than the other, sharp clean lines, angled front',
 'French bob':'a French bob: jaw-length bob with short blunt bangs at the brows, slightly undone soft texture',
 'Butterfly haircut':'a butterfly haircut: long hair with short face-framing layers starting at the chin and long layers below, big bouncy blow-out volume',
 'Hush cut':'a hush cut: soft feathery layers throughout, wispy ends, airy light movement, shoulder length, with see-through bangs',
 'Long hair with blunt bangs':'long straight hair with thick blunt bangs cut straight across at eyebrow level',
 'High ponytail':'a sleek high ponytail at the crown, smooth pulled-back sides, long flowing tail',
 'Half up half down':'half-up half-down style: top section gathered at the back of the head, the rest loose with soft waves',
 'Side braid':'a loose side braid over one shoulder, slightly pancaked for volume, a few soft strands framing the face',
 'Hollywood waves':'glamorous Hollywood waves: deep side part, smooth polished uniform waves, high shine, shoulder length or longer'
};
// Persian colour names from the colour box, described precisely for the model.
export const COLOR_EN={
 'مشکی':'natural jet black','مشکی کلاغی':'blue-black raven','مشکی آبی':'blue-black with a cool blue sheen',
 'قهوه‌ای تیره':'dark brown','قهوه‌ای متوسط':'medium brown','قهوه‌ای روشن':'light brown',
 'شکلاتی':'rich chocolate brown','شکلاتی تلخ':'deep dark-chocolate brown','شکلاتی گرم':'warm chocolate brown',
 'موکا':'mocha brown','نسکافه‌ای':'warm coffee-with-milk brown','فندقی':'hazelnut brown','قهوه‌ای دودی':'smoky ash brown','قهوه‌ای سرد':'cool ash brown',
 'کاراملی':'caramel','عسلی':'honey brown','عسلی طلایی':'golden honey','بلوند عسلی':'honey blonde','بلوند کاراملی':'caramel blonde',
 'بلوند طلایی':'golden blonde','بلوند شامپاینی':'champagne blonde','بلوند بژ':'beige blonde','بلوند روشن':'light blonde','بلوند خیلی روشن':'very light blonde',
 'بلوند تیره':'dark blonde','بلوند دودی':'smoky ash blonde','بلوند خاکستری':'ash blonde','بلوند نقره‌ای':'silver blonde','بلوند یخی':'icy blonde',
 'پلاتینه':'platinum blonde','بلوند توت‌فرنگی':'strawberry blonde','بلوند رزگلد':'rose-gold blonde',
 'مسی':'copper','مسی روشن':'light copper','قرمز مسی':'copper red','حنایی':'henna red-orange','دارچینی':'cinnamon auburn','ماهاگونی':'mahogany',
 'قرمز آتشین':'vivid fire red','شرابی':'burgundy wine red','آلبالویی':'black-cherry red','زرشکی':'deep crimson','یاقوتی':'ruby red','بادمجانی':'aubergine plum',
 'بنفش':'purple','یاسی':'pastel lilac','رزگلد':'rose gold','صورتی پاستلی':'pastel pink','آبی دودی':'smoky blue','آبی نفتی':'deep petrol blue',
 'نقره‌ای':'silver','خاکستری':'grey','سفید یخی':'icy white',
 'بالیاژ عسلی':'hand-painted honey balayage on a darker brown base, soft blended root','بالیاژ کاراملی':'caramel balayage on a brown base, soft root',
 'بالیاژ شامپاینی':'champagne-blonde balayage on a brown base, soft root','بالیاژ سرد':'cool ash balayage on a dark base, soft root','بالیاژ مسی':'copper balayage on a brown base',
 'آمبره قهوه‌ای به بلوند':'ombre from brown roots to blonde ends','آمبره شرابی':'ombre from dark roots to burgundy ends','آمبره دودی':'ombre from dark roots to smoky ash ends',
 'سامبره':'subtle sombre, gentle brown-to-honey fade','هایلایت طلایی':'fine golden highlights through brown hair','هایلایت نقره‌ای':'fine silver highlights',
 'لایت عسلی':'honey babylights','لایت دودی':'smoky ash babylights','بیبی لایت':'very fine natural babylights'
};
const norm=s=>String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]/g,'');
export function colorText(color){
 if(!color)return '';
 const exact=Object.keys(COLOR_EN).find(k=>norm(k)===norm(color));
 return exact?COLOR_EN[exact]+' (requested in Persian as "'+color+'")':'"'+color+'" (a Persian hair-color name; render it as a salon colorist would interpret it)';
}
export function transferPrompt(mode,style,color){
 const lock='Professional hair-salon consultation preview. Photo 1 is the client. Edit ONLY her hair.\n'+
  'IDENTITY LOCK: keep her exact face and facial features, skin tone and texture, makeup, age, expression, head angle, ears, neck, clothing, jewelry, background, framing and lighting unchanged. It must be clearly the same person in the same photo. Do not beautify, retouch, slim or swap the face.\n'+
  'If she wears a headscarf or hat, keep it exactly as it is and change only the hair that is visible.\n';
 const realism='\nREALISM: real hair density and individual strand detail, a natural hairline and parting that fit her head shape and face, believable volume and fall under gravity, light and shadow matching the original photo\'s light direction and color temperature, soft natural shadows where hair meets skin and clothing. Seamless edges, no halo, no wig look, no painted or plastic texture.\n'+
  'OUTPUT: one photorealistic photo with the same composition and aspect ratio as Photo 1, high detail. No text, watermark, border, collage or before/after split.';
 const ref='Photo 2 is ONLY a hair reference: ignore its face, skin, body, clothing and background completely.\n';
 const tint=color?'\nHAIR COLOR: '+colorText(color)+'. This overrides any hair color in photo 2.':'';
 if(mode==='style')return lock+ref+'HAIR: copy ONLY the haircut, length, layers, texture and styling from photo 2.'+(color?tint:' Keep her original hair color from photo 1.')+realism;
 if(mode==='color')return lock+ref+'HAIR: copy ONLY the hair color, tones, roots, highlights and color placement from photo 2. Keep her exact haircut, length, part and styling from photo 1.'+tint+realism;
 if(mode==='both')return lock+ref+'HAIR: transfer the hairstyle AND hair color from photo 2, adapted naturally to her head and face. Never take the face from photo 2.'+tint+realism;
 const detail=STYLE_DETAILS[style]||style;
 return lock+'HAIR: give her '+detail+' ('+style+').'+(color?'\nHAIR COLOR: '+colorText(color)+'.':'\nHAIR COLOR: keep her original hair color from photo 1.')+realism;
}
export const uid=()=>crypto.randomUUID();
export const token=()=>{let a=crypto.getRandomValues(new Uint8Array(32));return Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');};
export const hash=async s=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),x=>x.toString(16).padStart(2,'0')).join('');
export const formatTime=ms=>new Intl.DateTimeFormat('fa-IR',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(ms);
