import {styles} from './legacy.js';
import {baseCSS,markSVG} from './design.js';

const customerCSS=String.raw`
/* ---------- hero: the salon in its mirror ---------- */
.hero{position:relative;padding:18px 0 26px}
.hero__bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}
.brand{display:inline-flex;align-items:center;gap:8px;color:var(--ink-2);font-size:13px;font-weight:600}
.brand svg{width:20px;height:25px}
.icon-btn{width:44px;height:44px;border-radius:50%;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;color:var(--ink);transition:background-color .14s var(--ease),border-color .14s var(--ease)}
.icon-btn:hover{border-color:#b3c0bb}
.icon-btn svg{width:20px;height:20px}
.hero__grid{display:grid;grid-template-columns:minmax(0,42%) minmax(0,1fr);gap:20px;align-items:end}
.hero__mirror .mirror__glass{aspect-ratio:3/4}
.hero__mirror .mirror__glass--empty{display:grid;place-items:center}
.hero__mirror .mirror__glass--empty img{width:46%;height:auto;aspect-ratio:1;border-radius:50%;object-fit:cover}
.hero__logo{position:absolute;inset-inline-start:50%;bottom:-14px;transform:translateX(50%);width:52px;height:52px;border-radius:50%;object-fit:cover;border:3px solid var(--surface);background:var(--surface);box-shadow:var(--lift)}
.hero__text{padding-bottom:6px;min-width:0}
.hero__name{font-family:var(--display);font-weight:800;font-size:clamp(32px,9.5vw,68px);line-height:1.12;color:var(--ink);overflow-wrap:anywhere}
.hero__bio{margin-top:20px;font-size:14.5px;line-height:2;color:var(--ink-2);max-width:62ch}
.hero__cta{display:none}
@media(min-width:760px){
 .hero{padding:22px 0 36px}
 .hero__grid{grid-template-columns:300px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:52px;row-gap:0;align-items:end}
 .hero__mirror{grid-row:1/4}
 .hero__text{align-self:end;padding-top:40px}
 .hero__bio{grid-column:2;margin-top:18px;font-size:15.5px}
 .hero__cta{grid-column:2;align-self:start}
 .hero__meta{grid-auto-flow:column;justify-content:start;gap:22px;margin-top:16px}
 .hero__cta{display:flex;margin-top:24px}
}
@media(max-width:759px){.hero__bio{grid-column:1/-1}}

/* ---------- steps: a three-part sequence ---------- */
.steps{position:sticky;top:0;z-index:30;background:rgba(232,237,235,.86);backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);border-bottom:1px solid var(--line-2)}
.steps__list{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;padding:10px 18px}
.steps__item{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 6px;border:0;background:transparent;color:var(--muted);font-size:13px;font-weight:600;text-align:start;position:relative;border-radius:12px}
.steps__item::after{content:"";position:absolute;inset-inline:6px;bottom:2px;height:3px;border-radius:3px;background:var(--line)}
.steps__item.is-done::after{background:var(--accent)}
.steps__item.is-active::after{background:var(--ink)}
.steps__item.is-active{color:var(--ink)}
.steps__num{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;border:1.5px solid var(--line);color:var(--ink-2);font-size:12.5px;font-weight:700;flex:none;background:var(--surface)}
.steps__item.is-active .steps__num{background:var(--ink);border-color:var(--ink);color:#fff}
.steps__item.is-done .steps__num{background:var(--accent);border-color:var(--accent);color:#fff}
.steps__label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* ---------- layout ---------- */
.layout{display:grid;grid-template-columns:minmax(0,1fr);gap:20px;padding:20px 0 28px}
@media(min-width:960px){.layout{grid-template-columns:minmax(0,1fr) 340px;gap:28px;align-items:start}.side{position:sticky;top:84px}}
.side{display:grid;gap:20px;min-width:0}
.flow{padding:22px 18px 24px;scroll-margin-top:84px}
@media(min-width:600px){.flow{padding:28px 30px 30px}}
.flow__head{margin-bottom:18px}
.flow__title{font-family:var(--display);font-weight:800;font-size:26px}
.flow__sub{font-size:13.5px;color:var(--muted);margin-top:4px;max-width:58ch;line-height:1.85}
.flow__nav{display:flex;gap:10px;margin-top:22px;flex-wrap:wrap}
.flow__nav .btn--primary{flex:1;min-width:180px}

/* ---------- step 1: the empty mirror ---------- */
.shoot{display:grid;gap:22px}
@media(min-width:700px){.shoot{grid-template-columns:260px minmax(0,1fr);align-items:center;gap:30px}}
.upload{position:relative;display:grid;place-items:center;align-content:center;gap:10px;width:min(100%,280px);margin:0 auto;aspect-ratio:3/4;padding:24px 18px;border:2px dashed #a9b8b2;border-radius:var(--arch);background:linear-gradient(170deg,#f6f9f8,#e3eae7);text-align:center;cursor:pointer;transition:border-color .15s var(--ease),background .15s var(--ease)}
.upload:hover,.upload.is-drag{border-color:var(--accent);background:linear-gradient(170deg,#f2f8f7,#d8ebe7)}
.upload__icon{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;box-shadow:0 12px 24px -12px rgba(7,76,77,.8)}
.upload__icon svg{width:27px;height:27px}
.upload strong{font-size:15px;line-height:1.6}
.upload__hint{font-size:12.5px;color:var(--muted);max-width:24ch;line-height:1.75}
.shoot__side{display:grid;gap:16px}
.shoot__btns{display:grid;gap:10px}
@media(min-width:420px){.shoot__btns{grid-template-columns:1fr 1fr}}
.tips{display:grid;gap:10px;margin:0;padding:0;list-style:none}
.tip{display:flex;gap:11px;align-items:flex-start;font-size:13.5px;color:var(--ink-2);line-height:1.7}
.tip svg{width:18px;height:18px;flex:none;margin-top:3px;color:var(--accent)}
.tip b{font-weight:700;color:var(--ink)}
.photo{width:min(100%,320px);margin:0 auto}
.photo .mirror__glass{aspect-ratio:3/4}
.photo__bar{display:flex;gap:10px;align-items:center;justify-content:space-between;margin-top:12px;font-size:13.5px;font-weight:600;color:var(--ink-2)}
.photo__bar span{display:inline-flex;align-items:center;gap:6px}
.photo__bar span svg{width:18px;height:18px;color:var(--accent)}

.collapse{border-top:1px solid var(--line-2);padding-top:12px;font-size:13px;color:var(--muted)}
.collapse summary{cursor:pointer;font-weight:600;color:var(--ink-2);list-style:none;display:flex;align-items:center;gap:7px}
.collapse summary::-webkit-details-marker{display:none}
.collapse summary svg{width:17px;height:17px;color:var(--accent)}
.collapse p{margin-top:8px;line-height:1.95}

/* ---------- step 2: choosing a look ---------- */
.seg{display:grid;grid-auto-flow:column;grid-auto-columns:1fr;gap:4px;background:var(--glass);padding:4px;border-radius:16px;margin-bottom:18px}
.seg button{min-height:42px;border:0;background:transparent;border-radius:12px;font-size:13px;font-weight:600;color:var(--ink-2);padding:0 6px;transition:background-color .14s var(--ease),color .14s var(--ease)}
.seg button[aria-selected="true"]{background:var(--surface);color:var(--ink);box-shadow:0 1px 3px rgba(35,23,15,.12)}
.filters{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:14px;scrollbar-width:none}
.filters::-webkit-scrollbar{display:none}
.filters .chip{flex:none}
.looks{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
@media(min-width:600px){.looks{grid-template-columns:repeat(3,minmax(0,1fr))}}
.style-card{display:grid;gap:2px;align-content:start;min-height:84px;padding:14px 14px 12px;border:1.5px solid var(--line-2);background:var(--surface-2);border-radius:var(--r);text-align:start;transition:border-color .14s var(--ease),background-color .14s var(--ease)}
.style-card:hover{border-color:var(--line)}
.style-card.is-on{border-color:var(--ink);background:#fff;box-shadow:0 0 0 3px rgba(35,23,15,.08)}
.style-card__name{font-family:var(--display);font-weight:800;font-size:19px;color:var(--ink);line-height:1.35}
.style-card__en{font-size:11.5px;color:var(--muted);direction:ltr;text-align:end}
.style-card__tag{font-size:12px;color:var(--accent-ink);font-weight:600;margin-top:4px}
.rail{display:grid;grid-auto-flow:column;grid-auto-columns:138px;gap:12px;overflow-x:auto;padding:4px 2px 10px;scroll-snap-type:x mandatory;scrollbar-width:thin}
.port-card{scroll-snap-align:start;border:0;background:transparent;padding:0;text-align:start}
.port-card .mirror{padding:5px;transition:box-shadow .14s var(--ease)}
.port-card .mirror__glass{aspect-ratio:3/4}
.port-card span.pc-name{display:block;padding:8px 4px 0;font-size:13px;color:var(--ink-2);font-weight:600}
.port-card.is-on .mirror{box-shadow:0 0 0 3px var(--accent),var(--lift)}
.port-card.is-on span.pc-name{color:var(--accent-ink)}
.picked{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:14px;padding:10px 12px 10px 10px;border-radius:14px;background:var(--accent-soft);color:var(--accent-ink);font-size:13.5px;font-weight:600}
.picked .btn{min-height:34px}
.ref-photo{width:min(100%,240px);margin:14px auto 0}
.ref-photo .mirror__glass{aspect-ratio:3/4}

/* ---------- step 3: result ---------- */
.summary{display:flex;gap:12px;align-items:center;padding:10px;border-radius:16px;background:var(--surface-2);border:1px solid var(--line-2)}
.summary img{width:52px;height:66px;object-fit:cover;border-radius:999px 999px 8px 8px;background:var(--glass-2)}
.summary__meta{font-size:12.5px;color:var(--muted)}
.summary b{display:block;font-size:14px;color:var(--ink)}
.stage{width:min(100%,360px);margin:18px auto 0}
.stage .mirror__glass{aspect-ratio:3/4;display:grid;place-items:center}
.stage__empty{position:relative;z-index:1;color:var(--muted);font-size:13px;text-align:center;padding:24px;max-width:22ch;line-height:1.9}
.compare-wrap{width:min(100%,400px);margin:18px auto 0}
.compare{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:999px 999px calc(var(--r) - 5px) calc(var(--r) - 5px);background:var(--glass-2);touch-action:pan-y;user-select:none;-webkit-user-select:none;cursor:ew-resize;direction:ltr}
.compare img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none;-webkit-user-drag:none}
.compare__after{position:absolute;inset:0;clip-path:inset(0 calc(100% - var(--x,50%)) 0 0)}
.compare__handle{position:absolute;top:0;bottom:0;left:var(--x,50%);width:2px;margin-left:-1px;background:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.1),0 0 12px rgba(0,0,0,.25);pointer-events:none}
.compare__grip{position:absolute;top:58%;left:50%;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:var(--lift);color:var(--ink);transition:transform .15s var(--ease)}
.compare.is-dragging .compare__grip{transform:scale(1.12)}
.compare.is-animating .compare__after{transition:clip-path .28s var(--ease)}
.compare.is-animating .compare__handle{transition:left .28s var(--ease)}
.compare__grip svg{width:22px;height:22px}
.compare__range{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;bottom:0;left:0}
.compare:has(.compare__range:focus-visible){outline:3px solid var(--accent-ring);outline-offset:3px}
.compare__tag{position:absolute;bottom:12px;z-index:2;background:rgba(250,251,250,.94);padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:var(--ink-2);pointer-events:none}
.compare__tag--before{right:12px}
.compare__tag--after{left:12px}
.compare__hint{text-align:center;font-size:12.5px;color:var(--muted);margin-top:10px}
.progress{display:grid;gap:10px;margin-top:18px}
.progress__bar{height:6px;border-radius:999px;background:var(--glass-2);overflow:hidden}
.progress__fill{height:100%;width:8%;border-radius:999px;background:var(--accent);transition:width .6s var(--ease)}
.rate-line{display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap;margin-top:18px;padding-top:16px;border-top:1px solid var(--line-2)}
.rating{display:flex;gap:4px}
.rating button{width:42px;height:42px;border-radius:50%;border:0;background:transparent;font-size:22px;color:#c3ccc8;transition:color .14s var(--ease),transform .14s var(--ease)}
.rating button:hover{transform:scale(1.1)}
.rating button.is-on{color:var(--honey)}
.result-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:14px}

/* ---------- side: portfolio, contact, requests ---------- */
.sidecard{padding:20px}
.sidecard h2{font-family:var(--display);font-weight:800;font-size:21px;margin-bottom:14px}
.gallery{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px}
@media(min-width:560px) and (max-width:959px){.gallery{grid-template-columns:repeat(3,minmax(0,1fr))}}
.pcard{border:0;padding:0;background:transparent;text-align:start}
.pcard .mirror{padding:5px}
.pcard .mirror__glass{aspect-ratio:4/5}
.pcard h3{font-size:13.5px;margin-top:8px}
.pcard p{font-size:12px;color:var(--muted)}
.pcard:hover .mirror{box-shadow:0 0 0 2px var(--accent),var(--lift)}
.meta-list{display:grid;gap:2px}
.meta-list a,.meta-list span.mi{display:flex;gap:12px;align-items:flex-start;color:var(--ink-2);line-height:1.75;font-size:13.5px;padding:9px 0;border-bottom:1px solid var(--line-2)}
.meta-list>:last-child{border-bottom:0}
.meta-list a:hover{color:var(--accent-ink)}
.meta-list svg{width:18px;height:18px;flex:none;margin-top:3px;color:var(--accent)}
.manager{display:flex;align-items:center;gap:12px;margin-top:12px;padding-top:12px;border-top:1px solid var(--line-2);font-size:13px;color:var(--ink-2)}
.manager img{width:46px;height:46px;border-radius:50%;object-fit:cover}
.foot{text-align:center;font-size:12px;color:var(--muted);padding:6px 6px 0;line-height:1.9;max-width:44ch;margin:0 auto}

/* ---------- dock ---------- */
.dock{position:fixed;inset-inline:0;bottom:0;z-index:40;padding:12px 14px calc(12px + var(--safe-b));background:linear-gradient(180deg,rgba(232,237,235,0),rgba(232,237,235,.92) 40%);pointer-events:none}
.dock__inner{pointer-events:auto;max-width:620px;margin:0 auto;display:flex;gap:8px;align-items:center;background:var(--ink);border-radius:20px;padding:7px;box-shadow:var(--float)}
.dock__hint{font-size:13px;color:rgba(255,255,255,.72);padding-inline-start:12px;flex:1;min-width:0;line-height:1.5;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dock .btn--ghost{color:#fff;border-color:rgba(255,255,255,.22)}
.dock .btn--ghost:hover{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.4)}
.dock .btn--primary{flex:none;box-shadow:none}
.dock .btn--primary[disabled]{opacity:.55}
@media(max-width:560px){.dock__hint{display:none}.dock .btn--primary{flex:1}}
@media(min-width:960px){.dock{display:none}}



.hero__tools{display:flex;gap:8px;align-items:center}
.help-btn{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--ink-2);font-weight:700;font-size:17px;display:grid;place-items:center}
.help-btn:hover{border-color:#b3c0bb}
/* tour */
.tour{position:fixed;inset:0;z-index:100;animation:tourIn .25s var(--ease)}
.tour.is-leaving{opacity:0;transition:opacity .2s var(--ease)}
@keyframes tourIn{from{opacity:0}to{opacity:1}}
.tour__spot{position:fixed;left:0;top:0;width:0;height:0;border-radius:20px;box-shadow:0 0 0 200vmax rgba(24,16,10,.66),0 0 0 3px rgba(255,255,255,.9) inset;pointer-events:none;transition:transform .38s var(--ease),width .38s var(--ease),height .38s var(--ease)}
.tour--welcome .tour__spot{transform:translate(50vw,50vh);box-shadow:0 0 0 200vmax rgba(24,16,10,.72)}
.tour__card{position:fixed;left:0;top:0;width:min(360px,calc(100vw - 24px));background:var(--surface);border-radius:22px;padding:18px 18px 16px;box-shadow:var(--float);outline:none;transition:transform .38s var(--ease)}
.tour--welcome .tour__card{left:50%;top:50%;transform:translate(-50%,-50%);width:min(400px,calc(100vw - 32px));padding:26px 22px 20px;text-align:center;transition:none}
.tour__mirror{position:relative;width:96px;aspect-ratio:3/4;margin:0 auto 16px;border-radius:999px 999px 14px 14px;background:linear-gradient(170deg,#f4f7f6,#d6dfdb);box-shadow:0 0 0 6px var(--surface),0 0 0 7px var(--line),var(--lift);overflow:hidden;display:grid;place-items:center}
.tour__mark{width:42%;position:relative;z-index:1}
.tour__mark svg{width:100%;height:auto;display:block}
.tour__shine{position:absolute;inset:-20% -60%;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.85) 50%,transparent 60%);transform:translateX(-60%);animation:shine 1.6s .3s var(--ease) both}
@keyframes shine{to{transform:translateX(60%)}}
.tour__title{font-family:var(--display);font-weight:800;font-size:21px;line-height:1.4}
.tour--welcome .tour__title{font-size:26px}
.tour__text{font-size:14px;line-height:1.95;color:var(--ink-2);margin-top:6px}
.tour__path{list-style:none;margin:18px 0 20px;padding:0;display:grid;grid-template-columns:repeat(3,1fr);position:relative}
.tour__path::before{content:"";position:absolute;top:21px;inset-inline:16%;height:2px;background:var(--line)}
.tour__path li{display:grid;justify-items:center;gap:7px;position:relative;font-size:12.5px}
.tour__path span{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--accent);color:#fff;box-shadow:0 0 0 5px var(--surface)}
.tour__path li:nth-child(2) span{background:var(--ink)}
.tour__path li:nth-child(3) span{background:var(--honey)}
.tour__path svg{width:20px;height:20px}
.tour__actions{display:grid;gap:8px}
.tour__skip{border-color:transparent}
.tour__top{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.tour__dots{display:flex;gap:5px}
.tour__dots span{width:7px;height:7px;border-radius:9px;background:var(--line);transition:width .25s var(--ease),background-color .25s}
.tour__dots .is-on{width:20px;background:var(--accent)}
.tour__dots .is-done{background:var(--accent-soft)}
.tour__x{width:34px;height:34px;border:0;border-radius:50%;background:var(--glass);color:var(--ink-2);font-size:19px;line-height:1}
.tour__nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:14px}
.tour__count{font-size:12px;color:var(--muted)}
.tour--still,.tour--still *{animation:none!important;transition:none!important}
body.is-touring{overflow:hidden}
.flowcol{display:grid;gap:16px;min-width:0;align-content:start}
/* demo before/after */
.compare--demo{cursor:default;pointer-events:none}
.demo{flex:none}
.demo--small{width:118px;padding:4px}
.demo .compare__tag{font-size:10.5px;padding:1px 8px;bottom:8px}
.demo .compare__tag--before{right:8px}.demo .compare__tag--after{left:8px}
.demo-row{display:flex;gap:14px;align-items:center;margin:0 0 18px;padding:10px 14px 10px 10px;border-radius:20px;background:var(--glass)}
.demo-row__text{display:grid;gap:3px;font-size:13px;line-height:1.85;color:var(--ink-2)}
.demo-row__text b{font-family:var(--display);font-weight:800;font-size:17px;color:var(--ink)}
.tour__demo{width:150px;margin:0 auto 16px}
/* after sending */
.sent__follow{display:grid;gap:8px;width:100%;margin-top:4px;padding:14px;border-radius:18px;background:var(--glass)}
.sent__hint{font-size:13px;color:var(--ink-2);line-height:1.85}
/* your request card */
.mine{padding:16px 18px;box-shadow:inset 0 3px 0 var(--accent),var(--lift)}
.mine--booked{box-shadow:inset 0 3px 0 var(--ok),var(--lift)}.mine--declined{box-shadow:inset 0 3px 0 var(--honey),var(--lift)}
.mine__head{display:flex;gap:12px;align-items:center}
.mine__icon{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--glass);font-size:20px;flex:none}
.mine__head b{display:block;font-size:15px}
.mine__meta{font-size:12.5px;color:var(--muted)}
.mine__steps{list-style:none;margin:14px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);position:relative}
.mine__steps::before{content:"";position:absolute;top:6px;inset-inline:16%;height:2px;background:var(--line)}
.mine__steps li{display:grid;justify-items:center;gap:6px;position:relative;font-size:12px;color:var(--muted)}
.mine__steps li span{width:14px;height:14px;border-radius:50%;background:var(--line);box-shadow:0 0 0 4px var(--surface)}
.mine__steps li.is-on{color:var(--ink)}.mine__steps li.is-on span{background:var(--accent)}
.mine__note{font-size:13px;color:var(--ink-2);margin-top:12px;line-height:1.85}
.mine__actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
/* 360 viewer */
.spin-wrap{width:min(100%,330px);margin:4px auto 0;padding:6px}
.spin{position:relative;aspect-ratio:3/4;border-radius:999px 999px 13px 13px;overflow:hidden;background:linear-gradient(170deg,#f4f7f6,#d6dfdb);touch-action:pan-y;user-select:none;-webkit-user-select:none;outline:none}
.spin:focus-visible{box-shadow:0 0 0 3px var(--accent-ring)}
.spin.is-ready{cursor:grab}.spin.is-ready:active{cursor:grabbing}
.spin__layer{position:absolute;inset:0;background-repeat:no-repeat;background-size:400% 200%;opacity:0;transition:opacity .14s linear}
.spin__layer.is-on{opacity:1}
.spin__loading{position:absolute;inset:0;display:grid;place-items:center;align-content:center;gap:14px;padding:20px;text-align:center;transition:opacity .35s var(--ease);perspective:700px}
.spin.is-ready .spin__loading{opacity:0}
.spin__orbit{width:58%;aspect-ratio:3/4;border-radius:999px 999px 12px 12px;overflow:hidden;box-shadow:var(--float);animation:sway 3.2s ease-in-out infinite;transform-style:preserve-3d}
.spin__orbit img{width:100%;height:100%;object-fit:cover}
@keyframes sway{0%,100%{transform:rotateY(-24deg)}50%{transform:rotateY(24deg)}}
.spin__ring{position:absolute;left:50%;top:44%;width:84%;aspect-ratio:1;transform:translate(-50%,-50%) rotateX(74deg);border-radius:50%;border:2px dashed rgba(12,107,107,.35);animation:orbit 6s linear infinite;pointer-events:none}
@keyframes orbit{to{transform:translate(-50%,-50%) rotateX(74deg) rotate(360deg)}}
.spin__tip{font-size:13px;color:var(--ink-2);min-height:1.8em}
.spin__track{width:62%;height:4px;border-radius:9px;background:rgba(35,23,15,.1);overflow:hidden}
.spin__bar{display:block;height:100%;width:2%;background:var(--accent);border-radius:9px;transition:width .4s linear}
.spin__controls{margin-top:12px;display:grid;gap:12px}.spin__controls[hidden]{display:none}
.spin__row{display:flex;align-items:center;gap:12px;justify-content:center}
.spin__dial{position:relative;width:34px;height:34px;border-radius:50%;border:2px solid var(--line);--r:0deg}
.spin__dial::before{content:"";position:absolute;left:50%;top:-6px;width:2px;height:6px;margin-left:-1px;background:var(--muted);border-radius:2px}
.spin__dot{position:absolute;inset:0;transform:rotate(var(--r));transition:transform .2s var(--ease)}
.spin__dot::after{content:"";position:absolute;left:50%;top:2px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--accent)}
.spin__angle{min-width:58px;font-weight:700;font-size:14px;text-align:center}
.spin__thumbs{display:grid;grid-template-columns:repeat(8,1fr);gap:5px;max-width:330px;margin:0 auto;width:100%}
.spin__thumb{aspect-ratio:3/4;border-radius:999px 999px 6px 6px;border:2px solid transparent;background-size:400% 200%;background-repeat:no-repeat;padding:0;opacity:.6;transition:opacity .15s,border-color .15s}
.spin__thumb.is-on{border-color:var(--accent);opacity:1}
.spin__note{text-align:center;margin-top:10px}
.layout--solo{grid-template-columns:minmax(0,1fr)!important;max-width:760px;margin:0 auto}
.about-btn{display:inline-flex;align-items:center;gap:7px;min-height:42px;padding:0 15px;border-radius:999px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font-weight:600;font-size:13.5px}
.about-btn:hover{border-color:#b3c0bb}
.about-btn svg{width:18px;height:18px;color:var(--accent)}
.hero__tag{margin-top:12px;font-size:15px;line-height:1.95;color:var(--ink-2);max-width:40ch}
.about__bio{font-size:14.5px;line-height:2;color:var(--ink-2);margin-bottom:16px}
.about__quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:12px}
.sidecard__lead{font-size:13px;color:var(--muted);margin:-8px 0 14px}
.style-card{padding:0;overflow:hidden;min-height:0}
.style-card__art{display:block;aspect-ratio:4/5;background:linear-gradient(170deg,#eef2f0,#d6dfdb);overflow:hidden}
.style-card__art img{width:100%;height:100%;object-fit:cover;transition:transform .3s var(--ease)}
.style-card:hover .style-card__art img{transform:scale(1.03)}
.style-card__art.is-missing{aspect-ratio:auto;height:6px}
.style-card__body{display:grid;gap:0;padding:10px 12px 12px}
.style-card__name{font-size:16px}
.style-card.is-on .style-card__art{box-shadow:inset 0 -4px 0 var(--ink)}
.color{margin-top:20px;padding-top:18px;border-top:1px solid var(--line-2)}
.color__box{position:relative}
.color__box input{display:block;width:100%;min-height:var(--tap);padding:11px 14px;padding-inline-end:44px;border:1px solid var(--line);border-radius:var(--r-sm);background:#fff;color:var(--ink)}
.color__box input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 4px var(--accent-ring)}
.color__clear{position:absolute;inset-inline-end:6px;top:50%;transform:translateY(-50%);width:34px;height:34px;border:0;border-radius:50%;background:var(--glass);color:var(--ink-2);font-size:19px;line-height:1}
.color__list{position:absolute;inset-inline:0;top:calc(100% + 6px);z-index:20;margin:0;padding:6px;list-style:none;background:var(--surface);border:1px solid var(--line-2);border-radius:16px;box-shadow:var(--float);max-height:300px;overflow:auto}
.color__list li{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;cursor:pointer;font-size:14px}
.color__list li:hover,.color__list li.is-active{background:var(--glass)}
.color__list .color__free{color:var(--muted);font-size:13px;cursor:default}
.swatch{width:26px;height:26px;border-radius:50%;flex:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.12)}
.color .hint{display:block;font-size:12px;color:var(--muted);margin-top:6px;line-height:1.7}
.send-note{display:flex;gap:9px;align-items:flex-start;margin-top:12px;font-size:13px;line-height:1.85;color:var(--muted)}
.send-note svg{width:17px;height:17px;flex:none;margin-top:3px;color:var(--accent)}
.outbox{display:flex;gap:14px;align-items:center;padding:12px;border-radius:16px;background:var(--glass);margin-bottom:14px}
.outbox b{display:block;font-size:14.5px;line-height:1.6}
.outbox p{font-size:13px;color:var(--ink-2);line-height:1.8;margin-top:2px}
.outbox__thumbs{display:flex;flex:none}
.outbox__thumbs img{width:46px;height:60px;object-fit:cover;border-radius:999px 999px 8px 8px;border:3px solid var(--surface);background:var(--glass-2)}
.outbox__thumbs img+img{margin-inline-start:-14px}
.how{margin:0 0 18px;padding:0;list-style:none;counter-reset:how;display:grid;gap:8px}
.how li{counter-increment:how;display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.8;color:var(--ink-2)}
.how li::before{content:counter(how,persian);width:24px;height:24px;flex:none;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:#fff;font-size:12px;font-weight:700;margin-top:1px}
.sent{display:grid;justify-items:center;gap:12px;text-align:center;padding:10px 0 4px}
.sent__mark{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--ok-soft);color:var(--ok)}
.sent__mark svg{width:32px;height:32px}
.sent h2{font-family:var(--display);font-weight:800;font-size:24px}
.sent p{color:var(--ink-2);line-height:1.95;max-width:40ch}
.fatal{display:grid;gap:14px;justify-items:start;padding:28px;margin:40px auto;max-width:460px}
.fatal h1{font-family:var(--display);font-weight:800;font-size:26px}
`;

