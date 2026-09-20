# معماری یادتو

## هدف ظرفیت

فاز اول برای حداقل 100 هزار حساب کاربری طراحی می‌شود. ظرفیت هم‌زمان نهایی با Load Test و زیرساخت زمان انتشار عمومی تعیین خواهد شد.

## معماری

پروژه یک Modular Monolith دارد. دامنه‌ها شامل Identity، Birthdays، Reminders، Messaging، Billing، Content و Administration هستند. فروشگاه در فاز فعلی تعریف نشده است.

دو فرانت‌اند مستقل با React 19، TypeScript و Vite ساخته می‌شوند. بک‌اند Laravel 13 فقط از طریق API نسخه‌بندی‌شده در `api.yadeto.ir/api/v1` در دسترس است. احراز هویت First-party SPA با Sanctum انجام می‌شود.

## قواعد مقیاس‌پذیری

- همه لیست‌های حجیم با Pagination سمت سرور
- ایندکس ترکیبی بر اساس `user_id` و فیلدهای جست‌وجو
- پردازش Batch یادآوری‌ها با کلید Idempotency
- ذخیره فایل از طریق Storage Adapter
- نگهداری تنظیمات محیطی خارج از Repository
- ذخیره زمان Backend به UTC و تبدیل تاریخ شمسی در مرز رابط
- نگهداری اجزای جلالی تولد برای محاسبه دقیق موعد

## مسیر مهاجرت از cPanel

فرانت‌اندها Static هستند و GitHub Actions فقط محتوای `dist` را با FTP منتشر می‌کند. Document Root دامنه API باید به `backend/public` اشاره کند و PHP 8.3 یا جدیدتر داشته باشد. Queue و Cache ابتدا با Database/Cron اجرا می‌شوند و بعداً Redis و Worker دائمی جایگزین آن‌ها خواهند شد.
