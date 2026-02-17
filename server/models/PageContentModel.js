import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM page_contents ORDER BY updated_at DESC, created_at DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM page_contents WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function findBySlug(slug) {
  const [rows] = await pool.query('SELECT * FROM page_contents WHERE slug = ? LIMIT 1', [slug]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `page-${Date.now()}`;
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await pool.query(
    `INSERT INTO page_contents (id, slug, title, excerpt, content, seo_title, seo_description, is_active, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      d.slug || id,
      d.title || '',
      d.excerpt || '',
      d.content || '',
      d.seo_title || null,
      d.seo_description || null,
      d.is_active !== false ? 1 : 0,
      d.updated_at || now,
    ],
  );
  return findById(id);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
  await pool.query(
    `UPDATE page_contents
     SET slug=?, title=?, excerpt=?, content=?, seo_title=?, seo_description=?, is_active=?, updated_at=?
     WHERE id=?`,
    [
      d.slug,
      d.title,
      d.excerpt || '',
      d.content || '',
      d.seo_title || null,
      d.seo_description || null,
      d.is_active ? 1 : 0,
      now,
      id,
    ],
  );
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM page_contents WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
