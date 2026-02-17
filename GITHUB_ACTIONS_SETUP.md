# 🚀 دليل إعداد GitHub Actions للنشر التلقائي

هذا الدليل يشرح كيفية إعداد GitHub Actions لنشر التطبيق تلقائيًا على Vercel و Render.

## 📋 المتطلبات الأساسية

1. حساب على [GitHub](https://github.com)
2. حساب على [Vercel](https://vercel.com)
3. حساب على [Render](https://render.com)
4. مستودع GitHub: `Ahmad-Ali-mohammad/semo-main`

---

## 🔧 الخطوة 1: إعداد Vercel

### أ) إنشاء مشروع على Vercel

1. اذهب إلى: https://vercel.com/new
2. اختر المستودع: `Ahmad-Ali-mohammad/semo-main`
3. الإعدادات:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. أضف متغير البيئة:
   - `VITE_API_URL` = رابط API من Render (ستحصل عليه لاحقًا)

### ب) الحصول على بيانات Vercel API

1. اذهب إلى: https://vercel.com/account/tokens
2. أنشئ **New Token** باسم `GitHub Actions`
3. احفظ الـ Token

4. اذهب إلى إعدادات المشروع في Vercel
5. احفظ:
   - **Project ID**: من Settings → General
   - **Org ID**: من إعدادات الحساب

---

## 🔧 الخطوة 2: إعداد Render

### أ) إنشاء Web Service

1. اذهب إلى: https://render.com/dashboard
2. اضغط **New +** → **Blueprint**
3. اختر المستودع: `Ahmad-Ali-mohammad/semo-main`
4. Render سيقرأ ملف `render.yaml` تلقائيًا

### ب) إعداد قاعدة البيانات

اختر مزود قاعدة بيانات MySQL:
- Railway: https://railway.app
- PlanetScale: https://planetscale.com
- أو استخدم قاعدة بيانات موجودة

احفظ بيانات الاتصال:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### ج) إضافة متغيرات البيئة في Render

في Render Dashboard → Service → Environment:
```
NODE_ENV=production
PORT=3001
TRUST_PROXY=1
USE_MYSQL=1
DB_HOST=<من قاعدة البيانات>
DB_PORT=3306
DB_USER=<من قاعدة البيانات>
DB_PASSWORD=<من قاعدة البيانات>
DB_NAME=<من قاعدة البيانات>
ALLOWED_ORIGINS=https://your-app.vercel.app
RATE_LIMIT_MAX=600
AUTH_RATE_LIMIT_MAX=30
```

### د) الحصول على Deploy Hook من Render

1. في Render Dashboard → Service → Settings
2. اذهب إلى **Deploy Hook**
3. انسخ الـ URL (مثال: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`)

---

## 🔧 الخطوة 3: إعداد GitHub Secrets

اذهب إلى مستودع GitHub:
https://github.com/Ahmad-Ali-mohammad/semo-main/settings/secrets/actions

أضف الـ Secrets التالية:

### Vercel Secrets:
1. **VERCEL_TOKEN**
   - القيمة: الـ Token الذي حصلت عليه من Vercel

2. **VERCEL_ORG_ID**
   - القيمة: Organization ID من Vercel

3. **VERCEL_PROJECT_ID**
   - القيمة: Project ID من Vercel

### Render Secret:
4. **RENDER_DEPLOY_HOOK_URL**
   - القيمة: Deploy Hook URL من Render

---

## 🔧 الخطوة 4: إنشاء جداول قاعدة البيانات

على جهازك المحلي:

1. أنشئ ملف `server/.env`:
```env
NODE_ENV=production
USE_MYSQL=1
DB_HOST=<من قاعدة البيانات>
DB_PORT=3306
DB_USER=<من قاعدة البيانات>
DB_PASSWORD=<من قاعدة البيانات>
DB_NAME=<من قاعدة البيانات>
```

2. نفذ الأوامر:
```bash
cd server
npm install
npm run db:schema
npm run db:seed
cd ..
```

---

## 🚀 الخطوة 5: اختبار النشر التلقائي

الآن عند كل `git push` إلى branch `main`، سيتم تلقائيًا:

1. بناء Frontend
2. بناء Backend
3. نشر Frontend على Vercel
4. تنبيه Render لنشر Backend

### تجربة أول نشر:

```bash
git add .
git commit -m "Setup automated deployment"
git push origin main
```

### متابعة التقدم:

- **GitHub Actions**: https://github.com/Ahmad-Ali-mohammad/semo-main/actions
- **Vercel**: https://vercel.com/dashboard
- **Render**: https://render.com/dashboard

---

## 📊 ملف GitHub Actions Workflow

الملف الموجود في: `.github/workflows/deploy.yml`

### ماذا يفعل:

1. **Build Frontend**:
   - تثبيت Dependencies
   - بناء المشروع
   - حفظ Artifacts

2. **Build Backend**:
   - تثبيت Dependencies
   - تشغيل الاختبارات (إن وجدت)

3. **Deploy to Vercel**:
   - نشر Frontend على Vercel (فقط على branch main)

4. **Notify Render**:
   - تنبيه Render لنشر Backend (فقط على branch main)

---

## 🔄 تحديث VITE_API_URL في Vercel

بعد أول نشر على Render، احصل على رابط API:
- مثال: `https://semo-api.onrender.com`

ثم:
1. اذهب إلى Vercel → Project Settings → Environment Variables
2. عدّل `VITE_API_URL` وضع رابط Render
3. Redeploy من Vercel Dashboard

---

## 🔄 تحديث ALLOWED_ORIGINS في Render

بعد أول نشر على Vercel، احصل على رابط الموقع:
- مثال: `https://semo-app.vercel.app`

ثم:
1. اذهب إلى Render → Service → Environment
2. عدّل `ALLOWED_ORIGINS` وضع رابط Vercel
3. Redeploy من Render Dashboard

---

## ✅ الاختبار النهائي

1. افتح رابط Vercel
2. جرّب تسجيل الدخول
3. تحقق من عمل API:
   ```
   https://semo-api.onrender.com/health
   ```
   يجب أن يرجع: `{"status":"ok"}`

---

## 🔐 الأمان

### ✅ نقاط الأمان المفعّلة:
- جميع الـ Secrets في GitHub Secrets (غير مرئية في الكود)
- ملف `.env` محمي بـ `.gitignore`
- CORS مفعّل ومحدود
- Rate limiting مفعّل
- Helmet لحماية HTTP headers

### ❌ لا تفعل:
- لا ترفع ملف `.env` على GitHub
- لا تشارك الـ Tokens أو Secrets
- لا تعطل الأمان للاختبار

---

## 🆘 استكشاف الأخطاء

### GitHub Actions يفشل:
- تحقق من صحة الـ Secrets
- راجع Logs في Actions tab
- تأكد من صحة ملف `deploy.yml`

### Vercel Deployment يفشل:
- تحقق من `VERCEL_TOKEN`
- تأكد من صحة `VERCEL_PROJECT_ID` و `VERCEL_ORG_ID`
- راجع Build Logs في Vercel

### Render لا ينشر:
- تحقق من `RENDER_DEPLOY_HOOK_URL`
- تأكد من تفعيل Auto Deploy في Render
- راجع Logs في Render Dashboard

### CORS Error:
- تحقق من `ALLOWED_ORIGINS` في Render
- تأكد من مطابقة رابط Vercel

---

## 📚 مصادر إضافية

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)

---

## 🎉 تم!

الآن لديك:
- ✅ نشر تلقائي على كل `git push`
- ✅ Frontend على Vercel
- ✅ Backend على Render
- ✅ قاعدة بيانات MySQL
- ✅ CI/CD Pipeline كامل

**التحديثات المستقبلية:**
```bash
git add .
git commit -m "وصف التحديث"
git push origin main
```
سيتم النشر تلقائيًا! 🚀
