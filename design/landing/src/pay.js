/* Checkout: plan panel → bank transfer → a 10-minute countdown → confirmation.
 *
 * Everything that matters (amount, card, deadline, access key) comes from the server. The
 * page only draws what it is told: POST /api/order opens an order, GET /api/order/<id>
 * reports its state, and the timer is a local echo of expires_at, never the authority.
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

  const state = {order: null, plan: null, poll: null, tick: null, done: false, key: '', entered: false};
  const view = {
    form: $('payForm'), live: $('payLive'), wait: $('payWait'), done: $('payDone'), expired: $('payExpired'),
  };

  /* ---------- what each plan may do right now ---------- */
  const planOf = key => document.querySelector('.plan[data-plan="' + key + '"]');
  const buyButtons = [...document.querySelectorAll('[data-buy]')];
  function syncPlans() {
    for (const btn of buyButtons) {
      const key = btn.dataset.buy;
      const open = btn.dataset.state === 'open' && Number(btn.dataset.amount) > 0;
      const card = planOf(key);
      if (card) card.dataset.open = String(open);
      /* Not aria-disabled: an unpriced button still works, it opens the demo form. */
      btn.setAttribute('aria-disabled', 'false');
      /* The panel already says the amount is being finalized (build.py fills it), so the
         note stays empty here and only speaks up if the visitor clicks the buy button. */
      const note = document.querySelector('.plan__state[data-for="' + key + '"]');
      if (note && !open) note.hidden = true;
    }
  }

  /* ---------- step 1 → 2: open the order on the server ---------- */
  async function open(plan) {
    state.plan = plan;
    err($('payErr'), '');
    const body = {
      plan,
      salon: $('paySalon').value.trim(),
      name: $('payName').value.trim(),
      phone: $('payPhone').value.trim(),
      city: $('payCity').value.trim(),
      consent: $('payConsent').checked,
    };
    if (body.salon.length < 2) return err($('payErr'), 'نام سالن را بنویسید.');
    if (body.name.length < 2) return err($('payErr'), 'نام و نام خانوادگی را بنویسید.');
    if (!body.consent) return err($('payErr'), 'برای هماهنگی راه‌اندازی، تأیید تماس لازم است.');
    $('payStart').disabled = true;
    try {
      const order = await call('/api/order', body);
      state.order = order;
      /* The server hands the panel key out exactly once, here. Keep it in memory so the
         done screen can repeat it after the customer has paid; it is never stored. */
      if (order.access_key) state.key = order.access_key;
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
  }

  function draw(order) {
    state.done = false;
    section.hidden = false;
    $('payPlan').textContent = order.plan_name || '';
    $('payAmount').textContent = fa(order.amount);
    $('payDiscount').hidden = !order.discount;
    if (order.discount) $('payDiscount').textContent = 'با تخفیف ' + money(order.discount);
    $('payRef').textContent = order.ref;
    $('payWaitRef').textContent = order.ref;
    $('payCard').textContent = order.card ? group(order.card) : '•••• •••• •••• ••••';
    $('payCardOwner').textContent = order.card_owner || 'صاحب حساب: —';
    $('payCardWarn').hidden = !!order.card;
    $('payCopy').disabled = !order.card;
    /* The key is shown here (twice at most: now and on the done screen) and nowhere else. */
    $('payKeyBox').hidden = !state.key;
    $('payKey').textContent = state.key || '—';
    $('payKeyLost').hidden = !!state.key;
    /* The countdown is driven by expires_at, so a reload or a slow phone cannot extend it. */
    clearInterval(state.tick);
    const end = Number(order.expires_at);
    $('payWaitPct').textContent = '';
    const total = Math.max(1, end - Number(order.created_at));
    const tick = () => {
      const left = end - Date.now();
      if (left <= 0) {
        clearInterval(state.tick);
        if (!state.done) drawState({status: 'expired'});
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
      $('payAccessKey').textContent = shown || '—';
      $('payKeyCopy').hidden = !shown;
      $('payDoneNote').hidden = !!shown;
      const panel = $('payPanelLink'), page = $('payPageLink');
      panel.href = order.panel_url || '/panel';
      page.href = order.page_url || '#';
      panel.hidden = false;
      page.hidden = !order.page_url;
      /* The last step has to actually finish: the customer is standing on this page and
         holds the key in memory, so open her panel door here instead of making her type
         the key she just copied. The key is still in the URL for the panel to trade for
         its cookie, then it is scrubbed from the address bar. */
      if (shown && !state.entered) {
        state.entered = true;
        panel.href = '/panel?key=' + encodeURIComponent(shown);
        panel.textContent = 'باز کردن پنل من';
      }
      show('done');
      track('order_paid', order.ref);
      return;
    }
    if (order.status === 'expired' || order.status === 'cancelled') {
      clearInterval(state.tick);
      clearInterval(state.poll);
      show('expired');
      return;
    }
    if (order.status === 'reviewing') {
      $('payWaitText').textContent = 'رسید شما ثبت شد و در حال بررسی است. به‌محض تأیید، همین صفحه پنل و لینک اختصاصی را نشان می‌دهد.';
      $('payWait').querySelector('h3').textContent = 'در انتظار تأیید';
    }
    show('wait');
    const pct = Math.max(0, Math.min(100, (Date.now() - Number(order.created_at)) / Math.max(1, Number(order.expires_at) - Number(order.created_at)) * 100));
    $('payWaitPct').textContent = fa(Math.round(pct)) + '٪';
  }

  /* ---------- polling: the owner console or the payment site flips the status ---------- */
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
        const note = document.querySelector('.plan__state[data-for="' + key + '"]');
        if (note) {
          note.textContent = 'مبلغ این پنل هنوز نهایی نشده است؛ به‌محض نهایی‌شدن، همین‌جا و در فهرست پایین پنل‌ها نوشته می‌شود. تا آن روز چیزی پرداخت نمی‌کنید.';
          note.hidden = false;
        }
        track('buy_unpriced', key);
        return; // the anchor still carries the visitor to #plan-note
      }
      e.preventDefault();
      /* The chosen plan is remembered here, so the details form below knows what it is for
         even when the customer fills it by hand. */
      state.plan = key;
      section.hidden = false;
      $('payPlan').textContent = (planOf(key)?.querySelector('h3')?.textContent || '').trim();
      $('paySub').textContent = 'مقصد پرداخت: پنل ' + $('payPlan').textContent + '. مبلغ را کارت‌به‌کارت واریز کنید؛ مهلت با شمارش معکوس پایین می‌آید.';
      show('form');
      section.scrollIntoView({behavior: 'smooth', block: 'start'});
      if ($('paySalon').value.trim() && $('payName').value.trim() && $('payPhone').value.trim()) open(key);
      else setTimeout(() => $('paySalon').focus(), 350);
      track('order_intent', key);
    });
  }
  $('payForm').addEventListener('submit', e => {
    e.preventDefault();
    if (state.plan) open(state.plan);
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
  const copyKey = async (btn, label) => {
    try {
      await navigator.clipboard.writeText(state.key || $('payAccessKey').textContent);
      btn.textContent = 'کپی شد';
      setTimeout(() => (btn.textContent = label), 1800);
    } catch {}
  };
  $('payKeyKeep').addEventListener('click', () => copyKey($('payKeyKeep'), 'کپی کلید'));
  $('payKeyCopy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('payAccessKey').textContent);
      $('payKeyCopy').textContent = 'کپی شد';
      setTimeout(() => ($('payKeyCopy').textContent = 'کپی کلید'), 1800);
    } catch {}
  });

  $('payReceipt').addEventListener('submit', async e => {
    e.preventDefault();
    if (!state.order) return;
    err($('payReceiptErr'), '');
    $('paySent').disabled = true;
    try {
      const fresh = await call('/api/order/' + state.order.id + '/receipt', {note: $('payReceiptNote').value.trim()});
      state.order = fresh;
      track('order_receipt', state.order.ref);
      drawState(fresh);
    } catch (e2) {
      err($('payReceiptErr'), e2.message);
    } finally {
      $('paySent').disabled = false;
    }
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

  $('payCheck').addEventListener('click', async () => {
    if (!state.order) return;
    try {
      const fresh = await call('/api/order/' + state.order.id);
      state.order = fresh;
      drawState(fresh);
    } catch (e) {
      err($('payWaitText'), e.message);
    }
  });
  $('payAgain').addEventListener('click', () => {
    state.order = null;
    $('payReceiptNote').value = '';
    $('payReceiptErr').hidden = true;
    show('form');
    section.scrollIntoView({behavior: 'smooth', block: 'start'});
  });

  /* Coming back from a refresh with ?order= reopens the same order (the phone's link). */
  const wanted = new URLSearchParams(location.search).get('order');
  if (wanted) {
    call('/api/order/' + encodeURIComponent(wanted))
      .then(order => {
        state.order = order;
        if (order.access_key) state.key = order.access_key;
        draw(order);
        if (order.status === 'reviewing' || order.status === 'paid' || order.status === 'expired') drawState(order);
      })
      .catch(() => {});
  }
  syncPlans();
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.order && !state.done) call('/api/order/' + state.order.id).then(o => {state.order = o; drawState(o)}).catch(() => {});
  });
})();
