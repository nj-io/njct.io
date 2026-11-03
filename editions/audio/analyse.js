// Offline analysis: renders each sound through the same synthesis and bus as the live engine
// (synth.js) in an OfflineAudioContext, then measures it and draws a waveform and spectrogram.
import { createBus, createVoices, playVoice, startRoom, mulberry32, SOUNDS, NAMES } from './synth.js';

const SR = 48000;
const TAIL = 0.9;             // reverb tail rendered after each one-shot
const db = x => (x > 0 ? 20 * Math.log10(x) : -Infinity);
const fmt = (x, d = 1) => (Number.isFinite(x) ? x.toFixed(d) : '-inf');

async function render(seconds, build, { sampleRate = SR, channels = 2 } = {}) {
  const ctx = new OfflineAudioContext(channels, Math.ceil(seconds * sampleRate), sampleRate);
  const bus = createBus(ctx, ctx.destination, { masterGain: 1 });
  build(bus);
  return ctx.startRendering();
}

export function renderSound(name, { seed = 1, pan = 0, intensity = 1, rate = 1 } = {}) {
  const dur = SOUNDS[name].dur / rate + TAIL + 0.02;
  return render(dur, bus => playVoice(bus, name, 0.01, { pan, intensity, rate }, mulberry32(seed)));
}

// A run of rapid requests through the live voice manager (rate limit and stealing).
export function renderBurst(name, count, gap, seed = 5) {
  const dur = 0.01 + count * gap + SOUNDS[name].dur + TAIL;
  return render(dur, bus => {
    const v = createVoices(bus), r = mulberry32(seed);
    for (let i = 0; i < count; i++) v.play(name, 0.01 + i * gap, { pan: -1 + (2 * i) / (count - 1) }, r);
  });
}

export function renderRoom(seconds, sampleRate = SR, channels = 2) {
  return render(seconds, bus => startRoom(bus, 0, 2.5), { sampleRate, channels });
}

// Gain of the whole bus on a quiet sine: must be 0 dB, so measured levels are the levels heard.
export async function chainGain() {
  const buf = await render(1, bus => {
    const o = bus.ctx.createOscillator(); o.frequency.value = 440;
    const g = bus.ctx.createGain(); g.gain.value = 0.01;
    o.connect(g); g.connect(bus.input); o.start(0);
  }, { channels: 1 });
  const d = buf.getChannelData(0);
  let p = 0;
  for (let i = d.length >> 1; i < d.length; i++) p = Math.max(p, Math.abs(d[i]));
  return db(p / 0.01);
}

// ---------------------------------------------------------------------------------------------
// Measurements

