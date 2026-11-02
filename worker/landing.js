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

/* ---------- Film hero: pinned stage (scroll = playback), mirror recolor, style rail, color column ---------- */
:root{--hh:76px;--p:0;--z:1;--base:1}
.room{--u:calc(1 / var(--base))}
.film{position:relative;height:calc(100svh - var(--hh) + 120svh);background:#EFE6DA}
.stage{position:sticky;top:calc(var(--hh) + env(safe-area-inset-top,0px));height:calc(100svh - var(--hh));min-height:500px;overflow:hidden;isolation:isolate;background:#EFE6DA}
.room{position:absolute;inset:0;margin:0;overflow:hidden;translate:0 -4%;transform-origin:50% 40%;transform:scale(calc(var(--base) * var(--z)));will-change:transform}
.room img,.room canvas{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 36%}
.room img{animation:dolly 2400ms var(--ease) both}
.room::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 40%,transparent 55%,rgba(22,13,7,.22) 100%);pointer-events:none}
.fade{position:absolute;inset:0;z-index:9;pointer-events:none;background:linear-gradient(180deg,rgba(22,13,7,0) 40%,#160D07 100%);opacity:0}
@keyframes dolly{from{transform:scale(1.14);filter:brightness(.7) saturate(.8)}to{transform:scale(1);filter:none}}

.copy{position:absolute;z-index:6;top:clamp(28px,7vh,72px);inset-inline-start:clamp(24px,6vw,96px);width:min(400px,28vw);text-align:right;opacity:calc(1 - var(--p)*2.4);transform:translateX(calc(var(--p)*-70px))}
.eyebrow{margin:0 0 12px;font-size:17px;font-weight:600;color:#6B5233}
h1{margin:0 0 16px;font-size:clamp(34px,3.5vw,52px);line-height:1.25;font-weight:800;color:#170E07}
.lead{margin:0 0 20px;font-size:18px;line-height:1.9;color:#33261A;font-weight:500}
.lines-row{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}
.lines-row li{display:inline-flex;align-items:center;min-height:36px;padding:0 14px;border-radius:var(--r-pill);border:1px solid rgba(185,151,91,.6);background:rgba(252,250,246,.7);font-size:15px;font-weight:700;color:#2A1D12}
.fineprint{margin:14px 0 0;font-size:14px;color:#5C4A38;font-weight:500}
.reveal{animation:rise 900ms var(--ease) both}
.reveal:nth-child(2){animation-delay:140ms}.reveal:nth-child(3){animation-delay:260ms}.reveal:nth-child(4){animation-delay:380ms}.reveal:nth-child(5){animation-delay:500ms}.reveal:nth-child(6){animation-delay:620ms}
@keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}

/* panels share one glass recipe (D060: frosted, brass hairline) */
.glass{background:rgba(236,226,212,.74);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(185,151,91,.5);box-shadow:0 18px 44px rgba(40,26,12,.2)}
@supports not (backdrop-filter:blur(1px)){.glass{background:#ECE2D4}}

/* ----- hair colour column (vertical scroll) ----- */
.colors{position:absolute;z-index:7;left:clamp(14px,3vw,56px);top:50%;transform:translateY(-50%);width:104px;border-radius:52px;padding:10px 0}
.colors h2,.styles-head h2{font-size:13px;line-height:1.4;font-weight:700;letter-spacing:.02em;color:#5C4A38;text-align:center;margin:0 0 4px}
.col-list{display:flex;flex-direction:column;gap:4px;height:min(48vh,372px);overflow-y:auto;overscroll-behavior:auto;scroll-snap-type:y proximity;scrollbar-width:none;padding:14px 0;-webkit-mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(180deg,transparent,#000 12%,#000 88%,transparent)}
.col-list::-webkit-scrollbar{display:none}
.sw{position:relative;flex:0 0 auto;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;padding:8px 6px;border:0;background:none;cursor:pointer;color:#241A12;font-size:13px;font-weight:700;line-height:1.35;text-align:center}
.sw .dot{width:52px;height:52px;border-radius:50%;padding:3px;background:linear-gradient(145deg,#E7D3A4,#A9824F 55%,#E2C88F);box-shadow:0 8px 16px rgba(60,40,18,.18);transition:transform 240ms var(--ease)}
.sw .dot i{display:block;width:100%;height:100%;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,248,230,.45)}
.sw:hover .dot{transform:scale(1.06)}
.sw svg.frame{position:absolute;inset:2px 4px;width:calc(100% - 8px);height:calc(100% - 4px);overflow:visible;pointer-events:none}
.frame rect{x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px);rx:18px;ry:18px;fill:none;stroke:#A57E34;stroke-width:2.6;stroke-dasharray:1;stroke-dashoffset:1;transition:stroke-dashoffset 700ms var(--ease);filter:drop-shadow(0 0 6px rgba(185,151,91,.5))}
[aria-checked="true"] .frame rect{stroke-dashoffset:0}
.sw[aria-checked="true"] .dot{transform:scale(1.08);box-shadow:0 0 0 3px #F6EFE5,0 0 0 4.5px #B9975B,0 8px 16px rgba(60,40,18,.18)}

/* ----- hairstyle rail (horizontal) ----- */
.styles{position:absolute;z-index:7;left:0;right:0;bottom:clamp(10px,2.4vh,26px)}
.styles-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 clamp(16px,6vw,96px) 8px}
.styles-head h2{margin:0;text-align:right;font-size:14px}
.styles-head .nav-btns{display:flex;gap:8px}
.arrow-btn{width:44px;height:44px;border-radius:50%;border:1px solid var(--brass);background:rgba(252,250,246,.88);color:var(--ink);font-size:18px;cursor:pointer;display:grid;place-items:center}
.arrow-btn:hover{background:#fff}
.track{display:flex;gap:16px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:none;padding:12px clamp(16px,6vw,96px) 14px;cursor:grab;touch-action:pan-x pan-y}
.track::-webkit-scrollbar{display:none}
.track.dragging{cursor:grabbing;scroll-snap-type:none}
.card{position:relative;flex:0 0 auto;scroll-snap-align:center;width:clamp(84px,min(10.5vw,19vh),138px);padding:0;border:0;background:none;cursor:pointer;text-align:center;font-size:14px;font-weight:700;color:#241A12;transition:transform 320ms var(--ease)}
.card .ph{display:block;aspect-ratio:4/5;border-radius:16px;overflow:hidden;box-shadow:0 12px 26px rgba(40,26,12,.26)}
.card img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none}
.card .nm{display:block;margin-top:8px;padding:2px 8px;border-radius:10px;background:rgba(246,239,229,.82);line-height:1.5}
.card:hover{transform:translateY(-4px)}
.card svg.frame{position:absolute;inset:-7px -7px 28px -7px;width:calc(100% + 14px);height:calc(100% - 21px);overflow:visible;pointer-events:none}
.card[aria-checked="true"]{transform:translateY(-8px) scale(1.04)}
.card[aria-checked="true"] .ph{box-shadow:0 0 0 3px #F6EFE5,0 0 0 4.5px #B9975B,0 18px 36px rgba(40,26,12,.34)}
.card[aria-checked="true"] .nm{background:var(--espresso);color:var(--cream)}

/* ----- reference & result chip ----- */
.reference{position:absolute;z-index:6;left:clamp(150px,15vw,240px);top:clamp(70px,16vh,150px);width:154px;padding:10px;border-radius:20px;text-align:center;font-size:13px;font-weight:700;color:#241A12;opacity:0;transform:translateY(12px) rotate(-1.5deg);transition:opacity 420ms var(--ease),transform 420ms var(--ease);pointer-events:none}
.reference.on{opacity:1;transform:rotate(-1.5deg)}
.reference .ph{display:block;aspect-ratio:4/5;border-radius:14px;overflow:hidden;margin-bottom:8px;background:#d9cdbb}
.reference img{width:100%;height:100%;object-fit:cover;display:block}
.reference small{display:block;font-size:12px;font-weight:600;color:#5C4A38}
.result{position:absolute;z-index:8;top:clamp(14px,3vh,28px);left:50%;transform:translateX(-50%) translateY(-10px);display:flex;align-items:center;gap:14px;padding:8px 8px 8px 20px;border-radius:var(--r-pill);font-size:15px;font-weight:700;color:#241A12;opacity:0;pointer-events:none;transition:opacity 360ms var(--ease),transform 360ms var(--ease);white-space:nowrap}
.result.on{opacity:1;transform:translateX(-50%);pointer-events:auto}
.result .btn{min-height:44px;padding:0 18px;font-size:15px}
.cue{display:none;position:absolute;z-index:6;inset-inline-start:clamp(24px,6vw,96px);bottom:clamp(180px,30vh,260px);display:flex;align-items:center;gap:10px;font-size:14px;font-weight:700;color:#5C4A38;opacity:calc(1 - var(--p)*10)}
.cue i{display:block;width:1.5px;height:42px;background:linear-gradient(180deg,var(--brass),transparent);transform-origin:top;animation:cue 2s var(--ease) infinite}
@keyframes cue{0%{transform:scaleY(0)}60%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}

/* ----- pre-entrance states (set by JS only when motion is allowed) ----- */
.js-film .track .card.pre{opacity:0;transform:translateX(120vw) skewX(-16deg)}
.js-film .col-list .sw.pre{opacity:0;transform:translateY(90px)}

.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}

@media (max-width:900px){
  :root{--base:1.55}
  .film{height:calc(100svh - var(--hh) + 90svh)}
  .room img,.room canvas{object-position:50% 33%}
  .room{inset:0 0 auto 0;height:62%;transform-origin:50% 38%}
  .copy{left:0;right:0;inset-inline-start:0;top:clamp(10px,2vh,22px);width:auto;padding:0 20px;text-align:center}
  .eyebrow,.lead,.fineprint,.lines-row{display:none}
  h1{margin:0;font-size:clamp(28px,8vw,36px)}
  .colors{left:8px;top:35%;width:84px;border-radius:44px}
  .col-list{height:min(30vh,250px)}
  .sw{font-size:12px}.sw .dot{width:44px;height:44px}
  .styles{bottom:8px}
  .card{width:clamp(92px,26vw,112px)}
  .reference{display:none}
  .result{top:auto;bottom:228px;padding:6px 6px 6px 14px;font-size:13px;gap:10px;max-width:calc(100% - 24px)}
  .result .btn{min-height:40px;padding:0 12px;font-size:13px}
  .cue{display:none}
  .arrow-btn{display:none}
}
@media (prefers-reduced-motion:reduce){.room img{animation:none}.reveal{animation:none}.cue i{animation:none}.js-film .track .card.pre,.js-film .col-list .sw.pre{opacity:1;transform:none}}

@media (min-width:901px) and (max-height:720px){.lead,.lines-row,.fineprint{display:none}.copy{width:min(380px,30vw)}h1{font-size:clamp(34px,3.6vw,48px)}}

/* ===== v3: dock on the podium (approved icon selector, D057/D060) + expandable photo rail ===== */
.dock{position:absolute;z-index:3;left:var(--dk-x,50%);top:var(--dk-y,64%);width:var(--dk-w,290px);padding:calc(8px * var(--u)) calc(10px * var(--u)) calc(8px * var(--u));border-radius:calc(20px * var(--u));transform:translateX(-50%);transition:opacity 360ms var(--ease),transform 360ms var(--ease)}
.dock.away{opacity:0;pointer-events:none;transform:translateX(-50%) translateY(14px)}
.dock h2{margin:0 0 calc(2px * var(--u));font-size:calc(14px * var(--u));font-weight:800;color:#24170C;text-align:center;letter-spacing:0}
.dock-view{position:relative}
.dock-track{display:flex;gap:calc(6px * var(--u));overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;padding:calc(6px * var(--u)) calc(2px * var(--u));-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 86%,transparent);cursor:grab;touch-action:pan-x pan-y}
.dock-track::-webkit-scrollbar{display:none}
.dock-track.dragging{cursor:grabbing;scroll-snap-type:none}
.d-item{position:relative;flex:0 0 29%;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:calc(2px * var(--u));padding:calc(4px * var(--u)) 0 calc(5px * var(--u));border:0;background:none;cursor:pointer;color:#241A12;font-size:calc(12px * var(--u));font-weight:700;line-height:1.35;text-align:center;border-radius:calc(14px * var(--u))}
.d-item .ic{display:grid;place-items:center;height:calc(70px * var(--u));width:100%;margin-bottom:calc(4px * var(--u))}
.d-item img{max-height:92%;max-width:74%;object-fit:contain;filter:drop-shadow(0 calc(5px * var(--u)) calc(5px * var(--u)) rgba(60,36,16,.28));transition:transform 260ms var(--ease);pointer-events:none;-webkit-user-drag:none}
.d-item:hover img{transform:translateY(-3px) scale(1.06)}
.d-item[aria-checked="true"]{background:rgba(255,250,242,.55);box-shadow:0 0 0 calc(1.5px * var(--u)) #B9975B}
.d-item[aria-checked="true"] img{transform:translateY(-3px) scale(1.08)}
.d-item svg.frame{position:absolute;inset:calc(-3px * var(--u));width:calc(100% + 6px * var(--u));height:calc(100% + 6px * var(--u));overflow:visible;pointer-events:none}
.nav-btn{position:absolute;top:50%;z-index:2;width:calc(30px * var(--u));height:calc(30px * var(--u));margin-top:calc(-15px * var(--u));border-radius:50%;border:1px solid var(--brass);background:rgba(252,250,246,.94);color:var(--ink);font-size:calc(20px * var(--u));line-height:1;cursor:pointer;display:grid;place-items:center;padding:0 0 calc(2px * var(--u));box-shadow:0 4px 10px rgba(40,26,12,.18)}
.nav-btn:hover{background:#fff}
.nav-r{right:calc(-4px * var(--u))}.nav-l{left:calc(-4px * var(--u))}
.more{display:flex;align-items:center;justify-content:center;gap:calc(6px * var(--u));width:100%;min-height:calc(30px * var(--u));margin-top:calc(2px * var(--u));border:0;border-top:1px solid rgba(185,151,91,.4);background:none;color:#4A3722;font-size:calc(12px * var(--u));font-weight:700;cursor:pointer;border-radius:0 0 calc(14px * var(--u)) calc(14px * var(--u))}
.more:hover{color:#1E140B}
.more svg,.close svg{width:calc(16px * var(--u));height:calc(16px * var(--u));fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.more svg{animation:bob 1.8s var(--ease) infinite}
@keyframes bob{0%,100%{transform:translateY(-1px)}50%{transform:translateY(3px)}}

/* photo rail: opens from the dock's arrow */
.styles{opacity:0;visibility:hidden;transform:translateY(60px);transition:opacity 420ms var(--ease),transform 520ms var(--ease),visibility 0s linear 520ms;bottom:0;padding-bottom:clamp(10px,2.4vh,24px);background:linear-gradient(180deg,rgba(239,230,218,0),rgba(239,230,218,.88) 28%)}
.styles.open{opacity:1;visibility:visible;transform:none;transition:opacity 420ms var(--ease),transform 520ms var(--ease)}
.styles-head{padding-top:18px}
.close{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;border-radius:var(--r-pill);border:1px solid var(--brass);background:rgba(252,250,246,.9);color:var(--ink);font-size:14px;font-weight:700;cursor:pointer}
.close:hover{background:#fff}
.rail-wrap{position:relative}
.rail-wrap .nav-btn{--u:1px;width:44px;height:44px;margin-top:-34px;font-size:26px}
.rail-wrap .nav-r{right:clamp(8px,2vw,28px)}.rail-wrap .nav-l{left:clamp(8px,2vw,28px)}
.card .ph{aspect-ratio:4/5}
.card{width:clamp(88px,min(10.5vw,17vh),132px)}
@media (max-width:900px){
 .rail-wrap .nav-btn{display:none}
 .styles{bottom:0}
 .reference{display:none}
}
.js-film .d-item.pre{opacity:0;transform:translateX(120vw) skewX(-16deg)}
@media (prefers-reduced-motion:reduce){.js-film .d-item.pre{opacity:1;transform:none}.more svg{animation:none}}
.d-item>span:last-of-type{max-width:100%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:0 calc(2px * var(--u))}

.room img.alt{opacity:0;transition:opacity 480ms var(--ease);animation:none}
.room img.alt.show{opacity:1}
.d-item:hover{z-index:2}
.d-item:hover img{transform:translateY(calc(-5px * var(--u))) scale(1.3)}
.d-item[aria-checked="true"] img,.d-item[aria-checked="true"]:hover img{transform:translateY(calc(-5px * var(--u))) scale(1.3)}
.dock-track{padding-top:calc(14px * var(--u))}
.card:hover{transform:translateY(-6px) scale(1.07)}
.reference small.note{margin-top:4px;font-size:11px;line-height:1.6;color:#6B5233}

.dock{transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s}
.dock.away{visibility:hidden;transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s linear 360ms}
.cta-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.svc-try{margin-top:16px}.try-note{display:block;margin-top:8px;font-size:13px;color:var(--muted);line-height:1.8}


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

/* Scenes: pinned stage + scroll-scrubbed frame sequences (no library) */
.scene{position:relative;background:var(--canvas)}
.scene--pain{height:210svh}.scene[data-scene=transform]{height:420svh}.scene[data-scene=lines]{height:360svh}
.scene--dark{background:var(--espresso);color:var(--cream)}
.scene .sstage{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(10px,2svh,20px);padding:88px var(--gut) 20px;overflow:hidden}
.scene-head{width:min(100%,1100px)}
.scene-head h2{margin:0;font-size:clamp(24px,3.4vw,44px);line-height:1.5;font-weight:800;text-wrap:balance}
.film-frame{position:relative;margin:0;width:min(100%,1100px);aspect-ratio:16/9;max-height:56svh;border-radius:var(--r-frame);overflow:hidden;background:var(--espresso-2);box-shadow:0 30px 70px -34px rgba(0,0,0,.6)}
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
  .cap{position:static;opacity:1;transform:none;grid-area:auto}.cap-row{display:block}.cap:not(:first-child){display:none}
}

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
  <!-- 1. Film hero: pinned stage. Scroll plays the scene; swatches and styles drive the mirror. -->
  <section id="intro" class="film" aria-labelledby="h1" tabindex="-1">
    <div class="stage" id="stage">
      <figure class="room" id="room">
        <img id="roomImg" fetchpriority="high" decoding="async" src="/landing/hero.webp" width="1376" height="768" alt="آینهٔ سه‌تکهٔ برنجی با تصویر یک مدل در آن، روی پایه‌ای از سنگ">
        <img id="roomImg2" class="alt" src="" alt="" aria-hidden="true" width="1376" height="768">
        <canvas id="hairCanvas" width="1376" height="768" aria-hidden="true"></canvas>
        <div class="dock glass" id="dock">
          <h2 id="dock-h">مدل مو</h2>
          <div class="dock-view">
            <div class="dock-track" id="dockTrack" role="radiogroup" aria-labelledby="dock-h"></div>
            <button type="button" class="nav-btn nav-r" id="dkPrev" aria-label="مدل‌های قبلی">›</button>
            <button type="button" class="nav-btn nav-l" id="dkNext" aria-label="مدل‌های بعدی">‹</button>
          </div>
          <button type="button" class="more" id="more" aria-expanded="false" aria-controls="styles"><span>همهٔ مدل‌ها با عکس</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5"/></svg></button>
        </div>
      </figure>
      <div class="fade" id="fade" aria-hidden="true"></div>

      <div class="copy" id="copy">
        <p class="eyebrow reveal">برای صاحبان سالن مو، ناخن و مژه</p>
        <h1 id="h1" class="reveal">مشتری‌تان قبل از نشستن روی صندلی می‌داند چه می‌خواهد.</h1>
        <p class="lead reveal">آینه یک صفحهٔ اینترنتی برای سالن شماست. مشتری عکسش را می‌گذارد، مدل مو، رنگ، طرح ناخن یا مژه را روی خودش می‌بیند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد. همین حالا خودتان امتحانش کنید.</p>
        <ul class="lines-row reveal" aria-label="خدمات پوشش‌داده‌شده"><li>مو</li><li>ناخن</li><li>مژه</li></ul>
        <div class="cta-row reveal"><a class="btn btn--lg" href="#start"><span>صفحهٔ آزمایشی رایگان سالن من</span><span class="arrow" aria-hidden="true">←</span></a><a class="btn btn--ghost" data-try="hair" href="/s/demo?l=hair"><span>امتحان روی عکس خودم</span></a></div>
        <p class="fineprint reveal">رایگان، بدون کارت بانکی: ۱۰ ساعت و ۵ تصویر. شبیه‌سازی پیشنهادی است و نتیجه را تضمین نمی‌کند.</p>
      </div>

      <div class="colors glass" id="colors">
        <h2 id="colors-h">رنگ مو</h2>
        <div class="col-list" id="colList" role="radiogroup" aria-labelledby="colors-h" tabindex="-1"></div>
      </div>

      <aside class="reference glass" id="ref" aria-live="polite">
        <span class="ph"><img id="refImg" alt="" width="240" height="300"></span>
        <span id="refName"></span>
        <small>مدل انتخاب‌شده</small>
        <small id="refNote" class="note"></small>
      </aside>

      <div class="result glass" id="result" role="status" aria-live="polite">
        <span id="resultText"></span>
        <a class="btn" href="#start"><span>همین را برای سالنم بساز</span><span class="arrow" aria-hidden="true">←</span></a>
      </div>


      <div class="styles" id="styles" aria-hidden="true">
        <div class="styles-head">
          <h2 id="styles-h">مدل مو <span id="styCount"></span></h2>
          <button type="button" class="close" id="closeRail"><span>بستن</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12.5 10 7.5 15 12.5"/></svg></button>
        </div>
        <div class="rail-wrap">
          <div class="track" id="track" role="radiogroup" aria-labelledby="styles-h"></div>
          <button type="button" class="nav-btn nav-r" id="stPrev" aria-label="مدل‌های قبلی">›</button>
          <button type="button" class="nav-btn nav-l" id="stNext" aria-label="مدل‌های بعدی">‹</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Scenes 2-4: the pain, the transformation, nails and lashes. Scroll plays the film. -->
  <section id="pain" class="scene scene--pain" data-scene="pain" aria-labelledby="h-pain">
    <div class="sstage">
      <div class="scene-head">
        <p class="kicker">هر روز در سالن</p>
        <h2 id="h-pain">سه ربع مشاوره، با یک عکس از اینستاگرام.</h2>
      </div>
      <figure class="film-frame film-frame--pain">
        <img src="/landing/a2.webp" alt="ده‌ها عکس مرجع مختلف روی هم، هر کدام سلیقه‌ای متفاوت" width="1254" height="1254" loading="lazy" id="painImg">
        <figcaption class="cap-row"><span class="cap is-on" data-from="0" data-to=".5">مشتری گوشی‌اش را باز می‌کند و چند عکس نشان می‌دهد. هر عکس یک سلیقه است.</span><span class="cap" data-from=".5" data-to="1.01">تا مدل مشخص شود، وقت صندلی رفته و هر دو خسته شده‌اید.</span></figcaption>
      </figure>
      <p class="ai-note">نمونهٔ تصویری ساخته‌شده با هوش مصنوعی</p>
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
        <figcaption class="cap-row"><span class="cap is-on" data-from="0" data-to=".34">مشتری یک عکس از خودش می‌گذارد: موی بلند و مسی.</span><span class="cap" data-from=".34" data-to=".7">مدل و رنگ دلخواهش را انتخاب می‌کند.</span><span class="cap" data-from=".7" data-to="1.01">نتیجه را روی خودش می‌بیند و با خیال راحت می‌آید.</span></figcaption>
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
        <figcaption class="cap-row"><span class="cap is-on" data-from="0" data-to=".5">طرح ناخن را قبل از لاک روی دست خودش می‌بیند.</span><span class="cap" data-from=".5" data-to="1.01">حالت مژه را قبل از اکستنشن می‌بیند.</span></figcaption>
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
<script>window.__AYN_BASE='/landing/';</script>
<script>
/* Film hero. Data-driven: STYLES / COLORS below are the only things to extend.
   - Colour changes are real: the model's hair is recoloured on a canvas through a hair mask (/landing/hair-mask.png).
   - Style changes use the catalogue photo as the reference card plus a scan pass over the model; a true re-render of the
     model in that style is the AI simulation (product feature), not faked here. */
(()=>{
 const $=id=>document.getElementById(id);
 const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches;
 const SRC=(k,e)=>(window.__AYN_IMG&&window.__AYN_IMG[k])||((window.__AYN_BASE||'/landing/')+k+'.'+(e||'webp'));
 const fa=n=>new Intl.NumberFormat('fa-IR').format(n);
 const STYLES=['لیر بلند','کوتاهی پروانه‌ای','ولف‌کات','هاش‌کات','لُب (باب بلند)','باب کوتاه','کوتاهی جلوبلند','پیکسی','چتری پرده‌ای','چتری پروانه‌ای','چتری کج','چتری صاف کامل','براشینگ حجیم','صاف و براق','ویو درشت','فر طبیعی','فر درشت لوله‌ای','مدل گوجه‌ای','شینیون پایین'];
 // first four = approved swatches (D060); the rest are proposed additions
 const COLORS=[
  {id:'champagne',name:'بلوند شامپاینی',h:43,s:.36,l:.7,css:'linear-gradient(145deg,#F3E2B8,#D3B677)'},
  {id:'caramel',name:'کاراملی',h:28,s:.62,l:.46,css:'linear-gradient(145deg,#C98745,#8A5424)'},
  {id:'espresso',name:'اسپرسو',h:22,s:.42,l:.17,css:'linear-gradient(145deg,#4F3322,#1C110A)'},
  {id:'ombre',name:'آمبره',ombre:true,h:30,s:.5,l:.4,css:'linear-gradient(180deg,#2A1A10,#D6B27A)'},
  {id:'copper',name:'مسی',h:16,s:.72,l:.43,css:'linear-gradient(145deg,#CF6C3C,#8C3D1B)'},
  {id:'platinum',name:'بلوند پلاتینی',h:50,s:.2,l:.86,css:'linear-gradient(145deg,#F4EFE2,#CBC3AE)'},
  {id:'wine',name:'شرابی',h:343,s:.55,l:.27,css:'linear-gradient(145deg,#8E3050,#481327)'}
 ];
 const st={style:null,color:null,shown:null,look:'long'};
 const stage=$('stage'),film=$('intro'),track=$('track'),colList=$('colList');
 if(!reduced)stage.classList.add('js-film');

 /* ---------- build rails ---------- */
 const frame='<svg class="frame" aria-hidden="true"><rect pathLength="1"/></svg>';
 const cards=STYLES.map((name,i)=>{
  const b=document.createElement('button');b.type='button';b.className='card'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  const n=String(i+1).padStart(2,'0');
  b.innerHTML='<span class="ph"><img src="'+SRC('s'+n)+'" alt="" width="240" height="300" loading="lazy" draggable="false"></span><span class="nm">'+name+'</span>'+frame;
  b.addEventListener('click',()=>pickStyle(i));track.append(b);return b});
 $('styCount').textContent='· '+fa(STYLES.length)+' مدل';
 const sws=COLORS.map((c,i)=>{
  const b=document.createElement('button');b.type='button';b.className='sw'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  b.innerHTML='<span class="dot"><i style="background:'+c.css+'"></i></span><span>'+c.name+'</span>'+frame;
  b.addEventListener('click',()=>pickColor(i));colList.append(b);return b});


 /* ---------- dock on the podium (approved icon selector) ---------- */
 const dockTrack=$('dockTrack'),dock=$('dock'),room=$('room');
 // Icon-to-style pairing is a placeholder until one 3D icon exists per style; the four icons are the approved set.
 const dItems=STYLES.map((name,i)=>{
  const b=document.createElement('button');b.type='button';b.className='d-item'+(reduced?'':' pre');b.setAttribute('role','radio');b.setAttribute('aria-checked','false');
  const flip=(i%8)>=4?' style="transform:scaleX(-1)"':'';
  b.innerHTML='<span class="ic"><img src="'+SRC('ic'+(i%4+1))+'" alt=""'+flip+' draggable="false"></span><span>'+name+'</span>'+frame;
  b.addEventListener('click',()=>pickStyle(i));dockTrack.append(b);return b});
 function layout(){
  const W=room.clientWidth,H=room.clientHeight;if(!W||!H)return;
  const s=Math.max(W/1376,H/768),ox=(W-1376*s)*.5,oy=(H-768*s)*.36;
  dock.style.setProperty('--dk-x',(ox+686*s)+'px');dock.style.setProperty('--dk-y',(oy+503*s)+'px');dock.style.setProperty('--dk-w',(372*s*.86)+'px')}
 let dDrag=null,dMoved=false;
 dockTrack.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;dDrag={x:e.clientX,s:dockTrack.scrollLeft};dMoved=false});
 addEventListener('pointermove',e=>{if(!dDrag)return;const dx=e.clientX-dDrag.x;if(Math.abs(dx)>5){dMoved=true;dockTrack.classList.add('dragging')}if(dMoved)dockTrack.scrollLeft=dDrag.s+dx*(getComputedStyle(dockTrack).direction==='rtl'?1:-1)});
 addEventListener('pointerup',()=>{if(dDrag){dDrag=null;setTimeout(()=>dockTrack.classList.remove('dragging'),0)}});
 dockTrack.addEventListener('click',e=>{if(dMoved){e.stopPropagation();e.preventDefault();dMoved=false}},true);
 const dStep=()=>dockTrack.clientWidth*.6,sgn=el=>getComputedStyle(el).direction==='rtl'?1:-1;
 $('dkPrev').addEventListener('click',()=>dockTrack.scrollBy({left:dStep()*sgn(dockTrack),behavior:reduced?'auto':'smooth'}));
 $('dkNext').addEventListener('click',()=>dockTrack.scrollBy({left:-dStep()*sgn(dockTrack),behavior:reduced?'auto':'smooth'}));
 /* arrow on the dock opens the photo rail */
 const rail=$('styles'),more=$('more');let railSeen=false;
 function setRail(open){
  rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
  if(open&&!railSeen){railSeen=true;flyIn(cards,0)}
  if(open)setTimeout(()=>{const sel=cards[st.style??0];sel&&sel.scrollIntoView({inline:'center',block:'nearest',behavior:'auto'})},60);
  else more.focus({preventScroll:true})}
 more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
 addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});

 /* ---------- hair recolour engine ---------- */
 const img=$('roomImg'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
 const R={x:500,y:150,w:380,h:310},TOP=185,BOT=430;
 let px=null,rafId=0,lookTok=0;
 const img2=$('roomImg2');
 /* looks: each look = a full render of the mirror scene + its own hair mask. Today lob/bob are cut from the photo;
    the same slots take AI renders per style later (see LOOK_OF). */
 const LOOKS={long:{img:'hero',mask:'hair-mask'},lob:{img:'look-lob',mask:'hair-mask-lob'},bob:{img:'look-bob',mask:'hair-mask-bob'}};
 const LOOK_OF=['long','long','lob','lob','lob','bob','bob','bob','long','long','long','long','long','long','long','long','long','long','long'];
 const SHAPED=[0,1,2,3,4,5,6,7]; // styles whose shape is applied to the model today
 const preps={};
 function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src})}
 function prepare(key){
  if(preps[key])return preps[key];
  const L=LOOKS[key];
  return preps[key]=Promise.all([loadImg(SRC(L.img)),loadImg(SRC(L.mask,'png'))]).then(([im,mi])=>{
   const W=cv.width,H=cv.height,a=document.createElement('canvas');a.width=W;a.height=H;const c=a.getContext('2d',{willReadFrequently:true});
   c.drawImage(im,0,0,W,H);const base=c.getImageData(R.x,R.y,R.w,R.h).data;
   c.clearRect(0,0,W,H);c.drawImage(mi,0,0,W,H);const mk=c.getImageData(R.x,R.y,R.w,R.h).data;
   const idx=[];for(let i=0;i<R.w*R.h;i++)if(mk[i*4]>6)idx.push(i);
   return {src:im.src,base,mk,idx,out:ctx.createImageData(R.w,R.h)}}).catch(()=>null);
 }
 function startPrep(){prepare('long').then(p=>{px=p});prepare('lob');prepare('bob')}
 if(img.complete)startPrep();else img.addEventListener('load',startPrep);
 async function setLook(key,after){
  if(key===st.look){after&&after();return}
  const my=++lookTok;st.look=key;cancelAnimationFrame(rafId);px=null;ctx.clearRect(0,0,cv.width,cv.height);
  const p=await prepare(key);if(my!==lookTok||!p)return;
  img2.src=p.src;try{await img2.decode()}catch(e){}
  img2.classList.add('show');
  setTimeout(()=>{if(my!==lookTok)return;img.src=p.src;const done=()=>{img2.style.transition='none';img2.classList.remove('show');void img2.offsetWidth;img2.style.transition='';px=p;after&&after()};img.decode?img.decode().then(done,done):done()},reduced?0:500);
 }
 const cl=(v,a,b)=>v<a?a:v>b?b:v,sm=(a,b,x)=>{x=cl((x-a)/(b-a),0,1);return x*x*(3-2*x)};
 function hsl(h,s,l){const k=n=>(n+h/30)%12,a=s*Math.min(l,1-l),f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[f(0)*255,f(8)*255,f(4)*255]}
 function tint(c,Y,yn){let l=c.ombre?.16+(.7-.16)*sm(.3,.85,yn):c.l;l=cl(l+(Y-.4)*1.2,.03,.96);const s=c.s*(1-cl((l-.72)*2.2,0,.8));return hsl(c.h,s,l)}
 /* from/to: colour objects or null (original); t: 0..1 blend; scan: -1 (off) or 0..1 sweep position */
 function draw(from,to,t,scan){
  if(!px){return}
  const {base,mk,idx,out}=px,o=out.data;o.fill(0);
  if(!to&&!from&&scan<0){ctx.clearRect(0,0,cv.width,cv.height);return}
  for(let k=0;k<idx.length;k++){
   const i=idx[k],p=i*4,y=R.y+((i/R.w)|0),yn=cl((y-TOP)/(BOT-TOP),0,1);
   const r0=base[p],g0=base[p+1],b0=base[p+2],Y=(.2126*r0+.7152*g0+.0722*b0)/255;
   let A=from?tint(from,Y,yn):[r0,g0,b0],B=to?tint(to,Y,yn):[r0,g0,b0];
   let r=A[0]+(B[0]-A[0])*t,g=A[1]+(B[1]-A[1])*t,b=B[2]*t+A[2]*(1-t);
   if(scan>=0){const d=(y-R.y)/R.h-scan,w=Math.exp(-(d*d)/.0045)*.75;r+=(255-r)*w*.8+30*w;g+=(255-g)*w*.7+18*w;b+=(255-b)*w*.45}
   o[p]=cl(r,0,255);o[p+1]=cl(g,0,255);o[p+2]=cl(b,0,255);o[p+3]=mk[p];
  }
  ctx.clearRect(0,0,cv.width,cv.height);ctx.putImageData(out,R.x,R.y);
 }
 function run(dur,fn,done){cancelAnimationFrame(rafId);if(reduced){fn(1);done&&done();return}const t0=performance.now();(function f(now){const x=cl((now-t0)/dur,0,1);fn(x);if(x<1)rafId=requestAnimationFrame(f);else done&&done()})(t0)}
 const ease=x=>1-Math.pow(1-x,3);
 function paintColor(prev,next){run(820,x=>draw(prev,next,ease(x),x*1.3-.15),()=>draw(null,next,1,-1))}
 function paintScan(cur){run(900,x=>draw(cur,cur,1,x*1.3-.15),()=>draw(null,cur,1,-1))}

 /* ---------- selection ---------- */
 function mark(list,idx){list.forEach((b,i)=>b.setAttribute('aria-checked',String(i===idx)))}
 function pickColor(i){const prev=st.shown;st.color=i;st.shown=COLORS[i];mark(sws,i);paintColor(prev,st.shown);summary()}
 function pickStyle(i){st.style=i;mark(cards,i);mark(dItems,i);
  const n=String(i+1).padStart(2,'0');$('refImg').src=SRC('s'+n);$('refName').textContent=STYLES[i];$('ref').classList.add('on');
  const key=LOOK_OF[i];
  $('refNote').textContent=SHAPED.includes(i)?'شکل مو روی مدل اعمال شد':'شکل این مدل روی عکس خود مشتری و با شبیه‌سازی دیده می‌شود';
  if(key!==st.look)setLook(key,()=>st.shown?paintColor(null,st.shown):paintScan(null));else paintScan(st.shown);
  summary()}
 function summary(){
  const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
  $('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
  const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}

 /* ---------- rail controls: drag, buttons ---------- */
 let drag=null,moved=false;
 const dirSign=()=>getComputedStyle(track).direction==='rtl'?1:-1;
 track.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;drag={x:e.clientX,s:track.scrollLeft};moved=false});
 addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x;if(Math.abs(dx)>5){moved=true;track.classList.add('dragging')}if(moved)track.scrollLeft=drag.s+dx*dirSign()*-1*-1});
 addEventListener('pointerup',()=>{if(drag){drag=null;setTimeout(()=>track.classList.remove('dragging'),0)}});
 track.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 const step=()=>track.clientWidth*.7;
 $('stPrev').addEventListener('click',()=>track.scrollBy({left:step()*dirSign(),behavior:reduced?'auto':'smooth'}));
 $('stNext').addEventListener('click',()=>track.scrollBy({left:-step()*dirSign(),behavior:reduced?'auto':'smooth'}));

 /* arrow keys move between options inside each radio group */
 [[cards,track],[dItems,dockTrack],[sws,colList]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
  const k=e.key,i=list.indexOf(document.activeElement);if(i<0)return;
  const dir=(k==='ArrowRight'||k==='ArrowDown')?(box===colList||k==='ArrowDown'?1:-1):(k==='ArrowLeft'||k==='ArrowUp')?(box===colList||k==='ArrowUp'?-1:1):0;
  if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus();n.scrollIntoView({inline:'center',block:'nearest'})}));
 /* ---------- act I/II: entrance ---------- */
 function flyIn(list,base){
  list.forEach((c,i)=>{
   const a=c.animate([{transform:'translateX('+(110+i*6)+'vw) skewX(-16deg)',filter:'blur(8px)',opacity:0},{opacity:1,offset:.18},{transform:'translateX(0) skewX(0)',filter:'blur(0)',opacity:1}],{duration:1700,delay:base+i*55,easing:'cubic-bezier(.08,.82,.12,1)',fill:'both'});
   a.onfinish=()=>{c.classList.remove('pre');a.cancel()}})}
 function entrance(){
  if(reduced)return;
  flyIn(dItems,700);
  sws.forEach((c,i)=>{
   const a=c.animate([{transform:'translateY(90px)',opacity:0},{transform:'none',opacity:1}],{duration:900,delay:500+i*80,easing:'cubic-bezier(.2,.7,.2,1)',fill:'both'});
   a.onfinish=()=>{c.classList.remove('pre');a.cancel()}});
  setTimeout(()=>paintScan(null),2300);
  /* hint that the dock scrolls: a short nudge, then back */
  setTimeout(()=>{dockTrack.scrollBy({left:-52*sgn(dockTrack),behavior:'smooth'});setTimeout(()=>dockTrack.scrollBy({left:52*sgn(dockTrack),behavior:'smooth'}),900)},3200);
 }
 setTimeout(entrance,reduced?0:900);

 /* ---------- act III: scroll plays the scene ---------- */
 const hdr=document.querySelector('.site-header');let tick=false;
 function frameUpdate(){tick=false;
  const hh=hdr?hdr.offsetHeight:76;document.documentElement.style.setProperty('--hh',hh+'px');
  const span=film.offsetHeight-stage.offsetHeight;if(span<=0)return;
  const p=cl((hh-film.getBoundingClientRect().top)/span,0,1);
  stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--z',(1+p*.12).toFixed(4));
  $('fade').style.opacity=sm(.55,1,p).toFixed(3)}
 const req=()=>{if(!tick){tick=true;requestAnimationFrame(frameUpdate)}};
 addEventListener('scroll',req,{passive:true});addEventListener('resize',()=>{layout();req()});layout();frameUpdate();if(img.complete)layout();else img.addEventListener('load',layout);
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
  function size(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);cw=canvas.width=Math.max(2,Math.round(r.width*d));ch=canvas.height=Math.max(2,Math.round(r.height*d));paint()}
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

</script>
<script>
/* "Make an image on my photo" links: open the demo salon on the line (and look) the visitor picked. */
(()=>{
 const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
 const PREVIEW=!!window.__AYN_PREVIEW;
 function href(line){
  const sel=window.__AYN_SEL||{},q=['l='+line];
  if(line==='hair'){if(sel.styleIdx!=null)q.push('s='+sel.styleIdx);if(sel.color)q.push('c='+encodeURIComponent(sel.color))}
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
    const r=await fetch('/api/trial',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(v)});
    const j=await r.json().catch(()=>({}));
    if(!r.ok)throw new Error(j.error||'ارسال نشد. کمی بعد دوباره امتحان کنید.');
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
