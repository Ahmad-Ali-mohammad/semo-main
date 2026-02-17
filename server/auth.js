import crypto from 'crypto';
import { read, write } from './store.js';

const USERS_KEY = 'users';

function toHex(buffer) {
  return Buffer.from(buffer).toString('hex');
}

function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const combined = Buffer.concat([salt, Buffer.from(password, 'utf8')]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export function findUserByEmail(email) {
  const users = read(USERS_KEY, []);
  return users.find(u => (u.email || '').toLowerCase() === email.toLowerCase()) || null;
}

export function verifyLogin(email, password) {
  const user = findUserByEmail(email);
  if (!user || !user.passwordSalt || !user.passwordHash) return null;
  const computed = hashPassword(password, user.passwordSalt);
  if (computed !== user.passwordHash) return null;
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function saveUser(user) {
  let users = read(USERS_KEY, []);
  const idx = users.findIndex(u => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  write(USERS_KEY, users);
  return user;
}

export function getAllUsers() {
  return read(USERS_KEY, []);
}

export function registerUser(name, email, password) {
  const users = read(USERS_KEY, []);
  if (users.some(u => (u.email || '').toLowerCase() === email.toLowerCase())) {
    return { error: 'البريد مستخدم مسبقاً' };
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const user = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: 'user',
    passwordSalt: salt,
    passwordHash,
  };
  saveUser(user);
  const { passwordHash: _, passwordSalt: __, ...safe } = user;
  return { user: safe };
}
