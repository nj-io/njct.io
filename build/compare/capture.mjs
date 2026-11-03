// Comparison harness: captures the same named moments from the reference site and ours,
// then composites side-by-side pairs and an index page (compose.py).
//
//   node build/compare/capture.mjs --round r0 [--only theirs|ours] [--dpr 2] [--frames] [--sizes] [--port 8750]
//
// Output: .captures/<round>/<site>/{<moment>.png, meta.json, metrics.json}, pair-<moment>.jpg, crop-*.png, index.html
//   --dpr 2   adds a desktop pass at 1440x900, device scale factor 2 (rest, hover0-1000 screenshots) under <site>/dpr2/
//   --sizes   adds rest screenshots at 1280x800 and 1920x1080 under <site>/size-<w>x<h>/
//   --frames  also keeps every screencast frame of the intro and of hover0 under <site>/frames/{intro,hover0}/<ms>.png
//   --port    the local server's port for ours (default 8750)
// Only headless Chrome is used, and network access is limited to the two sites below.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = (i => (i >= 0 ? process.argv[i + 1] : '8750'))(process.argv.indexOf('--port'));
const SITES = {
  theirs: { url: 'https://www.shopify.com/editions', openUrl: 'https://www.shopify.com/editions/fall2026' },
  ours: { url: `http://127.0.0.1:${PORT}/editions/`, openUrl: `http://127.0.0.1:${PORT}/editions/#mirra` },
};
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const THEIR_CENTRES = { 0: { x: 275, y: 290 }, 2: { x: 720, y: 290 } };
const NEUTRAL = { x: 1400, y: 450 };   // empty ground right of the shelves, clear of header and timeline
const EMPTY_CLICK = { x: 1400, y: 120 };
const INTRO = [300, 900, 1200, 1500, 1800, 2400, 4000];

// The opened page as a visitor meets it: document size, the largest type on screen, the headings, the
// fixed layers and canvases, and the top-level blocks with their heights. Runs in the page.
function pageOutline() {
  const r = el => { const b = el.getBoundingClientRect(); return [Math.round(b.x), Math.round(b.y + scrollY), Math.round(b.width), Math.round(b.height)]; };
  const txt = el => (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  const all = [...document.querySelectorAll('body *')];
  let big = null, bigSize = 0;
  for (const el of all) {
    if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) continue;
    const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize);
    if (fs > bigSize && el.getBoundingClientRect().width > 0) { bigSize = fs; big = el; }
  }
  const bcs = big && getComputedStyle(big);
  return {
    url: location.href, scrollHeight: document.documentElement.scrollHeight, innerHeight,
    title: big && { text: txt(big), fontSize: bigSize, fontFamily: bcs.fontFamily.slice(0, 60), fontWeight: bcs.fontWeight,
      transform: bcs.transform, writingMode: bcs.writingMode, rect: r(big), color: bcs.color },
    headings: [...document.querySelectorAll('h1,h2,h3')].slice(0, 60).map(h => [h.tagName, txt(h), r(h)[1], parseFloat(getComputedStyle(h).fontSize)]),
    fixed: all.filter(el => ['fixed', 'sticky'].includes(getComputedStyle(el).position)).slice(0, 20).map(el => [el.tagName, el.className.toString().slice(0, 40), getComputedStyle(el).position, r(el)]),
    canvases: [...document.querySelectorAll('canvas')].map(c => [c.width, c.height, r(c), getComputedStyle(c).position]),
    blocks: [...(document.querySelector('main') || document.body).children].slice(0, 60).map(el => [el.tagName, el.className.toString().slice(0, 40), r(el)[1], r(el)[3], txt(el).slice(0, 50)]),
    bodyBg: getComputedStyle(document.body).backgroundColor,
  };
}

