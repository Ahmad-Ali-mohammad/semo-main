import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM policies ORDER BY last_updated DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM policies WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `policy-${Date.now()}`;
  await pool.query(
    `INSERT INTO policies (id, type, title, content, last_updated, is_active, icon) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, d.type, d.title, d.content ?? '', d.last_updated || new Date().toISOString().slice(0, 10), d.is_active !== false ? 1 : 0, d.icon ?? null]
  );
  return findById(id);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  await pool.query(
    `UPDATE policies SET type=?, title=?, content=?, last_updated=?, is_active=?, icon=? WHERE id=?`,
    [d.type, d.title, d.content ?? '', d.last_updated, d.is_active ? 1 : 0, d.icon ?? null, id]
  );
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM policies WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
