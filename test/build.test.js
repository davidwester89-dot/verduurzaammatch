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
test('H1 home = tagline, logo geen H1', () => { const h = r('/index.html'); assert.match(h, /<p class="brand">Verduurzaam<b>Match<\/b>\.nl<\/p><h1 class="tagline">Verduurzamen\? Begin bij de juiste stap\.<\/h1>/); assert.equal((h.match(/<h1[\s>]/g) || []).length, 1); });
test('titels < 60 tekens', () => { for (const p of ['/index.html', '/verduurzaam-match/index.html', '/subsidie-isde/index.html', '/spouwmuurisolatie-kosten/index.html', '/dakisolatie-kosten/index.html', '/vloerisolatie-kosten/index.html', '/hybride-warmtepomp-kosten/index.html', '/zonnepanelen-na-2027/index.html', '/thuisbatterij-terugverdienen/index.html']) { const t = r(p).match(/<title>(.*?)<\/title>/)[1]; assert.ok(t.length < 60, `${p}: ${t}`); } });
test('sitemap, robots, CNAME', () => { assert.ok(r('/sitemap.xml').includes('/spouwmuurisolatie-kosten/')); assert.ok(r('/robots.txt').includes('Sitemap:')); assert.equal(r('/CNAME').trim(), 'verduurzaammatch.nl'); });
test('netwerkfooter: boekhoudmatch en shopmatch, geen goodfellas/kassa', () => { const h = r('/index.html'); assert.ok(h.includes('Ook van ons')); assert.ok(h.includes('https://boekhoudmatch.nl/')); assert.ok(h.includes('https://shopmatch.nl/')); assert.ok(h.includes('https://warmtepompenmatch.nl/')); assert.ok(!/goodfellas|kassamatch\.nl/i.test(h)); });
test('geen GA zonder ID, en og-afbeeldingen bestaan', () => { assert.ok(!r('/index.html').includes('gtag/js')); assert.ok(r('/index.html').includes('data-ga="G-RE5YBMSK4D"')); for (const s of ['home', 'match', 'subsidie-isde', 'spouwmuurisolatie-kosten']) assert.ok(existsSync(`dist/og/${s}.png`)); });
test('met GA_ID: consent-script en CSP, geen gtag.js in HTML', () => {
  const h = execSync(`node --input-type=module -e "const {layout}=await import('./src/layout.mjs');const P=await import('./src/pages.mjs');process.stdout.write(layout(P.home))"`, { env: { ...process.env, GA_ID: 'G-TEST1234' } }).toString();
  assert.ok(h.includes('/js/consent.js')); assert.ok(h.includes('data-ga="G-TEST1234"')); assert.ok(!h.includes('gtag/js'));
});
test('blog: index bestaat, posts in sitemap, hub alleen geïndexeerd met posts', async () => {
  const { POSTS } = await import('../src/blog.mjs');
  const hub = r('/blog/index.html'); const sm = r('/sitemap.xml');
  if (POSTS.length) { assert.ok(!hub.includes('noindex')); assert.ok(sm.includes('/blog/</loc>')); for (const b of POSTS) { assert.ok(sm.includes(`/blog/${b.slug}/`)); assert.ok(b.title.length < 60, b.title); assert.ok(existsSync(`dist/blog/${b.slug}/index.html`)); } }
  else { assert.ok(hub.includes('noindex')); assert.ok(!sm.includes('/blog/')); }
});
test('nergens Dave West in de build', () => { const out = execSync('grep -rli "dave west" dist || true').toString().trim(); assert.equal(out, ''); });
