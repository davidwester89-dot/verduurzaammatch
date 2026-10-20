import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
execSync('node build.mjs', { stdio: 'ignore' });
const h = readFileSync('dist/subsidie-isde/index.html', 'utf8');
test('ISDE-pagina gaat over isolatie: title, og:title en H1 zonder warmtepomp (WM is eigenaar)', () => {
  const t = h.match(/<title>(.*?)<\/title>/)[1];
  assert.equal(t, 'ISDE-subsidie isolatie 2026: bedragen en voorwaarden');
  assert.ok(t.length <= 60);
  assert.ok(h.includes('<meta property="og:title" content="ISDE-subsidie isolatie 2026: bedragen en voorwaarden">'));
  const h1s = h.match(/<h1[^>]*>.*?<\/h1>/g);
  assert.equal(h1s.length, 1);
  assert.equal(h1s[0].replace(/<[^>]+>/g, ''), 'ISDE-subsidie isolatie 2026');
  const d = h.match(/<meta name="description" content="(.*?)">/)[1];
  assert.ok(d.length <= 155, d);
});
