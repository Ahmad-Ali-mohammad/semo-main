import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/UserModel.js';

function hashPassword(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const combined = Buffer.concat([salt, Buffer.from(password, 'utf8')]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

function sanitizeUser(user) {
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

function getJwtSecret() {
  const secret = String(process.env.JWT_SECRET || '').trim();
  return secret || null;
}

function issueToken(user) {
  const secret = getJwtSecret();
  if (!secret) throw new Error('JWT secret is not configured on server');
  const expiresIn = String(process.env.JWT_EXPIRES_IN || '12h').trim();
  return jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    secret,
    {
      subject: user.id,
      expiresIn,
    }
  );
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
    const safe = sanitizeUser(user);
    const token = issueToken(safe);
    res.json({ user: safe, token });
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
    const safe = sanitizeUser(user);
    const token = issueToken(safe);
    res.status(201).json({ user: safe, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function bootstrapAdmin(req, res) {
  try {
    const { name, email, password, secret } = req.body || {};
    if (!name || !email || !password || !secret) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور والرمز السري مطلوبة' });
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
    }

    const expectedSecret = String(process.env.BOOTSTRAP_ADMIN_SECRET || '').trim();
    if (!expectedSecret) {
      return res.status(503).json({ error: 'Bootstrap admin secret is not configured on server' });
    }
    if (secret !== expectedSecret) {
      return res.status(403).json({ error: 'الرمز السري غير صحيح' });
    }

    const hasAdmin = await UserModel.hasAnyAdmin();
    if (hasAdmin) {
      return res.status(409).json({ error: 'يوجد حساب مدير بالفعل. لا يمكن التهيئة مرة أخرى.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await UserModel.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'البريد مستخدم مسبقًا' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const admin = {
      id: `admin-${Date.now()}`,
      name: String(name).trim(),
      email: normalizedEmail,
      role: 'admin',
      passwordHash,
      passwordSalt: salt,
    };
    await UserModel.create(admin);

    const safe = sanitizeUser(admin);
    const token = issueToken(safe);
    res.status(201).json({ user: safe, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
