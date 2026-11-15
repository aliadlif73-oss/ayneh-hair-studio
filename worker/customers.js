// Regular customers («مشتری عادی»): her own light account, the images she buys, and who pays
// for an image once her free ones are used.
//
// Rules this file keeps:
//  * The account is bound to her verified mobile when SMS is on; without SMS (local/dev) it is
//    bound to the anonymous browser id. With SMS on, nobody gets an account without the code.
//  * Bought images live in customer_ledger. Spending is the count of her non-failed images with
//    generations.paid_by = her account, so a failed image never costs her anything.
//  * A customer-paid image is never taken from a salon's plan credit (credits.js skips paid_by).
//  * On a salon page the per-person quota (server.js QUOTA_PER_LINE, 3 per service) is spent
//    first and is never raised; her own images are used only after it. On /try (the direct
//    page, no salon) she has CUSTOMER_FREE_IMAGES in all, then her own images.
//  * The check happens before the image is ordered (like salon credits): two images started
//    at the same instant can overshoot by one; the salon daily cap bounds bursts.
import {Problem, must, uid, hash} from './domain.js';
import {smsReady} from './sms.js';
import {CUSTOMER_FREE_IMAGES} from './customerprices.js';

const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const visitorOk = v => /^[a-f0-9]{16,32}$/.test(String(v || '')) ? String(v) : '';

/* The direct page (/try) generates under one system salon, made on first visit. It is found by
   its fixed id, never by slug, so a paid salon that happens to be called "try" is never used. */
export const DIRECT_ID = 'ayneh-direct', DIRECT_OWNER = 'direct';
export const isDirect = salon => !!salon && salon.owner_id === DIRECT_OWNER && salon.id === DIRECT_ID;
export async function directSalon(db) {
  let s = await one(db, 'SELECT * FROM salons WHERE id=?', DIRECT_ID);
  if (s) return s;
  const settings = JSON.stringify({generation_enabled: true, reference_verified: false, direct: true});
  for (const slug of ['try', 'try-ayneh', 'try-' + uid().slice(0, 8)]) {
    if (await one(db, 'SELECT 1 FROM salons WHERE slug=?', slug)) continue;
    try {
      await run(db, 'INSERT OR IGNORE INTO salons(id,slug,owner_id,name,profile,settings,created_at) VALUES(?,?,?,?,?,?,?)',
        DIRECT_ID, slug, DIRECT_OWNER, 'آینه', '{}', settings, Date.now());
    } catch {}
    s = await one(db, 'SELECT * FROM salons WHERE id=?', DIRECT_ID);
    if (s) return s;
  }
  throw new Problem(503, 'صفحه آماده نشد؛ دوباره امتحان کنید.');
}

/* The session behind the page's cookie, whatever salon page made it (one cookie per browser). */
export async function anySession(req, db) {
  const t = (req.headers.get('cookie') || '').match(/(?:^|; )ayneh=([a-f0-9]{64})(?:;|$)/)?.[1];
  if (!t) return null;
  return one(db, 'SELECT * FROM sessions WHERE token_hash=? AND expires_at>?', await hash(t), Date.now());
}

/* Her account: by verified mobile first; without SMS, by browser id. create:false only looks. */
export async function accountFor(db, env, s, visitor, {create = false} = {}) {
  const v = visitorOk(visitor), now = Date.now();
  if (s?.verified_phone) {
    const byPhone = () => one(db, 'SELECT * FROM customer_accounts WHERE phone=?', s.verified_phone);
    let a = await byPhone();
    if (a) return a;
    /* Images bought in this browser before she confirmed her mobile move with her mobile. */
    if (v) {
      const loose = await one(db, 'SELECT id FROM customer_accounts WHERE visitor=? AND phone IS NULL ORDER BY created_at LIMIT 1', v);
      if (loose) { try { await run(db, 'UPDATE customer_accounts SET phone=? WHERE id=? AND phone IS NULL', s.verified_phone, loose.id); } catch {} a = await byPhone(); if (a) return a; }
    }
    if (!create) return null;
    await run(db, 'INSERT OR IGNORE INTO customer_accounts(id,phone,visitor,created_at) VALUES(?,?,?,?)', uid(), s.verified_phone, v, now);
    return byPhone();
  }
  if (smsReady(env) || !v) return null;
  const a = await one(db, 'SELECT * FROM customer_accounts WHERE visitor=? AND phone IS NULL ORDER BY created_at LIMIT 1', v);
  if (a || !create) return a;
  const id = uid();
  await run(db, 'INSERT INTO customer_accounts(id,phone,visitor,created_at) VALUES(?,?,?,?)', id, null, v, now);
  return one(db, 'SELECT * FROM customer_accounts WHERE id=?', id);
}

