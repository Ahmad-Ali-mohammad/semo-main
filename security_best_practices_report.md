# Security Best Practices Report

## Executive Summary
تم تنفيذ جولة فحص أمني مع تطبيق إصلاحات مباشرة على الواجهة والخادم.  
أهم الإغلاقات المنفذة: منع XSS المخزّن في محتوى CMS، تقوية هاش كلمات المرور، منع إرجاع 200 لمسارات الاستكشاف غير الشرعية، تحسين حدود المعدل للطلبات الهجومية، وترقية تبعية بريدية كانت تحمل ثغرة High.

## Critical Findings

### SBP-001 Stored XSS عبر `dangerouslySetInnerHTML`
- Severity: Critical
- Location:
  - `utils/safeHtml.ts:1`
  - `components/PolicyPage.tsx:17`
  - `pages/HomePage.tsx:58`
  - `pages/BlogPage.tsx:59`
  - `pages/ArticleDetailsPage.tsx:21`
  - `pages/ContactPage.tsx:63`
  - `pages/AboutPage.tsx:147`
  - `pages/OffersPage.tsx:99`
  - `pages/ServicesPage.tsx:84`
  - `pages/ShowcasePage.tsx:115`
  - `pages/SuppliesPage.tsx:122`
- Evidence: عرض HTML ديناميكي مباشر من CMS عبر `dangerouslySetInnerHTML`.
- Impact: تنفيذ JavaScript ضار في متصفح الزائر وسرقة الجلسة/الرموز.
- Fix Applied: إضافة تعقيم مركزي باستخدام `DOMPurify` وربطه بجميع نقاط العرض.
- Status: Fixed

## High Findings

### SBP-002 Weak Password Hashing + Non Constant-Time Comparison
- Severity: High
- Location:
  - `server/utils/passwords.js:1`
  - `server/controllers/authController.js:78`
  - `server/controllers/authController.js:84`
  - `server/auth.js:1`
- Evidence: كان المسار يعتمد على SHA-256 بسيط مع Salt ثابت البنية.
- Impact: مقاومة أضعف ضد هجمات كسر كلمات المرور عند تسرب قاعدة البيانات.
- Fix Applied:
  - اعتماد `PBKDF2-SHA256` (تكلفة قابلة للضبط عبر `PASSWORD_PBKDF2_ITERATIONS`).
  - مقارنة ثابتة الزمن (`timingSafeEqual`).
  - ترقية تلقائية للهاش القديم عند تسجيل الدخول الناجح.
- Status: Fixed

### SBP-003 Probe Path Handling (WordPress/Scanner paths returning app 200)
- Severity: High
- Location:
  - `server/index.js:47`
  - `server/index.js:75`
  - `server/index.js:78`
  - `server/index.js:224`
- Evidence: fallback SPA العام كان يسمح بتحويل مسارات استكشاف غير صحيحة إلى `index.html`.
- Impact: تسهيل الاستكشاف الآلي وإخفاء الموارد غير الموجودة بردود 200.
- Fix Applied:
  - allowlist لمسارات SPA الصحيحة فقط.
  - حجب مسبقات فحص معروفة (`/wp-`, `xmlrpc.php`, `.git`, `.env`...).
  - منع fallback للمسارات الملفية أو المشبوهة.
- Status: Fixed

## Medium Findings

### SBP-004 Repeated POST/Write Abuse on Non-API Paths
- Severity: Medium
- Location:
  - `server/index.js:147`
  - `server/index.js:206`
- Evidence: لا توجد حماية كافية لكتابات متكررة على مسارات الواجهة غير API.
- Impact: إساءة استخدام بسيطة/ضغط غير ضروري على الخادم.
- Fix Applied:
  - `NON_API_WRITE_RATE_LIMIT_MAX` limiter.
  - إرجاع `405` لأي `POST/PUT/PATCH/DELETE` خارج `/api`.
- Status: Fixed

### SBP-005 Missing CSP Baseline in App Responses
- Severity: Medium
- Location: `server/index.js:98`
- Evidence: تم تعطيل CSP سابقًا.
- Impact: تقليل طبقة الحماية الدفاعية ضد XSS.
- Fix Applied: تفعيل CSP عبر `helmet` مع سياسة عملية للتطبيق الحالي.
- Status: Fixed

### SBP-006 Auth Brute-Force Hardening Gap
- Severity: Medium
- Location: `server/index.js:137`
- Evidence: limiter المصادقة كان بدون `skipSuccessfulRequests`.
- Impact: تخمين كلمات المرور بسرعة أكبر في ظروف هجوم.
- Fix Applied: تحسين limiter للمصادقة.
- Status: Fixed

## Dependency Findings

### SBP-007 Vulnerable Mail Library + Unvalidated Recipients
- Severity: High
- Location:
  - `server/package.json:24`
  - `server/utils/emailAddress.js:1`
  - `server/utils/mailer.js:45`
  - `server/utils/orderNotifications.js:80`
- Evidence: `npm audit` أظهر ثغرة High في `nodemailer` بالإصدار السابق.
- Impact: احتمالات DoS/سوء تفسير عنوان بريد.
- Fix Applied:
  - ترقية `nodemailer` إلى `^8.0.1`.
  - إضافة تحقق صارم لعناوين المستلمين وتحديد عدد المستلمين.
- Status: Fixed

## Verification Performed
- `npm run build` (frontend): Passed
- `node --check` على ملفات الخادم المعدلة: Passed
- `npm audit --omit=dev`:
  - root: 0 vulnerabilities
  - server: 0 vulnerabilities

## Residual Risk / Notes
- التطبيق يستخدم JWT في `localStorage`. بعد إغلاق مسارات XSS الرئيسية أصبحت المخاطرة أقل، لكن أفضل مستوى حماية مستقبليًا هو نقل الجلسة إلى Cookie `HttpOnly` مع تصميم CSRF مناسب.
