// Procedural sound for Editions. Every sound is synthesised here from noise buffers, oscillators,
// filters and envelopes. The same code drives the live AudioContext (audio.js) and the offline
// analysis render (analyse.js), so what the analysis measures is what the visitor hears.
//
// Signal path per context (createBus):
//   voice -> panner -> dry ─┐
//                 └-> send -> convolver (small dark room) -> wet ─┤
//   room tone ─────────────────────────────────────────────────────┤
//                                                                  v
//   input -> highpass 18 Hz (DC) -> master (enable fade) -> limiter -> out
//
// The limiter is a soft-knee waveshaper: exactly linear below -9 dBFS, never above -6 dBFS. Every
// one-shot is levelled to peak below -9 dBFS, so it only acts when voices stack. A
// DynamicsCompressorNode is not used: Chrome's starts about 12 dB down for the first ~0.4 s after
// the context starts (even at ratio 1), which would swallow the first sound after the unlocking
// gesture, and its automatic makeup gain (+5.4 dB measured) makes levels depend on its settings.

const TAU = Math.PI * 2;
export const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const dbToGain = db => Math.pow(10, db / 20);

// Seeded PRNG so buffers, and the analysis renders, are reproducible.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------------------------
// Shared buffers: generated once per context and reused by every voice.

const banks = new WeakMap();

function bank(ctx) {
  let b = banks.get(ctx);
  if (!b) {
    b = { noise: whiteNoise(ctx, 4, 11), crackle: crackle(ctx, 3, 23), ir: roomIR(ctx, 1.1, 37), room: null };
    banks.set(ctx, b);
  }
  return b;
}

function whiteNoise(ctx, seconds, seed) {
  const buf = ctx.createBuffer(1, Math.round(seconds * ctx.sampleRate), ctx.sampleRate);
  const d = buf.getChannelData(0);
  const r = mulberry32(seed);
  for (let i = 0; i < d.length; i++) d[i] = r() * 2 - 1;
  return buf;
}

// White noise whose last 80 ms crossfade (equal power) into its first, so it loops without a seam.
// Layers of different, incommensurate lengths keep the room tone from ever audibly repeating.
function loopNoise(ctx, seconds, seed) {
  const sr = ctx.sampleRate;
  const L = Math.round(seconds * sr), X = Math.round(0.08 * sr);
  const r = mulberry32(seed);
  const raw = new Float32Array(L + X);
  for (let i = 0; i < raw.length; i++) raw[i] = r() * 2 - 1;
  for (let i = 0; i < X; i++) {
    const th = (i / X) * (Math.PI / 2);
    raw[i] = raw[i] * Math.sin(th) + raw[L + i] * Math.cos(th);
  }
  const buf = ctx.createBuffer(1, L, sr);
  buf.getChannelData(0).set(raw.subarray(0, L));
  return buf;
}

// Sparse vinyl crackle: short Hann-windowed pops, mostly faint with a few louder ones.
function crackle(ctx, seconds, seed) {
  const sr = ctx.sampleRate;
  const buf = ctx.createBuffer(1, Math.round(seconds * sr), sr);
  const d = buf.getChannelData(0);
  const r = mulberry32(seed);
  let t = 0;
  while (true) {
    t += -Math.log(1 - r()) / 26;                 // Poisson, 26 pops a second
    const at = Math.round(t * sr);
    const len = Math.max(8, Math.round((0.0009 + r() * 0.0016) * sr));
    if (at + len >= d.length) break;
    const amp = (0.12 + 0.88 * Math.pow(r(), 5)) * (r() < 0.5 ? -1 : 1);
    for (let i = 0; i < len; i++) {
      const w = 0.5 - 0.5 * Math.cos((TAU * i) / (len - 1));
      d[at + i] += amp * w * (0.55 + 0.45 * (r() * 2 - 1));
    }
  }
  let peak = 0;
  for (let i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
  for (let i = 0; i < d.length; i++) d[i] /= peak;
  return buf;
}

// A small, dark room: decaying stereo noise that darkens as it decays, after a short pre-delay.
function roomIR(ctx, seconds, seed) {
  const sr = ctx.sampleRate;
  const n = Math.round(seconds * sr), pre = Math.round(0.007 * sr), fadeIn = Math.round(0.002 * sr);
  const buf = ctx.createBuffer(2, n, sr);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    const r = mulberry32(seed + ch * 101);
    let lp = 0;
    for (let i = pre; i < n; i++) {
      const t = (i - pre) / sr;
      const k = 0.35 + 0.6 * Math.min(1, t / 0.5);   // one-pole lowpass coefficient: darker over time
      lp = lp * k + (r() * 2 - 1) * (1 - k);
      const fade = Math.min(1, (i - pre) / fadeIn) * Math.min(1, (n - i) / (0.05 * sr));
      d[i] = lp * Math.exp(-t / 0.17) * fade;
    }
  }
  return buf;
}

