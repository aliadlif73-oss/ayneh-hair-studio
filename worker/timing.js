// How long an image really takes. Every successful generation stores two figures:
//  * wall_ms: from the accepted request to the stored result. This is what the customer waits,
//    but it is read when the page polls, so it is rounded UP by at most one poll interval (the
//    customer page waits 1.4–4 s between polls) and includes the upload and the download.
//  * provider_ms: the image service's own figure, taken from its task record when it carries
//    createTime/completeTime as millisecond timestamps. These field names come from the KIE
//    jobs API; they have NOT been seen in a real response here, so provider_ms stays empty
//    until a real request shows them.
// The owner sees the median, the 90th percentile and the slowest in /admin (/api/owner/timing).
// Nothing here claims a duration before real requests have been measured.
const one = (db, sql, ...a) => db.prepare(sql).bind(...a).first();
const all = async (db, sql, ...a) => (await db.prepare(sql).bind(...a).all()).results;
const DAY = 86400000;

export function providerMs(d) {
  const a = Number(d?.createTime), b = Number(d?.completeTime);
  if (Number.isFinite(a) && Number.isFinite(b) && a > 1e12 && b >= a && b - a < 3600000) return Math.round(b - a);
  return null;
}

/* Never throws: timing must not break the result the customer is waiting for. */
export async function recordTiming(db, g, d, now = Date.now()) {
  try {
    const wall = now - Number(g.created_at);
    if (!(wall >= 0 && wall < 86400000)) return false;
    await db.prepare('INSERT OR IGNORE INTO generation_timings(generation_id,salon_id,line,kind,model,wall_ms,provider_ms,created_at) VALUES(?,?,?,?,?,?,?,?)')
      .bind(g.id, g.salon_id, g.line || 'hair', g.kind || 'single', String(d?.model || '').slice(0, 40), wall, providerMs(d), now).run();
    return true;
  } catch { return false; }
}

const pick = (sorted, q) => sorted.length ? sorted[Math.min(sorted.length - 1, Math.ceil(q * sorted.length) - 1)] : null;
function summary(values) {
  const v = values.filter(Number.isFinite).sort((a, b) => a - b);
  return {count: v.length, median: pick(v, .5), p90: pick(v, .9), max: v.length ? v[v.length - 1] : null, under_60s: v.length ? v.filter(x => x < 60000).length / v.length : null};
}

export async function timingReport(db, {days = 30, now = Date.now()} = {}) {
  const rows = await all(db, 'SELECT line,kind,model,wall_ms,provider_ms FROM generation_timings WHERE created_at>=? ORDER BY created_at DESC LIMIT 5000', now - days * DAY);
  const single = rows.filter(r => r.kind !== 'views');
  const byLine = {};
  for (const r of single) (byLine[r.line] ||= []).push(Number(r.wall_ms));
  const total = Number((await one(db, 'SELECT COUNT(*) n FROM generation_timings'))?.n || 0);
  return {
    days, measured: single.length > 0, total,
    wall: summary(single.map(r => Number(r.wall_ms))),
    provider: summary(single.filter(r => r.provider_ms != null).map(r => Number(r.provider_ms))),
    views: summary(rows.filter(r => r.kind === 'views').map(r => Number(r.wall_ms))),
    by_line: Object.fromEntries(Object.entries(byLine).map(([k, v]) => [k, summary(v)])),
    note: single.length ? '' : 'هنوز هیچ تصویر واقعی اندازه‌گیری نشده است؛ تا اولین ساخت واقعی، دربارهٔ زمان ساخت عددی نگویید.',
  };
}
