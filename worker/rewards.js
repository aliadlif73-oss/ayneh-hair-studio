// Referral rewards: when a salon buys a plan through someone's link, both sides get
// REFERRAL_IMAGES images. A salon referrer gets them in credit_ledger (its plan credit); a
// regular customer referrer gets them in her own customer_ledger.
//
// Rules this file keeps:
//  * The link is a public page with ?ref=CODE. The Worker keeps the code in a first-party
//    cookie (ayneh_ref, 30 days, the first link wins) and /api/order records it next to the
//    order (order_referrals). The browser never decides a reward.
//  * Rewards happen only inside confirmOrder, after the paying order is confirmed (by the owner
//    or the payment webhook), and only for a plan bought from a service page (kind 'plan').
//  * Idempotent per order: referral_rewards.order_id is the primary key and the grants are
//    written in the same batch, guarded by that row. A salon is gifted for being referred once.
//  * No self-referral: the referrer's own salon, or a referrer whose mobile is the buyer's.
//  * Cap: REFERRAL_CAP rewarded referrals per referrer (app_settings 'referral_cap' overrides it
//    without a deploy). Past the cap the buyer still gets the images the link promised; the
//    referrer gets nothing more. The owner has not decided the cap yet: 5 is a placeholder.
import {uid} from './domain.js';
import {REFERRAL_IMAGES} from './customerprices.js';

export const REFERRAL_CAP = 5;
export const REF_COOKIE = 'ayneh_ref';
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
export const CODE_RE = /^R[2-9A-HJ-NP-Z]{7}$/;
const newCode = () => 'R' + Array.from(crypto.getRandomValues(new Uint8Array(7)), x => ALPHABET[x % ALPHABET.length]).join('');
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();

export async function referralCap(db) {
  try {
    const v = Number((await one(db, 'SELECT value FROM app_settings WHERE key=?', 'referral_cap'))?.value);
    if (Number.isInteger(v) && v >= 0 && v <= 1000) return v;
  } catch {}
  return REFERRAL_CAP;
}

/* One code per salon or customer account, made on first ask. */
export async function codeFor(db, kind, ownerId) {
  const got = await one(db, 'SELECT code FROM referral_codes WHERE kind=? AND owner_id=?', kind, ownerId);
  if (got) return got.code;
  for (let i = 0; i < 5; i++) {
    try { await run(db, 'INSERT INTO referral_codes(code,kind,owner_id,created_at) VALUES(?,?,?,?)', newCode(), kind, ownerId, Date.now()); } catch {}
    const row = await one(db, 'SELECT code FROM referral_codes WHERE kind=? AND owner_id=?', kind, ownerId);
    if (row) return row.code;
  }
  throw new Error('referral code');
}

export async function referralStats(db, kind, ownerId) {
  const r = await one(db, "SELECT COUNT(*) n FROM referral_rewards WHERE referrer_kind=? AND referrer_id=? AND outcome='rewarded'", kind, ownerId);
  return {rewarded: Number(r?.n || 0), cap: await referralCap(db), images: REFERRAL_IMAGES};
}

/* ?ref=CODE on a public page → the cookie; an earlier valid code is kept (first link wins). */
export function refCookie(u, request) {
  const code = String(u.searchParams.get('ref') || '').trim().toUpperCase();
  if (!CODE_RE.test(code)) return {};
  const had = (request.headers.get('cookie') || '').match(/(?:^|; )ayneh_ref=([A-Z0-9]{8})(?:;|$)/)?.[1];
  if (had && CODE_RE.test(had)) return {};
  return {'Set-Cookie': REF_COOKIE + '=' + code + '; HttpOnly' + (u.protocol === 'https:' ? '; Secure' : '') + '; SameSite=Lax; Path=/; Max-Age=2592000'};
}
export function refOf(req, body) {
  const c = (req.headers.get('cookie') || '').match(/(?:^|; )ayneh_ref=([A-Z0-9]{8})(?:;|$)/)?.[1] || '';
  const b = String(body?.ref || '').trim().toUpperCase();
  return CODE_RE.test(c) ? c : CODE_RE.test(b) ? b : '';
}

/* Called by /api/order right after a plan order opens. Unknown codes are ignored. */
export async function attachReferral(db, orderId, code) {
  if (!orderId || !CODE_RE.test(String(code || ''))) return false;
  if (!await one(db, 'SELECT 1 FROM referral_codes WHERE code=?', code)) return false;
  await run(db, 'INSERT OR IGNORE INTO order_referrals(order_id,code,created_at) VALUES(?,?,?)', orderId, code, Date.now());
  return true;
}

