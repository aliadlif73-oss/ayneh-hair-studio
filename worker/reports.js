// Performance reports for salons on a plan:
//   simple (PRO)       — the last 30 days' key numbers against the 30 before.
//   full (SIGNATURE)   — plus the funnel, the daily series, the most chosen models and colours,
//                        each stylist's numbers, request→booking conversion and response time.
// Reports carry counts only. The weekly summary sent to the salon's bot never contains a
// customer's name, mobile or photo (same rule as the owner alerts).
import {stats} from './stats.js';
import {can, featuresOf} from './plans.js';
import {planOf} from './credits.js';
import {limited} from './domain.js';

const DAY = 86400000;
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;

async function leadCounts(db, salonId, from, to) {
  const r = await one(db, "SELECT COUNT(*) n, SUM(CASE WHEN salon_status='booked' THEN 1 ELSE 0 END) booked, SUM(CASE WHEN salon_status='declined' THEN 1 ELSE 0 END) declined, SUM(CASE WHEN salon_status='called' THEN 1 ELSE 0 END) called FROM leads WHERE salon_id=? AND created_at>=? AND created_at<?", salonId, from, to);
  /* Bookings made in the window (even for a later day); visits and no-shows by the day they fell on. */
  const b = await one(db, "SELECT SUM(CASE WHEN created_at>=? AND created_at<? AND status<>'cancelled' THEN 1 ELSE 0 END) n, SUM(CASE WHEN status='done' AND starts_at>=? AND starts_at<? THEN 1 ELSE 0 END) done, SUM(CASE WHEN status='no_show' AND starts_at>=? AND starts_at<? THEN 1 ELSE 0 END) no_show FROM bookings WHERE salon_id=?", from, to, from, to, from, to, salonId);
  return {
    requests: Number(r?.n || 0), booked: Number(r?.booked || 0), declined: Number(r?.declined || 0), called: Number(r?.called || 0),
    bookings: Number(b?.n || 0), visits: Number(b?.done || 0), no_show: Number(b?.no_show || 0),
  };
}

export async function salonReport(db, salon, {now = Date.now(), days = 30} = {}) {
  const simple = can(salon, 'report_simple'), full = can(salon, 'report_full');
  if (!simple) return null;
  const from = now - days * DAY, prevFrom = from - days * DAY;
  const s = await stats(db, {days, salonId: salon.id, now});
  const cur = {...await leadCounts(db, salon.id, from, now + 1), visitors: Number(s.kpi?.visitors || 0), tries: Number(s.kpi?.simulations || 0)};
  const prev = {...await leadCounts(db, salon.id, prevFrom, from)};
  const out = {level: full ? 'full' : 'simple', days, current: cur, previous: prev};
  if (!full) return out;
  const staff = await all(db, "SELECT COALESCE(t.name,'مدیر سالن') name, COUNT(l.id) requests, SUM(CASE WHEN l.salon_status='booked' THEN 1 ELSE 0 END) booked FROM leads l LEFT JOIN team t ON t.id=l.staff_id WHERE l.salon_id=? AND l.created_at>=? GROUP BY l.staff_id ORDER BY requests DESC LIMIT 20", salon.id, from);
  const times = (await all(db, 'SELECT handled_at-created_at d FROM leads WHERE salon_id=? AND created_at>=? AND handled_at IS NOT NULL ORDER BY d', salon.id, from)).map(r => Number(r.d));
  const median = times.length ? times[times.length >> 1] : null;
  const lines = await all(db, 'SELECT line, COUNT(*) n FROM leads WHERE salon_id=? AND created_at>=? GROUP BY line ORDER BY n DESC', salon.id, from);
  return {
    ...out,
    funnel: s.funnel || [], daily: s.daily || [], looks: (s.looks || []).slice(0, 8), colors: (s.colors || []).slice(0, 8),
    staff: staff.map(r => ({name: r.name, requests: Number(r.requests), booked: Number(r.booked || 0)})),
    lines: lines.map(r => ({line: r.line, n: Number(r.n)})),
    conversion: cur.requests ? Math.round(cur.booked / cur.requests * 100) : 0,
    response_minutes: median == null ? null : Math.round(median / 60000),
  };
}

/* The weekly summary: Saturday morning, Tehran time, once per salon per week, to the manager's
   chat only; counts only. Called from the 10-minute cron tick. */
const tehranParts = t => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Tehran', weekday: 'short', hour: '2-digit', hour12: false}).formatToParts(t).map(p => [p.type, p.value]));
const fa = n => Number(n || 0).toLocaleString('fa-IR');

export function weeklyText(salon, r) {
  const c = r.current;
  const lines = [
    '📊 خلاصهٔ هفتگی «' + salon.name + '» (۳۰ روز اخیر)',
    '👀 بازدید صفحه: ' + fa(c.visitors),
    '🪞 امتحان روی عکس: ' + fa(c.tries),
    '📩 درخواست: ' + fa(c.requests) + (r.previous ? ' (دورهٔ قبل ' + fa(r.previous.requests) + ')' : ''),
    '✅ نوبت‌داده: ' + fa(c.booked) + ' · 🚫 قابل اجرا نبود: ' + fa(c.declined),
    '📅 نوبت‌های ثبت‌شده: ' + fa(c.bookings) + ' · انجام‌شده: ' + fa(c.visits),
  ];
  if (r.level === 'full' && r.response_minutes != null) lines.push('⏱ میانهٔ زمان پاسخ: ' + fa(r.response_minutes) + ' دقیقه');
  lines.push('جزئیات کامل در پنل سالن.');
  return lines.join('\n');
}

export async function weeklySummaries(env, now = Date.now()) {
  const p = tehranParts(now);
  if (p.weekday !== 'Sat' || Number(p.hour) % 24 !== 10) return 0;
  const {inboxes, call, PLATFORMS} = await import('./telegram.js');
  const week = Math.floor((now + 12600000) / (7 * DAY));
  let sent = 0;
  for (const salon of await all(env.DB, "SELECT * FROM salons WHERE settings LIKE '%\"plan\"%' LIMIT 500")) {
    if (!planOf(salon) || !can(salon, 'bot') || !can(salon, 'report_simple')) continue;
    const targets = inboxes(env, salon);
    if (!targets.length) continue;
    try { await limited(env.DB, 'weekly:' + salon.id + ':' + week, 1); } catch { continue; }
    const r = await salonReport(env.DB, salon, {now});
    if (!r) continue;
    for (const q of targets) {
      try { await call(env, q, 'sendMessage', {chat_id: salon[PLATFORMS[q].col], text: weeklyText(salon, r)}); sent++; } catch (e) { console.error('weekly', e?.message); }
    }
  }
  return sent;
}

export {featuresOf};
