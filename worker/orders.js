// Paid plans: a plan card → bank transfer to the owner's card → a 10-minute window →
// automatic confirmation by the payment site's webhook (/api/pay/confirm) → the salon page,
// the salon panel and the plan's image credits open. A salon with a plan can also buy
// image top-ups (10 images per pack) from its panel through the same checkout.
//
// Rules this file keeps:
//  * Amounts come only from worker/prices.js, generated from the owner's price sheet in
//    design/landing/build.py. The server never takes an amount from the browser.
//  * The card number lives in app_settings ('pay_card'), set in /admin — never in the code.
//  * The customer never sends a receipt: the webhook alone confirms a payment. The owner's
//    «تأیید پرداخت» in /admin stays as an emergency path only; customers never see it.
//  * The 10-minute window only applies while an order is waiting for money (open). A payment
//    that lands after the window (expired order) is still confirmed by the webhook, but only
//    when the webhook reports the amount and it equals the order's amount (proof of payment).
//    Without that proof, or for a cancelled order, nothing opens and the owner is alerted.
//    Old orders still in 'reviewing' (from the retired receipt step) never expire.
//  * Confirmation is atomic: one UPDATE claims the order, and only the call that claimed it
//    provisions the salon and grants credits. Retries and double clicks are harmless.
//  * Money is TOMAN on the page; amounts are stored in RIALS (×10).
import {must, phone, text, uid, digits, hash} from './domain.js';
import {PLANS, PRICE_MINUTES, TOPUP} from './prices.js';
import {applyPlan, grant, balance, MONTH} from './credits.js';
import {featuresOf, OPENED_BY, can} from './plans.js';

const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;

export const PAY_CARD = 'pay_card';
export const WEBHOOK_KEY = 'pay_webhook_key';
export const COUPONS = 'pay_coupons';
export const SERVICES = ['hair', 'nails', 'lashes'];
export const SERVICE_LABEL = {hair: 'مدل و رنگ مو', nails: 'ناخن', lashes: 'مژه'};

/* One order lives this long while waiting for money. The page counts down; the server enforces. */
export const ORDER_MINUTES = PRICE_MINUTES;
const PANEL_DAYS = 30;

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
const ref = () => 'AY' + Array.from(crypto.getRandomValues(new Uint8Array(6)), x => ALPHABET[x % ALPHABET.length]).join('');

/* The key that opens the salon panel. Only its hash rests in the database. */
export const newAccessKey = () => 'AY-' + Array.from(crypto.getRandomValues(new Uint8Array(9)), x => ALPHABET[x % ALPHABET.length]).join('');
export const hashKey = async s => {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('ayneh-panel:' + s));
  return Array.from(new Uint8Array(d), x => x.toString(16).padStart(2, '0')).join('');
};

export const planAmount = key => Number(PLANS[key]?.amount || 0);
const planName = row => row.kind === 'topup' ? 'اعتبار ' + Number(row.credits || 0).toLocaleString('fa-IR') + ' عکس' : (PLANS[row.plan]?.name || row.plan);

/* Coupons: {CODE:{percent|amount, max, used}} in app_settings, editable without a deploy. */
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
  if (rule.percent != null && Number.isFinite(Number(rule.percent))) off = Math.round(amountToman * Math.max(0, Math.min(100, Number(rule.percent))) / 100);
  else if (rule.amount != null && Number.isFinite(Number(rule.amount))) off = Math.max(0, Number(rule.amount));
  off = Math.min(off, amountToman);
  return off > 0 ? {code, toman: off} : {code: '', toman: 0};
}

const toman = rial => Math.round(Number(rial || 0) / 10);

/* The checkout's first line: «پلن … · ۳ ماهه» (+ the user count for a multi-user plan). The
   plan table may carry a display title and a user count; without them the plan name stands. */
function orderSummary(row) {
  if (row.kind === 'topup') return {title: planName(row), months: 0, users: 0};
  const p = PLANS[row.plan] || {};
  return {title: String(p.title || p.name || row.plan), months: Number(p.months || 0), users: Number(row.users || p.users || 0)};
}

