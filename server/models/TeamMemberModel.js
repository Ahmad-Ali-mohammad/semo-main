import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM team_members ORDER BY created_at');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM team_members WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `member-${Date.now()}`;
  await pool.query(
    `INSERT INTO team_members (id, name, role, image_url, bio, is_active) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, d.name, d.role, d.image_url ?? '', d.bio ?? null, d.is_active !== undefined ? (d.is_active ? 1 : 0) : 1]
  );
  return findById(id);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  await pool.query(
    `UPDATE team_members SET name=?, role=?, image_url=?, bio=?, is_active=? WHERE id=?`,
    [d.name, d.role, d.image_url ?? '', d.bio ?? null, d.is_active ? 1 : 0, id]
  );
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM team_members WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
