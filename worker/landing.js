// Public landing page served at "/" (owner console lives at /admin). Static HTML; images in public/landing/.
// Generated from the design source (visual direction AYN-D057/D059/D060/D061/D062; tokens are PROPOSED).
export const landingHTML=`<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>آینه | مشتری‌تان مدل مو، ناخن و مژه‌اش را قبل از آمدن می‌بیند</title>
<meta name="description" content="صفحهٔ اینترنتی سالن شما: مشتری مدل مو، رنگ، طرح ناخن و مژه را روی عکس خودش امتحان می‌کند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد. صفحهٔ آزمایشی رایگان.">
<meta name="theme-color" content="#F8F2EB">
<meta property="og:title" content="آینه | مشتری‌تان قبل از نشستن روی صندلی می‌داند چه می‌خواهد">
<meta property="og:description" content="صفحهٔ آزمایشی رایگان برای سالن‌های مو، ناخن و مژه. ۱۰ ساعت وقت دارید و ۵ تصویر.">
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


/* ---------- Section 2: request lands in the salon chat ---------- */
.s2{position:relative;background:radial-gradient(90% 70% at 22% 40%,#2a1a0e 0%,#160D07 62%);color:var(--cream);padding:var(--sec-y) var(--gut)}
.s2-grid{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:clamp(32px,6vw,88px);align-items:center}
.s2-copy h2{margin:0 0 16px;color:var(--ivory)}
.s2 .sub{margin:0 0 28px;font-size:18px;line-height:1.95;color:var(--ivory-2);font-weight:500;max-width:560px}
.s2-points{display:grid;gap:12px;margin:0 0 32px;max-width:560px}
.s2-points li{display:grid;gap:2px;padding:14px 18px;border-radius:var(--r-card);border:1px solid var(--line-dark);background:linear-gradient(180deg,rgba(255,248,238,.07),rgba(255,248,238,.02))}
.s2-points strong{color:var(--ivory);font-size:17px}
.s2-points span{color:var(--ivory-2);font-size:15px}
.s2-cta{display:flex;flex-wrap:wrap;gap:12px}
.s2-demo{position:relative;display:grid;justify-items:center;gap:18px}
.phone{position:relative;width:min(340px,100%);padding:14px 14px 18px;border-radius:38px;background:#120A05;border:1.5px solid var(--brass);box-shadow:0 0 0 6px rgba(185,151,91,.1),0 40px 80px rgba(0,0,0,.5)}
.phone-top{display:flex;align-items:center;gap:12px;padding:6px 8px 12px;border-bottom:1px solid rgba(214,190,140,.2)}
.phone-top .av{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:linear-gradient(145deg,#E7D3A4,#A9824F);color:var(--espresso);font-weight:800}
.phone-top strong{display:block;font-size:15px;color:var(--ivory);line-height:1.4}
.phone-top small{display:block;font-size:12px;color:var(--ivory-2);line-height:1.4}
.push{position:absolute;z-index:3;inset-inline:22px;top:64px;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:16px;background:rgba(249,241,232,.96);color:var(--espresso);font-size:13px;font-weight:700;box-shadow:0 14px 30px rgba(0,0,0,.4);opacity:0;transform:translateY(-14px);pointer-events:none}
.push .dot{width:8px;height:8px;border-radius:50%;background:#B9975B}
.chat{display:grid;gap:12px;padding:14px 4px 4px;min-height:340px;align-content:start}
.msg{max-width:92%;border-radius:18px;font-size:14px;line-height:1.8}
.msg.in{display:flex;gap:12px;padding:10px;background:#23160C;border:1px solid rgba(214,190,140,.25);color:var(--ivory)}
.msg .ph{flex:0 0 74px;aspect-ratio:4/5;border-radius:12px;overflow:hidden;background:#3a2a1c}
.msg .ph img{width:100%;height:100%;object-fit:cover;display:block}
.msg .body{min-width:0}
.msg .body>strong{display:block;font-size:14px;margin-bottom:2px}
.msg dl{margin:0;display:grid;gap:0}
.msg dl div{display:flex;gap:6px;font-size:13px}
.msg dt{color:var(--brass-soft);font-weight:600}
.msg dt::after{content:":"}
.msg dd{margin:0;color:var(--ivory);font-weight:700}
.msg small{display:block;margin-top:4px;font-size:11.5px;line-height:1.6;color:var(--ivory-2)}
.actions{display:flex;flex-wrap:wrap;gap:8px}
.actions button{min-height:44px;padding:0 14px;border-radius:var(--r-pill);border:1px solid var(--brass-soft);background:transparent;color:var(--ivory);font-size:13.5px;font-weight:700;cursor:pointer;transition:background 160ms var(--ease),color 160ms var(--ease)}
.actions button:hover{background:rgba(214,190,140,.16)}
.actions button[aria-pressed="true"]{background:var(--cream);color:var(--espresso)}
.msg.out{margin-inline-start:auto;padding:8px 14px;background:linear-gradient(145deg,#C9A569,#A9824F);color:var(--espresso);font-weight:700;border-radius:18px 18px 4px 18px}
.cust{width:min(340px,100%);padding:14px 18px;border-radius:var(--r-card);border:1px dashed var(--line-dark);background:rgba(255,248,238,.04);text-align:right}
.cust small{display:block;font-size:12.5px;color:var(--brass-soft);font-weight:700}
.cust strong{display:block;font-size:16px;color:var(--ivory);line-height:1.7}
.s2-demo.play .push{animation:push 3200ms var(--ease) 500ms both}
.s2-demo.play #s2msg{animation:bubble 700ms var(--ease) 1500ms both}
.s2-demo.play .actions{animation:bubble 600ms var(--ease) 2200ms both}
.s2-demo.play .phone{animation:bubble 800ms var(--ease) both}
@keyframes push{0%{opacity:0;transform:translateY(-14px)}12%,70%{opacity:1;transform:none}100%{opacity:0;transform:translateY(-8px)}}
@keyframes bubble{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@media (max-width:900px){.s2-grid{grid-template-columns:1fr}.s2-cta .btn--lg{width:100%}}
@media (prefers-reduced-motion:reduce){.s2-demo.play *{animation:none!important}}


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

/* Scenes: pinned stage + scroll-scrubbed frame sequences (no library) */
.scene{position:relative;background:var(--canvas)}
.scene--pain{height:210svh}.scene[data-scene=transform]{height:420svh}.scene[data-scene=lines]{height:360svh}
.scene--dark{background:var(--espresso);color:var(--cream)}
.scene .sstage{position:sticky;top:var(--hh,76px);height:calc(100svh - var(--hh,76px));display:flex;flex-direction:column;align-items:center;justify-content:safe center;gap:clamp(10px,2svh,20px);padding:clamp(16px,3svh,32px) var(--gut) 16px;overflow:hidden}
.scene-head{width:min(100%,1280px)}
.scene-head h2{margin:0;font-size:clamp(24px,3.4vw,44px);line-height:1.5;font-weight:800;text-wrap:balance}
.film-frame{position:relative;margin:0;width:min(100%,1280px);aspect-ratio:16/9;max-height:calc(100svh - var(--hh,76px) - 210px);border-radius:var(--r-frame);overflow:hidden;background:var(--espresso-2);box-shadow:0 30px 70px -34px rgba(0,0,0,.6)}
.film-frame--pain{aspect-ratio:auto;height:min(56svh,100%);background:transparent;box-shadow:none;border-radius:0}
.film-frame--pain img{width:100%;height:100%;object-fit:contain;transform:scale(var(--ps,1.14)) rotate(var(--pr,-2deg));opacity:var(--po,.4);will-change:transform,opacity}
.film-canvas{position:absolute;inset:0;width:100%;height:100%;display:block}
.film-canvas--b{opacity:0}
.cap-row{position:absolute;inset:auto 0 0 0;padding:44px clamp(16px,3vw,32px) clamp(14px,2.4vw,24px);background:linear-gradient(to top,rgba(22,13,7,.82),rgba(22,13,7,0));display:grid}
.film-frame--pain .cap-row{position:static;background:none;padding:12px 0 0;color:var(--ink)}
.cap{grid-area:1/1;font-size:clamp(15px,1.8vw,20px);font-weight:700;opacity:0;transform:translateY(8px);transition:opacity .35s var(--ease),transform .35s var(--ease)}
.cap.is-on{opacity:1;transform:none}
.rail{position:absolute;inset:auto 0 0 0;height:3px;background:rgba(249,241,232,.18)}
.rail i{display:block;height:100%;width:100%;background:var(--brass);transform-origin:right;transform:scaleX(var(--rp,0))}
.ai-note{margin:0;font-size:12.5px;opacity:.7}
@media (max-width:760px){
  .film-frame{aspect-ratio:4/5;max-height:58svh;width:min(100%,460px)}
  .film-frame--pain{aspect-ratio:auto}
  .scene-head h2{font-size:23px}
}
@media (prefers-reduced-motion:reduce){
  .scene{height:auto!important}.scene .sstage{position:static;height:auto;padding-block:64px}
  .film-frame--pain img{transform:none;opacity:1}
  .film-canvas--b{display:none}
  .cap{position:static;opacity:1;transform:none;grid-area:auto}.cap-row{display:block}.cap:not([data-still]){display:none}
}

/* Section two: one continuous room, five scroll-driven chapters. */
.value-story{position:relative;height:500svh;background:#160D07;color:#F8F2EB;isolation:isolate}
.value-stage{position:sticky;top:var(--hh,76px);height:calc(100svh - var(--hh,76px));min-height:600px;display:flex;flex-direction:column;padding:24px clamp(22px,5vw,86px) 18px;overflow:hidden;background:radial-gradient(ellipse at 26% 47%,#B9975B16 0,transparent 62%),linear-gradient(180deg,#160D07,#1C110A 68%,#160D07)}
.value-stage::after{content:"";position:absolute;width:55%;height:150%;left:12%;top:-35%;transform:rotate(-28deg) translateX(calc(var(--value-p,0)*80px));background:linear-gradient(90deg,transparent,#D6BE8C08,transparent);pointer-events:none;z-index:-1}
.value-top{display:flex;justify-content:space-between;gap:20px;color:#D6BE8C;font-size:12px;letter-spacing:.03em}
.value-scroll-hint{color:#C9BDB0}.value-scroll-hint span{display:inline-block;margin-right:8px}
.value-layout{flex:1;min-height:0;display:grid;grid-template-columns:46% 54%;align-items:center;max-width:1440px;width:100%;margin:auto}
.value-copy{position:relative;z-index:3;display:grid;padding-left:20px}
.value-chapter{grid-area:1/1;opacity:0;visibility:hidden;transform:translateY(24px);transition:opacity 500ms ease,transform 650ms var(--ease),visibility 500ms;pointer-events:none}
.value-chapter.is-current{opacity:1;visibility:visible;transform:none;pointer-events:auto}
.value-eyebrow{color:#D6BE8C;font-size:13px;margin:0 0 14px}
.value-chapter h2{font-size:clamp(29px,3.35vw,52px);font-weight:750;line-height:1.6;margin:0 0 18px;letter-spacing:-.04em;text-wrap:balance}
.value-chapter h2 em{color:#E7C783;font-style:normal}
.value-chapter>p:not(.value-eyebrow){max-width:43ch;color:#CFC2B4;font-size:clamp(14px,1.2vw,17px);line-height:2.05;margin:0 0 22px}
.value-payoff{position:relative;border-right:2px solid #B9975B;padding:2px 17px 2px 0;max-width:42ch}
.value-payoff>span{display:block;font-size:11px;color:#CDB791;margin-bottom:6px}
.value-payoff strong{font-size:clamp(15px,1.4vw,19px);line-height:1.9;color:#F5E9D4;font-weight:650}
.value-next{display:inline-block;margin-top:18px;color:#E7C783;font-size:13px;text-underline-offset:5px}
.value-world{position:relative;isolation:isolate;width:100%;max-width:640px;height:min(55vw,530px);min-height:370px;justify-self:center;perspective:1200px}
.value-light{position:absolute;inset:8% 6%;border-radius:50%;background:radial-gradient(ellipse,#B9975B20,transparent 65%);filter:blur(25px);transform:scale(calc(.8 + var(--value-p,0)*.4));pointer-events:none}
.value-orbit{position:absolute;inset:10% 4%;border:1px solid #B9975B18;border-radius:50%;transform:rotate(-20deg) scaleY(.78);box-shadow:0 0 0 46px #B9975B04,0 0 0 93px #B9975B03}
.value-ref{position:absolute;width:clamp(90px,10vw,139px);padding:6px 6px 10px;border:1px solid #D6BE8C55;background:#38291D;box-shadow:0 25px 45px #0006;transition:transform 1000ms var(--ease),opacity 700ms ease,filter 700ms;border-radius:12px}
.value-ref img{display:block;width:100%;height:auto;aspect-ratio:4/5;object-fit:cover;border-radius:7px}
.value-ref span{display:block;text-align:center;font-size:11px;color:#E7D7BF;padding-top:8px}
.ref-a{left:2%;top:17%;transform:rotate(-17deg) translateY(calc(var(--value-local,0)*-16px))}
.ref-b{left:36%;top:5%;transform:rotate(11deg) translateY(calc(var(--value-local,0)*12px))}
.ref-c{right:1%;top:35%;transform:rotate(18deg) translateY(calc(var(--value-local,0)*-18px))}
.value-portrait{position:absolute;width:36%;height:68%;left:32%;top:15%;padding:5px;border:1px solid #D6BE8CB3;border-radius:48% 48% 12px 12px / 31% 31% 12px 12px;background:linear-gradient(135deg,#E2C997,#79603C,#D6BE8C);box-shadow:0 30px 65px #0005;opacity:0;transform:translateY(35px) scale(.86);transition:transform 1000ms var(--ease),opacity 800ms ease;z-index:2}
.value-portrait__glass{position:relative;width:100%;height:100%;overflow:hidden;border-radius:inherit;background:#B3A68D}
.value-portrait__glass img{position:absolute;width:330%;max-width:none;height:auto;left:50%;top:45%;transform:translate(-50%,-43%)}
.value-portrait__label{position:absolute;bottom:-38px;left:-25%;width:150%;text-align:center;font-size:12px;color:#D6BE8C;white-space:nowrap;transition:opacity 500ms}
.value-choice{position:absolute;z-index:4;left:12%;bottom:10%;max-width:77%;display:flex;gap:12px;align-items:center;padding:13px 18px;background:#39291DEB;border:1px solid #B9975B70;border-radius:16px;backdrop-filter:blur(12px);opacity:0;transform:translateY(25px);transition:transform 700ms var(--ease),opacity 600ms}
.value-choice__tick{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid #D6BE8C;color:#E7C783;font-size:17px}
.value-choice small,.value-choice strong{display:block}.value-choice small{font-size:10px;color:#C9B9A3;margin-bottom:3px}.value-choice strong{font-size:13px;font-weight:600}
.value-work{position:absolute;right:0;top:27%;width:52%;padding:22px;border-right:1px solid #B9975B66;background:linear-gradient(90deg,transparent,#332316E6);z-index:3;opacity:0;transform:translateX(24px);transition:transform 850ms var(--ease),opacity 650ms}
.value-work>span{font-size:11px;color:#D6BE8C}.value-work strong{display:block;font-size:clamp(18px,2vw,27px);line-height:1.9;font-weight:600;margin:12px 0}.value-work small{font-size:10px;line-height:1.9;color:#C9B9A3}.value-work__line{height:1px;background:linear-gradient(90deg,transparent,#B9975B);margin:10px 0}
.value-link{position:absolute;z-index:4;right:1%;top:23%;width:63%;padding:24px;border:1px solid #B9975B66;border-radius:24px;background:linear-gradient(145deg,#F7F0E5,#E7D9C4);color:#291A0E;box-shadow:0 30px 55px #0005;opacity:0;transform:translateY(40px) rotateY(-12deg);transition:transform 950ms var(--ease),opacity 650ms}
.value-link__top{display:flex;justify-content:space-between;font-size:10px;border-bottom:1px solid #B9975B66;padding-bottom:12px}.value-link__top span:first-child{font-size:16px;font-weight:800}.value-link>strong{display:block;font-size:22px;margin:20px 0 10px;font-weight:700}.value-link__try{font-size:11px;color:#6C5945}.value-link__button{padding:10px 13px;background:#20140C;border:1px solid #B9975B;border-radius:22px;font-size:12px;margin:20px 0 12px;color:#F8F2EB;display:flex;justify-content:space-between}.value-link>small{font-size:10px;color:#6C5945}
.value-request{position:absolute;left:6%;right:0;top:19%;z-index:5;border:1px solid #B9975B66;border-radius:24px;background:#302218F2;box-shadow:0 35px 80px #0008;backdrop-filter:blur(16px);padding:22px;opacity:0;transform:translateY(65px) scale(.93);transition:transform 950ms var(--ease),opacity 650ms}
.value-request__head{display:flex;align-items:center;gap:10px;border-bottom:1px solid #B9975B33;padding-bottom:16px}.value-request__avatar{width:35px;height:35px;border:1px solid #B9975B88;border-radius:50%;display:grid;place-items:center;color:#E7C783}.value-request__head strong,.value-request__head small{display:block}.value-request__head strong{font-size:13px}.value-request__head small{font-size:10px;color:#C9B9A3}.value-request__badge{font-size:10px;color:#D6BE8C;margin-right:auto}
.value-request__body{display:flex;gap:16px;align-items:center;padding:22px 0}.value-request__photo{position:relative;display:block;width:82px;height:100px;flex-shrink:0;overflow:hidden;border-radius:12px;background:#B3A68D}.value-request__photo img{position:absolute;width:400%;max-width:none;left:50%;top:45%;transform:translate(-50%,-43%)}.value-request__body small,.value-request__body strong,.value-request__body div>span{display:block}.value-request__body small{font-size:10px;color:#C9B9A3}.value-request__body strong{font-size:17px;margin:9px 0;line-height:1.6}.value-request__body div>span{font-size:11px;color:#C9B9A3}.value-request__statuses{display:flex;gap:6px}.value-request__statuses span{flex:1;text-align:center;font-size:10px;padding:7px 3px;border:1px solid #B9975B55;border-radius:8px;color:#E4D4B7}.value-request__reply{font-size:11px;color:#E7C783;text-align:center;margin-top:15px}
.value-demo-label{position:absolute;bottom:-8px;left:0;right:0;text-align:center;font-size:10px;color:#B7A48D}
.value-world[data-value-state="0"] .value-portrait{opacity:.18;filter:blur(2px);transform:scale(.85)}
.value-world:not([data-value-state="0"]) .value-portrait{opacity:1;transform:none}
.value-world:not([data-value-state="0"]) .ref-a{opacity:.15;transform:translate(-50px,-25px) rotate(-25deg) scale(.8)}
.value-world:not([data-value-state="0"]) .ref-b{opacity:.12;transform:translateY(-25px) rotate(16deg) scale(.8)}
.value-world:not([data-value-state="0"]) .ref-c{opacity:.12;transform:translate(35px,20px) rotate(25deg) scale(.8)}
.value-world[data-value-state="1"] .value-choice{opacity:1;transform:none}
.value-world[data-value-state="2"] .value-portrait{transform:translateX(-55%) scale(.85)}
.value-world[data-value-state="2"] .value-work{opacity:1;transform:none}
.value-world[data-value-state="2"] .value-portrait__label{opacity:0}
.value-world[data-value-state="3"] .value-portrait{transform:translateX(-65%) scale(.72);opacity:.6}
.value-world[data-value-state="3"] .value-link{opacity:1;transform:none}
.value-world[data-value-state="3"] .value-portrait__label{opacity:0}
.value-world[data-value-state="4"] .value-portrait{opacity:.1;transform:scale(.8)}
.value-world[data-value-state="4"] .value-request{opacity:1;transform:none}
.value-world[data-value-state="4"] .value-portrait__label{opacity:0}
.value-bottom{position:relative;z-index:6;width:100%;max-width:1440px;margin:14px auto 0}
.value-chapters{display:flex;gap:6px;justify-content:space-between}.value-chapters button{font:inherit;background:none;border:0;color:#998976;cursor:pointer;text-align:right;display:flex;align-items:center;gap:9px;font-size:12px;min-height:44px;padding:4px 8px;transition:color 250ms}.value-chapters button span{font-size:10px;color:#9D8359}.value-chapters button[aria-current="step"]{color:#F1DAAC}.value-chapters button[aria-current="step"] span{color:#E7C783}
.value-progress{height:1px;background:#B9975B30}.value-progress i{display:block;width:100%;height:100%;background:#D6BE8C;transform:scaleX(var(--value-p,0));transform-origin:right}
.value-bottom>p{margin:9px 0 0;font-size:10px;color:#A99883;text-align:center}
@media(max-width:900px){.value-stage{padding:18px 20px 14px;min-height:0}.value-layout{display:flex;flex-direction:column;justify-content:center;gap:12px}.value-copy{width:100%;padding:0}.value-chapter h2{font-size:clamp(24px,6.5vw,34px);line-height:1.65;margin-bottom:10px}.value-chapter h2 br{display:none}.value-eyebrow{font-size:11px;margin-bottom:6px}.value-chapter>p:not(.value-eyebrow){font-size:13px;line-height:1.9;max-width:none;margin-bottom:12px}.value-payoff>span{display:none}.value-payoff strong{font-size:13px}.value-world{height:35svh;min-height:220px;max-height:340px;width:min(100%,440px);margin:0 auto}.value-portrait{width:30%;left:35%;height:80%;top:7%}.value-ref{width:80px;padding:4px 4px 6px}.value-ref span{font-size:9px}.value-demo-label{bottom:-4px;font-size:9px}.value-portrait__label{bottom:-22px;font-size:10px}.value-choice{padding:8px 12px;left:7%;bottom:0}.value-choice strong{font-size:11px}.value-choice small{font-size:9px}.value-work{top:15%;padding:15px}.value-work strong{font-size:17px;margin:6px 0}.value-work small{font-size:9px}.value-link{top:5%;padding:15px}.value-link>strong{font-size:18px;margin:12px 0 5px}.value-link__button{margin:10px 0 8px}.value-request{top:2%;padding:14px;left:4%}.value-request__body{padding:12px 0}.value-request__photo{width:54px;height:65px}.value-request__body strong{font-size:14px;margin:5px 0}.value-request__reply{font-size:10px;margin-top:10px}.value-top{font-size:10px}.value-scroll-hint{font-size:9px}.value-chapters{gap:0}.value-chapters button{font-size:10px;padding:3px 0;gap:4px}.value-chapters button span{font-size:8px}.value-bottom{margin-top:8px}.value-bottom>p{font-size:9px;line-height:1.7}.value-next{font-size:11px;margin-top:10px}}
/* No pinning or hidden copy when motion is reduced or the screen is too short. */
@media(prefers-reduced-motion:reduce),(max-height:640px){.value-story{height:auto}.value-stage{position:relative;top:auto;height:auto;min-height:0;padding-block:36px}.value-layout{display:block}.value-copy{display:block;padding:0}.value-chapter{opacity:1;visibility:visible;transform:none;pointer-events:auto;margin:0 auto 48px;max-width:760px;transition:none}.value-chapter:last-child{margin-bottom:20px}.value-world{display:none}.value-bottom{margin-top:0}.value-chapters,.value-progress,.value-scroll-hint{display:none}.value-top{margin-bottom:34px}}
.value-portrait__glass img{width:800%}
.value-request__photo img{width:800%}
/* A clipped stage cannot become an inner scroll container when a chapter button receives focus. */
.value-stage{overflow:clip}

@media(max-width:900px) and (min-height:641px) and (max-height:780px){.value-world{height:26svh;min-height:170px}.value-chapter h2{font-size:23px;line-height:1.5}.value-chapter>p:not(.value-eyebrow){font-size:12px;line-height:1.85}.value-payoff strong{font-size:12px}.value-request__head{padding-bottom:9px}.value-request__body{padding:9px 0}.value-request__reply{margin-top:8px}}

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

.compare{margin-top:0}
@media (max-width:1100px){.selection{padding-top:56px}.compare{margin:0 auto}}
</style>
</head>
<body>
<a class="skip" href="#main">رفتن به محتوای اصلی</a>

<header class="site-header">
  <a class="brand" href="#intro" aria-label="آینه، بازگشت به ابتدای صفحه">آینه<small>| AYNEH</small></a>
  <nav class="nav" aria-label="ناوبری اصلی">
    <a href="#experience">تجربه آینه</a>
    <a href="#services">خدمات</a>
    <a href="#how">نحوه کار</a>
    <a href="#salons">برای سالن‌ها</a>
    <a href="#faq">پرسش‌ها</a>
  </nav>
  <div class="header-actions">
    <a class="btn" href="#start"><span>صفحهٔ آزمایشی رایگان</span><span class="arrow" aria-hidden="true">←</span></a>
    <button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="باز کردن فهرست">
      <span class="menu-bars" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="فهرست موبایل" hidden>
    <p class="menu-kicker">فهرست آینه</p>
    <a class="menu-link" href="#experience"><span>تجربه آینه</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#services"><span>خدمات: مو، ناخن، مژه</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#how"><span>نحوه کار</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#salons"><span>برای سالن‌ها</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#plans"><span>پلن‌ها</span><span aria-hidden="true">↙</span></a>
    <a class="menu-link" href="#faq"><span>پرسش‌ها</span><span aria-hidden="true">↙</span></a>
  </nav>
</header>

<main id="main">
  <!-- 1. Hero: copy + the mirror studio. The photo, hair canvas and podium dock live on one plate so they never drift apart. -->
  <section id="intro" class="film" aria-labelledby="h1" tabindex="-1">
    <div class="stage" id="stage" data-demo="loading">
      <div class="copy" id="copy">
        <p class="eyebrow reveal">برای صاحبان سالن مو، ناخن و مژه</p>
        <h1 id="h1" class="reveal">مشتری‌تان اول روی خودش می‌بیند، بعد برای شما می‌فرستد.</h1>
        <p class="lead reveal">مشتری عکس چهره یا دستش را بارگذاری می‌کند؛ مدل مو، رنگ مو، طرح ناخن یا مدل مژهٔ دلخواهش را روی خودش می‌بیند و انتخابی را که می‌پسندد، همراه تصویر برای سالن شما می‌فرستد. شما هم همان‌جا در تلگرام یا بله، درخواست را تأیید یا رد می‌کنید.</p>
        <div class="cta-row reveal"><a class="btn btn--lg" href="#start"><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a><a class="btn btn--ghost" data-try="hair" href="/s/demo?l=hair"><span>همین حالا با تصویر خودتان امتحان کنید</span></a></div>
        <p class="fineprint reveal">رایگان و بدون کارت بانکی: ۱۰ ساعت و ۵ تصویر. شبیه‌سازی پیشنهادی است و نتیجه را تضمین نمی‌کند.</p>
      </div>

      <div class="studio" id="studio">
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
              <a class="btn" data-try="hair" href="/s/demo?l=hair">با تصویر خودتان امتحان کنید <span aria-hidden="true">←</span></a>
              <button type="button" id="backToMirror">بازگشت به آینه</button>
            </div>
            <div class="dock glass" id="dock">
              <h2 id="dock-h">مدل مو · روی این چهره امتحان کنید</h2>
              <div class="dock-view">
                <div class="dock-track hscroll" id="dockTrack" role="radiogroup" aria-labelledby="dock-h"></div>
                <button type="button" class="nav-btn nav-r" id="dkPrev" aria-label="مدل‌های قبلی">›</button>
                <button type="button" class="nav-btn nav-l" id="dkNext" aria-label="مدل‌های بعدی">‹</button>
              </div>
              <button type="button" class="more" id="more" aria-expanded="false" aria-controls="styles"><span>دیدن همهٔ مدل‌ها با عکس مرجع</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5"/></svg></button>
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
            <a class="btn" href="#start"><span>همین را برای سالنم بساز</span><span class="arrow" aria-hidden="true">←</span></a>
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
          <button type="button" class="nav-btn nav-r" id="stPrev" aria-label="مدل‌های قبلی">›</button>
          <button type="button" class="nav-btn nav-l" id="stNext" aria-label="مدل‌های بعدی">‹</button>
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

  <!-- Salon value narrative, followed by the existing transformation and service films. -->
  <section id="pain" class="value-story on-dark" aria-label="از دغدغه‌های روزانهٔ سالن تا یک انتخاب روشن">
    <noscript><style>.value-story{height:auto}.value-story .value-stage{position:static;height:auto;min-height:0}.value-story .value-layout,.value-story .value-copy{display:block}.value-story .value-chapter{opacity:1;visibility:visible;transform:none;pointer-events:auto;margin:40px 0}.value-story .value-world,.value-story .value-chapters,.value-story .value-progress,.value-story .value-scroll-hint{display:none}</style></noscript>
    <div class="value-stage">
      <div class="value-top"><span>آینه، در روزِ کاری شما</span><span class="value-scroll-hint">با اسکرول، داستان را دنبال کنید <span aria-hidden="true">↓</span></span></div>
      <div class="value-layout">
        <div class="value-copy">
          <article class="value-chapter is-current" data-value-chapter="0" aria-labelledby="h-pain">
            <p class="value-eyebrow">تردید مشتری، قبل از شروع کار</p>
            <h2 id="h-pain">«دوستش دارم…<br>اما اگر <em>بهم نیاید؟</em>»</h2>
            <p>مشتری مدل را روی چهرهٔ دیگری دیده؛ هنوز نمی‌داند برای خودش چه شکلی می‌شود. توضیح‌دادن همیشه این تردید را برطرف نمی‌کند.</p>
            <div class="value-payoff"><span>با آینه</span><strong>انتخابش را روی تصویر خودش می‌بیند.</strong></div>
          </article>
          <article class="value-chapter" data-value-chapter="1" aria-labelledby="value-h1">
            <p class="value-eyebrow">وقتی هر عکس، یک برداشت متفاوت است</p>
            <h2 id="value-h1">قبل از صندلی،<br>به یک <em>تصویر مشترک</em> برسید.</h2>
            <p>مشتری عکس خودش و مدل دلخواهش را انتخاب می‌کند. گفت‌وگو دربارهٔ مدل مو، رنگ، ناخن یا مژه از یک تصویر مشخص شروع می‌شود.</p>
            <div class="value-payoff"><span>برای مشاوره</span><strong>به‌جای حدس‌زدن، دربارهٔ چیزی که می‌بینید حرف بزنید.</strong></div>
          </article>
          <article class="value-chapter" data-value-chapter="2" aria-labelledby="value-h2">
            <p class="value-eyebrow">نمونه‌کاری که باید دیده شود</p>
            <h2 id="value-h2">کارِ خودتان را<br>وارد <em>تصمیم مشتری</em> کنید.</h2>
            <p>عکس نمونه‌کار را برای ربات بفرستید تا روی صفحهٔ سالن قرار بگیرد. مشتری می‌تواند از نمونه‌کارهای قابل‌آزمایش شما برای انتخابش استفاده کند.</p>
            <div class="value-payoff"><span>برای معرفی خدمات</span><strong>تصویر دارید؛ نه فقط توضیح.</strong></div>
          </article>
          <article class="value-chapter" data-value-chapter="3" aria-labelledby="value-h3">
            <p class="value-eyebrow">ارتباطی که از قبلِ مراجعه شروع می‌شود</p>
            <h2 id="value-h3">یک لینک از سالن شما.<br>یک <em>شروع شخصی‌تر.</em></h2>
            <p>لینک اختصاصی سالن را در اینستاگرام و پیام‌رسان‌ها بگذارید. مشتری وارد صفحهٔ شما می‌شود و با عکس خودش انتخاب‌ها را امتحان می‌کند.</p>
            <div class="value-payoff"><span>برای معرفی سالن</span><strong>به‌جای یک توضیح دیگر، تجربه‌ای برای امتحان‌کردن بدهید.</strong></div>
          </article>
          <article class="value-chapter" data-value-chapter="4" aria-labelledby="value-h4">
            <p class="value-eyebrow">درخواست کامل، بدون پنل تازه</p>
            <h2 id="value-h4">مشتری با تصویر می‌فرستد.<br>شما <em>روشن پاسخ می‌دهید.</em></h2>
            <p>عکس، انتخاب و توضیح مشتری در تلگرام یا بلهٔ سالن می‌رسد. وضعیت درخواست را همان‌جا مشخص می‌کنید؛ مشتری هم پاسخ را در صفحهٔ خودش می‌بیند.</p>
            <div class="value-payoff"><span>برای ادامهٔ ارتباط</span><strong>یک درخواست قابل‌پیگیری، در همان پیام‌رسان آشنا.</strong></div>
            <a class="value-next" href="#experience">نمونهٔ دریافت و پاسخ سالن را ببینید <span aria-hidden="true">←</span></a>
          </article>
        </div>
        <div class="value-world" data-value-state="0" aria-label="روایت تصویری نمونه از انتخاب مشتری تا درخواست سالن">
          <div class="value-orbit" aria-hidden="true"></div><div class="value-light" aria-hidden="true"></div>
          <div class="value-references" aria-hidden="true">
            <div class="value-ref ref-a"><img data-value-asset="s04" alt="" width="240" height="300" loading="lazy"><span>شبیه این بشود؟</span></div>
            <div class="value-ref ref-b"><img data-value-asset="s09" alt="" width="240" height="300" loading="lazy"><span>یا این مدل؟</span></div>
            <div class="value-ref ref-c"><img data-value-asset="s06" alt="" width="240" height="300" loading="lazy"><span>به من هم می‌آید؟</span></div>
          </div>
          <div class="value-portrait"><div class="value-portrait__glass"><img id="valuePortrait" src="/landing/hero.webp" alt="چهرهٔ نمونه در آینه؛ انتخاب مدل مو روی تصویر خود مشتری" width="1376" height="768"></div><span class="value-portrait__label">روی تصویر خودِ مشتری</span></div>
          <div class="value-choice" aria-hidden="true"><span class="value-choice__tick">✓</span><div><small>انتخاب قابل‌دیدن</small><strong id="valueChoiceText">مدل و رنگ دلخواه مشتری</strong></div></div>
          <div class="value-work" aria-hidden="true"><span>از نمونه‌کارِ سالن</span><strong>از یک عکسِ کار شما<br>تا انتخابِ مشتری</strong><div class="value-work__line"></div><small>ارسال عکس به ربات ← نمایش در صفحهٔ سالن</small></div>
          <div class="value-link" aria-hidden="true"><div class="value-link__top"><span>آینه</span><span>صفحهٔ سالن شما</span></div><strong>اول روی خودت ببین.</strong><span class="value-link__try">مدل مو · رنگ مو · ناخن · مژه</span><div class="value-link__button">امتحان با تصویر خودم <span>←</span></div><small>لینکی که می‌توانید برای مشتری بفرستید</small></div>
          <div class="value-request" aria-hidden="true"><div class="value-request__head"><span class="value-request__avatar">آ</span><div><strong>ربات سالن شما</strong><small>تلگرام یا بله</small></div><span class="value-request__badge">درخواست تازه</span></div><div class="value-request__body"><span class="value-request__photo"><img id="valueRequestPhoto" src="/landing/hero.webp" alt="" width="1376" height="768"></span><div><small>عکس و انتخاب مشتری، همراه هم</small><strong id="valueRequestChoice">درخواست مشاوره</strong><span>تصویر و توضیحات پیوست شد.</span></div></div><div class="value-request__statuses"><span>تماس گرفتم</span><span>نوبت شد</span><span>انجام نمی‌دهم</span></div><div class="value-request__reply">پاسخ سالن در صفحهٔ مشتری دیده می‌شود.</div></div>
          <span class="value-demo-label">روایت نمایشیِ امکانات آینه</span>
        </div>
      </div>
      <div class="value-bottom"><nav class="value-chapters" aria-label="بخش‌های روایت ارزش آینه"><button type="button" data-value-go="0" aria-current="step"><span>۰۱</span> تردید</button><button type="button" data-value-go="1"><span>۰۲</span> مشاوره</button><button type="button" data-value-go="2"><span>۰۳</span> نمونه‌کار</button><button type="button" data-value-go="3"><span>۰۴</span> ارتباط</button><button type="button" data-value-go="4"><span>۰۵</span> درخواست</button></nav><div class="value-progress" aria-hidden="true"><i></i></div><p>شبیه‌سازی یک پیشنهاد تصویری است؛ امکان اجرا، زمان و هزینه را سالن مشخص می‌کند.</p></div>
    </div>
  </section>

  <section id="transform" class="scene scene--dark on-dark" data-scene="transform" aria-labelledby="h-tr">
    <div class="sstage">
      <div class="scene-head">
        <p class="kicker">با آینه</p>
        <h2 id="h-tr">از یک عکس تا تصمیم، چند ثانیه.</h2>
      </div>
      <figure class="film-frame">
        <canvas class="film-canvas" data-set="hair" data-n="52" data-fx=".5" role="img" aria-label="موی بلند و مسی یک مشتری که تدریجی به باب بلوند شامپاینی تبدیل می‌شود"></canvas>
        <figcaption class="cap-row"><span class="cap is-on" data-from="0" data-to=".34">مشتری یک عکس از خودش می‌گذارد: موی بلند و مسی.</span><span class="cap" data-from=".34" data-to=".7">مدل و رنگ دلخواهش را انتخاب می‌کند.</span><span class="cap" data-still data-from=".7" data-to="1.01">نتیجه را روی خودش می‌بیند و با خیال راحت می‌آید.</span></figcaption>
        <div class="rail" aria-hidden="true"><i id="railTr"></i></div>
      </figure>
      <p class="ai-note">نمونهٔ تصویری ساخته‌شده با هوش مصنوعی</p>
    </div>
  </section>

  <section id="lines" class="scene scene--dark on-dark" data-scene="lines" aria-labelledby="h-ln">
    <div class="sstage">
      <div class="scene-head">
        <p class="kicker">ناخن و مژه</p>
        <h2 id="h-ln">برای ناخن و مژه هم همین‌طور.</h2>
      </div>
      <figure class="film-frame">
        <canvas class="film-canvas" data-set="nails" data-n="45" data-fx=".5" role="img" aria-label="ناخن‌های ساده که به فرنچ بادامی با خط طلایی تبدیل می‌شوند"></canvas>
        <canvas class="film-canvas film-canvas--b" data-set="lashes" data-n="43" data-fx=".42" role="img" aria-label="مژه‌های طبیعی که پرتر و حالت‌دارتر می‌شوند"></canvas>
        <figcaption class="cap-row"><span class="cap is-on" data-still data-from="0" data-to=".5">طرح ناخن را قبل از لاک روی دست خودش می‌بیند.</span><span class="cap" data-from=".5" data-to="1.01">حالت مژه را قبل از اکستنشن می‌بیند.</span></figcaption>
        <div class="rail" aria-hidden="true"><i id="railLn"></i></div>
      </figure>
      <p class="ai-note">نمونهٔ تصویری ساخته‌شده با هوش مصنوعی</p>
    </div>
  </section>

  <section class="cta-band" aria-labelledby="h-cta1">
    <div class="cta-band__in">
      <h2 id="h-cta1">دوست دارید مشتری‌های شما همین تجربه را داشته باشند؟</h2>
      <p>صفحهٔ سالن خودتان را همین حالا بسازید و درست مثل یک مشتری امتحانش کنید. رایگان است و کارت بانکی نمی‌خواهد.</p>
      <a class="btn btn--lg" href="#start" data-cta="mid"><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a>
    </div>
  </section>

  <!-- 2. Request lands in the salon chat (carries the visitor's mirror selection) -->
  <section id="experience" class="s2 on-dark" aria-labelledby="h-exp" tabindex="-1">
    <div class="s2-grid wrap">
      <div class="s2-copy">
        <p class="kicker">بعد از انتخاب مشتری</p>
        <h2 id="h-exp">درخواست مشتری، با عکس و همهٔ جزئیات، در چت سالن می‌نشیند.</h2>
        <p class="sub">هر درخواست با عکس، مدل و رنگ انتخاب‌شده به ربات تلگرام یا بله شما می‌رسد. با یک ضربه وضعیتش را مشخص می‌کنید و مشتری همان را در صفحهٔ خودش می‌بیند.</p>
        <ul class="s2-points">
          <li><strong>چیز تازه‌ای یاد نمی‌گیرید</strong><span>شما و همکارانتان همان پیام‌رسانی را باز می‌کنید که هر روز باز می‌کنید.</span></li>
          <li><strong>وضعیت با یک ضربه</strong><span>«تماس گرفتم»، «نوبت شد» یا «انجام نمی‌دهم»؛ بدون تایپ کردن.</span></li>
          <li><strong>مشتری بی‌خبر نمی‌ماند</strong><span>نتیجهٔ همان ضربه در صفحهٔ خود مشتری دیده می‌شود.</span></li>
        </ul>
        <div class="s2-cta">
          <a class="btn btn--lg" href="#start"><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a>
          <a class="btn btn--ghost" href="#plans">دیدن قیمت پلن‌ها</a>
        </div>
      </div>

      <div class="s2-demo" id="s2demo">
        <div class="phone" role="group" aria-label="نمونهٔ نمایشی چت ربات سالن">
          <div class="phone-top"><span class="av" aria-hidden="true">آ</span><div><strong>ربات سالن</strong><small>آینه · نمونهٔ نمایشی</small></div></div>
          <div class="push" id="s2push" aria-hidden="true"><span class="dot"></span>درخواست تازه از صفحهٔ سالن</div>
          <div class="chat" id="s2chat" aria-live="polite">
            <div class="msg in" id="s2msg">
              <span class="ph"><img id="s2img" loading="lazy" alt="" width="240" height="300"></span>
              <div class="body">
                <strong>درخواست مشاوره</strong>
                <dl><div><dt>مدل</dt><dd id="s2style">ولف‌کات</dd></div><div><dt>رنگ</dt><dd id="s2color">کاراملی</dd></div><div><dt>عکس مشتری</dt><dd>پیوست شد</dd></div></dl>
                <small id="s2tag">نمونه؛ با انتخاب در آینه عوض می‌شود</small>
              </div>
            </div>
            <div class="actions" id="s2acts" role="group" aria-label="وضعیت درخواست">
              <button type="button" data-s="called">تماس گرفتم</button>
              <button type="button" data-s="booked">نوبت شد</button>
              <button type="button" data-s="declined">انجام نمی‌دهم</button>
            </div>
            <div class="msg out" id="s2out" hidden><span id="s2outText"></span></div>
          </div>
        </div>
        <div class="cust" id="s2cust" aria-live="polite">
          <small>مشتری در صفحهٔ سالن می‌بیند</small>
          <strong id="s2custText">درخواست شما به دست سالن رسید.</strong>
        </div>
      </div>
    </div>
  </section>


  <!-- 3. Services -->
  <section id="services" class="section" aria-labelledby="h-svc" tabindex="-1">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker">مو، ناخن، مژه</p>
        <h2 id="h-svc">سه خدمت، هر کدام با انتخاب‌های خودش.</h2>
        <p class="sub">بالای صفحهٔ سالن شما یک کلید سه‌حالته است. مشتری بین مو، ناخن و مژه جابه‌جا می‌شود و هر کدام عکس، انتخاب و نتیجهٔ جدا دارد.</p>
      </div>
      <div class="cards3">
        <article class="svc">
          <div class="ico"><span><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 4c-5 0-8 3.800-8 8.500V18c0 2 .8 3.600 2 4.800V28l3.200-2.400L16 28l2.800-2.400L22 28v-5.200c1.200-1.200 2-2.800 2-4.800v-5.500C24 7.800 21 4 16 4z"/><path d="M11 13c3 0 6-1.600 8-4 .8 2 2 3.200 3.800 3.800"/></svg></span></div>
          <h3>مدل و رنگ مو</h3>
          <p>مشتری یکی از مدل‌های آماده یا نمونه‌کارهای خود شما را برمی‌دارد، رنگ را از سواچ‌ها انتخاب می‌کند یا می‌نویسد و اگر شبیه‌سازی برای سالن روشن باشد، نتیجه را روی عکس خودش می‌بیند. نمای ۳۶۰ درجه هم برای مو هست.</p>
          <ul class="picks"><li>ولف‌کات</li><li>پروانه‌ای</li><li>چتری پرده‌ای</li><li>آمبره</li></ul>
          <a class="btn btn--ghost svc-try" data-try="hair" href="/s/demo?l=hair"><span>امتحان روی عکس خودم</span></a>
        </article>
        <article class="svc">
          <div class="ico"><span><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M12 28V14c0-4 1.600-8 4-10 2.400 2 4 6 4 10v14"/><path d="M12 18h8"/><path d="M8 28h16"/></svg></span></div>
          <h3>طرح ناخن</h3>
          <p>مشتری عکس دستش را می‌گذارد و از بین طرح‌های آماده، فرم، طول و رنگ ناخن را انتخاب می‌کند. به‌جای حدس زدن، همان را برای شما می‌فرستد.</p>
          <p class="count">۱۸ طرح آماده</p>
          <ul class="picks"><li>فرنچ</li><li>میکرو فرنچ</li><li>کروم</li><li>کت‌آی</li><li>مرواریدی</li></ul>
          <a class="btn btn--ghost svc-try" data-try="nails" href="/s/demo?l=nails"><span>امتحان روی عکس خودم</span></a>
        </article>
        <article class="svc">
          <div class="ico"><span><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 19c3.500-5 8-7.500 13-7.500S25.500 14 29 19c-3.500 5-8 7.500-13 7.500S6.500 24 3 19z"/><circle cx="16" cy="19" r="3.600"/><path d="M5 11 7.500 14M11 7.500l1.200 3.500M16 6v4M21 7.500 19.800 11M27 11l-2.500 3"/></svg></span></div>
          <h3>مدل مژه</h3>
          <p>با یک عکس نزدیک از چشم، نوع مژه، حالت و طول را انتخاب می‌کند و می‌بیند به او می‌آید یا نه. می‌تواند از همان عکس صورتی شروع کند که برای مو گذاشته است.</p>
          <p class="count">۹ نوع مژه</p>
          <ul class="picks"><li>کلاسیک</li><li>هیبریدی</li><li>والیوم</li><li>لیفت و لمینت</li><li>گربه‌ای</li></ul>
          <a class="btn btn--ghost svc-try" data-try="lashes" href="/s/demo?l=lashes"><span>امتحان روی عکس خودم</span></a>
        </article>
      </div>
      <p class="note-bar">آینه جایگزین مشاورهٔ حضوری نیست. نتیجه تقریبی است و تصمیم نهایی، زمان و هزینه با شماست.</p>
    </div>
  </section>

  <!-- 4. How it works -->
  <section id="how" class="section section--sunken" aria-labelledby="h-how" tabindex="-1">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker">نحوه کار</p>
        <h2 id="h-how">از لینک تا درخواست کامل، سه قدم.</h2>
      </div>
      <ol class="steps">
        <li class="step"><h3>لینک را بدهید</h3><p>سالن شما یک صفحهٔ اختصاصی دارد. لینکش را در اینستاگرام، تلگرام یا همان چت با مشتری بگذارید.</p></li>
        <li class="step"><h3>مشتری انتخاب می‌کند</h3><p>عکس خودش را می‌گذارد، مدل و رنگ (یا طرح ناخن و مژه) را انتخاب می‌کند و نتیجه را روی خودش می‌بیند.</p></li>
        <li class="step"><h3>درخواست کامل به شما می‌رسد</h3><p>عکس‌ها، انتخاب‌ها و توضیح مشتری در ربات تلگرام یا بله می‌آید. خودتان تماس می‌گیرید و نوبت می‌دهید؛ آینه رزرو آنلاین ندارد.</p></li>
      </ol>
    </div>
  </section>

  <!-- 5. For salons -->
  <section id="salons" class="section section--dark on-dark" aria-labelledby="h-sal" tabindex="-1">
    <div class="wrap split">
      <div>
        <div class="sec-head" style="margin-bottom:0">
          <p class="kicker">برای سالن‌ها</p>
          <h2 id="h-sal">مشتری با تصویر روشن می‌آید، نه با «همونی که تو اینستا دیدم».</h2>
          <p class="sub">شما پنل و نرم‌افزار تازه‌ای یاد نمی‌گیرید. همه‌چیز در همان پیام‌رسانی است که هر روز استفاده می‌کنید.</p>
        </div>
        <ul class="msgrs" aria-label="پیام‌رسان‌های پشتیبانی‌شده"><li>تلگرام</li><li>بله</li></ul>
        <p class="no-list">پنل وب جدا و رزرو آنلاین ندارد. نوبت دادن مثل همیشه دست خود شماست.</p>
      </div>
      <ul class="feat">
        <li><span class="dot" aria-hidden="true"></span><div><strong>درخواست کامل در چت سالن</strong><span class="d">عکس‌ها، مدل، رنگ و توضیح مشتری یک‌جا می‌رسد، با دکمه‌های وضعیت مثل «تماس گرفتم» و «نوبت شد».</span></div></li>
        <li><span class="dot" aria-hidden="true"></span><div><strong>نمونه‌کار با ارسال یک عکس</strong><span class="d">هر عکسی که برای ربات بفرستید، روی صفحهٔ سالن به‌عنوان نمونه‌کار نشان داده می‌شود.</span></div></li>
        <li><span class="dot" aria-hidden="true"></span><div><strong>لینک شخصی برای هر آرایشگر</strong><span class="d">مشتری‌ای که با لینک یک نفر بیاید، درخواستش به همان نفر می‌رسد. مدیر سالن می‌تواند آن را جابه‌جا کند.</span></div></li>
        <li><span class="dot" aria-hidden="true"></span><div><strong>یادآوری و گزارش</strong><span class="d">درخواستی که بی‌پاسخ بماند یادآوری می‌شود و مشتری وضعیتش را در همان صفحه می‌بیند.</span></div></li>
      </ul>
    </div>
  </section>

  <!-- 6. Free trial salon page: live mockup + lead form (the single repeated CTA lands here) -->
  <section id="start" class="section trial" aria-labelledby="h-trial" tabindex="-1">
    <div class="wrap trial-grid">
      <div class="trial-col">
        <div class="sec-head">
          <p class="kicker">صفحهٔ آزمایشی رایگان</p>
          <h2 id="h-trial">صفحهٔ سالن خودتان را همین حالا بسازید.</h2>
          <p class="sub">نام سالن و رنگ برندتان را بنویسید تا صفحه‌تان ساخته شود. ده ساعت وقت دارید و پنج تصویر، درست مثل مشتری‌هایتان. هیچ پولی نمی‌پردازید.</p>
        </div>
        <form class="path path--form" id="leadForm" novalidate aria-labelledby="h-lead">
          <h3 id="h-lead">صفحهٔ آزمایشی سالن من</h3>
          <p>فقط نام سالن و شمارهٔ موبایل را بنویسید. صفحه چند ثانیه بعد آماده است.</p>
          <div class="lf-grid">
            <div class="lf-field"><label for="lf-salon">نام سالن</label><input id="lf-salon" name="salon" type="text" autocomplete="organization" maxlength="80" required></div>
            <div class="lf-field"><label for="lf-phone">شمارهٔ موبایل</label><input id="lf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="۰۹۱۲۰۰۰۰۰۰۰" maxlength="20" required></div>
            <div class="lf-field"><label for="lf-name">نام شما <span class="opt">(اختیاری)</span></label><input id="lf-name" name="name" type="text" autocomplete="name" maxlength="60"></div>
            <div class="lf-field"><label for="lf-city">شهر <span class="opt">(اختیاری)</span></label><input id="lf-city" name="city" type="text" autocomplete="address-level2" maxlength="40"></div>
          </div>
          <p class="lf-plan" id="lf-plan" hidden></p>
          <div class="lf-hp" aria-hidden="true"><label for="lf-web">وب‌سایت</label><input id="lf-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <label class="lf-check" for="lf-consent"><input id="lf-consent" name="consent" type="checkbox"><span>موافقم که آینه بعد از امتحان صفحه، برای راهنمایی با من تماس بگیرد.</span></label>
          <p class="lf-err" id="lf-err" role="alert"></p>
          <div class="lf-field" id="lf-codebox" hidden><label for="lf-code">کد پیامک‌شده به موبایل شما</label><input id="lf-code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" dir="ltr" maxlength="8" placeholder="- - - - -"><button type="button" class="lf-resend" id="lf-resend" disabled>ارسال دوبارهٔ کد</button></div>
          <button class="btn btn--lg" type="submit" id="lf-send"><span>صفحهٔ سالن مرا بساز</span><span class="arrow" aria-hidden="true">←</span></button>
          <p class="lf-micro">۱۰ ساعت · ۵ تصویر · بدون پرداخت و کارت بانکی</p>
          <p class="lf-done" id="lf-done" role="status" hidden></p>
        </form>

      </div>

      <div class="trial-mock" aria-label="پیش‌نمایش زندهٔ صفحهٔ سالن">
        <div class="brand-pick" role="radiogroup" aria-label="رنگ برند سالن">
          <span class="bp-label" id="bp-h">رنگ برند</span>
          <button type="button" role="radio" aria-checked="true" aria-label="برنجی" data-brand="#B9975B"><i style="background:#B9975B"></i></button>
          <button type="button" role="radio" aria-checked="false" aria-label="شرابی" data-brand="#8E3050"><i style="background:#8E3050"></i></button>
          <button type="button" role="radio" aria-checked="false" aria-label="سبز زیتونی" data-brand="#5E6B3A"><i style="background:#5E6B3A"></i></button>
          <button type="button" role="radio" aria-checked="false" aria-label="آبی نفتی" data-brand="#2E5468"><i style="background:#2E5468"></i></button>
        </div>
        <div class="salon-card" id="mock" style="--brand:#B9975B">
          <div class="sc-cover" aria-hidden="true"></div>
          <div class="sc-head">
            <span class="sc-logo" id="mockInit" aria-hidden="true">س</span>
            <div><strong id="mockName">نام سالن شما</strong><small id="mockCity">لینک اختصاصی برای مشتری‌ها</small></div>
          </div>
          <ul class="sc-lines" aria-hidden="true"><li class="on">مو</li><li>ناخن</li><li>مژه</li></ul>
          <div class="sc-works" aria-hidden="true"><img data-k="s01" alt="" width="240" height="300"><img data-k="s03" alt="" width="240" height="300"><img data-k="s09" alt="" width="240" height="300"></div>
          <div class="sc-cta" aria-hidden="true">مدل و رنگ را انتخاب کن و برای سالن بفرست</div>
        </div>
        <p class="mock-note">نمونهٔ نمایشی. نسخهٔ دائمی با لوگو و نمونه‌کار خودتان ساخته می‌شود.</p>
      </div>
    </div>
  </section>

  <!-- 6. Plans -->
  <section id="plans" class="section section--sunken" aria-labelledby="h-plans" tabindex="-1">
    <div class="wrap">
      <div class="sec-head">
        <p class="kicker">پلن‌ها</p>
        <h2 id="h-plans">پلن یک‌بار پرداخت می‌شود، فقط ساخت تصویر شارژ ماهانه دارد.</h2>
        <p class="sub">پلن‌ها در آموزش و تعداد کارکنانی که از آینه استفاده می‌کنند فرق دارند. پیشنهاد ما این است که اول صفحهٔ آزمایشی را امتحان کنید، بعد انتخاب کنید.</p>
      </div>
      <div class="plans">
        <article class="plan">
          <h3>Basic</h3>
          <p class="price num">۱۰ میلیون<small>تومان</small></p>
          <ul><li>تا ۲ نفر از کارکنان سالن</li><li>ویدئوهای آموزشی کار با آینه</li><li>صفحهٔ اختصاصی سالن با لینک</li></ul>
          <a class="btn btn--ghost plan-cta" href="#start" data-plan="Basic"><span>شروع با صفحهٔ آزمایشی</span></a>
        </article>
        <article class="plan plan--pro">
          <span class="badge">پیشنهادی برای شروع</span>
          <h3>Pro</h3>
          <p class="price num">۲۰ میلیون<small>تومان</small></p>
          <ul><li>تا ۵ نفر از کارکنان سالن</li><li>ویدئوهای آموزشی و یک جلسهٔ آنلاین آموزش و پرسش‌وپاسخ</li><li>همهٔ امکانات Basic به‌علاوهٔ امتحان روی نمونه‌کار سالن و ثبت نمونه‌کار از ربات</li></ul>
          <a class="btn btn--ghost plan-cta" href="#start" data-plan="Pro"><span>شروع با صفحهٔ آزمایشی</span></a>
        </article>
        <article class="plan">
          <h3>VIP</h3>
          <p class="price num"><small>از</small>۸۰ میلیون<small>تومان</small></p>
          <ul><li>تا ۲۰ نفر از کارکنان سالن</li><li>ویدئو، جلسهٔ آنلاین و جلسهٔ حضوری آموزش برای نیروهای سالن</li><li>دامنهٔ اختصاصی سالن و امکان سفارشی طبق نیاز</li></ul>
          <a class="btn btn--ghost plan-cta" href="#start" data-plan="VIP"><span>شروع با صفحهٔ آزمایشی</span></a>
        </article>
      </div>
      <p class="plan-note">ساخت تصویر هزینهٔ جدا دارد: شارژ ماهانهٔ ۱ تا ۵ میلیون تومان، بسته به تعداد تصویر.</p>
    </div>
  </section>

  <!-- 7. FAQ -->
  <section id="faq" class="section" aria-labelledby="h-faq" tabindex="-1">
    <div class="wrap">
      <div class="sec-head"><p class="kicker">پرسش‌های پرتکرار</p><h2 id="h-faq">قبل از شروع، این‌ها را می‌پرسند</h2></div>
      <div class="faq">
        <details><summary>آینه دقیقاً چیست؟</summary><p>صفحه‌ای اینترنتی با نام و رنگ برند سالن شما. مشتری روی آن مدل مو، رنگ، طرح ناخن یا مژه را روی عکس خودش امتحان می‌کند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد.</p></details>
        <details><summary>صفحهٔ آزمایشی چیست و چقدر طول می‌کشد؟</summary><p>نسخهٔ موقت همین صفحه با نام و رنگ سالن شما. ساختنش چند ثانیه طول می‌کشد، ۱۰ ساعت فعال است و ۵ تصویر دارد. رایگان است.</p></details>
        <details><summary>بعد از ثبت درخواست چه می‌شود؟</summary><p>لینک صفحه‌تان همان لحظه ساخته می‌شود و درخواست شما به ما می‌رسد. بعد از ۱۰ ساعت یا ۵ تصویر، صفحه بسته می‌شود و برای ادامه با شمارهٔ خودتان تماس می‌گیریم. پرداختی لازم نیست.</p></details>
        <details><summary>مشتری‌های من چطور وارد می‌شوند؟</summary><p>با یک لینک. آن را در اینستاگرام، تلگرام یا هر چتی با مشتری می‌گذارید. برنامه‌ای نصب نمی‌شود و صفحه در مرورگر گوشی باز می‌شود.</p></details>
        <details><summary>درخواست مشتری را کجا می‌بینم؟</summary><p>در ربات تلگرام یا بله خودتان. پنل جداگانه‌ای ندارید.</p></details>
        <details><summary>آینه نوبت می‌دهد؟</summary><p>نه. آینه فقط کمک می‌کند مشتری روشن بگوید چه می‌خواهد. نوبت، زمان و هزینه مثل همیشه با شماست.</p></details>
        <details><summary>نتیجهٔ شبیه‌سازی دقیق است؟</summary><p>نه، تقریبی است. مثل یک عکس مرجع واضح به گفتگو با آرایشگر کمک می‌کند و نتیجهٔ نهایی را تضمین نمی‌کند.</p></details>
        <details><summary>ناخن و مژه هم دارید؟</summary><p>بله. بالای صفحهٔ سالن بین مو، ناخن و مژه جابه‌جا می‌شوند و هر کدام عکس و انتخاب‌های خودش را دارد.</p></details>
        <details><summary>شبیه‌سازی برای همهٔ سالن‌ها روشن است؟</summary><p>هر سالن خودش تعیین می‌کند. اگر خاموش باشد، مشتری باز هم مدل و رنگ را انتخاب می‌کند و درخواستش را می‌فرستد.</p></details>
      </div>
    </div>
  </section>

  <section class="cta-band cta-band--final" aria-labelledby="h-cta2">
    <div class="cta-band__in">
      <h2 id="h-cta2">مشتری بعدی‌تان می‌تواند با تصویری روشن به سالن بیاید.</h2>
      <p>ده ساعت وقت دارید که خودتان امتحانش کنید. رایگان است.</p>
      <a class="btn btn--lg" href="#start" data-cta="final"><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a>
    </div>
  </section>

</main>
<a class="sticky-cta" id="stickyCta" href="#start" hidden><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a>

<footer class="site-footer">
  <div class="foot">
    <a class="brand" href="#intro">آینه<small>| AYNEH</small></a>
    <ul aria-label="پیوندهای پایین صفحه">
      <li><a href="#experience">تجربه آینه</a></li><li><a href="#services">خدمات</a></li><li><a href="#how">نحوه کار</a></li><li><a href="#salons">برای سالن‌ها</a></li><li><a href="#plans">پلن‌ها</a></li><li><a href="#faq">پرسش‌ها</a></li><li><a href="/admin">ورود مدیر</a></li>
    </ul>
  </div>
  <p class="legal">آینه، مشاورهٔ تصویری انتخاب مدل برای سالن‌های زیبایی. شبیه‌سازی‌ها پیشنهادی‌اند و نتیجهٔ نهایی را تضمین نمی‌کنند. سیاست حریم خصوصی و شرایط استفاده پس از نهایی‌شدن در همین بخش اضافه می‌شود.</p>
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
<script>window.__AYN_ASSET_VERSION="778f7774969c";window.__AYN_LOOKS=[6, 12];</script>
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
  {name:'بلوند شامپاینی',h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {name:'کاراملی',h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {name:'اسپرسو',h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {name:'آمبره',ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {name:'مسی',h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {name:'بلوند پلاتینی',h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {name:'شرابی',h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const READY=new Set([1,...(window.__AYN_LOOKS||[])]);
 const st={style:null,color:null,look:'base'};
 const film=$('intro'),stage=$('stage'),studio=$('studio'),mirror=$('mirror'),plate=$('plate'),dock=$('dock'),palette=$('colors');
 const frame='<svg class="frame" aria-hidden="true"><rect class="edge"/><rect class="orbit" pathLength="100"/></svg>';
 const ring='<svg class="frame" viewBox="0 0 48 48" aria-hidden="true"><circle class="edge" cx="24" cy="24" r="22"/><circle class="orbit" cx="24" cy="24" r="22" pathLength="100"/></svg>';
 const mobile=matchMedia('(max-width:900px)');

 /* ---------- build the three pickers ---------- */
 const make=(cls,html,onPick,box)=>{const b=document.createElement('button');b.type='button';b.className=cls;b.setAttribute('role','radio');b.setAttribute('aria-checked','false');b.innerHTML=html;(b.querySelector('.ic,.ph,.dot')||b).insertAdjacentHTML('beforeend',cls==='sw'?ring:frame);b.addEventListener('click',()=>{if(!b.closest('.hscroll')?.classList.contains('was-dragged'))onPick()});box.append(b);return b};
 const n2=i=>String(i+1).padStart(2,'0');
 const cards=STYLES.map((name,i)=>make('card','<span class="ph"><img src="'+SRC('s'+n2(i))+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>',()=>pickStyle(i),$('track')));
 const dItems=[];
 STYLES.forEach((name,i)=>{if(READY.has(i+1)){
  dItems[i]=make('d-item','<span class="ic"><img src="'+SRC('s'+n2(i))+'" alt="" draggable="false"></span><span>'+name+'</span>',()=>pickStyle(i),$('dockTrack'));
 }});
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
  dock.style.setProperty('--u',mobile.matches?'1':Math.max(.62,Math.min(1.35,s/.84)).toFixed(3));
  // phones: the podium is too small for the dock, so it sits under the mirror instead
  // phones: colours and the style dock sit under the mirror, where thumbs can reach them
  if(mobile.matches){if(dock.parentElement===plate){studio.after(palette);palette.after(dock);dock.classList.add('mobile');palette.classList.add('mobile')}}
  else if(dock.parentElement!==plate){plate.append(dock);mirror.append(palette);dock.classList.remove('mobile');palette.classList.remove('mobile')}
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
  const k=e.key,vertical=box.id==='colList';
  const dir=k==='ArrowDown'||(!vertical&&k==='ArrowLeft')?1:k==='ArrowUp'||(!vertical&&k==='ArrowRight')?-1:0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus();n.scrollIntoView({inline:'center',block:'nearest'})}));

 /* ---------- all-styles rail ---------- */
 const rail=$('styles'),more=$('more');
 function setRail(open){
  rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open){setTimeout(()=>{(cards[st.style??0]).scrollIntoView({inline:'center',block:'nearest'});syncArrows();cards[st.style??0].focus({preventScroll:true})},60)}
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),img2=$('roomImg2'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 let px=null,rafId=0,lookTok=0;const preps={};
 const loadImg=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src});
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
   const src=key==='base'?a.src:c.toDataURL('image/png');
   const thumbCanvas=document.createElement('canvas');thumbCanvas.width=240;thumbCanvas.height=300;
   thumbCanvas.getContext('2d').drawImage(c,605,235,160,235,0,0,240,300);
   const thumb=thumbCanvas.toDataURL('image/png'),index=key==='base'?0:Number(key.slice(1))-1;
   [cards[index],dItems[index]].forEach(button=>{if(button)button.querySelector('img').src=thumb});
   let x0=W,y0=H,x1=0,y1=0;for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(full[(y*W+x)*4]>6){if(x<x0)x0=x;if(x>x1)x1=x;if(y<y0)y0=y;if(y>y1)y1=y}
   if(x1<x0)throw new Error('Empty hair mask');
   const R={x:x0,y:y0,w:x1-x0+1,h:y1-y0+1},base=g.getImageData(R.x,R.y,R.w,R.h).data;
   const mkd=new Uint8ClampedArray(R.w*R.h*4);
   for(let y=0;y<R.h;y++)mkd.set(full.subarray(((R.y+y)*W+R.x)*4,((R.y+y)*W+R.x+R.w)*4),y*R.w*4);
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mkd[i*4]>6)idx.push(i);
   return {src,thumb,R,base,mk:mkd,idx,out:ctx.createImageData(R.w,R.h)};
  }).catch(()=>{delete preps[key];return null});
 }
 let transitionAnimation=null;
 const renderError=()=>{$('demoCaption').textContent='تصویر بارگیری نشد؛ دوباره انتخاب کنید.';stage.dataset.renderState='error'};
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
 function tint(c,Y,yn){let l=c.ombre?.16+(.7-.16)*sm(.3,.85,yn):c.l;l=cl(l+(Y-.4)*1.2,.03,.96);const s=c.s*(1-cl((l-.72)*2.2,0,.8));return hsl(c.h,s,l)}
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px)return;
  const {R,base,mk,idx,out}=px,o=out.data;
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,1376,768);return}
  o.fill(0);
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,yr=(i/R.w)|0,yn=yr/R.h;
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   const A=from?tint(from,Y,yn):[r0,g0,b0],B=to?tint(to,Y,yn):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=A[2]+(B[2]-A[2])*t;
   if(scan>=0){const d=yn-scan,w=Math.exp(-(d*d)/.0045)*.7;r+=(255-r)*w*.75+26*w;g+=(255-g)*w*.65+14*w;b+=(255-b)*w*.4}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,1376,768);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){run(820,x=>draw(prev,next,ease(x),x*1.3-.15),()=>draw(null,next,1,-1))}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 const mark=(list,idx)=>list.forEach((b,i)=>b?.setAttribute('aria-checked',String(i===idx)));
 async function pickColor(i){
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
   $('refNote').textContent='عکس مرجع؛ برای دیدن این مدل روی چهره، با تصویر خودتان امتحان کنید.';
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
 $('skipDemo').addEventListener('click',()=>endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.'));
 $('replayDemo').addEventListener('click',walkthrough);
 $('backToMirror').addEventListener('click',()=>{showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'});
 // Human interaction always wins. No scripted cursor intercepts a real click or keyboard action.
 const human=e=>{if(!e.isTrusted||e.target.closest('.demo-controls'))return;if(demonstrating)endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.');if(e.target.closest('#dock,#colors,#styles')){revealPortrait();showFront()}};
 film.addEventListener('pointerdown',human,true);film.addEventListener('keydown',human,true);
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')});
 const pageReady=new Promise(resolve=>{if(document.readyState==='complete')resolve();else addEventListener('load',resolve,{once:true})});
 Promise.all([pageReady,document.fonts?.ready,prepare('base'),prepare('s06'),prepare('s12')]).then(()=>{
  // Never steal attention back if the visitor started interacting or scrolled past the hero while loading.
  const r=film.getBoundingClientRect();if(played||r.bottom<innerHeight*.5||r.top>innerHeight){endDemo();return}
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
 layout();frameUpdate();
})();

</script>
<script>
/* Section 2: the hero selection becomes the request that "arrives" in the salon chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'/landing/')+k+'.'+(e||'webp'));
 const demo=$('s2demo');if(!demo)return;
 const DEFAULT={style:'ولف‌کات',idx:2,color:'کاراملی'};
 let sel=window.__AYN_SEL||null;
 function render(){
  const has=sel&&(sel.style!=null||sel.color!=null);
  const s=sel&&sel.style!=null?sel.style:DEFAULT.style,i=sel&&sel.styleIdx!=null?sel.styleIdx:DEFAULT.idx,c=sel&&sel.color!=null?sel.color:DEFAULT.color;
  $('s2style').textContent=s;$('s2color').textContent=c;$('s2img').src=SRC('s'+String(i+1).padStart(2,'0'));
  $('s2tag').textContent=has?'ترکیبی که همین الان در آینه انتخاب کردی':'نمونه؛ با انتخاب در آینه عوض می‌شود'}
 addEventListener('ayneh:selection',e=>{sel=e.detail;render()});
 render();
 /* status buttons: one tap by the salon, shown to the customer */
 const TEXT={called:['وضعیت: تماس گرفتم','سالن با شما تماس گرفت یا به‌زودی تماس می‌گیرد.'],booked:['وضعیت: نوبت شد','نوبت شما ثبت شد. جزئیات را سالن اعلام می‌کند.'],declined:['وضعیت: انجام نمی‌دهم','سالن این مدل را انجام نمی‌دهد؛ می‌توانید مدل دیگری بفرستید.']};
 const btns=[...document.querySelectorAll('#s2acts button')];
 btns.forEach(b=>b.addEventListener('click',()=>{
  btns.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  const t=TEXT[b.dataset.s];$('s2out').hidden=false;$('s2outText').textContent=t[0];$('s2custText').textContent=t[1]}));
 /* plays once when first scrolled into view; everything is visible at rest */
 if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&'IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){demo.classList.add('play');io.disconnect()}},{threshold:.25});io.observe(demo)}
})();

</script>
<script>
/* Scenes: scroll scrubs a frame sequence painted on a canvas (video.currentTime stutters on iOS).
   Frames load only when a scene is near the viewport; the first and last frame come first. */
(()=>{
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const FR=window.__AYN_FRAMES,base=(window.__AYN_BASE||'/landing/')+'f/';
 const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const url=(set,i)=>FR?FR[set][i]:base+set+'/'+String(i+1).padStart(3,'0')+'.webp';

 function seq(canvas){
  const set=canvas.dataset.set,n=+canvas.dataset.n,fx=+canvas.dataset.fx||.5,imgs=new Array(n);
  let started=false,prog=0,cw=0,ch=0;
  const ok=im=>im&&im.complete&&im.naturalWidth;
  function load(i){if(imgs[i])return;const im=new Image();im.decoding='async';im.onload=()=>paint();im.src=url(set,i);imgs[i]=im}
  function start(){if(started)return;started=true;load(0);load(n-1);for(let i=1;i<n-1;i++)setTimeout(()=>load(i),40+i*35)}
  function size(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);cw=canvas.width=Math.max(2,Math.round(r.width*d));ch=canvas.height=Math.max(2,Math.round(r.height*d));paint()}
  function paint(){
   const f=Math.round(cl(prog)*(n-1));let im=null;if(started)load(f);
   for(let k=0;k<n&&!im;k++){if(ok(imgs[f-k]))im=imgs[f-k];else if(ok(imgs[f+k]))im=imgs[f+k]}
   if(!im||!cw)return;
   const s=Math.max(cw/im.naturalWidth,ch/im.naturalHeight),w=im.naturalWidth*s,h=im.naturalHeight*s;
   canvas.getContext('2d').drawImage(im,(cw-w)*fx,(ch-h)/2,w,h);
  }
  return {start,size,set(p){prog=p;paint()},canvas};
 }

 const scenes=[...document.querySelectorAll('.scene[data-scene]')].map(el=>({el,kind:el.dataset.scene,seqs:[...el.querySelectorAll('.film-canvas')].map(seq),caps:[...el.querySelectorAll('.cap')],img:el.querySelector('#painImg'),rail:el.querySelector('.rail i')}));
 if(!scenes.length)return;
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const s=scenes.find(x=>x.el===e.target);s.seqs.forEach(q=>q.start())}}),{rootMargin:'160% 0px'});
 scenes.forEach(s=>{io.observe(s.el);s.seqs.forEach(q=>q.size())});
 addEventListener('resize',()=>scenes.forEach(s=>s.seqs.forEach(q=>q.size())));

 function update(){
  const vh=innerHeight;
  for(const s of scenes){
   const r=s.el.getBoundingClientRect();if(r.bottom<-vh||r.top>vh*2)continue;
   const p=cl(-r.top/Math.max(1,r.height-vh));
   s.caps.forEach(c=>c.classList.toggle('is-on',p>=+c.dataset.from&&p<+c.dataset.to));
   if(s.rail)s.el.style.setProperty('--rp',p);
   if(s.kind==='pain'&&s.img){const e=cl(p/.6);s.img.style.setProperty('--ps',1.14-.14*e);s.img.style.setProperty('--pr',(-2*(1-e))+'deg');s.img.style.setProperty('--po',.35+.65*e)}
   else if(s.kind==='transform'){s.seqs[0].set(cl(p/.92))}
   else if(s.kind==='lines'){
    const [a,b]=s.seqs,pa=cl(p/.46),pb=cl((p-.54)/.46),mix=cl((p-.46)/.08);
    a.set(pa);b.set(pb);a.canvas.style.opacity=1-mix;b.canvas.style.opacity=mix;
   }
  }
 }
 if(reduce){scenes.forEach(s=>{s.seqs.forEach(q=>{q.start();q.set(1)})});return}
 let tick=false;addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(()=>{tick=false;update()})}},{passive:true});
 update();
})();

/* A continuous editorial stage: scroll position selects a chapter; scrolling stays native. */
(()=>{
 const section=document.getElementById('pain');if(!section?.classList.contains('value-story'))return;
 const stage=section.querySelector('.value-stage'),world=section.querySelector('.value-world');
 const chapters=[...section.querySelectorAll('[data-value-chapter]')],buttons=[...section.querySelectorAll('[data-value-go]')];
 const staticMode=matchMedia('(prefers-reduced-motion:reduce), (max-height:640px)');
 const source=k=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'/landing/')+k+'.webp');
 section.querySelectorAll('[data-value-asset]').forEach(img=>{img.src=source(img.dataset.valueAsset)});
 let selectionTimer=0;
 function selection(detail){
  clearTimeout(selectionTimer);
  // The hero colours hair on a separate canvas; copy the finished composition, not just its base image.
  selectionTimer=setTimeout(()=>{
   const photo=document.getElementById('roomImg'),hair=document.getElementById('hairCanvas');if(!photo?.complete||!photo.naturalWidth)return;
   const canvas=document.createElement('canvas');canvas.width=1376;canvas.height=768;
   const g=canvas.getContext('2d');g.drawImage(photo,0,0,1376,768);if(hair)g.drawImage(hair,0,0);
   const image=canvas.toDataURL('image/png');document.getElementById('valuePortrait').src=image;document.getElementById('valueRequestPhoto').src=image;
  },1000);
  const selected=[detail?.style,detail?.color].filter(Boolean).join(' · ')||'مدل و رنگ دلخواه مشتری';
  document.getElementById('valueChoiceText').textContent=selected;document.getElementById('valueRequestChoice').textContent=selected;
 }
 addEventListener('ayneh:selection',event=>selection(event.detail));selection(window.__AYN_SEL);
 let queued=false,current=-1;
 function update(){
  queued=false;
  if(staticMode.matches){chapters.forEach(c=>{c.inert=false;c.removeAttribute('aria-hidden')});current=-1;return}
  const rect=section.getBoundingClientRect(),header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;
  const span=Math.max(1,section.offsetHeight-stage.offsetHeight),p=Math.max(0,Math.min(1,(header-rect.top)/span));
  section.style.setProperty('--value-p',p.toFixed(4));section.style.setProperty('--value-local',((p*chapters.length)%1).toFixed(4));
  const index=Math.min(chapters.length-1,Math.floor(p*chapters.length));
  if(index===current)return;current=index;world.dataset.valueState=String(index);section.dataset.valueChapter=String(index);
  chapters.forEach((chapter,i)=>{const active=i===index;chapter.classList.toggle('is-current',active);chapter.inert=!active;chapter.setAttribute('aria-hidden',String(!active))});
  buttons.forEach((button,i)=>{if(i===index)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current')});
 }
 const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(update)}};
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);staticMode.addEventListener('change',schedule);
 buttons.forEach((button,i)=>button.addEventListener('click',()=>{
  if(staticMode.matches)return;
  const header=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hh'))||76;
  const span=section.offsetHeight-stage.offsetHeight,target=scrollY+section.getBoundingClientRect().top-header+span*((i+.25)/chapters.length);
  scrollTo({top:target,behavior:'smooth'});
 }));
 update();
})();

</script>
<script>
/* "Make an image on my photo" links: open the demo salon on the line (and look) the visitor picked. */
(()=>{
 const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
 const PREVIEW=!!window.__AYN_PREVIEW;
 function href(line){
  const sel=window.__AYN_SEL||{};
  // the salon page has separate hairstyle and hair-colour services: a picked style opens the first, a colour alone the second
  if(line==='hair'&&sel.styleIdx==null&&sel.color)return '/s/demo?l=color&c='+encodeURIComponent(sel.color);
  const q=['l='+line];if(line==='hair'&&sel.styleIdx!=null)q.push('s='+sel.styleIdx);
  return '/s/demo?'+q.join('&');
 }
 function sync(){links.forEach(a=>{a.href=href(a.dataset.try)})}
 addEventListener('ayneh:selection',sync);sync();
 links.forEach(a=>a.addEventListener('click',e=>{
  if(!PREVIEW)return;e.preventDefault();
  let n=a.parentElement.querySelector('.try-note');
  if(!n){n=document.createElement('small');n.className='try-note';a.after(n)}
  n.textContent='در پیش‌نمایش کار نمی‌کند. روی سایت اصلی به صفحهٔ نمونه می‌رود و آنجا بعد از تأیید موبایل تصویر ساخته می‌شود.';
 }));
})();

</script>
<script>
/* Sticky CTA on phones: appears after the hero, hides while the trial form is on screen. */
(()=>{
 const bar=document.getElementById('stickyCta'),form=document.getElementById('start');if(!bar||!form)return;
 let formIn=false,past=false;
 const sync=()=>{const on=past&&!formIn;bar.hidden=!on;bar.classList.toggle('show',on)};
 const seen=new Set();
 new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));formIn=seen.size>0;sync()},{threshold:.15}).observe(form);
 document.querySelectorAll('.cta-band').forEach(b=>new IntersectionObserver(es=>{es.forEach(e=>e.isIntersecting?seen.add(e.target):seen.delete(e.target));formIn=seen.size>0;sync()},{threshold:.2}).observe(b));
 addEventListener('scroll',()=>{const p=scrollY>innerHeight*1.1;if(p!==past){past=p;sync()}},{passive:true});
})();

</script>
<script>
/* Section reveals: content below the first screen rises in as it enters. Nothing is hidden without JS, and anything
   already on screen at load is left alone. */
(()=>{
 if(matchMedia('(prefers-reduced-motion:reduce)').matches||!('IntersectionObserver' in window))return;
 const sel='.sec-head,.svc,.step,.feat li,.plan,.faq details,.cta-band__in,.s2-copy,.s2-demo,.trial-mock,#leadForm,.selection-copy,.compare';
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

</script>
<script>
/* Salon lead form: POST /api/inquiry, which saves the request and sends it to the owner's Telegram/Bale chat. */
(()=>{
 const $=id=>document.getElementById(id);
 const form=$('leadForm');if(!form)return;
 /* live mockup of the trial salon page: salon name and brand colour update the card */
 const mock=$('mock'),SRCI=(k)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'/landing/')+k+'.webp');
 let brandName='',brandHex='#B9975B',planName='';
 document.querySelectorAll('[data-plan]').forEach(a=>a.addEventListener('click',()=>{planName=a.dataset.plan;const p=$('lf-plan');if(p){p.textContent='پلن موردنظر شما: '+planName;p.hidden=false}}));
 if(mock){
  mock.querySelectorAll('img[data-k]').forEach(i=>{i.src=SRCI(i.dataset.k)});
  const nm=$('mockName'),ini=$('mockInit'),DEFAULT_NAME=nm.textContent;
  $('lf-salon').addEventListener('input',e=>{const t=e.target.value.trim();nm.textContent=t||DEFAULT_NAME;ini.textContent=t?[...t][0]:'س'});
  const picks=[...document.querySelectorAll('.brand-pick button')];
  picks.forEach(b=>b.addEventListener('click',()=>{picks.forEach(x=>x.setAttribute('aria-checked',String(x===b)));mock.style.setProperty('--brand',b.dataset.brand);brandName=b.getAttribute('aria-label');brandHex=b.dataset.brand}));
 }
 const PREVIEW=!!window.__AYN_PREVIEW;
 const err=$('lf-err'),done=$('lf-done'),send=$('lf-send');
 const code=$('lf-code'),codeBox=$('lf-codebox'),resend=$('lf-resend');let codeOn=false,tick=0;
 /* With SMS on, the server first texts a code; the same button then confirms it and builds the page. */
 function askCode(wait){codeOn=true;codeBox.hidden=false;$('lf-phone').readOnly=true;send.querySelector('span').textContent='تأیید کد و ساخت صفحه';err.textContent='کد به '+$('lf-phone').value+' پیامک شد.';code.value='';code.focus();
  clearInterval(tick);let t=wait;resend.disabled=true;const show=()=>{resend.textContent=t>0?'ارسال دوباره تا '+t.toLocaleString('fa-IR')+' ثانیه':'ارسال دوبارهٔ کد'};show();
  tick=setInterval(()=>{t--;show();if(t<=0){clearInterval(tick);resend.disabled=false}},1000)}
 resend&&resend.addEventListener('click',()=>{codeOn=false;code.value='';form.requestSubmit()});
 const faDigits=s=>String(s).replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
 function fail(msg,field){err.textContent=msg;[...form.querySelectorAll('input,textarea')].forEach(i=>i.removeAttribute('aria-invalid'));if(field){field.setAttribute('aria-invalid','true');field.focus()}}
 form.addEventListener('submit',async e=>{
  e.preventDefault();err.textContent='';
  const v={name:$('lf-name').value.trim(),salon:$('lf-salon').value.trim(),city:$('lf-city').value.trim(),phone:faDigits($('lf-phone').value).replace(/[\\s-]/g,''),website:$('lf-web').value,consent:$('lf-consent').checked,brand:brandHex};
    if(v.salon.length<2)return fail('نام سالن را بنویسید.',$('lf-salon'));
  if(!/^(\\+98|0098|98|0)?9\\d{9}$/.test(v.phone))return fail('شمارهٔ موبایل را مثل ۰۹۱۲۰۰۰۰۰۰۰ بنویسید.',$('lf-phone'));
  if(!v.consent)return fail('برای ساخت صفحه، تیک تأیید تماس را بزنید.',$('lf-consent'));
  const sel=window.__AYN_SEL||{};v.chosen=[sel.style,sel.color,brandName&&('برند '+brandName),planName&&('پلن '+planName)].filter(Boolean).join(' · ');
  send.disabled=true;send.setAttribute('aria-busy','true');
  try{
   if(PREVIEW){await new Promise(r=>setTimeout(r,700));done.textContent='پیش‌نمایش: این فرم روی سایت اصلی به ربات می‌رسد و در این نسخه چیزی ارسال نشد.'}
   else{
    if(codeOn){v.code=faDigits(code.value).replace(/\\D/g,'');if(v.code.length<3)throw new Error('کد پیامک‌شده را وارد کنید.')}
    const r=await fetch('/api/trial',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'ارسال نشد. کمی بعد دوباره امتحان کنید.');
    if(j.code_sent){askCode(j.resend_in||60);return}
    done.textContent='صفحهٔ سالن شما آماده است. ۱۰ ساعت و ۵ تصویر دارید. ';const a=document.createElement('a');a.href=j.path;a.className='btn';a.textContent='باز کردن صفحهٔ سالن من ←';a.style.marginTop='12px';a.style.display='inline-flex';done.append(a);
   }
   done.hidden=false;form.querySelectorAll('input,textarea').forEach(i=>i.disabled=true);send.hidden=true;done.focus&&done.setAttribute('tabindex','-1');done.focus();
  }catch(x){fail(x.message||'ارسال نشد. کمی بعد دوباره امتحان کنید.')}
  finally{send.disabled=false;send.removeAttribute('aria-busy')}
 });
})();

</script>
</body>
</html>
`;
