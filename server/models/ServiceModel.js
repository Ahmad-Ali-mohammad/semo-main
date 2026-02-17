import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

/**
 * Get all services, optionally filter by published status
 */
export async function findAll(publishedOnly = false) {
  let query = 'SELECT * FROM services';
  const params = [];

  if (publishedOnly) {
    query += ' WHERE is_published = 1';
  }

  query += ' ORDER BY sort_order ASC, created_at DESC';

  const [rows] = await pool.query(query, params);
  return rowsToCamel(rows);
}

/**
 * Get single service by ID
 */
export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM services WHERE id = ?', [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

/**
 * Create new service
 */
export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `service-${Date.now()}`;

  await pool.query(
    `INSERT INTO services
     (id, title, description, image_url, icon, price, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      d.title,
      d.description || '',
      d.image_url || '',
      d.icon || null,
      d.price || null,
      d.sort_order || 0,
      d.is_published !== false ? 1 : 0
    ]
  );

  return findById(id);
}

/**
 * Update existing service
 */
export async function update(id, data) {
  const d = objToSnake(data);

  await pool.query(
    `UPDATE services
     SET title = ?, description = ?, image_url = ?, icon = ?,
         price = ?, sort_order = ?, is_published = ?
     WHERE id = ?`,
    [
      d.title,
      d.description,
      d.image_url,
      d.icon,
      d.price,
      d.sort_order,
      d.is_published ? 1 : 0,
      id
    ]
  );

  return findById(id);
}

/**
 * Delete service
 */
export async function remove(id) {
  const [result] = await pool.query('DELETE FROM services WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Update sort order for multiple services
 */
export async function updateSortOrders(items) {
  // items: [{ id: 'service-1', sortOrder: 1 }, ...]
  const promises = items.map(item =>
    pool.query('UPDATE services SET sort_order = ? WHERE id = ?', [item.sortOrder, item.id])
  );
  await Promise.all(promises);
  return true;
}
