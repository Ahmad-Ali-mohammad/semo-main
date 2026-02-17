export function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

export function toSnake(str) {
  return str.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
}

const BOOLEAN_KEYS = new Set([
  'is_available',
  'is_active',
  'is_default',
  'active',
  'robots_index',
  'robots_follow',
  'sitemap_enabled',
]);

export function rowToCamel(row) {
  if (!row || typeof row !== 'object') return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const key = toCamel(k);
    out[key] = BOOLEAN_KEYS.has(k) ? !!v : v;
  }
  return out;
}

export function rowsToCamel(rows) {
  return Array.isArray(rows) ? rows.map(rowToCamel) : [];
}

export function objToSnake(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined) continue;
    out[toSnake(k)] = v;
  }
  return out;
}