// ---------------------------------------------------------------------------------------------
// Bus

const WET = 0.32;                    // reverb return
const CEIL = dbToGain(-6), KNEE = dbToGain(-9);

function ceilingCurve() {
  const n = 8193, c = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1, a = Math.abs(x);
    const y = a <= KNEE ? a : KNEE + (CEIL - KNEE) * Math.tanh((a - KNEE) / (CEIL - KNEE));
    c[i] = Math.sign(x) * y;
  }
  return c;
}

export function createBus(ctx, destination, { masterGain = 0 } = {}) {
  const input = ctx.createGain();
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass'; hp.frequency.value = 18; hp.Q.value = 0.707;
  const master = ctx.createGain(); master.gain.value = masterGain;
  const limiter = ctx.createWaveShaper(); limiter.curve = ceilingCurve(); limiter.oversample = 'none';
  input.connect(hp); hp.connect(master); master.connect(limiter); limiter.connect(destination);

  const reverb = ctx.createGain();
  const conv = ctx.createConvolver(); conv.buffer = bank(ctx).ir;
  const wet = ctx.createGain(); wet.gain.value = WET;
  reverb.connect(conv); conv.connect(wet); wet.connect(input);

  return {
    ctx, input, reverb, master,
    disconnect() { for (const n of [input, hp, master, limiter, reverb, conv, wet]) n.disconnect(); },
  };
}

// ---------------------------------------------------------------------------------------------
// Envelope shapes, sampled into curves for setValueCurveAtTime. Each starts and ends at exactly 0.

const MIN_EDGE = 0.004;      // seconds of real time: no attack or release is shorter than this

// Percussive: linear attack, exponential decay, raised-cosine taper to 0 at the end.
function perc(a, tau, D, rate) {
  const at = Math.max(a, MIN_EDGE * rate), rel = Math.max(MIN_EDGE * rate, D * 0.2);
  return t => {
    if (t >= D) return 0;
    const up = t < at ? t / at : Math.exp(-(t - at) / tau);
    const down = t > D - rel ? 0.5 + 0.5 * Math.cos((Math.PI * (t - (D - rel))) / rel) : 1;
    return up * down;
  };
}

// Swell: smooth rise over `rise`, smooth fall to the end. `p` > 1 sharpens the fall.
function swell(rise, D, p = 1) {
  return t => {
    if (t <= 0 || t >= D) return 0;
    if (t < rise) return Math.pow(Math.sin((Math.PI / 2) * (t / rise)), 2);
    return Math.pow(Math.cos((Math.PI / 2) * ((t - rise) / (D - rise))), 2 * p);
  };
}

function curve(fn, D, peak) {
  const n = clamp(Math.ceil(D * 2000), 64, 4096);   // at least one point per 0.5 ms
  const c = new Float32Array(n);
  for (let i = 0; i < n; i++) c[i] = fn((i / (n - 1)) * D) * peak;
  c[0] = 0; c[n - 1] = 0;
  return c;
}

// ---------------------------------------------------------------------------------------------
// Voice builder: the small kit each sound definition composes. Times are in base seconds and
// frequencies in base Hz; `rate` scales both (rate 2 = twice as fast and an octave up).

