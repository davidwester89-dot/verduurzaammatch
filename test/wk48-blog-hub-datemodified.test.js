// SEO-review cd520eb (23-11): /blog/ krijgt lastmod-lift → ook dateModified in JSON-LD, gelijk aan lastmod en zichtbare stempel.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PD = process.env.PUSH_DATE || '2026-11-26';
execSync('node build.mjs', { env: { ...process.env, PUSH_DATE: PD, BUILD_DATE: process.env.BUILD_DATE || PD }, stdio: 'ignore' });
test('/blog/: JSON-LD dateModified = lastmod = zichtbare stempel', () => {
  const html = readFileSync('dist/blog/index.html', 'utf8');
  const lm = readFileSync('dist/sitemap.xml', 'utf8').match(/blog\/<\/loc><lastmod>([^<]+)</)[1];
  const dm = html.match(/"dateModified": ?"([^"]+)"/);
  assert.ok(dm, 'dateModified ontbreekt op /blog/');
  assert.equal(dm[1], lm);
  const iso = lm.split('-'); const MND = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
  assert.ok(html.includes(`${Number(iso[2])} ${MND[Number(iso[1]) - 1]} ${iso[0]}`), 'zichtbare stempel');
});
