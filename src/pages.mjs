import { SITE, esc, BRAND, ORG, AUTHOR, fmtDate, GA_ID } from './layout.mjs';
import { MAATREGELEN, SOURCES, WONINGEN, CHECKED, terugverdien } from './lib/maatregelen.js';
import { VRAGEN } from './lib/match.js';
import { icoon } from './lib/iconen.js';
import { toolLinks } from './tools.mjs';
import { PRIVACY_UPDATED, cookieTabel, partnerNetwerk, grondslag, doorgifte, bewaartermijnen, rechten } from './privacy-avg.mjs';
import { PARTNERLINKS } from './lib/partnerlinks.js';
import { HERO_ART } from './hero-art.mjs';
import { jaarTekst } from './lib/rekenen.js';
const ICOON_VRAAG = { woning: 'huis', bouwjaar: 'kalender', label: 'label', budget: 'euro', doel: 'doel' };

const eur = (n) => '€ ' + n.toLocaleString('nl-NL');
const srcOp = (datum, ...keys) => `<p class="src">Bron: ${keys.map((k) => `<a href="${SOURCES[k].url}" rel="noopener">${esc(SOURCES[k].title)}</a>`).join(' · ')}. Gecontroleerd op ${fmtDate(datum)}.</p>`;
const src = (...keys) => srcOp(CHECKED, ...keys);
const jaren = (t) => (t ? `${t.join('–')} jaar` : '–');

const img = (slug, alt) => `<div class="hero-img"><img src="/img/${slug}-1200.webp" srcset="/img/${slug}-600.webp 600w, /img/${slug}-1200.webp 1200w" sizes="(max-width:760px) 100vw, 740px" width="1200" height="630" alt="${esc(alt)}" fetchpriority="high"></div>`;
const matchCta = `<div class="offerte"><h3>Welke stap past bij jouw huis?</h3><p>Vijf vragen, direct advies met kosten en terugverdientijd.</p><a class="btn sun" href="/verduurzaam-match/">Doe de VerduurzaamMatch</a></div>`;

