import pool from '../config/db.js';
import { rowToCamel, objToSnake } from '../utils/rowMapper.js';

export async function get(userId = 'default') {
  const [rows] = await pool.query(
    'SELECT * FROM user_preferences WHERE user_id = ?',
    [userId]
  );

  if (rows[0]) {
    return rowToCamel(rows[0]);
  }

  // Create default if not exists
  await pool.query(
    `INSERT INTO user_preferences (user_id, theme, language, notifications_enabled)
     VALUES (?, 'dark', 'ar', 1)`,
    [userId]
  );

  const [newRows] = await pool.query(
    'SELECT * FROM user_preferences WHERE user_id = ?',
    [userId]
  );
  return rowToCamel(newRows[0]);
}

export async function update(userId = 'default', data) {
  const d = objToSnake(data);
  await pool.query(
    `UPDATE user_preferences
     SET theme = ?, language = ?, notifications_enabled = ?
     WHERE user_id = ?`,
    [
      d.theme || 'dark',
      d.language || 'ar',
      d.notifications_enabled !== false ? 1 : 0,
      userId
    ]
  );
  return get(userId);
}
