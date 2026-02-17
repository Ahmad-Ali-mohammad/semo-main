# 🚀 دليل النشر السريع

## الخطوة 1: رفع على GitHub ✅

المستودع موجود بالفعل: `Ahmad-Ali-mohammad/semo-main`

**شغّل الملف:**
```bash
deploy-to-github.bat
```

أو افتح Command Prompt ونفذ:
```bash
cd e:\semo-main
git add .
git commit -m "Ready for deployment"
git push -u origin main
```

---

## الخطوة 2: نشر Backend على Render 🔧

### أ) إنشاء قاعدة MySQL

اختر واحدة:
- **Railway**: https://railway.app (مجاني)
- **PlanetScale**: https://planetscale.com (مجاني)
- **Hostinger** أو أي MySQL موجود

احفظ هذه البيانات:
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME

### ب) نشر API

1. اذهب إلى: https://render.com
2. New + → **Blueprint**
3. اختر: `Ahmad-Ali-mohammad/semo-main`
4. سيقرأ `render.yaml` تلقائياً
5. **أدخل المتغيرات البيئية:**
   ```
   DB_HOST=<من قاعدة البيانات>
   DB_USER=<من قاعدة البيانات>
   DB_PASSWORD=<من قاعدة البيانات>
   DB_NAME=<من قاعدة البيانات>
   ALLOWED_ORIGINS=<اتركه فارغاً>
   ```
6. اضغط **Apply**
7. انتظر Deploy
8. **احفظ الرابط**: مثل `https://semo-api.onrender.com`

### ج) إنشاء الجداول

1. أنشئ `server/.env`:
```env
NODE_ENV=production
USE_MYSQL=1
DB_HOST=<من قاعدة البيانات>
DB_PORT=3306
DB_USER=<من قاعدة البيانات>
DB_PASSWORD=<من قاعدة البيانات>
DB_NAME=<من قاعدة البيانات>
```

2. نفذ:
```bash
cd server
npm install
npm run db:schema
npm run db:seed
cd ..
```

---

## الخطوة 3: نشر Frontend على Vercel 🌐

1. اذهب إلى: https://vercel.com
2. **Add New** → **Project**
3. اختر: `Ahmad-Ali-mohammad/semo-main`
4. **الإعدادات:**
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables:**
   ```
   VITE_API_URL=https://semo-api.onrender.com
   ```
   (استخدم رابط Render من الخطوة السابقة)
6. اضغط **Deploy**
7. **احفظ الرابط**: مثل `https://semo-app.vercel.app`

---

## الخطوة 4: تحديث CORS ⚙️

1. ارجع لـ **Render**
2. افتح **semo-api**
3. **Environment** → عدّل `ALLOWED_ORIGINS`:
   ```
   https://semo-app.vercel.app
   ```
4. **Manual Deploy** → Deploy latest commit

---

## الخطوة 5: الاختبار ✅

1. افتح رابط Vercel
2. جرب Login
3. جرب المميزات

**اختبار API:**
```
https://semo-api.onrender.com/health
```
يجب أن يرجع: `{"status":"ok"}`

---

## 🎉 تم بنجاح!

### الروابط:
- 📦 **GitHub**: https://github.com/Ahmad-Ali-mohammad/semo-main
- 🌐 **Frontend**: <رابط Vercel الخاص بك>
- 🔧 **Backend**: <رابط Render الخاص بك>

### التحديثات المستقبلية:
```bash
git add .
git commit -m "وصف التحديث"
git push
```
**سيتم النشر تلقائياً على Vercel و Render!** 🚀

---

## 🆘 استكشاف الأخطاء

### CORS Error
- تحقق من `ALLOWED_ORIGINS` في Render
- أعد Deploy

### Database Connection Error
- تحقق من بيانات الاتصال
- تأكد من السماح بالاتصالات الخارجية

### 404 Error
- تحقق من `VITE_API_URL` في Vercel
- تأكد من Render service يعمل
