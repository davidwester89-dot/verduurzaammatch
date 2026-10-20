// Ronde 2 (20-10-2026): byline + Article-schema (redactie) op ISDE- en glaspagina's.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

test('byline en Article-schema met auteur Redactie VerduurzaamMatch', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1' } });
  for (const [p, d] of [['subsidie-isde', '2026-10-15'], ['isde-2027', '2026-10-16'], ['glasisolatie-kosten', '2026-10-16']]) {
    const h = read(`dist/${p}/index.html`);
    assert.match(h, /<p class="src">Door Redactie VerduurzaamMatch<\/p>/, p);
    const ld = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => JSON.parse(m[1]));
    const a = ld.filter((x) => x['@type'] === 'Article');
    assert.equal(a.length, 1, p);
    assert.deepEqual(a[0].author, { '@type': 'Organization', name: 'Redactie VerduurzaamMatch', url: 'https://verduurzaammatch.nl/over/' });
    assert.equal(a[0].publisher.name, 'VerduurzaamMatch');
    assert.equal(a[0].datePublished, d);
    assert.equal(a[0].mainEntityOfPage, `https://verduurzaammatch.nl/${p}/`);
    assert.match(a[0].image, /^https:\/\/verduurzaammatch\.nl\/og\/[a-z-]+\.png$/);
  }
});

test('privacy: vergoeding is een mogelijkheid ("kunnen ... krijgen"), geen zekerheid', () => {
  const s = read('src/privacy-avg.mjs');
  assert.doesNotMatch(s, /dan krijgen wij daardoor een vergoeding/);
  assert.match(s, /dan kunnen wij daardoor een vergoeding krijgen/);
});

test('brontekst (.src) minimaal 16px', () => {
  const css = read('src/assets/css/style.css');
  const sizes = [...css.matchAll(/(?:^|\})\s*\.src\{[^}]*font-size:(\d+)px/g)].map((m) => +m[1]);
  assert.ok(sizes.length > 0);
  for (const n of sizes) assert.ok(n >= 16, `.src ${n}px`);
});