export async function customerBalance(db, accountId) {
  if (!accountId) return {granted: 0, used: 0, left: 0};
  const granted = Number((await one(db, 'SELECT COALESCE(SUM(delta),0) n FROM customer_ledger WHERE account_id=?', accountId))?.n || 0);
  const used = Number((await one(db, "SELECT COUNT(*) n FROM generations WHERE paid_by=? AND state<>'fail'", accountId))?.n || 0);
  return {granted, used, left: Math.max(0, granted - used)};
}

/* Free images used on the direct page by this person (session, browser id, verified mobile). */
export async function directUsed(db, s, visitor) {
  const v = visitorOk(visitor), p = s?.verified_phone || null;
  const r = await one(db, "SELECT COUNT(*) n FROM generations WHERE salon_id=? AND state<>'fail' AND paid_by IS NULL AND (session_id=? OR (?<>'' AND visitor=?) OR (? IS NOT NULL AND session_id IN (SELECT id FROM sessions WHERE salon_id=? AND verified_phone=?)))",
    DIRECT_ID, s?.id || '', v, v, p, DIRECT_ID, p);
  return Number(r?.n || 0);
}

export const DIRECT_OUT = '۳ نمونهٔ رایگانتان تمام شد. نمونهٔ بیشتر می‌خواهید؟ یک بسته انتخاب کنید.';

/* Who pays for the next image. Returns null when it is free (her quota, or the salon's credit
   decides after this), or her account id when it comes from the images she bought. Throws the
   usual quota message when neither is left, so the page offers the packs. */
export async function payForImage(db, env, {salon, s, visitor, quota}) {
  let out;
  if (isDirect(salon)) {
    if (await directUsed(db, s, visitor) < CUSTOMER_FREE_IMAGES) return null;
    out = new Problem(429, DIRECT_OUT);
  } else {
    try { await quota(); return null; } catch (e) { if (!(e instanceof Problem) || e.status !== 429) throw e; out = e; }
  }
  const acc = await accountFor(db, env, s, visitor);
  if (acc && (await customerBalance(db, acc.id)).left > 0) return acc.id;
  throw out;
}

/* Her own account when it still has images, else null: used when the salon's daily cap stops a
   free image, so a customer who bought a pack is never blocked by other visitors' free images. */
export async function ownImage(db, env, s, visitor) {
  const acc = await accountFor(db, env, s, visitor);
  return acc && (await customerBalance(db, acc.id)).left > 0 ? acc.id : null;
}

/* What the page shows as "left": the free images plus her own. */
export async function quotaView(db, env, salon, s, visitor, quota) {
  const acc = await accountFor(db, env, s, visitor);
  const own = (await customerBalance(db, acc?.id)).left;
  if (isDirect(salon)) {
    const free = Math.max(0, CUSTOMER_FREE_IMAGES - await directUsed(db, s, visitor));
    return {per: CUSTOMER_FREE_IMAGES, free, own, left: Object.fromEntries(Object.keys(quota.left).map(k => [k, free + own]))};
  }
  return {...quota, own, left: Object.fromEntries(Object.entries(quota.left).map(([k, n]) => [k, n + own]))};
}

/* Confirmation of a 'customer_pack' order: her images, once. Called by orders.js confirmOrder;
   UNIQUE(account_id, reason, order_id) makes a retried webhook or a double click harmless. */
export async function confirmCustomerPack(db, env, row) {
  must(row.customer_id, 'حساب این سفارش پیدا نشد.', 409);
  const r = await run(db, 'INSERT OR IGNORE INTO customer_ledger(id,account_id,delta,reason,order_id,created_at) VALUES(?,?,?,?,?,?)',
    uid(), row.customer_id, Math.trunc(Number(row.credits || 0)), 'pack', row.id, Date.now());
  const claimed = r.meta.changes > 0;
  if (claimed) {
    /* The owner hears about it without the customer's mobile (she is not Ayneh's salon buyer). */
    try {
      const {notifyOwner} = await import('./alerts.js');
      await notifyOwner(env, {kind: 'order', level: 'good', text: 'پرداخت بستهٔ ' + Number(row.credits).toLocaleString('fa-IR') + ' تصویر مشتری تأیید شد',
        detail: '💳 ' + row.ref + ' · ' + Math.round(row.amount / 10).toLocaleString('fa-IR') + ' تومان'});
    } catch {}
  }
  return claimed;
}
