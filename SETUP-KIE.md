# راهنمای اتصال کلیدها (KIE / پیامک / زمان‌بند)

## قانون طلایی

کلید را در چت، ایمیل، گیت، اسکرین‌شات یا کد نگذار. کلید فقط در دو جا مجاز است:

1. **GitHub Secrets** (برای Cloudflare) یا **پنل Sites** (اگر روی Sites ماندی) — برای سایت زنده.
2. فایل **`.dev.vars`** روی کامپیوتر خودت — فقط برای اجرای محلی (در `.gitignore` است).

اپ کلید را زمان اجرا از محیط می‌خواند؛ هیچ‌کس لازم نیست مقدارش را ببیند.

---

## اگر میزبان Cloudflare است (پیشنهادی)

راهنمای کامل و قدم‌به‌قدم: [DEPLOY-CLOUDFLARE.md](DEPLOY-CLOUDFLARE.md)

خلاصه:

1. حساب Cloudflare → API Token با دسترسی Workers/D1/R2.
2. GitHub → Settings → Secrets → Actions → این‌ها را اضافه کن:
   `CLOUDFLARE_API_TOKEN` · `CLOUDFLARE_ACCOUNT_ID` · `SESSION_SECRET` · `OWNER_PASSWORD` · `OWNER_EMAIL` · `APP_ORIGIN` · `KIE_API_KEY` · `JOB_TOKEN`
3. push روی `main` → ورک‌فلوی **Deploy to Cloudflare** همه‌چیز را منتشر و سکرت‌ها را روی Worker می‌نویسد.
4. آدرس Worker → با رمز وارد شو → سالن بساز → تب «پیام و پیگیری» → تیک **فعال‌سازی تولید تصویر**.

بررسی اتصال: خط «وضعیت پیکربندی» در همان تب (فقط «تنظیم‌شده / تنظیم‌نشده»).

---

## اگر میزبان Sites است (روش قبلی)

1. <https://chatgpt.com> → نوار کناری → **Sites** → پروژهٔ آینه.
2. **Settings → Environment variables / Secrets** (فقط مالک).
3. `KIE_API_KEY` را با تیک مخفی اضافه کن؛ همین‌طور `OWNER_EMAIL`، `APP_ORIGIN`، `JOB_TOKEN`، `TRUST_PLATFORM_IDENTITY=true`.
4. ذخیره → نسخه را **دوباره Deploy** کن (بدون انتشار مجدد، مقدار جدید اعمال نمی‌شود).

⚠️ روی Sites حتماً `TRUST_PLATFORM_IDENTITY=true` باشد، چون هویت مدیر از هدرهای پلتفرم می‌آید. روی Cloudflare این متغیر باید **خالی** بماند.

---

## اجرای محلی روی کامپیوتر خودت

```sh
printf 'KIE_API_KEY=کلید-خودت\n' > .dev.vars
chmod 600 .dev.vars
npm run check:kie   # فقط می‌گوید کلید پذیرفته شد یا نه؛ کلید چاپ نمی‌شود
npm run dev
```

`npm run check:kie` یک درخواست بی‌خطر با شناسهٔ ساختگی می‌فرستد: نه عکس می‌سازد، نه اعتبار خرج می‌کند.

---

## زمان‌بند

- **Cloudflare:** خودکار، با `[triggers] crons` در `wrangler.toml` (هر ۱۰ دقیقه).
- **Sites:** ورک‌فلوی `.github/workflows/messages.yml` با سکرت `AYNEH_JOB_TOKEN` و متغیر `AYNEH_APP_URL`.

---

## اگر کلید جایی لو رفت

در کنسول KIE کلید را **Revoke/Rotate** کن و مقدار تازه را فقط در مخزن رمز بگذار. کلید KIE معمولاً به موجودی حساب وصل است.

---

## چرا داخل خود اپ صفحهٔ «کلید را اینجا بگذار» نیست؟

Worker نمی‌تواند متغیرهای محیطی خودش را بنویسد. اگر کلید را در دیتابیس D1 ذخیره کنیم، هر ویرایشگر پروژه و هر کسی با دسترسی به داده می‌تواند بخواندش — یعنی امنیت کمتر، نه بیشتر. به همین دلیل فقط وضعیت «تنظیم‌شده / تنظیم‌نشده» در پنل سالن نمایش داده می‌شود.
