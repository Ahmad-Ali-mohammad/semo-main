import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM supplies ORDER BY id DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM supplies WHERE id = ?', [Number(id)]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const [r] = await pool.query(
    `INSERT INTO supplies (name, category, description, price, image_url, rating, is_available, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      d.name,
      d.category,
      d.description ?? null,
      d.price ?? 0,
      d.image_url ?? '',
      d.rating ?? 5,
      d.is_available !== undefined ? (d.is_available ? 1 : 0) : 1,
      d.status ?? 'متوفر',
    ]
  );
  return findById(r.insertId);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data });
  const fields = ['name', 'category', 'description', 'price', 'image_url', 'rating', 'is_available', 'status'];
  const set = [];
  const vals = [];
  for (const f of fields) {
    if (d[f] !== undefined) {
      set.push(`${f} = ?`);
      vals.push(f === 'is_available' ? (d[f] ? 1 : 0) : d[f]);
    }
  }
  if (set.length === 0) return existing;
  vals.push(Number(id));
  await pool.query(`UPDATE supplies SET ${set.join(', ')} WHERE id = ?`, vals);
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM supplies WHERE id = ?', [Number(id)]);
  return r.affectedRows > 0;
}