function kit(ctx, out, when, rate, rng) {
  const b = bank(ctx);
  const sources = [];
  const T = x => when + x / rate;
  const F = x => x * rate;
  const k = {
    rng, rate, T, F, sources,
    rand: (lo, hi) => lo + (hi - lo) * rng(),
    noise(start, dur, buffer = b.noise) {
      const s = ctx.createBufferSource();
      s.buffer = buffer; s.loop = true; s.playbackRate.value = rate;
      const off = rng() * (buffer.duration - 0.01);
      s.start(T(start), off);
      s.stop(T(start + dur) + 0.01);
      sources.push(s);
      return s;
    },
    osc(type, freq, start, dur) {
      const o = ctx.createOscillator();
      o.type = type; o.frequency.value = F(freq);
      o.start(T(start)); o.stop(T(start + dur) + 0.01);
      sources.push(o);
      return o;
    },
    // `fixed` filters keep their frequency when rate changes (tone controls, not pitch).
    filter(type, freq, Q = 0.707, fixed = false) {
      const f = ctx.createBiquadFilter();
      f.type = type; f.frequency.value = fixed ? freq : F(freq); f.Q.value = Q;
      return f;
    },
    gain(v = 1) { const g = ctx.createGain(); g.gain.value = v; return g; },
    // Envelope gain: shape fn over base duration D starting at base time `start`, scaled to `peak`.
    env(fn, start, D, peak) {
      const g = ctx.createGain(); g.gain.value = 0;
      g.gain.setValueCurveAtTime(curve(fn, D, peak), T(start), D / rate);
      return g;
    },
    // Exponential frequency path through [baseTime, baseHz] points.
    sweep(param, points) {
      param.setValueAtTime(F(points[0][1]), T(points[0][0]));
      for (const [t, f] of points.slice(1)) param.exponentialRampToValueAtTime(F(f), T(t));
    },
    // Slow random amplitude grain (friction texture) applied to gain node g: ±depth around 1.
    grain(g, start, dur, cutoff, depth) {
      const s = k.noise(start, dur);
      const lp = k.filter('lowpass', cutoff, 0.5);
      // Lowpassed uniform noise has std ~0.577 * sqrt(fc / nyquist); scale it to std = depth.
      const amt = k.gain(depth / (0.577 * Math.sqrt(F(cutoff) / (ctx.sampleRate / 2))));
      g.gain.value = 1;
      s.connect(lp); lp.connect(amt); amt.connect(g.gain);
    },
    chain(...nodes) { for (let i = 0; i < nodes.length - 1; i++) nodes[i].connect(nodes[i + 1]); return nodes[nodes.length - 1]; },
    out,
    crackleBuffer: b.crackle,
  };
  return k;
}

