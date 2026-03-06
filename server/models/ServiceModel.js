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
  const [sortRows] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS max_sort_order FROM services');
  const nextSortOrder = d.sort_order != null ? d.sort_order : Number(sortRows?.[0]?.max_sort_order || 0) + 1;

  await pool.query(
    `INSERT INTO services
     (id, title, description, image_url, icon, price, sort_order, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      d.title?.trim(),
      d.description || '',
      d.image_url || '',
      d.icon || null,
      d.price ?? null,
      nextSortOrder,
      d.is_published !== false ? 1 : 0
    ]
  );

  return findById(id);
}

/**
 * Update existing service
 */
export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;

  const d = objToSnake(data);
  const merged = {
    title: d.title?.trim() ?? existing.title,
    description: d.description ?? existing.description ?? '',
    image_url: d.image_url ?? existing.imageUrl ?? '',
    icon: d.icon ?? existing.icon ?? null,
    price: d.price !== undefined ? d.price : (existing.price ?? null),
    sort_order: d.sort_order ?? existing.sortOrder ?? 0,
    is_published: d.is_published !== undefined ? d.is_published : existing.isPublished,
  };

  await pool.query(
    `UPDATE services
     SET title = ?, description = ?, image_url = ?, icon = ?,
         price = ?, sort_order = ?, is_published = ?
     WHERE id = ?`,
    [
      merged.title,
      merged.description,
      merged.image_url,
      merged.icon,
      merged.price,
      merged.sort_order,
      merged.is_published ? 1 : 0,
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
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const item of items) {
      await connection.query('UPDATE services SET sort_order = ? WHERE id = ?', [item.sortOrder, item.id]);
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
