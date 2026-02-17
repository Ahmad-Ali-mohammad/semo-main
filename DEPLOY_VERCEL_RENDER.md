# نشر المشروع على Vercel + Render

هذا المشروع يشتغل بشكل أفضل كالتالي:
- **Frontend (Vite/React)** على **Vercel**
- **Backend (Express API)** على **Render**
- **MySQL** على مزود خارجي (Hostinger DB / PlanetScale / أي MySQL متاح)

## 1) نشر الباك على Render

### الطريقة السريعة
1. افتح Render ثم `New +` -> `Blueprint`.
2. اختر نفس المستودع.
3. Render سيقرأ `render.yaml` تلقائيًا.
4. قبل أول deploy، أدخل قيم المتغيرات التالية يدويًا في Render:
   - `DB_HOST`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `ALLOWED_ORIGINS` (ضع رابط Vercel بعد إنشائه، مثال: `https://your-app.vercel.app`)

### التحقق
- بعد النجاح، افحص:
  - `https://YOUR_RENDER_DOMAIN/health`

## 2) تنفيذ schema + seed على قاعدة البيانات

Render لا يشغّل seeding تلقائيًا من blueprint. نفّذ مرة واحدة من جهازك:

```bash
npm install
cd server && npm install && cd ..
npm run setup:db
```

مهم: تأكد أن `server/.env` محليًا يحتوي نفس بيانات MySQL الخاصة بالإنتاج أثناء تنفيذ الأمر.

## 3) نشر الواجهة على Vercel

1. افتح Vercel -> `Add New Project`.
2. اختر نفس المستودع.
3. إعدادات المشروع:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. في Environment Variables أضف:
   - `VITE_API_URL=https://YOUR_RENDER_DOMAIN`
5. Deploy.

`vercel.json` موجود مسبقًا لدعم SPA rewrite.

## 4) ربط CORS

في Render عدّل:
- `ALLOWED_ORIGINS=https://YOUR_VERCEL_DOMAIN,https://www.YOUR_VERCEL_DOMAIN`

إذا كنت بدون www ضع دومين واحد فقط.

## 5) اختبار نهائي

1. افتح موقع Vercel.
2. جرّب تسجيل الدخول.
3. جرّب أي طلب API (مثال: المنتجات/الوسائط).
4. إذا ظهر خطأ CORS:
   - راجع `ALLOWED_ORIGINS` في Render
   - ثم `Manual Deploy` مرة أخرى.