/* What the page needs to draw: the figures, never the internals. */
export async function publicOrder(db, env, row, {key = '', origin = ''} = {}) {
  const card = (await one(db, 'SELECT value FROM app_settings WHERE key=?', PAY_CARD))?.value || '';
  const salon = row.salon_id ? await one(db, 'SELECT slug FROM salons WHERE id=?', row.salon_id) : null;
  const base = env.APP_ORIGIN || origin;
  const paid = row.status === 'paid';
  return {
    id: row.id, ref: row.ref, plan: row.plan, kind: row.kind || 'plan', plan_name: planName(row),
    service: row.service || '', credits: Number(row.credits || 0), summary: orderSummary(row),
    amount: toman(row.amount), discount: toman(row.discount),
    status: row.status, created_at: row.created_at, expires_at: row.expires_at,
    card: cardDigits(card) || '', card_owner: card ? cardOwner(card) : '',
    access_key: key || '',
    /* A top-up or a renewal from the panel keeps the salon's existing panel key. */
    same_key: row.kind === 'topup' || row.note === 'renewal',
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

/* Webhook token: generated once, shown in /admin, compared in constant time. */
const newHookKey = () => 'whk_' + Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, '0')).join('');
export async function webhookKey(db) {
  const k = (await one(db, 'SELECT value FROM app_settings WHERE key=?', WEBHOOK_KEY))?.value || '';
  if (k) return k;
  /* Two first calls at once must not fail: the second keeps the first one's key. */
  await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO NOTHING', WEBHOOK_KEY, newHookKey(), Date.now());
  return (await one(db, 'SELECT value FROM app_settings WHERE key=?', WEBHOOK_KEY)).value;
}
export async function rotateWebhookKey(db) {
  const k = newHookKey();
  await run(db, 'INSERT INTO app_settings(key,value,updated_at) VALUES(?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at', WEBHOOK_KEY, k, Date.now());
  return k;
}

/* Only an order still waiting for money expires. A legacy 'reviewing' order is never closed by the clock. */
export async function closeExpired(db) {
  await run(db, "UPDATE orders SET status='expired',updated_at=? WHERE status='open' AND expires_at<=?", Date.now(), Date.now());
}

/* A plan order from a service page. A second order from the same mobile replaces the first:
   the earlier open order is cancelled, and nothing about it is returned to this caller. */
export async function createOrder(db, env, b, origin = '') {
  const plan = String(b.plan || '');
  must(PLANS[plan], 'این پلن وجود ندارد.', 404);
  const amount = planAmount(plan);
  must(amount > 0, 'مبلغ این پلن تعیین نشده است.', 409);
  const salon = text(String(b.salon || ''), 80), name = text(String(b.name || ''), 60);
  must(salon.length >= 2, 'نام سالن را بنویسید.');
  must(name.length >= 2, 'نام و نام خانوادگی را بنویسید.');
  must(b.consent === true, 'برای هماهنگی راه‌اندازی، تأیید تماس لازم است.');
  const service = SERVICES.includes(b.service) ? b.service : '';
  const tel = phone(b.phone), now = Date.now();
  await closeExpired(db);
  await run(db, "UPDATE orders SET status='cancelled',updated_at=? WHERE phone=? AND kind='plan' AND status='open'", now, tel);
  const coupon = discountFor(String(b.coupon || ''), amount, await couponTable(db));
  const key = newAccessKey();
  const row = {
    id: uid(), ref: ref(), plan, kind: 'plan', service, credits: Number(PLANS[plan].credits || 0),
    amount: (amount - coupon.toman) * 10, salon_name: salon, contact_name: name, phone: tel,
    city: text(String(b.city || ''), 40), note: text(String(b.note || ''), 300), status: 'open',
    expires_at: now + ORDER_MINUTES * 60000, access_key_hash: await hashKey(key),
    coupon: coupon.code, discount: coupon.toman * 10, created_at: now, updated_at: now,
  };
  await insert(db, row);
  await tell(env, 'سفارش ' + PLANS[plan].name + (service ? ' (' + SERVICE_LABEL[service] + ')' : '') + ' برای «' + salon + '» باز شد', row);
  return publicOrder(db, env, row, {key, origin});
}

/* A top-up from the salon's own panel: n packs of TOPUP.images images. The salon is known
   from the panel session, so no key is minted and the panel stays the same. */
