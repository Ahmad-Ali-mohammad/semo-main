import pool from '../config/db.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

async function attachOptions(groups) {
  if (!groups?.length) return groups;
  const ids = groups.map(g => g.id);
  const placeholders = ids.map(() => '?').join(',');
  const [rows] = await pool.query(`SELECT * FROM filter_options WHERE filter_group_id IN (${placeholders}) ORDER BY sort_order, id`, ids);
  const byGroup = {};
  for (const r of rows) {
    const row = rowToCamel(r);
    if (!byGroup[row.filterGroupId]) byGroup[row.filterGroupId] = [];
    byGroup[row.filterGroupId].push({
      id: row.id,
      name: row.name,
      value: row.value,
      isActive: !!row.isActive,
      order: row.sortOrder ?? 0,
    });
  }
  return groups.map(g => ({ ...g, options: byGroup[g.id] || [] }));
}

export async function findAll() {
  const [rows] = await pool.query('SELECT * FROM filter_groups ORDER BY created_at');
  const list = rowsToCamel(rows);
  return attachOptions(list);
}

export async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM filter_groups WHERE id = ?', [id]);
  const group = rows[0] ? rowToCamel(rows[0]) : null;
  if (!group) return null;
  const [list] = await attachOptions([group]);
  return list[0];
}

export async function create(data) {
  const d = objToSnake(data);
  const id = d.id || `fg-${Date.now()}`;
  await pool.query(
    `INSERT INTO filter_groups (id, name, type, is_active, applies_to) VALUES (?, ?, ?, ?, ?)`,
    [id, d.name, d.type ?? 'custom', d.is_active !== undefined ? (d.is_active ? 1 : 0) : 1, d.applies_to ?? 'products']
  );
  const options = data.options || [];
  for (let i = 0; i < options.length; i++) {
    const o = options[i];
    const oid = o.id || `opt-${Date.now()}-${i}`;
    await pool.query(
      'INSERT INTO filter_options (id, filter_group_id, name, value, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [oid, id, o.name, o.value ?? o.name, o.isActive !== false ? 1 : 0, o.order ?? i]
    );
  }
  return findById(id);
}

export async function update(id, data) {
  const existing = await findById(id);
  if (!existing) return null;
  const d = objToSnake({ ...existing, ...data, id });
  await pool.query(
    `UPDATE filter_groups SET name=?, type=?, is_active=?, applies_to=? WHERE id=?`,
    [d.name, d.type ?? 'custom', d.is_active ? 1 : 0, d.applies_to ?? 'products', id]
  );
  if (data.options && Array.isArray(data.options)) {
    await pool.query('DELETE FROM filter_options WHERE filter_group_id = ?', [id]);
    for (let i = 0; i < data.options.length; i++) {
      const o = data.options[i];
      const oid = o.id || `opt-${Date.now()}-${i}`;
      await pool.query(
        'INSERT INTO filter_options (id, filter_group_id, name, value, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
        [oid, id, o.name, o.value ?? o.name, o.isActive !== false ? 1 : 0, o.order ?? i]
      );
    }
  }
  return findById(id);
}

export async function remove(id) {
  await pool.query('DELETE FROM filter_options WHERE filter_group_id = ?', [id]);
  const [r] = await pool.query('DELETE FROM filter_groups WHERE id = ?', [id]);
  return r.affectedRows > 0;
}
