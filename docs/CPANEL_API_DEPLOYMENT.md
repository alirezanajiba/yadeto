# استقرار API یادتو روی cPanel

بک‌اند باید روی زیردامنه مستقل `api.yadeto.ir` اجرا شود.

## پیش‌نیازها

- PHP 8.3 یا جدیدتر
- MySQL 8 یا MariaDB سازگار
- امکان تنظیم Document Root روی پوشه `backend/public`
- Cron Job برای اجرای Scheduler لاراول در هر دقیقه
- SSL فعال برای `api.yadeto.ir`

## تنظیمات پیشنهادی

Document Root زیردامنه باید مستقیماً به `backend/public` اشاره کند؛ فایل `.env` و سایر فایل‌های Laravel نباید داخل پوشه عمومی قرار بگیرند.

مقادیر حساس فقط در `.env` سرور قرار می‌گیرند و نباید وارد GitHub شوند. حداقل متغیرهای تولیدی:

```dotenv
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yadeto.ir
FRONTEND_URLS=https://app.yadeto.ir,https://admin.yadeto.ir
SANCTUM_STATEFUL_DOMAINS=app.yadeto.ir,admin.yadeto.ir
SESSION_DOMAIN=.yadeto.ir
SESSION_SECURE_COOKIE=true
QUEUE_CONNECTION=database
```

Cron موردنیاز:

```text
* * * * * php /path/to/backend/artisan schedule:run > /dev/null 2>&1
```

تا زمان انتقال به سرور اختصاصی، Queue می‌تواند به‌صورت Database Queue و اجرای دوره‌ای `queue:work --stop-when-empty` پردازش شود. روی VPS، Redis و Worker دائمی جایگزین این روش می‌شوند.
