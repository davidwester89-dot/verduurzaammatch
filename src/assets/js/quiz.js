import { match, voorlopig } from './lib/match.js';
import { icoon } from './lib/iconen.js';
const ICOON = { spouw: 'muur', dak: 'dak', vloer: 'vloer', glas: 'glas', hybride: 'warmtepomp', allelectric: 'stekker', zon: 'zon', batterij: 'batterij' };
import { SOURCES } from './lib/maatregelen.js';
import { PARTNERLINKS, AANBIEDERS, uitgaand } from './lib/partnerlinks.js';
import { bewaar, laad, wis } from './lib/opslag.js';
import { LEADS, ROUTING } from './lib/leads.config.js';
import { categorieVan } from './lib/leads.js';
const form = document.getElementById('form');
const out = document.getElementById('result');
const eur = (n) => '€ ' + n.toLocaleString('nl-NL');
// Offerteblok per maatregel: pas zichtbaar als er een goedgekeurde partnerlink is.
function offerte(id) {
  const ids = Object.keys(AANBIEDERS).filter((a) => PARTNERLINKS[a] && AANBIEDERS[a].voor.includes(id));
  if (!ids.length) return '';
  return '<p><strong>Offerte aanvragen:</strong> ' + ids.map((a) => { const l = uitgaand(a); return `<a href="${l.href}" rel="${l.rel}" data-vendor="${a}">${l.naam}</a><span class="partner">partnerlink</span>`; }).join(' · ') + '</p>';
}
// Offerteknop per maatregel (leadtest): alleen als er een goedgekeurde offertepartner is. Verandert niets aan de volgorde.
function offerteLead(id, i) {
  const c = categorieVan(id);
  if (!c || !ROUTING[c]) return '';
  return `<p class="leadlink"><a class="${i === 0 ? 'btn' : 'more'}" href="/offerte/?m=${c}" data-lead="${c}" data-pos="match_${i + 1}">Offertes aanvragen</a> <span class="partner">partnerlink</span></p>`;
}
function kaart(r, i) {
  const nums = r.kosten == null ? '' : `<div class="nums"><div><b>${eur(r.kosten)}</b><span>kosten</span></div>${r.subsidie ? `<div><b>${eur(r.subsidie)}</b><span>subsidie</span></div>` : ''}<div><b>${eur(r.besparing)}${r.besparingMax ? '–' + eur(r.besparingMax).slice(2) : ''}</b><span>besparing per jaar</span></div><div><b>${r.terugverdien.join('–')} jaar</b><span>terugverdientijd</span></div></div>`;
  const noot = r.hoek ? '<p class="src">Cijfers voor een hoekwoning.</p>' : r.app && r.kosten != null ? '<p class="src">Cijfers voor een tussenwoning; overleg met je VvE.</p>' : '';
  return `<div class="card${i === 0 ? ' first' : ''}">${i === 0 ? '<span class="badge">Begin hiermee</span>' : `<span class="badge">Stap ${i + 1}</span>`}<h3>${icoon(ICOON[r.id])} ${r.naam}</h3><p>${r.kort}</p>${nums}${noot}${offerte(r.id)}${offerteLead(r.id, i)}<a class="more" href="${r.gids}">Lees de gids</a> · <a href="${SOURCES[r.bron].url}" rel="noopener">Bron</a></div>`;
}

// Antwoorden: in de URL (deelbaar) en in localStorage (alleen op dit apparaat). Geen account, niets naar ons.
const OPSLAG = 'verduurzaammatch-check-v1';
const store = (() => { try { return window.localStorage; } catch { return null; } })();
const VELDEN = [...new Set([...form.querySelectorAll('input[name]')].map((x) => x.name))];
const setUrl = (u) => { const n = window.History && History.prototype.replaceState; (n || history.replaceState).call(history, history.state, '', u); };
const antwoorden = () => Object.fromEntries(new FormData(form));
const query = () => new URLSearchParams(antwoorden()).toString();

