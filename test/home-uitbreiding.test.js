import test from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
execSync('node build.mjs', { stdio: 'ignore' });
const h = readFileSync('dist/index.html', 'utf8');
const main = h.slice(h.indexOf('<main'), h.indexOf('</main>'));
test('home: uitgebreid, ISDE 2027 precies als RVO-voorstel, FAQ zichtbaar + FAQPage, bronnen', () => {
  assert.ok(main.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length >= 600);
  assert.ok(main.includes('het voorgenomen bedrag voor lucht-water warmtepompen daalt van € 225 naar € 120 per kW; andere warmtepompen houden hetzelfde bedrag per kW'));
  assert.ok(!main.includes('gaat waarschijnlijk omlaag'));
  assert.ok(main.includes('href="https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027"'));
  const ld = [...h.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const faq = ld.find((x) => x['@type'] === 'FAQPage');
  assert.ok(faq && faq.mainEntity.length === 4);
  for (const q of faq.mainEntity) assert.ok(main.includes(q.name), q.name);
  for (const p of ['/blog/huis-verduurzamen-waar-beginnen/', '/subsidie-isde/', '/isde-2027/', '/blog/energiebespaarlening-warmtefonds/', '/zonnepanelen-na-2027/', '/besparing-berekenen/', '/terugverdientijd-berekenen/', '/verduurzaam-match/']) assert.ok(main.includes(`href="${p}"`), p);
  assert.ok(!/partnerlink|sponsored/.test(main));
});
