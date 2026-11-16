// The /hi page's build: writes the generated regions of hi.html and hi/neil.vcf from content/copy.json,
// content/contact.json, hi/plates.json and hi/locale.mjs, and holds the two gates a release depends on.
//
//   node build/hi.mjs                    write the regions and the vCard
//   node build/hi.mjs --check            exit 1 if anything on disk differs from a fresh build
//   node build/hi.mjs --check --release  also exit 1 on any pending string or [[ placeholder
//   node build/hi.mjs --root <dir> ...   run against another tree (the tests' fixtures)
//
// hi.html outside its marked regions (the analytics tag region included) is left as it is.
// Exit codes: 0 ok, 1 gate or difference, 2 a file or region is missing.
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FACES = ['inter', 'thai', 'hebrew'];
const WORDMARK = 'njct.io';   // drawn in Inter by the header, outside the copy
const HREFS = ['linkedin', 'whatsapp', 'line', 'wechat', 'vcf'];

// ---- glyph faces (T2) ---------------------------------------------------------------------------------

const inRanges = (cp, ranges) => ranges.some(([a, b]) => cp >= a && cp <= b);
const THAI = [[0x0e00, 0x0e7f]];
const HEBREW = [[0x0590, 0x05ff], [0xfb1d, 0xfb4f]];
// CJK ideographs, kana, bopomofo, CJK and fullwidth punctuation: drawn by the system's CJK face, never subset.
const CJK = [[0x2e80, 0x2fff], [0x3000, 0x31ff], [0x3400, 0x4dbf], [0x4e00, 0x9fff], [0xf900, 0xfaff], [0xfe30, 0xfe4f], [0xff00, 0xffef]];

// The subset face that must hold a character, or null for the system's CJK face. Everything else (Latin
// letters, digits, punctuation, the space) sits first in every font stack, so it is Inter's.
export function faceOf(ch) {
  const cp = ch.codePointAt(0);
  if (inRanges(cp, CJK)) return null;
  if (inRanges(cp, THAI)) return 'thai';
  if (inRanges(cp, HEBREW)) return 'hebrew';
  return 'inter';
}

// Every character the page draws in a subset face, as {face, ch, key, locale}: all copy in every locale, the
// header's wordmark and the WeChat ID once Neil has given it.
export function drawnChars(copy, contact) {
  const out = [];
  const add = (text, key, locale) => { for (const ch of text) { const face = faceOf(ch); if (face) out.push({ face, ch, key, locale }); } };
  for (const [locale, strings] of Object.entries(copy.copy)) for (const [key, text] of Object.entries(strings)) add(text, key, locale);
  add(WORDMARK, '(wordmark)', '-');
  if (contact.wechat_id && !contact.wechat_id.includes('[[')) add(contact.wechat_id, '(contact.json wechat_id)', '-');
  return out;
}

// The sorted unique characters each face needs, as strings.
export function faceSets(copy, contact) {
  const sets = Object.fromEntries(FACES.map((f) => [f, new Set()]));
  for (const { face, ch } of drawnChars(copy, contact)) sets[face].add(ch);
  return Object.fromEntries(FACES.map((f) => [f, [...sets[f]].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('')]));
}

function glyphErrors(copy, contact, glyphs) {
  const have = Object.fromEntries(FACES.map((f) => [f, new Set(glyphs[f] || '')]));
  const seen = new Map();
  for (const { face, ch, key, locale } of drawnChars(copy, contact)) {
    if (have[face].has(ch)) continue;
    const id = `${face}:${ch}`;
    if (!seen.has(id)) seen.set(id, { face, ch, key, locale, more: 0 });
    else seen.get(id).more++;
  }
  return [...seen.values()].map(({ face, ch, key, locale, more }) => {
    const cp = 'U+' + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
    return `glyph missing: ${cp} '${ch}' (${face}) in ${key} [${locale}]${more ? ` and ${more} more` : ''}`;
  });
}

