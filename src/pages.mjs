import { SITE, esc, BRAND } from './layout.mjs';
import { MAATREGELEN, SOURCES, WONINGEN, CHECKED, terugverdien } from './lib/maatregelen.js';
import { VRAGEN } from './lib/match.js';

const eur = (n) => '€ ' + n.toLocaleString('nl-NL');
const src = (...keys) => `<p class="src">Bron: ${keys.map((k) => `<a href="${SOURCES[k].url}" rel="noopener">${esc(SOURCES[k].title)}</a>`).join(' · ')}. Gecontroleerd op 15 oktober 2026.</p>`;
const jaren = (t) => (t ? `${t.join('–')} jaar` : '–');
const ORG = { '@type': 'Organization', name: SITE.name, url: SITE.domain + '/' };
const PERSON = { '@type': 'Person', name: SITE.owner, url: SITE.domain + '/over/' };
const img = (slug, alt) => `<div class="hero-img"><img src="/img/${slug}-1200.webp" srcset="/img/${slug}-600.webp 600w, /img/${slug}-1200.webp 1200w" sizes="(max-width:760px) 100vw, 740px" width="1200" height="630" alt="${esc(alt)}" fetchpriority="high"></div>`;
const matchCta = `<div class="offerte"><h3>Welke stap past bij jouw huis?</h3><p>Vijf vragen, direct advies met kosten en terugverdientijd.</p><a class="btn sun" href="/verduurzaam-match/">Doe de verduurzaam-match</a></div>`;

