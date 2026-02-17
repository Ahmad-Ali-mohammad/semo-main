# Reptile House

تجهيز الواجهة + API لتشغيل آمن في الإنتاج.

## تشغيل التطوير

```bash
npm install
npm run start:all
```

- الواجهة: `http://localhost:5173`
- API: `http://localhost:3001`

## تشغيل إنتاج

1. جهّز متغيرات البيئة:
```bash
copy server/.env.example server/.env
```

2. عدّل `server/.env` (خصوصًا بيانات MySQL و`ALLOWED_ORIGINS`).

3. شغّل:
```bash
npm install
cd server && npm install && cd ..
npm run build
cd server && npm run start
```

في الإنتاج، السيرفر يقدّم ملفات الواجهة من `dist` مباشرة على نفس المنفذ.

## نشر على Hostinger VPS

راجع الدليل الجاهز:

`DEPLOY_HOSTINGER_VPS.md`

## نشر على Vercel + Render

راجع الدليل الجاهز:

`DEPLOY_VERCEL_RENDER.md`

## نقاط أمان مفعلة

- `helmet` لحماية HTTP headers.
- `express-rate-limit` للـ API وتقييد أقوى لمسارات تسجيل الدخول.
- دعم CORS مقيّد عبر `ALLOWED_ORIGINS`.
- تعطيل `x-powered-by`.
- ضغط الاستجابات `compression`.
- معالجة أخطاء موحدة ورسائل API واضحة.
