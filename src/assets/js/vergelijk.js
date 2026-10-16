import { overzicht, sorteer } from './lib/rekenen.js';
const tb = document.querySelector('#vt tbody'), sel = document.getElementById('v-woning');
const tpl = new Map([...tb.rows].map((r, i) => [i, r]));
let kolom = null, op = true;
const ids = ['spouw', 'dak', 'vloer', 'glas', 'hybride', 'allelectric', 'zon', 'batterij'];
const eur = (n) => '€ ' + Math.round(n).toLocaleString('nl-NL');
const jr = (x) => (x == null ? '–' : `${String(x).replace('.', ',')} jaar`);
function render() {
  let rijen = overzicht(sel.value);
  if (kolom) rijen = sorteer(rijen, kolom, op);
  tb.replaceChildren(...rijen.map((r) => {
    const tr = tpl.get(ids.indexOf(r.id)).cloneNode(true);
    if (r.kosten != null) {
      const td = tr.querySelectorAll('td');
      td[0].textContent = eur(r.kosten); td[1].textContent = r.subsidie ? eur(r.subsidie) : '–';
      td[2].textContent = eur(r.besparing) + (r.id === 'glas' ? '–350' : ''); td[3].textContent = jr(r.tvMet); td[4].textContent = jr(r.tvZonder);
    }
    return tr;
  }));
  document.querySelectorAll('#vt th[scope=col]').forEach((th) => { const k = th.querySelector('button').dataset.k; th.setAttribute('aria-sort', k === kolom ? (op ? 'ascending' : 'descending') : 'none'); });
}
document.querySelector('#vt thead').addEventListener('click', (e) => {
  const b = e.target.closest('button'); if (!b) return;
  op = kolom === b.dataset.k ? !op : true; kolom = b.dataset.k; render();
});
const w = new URLSearchParams(location.search).get('woning');
if (w && [...sel.options].some((o) => o.value === w)) sel.value = w;
sel.addEventListener('change', render); render();
