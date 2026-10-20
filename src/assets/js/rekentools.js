import { MAATREGELEN } from './lib/maatregelen.js';
import { besparing, terugverdientijd, isde, jaarTekst as jr } from './lib/rekenen.js';
const form = document.querySelector('form.calc'), out = document.getElementById('out');
const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
const nums = (arr) => `<div class="nums">${arr.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>`;
const tool = form.dataset.tool;
const q = new URLSearchParams(location.search);
if (q.get('m') && MAATREGELEN[q.get('m')]?.kosten) {
  if (tool === 'besparing') form.querySelectorAll('input[name=m]').forEach((x) => { x.checked = x.value === q.get('m'); });
  if (tool === 'terugverdien') form.m.value = q.get('m');
}
function reken() {
  const f = new FormData(form);
  if (tool === 'besparing') {
    const ids = f.getAll('m');
    if (!ids.length) { out.innerHTML = '<p class="note">Kies minstens één maatregel.</p>'; return; }
    let r; try { r = besparing(ids, f.get('woning')); } catch (e) { out.innerHTML = `<p class="note">${e.message}.</p>`; return; }
    out.innerHTML = nums([[eur(r.kosten), 'kosten'], [eur(r.subsidie), 'subsidie'], [eur(r.besparing), 'besparing per jaar']])
      + `<div class="tbl" tabindex="0" role="region" aria-label="Tabel: Maatregel, Kosten, Subsidie, Besparing"><table><thead><tr><th>Maatregel</th><th>Kosten</th><th>Subsidie</th><th>Besparing</th></tr></thead><tbody>${r.rijen.map((x) => `<tr><td>${x.naam}${x.hoek ? '*' : ''}</td><td>${eur(x.kosten)}</td><td>${x.subsidie ? eur(x.subsidie) : '–'}</td><td>${eur(x.besparing)}</td></tr>`).join('')}</tbody></table></div>${r.rijen.some((x) => x.hoek) ? '<p class="src">* Cijfers voor een hoekwoning.</p>' : ''}`;
  } else if (tool === 'terugverdien') {
    const m = MAATREGELEN[f.get('m')], w = f.get('woning');
    form.kosten.placeholder = `Gemiddelde: € ${m.kosten[w].toLocaleString('nl-NL')}`;
    form.subsidie.placeholder = `Gemiddelde: € ${m.subsidie[w].toLocaleString('nl-NL')}`;
    const t = terugverdientijd({ kosten: f.get('kosten').trim() || m.kosten[w], subsidie: f.get('subsidie').trim() || m.subsidie[w], besparing: m.besparing[w] });
    out.innerHTML = t ? nums([[jr(t.met), 'met subsidie'], [jr(t.zonder), 'zonder subsidie'], [eur(m.besparing[w]), 'besparing per jaar']]) + (m.alleenHoek ? '<p class="src">Besparing voor een hoekwoning.</p>' : '') : '<p class="note">Vul een geldig bedrag in.</p>';
  } else {
    const m2 = {}; for (const [k, v] of f) if (!['kw', 'aplus', 'samen'].includes(k)) m2[k] = v;
    const r = isde({ m2, wp: f.get('kw') ? { kw: f.get('kw'), aplus: f.has('aplus') } : null, samen: f.has('samen') });
    const warn = r.regels.filter((x) => x.teKlein || x.afgetopt).map((x) => `<li>${x.naam}: ${x.teKlein ? 'onder het minimum, geen subsidie' : `boven het maximum, we rekenen met ${x.telt} m²`}</li>`).join('');
    out.innerHTML = nums([[eur(r.isolatie), `isolatie${r.dubbel ? ' (verdubbeld)' : ''}`], [eur(r.warmtepomp), 'warmtepomp'], [eur(r.totaal), 'totaal ISDE']]) + (warn ? `<ul class="src">${warn}</ul>` : '');
  }
}
form.addEventListener('input', reken); form.addEventListener('change', reken);
form.addEventListener('submit', (e) => e.preventDefault());
reken();
