import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
// Techronde 19-11 (SC): inlinks naar /blog/huis-isoleren-kosten/ en /blog/warmtepomp-of-isolatie-eerst/, push 25-11.
const html = (pad) => readFileSync('dist' + pad + 'index.html', 'utf8');
test('techronde 19-11: inlinks in bestaande zinnen, één per bronpagina', () => {
  assert.match(html('/blog/isolatie-offertes-vergelijken/'), /de een noemt een <a href="\/blog\/huis-isoleren-kosten\/">totaalbedrag<\/a>, de ander/);
  assert.match(html('/spouwmuurisolatie-kosten/'), /geldt voor één maatregel; wat meerdere maatregelen samen kosten, zie je bij <a href="\/blog\/huis-isoleren-kosten\/">huis isoleren kosten<\/a>\. Laat je/);
  assert.match(html('/blog/huis-isoleren-kosten/'), /Combineer je isolatie binnen 24 maanden met <a href="\/blog\/warmtepomp-of-isolatie-eerst\/">een warmtepomp<\/a>, dan/);
});
test('techronde 19-11: bronpagina\'s dragen pushdatum 2026-11-25, /blog/ houdt zijn eigen datum', () => {
  const sm = readSitemap('dist');
  for (const pad of ['/blog/isolatie-offertes-vergelijken/', '/blog/huis-isoleren-kosten/', '/spouwmuurisolatie-kosten/']) {
    const f = dateFields(html(pad));
    assert.equal(f.visible, '2026-11-25', pad + ': zichtbaar');
    assert.equal(sm.get(pad), '2026-11-25', pad + ': sitemap');
    for (const d of [...f.ld, ...f.og]) assert.equal(d, '2026-11-25', pad + ': dateModified');
  }
  assert.equal(sm.get('/blog/'), '2026-11-18', '/blog/: lastmod');
  assert.equal(dateFields(html('/blog/')).visible, '2026-11-18', '/blog/: zichtbaar');
  assert.equal(sm.get('/gidsen/'), '2026-11-05', '/gidsen/: lastmod (bodyOnlyHub, spouw-update tilt hem niet)');
  assert.equal(dateFields(html('/gidsen/')).visible, '2026-11-05', '/gidsen/: zichtbaar');
});