export async function createTopup(db, env, {order: panelOrder, salon}, packs, origin = '') {
  const n = Number(packs);
  must(Number.isInteger(n) && n >= 1 && n <= 20, 'تعداد بستهٔ عکس معتبر نیست.');
  const now = Date.now();
  await closeExpired(db);
  await run(db, "UPDATE orders SET status='cancelled',updated_at=? WHERE salon_id=? AND kind='topup' AND status='open'", now, salon.id);
  const row = {
    id: uid(), ref: ref(), plan: 'topup', kind: 'topup', service: panelOrder.service || '', credits: n * TOPUP.images,
    amount: n * TOPUP.amount * 10, salon_name: salon.name, contact_name: panelOrder.contact_name, phone: panelOrder.phone,
    city: '', note: '', status: 'open', expires_at: now + ORDER_MINUTES * 60000,
    access_key_hash: panelOrder.access_key_hash, coupon: '', discount: 0, created_at: now, updated_at: now,
    salon_id: salon.id,
  };
  await insert(db, row);
  await tell(env, 'خرید ' + (n * TOPUP.images).toLocaleString('fa-IR') + ' عکس برای «' + salon.name + '» باز شد', row);
  return publicOrder(db, env, row, {origin});
}

/* A renewal or an upgrade from the salon's own panel: the salon, contact and mobile come from
   the panel session, the panel key stays the same (no new key is minted), and confirmation
   applies the new plan to this same salon (provisionSalon honours salon_id). */
export async function createRenewal(db, env, {order: panelOrder, salon}, plan, origin = '') {
  must(PLANS[plan], 'این پلن وجود ندارد.', 404);
  const amount = planAmount(plan);
  must(amount > 0, 'مبلغ این پلن تعیین نشده است.', 409);
  const now = Date.now();
  await closeExpired(db);
  await run(db, "UPDATE orders SET status='cancelled',updated_at=? WHERE salon_id=? AND kind='plan' AND status='open'", now, salon.id);
  const row = {
    id: uid(), ref: ref(), plan, kind: 'plan', service: panelOrder.service || '', credits: Number(PLANS[plan].credits || 0),
    amount: amount * 10, salon_name: salon.name, contact_name: panelOrder.contact_name, phone: panelOrder.phone,
    city: '', note: 'renewal', status: 'open', expires_at: now + ORDER_MINUTES * 60000,
    access_key_hash: panelOrder.access_key_hash, coupon: '', discount: 0, created_at: now, updated_at: now,
    salon_id: salon.id,
  };
  await insert(db, row);
  await tell(env, 'تمدید/ارتقا به ' + PLANS[plan].name + ' برای «' + salon.name + '» باز شد', row);
  return publicOrder(db, env, row, {origin});
}

async function insert(db, row) {
  await run(db,
    'INSERT INTO orders(id,ref,plan,kind,service,credits,amount,salon_name,contact_name,phone,city,note,status,expires_at,access_key_hash,coupon,discount,salon_id,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    row.id, row.ref, row.plan, row.kind, row.service, row.credits, row.amount, row.salon_name, row.contact_name, row.phone, row.city, row.note,
    row.status, row.expires_at, row.access_key_hash, row.coupon, row.discount, row.salon_id || null, row.created_at, row.updated_at);
}

/* The owner hears about new orders on the alert channel. The mobile is the buyer's (a salon
   owner, Ayneh's own customer), never a salon customer's. */
async function tell(env, line, row) {
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      kind: 'order', level: 'good', text: line,
      detail: '👤 ' + row.contact_name + '\n📞 ' + row.phone + '\n💳 ' + row.ref + ' · ' + Math.round(row.amount / 10).toLocaleString('fa-IR') + ' تومان\n⏳ ' + ORDER_MINUTES + ' دقیقه',
    });
  } catch {}
}

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
  must(row.status === 'open' && row.kind !== 'topup', 'این سفارش دیگر قابل تغییر نیست.', 409);
  const base = planAmount(row.plan);
  const coupon = discountFor(code, base, await couponTable(db));
  must(coupon.code, 'این کد تخفیف معتبر نیست یا ظرفیتش پر شده.', 422);
  await run(db, 'UPDATE orders SET coupon=?,discount=?,amount=?,updated_at=? WHERE id=? AND status=?',
    coupon.code, coupon.toman * 10, (base - coupon.toman) * 10, Date.now(), id, 'open');
  return publicOrder(db, env, await orderById(db, id), {origin});
}

