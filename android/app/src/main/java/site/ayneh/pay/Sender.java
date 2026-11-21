package site.ayneh.pay;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.job.JobInfo;
import android.app.job.JobScheduler;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;

import org.json.JSONObject;

import java.util.List;

/** Sends queued deposits to the site (POST /api/pay/sms) and records what the site decided. */
final class Sender {
    private static final int JOB_ID = 7401;
    private static final Object LOCK = new Object();
    static final String CHANNEL = "deposits";

    static void schedule(Context c) {
        JobScheduler js = (JobScheduler) c.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        if (js == null) return;
        JobInfo job = new JobInfo.Builder(JOB_ID, new ComponentName(c, SendJob.class))
                .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY)
                .setBackoffCriteria(15000, JobInfo.BACKOFF_POLICY_EXPONENTIAL)
                .setPersisted(true)
                .build();
        js.schedule(job);
    }

    /** Returns true when something is still waiting and the job should run again. */
    static boolean flush(Context c) {
        synchronized (LOCK) {
            if (!Store.paired(c)) return false;
            boolean again = false;
            List<JSONObject> list = Store.entries(c);
            for (int i = list.size() - 1; i >= 0; i--) {
                JSONObject e = list.get(i);
                if (!"pending".equals(e.optString("status"))) continue;
                String id = e.optString("id");
                try {
                    JSONObject body = new JSONObject().put("text", e.optString("text"));
                    Api.Result r = Api.post(Store.origin(c) + "/api/pay/sms", Store.key(c), body);
                    if (r.code == 401) { Store.setAuthFailed(c, true); return false; }
                    if (Store.authFailed(c)) Store.setAuthFailed(c, false);
                    if (r.code >= 500 || r.code == 429) { again = true; continue; }
                    JSONObject f = new JSONObject();
                    JSONObject b = r.body;
                    f.put("sent_at", System.currentTimeMillis());
                    if (!r.ok()) {
                        f.put("status", "error").put("msg", r.error());
                    } else if (b.optBoolean("ignored")) {
                        f.put("status", "ignored");
                    } else if (b.optBoolean("duplicate")) {
                        f.put("status", "duplicate");
                    } else if (b.optBoolean("matched")) {
                        f.put("status", "paid").put("ref", b.optString("ref")).put("name", b.optString("name")).put("label", b.optString("label"));
                        notifyPaid(c, e.optLong("amount") / 10, b.optString("name"));
                    } else if (b.optBoolean("many")) {
                        f.put("status", "many");
                    } else if (b.has("error")) {
                        f.put("status", "closed").put("msg", b.optString("error")).put("ref", b.optString("ref")).put("name", b.optString("name"));
                    } else {
                        f.put("status", "none");
                    }
                    if (b.has("amount") && b.optLong("amount") > 0) f.put("amount", b.optLong("amount") * 10);
                    Store.update(c, id, f);
                } catch (Exception ex) {
                    again = true; // no internet or a timeout: try again later
                }
            }
            return again;
        }
    }

    static void ensureChannel(Context c) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel(CHANNEL) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, "واریزهای تأییدشده", NotificationManager.IMPORTANCE_DEFAULT);
        nm.createNotificationChannel(ch);
    }

    private static void notifyPaid(Context c, long toman, String name) {
        try {
            ensureChannel(c);
            NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;
            PendingIntent open = PendingIntent.getActivity(c, 0, new Intent(c, MainActivity.class), PendingIntent.FLAG_IMMUTABLE);
            Notification n = new Notification.Builder(c, CHANNEL)
                    .setSmallIcon(R.drawable.ic_stat)
                    .setColor(0xFF068F6C)
                    .setContentTitle("واریز " + Fa.money(toman) + " تومان تأیید شد")
                    .setContentText(name == null || name.isEmpty() ? "سفارش خودکار باز شد" : name)
                    .setContentIntent(open)
                    .setAutoCancel(true)
                    .build();
            nm.notify((int) (System.currentTimeMillis() % 100000), n);
        } catch (SecurityException ignored) { }
    }
}
