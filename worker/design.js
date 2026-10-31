// Shared design tokens and primitives. The customer page and, later, the admin panel
// both read from this file so the product looks like one product.
export const baseCSS=String.raw`
:root{
 --bg:#f7f5fa;--bg-2:#efeaf6;--surface:#fff;--surface-2:#fbf9fd;
 --ink:#211a2b;--ink-2:#463b53;--muted:#6b5f77;--line:#e7e1ef;--line-2:#f1ecf7;
 --brand:#6b4a8f;--brand-ink:#4d3268;--brand-soft:#f3ecfa;--brand-ring:rgba(107,74,143,.30);
 --ok:#1c7a53;--ok-soft:#e6f6ee;--warn:#8f5c14;--warn-soft:#fdf3e2;--danger:#a02f45;--danger-soft:#fdebee;
 --radius:20px;--radius-sm:13px;--radius-pill:999px;
 --shadow-1:0 1px 2px rgba(33,26,43,.05),0 10px 26px -16px rgba(33,26,43,.28);
 --shadow-2:0 24px 60px -28px rgba(33,26,43,.45);
 --ease:cubic-bezier(.22,.61,.36,1);--tap:46px;
 --safe-b:env(safe-area-inset-bottom,0px);
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.75 Vazirmatn,system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif;-webkit-font-smoothing:antialiased}
h1,h2,h3,h4{margin:0;line-height:1.35;font-weight:700;letter-spacing:-.01em}
p{margin:0}
button{font:inherit;color:inherit;cursor:pointer}
a{color:var(--brand);text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:3px solid var(--brand-ring);outline-offset:2px;border-radius:10px}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.skip{position:absolute;inset-inline-start:-999px;top:8px;z-index:60;background:var(--surface);padding:10px 16px;border-radius:12px}
.skip:focus{inset-inline-start:8px}
.wrap{max-width:1120px;margin:0 auto;padding:0 18px}
.grow{flex:1;min-width:0}
.muted{color:var(--muted)}
.tiny{font-size:12px;line-height:1.85}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:var(--tap);padding:0 18px;border:1px solid transparent;border-radius:var(--radius-pill);background:var(--surface);font-weight:600;white-space:nowrap;transition:transform .15s var(--ease),background .15s var(--ease),box-shadow .15s var(--ease),border-color .15s var(--ease)}
.btn svg{width:19px;height:19px;flex:none}
.btn:active{transform:scale(.985)}
.btn--primary{background:linear-gradient(180deg,var(--brand),var(--brand-ink));color:#fff;box-shadow:0 12px 26px -14px rgba(77,50,104,.95)}
.btn--primary:hover{background:linear-gradient(180deg,#73509a,var(--brand-ink))}
.btn--soft{background:var(--brand-soft);color:var(--brand-ink)}
.btn--ghost{border-color:var(--line);background:var(--surface);color:var(--ink-2)}
.btn--ghost:hover{border-color:#d9cfe8;background:var(--surface-2)}
.btn--danger{background:var(--danger-soft);color:var(--danger);border-color:#f3d5db}
.btn--block{width:100%}
.btn--sm{min-height:38px;padding:0 14px;font-size:13px}
.btn[disabled]{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);box-shadow:var(--shadow-1)}
.stack>*+*{margin-top:12px}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.chip{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:0 13px;border-radius:var(--radius-pill);border:1px solid var(--line);background:var(--surface);color:var(--ink-2);font-size:13px;font-weight:600;transition:background .15s var(--ease),border-color .15s var(--ease),color .15s var(--ease)}
.chip[aria-pressed="true"],.chip.is-on{background:var(--brand-soft);border-color:#d9c7ec;color:var(--brand-ink)}
.badge{display:inline-flex;align-items:center;gap:6px;padding:4px 11px;border-radius:var(--radius-pill);background:var(--brand-soft);color:var(--brand-ink);font-size:11.5px;font-weight:700}
.badge--ok{background:var(--ok-soft);color:var(--ok)}
.badge--warn{background:var(--warn-soft);color:var(--warn)}
.badge--danger{background:var(--danger-soft);color:var(--danger)}
.field{display:block;margin-bottom:14px}
.field>span.lbl{display:block;font-size:12.5px;font-weight:600;color:var(--ink-2);margin-bottom:6px}
.field input,.field select,.field textarea{display:block;width:100%;min-height:var(--tap);padding:10px 13px;border:1px solid var(--line);border-radius:var(--radius-sm);background:var(--surface);color:var(--ink);font:inherit;transition:border-color .15s var(--ease),box-shadow .15s var(--ease)}
.field textarea{min-height:88px;resize:vertical}
.field input:focus,.field select:focus,.field textarea:focus{outline:none;border-color:#b79bd6;box-shadow:0 0 0 4px var(--brand-ring)}
.field .hint{display:block;font-size:11.5px;color:var(--muted);margin-top:5px;line-height:1.7}
.field .err{display:none;font-size:12px;color:var(--danger);margin-top:5px;font-weight:600}
.field[data-invalid="true"] input,.field[data-invalid="true"] select,.field[data-invalid="true"] textarea{border-color:#e2a7b3;background:#fff8f9}
.field[data-invalid="true"] .err{display:block}
.check{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.65;color:var(--ink-2);margin:10px 0}
.check input{width:20px;height:20px;margin:2px 0 0;flex:none;accent-color:var(--brand)}
.notice{border-radius:var(--radius-sm);padding:12px 14px;font-size:12.5px;line-height:1.8;border:1px solid;display:flex;gap:9px;align-items:flex-start}
.notice svg{width:17px;height:17px;flex:none;margin-top:2px}
.notice--info{background:#f7f3fc;border-color:#e6d9f3;color:#5a4272}
.notice--warn{background:var(--warn-soft);border-color:#f2ddb9;color:#7a4f12}
.notice--danger{background:var(--danger-soft);border-color:#f3ccd5;color:#8c2438}
.notice--ok{background:var(--ok-soft);border-color:#c6e8d7;color:#15603f}
.skel{border-radius:12px;background:linear-gradient(90deg,var(--line-2) 25%,#faf7fd 37%,var(--line-2) 63%);background-size:400% 100%;animation:sk 1.4s ease infinite}
@keyframes sk{0%{background-position:100% 50%}100%{background-position:0 50%}}
.sheet{border:0;padding:0;background:transparent;max-width:640px;width:100%;margin:auto;color:var(--ink)}
.sheet::backdrop{background:rgba(28,20,38,.45);backdrop-filter:blur(3px)}
.sheet__panel{background:var(--surface);border-radius:22px;padding:22px;max-height:92vh;overflow:auto;box-shadow:var(--shadow-2)}
.sheet__head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}
.sheet__x{width:38px;height:38px;border:0;border-radius:50%;background:var(--line-2);font-size:20px;line-height:1}
.toast{position:fixed;inset-inline:16px;bottom:calc(var(--safe-b) + 96px);z-index:80;margin:auto;max-width:560px;background:#2b2136;color:#fff;padding:14px 16px;border-radius:14px;font-size:13.5px;box-shadow:var(--shadow-2);opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s var(--ease),transform .2s var(--ease)}
.toast.is-on{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation-duration:.001ms!important;transition-duration:.001ms!important}}
`;
