package site.ayneh.pay;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/** A tiny JSON-over-HTTPS client (no libraries). */
final class Api {
    static final String DEFAULT_ORIGIN = "https://ayneh-salon.site";

    static final class Result {
        final int code;
        final JSONObject body;
        Result(int code, JSONObject body) { this.code = code; this.body = body; }
        boolean ok() { return code >= 200 && code < 300; }
        String error() {
            String e = body == null ? "" : body.optString("error", "");
            return e.isEmpty() ? "خطای ارتباط (" + code + ")" : e;
        }
    }

    /** Throws on a network failure; returns any HTTP answer. */
    static Result post(String url, String token, JSONObject json) throws Exception {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        try {
            c.setConnectTimeout(15000);
            c.setReadTimeout(20000);
            c.setRequestMethod("POST");
            c.setDoOutput(true);
            c.setRequestProperty("Content-Type", "application/json; charset=utf-8");
            c.setRequestProperty("Accept", "application/json");
            if (token != null && !token.isEmpty()) c.setRequestProperty("Authorization", "Bearer " + token);
            byte[] bytes = json.toString().getBytes(StandardCharsets.UTF_8);
            c.setFixedLengthStreamingMode(bytes.length);
            try (OutputStream o = c.getOutputStream()) { o.write(bytes); }
            int code = c.getResponseCode();
            InputStream in = code >= 400 ? c.getErrorStream() : c.getInputStream();
            String text = "";
            if (in != null) {
                ByteArrayOutputStream buf = new ByteArrayOutputStream();
                byte[] b = new byte[4096];
                int n;
                while ((n = in.read(b)) > 0) buf.write(b, 0, n);
                in.close();
                text = buf.toString("UTF-8");
            }
            JSONObject body;
            try { body = new JSONObject(text); } catch (Exception e) { body = new JSONObject(); }
            return new Result(code, body);
        } finally {
            c.disconnect();
        }
    }
}