/* The owner gives an expired order another 10 minutes (the customer paid late, or asked). */
export async function reopenOrder(db, id) {
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  must(row.status === 'expired', 'فقط سفارش منقضی‌شده دوباره باز می‌شود.', 409);
  await run(db, "UPDATE orders SET status='open',expires_at=?,updated_at=? WHERE id=? AND status='expired'", Date.now() + ORDER_MINUTES * 60000, Date.now(), id);
  return orderById(db, id);
}

/* Confirmation. One UPDATE claims the order; only the call that claimed it does the work, so
   the payment site retrying (or the owner's emergency click at the same time) can never make
   two salons or grant credits twice. A paid plan whose salon was not provisioned (a crash
   mid-way) is repaired.
   `amount` is what the payment site reports (toman). When given, it must equal the order's
   amount. A webhook for an expired order (paid after the 10 minutes) confirms only with that
   proof; the owner reopens an expired order instead of confirming it. */
export async function confirmOrder(db, env, id, {by = 'owner', origin = '', amount} = {}) {
  await closeExpired(db);
  let row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  const now = Date.now();
  const reported = amount === undefined || amount === null || amount === '' ? null : Number(amount);
  if (reported !== null && reported !== toman(row.amount)) {
    if (row.status !== 'paid') await missed(env, row, 'مبلغ گزارش‌شده ' + (Number.isFinite(reported) ? reported.toLocaleString('fa-IR') : '؟') + ' تومان است، نه ' + toman(row.amount).toLocaleString('fa-IR'));
    must(false, 'مبلغ گزارش‌شده با مبلغ سفارش یکی نیست', 409);
  }
  if (row.status !== 'paid') {
    const late = by === 'webhook' && reported !== null;
    const allowed = late ? ['open', 'reviewing', 'expired'] : ['open', 'reviewing'];
    if (!allowed.includes(row.status)) {
      if (by === 'webhook') await missed(env, row, row.status === 'expired' ? 'بعد از ۱۰ دقیقه رسید و مبلغ را گزارش نکرد' : 'این سفارش لغو شده بود');
      must(false, 'این سفارش بسته شده و قابل تأیید نیست.', 409);
    }
    const claim = await run(db, "UPDATE orders SET status='paid',confirmed_by=?,confirmed_at=?,updated_at=? WHERE id=? AND status IN (" + allowed.map(() => '?').join(',') + ')', by, now, now, id, ...allowed);
    /* A coupon is spent once the money is in. Legacy 'reviewing' orders spent it on the receipt. */
    if (claim.meta.changes && row.coupon && row.status !== 'reviewing') await bumpCoupon(db, row.coupon);
    row = await orderById(db, id);
    if (!claim.meta.changes) return {order: await publicOrder(db, env, row, {origin}), claimed: false};
  } else {
    /* Already paid. Only a plan whose grant never landed (a crash mid-way) is repaired; a
       renewal carries its salon_id from the start, so the ledger is what says it was applied. */
    const applied = await one(db, 'SELECT 1 FROM credit_ledger WHERE order_id=? LIMIT 1', id);
    if (applied || row.kind === 'topup' || (row.salon_id && row.note !== 'renewal'))
      return {order: await publicOrder(db, env, row, {origin}), claimed: false};
  }
  let salon;
  if (row.kind === 'topup') {
    salon = await one(db, 'SELECT id,name,slug FROM salons WHERE id=?', row.salon_id);
    must(salon, 'سالن این سفارش پیدا نشد.', 404);
    await grant(db, salon.id, Number(row.credits || 0), 'topup', row.id);
  } else {
    salon = await provisionSalon(db, row);
    await run(db, 'UPDATE orders SET salon_id=?,updated_at=? WHERE id=?', salon.id, Date.now(), id);
    const p = PLANS[row.plan] || {months: 1, credits: 0};
    await applyPlan(db, salon.id, {key: row.plan, months: p.months, credits: Number(row.credits || p.credits || 0)}, row.id);
  }
  const updated = await orderById(db, id);
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      kind: 'order', level: 'good',
      text: 'پرداخت ' + planName(row) + ' برای «' + salon.name + '» تأیید شد',
      detail: '🔗 صفحه: /s/' + salon.slug + '\n👤 ' + row.contact_name + '\n💳 ' + row.ref + '\n✅ تأیید با: ' + (by === 'webhook' ? 'سایت پرداخت' : 'پنل مدیر'),
    });
  } catch {}
  return {order: await publicOrder(db, env, updated, {origin}), claimed: true};
}