function tabel(id) {
  const m = MAATREGELEN[id];
  const rows = Object.entries(WONINGEN).filter(([w]) => w !== 'app')
    .map(([w, n]) => `<tr><td>${n}</td><td>${eur(m.kosten[w])}</td><td>${m.subsidie[w] ? eur(m.subsidie[w]) : '–'}</td><td>${eur(m.besparing[w])}</td><td>${jaren(terugverdien(m, w))}</td></tr>`).join('');
  return `<div class="tbl"><table><thead><tr><th>Woning</th><th>Kosten</th><th>Subsidie</th><th>Besparing per jaar</th><th>Terugverdientijd</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ---- Gidsen ----
export const GIDSEN = [
  {
    slug: 'spouwmuurisolatie-kosten', id: 'spouw', crumb: 'Spouwmuurisolatie',
    title: 'Spouwmuurisolatie kosten: prijs, subsidie en besparing',
    h1: 'Spouwmuurisolatie kosten: prijs, subsidie en besparing',
    description: 'Wat kost spouwmuurisolatie per woningtype, hoeveel ISDE-subsidie krijg je en hoe snel verdien je het terug? Cijfers van Milieu Centraal.',
    alt: 'Doorsnede van een spouwmuur die wordt gevuld met isolatiemateriaal',
    body: () => `<p class="lead">Een isolatiebedrijf blaast via kleine gaatjes in de voegen isolatie in de spouw. Klaar in één dag, zonder rommel binnen.</p>
<h2>Kosten en terugverdientijd</h2>${tabel('spouw')}
<p>Terugverdientijd: met subsidie – zonder subsidie. Besparing bij een gasprijs van € 1,37 per m³.</p>
<h2>Kan het bij jou?</h2>
<ul><li>Je hebt een spouw van 4 tot 6 cm. Huizen van voor 1920 hebben vaak geen spouw.</li><li>De spouw is leeg of matig gevuld (bijvullen kan soms).</li><li>Laat de muur vooraf inspecteren, bijvoorbeeld met een camera.</li></ul>
<h2>Subsidie</h2><p>ISDE geeft € 5,25 per m² (minimaal 10 m²). Combineer je binnen 24 maanden met een tweede maatregel, dan verdubbelt het bedrag. Kies geen UF-schuim: daarvoor stopte de subsidie per 1 april 2026.</p>
<h2>Offertes</h2><ol class="steps"><li>Vraag minstens 2 gecertificeerde bedrijven (Insula of SKG-IKOB).</li><li>Laat meldcode en m² op de factuur zetten.</li><li>Maak een foto tijdens het werk voor je ISDE-aanvraag.</li></ol>
${matchCta}${src('spouw', 'isdeIsolatie')}`,
  },
  {
    slug: 'dakisolatie-kosten', id: 'dak', crumb: 'Dakisolatie',
    title: 'Dakisolatie kosten: prijzen, subsidie en terugverdientijd',
    h1: 'Dakisolatie kosten: prijzen, subsidie en terugverdientijd',
    description: 'Kosten van dakisolatie voor een schuin dak per woningtype, de ISDE-subsidie en wat je per jaar bespaart. Met cijfers van Milieu Centraal.',
    alt: 'Schuin dak met een dikke laag isolatie onder de pannen',
    body: () => `<p class="lead">Warmte stijgt op. Zonder goede dakisolatie verdwijnt een groot deel via het dak.</p>
<h2>Kosten en terugverdientijd</h2>${tabel('dak')}
<p>Isolatie van een schuin dak naar Rd 3,8, uitbesteed. Zelf doen kost bij een hoekwoning zo'n € 1.700 aan materiaal.</p>
<h2>Welke aanpak?</h2>
<ul><li><strong>Zolder bewoond:</strong> isoleer het dak, van binnen of bij nieuwe pannen van buiten.</li><li><strong>Zolder alleen opslag:</strong> isoleer de zoldervloer. Even veel besparing, lagere kosten.</li><li><strong>Plat dak:</strong> altijd van buiten, door een vakbedrijf.</li></ul>
<h2>Subsidie</h2><p>ISDE: € 16,25 per m² dakisolatie (minimaal 20 m², maximaal 200 m²), € 4 per m² voor een zoldervloer. Bij een tweede maatregel binnen 24 maanden verdubbelt het.</p>
${matchCta}${src('dak', 'isdeIsolatie')}`,
  },
  {
    slug: 'vloerisolatie-kosten', id: 'vloer', crumb: 'Vloerisolatie',
    title: 'Vloerisolatie kosten: wat betaal en bespaar je?',
    h1: 'Vloerisolatie kosten: wat betaal en bespaar je?',
    description: 'Vloerisolatie per woningtype: kosten, ISDE-subsidie, besparing en terugverdientijd. Plus wanneer je kruipruimte geschikt is.',
    alt: 'Kruipruimte met isolatieplaten tegen de onderkant van de vloer',
    body: () => `<p class="lead">Isolatie onder de vloer houdt kou en vocht uit de kruipruimte tegen. Je merkt het meteen aan je voeten.</p>
<h2>Kosten en terugverdientijd</h2>${tabel('vloer')}
<p>Uitbesteed, naar Rd 3,5. Zelf doen kost bij een hoekwoning zo'n € 1.100 aan materiaal.</p>
<h2>Is je kruipruimte geschikt?</h2>
<ul><li>Minstens 35 cm hoog onder de balken.</li><li>Een luik waar je door kunt.</li><li>Lager of geen kruipruimte? Dan kan bodemisolatie of isolatie op de vloer.</li></ul>
<h2>Subsidie</h2><p>ISDE: € 5,50 per m² vloerisolatie of € 3 per m² bodemisolatie (samen minimaal 20 m²). Samen met spouwmuurisolatie binnen 24 maanden krijg je het dubbele.</p>
${matchCta}${src('vloer', 'isdeIsolatie')}`,
  },
  {
    slug: 'hybride-warmtepomp-kosten', id: 'hybride', crumb: 'Hybride warmtepomp',
    title: 'Hybride warmtepomp kosten en subsidie in 2026',
    h1: 'Hybride warmtepomp kosten en subsidie in 2026',
    description: 'Wat kost een hybride of volledig elektrische warmtepomp, hoeveel ISDE krijg je in 2026 en wat verandert er in 2027? Cijfers van Milieu Centraal en RVO.',
    alt: 'Buitenunit van een warmtepomp naast een woning met cv-ketel binnen',
    body: () => {
      const h = MAATREGELEN.hybride, a = MAATREGELEN.allelectric;
      return `<p class="lead">Een hybride warmtepomp werkt samen met je cv-ketel en bespaart zo'n 60 à 70% gas voor verwarming.</p>
<h2>Kosten en terugverdientijd</h2>
<div class="tbl"><table><thead><tr><th>Type</th><th>Kosten</th><th>Subsidie 2026</th><th>Besparing per jaar</th><th>Terugverdientijd</th></tr></thead><tbody>
<tr><td>Hybride, 4 kW</td><td>${eur(h.kosten.hoek)}</td><td>${eur(h.subsidie.hoek)}</td><td>${eur(h.besparing.hoek)}</td><td>${jaren(terugverdien(h, 'hoek'))}</td></tr>
<tr><td>Volledig elektrisch, 8 kW</td><td>${eur(a.kosten.hoek)}</td><td>${eur(a.subsidie.hoek)}</td><td>${eur(a.besparing.hoek)}</td><td>${jaren(terugverdien(a, 'hoek'))}</td></tr>
</tbody></table></div>
<p>Cijfers voor een hoekwoning: hybride bij matige isolatie, volledig elektrisch bij goede isolatie. Inclusief btw en plaatsen.</p>
<h2>Hybride of volledig elektrisch?</h2>
<ul><li><strong>Hybride:</strong> kan bijna altijd, ook bij matige isolatie.</li><li><strong>Volledig elektrisch:</strong> pas bij redelijke isolatie: dak en vloer Rc 2,5 of meer, geïsoleerde spouw en hr++-glas.</li><li>Is je cv-ketel nog goed? Begin dan eerst met isoleren.</li></ul>
<h2>Subsidie: 2026 en 2027</h2>
<p>In 2026: € 1.025 + € 225 per kW + € 200 bij een A+++-label. Vanaf 2027 wil het kabinet de lucht-waterwarmtepomp verlagen naar € 120 per kW. Koop je vóór 31 december 2026 en installeer je in 2027, dan geldt het bedrag van 2026. Die wijzigingen zijn nog voorgenomen.</p>
${matchCta}${src('hybride', 'allelectric', 'isde2027')}`;
    },
  },
  {
    slug: 'zonnepanelen-na-2027', id: 'zon', crumb: 'Zonnepanelen na 2027',
    title: 'Zonnepanelen na 2027: lonen ze zonder saldering?',
    h1: 'Zonnepanelen na 2027: lonen ze zonder saldering?',
    description: 'De salderingsregeling stopt op 1 januari 2027. Wat leveren zonnepanelen daarna op en hoe snel verdien je ze terug? Cijfers van Milieu Centraal.',
    alt: 'Zonnepanelen op een schuin dak met de zon erboven',
    body: () => `<p class="lead">Vanaf 1 januari 2027 mag je niet meer salderen. Teruggeleverde stroom levert dan weinig op; zelf verbruiken loont.</p>
<h2>Kosten en opbrengst vanaf 2027</h2>
<div class="tbl"><table><thead><tr><th>Panelen</th><th>Kosten</th><th>Opwek per jaar</th><th>Besparing per jaar</th><th>Terugverdientijd</th></tr></thead><tbody>
<tr><td>6</td><td>€ 2.500</td><td>2.300 kWh</td><td>€ 170</td><td>15 jaar</td></tr>
<tr><td>8</td><td>€ 3.200</td><td>3.000 kWh</td><td>€ 190</td><td>17 jaar</td></tr>
<tr><td>10</td><td>€ 3.800</td><td>3.800 kWh</td><td>€ 260</td><td>15 jaar</td></tr>
</tbody></table></div>
<p>Bij 30% eigen verbruik en panelen van 435 Wp. Zonnepanelen gaan zo'n 25 jaar mee. Er is geen subsidie; je betaalt 0% btw.</p>
<h2>Zo haal je er meer uit</h2>
<ol class="steps"><li>Leg panelen oost-west: meer stroom in de ochtend en avond.</li><li>Verschuif verbruik naar de middag (wasmachine, vaatwasser, auto laden).</li><li>Kijk naar je contract: terugleververgoeding en terugleverkosten verschillen sterk.</li></ol>
${matchCta}${src('zon', 'saldering')}`,
  },
  {
    slug: 'thuisbatterij-terugverdienen', id: 'batterij', crumb: 'Thuisbatterij',
    title: 'Thuisbatterij terugverdienen: wanneer loont het?',
    h1: 'Thuisbatterij terugverdienen: wanneer loont het?',
    description: 'Na het einde van de saldering lijkt een thuisbatterij logisch. Verdien je hem terug? Het eerlijke antwoord, met de bron.',
    alt: 'Thuisbatterij aan de muur, gekoppeld aan zonnepanelen',
    body: () => `<p class="lead">Kort antwoord: volgens Milieu Centraal verdien je een thuisbatterij nu hoogstwaarschijnlijk niet terug.</p>
<h2>Waarom niet?</h2>
<ul><li>Een batterij is duur ten opzichte van wat je bespaart op stroom.</li><li>In de zomer wek je meer op dan de batterij kan opslaan, in de winter te weinig om hem te vullen.</li><li>Dat geldt ook voor grotere batterijen die handelen op de energiemarkt.</li></ul>
<h2>Wanneer kan het wel?</h2>
<p>Als je minder afhankelijk van het net wilt zijn of veel stroom 's avonds gebruikt. Weet dan dat het een keuze is, geen investering. Isoleren of een warmtepomp leveren meer op.</p>
<h2>Eerst dit</h2><ol class="steps"><li>Isoleer de plekken zonder isolatie.</li><li>Overweeg een (hybride) warmtepomp.</li><li>Verbruik zonnestroom slim op het moment zelf.</li></ol>
${matchCta}${src('batterij')}`,
  },
];

export const gidsPages = GIDSEN.map((g) => ({
  path: `/${g.slug}/`, title: g.title, h1: g.h1, crumb: g.crumb, description: g.description, og: g.slug, parents: [['/gidsen/', 'Gidsen']], navPath: '/gidsen/', ogType: 'article',
  schema: [{ '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, image: `${SITE.domain}/og/${g.slug}.png`, datePublished: '2026-10-15', dateModified: SITE.updated, author: PERSON, publisher: ORG, inLanguage: 'nl' }],
  body: `<article><h1>${esc(g.h1)}</h1>${img(g.slug, g.alt)}<p class="src">Door ${SITE.owner} · 15 oktober 2026</p>${g.body()}</article>`,
}));

export const gidsHub = {
  path: '/gidsen/', title: 'Gidsen verduurzamen: isolatie, warmtepomp, zonnepanelen', h1: 'Gidsen', crumb: 'Gidsen', og: 'home',
  description: 'Korte gidsen over spouw-, dak- en vloerisolatie, de hybride warmtepomp, zonnepanelen na 2027 en de thuisbatterij.',
  body: `<h1>Gidsen</h1><div class="grid">${GIDSEN.map((g) => `<a class="card link" href="/${g.slug}/"><img src="/img/${g.slug}-600.webp" width="600" height="315" alt="" loading="lazy"><h3>${esc(g.crumb)}</h3><p>${esc(MAATREGELEN[g.id].kort)}</p></a>`).join('')}</div>`,
};

// ---- Home ----
export const home = {
  path: '/', title: 'VerduurzaamMatch: welke verduurzaming past bij jouw huis?', og: 'home',
  description: 'Isoleren, warmtepomp, zonnepanelen of thuisbatterij? Doe de verduurzaam-match en zie welke stap eerst, met kosten en terugverdientijd van Milieu Centraal.',
  schema: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE.name, url: SITE.domain + '/', inLanguage: 'nl', publisher: ORG }],
  body: `<section class="hero"><h1><span class="brand">${BRAND}</span><span class="sr"> – </span><span class="tagline" style="display:block">${esc(SITE.tagline)}</span></h1>
<p class="lead">Vijf vragen over je huis. Je ziet welke maatregel het meeste oplevert, wat hij kost en hoe snel je hem terugverdient.</p>
<div class="actions"><a class="btn sun" href="/verduurzaam-match/">Start de match</a><a class="btn ghost" href="/subsidie-isde/">Subsidie bekijken</a></div>
${img('home', 'Huis met geïsoleerd dak, warmtepomp en zonnepanelen')}</section>
<h2>Zo werkt het</h2>
<ol class="steps"><li>Beantwoord 5 vragen over je woning en je doel.</li><li>Zie welke stap eerst, met kosten, subsidie en terugverdientijd.</li><li>Lees de gids en vraag offertes aan.</li></ol>
<div class="note"><strong>Let op 2027:</strong> de salderingsregeling stopt op 1 januari en de ISDE voor warmtepompen gaat waarschijnlijk omlaag. <a href="/subsidie-isde/">Wat dat betekent</a></div>
<h2>Gidsen</h2>
<div class="grid">${GIDSEN.map((g) => `<a class="card link" href="/${g.slug}/"><img src="/img/${g.slug}-600.webp" width="600" height="315" alt="" loading="lazy"><h3>${esc(g.crumb)}</h3><p>${esc(MAATREGELEN[g.id].kort)}</p></a>`).join('')}</div>
<h2>Waarom VerduurzaamMatch?</h2>
<ul><li><strong>Cijfers van Milieu Centraal en RVO</strong>, met bronlink.</li><li><strong>Volgorde op wat het oplevert</strong>, nooit op vergoeding.</li><li><strong>Gratis en zonder account.</strong></li></ul>`,
};

// ---- Quiz ----
const fs = Object.entries(VRAGEN).map(([k, v]) => `<fieldset><legend>${esc(v.label)}</legend><div class="opts">${Object.entries(v.opties).map(([ok, ol]) => `<label><input type="radio" name="${k}" value="${ok}" required><span>${esc(ol)}</span></label>`).join('')}</div></fieldset>`).join('');
export const quiz = {
  path: '/verduurzaam-match/', title: 'Verduurzaam-match: welke stap eerst voor jouw huis?', h1: 'Verduurzaam-match', crumb: 'Verduurzaam-match', og: 'match',
  description: 'Vijf vragen over je woning. Direct advies welke verduurzaming eerst, met kosten, ISDE-subsidie en terugverdientijd.',
  scripts: ['/js/quiz.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Verduurzaam-match', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, url: SITE.domain + '/verduurzaam-match/' }],
  body: `<h1>Verduurzaam-match</h1><p class="lead">Welke stap levert in jouw huis het meeste op?</p>
<form class="quiz" id="form" novalidate>${fs}<button class="btn" type="submit">Toon mijn advies</button></form>
<div class="result" id="result" aria-live="polite"></div>
<noscript><p class="note">Zet JavaScript aan voor het advies, of lees de <a href="/gidsen/">gidsen</a>.</p></noscript>
${src('spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon', 'batterij')}`,
};

// ---- Subsidie ----
export const subsidie = {
  path: '/subsidie-isde/', title: 'ISDE-subsidie 2026: bedragen en wijzigingen in 2027', h1: 'ISDE-subsidie 2026', crumb: 'ISDE-subsidie', og: 'subsidie-isde',
  description: 'Alle ISDE-bedragen voor isolatie, glas en warmtepompen in 2026, de verdubbeling bij twee maatregelen en wat er in 2027 verandert. Bron: RVO.',
  body: `<article><h1>ISDE-subsidie 2026: bedragen en wijzigingen</h1>${img('subsidie-isde', 'Huis met een euroteken en een vinkje voor subsidie')}
<p class="lead">Met de ISDE krijg je als eigenaar-bewoner geld terug voor isolatie, een warmtepomp of een zonneboiler. Je vraagt het aan ná de installatie, binnen 24 maanden.</p>
<h2>Isolatie</h2>
<div class="tbl"><table><thead><tr><th>Maatregel</th><th>Per m²</th><th>Oppervlak</th></tr></thead><tbody>
<tr><td>Spouwmuur</td><td>€ 5,25</td><td>10 – 170 m²</td></tr>
<tr><td>Gevel (binnen of buiten)</td><td>€ 20,25</td><td>10 – 170 m²</td></tr>
<tr><td>Dak</td><td>€ 16,25</td><td>20 – 200 m²</td></tr>
<tr><td>Zolder- of vlieringvloer</td><td>€ 4</td><td>20 – 130 m²</td></tr>
<tr><td>Vloer</td><td>€ 5,50</td><td>20 – 130 m²</td></tr>
<tr><td>Bodem</td><td>€ 3</td><td>20 – 130 m²</td></tr>
<tr><td>Hr++-glas</td><td>€ 25</td><td>3 – 45 m²</td></tr>
<tr><td>Triple- of vacuümglas met nieuwe kozijnen</td><td>€ 111</td><td>3 – 45 m²</td></tr>
</tbody></table></div>
<p><strong>Twee maatregelen = dubbel.</strong> Voer je binnen 24 maanden een tweede isolatiemaatregel uit, of combineer je met een warmtepomp, dan verdubbelt het isolatiebedrag. Biobased materiaal geeft een extra bonus.</p>
<h2>Warmtepomp</h2>
<p>Lucht-waterwarmtepomp in 2026: € 1.025 + € 225 per kW + € 200 bij een A+++-label. Een hybride van 4 kW levert zo € 2.125 op. Je krijgt altijd minimaal € 500.</p>
<h2>Wat verandert er in 2027?</h2>
<div class="tbl"><table><thead><tr><th></th><th>2026</th><th>2027 (voorgenomen)</th></tr></thead><tbody>
<tr><td>Lucht-waterwarmtepomp per kW</td><td>€ 225</td><td>€ 120</td></tr>
<tr><td>A+++-bonus</td><td>€ 200</td><td>€ 250</td></tr>
<tr><td>Bonus slimme aansturing</td><td>–</td><td>€ 200</td></tr>
<tr><td>Hr++-glas per m²</td><td>€ 25</td><td>€ 30</td></tr>
<tr><td>Triple-/vacuümglas met kozijnen per m²</td><td>€ 111</td><td>€ 55</td></tr>
</tbody></table></div>
<p>Koop je een warmtepomp of triple glas uiterlijk 31 december 2026 en installeer je in 2027? Dan geldt het bedrag van 2026, met bewijs van aankoop.</p>
<h2>Zonnepanelen en thuisbatterij</h2><p>Geen ISDE. Zonnepanelen hebben 0% btw. De salderingsregeling stopt op 1 januari 2027.</p>
<h2>Zo vraag je het aan</h2><ol class="steps"><li>Check de meldcodelijst vóór je koopt.</li><li>Laat meldcode en m² op de factuur zetten en maak een foto van het werk.</li><li>Vraag aan via rvo.nl met DigiD, binnen 24 maanden.</li></ol>
${matchCta}${src('isde', 'isdeIsolatie', 'isdeWp', 'isde2027', 'saldering')}</article>`,
};

// ---- Statisch ----
export const over = {
  path: '/over/', title: 'Over ons | VerduurzaamMatch', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'Wie er achter VerduurzaamMatch zit en hoe ons team elke week werkt: bronnen, onafhankelijkheid en partnerlinks.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over VerduurzaamMatch', about: ORG }],
  body: `<article><h1>Over ons</h1><p class="lead">VerduurzaamMatch helpt huiseigenaren kiezen welke verduurzaming eerst. Ons team werkt daar elke week aan.</p>
<h2>Wat we elke week doen</h2><ul><li><strong>Cijfers checken</strong> bij Milieu Centraal en RVO: kosten, besparing en subsidiebedragen.</li><li><strong>Nieuwe regels volgen</strong>, zoals het einde van de saldering en de ISDE-wijzigingen voor 2027.</li><li><strong>Gidsen bijwerken</strong> zodra er iets verandert.</li><li><strong>De match testen</strong>, zodat het advies klopt met de bronnen.</li></ul>
<h2>Hoe we werken</h2><ul><li><strong>Alleen officiële bronnen</strong>, met link en controledatum.</li><li><strong>Niets zelf verzonnen.</strong> Is er geen cijfer, dan zeggen we dat.</li><li><strong>Onafhankelijk.</strong> We zijn geen installateur of energiebedrijf.</li><li><strong>Partnerlinks tellen nooit mee</strong> in het advies of de volgorde. Ze hebben altijd het label "partnerlink".</li></ul>
<p>Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></article>`,
};

export const bronnen = {
  path: '/bronnen/', title: 'Bronnen en cijfers | VerduurzaamMatch', h1: 'Bronnen en cijfers', crumb: 'Bronnen', og: 'home',
  description: 'Alle bronnen achter de cijfers op VerduurzaamMatch: Milieu Centraal, RVO en Rijksoverheid.',
  body: `<article><h1>Bronnen en cijfers</h1><p>Alle kosten, besparingen en subsidies komen van deze pagina's. Gecontroleerd op 15 oktober 2026.</p>
<ul>${Object.values(SOURCES).map((s) => `<li><a href="${s.url}" rel="noopener">${esc(s.title)}</a></li>`).join('')}</ul>
<h2>Uitgangspunten</h2><ul><li>Besparing bij een gasprijs van € 1,37 per m³ (verwachting Milieu Centraal voor 2026-2040).</li><li>Terugverdientijd = kosten gedeeld door besparing per jaar, met en zonder subsidie.</li><li>Warmtepomp en hr++-glas: cijfers voor een hoekwoning. Appartement: cijfers van een tussenwoning.</li></ul></article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | VerduurzaamMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home',
  description: 'Hoe VerduurzaamMatch met je gegevens omgaat: geen account, geen tracking zonder toestemming.',
  body: `<article><h1>Privacy en cookies</h1>
<p>VerduurzaamMatch is een website van ${SITE.owner}. Vragen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Welke gegevens?</h2><p>Je antwoorden in de verduurzaam-match blijven in je browser. We slaan ze niet op en sturen ze nergens heen.</p>
<h2 id="cookies">Cookies en statistieken</h2><p>We gebruiken geen tracking- of advertentiecookies. Zetten we later Google Analytics aan, dan alleen na jouw toestemming via een melding. Je keuze bewaren we 12 maanden in je browser en je kunt hem altijd wijzigen.</p>
<h2>Links naar aanbieders</h2><p>Klik je door naar een aanbieder of vraag je daar een offerte aan, dan geldt de privacyverklaring van die aanbieder.</p>
<h2>Hosting</h2><p>De site draait op GitHub Pages. GitHub verwerkt technische gegevens zoals je IP-adres om de site te leveren.</p>
<h2>Je rechten</h2><p>Je mag vragen welke gegevens we van je hebben en die laten verwijderen. Een klacht kun je indienen bij de Autoriteit Persoonsgegevens.</p></article>`,
};

