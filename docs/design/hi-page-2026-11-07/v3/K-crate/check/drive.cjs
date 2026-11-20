// Frame-steps the load motion and drives the crate (tap a strip, swipe, tap the pill) in chrome-headless-shell.
const puppeteer = require('/Users/neil/dev/xactions/node_modules/puppeteer-core');
const D = __dirname + '/..', OUT = __dirname;
const exe = process.env.HOME + '/.cache/puppeteer/chrome-headless-shell/mac_arm-154.0.8037.57/chrome-headless-shell-mac-arm64/chrome-headless-shell';
(async () => {
  const b = await puppeteer.launch({ executablePath: exe, headless: 'shell' });
  const pg = await b.newPage();
  await pg.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  for (const t of [0, 200, 350, 500, 650, 800, 1000, 1300]) {
    await pg.goto(`file://${D}/index.html?lang=en&t=${t}`); await pg.evaluate(() => document.fonts.ready);
    await pg.screenshot({ path: `${OUT}/f${String(t).padStart(4, '0')}.png` });
  }
  await pg.goto(`file://${D}/index.html?lang=en`); await pg.evaluate(() => document.fonts.ready);
  await new Promise(r => setTimeout(r, 1600));
  const state = () => pg.evaluate(() => ({ front: document.querySelector('.sleeve.front').dataset.ch, scrollW: document.documentElement.scrollWidth, hash: location.hash }));
  console.log('rest', await state());
  // Tap the third strip (LINE): its pick button's box centre.
  const box = await pg.evaluate(() => { const r = document.querySelector('.sleeve[data-ch="line"] .ch-name').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
  await pg.touchscreen.tap(box.x, box.y); await new Promise(r => setTimeout(r, 1200));
  console.log('after tap LINE strip', await state()); await pg.screenshot({ path: `${OUT}/tap-line.png` });
  // Swipe up 160 px: back one sleeve.
  await pg.touchscreen.touchStart(195, 600); for (let k = 1; k <= 8; k++) { await pg.touchscreen.touchMove(195, 600 - k * 20); await new Promise(r => setTimeout(r, 16)); }
  await pg.touchscreen.touchEnd(); await new Promise(r => setTimeout(r, 1200));
  console.log('after swipe up', await state()); await pg.screenshot({ path: `${OUT}/swipe-up.png` });
  // Swipe down 330 px slowly: forward two.
  await pg.touchscreen.touchStart(195, 400); for (let k = 1; k <= 22; k++) { await pg.touchscreen.touchMove(195, 400 + k * 15); await new Promise(r => setTimeout(r, 30)); }
  await new Promise(r => setTimeout(r, 120)); await pg.touchscreen.touchEnd(); await new Promise(r => setTimeout(r, 1200));
  console.log('after swipe down', await state()); await pg.screenshot({ path: `${OUT}/swipe-down.png` });
  // Mid-drag frame.
  await pg.touchscreen.touchStart(195, 400); for (let k = 1; k <= 6; k++) { await pg.touchscreen.touchMove(195, 400 - k * 12); await new Promise(r => setTimeout(r, 30)); }
  await pg.screenshot({ path: `${OUT}/mid-drag.png` }); await pg.touchscreen.touchEnd(); await new Promise(r => setTimeout(r, 1200));
  // Tap the front pill.
  await pg.evaluate(() => document.querySelectorAll('.open').forEach(a => a.addEventListener('click', e => { e.preventDefault(); location.hash = 'opened-' + a.closest('.sleeve').dataset.ch; })));
  const pb = await pg.evaluate(() => { const r = document.querySelector('.sleeve.front .open').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, h: r.height, w: r.width }; });
  await pg.touchscreen.tap(pb.x, pb.y); await new Promise(r => setTimeout(r, 300));
  console.log('pill box', pb, 'after pill tap', await state());
  await b.close();
})();
