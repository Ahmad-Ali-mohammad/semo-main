import jwt from 'jsonwebtoken';

function getTokenFromHeader(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

function getJwtSecret() {
  const secret = String(process.env.JWT_SECRET || '').trim();
  return secret || null;
}

export function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return res.status(401).json({ error: 'غير مصرح. يرجى تسجيل الدخول.' });

  const secret = getJwtSecret();
  if (!secret) return res.status(500).json({ error: 'JWT secret is not configured on server' });

  try {
    const payload = jwt.verify(token, secret);
    req.authUser = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
    return next();
  } catch {
    return res.status(401).json({ error: 'رمز الدخول غير صالح أو منتهي الصلاحية' });
  }
}

export function requireRoles(...roles) {
  const allowedRoles = new Set(roles);
  return (req, res, next) => {
    requireAuth(req, res, () => {
      if (!req.authUser || !allowedRoles.has(req.authUser.role)) {
        return res.status(403).json({ error: 'لا تملك صلاحية تنفيذ هذا الإجراء' });
      }
      return next();
    });
  };
}
