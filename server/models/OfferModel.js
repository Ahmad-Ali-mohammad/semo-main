import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM offers ORDER BY created_at DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM offers WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `offer-${Date.now()}`;
  await pool.query(
    `INSERT INTO offers (id, title, description, image_url, discount_percentage, start_date, end_date, is_active, target_category, button_text, button_link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      d.title,
      d.description ?? null,
      d.image_url ?? '',
      d.discount_percentage ?? null,
      d.start_date,
      d.end_date,
      d.is_active !== undefined ? (d.is_active ? 1 : 0) : 1,
      d.target_category ?? null,
      d.button_text ?? null,
      d.button_link ?? null,
    ]
  );
  return findById(id);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  const fields = ['title', 'description', 'image_url', 'discount_percentage', 'start_date', 'end_date', 'is_active', 'target_category', 'button_text', 'button_link'];
  const set = fields.map(f => `${f}=?`).join(', ');
  const vals = fields.map(f => (f === 'is_active' ? (d[f] ? 1 : 0) : d[f]));
  vals.push(id);
  await pool.query(`UPDATE offers SET ${set} WHERE id=?`, vals);
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM offers WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
