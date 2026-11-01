// Service lines beyond hair: nails (ناخن) and lashes (مژه). Each line has a catalog of looks
// (names Iranian salons use), extra options (nail shape and length, lash mapping and length), a
// colour list, photo guidance, and its own image prompt. Hair keeps its catalog in legacy.js and
// its prompt in domain.js (transferPrompt).
// Catalog entries: [Persian name, English name, filter tag, English description for the model].
// Option and colour entries: [Persian name, English for the model] (+ swatch for colours).

export const LINE_KEYS=['hair','nails','lashes'];
export const LINE_LABEL={hair:'مو',nails:'ناخن',lashes:'مژه'};

export const NAIL_STYLES=[
 ['ژلیش ساده یکدست','Solid gel polish','ساده','a flawless glossy one-colour gel polish manicure with even coverage and clean cuticles'],
 ['فرنچ کلاسیک','Classic French','فرنچ','a classic French manicure: sheer natural pink base with crisp white tips following the smile line'],
 ['میکرو فرنچ','Micro French','فرنچ','a micro French manicure: a very thin delicate tip line on a sheer nude base'],
 ['فرنچ رنگی','Coloured French','فرنچ','a modern French manicure with coloured tips on a sheer nude base'],
 ['بیبی بومر','Baby boomer ombré','ساده','baby boomer ombré nails: a soft seamless fade from nude pink at the base to milky white at the tip'],
 ['نود روسی','Russian nude manicure','ساده','a clean Russian manicure with a natural nude-pink gel finish, very neat cuticles and a healthy natural look'],
 ['کروم آینه‌ای','Chrome mirror','براق','mirror chrome nails with a high-shine metallic reflective finish'],
 ['مرواریدی (گلیزد)','Glazed pearl','براق','glazed-donut pearl nails: a sheer milky base with a soft pearlescent shimmer'],
 ['کت‌آی (چشم گربه‌ای)','Magnetic cat eye','براق','magnetic cat-eye gel nails with a glowing shifting band of light across each nail'],
 ['ژله‌ای','Jelly nails','براق','translucent jelly nails: glossy see-through tinted colour like stained glass'],
 ['مات','Matte','ساده','matte nails with a velvety non-shiny surface'],
 ['اکلیلی','Glitter','نگین','sparkling fine-glitter nails with an even shimmer'],
 ['مرمری','Marble','طرح‌دار','marble nail art with soft natural veins on a light base'],
 ['مینیمال گل و خط','Minimal art','طرح‌دار','minimal nail art: tiny hand-painted flowers, dots and thin lines on a nude base, on a few accent nails'],
 ['هندسی و خطی','Geometric lines','طرح‌دار','geometric nail art with clean thin lines and small colour blocks'],
 ['نگین و سنگ','Rhinestones','نگین','elegant nails with small rhinestones and crystals placed near the cuticle on a few accent nails'],
 ['آئورا (هاله‌ای)','Aura nails','طرح‌دار','aura nails: a soft airbrushed glow of colour in the centre of each nail fading outwards'],
 ['ابری (اسموکی)','Smoky clouds','طرح‌دار','smoky nail art with soft cloudy swirls of colour']
];
export const LASH_STYLES=[
 ['کلاسیک (یک‌به‌یک)','Classic','طبیعی','classic eyelash extensions: one extension on each natural lash, a natural defined look like perfect mascara'],
 ['هیبریدی','Hybrid','طبیعی','hybrid eyelash extensions mixing classic lashes and light volume fans: a soft, textured, fuller look'],
 ['والیوم (روسی)','Volume','پرحجم','volume (Russian) eyelash extensions: soft fluffy fans and a full dense lash line'],
 ['مگاوالیوم','Mega volume','پرحجم','mega volume eyelash extensions: a very dense, dark, dramatic lash line'],
 ['وت لش (خیس)','Wet look','پرحجم','wet-look eyelash extensions: glossy, spiky closed fans that look like wet lashes'],
 ['کیم (ویسپی)','Wispy (Kim)','پرحجم','wispy "Kim K" eyelash extensions: longer textured spikes mixed through a fluffy base'],
 ['اسپایکی (انیمه)','Spiky anime','پرحجم','anime-style eyelash extensions with defined, separated spikes and a doll-like look'],
 ['لیفت و لمینت','Lash lift and tint','بدون کاشت','a lash lift and tint on her own natural lashes: curled up from the root, darker and more visible, no extensions'],
 ['رگهٔ رنگی','Colour accents','پرحجم','black volume lashes with a few subtle coloured strands near the outer corners']
];
// Extra choices shown as chips under the catalog. Index 0 of each list is never forced: no pick
// means "what suits her" in the prompt.
export const LINE_OPTIONS={
 nails:[
  {key:'shape',label:'فرم ناخن',items:[['مربعی','square'],['مربع‌بیضی','squoval (square with soft rounded corners)'],['گرد','round'],['بیضی','oval'],['بادامی','almond'],['تابوتی (بالرین)','coffin / ballerina'],['استیلتو','stiletto (pointed)']]},
  {key:'length',label:'طول',items:[['کوتاه','short, just past the fingertip'],['متوسط','medium'],['بلند','long extensions']]}
 ],
 lashes:[
  {key:'map',label:'حالت',items:[['طبیعی','natural: even length across the eye'],['گربه‌ای','cat eye: longer toward the outer corners, lifted and elongated'],['عروسکی','doll eye: longest at the centre, opening the eye round'],['سنجابی','squirrel: peak length a little before the outer corner, lifted'],['روباهی','fox eye: dramatic upswept outer corners']]},
  {key:'length',label:'طول',items:[['کوتاه','short and subtle (about 8–10 mm)'],['متوسط','medium (about 10–12 mm)'],['بلند','long (about 12–15 mm)']]}
 ]
};
export const LINE_COLORS={
 nails:[['نود','#d9b8a3','nude beige'],['صورتی ملایم','#efc3c8','soft baby pink'],['صورتی نود','#e2b2a8','nude pink'],['شیری','#f2ece2','milky white'],['سفید','#fafafa','pure white'],['قرمز','#c0182b','classic red'],['قرمز آلبالویی','#8e1b2c','cherry red'],['زرشکی','#6d1a2a','deep burgundy'],['شرابی','#5a1730','wine red'],['مشکی','#141414','black'],['قهوه‌ای شکلاتی','#4a2a1c','chocolate brown'],['کرم کاراملی','#c08a5b','caramel'],['مرجانی','#f07a62','coral'],['هلویی','#f4b49a','peach'],['یاسی','#b9a3d6','lilac'],['بنفش','#5b3a78','purple'],['آبی نفتی','#1f3a54','navy blue'],['آبی آسمانی','#9cc6e8','baby blue'],['سبز زیتونی','#6b6a3f','olive green'],['سبز یشمی','#3c7a64','jade green'],['نقره‌ای','#c4c4c2','silver'],['طلایی','#c9a14a','gold'],['رزگلد','#c98c7a','rose gold'],['خاکستری','#8d8d8d','grey']],
 lashes:[['مشکی','#111111','jet black'],['مشکی قهوه‌ای','#2a1d16','soft brown-black'],['قهوه‌ای','#4a2e1e','brown'],['رگه قهوه‌ای','#111111,#7a5233','black with a few brown accents'],['رگه رنگی','#111111,#8a5bd0','black with a few coloured accents']]
};
export const LINE_POPULAR={nails:['نود','صورتی ملایم','شیری','قرمز','زرشکی','کرم کاراملی','مشکی','یاسی'],lashes:['مشکی','مشکی قهوه‌ای','قهوه‌ای','رگه رنگی']};
export const LINE_FILTERS={nails:['همه','ساده','فرنچ','براق','طرح‌دار','نگین'],lashes:['همه','طبیعی','پرحجم','بدون کاشت']};
export const lineStyles=line=>line==='nails'?NAIL_STYLES:line==='lashes'?LASH_STYLES:null;

