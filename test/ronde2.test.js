import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { isde, besparing, terugverdientijd, overzicht, sorteer, MET_CIJFERS, jaarTekst } from '../src/lib/rekenen.js';
import { MAATREGELEN } from '../src/lib/maatregelen.js';
import { match, voorlopig } from '../src/lib/match.js';
import { icoon, PADEN } from '../src/lib/iconen.js';
import { GIDSEN } from '../src/pages.mjs';
execSync('node build.mjs', { stdio: 'ignore' });
const r = (p) => readFileSync('dist' + p, 'utf8');
const NIEUW = ['/rekentools/', '/besparing-berekenen/', '/terugverdientijd-berekenen/', '/isde-subsidie-berekenen/', '/vergelijken/'];

test('ISDE: RVO-tarieven, minimum, maximum, verdubbeling, warmtepomp', () => {
  assert.equal(isde({ m2: { spouw: 50 } }).totaal, 263); // 50 × 5,25 = 262,50
  assert.equal(isde({ m2: { spouw: 50 }, samen: true }).totaal, 525);
  assert.equal(isde({ m2: { spouw: 9 } }).totaal, 0);
  assert.equal(isde({ m2: { dak: 250 } }).regels[0].telt, 200);
  assert.equal(isde({ m2: { vloer: 12, bodem: 10 } }).isolatie, 2 * (12 * 5.5 + 10 * 3)); // samen ≥ 20 m², twee maatregelen
  assert.equal(isde({ wp: { kw: 4, aplus: true } }).totaal, 2125); // gelijk aan rekenvoorbeeld RVO / MAATREGELEN.hybride
  assert.equal(isde({ wp: { kw: 4, aplus: true } }).totaal, MAATREGELEN.hybride.subsidie.hoek);
  assert.equal(isde({ m2: { spouw: 50 }, wp: { kw: 4 } }).dubbel, true);
  assert.equal(isde({ m2: { spouw: '50,5' } }).regels[0].m2, 50.5);
});
test('besparing en terugverdientijd: alleen MC-cijfers, hybride óf volledig elektrisch', () => {
  const b = besparing(['spouw', 'dak'], 'tussen');
  assert.equal(b.kosten, 6800); assert.equal(b.besparing, 700); assert.equal(b.subsidie, 1050);
  assert.throws(() => besparing(['hybride', 'allelectric'], 'hoek'));
  assert.ok(!MET_CIJFERS.includes('batterij'));
  assert.deepEqual(terugverdientijd({ kosten: 800, subsidie: 200, besparing: 240 }), { met: 2.5, zonder: 3.3 });
  assert.equal(terugverdientijd({ kosten: '', besparing: 240 }), null);
  assert.equal(terugverdientijd({ kosten: 100, subsidie: 500, besparing: 50 }).met, 0);
});
test('vergelijkingsoverzicht: alle maatregelen, sorteren, batterij onderaan', () => {
  const o = overzicht('vrij'); assert.equal(o.length, Object.keys(MAATREGELEN).length);
  const s = sorteer(o, 'tvMet'); assert.equal(s[0].id, 'spouw'); assert.equal(s.at(-1).id, 'batterij');
  assert.equal(sorteer(o, 'kosten', false).at(-1).id, 'batterij');
  const h = r('/vergelijken/index.html');
  for (const m of Object.values(MAATREGELEN)) assert.ok(h.includes(m.naam), m.naam);
  assert.equal((h.match(/data-k="/g) || []).length, 6);
});
test('voorlopig advies: zonder woning niets, met alle antwoorden gelijk aan match', () => {
  assert.equal(voorlopig({}), null);
  assert.equal(voorlopig({ woning: 'hoek' }).top.length, 3);
  const a = { woning: 'hoek', bouwjaar: '1975', label: 'DE', budget: 'midden', doel: 'comfort' };
  assert.deepEqual(voorlopig(a).top, match(a));
  assert.equal(voorlopig({ woning: 'hoek', email: 'x' }).beantwoord, 1);
});
test('nieuwe pagina\'s: in sitemap, eigen OG, bron + controledatum, WebApplication, geen ratings', () => {
  const sm = r('/sitemap.xml');
  for (const p of NIEUW) {
    const h = r(p + 'index.html'); assert.ok(sm.includes(`https://verduurzaammatch.nl${p}</loc>`), p);
    const og = h.match(/property="og:image" content="https:\/\/verduurzaammatch\.nl\/og\/([^"]+)\.png"/)[1];
    assert.notEqual(og, 'home', p); assert.ok(existsSync(`dist/og/${og}.png`), og);
    assert.match(h, /Bron: <a href="https:\/\/(www\.milieucentraal|www\.rvo)\.nl/); assert.match(h, /Gecontroleerd op <time datetime="2026-10-1\d"/);
    assert.ok(h.match(/<title>(.*?)<\/title>/)[1].length <= 60, p);
    assert.doesNotMatch(h, /aggregateRating|partnerlink/i);
  }
  for (const p of NIEUW.slice(1, 4)) assert.ok(r(p + 'index.html').includes('"@type":"WebApplication"'));
});
test('links: elke gids naar rekentools en vergelijken, check naar vergelijken', () => {
  for (const g of GIDSEN) { const h = r(`/${g.slug}/index.html`); assert.ok(h.includes('href="/vergelijken/"'), g.slug); if (g.id !== 'batterij') assert.ok(h.includes('href="/terugverdientijd-berekenen/?m='), g.slug); }
  assert.ok(r('/verduurzaam-match/index.html').includes('href="/vergelijken/"'));
  for (const p of ['/subsidie-isde/', '/isde-2027/', '/glasisolatie-kosten/']) assert.ok(r(p + 'index.html').includes('href="/isde-subsidie-berekenen/"'), p);
  assert.match(r('/glasisolatie-kosten/index.html'), /og:image" content="https:\/\/verduurzaammatch\.nl\/og\/glasisolatie-kosten\.png"/);
});
test('iconen: één set, inline, decoratief, geen externe requests', () => {
  assert.throws(() => icoon('bestaatniet'));
  assert.match(icoon('huis'), /^<svg class="ico" viewBox="0 0 24 24"[^>]*aria-hidden="true"/);
  const h = r('/verduurzaam-match/index.html');
  assert.equal((h.match(/<legend><svg class="ico"/g) || []).length, 5);
  assert.doesNotMatch(h, /<img[^>]+\.svg/); assert.ok(Object.keys(PADEN).length >= 20);
});
test('check stap voor stap: tussenadvies en vorige-knop in HTML, zonder JS alle vragen zichtbaar', () => {
  const h = r('/verduurzaam-match/index.html');
  assert.match(h, /id="q-tussen" aria-live="polite" hidden/); assert.match(h, /id="q-terug"/);
  assert.match(h, /<noscript><style>\.quiz\.stap fieldset\{display:block\}/); // zonder JS alles zichtbaar, met JS geen layout shift
  assert.match(readFileSync('src/assets/js/quiz.js', 'utf8'), /voorlopig\(/);
  assert.doesNotMatch(readFileSync('src/lib/match.js', 'utf8'), /import[^\n]*partnerlinks/);
});

test('jaarTekst: altijd één decimaal met komma; /vergelijken/ toont all-electric als 9,0 en 12,0 jaar', () => {
  assert.equal(jaarTekst(9), '9,0 jaar'); assert.equal(jaarTekst(12), '12,0 jaar'); assert.equal(jaarTekst(6.8), '6,8 jaar');
  assert.equal(jaarTekst(10.25), '10,3 jaar'); assert.equal(jaarTekst(null), '–'); assert.equal(jaarTekst(undefined), '–');
  const ae = overzicht('hoek').find((r) => r.id === 'allelectric');
  assert.equal(jaarTekst(ae.tvMet), '9,0 jaar'); assert.equal(jaarTekst(ae.tvZonder), '12,0 jaar');
});
