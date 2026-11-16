// The three tests of docs/plans/hi-page-v1-plan-2026-11-16.md § 8. Run with: npm run test:hi
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveLang, pillOrder } from '../../hi/locale.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HI = path.join(HERE, '..', 'hi.mjs');
const fixture = (name) => path.join(HERE, 'fixtures', name);
const run = (...args) => spawnSync(process.execPath, [HI, ...args], { encoding: 'utf8' });

// T3 language rules: Neil's D1, D2 and D4 rulings (16 Nov 2026).
test('T3 language rules: resolveLang', () => {
  const rows = [
    [{ languages: ['en-US', 'th-TH'] }, 'th', 'device'],
    [{ languages: ['en-GB', 'he-IL'] }, 'he', 'device'],
    [{ languages: ['en', 'es', 'th'] }, 'es', 'device'],
    [{ languages: ['de-DE'] }, 'en', 'default'],
    [{ languages: ['en-GB'] }, 'en', 'device'],
    [{ languages: ['zh-TW', 'en'] }, 'zh-Hant', 'device'],
    [{ languages: ['zh-CN'] }, 'zh-Hans', 'device'],
    [{ languages: ['zh-HK'] }, 'zh-Hant', 'device'],
    [{ languages: ['zh-MO'] }, 'zh-Hant', 'device'],
    [{ languages: ['zh-Hant-TW'] }, 'zh-Hant', 'device'],
    [{ languages: ['zh-Hans-CN'] }, 'zh-Hans', 'device'],
    [{ languages: ['zh'] }, 'zh-Hans', 'device'],
    [{ languages: ['iw-IL'] }, 'he', 'device'],
    [{ languages: [] }, 'en', 'default'],
    [{ query: 'xx', languages: ['th-TH'] }, 'th', 'device'],
    [{ query: 'zh-hant', languages: ['en'] }, 'zh-Hant', 'query'],
    [{ stored: 'es', languages: ['th-TH'] }, 'es', 'stored'],
    [{ query: 'he', stored: 'es' }, 'he', 'query'],
  ];
  for (const [input, lang, source] of rows) {
    assert.deepEqual(resolveLang(input), { lang, source }, JSON.stringify(input));
  }
});

test('T3 language rules: pillOrder', () => {
  const EN = ['linkedin', 'whatsapp', 'line', 'wechat'];
  const TH = ['line', 'whatsapp', 'linkedin', 'wechat'];
  const ZH = ['wechat', 'linkedin', 'whatsapp', 'line'];
  const WA = ['whatsapp', 'linkedin', 'line', 'wechat'];
  const rows = [
    [['en', 'TH'], TH],
    [['en', 'TW'], ZH], [['en', 'CN'], ZH],
    [['en', 'MX'], WA], [['en', 'IL'], WA],
    [['en', 'US'], EN], [['en', undefined], EN],
    [['zh-Hant', 'TW'], ZH], [['zh-Hant', 'HK'], ZH], [['zh-Hans', 'TH'], ZH],
    [['th', 'US'], TH],
  ];
  for (const [args, expected] of rows) assert.deepEqual(pillOrder(...args), expected, args.join());
});

// T1 release gate: unapproved copy or a [[ placeholder must stop a release build.
test('T1 release gate: pending strings and placeholders refuse --release', () => {
  const r = run('--root', fixture('release'), '--check', '--release');
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /pending: hi_save \[en\]/);
  assert.match(r.stderr, /pending: hi_vcard_note \[en\]/);
  assert.match(r.stderr, /placeholder.*hi_role \[en\].*\[\[COMPANY\]\]/);
  assert.match(r.stderr, /placeholder.*contact\.json.*family_name.*\[\[FAMILY_NAME\]\]/);
  assert.match(r.stderr, /placeholder.*vCard/);
  assert.doesNotMatch(r.stderr, /pending: hi_greet/, 'an approved string is not named');
});

// T2 glyph coverage: a character drawn in a fallback face because its subset lacks it.
test('T2 glyph coverage: a Thai character missing from the Thai subset', () => {
  const r = run('--root', fixture('glyph-thai'), '--check');
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /glyph missing: U\+0E2F 'ฯ' \(thai\) in hi_greet \[th\]/);
});

test('T2 glyph coverage: a Latin letter in zh-Hant missing from the Inter set; CJK is never checked', () => {
  const r = run('--root', fixture('glyph-latin'), '--check');
  assert.equal(r.status, 1, r.stderr);
  assert.match(r.stderr, /glyph missing: U\+004E 'N' \(inter\) in hi_greet \[zh-Hant\]/);
  assert.doesNotMatch(r.stderr, /你|好|我|是|，/);
});
