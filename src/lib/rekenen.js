// Rekentools VerduurzaamMatch. Alleen cijfers die al op de site staan (Milieu Centraal via maatregelen.js, RVO-tarieven hieronder).
import { MAATREGELEN } from './maatregelen.js';

// RVO ISDE 2026 (uitvoering 2025 of later). Bron: RVO ISDE isolatiemaatregelen + 'ISDE: wat wijzigt er vanaf 2027?'. Gecontroleerd 16-10-2026.
export const ISDE_CHECKED = '2026-10-16';
export const ISDE_ISOLATIE = {
  spouw: { naam: 'Spouwmuur', perM2: 5.25, min: 10, max: 170 },
  gevel: { naam: 'Gevel (binnen of buiten)', perM2: 20.25, min: 10, max: 170 },
  dak: { naam: 'Dak', perM2: 16.25, min: 20, max: 200 },
  zolder: { naam: 'Zolder- of vlieringvloer', perM2: 4, min: 20, max: 130 },
  vloer: { naam: 'Vloer', perM2: 5.5, min: 20, max: 130, groep: 'vloerbodem' },
  bodem: { naam: 'Bodem', perM2: 3, min: 20, max: 130, groep: 'vloerbodem' },
  hrglas: { naam: 'Hr++-glas', perM2: 25, min: 3, max: 45 },
  triple: { naam: 'Triple- of vacuümglas met nieuwe kozijnen', perM2: 111, min: 3, max: 45 },
};
export const ISDE_WP = { vast: 1025, perKw: 225, aplus: 200, minimaal: 500 };

const getal = (x) => { const n = Number(String(x ?? '').replace(',', '.')); return Number.isFinite(n) && n > 0 ? n : 0; };

/**
 * ISDE-indicatie. m2: { spouw: 40, dak: 60, ... }, wp: { kw, aplus } of null.
 * Isolatiebedrag verdubbelt bij twee of meer maatregelen (of isolatie + warmtepomp) binnen 24 maanden; `samen` = gebruiker plant dat.
 * Vloer en bodem tellen samen voor het minimum van 20 m².
 */
export function isde({ m2 = {}, wp = null, samen = false } = {}) {
  const regels = [];
  const vb = getal(m2.vloer) + getal(m2.bodem);
  for (const [id, t] of Object.entries(ISDE_ISOLATIE)) {
    const opp = getal(m2[id]);
    if (!opp) continue;
    const voldoet = t.groep === 'vloerbodem' ? vb >= t.min : opp >= t.min;
    const telt = Math.min(opp, t.max);
    regels.push({ id, naam: t.naam, m2: opp, telt, bedrag: voldoet ? Math.round(telt * t.perM2 * 100) / 100 : 0, teKlein: !voldoet, afgetopt: opp > t.max });
  }
  const iso = regels.filter((r) => r.bedrag > 0);
  const kw = wp ? getal(wp.kw) : 0;
  const wpBedrag = kw ? Math.max(ISDE_WP.minimaal, ISDE_WP.vast + ISDE_WP.perKw * kw + (wp.aplus ? ISDE_WP.aplus : 0)) : 0;
  const dubbel = iso.length > 0 && (iso.length >= 2 || wpBedrag > 0 || samen);
  const isoTotaal = iso.reduce((s, r) => s + r.bedrag, 0) * (dubbel ? 2 : 1);
  return { regels, dubbel, isolatie: Math.round(isoTotaal), warmtepomp: Math.round(wpBedrag), totaal: Math.round(isoTotaal + wpBedrag) };
}

/** Maatregelen met cijfers (zonder batterij), in vaste volgorde. */
export const MET_CIJFERS = Object.keys(MAATREGELEN).filter((id) => MAATREGELEN[id].kosten);

/** Optelsom kosten/subsidie/besparing voor gekozen maatregelen. Hybride en volledig elektrisch sluiten elkaar uit. */
export function besparing(ids, woning) {
  const lijst = [...new Set(ids)].filter((id) => MET_CIJFERS.includes(id));
  if (lijst.includes('hybride') && lijst.includes('allelectric')) throw new Error('Kies hybride óf volledig elektrisch');
  const rijen = lijst.map((id) => { const m = MAATREGELEN[id]; return { id, naam: m.naam, kosten: m.kosten[woning], subsidie: m.subsidie[woning], besparing: m.besparing[woning], hoek: !!m.alleenHoek }; });
  const som = (k) => rijen.reduce((s, r) => s + r[k], 0);
  return { rijen, kosten: som('kosten'), subsidie: som('subsidie'), besparing: som('besparing') };
}

/** Terugverdientijd in jaren (1 decimaal). kosten: eigen offerte of MC-gemiddelde. */
export function terugverdientijd({ kosten, subsidie = 0, besparing }) {
  const k = getal(kosten), b = getal(besparing), s = getal(subsidie);
  if (!k || !b) return null;
  return { met: Math.max(0, Math.round(((k - Math.min(s, k)) / b) * 10) / 10), zonder: Math.round((k / b) * 10) / 10 };
}

/** Rijen voor het vergelijkingsoverzicht. */
export function overzicht(woning) {
  return Object.entries(MAATREGELEN).map(([id, m]) => {
    if (!m.kosten) return { id, naam: m.naam, gids: m.gids, kosten: null, subsidie: null, besparing: null, tvMet: null, tvZonder: null };
    const t = terugverdientijd({ kosten: m.kosten[woning], subsidie: m.subsidie[woning], besparing: m.besparing[woning] });
    return { id, naam: m.naam, gids: m.gids, hoek: !!m.alleenHoek, kosten: m.kosten[woning], subsidie: m.subsidie[woning], besparing: m.besparing[woning], tvMet: t.met, tvZonder: t.zonder };
  });
}
export function sorteer(rijen, kolom, op = true) {
  return [...rijen].sort((a, b) => {
    const x = a[kolom], y = b[kolom];
    if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1;
    if (typeof x === 'string') return op ? x.localeCompare(y, 'nl') : y.localeCompare(x, 'nl');
    return op ? x - y : y - x;
  });
}
