import pool from '../config/db.js';
import { rowToCamel, rowsToCamel } from '../utils/rowMapper.js';

export async function getCustomCategories() {
  const [rows] = await pool.query('SELECT value, label FROM custom_categories ORDER BY id');
  return rowsToCamel(rows);
}

export async function addCustomCategory(data) {
  const value = (data.value || '').trim();
  const label = (data.label || value).trim();
  if (!value) return getCustomCategories();
  await pool.query('INSERT IGNORE INTO custom_categories (value, label) VALUES (?, ?)', [value, label]);
  return getCustomCategories();
}

export async function getCustomSpecies() {
  const [rows] = await pool.query('SELECT species FROM custom_species ORDER BY id');
  return rows.map(r => r.species);
}

export async function addCustomSpecies(species) {
  const s = (typeof species === 'string' ? species : species?.species || '').trim();
  if (!s) return getCustomSpecies();
  await pool.query('INSERT IGNORE INTO custom_species (species) VALUES (?)', [s]);
  return getCustomSpecies();
}