// Each definition: dur (base seconds), level (mastering gain), send (reverb), maxVoices, minGap
// (seconds between starts), build(k, v) wires the sound into k.out. `level` is set from the analysis
// (node editions/audio/capture.mjs) so the worst-case peak over seeds, hard pans and rates sits at:
// hover -25, tick -21, lift -16, flip -15, close -14, slide -13, details -12, open -10 dBFS.
export const SOUNDS = {
  // A tiny soft brush as the cursor meets a sleeve.
  hover: {
    dur: 0.075, level: 0.47, send: 0.14, maxVoices: 2, minGap: 0.07,
    build(k) {
      const n = k.noise(0, 0.075);
      const bp = k.filter('bandpass', k.rand(1500, 2100), 0.7);
      const lp = k.filter('lowpass', 4200);
      k.chain(n, bp, lp, k.env(perc(0.006, 0.014, 0.075, k.rate), 0, 0.075, 0.22), k.out);
      const o = k.osc('sine', k.rand(1250, 1450), 0, 0.03);
      k.chain(o, k.env(perc(0.004, 0.006, 0.03, k.rate), 0, 0.03, 0.006), k.out);
    },
  },

  // A cardboard sleeve sliding up a few millimetres: short friction with a faint contact knock.
  lift: {
    dur: 0.21, level: 0.4, send: 0.2, maxVoices: 2, minGap: 0.08,
    build(k) {
      const n = k.noise(0, 0.21);
      const bp = k.filter('bandpass', 900, 0.9);
      k.sweep(bp.frequency, [[0, 850], [0.21, 1500]]);
      const lp = k.filter('lowpass', 4200);
      const g = k.gain(); k.grain(g, 0, 0.21, 90, 0.2);
      k.chain(n, bp, lp, g, k.env(perc(0.028, 0.07, 0.21, k.rate), 0, 0.21, 0.55), k.out);
      const o = k.osc('sine', 190, 0, 0.08);
      k.chain(o, k.env(perc(0.005, 0.018, 0.08, k.rate), 0, 0.08, 0.03), k.out);
    },
  },

  // The record sliding partly out of its sleeve: longer friction with a slight upward pitch glide.
  slide: {
    dur: 0.78, level: 0.58, send: 0.25, maxVoices: 2, minGap: 0.12,
    build(k) {
      const n = k.noise(0, 0.78);
      const bp = k.filter('bandpass', 700, 1.1);
      k.sweep(bp.frequency, [[0, 650], [0.78, 1450]]);
      const lp = k.filter('lowpass', 3600);
      const g = k.gain(); k.grain(g, 0, 0.78, 45, 0.3);
      const fn = swell(0.3, 0.78, 1.4);
      k.chain(n, bp, lp, g, k.env(fn, 0, 0.78, 0.5), k.out);
      // Pitched layer: a narrow resonance gliding upward gives the vinyl-edge tone.
      const n2 = k.noise(0, 0.78);
      const res = k.filter('bandpass', 380, 9);
      k.sweep(res.frequency, [[0, 360], [0.78, 520]]);
      k.chain(n2, res, k.env(fn, 0, 0.78, 0.9), k.out);
    },
  },

  // A soft air whoosh as the sleeve flies forward; the sound travels toward centre-right.
  details: {
    dur: 0.56, level: 0.6, send: 0.3, maxVoices: 2, minGap: 0.12,
    build(k, v) {
      const n = k.noise(0, 0.56);
      const lp = k.filter('lowpass', 260, 0.9);
      k.sweep(lp.frequency, [[0, 240], [0.22, 2000], [0.56, 420]]);
      const hp = k.filter('highpass', 150);
      k.chain(n, lp, hp, k.env(swell(0.22, 0.56, 1.2), 0, 0.56, 0.6), k.out);
      const n2 = k.noise(0, 0.56);
      const bp = k.filter('bandpass', 500, 2);
      k.sweep(bp.frequency, [[0, 480], [0.24, 1100], [0.56, 650]]);
      k.chain(n2, bp, k.env(swell(0.24, 0.56, 1.2), 0, 0.56, 0.18), k.out);
      v.panner.pan.setValueAtTime(v.pan, k.T(0));
      v.panner.pan.linearRampToValueAtTime(0.15, k.T(0.56));
    },
  },

  // A quick card flip: a rising fwip, then a soft flap as the sleeve lands face over.
  flip: {
    dur: 0.2, level: 0.59, send: 0.2, maxVoices: 2, minGap: 0.1,
    build(k) {
      const n = k.noise(0, 0.08);
      const bp = k.filter('bandpass', 1200, 1.3);
      k.sweep(bp.frequency, [[0, 1100], [0.075, 3400]]);
      const lp = k.filter('lowpass', 6000);
      k.chain(n, bp, lp, k.env(swell(0.035, 0.08), 0, 0.08, 0.5), k.out);
      const n2 = k.noise(0.08, 0.12);
      const lp2 = k.filter('lowpass', 750, 0.8);
      k.chain(n2, lp2, k.env(perc(0.005, 0.022, 0.12, k.rate), 0.08, 0.12, 0.75), k.out);
      const o = k.osc('sine', 150, 0.08, 0.1);
      k.chain(o, k.env(perc(0.005, 0.028, 0.1, k.rate), 0.08, 0.1, 0.05), k.out);
    },
  },

  // A deeper whoosh that lands on a needle drop, then crackle and groove hiss that decay.
  open: {
    dur: 3.25, level: 0.6, send: 0.32, maxVoices: 1, minGap: 0.3,
    build(k) {
      const n = k.noise(0, 0.72);
      const lp = k.filter('lowpass', 150, 0.8);
      k.sweep(lp.frequency, [[0, 130], [0.36, 1100], [0.72, 200]]);
      const hp = k.filter('highpass', 45);
      k.chain(n, lp, hp, k.env(swell(0.38, 0.72, 1.3), 0, 0.72, 0.9), k.out);
      const sub = k.osc('sine', 72, 0, 0.72);
      k.sweep(sub.frequency, [[0, 72], [0.72, 50]]);
      k.chain(sub, k.env(swell(0.42, 0.72), 0, 0.72, 0.06), k.out);
      // Needle drop at 0.62 s: a soft low thump and the faint tick of contact.
      const D = 0.62;
      const th = k.osc('sine', 105, D, 0.26);
      k.sweep(th.frequency, [[D, 105], [D + 0.26, 78]]);
      k.chain(th, k.env(perc(0.005, 0.05, 0.26, k.rate), D, 0.26, 0.11), k.out);
      // A short second partial so the thump still reads on laptop and phone speakers.
      const th2 = k.osc('sine', 215, D, 0.12);
      k.sweep(th2.frequency, [[D, 215], [D + 0.12, 170]]);
      k.chain(th2, k.env(perc(0.005, 0.025, 0.12, k.rate), D, 0.12, 0.04), k.out);
      const c = k.noise(D, 0.03);
      const cbp = k.filter('bandpass', 1800, 0.7);
      k.chain(c, cbp, k.env(perc(0.004, 0.004, 0.03, k.rate), D, 0.03, 0.12), k.out);
      // Crackle and groove hiss, the hiss breathing at 33 1/3 rpm.
      const cr = k.noise(D + 0.01, 2.6, k.crackleBuffer);
      const chp = k.filter('highpass', 600);
      const clp = k.filter('lowpass', 4500, 0.707, true);
      const cfn = perc(0.02, 0.85, 2.6, k.rate);
      k.chain(cr, chp, clp, k.env(cfn, D + 0.01, 2.6, 0.22), k.out);
      const h = k.noise(D + 0.01, 2.6);
      const hbp = k.filter('bandpass', 3000, 0.6);
      const hlp = k.filter('lowpass', 6000, 0.707, true);
      const am = k.gain(0.75);
      const rot = k.osc('sine', 0.555, D, 2.6);
      const depth = k.gain(0.25);
      rot.connect(depth); depth.connect(am.gain);
      k.chain(h, hbp, hlp, am, k.env(cfn, D + 0.01, 2.6, 0.035), k.out);
    },
  },

  // The reverse of details, shorter: the sleeve recedes to its slot.
  close: {
    dur: 0.36, level: 0.62, send: 0.3, maxVoices: 2, minGap: 0.12,
    build(k, v) {
      const n = k.noise(0, 0.36);
      const lp = k.filter('lowpass', 1500, 0.9);
      k.sweep(lp.frequency, [[0, 700], [0.1, 1700], [0.36, 260]]);
      const hp = k.filter('highpass', 150);
      k.chain(n, lp, hp, k.env(swell(0.1, 0.36, 1.6), 0, 0.36, 0.55), k.out);
      v.panner.pan.setValueAtTime(0.15, k.T(0));
      v.panner.pan.linearRampToValueAtTime(v.pan, k.T(0.36));
    },
  },

  // A UI click for buttons and toggles: a small wooden tock.
  tick: {
    dur: 0.05, level: 0.74, send: 0.12, maxVoices: 2, minGap: 0.04,
    build(k) {
      const o = k.osc('sine', 1150, 0, 0.05);
      k.sweep(o.frequency, [[0, 1450], [0.014, 1050]]);
      k.chain(o, k.env(perc(0.005, 0.009, 0.05, k.rate), 0, 0.05, 0.07), k.out);
      const o2 = k.osc('sine', 2780, 0, 0.025);
      k.chain(o2, k.env(perc(0.005, 0.004, 0.025, k.rate), 0, 0.025, 0.015), k.out);
      const n = k.noise(0, 0.02);
      const bp = k.filter('bandpass', 3400, 1.2);
      k.chain(n, bp, k.env(perc(0.005, 0.003, 0.02, k.rate), 0, 0.02, 0.12), k.out);
    },
  },
};
export const NAMES = Object.keys(SOUNDS);

