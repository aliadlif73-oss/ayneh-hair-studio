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
SYNC = re.compile(r'(hero\.webp|salon-film-0[1-5]\.webp|(?:hair|lashes|nails)-end\.webp|%s|estedad\.woff2|look-s\d\d\.webp|(?:hero|look-s\d\d)-hd\.webp|story-\d[lr]\.webp|sample-(?:hair|color|nails|lashes)-(?:before|after)\.webp|ayneh-logo-lg\.webp|hero-mix-[0-3]\.webp|salon-cover\.webp|proc-(?:style|color|nails|lashes)-[1-4]\.webp)$' % '|'.join(re.escape(d) for d in DEMOS))
for asset in os.listdir('assets'):
    if SYNC.match(asset):
        shutil.copyfile('assets/' + asset, '../../public/landing/' + asset)

W('../../worker/brand.js', 'export const brandMark=' + json.dumps(R('assets/ayneh-mark.svg'), ensure_ascii=False) + ';' + NL
  + 'export const favicon=' + json.dumps(R('assets/ayneh-favicon.svg'), ensure_ascii=False) + ';' + NL)
shutil.copyfile('assets/ayneh-favicon.svg', '../../public/favicon.svg')

# ---------------- styles ----------------
# site.css is the new visual system and owns every base rule. trial.css is scoped
# to the studio block only (see the guard below), so no legacy selector can leak.
css = R('src/site.css') + NL + R('src/studio.css') + NL + R('src/copy.css') + NL + R('src/proc.css')
assert '.site-header{' in css, 'site.css must own the header'

# ---------------- plans (the owner's price sheet) ----------------
# The ONLY place a price can enter the shipped pages. Same three plans on every service page.
# This table also generates worker/prices.js (what the checkout charges and how many image
# credits a confirmed plan grants), so the page and the server can never disagree.
# amount / was: TOMAN. months: plan length. credits: gift images granted on confirmation.
PLANS = [
    {'key': 'essential', 'name': 'پایه', 'months': 1, 'amount': 2900000, 'was': 0, 'credits': 20, 'badge': '',
     'features': ['صفحهٔ اختصاصی شما', 'گالری نمونه‌کار', 'امتحان مدل با عکس دلخواه مشتری', 'دریافت درخواست مشتری', 'اتصال پیام‌رسان', '۲۰ عکس هدیه']},
    {'key': 'pro', 'name': 'حرفه‌ای', 'months': 3, 'amount': 6000000, 'was': 8700000, 'credits': 75, 'badge': '',
     'features': ['همهٔ امکانات پلن پایه', '۷۵ عکس هدیه', 'نوبت‌دهی و پیگیری', 'گزارش عملکرد ساده']},
    {'key': 'signature', 'name': 'کامل', 'months': 6, 'amount': 10000000, 'was': 17400000, 'credits': 180, 'badge': 'پیشنهاد آینه',
     'features': ['همهٔ امکانات پلن حرفه‌ای', '۱۸۰ عکس هدیه', 'گزارش عملکرد کامل', 'آرشیو مشتریان', 'پشتیبانی ویژه']},
]
# «پنل آرایشگاه» (owner's decision): every service (hairstyle, hair colour, nails, lashes) for the
# whole salon, for up to SALON_SEATS users (the manager is one of them). Each user beyond that
# costs seat_amount toman for the WHOLE period, whatever its length. The checkout charges
# amount + max(0, users − seats) × seat_amount, computed on the server from prices.js only.
#   tier: the features it opens (worker/plans.js) — the single-service plan of the same length
#         (1 month = ESSENTIAL, 3 = PRO, 6 = SIGNATURE). Assumption until the owner says otherwise.
#   credits: gift images = the same-length single-service plan × SALON_CREDIT_FACTOR (2): one
#         salon page serves every service for several users, so twice the images of one
#         specialist (20/75/180 → 40/150/360). The top-up price after that is the same.
# These have no card in the shared price section below (the landing pages are drawn elsewhere);
# they only feed worker/prices.js, so the page and the server still read one table.
SALON_SEATS, SALON_CREDIT_FACTOR = 3, 2
SALON_PLANS = [
    {'key': 'salon1', 'name': 'پنل آرایشگاه ۱ ماهه', 'months': 1, 'amount': 5000000, 'seat_amount': 2000000, 'tier': 'essential'},
    {'key': 'salon3', 'name': 'پنل آرایشگاه ۳ ماهه', 'months': 3, 'amount': 10000000, 'seat_amount': 1500000, 'tier': 'pro'},
    {'key': 'salon6', 'name': 'پنل آرایشگاه ۶ ماهه', 'months': 6, 'amount': 15000000, 'seat_amount': 1000000, 'tier': 'signature'},
]
for _p in PLANS:
    _p.update(tier=_p['key'], seats=0, seat_amount=0)
for _p in SALON_PLANS:
    _p.update(was=0, seats=SALON_SEATS, credits=next(x['credits'] for x in PLANS if x['months'] == _p['months']) * SALON_CREDIT_FACTOR)
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
    'صفحهٔ اختصاصی شما': 'یک لینک به اسم شما برای بیو اینستاگرام',
    'گالری نمونه‌کار': 'نمونه‌کارهایتان را خودتان از پنل اضافه می‌کنید',
    'امتحان مدل با عکس دلخواه مشتری': 'مشتری می‌تواند عکس مدلی را که پسندیده هم بگذارد',
    'دریافت درخواست مشتری': 'با عکس و انتخاب مشتری، داخل پنل شما',
    'اعتبار هدیه': 'با هر عکسی که برای مشتری ساخته شود یکی کم می‌شود؛ عکس‌های ناموفق حساب نمی‌شوند',
    'اتصال پیام‌رسان': 'درخواست‌ها در تلگرام یا بله هم می‌رسد',
    'نوبت‌دهی و پیگیری': 'نوبت را شما ثبت می‌کنید؛ تأیید و یادآوری در تلگرام یا بله برای مشتری می‌رود',
    'گزارش عملکرد ساده': 'بازدید، امتحان، درخواست و نوبت‌های هر ماه',
    'گزارش عملکرد کامل': 'به‌همراه مدل‌های پرطرفدار، آمار هر همکار و سرعت پاسخ',
    'آرشیو مشتریان': 'فهرست مشتری‌ها با جستجو و خروجی اکسل',
    'پشتیبانی ویژه': 'پیام از داخل پنل، با پاسخ سریع‌تر',
}


