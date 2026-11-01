# انتشار روی Cloudflare از GitHub

با این مسیر دیگر به حساب ChatGPT و پنل Sites نیازی نیست. کد در GitHub می‌ماند، Cloudflare اجرا می‌کند و کلیدها در **GitHub Secrets** نگه داشته می‌شوند.

> این اپ همان چیزی است که Sites هم زیرش داشت: Worker + D1 + فضای عکس + Cron. تنها تفاوت این است که احراز هویت مدیر حالا با **رمز** انجام می‌شود، چون هدرهای هویتِ ChatGPT روی Cloudflare وجود ندارند.

> **فضای عکس بدون کارت بانکی:** R2 به کارت نیاز دارد. به همین دلیل اپ حالا از **Workers KV** (رایگان، بدون کارت) استفاده می‌کند و اگر KV هم نبود، عکس‌ها داخل خود D1 ذخیره می‌شوند (با سقف ۸۵۰ کیلوبایت برای هر عکس).

---

## ۰) پیش‌نیاز

- حساب Cloudflare (پلن رایگان کافی است)
- Node.js روی کامپیوتر خودت (فقط برای دو دستور یک‌باره)

---

## ۱) ساخت دیتابیس و فضای عکس (یک‌بار)

در ترمینال، داخل پوشهٔ پروژه:

```sh
npx wrangler@4 login
npx wrangler@4 d1 create ayneh
npx wrangler@4 kv namespace create ayneh-media
```

خروجی هر دو دستور یک شناسه می‌دهد:
- `database_id` را در `wrangler.toml` جای `PASTE_D1_DATABASE_ID` بگذار.
- `id` فضای KV را جای `PASTE_KV_NAMESPACE_ID` بگذار.

هر دو شناسه سرّی نیستند. اگر ترمینال نداری، همین دو را از داشبورد بساز: **Storage & databases → D1 SQL Database → Create database** و **Workers & Pages → KV → Create namespace**؛ شناسه‌ها در صفحهٔ هرکدام نوشته شده‌اند.

R2 لازم نیست. اگر روزی کارت اضافه کردی، بلوک R2 را در `wrangler.toml` از کامنت دربیاور و بلوک KV را حذف کن؛ کد خودش R2 را ترجیح می‌دهد.

جدول‌ها را لازم نیست دستی بسازی؛ ورک‌فلوی انتشار خودش `drizzle/0000_salons.sql` را روی D1 اعمال می‌کند.

---

## ۲) توکن Cloudflare

1. داشبورد Cloudflare → آیکن حساب → **My Profile** → **API Tokens** → **Create Token**
2. قالب **Edit Cloudflare Workers** را بردار و این دسترسی‌ها را اضافه کن:
   - Account → **D1: Edit**
   - Account → **R2: Edit**
   - Account → **Workers Scripts: Edit**
   - (اگر دامنهٔ اختصاصی می‌خواهی) Zone → **Workers Routes: Edit**
3. توکن را کپی کن (فقط یک‌بار نشان داده می‌شود).
4. **Account ID** را از داشبورد (صفحهٔ Workers & Pages، ستون راست) یا با `npx wrangler@4 whoami` بردار.

---

## ۳) Secrets در GitHub

همه را از این‌جا اضافه کن:
<https://github.com/aliadlif73-oss/ayneh-hair-studio/settings/secrets/actions/new>

