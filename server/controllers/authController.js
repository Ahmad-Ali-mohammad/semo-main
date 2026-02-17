import crypto from 'crypto';
import * as UserModel from '../models/UserModel.js';

function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const combined = Buffer.concat([salt, Buffer.from(password, 'utf8')]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });
    }
    const user = await UserModel.findByEmail(email);
    if (!user || !user.passwordSalt || !user.passwordHash) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }
    const computed = hashPassword(password, user.passwordSalt);
    if (computed !== user.passwordHash) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }
    const { passwordHash, passwordSalt, ...safe } = user;
    res.json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور مطلوبة' });
    }
    const existing = await UserModel.findByEmail(email);
    if (existing) return res.status(409).json({ error: 'البريد مستخدم مسبقاً' });
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const user = {
      id: `user-${Date.now()}`,
      name,
      email: email.trim().toLowerCase(),
      role: 'user',
      passwordHash,
      passwordSalt: salt,
    };
    await UserModel.create(user);
    const { passwordHash: _, passwordSalt: __, ...safe } = user;
    res.status(201).json({ user: safe });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
