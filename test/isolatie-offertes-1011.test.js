import { test } from 'node:test';
import assert from 'node:assert/strict';
import post from '../content/blog/isolatie-offertes-vergelijken.mjs';

test('blog isolatie-offertes-vergelijken: SEO-pack title/meta/H1, datum 2026-11-10, byline', () => {
  assert.equal(post.title, 'Isolatie-offertes vergelijken: checklist en valkuilen');
  assert.ok(post.title.length < 60);
  assert.ok(post.description.length >= 120 && post.description.length <= 155);
  assert.equal(post.h1, 'Isolatie-offertes vergelijken: checklist voor spouw, dak en vloer');
  assert.equal(post.date, '2026-11-10');
  assert.equal(post.author, 'Redactie VerduurzaamMatch');
});

test('blog isolatie-offertes-vergelijken: H2-outline, interne links, geen partnerlink in de body', () => {
  for (const h of ['Wat in elke isolatie-offerte moet staan', 'Spouw vs dak vs vloer: waar de offerte over verschilt', 'ISDE en meldcode: wat je vóór de start regelt', 'Offertes vergelijken zonder alleen op de eindprijs te staren', 'Zo vraag je offertes aan via de match', 'Bronnen']) assert.ok(post.body.includes(`<h2>${h}</h2>`), h);
  for (const l of ['/verduurzaam-match/', '/spouwmuurisolatie-kosten/', '/dakisolatie-kosten/', '/vloerisolatie-kosten/', '/blog/gevelisolatie-kosten/', '/blog/isde-isolatie-aanvragen/', '/subsidie-isde/', '/isde-subsidie-berekenen/', '/blog/huis-verduurzamen-waar-beginnen/']) assert.ok(post.body.includes(`href="${l}"`), l);
  assert.doesNotMatch(post.body, /sponsored|glp8\.net|\$|reddit/i);
});
