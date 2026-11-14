// The salon panel's working API (/api/panel/*), behind the panel session (worker/orders.js
// panelSalon) and the plan's features (worker/plans.js):
//   requests (all plans) · bot link (PRO+) · bookings (PRO+) · report (PRO simple, SIGNATURE full)
//   · customer archive + CSV (SIGNATURE) · priority support (SIGNATURE)
//   · the salon's own page: portfolio photos and the page details (every paid plan)
// The panel is the manager's: it lists only requests whose owner is the salon itself, never a
// team member's customers (AGENTS.md: a member's customers go only to that member).
import {must, text, uid, phone as normPhone, limited, Problem} from './domain.js';
import {panelSalon} from './orders.js';
import {can, OPENED_BY} from './plans.js';
import {salonReport} from './reports.js';
import {bucketFor, putImage} from './storage.js';
import {LINE_KEYS} from './lines.js';

const J = (v, s = 200, h = {}) => new Response(JSON.stringify(v), {status: s, headers: {'Content-Type': 'application/json;charset=utf-8', 'Cache-Control': 'no-store', ...h}});
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const run = (db, sql, ...a) => db.prepare(sql).bind(...a).run();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;
const ID = /^[a-f0-9-]{36}$/;
const DAY = 86400000;

const need = (salon, feature) => must(can(salon, feature), 'این امکان در پلن ' + OPENED_BY[feature] + ' و بالاتر باز است.', 403);

/* Persian day, date and time in Tehran: «شنبه ۲۴ آبان، ساعت ۱۶:۳۰». */
export const whenText = ms => {
  const d = new Intl.DateTimeFormat('fa-IR', {timeZone: 'Asia/Tehran', weekday: 'long', day: 'numeric', month: 'long'}).format(ms);
  const t = new Intl.DateTimeFormat('fa-IR', {timeZone: 'Asia/Tehran', hour: '2-digit', minute: '2-digit', hour12: false}).format(ms);
  return d + '، ساعت ' + t;
};
const tehranHour = t => Number(new Intl.DateTimeFormat('en-GB', {timeZone: 'Asia/Tehran', hour: '2-digit', hour12: false}).format(t)) % 24;
const parseProfile = s => { try { return JSON.parse(s.profile || '{}') || {}; } catch { return {}; } };

async function leadOf(db, salon, id) {
  must(ID.test(String(id)), 'درخواست پیدا نشد.', 404);
  const lead = await one(db, 'SELECT * FROM leads WHERE id=? AND salon_id=? AND staff_id IS NULL', id, salon.id);
  must(lead, 'درخواست پیدا نشد.', 404);
  return lead;
}

/* Tell a following customer (Telegram/Bale) about her booking. No SMS: AGENTS.md allows SMS for
   two uses only. */
async function tellCustomer(env, salon, leadId, line) {
  if (!leadId) return false;
  const lead = await one(env.DB, 'SELECT * FROM leads WHERE id=?', leadId);
  if (!lead?.follow_chat) return false;
  const {notifyCustomer} = await import('./telegram.js');
  await notifyCustomer(env, lead, salon, line);
  return true;
}
const salonLine = salon => {
  const p = parseProfile(salon);
  return (p.address ? '\n📍 ' + p.address : '') + (p.phone ? '\n📞 ' + p.phone : '');
};

