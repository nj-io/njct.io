// The shelf's bundle: editions/main.js, menu.js and fallback.js with three.js tree-shaken in, as ES modules
// with code splitting, so every module the page loads on demand (the covers, the project page and its
// world, the sound) stays a lazy chunk. Output: editions/dist/, committed, because Pages deploys the repo
// as it stands; editions/index.html loads it and preloads the first view's chunks (the block between the
// bundle markers, written here). The source modules stay the source of truth: editions/?src runs them.
//
//   node build/bundle.mjs           rebuild editions/dist/ and the preload block
//   node build/bundle.mjs --check   exit 1 if the committed output differs from a fresh build
//
// Every source module is moved into editions/dist/ by the bundle, so its import.meta.url is rewritten to
// the module's own address (relative to the chunk), and every URL it builds resolves as in the source.
import * as esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'editions');
const OUT = path.join(SRC, 'dist');
const HTML = path.join(SRC, 'index.html');
const THREE = path.join(ROOT, 'vendor/three-0.181.0/three.module.min.js');
const ENTRIES = ['main.js', 'menu.js', 'fallback.js'];
const FIRST_VIEW = ['main.js', 'menu.js'];   // the entries a WebGL first view runs; their static imports are preloaded
const MARK = ['// bundle: first-view chunks, written by build/bundle.mjs', '// /bundle'];
const check = process.argv.includes('--check');

const site = {
  name: 'site',
  setup(b) {
    // 'three' as the import map names it; site-absolute paths (/vendor/...) from the repo root.
    b.onResolve({ filter: /^three$/ }, () => ({ path: THREE }));
    b.onResolve({ filter: /^\/(vendor|editions)\// }, a => ({ path: path.join(ROOT, a.path) }));
    b.onLoad({ filter: /\.js$/ }, async a => {
      let code = await fs.promises.readFile(a.path, 'utf8');
      if (a.path.startsWith(SRC + path.sep) && code.includes('import.meta.url')) {
        const rel = path.relative(OUT, a.path).split(path.sep).join('/');
        code = code.replaceAll('import.meta.url', `new URL(${JSON.stringify(rel)}, import.meta.url).href`);
      }
      return { contents: code, loader: 'js' };
    });
  },
};

const result = await esbuild.build({
  absWorkingDir: ROOT,
  entryPoints: ENTRIES.map(e => path.join(SRC, e)),
  bundle: true, splitting: true, format: 'esm', target: 'es2022', minify: true,
  outdir: OUT, entryNames: '[name]', chunkNames: '[name]-[hash]',
  metafile: true, write: false, logLevel: 'warning', plugins: [site],
});

// The first view's chunks: the first-view entries and every chunk they import statically, in load order.
const outs = result.metafile.outputs, key = f => path.relative(ROOT, path.join(OUT, f)).split(path.sep).join('/');
const first = [];
const walk = k => {
  if (first.includes(k)) return;
  first.push(k);
  for (const i of outs[k].imports) if (i.kind === 'import-statement') walk(i.path);
};
for (const e of FIRST_VIEW) walk(key(e));
const preload = `    const first = ${JSON.stringify(first.map(k => `/${k}`))};`;
const html = fs.readFileSync(HTML, 'utf8');
const [a, b] = [html.indexOf(MARK[0]), html.indexOf(MARK[1])];
if (a < 0 || b < a) { console.error(`editions/index.html: the bundle markers are missing`); process.exit(2); }
const newHtml = `${html.slice(0, a + MARK[0].length)}\n${preload}\n    ${html.slice(b)}`;

const files = new Map(result.outputFiles.map(f => [path.relative(OUT, f.path).split(path.sep).join('/'), Buffer.from(f.contents)]));
if (check) {
  const onDisk = fs.existsSync(OUT) ? fs.readdirSync(OUT) : [];
  const diff = [...new Set([...onDisk, ...files.keys()])].filter(f => !files.has(f) || !onDisk.includes(f) || !files.get(f).equals(fs.readFileSync(path.join(OUT, f))));
  if (newHtml !== html) diff.push('../index.html (preload block)');
  if (diff.length) { console.error(`editions/dist/ differs from a fresh build (run node build/bundle.mjs):\n  ${diff.join('\n  ')}`); process.exit(1); }
  console.log(`editions/dist/ matches a fresh build (${files.size} files)`);
} else {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const [f, buf] of files) fs.writeFileSync(path.join(OUT, f), buf);
  if (newHtml !== html) fs.writeFileSync(HTML, newHtml);
  const kb = n => (n / 1024).toFixed(1).padStart(7);
  console.log('chunk                              raw KB  gzip KB  brotli KB  first view');
  for (const [f, buf] of [...files].sort((x, y) => y[1].length - x[1].length)) {
    const gz = zlib.gzipSync(buf, { level: 9 }).length, br = zlib.brotliCompressSync(buf, { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } }).length;
    console.log(`${f.padEnd(32)} ${kb(buf.length)}  ${kb(gz)}    ${kb(br)}  ${first.includes(key(f)) ? 'yes' : ''}`);
  }
}
