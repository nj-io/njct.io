// The header menu, theirs (the Editions menu on an edition page) beside ours (the Projects menu on the shelf):
// closed and open at 1440x900 (DPR 1 and 2) and on a phone (390x844, DPR 2), every frame of the open and
// close motion (DPR 1), and the menu's geometry and type as the browser lays them out.
//
//   node build/compare/menu.mjs --round <name> [--only theirs|ours]
//
// Output: .captures/<round>/menu/<site>/{desktop,desktop-dpr2,phone}/{closed,open}.png, frames/{open,close}/<ms>.png,
// metrics.json. Headless Chrome only; network limited to the two sites.
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const SITES = {
  theirs: {
    url: 'https://www.shopify.com/editions/fall2026', settle: 5000,
    trigger: '#all-editions-dropdown-button', list: '#all-editions-dropdown-expandable-section',
    phoneTrigger: '#mobile-all-editions-dropdown-button', phoneList: '#mobile-all-editions-dropdown-expandable-section',
    phoneFirst: 'button[aria-controls="mobile-menu"]',
  },
  ours: {
    url: 'http://127.0.0.1:8750/editions/', settle: 3000,
    trigger: '.pm-btn', list: '.pm-list', phoneTrigger: '.pm-btn', phoneList: '.pm-list',
  },
};
const args = process.argv.slice(2);
const arg = k => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const round = arg('round'), only = arg('only');
if (!round || !/^[\w.-]+$/.test(round) || (only && !SITES[only])) { console.error('usage: node build/compare/menu.mjs --round <name> [--only theirs|ours]'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Geometry and type of the trigger, its label and chevron, the panel and each item. Runs in the page.
function outline(trigger, list) {
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return [b.x, b.y, b.width, b.height].map(v => Math.round(v * 10) / 10); };
  const st = el => { if (!el) return null; const c = getComputedStyle(el); return { font: `${c.fontWeight} ${c.fontSize}/${c.lineHeight}`, family: c.fontFamily.slice(0, 30), ls: c.letterSpacing, color: c.color, bg: c.backgroundColor, radius: c.borderRadius, shadow: c.boxShadow.replace(/rgba\(0, 0, 0, 0\) 0px 0px 0px 0px, /g, ''), padding: c.padding, border: c.borderBottom, opacity: c.opacity, translate: c.translate, transition: c.transition.slice(0, 160) }; };
  const textRect = el => { const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) if (n.textContent.trim()) { const rg = document.createRange(); rg.selectNodeContents(n); return r(rg); } return null; };
  const b = document.querySelector(trigger), l = [...document.querySelectorAll(list)].find(e => e.getBoundingClientRect().width > 0) || document.querySelector(list);
  const icon = b?.querySelector('svg, .icon');
  const items = l ? [...l.children].map(li => {
    const a = li.querySelector('a, span[aria-current]') || li;
    const img = li.querySelector('img, .pm-icon');
    const texts = [...li.querySelectorAll('p, .pm-name, .pm-sub')];
    return { li: r(li), liStyle: st(li), a: r(a), aStyle: st(a), icon: r(img), text: texts.map(t => ({ rect: r(t), ink: textRect(t), style: st(t), text: t.textContent.trim() })) };
  }) : [];
  return { trigger: r(b), triggerStyle: st(b), label: b && textRect(b), icon: r(icon), expanded: b?.getAttribute('aria-expanded'), panel: r(l), panelStyle: st(l), items };
}

