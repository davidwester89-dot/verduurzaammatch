import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
import { STIJL_PADEN } from './nuchter-datums-helper.mjs';
test('stijlrelease 13-11: exacte bijgewerkt-/lastmod-/dateModified-datums, uitsluitend op de vastgelegde pagina’s', () => {
  const out = 'dist';
  const sitemap = readSitemap(out);
  for (const pad of STIJL_PADEN) {
    const file = pad.endsWith('.html') ? out + pad : out + pad + 'index.html';
    const fields = dateFields(readFileSync(file, 'utf8'));
    assert.equal(fields.visible, '2026-11-17', pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), '2026-11-17', pad + ': sitemap');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, '2026-11-17', pad + ': dateModified');
  }
});

import { nuchterDatum } from '../src/nuchter-datums.mjs';
test('stijl-datumvloer regresseert een latere inhoudelijke paginadatum niet', () => {
  const pad = [...STIJL_PADEN][0];
  const p = nuchterDatum({ path: pad, updated: '2027-01-02', lastmod: '2027-01-02', body: '<p>Updated <time datetime="2027-01-02">2 January 2027</time></p>', schema: [{ dateModified: '2027-01-02' }] });
  assert.equal(p.updated, '2027-01-02');
  assert.equal(p.lastmod, '2027-01-02');
  assert.equal(p.schema[0].dateModified, '2027-01-02');
  assert.match(p.body, /datetime="2027-01-02"/);
});

// Een gewijzigde dependency zonder andere zichtbare rekentool-output is geen paginarevisie.
test('ongewijzigde rekentools behouden alle eigen datumvelden van 19 oktober', () => {
  const sitemap = readSitemap('dist');
  // /isde-subsidie-berekenen/ kreeg in wk47 een eigen bodywijziging (L7 2026-11-20); zie test hieronder.
  for (const pad of ['/besparing-berekenen/', '/terugverdientijd-berekenen/']) {
    assert.equal(STIJL_PADEN.has(pad), false);
    const fields = dateFields(readFileSync('dist' + pad + 'index.html', 'utf8'));
    assert.equal(fields.visible, '2026-10-19', pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), '2026-10-19', pad + ': sitemap');
    assert.deepEqual(fields.ld, [], pad + ': net als parent geen eigen dateModified in dit template');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, '2026-10-19', pad + ': dateModified');
  }
});

// Wk47: H2 'Subsidie warmtepomp berekenen' op /isde-subsidie-berekenen/ = eigen bodywijziging, dus pushdatum 2026-11-20.
test('ISDE-rekenhulp: warmtepomp-H2 met RVO-bedragen, gelabeld rekenvoorbeeld en datum 2026-11-20', () => {
  const html = readFileSync('dist/isde-subsidie-berekenen/index.html', 'utf8');
  const fields = dateFields(html);
  assert.equal(fields.visible, '2026-11-20');
  assert.equal(readSitemap('dist').get('/isde-subsidie-berekenen/'), '2026-11-20');
  assert.match(html, /<h2>Subsidie warmtepomp berekenen<\/h2>/);
  assert.match(html, /Rekenvoorbeeld van VerduurzaamMatch/);
  assert.match(html, /€ 1\.025 \+ 5 × € 225 \+ € 200 = <strong>€ 2\.350<\/strong>/);
  assert.match(html, /€ 1\.025 \+ 5 × € 120 \+ € 250 = € 1\.875/);
  for (const l of ['/subsidie-isde/', '/isde-2027/', '/blog/isde-isolatie-aanvragen/', '/rekentools/', '/verduurzaam-match/', 'https://warmtepompenmatch.nl/isde-subsidie-warmtepomp-2026/']) assert.ok(html.includes(`href="${l}"`), l);
  assert.match(html, /<title>ISDE-subsidie isolatie berekenen 2026/);
});
