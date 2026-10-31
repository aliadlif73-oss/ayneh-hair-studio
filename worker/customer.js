import {styles} from './legacy.js';
import {baseCSS,markSVG} from './design.js';

const customerCSS=String.raw`
/* ---------- hero: the salon in its mirror ---------- */
.hero{position:relative;padding:18px 0 26px}
.hero__bar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:18px}
.brand{display:inline-flex;align-items:center;gap:8px;color:var(--ink-2);font-size:13px;font-weight:600}
.brand svg{width:20px;height:25px}
.hero__actions{display:flex;gap:8px}
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
.hero__meta{display:grid;gap:6px;margin-top:12px;font-size:13px;color:var(--ink-2)}
.hero__meta span{display:flex;gap:7px;align-items:flex-start;line-height:1.7}
.hero__meta svg{width:16px;height:16px;flex:none;margin-top:3px;color:var(--accent)}
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
.compare{position:relative;aspect-ratio:3/4;overflow:hidden;border-radius:999px 999px calc(var(--r) - 5px) calc(var(--r) - 5px);background:var(--glass-2)}
.compare img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.compare__after{position:absolute;inset:0;clip-path:inset(0 0 0 var(--cut,50%))}
.compare__handle{position:absolute;top:0;bottom:0;width:2px;background:#fff;inset-inline-start:var(--cut,50%);transform:translateX(50%);box-shadow:0 0 0 1px rgba(0,0,0,.08)}
.compare__grip{position:absolute;top:58%;inset-inline-start:var(--cut,50%);transform:translate(50%,-50%);width:44px;height:44px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:var(--lift);color:var(--ink);pointer-events:none}
.compare__grip svg{width:20px;height:20px}
.compare input[type=range]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0;z-index:3}
.compare__tag{position:absolute;bottom:12px;z-index:2;background:rgba(250,251,250,.94);padding:3px 12px;border-radius:999px;font-size:12px;font-weight:700;color:var(--ink-2)}
.compare__tag--before{inset-inline-end:12px}
.compare__tag--after{inset-inline-start:12px}
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
.req-cta{display:flex;align-items:center;gap:12px;justify-content:space-between}
.req-cta p{font-size:13px;color:var(--muted);line-height:1.8}
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

/* ---------- requests sheet ---------- */
.requests{display:grid;gap:12px}
.req{border:1px solid var(--line-2);border-radius:var(--r);padding:14px;background:var(--surface-2)}
.req__top{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}
.req__top b{font-size:15px}
.req__time{border-radius:12px;padding:10px 12px;margin-top:12px;font-size:13px;line-height:1.9;background:#fff;border-inline-start:3px solid var(--accent)}
.req__time b{display:block}
.req__actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.thumbs{display:flex;gap:10px;margin-top:12px}
.thumbs a{width:76px}
.thumbs img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:999px 999px 10px 10px;background:var(--glass-2)}
.thumbs span{display:block;font-size:11.5px;color:var(--muted);margin-top:4px;text-align:center}
.pref{margin-top:16px;padding:14px;border-radius:var(--r);background:var(--glass)}
.pref h3{font-size:15px}
.when-pick{display:grid;grid-template-columns:1.6fr 1fr;gap:10px;margin-top:-4px}
.when-pick .field{margin-bottom:12px}
.views-wrap{position:relative;border-radius:var(--r);overflow:hidden;aspect-ratio:3/2;background:var(--glass-2);background-size:400% 200%;background-position:0% 0%;transition:background-position .25s var(--ease)}
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
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12H4M10 6l-6 6 6 6"/></svg>',};
var state={pub:null,step:1,original:null,reference:null,style:null,tab:'salon',transfer:'both',color:'',result:null,gen:null,genState:null,busy:false,error:'',requests:null,customer:null,session:false,idem:null,rating:0,when:'none'};
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

/* ---------- boot ---------- */
(async function boot(){
 var accessPath=/\/access\/?$/.test(location.pathname);
 if(accessPath){
  var raw=location.hash.slice(1);
  if(raw){try{await api('access',{token:raw});state.session=true;history.replaceState(null,'',location.pathname.replace(/\/access\/?$/,'/'))}catch(e){}}
 }
 try{state.pub=await api('public')}catch(e){showFatal(e.message);return}
 document.title=state.pub.salon.name+' | آینه';
 renderHead();renderSteps();renderFlow();renderSide();renderDock();
 var pending=sessionStorage.getItem('ayneh-job-'+SLUG);
 if(pending){state.gen=pending;state.step=3;state.busy=true;renderFlow();renderDock();poll(pending,true)}
 loadRequests(true);
})();

function showFatal(msg){
 var main=$('#main');if(!main)return;
 main.replaceChildren(el('div',{class:'panel fatal'},[h('h1','این صفحه باز نشد'),h('p',msg,'muted'),el('a',{class:'btn btn--primary',href:'/',text:'بازگشت به آینه'})]));
 var dock=$('#dock');if(dock)dock.hidden=true;
}

/* ---------- header ---------- */
function renderHead(){
 var s=state.pub.salon,p=s.profile||{},head=$('#head');
 var bar=el('div',{class:'hero__bar'},[el('span',{class:'brand',html:MARK+'<span>آینه</span>'})]);
 var actions=el('div',{class:'hero__actions'});
 if(p.phone)actions.append(el('a',{class:'icon-btn',href:'tel:'+p.phone,'aria-label':'تماس با سالن',html:ICO.phone}));
 if(p.map)actions.append(el('a',{class:'icon-btn',href:p.map,target:'_blank',rel:'noopener noreferrer','aria-label':'موقعیت روی نقشه',html:ICO.pin}));
 if(p.instagram)actions.append(el('a',{class:'icon-btn',href:p.instagram,target:'_blank',rel:'noopener noreferrer','aria-label':'اینستاگرام',html:ICO.instagram}));
 if(p.website)actions.append(el('a',{class:'icon-btn',href:p.website,target:'_blank',rel:'noopener noreferrer','aria-label':'وب‌سایت',html:ICO.globe}));
 bar.append(actions);
 var glass=el('div',{class:'mirror__glass'+(p.cover?'':' mirror__glass--empty')});
 if(p.cover)glass.append(el('img',{src:media(p.cover),alt:'',fetchpriority:'high'}));
 else if(p.logo)glass.append(el('img',{src:media(p.logo),alt:''}));
 var mirror=el('div',{class:'mirror hero__mirror'},[glass]);
 if(p.cover&&p.logo)mirror.append(el('img',{class:'hero__logo',src:media(p.logo),alt:''}));
 var text=el('div',{class:'hero__text'},[el('h1',{class:'hero__name',text:s.name})]);
 var meta=el('div',{class:'hero__meta'});
 if(p.address)meta.append(el('span',{},[el('span',{html:ICO.pin}),el('span',{text:p.address})]));
 if(p.hours)meta.append(el('span',{},[el('span',{html:ICO.clock}),el('span',{text:p.hours})]));
 if(meta.childNodes.length)text.append(meta);
 var grid=el('div',{class:'hero__grid'},[mirror,text]);
 if(p.bio)grid.append(el('p',{class:'hero__bio',text:p.bio}));
 grid.append(el('div',{class:'hero__cta'},[el('button',{class:'btn btn--primary',type:'button',onclick:function(){go(state.original?2:1)},html:ICO.camera+'<span>مدل جدیدت را روی عکس خودت ببین</span>'})]));
 head.replaceChildren(el('div',{class:'wrap'},[bar,grid]));
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
  box.append(input,el('div',{class:'shoot'},[drop,side]));
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
 box.append(flowHead('مدل مو را انتخاب کن','از کارهای واقعی همین سالن، مدل‌های آماده یا عکس مدلی که خودت پیدا کرده‌ای.'));
 var seg=el('div',{class:'seg',role:'tablist'});
 [['salon','کارهای سالن'],['catalog','مدل‌های آماده'],['upload','عکس مدل من']].forEach(function(x){
  var b=el('button',{type:'button',role:'tab','aria-selected':state.tab===x[0]?'true':'false',text:x[1]});
  b.addEventListener('click',function(){state.tab=x[0];renderFlow()});
  seg.append(b);
 });
 box.append(seg);
 if(state.tab==='salon'){
  var items=(state.pub.portfolio||[]).filter(function(p){return p.published||p.try_on});
  if(!items.length)box.append(notice('info','سالن هنوز نمونه‌کاری منتشر نکرده. از «مدل‌های آماده» یا عکس مدل خودت استفاده کن.'));
  else{
   var rail=el('div',{class:'rail'});
   items.forEach(function(p){
    var imgs=[];try{imgs=JSON.parse(p.images||'[]')}catch(e){}
    if(!imgs.length)return;
    var card=el('button',{class:'port-card'+(state.reference===imgs[0]?' is-on':''),type:'button','aria-pressed':state.reference===imgs[0]?'true':'false'},[
     el('span',{class:'mirror'},[el('span',{class:'mirror__glass',style:'display:block'},[el('img',{src:media(imgs[0]),alt:p.title,loading:'lazy'})])]),
     el('span',{class:'pc-name',text:p.title})
    ]);
    card.addEventListener('click',function(){state.reference=imgs[0];state.style=null;state.transfer='both';state.result=null;renderFlow();renderDock()});
    rail.append(card);
   });
   box.append(rail);
   box.append(el('p',{class:'tiny muted',style:'margin-top:6px',text:'مدل و رنگ موی کار انتخابی روی عکس تو شبیه‌سازی می‌شود.'}));
  }
  if(state.reference)box.append(pickedBar('یک کار سالن انتخاب شد',function(){state.reference=null;renderFlow();renderDock()}));
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
   var card=el('button',{class:'style-card'+(on?' is-on':''),type:'button','aria-pressed':on?'true':'false'},[
    el('span',{class:'style-card__name',text:s[0]}),
    el('span',{class:'style-card__en',text:s[1]}),
    el('span',{class:'style-card__tag',text:s[2]})
   ]);
   card.addEventListener('click',function(){state.style=i;state.reference=null;state.result=null;renderFlow();renderDock()});
   grid.append(card);
  });
  box.append(grid);
  var colorField=field('color','رنگ دلخواه (اختیاری)','مثلاً بلوند عسلی، مسی، قهوه‌ای شکلاتی، بالیاژ سرد','text',state.color,function(v){state.color=v});
  colorField.style.marginTop='18px';
  box.append(colorField);
  if(state.style!==null)box.append(pickedBar('مدل انتخابی: '+STYLES[state.style][0],function(){state.style=null;renderFlow();renderDock()}));
 }else{
  if(!state.reference){
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
   box.append(pickedBar('عکس مرجع اضافه شد',function(){state.reference=null;renderFlow();renderDock()}));
   var tr=filtersRow([['style','فقط مدل مو'],['color','فقط رنگ مو'],['both','مدل و رنگ']],state.transfer,function(v){state.transfer=v;renderFlow()});
   box.append(el('div',{style:'margin-top:16px'},[h('p','چه چیزی از این عکس منتقل شود؟','lbl'),tr]));
  }
 }
 if(state.reference&&!state.pub.reference)box.append(notice('warn','انتقال از عکس مرجع برای این سالن هنوز فعال نشده است. می‌توانی مدل‌های آماده را انتخاب کنی یا همین عکس را برای بررسی به آرایشگر بفرستی.'));
 box.append(el('div',{class:'flow__nav'},[
  el('button',{class:'btn btn--ghost',type:'button',onclick:function(){go(1)},text:'بازگشت'}),
  el('button',{class:'btn btn--primary',type:'button',onclick:function(){if(!hasChoice()){toast(missingReason());return}go(3)},text:'ادامه: نتیجه'})
 ]));
 return box;
}
function hasChoice(){return !!state.original&&(state.style!==null||!!state.reference)}
function canGenerate(){return !!state.original&&(state.style!==null||!!state.reference)&&!!state.pub.generation&&(!state.reference||!!state.pub.reference)}
function missingReason(){
 if(!state.original)return 'اول عکس خودت را اضافه کن';
 if(!state.pub.generation)return 'تولید شبیه‌سازی برای این سالن فعال نیست؛ می‌توانی درخواست بررسی بفرستی';
 if(state.reference&&!state.pub.reference)return 'انتقال عکس مرجع هنوز فعال نشده است';
 return 'یک مدل انتخاب کن';
}
function stepResult(){
 var box=el('div',{class:'panel flow'});
 box.append(flowHead(state.result?'خودت با مدل جدید':'نتیجه و ارسال','این تصویر یک شبیه‌سازی پیشنهادی است، نه تضمین اجرا. تصمیم نهایی با آرایشگر است.'));
 var model=state.style!==null&&!state.reference?STYLES[state.style][0]:(state.reference?'عکس مرجع انتخاب‌شده':'انتخاب نشده');
 box.append(el('div',{class:'summary'},[
  state.original?el('img',{src:media(state.original),alt:''}):null,
  el('div',{class:'grow'},[el('b',{text:'مدل: '+model}),state.color?el('div',{class:'summary__meta',text:'رنگ: '+state.color}):el('div',{class:'summary__meta',text:'روی عکس خودت'})]),
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
   el('a',{class:'btn btn--ghost btn--sm',href:media(state.result),download:'ayneh.png',html:ICO.download+'<span>دانلود</span>'}),
   el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:openViews,html:ICO.spark+'<span>هشت نمای تخمینی</span>'}),
   el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){state.result=null;state.gen=null;state.idem=null;state.error='';state.busy=false;renderFlow();renderDock()},text:'شبیه‌سازی تازه'})
  ]));
  box.append(ratingBlock());
  box.append(el('div',{class:'flow__nav'},[
   el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>ارسال برای بررسی آرایشگر</span>'})
  ]));
 }else if(!state.busy){
  if(!state.pub.generation){
   box.append(notice('info','این سالن پیش‌نمایش تصویری را فعال نکرده. عکس و مدل انتخابی‌ات را برای آرایشگر بفرست تا امکان اجرا و زمان را بررسی کند.'));
   box.append(el('div',{class:'flow__nav'},[el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>ارسال برای بررسی آرایشگر</span>'})]));
  }else if(state.reference&&!state.pub.reference){
   box.append(notice('warn','انتقال از عکس مرجع فعال نشده؛ مدل آماده انتخاب کن یا عکس را برای بررسی بفرست.'));
   box.append(el('div',{class:'flow__nav'},[el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>ارسال برای بررسی آرایشگر</span>'})]));
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
function compareBlock(){
 var wrap=el('div',{class:'compare'});
 wrap.append(el('img',{src:media(state.original),alt:'قبل'}));
 var after=el('div',{class:'compare__after'},[el('img',{src:media(state.result),alt:'بعد'})]);
 wrap.append(after);
 wrap.append(el('div',{class:'compare__handle'}));
 wrap.append(el('div',{class:'compare__grip',html:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M8 9 4.5 12 8 15M16 9l3.5 3-3.5 3"/></svg>'}));
 wrap.append(el('span',{class:'compare__tag compare__tag--before',text:'قبل'}));
 wrap.append(el('span',{class:'compare__tag compare__tag--after',text:'بعد'}));
 var range=el('input',{type:'range',min:'0',max:'100',value:'50','aria-label':'مقایسهٔ قبل و بعد'});
 range.addEventListener('input',function(){wrap.style.setProperty('--cut',range.value+'%')});
 range.value='50';wrap.style.setProperty('--cut','50%');
 wrap.append(range);
 return el('div',{class:'mirror compare-wrap'},[wrap]);
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
function saveRating(n){try{localStorage.setItem('ayneh-rating-'+state.result,String(n))}catch(e){}}
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

/* ---------- side ---------- */
function renderSide(){
 var side=$('#side');side.replaceChildren();
 var p=state.pub.salon.profile||{};
 var gallery=(state.pub.portfolio||[]).filter(function(x){return x.published});
 if(gallery.length){
  var card=el('section',{class:'panel sidecard'},[h('h2','کارهای '+state.pub.salon.name)]);
  var grid=el('div',{class:'gallery'});
  gallery.forEach(function(item){
   var imgs=[];try{imgs=JSON.parse(item.images||'[]')}catch(e){}
   if(!imgs.length)return;
   var btn=el('button',{class:'pcard',type:'button','aria-label':'امتحان '+item.title+' روی عکس خودم'},[
    el('span',{class:'mirror',style:'display:block'},[el('span',{class:'mirror__glass',style:'display:block'},[el('img',{src:media(imgs[0]),alt:item.title,loading:'lazy'})])]),
    h('h3',item.title),el('p',{text:item.category+(item.stylist?'، '+item.stylist:'')})
   ]);
   btn.addEventListener('click',function(){state.reference=imgs[0];state.style=null;state.tab='salon';renderFlow();if(state.original)go(2);else{renderSteps();renderDock();go(1);toast('این کار انتخاب شد؛ حالا عکس خودت را اضافه کن')}});
   grid.append(btn);
  });
  card.append(grid);
  side.append(card);
 }
 var contact=el('section',{class:'panel sidecard'},[h('h2','سالن کجاست')]);
 var list=el('div',{class:'meta-list'});
 if(p.address)list.append(el('a',{href:p.map||'#',target:p.map?'_blank':null,rel:'noopener noreferrer'},[el('span',{html:ICO.pin}),el('span',{text:p.address})]));
 if(p.phone)list.append(el('a',{href:'tel:'+p.phone},[el('span',{html:ICO.phone}),el('span',{text:fa0(p.phone),dir:'ltr'})]));
 if(p.hours)list.append(el('span',{class:'mi'},[el('span',{html:ICO.clock}),el('span',{text:p.hours})]));
 if(p.instagram)list.append(el('a',{href:p.instagram,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.instagram}),el('span',{text:'اینستاگرام سالن'})]));
 if(p.telegram)list.append(el('a',{href:p.telegram,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.send}),el('span',{text:'تلگرام سالن'})]));
 if(p.website)list.append(el('a',{href:p.website,target:'_blank',rel:'noopener noreferrer'},[el('span',{html:ICO.globe}),el('span',{text:'وب‌سایت'})]));
 if(!list.childNodes.length)list.append(el('span',{class:'mi',text:'اطلاعات تماس ثبت نشده است.'}));
 contact.append(list);
 if(p.manager)contact.append(el('div',{class:'manager'},[p.portrait?el('img',{src:media(p.portrait),alt:''}):null,el('span',{text:p.manager})]));
 side.append(contact);
 side.append(el('section',{class:'panel sidecard'},[h('h2','درخواست‌های من'),el('div',{class:'req-cta'},[
  el('p',{text:'جواب آرایشگر و زمان نوبت را اینجا ببین.'}),
  el('button',{class:'btn btn--soft btn--sm',type:'button',onclick:openRequests,text:'مشاهده'})
 ])]));
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
  hint=ready?(state.pub.generation?'آمادهٔ ساخت شبیه‌سازی':'آمادهٔ ارسال برای بررسی سالن'):'یک مدل انتخاب کن';
  primary=el('button',{class:'btn btn--primary',type:'button',disabled:!ready,onclick:function(){if(!ready){toast(missingReason());return}go(3)},html:ICO.arrow+'<span>ادامه</span>'});
 }else{
  if(state.busy){hint='در حال ساخت…';primary=el('button',{class:'btn btn--primary',type:'button',disabled:true,text:'در حال ساخت…'})}
  else if(state.result){hint='خروجی آماده است';primary=el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>ارسال برای بررسی</span>'})}
  else if(!canGenerate()){hint='آمادهٔ ارسال برای آرایشگر';primary=el('button',{class:'btn btn--primary',type:'button',onclick:openRequest,html:ICO.send+'<span>ارسال برای بررسی</span>'})}
  else{hint='آمادهٔ ساخت شبیه‌سازی';primary=el('button',{class:'btn btn--primary',type:'button',onclick:generate,html:ICO.spark+'<span>ساخت شبیه‌سازی</span>'})}
 }
 inner.append(el('div',{class:'dock__hint',text:hint}),el('button',{class:'btn btn--ghost',type:'button',onclick:openRequests,text:'درخواست‌ها'}),primary);
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
  if(kind==='original'){state.original=d.id;state.result=null;state.error='';state.idem=null;state.step=2}
  else{state.reference=d.id;state.style=null;state.result=null;state.error=''}
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
 state.busy=true;state.error='';state.result=null;renderFlow();renderDock();
 ensureSession().then(function(){
  state.idem=state.idem||uuid();
  return api('generate',{image_consent:true,idem:state.idem,original_id:state.original,reference_id:state.reference||undefined,style:state.reference!==null?undefined:state.style,transfer:state.transfer,color:state.color||undefined});
 }).then(function(job){
  state.gen=job.id;state.genState=job.state;state.step=3;
  try{sessionStorage.setItem('ayneh-job-'+SLUG,job.id)}catch(e){}
  renderFlow();renderDock();
  return poll(job.id);
 }).catch(function(e){
  state.error=friendly(e.message);
  state.busy=false;renderFlow();renderDock();
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
    state.result=d.result_id;state.busy=false;state.idem=null;state.pct=100;
    try{sessionStorage.removeItem('ayneh-job-'+SLUG)}catch(e){}
    state.rating=Number(localStorage.getItem('ayneh-rating-'+d.result_id)||0);
    renderFlow();renderDock();toast('شبیه‌سازی آماده شد');
    return;
   }
   if(d.state==='fail'||d.state==='unknown'){
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
function openViews(){
 if(!state.gen)return;
 var panel=el('div',{class:'sheet__panel'});
 var body=el('div',{class:'views-wrap'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','هشت نمای تخمینی'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 panel.append(h('p','ترتیب و هماهنگی نماها تخمینی است و اسکن سه‌بعدی نیست.','tiny muted'));
 panel.append(body);
 var label=h('p','زاویهٔ ۰ درجه','tiny muted');
 var range=el('input',{type:'range',min:'0',max:'7',value:'0','aria-label':'زاویهٔ نمای تخمینی'});
 range.style.cssText='width:100%;margin-top:10px';
 range.addEventListener('input',function(){
  var n=Number(range.value),col=n%4,row=Math.floor(n/4);
  body.style.backgroundPosition=(col*33.33)+'% '+(row*100)+'%';
  label.textContent='زاویهٔ '+fa(n*45)+' درجه';
 });
 panel.append(range,label);
 openSheet(panel);
 api('views',{parent:state.gen,idem:uuid()}).then(function(job){
  return api('generation/'+job.id).then(function(d){
   if(d.state==='success'){body.style.backgroundImage='url('+media(d.result_id)+')';return}
   return sleep(2500).then(function(){return api('generation/'+job.id)}).then(function(d2){
    if(d2.state==='success')body.style.backgroundImage='url('+media(d2.result_id)+')';
    else toast('هنوز آماده نشده؛ کمی بعد دوباره امتحان کن');
   });
  });
 }).catch(function(e){toast(e.message,'error')});
}

/* ---------- requests ---------- */
function loadRequests(silent){
 return api('requests').then(function(d){
  state.requests=d.requests||[];state.customer=d.customer||null;state.session=true;
  if(!silent)renderRequestsSheet();
 }).catch(function(){});
}
function ensureSession(){
 if(state.session)return Promise.resolve();
 return api('requests').then(function(){state.session=true}).catch(function(){
  return api('session',{}).then(function(){state.session=true});
 });
}
function openRequests(){
 ensureSession().then(function(){return loadRequests(true)}).then(renderRequestsSheet).catch(function(e){toast(e.message,'error')});
}
function renderRequestsSheet(){
 var panel=el('div',{class:'sheet__panel'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','درخواست‌های من'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 if(!state.requests||!state.requests.length){
  panel.append(el('p',{class:'muted',text:'هنوز درخواستی نفرستاده‌ای. عکس و مدلت را انتخاب کن و برای آرایشگر بفرست.'}));
  panel.append(el('button',{class:'btn btn--primary',type:'button',style:'margin-top:12px',onclick:openRequest,text:'ثبت درخواست بررسی'}));
 }else{
  var list=el('div',{class:'requests'});
  state.requests.forEach(function(r){list.append(requestCard(r))});
  panel.append(list);
  if(state.customer){
   var pref=el('div',{class:'pref'});
   pref.append(h('h3','ترجیح پیام‌ها'));
   var sms=el('input',{type:'checkbox',checked:!!state.customer.consent});
   var fu=el('input',{type:'checkbox',checked:!!state.customer.followup});
   pref.append(el('label',{class:'check'},[sms,el('span',{text:'پیام‌های مربوط به درخواست و نوبت را دریافت کنم'})]));
   pref.append(el('label',{class:'check'},[fu,el('span',{text:'یک پیام پیگیری در صورت نیمه‌تمام ماندن'})]));
   pref.append(el('button',{class:'btn btn--soft btn--sm',type:'button',onclick:function(){
    api('preferences',{consent:sms.checked,followup:fu.checked}).then(function(){toast('ترجیح ذخیره شد');loadRequests(true)}).catch(function(e){toast(e.message,'error')});
   },text:'ذخیرهٔ ترجیح'}));
   panel.append(pref);
  }
 }
 openSheet(panel);
}
var reviewNames={pending:'در انتظار بررسی آرایشگر',possible:'قابل اجراست',in_person:'نیاز به بررسی حضوری',changes:'با تغییراتی قابل اجراست',unavailable:'امکان اجرا نیست'};
var statusNames={awaiting_salon:'در انتظار پاسخ سالن',awaiting_customer:'زمان جایگزین؛ منتظر پاسخ تو',confirmed:'نوبت قطعی',rejected:'رد شده',cancelled:'لغو شده',done:'انجام شده'};
function requestCard(r){
 var box=el('div',{class:'req'});
 var top=el('div',{class:'req__top'},[el('b',{text:r.service}),el('span',{class:'badge'+(r.appointment&&r.appointment.status==='confirmed'?' badge--ok':''),text:reviewNames[r.review]||r.review})]);
 box.append(top);
 box.append(el('div',{class:'thumbs'},[
  r.original_id?el('a',{href:media(r.original_id),target:'_blank',rel:'noopener'},[el('img',{src:media(r.original_id),alt:''}),el('span',{text:'عکس تو'})]):null,
  r.preview_id?el('a',{href:media(r.preview_id),target:'_blank',rel:'noopener'},[el('img',{src:media(r.preview_id),alt:''}),el('span',{text:'شبیه‌سازی'})]):null
 ]));
 var a=r.appointment;
 if(a){
  var t=el('div',{class:'req__time'},[el('b',{text:statusNames[a.status]||a.status}),el('div',{text:fmt(a.start_at)||'زمانی پیشنهاد نشده'})]);
  if(a.note)t.append(el('div',{text:a.note}));
  box.append(t);
  if(['rejected','cancelled','done'].indexOf(a.status)<0){
   var actions=el('div',{class:'req__actions'});
   if(a.status==='awaiting_customer')actions.append(el('button',{class:'btn btn--primary btn--sm',type:'button',onclick:function(){actAppointment(r,'accept',a.version)},text:'تأیید همین زمان'}));
   actions.append(el('button',{class:'btn btn--ghost btn--sm',type:'button',onclick:function(){proposeInSheet(r)},text:'پیشنهاد زمان دیگر'}));
   actions.append(el('button',{class:'btn btn--danger btn--sm',type:'button',onclick:function(){if(confirm('نوبت لغو شود؟'))actAppointment(r,'cancel',a.version)},text:'لغو'}));
   box.append(actions);
  }
 }
 return box;
}
function actAppointment(r,action,version,extra){
 var body={request_id:r.id,action:action,version:version};
 if(extra)Object.keys(extra).forEach(function(k){body[k]=extra[k]});
 api('appointment',body).then(function(){toast('انجام شد');return loadRequests(true)}).then(renderRequestsSheet).catch(function(e){toast(e.message,'error')});
}
function proposeInSheet(r){
 var panel=el('div',{class:'sheet__panel'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','پیشنهاد زمان دیگر'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:renderRequestsSheet})]));
 var choices=[['فردا صبح (۱۰:۰۰)',1,'10:00'],['فردا عصر (۱۶:۰۰)',1,'16:00'],['پس‌فردا صبح (۱۰:۰۰)',2,'10:00'],['پس‌فردا عصر (۱۶:۰۰)',2,'16:00']];
 var picked=null;
 var row=el('div',{class:'row'});
 choices.forEach(function(c){
  var b=el('button',{class:'chip',type:'button','aria-pressed':'false',text:c[0]});
  b.addEventListener('click',function(){picked=c;row.querySelectorAll('.chip').forEach(function(x){x.classList.remove('is-on');x.setAttribute('aria-pressed','false')});b.classList.add('is-on');b.setAttribute('aria-pressed','true')});
  row.append(b);
 });
 panel.append(row);
 var exactDay=daySelect('exactDay'),exactTime=timeSelect('exactTime','10:00');exactDay.prepend(el('option',{value:'',text:'انتخاب روز'}));exactDay.value='';
 panel.append(el('div',{class:'when-pick',style:'margin-top:16px'},[el('label',{class:'field'},[el('span',{class:'lbl',text:'یا روز دقیق'}),exactDay]),el('label',{class:'field'},[el('span',{class:'lbl',text:'ساعت'}),exactTime])]));
 var note=el('textarea',{id:'pnote',placeholder:'توضیح کوتاه (اختیاری)'});
 panel.append(el('label',{class:'field'},[el('span',{class:'lbl',text:'توضیح'}),note]));
 panel.append(el('div',{class:'row'},[
  el('button',{class:'btn btn--ghost',type:'button',onclick:renderRequestsSheet,text:'بازگشت'}),
  el('button',{class:'btn btn--primary',type:'button',onclick:function(){
   var start=null;
   var exact=exactDay.value;
   if(exact){start=Date.parse(exact+'T'+exactTime.value+':00+03:30')}
   else if(picked){var d=new Date(Date.now()+picked[1]*86400000);start=Date.parse(tehranDate(d)+'T'+picked[2]+':00+03:30')}
   if(!start||!isFinite(start)){toast('یک زمان انتخاب کن','error');return}
   actAppointment(r,'propose',r.appointment.version,{start_at:start,note:note.value});
  },text:'ارسال پیشنهاد'})
 ]));
 openSheet(panel);
}

/* ---------- request form ---------- */
function openRequest(){
 if(!state.original){toast('برای ثبت درخواست، اول عکس خودت را اضافه کن');go(1);return}
 if(!state.pub.services||!state.pub.services.length){toast('سالن هنوز خدمتی ثبت نکرده است','error');return}
 var panel=el('div',{class:'sheet__panel'});
 var form=el('form',{novalidate:'true'});
 panel.append(el('div',{class:'sheet__head'},[h('h2','درخواست بررسی و هماهنگی'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
 form.append(h('p','آرایشگر عکس و مدل را بررسی می‌کند و زمان را تأیید می‌کند. تأیید مدل به معنی قطعی‌شدن نوبت نیست.','tiny muted'));
 var nameWrap=wrapField('name','نام و نام خانوادگی','text',state.customer?state.customer.name:'');
 var phoneWrap=wrapField('phone','شمارهٔ موبایل','tel',state.customer?state.customer.phone:'','۰۹۱۲۱۲۳۴۵۶۷',{inputmode:'tel',autocomplete:'tel'});
 var service=el('select',{id:'service'});
 (state.pub.services||[]).forEach(function(s){service.append(el('option',{value:s.id,text:s.name+' · '+fa(s.duration)+' دقیقه'}))});
 var serviceWrap=el('label',{class:'field'},[el('span',{class:'lbl',text:'نوع خدمت'}),service]);
 form.append(nameWrap,phoneWrap,serviceWrap);
 var whenRow=el('div',{class:'row'});
 var whenChoices=[['none','بدون زمان'],['m10','فردا ۱۰:۰۰'],['m16','فردا ۱۶:۰۰'],['custom','انتخاب دقیق']];
 whenChoices.forEach(function(c){
  var b=el('button',{class:'chip'+(state.when===c[0]?' is-on':''),type:'button','aria-pressed':state.when===c[0]?'true':'false',text:c[1]});
  b.addEventListener('click',function(){state.when=c[0];whenRow.querySelectorAll('.chip').forEach(function(x){x.setAttribute('aria-pressed','false');x.classList.remove('is-on')});b.setAttribute('aria-pressed','true');b.classList.add('is-on');custom.hidden=state.when!=='custom'});
  whenRow.append(b);
 });
 form.append(el('div',{class:'field'},[el('span',{class:'lbl',text:'زمان پیشنهادی (اختیاری)'}),whenRow]));
 var custom=el('div',{class:'when-pick',hidden:state.when!=='custom'},[el('label',{class:'field'},[el('span',{class:'lbl',text:'روز'}),daySelect('rdate')]),el('label',{class:'field'},[el('span',{class:'lbl',text:'ساعت'}),timeSelect('rtime','10:00')])]);
 form.append(custom);
 var note=el('textarea',{id:'rnote',placeholder:'مثلاً سابقهٔ رنگ، حساسیت پوستی یا مدل خاص'});
 form.append(el('label',{class:'field'},[el('span',{class:'lbl',text:'توضیح برای آرایشگر (اختیاری)'}),note]));
 var sms=el('input',{type:'checkbox',checked:state.customer?!!state.customer.consent:true});
 var fu=el('input',{type:'checkbox',checked:state.customer?!!state.customer.followup:false});
 var consent=el('input',{type:'checkbox',id:'dataConsent'});
 form.append(el('label',{class:'check'},[consent,el('span',{text:'عکس‌ها و اطلاعات تماسم برای بررسی در همین سالن نگه داشته شود.'})]));
 form.append(el('label',{class:'check'},[sms,el('span',{text:'پیام‌های مربوط به درخواست و نوبت را دریافت کنم.'})]));
 form.append(el('label',{class:'check'},[fu,el('span',{text:'در صورت نیمه‌تمام ماندن، یک پیام پیگیری بگیرم.'})]));
 var submit=el('button',{class:'btn btn--primary btn--block',type:'submit',style:'margin-top:8px',text:'ارسال برای بررسی سالن'});
 form.append(submit);
 form.addEventListener('submit',function(e){
  e.preventDefault();
  var okName=validate(nameWrap,function(){return nameWrap.querySelector('input').value.trim().length>=2},'نام را کامل بنویس');
  var phoneVal=normalizePhone(phoneWrap.querySelector('input').value);
  var okPhone=validate(phoneWrap,function(){return /^\+989\d{9}$/.test(phoneVal)},'شمارهٔ موبایل معتبر نیست');
  var okConsent=true;
  if(!consent.checked){okConsent=false;consent.closest('.check').style.color='var(--danger)'}
  if(!okName||!okPhone||!okConsent){if(!okConsent)toast('رضایت نگه‌داری عکس را تأیید کن','error');return}
  var start=null;
  if(state.when==='custom'){
   var dv=panel.querySelector('#rdate').value,tv=panel.querySelector('#rtime').value;
   if(dv&&tv)start=Date.parse(dv+'T'+tv+':00+03:30');
  }else if(state.when==='m10'||state.when==='m16'){
   var date=tehranDate(new Date(Date.now()+86400000));
   start=Date.parse(date+'T'+(state.when==='m10'?'10:00':'16:00')+':00+03:30');
  }
  submit.disabled=true;submit.textContent='در حال ارسال…';
  ensureSession().then(function(){
   return api('requests',{data_consent:true,idem:state.reqIdem||uuid(),name:nameWrap.querySelector('input').value.trim(),phone:phoneVal,service_id:service.value,note:note.value,start_at:start||undefined,original_id:state.original,reference_id:state.reference||undefined,preview_id:state.result||undefined,consent:sms.checked,followup:fu.checked});
  }).then(function(){
   state.reqIdem=null;
   return loadRequests(true);
  }).then(function(){
   panel.replaceChildren(el('div',{class:'sheet__head'},[h('h2','درخواست ثبت شد'),el('button',{class:'sheet__x',type:'button','aria-label':'بستن',text:'×',onclick:closeSheet})]));
   panel.append(notice('ok','درخواست برای بررسی به سالن رسید. وضعیت را از «درخواست‌ها» دنبال کن.'));
   panel.append(el('button',{class:'btn btn--primary btn--block',type:'button',style:'margin-top:14px',onclick:function(){closeSheet();openRequests()},text:'مشاهدهٔ درخواست‌ها'}));
  }).catch(function(err){
   submit.disabled=false;submit.textContent='ارسال برای بررسی سالن';
   if(/قبلاً ثبت شده/.test(err.message)){
    phoneWrap.setAttribute('data-invalid','true');
    var pe=phoneWrap.querySelector('.err');
    if(pe)pe.textContent='این شماره قبلاً در این سالن ثبت شده است. برای دیدن درخواست قبلی، لینک اختصاصی سالن را باز کن.';
    toast('این شماره قبلاً ثبت شده است','error');
   }else toast(err.message,'error');
  });
 });
 panel.append(form);
 openSheet(panel);
 setTimeout(function(){var i=panel.querySelector('input');if(i)i.focus()},80);
}
// Persian-calendar day list and Tehran times instead of the browser's Gregorian pickers.
function daySelect(id){
 var s=el('select',{id:id});
 var label=new Intl.DateTimeFormat('fa-IR-u-ca-persian',{timeZone:'Asia/Tehran',weekday:'long',day:'numeric',month:'long'});
 for(var i=1;i<=21;i++){var d=new Date(Date.now()+i*86400000);s.append(el('option',{value:tehranDate(d),text:(i===1?'فردا، ':i===2?'پس‌فردا، ':'')+label.format(d)}))}
 return s;
}
function timeSelect(id,value){
 var s=el('select',{id:id});
 for(var m=9*60;m<=21*60;m+=30){var v=String(Math.floor(m/60)).padStart(2,'0')+':'+(m%60?'30':'00');s.append(el('option',{value:v,text:fa(Math.floor(m/60))+':'+(m%60?'۳۰':'۰۰')}))}
 s.value=value;return s;
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
  <section id="flow" aria-live="polite"><div class="panel flow"><div class="skel" style="height:26px;width:46%"></div><div class="skel" style="width:min(100%,280px);aspect-ratio:3/4;margin:20px auto 0;border-radius:999px 999px 18px 18px"></div></div></section>
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
