import os, re, base64, json, hashlib, shutil
os.makedirs('out', exist_ok=True)
# Run from design/landing: python3 build.py
# Writes out/v2.html (relative paths, live preview), out/artifact.html (single file)
# and ../../worker/landing.js (the page the worker serves at "/").
#
# Step 24 replaced the espresso/brass landing with the reference rebuild. The page
# is now assembled from exactly three sources — src/page.html (shell: head, header,
# six sections, footer), src/plans.html (price panels) and src/site.css — plus the
# studio's own stylesheet and scripts, which are still live inside #salon-example.
NL = chr(10)
R = lambda p: open(p, encoding='utf8').read()
W = lambda p, s: open(p, 'w', encoding='utf8').write(s)

# ---------------- static assets ----------------
# Everything the new page references, synced into public/landing/ so the worker
# and the static preview read the same bytes.
DEMOS = ['demo-%s-%s.webp' % (s, k) for s in ('style', 'color', 'lashes', 'nails') for k in ('before', 'after')]
SYNC = re.compile(r'(hero\.webp|salon-film-0[1-5]\.webp|(?:hair|lashes|nails)-end\.webp|%s|estedad\.woff2|look-s\d\d\.webp)$' % '|'.join(re.escape(d) for d in DEMOS))
for asset in os.listdir('assets'):
    if SYNC.match(asset):
        shutil.copyfile('assets/' + asset, '../../public/landing/' + asset)

W('../../worker/brand.js', 'export const brandMark=' + json.dumps(R('assets/ayneh-mark.svg'), ensure_ascii=False) + ';' + NL
  + 'export const favicon=' + json.dumps(R('assets/ayneh-favicon.svg'), ensure_ascii=False) + ';' + NL)
shutil.copyfile('assets/ayneh-favicon.svg', '../../public/favicon.svg')

# ---------------- styles ----------------
# site.css is the new visual system and owns every base rule. trial.css is scoped
# to the studio block only (see the guard below), so no legacy selector can leak.
css = R('src/site.css') + NL + R('src/studio.css')
assert '.site-header{' in css, 'site.css must own the header'

# ---------------- price panels ----------------
# The ONLY place a price can enter the shipped page. Leave a value empty until the owner
# approves a number: the panel then renders the measured placeholder text, never a made-up
# digit. Format: amount in TOMAN as a plain integer ('2900000' → ۲٫۹۰۰٫۰۰۰), quota in images.
# This table also generates worker/prices.js (the table the checkout charges from), so a number
# can never appear on the page while the checkout believes something else.
PANEL_FIGURES = {'solo': (2_900_000, 20), 'salon': (6_000_000, 75), 'chain': (10_000_000, 180)}
#
# Open a plan for purchase by setting its amount; leave it 0 to keep it "coming soon".
# Nothing is charged, no countdown runs and no card is shown for a plan with amount 0.
PLAN_NAMES = {'solo': 'ESSENTIAL', 'salon': 'PRO', 'chain': 'SIGNATURE'}
# The checkout window the customer sees and the server enforces (worker/orders.js).
PRICE_MINUTES = 10


