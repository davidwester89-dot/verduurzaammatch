import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

test('bronnen: lastmod in de sitemap = BRONNEN_CHECKED (2026-10-16), dezelfde constante als de zichtbare controledatum', async () => {
  const { BRONNEN_CHECKED, bronnen } = await import('../src/pages.mjs');
  assert.equal(BRONNEN_CHECKED, '2026-10-16');
  assert.equal(bronnen.lastmod, BRONNEN_CHECKED);
  assert.equal(bronnen.stamp.checked, BRONNEN_CHECKED);
  if (existsSync('dist/sitemap.xml')) assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /<loc>https:\/\/verduurzaammatch\.nl\/bronnen\/<\/loc><lastmod>2026-10-16<\/lastmod>/);
});

test('subsidie-isde linkt naar /blog/zonneboiler-kosten/ (gewone interne link)', () => {
  const src = readFileSync('src/pages.mjs', 'utf8');
  assert.match(src, /<a href="\/blog\/zonneboiler-kosten\/">zonneboiler kosten in 2026<\/a>/);
  if (existsSync('dist/subsidie-isde/index.html')) assert.match(readFileSync('dist/subsidie-isde/index.html', 'utf8'), /<a href="\/blog\/zonneboiler-kosten\/">/);
});

test('subsidie-isde: inhoudswijziging 29-10 (L7): dateModified, zichtbaar bijgewerkt en lastmod = 2026-10-29, controledatum blijft 2026-10-26', async () => {
  const { subsidie } = await import('../src/pages.mjs');
  assert.equal(subsidie.lastmod, '2026-10-29');
  assert.equal(subsidie.stamp.updated, '2026-10-29');
  assert.equal(subsidie.stamp.checked, '2026-10-26');
  assert.equal(subsidie.schema[0].dateModified, '2026-10-29');
  if (existsSync('dist/sitemap.xml')) assert.match(readFileSync('dist/sitemap.xml', 'utf8'), /<loc>https:\/\/verduurzaammatch\.nl\/subsidie-isde\/<\/loc><lastmod>2026-10-29<\/lastmod>/);
});
