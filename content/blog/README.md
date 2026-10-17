# Blog VerduurzaamMatch
Eén bestand per post: `content/blog/<slug>.mjs`, met:
```js
export default {
  slug: 'voorbeeld-slug',            // URL: /blog/voorbeeld-slug/
  title: 'Titel < 60 tekens',
  h1: 'Optioneel: afwijkende H1',   // standaard gelijk aan title
  description: 'Meta-omschrijving 120-155 tekens.',
  date: '2026-10-20',                // ISO, publicatiedatum
  author: 'Redactie VerduurzaamMatch',
  image: 'spouwmuurisolatie-kosten', // optioneel: bestaande naam uit src/assets/img (-600/-1200.webp) en src/assets/og (.png)
  body: `<p>HTML-inhoud, h2's, bronnenlinks…</p>`,
};
```
Daarna: `npm test && npm run build`, commit, push. Sitemap en /blog/ worden automatisch bijgewerkt.
