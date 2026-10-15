import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
execSync('node build.mjs', { stdio: 'ignore' });
const r = (p) => readFileSync('dist' + p, 'utf8');
test('geen noindex behalve 404, canonicals aanwezig', () => {
  const h = r('/index.html'); assert.ok(!h.includes('noindex')); assert.ok(h.includes('<link rel="canonical" href="https://verduurzaammatch.nl/">'));
  assert.ok(r('/404.html').includes('noindex'));
});
test('H1 home = merk + tagline', () => assert.match(r('/index.html'), /<h1><span class="brand">Verduurzaam<b>Match<\/b>\.nl<\/span>.*Begin bij de juiste stap/));
test('titels < 60 tekens', () => { for (const p of ['/index.html', '/verduurzaam-match/index.html', '/subsidie-isde/index.html', '/spouwmuurisolatie-kosten/index.html', '/dakisolatie-kosten/index.html', '/vloerisolatie-kosten/index.html', '/hybride-warmtepomp-kosten/index.html', '/zonnepanelen-na-2027/index.html', '/thuisbatterij-terugverdienen/index.html']) { const t = r(p).match(/<title>(.*?)<\/title>/)[1]; assert.ok(t.length < 60, `${p}: ${t}`); } });
test('sitemap, robots, CNAME', () => { assert.ok(r('/sitemap.xml').includes('/spouwmuurisolatie-kosten/')); assert.ok(r('/robots.txt').includes('Sitemap:')); assert.equal(r('/CNAME').trim(), 'verduurzaammatch.nl'); });
test('netwerkfooter: alleen boekhoudmatch, geen goodfellas/shop/kassa', () => { const h = r('/index.html'); assert.ok(h.includes('Ook van ons')); assert.ok(h.includes('https://boekhoudmatch.nl/')); assert.ok(!/goodfellas|shopmatch\.nl|kassamatch\.nl/i.test(h)); });
test('geen GA zonder ID, en og-afbeeldingen bestaan', () => { assert.ok(!r('/index.html').includes('googletagmanager')); for (const s of ['home', 'match', 'subsidie-isde', 'spouwmuurisolatie-kosten']) assert.ok(existsSync(`dist/og/${s}.png`)); });
test('met GA_ID: consent-script en CSP, geen gtag.js in HTML', () => {
  const h = execSync(`node --input-type=module -e "const {layout}=await import('./src/layout.mjs');const P=await import('./src/pages.mjs');process.stdout.write(layout(P.home))"`, { env: { ...process.env, GA_ID: 'G-TEST1234' } }).toString();
  assert.ok(h.includes('/js/consent.js')); assert.ok(h.includes('data-ga="G-TEST1234"')); assert.ok(!h.includes('gtag/js'));
});
