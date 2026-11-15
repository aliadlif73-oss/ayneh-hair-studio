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
SYNC = re.compile(r'(hero\.webp|salon-film-0[1-5]\.webp|(?:hair|lashes|nails)-end\.webp|%s|estedad\.woff2|look-s\d\d\.webp|(?:hero|look-s\d\d)-hd\.webp|story-\d[lr]\.webp)$' % '|'.join(re.escape(d) for d in DEMOS))
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

# ---------------- plans (the owner's price sheet) ----------------
# The ONLY place a price can enter the shipped pages. Same three plans on every service page.
# This table also generates worker/prices.js (what the checkout charges and how many image
# credits a confirmed plan grants), so the page and the server can never disagree.
# amount / was: TOMAN. months: plan length. credits: gift images granted on confirmation.
PLANS = [
    {'key': 'essential', 'name': 'ESSENTIAL', 'months': 1, 'amount': 2900000, 'was': 0, 'credits': 20, 'badge': '',
     'features': ['صفحه اختصاصی متخصص', 'گالری نمونه‌کار', 'تست مدل با عکس مرجع', 'دریافت درخواست مشتری', 'اعتبار هدیه ۲۰ عکس']},
    {'key': 'pro', 'name': 'PRO', 'months': 3, 'amount': 6000000, 'was': 8700000, 'credits': 75, 'badge': '',
     'features': ['همه امکانات ESSENTIAL', 'اعتبار هدیه ۷۵ عکس', 'اتصال پیام‌رسان', 'نوبت‌دهی و پیگیری', 'گزارش عملکرد ساده']},
    {'key': 'signature', 'name': 'SIGNATURE', 'months': 6, 'amount': 10000000, 'was': 17400000, 'credits': 180, 'badge': 'پیشنهاد آینه',
     'features': ['همه امکانات PRO', 'اعتبار هدیه ۱۸۰ عکس', 'گزارش عملکرد کامل', 'آرشیو مشتریان', 'پشتیبانی ویژه']},
]
# After the gift credit runs out: every TOPUP images cost TOPUP_AMOUNT toman.
TOPUP_IMAGES, TOPUP_AMOUNT = 10, 200000
# The checkout window the customer sees and the server enforces (worker/orders.js).
PRICE_MINUTES = 10


def fa_int(n):
    return str(n).translate(str.maketrans('0123456789', '۰۱۲۳۴۵۶۷۸۹'))


def millions(toman):
    """2900000 → ۲٫۹ ; 10000000 → ۱۰ (the price sheet writes «۲.۹ میلیون تومان»)."""
    m = toman / 1000000
    s = ('%g' % m)
    return fa_int(s).replace('.', '٫')


# Plain-words notes under the owner's bullet wording (the wording itself stays exactly as on
# the price sheet). Keyed by the bullet; a gift-credit bullet matches by prefix.
PLAN_NOTES = {
    'صفحه اختصاصی متخصص': 'یک لینک به نام شما برای بیو اینستاگرام',
    'گالری نمونه‌کار': 'کارهای خودتان را از پنل اضافه می‌کنید',
    'تست مدل با عکس مرجع': 'مشتری عکس مدلی را که دوست دارد هم می‌گذارد',
    'دریافت درخواست مشتری': 'با عکس و انتخاب مشتری، در پنل شما',
    'اعتبار هدیه': 'هر تصویری که برای مشتری ساخته شود یک اعتبار است؛ ناموفق‌ها حساب نمی‌شوند',
    'اتصال پیام‌رسان': 'درخواست‌ها در تلگرام یا بله هم می‌رسد',
    'نوبت‌دهی و پیگیری': 'شما نوبت را ثبت می‌کنید؛ تأیید و یادآوری در تلگرام یا بله به مشتری می‌رسد',
    'گزارش عملکرد ساده': 'بازدید، امتحان، درخواست و نوبت‌های ماه',
    'گزارش عملکرد کامل': 'به‌علاوهٔ مدل‌های پرطرفدار، آمار هر همکار و زمان پاسخ',
    'آرشیو مشتریان': 'فهرست مشتری‌ها با جستجو و خروجی اکسل',
    'پشتیبانی ویژه': 'پیام از داخل پنل، با اولویت پاسخ',
}


def plan_note(f):
    n = PLAN_NOTES.get(f) or next((v for k, v in PLAN_NOTES.items() if f.startswith(k)), '')
    return '<span>' + f + ('<small>' + n + '</small>' if n else '') + '</span>'


TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3.5V6M16 3.5V6" stroke-linecap="round"/></svg>'
CROWN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/></svg>'


def plan_card(p):
    lead = ' plan--lead' if p['badge'] else ''
    badge = ('<span class="plan__badge">' + CROWN + p['badge'] + '</span>') if p['badge'] else ''
    was = ('<p class="plan__was"><s>' + millions(p['was']) + ' میلیون تومان</s></p>') if p['was'] else '<p class="plan__was" aria-hidden="true">&nbsp;</p>'
    feats = ''.join('<li>' + TICK + plan_note(f) + '</li>' for f in p['features'])
    return (
        '<article class="plan' + lead + '" data-plan="' + p['key'] + '">' + badge
        + '<h3 lang="en" dir="ltr">' + p['name'] + '</h3>'
        + '<p class="plan__months">' + CAL + fa_int(p['months']) + ' ماهه</p>'
        + '<div class="plan__price" data-price-box="' + p['key'] + '">' + was
        + '<p class="plan__amount" data-price="' + p['key'] + '"><b>' + millions(p['amount']) + '</b> میلیون تومان</p></div>'
        + '<ul>' + feats + '</ul>'
        + '<a class="btn plan__buy" href="#pay" data-buy="' + p['key'] + '" data-state="open" data-amount="' + str(p['amount']) + '">خرید</a>'
        + '<p class="plan__state" data-for="' + p['key'] + '" hidden></p>'
        + '</article>')


