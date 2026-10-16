// Ronde 2: rekentools + vergelijkingsoverzicht. Alleen cijfers uit maatregelen.js (Milieu Centraal) en rekenen.js (RVO).
import { SITE, esc, ORG } from './layout.mjs';
import { MAATREGELEN, SOURCES, WONINGEN, CHECKED } from './lib/maatregelen.js';
import { ISDE_ISOLATIE, ISDE_WP, ISDE_CHECKED, MET_CIJFERS, besparing, terugverdientijd, isde, overzicht } from './lib/rekenen.js';
import { icoon } from './lib/iconen.js';
import { fmtDate } from './layout.mjs';

export const ICOON_MAATREGEL = { spouw: 'muur', dak: 'dak', vloer: 'vloer', glas: 'glas', hybride: 'warmtepomp', allelectric: 'stekker', zon: 'zon', batterij: 'batterij' };
const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
const jr = (x) => (x == null ? '–' : `${String(x).replace('.', ',')} jaar`);
const bron = (keys, datum) => `<p class="src">Bron: ${keys.map((k) => `<a href="${SOURCES[k].url}" rel="noopener">${esc(SOURCES[k].title)}</a>`).join(' · ')}. Gecontroleerd op <time datetime="${datum}">${fmtDate(datum)}</time>.</p>`;
const UPDATED = '2026-10-16';
const woningSelect = (id, def = 'tussen') => `<label class="fld"><span>${icoon('huis')} Woningtype</span><select id="${id}" name="woning">${Object.entries(WONINGEN).map(([k, v]) => `<option value="${k}"${k === def ? ' selected' : ''}>${v}</option>`).join('')}</select></label>`;
const app = (name, path, description) => ({ '@context': 'https://schema.org', '@type': 'WebApplication', name, description, url: SITE.domain + path, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', inLanguage: 'nl', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, publisher: ORG });
const base = (p) => ({ parents: [['/rekentools/', 'Rekentools']], navPath: '/rekentools/', lastmod: UPDATED, stamp: { checked: p.checked || CHECKED, updated: UPDATED }, schema: [app(p.h1, p.path, p.description)], ...p });

export const TOOLS = [
  { path: '/besparing-berekenen/', og: 'besparing-berekenen', icon: 'euro', crumb: 'Besparing berekenen', h1: 'Besparing berekenen', kort: 'Tel kosten, subsidie en besparing per jaar op voor de stappen die je overweegt.' },
  { path: '/terugverdientijd-berekenen/', og: 'terugverdientijd-berekenen', icon: 'klok', crumb: 'Terugverdientijd berekenen', h1: 'Terugverdientijd berekenen', kort: 'Hoe snel verdien je een maatregel terug, met jouw offerteprijs of het gemiddelde.' },
  { path: '/isde-subsidie-berekenen/', og: 'isde-subsidie-berekenen', icon: 'rekenmachine', crumb: 'ISDE-subsidie berekenen', h1: 'ISDE-subsidie berekenen', kort: 'Vul je m² of het vermogen van je warmtepomp in en zie de ISDE-indicatie voor 2026.' },
];
/** Blok met links naar de rekentools, voor in de gidsen. */
export function toolLinks(id) {
  const t = id === 'batterij' ? [] : TOOLS.filter((x) => !(x.path === '/isde-subsidie-berekenen/' && id === 'zon'));
  return `<div class="tools"><p class="fh">${icoon('rekenmachine')} Zelf rekenen</p><ul>${t.map((x) => `<li><a href="${x.path}${id && x.path !== '/isde-subsidie-berekenen/' ? `?m=${id}` : ''}">${esc(x.crumb)}</a></li>`).join('')}<li><a href="/vergelijken/">Alle maatregelen vergelijken</a></li></ul></div>`;
}

// ---- Besparing ----
const defB = ['spouw', 'dak'];
const besDef = besparing(defB, 'tussen');
export const besparingPage = base({
  path: TOOLS[0].path, og: TOOLS[0].og, crumb: TOOLS[0].crumb, h1: TOOLS[0].h1,
  title: 'Besparing berekenen: wat levert verduurzamen op?',
  description: 'Kies je woningtype en de maatregelen die je overweegt. Je ziet kosten, ISDE-subsidie en besparing per jaar, met cijfers van Milieu Centraal.',
  scripts: ['/js/rekentools.js'],
  body: `<article><h1>${icoon('euro', 'ico h')} Besparing berekenen</h1><p class="lead">Welke isolatie levert nu écht het meeste op? Kies je woningtype en de stappen die je overweegt.</p>
<form class="calc" data-tool="besparing" novalidate>${woningSelect('b-woning')}
<fieldset><legend>Maatregelen</legend><div class="checks">${MET_CIJFERS.map((id) => `<label><input type="checkbox" name="m" value="${id}"${defB.includes(id) ? ' checked' : ''}><span>${icoon(ICOON_MAATREGEL[id])} ${esc(MAATREGELEN[id].naam)}</span></label>`).join('')}</div>
<p class="src">Hybride en volledig elektrisch sluiten elkaar uit; kies er één.</p></fieldset></form>
<div class="out" id="out" aria-live="polite"><div class="nums"><div><b>${eur(besDef.kosten)}</b><span>kosten</span></div><div><b>${eur(besDef.subsidie)}</b><span>subsidie</span></div><div><b>${eur(besDef.besparing)}</b><span>besparing per jaar</span></div></div><p class="src">Voorbeeld: tussenwoning, spouwmuur- en dakisolatie.</p></div>
<h2>Zo rekenen we</h2><ul><li>Kosten, subsidie en besparing zijn de gemiddelden van Milieu Centraal per woningtype; appartement = tussenwoning.</li><li>Besparing bij een gasprijs van € 1,37 per m³ (verwachting Milieu Centraal 2026-2040).</li><li>Glas en warmtepompen: cijfers voor een hoekwoning. Hr++-glas bespaart € 90 vanaf dubbel glas, tot € 350 vanaf enkel glas.</li><li>Stappen versterken elkaar soms: na isoleren bespaart een warmtepomp minder gas. De optelsom is dus een bovengrens.</li></ul>
<p>Wil je weten welke stap eerst? <a href="/verduurzaam-match/">Doe de check</a> of <a href="/vergelijken/">vergelijk alle maatregelen</a>.</p>
${bron(['spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon'], CHECKED)}</article>`,
});

// ---- Terugverdientijd ----
const tvDef = terugverdientijd({ kosten: MAATREGELEN.spouw.kosten.tussen, subsidie: MAATREGELEN.spouw.subsidie.tussen, besparing: MAATREGELEN.spouw.besparing.tussen });
export const terugverdienPage = base({
  path: TOOLS[1].path, og: TOOLS[1].og, crumb: TOOLS[1].crumb, h1: TOOLS[1].h1,
  title: 'Terugverdientijd berekenen: isolatie en warmtepomp',
  description: 'Bereken hoe snel je isolatie, een (hybride) warmtepomp of zonnepanelen terugverdient. Met je eigen offerteprijs of het gemiddelde van Milieu Centraal.',
  scripts: ['/js/rekentools.js'],
  body: `<article><h1>${icoon('klok', 'ico h')} Terugverdientijd berekenen</h1><p class="lead">Ben je bang dat je te veel betaalt? Vul je offerteprijs in en zie hoe snel je hem terugverdient.</p>
<form class="calc" data-tool="terugverdien" novalidate>
<label class="fld"><span>${icoon('doel')} Maatregel</span><select name="m">${MET_CIJFERS.map((id) => `<option value="${id}"${id === 'spouw' ? ' selected' : ''}>${esc(MAATREGELEN[id].naam)}</option>`).join('')}</select></label>
${woningSelect('t-woning')}
<label class="fld"><span>${icoon('factuur')} Jouw offerteprijs (optioneel)</span><input name="kosten" inputmode="decimal" placeholder="Gemiddelde: € ${MAATREGELEN.spouw.kosten.tussen.toLocaleString('nl-NL')}" autocomplete="off"></label>
<label class="fld"><span>${icoon('euro')} Subsidie (optioneel)</span><input name="subsidie" inputmode="decimal" placeholder="Gemiddelde: € ${MAATREGELEN.spouw.subsidie.tussen.toLocaleString('nl-NL')}" autocomplete="off"></label>
</form>
<div class="out" id="out" aria-live="polite"><div class="nums"><div><b>${jr(tvDef.met)}</b><span>met subsidie</span></div><div><b>${jr(tvDef.zonder)}</b><span>zonder subsidie</span></div><div><b>${eur(MAATREGELEN.spouw.besparing.tussen)}</b><span>besparing per jaar</span></div></div><p class="src">Voorbeeld: spouwmuurisolatie, tussenwoning, gemiddelde prijs.</p></div>
<h2>Zo rekenen we</h2><ul><li>Terugverdientijd = (kosten − subsidie) ÷ besparing per jaar.</li><li>De besparing per jaar is altijd het gemiddelde van Milieu Centraal (gasprijs € 1,37 per m³). Een duurdere offerte bespaart niet meer.</li><li>Laat je subsidie leeg, dan rekenen we met het gemiddelde ISDE-bedrag. Precies uitrekenen? Gebruik de <a href="/isde-subsidie-berekenen/">ISDE-rekenhulp</a>.</li></ul>
${bron(['spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon'], CHECKED)}</article>`,
});

// ---- ISDE ----
const isdeDef = isde({ m2: { spouw: 50, vloer: 45 } });
export const isdePage = base({
  path: TOOLS[2].path, og: TOOLS[2].og, crumb: TOOLS[2].crumb, h1: TOOLS[2].h1, checked: ISDE_CHECKED,
  title: 'ISDE-subsidie berekenen 2026: isolatie en warmtepomp',
  description: 'Bereken je ISDE-subsidie voor spouw-, dak- en vloerisolatie, glas en een warmtepomp in 2026, inclusief de verdubbeling bij twee maatregelen. Tarieven van RVO.',
  scripts: ['/js/rekentools.js'],
  body: `<article><h1>${icoon('rekenmachine', 'ico h')} ISDE-subsidie berekenen</h1><p class="lead">Vul de m² in per maatregel. Je ziet direct de ISDE-indicatie voor 2026, met de verdubbeling bij twee maatregelen.</p>
<form class="calc" data-tool="isde" novalidate>
<fieldset><legend>Isolatie en glas (m²)</legend><div class="m2">${Object.entries(ISDE_ISOLATIE).map(([id, t]) => `<label class="fld"><span>${esc(t.naam)} <small>€ ${String(t.perM2).replace('.', ',')}/m², ${t.min}–${t.max} m²</small></span><input name="${id}" inputmode="decimal" autocomplete="off"${id === 'spouw' ? ' value="50"' : id === 'vloer' ? ' value="45"' : ''}></label>`).join('')}</div></fieldset>
<fieldset><legend>${icoon('warmtepomp')} Lucht-waterwarmtepomp</legend><div class="m2"><label class="fld"><span>Vermogen (kW) <small>leeg = geen warmtepomp</small></span><input name="kw" inputmode="decimal" autocomplete="off"></label><label class="chk"><input type="checkbox" name="aplus"> Energielabel A+++</label></div></fieldset>
<label class="chk"><input type="checkbox" name="samen"> Ik doe binnen 24 maanden nog een tweede isolatiemaatregel of een warmtepomp</label>
</form>
<div class="out" id="out" aria-live="polite"><div class="nums"><div><b>${eur(isdeDef.isolatie)}</b><span>isolatie${isdeDef.dubbel ? ' (verdubbeld)' : ''}</span></div><div><b>${eur(isdeDef.warmtepomp)}</b><span>warmtepomp</span></div><div><b>${eur(isdeDef.totaal)}</b><span>totaal ISDE</span></div></div><p class="src">Voorbeeld: 50 m² spouwmuur en 45 m² vloer.</p></div>
<h2>Zo rekenen we</h2><ul><li>Bedragen per m² en minimale en maximale oppervlakken van RVO, voor uitvoering in 2025 of later. Boven het maximum telt het maximum.</li><li>Vloer en bodem samen minimaal 20 m².</li><li>Twee of meer isolatiemaatregelen, of isolatie met een warmtepomp, binnen 24 maanden: het isolatiebedrag verdubbelt.</li><li>Warmtepomp 2026: € ${ISDE_WP.vast.toLocaleString('nl-NL')} + € ${ISDE_WP.perKw} per kW + € ${ISDE_WP.aplus} bij A+++, minimaal € ${ISDE_WP.minimaal}, volgens het rekenvoorbeeld van RVO. De biobased bonus en meldcode-eisen tellen we niet mee.</li><li>Voor 2027 zijn lagere bedragen voor warmtepompen voorgenomen. Zie <a href="/subsidie-isde/">ISDE-subsidie</a>.</li></ul>
<p class="note">Dit is een indicatie. RVO beslist over je aanvraag; check de meldcodelijst vóór je koopt.</p>
${bron(['isdeIsolatie', 'isdeWp', 'isde2027'], ISDE_CHECKED)}</article>`,
});

export const toolsHub = {
  path: '/rekentools/', title: 'Rekentools verduurzamen: besparing, terugverdientijd, ISDE', h1: 'Rekentools', crumb: 'Rekentools', og: 'rekentools', lastmod: UPDATED, stamp: { checked: CHECKED, updated: UPDATED },
  description: 'Gratis rekentools: bereken je besparing, de terugverdientijd en je ISDE-subsidie. Met cijfers van Milieu Centraal en RVO, zonder account.',
  body: `<h1>Rekentools</h1><p class="lead">Rekenen met de cijfers van Milieu Centraal en RVO. Gratis, zonder account; je invoer blijft in je browser.</p>
<div class="grid">${TOOLS.map((t) => `<a class="card link" href="${t.path}">${icoon(t.icon, 'ico big')}<h2 class="h3">${esc(t.crumb)}</h2><p>${esc(t.kort)}</p></a>`).join('')}<a class="card link" href="/vergelijken/">${icoon('tabel', 'ico big')}<h2 class="h3">Alle maatregelen vergelijken</h2><p>Kosten, subsidie, besparing en terugverdientijd naast elkaar, per woningtype.</p></a></div>
${bron(['spouw', 'hybride', 'zon', 'isdeIsolatie', 'isdeWp'], CHECKED)}`,
};

// ---- Vergelijkingsoverzicht ----
const KOL = [['naam', 'Maatregel'], ['kosten', 'Kosten'], ['subsidie', 'Subsidie'], ['besparing', 'Besparing per jaar'], ['tvMet', 'Terugverdientijd met subsidie'], ['tvZonder', 'Zonder subsidie']];
export function overzichtRijen(woning) {
  return overzicht(woning).map((r) => `<tr><th scope="row"><a href="${r.gids}">${icoon(ICOON_MAATREGEL[r.id])} ${esc(r.naam)}</a>${r.hoek ? '<sup>*</sup>' : ''}</th>${r.kosten == null ? '<td colspan="5">Geen gemiddelde: verdien je volgens Milieu Centraal nu hoogstwaarschijnlijk niet terug.</td>' : `<td data-v="${r.kosten}">${eur(r.kosten)}</td><td data-v="${r.subsidie}">${r.subsidie ? eur(r.subsidie) : '–'}</td><td data-v="${r.besparing}">${eur(r.besparing)}${r.id === 'glas' ? '–350' : ''}</td><td data-v="${r.tvMet}">${jr(r.tvMet)}</td><td data-v="${r.tvZonder}">${jr(r.tvZonder)}</td>`}</tr>`).join('');
}
export const vergelijkPage = {
  path: '/vergelijken/', title: 'Verduurzamen vergelijken: kosten en terugverdientijd', h1: 'Alle maatregelen vergelijken', crumb: 'Vergelijken', og: 'vergelijken', lastmod: UPDATED, stamp: { checked: CHECKED, updated: UPDATED },
  description: 'Isolatie, warmtepomp, zonnepanelen en thuisbatterij naast elkaar: kosten, ISDE-subsidie, besparing en terugverdientijd per woningtype. Sorteerbaar.',
  scripts: ['/js/vergelijk.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'Dataset', name: 'Kosten en terugverdientijd van verduurzamingsmaatregelen per woningtype', description: 'Gemiddelden van Milieu Centraal; ISDE-bedragen van RVO.', url: SITE.domain + '/vergelijken/', isBasedOn: Object.values(SOURCES).slice(0, 8).map((s) => s.url), creator: ORG, dateModified: UPDATED, inLanguage: 'nl', isAccessibleForFree: true }],
  body: `<h1>${icoon('tabel', 'ico h')} Alle maatregelen vergelijken</h1><p class="lead">Welke stap levert in jouw woning het meeste op? Kies je woningtype en sorteer op wat jij belangrijk vindt.</p>
<form class="calc row" id="vf" novalidate>${woningSelect('v-woning')}</form>
<div class="tbl"><table class="sort" id="vt"><caption class="sr">Vergelijking per maatregel, sorteerbaar</caption><thead><tr>${KOL.map(([k, t]) => `<th scope="col"><button type="button" data-k="${k}">${t}</button></th>`).join('')}</tr></thead><tbody>${overzichtRijen('tussen')}</tbody></table></div>
<p class="src">* Cijfers voor een hoekwoning (glas en warmtepompen geeft Milieu Centraal niet per woningtype). Appartement: cijfers van een tussenwoning. Terugverdientijd = (kosten − subsidie) ÷ besparing per jaar, gasprijs € 1,37 per m³. Klik op een kolomkop om te sorteren.</p>
<noscript><p class="note">Zonder JavaScript zie je de tussenwoning. Per woningtype staan de cijfers ook in de <a href="/gidsen/">gidsen</a>.</p></noscript>
<div class="offerte"><h2 class="h3">Welke stap eerst?</h2><p>Goedkoopst is niet altijd slimst. De check kijkt ook naar je bouwjaar, label, budget en doel.</p><a class="btn sun" href="/verduurzaam-match/">Doe de check in 2 minuten</a></div>
<p>${TOOLS.map((t) => `<a href="${t.path}">${esc(t.crumb)}</a>`).join(' · ')}</p>
${bron(['spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon', 'batterij', 'isdeIsolatie', 'isdeWp'], CHECKED)}`,
};
export const toolPages = [toolsHub, besparingPage, terugverdienPage, isdePage, vergelijkPage];