const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round');
const only = arg('only');
const dpr = arg('dpr');
const keepFrames = args.includes('--frames');
const extraSizes = args.includes('--sizes');
if (!round || !/^[\w.-]+$/.test(round) || (only && !SITES[only]) || (dpr !== undefined && dpr !== '2') || !/^\d+$/.test(PORT)) {
  console.error('usage: node build/compare/capture.mjs --round <name> [--only theirs|ours] [--dpr 2] [--frames] [--sizes] [--port 8750]');
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
    const recorders = [];
    const settle = (q, frame) => {
      const rec = q.rec;
      if (!frame) { rec.status = 'error'; rec.note = 'no frame received'; }
      else {
        const file = path.join(dir, `${rec.name}.png`);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, Buffer.from(frame.data, 'base64'));
        rec.frameEpoch = frame.ts;
        rec.ageMs = Math.round(q.at - frame.ts);
      }
      q.resolve(rec);
    };
    cdp.on('Page.screencastFrame', e => {
      cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
      const f = { ts: e.metadata.timestamp * 1000, data: e.data };
      for (const r of recorders) if (f.ts >= r.from && f.ts <= r.to) r.add(f);
      while (queue.length && f.ts > queue[0].at) settle(queue.shift(), last ?? f);
      last = f;
    });
    // A page that stops painting sends no frames: its last frame is what is on screen.
    const timer = setInterval(() => {
      while (queue.length && Date.now() > queue[0].at + 500) settle(queue.shift(), last);
    }, 20);
    await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
    return {
      // Keep every frame swapped between epoch `from` and `to`; `save(sub, origin)` writes them as <ms after origin>.png.
      // Keep every frame swapped between epoch `from` and `to` (written to disk as it arrives);
      // `save(sub, origin)` names them <ms after origin>.png under <site>/frames/<sub>/.
      record(from, to) {
        const tmp = fs.mkdtempSync(path.join(dir, '.rec-'));
        const files = [];
        const r = { from, to, add: f => { const p = path.join(tmp, `${files.length}.png`); files.push({ ts: f.ts, p }); fs.writeFile(p, Buffer.from(f.data, 'base64'), () => {}); } };
        recorders.push(r);
        return {
          async save(sub, origin) {
            recorders.splice(recorders.indexOf(r), 1);
            await sleep(300); // pending writes
            const out = path.join(dir, 'frames', sub);
            fs.mkdirSync(out, { recursive: true });
            for (const f of files) {
              const ms = Math.round(f.ts - origin);
              fs.renameSync(f.p, path.join(out, `${ms < 0 ? 'm' + pad(-ms) : pad(ms)}.png`));
            }
            fs.rmSync(tmp, { recursive: true, force: true });
            return files.length;
          },
        };
      },
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
  cdp.on('Network.requestWillBeSent', e => { if (!e.request.url.startsWith('data:') && !reqs.has(e.requestId)) reqs.set(e.requestId, { url: e.request.url, type: e.type || 'Other', bytes: 0, done: false }); });
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
  // Ours is served uncompressed; the first-view weight as it would travel gzipped (level 9), per file.
  const gzipView = () => {
    if (siteKey !== 'ours') return null;
    const files = [];
    for (const r of reqs.values()) {
      const u = new URL(r.url);
      if (u.origin !== new URL(site.url).origin) continue;
      let f = path.join(ROOT, decodeURIComponent(u.pathname));
      if (f.endsWith('/')) f = path.join(f, 'index.html');
      if (!f.startsWith(ROOT) || !fs.existsSync(f)) continue;
      files.push({ path: path.relative(ROOT, f), raw: fs.statSync(f).size, gzip: zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length });
    }
    files.sort((a, b) => b.gzip - a.gzip);
    return { gzipBytes: files.reduce((n, f) => n + f.gzip, 0), files };
  };

  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e.message).slice(0, 200)));
  // Frame cadence: every requestAnimationFrame time from the start, to count frames and long gaps in the
  // intro and hover windows (main-thread work shows up as late callbacks).
  await page.evaluateOnNewDocument(() => {
    window.__rafLog = [];
    const f = t => { window.__rafLog.push(t); requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  const cadence = (from, to) => page.evaluate((from, to) => {
    const ts = (window.__rafLog || []).filter(t => t >= from && t <= to);
    let long = 0, worst = 0;
    for (let i = 1; i < ts.length; i++) { const d = ts[i] - ts[i - 1]; worst = Math.max(worst, d); if (d > 25) long++; }
    return ts.length > 1 ? { fps: +((ts.length - 1) / (ts[ts.length - 1] - ts[0]) * 1000).toFixed(1), longFrames: long, worstMs: Math.round(worst) } : null;
  }, from, to).catch(() => null);

  // Intro: moments scheduled from just before navigation, re-based on the document's performance.timeOrigin
  // (navigation start) once it has committed.
  let caster = await startCaster(page);
  const navStart = Date.now();
  const nav = page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
    .catch(e => { pageErrors.push('goto: ' + e.message.slice(0, 120)); });
  const introRec = keepFrames ? caster.record(navStart, navStart + 4500) : null;
  const intro = burst(caster, 'intro-t', navStart, INTRO, 'intro');
  const rest = shoot(caster, 'rest', navStart, 10000, 'rest');
  await nav;
  const timeOrigin = await page.evaluate(() => performance.timeOrigin).catch(() => navStart);
  await intro; await rest;
  if (introRec) metrics.introFrames = await introRec.save('intro', timeOrigin);
  for (const r of moments) r.originEpoch = timeOrigin;
  await caster.stop(); // the frame-rate count below runs without the screencast

  // Metrics at first view (10 s), before any interaction adds requests.
  const net = snapshotNet();
  metrics.firstViewGzip = gzipView();
  const nt = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    return n ? { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) } : {};
  }).catch(() => ({}));
  const firstFrameAt = siteKey === 'ours'
    ? await page.evaluate(() => window.__editions?.firstFrameAt ?? null).catch(() => null) : null;
  // Intro window: from the first canvas frame (ours: firstFrameAt; theirs: 0.9 s, about when theirs paints) for 2.5 s.
  metrics.introCadence = await cadence(firstFrameAt ?? 900, (firstFrameAt ?? 900) + 2500);
  const fps = await page.evaluate(() => new Promise(res => {
    let n = 0; const s = performance.now();
    const f = () => { n++; if (performance.now() - s < 3000) requestAnimationFrame(f); else res({ frames: n, ms: performance.now() - s }); };
    requestAnimationFrame(f);
  })).catch(() => null);
  Object.assign(metrics, {
    introCadence: metrics.introCadence,
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
  const h0 = c0 ? await mouseTo(c0) : Date.now();
  const hoverRec = keepFrames ? caster.record(h0 - 50, h0 + 1500) : null;
  await burst(caster, 'hover0-', h0, [0, 120, 250, 500, 1000], 'hover', c0 ? {} : na('sleeve 0'));
  if (hoverRec) { await sleep(500); metrics.hoverFrames = await hoverRec.save('hover0', h0); }
  const h0Page = h0 - timeOrigin;
  metrics.hoverCadence = await cadence(h0Page, h0Page + 1000);
  // With --frames, every frame of a burst is kept under frames/<sub>/ (ms after the burst's origin).
  const recorded = async (sub, origin, span, run) => {
    const rec = keepFrames ? caster.record(origin - 50, origin + span) : null;
    await run();
    if (rec) { await sleep(Math.max(0, origin + span - Date.now()) + 300); metrics[`${sub}Frames`] = await rec.save(sub, origin); }
  };
  // Sleeve to sleeve (0 -> 2), then off the sleeves.
  const h2 = c2 ? await mouseTo(c2) : Date.now();
  await recorded('hover2', h2, 1200, () => burst(caster, 'hover2-', h2, [0, 120, 250, 500, 1000], 'hover', c2 ? {} : na('sleeve 2')));
  const hu = await mouseTo(NEUTRAL);
  await recorded('unhover', hu, 1200, () => burst(caster, 'unhover-', hu, [0, 120, 250, 500, 1000], 'hover'));

  // Details on sleeve 0.
  await mouseTo(NEUTRAL); await sleep(1200);
  if (c0) { await mouseTo(c0); await sleep(900); }
  const detailsFound = await clickControl(page, 'details', 0);
  const detailsT = Date.now();
  const detOpts = detailsFound ? {} : na('Details control');
  await recorded('details', detailsT, 2600, () => burst(caster, 'details-', detailsT, [0, 200, 400, 600, 800, 1000, 1200, 1400, { name: 'details-held', at: 2500 }], 'details', detOpts));

  // Flip.
  await page.keyboard.press('Space');
  const flipT = Date.now();
  await recorded('flip', flipT, 1200, () => burst(caster, 'flip-', flipT, [0, 300, 600, 1000], 'flip', detailsFound ? {} : { status: 'n/a', note: 'Details never opened' }));

  // Escape, then a click on empty ground in case the view is still open.
  await page.keyboard.press('Escape');
  const escT = Date.now();
  await recorded('escape', escT, 1300, () => burst(caster, 'escape-', escT, [200, 400, 600, 800], 'escape')
    .then(() => shoot(caster, 'escape', escT, 1200, 'escape', { note: `followed by a click at (${EMPTY_CLICK.x},${EMPTY_CLICK.y})` })));
  await page.mouse.click(EMPTY_CLICK.x, EMPTY_CLICK.y).catch(() => {});
  await sleep(1500);

  // Open sleeve 0 (theirs navigates to /editions/fall2026 about 1.7 s after the click), then the page:
  // its top, middle and end, then the browser's Back.
  await mouseTo(NEUTRAL); await sleep(1000);
  if (c0) { await mouseTo(c0); await sleep(900); }
  const openFound = await clickControl(page, 'open', 0);
  const openT = Date.now();
  const openOpts = openFound ? {} : na('Open control');
  await recorded('open', openT, 7000, () => burst(caster, 'open-', openT,
    [0, 300, 600, 900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 4000, 5000, { name: 'open-held', at: 6000 }], 'open', openOpts));
  metrics.urlAfterOpen = await page.evaluate(() => location.href).catch(() => null);
  metrics.openPage = await page.evaluate(pageOutline).catch(e => ({ error: e.message.slice(0, 120) }));
  // Frame cadence over the last 3 s of the open page (the document's own clock; theirs is a new page).
  metrics.openCadence = await page.evaluate(() => {
    const ts = (window.__rafLog || []).filter(t => t >= performance.now() - 3000);
    let long = 0, worst = 0;
    for (let i = 1; i < ts.length; i++) { const d = ts[i] - ts[i - 1]; worst = Math.max(worst, d); if (d > 25) long++; }
    return ts.length > 1 ? { fps: +((ts.length - 1) / (ts[ts.length - 1] - ts[0]) * 1000).toFixed(1), longFrames: long, worstMs: Math.round(worst) } : null;
  }).catch(() => null);
  // The first section's heading, then a quarter, half and the end of the page.
  await page.evaluate(() => { const h = [...document.querySelectorAll('h2')].find(e => e.getBoundingClientRect().height > 0); if (h) window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - 160, behavior: 'instant' }); }).catch(() => {});
  await sleep(300);
  await shoot(caster, 'page-s1', Date.now(), 1200, 'page', openFound ? {} : openOpts);
  for (const [name, f] of [['page-top', 0], ['page-q1', 0.25], ['page-mid', 0.5], ['page-end', 1]]) {
    await page.evaluate(f => window.scrollTo({ top: f * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' }), f).catch(() => {});
    await sleep(300);
    await shoot(caster, name, Date.now(), 1200, 'page', openFound ? {} : openOpts);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })).catch(() => {});
  await sleep(800);
  const backT = Date.now();
  page.evaluate(() => history.back()).catch(() => {});
  await recorded('back', backT, 2600, () => burst(caster, 'back-', backT, [0, 300, 600, 1000, 1500, { name: 'back-held', at: 2500 }], 'back', openOpts));
  metrics.urlAfterBack = await page.evaluate(() => location.href).catch(() => null);
  metrics.focusAfterBack = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName || null).catch(() => null);
  await caster.stop();
  await page.close();

  // ---- Open: when the page first scrolls ------------------------------------
  // A wheel turn every 100 ms from the click; the first time scrollY moves.
  {
    const sp = await browser.newPage();
    await sp.setViewport({ width: 1440, height: 900 });
    await sp.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await sleep(7000);
    await sp.evaluate(() => { for (const b of document.querySelectorAll('button')) if (/^(accept|accept all|ok|got it)$/i.test((b.innerText || '').trim())) b.click(); }).catch(() => {});
    await sp.mouse.move(NEUTRAL.x, NEUTRAL.y); await sleep(800);
    const sc0 = siteKey === 'theirs' ? THEIR_CENTRES[0] : await sleeveCentre(sp, 0);
    if (sc0) { await sp.mouse.move(sc0.x, sc0.y); await sleep(900); }
    const startUrl = await sp.evaluate(() => location.href).catch(() => '');
    if (await clickControl(sp, 'open', 0)) {
      const t = Date.now();
      await sp.mouse.move(900, 500);
      let ready = null, opened = null;
      while (Date.now() - t < 9000 && ready === null) {
        await sp.mouse.wheel({ deltaY: 120 }).catch(() => {});
        await sleep(100);
        const st = await sp.evaluate(() => ({ y: window.scrollY, url: location.href })).catch(() => ({ y: 0, url: '' }));
        if (st.url && st.url !== startUrl && opened === null) opened = Date.now() - t;
        if (st.url !== startUrl && st.y > 0) ready = Date.now() - t;
      }
      metrics.openUrlChangeMs = opened;
      metrics.openScrollReadyMs = ready;
    }
    await sp.close();
  }

  // ---- desktop at device scale factor 2 -------------------------------------
  // The screencast delivers frames at CSS-pixel size, so this pass takes screenshots (device pixels) of
  // settled states only: rest at 10 s and hover0 after 1 s. `ms` is when the screenshot was requested.
  if (dpr === '2') {
    const d2 = await browser.newPage();
    await d2.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
    d2.on('pageerror', e => pageErrors.push('dpr2: ' + String(e.message).slice(0, 200)));
    const snap = async (name, origin, target, opts = {}) => {
      await sleep(Math.max(0, origin + target - Date.now()));
      const rec = { name, group: 'dpr2', target, originEpoch: origin, status: opts.status || 'ok', note: opts.note || 'screenshot', frameEpoch: Date.now(), ageMs: 0 };
      const file = path.join(dir, `${name}.png`);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      await d2.screenshot({ path: file }).catch(e => { rec.status = 'error'; rec.note = e.message.slice(0, 80); });
      moments.push(rec);
    };
    await d2.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
      .catch(e => { pageErrors.push('dpr2 goto: ' + e.message.slice(0, 120)); });
    const dOrigin = await d2.evaluate(() => performance.timeOrigin).catch(() => Date.now());
    await snap('dpr2/rest', dOrigin, 10000);
    await d2.evaluate(() => { for (const b of document.querySelectorAll('button')) if (/^(accept|accept all|ok|got it)$/i.test((b.innerText || '').trim())) b.click(); }).catch(() => {});
    await d2.mouse.move(NEUTRAL.x, NEUTRAL.y); await sleep(1500);
    const dc0 = siteKey === 'theirs' ? THEIR_CENTRES[0]
      : await d2.evaluate(() => { const r = window.__editions?.sleeveRect(0); return r ? { x: r.x + r.width / 2, y: r.y + r.height / 2 } : null; }).catch(() => null);
    if (dc0) await d2.mouse.move(dc0.x, dc0.y);
    await snap('dpr2/hover0-1000', Date.now(), 1000, dc0 ? {} : na('sleeve 0'));
    const dDet = await clickControl(d2, 'details', 0);
    await snap('dpr2/details-held', Date.now(), 2500, dDet ? {} : na('Details control'));
    await d2.keyboard.press('Space');
    await snap('dpr2/flip-held', Date.now(), 1500, dDet ? {} : na('Details control'));
    await d2.keyboard.press('Escape');
    await sleep(1500);
    await d2.mouse.click(EMPTY_CLICK.x, EMPTY_CLICK.y).catch(() => {});
    await sleep(800);
    if (dc0) { await d2.mouse.move(dc0.x, dc0.y); await sleep(900); }
    const dOpen = await clickControl(d2, 'open', 0);
    await snap('dpr2/open-held', Date.now(), 6000, dOpen ? {} : na('Open control'));
    await d2.evaluate(() => window.scrollTo({ top: 0.5 * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' })).catch(() => {});
    await snap('dpr2/page-mid', Date.now(), 1200, dOpen ? {} : na('Open control'));
    await d2.close();
  }

  // ---- other desktop sizes (rest only) ---------------------------------------
  if (extraSizes) {
    for (const [w, h] of [[1280, 800], [1920, 1080]]) {
      const sp = await browser.newPage();
      await sp.setViewport({ width: w, height: h });
      sp.on('pageerror', e => pageErrors.push(`${w}x${h}: ` + String(e.message).slice(0, 200)));
      await sp.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 })
        .catch(e => { pageErrors.push(`${w}x${h} goto: ` + e.message.slice(0, 120)); });
      const so = await sp.evaluate(() => performance.timeOrigin).catch(() => Date.now());
      await sleep(Math.max(0, so + 10000 - Date.now()));
      const name = `size-${w}x${h}/rest`;
      const rec = { name, group: 'sizes', target: 10000, originEpoch: so, status: 'ok', note: 'screenshot', frameEpoch: Date.now(), ageMs: 0 };
      fs.mkdirSync(path.join(dir, `size-${w}x${h}`), { recursive: true });
      await sp.screenshot({ path: path.join(dir, `${name}.png`) }).catch(e => { rec.status = 'error'; rec.note = e.message.slice(0, 80); });
      moments.push(rec);
      await sp.close();
    }
  }

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
  // The project page by its own address (ours: the hash route), top and middle. A blank page first makes it a
  // fresh load: a hash-only goto stays in the same document and keeps the old time origin.
  await m.goto('about:blank').catch(() => {});
  await m.goto(site.openUrl, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => { pageErrors.push('phone open goto: ' + e.message.slice(0, 120)); });
  const poOrigin = await m.evaluate(() => performance.timeOrigin).catch(() => Date.now());
  await shoot(mc, 'phone-page-world', poOrigin, 6000, 'phone', { note: site.openUrl });
  for (const [name, f] of [['phone-page-q1', 0.25], ['phone-page-mid', 0.5]]) {
    await m.evaluate(f => window.scrollTo({ top: f * (document.documentElement.scrollHeight - innerHeight), behavior: 'instant' }), f).catch(() => {});
    await sleep(300);
    await shoot(mc, name, Date.now(), 1200, 'phone');
  }
  metrics.phonePage = await m.evaluate(() => ({ scrollHeight: document.documentElement.scrollHeight, scrollWidth: document.documentElement.scrollWidth, innerWidth })).catch(() => null);
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
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'],
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