const norm=s=>String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]/g,'');
function colourEn(line,color){
 if(!color)return '';
 const hit=(LINE_COLORS[line]||[]).find(c=>norm(c[0])===norm(color));
 return hit?hit[2]+' (requested in Persian as "'+color+'")':'"'+color+'" (a Persian colour name; render it as a salon artist would)';
}
const optEn=(line,key,i)=>{const o=(LINE_OPTIONS[line]||[]).find(x=>x.key===key);return Number.isInteger(i)&&o?.items[i]?o.items[i][1]:''};
// Validated option indexes for a line, from the client's {key:index} object.
export function cleanOptions(line,opts){
 const out={};for(const o of LINE_OPTIONS[line]||[]){const i=Number(opts?.[o.key]);if(Number.isInteger(i)&&i>=0&&i<o.items.length)out[o.key]=i}
 return out;
}
export function optionText(line,opts){return (LINE_OPTIONS[line]||[]).map(o=>Number.isInteger(opts?.[o.key])?o.items[opts[o.key]][0]:'').filter(Boolean).join('، ')}

const OUT='\nOUTPUT: one photorealistic photo with the same composition and aspect ratio as Photo 1, high detail. No text, watermark, border, collage or before/after split.';
// mode: 'catalog' (style = English description) or 'reference' (photo 2 is the design reference).
export function linePrompt(line,mode,style,opts,color){
 if(line==='nails'){
  const shape=optEn('nails','shape',opts.shape),len=optEn('nails','length',opts.length);
  return 'Professional nail-salon consultation preview. Photo 1 is the client\'s hand. Edit ONLY her fingernails.\n'+
   'IDENTITY LOCK: keep the exact hand and fingers, skin tone and texture, pose, rings and jewellery, sleeves, background, framing and lighting unchanged. Do not change finger length or shape and never add or remove fingers. Keep the cuticles and nail beds natural.\n'+
   (mode==='reference'?'Photo 2 is ONLY a nail design reference: ignore its hand, skin, jewellery and background.\nNAILS: copy the nail design, finish and colours from photo 2 onto all of her visible nails.':'NAILS: '+style+' on all of her visible nails.')+
   '\nNAIL SHAPE: '+(shape||(mode==='reference'?'as in photo 2, adapted to her fingers':'a shape that suits her fingers'))+'.'+
   '\nNAIL LENGTH: '+(len||(mode==='reference'?'as in photo 2':'medium'))+'.'+
   (color?'\nNAIL COLOUR: '+colourEn('nails',color)+'.'+(mode==='reference'?' This overrides the colour in photo 2.':''):'')+
   '\nREALISM: real gel gloss and reflections matching the photo\'s light, each nail sitting naturally on its finger with correct perspective and curvature, clean edges along the cuticles and sidewalls, every visible nail done consistently.'+OUT;
 }
 if(line==='lashes'){
  const map=optEn('lashes','map',opts.map),len=optEn('lashes','length',opts.length);
  return 'Professional lash-studio consultation preview. Photo 1 is the client. Edit ONLY her upper eyelashes.\n'+
   'IDENTITY LOCK: keep her exact face, eye shape and size, eye colour, eyelids, brows, skin, makeup, expression, head angle, hair, headscarf, clothing, background, framing and lighting unchanged. Do not enlarge the eyes, beautify or retouch.\n'+
   (mode==='reference'?'Photo 2 is ONLY a lash reference: ignore its face, eyes, makeup and background.\nLASHES: copy the lash style, density, curl and mapping from photo 2 onto both of her eyes.':'LASHES: '+style+' on both eyes.')+
   (map?'\nLASH MAPPING: '+map+'.':'')+(len?'\nLASH LENGTH: '+len+'.':'')+
   (color?'\nLASH COLOUR: '+colourEn('lashes',color)+'.':'')+
   '\nREALISM: individual lash fibres rooted along the lash line, natural curl and spacing, correct perspective and symmetry on both eyes, soft believable shadow on the eyelid; lower lashes stay natural.'+OUT;
 }
 return '';
}

