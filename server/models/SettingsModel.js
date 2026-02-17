import pool from '../config/db.js';
import { rowToCamel, objToSnake } from '../utils/rowMapper.js';

async function getSingle(table, id = 1) {
  const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]);
  return rows[0] ? rowToCamel(rows[0]) : null;
}

async function setSingle(table, id, data) {
  const d = objToSnake(data);
  const cols = Object.keys(d).filter(k => k !== 'id' && d[k] !== undefined);
  if (cols.length === 0) return getSingle(table, id);
  const set = cols.map(c => `${c} = ?`).join(', ');
  const vals = cols.map(c => {
    const v = d[c];
    if (typeof v === 'object' && v !== null && !(v instanceof Date)) return JSON.stringify(v);
    return v;
  });
  vals.push(id);
  await pool.query(`UPDATE ${table} SET ${set} WHERE id = ?`, vals);
  return getSingle(table, id);
}

export const companyInfo = {
  get: () => getSingle('company_info'),
  set: (data) => setSingle('company_info', 1, data),
};

export const contactInfo = {
  get: () => getSingle('contact_info'),
  set: (data) => setSingle('contact_info', 1, data),
};

export const shamcashConfig = {
  get: () => getSingle('shamcash_config'),
  set: (data) => setSingle('shamcash_config', 1, data),
};

export const seoSettings = {
  get: () => getSingle('seo_settings'),
  set: (data) => setSingle('seo_settings', 1, data),
};
