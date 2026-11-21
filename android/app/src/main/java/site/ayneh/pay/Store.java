package site.ayneh.pay;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/** Pairing (site address + payment token) and the local list of forwarded deposits. */
final class Store {
    private static final String PREFS = "aynehpay";
    private static final int MAX = 300;
    static final String BLU_NUMBER = "9999987641";

    private static Runnable listener;
    private static final Handler MAIN = new Handler(Looper.getMainLooper());

    static void setListener(Runnable r) { listener = r; }

    static void changed() {
        final Runnable r = listener;
        if (r != null) MAIN.post(r);
    }

    private static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static String origin(Context c) { return prefs(c).getString("origin", ""); }
    static String key(Context c) { return prefs(c).getString("key", ""); }
    static boolean paired(Context c) { return !key(c).isEmpty() && !origin(c).isEmpty(); }

    static void pair(Context c, String origin, String key) {
        prefs(c).edit().putString("origin", origin).putString("key", key).putBoolean("auth_failed", false).apply();
        changed();
    }

    static void unpair(Context c) {
        prefs(c).edit().remove("origin").remove("key").apply();
        changed();
    }

    static boolean authFailed(Context c) { return prefs(c).getBoolean("auth_failed", false); }
    static void setAuthFailed(Context c, boolean v) { prefs(c).edit().putBoolean("auth_failed", v).apply(); changed(); }

    /** Is this SMS a Blu deposit? Only Blu's own sender number counts: the text alone proves
     *  nothing, since anyone can text «واریز … ریال» to this phone. */
    static boolean isDeposit(Context c, String sender, String body) {
        String digits = sender == null ? "" : sender.replaceAll("\\D", "");
        if (digits.isEmpty() || body == null || !(body.contains("واریز") || body.contains("نشست"))) return false;
        for (String s : senders(c)) if (!s.isEmpty() && digits.endsWith(s)) return true;
        return false;
    }

    /** The bank SMS numbers of the owner's cards (from /admin); Blu until the site says otherwise. */
    static String[] senders(Context c) {
        String v = prefs(c).getString("senders", BLU_NUMBER);
        return v.isEmpty() ? new String[]{BLU_NUMBER} : v.split(",");
    }

    static void setSenders(Context c, org.json.JSONArray a) {
        if (a == null || a.length() == 0) return;
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < a.length(); i++) {
            String s = a.optString(i, "").replaceAll("\\D", "");
            if (s.length() >= 4) { if (b.length() > 0) b.append(','); b.append(s); }
        }
        if (b.length() > 0) prefs(c).edit().putString("senders", b.toString()).apply();
    }

    /** A permission asked once and still refused is only grantable from the app's settings. */
    static boolean askedBefore(Context c, String perm) { return prefs(c).getBoolean("asked:" + perm, false); }
    static void markAsked(Context c, String perm) { prefs(c).edit().putBoolean("asked:" + perm, true).apply(); }

    /** The deposited amount in rials, for display only (the server decides for itself). */
    static long amountOf(String body) {
        if (body == null) return 0;
        String t = toLatin(body).replace('٬', ',');
        int cut = t.indexOf("موجودی");
        if (cut > 0) t = t.substring(0, cut);
        Matcher m = Pattern.compile("(\\d{1,3}(?:,\\d{3})+|\\d{4,})\\s*ریال").matcher(t);
        if (!m.find()) return 0;
        try { return Long.parseLong(m.group(1).replace(",", "")); } catch (NumberFormatException e) { return 0; }
    }

    static String toLatin(String s) {
        StringBuilder b = new StringBuilder(s.length());
        for (char ch : s.toCharArray()) {
            if (ch >= '۰' && ch <= '۹') b.append((char) ('0' + (ch - '۰')));
            else if (ch >= '٠' && ch <= '٩') b.append((char) ('0' + (ch - '٠')));
            else b.append(ch);
        }
        return b.toString();
    }

    static synchronized List<JSONObject> entries(Context c) {
        List<JSONObject> out = new ArrayList<>();
        try {
            JSONArray a = new JSONArray(prefs(c).getString("entries", "[]"));
            for (int i = 0; i < a.length(); i++) out.add(a.getJSONObject(i));
        } catch (JSONException ignored) { }
        return out;
    }

    private static synchronized void save(Context c, List<JSONObject> list) {
        JSONArray a = new JSONArray();
        for (int i = 0; i < list.size() && i < MAX; i++) a.put(list.get(i));
        prefs(c).edit().putString("entries", a.toString()).apply();
        changed();
    }

    static synchronized void add(Context c, String text, long at) {
        List<JSONObject> list = entries(c);
        JSONObject e = new JSONObject();
        try {
            e.put("id", UUID.randomUUID().toString());
            e.put("text", text);
            e.put("at", at);
            e.put("amount", amountOf(text));
            e.put("status", "pending");
        } catch (JSONException ignored) { }
        list.add(0, e);
        save(c, list);
    }

    static synchronized void update(Context c, String id, JSONObject fields) {
        List<JSONObject> list = entries(c);
        for (JSONObject e : list) {
            if (id.equals(e.optString("id"))) {
                java.util.Iterator<String> it = fields.keys();
                while (it.hasNext()) {
                    String k = it.next();
                    try { e.put(k, fields.get(k)); } catch (JSONException ignored) { }
                }
            }
        }
        save(c, list);
    }

    static synchronized void clear(Context c) { save(c, new ArrayList<>()); }
}