def fa_int(n):
    return str(n).translate(str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹'))


def price_text(toman):
    """۱۲٫۵۰۰٫۰۰۰ — grouped Persian digits with the thousands separator."""
    return fa_int('{:,}'.format(toman).replace(',', '٫'))


PLACEHOLDER = ('مبلغ', 'سهمیه')
plans = R('src/plans.html')
for key, (amount, quota) in PANEL_FIGURES.items():
    plans = plans.replace('{{PRICE_%s}}' % key.upper(), price_text(amount) if amount else PLACEHOLDER[0])
    plans = plans.replace('{{QUOTA_%s}}' % key.upper(), fa_int(quota) if quota else PLACEHOLDER[1])
    # A plan with an amount gets a live checkout button instead of the demo request.
    state = 'open' if amount else 'soon'
    plans = plans.replace('{{STATE_%s}}' % key.upper(), state)
    plans = plans.replace('{{AMOUNT_%s}}' % key.upper(), str(amount))
    plans = plans.replace('{{PLANNAME_%s}}' % key.upper(), PLAN_NAMES[key])
    # While a figure is unapproved the panel says so in words, instead of leaving a bare
    # dashed box next to a button that reads «خرید».
    plans = plans.replace('{{PENDING_%s}}' % key.upper(),
                          '' if amount else 'مبلغ در حال نهایی‌شدن است و پیش از خرید نوشته می‌شود.')
    # The button is the same word on every panel — «خرید» — because that is the one action
    # the customer is being offered. What it does depends on the amount: priced opens the
    # checkout, unpriced stops at the note under the panels saying why. It is never a dead
    # button and never a checkout that cannot take money.
    plans = plans.replace('{{CTA_%s}}' % key.upper(), 'خرید')
assert '{{PRICE' not in plans and '{{QUOTA' not in plans and '{{STATE' not in plans, 'every slot is filled'
assert '{{AMOUNT' not in plans and '{{PLANNAME' not in plans and '{{PENDING' not in plans
# The same table feeds the server: worker/prices.js is generated, so the page can never show
# one amount while the checkout believes another.
plans_js = ''.join("  %s: {name: '%s', amount: %d, quota: %d},\n" % (k, PLAN_NAMES[k], a, q)
                   for k, (a, q) in PANEL_FIGURES.items())
W('../../worker/prices.js',
  '// The approved plan table — GENERATED by design/landing/build.py from PANEL_FIGURES, the same' + NL
  + '// table that fills the landing page price panels. Never edit by hand: change the table in' + NL
  + '// build.py (one place), rebuild, and both the page and the server move together.' + NL
  + '//' + NL
  + '// amount: TOMAN per month · 0 = the panel is not for sale yet (no checkout, no countdown).' + NL
  + '// quota: gift images · 0 = not decided (the page shows «سهمیه»).' + NL
  + 'export const PRICE_MINUTES = %d;' % PRICE_MINUTES + NL
  + 'export const PLANS = {' + NL + plans_js + '};' + NL)

# ---------------- studio (live salon-page builder) ----------------
# src/trial.html is the studio markup. It is preview-only: nothing inside it is uploaded
# and its last step hands the visitor to the price panels.
studio = '<!-- 9. Build your own salon page (live preview) -->' + NL + R('src/trial.html')

# ---------------- page assembly ----------------
h = R('src/page.html')
# The payment sheet sits right after the studio: the price panels above open it, and it never
# renders until a priced plan is picked (see src/pay.js). One replace: the STUDIO marker can
# only be consumed once.
h = h.replace('<!--FILMS-->', R('src/films.html')).replace('<!--TRYON-->', R('src/tryon.html')).replace('<!--PLAY-->', R('src/play.html'))
h = h.replace('<!--PLANS-->', plans).replace('<!--STUDIO-->', studio + NL + R('src/pay.html'))
assert '<!--PLANS-->' not in h and '<!--STUDIO-->' not in h and '<!--FILMS-->' not in h and '<!--TRYON-->' not in h and '<!--PLAY-->' not in h
assert 'id="pay"' in h and 'id="payForm"' in h, 'the payment sheet must ship'
FONT = '@font-face{font-family:"Estedad";src:url("assets/estedad.woff2") format("woff2");font-weight:100 900;font-style:normal;font-display:swap}'
h = re.sub(r'<style>.*?</style>', lambda m: '<style>' + NL + FONT + NL + css + NL + '</style>', h, count=1, flags=re.S)
assert h.count('<!--AYNEH_MARK-->') == 2
mark = R('assets/ayneh-mark.svg')
# Inline SVG fragment IDs are document-global in browsers. Give the header and footer mark
# distinct clipPath names so duplicate IDs cannot make one logo reference the other SVG.
h = h.replace('<!--AYNEH_MARK-->', mark.replace('aynDisc', 'aynDiscHeader'), 1)
h = h.replace('<!--AYNEH_MARK-->', mark.replace('aynDisc', 'aynDiscFooter'), 1)
# A build stamp in the <head>, as a meta tag rather than a comment: ship_minify strips
# comments, and the landing page is cacheable for a few minutes, so without a marker that
# survives the build neither the owner nor I can tell a stale copy from the deployed one.
import hashlib
STAMP = hashlib.sha256(h.encode('utf-8')).hexdigest()[:12]
h = h.replace('<head>', '<head><meta name="ayneh-build" content="' + STAMP + '">', 1)
assert 'ayneh-build' in h
# A one-line self-report at the very end of the page: "this copy is build X, from Y". When the
# owner says "nothing changed" and the server is serving the new build, this is what separates
# "a stale tab is still open" from "the deploy never happened" without opening devtools.
h = h.replace('</body>', '<script>window.__AYNEH_BUILD=' + repr(STAMP).replace("'", '"') + ';</script>' + NL + '</body>')
# A visible build tag, bottom-left, tiny. It exists for exactly one conversation — "nothing
# changed in the preview" — and it answers it on screen instead of in devtools. It names the
# build, and it says how long this copy has been open, because a tab left open from before a
# change keeps showing the page it loaded.
h = h.replace('</body>', '''<div id="aynehBuildTag" aria-hidden="true" style="position:fixed;inset-inline-start:6px;bottom:6px;z-index:60;font:600 10px/1.4 ui-monospace,Menlo,monospace;direction:ltr;color:#0A202A;background:rgba(252,243,235,.92);border:1px solid rgba(10,32,42,.14);border-radius:7px;padding:3px 6px;pointer-events:none;letter-spacing:.02em"></div><script>(function(){var d=document.getElementById('aynehBuildTag'),t=Date.now();function tick(){var m=Math.floor((Date.now()-t)/60000);d.textContent=window.__AYNEH_BUILD+' · '+(m<1?'just loaded':m+'m open')}tick();setInterval(tick,20000)})();</script>''' + NL + '</body>')


# followup.js and lead.js retired with the demo-request form: the page now has exactly two
# actions — look at the samples, or buy a panel — so there is no request to send and no
# follow-up message to show.
SCRIPTS = ['funnel.js', 'films.js', 'tryon.js', 'play.js', 'draft.js', 'portrait.js',
           'hair-color.js', 'compare.js', 'try.js', 'reveal.js', 'cinema2.js',
           'builder.js', 'refine.js', 'pay.js', 'cta.js']
# Hair-colour maths and the photo handoff are used by the studio. hero.js, scenes.js,
# and cinema.js drove the retired film sections. cta.js owns the mobile sticky action,
# keeping it clear of the film, the salon-page builder, duplicate CTAs, and open dialogs.
for name in SCRIPTS:
    assert os.path.exists('src/' + name), name
scripts = ''.join('<script>' + NL + R('src/' + n) + NL + '</script>' + NL for n in SCRIPTS)
h = h.replace('</body>', scripts + '</body>')

W('out/v2.html', h.replace('__ORIGIN__', ''))

# ---------------- single-file artifact ----------------
def b64(f, m):
    return 'data:%s;base64,%s' % (m, base64.b64encode(open('assets/' + f, 'rb').read()).decode())

a = h.replace('__ORIGIN__', '').replace('assets/estedad.woff2', b64('estedad.woff2', 'font/woff2'))
# Every image the page points at must be inlined, or the single-file preview
# (opened from disk) shows empty boxes.
INLINE = ['hero', 'salon-film-01', 'salon-film-03'] + [d[:-5] for d in DEMOS] \
    + [m.group(1) for f in os.listdir('assets')
       for m in [re.match(r'(look-s\d\d)\.webp$', f)] if m]
for f in INLINE:
    a = a.replace('assets/%s.webp' % f, b64(f + '.webp', 'image/webp'))
a = re.sub(r'<link rel="preload"[^>]*>' + NL, '', a)
a = re.sub(r'<meta name="robots"[^>]*>(<!--.*?-->)?' + NL, '', a)
a = re.sub(r'<link rel="icon"[^>]*>' + NL, '', a)
a = a.replace('</title>', '</title><link rel="icon" type="image/svg+xml" href="' + b64('ayneh-favicon.svg', 'image/svg+xml') + '">', 1)
head = re.search(r'<title>.*?</style>', a, re.S).group(0).replace('.site-header{position:sticky;top:0;', '.site-header{position:sticky;top:env(safe-area-inset-top,0px);')
body = re.search(r'<body>(.*)</body>', a, re.S).group(1)
out = head + NL + '<div dir="rtl" lang="fa" class="page">' + body + '</div>' + NL
out = out.replace('</style>', 'body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:40;background:#FCF3EB}' + NL + '</style>', 1)
W('out/artifact.html', out)
# The same page as one file that opens straight from disk, with its build id printed in the
# corner. The artifact above starts at <title> (it is meant to be pasted into a host), so the
# head marker is lost there; this copy keeps it and exists so "is the preview the new page?"
# can be answered by opening a file, with no server and no cache in the way.
_solo = a.replace('<body>', '<body data-ayneh-build="' + STAMP + '">', 1) if '<body>' in a else a
W('out/preview-single.html', _solo)

# ---------------- worker variant ----------------
p = h
p = p.replace('assets/', '/landing/')
p = p.replace('/landing/estedad.woff2', '/fonts/estedad-arabic.woff2')
faces = ('@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+204F,U+FB50-FDFF,U+FE70-FEFC}' + NL
         + '@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-200B,U+2012-206F,U+20AC,U+2122,U+2212}' + NL
         + '@font-face{font-family:"Estedad";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/estedad-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC}')
p = re.sub(r'@font-face\{font-family:"Estedad"[^\n]*\}', lambda m: faces, p, count=1)
assert '"Estedad","Vazirmatn"' in p, 'font stack keeps the app grid fonts'
p = re.sub(r'<meta name="robots"[^>]*>(<!--.*?-->)?' + NL, '', p)
assert '`' not in p and '${' not in p, 'template literal unsafe'


def ship_minify(html):
    def css(m):
        c = re.sub(r'/\*.*?\*/', '', m.group(1), flags=re.S)
        c = re.sub(r'\s+', ' ', c)
        for a_, b_ in (('{ ', '{'), (' }', '}'), (' ;', ';'), ('; ', ';'), (' ,', ','), (', ', ',')):
            c = c.replace(a_, b_)
        return '<style>' + c.replace(';}', '}').strip() + '</style>'
    def js(m):
        t = re.sub(r'(?m)^[ \t]*/\*.*?\*/[ \t]*\n', '', m.group(1), flags=re.S)
        t = re.sub(r'(?m)^[ \t]*//[^\n]*\n', '', t)
        return '<script>' + t + '</script>'
    html = re.sub(r'<style>(.*?)</style>', css, html, flags=re.S)
    html = re.sub(r'<script>(.*?)</script>', js, html, flags=re.S)
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    html = re.sub(r'>\s*\n\s*<', '><', html)
    html = re.sub(r'\n[ \t]+', '\n', html)
    html = re.sub(r'[ \t]+\n', '\n', html)
    return re.sub(r'\n{2,}', '\n', html)

p = ship_minify(p)
W('../../worker/landing.js', '// Public landing page served at "/" (owner console lives at /admin). Static HTML; images in public/landing/.' + NL
  + '// Generated from the design source (visual direction AYN-D064, reference rebuild; tokens are PROPOSED).' + NL
  + 'export const landingHTML=`' + p.replace(chr(92), chr(92) * 2) + '`;' + NL)
print(len(out), len(p))
