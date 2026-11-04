// The cover thumbs: each shelf cover's front, drawn by the cover module in headless Chrome
// (build/covers/thumbs.html) and saved as covers/thumbs/<slug>.webp. The sleeves show them from the
// first frame until the full covers land. Run again whenever a cover's design or the lineup changes.
//
//   node build/covers/thumbs.mjs [--thumb 128] [--q 0.75] [--out covers/thumbs]
//   node build/covers/thumbs.mjs --thumb 512 --q 0.8 --out covers/hero    (the project pages' hero art)
//
// Serves the repo itself on a free loopback port. Uses Playwright's Chromium when `playwright` resolves
// (a cloud machine); otherwise puppeteer-core with build/pptr.json's Chrome (the operator's Mac).
// Without a GPU, Chrome draws with SwiftShader: slow, but the pixels are the same shaders'.
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : d; };
const OUT = path.join(ROOT, arg('out', 'covers/thumbs'));
const thumb = +arg('thumb', 128), q = +arg('q', 0.75);

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json',
  '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/build/covers/thumbs.html?thumb=${thumb}&q=${q}`;

async function launch() {
  try {
    const { chromium } = createRequire(import.meta.url)('playwright');
    const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
    return { b, page: await b.newPage() };
  } catch {
    const { default: puppeteer } = await import('/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js');
    const { executablePath } = JSON.parse(fs.readFileSync(path.join(ROOT, 'build/pptr.json'), 'utf8'));
    const b = await puppeteer.launch({ executablePath, headless: true });
    return { b, page: await b.newPage() };
  }
}

const { b, page } = await launch();
page.on('pageerror', e => console.error('page:', e.message));
await page.goto(url);
await page.waitForFunction(() => window.thumbs, null, { timeout: 30000 });
const res = await page.evaluate(() => window.thumbs);
await b.close();
server.close();

fs.mkdirSync(OUT, { recursive: true });
let total = 0, failed = 0;
for (const r of res) {
  if (r.error) { console.error(`${r.slug}: ${r.error}`); failed++; continue; }
  const buf = Buffer.from(r.webp, 'base64');
  fs.writeFileSync(path.join(OUT, `${r.slug}.webp`), buf);
  total += buf.length;
  console.log(`${r.slug}.webp`.padEnd(26), `${(buf.length / 1024).toFixed(1)} KB`);
}
console.log(`${res.length - failed} thumbs, ${(total / 1024).toFixed(1)} KB at ${thumb}px q${q}`);
if (failed) process.exit(1);
