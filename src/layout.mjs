import { readFileSync } from 'node:fs';
import { GA_ID as GA_CONFIG } from './analytics.config.mjs';
import { GA_ID_RE } from './lib/consent.js';
import { networkFor } from './network.mjs';

export const GA_ID = (process.env.GA_ID ?? GA_CONFIG).trim();
if (GA_ID && !GA_ID_RE.test(GA_ID)) throw new Error(`Ongeldige GA_ID "${GA_ID}"`);
const G = GA_ID ? { script: ' https://www.googletagmanager.com', connect: ' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com', img: ' https://*.google-analytics.com https://www.googletagmanager.com' } : { script: '', connect: '', img: '' };

export const SITE = {
  name: 'VerduurzaamMatch', domain: 'https://verduurzaammatch.nl', email: 'info@verduurzaammatch.nl',
  tagline: 'Verduurzamen? Begin bij de juiste stap.', updated: '2026-10-15', theme: '#0a4f49', owner: 'Redactie VerduurzaamMatch',
};
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const BRAND = 'Verduurzaam<b>Match</b>.nl';
// Logo: huisje met blad, teal vlak.
export const LOGO = '<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="4" fill="#3c9a5f"/><path d="M8 20 20 9l12 11v12H8z" fill="#fff"/><path d="M15 30c0-7 4-11 11-12-1 7-4 11-11 12z" fill="#0e6b63"/><path d="M15 30l6-7" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>';

const NAV = [
  ['/verduurzaam-match/', 'Start de match', 'nav-cta'],
  ['/subsidie-isde/', 'Subsidie'],
  ['/gidsen/', 'Gidsen'],
  ['/rekentools/', 'Rekentools'],
  ['/blog/', 'Blog'],
  ['/over/', 'Over ons'],
];
const CSS = readFileSync(new URL('./assets/css/style.css', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/;}/g, '}');

const navLinks = (cur) => NAV.map(([h, t, c]) => `<a href="${h}"${c ? ` class="${c}"` : ''}${cur.startsWith(h) ? ' aria-current="page"' : ''}>${esc(t)}</a>`).join('');