async function run(browser, key) {
  const site = SITES[key], dir = path.join(ROOT, '.captures', round, 'menu', key);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const metrics = {};
  for (const [name, view] of [['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }], ['desktop-dpr2', { width: 1440, height: 900, deviceScaleFactor: 2 }], ['phone', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }]]) {
    const phone = name === 'phone', out = path.join(dir, name);
    fs.mkdirSync(out, { recursive: true });
    const page = await browser.newPage();
    if (phone) await page.emulate({ viewport: view, userAgent: PHONE_UA }); else await page.setViewport(view);
    await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 });
    await sleep(site.settle);
    const trig = phone ? site.phoneTrigger : site.trigger, list = phone ? site.phoneList : site.list;
    if (phone && site.phoneFirst) { await page.tap(site.phoneFirst); await sleep(900); }
    await page.mouse.move(view.width - 20, view.height / 2);
    await sleep(300);
    await page.screenshot({ path: path.join(out, 'closed.png') });
    const closed = await page.evaluate(outline, trig, list);
    // Hovered, closed (desktop): the trigger's hover colours.
    let hover = null;
    if (!phone) {
      const b = closed.trigger;
      await page.mouse.move(b[0] + b[2] / 2, b[1] + b[3] / 2); await sleep(500);
      hover = await page.evaluate(outline, trig, list);
      await page.screenshot({ path: path.join(out, 'hover.png') });
      await page.mouse.move(view.width - 20, view.height / 2); await sleep(500);
    }
    // Open, with the motion recorded from a CDP screencast (frame times on the wall clock).
    const cdp = await page.createCDPSession();
    const frames = [];
    cdp.on('Page.screencastFrame', e => { cdp.send('Page.screencastFrameAck', { sessionId: e.sessionId }).catch(() => {}); frames.push({ ts: e.metadata.timestamp * 1000, data: e.data }); });
    const record = name === 'desktop' || name === 'phone';
    if (record) { await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 }); await sleep(400); }
    // The panel's opacity and offset every animation frame after the press (or key), in ms after it.
    const sample = (sel, ev) => page.evaluate((sel, ev) => {
      const l = [...document.querySelectorAll(sel)].find(e => e.getBoundingClientRect().width > 0) || document.querySelector(sel);
      window.__menuCurve = [];
      window.addEventListener(ev, () => {
        const t0 = performance.now();
        const step = () => { const c = getComputedStyle(l); const t = performance.now() - t0; window.__menuCurve.push([Math.round(t), +(+c.opacity).toFixed(3), c.translate]); if (t < 800) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      }, { once: true, capture: true });
    }, sel, ev);
    await sample(list, phone ? 'touchend' : 'click');
    const t0 = Date.now();
    if (phone) await page.tap(trig); else await page.click(trig);
    await sleep(900);
    await page.mouse.move(view.width - 20, view.height / 2);
    await sleep(200);
    await page.screenshot({ path: path.join(out, 'open.png') });
    const open = await page.evaluate(outline, trig, list);
    const openCurve = await page.evaluate(() => window.__menuCurve);
    // Item hover (desktop): the second item.
    let itemHover = null;
    if (!phone && open.items[1]) {
      const a = open.items[1].li;
      await page.mouse.move(a[0] + a[2] / 2, a[1] + a[3] / 2); await sleep(500);
      itemHover = await page.evaluate(sel => { const l = document.querySelector(sel); return [...l.children].map(li => getComputedStyle(li.querySelector('a') || li).backgroundColor + ' / ' + getComputedStyle(li).backgroundColor); }, list);
      await page.screenshot({ path: path.join(out, 'item-hover.png') });
      await page.mouse.move(view.width - 20, view.height / 2); await sleep(400);
    }
    // Close with Escape, focus on the trigger.
    await page.focus(trig);
    await sample(list, 'keydown');
    const t1 = Date.now();
    await page.keyboard.press('Escape');
    await sleep(900);
    const closeCurve = await page.evaluate(() => window.__menuCurve);
    const afterEsc = await page.evaluate((sel, trig) => ({ expanded: document.querySelector(trig).getAttribute('aria-expanded'), opacity: getComputedStyle(document.querySelector(sel)).opacity, focusOnTrigger: document.activeElement === document.querySelector(trig) }), list, trig);
    if (record) {
      await cdp.send('Page.stopScreencast');
      await sleep(300);
      for (const [sub, origin, span] of [['open', t0, 800], ['close', t1, 800]]) {
        const fd = path.join(out, 'frames', sub);
        fs.mkdirSync(fd, { recursive: true });
        for (const f of frames) {
          const ms = Math.round(f.ts - origin);
          if (ms >= -50 && ms <= span) fs.writeFileSync(path.join(fd, `${ms < 0 ? 'm' + String(-ms).padStart(4, '0') : String(ms).padStart(4, '0')}.png`), Buffer.from(f.data, 'base64'));
        }
      }
    }
    metrics[name] = { closed, hover, open, itemHover, afterEsc, openCurve, closeCurve };
    await page.close();
  }
  fs.writeFileSync(path.join(dir, 'metrics.json'), JSON.stringify(metrics, null, 1));
  console.log(`${key}: ${dir}`);
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 120000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--mute-audio', '--use-mock-keychain', '--password-store=basic'] });
try { for (const key of only ? [only] : ['theirs', 'ours']) await run(browser, key); } finally { await browser.close(); }
process.exit(0);
