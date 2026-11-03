// Budgets for ours: first-view transfer, first rendered frame on a throttled phone, and frame rate during
// every motion at 1x and under a 4x CPU slowdown.
//
//   node build/compare/budgets.mjs --round r0 [--runs 3]
//
// Cold load: 390x844 at DPR 2 with a phone user agent, Lighthouse's mobile throttle (1.6 Mbps down,
// 750 kbps up, 150 ms round trip, 4x CPU slowdown), cache disabled; firstFrameAt is the page's own
// first-frame time (ms after navigation start). Motion: requestAnimationFrame intervals during the intro,
// a hover, Details (flight, flip, Escape), Open (cut, panel, world) and the page scroll at 1440x900, and
// the crate (flicks, Details) at 390x844. Output: .captures/<round>/budgets.json. Only headless Chrome;
// the only site loaded is ours.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import zlib from 'zlib';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
// The cold load needs the compression a production host applies (the dev server sends files raw), so
// this script serves the repo itself on loopback, gzip level 6 for text (Cloudflare Pages serves brotli,
// a little smaller), and loads ours from there.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404).end(); return; }
  const ext = path.extname(f), type = TYPES[ext] || 'application/octet-stream', body = fs.readFileSync(f);
  const zip = /text|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store', ...(zip ? { 'content-encoding': 'gzip' } : {}) });
  res.end(zip ? zlib.gzipSync(body, { level: 6 }) : body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));   // a free port
const URL0 = `http://127.0.0.1:${server.address().port}/editions/`;
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round'), runs = +(arg('runs') || 3);
if (!round || !/^[\w.-]+$/.test(round)) { console.error('usage: node build/compare/budgets.mjs --round <name> [--runs 3]'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const median = a => { const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };

function sampler() {
  window.__raf = [];
  const f = t => { window.__raf.push(t); requestAnimationFrame(f); };
  requestAnimationFrame(f);
}
// Frame intervals between two page times: frames, mean fps, worst interval, frames over 20 ms (under 50 fps).
const cadence = (pg, t0, t1) => pg.evaluate((t0, t1) => {
  const a = window.__raf.filter(t => t >= t0 && t <= t1);
  const d = a.slice(1).map((t, i) => t - a[i]);
  if (!d.length) return null;
  return { frames: d.length, fps: +(d.length / ((a[a.length - 1] - a[0]) / 1000)).toFixed(1), worstMs: +Math.max(...d).toFixed(1), over20: d.filter(x => x > 20).length };
}, t0, t1);
const now = pg => pg.evaluate(() => performance.now());

async function coldLoad(browser) {
  const pg = await browser.newPage();
  const cdp = await pg.createCDPSession();
  await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA });
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  const reqs = new Map(), t0 = { v: 0 };
  cdp.on('Network.requestWillBeSent', e => { if (!t0.v) t0.v = e.timestamp; reqs.set(e.requestId, { url: e.request.url.replace(/^https?:\/\/[^/]+/, ''), start: e.timestamp }); });
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; const r = reqs.get(e.requestId); if (r) { r.bytes = e.encodedDataLength; r.end = e.timestamp; } });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 120000 });
  const r = await pg.evaluate(() => ({ firstFrameAt: Math.round(window.__editions.firstFrameAt), dcl: Math.round(performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd) }));
  const atFirst = bytes;
  await pg.waitForFunction(() => window.__editions.sleevesAt != null, { timeout: 60000 }).catch(() => {});
  r.sleevesAt = await pg.evaluate(() => Math.round(window.__editions.sleevesAt ?? -1));   // the covers are in; the sleeves start to appear
  await sleep(3000);   // the covers and fonts that follow the first frame
  r.bytesAtFirstFrame = atFirst; r.bytesAfter3s = bytes;
  r.requests = [...reqs.values()].map(q => ({ url: q.url, bytes: q.bytes ?? null, startMs: Math.round((q.start - t0.v) * 1000), endMs: q.end ? Math.round((q.end - t0.v) * 1000) : null }));
  await pg.close();
  return r;
}

