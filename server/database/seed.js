/**
 * Database seed script with no demo data.
 * Creates only the minimum system rows required by settings screens.
 * Run: cd server && npm run db:seed
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .forEach((line) => {
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

async function run() {
  const conn = await mysql.createConnection(db);

  // Remove known demo accounts and content if present.
  await conn.query('DELETE FROM users WHERE email IN (?, ?)', ['admin@reptilehouse.sy', 'user@reptilehouse.sy']);
  await conn.query('DELETE FROM services WHERE id IN (?, ?, ?, ?)', ['service-1', 'service-2', 'service-3', 'service-4']);
  await conn.query('DELETE FROM media_items WHERE id = ?', ['mascot-default']);
  await conn.query('DELETE FROM media_folders WHERE id = ?', ['folder-default']);
  await conn.query('DELETE FROM hero_slides WHERE id IN (?, ?)', ['1', '2']);
  await conn.query('DELETE FROM products WHERE image_url = ?', ['/assets/photo_2026-02-04_07-13-35.jpg']);
  console.log('Demo data cleanup completed.');

  // Keep required singleton rows only.
  await conn.query('INSERT IGNORE INTO company_info (id, name, name_english) VALUES (1, ?, ?)', ['Reptile House', 'Reptile House']);
  await conn.query('INSERT IGNORE INTO contact_info (id, phone, email, address, city, country, working_hours) VALUES (1, ?, ?, ?, ?, ?, ?)', [
    '',
    '',
    '',
    '',
    '',
    '',
  ]);
  await conn.query('INSERT IGNORE INTO shamcash_config (id, account_code, payment_instructions) VALUES (1, ?, ?)', ['', '']);
  await conn.query('INSERT IGNORE INTO seo_settings (id) VALUES (1)');
  await conn.query('INSERT IGNORE INTO user_preferences (id, user_id, theme, language, notifications_enabled) VALUES (1, ?, ?, ?, ?)', [
    'default',
    'dark',
    'ar',
    1,
  ]);
  console.log('System defaults ensured (without demo users/products/services).');

  await conn.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