/* A payment the webhook reported but that opened nothing: the owner hears it at once, with the
   order code and the reason, so the customer who writes to support gets an answer. */
async function missed(env, row, reason) {
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      kind: 'order', level: 'warn',
      text: 'واریز سفارش ' + (row?.ref || 'ناشناس') + ' خودکار تأیید نشد',
      detail: '⚠️ ' + reason + (row ? '\n💳 ' + row.ref + ' · ' + toman(row.amount).toLocaleString('fa-IR') + ' تومان\n👤 ' + row.contact_name : '') + '\nدر /admin بررسی کنید.',
    });
  } catch {}
}

/* The payment site's call, after its token was checked: body {ref} or {order}, optional status
   and amount (toman). A non-success status is ignored; an unknown order is a 404 and an alert. */
export async function webhookConfirm(db, env, b, origin = '') {
  const code = String(b?.ref || '').toUpperCase().slice(0, 12);
  const byRef = code ? await one(db, 'SELECT id FROM orders WHERE ref=?', code) : null;
  const id = byRef?.id || String(b?.order || '');
  const row = /^[a-f0-9-]{36}$/.test(id) ? await one(db, 'SELECT id FROM orders WHERE id=?', id) : null;
  if (!row) {
    await missed(env, null, 'کد ' + (code || id.slice(0, 40) || '—') + ' به هیچ سفارشی نمی‌خورد');
    must(false, 'سفارش پیدا نشد', 404);
  }
  if (b.status && !['paid', 'success', 'confirmed', 'ok'].includes(String(b.status).toLowerCase())) return {ignored: true};
  return confirmOrder(db, env, row.id, {by: 'webhook', origin, amount: b.amount});
}

/* The salon a plan unlocks. A returning buyer (same mobile, an earlier paid plan) renews the
   same salon instead of getting a second one. The slug comes from the salon's name when it is
   written in Latin letters, otherwise from the order code — never from a person's name. */
async function provisionSalon(db, row) {
  if (row.salon_id) {
    const own = await one(db, 'SELECT id,name,slug FROM salons WHERE id=?', row.salon_id);
    if (own) return own;
  }
  const prior = await one(db, "SELECT s.id,s.name,s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.phone=? AND o.kind='plan' AND o.status='paid' AND o.id<>? ORDER BY o.confirmed_at DESC LIMIT 1", row.phone, row.id);
  if (prior) return prior;
  const latin = String(row.salon_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28);
  const base = latin.length >= 3 ? latin : 'salon-' + String(row.ref).slice(2).toLowerCase();
  let slug = base, n = 1;
  while (await one(db, 'SELECT 1 FROM salons WHERE slug=?', slug)) slug = base + '-' + ++n;
  const id = uid(), now = Date.now();
  /* The buyer's own name and mobile stay on the order (for the Ayneh team) and are never
     copied onto the public page: the salon writes the page's phone itself in «صفحهٔ من». */
  const profile = {...(row.city ? {address: row.city} : {})};
  const settings = {generation_enabled: true, reference_verified: true, service: row.service || ''};
  await run(db, 'INSERT INTO salons(id,slug,owner_id,name,profile,settings,created_at) VALUES(?,?,?,?,?,?,?)',
    id, slug, 'order:' + row.id, text(row.salon_name, 100), JSON.stringify(profile), JSON.stringify(settings), now);
  return {id, slug, name: row.salon_name};
}

/* ---------- panel sessions ---------- */
/* The key is traded once for a random session token; the cookie carries the token and only
   its hash rests in the database, so neither the key nor a database copy opens a panel. */
