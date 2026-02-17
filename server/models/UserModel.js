import pool from '../config/db.js';
import crypto from 'crypto';
import { read, write } from '../store.js';
import { rowToCamel, rowsToCamel, objToSnake } from '../utils/rowMapper.js';

const USERS_KEY = 'users';

function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const combined = Buffer.concat([salt, Buffer.from(password, 'utf8')]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

function defaultUsers() {
  const adminSalt = 'b8df467246fcbecdd4fb7606fbce6e8c';
  const userSalt = '183281d4c8042e5d65a4f00d7eb0e369';
  return [
    {
      id: 'admin-1',
      name: 'Admin',
      email: 'admin@reptilehouse.sy',
      role: 'admin',
      avatarUrl: null,
      passwordSalt: adminSalt,
      passwordHash: hashPassword('admin123', adminSalt),
    },
    {
      id: 'user-1',
      name: 'User',
      email: 'user@reptilehouse.sy',
      role: 'user',
      avatarUrl: null,
      passwordSalt: userSalt,
      passwordHash: hashPassword('user123', userSalt),
    },
  ];
}

function readUsers() {
  const users = read(USERS_KEY, null);
  if (Array.isArray(users) && users.length > 0) return users;
  const seeded = defaultUsers();
  write(USERS_KEY, seeded);
  return seeded;
}

function writeUsers(users) {
  write(USERS_KEY, users);
}

export async function findAll() {
  try {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return rowsToCamel(rows);
  } catch {
    return readUsers();
  }
}

export async function findById(id) {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0] ? rowToCamel(rows[0]) : null;
  } catch {
    return readUsers().find((u) => u.id === id) || null;
  }
}

export async function findByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    return rows[0] ? rowToCamel(rows[0]) : null;
  } catch {
    return readUsers().find((u) => u.email?.trim().toLowerCase() === normalizedEmail) || null;
  }
}

export async function create(data) {
  const d = objToSnake(data);
  try {
    await pool.query(
      'INSERT INTO users (id, name, email, role, avatar_url, password_hash, password_salt) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [d.id, d.name, d.email, d.role || 'user', d.avatar_url || null, d.password_hash || null, d.password_salt || null]
    );
    return findById(data.id);
  } catch {
    const users = readUsers();
    const created = {
      id: data.id,
      name: data.name,
      email: data.email?.trim().toLowerCase(),
      role: data.role || 'user',
      avatarUrl: data.avatarUrl || null,
      passwordHash: data.passwordHash || null,
      passwordSalt: data.passwordSalt || null,
    };
    users.push(created);
    writeUsers(users);
    return created;
  }
}

export async function update(id, data) {
  const d = objToSnake(data);
  const allowed = ['name', 'email', 'role', 'avatar_url', 'password_hash', 'password_salt'];
  const set = [];
  const vals = [];
  for (const k of allowed) {
    if (d[k] !== undefined) {
      set.push(`${k} = ?`);
      vals.push(d[k]);
    }
  }
  if (set.length === 0) return findById(id);
  try {
    vals.push(id);
    await pool.query(`UPDATE users SET ${set.join(', ')} WHERE id = ?`, vals);
    return findById(id);
  } catch {
    const users = readUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    const next = { ...users[index], ...data };
    if (next.email) next.email = String(next.email).trim().toLowerCase();
    users[index] = next;
    writeUsers(users);
    return next;
  }
}

export async function remove(id) {
  try {
    const [r] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return r.affectedRows > 0;
  } catch {
    const users = readUsers();
    const next = users.filter((u) => u.id !== id);
    if (next.length === users.length) return false;
    writeUsers(next);
    return true;
  }
}
