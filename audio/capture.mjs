// Headless sound analysis: opens preview.html?analyse=1, waits for the offline renders, and writes
// each sound's waveform and spectrogram PNGs, results.json and an index.html summary.
//
//   node editions/audio/capture.mjs [--no-hour]
//
// Output: .captures/audio/ (gitignored). Needs the local server (bash build/serve.sh).
import puppeteer from '/Users/neil/.cache/board-tools/node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = path.join(ROOT, '.captures', 'audio');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const hour = !process.argv.includes('--no-hour');
const URL = `http://127.0.0.1:8750/editions/audio/preview.html?analyse=1&hour=${hour ? 1 : 0}`;

fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true, protocolTimeout: 600000,
  args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--hide-scrollbars', '--autoplay-policy=no-user-gesture-required'],
});
let result;
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForFunction('window.__audioAnalysis', { timeout: 30000 });
  result = await page.evaluate(() => window.__audioAnalysis);
  if (errors.length) console.error('page errors:\n' + errors.join('\n'));
} finally {
  await browser.close();
}
if (result.error) { console.error(result.error); process.exit(1); }

const png = (file, dataUrl) => fs.writeFileSync(path.join(OUT, file), Buffer.from(dataUrl.split(',')[1], 'base64'));
for (const s of [...result.sounds, result.room]) {
  png(`${s.name}-wave.png`, s.wave);
  png(`${s.name}-spec.png`, s.spec);
  delete s.wave; delete s.spec;
}
result.bursts.forEach((b, i) => { png(`burst-${i + 1}-${b.name}.png`, b.wave); b.image = `burst-${i + 1}-${b.name}.png`; delete b.wave; });
fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(result, null, 2));

const f = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '-inf');
const bad = (ok, t) => (ok ? t : `<b class="bad">${t}</b>`);
const rows = result.sounds.map(s => `<tr><td>${s.name}</td><td>${f(s.duration * 1000, 0)}</td><td>${bad(s.peakDb <= -6, f(s.peakDb))}</td>
  <td>${f(s.rmsDb)}</td><td>${f(s.maxJumpDb)}</td><td>${bad(s.clickRatio < 9, f(s.clickRatio))}</td>
  <td>${bad(s.attackMs >= 3, f(s.attackMs))}</td><td>${f(s.dc * 1e6, 2)}</td><td>${f(s.centroidHz, 0)}</td><td>${f(s.hfShare * 100)}</td></tr>`).join('\n');
const r = result.room, h = result.roomHour;
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Editions sound analysis</title><style>
body{margin:0;padding:24px 16px;background:#f4f4f1;color:#1c1c1c;font:14px/1.45 system-ui,sans-serif}
main{max-width:960px;margin:0 auto}h1{font-size:18px}h2{font-size:15px;margin-top:32px}
table{border-collapse:collapse;width:100%;font-variant-numeric:tabular-nums;font-size:13px}
th,td{padding:6px 8px;border-bottom:1px solid #d9d9d3;text-align:right;white-space:nowrap}th:first-child,td:first-child{text-align:left}
.wrap{overflow-x:auto}.bad{color:#b3261e}img{display:block;width:100%;height:auto;border:1px solid #d9d9d3;margin:6px 0}p{color:#555}
</style></head><body><main>
<h1>Editions sound analysis</h1>
<p>Rendered offline at ${result.sampleRate} Hz through the live engine's bus (compressor and -6 dBFS ceiling).
Targets: one-shot peak at or below -6 dBFS; room RMS about -42 dBFS; attack at least 3 ms; click ratio under 9.
Analysis took ${f(result.elapsedMs / 1000)} s.</p>
<div class="wrap"><table><tr><th>Sound</th><th>Duration ms</th><th>Peak dBFS (worst of 10)</th><th>RMS dBFS</th><th>Max jump dBFS</th>
<th>Click ratio</th><th>Attack ms</th><th>DC ×1e-6</th><th>Centroid Hz</th><th>&gt;6 kHz %</th></tr>
${rows}
<tr><td>room (5–45 s)</td><td>-</td><td>${f(r.peakDb)}</td><td>${bad(Math.abs(r.rmsDb + 42) <= 2, f(r.rmsDb))}</td><td>${f(r.maxJumpDb)}</td>
<td>${bad(r.clickRatio < 9, f(r.clickRatio))}</td><td>-</td><td>${f(r.dc * 1e6, 2)}</td><td>${f(r.centroidHz, 0)}</td><td>${f(r.hfShare * 100)}</td></tr>
</table></div>
<p>Bus gain on a quiet sine: ${f(result.chainGainDb, 2)} dB. Room per-second RMS: ${f(r.perSecondRms.min)} to ${f(r.perSecondRms.max)} dBFS.
${h ? `One hour of room tone (8 kHz mono render): per-minute RMS ${f(Math.min(...h.perMinuteRms), 2)} to ${f(Math.max(...h.perMinuteRms), 2)} dBFS
(drift ${f(h.driftDb, 2)} dB), worst crest factor ${f(h.crestDb)} dB, worst click ratio ${f(h.clickRatio)} at ${f(h.clickAt, 1)} s.
The 8 kHz render checks drift and clicks; its absolute level is not comparable to 48 kHz.` : 'Hour run skipped.'}</p>
<h2>Bursts (rate limit and voice stealing)</h2>
<div class="wrap"><table><tr><th>Burst</th><th>Peak dBFS</th><th>RMS dBFS</th><th>Click ratio</th></tr>
${result.bursts.map(b => `<tr><td>${b.label}</td><td>${bad(b.peakDb <= -6, f(b.peakDb))}</td><td>${f(b.rmsDb)}</td><td>${bad(b.clickRatio < 9, f(b.clickRatio))}</td></tr>`).join('\n')}
</table></div>
${[...result.sounds, r].map(s => `<h2>${s.name}</h2><img src="${s.name}-wave.png" alt="${s.name} waveform"><img src="${s.name}-spec.png" alt="${s.name} spectrogram">`).join('\n')}
<h2>Bursts</h2>
${result.bursts.map(b => `<p>${b.label}</p><img src="${b.image}" alt="${b.label}">`).join('\n')}
</main></body></html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), html);

for (const s of result.sounds) console.log(`${s.name.padEnd(8)} dur ${f(s.duration * 1000, 0).padStart(5)} ms  peak ${f(s.peakDb).padStart(6)}  rms ${f(s.rmsDb).padStart(6)}  jump ${f(s.maxJumpDb).padStart(6)}  click ${f(s.clickRatio).padStart(5)}  atk ${f(s.attackMs)}  edge ${f(s.edgeStartDb)}  cen ${f(s.centroidHz, 0)}  hf ${f(s.hfShare * 100)}%`);
console.log(`room     peak ${f(r.peakDb)}  rms ${f(r.rmsDb)}  per-sec ${f(r.perSecondRms.min)}..${f(r.perSecondRms.max)}  click ${f(r.clickRatio)} at ${f(r.clickAt, 2)}s  cen ${f(r.centroidHz, 0)}`);
if (h) console.log(`hour     drift ${f(h.driftDb, 2)} dB  crest ${f(h.crestDb)} dB  click ${f(h.clickRatio)} at ${f(h.clickAt, 1)}s  dc ${h.dc}`);
for (const b of result.bursts) console.log(`burst    ${b.label.padEnd(26)} peak ${f(b.peakDb)}  rms ${f(b.rmsDb)}  click ${f(b.clickRatio)}`);
console.log(`chain gain ${f(result.chainGainDb, 2)} dB · ${f(result.elapsedMs / 1000)} s · ${OUT}/index.html`);
