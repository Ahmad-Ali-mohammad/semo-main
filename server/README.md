# Backend API - Reptile House

Express API with two modes:
- MySQL mode (`USE_MYSQL=1`)
- JSON fallback mode (when MySQL is disabled)

## Quick start (dev)

```bash
npm install
npm run dev
```

Runs on `http://localhost:3001`.

## Environment

Copy and edit:

```bash
copy .env.example .env
```

Key variables:
- `NODE_ENV=production` for production behavior
- `TRUST_PROXY=1` behind reverse proxy/load balancer
- `ALLOWED_ORIGINS` comma-separated list for CORS
- `RATE_LIMIT_MAX` global API limit
- `AUTH_RATE_LIMIT_MAX` auth endpoints limit
- `USE_MYSQL=1` to enable MySQL mode

## Production behavior

If root `dist` exists, server also serves frontend build (SPA fallback enabled).

## Security middleware

- Helmet
- API rate limiting
- Auth route rate limiting
- Optional strict CORS allow-list
- Compression
