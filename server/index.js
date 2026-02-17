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

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';
const defaultRateLimitMax = isProduction ? 100 : 10000;
const defaultAuthRateLimitMax = isProduction ? 20 : 2000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendDistPath = path.resolve(__dirname, '../dist');

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const trustProxyValue = String(process.env.TRUST_PROXY || '').trim();
if (trustProxyValue) {
  app.set('trust proxy', trustProxyValue === '1' ? 1 : trustProxyValue);
}
app.disable('x-powered-by');

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.RATE_LIMIT_MAX, defaultRateLimitMax),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parsePositiveInt(process.env.AUTH_RATE_LIMIT_MAX, defaultAuthRateLimitMax),
  message: 'Too many authentication attempts, please try again later.'
});
app.use('/api/auth', authLimiter);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.length === 0) {
      if (!isProduction && origin === 'http://localhost:5173') {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked: origin is not allowed'));
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('CORS blocked: origin is not allowed'));
  },
  credentials: true
}));

app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api', router);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (isProduction && fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get(/^(?!\/api|\/health).*/, (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`[server] Running on port ${PORT}`);
  console.log(`[server] API available at http://localhost:${PORT}/api`);
  console.log(`[server] Health check at http://localhost:${PORT}/health`);
  if (isProduction && fs.existsSync(frontendDistPath)) {
    console.log(`[server] Serving frontend build from ${frontendDistPath}`);
  }
});

export default app;