async function motion(browser, rate) {
  const out = {};
  // Desktop: intro, hover, Details, flip, Escape, Open, page scroll.
  let pg = await browser.newPage();
  let cdp = await pg.createCDPSession();
  await pg.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  pg.on('console', m => { if (['warn', 'error'].includes(m.type())) console.error('page', m.type(), m.text().slice(0, 200)); });
  pg.on('pageerror', e => console.error('pageerror', e.message.slice(0, 200)));
  await pg.evaluateOnNewDocument(sampler);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded' });
  // A page that has not drawn in 30 s (a busy machine) is loaded once more.
  await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 30000 })
    .catch(() => pg.reload({ waitUntil: 'domcontentloaded' }).then(() => pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 60000 })));
  let t = await now(pg);
  await sleep(3000);
  out.intro = await cadence(pg, t, await now(pg));
  const r = await pg.evaluate(() => window.__editions.sleeveRect(0));
  t = await now(pg);
  await pg.mouse.move(r.x + r.width / 2, r.y + r.height / 2); await sleep(1200);
  out.hover = await cadence(pg, t, await now(pg));
  t = await now(pg);
  await pg.click('button[data-action="details"][data-index="0"]'); await sleep(1500);
  out.details = await cadence(pg, t, await now(pg));
  t = await now(pg);
  await pg.keyboard.press('Space'); await sleep(900);
  out.flip = await cadence(pg, t, await now(pg));
  t = await now(pg);
  await pg.keyboard.press('Escape'); await sleep(1200);
  out.escape = await cadence(pg, t, await now(pg));
  t = await now(pg);
  await pg.click('button[data-action="open"][data-index="0"]'); await sleep(4500);
  out.open = await cadence(pg, t, await now(pg));
  t = await now(pg);
  for (let k = 0; k < 20; k++) { await pg.mouse.wheel({ deltaY: 120 }); await sleep(60); }
  await sleep(500);
  out.pageScroll = await cadence(pg, t, await now(pg));
  await pg.close();
  // Phone: the crate.
  pg = await browser.newPage();
  cdp = await pg.createCDPSession();
  await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA });
  await pg.evaluateOnNewDocument(sampler);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 60000 });
  t = await now(pg);
  await sleep(3000);
  out.phoneIntro = await cadence(pg, t, await now(pg));
  t = await now(pg);
  for (const dy of [250, 250, -250]) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: dy > 0 ? 300 : 600 }] });
    for (let k = 1; k <= 8; k++) { await sleep(15); await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: (dy > 0 ? 300 : 600) + dy * k / 8 }] }); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(1200);
  }
  out.crateFlicks = await cadence(pg, t, await now(pg));
  t = await now(pg);
  await pg.tap('.cb-details'); await sleep(1500);
  out.crateDetails = await cadence(pg, t, await now(pg));
  await pg.close();
  return out;
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'],
});
const res = { capturedAt: new Date().toISOString(), cold: [], motion: {} };
try {
  for (let k = 0; k < runs; k++) res.cold.push(await coldLoad(browser));
  res.coldMedian = { firstFrameAt: median(res.cold.map(r => r.firstFrameAt)), sleevesAt: median(res.cold.map(r => r.sleevesAt)), bytesAtFirstFrame: median(res.cold.map(r => r.bytesAtFirstFrame)), bytesAfter3s: median(res.cold.map(r => r.bytesAfter3s)) };
  for (const rate of [1, 4]) res.motion[`cpu${rate}x`] = await motion(browser, rate);
} finally {
  await browser.close();
  server.close();
}
const dir = path.join(ROOT, '.captures', round);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'budgets.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res.coldMedian), JSON.stringify(res.motion, null, 0));
process.exit(0);