export function measure(buf, { from = 0, to = buf.duration } = {}) {
  const sr = buf.sampleRate, chs = [];
  for (let c = 0; c < buf.numberOfChannels; c++) chs.push(buf.getChannelData(c));
  const n = chs[0].length, i0 = Math.floor(from * sr), i1 = Math.min(n, Math.ceil(to * sr));
  let peak = 0, peakAt = 0;
  const dc = chs.map(() => 0);
  for (let c = 0; c < chs.length; c++) for (let i = i0; i < i1; i++) {
    const a = Math.abs(chs[c][i]);
    if (a > peak) { peak = a; peakAt = i; }
    dc[c] += chs[c][i];
  }
  // Active region: from first to last sample above -70 dBFS; RMS is taken over it.
  const thr = Math.pow(10, -70 / 20);
  let first = -1, last = -1;
  for (let i = i0; i < i1; i++) if (chs.some(ch => Math.abs(ch[i]) > thr)) { if (first < 0) first = i; last = i; }
  if (first < 0) { first = i0; last = i1 - 1; }
  let ss = 0;
  for (const ch of chs) for (let i = first; i <= last; i++) ss += ch[i] * ch[i];
  const rms = Math.sqrt(ss / (chs.length * (last - first + 1)));
  // Click check: the largest sample-to-sample jump, and that jump against the RMS of jumps within
  // +-5 ms of it. Noise peaks at about 5x its neighbourhood; an isolated click stands far above.
  const W = Math.round(0.005 * sr), quiet = Math.pow(10, -80 / 20);
  let maxJump = 0, jumpAt = 0, worstRatio = 0, ratioAt = 0;
  for (const ch of chs) {
    const d = new Float32Array(i1 - i0);
    for (let i = i0 + 1; i < i1; i++) d[i - i0] = Math.abs(ch[i] - ch[i - 1]);
    const pre = new Float64Array(d.length + 1);
    for (let i = 0; i < d.length; i++) pre[i + 1] = pre[i] + d[i] * d[i];
    for (let i = 1; i < d.length; i++) {
      if (d[i] > maxJump) { maxJump = d[i]; jumpAt = i + i0; }
      if (d[i] < quiet) continue;
      const a = Math.max(0, i - W), b = Math.min(d.length, i + W + 1);
      const r = d[i] / Math.sqrt((pre[b] - pre[a]) / (b - a));
      if (r > worstRatio) { worstRatio = r; ratioAt = i + i0; }
    }
  }
  // Attack: time from onset (-60 dB below the peak) to the 1 ms RMS envelope first reaching 90%
  // of its maximum within the first 30 ms. Envelopes are linear ramps; the noise inside them makes
  // this a little early, never late.
  const onThr = peak * 0.001;
  let onset = first;
  while (onset < last && !chs.some(ch => Math.abs(ch[onset]) > onThr)) onset++;
  const E = Math.max(1, Math.round(0.001 * sr)), step = Math.max(1, Math.round(0.00025 * sr));
  const e1 = Math.min(n - E, onset + Math.round(0.03 * sr));
  const envAt = i => { let q = 0; for (const ch of chs) for (let j = i; j < i + E; j++) q += ch[j] * ch[j]; return Math.sqrt(q / (E * chs.length)); };
  let envMax = 0;
  for (let i = onset; i < e1; i += step) envMax = Math.max(envMax, envAt(i));
  let attack = 0;
  for (let i = onset; i < e1; i += step) if (envAt(i) >= envMax * 0.9) { attack = (i + E / 2 - onset) / sr; break; }
  return {
    duration: (last - first + 1) / sr,
    peakDb: db(peak), peakAt: peakAt / sr,
    rmsDb: db(rms),
    dc: dc.map(x => x / (i1 - i0)),
    maxJumpDb: db(maxJump), jumpAt: jumpAt / sr,
    clickRatio: worstRatio, clickAt: ratioAt / sr,
    attackMs: attack * 1000,
    edgeStartDb: db(Math.max(...chs.map(ch => Math.abs(ch[first])))),
  };
}

// Mono mix spectrum stats: centroid and the share of energy above 6 kHz.
function spectrumStats(frames, binHz) {
  let e = 0, ce = 0, hi = 0;
  for (const f of frames) for (let k = 1; k < f.length; k++) {
    const p = f[k];
    e += p; ce += p * k * binHz;
    if (k * binHz > 6000) hi += p;
  }
  return { centroidHz: ce / e, hfShare: hi / e };
}

// ---------------------------------------------------------------------------------------------
// STFT and drawing

function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const a = i + j, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

function mono(buf) {
  const out = new Float32Array(buf.length);
  for (let c = 0; c < buf.numberOfChannels; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < d.length; i++) out[i] += d[i] / buf.numberOfChannels;
  }
  return out;
}

function stft(x, N, hop) {
  const win = new Float32Array(N);
  for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1));
  const frames = [];
  const re = new Float32Array(N), im = new Float32Array(N);
  for (let s = -N / 2; s + N / 2 < x.length; s += hop) {
    for (let i = 0; i < N; i++) { const j = s + i; re[i] = j >= 0 && j < x.length ? x[j] * win[i] : 0; im[i] = 0; }
    fft(re, im);
    const p = new Float32Array(N / 2);
    for (let k = 0; k < N / 2; k++) p[k] = (re[k] * re[k] + im[k] * im[k]) / ((N / 4) * (N / 4));
    frames.push(p);
  }
  return frames;
}

// Inferno-like colour ramp.
const STOPS = [[0, 0, 4], [40, 11, 84], [101, 21, 110], [159, 42, 99], [212, 72, 66], [245, 125, 21], [250, 193, 39], [252, 255, 164]];
function colour(v) {
  const x = Math.min(0.9999, Math.max(0, v)) * (STOPS.length - 1), i = Math.floor(x), f = x - i;
  return STOPS[i].map((c, k) => Math.round(c + (STOPS[i + 1][k] - c) * f));
}

