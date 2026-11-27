import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { PARTNERLINKS, HUISASSIST_ISOLATIE, HUISASSIST_WARMTEPOMP, HOMEWIZARD_URL, ESSENT_ISOLATIE_URL, ENERGIEDIRECT_URL, AANBIEDERS, partnerUrl, uitgaand, offerteBlok, alleUrls, NOOT_HTML } from '../src/lib/partnerlinks.js';
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
  assert.ok(iso.includes(`href="${ESSENT_ISOLATIE_URL}" rel="sponsored nofollow noopener" data-vendor="essent_isolatie"`));
  assert.ok(iso.includes(`href="${HUISASSIST_ISOLATIE}" rel="sponsored nofollow noopener" data-vendor="huisassist"`));
  assert.ok(iso.indexOf('data-vendor="essent_isolatie"') < iso.indexOf('data-vendor="huisassist"'), 'vaste volgorde AANBIEDERS');
  assert.equal(iso.split(NOOT_HTML).length - 1, 1);
  assert.ok(iso.endsWith(NOOT_HTML));
  assert.ok(offerteBlok('hybride').includes(HUISASSIST_WARMTEPOMP));
  assert.ok(!offerteBlok('hybride').includes(ESSENT_ISOLATIE_URL));
  assert.ok(!offerteBlok('allelectric').includes(HUISASSIST_ISOLATIE));
  const glas = offerteBlok('glas');
  assert.ok(glas.includes(`href="${ESSENT_ISOLATIE_URL}" rel="sponsored nofollow noopener" data-vendor="essent_isolatie"`));
  assert.ok(!glas.includes('huisassist'));
  assert.equal(glas.split(NOOT_HTML).length - 1, 1);
  assert.equal(offerteBlok('spouw', {}), '');
  assert.doesNotMatch(JSON.stringify(PARTNERLINKS), /zendure/i);
});

test('HomeWizard, Essent Isolatie en energiedirect: exacte Daisycon-URL, alleen in hun maatregel', () => {
  for (const [id, url, si, host, maten] of [
    ['homewizard', HOMEWIZARD_URL, '18407', 'partner.homewizard.com', ['batterij']],
    ['essent_isolatie', ESSENT_ISOLATIE_URL, '19832', 'glp8.net', ['spouw', 'dak', 'vloer', 'glas']],
    ['energiedirect', ENERGIEDIRECT_URL, '924', 'lt45.net', ['zon']],
  ]) {
    const x = new URL(url);
    assert.equal(x.hostname, host);
    assert.equal(x.searchParams.get('si'), si);
    assert.equal(x.searchParams.get('wi'), '438420');
    assert.equal(x.searchParams.get('ws'), '');
    assert.equal(x.searchParams.get('dl'), null);
    assert.equal(partnerUrl(id, maten[0]), url);
    assert.equal(uitgaand(id, PARTNERLINKS, maten[0]).rel, 'sponsored nofollow noopener');
    assert.equal(uitgaand(id, PARTNERLINKS, maten[0]).partner, true);
    assert.deepEqual(AANBIEDERS[id].voor, maten);
    for (const m of maten) {
      const blok = offerteBlok(m);
      assert.ok(blok.includes(`href="${url}" rel="sponsored nofollow noopener" data-vendor="${id}"`), m);
      assert.ok(blok.endsWith(NOOT_HTML), m);
    }
  }
  assert.ok(offerteBlok('batterij').includes('>HomeWizard</a>'));
  assert.ok(!offerteBlok('batterij').includes('nextenergy'));
  assert.ok(offerteBlok('zon').includes('>energiedirect</a>'));
  assert.ok(!offerteBlok('zon').includes('offertevergelijker'));
  assert.equal(offerteBlok('zon').includes(HOMEWIZARD_URL), false);
  assert.equal(offerteBlok('batterij').includes(ENERGIEDIRECT_URL), false);
});

test('quiz gebruikt het offerteblok uit partnerlinks.js; privacy noemt Daisycon', () => {
  assert.match(readFileSync('src/assets/js/quiz.js', 'utf8'), /offerteBlok\(id\)/);
  assert.deepEqual(alleUrls().sort(), [HUISASSIST_ISOLATIE, HUISASSIST_WARMTEPOMP, HOMEWIZARD_URL, ESSENT_ISOLATIE_URL, ENERGIEDIRECT_URL].sort());
  assert.deepEqual(netwerkenVan(PARTNERLINKS).map((n) => n.naam), ['Daisycon']);
  for (const host of ['partner.homewizard.com', 'glp8.net', 'lt45.net']) assert.equal(netwerkenVan({ x: `https://${host}/c/?si=1&wi=438420` })[0].naam, 'Daisycon', host);
  assert.throws(() => netwerkenVan({ x: 'https://www.homewizard.com/nl/' }), /Onbekend affiliatenetwerk/);
  assert.throws(() => netwerkenVan({ x: 'https://www.energiedirect.nl/' }), /Onbekend affiliatenetwerk/);
  assert.match(partnerNetwerk('VerduurzaamMatch', PARTNERLINKS), /affiliatenetwerk \(Daisycon\)/);
  assert.doesNotMatch(partnerNetwerk('VerduurzaamMatch', PARTNERLINKS), /Impact/);
});

test('privacy: lastmod in de sitemap = PRIVACY_UPDATED (2026-10-23), niet SITE.updated', async () => {
  const { PRIVACY_UPDATED } = await import('../src/privacy-avg.mjs');
  assert.equal(PRIVACY_UPDATED, '2026-10-23');
  assert.match(readFileSync('src/pages.mjs', 'utf8'), /path: '\/privacy\/'[^\n]*lastmod: PRIVACY_UPDATED/);
  if (existsSync('dist/sitemap.xml')) assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /<loc>https:\/\/verduurzaammatch\.nl\/privacy\/<\/loc><lastmod>2026-10-23<\/lastmod>/);
});
