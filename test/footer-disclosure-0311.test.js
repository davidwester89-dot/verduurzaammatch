// Externe feedback nov (VM P2): partner-disclosure in de footer van elke pagina (Huisassist-partnerlinks via Daisycon zijn goedgekeurd).
// Tekst uit SC-review 2e6ecb8: 'Via sommige links kunnen we een vergoeding krijgen; dat heeft nooit invloed op het advies of de volgorde.'
// Als kleine lettertjes (.fine), niet als .pnoot-blok: de regel 'één partnerzin per partnerblok' blijft gelijk.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { NOOT_HTML } from '../src/lib/partnerlinks.js';

const files = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.html') ? [p] : []; });
test('footer: partner-disclosure op elke pagina', () => {
  execSync('node build.mjs', { env: { ...process.env, BASE: '', PREVIEW: '' }, stdio: 'ignore' });
  const pages = files('dist').filter((f) => readFileSync(f, 'utf8').includes('<footer'));
  assert.ok(pages.length > 10);
  for (const f of pages) {
    const h = readFileSync(f, 'utf8');
    const footer = h.slice(h.indexOf('<footer'), h.indexOf('</footer>'));
    assert.ok(footer.includes('<p class="fine">© 2026 VerduurzaamMatch. Via sommige links kunnen we een vergoeding krijgen; dat heeft nooit invloed op het advies of de volgorde.</p>'), f);
    assert.ok(!footer.includes(NOOT_HTML), `${f}: footer is geen partnerblok`);
  }
});