// Schedule one voice at context time `when`. Returns a handle the voice manager can steal.
export function playVoice(bus, name, when, opts = {}, rng = Math.random) {
  const def = SOUNDS[name];
  const ctx = bus.ctx;
  const rate = clamp(Number.isFinite(opts.rate) ? opts.rate : 1, 0.5, 2);
  const intensity = clamp(Number.isFinite(opts.intensity) ? opts.intensity : 1, 0, 1);
  const pan = clamp(Number.isFinite(opts.pan) ? opts.pan : 0, -1, 1);
  const level = intensity * def.level;
  const out = ctx.createGain(); out.gain.value = level;
  const panner = ctx.createStereoPanner(); panner.pan.value = pan;
  const send = ctx.createGain(); send.gain.value = def.send;
  out.connect(panner); panner.connect(bus.input); panner.connect(send); send.connect(bus.reverb);
  const k = kit(ctx, out, when, rate, rng);
  def.build(k, { panner, pan });
  const end = when + def.dur / rate + 0.02;
  return {
    name, start: when, end, stolen: false,
    // Fade out over 15 ms from `at` and stop every source; used for voice stealing.
    stop(at) {
      if (this.stolen) return;
      this.stolen = true;
      const t = Math.max(at, when);
      out.gain.setValueAtTime(level, t);
      out.gain.linearRampToValueAtTime(0, t + 0.015);
      for (const s of k.sources) { try { s.stop(t + 0.02); } catch { /* already stopped */ } }
      this.end = Math.min(this.end, t + 0.02);
    },
    release() { out.disconnect(); panner.disconnect(); send.disconnect(); },
  };
}

