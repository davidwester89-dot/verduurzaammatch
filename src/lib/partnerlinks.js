// Goedgekeurde partnerlinks per aanbieder-id. Alleen invullen na goedkeuring van de campagne voor media VerduurzaamMatch (Daisycon 438420).
// Waarde: één URL (geldt voor alle maatregelen in `voor`), of per maatregel { spouw: 'https://…', … }: dan alleen bij die maatregelen.
// De match leest dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
// Huisassist.nl: Daisycon 22344, goedgekeurd 23-10-2026.
// Daisycon-trackinglink, deeplink /isolatie/vergelijk/ (huisassist.nl/isolatie/vergelijk/).
export const HUISASSIST_ISOLATIE = 'https://glp8.net/c/?si=22344&li=1962824&wi=438420&ws=&dl=isolatie%2Fvergelijk%2F';
// Daisycon-trackinglink, deeplink /warmtepomp/vergelijk/ (huisassist.nl/warmtepomp/vergelijk/).
export const HUISASSIST_WARMTEPOMP = 'https://glp8.net/c/?si=22344&li=1962824&wi=438420&ws=&dl=warmtepomp%2Fvergelijk%2F';
export const PARTNERLINKS = {
  huisassist: { spouw: HUISASSIST_ISOLATIE, dak: HUISASSIST_ISOLATIE, vloer: HUISASSIST_ISOLATIE, hybride: HUISASSIST_WARMTEPOMP, allelectric: HUISASSIST_WARMTEPOMP },
};

/** Partnerlink van een aanbieder voor een maatregel (of null). Een losse URL geldt voor elke maatregel. */
export function partnerUrl(id, maatregel, partnerlinks = PARTNERLINKS) {
  const pl = partnerlinks[id];
  if (!pl) return null;
  if (typeof pl === 'string') return pl;
  return maatregel ? pl[maatregel] || null : null;
}
/** Alle partnerlink-URL's (voor privacy-netwerkdetectie en tests). */
export const alleUrls = (partnerlinks = PARTNERLINKS) => [...new Set(Object.values(partnerlinks).flatMap((pl) => (typeof pl === 'string' ? [pl] : Object.values(pl))))];

// Officiële sites (worden gebruikt zolang er geen partnerlink is).
export const AANBIEDERS = {
  essent_isolatie: { naam: 'Essent Isolatie', url: 'https://www.essent.nl/isolatie', voor: ['spouw', 'dak', 'vloer', 'glas'] },
  huisassist: { naam: 'Huisassist', url: 'https://www.huisassist.nl/', voor: ['hybride', 'allelectric', 'spouw', 'dak', 'vloer'] },
  quatt: { naam: 'Quatt', url: 'https://www.quatt.io/', voor: ['hybride'] },
  coen: { naam: 'Coen+', url: 'https://www.coenplus.nl/', voor: ['hybride', 'allelectric'] },
  offertevergelijker: { naam: 'Offertevergelijker', url: 'https://www.offertevergelijker.nl/', voor: ['zon', 'spouw', 'dak', 'vloer', 'glas'] },
  nextenergy: { naam: 'NextEnergy', url: 'https://www.nextenergy.nl/', voor: ['batterij'] },
  homewizard: { naam: 'HomeWizard', url: 'https://www.homewizard.com/nl/', voor: ['batterij'] },
};

/** Uitgaande link: partnerlink als die er is (voor deze maatregel), anders de officiële site. */
export function uitgaand(id, partnerlinks = PARTNERLINKS, maatregel) {
  const a = AANBIEDERS[id];
  if (!a) throw new Error('Onbekende aanbieder ' + id);
  const pl = partnerUrl(id, maatregel, partnerlinks);
  return pl ? { href: pl, rel: 'sponsored nofollow noopener', partner: true, naam: a.naam } : { href: a.url, rel: 'noopener', partner: false, naam: a.naam };
}

// Partnerzin: geen label per knop, maar precies één korte zin direct na elk blok waarin een partnerlink staat
// (rel sponsored). Werkt automatisch: staat er geen partnerlink in een blok, dan komt er ook geen zin.
export const PARTNER_NOOT = 'Sommige links zijn partnerlinks; dat verandert de volgorde nooit.';
export const NOOT_HTML = `<p class="pnoot">${PARTNER_NOOT}</p>`;
const SPONSORED = /<a\s[^>]*rel="[^"]*\bsponsored\b/;
/** Eén blok als string: de zin erachter als er een partnerlink in staat. */
export const metNoot = (html) => (SPONSORED.test(html) ? html + NOOT_HTML : html);
/** Blokken (op class) met knoppen of links naar aanbieders. Het buitenste blok telt; binnen een blok komt geen tweede zin. */
export const BLOKKEN = ['offerteblok'];
/** Begin en eind van elk blok in html (buitenste eerst), en of er een partnerlink in staat. kaal = ook <p>, <ul>, <ol> zonder class. */
export function partnerBlokken(html, { blokken = BLOKKEN, kaal = false } = {}) {
  const cls = `<(div|ol|ul|p|aside|section)\\s[^>]*class="(?:[^"]*\\s)?(?:${blokken.join('|')})(?:\\s[^"]*)?"[^>]*>`;
  const re = new RegExp(kaal ? `${cls}|<(p|ul|ol)>` : cls, 'g');
  const res = []; let m;
  while ((m = re.exec(html))) {
    const tag = m[1] || m[2];
    const t = new RegExp(`<${tag}\\b|</${tag}>`, 'g'); t.lastIndex = m.index;
    let d = 0, eind = -1, x;
    while ((x = t.exec(html))) { if (x[0][1] === '/') { if (--d === 0) { eind = x.index + x[0].length; break; } } else d++; }
    if (eind < 0) continue;
    res.push({ start: m.index, end: eind, partner: SPONSORED.test(html.slice(m.index, eind)) });
    re.lastIndex = eind;
  }
  return res;
}
/** Hele pagina: precies één zin direct na elk blok met een partnerlink. */
export function partnerNoten(html, opts) {
  let out = '', i = 0;
  for (const b of partnerBlokken(html, opts)) if (b.partner && !html.startsWith(NOOT_HTML, b.end)) { out += html.slice(i, b.end) + NOOT_HTML; i = b.end; }
  return out + html.slice(i);
}

/** Offerteblok bij een maatregel in de uitslag: alleen aanbieders met een partnerlink voor die maatregel, in vaste volgorde (AANBIEDERS), plus de partnerzin. */
export function offerteBlok(maatregel, partnerlinks = PARTNERLINKS) {
  const ids = Object.keys(AANBIEDERS).filter((a) => AANBIEDERS[a].voor.includes(maatregel) && partnerUrl(a, maatregel, partnerlinks));
  if (!ids.length) return '';
  return metNoot('<p class="offerteblok"><strong>Offerte aanvragen:</strong> ' + ids.map((a) => { const l = uitgaand(a, partnerlinks, maatregel); return `<a href="${l.href}" rel="${l.rel}" data-vendor="${a}">${l.naam}</a>`; }).join(' · ') + '</p>');
}
