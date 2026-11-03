// Accessibility and reduced-motion pass for ours.
//
//   node build/compare/a11y.mjs --round r0
//
// AX tree (CDP Accessibility.getFullAXTree) on the shelf at 1440x900, the crate at 390x844, Details, an
// open page and the no-WebGL fallback: every sleeve's role and name, every interactive node's name, the
// heading outline, the live region's text after each change. Reduced motion (prefers-reduced-motion:
// reduce): shots of the intro, Details, the flip, Open and the crate, and whether the world holds still.
// Output: .captures/<round>/a11y/{ax-*.json, reduced-*.png, report.json}. Only headless Chrome; only ours.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const URL0 = 'http://127.0.0.1:8750/editions/';
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const args = process.argv.slice(2);
const round = args[args.indexOf('--round') + 1];
if (!round || !/^[\w.-]+$/.test(round)) { console.error('usage: node build/compare/a11y.mjs --round <name>'); process.exit(2); }
const dir = path.join(ROOT, '.captures', round, 'a11y');
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const INTERACTIVE = new Set(['button', 'link', 'textbox', 'checkbox', 'menuitem', 'tab', 'switch', 'slider', 'combobox']);
const report = {};

async function ax(pg, name) {
  const cdp = await pg.createCDPSession();
  const { nodes } = await cdp.send('Accessibility.getFullAXTree');
  await cdp.detach();
  const live = nodes.filter(n => !n.ignored);
  const pick = n => ({ role: n.role?.value, name: n.name?.value || '' });
  const flat = live.map(pick);
  fs.writeFileSync(path.join(dir, `ax-${name}.json`), JSON.stringify(flat, null, 1));
  const headings = live.filter(n => n.role?.value === 'heading').map(n => `h${(n.properties || []).find(p => p.name === 'level')?.value?.value} ${n.name?.value}`);
  const levels = headings.map(h => +h[1]);
  const skips = levels.filter((l, i) => i > 0 && l > levels[i - 1] + 1).length;
  const out = {
    nodes: live.length,
    unnamedInteractive: flat.filter(n => INTERACTIVE.has(n.role) && !n.name.trim()),
    sleeves: flat.filter(n => n.role === 'article').map(n => n.name),
    headings, headingSkips: skips,
    live: await pg.evaluate(() => document.getElementById('announce')?.textContent ?? null),
  };
  report[name] = out;
  return out;
}

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, protocolTimeout: 120000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'],
});
const ready = pg => pg.waitForFunction(() => window.__editions?.firstFrameAt != null, { timeout: 60000 });
try {
  // Shelf, Details, a page.
  let pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded' }); await ready(pg); await sleep(4000);
  await ax(pg, 'shelf');
  await pg.focus('button[data-action="details"][data-index="0"]'); await pg.keyboard.press('Enter'); await sleep(1500);
  await ax(pg, 'details');
  await pg.keyboard.press('Space'); await sleep(900);
  report.flipLive = await pg.evaluate(() => document.getElementById('announce').textContent);
  await pg.keyboard.press('Escape'); await sleep(1200);
  report.closeLive = await pg.evaluate(() => document.getElementById('announce').textContent);
  report.focusAfterDetails = await pg.evaluate(() => document.activeElement?.getAttribute('aria-label'));
  await pg.click('button[data-action="open"][data-index="0"]').catch(async () => { await pg.focus('button[data-action="open"][data-index="0"]'); await pg.keyboard.press('Enter'); });
  await sleep(3500);
  await ax(pg, 'page-mirra');
  report.focusOnPage = await pg.evaluate(() => document.activeElement?.tagName + ' ' + (document.activeElement?.getAttribute('aria-label') || ''));
  await pg.goto(URL0 + '#about', { waitUntil: 'domcontentloaded' }); await sleep(4000);
  await ax(pg, 'page-about');
  await pg.close();
  // Crate.
  pg = await browser.newPage();
  await pg.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded' }); await ready(pg); await sleep(4000);
  await ax(pg, 'crate');
  await pg.tap('.cb-details'); await sleep(1500);
  await ax(pg, 'crate-details');
  await pg.close();
  // No WebGL.
  pg = await browser.newPage();
  await pg.setViewport({ width: 1440, height: 900 });
  await pg.evaluateOnNewDocument(() => { window.__editionsTest = { noWebGL: true }; });
  await pg.goto(URL0, { waitUntil: 'domcontentloaded' }); await sleep(3000);
  await ax(pg, 'nogl');
  await pg.close();

  // Reduced motion.
  const rm = { };
  for (const [kind, setup] of [['desk', p => p.setViewport({ width: 1440, height: 900 })],
    ['phone', p => p.emulate({ viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: PHONE_UA })]]) {
    pg = await browser.newPage();
    await setup(pg);
    await pg.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await pg.goto(URL0, { waitUntil: 'domcontentloaded' }); await ready(pg);
    const shot = n => pg.screenshot({ path: path.join(dir, `reduced-${kind}-${n}.png`) });
    await sleep(150); await shot('intro-150');
    await sleep(450); await shot('intro-600');
    await sleep(2500);
    if (kind === 'desk') {
      await pg.focus('button[data-action="details"][data-index="0"]'); await pg.keyboard.press('Enter');
      await sleep(80); await shot('details-80'); await sleep(400); await shot('details-480');
      await pg.keyboard.press('Space'); await sleep(80); await shot('flip-80'); await sleep(300); await shot('flip-380');
      await pg.keyboard.press('Escape'); await sleep(600);
      await pg.focus('button[data-action="open"][data-index="0"]'); await pg.keyboard.press('Enter');
    } else {
      const cdp = await pg.createCDPSession();
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 300 }] });
      for (let k = 1; k <= 8; k++) { await sleep(15); await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 300 + 30 * k }] }); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await sleep(60); await shot('flick-60'); await sleep(300); await shot('flick-360');
      rm.phoneAfterFlick = await pg.evaluate(() => window.__editions.crate);
      await pg.tap('.cb-open');
    }
    await sleep(300); await shot('open-300');
    await sleep(1500); await shot('open-1800');
    await sleep(2000); await shot('open-3800');
    // Still: two shots of the world 1.5 s apart differ by nothing.
    const a = await pg.screenshot({ encoding: 'base64' }); await sleep(1500); const b = await pg.screenshot({ encoding: 'base64' });
    rm[`${kind}WorldStill`] = a === b;
    await pg.close();
  }
  report.reduced = rm;
} finally {
  await browser.close();
}
fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, (k, v) => (k === 'headings' && Array.isArray(v) && v.length > 12 ? [...v.slice(0, 12), `… ${v.length} in all`] : v), 1));
process.exit(0);
