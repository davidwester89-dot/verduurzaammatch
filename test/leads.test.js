import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { actievePartners, routing, categorieVan, valideer, iframeUrl, analytics, frameOrigins, LEADPARTNERS, CATEGORIEEN } from '../src/lib/leads.js';
import { VRAGEN } from '../src/lib/match.js';

const IF = { naam: 'X', type: 'iframe', url: 'https://x.nl/form?a=1', origin: 'https://x.nl', privacy: 'https://x.nl/p', voor: ['isolatie', 'zonnepanelen'], max: 3, prefill: { postcode: 'pc', woning: 'type', email: 'mail' }, subidParam: 'sub' };
const RD = { naam: 'Y', type: 'redirect', url: 'https://y.nl/c?x', privacy: 'https://y.nl/p', voor: ['warmtepomp', 'isolatie'], max: 1 };
const A = { maatregel: 'isolatie', postcode: '3512ab', woning: 'hoek', bouwjaar: '1975', wanneer: 'direct' };

test('leads: leeg tot goedkeuring; productie-build zonder offertepagina of -knoppen', () => {
  assert.deepEqual(LEADPARTNERS, {});
  execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, LEADS_PREVIEW: '' } });
  assert.ok(!existsSync('dist/offerte/index.html'));
  for (const p of ['spouwmuurisolatie-kosten', 'glasisolatie-kosten', 'privacy', 'disclaimer']) { const h = readFileSync(`dist/${p}/index.html`, 'utf8'); assert.doesNotMatch(h, /class="leadcta"|id="offertes"|offertepartner/, p); assert.doesNotMatch(h, /frame-src/, p); }
  assert.match(readFileSync('dist/js/lib/leads.config.js', 'utf8'), /export const LEADS = \{\};/);
  assert.ok(!readFileSync('dist/sitemap.xml', 'utf8').includes('/offerte/'));
  assert.match(readFileSync('dist/robots.txt', 'utf8'), /Allow: \//);
});
test('leads: één partner per categorie, eerste in de lijst wint', () => {
  const r = routing(actievePartners({ partners: { x: IF, y: RD } }));
  assert.deepEqual(r, { isolatie: 'x', zonnepanelen: 'x', warmtepomp: 'y' });
  assert.equal(categorieVan('spouw'), 'isolatie'); assert.equal(categorieVan('hybride'), 'warmtepomp'); assert.equal(categorieVan('batterij'), 'thuisbatterij'); assert.equal(categorieVan('x'), null);
  assert.throws(() => actievePartners({ partners: { z: { ...IF, url: 'http://x.nl' } } }));
  assert.throws(() => actievePartners({ partners: { z: { ...IF, origin: 'https://ander.nl' } } }));
  assert.throws(() => actievePartners({ partners: { z: { ...RD, voor: ['auto'] } } }));
});
test('leads: validatie, prefill zonder contactgegevens, GA zonder postcode', () => {
  assert.deepEqual(valideer(A, VRAGEN.woning.opties, VRAGEN.bouwjaar.opties), {});
  const f = valideer({ ...A, postcode: '0123 AB', wanneer: 'x' }, VRAGEN.woning.opties, VRAGEN.bouwjaar.opties);
  assert.ok(f.postcode && f.wanneer);
  const u = new URL(iframeUrl(IF, { ...A, email: 'a@b.nl' }));
  assert.equal(u.searchParams.get('pc'), '3512 AB'); assert.equal(u.searchParams.get('type'), 'hoek'); assert.equal(u.searchParams.get('mail'), null); assert.equal(u.searchParams.get('sub'), 'vm_leadtest_isolatie'); assert.equal(u.searchParams.get('a'), '1');
  const g = analytics(A, 'x');
  assert.deepEqual(g, { maatregel: 'isolatie', termijn: 'direct', partner: 'x' });
  assert.ok(!JSON.stringify(g).includes('3512'));
  assert.deepEqual(frameOrigins({ x: IF, y: RD }), ['https://x.nl']);
});
test('leads: match.js kent geen offertepartners (geen invloed op advies)', () => {
  const m = readFileSync('src/lib/match.js', 'utf8');
  assert.doesNotMatch(m, /leads|LEADPARTNERS|ROUTING/);
});
test('leads preview: offertepagina, toestemming, label, noindex overal, robots dicht', () => {
  execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, LEADS_PREVIEW: '1' } });
  try {
    const o = readFileSync('dist/offerte/index.html', 'utf8');
    assert.match(o, /name="robots" content="noindex"/);
    assert.match(o, /<input type="checkbox" id="l-ok">/); // niet vooraf aangevinkt
    assert.match(o, /class="partner">partnerlink<\/span>/);
    assert.match(o, /Preview, niet live/);
    for (const k of ['maatregel', 'postcode', 'woning', 'bouwjaar', 'wanneer']) assert.match(o, new RegExp(`data-q="${k}"`));
    assert.doesNotMatch(o, /type="email"|type="tel"/); // contactgegevens alleen in het partnerformulier
    assert.match(readFileSync('dist/offerte/bedankt/index.html', 'utf8'), /noindex/);
    const g = readFileSync('dist/spouwmuurisolatie-kosten/index.html', 'utf8');
    assert.match(g, /class="leadcta"[\s\S]*href="\/offerte\/\?m=isolatie" data-lead="isolatie"[\s\S]*partnerlink/);
    assert.match(g, /name="robots" content="noindex"/);
    assert.match(readFileSync('dist/privacy/index.html', 'utf8'), /id="offertes"/);
    assert.equal(readFileSync('dist/robots.txt', 'utf8'), 'User-agent: *\nDisallow: /\n');
    const js = readFileSync('src/assets/js/offerte.js', 'utf8').replace(/^\s*\/\/.*$/gm, '');
    assert.doesNotMatch(js, /fetch\(|sendBeacon|XMLHttpRequest|localStorage/);
    assert.match(js, /if \(!ok\.checked\)/);
    for (const c of Object.keys(CATEGORIEEN)) assert.match(o, new RegExp(`value="${c}"`));
  } finally { execSync('node build.mjs', { stdio: 'ignore', env: { ...process.env, LEADS_PREVIEW: '' } }); }
});
