// Alle cijfers op één plek, letterlijk overgenomen van Milieu Centraal (Kenniscentrum Duurzaam Leven) en RVO.
// Niets zelf verzonnen. Terugverdientijd = kosten / besparing per jaar, met en zonder subsidie.
// Gecontroleerd: 15 oktober 2026. Gasprijs in de MC-besparingen: € 1,37/m3 (verwachting 2026-2040).
export const CHECKED = '2026-10-15';

export const SOURCES = {
  spouw: { title: 'Milieu Centraal – Spouwmuurisolatie', url: 'https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/spouwmuurisolatie/' },
  dak: { title: 'Milieu Centraal – Dakisolatie', url: 'https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/dakisolatie/' },
  vloer: { title: 'Milieu Centraal – Vloerisolatie', url: 'https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/vloerisolatie/' },
  glas: { title: 'Milieu Centraal – Triple-, hr++- of vacuümglas', url: 'https://www.milieucentraal.nl/energie-besparen/isoleren-en-besparen/triple-hr-of-vacuumglas/' },
  hybride: { title: 'Milieu Centraal – Hybride warmtepomp', url: 'https://www.milieucentraal.nl/energie-besparen/duurzaam-verwarmen-en-koelen/hybride-warmtepomp/' },
  allelectric: { title: 'Milieu Centraal – Volledig elektrische warmtepomp', url: 'https://www.milieucentraal.nl/energie-besparen/duurzaam-verwarmen-en-koelen/volledige-warmtepomp/' },
  zon: { title: 'Milieu Centraal – Kosten en opbrengst zonnepanelen', url: 'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/kosten-en-opbrengst-zonnepanelen/' },
  batterij: { title: 'Milieu Centraal – Thuisbatterij', url: 'https://www.milieucentraal.nl/energie-besparen/zonnepanelen/thuisbatterij-zonne-energie-opslaan/' },
  isde: { title: 'RVO – ISDE voor woningeigenaren', url: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren' },
  isdeIsolatie: { title: 'RVO – ISDE isolatiemaatregelen', url: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen' },
  isdeWp: { title: 'RVO – ISDE warmtepomp', url: 'https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp' },
  isde2027: { title: 'RVO – ISDE: wat wijzigt er vanaf 2027?', url: 'https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027' },
  warmtefondsVoorwaarden: { title: 'Nationaal Warmtefonds – Voorwaarden Energiebespaarlening', url: 'https://www.warmtefonds.nl/particulieren/voorwaarden-energiebespaarlening' },
  warmtefondsNul: { title: 'Nationaal Warmtefonds – Energiebespaarlening 0%', url: 'https://www.warmtefonds.nl/particulieren/energiebespaarlening-nul-procent' },
  warmtefondsRente: { title: 'Nationaal Warmtefonds – Actuele rentetarieven', url: 'https://www.warmtefonds.nl/particulieren/actuele-rentetarieven' },
  saldering: { title: 'Rijksoverheid – Salderingsregeling stopt per 1 januari 2027', url: 'https://www.rijksoverheid.nl/onderwerpen/energie-thuis/salderingsregeling' },
};

export const WONINGEN = { tussen: 'Tussenwoning', hoek: 'Hoekwoning', twee: '2-onder-1-kap', vrij: 'Vrijstaand', app: 'Appartement' };
// Milieu Centraal geeft geen aparte cijfers voor appartementen; daar tonen we de tussenwoning.
const T = (tussen, hoek, twee, vrij) => ({ tussen, hoek, twee, vrij, app: tussen });

export const MAATREGELEN = {
  spouw: {
    naam: 'Spouwmuurisolatie', soort: 'isolatie', gids: '/spouwmuurisolatie-kosten/', bron: 'spouw',
    kosten: T(800, 1800, 1900, 2700), subsidie: T(200, 450, 450, 700), besparing: T(240, 575, 575, 800),
    kort: 'Meestal de goedkoopste stap met de snelste terugverdientijd.',
  },
  dak: {
    naam: 'Dakisolatie (schuin dak)', soort: 'isolatie', gids: '/dakisolatie-kosten/', bron: 'dak',
    kosten: T(6000, 6500, 6500, 10000), subsidie: T(850, 900, 950, 1500), besparing: T(460, 480, 510, 750),
    kort: 'Grote besparing; warmte lekt vooral via het dak weg.',
  },
  vloer: {
    naam: 'Vloerisolatie', soort: 'isolatie', gids: '/vloerisolatie-kosten/', bron: 'vloer',
    kosten: T(2150, 2240, 2900, 4200), subsidie: T(260, 280, 350, 500), besparing: T(110, 180, 230, 340),
    kort: 'Warmere voeten en minder vocht uit de kruipruimte.',
  },
  glas: {
    naam: 'Hr++-glas', soort: 'isolatie', gids: '/glasisolatie-kosten/', bron: 'glas', alleenHoek: true,
    // MC: hoekwoning, 22 m2. Besparing € 90 vanaf dubbel glas, € 350 vanaf enkel glas.
    kosten: T(4700, 4700, 4700, 4700), subsidie: T(550, 550, 550, 550), besparing: T(90, 90, 90, 90), besparingMax: 350,
    kort: 'Vooral zinvol als je nog enkel of oud dubbel glas hebt.',
  },
  hybride: {
    naam: 'Hybride warmtepomp', soort: 'warmtepomp', gids: '/hybride-warmtepomp-kosten/', bron: 'hybride', alleenHoek: true,
    kosten: T(6200, 6200, 6200, 6200), subsidie: T(2125, 2125, 2125, 2125), besparing: T(600, 600, 600, 600),
    kort: 'Werkt samen met je cv-ketel; ook in een matig geïsoleerd huis.',
  },
  allelectric: {
    naam: 'Volledig elektrische warmtepomp', soort: 'warmtepomp', gids: '/hybride-warmtepomp-kosten/', bron: 'allelectric', alleenHoek: true,
    kosten: T(12000, 12000, 12000, 12000), subsidie: T(3025, 3025, 3025, 3025), besparing: T(1000, 1000, 1000, 1000),
    kort: 'Helemaal van het gas af; vraagt minstens redelijke isolatie.',
  },
  zon: {
    naam: 'Zonnepanelen', soort: 'zon', gids: '/zonnepanelen-na-2027/', bron: 'zon',
    // MC: 8 panelen € 3.200 → € 190/jaar, 10 panelen € 3.800 → € 260/jaar (vanaf 2027, 30% eigen verbruik). Geen subsidie (0% btw).
    kosten: T(3200, 3800, 3800, 3800), subsidie: T(0, 0, 0, 0), besparing: T(190, 260, 260, 260),
    kort: 'Na 2027 loont het vooral als je de stroom zelf gebruikt.',
  },
  batterij: {
    naam: 'Thuisbatterij', soort: 'batterij', gids: '/thuisbatterij-terugverdienen/', bron: 'batterij',
    kosten: null, subsidie: null, besparing: null,
    kort: 'Volgens Milieu Centraal verdien je hem nu hoogstwaarschijnlijk niet terug.',
  },
};

/** Terugverdientijd in jaren [met subsidie, zonder subsidie], afgerond op hele jaren (min. 1). */
export function terugverdien(m, woning) {
  if (!m.kosten) return null;
  const k = m.kosten[woning], s = m.subsidie[woning], b = m.besparing[woning];
  const r = (x) => Math.max(1, Math.round(x));
  const lo = r((k - s) / (m.besparingMax || b)), hi = r(k / b);
  return lo === hi ? [lo] : [lo, hi];
}
