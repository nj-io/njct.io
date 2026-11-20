// Tilt renders (CDP DeviceOrientation override) and frame timing (CDP tracing at 4x CPU throttle).
// node probe.mjs tilt | perf
import { createRequire } from 'module';
const require = createRequire('/Users/neil/.cache/board-tools/node_modules/');
const puppeteer = require('puppeteer-core');
const D = '/private/tmp/claude-501/-Users-neil-dev-njct-io/6ba60b26-2cfa-4839-8dfa-df933b8889b4/scratchpad/hi-designs/i-light';
const exe = process.env.HOME + '/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const mode = process.argv[2];
const browser = await puppeteer.launch({ executablePath: exe, headless: 'shell', args: ['--hide-scrollbars'] });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
const cdp = await page.createCDPSession();

if (mode === 'tilt') {
  await page.goto(`file://${D}/work/${process.env.PAGE || 'index.html?lang=en'}`);
  console.log('secure context', await page.evaluate(() => isSecureContext));
  await page.evaluate(() => { window.__ori = 0; addEventListener('deviceorientation', () => window.__ori++); });
  await sleep(5200);                                // the load and the first wave are over
  const shots = [['neutral', 0, 45], ['tilt-a', -30, 15], ['tilt-b', 30, 75]];
  for (const [name, gamma, beta] of shots) {
    await cdp.send('DeviceOrientation.setDeviceOrientationOverride', { alpha: 0, beta, gamma });
    await sleep(900);
    await page.screenshot({ path: `${D}/work/${name}.png` });
  }
  console.log('orientation events seen', await page.evaluate(() => window.__ori));
}

if (mode === 'perf') {
  // count the light's redraws (each clears the amber canvas once) without touching the page's code
  await page.evaluateOnNewDocument(() => {
    window.__draws = [];
    const clr = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...a) { if (this.canvas.id === 'sun-e') window.__draws.push(performance.now()); return clr.apply(this, a); };
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.tracing.start({ path: `${D}/work/${process.env.TRACE || 'trace.json'}`, categories: ['devtools.timeline','disabled-by-default-devtools.timeline.frame','cc','gpu','viz','blink','disabled-by-default-skia'] });
  await page.goto(`file://${D}/work/${process.env.PAGE || 'index.html?lang=en'}`);
  await sleep(9000);
  await page.tracing.stop();
  const draws = await page.evaluate(() => window.__draws);
  const t0 = draws[0], phase = (a, b) => draws.filter((t) => t - t0 >= a && t - t0 < b);
  const rate = (a, b) => { const d = phase(a, b); return d.length > 1 ? ((d.length - 1) / ((d[d.length - 1] - d[0]) / 1000)).toFixed(1) : 'n/a'; };
  console.log('redraws/s  load 0-2.4s:', rate(0, 2400), ' wave 2.65-4.75s:', rate(2700, 4700), ' ambient 5-9s:', rate(5000, 9000));
  // main-thread cost of each animation frame callback, from the trace
  const ev = require('fs').readFileSync(`${D}/work/${process.env.TRACE || 'trace.json'}`, 'utf8');
  const tr = JSON.parse(ev).traceEvents;
  const raf = tr.filter((e) => e.name === 'FireAnimationFrame' && e.dur).map((e) => e.dur / 1000);
  raf.sort((a, b) => a - b);
  const pct = (p) => raf[Math.min(raf.length - 1, Math.floor(p * raf.length))].toFixed(2);
  const heavy = raf.filter((d) => d > 0.3);
  console.log('rAF callbacks', raf.length, ' that drew (>0.3 ms):', heavy.length, ' p50', pct(0.5), 'p90', pct(0.9), 'p99', pct(0.99), 'max', raf[raf.length - 1].toFixed(2), 'ms');
  const frames = tr.filter((e) => e.name === 'DrawFrame' || e.name === 'Screenshot').length;
  const dropped = tr.filter((e) => e.name === 'DroppedFrame').length;
  const begin = tr.filter((e) => e.name === 'BeginFrame').length;
  console.log('trace frames: BeginFrame', begin, 'DrawFrame', frames, 'DroppedFrame', dropped);
  const longTasks = tr.filter((e) => e.name === 'RunTask' && e.dur > 50000).map((e) => (e.dur / 1000).toFixed(0));
  console.log('tasks over 50 ms (4x throttle):', longTasks.join(', ') || 'none');
}
await browser.close();
