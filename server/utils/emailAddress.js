const SIMPLE_EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i;
const MAX_EMAIL_LENGTH = 254;

function isValidDomain(domain) {
  const parts = domain.split('.');
  if (parts.length < 2) return false;
  return parts.every((part) => /^[A-Z0-9-]{1,63}$/i.test(part) && !part.startsWith('-') && !part.endsWith('-'));
}

export function sanitizeEmailAddress(value) {
  const email = String(value || '').trim().toLowerCase();
  if (!email || email.length > MAX_EMAIL_LENGTH) return null;
  if (!SIMPLE_EMAIL_PATTERN.test(email)) return null;

  const [, domain = ''] = email.split('@');
  if (!isValidDomain(domain)) return null;
  if (email.includes('..')) return null;

  return email;
}

export function normalizeRecipientList(input, maxRecipients = 20) {
  const source = Array.isArray(input)
    ? input
    : String(input || '')
        .split(/[,\n;]/)
        .map((value) => value.trim())
        .filter(Boolean);

  const unique = new Set();
  for (const value of source) {
    const email = sanitizeEmailAddress(value);
    if (!email || unique.has(email)) continue;
    unique.add(email);
    if (unique.size >= maxRecipients) break;
  }

  return Array.from(unique);
}
