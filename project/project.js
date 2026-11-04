// A project's page, opened from the shelf or the Projects menu: one band in the project's colour, there in
// full from its first frame (no hero for now: a gap holds its place), the chapter rail at its left and the
// dossier: Overview first, then Under the hood and Build process behind the technical detail. About Neil
// gets the same structure with its own text.
// Loaded on demand with its stylesheet and the project's dossier file; disposed on Back.
import { CONTACT } from '../scene/config.js';
import { reduced } from '../scene/ease.js';
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
// The project's live site, in a new tab (Decision 16): under the overview's lead and in the foot.
const visitLink = (entry, cls) => `<a class="${cls}" href="${esc(entry.url)}" target="_blank" rel="noopener">Visit ${esc(entry.urlText || host(entry.url))}<span aria-hidden="true">↗</span><span class="sr"> (opens in a new tab)</span></a>`;
// The chapters, as the rail lists them.
const CHAPTERS = [['overview', 'Overview'], ['under-the-hood', 'Under the hood'], ['build-process', 'Build process']];
// The overview's steps: the narration's numbered list, each item's bold lead as the step's name.
function stepsHTML(archHi) {
  const items = [...(archHi || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
  if (!items.length) return '';
  return `<h3 class="pj-h3">How it works</h3><ol class="pj-steps">${items.map((s, k) => {
    const m = s.match(/^\s*<strong>([\s\S]*?)\.?<\/strong>\s*([\s\S]*)$/);
    return `<li><span class="pj-step-n">${String(k + 1).padStart(2, '0')}</span>${m ? `<h4>${m[1]}</h4><p>${m[2]}</p>` : `<p>${s}</p>`}</li>`;
  }).join('')}</ol>`;
}

function pageHTML(entry, data, slugOf, entries) {
  // A chapter: its number and title, then its body. The first chapter's title is on screen from the first
  // frame, so it is built filled; later titles fill as they scroll in (signalTitles), unless motion is reduced.
  const sec = (id, n, title, body, sig = !reduced()) => `<section class="pj-sec" aria-labelledby="pj-h-${id}">
    <div class="pj-part" id="pj-${id}" data-sec="${id}"><header class="pj-sh"><p class="pj-num">${n}</p><h2 id="pj-h-${id}"${sig ? ' class="pj-sig"' : ''}>${title}${sig ? `<span class="pj-fill" aria-hidden="true">${title}</span>` : ''}</h2></header>${body}</div></section>`;
  if (entry.kind === 'about') {
    const a = entry.about;
    const list = entries.filter(e => e.kind !== 'about').map(e =>
      `<li><a href="#${slugOf(e)}"><span class="n">${esc(e.name)}</span><span class="t">${esc(e.tag)}</span></a></li>`).join('');
    return sec('about', '01', esc(a[0]),
      `<p class="pj-lead">${esc(a[1])}</p><div class="pj-text"><p>${esc(a[2])}</p><p>${esc(a[3])}</p></div><ul class="pj-list">${list}</ul>`, false);
  }
  if (!data) return '<p class="pj-fail">This page did not load.</p>';
  // The figures as the reference's rows of short items: four to a row on desktop, a rule over each row.
  const glance = data.glance?.length
    ? `<dl class="pj-items">${data.glance.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : '';
  const diagram = data.diagram
    ? `<figure class="pj-figure"><div class="pj-diagram" tabindex="0" role="region" aria-label="${esc(data.loCap || 'Architecture diagram')}">${onBand(data.diagram)}</div>${data.loCap ? `<figcaption>${data.loCap}</figcaption>` : ''}</figure>` : '';
  // Overview: the lead, the live site, the figures, then the narration's steps as cards (a narration
  // without steps shows as its text). Under the hood (the diagram, the narration's other paragraphs, the
  // spec sheet) and Build process wait behind the technical detail; the rail opens it.
  const steps = stepsHTML(data.archHi);
  const narration = steps ? (data.archHi || '').replace(/<ol>[\s\S]*?<\/ol>/g, '').trim() : '';
  const proposal = data.proposal ? '<p class="pj-num">Draft for review</p>' : '';
  return [
    sec('overview', '01', 'Overview', `${proposal}<p class="pj-lead">${data.what}</p>
      ${entry.url ? `<p class="pj-actions">${visitLink(entry, 'pj-visit')}</p>` : ''}${glance}
      ${steps || (data.archHi ? `<div class="pj-text">${data.archHi}</div>` : '')}`, false),
    `<details class="pj-more"><summary><span class="pj-more-open">Read the technical detail</span><span class="pj-more-close">Hide the technical detail</span></summary>
      ${sec('under-the-hood', '02', 'Under the hood', `${diagram}${narration ? `<div class="pj-text">${narration}</div>` : ''}<div class="pj-text">${data.arch}</div></div>
      <div class="pj-part" id="pj-build-process" data-sec="build-process"><h3 class="pj-h3">Build process</h3><div class="pj-text">${data.proc}</div>`)}</details>`,
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

export function createProjectView({ entries, slugOf, onBack }) {
  let st = null, token = 0;

  async function open(i) {
    close();
    const my = ++token, entry = entries[i];
    const [data] = await Promise.all([entry.kind === 'about' ? null : loadDossier(slugOf(entry)), loadCss()]);
    if (my !== token) return;

    const col = colours(entry);
    const root = document.createElement('main');
    root.className = 'pj';
    root.setAttribute('aria-label', entry.name);
    const vars = {
      '--acc': col.panel, '--fg': col.fg, '--fg-inv': col.fgInv, '--pj-ink': col.ink, '--pj-card': col.card,
      '--pj-soft': `rgb(${col.fg} / ${col.soft})`, '--pj-line': `rgb(${col.fg} / ${col.line})`,
      '--pj-btn': col.button, '--pj-btn-ink': col.buttonInk,
      '--dg-ink': col.ink, '--dg-line': mix(col.ink, col.card, col.line), '--dg-node': col.node, '--dg-label': col.card,
      '--dg-cluster': col.cluster, '--dg-rule': col.rule,
    };
    for (const k in vars) root.style.setProperty(k, vars[k]);
    const rail = entry.kind === 'about' || !data ? '<div></div>'
      : `<nav class="pj-rail" aria-label="Chapters"><ol>${CHAPTERS.map(([id, label]) => `<li><button type="button" data-sec="${id}">${label}</button></li>`).join('')}</ol></nav>`;
    root.innerHTML = `
      <header class="pj-head">
        <a class="pj-mark" href="./" data-back>njct.io</a><span class="pj-name">${esc(entry.name)}</span>
        <span class="pj-sp"></span>
        <button class="pj-back" type="button" data-back>Back</button>
        <a class="pj-cta" href="${CONTACT}">Get in touch</a>
      </header>
      <h1 class="sr" tabindex="-1">${esc(entry.name)}</h1>
      <div class="pj-gap" aria-hidden="true"></div>
      <div class="pj-body">
        ${rail}
        <div class="pj-main">
          ${pageHTML(entry, data, slugOf, entries)}
          <footer class="pj-foot">
            <button type="button" data-back>Back to the shelf</button>
            ${entry.url ? visitLink(entry, '') : ''}
            <a href="${CONTACT}">Get in touch</a>
          </footer>
        </div>
      </div>`;
    document.documentElement.style.setProperty('--pj-ground', col.panel);   // the band runs under overscroll too
    document.documentElement.classList.add('in-project');
    document.body.append(root);
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    // Diagrams keep their drawn size and scroll sideways inside their box.
    for (const svg of root.querySelectorAll('.pj-diagram svg')) {
      const vb = svg.viewBox?.baseVal;
      if (vb && vb.width) { svg.style.width = `${Math.round(vb.width)}px`; svg.style.maxWidth = 'none'; svg.removeAttribute('width'); }
    }

    // A chapter inside the technical detail opens it before the page scrolls there.
    root.addEventListener('click', e => {
      const b = e.target.closest('[data-back], [data-sec], [data-go]');
      if (!b) return;
      if (b.matches('[data-back]')) { e.preventDefault(); onBack(); return; }
      if (!b.dataset.sec) { location.hash = b.dataset.go; return; }
      const to = root.querySelector(`#pj-${b.dataset.sec}`), more = to?.closest('details');
      if (more && !more.open) more.open = true;
      to?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
    });
    // The rail marks the chapter at the screen's middle.
    const railButtons = [...root.querySelectorAll('.pj-rail button')];
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) railButtons.forEach(b => b.setAttribute('aria-current', String(b.dataset.sec === e.target.dataset.sec)));
    }, { rootMargin: '-45% 0px -50% 0px' });
    root.querySelectorAll('.pj-part').forEach(s => io.observe(s));
    railButtons[0]?.setAttribute('aria-current', 'true');
    const sig = signalTitles(root);

    st = { i, root, io, sig, raf: 0 };
    // Each chapter is laid out in full in a frame of its own (pj-laid), so every heading and its content are
    // in the accessibility tree wherever the page is scrolled (a chapter content-visibility skips is left out).
    const unlaid = [...root.querySelectorAll('.pj-sec')];
    const frame = () => {
      if (!st || st.root !== root) return;
      unlaid.shift()?.classList.add('pj-laid');
      st.raf = unlaid.length ? requestAnimationFrame(frame) : 0;
    };
    st.raf = requestAnimationFrame(frame);
    const onKey = e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); onBack(); } };
    st.off = () => removeEventListener('keydown', onKey);
    addEventListener('keydown', onKey);
    root.querySelector('h1').focus({ preventScroll: true });
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