/** Scrollbare tabellen (.tbl) bereikbaar met het toetsenbord: tabindex + role=region + label uit caption of kolomkoppen; lege kopcel krijgt verborgen tekst. */
export function a11yTabellen(html) {
  return html.replace(/<div class="tbl">(\s*<table[^>]*>)([\s\S]*?<\/table>)/g, (m, open, rest) => {
    const cap = rest.match(/<caption[^>]*>([\s\S]*?)<\/caption>/);
    const koppen = [...(rest.match(/<thead>[\s\S]*?<\/thead>/)?.[0] || '').matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((x) => x[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    const label = cap ? cap[1].replace(/<[^>]+>/g, '').trim() : `Tabel: ${koppen.join(', ')}`;
    return `<div class="tbl" tabindex="0" role="region" aria-label="${label.replace(/"/g, '&quot;')}">${open}${rest.replace(/<th><\/th>/g, '<th><span class="sr">Onderdeel</span></th>')}`;
  });
}

export function networkFooter() {
  return `<div class="net"><p class="fh">Ook van ons</p><ul>${networkFor('verduurzaammatch.nl').map((s) => `<li><a href="${s.url}">${s.logo}</a> <span>· ${esc(s.wat)}</span></li>`).join('')}</ul></div>`;
}

export function layout(p) {
  const url = SITE.domain + (p.path === '/404.html' ? '/' : p.path);
  const trail = p.path === '/' || p.path === '/404.html' ? [] : [['/', 'Home'], ...(p.parents || []), [p.path, p.crumb || p.h1]];
  const crumbs = trail.length ? `<nav class="crumbs" aria-label="Kruimelpad">${trail.map(([h, t], i) => (i === trail.length - 1 ? `<span aria-current="page">${esc(t)}</span>` : `<a href="${h}">${esc(t)}</a>`)).join(' › ')}</nav>` : '';
  const ld = [
    ...(trail.length ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map(([h, t], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: SITE.domain + h })) }] : []),
    siteGraph(),
    ...(p.schema || []),
  ];
  // Vaste mobiele knop naar de check (niet op de check zelf en niet op de 404).
  const hasCta = !p.noCta && p.path !== '/verduurzaam-match/' && p.path !== '/404.html';
  const og = `${SITE.domain}/og/${p.og || 'home'}.png`;
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'${G.script}; style-src 'self' 'unsafe-inline'; img-src 'self' data:${G.img}; connect-src 'self'${G.connect}; base-uri 'self'; form-action 'self'; object-src 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:site_name" content="${SITE.name}"><meta property="og:locale" content="nl_NL"><meta property="og:type" content="${p.ogType || 'website'}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${og}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${esc(p.ogAlt || p.h1 || p.title)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.ogTitle || p.title)}"><meta name="twitter:description" content="${esc(p.description)}"><meta name="twitter:image" content="${og}">
${p.article ? `<meta property="article:published_time" content="${p.article.date}"><meta property="article:modified_time" content="${p.article.updated}">` : ''}
<meta name="theme-color" content="${SITE.theme}">
<meta name="e08923fead07e26" content="c805cc3c2262098e1a99fce841da04b0" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon-32.png" sizes="32x32"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<style>${CSS}</style>
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body${hasCta ? ' class="has-cta"' : ''}${GA_ID ? ` data-ga="${GA_ID}"` : ''}>
<a class="skip" href="#inhoud">Naar de inhoud</a>
<header class="site"><div class="wrap">
<a class="logo" href="/">${LOGO}<span>${BRAND}</span></a>
<nav class="main" aria-label="Hoofdmenu">${navLinks(p.navPath || p.path)}</nav>
<details class="menu"><summary><span class="burger" aria-hidden="true"></span><span class="menu-txt">Menu</span></summary><nav aria-label="Hoofdmenu">${navLinks(p.navPath || p.path)}</nav></details>
</div></header>
${p.full ? `<main id="inhoud" class="full">
${a11yTabellen(p.body)}
<div class="wrap">${foutGezien(url)}</div>
</main>` : `<main id="inhoud"><div class="wrap">
${crumbs}
${a11yTabellen(withStamp(p.body, p.stamp))}
${foutGezien(url)}
</div></main>`}
<footer class="site"><div class="wrap">
<div class="cols">
<div><a class="logo" href="/">${LOGO}<span>${BRAND}</span></a><p>${esc(SITE.tagline)}</p></div>
<div class="fcol"><div><p class="fh">Isoleren</p><ul><li><a href="/spouwmuurisolatie-kosten/">Spouwmuurisolatie</a></li><li><a href="/dakisolatie-kosten/">Dakisolatie</a></li><li><a href="/vloerisolatie-kosten/">Vloerisolatie</a></li></ul></div>
<div><p class="fh">Energie</p><ul><li><a href="https://warmtepompenmatch.nl/hybride-warmtepomp-kosten/">Hybride warmtepomp</a></li><li><a href="/zonnepanelen-na-2027/">Zonnepanelen na 2027</a></li><li><a href="https://thuisaccumatch.nl/thuisaccu-terugverdientijd/">Thuisbatterij terugverdienen</a></li><li><a href="/subsidie-isde/">ISDE-subsidie</a></li></ul></div></div>
<div class="fcol"><div><p class="fh">Rekenen</p><ul><li><a href="/besparing-berekenen/">Besparing</a></li><li><a href="/terugverdientijd-berekenen/">Terugverdientijd</a></li><li><a href="/isde-subsidie-berekenen/">ISDE berekenen</a></li><li><a href="/vergelijken/">Vergelijken</a></li></ul></div>
<div><p class="fh">Over</p><ul><li><a href="/over/">Over ons</a></li><li><a href="/bronnen/">Bronnen</a></li><li><a href="/privacy/">Privacy en cookies</a></li>${GA_ID ? '<li><a href="/privacy/#cookies" data-consent-open>Cookie-instellingen</a></li>' : ''}<li><a href="/disclaimer/">Disclaimer</a></li><li><a href="mailto:${SITE.email}">Contact</a></li></ul></div></div>
</div>
${networkFooter()}
</div></footer>
${hasCta ? `<a class="stickycta" href="/verduurzaam-match/" data-cta="sticky_check">Doe de check in 2 minuten</a>` : ''}
${['/js/menu.js', ...(GA_ID ? ['/js/consent.js'] : []), ...(p.scripts || [])].map((s) => `<script type="module" src="${s}"></script>`).join('\n')}
</body>
</html>`;
}

export const ORG = { '@type': 'Organization', '@id': SITE.domain + '/#org', name: SITE.name, url: SITE.domain + '/', email: SITE.email, logo: { '@type': 'ImageObject', url: SITE.domain + '/apple-touch-icon.png' } };
/** Auteur in schema op alle pagina's (huisregel): de redactie; publisher blijft ORG (VerduurzaamMatch). */
export const AUTHOR = { '@type': 'Organization', name: SITE.owner, url: SITE.domain + '/over/' };
/** Organization + WebSite op elke pagina (één graaf, vaste @id's). */
export function siteGraph() {
  return { '@context': 'https://schema.org', '@graph': [ORG, { '@type': 'WebSite', '@id': SITE.domain + '/#website', name: SITE.name, url: SITE.domain + '/', inLanguage: 'nl-NL', publisher: { '@id': SITE.domain + '/#org' } }] };
}
const MND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
export const fmtDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MND[m - 1]} ${y}`; };
const SCHILD = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>';
/** Badge 'Gecontroleerd op' + 'Laatst bijgewerkt': alleen echte datums; ontbreekt er een, dan tonen we die niet. */
export function stampHtml(stamp) {
  if (!stamp || (!stamp.checked && !stamp.updated)) return '';
  const t = (d) => `<time datetime="${d}">${fmtDate(d)}</time>`;
  return `<p class="stamp">${stamp.checked ? `<span class="badge-ok">${SCHILD}Gecontroleerd op ${t(stamp.checked)}</span>` : ''}${stamp.updated ? `<span class="upd">Laatst bijgewerkt ${t(stamp.updated)}</span>` : ''}</p>`;
}
/** Badge direct onder de h1 (na de openingsafbeelding en de auteursregel als die er staan). */
export function withStamp(body, stamp) {
  const html = stampHtml(stamp);
  if (!html) return body;
  const m = body.match(/<\/h1>(<div class="hero-img">[\s\S]*?<\/div>)?(<p class="src">Door [\s\S]*?<\/p>)?/);
  if (!m) return html + body;
  const end = m.index + m[0].length;
  return body.slice(0, end) + html + body.slice(end);
}
/** 'Fout gezien?': mailto met de pagina-URL al ingevuld. */
export function foutGezien(url) {
  const q = `subject=${encodeURIComponent(`Fout gezien op ${url.replace(/^https?:\/\//, '')}`)}&body=${encodeURIComponent(`Pagina: ${url}\n\nWat klopt er niet?\n`)}`;
  return `<p class="report">Fout gezien? <a href="mailto:${SITE.email}?${q}" data-cta="report_error">Laat het ons weten</a>.</p>`;
}
