// The first WebGL frame, ours against the reference, by one rule on both: the time (ms after navigation
// start) of the first draw call a WebGL context on the page issues to its canvas (the default framebuffer,
// so not a render target such as a shadow map or an environment bake). A wrapper on every WebGL and WebGL 2
// context records it before any page script runs. Ours also reports its own firstFrameAt (just after its
// first frame is rendered), as budgets.mjs does.
//
//   node build/compare/firstframe.mjs --round r0 [--runs 3]
//
// Cold load on budgets.mjs's phone profile: 390x844 at DPR 2 with a phone user agent, 1.6 Mbps down,
// 750 kbps up, 150 ms round trip, 4x CPU slowdown, cache disabled, a fresh browser context per run, the
// sites taken in turn. Ours is served from the repo on loopback with gzip (as budgets.mjs serves it); the
// reference is https://www.shopify.com/editions over the real network, so its round trips are the
// throttle's 150 ms plus the real ones. Output: .captures/<round>/firstframe.json. Only headless Chrome.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import zlib from 'zlib';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.css': 'text/css',
  '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(ROOT, u);
  if (!f.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404).end(); return; }
  const type = TYPES[path.extname(f)] || 'application/octet-stream', body = fs.readFileSync(f);
  const zip = /text|json|svg/.test(type) && /gzip/.test(req.headers['accept-encoding'] || '');
  res.writeHead(200, { 'content-type': type, 'cache-control': 'no-store', ...(zip ? { 'content-encoding': 'gzip' } : {}) });
  res.end(zip ? zlib.gzipSync(body, { level: 6 }) : body);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const SITES = { ours: `http://127.0.0.1:${server.address().port}/`, theirs: 'https://www.shopify.com/editions' };
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round'), runs = +(arg('runs') || 3);
if (!round || !/^[\w.-]+$/.test(round)) { console.error('usage: node build/compare/firstframe.mjs --round <name> [--runs 3]'); process.exit(2); }
const median = a => { const b = a.filter(x => x != null).sort((x, y) => x - y); return b.length ? b[b.length >> 1] : null; };

// Runs in the page before its scripts: the first draw to a canvas, with that canvas's size and whether it is
// in the document.
function drawHook() {
  const rec = window.__firstDraw = { at: null, canvas: null, contexts: 0 };
  const FB = new WeakMap();
  for (const C of [window.WebGLRenderingContext, window.WebGL2RenderingContext]) {
    if (!C) continue;
    const P = C.prototype, bind = P.bindFramebuffer;
    P.bindFramebuffer = function (target, fb) {
      if (target === this.FRAMEBUFFER || target === this.DRAW_FRAMEBUFFER) FB.set(this, fb);
      return bind.call(this, target, fb);
    };
    for (const m of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced', 'drawRangeElements']) {
      const f = P[m];
      if (!f) continue;
      P[m] = function (...a) {
        if (rec.at === null && !FB.get(this)) {
          rec.at = performance.now();
          const c = this.canvas;
          rec.canvas = { w: c.width, h: c.height, inDocument: !!c.isConnected };
        }
        return f.apply(this, a);
      };
    }
  }
  const gc = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (type, ...a) {
    const ctx = gc.call(this, type, ...a);
    if (ctx && /webgl/.test(type)) rec.contexts++;
    return ctx;
  };
}

async function coldLoad(browser, site) {
  const ctx = await browser.createBrowserContext();
  const pg = await ctx.newPage();
  const cdp = await pg.createCDPSession();
  await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA });
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await pg.evaluateOnNewDocument(drawHook);
  let bytes = 0;
  cdp.on('Network.loadingFinished', e => { bytes += e.encodedDataLength; });
  await pg.goto(SITES[site], { waitUntil: 'domcontentloaded', timeout: 120000 });
  await pg.waitForFunction(() => window.__firstDraw?.at != null, { timeout: 120000, polling: 50 }).catch(() => {});
  const atDraw = bytes;
  if (site === 'ours') await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 60000 }).catch(() => {});
  const r = await pg.evaluate(() => {
    const p = Object.fromEntries(performance.getEntriesByType('paint').map(e => [e.name, Math.round(e.startTime)]));
    return { firstDrawAt: window.__firstDraw.at == null ? null : Math.round(window.__firstDraw.at), canvas: window.__firstDraw.canvas,
      contexts: window.__firstDraw.contexts, firstPaint: p['first-paint'] ?? null, firstContentful: p['first-contentful-paint'] ?? null,
      firstFrameAt: window.__editions?.firstFrameAt == null ? null : Math.round(window.__editions.firstFrameAt) };
  });
  r.bytesAtFirstDraw = atDraw;
  await ctx.close();
  return r;
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 240000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'],
});
const res = { capturedAt: new Date().toISOString(), ours: [], theirs: [] };
try {
  for (let k = 0; k < runs; k++) for (const site of ['theirs', 'ours']) { const r = await coldLoad(browser, site); res[site].push(r); console.log(site, JSON.stringify(r)); }
  res.median = Object.fromEntries(['ours', 'theirs'].map(s => [s, Object.fromEntries(['firstDrawAt', 'firstFrameAt', 'firstPaint', 'firstContentful', 'bytesAtFirstDraw'].map(k => [k, median(res[s].map(r => r[k]))]))]));
} finally {
  await browser.close();
  server.close();
}
const dir = path.join(ROOT, '.captures', round);
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'firstframe.json'), JSON.stringify(res, null, 1));
console.log(JSON.stringify(res.median));
process.exit(0);
