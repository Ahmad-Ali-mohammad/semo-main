import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM articles ORDER BY id DESC');
  return rowsToCamel(rows);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [Number(id)]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

export async function create(data) {
  const d = objToSnake(data);
  const [r] = await pool.query(
    `INSERT INTO articles (title, excerpt, content, category, date, author, image) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [d.title, d.excerpt ?? '', d.content ?? null, d.category, d.date, d.author, d.image ?? '']
  );
  return findById(r.insertId);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data });
  const fields = ['title', 'excerpt', 'content', 'category', 'date', 'author', 'image'];
  const set = [];
  const vals = [];
  for (const f of fields) {
    if (d[f] !== undefined) {
      set.push(`${f} = ?`);
      vals.push(d[f]);
    }
  }
  if (set.length === 0) return existing;
  vals.push(Number(id));
  await pool.query(`UPDATE articles SET ${set.join(', ')} WHERE id = ?`, vals);
  return findById(id);
}

export async function remove(id) {
  const [r] = await pool.query('DELETE FROM articles WHERE id = ?', [Number(id)]);
  return r.affectedRows > 0;
}
