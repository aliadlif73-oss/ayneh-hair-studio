// What each paid plan opens (owner's decision, following the price sheet):
//   ESSENTIAL — the specialist page, portfolio gallery, test with a reference photo, customer
//               requests (in /panel) and the Telegram/Bale bot (every paid plan has the bot).
//   PRO       — everything in ESSENTIAL + booking & follow-up and the simple performance report.
//   SIGNATURE — everything in PRO + the full report, the customer archive and priority support.
// The «پنل آرایشگاه» plans (salon1/salon3/salon6 in worker/prices.js) open every service and
// carry the features of their tier (prices.js `tier`), plus a user cap (`seats`).
// Salons without a plan (made by the owner, the demo, trials) keep every feature as before.
import {planOf, seatsAt} from './credits.js';
import {PLANS} from './prices.js';
import {LINE_KEYS} from './lines.js';

const ESSENTIAL = ['page', 'gallery', 'reference', 'inbox', 'bot'];
const PRO = [...ESSENTIAL, 'booking', 'report_simple'];
const SIGNATURE = [...PRO, 'report_full', 'archive', 'priority_support'];
export const FEATURES = {essential: ESSENTIAL, pro: PRO, signature: SIGNATURE};
export const ALL = SIGNATURE;
/* The plan that first opens a feature, for the «در پلن …» note on a locked card. */
export const OPENED_BY = Object.fromEntries(ALL.map(f => [f, ESSENTIAL.includes(f) ? 'پایه' : PRO.includes(f) ? 'حرفه‌ای' : 'کامل']));

/* The feature tier of a plan key: the sheet's `tier`, else the key itself (essential/pro/signature). */
export const tierOf = key => PLANS[key]?.tier || (FEATURES[key] ? key : 'essential');

/* Does this salon have the feature? A salon without a plan has everything (legacy). */
export function can(salon, feature) {
  const plan = planOf(salon);
  if (!plan) return true;
  return (FEATURES[tierOf(plan.key)] || ESSENTIAL).includes(feature);
}

export const featuresOf = salon => ALL.filter(f => can(salon, f));

/* A paid salon reads its own (manager-scope) requests in /panel while its bot is not linked
   (every paid plan has the bot; worker/telegram.js deliverLead keeps the same rule). */
export const panelInbox = salon => !!planOf(salon) && (!can(salon, 'bot') || !(salon.telegram_chat_id || salon.bale_chat_id));

/* ---------- services (owner's decision): hair = hairstyle, color = hair colour, nails, lashes ----------
   A paid salon offers the lines in settings.lines (written when its plan is confirmed,
   worker/credits.js applyPlan). A salon that bought from /hair before the services were split
   has settings.service 'hair' and no settings.lines: it keeps hairstyle + hair colour
   (drizzle/0018 also writes that list out). null = every line (no plan, the salon plan, or
   no recorded service). */
const LEGACY_LINES = {hair: ['hair', 'color'], color: ['color'], nails: ['nails'], lashes: ['lashes']};
export function linesOf(salon) {
  if (!planOf(salon)) return null;
  let cfg = {};
  try { cfg = JSON.parse(salon.settings || '{}') || {}; } catch {}
  if (Array.isArray(cfg.lines)) {
    const lines = LINE_KEYS.filter(k => cfg.lines.includes(k));
    return lines.length && lines.length < LINE_KEYS.length ? lines : null;
  }
  return LEGACY_LINES[cfg.service] || null;
}

/* ---------- users («پنل آرایشگاه») ----------
   A plan with `seats` on the sheet is for that many users; the manager is one of them, so
   seats − 1 team members. Extra users are bought on the order (orders.users) and recorded on
   the plan (settings.plan.seats). 0 = no cap (the single-service plans, salons without a plan). */
export function seatsOf(salon) {
  const plan = planOf(salon), sheet = plan && PLANS[plan.key];
  if (!sheet?.seats) return 0;
  return Math.max(sheet.seats, seatsAt(plan));
}
export const seatsFull = cap => 'پلن شما برای ' + cap.toLocaleString('fa-IR') + ' کاربر است (با خود مدیر) و همه‌اش پر شده. برای افزودن همکار تازه، یک همکار را حذف کنید یا هنگام تمدید در پنل («پلن و ارتقا») تعداد کاربر را بیشتر کنید.';
