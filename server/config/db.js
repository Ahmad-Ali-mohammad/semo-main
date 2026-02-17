import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'semo_reptile_house',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
});

export function isDbConfigured() {
  return !!(process.env.DB_HOST || process.env.DB_USER || process.env.DB_NAME);
}

export default pool;
