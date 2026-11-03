import os, re, base64, json, hashlib
os.makedirs('out', exist_ok=True)
# Run from design/landing: python build.py. Writes out/v2.html (preview), out/artifact.html (single file) and ../../worker/landing.js (the shipped page).
NL = chr(10)
R = lambda p: open(p, encoding='utf8').read()
W = lambda p, s: open(p, 'w', encoding='utf8').write(s)

# Keep the shipped static assets synchronized with their design sources.
import shutil
for asset in os.listdir('assets'):
    if re.match(r'(look-s\d\d\.webp|mask-s\d\d\.png|salon-film-\d\d\.webp)$', asset):
        shutil.copyfile('assets/' + asset, '../../public/landing/' + asset)

# ---------------- source assembly (relative asset paths) ----------------
h = R('index.html')
st = re.search(r'<style>(.*?)</style>', h, re.S)
css = st.group(1)
drop = re.compile(r'^\s*(\.hero|\.swatch|\.style-dock|\.lines-row|\.lead\{|h1\{|\.eyebrow|\.fineprint|\.hero-copy)')
css = NL.join(l for l in css.split(NL) if not drop.match(l))
css += NL + R('src/hero.css') + NL + R('src/sec2.css') + NL + R('src/lead.css') + NL + R('src/trial.css') + NL + R('src/scenes.css') + NL + R('src/cta.css')
css += NL + '.compare{margin-top:0}' + NL + '@media (max-width:1100px){.selection{padding-top:56px}.compare{margin:0 auto}}' + NL
h = h.replace(st.group(0), '<style>' + css + '</style>')
h = re.sub(r'  <!-- 1\. Hero -->.*?(?=  <!-- 2\. Experience -->)', lambda m: R('src/hero.html') + NL, h, flags=re.S)
h = re.sub(r'  <!-- 2\. Experience -->.*?(?=  <!-- 3\. Services -->)', lambda m: R('src/scenes.html') + R('src/sec2.html') + NL, h, flags=re.S)
# the free-trial section (live mockup + lead form) goes right before the plans
trial = R('src/trial.html').replace('<!--LEAD-->', R('src/lead.html'))
assert '  <!-- 6. Plans -->' in h
h = h.replace('  <!-- 6. Plans -->', trial + '  <!-- 6. Plans -->', 1)
assert 'leadForm' in h and 'id="mock"' in h, 'trial section not inserted'
# styles whose mirror render exists (assets/look-sNN.webp + mask-sNN.png): the hero shows their shape on the model
LOOKS = sorted(int(m.group(1)) for f in os.listdir('assets') for m in [re.match(r'look-s(\d\d)\.webp$', f)] if m and os.path.exists('assets/mask-s%s.png' % m.group(1)))
asset_version = hashlib.sha256(b''.join(open('assets/' + f, 'rb').read() for f in sorted(os.listdir('assets')) if re.match(r'(hero\.webp|hair-mask\.png|look-s\d\d\.webp|mask-s\d\d\.png|salon-film-\d\d\.webp)$', f))).hexdigest()[:12]
scripts = '<script>window.__AYN_ASSET_VERSION=' + json.dumps(asset_version) + ';window.__AYN_LOOKS=' + json.dumps(LOOKS) + ';</script>' + NL + ''.join('<script>' + NL + R(f) + NL + '</script>' + NL for f in ['src/portrait.js', 'src/hero.js', 'src/sec2.js', 'src/scenes.js', 'src/try.js', 'src/cta.js', 'src/reveal.js', 'src/lead.js'])
h = h.replace('</body>', scripts + '</body>')
W('out/v2.html', h.replace('__ORIGIN__', ''))


def b64(f, m):
    return 'data:%s;base64,%s' % (m, base64.b64encode(open('assets/' + f, 'rb').read()).decode())


# ---------------- single-file artifact (everything inlined, preview flag on) ----------------
a = h.replace('__ORIGIN__', '').replace('assets/estedad.woff2', b64('estedad.woff2', 'font/woff2'))
for f in ['hero', 'compare', 'a2'] + ['salon-film-%02d' % i for i in range(1, 6)]:
    a = a.replace('assets/%s.webp' % f, b64(f + '.webp', 'image/webp'))
