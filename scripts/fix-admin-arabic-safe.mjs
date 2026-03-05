import fs from 'fs';
import path from 'path';
import ts from 'typescript';

const adminDir = path.resolve('pages/admin');

const targetFiles = [
  'CompanyInfoManagementPage.tsx',
  'ContactInfoManagementPage.tsx',
  'FiltersManagementPage.tsx',
  'OffersManagementPage.tsx',
  'PageContentManagementPage.tsx',
  'PoliciesManagementPage.tsx',
  'SeoManagementPage.tsx',
].map((f) => path.join(adminDir, f));

function countArabic(text) {
  return (text.match(/[\u0600-\u06FF]/g) || []).length;
}

function countMojibake(text) {
  return (text.match(/[\u00D8\u00D9\u00C3\u00C2]/g) || []).length;
}

const CP1252_EXTRA = new Map([
  [0x20AC, 0x80],
  [0x201A, 0x82],
  [0x0192, 0x83],
  [0x201E, 0x84],
  [0x2026, 0x85],
  [0x2020, 0x86],
  [0x2021, 0x87],
  [0x02C6, 0x88],
  [0x2030, 0x89],
  [0x0160, 0x8A],
  [0x2039, 0x8B],
  [0x0152, 0x8C],
  [0x017D, 0x8E],
  [0x2018, 0x91],
  [0x2019, 0x92],
  [0x201C, 0x93],
  [0x201D, 0x94],
  [0x2022, 0x95],
  [0x2013, 0x96],
  [0x2014, 0x97],
  [0x02DC, 0x98],
  [0x2122, 0x99],
  [0x0161, 0x9A],
  [0x203A, 0x9B],
  [0x0153, 0x9C],
  [0x017E, 0x9E],
  [0x0178, 0x9F],
]);

function toCp1252Bytes(text) {
  const bytes = [];
  for (const ch of text) {
    const code = ch.codePointAt(0);
    if (code <= 0xff) {
      bytes.push(code);
      continue;
    }
    const mapped = CP1252_EXTRA.get(code);
    if (mapped !== undefined) {
      bytes.push(mapped);
      continue;
    }
    return null;
  }
  return Buffer.from(bytes);
}

function decodeMaybe(text) {
  if (!text || !/[\u00D8\u00D9\u00C3\u00C2]/.test(text)) return null;
  const cp1252Bytes = toCp1252Bytes(text);
  if (!cp1252Bytes) return null;
  const decoded = cp1252Bytes.toString('utf8');
  if (!decoded || decoded.includes('\uFFFD')) return null;

  const beforeArabic = countArabic(text);
  const afterArabic = countArabic(decoded);
  const beforeMojibake = countMojibake(text);
  const afterMojibake = countMojibake(decoded);

  if (afterArabic > beforeArabic && afterMojibake < beforeMojibake) {
    return decoded;
  }

  return null;
}

function escapeForSingleQuote(text) {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n');
}

function applyEdits(source, edits) {
  if (edits.length === 0) return source;
  edits.sort((a, b) => b.start - a.start);
  let out = source;
  for (const e of edits) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }
  return out;
}

function collectEdits(sourceFile, edits) {
  function visit(node) {
    if (ts.isStringLiteral(node)) {
      const raw = node.getText(sourceFile);
      const decoded = decodeMaybe(node.text);

      if (decoded && raw.startsWith("'")) {
        edits.push({
          start: node.getStart(sourceFile),
          end: node.end,
          text: `'${escapeForSingleQuote(decoded)}'`,
        });
      } else if (decoded && raw.startsWith('"')) {
        const safe = decoded
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n');

        edits.push({
          start: node.getStart(sourceFile),
          end: node.end,
          text: `"${safe}"`,
        });
      }
    }

    if (ts.isNoSubstitutionTemplateLiteral(node)) {
      const decoded = decodeMaybe(node.text);
      if (decoded) {
        const safe = decoded
          .replace(/\\/g, '\\\\')
          .replace(/`/g, '\\`')
          .replace(/\$\{/g, '\\${');

        edits.push({
          start: node.getStart(sourceFile),
          end: node.end,
          text: `\`${safe}\``,
        });
      }
    }

    if (ts.isJsxText(node)) {
      const decoded = decodeMaybe(node.getText(sourceFile));
      if (decoded) {
        edits.push({
          start: node.getStart(sourceFile),
          end: node.end,
          text: decoded,
        });
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function processFile(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const edits = [];
  collectEdits(sourceFile, edits);

  if (edits.length === 0) return false;

  const next = applyEdits(source, edits);
  fs.writeFileSync(filePath, next, 'utf8');
  return true;
}

let changed = 0;
for (const file of targetFiles) {
  if (processFile(file)) {
    changed += 1;
    console.log(`fixed: ${path.relative(process.cwd(), file)}`);
  }
}

console.log(`done. changed files: ${changed}/${targetFiles.length}`);