/* Called by confirmOrder after the plan is applied to `salon`. Returns the outcome or null. */
export async function rewardReferral(db, env, row, salon) {
  if (!row || row.kind !== 'plan' || !salon?.id) return null;
  const link = await one(db, 'SELECT code FROM order_referrals WHERE order_id=?', row.id);
  if (!link) return null;
  const done = await one(db, 'SELECT outcome FROM referral_rewards WHERE order_id=?', row.id);
  if (done) return done.outcome;
  const ref = await one(db, 'SELECT * FROM referral_codes WHERE code=?', link.code);
  if (!ref) return null;
  const now = Date.now();
  let outcome = '';
  if (ref.kind === 'salon') {
    if (ref.owner_id === salon.id || await one(db, "SELECT 1 FROM orders WHERE salon_id=? AND kind='plan' AND status='paid' AND phone=?", ref.owner_id, row.phone)) outcome = 'self';
  } else {
    const acc = await one(db, 'SELECT phone FROM customer_accounts WHERE id=?', ref.owner_id);
    if (!acc) return null;
    if (acc.phone && acc.phone === row.phone) outcome = 'self';
  }
  /* A salon that had already paid before this order was not brought in by this link. */
  if (!outcome && await one(db, "SELECT 1 FROM orders WHERE salon_id=? AND kind='plan' AND status='paid' AND id<>? AND confirmed_at<=?", salon.id, row.id, Number(row.confirmed_at || now))) outcome = 'existing';
  if (!outcome && await one(db, "SELECT 1 FROM referral_rewards WHERE buyer_salon_id=? AND outcome IN ('rewarded','buyer_only')", salon.id)) outcome = 'repeat';
  const record = 'INSERT INTO referral_rewards(order_id,code,referrer_kind,referrer_id,buyer_salon_id,outcome,created_at) ';
  if (outcome) {
    await run(db, 'INSERT OR IGNORE INTO referral_rewards(order_id,code,referrer_kind,referrer_id,buyer_salon_id,outcome,created_at) VALUES(?,?,?,?,?,?,?)', row.id, ref.code, ref.kind, ref.owner_id, salon.id, outcome, now);
    return outcome;
  }
  const cap = await referralCap(db);
  const guard = "WHERE EXISTS(SELECT 1 FROM referral_rewards WHERE order_id=? AND outcome='rewarded')";
  try {
    await db.batch([
      db.prepare(record + "SELECT ?,?,?,?,?,CASE WHEN (SELECT COUNT(*) FROM referral_rewards WHERE referrer_kind=? AND referrer_id=? AND outcome='rewarded')<? THEN 'rewarded' ELSE 'buyer_only' END,?")
        .bind(row.id, ref.code, ref.kind, ref.owner_id, salon.id, ref.kind, ref.owner_id, cap, now),
      db.prepare("INSERT INTO credit_ledger(id,salon_id,delta,reason,order_id,created_at) SELECT ?,?,?,'referral-gift',?,? WHERE EXISTS(SELECT 1 FROM referral_rewards WHERE order_id=?)")
        .bind(uid(), salon.id, REFERRAL_IMAGES, row.id, now, row.id),
      ref.kind === 'salon'
        ? db.prepare("INSERT INTO credit_ledger(id,salon_id,delta,reason,order_id,created_at) SELECT ?,?,?,'referral',?,? " + guard).bind(uid(), ref.owner_id, REFERRAL_IMAGES, row.id, now, row.id)
        : db.prepare("INSERT INTO customer_ledger(id,account_id,delta,reason,order_id,created_at) SELECT ?,?,?,'referral',?,? " + guard).bind(uid(), ref.owner_id, REFERRAL_IMAGES, row.id, now, row.id),
    ]);
  } catch (e) {
    /* Another confirmation of the same order (or of the same buyer salon) won the race. */
    if (!/UNIQUE|constraint/i.test(String(e?.message))) throw e;
    return (await one(db, 'SELECT outcome FROM referral_rewards WHERE order_id=?', row.id))?.outcome || 'repeat';
  }
  outcome = (await one(db, 'SELECT outcome FROM referral_rewards WHERE order_id=?', row.id))?.outcome || '';
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {kind: 'order', level: 'good',
      text: 'معرفی: «' + salon.name + '» با لینک ' + (ref.kind === 'salon' ? 'یک سالن' : 'یک مشتری') + ' پلن خرید',
      detail: outcome === 'rewarded' ? 'هر دو طرف ' + REFERRAL_IMAGES.toLocaleString('fa-IR') + ' تصویر هدیه گرفتند.' : 'معرف به سقف ' + cap.toLocaleString('fa-IR') + ' معرفی رسیده؛ فقط خریدار هدیه گرفت.'});
  } catch {}
  return outcome;
}
