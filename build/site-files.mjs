// The files Pages publishes: copies the site's entries (the pages, their modules and media, _headers) from the
// repo into _site/, which the deploy uploads. Everything else in the repo (docs/, build/, worker/, content/,
// README.md, package*.json, .github/) stays out of the upload. functions/ is deployed from the repo root,
// where wrangler reads it, so it is not copied either. Only git-tracked files are copied, so a local _site/
// holds what CI's checkout would.
//
//   node build/site-files.mjs           write _site/ (replacing any earlier one)
//
// Serve it as Pages does, functions included: npx wrangler pages dev _site (from the repo root).
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, '_site');

// Each entry is fetched by a served page: the shelf (index.html, its source modules and dist/ bundle), /hi,
// /classic, the project page, and the files they load at runtime (data/, covers/, media/, audio/, scene/, vendor/).
const SITE = [
  'index.html', 'hi.html', 'main.js', 'menu.js', 'fallback.js', 'contact.js',
  '_headers', 'favicon.ico', 'favicon.png', 'apple-touch-icon.png',
  'audio', 'classic', 'covers', 'data', 'dist', 'hi', 'media', 'project', 'scene', 'vendor',
];

const tracked = execFileSync('git', ['ls-files', '-z', '--', ...SITE], { cwd: ROOT, encoding: 'utf8' })
  .split('\0').filter(Boolean);
const missing = SITE.filter(e => !tracked.some(f => f === e || f.startsWith(`${e}/`)));
if (missing.length) { console.error(`site-files: no tracked files for ${missing.join(', ')}`); process.exit(2); }

fs.rmSync(OUT, { recursive: true, force: true });
let bytes = 0;
for (const f of tracked) {
  const to = path.join(OUT, f);
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(path.join(ROOT, f), to);
  bytes += fs.statSync(to).size;
}
console.log(`_site/: ${tracked.length} files, ${(bytes / 1048576).toFixed(1)} MB`);
