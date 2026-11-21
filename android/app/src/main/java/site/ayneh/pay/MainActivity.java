package site.ayneh.pay;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.text.InputFilter;
import android.text.InputType;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/** One screen: connect with the 6-digit code, grant three permissions, then watch deposits. */
public class MainActivity extends Activity {
    private static final int INK = 0xFF0A202A, SOFT = 0xFF4A5C5C, MUTED = 0xFF5D6B68, LINE = 0xFFEDE0D2;
    private static final int EMERALD = 0xFF068F6C, EMERALD_DEEP = 0xFF0A6B54, WASH = 0xFFE4F4EE, CREAM = 0xFFFCF3EB;
    private static final int REQ_PERMS = 11;

    private LinearLayout root;
    private String pairError = "", typed = "";
    private boolean busy = false;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        Sender.ensureChannel(this);
        ScrollView scroll = new ScrollView(this);
        scroll.setFillViewport(true);
        scroll.setBackgroundColor(CREAM);
        scroll.setFitsSystemWindows(true);
        root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        root.setPadding(dp(18), dp(18), dp(18), dp(28));
        scroll.addView(root, new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT));
        setContentView(scroll);
    }

    @Override
    protected void onResume() {
        super.onResume();
        Store.setListener(this::render);
        render();
        if (Store.paired(this)) { Sender.schedule(this); refreshConfig(); }
    }

    /** Picks up cards added in /admin (their bank SMS numbers) and notices a rotated token. */
    private void refreshConfig() {
        new Thread(() -> {
            try {
                Api.Result r = Api.post(Store.origin(this) + "/api/pay/ping", Store.key(this), new JSONObject());
                if (r.code == 401) Store.setAuthFailed(getApplicationContext(), true);
                else if (r.ok()) {
                    Store.setSenders(getApplicationContext(), r.body.optJSONArray("senders"));
                    if (Store.authFailed(this)) Store.setAuthFailed(getApplicationContext(), false);
                }
            } catch (Exception ignored) { }
        }).start();
    }

    @Override
    protected void onPause() {
        Store.setListener(null);
        super.onPause();
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        super.onRequestPermissionsResult(code, perms, results);
        render();
    }

    /* ---------------- screens ---------------- */

    private void render() {
        root.removeAllViews();
        header();
        if (!Store.paired(this)) { pairScreen(); return; }
        if (Store.authFailed(this)) authCard();
        boolean sms = has(Manifest.permission.RECEIVE_SMS);
        boolean notes = Build.VERSION.SDK_INT < 33 || has("android.permission.POST_NOTIFICATIONS");
        boolean battery = batteryFree();
        if (!sms || !notes || !battery) permissionsCard(sms, notes, battery);
        statusCard(sms && battery);
        listCard();
        footer();
    }

    private void header() {
        LinearLayout row = hbox();
        row.setGravity(Gravity.CENTER_VERTICAL);
        TextView logo = text("آ", 26, Color.WHITE, true);
        logo.setGravity(Gravity.CENTER);
        logo.setBackground(round(EMERALD, 16, 0));
        row.addView(logo, new LinearLayout.LayoutParams(dp(52), dp(52)));
        LinearLayout titles = vbox();
        titles.setPadding(dp(12), 0, dp(12), 0);
        titles.addView(text("آینه‌پی", 24, INK, true));
        titles.addView(text("تأیید خودکار واریزهای کارت به کارت آینه", 13, MUTED, false));
        row.addView(titles);
        root.addView(row, matchWrap(0, 0, 0, dp(16)));
    }

    private void pairScreen() {
        LinearLayout c = card();
        c.addView(text("اتصال به سایت آینه", 19, INK, true));
        c.addView(spaced(text("در پنل مدیر سایت (ayneh-salon.site/admin) به بخش «پرداخت و پنل» بروید و «ساخت کد اتصال اپ» را بزنید. کد ۶ رقمی را این‌جا بنویسید.", 14, SOFT, false), 8));
        final EditText code = new EditText(this);
        code.setInputType(InputType.TYPE_CLASS_NUMBER);
        code.setFilters(new InputFilter[]{new InputFilter.LengthFilter(6)});
        code.setGravity(Gravity.CENTER);
        code.setTextSize(TypedValue.COMPLEX_UNIT_SP, 30);
        code.setLetterSpacing(0.35f);
        code.setTextColor(INK);
        code.setHint("••••••");
        code.setTextDirection(View.TEXT_DIRECTION_LTR);
        code.setText(typed);
        code.setBackground(round(CREAM, 16, LINE));
        code.setPadding(dp(12), dp(14), dp(12), dp(14));
        c.addView(code, matchWrap(0, dp(16), 0, 0));
        if (!pairError.isEmpty()) c.addView(spaced(text(pairError, 13, 0xFFB42318, true), 10));
        TextView go = button(busy ? "در حال اتصال…" : "وصل شو", true);
        go.setOnClickListener(v -> { typed = code.getText().toString().trim(); connect(typed); });
        c.addView(go, matchWrap(0, dp(16), 0, 0));
        root.addView(c, matchWrap(0, 0, 0, dp(14)));
    }

    private void authCard() {
        LinearLayout c = card();
        c.setBackground(round(0xFFFDE8E8, 22, 0xFFF5C2C0));
        c.addView(text("اتصال اپ باطل شده", 17, 0xFFB42318, true));
        c.addView(spaced(text("توکن پرداخت در سایت عوض شده است. یک کد اتصال تازه از پنل مدیر بگیرید؛ واریزهای در صف بعد از اتصال فرستاده می‌شوند.", 13, SOFT, false), 6));
        TextView b = button("اتصال دوباره", true);
        b.setOnClickListener(v -> { Store.unpair(this); render(); });
        c.addView(b, matchWrap(0, dp(12), 0, 0));
        root.addView(c, matchWrap(0, 0, 0, dp(14)));
    }

    private void permissionsCard(boolean sms, boolean notes, boolean battery) {
        LinearLayout c = card();
        c.addView(text("سه اجازه، فقط یک بار", 18, INK, true));
        c.addView(spaced(text("روی هر «اجازه بده» بزنید و در پنجرهٔ اندروید «Allow / اجازه» را انتخاب کنید.", 13, MUTED, false), 4));
        c.addView(permRow("خواندن پیامک‌های واریز", "فقط پیامک‌های واریز بانک کارت‌های شما به سایت آینه فرستاده می‌شوند.", sms,
                v -> ask(Manifest.permission.RECEIVE_SMS)));
        if (Build.VERSION.SDK_INT >= 33)
            c.addView(permRow("اعلان‌ها", "با هر واریز تأییدشده خبرتان می‌کند.", notes,
                    v -> ask("android.permission.POST_NOTIFICATIONS")));
        if (!sms && Store.askedBefore(this, Manifest.permission.RECEIVE_SMS))
            c.addView(spaced(text("اگر پنجرهٔ اجازه باز نشد: در صفحهٔ تنظیمات اپ، منوی ⋮ بالا ← «Allow restricted settings»، بعد «Permissions» ← «SMS» ← Allow.", 12, 0xFFA35A00, false), 12));
        c.addView(permRow("همیشه روشن (باتری)", "تا اندروید اپ را در پس‌زمینه نبندد.", battery, v -> askBattery()));
        root.addView(c, matchWrap(0, 0, 0, dp(14)));
    }

    private View permRow(String title, String sub, boolean done, View.OnClickListener ask) {
        LinearLayout row = hbox();
        row.setGravity(Gravity.CENTER_VERTICAL);
        row.setPadding(0, dp(14), 0, 0);
        TextView mark = text(done ? "✓" : "•", 18, done ? Color.WHITE : MUTED, true);
        mark.setGravity(Gravity.CENTER);
        mark.setBackground(round(done ? EMERALD : 0xFFEEF0EF, 99, 0));
        row.addView(mark, new LinearLayout.LayoutParams(dp(34), dp(34)));
        LinearLayout t = vbox();
        t.setPadding(dp(12), 0, dp(8), 0);
        t.addView(text(title, 15, INK, true));
        t.addView(text(sub, 12, MUTED, false));
        row.addView(t, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        if (!done) {
            TextView b = button("اجازه بده", true);
            b.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14);
            b.setPadding(dp(16), dp(9), dp(16), dp(9));
            b.setOnClickListener(ask);
            row.addView(b);
        }
        return row;
    }

    private void statusCard(boolean ready) {
        List<JSONObject> list = Store.entries(this);
        long todaySum = 0; int todayCount = 0, pending = 0;
        for (JSONObject e : list) {
            if ("paid".equals(e.optString("status")) && Fa.today(e.optLong("at"))) { todayCount++; todaySum += e.optLong("amount") / 10; }
            if ("pending".equals(e.optString("status"))) pending++;
        }
        LinearLayout c = card();
        LinearLayout row = hbox();
        row.setGravity(Gravity.CENTER_VERTICAL);
        View dot = new View(this);
        dot.setBackground(round(ready ? EMERALD : 0xFFE08A00, 99, 0));
        row.addView(dot, new LinearLayout.LayoutParams(dp(12), dp(12)));
        TextView st = text(ready ? "آماده است؛ واریزها خودکار تأیید می‌شوند" : "برای شروع، اجازه‌های بالا را بدهید", 15, INK, true);
        st.setPadding(dp(10), 0, 0, 0);
        row.addView(st);
        c.addView(row);
        LinearLayout stats = hbox();
        stats.setPadding(0, dp(14), 0, 0);
        stats.addView(stat("واریز تأییدشدهٔ امروز", Fa.digits(String.valueOf(todayCount))), new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        View gap = new View(this);
        stats.addView(gap, new LinearLayout.LayoutParams(dp(10), 1));
        stats.addView(stat("جمع امروز (تومان)", Fa.money(todaySum)), new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        c.addView(stats);
        if (pending > 0) {
            c.addView(spaced(text(Fa.digits(String.valueOf(pending)) + " واریز منتظر اینترنت است و خودش فرستاده می‌شود.", 13, SOFT, false), 12));
            TextView now = button("ارسال همین حالا", false);
            now.setOnClickListener(v -> new Thread(() -> { Sender.flush(getApplicationContext()); Store.changed(); }).start());
            c.addView(now, matchWrap(0, dp(10), 0, 0));
        }
        root.addView(c, matchWrap(0, 0, 0, dp(14)));
    }

    private View stat(String label, String value) {
        LinearLayout b = vbox();
        b.setBackground(round(WASH, 16, 0));
        b.setPadding(dp(14), dp(12), dp(14), dp(12));
        b.addView(text(value, 20, EMERALD_DEEP, true));
        b.addView(text(label, 12, SOFT, false));
        return b;
    }

    private void listCard() {
        List<JSONObject> list = Store.entries(this);
        root.addView(spaced(text("واریزها", 18, INK, true), 4), matchWrap(dp(4), 0, dp(4), dp(8)));
        if (list.isEmpty()) {
            LinearLayout c = card();
            c.addView(text("هنوز واریزی نیامده. اولین پیامک واریز این‌جا دیده می‌شود.", 14, MUTED, false));
            root.addView(c, matchWrap(0, 0, 0, dp(14)));
            return;
        }
        for (JSONObject e : list) root.addView(entryCard(e), matchWrap(0, 0, 0, dp(10)));
    }

    private View entryCard(JSONObject e) {
        String s = e.optString("status");
        LinearLayout c = card();
        LinearLayout top = hbox();
        top.setGravity(Gravity.CENTER_VERTICAL);
        long rial = e.optLong("amount");
        TextView amount = text(rial > 0 ? Fa.money(rial / 10) + " تومان" : "مبلغ نامشخص", 19, INK, true);
        top.addView(amount, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        top.addView(chip(s));
        c.addView(top);
        c.addView(spaced(text(Fa.when(e.optLong("at")), 12, MUTED, false), 4));
        String detail;
        switch (s) {
            case "paid": {
                List<String> parts = new ArrayList<>();
                if (!e.optString("name").isEmpty()) parts.add(e.optString("name"));
                if (!e.optString("label").isEmpty()) parts.add(e.optString("label"));
                if (!e.optString("ref").isEmpty()) parts.add("کد " + e.optString("ref"));
                detail = parts.isEmpty() ? "سفارش خودکار باز شد." : String.join(" · ", parts);
                break;
            }
            case "none": detail = "سفارش بازی با این مبلغ نبود. اگر پول مشتری است، در پنل مدیر بررسی کنید."; break;
            case "many": detail = "این مبلغ با چند سفارش یکی بود؛ در پنل مدیر تأیید کنید."; break;
            case "closed": detail = e.optString("msg") + (e.optString("ref").isEmpty() ? "" : " · کد " + e.optString("ref")); break;
            case "duplicate": detail = "این پیامک قبلاً ثبت شده بود."; break;
            case "ignored": detail = "پیامک واریز نبود."; break;
            case "error": detail = e.optString("msg"); break;
            default: detail = "منتظر اینترنت؛ خودش فرستاده می‌شود.";
        }
        c.addView(spaced(text(detail, 13, SOFT, false), 6));
        return c;
    }

    private View chip(String s) {
        String label; int fg, bg;
        switch (s) {
            case "paid": label = "تأیید شد"; fg = EMERALD_DEEP; bg = WASH; break;
            case "none": label = "سفارشی پیدا نشد"; fg = 0xFFA35A00; bg = 0xFFFFF1E0; break;
            case "many": label = "نیاز به بررسی"; fg = 0xFFA35A00; bg = 0xFFFFF1E0; break;
            case "closed": label = "تأیید نشد"; fg = 0xFFB42318; bg = 0xFFFDE8E8; break;
            case "error": label = "خطا"; fg = 0xFFB42318; bg = 0xFFFDE8E8; break;
            case "duplicate": label = "تکراری"; fg = SOFT; bg = 0xFFEEF0EF; break;
            case "ignored": label = "واریز نبود"; fg = SOFT; bg = 0xFFEEF0EF; break;
            default: label = "در صف ارسال"; fg = SOFT; bg = 0xFFEEF0EF;
        }
        TextView t = text(label, 12, fg, true);
        t.setBackground(round(bg, 99, 0));
        t.setPadding(dp(12), dp(5), dp(12), dp(5));
        return t;
    }

    private void footer() {
        LinearLayout row = hbox();
        row.setGravity(Gravity.CENTER);
        TextView check = button("بررسی اتصال", false);
        check.setOnClickListener(v -> ping());
        TextView off = button("قطع اتصال", false);
        off.setOnClickListener(v -> new AlertDialog.Builder(this)
                .setMessage("اتصال این گوشی به سایت آینه قطع شود؟ بعد از قطع، واریزها خودکار تأیید نمی‌شوند.")
                .setPositiveButton("قطع کن", (d, w) -> { Store.unpair(this); render(); })
                .setNegativeButton("نه", null).show());
        row.addView(check, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        View gap = new View(this);
        row.addView(gap, new LinearLayout.LayoutParams(dp(10), 1));
        row.addView(off, new LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f));
        root.addView(row, matchWrap(0, dp(8), 0, 0));
    }

    /* ---------------- actions ---------------- */

    private void connect(String code) {
        if (busy) return;
        if (!code.matches("\\d{6}")) { pairError = "کد ۶ رقمی را کامل بنویسید."; render(); return; }
        busy = true; pairError = ""; render();
        new Thread(() -> {
            String err = "";
            try {
                Api.Result r = Api.post(Api.DEFAULT_ORIGIN + "/api/pay/pair", null, new JSONObject().put("code", code));
                if (r.ok() && !r.body.optString("key").isEmpty()) {
                    String origin = r.body.optString("origin", Api.DEFAULT_ORIGIN);
                    Store.setSenders(getApplicationContext(), r.body.optJSONArray("senders"));
                    Store.pair(getApplicationContext(), origin.isEmpty() ? Api.DEFAULT_ORIGIN : origin, r.body.optString("key"));
                } else err = r.error();
            } catch (Exception ex) { err = "به اینترنت وصل نیستید یا سایت در دسترس نیست."; }
            final String e = err;
            runOnUiThread(() -> {
                busy = false; pairError = e;
                render();
                if (e.isEmpty()) {
                    Sender.schedule(this);
                    List<String> ask = new ArrayList<>();
                    if (!has(Manifest.permission.RECEIVE_SMS)) ask.add(Manifest.permission.RECEIVE_SMS);
                    if (Build.VERSION.SDK_INT >= 33 && !has("android.permission.POST_NOTIFICATIONS")) ask.add("android.permission.POST_NOTIFICATIONS");
                    for (String p : ask) Store.markAsked(this, p);
                    if (!ask.isEmpty()) requestPermissions(ask.toArray(new String[0]), REQ_PERMS);
                }
            });
        }).start();
    }

    private void ping() {
        new Thread(() -> {
            String msg;
            try {
                Api.Result r = Api.post(Store.origin(this) + "/api/pay/ping", Store.key(this), new JSONObject());
                if (r.code == 401) { Store.setAuthFailed(getApplicationContext(), true); msg = r.error(); }
                else if (r.ok()) {
                    Store.setAuthFailed(getApplicationContext(), false);
                    Store.setSenders(getApplicationContext(), r.body.optJSONArray("senders"));
                    msg = r.body.optBoolean("card") ? "اتصال سالم است ✓" : "اتصال سالم است، ولی شمارهٔ کارت در پنل مدیر ثبت نشده.";
                } else msg = r.error();
            } catch (Exception ex) { msg = "به اینترنت وصل نیستید یا سایت در دسترس نیست."; }
            final String m = msg;
            runOnUiThread(() -> Toast.makeText(this, m, Toast.LENGTH_LONG).show());
        }).start();
    }

    /** First time: Android's own dialog. After a refusal Android stops showing it, so open the app's settings. */
    private void ask(String perm) {
        if (Store.askedBefore(this, perm) && !shouldShowRequestPermissionRationale(perm)) {
            try {
                startActivity(new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + getPackageName())));
                return;
            } catch (Exception ignored) { }
        }
        Store.markAsked(this, perm);
        requestPermissions(new String[]{perm}, REQ_PERMS);
    }

    private void askBattery() {
        try {
            Intent i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + getPackageName()));
            startActivity(i);
        } catch (Exception e) {
            try { startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS)); } catch (Exception ignored) { }
        }
    }

    private boolean batteryFree() {
        PowerManager pm = (PowerManager) getSystemService(POWER_SERVICE);
        return pm == null || pm.isIgnoringBatteryOptimizations(getPackageName());
    }

    private boolean has(String perm) { return checkSelfPermission(perm) == PackageManager.PERMISSION_GRANTED; }

    /* ---------------- tiny view kit ---------------- */

    private int dp(int v) { return Math.round(v * getResources().getDisplayMetrics().density); }

    private GradientDrawable round(int color, int radiusDp, int stroke) {
        GradientDrawable g = new GradientDrawable();
        g.setColor(color);
        g.setCornerRadius(dp(radiusDp));
        if (stroke != 0) g.setStroke(dp(1), stroke);
        return g;
    }

    private TextView text(String s, int sp, int color, boolean bold) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        t.setTextColor(color);
        t.setLineSpacing(0, 1.25f);
        t.setTextDirection(View.TEXT_DIRECTION_RTL);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        return t;
    }

    private TextView button(String s, boolean primary) {
        TextView b = text(s, 16, primary ? Color.WHITE : EMERALD_DEEP, true);
        b.setGravity(Gravity.CENTER);
        b.setPadding(dp(18), dp(14), dp(18), dp(14));
        b.setBackground(round(primary ? EMERALD : Color.WHITE, 99, primary ? 0 : 0xFFBFE3D6));
        b.setClickable(true);
        b.setFocusable(true);
        if (primary) b.setElevation(dp(3));
        return b;
    }

    private LinearLayout card() {
        LinearLayout c = vbox();
        c.setBackground(round(Color.WHITE, 22, LINE));
        c.setPadding(dp(18), dp(16), dp(18), dp(16));
        c.setElevation(dp(1));
        return c;
    }

    private LinearLayout vbox() {
        LinearLayout l = new LinearLayout(this);
        l.setOrientation(LinearLayout.VERTICAL);
        return l;
    }

    private LinearLayout hbox() {
        LinearLayout l = new LinearLayout(this);
        l.setOrientation(LinearLayout.HORIZONTAL);
        return l;
    }

    private View spaced(View v, int topDp) {
        v.setPadding(v.getPaddingLeft(), v.getPaddingTop() + dp(topDp), v.getPaddingRight(), v.getPaddingBottom());
        return v;
    }

    private LinearLayout.LayoutParams matchWrap(int l, int t, int r, int b) {
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT);
        p.setMargins(l, t, r, b);
        return p;
    }
}
