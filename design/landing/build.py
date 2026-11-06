import os, re, base64, json, hashlib
os.makedirs('out', exist_ok=True)
# Run from design/landing: python build.py. Writes out/v2.html (preview), out/artifact.html (single file) and ../../worker/landing.js (the shipped page).
NL = chr(10)
R = lambda p: open(p, encoding='utf8').read()
W = lambda p, s: open(p, 'w', encoding='utf8').write(s)

# Keep the shipped static assets synchronized with their design sources.
import shutil
for asset in os.listdir('assets'):
    if re.match(r'(hair-mask\.png|look-s\d\d\.webp|mask-s\d\d\.png|salon-film-\d\d\.webp|(?:hair|lashes|nails)-(?:poster|end)\.webp|journey-stone\.webp)$', asset):
        shutil.copyfile('assets/' + asset, '../../public/landing/' + asset)

W('../../worker/brand.js', 'export const brandMark=' + json.dumps(R('assets/ayneh-mark.svg'), ensure_ascii=False) + ';' + NL + 'export const favicon=' + json.dumps(R('assets/ayneh-favicon.svg'), ensure_ascii=False) + ';' + NL)
shutil.copyfile('assets/ayneh-favicon.svg', '../../public/favicon.svg')
W('../../worker/draft.js', 'export const draftScript=' + json.dumps(R('src/draft.js'), ensure_ascii=False) + ';' + NL)

# ---------------- source assembly (relative asset paths) ----------------
h = R('index.html')
st = re.search(r'<style>(.*?)</style>', h, re.S)
css = st.group(1)
drop = re.compile(r'^\s*(\.hero|\.swatch|\.style-dock|\.lines-row|\.lead\{|h1\{|\.eyebrow|\.fineprint|\.hero-copy)')
css = NL.join(l for l in css.split(NL) if not drop.match(l))
css += NL + R('src/hero.css') + NL + R('src/lead.css') + NL + R('src/trial.css') + NL + R('src/cta.css')
css += NL + R('src/polish.css')
css += NL + '.compare{margin-top:0}' + NL + '@media (max-width:1100px){.selection{padding-top:56px}.compare{margin:0 auto}}' + NL
h = h.replace(st.group(0), '<style>' + css + '</style>')
h = re.sub(r'  <!-- 1\. Hero -->.*?(?=  <!-- 2\. Experience -->)', lambda m: R('src/hero.html') + NL, h, flags=re.S)
# The service films are part of the service chapter; the builder follows the story.
def section(section_id):
    return re.search(r'  <section id="' + section_id + r'".*?</section>', h, re.S).group(0)

funnel = NL.join([section('how'), R('src/invite.html'), section('services'), R('src/scenes.html'), R('src/trial.html'), section('faq')])
icon_paths = {
    'mirror': 'M11 27V15a9 9 0 0 1 18 0v12ZM20 27v6m-6 0h12m-9-14 5-5',
    'talk': 'M9 10h22v15H19l-7 6v-6H9Zm6 6h10m-10 4h7',
    'book': 'M10 8h20v24H10Zm5 17 5-6 4 4 3-3m-11-6h.1',
    'link': 'M16 24l8-8m-10 5-4 4a4 4 0 0 0 6 6l4-4m0-14 4-4a4 4 0 0 1 6 6l-4 4',
    'check': 'M20 7l11 4v8c0 6-4 10-11 14-7-4-11-8-11-14v-8Zm-5 13 4 4 7-8',
    'hair': 'M12 24a4 4 0 1 0 4 4l12-17m0 13a4 4 0 1 1-4 4L12 11',
    'nails': 'M13 30V17a7 7 0 0 1 14 0v13Zm3-10v-3a4 4 0 0 1 8 0v3Z',
    'lashes': 'M8 23q12 11 24 0M11 26l-2 4m8-2-1 5m7-5 1 5m5-7 2 4M9 18q11-9 22 0',
}
def icon(match):
    path = icon_paths[match[1]]
    return '<span class="gold-icon" aria-hidden="true"><svg viewBox="0 0 40 40"><path class="gold-icon-depth" d="'+path+'"/><path d="'+path+'"/></svg></span>'
