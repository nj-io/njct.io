// Device pass of the comparison harness: phones and tablets, theirs and ours, the same steps on each.
//
//   node build/compare/devices.mjs --round r0 [--only theirs|ours] [--devices phone,phone-s,...] [--explore]
//
// Per device: rest (8 s after navigation), a probe of the layout (controls with their boxes and names,
// fixed layers, scroll extents), a touch fling through the crate (scroll position sampled every frame,
// screencast frames kept), a tap on Details, a flip, Open and Back. --explore stops after the probe at
// Details, for finding a site's controls. Output: .captures/<round>/<site>/dev-<device>/{<step>.png,
// probe-*.json, fling.json, frames/}. Only headless Chrome; network limited to the two sites.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SITES = {
  theirs: { url: 'https://www.shopify.com/editions' },
  ours: { url: 'http://127.0.0.1:8750/editions/' },
};
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const TABLET_UA = 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
export const DEVICES = {
  phone: { width: 390, height: 844, ua: PHONE_UA },
  'phone-s': { width: 360, height: 780, ua: PHONE_UA },
  'phone-l': { width: 430, height: 932, ua: PHONE_UA },
  'phone-land': { width: 844, height: 390, ua: PHONE_UA },
  tablet: { width: 768, height: 1024, ua: TABLET_UA },
  'tablet-land': { width: 1024, height: 768, ua: TABLET_UA },
};

const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round'), only = arg('only'), explore = args.includes('--explore');
const devices = (arg('devices') || Object.keys(DEVICES).join(',')).split(',');
if (!round || !/^[\w.-]+$/.test(round) || (only && !SITES[only]) || devices.some(d => !DEVICES[d])) {
  console.error('usage: node build/compare/devices.mjs --round <name> [--only theirs|ours] [--devices ' + Object.keys(DEVICES).join(',') + '] [--explore]');
  process.exit(2);
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// The layout as a visitor's finger meets it. Runs in the page.
function probe() {
  const vis = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && +cs.opacity > 0.01 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
  const box = el => { const r = el.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; };
  const name = el => (el.getAttribute('aria-label') || el.innerText || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const controls = [...document.querySelectorAll('a,button,[role=button],input,[tabindex]:not([tabindex="-1"])')].filter(vis)
    .map(el => ({ tag: el.tagName, name: name(el), box: box(el) }));
  const fixed = [...document.querySelectorAll('body *')].filter(el => ['fixed', 'sticky'].includes(getComputedStyle(el).position) && vis(el))
    .slice(0, 30).map(el => ({ tag: el.tagName, cls: el.className.toString().slice(0, 50), box: box(el), text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 80) }));
  const scrollers = [...document.querySelectorAll('body *')].filter(el => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowY + cs.overflowX) && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 2); })
    .slice(0, 10).map(el => ({ tag: el.tagName, cls: el.className.toString().slice(0, 50), box: box(el), sh: el.scrollHeight, sw: el.scrollWidth, ch: el.clientHeight, cw: el.clientWidth }));
  const de = document.documentElement;
  return { url: location.href, inner: [innerWidth, innerHeight], scroll: [scrollX, scrollY], doc: [de.scrollWidth, de.scrollHeight],
    controls, fixed, scrollers, canvases: [...document.querySelectorAll('canvas')].map(c => ({ box: box(c), size: [c.width, c.height] })),
    small: controls.filter(c => c.box[2] < 44 || c.box[3] < 44).map(c => `${c.name || c.tag} ${c.box[2]}x${c.box[3]}`) };
}

// Every frame, the page records its scroll offsets (window and the largest scroller) for the fling.
function sampler() {
  window.__fling = [];
  const pick = () => [...document.querySelectorAll('body *')].map(el => [el, el.scrollHeight - el.clientHeight]).filter(([el, d]) => d > 2 && /(auto|scroll)/.test(getComputedStyle(el).overflowY)).sort((a, b) => b[1] - a[1])[0]?.[0];
  let el = null, n = 0;
  const f = t => { if (!el || n++ % 60 === 0) el = pick() || null; window.__fling.push([Math.round(t), Math.round(scrollY), el ? Math.round(el.scrollTop) : null]); requestAnimationFrame(f); };
  requestAnimationFrame(f);
}

async function caster(pg, dir) {
  const cdp = await pg.createCDPSession();
  let keep = null, n = 0;
  cdp.on('Page.screencastFrame', e => {
    cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {});
    if (keep) { fs.mkdirSync(keep, { recursive: true }); fs.writeFile(path.join(keep, `${String(n++).padStart(4, '0')}-${Math.round(e.metadata.timestamp * 1000) % 1e6}.png`), Buffer.from(e.data, 'base64'), () => {}); }
  });
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  return { cdp, start(sub) { keep = path.join(dir, 'frames', sub); n = 0; }, stop() { keep = null; } };
}

// A finger flick: down, a fast drag of `dy` px over `ms`, lift (the browser then flings with momentum).
async function flick(cdp, x, y, dy, ms = 120, steps = 8) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  for (let k = 1; k <= steps; k++) {
    await sleep(ms / steps);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + dy * k / steps }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}