function tabel(id) {
  const m = MAATREGELEN[id];
  const rows = Object.entries(WONINGEN).filter(([w]) => w !== 'app')
    .map(([w, n]) => `<tr><td>${n}</td><td>${eur(m.kosten[w])}</td><td>${m.subsidie[w] ? eur(m.subsidie[w]) : '–'}</td><td>${eur(m.besparing[w])}</td><td>${jaren(terugverdien(m, w))}</td></tr>`).join('');
  return `<div class="tbl"><table><thead><tr><th>Woning</th><th>Kosten</th><th>Subsidie</th><th>Besparing per jaar</th><th>Terugverdientijd</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// ---- Gidsen ----
// Veelgestelde vragen (optioneel per gids): zichtbaar op de pagina en als FAQPage-schema.
const faqHtml = (faq) => (faq && faq.length ? `<h2>Veelgestelde vragen</h2>${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}` : '');
const GIDSEN_FAQ = {};
// Home: dezelfde vragen als uitklapbare FAQ (details/summary).
const faqAcc = (faq) => `<h2>Veelgestelde vragen</h2>${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}`;
// Spouwmuur-deep-dive (29-10-2026): kosten, subsidie en besparing per woningtype van Milieu Centraal (MAATREGELEN.spouw);
// gasbesparing in m³ per woningtype van dezelfde MC-pagina. Netto en terugverdientijd = onze rekensom.
const SPOUW_M3 = { tussen: 180, hoek: 400, twee: 400, vrij: 600 };
const WON4 = () => Object.entries(WONINGEN).filter(([w]) => w !== 'app');
const spouwKosten = () => { const m = MAATREGELEN.spouw; return `<div class="tbl"><table><thead><tr><th>Woning</th><th>Kosten</th><th>ISDE-subsidie</th><th>Je betaalt netto</th></tr></thead><tbody>${WON4().map(([w, n]) => `<tr><td>${n}</td><td>${eur(m.kosten[w])}</td><td>${eur(m.subsidie[w])}</td><td>${eur(m.kosten[w] - m.subsidie[w])}</td></tr>`).join('')}</tbody></table></div>`; };
const spouwTerug = () => { const m = MAATREGELEN.spouw; return `<div class="tbl"><table><thead><tr><th>Woning</th><th>Minder gas per jaar</th><th>Besparing per jaar</th><th>Terugverdientijd met subsidie</th><th>Zonder subsidie</th></tr></thead><tbody>${WON4().map(([w, n]) => `<tr><td>${n}</td><td>${SPOUW_M3[w]} m³</td><td>${eur(m.besparing[w])}</td><td>${jaarTekst((m.kosten[w] - m.subsidie[w]) / m.besparing[w])}</td><td>${jaarTekst(m.kosten[w] / m.besparing[w])}</td></tr>`).join('')}</tbody></table></div>`; };
const SPOUW_FAQ = [
  ['Kan ik mijn spouwmuur zelf isoleren?', 'Nee. Volgens Milieu Centraal laat je dit altijd doen door een gespecialiseerd isolatiebedrijf. Voor de ISDE moet een bouwbedrijf ook het volledige werk uitvoeren.'],
  ['Mag ik nog UF-schuim laten gebruiken?', 'GGD\'en en Milieu Centraal raden UF-schuim voorlopig af. Sinds 1 april 2026 krijg je er geen ISDE-subsidie meer voor. Alternatieven zijn bijvoorbeeld EPS-parels of inblaasglaswol.'],
  ['Hoeveel beter isoleert een gevulde spouw?', 'Een niet-geïsoleerde spouwmuur heeft volgens Milieu Centraal vaak een isolatiewaarde van 0,35. Met 5 cm isolatie komt daar gemiddeld Rd 1,2 bij, en dan is de Rc-waarde van de gevel 1,55.'],
  ['Kan een geïsoleerde spouwmuur nog beter?', 'Ja. Je kunt spouwmuurisolatie combineren met isolatie aan de binnen- of buitenkant van de gevel. Voor een energieneutraal huis noemt Milieu Centraal minimaal Rc 5, en dat haal je niet met alleen spouwmuurisolatie.'],
];
export const GIDSEN = [
  {
    slug: 'spouwmuurisolatie-kosten', updated: '2026-10-29', checked: '2026-10-29', id: 'spouw', crumb: 'Spouwmuurisolatie',
    title: 'Spouwmuurisolatie kosten 2026: per woningtype en m²',
    h1: 'Spouwmuurisolatie kosten 2026: per woningtype en m²',
    description: 'Wat kost spouwmuurisolatie in 2026? Kosten per woningtype en per m², ISDE-subsidie, terugverdientijd en wanneer je een vleermuizenonderzoek nodig hebt.',
    alt: 'Doorsnede van een spouwmuur die wordt gevuld met isolatiemateriaal',
    faq: SPOUW_FAQ,
    body: () => `<p class="lead">Een isolatiebedrijf blaast via kleine gaatjes in de voegen isolatie in de spouw. Klaar in één dag, zonder rommel binnen.</p>
<h2>Kosten per woningtype</h2>${spouwKosten()}
<p>Gemiddelden van Milieu Centraal voor uitbesteed werk in een standaardsituatie, zonder meerwerk. Milieu Centraal rekent per woningtype met een gemiddelde gevelgrootte en baseert de prijs op een kostenoverzicht van RVO (stand 1 januari 2026). Voor een appartement geeft Milieu Centraal geen apart bedrag. Daar is spouwmuurisolatie volgens Verbeterjehuis een zaak van de VvE.</p>
<p>De subsidie in de tabel geldt voor één maatregel. Laat je binnen 24 maanden ook je <a href="/vloerisolatie-kosten/">vloer</a> of <a href="/dakisolatie-kosten/">dak</a> isoleren, dan verdubbelt hij: bij een hoekwoning € 900 in plaats van € 450 (onze rekensom).</p>
<p><strong>Niet in de prijs:</strong> natuurvriendelijk isoleren. Daarvoor noemt Milieu Centraal € 300 tot € 1.000, afhankelijk van je huis. Een eDNA-test op vleermuizen kost volgens Verbeterjehuis rond de € 350 exclusief btw.</p>
<h2>Prijs per m²</h2>
<p>Milieu Centraal en Verbeterjehuis noemen geen vaste prijs per m², en ook niet hoeveel m² gevel ze per woningtype rekenen. Wat wel per m² vastligt, is de ISDE-subsidie van RVO:</p>
<ul><li>€ 5,25 per m² bij één maatregel, dubbel bij een tweede maatregel binnen 24 maanden.</li><li>€ 1,50 per m² extra voor biobased materiaal. Die bonus verdubbelt niet.</li><li>Minimaal 10 m², subsidie over maximaal 170 m².</li><li>Het nieuwe materiaal heeft minimaal Rd 1,1.</li></ul>
<p><strong>Voorbeeld (onze rekensom):</strong> je laat 50 m² spouwmuur isoleren. Dat geeft 50 × € 5,25 = € 262,50 subsidie, of € 525 met een tweede maatregel. Met biobased materiaal komt er 50 × € 1,50 = € 75 bij.</p>
<p>Offertes vergelijken? Deel de prijs door het aantal m² op de offerte. Laat dat aantal ook op de factuur zetten; dat raadt RVO aan. Alle bedragen staan op <a href="/subsidie-isde/">ISDE-subsidie 2026</a>.</p>
<h2>Terugverdientijd per woningtype</h2>${spouwTerug()}
<p>Gasbesparing en besparing per jaar: Milieu Centraal, voor een huis met een hr-combiketel en een gasprijs van € 1,37 per m³ (de verwachte prijs voor 2026–2040). De terugverdientijd is onze rekensom: prijs na subsidie en volle prijs, gedeeld door de besparing per jaar, afgerond op één decimaal.</p>
<p>Betaal je ook voor natuurvriendelijk isoleren, dan duurt het langer. <strong>Voorbeeld (onze rekensom):</strong> hoekwoning € 1.800 + € 1.000 − € 450 subsidie = € 2.350. Gedeeld door € 575 per jaar is dat ruim 4 jaar. Je bespaart ook minder als je weinig stookt of als er al wat isolatie in de spouw zat.</p>
<p>Milieu Centraal vergelijkt de winst over 25 jaar met 11 procent rente op een spaarrekening. Reken je eigen offerte door met <a href="/terugverdientijd-berekenen/?m=spouw">terugverdientijd berekenen</a>, of tel meerdere maatregelen op met <a href="/besparing-berekenen/">besparing berekenen</a>.</p>
<h2>Kan het bij jou?</h2>
<ul><li>Je hebt een spouw van 4 tot 6 cm. Huizen van voor 1920 hebben vaak alleen enkelsteensmuren, zonder spouw.</li><li>Zit er al oude isolatie in die is gezakt, dan kan bijvullen soms. Soms is het beter de spouw eerst te laten schoonmaken.</li><li>Houtskeletbouw: de dunne luchtspouw van ongeveer 2 cm hoef je niet te laten vullen.</li><li>Laat de muur vooraf inspecteren, bijvoorbeeld met een camera.</li></ul>
<h2>Vleermuizen: wanneer heb je een onderzoek nodig?</h2>
<p>Voor spouwmuurisolatie heb je geen omgevingsvergunning nodig. Maar in je spouw kunnen vleermuizen zitten, en ook gierzwaluwen en huismussen nestelen er soms. Die zijn beschermd. Volgens de Omgevingswet moet je vóór het isoleren zeker weten dat er geen dieren in je spouw verblijven.</p>
<p>Daarvoor is er sinds maart 2025 de eDNA-test. Een gecertificeerd bedrijf neemt met een spons een monster af bij de gaten in je spouwmuur. Een laboratorium zoekt daarin naar sporen van vleermuizen.</p>
<ul><li><strong>Geen sporen:</strong> je mag direct isoleren, zonder extra maatregelen.</li><li><strong>Wel sporen:</strong> meld je bij de provincie. Je hebt dan een omgevingsvergunning nodig en meestal een ecologisch onderzoek. Je kunt ook wachten tot je gemeente een soortenmanagementplan heeft.</li></ul>
<p>Of natuurvriendelijk isoleren in jouw provincie nog kan, verschilt per provincie. De overheid maakt ook nieuwe afspraken over deze aanpak. Vraag daarom bij het Omgevingsloket van je provincie welke regels voor jouw huis gelden.</p>
<h2>Subsidie aanvragen</h2><p>Je vraagt de ISDE aan nadat het werk klaar is, binnen 24 maanden. Je hebt de meldcode van het materiaal nodig en een foto van het werk op je adres. Kies geen UF-schuim: daarvoor krijg je sinds 1 april 2026 geen subsidie meer. Elke stap staat in <a href="/blog/isde-isolatie-aanvragen/">ISDE-subsidie voor isolatie aanvragen</a>.</p>
<h2>Offertes</h2><ol class="steps"><li>Vraag minstens 2 bedrijven om advies bij je thuis, het liefst met een certificaat van Insula of SKG-IKOB.</li><li>Heb je vochtplekken in huis? Meld dat vóór het onderzoek.</li><li>Laat meldcode, m², dikte en isolatiewaarde op de factuur zetten.</li></ol>
<p>Denk je na het isoleren aan een warmtepomp? Een geïsoleerde spouwmuur is een van de punten die Milieu Centraal noemt voor all-electric. Op WarmtepompenMatch lees je <a href="https://warmtepompenmatch.nl/is-mijn-huis-geschikt-voor-een-warmtepomp/">of je huis geschikt is voor een warmtepomp</a>.</p>
${matchCta}${faqHtml(SPOUW_FAQ)}
<h2>Bronnen</h2>
<ul class="src"><li><a href="${SOURCES.spouw.url}" rel="noopener">${esc(SOURCES.spouw.title)}</a></li>
<li><a href="${SOURCES.isdeIsolatie.url}" rel="noopener">${esc(SOURCES.isdeIsolatie.title)}</a></li>
<li><a href="https://www.verbeterjehuis.nl/eigen-huis/isoleren-ventileren-en-zon-weren/gevelisolatie" rel="noopener">Verbeterjehuis – Gevelisolatie</a></li>
<li><a href="https://www.verbeterjehuis.nl/eigen-huis/isoleren-ventileren-en-zon-weren/isoleren-en-natuurbescherming" rel="noopener">Verbeterjehuis – Isoleren en natuurbescherming</a></li>
<li><a href="https://www.volkshuisvestingnederland.nl/actueel/nieuws/2025/07/21/meer-duidelijkheid-over-isoleren-spouwmuren-door-afspraken-rijk-provincies-en-gemeenten" rel="noopener">Rijksoverheid (Volkshuisvesting Nederland) – Meer duidelijkheid over isoleren spouwmuren</a></li></ul>`,
  },
  {
    slug: 'dakisolatie-kosten', updated: '2026-10-20', id: 'dak', crumb: 'Dakisolatie',
    title: 'Dakisolatie kosten: prijzen, subsidie en terugverdientijd',
    h1: 'Dakisolatie kosten: prijzen, subsidie en terugverdientijd',
    description: 'Kosten van dakisolatie voor een schuin dak per woningtype, de ISDE-subsidie en wat je per jaar bespaart. Met cijfers van Milieu Centraal.',
    alt: 'Schuin dak met een dikke laag isolatie onder de pannen',
    body: () => `<p class="lead">Warmte stijgt op. Zonder goede dakisolatie verdwijnt een groot deel via het dak.</p>
<h2>Kosten en terugverdientijd</h2>${tabel('dak')}
<p>Isolatie van een schuin dak naar Rd 3,8, uitbesteed. Zelf doen kost bij een hoekwoning zo'n € 1.700 aan materiaal.</p>
<h2>Welke aanpak?</h2>
<ul><li><strong>Zolder bewoond:</strong> isoleer het dak, van binnen of bij nieuwe pannen van buiten.</li><li><strong>Zolder alleen opslag:</strong> isoleer de zoldervloer. Evenveel besparing, lagere kosten.</li><li><strong>Plat dak:</strong> altijd van buiten, door een vakbedrijf.</li></ul>
<h2>Subsidie</h2><p>ISDE: € 16,25 per m² dakisolatie (minimaal 20 m², maximaal 200 m²), € 4 per m² voor een zoldervloer. Bij een tweede maatregel binnen 24 maanden verdubbelt het.</p>
<p>Eerst isoleren, dan een warmtepomp? Voor all-electric noemt Milieu Centraal minimaal Rc 2,5 in het dak. Hoe je daarna <a href="https://warmtepompenmatch.nl/hybride-of-all-electric/">kiest tussen een hybride en een volledig elektrische warmtepomp</a>, lees je op WarmtepompenMatch.</p>
${matchCta}${src('dak', 'isdeIsolatie')}`,
  },
  {
    slug: 'vloerisolatie-kosten', updated: '2026-10-20', id: 'vloer', crumb: 'Vloerisolatie',
    title: 'Vloerisolatie kosten 2026: prijs, subsidie, besparing',
    h1: 'Vloerisolatie kosten: wat betaal en bespaar je?',
    description: 'Vloerisolatie per woningtype: kosten, ISDE-subsidie, besparing en terugverdientijd. Plus wanneer je kruipruimte geschikt is.',
    alt: 'Kruipruimte met isolatieplaten tegen de onderkant van de vloer',
    body: () => `<p class="lead">Isolatie onder de vloer houdt kou en vocht uit de kruipruimte tegen. Je merkt het meteen aan je voeten.</p>
<h2>Kosten en terugverdientijd</h2>${tabel('vloer')}
<p>Uitbesteed, naar Rd 3,5. Zelf doen kost bij een hoekwoning zo'n € 1.100 aan materiaal.</p>
<h2>Is je kruipruimte geschikt?</h2>
<ul><li>Minstens 35 cm hoog onder de balken.</li><li>Een luik waar je door kunt.</li><li>Lager of geen kruipruimte? Dan kan bodemisolatie of isolatie op de vloer.</li></ul>
<h2>Subsidie</h2><p>ISDE: € 5,50 per m² vloerisolatie of € 3 per m² bodemisolatie (samen minimaal 20 m²). Samen met spouwmuurisolatie binnen 24 maanden krijg je het dubbele.</p>
<p>Ook voor de vloer noemt Milieu Centraal Rc 2,5 als minimum voor een all-electric warmtepomp. Is je huis nog matig geïsoleerd, dan kan een hybride. Zie <a href="https://warmtepompenmatch.nl/hybride-of-all-electric/">hybride of all-electric: wat past na het isoleren</a> op WarmtepompenMatch.</p>
${matchCta}${src('vloer', 'isdeIsolatie')}`,
  },
  {
    slug: 'zonnepanelen-na-2027', updated: '2026-10-22', id: 'zon', crumb: 'Zonnepanelen na 2027',
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
<p>Bij 30% eigen verbruik en panelen van 435 Wp (Milieu Centraal, huidige voorbeelden). Zonnepanelen gaan zo'n 25 jaar mee. Er is geen subsidie; je betaalt 0% btw. Op ThuisaccuMatch zie je ook een ouder Milieu Centraal-voorbeeld met ongeveer 3.500 kWh voor 10 panelen; beide voorbeelden zijn geldig, met ander wattpiek.</p>
<p>Ook de energiebelasting telt mee in wat zelf verbruikte stroom je bespaart. Het kabinet stelt voor die op stroom in 2027 iets te verlagen en op gas iets te verhogen; meer in <a href="/blog/energiebelasting-2027-isoleren/">energiebelasting 2027: wat het voorstel betekent</a>.</p>
<p>Wat een installatie nu kost, per paneel en per wattpiek, lees je in <a href="/blog/zonnepanelen-kosten-2026/">zonnepanelen kosten in 2026</a>.</p>
<h2>Zo haal je er meer uit</h2>
<ol class="steps"><li>Leg panelen oost-west: meer stroom in de ochtend en avond.</li><li>Verschuif verbruik naar de middag (wasmachine, vaatwasser, auto laden).</li><li>Kijk naar je contract: terugleververgoeding en terugleverkosten verschillen sterk. Meer daarover lees je bij <a href="https://thuisaccumatch.nl/salderingsregeling-stopt-2027/">het einde van salderen</a>, de <a href="https://thuisaccumatch.nl/einde-salderen-berekenen/">rekentool einde salderen</a> en <a href="https://thuisaccumatch.nl/terugleverkosten/">terugleverkosten</a> op ThuisaccuMatch.</li></ol>
${matchCta}${src('zon', 'saldering')}`,
  },
];

