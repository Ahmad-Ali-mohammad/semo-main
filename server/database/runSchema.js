/**
 * تنفيذ schema قاعدة البيانات من Node (لا حاجة لأمر mysql في الطرفية)
 * تشغيل: cd server && npm run db:schema
 */
import 'dotenv/config';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// تحميل .env من مجلد server إن وُجد
try {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach((line) => {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
    });
  }
} catch (_) {}

const config = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function run() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');
  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection(config);
  console.log('Running schema...');
  await conn.query(sql);
  await conn.end();
  console.log('Database semo_reptile_house created and schema applied.');
}

run().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