export async function panelLogin(db, key) {
  const k = String(key || '').trim().toUpperCase().replace(/\s+/g, '');
  must(/^AY-[2-9A-HJ-NP-Z]{9}$/.test(k), 'کلید ورود معتبر نیست.', 401);
  const row = await one(db, "SELECT * FROM orders WHERE access_key_hash=? AND kind='plan' AND status='paid' ORDER BY confirmed_at DESC LIMIT 1", await hashKey(k));
  must(row && row.salon_id, 'این کلید یا تأیید نشده یا عوض شده است.', 401);
  const salon = await one(db, 'SELECT * FROM salons WHERE id=?', row.salon_id);
  must(salon, 'سالن پیدا نشد.', 404);
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32)), x => x.toString(16).padStart(2, '0')).join('');
  const now = Date.now();
  await run(db, 'INSERT INTO panel_sessions(id,order_id,salon_id,expires_at,created_at) VALUES(?,?,?,?,?)', await hash('panel:' + token), row.id, salon.id, now + PANEL_DAYS * 86400000, now);
  return {order: row, salon, token, maxAge: PANEL_DAYS * 86400};
}

export async function panelSalon(req, db) {
  const raw = (req.headers.get('cookie') || '').match(/(?:^|; )ayneh_panel=([a-f0-9]{64})(?:;|$)/)?.[1];
  must(raw, 'برای دیدن پنل سالن وارد شوید.', 401);
  const s = await one(db, 'SELECT * FROM panel_sessions WHERE id=? AND expires_at>?', await hash('panel:' + raw), Date.now());
  must(s, 'نشست پنل منقضی شده؛ با کلید خود دوباره وارد شوید.', 401);
  const order = await one(db, "SELECT * FROM orders WHERE id=? AND status='paid'", s.order_id);
  const salon = await one(db, 'SELECT * FROM salons WHERE id=?', s.salon_id);
  must(order && salon, 'نشست پنل منقضی شده؛ با کلید خود دوباره وارد شوید.', 401);
  return {order, salon, session: s.id};
}

