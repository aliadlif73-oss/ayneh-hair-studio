// Public landing page served at "/" (owner console lives at /admin). Static HTML; images in public/landing/.
// Generated from the design source (visual direction AYN-D057/D059/D060/D061/D062; tokens are PROPOSED).
export const landingHTML=`<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>آینه | صفحهٔ اختصاصی سالن برای امتحان مدل مو، ناخن و مژه</title><meta name="description" content="صفحهٔ اختصاصی سالن شما: مشتری مدل مو، رنگ، ناخن و مژه را روی عکس خودش امتحان می‌کند و انتخابش را مستقیم به تلگرام یا بله می‌فرستد. پیش‌نمایش رایگان بسازید."><meta name="theme-color" content="#F3F4F5"><meta property="og:title" content="آینه | مدل دلخواه مشتری، پیش از مراجعه روی عکس خودش"><meta property="og:description" content="برای سالن‌های مو، ناخن و مژه. مدل‌ها را امتحان کنید، پیش‌نمایش رایگان صفحهٔ سالن را بسازید و مسیر راه‌اندازی را ببینید."><meta property="og:type" content="website"><meta property="og:locale" content="fa_IR"><meta property="og:image" content="__ORIGIN__/landing/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="آینهٔ سه‌تکهٔ برنجی و تیتر آینه"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='9' fill='%23160D07'/%3E%3Cpath d='M16 6c-4.4 0-7 3.3-7 7.4v8.6c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2v-8.6C23 9.300 20.400 6 16 6z' fill='none' stroke='%23D6BE8C' stroke-width='1.600'/%3E%3C/svg%3E"><link rel="preload" href="/fonts/estedad-arabic.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/landing/hero.webp" as="image" fetchpriority="high"><style>@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+204F,U+FB50-FDFF,U+FE70-FEFC} @font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-200B,U+2012-206F,U+20AC,U+2122,U+2212} @font-face{font-family:"Estedad";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/estedad-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC} :root{--canvas:#F3F4F5;--surface:#FDFDFC;--sunken:#E3E6E9;--ink:#152238;--muted:#3F4F68;--espresso:#101E38;--espresso-2:#182B4A;--espresso-hover:#24406B;--cream:#EEF4FF;--ivory:#EEF4FF;--ivory-2:#CBDAEF;--brass:#D8A63C;--brass-soft:#F2DFAF;--brass-text:#7A5712;--line-decor:#C9D5E2;--line-control:#8C9AAC;--line-dark:#D8A63C;--focus:#254E9E;--focus-dark:#F2DFAF;--r-control:12px;--r-card:20px;--r-frame:28px;--r-pill:999px;--font:"Estedad","Vazirmatn",system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;--ease:cubic-bezier(.2,.7,.2,1);--sec-y:clamp(64px,9vw,120px);--gut:clamp(20px,5vw,80px)} *{box-sizing:border-box} html{scroll-behavior:smooth;scroll-padding-top:84px} html,body{margin:0;padding:0} body{font-family:var(--font);font-size:16px;line-height:1.9;background:var(--canvas);color:var(--ink);overflow-x:hidden;-webkit-font-smoothing:antialiased} img{display:block;max-width:100%;height:auto} a{text-decoration:none;color:inherit} button{font:inherit} h1,h2,h3,p,ul,ol,figure{margin:0} ul,ol{padding:0;list-style:none} :focus-visible{outline:3px solid var(--focus);outline-offset:4px;border-radius:6px} .on-dark :focus-visible,.site-footer :focus-visible{outline-color:var(--focus-dark)} .skip{position:absolute;inset-inline-start:16px;top:-80px;z-index:100;background:var(--espresso);color:var(--cream);padding:12px 20px;border-radius:var(--r-control);font-weight:700} .skip:focus{top:12px} .wrap{max-width:1240px;margin:0 auto} .num{font-feature-settings:"ss01";font-variant-numeric:tabular-nums} .site-header{position:sticky;top:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:14px clamp(20px,4vw,64px);background:linear-gradient(180deg,#ebf1f6,rgba(235,241,246,.96));border-bottom:1px solid rgba(124,137,152,.2)} .brand{font-size:28px;font-weight:800;line-height:1.3;white-space:nowrap} .brand small{font-size:20px;font-weight:700;opacity:.86;margin-inline-start:8px} .nav{display:flex;gap:clamp(14px,2.2vw,34px);font-size:16px;font-weight:600;color:#141b28} .nav a{padding:8px 2px;border-bottom:2px solid transparent;transition:border-color 160ms var(--ease)} .nav a:hover{border-color:var(--brass)} .header-actions{display:flex;align-items:center;gap:10px} .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-height:48px;padding:0 24px;border-radius:var(--r-pill);background:var(--espresso);color:var(--cream);border:1.5px solid var(--brass);box-shadow:0 0 0 3px rgba(124,137,152,.14),0 10px 24px rgba(8,13,21,.18);font-weight:700;font-size:16px;white-space:nowrap;cursor:pointer;transition:background 160ms var(--ease),transform 160ms var(--ease)} .btn:hover{background:var(--espresso-hover)} .btn:active{transform:translateY(1px)} .btn .arrow{font-size:18px;line-height:1} .btn--lg{min-height:56px;padding:0 32px;font-size:19px;font-weight:800;gap:12px;box-shadow:0 0 0 4px rgba(124,137,152,.14),0 16px 34px rgba(8,13,21,.22)} .btn--ghost{background:transparent;color:var(--ink);border-color:var(--line-control);box-shadow:none} .btn--ghost:hover{background:rgba(124,137,152,.14)} .on-dark .btn--ghost{color:var(--ivory);border-color:var(--brass-soft)} .on-dark .btn--ghost:hover{background:rgba(167,176,187,.14)} .on-dark .btn:not(.btn--ghost){background:var(--cream);color:var(--espresso);border-color:var(--brass-soft)} .on-dark .btn:not(.btn--ghost):hover{background:#fff} .menu-toggle{display:none} .mobile-menu[hidden]{display:none!important} .selection{position:relative;background:var(--espresso);color:var(--cream);padding:96px var(--gut) 110px} .selection-grid{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:minmax(320px,560px) minmax(320px,1fr);gap:clamp(32px,6vw,88px);align-items:center} .selection-copy h2{margin:0 0 18px;font-size:clamp(32px,4vw,48px);font-weight:800;line-height:1.35;color:var(--ivory)} .selection-copy p{margin:0 0 26px;font-size:18px;line-height:2;color:var(--ivory-2);font-weight:500;max-width:520px} .chips{display:flex;flex-wrap:wrap;gap:12px} .chip{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:var(--r-pill);border:1px solid rgba(167,176,187,.55);background:linear-gradient(180deg,rgba(241,246,252,.08),rgba(241,246,252,.02));color:#dce4ed;font-size:15px;font-weight:600;box-shadow:inset 0 1px 0 rgba(255,255,255,.08)} .compare{position:relative;width:100%;max-width:580px;justify-self:center;z-index:8;filter:drop-shadow(0 30px 60px rgba(0,0,0,.45));align-self:start;margin-top:calc(-96px - min(49.65px,8.56%))} .compare img{width:100%;border-radius:28px} .compare::before{content:"";position:absolute;z-index:3;pointer-events:none;top:10.45%;left:8.45%;right:2.9%;height:75.5%;border:1.7px solid #b9ae9a;border-bottom:0;border-radius:15px 15px 0 0;-webkit-mask-image:linear-gradient(to right,#000 0%,#000 28%,transparent 34%,transparent 67%,#000 73%,#000 100%);mask-image:linear-gradient(to right,#000 0%,#000 28%,transparent 34%,transparent 67%,#000 73%,#000 100%)} .compare .tag{position:absolute;bottom:11.5%;font-size:16px;font-weight:700;color:#dfe8f1;text-shadow:0 2px 8px rgba(0,0,0,.65)} .compare .tag.before{left:9%}.compare .tag.after{right:8%} .section{padding:var(--sec-y) var(--gut)} .section--sunken{background:var(--sunken)} .section--dark{background:var(--espresso);color:var(--cream)} .sec-head{max-width:720px;margin:0 0 clamp(32px,5vw,56px)} .kicker{margin:0 0 10px;font-size:15px;font-weight:700;color:var(--brass-text)} .on-dark .kicker{color:var(--brass-soft)} h2{font-size:clamp(32px,4vw,48px);line-height:1.35;font-weight:800} .on-dark h2{color:var(--ivory)} .sec-head p.sub{margin-top:14px;font-size:18px;line-height:1.95;color:var(--muted);font-weight:500} .on-dark .sec-head p.sub{color:var(--ivory-2)} h3{font-size:24px;line-height:1.5;font-weight:700} .cards3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px)} .svc{display:flex;flex-direction:column;gap:14px;padding:clamp(24px,3vw,36px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card);box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 14px 34px rgba(21,33,57,.07)} .svc .ico{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#bcc5cf,#6f7b89 55%,#adb8c4);padding:3px;box-shadow:0 8px 18px rgba(21,33,57,.16)} .svc .ico span{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:var(--espresso)} .svc .ico svg{width:34px;height:34px;stroke:var(--brass-soft);fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round} .svc p{color:var(--muted);font-size:16px} .svc .picks{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto;padding-top:6px} .svc .picks li{padding:2px 12px;min-height:32px;display:inline-flex;align-items:center;border-radius:var(--r-pill);border:1px solid var(--line-decor);background:var(--canvas);font-size:14px;font-weight:600;color:#1d2638} .svc .count{font-size:14px;font-weight:700;color:var(--brass-text)} .note-bar{margin-top:clamp(24px,3vw,36px);padding:16px 20px;border:1px solid var(--line-decor);border-radius:var(--r-control);background:var(--surface);font-size:15px;color:var(--muted)} .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px);counter-reset:s} .step{position:relative;padding:clamp(24px,3vw,32px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card)} .step::before{counter-increment:s;content:counter(s,persian);display:grid;place-items:center;width:44px;height:44px;margin-bottom:14px;border-radius:50%;background:var(--espresso);color:var(--brass-soft);font-weight:800;font-size:20px;border:1.5px solid var(--brass)} .step p{margin-top:8px;color:var(--muted)} .split{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:start} .feat{display:grid;gap:14px} .feat li{display:flex;gap:14px;align-items:flex-start;padding:18px 20px;border-radius:var(--r-card);border:1px solid var(--line-dark);background:linear-gradient(180deg,rgba(241,246,252,.07),rgba(241,246,252,.02))} .feat .dot{flex:0 0 10px;width:10px;height:10px;margin-top:12px;border-radius:50%;background:var(--brass-soft)} .feat strong{display:block;color:var(--ivory);font-size:17px;font-weight:700} .feat span.d{color:var(--ivory-2);font-size:15px} .msgrs{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px} .msgrs li{display:inline-flex;align-items:center;min-height:40px;padding:0 16px;border-radius:var(--r-pill);border:1px solid rgba(167,176,187,.55);color:var(--ivory);font-weight:700;font-size:15px} .no-list{margin-top:22px;padding:16px 20px;border-radius:var(--r-control);border:1px dashed var(--line-dark);color:var(--ivory-2);font-size:15px} .plans{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px);align-items:stretch} .plan{display:flex;flex-direction:column;gap:12px;padding:clamp(24px,3vw,36px);background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card)} .plan--pro{border:1.5px solid var(--brass);box-shadow:0 0 0 4px rgba(124,137,152,.12),0 18px 40px rgba(21,33,57,.12)} .plan .badge{align-self:flex-start;padding:0 12px;min-height:28px;display:inline-flex;align-items:center;border-radius:var(--r-pill);background:var(--espresso);color:var(--brass-soft);font-size:13px;font-weight:700} .plan .price{font-size:clamp(30px,3vw,38px);font-weight:800;line-height:1.3} .plan .price small{font-size:16px;font-weight:600;color:var(--muted);margin-inline-start:6px} .plan ul{display:grid;gap:10px;margin-top:6px;padding-top:16px;border-top:1px solid var(--line-decor)} .plan li{position:relative;padding-inline-start:26px;font-size:15px;color:#1d2638} .plan li::before{content:"";position:absolute;inset-inline-start:0;top:.7em;width:14px;height:1.6px;background:var(--brass-text)} .plan-note{margin-top:clamp(20px,3vw,32px);padding:16px 20px;border-radius:var(--r-control);border:1px solid var(--line-decor);background:var(--surface);font-size:15px;color:var(--muted)} .faq{max-width:860px;display:grid;gap:12px} .faq details{background:var(--surface);border:1px solid var(--line-decor);border-radius:var(--r-card);overflow:hidden} .faq summary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:60px;padding:14px 22px;cursor:pointer;font-size:17px;font-weight:700;list-style:none} .faq summary::-webkit-details-marker{display:none} .faq summary::after{content:"+";flex:0 0 28px;display:grid;place-items:center;width:28px;height:28px;border-radius:50%;border:1px solid var(--line-control);font-size:20px;line-height:1;color:var(--brass-text);transition:transform 240ms var(--ease)} .faq details[open] summary::after{content:"−"} .faq details p{padding:0 22px 20px;color:var(--muted);font-size:16px} .start-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(16px,2.4vw,28px)} .path{display:flex;flex-direction:column;align-items:flex-start;gap:14px;padding:clamp(24px,3vw,40px);border-radius:var(--r-frame);border:1px solid var(--line-dark);background:var(--espresso-2)} .path p{color:var(--ivory-2);font-size:16px} .path .btn{margin-top:auto} .path h3{color:var(--ivory)} .site-footer{background:var(--espresso);color:#a0a7ae;padding:40px var(--gut) 44px;border-top:1px solid rgba(167,176,187,.2);font-size:14px} .foot{display:flex;flex-wrap:wrap;justify-content:space-between;gap:20px 40px;align-items:flex-start} .foot .brand{color:var(--ivory)} .foot ul{display:flex;flex-wrap:wrap;gap:8px 24px} .foot a{color:var(--ivory-2);padding:8px 0;display:inline-block} .foot a:hover{color:#fff} .legal{margin-top:24px;padding-top:20px;border-top:1px solid rgba(167,176,187,.16);line-height:1.9} @media (max-width:1100px){.nav{display:none} .site-header{gap:10px} .menu-toggle{display:inline-flex;align-items:center;justify-content:center;flex:0 0 46px;width:46px;height:46px;padding:0;border-radius:50%;border:1px solid var(--brass);background:rgba(247,249,251,.88);color:var(--ink);cursor:pointer;box-shadow:0 5px 16px rgba(22,31,51,.08)} .menu-bars{position:relative;display:block;width:19px;height:14px} .menu-bars i{position:absolute;display:block;width:19px;height:1.8px;background:currentColor;border-radius:3px;inset-inline-start:0;transition:transform 160ms ease,top 160ms ease} .menu-bars i:first-child{top:3px}.menu-bars i:last-child{top:10px} .menu-toggle[aria-expanded="true"] .menu-bars i:first-child{top:7px;transform:rotate(45deg)} .menu-toggle[aria-expanded="true"] .menu-bars i:last-child{top:7px;transform:rotate(-45deg)} .mobile-menu:not([hidden]){display:block;position:absolute;top:calc(100% + 8px);inset-inline-end:clamp(16px,4vw,64px);z-index:35;width:min(380px,calc(100vw - 32px));padding:18px 20px 16px;color:var(--ink);background:var(--surface);border:1px solid var(--line-decor);border-radius:20px;box-shadow:0 20px 55px rgba(14,20,32,.18),0 3px 12px rgba(14,20,32,.06);animation:menu-appear 160ms ease-out both} .menu-kicker{margin:0 0 8px;color:var(--brass-text);font-size:13px;font-weight:700} .menu-link{min-height:51px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--sunken);font-size:16px;font-weight:700} .menu-link:hover{color:var(--brass-text)} .menu-link>span:last-child{color:var(--brass-text);font-size:18px}} @media (max-width:1100px){.selection{padding-top:0} .selection-grid{grid-template-columns:1fr;gap:30px} .selection-copy{order:2;text-align:center} .selection-copy p{margin-inline:auto} .chips{justify-content:center} .compare{order:1;margin:max(-44.52px,-8.56%) auto 0;max-width:520px} .cards3,.steps,.plans{grid-template-columns:1fr} .split,.start-grid{grid-template-columns:1fr}} @media (max-width:560px){.site-header{padding:12px 16px;gap:6px} .header-actions{gap:7px} .brand{font-size:22px}.brand small{font-size:16px} .menu-toggle{width:44px;height:44px;flex-basis:44px} .btn{min-height:44px;padding:0 14px;font-size:14px} .btn--lg{min-height:52px;font-size:17px;padding:0 24px} .compare .tag{font-size:13px;bottom:12%} .selection-copy p,.sec-head p.sub{font-size:17px}} @media (max-width:360px){.brand{font-size:20px}.brand small{font-size:13px;margin-inline-start:4px} .btn{padding:0 11px;font-size:13px;gap:6px}.btn .arrow{font-size:16px}} @media (min-width:1101px) and (max-width:1280px){} @media (min-width:1101px){.hero{background-size:max(112%,1565px) auto}} @keyframes menu-appear{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}} @media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{transition:none!important;animation:none!important}} :root{--hh:76px;--p:0;--z:1} .film{position:relative;height:calc(100svh - var(--hh) + 50svh);background:#dee5eb} .stage{position:sticky;top:calc(var(--hh) + env(safe-area-inset-top,0px));height:calc(100svh - var(--hh));min-height:540px;overflow:hidden;isolation:isolate;background:#dee5eb;display:grid;grid-template-columns:minmax(340px,36%) 1fr;align-items:stretch} .fade{position:absolute;inset:0;z-index:9;pointer-events:none;background:linear-gradient(180deg,rgba(8,13,21,0) 40%,#080d15 100%);opacity:0} .copy{position:relative;z-index:6;align-self:center;padding:24px clamp(20px,3.4vw,56px);text-align:right;opacity:calc(1 - var(--p)*1.8);transform:translateY(calc(var(--p)*-40px))} .eyebrow{margin:0 0 12px;font-size:16px;font-weight:700;color:#474e57} h1{margin:0 0 16px;font-size:clamp(30px,2.9vw,48px);line-height:1.3;font-weight:800;color:#080d16;text-wrap:balance} .lead{margin:0 0 22px;font-size:clamp(16px,1.25vw,18px);line-height:1.95;color:#1c2331;font-weight:500;max-width:46ch} .cta-row{display:flex;flex-wrap:wrap;gap:12px;align-items:center} .fineprint{margin:14px 0 0;font-size:13.5px;line-height:1.8;color:#3b4559;font-weight:500} .reveal{animation:rise 900ms var(--ease) both} .copy .reveal:nth-child(2){animation-delay:120ms}.copy .reveal:nth-child(3){animation-delay:220ms}.copy .reveal:nth-child(4){animation-delay:320ms}.copy .reveal:nth-child(5){animation-delay:420ms} @keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}} .studio{position:relative;min-width:0;overflow:hidden} .mirror{position:absolute;inset:0;transform:scale(var(--z));transform-origin:50% 45%;will-change:transform} .mirror::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:2;background:linear-gradient(270deg,#dee5eb 0,rgba(222,229,235,0) 12%),radial-gradient(120% 90% at 50% 42%,transparent 58%,rgba(8,13,21,.18) 100%)} .plate{position:absolute;left:0;top:0;width:1376px;height:768px;animation:dolly 2200ms var(--ease) both;transform-origin:50% 45%} .plate img,.plate canvas{position:absolute;inset:0;width:100%;height:100%;display:block} .plate img.alt{opacity:0;transition:opacity 480ms var(--ease)} .plate img.alt.show{opacity:1} @keyframes dolly{from{transform:scale(1.1);filter:brightness(.72) saturate(.8)}to{transform:none;filter:none}} .glass{background:rgba(217,224,231,.78);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(124,137,152,.5);box-shadow:0 18px 44px rgba(14,22,38,.2)} @supports not (backdrop-filter:blur(1px)){.glass{background:#d9e0e7}} svg.frame{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none} .frame rect{x:1px;y:1px;width:calc(100% - 2px);height:calc(100% - 2px);rx:9px;ry:9px} .frame rect,.frame circle{fill:none;vector-effect:non-scaling-stroke} .frame .edge{stroke:#b7a686;stroke-width:1;opacity:.4;transition:opacity 240ms,stroke 240ms} .frame .orbit{stroke:#dfd3be;stroke-width:1.4;stroke-linecap:round;stroke-dasharray:13 87;stroke-dashoffset:0;opacity:0;filter:drop-shadow(0 0 2px #cdbc9a);animation:gold-orbit 4s linear infinite;animation-play-state:paused;transition:opacity 240ms} [aria-checked="true"] .frame .edge{opacity:1;stroke:#cdbc9a} [aria-checked="true"] .frame .orbit{opacity:.95;animation-play-state:running} @keyframes gold-orbit{to{stroke-dashoffset:-100}} .dock{--u:1;position:absolute;z-index:3;left:49.85%;top:min(64.6%,var(--dock-limit,100%));width:26%;padding:calc(6px * var(--u)) calc(8px * var(--u)) 0;border-radius:calc(18px * var(--u));transform:translateX(-50%);transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s} .dock.away{opacity:0;visibility:hidden;transform:translateX(-50%) translateY(14px);transition:opacity 360ms var(--ease),transform 360ms var(--ease),visibility 0s linear 360ms} .dock h2{margin:0;font-size:calc(13px * var(--u));font-weight:800;color:#0e1522;text-align:center} .dock-view{position:relative} .hscroll{display:flex;overflow-x:auto;scroll-snap-type:x proximity;scrollbar-width:none;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch} .hscroll::-webkit-scrollbar{display:none} .hscroll.dragging{cursor:grabbing;scroll-snap-type:none} .dock-track{gap:calc(4px * var(--u));padding:calc(10px * var(--u)) calc(26px * var(--u)) calc(6px * var(--u));cursor:grab;-webkit-mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent);mask-image:linear-gradient(90deg,transparent,#000 12%,#000 88%,transparent)} .d-item{position:relative;flex:0 0 33.333%;scroll-snap-align:center;display:flex;flex-direction:column;align-items:center;gap:calc(2px * var(--u));padding:calc(4px * var(--u)) 0 calc(5px * var(--u));border:0;background:none;cursor:pointer;color:#131923;font-size:calc(11.5px * var(--u));font-weight:700;line-height:1.35;text-align:center;border-radius:calc(12px * var(--u))} .d-item .ic{display:grid;place-items:center;height:calc(58px * var(--u));width:100%} .d-item img{height:calc(50px * var(--u));width:auto;max-width:86%;object-fit:contain;filter:drop-shadow(0 calc(4px * var(--u)) calc(5px * var(--u)) rgba(19,32,57,.28));transition:transform 260ms var(--ease);pointer-events:none;-webkit-user-drag:none} .d-item>span:last-of-type{max-width:100%;padding:0 2px;line-height:1.25;min-height:2.5em;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden} .d-item:hover img,.d-item[aria-checked="true"] img{transform:translateY(-4%) scale(1.18)} .d-item[aria-checked="true"]{background:rgba(244,248,253,.6)} .nav-btn{position:absolute;top:50%;z-index:2;width:calc(34px * var(--u));height:calc(34px * var(--u));min-width:28px;min-height:28px;transform:translateY(-50%);border-radius:50%;border:1px solid var(--brass);background:rgba(247,249,251,.96);color:var(--ink);font-size:calc(20px * var(--u));line-height:1;cursor:pointer;display:grid;place-items:center;padding:0 0 2px;box-shadow:0 4px 10px rgba(14,22,38,.18)} .nav-btn:hover{background:#fff} .nav-btn[disabled]{opacity:.35;cursor:default} .dock .nav-r{right:calc(-6px * var(--u))}.dock .nav-l{left:calc(-6px * var(--u))} .more{display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-height:calc(32px * var(--u));border:0;border-top:1px solid rgba(124,137,152,.4);background:none;color:#253047;font-size:calc(12px * var(--u));font-weight:700;cursor:pointer;border-radius:0 0 calc(14px * var(--u)) calc(14px * var(--u))} .more:hover{color:#0c121d} .more svg,.close svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round} .more svg{animation:bob 1.8s var(--ease) infinite} @keyframes bob{0%,100%{transform:translateY(-1px)}50%{transform:translateY(3px)}} .palette{position:absolute;z-index:4;left:clamp(12px,2vw,32px);top:50%;transform:translateY(-50%);width:94px;border-radius:48px;padding:12px 0 8px} .palette h2,.styles-head h2{margin:0 0 2px;font-size:13px;font-weight:800;color:#3b4559;text-align:center} .col-list{display:flex;flex-direction:column;gap:2px} .sw{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 4px;border:0;background:none;cursor:pointer;color:#131923;font-size:12px;font-weight:700;line-height:1.3;text-align:center;border-radius:16px} .sw .dot{width:40px;height:40px;border-radius:50%;padding:3px;background:linear-gradient(145deg,#bcc5cf,#6f7b89 55%,#adb8c4);box-shadow:0 6px 12px rgba(21,33,57,.18);transition:transform 240ms var(--ease)} .sw .dot i{display:block;width:100%;height:100%;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(235,242,250,.45)} .sw:hover .dot{transform:scale(1.08)} .sw[aria-checked="true"] .dot{transform:scale(1.1);box-shadow:0 0 0 3px #e8edf3,0 0 0 4.5px #7c8998,0 6px 12px rgba(21,33,57,.18)} @media (max-height:760px) and (min-width:901px){.sw>span:not(.dot){font-size:11px}.sw .dot{width:34px;height:34px}.sw{padding:4px}} .reference{position:absolute;z-index:4;right:clamp(14px,2.4vw,40px);top:clamp(14px,4vh,40px);width:min(230px,26%);display:flex;gap:10px;align-items:center;padding:8px;border-radius:18px;opacity:0;transform:translateY(10px);transition:opacity 380ms var(--ease),transform 380ms var(--ease);pointer-events:none} .reference.on{opacity:1;transform:none;pointer-events:auto} .reference .ph{flex:0 0 64px;aspect-ratio:4/5;border-radius:12px;overflow:hidden;background:#c1cad3} .reference .ph img{width:100%;height:100%;object-fit:cover} .ref-body{display:grid;gap:2px;min-width:0;text-align:right} .ref-body strong{font-size:14px;color:#0c121d} .ref-body small{font-size:12px;line-height:1.6;color:#3b4559} .ref-try{font-size:12.5px;font-weight:800;color:#2f4066;text-decoration:underline;text-underline-offset:3px} .result{position:absolute;z-index:5;left:50%;bottom:clamp(10px,2.2vh,22px);transform:translate(-50%,10px);display:flex;align-items:center;gap:12px;padding:6px 6px 6px 16px;border-radius:var(--r-pill);font-size:14px;font-weight:700;color:#131923;opacity:0;pointer-events:none;transition:opacity 380ms var(--ease),transform 380ms var(--ease);white-space:nowrap;max-width:calc(100% - 24px)} .result.on{opacity:1;pointer-events:auto;transform:translate(-50%,0)} .result .btn{min-height:40px;padding:0 16px;font-size:14px} .result span{overflow:hidden;text-overflow:ellipsis} .styles{position:absolute;z-index:8;left:0;right:0;bottom:0;padding-bottom:clamp(10px,2.4vh,24px);background:linear-gradient(180deg,rgba(222,229,235,0),rgba(222,229,235,.94) 26%);opacity:0;visibility:hidden;transform:translateY(60px);transition:opacity 420ms var(--ease),transform 520ms var(--ease),visibility 0s linear 520ms} .styles.open{opacity:1;visibility:visible;transform:none;transition:opacity 420ms var(--ease),transform 520ms var(--ease)} .styles-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px clamp(16px,5vw,80px) 8px} .styles-head h2{text-align:right;font-size:15px} .close{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:0 14px;border-radius:var(--r-pill);border:1px solid var(--brass);background:rgba(247,249,251,.95);color:var(--ink);font-size:14px;font-weight:700;cursor:pointer} .close:hover{background:#fff} .rail-wrap{position:relative} .track{gap:16px;padding:12px clamp(56px,6vw,96px) 14px;cursor:grab} .card{position:relative;flex:0 0 auto;scroll-snap-align:center;width:clamp(92px,min(10vw,17vh),132px);padding:0;border:0;background:none;cursor:pointer;text-align:center;font-size:13.5px;font-weight:700;color:#131923;transition:transform 300ms var(--ease)} .card .ph{display:block;aspect-ratio:4/5;border-radius:16px;overflow:hidden;box-shadow:0 12px 26px rgba(14,22,38,.26)} .card img{display:block;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none} .card .nm{display:block;margin-top:8px;padding:2px 6px;border-radius:10px;background:rgba(232,237,243,.85);line-height:1.5} .card:hover{transform:translateY(-5px)} .card[aria-checked="true"]{transform:translateY(-6px)} .card[aria-checked="true"] .ph{box-shadow:0 0 0 3px #e8edf3,0 0 0 4.5px #7c8998,0 18px 36px rgba(14,22,38,.34)} .card[aria-checked="true"] .nm{background:var(--espresso);color:var(--cream)} .card svg.frame{display:block}.card .frame rect{rx:16px;ry:16px} .rail-wrap .nav-btn{--u:1;width:44px;height:44px;font-size:26px;margin-top:-14px} .rail-wrap .nav-r{right:clamp(8px,2vw,28px)}.rail-wrap .nav-l{left:clamp(8px,2vw,28px)} @media (min-width:901px) and (max-width:1180px){.stage{grid-template-columns:minmax(320px,40%) 1fr}h1{font-size:clamp(28px,3.1vw,38px)}.lead{font-size:16px}.reference{display:none}} @media (min-width:901px) and (max-height:700px){.lead{display:none}.fineprint{display:none}} @media (max-width:900px){.film{height:auto} .stage{position:relative;top:auto;height:auto;min-height:0;display:flex;flex-direction:column;overflow:visible} .copy{display:contents} .copy>*{padding-inline:20px;text-align:center} .eyebrow{order:1;padding-top:20px}h1{order:2}.studio{order:3}.palette.mobile{order:4}.dock.mobile{order:5}.lead{order:6}.cta-row{order:7}.fineprint{order:8;padding-bottom:22px} .eyebrow{font-size:14px;margin-bottom:8px} h1{font-size:clamp(26px,7.4vw,34px);margin-bottom:10px} .lead{font-size:15.5px;line-height:1.9;margin:0 auto 16px} .cta-row{justify-content:center} .cta-row .btn--lg{width:100%;font-size:17px} .fineprint{font-size:12.5px} .studio{height:min(118vw,560px);overflow:hidden} .mirror{transform:none} .mirror::after{background:radial-gradient(120% 90% at 50% 42%,transparent 60%,rgba(8,13,21,.16) 100%)} .palette.mobile{position:relative;left:auto;top:auto;transform:none;width:auto;margin:10px 12px 0;border-radius:22px;padding:8px 6px 6px} .palette.mobile .col-list{flex-direction:row;overflow-x:auto;scrollbar-width:none;gap:2px} .palette.mobile .col-list::-webkit-scrollbar{display:none} .palette.mobile .sw{flex:0 0 74px;font-size:11.5px}.palette.mobile .sw .dot{width:38px;height:38px} .reference{display:none} .result{bottom:auto;top:10px;font-size:13px;padding:4px 4px 4px 12px}.result .btn{min-height:36px;padding:0 12px;font-size:13px} .dock.mobile{position:relative;left:auto;top:auto;width:auto;transform:none;margin:10px 12px 6px;--u:1.05} .dock.mobile .d-item{flex:0 0 clamp(88px,27vw,118px)} .studio{height:min(100vw,520px)} .lead{margin-top:16px} .dock.mobile.away{transform:translateY(14px)} .styles{position:fixed;z-index:40;padding-bottom:max(12px,env(safe-area-inset-bottom,0px));background:rgba(222,229,235,.97);box-shadow:0 -12px 30px rgba(14,22,38,.18)} .rail-wrap .nav-btn{display:none} .track{padding-inline:20px} .card{width:clamp(92px,27vw,116px)} .fade{display:none}} @media (prefers-reduced-motion:reduce){.reveal,.plate{animation:none}.more svg{animation:none}.mirror{transform:none}} .nav-btn::before{content:"";position:absolute;inset:50% auto auto 50%;width:44px;height:44px;transform:translate(-50%,-50%);border-radius:50%} .plate{animation:none;--scene-scale:1} .plate>.room-backdrop{z-index:0} .empty-glass{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none} .mirror-front{position:absolute;inset:0;z-index:2;opacity:0;clip-path:polygon(35.9% 19.9%,63.7% 19.9%,63.7% 63.6%,35.9% 63.6%);transform-origin:49.8% 42%;transition:opacity 700ms var(--ease),transform 1000ms var(--ease);backface-visibility:hidden;pointer-events:none} .portrait-visible .mirror-front{opacity:1} #roomImg{z-index:0}#roomImg2{z-index:1}#hairCanvas{z-index:2;pointer-events:none} .mirror-flipped .mirror-front{transform:perspective(1400px) rotateY(180deg);opacity:0} .mirror-invite{position:absolute;z-index:3;left:43.9%;top:22.8%;width:11.2%;height:38.2%;padding:calc(12px * var(--scene-scale));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(12px * var(--scene-scale));text-align:center;color:#edf2f6;background:linear-gradient(150deg,#1b222f,#080d15);border:1px solid #b7a686;border-radius:48% 48% 2px 2px / 27% 27% 2px 2px;transform:perspective(1400px) rotateY(-180deg);opacity:0;pointer-events:none;transition:transform 1000ms var(--ease),opacity 600ms var(--ease);backface-visibility:hidden} .mirror-flipped .mirror-invite{transform:none;opacity:1;pointer-events:auto} .invite-mark{color:#a7b0bb;font-size:calc(24px * var(--scene-scale));line-height:1} .mirror-invite p{font-size:calc(24px * var(--scene-scale));line-height:1.6;font-weight:700;margin:0} .mirror-invite .btn{font-size:calc(12px * var(--scene-scale));line-height:1.8;min-height:44px;padding:calc(8px * var(--scene-scale));white-space:normal;border-color:#b7a686;background:#d6cbb4;color:#080d15;gap:4px} .mirror-invite button{font-size:calc(11px * var(--scene-scale));color:#edf2f6;text-decoration:underline;text-underline-offset:4px;border:0;background:none;min-height:44px;cursor:pointer;padding:0} .dock{z-index:4} .d-item .ic{height:calc(62px * var(--u));overflow:hidden;border-radius:9px;width:calc(46px * var(--u))} .d-item img{position:static;width:100%;height:100%;max-width:none;object-fit:cover;filter:none;border-radius:9px} .preview-kind{display:block;font-size:11px;font-weight:500;margin-top:4px;color:#3b4559} .demo-file{position:absolute;z-index:11;width:100px;padding:6px;border:1px solid #7c8998;border-radius:14px;background:#f7f9fb;box-shadow:0 14px 28px #080d1530;opacity:0;pointer-events:none;transform:rotate(-8deg) scale(.9);transition:opacity 250ms,transform 250ms} .demo-file.visible{opacity:1;transform:rotate(-8deg) scale(1)} .demo-file img{display:block;width:88px;height:74px;object-fit:cover;object-position:50% 40%;border-radius:8px} .demo-file span{display:block;font-size:11px;text-align:center;white-space:nowrap;color:#1c2331;padding-top:4px} .demo-hand{position:absolute;z-index:12;width:34px;height:40px;fill:#fff;stroke:#0e141f;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 4px 5px #080d1540);opacity:0;pointer-events:none;transform-origin:25% 15%;transition:opacity 200ms,transform 180ms} .demo-hand.visible{opacity:1}.demo-hand.press{transform:scale(.78)} .demo-caption{position:absolute;z-index:7;left:12%;top:18px;max-width:43%;padding:8px 16px;border:1px solid #7c899860;background:#f7f9fbdd;backdrop-filter:blur(8px);border-radius:24px;font-size:13px;line-height:1.8;text-align:center;color:#253047;pointer-events:none} .demo-controls{position:absolute;z-index:7;left:14px;bottom:12px} .demo-controls button{min-height:44px;padding:0 14px;border:1px solid #7c899880;border-radius:24px;background:#f7f9fbdd;color:#253047;font-size:12px;cursor:pointer} .demo-controls button[hidden]{display:none} .demo-highlight{outline:2px solid #5c6b7d;outline-offset:3px} .stage[data-demo="playing"] .reference,.stage[data-demo="playing"] .result{opacity:0;pointer-events:none} @media(min-width:901px) and (max-height:700px){.copy .lead{display:block;font-size:14px;line-height:1.8;margin-bottom:14px}.copy h1{font-size:30px}.copy .fineprint{display:block;font-size:11px}.copy .cta-row{gap:8px}.copy .cta-row .btn{font-size:13px;min-height:44px}} @media(max-width:900px){.demo-caption{position:relative;left:auto;top:auto;max-width:none;margin:8px 20px 0;order:4;font-size:12px;min-height:40px} .palette.mobile{order:5}.dock.mobile{order:6}.lead{order:7}.cta-row{order:8}.fineprint{order:9} .demo-controls{position:relative;left:auto;bottom:auto;text-align:center;order:10;padding:0 16px 16px} .demo-hand{display:none}.copy .cta-row .btn--ghost{font-size:14px} .mirror-invite .btn{font-size:max(11px,calc(12px * var(--scene-scale)))}.mirror-invite button{font-size:max(11px,calc(11px * var(--scene-scale)))}.mirror-invite{padding:6px;gap:4px}} @media(prefers-reduced-motion:reduce){.mirror-front,.mirror-invite,.demo-hand,.demo-file{transition:none}.demo-file,.demo-hand{display:none}.mirror-front{opacity:1}.mirror-flipped .mirror-front{transform:none;opacity:1}.mirror-invite{display:none}} .mirror-flipped .reference,.mirror-flipped .result{opacity:0;pointer-events:none} .demo-file{overflow:hidden}.demo-file img{transform:scale(3.1);transform-origin:50% 40%;clip-path:inset(24% 33% 39% 33%)} .demo-file span{position:relative;z-index:1;background:#f7f9fb} .d-item .ic,.card .ph{position:relative;overflow:visible;isolation:isolate} .d-item img,.d-item:hover img,.d-item[aria-checked="true"] img{transform:none} .d-item[aria-checked="true"]{background:none} .d-item .ic{box-shadow:inset 0 0 0 1px #7c899850;transition:box-shadow 250ms} .d-item[aria-checked="true"] .ic{box-shadow:0 0 7px #97a5b626,inset 0 0 0 1px #8f9eb0} .card img{border-radius:16px} .card[aria-checked="true"]{transform:none} .card[aria-checked="true"] .ph{box-shadow:0 0 8px #97a5b630,0 12px 26px #0e162626} .card[aria-checked="true"] .nm{background:rgba(232,237,243,.85);color:#131923} .sw .dot{position:relative;isolation:isolate;transition:box-shadow 250ms} .sw:hover .dot,.sw[aria-checked="true"] .dot{transform:none} .sw[aria-checked="true"] .dot{box-shadow:0 0 7px 1px #94a2b345,inset 0 0 0 1px #b8c1cc,0 4px 9px #15213916} .sw .frame .edge{opacity:0} .sw[aria-checked="true"] .frame .edge{opacity:.8;stroke-width:1} .sw .frame .orbit{stroke-width:1.2} .d-item:focus-visible,.card:focus-visible,.sw:focus-visible{outline:none} .d-item:focus-visible .ic,.card:focus-visible .ph,.sw:focus-visible .dot{outline:2px solid var(--focus);outline-offset:4px} .demo-highlight{outline:0} .demo-highlight .frame .orbit{opacity:.95;animation-play-state:running} @media(prefers-reduced-motion:reduce){.frame .orbit{animation:none;stroke-dasharray:none;opacity:0!important}} @media(max-width:900px){.hero-playground{order:3;display:flex;flex-direction:column;margin:0 12px 16px;border:1px solid #7c899845;border-radius:20px;overflow:clip;background:#dee5eb;height:min(76svh,610px);min-height:470px} .hero-playground .studio{order:0;flex:1;height:auto;min-height:210px;max-height:340px;width:100%;position:relative} .hero-playground .palette.mobile{order:1;flex:none;margin:0;border:0;border-top:1px solid #7c899840;border-radius:0;padding:5px 6px;box-shadow:none;backdrop-filter:none} .hero-playground .palette h2{font-size:11px;margin:0 0 3px}.hero-playground .col-list{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));overflow:visible;gap:0} .hero-playground .palette.mobile .sw{width:auto;min-width:0;min-height:50px;flex:none;font-size:8px;padding:3px 0;gap:3px}.hero-playground .palette.mobile .sw .dot{width:30px;height:30px} .hero-playground .dock.mobile{order:2;flex:none;margin:0;width:100%;border:0;border-top:1px solid #7c899840;border-radius:0;padding:7px 12px;--u:.8;box-shadow:none;backdrop-filter:none} .hero-playground .dock h2{font-size:11px;margin-bottom:3px}.hero-playground .dock.mobile .d-item{flex:0 0 28%;font-size:10px}.hero-playground .more{min-height:34px;font-size:10px} .demo-caption,.demo-controls{display:none}.result{display:none}.eyebrow{font-size:12px;padding-top:14px}h1{font-size:25px;line-height:1.5}.lead{font-size:14px}.copy .cta-row .btn{font-size:14px}} .result{display:none!important}.dock .more{position:relative;z-index:6;min-height:44px}.dock{padding-bottom:8px}.site-loader{position:fixed;inset:0;z-index:1000;background:#e3e9f0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;transition:opacity .4s,visibility .4s}.site-loader.is-done{opacity:0;visibility:hidden;pointer-events:none}.hero-loading{overflow:hidden}.loader-mirror{position:relative;width:110px;height:150px;border:1px solid #7c8998;border-radius:60px 60px 7px 7px;display:grid;place-items:center;overflow:hidden;background:linear-gradient(145deg,#d6dee7,#f0f5fb)}.loader-mirror span{font-size:25px;font-weight:800;color:#18202e}.loader-mirror i{position:absolute;inset:-100%;background:linear-gradient(110deg,transparent 45%,#fff9 50%,transparent 55%);animation:mirrorShine 1.7s ease-in-out infinite}.site-loader p{font-size:13px;color:#575e66;margin:0}.loader-track{height:2px;width:150px;background:#bdc3c9;overflow:hidden}.loader-track i{display:block;height:100%;width:0;background:#6a7889;transition:width .2s}@keyframes mirrorShine{from{transform:translateX(-50%)}to{transform:translateX(50%)}}@media(prefers-reduced-motion:reduce){.loader-mirror i{animation:none}} html.try-open{overflow:hidden}.personal-try{padding:0;border:1px solid #a2aab3;border-radius:24px;background:#eaeef3;color:#18202e;width:min(900px,calc(100% - 24px));height:min(880px,calc(100svh - 32px));max-height:calc(100svh - 32px);overflow:hidden;box-shadow:0 30px 100px #0006}.personal-try::backdrop{background:#0f1216c9;backdrop-filter:blur(8px)}.personal-head{height:64px;display:flex;align-items:center;justify-content:space-between;padding:12px 20px;border-bottom:1px solid #a2aab355;direction:rtl}.personal-head button{width:42px;height:42px;border:1px solid #7c8998;border-radius:50%;font:inherit;font-size:25px;cursor:pointer;background:transparent;color:inherit}.personal-try iframe{display:block;width:100%;height:calc(100% - 64px);border:0;background:#eaeef3}@media(max-width:600px){.personal-try{width:calc(100% - 12px);height:calc(100svh - 12px);max-height:calc(100svh - 12px);border-radius:18px}} .site-header .btn{max-width:280px;white-space:normal;text-align:center;line-height:1.6}@media(max-width:600px){.site-header .btn{max-width:185px;font-size:10px;padding:8px 14px;min-height:44px}} .site-loader[hidden]{display:none} .copy .fineprint a{text-decoration:underline;text-underline-offset:4px;display:inline-flex;align-items:center;min-height:44px} @media(max-width:900px){.stage .copy .lead{order:3}.stage .copy .cta-row{order:4}.stage .copy .fineprint{order:5;padding-bottom:8px} .hero-playground{order:6} .stage[data-render-state="error"] .demo-caption{display:block;order:7;margin:0 16px 12px}} .copy:focus-within{opacity:1;transform:none} .path--form{gap:16px} .path--form>p{max-width:560px} .lf-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;width:100%} .lf-field{display:grid;gap:6px;width:100%} .lf-field label,.lf-hp label{font-size:14px;font-weight:700;color:var(--ivory)} .lf-field input,.lf-field textarea{width:100%;min-height:48px;padding:10px 14px;border-radius:var(--r-control);border:1px solid #8b9198;background:#080d15;color:var(--ivory);font:inherit;font-size:16px;line-height:1.6} .lf-field textarea{min-height:72px;resize:vertical} .lf-field input:focus-visible,.lf-field textarea:focus-visible{outline:3px solid var(--focus-dark);outline-offset:2px;border-color:var(--focus-dark)} .lf-field input[aria-invalid="true"]{border-color:#F2B8BE} .lf-hp{position:absolute;inset-inline-start:-9999px;width:1px;height:1px;overflow:hidden} .lf-check{display:flex;align-items:flex-start;gap:12px;font-size:15px;color:var(--ivory-2);cursor:pointer;line-height:1.8} .lf-check input{flex:0 0 24px;width:24px;height:24px;margin:2px 0 0;accent-color:#a7b0bb} .lf-err{min-height:1.6em;margin:0;font-size:15px;font-weight:700;color:#F2B8BE} .lf-done{margin:0;padding:16px 18px;border-radius:var(--r-control);border:1px solid #BFE3C8;background:rgba(191,227,200,.08);color:#BFE3C8;font-weight:700;line-height:1.9} .path--form .btn[disabled]{opacity:.6;cursor:progress} @media (max-width:640px){.lf-grid{grid-template-columns:1fr}} #lf-send[hidden]{display:none} .lf-resend{margin-top:8px;background:none;border:0;padding:6px 0;font:inherit;font-size:.85rem;color:var(--brass,#b7a686);text-decoration:underline;cursor:pointer;min-height:44px} .lf-resend:disabled{color:inherit;opacity:.55;text-decoration:none;cursor:default} #lf-code{letter-spacing:.4em;text-align:center;font-variant-numeric:tabular-nums} .trial{background:var(--canvas)} .trial-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:clamp(32px,6vw,80px);align-items:start} .trial .sec-head{margin-bottom:24px} .trial .path--form{background:var(--espresso);color:var(--cream);border-color:var(--line-dark)} .trial .path--form h3{color:var(--ivory)} .trial .path--form .btn{background:var(--cream);color:var(--espresso);border-color:var(--brass-soft)} .trial-mock{position:sticky;top:calc(var(--hh,76px) + 24px);display:grid;gap:14px;justify-items:center} .brand-pick{display:flex;align-items:center;gap:10px;width:min(340px,100%)} .bp-label{font-size:14px;font-weight:700;color:var(--muted);margin-inline-end:auto} .brand-pick button{width:44px;height:44px;padding:0;border-radius:50%;border:1px solid var(--line-control);background:var(--surface);cursor:pointer;display:grid;place-items:center} .brand-pick button i{display:block;width:28px;height:28px;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)} .brand-pick button[aria-checked="true"]{box-shadow:0 0 0 3px var(--canvas),0 0 0 4.5px var(--brass-text)} .salon-card{width:min(340px,100%);border-radius:28px;overflow:hidden;background:var(--surface);border:1px solid var(--line-decor);box-shadow:0 30px 60px rgba(21,33,57,.18);--brand:#7c8998} .sc-cover{height:110px;background:linear-gradient(135deg,var(--brand),color-mix(in srgb,var(--brand) 55%,#080d15));transition:background 320ms var(--ease)} .sc-head{display:flex;align-items:center;gap:12px;padding:0 18px;margin-top:-26px} .sc-logo{display:grid;place-items:center;width:56px;height:56px;flex:0 0 56px;border-radius:50%;background:var(--surface);border:3px solid var(--surface);box-shadow:0 6px 16px rgba(0,0,0,.2);color:var(--brand);font-size:24px;font-weight:800;transition:color 320ms var(--ease)} .sc-head>div{min-width:0;padding-top:26px} .sc-head strong{display:block;font-size:17px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere} .sc-head small{display:block;font-size:12.5px;color:var(--muted);line-height:1.5} .sc-lines{display:flex;gap:8px;padding:14px 18px 6px} .sc-lines li{padding:2px 14px;min-height:32px;display:inline-flex;align-items:center;border-radius:var(--r-pill);border:1px solid var(--line-decor);font-size:13px;font-weight:700;color:var(--muted)} .sc-lines li.on{background:var(--brand);border-color:var(--brand);color:#fff;transition:background 320ms var(--ease)} .sc-works{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:8px 18px} .sc-works img{width:100%;aspect-ratio:4/5;object-fit:cover;border-radius:12px;display:block} .sc-cta{margin:8px 18px 18px;padding:12px 14px;border-radius:var(--r-pill);background:var(--brand);color:#fff;text-align:center;font-size:13.5px;font-weight:700;transition:background 320ms var(--ease)} .mock-note{font-size:13px;color:var(--muted);text-align:center;max-width:340px} @media (max-width:900px){.trial-grid{grid-template-columns:1fr}.trial-mock{position:static;order:-1}} @media (max-width:900px){.trial-mock{order:2}.trial-col{order:1}} @media (max-width:900px){.site-footer{padding-bottom:88px}} .salon-builder{background:#dee5ec} .builder-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:clamp(20px,4vw,54px);align-items:start} .builder-form,.builder-preview,.builder-dialog{min-width:0;background:#f1f5fa;border:1px solid #b6bdc5;border-radius:23px;padding:clamp(14px,2.5vw,28px);box-shadow:0 14px 42px #1c2d4e18} .builder-form fieldset{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));min-width:0;gap:12px;border:0;padding:0;margin:0 0 16px} .builder-form legend{font-weight:800;margin-bottom:12px} .builder-form label,.builder-dialog label{display:grid;gap:5px;font-size:14px;font-weight:700;min-width:0} .builder-form .wide{grid-column:1/-1} .builder-form input,.builder-form select,.builder-form textarea,.builder-dialog input{max-width:100%;min-width:0;width:100%;min-height:42px;padding:8px;border:1px solid #8b9299;border-radius:9px;background:#f9fbfe;color:#141b28;font:inherit} .builder-form input[type=color]{max-width:80px;padding:4px} .builder-form input[type=file]{font-size:12px;padding:4px} .builder-form details{margin:12px 0;border:1px solid #b6bdc5;border-radius:12px;padding:12px} .builder-form summary{cursor:pointer;font-weight:800} .builder-form details[open] summary{margin-bottom:14px} .builder-form .builder-work{border-bottom:1px solid #bfc5cb;padding-bottom:12px} .builder-preview{position:sticky;top:88px;display:grid;gap:12px;overflow:hidden;scroll-margin-top:8px} .builder-browser{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;font-size:11px;color:#4f5761} .builder-browser b{overflow-wrap:anywhere} .builder-preview iframe{width:100%;height:clamp(400px,61vh,650px);border:1px solid #b6bdc5;border-radius:13px;background:#eff3f7} .builder-loading{position:absolute;inset:0;background:#ecf1f6f5;display:grid;place-content:center;justify-items:center;gap:18px;padding:20px;text-align:center;font-weight:800} .builder-spinner{width:58px;height:68px;border:2px solid #b4bcc5;border-top-color:#4d5b6a;border-radius:50% 50% 20% 20%;animation:builder-pulse 1s ease-in-out infinite alternate} @keyframes builder-pulse{to{transform:scale(.88);filter:drop-shadow(0 0 9px #7f8d9d)}} .builder-note{font-size:13px;color:#4c5157;margin-top:6px} .builder-error{font-size:14px;color:#932d26;font-weight:700} .builder-dialog{width:min(460px,calc(100% - 32px));max-height:85vh;color:var(--ink);font:inherit} .builder-dialog::backdrop{background:#10162299;backdrop-filter:blur(3px)} .builder-dialog h2{font-size:24px;margin-bottom:14px;padding-inline-end:30px} .builder-dialog form{display:grid;gap:10px} .builder-close{position:absolute;inset-block-start:12px;inset-inline-end:12px;border:0;background:transparent;font-size:30px;line-height:1;cursor:pointer} .builder-form .btn,.builder-preview .btn,.builder-dialog .btn{white-space:normal;text-align:center;padding:8px 16px;max-width:100%} .builder-form .btn--lg,.builder-preview .btn--lg{font-size:16px} .builder-dialog [hidden],.builder-preview [hidden]{display:none!important} @media(max-width:850px){.builder-grid{grid-template-columns:1fr}.builder-preview{position:relative;top:auto}} @media(prefers-reduced-motion:reduce){.builder-spinner{animation:none}} .builder-form .sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap} .salon-builder{background:radial-gradient(ellipse at 20% 5%,#f2f7fc 0%,transparent 60%),#d9e1e9} .builder-grid{grid-template-columns:minmax(300px,.85fr) minmax(0,1.15fr);gap:clamp(16px,3.6vw,44px)} .builder-form{background:#f6fafd;border-color:#b5bcc4} .builder-preview{padding:12px;background:#191e2a;border-color:#707c89;box-shadow:0 18px 54px #25324640} .builder-browser{min-height:28px;color:#d5e0ec;padding:0 5px} .live-badge{display:inline-flex;gap:7px;align-items:center;border-radius:50px;background:#293345;padding:3px 10px} .live-badge::before{content:'';width:6px;height:6px;background:#a3afbd;border-radius:100%;box-shadow:0 0 8px #a3afbd} .builder-live{--salon-brand:#7c8998;background:#f4f8fd;border-radius:16px;overflow:auto;max-height:min(63vh,580px);scrollbar-color:#98a1ac #e9f0f7} .live-cover{height:clamp(76px,13vw,142px);position:relative;background:linear-gradient(120deg,#131923,color-mix(in srgb,var(--salon-brand) 60%,#1b2538));color:#eaf2fa} .live-cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover} .live-cover>span{position:absolute;top:10px;inset-inline-start:12px;font-size:11px;background:#0f1420b8;padding:3px 9px;border-radius:30px} .live-salon{padding:0 clamp(12px,3vw,30px) 16px;display:grid;gap:6px} .live-logo{width:52px;height:52px;display:grid;place-items:center;position:relative;margin-top:-26px;border:3px solid #f4f8fd;border-radius:50%;overflow:hidden;background:var(--salon-brand);color:#0b111f;font-weight:800} .live-logo img,.live-manager img{width:100%;height:100%;object-fit:cover} .live-kicker{font-size:11px;color:#4d5661;font-weight:700} .live-salon h3{font-size:clamp(19px,3vw,30px);overflow-wrap:anywhere} .live-salon p{font-size:13px;overflow-wrap:anywhere;color:#474c52} .live-chips,.live-services,.live-links{display:flex;flex-wrap:wrap;gap:5px} .live-chips span,.live-services span,.live-links span{padding:2px 7px;background:#dee6ed;border-radius:7px;font-size:11px;overflow-wrap:anywhere} .live-try{justify-self:start;background:color-mix(in srgb,var(--salon-brand) 40%,#070c15);color:#f0f6fc;border-radius:25px;padding:3px 12px;font-size:11px} .live-services{margin-block:5px}.live-services span:first-child{background:color-mix(in srgb,var(--salon-brand) 36%,#e2ebf5)} .live-detail{border-top:1px solid #ccd7e1;padding-top:7px} .live-detail h4{margin:0 0 5px;font-size:13px} .live-manager{display:flex;gap:6px;align-items:center;font-size:12px} .live-manager img{width:30px;height:30px;border-radius:50%} .live-works{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px} .live-works article{display:grid;gap:3px;overflow-wrap:anywhere;min-width:0;background:#e3eaf1;padding:5px;border-radius:8px;font-size:12px} .live-works img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:6px} .builder-preview>.builder-note{color:#d3dfeb}.builder-preview>.btn{background:#c2cad4;color:#101724} @media(max-width:850px){.builder-grid{grid-template-columns:1fr}.builder-preview{grid-row:1;position:sticky;top:var(--hh,68px);z-index:6;padding:7px;gap:6px}.builder-live{max-height:31svh}.live-cover{height:54px}.live-logo{width:37px;height:37px;margin-top:-18px}.live-salon{gap:3px}.live-salon p,.live-chips span,.live-services span{font-size:11px}.builder-form{scroll-margin-top:36svh}.builder-preview>.btn{min-height:38px;padding:4px 10px;font-size:13px}} .builder-steps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;list-style:none;padding:0;margin:0 0 16px;counter-reset:builder-step} .builder-steps li{counter-increment:builder-step;padding:12px 14px;border:1px solid #b8bfc7;border-radius:12px;background:#f6fafd;color:#273146} .builder-steps strong,.builder-steps span{display:block} .builder-steps strong::before{content:counter(builder-step,persian) ' · ';color:#48525d} .builder-steps span,.builder-availability{font-size:14px} .builder-availability{margin:0 0 16px;padding:10px 14px;border-inline-start:3px solid #606c79;background:#e4ecf3;color:#273146} .builder-form input,.builder-form select,.builder-form textarea,.builder-dialog input{min-height:44px;border-color:#6d7278} .live-logo{background:#e3ebf2;border-color:var(--salon-brand)} .faq-next{margin-top:24px} .faq details a{text-decoration:underline;text-underline-offset:3px} @media(max-width:850px){.builder-form input,.builder-form select,.builder-form textarea,.builder-dialog input{font-size:16px}.builder-form :is(input,select,textarea,button,summary):focus{scroll-margin-block-start:calc(var(--hh,68px) + 37svh)}} @media(max-width:580px){.builder-steps{grid-template-columns:1fr;gap:6px}.builder-steps li{padding:8px 12px}} @media(max-width:850px) and (max-height:650px){.builder-preview{position:static}.builder-form,.builder-form :is(input,select,textarea,button,summary):focus{scroll-margin-block-start:var(--hh,68px)}} .builder-form .builder-identity{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:clamp(12px,2vw,20px);border:1px solid #bcc3cb;border-radius:16px;background:#f9fbfd;align-items:start} .builder-identity legend{padding-inline:7px;color:#23314d} .builder-identity .identity-name,.builder-identity .identity-address{grid-column:1/-1} .builder-identity .identity-address small{font-weight:500;color:#555b62;line-height:1.65} .identity-url,.identity-color{display:flex;align-items:center;min-width:0;min-height:48px;border:1px solid #6d7278;border-radius:10px;background:#f9fbfe} .identity-url>span{font:12px system-ui,sans-serif;padding-inline:8px;color:#4e545b;flex-shrink:0} .builder-form .identity-url input{border:0;border-inline-start:1px solid #bcc3cb;border-radius:0 9px 9px 0;background:transparent;flex:1} .builder-identity .builder-color{grid-column:1/-1} .identity-color{gap:12px;padding-inline:8px} .builder-form .identity-color input{width:48px;min-height:34px;height:34px;padding:2px;border:0;background:transparent;cursor:pointer} .identity-color output{font:13px system-ui,sans-serif;color:#313f5c} .builder-form .builder-upload{align-self:stretch;grid-template-rows:auto 1fr} .upload-control{position:relative;min-width:0;display:grid;grid-template-rows:auto auto;align-content:center;gap:5px;min-height:100px;padding:9px;border:1px dashed #7d858f;border-radius:12px;background:#e5ecf3} .builder-form .upload-control input[type=file]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer} .upload-control:focus-within{outline:2px solid var(--focus);outline-offset:3px} .upload-action{display:grid;place-items:center;min-height:44px;padding:5px 8px;text-align:center;border-radius:8px;background:linear-gradient(#2f4061,#1e2b42);color:#f6fafd;box-shadow:0 3px 0 #121b2a;font-size:12px;line-height:1.65} .upload-name{min-width:0;text-align:center;overflow-wrap:anywhere;color:#4d545b;font-size:11px;font-weight:500} @media(max-width:540px){.builder-form .builder-identity{gap:12px}.builder-identity .builder-upload{grid-column:1/-1}.upload-control{min-height:79px}.identity-url>span{font-size:10px;padding-inline:5px}} .builder-error:empty{display:none} .builder-error:focus{scroll-margin-block-start:calc(var(--hh,68px) + 35svh)} .upload-control:has([aria-invalid="true"]){border-color:#932d26;background:#f0f7fb} .upload-control:has([aria-invalid="true"]) .upload-name{color:#8a2520} @media(max-width:850px) and (max-height:650px){.builder-error:focus{scroll-margin-block-start:var(--hh,68px)}} .cta-band{padding:clamp(40px,6vw,72px) var(--gut);background:var(--espresso);color:var(--cream)} .cta-band--final{background:var(--espresso-2)} .cta-band__in{max-width:760px;margin:0 auto;text-align:center;display:grid;gap:14px;justify-items:center} .cta-band h2{margin:0;font-size:clamp(24px,3.2vw,38px);line-height:1.6;font-weight:800;text-wrap:balance} .cta-band p{margin:0;color:var(--ivory-2);font-size:18px;line-height:1.9;max-width:56ch} .cta-band .btn{margin-top:6px;background:var(--cream);color:var(--espresso)} .plan-cta{margin-top:16px;width:100%} .lf-micro{margin:8px 0 0;font-size:13.5px;color:var(--ivory-2);text-align:center} .lf-plan{margin:0 0 10px;font-size:14px;font-weight:700;color:var(--brass-soft)} .lf-field .opt{font-weight:500;opacity:.7;font-size:.9em} .sticky-cta{position:fixed;inset-inline:max(16px,env(safe-area-inset-left,0px));bottom:max(12px,env(safe-area-inset-bottom,0px));z-index:35;display:none;align-items:center;justify-content:center;gap:10px;min-height:52px;border-radius:var(--r-pill);background:var(--espresso);color:var(--cream);font-weight:800;font-size:17px;box-shadow:0 14px 34px rgba(8,13,21,.4);border:1.5px solid var(--brass)} .sticky-cta.show{display:flex} @media (min-width:901px){.sticky-cta{display:none!important}} @media (prefers-reduced-motion:no-preference){.sticky-cta.show{animation:rise 400ms var(--ease) both}} .rv{opacity:0;transform:translateY(28px);transition:opacity 700ms var(--ease),transform 800ms var(--ease)} .rv.in{opacity:1;transform:none} .scroll-line{position:fixed;top:env(safe-area-inset-top,0px);inset-inline:0;height:2px;z-index:40;background:linear-gradient(90deg,#586370,#adb8c4,#7c8998);transform-origin:100% 50%;transform:scaleX(0);pointer-events:none} .site-header{transition:padding 360ms var(--ease),box-shadow 360ms var(--ease),background-color 360ms var(--ease)} .site-header.is-tight{padding-block:8px;box-shadow:0 10px 30px -18px rgba(14,22,38,.45)} .site-header .nav a[aria-current]{border-color:var(--brass)} .wipe{clip-path:inset(0 0 100% 0);transform:translateY(.35em);transition:clip-path 1000ms var(--ease),transform 1000ms var(--ease)} .wipe.in{clip-path:inset(0 0 -.2em 0);transform:none} .s2-demo img,.trial-mock img,.svc .ico{will-change:transform} @media (prefers-reduced-motion:reduce){.site-header{transition:none}} .lead-wrap{max-width:680px} #studio{scroll-margin-top:0} .service-preview-link{display:inline-flex;margin-top:20px} @media (max-width:900px){html{scroll-padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))} body:has(.sticky-cta:not([hidden])){padding-bottom:calc(72px + env(safe-area-inset-bottom,0px))} .sticky-cta:not([hidden]){display:flex;inset-inline:0;bottom:0;padding:8px 16px calc(8px + env(safe-area-inset-bottom,0px));border:0;border-top:1px solid rgba(124,137,152,.35);border-radius:0;background:#e8eef3;box-shadow:0 -8px 22px rgba(8,13,21,.13);color:var(--espresso);font-size:15px;line-height:1.4;white-space:nowrap;min-height:52px} .sticky-cta:focus-visible{outline-offset:-4px} .trial-grid>.sec-head{margin-bottom:0}} .brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none}.brand-symbol{display:inline-flex;width:45px;height:48px;color:#a17c3c;flex:none}.brand-symbol svg{width:100%;height:100%}.brand-name{display:flex;flex-direction:column;align-items:center;line-height:1.2}.brand .brand-name small{font-size:10px;letter-spacing:.24em;direction:ltr;margin:5px 0 0;opacity:.65}.foot .brand-symbol{color:#d4b275}.loader-brand svg{width:55px;height:65px;color:#a17c3c} .nav-btn,.cinema-arrows button{direction:ltr;unicode-bidi:isolate}.nav-btn svg,.cinema-arrows svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;transform:none} .cinema-arrows{inset:0;display:block;pointer-events:none;z-index:7}.cinema-arrows button{position:absolute;top:50%;transform:translateY(-50%);pointer-events:auto;width:48px;height:48px;background:#121720b8;backdrop-filter:blur(8px);display:grid;place-items:center;transition:background .2s,border-color .2s,box-shadow .2s} .cinema-arrows [data-slide-prev]{right:24px;left:auto}.cinema-arrows [data-slide-next]{left:24px;right:auto}.cinema-arrows button:hover{background:#1f283a;border-color:#98a5b4;box-shadow:0 0 25px #98a5b420} .nav-btn:focus-visible,.cinema-arrows button:focus-visible{outline:2px solid #9aa7b6;outline-offset:4px} .journey-actions{display:flex;flex-direction:column;gap:10px;margin-top:22px}.journey-copy .journey-actions .btn{display:inline-flex;justify-content:center;align-items:center;gap:18px;min-height:50px;width:100%;padding:12px 18px;border:1px solid #c5b59688;border-radius:999px;background:#0e1219;color:#dfebf8;font:inherit;font-size:13px;font-weight:700;text-decoration:none;text-shadow:none;line-height:1.7}.journey-copy .journey-actions a span{margin:0}.journey-copy .journey-actions .salon-action{align-self:center;display:inline-flex;align-items:center;justify-content:center;gap:12px;min-height:44px;color:#e8e0d1;font-size:11px;line-height:1.8;text-decoration:none;text-shadow:none;border-bottom:1px solid #c5b59645;transition:color .2s,border-color .2s}.journey-copy .journey-actions .salon-action:hover{color:#e0ebf8;border-color:#d9cbb2} .auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{display:block;top:auto;bottom:80px;right:6%;left:auto;width:33%;max-width:400px;padding:26px;border:1px solid #9ca8b545;border-radius:20px;background:linear-gradient(140deg,#101620e8,#101620c9);backdrop-filter:blur(12px);box-shadow:0 20px 60px #0003} .auto-film .journey-copy h3,.auto-film .journey-copy[data-journey-copy=lashes] h3{font-size:clamp(26px,2.6vw,38px);margin:0 0 16px;line-height:1.6}.auto-film .journey-copy[data-journey-copy=lashes] h3 br{display:initial}.auto-film .journey-copy[data-journey-copy=lashes] .journey-kicker{margin:0 0 12px}.auto-film .journey-copy[data-journey-copy=lashes]>p:not(.journey-kicker){font-size:14px;margin:0 0 15px;max-width:35ch}.auto-film .journey-copy[data-journey-copy=lashes] a{margin-top:0} .salon-invite{padding:clamp(40px,7vw,100px) clamp(20px,6vw,90px);background:radial-gradient(ellipse at 75% 50%,#1d263760,transparent 65%),#0f1116;color:#e7eef4;position:relative;isolation:isolate}.salon-invite-card{max-width:1180px;margin:auto;display:grid;grid-template-columns:1fr 1fr;direction:ltr;border:1px solid #7c899866;border-radius:28px;overflow:hidden;background:linear-gradient(130deg,#1e2636,#101520);box-shadow:0 24px 65px #0003}.salon-invite-art{position:relative;min-height:460px;overflow:hidden}.salon-invite-art>:is(img,video){display:block;position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:46% center;transition:transform 1.2s cubic-bezier(.2,.7,.2,1)}.salon-invite-art:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#0f1216bb,transparent 65%);pointer-events:none}.salon-invite-card:hover .salon-invite-art>:is(img,video){transform:scale(1.035)}.invite-seal{position:absolute;bottom:28px;left:28px;z-index:1;display:flex;align-items:center;gap:14px;direction:rtl;color:#e9e1d2;line-height:1.8;font-size:14px}.invite-seal svg{width:47px;height:53px;flex:none}.salon-invite-copy{direction:rtl;align-self:center;padding:clamp(28px,4vw,60px)}.salon-invite-copy h2{font-size:clamp(32px,3.7vw,54px);line-height:1.6;margin:0 0 18px;color:#e1ecf8;letter-spacing:-.035em}.salon-invite-copy>p:not(.journey-kicker){font-size:16px;line-height:2;margin:0 0 16px}.salon-invite-copy>p.invite-detail{font-size:13px;color:#b4bac0}.salon-invite-copy .btn{width:100%;margin-top:14px;text-align:center;justify-content:center;line-height:1.8;white-space:normal} .type-wrap{position:relative}.type-reserve{display:block;visibility:hidden;pointer-events:none}.type-live{position:absolute;inset:0;display:block}.type-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}.type-live.is-typing:after{content:"";display:inline-block;height:.85em;border-left:1px solid #afbac6;margin-right:3px;vertical-align:-.05em;animation:typingCaret .7s steps(1) infinite}@keyframes typingCaret{50%{opacity:0}} .svc,.feat li,.faq details,.phone{transition:border-color .25s,box-shadow .25s,background .25s}.svc:hover,.feat li:hover,.faq details[open]{border-color:#7c899870;box-shadow:0 14px 34px #161e2e12}.faq details[open] summary{color:#536170}.s2-points li{transition:border-color .25s,transform .25s}.s2-points li:hover{border-color:#92a0af;transform:translateX(-3px)}.salon-invite-card.rv{transition:opacity .7s,transform .7s} @media(max-width:900px){.auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{width:40%;right:5%;padding:22px}.salon-invite-card{grid-template-columns:1fr}.salon-invite-art{min-height:320px}.salon-invite-copy{padding:30px}.salon-invite-copy h2 br{display:none}.salon-invite-copy h2{font-size:34px}.salon-invite-copy .btn{max-width:420px}} @media(max-width:600px){.brand{gap:6px}.brand-symbol{width:31px;height:35px}.brand .brand-name small{font-size:8px;margin-top:3px}.brand-name{font-size:20px}.cinema-arrows button{width:40px;height:40px}.cinema-arrows [data-slide-prev]{right:10px}.cinema-arrows [data-slide-next]{left:10px}.cinema-copy,.is-current .cinema-copy{right:62px;left:62px;width:auto;max-width:none}.auto-film .journey-copy,.auto-film .journey-copy[data-journey-copy=lashes]{position:relative;inset:auto;width:auto;max-width:none;margin:18px 18px 0;padding:22px;border-radius:18px}.auto-film .journey-copy h3,.auto-film .journey-copy[data-journey-copy=lashes] h3{font-size:25px}.salon-invite{padding:38px 18px}.salon-invite-card{border-radius:22px}.salon-invite-art{min-height:260px}.salon-invite-copy{padding:25px}.salon-invite-copy h2{font-size:30px}.salon-invite-copy>p:not(.journey-kicker){font-size:14px}.salon-invite-copy .btn{font-size:12px}.journey-copy .journey-actions .btn{font-size:12px}} @media(prefers-reduced-motion:reduce){.type-live:after{animation:none}.salon-invite-card:hover .salon-invite-art>:is(img,video),.s2-points li:hover{transform:none}.svc,.feat li,.faq details,.phone{transition:none}} @media(max-width:600px){.rail-wrap .nav-btn{display:grid;width:36px;height:36px;margin-top:0}.rail-wrap .nav-r{right:6px}.rail-wrap .nav-l{left:6px}} .s2-grid>*{min-width:0}.film{overflow-x:clip}.demo-file:not(.visible){display:none} .benefits-five{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px} .benefits-five .benefit{padding:clamp(14px,2vw,24px);gap:10px} .benefit h3{font-size:clamp(16px,1.55vw,21px)} .benefit p{font-size:14px} .gold-icon{display:grid;place-items:center;width:60px;height:60px;border-radius:19px;background:radial-gradient(at 20% 10%,#f3efe7,#cbb996 53%,#816c45 100%);border:1px solid #ab9773;box-shadow:inset 0 2px 2px #e3ecf8,inset 0 -4px 4px #1a2b4d6e,0 7px 14px #15285036} .gold-icon svg{width:39px;height:39px;fill:none;stroke:#f3efe7;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 0 #132547)} .gold-icon .gold-icon-depth{stroke:#857049;stroke-width:3.5;transform:translateY(2px)} .svc-try{margin-top:auto;align-self:flex-start} .service-timeline{display:flex;justify-content:center;gap:clamp(4px,3vw,36px);padding:18px 12px;border-bottom:1px solid #727f8d3f} .service-timeline a{display:grid;justify-items:center;gap:5px;min-width:0;text-align:center;color:#c1c9d2;font-size:clamp(11px,2.7vw,15px);padding:6px 9px} .service-timeline a span{border:1px solid #919ca877;border-radius:50%;width:31px;height:31px;display:grid;place-items:center} .service-timeline a[aria-current] span,.service-timeline a:hover span{background:#bac3ce;color:#0f1624} @media(max-width:1100px){.benefits-five{grid-template-columns:repeat(3,minmax(0,1fr))}} @media(max-width:580px){.benefits-five{grid-template-columns:repeat(2,minmax(0,1fr))}.benefits-five .benefit:last-child{grid-column:1/-1}} .film-player{max-width:1100px;margin:auto;display:grid;gap:16px;padding:20px clamp(12px,4vw,44px) 34px} .service-journey{background:#0f1116} .film-player .service-timeline{display:flex;justify-content:center;gap:clamp(12px,4vw,54px);border:0;padding:0} .service-timeline button{appearance:none;border:0;background:transparent;color:#a8b1bb;display:grid;justify-items:center;gap:8px;cursor:pointer;font:inherit;font-size:13px;line-height:1.35;text-align:center;padding:8px;min-width:56px} .service-timeline button[aria-pressed=true]{color:#e7eaec} .film-icon{position:relative;isolation:isolate;width:48px;height:48px;display:grid;place-items:center;border-radius:50%;border:1px solid #7c899877;background:#1a202a} .film-icon svg{width:27px;height:27px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round} .service-timeline button[aria-pressed=true] .film-icon{background:#28354f;border-color:#b1bbc7} .is-playing button[aria-pressed=true] .film-icon::after{content:'';position:absolute;inset:-5px;border:2px solid transparent;border-inline-start-color:#c0c8d2;border-top-color:#d7dce2;border-radius:50%;filter:drop-shadow(0 0 4px #96a4b4);animation:film-orbit 1.5s linear infinite} @keyframes film-orbit{to{transform:rotate(360deg)}} .film-screen{min-width:0;border:1px solid #606a7548;border-radius:20px;overflow:hidden;background:#151a23} .service-video{width:100%;display:block;aspect-ratio:16/9;object-fit:contain;background:#080a0d} .film-caption{display:grid;gap:3px;padding:14px clamp(14px,3vw,26px);color:#dee2e7} .film-caption span{color:#9ea9b5;font-size:11px}.film-caption strong{font-size:19px}.film-caption p{font-size:14px;color:#c5ccd3} @media(max-width:640px){.film-player{grid-template-columns:63px minmax(0,1fr);gap:8px;align-items:start;padding-inline:8px}.film-player .service-timeline{flex-direction:column;gap:3px}.service-timeline button{font-size:10px;min-width:0;padding:5px 2px;gap:5px}.film-icon{width:36px;height:36px}.film-icon svg{width:23px;height:23px}.film-screen{border-radius:14px}} @media(prefers-reduced-motion:reduce){.is-playing button[aria-pressed=true] .film-icon::after{animation:none}} .rv:focus-within{opacity:1;transform:none;transition:none} .mobile-menu:not([hidden]){max-height:calc(100vh - var(--hh,72px) - 24px);max-height:calc(100dvh - var(--hh,72px) - 24px);overflow-y:auto;overscroll-behavior:contain} @property --button-orbit{syntax:"<angle>";inherits:false;initial-value:0deg} :where(.page,body) :is(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button){--button-top:#3C63AE;--button-base:#254E9E;--button-text:#F7FAFF;--button-depth:#162C5E;--button-edge:#D8A63C;--button-light:#F2DFAF;isolation:isolate;overflow:visible;color:var(--button-text);background:linear-gradient(180deg,var(--button-top),var(--button-base));border:1px solid var(--button-edge);box-shadow:inset 0 1px 0 #ffffff38,0 4px 0 var(--button-depth),0 8px 14px #10172331;text-shadow:none} :is(.btn,.menu-toggle,.close,.demo-controls button,.mirror-invite button){position:relative} :where(.page,body) :is(.on-dark,.salon-invite,.builder-preview,.mirror-invite,.site-footer) :is(.btn,.close,.mirror-invite button){--button-top:#FBFCFE;--button-base:#DEE6EF;--button-text:#152238;--button-depth:#7C90AC;--button-edge:#C9A34F;--button-light:#F2DFAF;color:var(--button-text);background:linear-gradient(180deg,var(--button-top),var(--button-base));border-color:var(--button-edge);box-shadow:inset 0 1px 0 #fff,0 4px 0 var(--button-depth),0 8px 14px #090d153e} :where(.page,body) :is(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button):not(:disabled):hover{background:linear-gradient(180deg,var(--button-top),var(--button-base));filter:brightness(1.11)} :where(.page,body) :is(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button):not(:disabled):active{box-shadow:inset 0 1px 3px #090d1540,0 1px 0 var(--button-depth)} @supports (mask-composite:exclude){:where(.page,body) :is(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button):not(:disabled)::after{content:"";position:absolute;inset:-4px;padding:1px;border-radius:inherit;pointer-events:none;background:conic-gradient(from var(--button-orbit),transparent 0deg 295deg,#baa47b55 315deg,var(--button-light) 347deg,transparent 360deg);mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;animation:button-orbit 4s linear infinite}} @keyframes button-orbit{to{--button-orbit:360deg}} @media(prefers-reduced-motion:reduce){:where(.page,body) :is(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button)::after{animation:none}} @media(max-width:900px){.sticky-cta:not([hidden]){inset-inline:16px;bottom:calc(10px + env(safe-area-inset-bottom,0px));padding:8px 16px;border:1px solid var(--button-edge);border-radius:14px;color:var(--button-text);background:linear-gradient(180deg,var(--button-top),var(--button-base))}} .copy .btn--ghost:not(:disabled){--button-top:#4e5660;--button-base:#2c3a54;--button-text:#f4f8fd;--button-depth:#192437;--button-edge:#6e7782} .copy .btn--ghost::after,.svc-try::after{opacity:.55} .copy .btn--ghost:is(:hover,:focus-visible)::after,.svc-try:is(:hover,:focus-visible)::after{opacity:1} @media(max-width:390px){.film-player .service-timeline button{min-height:48px}.builder-form .identity-url input{padding-inline:5px}} h1,h2,.sec-head h2,.salon-invite-copy h2{text-wrap:balance} .sec-head .sub,.lead{text-wrap:pretty} .header-cta{min-height:42px;padding:0 18px;font-size:14px} .site-header .header-cta::after{display:none} @media(max-width:900px){.header-cta{display:none!important}} .copy .btn--ghost:not(:disabled){--button-top:#f9fbfe;--button-base:#d6e0eb;--button-text:#202e47;--button-depth:#88919b;--button-edge:#9ca7b3} .copy .cta-row{align-items:center} @media(max-width:900px){.copy .cta-row{flex-direction:column;align-items:stretch;width:100%;max-width:440px;margin-inline:auto}.copy .cta-row .btn{width:100%;justify-content:center}} :where(.page,body) :is(.btn:not(.btn--lg),.menu-toggle,.nav-btn,.close,.demo-controls button,.mirror-invite button):not(:hover,:focus-visible)::after{animation-play-state:paused;opacity:0} .benefit h3{font-size:clamp(16px,1.3vw,19px);line-height:1.5} @media(max-width:580px){.benefits-five{grid-template-columns:1fr;gap:12px} .benefits-five .benefit{display:grid;grid-template-columns:52px minmax(0,1fr);column-gap:14px;row-gap:4px;align-items:start;padding:16px} .benefits-five .benefit .gold-icon{grid-row:span 2;width:52px;height:52px;border-radius:16px} .benefits-five .benefit .gold-icon svg{width:32px;height:32px} .benefits-five .benefit h3{margin:0;font-size:17px} .benefits-five .benefit p{margin:0;font-size:14px;line-height:1.85}} .salon-invite-copy .journey-kicker{color:#a5b1bf;font-size:13px;font-weight:700;margin:0 0 10px} .builder-form summary{list-style:none;display:flex;align-items:center;gap:10px} .builder-form summary::-webkit-details-marker{display:none} .builder-form summary::before{content:"";flex:none;width:8px;height:8px;border-right:2px solid #5a6571;border-bottom:2px solid #5a6571;transform:translateY(-2px) rotate(45deg);transition:transform .2s;margin-inline:2px 4px} .builder-form details[open]>summary::before{transform:translateY(2px) rotate(-135deg)} .builder-form summary small{font-weight:600;color:#60666c} .upload-action{font-size:13px;white-space:nowrap} @media(max-width:850px){.builder-preview .builder-browser{display:none}.builder-live{max-height:24svh}.builder-preview .live-services,.builder-preview .live-try{display:none}.builder-form :is(input,select,textarea,button,summary):focus{scroll-margin-block-start:calc(var(--hh,68px) + 28svh)}} @media(max-width:600px){.palette .col-list span,.palette .col-list small{font-size:10px}} .site-footer .legal{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 24px} @media(min-width:901px){.copy .cta-row,.copy .fineprint{transition:opacity .3s,visibility .3s}.stage:has(.styles.open) .copy :is(.cta-row,.fineprint){opacity:0;visibility:hidden}} html{scroll-padding-top:var(--hh,68px)} .mobile-menu a.btn.menu-cta{display:flex;margin-top:14px;width:100%;max-width:none;white-space:nowrap;min-height:48px;justify-content:center;font-size:15px} .mirror-invite{gap:clamp(6px,1.1vw,14px)} .mirror-invite p{font-size:clamp(14px,calc(24px * var(--scene-scale)),26px);line-height:1.55} .mirror-invite .btn{white-space:nowrap;min-height:40px;padding:0 clamp(10px,1vw,16px);font-size:clamp(12px,calc(13px * var(--scene-scale)),14px);line-height:1.4;gap:6px} :where(.page,body) .mirror-invite #backToMirror{background:none;box-shadow:none;border:0;color:#eee8dc;min-height:36px;padding:0 4px;font-size:clamp(11px,calc(12px * var(--scene-scale)),13px);text-decoration:underline;text-underline-offset:4px;filter:none} :where(.page,body) .mirror-invite #backToMirror::after{display:none} .inv-short{display:none} @media(max-width:600px){.mirror-invite .inv-long{display:none}.mirror-invite .inv-short{display:inline}.mirror-invite .invite-mark{display:none}.mirror-invite .btn{padding:0 9px;min-height:34px}} .fade{background:linear-gradient(180deg,rgba(221,227,233,0) 40%,var(--sunken,#dde3e9) 100%)} @media(min-width:641px){.film-player{max-width:min(1100px,calc((100svh - 360px) * 16 / 9 + 88px))}} .ref-try{white-space:nowrap} .builder-dialog:modal{position:fixed;inset:0;margin:auto;height:fit-content} .salon-invite-art>video{object-position:center} html,body{overflow-x:clip} @supports not (overflow:clip){html,body{overflow-x:hidden}} @media(max-width:900px){.salon-invite-art{min-height:0;aspect-ratio:16/9} .salon-invite-art:after{display:none} .salon-invite-art .invite-seal{display:none}} .copy .eyebrow,.sec-head .kicker,.salon-invite-copy .journey-kicker{display:inline-block;position:relative;padding-inline-start:40px} .copy .eyebrow::before,.sec-head .kicker::before,.salon-invite-copy .journey-kicker::before{position:absolute;inset-inline-start:0;top:50%;margin-top:-1px} :is(.copy .eyebrow,.sec-head .kicker,.salon-invite-copy .journey-kicker)>.type-live{inset-inline-start:40px} .builder-form summary{min-height:44px} .ref-try{display:inline-flex;align-items:center;min-height:36px} @media(min-width:901px){.salon-invite-card{grid-template-columns:1fr;max-width:1100px} .salon-invite-art{min-height:0;aspect-ratio:16/9} .salon-invite-art:after{background:linear-gradient(0deg,#0f121699,transparent 30%)} .salon-invite-copy{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);column-gap:clamp(28px,4vw,64px);align-items:end;padding:clamp(28px,3.4vw,48px)} .salon-invite-copy{align-items:start} .salon-invite-copy>.journey-kicker{grid-column:1;grid-row:1} .salon-invite-copy>h2{grid-column:1;grid-row:2 / span 2;margin:0} .salon-invite-copy>p:not(.journey-kicker):not(.invite-detail){grid-column:2;grid-row:1 / span 2;align-self:end;margin:0 0 10px} .salon-invite-copy>.invite-detail{grid-column:2;grid-row:3;margin:0} .salon-invite-copy>.btn{grid-column:1 / -1;grid-row:4;margin-top:22px}} :where(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button){--glass-inset:1px} :where(.menu-toggle,.nav-btn,.close,.demo-controls button){--glass-inset:0px} .glass-layer{position:absolute;inset:var(--glass-inset,1px);border-radius:inherit;overflow:hidden;pointer-events:none;z-index:0;background:radial-gradient(120% 95% at 50% -18%,rgba(246,249,253,.38) 0%,rgba(236,243,251,.14) 38%,transparent 66%),linear-gradient(180deg,rgba(255,255,255,.16) 0%,rgba(255,255,255,0) 48%,rgba(217,222,228,.09) 100%);box-shadow:inset 0 1.5px 1px rgba(255,255,255,.46),inset 0 -1.5px 2px rgba(6,11,21,.28)} :where(.on-dark,.salon-invite,.builder-preview,.mirror-invite,.site-footer) :is(.btn,.close,.mirror-invite button)>.glass-layer,.copy .btn--ghost>.glass-layer{background:radial-gradient(120% 95% at 50% -20%,rgba(255,255,255,.82) 0%,rgba(247,250,253,.34) 42%,transparent 68%),linear-gradient(180deg,rgba(255,255,255,.52) 0%,rgba(255,255,255,0) 52%,rgba(189,170,135,.16) 100%);box-shadow:inset 0 1.5px 1px rgba(255,255,255,.92),inset 0 -1.5px 2px rgba(37,53,88,.22)} .glass-layer::before{content:"";position:absolute;inset:-20% -40%;background:linear-gradient(112deg,transparent 38%,rgba(239,244,251,.48) 48%,rgba(255,255,255,.78) 50%,rgba(230,233,235,.36) 52%,transparent 62%);transform:translateX(120%) skewX(-16deg);transition:transform .75s cubic-bezier(.2,.75,.2,1)} :where(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button):hover>.glass-layer::before,.glass-layer.flash::before{transform:translateX(-120%) skewX(-16deg)} :where(.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button)>:not(.glass-layer){position:relative;z-index:1} .ripple{position:absolute;border-radius:50%;pointer-events:none;transform:translate(-50%,-50%) scale(.06);background:radial-gradient(circle,transparent 42%,rgba(228,238,249,.42) 64%,rgba(255,255,255,.78) 72%,rgba(154,167,182,.34) 80%,transparent 86%);box-shadow:0 0 12px rgba(220,225,230,.38);animation:water-ring .95s cubic-bezier(.16,.84,.32,1) forwards} @keyframes water-ring{0%{opacity:.95;transform:translate(-50%,-50%) scale(.06)}65%{opacity:.55}100%{opacity:0;transform:translate(-50%,-50%) scale(1.08)}} :root{--trench-light-bg:linear-gradient(165deg,#c4ced8 0%,#d5dde5 46%,#e7ecf2 100%);--trench-light-shadow:inset 0 4px 9px rgba(10,18,34,.22),inset 0 1px 3px rgba(10,18,34,.26),inset 0 -3px 6px rgba(249,251,254,.92),0 2px 0 rgba(249,251,254,.95),0 -1px 0 rgba(17,28,49,.16),0 16px 32px -10px rgba(10,18,34,.16);--relief-light-bg:linear-gradient(168deg,#fcfcfc 0%,#e7edf4 55%,#d6dfe9 100%);--relief-light-shadow:0 5px 0 #a1a8b1,0 6px 0 rgba(43,63,105,.45),0 12px 24px rgba(10,18,34,.18),inset 0 2px 1px #FFF,inset 0 -2px 4px rgba(99,111,125,.22);--trench-dark-bg:linear-gradient(168deg,#080b10 0%,#0d121a 52%,#131924 100%);--trench-dark-shadow:inset 0 6px 16px rgba(0,0,0,.85),inset 0 2px 4px rgba(0,0,0,.9),inset 0 -2px 5px rgba(165,177,191,.16),0 1.5px 0 rgba(177,188,200,.38),0 -1px 0 rgba(0,0,0,.9),0 26px 56px rgba(0,0,0,.55)} .svc,.benefit,.builder-steps>li{position:relative;isolation:isolate;border-radius:24px;background:radial-gradient(420px circle at var(--mx,50%) var(--my,20%),rgba(225,236,248,.75),transparent 68%),var(--relief-light-bg);border:1px solid #98a0a9;box-shadow:inset 0 1.5px 0 #FFF,inset 0 -2px 4px rgba(87,98,111,.22),0 5px 0 #9ea5ae,0 6px 0 rgba(44,63,106,.46),0 0 0 6px #c7d1dc,0 0 0 7px rgba(108,119,132,.42),0 8px 0 6px rgba(249,251,254,.92),0 18px 34px 2px rgba(10,17,32,.2);transform-style:preserve-3d;transition:box-shadow .38s ease,border-color .35s ease} #services .svc,.salon-builder .builder-steps>li{box-shadow:inset 0 1.5px 0 #FFF,inset 0 -2px 4px rgba(87,98,111,.22),0 5px 0 #a1a8b1,0 6px 0 rgba(44,63,106,.46),0 0 0 6px #cfd9e3,0 0 0 7px rgba(108,119,132,.4),0 8px 0 6px rgba(249,251,254,.95),0 18px 34px 2px rgba(10,17,32,.18)} .svc::before,.benefit::before,.builder-steps>li::before{content:"";position:absolute;inset:6px;border-radius:18px;border:1px solid rgba(124,137,152,.34);box-shadow:inset 0 2px 5px rgba(18,30,55,.1),0 1px 0 rgba(255,255,255,.85);pointer-events:none;z-index:0} .svc>*,.benefit>*,.builder-steps>li>*{position:relative;z-index:1} @media(hover:hover){:is(.svc,.benefit,.builder-steps>li).scrub-done:hover{--hy:-4px;border-color:#7c8998;box-shadow:inset 0 2px 1px #FFF,inset 0 -2px 5px rgba(87,98,111,.28),0 8px 0 #929aa4,0 9px 0 rgba(37,56,97,.55),0 0 0 6px #c3cdd8,0 0 0 7.5px rgba(124,137,152,.62),0 10px 0 6px rgba(249,251,254,.96),0 26px 44px 4px rgba(10,17,32,.26)}} .gold-icon{position:relative;border-radius:20px;background:radial-gradient(circle at 28% 22%,#e3ecf8 0%,#d6c7ac 45%,#967e51 88%,#1d2f56 100%);border:1px solid #c1ae8c;box-shadow:inset 0 2px 2px #f7fafd,inset 0 -4px 5px rgba(15,28,55,.58),0 4px 0 #283c66,0 0 0 4px #c3cdd8,0 0 0 5px rgba(158,137,97,.48),0 8px 16px rgba(11,21,40,.28);transition:transform .45s cubic-bezier(.34,1.56,.64,1),box-shadow .35s ease} :is(.svc,.benefit):hover .gold-icon{transform:translateY(-3px) scale(1.06) rotate(-4deg);box-shadow:inset 0 2px 3px #FFF,inset 0 -4px 5px rgba(15,28,55,.58),0 6px 0 #203259,0 0 0 4px #c3cdd8,0 0 0 5px rgba(183,166,134,.75),0 12px 22px rgba(11,21,40,.34)} .builder-steps>li::after{box-shadow:inset 0 2px 2px #eaf1fa,inset 0 -3px 4px rgba(16,30,58,.5),0 3px 0 #2a3e6a,0 0 0 4px #c9d3de,0 0 0 5px rgba(99,110,123,.42),0 6px 14px rgba(11,21,40,.24)} .salon-invite-card{position:relative;padding:10px;border-radius:32px;background:radial-gradient(600px circle at var(--mx,70%) var(--my,30%),rgba(150,164,180,.14),transparent 65%),var(--trench-dark-bg);border:1px solid rgba(150,164,179,.42);box-shadow:var(--trench-dark-shadow),0 7px 0 #05070a,0 8px 0 rgba(150,164,179,.36)} .salon-invite-art{border-radius:24px;border:1px solid rgba(150,164,179,.36);box-shadow:0 6px 20px rgba(0,0,0,.6),inset 0 0 0 1px rgba(225,236,248,.12)} .invite-seal{padding:10px 16px;border-radius:18px;background:linear-gradient(155deg,rgba(17,23,35,.92),rgba(9,12,17,.94));border:1px solid rgba(216,201,175,.48);box-shadow:inset 0 1.5px 1px rgba(227,237,248,.25),inset 0 -2px 4px rgba(0,0,0,.7),0 4px 0 #06080c,0 12px 26px rgba(0,0,0,.55);backdrop-filter:blur(10px)} :where(.dock.glass,.palette.glass,.reference.glass,.result.glass){background:linear-gradient(168deg,rgba(199,209,219,.9) 0%,rgba(231,237,243,.92) 48%,rgba(206,216,226,.9) 100%);border:1px solid rgba(116,128,143,.68);box-shadow:inset 0 4px 8px rgba(12,22,40,.2),inset 0 -2px 4px rgba(249,251,254,.92),0 -1px 0 rgba(12,22,40,.16),0 6px 0 #8a939e,0 7px 0 rgba(39,58,99,.5),0 22px 44px rgba(8,14,26,.3)} .d-item,.sw{transition:transform .28s cubic-bezier(.2,.8,.2,1),box-shadow .28s ease,background .28s ease} .d-item[aria-checked="true"],.sw[aria-checked="true"]{background:linear-gradient(180deg,#c1ccd8,#e8edf3);box-shadow:inset 0 3px 6px rgba(12,22,40,.24),inset 0 1px 2px rgba(12,22,40,.28),0 1.5px 0 rgba(255,255,255,.95)} .demo-caption{background:linear-gradient(170deg,#d9e1ea,#f4f7fa);border:1px solid #9ea6af;box-shadow:inset 0 2px 5px rgba(12,22,40,.16),inset 0 -1px 0 #FFF,0 4px 0 #959da6,0 12px 24px rgba(9,16,30,.2)} .styles .card .ph{box-shadow:inset 0 3px 6px rgba(0,0,0,.32),0 5px 0 #87909b,0 14px 28px rgba(12,19,34,.3)} .styles .card .nm{box-shadow:inset 0 2px 4px rgba(13,22,41,.16),0 3px 0 #9ea6af} .film-player{padding:26px clamp(16px,4vw,44px) 38px;border-radius:30px;background:var(--trench-dark-bg);border:1px solid rgba(150,164,179,.32);box-shadow:var(--trench-dark-shadow)} .service-timeline button{background:transparent;border:0;box-shadow:none} .film-screen{border-radius:22px;border:1px solid rgba(150,164,179,.38);box-shadow:0 7px 0 #040609,0 8px 0 rgba(150,164,179,.34),0 24px 48px rgba(0,0,0,.62),inset 0 2px 0 rgba(228,230,233,.22)} .film-caption{background:linear-gradient(180deg,#0d1119,#141a25);border-top:1px solid rgba(150,164,179,.28);box-shadow:inset 0 4px 10px rgba(0,0,0,.62)} .builder-form,.builder-dialog{position:relative;background:var(--trench-light-bg);border:1px solid #99a0a9;box-shadow:var(--trench-light-shadow),0 7px 0 #9ea5ae,0 8px 0 rgba(44,63,106,.45),0 24px 44px -8px rgba(10,17,32,.22)} .builder-form fieldset,.builder-form details,.builder-work{background:var(--relief-light-bg);border:1px solid #a4abb4;border-radius:18px;box-shadow:0 4px 0 #a1a8b0,0 5px 0 rgba(44,63,106,.38),0 10px 20px rgba(10,18,34,.1),inset 0 1.5px 0 #FFF} .builder-availability{background:linear-gradient(175deg,#ccd6e0 0%,#e4eaf0 100%);border:1px solid #9ca3ac;box-shadow:inset 0 3px 6px rgba(12,22,40,.18),0 1.5px 0 #FFF} .builder-form input:not([type="file"]):not([type="color"]),.builder-form select,.builder-form textarea,.builder-dialog input,.identity-url,.identity-color{background:linear-gradient(180deg,#cbd5df 0%,#e4e9ef 42%,#f1f4f8 100%);border:1px solid #8e969f;box-shadow:inset 0 3px 6px rgba(10,19,36,.2),inset 0 1px 2px rgba(10,19,36,.24),0 1.5px 0 rgba(249,251,254,.95);transition:box-shadow .22s ease,border-color .22s ease,background .22s ease} .builder-form :is(input:not([type="file"]):not([type="color"]),select,textarea):focus,.identity-url:focus-within{background:linear-gradient(180deg,#dbe2ea 0%,#fcfcfc 100%);border-color:#545f6c;box-shadow:inset 0 2px 4px rgba(12,22,40,.12),0 0 0 3px rgba(124,137,152,.3),0 2px 8px rgba(84,95,108,.16)} .upload-control{background:linear-gradient(175deg,#c7d1dc 0%,#e4ebf1 100%);border:1.5px dashed #6c757f;box-shadow:inset 0 4px 8px rgba(10,19,36,.18),inset 0 1px 2px rgba(10,19,36,.22),0 2px 0 rgba(249,251,254,.92);transition:border-color .25s ease,transform .25s ease,box-shadow .25s ease} .upload-control:hover{border-color:#4c5560;transform:translateY(-1px);box-shadow:inset 0 3px 6px rgba(10,19,36,.14),0 4px 12px rgba(13,22,41,.12)} .builder-preview{padding:14px;border-radius:26px;background:var(--trench-dark-bg);border:1px solid rgba(150,164,179,.45);box-shadow:var(--trench-dark-shadow),0 7px 0 #05070a,0 8px 0 rgba(150,164,179,.38)} .builder-live{border:1px solid rgba(150,164,179,.48);box-shadow:0 5px 0 #080b11,0 12px 26px rgba(0,0,0,.45),inset 0 3px 8px rgba(8,14,26,.18)} .live-chips span,.live-services span,.live-links span,.live-works article{border:1px solid #abb2ba;background:linear-gradient(175deg,#cdd7e1,#edf2f7);box-shadow:inset 0 2px 4px rgba(13,22,41,.15),0 2px 0 #a2a9b1} .faq>details{position:relative;padding:6px;border-radius:22px;background:var(--trench-light-bg);border:1px solid #9aa2ab;box-shadow:var(--trench-light-shadow);transition:box-shadow .38s ease,border-color .35s ease} .faq>details>summary{border-radius:16px;background:radial-gradient(380px circle at var(--mx,50%) var(--my,50%),rgba(158,172,187,.22),transparent 70%),var(--relief-light-bg);border:1px solid rgba(124,137,152,.38);box-shadow:0 4px 0 #9fa6af,0 5px 0 rgba(44,63,106,.42),0 8px 16px rgba(10,17,32,.12),inset 0 1.5px 0 #FFF;transition:transform .32s cubic-bezier(.2,.8,.2,1),box-shadow .32s ease,border-color .3s ease} @media(hover:hover){.faq>details:not([open]):hover>summary{transform:translateY(-2px);border-color:#7c8998;box-shadow:0 6px 0 #939ba4,0 7px 0 rgba(44,63,106,.5),0 14px 24px rgba(10,17,32,.18),inset 0 2px 0 #FFF}} .faq>details[open]{border-color:#7c8998;box-shadow:inset 0 5px 12px rgba(8,15,30,.26),inset 0 -3px 6px rgba(249,251,254,.96),0 2px 0 rgba(249,251,254,.95),0 18px 34px -8px rgba(10,17,32,.22)} .faq>details[open]>summary{border-radius:16px 16px 10px 10px;border-color:#7c8998;box-shadow:0 2px 0 #9fa6af,inset 0 1.5px 0 #FFF} .faq>details>p{margin:6px 4px 2px;padding:16px 20px;border-radius:12px;background:linear-gradient(180deg,#cfd8e2 0%,#e7ecf2 100%);border:1px solid rgba(124,137,152,.28);box-shadow:inset 0 3px 6px rgba(10,19,36,.15),0 1px 0 #FFF} .faq summary::after{width:34px;height:34px;flex:0 0 34px;background:linear-gradient(145deg,#e4ecf5,#b6bec8);border:1px solid #737f8d;box-shadow:inset 0 1px 1px #FFF,inset 0 -2px 3px rgba(20,36,68,.24),0 3px 0 #586370,0 0 0 3px #c9d4df,0 5px 10px rgba(12,21,38,.16);transition:transform .45s cubic-bezier(.34,1.56,.64,1),background .3s ease,color .3s ease,box-shadow .3s ease} .faq details[open] summary::after{transform:rotate(180deg);background:linear-gradient(145deg,#1a2437,#0b101a);color:#bfc7d1;border-color:#96a4b3;box-shadow:inset 0 2px 4px rgba(0,0,0,.6),0 2px 0 #2c3e66,0 0 0 3px #c1ccd8} .faq details[open]>p{animation:faq-unfold .42s cubic-bezier(.2,.8,.2,1) both} @keyframes faq-unfold{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}} .cine-slam{perspective:900px} .cine-word{display:inline-block;transform-origin:50% 60%;will-change:transform,opacity,filter;animation:word-slam 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--wp,1) * -999ms)} :where(.on-dark,.salon-invite) .cine-word{animation-name:word-slam-dark} .cine-word--gold{position:relative;color:#243965} .on-dark .cine-word--gold,.salon-invite .cine-word--gold{color:#bcc5d0} .cine-word--gold::after{content:"";position:absolute;inset-inline:0;bottom:.04em;height:.11em;border-radius:99px;background:linear-gradient(90deg,#7c8998,#b8c1cc,#5b6877);box-shadow:0 2px 8px rgba(124,137,152,.45);transform-origin:right center;transform:scaleX(var(--wp,1))} @keyframes word-slam{0%{opacity:0;filter:blur(7px);transform:perspective(800px) translate3d(0,-38px,190px) scale(1.85) rotateX(24deg)} 65%{opacity:1;filter:blur(0);transform:perspective(800px) translate3d(0,3px,-10px) scale(.95) rotateX(-3deg);text-shadow:0 0 28px rgba(150,164,179,.85),0 10px 22px rgba(8,13,21,.32)} 84%{transform:perspective(800px) translate3d(0,-1px,4px) scale(1.02) rotateX(1deg)} 100%{opacity:1;filter:blur(0);transform:none;text-shadow:0 1px 0 rgba(249,251,254,.65),0 4px 12px rgba(10,17,32,.1)}} @keyframes word-slam-dark{0%{opacity:0;filter:blur(7px);transform:perspective(800px) translate3d(0,-38px,190px) scale(1.85) rotateX(24deg)} 65%{opacity:1;filter:blur(0);transform:perspective(800px) translate3d(0,3px,-10px) scale(.95) rotateX(-3deg);text-shadow:0 0 34px rgba(188,197,208,.9),0 12px 24px rgba(0,0,0,.75)} 100%{opacity:1;filter:blur(0);transform:none;text-shadow:0 2px 14px rgba(0,0,0,.55)}} .copy .eyebrow,.sec-head .kicker,.salon-invite-copy .journey-kicker{display:inline-flex;align-items:center;gap:10px} .copy .eyebrow::before,.sec-head .kicker::before,.salon-invite-copy .journey-kicker::before{content:"";width:calc(var(--kp,1) * 30px);height:2px;border-radius:2px;background:linear-gradient(90deg,#b7a686,#e2d8c5);box-shadow:0 1px 4px rgba(183,166,134,.45)} .type-live.is-typing::after{content:"";display:inline-block;width:2px;height:1em;background:#7c8998;box-shadow:0 0 8px #a4b0be;margin-inline-start:4px;vertical-align:-.12em;animation:typingCaret .65s steps(1) infinite} .copy .lead.reveal{animation:lead-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--lp,1) * -999ms)} .copy .cta-row.reveal{animation:cta-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--cp,1) * -999ms)} .copy .fineprint.reveal{animation:lead-scrub 1000ms ease both paused;animation-delay:calc(var(--fp,1) * -999ms)} @keyframes lead-scrub{0%{opacity:0;filter:blur(5px);transform:translate3d(24px,16px,0)}100%{opacity:1;filter:blur(0);transform:none}} @keyframes cta-scrub{0%{opacity:0;transform:perspective(800px) translate3d(0,32px,-50px) scale(.88) rotateX(20deg)}72%{opacity:1;transform:perspective(800px) translate3d(0,-3px,8px) scale(1.02) rotateX(-2deg)}100%{opacity:1;transform:none}} @media(min-width:1181px){.copy .cta-row{flex-wrap:nowrap}.copy .cta-row .btn--lg{padding:0 24px;font-size:17px}.copy .cta-row .btn--ghost{padding:0 20px;font-size:15px}} .sec-head[data-stage]{animation:head-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--hp,1) * -999ms)} .sec-head[data-stage] .sub{animation:lead-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--sp,1) * -999ms)} @keyframes head-scrub{0%{opacity:0;transform:translateY(22px)}30%{opacity:1}100%{opacity:1;transform:none}} [data-cine=glint] .benefit{transform-origin:50% 50%;overflow:hidden;will-change:transform,opacity,filter;animation:benefit-card-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes benefit-card-scrub{0%{opacity:0;filter:blur(6px);transform:perspective(1100px) translate3d(0,-46px,135px) scale(1.18) rotateX(-26deg) rotateY(calc((2 - var(--i,0)) * 10deg))} 65%{opacity:1;filter:blur(0);transform:perspective(1100px) translate3d(0,3px,-8px) scale(.97) rotateX(2deg) rotateY(0deg)} 100%{opacity:1;filter:blur(0);transform:perspective(1000px) translateY(var(--hy,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}} [data-cine=glint] .benefit .gold-icon{animation:benefit-icon-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes benefit-icon-scrub{0%,18%{opacity:0;transform:translateY(-28px) scale(.35) rotate(-50deg)}75%{opacity:1;transform:translateY(2px) scale(1.06) rotate(4deg)}100%{opacity:1;transform:none}} [data-cine=glint] .benefit h3{animation:benefit-title-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes benefit-title-scrub{0%,28%{opacity:0;transform:translateX(24px) scale(.92)}100%{opacity:1;transform:none}} [data-cine=glint] .benefit p{animation:benefit-body-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes benefit-body-scrub{0%,38%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:none}} [data-cine=glint] .benefit::after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(108deg,transparent 30%,rgba(204,211,219,.62) 50%,transparent 70%);z-index:2;animation:glint-scrub 1000ms ease both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes glint-scrub{0%,42%{transform:translateX(135%)}100%{transform:translateX(-135%)}} [data-cine=curtain] .salon-invite-card{will-change:transform,opacity;animation:invite-card-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes invite-card-scrub{0%{opacity:0;transform:perspective(1400px) translateY(64px) rotateX(18deg) scale(.91)}100%{opacity:1;transform:none}} [data-cine=curtain] .salon-invite-art{animation:invite-art-scrub 1000ms cubic-bezier(.65,0,.2,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes invite-art-scrub{0%{clip-path:inset(15% 45% 15% 45% round 180px 180px 24px 24px)}78%,100%{clip-path:inset(0% 0% 0% 0% round 24px)}} [data-cine=curtain] .salon-invite-art>:is(img,video){animation:invite-img-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes invite-img-scrub{0%{transform:scale(1.28)}100%{transform:scale(1)}} [data-cine=curtain] .invite-seal{animation:invite-seal-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes invite-seal-scrub{0%,42%{opacity:0;filter:blur(5px);transform:perspective(600px) translate3d(0,-38px,140px) scale(2.1) rotate(-16deg)}82%{opacity:1;filter:blur(0);transform:perspective(600px) translate3d(0,2px,-6px) scale(.96) rotate(2deg)}100%{opacity:1;filter:blur(0);transform:none}} [data-cine=curtain] .salon-invite-copy>*:not(h2){animation:invite-copy-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--cp,1) * -999ms)} @keyframes invite-copy-scrub{0%{opacity:0;transform:translate3d(38px,14px,0)}100%{opacity:1;transform:none}} @property --sweep{syntax:"<angle>";inherits:false;initial-value:0deg} [data-cine=curtain] .salon-invite-card::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1.5px;pointer-events:none;z-index:2;background:conic-gradient(from var(--sweep,0deg),transparent 0 295deg,#c9d0d9 340deg,transparent 360deg);-webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);mask-composite:exclude;animation:edge-run-scrub 1000ms linear both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes edge-run-scrub{0%,25%{opacity:0;--sweep:0deg}40%{opacity:1}90%{opacity:1}100%{opacity:0;--sweep:360deg}} [data-cine=fan] .cards3>.svc{transform-origin:50% 100%;will-change:transform,opacity,filter;animation:svc-panel-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes svc-panel-scrub{0%{opacity:0;filter:blur(5px);transform:perspective(1200px) translate3d(calc((1 - var(--i,1)) * 78px),64px,-95px) rotateX(24deg) rotateY(calc((var(--i,1) - 1) * 40deg)) scale(.86)} 100%{opacity:1;filter:blur(0);transform:perspective(1000px) translateY(var(--hy,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}} [data-cine=fan] .cards3>.svc .gold-icon{animation:svc-icon-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes svc-icon-scrub{0%,20%{opacity:0;transform:perspective(500px) translateY(-24px) rotateY(115deg) scale(.42)}100%{opacity:1;transform:none}} [data-cine=fan] .cards3>.svc h3{animation:benefit-title-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} [data-cine=fan] .cards3>.svc p{animation:benefit-body-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} [data-cine=fan] .cards3>.svc .svc-try{animation:svc-cta-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes svc-cta-scrub{0%,42%{opacity:0;transform:translateY(22px) scale(.9)}100%{opacity:1;transform:none}} [data-cine=lights] .film-player{will-change:transform,opacity;animation:film-player-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes film-player-scrub{0%{opacity:0;transform:perspective(1300px) translateY(56px) rotateX(18deg) scale(.92)}100%{opacity:1;transform:none}} [data-cine=lights] .service-timeline>button{animation:film-tab-scrub 1000ms cubic-bezier(.34,1.56,.64,1) both paused;animation-delay:calc(var(--tp,1) * -999ms)} @keyframes film-tab-scrub{0%{opacity:0;transform:perspective(700px) translate3d(0,-34px,95px) rotateX(-38deg) scale(1.28)}100%{opacity:1;transform:none}} [data-cine=lights] .film-screen{animation:film-screen-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes film-screen-scrub{0%,15%{opacity:.12;transform:perspective(1200px) translateY(42px) rotateX(20deg) scale(.9);filter:brightness(.18) saturate(.4)}100%{opacity:1;transform:none;filter:brightness(1) saturate(1)}} [data-cine=lights] .film-caption{animation:film-caption-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes film-caption-scrub{0%,40%{opacity:0;transform:translateY(20px)}100%{opacity:1;transform:none}} [data-cine=desk] .builder-steps>li{will-change:transform,opacity,filter;animation:step-stone-scrub 1000ms cubic-bezier(.34,1.52,.64,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes step-stone-scrub{0%{opacity:0;filter:blur(5px);transform:perspective(900px) translate3d(0,-42px,115px) scale(1.24) rotateX(-28deg)}100%{opacity:1;filter:blur(0);transform:perspective(1000px) translateY(var(--hy,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))}} [data-cine=desk] .builder-form{will-change:transform,opacity;animation:builder-form-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes builder-form-scrub{0%{opacity:0;transform:perspective(1300px) translate3d(72px,40px,-65px) rotateY(-18deg)}100%{opacity:1;transform:none}} [data-cine=desk] .builder-preview{transform-origin:50% 100%;will-change:transform,opacity;animation:builder-preview-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes builder-preview-scrub{0%{opacity:0;transform:perspective(1300px) translate3d(-56px,76px,-75px) rotateX(22deg) rotateY(16deg)}100%{opacity:1;transform:none}} @media(max-width:850px){@keyframes builder-form-scrub{0%{opacity:0;transform:translateY(44px)}100%{opacity:1;transform:none}}@keyframes builder-preview-scrub{0%{opacity:0;transform:translateY(44px)}100%{opacity:1;transform:none}}} [data-cine=focus] .faq>details,[data-cine=focus] .faq-next{will-change:transform,opacity,filter;animation:faq-tablet-scrub 1000ms cubic-bezier(.16,1,.3,1) both paused;animation-delay:calc(var(--p,1) * -999ms)} @keyframes faq-tablet-scrub{0%{opacity:0;filter:blur(6px);transform:perspective(1000px) translate3d(calc(var(--dir,1) * 48px),36px,-50px) rotateX(-22deg) rotateY(calc(var(--dir,1) * -10deg)) scale(.93)}100%{opacity:1;filter:blur(0);transform:none}} [data-cine=draw] .brand-symbol path{stroke-dasharray:var(--len,200);stroke-dashoffset:calc(var(--len,200) * (1 - var(--p,1)))} [data-cine=draw] :is(.foot ul li,.legal){animation:footer-link-scrub 1000ms cubic-bezier(.2,.8,.2,1) both paused;animation-delay:calc(var(--lp,1) * -999ms)} @keyframes footer-link-scrub{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:none}} [data-cine] :is(.sec-head,.benefit,.svc,.faq>details,.builder-steps>li,.builder-form,.builder-preview,.salon-invite-copy>*,.film-player,.cine-word):focus-within{opacity:1!important;filter:none!important;transform:none!important} @media(prefers-reduced-motion:reduce){.ripple,.glass-layer.flash::before,.copy .reveal,.faq details[open]>p,.cine-word{animation:none!important;opacity:1!important;filter:none!important;transform:none!important} [data-cine] *,[data-cine],.sec-head[data-stage],.sec-head[data-stage] *{transition:none!important;animation:none!important;opacity:1!important;filter:none!important;transform:none!important;clip-path:none!important}} :root{--gold:#D8A63C;--gold-soft:#F2DFAF;--gold-deep:#7A5712;--gold-rim:#F6E4B8;--gold-line:#C6AC74;--gold-glow:rgba(216,166,60,.30);--steel:#98A0A9;--space-1:8px;--space-2:14px;--space-3:22px;--space-4:34px;--space-5:52px;--space-6:76px;--hh:72px} html{scroll-behavior:smooth;scroll-padding-top:calc(var(--hh) + 18px)} @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}} section[id],.site-footer{scroll-margin-top:calc(var(--hh) + 14px)} .section{padding-block:clamp(72px,9vw,132px)} .sec-head{margin-bottom:clamp(38px,5.2vw,68px)} .cards3{gap:clamp(20px,2.6vw,34px)} .benefits-five{gap:clamp(14px,1.8vw,22px)} .faq{gap:var(--space-3)} .site-footer{padding-block:var(--space-5) var(--space-4)} .builder-grid{gap:clamp(22px,3.6vw,48px)} .builder-form fieldset{gap:var(--space-3)} .builder-form .btn,.builder-preview .btn{margin-top:var(--space-2)} .journey-actions{gap:var(--space-2)} .sec-head .sub{margin-top:var(--space-3)} body{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;font-size:16px} .sec-head p.sub{color:#35455F!important;font-size:clamp(16px,1.35vw,19px);font-weight:600;line-height:1.85} h1,h2,.sec-head h2,.salon-invite-copy h2{font-weight:800;letter-spacing:-.032em} h3,.svc h3{font-weight:800} .svc p,.benefit span,.builder-steps>li>span{color:#2C3B55!important;font-size:15.5px;font-weight:500;line-height:1.85} .svc h3{font-size:20px} .faq details summary{color:#1A2A44!important;font-size:18px;font-weight:800} .faq details p{color:#2C3B55!important;font-size:16px;font-weight:500;line-height:1.9} .kicker,.journey-kicker{color:var(--gold-deep)!important;font-weight:800;letter-spacing:.01em} .builder-note{color:#39455A!important;font-size:14px;font-weight:500} .builder-browser{font-size:12px;font-weight:600} .salon-invite-copy>p:not(.journey-kicker){font-size:15px;font-weight:500;color:#DCE7F3!important} .salon-invite-copy>p.invite-detail{font-size:14px!important} .film-caption,.live-bio{font-size:16px} .btn{font-weight:800;letter-spacing:.005em} .fineprint{color:#2B3A53!important;font-weight:600} @media(max-width:600px){.svc p,.benefit span{font-size:15px} .faq details summary{font-size:16.5px} .sec-head p.sub{font-size:16px}} .site-header{border-bottom:1px solid rgba(216,166,60,.34);box-shadow:0 6px 22px rgba(16,30,56,.05)} .site-header .nav a[aria-current]{border-color:var(--gold)!important} .scroll-line{background:linear-gradient(90deg,#A87C22,var(--gold),var(--gold-soft),var(--gold))!important;height:3px} .sec-head .kicker::before,.copy .eyebrow::before,.salon-invite-copy .journey-kicker::before{background:linear-gradient(90deg,var(--gold-deep),var(--gold),var(--gold-soft))!important;box-shadow:0 1px 7px var(--gold-glow)!important;height:3px!important} .cine-word--gold{color:#8A641E!important} .cine-word--gold::after{background:linear-gradient(90deg,var(--gold),var(--gold-soft),var(--gold-deep))!important;box-shadow:0 2px 9px var(--gold-glow)!important} .on-dark .cine-word--gold,.salon-invite .cine-word--gold{color:var(--gold-soft)!important} .svc,.benefit,.builder-steps>li{border-color:var(--gold-line)!important} .svc::before,.benefit::before,.builder-steps>li::before{border-color:rgba(216,166,60,.42)!important} .svc:hover,.benefit:hover{border-color:var(--gold)!important} .faq details{border-color:rgba(198,172,116,.85)!important} .faq details[open]{border-color:var(--gold)!important;box-shadow:0 0 0 3px var(--gold-glow),0 14px 34px rgba(16,30,56,.09)} .faq details[open] summary{color:#101E38!important} .site-footer{border-top:1px solid rgba(216,166,60,.42)} .site-footer .foot a:hover{color:var(--gold-soft)!important} .btn{border-color:var(--gold)!important;box-shadow:0 0 0 3px var(--gold-glow),0 10px 24px rgba(8,13,21,.18)} .btn--ghost{border-color:var(--gold-line)!important;color:#1B2B45!important} .live-chips span,.live-services span,.live-links span,.live-works article{border-color:rgba(198,172,116,.9)!important} .live-badge{background:linear-gradient(145deg,#2A3446,#141C2C);border:1px solid rgba(216,166,60,.5)} .live-badge::before{background:var(--gold);box-shadow:0 0 9px var(--gold)} .builder-preview{border-color:rgba(216,166,60,.55)!important} .builder-browser b{color:var(--gold-soft)!important} .gold-icon{width:64px;height:64px;display:grid;place-items:center;border-radius:22px;background:radial-gradient(circle at 28% 20%,#FFF6D8 0%,rgba(255,246,216,.35) 38%,transparent 62%),conic-gradient(from 205deg at 50% 50%,#8A641E,#E6BC58,#FFF0C0,#D8A63C,#A87C22,#F3D78A,#8A641E);border:1px solid var(--gold-rim)!important;box-shadow:inset 0 2px 2px rgba(255,250,226,.95),inset 0 -5px 8px rgba(94,62,10,.55),0 5px 0 #8A641E,0 6px 0 rgba(16,30,56,.45),0 0 0 4px #EFE4C9,0 0 0 5px rgba(216,166,60,.6),0 12px 22px rgba(11,21,40,.3)!important} .gold-icon::before{content:"";position:absolute;inset:3px;border-radius:18px;pointer-events:none;background:linear-gradient(148deg,rgba(255,255,255,.5),transparent 44%,rgba(94,62,10,.26))} .gold-icon svg{position:relative;z-index:1;width:40px;height:40px;fill:none;stroke:#3B2A08!important;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 1px 0 rgba(255,246,214,.85))!important} .gold-icon .gold-icon-depth{stroke:rgba(255,246,214,.92)!important;stroke-width:3.1;transform:translate(1px,1.5px);filter:none!important} :is(.svc,.benefit):hover .gold-icon{box-shadow:inset 0 2px 3px rgba(255,250,226,.95),inset 0 -5px 8px rgba(94,62,10,.55),0 7px 0 #8A641E,0 8px 0 rgba(16,30,56,.45),0 0 0 4px #EFE4C9,0 0 0 5px var(--gold),0 16px 28px rgba(11,21,40,.34)!important} @media(max-width:600px){.gold-icon{width:58px;height:58px;border-radius:19px}.gold-icon svg{width:36px;height:36px}} :where(button,.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,summary,[role="button"]){position:relative;isolation:isolate} :where(button,.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,summary,[role="button"])>.glass-layer{border-radius:inherit} .ripple{background:radial-gradient(circle,transparent 38%,rgba(216,166,60,.30) 58%,rgba(255,240,192,.92) 70%,rgba(216,166,60,.42) 80%,transparent 88%)!important;box-shadow:0 0 16px rgba(216,166,60,.5)!important} .glass-layer.flash::before{background:linear-gradient(112deg,transparent 36%,rgba(242,223,175,.5) 47%,rgba(255,248,222,.92) 50%,rgba(216,166,60,.35) 53%,transparent 64%)!important} .btn:active,.sticky-cta:active,button:active{transform:translateY(1px) scale(.985)} .btn,.sticky-cta,button,summary{transition:transform .16s var(--ease),box-shadow .2s ease,border-color .2s ease,background .2s ease} [data-cine] *,.cine-word,.type-live,.glass-layer{will-change:auto!important} [data-cine] :is(.cine-word,.benefit,.svc,.builder-steps>li,.faq>details,.faq-next,.film-player,.builder-form,.builder-preview,.salon-invite-card,.sec-head,.sec-head .sub,.gold-icon){filter:none!important} img:not([decoding]){image-rendering:auto} img[loading="lazy"]{background:#EEF3F9} .reveal,.cine-word{backface-visibility:hidden} .builder-preview{gap:var(--space-2)} .builder-preview .builder-live{height:clamp(420px,64vh,700px);max-height:none;scroll-behavior:smooth} .wizard{display:grid;gap:var(--space-3)} .wizard-top{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:12px;font-weight:800;color:var(--gold-deep)} .wizard-track{flex:1;height:6px;border-radius:99px;background:#DEE6EF;overflow:hidden} .wizard-track i{display:block;height:100%;width:0;border-radius:99px;background:linear-gradient(90deg,var(--gold-deep),var(--gold),var(--gold-soft));transition:width .35s var(--ease)} .wizard-count{direction:rtl;white-space:nowrap} .wizard-question{margin:0;font-size:clamp(19px,2vw,24px);font-weight:800;line-height:1.6;color:#152238} .wizard-hint{margin:0;font-size:13px;color:#46566F;line-height:1.8} .wizard-step{display:none;gap:var(--space-2)} .wizard-step.is-active{display:grid;animation:wizard-in .34s var(--ease) both} @keyframes wizard-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}} .wizard-step label,.wizard-step fieldset{min-width:0} .wizard-actions{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-top:var(--space-2)} .wizard-actions .btn{flex:1;min-width:130px} .wizard-prev{flex:0 0 auto!important;min-width:100px} .wizard-skip{background:none!important;border:1px dashed var(--gold-line)!important;color:#3A4A63!important;flex:0 0 auto!important;min-width:96px;font-size:14px} .wizard-error{color:#932D26;font-weight:700;font-size:14px;min-height:20px;margin:0} .wizard-summary{display:grid;gap:6px;padding:var(--space-2);border:1px solid rgba(216,166,60,.45);border-radius:14px;background:linear-gradient(145deg,#FFFBF0,#F4F8FD);font-size:14px;line-height:1.9} .wizard-summary b{color:var(--gold-deep)} .live-flash{animation:live-flash 1.1s ease-out} @keyframes live-flash{0%{box-shadow:0 0 0 0 var(--gold-glow)}30%{box-shadow:0 0 0 7px var(--gold-glow)}100%{box-shadow:0 0 0 0 transparent}} @media(max-width:850px){.builder-grid{display:flex;flex-direction:column;gap:10px;height:calc(100svh - var(--hh) - 26px);min-height:540px;overflow:hidden;scroll-margin-top:0} .builder-preview{order:1;position:relative;top:auto;padding:10px;flex:0 0 66%;height:auto;min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:8px;overflow:hidden;scroll-margin-top:0} .builder-preview .builder-live{height:auto;min-height:0;max-height:none} .builder-preview #builderHint{display:none} .builder-form{order:2;flex:1;min-height:0;overflow-y:auto;padding:16px;scroll-margin-top:0} .builder-preview .builder-browser{display:flex} .wizard-question{font-size:20px}} @media(prefers-reduced-motion:reduce){.wizard-step.is-active,.live-flash{animation:none}} button:not(.btn):not(.sticky-cta):not(.menu-toggle):not(.close):not(.nav-btn):not(.demo-controls button):not(.mirror-invite button)>.glass-layer,summary>.glass-layer{background:none!important;box-shadow:none!important} button:not(.btn):not(.sticky-cta):not(.menu-toggle):not(.close):not(.nav-btn):not(.demo-controls button):not(.mirror-invite button)>.glass-layer::before,summary>.glass-layer::before{display:none} :root{--relief-light-bg:linear-gradient(168deg,#FFFDF8 0%,#F5F2EA 55%,#E6E9EE 100%);--trench-light-bg:linear-gradient(165deg,#D7D4CC 0%,#E5E2DB 46%,#F1F0EC 100%)} .salon-builder{background:radial-gradient(ellipse at 20% 5%,#FBF8F0 0%,transparent 60%),#E5E7E9!important} .builder-form{background:#FCFBF7!important} @media(min-width:851px){.builder-grid{grid-template-columns:minmax(0,1.18fr) minmax(320px,.82fr)}} @media(max-width:600px){.salon-builder .builder-steps{display:none} .builder-form .builder-availability{font-size:12px;margin:0 0 10px;line-height:1.7} .builder-form{padding:16px} .wizard{gap:12px} .wizard-question{font-size:19px;margin:0} .wizard-hint{font-size:12px} .wizard-actions{margin-top:10px} .builder-preview{scroll-margin-top:calc(var(--hh) + 8px)}} @media(max-width:600px){.builder-form .builder-availability{display:none} .wizard{display:flex;flex-direction:column;gap:10px} .wizard-question{order:0;font-size:18px;line-height:1.5;margin:0} .wizard-top{order:1} .wizard-hint{display:none} .wizard-step.is-active{order:2} .wizard-error{order:3;min-height:0} .wizard-actions{order:4;margin-top:0;gap:7px;flex-wrap:nowrap} .wizard-actions .btn{min-height:44px;font-size:13px;padding:0 8px;flex:1;min-width:0} .wizard-prev,.wizard-skip{flex:1!important;min-width:0!important}} .builder-form [hidden]{display:none!important} .film-icon{background:radial-gradient(circle at 30% 22%,#FFF6D8 0%,transparent 55%),conic-gradient(from 205deg,#8A641E,#E6BC58,#FFF0C0,#D8A63C,#A87C22,#F3D78A,#8A641E)!important;border:1px solid var(--gold-rim)!important;box-shadow:inset 0 2px 2px rgba(255,250,226,.9),inset 0 -3px 5px rgba(94,62,10,.5),0 3px 0 #8A641E,0 0 0 3px rgba(216,166,60,.32)!important} .film-icon svg{stroke:#3B2A08!important;filter:drop-shadow(0 1px 0 rgba(255,246,214,.85))!important} .service-timeline button{color:#C9AE7B!important;font-weight:700} .service-timeline button[aria-pressed=true]{color:var(--gold-soft)!important} .service-timeline button[aria-pressed=true] .film-icon{box-shadow:inset 0 2px 2px rgba(255,250,226,.9),inset 0 -3px 5px rgba(94,62,10,.5),0 3px 0 #8A641E,0 0 0 4px var(--gold),0 0 0 8px var(--gold-glow)!important} html{scroll-padding-top:calc(var(--hh) + 12px)} section[id],.site-footer{scroll-margin-top:0} .salon-builder .builder-form,.salon-builder .builder-form :is(input,select,textarea,button,summary){scroll-margin:0!important} .live-page{box-sizing:border-box;transform-origin:top left;transform:scale(var(--fit,1));width:calc(100% / var(--fit,1))} .builder-preview .builder-live{scroll-behavior:auto!important} @media(max-width:850px){.salon-builder{padding-block:44px 54px!important} .salon-builder .sec-head{margin-bottom:16px!important} .salon-builder .sec-head .kicker{font-size:12px;margin:0!important} .salon-builder .sec-head h2{font-size:clamp(20px,5.4vw,27px)!important;line-height:1.4!important;margin:6px 0 0!important} .salon-builder .sec-head .sub{display:none!important} .salon-builder .builder-steps{display:none!important} .salon-builder .builder-grid{display:flex!important;flex-direction:column!important;gap:0!important;height:auto!important;min-height:0!important;overflow:visible!important;border:1px solid rgba(198,172,116,.8);border-radius:22px;background:#FFFDF8;box-shadow:0 14px 38px rgba(16,30,56,.12);scroll-margin-top:0!important} .salon-builder .builder-preview{order:1;position:relative!important;top:auto!important;z-index:auto;flex:none!important;height:clamp(230px,33svh,300px);padding:8px!important;display:flex!important;flex-direction:column;gap:6px!important;border:0!important;border-radius:20px 20px 0 0!important;box-shadow:none!important;overflow:hidden!important;background:#191e2a!important} .salon-builder .builder-preview .builder-browser{flex:none;min-height:22px;font-size:10px} .salon-builder .builder-preview .builder-live{flex:1 1 auto;min-height:0;height:auto!important;max-height:none!important;overflow:hidden!important;border-radius:12px} .salon-builder .builder-preview #builderHint{display:none!important} .salon-builder .builder-preview>.btn{flex:none;min-height:34px;margin:0!important;padding:4px 10px!important;font-size:12px!important} .salon-builder .builder-form{order:2;flex:none;overflow:visible!important;padding:12px 14px 14px!important;border:0!important;border-radius:0 0 20px 20px!important;box-shadow:none!important;background:#FCFBF7!important;scroll-margin-top:0!important} .salon-builder .builder-form>.builder-note,.salon-builder .builder-form>.builder-error:empty,.salon-builder .builder-form .builder-availability{display:none!important} .salon-builder .builder-form #builderBuild{margin-top:10px!important} .salon-builder .wizard{display:flex!important;flex-direction:column!important;gap:7px!important} .salon-builder .wizard-top{height:14px} .salon-builder .wizard-track{height:5px} .salon-builder .wizard-count{font-size:11px} .salon-builder .wizard-top{order:0} .salon-builder .wizard-question{order:1;font-size:17px!important;line-height:1.45!important;margin:0!important} .salon-builder .wizard-hint{display:none!important} .salon-builder .wizard-step.is-active{order:2;gap:8px} .salon-builder .wizard-error{order:3;min-height:0;font-size:12px;line-height:1.4} .salon-builder .wizard-step label{font-size:11px;gap:2px;font-weight:700;line-height:1.3} .salon-builder .wizard-step fieldset{gap:7px!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;margin:0!important} .salon-builder .builder-form input:not([type=file]):not([type=color]),.salon-builder .builder-form textarea,.salon-builder .builder-form select{min-height:38px!important;padding:5px 9px!important;font-size:14px!important} .salon-builder .builder-upload{gap:2px!important} .salon-builder .upload-control{grid-template-rows:auto auto!important;gap:2px!important;min-height:50px!important;padding:5px 8px!important;align-content:center!important} .salon-builder .upload-action{min-height:28px!important;padding:2px 8px!important;font-size:12px} .salon-builder .upload-name{font-size:10px;line-height:1.25;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;overflow-wrap:normal} .salon-builder .wizard-actions{order:4;gap:7px!important;margin-top:0!important;flex-wrap:nowrap!important} .salon-builder .wizard-actions .btn{min-height:40px!important;font-size:13px!important;padding:0 8px!important;flex:1!important;min-width:0!important}} @media(max-width:850px) and (max-height:720px),(max-width:850px) and (max-width:380px){.salon-builder .builder-preview{height:auto!important} .salon-builder .builder-preview .builder-live{height:auto!important;overflow:visible!important} .salon-builder .sec-head h2{font-size:19px!important}} .live-flash{animation:live-flash 1.05s ease-out;border-radius:8px} @keyframes live-flash{0%{background:rgba(242,223,175,.55);box-shadow:inset 0 0 0 2px var(--gold)} 65%{background:rgba(242,223,175,.20);box-shadow:inset 0 0 0 2px rgba(216,166,60,.55)} 100%{background:transparent;box-shadow:inset 0 0 0 2px transparent}} @media(max-width:400px){.salon-builder{padding-block:32px 44px!important} .salon-builder .sec-head{margin-bottom:12px!important}} .glass,.style-dock,.demo-caption,.cinema-arrows button,.auto-film .journey-copy,.invite-seal{backdrop-filter:none!important;-webkit-backdrop-filter:none!important} .glass{background:rgba(217,224,231,.92)!important} .style-dock{background:rgba(212,220,228,.92)!important} .demo-caption{background:#f7f9fbee!important} .cinema-arrows button{background:#121720dc!important} .auto-film .journey-copy{background:linear-gradient(140deg,#101620f5,#101620e8)!important} .invite-seal{background:linear-gradient(155deg,rgba(17,23,35,.97),rgba(9,12,17,.99))!important} .lead-fallback{box-sizing:border-box;max-width:100%;margin:var(--space-3) auto 0;padding:clamp(14px,2.2vw,22px);border:1px solid rgba(198,172,116,.55);border-radius:18px;background:#FDFDFC;color:var(--ink);box-shadow:0 10px 30px rgba(21,34,56,.07)} .lead-fallback.is-primary{border-color:rgba(216,166,60,.85);box-shadow:0 12px 34px rgba(216,166,60,.16)} .lead-fallback[hidden],.lead-fallback [hidden]{display:none!important} .lead-fallback-lead{margin:0 0 8px;font-size:14px;font-weight:800;color:var(--ink)} .lead-fallback-toggle{display:inline-flex;align-items:center;min-height:44px;padding:0 2px;border:0;background:none;color:var(--gold-deep);font:inherit;font-size:15px;font-weight:800;text-decoration:underline;text-underline-offset:5px;cursor:pointer} .lead-fallback-toggle:hover{color:var(--ink)} .lead-fallback-toggle:focus-visible{outline:3px solid var(--gold-soft);outline-offset:3px;border-radius:6px} .lead-fallback .lf-intro{margin:0 0 4px;max-width:62ch;font-size:14px;line-height:1.9;color:#3F4F68} .lead-fallback .path--form{display:grid;gap:14px;width:100%;max-width:100%;margin:0;padding:0;background:none;border:0;box-shadow:none;color:var(--ink)} .lead-fallback .path--form>h3{margin:0;font-size:18px;font-weight:800;color:var(--ink)} .lead-fallback .lf-grid{grid-template-columns:1fr 1fr;gap:12px;width:100%} .lead-fallback .lf-field{display:grid;gap:5px;width:100%;min-width:0} .lead-fallback .lf-field label{font-size:14px;font-weight:700;color:#152238} .lead-fallback .lf-field .opt{font-weight:500;color:#3F4F68} .lead-fallback .lf-field input{box-sizing:border-box;width:100%;min-height:48px;padding:10px 14px;border-radius:12px;border:1px solid #C6AC74;background:#fff;color:#152238;font:inherit;font-size:16px;line-height:1.6} .lead-fallback .lf-field input:focus-visible{outline:3px solid #F2DFAF;outline-offset:2px;border-color:#D8A63C} .lead-fallback .lf-privacy{margin:0;font-size:12px;line-height:1.8;color:#3F4F68} .lead-fallback .lf-check{display:flex;align-items:flex-start;gap:10px;font-size:14px;line-height:1.8;color:#152238;cursor:pointer} .lead-fallback .lf-check input{flex:0 0 22px;width:22px;height:22px;margin:2px 0 0;accent-color:#D8A63C} .lead-fallback .lf-err{min-height:1.6em;margin:0;font-size:14px;font-weight:700;color:#9B2C22} .lead-fallback .lf-done{margin:0;padding:14px 16px;border-radius:12px;border:1px solid rgba(216,166,60,.7);background:rgba(242,223,175,.35);color:#5A410D;font-weight:700;line-height:1.9} .lead-fallback .lf-hp{position:absolute;inset-inline-start:-9999px;width:1px;height:1px;overflow:hidden} .lead-fallback .btn{margin-top:4px;justify-self:start} .lead-fallback .path--form .btn[disabled]{opacity:.6;cursor:progress} @media(max-width:640px){.lead-fallback{margin-top:14px;padding:14px;border-radius:14px} .lead-fallback .lf-grid{grid-template-columns:1fr} .lead-fallback .btn{width:100%;justify-self:stretch}} .wizard-ready{margin:0;padding:10px 12px;border:1px solid rgba(216,166,60,.55);border-radius:12px;background:linear-gradient(145deg,#FFFBF0,#F4F8FD);color:#3A2A08;font-size:14px;font-weight:700;line-height:1.8} .builder-details{margin-top:var(--space-2);border:1px solid rgba(198,172,116,.6);border-radius:14px;background:#FFFCF4;padding:2px 14px} .builder-details>summary{cursor:pointer;list-style:none;padding:12px 2px;display:flex;align-items:center;gap:8px;font-size:14px;font-weight:800;color:#7A5712} .builder-details>summary::-webkit-details-marker{display:none} .builder-details>summary::before{content:'＋';font-size:16px;line-height:1;color:#A87C22} .builder-details[open]>summary::before{content:'−'} .builder-details>summary:focus-visible{outline:2px solid #A87C22;outline-offset:3px;border-radius:8px} .detail-lead{margin:0 0 4px;font-size:12.5px;color:#46566F;line-height:1.8} .detail-group{display:grid;gap:8px;padding:14px 2px;border-top:1px dashed rgba(198,172,116,.55)} .detail-group:first-of-type{border-top:0} .detail-group h4{margin:0;font-family:var(--display);font-size:15px;font-weight:800;color:#152238} .detail-group .detail-hint,.detail-lead{font-size:12.5px;color:#46566F;line-height:1.8} .detail-group label,.detail-group fieldset{min-width:0} .detail-group .builder-upload{margin:0} @media(max-width:850px){.salon-builder .builder-details{margin-top:10px;padding:0 12px} .salon-builder .builder-details>summary{padding:11px 2px;font-size:13px} .salon-builder .detail-group{padding:12px 0;gap:7px} .salon-builder .detail-group h4{font-size:13px} .salon-builder .detail-group .detail-hint,.salon-builder .detail-lead{font-size:11.5px;line-height:1.65} .salon-builder .detail-group fieldset{gap:7px!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;margin:0!important} .salon-builder .wizard-ready{font-size:12.5px;padding:8px 10px;line-height:1.65}} .compare{margin-top:0} @media (max-width:1100px){.selection{padding-top:56px}.compare{margin:0 auto}}</style></head><body><a class="skip" href="#main">رفتن به محتوای اصلی</a><header class="site-header"><a class="brand" href="#intro" aria-label="آینه، بازگشت به ابتدای صفحه"><span class="brand-symbol"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><span class="brand-name">آینه<small>AYNEH</small></span></a><nav class="nav" aria-label="ناوبری اصلی"><a href="#studio">چطور کار می‌کند</a><a href="#how">مزایا</a><a href="#services">خدمات</a><a href="#salon-example">استودیوی سالن</a><a href="#faq">پرسش‌ها</a></nav><div class="header-actions"><a class="btn header-cta" href="#salon-example">ساخت پیش‌نمایش سالن من</a><button type="button" class="menu-toggle" aria-expanded="false" aria-controls="mobile-menu" aria-label="باز کردن فهرست"><span class="menu-bars" aria-hidden="true"><i></i><i></i></span></button></div><nav id="mobile-menu" class="mobile-menu" aria-label="فهرست موبایل" hidden><p class="menu-kicker">فهرست آینه</p><a class="menu-link" href="#studio"><span>چطور کار می‌کند</span><span aria-hidden="true">↙</span></a><a class="menu-link" href="#how"><span>مزایا</span><span aria-hidden="true">↙</span></a><a class="menu-link" href="#services"><span>خدمات مو، ناخن و مژه</span><span aria-hidden="true">↙</span></a><a class="menu-link" href="#salon-example"><span>استودیوی سالن</span><span aria-hidden="true">↙</span></a><a class="menu-link" href="#faq"><span>پرسش‌ها</span><span aria-hidden="true">↙</span></a><a class="btn menu-cta" href="#salon-example">ساخت پیش‌نمایش سالن من</a></nav></header><main id="main"><noscript><style>.site-loader{display:none!important}html.hero-loading{overflow:auto}</style></noscript><div id="siteLoader" class="site-loader" hidden role="status" aria-label="آماده‌سازی آینه"><div class="loader-mirror"><span class="loader-brand"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><i></i></div><p>انتخابی که به شما می‌آید.</p><div class="loader-track"><i id="loaderProgress"></i></div></div><section id="intro" class="film" aria-labelledby="h1" tabindex="-1"><div class="stage" id="stage" data-demo="loading"><div class="copy" id="copy"><p class="eyebrow reveal">برای صاحبان سالن مو، ناخن و مژه</p><h1 id="h1" class="reveal">مدل دلخواه مشتری، روی عکس خودش و پیش از مراجعه</h1><p class="lead reveal">با صفحهٔ اختصاصی سالن، مشتری مدل و رنگ مو، طرح ناخن یا مژه را روی عکس خودش امتحان می‌کند. انتخاب و عکسش را در تلگرام یا بله دریافت و بررسی کنید.</p><div class="cta-row reveal"><a class="btn btn--lg" href="#salon-example"><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a><a class="btn btn--ghost" data-try="hair" href="/s/demo?l=hair&amp;from=landing" id="openHeroDemo"><span>ببینید مشتری چه می‌بیند</span></a></div><p class="fineprint reveal"><span>پیش‌نمایش رایگان و بدون ثبت‌نام است. امتحان روی عکس خودتان نیاز به تأیید شماره دارد.</span></p></div><div class="studio" id="studio" tabindex="-1" aria-label="دموی تعاملی آینه روی چهرهٔ نمونه"><div class="mirror" id="mirror"><div class="plate" id="plate"><img class="room-backdrop" src="/landing/hero.webp" width="1376" height="768" alt="" aria-hidden="true"><svg class="empty-glass" viewBox="0 0 1376 768" aria-hidden="true"><defs><linearGradient id="mirrorGlass" x2=".7" y2="1"><stop stop-color="#91969b"/><stop offset=".5" stop-color="#b0b4b9"/><stop offset="1" stop-color="#93979c"/></linearGradient></defs><path fill="url(#mirrorGlass)" d="M605 471V240C605 137 761 137 761 240V471Z M506 455V272C506 193 585 193 585 272V455Z M782 455V272C782 193 863 193 863 272V455Z"/></svg><div class="mirror-front" id="mirrorFront"><img id="roomImg" fetchpriority="high" decoding="async" src="/landing/hero.webp" width="1376" height="768" alt="آینهٔ سه‌تکهٔ برنجی با تصویر یک مدل در آن، روی پایه‌ای از سنگ"><img id="roomImg2" class="alt" src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="" aria-hidden="true" width="1376" height="768"><canvas id="hairCanvas" width="1376" height="768" aria-hidden="true"></canvas></div><div class="mirror-invite" id="mirrorInvite" inert><span class="invite-mark" aria-hidden="true">✦</span><p>این بار،<br>تصویر خودتان.</p><a class="btn" data-try="hair" href="/s/demo?l=hair&amp;from=landing"><span class="inv-long">با عکس خودم</span><span class="inv-short">امتحان کنید</span> <span aria-hidden="true">←</span></a><button type="button" id="backToMirror"><span class="inv-long">بازگشت به آینه</span><span class="inv-short">بازگشت</span></button></div><div class="dock glass" id="dock"><h2 id="dock-h">مدل مو · روی این چهره امتحان کنید</h2><div class="dock-view"><div class="dock-track hscroll" id="dockTrack" role="radiogroup" aria-labelledby="dock-h"></div><button type="button" class="nav-btn nav-r" id="dkPrev" aria-label="مدل‌های قبلی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button><button type="button" class="nav-btn nav-l" id="dkNext" aria-label="مدل‌های بعدی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button></div><button type="button" class="more" id="more" aria-expanded="false" aria-controls="styles"><span>دیدن همهٔ مدل‌ها</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 7.5 10 12.5 15 7.5"/></svg></button></div></div><div class="palette glass" id="colors"><h2 id="colors-h">رنگ مو</h2><div class="col-list" id="colList" role="radiogroup" aria-labelledby="colors-h"></div></div><aside class="reference glass" id="ref" inert aria-live="polite"><span class="ph"><img id="refImg" alt="" width="240" height="300"></span><div class="ref-body"><strong id="refName"></strong><small id="refNote"></small><a class="ref-try" data-try="hair" href="/s/demo?l=hair&amp;from=landing">امتحان روی عکس خودم ←</a></div></aside><div class="result glass" id="result" role="status" aria-live="polite"><span id="resultText"></span><a class="btn" data-try="hair" href="/s/demo?l=hair&amp;from=landing"><span>همین الان با عکس خودم بساز</span><span class="arrow" aria-hidden="true">←</span></a></div></div></div><div class="styles" id="styles" aria-hidden="true"><div class="styles-head"><h2 id="styles-h">مدل مو <span id="styCount"></span></h2><button type="button" class="close" id="closeRail"><span>بستن</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 12.5 10 7.5 15 12.5"/></svg></button></div><div class="rail-wrap"><div class="track hscroll" id="track" role="radiogroup" aria-labelledby="styles-h"></div><button type="button" class="nav-btn nav-r" id="stPrev" aria-label="مدل‌های قبلی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg></button><button type="button" class="nav-btn nav-l" id="stNext" aria-label="مدل‌های بعدی"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg></button></div></div><div class="demo-file" id="demoFile" aria-hidden="true"><img src="/landing/hero.webp" alt=""><span>تصویر من.jpg</span></div><svg class="demo-hand" id="demoHand" viewBox="0 0 48 56" aria-hidden="true"><path d="M14 29V9a5 5 0 0 1 10 0v15-5a4 4 0 0 1 8 0v7-4a4 4 0 0 1 8 0v9-3a4 4 0 0 1 8 0v12c0 10-6 17-17 17h-2c-6 0-10-3-14-8L5 35c-4-5 2-11 6-7l7 7" transform="translate(-3,-2)"/></svg><div class="demo-caption" id="demoCaption" role="status" aria-live="polite">نمایش نحوهٔ کار آینه</div><div class="demo-controls"><button type="button" id="skipDemo">رد کردن نمایش</button><button type="button" id="replayDemo" hidden>پخش دوبارهٔ نمایش</button></div><noscript><style>.mirror-front{opacity:1!important}.demo-controls,.demo-caption,.dock,.palette,#openHeroDemo{display:none}</style></noscript><div class="fade" id="fade" aria-hidden="true"></div></div></section><section id="how" class="section section--sunken" aria-labelledby="h-how" tabindex="-1"><div class="wrap"><header class="sec-head"><p class="kicker">چرا آینه برای سالن شما ساخته شده</p><h2 id="h-how">آینه صفحهٔ اختصاصی سالن شماست</h2><p class="sub">مشتری عکس چهره یا دستش را می‌گذارد، مدل و رنگ مو، طرح ناخن یا مژه را روی عکس خودش امتحان می‌کند و انتخابش را با تصویر برای شما می‌فرستد. شما در تلگرام یا بله درخواست را می‌بینید و جواب می‌دهید.</p></header><div class="benefits-five"><article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M11 27V15a9 9 0 0 1 18 0v12ZM20 27v6m-6 0h12m-9-14 5-5"/><path d="M11 27V15a9 9 0 0 1 18 0v12ZM20 27v6m-6 0h12m-9-14 5-5"/></svg></span><h3>انتخاب قبل از مراجعه</h3><p>مشتری مدل و رنگ را روی عکس خودش می‌بیند و با انتخاب مشخص سراغ سالن می‌آید.</p></article><article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M9 10h22v15H19l-7 6v-6H9Zm6 6h10m-10 4h7"/><path d="M9 10h22v15H19l-7 6v-6H9Zm6 6h10m-10 4h7"/></svg></span><h3>مشاوره با تصویر</h3><p>آرایشگر عکس و مدل انتخاب‌شده را کنار هم می‌بیند و دربارهٔ همان نتیجه با مشتری حرف می‌زند.</p></article><article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M10 8h20v24H10Zm5 17 5-6 4 4 3-3m-11-6h.1"/><path d="M10 8h20v24H10Zm5 17 5-6 4 4 3-3m-11-6h.1"/></svg></span><h3>نمونه‌کار قابل امتحان</h3><p>مشتری از میان کارهای خود سالن انتخاب می‌کند و مدل دلخواهش را روی عکس خودش می‌بیند.</p></article><article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M16 24l8-8m-10 5-4 4a4 4 0 0 0 6 6l4-4m0-14 4-4a4 4 0 0 1 6 6l-4 4"/><path d="M16 24l8-8m-10 5-4 4a4 4 0 0 0 6 6l4-4m0-14 4-4a4 4 0 0 1 6 6l-4 4"/></svg></span><h3>یک لینک با نام سالن</h3><p>لینک صفحه را در بیوی اینستاگرام یا دایرکت بگذارید؛ مشتری از همان گوشی وارد می‌شود.</p></article><article class="svc benefit"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M20 7l11 4v8c0 6-4 10-11 14-7-4-11-8-11-14v-8Zm-5 13 4 4 7-8"/><path d="M20 7l11 4v8c0 6-4 10-11 14-7-4-11-8-11-14v-8Zm-5 13 4 4 7-8"/></svg></span><h3>پاسخ در پیام‌رسان</h3><p>درخواست تصویری به تلگرام یا بله می‌رسد و همان‌جا می‌توانید آن را تأیید یا رد کنید.</p></article></div></div></section><section class="salon-invite" aria-labelledby="salon-invite-title"><div class="salon-invite-card"><div class="salon-invite-art"><video class="invite-video" muted loop playsinline disablepictureinpicture disableremoteplayback preload="none" poster="/landing/invite-promo-poster.webp" width="1280" height="720" aria-label="ساخت صفحهٔ یک سالن نمونه، از پر کردن فرم تا صفحهٔ آماده"><source src="/landing/video/invite-promo-a565b22c.webm" type="video/webm"><source src="/landing/video/invite-promo-a565b22c.mp4" type="video/mp4"></video><span class="invite-seal"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg><span>این تجربه،<br>با نام سالن شما.</span></span></div><div class="salon-invite-copy"><p class="journey-kicker">آینه برای سالن زیبایی شما</p><h2 id="salon-invite-title">قبل از راه‌اندازی، صفحهٔ سالن‌تان را ببینید</h2><p>اسم، رنگ برند و نمونه‌کارهایتان را اضافه کنید و ببینید مشتری‌ها صفحهٔ سالن شما را چطور می‌بینند.</p><p class="invite-detail">پیش‌نمایش رایگان است و به ثبت‌نام نیاز ندارد. راه‌اندازی پس از بررسی درخواست و هماهنگی با شما انجام می‌شود.</p><a class="btn btn--lg" href="#salon-example"><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a></div></div></section><section id="services" class="section" aria-labelledby="h-svc" tabindex="-1"><div class="wrap"><div class="sec-head"><p class="kicker">دموی خدمات</p><h2 id="h-svc">مو، ناخن و مژه؛ همه در یک صفحه</h2><p class="sub">هر دمو در تب جدید و در صفحهٔ یک سالن نمونه باز می‌شود؛ صفحهٔ شما همینجا می‌ماند.</p></div><div class="cards3"><article class="svc"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/><path d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/></svg></span><h3>مدل و رنگ مو</h3><p>عکس چهره را بگذارید، مدل یا رنگ را انتخاب کنید و نتیجه را روی همان عکس ببینید.</p><a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon?l=hair&from=landing&utm_source=landing&utm_medium=demo&utm_campaign=owner_preview&utm_content=hair" target="_blank" rel="noopener noreferrer" title="در تب جدید باز می‌شود">دموی مدل و رنگ مو</a></article><article class="svc"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/><path d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/></svg></span><h3>طرح ناخن</h3><p>عکس دست را بگذارید و فرم، رنگ و طرح را روی همان دست امتحان کنید.</p><a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon?l=nails&from=landing&utm_source=landing&utm_medium=demo&utm_campaign=owner_preview&utm_content=nails" target="_blank" rel="noopener noreferrer" title="در تب جدید باز می‌شود">دموی طرح ناخن</a></article><article class="svc"><span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/><path d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/></svg></span><h3>مدل مژه</h3><p>عکس چهره یا چشم را بگذارید و حالت، طول و حجم مژه را روی چشم خودتان ببینید.</p><a class="btn btn--ghost svc-try" href="https://ayneh-salon.site/s/sanaz-salon?l=lashes&from=landing&utm_source=landing&utm_medium=demo&utm_campaign=owner_preview&utm_content=lashes" target="_blank" rel="noopener noreferrer" title="در تب جدید باز می‌شود">دموی مدل مژه</a></article></div></div></section><section id="transform" class="service-journey on-dark" aria-label="ویدئوهای خدمات آینه"><div class="film-player"><div class="service-timeline" role="group" aria-label="انتخاب ویدئو"><button type="button" data-film="hair" aria-pressed="true"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11"/></svg></span><span>مدل و رنگ مو</span></button><button type="button" data-film="lashes" aria-pressed="false"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0"/></svg></span><span>مژه</span></button><button type="button" data-film="nails" aria-pressed="false"><span class="film-icon"><svg viewBox="0 0 40 40" aria-hidden="true"><path d="M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z"/></svg></span><span>ناخن</span></button></div><div class="film-screen"><video id="serviceVideo" class="service-video" muted playsinline disablepictureinpicture disableremoteplayback preload="none" poster="/landing/hair-poster.webp" aria-label="مدل و رنگ مو"><source src="/landing/video/hair.mp4" type="video/mp4"></video><div class="film-caption" aria-live="polite"><span>نمونه‌های شبیه‌سازی آینه</span><strong id="filmTitle">مدل و رنگ مو</strong><p id="filmError" role="status" hidden></p><p id="filmText">مدل و رنگ‌های مختلف را روی یک چهره ببینید و انتخاب کنید.</p></div></div></div></section><section id="salon-example" class="section salon-builder" aria-labelledby="h-example" tabindex="-1"><div class="wrap"><header class="sec-head"><p class="kicker">استودیوی صفحهٔ سالن</p><h2 id="h-example">صفحهٔ سالن‌تان را از چشم مشتری ببینید</h2><p class="sub">با نام و نشانی سالن، پیش‌نمایش همان لحظه آماده می‌شود. جزئیات را بعداً هم می‌توانید اضافه کنید.</p></header><ol class="builder-steps" aria-label="مراحل راه‌اندازی صفحه"><li><strong>پیش‌نمایش رایگان</strong><span>ظاهر صفحه را با اطلاعات سالن‌تان ببینید.</span></li><li><strong>درخواست راه‌اندازی</strong><span>شماره‌تان را بگذارید یا با پیامک تأیید کنید؛ پرداختی لازم نیست.</span></li><li><strong>بررسی و هماهنگی</strong><span>قبل از راه‌اندازی، امکانات و هزینه‌ها را مرور می‌کنیم.</span></li></ol><div class="builder-grid"><div class="builder-preview" id="builderPreview"><div class="builder-browser"><span class="live-badge">پیش‌نمایش زنده</span><b dir="ltr" id="builderAddress">ayneh-salon.site/s/your-salon</b></div><div class="builder-live" id="builderLive" tabindex="0" role="region" aria-label="پیش‌نمایش زندهٔ صفحهٔ سالن"><div class="live-page" id="livePage"><div class="live-cover"><img id="liveCover" alt="" hidden><span>آینهٔ اختصاصی سالن</span></div><div class="live-salon"><div class="live-logo"><img id="liveLogo" alt="" hidden><span id="liveInitial">س</span></div><p class="live-kicker">استودیو زیبایی</p><h3 id="liveName">نام سالن شما</h3><p id="liveBio">مدل دلخواهت را روی عکس خودت ببین و انتخابت را برای سالن بفرست.</p><div class="live-chips"><span id="liveAddress" hidden></span><span id="liveHours" hidden></span></div><span class="live-try">شروع با عکس خودم</span><div class="live-services" aria-label="خدمات سالن"><span>مدل مو</span><span>رنگ مو</span><span>ناخن</span><span>مژه</span></div><section class="live-detail" id="liveContact" hidden><h4>دربارهٔ سالن</h4><div class="live-manager"><img id="livePortrait" alt="" hidden><span id="liveManager"></span></div><p id="livePhone" dir="ltr"></p><div class="live-links" id="liveLinks"></div></section><section class="live-detail"><h4>نمونه‌کارهای سالن</h4><div id="liveWorks" class="live-works"></div><p id="liveEmpty">با افزودن نمونه‌کار، عکس و توضیحات آن اینجا دیده می‌شود.</p></section></div></div></div><div class="builder-loading" id="builderLoading" role="status" hidden><span class="builder-spinner" aria-hidden="true"></span><p>در حال آماده‌کردن پیش‌نمایش…</p></div><button class="btn btn--lg" id="builderActivate" type="button" hidden>ثبت درخواست فعال‌سازی</button><p class="builder-note" id="builderHint" aria-live="polite"></p></div><form id="start" class="builder-form" method="post" aria-describedby="builderAvailability"><p id="builderAvailability" class="builder-availability" role="status">پیش‌نمایش رایگان است. وضعیت ثبت درخواست در حال بررسی است.</p><noscript><p>برای ساخت پیش‌نمایش، جاوااسکریپت مرورگر را فعال کنید.</p></noscript><div class="wizard" id="builderWizard"><div class="wizard-top"><span class="wizard-track"><i id="wizardBar"></i></span><span class="wizard-count" id="wizardCount">۱ از ۲</span></div><p class="wizard-question" id="wizardQuestion"></p><p class="wizard-hint" id="wizardHintText"></p><div class="wizard-step is-active" data-key="name" data-required="1"
data-q="نام سالن شما چیست؟" data-h="همان لحظه که تایپ می‌کنید، نام سالن در پیش‌نمایش دیده می‌شود."><label class="identity-name"><span>نام سالن</span><input name="name" required minlength="2" maxlength="100" autocomplete="organization" placeholder="مثلاً استودیو آینه"></label></div><div class="wizard-step" data-key="slug" data-required="1"
data-q="نشانی اختصاصی صفحه چه باشد؟" data-h="۳ تا ۴۶ کاراکتر انگلیسی، عدد یا خط تیره. با حرف شروع کنید و با حرف یا عدد تمام کنید."><label class="identity-address"><span>نشانی اختصاصی پیشنهادی</span><span class="identity-url" dir="ltr"><span>ayneh-salon.site/s/</span><input name="slug" id="slugHintInput" aria-describedby="slugHint" dir="ltr" required pattern="[a-z][a-z0-9\\-]{1,44}[a-z0-9]" maxlength="46" placeholder="my-salon" autocapitalize="none" spellcheck="false"></span><small id="slugHint">این نشانی، آدرس صفحه‌ای است که مشتری‌ها می‌بینند.</small></label></div><p class="wizard-ready" id="wizardReady" role="status" hidden>پیش‌نمایشتان آماده است. جزئیات را هر وقت خواستید اضافه کنید؛ هیچ‌کدام اجباری نیست.</p><p class="wizard-error" id="wizardError" role="alert"></p><div class="wizard-actions"><button type="button" class="btn btn--ghost wizard-prev" id="wizardPrev" hidden>قبلی</button><button type="button" class="btn wizard-skip" id="wizardSkip" hidden>رد کردن</button><button type="button" class="btn wizard-next" id="wizardNext">ادامه</button></div></div><details class="builder-details" id="builderDetails"><summary>تکمیل جزئیات صفحه (اختیاری)</summary><p class="detail-hint detail-lead">هرچه اینجا بنویسید، همان لحظه در پیش‌نمایش بالا دیده می‌شود. برای درخواست راه‌اندازی نیازی به پر کردن این بخش نیست.</p><div class="detail-group"><h4>رنگ برند سالن را انتخاب کنید</h4><p class="detail-hint">رنگ کارت‌ها و دکمه‌های صفحهٔ مشتری فوراً هماهنگ می‌شود.</p><label class="builder-color"><span>رنگ برند</span><span class="identity-color"><input type="color" name="brand" value="#7c8998"><output id="builderBrandHex" dir="ltr">#7c8998</output></span></label></div><div class="detail-group"><h4>لوگوی سالن را اضافه کنید</h4><p class="detail-hint">اختیاری · JPG، PNG یا WebP تا ۱۲ مگابایت.</p><label class="builder-upload"><span>لوگو</span><span class="upload-control"><span class="upload-action">انتخاب لوگو</span><span class="upload-name" dir="auto" aria-live="polite">JPG، PNG یا WebP</span><input type="file" name="logo" accept="image/jpeg,image/png,image/webp"></span></label></div><div class="detail-group"><h4>عکس کاور صفحه را انتخاب کنید</h4><p class="detail-hint">اختیاری · همین عکس بالای صفحهٔ مشتری دیده می‌شود.</p><label class="builder-upload"><span>عکس کاور</span><span class="upload-control"><span class="upload-action">انتخاب عکس کاور</span><span class="upload-name" dir="auto" aria-live="polite">JPG، PNG یا WebP</span><input type="file" name="cover" accept="image/jpeg,image/png,image/webp"></span></label></div><div class="detail-group"><h4>سالن را در یک جمله معرفی کنید</h4><p class="detail-hint">اختیاری · زیر نام سالن در پیش‌نمایش نوشته می‌شود.</p><label class="wide">دربارهٔ سالن<textarea name="bio" maxlength="1000" rows="3" placeholder="تخصص ما رنگ و کوپ‌های طبیعی است."></textarea></label></div><div class="detail-group"><h4>مشتری چطور با شما تماس بگیرد؟</h4><p class="detail-hint">اختیاری · هر چیزی که پر کنید در کارت «دربارهٔ سالن» پیش‌نمایش می‌آید.</p><fieldset><legend class="sr-only">مشخصات سالن</legend><label>نام مدیر<input name="manager" maxlength="100"></label><label>تلفن سالن<input type="tel" name="phone" dir="ltr" maxlength="24"></label><label>ساعات کاری<input name="hours" maxlength="150"></label><label>آدرس<input name="address" maxlength="250"></label><label class="builder-upload wide"><span>عکس مدیر</span><span class="upload-control"><span class="upload-action">انتخاب عکس مدیر</span><span class="upload-name" dir="auto" aria-live="polite">JPG، PNG یا WebP</span><input type="file" name="portrait" accept="image/jpeg,image/png,image/webp"></span></label></fieldset></div><div class="detail-group"><h4>لینک‌ها و شبکه‌های اجتماعی</h4><p class="detail-hint">اختیاری · لینک‌ها باید با http:// یا https:// شروع شوند.</p><fieldset><legend class="sr-only">لینک‌ها</legend><label>لینک نقشه<input type="url" name="map" dir="ltr" maxlength="350" placeholder="https://"></label><label>لینک اینستاگرام<input type="url" name="instagram" dir="ltr" maxlength="350" placeholder="https://"></label><label>لینک تلگرام<input type="url" name="telegram" dir="ltr" maxlength="350" placeholder="https://"></label><label>وب‌سایت<input type="url" name="website" dir="ltr" maxlength="350" placeholder="https://"></label></fieldset></div><div class="detail-group"><h4>نمونه‌کارهای سالن را اضافه کنید</h4><p class="detail-hint">اختیاری · تا ۶ مورد؛ عکس و توضیح هرکدام در پیش‌نمایش دیده می‌شود.</p><div id="builderWorks"></div><button id="builderAdd" class="btn btn--ghost" type="button">افزودن نمونه‌کار +</button></div></details><p class="builder-error" id="builderError" role="alert" tabindex="-1"></p><button type="submit" class="btn btn--lg" id="builderBuild" disabled hidden>آماده‌کردن پیش‌نمایش</button><p class="builder-note">تا پیش از ارسال درخواست، پیش‌نمایش و عکس‌ها فقط در مرورگر شما می‌مانند.</p></form></div><div class="lead-fallback" id="leadFallback" hidden><p class="lead-fallback-lead" id="leadFallbackLead"></p><button type="button" class="lead-fallback-toggle" id="leadFallbackToggle" aria-expanded="false" aria-controls="leadFallbackBody">یا فقط شماره بگذارید؛ با شما تماس می‌گیریم</button><div class="lead-fallback-body" id="leadFallbackBody" hidden><form class="path path--form" id="leadForm" novalidate aria-labelledby="h-lead"><h3 id="h-lead">درخواست راه‌اندازی</h3><p class="lf-intro">بدون پرداخت و بدون انتشار صفحه، برای هماهنگی و اعلام هزینه با شما تماس می‌گیریم.</p><div class="lf-grid"><div class="lf-field"><label for="lf-salon">نام سالن</label><input id="lf-salon" name="salon" type="text" autocomplete="organization" maxlength="80" required></div><div class="lf-field"><label for="lf-phone">شمارهٔ موبایل</label><input id="lf-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" placeholder="۰۹۱۲۰۰۰۰۰۰۰" maxlength="20" required><small class="lf-privacy">شماره فقط برای پیگیری همین درخواست استفاده می‌شود.</small></div><div class="lf-field"><label for="lf-name">نام شما</label><input id="lf-name" name="name" type="text" autocomplete="name" maxlength="60" required></div><div class="lf-field"><label for="lf-city">شهر <span class="opt">(اختیاری)</span></label><input id="lf-city" name="city" type="text" autocomplete="address-level2" maxlength="40"></div></div><p class="lf-plan" id="lf-plan" hidden></p><div class="lf-hp" aria-hidden="true"><label for="lf-web">وب‌سایت</label><input id="lf-web" name="website" type="text" tabindex="-1" autocomplete="off"></div><label class="lf-check" for="lf-consent"><input id="lf-consent" name="consent" type="checkbox"><span>موافقم برای راه‌اندازی صفحهٔ سالن و معرفی سرویس با من تماس بگیرید.</span></label><p class="lf-err" id="lf-err" role="alert"></p><button class="btn btn--lg" type="submit" id="lf-send"><span>درخواست راه‌اندازی را بفرستید</span><span class="arrow" aria-hidden="true">←</span></button><p class="lf-done" id="lf-done" role="status" hidden></p></form></div></div></div></section><template id="builderWorkTemplate"><fieldset class="builder-work"><legend>نمونه‌کار</legend><label>عنوان<input data-work="title" required minlength="2" maxlength="100"></label><label>خدمت<select data-work="line"><option value="hair">مدل مو</option><option value="color">رنگ مو</option><option value="nails">ناخن</option><option value="lashes">مژه</option></select></label><label class="builder-upload wide"><span>عکس نمونه‌کار</span><span class="upload-control"><span class="upload-action">انتخاب عکس نمونه‌کار</span><span class="upload-name" dir="auto" aria-live="polite">JPG، PNG یا WebP</span><input type="file" data-work="file" required accept="image/jpeg,image/png,image/webp"></span></label><label class="wide">توضیح کوتاه<textarea data-work="description" rows="2" maxlength="300"></textarea></label><button type="button" class="btn btn--ghost builder-remove">حذف نمونه‌کار</button></fieldset></template><dialog class="builder-dialog" id="builderDialog" aria-labelledby="builderDialogTitle"><button class="builder-close" type="button" aria-label="بستن">×</button><h2 id="builderDialogTitle">تأیید شمارهٔ موبایل</h2><form id="builderPhone" method="post"><p>برای پیگیری درخواست فعال‌سازی، شمارهٔ موبایل‌تان را تأیید کنید.</p><label>نام<input name="first_name" required minlength="2" maxlength="40" autocomplete="given-name"></label><label>نام خانوادگی<input name="last_name" required minlength="2" maxlength="60" autocomplete="family-name"></label><label>شمارهٔ موبایل<input name="phone" type="tel" required dir="ltr" maxlength="20" autocomplete="tel"></label><button type="submit" class="btn">ارسال کد تأیید</button></form><form id="builderOtp" method="post" hidden><label>کد پیامک‌شده<input name="code" required dir="ltr" maxlength="12" inputmode="numeric" autocomplete="one-time-code"></label><button type="submit" class="btn">تأیید و ارسال درخواست</button><button type="button" id="builderRetry" class="btn btn--ghost">ارسال دوبارهٔ کد</button></form><p id="builderDialogError" class="builder-error" role="alert"></p><p id="builderThanks" role="status" hidden>از اعتمادتان ممنونیم. درخواست فعال‌سازی صفحهٔ اختصاصی سالن برای کارشناسان ما ارسال شد. پس از بررسی برای اعلام هزینه و هماهنگی با شما تماس می‌گیریم.</p></dialog><section id="faq" class="section" aria-labelledby="h-faq" tabindex="-1"><div class="wrap"><div class="sec-head"><p class="kicker">پرسش‌های پرتکرار</p><h2 id="h-faq">پاسخ کوتاه به پرسش‌های رایج</h2></div><div class="faq"><details open><summary>آینه دقیقاً چیست؟</summary><p>یک صفحهٔ اینترنتی با نام و رنگ برند سالن شما. مشتری مدل مو، رنگ، ناخن یا مژه را روی عکس خودش امتحان می‌کند و درخواستش را با عکس به تلگرام یا بله شما می‌فرستد.</p></details><details><summary>چطور سرویس‌ها را امتحان کنم؟</summary><p>بالای صفحه، مدل و رنگ مو را روی چهرهٔ نمونه امتحان کنید. برای امتحان خدمات روی عکس خودتان، یکی از <a href="#services">دموهای خدمات</a> را باز کنید.</p></details><details><summary>بعد از ثبت درخواست چه می‌شود؟</summary><p>پس از ثبت درخواست، تیم آینه برای اعلام هزینه و هماهنگی راه‌اندازی با شما تماس می‌گیرد. ثبت درخواست شامل پرداخت یا انتشار صفحه نیست.</p></details><details><summary>هزینهٔ آینه چطور مشخص می‌شود؟</summary><p>هزینه دو بخش دارد: راه‌اندازی صفحه و اعتبار ساخت تصویر. پیش از تصمیم‌گیری، امکانات و هزینهٔ متناسب با نیاز سالن را با شما مرور می‌کنیم.</p></details><details><summary>مشتری‌های من چطور وارد می‌شوند؟</summary><p>با یک لینک. آن را در اینستاگرام، تلگرام یا هر چتی می‌گذارید. چیزی نصب نمی‌شود؛ صفحه در مرورگر گوشی باز می‌شود.</p></details><details><summary>درخواست مشتری را کجا می‌بینم؟</summary><p>در ربات تلگرام یا بله خودتان. پنل جداگانه‌ای ندارید.</p></details><details><summary>آینه نوبت می‌دهد؟</summary><p>نه. آینه فقط کمک می‌کند مشتری روشن بگوید چه می‌خواهد. نوبت، زمان و هزینه مثل همیشه دست خود شماست.</p></details><details><summary>نتیجهٔ شبیه‌سازی دقیق است؟</summary><p>نه، تقریبی است. مثل یک عکس مرجع واضح به گفتگو کمک می‌کند و نتیجهٔ نهایی را تضمین نمی‌کند.</p></details><details><summary>ناخن و مژه هم دارید؟</summary><p>بله. در صفحهٔ سالن بین مو، ناخن و مژه جابه‌جا می‌شوند و هر کدام عکس و انتخاب‌های خودش را دارد.</p></details><details><summary>شبیه‌سازی برای همهٔ سالن‌ها روشن است؟</summary><p>هر سالن خودش تصمیم می‌گیرد. اگر خاموش باشد، مشتری باز هم مدل و رنگ را انتخاب می‌کند و درخواستش را می‌فرستد.</p></details></div><p class="faq-next"><a class="btn btn--lg" href="#salon-example">ساخت پیش‌نمایش سالن من</a></p></div></section></main><a class="sticky-cta" id="stickyCta" href="#salon-example" hidden><span>ساخت پیش‌نمایش سالن من</span><span class="arrow" aria-hidden="true">←</span></a><footer class="site-footer"><div class="foot"><a class="brand" href="#intro"><span class="brand-symbol"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M18 52V27a14 14 0 0 1 28 0v25H18Z" stroke="currentColor" stroke-width="2.5"/><path d="M13 51H8V32a10 10 0 0 1 6-9M51 51h5V32a10 10 0 0 0-6-9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="m25 43 14-18M26 32l8-10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".65"/><path d="M32 5v4M30 7h4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></span><span class="brand-name">آینه<small>AYNEH</small></span></a><ul aria-label="پیوندهای پایین صفحه"><li><a href="#studio">چطور کار می‌کند</a></li><li><a href="#how">مزایا</a></li><li><a href="#services">خدمات</a></li><li><a href="#salon-example">استودیوی سالن</a></li><li><a href="#faq">پرسش‌ها</a></li><li><a href="/admin">ورود مدیر</a></li></ul></div><p class="legal"><span>آینه — صفحهٔ اختصاصی سالن برای امتحان مدل و رنگ مو، ناخن و مژه روی عکس مشتری.</span><span>© ۱۴۰۵ آینه</span></p></footer><script>
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
</script><script>window.__AYN_ASSET_VERSION="990d3abd8e27";window.__AYN_LOOKS=[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];</script><script>
(()=>{
const KINDS=['cta_click','demo_open','wizard_start','wizard_step_complete','wizard_skip',
'preview_ready','activation_available','otp_sent','otp_verified','lead_submit','lead_submit_failed'];
let session='';
try{
session=sessionStorage.getItem('ayneh_funnel')||'';
if(!session){
session=crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(36).slice(2);
sessionStorage.setItem('ayneh_funnel',session);
}
}catch{session=''}
const q=new URLSearchParams(location.search),p=k=>(q.get(k)||'').slice(0,80);
let ref='';try{ref=new URL(document.referrer).origin}catch{}
const attribution={utm_source:p('utm_source'),utm_medium:p('utm_medium'),
utm_campaign:p('utm_campaign'),utm_content:p('utm_content'),utm_term:p('utm_term'),
referrer:ref.slice(0,120),landing:location.pathname.slice(0,60),host:location.hostname.slice(0,80)};
const send=(kind,extra)=>{
if(!KINDS.includes(kind))return;
const e=extra&&typeof extra==='object'?extra:{};
const meta=JSON.stringify(e).slice(0,300);
const step=Number.isInteger(e.step)&&e.step>=0&&e.step<=20?e.step:null;
const body=JSON.stringify({session,kind,step,meta,attribution});
try{fetch('/api/event',{method:'POST',headers:{'Content-Type':'application/json'},body,keepalive:true}).catch(()=>{})}catch{}
};
window.__AYN_TRACK=send;
window.__AYN_ATTR=()=>({...attribution});
document.addEventListener('click',e=>{
const t=e.target instanceof Element?e.target:e.target?.parentElement;if(!t)return;
const a=t.closest('a,button');if(!a)return;
const href=a.getAttribute('href')||'';
const label=(a.textContent||'').trim().replace(/\\s+/g,' ').slice(0,60);
if(href.startsWith('/s/')||/ayneh-salon\\.site\\/s\\//.test(href)){
send('demo_open',{label,href:href.slice(0,120)});return
}
if(href==='#salon-example'||a.id==='builderActivate'||
a.classList.contains('sticky-cta')||a.id==='leadFallbackToggle'){
send('cta_click',{label,href:href.slice(0,60),
where:a.classList.contains('sticky-cta')?'sticky':(a.closest('header')?'header':'page')});
}
},{capture:true,passive:true});
})();
</script><script>
(()=>{
const db=()=>new Promise((resolve,reject)=>{const r=indexedDB.open('ayneh-photo-handoff',1);r.onupgradeneeded=()=>r.result.createObjectStore('drafts');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
async function transaction(mode,fn){const d=await db();return new Promise((resolve,reject)=>{const t=d.transaction('drafts',mode),r=fn(t.objectStore('drafts'));let result;r.onsuccess=()=>{result=r.result};t.oncomplete=()=>{d.close();resolve(result)};t.onerror=t.onabort=()=>{d.close();reject(t.error)}})}
window.__AYN_DRAFT={put:entry=>transaction('readwrite',s=>s.put({...entry,created:Date.now()},'current')),async take(){const e=await transaction('readwrite',s=>{const r=s.get('current');s.delete('current');return r});return e&&Date.now()-e.created<15*60*1000?e:null}};
})();
</script><script>
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
</script><script>
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
</script><script>window.__AYN_BASE='/landing/';</script><script>
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
const FX=.4985,FY=.44;
function layout(){
const W=mirror.clientWidth,H=mirror.clientHeight;if(!W||!H)return;
const s=Math.max(W/1376,H/768)*(mobile.matches?1.5:1),pw=1376*s,ph=768*s;
const x=Math.min(0,Math.max(W-pw,W/2-FX*pw)),y=Math.min(0,Math.max(H-ph,H*.5-FY*ph));
Object.assign(plate.style,{width:pw+'px',height:ph+'px',left:x+'px',top:y+'px'});
plate.style.setProperty('--scene-scale',s.toFixed(3));
dock.style.setProperty('--u',mobile.matches?'1':Math.max(.62,Math.min(1.35,s/.84)).toFixed(3));
if(mobile.matches){let lab=$('heroPlayground');if(!lab){lab=document.createElement('div');lab.id='heroPlayground';lab.className='hero-playground';studio.before(lab)}lab.append(studio,palette,dock);dock.classList.add('mobile');palette.classList.add('mobile')}
else if(dock.parentElement!==plate){const lab=$('heroPlayground');if(lab){lab.before(studio);lab.remove()}plate.append(dock);mirror.append(palette);dock.classList.remove('mobile');palette.classList.remove('mobile')}
if(!mobile.matches)plate.style.setProperty('--dock-limit',Math.max(0,H-y-dock.offsetHeight-16)+'px');
syncArrows();
}
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
[[cards,$('track')],[dItems.filter(Boolean),$('dockTrack')],[sws,$('colList')]].forEach(([list,box])=>box.addEventListener('keydown',e=>{
const i=list.indexOf(document.activeElement);if(i<0)return;
const k=e.key;
const dir=k==='ArrowDown'||k==='ArrowLeft'?1:k==='ArrowUp'||k==='ArrowRight'?-1:0;
if(!dir)return;e.preventDefault();const n=list[(i+dir+list.length)%list.length];n.focus({preventScroll:true});n.click();n.scrollIntoView({inline:'center',block:'nearest'})}));
const rail=$('styles'),more=$('more');rail.inert=true;
function setRail(open){
rail.inert=!open;rail.classList.toggle('open',open);rail.setAttribute('aria-hidden',String(!open));more.setAttribute('aria-expanded',String(open));dock.classList.toggle('away',open);
if(open){setTimeout(()=>{(cards[st.style??0]).scrollIntoView({inline:'center',block:'nearest'});syncArrows();cards[st.style??0].focus({preventScroll:true})},60)}
else more.focus({preventScroll:true})}
more.addEventListener('click',()=>setRail(true));$('closeRail').addEventListener('click',()=>setRail(false));
addEventListener('keydown',e=>{if(e.key==='Escape'&&rail.classList.contains('open'))setRail(false)});
const img=$('roomImg'),img2=$('roomImg2'),cv=$('hairCanvas'),ctx=cv.getContext('2d');
let px=null,rafId=0,lookTok=0;const preps={};
const imagePromises=new Map();const loadImg=src=>{if(!imagePromises.has(src))imagePromises.set(src,new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>{imagePromises.delete(src);rej(new Error("Image unavailable"))};i.src=src}));return imagePromises.get(src)};
const lookAssets=key=>key==='base'?['hero','hair-mask']:['look-'+key,'mask-'+key];
let identitySource=null;
function canonical(){
if(identitySource)return identitySource;
identitySource=Promise.all([loadImg(SRC('hero')),loadImg(SRC('hair-mask','png'))]).then(([photo,mask])=>{
const c=document.createElement('canvas');c.width=1376;c.height=768;const g=c.getContext('2d',{willReadFrequently:true});
g.drawImage(photo,0,0);const original=g.getImageData(0,0,1376,768).data;
g.clearRect(0,0,1376,768);g.drawImage(mask,0,0);
g.fillStyle='#fff';
const removal=[[[622,334],[653,334],[666,419],[651,441],[620,433],[618,389]],[[712,331],[748,331],[762,430],[729,441],[710,412],[705,368]],[[520,333],[582,333],[582,451],[515,450]],[[785,333],[863,333],[863,452],[785,452]]];
removal.forEach(points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fill()});
g.fillRect(610,240,148,106);g.fillRect(508,255,76,91);g.fillRect(786,255,75,91);
g.fillRect(606,346,154,125);g.fillRect(508,346,76,108);g.fillRect(786,346,75,108);
const oldHair=g.getImageData(0,0,1376,768).data;
g.clearRect(0,0,1376,768);g.fillStyle='#fff';
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
const renderError=()=>{$('demoCaption').textContent='تصویر بارگذاری نشد. مدل یا رنگ را دوباره انتخاب کنید.';stage.dataset.renderState='error'};
async function setLook(key){
const my=++lookTok;
stage.dataset.renderState='loading';
const p=await prepare(key);if(my!==lookTok)return false;
if(!p){renderError();return false}
transitionAnimation?.cancel();cancelAnimationFrame(rafId);
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
const mark=(list,idx)=>list.forEach((button,i)=>{
if(!button)return;
button.setAttribute('aria-checked',String(i===idx));
button.tabIndex=i===Math.max(0,idx)?0:-1;
});
async function pickColor(i){
showFront();revealPortrait();
const prev=st.color!=null?COLORS[st.color]:null;st.color=i;mark(sws,i);summary();
if(!px){const p=await prepare(st.look);if(!p){renderError();return}if(!px)px=p}
if(st.color===i){paintColor(prev,COLORS[i]);stage.dataset.color=String(i)}
}
async function pickStyle(i){
showFront();
st.style=i;mark(cards,i);mark(dItems,i);
$('refImg').src=cards[i].querySelector('img').src;$('refName').textContent=STYLES[i];$('ref').inert=false;$('ref').classList.add('on');
if(READY.has(i+1)){
$('refNote').textContent='پیش‌نمایش این مدل روی چهرهٔ نمونه';
await setLook(i===0?'base':'s'+n2(i));
}else{
$('refNote').textContent='عکس مرجع؛ برای دیدن این مدل روی چهره‌تان، با عکس خودتان امتحان کنید.';
}
summary();
}
function summary(){
const parts=[];if(st.style!=null)parts.push(STYLES[st.style]);if(st.color!=null)parts.push(COLORS[st.color].name);
$('resultText').textContent=parts.join(' · ');$('result').classList.toggle('on',parts.length>0);
const d={style:st.style!=null?STYLES[st.style]:null,styleIdx:st.style,color:st.color!=null?COLORS[st.color].name:null};window.__AYN_SEL=d;dispatchEvent(new CustomEvent('ayneh:selection',{detail:d}))}
const hand=$('demoHand'),file=$('demoFile'),caption=$('demoCaption'),invite=$('mirrorInvite');
let demoController=null,demonstrating=false,played=false;
let inviteTimer=0;
function showFront(){clearTimeout(inviteTimer);stage.classList.remove('mirror-flipped');invite.inert=true;}
function returnLater(){clearTimeout(inviteTimer);inviteTimer=setTimeout(()=>{if(invite.matches(':hover,:focus-within')){returnLater();return}showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'},6500)}
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
st.color=null;st.style=null;mark(sws,-1);mark(cards,-1);mark(dItems,-1);$('ref').inert=true;$('ref').classList.remove('on');summary();
try{
const loaded=await setLook('base');if(signal.aborted)return;if(!loaded){endDemo();return}
caption.textContent='۱ · عکس چهره یا دستتان را بارگذاری کنید';
await delay(450,signal);
const m=mirror.getBoundingClientRect(),r=stage.getBoundingClientRect();
const dest={left:m.left-r.left+m.width*.48,top:m.top-r.top+m.height*.4};
const begin={left:Math.max(20,dest.left-130),top:Math.max(35,dest.top-160)};
file.style.left=begin.left+'px';file.style.top=begin.top+'px';file.classList.add('visible');
hand.style.left=(begin.left+60)+'px';hand.style.top=(begin.top+65)+'px';hand.classList.add('visible');
const px=p=>({left:p.left+'px',top:p.top+'px'});
file.animate([px(begin),px(dest)],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
hand.animate([{left:(begin.left+60)+'px',top:(begin.top+65)+'px'},{left:(dest.left+60)+'px',top:(dest.top+65)+'px'}],{duration:1200,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});
await delay(1250,signal);file.classList.remove('visible');file.getAnimations().forEach(a=>a.cancel());hand.getAnimations().forEach(a=>a.cancel());
hand.style.left=(dest.left+60)+'px';hand.style.top=(dest.top+65)+'px';revealPortrait();
await delay(1000,signal);
const demoStyle=dItems[5]?5:0;
caption.textContent='۲ · مدل دلخواهتان را روی چهرهٔ خود ببینید';
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
stage.classList.add('mirror-flipped');invite.inert=false;returnLater();
}catch(error){if(error.name!=='AbortError')endDemo('مدل و رنگ دلخواهتان را روی آینه انتخاب کنید.')}
}
$('skipDemo').addEventListener('click',()=>endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.'));
$('replayDemo').addEventListener('click',walkthrough);
$('backToMirror').addEventListener('click',()=>{showFront();caption.textContent='مدل و رنگ دلخواهتان را انتخاب کنید.'});
const human=e=>{if(!e.isTrusted||e.target.closest('.demo-controls'))return;if(demonstrating)endDemo('حالا خودتان مدل و رنگ را انتخاب کنید.');if(e.target.closest('#dock,#colors,#styles')){revealPortrait();showFront()}};
film.addEventListener('pointerdown',human,true);film.addEventListener('keydown',human,true);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')});
const loader=$('siteLoader');
const essential=Promise.allSettled([prepare('base'),prepare('s06')]);
loader.hidden=false;
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
const r=film.getBoundingClientRect();if(!ready||played||r.bottom<innerHeight*.5||r.top>innerHeight){endDemo();return}
walkthrough();
});
new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&demonstrating)endDemo('پخش دوبارهٔ نمایش را انتخاب کنید.')},{threshold:0}).observe(studio);
film.addEventListener('pointerdown',()=>{played=true},{once:true});
const hdr=document.querySelector('.site-header');let tick=false,geo=null,hh=76;
function measureGeo(){
hh=hdr?hdr.offsetHeight:76;
document.documentElement.style.setProperty('--hh',hh+'px');
geo={span:film.offsetHeight-stage.offsetHeight,top:film.getBoundingClientRect().top+window.scrollY};
}
function frameUpdate(){tick=false;
if(!geo)measureGeo();
if(mobile.matches){stage.style.setProperty('--p','0');stage.style.setProperty('--z','1');return}
if(geo.span<=0)return;
const p=cl((hh-(geo.top-window.scrollY))/geo.span,0,1);
stage.style.setProperty('--p',p.toFixed(4));stage.style.setProperty('--z',(1+p*.08).toFixed(4));
$('fade').style.opacity=sm(.6,1,p).toFixed(3)}
const req=()=>{if(!tick){tick=true;requestAnimationFrame(frameUpdate)}};
addEventListener('scroll',req,{passive:true});
addEventListener('resize',()=>{measureGeo();req()},{passive:true});
addEventListener('load',()=>{measureGeo();req()});
if(hdr&&window.ResizeObserver)new ResizeObserver(()=>{measureGeo();req()}).observe(hdr);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measureGeo();req()});
new ResizeObserver(()=>{layout();measureGeo();req()}).observe(mirror);
layout();measureGeo();frameUpdate();
})();
</script><script>
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
</script><script>
(()=>{
const links=[...document.querySelectorAll('[data-try]')];if(!links.length)return;
const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';input.hidden=true;input.setAttribute('aria-label','انتخاب تصویر خودم');document.body.append(input);let line='hair',opener;
const dialog=document.createElement('dialog');dialog.className='personal-try';dialog.setAttribute('aria-label','ساخت تصویر خودم');dialog.innerHTML='<div class="personal-head"><strong>این بار، تصویر خودتان.</strong><button type="button" aria-label="بستن تجربهٔ تصویر من">×</button></div><iframe title="عکس من، انتخاب من" allow="camera"></iframe>';document.body.append(dialog);const frame=dialog.querySelector('iframe');dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.documentElement.classList.remove('try-open');opener?.focus({preventScroll:true})});
links.forEach(a=>{a.addEventListener('click',e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();line=a.dataset.try;opener=a;input.value='';input.click()})});
input.addEventListener('change',async()=>{const file=input.files[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>25*1024*1024){alert('یک تصویر JPG، PNG یا WebP با حجم کمتر از ۲۵ مگابایت انتخاب کنید.');return}try{const selection={...(window.__AYN_SEL||{})};await window.__AYN_DRAFT.put({file,line,selection});const q=new URLSearchParams({l:line,draft:'1',embed:'1'});if(line==='hair'){q.set('s',selection.styleIdx??0);if(selection.color)q.set('c',selection.color)}frame.src='/s/demo?'+q;dialog.showModal();document.documentElement.classList.add('try-open')}catch(_){alert('باز کردن تصویر ممکن نشد. دوباره انتخاب کنید.')}});
})();
</script><script>
(()=>{
const bar=document.getElementById('stickyCta');
const hero=document.getElementById('intro');
const inquiry=document.getElementById('start');
const player=document.querySelector('.film-player');
if(!bar||!hero||!inquiry)return;
const mobile=matchMedia('(max-width:900px)');
let queued=false,geo=null;
const twins=[...document.querySelectorAll('main a[href="#salon-example"]')];
const docTop=el=>el.getBoundingClientRect().top+window.scrollY;
function measure(){
const ht=docTop(hero),ft=docTop(inquiry),pt=player?docTop(player):0;
geo={heroBottom:ht+hero.offsetHeight,formTop:ft,
filmTop:player?pt:Infinity,filmBottom:player?pt+player.offsetHeight:-Infinity,
twins:twins.map(a=>{const t=docTop(a);return {t,b:t+a.offsetHeight}})};
}
function sync(){
queued=false;if(!geo)measure();
const y=window.scrollY,vh=window.innerHeight;
const afterHero=geo.heroBottom-y<80;
const beforeForm=geo.formTop-y>=vh;
const overFilm=geo.filmTop-y<vh&&geo.filmBottom-y>0;
const twin=geo.twins.some(r=>r.b-y>0&&r.t-y<vh);
bar.hidden=!(mobile.matches&&afterHero&&beforeForm&&!overFilm&&!twin&&!document.querySelector('dialog[open]'));
}
function schedule(){if(!queued){queued=true;requestAnimationFrame(sync)}}
addEventListener('scroll',schedule,{passive:true});
addEventListener('resize',()=>{measure();schedule()},{passive:true});
addEventListener('load',()=>{measure();schedule()});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{measure();schedule()});
document.addEventListener('focusin',schedule);
document.addEventListener('focusout',schedule);
measure();sync();
})();
</script><script>
(()=>{
const v=document.querySelector('.invite-video');if(!v)return;
const still=matchMedia('(prefers-reduced-motion:reduce)').matches||navigator.connection?.saveData;
if(still||!('IntersectionObserver' in window))return;
let loaded=false;
new IntersectionObserver(es=>es.forEach(e=>{
if(e.isIntersecting){if(!loaded){v.preload='auto';v.load();loaded=true}v.play().catch(()=>{})}
else if(loaded)v.pause();
}),{rootMargin:'200px 0px'}).observe(v);
document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause()});
})();
</script><script>
(()=>{
const still=matchMedia('(prefers-reduced-motion:reduce)').matches;
const $=s=>document.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>v<a?a:v>b?b:v;
const subP=(p,s,e)=>clamp((p-s)/((e-s)||1),0,1);
const actions='button,.btn,.sticky-cta,.menu-toggle,.nav-btn,.close,.demo-controls button,summary,[role="button"]';
const layer=el=>{let g=el.querySelector(':scope>.glass-layer');if(!g){g=document.createElement('span');g.className='glass-layer';g.setAttribute('aria-hidden','true');el.prepend(g)}return g};
const dress=()=>$$(actions).forEach(layer);dress();
new MutationObserver(()=>{clearTimeout(dress.t);dress.t=setTimeout(dress,120)}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('pointerdown',e=>{
const el=e.target.closest(actions);if(!el||el.disabled||still)return;
const g=layer(el),r=el.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
const size=Math.hypot(Math.max(x,r.width-x),Math.max(y,r.height-y))*2;
for(let k=0;k<3;k++){
const ring=document.createElement('i');ring.className='ripple';
ring.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;animation-delay:'+(k*140)+'ms';
g.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true});
}
g.classList.remove('flash');void g.offsetWidth;g.classList.add('flash');
},{passive:true});
document.addEventListener('click',e=>{
if(e.detail!==0)return;
const el=e.target.closest(actions);if(!el||el.disabled||still)return;
const g=layer(el),r=el.getBoundingClientRect(),x=r.width/2,y=r.height/2,size=Math.hypot(x,y)*2;
for(let k=0;k<3;k++){const ring=document.createElement('i');ring.className='ripple';
ring.style.cssText='left:'+x+'px;top:'+y+'px;width:'+size+'px;height:'+size+'px;animation-delay:'+(k*140)+'ms';
g.appendChild(ring);ring.addEventListener('animationend',()=>ring.remove(),{once:true})}
g.classList.remove('flash');void g.offsetWidth;g.classList.add('flash');
},{passive:true});
if(still)return;
const carvedSelector='.svc,.benefit,.builder-steps>li,.salon-invite-card,.film-screen,.faq>details,.builder-form,.builder-preview';
if(matchMedia('(hover:hover)').matches){
let activeCard=null,raf=0,px=0,py=0;
document.addEventListener('pointermove',e=>{
const card=e.target.closest(carvedSelector);
if(activeCard&&activeCard!==card){activeCard.style.removeProperty('--rx');activeCard.style.removeProperty('--ry');activeCard=null}
if(!card)return;
activeCard=card;px=e.clientX;py=e.clientY;
if(!raf)raf=requestAnimationFrame(()=>{
raf=0;if(!activeCard)return;
const r=activeCard.getBoundingClientRect();if(!r.width||!r.height)return;
const x=px-r.left,y=py-r.top,nx=x/r.width-.5,ny=y/r.height-.5;
activeCard.style.setProperty('--mx',x.toFixed(0)+'px');
activeCard.style.setProperty('--my',y.toFixed(0)+'px');
if(activeCard.matches('.svc,.benefit,.builder-steps>li')){
activeCard.style.setProperty('--rx',(-ny*5).toFixed(2)+'deg');
activeCard.style.setProperty('--ry',(nx*5).toFixed(2)+'deg');
}
});
},{passive:true});
}
const goldWords=new Set(['عکس','خودش','اختصاصی','سالن','شماست','همه','یک','صفحه','چشم','مشتری','ببینید','رایج']);
function prepareSlam(el){
if(!el)return()=>{};
const text=el.textContent.trim();
el.setAttribute('aria-label',text);
el.classList.add('cine-slam');
el.innerHTML=text.split(/\\s+/).map(w=>{
const clean=w.replace(/[،؛.:؟!]/g,'');
return '<span class="'+(goldWords.has(clean)?'cine-word cine-word--gold':'cine-word')+'" aria-hidden="true">'+w+'</span>';
}).join(' ');
const spans=$$('.cine-word',el),n=spans.length||1;
return p=>{for(let i=0;i<n;i++){const st=(i/n)*0.56;spans[i].style.setProperty('--wp',subP(p,st,st+0.44).toFixed(3))}};
}
function prepareType(el){
if(!el)return()=>{};
const text=el.textContent.trim();
el.classList.add('type-wrap');
el.innerHTML='<span class="type-sr">'+text+'</span><span class="type-reserve" aria-hidden="true">'+text+'</span><span class="type-live" aria-hidden="true"></span>';
const live=el.querySelector('.type-live'),len=text.length;
let last=-1;
return p=>{
const c=Math.round(clamp(p,0,1)*len);
if(c!==last){last=c;live.textContent=text.slice(0,c)}
live.classList.toggle('is-typing',p>0.02&&p<0.98);
};
}
const tracks=[];
const addTrack=(initP,targetFn,applyFn)=>{const t={cur:initP,target:targetFn,apply:applyFn};t.apply(initP);tracks.push(t)};
let measureV=0,maxScroll=1,heroH=0;
const tops=new WeakMap();
const docTop=el=>{let c=tops.get(el);if(!c||c.v!==measureV){const r=el.getBoundingClientRect();c={v:measureV,top:r.top+window.scrollY};tops.set(el,c)}return c.top};
const measure=()=>{measureV++;maxScroll=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);heroH=0};
addEventListener('resize',measure,{passive:true});addEventListener('load',measure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
measure();
const rectP=(el,enterVh=0.92,fullVh=0.44)=>{
const vh=window.innerHeight||800,s=vh*enterVh,e=vh*fullVh;
return clamp((s-(docTop(el)-window.scrollY))/((s-e)||1),0,1);
};
const heroCopy=$('#copy'),heroH1=$('#h1'),heroEyebrow=$('#intro .eyebrow');
if(heroCopy){
const slamHero=prepareSlam(heroH1),typeHero=prepareType(heroEyebrow);
let boot=0;const t0=performance.now();
const bootTick=now=>{boot=clamp((now-t0)/900,0,1);if(boot<1)requestAnimationFrame(bootTick);scheduleScrub()};
requestAnimationFrame(bootTick);
addTrack(0,()=>{
const vh=window.innerHeight||800;if(!heroH)heroH=heroCopy.getBoundingClientRect().height;
const top=docTop(heroCopy)-window.scrollY;
const sf=top>=-8?1:clamp((top+heroH-vh*0.12)/Math.max(120,Math.min(heroH,vh*0.5)),0,1);
return Math.min(boot,sf);
},p=>{
heroCopy.style.setProperty('--kp',subP(p,0,0.45).toFixed(3));
typeHero(subP(p,0.02,0.62));
slamHero(subP(p,0.08,0.82));
heroCopy.style.setProperty('--lp',subP(p,0.32,0.88).toFixed(3));
heroCopy.style.setProperty('--cp',subP(p,0.46,0.96).toFixed(3));
heroCopy.style.setProperty('--fp',subP(p,0.58,1).toFixed(3));
});
}
$$('.sec-head').forEach(head=>{
head.dataset.stage='head';
const slamH2=prepareSlam(head.querySelector('h2')),typeKicker=prepareType(head.querySelector('.kicker'));
addTrack(0,()=>rectP(head,0.92,0.48),p=>{
head.style.setProperty('--hp',p.toFixed(3));
head.style.setProperty('--kp',subP(p,0,0.45).toFixed(3));
typeKicker(subP(p,0.04,0.68));
slamH2(subP(p,0.12,0.88));
head.style.setProperty('--sp',subP(p,0.46,1).toFixed(3));
});
});
const how=$('#how');
if(how){
how.dataset.cine='glint';
const grid=$('.benefits-five',how),cards=$$('.benefits-five>.benefit',how);
cards.forEach((c,i)=>c.style.setProperty('--i',i));
cards.forEach((card,i)=>addTrack(0,()=>{
const row=grid?rectP(grid,0.88,0.28):1;
return window.innerWidth<=580?rectP(card,0.92,0.48):subP(row,i*0.14,i*0.14+0.44);
},p=>{
card.style.setProperty('--p',p.toFixed(3));
card.classList.toggle('scrub-done',p>0.99);
}));
}
const invite=$('.salon-invite');
if(invite){
invite.dataset.cine='curtain';
const card=$('.salon-invite-card',invite),slamInv=prepareSlam($('#salon-invite-title',invite)),typeInv=prepareType($('.journey-kicker',invite)),copyEls=$$('.salon-invite-copy>*:not(h2)',invite);
if(card)addTrack(0,()=>rectP(card,0.92,0.34),p=>{
invite.style.setProperty('--p',p.toFixed(3));
invite.style.setProperty('--kp',subP(p,0.1,0.5).toFixed(3));
typeInv(subP(p,0.14,0.66));
slamInv(subP(p,0.20,0.86));
copyEls.forEach((el,i)=>{const s=0.26+i*0.12;el.style.setProperty('--cp',subP(p,s,s+0.46).toFixed(3))});
});
}
const services=$('#services');
if(services){
services.dataset.cine='fan';
const grid=$('.cards3',services),cards=$$('.cards3>.svc',services);
cards.forEach((c,i)=>c.style.setProperty('--i',i));
cards.forEach((card,i)=>addTrack(0,()=>{
const row=grid?rectP(grid,0.90,0.32):1;
return window.innerWidth<=1100?rectP(card,0.92,0.46):subP(row,i*0.12,i*0.12+0.56);
},p=>{
card.style.setProperty('--p',p.toFixed(3));
card.classList.toggle('scrub-done',p>0.99);
}));
}
const transform=$('#transform');
if(transform){
transform.dataset.cine='lights';
const player=$('.film-player',transform),tabs=$$('.service-timeline>button',transform),typeFilm=prepareType($('.film-caption>span',transform));
if(player){
addTrack(0,()=>rectP(player,0.92,0.36),p=>{
transform.style.setProperty('--p',p.toFixed(3));
typeFilm(subP(p,0.36,0.92));
});
tabs.forEach((btn,i)=>addTrack(0,()=>subP(rectP(player,0.92,0.36),i*0.14,i*0.14+0.56),
p=>btn.style.setProperty('--tp',p.toFixed(3))));
}
}
const builder=$('#salon-example');
if(builder){
builder.dataset.cine='desk';
const stepsList=$('.builder-steps',builder),steps=$$('.builder-steps>li',builder);
steps.forEach((li,i)=>li.style.setProperty('--i',i));
steps.forEach((li,i)=>addTrack(0,()=>{
const row=stepsList?rectP(stepsList,0.90,0.42):1;
return window.innerWidth<=850?rectP(li,0.92,0.48):subP(row,i*0.12,i*0.12+0.56);
},p=>{
li.style.setProperty('--p',p.toFixed(3));
li.classList.toggle('scrub-done',p>0.99);
}));
const form=$('.builder-form',builder),preview=$('.builder-preview',builder);
if(form||preview)addTrack(0,()=>rectP(builder,0.98,0.72),p=>{
if(form)form.style.setProperty('--p',p.toFixed(3));
if(preview)preview.style.setProperty('--p',p.toFixed(3));
});
}
const faq=$('#faq');
if(faq){
faq.dataset.cine='focus';
$$('.faq>details,.faq-next',faq).forEach((item,i)=>{
item.style.setProperty('--dir',i%2===0?1:-1);
addTrack(0,()=>rectP(item,0.93,0.52),p=>item.style.setProperty('--p',p.toFixed(3)));
});
}
const footer=$('.site-footer');
if(footer){
footer.dataset.cine='draw';
const links=$$('.foot ul li,.legal',footer);
$$('.site-footer .brand-symbol path').forEach(p=>{try{p.style.setProperty('--len',Math.ceil(p.getTotalLength()))}catch{}});
addTrack(0,()=>{
const base=rectP(footer,0.98,0.72);
return Math.max(base,clamp((window.scrollY-(maxScroll-120))/120,0,1));
},p=>{
footer.style.setProperty('--p',p.toFixed(3));
links.forEach((el,i)=>{const s=0.2+i*0.1;el.style.setProperty('--lp',subP(p,s,Math.min(1,s+0.5)).toFixed(3))});
});
}
let rafId=0;
function tick(){
rafId=0;
for(let i=0;i<tracks.length;i++){
const t=tracks[i],tgt=Math.round(t.target()*80)/80;
if(tgt!==t.cur){t.cur=tgt;t.apply(tgt)}
}
}
function scheduleScrub(){if(!rafId)rafId=requestAnimationFrame(tick)}
window.addEventListener('scroll',scheduleScrub,{passive:true});
window.addEventListener('resize',scheduleScrub,{passive:true});
scheduleScrub();
})();
</script><script>
(()=>{
const still=matchMedia('(prefers-reduced-motion:reduce)').matches,header=document.querySelector('.site-header');
const bar=document.createElement('div');bar.className='scroll-line';bar.setAttribute('aria-hidden','true');document.body.prepend(bar);
const links=[...document.querySelectorAll('.site-header .nav a[href^="#"]')],secs=links.map(a=>document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
let busy=false,docTops=[],docH=1,tight=false;
const measure=()=>{docTops=secs.map(s=>s.getBoundingClientRect().top+scrollY);docH=Math.max(1,document.documentElement.scrollHeight-innerHeight)};
addEventListener('resize',measure,{passive:true});addEventListener('load',measure);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(measure);
measure();
function frame(){
busy=false;
const y=scrollY;
bar.style.transform='scaleX('+Math.min(1,y/docH)+')';
const t=y>80;if(t!==tight){tight=t;header&&header.classList.toggle('is-tight',t)}
let cur=null;
for(let k=0;k<secs.length;k++){if(docTops[k]-y<innerHeight*.42)cur=secs[k].id}
links.forEach(a=>{if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')});
}
const ask=()=>{if(!busy){busy=true;requestAnimationFrame(frame)}};
addEventListener('scroll',ask,{passive:true});
addEventListener('resize',ask);
frame();
if(still)return;
})();
</script><script>
(()=>{
const $=id=>document.getElementById(id);
const form=$('start'),live=$('builderLive');
if(!form||!live)return;
const loading=$('builderLoading'),activate=$('builderActivate'),hint=$('builderHint');
const dialog=$('builderDialog'),phone=$('builderPhone'),otp=$('builderOtp'),thanks=$('builderThanks'),dialogError=$('builderDialogError');
const availability=$('builderAvailability');
const fallback=$('leadFallback'),fallbackToggle=$('leadFallbackToggle'),
fallbackBody=$('leadFallbackBody'),fallbackLead=$('leadFallbackLead');
const add=$('builderAdd'),works=$('builderWorks'),build=$('builderBuild');
const profileFields=['bio','manager','address','hours','phone','instagram','website','map','telegram'];
const brandFields=['logo','cover','portrait'];
let draft,otpBody,busy=false,submitted=false,dirty=false,canActivate=false,checkingAvailability=false,availabilityKnown=false;
let availabilityState=null,lastWizardName='',wizardReady=false;
function setFallback(primary){
if(!fallback||availabilityState===primary)return;
availabilityState=primary;
fallback.hidden=false;
fallback.classList.toggle('is-primary',primary);
fallback.classList.toggle('is-secondary',!primary);
fallbackLead.hidden=primary;
fallbackLead.textContent='همچنین می‌توانید، بدون تأیید پیامکی:';
fallbackToggle.hidden=primary;
fallbackToggle.setAttribute('aria-expanded',String(primary));
fallbackBody.hidden=!primary;
}
if(fallbackToggle)fallbackToggle.addEventListener('click',()=>{
const open=fallbackBody.hidden;
fallbackBody.hidden=!open;
fallbackToggle.setAttribute('aria-expanded',String(open));
fallbackLead.hidden=open;
if(open){
fallbackLead.hidden=true;
const name=form.elements.name?.value.trim();
if(name&&!$('lf-salon').value)$('lf-salon').value=name;
$('lf-salon').focus({preventScroll:true});
}
});
const objectURLs=new Map();
const imageTypes=['image/jpeg','image/png','image/webp'];
const validPhoto=file=>imageTypes.includes(file.type)&&file.size>0&&file.size<=12_000_000;
const photoHelp='عکس JPG، PNG یا WebP با حجم حداکثر ۱۲ مگابایت انتخاب کنید.';
const api=async(path,body,signal)=>{
const options=body===undefined?{}:{method:'POST',...(body instanceof FormData?{body}:{headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})};
const response=await fetch(path,{...options,signal});
const data=await response.json().catch(()=>({}));
if(!response.ok||!data.ok)throw new Error(data.error||'ارتباط با آینه برقرار نشد. دوباره تلاش کنید.');
return data;
};
function showAvailability(available){
window.__AYN_TRACK?.('activation_available',{available:!!available});
canActivate=available;
availability.textContent=available
?'پیش‌نمایش رایگان است. برای درخواست راه‌اندازی، تأیید شمارهٔ موبایل لازم است.'
:'پیش‌نمایش رایگان است. برای درخواست راه‌اندازی، شماره‌تان را همین‌جا بگذارید؛ بدون پرداخت و بدون انتشار صفحه، برای هماهنگی با شما تماس می‌گیریم.';
activate.hidden=!available||!wizardReady;
setFallback(!available);
if(wizardReady&&!submitted)hint.textContent=available
?'پیش‌نمایش آماده است. اگر مایلید، درخواست راه‌اندازی را ثبت کنید.'
:'پیش‌نمایش آماده است. درخواست‌تان را از فرم زیر بفرستید.';
}
async function checkAvailability(){
if(checkingAvailability)return;
checkingAvailability=true;
const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
try{await api('/api/activation',undefined,controller.signal);showAvailability(true)}
catch{showAvailability(false)}
finally{clearTimeout(timer);checkingAvailability=false;availabilityKnown=true}
}
const serviceNames={hair:'مدل مو',color:'رنگ مو',nails:'ناخن',lashes:'مژه'};
const linkNames={instagram:'اینستاگرام',website:'وب‌سایت',map:'نقشه',telegram:'تلگرام'};
function urlFor(file){
if(!file||!validPhoto(file))return '';
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
const lfSalon=$('lf-salon');
if(lfSalon&&(!lfSalon.value||lfSalon.value===lastWizardName))lfSalon.value=get('name')||'';
lastWizardName=get('name')||'';
$('builderAddress').textContent='ayneh-salon.site/s/'+slug;
live.style.setProperty('--salon-brand',get('brand'));
$('builderBrandHex').textContent=get('brand').toUpperCase();
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
const kept=new Set();
for(const input of form.querySelectorAll('input[type=file]')){
const file=input.files[0];
if(file)kept.add(file);
const control=input.closest('.upload-control');
const invalid=!!file&&!validPhoto(file);
input.setCustomValidity(invalid?photoHelp:'');
if(invalid)input.setAttribute('aria-invalid','true');else input.removeAttribute('aria-invalid');
control.querySelector('.upload-name').textContent=invalid?photoHelp:file?.name||'JPG، PNG یا WebP';
}
for(const [file,url] of objectURLs)if(!kept.has(file)){URL.revokeObjectURL(url);objectURLs.delete(file)}
}
function change(){
render();
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
if(!file||!validPhoto(file))throw new Error(photoHelp);
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
async function packageDraft(){
const name=form.elements.name.value.trim(),slug=form.elements.slug.value;
if(name.length<2)throw new Error('نام سالن را وارد کنید.');
if(!/^[a-z][a-z0-9-]{1,44}[a-z0-9]$/.test(slug))throw new Error('نشانی صفحه را با حروف انگلیسی، عدد یا خط تیره وارد کنید.');
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
dirty=false;
return {id:crypto.randomUUID(),data:{name,slug,brand:form.elements.brand.value,profile,portfolio,attribution:window.__AYN_ATTR?.()||{}},files};
}
form.addEventListener('submit',e=>{
e.preventDefault();
if(busy)return;
if(!wizardReady){document.getElementById('wizardNext')?.click();return}
if(canActivate&&!activate.hidden)activate.click();
});
const sessionPath='/api/s/demo/session';
async function session(){
try{return await api(sessionPath)}catch(error){await api(sessionPath,{});return api(sessionPath)}
}
async function send(){
if(dirty||!draft)throw new Error('اطلاعات کامل نیست. دوباره تلاش کنید.');
const payload=new FormData();
payload.append('id',draft.id);payload.append('draft',JSON.stringify(draft.data));
for(const [key,file] of draft.files)payload.append(key,file,key);
const sentDraft=draft;
await api('/api/activation',payload);
window.__AYN_TRACK?.('lead_submit',{path:'activation'});
if(draft!==sentDraft||dirty)return;
submitted=true;phone.hidden=true;otp.hidden=true;thanks.hidden=false;
$('builderDialogTitle').textContent='درخواست فعال‌سازی ثبت شد';
if(!dialog.open)dialog.showModal();
activate.disabled=true;hint.textContent='درخواست فعال‌سازی ثبت شد.';
}
async function run(action,control){
if(busy)return;
busy=true;control.disabled=true;dialogError.textContent='';$('builderError').textContent='';
try{await action()}catch(error){if(dialog.open)dialogError.textContent=error.message;else hint.textContent=error.message;$('builderError').textContent=error.message}
finally{busy=false;control.disabled=control===activate&&submitted}
}
activate.onclick=()=>run(async()=>{
if(submitted||!canActivate)return;
try{await api('/api/activation')}catch{
showAvailability(false);
window.__AYN_TRACK?.('lead_submit_failed',{reason:'activation_unavailable'});
throw new Error('ثبت فعال‌سازی از این مسیر در دسترس نیست. می‌توانید درخواست‌تان را از فرم زیر بفرستید.');
}
draft=await packageDraft();
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
await api('/api/s/demo/otp/send',data);otpBody=data;window.__AYN_TRACK?.('otp_sent');
phone.hidden=true;otp.hidden=false;otp.elements.code.focus();
},e.submitter);
});
otp.addEventListener('submit',e=>{
e.preventDefault();
run(async()=>{if(!(await api(sessionPath)).verified)await api('/api/s/demo/otp/verify',{code:otp.elements.code.value});window.__AYN_TRACK?.('otp_verified');await send()},e.submitter);
});
$('builderRetry').onclick=e=>run(async()=>{await api('/api/s/demo/otp/send',otpBody);dialogError.textContent='کد جدید فرستاده شد.'},e.currentTarget);
dialog.querySelector('.builder-close').onclick=()=>dialog.close();
dialog.addEventListener('close',()=>{if(!activate.hidden&&!activate.disabled)activate.focus({preventScroll:true})});
addEventListener('ayneh:wizard-ready',()=>{
if(wizardReady)return;
wizardReady=true;
window.__AYN_TRACK?.('preview_ready');
activate.hidden=!canActivate;
hint.textContent=canActivate?'پیش‌نمایش آماده است. اگر مایلید، درخواست راه‌اندازی را ثبت کنید.':'پیش‌نمایش آماده است. درخواست‌تان را از فرم زیر بفرستید.';
});
build.disabled=false;
checkAvailability();
})();
</script><script>
(()=>{
const $=id=>document.getElementById(id),form=$('leadForm');if(!form)return;
const digits=s=>s.replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
form.addEventListener('submit',async e=>{
e.preventDefault();
const err=$('lf-err'),send=$('lf-send');err.textContent='';
const salon=$('lf-salon').value.trim(),name=$('lf-name').value.trim();
const phone=digits($('lf-phone').value).replace(/[\\s-]/g,'');
const slug=$('slugHintInput')?.value.trim();
const chosen='صفحهٔ اختصاصی سالن · '+salon+(slug?' ('+slug+')':'');
const data={name,salon,phone,city:$('lf-city').value.trim(),website:$('lf-web').value,consent:$('lf-consent').checked,chosen,attribution:window.__AYN_ATTR?.()||{}};
if(name.length<2){err.textContent='نام خودتان را بنویسید.';return}
if(salon.length<2){err.textContent='نام سالن را بنویسید.';return}
if(!/^(\\+98|0098|98|0)?9\\d{9}$/.test(phone)){err.textContent='شمارهٔ موبایل درست را وارد کنید.';return}
if(!data.consent){err.textContent='تأیید تماس را انتخاب کنید.';return}
send.disabled=true;send.setAttribute('aria-busy','true');
try{
const response=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
const result=await response.json();
if(!response.ok||!result.ok)throw Error(result.error||'ثبت درخواست ممکن نشد. دوباره تلاش کنید.');
window.__AYN_TRACK?.('lead_submit',{path:'inquiry'});
const done=$('lf-done');
done.textContent='درخواستتان ثبت شد. برای هماهنگی و اعلام هزینه با شما تماس می‌گیریم. نیازی به پرداخت یا کاری از طرف شما نیست.';
done.hidden=false; /* role=status announces it; no focus ring on a static message */
form.querySelectorAll('input,button').forEach(i=>i.disabled=true);send.hidden=true;
}catch(error){window.__AYN_TRACK?.('lead_submit_failed',{path:'inquiry'});err.textContent=error.message}
finally{send.disabled=false;send.removeAttribute('aria-busy')}
});
})();
</script><script>
(()=>{
const imgs=[...document.querySelectorAll('img')];
for(const img of imgs){
if(!img.hasAttribute('decoding'))img.setAttribute('decoding','async');
if(!img.hasAttribute('loading')&&!img.hasAttribute('fetchpriority')){
const r=img.getBoundingClientRect();
if(r.top>innerHeight*1.15)img.setAttribute('loading','lazy');
}
}
const form=document.getElementById('start'),wizard=document.getElementById('builderWizard');
if(!form||!wizard)return;
const steps=[...wizard.querySelectorAll('.wizard-step')];
if(!steps.length)return;
const $=(id)=>document.getElementById(id);
const q=$('wizardQuestion'),hint=$('wizardHintText'),count=$('wizardCount'),bar=$('wizardBar');
const err=$('wizardError'),prev=$('wizardPrev'),next=$('wizardNext'),skip=$('wizardSkip');
const build=$('builderBuild'),preview=$('builderPreview'),live=$('builderLive');
const page=$('livePage');
const fa=n=>String(n).replace(/\\d/g,d=>'۰۱۲۳۴۵۶۷۸۹'[+d]);
form.noValidate=true;
let funnelStarted=false;
const funnelStart=()=>{if(!funnelStarted){funnelStarted=true;window.__AYN_TRACK?.('wizard_start')}};
form.addEventListener('input',funnelStart,{passive:true});
form.addEventListener('change',funnelStart,{passive:true});
let fitRaf=0;
const queueFit=()=>{if(fitRaf)return;fitRaf=requestAnimationFrame(()=>{fitRaf=0;fit()})};
function fit(){
if(!page)return;
if(innerWidth>850||innerWidth<=380||innerHeight<=720){
page.style.removeProperty('--fit');return
}
const box=live.clientHeight;
if(!box)return;
let z=1;
for(let k=0;k<6;k++){
page.style.setProperty('--fit',z.toFixed(3));
const need=page.offsetHeight||1;
const target=Math.max(.58,Math.min(1.65,(box-6)/need));
if(Math.abs(target-z)<.012){z=target;break}
z+=(target-z)*.72;
}
page.style.setProperty('--fit',z.toFixed(3));
}
addEventListener('resize',queueFit,{passive:true});
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(queueFit);
if(window.ResizeObserver){
new ResizeObserver(queueFit).observe(live);
let lastH=0;
new ResizeObserver(es=>{
const h=es[0].contentRect.height;
if(Math.abs(h-lastH)>2){lastH=h;remeasure();queueFit()}
}).observe(form);
}
if(page){
new MutationObserver(queueFit).observe(page,{
childList:true,subtree:true,characterData:true,
attributes:true,attributeFilter:['hidden','src']
});
}
let i=0,reflow=0,ready=false;
const remeasure=()=>{clearTimeout(reflow);reflow=setTimeout(()=>dispatchEvent(new Event('resize')),220)};
function show(n,focus=true){
i=Math.max(0,Math.min(steps.length-1,n));
steps.forEach((s,k)=>s.classList.toggle('is-active',k===i));
const st=steps[i],last=i===steps.length-1;
q.textContent=st.dataset.q||'';hint.textContent=st.dataset.h||'';
count.textContent=fa(i+1)+' از '+fa(steps.length);
bar.style.width=(((i+1)/steps.length)*100).toFixed(1)+'%';
prev.hidden=i===0;
skip.hidden=true;build.hidden=true;
next.hidden=last&&ready;
next.textContent=last&&ready?'پیشنمایش آماده است':(last?'تأیید پیشنمایش':'ادامه');
err.textContent='';
if(focus&&innerWidth>850){
const field=st.querySelector('input:not([type=hidden]),textarea,select');
if(field)field.focus({preventScroll:true});
}
const first=st.querySelector('input,textarea,select');
if(first)setTimeout(()=>flash(first),240);
remeasure();queueFit();
}
function validate(st){
const key=st.dataset.key,ctrl=st.querySelector('input,textarea,select');
if(st.dataset.required&&ctrl&&!ctrl.checkValidity()){
err.textContent=key==='slug'
?'نشانی باید ۳ تا ۴۶ کاراکتر انگلیسی، عدد یا خط تیره باشد و با حرف شروع شود.'
:'نام سالن را دستکم با دو حرف وارد کنید.';
ctrl.focus();return false;
}
for(const el of st.querySelectorAll('input[type=url]')){
const v=el.value.trim();
if(v&&!/^https?:\\/\\//i.test(v)){err.textContent='لینکها باید با http:// یا https:// شروع شوند.';el.focus();return false}
}
return true;
}
next.addEventListener('click',()=>{
if(!validate(steps[i]))return;
window.__AYN_TRACK?.('wizard_step_complete',{step:i+1,key:steps[i].dataset.key});
if(i<steps.length-1){show(i+1);return}
if(ready)return;
ready=true;
const note=$('wizardReady');if(note)note.hidden=false;
wizard.classList.add('is-complete');
show(i,false);
dispatchEvent(new CustomEvent('ayneh:wizard-ready'));
});
skip.addEventListener('click',()=>{window.__AYN_TRACK?.('wizard_skip',{step:i+1,key:steps[i].dataset.key});show(i+1)});
prev.addEventListener('click',()=>show(i-1));
const flashFor={
name:'liveName',slug:'builderAddress',brand:'liveInitial',logo:'liveLogo',cover:'liveCover',
bio:'liveBio',manager:'liveManager',phone:'livePhone',hours:'liveHours',address:'liveAddress',
portrait:'livePortrait',map:'liveLinks',instagram:'liveLinks',telegram:'liveLinks',website:'liveLinks'
};
function flash(target){
if(!target)return;
const key=target.name||(target.hasAttribute('data-work')?'works':'');
const id=flashFor[key]||(key==='works'?'liveWorks':'');
const el=id&&$(id);if(!el||el.hidden)return;
for(const old of live.querySelectorAll('.live-flash'))old.classList.remove('live-flash');
if(preview)for(const old of preview.querySelectorAll('.live-flash'))old.classList.remove('live-flash');
void el.offsetWidth;el.classList.add('live-flash');
}
form.addEventListener('input',e=>flash(e.target));
form.addEventListener('change',e=>flash(e.target));
show(0,false);
queueFit();
})();
</script></body></html>
`;
