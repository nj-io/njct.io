// Runs the wall light fit headless and writes the result next to the reference round.
//   node build/compare/fit/fit.mjs --ref .captures/ref2/theirs/rest.png [--iters 1200] [--start lights.json] [--out dir]
//     [--port 8750] [--weights wAnchor=100,wClip=0.05,wFace=20,wallLimit=243] [--free halo.drop,glow] [--step 1] [--skip end]
//   --free limits the fit to those LIGHTS paths, --step scales the first moves, --skip drops target groups from the cost.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const ref = arg('ref'), iters = arg('iters') || '1200', out = arg('out') || path.dirname(ref), port = arg('port') || '8750';
const start = arg('start') ? fs.readFileSync(arg('start'), 'utf8') : null;
const qs = new URLSearchParams({ ref: '/' + ref.replace(/^\/+/, ''), iters });
if (start) qs.set('start', start);
for (const kv of (arg('weights') || '').split(',').filter(Boolean)) qs.set(...kv.split('='));
if (arg('free')) qs.set('free', arg('free'));
if (arg('step')) qs.set('step', arg('step'));
if (arg('skip')) qs.set('skip', arg('skip'));
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 1800000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--use-mock-keychain', '--password-store=basic'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on('console', m => console.log(m.text().slice(0, 300)));
page.on('pageerror', e => console.log('pageerror', e.message));
await page.goto(`http://127.0.0.1:${port}/build/compare/fit/fit.html?${qs}`);
await page.waitForFunction(() => window.fitResult, { timeout: 1800000, polling: 1000 });
const r = await page.evaluate(() => window.fitResult);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'fit-diff.png'), Buffer.from(r.diff.split(',')[1], 'base64'));
fs.writeFileSync(path.join(out, 'fit-ours.png'), Buffer.from(r.ours.split(',')[1], 'base64'));
fs.writeFileSync(path.join(out, 'fit-lights.json'), JSON.stringify(r.lights, null, 1));
console.log(JSON.stringify({ start: r.start, cost: r.cost, before: r.before, after: r.after, anchorPts: r.anchorPts, clipPts: r.clipPts, lights: r.lights }));
await browser.close();