def plan_note(f):
    n = PLAN_NOTES.get(f) or next((v for k, v in PLAN_NOTES.items() if f.startswith(k)), '')
    return '<span>' + f + ('<small>' + n + '</small>' if n else '') + '</span>'


TICK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3.5V6M16 3.5V6" stroke-linecap="round"/></svg>'
CROWN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 10H5Z"/></svg>'


def per_person(toman, n):
    """«۱٫۷» for 5,000,000 / 3 — rounded to one decimal; the caller adds «حدود» when it is not exact."""
    m = round(toman / n / 1000000, 1)
    return fa_int('%g' % m).replace('.', '٫'), m * 1000000 * n == toman


def plan_card(p, service):
    """One single-service card inside a service tab. The buy button names its own service, so the
    checkout charges the right line whatever page the visitor is on."""
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
        + '<a class="btn plan__buy" href="#pay" data-buy="' + p['key'] + '" data-service="' + service + '" data-title="' + SERVICE_TITLES[service]
        + '" data-months="' + str(p['months']) + '" data-state="open" data-amount="' + str(p['amount']) + '">خرید</a>'
        + '<p class="plan__state" data-for="' + p['key'] + '" hidden></p>'
        + '</article>')


def salon_card(p):
    """One «پنل آرایشگاه» card. Every figure on it (price, per-person share, gift images, the
    price of each user beyond SALON_SEATS) is computed here from SALON_PLANS."""
    badge = SALON_BADGES.get(p['key'], '')
    each, exact = per_person(p['amount'], p['seats'])
    tier = next(x['name'] for x in PLANS if x['key'] == p['tier'])
    feats = ['هر چهار خدمت: مدل مو، رنگ مو، ناخن و مژه',
             'تا ' + fa_int(p['seats']) + ' کاربر؛ مدیر هم یکی از آن‌هاست',
             'لینک اختصاصی برای هر همکار',
             'اعتبار هدیه ' + fa_int(p['credits']) + ' عکس',
             'امکانات <span lang="en" dir="ltr">' + tier + '</span> برای کل سالن']
    return (
        '<article class="plan plan--salon' + (' plan--lead' if badge else '') + '" data-plan="' + p['key'] + '">'
        + (('<span class="plan__badge">' + CROWN + badge + '</span>') if badge else '')
        + '<h3>پنل آرایشگاه ' + fa_int(p['months']) + ' ماهه</h3>'
        + '<p class="plan__months">' + CAL + fa_int(p['months']) + ' ماهه</p>'
        + '<div class="plan__price" data-price-box="' + p['key'] + '">'
        + '<p class="plan__amount" data-price="' + p['key'] + '"><b>' + millions(p['amount']) + '</b> میلیون تومان</p>'
        + '<p class="plan__each">برای ' + fa_int(p['seats']) + ' نفر: نفری ' + ('' if exact else 'حدود ') + each + ' میلیون تومان</p></div>'
        + '<ul>' + ''.join('<li>' + TICK + '<span>' + f + '</span></li>' for f in feats) + '</ul>'
        + '<a class="btn plan__buy" href="#pay" data-buy="' + p['key'] + '" data-service="all" data-title="' + SERVICE_TITLES['all']
        + '" data-months="' + str(p['months']) + '" data-state="open" data-amount="' + str(p['amount'])
        + '" data-seats="' + str(p['seats']) + '" data-seat-amount="' + str(p['seat_amount']) + '">خرید</a>'
        + '<p class="plan__state" data-for="' + p['key'] + '" hidden></p>'
        + '<p class="plan__extra">نفر ' + ORDINAL[p['seats'] + 1] + ' به بعد: هر نفر ' + millions(p['seat_amount']) + ' میلیون تومان برای کل دوره</p>'
        + '</article>')


# The title the checkout line uses: «پلن مدل مو · ۳ ماهه». Single-service plans take the
# service's name; «پنل آرایشگاه» orders are service 'all'. Shared with worker/prices.js.
SERVICE_TITLES = {'hair': 'مدل مو', 'color': 'رنگ مو', 'nails': 'ناخن', 'lashes': 'مژه', 'all': 'آرایشگاه'}
ORDINAL = {2: 'دوم', 3: 'سوم', 4: 'چهارم', 5: 'پنجم'}
# Badges on the salon tab. The whole tab is «به‌صرفه‌ترین برای ۲ نفر به بعد»: it is true only
# while every salon plan costs less than two single-service plans of the same length (asserted).
SALON_BADGES = {'salon6': 'پیشنهاد آینه'}
SALON_VALUE = 'به‌صرفه‌ترین برای ۲ نفر به بعد'
for _p in SALON_PLANS:
    _single = next(x for x in PLANS if x['months'] == _p['months'])
    assert _p['amount'] < 2 * _single['amount'], 'the «۲ نفر به بعد» badge would be false for ' + _p['key']
PLAN_TABS = ['hair', 'color', 'nails', 'lashes']


