// Downloads the /hi page's font subsets: Inter (Latin script), Noto Sans Thai and Noto Sans Hebrew, each cut by
// Google Fonts to exactly the characters the copy draws in that face (see faceSets in build/hi.mjs). Writes
// vendor/fonts/hi/*.woff2, glyphs.json (the characters each file holds, read back from its cmap) and SOURCE.txt.
//
//   node build/hi-fonts.mjs
//
// Needs the network and no key. Chinese uses the system's CJK face, so no CJK font is fetched.
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import { faceSets } from './hi.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'vendor/fonts/hi');
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const FACES = {
  inter: { file: 'inter-hi.woff2', family: 'Inter', css: 'Inter', budget: 24 * 1024, licence: 'https://github.com/rsms/inter' },
  thai: { file: 'noto-sans-thai-hi.woff2', family: 'Noto Sans Thai', css: 'Noto+Sans+Thai', budget: 14 * 1024, licence: 'https://github.com/notofonts/thai' },
  hebrew: { file: 'noto-sans-hebrew-hi.woff2', family: 'Noto Sans Hebrew', css: 'Noto+Sans+Hebrew', budget: 14 * 1024, licence: 'https://github.com/notofonts/hebrew' },
};

// The code points a WOFF2 file maps to a glyph, from its cmap (formats 4 and 12). cmap is never transformed,
// so it sits in the Brotli stream at the sum of the lengths of the tables before it.
function cmapCodePoints(buf) {
  if (buf.toString('latin1', 0, 4) !== 'wOF2') throw new Error('not a WOFF2 file');
  const numTables = buf.readUInt16BE(12);
  let p = 48;
  const base128 = () => { let v = 0; for (let i = 0; i < 5; i++) { const b = buf[p++]; v = v * 128 + (b & 0x7f); if (!(b & 0x80)) return v; } throw new Error('bad UIntBase128'); };
  const tables = [];
  for (let i = 0; i < numTables; i++) {
    const flags = buf[p++];
    let tag = flags & 0x3f;
    tag = tag === 63 ? buf.toString('latin1', p, (p += 4)) : tag;   // 0 is cmap in the known-tag table
    const origLength = base128();
    const transformed = tag === 10 || tag === 11 || tag === 'glyf' || tag === 'loca' ? (flags >> 6) === 0 : (flags >> 6) !== 0;
    tables.push({ tag, length: transformed ? base128() : origLength });
  }
  const data = zlib.brotliDecompressSync(buf.subarray(p));
  let off = 0, cmap = null;
  for (const t of tables) { if (t.tag === 0 || t.tag === 'cmap') { cmap = data.subarray(off, off + t.length); break; } off += t.length; }
  if (!cmap) throw new Error('no cmap table');
  const out = new Set();
  const n = cmap.readUInt16BE(2);
  for (let i = 0; i < n; i++) {
    const o = cmap.readUInt32BE(4 + i * 8 + 4);
    const fmt = cmap.readUInt16BE(o);
    if (fmt === 12) {
      const groups = cmap.readUInt32BE(o + 12);
      for (let g = 0; g < groups; g++) {
        const [s, e, gid] = [0, 4, 8].map((d) => cmap.readUInt32BE(o + 16 + g * 12 + d));
        for (let c = s; c <= e; c++) if (gid + (c - s) !== 0) out.add(c);
      }
    } else if (fmt === 4) {
      const segs = cmap.readUInt16BE(o + 6) / 2;
      const endAt = o + 14, startAt = endAt + segs * 2 + 2, deltaAt = startAt + segs * 2, rangeAt = deltaAt + segs * 2;
      for (let s = 0; s < segs; s++) {
        const end = cmap.readUInt16BE(endAt + s * 2), start = cmap.readUInt16BE(startAt + s * 2);
        const delta = cmap.readUInt16BE(deltaAt + s * 2), range = cmap.readUInt16BE(rangeAt + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let gid = range === 0 ? c : cmap.readUInt16BE(rangeAt + s * 2 + range + (c - start) * 2);
          if (range !== 0 && gid !== 0) gid += delta;
          if ((gid & 0xffff) !== 0) out.add(c);
        }
      }
    }
  }
  return out;
}

const fetchOk = async (url, init) => {
  const r = await fetch(url, init);
  if (!r.ok) throw new Error(`${url}: HTTP ${r.status}`);
  return r;
};

async function main() {
  const copy = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/copy.json'), 'utf8'));
  const contact = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/contact.json'), 'utf8'));
  const sets = faceSets(copy, contact);
  fs.mkdirSync(OUT, { recursive: true });
  const glyphs = {}, notes = [];
  let over = false;
  const date = new Date().toISOString().slice(0, 10);
  for (const [face, spec] of Object.entries(FACES)) {
    const text = sets[face];
    if (!text) { glyphs[face] = ''; console.log(`${face}: no characters, no file`); fs.rmSync(path.join(OUT, spec.file), { force: true }); continue; }
    const request = `https://fonts.googleapis.com/css2?family=${spec.css}:wght@400..500&text=${encodeURIComponent(text)}`;
    const css = await (await fetchOk(request, { headers: { 'user-agent': UA } })).text();
    const urls = [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]);
    if (urls.length !== 1) throw new Error(`${face}: expected one url() in the css answer, got ${urls.length}`);
    const bytes = Buffer.from(await (await fetchOk(urls[0])).arrayBuffer());
    fs.writeFileSync(path.join(OUT, spec.file), bytes);
    const held = cmapCodePoints(bytes);
    glyphs[face] = [...text].filter((ch) => held.has(ch.codePointAt(0))).join('');
    const lacking = [...text].filter((ch) => !held.has(ch.codePointAt(0)));
    const sha = crypto.createHash('sha256').update(bytes).digest('hex');
    const ok = bytes.length <= spec.budget;
    over ||= !ok;
    console.log(`${face}: ${[...text].length} characters, ${bytes.length} bytes (budget ${spec.budget})${ok ? '' : ' OVER BUDGET'}${lacking.length ? `; the font lacks ${JSON.stringify(lacking.join(''))}` : ''}`);
    const version = (urls[0].match(/[?&]v=(v\d+)/) || [])[1];
    notes.push([
      spec.file,
      `  ${spec.family}, wght 400..500 (variable)${version ? `, gstatic ${version}` : ''}, downloaded ${date}`,
      `  glyphs (${[...text].length}): ${JSON.stringify(text)}`,
      `  request: ${request}`,
      `  ${bytes.length} bytes, sha256 ${sha}`,
      `  Licence: OFL-1.1 (${spec.licence})`,
    ].join('\n'));
  }
  fs.writeFileSync(path.join(OUT, 'glyphs.json'), JSON.stringify(glyphs, null, 2) + '\n');
  fs.writeFileSync(path.join(OUT, 'SOURCE.txt'), [
    'Self-hosted font subsets for njct.io/hi. All are SIL Open Font License 1.1 (https://openfontlicense.org).',
    'Each file is a Google Fonts text= subset holding the characters content/copy.json draws in that face; glyphs.json',
    'lists what each file holds, read from its cmap. Regenerate with `node build/hi-fonts.mjs` whenever the copy,',
    'the contact details or the header wordmark change; `npm run check:hi` fails while a character is missing.',
    'Chinese uses the system CJK face, so no CJK font is downloaded.',
    '', ...notes.flatMap((n) => [n, '']),
  ].join('\n'));
  if (over) { console.error('a subset is over its budget'); process.exit(1); }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
