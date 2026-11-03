// Comparison harness: captures the same named moments from the reference site and ours,
// then composites side-by-side pairs and an index page (compose.py).
//
//   node build/compare/capture.mjs --round r0 [--only theirs|ours]
//
// Output: .captures/<round>/<site>/{<moment>.png, meta.json, metrics.json}, pair-<moment>.jpg, index.html
// Only headless Chrome is used, and network access is limited to the two sites below.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SITES = {
  theirs: { url: 'https://www.shopify.com/editions' },
  ours: { url: 'http://127.0.0.1:8750/editions/' },
};
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const THEIR_CENTRES = { 0: { x: 275, y: 290 }, 2: { x: 720, y: 290 } };
const NEUTRAL = { x: 1400, y: 450 };   // empty ground right of the shelves, clear of header and timeline
const EMPTY_CLICK = { x: 1400, y: 120 };
const INTRO = [300, 900, 1200, 1500, 1800, 2400, 4000];

const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round');
const only = arg('only');
if (!round || !/^[\w.-]+$/.test(round) || (only && !SITES[only])) {
  console.error('usage: node build/compare/capture.mjs --round <name> [--only theirs|ours]');
  process.exit(2);
}
const roundDir = path.join(ROOT, '.captures', round);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const pad = t => String(t).padStart(4, '0');

