import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM addresses ORDER BY id DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [Number(id)]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const [r] = await pool.query(
    `INSERT INTO addresses (label, street, city, country, is_default) VALUES (?, ?, ?, ?, ?)`,
    [d.label, d.street ?? '', d.city, d.country, d.is_default ? 1 : 0]
  );
  return findById(r.insertId);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data });
  const fields = ['label', 'street', 'city', 'country', 'is_default'];
  const set = [];
  const vals = [];
  for (const f of fields) {
    if (d[f] !== undefined) {
      set.push(`${f} = ?`);
      vals.push(f === 'is_default' ? (d[f] ? 1 : 0) : d[f]);
    }
  }
  if (set.length === 0) return existing;
  vals.push(Number(id));
  await pool.query(`UPDATE addresses SET ${set.join(', ')} WHERE id = ?`, vals);
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM addresses WHERE id = ?', [Number(id)]);
  return r.affectedRows > 0;
}