for (const g of GIDSEN) if (g.faq) GIDSEN_FAQ[g.id] = g.faq;
export const gidsPages = GIDSEN.map((g) => ({
  path: `/${g.slug}/`, title: g.title, h1: g.h1, crumb: g.crumb, description: g.description, og: g.slug, parents: [['/gidsen/', 'Gidsen']], navPath: '/gidsen/', ogType: 'article', ogAlt: g.alt, lastmod: g.updated,
  article: { date: '2026-10-15', updated: g.updated }, stamp: { checked: g.checked || CHECKED, updated: g.updated },
  schema: [{ '@context': 'https://schema.org', '@type': 'Article', headline: g.h1, image: `${SITE.domain}/og/${g.slug}.png`, datePublished: '2026-10-15', dateModified: g.updated, author: AUTHOR, publisher: ORG, inLanguage: 'nl' }]
    .concat(g.faq ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: g.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }] : []),
  body: `<article><h1>${esc(g.h1)}</h1>${img(g.slug, g.alt)}<p class="src">Door ${SITE.owner} · 15 oktober 2026</p>${g.body()}<p>Weet je nog niet welke stap eerst? Lees <a href="/blog/huis-verduurzamen-waar-beginnen/">Huis verduurzamen: welke maatregel eerst?</a></p>${toolLinks(g.id)}</article>`,
}));

export const gidsHub = {
  path: '/gidsen/', title: 'Gidsen verduurzamen: isolatie, glas en zonnepanelen', h1: 'Gidsen', crumb: 'Gidsen', og: 'home', lastmod: GIDSEN.map((g) => g.updated).sort().at(-1), stamp: { updated: GIDSEN.map((g) => g.updated).sort().at(-1) },
  description: 'Korte gidsen over spouw-, dak-, vloer- en glasisolatie en zonnepanelen na 2027, met verwijzingen naar warmtepomp- en thuisaccugidsen.',
  body: `<h1>Gidsen</h1><div class="grid">${GIDSEN.map((g) => `<a class="card link" href="/${g.slug}/"><img src="/img/${g.slug}-600.webp" width="600" height="315" alt="${esc(g.alt)}" loading="lazy"><h2 class="h3">${esc(g.crumb)}</h2><p>${esc(MAATREGELEN[g.id].kort)}</p></a>`).join('')}</div>
<p class="src">Verdieping: <a href="https://warmtepompenmatch.nl/warmtepomp-keuzehulp/">warmtepomp kiezen op WarmtepompenMatch</a> · <a href="https://thuisaccumatch.nl/thuisaccu-keuzehulp/">thuisaccu kiezen op ThuisaccuMatch</a></p>
<h2>Meer gidsen</h2>
<ul><li><a href="/blog/huis-verduurzamen-waar-beginnen/">Huis verduurzamen: welke maatregel eerst?</a></li><li><a href="/glasisolatie-kosten/">Glasisolatie kosten: hr++ of triple glas?</a></li><li><a href="/blog/zonnepanelen-kosten-2026/">Zonnepanelen kosten in 2026: prijs per paneel en installatie</a></li><li><a href="/isde-2027/">ISDE 2027: dit verandert er</a></li><li><a href="/subsidie-isde/">ISDE-subsidie in 2026</a></li><li><a href="/blog/energiebespaarlening-warmtefonds/">Energiebespaarlening van het Warmtefonds</a></li></ul>`,
};

