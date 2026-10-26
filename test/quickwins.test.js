import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { schoon, bewaar, laad, wis } from '../src/lib/opslag.js';
import { stampHtml, withStamp, foutGezien } from '../src/layout.mjs';
import { GIDSEN } from '../src/pages.mjs';
import { CHECKED } from '../src/lib/maatregelen.js';
execSync('node build.mjs', { stdio: 'ignore' });
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && !/\/google[0-9a-f]+\.html$/.test(p) && files.push(p); });
walk('dist');
const pages = files.map((f) => [f, readFileSync(f, 'utf8')]).filter(([, h]) => !h.includes('name="robots" content="noindex"'));
const mem = () => { const m = new Map(); return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

test('opslag: alleen quizvelden, bewaren, laden, wissen', () => {
  const V = ['woning', 'doel'];
  assert.equal(schoon('woning=hoek&email=a@b.nl', V), 'woning=hoek');
  const s = mem(); bewaar(s, 'k', 'woning=hoek&doel=comfort', V);
  assert.equal(laad(s, 'k', V), 'woning=hoek&doel=comfort');
  wis(s, 'k'); assert.equal(laad(s, 'k', V), '');
});
test('elke pagina: OG + Twitter, Organization + WebSite, geldige JSON-LD zonder ratings, Fout gezien met URL', () => {
  assert.ok(pages.length >= 15);
  for (const [f, h] of pages) {
    for (const t of ['property="og:title"', 'property="og:description"', 'property="og:image"', 'property="og:image:alt"', 'property="og:url"', 'name="twitter:card"', 'name="twitter:title"', 'name="twitter:image"', '"@type":"WebSite"', '"@type":"Organization"']) assert.ok(h.includes(t), `${f}: ${t}`);
    for (const m of h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(m[1]);
    assert.doesNotMatch(h, /aggregateRating|"review"/i, f);
    const url = h.match(/<meta property="og:url" content="([^"]+)"/)[1];
    assert.ok(h.includes(`body=${encodeURIComponent(`Pagina: ${url}`)}`), `${f}: Fout gezien zonder pagina-URL`);
  }
});
test('controlebadge: op elke gids, ISDE en blog, met echte datums', () => {
  for (const g of GIDSEN) {
    const h = readFileSync(`dist/${g.slug}/index.html`, 'utf8');
    assert.ok(h.includes(`Gecontroleerd op <time datetime="${g.checked || CHECKED}">`), g.slug);
    assert.ok(h.includes(`Laatst bijgewerkt <time datetime="${g.updated}">`), g.slug);
    assert.match(g.updated, /^2026-\d\d-\d\d$/);
  }
  for (const p of ['subsidie-isde', 'blog/energiebespaarlening-warmtefonds']) assert.match(readFileSync(`dist/${p}/index.html`, 'utf8'), /class="stamp"><span class="badge-ok">/);
  assert.equal(stampHtml({}), ''); assert.equal(stampHtml({ checked: null, updated: null }), '');
  assert.match(withStamp('<h1>X</h1><p>a</p>', { checked: '2026-10-15' }), /<\/h1><p class="stamp">/);
  assert.match(foutGezien('https://verduurzaammatch.nl/x/'), /mailto:info@verduurzaammatch\.nl\?subject=/);
});
test('sticky CTA: Doe de check in 2 minuten, niet op de check zelf; body krijgt ruimte', () => {
  const h = readFileSync('dist/dakisolatie-kosten/index.html', 'utf8');
  assert.match(h, /<body class="has-cta"/); assert.match(h, /class="stickycta" href="\/verduurzaam-match\/"[^>]*>Doe de check in 2 minuten/);
  assert.doesNotMatch(readFileSync('dist/verduurzaam-match/index.html', 'utf8'), /class="stickycta"/);
});
test('check: voortgangsbalk, bewaren/delen, opnieuw beginnen, geen e-mailveld', () => {
  const h = readFileSync('dist/verduurzaam-match/index.html', 'utf8');
  assert.match(h, /class="qbar" role="progressbar"[^>]*aria-valuemax="5"/);
  assert.match(h, /id="q-resume" hidden/); assert.match(h, /id="share" hidden/);
  assert.equal((h.match(/data-reset/g) || []).length, 2);
  assert.doesNotMatch(h, /type="email"/);
  const js = readFileSync('src/assets/js/quiz.js', 'utf8');
  assert.match(js, /localStorage/); assert.doesNotMatch(js, /fetch\(|sendBeacon|XMLHttpRequest/);
});