const clientJS=String.raw`
var STYLES=__STYLES__;
var MARK=__MARK__;
var SLUG=location.pathname.split('/').filter(Boolean)[1]||'';
var ICO={
 camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2a2 2 0 0 0 1.7-.9l.6-1a2 2 0 0 1 1.7-.9h2.6a2 2 0 0 1 1.7.9l.6 1a2 2 0 0 0 1.7.9h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z"/><circle cx="12" cy="12.5" r="3.4"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="4.5" y="10" width="15" height="10" rx="2.6"/><path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3.5h2.2l1.6 4-2 1.3a12 12 0 0 0 6.4 6.4l1.3-2 4 1.6v2.2a2.5 2.5 0 0 1-2.7 2.5A16.5 16.5 0 0 1 4 6.2 2.5 2.5 0 0 1 6.5 3.5z"/></svg>',
 pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s6.5-6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z"/><circle cx="12" cy="10" r="2.4"/></svg>',
 clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5l3.2 2"/></svg>',
 instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1"/></svg>',
 globe:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.6 5.4 3.6 8.5S14.4 18.1 12 20.5c-2.4-2.4-3.6-5.4-3.6-8.5S9.6 5.9 12 3.5z"/></svg>',
 send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 3.5 10.6l6.3 2.6 2.6 6.3z"/><path d="M20 4l-7.6 15.5"/></svg>',
 spark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"/><path d="M18.5 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/></svg>',
 download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11"/><path d="m7.5 11 4.5 4.5L16.5 11"/><path d="M4.5 19.5h15"/></svg>',
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
 info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.8v.4"/></svg>',
 warn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 21 19.5H3z"/><path d="M12 10v4.5M12 17.2v.3"/></svg>',
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.4 3.9-5.2 7.5-5.2s6.3 1.8 7.5 5.2"/></svg>',
 scissors:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="6.5" cy="6.5" r="2.5"/><path d="M8.7 8.3 20 19M8.7 15.7 20 5"/></svg>',
 sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/></svg>',
 gallery:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 15-4.6-4.4L7 19.5"/></svg>',
 orbit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="9" ry="3.6"/><path d="M12 3.5c2 1.6 3.2 4.7 3.2 8.5s-1.2 6.9-3.2 8.5"/><path d="m18.6 13.8 2 1.6-2.3 1"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>',};
var state={pub:null,step:1,original:null,reference:null,refTitle:'',style:null,tab:'salon',transfer:'both',color:'',result:null,gen:null,genState:null,busy:false,error:'',session:false,verified:false,idem:null,rating:0,me:null};
try{state.me=JSON.parse(localStorage.getItem('ayneh-me')||'null')}catch(e){}
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function fa(n){return new Intl.NumberFormat('fa-IR').format(n)}
function fmt(ms){if(!ms)return '';try{return new Intl.DateTimeFormat('fa-IR',{timeZone:'Asia/Tehran',dateStyle:'medium',timeStyle:'short'}).format(ms)}catch(e){return ''}}
function uuid(){var b=crypto.getRandomValues(new Uint8Array(16));b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var x=Array.prototype.map.call(b,function(v){return v.toString(16).padStart(2,'0')}).join('');return x.slice(0,8)+'-'+x.slice(8,12)+'-'+x.slice(12,16)+'-'+x.slice(16,20)+'-'+x.slice(20)}
function sleep(ms){return new Promise(function(r){setTimeout(r,ms)})}
function tehranDate(d){var p={};new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tehran',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d).forEach(function(x){p[x.type]=x.value});return p.year+'-'+p.month+'-'+p.day}
function el(tag,attrs,children){var e=document.createElement(tag);attrs=attrs||{};Object.keys(attrs).forEach(function(k){var v=attrs[k];if(v===undefined||v===null)return;if(k==='text')e.textContent=v;else if(k==='html')e.innerHTML=v;else if(k==='class')e.className=v;else if(k.slice(0,2)==='on')e.addEventListener(k.slice(2),v);else if(k==='checked'||k==='disabled'||k==='hidden'||k==='required')e[k]=!!v;else e.setAttribute(k,v)});(children||[]).forEach(function(c){if(c!==null&&c!==undefined&&c!==false)e.append(c)});return e}
function h(tag,text,cls){return el(tag,{class:cls||'',text:text})}
function media(id){return '/api/s/'+SLUG+'/media/'+id}
function api(path,body,raw){
 var init={};
 if(body!==undefined){init.method='POST';init.headers=raw?{}:{'Content-Type':'application/json'};init.body=raw?body:JSON.stringify(body)}
 return fetch('/api/s/'+SLUG+'/'+path,init).then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok)throw new Error(d.error||'خطای ارتباط با سرور');return d})})
}
function toast(msg,kind){
 var t=$('#toast');if(!t)return;
 t.textContent=msg;t.className='toast is-on'+(kind==='error'?' is-error':'');
 clearTimeout(window.__tt);window.__tt=setTimeout(function(){t.className='toast'},6500);
}
function svg(name){return el('span',{html:ICO[name]||'',class:'ico'})}

/* ---------- anonymous usage events (no name, phone or photo) ---------- */
var VISITOR=(function(){var v='';try{v=localStorage.getItem('ayneh-v')||''}catch(e){}if(!/^[a-f0-9]{32}$/.test(v)){v=Array.prototype.map.call(crypto.getRandomValues(new Uint8Array(16)),function(b){return b.toString(16).padStart(2,'0')}).join('');try{localStorage.setItem('ayneh-v',v)}catch(e){}}return v})();
var tracked={};
function track(kind,meta,once){if(once){if(tracked[kind+meta])return;tracked[kind+meta]=1}try{fetch('/api/s/'+SLUG+'/track',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:kind,v:VISITOR,meta:meta==null?'':String(meta)}),keepalive:true}).catch(function(){})}catch(e){}}

/* ---------- boot ---------- */
(async function boot(){
 try{state.pub=await api('public')}catch(e){showFatal(e.message);return}
 document.title=state.pub.salon.name+' | آینه';
 renderHead();renderSteps();renderFlow();renderSide();renderDock();
 var pending=sessionStorage.getItem('ayneh-job-'+SLUG);
 if(pending){state.gen=pending;state.step=3;state.busy=true;renderFlow();renderDock();poll(pending,true)}
 track('view','',true);
 maybeTour();
 loadMine();
})();

function showFatal(msg){
 var main=$('#main');if(!main)return;
 main.replaceChildren(el('div',{class:'panel fatal'},[h('h1','این صفحه باز نشد'),h('p',msg,'muted'),el('a',{class:'btn btn--primary',href:'/',text:'بازگشت به آینه'})]));
 var dock=$('#dock');if(dock)dock.hidden=true;
}

/* ---------- header ---------- */
function renderHead(){
 var s=state.pub.salon,p=s.profile||{},head=$('#head');
 var bar=el('div',{class:'hero__bar'},[el('span',{class:'brand',html:MARK+'<span>آینه</span>'}),el('div',{class:'hero__tools'},[el('button',{class:'help-btn',type:'button','aria-label':'راهنمای استفاده',onclick:startTour,text:'؟'}),el('button',{class:'about-btn',type:'button',onclick:openAbout,html:ICO.info+'<span>دربارهٔ سالن</span>'})])]);
 var glass=el('div',{class:'mirror__glass'+(p.cover?'':' mirror__glass--empty')});
 if(p.cover)glass.append(el('img',{src:media(p.cover),alt:'',fetchpriority:'high'}));
 else if(p.logo)glass.append(el('img',{src:media(p.logo),alt:''}));
 var mirror=el('div',{class:'mirror hero__mirror'},[glass]);
 if(p.cover&&p.logo)mirror.append(el('img',{class:'hero__logo',src:media(p.logo),alt:''}));
 var text=el('div',{class:'hero__text'},[el('h1',{class:'hero__name',text:s.name}),el('p',{class:'hero__tag',text:'مدل و رنگ موی بعدی‌ات را روی عکس خودت ببین و برای آرایشگر بفرست.'})]);
 var grid=el('div',{class:'hero__grid'},[mirror,text]);
 grid.append(el('div',{class:'hero__cta'},[el('button',{class:'btn btn--primary',type:'button',onclick:function(){go(state.original?2:1)},html:ICO.camera+'<span>شروع با عکس خودم</span>'})]));
 head.replaceChildren(el('div',{class:'wrap'},[bar,grid]));
}

/* ---------- about the salon: every detail lives here ---------- */
function openAbout(){
 track('about');
 var s=state.pub.salon,p=s.profile||{};
 var panel=el('div',{class:'sheet__panel about'});
 panel.append(el('div',{class:'sheet__head'},[h('h2',s.name),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 if(p.bio)panel.append(el('p',{class:'about__bio',text:p.bio}));
 var quick=el('div',{class:'about__quick'});
 if(p.phone)quick.append(el('a',{class:'btn btn--primary',href:'tel:'+p.phone,html:ICO.phone+'<span>تماس</span>'}));
 if(p.map)quick.append(el('a',{class:'btn btn--ghost',href:p.map,target:'_blank',rel:'noopener noreferrer',html:ICO.pin+'<span>مسیریابی</span>'}));
 if(quick.childNodes.length)panel.append(quick);
 var list=el('div',{class:'meta-list'});
 if(p.address)list.append(el(p.map?'a':'span',{class:'mi',href:p.map||null,target:p.map?'_blank':null,rel:'noopener noreferrer'},[el('span',{html:ICO.pin}),el('span',{text:p.address})]));
 if(p.hours)list.append(el('span',{class:'mi'},[el('span',{html:ICO.clock}),el('span',{text:p.hours})]));
 if(p.phone)list.append(el('a',{class:'mi',href:'tel:'+p.phone},[el('span',{html:ICO.phone}),el('span',{text:fa0(p.phone),dir:'ltr'})]));
 if(p.instagram)list.append(el('a',{class:'mi',href:p.instagram,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.instagram}),el('span',{text:'اینستاگرام سالن'})]));
 if(p.telegram)list.append(el('a',{class:'mi',href:p.telegram,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.send}),el('span',{text:'تلگرام سالن'})]));
 if(p.website)list.append(el('a',{class:'mi',href:p.website,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.globe}),el('span',{text:'وب‌سایت'})]));
 if(!list.childNodes.length&&!p.bio)list.append(el('span',{class:'mi',text:'سالن هنوز اطلاعاتی ثبت نکرده است.'}));
 panel.append(list);
 if(p.manager)panel.append(el('div',{class:'manager'},[p.portrait?el('img',{src:media(p.portrait),alt:''}):null,el('span',{text:p.manager})]));
 openSheet(panel);
}


/* ---------- steps ---------- */
function renderSteps(){
 var bar=$('#steps');bar.hidden=false;
 var list=el('div',{class:'steps__list wrap'});
 [['عکس تو',1],['انتخاب مدل',2],['نتیجه',3]].forEach(function(x){
  var n=x[1];
  var cls='steps__item'+(state.step===n?' is-active':'')+(state.step>n?' is-done':'');
  var b=el('button',{class:cls,type:'button','aria-current':state.step===n?'step':'false'},[
   el('span',{class:'steps__num',html:state.step>n?'✓':fa(n)}),
   el('span',{class:'steps__label',text:x[0]})
  ]);
  b.addEventListener('click',function(){go(n)});
  list.append(b);
 });
 bar.replaceChildren(list);
}
function go(n){
 if(n===2&&!state.original){toast('اول عکس خودت را اضافه کن');return}
 state.step=n;renderSteps();renderFlow();renderDock();
 var f=$('#flow');if(f&&f.scrollIntoView)f.scrollIntoView({behavior:'smooth',block:'start'});
}

/* ---------- flow (steps 1-3) ---------- */
function renderFlow(){
 var root=$('#flow');if(!root)return;
 root.replaceChildren();
 if(state.step===1)root.append(stepPhoto());
 else if(state.step===2)root.append(stepModel());
 else root.append(stepResult());
}
function flowHead(title,sub){
 return el('div',{class:'flow__head'},[h('h2',title,'flow__title'),sub?h('p',sub,'flow__sub'):null]);
}
function openCamera(){var cam=el('input',{type:'file',accept:'image/*',capture:'user'});cam.style.display='none';cam.addEventListener('change',function(){handleFile(cam.files&&cam.files[0],'original');cam.remove()});document.body.append(cam);cam.click()}
function stepPhoto(){
 var box=el('div',{class:'panel flow'});
 if(!state.original){
  box.append(flowHead('اول، عکس خودت','یک عکس روبه‌رو با صورت کامل. مدل انتخابی روی همین عکس امتحان می‌شود.'));
  var input=el('input',{type:'file',accept:'image/jpeg,image/png,image/webp',id:'pick',class:'sr-only'});
  var drop=el('label',{class:'upload',for:'pick'},[
   el('span',{class:'upload__icon',html:ICO.camera}),
   el('strong',{text:'عکس چهره‌ات را اینجا بگذار'}),
   el('span',{class:'upload__hint',text:'از گالری انتخاب کن یا عکس را روی همین قاب رها کن'})
  ]);
  input.addEventListener('change',function(){handleFile(input.files&&input.files[0],'original')});
  ['dragenter','dragover'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.add('is-drag')})});
  ['dragleave','drop'].forEach(function(ev){drop.addEventListener(ev,function(e){e.preventDefault();drop.classList.remove('is-drag')})});
  drop.addEventListener('drop',function(e){var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];handleFile(f,'original')});
  var side=el('div',{class:'shoot__side'},[
   el('ul',{class:'tips'},[
    el('li',{class:'tip'},[el('span',{html:ICO.sun}),el('span',{},[el('b',{text:'نور روبه‌رو. '}),document.createTextNode('کنار پنجره بایست، نه زیر لامپ سقف.')])]),
    el('li',{class:'tip'},[el('span',{html:ICO.user}),el('span',{},[el('b',{text:'صورت کامل. '}),document.createTextNode('بدون کلاه و عینک آفتابی، موها در قاب.')])]),
    el('li',{class:'tip'},[el('span',{html:ICO.spark}),el('span',{},[el('b',{text:'بدون فیلتر. '}),document.createTextNode('رنگ واقعی موهات مهم است.')])])
   ]),
   el('div',{class:'shoot__btns'},[
    el('button',{class:'btn btn--primary',type:'button',onclick:pickNow,html:ICO.gallery+'<span>انتخاب از گالری</span>'}),
    el('button',{class:'btn btn--ghost',type:'button',onclick:openCamera,html:ICO.camera+'<span>عکس با دوربین</span>'})
   ]),
   el('details',{class:'collapse'},[
    el('summary',{html:ICO.lock+'<span>عکسم کجا نگه‌داری می‌شود؟</span>'}),
    h('p','عکس فقط برای همین سالن استفاده می‌شود، دسترسی عمومی ندارد و حداکثر بعد از ۳۰ روز حذف می‌شود. برای شبیه‌سازی، نسخهٔ فشردهٔ عکس به سرویس تصویر ارسال می‌شود.')
   ])
  ]);
  box.append(input,el('div',{class:'demo-row'},[demoCompare('demo--small'),el('div',{class:'demo-row__text'},[h('b','این‌طوری می‌شود'),h('span','یک نمونهٔ قبل و بعد. با عکس خودت، همین را روی صورت خودت می‌بینی و بعد برای آرایشگر می‌فرستی.')])]),el('div',{class:'shoot'},[drop,side]));
 }else{
  box.append(flowHead('عکست آماده است','اگر صورتت کامل و روشن دیده می‌شود، برو سراغ انتخاب مدل.'));
  box.append(el('div',{class:'photo'},[
   el('div',{class:'mirror'},[el('div',{class:'mirror__glass'},[el('img',{src:media(state.original),alt:'عکس انتخابی شما'})])]),
   el('div',{class:'photo__bar'},[
    el('span',{html:ICO.check+'<span>عکس انتخاب شد</span>'}),
    el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){state.original=null;state.result=null;renderFlow();renderDock()},text:'تغییر عکس'})
   ])
  ]));
  box.append(el('div',{class:'flow__nav'},[
   el('button',{class:'btn btn--primary',type:'button',onclick:function(){go(2)},text:'ادامه: انتخاب مدل'})
  ]));
 }
 return box;
}
function pickedBar(text,onRemove){
 return el('div',{class:'picked'},[el('span',{text:text}),el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:onRemove,text:'حذف انتخاب'})]);
}
function stepModel(){
 var box=el('div',{class:'panel flow'});
 box.append(flowHead('مدل و رنگ را انتخاب کن','از کارهای همین سالن، مدل‌های آماده یا عکس مدلی که خودت پیدا کرده‌ای. رنگ را هم می‌توانی جدا بنویسی.'));
 var seg=el('div',{class:'seg',role:'tablist'});
 [['salon','کارهای سالن'],['catalog','مدل‌های آماده'],['upload','عکس مدل من']].forEach(function(x){
  var b=el('button',{type:'button',role:'tab','aria-selected':state.tab===x[0]?'true':'false',text:x[1]});
  b.addEventListener('click',function(){state.tab=x[0];renderFlow()});
  seg.append(b);
 });
 box.append(seg);
 if(state.tab==='salon'){
  var items=(state.pub.portfolio||[]).filter(function(p){return p.published||p.try_on});
  if(!items.length)box.append(notice('info','سالن هنوز نمونه‌کاری نگذاشته. از «مدل‌های آماده» یا عکس مدل خودت استفاده کن.'));
  else{
   var rail=el('div',{class:'rail'});
   items.forEach(function(p){
    var imgs=[];try{imgs=JSON.parse(p.images||'[]')}catch(e){}
    if(!imgs.length)return;
    var on=state.reference===imgs[0];
    var card=el('button',{class:'port-card'+(on?' is-on':''),type:'button','aria-pressed':on?'true':'false'},[
     el('span',{class:'mirror'},[el('span',{class:'mirror__glass',style:'display:block'},[el('img',{src:media(imgs[0]),alt:p.title,loading:'lazy'})])]),
     el('span',{class:'pc-name',text:p.title})
    ]);
    card.addEventListener('click',function(){track('look','s:'+p.title);state.reference=imgs[0];state.refTitle=p.title;state.style=null;state.transfer='both';state.result=null;renderFlow();renderDock()});
    rail.append(card);
   });
   box.append(rail);
  }
  if(state.reference&&state.refTitle)box.append(pickedBar('کار انتخابی: '+state.refTitle,function(){state.reference=null;state.refTitle='';renderFlow();renderDock()}));
 }else if(state.tab==='catalog'){
  var filters=['همه','کوتاه','متوسط','بلند','چتری','فر','جمع'];
  var fbar=el('div',{class:'filters'});
  filters.forEach(function(f){
   var on=(state.filter||'همه')===f;
   var c=el('button',{class:'chip',type:'button','aria-pressed':on?'true':'false',text:f});
   c.addEventListener('click',function(){state.filter=f;renderFlow()});
   fbar.append(c);
  });
  box.append(fbar);
  var grid=el('div',{class:'looks'});
  STYLES.forEach(function(s,i){
   if((state.filter||'همه')!=='همه'&&s[2]!==state.filter)return;
   var on=state.style===i&&!state.reference;
   var pic=el('img',{src:'/catalog/'+String(i+1).padStart(2,'0')+'.webp',alt:'',loading:'lazy',decoding:'async'});
   var art=el('span',{class:'style-card__art'},[pic]);
   pic.addEventListener('error',function(){art.classList.add('is-missing');pic.remove()});
   var card=el('button',{class:'style-card'+(on?' is-on':''),type:'button','aria-pressed':on?'true':'false'},[
    art,
    el('span',{class:'style-card__body'},[el('span',{class:'style-card__name',text:s[0]}),el('span',{class:'style-card__tag',text:s[2]})])
   ]);
   card.addEventListener('click',function(){track('look','c:'+i);state.style=i;state.reference=null;state.refTitle='';state.result=null;renderFlow();renderDock()});
   grid.append(card);
  });
  box.append(grid);
  if(state.style!==null&&!state.reference)box.append(pickedBar('مدل انتخابی: '+STYLES[state.style][0],function(){state.style=null;renderFlow();renderDock()}));
 }else{
  if(!state.reference||state.refTitle){
   var input2=el('input',{type:'file',accept:'image/jpeg,image/png,image/webp',id:'pickref',class:'sr-only'});
   var drop2=el('label',{class:'upload',for:'pickref'},[
    el('span',{class:'upload__icon',html:ICO.gallery}),
    el('strong',{text:'عکس مدل دلخواهت'}),
    el('span',{class:'upload__hint',text:'فقط موی این عکس استفاده می‌شود؛ چهره‌اش نه.'})
   ]);
   input2.addEventListener('change',function(){handleFile(input2.files&&input2.files[0],'reference')});
   box.append(input2,drop2);
  }else{
   box.append(el('div',{class:'ref-photo mirror'},[el('div',{class:'mirror__glass'},[el('img',{src:media(state.reference),alt:'عکس مرجع'})])]));
   box.append(pickedBar('عکس مدل اضافه شد',function(){state.reference=null;renderFlow();renderDock()}));
   var tr=filtersRow([['style','فقط مدل مو'],['color','فقط رنگ مو'],['both','مدل و رنگ']],state.transfer,function(v){state.transfer=v;renderFlow()});
   box.append(el('div',{style:'margin-top:16px'},[h('p','چه چیزی از این عکس برداشته شود؟','lbl'),tr]));
  }
 }
 // One colour box for all three ways of choosing a look.
 box.append(colorPicker());
 if(state.reference&&!state.pub.reference&&state.pub.generation)box.append(notice('warn','ساخت تصویر از عکس مرجع یا کار سالن هنوز برای این سالن فعال نشده. می‌توانی مدل آماده انتخاب کنی، یا همین را بدون شبیه‌سازی برای آرایشگر بفرستی.'));
 box.append(el('div',{class:'flow__nav'},[
  el('button',{class:'btn btn--ghost',type:'button',onclick:function(){go(1)},text:'بازگشت'}),
  el('button',{class:'btn btn--primary',type:'button',onclick:function(){if(!hasChoice()){toast(missingReason());return}go(3)},text:'ادامه: نتیجه'})
 ]));
 return box;
}

/* ---------- colour box with suggestions ---------- */
var COLORS=[
 ['مشکی','#151515'],['مشکی کلاغی','#0f1420'],['مشکی آبی','#141a2c'],['قهوه‌ای تیره','#3b2518'],['قهوه‌ای متوسط','#5e3c25'],['قهوه‌ای روشن','#7a5233'],
 ['شکلاتی','#4b2b1c'],['شکلاتی تلخ','#33201a'],['شکلاتی گرم','#5a321e'],['موکا','#6a4a37'],['نسکافه‌ای','#8d6646'],['فندقی','#8b5a2b'],['قهوه‌ای دودی','#5a4a42'],['دودی زیتونی','#6b6450'],['زیتونی','#6b6a3f'],['شکلاتی دودی','#4a3a33'],['نسکافه‌ای دودی','#7d6a5a'],['قهوه‌ای سرد','#54443c'],
 ['کاراملی','#a86c34'],['عسلی','#b8803a'],['عسلی طلایی','#c99a45'],['بلوند عسلی','#c8913f'],['بلوند کاراملی','#b9864f'],['بلوند طلایی','#d8b064'],['بلوند شامپاینی','#e2cfa5'],
 ['بلوند بژ','#d4bc96'],['بلوند روشن','#ddc28c'],['بلوند خیلی روشن','#ecdcb4'],['بلوند تیره','#9e7a4a'],['بلوند دودی','#b6aa96'],['بلوند خاکستری','#c9c2b0'],['بلوند نقره‌ای','#dcd8cc'],
 ['بلوند یخی','#e8e6dd'],['پلاتینه','#ece8dc'],['بلوند توت‌فرنگی','#d79a72'],['بلوند رزگلد','#d9a19a'],
 ['مسی','#b5602f'],['مسی روشن','#c87a45'],['قرمز مسی','#a8462a'],['حنایی','#a4482a'],['دارچینی','#8f4f2c'],['ماهاگونی','#6e2f25'],['قرمز آتشین','#b0302a'],
 ['شرابی','#6b1f2e'],['آلبالویی','#7a1f2b'],['زرشکی','#6d1a2a'],['یاقوتی','#8b1d36'],['بادمجانی','#4a2438'],['بنفش','#5b3a78'],['یاسی','#b8a1d6'],
 ['رزگلد','#c98c7a'],['صورتی پاستلی','#e8b4c4'],['آبی دودی','#5a6e86'],['آبی نفتی','#23465c'],['نقره‌ای','#c4c4c2'],['خاکستری','#a9a9a6'],['سفید یخی','#ebebe8'],
 ['بالیاژ عسلی','#3b2518,#c8913f'],['بالیاژ کاراملی','#4b2b1c,#b9864f'],['بالیاژ شامپاینی','#5e3c25,#e2cfa5'],['بالیاژ سرد','#3b3430,#d6d2c6'],['بالیاژ مسی','#4b2b1c,#c87a45'],
 ['آمبره قهوه‌ای به بلوند','#3b2518,#ddc28c'],['آمبره شرابی','#33201a,#7a1f2b'],['آمبره دودی','#2b2622,#b6aa96'],['سامبره','#5e3c25,#b8803a'],
 ['هایلایت طلایی','#5e3c25,#d8b064'],['مش دودی','#4b4540,#b6aa96'],['مش عسلی','#5e3c25,#c8913f'],['بالیاژ دودی','#2b2622,#a59a8c'],['هایلایت نقره‌ای','#4b4540,#dcd8cc'],['لایت عسلی','#7a5233,#c8913f'],['لایت دودی','#5a4a42,#c9c2b0'],['بیبی لایت','#8b5a2b,#ddc28c']
];
var POPULAR=['دودی زیتونی','نسکافه‌ای','بالیاژ عسلی','شکلاتی','مش دودی','کاراملی','بلوند شامپاینی','شرابی'];
function normFa(s){return String(s||'').replace(/ي/g,'ی').replace(/ك/g,'ک').replace(/[‌\s]/g,'')}
function swatch(hex){var c=hex.split(',');return el('span',{class:'swatch',style:'background:'+(c.length>1?'linear-gradient(135deg,'+c[0]+' 0 45%,'+c[1]+' 55%)':c[0])})}
function colorPicker(){
 var wrap=el('div',{class:'color'});
 var input=el('input',{id:'color',type:'text',value:state.color||'',autocomplete:'off',role:'combobox','aria-autocomplete':'list','aria-expanded':'false','aria-controls':'color-list',placeholder:'مثلاً عسلی، شکلاتی، بالیاژ سرد'});
 var list=el('ul',{class:'color__list',id:'color-list',role:'listbox',hidden:true});
 var clear=el('button',{class:'color__clear',type:'button','aria-label':'پاک کردن رنگ',text:'×',hidden:!state.color});
 var active=-1,shown=[];
 function pick(name){track('color',name);state.color=name;input.value=name;clear.hidden=false;close();state.result=null}
 function close(){list.hidden=true;input.setAttribute('aria-expanded','false');active=-1}
 function render(){
  var q=normFa(input.value);
  shown=q?COLORS.filter(function(c){return normFa(c[0]).indexOf(q)>=0}).slice(0,8):POPULAR.map(function(n){return COLORS.find(function(c){return c[0]===n})});
  list.replaceChildren();
  shown.forEach(function(c,i){var li=el('li',{role:'option',id:'co-'+i,class:i===active?'is-active':'','aria-selected':i===active?'true':'false'},[swatch(c[1]),el('span',{text:c[0]})]);li.addEventListener('mousedown',function(e){e.preventDefault();pick(c[0])});list.append(li)});
  if(q&&!shown.length)list.append(el('li',{class:'color__free',text:'«'+input.value.trim()+'» همین‌طور که نوشتی فرستاده می‌شود'}));
  list.hidden=false;input.setAttribute('aria-expanded','true');
  if(active>=0)input.setAttribute('aria-activedescendant','co-'+active);else input.removeAttribute('aria-activedescendant');
 }
 input.addEventListener('focus',render);
 input.addEventListener('input',function(){state.color=input.value.trim();clear.hidden=!input.value;active=-1;state.result=null;render()});
 input.addEventListener('keydown',function(e){
  if(e.key==='ArrowDown'){e.preventDefault();active=Math.min(shown.length-1,active+1);render()}
  else if(e.key==='ArrowUp'){e.preventDefault();active=Math.max(0,active-1);render()}
  else if(e.key==='Enter'&&active>=0&&shown[active]){e.preventDefault();pick(shown[active][0])}
  else if(e.key==='Escape')close();
 });
 input.addEventListener('blur',function(){setTimeout(close,120)});
 clear.addEventListener('click',function(){state.color='';input.value='';clear.hidden=true;input.focus()});
 var hint=state.tab==='upload'&&state.reference&&state.transfer!=='style'?'اگر رنگی بنویسی، به‌جای رنگ عکس مدل استفاده می‌شود.':state.tab==='salon'&&state.reference?'اگر رنگی بنویسی، مدل همان کار سالن می‌ماند و رنگ عوض می‌شود.':'خالی بماند یعنی رنگ فعلی موهایت حفظ شود.';
 wrap.append(el('label',{class:'lbl',for:'color',text:'رنگ مو (اختیاری)'}),el('div',{class:'color__box'},[input,clear,list]),el('span',{class:'hint',text:hint}));
 return wrap;
}

function hasChoice(){return !!state.original&&(state.style!==null||!!state.reference)}
function canGenerate(){return !!state.original&&(state.style!==null||!!state.reference)&&!!state.pub.generation&&(!state.reference||!!state.pub.reference)}
function missingReason(){
 if(!state.original)return 'اول عکس خودت را اضافه کن';
 if(!state.pub.generation)return 'تولید شبیه‌سازی برای این سالن فعال نیست؛ می‌توانی درخواست بررسی بفرستی';
 if(state.reference&&!state.pub.reference)return 'انتقال عکس مرجع هنوز فعال نشده است';
 return 'یک مدل انتخاب کن';
}
// Before/after: the line sits exactly under the finger. Positions are physical (left→right)
// so RTL page direction never flips the drag. Drag moves 1:1, a tap moves the line there,
// and the hidden range keeps keyboard and screen-reader control.
function compareBlock(){
 var wrap=el('div',{class:'compare'});
 wrap.append(el('img',{src:media(state.original),alt:'قبل',draggable:'false'}));
 wrap.append(el('div',{class:'compare__after'},[el('img',{src:media(state.result),alt:'بعد',draggable:'false'})]));
 wrap.append(el('div',{class:'compare__handle'},[el('span',{class:'compare__grip',html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 8 5 12l4 4M15 8l4 4-4 4"/></svg>'})]));
 wrap.append(el('span',{class:'compare__tag compare__tag--before',text:'قبل'}));
 wrap.append(el('span',{class:'compare__tag compare__tag--after',text:'بعد'}));
 var range=el('input',{type:'range',min:'0',max:'100',value:'50',dir:'ltr',class:'compare__range','aria-label':'مقایسهٔ قبل و بعد؛ با کلیدهای جهت خط را جابه‌جا کن'});
 wrap.append(range);
 var x=50;
 function set(v,animate){x=Math.max(0,Math.min(100,v));wrap.classList.toggle('is-animating',!!animate);wrap.style.setProperty('--x',x+'%');range.value=String(Math.round(x))}
 set(50);
 var start=null;
 wrap.addEventListener('pointerdown',function(e){if(e.button>0)return;var r=wrap.getBoundingClientRect();start={px:e.clientX,x:x,w:r.width,left:r.left,moved:false,id:e.pointerId};wrap.classList.add('is-dragging')});
 wrap.addEventListener('pointermove',function(e){if(!start||e.pointerId!==start.id)return;var dx=e.clientX-start.px;if(!start.moved&&Math.abs(dx)<4)return;if(!start.moved){start.moved=true;try{wrap.setPointerCapture(e.pointerId)}catch(err){}}e.preventDefault();set(start.x+dx/start.w*100,false)});
 function end(e){if(!start)return;if(!start.moved&&e.type==='pointerup')set((e.clientX-start.left)/start.w*100,true);start=null;wrap.classList.remove('is-dragging')}
 wrap.addEventListener('pointerup',end);wrap.addEventListener('pointercancel',end);
 range.addEventListener('input',function(){set(Number(range.value),false)});
 return el('div',{},[el('div',{class:'mirror compare-wrap'},[wrap]),el('p',{class:'compare__hint',text:'خط را با انگشت بکش یا روی هر جای عکس بزن'})]);
}
function ratingBlock(){
 var wrap=el('div',{class:'rate-line'});
 wrap.append(h('span','چقدر شبیه خودت شد؟','tiny muted'));
 var stars=el('div',{class:'rating',role:'group','aria-label':'امتیاز به شباهت'});
 for(var i=1;i<=5;i++){
  (function(n){
   var b=el('button',{class:'rating__star'+(state.rating>=n?' is-on':''),type:'button','aria-label':fa(n)+' از ۵','aria-pressed':state.rating>=n?'true':'false',text:'★'});
   b.addEventListener('click',function(){state.rating=n;saveRating(n);renderFlow()});
   stars.append(b);
  })(i);
 }
 wrap.append(stars);
 return wrap;
}
function saveRating(n){try{localStorage.setItem('ayneh-rating-'+state.result,String(n))}catch(e){}track('rating',n+':'+(state.gen||''))}
function notice(kind,text){
 var map={info:ICO.info,warn:ICO.warn,danger:ICO.warn,ok:ICO.check};
 return el('div',{class:'notice notice--'+kind,style:'margin-top:14px'},[el('span',{html:map[kind]||ICO.info}),el('span',{text:text})]);
}
function field(id,label,hint,type,value,onInput,extra){
 var input=el('input',{id:id,type:type||'text',value:value||'',autocomplete:extra&&extra.autocomplete||'off',inputmode:extra&&extra.inputmode||null,placeholder:extra&&extra.placeholder||''});
 if(onInput)input.addEventListener('input',function(){onInput(input.value)});
 return el('label',{class:'field'},[el('span',{class:'lbl',text:label}),input,hint?el('span',{class:'hint',text:hint}):null]);
}
function filtersRow(opts,cur,onPick){
 var row=el('div',{class:'row'});
 opts.forEach(function(o){
  var b=el('button',{class:'chip'+(cur===o[0]?' is-on':''),type:'button','aria-pressed':cur===o[0]?'true':'false',text:o[1]});
  b.addEventListener('click',function(){onPick(o[0])});
  row.append(b);
 });
 return row;
}


function lookName(){
 if(state.reference)return state.refTitle?'«'+state.refTitle+'» از کارهای سالن':'عکس مدل دلخواه';
 return state.style!==null?STYLES[state.style][0]:'';
}
function sendButton(){return el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>فرستادن برای آرایشگر</span>'})}
function stepResult(){
 var box=el('div',{class:'panel flow'});
 box.append(flowHead(state.result?'خودت با مدل جدید':'نتیجه و ارسال','این تصویر یک شبیه‌سازی پیشنهادی است، نه تضمین اجرا. تصمیم نهایی با آرایشگر است.'));
 box.append(el('div',{class:'summary'},[
  state.original?el('img',{src:media(state.original),alt:''}):null,
  el('div',{class:'grow'},[el('b',{text:'مدل: '+(lookName()||'انتخاب نشده')}),el('div',{class:'summary__meta',text:state.color?'رنگ: '+state.color:'رنگ: همان رنگ فعلی'})]),
  el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){go(2)},text:'تغییر'})
 ]));
 if(state.error)box.append(notice('danger',state.error));
 if(state.busy&&!state.result){
  var pct=state.pct||12;
  box.append(el('div',{class:'stage mirror'},[el('div',{class:'mirror__glass'},[state.original?el('img',{src:media(state.original),alt:'',style:'opacity:.45;filter:saturate(.4)'}):null])]));
  box.append(el('div',{class:'progress'},[
   el('div',{class:'progress__bar'},[el('div',{class:'progress__fill',style:'width:'+pct+'%'})]),
   h('p','در حال ساخت شبیه‌سازی… این صفحه را نبند. معمولاً کمتر از ۳۰ ثانیه طول می‌کشد.','tiny muted')
  ]));
 }
 if(state.result){
  box.append(compareBlock());
  box.append(el('div',{class:'result-actions'},[
   el('button',{class:'btn btn--soft btn--sm',type:'button',onclick:openViews,html:ICO.orbit+'<span>نمای ۳۶۰ درجه</span>'}),
   el('a',{class:'btn btn--ghost btn--sm',href:media(state.result),download:'ayneh.png',html:ICO.download+'<span>دانلود</span>'}),
   el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){state.result=null;state.gen=null;state.idem=null;state.error='';state.busy=false;renderFlow();renderDock()},text:'شبیه‌سازی تازه'})
  ]));
  box.append(ratingBlock());
  box.append(el('div',{class:'flow__nav'},[sendButton()]));
  box.append(sendNote());
 }else if(!state.busy){
  if(!canGenerate()){
   box.append(notice('info',!state.pub.generation?'این سالن پیش‌نمایش تصویری را فعال نکرده. عکس و مدل انتخابی‌ات را برای آرایشگر بفرست تا بررسی کند.':'ساخت تصویر از این انتخاب هنوز فعال نیست. عکس و مدلت را مستقیم برای آرایشگر بفرست.'));
   box.append(el('div',{class:'flow__nav'},[sendButton()]));
   box.append(sendNote());
  }else{
   box.append(el('div',{class:'stage mirror'},[el('div',{class:'mirror__glass'},[el('span',{class:'stage__empty',text:'نتیجه همین‌جا، در قاب آینه، ظاهر می‌شود'})])]));
   var check=el('label',{class:'check'},[el('input',{type:'checkbox',id:'consent'}),el('span',{text:'با ارسال عکسم به سرویس تصویر برای ساخت شبیه‌سازی موافقم. عکس فقط برای این سالن نگه داشته می‌شود.'})]);
   check.style.marginTop='18px';
   box.append(check);
   box.append(el('div',{class:'flow__nav'},[
    el('button',{class:'btn btn--primary',type:'button',onclick:generate,html:ICO.spark+'<span>ساخت شبیه‌سازی</span>'}),
    el('button',{class:'btn btn--ghost',type:'button',onclick:openRequest,html:ICO.send+'<span>بدون شبیه‌سازی بفرست</span>'})
   ]));
  }
 }
 return box;
}
function sendNote(){
 var name=state.pub.salon.name;
 return el('p',{class:'send-note'},[el('span',{html:ICO.send}),el('span',{text:state.pub.telegram?'عکس و مدلت با اسم و شماره‌ات در تلگرام برای «'+name+'» فرستاده می‌شود. خود سالن با تو تماس می‌گیرد یا در تلگرام پیام می‌دهد.':'«'+name+'» هنوز ارسال آنلاین را فعال نکرده؛ با زدن این دکمه راه‌های تماس با سالن را می‌بینی.'})]);
}

/* ---------- side: the salon's own work ---------- */
function renderSide(){
 var side=$('#side');side.replaceChildren();
 var gallery=(state.pub.portfolio||[]).filter(function(x){return x.published});
 if(!gallery.length){side.hidden=true;$('.layout').classList.add('layout--solo');return}
 var card=el('section',{class:'panel sidecard'},[h('h2','کارهای '+state.pub.salon.name),h('p','روی هر کار بزن تا روی عکس خودت امتحانش کنی.','sidecard__lead')]);
 var grid=el('div',{class:'gallery'});
 gallery.forEach(function(item){
  var imgs=[];try{imgs=JSON.parse(item.images||'[]')}catch(e){}
  if(!imgs.length)return;
  var btn=el('button',{class:'pcard',type:'button','aria-label':'امتحان '+item.title+' روی عکس خودم'},[
   el('span',{class:'mirror',style:'display:block'},[el('span',{class:'mirror__glass',style:'display:block'},[el('img',{src:media(imgs[0]),alt:item.title,loading:'lazy'})])]),
   h('h3',item.title),item.category?el('p',{text:item.category}):null
  ]);
  btn.addEventListener('click',function(){state.reference=imgs[0];state.refTitle=item.title;state.style=null;state.transfer='both';state.tab='salon';state.result=null;if(state.original)go(2);else{go(1);toast('«'+item.title+'» انتخاب شد؛ حالا عکس خودت را اضافه کن')}});
  grid.append(btn);
 });
 card.append(grid);
 side.append(card);
}
function fa0(v){return String(v).replace(/^\+98/,'0').replace(/\d/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'[d]})}

/* ---------- dock ---------- */
function renderDock(){
 var dock=$('#dock');
 var inner=el('div',{class:'dock__inner'});
 var hint='',primary=null;
 if(state.step===1){
  hint=state.original?'عکس آماده است':'برای شروع، عکس چهره‌ات را اضافه کن';
  primary=el('button',{class:'btn btn--primary',type:'button',onclick:function(){(state.original?go(2):pickNow())},html:(state.original?ICO.check:ICO.camera)+'<span>'+(state.original?'ادامه':'افزودن عکس')+'</span>'});
 }else if(state.step===2){
  var ready=hasChoice();
  hint=ready?'آماده':'یک مدل انتخاب کن';
  primary=el('button',{class:'btn btn--primary',type:'button',disabled:!ready,onclick:function(){if(!ready){toast(missingReason());return}go(3)},html:ICO.arrow+'<span>ادامه</span>'});
 }else{
  if(state.busy){hint='در حال ساخت…';primary=el('button',{class:'btn btn--primary',type:'button',disabled:true,text:'در حال ساخت…'})}
  else if(state.result||!canGenerate()){hint='فرستادن در تلگرام برای سالن';primary=el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>فرستادن برای آرایشگر</span>'})}
  else{hint='آمادهٔ ساخت شبیه‌سازی';primary=el('button',{class:'btn btn--primary',type:'button',onclick:generate,html:ICO.spark+'<span>ساخت شبیه‌سازی</span>'})}
 }
 inner.append(el('div',{class:'dock__hint',text:hint}),el('button',{class:'btn btn--ghost',type:'button',onclick:openAbout,'aria-label':'دربارهٔ سالن',html:ICO.info}),primary);
 dock.replaceChildren(inner);dock.hidden=false;
}

/* ---------- upload ---------- */
function handleFile(file,kind){
 if(!file){toast('عکسی انتخاب نشد');return}
 if(['image/jpeg','image/png','image/webp'].indexOf(file.type)<0){toast('فقط JPG، PNG یا WebP','error');return}
 state.busy=true;renderDock();
 Promise.all([compress(file),ensureSession()]).then(function(r){
  return api('upload?kind='+kind,r[0],true);
 }).then(function(d){
  if(kind==='original'){track('photo');state.original=d.id;state.result=null;state.error='';state.idem=null;state.step=2}
  else{track('look','u');state.reference=d.id;state.refTitle='';state.style=null;state.result=null;state.error=''}
  renderFlow();renderSteps();renderDock();
 }).catch(function(e){toast(e.message,'error')}).then(function(){state.busy=false;renderDock()});
}
function compress(file){
 return createImageBitmap(file).then(function(bitmap){
  if(bitmap.width<300||bitmap.height<300){bitmap.close();throw new Error('عکس خیلی کوچک است؛ حداقل ۳۰۰×۳۰۰ پیکسل')}
  var canvas=document.createElement('canvas');
  var scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  var attempt=0;
  function step(){
   canvas.width=Math.max(300,Math.round(bitmap.width*scale));
   canvas.height=Math.max(300,Math.round(bitmap.height*scale));
   var ctx=canvas.getContext('2d');
   ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   if(attempt===0){
    var data=ctx.getImageData(0,0,canvas.width,canvas.height).data;
    var light=0,c=0;
    for(var i=0;i<data.length;i+=160){light+=(data[i]+data[i+1]+data[i+2])/3;c++}
    if(light/c<22){bitmap.close();throw new Error('عکس خیلی تاریک است؛ نور بهتری انتخاب کن')}
   }
   return new Promise(function(res){canvas.toBlob(res,'image/jpeg',attempt<2?0.85:0.75)}).then(function(blob){
    if(!blob){bitmap.close();throw new Error('تبدیل عکس ممکن نشد')}
    if(blob.size<=820*1024||attempt>=5){bitmap.close();return blob}
    attempt++;scale*=0.72;return step();
   });
  }
  return step();
 });
}

/* ---------- generation ---------- */
function generate(){
 if(state.busy)return;
 if(!canGenerate()){toast(missingReason());return}
 var box=$('#flow');
 var consent=box?box.querySelector('#consent'):null;
 if(consent&&!consent.checked){consent.closest('.check').style.color='var(--danger)';toast('رضایت ارسال عکس را تأیید کن');return}
 if(state.pub.otp&&!state.verified){
  ensureSession().then(function(){
   if(state.verified){generate();return}
   openOtp(generate);
  }).catch(function(e){toast(e.message,'error')});
  return;
 }
 state.busy=true;state.error='';state.result=null;renderFlow();renderDock();
 ensureSession().then(function(){
  state.idem=state.idem||uuid();
  return api('generate',{image_consent:true,idem:state.idem,original_id:state.original,reference_id:state.reference||undefined,style:state.reference!==null?undefined:state.style,transfer:state.transfer,color:state.color||undefined});
 }).then(function(job){
  track('generate',state.reference?(state.refTitle?'salon':'upload'):'catalog');
  state.gen=job.id;state.genState=job.state;state.step=3;
  try{sessionStorage.setItem('ayneh-job-'+SLUG,job.id)}catch(e){}
  renderFlow();renderDock();
  return poll(job.id);
 }).catch(function(e){
  state.busy=false;
  if(needsVerify(e.message)){state.verified=false;state.error='';renderFlow();renderDock();openOtp(generate);return}
  state.error=friendly(e.message);
  renderFlow();renderDock();
 });
}
function friendly(msg){
 if(/سقف استفاده/.test(msg))return 'سقف استفادهٔ امروز پر شده است؛ فردا دوباره امتحان کن.';
 if(/فعال نشده/.test(msg))return 'تولید شبیه‌سازی برای این سالن فعال نیست.';
 if(/وضعیت نامشخص/.test(msg))return 'ارسال به سرویس تصویر نامشخص ماند. برای جلوگیری از هزینهٔ دوباره، خودکار تکرار نمی‌شود؛ کمی بعد دوباره سر بزن.';
 if(/درخواست را نپذیرفت/.test(msg))return 'سرویس تصویر درخواست را نپذیرفت. کمی بعد دوباره تلاش کن.';
 return msg;
}
function pickNow(){var pick=$('#pick');if(pick)pick.click();else toast('اول عکس خودت را اضافه کن')}
function updateProgress(){
 var f=$('#flow');if(!f)return;
 var bar=f.querySelector('.progress__fill');
 if(bar)bar.style.width=(state.pct||10)+'%';
}
function poll(id,resumed){
 var attempts=0;
 function tick(){
  attempts++;
  state.pct=Math.min(92,10+attempts*7);
  updateProgress();
  return api('generation/'+id).then(function(d){
   state.genState=d.state;
   if(d.state==='success'){
    track('result','',true);
    state.result=d.result_id;state.busy=false;state.idem=null;state.pct=100;
    try{sessionStorage.removeItem('ayneh-job-'+SLUG)}catch(e){}
    state.rating=Number(localStorage.getItem('ayneh-rating-'+d.result_id)||0);
    renderFlow();renderDock();toast('شبیه‌سازی آماده شد');
    return;
   }
   if(d.state==='fail'||d.state==='unknown'){
    track('gen_fail',d.state);
    state.busy=false;state.error=d.state==='fail'?'سرویس تصویر نتوانست خروجی بسازد. می‌توانی دوباره تلاش کنی.':friendly('وضعیت نامشخص');
    renderFlow();renderDock();return;
   }
   if(attempts>90){state.busy=false;state.error='هنوز آماده نشده؛ با بازکردن دوبارهٔ صفحه همان درخواست پیگیری می‌شود.';renderFlow();renderDock();return}
   return sleep(Math.min(4000,1400+attempts*160)).then(tick);
  }).catch(function(){
   if(attempts>8){state.busy=false;state.error='ارتباط با سرور قطع شد؛ بعداً دوباره سر بزن.';renderFlow();renderDock();return}
   return sleep(2200).then(tick);
  });
 }
 return tick();
}
/* ---------- 360° view: 8 estimated angles played as a drag-to-turn spin ---------- */
/* ---------- 360° view: 8 estimated angles, played like a turntable ---------- */
// Drag (with momentum), tap a thumbnail, use the arrow keys, or let it turn on its own.
// While the angles are being made, the result itself sways in 3D so the wait feels alive.
function openViews(){
 track('view360');
 if(!state.gen)return;
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var ANG=['جلو','۴۵°','نیم‌رخ','۱۳۵°','پشت','۲۲۵°','نیم‌رخ','۳۱۵°'];
 var panel=el('div',{class:'sheet__panel spin-panel'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','از همهٔ زاویه‌ها'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 var a=el('div',{class:'spin__layer'}),b=el('div',{class:'spin__layer'});
 var stage=el('div',{class:'spin',tabindex:'0',role:'img','aria-label':'نمای چرخشی مدل مو؛ برای چرخاندن بکش یا از کلیدهای جهت استفاده کن'},[a,b]);
 var tip=el('p',{class:'spin__tip',text:'دارم زاویه‌های دیگر را می‌سازم…'}),bar=el('span',{class:'spin__bar'});
 var loading=el('div',{class:'spin__loading'},[el('div',{class:'spin__orbit'},[el('img',{src:media(state.result),alt:''})]),el('span',{class:'spin__ring'}),tip,el('span',{class:'spin__track'},[bar])]);
 stage.append(loading);
 var angle=el('span',{class:'spin__angle',text:''});
 var dial=el('div',{class:'spin__dial','aria-hidden':'true'},[el('span',{class:'spin__dot'})]);
 var thumbs=el('div',{class:'spin__thumbs',role:'group','aria-label':'زاویه‌ها'});
 var play=el('button',{class:'btn btn--ghost btn--sm spin__play',type:'button',text:'⏸ توقف'});
 var controls=el('div',{class:'spin__controls',hidden:true},[el('div',{class:'spin__row'},[dial,angle,play]),thumbs]);
 panel.append(el('div',{class:'mirror spin-wrap'},[stage]),controls,h('p','زاویه‌هایی که در عکس تو دیده نمی‌شوند تخمینی‌اند؛ این اسکن سه‌بعدی نیست.','tiny muted spin__note'));
 openSheet(panel);
 var frame=0,front=a,timer=null,spinTimer=null,tipTimer=null,progTimer=null,src='';
 function pos(n){return ((n%4)*100/3)+'% '+(Math.floor(n/4)*100)+'%'}
 function show(n,instant){
  frame=(n%8+8)%8;var back=front===a?b:a;back.style.backgroundPosition=pos(frame);
  if(instant||reduce){front.style.backgroundPosition=pos(frame)}else{back.classList.add('is-on');front.classList.remove('is-on');front=back}
  angle.textContent=ANG[frame];dial.style.setProperty('--r',(frame*45)+'deg');
  Array.prototype.forEach.call(thumbs.children,function(t,i){t.classList.toggle('is-on',i===frame);t.setAttribute('aria-pressed',i===frame?'true':'false')});
 }
 function auto(on){clearInterval(spinTimer);spinTimer=null;play.textContent=on?'⏸ توقف':'▶ چرخش';if(on&&!reduce)spinTimer=setInterval(function(){if(!panel.isConnected){cleanup();return}show(frame+1)},420)}
 function cleanup(){clearInterval(spinTimer);clearInterval(tipTimer);clearInterval(progTimer);cancelAnimationFrame(timer)}
 play.addEventListener('click',function(){auto(!spinTimer)});
 var drag=null;
 stage.addEventListener('pointerdown',function(e){if(!src)return;auto(false);cancelAnimationFrame(timer);drag={x:e.clientX,f:frame,t:performance.now(),v:0,lx:e.clientX};try{stage.setPointerCapture(e.pointerId)}catch(err){}});
 stage.addEventListener('pointermove',function(e){if(!drag)return;var now=performance.now(),dt=Math.max(1,now-drag.t);drag.v=(drag.lx-e.clientX)/dt;drag.lx=e.clientX;drag.t=now;var f=drag.f+Math.round((drag.x-e.clientX)/32);if(f!==frame)show(f,true)});
 function release(){if(!drag)return;var v=drag.v;drag=null;if(reduce||Math.abs(v)<0.25)return;var acc=0,last=performance.now();
  (function coast(now){var dt=now-last;last=now;acc+=v*dt/32;v*=Math.pow(0.992,dt);if(Math.abs(acc)>=1){var s=acc>0?1:-1;show(frame+s,true);acc-=s}if(Math.abs(v)>0.05&&panel.isConnected)timer=requestAnimationFrame(coast)})(last)}
 stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
 stage.addEventListener('keydown',function(e){if(!src)return;if(e.key==='ArrowLeft'){auto(false);show(frame+1)}if(e.key==='ArrowRight'){auto(false);show(frame-1)}if(e.key===' '){e.preventDefault();auto(!spinTimer)}});
 function ready(id){
  src=media(id);[a,b].forEach(function(l){l.style.backgroundImage='url('+src+')'});
  thumbs.replaceChildren();for(var i=0;i<8;i++)(function(n){var t=el('button',{class:'spin__thumb',type:'button','aria-label':'زاویهٔ '+ANG[n],style:'background-image:url('+src+');background-position:'+pos(n)});t.addEventListener('click',function(){auto(false);show(n)});thumbs.append(t)})(i);
  clearInterval(tipTimer);clearInterval(progTimer);bar.style.width='100%';
  stage.classList.add('is-ready');a.classList.add('is-on');controls.hidden=false;
  setTimeout(function(){loading.remove()},reduce?0:350);
  show(0,true);auto(true);
 }
 var tips=['دارم پشت سرت را می‌سازم…','نیم‌رخ چپ…','نیم‌رخ راست…','هماهنگ‌کردن نور و رنگ مو…','تقریباً آماده است…'],ti=0,started=Date.now();
 tipTimer=setInterval(function(){if(!panel.isConnected){cleanup();return}tip.textContent=tips[ti++%tips.length]},2400);
 progTimer=setInterval(function(){bar.style.width=Math.min(95,(Date.now()-started)/600)+'%'},400);
 if(state.views&&state.views.gen===state.gen){ready(state.views.id);return}
 api('views',{parent:state.gen,idem:state.viewsIdem||(state.viewsIdem=uuid())}).then(function(job){
  var tries=0;
  function check(){if(!panel.isConnected)return;return api('generation/'+job.id).then(function(d){
   if(d.state==='success'){state.views={gen:state.gen,id:d.result_id};state.viewsIdem=null;ready(d.result_id);return}
   if(d.state==='fail'||d.state==='unknown'||++tries>40){cleanup();tip.textContent='ساخت زاویه‌ها ممکن نشد؛ کمی بعد دوباره امتحان کن.';state.viewsIdem=null;return}
   return sleep(3000).then(check);
  })}
  return check();
 }).catch(function(e){cleanup();tip.textContent=e.message});
}

/* ---------- demo before/after, shown before we ask for a photo ---------- */
// Uses /catalog/demo-before.webp and demo-after.webp (made by the catalog workflow); if they are
// missing, nothing is shown. The line sweeps by itself; reduced motion keeps it still.
function demoCompare(cls){
 var wrap=el('div',{class:'compare compare--demo'},[el('img',{src:'/catalog/demo-before.webp',alt:'نمونه: قبل',draggable:'false'}),el('div',{class:'compare__after'},[el('img',{src:'/catalog/demo-after.webp',alt:'نمونه: بعد',draggable:'false'})]),el('div',{class:'compare__handle'}),el('span',{class:'compare__tag compare__tag--before',text:'قبل'}),el('span',{class:'compare__tag compare__tag--after',text:'بعد'})]);
 var box=el('div',{class:'mirror demo '+(cls||'')},[wrap]),fails=0;
 Array.prototype.forEach.call(wrap.querySelectorAll('img'),function(i){i.addEventListener('error',function(){if(++fails===1)box.remove()})});
 wrap.style.setProperty('--x','62%');
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){var t0=performance.now(),seen=false,raf=0;
  function tick(now){if(!box.isConnected)return;wrap.style.setProperty('--x',(50+30*Math.sin((now-t0)/1100))+'%');raf=requestAnimationFrame(tick)}
  var io=window.IntersectionObserver?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!seen){seen=true;track('demo','',true)}cancelAnimationFrame(raf);raf=requestAnimationFrame(tick)}else cancelAnimationFrame(raf)})}):null;
  if(io)setTimeout(function(){io.observe(box)},0);else raf=requestAnimationFrame(tick);
 }
 return box;
}

/* ---------- "your request" card: what the salon did with it ---------- */
var MINE={new:['⏳','فرستاده شد؛ منتظر تماس سالن باش','sent'],called:['📞','سالن گفته با تو تماس گرفته','called'],booked:['🎉','نوبتت هماهنگ شد','booked'],declined:['✋','سالن گفت این مدل در سالن اجرا نمی‌شود','declined']};
function loadMine(){
 var flag=null;try{flag=localStorage.getItem('ayneh-sent-'+SLUG)}catch(e){}
 if(!flag&&!state.sentOnce)return;
 api('requests').then(function(d){renderMine(d)}).catch(function(){});
}
function renderMine(d){
 var box=$('#mine');if(!box)return;var r=(d.requests||[])[0];if(!r){box.hidden=true;return}
 var st=MINE[r.salon_status]||MINE.new,late=r.salon_status==='new'&&Date.now()-r.created_at>86400000;
 var steps=['فرستاده شد','سالن جواب داد','نوبت'],reached=r.salon_status==='booked'?3:(r.salon_status==='new'?1:2);
 var follow=null;try{follow=JSON.parse(localStorage.getItem('ayneh-follow-'+SLUG)||'null')}catch(e){}
 var tel=d.phone?String(d.phone).replace(/^\+98/,'0'):'';
 var actions=el('div',{class:'mine__actions'});
 if((late||r.salon_status==='called')&&tel)actions.append(el('a',{class:'btn btn--primary btn--sm',href:'tel:'+tel,html:ICO.phone+'<span>تماس با سالن</span>'}));
 if(r.salon_status==='declined')actions.append(el('button',{class:'btn btn--soft btn--sm',type:'button',onclick:function(){go(state.original?2:1)},text:'امتحان یک مدل دیگر'}));
 if(!r.followed&&follow&&r.salon_status==='new'){if(follow.telegram)actions.append(el('a',{class:'btn btn--ghost btn--sm',href:follow.telegram,target:'_blank',rel:'noopener',onclick:function(){track('follow','telegram')},text:'خبرم کن در تلگرام'}));if(follow.bale)actions.append(el('a',{class:'btn btn--ghost btn--sm',href:follow.bale,target:'_blank',rel:'noopener',onclick:function(){track('follow','bale')},text:'خبرم کن در بله'}))}
 box.replaceChildren(el('div',{class:'panel mine mine--'+st[2]},[
  el('div',{class:'mine__head'},[el('span',{class:'mine__icon','aria-hidden':'true',text:st[0]}),el('div',{},[h('b',late?'سالن هنوز جواب نداده':st[1]),h('span',(r.look?r.look+'، ':'')+fmt(r.created_at),'mine__meta')])]),
  el('ol',{class:'mine__steps'},steps.map(function(t,i){return el('li',{class:i<reached?'is-on':''},[el('span',{}),el('b',{text:t})])})),
  late?h('p','معمولاً سالن‌ها در یکی دو روز تماس می‌گیرند. اگر عجله داری، مستقیم زنگ بزن.','mine__note'):null,
  actions.childNodes.length?actions:null
 ]));
 box.hidden=false;
}

/* ---------- first-visit tour: welcome card, then a spotlight that glides between parts ---------- */
var TOUR_KEY='ayneh-tour-v1';
function tourSteps(){
 var gallery=$('#side .gallery'),dockBtn=$('#dock:not([hidden]) .btn--primary');
 var mobile=window.matchMedia('(max-width:959px)').matches;
 return [
  {el:'#steps',title:'سه قدم تا مدل جدید',text:'اینجا همیشه می‌بینی کجای کاری: عکس خودت، انتخاب مدل و رنگ، و دیدن نتیجه. هر وقت خواستی روی هر قدم بزن و برگرد.'},
  {el:state.original?'#flow .photo':'#flow .upload',title:'اول، عکس خودت',text:'یک عکس روبه‌رو با نور خوب بگذار. مدل انتخابی روی همین عکس امتحان می‌شود و عکست فقط برای همین سالن است.'},
  gallery?{el:'#side .gallery',title:'کارهای واقعی سالن',text:'روی هر کار بزن تا همان مدل و رنگ را روی عکس خودت ببینی.'}:null,
  {el:'.about-btn',title:'همه‌چیز دربارهٔ سالن',text:'آدرس، شماره، ساعت کاری و صفحه‌های سالن اینجاست.'},
  {el:mobile&&dockBtn?'#dock .dock__inner':'.hero__cta .btn',title:'آماده‌ای؟',text:'بعد از دیدن نتیجه، با یک دکمه عکس و مدلت در تلگرام برای آرایشگر فرستاده می‌شود و خود سالن با تو تماس می‌گیرد.',last:true}
 ].filter(function(s){return s&&$(s.el)});
}
function maybeTour(){try{if(localStorage.getItem(TOUR_KEY))return}catch(e){return}if(state.busy)return;setTimeout(startTour,700)}
function startTour(){
 if($('.tour'))return;
 var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 track('tour_start');
 var root=el('div',{class:'tour'+(reduce?' tour--still':''),role:'dialog','aria-modal':'true','aria-labelledby':'tour-title'});
 var spot=el('div',{class:'tour__spot','aria-hidden':'true'});
 var card=el('div',{class:'tour__card',tabindex:'-1'});
 root.append(spot,card);document.body.append(root);document.body.classList.add('is-touring');
 var steps=[],i=-1,lastFocus=document.activeElement;
 function done(how){track(how==='done'?'tour_done':'tour_skip');try{localStorage.setItem(TOUR_KEY,'1')}catch(e){}window.removeEventListener('resize',place);window.removeEventListener('keydown',keys);root.classList.add('is-leaving');setTimeout(function(){root.remove();document.body.classList.remove('is-touring')},reduce?0:220);if(lastFocus&&lastFocus.focus)lastFocus.focus()}
 function keys(e){if(e.key==='Escape')done();else if(i>=0&&(e.key==='ArrowLeft'))go(i+1);else if(i>0&&e.key==='ArrowRight')go(i-1)}
 window.addEventListener('keydown',keys);
 function welcome(){
  root.classList.add('tour--welcome');
  card.replaceChildren(
   demoCompare('tour__demo')||null,
   el('h2',{id:'tour-title',class:'tour__title',text:'به آینه خوش آمدی'}),
   el('p',{class:'tour__text',text:'قبل از اینکه روی صندلی «'+state.pub.salon.name+'» بنشینی، مدل و رنگ موی بعدی‌ات را روی عکس خودت ببین.'}),
   el('ol',{class:'tour__path'},[
    el('li',{},[el('span',{html:ICO.camera}),el('b',{text:'عکس تو'})]),
    el('li',{},[el('span',{html:ICO.scissors}),el('b',{text:'مدل و رنگ'})]),
    el('li',{},[el('span',{html:ICO.send}),el('b',{text:'ببین و بفرست'})])
   ]),
   el('div',{class:'tour__actions'},[
    el('button',{class:'btn btn--primary btn--block',type:'button',text:'نشانم بده',onclick:function(){root.classList.remove('tour--welcome');steps=tourSteps();go(0)}}),
    el('button',{class:'btn btn--ghost btn--block tour__skip',type:'button',text:'بلدم، شروع کنیم',onclick:done})
   ])
  );
  card.focus();
 }
 function go(n){
  if(n>=steps.length){done();return}
  i=n;var s=steps[i],target=$(s.el);if(!target){go(i+1);return}
  target.scrollIntoView({block:'center',behavior:reduce?'auto':'smooth'});
  var dots=el('div',{class:'tour__dots','aria-label':'قدم '+fa(i+1)+' از '+fa(steps.length)},steps.map(function(_,k){return el('span',{class:k===i?'is-on':k<i?'is-done':''})}));
  card.replaceChildren(
   el('div',{class:'tour__top'},[dots,el('button',{class:'tour__x',type:'button','aria-label':'بستن راهنما',text:'×',onclick:done})]),
   el('h2',{id:'tour-title',class:'tour__title',text:s.title}),
   el('p',{class:'tour__text',text:s.text}),
   el('div',{class:'tour__nav'},[
    i>0?el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'قبلی',onclick:function(){go(i-1)}}):el('button',{class:'btn btn--ghost btn--sm',type:'button',text:'رد شو',onclick:done}),
    el('span',{class:'tour__count',text:fa(i+1)+' از '+fa(steps.length)}),
    el('button',{class:'btn btn--primary btn--sm',type:'button',text:s.last?'شروع کنیم':'بعدی',onclick:function(){if(s.last){done('done');var p=$('#pick');if(p&&!state.original)setTimeout(function(){var u=$('#flow .upload');if(u)u.scrollIntoView({block:'center',behavior:'smooth'})},250)}else go(i+1)}})
   ])
  );
  setTimeout(place,reduce?0:320);place();card.focus({preventScroll:true});
 }
 function place(){
  if(i<0)return;var t=$(steps[i].el);if(!t)return;var r=t.getBoundingClientRect(),pad=8,vw=window.innerWidth,vh=window.innerHeight;
  var x=Math.max(6,r.left-pad),y=Math.max(6,r.top-pad),w=Math.min(vw-12,r.width+pad*2),hgt=Math.min(vh-12,r.height+pad*2);
  spot.style.transform='translate('+x+'px,'+y+'px)';spot.style.width=w+'px';spot.style.height=hgt+'px';
  var cw=Math.min(360,vw-24),ch=card.offsetHeight||200,below=y+hgt+12,above=y-12-ch;
  var top=below+ch<vh-8?below:(above>8?above:Math.max(8,vh-ch-8));
  var left=Math.min(Math.max(12,x+w/2-cw/2),vw-cw-12);
  card.style.width=cw+'px';card.style.transform='translate('+left+'px,'+top+'px)';
 }
 window.addEventListener('resize',place);
 window.addEventListener('scroll',function(){if(document.body.contains(root))place()},{passive:true});
 welcome();
}

/* ---------- session ---------- */
function ensureSession(){
 if(state.session)return Promise.resolve();
 return api('session').then(function(d){state.session=true;applyVerified(d)}).catch(function(){
  state.verified=false;
  return api('session',{}).then(function(){state.session=true});
 });
}

/* ---------- phone verification (SMS code) ---------- */
function applyVerified(d){
 if(!d||!d.verified)return;
 state.verified=true;
 state.me=Object.assign({},state.me||{},{name:d.name||'',phone:d.phone?'0'+String(d.phone).replace(/^\+98/,''):''});
}
function needsVerify(msg){return /را تأیید کن/.test(String(msg||''))}
function openOtp(next){
 var timer=null;
 function shut(){clearInterval(timer);closeSheet()}
 var panel=el('div',{class:'sheet__panel'});
 var head=el('div',{class:'sheet__head'},[h('h2','تأیید شمارهٔ موبایل'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:shut})]);
 var me=state.me||{},bits=String(me.name||'').trim().split(/\s+/);
 var firstWrap=wrapField('otpFirst','نام','text',bits[0]||'','',{autocomplete:'given-name'});
 var lastWrap=wrapField('otpLast','نام خانوادگی','text',bits.slice(1).join(' '),'',{autocomplete:'family-name'});
 var phoneWrap=wrapField('otpPhone','شمارهٔ موبایل','tel',me.phone||'','۰۹۱۲۱۲۳۴۵۶۷',{inputmode:'tel',autocomplete:'tel'});
 var sendBtn=el('button',{class:'btn btn--primary btn--block',type:'submit',text:'ارسال کد تأیید'});
 var form=el('form',{novalidate:'true'},[firstWrap,lastWrap,phoneWrap,sendBtn]);
 var last=null;
 panel.append(head,h('p','برای ساخت شبیه‌سازی، اول شمارهٔ موبایلت را تأیید می‌کنیم. یک کد پیامکی برایت می‌فرستیم. نام و شمارهات فقط برای همین سالن و پیگیری درخواستت استفاده می‌شود و بعد از ۳۰ روز از آینه پاک می‌شود.','muted'),form);
 function codeStep(){
  var codeWrap=wrapField('otpCode','کد پیامک‌شده','text','','',{autocomplete:'one-time-code',inputmode:'numeric'});
  codeWrap.querySelector('input').setAttribute('dir','ltr');
  var verify=el('button',{class:'btn btn--primary btn--block',type:'submit',text:'تأیید'});
  var again=el('button',{class:'btn btn--ghost btn--block',type:'button',disabled:true,text:''});
  var f2=el('form',{novalidate:'true'},[codeWrap,verify,again]);
  panel.replaceChildren(head,h('p','کد به '+last.shown+' پیامک شد. تا چند لحظهٔ دیگر می‌رسد.','muted'),f2);
  var left=60;
  function tickDown(){
   if(!panel.isConnected){clearInterval(timer);return}
   again.disabled=left>0;again.textContent=left>0?'ارسال دوبارهٔ کد تا '+fa(left)+' ثانیه دیگر':'ارسال دوبارهٔ کد';
   if(left>0)left--;
  }
  clearInterval(timer);tickDown();timer=setInterval(tickDown,1000);
  setTimeout(function(){var i=codeWrap.querySelector('input');if(i)i.focus()},50);
  again.addEventListener('click',function(){
   again.disabled=true;
   api('otp/send',last.body).then(function(){left=60;toast('کد تازه فرستاده شد')}).catch(function(err){toast(err.message,'error')});
  });
  f2.addEventListener('submit',function(e){
   e.preventDefault();
   var code=codeWrap.querySelector('input').value.trim();
   var ok=validate(codeWrap,function(){return /^[0-9۰-۹٠-٩]{3,12}$/.test(code)},'کد را همان‌طور که پیامک شده بنویس');
   if(!ok)return;
   verify.disabled=true;verify.textContent='در حال بررسی…';
   api('otp/verify',{code:code}).then(function(d){
    state.verified=true;
    state.me=Object.assign({},state.me||{},{name:d.name,phone:'0'+String(d.phone).replace(/^\+98/,'')});
    try{localStorage.setItem('ayneh-me',JSON.stringify(state.me))}catch(err){}
    shut();toast('شمارهات تأیید شد');
    if(next)next();
   }).catch(function(err){verify.disabled=false;verify.textContent='تأیید';toast(err.message,'error')});
  });
 }
 form.addEventListener('submit',function(e){
  e.preventDefault();
  var first=firstWrap.querySelector('input').value.trim(),lastName=lastWrap.querySelector('input').value.trim();
  var okFirst=validate(firstWrap,function(){return first.length>=2},'نام را بنویس');
  var okLast=validate(lastWrap,function(){return lastName.length>=2},'نام خانوادگی را بنویس');
  var num=normalizePhone(phoneWrap.querySelector('input').value);
  var okPhone=validate(phoneWrap,function(){return /^\+989\d{9}$/.test(num)},'شمارهٔ موبایل درست نیست؛ مثل ۰۹۱۲۱۲۳۴۵۶۷');
  if(!okFirst||!okLast||!okPhone)return;
  sendBtn.disabled=true;sendBtn.textContent='در حال فرستادن…';
  ensureSession().then(function(){
   var body={first_name:first,last_name:lastName,phone:num};
   return api('otp/send',body).then(function(){last={body:body,shown:'0'+num.slice(3)};codeStep()});
  }).catch(function(err){sendBtn.disabled=false;sendBtn.textContent='ارسال کد تأیید';toast(err.message,'error')});
 });
 openSheet(panel);
}

/* ---------- send to the salon (Telegram) ---------- */
function openRequest(){
 track('send_open');
 if(!state.original){toast('اول عکس خودت را اضافه کن');go(1);return}
 var s=state.pub.salon,p=s.profile||{};
 var panel=el('div',{class:'sheet__panel'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','فرستادن برای آرایشگر'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 if(!state.pub.telegram){
  panel.append(notice('info','«'+s.name+'» هنوز دریافت آنلاین را فعال نکرده. عکس نتیجه را دانلود کن و از یکی از این راه‌ها برای سالن بفرست.'));
  var ways=el('div',{class:'about__quick',style:'margin-top:14px'});
  if(p.phone)ways.append(el('a',{class:'btn btn--primary',href:'tel:'+p.phone,html:ICO.phone+'<span>تماس با سالن</span>'}));
  if(p.telegram)ways.append(el('a',{class:'btn btn--ghost',href:p.telegram,target:'_blank',rel:'noopener noreferrer',html:ICO.send+'<span>تلگرام سالن</span>'}));
  if(p.instagram)ways.append(el('a',{class:'btn btn--ghost',href:p.instagram,target:'_blank',rel:'noopener noreferrer',html:ICO.instagram+'<span>اینستاگرام</span>'}));
  if(state.result)ways.append(el('a',{class:'btn btn--ghost',href:media(state.result),download:'ayneh.png',html:ICO.download+'<span>دانلود نتیجه</span>'}));
  panel.append(ways);openSheet(panel);return;
 }
 // What goes, and where: said plainly before anything is typed.
 var thumbs=el('div',{class:'outbox__thumbs'},[
  el('img',{src:media(state.original),alt:'عکس تو'}),
  state.result?el('img',{src:media(state.result),alt:'نتیجه'}):null,
  state.reference&&!state.refTitle?el('img',{src:media(state.reference),alt:'عکس مدل'}):null
 ]);
 panel.append(el('div',{class:'outbox'},[thumbs,el('div',{},[
  h('b','در تلگرام برای «'+s.name+'» فرستاده می‌شود'),
  h('p',[state.result?'عکس خودت و نتیجهٔ شبیه‌سازی':'عکس خودت',lookName()?'مدل: '+lookName():'',state.color?'رنگ: '+state.color:''].filter(Boolean).join('، ')+'، به همراه نام، شماره و توضیحت.')
 ])]));
 panel.append(el('ol',{class:'how'},[
  el('li',{text:'پیام همین الان در تلگرام به دست سالن می‌رسد.'}),
  el('li',{text:'آرایشگر عکس‌ها را می‌بیند و امکان اجرا را بررسی می‌کند.'}),
  el('li',{text:'خود سالن به شماره‌ات زنگ می‌زند'+' یا اگر آیدی تلگرام بدهی، همان‌جا پیام می‌دهد.'})
 ]));
 var form=el('form',{novalidate:'true'});
 var nameWrap=wrapField('name','نام و نام خانوادگی','text',state.me&&state.me.name||'','',{autocomplete:'name'});
 var phoneWrap=wrapField('phone','شمارهٔ موبایل','tel',state.me&&state.me.phone||'','۰۹۱۲۱۲۳۴۵۶۷',{inputmode:'tel',autocomplete:'tel'});
 var tgWrap=wrapField('tgid','آیدی تلگرام (اختیاری)','text',state.me&&state.me.telegram||'','@username',{autocomplete:'off'});
 tgWrap.querySelector('input').setAttribute('dir','ltr');
 if(state.verified){nameWrap.querySelector('input').readOnly=true;phoneWrap.querySelector('input').readOnly=true}
 var note=el('textarea',{id:'rnote',placeholder:'مثلاً سابقهٔ رنگ یا حنا، حساسیت پوستی، یا هر چیزی که آرایشگر باید بداند'});
 var consent=el('input',{type:'checkbox',id:'dataConsent'});
 var submit=el('button',{class:'btn btn--primary btn--block',type:'submit',html:ICO.send+'<span>فرستادن</span>'});
 form.append(nameWrap,phoneWrap,tgWrap,el('label',{class:'field'},[el('span',{class:'lbl',text:'توضیح برای آرایشگر (اختیاری)'}),note]),
  el('label',{class:'check'},[consent,el('span',{text:'موافقم عکس‌ها، اسم و شماره‌ام برای این سالن فرستاده شود. سابقهٔ آن در آینه بعد از ۳۰ روز پاک می‌شود.'})]),submit);
 form.addEventListener('submit',function(e){
  e.preventDefault();
  var okName=validate(nameWrap,function(){return nameWrap.querySelector('input').value.trim().length>=3},'نام و نام خانوادگی‌ات را بنویس');
  var phoneVal=normalizePhone(phoneWrap.querySelector('input').value);
  var okPhone=validate(phoneWrap,function(){return /^\+989\d{9}$/.test(phoneVal)},'شمارهٔ موبایل درست نیست؛ مثل ۰۹۱۲۱۲۳۴۵۶۷');
  var tg=tgWrap.querySelector('input').value.trim().replace(/^@/,'').replace(/^https?:\/\/t\.me\//,'');
  var okTg=validate(tgWrap,function(){return !tg||/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(tg)},'آیدی تلگرام فقط حروف انگلیسی، عدد و _ است');
  if(!consent.checked){consent.closest('.check').style.color='var(--danger)';toast('رضایت فرستادن را تأیید کن','error');return}
  if(!okName||!okPhone||!okTg)return;
  submit.disabled=true;submit.textContent='در حال فرستادن…';
  state.me={name:nameWrap.querySelector('input').value.trim(),phone:phoneWrap.querySelector('input').value.trim(),telegram:tg};
  try{localStorage.setItem('ayneh-me',JSON.stringify(state.me))}catch(err){}
  ensureSession().then(function(){
   state.sendIdem=state.sendIdem||uuid();
   return api('leads',{data_consent:true,idem:state.sendIdem,name:state.me.name,phone:phoneVal,telegram:tg,note:note.value,original_id:state.original,reference_id:state.reference||undefined,preview_id:state.result||undefined,look:lookName(),color:state.color||'',v:VISITOR});
  }).then(function(d){
   state.sendIdem=null;
   var follow=d.follow||{},fl=[];state.sentOnce=true;try{localStorage.setItem('ayneh-sent-'+SLUG,'1');localStorage.setItem('ayneh-follow-'+SLUG,JSON.stringify(follow))}catch(err){}
   if(follow.telegram)fl.push(el('a',{class:'btn btn--primary btn--block',href:follow.telegram,target:'_blank',rel:'noopener',onclick:function(){track('follow','telegram')},html:ICO.send+'<span>خبرم کن در تلگرام</span>'}));
   if(follow.bale)fl.push(el('a',{class:'btn btn--soft btn--block',href:follow.bale,target:'_blank',rel:'noopener',onclick:function(){track('follow','bale')},html:ICO.send+'<span>خبرم کن در بله</span>'}));
   setTimeout(loadMine,600);
   panel.replaceChildren(el('div',{class:'sent'},[
    el('span',{class:'sent__mark',html:ICO.check}),
    h('h2',d.delivered?'برای سالن فرستاده شد':'در صف ارسال است'),
    h('p',d.delivered?'«'+s.name+'» عکس و مدلت را در تلگرام دریافت کرد. منتظر تماس سالن'+(tg?' یا پیامش در تلگرام':'')+' باش.':'تلگرام الان جواب نداد؛ درخواستت ذخیره شد و چند دقیقهٔ دیگر خودکار برای سالن فرستاده می‌شود.'),
    fl.length?el('div',{class:'sent__follow'},[h('p','می‌خواهی وقتی سالن جواب داد خبردار شوی؟ یک بار ربات را باز کن و Start بزن.','sent__hint')].concat(fl)):null,
    el('button',{class:fl.length?'btn btn--ghost btn--block':'btn btn--primary btn--block',type:'button',onclick:closeSheet,text:fl.length?'نه، ممنون':'باشه'})
   ]));
  }).catch(function(err){submit.disabled=false;submit.innerHTML=ICO.send+'<span>فرستادن</span>';if(needsVerify(err.message)){state.verified=false;openOtp(openRequest);return}toast(err.message,'error')});
 });
 panel.append(form);
 openSheet(panel);
}

function wrapField(id,label,type,value,placeholder,extra){
 var input=el('input',{id:id,type:type,value:value||'',placeholder:placeholder||'',autocomplete:extra&&extra.autocomplete||'off',inputmode:extra&&extra.inputmode||null});
 var err=el('span',{class:'err',text:''});
 return el('label',{class:'field','data-invalid':'false'},[el('span',{class:'lbl',text:label}),input,err]);
}
function validate(wrap,test,msg){
 var ok=test();
 wrap.setAttribute('data-invalid',ok?'false':'true');
 var e=wrap.querySelector('.err');if(e)e.textContent=ok?'':msg;
 return ok;
}
function normalizePhone(v){
 var s=String(v||'').replace(/[۰-۹]/g,function(d){return '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)}).replace(/[٠-٩]/g,function(d){return '٠١٢٣٤٥٦٧٨٩'.indexOf(d)}).replace(/[\s()+-]/g,'');
 if(/^09\d{9}$/.test(s))return '+98'+s.slice(1);
 if(/^9\d{9}$/.test(s))return '+98'+s;
 if(/^00989\d{9}$/.test(s))return '+98'+s.slice(4);
 if(/^989\d{9}$/.test(s))return '+'+s;
 return s;
}

/* ---------- sheet ---------- */
function openSheet(node){
 var d=$('#sheet');
 d.replaceChildren(node);
 if(!d.open)d.showModal();
}
function closeSheet(){var d=$('#sheet');if(d&&d.open)d.close()}

document.addEventListener('click',function(e){
 if(e.target&&e.target.classList&&e.target.classList.contains('sheet'))closeSheet();
});
`;

