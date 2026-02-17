# 🚀 رفع ونشر المشروع تلقائياً

## الطريقة السريعة (مُوصى بها)

### الخيار 1: استخدام npm script
```bash
npm run deploy:github
```

### الخيار 2: استخدام ملف bat
```bash
DEPLOY_NOW.bat
```

### الخيار 3: نشر كامل تفاعلي
```bash
npm run deploy:full
```

---

## ماذا سيحدث؟

1. ✅ سيتم رفع جميع الملفات على GitHub تلقائياً
2. ℹ️  ستظهر تعليمات لنشر Backend على Render
3. ℹ️  ستظهر تعليمات لنشر Frontend على Vercel

---

## إذا فشل الرفع التلقائي

نفذ يدوياً:
```bash
git add .
git commit -m "Deploy: Ready for production"
git push -u origin main
```

---

## بعد رفع GitHub بنجاح

### 1️⃣ نشر Backend (Render)
1. افتح: https://render.com
2. New + → Blueprint
3. اختر: `Ahmad-Ali-mohammad/semo-main`
4. أدخل بيانات MySQL
5. Deploy

### 2️⃣ نشر Frontend (Vercel)
1. افتح: https://vercel.com
2. New Project
3. اختر: `Ahmad-Ali-mohammad/semo-main`
4. Framework: Vite
5. Environment Variable: `VITE_API_URL`
6. Deploy

---

## الملفات المتاحة

- `DEPLOY_NOW.bat` - رفع تلقائي على GitHub
- `auto-deploy.js` - سكريبت Node للرفع
- `full-deploy.js` - نشر كامل تفاعلي
- `QUICK_DEPLOY.md` - دليل سريع
- `DEPLOY_INSTRUCTIONS.md` - دليل شامل

---

## npm scripts المتاحة

```bash
npm run deploy:github    # رفع على GitHub فقط
npm run deploy:full      # نشر كامل تفاعلي
```

---

## 🎯 ابدأ الآن!

```bash
npm run deploy:github
```

أو

```bash
DEPLOY_NOW.bat
```
