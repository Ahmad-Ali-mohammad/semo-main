import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function getPath(key) {
  return path.join(DATA_DIR, `${key}.json`);
}

export function read(key, defaultValue = null) {
  ensureDataDir();
  const filePath = getPath(key);
  if (!fs.existsSync(filePath)) return defaultValue;
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

export function write(key, value) {
  ensureDataDir();
  const filePath = getPath(key);
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
  return value;
}
