import fs from 'fs';
import path from 'path';

const adminDir = path.resolve('pages/admin');

function countMatches(text, regex) {
  const m = text.match(regex);
  return m ? m.length : 0;
}

function shouldConvert(original, converted) {
  const originalMojibake = countMatches(original, /[ØÙÃÂ]/g);
  const convertedMojibake = countMatches(converted, /[ØÙÃÂ]/g);
  const originalArabic = countMatches(original, /[\u0600-\u06FF]/g);
  const convertedArabic = countMatches(converted, /[\u0600-\u06FF]/g);

  return originalMojibake >= 10
    && convertedMojibake < originalMojibake
    && convertedArabic > originalArabic;
}

function fixFile(filePath) {
  const original = fs.readFileSync(filePath, 'utf8');
  const converted = Buffer.from(original, 'latin1').toString('utf8');

  if (!shouldConvert(original, converted)) {
    return false;
  }

  fs.writeFileSync(filePath, converted, 'utf8');
  return true;
}

function main() {
  const files = fs.readdirSync(adminDir)
    .filter((name) => name.endsWith('.tsx'))
    .map((name) => path.join(adminDir, name));

  let changed = 0;
  for (const file of files) {
    if (fixFile(file)) {
      changed += 1;
      console.log(`fixed: ${path.relative(process.cwd(), file)}`);
    }
  }

  console.log(`done. changed files: ${changed}/${files.length}`);
}

main();