function voortgang() {
  const n = Object.keys(antwoorden()).length, N = VELDEN.length;
  document.getElementById('q-prog').textContent = n === N ? `Alle ${N} vragen beantwoord` : `${n} van ${N} vragen beantwoord`;
  document.getElementById('q-bar').style.width = `${Math.round((n / N) * 100)}%`;
  const pb = form.querySelector('.qbar'); pb.setAttribute('aria-valuenow', String(n)); pb.setAttribute('aria-valuetext', `${n} van ${N} vragen beantwoord`);
}
function vul(q) {
  const p = new URLSearchParams(q);
  for (const [k, v] of p) { const el = [...form.querySelectorAll(`input[name="${k}"]`)].find((x) => x.value === v); if (el) el.checked = true; }
}
function toon(scroll) {
  let res;
  try { res = match(antwoorden()); } catch { out.innerHTML = `<p class="note">Beantwoord alle ${VELDEN.length} vragen.</p>`; document.getElementById('share').hidden = true; return; }
  out.innerHTML = '<h2>Jouw advies</h2>' + res.map(kaart).join('') + '<p class="src">Terugverdientijd met – zonder subsidie. Gemiddelden van Milieu Centraal, gasprijs € 1,37/m³.</p>' + (Object.keys(LEADS).length ? '<p class="src">Offertes lopen via een offertepartner (partnerlink). Die vergoeding heeft geen invloed op dit advies of de volgorde.</p>' : '');
  document.getElementById('share').hidden = false;
  if (scroll) out.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
}
function noindexMetParams() {
  let m = document.querySelector('meta[name="robots"]');
  if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.append(m); }
  m.content = 'noindex, follow';
}

// Start: link met antwoorden gaat voor; anders bewaarde antwoorden terugzetten.
const vanLink = new URLSearchParams(location.search).toString();
let start = vanLink, hersteld = false;
if (!start && store) { start = laad(store, OPSLAG, VELDEN); hersteld = !!start; }
if (start) {
  vul(start);
  if (vanLink) noindexMetParams();
  if (hersteld) document.getElementById('q-resume').hidden = false;
  if (Object.keys(antwoorden()).length === VELDEN.length) toon(false);
}
voortgang();

// Stap voor stap: één vraag tegelijk, met tussentijds advies. Zonder JS staan alle vragen onder elkaar.
const sets = [...form.querySelectorAll('fieldset[data-q]')];
const tussen = document.getElementById('q-tussen'), nav = document.getElementById('q-nav'), submit = document.getElementById('q-submit');
let stap = 0;
function eersteOpen() { const i = sets.findIndex((f) => !f.querySelector('input:checked')); return i < 0 ? sets.length - 1 : i; }
function toonStap(i, focus) {
  stap = Math.max(0, Math.min(sets.length - 1, i));
  sets.forEach((f, j) => f.classList.toggle('nu', j === stap));
  nav.hidden = stap === 0;
  submit.hidden = Object.keys(antwoorden()).length < VELDEN.length;
  if (focus) {
    sets[stap].querySelector('input:checked, input')?.focus({ preventScroll: true });
    const top = form.getBoundingClientRect().top;
    if (top < 0 || top > innerHeight / 2) form.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
}
function tussenAdvies() {
  const v = voorlopig(antwoorden());
  if (!v || v.beantwoord >= VELDEN.length) { tussen.hidden = true; return; }
  tussen.hidden = false;
  tussen.innerHTML = `<p><strong>Voorlopig advies</strong> <span class="src">na ${v.beantwoord} van ${VELDEN.length} vragen; kan nog veranderen</span></p><ol>${v.top.map((r) => `<li>${icoon(ICOON[r.id])} ${r.naam}</li>`).join('')}</ol>`;
}
form.classList.add('stap');
toonStap(eersteOpen(), false); tussenAdvies();
document.getElementById('q-terug').addEventListener('click', () => toonStap(stap - 1, true));

form.addEventListener('change', (e) => {
  voortgang(); tussenAdvies();
  const i = sets.indexOf(e.target.closest('fieldset'));
  if (i === stap) setTimeout(() => toonStap(Object.keys(antwoorden()).length === VELDEN.length && i === sets.length - 1 ? i : Math.min(i + 1, eersteOpen() > i ? eersteOpen() : i + 1), true), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
  if (!e.isTrusted) return;
  const q = query();
  setUrl(`${location.pathname}?${q}`);
  if (store) bewaar(store, OPSLAG, q, VELDEN);
});
form.addEventListener('submit', (e) => { e.preventDefault(); toon(true); });

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-reset]')) return;
  if (store) wis(store, OPSLAG);
  location.href = location.pathname;
});
const btn = document.getElementById('share-btn'), ok = document.getElementById('share-ok');
const delen = typeof navigator.share === 'function' && matchMedia('(pointer: coarse)').matches;
if (delen) btn.textContent = 'Deel of bewaar je advies';
else if (!navigator.clipboard) btn.hidden = true;
btn.addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}?${query()}`;
  if (delen) { try { await navigator.share({ title: 'Mijn VerduurzaamMatch-advies', url }); return; } catch (err) { if (err && err.name === 'AbortError') return; } }
  try { await navigator.clipboard.writeText(url); ok.textContent = 'Link gekopieerd. Bewaar of deel hem; je antwoorden staan erin.'; }
  catch { ok.textContent = 'Kopiëren lukte niet; kopieer de adresbalk.'; }
});
