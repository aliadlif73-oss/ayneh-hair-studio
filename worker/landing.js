// Public landing page served at "/" (owner console lives at /admin). Static HTML; images in public/landing/.
// Generated from the design source (visual direction AYN-D057/D059/D060/D061/D062; tokens are PROPOSED).
export const landingHTML=`<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>آینه | مشتری قبل از آمدن، مدل مو و ناخنش را روی عکس خودش می‌بیند</title>
<meta name="description" content="صفحهٔ اختصاصی سالن شما: مشتری مدل مو، رنگ، ناخن و مژه را روی عکس خودش امتحان می‌کند و انتخابش را مستقیم به تلگرام یا بله می‌فرستد. پیش‌نمایش رایگان بسازید.">
<meta name="theme-color" content="#F8F2EB">
<meta property="og:title" content="آینه | مشتری قبل از نشستن روی صندلی می‌داند چه می‌خواهد">
<meta property="og:description" content="برای سالن‌های مو، ناخن و مژه. مدل‌ها را همین‌جا امتحان کنید، پیش‌نمایش سالن بسازید و صفحهٔ اختصاصی‌تان را فعال کنید.">
<meta property="og:type" content="website">
<meta property="og:locale" content="fa_IR">
<meta property="og:image" content="__ORIGIN__/landing/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="آینهٔ سه‌تکهٔ برنجی و تیتر آینه">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%23160D07'/%3E%3Cpath d='M16 6c-4.4 0-7 3.3-7 7.4v8.6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8.6C23 9.300 20.400 6 16 6z' fill='none' stroke='%23D6BE8C' stroke-width='1.600'/%3E%3C/svg%3E">
<link rel="preload" href="/fonts/estedad-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/landing/hero.webp" as="image" fetchpriority="high">
<style>
@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+204F,U+FB50-FDFF,U+FE70-FEFC}
@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-200B,U+2012-206F,U+20AC,U+2122,U+2212}
@font-face{font-family:"Estedad";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/estedad-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC}

/* ---------- Tokens (Tokens v0.3 PROPOSED; palette per D060, font per D059) ---------- */
:root{
  --canvas:#F8F2EB; --surface:#FCFAF6; --sunken:#EDE5D9;
  --ink:#1E140B; --muted:#5C5045;
  --espresso:#160D07; --espresso-2:#211409; --espresso-hover:#3A291C;
  --cream:#F9F1E8; --ivory:#FBF4EA; --ivory-2:#E7D9C8;
  --brass:#B9975B; --brass-soft:#D6BE8C; --brass-text:#7A5A32;
  --line-decor:#D8CCBB; --line-control:#857460; --line-dark:#806E50;
  --focus:#6B4F2A; --focus-dark:#F0D08A;
  --r-control:12px; --r-card:20px; --r-frame:28px; --r-pill:999px;
  --font:"Estedad","Vazirmatn",system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;
  --ease:cubic-bezier(.2,.7,.2,1);
  --sec-y:clamp(64px,9vw,120px);
  --gut:clamp(20px,5vw,80px);
}
*{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:84px}
html,body{margin:0;padding:0}
body{font-family:var(--font);font-size:16px;line-height:1.9;background:var(--canvas);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{display:block;max-width:100%;height:auto}
a{text-decoration:none;color:inherit}
button{font:inherit}
h1,h2,h3,p,ul,ol,figure{margin:0}
ul,ol{padding:0;list-style:none}
:focus-visible{outline:3px solid var(--focus);outline-offset:4px;border-radius:6px}
.on-dark :focus-visible,.site-footer :focus-visible{outline-color:var(--focus-dark)}
.skip{position:absolute;inset-inline-start:16px;top:-80px;z-index:100;background:var(--espresso);color:var(--cream);padding:12px 20px;border-radius:var(--r-control);font-weight:700}
.skip:focus{top:12px}
.wrap{max-width:1240px;margin:0 auto}
.num{font-feature-settings:"ss01";font-variant-numeric:tabular-nums}

/* ---------- Header ---------- */
.site-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px clamp(20px,4vw,64px);background:linear-gradient(180deg,#F9F1E8,rgba(249,241,232,.96));border-bottom:1px solid rgba(185,151,91,.2)}
.brand{font-size:28px;font-weight:800;line-height:1.3;white-space:nowrap}
.brand small{font-size:20px;font-weight:700;opacity:.86;margin-inline-start:8px}
.nav{display:flex;gap:clamp(14px,2.2vw,34px);font-size:16px;font-weight:600;color:#2A1D12}
.nav a{padding:8px 2px;border-bottom:2px solid transparent;transition:border-color 160ms var(--ease)}
.nav a:hover{border-color:var(--brass)}
.header-actions{display:flex;align-items:center;gap:10px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 24px;border-radius:var(--r-pill);background:var(--espresso);color:var(--cream);border:1.5px solid var(--brass);box-shadow:0 0 0 3px rgba(185,151,91,.14),0 10px 24px rgba(22,13,7,.18);font-weight:700;font-size:16px;white-space:nowrap;cursor:pointer;transition:background 160ms var(--ease),transform 160ms var(--ease)}
.btn:hover{background:var(--espresso-hover)}
.btn:active{transform:translateY(1px)}
.btn .arrow{font-size:18px;line-height:1}
.btn--lg{min-height:56px;padding:0 32px;font-size:19px;font-weight:800;gap:12px;box-shadow:0 0 0 4px rgba(185,151,91,.14),0 16px 34px rgba(22,13,7,.22)}
.btn--ghost{background:transparent;color:var(--ink);border-color:var(--line-control);box-shadow:none}
.btn--ghost:hover{background:rgba(185,151,91,.14)}
.on-dark .btn--ghost{color:var(--ivory);border-color:var(--brass-soft)}
.on-dark .btn--ghost:hover{background:rgba(214,190,140,.14)}
.on-dark .btn:not(.btn--ghost){background:var(--cream);color:var(--espresso);border-color:var(--brass-soft)}
.on-dark .btn:not(.btn--ghost):hover{background:#fff}
.menu-toggle{display:none}
.mobile-menu[hidden]{display:none!important}

/* ---------- Hero (refs 15/16, D057/D060/D061) ---------- */

/* ---------- Section 2: selection (dark) ---------- */
.selection{position:relative;background:var(--espresso);color:var(--cream);padding:96px var(--gut) 110px}
.selection-grid{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:minmax(320px,560px) minmax(320px,1fr);gap:clamp(32px,6vw,88px);align-items:center}
.selection-copy h2{margin:0 0 18px;font-size:clamp(32px,4vw,48px);font-weight:800;line-height:1.35;color:var(--ivory)}
.selection-copy p{margin:0 0 26px;font-size:18px;line-height:2;color:var(--ivory-2);font-weight:500;max-width:520px}
.chips{display:flex;flex-wrap:wrap;gap:12px}
.chip{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:var(--r-pill);border:1px solid rgba(214,190,140,.55);background:linear-gradient(180deg,rgba(255,248,238,.08),rgba(255,248,238,.02));color:#F3E7D6;font-size:15px;font-weight:600;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)}
.compare{position:relative;width:100%;max-width:580px;justify-self:center;z-index:8;filter:drop-shadow(0 30px 60px rgba(0,0,0,.45));align-self:start;margin-top:calc(-96px - min(49.65px,8.56%))}
.compare img{width:100%;border-radius:28px}
.compare::before{content:"";position:absolute;z-index:3;pointer-events:none;top:10.45%;left:8.45%;right:2.9%;height:75.5%;border:1.7px solid #B49A76;border-bottom:0;border-radius:15px 15px 0 0;-webkit-mask-image:linear-gradient(to right,#000 0%,#000 28%,transparent 34%,transparent 67%,#000 73%,#000 100%);mask-image:linear-gradient(to right,#000 0%,#000 28%,transparent 34%,transparent 67%,#000 73%,#000 100%)}
.compare .tag{position:absolute;bottom:11.5%;font-size:16px;font-weight:700;color:#F7EBD9;text-shadow:0 2px 8px rgba(0,0,0,.65)}
.compare .tag.before{left:9%}.compare .tag.after{right:8%}

/* ---------- Generic sections ---------- */
.section{padding:var(--sec-y) var(--gut)}
.section--sunken{background:var(--sunken)}
.section--dark{background:var(--espresso);color:var(--cream)}
.sec-head{max-width:720px;margin:0 0 clamp(32px,5vw,56px)}
.kicker{margin:0 0 10px;font-size:15px;font-weight:700;color:var(--brass-text)}
.on-dark .kicker{color:var(--brass-soft)}
h2{font-size:clamp(32px,4vw,48px);line-height:1.35;font-weight:800}
.on-dark h2{color:var(--ivory)}
.sec-head p.sub{margin-top:14px;font-size:18px;line-height:1.95;color:var(--muted);font-weight:500}
.on-dark .sec-head p.sub{color:var(--ivory-2)}
h3{font-size:24px;line-height:1.5;font-weight:700}

/* Services */
.cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px)}
.svc{display:flex;flex-direction:column;gap:14px;padding:clamp(24px,3vw,36px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card);box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 14px 34px rgba(60,40,18,.07)}
.svc .ico{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#E7D3A4,#A9824F 55%,#E2C88F);padding:3px;box-shadow:0 8px 18px rgba(60,40,18,.16)}
.svc .ico span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:var(--espresso)}
.svc .ico svg{width:34px;height:34px;stroke:var(--brass-soft);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.svc p{color:var(--muted);font-size:16px}
.svc .picks{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:6px}
.svc .picks li{padding:2px 12px;min-height:32px;display:inline-flex;align-items:center;border-radius:var(--r-pill);border:1px solid var(--line-decor);background:var(--canvas);font-size:14px;font-weight:600;color:#3A2A1B}
.svc .count{font-size:14px;font-weight:700;color:var(--brass-text)}
.note-bar{margin-top:clamp(24px,3vw,36px);padding:16px 20px;border:1px solid var(--line-decor);border-radius:var(--r-control);background:var(--surface);font-size:15px;color:var(--muted)}

/* Steps */
.steps{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px);counter-reset:s}
.step{position:relative;padding:clamp(24px,3vw,32px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card)}
.step::before{counter-increment:s;content:counter(s,persian);display:grid;place-items:center;width:44px;height:44px;margin-bottom:14px;border-radius:50%;background:var(--espresso);color:var(--brass-soft);font-weight:800;font-size:20px;border:1.5px solid var(--brass)}
.step p{margin-top:8px;color:var(--muted)}

/* Salons (dark) */
.split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:start}
.feat{display:grid;gap:14px}
.feat li{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border-radius:var(--r-card);border:1px solid var(--line-dark);background:linear-gradient(180deg,rgba(255,248,238,.07),rgba(255,248,238,.02))}
.feat .dot{flex:0 0 10px;width:10px;height:10px;margin-top:12px;border-radius:50%;background:var(--brass-soft)}
.feat strong{display:block;color:var(--ivory);font-size:17px;font-weight:700}
.feat span.d{color:var(--ivory-2);font-size:15px}
.msgrs{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.msgrs li{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:var(--r-pill);border:1px solid rgba(214,190,140,.55);color:var(--ivory);font-weight:700;font-size:15px}
.no-list{margin-top:22px;padding:16px 20px;border-radius:var(--r-control);border:1px dashed var(--line-dark);color:var(--ivory-2);font-size:15px}

/* Plans */
.plans{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px);align-items:stretch}
.plan{display:flex;flex-direction:column;gap:12px;padding:clamp(24px,3vw,36px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card)}
.plan--pro{border:1.5px solid var(--brass);box-shadow:0 0 0 4px rgba(185,151,91,.12),0 18px 40px rgba(60,40,18,.12)}
.plan .badge{align-self:flex-start;padding:0 12px;min-height:28px;display:inline-flex;align-items:center;border-radius:var(--r-pill);background:var(--espresso);color:var(--brass-soft);font-size:13px;font-weight:700}
.plan .price{font-size:clamp(30px,3vw,38px);font-weight:800;line-height:1.3}
.plan .price small{font-size:16px;font-weight:600;color:var(--muted);margin-inline-start:6px}
.plan ul{display:grid;gap:10px;margin-top:6px;padding-top:16px;border-top:1px solid var(--line-decor)}
.plan li{position:relative;padding-inline-start:26px;font-size:15px;color:#3A2A1B}
.plan li::before{content:"";position:absolute;inset-inline-start:0;top:.7em;width:14px;height:1.6px;background:var(--brass-text)}
.plan-note{margin-top:clamp(20px,3vw,32px);padding:16px 20px;border-radius:var(--r-control);border:1px solid var(--line-decor);background:var(--surface);font-size:15px;color:var(--muted)}

/* FAQ */
.faq{max-width:860px;display:grid;gap:12px}
.faq details{background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card);overflow:hidden}
.faq summary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:60px;padding:14px 22px;cursor:pointer;font-size:17px;font-weight:700;list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";flex:0 0 28px;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid var(--line-control);font-size:20px;line-height:1;color:var(--brass-text);transition:transform 240ms var(--ease)}
.faq details[open] summary::after{content:"−"}
.faq details p{padding:0 22px 20px;color:var(--muted);font-size:16px}

/* Start (dark) */
.start-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2.4vw,28px)}
.path{display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding:clamp(24px,3vw,40px);border-radius:var(--r-frame);border:1px solid var(--line-dark);background:var(--espresso-2)}
.path p{color:var(--ivory-2);font-size:16px}
.path .btn{margin-top:auto}
.path h3{color:var(--ivory)}

/* Footer */
.site-footer{background:var(--espresso);color:#BFA98F;padding:40px var(--gut) 44px;border-top:1px solid rgba(214,190,140,.2);font-size:14px}
.foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px 40px;align-items:flex-start}
.foot .brand{color:var(--ivory)}
.foot ul{display:flex;flex-wrap:wrap;gap:8px 24px}
.foot a{color:var(--ivory-2);padding:8px 0;display:inline-block}
.foot a:hover{color:#fff}
.legal{margin-top:24px;padding-top:20px;border-top:1px solid rgba(214,190,140,.16);line-height:1.9}

/* ---------- Responsive ---------- */
@media (max-width:1100px){
  .nav{display:none}
  .site-header{gap:10px}
  .menu-toggle{display:inline-flex;align-items:center;justify-content:center;flex:0 0 46px;width:46px;height:46px;padding:0;border-radius:50%;border:1px solid var(--brass);background:rgba(252,250,246,.88);color:var(--ink);cursor:pointer;box-shadow:0 5px 16px rgba(54,36,19,.08)}
  .menu-bars{position:relative;display:block;width:19px;height:14px}
  .menu-bars i{position:absolute;display:block;width:19px;height:1.8px;background:currentColor;border-radius:3px;inset-inline-start:0;transition:transform 160ms ease,top 160ms ease}
  .menu-bars i:first-child{top:3px}.menu-bars i:last-child{top:10px}
  .menu-toggle[aria-expanded="true"] .menu-bars i:first-child{top:7px;transform:rotate(45deg)}
  .menu-toggle[aria-expanded="true"] .menu-bars i:last-child{top:7px;transform:rotate(-45deg)}
  .mobile-menu:not([hidden]){display:block;position:absolute;top:calc(100% + 8px);inset-inline-end:clamp(16px,4vw,64px);z-index:35;width:min(380px,calc(100vw - 32px));padding:18px 20px 16px;color:var(--ink);background:var(--surface);border:1px solid var(--line-decor);border-radius:20px;box-shadow:0 20px 55px rgba(34,22,12,.18),0 3px 12px rgba(34,22,12,.06);animation:menu-appear 160ms ease-out both}
  .menu-kicker{margin:0 0 8px;color:var(--brass-text);font-size:13px;font-weight:700}
  .menu-link{min-height:51px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--sunken);font-size:16px;font-weight:700}
  .menu-link:hover{color:var(--brass-text)}
  .menu-link>span:last-child{color:var(--brass-text);font-size:18px}

}
@media (max-width:1100px){
  .selection{padding-top:0}
  .selection-grid{grid-template-columns:1fr;gap:30px}
  .selection-copy{order:2;text-align:center}
  .selection-copy p{margin-inline:auto}
  .chips{justify-content:center}
  .compare{order:1;margin:max(-44.52px,-8.56%) auto 0;max-width:520px}
  .cards3,.steps,.plans{grid-template-columns:1fr}
  .split,.start-grid{grid-template-columns:1fr}
}
@media (max-width:560px){
  .site-header{padding:12px 16px;gap:6px}
  .header-actions{gap:7px}
  .brand{font-size:22px}.brand small{font-size:16px}
  .menu-toggle{width:44px;height:44px;flex-basis:44px}
  .btn{min-height:44px;padding:0 14px;font-size:14px}
  .btn--lg{min-height:52px;font-size:17px;padding:0 24px}
  .compare .tag{font-size:13px;bottom:12%}
  .selection-copy p,.sec-head p.sub{font-size:17px}
}
@media (max-width:360px){
  .brand{font-size:20px}.brand small{font-size:13px;margin-inline-start:4px}
  .btn{padding:0 11px;font-size:13px;gap:6px}.btn .arrow{font-size:16px}
}
@media (min-width:1101px) and (max-width:1280px){
}
@media (min-width:1101px){.hero{background-size:max(112%,1565px) auto}}
@keyframes menu-appear{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}}

/* ---------- Hero: copy column + mirror studio ---------- */
:root{--hh:76px;--p:0;--z:1}
.film{position:relative;height:calc(100svh - var(--hh) + 50svh);background:#EFE6DA}
.stage{position:sticky;top:calc(var(--hh) + env(safe-area-inset-top,0px));height:calc(100svh - var(--hh));min-height:540px;overflow:hidden;isolation:isolate;background:#EFE6DA;display:grid;grid-template-columns:minmax(340px,36%) 1fr;align-items:stretch}
.fade{position:absolute;inset:0;z-index:9;pointer-events:none;background:linear-gradient(180deg,rgba(22,13,7,0) 40%,#160D07 100%);opacity:0}

/* copy (first grid column = right in RTL) */
.copy{position:relative;z-index:6;align-self:center;padding:24px clamp(20px,3.4vw,56px);text-align:right;opacity:calc(1 - var(--p)*1.8);transform:translateY(calc(var(--p)*-40px))}
.eyebrow{margin:0 0 12px;font-size:16px;font-weight:700;color:#6B5233}
h1{margin:0 0 16px;font-size:clamp(30px,2.9vw,48px);line-height:1.3;font-weight:800;color:#170E07;text-wrap:balance}
.lead{margin:0 0 22px;font-size:clamp(16px,1.25vw,18px);line-height:1.95;color:#33261A;font-weight:500;max-width:46ch}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.fineprint{margin:14px 0 0;font-size:13.5px;line-height:1.8;color:#5C4A38;font-weight:500}
.reveal{animation:rise 900ms var(--ease) both}
.copy .reveal:nth-child(2){animation-delay:120ms}.copy .reveal:nth-child(3){animation-delay:220ms}.copy .reveal:nth-child(4){animation-delay:320ms}.copy .reveal:nth-child(5){animation-delay:420ms}
@keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}

/* studio: the mirror photo fills the second column */
.studio{position:relative;min-width:0;overflow:hidden}
.mirror{position:absolute;inset:0;transform:scale(var(--z));transform-origin:50% 45%;will-change:transform}
.mirror::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(270deg,#EFE6DA 0,rgba(239,230,218,0) 12%),radial-gradient(120% 90% at 50% 42%,transparent 58%,rgba(22,13,7,.18) 100%)}
.plate{position:absolute;left:0;top:0;width:1376px;height:768px;animation:dolly 2200ms var(--ease) both;transform-origin:50% 45%}
.plate img,.plate canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.plate img.alt{opacity:0;transition:opacity 480ms var(--ease)}
.plate img.alt.show{opacity:1}
@keyframes dolly{from{transform:scale(1.1);filter:brightness(.72) saturate(.8)}to{transform:none;filter:none}}

/* shared glass recipe (D060: frosted, brass hairline) */
.glass{background:rgba(236,226,212,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(185,151,91,.5);box-shadow:0 18px 44px rgba(40,26,12,.2)}
@supports not (backdrop-filter:blur(1px)){.glass{background:#ECE2D4}}

/* A static existing edge plus a small travelling glint, inside the image/circle only. */
svg.frame{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none}
.frame rect{x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px);rx:9px;ry:9px}
.frame rect,.frame circle{fill:none;vector-effect:non-scaling-stroke}
.frame .edge{stroke:#B9975B;stroke-width:1;opacity:.4;transition:opacity 240ms,stroke 240ms}
.frame .orbit{stroke:#F8D77C;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:13 87;stroke-dashoffset:0;opacity:0;filter:drop-shadow(0 0 2px #E7BE58);animation:gold-orbit 4s linear infinite;animation-play-state:paused;transition:opacity 240ms}
[aria-checked="true"] .frame .edge{opacity:1;stroke:#D9B966}
[aria-checked="true"] .frame .orbit{opacity:.95;animation-play-state:running}
@keyframes gold-orbit{to{stroke-dashoffset:-100}}

/* podium dock: lives on the plate, so it always sits on the podium */
.dock{--u:1;position:absolute;z-index:3;left:49.85%;top:64.6%;width:26%;padding:calc(6px * var(--u)) calc(8px * var(--u)) 0;border-radius:calc(18px * var(--u));transform:translateX(-50%);transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s}
.dock.away{opacity:0;visibility:hidden;transform:translateX(-50%) translateY(14px);transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s linear 360ms}
.dock h2{margin:0;font-size:calc(13px * var(--u));font-weight:800;color:#24170C;text-align:center}
.dock-view{position:relative}
.hscroll{display:flex;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch}
.hscroll::-webkit-scrollbar{display:none}
.hscroll.dragging{cursor:grabbing;scroll-snap-type:none}
.dock-track{gap:calc(4px * var(--u));padding:calc(10px * var(--u)) calc(26px * var(--u)) calc(6px * var(--u));cursor:grab;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)}
.d-item{position:relative;flex:0 0 33.333%;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:calc(2px * var(--u));padding:calc(4px * var(--u)) 0 calc(5px * var(--u));border:0;background:none;cursor:pointer;color:#241A12;font-size:calc(11.5px * var(--u));font-weight:700;line-height:1.35;text-align:center;border-radius:calc(12px * var(--u))}
.d-item .ic{display:grid;place-items:center;height:calc(58px * var(--u));width:100%}
.d-item img{height:calc(50px * var(--u));width:auto;max-width:86%;object-fit:contain;filter:drop-shadow(0 calc(4px * var(--u)) calc(5px * var(--u)) rgba(60,36,16,.28));transition:transform 260ms var(--ease);pointer-events:none;-webkit-user-drag:none}
.d-item>span:last-of-type{max-width:100%;padding:0 2px;line-height:1.25;min-height:2.5em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.d-item:hover img,.d-item[aria-checked="true"] img{transform:translateY(-4%) scale(1.18)}
.d-item[aria-checked="true"]{background:rgba(255,250,242,.6)}
.nav-btn{position:absolute;top:50%;z-index:2;width:calc(34px * var(--u));height:calc(34px * var(--u));min-width:28px;min-height:28px;transform:translateY(-50%);border-radius:50%;border:1px solid var(--brass);background:rgba(252,250,246,.96);color:var(--ink);font-size:calc(20px * var(--u));line-height:1;cursor:pointer;display:grid;place-items:center;padding:0 0 2px;box-shadow:0 4px 10px rgba(40,26,12,.18)}
.nav-btn:hover{background:#fff}
.nav-btn[disabled]{opacity:.35;cursor:default}
.dock .nav-r{right:calc(-6px * var(--u))}.dock .nav-l{left:calc(-6px * var(--u))}
.more{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:calc(32px * var(--u));border:0;border-top:1px solid rgba(185,151,91,.4);background:none;color:#4A3722;font-size:calc(12px * var(--u));font-weight:700;cursor:pointer;border-radius:0 0 calc(14px * var(--u)) calc(14px * var(--u))}
.more:hover{color:#1E140B}
.more svg,.close svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.more svg{animation:bob 1.8s var(--ease) infinite}
@keyframes bob{0%,100%{transform:translateY(-1px)}50%{transform:translateY(3px)}}

/* colour palette: all swatches visible, no scroll trap */
.palette{position:absolute;z-index:4;left:clamp(12px,2vw,32px);top:50%;transform:translateY(-50%);width:94px;border-radius:48px;padding:12px 0 8px}
.palette h2,.styles-head h2{margin:0 0 2px;font-size:13px;font-weight:800;color:#5C4A38;text-align:center}
.col-list{display:flex;flex-direction:column;gap:2px}
.sw{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;border:0;background:none;cursor:pointer;color:#241A12;font-size:12px;font-weight:700;line-height:1.3;text-align:center;border-radius:16px}
.sw .dot{width:40px;height:40px;border-radius:50%;padding:3px;background:linear-gradient(145deg,#E7D3A4,#A9824F 55%,#E2C88F);box-shadow:0 6px 12px rgba(60,40,18,.18);transition:transform 240ms var(--ease)}
.sw .dot i{display:block;width:100%;height:100%;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,248,230,.45)}
.sw:hover .dot{transform:scale(1.08)}
.sw[aria-checked="true"] .dot{transform:scale(1.1);box-shadow:0 0 0 3px #F6EFE5,0 0 0 4.5px #B9975B,0 6px 12px rgba(60,40,18,.18)}
@media (max-height:760px) and (min-width:901px){.sw>span:not(.dot){font-size:11px}.sw .dot{width:34px;height:34px}.sw{padding:4px}}

/* reference card for the chosen style */
.reference{position:absolute;z-index:4;right:clamp(14px,2.4vw,40px);top:clamp(14px,4vh,40px);width:min(230px,26%);display:flex;gap:10px;align-items:center;padding:8px;border-radius:18px;opacity:0;transform:translateY(10px);transition:opacity 380ms var(--ease),transform 380ms var(--ease);pointer-events:none}
.reference.on{opacity:1;transform:none;pointer-events:auto}
.reference .ph{flex:0 0 64px;aspect-ratio:4/5;border-radius:12px;overflow:hidden;background:#d9cdbb}
.reference .ph img{width:100%;height:100%;object-fit:cover}
.ref-body{display:grid;gap:2px;min-width:0;text-align:right}
.ref-body strong{font-size:14px;color:#1E140B}
.ref-body small{font-size:12px;line-height:1.6;color:#5C4A38}
.ref-try{font-size:12.5px;font-weight:800;color:#6B4F2A;text-decoration:underline;text-underline-offset:3px}

/* result chip */
.result{position:absolute;z-index:5;left:50%;bottom:clamp(10px,2.2vh,22px);transform:translate(-50%,10px);display:flex;align-items:center;gap:12px;padding:6px 6px 6px 16px;border-radius:var(--r-pill);font-size:14px;font-weight:700;color:#241A12;opacity:0;pointer-events:none;transition:opacity 380ms var(--ease),transform 380ms var(--ease);white-space:nowrap;max-width:calc(100% - 24px)}
.result.on{opacity:1;pointer-events:auto;transform:translate(-50%,0)}
.result .btn{min-height:40px;padding:0 16px;font-size:14px}
.result span{overflow:hidden;text-overflow:ellipsis}

/* all styles rail (bottom sheet) */
.styles{position:absolute;z-index:8;left:0;right:0;bottom:0;padding-bottom:clamp(10px,2.4vh,24px);background:linear-gradient(180deg,rgba(239,230,218,0),rgba(239,230,218,.94) 26%);opacity:0;visibility:hidden;transform:translateY(60px);transition:opacity 420ms var(--ease),transform 520ms var(--ease),visibility 0s linear 520ms}
.styles.open{opacity:1;visibility:visible;transform:none;transition:opacity 420ms var(--ease),transform 520ms var(--ease)}
.styles-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px clamp(16px,5vw,80px) 8px}
.styles-head h2{text-align:right;font-size:15px}
.close{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;border-radius:var(--r-pill);border:1px solid var(--brass);background:rgba(252,250,246,.95);color:var(--ink);font-size:14px;font-weight:700;cursor:pointer}
.close:hover{background:#fff}
.rail-wrap{position:relative}
.track{gap:16px;padding:12px clamp(56px,6vw,96px) 14px;cursor:grab}
.card{position:relative;flex:0 0 auto;scroll-snap-align:center;width:clamp(92px,min(10vw,17vh),132px);padding:0;border:0;background:none;cursor:pointer;text-align:center;font-size:13.5px;font-weight:700;color:#241A12;transition:transform 300ms var(--ease)}
.card .ph{display:block;aspect-ratio:4/5;border-radius:16px;overflow:hidden;box-shadow:0 12px 26px rgba(40,26,12,.26)}
.card img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none}
.card .nm{display:block;margin-top:8px;padding:2px 6px;border-radius:10px;background:rgba(246,239,229,.85);line-height:1.5}
.card:hover{transform:translateY(-5px)}
.card[aria-checked="true"]{transform:translateY(-6px)}
.card[aria-checked="true"] .ph{box-shadow:0 0 0 3px #F6EFE5,0 0 0 4.5px #B9975B,0 18px 36px rgba(40,26,12,.34)}
.card[aria-checked="true"] .nm{background:var(--espresso);color:var(--cream)}
.card svg.frame{display:block}.card .frame rect{rx:16px;ry:16px}
.rail-wrap .nav-btn{--u:1;width:44px;height:44px;font-size:26px;margin-top:-14px}
.rail-wrap .nav-r{right:clamp(8px,2vw,28px)}.rail-wrap .nav-l{left:clamp(8px,2vw,28px)}

/* mid widths: narrower copy */
@media (min-width:901px) and (max-width:1180px){.stage{grid-template-columns:minmax(320px,40%) 1fr}h1{font-size:clamp(28px,3.1vw,38px)}.lead{font-size:16px}.reference{display:none}}
@media (min-width:901px) and (max-height:700px){.lead{display:none}.fineprint{display:none}}

/* phones and small tablets: normal flow, no pinning */
@media (max-width:900px){
  .film{height:auto}
  .stage{position:relative;top:auto;height:auto;min-height:0;display:flex;flex-direction:column;overflow:visible}
  .copy{display:contents}
  .copy>*{padding-inline:20px;text-align:center}
  .eyebrow{order:1;padding-top:20px}h1{order:2}.studio{order:3}.palette.mobile{order:4}.dock.mobile{order:5}.lead{order:6}.cta-row{order:7}.fineprint{order:8;padding-bottom:22px}
  .eyebrow{font-size:14px;margin-bottom:8px}
  h1{font-size:clamp(26px,7.4vw,34px);margin-bottom:10px}
  .lead{font-size:15.5px;line-height:1.9;margin:0 auto 16px}
  .cta-row{justify-content:center}
  .cta-row .btn--lg{width:100%;font-size:17px}
  .fineprint{font-size:12.5px}
  .studio{height:min(118vw,560px);overflow:hidden}
  .mirror{transform:none}
  .mirror::after{background:radial-gradient(120% 90% at 50% 42%,transparent 60%,rgba(22,13,7,.16) 100%)}
  .palette.mobile{position:relative;left:auto;top:auto;transform:none;width:auto;margin:10px 12px 0;border-radius:22px;padding:8px 6px 6px}
  .palette.mobile .col-list{flex-direction:row;overflow-x:auto;scrollbar-width:none;gap:2px}
  .palette.mobile .col-list::-webkit-scrollbar{display:none}
  .palette.mobile .sw{flex:0 0 74px;font-size:11.5px}.palette.mobile .sw .dot{width:38px;height:38px}
  .reference{display:none}
  .result{bottom:auto;top:10px;font-size:13px;padding:4px 4px 4px 12px}.result .btn{min-height:36px;padding:0 12px;font-size:13px}
  .dock.mobile{position:relative;left:auto;top:auto;width:auto;transform:none;margin:10px 12px 6px;--u:1.05}
  .dock.mobile .d-item{flex:0 0 clamp(88px,27vw,118px)}
  .studio{height:min(100vw,520px)}
  .lead{margin-top:16px}
  .dock.mobile.away{transform:translateY(14px)}
  .styles{position:fixed;z-index:40;padding-bottom:max(12px,env(safe-area-inset-bottom,0px));background:rgba(239,230,218,.97);box-shadow:0 -12px 30px rgba(40,26,12,.18)}
  .rail-wrap .nav-btn{display:none}
  .track{padding-inline:20px}
  .card{width:clamp(92px,27vw,116px)}
  .fade{display:none}
}
@media (prefers-reduced-motion:reduce){.reveal,.plate{animation:none}.more svg{animation:none}.mirror{transform:none}}
/* touch targets: the dock arrows stay visually small inside the plate but get a 44px hit area */
.nav-btn::before{content:"";position:absolute;inset:50% auto auto 50%;width:44px;height:44px;transform:translate(-50%,-50%);border-radius:50%}

/* Interruptible walkthrough. Glass blanks cover only the three mirror interiors. */
.plate{animation:none;--scene-scale:1}
.plate>.room-backdrop{z-index:0}
.empty-glass{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
.mirror-front{position:absolute;inset:0;z-index:2;opacity:0;clip-path:polygon(35.9% 19.9%,63.7% 19.9%,63.7% 63.6%,35.9% 63.6%);transform-origin:49.8% 42%;transition:opacity 700ms var(--ease),transform 1000ms var(--ease);backface-visibility:hidden;pointer-events:none}
.portrait-visible .mirror-front{opacity:1}
#roomImg{z-index:0}#roomImg2{z-index:1}#hairCanvas{z-index:2;pointer-events:none}
.mirror-flipped .mirror-front{transform:perspective(1400px) rotateY(180deg);opacity:0}
.mirror-invite{position:absolute;z-index:3;left:43.9%;top:22.8%;width:11.2%;height:38.2%;padding:calc(12px * var(--scene-scale));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(12px * var(--scene-scale));text-align:center;color:#F8F2EB;background:linear-gradient(150deg,#312319,#160D07);border:1px solid #B9975B;border-radius:48% 48% 2px 2px / 27% 27% 2px 2px;transform:perspective(1400px) rotateY(-180deg);opacity:0;pointer-events:none;transition:transform 1000ms var(--ease),opacity 600ms var(--ease);backface-visibility:hidden}
.mirror-flipped .mirror-invite{transform:none;opacity:1;pointer-events:auto}
.invite-mark{color:#D6BE8C;font-size:calc(24px * var(--scene-scale));line-height:1}
.mirror-invite p{font-size:calc(24px * var(--scene-scale));line-height:1.6;font-weight:700;margin:0}
.mirror-invite .btn{font-size:calc(12px * var(--scene-scale));line-height:1.8;min-height:44px;padding:calc(8px * var(--scene-scale));white-space:normal;border-color:#B9975B;background:#D6BE8C;color:#160D07;gap:4px}
.mirror-invite button{font-size:calc(11px * var(--scene-scale));color:#F8F2EB;text-decoration:underline;text-underline-offset:4px;border:0;background:none;min-height:44px;cursor:pointer;padding:0}
.dock{z-index:4}
.d-item .ic{height:calc(62px * var(--u));overflow:hidden;border-radius:9px;width:calc(46px * var(--u))}
.d-item img{position:static;width:100%;height:100%;max-width:none;object-fit:cover;filter:none;border-radius:9px}
.preview-kind{display:block;font-size:11px;font-weight:500;margin-top:4px;color:#5C4A38}
.demo-file{position:absolute;z-index:11;width:100px;padding:6px;border:1px solid #B9975B;border-radius:14px;background:#FCFAF6;box-shadow:0 14px 28px #160D0730;opacity:0;pointer-events:none;transform:rotate(-8deg) scale(.9);transition:opacity 250ms,transform 250ms}
.demo-file.visible{opacity:1;transform:rotate(-8deg) scale(1)}
.demo-file img{display:block;width:88px;height:74px;object-fit:cover;object-position:50% 40%;border-radius:8px}
.demo-file span{display:block;font-size:11px;text-align:center;white-space:nowrap;color:#33261A;padding-top:4px}
.demo-hand{position:absolute;z-index:12;width:34px;height:40px;fill:#fff;stroke:#20160D;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 4px 5px #160D0740);opacity:0;pointer-events:none;transform-origin:25% 15%;transition:opacity 200ms,transform 180ms}
.demo-hand.visible{opacity:1}.demo-hand.press{transform:scale(.78)}
.demo-caption{position:absolute;z-index:7;left:12%;top:18px;max-width:43%;padding:8px 16px;border:1px solid #B9975B60;background:#FCFAF6dd;backdrop-filter:blur(8px);border-radius:24px;font-size:13px;line-height:1.8;text-align:center;color:#4A3722;pointer-events:none}
.demo-controls{position:absolute;z-index:7;left:14px;bottom:12px}
.demo-controls button{min-height:44px;padding:0 14px;border:1px solid #B9975B80;border-radius:24px;background:#FCFAF6dd;color:#4A3722;font-size:12px;cursor:pointer}
.demo-controls button[hidden]{display:none}
.demo-highlight{outline:2px solid #A57E34;outline-offset:3px}
.stage[data-demo="playing"] .reference,.stage[data-demo="playing"] .result{opacity:0;pointer-events:none}
@media(min-width:901px) and (max-height:700px){.copy .lead{display:block;font-size:14px;line-height:1.8;margin-bottom:14px}.copy h1{font-size:30px}.copy .fineprint{display:block;font-size:11px}.copy .cta-row{gap:8px}.copy .cta-row .btn{font-size:13px;min-height:44px}}
@media(max-width:900px){
 .demo-caption{position:relative;left:auto;top:auto;max-width:none;margin:8px 20px 0;order:4;font-size:12px;min-height:40px}
 .palette.mobile{order:5}.dock.mobile{order:6}.lead{order:7}.cta-row{order:8}.fineprint{order:9}
 .demo-controls{position:relative;left:auto;bottom:auto;text-align:center;order:10;padding:0 16px 16px}
 .demo-hand{display:none}.copy .cta-row .btn--ghost{font-size:14px}
 .mirror-invite .btn{font-size:max(11px,calc(12px * var(--scene-scale)))}.mirror-invite button{font-size:max(11px,calc(11px * var(--scene-scale)))}.mirror-invite{padding:6px;gap:4px}
}
@media(prefers-reduced-motion:reduce){.mirror-front,.mirror-invite,.demo-hand,.demo-file{transition:none}.demo-file,.demo-hand{display:none}.mirror-front{opacity:1}.mirror-flipped .mirror-front{transform:none;opacity:1}.mirror-invite{display:none}}

.mirror-flipped .reference,.mirror-flipped .result{opacity:0;pointer-events:none}
.demo-file{overflow:hidden}.demo-file img{transform:scale(3.1);transform-origin:50% 40%;clip-path:inset(24% 33% 39% 33%)}
.demo-file span{position:relative;z-index:1;background:#FCFAF6}

/* Keep selection within the existing thumbnail frame; labels and button boxes stay quiet. */
.d-item .ic,.card .ph{position:relative;overflow:visible;isolation:isolate}
.d-item img,.d-item:hover img,.d-item[aria-checked="true"] img{transform:none}
.d-item[aria-checked="true"]{background:none}
.d-item .ic{box-shadow:inset 0 0 0 1px #B9975B50;transition:box-shadow 250ms}
.d-item[aria-checked="true"] .ic{box-shadow:0 0 7px #E6C26726,inset 0 0 0 1px #D9B966}
.card img{border-radius:16px}
.card[aria-checked="true"]{transform:none}
.card[aria-checked="true"] .ph{box-shadow:0 0 8px #E6C26730,0 12px 26px #281A0C26}
.card[aria-checked="true"] .nm{background:rgba(246,239,229,.85);color:#241A12}
.sw .dot{position:relative;isolation:isolate;transition:box-shadow 250ms}
.sw:hover .dot,.sw[aria-checked="true"] .dot{transform:none}
.sw[aria-checked="true"] .dot{box-shadow:0 0 7px 1px #EAC75D45,inset 0 0 0 1px #F6D98E,0 4px 9px #3C281216}
.sw .frame .edge{opacity:0}
.sw[aria-checked="true"] .frame .edge{opacity:.8;stroke-width:1}
.sw .frame .orbit{stroke-width:1.2}
.d-item:focus-visible,.card:focus-visible,.sw:focus-visible{outline:none}
.d-item:focus-visible .ic,.card:focus-visible .ph,.sw:focus-visible .dot{outline:2px solid var(--focus);outline-offset:4px}
.demo-highlight{outline:0}
.demo-highlight .frame .orbit{opacity:.95;animation-play-state:running}
@media(prefers-reduced-motion:reduce){.frame .orbit{animation:none;stroke-dasharray:none;opacity:0!important}}
@media(max-width:900px){
 .hero-playground{order:3;display:flex;flex-direction:column;margin:0 12px 16px;border:1px solid #b9975b45;border-radius:20px;overflow:clip;background:#efe6da;height:min(76svh,610px);min-height:470px}
 .hero-playground .studio{order:0;flex:1;height:auto;min-height:210px;max-height:340px;width:100%;position:relative}
 .hero-playground .palette.mobile{order:1;flex:none;margin:0;border:0;border-top:1px solid #b9975b40;border-radius:0;padding:5px 6px;box-shadow:none;backdrop-filter:none}
 .hero-playground .palette h2{font-size:11px;margin:0 0 3px}.hero-playground .col-list{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));overflow:visible;gap:0}
 .hero-playground .palette.mobile .sw{width:auto;min-width:0;min-height:50px;flex:none;font-size:8px;padding:3px 0;gap:3px}.hero-playground .palette.mobile .sw .dot{width:30px;height:30px}
 .hero-playground .dock.mobile{order:2;flex:none;margin:0;width:100%;border:0;border-top:1px solid #b9975b40;border-radius:0;padding:7px 12px;--u:.8;box-shadow:none;backdrop-filter:none}
 .hero-playground .dock h2{font-size:11px;margin-bottom:3px}.hero-playground .dock.mobile .d-item{flex:0 0 28%;font-size:10px}.hero-playground .more{min-height:34px;font-size:10px}
 .demo-caption,.demo-controls{display:none}.result{display:none}.eyebrow{font-size:12px;padding-top:14px}h1{font-size:25px;line-height:1.5}.lead{font-size:14px}.copy .cta-row .btn{font-size:14px}
}
/* The result action must never cover the model picker. */
.result{display:none!important}.dock .more{position:relative;z-index:6;min-height:44px}.dock{padding-bottom:8px}.site-loader{position:fixed;inset:0;z-index:1000;background:#f4ecdf;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;transition:opacity .4s,visibility .4s}.site-loader.is-done{opacity:0;visibility:hidden;pointer-events:none}.hero-loading{overflow:hidden}.loader-mirror{position:relative;width:110px;height:150px;border:1px solid #b9975b;border-radius:60px 60px 7px 7px;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#ece2d1,#fff8ec)}.loader-mirror span{font-size:25px;font-weight:800;color:#302116}.loader-mirror i{position:absolute;inset:-100%;background:linear-gradient(110deg,transparent 45%,#fff9 50%,transparent 55%);animation:mirrorShine 1.7s ease-in-out infinite}.site-loader p{font-size:13px;color:#786044;margin:0}.loader-track{height:2px;width:150px;background:#d7c9af;overflow:hidden}.loader-track i{display:block;height:100%;width:0;background:#b18a42;transition:width .2s}@keyframes mirrorShine{from{transform:translateX(-50%)}to{transform:translateX(50%)}}@media(prefers-reduced-motion:reduce){.loader-mirror i{animation:none}}

html.try-open{overflow:hidden}.personal-try{padding:0;border:1px solid #c8b48c;border-radius:24px;background:#f6f0e7;color:#302116;width:min(900px,calc(100% - 24px));height:min(880px,calc(100svh - 32px));max-height:calc(100svh - 32px);overflow:hidden;box-shadow:0 30px 100px #0006}.personal-try::backdrop{background:#17110ec9;backdrop-filter:blur(8px)}.personal-head{height:64px;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid #c8b48c55;direction:rtl}.personal-head button{width:42px;height:42px;border:1px solid #b9975b;border-radius:50%;font:inherit;font-size:25px;cursor:pointer;background:transparent;color:inherit}.personal-try iframe{display:block;width:100%;height:calc(100% - 64px);border:0;background:#f6f0e7}@media(max-width:600px){.personal-try{width:calc(100% - 12px);height:calc(100svh - 12px);max-height:calc(100svh - 12px);border-radius:18px}}

.site-header .btn{max-width:280px;white-space:normal;text-align:center;line-height:1.6}@media(max-width:600px){.site-header .btn{max-width:185px;font-size:10px;padding:8px 14px;min-height:44px}}


/* ---------- lead form (sends to the owner's bot chat via /api/inquiry) ---------- */
.path--form{gap:16px}
.path--form>p{max-width:560px}
.lf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%}
.lf-field{display:grid;gap:6px;width:100%}
.lf-field label,.lf-hp label{font-size:14px;font-weight:700;color:var(--ivory)}
.lf-field input,.lf-field textarea{width:100%;min-height:48px;padding:10px 14px;border-radius:var(--r-control);border:1px solid #A98F7A;background:#160D07;color:var(--ivory);font:inherit;font-size:16px;line-height:1.6}
.lf-field textarea{min-height:72px;resize:vertical}
.lf-field input:focus-visible,.lf-field textarea:focus-visible{outline:3px solid var(--focus-dark);outline-offset:2px;border-color:var(--focus-dark)}
.lf-field input[aria-invalid="true"]{border-color:#F2B8BE}
.lf-hp{position:absolute;inset-inline-start:-9999px;width:1px;height:1px;overflow:hidden}
.lf-check{display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--ivory-2);cursor:pointer;line-height:1.8}
.lf-check input{flex:0 0 24px;width:24px;height:24px;margin:2px 0 0;accent-color:#D6BE8C}
.lf-err{min-height:1.6em;margin:0;font-size:15px;font-weight:700;color:#F2B8BE}
.lf-done{margin:0;padding:16px 18px;border-radius:var(--r-control);border:1px solid #BFE3C8;background:rgba(191,227,200,.08);color:#BFE3C8;font-weight:700;line-height:1.9}
.path--form .btn[disabled]{opacity:.6;cursor:progress}
@media (max-width:640px){.lf-grid{grid-template-columns:1fr}}
#lf-send[hidden]{display:none}
.lf-resend{margin-top:8px;background:none;border:0;padding:6px 0;font:inherit;font-size:.85rem;color:var(--brass,#B9975B);text-decoration:underline;cursor:pointer;min-height:44px}
.lf-resend:disabled{color:inherit;opacity:.55;text-decoration:none;cursor:default}
#lf-code{letter-spacing:.4em;text-align:center;font-variant-numeric:tabular-nums}


/* ---------- Free trial section: live mockup + form ---------- */
.trial{background:var(--canvas)}
.trial-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(32px,6vw,80px);align-items:start}
.trial .sec-head{margin-bottom:24px}
.trial .path--form{background:var(--espresso);color:var(--cream);border-color:var(--line-dark)}
.trial .path--form h3{color:var(--ivory)}
.trial .path--form .btn{background:var(--cream);color:var(--espresso);border-color:var(--brass-soft)}
.trial-mock{position:sticky;top:calc(var(--hh,76px) + 24px);display:grid;gap:14px;justify-items:center}
.brand-pick{display:flex;align-items:center;gap:10px;width:min(340px,100%)}
.bp-label{font-size:14px;font-weight:700;color:var(--muted);margin-inline-end:auto}
.brand-pick button{width:44px;height:44px;padding:0;border-radius:50%;border:1px solid var(--line-control);background:var(--surface);cursor:pointer;display:grid;place-items:center}
.brand-pick button i{display:block;width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.brand-pick button[aria-checked="true"]{box-shadow:0 0 0 3px var(--canvas),0 0 0 4.5px var(--brass-text)}
.salon-card{width:min(340px,100%);border-radius:28px;overflow:hidden;background:var(--surface);border:1px solid var(--line-decor);box-shadow:0 30px 60px rgba(60,40,18,.18);--brand:#B9975B}
.sc-cover{height:110px;background:linear-gradient(135deg,var(--brand),color-mix(in srgb,var(--brand) 55%,#160D07));transition:background 320ms var(--ease)}
.sc-head{display:flex;align-items:center;gap:12px;padding:0 18px;margin-top:-26px}
.sc-logo{display:grid;place-items:center;width:56px;height:56px;flex:0 0 56px;border-radius:50%;background:var(--surface);border:3px solid var(--surface);box-shadow:0 6px 16px rgba(0,0,0,.2);color:var(--brand);font-size:24px;font-weight:800;transition:color 320ms var(--ease)}
.sc-head>div{min-width:0;padding-top:26px}
.sc-head strong{display:block;font-size:17px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.sc-head small{display:block;font-size:12.5px;color:var(--muted);line-height:1.5}
.sc-lines{display:flex;gap:8px;padding:14px 18px 6px}
.sc-lines li{padding:2px 14px;min-height:32px;display:inline-flex;align-items:center;border-radius:var(--r-pill);border:1px solid var(--line-decor);font-size:13px;font-weight:700;color:var(--muted)}
.sc-lines li.on{background:var(--brand);border-color:var(--brand);color:#fff;transition:background 320ms var(--ease)}
.sc-works{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px 18px}
.sc-works img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px;display:block}
.sc-cta{margin:8px 18px 18px;padding:12px 14px;border-radius:var(--r-pill);background:var(--brand);color:#fff;text-align:center;font-size:13.5px;font-weight:700;transition:background 320ms var(--ease)}
.mock-note{font-size:13px;color:var(--muted);text-align:center;max-width:340px}
@media (max-width:900px){.trial-grid{grid-template-columns:1fr}.trial-mock{position:static;order:-1}}

@media (max-width:900px){.trial-mock{order:2}.trial-col{order:1}}
@media (max-width:900px){.site-footer{padding-bottom:88px}}
.salon-builder{background:#f0e7da}
.builder-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(20px,4vw,54px);align-items:start}
.builder-form,.builder-preview,.builder-dialog{min-width:0;background:#fcf7ef;border:1px solid #d7c2a4;border-radius:23px;padding:clamp(14px,2.5vw,28px);box-shadow:0 14px 42px #52341818}
.builder-form fieldset{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));min-width:0;gap:12px;border:0;padding:0;margin:0 0 16px}
.builder-form legend{font-weight:800;margin-bottom:12px}
.builder-form label,.builder-dialog label{display:grid;gap:5px;font-size:14px;font-weight:700;min-width:0}
.builder-form .wide{grid-column:1/-1}
.builder-form input,.builder-form select,.builder-form textarea,.builder-dialog input{max-width:100%;min-width:0;width:100%;min-height:42px;padding:8px;border:1px solid #aa957a;border-radius:9px;background:#fffdf8;color:#2a1c12;font:inherit}
.builder-form input[type=color]{max-width:80px;padding:4px}
.builder-form input[type=file]{font-size:12px;padding:4px}
.builder-form details{margin:12px 0;border:1px solid #d7c2a4;border-radius:12px;padding:12px}
.builder-form summary{cursor:pointer;font-weight:800}
.builder-form details[open] summary{margin-bottom:14px}
.builder-form .builder-work{border-bottom:1px solid #dbc9af;padding-bottom:12px}
.builder-preview{position:sticky;top:88px;display:grid;gap:12px;overflow:hidden;scroll-margin-top:8px}
.builder-browser{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:11px;color:#795a37}
.builder-browser b{overflow-wrap:anywhere}
.builder-preview iframe{width:100%;height:clamp(400px,61vh,650px);border:1px solid #d7c2a4;border-radius:13px;background:#faf6ec}
.builder-loading{position:absolute;inset:0;background:#f9f1e9f5;display:grid;place-content:center;justify-items:center;gap:18px;padding:20px;text-align:center;font-weight:800}
.builder-spinner{width:58px;height:68px;border:2px solid #dac19e;border-top-color:#8d5d29;border-radius:50% 50% 20% 20%;animation:builder-pulse 1s ease-in-out infinite alternate}
@keyframes builder-pulse{to{transform:scale(.88);filter:drop-shadow(0 0 9px #c49a58)}}
.builder-note{font-size:13px;color:#66523d;margin-top:6px}
.builder-error{font-size:14px;color:#932d26;font-weight:700}
.builder-dialog{width:min(460px,calc(100% - 32px));max-height:85vh;color:var(--ink);font:inherit}
.builder-dialog::backdrop{background:#23190f99;backdrop-filter:blur(3px)}
.builder-dialog h2{font-size:24px;margin-bottom:14px;padding-inline-end:30px}
.builder-dialog form{display:grid;gap:10px}
.builder-close{position:absolute;inset-block-start:12px;inset-inline-end:12px;border:0;background:transparent;font-size:30px;line-height:1;cursor:pointer}
.builder-form .btn,.builder-preview .btn,.builder-dialog .btn{white-space:normal;text-align:center;padding:8px 16px;max-width:100%}
.builder-form .btn--lg,.builder-preview .btn--lg{font-size:16px}
.builder-dialog [hidden],.builder-preview [hidden]{display:none!important}
@media(max-width:850px){.builder-grid{grid-template-columns:1fr}.builder-preview{position:relative;top:auto}}
@media(prefers-reduced-motion:reduce){.builder-spinner{animation:none}}
.builder-form .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.salon-builder{background:radial-gradient(ellipse at 20% 5%,#fff9ef 0%,transparent 60%),#eee2d4}
.builder-grid{grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr);gap:clamp(16px,3.6vw,44px)}
.builder-form{background:#fffaf4;border-color:#d6bea2}
.builder-preview{padding:12px;background:#2b2017;border-color:#a78052;box-shadow:0 18px 54px #492d2240}
.builder-browser{min-height:28px;color:#f3e4ce;padding:0 5px}
.live-badge{display:inline-flex;gap:7px;align-items:center;border-radius:50px;background:#473527;padding:3px 10px}
.live-badge::before{content:'';width:6px;height:6px;background:#e3c17d;border-radius:100%;box-shadow:0 0 8px #e3c17d}
.builder-live{--salon-brand:#b9975b;background:#fffaf2;border-radius:16px;overflow:auto;max-height:min(63vh,580px);scrollbar-color:#c6a77e #fbf1e5}
.live-cover{height:clamp(76px,13vw,142px);position:relative;background:linear-gradient(120deg,#241912,color-mix(in srgb,var(--salon-brand) 60%,#3b2518));color:#fff7e5}
.live-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.live-cover>span{position:absolute;top:10px;inset-inline-start:12px;font-size:11px;background:#21170db8;padding:3px 9px;border-radius:30px}
.live-salon{padding:0 clamp(12px,3vw,30px) 16px;display:grid;gap:6px}
.live-logo{width:52px;height:52px;display:grid;place-items:center;position:relative;margin-top:-26px;border:3px solid #fffaf2;border-radius:50%;overflow:hidden;background:var(--salon-brand);color:#211509;font-weight:800}
.live-logo img,.live-manager img{width:100%;height:100%;object-fit:cover}
.live-kicker{font-size:11px;color:#795735;font-weight:700}
.live-salon h3{font-size:clamp(19px,3vw,30px);overflow-wrap:anywhere}
.live-salon p{font-size:13px;overflow-wrap:anywhere;color:#604a39}
.live-chips,.live-services,.live-links{display:flex;flex-wrap:wrap;gap:5px}
.live-chips span,.live-services span,.live-links span{padding:2px 7px;background:#f2e7d9;border-radius:7px;font-size:11px;overflow-wrap:anywhere}
.live-try{justify-self:start;background:color-mix(in srgb,var(--salon-brand) 40%,#160c06);color:#fff8ed;border-radius:25px;padding:3px 12px;font-size:11px}
.live-services{margin-block:5px}.live-services span:first-child{background:color-mix(in srgb,var(--salon-brand) 36%,#fbefdc)}
.live-detail{border-top:1px solid #e8d8c5;padding-top:7px}
.live-detail h4{margin:0 0 5px;font-size:13px}
.live-manager{display:flex;gap:6px;align-items:center;font-size:12px}
.live-manager img{width:30px;height:30px;border-radius:50%}
.live-works{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.live-works article{display:grid;gap:3px;overflow-wrap:anywhere;min-width:0;background:#f5ebdf;padding:5px;border-radius:8px;font-size:12px}
.live-works img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px}
.builder-preview>.builder-note{color:#f2e4cc}.builder-preview>.btn{background:#f7d89f;color:#26180e}
@media(max-width:850px){.builder-grid{grid-template-columns:1fr}.builder-preview{grid-row:1;position:sticky;top:var(--hh,68px);z-index:6;padding:7px;gap:6px}.builder-live{max-height:31svh}.live-cover{height:54px}.live-logo{width:37px;height:37px;margin-top:-18px}.live-salon{gap:3px}.live-salon p,.live-chips span,.live-services span{font-size:11px}.builder-form{scroll-margin-top:36svh}.builder-preview>.btn{min-height:38px;padding:4px 10px;font-size:13px}}
@media(max-width:480px){.builder-form fieldset{grid-template-columns:1fr}}

/* CTA bands, sticky mobile CTA, plan buttons, form microcopy */
.cta-band{padding:clamp(40px,6vw,72px) var(--gut);background:var(--espresso);color:var(--cream)}
.cta-band--final{background:var(--espresso-2)}
.cta-band__in{max-width:760px;margin:0 auto;text-align:center;display:grid;gap:14px;justify-items:center}
.cta-band h2{margin:0;font-size:clamp(24px,3.2vw,38px);line-height:1.6;font-weight:800;text-wrap:balance}
.cta-band p{margin:0;color:var(--ivory-2);font-size:18px;line-height:1.9;max-width:56ch}
.cta-band .btn{margin-top:6px;background:var(--cream);color:var(--espresso)}
.plan-cta{margin-top:16px;width:100%}
.lf-micro{margin:8px 0 0;font-size:13.5px;color:var(--ivory-2);text-align:center}
.lf-plan{margin:0 0 10px;font-size:14px;font-weight:700;color:var(--brass-soft)}
.lf-field .opt{font-weight:500;opacity:.7;font-size:.9em}
.sticky-cta{position:fixed;inset-inline:max(16px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:35;display:none;align-items:center;justify-content:center;gap:10px;min-height:52px;border-radius:var(--r-pill);background:var(--espresso);color:var(--cream);font-weight:800;font-size:17px;box-shadow:0 14px 34px rgba(22,13,7,.4);border:1.5px solid var(--brass)}
.sticky-cta.show{display:flex}
@media (min-width:901px){.sticky-cta{display:none!important}}
@media (prefers-reduced-motion:no-preference){.sticky-cta.show{animation:rise 400ms var(--ease) both}}
/* section reveals (added by reveal.js only to content below the first screen) */
.rv{opacity:0;transform:translateY(28px);transition:opacity 700ms var(--ease),transform 800ms var(--ease)}
.rv.in{opacity:1;transform:none}
/* cinematic layer (reveal.js) */
.scroll-line{position:fixed;top:env(safe-area-inset-top,0px);inset-inline:0;height:2px;z-index:40;background:linear-gradient(90deg,#8E6A3A,#E2C88F,#B9975B);transform-origin:100% 50%;transform:scaleX(0);pointer-events:none}
.site-header{transition:padding 360ms var(--ease),box-shadow 360ms var(--ease),background-color 360ms var(--ease)}
.site-header.is-tight{padding-block:8px;box-shadow:0 10px 30px -18px rgba(40,26,12,.45)}
.site-header .nav a[aria-current]{border-color:var(--brass)}
.wipe{clip-path:inset(0 0 100% 0);transform:translateY(.35em);transition:clip-path 1000ms var(--ease),transform 1000ms var(--ease)}
.wipe.in{clip-path:inset(0 0 -.2em 0);transform:none}
.s2-demo img,.trial-mock img,.svc .ico{will-change:transform}
@media (prefers-reduced-motion:reduce){.site-header{transition:none}}
/* The mobile action lives in its own safe-area-aware strip. */
.lead-wrap{max-width:680px}
#studio{scroll-margin-top:0}
.service-preview-link{display:inline-flex;margin-top:20px}
@media (max-width:900px){
 html{scroll-padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}
 body:has(.sticky-cta:not([hidden])){padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))}
 .sticky-cta:not([hidden]){display:flex;inset-inline:0;bottom:0;padding:8px 16px calc(8px + env(safe-area-inset-bottom,0px));border:0;border-top:1px solid rgba(185,151,91,.35);border-radius:0;background:#f7efe4;box-shadow:0 -8px 22px rgba(22,13,7,.13);color:var(--espresso);font-size:15px;line-height:1.4;white-space:nowrap;min-height:52px}
 .sticky-cta:focus-visible{outline-offset:-4px}
 .trial-grid>.sec-head{margin-bottom:0}
}

/* AYNEH / brass, ivory and arched reflections. Shared presentation finishing. */
.brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none}.brand-symbol{display:inline-flex;width:45px;height:48px;color:#a47b39;flex:none}.brand-symbol svg{width:100%;height:100%}.brand-name{display:flex;flex-direction:column;align-items:center;line-height:1.2}.brand .brand-name small{font-size:10px;letter-spacing:.24em;direction:ltr;margin:5px 0 0;opacity:.65}.foot .brand-symbol{color:#d6b473}.loader-brand svg{width:55px;height:65px;color:#a47b39}
.nav-btn,.cinema-arrows button{direction:ltr;unicode-bidi:isolate}.nav-btn svg,.cinema-arrows svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;transform:none}
/* A right chevron lives at the physical right edge; a left one at the left. */
.cinema-arrows{inset:0;display:block;pointer-events:none;z-index:7}.cinema-arrows button{position:absolute;top:50%;transform:translateY(-50%);pointer-events:auto;width:48px;height:48px;background:#211811b8;backdrop-filter:blur(8px);display:grid;place-items:center;transition:background .2s,border-color .2s,box-shadow .2s}
.cinema-arrows [data-slide-prev]{right:24px;left:auto}.cinema-arrows [data-slide-next]{left:24px;right:auto}.cinema-arrows button:hover{background:#3c2d1d;border-color:#d7b975;box-shadow:0 0 25px #d7b97520}
.btn.orbit-cta{position:relative;isolation:isolate;overflow:hidden;border-color:#b9975b80;box-shadow:0 5px 20px #0002;transition:background .22s,box-shadow .22s,transform .22s}
.btn.orbit-cta:hover{transform:translateY(-2px);box-shadow:0 9px 25px #b9975b30}.btn.orbit-cta:focus-visible,.nav-btn:focus-visible,.cinema-arrows button:focus-visible{outline:2px solid #d8b878;outline-offset:4px}
.cta-ring{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}.cta-ring rect{x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px);rx:28px;fill:none;stroke:#f8d98c;stroke-width:1.35;stroke-dasharray:14 86;animation:gold-orbit 5s linear infinite;filter:drop-shadow(0 0 3px #d8b36d80)}
.journey-actions{display:flex;flex-direction:column;gap:10px;margin-top:22px}.journey-copy .journey-actions .btn{display:inline-flex;justify-content:center;align-items:center;gap:18px;min-height:50px;width:100%;padding:12px 18px;border:1px solid #c8a86b88;border-radius:999px;background:#1a120d;color:#fff1d8;font:inherit;font-size:13px;font-weight:700;text-decoration:none;text-shadow:none;line-height:1.7}.journey-copy .journey-actions a span{margin:0}.journey-copy .journey-actions .salon-action{align-self:center;display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:44px;color:#edd5a4;font-size:11px;line-height:1.8;text-decoration:none;text-shadow:none;border-bottom:1px solid #c8a86b45;transition:color .2s,border-color .2s}.journey-copy .journey-actions .salon-action:hover{color:#fff3d9;border-color:#e2c180}
/* All autoplay film cards share the same hierarchy and dimensions. */
.auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{display:block;top:auto;bottom:80px;right:6%;left:auto;width:33%;max-width:400px;padding:26px;border:1px solid #d3b67e45;border-radius:20px;background:linear-gradient(140deg,#21170fe8,#21170fc9);backdrop-filter:blur(12px);box-shadow:0 20px 60px #0003}
.auto-film .journey-copy h3,.auto-film .journey-copy[data-journey-copy=lashes] h3{font-size:clamp(26px,2.6vw,38px);margin:0 0 16px;line-height:1.6}.auto-film .journey-copy[data-journey-copy=lashes] h3 br{display:initial}.auto-film .journey-copy[data-journey-copy=lashes] .journey-kicker{margin:0 0 12px}.auto-film .journey-copy[data-journey-copy=lashes]>p:not(.journey-kicker){font-size:14px;margin:0 0 15px;max-width:35ch}.auto-film .journey-copy[data-journey-copy=lashes] a{margin-top:0}
.salon-invite{padding:clamp(40px,7vw,100px) clamp(20px,6vw,90px);background:radial-gradient(ellipse at 75% 50%,#39291b60,transparent 65%),#17120e;color:#f8efe3;position:relative;isolation:isolate}.salon-invite-card{max-width:1180px;margin:auto;display:grid;grid-template-columns:1fr 1fr;direction:ltr;border:1px solid #b9975b66;border-radius:28px;overflow:hidden;background:linear-gradient(130deg,#38281c,#21180f);box-shadow:0 24px 65px #0003}.salon-invite-art{position:relative;min-height:460px;overflow:hidden}.salon-invite-art>img{display:block;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:46% center;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}.salon-invite-art:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#17110ebb,transparent 65%);pointer-events:none}.salon-invite-card:hover .salon-invite-art>img{transform:scale(1.035)}.invite-seal{position:absolute;bottom:28px;left:28px;z-index:1;display:flex;align-items:center;gap:14px;direction:rtl;color:#f0d5a2;line-height:1.8;font-size:14px}.invite-seal svg{width:47px;height:53px;flex:none}.salon-invite-copy{direction:rtl;align-self:center;padding:clamp(28px,4vw,60px)}.salon-invite-copy h2{font-size:clamp(32px,3.7vw,54px);line-height:1.6;margin:0 0 18px;color:#fff1da;letter-spacing:-.035em}.salon-invite-copy>p:not(.journey-kicker){font-size:16px;line-height:2;margin:0 0 16px}.salon-invite-copy>p.invite-detail{font-size:13px;color:#cfbda5}.salon-invite-copy .btn{width:100%;margin-top:14px;text-align:center;justify-content:center;line-height:1.8;white-space:normal}
.type-wrap{position:relative}.type-reserve{display:block;visibility:hidden;pointer-events:none}.type-live{position:absolute;inset:0;display:block}.type-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.type-live.is-typing:after{content:"";display:inline-block;height:.85em;border-left:1px solid #e7c88e;margin-right:3px;vertical-align:-.05em;animation:typingCaret .7s steps(1) infinite}@keyframes typingCaret{50%{opacity:0}}
.svc,.feat li,.faq details,.phone{transition:border-color .25s,box-shadow .25s,background .25s}.svc:hover,.feat li:hover,.faq details[open]{border-color:#b9975b70;box-shadow:0 14px 34px #30201412}.faq details[open] summary{color:#936b2f}.s2-points li{transition:border-color .25s,transform .25s}.s2-points li:hover{border-color:#d5b06c;transform:translateX(-3px)}.salon-invite-card.rv{transition:opacity .7s,transform .7s}
@media(max-width:900px){.auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{width:40%;right:5%;padding:22px}.salon-invite-card{grid-template-columns:1fr}.salon-invite-art{min-height:320px}.salon-invite-copy{padding:30px}.salon-invite-copy h2 br{display:none}.salon-invite-copy h2{font-size:34px}.salon-invite-copy .btn{max-width:420px}}
@media(max-width:600px){.brand{gap:6px}.brand-symbol{width:31px;height:35px}.brand .brand-name small{font-size:8px;margin-top:3px}.brand-name{font-size:20px}.cinema-arrows button{width:40px;height:40px}.cinema-arrows [data-slide-prev]{right:10px}.cinema-arrows [data-slide-next]{left:10px}.cinema-copy,.is-current .cinema-copy{right:62px;left:62px;width:auto;max-width:none}.auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{position:relative;inset:auto;width:auto;max-width:none;margin:18px 18px 0;padding:22px;border-radius:18px}.auto-film .journey-copy h3,.auto-film .journey-copy[data-journey-copy=lashes] h3{font-size:25px}.salon-invite{padding:38px 18px}.salon-invite-card{border-radius:22px}.salon-invite-art{min-height:260px}.salon-invite-copy{padding:25px}.salon-invite-copy h2{font-size:30px}.salon-invite-copy>p:not(.journey-kicker){font-size:14px}.salon-invite-copy .btn{font-size:12px}.journey-copy .journey-actions .btn{font-size:12px}}
@media(prefers-reduced-motion:reduce){.cta-ring rect{animation:none;stroke-dasharray:none;opacity:.5}.type-live:after{animation:none}.salon-invite-card:hover .salon-invite-art>img,.btn.orbit-cta:hover,.s2-points li:hover{transform:none}.svc,.feat li,.faq details,.phone{transition:none}}

@media(max-width:600px){.rail-wrap .nav-btn{display:grid;width:36px;height:36px;margin-top:0}.rail-wrap .nav-r{right:6px}.rail-wrap .nav-l{left:6px}}

/* Long Persian actions must wrap inside their grid column on small screens. */
.btn.orbit-cta{max-width:100%;min-width:0;white-space:normal;text-align:center;line-height:1.8}.btn.orbit-cta>span:first-child{min-width:0}.s2-grid>*{min-width:0}.cta-ring rect{rx:999px;ry:999px}.film{overflow-x:clip}.demo-file:not(.visible){display:none}
.btn.orbit-cta{overflow:visible}
.cta-ring{inset:-5px;width:calc(100% + 10px);height:calc(100% + 10px)}
.cta-ring rect{stroke:#fff0ae;stroke-width:1.8;filter:drop-shadow(0 0 2px #fff3a9) drop-shadow(0 0 5px #ffa526)}
.benefits-five{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px}
.benefits-five .benefit{padding:clamp(14px,2vw,24px);gap:10px}
.benefit h3{font-size:clamp(16px,1.55vw,21px)}
.benefit p{font-size:14px}
.gold-icon{display:grid;place-items:center;width:60px;height:60px;border-radius:19px;background:radial-gradient(at 20% 10%,#fff2cb,#d2a567 53%,#755028 100%);border:1px solid #ab814a;box-shadow:inset 0 2px 2px #fff7dc,inset 0 -4px 4px #5232156e,0 7px 14px #55341036}
.gold-icon svg{width:39px;height:39px;fill:none;stroke:#fff1ba;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 0 #4c2a0e)}
.gold-icon .gold-icon-depth{stroke:#79512c;stroke-width:3.5;transform:translateY(2px)}
.svc-try{margin-top:auto;align-self:flex-start}
.service-timeline{display:flex;justify-content:center;gap:clamp(4px,3vw,36px);padding:18px 12px;border-bottom:1px solid #ae8b513f}
.service-timeline a{display:grid;justify-items:center;gap:5px;min-width:0;text-align:center;color:#e6d2ad;font-size:clamp(11px,2.7vw,15px);padding:6px 9px}
.service-timeline a span{border:1px solid #c4a57577;border-radius:50%;width:31px;height:31px;display:grid;place-items:center}
.service-timeline a[aria-current] span,.service-timeline a:hover span{background:#efd599;color:#26170d}
@media(max-width:1100px){.benefits-five{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:580px){.benefits-five{grid-template-columns:repeat(2,minmax(0,1fr))}.benefits-five .benefit:last-child{grid-column:1/-1}}
.film-player{max-width:1100px;margin:auto;display:grid;gap:16px;padding:20px clamp(12px,4vw,44px) 34px}
.service-journey{background:#17120e}
.film-player .service-timeline{display:flex;justify-content:center;gap:clamp(12px,4vw,54px);border:0;padding:0}
.service-timeline button{appearance:none;border:0;background:transparent;color:#d2ba91;display:grid;justify-items:center;gap:8px;cursor:pointer;font:inherit;font-size:13px;line-height:1.35;text-align:center;padding:8px;min-width:56px}
.service-timeline button[aria-pressed=true]{color:#fff1d4}
.film-icon{position:relative;isolation:isolate;width:48px;height:48px;display:grid;place-items:center;border-radius:50%;border:1px solid #b9975b77;background:#2b2119}
.film-icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.service-timeline button[aria-pressed=true] .film-icon{background:#533a24;border-color:#f4cc84}
.is-playing button[aria-pressed=true] .film-icon::after{content:'';position:absolute;inset:-5px;border:2px solid transparent;border-inline-start-color:#ffdf93;border-top-color:#fff1ba;border-radius:50%;filter:drop-shadow(0 0 4px #ffb44b);animation:film-orbit 1.5s linear infinite}
@keyframes film-orbit{to{transform:rotate(360deg)}}
.film-screen{min-width:0;border:1px solid #8e714748;border-radius:20px;overflow:hidden;background:#241b14}
.service-video{width:100%;display:block;aspect-ratio:16/9;object-fit:contain;background:#0d0a08}
.film-caption{display:grid;gap:3px;padding:14px clamp(14px,3vw,26px);color:#f9e9cc}
.film-caption span{color:#d3b580;font-size:11px}.film-caption strong{font-size:19px}.film-caption p{font-size:14px;color:#e3d1b5}
@media(max-width:640px){.film-player{grid-template-columns:63px minmax(0,1fr);gap:8px;align-items:start;padding-inline:8px}.film-player .service-timeline{flex-direction:column;gap:3px}.service-timeline button{font-size:10px;min-width:0;padding:5px 2px;gap:5px}.film-icon{width:36px;height:36px}.film-icon svg{width:23px;height:23px}.film-screen{border-radius:14px}}
@media(prefers-reduced-motion:reduce){.is-playing button[aria-pressed=true] .film-icon::after{animation:none}}

.compare{margin-top:0}
@media (max-width:1100px){.selection{padding-top:56px}.compare{margin:0 auto}}
</style>
</head>
<body>
<a class="skip" href="#main">رفتن به محتوای اصلی</a>

<header class="site-header">
  <a class="brand" href="#intro" aria-label="آینه، بازگشت به ابتدای صفحه"><span class="brand-symbol"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><span class="brand-name">آینه<small>AYNEH</small></span></a>
  <nav class="nav" aria-label="ناوبری اصلی">
    <a href="#studio">تجربه آینه</a>
    <a href="#how">مزایا</a>
    <a href="#services">خدمات</a>
    <a href="#salon-example">نمونهٔ صفحهٔ سالن</a>
    <a href="#faq">پرسش‌ها</a>
  </nav>
  <div class="header-actions">
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="باز کردن فهرست">
      <span class="menu-bars" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="فهرست موبایل" hidden>
    <p class="menu-kicker">فهرست آینه</p>
    <a class="menu-link" href="#studio"><span>تجربه آینه</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#how"><span>مزایا</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#services"><span>خدمات مو، ناخن و مژه</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#salon-example"><span>نمونهٔ صفحهٔ سالن</span><span aria-hidden="true">↙</span></a>

    <a class="menu-link" href="#faq"><span>پرسش‌ها</span><span aria-hidden="true">↙</span></a>
  </nav>
</header>

<main id="main">
<noscript><style>.site-loader{display:none!important}html.hero-loading{overflow:auto}</style></noscript>
<div id="siteLoader" class="site-loader" role="status" aria-label="آماده‌سازی آینه"><div class="loader-mirror"><span class="loader-brand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><i></i></div><p>انتخابی که به شما می‌آید.</p><div class="loader-track"><i id="loaderProgress"></i></div></div>
  <!-- 1. Hero: copy + the mirror studio. The photo, hair canvas and podium dock live on one plate so they never drift apart. -->
  <section id="intro" class="film" aria-labelledby="h1" tabindex="-1">
    <div class="stage" id="stage" data-demo="loading">
      <div class="copy" id="copy">
        <p class="eyebrow reveal">برای صاحبان سالن مو، ناخن و مژه</p>
        <h1 id="h1" class="reveal">مشتری قبل از نشستن روی صندلی می‌داند چه می‌خواهد.</h1>
        <p class="lead reveal">مدل مو، رنگ، ناخن یا مژه را روی عکس خودش امتحان می‌کند و انتخابش را مستقیم به تلگرام یا بله شما می‌فرستد. شما فقط درخواست را می‌بینید و جواب می‌دهید.</p>
        <div class="cta-row reveal"><a class="btn btn--lg" href="#start"><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a><a class="btn btn--ghost" href="#studio" id="openHeroDemo"><span>اول آینه را امتحان کنید</span></a></div>
        <p class="fineprint reveal">همین پایین، مدل و رنگ را روی چهرهٔ نمونه عوض کنید.</p>
      </div>

      <div class="studio" id="studio" tabindex="-1" aria-label="دموی تعاملی آینه روی چهرهٔ نمونه">
        <div class="mirror" id="mirror">
          <div class="plate" id="plate">
            <img class="room-backdrop" src="/landing/hero.webp" width="1376" height="768" alt="" aria-hidden="true">
            <svg class="empty-glass" viewBox="0 0 1376 768" aria-hidden="true"><defs><linearGradient id="mirrorGlass" x2=".7" y2="1"><stop stop-color="#A99C83"/><stop offset=".5" stop-color="#C6BAA3"/><stop offset="1" stop-color="#A99D86"/></linearGradient></defs><path fill="url(#mirrorGlass)" d="M605 471V240C605 137 761 137 761 240V471Z M506 455V272C506 193 585 193 585 272V455Z M782 455V272C782 193 863 193 863 272V455Z"/></svg>
            <div class="mirror-front" id="mirrorFront">
            <img id="roomImg" fetchpriority="high" decoding="async" src="/landing/hero.webp" width="1376" height="768" alt="آینهٔ سه‌تکهٔ برنجی با تصویر یک مدل در آن، روی پایه‌ای از سنگ">
            <img id="roomImg2" class="alt" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" aria-hidden="true" width="1376" height="768">
            <canvas id="hairCanvas" width="1376" height="768" aria-hidden="true"></canvas>
            </div>
            <div class="mirror-invite" id="mirrorInvite" inert>
              <span class="invite-mark" aria-hidden="true">✦</span><p>این بار،<br>تصویر خودتان.</p>
              <a class="btn" data-try="hair" href="/s/demo?l=hair">با عکس خودتان امتحان کنید <span aria-hidden="true">←</span></a>
              <button type="button" id="backToMirror">بازگشت به آینه</button>
            </div>
            <div class="dock glass" id="dock">
              <h2 id="dock-h">مدل مو · روی این چهره امتحان کنید</h2>
              <div class="dock-view">
                <div class="dock-track hscroll" id="dockTrack" role="radiogroup" aria-labelledby="dock-h"></div>
                <button type="button" class="nav-btn nav-r" id="dkPrev" aria-label="مدل‌های قبلی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
                <button type="button" class="nav-btn nav-l" id="dkNext" aria-label="مدل‌های بعدی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
              </div>
              <button type="button" class="more" id="more" aria-expanded="false" aria-controls="styles"><span>دیدن همهٔ مدل‌ها</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5"/></svg></button>
            </div>
          </div>
          <div class="palette glass" id="colors">
            <h2 id="colors-h">رنگ مو</h2>
            <div class="col-list" id="colList" role="radiogroup" aria-labelledby="colors-h"></div>
          </div>
          <aside class="reference glass" id="ref" aria-live="polite">
            <span class="ph"><img id="refImg" alt="" width="240" height="300"></span>
            <div class="ref-body">
              <strong id="refName"></strong>
              <small id="refNote"></small>
              <a class="ref-try" data-try="hair" href="/s/demo?l=hair">امتحان روی عکس خودم ←</a>
            </div>
          </aside>
          <div class="result glass" id="result" role="status" aria-live="polite">
            <span id="resultText"></span>
            <a class="btn" data-try="hair" href="/s/demo?l=hair"><span>همین الان با عکس خودم بساز</span><span class="arrow" aria-hidden="true">←</span></a>
          </div>
        </div>
      </div>

      <div class="styles" id="styles" aria-hidden="true">
        <div class="styles-head">
          <h2 id="styles-h">مدل مو <span id="styCount"></span></h2>
          <button type="button" class="close" id="closeRail"><span>بستن</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12.5 10 7.5 15 12.5"/></svg></button>
        </div>
        <div class="rail-wrap">
          <div class="track hscroll" id="track" role="radiogroup" aria-labelledby="styles-h"></div>
          <button type="button" class="nav-btn nav-r" id="stPrev" aria-label="مدل‌های قبلی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button>
          <button type="button" class="nav-btn nav-l" id="stNext" aria-label="مدل‌های بعدی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button>
        </div>
      </div>
      <div class="demo-file" id="demoFile" aria-hidden="true"><img src="/landing/hero.webp" alt=""><span>تصویر من.jpg</span></div>
      <svg class="demo-hand" id="demoHand" viewBox="0 0 48 56" aria-hidden="true"><path d="M14 29V9a5 5 0 0 1 10 0v15-5a4 4 0 0 1 8 0v7-4a4 4 0 0 1 8 0v9-3a4 4 0 0 1 8 0v12c0 10-6 17-17 17h-2c-6 0-10-3-14-8L5 35c-4-5 2-11 6-7l7 7" transform="translate(-3,-2)"/></svg>
      <div class="demo-caption" id="demoCaption" role="status" aria-live="polite">نمایش نحوهٔ کار آینه</div>
      <div class="demo-controls"><button type="button" id="skipDemo">رد کردن نمایش</button><button type="button" id="replayDemo" hidden>پخش دوبارهٔ نمایش</button></div>
      <noscript><style>.mirror-front{opacity:1!important}.demo-controls,.demo-caption{display:none}</style></noscript>
      <div class="fade" id="fade" aria-hidden="true"></div>
    </div>
  </section>

  <section id="how" class="section section--sunken" aria-labelledby="h-how" tabindex="-1">
    <div class="wrap"><header class="sec-head"><p class="kicker">چرا آینه برای سالن شما ساخته شده</p><h2 id="h-how">آینه صفحهٔ اختصاصی سالن شماست</h2><p class="sub">مشتری عکس چهره یا دستش را می‌گذارد، مدل و رنگ مو، طرح ناخن یا مژه را روی عکس خودش امتحان می‌کند و انتخابش را با تصویر برای شما می‌فرستد. شما در تلگرام یا بله درخواست را می‌بینید و جواب می‌دهید.</p></header>
    <div class="benefits-five">
      <article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M11 27V15a9 9 0 0 1 18 0v12ZM20 27v6m-6 0h12m-9-14 5-5"/><path d="M11 27V15a9 9 0 0 1 18 0v12ZM20 27v6m-6 0h12m-9-14 5-5"/></svg></span><h3>انتخاب قبل از مراجعه</h3><p>مشتری مدل و رنگ را روی عکس خودش می‌بیند و با انتخاب روشن سراغ سالن می‌آید.</p></article>
      <article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M9 10h22v15H19l-7 6v-6H9Zm6 6h10m-10 4h7"/><path d="M9 10h22v15H19l-7 6v-6H9Zm6 6h10m-10 4h7"/></svg></span><h3>مشاوره با تصویر</h3><p>آرایشگر عکس و مدل انتخاب‌شده را کنار هم می‌بیند و دربارهٔ همان نتیجه با مشتری حرف می‌زند.</p></article>
      <article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M10 8h20v24H10Zm5 17 5-6 4 4 3-3m-11-6h.1"/><path d="M10 8h20v24H10Zm5 17 5-6 4 4 3-3m-11-6h.1"/></svg></span><h3>نمونه‌کار قابل امتحان</h3><p>مشتری از میان کارهای خود سالن انتخاب می‌کند و مدل دلخواهش را روی عکس خودش می‌بیند.</p></article>
      <article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M16 24l8-8m-10 5-4 4a4 4 0 0 0 6 6l4-4m0-14 4-4a4 4 0 0 1 6 6l-4 4"/><path d="M16 24l8-8m-10 5-4 4a4 4 0 0 0 6 6l4-4m0-14 4-4a4 4 0 0 1 6 6l-4 4"/></svg></span><h3>یک لینک با نام سالن</h3><p>لینک صفحه را در بیو اینستاگرام یا دایرکت بگذارید؛ مشتری از همان گوشی وارد می‌شود.</p></article>
      <article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M20 7l11 4v8c0 6-4 10-11 14-7-4-11-8-11-14v-8Zm-5 13 4 4 7-8"/><path d="M20 7l11 4v8c0 6-4 10-11 14-7-4-11-8-11-14v-8Zm-5 13 4 4 7-8"/></svg></span><h3>پاسخ در پیام‌رسان</h3><p>درخواست تصویری به تلگرام یا بله می‌رسد و همان‌جا تأیید یا رد می‌کنید.</p></article>
    </div></div>
  </section>
<section class="salon-invite" aria-labelledby="salon-invite-title">
 <div class="salon-invite-card">
  <div class="salon-invite-art"><img src="/landing/salon-film-05.webp" alt="بررسی انتخاب مشتری در سالن زیبایی" width="1920" height="1080" loading="lazy"><span class="invite-seal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>این تجربه،<br>با نام سالن شما.</span></span></div>
  <div class="salon-invite-copy"><p class="journey-kicker">آینه برای سالن زیبایی شما</p><h2 id="salon-invite-title">صفحهٔ اختصاصی سالن‌تان را بسازید</h2><p>اسم، رنگ برند و نمونه‌کارهایتان را اضافه کنید و ببینید مشتری‌ها صفحهٔ سالن شما را چطور می‌بینند.</p><p class="invite-detail">پیش‌نمایش رایگان است و نیازی به ثبت‌نام ندارد. بعد از دیدن نتیجه، اگر خواستید صفحه را فعال کنید.</p><a class="btn btn--lg" href="#salon-example"><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a></div>
 </div>
</section>

  <section id="services" class="section" aria-labelledby="h-svc" tabindex="-1">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker">مو، ناخن، مژه</p>
        <h2 id="h-svc">مو، ناخن و مژه؛ همه در یک صفحه</h2>
        <p class="sub">مشتری هر خدمت را جداگانه امتحان می‌کند و انتخابش را برای شما می‌فرستد.</p>
      </div>
      <div class="cards3">
        <article class="svc">
          <span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/><path d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/></svg></span>
          <h3>مدل و رنگ مو</h3>
          <p>عکس چهره را بگذارید، مدل یا رنگ را انتخاب کنید و نتیجه را روی همان عکس ببینید.</p>
          <a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon">مشاهدهٔ دمو</a>
        </article>
        <article class="svc">
          <span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/><path d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/></svg></span>
          <h3>طرح ناخن</h3>
          <p>عکس دست را بگذارید و فرم، رنگ و طرح را روی همان دست امتحان کنید.</p>
          <a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon">مشاهدهٔ دمو</a>
        </article>
        <article class="svc">
          <span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/><path d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/></svg></span>
          <h3>مدل مژه</h3>
          <p>عکس چهره یا چشم را بگذارید و حالت، طول و حجم مژه را روی چشم خودتان ببینید.</p>
          <a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon">مشاهدهٔ دمو</a>
        </article>
      </div>
    </div>
  </section>
<section id="transform" class="service-journey on-dark" aria-label="ویدئوهای خدمات آینه">
 <div class="film-player">
  <div class="service-timeline" role="group" aria-label="انتخاب ویدئو">
   <button type="button" data-film="hair" aria-pressed="true"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/></svg></span><span>مدل و رنگ مو</span></button>
   <button type="button" data-film="lashes" aria-pressed="false"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/></svg></span><span>مژه</span></button>
   <button type="button" data-film="nails" aria-pressed="false"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/></svg></span><span>ناخن</span></button>
  </div>
  <div class="film-screen">
   <video id="serviceVideo" class="service-video" muted playsinline controls preload="none" poster="/landing/hair-poster.webp" aria-label="مدل و رنگ مو">
    <source src="/landing/video/hair.mp4" type="video/mp4">
   </video>
   <div class="film-caption" aria-live="polite"><span>خدمات آینه روی چهره واقعی</span><strong id="filmTitle">مدل و رنگ مو</strong><p id="filmError" role="status" hidden></p><p id="filmText">مدل و رنگ‌های مختلف را روی یک چهره ببینید و انتخاب کنید.</p></div>
  </div>
 </div>
</section>

<section id="salon-example" class="section salon-builder" aria-labelledby="h-example" tabindex="-1">
 <div class="wrap">
  <header class="sec-head"><p class="kicker">استودیوی صفحهٔ سالن</p><h2 id="h-example">صفحهٔ سالن‌تان را از چشم مشتری ببینید</h2><p class="sub">نام، رنگ و نمونه‌کارهای سالن را وارد کنید. هر تغییر همان لحظه در نمای مشتری دیده می‌شود.</p></header>
  <div class="builder-grid">
   <form id="start" class="builder-form">
    <fieldset><legend>هویت و نشانی صفحه</legend>
     <label>نام سالن<input name="name" required minlength="2" maxlength="100" autocomplete="organization"></label>
     <label>نشانی اختصاصی پیشنهادی <small dir="ltr">ayneh-salon.site/s/</small><input name="slug" dir="ltr" required pattern="[a-z][a-z0-9\\-]{1,44}[a-z0-9]" maxlength="46" placeholder="my-salon" autocapitalize="none" spellcheck="false"></label>
     <label class="builder-color">رنگ برند<input type="color" name="brand" value="#B9975B"></label>
     <label>لوگو<input type="file" name="logo" accept="image/jpeg,image/png,image/webp"></label>
     <label>عکس کاور<input type="file" name="cover" accept="image/jpeg,image/png,image/webp"></label>
    </fieldset>
    <details><summary>معرفی سالن و راه‌های تماس</summary>
     <fieldset><legend class="sr-only">مشخصات سالن</legend>
      <label class="wide">دربارهٔ سالن<textarea name="bio" maxlength="1000" rows="3"></textarea></label>
      <label>نام مدیر<input name="manager" maxlength="100"></label>
      <label>عکس مدیر<input type="file" name="portrait" accept="image/jpeg,image/png,image/webp"></label>
      <label>تلفن سالن<input type="tel" name="phone" dir="ltr" maxlength="24"></label>
      <label>ساعات کاری<input name="hours" maxlength="150"></label>
      <label class="wide">آدرس<input name="address" maxlength="250"></label>
      <label>لینک نقشه<input type="url" name="map" dir="ltr" maxlength="350"></label>
      <label>لینک اینستاگرام<input type="url" name="instagram" dir="ltr" maxlength="350"></label>
      <label>لینک تلگرام<input type="url" name="telegram" dir="ltr" maxlength="350"></label>
      <label>وب‌سایت<input type="url" name="website" dir="ltr" maxlength="350"></label>
     </fieldset>
    </details>
    <details><summary>نمونه‌کارها <small>تا ۶ مورد</small></summary>
     <div id="builderWorks"></div>
     <button id="builderAdd" class="btn btn--ghost" type="button">افزودن نمونه‌کار +</button>
    </details>
    <p class="builder-error" id="builderError" role="alert"></p>
    <button type="submit" class="btn btn--lg" id="builderBuild">ساخت صفحهٔ اختصاصی سالن من</button>
    <p class="builder-note">پیش‌نمایش خصوصی است. تصاویر بعد از درخواست فعال‌سازی برای کارشناسان آینه ارسال می‌شوند.</p>
   </form>
   <div class="builder-preview" id="builderPreview">
    <div class="builder-browser"><span class="live-badge">پیش‌نمایش زنده</span><b dir="ltr" id="builderAddress">ayneh-salon.site/s/your-salon</b></div>
    <div class="builder-live" id="builderLive" tabindex="0" role="region" aria-label="پیش‌نمایش زندهٔ صفحهٔ سالن">
     <div class="live-cover"><img id="liveCover" alt="" hidden><span>آینهٔ اختصاصی سالن</span></div>
     <div class="live-salon">
      <div class="live-logo"><img id="liveLogo" alt="" hidden><span id="liveInitial">س</span></div>
      <p class="live-kicker">استودیو زیبایی</p><h3 id="liveName">نام سالن شما</h3>
      <p id="liveBio">مدل دلخواهت را روی عکس خودت ببین و انتخابت را برای سالن بفرست.</p>
      <div class="live-chips"><span id="liveAddress" hidden></span><span id="liveHours" hidden></span></div>
      <span class="live-try">شروع با عکس خودم</span>
      <div class="live-services" aria-label="خدمات سالن"><span>مدل مو</span><span>رنگ مو</span><span>ناخن</span><span>مژه</span></div>
      <section class="live-detail" id="liveContact" hidden><h4>دربارهٔ سالن</h4><div class="live-manager"><img id="livePortrait" alt="" hidden><span id="liveManager"></span></div><p id="livePhone" dir="ltr"></p><div class="live-links" id="liveLinks"></div></section>
      <section class="live-detail"><h4>نمونه‌کارهای سالن</h4><div id="liveWorks" class="live-works"></div><p id="liveEmpty">با افزودن نمونه‌کار، عکس و توضیحات آن اینجا دیده می‌شود.</p></section>
     </div>
    </div>
    <div class="builder-loading" id="builderLoading" role="status" hidden><span class="builder-spinner" aria-hidden="true"></span><p>در حال ساخت صفحهٔ اختصاصی سالن شما هستیم. چند لحظه صبر کنید.</p></div>
    <button class="btn btn--lg" id="builderActivate" type="button" hidden>فعال‌سازی صفحهٔ اختصاصی سالن من</button>
    <p class="builder-note" id="builderHint" aria-live="polite"></p>
   </div>
  </div>
 </div>
</section>
<template id="builderWorkTemplate">
 <fieldset class="builder-work">
  <legend>نمونه‌کار</legend>
  <label>عنوان<input data-work="title" required minlength="2" maxlength="100"></label>
  <label>خدمت<select data-work="line"><option value="hair">مدل مو</option><option value="color">رنگ مو</option><option value="nails">ناخن</option><option value="lashes">مژه</option></select></label>
  <label class="wide">عکس<input data-work="file" type="file" required accept="image/jpeg,image/png,image/webp"></label>
  <label class="wide">توضیح کوتاه<textarea data-work="description" rows="2" maxlength="300"></textarea></label>
  <button type="button" class="btn btn--ghost builder-remove">حذف نمونه‌کار</button>
 </fieldset>
</template>
<dialog class="builder-dialog" id="builderDialog" aria-labelledby="builderDialogTitle">
 <button class="builder-close" type="button" aria-label="بستن">×</button>
 <h2 id="builderDialogTitle">تأیید شمارهٔ موبایل</h2>
 <form id="builderPhone">
  <p>برای پیگیری درخواست فعال‌سازی، شمارهٔ موبایل‌تان را تأیید کنید.</p>
  <label>نام<input name="first_name" required minlength="2" maxlength="40" autocomplete="given-name"></label>
  <label>نام خانوادگی<input name="last_name" required minlength="2" maxlength="60" autocomplete="family-name"></label>
  <label>شمارهٔ موبایل<input name="phone" type="tel" required dir="ltr" maxlength="20" autocomplete="tel"></label>
  <button type="submit" class="btn">ارسال کد تأیید</button>
 </form>
 <form id="builderOtp" hidden>
  <label>کد پیامک‌شده<input name="code" required dir="ltr" maxlength="12" inputmode="numeric" autocomplete="one-time-code"></label>
  <button type="submit" class="btn">تأیید و ارسال درخواست</button>
  <button type="button" id="builderRetry" class="btn btn--ghost">ارسال دوبارهٔ کد</button>
 </form>
 <p id="builderDialogError" class="builder-error" role="alert"></p>
 <p id="builderThanks" role="status" hidden>از اعتمادتان ممنونیم. درخواست فعال‌سازی صفحهٔ اختصاصی سالن برای کارشناسان ما ارسال شد. تا ۲۴ ساعت آینده با شما تماس می‌گیریم.</p>
</dialog>

  <section id="faq" class="section" aria-labelledby="h-faq" tabindex="-1">
    <div class="wrap">
      <div class="sec-head"><p class="kicker">پرسش‌های پرتکرار</p><h2 id="h-faq">پاسخ کوتاه به پرسش‌های رایج</h2></div>
      <div class="faq">
        <details open><summary>هزینهٔ آینه چطور مشخص می‌شود؟</summary><p>هزینهٔ راه‌اندازی و مصرف به امکانات و میزان استفاده بستگی دارد. در جلسهٔ دمو، گزینه‌های مناسب سالن و هزینهٔ هر کدام را شفاف می‌گوییم.</p></details>
        <details><summary>آینه دقیقاً چیست؟</summary><p>یک صفحهٔ اینترنتی با نام و رنگ برند سالن شما. مشتری مدل مو، رنگ، ناخن یا مژه را روی عکس خودش امتحان می‌کند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد.</p></details>
        <details><summary>چطور سرویس‌ها را امتحان کنم؟</summary><p>بالای همین صفحه عکس خودتان را بگذارید و مدل مو، رنگ، مژه یا ناخن دلخواهتان را امتحان کنید.</p></details>
        <details><summary>بعد از ثبت درخواست چه می‌شود؟</summary><p>بعد از تأیید موبایل و ارسال درخواست، کارشناسان آینه تا ۲۴ ساعت آینده برای هماهنگی با شما تماس می‌گیرند.</p></details>
        <details><summary>مشتری‌های من چطور وارد می‌شوند؟</summary><p>با یک لینک. آن را در اینستاگرام، تلگرام یا هر چتی می‌گذارید. چیزی نصب نمی‌شود؛ صفحه در مرورگر گوشی باز می‌شود.</p></details>
        <details><summary>درخواست مشتری را کجا می‌بینم؟</summary><p>در ربات تلگرام یا بله خودتان. پنل جداگانه‌ای ندارید.</p></details>
        <details><summary>آینه نوبت می‌دهد؟</summary><p>نه. آینه فقط کمک می‌کند مشتری روشن بگوید چه می‌خواهد. نوبت، زمان و هزینه مثل همیشه دست خود شماست.</p></details>
        <details><summary>نتیجهٔ شبیه‌سازی دقیق است؟</summary><p>نه، تقریبی است. مثل یک عکس مرجع واضح به گفتگو کمک می‌کند و نتیجهٔ نهایی را تضمین نمی‌کند.</p></details>
        <details><summary>ناخن و مژه هم دارید؟</summary><p>بله. در صفحهٔ سالن بین مو، ناخن و مژه جابه‌جا می‌شوند و هر کدام عکس و انتخاب‌های خودش را دارد.</p></details>
        <details><summary>شبیه‌سازی برای همهٔ سالن‌ها روشن است؟</summary><p>هر سالن خودش تصمیم می‌گیرد. اگر خاموش باشد، مشتری باز هم مدل و رنگ را انتخاب می‌کند و درخواستش را می‌فرستد.</p></details>
      </div>
    </div>
  </section>
</main>
<a class="sticky-cta" id="stickyCta" href="#start" hidden><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a>

<footer class="site-footer">
  <div class="foot">
    <a class="brand" href="#intro"><span class="brand-symbol"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><span class="brand-name">آینه<small>AYNEH</small></span></a>
    <ul aria-label="پیوندهای پایین صفحه">
      <li><a href="#studio">تجربه آینه</a></li><li><a href="#services">خدمات</a></li><li><a href="#how">نحوه کار</a></li><li><a href="#salon-example">نمونهٔ صفحهٔ سالن</a></li><li><a href="#faq">پرسش‌ها</a></li><li><a href="/admin">ورود مدیر</a></li>
    </ul>
  </div>
  <p class="legal">آینه — مدل مو، رنگ، ناخن و مژهٔ دلخواه را روی عکس خودتان ببینید.</p>
</footer>

<script>
(()=>{
 const button=document.querySelector('.menu-toggle');
 const menu=document.getElementById('mobile-menu');
 const header=document.querySelector('.site-header');
 const compact=window.matchMedia('(max-width:1100px)');
 function setOpen(open,returnFocus){
   menu.hidden=!open;
   button.setAttribute('aria-expanded',String(open));
   button.setAttribute('aria-label',open?'بستن فهرست':'باز کردن فهرست');
   if(returnFocus) button.focus();
 }
 button.addEventListener('click',()=>setOpen(menu.hidden));
 menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){e.preventDefault();setOpen(false,true)}});
 document.addEventListener('pointerdown',e=>{if(!menu.hidden&&!header.contains(e.target))setOpen(false)});
 document.addEventListener('focusin',e=>{if(!menu.hidden&&!header.contains(e.target))setOpen(false)});
 compact.addEventListener('change',e=>{if(!e.matches&&!menu.hidden)setOpen(false)});
})();
</script>
<script>window.__AYN_ASSET_VERSION="990d3abd8e27";window.__AYN_LOOKS=[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];</script>
<script>
/* A short-lived browser-local photo handoff; no upload, analytics or phone is involved. */
(()=>{
 const db=()=>new Promise((resolve,reject)=>{const r=indexedDB.open('ayneh-photo-handoff',1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 async function transaction(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('drafts',mode),r=fn(t.objectStore('drafts'));let result;r.onsuccess=()=>{result=r.result};t.oncomplete=()=>{d.close();resolve(result)};t.onerror=t.onabort=()=>{d.close();reject(t.error)}})}
 window.__AYN_DRAFT={put:entry=>transaction('readwrite',s=>s.put({...entry,created:Date.now()},'current')),async take(){const e=await transaction('readwrite',s=>{const r=s.get('current');s.delete('current');return r});return e&&Date.now()-e.created<15*60*1000?e:null}};
})();

</script>
<script>
/* Keep the original portrait immutable; replace only the union of the old/new hair. */
(()=>{
 function compose(original,render,oldHair,newHair,identity,face=identity){
  const scene=new Uint8ClampedArray(original),mask=new Uint8ClampedArray(newHair);
  for(let p=0;p<scene.length;p+=4){
   const protect=identity[p]/255;
   const alpha=Math.max(oldHair[p]*(1-face[p]/255),newHair[p])/255*(1-protect);
   for(let c=0;c<3;c++)scene[p+c]=original[p+c]+(render[p+c]-original[p+c])*alpha;
   const coverage=Math.round(newHair[p]*(1-protect));
   mask[p]=mask[p+1]=mask[p+2]=coverage;mask[p+3]=255;
  }
  return {scene,mask};
 }
 window.__AYN_PORTRAIT={compose};
})();

</script>
<script>
/* Continuous photographic tone curves retain strand contrast without channel clipping. */
(()=>{
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const luma=v=>(.2126*v[0]+.7152*v[1]+.0722*v[2])/255;
 const logit=v=>Math.log(clamp(v,.001,.999)/(1-clamp(v,.001,.999)));
 function tint(c,Y,yn,source,anchor){
  source=source||[Y*255,Y*255,Y*255];anchor=anchor||[81.6,81.6,81.6];
  const end=c.ombre?clamp((yn-.25)/.6,0,1):1;
  const target=(c.rgb||[151,105,66]).map((v,i)=>c.ombre?[48,32,24][i]*(1-end)+v*end:v);
  const ref=luma(anchor),dest=luma(target),L=1/(1+Math.exp(-(logit(dest)+logit(Y)-logit(ref))));
  const chroma=1-clamp((L-.65)/.35,0,.85);
  const rgb=source.map((v,i)=>255*L*(1+(target[i]/(255*dest)-1)*chroma+.24*(v/(255*Math.max(.01,Y))-anchor[i]/(255*ref))*chroma));
  const ceiling=Math.max(248,...rgb),scale=248/ceiling;
  return rgb.map(v=>clamp(v*scale,0,248));
 }
 window.__AYN_HAIR_COLOR={tint};
})();

</script>
<script>window.__AYN_BASE='/landing/';</script>
<script>
/* Film hero. STYLES / COLORS are the only lists to extend.
   - One plate (1376x768 design pixels) carries the photo, the hair canvas and the podium dock; JS only sizes and
     places the plate, so the recolour can never drift off the hair whatever the screen.
   - Colour changes are real: the hair is recoloured on the canvas through its mask.
   - A style changes the hair shape on the mirror only when a render for it exists (window.__AYN_LOOKS lists the
     style numbers that have /landing/look-sNN.webp + mask-sNN.png). Otherwise the style card says, truthfully,
     that the shape is made on the customer's own photo, and links to the demo salon. */
(()=>{
 const $=id=>document.getElementById(id);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'/landing/')+k+'.'+(e||'webp')+'?v='+(window.__AYN_ASSET_VERSION||'1'));
 const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
 const STYLES=['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
 const COLORS=[
  {name:'بلوند شامپاینی',rgb:[190, 166, 120],h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {name:'کاراملی',rgb:[139, 94, 57],h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {name:'اسپرسو',rgb:[49, 36, 29],h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {name:'آمبره',rgb:[180, 146, 99],ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {name:'مسی',rgb:[150, 79, 47],h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {name:'بلوند پلاتینی',rgb:[211, 201, 181],h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {name:'شرابی',rgb:[91, 39, 53],h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const READY=new Set([1,...(window.__AYN_LOOKS||[])]);
 const st={style:null,color:null,look:'base'};
 const film=$('intro'),stage=$('stage'),studio=$('studio'),mirror=$('mirror'),plate=$('plate'),dock=$('dock'),palette=$('colors');
 const frame='<svg class="frame" aria-hidden="true"><rect class="edge"/><rect class="orbit" pathLength="100"/></svg>';
 const ring='<svg class="frame" viewBox="0 0 48 48" aria-hidden="true"><circle class="edge" cx="24" cy="24" r="22"/><circle class="orbit" cx="24" cy="24" r="22" pathLength="100"/></svg>';
 const mobile=matchMedia('(max-width:900px)');

 /* ---------- build the three pickers ---------- */
 const make=(cls,html,onPick,box)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.tabIndex=box.children.length? -1:0;b.innerHTML=html;(b.querySelector('.ic,.ph,.dot')||b).insertAdjacentHTML('beforeend',cls==='sw'?ring:frame);b.addEventListener('click',()=>{if(!b.closest('.hscroll')?.classList.contains('was-dragged'))onPick()});box.append(b);return b};
 const n2=i=>String(i+1).padStart(2,'0');
 const cards=STYLES.map((name,i)=>make('card','<span class="ph"><img src="'+SRC('s'+n2(i))+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>',()=>pickStyle(i),$('track')));
 const dItems=[];
 STYLES.forEach((name,i)=>{
  dItems[i]=make('d-item','<span class="ic"><img src="'+SRC('s'+n2(i))+'" alt="" loading="lazy" draggable="false"></span><span>'+name+'</span>',()=>pickStyle(i),$('dockTrack'));
 });
 cards.forEach((b,i)=>{const note=document.createElement('small');note.className='preview-kind';note.textContent=READY.has(i+1)?'پیش‌نمایش روی آینه':'عکس مرجع';b.append(note)});
 const sws=COLORS.map((c,i)=>make('sw','<span class="dot"><i style="background:'+c.css+'"></i></span><span>'+c.name+'</span>',()=>pickColor(i),$('colList')));
 $('styCount').textContent='· '+fa(STYLES.length)+' مدل';

 /* ---------- plate placement: cover the mirror box, keep the mirror in view ---------- */
 const FX=.4985,FY=.44;
 function layout(){
  const W=mirror.clientWidth,H=mirror.clientHeight;if(!W||!H)return;
  const s=Math.max(W/1376,H/768)*(mobile.matches?1.5:1),pw=1376*s,ph=768*s;
  const x=Math.min(0,Math.max(W-pw,W/2-FX*pw)),y=Math.min(0,Math.max(H-ph,H*.5-FY*ph));
  Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:x+'px',top:y+'px'});
  plate.style.setProperty('--scene-scale',s.toFixed(3));
  dock.style.setProperty('--u',mobile.matches?'.8':Math.max(.62,Math.min(1.35,s/.84)).toFixed(3));
  // phones: the podium is too small for the dock, so it sits under the mirror instead
  // phones: colours and the style dock sit under the mirror, where thumbs can reach them
  if(mobile.matches){let lab=$('heroPlayground');if(!lab){lab=document.createElement('div');lab.id='heroPlayground';lab.className='hero-playground';studio.before(lab)}lab.append(studio,palette,dock);dock.classList.add('mobile');palette.classList.add('mobile')}
  else if(dock.parentElement!==plate){const lab=$('heroPlayground');if(lab){lab.before(studio);lab.remove()}plate.append(dock);mirror.append(palette);dock.classList.remove('mobile');palette.classList.remove('mobile')}
  syncArrows();
 }

 /* ---------- horizontal scrollers: wheel, drag, arrows ---------- */
 const rtl=el=>getComputedStyle(el).direction==='rtl';
 function room(el){const max=el.scrollWidth-el.clientWidth,pos=rtl(el)?-el.scrollLeft:el.scrollLeft;return {back:pos>2,fwd:pos<max-2}}
 function scrollFwd(el,dist){el.scrollBy({left:rtl(el)?-dist:dist,behavior:reduced?'auto':'smooth'})}
 function hscroll(el,prev,next){
  el.addEventListener('wheel',e=>{
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;            // trackpads already scroll sideways
   const r=room(el);if((e.deltaY>0&&!r.fwd)||(e.deltaY<0&&!r.back))return; // at the end: let the page scroll
   e.preventDefault();el.scrollLeft+=(rtl(el)?-1:1)*e.deltaY;
  },{passive:false});
  let d=null;
  el.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;d={x:e.clientX,s:el.scrollLeft,moved:false};el.classList.remove('was-dragged')});
  addEventListener('pointermove',e=>{if(!d)return;const dx=e.clientX-d.x;if(Math.abs(dx)>6){d.moved=true;el.classList.add('dragging','was-dragged')}if(d.moved)el.scrollLeft=d.s-dx});
  addEventListener('pointerup',()=>{if(!d)return;d=null;el.classList.remove('dragging');setTimeout(()=>el.classList.remove('was-dragged'),0)});
  const step=()=>el.clientWidth*.7;
  prev.addEventListener('click',()=>scrollFwd(el,-step()));next.addEventListener('click',()=>scrollFwd(el,step()));
  el.addEventListener('scroll',()=>sync1(el,prev,next),{passive:true});
  return ()=>sync1(el,prev,next);
 }
 function sync1(el,prev,next){const r=room(el);prev.disabled=!r.back;next.disabled=!r.fwd}
 const syncs=[hscroll($('dockTrack'),$('dkPrev'),$('dkNext')),hscroll($('track'),$('stPrev'),$('stNext'))];
 function syncArrows(){syncs.forEach(f=>f())}

 /* arrow keys move between options inside each radio group */
 [[cards,$('track')],[dItems.filter(Boolean),$('dockTrack')],[sws,$('colList')]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
  const i=list.indexOf(document.activeElement);if(i<0)return;
  const k=e.key;
  const dir=k==='ArrowDown'||k==='ArrowLeft'?1:k==='ArrowUp'||k==='ArrowRight'?-1:0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus({preventScroll:true});n.click();n.scrollIntoView({inline:'center',block:'nearest'})}));

 /* ---------- all-styles rail ---------- */
 const rail=$('styles'),more=$('more');rail.inert=true;
 function setRail(open){
  rail.inert=!open;rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open){setTimeout(()=>{(cards[st.style??0]).scrollIntoView({inline:'center',block:'nearest'});syncArrows();cards[st.style??0].focus({preventScroll:true})},60)}
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),img2=$('roomImg2'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 let px=null,rafId=0,lookTok=0;const preps={};
 const imagePromises=new Map();const loadImg=src=>{if(!imagePromises.has(src))imagePromises.set(src,new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src}));return imagePromises.get(src)};
 const lookAssets=key=>key==='base'?['hero','hair-mask']:['look-'+key,'mask-'+key];
 let identitySource=null;
 function canonical(){
  if(identitySource)return identitySource;
  identitySource=Promise.all([loadImg(SRC('hero')),loadImg(SRC('hair-mask','png'))]).then(([photo,mask])=>{
   const c=document.createElement('canvas');c.width=1376;c.height=768;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(photo,0,0);const original=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);g.drawImage(mask,0,0);
   // Include dark loose ends that the original colour-segmented mask misses on the blouse.
   g.fillStyle='#fff';
   const removal=[[[622,334],[653,334],[666,419],[651,441],[620,433],[618,389]],[[712,331],[748,331],[762,430],[729,441],[710,412],[705,368]],[[520,333],[582,333],[582,451],[515,450]],[[785,333],[863,333],[863,452],[785,452]]];
   removal.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   g.fillRect(610,240,148,106);g.fillRect(508,255,76,91);g.fillRect(786,255,75,91);
   g.fillRect(606,346,154,125);g.fillRect(508,346,76,108);g.fillRect(786,346,75,108);
   const oldHair=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);g.fillStyle='#fff';
   // Protect the same eyes, nose, lips and facial contours in all three reflections.
   // The upper forehead remains available for bangs.
   const faces=[[[660,298],[668,293],[699,293],[711,301],[711,325],[700,343],[682,350],[664,339],[654,323],[654,307]],[[522,291],[537,288],[547,301],[547,319],[549,333],[541,347],[526,347],[517,335],[513,323],[520,312]],[[825,288],[840,291],[843,308],[850,321],[846,335],[837,347],[823,347],[815,335],[816,315],[817,300]]];
   faces.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   const identity=g.getImageData(0,0,1376,768).data;
   g.clearRect(0,0,1376,768);
   const fullFaces=[[[676,267],[693,268],[704,280],[711,295],[713,314],[707,333],[697,344],[682,350],[665,339],[655,322],[653,302],[658,282]],[[523,280],[539,283],[548,300],[550,324],[542,347],[525,349],[513,328],[519,308]],[[828,280],[842,284],[844,307],[852,324],[840,348],[824,350],[814,332],[816,304]]];
   fullFaces.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
   const face=g.getImageData(0,0,1376,768).data;
   return {original,oldHair,identity,face};
  }).catch(error=>{identitySource=null;throw error});
  return identitySource;
 }
 function prepare(key){
  if(preps[key])return preps[key];
  const [im,mk]=lookAssets(key);
  return preps[key]=Promise.all([loadImg(SRC(im)),loadImg(SRC(mk,'png')),canonical()]).then(([a,m,person])=>{
   const W=1376,H=768,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d',{willReadFrequently:true});
   g.drawImage(m,0,0,W,H);let full=g.getImageData(0,0,W,H).data;
   g.clearRect(0,0,W,H);g.drawImage(a,0,0,W,H);let scene=g.getImageData(0,0,W,H);
   // Source renders contribute hair/removal pixels only, never a replacement face or room.
   const composed=window.__AYN_PORTRAIT.compose(person.original,scene.data,person.oldHair,full,person.identity,person.face);
   scene.data.set(composed.scene);full=composed.mask;
   g.putImageData(scene,0,0);
   const src=key==='base'?a.src:c.toDataURL('image/webp',.92);
   const thumbCanvas=document.createElement('canvas');thumbCanvas.width=240;thumbCanvas.height=300;
   thumbCanvas.getContext('2d').drawImage(c,605,235,160,235,0,0,240,300);
   const thumb=thumbCanvas.toDataURL('image/webp',.85),index=key==='base'?0:Number(key.slice(1))-1;
   [cards[index],dItems[index]].forEach(button=>{if(button)button.querySelector('img').src=thumb});
   let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(full[(y*W+x)*4]>6){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
   if(x1<x0)throw new Error('Empty hair mask');
   const R={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},base=g.getImageData(R.x,R.y,R.w,R.h).data;
   const mkd=new Uint8ClampedArray(R.w*R.h*4);
   for(let y=0;y<R.h;y++)mkd.set(full.subarray(((R.y+y)*W+R.x)*4,((R.y+y)*W+R.x+R.w)*4),y*R.w*4);
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mkd[i*4]>6)idx.push(i);
   const channels=[[],[],[]];for(const i of idx){const p=i*4,Y=(base[p]+base[p+1]+base[p+2])/765;if(mkd[p]>180&&Y>.15&&Y<.65)for(let c=0;c<3;c++)channels[c].push(base[p+c])}const anchor=channels.map((v,i)=>v.length?v.sort((a,b)=>a-b)[v.length>>1]:[143,95,60][i]);
   return {src,thumb,R,base,mk:mkd,idx,anchor,out:ctx.createImageData(R.w,R.h)};
  }).catch(()=>{delete preps[key];return null});
 }
 let transitionAnimation=null;
 const renderError=()=>{$('demoCaption').textContent='تصویر بارگذاری نشد؛ دوباره انتخاب کنید.';stage.dataset.renderState='error'};
 async function setLook(key){
  const my=++lookTok;
  stage.dataset.renderState='loading';
  const p=await prepare(key);if(my!==lookTok)return false;
  if(!p){renderError();return false}
  transitionAnimation?.cancel();cancelAnimationFrame(rafId);
  // Commit the decoded image and its own mask together. No old timeout can restore a previous selection.
  const changed=st.look!==key;
  img.src=p.src;px=p;st.look=key;
  if(st.style!=null)$('refImg').src=p.thumb;
  img2.classList.remove('show');
  draw(null,st.color!=null?COLORS[st.color]:null,1,-1);
  if(changed&&!reduced)transitionAnimation=$('mirrorFront').animate([{filter:'brightness(1.05)'},{filter:'brightness(1)'}],{duration:650,easing:'cubic-bezier(.2,.7,.2,1)'});
  stage.dataset.renderState='ready';stage.dataset.look=key;
  return true;
 }
 const startPrep=()=>setLook('base');
 startPrep();
 const cl=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function hsl(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
 const tint=window.__AYN_HAIR_COLOR.tint;
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px)return;
  const {R,base,mk,idx,out}=px,o=out.data;
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,1376,768);return}
  o.fill(0);
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,yr=(i/R.w)|0,yn=yr/R.h;
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   const A=from?tint(from,Y,yn,[r0,g0,b0],px.anchor):[r0,g0,b0],B=to?tint(to,Y,yn,[r0,g0,b0],px.anchor):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=A[2]+(B[2]-A[2])*t;
   if(scan>=0){const d=yn-scan,w=Math.exp(-(d*d)/.0045)*.7;r+=(255-r)*w*.75+26*w;g+=(255-g)*w*.65+14*w;b+=(255-b)*w*.4}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,1376,768);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){cancelAnimationFrame(rafId);draw(null,next,1,-1);if(!reduced)cv.animate([{opacity:.65},{opacity:1}],{duration:180})}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 const mark=(list,idx)=>list.forEach((button,i)=>{
  if(!button)return;
  button.setAttribute('aria-checked',String(i===idx));
  button.tabIndex=i===Math.max(0,idx)?0:-1;
 });
 async function pickColor(i){
  showFront();revealPortrait();
  const prev=st.color!=null?COLORS[st.color]:null;st.color=i;mark(sws,i);summary();
  // A click made before the mask finishes loading is queued, rather than silently doing nothing.
  if(!px){const p=await prepare(st.look);if(!p){renderError();return}if(!px)px=p}
  if(st.color===i){paintColor(prev,COLORS[i]);stage.dataset.color=String(i)}
 }
 async function pickStyle(i){
  showFront();
  st.style=i;mark(cards,i);mark(dItems,i);
  $('refImg').src=cards[i].querySelector('img').src;$('refName').textContent=STYLES[i];$('ref').classList.add('on');
  if(READY.has(i+1)){
   $('refNote').textContent='پیش‌نمایش این مدل روی چهرهٔ نمونه';
   await setLook(i===0?'base':'s'+n2(i));
  }else{
   $('refNote').textContent='عکس مرجع؛ برای دیدن این مدل روی چهره‌تان، با عکس خودتان امتحان کنید.';
   // Do not replace the current hairstyle with an unrelated render.
  }
  summary();
 }
 function summary(){
  const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
  $('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
  const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}

 /* ---------- one-shot walkthrough, after the page and hero assets are ready ---------- */
 const hand=$('demoHand'),file=$('demoFile'),caption=$('demoCaption'),invite=$('mirrorInvite');
 let demoController=null,demonstrating=false,played=false;
 function showFront(){stage.classList.remove('mirror-flipped');invite.inert=true;}
 function revealPortrait(){stage.classList.add('portrait-visible');}
 function endDemo(message){
  demoController?.abort();demoController=null;demonstrating=false;
  stage.dataset.demo='idle';revealPortrait();
  hand.getAnimations().forEach(a=>a.cancel());file.getAnimations().forEach(a=>a.cancel());
  hand.classList.remove('visible','press');file.classList.remove('visible');
  film.querySelectorAll('.demo-highlight').forEach(el=>el.classList.remove('demo-highlight'));
  $('skipDemo').hidden=true;$('replayDemo').hidden=false;
  if(message)caption.textContent=message;
 }
 const delay=(ms,signal)=>new Promise((resolve,reject)=>{
  if(signal.aborted){reject(new DOMException('Aborted','AbortError'));return}
  const done=()=>{signal.removeEventListener('abort',abort);resolve()};
  const timer=setTimeout(done,ms);
  const abort=()=>{clearTimeout(timer);reject(new DOMException('Aborted','AbortError'))};
  signal.addEventListener('abort',abort,{once:true});
 });
 function pointAt(el){const a=stage.getBoundingClientRect(),b=el.getBoundingClientRect();return {left:b.left-a.left+b.width*.55,top:b.top-a.top+b.height*.45}}
 async function moveHand(el,signal){
  const p=pointAt(el);hand.classList.add('visible');
  const previous={left:hand.style.left||'60%',top:hand.style.top||'30%'};
  hand.style.left=p.left+'px';hand.style.top=p.top+'px';
  hand.animate([previous,{left:p.left+'px',top:p.top+'px'}],{duration:650,easing:'ease-in-out'});
  await delay(700,signal);hand.classList.add('press');await delay(180,signal);hand.classList.remove('press');
 }
 async function walkthrough(){
  if(demonstrating)return;
  showFront();played=true;endDemo();
  if(reduced){caption.textContent='مدل و رنگ دلخواهتان را روی آینه انتخاب کنید.';return}
  const controller=new AbortController(),signal=controller.signal;demoController=controller;demonstrating=true;
  stage.dataset.demo='playing';stage.classList.remove('portrait-visible');$('skipDemo').hidden=false;$('replayDemo').hidden=true;
  st.color=null;st.style=null;mark(sws,-1);mark(cards,-1);mark(dItems,-1);$('ref').classList.remove('on');summary();
  try{
   const loaded=await setLook('base');if(signal.aborted)return;if(!loaded){endDemo();return}
   caption.textContent='۱ · عکس چهره یا دستتان را بارگذاری کنید';
   await delay(450,signal);
   const m=mirror.getBoundingClientRect(),r=stage.getBoundingClientRect();
   const dest={left:m.left-r.left+m.width*.48,top:m.top-r.top+m.height*.4};
   const begin={left:Math.max(20,dest.left-130),top:Math.max(35,dest.top-160)};
   file.style.left=begin.left+'px';file.style.top=begin.top+'px';file.classList.add('visible');
   hand.style.left=(begin.left+60)+'px';hand.style.top=(begin.top+65)+'px';hand.classList.add('visible');
   file.animate([begin,dest],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
   hand.animate([{left:(begin.left+60)+'px',top:(begin.top+65)+'px'},{left:(dest.left+60)+'px',top:(dest.top+65)+'px'}],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
   await delay(1250,signal);file.classList.remove('visible');file.getAnimations().forEach(a=>a.cancel());hand.getAnimations().forEach(a=>a.cancel());
   hand.style.left=(dest.left+60)+'px';hand.style.top=(dest.top+65)+'px';revealPortrait();
   await delay(1000,signal);
   const demoStyle=dItems[5]?5:0;
   caption.textContent='۲ · مدل دلخواهتان را روی چهرهٔ خود ببینید';
   // On phones the dock is below the mirror: leave the viewport under the visitor's control.
   if(!mobile.matches)await moveHand(dItems[demoStyle],signal);
   else dItems[demoStyle].classList.add('demo-highlight');
   await pickStyle(demoStyle);if(signal.aborted)return;
   await delay(1100,signal);dItems[demoStyle].classList.remove('demo-highlight');
   caption.textContent='۳ · رنگ مو را هم امتحان کنید';
   if(!mobile.matches)await moveHand(sws[4],signal);else sws[4].classList.add('demo-highlight');
   await pickColor(4);await delay(1300,signal);sws[4].classList.remove('demo-highlight');
   hand.classList.remove('visible');
   caption.textContent='انتخابتان را همراه تصویر برای تأیید یا رد به سالن بفرستید.';
   await delay(1300,signal);
   endDemo('همین حالا با تصویر خودتان امتحان کنید.');
   stage.classList.add('mirror-flipped');invite.inert=false;
  }catch(error){if(error.name!=='AbortError')endDemo('مدل و رنگ دلخواهتان را روی آینه انتخاب کنید.')}
 }
 $('openHeroDemo').addEventListener('click',e=>{
  e.preventDefault();played=true;endDemo('مدل و رنگ دلخواهتان را انتخاب کنید.');showFront();
  const target=$('heroPlayground')||studio;
  target.scrollIntoView({block:'center',behavior:reduced?'instant':'smooth'});
  const choice=dock.querySelector('[aria-checked="true"]')||dock.querySelector('[role="radio"]');
  choice?.focus({preventScroll:true});
 });
 $('skipDemo').addEventListener('click',()=>endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.'));
 $('replayDemo').addEventListener('click',walkthrough);
 $('backToMirror').addEventListener('click',()=>{showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'});
 // Human interaction always wins. No scripted cursor intercepts a real click or keyboard action.
 const human=e=>{if(!e.isTrusted||e.target.closest('.demo-controls'))return;if(demonstrating)endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.');if(e.target.closest('#dock,#colors,#styles')){revealPortrait();showFront()}};
 film.addEventListener('pointerdown',human,true);film.addEventListener('keydown',human,true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')});
 const loader=$('siteLoader');
 const essential=Promise.allSettled([prepare('base'),prepare('s06')]);
 document.documentElement.classList.add('hero-loading');
 let loadingTimeout;
 const deadline=new Promise(resolve=>{loadingTimeout=setTimeout(()=>resolve(false),1800)});
 window.__AYN_HERO_READY=Promise.race([essential.then(results=>results.every(result=>result.status==='fulfilled'&&result.value)),deadline]).finally(()=>{
  clearTimeout(loadingTimeout);
  $('loaderProgress').style.width='100%';
  document.documentElement.classList.remove('hero-loading');
  loader.classList.add('is-done');
  setTimeout(()=>loader.remove(),450);
 });
 window.__AYN_HERO_READY.then(ready=>{
  // Never steal attention back if the visitor started interacting or scrolled past the hero while loading.
  const r=film.getBoundingClientRect();if(!ready||played||r.bottom<innerHeight*.5||r.top>innerHeight){endDemo();return}
  walkthrough();
 });
 new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')},{threshold:0}).observe(studio);
 film.addEventListener('pointerdown',()=>{played=true},{once:true});
 /* ---------- scroll plays the scene (desktop pin only) ---------- */
 const hdr=document.querySelector('.site-header');let tick=false;
 function frameUpdate(){tick=false;
  const hh=hdr?hdr.offsetHeight:76;document.documentElement.style.setProperty('--hh',hh+'px');
  if(mobile.matches){stage.style.setProperty('--p','0');stage.style.setProperty('--z','1');return}
  const span=film.offsetHeight-stage.offsetHeight;if(span<=0)return;
  const p=cl((hh-film.getBoundingClientRect().top)/span,0,1);
  stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--z',(1+p*.08).toFixed(4));
  $('fade').style.opacity=sm(.6,1,p).toFixed(3)}
 const req=()=>{if(!tick){tick=true;requestAnimationFrame(frameUpdate)}};
 addEventListener('scroll',req,{passive:true});
 new ResizeObserver(()=>{layout();req()}).observe(mirror);
 layout();frameUpdate();if(mobile.matches){$('demoCaption').hidden=true}
})();

</script>
<script>
(()=>{
 const root=document.querySelector('.film-player');
 if(!root)return;
 const video=root.querySelector('video'),buttons=[...root.querySelectorAll('[data-film]')];
 const titles=['مدل و رنگ مو','مدل مژه','طرح و رنگ ناخن'];
 const descriptions=['مدل و رنگ‌های مختلف را روی یک چهره ببینید و انتخاب کنید.','حالت و حجم مژه را روی چشم‌ها مقایسه کنید.','تغییر فرم، طرح و رنگ ناخن را روی دست ببینید.'];
 const error=root.querySelector('#filmError');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,visible=false,userPaused=false,systemPause=false,completed=false;
 function play(){
  if(!visible||document.hidden||completed||userPaused)return;
  video.play().catch(()=>{});
 }
 function pause(){
  if(video.paused)return;
  systemPause=true;
  video.pause();
 }
 function select(index){
  error.hidden=true;
  if(index!==current||video.error){
   root.classList.remove("is-playing");
   pause();
   current=index;
   const key=buttons[index].dataset.film,base=window.__AYN_BASE||'/landing/';
   video.poster=base+key+'-poster.webp';
   video.src=base+'video/'+key+'.mp4?v='+window.__AYN_ASSET_VERSION;
  }else if(video.ended)video.currentTime=0;
  completed=false;userPaused=false;
  video.playbackRate=index===0?1.5:1;
  video.setAttribute('aria-label',titles[index]);
  root.querySelector('#filmTitle').textContent=titles[index];
  root.querySelector('#filmText').textContent=descriptions[index];
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 }
 buttons.forEach((button,index)=>button.addEventListener('click',()=>{select(index);visible=true;play()}));
 video.addEventListener('loadedmetadata',()=>{video.playbackRate=current===0?1.5:1});
 video.addEventListener('playing',()=>{userPaused=false;completed=false;root.classList.add('is-playing')});
 video.addEventListener('waiting',()=>root.classList.remove('is-playing'));
 video.addEventListener('pause',()=>{
  root.classList.remove('is-playing');
  if(!systemPause&&video.paused&&!video.ended)userPaused=true;
  systemPause=false;
 });
 video.addEventListener('error',()=>{
  root.classList.remove('is-playing');error.textContent='ویدئو بارگیری نشد. برای تلاش دوباره، دکمهٔ همین خدمت را بزنید.';error.hidden=false;
 });
 video.addEventListener('ended',()=>{
  root.classList.remove('is-playing');
  if(current+1===buttons.length){completed=true;return}
  select(current+1);play();
 });
 new IntersectionObserver(([entry])=>{
  visible=entry.intersectionRatio>=.3;
  if(!visible)pause();
  else if(!reduced.matches)play();
 },{threshold:.3}).observe(video);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(!reduced.matches)play()});
 select(0);
})();

</script>
<script>
/* The gallery, phone verification and result stay inside this landing page. */
(()=>{
 const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
 const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.hidden=true;input.setAttribute('aria-label','انتخاب تصویر خودم');document.body.append(input);let line='hair',opener;
 const dialog=document.createElement('dialog');dialog.className='personal-try';dialog.setAttribute('aria-label','ساخت تصویر خودم');dialog.innerHTML='<div class="personal-head"><strong>این بار، تصویر خودتان.</strong><button type="button" aria-label="بستن تجربهٔ تصویر من">×</button></div><iframe title="عکس من، انتخاب من" allow="camera"></iframe>';document.body.append(dialog);const frame=dialog.querySelector('iframe');dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.documentElement.classList.remove('try-open');opener?.focus({preventScroll:true})});
 links.forEach(a=>{a.href='#intro';a.addEventListener('click',e=>{e.preventDefault();line=a.dataset.try;opener=a;input.value='';input.click()})});
 input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>25*1024*1024){alert('یک تصویر JPG، PNG یا WebP با حجم کمتر از ۲۵ مگابایت انتخاب کنید.');return}try{const selection={...(window.__AYN_SEL||{})};await window.__AYN_DRAFT.put({file,line,selection});const q=new URLSearchParams({l:line,draft:'1',embed:'1'});if(line==='hair'){q.set('s',selection.styleIdx??0);if(selection.color)q.set('c',selection.color)}frame.src='/s/demo?'+q;dialog.showModal();document.documentElement.classList.add('try-open')}catch(_){alert('باز کردن تصویر ممکن نشد. دوباره انتخاب کنید.')}});
})();

</script>
<script>
/* Keep the mobile action out of the hero, inquiry and try-on dialog. */
(()=>{
 const bar=document.getElementById('stickyCta');
 const hero=document.getElementById('intro');
 const inquiry=document.getElementById('start');
 const player=document.querySelector('.film-player');
 if(!bar||!hero||!inquiry)return;
 const mobile=matchMedia('(max-width:900px)');
 let queued=false;
 function sync(){
  queued=false;
  const form=inquiry.getBoundingClientRect();
  const afterHero=hero.getBoundingClientRect().bottom<80;
  const beforeForm=form.top>=innerHeight;
  const film=player?.getBoundingClientRect();
  const overFilm=film&&film.top<innerHeight&&film.bottom>0;
  bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!overFilm&&!document.querySelector('dialog[open]'));
 }
 function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
 addEventListener('scroll',schedule,{passive:true});
 addEventListener('resize',schedule);
 document.addEventListener('focusin',schedule);
 document.addEventListener('focusout',schedule);
 sync();
})();

</script>
<script>
/* Section reveals: content below the first screen rises in as it enters. Nothing is hidden without JS, and anything
   already on screen at load is left alone. */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 const sel='.sec-head,.svc,.step,.feat li,.plan,.faq details,.cta-band__in,.s2-copy,.s2-demo,.trial-mock,#leadForm,.selection-copy,.compare,.salon-invite-card';
 const els=[...document.querySelectorAll(sel)].filter(e=>e.getBoundingClientRect().top>innerHeight);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;
  const sib=[...el.parentElement.children].filter(x=>x.classList.contains('rv'));el.style.transitionDelay=Math.min(sib.indexOf(el),5)*70+'ms';
  el.classList.add('in');io.unobserve(el)}),{rootMargin:'0px 0px -8% 0px'});
 els.forEach(e=>{e.classList.add('rv');io.observe(e)});
})();

/* Cinematic layer: a brass progress hairline, a header that tightens once you leave the hero and marks the section in
   view, headings that wipe in line by line, and slow depth on section media. All of it is transform/opacity on rAF,
   so scrolling stays on the compositor; reduced motion keeps only the progress line and the active link. */
(()=>{
 const still=matchMedia('(prefers-reduced-motion:reduce)').matches,header=document.querySelector('.site-header');
 const bar=document.createElement('div');bar.className='scroll-line';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
 const links=[...document.querySelectorAll('.site-header .nav a[href^="#"]')],secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
 const deep=still||innerWidth<900?[]:[...document.querySelectorAll('.s2-demo img,.trial-mock img,.svc .ico')];
 let busy=false;
 function frame(){busy=false;const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform='scaleX('+(h>0?Math.min(1,y/h):0)+')';
  header&&header.classList.toggle('is-tight',y>80);
  let cur=null;for(const s of secs){if(s.getBoundingClientRect().top<innerHeight*.4)cur=s.id}
  links.forEach(a=>a.toggleAttribute('aria-current',a.getAttribute('href')==='#'+cur));
  for(const el of deep){const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;
   const p=(r.top+r.height/2)/innerHeight-.5;el.style.transform='translate3d(0,'+(p*-28).toFixed(1)+'px,0)'}}
 const ask=()=>{if(!busy){busy=true;requestAnimationFrame(frame)}};addEventListener('scroll',ask,{passive:true});addEventListener('resize',ask);frame();
 if(still||!('IntersectionObserver' in window))return;
 const heads=[...document.querySelectorAll('.sec-head h2,.cta-band h2')].filter(h=>h.getBoundingClientRect().top>innerHeight);
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -12% 0px'});
 heads.forEach(h=>{h.classList.add('wipe');io.observe(h)});
})();

/* Shared gold motion follows the button outline, keeping the label still. */
(()=>{document.querySelectorAll('a.btn[href="#start"],.journey-actions a.btn').forEach(a=>{a.classList.add('orbit-cta');a.insertAdjacentHTML('beforeend','<svg class="cta-ring" aria-hidden="true"><rect pathLength="100"/></svg>')})})();

</script>
<script>
(()=>{
 const $=id=>document.getElementById(id);
 const form=$('start'),live=$('builderLive');
 if(!form||!live)return;
 const loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
 const dialog=$('builderDialog'),phone=$('builderPhone'),otp=$('builderOtp'),thanks=$('builderThanks'),dialogError=$('builderDialogError');
 const add=$('builderAdd'),works=$('builderWorks'),build=$('builderBuild');
 const profileFields=['bio','manager','address','hours','phone','instagram','website','map','telegram'];
 const brandFields=['logo','cover','portrait'];
 let draft,otpBody,busy=false,submitted=false,dirty=false;
 const objectURLs=new Map();
 const api=async(path,body)=>{
  const options=body===undefined?{}:{method:'POST',...(body instanceof FormData?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})};
  const response=await fetch(path,options);
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'ارتباط با آینه برقرار نشد. دوباره تلاش کنید.');
  return data;
 };
 const serviceNames={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
 const linkNames={instagram:'اینستاگرام',website:'وب‌سایت',map:'نقشه',telegram:'تلگرام'};
 function urlFor(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)return '';
  if(!objectURLs.has(file))objectURLs.set(file,URL.createObjectURL(file));
  return objectURLs.get(file);
 }
 function image(element,file){
  const url=urlFor(file);if(url)element.src=url;else element.removeAttribute('src');
  element.hidden=!url;
 }
 function render(){
  const fields=form.elements;
  const get=key=>fields[key].value.trim();
  const name=get('name')||'نام سالن شما';
  const slug=get('slug')||'your-salon';
  $('builderAddress').textContent='ayneh-salon.site/s/'+slug;
  live.style.setProperty('--salon-brand',get('brand'));
  $('liveName').textContent=name;$('liveInitial').textContent=get('name')[0]||'س';
  $('liveBio').textContent=get('bio')||'مدل دلخواهت را روی عکس خودت ببین و انتخابت را برای سالن بفرست.';
  for(const [id,key] of [['liveAddress','address'],['liveHours','hours'],['liveManager','manager'],['livePhone','phone']]){
   $(id).textContent=get(key);$(id).hidden=!get(key);
  }
  for(const [id,key] of [['liveCover','cover'],['liveLogo','logo'],['livePortrait','portrait']])image($(id),fields[key].files[0]);
  $('liveInitial').hidden=!$('liveLogo').hidden;
  const links=Object.entries(linkNames).flatMap(([key,label])=>{
   if(!get(key))return [];
   const item=document.createElement('span');item.textContent=label+' · ';
   const value=document.createElement('bdi');value.textContent=get(key);item.append(value);return [item];
  });
  $('liveLinks').replaceChildren(...links);
  $('liveContact').hidden=!get('manager')&&!get('phone')&&!links.length&&$('livePortrait').hidden;
  const cards=[...works.children].map(row=>{
   const field=key=>row.querySelector('[data-work="'+key+'"]');
   const card=document.createElement('article'),img=document.createElement('img'),label=document.createElement('small'),title=document.createElement('strong'),text=document.createElement('p');
   img.alt='';image(img,field('file').files[0]);label.textContent=serviceNames[field('line').value];title.textContent=field('title').value.trim()||'عنوان نمونه‌کار';text.textContent=field('description').value.trim();
   card.append(img,label,title,text);return card;
  });
  $('liveWorks').replaceChildren(...cards);$('liveEmpty').hidden=cards.length>0;
  const kept=new Set([...form.querySelectorAll('input[type=file]')].map(input=>input.files[0]));
  for(const [file,url] of objectURLs)if(!kept.has(file)){URL.revokeObjectURL(url);objectURLs.delete(file)}
 }
 function change(event){
  render();
  if(event?.target instanceof HTMLElement){
   const key=event.target.name;
   const row=event.target.closest('.builder-work');
   const target=row?$('liveWorks').children[[...works.children].indexOf(row)]
    :['manager','portrait','phone','map','instagram','website','telegram'].includes(key)?$('liveContact')
    :['name','bio','address','hours'].includes(key)?$('liveName'):null;
   if(target)live.scrollTop+=target.getBoundingClientRect().top-live.getBoundingClientRect().top-8;
   else if(['logo','cover','brand','slug'].includes(key))live.scrollTop=0;
  }
  if(!draft)return;
  dirty=true;activate.hidden=true;
  hint.textContent='پیش‌نمایش به‌روز شد. برای ادامه، اطلاعات را تأیید کنید.';
 }
 form.elements.slug.addEventListener('input',e=>{
  e.target.value=e.target.value.toLowerCase().replace(/[\\s_]+/g,'-').replace(/[^a-z0-9-]/g,'');
 });
 form.addEventListener('input',change);
 form.addEventListener('change',change);
 form.addEventListener('invalid',e=>{const details=e.target.closest('details');if(details)details.open=true},true);
 render();
 add.addEventListener('click',()=>{
  const item=$('builderWorkTemplate').content.firstElementChild.cloneNode(true);
  item.querySelector('.builder-remove').onclick=()=>{item.remove();add.disabled=false;change();add.focus()};
  works.append(item);add.disabled=works.children.length>=6;change();
  item.querySelector('input').focus();
 });
 async function photo(file){
  if(!file||!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12_000_000)throw new Error('عکس JPG، PNG یا WebP با حجم حداکثر ۱۲ مگابایت انتخاب کنید.');
  const image=await createImageBitmap(file).catch(()=>{throw new Error('یکی از عکس‌ها خوانده نشد.')});
  try{
   if(file.size<=400_000)return file;
   const scale=Math.min(1,1440/Math.max(image.width,image.height));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));
   canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
   for(const quality of [.86,.68,.45,.28]){
    const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',quality));
    if(blob?.size<=400_000)return blob;
   }
   throw new Error('یکی از عکس‌ها خیلی حجیم است. نسخهٔ کوچک‌تر آن را انتخاب کنید.');
  }finally{image.close()}
 }
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(build.disabled||busy)return;
  if(draft&&!dirty){
   activate.hidden=false;
   if(!submitted)activate.focus();
   return;
  }
  $('builderError').textContent='';build.disabled=true;activate.hidden=true;hint.textContent='';
  loading.hidden=false;
  const fields=[...form.elements].filter(input=>!input.disabled);fields.forEach(input=>input.disabled=true);
  try{
   await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   const name=form.elements.name.value.trim(),slug=form.elements.slug.value;
   if(name.length<2)throw new Error('نام سالن را وارد کنید.');
   const profile=Object.fromEntries(profileFields.map(key=>[key,form.elements[key].value.trim()]));
   for(const key of ['instagram','website','map','telegram'])if(profile[key]&&!/^https?:\\/\\//i.test(profile[key]))throw new Error('لینک‌ها باید با http:// یا https:// شروع شوند.');
   const files=new Map();
   for(const key of brandFields){const file=form.elements[key].files[0];if(file)files.set(key,await photo(file))}
   const portfolio=[];
   for(const row of works.children){
    const get=key=>row.querySelector('[data-work="'+key+'"]');
    const slot='work-'+portfolio.length;
    const title=get('title').value.trim();
    if(title.length<2)throw new Error('برای هر نمونه‌کار عنوان وارد کنید.');
    files.set(slot,await photo(get('file').files[0]));
    portfolio.push({title,line:get('line').value,description:get('description').value.trim(),slot});
   }
   draft={id:crypto.randomUUID(),data:{name,slug,brand:form.elements.brand.value,profile,portfolio},files};
   dirty=false;submitted=false;
   activate.hidden=false;activate.disabled=false;activate.focus({preventScroll:true});
   hint.textContent='پیش‌نمایش آماده است. برای بررسی نشانی و راه‌اندازی، درخواست فعال‌سازی بفرستید.';
  }catch(error){$('builderError').textContent=error.message;hint.textContent=error.message}
  finally{build.disabled=false;loading.hidden=true;fields.forEach(input=>input.disabled=false);add.disabled=works.children.length>=6}
 });
 const sessionPath='/api/s/demo/session';
 async function session(){
  try{return await api(sessionPath)}catch(error){await api(sessionPath,{});return api(sessionPath)}
 }
 async function send(){
  if(dirty||!draft)throw new Error('پیش‌نمایش را دوباره بسازید.');
  const payload=new FormData();
  payload.append('id',draft.id);payload.append('draft',JSON.stringify(draft.data));
  for(const [key,file] of draft.files)payload.append(key,file,key);
  const sentDraft=draft;
  await api('/api/activation',payload);
  if(draft!==sentDraft||dirty)return;
  submitted=true;phone.hidden=true;otp.hidden=true;thanks.hidden=false;
  $('builderDialogTitle').textContent='درخواست فعال‌سازی ثبت شد';
  if(!dialog.open)dialog.showModal();
  activate.disabled=true;hint.textContent='درخواست فعال‌سازی ثبت شد.';
 }
 async function run(action,control){
  if(busy)return;
  busy=true;control.disabled=true;dialogError.textContent='';
  try{await action()}catch(error){if(dialog.open)dialogError.textContent=error.message;else hint.textContent=error.message}
  finally{busy=false;control.disabled=control===activate&&submitted}
 }
 activate.onclick=()=>run(async()=>{
  if(submitted||dirty)return;
  try{await api('/api/activation')}catch(error){
   throw new Error('ثبت فعال‌سازی در این محیط در دسترس نیست. پیش‌نمایش شما آماده است.');
  }
  const current=await session();
  if(current.verified){await send();return}
  thanks.hidden=true;phone.hidden=false;otp.hidden=true;
  $('builderDialogTitle').textContent='تأیید شمارهٔ موبایل';
  dialog.showModal();
 },activate);
 phone.addEventListener('submit',e=>{
  e.preventDefault();
  run(async()=>{
   const data=Object.fromEntries(new FormData(phone));
   await api('/api/s/demo/otp/send',data);otpBody=data;
   phone.hidden=true;otp.hidden=false;otp.elements.code.focus();
  },e.submitter);
 });
 otp.addEventListener('submit',e=>{
  e.preventDefault();
  run(async()=>{if(!(await api(sessionPath)).verified)await api('/api/s/demo/otp/verify',{code:otp.elements.code.value});await send()},e.submitter);
 });
 $('builderRetry').onclick=e=>run(async()=>{await api('/api/s/demo/otp/send',otpBody);dialogError.textContent='کد جدید فرستاده شد.'},e.currentTarget);
 dialog.querySelector('.builder-close').onclick=()=>dialog.close();
 dialog.addEventListener('close',()=>{if(!activate.hidden&&!activate.disabled)activate.focus({preventScroll:true})});
})();

</script>
</body>
</html>
`;