def plans_panel(tabs, selected):
    """One panel. The four service tabs share ONE panel of the three single-service cards (the same
    plans, the same prices): its buy buttons carry the selected service, and src/copy.js rewrites
    data-service / data-title when another service tab is picked, so the checkout always charges
    the line the visitor chose. Drawing the cards four times would only repeat identical markup.
    The salon tab has its own panel. The selected tab is visible in the HTML itself."""
    if tabs == ['salon']:
        hide = '' if selected == 'salon' else ' hidden'
        body = ('<p class="psalon"><span class="psalon__badge">' + SALON_VALUE + '</span>'
                '<span>هر چهار خدمت برای کل سالن، تا ' + fa_int(SALON_SEATS) + ' کاربر.</span></p>'
                + '<div class="plans">' + ''.join(salon_card(p) for p in SALON_PLANS) + '</div>')
        pid = 'salon'
    else:
        service = selected if selected in tabs else tabs[0]
        hide = '' if selected in tabs else ' hidden'
        body = '<div class="plans">' + ''.join(plan_card(p, service) for p in PLANS) + '</div>'
        pid = 'single'
    return ('<div class="plans-panel" id="plans-' + pid + '" role="tabpanel" aria-labelledby="ptab-' + (selected if selected in tabs else tabs[0])
            + '" data-plans-panel="' + ' '.join(tabs) + '"' + hide + '>' + body + '</div>')