const INK = '#222', MUTED = '#777', PAPER = '#fafaf7', WELL = '#ececE6';

function axisTime(g, x0, w, y, seconds) {
  g.fillStyle = MUTED; g.font = '11px system-ui, sans-serif'; g.textAlign = 'center';
  const step = seconds > 4 ? 1 : seconds > 2 ? 0.5 : seconds > 0.6 ? 0.1 : seconds > 0.2 ? 0.05 : 0.01;
  for (let t = 0; t <= seconds + 1e-9; t += step) {
    const x = x0 + (t / seconds) * w;
    g.fillRect(x, y, 1, 4);
    g.fillText(seconds > 0.6 ? `${t.toFixed(1)} s` : `${Math.round(t * 1000)} ms`, x, y + 15);
  }
}

export function drawSpectrogram(buf, { width = 900, height = 300, title = '' } = {}) {
  const x = mono(buf), sr = buf.sampleRate;
  const N = buf.duration < 0.8 ? 1024 : 2048;
  const L = 56, R = 12, T = 22, B = 26, w = width - L - R, h = height - T - B;
  const hop = Math.max(16, Math.floor(x.length / w));
  const frames = stft(x, N, hop);
  const c = document.createElement('canvas'); c.width = width; c.height = height;
  const g = c.getContext('2d');
  g.fillStyle = PAPER; g.fillRect(0, 0, width, height);
  const img = g.createImageData(w, h);
  const fLo = 30, fHi = Math.min(20000, sr / 2), lr = Math.log(fHi / fLo), binHz = sr / N;
  const DBLO = -120, DBHI = -20;
  for (let px = 0; px < w; px++) {
    const fr = frames[Math.min(frames.length - 1, Math.floor((px / w) * frames.length))];
    for (let py = 0; py < h; py++) {
      const fA = fLo * Math.exp(lr * (1 - (py + 1) / h)), fB = fLo * Math.exp(lr * (1 - py / h));
      const kA = Math.max(1, Math.floor(fA / binHz)), kB = Math.max(kA, Math.min(fr.length - 1, Math.ceil(fB / binHz)));
      let p = 0;
      for (let k = kA; k <= kB; k++) p = Math.max(p, fr[k]);
      const [r, gg, b] = colour((10 * Math.log10(p + 1e-20) - DBLO) / (DBHI - DBLO));
      const o = (py * w + px) * 4;
      img.data[o] = r; img.data[o + 1] = gg; img.data[o + 2] = b; img.data[o + 3] = 255;
    }
  }
  g.putImageData(img, L, T);
  g.fillStyle = MUTED; g.font = '11px system-ui, sans-serif'; g.textAlign = 'right';
  for (const f of [50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000]) {
    if (f > fHi) continue;
    const y = T + h * (1 - Math.log(f / fLo) / lr);
    g.fillRect(L - 4, y, 4, 1);
    g.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, L - 7, y + 4);
  }
  axisTime(g, L, w, T + h, buf.duration);
  g.fillStyle = INK; g.textAlign = 'left'; g.font = '600 12px system-ui, sans-serif';
  g.fillText(`${title} spectrogram  (${DBLO} to ${DBHI} dB, log frequency)`, L, 15);
  return { png: c.toDataURL('image/png'), ...spectrumStats(frames, binHz) };
}

