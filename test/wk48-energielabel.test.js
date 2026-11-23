import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dateFields, readSitemap } from '../scripts/l7check.mjs';
// Wk48 (SEO-briefing 23-11): nieuwe post /blog/energielabel-verbeteren-kosten/, push 26-11; inlink vanaf /blog/huis-verduurzamen-waar-beginnen/.
const html = (pad) => readFileSync('dist' + pad + 'index.html', 'utf8');
const P = '/blog/energielabel-verbeteren-kosten/';
test('wk48 energielabel: title, meta, byline als Organization, geen persoonsnaam', () => {
  const h = html(P);
  const title = h.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(title.startsWith('Energielabel verbeteren: kosten per maatregel en per stap'));
  const meta = h.match(/<meta name="description" content="([^"]*)"/)[1];
  assert.ok(meta.length >= 120 && meta.length <= 155, 'meta ' + meta.length);
  assert.match(h, /Door Redactie VerduurzaamMatch/);
  assert.match(h, /"author":\{"@type":"Organization"/);
  assert.doesNotMatch(h, /reddit/i);
  assert.match(h, /href="\/verduurzaam-match\/"/);
});
test('wk48 energielabel: L7 26-11 op nieuwe post, bronpost en /blog/', () => {
  const sm = readSitemap('dist');
  for (const pad of [P, '/blog/huis-verduurzamen-waar-beginnen/', '/blog/']) {
    const f = dateFields(html(pad));
    assert.equal(f.visible, '2026-11-26', pad + ': zichtbaar');
    assert.equal(sm.get(pad), '2026-11-26', pad + ': sitemap');
    for (const d of [...f.ld, ...f.og]) assert.equal(d, '2026-11-26', pad + ': dateModified');
  }
  assert.match(html('/blog/huis-verduurzamen-waar-beginnen/'), /Wat een beter label kost, lees je in <a href="\/blog\/energielabel-verbeteren-kosten\/">energielabel verbeteren: kosten<\/a>\./);
});
test('wk48 energielabel: bedragen gelijk aan de eigen kostenpagina\'s', () => {
  const h = html(P);
  const pillar = html('/blog/huis-isoleren-kosten/');
  for (const b of ['€ 800 (subsidie € 200)', '€ 6.000 (subsidie € 850)', '€ 2.150 (subsidie € 260)', '€ 2.700 (subsidie € 700)', '€ 10.000 (subsidie € 1.500)', '€ 4.200 (subsidie € 500)', '€ 4.700']) {
    assert.ok(h.includes(b), 'post mist ' + b); assert.ok(pillar.includes(b), 'pillar mist ' + b);
  }
});