export const customerHTML=String.raw`<!doctype html><html lang="fa" dir="rtl"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#e8edeb">
<meta name="color-scheme" content="light">
<meta name="description" content="مدل و رنگ موی بعدی‌ات را روی عکس خودت ببین و برای بررسی به آرایشگر بفرست.">
<meta property="og:title" content="آینه | مشاورهٔ مدل و رنگ مو">
<meta property="og:description" content="مدل مو را انتخاب کن، عکس خودت را اضافه کن و نتیجه را برای بررسی به سالن بفرست.">
<meta property="og:type" content="website">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/vazirmatn-arabic.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/estedad-arabic.woff2" as="font" type="font/woff2" crossorigin>
<title>آینه | مشاورهٔ مو</title>
<style>__CSS__</style>
</head><body>
<a class="skip" href="#main">پرش به محتوای اصلی</a>
<header class="hero" id="head"><div class="wrap"><div class="hero__bar"><div class="skel" style="width:70px;height:22px"></div></div><div class="hero__grid"><div class="skel" style="aspect-ratio:3/4;border-radius:999px 999px 18px 18px"></div><div><div class="skel" style="width:80%;height:40px"></div><div class="skel" style="width:60%;height:14px;margin-top:14px"></div></div></div></div></header>
<nav class="steps" id="steps" aria-label="مراحل" hidden></nav>
<main class="wrap" id="main">
 <div class="layout">
  <div class="flowcol"><section id="mine" aria-live="polite" hidden></section>
  <section id="flow" aria-live="polite"><div class="panel flow"><div class="skel" style="height:26px;width:46%"></div><div class="skel" style="width:min(100%,280px);aspect-ratio:3/4;margin:20px auto 0;border-radius:999px 999px 18px 18px"></div></div></section></div>
  <aside class="side" id="side" aria-label="دربارهٔ سالن"></aside>
 </div>
 <footer class="foot" id="foot" style="padding-bottom:130px">شبیه‌سازی پیشنهادی است و اجرای دقیق را تضمین نمی‌کند. عکس‌ها فقط برای همین سالن استفاده می‌شوند و حداکثر ۳۰ روز نگه داشته می‌شوند.</footer>
</main>
<div class="dock" id="dock" hidden></div>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<dialog class="sheet" id="sheet" aria-label="پنجره"></dialog>
<script>__JS__</script>
</body></html>`
 .replace('__CSS__',()=>baseCSS+customerCSS)
 .replace('__JS__',()=>clientJS.replace('__STYLES__',()=>JSON.stringify(styles)).replace('__MARK__',()=>JSON.stringify(markSVG)));
