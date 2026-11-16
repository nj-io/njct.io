export const LANGS = ['en', 'th', 'zh-Hans', 'zh-Hant', 'he', 'es'];
// A language tag (any case, '-' or '_') to a supported locale, or null. An explicit script subtag wins.
export function norm(t) {
  const [p, ...sub] = String(t || '').toLowerCase().split(/[-_]/);
  if (p === 'iw') return 'he';
  if (p === 'zh') {
    if (sub.includes('hant')) return 'zh-Hant';
    if (sub.includes('hans')) return 'zh-Hans';
    return sub.some((s) => s === 'tw' || s === 'hk' || s === 'mo') ? 'zh-Hant' : 'zh-Hans';
  }
  return ['en', 'th', 'he', 'es'].includes(p) ? p : null;
}
// D1: ?lang=, then the stored picker choice, then the first supported non-English language anywhere in the
// device's list, then English.
export function resolveLang({ query, stored, languages }) {
  const q = norm(query);
  if (q) return { lang: q, source: 'query' };
  const s = norm(stored);
  if (s) return { lang: s, source: 'stored' };
  let en = false;
  for (const t of languages || []) {
    const l = norm(t);
    if (l && l !== 'en') return { lang: l, source: 'device' };
    if (l === 'en') en = true;
  }
  return { lang: 'en', source: en ? 'device' : 'default' };
}
const ZH = ['wechat', 'linkedin', 'whatsapp', 'line'];
const WA = ['whatsapp', 'linkedin', 'line', 'wechat'];
export const ORDER = {
  en: ['linkedin', 'whatsapp', 'line', 'wechat'],
  th: ['line', 'whatsapp', 'linkedin', 'wechat'],
  'zh-Hans': ZH, 'zh-Hant': ZH, he: WA, es: WA,
};
// D2: for an English page only, the country picks one of the orders above.
export const COUNTRY_ORDER = Object.assign(
  { TH: 'th', CN: 'zh-Hans', HK: 'zh-Hans', MO: 'zh-Hans', TW: 'zh-Hans', IL: 'he' },
  Object.fromEntries('AR BO CL CO CR CU DO EC ES GT HN MX NI PA PE PR PY SV UY VE'.split(' ').map((c) => [c, 'es'])),
);
export function pillOrder(lang, cc) {
  return ORDER[lang !== 'en' ? lang : COUNTRY_ORDER[String(cc || '').toUpperCase()] || 'en'];
}