export async function panelApi(req, env, u, path) {
  if (!path.startsWith('/api/panel/')) return null;
  const route = path.slice('/api/panel/'.length);
  const known = /^(requests(\/[a-f0-9-]{36}\/status)?|media\/[a-f0-9-]{36}|bot-link|bookings(\/[a-f0-9-]{36})?|report|customers(\.csv)?|support|portfolio(\/[a-f0-9-]{36})?|profile)$/;
  if (!known.test(route)) return null;
  const db = env.DB, origin = env.APP_ORIGIN || u.origin;
  const {salon} = await panelSalon(req, db);

  /* ---------- requests: every plan ---------- */
  if (route === 'requests' && req.method === 'GET') {
    need(salon, 'inbox');
    const page = Math.max(0, Math.min(100, Number(u.searchParams.get('page')) || 0));
    const rows = await all(db, "SELECT l.id,l.name,l.phone,l.telegram,l.line,l.look,l.color,l.note,l.original_id,l.preview_id,l.reference_id,l.salon_status,l.created_at,l.follow_chat IS NOT NULL following,(SELECT starts_at FROM bookings b WHERE b.lead_id=l.id AND b.status='scheduled') booking_at FROM leads l WHERE l.salon_id=? AND l.staff_id IS NULL ORDER BY l.created_at DESC LIMIT 21 OFFSET ?", salon.id, page * 20);
    return J({requests: rows.slice(0, 20).map(r => ({...r, following: !!r.following})), more: rows.length > 20, page});
  }
  const statusRoute = route.match(/^requests\/([a-f0-9-]{36})\/status$/);
  if (statusRoute && req.method === 'POST') {
    need(salon, 'inbox');
    const lead = await leadOf(db, salon, statusRoute[1]);
    const b = await req.json().catch(() => ({}));
    const {setLeadStatus} = await import('./telegram.js');
    const r = await setLeadStatus(env, salon, lead, String(b.status || ''), origin);
    return J({ok: true, status: r.lead.salon_status, told: !!(r.changed && lead.follow_chat)});
  }
  /* Photos of the salon's own (manager-scope) requests only. */
  const media = route.match(/^media\/([a-f0-9-]{36})$/);
  if (media && req.method === 'GET') {
    need(salon, 'inbox');
    const m = await one(db, 'SELECT * FROM media WHERE id=? AND salon_id=?', media[1], salon.id);
    must(m && (m.kind === 'portfolio' || await one(db, 'SELECT 1 FROM leads WHERE salon_id=? AND staff_id IS NULL AND (original_id=? OR preview_id=? OR reference_id=?)', salon.id, media[1], media[1], media[1])), 'عکس پیدا نشد.', 404);
    const object = await bucketFor(env).get(m.object_key);
    must(object, 'عکس در دسترس نیست', 410);
    return new Response(object.body, {headers: {'Content-Type': m.mime, 'Cache-Control': 'private,no-store', 'X-Content-Type-Options': 'nosniff'}});
  }

  /* ---------- the salon's own page: every paid plan («گالری نمونه‌کار») ---------- */
  /* Portfolio: the raw image is the body, title and line ride in the query string. The same
     row the bot and the owner console make: published and usable for try-on. */
  if (route === 'portfolio' && req.method === 'POST') {
    need(salon, 'gallery');
    await limited(db, 'panel-portfolio:' + salon.id, 40);
    const count = await one(db, 'SELECT COUNT(*) n FROM portfolio WHERE salon_id=?', salon.id);
    must(Number(count?.n || 0) < 60, 'حداکثر ۶۰ نمونه‌کار می‌توانید داشته باشید؛ اول یکی را حذف کنید.', 409);
    const bytes = new Uint8Array(await req.arrayBuffer());
    const mediaId = await putImage(env, salon, null, bytes, 'portfolio');
    const line = LINE_KEYS.includes(u.searchParams.get('line')) ? u.searchParams.get('line') : 'hair';
    const title = text(String(u.searchParams.get('title') || '').slice(0, 80), 80) || 'نمونه‌کار';
    const id = uid();
    await run(db, 'INSERT INTO portfolio(id,salon_id,title,category,description,stylist,images,published,try_on,permission,created_at,staff_id,media_group,line,look) VALUES(?,?,?,?,?,?,?,1,1,1,?,NULL,NULL,?,?)',
      id, salon.id, title, '', '', '', JSON.stringify([mediaId]), Date.now(), line, '');
    return J({id, title, line, image: mediaId});
  }
  const pf = route.match(/^portfolio\/([a-f0-9-]{36})$/);
  if (pf && req.method === 'DELETE') {
    need(salon, 'gallery');
    const row = await one(db, 'SELECT id FROM portfolio WHERE id=? AND salon_id=?', pf[1], salon.id);
    must(row, 'نمونه‌کار پیدا نشد.', 404);
    await run(db, 'DELETE FROM portfolio WHERE id=? AND salon_id=?', pf[1], salon.id);
    return J({ok: true});
  }
  /* Page details the customer sees under «دربارهٔ سالن». Text only; the same limits as the
     owner console's editor (worker/server.js profile route). */
  if (route === 'profile' && req.method === 'POST') {
    need(salon, 'page');
    const b = await req.json().catch(() => ({}));
    const p = parseProfile(salon);
    for (const k of ['bio', 'address', 'hours']) if (k in b) p[k] = text(String(b[k] || ''), k === 'bio' ? 400 : 200);
    if ('phone' in b) {
      const tel = String(b.phone || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[\s()-]/g, '');
      must(!tel || /^\+?\d{5,15}$/.test(tel), 'شمارهٔ تماس معتبر نیست.');
      p.phone = tel;
    }
    if ('instagram' in b) {
      const ig = String(b.instagram || '').trim().replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/\/.*$/, '');
      must(!ig || /^[A-Za-z0-9._]{1,30}$/.test(ig), 'نام کاربری اینستاگرام معتبر نیست.');
      p.instagram = ig ? 'https://instagram.com/' + ig : '';
    }
    const name = 'name' in b ? text(String(b.name || ''), 100) : salon.name;
    must(name, 'نام صفحه را بنویسید.');
    await run(db, 'UPDATE salons SET name=?,profile=? WHERE id=?', name, JSON.stringify(p), salon.id);
    return J({ok: true, name, profile: {bio: p.bio || '', address: p.address || '', hours: p.hours || '', phone: p.phone || '', instagram: p.instagram || ''}});
  }

  /* ---------- bot connection: PRO+ ---------- */
  if (route === 'bot-link' && req.method === 'POST') {
    need(salon, 'bot');
    const {newLinkCode} = await import('./telegram.js');
    const r = await newLinkCode(db, salon, env);
    must(Object.keys(r.links).length, 'ربات آینه هنوز روی سرور فعال نشده؛ با پشتیبانی آینه تماس بگیرید.', 503);
    return J({links: r.links});
  }

  /* ---------- bookings: PRO+ ---------- */
  if (route === 'bookings' && req.method === 'GET') {
    need(salon, 'booking');
    const from = Date.now() - 12 * 3600000;
    const rows = await all(db, "SELECT b.*,t.name staff_name FROM bookings b LEFT JOIN team t ON t.id=b.staff_id WHERE b.salon_id=? AND b.starts_at>=? AND b.status IN('scheduled','done','no_show') ORDER BY b.starts_at LIMIT 100", salon.id, from);
    return J({bookings: rows.map(r => ({...r, when: whenText(r.starts_at)}))});
  }
  if (route === 'bookings' && req.method === 'POST') {
    need(salon, 'booking');
    await limited(db, 'panel-booking:' + salon.id, 200);
    const b = await req.json().catch(() => ({}));
    const at = Number(b.starts_at);
    must(Number.isFinite(at) && at > Date.now() - 3600000 && at < Date.now() + 366 * DAY, 'روز و ساعت نوبت معتبر نیست.');
    const dur = Math.max(15, Math.min(480, Math.round(Number(b.duration_min) || 60)));
    let lead = null, name, tel;
    if (b.lead_id) {
      lead = await leadOf(db, salon, b.lead_id);
      name = lead.name; tel = lead.phone;
      must(!await one(db, "SELECT 1 FROM bookings WHERE lead_id=? AND status='scheduled'", lead.id), 'برای این درخواست نوبت فعال ثبت شده؛ همان را جابه‌جا کنید.', 409);
    } else {
      name = text(String(b.name || ''), 80); must(name.length >= 2, 'نام مشتری را بنویسید.');
      tel = b.phone ? normPhone(b.phone) : '';
    }
    const staff = b.staff_id && ID.test(b.staff_id) ? (await one(db, 'SELECT id FROM team WHERE id=? AND salon_id=? AND active=1', b.staff_id, salon.id))?.id || null : null;
    const id = uid(), now = Date.now();
    /* A cancelled booking of the same request is reused, so lead_id stays unique. */
    if (lead) await run(db, "DELETE FROM bookings WHERE lead_id=? AND status<>'scheduled'", lead.id);
    await run(db, 'INSERT INTO bookings(id,salon_id,lead_id,staff_id,customer_name,phone,starts_at,duration_min,note,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)',
      id, salon.id, lead?.id || null, staff, name, tel, at, dur, text(String(b.note || ''), 300), 'scheduled', now, now);
    /* The request becomes «نوبت داده شد»; the customer gets the dated message below instead of
       the generic one. */
    if (lead && lead.salon_status !== 'booked') await run(db, "UPDATE leads SET salon_status='booked',handled_at=COALESCE(handled_at,?) WHERE id=?", now, lead.id);
    const told = await tellCustomer(env, salon, lead?.id, '📅 نوبتت در «' + salon.name + '» برای ' + whenText(at) + ' ثبت شد.' + salonLine(salon) + '\nیک روز قبل همین‌جا یادآوری می‌کنیم.');
    const overlap = await one(db, "SELECT COUNT(*) n FROM bookings WHERE salon_id=? AND id<>? AND status='scheduled' AND COALESCE(staff_id,'')=? AND starts_at<? AND starts_at+duration_min*60000>?", salon.id, id, staff || '', at + dur * 60000, at);
    return J({ok: true, id, when: whenText(at), told, overlap: Number(overlap?.n || 0)});
  }
  const bookingRoute = route.match(/^bookings\/([a-f0-9-]{36})$/);
  if (bookingRoute && req.method === 'POST') {
    need(salon, 'booking');
    const bk = await one(db, 'SELECT * FROM bookings WHERE id=? AND salon_id=?', bookingRoute[1], salon.id);
    must(bk, 'نوبت پیدا نشد.', 404);
    const b = await req.json().catch(() => ({}));
    const action = String(b.action || '');
    const now = Date.now();
    if (action === 'move') {
      const at = Number(b.starts_at);
      must(Number.isFinite(at) && at > now - 3600000 && at < now + 366 * DAY, 'روز و ساعت نوبت معتبر نیست.');
      must(bk.status === 'scheduled', 'فقط نوبت فعال جابه‌جا می‌شود.', 409);
      await run(db, 'UPDATE bookings SET starts_at=?,reminded_at=NULL,updated_at=? WHERE id=?', at, now, bk.id);
      const told = await tellCustomer(env, salon, bk.lead_id, '🔄 نوبتت در «' + salon.name + '» به ' + whenText(at) + ' تغییر کرد.' + salonLine(salon));
      return J({ok: true, when: whenText(at), told});
    }
    const to = {done: 'done', no_show: 'no_show', cancel: 'cancelled'}[action];
    must(to, 'کار نامعتبر.');
    await run(db, 'UPDATE bookings SET status=?,updated_at=? WHERE id=?', to, now, bk.id);
    let told = false;
    if (to === 'cancelled' && bk.status === 'scheduled') told = await tellCustomer(env, salon, bk.lead_id, 'نوبتت در «' + salon.name + '» برای ' + whenText(bk.starts_at) + ' لغو شد. برای هماهنگی دوباره با سالن تماس بگیر.' + salonLine(salon));
    return J({ok: true, status: to, told});
  }

  /* ---------- report: PRO simple, SIGNATURE full ---------- */
  if (route === 'report' && req.method === 'GET') {
    need(salon, 'report_simple');
    return J(await salonReport(db, salon));
  }

  /* ---------- customer archive: SIGNATURE ---------- */
  if ((route === 'customers' || route === 'customers.csv') && req.method === 'GET') {
    need(salon, 'archive');
    const q = String(u.searchParams.get('q') || '').trim().slice(0, 40);
    const like = '%' + q.replace(/[%_]/g, '') + '%';
    /* Mobiles are stored as +98912…; people type 0912…: match on the digits after the 0. */
    const digitsQ = q.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g, '').replace(/^(0098|98|0)/, '');
    const where = q ? ' AND (l.name LIKE ? OR l.phone LIKE ?)' : '';
    const args = q ? [like, '%' + (digitsQ || '#') + '%'] : [];
    const csv = route === 'customers.csv';
    const page = csv ? 0 : Math.max(0, Math.min(500, Number(u.searchParams.get('page')) || 0));
    const rows = await all(db,
      "SELECT l.phone, (SELECT name FROM leads x WHERE x.salon_id=l.salon_id AND x.phone=l.phone ORDER BY created_at DESC LIMIT 1) name, COUNT(*) requests, MAX(l.created_at) last_at, MIN(l.created_at) first_at, GROUP_CONCAT(DISTINCT l.line) lines, SUM(CASE WHEN l.salon_status='booked' THEN 1 ELSE 0 END) booked, (SELECT COUNT(*) FROM bookings b WHERE b.salon_id=l.salon_id AND b.phone=l.phone AND b.status='done') visits, (SELECT preview_id FROM leads x WHERE x.salon_id=l.salon_id AND x.phone=l.phone AND x.preview_id IS NOT NULL ORDER BY created_at DESC LIMIT 1) last_preview, (SELECT TRIM(look||' '||color) FROM leads x WHERE x.salon_id=l.salon_id AND x.phone=l.phone ORDER BY created_at DESC LIMIT 1) last_choice FROM leads l WHERE l.salon_id=? AND l.staff_id IS NULL" + where + " GROUP BY l.phone ORDER BY last_at DESC LIMIT ? OFFSET ?",
      salon.id, ...args, csv ? 5000 : 31, page * 30);
    if (csv) {
      const esc = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
      const fmt = ms => ms ? new Intl.DateTimeFormat('fa-IR', {timeZone: 'Asia/Tehran', dateStyle: 'short'}).format(ms) : '';
      const head = ['نام', 'موبایل', 'تعداد درخواست', 'نوبت‌داده', 'مراجعهٔ انجام‌شده', 'خدمت‌ها', 'آخرین انتخاب', 'اولین درخواست', 'آخرین درخواست'];
      const body = rows.map(r => [r.name, String(r.phone || '').replace(/^\+98/, '0'), r.requests, r.booked, r.visits, r.lines, r.last_choice, fmt(r.first_at), fmt(r.last_at)].map(esc).join(','));
      return new Response('﻿' + [head.map(esc).join(','), ...body].join('\r\n'), {headers: {'Content-Type': 'text/csv;charset=utf-8', 'Content-Disposition': 'attachment; filename="ayneh-customers.csv"', 'Cache-Control': 'private,no-store'}});
    }
    return J({customers: rows.slice(0, 30).map(r => ({...r, phone: String(r.phone || '').replace(/^\+98/, '0')})), more: rows.length > 30, page});
  }

  /* ---------- priority support: SIGNATURE ---------- */
  if (route === 'support' && req.method === 'POST') {
    need(salon, 'priority_support');
    await limited(db, 'support:' + salon.id, 8, 'امروز چند پیام فرستاده‌اید؛ اگر فوری است تماس بگیرید.');
    const b = await req.json().catch(() => ({}));
    const topic = text(String(b.topic || ''), 80), message = text(String(b.message || ''), 1000);
    must(message.length >= 5, 'پیام را بنویسید.');
    const {notifyOwner} = await import('./alerts.js');
    await notifyOwner(env, {salon, kind: 'support', level: 'warn', text: 'SIGNATURE · پشتیبانی ویژه · «' + salon.name + '»' + (topic ? ' · ' + topic : ''), detail: message});
    return J({ok: true});
  }
  throw new Problem(404, 'مسیر پیدا نشد');
}

