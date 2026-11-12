// Paid plans: a plan panel → bank transfer to the owner's card → a 10-minute window →
// confirmation (by the owner in /admin, or by the payment site's webhook) → the salon panel
// and the public salon page open.
//
// Rules this file keeps:
//  * An amount only exists when the owner approved one. The page's figures come from
//    src/price.json at build time; this module is generated from the same table
//    (worker/prices.js), and the server refuses any plan whose amount is unset.
//  * The card number lives in app_settings ('pay_card'), set in /admin — never in the code.
//    An order is still possible without it (the page says so), but no number is invented.
//  * Expiry is decided by the server clock. A closed order cannot be paid; the page only
//    mirrors `expires_at`.
//  * Money is in TOMAN on the page; amounts are stored in RIANS (×10) to keep the integer
//    arithmetic unambiguous.
import {must, phone, text, uid, digits} from './domain.js';
import {PLANS, PRICE_MINUTES} from './prices.js';

const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;

export const PAY_CARD = 'pay_card';
export const WEBHOOK_KEY = 'pay_webhook_key';
export const COUPONS = 'pay_coupons';

/* One order lives this long. The page counts down; the server enforces. */
export const ORDER_MINUTES = PRICE_MINUTES;

/* Persian card numbers are grouped in fours; only digits survive storage. */
export const cardDigits = v => digits(String(v ?? '')).replace(/\D/g, '');
export function cardValid(v) {
  const d = cardDigits(v);
  return d.length === 16 && !/^(\d)\1{15}$/.test(d) && luhn(d);
}
function luhn(d) {
  let sum = 0;
  for (let i = 0; i < d.length; i++) {
    let n = Number(d[d.length - 1 - i]);
    if (i % 2 === 1) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

/* A short, human-quotable code. No 0/O/1/I so a receipt note can be typed from a screenshot. */
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const ref = () => {
  const a = crypto.getRandomValues(new Uint8Array(6));
  return 'AY' + Array.from(a, x => ALPHABET[x % ALPHABET.length]).join('');
};

/* The key that opens the salon panel. Shown once; only its hash rests in the database. */
export const newAccessKey = () => {
  const a = crypto.getRandomValues(new Uint8Array(9));
  return 'AY-' + Array.from(a, x => ALPHABET[x % ALPHABET.length]).join('');
};

export const hashKey = async s => {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('ayneh-panel:' + s));
  return Array.from(new Uint8Array(d), x => x.toString(16).padStart(2, '0')).join('');
};

export const planAmount = key => Number(PLANS[key]?.amount || 0);

/* Coupons: {CODE:{percent|amount, max, used}}. `percent` is of the order amount, `amount` in
   tomans. max 0 = unlimited. Kept in app_settings so the owner can edit them without a deploy. */
export async function couponTable(db) {
  try {
    const t = JSON.parse((await one(db, 'SELECT value FROM app_settings WHERE key=?', COUPONS))?.value || '{}');
    return t && typeof t === 'object' && !Array.isArray(t) ? t : {};
  } catch {
    return {};
  }
}
export function discountFor(coupon, amountToman, table) {
  const code = String(coupon || '').trim().toUpperCase();
  if (!code) return {code: '', toman: 0};
  const rule = table[code];
  if (!rule || typeof rule !== 'object') return {code: '', toman: 0};
  if (Number(rule.max) > 0 && Number(rule.used || 0) >= Number(rule.max)) return {code: '', toman: 0};
  let off = 0;
  if (Number.isFinite(Number(rule.percent))) off = Math.round(amountToman * Math.max(0, Math.min(100, Number(rule.percent))) / 100);
  else if (Number.isFinite(Number(rule.amount))) off = Math.max(0, Number(rule.amount));
  off = Math.min(off, amountToman);
  return off > 0 ? {code, toman: off} : {code: '', toman: 0};
}

/* Internally an amount is rials (10 × the toman the page shows); the API speaks toman. */
const toman = rial => Math.round(Number(rial || 0) / 10);

/* What the page needs to draw: the figures, never the internals. */
export async function publicOrder(db, env, row, {key = '', origin = ''} = {}) {
  const card = (await one(db, 'SELECT value FROM app_settings WHERE key=?', PAY_CARD))?.value || '';
  const salon = row.salon_id ? await one(db, 'SELECT slug FROM salons WHERE id=?', row.salon_id) : null;
  /* Absolute links whenever the request origin is known, so a link copied from the phone
     still works on a laptop (and in a webhook payload). */
  const base = env.APP_ORIGIN || origin;
  const paid = row.status === 'paid';
  return {
    id: row.id, ref: row.ref, plan: row.plan, plan_name: PLANS[row.plan]?.name || row.plan,
    amount: toman(row.amount), discount: toman(row.discount),
    status: row.status, created_at: row.created_at, expires_at: row.expires_at,
    card: cardDigits(card) || '', card_owner: card ? cardOwner(card) : '',
    /* The key is shown once, when the order opens (so the customer keeps it while paying)
       and again only if the owner regenerates it. A plain GET never returns it. */
    access_key: key || '',
    panel_url: paid ? (base ? base + '/panel' : '/panel') : '',
    page_url: paid && salon ? (base ? base : '') + '/s/' + salon.slug : '',
    salon: row.salon_name, contact: row.contact_name,
  };
}
/* '6219 8619 1234 5678 — علی ادلی' → owner part only; empty when the owner typed digits alone. */
function cardOwner(v) {
  const s = String(v || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
  return s.replace(/[\d—–]/g, '').trim();
}

export async function cardSetting(db) {
  const raw = (await one(db, 'SELECT value FROM app_settings WHERE key=?', PAY_CARD))?.value || '';
  const d = cardDigits(raw);
  return {number: d, owner: cardOwner(raw), valid: cardValid(d), raw};
}

export async function saveCard(db, number, owner) {
  const d = cardDigits(number);
  must(!d || cardValid(d), 'شمارهٔ کارت باید ۱۶ رقم و معتبر باشد.');
  const name = text(String(owner || '').replace(/[۰-۹]/g, x => '۰۱۲۳۴۵۶۷۸۹'.indexOf(x)).replace(/[٠-٩]/g, x => '٠١٢٣٤٥٦٧٨٩'.indexOf(x)).replace(/[\d]/g, ''), 60);
  must(d ? name.length >= 3 : true, 'نام صاحب حساب را بنویسید.');
  await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at', PAY_CARD, d ? d + ' — ' + name : '', Date.now());
  return {number: d, owner: name};
}

/* Webhook token: generated once, shown in /admin, and compared in constant time. */
export async function webhookKey(db) {
  let k = (await one(db, 'SELECT value FROM app_settings WHERE key=?', WEBHOOK_KEY))?.value || '';
  if (!k) {
    k = 'whk_' + Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, '0')).join('');
    await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?)', WEBHOOK_KEY, k, Date.now());
  }
  return k;
}
export async function rotateWebhookKey(db) {
  const k = 'whk_' + Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, '0')).join('');
  await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at', WEBHOOK_KEY, k, Date.now());
  return k;
}