plans = ('<div class="plans">' + ''.join(plan_card(p) for p in PLANS) + '</div>'
         + '<p class="plan-note" id="plan-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5" stroke-linecap="round"/></svg>'
         + '<span>پس از اتمام اعتبار هدیه، هر ' + fa_int(TOPUP_IMAGES) + ' عکس ' + fa_int(TOPUP_AMOUNT // 1000) + ' هزار تومان</span></p>')
assert all(p['amount'] > 0 for p in PLANS)
plans_js = ''.join("  %s: {name: '%s', months: %d, amount: %d, was: %d, credits: %d},\n"
                   % (p['key'], p['name'], p['months'], p['amount'], p['was'], p['credits']) for p in PLANS)
W('../../worker/prices.js',
  '// The plan table — GENERATED by design/landing/build.py from PLANS, the same table that draws' + NL
  + '// the price cards on every service page. Never edit by hand: change build.py and rebuild.' + NL
  + '//' + NL
  + '// amount / was: TOMAN. months: plan length. credits: gift images granted on confirmation.' + NL
  + 'export const PRICE_MINUTES = %d;' % PRICE_MINUTES + NL
  + 'export const PLANS = {' + NL + plans_js + '};' + NL
  + '// After the gift credit runs out: every TOPUP.images images cost TOPUP.amount toman.' + NL
  + 'export const TOPUP = {images: %d, amount: %d};' % (TOPUP_IMAGES, TOPUP_AMOUNT) + NL)


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
# One support number everywhere: the landing must print the one in worker/support.js.
SUPPORT_TEL = re.search(r"SUPPORT_TEL = '(\d+)'", R('../../worker/support.js')).group(1)
assert set(re.findall(r'tel:(\d+)', h)) == {SUPPORT_TEL}, 'landing support number differs from worker/support.js'

# ---------------- four pages from one source ----------------
# page.html + the partials above hold every section once. Each page is the shared shell
# (head, header, footer, styles, scripts) with its own list of sections cut out of that one
# source: the home page introduces Ayneh, the service pages carry everything about one service.
SERVICES = {
    'hair': {
        'label': 'مدل و رنگ مو', 'path': '/hair',
        'title': 'برای متخصصان مدل و رنگ مو',
        'desc': 'مشتری مدل و رنگ مو را روی عکس خودش می‌بیند و انتخابش را با عکس برای شما می‌فرستد. پلن‌ها، دموی زنده و روش کار.',
        'eyebrow': 'برای متخصصان مدل و رنگ مو',
        'h1': 'مشتری مدل و رنگ مو را', 'accent': 'روی عکس خودش ببیند',
        'lead': 'اگر در لاین مدل مو و رنگ مو فعالیت دارید، آینه به مشتری‌تان اجازه می‌دهد کوتاهی، مدل و رنگ دلخواهش را پیش از مراجعه روی عکس خودش امتحان کند و همان انتخاب را با عکس برایتان بفرستد.',
        'points': ['۱۹ مدل مو و ۷ رنگ، روی چهرهٔ خودِ مشتری', 'تست مدل با عکس مرجعِ خودِ مشتری', 'درخواست با عکس، در پنل شما (و در PRO در تلگرام یا بله)'],
        'pairs': [('style', 'مدل مو'), ('color', 'رنگ مو')], 'films': ['hair'], 'lines': ['hair', 'color'], 'play': True,
        'films_sub': 'یک ویدئوی کوتاه از کاری که مشتری شما برای مدل و رنگ مو در صفحهٔ اختصاصی‌تان انجام می‌دهد.',
        'how': ('مشتری یک عکس روبه‌رو از چهره‌اش می‌گذارد.', 'انتخاب مدل یا رنگ مو', 'مدل یا رنگ مو را انتخاب می‌کند؛ اگر بخواهد عکس مرجعِ مدل دلخواهش را هم می‌گذارد.'),
        'photo': 'یک عکس روبه‌رو با صورت و موی کامل، بدون کلاه و عینک آفتابی، در نور طبیعی. برای رنگ مو، موهای باز بهتر جواب می‌دهد.',
    },
    'nails': {
        'label': 'ناخن', 'path': '/nails',
        'title': 'برای متخصصان ناخن',
        'desc': 'مشتری طرح و رنگ ناخن را روی عکس دست خودش می‌بیند و انتخابش را برای شما می‌فرستد. پلن‌ها، دموی زنده و روش کار.',
        'eyebrow': 'برای متخصصان ناخن',
        'h1': 'مشتری طرح و رنگ ناخن را', 'accent': 'روی دست خودش ببیند',
        'lead': 'اگر در لاین ناخن فعالیت دارید، آینه به مشتری‌تان اجازه می‌دهد طرح و رنگ دلخواهش را پیش از مراجعه روی عکس دست خودش امتحان کند و همان انتخاب را با عکس برایتان بفرستد.',
        'points': ['طرح و رنگ ناخن روی عکس دست خودِ مشتری', 'تست طرح با عکس مرجع', 'درخواست با عکس، در پنل شما (و در PRO در تلگرام یا بله)'],
        'pairs': [('nails', 'ناخن')], 'films': ['nails'], 'lines': ['nails'], 'play': False,
        'films_sub': 'یک ویدئوی کوتاه از کاری که مشتری شما برای ناخن در صفحهٔ اختصاصی‌تان انجام می‌دهد.',
        'how': ('مشتری یک عکس واضح از دستش می‌گذارد.', 'انتخاب طرح و رنگ ناخن', 'طرح و رنگ ناخن را انتخاب می‌کند؛ اگر بخواهد عکس مرجعِ طرح دلخواهش را هم می‌گذارد.'),
        'photo': 'یک عکس واضح از پشت دست با انگشت‌های باز، روی زمینهٔ ساده و در نور طبیعی.',
    },
    'lashes': {
        'label': 'مژه', 'path': '/lashes',
        'title': 'برای متخصصان مژه',
        'desc': 'مشتری مدل مژه را روی عکس چشم خودش می‌بیند و انتخابش را برای شما می‌فرستد. پلن‌ها، دموی زنده و روش کار.',
        'eyebrow': 'برای متخصصان مژه',
        'h1': 'مشتری مدل مژه را', 'accent': 'روی عکس خودش ببیند',
        'lead': 'اگر در لاین مژه فعالیت دارید، آینه به مشتری‌تان اجازه می‌دهد مدل مژهٔ دلخواهش را پیش از مراجعه روی عکس چشم خودش امتحان کند و همان انتخاب را با عکس برایتان بفرستد.',
        'points': ['مدل مژه روی عکس چشم خودِ مشتری', 'تست مدل با عکس مرجع', 'درخواست با عکس، در پنل شما (و در PRO در تلگرام یا بله)'],
        'pairs': [('lashes', 'مژه')], 'films': ['lashes'], 'lines': ['lashes'], 'play': False,
        'films_sub': 'یک ویدئوی کوتاه از کاری که مشتری شما برای مژه در صفحهٔ اختصاصی‌تان انجام می‌دهد.',
        'how': ('مشتری یک عکس نزدیک و روبه‌رو از چشم‌هایش می‌گذارد.', 'انتخاب مدل مژه', 'مدل مژه را انتخاب می‌کند؛ اگر بخواهد عکس مرجعِ مدل دلخواهش را هم می‌گذارد.'),
        'photo': 'یک عکس نزدیک و روبه‌رو از چشم‌ها، بدون عینک، با چشم باز و در نور طبیعی.',
    },
}
CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.4 2.6 2.6L16 9.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
THUMB_CHECK = '<span class="hero-thumb__check" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m5 12.5 4.2 4.2L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'


def section(src, sid):
    """One <section id=…>…</section> from a source with no nested sections."""
    m = re.search(r'[ \t]*(?:<!--[^\n]*-->\s*)*<section id="' + re.escape(sid) + r'"[\s\S]*?</section>\n?', src)
    assert m, 'section ' + sid
    return m.group(0)


def keep_buttons(html, attr, keep):
    """Drop the tab buttons for other services; hide the tab row when one is left."""
    html = re.sub(r'\s*<button type="button" class="[^"]*" ' + attr + r'="(\w+)"[\s\S]*?</button>',
                  lambda m: m.group(0) if m.group(1) in keep else '', html)
    return html


def nav(items):
    # The first in-page item starts underlined; the scrollspy moves it with the reader.
    first = next((i for i, (h_, _) in enumerate(items) if h_.startswith('#')), -1)
    return ''.join('<a href="%s"%s>%s</a>' % (h_, ' aria-current="page"' if i == first else '', t) for i, (h_, t) in enumerate(items))


def mobile(items, cta):
    return (''.join('<a href="%s">%s<span aria-hidden="true">↙</span></a>' % (h_, t) for h_, t in items)
            + '<a href="__ORIGIN__/panel">ورود به پنل سالن<span aria-hidden="true">↙</span></a>'
            + '<a class="btn" href="%s">%s</a>' % cta)


def shell(h, main, items, cta, service='', title='', desc=''):
    """Swap the <main>, the menus and the header button of the full page."""
    out = re.sub(r'<main id="main">[\s\S]*?</main>', lambda m: '<main id="main">\n' + main + '\n</main>', h, count=1)
    out = re.sub(r'(<nav class="nav" aria-label="ناوبری اصلی">)[\s\S]*?(</nav>)', lambda m: m.group(1) + nav(items) + m.group(2), out, count=1)
    out = re.sub(r'(<nav id="mobile-menu"[^>]*>)[\s\S]*?(</nav>)', lambda m: m.group(1) + mobile(items, cta) + m.group(2), out, count=1)
    out = re.sub(r'(<div class="header-cta">[\s\S]*?)<a class="btn" href="#services">(<svg[\s\S]*?</svg>)خرید پلن</a>',
                 lambda m: m.group(1) + '<a class="btn" href="' + cta[0] + '">' + m.group(2) + cta[1] + '</a>', out, count=1)
    if service:
        out = out.replace('<body>', '<body data-service="' + service + '">', 1)
    if title:
        out = re.sub(r'<title>.*?</title>', '<title>' + title + ' | آینه</title>', out, count=1)
        out = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + title, out, count=1)
    if desc:
        out = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, out, count=1)
        out = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, out, count=1)
    # An in-page link to a section this page does not carry goes to the page that does.
    ids = set(re.findall(r'\bid="([\w-]+)"', out))
    home_ids = {'samples', 'choose', 'why'}
    def fix(m):
        target = m.group(1)
        if target in ids:
            return m.group(0)
        return 'href="' + ('/#' if target in home_ids else '/hair#') + target + '"'
    out = re.sub(r'href="#([\w-]+)"', fix, out)
    return out


