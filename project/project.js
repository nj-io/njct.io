// A project's page, opened from the shelf: a cut to a flat window in its accent, the accent panel sliding in
// with the giant vertical title, then the dossier below:
// Overview, Under the hood, Build process. About Neil gets the same structure with its own text.
// Loaded on demand with its stylesheet and the project's dossier file; disposed on Back.
import { OPEN, CONTACT } from '../scene/config.js';
import { bezier, clamp01, dur, delay, reduced } from '../scene/ease.js';
import { coverGround } from '../covers/grounds.js';

const CSS = new URL('./project.css', import.meta.url).href;
let cssP = null;
function loadCss() {
  if (!cssP) cssP = new Promise(res => {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = CSS; l.onload = l.onerror = () => res();
    document.head.append(l);
  });
  return cssP;
}
const dossiers = new Map();
export function loadDossier(slug) {
  if (!dossiers.has(slug)) dossiers.set(slug, fetch(new URL(`../data/dossiers/${slug}.json`, import.meta.url))
    .then(r => (r.ok ? r.json() : null)).catch(() => null));
  return dossiers.get(slug);
}

// Colours, as on the reference's project page: each section there is one flat colour, full bleed, with
// cards in white at 8% over it and buttons in a deep tone of it; titles are white, copy white at 70%.
// A project's page is one band in the project's colour: its accent's light value, or its cover's
// ground (Stellar Explorer, Scorecard, About Neil). The ink is white or near black, whichever needs the
// band moved less; the band moves in OKLCH lightness only (hue and chroma kept), and only as far as
// the ink needs to read at 4.5:1 on the diagram's boxes (ink at 16% over the band), so it reads on
// every lighter ground too. Secondary text is the ink at 70%, or as much stronger as 4.5:1 on a card
// needs; lines are the ink at 70%, or what 3:1 on a card needs. The world's culture takes the
// accent's hue; covers without an accent give it their own tint.
const TINTS = { 'Scorecard': '#F6C21C', 'Stellar Explorer': '#DBA95C', 'About Neil': '#E4A23C' };
const WHITE = '#ffffff', DARK = '#17120b';
const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const hexOf = rgb => '#' + rgb.map(v => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
const toLin = v => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGam = v => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
const lum = hex => { const [r, g, b] = rgbOf(hex).map(toLin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const mix = (fg, bg, a) => { const g = rgbOf(bg); return hexOf(rgbOf(fg).map((v, k) => v * a + g[k] * (1 - a))); };   // fg at alpha a over bg
function oklch(hex) {
  const [r, g, b] = rgbOf(hex).map(toLin);
  const [l, m, s] = [0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b, 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b].map(Math.cbrt);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s, A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  return [L, Math.hypot(A, B), Math.atan2(B, A)];
}
function fromOklch(L, C, h) {   // chroma drops until the colour is inside sRGB
  for (;; C *= 0.98) {
    const A = C * Math.cos(h), B = C * Math.sin(h);
    const [l, m, s] = [L + 0.3963377774 * A + 0.2158037573 * B, L - 0.1055613458 * A - 0.0638541728 * B, L - 0.0894841775 * A - 1.2914855480 * B].map(v => v ** 3);
    const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s];
    if (rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4) || C < 1e-4) return hexOf(rgb.map(v => toGam(Math.min(1, Math.max(0, v)))));
  }
}
function bandFor(base, ink) {   // [band, steps of 0.005 in OKLCH lightness away from the ink]
  const [L, C, h] = oklch(base), dir = ink === WHITE ? -1 : 1;
  for (let n = 0; n <= 200; n++) {
    const band = n ? fromOklch(Math.min(1, Math.max(0, L + dir * n * 0.005)), C, h) : base;
    if (contrast(ink, mix(ink, band, 0.16)) >= 4.5) return [band, n];
  }
  return [ink === WHITE ? '#000000' : WHITE, Infinity];
}
const alphaFor = (ink, ground, target) => { let a = 0.7; while (a < 1 && contrast(mix(ink, ground, a), ground) < target) a += 0.01; return Math.min(1, +a.toFixed(2)); };
const hueOf = hex => {
  const [r, g, b] = rgbOf(hex).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
export function colours(entry) {
  const base = entry.accent?.light || coverGround(entry);
  const [w, nw] = bandFor(base, WHITE), [d, nd] = bandFor(base, DARK);
  const [ink, band] = nw <= nd ? [WHITE, w] : [DARK, d];
  const card = mix(ink, band, 0.08), [L, C, h] = oklch(band);
  // The button's tone: deep in the band's hue (the reference's L 0.21-0.29 at half the chroma), or a
  // light grey on a band that is nearly black already (the reference's slate section).
  const button = L > 0.3 ? fromOklch(Math.min(0.26, L - 0.15), C * 0.52, h) : fromOklch(0.85, 0, 0);
  return {
    base, panel: band, ink, card, hue: hueOf(entry.accent?.light || TINTS[entry.name] || '#FF8A2A'),
    soft: alphaFor(ink, card, 4.5), line: alphaFor(ink, card, 3),
    node: mix(ink, band, 0.16), cluster: mix(ink, band, 0.11), rule: mix(ink, band, 0.45),
    button, buttonInk: contrast(WHITE, button) >= contrast('#000000', button) ? WHITE : '#000000',
    fg: ink === WHITE ? '255 255 255' : '23 18 11', fgInv: ink === WHITE ? '0 0 0' : '255 255 255',
  };
}
// The architecture diagrams are drawn in the dossiers' light theme; on the band they take the band's
// variant of it: the theme's colours in the SVG's own style rules and style attributes become the
// page's diagram colours. Colours a diagram sets for its own nodes (stet's, Clauded's) stay.
const DG = [[/#131311|#181b22/gi, 'var(--dg-ink)'], [/#6d6b63|#92949c/gi, 'var(--dg-line)'], [/#f7f5f0/gi, 'var(--dg-node)'],
  [/#efece6|rgba\(239, ?236, ?230, ?0\.5\)/gi, 'var(--dg-label)'], [/#e7e4dd/gi, 'var(--dg-cluster)'],
  [/#c9c5bc|hsl\(4[02], [\d.]+%, [\d.]+%\)/gi, 'var(--dg-rule)']];
const onBand = svg => svg.replace(/<style>[\s\S]*?<\/style>|style="[^"]*"/g, css => DG.reduce((t, [re, v]) => t.replace(re, v), css));

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const host = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const SECTIONS = [['overview', 'Overview'], ['under-the-hood', 'Under the hood'], ['build-process', 'Build process']];

function pageHTML(entry, data, slugOf, entries) {
  const about = entry.kind === 'about';
  const sec = (id, n, title, body) => `<section class="pj-sec" aria-labelledby="pj-h-${id}">
    <div class="pj-part" id="pj-${id}" data-sec="${id}"><header class="pj-sh"><p class="pj-num">${n}</p><h2 id="pj-h-${id}"${reduced() ? '' : ' class="pj-sig"'}>${title}${reduced() ? '' : `<span class="pj-fill" aria-hidden="true">${title}</span>`}</h2></header>${body}</div></section>`;
  if (about) {
    const a = entry.about;
    const list = entries.filter(e => e.kind !== 'about').map(e =>
      `<li><a href="#${slugOf(e)}"><span class="n">${esc(e.name)}</span><span class="t">${esc(e.tag)}</span></a></li>`).join('');
    return sec('about', '01', esc(a[0]),
      `<p class="pj-lead">${esc(a[1])}</p><div class="pj-text"><p>${esc(a[2])}</p><p>${esc(a[3])}</p></div><ul class="pj-list">${list}</ul>`);
  }
  if (!data) return '<p class="pj-fail">This page did not load.</p>';
  // The figures as the reference's rows of short items: four to a row on desktop, a rule over each row.
  const glance = data.glance?.length
    ? `<dl class="pj-items">${data.glance.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
  const diagram = data.diagram
    ? `<figure class="pj-figure"><div class="pj-diagram" tabindex="0" role="region" aria-label="${esc(data.loCap || 'Architecture diagram')}">${onBand(data.diagram)}</div>${data.loCap ? `<figcaption>${data.loCap}</figcaption>` : ''}</figure>` : '';
  // As on the live site: Overview is the lead, the figures and the narration; Under the hood is the
  // diagram and the spec sheet, with Build process as its second part (never under Overview).
  return [
    sec('overview', '01', 'Overview', `<p class="pj-lead">${data.what}</p>${glance}${data.archHi ? `<div class="pj-text">${data.archHi}</div>` : ''}`),
    sec('under-the-hood', '02', 'Under the hood', `${diagram}<div class="pj-text">${data.arch}</div></div>
      <div class="pj-part" id="pj-build-process" data-sec="build-process"><h3 class="pj-h3">Build process</h3><div class="pj-text">${data.proc}</div>`),
  ].join('');
}

// The section titles' reveal, as on the reference's desktop page: a title waits as an outline (the ink at
// 40%) until its line, with a quarter of its type size above and below, is wholly on screen; from 175 ms
// later it fills with sixteen growing discs on two rows (0.42 and 0.75 down its line), eight columns
// across its width, the rightmost column first: each column 55 ms after the one to its right, the lower
// disc 50 ms after the upper, each growing over 720 ms (ease-out cubic) to 2.8 and 3.275 times the type
// size across.
// Phones show titles filled (project.css), as the reference does; under reduced motion titles are built
// filled (pageHTML). Returns the disposer.
const SIG = { delay: 175, cols: 8, pad: 0.25, rows: [[0.4167, 2.8, 0], [0.75, 3.275, 50]], stagger: 55, grow: 720 };
const DISC = 'radial-gradient(closest-side, #fff 100%, #0000 100%)';
function signalTitles(root) {
  const runs = new Set();
  const done = h => { h.classList.remove('pj-sig'); h.querySelector('.pj-fill')?.remove(); };
  function play(h) {
    const fill = h.querySelector('.pj-fill');
    if (!fill) return;
    const range = document.createRange();
    range.selectNodeContents(fill);
    const box = fill.getBoundingClientRect(), text = range.getBoundingClientRect(), em = parseFloat(getComputedStyle(h).fontSize);
    const discs = [];
    for (let c = SIG.cols - 1, k = 0; c >= 0; c--, k++) for (const [y, d, lag] of SIG.rows)
      discs.push({ x: text.left - box.left + (c + 0.5) / SIG.cols * text.width, y: (SIG.pad + y) * em, d: d * em, at: k * SIG.stagger + lag });
    fill.style.webkitMaskImage = fill.style.maskImage = discs.map(() => DISC).join(', ');
    const t0 = performance.now() + SIG.delay, end = discs.at(-1).at + SIG.grow;
    const run = { raf: 0 };
    runs.add(run);
    const frame = now => {
      const t = now - t0, size = [], pos = [];
      for (const o of discs) {
        const u = Math.min(1, Math.max(0, (t - o.at) / SIG.grow)), r = (1 - (1 - u) ** 3) * o.d;
        size.push(`${r.toFixed(1)}px ${r.toFixed(1)}px`); pos.push(`${(o.x - r / 2).toFixed(1)}px ${(o.y - r / 2).toFixed(1)}px`);
      }
      fill.style.webkitMaskSize = fill.style.maskSize = size.join(', ');
      fill.style.webkitMaskPosition = fill.style.maskPosition = pos.join(', ');
      if (t < end) run.raf = requestAnimationFrame(frame); else { runs.delete(run); done(h); }
    };
    run.raf = requestAnimationFrame(frame);
  }
  const desk = matchMedia('(min-width: 900px)');
  const io = new IntersectionObserver(es => {
    for (const e of es) if (e.intersectionRatio >= 0.999 && desk.matches) { io.unobserve(e.target); play(e.target); }
  }, { threshold: 1 });   // the title's box carries the quarter above and below (project.css)
  root.querySelectorAll('h2.pj-sig').forEach(h => io.observe(h));
  return () => { io.disconnect(); for (const r of runs) cancelAnimationFrame(r.raf); runs.clear(); };
}

function heroColumn(entry, data, slugOf, entries) {
  if (entry.kind === 'about') {
    const rows = entries.filter(e => e.kind !== 'about').map((e, k) =>
      `<li><button type="button" data-go="#${slugOf(e)}"><span>${esc(e.name)}</span><span>${String(k + 1).padStart(2, '0')}</span></button></li>`).join('');
    return `<nav class="pj-box pj-index" aria-label="Projects"><ol>${rows}</ol></nav>`;
  }
  const rows = SECTIONS.map(([id, label], k) =>
    `<li><button type="button" data-sec="${id}"><span>${label}</span><span>${String(k + 1).padStart(2, '0')}</span></button></li>`).join('');
  const figs = (data?.glance || []).map(([k, v]) => `<div class="pj-box pj-fig"><span class="k">${k}</span><span class="v">${v}</span></div>`).join('');
  return `<nav class="pj-box pj-index" aria-label="Sections"><ol>${rows}</ol></nav>${figs}`;
}

// The giant title's size: as long as the panel's title column is tall (desktop) or the screen is wide
// (phone), never wider than the column. On desktop the tag runs down from the column's top: a title long
// enough to reach it either stops short of it or thins to pass beside it, whichever leaves it larger.
const measure = document.createElement('canvas').getContext('2d');
function fitTitle(el, text, vertical, box) {
  measure.font = "500 100px 'NJ Text', system-ui, sans-serif";
  const w100 = measure.measureText(text).width - 2 * (text.length - 1);   // letter-spacing -0.02em
  let size = vertical ? Math.min((box.w - 22) / 0.74, box.h / (w100 / 100)) : Math.min(box.w / (w100 / 100), 140);
  if (vertical && box.sub && size * w100 / 100 + box.sub + 24 > box.h)
    size = Math.min(size, Math.max((box.h - box.sub - 24) / (w100 / 100), (box.w - 52) / 0.74));
  el.style.fontSize = `${Math.floor(size * 10) / 10}px`;
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function scrambleHTML(text, u) {   // u 0..1: letters settle in reading order, each glimpsed scrambled first
  const n = text.length;
  let out = '';
  for (let k = 0; k < n; k++) {
    const settle = (k + 1) / n, appear = settle - 0.35;
    const ch = text[k];
    if (u >= settle || ch === ' ') out += esc(ch);
    else if (u >= appear) out += esc(GLYPHS[(Math.random() * GLYPHS.length) | 0]);
    else out += `<span style="visibility:hidden">${esc(ch)}</span>`;
  }
  return out;
}

export function createProjectView({ entries, slugOf, onBack }) {
  let st = null, token = 0;

  async function open(i, { cutAfter = 0 } = {}) {
    close();
    const my = ++token, t0 = performance.now(), entry = entries[i];
    const [data] = await Promise.all([entry.kind === 'about' ? null : loadDossier(slugOf(entry)), loadCss()]);
    if (my !== token) return;

    // The page is built and parsed before the cut (hidden, so nothing is laid out yet). At the cut only the
    // header and hero are laid out; the dossier below them (pj-cold) is laid out two frames later, so
    // neither lands in one long frame.
    const col = colours(entry);
    const root = document.createElement('main');
    root.className = 'pj pj-cold';
    root.hidden = true;
    root.setAttribute('aria-label', entry.name);
    const vars = {
      '--acc': col.panel, '--fg': col.fg, '--fg-inv': col.fgInv, '--pj-ink': col.ink, '--pj-card': col.card,
      '--pj-soft': `rgb(${col.fg} / ${col.soft})`, '--pj-line': `rgb(${col.fg} / ${col.line})`,
      '--pj-btn': col.button, '--pj-btn-ink': col.buttonInk,
      '--dg-ink': col.ink, '--dg-line': mix(col.ink, col.card, col.line), '--dg-node': col.node, '--dg-label': col.card,
      '--dg-cluster': col.cluster, '--dg-rule': col.rule,
    };
    for (const k in vars) root.style.setProperty(k, vars[k]);
    const sub = entry.kind === 'about' ? entry.about[2] : entry.tag;
    const proposal = data?.proposal ? '<p class="pj-num" style="margin-top:-36px">Draft for review</p>' : '';
    root.innerHTML = `
      <header class="pj-head">
        <a class="pj-mark" href="./" data-back>njct.io</a><span class="pj-name">${esc(entry.name)}</span>
        <span class="pj-sp"></span>
        <button class="pj-back" type="button" data-back>Back</button>
        <a class="pj-cta" href="${CONTACT}">Get in touch</a>
      </header>
      <section class="pj-hero" aria-label="${esc(entry.name)}">
        <div class="pj-panel">
          <div class="pj-titlecol"><h1 class="pj-title" tabindex="-1" aria-label="${esc(entry.name)}"><span aria-hidden="true"></span></h1>${sub ? `<p class="pj-sub">${esc(sub)}</p>` : ''}</div>
          <div class="pj-col">${heroColumn(entry, data, slugOf, entries)}</div>
        </div>
        <div class="pj-window" aria-hidden="true">${data?.mascot ? `<img class="pj-mascot" src="${esc(data.mascot.src)}" width="${data.mascot.w}" height="${data.mascot.h}" alt="" decoding="async">` : ''}</div>
      </section>
      <div class="pj-body">
        ${entry.kind === 'about' || !data ? '<div></div>' : `<nav class="pj-rail" aria-label="Sections"><ol>${SECTIONS.map(([id, label]) => `<li><button type="button" data-sec="${id}">${label}</button></li>`).join('')}</ol></nav>`}
        <div class="pj-main">
          ${pageHTML(entry, data, slugOf, entries).replace('<p class="pj-lead">', `${proposal}<p class="pj-lead">`)}
          <footer class="pj-foot">
            <button type="button" data-back>Back to the shelf</button>
            ${entry.url ? `<a href="${esc(entry.url)}" rel="noopener">${esc(entry.urlText || host(entry.url))}</a>` : ''}
          </footer>
        </div>
      </div>`;
    document.body.append(root);
    const wait = t0 + cutAfter - performance.now();
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    if (my !== token) { root.remove(); return; }
    root.hidden = false;
    document.documentElement.style.setProperty('--pj-ground', col.panel);   // the band runs under overscroll too
    document.documentElement.classList.add('in-project');
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const q = s => root.querySelector(s);
    const title = q('.pj-title'), titleSpan = title.firstElementChild, panel = q('.pj-panel');
    const vertical = () => matchMedia('(min-width: 900px)').matches;
    const fit = () => {
      const tc = q('.pj-titlecol').getBoundingClientRect(), hero = q('.pj-hero').getBoundingClientRect();
      fitTitle(title, entry.name, vertical(), vertical()
        ? { w: tc.width, h: hero.height - 2 * parseFloat(getComputedStyle(root).getPropertyValue('--pj-frame')) - 12, sub: q('.pj-sub')?.getBoundingClientRect().height || 0 }
        : { w: hero.width - 32 });
    };
    fit();
    titleSpan.innerHTML = scrambleHTML(entry.name, 0);
    // Diagrams keep their drawn size and scroll sideways inside their box.
    for (const svg of root.querySelectorAll('.pj-diagram svg')) {
      const vb = svg.viewBox?.baseVal;
      if (vb && vb.width) { svg.style.width = `${Math.round(vb.width)}px`; svg.style.maxWidth = 'none'; svg.removeAttribute('width'); }
    }

    root.addEventListener('click', e => {
      const b = e.target.closest('[data-back], [data-sec], [data-go]');
      if (!b) return;
      if (b.matches('[data-back]')) { e.preventDefault(); onBack(); }
      else if (b.dataset.sec) root.querySelector(`#pj-${b.dataset.sec}`)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      else location.hash = b.dataset.go;
    });
    const rail = [...root.querySelectorAll('.pj-rail button')];
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) rail.forEach(b => b.setAttribute('aria-current', String(b.dataset.sec === e.target.dataset.sec)));
    }, { rootMargin: '-45% 0px -50% 0px' });
    root.querySelectorAll('.pj-part').forEach(s => io.observe(s));
    const sig = signalTitles(root);

    // The window holds the accent's light (project.css, .pj-noworld): the page has no living culture.
    root.classList.add('pj-noworld');
    const cut = performance.now();
    st = { i, root, io, sig, raf: 0, cut, frames: 0, panelDone: !vertical(), titleDone: false, fit };
    const warmBody = () => root.classList.remove('pj-cold');
    // After the body, each section is laid out in full in a frame of its own (pj-laid), so every heading and
    // its content are in the accessibility tree wherever the page is scrolled (a section that
    // content-visibility skips is left out of it).
    const unlaid = [...root.querySelectorAll('.pj-sec')];
    if (!vertical()) { panel.style.transform = 'none'; q('.pj-mascot')?.classList.add('in'); }
    const onScroll = () => { warmBody(); if (st && !st.raf) wake(); };
    const onResize = () => { st?.fit(); wake(); };
    const onKey = e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); onBack(); } };
    st.off = () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); removeEventListener('keydown', onKey); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    addEventListener('keydown', onKey);
    title.focus({ preventScroll: true });

    function frame(now) {
      if (!st || st.root !== root) return;
      st.raf = 0;
      const t = now - st.cut;
      let busy = ++st.frames < 3 || unlaid.length > 0;
      if (st.frames === 2) warmBody();
      else if (st.frames > 2) unlaid.shift()?.classList.add('pj-laid');
      if (!st.panelDone) {
        const P = OPEN.panel, u = bezier(P.ease, clamp01((t - delay(P.at)) / dur(P.dur)));
        panel.style.transform = u >= 1 ? 'none' : `translateX(${((u - 1) * 100).toFixed(3)}%)`;
        st.panelDone = u >= 1; busy = true;
        if (st.panelDone) q('.pj-mascot')?.classList.add('in');
      }
      if (!st.titleDone) {
        const T = OPEN.title, u = clamp01((t - delay(T.at)) / dur(T.dur));
        titleSpan.innerHTML = reduced() ? (u > 0 ? esc(entry.name) : scrambleHTML(entry.name, 0)) : scrambleHTML(entry.name, u);
        st.titleDone = u >= 1; busy = true;
      }
      if (busy) st.raf = requestAnimationFrame(frame);
    }
    function wake() { if (st && !st.raf) st.raf = requestAnimationFrame(frame); }
    st.wake = wake;
    wake();
  }

  function close() {
    token++;
    if (!st) return;
    const s = st;
    st = null;
    if (s.raf) cancelAnimationFrame(s.raf);
    s.off(); s.io.disconnect(); s.sig();
    s.root.remove();
    document.documentElement.classList.remove('in-project');
    document.documentElement.style.removeProperty('--pj-ground');
    window.scrollTo(0, 0);
  }

  return {
    open, close,
    // Before the first Open, at idle on the shelf: the stylesheet and the page's font.
    warm() {
      loadCss().then(() => document.fonts.load("500 13px 'NJ Page Mono'")).catch(() => {});
      return Promise.resolve(null);
    },
    get index() { return st ? st.i : -1; },
    get busy() { return !!st?.raf; },
  };
}