// ---- Home ----
// Home: controledatum van de bronnen in de hometekst (Milieu Centraal, RVO, Warmtefonds, Rijksoverheid).
const HOME_CHECKED = '2026-10-20';
const homeFaq = [
  ['Hoe verduurzaam je je huis?', 'Begin bij de basis: isoleren, ventileren en zon weren. Daarna kijk je naar je verwarming en, als je dak geschikt is, naar zonnepanelen. De volgorde staat volgens Milieu Centraal niet vast: je kunt ook instappen als je toch gaat verbouwen of als je cv-ketel aan vervanging toe is.'],
  ['Welke subsidies zijn er voor verduurzaming?', 'Landelijk is er de ISDE van RVO. Daarmee krijg je geld terug voor een (hybride) warmtepomp, een zonneboiler, isolatie of een aansluiting op een warmtenet, en sinds 2026 ook voor ventilatie als je die combineert met isolatie. Wil je lenen, dan is er de Energiebespaarlening van het Warmtefonds, met 0% rente als je gezamenlijke verzamelinkomen lager is dan € 60.000.'],
  ['Wat kost huis verduurzamen?', 'Dat hangt af van de maatregel en van je woningtype, dus één totaalbedrag is er niet. In onze gidsen zie je per maatregel de kosten, de subsidie, de besparing per jaar en de terugverdientijd per woningtype, met cijfers van Milieu Centraal.'],
  ['Hoe verduurzaam je een oud huis?', 'Volgens Milieu Centraal geldt: hoe ouder je huis, hoe slechter het bij de bouw is geïsoleerd. Kijk dus eerst wat er al geïsoleerd is en pak de rest aan, samen met goede ventilatie. Is je huis in 2000 of later gebouwd, dan is het al goed geïsoleerd en kun je meteen door naar je ventilatie.'],
];
export const home = {
  path: '/', title: 'Huis verduurzamen: wat eerst? | VerduurzaamMatch', og: 'home', lastmod: '2026-10-20',
  description: 'Huis verduurzamen in 2026: welke stap eerst, wat het kost en welke subsidie of lening je krijgt. Doe de gratis match en zie besparing en terugverdientijd.',
  // Organization en WebSite staan op elke pagina (layout.mjs, siteGraph). FAQPage hoort bij de zichtbare vragen hieronder.
  schema: [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: homeFaq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }],
  full: true,
  body: `<section class="hero"><div class="wrap hero-in"><div class="hero-txt"><p class="brand">${BRAND}</p><h1 class="tagline">${esc(SITE.tagline)}</h1>
<p class="lead">Vijf vragen over je huis. Je ziet welke maatregel het meeste oplevert, wat hij kost en hoe snel je hem terugverdient.</p>
<div class="actions"><a class="btn sun" href="/verduurzaam-match/">Start de match</a><a class="btn ghost" href="/subsidie-isde/">Subsidie bekijken</a></div>
<ul class="trust"><li>${icoon('vink')}Cijfers van Milieu Centraal en RVO</li><li>${icoon('vink')}Volgorde op wat het oplevert</li><li>${icoon('vink')}Gratis en zonder account</li></ul></div>
<div class="hero-art">${HERO_ART}</div></div></section>
<section class="sec"><div class="wrap">
<div class="sec-head"><p class="eyebrow">In 2 minuten</p><h2>Zo werkt het</h2></div>
<ol class="how"><li><span class="hi">${icoon('huis', 'ico big')}</span>Beantwoord 5 vragen over je woning en je doel.</li><li><span class="hi">${icoon('euro', 'ico big')}</span>Zie welke stap eerst, met kosten, subsidie en terugverdientijd.</li><li><span class="hi">${icoon('vink', 'ico big')}</span>Lees de gids en vraag offertes aan.</li></ol>
<div class="note"><strong>Let op 2027:</strong> de salderingsregeling stopt op 1 januari 2027. En bij de ISDE noemt RVO de wijzigingen voor 2027 voorgenomen, dus nog niet definitief: het bedrag voor lucht-water warmtepompen daalt dan van € 225 naar € 120 per kW; andere warmtepompen houden hetzelfde bedrag per kW. <a href="/isde-2027/">Wat dat betekent</a></div>
</div></section>
<section class="sec tint"><div class="wrap narrow">
<h2>Huis verduurzamen in 4 stappen</h2>
<p>Je huis verduurzamen hoeft niet in één keer. Volgens Milieu Centraal staat de volgorde ook niet vast. Je kunt instappen op een moment dat voor jou logisch is: als je keuken aan vervanging toe is, je cv-ketel oud wordt of je een aanbouw plaatst.</p>
<p>De basis is wel altijd hetzelfde: isoleren, ventileren en zon weren. Hoe minder warmte je verliest, hoe minder energie je nodig hebt om je huis warm te houden.</p>
<ol class="steps"><li><strong>Inzicht.</strong> Kijk hoe je isolatie, ventilatie en zonwering ervoor staan. Is je huis in 2000 of later gebouwd? Dan is het volgens Milieu Centraal al goed geïsoleerd.</li><li><strong>Isoleren en ventileren.</strong> Isoleer wat nog niet geïsoleerd is. Zorg tegelijk voor genoeg verse lucht: een goed geïsoleerd huis mag niet potdicht worden.</li><li><strong>Verwarming.</strong> Kijk hoe oud je cv-ketel is; gemiddeld gaat die twaalf tot vijftien jaar mee. Een hybride warmtepomp komt naast je ketel, en je huis hoeft daarvoor niet perfect geïsoleerd te zijn.</li><li><strong>Zelf opwekken.</strong> Is je dak geschikt, dan kun je aan de slag met zonnepanelen.</li></ol>
<p>Milieu Centraal werkt dit uit in 7 stappen. De hele volgorde, met uitleg per stap, lees je in onze blog <a href="/blog/huis-verduurzamen-waar-beginnen/">Huis verduurzamen: welke maatregel eerst?</a></p>
</div></section>
<section class="sec"><div class="wrap narrow">
<h2>Wat kost verduurzamen en wat levert het op?</h2>
<p>Dat hangt af van de maatregel en van je huis. Spouwmuurisolatie in een tussenwoning is iets heel anders dan een warmtepomp in een vrijstaand huis. Daarom noemen we hier geen totaalbedrag.</p>
<p>In de gidsen hieronder staat per maatregel wat hij kost, hoeveel subsidie je krijgt, wat je per jaar bespaart en hoe snel je hem terugverdient. Steeds per woningtype, met de cijfers van Milieu Centraal. Wil je het voor je eigen huis uitrekenen? Gebruik dan <a href="/besparing-berekenen/">besparing berekenen</a> of <a href="/terugverdientijd-berekenen/">terugverdientijd berekenen</a>.</p>
</div></section>
<section class="sec warm"><div class="wrap narrow">
<h2>Subsidie: ISDE in 2026 en wat er in 2027 verandert</h2>
<p>Met de ISDE van RVO krijg je geld terug voor een (hybride) warmtepomp, een zonneboiler, isolatie of een aansluiting op een warmtenet. Sinds 2026 kan dat ook voor ventilatie, als je die combineert met een of meer isolatiemaatregelen.</p>
<p>Als woningeigenaar vraag je de subsidie aan nadat het werk klaar is, binnen 24 maanden na afronding. Je hebt een factuur met meldcode nodig. Bij isolatie lever je per maatregel ook één foto van het werk aan. Doe je binnen 24 maanden meer dan één isolatiemaatregel, of combineer je isolatie met een warmtepomp, zonneboiler of warmtenet? Dan verdubbelt het subsidiebedrag voor isolatie. Alle bedragen staan op <a href="/subsidie-isde/">ISDE-subsidie 2026</a>.</p>
<p>Voor 2027 heeft RVO wijzigingen aangekondigd. Die zijn nog niet definitief: RVO noemt ze voorgenomen. Naast de lagere ISDE voor lucht-water warmtepompen (zie hierboven) komt er een bonus van € 200 voor slimme warmtepompen, en de bonus voor een A+++-label gaat van € 200 naar € 250. Koop je een warmtepomp vóór of op 31 december 2026 en laat je hem in 2027 installeren? Dan geldt een overgangsregeling met het bedrag van 2026. Meer in <a href="/isde-2027/">ISDE 2027</a>.</p>
<h2>Geen spaargeld? De Energiebespaarlening</h2>
<p>Bij het Nationaal Warmtefonds kun je als eigenaar-bewoner een Energiebespaarlening afsluiten. Is jullie gezamenlijke verzamelinkomen lager dan € 60.000, dan leen je tegen 0% rente. De andere voorwaarden staan op de site van het Warmtefonds.</p>
<p>Hoe de lening werkt en waar je op let, lees je in <a href="/blog/energiebespaarlening-warmtefonds/">Energiebespaarlening van het Warmtefonds</a>.</p>
</div></section>
<section class="sec"><div class="wrap narrow">
<h2>Zonnepanelen na de salderingsregeling</h2>
<p>De salderingsregeling stopt op 1 januari 2027. Daarna kun je stroom die je teruglevert niet meer wegstrepen tegen je verbruik. Je krijgt wel een vergoeding van je energieleverancier: tot 2030 minimaal 50% van het kale leveringstarief, dus het stroomtarief zonder belastingen.</p>
<p>Leveranciers mogen terugleverkosten rekenen, maar alleen voor de kosten die ze maken om die stroom te verwerken. De ACM houdt daar toezicht op. Volgens de Rijksoverheid gaan zonnepanelen gemiddeld 25 jaar mee en verdienen ze zich ruim binnen die tijd terug, ook na het einde van de saldering. Lees meer in <a href="/zonnepanelen-na-2027/">zonnepanelen na 2027</a>.</p>
${srcOp(HOME_CHECKED, 'stappenplan', 'verbeterjehuis', 'isde', 'isde2027', 'warmtefondsNul', 'warmtefondsVoorwaarden', 'saldering')}
</div></section>
<section class="sec tint"><div class="wrap">
<h2>Gidsen</h2>
<div class="grid">${GIDSEN.map((g) => `<a class="card link" href="/${g.slug}/"><img src="/img/${g.slug}-600.webp" width="600" height="315" alt="${esc(g.alt)}" loading="lazy"><h3>${esc(g.crumb)}</h3><p>${esc(MAATREGELEN[g.id].kort)}</p></a>`).join('')}</div>
<p class="src">Verdieping: <a href="https://warmtepompenmatch.nl/warmtepomp-keuzehulp/">warmtepomp kiezen op WarmtepompenMatch</a> · <a href="https://thuisaccumatch.nl/thuisaccu-keuzehulp/">thuisaccu kiezen op ThuisaccuMatch</a></p>
</div></section>
<section class="sec"><div class="wrap faq">
${faqAcc(homeFaq)}
</div></section>
<section class="sec warm"><div class="wrap">
<h2>Waarom VerduurzaamMatch?</h2>
<ul class="why"><li>${icoon('tabel', 'ico big')}<strong>Cijfers van Milieu Centraal en RVO</strong>, met bronlink.</li><li>${icoon('doel', 'ico big')}<strong>Volgorde op wat het oplevert</strong>, nooit op vergoeding.</li><li>${icoon('vink', 'ico big')}<strong>Gratis en zonder account.</strong></li></ul>
<div class="cta-band"><div><h2>Klaar om te kiezen?</h2><p>Doe de VerduurzaamMatch en zie welke stap in jouw huis het meeste oplevert.</p></div><a class="btn sun" href="/verduurzaam-match/">Doe de VerduurzaamMatch</a></div>
</div></section>`,
};

