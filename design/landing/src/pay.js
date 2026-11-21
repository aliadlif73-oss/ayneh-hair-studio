/* Checkout: plan panel → bank transfer → a 10-minute countdown → automatic confirmation.
 *
 * Everything that matters (amount, card, deadline, access key) comes from the server. The
 * page only draws what it is told: POST /api/order opens an order, GET /api/order/<id>
 * reports its state, and the timer is a local echo of expires_at, never the authority.
 * There is no receipt and no manager step: the payment site's webhook confirms the order
 * and this page, polling, opens the panel door. A transfer that lands after the clock can
 * still be confirmed, so an expired order keeps being watched for a while.
 * If a plan has no approved amount, or the server is not reachable, the button stays a
 * demo request — the page never invents a price or a card number.
 */
(() => {
  const $ = id => document.getElementById(id);
  const section = $('pay');
  if (!section) return;
  const fa = n => new Intl.NumberFormat('fa-IR').format(n);
  const money = n => fa(n) + ' تومان';
  /* Server error text is already Persian and user-facing (worker/domain.js Problem). */
  const err = (node, message) => {
    if (!node) return;
    node.textContent = message || '';
    node.hidden = !message;
  };
  const call = async (path, body) => {
    const init = body === undefined ? {} : {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(body)};
    let res;
    try {
      res = await fetch(path, init);
    } catch {
      throw new Error('ارتباط با سرور برقرار نشد؛ اینترنت را بررسی کنید.');
    }
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'درخواست انجام نشد.');
    return data;
  };
  const track = (kind, meta) => window.__AYN_TRACK?.(kind, meta);

  const state = {order: null, plan: null, buy: null, service: '', poll: null, tick: null, done: false, key: '', pass: '', entered: false, activated: false};
  /* The order and its panel credentials are kept in this browser until the panel opens. A customer who
     switches to the bank app, or reloads, comes back to the same order with the same credentials;
     another browser (or another person with the same mobile) gets nothing from it. */
  const STORE = 'ayneh-order';
  const remember = (id, key, pass) => { try { localStorage.setItem(STORE, JSON.stringify({id, key, pass: pass || '', at: Date.now()})); } catch {} };
  const recall = () => { try { const v = JSON.parse(localStorage.getItem(STORE) || 'null'); return v && /^[a-f0-9-]{36}$/.test(v.id) ? v : null; } catch { return null; } };
  const view = {
    form: $('payForm'), live: $('payLive'), done: $('payDone'), expired: $('payExpired'),
  };
  /* A late webhook is still welcome: an expired order is watched for this long after its clock. */
  const LATE = 60 * 60000;
  const LATE_LEAD = $('payLateLead').textContent;
  /* «پلن مدل مو · ۳ ماهه» (+ «· ۵ کاربر» on a multi-user plan); a top-up is just its name. */
  const summaryOf = order => {
    const s = order.summary || {};
    const title = s.title || order.plan_name || '';
    if (order.kind === 'topup' || !s.months) return title;
    /* The mark after a Latin name (PRO) keeps «· ۳ ماهه» from jumping to its other side in RTL. */
    return 'پلن ' + title + '\u200f · ' + fa(s.months) + ' ماهه' + (s.users > 1 ? ' · ' + fa(s.users) + ' کاربر' : '');
  };

  /* The heading before the server answers: the same «پلن مدل مو · ۳ ماهه» from the card's own
     data (build.py writes it from the plan table). */
  const headOf = (title, months) => title ? 'پلن ' + title + (months ? '\u200f · ' + fa(months) + ' ماهه' : '') : '';

  /* ---------- «پنل آرایشگاه»: the user count ----------
     A preview only: total = base + max(0, users − seats) × seat_amount, all three numbers from the
     card (the plan table). The server computes the amount again and its answer is what is paid. */
  const usersBox = $('payUsersBox'), usersIn = $('payUsers');
  const seatsOf = btn => Number(btn?.dataset.seats || 0);
  const usersWanted = () => {
    const n = Number(String(usersIn.value).replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)));
    return Number.isInteger(n) && n >= 1 ? n : 0;
  };
  function drawUsers() {
    const btn = state.buy, seats = seatsOf(btn);
    usersBox.hidden = !seats;
    if (!seats) return;
    const base = Number(btn.dataset.amount), rate = Number(btn.dataset.seatAmount), n = usersWanted();
    if (!n) { $('payUsersTotal').textContent = 'تعداد کاربر را با عدد بنویسید.'; return; }
    const extra = Math.max(0, n - seats);
    $('payUsersTotal').textContent = extra
      ? 'جمع: ' + money(base + extra * rate) + ' (' + money(base) + ' برای ' + fa(seats) + ' نفر + ' + fa(extra) + ' × ' + money(rate) + ')'
      : 'جمع: ' + money(base) + ' برای تا ' + fa(seats) + ' کاربر';
  }
  usersIn.addEventListener('input', drawUsers);

  /* ---------- what each plan may do right now ---------- */
  const buyButtons = [...document.querySelectorAll('[data-buy]')];
  function syncPlans() {
    for (const btn of buyButtons) {
      const key = btn.dataset.buy;
      const open = btn.dataset.state === 'open' && Number(btn.dataset.amount) > 0;
      const card = btn.closest('.plan');
      if (card) card.dataset.open = String(open);
      /* Not aria-disabled: an unpriced button still works, it opens the demo form. */
      btn.setAttribute('aria-disabled', 'false');
      /* The panel already says the amount is being finalized (build.py fills it), so the
         note stays empty here and only speaks up if the visitor clicks the buy button. */
      const note = card?.querySelector('.plan__state');
      if (note && !open) note.hidden = true;
    }
  }

  /* ---------- step 1 → 2: open the order on the server ---------- */
  async function open(plan) {
    state.plan = plan;
    err($('payErr'), '');
    const body = {
      plan,
      /* the service of the card that was clicked (hair, color, nails, lashes; 'all' on the salon tab) */
      service: state.service,
      salon: $('paySalon').value.trim(),
      name: $('payName').value.trim(),
      phone: $('payPhone').value.trim(),
      city: $('payCity').value.trim(),
      consent: $('payConsent').checked,
    };
    const built = window.__AYN_BUILDER?.();
    if (built && built.draft && Object.keys(built.draft).length) body.draft = built.draft;
    if (body.salon.length < 2) return err($('payErr'), 'نام سالن را بنویسید.');
    if (body.name.length < 2) return err($('payErr'), 'نام و نام خانوادگی را بنویسید.');
    if (seatsOf(state.buy)) {
      body.users = usersWanted();
      if (!body.users) return err($('payErr'), 'تعداد کاربر را با عدد بنویسید.');
    }
    if (!body.consent) return err($('payErr'), 'برای هماهنگی راه‌اندازی، تأیید تماس لازم است.');
    $('payStart').disabled = true;
    try {
      const order = await call('/api/order', body);
      state.order = order;
      /* The server hands the panel key and password out once, here. Kept in this browser
         so the done screen can show them even after a reload. */
      if (order.access_key) state.key = order.access_key;
      if (order.panel_password) state.pass = order.panel_password;
      remember(order.id, state.key, state.pass);
      track('order_open', plan);
      draw(order);
      view.form.hidden = true;
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
    } catch (e) {
      err($('payErr'), e.message);
    } finally {
      $('payStart').disabled = false;
    }
  }

  /* ---------- the visible states ---------- */
  /* The page's sticky demo bar hides while a payment is in flight: a "free demo" button
     over a checkout is the one place it would be actively misleading. */
  const paying = on => {
    if (document.body.classList.contains('is-paying') === on) return;
    document.body.classList.toggle('is-paying', on);
    dispatchEvent(new CustomEvent('ayneh:pay-state'));
  };
  function show(which) {
    for (const [name, node] of Object.entries(view)) if (node) node.hidden = name !== which;
    section.hidden = false;
    paying(which !== 'form');
    const step = which === 'form' ? 1 : which === 'done' ? 3 : 2;
    section.querySelectorAll('#paySteps li').forEach(li => {
      const n = Number(li.dataset.step);
      li.classList.toggle('is-on', n === step);
      li.classList.toggle('is-done', n < step);
    });
  }

  function draw(order) {
    state.done = false;
    section.hidden = false;
    const sum = order.summary || {};
    $('payPlan').textContent = (order.kind !== 'topup' && sum.months ? headOf(sum.title, sum.months) : '') || order.plan_name || '';
    $('paySummary').textContent = summaryOf(order);
    $('payAmount').textContent = fa(order.amount);
    $('payDiscount').hidden = !order.discount;
    if (order.discount) $('payDiscount').textContent = 'با تخفیف ' + money(order.discount);
    $('payRef').textContent = order.ref;
    $('payCard').textContent = order.card ? group(order.card) : '•••• •••• •••• ••••';
    $('payCardOwner').textContent = order.card_owner || 'صاحب حساب: —';
    $('payCardWarn').hidden = !!order.card;
    $('payCopy').disabled = !order.card;
    /* No card saved yet: nothing can be paid, so no clock and no "confirmed automatically" line. */
    $('payAuto').hidden = !order.card;
    view.live.querySelector('.pay-figure--timer').hidden = !order.card;
    view.live.querySelector('.pay-timer').hidden = !order.card;
    /* The countdown is driven by expires_at, so a reload or a slow phone cannot extend it. */
    clearInterval(state.tick);
    const end = Number(order.expires_at);
    const total = Math.max(1, end - Number(order.created_at));
    const tick = () => {
      const left = end - Date.now();
      if (left <= 0) {
        clearInterval(state.tick);
        if (!state.done) drawState({...state.order, status: 'expired'});
        return;
      }
      const s = Math.ceil(left / 1000);
      /* Persian digits with a leading zero, so the clock reads ۰۹:۱۹ and not 9:19. */
      const two = n => fa(n).padStart(2, '۰');
      $('payClock').textContent = two(Math.floor(s / 60)) + ':' + two(s % 60);
      const pct = Math.max(0, Math.min(100, left / total * 100));
      $('payTimerBar').style.width = pct + '%';
      $('payLive').classList.toggle('is-low', left < 120000);
      view.live.querySelector('.pay-figure--timer').classList.toggle('is-low', left < 120000);
    };
    tick();
    state.tick = setInterval(tick, 1000);
    show('live');
    poll();
  }

  const group = digits => digits.replace(/(\d{4})(?=\d)/g, '$1 ');

  function drawState(order) {
    section.hidden = false;
    if (order.status === 'paid') {
      state.done = true;
      clearInterval(state.tick);
      clearInterval(state.poll);
      const shown = state.key || order.access_key || '';
      const pass = state.pass || order.panel_password || '';
      $('payAccessKey').textContent = shown || '—';
      $('payKeyCopy').hidden = !shown;
      $('payDoneNote').hidden = !!shown;
      const creds = $('payCreds'), guide = $('payGuide'), sub = $('payDoneSub');
      /* A top-up or a renewal from the panel: the salon already has its key and its panel. */
      if (!shown && order.same_key) {
        $('payDoneNote').textContent = 'با همان مشخصات قبلی‌تان وارد پنل شوید؛ پلن و اعتبار جدید همان‌جاست.';
        $('payAccessKey').closest('.pay-done__key').hidden = true;
        $('payDoneTitle').textContent = order.kind === 'topup' ? 'پرداخت تأیید شد. اعتبار عکس به پنل شما اضافه شد.' : 'پرداخت تأیید شد. پنل شما تمدید شد.';
        if (sub) sub.hidden = true;
        if (creds) creds.hidden = true;
        if (guide) guide.hidden = true;
      } else if (order.subdomain_url) {
        $('paySubUrl').textContent = order.subdomain_url;
        $('payAdminUrl').textContent = order.subdomain_admin_url || '';
        $('payUser').textContent = order.panel_username || order.slug || '—';
        $('payPass').textContent = pass || '—';
        const pr = $('payPassRow'); if (pr) pr.hidden = !pass;
        if (creds) creds.hidden = false;
        if (guide) guide.hidden = false;
        if (sub) sub.hidden = false;
      }
      const panel = $('payPanelLink'), page = $('payPageLink');
      panel.href = order.panel_url || '/panel';
      page.href = order.page_url || '#';
      panel.hidden = false;
      page.hidden = !order.page_url;
      if (shown && !state.entered) {
        state.entered = true;
        panel.href = '/panel?key=' + encodeURIComponent(shown);
      }
      const act = $('payActivating'), ready = $('payReady');
      show('done');
      if (act && ready && !state.activated && !order.same_key) {
        state.activated = true;
        act.hidden = false; ready.hidden = true;
        setTimeout(() => { act.hidden = true; ready.hidden = false; }, 2100);
      } else if (act && ready) {
        act.hidden = true; ready.hidden = false;
      }
      track('order_paid', order.ref);
      return;
    }
    /* A replaced or cancelled order is over. An expired one is still watched for a late
       webhook (see LATE): the transfer may have been made in time and reported after. */
    if (order.status === 'expired' || order.status === 'cancelled' || order.status === 'reviewing') {
      clearInterval(state.tick);
      const watching = order.status === 'reviewing' || (order.status === 'expired' && Date.now() - Number(order.expires_at || 0) < LATE);
      if (!watching) clearInterval(state.poll);
      /* An order left from the retired receipt step: no clock, it only waits for confirmation. */
      $('payLateTitle').textContent = order.status === 'reviewing' ? 'پرداخت شما خودکار تأیید می‌شود.' : order.status === 'cancelled' ? 'این سفارش بسته شد' : 'مهلت پرداخت تمام شد';
      $('payLateLead').textContent = order.status === 'cancelled' ? 'سفارش تازه‌تری جای این سفارش را گرفته یا لغو شده است. به این سفارش واریز نکنید.' : order.status === 'reviewing' ? 'به‌محض تأیید، همین صفحه پنل شما را باز می‌کند.' : LATE_LEAD;
      $('payAgain').hidden = order.status === 'reviewing';
      show('expired');
      return;
    }
    /* Still open: stay on the live screen. Redraw only when the owner has just saved the
       card, so the warning gives way to the real number. */
    if (view.live.hidden || ($('payCardWarn').hidden !== !!order.card)) draw(order);
  }

  /* ---------- polling: the payment site's webhook flips the status ---------- */
  function poll() {
    clearInterval(state.poll);
    state.poll = setInterval(async () => {
      if (!state.order || state.done) return;
      try {
        const fresh = await call('/api/order/' + state.order.id);
        state.order = fresh;
        drawState(fresh);
      } catch {
        /* A dropped poll is not a failed payment; the next one will catch up. */
      }
    }, 5000);
  }

  /* ---------- wiring ---------- */
  for (const btn of buyButtons) {
    btn.addEventListener('click', e => {
      const key = btn.dataset.buy;
      const open = btn.dataset.state === 'open' && Number(btn.dataset.amount) > 0;
      /* No approved amount yet: the button still says «خرید», so the click must not look
         broken and must not open a checkout that cannot take money. It follows the anchor
         to the note under the panels and says the same thing in the panel itself. */
      if (!open) {
        const note = btn.closest('.plan')?.querySelector('.plan__state');
        if (note) {
          note.textContent = 'مبلغ این پلن هنوز نهایی نشده است؛ به‌محض نهایی‌شدن، همین‌جا نوشته می‌شود. تا آن روز چیزی پرداخت نمی‌کنید.';
          note.hidden = false;
        }
        track('buy_unpriced', key);
        return; // the anchor still carries the visitor to #plan-note
      }
      e.preventDefault();
      /* The chosen plan is remembered here, so the details form below knows what it is for
         even when the customer fills it by hand. */
      state.plan = key;
      state.buy = btn;
      state.service = btn.dataset.service || document.body.dataset.service || '';
      window.__AYN_BUILDER?.();
      section.hidden = false;
      $('payPlan').textContent = headOf(btn.dataset.title, Number(btn.dataset.months)) || (btn.closest('.plan')?.querySelector('h3')?.textContent || '').trim();
      drawUsers();
      $('paySub').textContent = 'کارت‌به‌کارت واریز کنید؛ پرداخت شما خودکار تأیید می‌شود.';
      show('form');
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
      /* Details already typed and consent checked: go straight on, except on «پنل آرایشگاه». */
      if (!seatsOf(btn) && $('paySalon').value.trim() && $('payName').value.trim() && $('payPhone').value.trim() && $('payConsent').checked) open(key);
      else setTimeout(() => {
        const target = !$('paySalon').value.trim() ? $('paySalon')
          : !$('payName').value.trim() ? $('payName')
          : !$('payPhone').value.trim() ? $('payPhone')
          : $('payConsent');
        target?.focus();
      }, 350);
      track('order_intent', key);
    });
  }
  $('payForm').addEventListener('submit', e => {
    e.preventDefault();
    if (state.plan) open(state.plan);
  });

  $('payAmountCopy')?.addEventListener('click', async () => {
    if (!state.order?.amount) return;
    try {
      await navigator.clipboard.writeText(String(state.order.amount));
      $('payAmountCopy').textContent = 'کپی شد';
      setTimeout(() => ($('payAmountCopy').textContent = 'کپی مبلغ'), 1800);
    } catch {}
  });
  $('payCouponToggle')?.addEventListener('click', () => {
    const form = $('payCoupon'), openNow = form.hidden;
    form.hidden = !openNow;
    $('payCouponToggle').setAttribute('aria-expanded', String(openNow));
    if (openNow) $('payCouponCode')?.focus();
  });
  $('payCopy').addEventListener('click', async () => {
    if (!state.order?.card) return;
    try {
      await navigator.clipboard.writeText(state.order.card);
      $('payCopy').textContent = 'کپی شد';
      setTimeout(() => ($('payCopy').textContent = 'کپی'), 1800);
    } catch {
      err($('payErr'), 'کپی نشد؛ شماره را دستی بردارید.');
    }
  });
  $('payKeyCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('payAccessKey').textContent);
      $('payKeyCopy').textContent = 'کپی شد';
      setTimeout(() => ($('payKeyCopy').textContent = 'کپی کلید'), 1800);
    } catch {}
  });
  section.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const t = $(btn.dataset.copy)?.textContent?.trim();
    if (!t || t === '—') return;
    try {
      await navigator.clipboard.writeText(t);
      btn.textContent = 'کپی شد';
      setTimeout(() => (btn.textContent = 'کپی'), 1600);
    } catch {}
  }));
  $('payCredsCopy')?.addEventListener('click', async () => {
    const lines = [
      'لینک اختصاصی سالن شما: ' + ($('paySubUrl')?.textContent || ''),
      'لینک اختصاصی مدیریت: ' + ($('payAdminUrl')?.textContent || ''),
      'نام کاربری: ' + ($('payUser')?.textContent || ''),
      ...($('payPassRow')?.hidden ? [] : ['رمز عبور: ' + ($('payPass')?.textContent || '')]),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(lines);
      $('payCredsCopy').textContent = 'همهٔ مشخصات کپی شد';
      setTimeout(() => ($('payCredsCopy').textContent = 'کپی همهٔ مشخصات'), 2000);
    } catch {}
  });

  $('payCoupon').addEventListener('submit', async e => {
    e.preventDefault();
    err($('payCouponErr'), '');
    if (!state.order) return;
    try {
      const fresh = await call('/api/order/' + state.order.id + '/coupon', {coupon: $('payCouponCode').value.trim()});
      state.order = fresh;
      draw(fresh);
      if (!fresh.discount) err($('payCouponErr'), 'این کد معتبر نیست یا استفاده شده است.');
      else err($('payCouponErr'), '');
    } catch (e2) {
      err($('payCouponErr'), e2.message);
    }
  });

  $('payAgain').addEventListener('click', () => {
    state.order = null;
    clearInterval(state.poll);
    show('form');
    section.scrollIntoView({behavior: 'smooth', block: 'start'});
  });

  /* Coming back: ?order= (a top-up from the panel, or a shared link) or the order this
     browser opened earlier. The key is only ever restored from this browser's own store. */
  const kept = recall();
  const wanted = new URLSearchParams(location.search).get('order') || (kept && Date.now() - kept.at < 7 * 86400000 ? kept.id : '');
  if (wanted) {
    call('/api/order/' + encodeURIComponent(wanted))
      .then(order => {
        /* An expired order this browser opened is shown again only while a late payment can
           still arrive (LATE); after that the visitor simply starts over. */
        const asked = !!new URLSearchParams(location.search).get('order');
        if (order.status === 'cancelled' || (order.status === 'expired' && !asked && Date.now() - Number(order.expires_at) > LATE)) return;
        state.order = order;
        if (kept && kept.id === order.id && kept.key) state.key = kept.key;
        if (kept && kept.id === order.id && kept.pass) state.pass = kept.pass;
        if (order.status === 'paid') state.activated = true;
        draw(order);
        if (order.status !== 'open') drawState(order);
        /* Arriving with ?order= (a top-up from the panel, a shared link) means the checkout is
           the point of the visit: take the reader straight to it. */
        if (new URLSearchParams(location.search).get('order')) requestAnimationFrame(() => section.scrollIntoView({block: 'start'}));
      })
      .catch(() => {});
  }
  syncPlans();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.order && !state.done) call('/api/order/' + state.order.id).then(o => {state.order = o; drawState(o)}).catch(() => {});
  });
})();
