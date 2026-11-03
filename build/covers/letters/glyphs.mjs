// node glyphs.mjs <nunito-900.woff2>  ->  nunito-{C,h,a,i,r,t,a2,x}.png  (headless Chrome, glyphs.html beside this file)
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
const font = readFileSync(process.argv[2]).toString('base64');
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true,
  args: ['--use-mock-keychain', '--password-store=basic'] });
const page = await browser.newPage();
await page.goto(pathToFileURL(fileURLToPath(new URL('glyphs.html', import.meta.url))).href);
const pngs = await page.evaluate(b => window.render(b), font);
['C', 'h', 'a', 'i', 'r', 't', 'a2', 'x'].forEach((n, i) => writeFileSync(`nunito-${n}.png`, Buffer.from(pngs[i].split(',')[1], 'base64')));
await browser.close();