// ---- the copy file (T1) -------------------------------------------------------------------------------

const APPROVED = /^approved \d{4}-\d{2}-\d{2}\b/;

// Every (key, locale) of `copy`, with its status: 'pending' | 'approved' | null (missing or malformed).
function entries(copy) {
  const out = [];
  for (const [locale, strings] of Object.entries(copy.copy)) {
    for (const key of Object.keys(strings)) {
      const s = copy.status?.[key]?.[locale];
      out.push({ key, locale, state: s === 'pending' ? 'pending' : APPROVED.test(s || '') ? 'approved' : null, raw: s });
    }
  }
  return out;
}

function structureErrors(copy) {
  const errors = [];
  for (const e of entries(copy)) {
    if (e.raw === undefined) errors.push(`copy: no status for ${e.key} [${e.locale}]`);
    else if (!e.state) errors.push(`copy: status of ${e.key} [${e.locale}] is neither 'pending' nor 'approved <date>': ${JSON.stringify(e.raw)}`);
  }
  for (const [key, byLocale] of Object.entries(copy.status || {})) {
    for (const locale of Object.keys(byLocale)) if (copy.copy[locale]?.[key] === undefined) errors.push(`copy: status for ${key} [${locale}] has no string`);
  }
  // a key written in English only is English on every page; any other key has every locale
  const keys = new Set(Object.values(copy.copy).flatMap((s) => Object.keys(s)));
  for (const key of keys) {
    const has = copy.locales.filter((l) => copy.copy[l]?.[key] !== undefined);
    if (has.length > 1 || (has.length === 1 && has[0] !== copy.default_locale)) {
      for (const l of copy.locales) if (!has.includes(l)) errors.push(`copy: ${key} has no [${l}] string`);
    }
  }
  for (const l of Object.keys(copy.copy)) if (!copy.locales.includes(l)) errors.push(`copy: locale ${l} is not in "locales"`);
  return errors;
}

function releaseErrors(copy, contact, vcf) {
  const errors = [];
  for (const e of entries(copy)) {
    if (e.state !== 'approved') errors.push(`release gate: pending: ${e.key} [${e.locale}]`);
    const m = copy.copy[e.locale][e.key].match(/\[\[[^\]]*\]\]/g);
    if (m) errors.push(`release gate: placeholder in copy ${e.key} [${e.locale}]: ${m.join(' ')}`);
  }
  for (const [k, v] of Object.entries(contact)) {
    const m = String(v).match(/\[\[[^\]]*\]\]/g);
    if (m) errors.push(`release gate: placeholder in contact.json ${k}: ${m.join(' ')}`);
  }
  const m = vcf.match(/\[\[[^\]]*\]\]/g);
  if (m) errors.push(`release gate: placeholder in vCard: ${[...new Set(m)].join(' ')}`);
  return errors;
}

// ---- the vCard (§ 5) ----------------------------------------------------------------------------------

const esc = (v) => String(v).replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
// A content line folded at 75 octets: the continuation lines start with a space, which counts toward the 75.
function fold(line) {
  const out = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > 75) { out.push(cur); cur = ' '; bytes = 1; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join('\r\n');
}
const waDigits = (c) => String(c.whatsapp).replace(/[\s+()-]/g, '');

