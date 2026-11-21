// Automatic card-to-card confirmation from the bank's deposit SMS, without any third-party
// payment site. The owner's iPhone (a Shortcuts automation on the bank's SMS) or any SMS
// forwarder POSTs the SMS text to /api/pay/sms with the same token as /api/pay/confirm.
//
// A bank SMS carries no order code, only the amount, so every open order gets an amount no
// other recent unpaid order has (uniqueAmount: a few toman off the price, never more). The SMS
// amount then points at exactly one order, which goes through the same atomic confirmOrder as
// the webhook (with the amount as proof, so a late transfer to an expired order still opens).
//
// Rules this file keeps:
//  * Only a deposit SMS counts; a withdrawal or any other text is ignored.
//  * Each SMS is handled once (pay_sms, keyed by the hash of its text).
//  * No match, or more than one, opens nothing and alerts the owner. Alerts carry the amount
//    and order code only — never the SMS text, the balance or a customer mobile.
import {digits, hash} from './domain.js';

const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;

/* How far back an unpaid order still claims its amount: a late or replaced transfer must still
   point at one order. */
export const AMOUNT_HOLD_MS = 48 * 3600000;
/* The most an order's amount is lowered to make it unique (toman). */
export const MAX_OFFSET_TOMAN = 999;

/* An amount (rials) no unpaid order of the last AMOUNT_HOLD_MS uses. The price itself when it is
   free; otherwise a few toman less (the buyer pays slightly less, never more). */
export async function uniqueAmount(db, rial, notId = '') {
  const since = Date.now() - AMOUNT_HOLD_MS;
  const taken = new Set((await all(db,
    "SELECT amount FROM orders WHERE status<>'paid' AND created_at>? AND id<>? AND amount BETWEEN ? AND ?",
    since, notId, rial - MAX_OFFSET_TOMAN * 10, rial)).map(r => Number(r.amount)));
  if (!taken.has(rial)) return rial;
  const room = Math.min(MAX_OFFSET_TOMAN, Math.floor(rial / 10) - 1);
  for (let i = 0; i < 40; i++) {
    const r = rial - (1 + crypto.getRandomValues(new Uint32Array(1))[0] % room) * 10;
    if (!taken.has(r)) return r;
  }
  for (let k = 1; k <= room; k++) if (!taken.has(rial - k * 10)) return rial - k * 10;
  return rial;
}

/* The deposited amount in rials from a bank SMS, or null when it is not a deposit.
   Blu: «واریز پول\nامید عزیز،50,000,000 ریال به حساب شما نشست.\nموجودی: …». Other banks
   write «واریز» / «انتقال به» / «+» with «ریال» similarly; the balance line is never read. */
export function parseDeposit(raw) {
  const t = digits(String(raw || '')).replace(/٬/g, ',').replace(/‌/g, ' ');
  if (!/واریز|نشست|\+\s*[\d,]+/.test(t)) return null;
  if (/برداشت|خرید|کسر شد/.test(t) && !/واریز|نشست/.test(t)) return null;
  const body = t.split(/موجودی|مانده/)[0];
  const m = body.match(/\+?\s*(\d{1,3}(?:,\d{3})+|\d{4,})\s*ریال/) || body.match(/\+\s*(\d{1,3}(?:,\d{3})+|\d{4,})/);
  if (!m) return null;
  const n = Number(m[1].replace(/,/g, ''));
  return Number.isSafeInteger(n) && n > 0 ? n : null;
}

async function alert(env, text, detail) {
  try {
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {kind: 'order', level: 'warn', text, detail: detail + '\nدر /admin بررسی کنید.'});
  } catch {}
}

const fa = n => Number(n).toLocaleString('fa-IR');

/* The forwarded SMS, after the token was checked. */
export async function smsConfirm(db, env, rawText, origin = '') {
  const text = String(rawText || '').slice(0, 2000);
  const rial = parseDeposit(text);
  if (!rial) return {ignored: true, reason: 'not_deposit'};
  const id = await hash('pay-sms:' + digits(text).replace(/\s+/g, ' ').trim());
  const fresh = await run(db, 'INSERT OR IGNORE INTO pay_sms(id,amount,result,created_at) VALUES(?,?,?,?)', id, rial, 'error', Date.now());
  if (!fresh.meta.changes) return {duplicate: true};
  const done = (result, order = null) => run(db, 'UPDATE pay_sms SET result=?,order_id=? WHERE id=?', result, order, id);
  const toman = rial / 10;
  const hits = rial % 10 ? [] : await all(db,
    "SELECT id,ref,status FROM orders WHERE amount=? AND status<>'paid' AND created_at>? ORDER BY created_at DESC", rial, Date.now() - AMOUNT_HOLD_MS);
  if (!hits.length) {
    await done('none');
    await alert(env, 'واریز ' + fa(toman) + ' تومان رسید ولی سفارش بازی با این مبلغ نیست', '💰 ' + fa(toman) + ' تومان');
    return {matched: false, amount: toman};
  }
  if (hits.length > 1) {
    await done('many');
    await alert(env, 'واریز ' + fa(toman) + ' تومان با چند سفارش یکی است و خودکار تأیید نشد', '💳 ' + hits.map(h => h.ref).join('، '));
    return {matched: false, amount: toman, many: true};
  }
  const {confirmOrder} = await import('./orders.js');
  try {
    const r = await confirmOrder(db, env, hits[0].id, {by: 'sms', origin, amount: toman});
    await done('paid', hits[0].id);
    return {matched: true, ref: r.order.ref, status: r.order.status, page: r.order.page_url};
  } catch (e) {
    await done('closed', hits[0].id);
    return {matched: false, ref: hits[0].ref, error: e.message};
  }
}
