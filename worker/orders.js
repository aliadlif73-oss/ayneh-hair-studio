// Paid plans: a plan card → bank transfer to the owner's card → a 10-minute window →
// confirmation (by the owner in /admin, or by the payment site's webhook) → the salon page,
// the salon panel and the plan's image credits open. A salon with a plan can also buy
// image top-ups (10 images per pack) from its panel through the same checkout.
//
// Rules this file keeps:
//  * Amounts come only from worker/prices.js, generated from the owner's price sheet in
//    design/landing/build.py. The server never takes an amount from the browser.
//  * The card number lives in app_settings ('pay_card'), set in /admin — never in the code.
//  * The 10-minute window only applies while an order is waiting for money (open). Once the
//    customer has sent a receipt (reviewing), the order waits for confirmation however long
//    that takes; an expired order can be reopened by the owner.
//  * Confirmation is atomic: one UPDATE claims the order, and only the call that claimed it
//    provisions the salon and grants credits. Retries and double clicks are harmless.
//  * Money is TOMAN on the page; amounts are stored in RIALS (×10).
import {must, phone, text, uid, digits, hash} from './domain.js';
import {PLANS, PRICE_MINUTES, TOPUP} from './prices.js';
import {applyPlan, grant, balance, MONTH} from './credits.js';

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

/* What the page needs to draw: the figures, never the internals. */
export async function publicOrder(db, env, row, {key = '', origin = ''} = {}) {
  const card = (await one(db, 'SELECT value FROM app_settings WHERE key=?', PAY_CARD))?.value || '';
  const salon = row.salon_id ? await one(db, 'SELECT slug FROM salons WHERE id=?', row.salon_id) : null;
  const base = env.APP_ORIGIN || origin;
  const paid = row.status === 'paid';
  return {
    id: row.id, ref: row.ref, plan: row.plan, kind: row.kind || 'plan', plan_name: planName(row),
    service: row.service || '', credits: Number(row.credits || 0),
    amount: toman(row.amount), discount: toman(row.discount),
    status: row.status, created_at: row.created_at, expires_at: row.expires_at,
    card: cardDigits(card) || '', card_owner: card ? cardOwner(card) : '',
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

/* Only an order still waiting for money expires. A sent receipt is never closed by the clock. */
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

export async function markReviewing(db, env, id, note, origin = '') {
  await closeExpired(db);
  const row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  must(row.status === 'open' || row.status === 'reviewing', 'مهلت این سفارش تمام شده؛ سفارش تازه بسازید.', 410);
  const changed = await run(db, "UPDATE orders SET status='reviewing',receipt_note=?,updated_at=? WHERE id=? AND status='open' AND expires_at>?",
    text(String(note || ''), 120), Date.now(), id, Date.now());
  if (changed.meta.changes && row.coupon) await bumpCoupon(db, row.coupon);
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
   the owner clicking twice and the payment site retrying can never make two salons or grant
   credits twice. A paid plan whose salon was not provisioned (a crash mid-way) is repaired. */
export async function confirmOrder(db, env, id, {by = 'owner', origin = ''} = {}) {
  await closeExpired(db);
  let row = await orderById(db, id);
  must(row, 'سفارش پیدا نشد.', 404);
  const now = Date.now();
  if (row.status !== 'paid') {
    must(row.status === 'open' || row.status === 'reviewing', 'این سفارش بسته شده و قابل تأیید نیست.', 409);
    const claim = await run(db, "UPDATE orders SET status='paid',confirmed_by=?,confirmed_at=?,updated_at=? WHERE id=? AND status IN ('open','reviewing')", by, now, now, id);
    row = await orderById(db, id);
    if (!claim.meta.changes) return {order: await publicOrder(db, env, row, {origin}), claimed: false};
  } else if (row.salon_id || row.kind === 'topup') {
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

/* The salon a plan unlocks. A returning buyer (same mobile, an earlier paid plan) renews the
   same salon instead of getting a second one. The slug comes from the salon's name when it is
   written in Latin letters, otherwise from the order code — never from a person's name. */
async function provisionSalon(db, row) {
  const prior = await one(db, "SELECT s.id,s.name,s.slug FROM orders o JOIN salons s ON s.id=o.salon_id WHERE o.phone=? AND o.kind='plan' AND o.status='paid' AND o.id<>? ORDER BY o.confirmed_at DESC LIMIT 1", row.phone, row.id);
  if (prior) return prior;
  const latin = String(row.salon_name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 28);
  const base = latin.length >= 3 ? latin : 'salon-' + String(row.ref).slice(2).toLowerCase();
  let slug = base, n = 1;
  while (await one(db, 'SELECT 1 FROM salons WHERE slug=?', slug)) slug = base + '-' + ++n;
  const id = uid(), now = Date.now();
  const profile = {manager: row.contact_name, phone: String(row.phone).replace(/^\+98/, '0'), ...(row.city ? {address: row.city} : {})};
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

/* What the salon panel shows: the page, the plan and its credits, the setup steps, the last
   requests and the first portfolio items — nothing that pretends work was done that was not. */
export async function panelDashboard(db, env, {order, salon}) {
  const [leads, portfolio, team, credit, topups] = await Promise.all([
    all(db, 'SELECT id,status,created_at FROM leads WHERE salon_id=? ORDER BY created_at DESC LIMIT 5', salon.id),
    all(db, 'SELECT id,title,line,images FROM portfolio WHERE salon_id=? AND published=1 ORDER BY created_at DESC LIMIT 6', salon.id),
    all(db, 'SELECT id,name,specialty FROM team WHERE salon_id=? AND active=1', salon.id),
    balance(db, salon),
    all(db, "SELECT id,ref,credits,amount,status,created_at FROM orders WHERE salon_id=? AND kind='topup' ORDER BY created_at DESC LIMIT 5", salon.id),
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
    plan: credit ? (PLANS[credit.plan]?.name || credit.plan) : (PLANS[order.plan]?.name || order.plan),
    paid_at: order.confirmed_at, ref: order.ref,
    credits: credit, topup: {images: TOPUP.images, amount: TOPUP.amount},
    topups: topups.map(t => ({ref: t.ref, credits: t.credits, amount: toman(t.amount), status: t.status, created_at: t.created_at})),
    leads: leads.map(l => ({id: l.id, status: l.status, created_at: l.created_at})),
    portfolio: portfolio.map(x => ({id: x.id, title: x.title, line: x.line, image: (JSON.parse(x.images || '[]')[0]) || ''})),
    setup: {steps, done: steps.filter(s => s.done).length, total: steps.length},
    bot: {telegram: !!(env.TELEGRAM_BOT_TOKEN), bale: !!(env.BALE_BOT_TOKEN)},
  };
}

export {MONTH};