export function buildVcard(copy, contact) {
  const c = contact;
  const note = copy.copy[copy.default_locale]?.hi_vcard_note;
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${esc(c.family_name)};${esc(c.given_name)};;;`,
    `FN:${esc(`${c.given_name} ${c.family_name}`.trim())}`,
    c.org && `ORG:${esc(c.org)}`,
    c.title && `TITLE:${esc(c.title)}`,
    c.whatsapp && `TEL;TYPE=CELL:+${esc(waDigits(c))}`,
    c.email && `EMAIL;TYPE=INTERNET:${esc(c.email)}`,
    c.web && `URL:${esc(c.web)}`,
    c.linkedin && `item1.URL:${esc(c.linkedin)}`,
    c.linkedin && 'item1.X-ABLabel:LinkedIn',
    c.linkedin && `X-SOCIALPROFILE;TYPE=linkedin:${esc(c.linkedin)}`,
    note && `NOTE:${esc(note)}`,
    'END:VCARD',
  ].filter(Boolean);
  return lines.map(fold).join('\r\n') + '\r\n';
}

// ---- the page ----------------------------------------------------------------------------------------

const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');
const jsonInScript = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

class MissingError extends Error {}

function region(html, name, inner) {
  const re = new RegExp(`(/\\* ${name}:[^*]*\\*/|<!-- ${name}:[^>]*-->)[\\s\\S]*?\\n([ \\t]*)(/\\* /${name} \\*/|<!-- /${name} -->)`);
  if (!re.test(html)) throw new MissingError(`hi.html: the '${name}' region is missing`);
  return html.replace(re, (_, a, indent, b) => `${a}\n${inner}\n${indent}${b}`);
}

function links(copy, contact) {
  const en = copy.copy[copy.default_locale];
  const wa = `https://wa.me/${waDigits(contact)}`;
  return {
    linkedin: contact.linkedin,
    whatsapp: en.hi_wa_text ? `${wa}?text=${encodeURIComponent(en.hi_wa_text)}` : wa,
    line: contact.line,
    wechat: '/hi/wechat-qr.png?v=2041bc09',
    vcf: '/hi/neil.vcf',
  };
}

function headRegion(copy, plates) {
  const en = copy.copy[copy.default_locale];
  const { p, l, og } = plates;
  const pre = (pl, media) => `<link rel="preload" as="image" href="${escAttr(pl.avif)}" type="image/avif" media="(orientation: ${media})" fetchpriority="high">`;
  return [
    `<title>${escText(en.hi_title)}</title>`,
    `<meta name="description" content="${escAttr(en.hi_description)}">`,
    `<meta property="og:title" content="${escAttr(en.hi_title)}">`,
    `<meta property="og:description" content="${escAttr(en.hi_description)}">`,
    '<meta property="og:url" content="https://njct.io/hi">',
    `<meta property="og:image" content="${escAttr('https://njct.io' + og)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="theme-color" content="${escAttr(p.top)}">`,
    `<style>html { background: ${p.bottom}; } @media (orientation: landscape) { html { background: ${l.bottom}; } }</style>`,
    pre(p, 'portrait'),
    pre(l, 'landscape'),
  ].join('\n');
}

function pictureRegion({ p, l }) {
  const src = (pl, type, media) => `    <source${media ? ' media="(orientation: landscape)"' : ''}${type ? ` type="image/${type}"` : ''} srcset="${escAttr(pl[type || 'jpg'])}">`;
  return [
    '  <picture>',
    src(l, 'avif', true), src(l, 'webp', true), src(l, null, true),
    src(p, 'avif'), src(p, 'webp'),
    `    <img src="${escAttr(p.jpg)}" alt="" width="${p.w}" height="${p.h}" fetchpriority="high">`,
    '  </picture>',
  ].join('\n');
}

