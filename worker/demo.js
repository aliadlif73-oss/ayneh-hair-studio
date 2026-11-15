// The visitor demo behind the landing page (/s/demo): no sign-up, 2 images per visitor.
//
// Who is a visitor: this session cookie and the anonymous browser id the page keeps in
// localStorage ('ayneh-v'). Neither is proof of a person, so two more limits sit behind it:
//  * a coarse per-network counter (the hashed IP in `limits`, rolling 24 h, never stored in
//    events_log and never in clear text), and
//  * the demo salon's own daily cap (server.js DAILY_LIMIT, an owner setting per salon).
// The trade-off, accepted by the owner: someone who clears cookies and storage gets 2 more
// images, until the network counter or the daily cap stops them. Mobile networks in Iran put
// many people behind one address (CGNAT), so the network counter is generous on purpose.
import {must, limited} from './domain.js';

export const DEMO_IMAGES = 2;
export const DEMO_IP_DAILY = 10;
const visitorOk = v => /^[a-f0-9]{16,32}$/.test(String(v || '')) ? String(v) : '';

export async function demoUsed(db, salon, s, visitor) {
  const v = visitorOk(visitor);
  const r = await db.prepare("SELECT COUNT(*) n FROM generations WHERE salon_id=? AND state<>'fail' AND (session_id=? OR (?<>'' AND visitor=?))")
    .bind(salon.id, s?.id || '', v, v).first();
  return Number(r?.n || 0);
}

/* Called before a demo image is ordered. Failed images do not count (the same rule as salons). */
export async function spendDemoImage(db, {salon, s, visitor, ip}) {
  must(await demoUsed(db, salon, s, visitor) < DEMO_IMAGES,
    'دو نمونهٔ رایگان این صفحه را ساخته‌اید. برای ادامه، صفحهٔ آزمایشی سالن خودتان را بسازید.', 429);
  await limited(db, 'demo-ip:' + (ip || 'unknown'), DEMO_IP_DAILY,
    'از این شبکه امروز نمونه‌های زیادی ساخته شده؛ فردا دوباره امتحان کنید یا صفحهٔ آزمایشی سالن خودتان را بسازید.');
}
