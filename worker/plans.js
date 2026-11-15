// What each paid plan opens (owner's decision, following the price sheet):
//   ESSENTIAL — the specialist page, portfolio gallery, test with a reference photo, and
//               customer requests (received in /panel).
//   PRO       — everything in ESSENTIAL + the Telegram/Bale bot, booking & follow-up, and the
//               simple performance report.
//   SIGNATURE — everything in PRO + the full report, the customer archive and priority support.
// Salons without a plan (made by the owner, the demo, trials) keep every feature as before.
import {planOf} from './credits.js';

const ESSENTIAL = ['page', 'gallery', 'reference', 'inbox'];
const PRO = [...ESSENTIAL, 'bot', 'booking', 'report_simple'];
const SIGNATURE = [...PRO, 'report_full', 'archive', 'priority_support'];
export const FEATURES = {essential: ESSENTIAL, pro: PRO, signature: SIGNATURE};
export const ALL = SIGNATURE;
/* The plan that first opens a feature, for the «در پلن …» note on a locked card. */
export const OPENED_BY = Object.fromEntries(ALL.map(f => [f, ESSENTIAL.includes(f) ? 'ESSENTIAL' : PRO.includes(f) ? 'PRO' : 'SIGNATURE']));

/* Does this salon have the feature? A salon without a plan has everything (legacy). */
export function can(salon, feature) {
  const plan = planOf(salon);
  if (!plan) return true;
  return (FEATURES[plan.key] || ESSENTIAL).includes(feature);
}

export const featuresOf = salon => ALL.filter(f => can(salon, f));

/* A paid salon whose plan has no bot receives its requests in /panel. */
export const panelInbox = salon => !!planOf(salon) && !can(salon, 'bot');
