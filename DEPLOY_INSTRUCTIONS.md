# 🚀 تعليمات النشر التلقائي لمشروع SEMO

## المستودع على GitHub
✅ **Repository**: `Ahmad-Ali-mohammad/semo-main`

---

## الخطوة 1️⃣: رفع الكود على GitHub

قم بتشغيل الملف:
```
deploy-to-github.bat
```

أو نفذ الأوامر التالية في Command Prompt:
```bash
cd e:\semo-main
git add .
git commit -m "Deploy: Update for Vercel and Render"
git push -u origin main
```

---

## الخطوة 2️⃣: نشر الباك إند على Render

### أ) إنشاء قاعدة بيانات MySQL (إذا لم تكن موجودة)

اختر أحد الخيارات التالية:

**خيار 1: Railway (مجاني)**
1. اذهب إلى: https://railway.app
2. أنشئ MySQL database جديد
3. احفظ بيانات الاتصال

**خيار 2: PlanetScale (مجاني)**
1. اذهب إلى: https://planetscale.com
2. أنشئ database جديد
3. احفظ بيانات الاتصال

**خيار 3: استخدم Hostinger أو أي MySQL موجود لديك**

### ب) نشر API على Render

1. **افتح Render**: https://render.com
2. سجل دخول بحساب GitHub
3. اضغط **New +** → **Blueprint**
4. اختر repository: `Ahmad-Ali-mohammad/semo-main`
5. Render سيكتشف ملف `render.yaml` تلقائياً
6. **قبل الضغط على Apply**، أدخل المتغيرات البيئية التالية:

```
DB_HOST=<عنوان قاعدة البيانات>
DB_USER=<اسم المستخدم>
DB_PASSWORD=<كلمة المرور>
DB_NAME=<اسم قاعدة البيانات>
ALLOWED_ORIGINS=<اتركه فارغاً الآن>
```

7. اضغط **Apply**
8. انتظر حتى ينتهي Deploy
9. احفظ الرابط الناتج مثل: `https://semo-api.onrender.com`

### ج) إعداد الجداول في قاعدة البيانات

1. أنشئ ملف `server/.env` بالبيانات التالية:
```env
NODE_ENV=production
PORT=3001
TRUST_PROXY=1
ALLOWED_ORIGINS=
RATE_LIMIT_MAX=600
AUTH_RATE_LIMIT_MAX=30
USE_MYSQL=1
DB_HOST=<عنوان قاعدة البيانات>
DB_PORT=3306
DB_USER=<اسم المستخدم>
DB_PASSWORD=<كلمة المرور>
DB_NAME=<اسم قاعدة البيانات>
```

2. نفذ الأوامر:
```bash
cd server
npm install
npm run db:schema
npm run db:seed
```

✅ الآن قاعدة البيانات جاهزة!

---

## الخطوة 3️⃣: نشر الواجهة الأمامية على Vercel

1. **افتح Vercel**: https://vercel.com
2. سجل دخول بحساب GitHub
3. اضغط **Add New** → **Project**
4. اختر repository: `Ahmad-Ali-mohammad/semo-main`

### إعدادات المشروع:
- **Framework Preset**: Vite
- **Root Directory**: `./` (الجذر)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Environment Variables:
أضف المتغير التالي:
```
VITE_API_URL=https://semo-api.onrender.com
```
(استخدم الرابط الذي حصلت عليه من Render)

5. اضغط **Deploy**
6. انتظر حتى ينتهي Deploy
7. احفظ الرابط الناتج مثل: `https://semo-reptile-house.vercel.app`

---

## الخطوة 4️⃣: تحديث CORS

1. ارجع إلى **Render Dashboard**
2. افتح service: **semo-api**
3. اذهب إلى تبويب **Environment**
4. عدّل المتغير `ALLOWED_ORIGINS` وضع رابط Vercel:
```
https://semo-reptile-house.vercel.app
```
5. احفظ التغييرات
6. اضغط **Manual Deploy** → **Deploy latest commit**

---

## الخطوة 5️⃣: الاختبار النهائي

1. افتح رابط Vercel في المتصفح
2. جرب تسجيل الدخول
3. جرب إضافة منتج أو وسيلة
4. تأكد من عدم وجود أخطاء CORS

### اختبار API مباشرة:
```
https://semo-api.onrender.com/health
```
يجب أن يرجع: `{"status":"ok"}`

---

## 🎉 تم بنجاح!

### الروابط النهائية:
- **Frontend (Vercel)**: https://your-app.vercel.app
- **Backend (Render)**: https://semo-api.onrender.com
- **GitHub**: https://github.com/Ahmad-Ali-mohammad/semo-main

---

## 🔧 استكشاف الأخطاء

### مشكلة: CORS Error
- تأكد من `ALLOWED_ORIGINS` في Render يحتوي رابط Vercel الصحيح
- أعد deploy في Render

### مشكلة: Cannot connect to database
- تحقق من بيانات `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- تأكد من أن قاعدة البيانات تقبل اتصالات خارجية

### مشكلة: API returns 404
- تأكد من `VITE_API_URL` في Vercel صحيح
- تحقق من أن Render service يعمل بدون أخطاء

---

## 📝 ملاحظات مهمة

1. ✅ ملف `.gitignore` موجود - لن يتم رفع `.env` على GitHub
2. ✅ ملف `render.yaml` جاهز للنشر التلقائي
3. ✅ ملف `vercel.json` جاهز لدعم SPA routing
4. 🔄 Render يعيد Deploy تلقائياً عند كل push على main
5. 🔄 Vercel يعيد Deploy تلقائياً عند كل push على main

---

## التحديثات المستقبلية

عند إجراء تعديلات على الكود:
```bash
git add .
git commit -m "وصف التعديلات"
git push
```

سيتم النشر تلقائياً على Vercel و Render! 🚀
