import { createRequire } from 'module';
const require = createRequire('/Users/neil/.cache/board-tools/node_modules/');
const puppeteer = require('puppeteer-core');
const D = '/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/i-light';
const exe = process.env.HOME + '/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: exe, headless: 'shell' });
async function open(reduce) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  if (reduce) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.evaluateOnNewDocument(() => {
    window.__draws = []; const clr = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...a) { if (this.canvas.id === 'sun-e') window.__draws.push(performance.now()); return clr.apply(this, a); };
    window.__oriListeners = 0; const add = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (t, ...a) { if (t === 'deviceorientation') window.__oriListeners++; return add.call(this, t, ...a); };
  });
  await page.goto(`file://${D}/index.html?lang=en`);
  return page;
}
const n = (p) => p.evaluate(() => window.__draws.length);
let p = await open(true); await sleep(3000);
console.log('reduced motion: draws in 3 s =', await n(p), ', tilt listeners =', await p.evaluate(() => window.__oriListeners));
p = await open(false); await sleep(5500);
let a = await n(p); await sleep(1000); console.log('ambient draws per s =', (await n(p)) - a);
await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
a = await n(p); await sleep(1000); console.log('hidden tab: draws in 1 s =', (await n(p)) - a);
await p.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
// what sits under a tap on the shadow, and is the tap target clear of pills and picker?
const info = await p.evaluate(() => {
  const s = document.getElementById('stage').getBoundingClientRect(), r = (sel) => [...document.querySelectorAll(sel)].map((e) => e.getBoundingClientRect());
  const hit = document.elementFromPoint(300, 260);
  const overlap = r('.pill, .pm-btn').some((b) => b.top < s.bottom && b.bottom > s.top && b.left < s.right && b.right > s.left);
  return { stage: [s.top, s.bottom], hitId: hit.id, role: hit.getAttribute('role'), name: hit.getAttribute('aria-label'), text: hit.textContent, overlap };
});
console.log('tap target', JSON.stringify(info));
a = await n(p); await p.mouse.click(300, 260); await sleep(1000);
console.log('after a tap on the shadow: draws in 1 s =', (await n(p)) - a, '(60/s during the hello)');
await browser.close();
