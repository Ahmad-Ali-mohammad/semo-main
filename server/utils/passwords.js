import crypto from 'crypto';

const CURRENT_SCHEME = 'pbkdf2-sha256';
const PBKDF2_ITERATIONS = Number.parseInt(process.env.PASSWORD_PBKDF2_ITERATIONS || '210000', 10);
const PBKDF2_KEY_LENGTH = 32;
const LEGACY_SCHEME = 'sha256';

function hashLegacy(password, saltHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const combined = Buffer.concat([salt, Buffer.from(password, 'utf8')]);
  return crypto.createHash('sha256').update(combined).digest('hex');
}

function hashPbkdf2(password, saltHex, iterations = PBKDF2_ITERATIONS) {
  const salt = Buffer.from(saltHex, 'hex');
  const hash = crypto.pbkdf2Sync(password, salt, iterations, PBKDF2_KEY_LENGTH, 'sha256').toString('hex');
  return `${CURRENT_SCHEME}$${iterations}$${hash}`;
}

function safeBufferEqual(aHex, bHex) {
  try {
    const left = Buffer.from(String(aHex || ''), 'hex');
    const right = Buffer.from(String(bHex || ''), 'hex');
    if (left.length !== right.length || left.length === 0) return false;
    return crypto.timingSafeEqual(left, right);
  } catch {
    return false;
  }
}

function parseStoredHash(storedHash) {
  const value = String(storedHash || '').trim();
  const [scheme, iterationsRaw, hashHex] = value.split('$');
  if (scheme !== CURRENT_SCHEME || !iterationsRaw || !hashHex) {
    return null;
  }

  const iterations = Number.parseInt(iterationsRaw, 10);
  if (!Number.isFinite(iterations) || iterations <= 0) {
    return null;
  }

  return { iterations, hashHex };
}

export function createPasswordHash(password) {
  const saltHex = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPbkdf2(password, saltHex, PBKDF2_ITERATIONS);
  return { passwordHash, passwordSalt: saltHex, scheme: CURRENT_SCHEME };
}

export function verifyPassword(password, saltHex, storedHash) {
  if (!password || !saltHex || !storedHash) {
    return { ok: false, scheme: null };
  }

  const parsed = parseStoredHash(storedHash);
  if (parsed) {
    const candidate = hashPbkdf2(password, saltHex, parsed.iterations);
    const candidateHashHex = candidate.split('$')[2] || '';
    return { ok: safeBufferEqual(parsed.hashHex, candidateHashHex), scheme: CURRENT_SCHEME };
  }

  const legacyCandidate = hashLegacy(password, saltHex);
  return { ok: safeBufferEqual(storedHash, legacyCandidate), scheme: LEGACY_SCHEME };
}

export function needsPasswordRehash(storedHash) {
  const parsed = parseStoredHash(storedHash);
  if (!parsed) return true;
  return parsed.iterations < PBKDF2_ITERATIONS;
}
