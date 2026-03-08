import { read, write } from './store.js';
import { createPasswordHash, verifyPassword } from './utils/passwords.js';

const USERS_KEY = 'users';

export function findUserByEmail(email) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = read(USERS_KEY, []);
  return users.find((user) => String(user.email || '').trim().toLowerCase() === normalizedEmail) || null;
}

export function verifyLogin(email, password) {
  const user = findUserByEmail(email);
  if (!user || !user.passwordSalt || !user.passwordHash) return null;

  const verification = verifyPassword(password, user.passwordSalt, user.passwordHash);
  if (!verification.ok) return null;

  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

export function saveUser(user) {
  const users = read(USERS_KEY, []);
  const index = users.findIndex((entry) => entry.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  write(USERS_KEY, users);
  return user;
}

export function getAllUsers() {
  return read(USERS_KEY, []);
}

export function registerUser(name, email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const users = read(USERS_KEY, []);
  if (users.some((user) => String(user.email || '').trim().toLowerCase() === normalizedEmail)) {
    return { error: 'البريد مستخدم مسبقًا' };
  }

  const { passwordHash, passwordSalt } = createPasswordHash(password);
  const user = {
    id: `user-${Date.now()}`,
    name,
    email: normalizedEmail,
    role: 'user',
    passwordSalt,
    passwordHash,
  };

  saveUser(user);
  const { passwordHash: _, passwordSalt: __, ...safe } = user;
  return { user: safe };
}
