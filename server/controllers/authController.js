import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/UserModel.js';
import { createPasswordHash, needsPasswordRehash, verifyPassword } from '../utils/passwords.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;
const MAX_NAME_LENGTH = 120;

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isValidEmail(email) {
  return EMAIL_PATTERN.test(email) && email.length <= 254;
}

function isValidPassword(password) {
  const length = String(password || '').length;
  return length >= MIN_PASSWORD_LENGTH && length <= MAX_PASSWORD_LENGTH;
}

function isValidName(name) {
  const normalized = String(name || '').trim();
  return normalized.length > 0 && normalized.length <= MAX_NAME_LENGTH;
}

function safeStringEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ''), 'utf8');
  const rightBuffer = Buffer.from(String(right || ''), 'utf8');
  if (leftBuffer.length !== rightBuffer.length || leftBuffer.length === 0) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
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
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });
    }

    const user = await UserModel.findByEmail(normalizedEmail);
    if (!user || !user.passwordSalt || !user.passwordHash) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    const passwordCheck = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!passwordCheck.ok) {
      return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
    }

    // Transparent upgrade for legacy hashes on successful login.
    if (needsPasswordRehash(user.passwordHash)) {
      const upgraded = createPasswordHash(password);
      await UserModel.update(user.id, {
        passwordHash: upgraded.passwordHash,
        passwordSalt: upgraded.passwordSalt,
      }).catch(() => {});
    }

    const safe = sanitizeUser(user);
    const token = issueToken(safe);
    return res.json({ user: safe, token });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name || '').trim();

    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور مطلوبة' });
    }

    if (!isValidName(normalizedName)) {
      return res.status(400).json({ error: 'اسم المستخدم غير صالح' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون بين 8 و 128 حرفًا' });
    }

    const existing = await UserModel.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'البريد مستخدم مسبقًا' });
    }

    const { passwordHash, passwordSalt } = createPasswordHash(password);
    const user = {
      id: `user-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      role: 'user',
      passwordHash,
      passwordSalt,
    };

    await UserModel.create(user);
    const safe = sanitizeUser(user);
    const token = issueToken(safe);
    return res.status(201).json({ user: safe, token });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function bootstrapAdmin(req, res) {
  try {
    const { name, email, password, secret } = req.body || {};
    const normalizedEmail = normalizeEmail(email);
    const normalizedName = String(name || '').trim();

    if (!normalizedName || !normalizedEmail || typeof password !== 'string' || !password || !secret) {
      return res.status(400).json({ error: 'الاسم والبريد وكلمة المرور والرمز السري مطلوبة' });
    }

    if (!isValidName(normalizedName)) {
      return res.status(400).json({ error: 'اسم المستخدم غير صالح' });
    }

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'البريد الإلكتروني غير صالح' });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({ error: 'كلمة المرور يجب أن تكون بين 8 و 128 حرفًا' });
    }

    const expectedSecret = String(process.env.BOOTSTRAP_ADMIN_SECRET || '').trim();
    if (!expectedSecret) {
      return res.status(503).json({ error: 'Bootstrap admin secret is not configured on server' });
    }

    if (!safeStringEqual(secret, expectedSecret)) {
      return res.status(403).json({ error: 'الرمز السري غير صحيح' });
    }

    const hasAdmin = await UserModel.hasAnyAdmin();
    if (hasAdmin) {
      return res.status(409).json({ error: 'يوجد حساب مدير بالفعل. لا يمكن التهيئة مرة أخرى.' });
    }

    const existing = await UserModel.findByEmail(normalizedEmail);
    if (existing) {
      return res.status(409).json({ error: 'البريد مستخدم مسبقًا' });
    }

    const { passwordHash, passwordSalt } = createPasswordHash(password);
    const admin = {
      id: `admin-${Date.now()}`,
      name: normalizedName,
      email: normalizedEmail,
      role: 'admin',
      passwordHash,
      passwordSalt,
    };

    await UserModel.create(admin);
    const safe = sanitizeUser(admin);
    const token = issueToken(safe);
    return res.status(201).json({ user: safe, token });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