def make_pages(full):
    src = full
    faq = section(src, 'faq')
    home_main = (
        section(src, 'intro')
        .replace('<a class="btn btn--lg" href="#services">', '<a class="btn btn--lg" href="#choose">', 1)
        .replace('خرید پلن</a>', 'امتحان رایگان و قیمت‌ها</a>', 1)
        .replace('<a class="btn btn--ghost btn--lg" href="#how">', '<a class="btn btn--ghost btn--lg" href="#samples">', 1)
        .replace('مشاهده معرفی در ۲ دقیقه', 'دیدن نمونه‌کارها', 1)
        + R('src/samples.html') + section(src, 'why') + R('src/services-cta.html')
        + faq.replace('href="#services">دیدن پلن‌ها و قیمت</a>', 'href="#choose">انتخاب خدمت و قیمت‌ها</a>')
    )
    pages = {'home': shell(full, home_main,
                           [('#intro', 'خانه'), ('#samples', 'نمونه‌کارها'), ('#choose', 'خدمات'), ('#why', 'چرا آینه؟'), ('#faq', 'سوالات متداول')],
                           ('#choose', 'امتحان و قیمت'))}
    hero_tpl = R('src/service-hero.html')
    for key, s in SERVICES.items():
        first, first_label = s['pairs'][0]
        thumbs = ''
        if len(s['pairs']) > 1:
            thumbs = '<div class="hero-thumbs" role="group" aria-label="خدمت قابل امتحان">' + ''.join(
                '<button type="button" class="hero-thumb" data-pair="%s" data-before="assets/demo-%s-before.webp" data-after="assets/demo-%s-after.webp" data-label="%s" aria-pressed="%s" aria-label="نمایش %s">'
                '<img src="assets/demo-%s-after.webp" width="70" height="84" alt="" loading="lazy" decoding="async">%s</button>'
                % (p, p, p, lab, 'true' if i == 0 else 'false', lab, p, THUMB_CHECK) for i, (p, lab) in enumerate(s['pairs'])) + '</div>'
        hero = (hero_tpl.replace('{{EYEBROW}}', s['eyebrow']).replace('{{H1}}', s['h1']).replace('{{ACCENT}}', s['accent'])
                .replace('{{LEAD}}', s['lead']).replace('{{FIRST}}', first).replace('{{FIRST_LABEL}}', first_label)
                .replace('{{THUMBS}}', thumbs).replace('{{WRAP_CLASS}}', '' if thumbs else ' compare-wrap--single')
                .replace('{{POINTS}}', ''.join('            <li>' + CHECK + pt + '</li>\n' for pt in s['points'])))
        films = keep_buttons(R('src/films.html'), 'data-film', s['films'])
        films = films.replace('<div class="films__tabs"', '<div class="films__tabs" hidden', 1)
        films = re.sub(r'(<p class="sub">)سه ویدئوی کوتاه[^<]*', lambda m: m.group(1) + s['films_sub'], films, count=1)
        tryon = keep_buttons(R('src/tryon.html'), 'data-line', s['lines'])
        if len(s['lines']) == 1:
            tryon = tryon.replace('<div class="tryon__lines"', '<div class="tryon__lines" hidden', 1)
        how = section(src, 'how')
        how = how.replace('<p>مشتری از چهره یا موی خود عکس بارگذاری می‌کند.</p>', '<p>' + s['how'][0] + '</p>', 1)
        how = how.replace('<h3>انتخاب خدمت و مدل</h3>', '<h3>' + s['how'][1] + '</h3>', 1)
        how = how.replace('<p>خدمت موردنظر (مثل رنگ، کوتاهی و…) و مدل دلخواه را انتخاب می‌کند.</p>', '<p>' + s['how'][2] + '</p>', 1)
        assert s['how'][2] in how, key + ': how-it-works copy'
        if first != 'style':
            # The step pictures follow the service, not the hairstyle demo.
            how = re.sub(r'<span class="step__picks"[\s\S]*?</span>\n?', '', how, count=1)
            how = re.sub(r'assets/demo-(?:style|color)-(before|after)\.webp', lambda m: 'assets/demo-' + first + '-' + m.group(1) + '.webp', how)
            how = how.replace('مشتری از چهره یا موی خود عکس می‌گذارد', s['how'][0].rstrip('.'))
        sfaq = faq.replace('<summary>آینه دقیقاً چه کاری برای من می‌کند؟</summary>',
                           '<summary>مشتری چه عکسی باید بگذارد؟</summary>\n            <div class="faq-item__body">' + s['photo'] + '</div>\n          </details>\n          <details class="faq-item">\n            <summary>آینه دقیقاً چه کاری برای من می‌کند؟</summary>', 1)
        sfaq = sfaq.replace('<details class="faq-item" open>', '<details class="faq-item">', 1).replace('<details class="faq-item">', '<details class="faq-item" open>', 1)
        cta = section(src, 'cta').replace('مشتری‌های شما، نتیجه را', 'مشتری‌های ' + s['label'] + ' شما، نتیجه را', 1)
        # /hair: the mirror and the photo try-on are one block with two tabs (src/try-switch.js).
        switch = ('<div class="try-switch band" id="trySwitch" role="tablist" aria-label="دو راه امتحان" hidden>'
                  '<button type="button" role="tab" data-try="play" aria-selected="true">روی چهرهٔ نمونه <small>بدون عکس</small></button>'
                  '<button type="button" role="tab" data-try="try-on" aria-selected="false">روی عکس خودتان <small>با تأیید شماره</small></button></div>\n') if s['play'] else ''
        main = (hero + films + switch + (R('src/play.html') if s['play'] else '') + tryon
                + how + studio + section(src, 'services') + R('src/pay.html')
                + cta + sfaq)
        others = [(v['path'], v['label']) for k, v in SERVICES.items() if k != key]
        pages[key] = shell(full, main,
                           [('/', 'آینه')] + others + [('#services', 'تعرفه‌ها'), ('#faq', 'سوالات متداول')],
                           ('#services', 'خرید پلن'), service=key, title=s['title'], desc=s['desc'])
    for k, v in pages.items():
        assert v.count('<main id="main">') == 1, k
    assert 'id="choose"' in pages['home'] and 'id="services"' not in pages['home'], 'home carries no plans'
    for k in SERVICES:
        assert 'id="services"' in pages[k] and 'id="pay"' in pages[k] and 'id="choose"' not in pages[k], k
    return pages