const tap = async (pg, x, y) => { await pg.touchscreen.tap(Math.round(x), Math.round(y)); };
// The visible control whose name matches (exact, then prefix), centred.
const find = (pg, re) => pg.evaluate(src => {
  const rx = new RegExp(src, 'i');
  const els = [...document.querySelectorAll('a,button,[role=button]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0 && +getComputedStyle(el).opacity > 0.01; });
  const el = els.find(e => rx.test((e.getAttribute('aria-label') || e.innerText || '').trim()));
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2, name: (el.getAttribute('aria-label') || el.innerText).trim().slice(0, 40), w: r.width, h: r.height };
}, re.source);

async function runDevice(browser, siteKey, devKey) {
  const site = SITES[siteKey], dev = DEVICES[devKey];
  const dir = path.join(ROOT, '.captures', round, siteKey, `dev-${devKey}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const pg = await browser.newPage();
  await pg.emulate({ viewport: { width: dev.width, height: dev.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true, isLandscape: dev.width > dev.height }, userAgent: dev.ua });
  const errors = [];
  pg.on('pageerror', e => errors.push(String(e.message).slice(0, 200)));
  await pg.evaluateOnNewDocument(sampler);
  const c = await caster(pg, dir);
  const out = { device: devKey, ...dev, ua: undefined, steps: {} };
  const step = async (name, fn) => { try { out.steps[name] = (await fn()) ?? 'ok'; } catch (e) { out.steps[name] = 'error: ' + e.message.slice(0, 120); } };
  const shot = name => pg.screenshot({ path: path.join(dir, `${name}.png`) });
  const save = (name, data) => fs.writeFileSync(path.join(dir, `${name}.json`), JSON.stringify(data, null, 1));

  await pg.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => errors.push('goto: ' + e.message.slice(0, 120)));
  await sleep(8000);
  await step('rest', async () => { await shot('rest'); save('probe-rest', await pg.evaluate(probe)); });
  // Through the crate: a fast flick down (finger moves down), a slow drag down held mid-way (does the crate
  // follow the finger?), then a fast flick up. Scroll offsets are sampled every frame; frames are kept.
  await step('fling', async () => {
    const t0 = await pg.evaluate(() => performance.now());
    const res = {};
    c.start('flick-down');
    await flick(c.cdp, dev.width / 2, dev.height * 0.35, dev.height * 0.3);
    await sleep(2500); c.stop(); await shot('flick-down');
    c.start('drag');
    await c.cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: dev.width / 2, y: dev.height * 0.4 }] });
    for (let k = 1; k <= 20; k++) { await sleep(50); await c.cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: dev.width / 2, y: dev.height * 0.4 + 6 * k }] }); }
    await sleep(400); await shot('drag-held');
    await c.cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await sleep(2000); c.stop(); await shot('drag-end');
    c.start('flick-up');
    await flick(c.cdp, dev.width / 2, dev.height * 0.65, -dev.height * 0.3);
    await sleep(2500); c.stop(); await shot('flick-up');
    const log = await pg.evaluate(t0 => window.__fling.filter(r => r[0] >= t0), t0);
    save('fling', log);
    const ys = log.map(r => r[2] ?? r[1]);
    res.samples = log.length; res.maxScroll = Math.max(...ys);
    res.label = await pg.evaluate(() => [...document.querySelectorAll('body *')].filter(el => getComputedStyle(el).position === 'fixed' && el.getBoundingClientRect().top > innerHeight * 0.8).map(el => el.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)[0] || null);
    return res;
  });
  await step('details', async () => {
    let b = await find(pg, /details/);
    // Ours on a touch shelf: the pills show on hover only, and a tap on the sleeve opens Details.
    if (!b) { const r = await pg.evaluate(() => window.__editions?.sleeveRect?.(0)); if (r) b = { x: r.x + r.width / 2, y: r.y + r.height / 2, name: 'tap on sleeve 0' }; }
    if (!b) { await shot('details-missing'); return 'no Details control'; }
    await tap(pg, b.x, b.y); await sleep(1800); await shot('details');
    save('probe-details', await pg.evaluate(probe));
    return b;
  });
  if (!explore) {
    await step('flip', async () => {
      const b = await find(pg, /(flip|turn over|back of)/);
      if (b) { await tap(pg, b.x, b.y); } else { const r = await pg.evaluate(() => [innerWidth / 2, innerHeight * 0.45]); await tap(pg, r[0], r[1]); }
      await sleep(1400); await shot('flip');
      return b || 'tapped the sleeve';
    });
    await step('open', async () => {
      const b = await find(pg, /^open/) || await find(pg, /open edition/);
      if (!b) return 'no Open control';
      c.start('open');
      await tap(pg, b.x, b.y); await sleep(5000); await shot('open');
      c.stop();
      save('probe-open', await pg.evaluate(probe));
      return b;
    });
    await step('back', async () => {
      await pg.goBack({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
      await sleep(5000); await shot('back');
      return await pg.evaluate(() => ({ url: location.href, focus: document.activeElement?.getAttribute('aria-label') || document.activeElement?.tagName }));
    });
  }
  out.errors = errors;
  out.noSideScroll = await pg.evaluate(() => document.documentElement.scrollWidth <= innerWidth).catch(() => null);
  save('summary', out);
  await c.cdp.send('Page.stopScreencast').catch(() => {});
  await pg.close();
  console.log(siteKey, devKey, JSON.stringify(out.steps).slice(0, 300));
}

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 120000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'],
});
try {
  for (const key of only ? [only] : ['theirs', 'ours']) for (const d of devices) await runDevice(browser, key, d);
} finally {
  await browser.close();
}
process.exit(0);
