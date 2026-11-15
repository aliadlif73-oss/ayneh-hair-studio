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
import {PLANS} from './prices.js';
import {LINE_KEYS} from './lines.js';

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

/* Paid users at time t. settings.plan.seats is what the current period paid for; a renewal with
   another user count is written as a step {from, seats} that starts when the period it paid for
   starts (seat_steps), so added users are never free for the rest of the current period and
   users already paid for are never taken away before it ends. */
export function seatsAt(plan, t = Date.now()) {
  let seats = Math.trunc(Number(plan?.seats)) || 0;
  for (const s of Array.isArray(plan?.seat_steps) ? plan.seat_steps : []) if (Number(s.from) <= t) seats = Math.trunc(Number(s.seats)) || seats;
  return seats;
}
const LEGACY_LINES = {hair: ['hair', 'color'], color: ['color'], nails: ['nails'], lashes: ['lashes']};

/* A confirmed plan: start (or extend) the plan and add its gift images.
   The order (when given) also decides what the salon offers and how many users it may have:
     * a «پنل آرایشگاه» plan (sheet `seats` > 0) opens every line and records the paid users
       (max(seats, orders.users)); while a salon plan is running, a new user count starts with
       the period it pays for (see seatsAt);
     * a single-service plan on a new salon, or one coming down from an ended salon plan, offers
       only the order's service (settings.lines);
     * a single-service plan for ANOTHER service while a single-service plan is running adds that
       service (nails, then lashes = nails + lashes) and extends the plan. A renewal of the same
       service changes nothing, so a salon that bought «مدل و رنگ مو» before the split keeps both.
   createOrder / createRenewal refuse a single-service order for a salon whose salon plan is still
   running, so the salon plan is never downgraded by a purchase. */
export async function applyPlan(db, salonId, {key, months, credits}, orderId) {
  const salon = await one(db, 'SELECT id,settings FROM salons WHERE id=?', salonId);
  if (!salon) throw new Problem(404, 'سالن پیدا نشد.');
  const settings = settingsOf(salon), now = Date.now();
  const prev = settings.plan && typeof settings.plan === 'object' ? settings.plan : null;
  const order = orderId ? await one(db, 'SELECT service,users FROM orders WHERE id=?', orderId) : null;
  const sheet = PLANS[key] || {};
  const from = Math.max(now, Number(prev?.until) || 0);
  settings.plan = {key, start: Number(prev?.start) || now, until: from + months * MONTH};
  const running = !!prev && Number(prev.until) > now;
  if (sheet.seats > 0) {
    const paid = Math.max(sheet.seats, Math.trunc(Number(order?.users)) || 0);
    if (running && PLANS[prev.key]?.seats > 0) {
      const steps = (Array.isArray(prev.seat_steps) ? prev.seat_steps : []).filter(s => Number(s.from) > now);
      settings.plan.seats = seatsAt(prev, now);
      if (paid !== (steps.length ? steps[steps.length - 1].seats : settings.plan.seats)) steps.push({from, seats: paid});
      if (steps.length) settings.plan.seat_steps = steps;
    } else settings.plan.seats = paid;
    settings.lines = [...LINE_KEYS];
    settings.service = 'all';
  } else if (order && LINE_KEYS.includes(order.service)) {
    const fromSalonPlan = !prev || PLANS[prev.key]?.seats > 0;
    const had = Array.isArray(settings.lines) ? settings.lines : LEGACY_LINES[settings.service] || null;
    if (fromSalonPlan || !running || !had) {
      /* no plan yet, an ended plan, or coming down from the salon plan: the order's service only.
         (A running single plan with no recorded service is a legacy all-lines salon: kept.) */
      if (fromSalonPlan || !running) { settings.lines = [order.service]; settings.service = order.service; }
    } else if (!had.includes(order.service)) {
      settings.lines = LINE_KEYS.filter(k => had.includes(k) || k === order.service);
    }
  }
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
