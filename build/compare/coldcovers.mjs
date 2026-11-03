// Covers on a cold start: each sleeve's cover-ready time against its appearance in the intro
// (INTRO.appear.at + stagger * i), with no shader cache (a fresh profile per run and the GPU shader disk
// cache off), at 1x and under a 4x CPU slowdown.
//
//   node build/compare/coldcovers.mjs --round r0 [--runs 3]
//
// Output: .captures/<round>/coldcovers.json. Only headless Chrome; only ours.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { INTRO_APPEAR } from './coldcovers-intro.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round'), runs = +(arg('runs') || 3);
if (!round || !/^[\w.-]+$/.test(round)) { console.error('usage: node build/compare/coldcovers.mjs --round <name> [--runs 3]'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const res = { capturedAt: new Date().toISOString(), runs: {} };
for (const rate of [1, 4]) {
  res.runs[`cpu${rate}x`] = [];
  for (let k = 0; k < runs; k++) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nj-cold-'));
    const browser = await puppeteer.launch({
      executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, userDataDir: dir, protocolTimeout: 120000,
      args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic',
        '--disable-gpu-shader-disk-cache', '--disable-gpu-program-cache'],
    });
    const pg = await browser.newPage();
    await pg.setViewport({ width: 1440, height: 900 });
    pg.on('console', m => { if (['warn', 'error'].includes(m.type())) console.error('page', m.type(), m.text().slice(0, 200)); });
    pg.on('pageerror', e => console.error('pageerror', e.message.slice(0, 200)));
    await pg.evaluateOnNewDocument(() => { window.__raf = []; const f = t => { window.__raf.push(t); requestAnimationFrame(f); }; requestAnimationFrame(f); });
    const cdp = await pg.createCDPSession();
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await pg.goto(`http://127.0.0.1:8750/editions/?nonce=${Date.now()}${k}`, { waitUntil: 'domcontentloaded' });
    const ok = await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 30000 }).then(() => true, () => false);
    if (!ok) {
      console.error('no first frame:', JSON.stringify(await pg.evaluate(() => ({ noGl: document.documentElement.classList.contains('no-gl'), gl2: !!document.createElement('canvas').getContext('webgl2'), hooks: !!window.__editions }))));
      await browser.close(); fs.rmSync(dir, { recursive: true, force: true }); k--; continue;
    }
    await pg.waitForFunction(() => window.__editions.coverReadyAt.every(t => t != null), { timeout: 30000 }).catch(() => {});
    const r = await pg.evaluate(() => ({ firstFrameAt: Math.round(window.__editions.firstFrameAt), ready: window.__editions.coverReadyAt, names: [...document.querySelectorAll('#slots h2')].map(h => h.textContent) }));
    await sleep(2500);
    // The intro's cadence while the covers build: frames from the first frame to 2.5 s after it.
    Object.assign(r, await pg.evaluate(() => {
      const t0 = window.__editions.firstFrameAt, a = window.__raf.filter(t => t >= t0 && t <= t0 + 2500);
      const d = a.slice(1).map((t, i) => t - a[i]);
      return { introWorstMs: +Math.max(...d).toFixed(1), introOver33: d.filter(x => x > 33.4).length, introOver20: d.filter(x => x > 20).length };
    }));
    r.appear = r.ready.map((_, i) => INTRO_APPEAR(i));
    r.late = r.ready.map((t, i) => (t == null ? null : t - r.appear[i]));
    res.runs[`cpu${rate}x`].push(r);
    await browser.close();
    fs.rmSync(dir, { recursive: true, force: true });
    await sleep(500);
  }
}
const out = path.join(ROOT, '.captures', round);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'coldcovers.json'), JSON.stringify(res, null, 1));
for (const [k, v] of Object.entries(res.runs)) for (const r of v) console.log(k, 'ready', r.ready.join(' '), '| late', r.late.join(' '), '| intro worst', r.introWorstMs, 'over33', r.introOver33);
process.exit(0);