/* An expired order is closed on read as well, so a sleeping tab or a forgotten link never
   leaves a payable order behind. Cheap: one UPDATE guarded by status + time. */
export async function closeExpired(db) {
  await run(db, "UPDATE orders SET status='expired',updated_at=? WHERE status IN ('open','reviewing') AND expires_at<=?", Date.now(), Date.now());
}

const ACTIVE = "status IN ('open','reviewing')";

export async function createOrder(db, env, b, origin = '') {
  const plan = String(b.plan || '');
  must(PLANS[plan], 'این پنل وجود ندارد.', 404);
  const amount = planAmount(plan);
  must(amount > 0, 'مبلغ این پنل هنوز نهایی نشده؛ درخواست دمو بفرستید.', 409);
  const salon = text(String(b.salon || ''), 80), name = text(String(b.name || ''), 60);
  must(salon.length >= 2, 'نام سالن را بنویسید.');
  must(name.length >= 2, 'نام و نام خانوادگی را بنویسید.');
  must(b.consent === true, 'برای هماهنگی راه‌اندازی، تأیید تماس لازم است.');
  const tel = phone(b.phone), now = Date.now();
  /* One open order per mobile: a second click resumes the first one instead of stacking
     countdowns and two card pages. */
  await closeExpired(db);
  const existing = await one(db, 'SELECT * FROM orders WHERE phone=? AND ' + ACTIVE + ' ORDER BY created_at DESC LIMIT 1', tel);
  if (existing) return publicOrder(db, env, existing, {key: '', origin});
  const coupon = discountFor(String(b.coupon || ''), amount, await couponTable(db));
  const key = newAccessKey();
  const row = {
    id: uid(), ref: ref(), plan, amount: (amount - coupon.toman) * 10,
    salon_name: salon, contact_name: name, phone: tel,
    city: text(String(b.city || ''), 40), note: text(String(b.note || ''), 300), status: 'open',
    expires_at: now + ORDER_MINUTES * 60000, access_key_hash: await hashKey(key),
    coupon: coupon.code, discount: coupon.toman * 10, created_at: now, updated_at: now,
  };
  await run(db,
    'INSERT INTO orders(id,ref,plan,amount,salon_name,contact_name,phone,city,note,status,expires_at,access_key_hash,coupon,discount,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    row.id, row.ref, row.plan, row.amount, row.salon_name, row.contact_name, row.phone, row.city, row.note, row.status,
    row.expires_at, row.access_key_hash, row.coupon, row.discount, row.created_at, row.updated_at);
  /* The owner hears about a new order on the same channel as inquiries. */
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      kind: 'order', level: 'good',
      text: 'سفارش ' + PLANS[plan].name + ' برای «' + salon + '» باز شد',
      detail: '👤 ' + name + '\n📞 ' + tel + '\n💳 ' + row.ref + ' · ' + Math.round(row.amount / 10).toLocaleString('fa-IR') + ' تومان\n⏳ ' + ORDER_MINUTES + ' دقیقه',
    });
  } catch {}
  return publicOrder(db, env, row, {key, origin});
}

