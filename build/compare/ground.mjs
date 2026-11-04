// The CSS ground against the scene's first frame, at 1440x900 and 390x844.
//
//   node build/compare/ground.mjs --round r0
//
// Shots with the shelf held empty (__editionsTest.noSleeves), text and controls hidden: the first WebGL
// frame after the canvas fade (gl), the same with the shelves taken out (bare: the wall alone), and the
// page with the canvas hidden (css). dE (CIE76): css against bare over the whole frame, and css against
// gl over the wall region (where the shelves change the wall by 2 grey levels or less).
// Output: .captures/<round>/ground/{<size>-gl|bare|css.png, report.txt}. Only headless Chrome; only ours.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const args = process.argv.slice(2);
const round = args[args.indexOf('--round') + 1];
if (!round || !/^[\w.-]+$/.test(round)) { console.error('usage: node build/compare/ground.mjs --round <name>'); process.exit(2); }
const dir = path.join(ROOT, '.captures', round, 'ground');
fs.mkdirSync(dir, { recursive: true });
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'] });
const lines = [];
try {
  for (const [name, w, h, mobile] of [['1440x900', 1440, 900, false], ['390x844', 390, 844, true]]) {
    for (const bare of [false, true]) {
      const pg = await browser.newPage();
      await pg.bringToFront();
      await pg.emulate({ viewport: { width: w, height: h, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile }, userAgent: mobile ? PHONE_UA : await browser.userAgent() });
      await pg.evaluateOnNewDocument(b => { window.__editionsTest = { noSleeves: true, noShelves: b }; }, bare);
      await pg.goto('http://127.0.0.1:8750/', { waitUntil: 'domcontentloaded' });
      await pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 60000 });
      await sleep(2500);
      await pg.addStyleTag({ content: '.masthead, .index, .crate-bar, .crate-rail, #slots { visibility: hidden !important; }' });
      await sleep(200);
      await pg.screenshot({ path: path.join(dir, `${name}-${bare ? 'bare' : 'gl'}.png`) });
      if (!bare) {
        await pg.addStyleTag({ content: 'canvas { visibility: hidden !important; }' });
        await sleep(200);
        await pg.screenshot({ path: path.join(dir, `${name}-css.png`) });
      }
      await pg.close();
    }
    const de = (...a) => spawnSync('python3', [path.join(HERE, 'deltae.py'), ...a.map(f => path.join(dir, f))], { encoding: 'utf8' }).stdout.trim();
    lines.push(`${name} css vs bare wall, whole frame: ${de(`${name}-css.png`, `${name}-bare.png`)}`);
    lines.push(`${name} css vs first WebGL frame, wall region: ${de(`${name}-css.png`, `${name}-gl.png`, `${name}-bare.png`)}`);
  }
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(dir, 'report.txt'), lines.join('\n') + '\n');
console.log(lines.join('\n'));
process.exit(0);
