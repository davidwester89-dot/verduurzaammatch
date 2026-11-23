// Wk48-upgrade /vloerisolatie-kosten/ (push 27-11-2026): terugverdientijd-blok per woningtype + bodemisolatie,
// alle bedragen van Milieu Centraal (vloerisolatie, bodemisolatie) en RVO (ISDE); terugverdientijd = onze rekensom.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
const PD = process.env.PUSH_DATE || '2026-11-27';
execSync('node build.mjs', { env: { ...process.env, PUSH_DATE: PD, BUILD_DATE: process.env.BUILD_DATE || PD }, stdio: 'ignore' });
const html = readFileSync('dist/vloerisolatie-kosten/index.html', 'utf8');
test('vloer: title en meta ongewijzigd', () => {
  assert.match(html, /<title>Vloerisolatie kosten 2026: prijs, subsidie, besparing/);
});
test('vloer: nieuwe H2 terugverdientijd + FAQ + bodemisolatie', () => {
  assert.ok(html.includes('<h2>Terugverdientijd en besparing per jaar</h2>'));
  assert.ok(html.includes('<h2>Kosten per woningtype</h2>'));
  assert.ok(html.includes('Hoe snel verdien je vloerisolatie terug?'));
  assert.ok(html.includes('"@type":"FAQPage"') || html.includes('"@type": "FAQPage"'));
  assert.ok(html.includes('<h3>Bodemisolatie apart</h3>'));
});
test('vloer: MC-cijfers en rekensom', () => {
  for (const x of ['80 m³', '130 m³', '170 m³', '250 m³', '€ 110', '€ 180', '€ 230', '€ 340', '17,2 jaar', '10,9 jaar', '11,1 jaar', '12,4 jaar', '19,5 jaar', '12,6 jaar', '€ 1.600', '€ 150', '100 m³', '€ 130', '11,2 jaar', '190 m³', '€ 270']) assert.ok(html.includes(x), x);
});
test('vloer: interne links uit de briefing', () => {
  for (const l of ['/terugverdientijd-berekenen/', '/besparing-berekenen/', '/subsidie-isde/', '/blog/huis-isoleren-kosten/', '/verduurzaam-match/']) assert.ok(html.includes(`href="${l}`), l);
});
test('vloer: bronnenlijst zonder datum, geen sponsored', () => {
  assert.ok(html.includes('<h2>Bronnen</h2>'));
  assert.ok(html.includes('https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/bodemisolatie/'));
  assert.ok(!/rel="[^"]*sponsored/.test(html));
});
test('vloer: datums op pushdag', () => {
  assert.ok(html.includes(`"dateModified":"${PD}"`));
  assert.ok(readFileSync('dist/sitemap.xml', 'utf8').includes(`vloerisolatie-kosten/</loc><lastmod>${PD}</lastmod>`));
});
