import DOMPurify from 'dompurify';

const SANITIZE_OPTIONS: DOMPurify.Config = {
  USE_PROFILES: { html: true },
  FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'meta', 'link'],
  FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onabort', 'onblur', 'onchange', 'onsubmit'],
  ALLOW_DATA_ATTR: false,
};

export function sanitizeRichHtml(value?: string | null): string {
  const raw = String(value || '');
  if (!raw.trim()) return '';
  return DOMPurify.sanitize(raw, SANITIZE_OPTIONS);
}

export function toSafeHtml(value?: string | null): { __html: string } {
  return { __html: sanitizeRichHtml(value) };
}
