// /hi/<file>: the static files, unchanged, except the v2 loop videos (/hi/loop.<hash>.mp4|webm), which get byte
// ranges. Pages answers a Range request for a static asset with the whole file (200), and Safari (iOS and macOS)
// will not play a <video> whose server does not answer ranges with 206. The video is fetched whole from the asset
// layer (about 1.4 MB) and the asked-for slice returned; the response keeps the asset's type and cache headers.
export async function onRequest({ request, env, params }) {
  const res = await env.ASSETS.fetch(request);
  if (!/^loop\.[0-9a-f]{8}\.(mp4|webm)$/.test(String(params.file)) || res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set('accept-ranges', 'bytes');
  headers.delete('content-encoding');
  const range = request.headers.get('range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!m || (m[1] === '' && m[2] === '')) {
    if (request.method === 'HEAD') return new Response(null, { status: 200, headers });
    return new Response(res.body, { status: 200, headers });
  }
  const buf = await res.arrayBuffer();
  const size = buf.byteLength;
  let start, end;
  if (m[1] === '') { start = Math.max(0, size - Number(m[2])); end = size - 1; }      // bytes=-N: the last N bytes
  else { start = Number(m[1]); end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1); }
  if (start >= size || start > end) {
    headers.set('content-range', `bytes */${size}`);
    return new Response(null, { status: 416, headers });
  }
  headers.set('content-range', `bytes ${start}-${end}/${size}`);
  headers.set('content-length', String(end - start + 1));
  return new Response(request.method === 'HEAD' ? null : buf.slice(start, end + 1), { status: 206, headers });
}