// Photo guidance per line for the customer page (step 1) and the catalog generator.
export const LINE_PHOTO={
 hair:{head:'اول، عکس خودت',sub:'یک عکس روبه‌رو با صورت کامل. مدل انتخابی روی همین عکس امتحان می‌شود.',drop:'عکس چهره‌ات را اینجا بگذار',ready:'اگر صورتت کامل و روشن دیده می‌شود، برو سراغ انتخاب مدل.',tips:[['sun','نور روبه‌رو. ','کنار پنجره بایست، نه زیر لامپ سقف.'],['user','صورت کامل. ','بدون کلاه و عینک آفتابی، موها در قاب.'],['spark','بدون فیلتر. ','رنگ واقعی موهات مهم است.']],ref:'فقط موی این عکس استفاده می‌شود؛ چهره‌اش نه.',noun:'مو',demo:'یک نمونهٔ قبل و بعد. با عکس خودت، همین را روی صورت خودت می‌بینی و بعد برای آرایشگر می‌فرستی.'},
 nails:{head:'اول، عکس دستت',sub:'پشت دست، انگشت‌ها کنار هم و ناخن‌ها کامل در قاب. طرح انتخابی روی همین عکس امتحان می‌شود.',drop:'عکس دستت را اینجا بگذار',ready:'اگر ناخن‌هایت واضح و کامل دیده می‌شوند، برو سراغ انتخاب طرح.',tips:[['sun','نور روز. ','کنار پنجره، بدون فلاش.'],['user','پشت دست. ','انگشت‌ها صاف و کنار هم، همهٔ ناخن‌ها در قاب.'],['spark','بدون فیلتر. ','لاک قبلی هم اشکالی ندارد.']],ref:'فقط طرح ناخن این عکس استفاده می‌شود؛ دستش نه.',noun:'ناخن',demo:'یک نمونهٔ قبل و بعد. با عکس دست خودت، طرح را روی ناخن‌های خودت می‌بینی و بعد برای ناخن‌کار می‌فرستی.'},
 lashes:{head:'اول، عکس چشم‌هایت',sub:'از نزدیک و روبه‌رو، چشم‌ها باز و رو به دوربین، بدون عینک. مدل انتخابی روی همین عکس امتحان می‌شود.',drop:'عکس چشم‌هایت را اینجا بگذار',ready:'اگر مژه‌ها و هر دو چشم واضح دیده می‌شوند، برو سراغ انتخاب مدل.',tips:[['sun','نور روبه‌رو. ','کنار پنجره، بدون سایهٔ تند.'],['user','از نزدیک. ','هر دو چشم کامل در قاب، بدون عینک.'],['spark','بدون فیلتر. ','ریمل و آرایش سنگین نداشته باش.']],ref:'فقط مدل مژهٔ این عکس استفاده می‌شود؛ چهره‌اش نه.',noun:'مژه',demo:'یک نمونهٔ قبل و بعد. با عکس خودت، مدل مژه را روی چشم‌های خودت می‌بینی و بعد برای مژه‌کار می‌فرستی.'}
};

// Bot: guess a portfolio photo's line from its caption (null if unclear).
const WORDS={nails:['ناخن','ژلیش','لاک','فرنچ','مانیکور','پدیکور','بیبی بومر','کروم','کت آی','کت‌آی','نیل'],lashes:['مژه','اکستنشن','لیفت','لمینت','والیوم','هیبرید','وت لش','ریمل','لش'],hair:['مو','بالیاژ','کوتاهی','رنگ','مش','لایت','هایلایت','شینیون','کراتین','براشینگ','فر','صافی','آمبره','چتری','ویو','پروانه','ولف','باب','لیر','دم اسبی']};
export function guessLine(caption){
 const c=String(caption||'');const hits=LINE_KEYS.filter(k=>WORDS[k].some(w=>c.includes(w)));
 // "ناخن"/"مژه" are decisive even when a hair word also appears (e.g. «رنگ ناخن»).
 if(hits.includes('nails')&&!hits.includes('lashes'))return 'nails';
 if(hits.includes('lashes')&&!hits.includes('nails'))return 'lashes';
 return hits.length===1?hits[0]:null;
}
export function lineFromSpecialty(sp){const s=String(sp||'');return s.includes('ناخن')?'nails':s.includes('مژه')?'lashes':null}