export function drawWaveform(buf, { width = 900, height = 300, title = '' } = {}) {
  const n = buf.length, chs = [];
  for (let k = 0; k < buf.numberOfChannels; k++) chs.push(buf.getChannelData(k));
  const L = 56, R = 12, T = 22, B = 26, w = width - L - R;
  const hWave = Math.round((height - T - B) * 0.55), gap = 10, hDb = height - T - B - hWave - gap;
  const c = document.createElement('canvas'); c.width = width; c.height = height;
  const g = c.getContext('2d');
  g.fillStyle = PAPER; g.fillRect(0, 0, width, height);
  let peak = 0;
  for (const ch of chs) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(ch[i]));
  const scale = Math.max(peak * 1.15, 1e-6), mid = T + hWave / 2, ceil6 = Math.pow(10, -6 / 20);
  g.fillStyle = WELL; g.fillRect(L, T, w, hWave);
  g.fillStyle = MUTED; g.font = '11px system-ui, sans-serif'; g.textAlign = 'right';
  g.fillText(`±${scale.toFixed(3)}`, L - 6, T + 10);
  if (ceil6 < scale) {
    g.fillStyle = '#c33';
    for (const s of [-1, 1]) g.fillRect(L, mid - s * (ceil6 / scale) * (hWave / 2), w, 1);
  }
  const cols = ['rgba(40,60,120,0.75)', 'rgba(170,70,40,0.6)'];
  const env = new Float32Array(w);
  chs.forEach((ch, ci) => {
    g.fillStyle = cols[ci % 2];
    for (let px = 0; px < w; px++) {
      const a = Math.floor((px / w) * n), b = Math.max(a + 1, Math.floor(((px + 1) / w) * n));
      let lo = 0, hi = 0;
      for (let i = a; i < b; i++) { const v = ch[i]; if (v < lo) lo = v; if (v > hi) hi = v; }
      const y0 = mid - (hi / scale) * (hWave / 2), y1 = mid - (lo / scale) * (hWave / 2);
      g.fillRect(L + px, y0, 1, Math.max(1, y1 - y0));
      env[px] = Math.max(env[px], hi, -lo);
    }
  });
  // dB envelope strip: column peak in dBFS from -90 to 0, with the -6 dBFS ceiling marked.
  const dbTop = T + hWave + gap, DBLO = -90;
  g.fillStyle = WELL; g.fillRect(L, dbTop, w, hDb);
  g.fillStyle = cols[0];
  for (let px = 0; px < w; px++) {
    const y = dbTop + hDb * (Math.max(DBLO, db(env[px])) / DBLO);
    g.fillRect(L + px, y, 1, dbTop + hDb - y);
  }
  g.fillStyle = '#c33'; g.fillRect(L, dbTop + hDb * (-6 / DBLO), w, 1);
  g.fillStyle = MUTED; g.textAlign = 'right';
  for (const d of [0, -6, -30, -60, -90]) g.fillText(`${d}`, L - 6, dbTop + hDb * (d / DBLO) + 4);
  axisTime(g, L, w, dbTop + hDb, buf.duration);
  g.fillStyle = INK; g.textAlign = 'left'; g.font = '600 12px system-ui, sans-serif';
  g.fillText(`${title} waveform (L blue, R red; red line = -6 dBFS)  ·  peak ${fmt(db(peak))} dBFS`, L, 15);
  return c.toDataURL('image/png');
}

// ---------------------------------------------------------------------------------------------
// Full analysis run

// The first `seconds` of a buffer, for drawing: short sounds would otherwise be a sliver of the tail.
function crop(buf, seconds) {
  const length = Math.min(buf.length, Math.ceil(seconds * buf.sampleRate));
  const out = new AudioBuffer({ length, sampleRate: buf.sampleRate, numberOfChannels: buf.numberOfChannels });
  for (let c = 0; c < buf.numberOfChannels; c++) out.copyToChannel(buf.getChannelData(c).subarray(0, length), c);
  return out;
}

const VARIANTS = [
  { seed: 1, pan: 0 }, { seed: 2, pan: -1 }, { seed: 3, pan: 1 }, { seed: 4, pan: -0.5 },
  { seed: 5, pan: 0.5 }, { seed: 6, pan: 0 }, { seed: 7, pan: 0.9 }, { seed: 8, pan: -0.9 },
  { seed: 9, pan: 0, rate: 0.5 }, { seed: 10, pan: 0, rate: 2 },
];

