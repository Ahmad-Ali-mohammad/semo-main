import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query(
    'SELECT * FROM media_folders WHERE is_active = 1 ORDER BY name ASC'
  );
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM media_folders WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `folder-${Date.now()}`;

  await pool.query(
    'INSERT INTO media_folders (id, name, parent_id, is_active) VALUES (?, ?, ?, ?)',
    [id, d.name, d.parent_id || null, d.is_active !== false ? 1 : 0]
  );
  return findById(id);
}

export async function update(id, data) {
  const d = objToSnake(data);
  await pool.query(
    'UPDATE media_folders SET name = ?, parent_id = ?, is_active = ? WHERE id = ?',
    [d.name, d.parent_id || null, d.is_active ? 1 : 0, id]
  );
  return findById(id);
}

export async function remove(id) {
  // Move items to default folder before deleting
  await pool.query(
    "UPDATE media_items SET folder_id = 'folder-default' WHERE folder_id = ?",
    [id]
  );
  const [r] = await pool.query('DELETE FROM media_folders WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