// Freeze an automated param at its current value at time `at`, dropping later events.
export function holdAt(param, at) {
  if (param.cancelAndHoldAtTime) { param.cancelAndHoldAtTime(at); return; }
  param.cancelScheduledValues(at);
  param.setValueAtTime(param.value, at);
}

// Rate limiting and voice stealing, on any context. `when` is context time.
export const MAX_VOICES = 8;
export function createVoices(bus) {
  let voices = [];
  const last = {};
  return {
    play(name, when, opts, rng) {
      const def = SOUNDS[name];
      if (!def) return null;
      if (when - (last[name] ?? -Infinity) < def.minGap) return null;
      last[name] = when;
      voices = voices.filter(v => v.end > when);
      const same = voices.filter(v => v.name === name && !v.stolen);
      if (same.length >= def.maxVoices) same[0].stop(when);
      const live = voices.filter(v => !v.stolen);
      if (live.length >= MAX_VOICES) live[0].stop(when);
      const v = playVoice(bus, name, when, opts, rng);
      voices.push(v);
      return v;
    },
    stopAll(when) { for (const v of voices) v.stop(when); },
    get count() { return voices.length; },
  };
}

// ---------------------------------------------------------------------------------------------
// Room tone: two looped noise layers of incommensurate lengths (9.73 s and 13.37 s), each filtered
// and slowly modulated, plus the faintest warm hum. It repeats exactly only after hours.

const ROOM_LEVEL = 0.79;   // mastering: sits the steady room tone at -42 dBFS RMS

export function startRoom(bus, when, fadeIn = 2.5) {
  const ctx = bus.ctx;
  const b = bank(ctx);
  b.room ??= [loopNoise(ctx, 9.73, 51), loopNoise(ctx, 13.37, 67)];
  const nodes = [], sources = [];
  const mk = n => (nodes.push(n), n);
  const src = buf => { const s = mk(ctx.createBufferSource()); s.buffer = buf; s.loop = true; sources.push(s); return s; };
  const osc = (f, type = 'sine') => { const o = mk(ctx.createOscillator()); o.type = type; o.frequency.value = f; sources.push(o); return o; };
  const filt = (type, f, Q = 0.707) => { const x = mk(ctx.createBiquadFilter()); x.type = type; x.frequency.value = f; x.Q.value = Q; return x; };
  const gain = v => { const g = mk(ctx.createGain()); g.gain.value = v; return g; };
  const lfo = (param, f, depth) => { const o = osc(f); const d = gain(depth); o.connect(d); d.connect(param); };

  const fade = gain(0);
  const panL = mk(ctx.createStereoPanner()); panL.pan.value = -0.35;
  const panR = mk(ctx.createStereoPanner()); panR.pan.value = 0.35;

  // Layer A: low, soft room body, its cutoff wandering slowly.
  const a = src(b.room[0]);
  const aLp = filt('lowpass', 600, 0.5), aHp = filt('highpass', 120), aG = gain(0.06);
  lfo(aLp.frequency, 0.031, 90);
  a.connect(aLp); aLp.connect(aHp); aHp.connect(aG); aG.connect(panL); aG.connect(panR);
  // Layer B: a fainter band of air, its level breathing.
  const bS = src(b.room[1]);
  const bBp = filt('bandpass', 1500, 0.5), bLp = filt('lowpass', 3000), bG = gain(0.008);
  lfo(bG.gain, 0.019, 0.002);
  bS.connect(bBp); bBp.connect(bLp); bLp.connect(bG); bG.connect(panR);
  // Hum: 98 Hz with a quieter second harmonic, drifting in level.
  const h1 = osc(98), h2 = osc(196.3);
  const hG = gain(0.0016), h2G = gain(0.35);
  lfo(hG.gain, 0.043, 0.0005);
  h1.connect(hG); h2.connect(h2G); h2G.connect(hG); hG.connect(panL); hG.connect(panR);

  panL.connect(fade); panR.connect(fade); fade.connect(bus.input);
  for (const s of sources) s.start(when);
  fade.gain.setValueAtTime(0, when);
  fade.gain.linearRampToValueAtTime(ROOM_LEVEL, when + fadeIn);

  return {
    stop(at, fadeOut = 1.5) {
      holdAt(fade.gain, at);
      fade.gain.linearRampToValueAtTime(0, at + fadeOut);
      for (const s of sources) s.stop(at + fadeOut + 0.05);
      const cleanup = () => { for (const n of nodes) n.disconnect(); };
      sources[0].onended = cleanup;
    },
  };
}
