// Verduurzaam-match: welke stap eerst? Regels volgen het advies van Milieu Centraal:
// eerst de plekken zonder isolatie, dan (hybride) warmtepomp, zonnepanelen vooral bij eigen verbruik, thuisbatterij zelden.
// Partnerlinks of vergoedingen spelen hier NOOIT mee (zie test/match.test.js).
import { MAATREGELEN, terugverdien } from './maatregelen.js';

export const VRAGEN = {
  woning: { label: 'Wat voor woning heb je?', opties: { tussen: 'Tussenwoning', hoek: 'Hoekwoning', twee: '2-onder-1-kap', vrij: 'Vrijstaand', app: 'Appartement' } },
  bouwjaar: { label: 'Bouwjaar?', opties: { voor1975: 'Voor 1975', '1975': '1975 – 1991', '1992': '1992 – 1999', '2000': '2000 of later' } },
  label: { label: 'Energielabel?', opties: { AB: 'A of B', C: 'C', DE: 'D of E', FG: 'F of G', onbekend: 'Weet ik niet' } },
  budget: { label: 'Budget?', opties: { laag: 'Tot € 2.500', midden: '€ 2.500 – 7.500', hoog: 'Meer dan € 7.500' } },
  doel: { label: 'Wat wil je vooral?', opties: { rekening: 'Lagere energierekening', comfort: 'Warmer en comfortabeler', gasvrij: 'Van het gas af', zonnestroom: 'Eigen stroom opwekken' } },
};

const NIVEAU_LABEL = { AB: 'goed', C: 'redelijk', DE: 'matig', FG: 'slecht' };
const NIVEAU_JAAR = { voor1975: 'slecht', '1975': 'matig', '1992': 'redelijk', '2000': 'goed' };
const BUDGET_MAX = { laag: 2500, midden: 7500, hoog: Infinity };

/** Isolatieniveau: het energielabel als dat bekend is, anders het bouwjaar. */
export function niveau({ bouwjaar, label }) {
  return NIVEAU_LABEL[label] || NIVEAU_JAAR[bouwjaar] || 'matig';
}

export function valideer(a) {
  for (const k of Object.keys(VRAGEN)) if (!(a[k] in VRAGEN[k].opties)) return false;
  return true;
}

/** Geeft de top 3 maatregelen met kosten, subsidie, besparing en terugverdientijd. */
export function match(a) {
  if (!valideer(a)) throw new Error('Onvolledige antwoorden');
  const n = niveau(a);
  const slechtMatig = n === 'slecht' || n === 'matig';
  const app = a.woning === 'app';
  const s = {};
  s.spouw = slechtMatig && !app ? 100 : n === 'redelijk' && !app ? 35 : 0;
  s.dak = slechtMatig ? (app ? 30 : 80) : n === 'redelijk' ? 30 : 0;
  s.vloer = slechtMatig ? 70 + (a.doel === 'comfort' ? 15 : 0) : n === 'redelijk' ? 25 : 0;
  s.glas = slechtMatig ? 55 + (app ? 35 : 0) : n === 'redelijk' ? 30 : 0;
  s.hybride = (n === 'matig' || n === 'redelijk' ? 65 : n === 'slecht' ? 40 : 35) + (a.doel === 'gasvrij' || a.doel === 'rekening' ? 8 : 0);
  s.allelectric = n === 'goed' ? (a.doel === 'gasvrij' ? 95 : 70) : n === 'redelijk' ? (a.doel === 'gasvrij' ? 60 : 40) : 0;
  s.zon = app ? 5 : (a.doel === 'zonnestroom' ? 98 : 45);
  s.batterij = a.doel === 'zonnestroom' && !app ? 20 : 0;
  // Budget: een stap die (na subsidie) boven je budget uitkomt, zakt in de lijst.
  for (const [id, m] of Object.entries(MAATREGELEN)) {
    if (m.kosten && m.kosten[a.woning] - m.subsidie[a.woning] > BUDGET_MAX[a.budget]) s[id] -= 30;
  }
  return Object.entries(s).filter(([, v]) => v > 0).sort((x, y) => y[1] - x[1]).slice(0, 3)
    .map(([id]) => {
      const m = MAATREGELEN[id];
      return {
        id, naam: m.naam, kort: m.kort, gids: m.gids, bron: m.bron, hoek: !!m.alleenHoek, app,
        kosten: m.kosten ? m.kosten[a.woning] : null,
        subsidie: m.subsidie ? m.subsidie[a.woning] : null,
        besparing: m.besparing ? m.besparing[a.woning] : null,
        besparingMax: m.besparingMax || null,
        terugverdien: terugverdien(m, a.woning),
      };
    });
}
