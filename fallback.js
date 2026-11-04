// The shelf without WebGL: when WebGL 2 is missing, or the context is lost, the sleeves become a styled
// list of cards (cover colour and title, name, tag, figures, Open) and the project pages open as usual,
// with the accent's light in the world's window. Hash routes, Back and Escape work as on the shelf.
import { slugOf } from './scene/config.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

let started = false;
export async function start(entries) {
  if (started) return;
  started = true;
  document.documentElement.classList.add('no-gl');
  entries = entries || await fetch(new URL('./data/projects.json', import.meta.url)).then(r => r.json());
  const { createProjectView, colours } = await import('./project/project.js');

  const main = document.createElement('main');
  main.className = 'fb';
  main.innerHTML = `<ul class="fb-shelf" aria-label="Projects">${entries.map((e, i) => {
    const c = colours(e);
    const figs = (e.figs || []).map(([v, k]) => `<li><b>${esc(v)}</b> ${esc(k)}</li>`).join('');
    return `<li class="fb-item"><article aria-labelledby="fb-${i}">
      <a class="fb-cover" href="#${slugOf(e)}" tabindex="-1" aria-hidden="true" style="--c:${c.panel};--f:rgb(${c.fg})"><span>${esc(e.kind === 'about' ? 'Neil' : e.name)}</span></a>
      <h2 id="fb-${i}">${esc(e.name)}</h2>
      ${e.tag ? `<p class="fb-tag">${esc(e.tag)}${e.year ? `, ${esc(e.year)}` : ''}</p>` : ''}
      ${figs ? `<ul class="fb-figs">${figs}</ul>` : ''}
      <a class="fb-open" href="#${slugOf(e)}" aria-label="Open: ${esc(e.name)}">Open</a>
    </article></li>`;
  }).join('')}</ul>`;
  document.body.append(main);

  let opened = false;
  const view = createProjectView({
    renderer: null, entries, slugOf,
    onBack: () => { if (opened) { opened = false; history.back(); } else { history.pushState(null, '', location.pathname + location.search); route(); } },
  });
  let shown = -1;
  async function route() {
    const i = entries.findIndex(e => slugOf(e) === decodeURIComponent(location.hash.slice(1)));
    if (i === shown) return;
    if (i >= 0) { shown = i; main.hidden = true; await view.open(i); }
    else if (shown >= 0) {
      const i0 = shown;
      shown = -1; view.close(); main.hidden = false;
      main.querySelectorAll('.fb-open')[i0]?.focus({ preventScroll: false });
    }
  }
  main.addEventListener('click', e => { if (e.target.closest('.fb-open, .fb-cover')) opened = true; });
  addEventListener('hashchange', route);
  route();
}
