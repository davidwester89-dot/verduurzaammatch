// Goedgekeurde partnerlinks per aanbieder-id. LEEG zolang er geen goedgekeurde campagne is.
// Voorbeeld (pas invullen na goedkeuring): essent_isolatie: 'https://ds1.nl/c/?...'
// De match leest dit bestand NOOIT: partnerlinks hebben geen invloed op het advies of de volgorde.
export const PARTNERLINKS = {};

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

/** Uitgaande link: partnerlink als die er is (met label), anders de officiële site. */
export function uitgaand(id, partnerlinks = PARTNERLINKS) {
  const a = AANBIEDERS[id];
  if (!a) throw new Error('Onbekende aanbieder ' + id);
  const pl = partnerlinks[id];
  return pl ? { href: pl, rel: 'sponsored noopener', partner: true, naam: a.naam } : { href: a.url, rel: 'noopener', partner: false, naam: a.naam };
}