// ---- Quiz ----
const fs = Object.entries(VRAGEN).map(([k, v], i) => `<fieldset data-q="${k}"${i === 0 ? ' class="nu"' : ''}><legend>${icoon(ICOON_VRAAG[k])}${esc(v.label)}</legend><div class="opts">${(v.volgorde ? v.volgorde.map((ok) => [ok, v.opties[ok]]) : Object.entries(v.opties)).map(([ok, ol]) => `<label><input type="radio" name="${k}" value="${ok}" required><span>${esc(ol)}</span></label>`).join('')}</div></fieldset>`).join('');
export const quiz = {
  path: '/verduurzaam-match/', title: 'VerduurzaamMatch: welke stap eerst voor jouw huis?', h1: 'VerduurzaamMatch', crumb: 'VerduurzaamMatch', og: 'match',
  description: 'Vijf vragen over je woning. Direct advies welke verduurzaming eerst, met kosten, ISDE-subsidie en terugverdientijd.',
  scripts: ['/js/quiz.js'],
  schema: [{ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'VerduurzaamMatch', applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' }, url: SITE.domain + '/verduurzaam-match/' }],
  body: `<h1>VerduurzaamMatch</h1><p class="lead">Welke stap levert in jouw huis het meeste op?</p>
<form class="quiz stap" id="form" novalidate>
<div class="qprog"><p id="q-prog">0 van ${Object.keys(VRAGEN).length} vragen beantwoord</p><div class="qbar" role="progressbar" aria-label="Voortgang" aria-valuemin="0" aria-valuemax="${Object.keys(VRAGEN).length}" aria-valuenow="0"><span id="q-bar"></span></div></div>
<p class="resume" id="q-resume" hidden>Je vorige antwoorden staan er weer (alleen bewaard op dit apparaat). <button type="button" class="linkbtn" data-reset>Opnieuw beginnen</button></p>
<div class="tussen" id="q-tussen" aria-live="polite" hidden></div>
${fs}<div class="stapnav" id="q-nav" hidden><button type="button" class="btn ghost" id="q-terug">Vorige vraag</button></div><button class="btn" type="submit" id="q-submit" hidden>Toon mijn advies</button></form>
<noscript><style>.quiz.stap fieldset{display:block}.quiz .btn[hidden]{display:inline-flex}</style></noscript>
<div class="result" id="result" aria-live="polite"></div>
<div class="share" id="share" hidden><button type="button" class="btn ghost" id="share-btn">Deel of bewaar: kopieer de link</button> <button type="button" class="linkbtn" data-reset>Opnieuw beginnen</button> <span id="share-ok" class="src" role="status"></span>
<p class="src">Je antwoorden staan in de link en blijven alleen op dit apparaat bewaard. Geen account, geen e-mail.</p></div>
<noscript><p class="note">Zet JavaScript aan voor het advies, of lees de <a href="/gidsen/">gidsen</a>.</p></noscript>
<p>Alles naast elkaar zien? <a href="/vergelijken/">Vergelijk alle maatregelen</a> of gebruik de <a href="/rekentools/">rekentools</a>.</p>
${src('spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon', 'batterij')}`,
};

// ---- Subsidie ----
/** Article-schema met de redactie als auteur (byline "Door Redactie VerduurzaamMatch" op de pagina). */
const redactieArticle = (path, headline, og, datePublished, dateModified) => ({ '@context': 'https://schema.org', '@type': 'Article', headline, mainEntityOfPage: SITE.domain + path, image: `${SITE.domain}/og/${og}.png`, datePublished, dateModified, author: AUTHOR, publisher: ORG, inLanguage: 'nl' });
const BYLINE = `<p class="src">Door ${SITE.owner}</p>`;
export const subsidie = {
  schema: [redactieArticle('/subsidie-isde/', 'ISDE-subsidie isolatie 2026', 'subsidie-isde', '2026-10-15', '2026-10-29')],
  path: '/subsidie-isde/', title: 'ISDE-subsidie isolatie 2026: bedragen en voorwaarden', h1: 'ISDE-subsidie isolatie 2026', crumb: 'ISDE-subsidie', og: 'subsidie-isde', lastmod: '2026-10-29', stamp: { checked: '2026-10-26', updated: '2026-10-29' },
  description: 'ISDE-subsidie 2026 voor isolatie en glas: bedragen per m², de verdubbeling bij twee maatregelen, voorwaarden en hoe je aanvraagt. Bron: RVO.',
  body: `<article><h1>ISDE-subsidie isolatie 2026</h1>${img('subsidie-isde', 'Huis met een euroteken en een vinkje voor subsidie')}${BYLINE}
<p class="lead">Met de ISDE krijg je als eigenaar-bewoner geld terug voor isolatie, een warmtepomp of een zonneboiler. Je vraagt het aan ná de installatie, binnen 24 maanden.</p>
<h2>Isolatie</h2>
<p>Dit zijn de ISDE-bedragen van RVO voor isolatie die je in 2025 of later laat uitvoeren, dus ook in 2026.</p>
<div class="tbl"><table><thead><tr><th>Maatregel</th><th>Per m²</th><th>Biobased bonus per m²</th><th>Oppervlak</th></tr></thead><tbody>
<tr><td>Spouwmuur</td><td>€ 5,25</td><td>€ 1,50</td><td>10 – 170 m²</td></tr>
<tr><td>Gevel (binnen of buiten)</td><td>€ 20,25</td><td>€ 6</td><td>10 – 170 m²</td></tr>
<tr><td>Dak</td><td>€ 16,25</td><td>€ 5</td><td>20 – 200 m²</td></tr>
<tr><td>Zolder- of vlieringvloer</td><td>€ 4</td><td>€ 1,50</td><td>20 – 130 m²</td></tr>
<tr><td>Vloer</td><td>€ 5,50</td><td>€ 2</td><td>20 – 130 m²</td></tr>
<tr><td>Bodem</td><td>€ 3</td><td>€ 1</td><td>20 – 130 m²</td></tr>
<tr><td><a href="/glasisolatie-kosten/">Hr++-glas</a></td><td>€ 25</td><td>–</td><td>3 – 45 m²</td></tr>
<tr><td>Triple- of vacuümglas met nieuwe kozijnen</td><td>€ 111</td><td>–</td><td>3 – 45 m²</td></tr>
</tbody></table></div>
<p><strong>Twee maatregelen = dubbel.</strong> Voer je binnen 24 maanden een tweede isolatiemaatregel uit, of combineer je met een warmtepomp, zonneboiler of warmtenet, dan verdubbelt het isolatiebedrag. De biobased bonus verdubbelt niet. Combineer je isolatie alleen met ventilatie, dan verdubbelt er ook niets.</p>
<p><strong>Rekenvoorbeeld van RVO.</strong> Je laat 36 m² dak isoleren met biobased materiaal. Dat geeft 36 × € 16,25 = € 585, plus 36 × € 5 = € 180 bonus. Laat je binnen 24 maanden ook een warmtepomp installeren, dan verdubbelt alleen de € 585. Voor het dak krijg je dan € 1.170 + € 180 = € 1.350.</p>
<h2>Nieuw in 2026: ventilatie</h2>
<p>Combineer je ventilatie met een of meer isolatiemaatregelen, dan krijg je sinds 2026 eenmalig € 400 voor energiezuinige ventilatie. Voorbeelden van RVO: een afzuigventilator met minimaal 2 CO₂-sensoren, of een wtw-unit die warmte terugwint uit de afgevoerde lucht. Je vraagt het aan binnen 24 maanden na de isolatie, of tegelijk met de isolatie-aanvraag.</p>
<h2>Warmtepomp</h2>
<p>Lucht-waterwarmtepomp in 2026: € 1.025 + € 225 per kW + € 200 bij een A+++-label. Een hybride van 4 kW met A+++-label levert zo € 2.125 op. Je krijgt altijd minimaal € 500. Het startbedrag was in 2025 nog € 1.250. Plaats je een tweede lucht-waterwarmtepomp, dan krijg je daarvoor alleen € 225 per kW, zonder startbedrag en labelbonus: bij 4 kW is dat € 900. Split-warmtepompen met minder dan 3 kg koudemiddel en een GWP boven 750 krijgen sinds 2026 geen subsidie meer. Alleen de warmtepomp? Zie <a href="https://warmtepompenmatch.nl/isde-subsidie-warmtepomp-2026/">ISDE-subsidie warmtepomp 2026</a> op WarmtepompenMatch.</p>
<h2>Zonneboiler</h2>
<p>Voor een zonneboiler ligt de ISDE volgens RVO gemiddeld tussen € 300 en € 1.750. Het bedrag hangt af van het collectoroppervlak en de inhoud van het boilervat; staat je zonneboiler op de meldcodelijst, dan zie je daar het bedrag. Wat een zonneboiler kost en hoe snel je hem terugverdient, lees je in <a href="/blog/zonneboiler-kosten/">zonneboiler kosten in 2026</a>.</p>
<p class="src">Bedragen per m², minimale en maximale oppervlakken en de biobased bonus: RVO, <a href="https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/isolatiemaatregelen" rel="noopener">ISDE isolatiemaatregelen</a> ("Subsidiebedrag voor uitvoering in 2025 of later"). Warmtepomp (€ 225 per kW en € 200 A+++-bonus in 2026, vast deel € 1.025 in het rekenvoorbeeld) en alle 2027-bedragen: RVO, <a href="https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2027" rel="noopener">ISDE: wat wijzigt er vanaf 2027?</a>. Minimaal € 500: RVO, <a href="https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/warmtepomp" rel="noopener">ISDE warmtepomp</a>. Ventilatie, startbedrag 2025, tweede warmtepomp en split-warmtepompen: RVO, <a href="https://www.rvo.nl/subsidies-financiering/isde/isde-wat-wijzigt-er-2026" rel="noopener">ISDE: wat is er gewijzigd vanaf 2026?</a>. Zonneboiler: RVO, <a href="https://www.rvo.nl/subsidies-financiering/isde/woningeigenaren/zonneboiler" rel="noopener">ISDE zonneboiler</a>. Gecontroleerd op 26 oktober 2026.</p>
<h2>Wat verandert er in 2027?</h2>
<p>Vanaf 2027 gaat de ISDE voor lucht-waterwarmtepompen en triple glas omlaag en voor hr++-glas omhoog. Die wijzigingen zijn nog voorgenomen. Alle bedragen en de overgangsregeling staan op <a href="/isde-2027/">ISDE 2027: dit verandert er</a>.</p>
<h2>Zonnepanelen en thuisbatterij</h2><p>Geen ISDE. Zonnepanelen hebben 0% btw. De salderingsregeling stopt op 1 januari 2027.</p>
<h2>Zo vraag je het aan</h2><ol class="steps"><li>Check de meldcodelijst vóór je koopt.</li><li>Laat meldcode en m² op de factuur zetten en maak een foto van het werk.</li><li>Vraag aan via rvo.nl met DigiD, binnen 24 maanden.</li></ol>
<p>Elke stap uitgewerkt, met de eisen per maatregel en de fouten waardoor RVO een aanvraag afwijst: <a href="/blog/isde-isolatie-aanvragen/">ISDE-subsidie voor isolatie aanvragen</a>.</p>
<h2>Veelgestelde vragen</h2><h3>Hoe lang blijft de ISDE-subsidie?</h3><p>De ISDE loopt ook in 2027. Aanvragen voor 2027 kan vanaf dinsdag 5 januari 2027, 12:00 uur. Een aantal bedragen verandert dan; zie <a href="/isde-2027/">ISDE 2027</a>.</p><h3>Wanneer vraag ik de ISDE aan?</h3><p>Na de installatie. Je vraagt uiterlijk binnen 24 maanden na de installatie aan, via rvo.nl met DigiD (de app of DigiD met sms-controle).</p><h3>Mag ik zelf isoleren en dan subsidie krijgen?</h3><p>Nee. Voor isolatie moet een bouw- of installatiebedrijf het volledige werk uitvoeren. Ook een warmtepomp mag je niet zelf installeren.</p><h3>Wie kan ISDE aanvragen?</h3><p>Eigenaar-bewoners: je bent eigenaar van de woning en woont er zelf. Voor isolatie moet de woning gebouwd zijn vóór 1 januari 2019.</p><h3>Hoe lang duurt de beoordeling?</h3><p>RVO probeert binnen 8 weken te beslissen. Lukt dat niet, dan krijg je na ongeveer 7 weken een brief dat de termijn wordt verlengd.</p><h3>Wat heb ik nodig bij de aanvraag?</h3><p>De meldcode van het product, een factuur en betaalbewijs, en bij isolatie een foto van het werk op je adres en het aantal m² op de factuur.</p>
${matchCta}${src('isde', 'isdeIsolatie', 'isdeWp', 'isde2027', 'saldering')}${toolLinks('isde')}</article>`,
};


// ---- ISDE 2027 (voorgenomen) ----
export const isde2027 = {
  schema: [redactieArticle('/isde-2027/', 'ISDE 2027: dit verandert er', 'subsidie-isde', '2026-10-16', '2026-10-22')],
  path: '/isde-2027/', title: 'ISDE 2027: wat verandert er voor glas en warmtepomp?', h1: 'ISDE 2027', crumb: 'ISDE 2027', og: 'subsidie-isde', lastmod: '2026-10-22', stamp: { checked: '2026-10-16', updated: '2026-10-22' },
  parents: [['/subsidie-isde/', 'ISDE-subsidie']],
  description: 'ISDE 2027 (voorgenomen): hr++-glas € 30 per m², triple glas € 55, lucht-waterwarmtepomp € 120 per kW. Koop vóór 31-12 voor het bedrag van 2026.',
  body: `<article><h1>ISDE 2027: dit verandert er</h1>${BYLINE}
<p class="lead">De ISDE verandert per 1 januari 2027. Aanvragen kan vanaf dinsdag 5 januari 2027, 12:00 uur. <strong>Alle bedragen hieronder zijn voorgenomen</strong>: RVO werkt de pagina bij zodra ze definitief zijn.</p>
<h2>Bedragen 2026 en 2027 (voorgenomen)</h2>
<div class="tbl"><table><thead><tr><th></th><th>2026</th><th>2027 (voorgenomen)</th></tr></thead><tbody>
<tr><td>Lucht-waterwarmtepomp per kW</td><td>€ 225</td><td>€ 120</td></tr>
<tr><td>Bonus A+++-label</td><td>€ 200</td><td>€ 250</td></tr>
<tr><td>Bonus slimme warmtepomp (EEBus, S2 of Matter)</td><td>–</td><td>€ 200</td></tr>
<tr><td>Hr++-glas per m²</td><td>€ 25</td><td>€ 30</td></tr>
<tr><td>Triple- of vacuümglas in nieuwe kozijnen per m²</td><td>€ 111</td><td>€ 55</td></tr>
<tr><td>Elektrische kookvoorziening</td><td>wel subsidie</td><td>geen subsidie</td></tr>
</tbody></table></div>
<p>De bedragen per kW voor andere soorten warmtepompen blijven gelijk. De bonus voor een slimme warmtepomp krijg je één keer.</p>
<h2>Rekenvoorbeeld van RVO</h2>
<p>Slimme lucht-waterwarmtepomp van 4 kW met A+++-label in 2027: € 1.025 + 4 × € 120 + € 250 + € 200 = <strong>€ 1.955</strong>. Volgens de bedragen van 2026 is dat € 1.025 + 4 × € 225 + € 200 = € 2.125.</p>
<h2>Kopen vóór 1 januari 2027: overgangsregeling</h2>
<ul><li>Koop je een warmtepomp uiterlijk 31 december 2026 en laat je hem in 2027 installeren? Dan krijg je € 225 per kW (2026) in plaats van € 120.</li><li>Hetzelfde geldt voor triple- of vacuümglas in nieuwe kozijnen: € 111 in plaats van € 55 per m².</li><li>Je levert bewijs van aankoop in 2026 mee, zoals een getekende offerte of opdrachtbevestiging.</li><li>Bij een warmtepomp gekocht in 2026 krijg je niet de slimme bonus en niet de hogere A+++-bonus.</li></ul>
<p>Hr++-glas wordt in 2027 juist hoger gesubsidieerd. Meer over glas: <a href="/glasisolatie-kosten/">glasisolatie kosten</a>.</p>
<p>Ga je in 2026 nog isoleren? Hoe je de ISDE dan aanvraagt en het bedrag verdubbelt, lees je in <a href="/blog/isde-isolatie-aanvragen/">ISDE voor isolatie aanvragen in 2026</a>.</p>
<h2>Elektrische kookvoorziening</h2><p>Gekocht vóór 1 januari 2027? Dan kun je nog subsidie aanvragen, binnen 24 maanden na aanschaf.</p>
<p>De bedragen en voorwaarden van nu staan op <a href="/subsidie-isde/">ISDE-subsidie 2026</a>. Wat een warmtepomp kost: <a href="https://warmtepompenmatch.nl/hybride-warmtepomp-kosten/">hybride warmtepomp kosten</a> op WarmtepompenMatch. Alleen de warmtepomp-ISDE, inclusief 2027: <a href="https://warmtepompenmatch.nl/isde-subsidie-warmtepomp-2026/">ISDE-subsidie warmtepomp 2026</a> op WarmtepompenMatch.</p>
${matchCta}<p class="src">Bron: <a href="${SOURCES.isde2027.url}" rel="noopener">${esc(SOURCES.isde2027.title)}</a> (door RVO gecontroleerd op 14 oktober 2026). Door ons gecontroleerd op 16 oktober 2026.</p>${toolLinks('isde')}</article>`,
};

// ---- Glasisolatie ----
export const glasisolatie = {
  schema: [redactieArticle('/glasisolatie-kosten/', 'Glasisolatie kosten: hr++ of triple glas?', 'glasisolatie-kosten', '2026-10-16', '2026-10-16')],
  path: '/glasisolatie-kosten/', title: 'Glasisolatie kosten 2026: hr++ of triple glas?', h1: 'Glasisolatie kosten', crumb: 'Glasisolatie', og: 'glasisolatie-kosten', lastmod: '2026-10-16', stamp: { checked: '2026-10-16', updated: '2026-10-16' },
  description: 'Wat kost hr++-glas, wat bespaar je en hoeveel ISDE krijg je in 2026 en 2027? Hr++ of triple glas, met cijfers van Milieu Centraal en RVO.',
  body: `<article><h1>Glasisolatie kosten: hr++ of triple glas?</h1>${BYLINE}
<p class="lead">Nog enkel of oud dubbel glas? Dan levert nieuw glas comfort en een lagere energierekening op.</p>
<h2>Kosten en besparing hr++-glas</h2>
<p>Volgens Milieu Centraal kost hr++-glas in bestaande kozijnen voor alle ramen van een gemiddelde hoekwoning (22 m²) ongeveer <strong>€ 4.700</strong>. Na subsidie blijft er ongeveer € 4.150 over.</p>
<div class="tbl"><table><thead><tr><th>Je had</th><th>Besparing gas per jaar</th><th>Besparing per jaar</th></tr></thead><tbody>
<tr><td>Dubbel glas</td><td>ca. 70 m³</td><td>ca. € 90</td></tr>
<tr><td>Enkel glas</td><td>ca. 260 m³</td><td>ca. € 350</td></tr>
</tbody></table></div>
<p>Bij een gasprijs van € 1,37 per m³. Vervang je maar een deel van het glas, dan zijn kosten en subsidie ongeveer naar rato.</p>
<h2>Hr++, triple of vacuüm?</h2>
<ul><li><strong>Kozijnen nog goed:</strong> kies hr++-glas. Het is net zo duur als gewoon dubbel glas.</li><li><strong>Nieuwe kozijnen:</strong> triple glas. Kozijnen met triple glas zijn zo'n 4,5% duurder dan met hr++, maar de subsidie is veel hoger.</li><li><strong>Monument of smal kozijn:</strong> vacuümglas isoleert als triple, maar is een stuk duurder.</li><li>Enkel glas raadt Milieu Centraal aan altijd te vervangen.</li></ul>
<h2>ISDE-subsidie voor glas</h2>
<div class="tbl"><table><thead><tr><th>Glas</th><th>2026</th><th>2027 (voorgenomen)</th></tr></thead><tbody>
<tr><td>Hr++-glas (of triple/vacuüm zonder nieuwe kozijnen)</td><td>€ 25 per m²</td><td>€ 30 per m²</td></tr>
<tr><td>Triple- of vacuümglas in nieuwe kozijnen</td><td>€ 111 per m²</td><td>€ 55 per m²</td></tr>
</tbody></table></div>
<ul><li>Minimaal 3 m², maximaal 45 m² glas.</li><li>Hr++: U-waarde maximaal 1,2. Triple en vacuüm: maximaal 0,7.</li><li>Je mag twee keer subsidie voor glas aanvragen, binnen 24 maanden na het eerste glas.</li><li>Triple glas in nieuwe kozijnen uiterlijk 31 december 2026 gekocht en in 2027 geplaatst? Dan geldt nog € 111 per m². Zie <a href="/isde-2027/">ISDE 2027</a>.</li></ul>
<h2>Offertes</h2><ol class="steps"><li>Nodig minstens twee bedrijven uit voor advies bij je thuis.</li><li>Vraag of je kozijnen geschikt zijn voor het dikkere glas.</li><li>Laat meldcode en m² op de factuur zetten (zie de <a href="/subsidie-isde/">ISDE-voorwaarden</a>).</li></ol>
<p>Hr++-glas hoort bij het minimum dat Milieu Centraal noemt voor een all-electric warmtepomp, samen met dak-, vloer- en spouwisolatie. Op WarmtepompenMatch staan <a href="https://warmtepompenmatch.nl/is-mijn-huis-geschikt-voor-een-warmtepomp/">de isolatie-eisen voor een warmtepomp per bouwjaar</a>.</p>
${matchCta}${src('glas', 'isdeIsolatie', 'isde2027')}${toolLinks('glas')}</article>`,
};

// ---- Statisch ----
export const over = {
  path: '/over/', title: 'Over VerduurzaamMatch: wie we zijn en hoe we werken', h1: 'Over ons', crumb: 'Over ons', og: 'home',
  description: 'Wie achter VerduurzaamMatch zit, hoe we bronnen (RVO, Milieu Centraal) controleren en hoe we onafhankelijk blijven.',
  schema: [{ '@context': 'https://schema.org', '@type': 'AboutPage', name: 'Over VerduurzaamMatch', about: ORG }],
  body: `<article><h1>Over ons</h1><p class="lead">VerduurzaamMatch helpt huiseigenaren kiezen welke verduurzaming eerst. Ons team werkt daar elke week aan.</p>
<h2>Wat we elke week doen</h2><ul><li><strong>Cijfers checken</strong> bij Milieu Centraal en RVO: kosten, besparing en subsidiebedragen.</li><li><strong>Nieuwe regels volgen</strong>, zoals het einde van de saldering en de ISDE-wijzigingen voor 2027.</li><li><strong>Gidsen bijwerken</strong> zodra er iets verandert.</li><li><strong>De match testen</strong>, zodat het advies klopt met de bronnen.</li></ul>
<h2>Hoe we werken</h2><ul><li><strong>Alleen officiële bronnen</strong>, met link en controledatum.</li><li><strong>Niets zelf verzonnen.</strong> Is er geen cijfer, dan zeggen we dat.</li><li><strong>Onafhankelijk.</strong> We zijn geen installateur of energiebedrijf.</li><li><strong>Partnerlinks tellen nooit mee</strong> in het advies of de volgorde. Ze worden bij de knoppen vermeld met één zin per blok.</li></ul>
<p>Fout gezien? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p></article>`,
};

// Bronnen: controledatum (zichtbaar 'Gecontroleerd op') en sitemap-lastmod uit dezelfde constante.
export const BRONNEN_CHECKED = '2026-10-16';
export const bronnen = {
  path: '/bronnen/', title: 'Bronnen en cijfers | VerduurzaamMatch', h1: 'Bronnen en cijfers', crumb: 'Bronnen', og: 'home', lastmod: BRONNEN_CHECKED, stamp: { checked: BRONNEN_CHECKED },
  description: 'Alle bronnen achter de cijfers op VerduurzaamMatch: Milieu Centraal, RVO, Rijksoverheid en het Nationaal Warmtefonds.',
  body: `<article><h1>Bronnen en cijfers</h1><p>Alle kosten, besparingen en subsidies komen van deze pagina's.</p>
<ul>${Object.values(SOURCES).map((s) => `<li><a href="${s.url}" rel="noopener">${esc(s.title)}</a></li>`).join('')}</ul>
<h2>Uitgangspunten</h2><ul><li>Besparing bij een gasprijs van € 1,37 per m³ (verwachting Milieu Centraal voor 2026-2040). WarmtepompenMatch rekent met dezelfde prijs van Milieu Centraal (€ 1,37 per m³).</li><li>Terugverdientijd = kosten gedeeld door besparing per jaar, met en zonder subsidie.</li><li>Warmtepomp en hr++-glas: cijfers voor een hoekwoning. Appartement: cijfers van een tussenwoning.</li></ul></article>`,
};

export const privacy = {
  path: '/privacy/', title: 'Privacy en cookies | VerduurzaamMatch', h1: 'Privacy en cookies', crumb: 'Privacy', og: 'home', lastmod: PRIVACY_UPDATED, stamp: { updated: PRIVACY_UPDATED },
  description: 'Hoe VerduurzaamMatch met je gegevens omgaat: geen account, Google Analytics alleen na jouw toestemming en altijd in te trekken.',
  body: `<article><h1>Privacy en cookies</h1>
<p>Vragen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<h2>Wie is verantwoordelijk?</h2><p>Verantwoordelijk voor de verwerking van persoonsgegevens op deze site: VerduurzaamMatch.nl, <a href="mailto:info@verduurzaammatch.nl">info@verduurzaammatch.nl</a>.</p>
<h2>Welke gegevens?</h2><p>Je antwoorden in de VerduurzaamMatch blijven in je browser. We slaan ze niet op en sturen ze nergens heen. Zodat je later verder kunt, bewaart je browser ze in de lokale opslag (<code>verduurzaammatch-check-v1</code>, maximaal 90 dagen); wij kunnen daar niet bij. “Opnieuw beginnen” wist ze.</p>
<h2 id="cookies">Cookies en statistieken</h2><p>We gebruiken geen advertentiecookies. Voor statistieken gebruiken we Google Analytics 4 (meet-ID G-RE5YBMSK4D), maar alleen als je in de cookiemelding op "Accepteren" klikt. Zonder toestemming laden we Google Analytics niet en gaat er niets naar Google.</p>
<p>Geef je toestemming, dan plaatst Google Analytics cookies (zoals <code>_ga</code>) en meten we welke pagina's bezocht worden en op welke knoppen en partnerlinks wordt geklikt. Google Analytics 4 slaat geen IP-adressen op; die worden alleen gebruikt om een globale locatie te bepalen en daarna weggegooid. We gebruiken de gegevens alleen voor statistieken, niet voor advertenties (zie <a href="#bewaren">bewaartermijnen</a>). Google verwerkt de gegevens als verwerker; zie het <a href="https://policies.google.com/privacy" rel="noopener">privacybeleid van Google</a>.</p>
<p>Je keuze bewaren we 12 maanden in je browser (localStorage). Je kunt je toestemming altijd intrekken via <a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a> (ook onderaan elke pagina). Dan stoppen we Google Analytics en wissen we de <code>_ga</code>-cookies.</p>
<h3>Welke cookies en opslag?</h3>${cookieTabel(GA_ID || 'G-RE5YBMSK4D', 'vm-consent')}
<h2>Links naar aanbieders</h2><p>Klik je door naar een aanbieder of vraag je daar een offerte aan, dan geldt de privacyverklaring van die aanbieder.</p>
${partnerNetwerk(SITE.name, PARTNERLINKS)}
${grondslag()}
${doorgifte()}
${bewaartermijnen(14)}
<h2>Hosting</h2><p>De site draait op GitHub Pages. GitHub verwerkt technische gegevens zoals je IP-adres om de site te leveren (zie het <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">privacybeleid van GitHub</a>).</p>
${rechten(SITE.email)}</article>`,
};

export const disclaimer = {
  path: '/disclaimer/', title: 'Disclaimer: zo lees je de cijfers op VerduurzaamMatch', h1: 'Disclaimer', crumb: 'Disclaimer', og: 'home', lastmod: '2026-10-26',
  description: 'Uitkomsten op VerduurzaamMatch zijn een indicatie op basis van gemiddelden.',
  body: `<article><h1>Disclaimer</h1><p>Kosten, besparingen en terugverdientijden zijn gemiddelden van Milieu Centraal. Jouw huis en energieprijs kunnen anders uitvallen. Subsidiebedragen kunnen wijzigen; check altijd rvo.nl vóór je koopt.</p>
<p>VerduurzaamMatch is geen installateur en geeft geen persoonlijk advies. Laat je woning beoordelen door een vakbedrijf.</p>
<p>Partnerlinks worden bij de knoppen vermeld en hebben nooit invloed op het advies of de volgorde.</p>
<h2 id="auteursrecht">Auteursrecht en hergebruik</h2><p>Alle rechten voorbehouden. De teksten, tabellen, rekentools, afbeeldingen en het ontwerp van VerduurzaamMatch mag je niet zonder onze schriftelijke toestemming kopiëren, verspreiden of hergebruiken. Wil je iets overnemen? Mail naar <a href="mailto:${SITE.email}">${SITE.email}</a>.</p>
<p>De gemiddelde kosten, besparingen en terugverdientijden in onze tabellen komen van Milieu Centraal en de subsidiebedragen van RVO. Die cijfers zelf vind je bij de bron; onze bewerking en presentatie ervan vallen onder dit voorbehoud.</p></article>`,
};

export const notfound = {
  path: '/404.html', title: 'Pagina niet gevonden | VerduurzaamMatch', h1: 'Niet gevonden', noindex: true, og: 'home',
  description: 'Deze pagina bestaat niet.',
  body: `<h1>Deze pagina bestaat niet</h1><div class="actions"><a class="btn sun" href="/verduurzaam-match/">Doe de match</a><a class="btn ghost" href="/gidsen/">Naar de gidsen</a><a class="btn ghost" href="/">Homepage</a></div>`,
};
