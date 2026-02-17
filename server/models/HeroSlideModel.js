import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM hero_slides ORDER BY created_at');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM hero_slides WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  await pool.query(
    `INSERT INTO hero_slides (id, image, title, subtitle, button_text, link, active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      d.id || `slide-${Date.now()}`,
      d.image ?? '',
      d.title,
      d.subtitle ?? '',
      d.button_text ?? '',
      d.link ?? '',
      d.active !== undefined ? (d.active ? 1 : 0) : 1,
    ]
  );
  return findById(d.id || `slide-${Date.now()}`);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  await pool.query(
    `UPDATE hero_slides SET image=?, title=?, subtitle=?, button_text=?, link=?, active=? WHERE id=?`,
    [d.image ?? '', d.title, d.subtitle ?? '', d.button_text ?? '', d.link ?? '', d.active ? 1 : 0, id]
  );
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM hero_slides WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