/* ---------- cron: day-before reminders and after-visit follow-ups (10-minute tick) ---------- */
export async function bookingTick(env, origin = '', now = Date.now()) {
  if (!env.DB) return {reminded: 0, followed: 0};
  const h = tehranHour(now);
  if (h < 9 || h >= 21) return {reminded: 0, followed: 0};
  let reminded = 0, followed = 0;
  /* Reminder: the booking is within the next 24 hours (and not in the next 2, where it is too late to help). */
  for (const bk of await all(env.DB, "SELECT * FROM bookings WHERE status='scheduled' AND reminded_at IS NULL AND starts_at<=? AND starts_at>? LIMIT 50", now + DAY, now + 2 * 3600000)) {
    const claim = await run(env.DB, 'UPDATE bookings SET reminded_at=? WHERE id=? AND reminded_at IS NULL', now, bk.id);
    if (!claim.meta.changes) continue;
    const salon = await one(env.DB, 'SELECT * FROM salons WHERE id=?', bk.salon_id);
    if (!salon) continue;
    if (await tellCustomer(env, salon, bk.lead_id, '⏰ یادآوری: نوبتت در «' + salon.name + '» ' + whenText(bk.starts_at) + ' است.' + salonLine(salon))) reminded++;
  }
  /* Follow-up: the day after the visit (marked done, or still scheduled and well past). */
  for (const bk of await all(env.DB, "SELECT * FROM bookings WHERE status IN('done','scheduled') AND followed_at IS NULL AND starts_at<? LIMIT 50", now - 20 * 3600000)) {
    const claim = await run(env.DB, 'UPDATE bookings SET followed_at=? WHERE id=? AND followed_at IS NULL', now, bk.id);
    if (!claim.meta.changes) continue;
    const salon = await one(env.DB, 'SELECT * FROM salons WHERE id=?', bk.salon_id);
    if (!salon) continue;
    if (await tellCustomer(env, salon, bk.lead_id, '💐 ممنون که به «' + salon.name + '» آمدی. برای نوبت بعدی یا امتحان یک مدل تازه:\n' + (origin || '') + '/s/' + salon.slug)) followed++;
  }
  return {reminded, followed};
}
