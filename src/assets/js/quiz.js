import { match } from './lib/match.js';
import { SOURCES } from './lib/maatregelen.js';
import { PARTNERLINKS, AANBIEDERS, uitgaand } from './lib/partnerlinks.js';
const form = document.getElementById('form');
const out = document.getElementById('result');
const eur = (n) => '€ ' + n.toLocaleString('nl-NL');
// Offerteblok per maatregel: pas zichtbaar als er een goedgekeurde partnerlink is.
function offerte(id) {
  const ids = Object.keys(AANBIEDERS).filter((a) => PARTNERLINKS[a] && AANBIEDERS[a].voor.includes(id));
  if (!ids.length) return '';
  return '<p><strong>Offerte aanvragen:</strong> ' + ids.map((a) => { const l = uitgaand(a); return `<a href="${l.href}" rel="${l.rel}" data-vendor="${a}">${l.naam}</a><span class="partner">partnerlink</span>`; }).join(' · ') + '</p>';
}
function kaart(r, i) {
  const nums = r.kosten == null ? '' : `<div class="nums"><div><b>${eur(r.kosten)}</b><span>kosten</span></div>${r.subsidie ? `<div><b>${eur(r.subsidie)}</b><span>subsidie</span></div>` : ''}<div><b>${eur(r.besparing)}${r.besparingMax ? '–' + eur(r.besparingMax).slice(2) : ''}</b><span>besparing per jaar</span></div><div><b>${r.terugverdien.join('–')} jaar</b><span>terugverdientijd</span></div></div>`;
  const noot = r.hoek ? '<p class="src">Cijfers voor een hoekwoning.</p>' : r.app && r.kosten != null ? '<p class="src">Cijfers voor een tussenwoning; overleg met je VvE.</p>' : '';
  return `<div class="card${i === 0 ? ' first' : ''}">${i === 0 ? '<span class="badge">Begin hiermee</span>' : `<span class="badge">Stap ${i + 1}</span>`}<h3>${r.naam}</h3><p>${r.kort}</p>${nums}${noot}${offerte(r.id)}<a class="more" href="${r.gids}">Lees de gids</a> · <a href="${SOURCES[r.bron].url}" rel="noopener">Bron</a></div>`;
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const a = Object.fromEntries(new FormData(form));
  let res;
  try { res = match(a); } catch { out.innerHTML = '<p class="note">Beantwoord alle vijf de vragen.</p>'; return; }
  out.innerHTML = '<h2>Jouw advies</h2>' + res.map(kaart).join('') + '<p class="src">Terugverdientijd met – zonder subsidie. Gemiddelden van Milieu Centraal, gasprijs € 1,37/m³.</p>';
  out.scrollIntoView({ behavior: 'smooth' });
});
