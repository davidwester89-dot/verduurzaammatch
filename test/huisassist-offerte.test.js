import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PARTNERLINKS, HUISASSIST_ISOLATIE, HUISASSIST_WARMTEPOMP, partnerUrl, uitgaand, offerteBlok, alleUrls, NOOT_HTML } from '../src/lib/partnerlinks.js';
import { netwerkenVan, partnerNetwerk } from '../src/privacy-avg.mjs';

// Huisassist.nl (Daisycon 22344, VM 438420, goedgekeurd 23-10-2026): link per maatregel, alleen in het offerteblok van de uitslag.
test('Huisassist: isolatie-deeplink bij spouw/dak/vloer, warmtepomp-deeplink bij hybride/all-electric, niets bij glas/zon/batterij', () => {
  for (const m of ['spouw', 'dak', 'vloer']) assert.equal(partnerUrl('huisassist', m), HUISASSIST_ISOLATIE);
  for (const m of ['hybride', 'allelectric']) assert.equal(partnerUrl('huisassist', m), HUISASSIST_WARMTEPOMP);
  for (const m of ['glas', 'zon', 'batterij', undefined]) assert.equal(partnerUrl('huisassist', m), null);
  for (const [u, dl] of [[HUISASSIST_ISOLATIE, 'isolatie/vergelijk/'], [HUISASSIST_WARMTEPOMP, 'warmtepomp/vergelijk/']]) {
    const x = new URL(u);
    assert.equal(x.hostname, 'glp8.net'); assert.equal(x.searchParams.get('si'), '22344'); assert.equal(x.searchParams.get('wi'), '438420'); assert.equal(x.searchParams.get('dl'), dl);
  }
  assert.doesNotMatch(JSON.stringify(PARTNERLINKS), /PLACEHOLDER|\.invalid/);
  assert.equal(uitgaand('huisassist').partner, false, 'zonder maatregel: gewone link');
  assert.equal(uitgaand('huisassist', PARTNERLINKS, 'dak').rel, 'sponsored nofollow noopener');
  assert.equal(partnerUrl('quatt', 'hybride', { quatt: 'https://x' }), 'https://x', 'losse URL blijft werken');
});

test('offerteblok: rel sponsored, juiste deeplink, precies één partnerzin; leeg zonder link', () => {
  const iso = offerteBlok('spouw');
  assert.ok(iso.includes(`href="${HUISASSIST_ISOLATIE}" rel="sponsored nofollow noopener" data-vendor="huisassist"`));
  assert.equal(iso.split(NOOT_HTML).length - 1, 1);
  assert.ok(iso.endsWith(NOOT_HTML));
  assert.ok(offerteBlok('hybride').includes(HUISASSIST_WARMTEPOMP));
  assert.ok(!offerteBlok('allelectric').includes(HUISASSIST_ISOLATIE));
  for (const m of ['glas', 'zon', 'batterij']) assert.equal(offerteBlok(m), '');
  assert.doesNotMatch(JSON.stringify(PARTNERLINKS), /zendure/i);
});

test('quiz gebruikt het offerteblok uit partnerlinks.js; privacy noemt Daisycon', () => {
  assert.match(readFileSync('src/assets/js/quiz.js', 'utf8'), /offerteBlok\(id\)/);
  assert.deepEqual(alleUrls().sort(), [HUISASSIST_ISOLATIE, HUISASSIST_WARMTEPOMP].sort());
  assert.deepEqual(netwerkenVan(PARTNERLINKS).map((n) => n.naam), ['Daisycon']);
  assert.match(partnerNetwerk('VerduurzaamMatch', PARTNERLINKS), /affiliatenetwerk \(Daisycon\)/);
});

test('privacy: lastmod in de sitemap = PRIVACY_UPDATED (2026-10-23), niet SITE.updated', async () => {
  const { PRIVACY_UPDATED } = await import('../src/privacy-avg.mjs');
  assert.equal(PRIVACY_UPDATED, '2026-10-23');
  assert.match(readFileSync('src/pages.mjs', 'utf8'), /path: '\/privacy\/'[^\n]*lastmod: PRIVACY_UPDATED/);
  if (existsSync('dist/sitemap.xml')) assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /<loc>https:\/\/verduurzaammatch\.nl\/privacy\/<\/loc><lastmod>2026-10-23<\/lastmod>/);
});
