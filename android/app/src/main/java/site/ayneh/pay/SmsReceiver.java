package site.ayneh.pay;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.telephony.SmsMessage;

import java.util.LinkedHashMap;
import java.util.Map;

/** Every incoming SMS passes here; only Blu deposits are kept and queued for the site. */
public class SmsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (!Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) return;
        SmsMessage[] parts = Telephony.Sms.Intents.getMessagesFromIntent(intent);
        if (parts == null || parts.length == 0) return;
        /* A long SMS arrives in parts: join them per sender. */
        Map<String, StringBuilder> bySender = new LinkedHashMap<>();
        long at = System.currentTimeMillis();
        for (SmsMessage m : parts) {
            if (m == null) continue;
            String from = m.getDisplayOriginatingAddress();
            if (from == null) from = "";
            StringBuilder b = bySender.get(from);
            if (b == null) { b = new StringBuilder(); bySender.put(from, b); }
            String body = m.getDisplayMessageBody();
            if (body != null) b.append(body);
            if (m.getTimestampMillis() > 0) at = m.getTimestampMillis();
        }
        boolean any = false;
        for (Map.Entry<String, StringBuilder> e : bySender.entrySet()) {
            String body = e.getValue().toString();
            if (Store.isDeposit(context, e.getKey(), body)) {
                Store.add(context, body, at);
                any = true;
            }
        }
        if (any) Sender.schedule(context);
    }
}
