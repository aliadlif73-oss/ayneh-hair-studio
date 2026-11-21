package site.ayneh.pay;

import java.util.Calendar;
import java.util.Locale;

/** Persian digits, money and the Jalali (Shamsi) calendar, with no libraries. */
final class Fa {
    static String digits(String s) {
        StringBuilder b = new StringBuilder(s.length());
        for (char ch : s.toCharArray()) {
            if (ch >= '0' && ch <= '9') b.append((char) ('۰' + (ch - '0')));
            else if (ch == ',') b.append('٬');
            else b.append(ch);
        }
        return b.toString();
    }

    static String money(long toman) { return digits(String.format(Locale.US, "%,d", toman)); }

    /** «۱۴۰۵/۰۸/۳۰ · ۱۸:۰۲» */
    static String when(long ms) {
        Calendar c = Calendar.getInstance();
        c.setTimeInMillis(ms);
        int[] j = jalali(c.get(Calendar.YEAR), c.get(Calendar.MONTH) + 1, c.get(Calendar.DAY_OF_MONTH));
        return digits(String.format(Locale.US, "%04d/%02d/%02d · %02d:%02d", j[0], j[1], j[2], c.get(Calendar.HOUR_OF_DAY), c.get(Calendar.MINUTE)));
    }

    static boolean today(long ms) {
        Calendar a = Calendar.getInstance(), b = Calendar.getInstance();
        b.setTimeInMillis(ms);
        return a.get(Calendar.YEAR) == b.get(Calendar.YEAR) && a.get(Calendar.DAY_OF_YEAR) == b.get(Calendar.DAY_OF_YEAR);
    }

    /** Gregorian → Jalali (the standard arithmetic algorithm). */
    static int[] jalali(int gy, int gm, int gd) {
        int[] gdm = {0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334};
        int jy = gy <= 1600 ? 0 : 979;
        gy -= gy <= 1600 ? 621 : 1600;
        int gy2 = gm > 2 ? gy + 1 : gy;
        long days = 365L * gy + (gy2 + 3) / 4 - (gy2 + 99) / 100 + (gy2 + 399) / 400 - 80 + gd + gdm[gm - 1];
        jy += 33 * (int) (days / 12053);
        days %= 12053;
        jy += 4 * (int) (days / 1461);
        days %= 1461;
        if (days > 365) {
            jy += (int) ((days - 1) / 365);
            days = (days - 1) % 365;
        }
        int jm = days < 186 ? 1 + (int) (days / 31) : 7 + (int) ((days - 186) / 30);
        int jd = 1 + (int) (days < 186 ? days % 31 : (days - 186) % 30);
        return new int[]{jy, jm, jd};
    }
}
