/**
 * بذر المستخدم الافتراضي والمنتجات الأولية
 * تشغيل: cd server && npm run db:seed
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
    });
  }
} catch (_) {}

const db = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'semo_reptile_house',
};

function hashPass(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  return crypto.createHash('sha256').update(Buffer.concat([salt, Buffer.from(password, 'utf8')])).digest('hex');
}

const IMG = '/assets/photo_2026-02-04_07-13-35.jpg';
const initialProducts = [
  { name: 'آريس', species: 'تنين ملتحي', description: 'تنين ملتحي يتمتع بصحة ممتازة وهدوء تام.', price: 280, image_url: IMG, rating: 5, is_available: 1, status: 'متوفر', category: 'lizard' },
  { name: 'سولار', species: 'أفعى الكرة (بيثون)', description: 'بيثون ملكي بنمط لوني مذهل. هادئ جداً.', price: 350, image_url: IMG, rating: 4.9, is_available: 1, status: 'متوفر', category: 'snake' },
  { name: 'زمرد', species: 'إغوانة خضراء', description: 'إغوانة خضراء يافعة بألوان زاهية.', price: 150, image_url: IMG, rating: 4.7, is_available: 0, status: 'قيد الحجز', category: 'lizard' },
  { name: 'هرقل', species: 'سلحفاة السولكاتا', description: 'سلحفاة سولكاتا في مرحلة النمو.', price: 420, image_url: IMG, rating: 4.9, is_available: 1, status: 'متوفر', category: 'turtle' },
  { name: 'توباز', species: 'أبو بريص الفهد', description: 'ليوبارد جيكو بألوان صفراء. سهل العناية.', price: 110, image_url: IMG, rating: 4.8, is_available: 1, status: 'متوفر', category: 'lizard' },
];

async function run() {
  const conn = await mysql.createConnection(db);

  const saltAdmin = crypto.randomBytes(16).toString('hex');
  const saltUser = crypto.randomBytes(16).toString('hex');
  await conn.query(
    `INSERT INTO users (id, name, email, role, password_hash, password_salt) VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), password_salt = VALUES(password_salt)`,
    ['admin-1', 'Admin', 'admin@reptilehouse.sy', 'admin', hashPass('admin123', saltAdmin), saltAdmin]
  );
  await conn.query(
    `INSERT INTO users (id, name, email, role, password_hash, password_salt) VALUES (?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), password_salt = VALUES(password_salt)`,
    ['user-1', 'User', 'user@reptilehouse.sy', 'user', hashPass('user123', saltUser), saltUser]
  );
  console.log('Users seeded: admin@reptilehouse.sy / admin123  و  user@reptilehouse.sy / user123');

  const [rows] = await conn.query('SELECT COUNT(*) as c FROM products');
  if (rows[0].c === 0) {
    for (const p of initialProducts) {
      await conn.query(
        `INSERT INTO products (name, species, description, price, image_url, rating, is_available, status, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, p.species, p.description || '', p.price, p.image_url, p.rating, p.is_available, p.status, p.category]
      );
    }
    console.log('Initial products seeded:', initialProducts.length);
  } else {
    console.log('Products already exist, skip.');
  }

  const [heroRows] = await conn.query('SELECT COUNT(*) as c FROM hero_slides');
  if (heroRows[0].c === 0) {
    await conn.query(
      `INSERT INTO hero_slides (id, image, title, subtitle, button_text, link, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['1', IMG, 'اكتشف عالم الزواحف المذهل', 'مجموعة فريدة من الزواحف الصحية والجميلة.', 'تصفح المعرض', 'showcase', 1]
    );
    await conn.query(
      `INSERT INTO hero_slides (id, image, title, subtitle, button_text, link, active) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      ['2', IMG, 'جودة ورعاية لا مثيل لهما', 'بإشراف الخبير سيمون، نضمن لك أفضل رعاية.', 'خدماتنا', 'services', 1]
    );
    console.log('Hero slides seeded: 2');
  }

  // Seed media folder
  await conn.query(`
    INSERT INTO media_folders (id, name, is_active)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `, ['folder-default', 'عام', 1]);
  console.log('Media folder seeded: folder-default');

  // Seed mascot image
  await conn.query(`
    INSERT INTO media_items (id, url, name, size, date, file_type, category, folder_id, alt_text)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE url = VALUES(url)
  `, [
    'mascot-default',
    'https://i.ibb.co/Lzr9P8P/reptile-house-mascot.jpg',
    'Reptile House Logo.jpg',
    '1.2 MB',
    new Date().toLocaleDateString('ar-SY'),
    'image',
    'logos',
    'folder-default',
    'شعار بيت الزواحف'
  ]);
  console.log('Media item seeded: mascot-default');

  // ====================================
  //  SERVICES
  // ====================================
  const services = [
    {
      id: 'service-1',
      title: 'استشارات رعاية الزواحف',
      description: 'نقدم استشارات متخصصة في رعاية جميع أنواع الزواحف، بما في ذلك الإعداد الأمثل للبيئة والتغذية والرعاية الصحية.',
      image_url: 'https://i.ibb.co/placeholder1.jpg',
      icon: '🦎',
      price: 50.00,
      sort_order: 1,
      is_published: 1
    },
    {
      id: 'service-2',
      title: 'تصميم البيئات والتراريوم',
      description: 'خدمة تصميم وإعداد بيئات مخصصة للزواحف بما يتناسب مع احتياجاتها الطبيعية.',
      image_url: 'https://i.ibb.co/placeholder2.jpg',
      icon: '🏠',
      price: 150.00,
      sort_order: 2,
      is_published: 1
    },
    {
      id: 'service-3',
      title: 'فحوصات صحية دورية',
      description: 'فحوصات صحية شاملة للزواحف للتأكد من سلامتها والوقاية من الأمراض.',
      image_url: 'https://i.ibb.co/placeholder3.jpg',
      icon: '⚕️',
      price: 75.00,
      sort_order: 3,
      is_published: 1
    },
    {
      id: 'service-4',
      title: 'برامج التغذية المخصصة',
      description: 'إعداد خطط تغذية مخصصة لكل نوع من الزواحف بناءً على احتياجاته الغذائية.',
      image_url: 'https://i.ibb.co/placeholder4.jpg',
      icon: '🍖',
      sort_order: 4,
      is_published: 1
    }
  ];

  for (const service of services) {
    await conn.query(`
      INSERT INTO services (id, title, description, image_url, icon, price, sort_order, is_published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE title = VALUES(title)
    `, [
      service.id,
      service.title,
      service.description,
      service.image_url,
      service.icon,
      service.price,
      service.sort_order,
      service.is_published
    ]);
  }

  console.log(`Services seeded: ${services.length} items`);

  await conn.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
