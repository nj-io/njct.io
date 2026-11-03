// A project's page, opened from the shelf: a cut to its world (the Gray-Scott culture grown from its name,
// in its accent), the accent panel sliding in with the giant vertical title, then the dossier below:
// Overview, Under the hood, Build process. About Neil gets the same structure with its own text.
// Loaded on demand with its stylesheet and the project's dossier file; disposed on Back.
import { createWorld, warmWorld } from './world.js';
import { OPEN } from '../scene/config.js';
import { bezier, clamp01, dur, delay, reduced } from '../scene/motion.js';

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

// Colours: the panel takes the accent, the culture the accent's hue (in the home page's dark-theme pigment).
// Entries without an accent, and About Neil, take colours from their cover's palette (covers.js designFor):
// panel, the culture's tint and the page's ink. Panel text is white unless white reads under 4.5:1 on the
// panel; the page's ink is darkened until it reads at 4.5:1 on the page ground.
const COVER_COLOURS = {
  'Scorecard': { panel: '#1F5DD8', tint: '#F6C21C' },
  'Stellar Explorer': { panel: '#1E2C8C', tint: '#DBA95C' },
  'About Neil': { panel: '#9A6418', tint: '#E4A23C' },
};
const GROUND = '#ECECEA';
const rgbOf = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
const lum = hex => { const [r, g, b] = rgbOf(hex).map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const darken = (hex, k) => '#' + rgbOf(hex).map(v => Math.round(v * k).toString(16).padStart(2, '0')).join('');
function readable(hex, on) { let c = hex; for (let k = 1; contrast(c, on) < 4.5 && k > 0.2; k -= 0.04) c = darken(hex, k); return c; }
const hueOf = hex => {
  const [r, g, b] = rgbOf(hex).map(v => v / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!d) return 0;
  const h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
};
// An entry with neither takes the colours of the cover module's fallback design (flow lines on navy).
const FALLBACK = { panel: '#0B1234', tint: '#FF8A2A' };
export function colours(entry) {
  const c = entry.accent ? { panel: entry.accent.light, tint: entry.accent.light } : COVER_COLOURS[entry.name] || FALLBACK;
  const dark = contrast('#FFFFFF', c.panel) < 4.5;
  return { panel: c.panel, hue: hueOf(c.tint), ink: readable(c.panel, GROUND),
    fg: dark ? '23 18 11' : '255 255 255', fgInv: dark ? '255 255 255' : '0 0 0' };
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const host = url => url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const SECTIONS = [['overview', 'Overview'], ['under-the-hood', 'Under the hood'], ['build-process', 'Build process']];

function pageHTML(entry, data, slugOf, entries) {
  const about = entry.kind === 'about';
  const sec = (id, n, title, body) => `<section class="pj-sec" aria-labelledby="pj-h-${id}">
    <div class="pj-part" id="pj-${id}" data-sec="${id}"><p class="pj-num">${n}</p><h2 id="pj-h-${id}">${title}</h2>${body}</div></section>`;
  if (about) {
    const a = entry.about;
    const list = entries.filter(e => e.kind !== 'about').map(e =>
      `<li><a href="#${slugOf(e)}"><span class="n">${esc(e.name)}</span><span class="t">${esc(e.tag)}</span></a></li>`).join('');
    return sec('about', '01', esc(a[0]),
      `<p class="pj-lead">${esc(a[1])}</p><div class="pj-text"><p>${esc(a[2])}</p><p>${esc(a[3])}</p></div><ul class="pj-list">${list}</ul>`);
  }
  if (!data) return '<p class="pj-fail">This page did not load.</p>';
  const glance = data.glance?.length
    ? `<table class="pj-glance"><tbody>${data.glance.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join('')}</tbody></table>` : '';
  const diagram = data.diagram
    ? `<figure class="pj-figure"><div class="pj-diagram" tabindex="0" role="region" aria-label="${esc(data.loCap || 'Architecture diagram')}">${data.diagram}</div>${data.loCap ? `<figcaption>${data.loCap}</figcaption>` : ''}</figure>` : '';
  // As on the live site: Overview is the lead, the figures and the narration; Under the hood is the
  // diagram and the spec sheet, with Build process as its second part (never under Overview).
  return [
    sec('overview', '01', 'Overview', `<p class="pj-lead">${data.what}</p>${glance}${data.archHi ? `<div class="pj-text">${data.archHi}</div>` : ''}`),
    sec('under-the-hood', '02', 'Under the hood', `${diagram}<div class="pj-text">${data.arch}</div></div>
      <div class="pj-part" id="pj-build-process" data-sec="build-process"><h3 class="pj-h3">Build process</h3><div class="pj-text">${data.proc}</div>`),
  ].join('');
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

export function createProjectView({ renderer, entries, slugOf, onBack, onCta }) {
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
    root.style.setProperty('--acc', col.panel);
    root.style.setProperty('--acc-ink', col.ink);
    root.style.setProperty('--fg', col.fg);
    root.style.setProperty('--fg-inv', col.fgInv);
    const sub = entry.kind === 'about' ? entry.about[2] : entry.tag;
    const proposal = data?.proposal ? '<p class="pj-num" style="margin-top:-36px">Draft for review</p>' : '';
    root.innerHTML = `
      <header class="pj-head">
        <a class="pj-mark" href="./" data-back>njct.io</a><span class="pj-name">${esc(entry.name)}</span>
        <span class="pj-sp"></span>
        <button class="pj-back" type="button" data-back>Back</button>
        <button class="pj-cta" type="button">Get in touch</button>
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
            ${entry.url ? `<a href="${esc(entry.url)}" rel="noopener">${esc(host(entry.url))}</a>` : ''}
          </footer>
        </div>
      </div>`;
    document.body.append(root);
    const wait = t0 + cutAfter - performance.now();
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    if (my !== token) { root.remove(); return; }
    root.hidden = false;
    document.documentElement.classList.add('in-project');
    history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);

    const q = s => root.querySelector(s);
    const title = q('.pj-title'), titleSpan = title.firstElementChild, panel = q('.pj-panel'), win = q('.pj-window'), body = q('.pj-body');
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
      const b = e.target.closest('[data-back], [data-sec], [data-go], .pj-cta');
      if (!b) return;
      if (b.matches('[data-back]')) { e.preventDefault(); onBack(); }
      else if (b.dataset.sec) root.querySelector(`#pj-${b.dataset.sec}`)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth' });
      else if (b.dataset.go) location.hash = b.dataset.go;
      else onCta?.();
    });
    const rail = [...root.querySelectorAll('.pj-rail button')];
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) rail.forEach(b => b.setAttribute('aria-current', String(b.dataset.sec === e.target.dataset.sec)));
    }, { rootMargin: '-45% 0px -50% 0px' });
    root.querySelectorAll('.pj-part').forEach(s => io.observe(s));

    // Without WebGL (the static fallback) the window shows the accent's light in place of the world.
    const world = renderer ? createWorld(renderer, entry.name, col.hue, { reduced: reduced() })
      : { seed() {}, frame() {}, dispose() {}, still: true };
    if (!renderer) root.classList.add('pj-noworld');
    const cut = performance.now();
    st = { i, root, world, io, raf: 0, last: 0, cut, frames: 0, panelDone: !vertical(), titleDone: false, fit };
    const warmBody = () => root.classList.remove('pj-cold');
    if (!vertical()) { panel.style.transform = 'none'; q('.pj-mascot')?.classList.add('in'); }
    const onScroll = () => { warmBody(); if (st && !st.raf) wake(); };
    const onResize = () => { st?.fit(); wake(); };
    const onKey = e => { if (e.key === 'Escape' && !e.defaultPrevented) { e.preventDefault(); onBack(); } };
    st.off = () => { removeEventListener('scroll', onScroll); removeEventListener('resize', onResize); removeEventListener('keydown', onKey); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onResize);
    addEventListener('keydown', onKey);
    title.focus({ preventScroll: true });

    // The world shows through its window until the page covers it; off screen, the culture stops.
    const visibleRect = () => {
      const r = win.getBoundingClientRect(), cover = body.getBoundingClientRect().top;
      const top = Math.max(r.top, 0), bottom = Math.min(r.bottom, innerHeight, cover);
      if (bottom - top < 1 || document.hidden || !renderer) return null;
      const pr = renderer.getPixelRatio();
      return [r.left * pr, (innerHeight - r.bottom) * pr, r.width * pr, r.height * pr];
    };
    function frame(now) {
      if (!st || st.world !== world) return;
      st.raf = 0;
      const dt = st.last ? Math.min(0.05, (now - st.last) / 1000) : 1 / 60;
      st.last = now;
      const t = now - st.cut;
      let busy = ++st.frames < 3;
      if (st.frames === 2) warmBody();
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
      if (t >= delay(OPEN.seed)) world.seed();
      const rect = visibleRect();
      if (rect) world.frame(dt, rect);
      else st.last = 0;
      // A still world (reduced motion) draws again only when the page scrolls or resizes.
      if ((rect && !(reduced() && world.still)) || busy) st.raf = requestAnimationFrame(frame);
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
    s.off(); s.io.disconnect();
    s.world.dispose();
    s.root.remove();
    document.documentElement.classList.remove('in-project');
    window.scrollTo(0, 0);
  }

  return {
    open, close,
    // Before the first Open, at idle on the shelf: the stylesheet, and the world's programs (resolves to
    // the warm-up's draw, for the shelf to run in one of its frames).
    warm() {
      loadCss().then(() => document.fonts.load("500 13px 'NJ Page Mono'")).catch(() => {});
      return renderer ? warmWorld(renderer) : Promise.resolve(null);
    },
    get index() { return st ? st.i : -1; },
    get busy() { return !!st?.raf; },
  };
}
