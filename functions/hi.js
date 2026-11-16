// /hi (and /hi/): the static page (hi.html) with the visitor's country in <html data-cc>, which orders the
// contact pills for an English-language visitor. The response differs per visitor, so no shared cache keeps it
// and it is never answered with a 304 from the asset's validators (that would return a page written for
// another country). Any answer from the asset layer that is not a 200 HTML page (the 308 for /hi/) passes as is.
export async function onRequestGet({ request, env }) {
  try {
    const headers = new Headers(request.headers);
    headers.delete('if-none-match');
    headers.delete('if-modified-since');
    const res = await env.ASSETS.fetch(new Request(request, { headers }));
    if (res.status !== 200 || !(res.headers.get('content-type') || '').startsWith('text/html')) return res;
    const out = new Response(res.body, res);
    out.headers.set('cache-control', 'private, no-cache');
    out.headers.delete('etag');
    out.headers.delete('last-modified');
    const c = String(request.cf?.country || '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(c) || c === 'XX') return out;
    return new HTMLRewriter().on('html', { element(e) { e.setAttribute('data-cc', c); } }).transform(out);
  } catch {
    return env.ASSETS.fetch(request);
  }
}

// HEAD gets the same headers as GET (Pages would otherwise answer it from the asset layer, public and revalidated).
export const onRequestHead = onRequestGet;