funnel = re.sub(r'<!--ICON:(\w+)-->', icon, funnel)
h = re.sub(r'  <!-- 2\. Experience -->.*?(?=</main>)', lambda m: funnel + NL, h, flags=re.S)
h = h.replace('<!--AYNEH_MARK-->', R('assets/ayneh-mark.svg'))
assert 'builderLive' in h and 'id="start"' in h, 'salon builder not inserted'
# styles whose mirror render exists (assets/look-sNN.webp + mask-sNN.png): the hero shows their shape on the model
LOOKS = sorted(int(m.group(1)) for f in os.listdir('assets') for m in [re.match(r'look-s(\d\d)\.webp$', f)] if m and os.path.exists('assets/mask-s%s.png' % m.group(1)))
asset_version = hashlib.sha256(b''.join(open('assets/' + f, 'rb').read() for f in sorted(os.listdir('assets')) if re.match(r'(hero\.webp|hair-mask\.png|look-s\d\d\.webp|mask-s\d\d\.png|salon-film-\d\d\.webp|(?:hair|lashes|nails)-(?:poster|end)\.webp|journey-stone\.webp)$', f))).hexdigest()[:12]
# Include film contents so unchanged poster frames cannot leave stale video URLs.
asset_version = hashlib.sha256((asset_version + ''.join(hashlib.sha256(open('../../public/landing/video/' + n + '.mp4', 'rb').read()).hexdigest() for n in ['hair', 'lashes', 'nails'])).encode()).hexdigest()[:12]
scripts = '<script>window.__AYN_ASSET_VERSION=' + json.dumps(asset_version) + ';window.__AYN_LOOKS=' + json.dumps(LOOKS) + ';</script>' + NL + ''.join('<script>' + NL + R(f) + NL + '</script>' + NL for f in ['src/draft.js', 'src/portrait.js', 'src/hair-color.js', 'src/hero.js', 'src/scenes.js', 'src/try.js', 'src/cta.js', 'src/reveal.js', 'src/builder.js'])
h = h.replace('</body>', scripts + '</body>')
W('out/v2.html', h.replace('__ORIGIN__', ''))


def b64(f, m):
    return 'data:%s;base64,%s' % (m, base64.b64encode(open('assets/' + f, 'rb').read()).decode())


# ---------------- single-file artifact (everything inlined, preview flag on) ----------------
a = h.replace('__ORIGIN__', '').replace('assets/estedad.woff2', b64('estedad.woff2', 'font/woff2'))
for f in ['hero', 'compare', 'a2'] + ['salon-film-%02d' % i for i in range(1, 6)] + [n + '-' + k for n in ['hair', 'lashes', 'nails'] for k in ['poster', 'end']] + ['journey-stone']:
    a = a.replace('assets/%s.webp' % f, b64(f + '.webp', 'image/webp'))
imgmap = {('s%02d' % i): b64('s%02d.webp' % i, 'image/webp') for i in range(1, 20)}
imgmap.update({('ic%d' % i): b64('ic%d.webp' % i, 'image/webp') for i in range(1, 5)})
imgmap.update({('salon-film-%02d' % i): b64('salon-film-%02d.webp' % i, 'image/webp') for i in range(1, 6)})
imgmap['hair-mask'] = b64('hair-mask.png', 'image/png')
imgmap['hero'] = b64('hero.webp', 'image/webp')
for n in LOOKS:
    imgmap['look-s%02d' % n] = b64('look-s%02d.webp' % n, 'image/webp')
    imgmap['mask-s%02d' % n] = b64('mask-s%02d.png' % n, 'image/png')
frames = {} # Scroll films are seekable MP4 assets, not the retired frame sequences.
marker = '<script>' + NL + '/* Film hero'
assert marker in a
a = a.replace(marker, '<script>window.__AYN_PREVIEW=true;window.__AYN_IMG=' + json.dumps(imgmap) + ';window.__AYN_FRAMES=' + json.dumps(frames) + ';</script>' + NL + marker, 1)
a = re.sub(r'<link rel="preload"[^>]*>' + NL, '', a)
a = re.sub(r'<meta name="robots"[^>]*>(<!--.*?-->)?' + NL, '', a)
a = re.sub(r'<link rel="icon"[^>]*>' + NL, '', a)
a = a.replace('</title>', '</title><link rel="icon" type="image/svg+xml" href="' + b64('ayneh-favicon.svg', 'image/svg+xml') + '">', 1)
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
