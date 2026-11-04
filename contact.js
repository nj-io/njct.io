// Get in touch: a contact form in a modal that grows out of the pill that opened it and shrinks back into it.
// Every "Get in touch" link (the shelf header, project pages) opens it; the link's mailto stays the fallback
// when scripts don't run. Send posts to the njct-contact Worker (/api/contact); when it is down or refuses,
// the panel offers the mailto compose instead. The hidden `website` field is the Worker's honeypot.
import { CONTACT } from './scene/config.js';

const ENDPOINT = '/api/contact';
const MAILTO = CONTACT;

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const EASE = 'cubic-bezier(0.3, 0, 0.15, 1)';

let dlg, panel, form, note, send, from = null, timer = null;

const compose = (d) =>
  `${MAILTO}?subject=${encodeURIComponent(`Hello from ${d.get('name')}`)}&body=${encodeURIComponent(`${d.get('message')}\n\n${d.get('name')} <${d.get('email')}>`)}`;

function build() {
  dlg = document.createElement('dialog');
  dlg.className = 'ct';
  dlg.setAttribute('aria-labelledby', 'ct-title');
  dlg.innerHTML = `
    <div class="ct-panel">
      <div class="ct-body">
        <h2 id="ct-title" class="ct-title">Get in touch</h2>
        <form class="ct-form" novalidate>
          <label>Name<input name="name" autocomplete="name" required></label>
          <label>Email<input name="email" type="email" autocomplete="email" required></label>
          <label>Message<textarea name="message" rows="5" required></textarea></label>
          <input class="ct-web" name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button class="ct-send" type="submit">Send</button>
        </form>
        <p class="ct-note" role="status"></p>
        <button class="ct-close" type="button" aria-label="Close">&#x2715;</button>
      </div>
    </div>`;
  document.body.append(dlg);
  panel = dlg.querySelector('.ct-panel');
  form = dlg.querySelector('form');
  note = dlg.querySelector('.ct-note');
  send = form.querySelector('.ct-send');
  dlg.addEventListener('cancel', e => { e.preventDefault(); close(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) close(); });
  dlg.querySelector('.ct-close').addEventListener('click', () => close());
  form.addEventListener('submit', onSubmit);
}

async function onSubmit(e) {
  e.preventDefault();
  if (!form.reportValidity() || send.disabled) return;
  const d = new FormData(form);
  send.disabled = true;
  send.textContent = 'Sending…';
  note.className = 'ct-note';
  note.textContent = '';
  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: d.get('name'), email: d.get('email'), message: d.get('message'),
        website: d.get('website'), page: location.pathname + location.hash,
      }),
    });
    if (!r.ok) throw new Error(String(r.status));
    form.hidden = true;
    note.className = 'ct-note sent';
    note.textContent = 'Message sent.';
    timer = setTimeout(close, 2000);
  } catch {
    note.className = 'ct-note error';
    note.textContent = 'That didn’t send. Email me directly instead: ';
    const a = document.createElement('a');
    a.href = compose(d);
    a.textContent = 'neil@njct.io';
    note.append(a);
  } finally {
    send.disabled = false;
    send.textContent = 'Send';
  }
}

const box = r => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
function target() {
  const w = Math.min(480, innerWidth - 32);
  panel.style.width = `${w}px`; panel.style.height = 'auto';
  const h = Math.min(panel.scrollHeight, innerHeight - 32);
  return { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2, width: w, height: h };
}

function open(pill) {
  if (!dlg) build();
  if (dlg.open) return;
  from = pill;
  dlg.showModal();
  pill.style.visibility = 'hidden';   // the pill becomes the panel
  const r = pill.getBoundingClientRect(), to = target();
  Object.assign(panel.style, box(to));
  const ms = reduced() ? 0 : 520;
  panel.animate([
    { ...box(r), borderRadius: `${r.height / 2}px`, background: '#000' },
    { ...box(to), borderRadius: '16px', background: '#fff' },
  ], { duration: ms, easing: EASE });
  dlg.animate([{ backgroundColor: 'rgba(0,0,0,0)' }, { backgroundColor: 'rgba(0,0,0,0.45)' }], { duration: ms, fill: 'forwards' });
  dlg.querySelector('.ct-body').animate([{ opacity: 0 }, { opacity: 1 }], { duration: ms * 0.5, delay: ms * 0.5, fill: 'backwards' });
  form.elements.name.focus({ preventScroll: true });
}

function close() {
  if (!dlg?.open) return;
  const r = from?.isConnected ? from.getBoundingClientRect() : null, ms = reduced() || !r ? 0 : 420;
  const now = panel.getBoundingClientRect();
  dlg.querySelector('.ct-body').animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms * 0.4, fill: 'forwards' });
  dlg.animate([{ backgroundColor: 'rgba(0,0,0,0.45)' }, { backgroundColor: 'rgba(0,0,0,0)' }], { duration: ms, fill: 'forwards' });
  const a = r ? panel.animate([
    { ...box(now), borderRadius: '16px', background: '#fff' },
    { ...box(r), borderRadius: `${r.height / 2}px`, background: '#000' },
  ], { duration: ms, easing: EASE, fill: 'forwards' }) : null;
  const done = () => {
    clearTimeout(timer);
    for (const el of [panel, dlg, dlg.querySelector('.ct-body')]) for (const x of el.getAnimations()) x.cancel();
    dlg.close();
    form.hidden = false;                       // restore for the next open
    note.className = 'ct-note';
    note.textContent = '';
    send.disabled = false;
    send.textContent = 'Send';
    if (from) from.style.visibility = '';
    from?.focus({ preventScroll: true });
  };
  a ? a.finished.then(done, done) : done();
}

let started = false;
export function start() {
  if (started) return;
  started = true;
  document.addEventListener('click', e => {
    const a = e.target.closest?.(`a[href="${CONTACT}"]`);
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    open(a);
  });
}