/* Coupon use is counted in the same JSON the owner edits; a read-modify-write is fine here
   because a coupon is a courtesy, not money in flight. */
export async function bumpCoupon(db, code) {
  const table = await couponTable(db);
  if (!table[code]) return;
  table[code].used = Number(table[code].used || 0) + 1;
  await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at', COUPONS, JSON.stringify(table), Date.now());
}

export async function orderById(db, id) {
  must(/^[a-f0-9-]{36}$/.test(String(id)), 'سفارش پیدا نشد.', 404);
  return one(db, 'SELECT * FROM orders WHERE id=?', id);
}

export async function customerOrder(db, env, id, origin = '') {
  await closeExpired(db);
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  return publicOrder(db, env, row, {origin});
}

export async function setCoupon(db, env, id, code, origin = '') {
  await closeExpired(db);
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  must(row.status === 'open', 'این سفارش دیگر قابل تغییر نیست.', 409);
  const base = planAmount(row.plan);
  const coupon = discountFor(code, base, await couponTable(db));
  must(coupon.code, 'این کد تخفیف معتبر نیست یا ظرفیتش پر شده.', 422);
  await run(db, 'UPDATE orders SET coupon=?,discount=?,amount=?,updated_at=? WHERE id=? AND status=?',
    coupon.code, coupon.toman * 10, (base - coupon.toman) * 10, Date.now(), id, 'open');
  return publicOrder(db, env, await orderById(db, id), {origin});
}

export async function markReviewing(db, env, id, note, origin = '') {
  await closeExpired(db);
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  must(row.status === 'open' || row.status === 'reviewing', 'مهلت این سفارش تمام شده؛ سفارش تازه بسازید.', 410);
  const changed = await run(db, "UPDATE orders SET status='reviewing',receipt_note=?,updated_at=? WHERE id=? AND status='open' AND expires_at>?",
    text(String(note || ''), 120), Date.now(), id, Date.now());
  /* A coupon is spent when the customer actually commits (sends a receipt), not when a
     window is opened and abandoned. */
  if (changed.meta.changes && row.coupon) await bumpCoupon(db, row.coupon);
  return publicOrder(db, env, await orderById(db, id), {origin});
}

/* Confirmation is idempotent: the owner clicking twice, or the payment site retrying the
   webhook, must never create a second salon or a second key. */
export async function confirmOrder(db, env, id, {by = 'owner', key = '', origin = ''} = {}) {
  await closeExpired(db);
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  if (row.status === 'paid') return {order: await publicOrder(db, env, row, {origin}), key: ''};
  must(row.status === 'open' || row.status === 'reviewing', 'این سفارش بسته شده و قابل تأیید نیست.', 409);
  const salon = await provisionSalon(db, row.plan, row.salon_name, row.contact_name, row.phone, row.city);
  await run(db, "UPDATE orders SET status='paid',salon_id=?,confirmed_by=?,confirmed_at=?,updated_at=? WHERE id=? AND status IN ('open','reviewing')",
    salon.id, by, Date.now(), Date.now(), id);
  /* A key exists only if the customer did not keep theirs (owner resends one). */
  const fresh = key || '';
  if (fresh) await run(db, 'UPDATE orders SET access_key_hash=? WHERE id=?', await hashKey(fresh), id);
  const updated = await orderById(db, id);
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      kind: 'order', level: 'good',
      text: 'پرداخت ' + (PLANS[row.plan]?.name || row.plan) + ' برای «' + salon.name + '» تأیید شد',
      detail: '🔗 صفحه: /s/' + salon.slug + '\n👤 ' + row.contact_name + '\n📞 ' + row.phone + '\n💳 ' + row.ref + '\n✅ تأیید با: ' + (by === 'webhook' ? 'سایت پرداخت' : 'پنل مدیر'),
    });
  } catch {}
  return {order: await publicOrder(db, env, updated, {origin}), key: fresh};
}

