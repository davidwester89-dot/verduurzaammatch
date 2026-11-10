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
    assert.equal(fields.visible, '2026-11-13', pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), '2026-11-13', pad + ': sitemap');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, '2026-11-13', pad + ': dateModified');
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
  for (const pad of ['/besparing-berekenen/', '/isde-subsidie-berekenen/', '/terugverdientijd-berekenen/']) {
    assert.equal(STIJL_PADEN.has(pad), false);
    const fields = dateFields(readFileSync('dist' + pad + 'index.html', 'utf8'));
    assert.equal(fields.visible, '2026-10-19', pad + ': zichtbaar');
    assert.equal(sitemap.get(pad), '2026-10-19', pad + ': sitemap');
    assert.deepEqual(fields.ld, [], pad + ': net als parent geen eigen dateModified in dit template');
    for (const date of [...fields.ld, ...fields.og]) assert.equal(date, '2026-10-19', pad + ': dateModified');
  }
});