export const disclaimer = {
  path: '/disclaimer/', title: 'Disclaimer | VerduurzaamMatch', h1: 'Disclaimer', crumb: 'Disclaimer', og: 'home',
  description: 'Uitkomsten op VerduurzaamMatch zijn een indicatie op basis van gemiddelden.',
  body: `<article><h1>Disclaimer</h1><p>Kosten, besparingen en terugverdientijden zijn gemiddelden van Milieu Centraal. Jouw huis en energieprijs kunnen anders uitvallen. Subsidiebedragen kunnen wijzigen; check altijd rvo.nl voor je koopt.</p>
<p>VerduurzaamMatch is geen installateur en geeft geen persoonlijk advies. Laat je woning beoordelen door een vakbedrijf.</p>
<p>Partnerlinks hebben het label "partnerlink" en hebben nooit invloed op het advies of de volgorde.</p></article>`,
};

export const notfound = {
  path: '/404.html', title: 'Pagina niet gevonden | VerduurzaamMatch', h1: 'Niet gevonden', noindex: true, og: 'home',
  description: 'Deze pagina bestaat niet.',
  body: `<h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn sun" href="/verduurzaam-match/">Doe de match</a><a class="btn ghost" href="/gidsen/">Naar de gidsen</a><a class="btn ghost" href="/">Homepage</a></div>`,
};