PLAN_NOTE = ('<p class="plan-note" id="plan-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v.01M12 11v5" stroke-linecap="round"/></svg>'
             + '<span>بعد از تمام شدن عکس‌های هدیه، هر ' + fa_int(TOPUP_IMAGES) + ' عکس ' + fa_int(TOPUP_AMOUNT // 1000) + ' هزار تومان</span></p>')


def plans_block(tabs, selected):
    single = [k for k in tabs if k in PLAN_TABS]
    return ((plans_panel(single, selected) if single else '') + (plans_panel(['salon'], selected) if 'salon' in tabs else '')
            + PLAN_NOTE)


plans = '<!--PLANPANELS-->'  # filled per page by make_pages (pricing_for)
assert all(p['amount'] > 0 for p in PLANS + SALON_PLANS)
plans_js = ''.join("  %s: {name: '%s', title: '%s', months: %d, amount: %d, was: %d, credits: %d, tier: '%s', seats: %d, seat_amount: %d},\n"
                   % (p['key'], p['name'], SERVICE_TITLES['all'] if p['seats'] else '', p['months'], p['amount'], p['was'], p['credits'], p['tier'], p['seats'], p['seat_amount'])
                   for p in PLANS + SALON_PLANS)
W('../../worker/prices.js',
  '// The plan table — GENERATED by design/landing/build.py from PLANS, the same table that draws' + NL
  + '// the price cards on every service page. Never edit by hand: change build.py and rebuild.' + NL
  + '//' + NL
  + '// amount / was: TOMAN. months: plan length. credits: gift images granted on confirmation.' + NL
  + '// tier: the features it opens (worker/plans.js). seats: users included (0 = no cap); each user' + NL
  + '// beyond seats costs seat_amount toman for the whole period (the «پنل آرایشگاه» plans).' + NL
  + 'export const PRICE_MINUTES = %d;' % PRICE_MINUTES + NL
  + 'export const PLANS = {' + NL + plans_js + '};' + NL
  + '// title: the checkout line «پلن <title> · ۳ ماهه»; empty = the service\'s own title below.' + NL
  + 'export const SERVICE_TITLES = ' + json.dumps(SERVICE_TITLES, ensure_ascii=False).replace('"', "'") + ';' + NL
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
h = h.replace('<!--PLANS-->', plans).replace('<!--STUDIO-->', studio + NL + R('src/pay.html'))
assert '<!--PLANS-->' not in h and '<!--STUDIO-->' not in h
assert 'id="pay"' in h and 'id="payForm"' in h, 'the payment sheet must ship'
# One support number everywhere: the landing must print the one in worker/support.js.
SUPPORT_TEL = re.search(r"SUPPORT_TEL = '(\d+)'", R('../../worker/support.js')).group(1)
assert set(re.findall(r'tel:(\d+)', h)) == {SUPPORT_TEL}, 'landing support number differs from worker/support.js'

# ---------------- the pages: home, four services, the salon panel, the demo ----------------
# page.html is the shell (head, header, footer, the pricing section) and every other section is
# a partial in src/. Each page below is the shell with its own list of sections cut out of them.
# All public copy lives in those partials and in the tables here; the PLANS block above only
# draws the price cards and never decides what a page says.
SERVICES = {
    'hair': {
        'label': 'مدل مو', 'path': '/hair', 'pair': 'style', 'line': 'hair',
        'title': 'برای متخصصان مدل مو',
        'desc': 'مشتری مدل مو را روی عکس خودش می‌بیند و مطمئن‌تر درخواست می‌دهد. نمونه، پلن‌ها و روش کار.',
        'eyebrow': 'برای متخصصان مدل مو',
        'h1': 'مشتری می‌پرسد «این مدل به من می‌آید؟»', 'accent': '',
        'lead': 'آینه جواب را روی عکس خودش نشان می‌دهد.',
        'f2': 'مدل را می‌بیند', 'req': 'درخواست مدل مو',
        'demo_title': 'مدل مو را روی عکس خودتان امتحان کنید.',
        'card': 'مدل را قبل از کوتاهی می‌بیند.',
        'ben_title': 'آینه برای مدل مو چه می‌کند؟', 'ben_sub': 'مشتری با انتخاب مشخص سراغ شما می‌آید.',
        'benefits': ['مشتری قبل از آمدن مدل را روی عکس خودش می‌بیند.',
                     'درخواست با مدل انتخاب‌شده به پنل یا ربات شما می‌رسد.',
                     'بدون توضیح طولانی، مدل از قبل مشخص است.'],
        'sample_title': 'یک مدل مو قبل و بعد',
        'cta_title': 'مدل مو را همین الان روی عکس خودتان ببینید.',
    },
    'color': {
        'label': 'رنگ مو', 'path': '/color', 'pair': 'color', 'line': 'color',
        'title': 'برای متخصصان رنگ مو',
        'desc': 'مشتری رنگ مو را قبل از شروع روی عکس خودش می‌بیند و مطمئن‌تر درخواست می‌دهد. نمونه، پلن‌ها و روش کار.',
        'eyebrow': 'برای متخصصان رنگ مو',
        'h1': 'مشتری می‌گوید «این نبود که فکر می‌کردم.»', 'accent': '',
        'lead': 'آینه رنگ را قبل از شروع، روی عکس خودش نشان می‌دهد.',
        'f2': 'رنگ را می‌بیند', 'req': 'درخواست رنگ مو',
        'demo_title': 'رنگ مو را روی عکس خودتان امتحان کنید.',
        'card': 'رنگ را قبل از رنگ کردن می‌بیند.',
        'ben_title': 'آینه برای رنگ مو چه می‌کند؟', 'ben_sub': 'بحث «این نبود» قبل از شروع تمام می‌شود.',
        'benefits': ['رنگ را قبل از شروع روی عکس خودش می‌بیند.',
                     'رنگ را با هم روی تصویر انتخاب می‌کنید.',
                     'درخواست با رنگ انتخاب‌شده به شما می‌رسد.'],
        'sample_title': 'یک رنگ مو قبل و بعد',
        'cta_title': 'رنگ مو را همین الان روی عکس خودتان ببینید.',
    },
    'nails': {
        'label': 'ناخن', 'path': '/nails', 'pair': 'nails', 'line': 'nails',
        'title': 'برای متخصصان ناخن',
        'desc': 'مشتری طرح ناخن را روی دست خودش می‌بیند و مطمئن‌تر درخواست می‌دهد. نمونه، پلن‌ها و روش کار.',
        'eyebrow': 'برای متخصصان ناخن',
        'h1': 'مشتری عکس طرحی را از اینستاگرام نشانتان می‌دهد، ولی مطمئن نیست به دستش بیاید.', 'accent': '',
        'lead': 'آینه طرح را روی دست خودش نشان می‌دهد.',
        'f2': 'طرح را می‌بیند', 'req': 'درخواست طرح ناخن',
        'demo_title': 'طرح ناخن را روی دست خودتان امتحان کنید.',
        'card': 'طرح را روی دست خودش می‌بیند.',
        'ben_title': 'آینه برای ناخن چه می‌کند؟', 'ben_sub': 'انتخاب طرح دیگر حدسی نیست.',
        'benefits': ['طرح را روی دست خودش می‌بیند.',
                     'مشتری زودتر تصمیم می‌گیرد.',
                     'درخواست با طرح انتخاب‌شده می‌رسد.'],
        'sample_title': 'یک طرح ناخن قبل و بعد',
        'cta_title': 'طرح ناخن را همین الان روی دست خودتان ببینید.',
    },
    'lashes': {
        'label': 'مژه', 'path': '/lashes', 'pair': 'lashes', 'line': 'lashes',
        'title': 'برای متخصصان مژه',
        'desc': 'مشتری حالت مژه را قبل از نوبت روی عکس خودش می‌بیند و مطمئن‌تر درخواست می‌دهد. نمونه، پلن‌ها و روش کار.',
        'eyebrow': 'برای متخصصان مژه',
        'h1': 'مشتری از حجم و فرم مژه می‌ترسد.', 'accent': '',
        'lead': 'آینه حالت را قبل از نوبت نشان می‌دهد.',
        'f2': 'حالت را می‌بیند', 'req': 'درخواست حالت مژه',
        'demo_title': 'حالت مژه را روی عکس خودتان امتحان کنید.',
        'card': 'حجم مژه را روی چشم خودش می‌بیند.',
        'ben_title': 'آینه برای مژه چه می‌کند؟', 'ben_sub': 'مشتری با خیال راحت نوبت می‌گیرد.',
        'benefits': ['حالت مژه را قبل از نوبت می‌بیند.',
                     'نگرانی از حجم و فرم، قبل از نوبت برطرف می‌شود.',
                     'درخواست با حالت انتخاب‌شده می‌رسد.'],
        'sample_title': 'یک حالت مژه قبل و بعد',
        'cta_title': 'حالت مژه را همین الان روی عکس خودتان ببینید.',
    },
}
# The REAL before/after of each service ("نمونهٔ ساخته‌شده با آینه"). Filled only with a real,
# approved pair — {'before': 'assets/….webp', 'after': 'assets/….webp'}. While a service has no
# entry its page simply has no sample section; nothing is invented to fill the gap.
REAL_SAMPLES = {k: {'before': f'assets/sample-{k}-before.webp', 'after': f'assets/sample-{k}-after.webp'} for k in ('hair', 'color', 'nails', 'lashes')}  # owner's illustrative pairs, labelled «نمونهٔ نمایشی»
HINTS = {  # the first-chip hint under the demo's title; tryon.js writes the same texts on click
    'hair': 'یک عکس روبه‌رو با صورت کامل، بدون کلاه و عینک آفتابی، در نور طبیعی.',
    'color': 'عکسی که موهایتان کامل و واضح در آن دیده شود؛ نور زرد لامپ رنگ را عوض می‌کند.',
    'nails': 'پشت دست، انگشت‌ها کنار هم و همهٔ ناخن‌ها در قاب، در نور روز.',
    'lashes': 'از نزدیک و روبه‌رو، هر دو چشم باز و کامل در قاب، بدون عینک.',
}
LINE_TITLE = {'hair': 'مدل مو', 'color': 'رنگ مو', 'nails': 'ناخن', 'lashes': 'مژه'}
LINE_PAIR = {'hair': 'style', 'color': 'color', 'nails': 'nails', 'lashes': 'lashes'}
HOME_NOTE = 'نمونهٔ نمایشی'
SERVICE_NOTE = 'نمونهٔ نمایشی؛ برای انتخاب قبل از نوبت.'
SALON_HERO = {
    'title': 'پنل آرایشگاه',
    'desc': 'پنل آرایشگاه: هر چهار خدمت، تا ۳ کاربر، لینک اختصاصی برای هر همکار. نمونه، پلن‌ها و روش کار.',
    'eyebrow': 'پنل آرایشگاه',
    'h1': 'هر همکار، مشتری‌های خودش؛ همه روی یک تصویر.',
    'lead': 'با آینه همه همان تصویری را می‌بینند که مشتری دیده.',
}
CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m8 12.4 2.6 2.6L16 9.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
# Three of the hairstyle models, shown on the second hero frame of every hairstyle hero.
PICKS = ('<span class="loop__picks" aria-hidden="true">'
         + ''.join('<img src="assets/look-s%s.webp" width="40" height="50" loading="lazy" alt="">' % n for n in ('02', '07', '12')) + '</span>')
SPARK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.4 5.4L20 10.5l-5.6 2.1L12 18l-2.4-5.4L4 10.5l5.6-2.1Z"/></svg>'


# The home stop-motion (#process): seconds each of a service's four frames stays (photo, pick + «بساز»,
# making, result) and the whole loop. proc.css holds the same 12 s and the two window lengths.
PROC_LEN, PROC_LOOP = (0.5, 1.0, 0.5, 1.0), 12.0


def section(src, sid):
    """One <section id=…>…</section> from a source with no nested sections."""
    m = re.search(r'[ \t]*(?:<!--[^\n]*-->\s*)*<section id="' + re.escape(sid) + r'"[\s\S]*?</section>\n?', src)
    assert m, 'section ' + sid
    return m.group(0)


def keep_buttons(html, attr, keep):
    """Drop the tab buttons for other services; hide the tab row when one is left."""
    return re.sub(r'\s*<button type="button" class="[^"]*" ' + attr + r'="(\w+)"[\s\S]*?</button>',
                  lambda m: m.group(0) if m.group(1) in keep else '', html)


def nav(items):
    # The first in-page item starts underlined; the scrollspy moves it with the reader.
    return ''.join('<a href="%s">%s</a>' % (h_, t) for h_, t in items)


def mobile(items):
    return (''.join('<a href="%s">%s<span aria-hidden="true">←</span></a>' % (h_, t) for h_, t in items)
            + '<a href="__ORIGIN__/panel">ورود<span aria-hidden="true">←</span></a>'
            + '<a class="btn" href="#demo">نمونه بساز</a>')


def shell(h, main, items, home=False, service='', title='', desc='', tab=''):
    """Swap the <main>, the menus and the head texts of the full page."""
    out = re.sub(r'<main id="main">[\s\S]*?</main>', lambda m: '<main id="main">\n' + main + '\n</main>', h, count=1)
    out = re.sub(r'(<nav class="nav" aria-label="ناوبری اصلی">)[\s\S]*?(</nav>)', lambda m: m.group(1) + nav(items) + m.group(2), out, count=1)
    out = re.sub(r'(<nav id="mobile-menu"[^>]*>)[\s\S]*?(</nav>)', lambda m: m.group(1) + mobile(items) + m.group(2), out, count=1)
    if not home:
        out = out.replace('<a class="brand" href="#intro" aria-label="آینه، بازگشت به ابتدای صفحه">', '<a class="brand" href="/" aria-label="آینه، صفحهٔ اصلی">', 1)
    if service:
        out = out.replace('<body>', '<body data-service="' + service + '">', 1)
    if title:
        out = re.sub(r'<title>.*?</title>', '<title>' + title + ' | آینه</title>', out, count=1)
        out = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + title, out, count=1)
    if desc:
        out = re.sub(r'(<meta name="description" content=")[^"]*', lambda m: m.group(1) + desc, out, count=1)
        out = re.sub(r'(<meta property="og:description" content=")[^"]*', lambda m: m.group(1) + desc, out, count=1)
    if tab:
        out = out.replace('<section id="services" class="section section--soft pricing"', '<section id="services" data-default-tab="' + tab + '" class="section section--soft pricing"', 1)
    # An in-page link to a section this page does not carry goes to the home page.
    ids = set(re.findall(r'\bid="([\w-]+)"', out))
    out = re.sub(r'href="#([\w-]+)"', lambda m: m.group(0) if m.group(1) in ids else 'href="/#' + m.group(1) + '"', out)
    return out


def make_pages(full):
    src = full
    home_src, service_src, salon_src = R('src/home.html'), R('src/service.html'), R('src/salon.html')
    topup = lambda t: t.replace('{{TOPUP_IMAGES}}', fa_int(TOPUP_IMAGES)).replace('{{TOPUP_PRICE}}', fa_int(TOPUP_AMOUNT // 1000))
    pricing_src, faq = section(src, 'services'), topup(section(home_src, 'faq'))
    assert all(SERVICE_TITLES[k] == LINE_TITLE[k] == SERVICES[k]['label'] for k in SERVICES), 'one name per service'

    def pricing_for(tabs, selected):
        """The price section with one panel per tab (src/copy.js switches them). The page's own
        tab is selected in the HTML; with a single tab the row stays hidden."""
        out = pricing_src.replace('<!--PLANPANELS-->', plans_block(tabs, selected))
        for k in ['hair', 'color', 'nails', 'lashes', 'salon']:
            m = re.search(r'\s*<button type="button" role="tab" id="ptab-' + k + r'"[^>]*>([^<]*)</button>', out)
            btn = m.group(0)
            assert m.group(1) == SERVICE_TITLES['all' if k == 'salon' else k], 'tab label is the checkout title: ' + k
            if k in PLAN_TABS:
                out = out.replace(btn, btn.replace('aria-controls="plans-' + k + '"', 'aria-controls="plans-single"'), 1)
                btn = btn.replace('aria-controls="plans-' + k + '"', 'aria-controls="plans-single"')
            if k not in tabs:
                out = out.replace(btn, '', 1)
            elif k == selected:
                out = out.replace(btn, btn.replace('aria-selected="false" tabindex="-1"', 'aria-selected="true" tabindex="0"'), 1)
        if len(tabs) > 1:
            out = out.replace('<div class="ptabs" data-ptabs hidden>', '<div class="ptabs" data-ptabs>', 1)
        assert '<!--PLANPANELS-->' not in out and out.count('data-plans-panel="') == bool(set(tabs) & set(PLAN_TABS)) + ('salon' in tabs)
        return out
    pricing = pricing_for(PLAN_TABS + ['salon'], 'hair')
    chat_tpl = R('src/chat.html')
    chat = lambda pair, req: chat_tpl.replace('{{PAIR}}', pair).replace('{{REQ}}', req)

    def hero(pair, eyebrow, h1, accent, lead, f2, req, note, cls=''):
        return (R('src/hero.html').replace('{{HERO_CLASS}}', cls).replace('{{EYEBROW}}', eyebrow)
                .replace('{{H1}}', h1).replace('{{ACCENT}}', accent).replace('{{LEAD}}', lead)
                .replace('{{MAIN_BTN}}', 'روی عکس خودم امتحان کنم').replace('{{PAIR}}', pair)
                .replace('{{F2}}', f2).replace('{{NOTE}}', note).replace('{{CHAT}}', chat(pair, req))
                .replace('{{PICKS}}', PICKS if pair == 'style' else ''))

    def demo(lines, title, sub, first):
        d = R('src/tryon.html')
        if first in ('nails', 'lashes'):
            d = d.replace('با عکس روبه‌رو و پرنور', 'با عکس واضح و پرنور')
        if len(lines) == 1:
            d = keep_buttons(d, 'data-line', lines)
            d = d.replace('<div class="tryon__lines"', '<div class="tryon__lines" hidden', 1)
        if not title:  # the /try page already opens with its own title and three steps
            d = re.sub(r'\s*<div class="head">[\s\S]*?</div>', '', d, count=1)
        return (d.replace('{{DEMO_TITLE}}', title).replace('{{DEMO_SUB}}', sub)
                .replace('{{FIRST_PAIR}}', LINE_PAIR[first]).replace('{{FIRST_LABEL}}', LINE_TITLE[first])
                .replace('{{FIRST_HINT}}', HINTS[first]))

    def cta(title):
        return (section(home_src, 'cta').replace('{{CTA_TITLE}}', title)
                .replace('{{CTA_SUB}}', 'بدون نصب، روی گوشی.'))

    def card(key, s):
        p, lab = s['pair'], s['label']
        return (
            '        <article class="sample-card">\n'
            '          <div class="compare" aria-label="نمونهٔ نمایشی قبل و بعد: %s">\n'
            '            <img class="compare__img compare__img--before" src="assets/demo-%s-before.webp" width="450" height="600" loading="lazy" decoding="async" alt="">\n'
            '            <img class="compare__img compare__img--after" src="assets/demo-%s-after.webp" width="450" height="600" loading="lazy" decoding="async" alt="">\n'
            '            <span class="compare__badge">نمونهٔ نمایشی</span>\n'
            '            <span class="compare__tag compare__tag--before">قبل</span>\n'
            '            <span class="compare__tag compare__tag--after">بعد</span>\n'
            '            <span class="compare__divider" aria-hidden="true"></span>\n'
            '            <span class="compare__knob compare__knob--sm" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M9 8 5 12l4 4m6-8 4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>\n'
            '            <input class="compare__range" type="range" min="0" max="100" value="50" dir="rtl" aria-label="جابه‌جا کردن خط مقایسهٔ %s">\n'
            '          </div>\n'
            '          <div class="sample-card__body"><b>%s</b><p>%s</p><a class="btn" href="%s">امتحان و قیمت</a></div>\n'
            '        </article>') % (lab, p, p, lab, lab, s['card'], s['path'])

    def glance_card(key, s):
        return ('        <a class="glance__card" href="%s"><img src="assets/demo-%s-after.webp" width="450" height="600" loading="lazy" decoding="async" alt="نمونهٔ نمایشی: %s روی عکس مشتری">'
                '<span><b>%s</b><small>%s</small></span></a>') % (s['path'], s['pair'], s['label'], s['label'], s['card'])

    # ---- home ----
    # The home hero shows one woman in three combined looks (hairstyle + colour + lashes + nails),
    # so a visitor sees at once that every service is covered (owner's decision). 5 frames, 15 s.
    def svc(h):
        # Home hero: every service gets two frames (before / after), 8 frames, 3 s each = 24 s.
        names = {'style': 'مدل مو', 'color': 'رنگ مو', 'lashes': 'مژه', 'nails': 'ناخن'}
        figs = []
        for pair in ('style', 'color', 'lashes', 'nails'):
            for kind, cap in (('before', 'عکس مشتری'), ('after', 'نتیجهٔ نمایشی')):
                n = len(figs)
                pri = ' fetchpriority="high"' if n == 0 else ''
                figs.append(('<figure class="loop__f loop__s%d"><img src="assets/demo-%s-%s.webp" width="450" height="600" loading="eager"%s decoding="async" alt="نمونهٔ نمایشی: %s، %s">'
                             '<figcaption>%s: %s</figcaption></figure>') % (n, pair, kind, pri, names[pair], cap, names[pair], cap))
        h = re.sub(r'(<div class="loop__screen">)[\s\S]*?(</div>\s*<button class="loop__toggle"[\s\S]*?</button>\s*<ol class="loop__dots")', lambda m: m.group(1) + ''.join(figs) + m.group(2), h, count=1)
        h = h.replace('hero-stage loop"', 'hero-stage loop loop--svc"').replace('سه قاب پشت‌سرهم', 'هشت قاب پشت‌سرهم')
        return h.replace('<li></li><li></li><li></li>', '<li></li>' * 8)
    def mix(h):
        f1 = re.search(r'<figure class="loop__f loop__f--1">[\s\S]*?</figure>', h).group(0)
        f2 = re.search(r'<figure class="loop__f loop__f--2">[\s\S]*?</figure>', h).group(0)
        f3 = re.search(r'<figure class="loop__f loop__f--3">', h).group(0)
        cap1 = re.search(r'<figcaption>[\s\S]*?</figcaption>', f1).group(0)
        new1 = ('<figure class="loop__f loop__f--1">\n                <img src="assets/hero-mix-0.webp" width="450" height="600" fetchpriority="high" decoding="async" alt="نمونهٔ نمایشی از عکس مشتری">\n                ' + cap1 + '\n              </figure>')
        looks = ['مدل مو، رنگ، مژه و ناخن', 'مدل و رنگ دیگر، مژه و ناخن دیگر', 'یک ترکیب دیگر']
        new2 = ''.join(
            '\n              <figure class="loop__f loop__f--m%d">\n                <img src="assets/hero-mix-%d.webp" width="450" height="600" decoding="async" alt="نمونهٔ نمایشی: ترکیب مدل مو، رنگ مو، مژه و ناخن روی عکس مشتری">\n                <figcaption>%s%s</figcaption>\n              </figure>' % (i, i, SPARK, looks[i - 1])
            for i in (1, 2, 3))
        h = h.replace(f1, new1).replace(f2, new2.strip()).replace(f3, '<figure class="loop__f loop__f--3 loop__f--m4">')
        h = h.replace('hero-stage loop"', 'hero-stage loop loop--mix"').replace('سه قاب پشت‌سرهم', 'پنج قاب پشت‌سرهم')
        return h.replace('<li></li><li></li><li></li>', '<li></li><li></li><li></li><li></li><li></li>')
    def proc(h):
        # Stop-motion of the real demo page: per service 4 real screenshots (assets/proc-<pair>-<n>.webp,
        # captured from /s/demo with the service's own demo-<pair>-before.webp as the upload and one real
        # generation each). 3 s per service, 12 s in all; frame n shows for PROC_LEN[n] s. Negative delays
        # put every frame at its place in the loop from the first paint.
        names = [('style', 'مدل مو'), ('color', 'رنگ مو'), ('lashes', 'مژه'), ('nails', 'ناخن')]
        steps = ['<i>۱</i>عکس', '<i>۲</i>انتخاب و «بساز»', '<i>۳</i>در حال ساخت', '<i>۴</i>نتیجه']
        tilt = ['-1.4deg', '.9deg', '-.6deg', '1.2deg']
        figs, t = [], 0.0
        for si, (pair, name) in enumerate(names):
            for n in range(4):
                ln = PROC_LEN[n]
                still = ' proc__f--still' if (pair, n) == ('color', 3) else ''
                figs.append(('<figure class="proc__f proc__f--%s%s" style="--d:%ss;--t:%s">'
                             '<span class="proc__shot"><img src="assets/proc-%s-%d.webp" width="640" height="1385" loading="lazy" decoding="async" alt=""></span>'
                             '<figcaption><b>%s</b>%s</figcaption></figure>')
                            % ('a' if ln == 0.5 else 'b', still, ('%g' % (t - PROC_LOOP)), tilt[(si + n) % 4], pair, n + 1, name, steps[n]))
                t += ln
        assert t == PROC_LOOP and len(figs) == 16
        chips = ''.join('<li style="--d:%gs">%s</li>' % (i * PROC_LOOP / 4 - PROC_LOOP, nm) for i, (_, nm) in enumerate(names))
        return h.replace('{{PROC_FRAMES}}', ''.join(figs)).replace('{{PROC_SVC}}', chips)
    home_main = (
        svc(hero('style', '', '«این مدل بهم می‌اد؟» را', 'دیگر حدسی جواب ندهید.',
             'مشتری مدل مو، رنگ، ناخن و مژه را روی عکس خودش می‌بیند و با خیال راحت نوبت می‌گیرد.',
             'مدل را می‌بیند', 'درخواست مدل مو', HOME_NOTE))
        + proc(section(home_src, 'process'))
        + demo(list(LINE_TITLE), 'خودتان <em>امتحان کنید.</em>', 'عکس خودتان را بگذارید و مدل را ببینید.', 'hair')
        + section(home_src, 'how') + studio
        + section(home_src, 'get').replace('{{CHAT}}', chat('style', 'درخواست مدل مو'))
        + section(home_src, 'choose').replace('{{CARDS}}', NL.join(card(k, s) for k, s in SERVICES.items()))
        + section(home_src, 'why') + pricing + R('src/pay.html') + faq + cta('اولین نمونه را همین الان روی عکس خودتان بسازید.')
    )
    home_nav = [('#choose', 'خدمات'), ('#services', 'تعرفه‌ها'), ('#faq', 'سؤالات')]
    other_nav = [('/#choose', 'خدمات'), ('#services', 'تعرفه‌ها'), ('/#faq', 'سؤالات')]
    pages = {'home': shell(full, home_main, home_nav, home=True, tab='hair')}

    # ---- the four service pages, one template ----
    for key, s in SERVICES.items():
        back = '          <a class="hero-back" href="/"><span aria-hidden="true">→</span> آینه · همهٔ خدمات</a>\n          <span class="eyebrow">' + s['eyebrow'] + '</span>\n'
        real = REAL_SAMPLES.get(key)
        sample = (section(service_src, 'sample').replace('{{SAMPLE_TITLE}}', s['sample_title'])
                  .replace('{{REAL_BEFORE}}', real['before']).replace('{{REAL_AFTER}}', real['after'])) if real else ''
        ben = section(service_src, 'benefits')
        ben = (ben.replace('{{BEN_TITLE}}', s['ben_title']).replace('{{BEN_SUB}}', s['ben_sub']).replace('{{PAIR}}', s['pair']).replace('{{LABEL}}', s['label'])
               .replace('{{BENEFITS}}', NL.join('            <li>' + CHECK + b + '</li>' for b in s['benefits'])))
        play = ''
        if key == 'hair':
            # The mirror on a sample face stays on the hairstyle page only, as the first of two tabs.
            play = ('<div class="try-switch band" id="trySwitch" role="tablist" aria-label="دو راه امتحان" hidden>'
                    '<button type="button" role="tab" data-try="play" aria-selected="true">روی چهرهٔ نمونه <small>بدون عکس</small></button>'
                    '<button type="button" role="tab" data-try="demo" aria-selected="false">روی عکس خودتان <small>با عکس شما</small></button></div>\n') + R('src/play.html')
        main = (hero(s['pair'], back, s['h1'], s['accent'], s['lead'], s['f2'], s['req'], SERVICE_NOTE, ' hero--service')
                + play + demo([s['line']], s['demo_title'], 'بدون نصب، روی گوشی.', s['line'])
                + sample + ben + studio + pricing_for(PLAN_TABS + ['salon'], key) + R('src/pay.html') + cta(s['cta_title']))
        pages[key] = shell(full, main, other_nav, service=key, title=s['title'], desc=s['desc'], tab=key)

    # ---- the salon panel ----
    S = SALON_HERO
    back = '          <a class="hero-back" href="/"><span aria-hidden="true">→</span> آینه · همهٔ خدمات</a>\n          <span class="eyebrow">' + S['eyebrow'] + '</span>\n'
    salon_pricing = pricing_for(['salon'], 'salon')
    salon_pricing = re.sub(r'<!--SINGLE-->[\s\S]*?<!--/SINGLE-->\s*', '', salon_pricing).replace('پلن خدمت خودتان را <em>انتخاب کنید.</em>', 'پنل آرایشگاه را <em>انتخاب کنید.</em>', 1)
    assert 'pbar' not in salon_pricing and 'data-ptabs hidden' in salon_pricing
    salon_main = (
        hero('style', back, S['h1'], '', S['lead'], 'مدل را می‌بیند', 'درخواست مدل مو', HOME_NOTE, ' hero--service')
        + section(salon_src, 'glance').replace('{{GLANCE}}', NL.join(glance_card(k, s) for k, s in SERVICES.items()))
        + section(salon_src, 'team')
        + demo(list(LINE_TITLE), 'خودتان <em>امتحان کنید.</em>', 'عکس خودتان را بگذارید و مدل را ببینید.', 'hair')
        + studio + section(salon_src, 'bundle') + salon_pricing + R('src/pay.html')
        + cta('همه در سالن، روی یک تصویر با مشتری هماهنگ می‌شوند.')
    )
    pages['salon'] = shell(full, salon_main, other_nav, service='salon', title=S['title'], desc=S['desc'], tab='salon')

    # ---- ساخت نمونه: the demo on a page of its own (for links from reels and the service pages) ----
    try_main = R('src/try.html') + demo(list(LINE_TITLE), '', '', 'hair')
    pages['sample'] = shell(full, try_main, [('/#choose', 'خدمات'), ('/#services', 'تعرفه‌ها'), ('/#faq', 'سؤالات')],
                         title='ساخت نمونه', desc='خدمت را انتخاب کنید، عکس روبه‌رو و روشن بگذارید و مدل را روی خودتان ببینید؛ یک نمونه برای انتخاب قبل از نوبت.')
    for k, v in pages.items():
        assert v.count('<main id="main">') == 1, k
        assert 'id="demo"' in v and 'id="h1"' in v, k
    for k in ['home', *SERVICES, 'salon']:
        assert 'id="services"' in pages[k] and 'id="pay"' in pages[k] and 'id="salon-example"' in pages[k], k
    assert 'id="choose"' in pages['home'] and 'id="faq"' in pages['home']
    for k in [*SERVICES, 'salon', 'sample']:
        assert 'id="choose"' not in pages[k] and 'id="faq"' not in pages[k], k
    for old in ('۱۹ مدل', '۷ رنگ'):
        assert all(old not in v for v in pages.values()), old
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
    SCRIPTS = ['funnel.js', 'story.js', 'tryon.js', 'play.js', 'draft.js', 'portrait.js',
               'hair-color.js', 'try.js', 'reveal.js', 'cinema2.js',
               'builder.js', 'refine.js', 'pay.js', 'cta.js', 'try-switch.js', 'copy.js', 'proc.js']
    # Hair-colour maths and the photo handoff are used by the studio. hero.js, scenes.js,
    # and cinema.js drove the retired film sections. cta.js owns the mobile sticky action,
    # keeping it clear of the film, the salon-page builder, duplicate CTAs, and open dialogs.
    for name in SCRIPTS:
        assert os.path.exists('src/' + name), name
    # play.js / try-switch.js drive the sample-face mirror, which only the hairstyle page carries;
    # proc.js drives the home stop-motion (#process).
    scripts = ''.join('<script>' + NL + R('src/' + n) + NL + '</script>' + NL for n in SCRIPTS
                      if ('id="play"' in h or n not in ('play.js', 'try-switch.js'))
                      and ('id="process"' in h or n != 'proc.js'))
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
W('../../worker/landing.js', '// Public pages: "/" (home), the service pages /hair, /color, /nails, /lashes, /salon-panel and /sample (owner console lives at /admin).' + NL
  + '// GENERATED by design/landing/build.py from one design source; images in public/landing/.' + NL
  + 'export const landingHTML=`' + WORKER['home'].replace(chr(92), chr(92) * 2) + '`;' + NL
  + 'export const servicePages={' + ','.join(k + ':`' + v.replace(chr(92), chr(92) * 2) + '`' for k, v in WORKER.items() if k != 'home') + '};' + NL)
print(len(out), {k: len(v) for k, v in WORKER.items()})