export async function analyseAll({ hour = true, onProgress = () => {} } = {}) {
  const out = { sampleRate: SR, sounds: [], bursts: [], room: null, roomHour: null };
  out.chainGainDb = await chainGain();
  for (const name of NAMES) {
    onProgress(name);
    const runs = [];
    for (const v of VARIANTS) runs.push({ v, m: measure(await renderSound(name, v)) });
    const full = await renderSound(name, VARIANTS[0]);
    const m = measure(full);
    const primary = crop(full, SOUNDS[name].dur + 0.35);
    const spec = drawSpectrogram(primary, { title: name });
    out.sounds.push({
      name,
      duration: m.duration,
      peakDb: Math.max(...runs.map(r => r.m.peakDb)),
      primaryPeakDb: m.peakDb,
      rmsDb: m.rmsDb,
      dc: Math.max(...runs.flatMap(r => r.m.dc.map(Math.abs))),
      maxJumpDb: Math.max(...runs.map(r => r.m.maxJumpDb)),
      clickRatio: Math.max(...runs.map(r => r.m.clickRatio)),
      clickAt: m.clickAt,
      attackMs: Math.min(...runs.map(r => r.m.attackMs)),
      edgeStartDb: Math.max(...runs.map(r => r.m.edgeStartDb)),
      centroidHz: spec.centroidHz, hfShare: spec.hfShare,
      variants: runs.map(r => ({ ...r.v, peakDb: r.m.peakDb, clickRatio: r.m.clickRatio })),
      wave: drawWaveform(primary, { title: name }),
      spec: spec.png,
    });
  }
  // Hover along a whole shelf, and tick hammering: rate limit and voice stealing must hold the level.
  for (const [name, count, gap] of [['hover', 30, 0.025], ['hover', 12, 0.08], ['tick', 20, 0.03], ['lift', 10, 0.05]]) {
    onProgress(`${name} burst`);
    const b = await renderBurst(name, count, gap);
    const m = measure(b);
    out.bursts.push({
      label: `${name} x${count} every ${Math.round(gap * 1000)} ms`, name, count, gap,
      peakDb: m.peakDb, rmsDb: m.rmsDb, clickRatio: m.clickRatio, maxJumpDb: m.maxJumpDb,
      wave: drawWaveform(b, { title: `${name} burst` }),
    });
  }
  // Room tone: 45 s at full rate (crosses both loop points several times), measured after the fade.
  onProgress('room');
  const room = await renderRoom(45);
  const rm = measure(room, { from: 5, to: 45 });
  const perSec = [];
  for (let s = 5; s < 45; s++) perSec.push(measure(room, { from: s, to: s + 1 }).rmsDb);
  const head = crop(room, 8);
  const spec = drawSpectrogram(head, { title: 'room (first 8 s, 2.5 s fade-in)' });
  out.room = {
    name: 'room', duration: 45, peakDb: rm.peakDb, rmsDb: rm.rmsDb, dc: Math.max(...rm.dc.map(Math.abs)),
    maxJumpDb: rm.maxJumpDb, clickRatio: rm.clickRatio, clickAt: rm.clickAt,
    perSecondRms: { min: Math.min(...perSec), max: Math.max(...perSec) },
    centroidHz: spec.centroidHz, hfShare: spec.hfShare,
    wave: drawWaveform(head, { title: 'room (first 8 s)' }), spec: spec.png,
  };
  // One hour of room tone at 8 kHz mono: per-minute RMS must not drift, and nothing may click.
  // Absolute level differs from the 48 kHz render (white noise is denser per Hz at 8 kHz), so this
  // run reports drift, crest factor and clicks, not level.
  if (hour) {
    onProgress('room hour');
    const hb = await renderRoom(3600, 8000, 1);
    const mins = [];
    for (let m = 0; m < 60; m++) mins.push(measure(hb, { from: Math.max(5, m * 60), to: (m + 1) * 60 }));
    const perMin = mins.map(m => m.rmsDb);
    const worst = mins.reduce((a, b) => (b.clickRatio > a.clickRatio ? b : a));
    out.roomHour = {
      sampleRate: 8000, perMinuteRms: perMin, driftDb: Math.max(...perMin) - Math.min(...perMin),
      crestDb: Math.max(...mins.map(m => m.peakDb - m.rmsDb)), clickRatio: worst.clickRatio, clickAt: worst.clickAt,
      maxJumpDb: Math.max(...mins.map(m => m.maxJumpDb)), dc: Math.max(...mins.map(m => Math.abs(m.dc[0]))),
    };
  }
  return out;
}