imgmap = {('s%02d' % i): b64('s%02d.webp' % i, 'image/webp') for i in range(1, 20)}
imgmap.update({('ic%d' % i): b64('ic%d.webp' % i, 'image/webp') for i in range(1, 5)})
imgmap.update({('salon-film-%02d' % i): b64('salon-film-%02d.webp' % i, 'image/webp') for i in range(1, 6)})
imgmap['hair-mask'] = b64('hair-mask.png', 'image/png')
imgmap['hero'] = b64('hero.webp', 'image/webp')
for n in LOOKS:
    imgmap['look-s%02d' % n] = b64('look-s%02d.webp' % n, 'image/webp')
    imgmap['mask-s%02d' % n] = b64('mask-s%02d.png' % n, 'image/png')
frames = {k: [b64('f/%s/%03d.webp' % (k, i + 1), 'image/webp') for i in range(n)] for k, n in [('hair', 52), ('nails', 45), ('lashes', 43)]}
marker = '<script>' + NL + '/* Film hero'
assert marker in a
a = a.replace(marker, '<script>window.__AYN_PREVIEW=true;window.__AYN_IMG=' + json.dumps(imgmap) + ';window.__AYN_FRAMES=' + json.dumps(frames) + ';</script>' + NL + marker, 1)
a = re.sub(r'<link rel="preload"[^>]*>' + NL, '', a)
a = re.sub(r'<meta name="robots"[^>]*>(<!--.*?-->)?' + NL, '', a)
a = re.sub(r'<link rel="icon"[^>]*>' + NL, '', a)
head = re.search(r'<title>.*?</style>', a, re.S).group(0).replace('.site-header{position:sticky;top:0;', '.site-header{position:sticky;top:env(safe-area-inset-top,0px);')
body = re.search(r'<body>(.*)</body>', a, re.S).group(1)
out = head + NL + '<div dir="rtl" lang="fa" class="page">' + body + '</div>' + NL
out = out.replace('</style>', 'body::before{content:"";position:fixed;inset:0 0 auto;height:env(safe-area-inset-top,0px);z-index:40;background:#F9F1E8}' + NL + '</style>', 1)
W('out/artifact.html', out)

# ---------------- Worker variant (absolute asset paths, app fonts, no preview flag) ----------------
p = h
assert '`' not in p and '${' not in p, 'template literal unsafe'
p = p.replace('assets/estedad.woff2', '/fonts/estedad-arabic.woff2')
faces = ('@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+2010-2011,U+204F,U+FB50-FDFF,U+FE70-FEFC}' + NL
         + '@font-face{font-family:"Vazirmatn";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/vazirmatn-latin.woff2) format("woff2");unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-200B,U+2012-206F,U+20AC,U+2122,U+2212}' + NL
         + '@font-face{font-family:"Estedad";font-style:normal;font-weight:100 900;font-display:swap;src:url(/fonts/estedad-arabic.woff2) format("woff2");unicode-range:U+0600-06FF,U+0750-077F,U+08A0-08FF,U+200C-200F,U+FB50-FDFF,U+FE70-FEFC}')
p = re.sub(r'@font-face\{font-family:"Estedad".*?\}' + NL, lambda m: faces + NL, p, count=1, flags=re.S)
p = p.replace('--font:"Estedad",system-ui', '--font:"Estedad","Vazirmatn",system-ui')
p = re.sub(r'<meta name="robots"[^>]*>(<!--.*?-->)?' + NL, '', p)
p = p.replace('assets/', '/landing/')
p = p.replace(marker, "<script>window.__AYN_BASE='/landing/';</script>" + NL + marker, 1)
foot = '<li><a href="#faq">پرسش‌ها</a></li>' + NL + '    </ul>'
assert foot in p
p = p.replace(foot, '<li><a href="#faq">پرسش‌ها</a></li><li><a href="/admin">ورود مدیر</a></li>' + NL + '    </ul>')
W('../../worker/landing.js', '// Public landing page served at "/" (owner console lives at /admin). Static HTML; images in public/landing/.' + NL
  + '// Generated from the design source (visual direction AYN-D057/D059/D060/D061/D062; tokens are PROPOSED).' + NL
  + 'export const landingHTML=`' + p.replace(chr(92), chr(92) * 2) + '`;' + NL)
print(len(out), len(p))