function buildHtml(html, root, copy, contact, plates) {
  const en = copy.copy[copy.default_locale];
  const locale = fs.readFileSync(path.join(root, 'hi/locale.mjs'), 'utf8').replace(/^export /gm, '').trimEnd();
  const plate = (pl) => ({ w: pl.w, h: pl.h, sun: pl.sun, shade: pl.shade, leaves: pl.leaves });
  const href = links(copy, contact);
  const contactJs = `const CONTACT = ${jsonInScript({ linkedin: href.linkedin, whatsapp: `https://wa.me/${waDigits(contact)}`, line: href.line, wechat: href.wechat, vcf: href.vcf, wechat_id: contact.wechat_id })};`;
  html = region(html, 'locale', locale);
  html = region(html, 'copy', `const COPY = ${jsonInScript(copy.copy)};`);
  html = region(html, 'plates', `const PLATES = ${jsonInScript({ p: plate(plates.p), l: plate(plates.l) })};`);
  html = region(html, 'contact', contactJs);
  html = region(html, 'head', headRegion(copy, plates));
  html = region(html, 'picture', pictureRegion(plates));
  html = html.replace(/(<([a-zA-Z][\w-]*)\b[^<>]*\bdata-stet="([^"]+)"[^<>]*>)([^<]*)(<\/\2>)/g, (_, open, _tag, key, _old, close) => {
    if (en[key] === undefined) throw new MissingError(`hi.html: data-stet="${key}" has no English string in content/copy.json`);
    return `${open}${escText(en[key])}${close}`;
  });
  html = html.replace(/<a\b[^<>]*\bdata-href="([^"]*)"[^<>]*>/g, (tag, name) => {
    if (!HREFS.includes(name)) throw new MissingError(`hi.html: data-href="${name}" is not one of ${HREFS.join(', ')}`);
    return tag.replace(/\shref="[^"]*"/, '').replace(/^<a/, `<a href="${escAttr(href[name])}"`);
  });
  return html;
}

// ---- main ----------------------------------------------------------------------------------------------

function main() {
  const argv = process.argv.slice(2);
  const flag = (f) => argv.includes(f);
  const ri = argv.indexOf('--root');
  const root = ri >= 0 ? path.resolve(argv[ri + 1]) : ROOT;
  const read = (rel) => {
    try { return fs.readFileSync(path.join(root, rel), 'utf8'); }
    catch { console.error(`${rel}: not found`); process.exit(2); }
  };
  const copy = JSON.parse(read('content/copy.json'));
  const contact = JSON.parse(read('content/contact.json'));
  const vcf = buildVcard(copy, contact);

  const all = entries(copy);
  const pending = all.filter((e) => e.state !== 'approved').length;
  console.log(`pending strings: ${pending} of ${all.length}`);

  const errors = structureErrors(copy);
  if (!fs.existsSync(path.join(root, 'vendor/fonts/hi/glyphs.json'))) errors.push('vendor/fonts/hi/glyphs.json: not found (run node build/hi-fonts.mjs)');
  else errors.push(...glyphErrors(copy, contact, JSON.parse(read('vendor/fonts/hi/glyphs.json'))));
  if (flag('--release')) errors.push(...releaseErrors(copy, contact, vcf));
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }

  const plates = JSON.parse(read('hi/plates.json'));
  const htmlOld = read('hi.html');
  let htmlNew;
  try { htmlNew = buildHtml(htmlOld, root, copy, contact, plates); }
  catch (e) { if (e instanceof MissingError) { console.error(e.message); process.exit(2); } throw e; }

  const vcfPath = path.join(root, 'hi/neil.vcf');
  const vcfOld = fs.existsSync(vcfPath) ? fs.readFileSync(vcfPath, 'utf8') : null;
  if (flag('--check')) {
    const diff = [];
    if (htmlNew !== htmlOld) diff.push('hi.html');
    if (vcf !== vcfOld) diff.push('hi/neil.vcf');
    if (diff.length) { console.error(`differs from a fresh build (run npm run build:hi):\n  ${diff.join('\n  ')}`); process.exit(1); }
    console.log('hi.html and hi/neil.vcf match a fresh build');
  } else {
    if (htmlNew !== htmlOld) fs.writeFileSync(path.join(root, 'hi.html'), htmlNew);
    if (vcf !== vcfOld) fs.writeFileSync(vcfPath, vcf);
    console.log(`wrote hi.html${htmlNew === htmlOld ? ' (unchanged)' : ''} and hi/neil.vcf${vcf === vcfOld ? ' (unchanged)' : ''}`);
  }
}

if (process.argv[1] && pathToFileURL(fs.realpathSync(process.argv[1])).href === import.meta.url) main();
