// Image credits for salons that bought a plan (ESSENTIAL / PRO / SIGNATURE).
//
// Rules this file keeps:
//  * Only salons with settings.plan are metered. Owner-made, demo and trial salons are not.
//  * Credits come in through credit_ledger (+20/75/180 for a plan, +10×n for a top-up).
//  * Spending is the count of the salon's generations that did not fail, since the first plan
//    started. A failed image never costs a credit (the same rule as the per-person quota).
//  * A plan runs for its months from confirmation; renewing extends from the later of now and
//    the current end. After the end, the salon page stays up but makes no new images.
//  * The check happens before the image is ordered from the provider. Two images started at
//    the same instant can overshoot the balance by one each; the daily limit caps bursts.
import {Problem, uid, limited} from './domain.js';

const DAY = 86400000;
export const MONTH = 30 * DAY;

const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const settingsOf = salon => { try { return JSON.parse(salon?.settings || '{}') || {}; } catch { return {}; } };

export const planOf = salon => {
  const p = settingsOf(salon).plan;
  return p && typeof p === 'object' && p.start ? p : null;
};

export async function grant(db, salonId, delta, reason, orderId = null) {
  await run(db, 'INSERT INTO credit_ledger(id,salon_id,delta,reason,order_id,created_at) VALUES(?,?,?,?,?,?)',
    uid(), salonId, Math.trunc(delta), String(reason), orderId, Date.now());
}

/* A confirmed plan: start (or extend) the plan and add its gift images. */
export async function applyPlan(db, salonId, {key, months, credits}, orderId) {
  const salon = await one(db, 'SELECT id,settings FROM salons WHERE id=?', salonId);
  if (!salon) throw new Problem(404, 'سالن پیدا نشد.');
  const settings = settingsOf(salon), now = Date.now();
  const prev = settings.plan && typeof settings.plan === 'object' ? settings.plan : null;
  const from = Math.max(now, Number(prev?.until) || 0);
  settings.plan = {key, start: Number(prev?.start) || now, until: from + months * MONTH};
  await run(db, 'UPDATE salons SET settings=? WHERE id=?', JSON.stringify(settings), salonId);
  if (credits > 0) await grant(db, salonId, credits, 'plan:' + key, orderId);
  return settings.plan;
}

/* What the salon has: null for a salon without a plan (not metered). */
export async function balance(db, salon) {
  const plan = planOf(salon);
  if (!plan) return null;
  const granted = Number((await one(db, 'SELECT COALESCE(SUM(delta),0) n FROM credit_ledger WHERE salon_id=?', salon.id))?.n || 0);
  /* An image a customer paid for herself (generations.paid_by, worker/customers.js) is not the salon's. */
  const used = Number((await one(db, "SELECT COUNT(*) n FROM generations WHERE salon_id=? AND state<>'fail' AND paid_by IS NULL AND created_at>=?", salon.id, plan.start))?.n || 0);
  const now = Date.now();
  return {
    plan: plan.key, start: plan.start, until: plan.until,
    days_left: Math.max(0, Math.ceil((plan.until - now) / DAY)),
    expired: now >= plan.until,
    granted, used, left: Math.max(0, granted - used),
  };
}

/* Called right before an image is ordered. Throws a plain Persian message for the customer;
   the owner hears about it (once a day per salon), never with the customer's mobile or photo. */
export async function spendCredit(db, env, salon) {
  const b = await balance(db, salon);
  if (!b) return null;
  const reason = b.expired ? 'expired' : b.left <= 0 ? 'empty' : '';
  if (!reason) return b;
  /* One alert per salon per day: the limiter throws on the second call, which only skips it. */
  try {
    await limited(db, 'credit-alert:' + salon.id, 1);
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {
      salon, kind: 'credits', level: 'warn',
      text: reason === 'expired' ? 'پلن «' + salon.name + '» تمام شده و ساخت تصویر متوقف شد' : 'اعتبار تصویر «' + salon.name + '» تمام شد',
      detail: 'از /panel می‌تواند اعتبار تازه بخرد یا پلن را تمدید کند.',
    });
  } catch {}
  throw new Problem(402, reason === 'expired'
    ? 'ساخت تصویر در این سالن فعلاً متوقف است. انتخابت را بدون شبیه‌سازی برای سالن بفرست؛ خودشان با تو تماس می‌گیرند.'
    : 'ساخت تصویر در این سالن فعلاً متوقف است. انتخابت را بدون شبیه‌سازی برای سالن بفرست؛ خودشان با تو تماس می‌گیرند.');
}