/* The salon the plan unlocks. Slug: the salon's own name when it is Persian-free, else a
   readable fallback; always unique. The panel is reached with the order's access key. */
async function provisionSalon(db, plan, name, contact, tel, city) {
  const base = String(contact || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28) || 'salon';
  let slug = base, n = 1;
  while (await one(db, 'SELECT 1 FROM salons WHERE slug=?', slug)) slug = base + '-' + ++n;
  const id = uid(), now = Date.now();
  const profile = {manager: contact, phone: String(tel).replace(/^\+98/, '0'), ...(city ? {address: city} : {})};
  const settings = {generation_enabled: true, reference_verified: true, plan};
  await run(db, 'INSERT INTO salons(id,slug,owner_id,name,profile,settings,created_at) VALUES(?,?,?,?,?,?,?)',
    id, slug, 'order:' + tel, text(name, 100), JSON.stringify(profile), JSON.stringify(settings), now);
  return {id, slug};
}

/* Panel session: the key is exchanged for an HttpOnly cookie (same shape as the customer
   session cookie, different name so the two can never be confused). */
export async function panelLogin(db, key) {
  const k = String(key || '').trim();
  must(/^AY-[2-9A-HJ-NP-Z]{9}$/.test(k), 'کلید ورود معتبر نیست.', 401);
  const row = await one(db, "SELECT * FROM orders WHERE access_key_hash=? AND status='paid'", await hashKey(k));
  must(row, 'این کلید یا تأیید نشده یا منقضی شده است.', 401);
  const salon = await one(db, 'SELECT * FROM salons WHERE id=?', row.salon_id);
  must(salon, 'سالن پیدا نشد.', 404);
  return {order: row, salon};
}

export async function panelSalon(req, db) {
  const raw = (req.headers.get('cookie') || '').match(/(?:^|; )ayneh_panel=([a-f0-9]{64})(?:;|$)/)?.[1];
  must(raw, 'برای دیدن پنل سالن وارد شوید.', 401);
  const row = await one(db, "SELECT * FROM orders WHERE access_key_hash=? AND status='paid'", raw);
  must(row, 'نشست پنل منقضی شده؛ با کلید خود دوباره وارد شوید.', 401);
  const salon = await one(db, 'SELECT * FROM salons WHERE id=?', row.salon_id);
  must(salon, 'سالن پیدا نشد.', 404);
  return {order: row, salon};
}

/* What the salon panel shows on day one: everything the customer can act on, and nothing
   that pretends the salon has already done work it has not. */
export async function panelDashboard(db, env, {order, salon}) {
  const [, leads, portfolio, team] = await Promise.all([
    Promise.resolve(),
    all(db, 'SELECT id,status,created_at FROM leads WHERE salon_id=? ORDER BY created_at DESC LIMIT 5', salon.id),
    all(db, 'SELECT id,title,line,images FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 6', salon.id),
    all(db, 'SELECT id,name,specialty FROM team WHERE salon_id=? AND active=1', salon.id),
  ]);
  const origin = env.APP_ORIGIN || '';
  const p = (() => { try { return JSON.parse(salon.profile || '{}'); } catch { return {}; } })();
  const steps = [
    {key: 'page', label: 'لینک صفحهٔ اختصاصی را برای مشتری‌ها بفرستید', done: Object.keys(p).length > 0},
    {key: 'telegram', label: 'ربات تلگرام یا بله را وصل کنید', done: !!(salon.telegram_chat_id || salon.bale_chat_id)},
    {key: 'portfolio', label: 'اولین نمونه‌کار را از ربات بفرستید', done: portfolio.length > 0},
    {key: 'team', label: 'اگر تیم دارید، آرایشگرها را اضافه کنید', done: team.length > 0},
  ];
  return {
    salon: {name: salon.name, slug: salon.slug, url: origin + '/s/' + salon.slug},
    plan: PLANS[order.plan]?.name || order.plan,
    paid_at: order.confirmed_at, ref: order.ref,
    leads: leads.map(l => ({id: l.id, status: l.status, created_at: l.created_at})),
    portfolio: portfolio.map(x => ({id: x.id, title: x.title, line: x.line, image: (JSON.parse(x.images || '[]')[0]) || ''})),
    setup: {steps, done: steps.filter(s => s.done).length, total: steps.length},
    bot: {telegram: !!(env.TELEGRAM_BOT_TOKEN), bale: !!(env.BALE_BOT_TOKEN)},
  };
}
