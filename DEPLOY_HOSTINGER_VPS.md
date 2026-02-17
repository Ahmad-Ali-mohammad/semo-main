# نشر المشروع على Hostinger VPS (بدون Docker)

## 1) تجهيز الخادم (مرة واحدة)

```bash
apt update && apt upgrade -y
apt install -y nginx mysql-server git curl ufw
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm i -g pm2
```

## 2) إنشاء قاعدة البيانات

```bash
mysql -u root -p
```

نفذ داخل MySQL:

```sql
CREATE DATABASE semo_reptile_house CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'semo_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON semo_reptile_house.* TO 'semo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3) رفع المشروع وتثبيت الحزم

```bash
cd /var/www
git clone <REPO_URL> semo-main
cd semo-main
npm install
cd server && npm install && cd ..
```

## 4) إعداد متغيرات البيئة للإنتاج

```bash
cp server/.env.production.example server/.env
nano server/.env
```

عدل القيم التالية:
- `ALLOWED_ORIGINS`
- `DB_PASSWORD`
- (اختياري) `RATE_LIMIT_MAX`, `AUTH_RATE_LIMIT_MAX`

## 5) Build + تجهيز قاعدة البيانات

```bash
npm run build
npm run setup:db
```

## 6) تشغيل الباك عبر PM2

```bash
pm2 start deploy/hostinger/ecosystem.config.cjs
pm2 save
pm2 startup
```

التحقق:

```bash
pm2 status
curl http://127.0.0.1:3001/health
```

## 7) إعداد Nginx

```bash
cp deploy/hostinger/nginx.reptile-house.conf /etc/nginx/sites-available/semo-main
nano /etc/nginx/sites-available/semo-main
```

استبدل `YOUR_DOMAIN` بالدومين الحقيقي.

ثم:

```bash
ln -s /etc/nginx/sites-available/semo-main /etc/nginx/sites-enabled/semo-main
nginx -t
systemctl restart nginx
```

## 8) SSL (Let's Encrypt)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOUR_DOMAIN -d www.YOUR_DOMAIN
```

## 9) الجدار الناري

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
```

## أوامر إدارة سريعة

```bash
pm2 logs semo-api
pm2 restart semo-api
pm2 stop semo-api
pm2 delete semo-api
```