PAGES = make_pages(h)


# ---------------- shared finishing: styles, logos, build stamp, scripts ----------------
def finish(h):
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
    # A build tag, bottom corner, tiny — shown only with ?build or on /new, never to visitors. It exists for exactly one conversation — "nothing
    # changed in the preview" — and it answers it on screen instead of in devtools. It names the
    # build, and it says how long this copy has been open, because a tab left open from before a
    # change keeps showing the page it loaded.
    h = h.replace('</body>', '''<div id="aynehBuildTag" aria-hidden="true" style="position:fixed;inset-inline-start:6px;bottom:6px;z-index:60;font:600 10px/1.4 ui-monospace,Menlo,monospace;direction:ltr;color:#0A202A;background:rgba(252,243,235,.92);border:1px solid rgba(10,32,42,.14);border-radius:7px;padding:3px 6px;pointer-events:none;letter-spacing:.02em"></div><script>(function(){var d=document.getElementById('aynehBuildTag'),t=Date.now();if(!/[?&]build(=|&|$)/.test(location.search)&&location.pathname!=='/new'){d.remove();return}function tick(){var m=Math.floor((Date.now()-t)/60000);d.textContent=window.__AYNEH_BUILD+' · '+(m<1?'just loaded':m+'m open')}tick();setInterval(tick,20000)})();</script>''' + NL + '</body>')


    # followup.js and lead.js retired with the demo-request form: the page now has exactly two
    # actions — look at the samples, or buy a panel — so there is no request to send and no
    # follow-up message to show.
    SCRIPTS = ['funnel.js', 'story.js', 'films.js', 'tryon.js', 'play.js', 'draft.js', 'portrait.js',
               'hair-color.js', 'try.js', 'reveal.js', 'cinema2.js',
               'builder.js', 'refine.js', 'pay.js', 'cta.js', 'try-switch.js']
    # Hair-colour maths and the photo handoff are used by the studio. hero.js, scenes.js,
    # and cinema.js drove the retired film sections. cta.js owns the mobile sticky action,
    # keeping it clear of the film, the salon-page builder, duplicate CTAs, and open dialogs.
    for name in SCRIPTS:
        assert os.path.exists('src/' + name), name
    scripts = ''.join('<script>' + NL + R('src/' + n) + NL + '</script>' + NL for n in SCRIPTS)
    h = h.replace('</body>', scripts + '</body>')

    return h, STAMP

h, STAMP = finish(PAGES['home'])
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
def to_worker(h):
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


    return p

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

WORKER = {k: ship_minify(to_worker(finish(v)[0] if k != 'home' else h)) for k, v in PAGES.items()}
W('../../worker/landing.js', '// Public pages: "/" (home) and the service pages /hair, /nails, /lashes (owner console lives at /admin).' + NL
  + '// GENERATED by design/landing/build.py from one design source; images in public/landing/.' + NL
  + 'export const landingHTML=`' + WORKER['home'].replace(chr(92), chr(92) * 2) + '`;' + NL
  + 'export const servicePages={' + ','.join(k + ':`' + v.replace(chr(92), chr(92) * 2) + '`' for k, v in WORKER.items() if k != 'home') + '};' + NL)
print(len(out), {k: len(v) for k, v in WORKER.items()})