| نام | اجباری | مقدار |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | ✅ | توکن مرحلهٔ ۲ (دسترسی D1 و Workers کافی است؛ R2 لازم نیست) |
| `CLOUDFLARE_ACCOUNT_ID` | ✅ | Account ID |
| `SESSION_SECRET` | ✅ | `openssl rand -hex 32` |
| `OWNER_PASSWORD` | ✅ (یا هش آن) | رمز ورود مدیر |
| `OWNER_PASSWORD_HASH` | جایگزین بالا | `printf '%s' 'رمز' \| sha256sum \| cut -d' ' -f1` |
| `OWNER_EMAIL` | توصیه‌شده | ایمیل مدیر |
| `APP_ORIGIN` | ✅ | آدرس نهایی سایت، مثل `https://ayneh-hair-studio.<subdomain>.workers.dev` |
| `KIE_API_KEY` | برای تولید تصویر | کلید KIE |
| `TELEGRAM_BOT_TOKEN` | ✅ | توکن ربات از BotFather (راهنما: `SETUP-TELEGRAM.md`) |
| `TELEGRAM_BOT_USERNAME` | ✅ | نام کاربری ربات بدون @ |
| `TELEGRAM_WEBHOOK_SECRET` | ✅ | `openssl rand -hex 24` |
| `MELIPAYAMAK_TOKEN` | برای پیامک | کلید API کنسول ملی‌پیامک (راهنما: `SETUP-SMS.md`) |
| `MELIPAYAMAK_USERNAME` / `MELIPAYAMAK_PASSWORD` | جایگزین بالا | نام کاربری و رمز/ApiKey پنل |
| `MELIPAYAMAK_OTP_BODY_ID` | برای کد تأیید | شمارهٔ الگوی کد تأیید |
| `MELIPAYAMAK_INVITE_BODY_ID` | برای دعوت از ربات | شمارهٔ الگوی دعوت |
| `JOB_TOKEN` | اختیاری | `openssl rand -hex 32` (برای صدا زدن دستی صف) |
| `OWNER_ID` | اختیاری | پیش‌فرض `owner` |

`TRUST_PLATFORM_IDENTITY` را روی Cloudflare **ست نکن**؛ آن فقط برای میزبانی Sites است (هدرهای هویت). اگر ست شود، هر کسی می‌تواند خودش را مدیر جا بزند.

---

## ۴) انتشار

با هر push روی `main` (یا دستی از تب Actions → **Deploy to Cloudflare** → Run workflow) این کارها انجام می‌شود:

1. تست‌ها (`npm test`)
2. اعمال مایگریشن‌ها روی D1
3. انتشار Worker
4. نوشتن همهٔ سکرت‌ها از GitHub روی Worker
5. وصل‌کردن ربات تلگرام به سایت (setWebhook)
6. Cron هر ۱۰ دقیقه خودکار فعال است (ارسال دوبارهٔ درخواست‌هایی که به تلگرام نرسیدند و پاک‌سازی ۳۰ روزه)

---

## ۵) اولین ورود

1. آدرس Worker را باز کن: `https://ayneh-hair-studio.<subdomain>.workers.dev`
2. رمز مدیر را بزن (همان `OWNER_PASSWORD`).
3. سالن بساز و اطلاعاتش را در `/admin/<slug>` پر کن.
4. «ساخت لینک اتصال» را بزن و لینک را برای آرایشگاه بفرست تا در تلگرام Start بزند (`SETUP-TELEGRAM.md`).
5. برای شبیه‌سازی، `KIE_API_KEY` را در Secrets بگذار؛ تیک «مشتری بتواند مدل را روی عکس خودش ببیند» برای سالن‌های تازه از اول روشن است.
6. عکس‌های ۲۰ مدل آماده را workflow **Generate catalog photos** با همان کلید KIE می‌سازد (تب Actions).

---

## ۶) دامنهٔ اختصاصی (اختیاری)

داشبورد Cloudflare → Workers & Pages → پروژهٔ `ayneh-hair-studio` → **Settings → Domains & Routes → Add custom domain**. بعد `APP_ORIGIN` را در GitHub Secrets به همان دامنه تغییر بده تا لینک پیام‌ها درست ساخته شود.

---

## ۷) نکته‌ها

- فضای عکس: اول R2 (اگر بایند شده باشد) → بعد KV → و در آخر خود D1. سقف هر عکس در حالت D1 برابر ۸۵۰ کیلوبایت است؛ کلاینت عکس را خودش تا این حد فشرده می‌کند.
- **داده‌های قبلی Sites منتقل نمی‌شوند.** D1 و R2 در حساب Sites جدا هستند؛ در Cloudflare از صفر شروع می‌کنی (سالن‌ها دوباره ساخته می‌شوند).
- ورک‌فلوی `.github/workflows/messages.yml` (زمان‌بند GitHub) دیگر لازم نیست؛ Cron خودِ Cloudflare کار را می‌کند. اگر هر دو فعال باشند هم مشکلی نیست، چون صف idempotent است.
- منطق امنیتی: کوکی مدیر با `SESSION_SECRET` امضا می‌شود، هفت روز اعتبار دارد، `HttpOnly` است و هر ۲۰ تلاش ناموفق ورود از یک IP محدود می‌شود.
- اگر رمز را فراموش کردی، `OWNER_PASSWORD` را در GitHub عوض کن و ورک‌فلو را دوباره اجرا کن.
