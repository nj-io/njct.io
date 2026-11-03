// The header's Projects menu, as the reference's Editions menu: a trigger beside the wordmark opens a
// panel listing every project in shelf order (its mark, name and tag); choosing one opens its page through
// the hash route. A dropdown under the trigger on wider screens, a sheet from the bottom on a phone. It
// closes on Escape (focus back on the trigger), on a press outside, when focus leaves it and when a page
// opens; arrow keys, Home and End move between the items. Works on the shelf and the no-WebGL shelf alike.
import { LINEUP, slugOf } from './scene/config.js';

const GAP = 40;   // the trigger's left edge, after the wordmark's right edge (the reference's 40 px)
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const iconSrc = logo => (logo?.svg ? `data:image/svg+xml,${encodeURIComponent(logo.svg)}` : logo?.png || null);
// The line under a name: the project's tag; About Neil, its heading.
const subOf = e => (e.kind === 'about' ? e.about?.[0] || '' : e.tag || '');

export function start(entries = LINEUP) {
  const nav = document.querySelector('.pm');
  if (!nav || nav.dataset.ready) return;
  nav.dataset.ready = '1';
  const btn = nav.querySelector('.pm-btn'), list = nav.querySelector('.pm-list');
  const wordmark = document.querySelector('.wordmark');

  list.innerHTML = entries.map(e => {
    const src = iconSrc(e.logo);
    const icon = src ? `<img src="${esc(src)}" width="24" height="24" alt="" decoding="async">` : '';
    const sub = subOf(e);
    return `<li><a class="pm-item" href="#${slugOf(e)}"><span class="pm-icon" aria-hidden="true" data-name="${esc(e.name)}">${icon}</span>`
      + `<span class="pm-text"><span class="pm-name">${esc(e.name)}</span>${sub ? `<span class="pm-sub">${esc(sub)}</span>` : ''}</span></a></li>`;
  }).join('');
  const items = [...list.querySelectorAll('.pm-item')];
  // A project without a mark shows a tile in its page's colour (project.js), once that module is in.
  const tiles = [...list.querySelectorAll('.pm-icon:empty')];
  if (tiles.length) {
    const idle = window.requestIdleCallback || (f => setTimeout(f, 300));
    idle(() => import('./project/project.js').then(m => {
      for (const t of tiles) { const e = entries.find(x => x.name === t.dataset.name); if (e) t.style.background = m.colours(e).panel; }
    }).catch(() => {}), { timeout: 3000 });
  }

  const place = () => { nav.style.left = `${Math.round(wordmark.getBoundingClientRect().right + GAP)}px`; };
  place();
  document.fonts?.ready.then(place);
  addEventListener('resize', place);

  let open = false;
  function set(on, { focus = false } = {}) {
    if (on === open) return;
    open = on;
    nav.classList.toggle('open', on);
    btn.setAttribute('aria-expanded', String(on));
    list.inert = !on;
    if (!on && focus) btn.focus({ preventScroll: true });
  }
  list.inert = true;
  btn.addEventListener('click', () => set(!open));
  const move = (to) => { items[(to + items.length) % items.length].focus({ preventScroll: true }); };
  // Keys inside the menu stay in it: the shelf's own arrow and Escape keys never see them.
  nav.addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const at = items.indexOf(document.activeElement);
    let handled = true;
    if (e.key === 'ArrowDown') { if (!open) set(true); move(at + 1); }
    else if (e.key === 'ArrowUp') { if (!open) set(true); move(at < 0 ? -1 : at - 1); }
    else if (e.key === 'Home' && open) move(0);
    else if (e.key === 'End' && open) move(-1);
    else if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') handled = false;   // left and right do nothing here
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  });
  // Escape closes it wherever the focus is, before the shelf's own Escape (Details) sees the key.
  addEventListener('keydown', e => { if (open && e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); set(false, { focus: true }); } }, true);
  document.addEventListener('pointerdown', e => { if (open && !nav.contains(e.target)) set(false); }, true);
  nav.addEventListener('focusout', e => { if (open && e.relatedTarget && !nav.contains(e.relatedTarget)) set(false); });
  list.addEventListener('click', e => { if (e.target.closest('.pm-item')) set(false); });
  addEventListener('hashchange', () => set(false));
}
