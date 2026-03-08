import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import router from './routes/index.js';
import { ensureMediaRoot, uploadsRoot } from './utils/mediaStorage.js';
import { startBackupScheduler } from './utils/backupService.js';

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const defaultRateLimitMax = isProduction ? 100 : 10000;
const defaultAuthRateLimitMax = isProduction ? 20 : 2000;
const defaultAdminOverviewRateLimitMax = isProduction ? 120 : 5000;
const defaultNonApiWriteRateLimitMax = isProduction ? 20 : 2000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../dist');

await ensureMediaRoot();

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const trustProxyValue = String(process.env.TRUST_PROXY || '').trim();
if (trustProxyValue) {
  app.set('trust proxy', trustProxyValue === '1' ? 1 : trustProxyValue);
}
app.disable('x-powered-by');

const isAdminOverviewPath = (req) => {
  const originalUrl = String(req.originalUrl || '').split('?')[0];
  return req.path === '/system/admin-overview' || originalUrl.endsWith('/api/system/admin-overview');
};

const isApiOrInternalPath = (pathname) =>
  pathname === '/health' || pathname === '/api' || pathname.startsWith('/api/') || pathname.startsWith('/uploads/');

const ALLOWED_SPA_PATHS = new Set([
  '/',
  '/login',
  '/register',
  '/profile',
  '/wishlist',
  '/showcase',
  '/orders',
  '/cart',
  '/checkout',
  '/order-confirmation',
  '/order-tracking',
  '/forgot-password',
  '/reset-password',
  '/about',
  '/contact',
  '/shipping-policy',
  '/return-policy',
  '/warranty',
  '/privacy',
  '/terms',
  '/dashboard',
  '/blog',
  '/services',
  '/offers',
  '/supplies',
]);

const ALLOWED_SPA_PREFIXES = ['/product/', '/article/', '/order-tracking/', '/dashboard/'];
const BLOCKED_PROBE_PREFIXES = ['/wp-', '/wordpress', '/xmlrpc.php', '/.git', '/.env', '/cgi-bin', '/phpmyadmin', '/adminer'];

const shouldServeSpaIndex = (req) => {
  const method = String(req.method || '').toUpperCase();
  if (!['GET', 'HEAD'].includes(method)) return false;

  const pathname = String(req.path || '/');
  const normalizedPath = pathname.replace(/\/+$/, '') || '/';
  if (isApiOrInternalPath(normalizedPath)) return false;

  if (/\s/.test(normalizedPath)) return false;
  if (path.extname(normalizedPath)) return false;

  const loweredPath = normalizedPath.toLowerCase();
  if (BLOCKED_PROBE_PREFIXES.some((prefix) => loweredPath.startsWith(prefix))) {
    return false;
  }

  if (ALLOWED_SPA_PATHS.has(normalizedPath)) return true;
  return ALLOWED_SPA_PREFIXES.some((prefix) => normalizedPath.startsWith(prefix));
};

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'", 'https:', 'wss:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      ...(isProduction ? { upgradeInsecureRequests: [] } : {}),
    },
  },
  permissionsPolicy: {
    features: {
      accelerometer: [],
      autoplay: [],
      camera: [],
      geolocation: [],
      gyroscope: [],
      magnetometer: [],
      microphone: [],
      payment: [],
      usb: [],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Mirror edge policy at app layer for direct app-port access and internal scans.
app.use((_, res, next) => {
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  res.setHeader('Permissions-Policy', 'accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()');
  next();
});

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.RATE_LIMIT_MAX, defaultRateLimitMax),
  skip: isAdminOverviewPath,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/', globalLimiter);

const adminOverviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.ADMIN_OVERVIEW_RATE_LIMIT_MAX, defaultAdminOverviewRateLimitMax),
  message: 'Too many dashboard refresh requests, please try again in a minute.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/system/admin-overview', adminOverviewLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.AUTH_RATE_LIMIT_MAX, defaultAuthRateLimitMax),
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

const nonApiWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.NON_API_WRITE_RATE_LIMIT_MAX, defaultNonApiWriteRateLimitMax),
  skip: (req) => {
    const method = String(req.method || '').toUpperCase();
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) return true;
    return isApiOrInternalPath(String(req.path || ''));
  },
  message: 'Too many non-API write attempts, please try again later.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use(nonApiWriteLimiter);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const normalizeOrigin = (origin) => {
  try {
    const url = new URL(origin);
    const isDefaultPort =
      (url.protocol === 'http:' && (url.port === '' || url.port === '80')) ||
      (url.protocol === 'https:' && (url.port === '' || url.port === '443'));
    return `${url.protocol}//${url.hostname}${isDefaultPort ? '' : `:${url.port}`}`;
  } catch {
    return String(origin || '').trim();
  }
};

const allowedOriginSet = new Set(
  allowedOrigins
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean)
);

// Keep direct loopback app access usable for local diagnostics.
allowedOriginSet.add(`http://localhost:${PORT}`);
allowedOriginSet.add(`http://127.0.0.1:${PORT}`);

const configuredPublicOrigin = normalizeOrigin(process.env.PUBLIC_SERVER_URL || '');
if (configuredPublicOrigin) {
  allowedOriginSet.add(configuredPublicOrigin);
}

const isDevViteOrigin = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    if (!['http:', 'https:'].includes(url.protocol)) return false;
    if (url.port !== '5173') return false;
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return true;
    // Allow private/local network hosts in dev for Vite access from LAN/WSL.
    if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(url.hostname)) return true;
    return false;
  } catch {
    return false;
  }
};

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOriginSet.size === 0) {
      if (!isProduction && isDevViteOrigin(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked: origin is not allowed'));
    }

    if (allowedOriginSet.has(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked: origin is not allowed'));
  },
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(uploadsRoot));

app.use((req, res, next) => {
  const pathname = String(req.path || '');
  if (isApiOrInternalPath(pathname)) return next();

  const method = String(req.method || '').toUpperCase();
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return res.status(405).json({ error: 'Method not allowed for this route' });
  }

  return next();
});

app.use('/api', router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (isProduction && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath, { index: false, fallthrough: true }));
  app.get('*', (req, res, next) => {
    if (!shouldServeSpaIndex(req)) return next();
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  if (status >= 500) {
    console.error('Error:', err);
  }

  res.status(status).json({
    error: status >= 500 && isProduction ? 'Internal server error' : (err?.message || 'Internal server error')
  });
});

app.listen(PORT, () => {
  const publicServerUrl = (process.env.PUBLIC_SERVER_URL || `http://127.0.0.1:${PORT}`).replace(/\/+$/, '');
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] API available at ${publicServerUrl}/api`);
  console.log(`[server] Health check at ${publicServerUrl}/health`);
  if (isProduction && fs.existsSync(frontendDistPath)) {
    console.log(`[server] Serving frontend build from ${frontendDistPath}`);
  }
  startBackupScheduler();
});

export default app;