async function runSite(browser, siteKey) {
  const site = SITES[siteKey];
  const dir = path.join(roundDir, siteKey);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const moments = [];
  const metrics = {};

  // Every moment is the frame that was on screen at its target time, taken from a continuous CDP screencast:
  // each Page.screencastFrame carries its swap time on the system wall clock, the same clock as Node's
  // Date.now() and the page's performance.timeOrigin. (A screenshot request instead waits for the next frame,
  // which on a busy page arrives up to a second late.) Recorded per moment: `ms`, the chosen frame's time
  // after the origin, and `ageMs`, how long that frame had been on screen at the target.
  const startCaster = async pg => {
    const cdp = await pg.createCDPSession();
    let last = null;
    const queue = [];
    const settle = (q, frame) => {
      const rec = q.rec;
      if (!frame) { rec.status = 'error'; rec.note = 'no frame received'; }
      else {
        fs.writeFileSync(path.join(dir, `${rec.name}.png`), Buffer.from(frame.data, 'base64'));
        rec.frameEpoch = frame.ts;
        rec.ageMs = Math.round(q.at - frame.ts);
      }
      q.resolve(rec);
    };
    cdp.on('Page.screencastFrame', e => {
      cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
      const f = { ts: e.metadata.timestamp * 1000, data: e.data };
      while (queue.length && f.ts > queue[0].at) settle(queue.shift(), last ?? f);
      last = f;
    });
    // A page that stops painting sends no frames: its last frame is what is on screen.
    const timer = setInterval(() => {
      while (queue.length && Date.now() > queue[0].at + 500) settle(queue.shift(), last);
    }, 20);
    await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
    return {
      at(rec, at) {
        return new Promise(resolve => {
          const q = { rec, at, resolve };
          const i = queue.findIndex(o => o.at > at);
          queue.splice(i < 0 ? queue.length : i, 0, q);
        });
      },
      async stop() {
        while (queue.length) await sleep(20);
        clearInterval(timer);
        await cdp.send('Page.stopScreencast').catch(() => {});
        await cdp.detach().catch(() => {});
      },
    };
  };
  // Register moments `prefix + target` at origin + target (epoch ms) and wait for all of them.
  const burst = (caster, prefix, origin, offsets, group, { status = 'ok', note = '' } = {}) => Promise.all(offsets.map(t => {
    const name = typeof t === 'number' ? `${prefix}${pad(t)}` : prefix;
    const target = typeof t === 'number' ? t : t.at;
    const rec = { name: typeof t === 'number' ? name : t.name, group, target, originEpoch: origin, status, note };
    moments.push(rec);
    return caster.at(rec, origin + target);
  }));
  const shoot = (caster, name, origin, target, group, opts) => burst(caster, '', origin, [{ name, at: target }], group, opts);

  // Sleeve i's control. theirs: every sleeve's Open link and Details button sit in the DOM in sleeve order
  // (the i-th exact-text match); ours: the data-action button. Clicked with the real mouse at its centre,
  // which keeps the sleeve hovered; el.click() only when the element has no box.
  const clickControl = async (pg, action, index) => {
    const box = await pg.evaluate((siteKey, action, index) => {
      let el;
      if (siteKey === 'ours') {
        el = document.querySelector(`button[data-action="${action}"][data-index="${index}"]`);
      } else {
        const label = action === 'open' ? 'Open' : 'Details';
        el = [...document.querySelectorAll('a,button')].filter(e => (e.innerText || '').trim() === label)[index];
      }
      if (!el) return null;
      const r = el.getBoundingClientRect();
      if (r.width && r.height) return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      el.click();
      return { clicked: true };
    }, siteKey, action, index).catch(() => null);
    if (box && !box.clicked) await pg.mouse.click(box.x, box.y);
    return !!box;
  };

  const sleeveCentre = async (pg, i) => {
    if (siteKey === 'theirs') return THEIR_CENTRES[i];
    const r = await pg.evaluate(i => window.__editions?.sleeveRect(i) ?? null, i).catch(() => null);
    return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null;
  };

  // ---- desktop -------------------------------------------------------------
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setCacheEnabled(false); // cold first view; switched back on before the interactions

  // Network accounting through CDP: bytes on the wire (encodedDataLength) by resource type.
  const cdp = await page.createCDPSession();
  await cdp.send('Network.enable');
  const reqs = new Map();
  cdp.on('Network.requestWillBeSent', e => { if (!e.request.url.startsWith('data:') && !reqs.has(e.requestId)) reqs.set(e.requestId, { type: e.type || 'Other', bytes: 0, done: false }); });
  cdp.on('Network.responseReceived', e => { const r = reqs.get(e.requestId); if (r && e.type) r.type = e.type; });
  cdp.on('Network.dataReceived', e => { const r = reqs.get(e.requestId); if (r && !r.done) r.bytes += e.encodedDataLength || 0; });
  cdp.on('Network.loadingFinished', e => { const r = reqs.get(e.requestId); if (r) { r.bytes = Math.max(r.bytes, e.encodedDataLength || 0); r.done = true; } });
  const snapshotNet = () => {
    const byType = {};
    let requests = 0, bytes = 0;
    for (const r of reqs.values()) {
      const t = byType[r.type] ||= { requests: 0, bytes: 0 };
      t.requests++; t.bytes += r.bytes; requests++; bytes += r.bytes;
    }
    return { requests, bytes, byType };
  };

  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e.message).slice(0, 200)));

  // Intro: moments scheduled from just before navigation, re-based on the document's performance.timeOrigin
  // (navigation start) once it has committed.
  let caster = await startCaster(page);
  const navStart = Date.now();
  const nav = page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    .catch(e => { pageErrors.push('goto: ' + e.message.slice(0, 120)); });
  const intro = burst(caster, 'intro-t', navStart, INTRO, 'intro');
  const rest = shoot(caster, 'rest', navStart, 10000, 'rest');
  await nav;
  const timeOrigin = await page.evaluate(() => performance.timeOrigin).catch(() => navStart);
  await intro; await rest;
  for (const r of moments) r.originEpoch = timeOrigin;
  await caster.stop(); // the frame-rate count below runs without the screencast

  // Metrics at first view (10 s), before any interaction adds requests.
  const net = snapshotNet();
  const nt = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    return n ? { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) } : {};
  }).catch(() => ({}));
  const firstFrameAt = siteKey === 'ours'
    ? await page.evaluate(() => window.__editions?.firstFrameAt ?? null).catch(() => null) : null;
  const fps = await page.evaluate(() => new Promise(res => {
    let n = 0; const s = performance.now();
    const f = () => { n++; if (performance.now() - s < 3000) requestAnimationFrame(f); else res({ frames: n, ms: performance.now() - s }); };
    requestAnimationFrame(f);
  })).catch(() => null);
  Object.assign(metrics, {
    requests: net.requests, transferredBytes: net.bytes, byType: net.byType,
    domContentLoadedMs: nt.dcl ?? null, loadMs: nt.load ?? null,
    firstFrameAtMs: firstFrameAt === null ? null : Math.round(firstFrameAt),
    fps: fps ? +(fps.frames / fps.ms * 1000).toFixed(1) : null,
  });
  await page.setCacheEnabled(true);
  caster = await startCaster(page);

  // Cookie banner, if any.
  await page.evaluate(() => { for (const b of document.querySelectorAll('button')) if (/^(accept|accept all|ok|got it)$/i.test((b.innerText || '').trim())) b.click(); }).catch(() => {});
  await sleep(500);

  const mouseTo = async p => { await page.mouse.move(p.x, p.y); return Date.now(); };
  const c0 = await sleeveCentre(page, 0);
  const c2 = await sleeveCentre(page, 2);
  const na = what => ({ status: 'n/a', note: `${what} not found` });

  // Hover sleeve 0, then sleeve 2.
  await mouseTo(NEUTRAL); await sleep(1500);
  await burst(caster, 'hover0-', c0 ? await mouseTo(c0) : Date.now(), [0, 120, 250, 500, 1000], 'hover', c0 ? {} : na('sleeve 0'));
  await shoot(caster, 'hover2-1000', c2 ? await mouseTo(c2) : Date.now(), 1000, 'hover', c2 ? {} : na('sleeve 2'));

  // Details on sleeve 0.
  await mouseTo(NEUTRAL); await sleep(1200);
  if (c0) { await mouseTo(c0); await sleep(900); }
  const detailsFound = await clickControl(page, 'details', 0);
  const detailsT = Date.now();
  const detOpts = detailsFound ? {} : na('Details control');
  await burst(caster, 'details-', detailsT, [0, 200, 400, 600, 800, 1000, 1200, 1400, { name: 'details-held', at: 2500 }], 'details', detOpts);

  // Flip.
  await page.keyboard.press('Space');
  await burst(caster, 'flip-', Date.now(), [0, 300, 600, 1000], 'flip', detailsFound ? {} : { status: 'n/a', note: 'Details never opened' });

  // Escape, then a click on empty ground in case the view is still open.
  await page.keyboard.press('Escape');
  await shoot(caster, 'escape', Date.now(), 1200, 'escape', { note: `followed by a click at (${EMPTY_CLICK.x},${EMPTY_CLICK.y})` });
  await page.mouse.click(EMPTY_CLICK.x, EMPTY_CLICK.y).catch(() => {});
  await sleep(1500);

  // Open sleeve 0 (theirs navigates to /editions/fall2026 about 1.7 s after the click).
  await mouseTo(NEUTRAL); await sleep(1000);
  if (c0) { await mouseTo(c0); await sleep(900); }
  const openFound = await clickControl(page, 'open', 0);
  const openT = Date.now();
  const openOpts = openFound ? {} : na('Open control');
  await burst(caster, 'open-', openT, [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, { name: 'open-held', at: 6000 }], 'open', openOpts);
  metrics.urlAfterOpen = await page.evaluate(() => location.href).catch(() => null);
  await caster.stop();
  await page.close();

  // ---- phone ---------------------------------------------------------------
  const m = await browser.newPage();
  await m.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA });
  m.on('pageerror', e => pageErrors.push('phone: ' + String(e.message).slice(0, 200)));
  const mc = await startCaster(m);
  const pStart = Date.now();
  await m.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => { pageErrors.push('phone goto: ' + e.message.slice(0, 120)); });
  const pOrigin = await m.evaluate(() => performance.timeOrigin).catch(() => pStart);
  await shoot(mc, 'phone-rest', pOrigin, 10000, 'phone');
  await m.touchscreen.tap(195, 422).catch(() => {});
  await shoot(mc, 'phone-tap', Date.now(), 1800, 'phone', { note: 'tap at (195,422)' });
  await mc.stop();
  await m.close();

  // ---- write meta ----------------------------------------------------------
  for (const r of moments) r.ms = r.frameEpoch === undefined ? null : Math.round(r.frameEpoch - r.originEpoch);
  metrics.pageErrors = pageErrors.slice(0, 8);
  fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify({ site: siteKey, url: site.url, capturedAt: new Date().toISOString(), moments }, null, 1));
  fs.writeFileSync(path.join(dir, 'metrics.json'), JSON.stringify(metrics, null, 1));
  const bad = moments.filter(r => r.status !== 'ok');
  console.log(`${siteKey}: ${moments.length} moments, ${bad.length} not ok${bad.length ? ': ' + bad.map(r => r.name).join(' ') : ''}`);
}

fs.mkdirSync(roundDir, { recursive: true });
const t0 = Date.now();
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 120000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio'],
});
try {
  // Sequential on purpose: two WebGL pages at once would disturb each other's timing.
  for (const key of only ? [only] : ['theirs', 'ours']) await runSite(browser, key);
} finally {
  await browser.close();
}

const py = spawnSync('python3', [path.join(HERE, 'compose.py'), roundDir], { stdio: 'inherit' });
if (py.status !== 0) process.exit(py.status ?? 1);
console.log(`done in ${((Date.now() - t0) / 1000).toFixed(0)} s -> ${path.join(roundDir, 'index.html')}`);
process.exit(0); // a closed browser can leave a handle open that keeps Node alive
