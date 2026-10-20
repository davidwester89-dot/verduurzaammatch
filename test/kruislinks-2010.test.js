// Kruislinks verduurzaming (20-10-2026): contextuele links tussen VerduurzaamMatch, WarmtepompenMatch en ThuisaccuMatch.
// Elke link staat in de lopende tekst, is een gewone link (geen nofollow/sponsored) en per pagina staan er max. 3 kruislinks in <main>.
import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const OWN = 'verduurzaammatch.nl';
const NET = ['verduurzaammatch.nl', 'warmtepompenmatch.nl', 'thuisaccumatch.nl'].filter((d) => d !== OWN);
const KRUISLINKS = {
  "/spouwmuurisolatie-kosten/": [
    [
      "of je huis geschikt is voor een warmtepomp",
      "https://warmtepompenmatch.nl/is-mijn-huis-geschikt-voor-een-warmtepomp/"
    ]
  ],
  "/dakisolatie-kosten/": [
    [
      "kiest tussen een hybride en een volledig elektrische warmtepomp",
      "https://warmtepompenmatch.nl/hybride-of-all-electric/"
    ]
  ],
  "/vloerisolatie-kosten/": [
    [
      "hybride of all-electric: wat past na het isoleren",
      "https://warmtepompenmatch.nl/hybride-of-all-electric/"
    ]
  ],
  "/glasisolatie-kosten/": [
    [
      "de isolatie-eisen voor een warmtepomp per bouwjaar",
      "https://warmtepompenmatch.nl/is-mijn-huis-geschikt-voor-een-warmtepomp/"
    ]
  ],
  "/blog/zonnepanelen-kosten-2026/": [
    [
      "terugleverkosten en terugleververgoeding vanaf 2027",
      "https://thuisaccumatch.nl/terugleverkosten/"
    ]
  ]
};
// Pagina's die al vóór deze ronde meer dan 3 kruislinks hadden; deze ronde voegt daar niets aan toe.
const LEGACY = {"/blog/huis-verduurzamen-waar-beginnen/": 4, "/vergelijken/": 5};

const mainOf = (path) => {
  const h = readFileSync(`dist${path}index.html`, 'utf8');
  const m = h.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  assert.ok(m, `geen <main> op ${path}`);
  return m[1];
};
const crossLinks = (html) => [...html.matchAll(/<a\s([^>]*)>([\s\S]*?)<\/a>/g)]
  .map(([, attrs, text]) => ({ attrs, text: text.replace(/<[^>]+>/g, '').trim(), href: (attrs.match(/href="([^"]+)"/) || [])[1] || '' }))
  .filter((a) => NET.some((d) => a.href.startsWith(`https://${d}/`)));

test('kruislinks: aanwezig in de lopende tekst, juiste anker en doel, zonder nofollow/sponsored', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '', GO_LIVE: '1', LEADS_PREVIEW: '' } });
  for (const [src, items] of Object.entries(KRUISLINKS)) {
    const links = crossLinks(mainOf(src));
    for (const [anker, doel] of items) {
      const hit = links.find((a) => a.href === doel && a.text === anker);
      assert.ok(hit, `${src}: link '${anker}' -> ${doel} ontbreekt`);
      assert.doesNotMatch(hit.attrs, /\brel=/, `${src}: '${anker}' heeft een rel-attribuut`);
    }
  }
});

test('kruislinks: max. 3 per pagina, ankers uniek', () => {
  const pages = walk('dist').filter((f) => f.endsWith('/index.html')).map((f) => f.slice(4, -10));
  for (const p of pages) {
    if (!/<main[^>]*>/.test(readFileSync(`dist${p}index.html`, 'utf8'))) continue; // doorverwijspagina zonder inhoud
    const n = crossLinks(mainOf(p)).length;
    if (p in LEGACY) assert.ok(n <= LEGACY[p], `${p}: ${n} kruislinks, was ${LEGACY[p]}`);
    else assert.ok(n <= 3, `${p}: ${n} kruislinks (max 3)`);
  }
  const ankers = Object.values(KRUISLINKS).flat().map(([a]) => a.toLowerCase());
  assert.equal(new Set(ankers).size, ankers.length, 'dubbel anker');
});

test('kruislinks: niet in footer of als sitewide blok', () => {
  const layout = readFileSync('src/layout.mjs', 'utf8');
  for (const [, doel] of Object.values(KRUISLINKS).flat()) assert.ok(!layout.includes(doel), `${doel} staat in de layout`);
});

