import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = readFileSync(new URL('../src/pages.mjs', import.meta.url), 'utf8');
const blok = (start, eind) => src.slice(src.indexOf(start), src.indexOf(eind, src.indexOf(start)));

test('tech 5-11: /isde-2027/ linkt in de body naar /blog/zonneboiler-kosten/ (anker zonneboiler kosten)', () => {
  assert.match(blok("path: '/isde-2027/'", '// ---- Glasisolatie'), /<a href="\/blog\/zonneboiler-kosten\/">zonneboiler kosten<\/a>/);
});
test('tech 5-11: /spouwmuurisolatie-kosten/ linkt in de body naar /blog/gevelisolatie-kosten/ (anker gevelisolatie kosten)', () => {
  assert.match(blok("slug: 'spouwmuurisolatie-kosten'", "slug: 'dakisolatie-kosten'"), /<a href="\/blog\/gevelisolatie-kosten\/">gevelisolatie kosten<\/a>/);
});