export async function panelLogout(req, db) {
  const raw = (req.headers.get('cookie') || '').match(/(?:^|; )ayneh_panel=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (raw) await run(db, 'DELETE FROM panel_sessions WHERE id=?', await hash('panel:' + raw));
}

/* A lost key: a new one for the order; every open panel session for it ends at once. */
export async function rekeyOrder(db, id) {
  const row = await one(db, "SELECT id FROM orders WHERE id=? AND kind='plan' AND status='paid'", id);
  must(row, 'این سفارش تأیید نشده است', 409);
  const fresh = newAccessKey();
  await run(db, 'UPDATE orders SET access_key_hash=?,updated_at=? WHERE id=?', await hashKey(fresh), Date.now(), row.id);
  await run(db, 'DELETE FROM panel_sessions WHERE order_id=?', row.id);
  return fresh;
}

/* «پنل شما باز شد»: the four things between a new panel and its first customer (owner's
   wording). Each one ticks itself when the server sees it done; the salon can also tick (or
   untick) any of them by hand, kept in salons.settings.checklist. The credit dates come from
   the plan, never from the browser. */
export const CHECKLIST = [
  {key: 'portfolio', label: 'نمونه‌های کارتان را اضافه کنید'},
  {key: 'bot', label: 'ربات تلگرام یا بله را وصل کنید'},
  {key: 'try', label: 'نمونه‌ای بسازید و نتیجه را ببینید'},
  {key: 'share', label: 'لینک خودتان را به مشتریان بدهید'},
];
function checklistOf(salon, seen, credit) {
  let ticks = {};
  try { ticks = JSON.parse(salon.settings || '{}').checklist || {}; } catch {}
  const auto = {portfolio: seen.portfolio, bot: seen.bot, try: seen.tried, share: seen.shared};
  const items = CHECKLIST.map(c => ({...c, done: !!ticks[c.key] || !!auto[c.key], auto: !!auto[c.key]}));
  const plan = PLANS[credit?.plan] || {};
  return {
    items, done: items.filter(i => i.done).length, total: items.length,
    started_at: credit?.start || null, until: credit?.until || null,
    /* A multi-user plan also invites colleagues (the plan table says how many users it has). */
    users: Number(plan.users || 0),
  };
}
export async function tickChecklist(db, {salon}, key, done) {
  must(CHECKLIST.some(c => c.key === key), 'این مورد در فهرست نیست.', 400);
  await run(db, "UPDATE salons SET settings=json_set(COALESCE(settings,'{}'),'$.checklist',json_patch(COALESCE(json_extract(settings,'$.checklist'),'{}'),?)) WHERE id=?",
    JSON.stringify({[key]: !!done}), salon.id);
  return {ok: true, key, done: !!done};
}

/* What the salon panel shows: the page, the plan and its credits, the setup steps, the last
   requests and the first portfolio items — nothing that pretends work was done that was not. */
export async function panelDashboard(db, env, {order, salon}) {
  const [leads, portfolio, team, credit, topups, tried] = await Promise.all([
    all(db, 'SELECT id,status,created_at FROM leads WHERE salon_id=? ORDER BY created_at DESC LIMIT 5', salon.id),
    all(db, 'SELECT id,title,line,images FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 60', salon.id),
    all(db, 'SELECT id,name,specialty FROM team WHERE salon_id=? AND active=1', salon.id),
    balance(db, salon),
    all(db, "SELECT id,ref,credits,amount,status,created_at FROM orders WHERE salon_id=? AND kind='topup' ORDER BY created_at DESC LIMIT 5", salon.id),
    one(db, "SELECT 1 n FROM generations WHERE salon_id=? AND state<>'fail' LIMIT 1", salon.id),
  ]);
  const origin = env.APP_ORIGIN || '';
  const p = (() => { try { return JSON.parse(salon.profile || '{}'); } catch { return {}; } })();
  /* The setup steps follow the plan: an ESSENTIAL salon is never asked for a bot it does not have. */
  const hasBot = can(salon, 'bot');
  const steps = [
    {key: 'profile', label: 'نشانی، ساعت کار و یک توضیح کوتاه برای صفحه بنویسید', done: !!(p.bio || p.hours)},
    {key: 'phone', label: 'شمارهٔ تماسی را که مشتری‌ها ببینند بنویسید', done: !!p.phone},
    {key: 'portfolio', label: 'اولین نمونه‌کارتان را اضافه کنید', done: portfolio.length > 0},
    {key: 'share', label: 'لینک صفحه را در بیو اینستاگرام بگذارید تا اولین درخواست برسد', done: leads.length > 0},
    ...(hasBot ? [
      {key: 'telegram', label: 'ربات تلگرام یا بله را وصل کنید', done: !!(salon.telegram_chat_id || salon.bale_chat_id)},
      {key: 'team', label: 'اگر همکار دارید، از ربات اضافه‌شان کنید (اختیاری)', done: team.length > 0},
    ] : []),
  ];
  return {
    salon: {name: salon.name, slug: salon.slug, url: origin + '/s/' + salon.slug},
    plan: credit ? (PLANS[credit.plan]?.name || credit.plan) : (PLANS[order.plan]?.name || order.plan),
    paid_at: order.confirmed_at, ref: order.ref,
    credits: credit, topup: {images: TOPUP.images, amount: TOPUP.amount},
    /* What this plan opens; a locked card names the plan that opens it and links to the plans. */
    features: featuresOf(salon), opened_by: OPENED_BY, service: (() => { try { return JSON.parse(salon.settings || '{}').service || order.service || 'hair'; } catch { return 'hair'; } })(),
    bot_linked: !!(salon.telegram_chat_id || salon.bale_chat_id),
    topups: topups.map(t => ({ref: t.ref, credits: t.credits, amount: toman(t.amount), status: t.status, created_at: t.created_at})),
    leads: leads.map(l => ({id: l.id, status: l.status, created_at: l.created_at})),
    portfolio: portfolio.map(x => ({id: x.id, title: x.title, line: x.line, image: (JSON.parse(x.images || '[]')[0]) || ''})),
    profile: {bio: p.bio || '', address: p.address || '', hours: p.hours || '', phone: p.phone || '', instagram: String(p.instagram || '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')},
    /* Plans the salon can renew to or upgrade to, straight from the panel. */
    plans: Object.entries(PLANS).map(([key, v]) => ({key, name: v.name, months: v.months, amount: planAmount(key), credits: v.credits})),
    setup: {steps, done: steps.filter(s => s.done).length, total: steps.length},
    checklist: checklistOf(salon, {portfolio: portfolio.length > 0, bot: !!(salon.telegram_chat_id || salon.bale_chat_id), tried: !!tried, shared: leads.length > 0}, credit),
    bot: {telegram: !!(env.TELEGRAM_BOT_TOKEN), bale: !!(env.BALE_BOT_TOKEN)},
  };
}

export {MONTH};
