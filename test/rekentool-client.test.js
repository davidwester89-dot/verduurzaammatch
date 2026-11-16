import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rekentoolClientData } from '../scripts/rekentool-client.mjs';
function fixture() {
  const out = mkdtempSync(join(tmpdir(), 'vm-client-data-'));
  cpSync('src/assets/js/rekentools.js', join(out, 'js/rekentools.js'), { recursive: true });
  cpSync('src/lib/maatregelen.js', join(out, 'js/lib/maatregelen.js'), { recursive: true });
  cpSync('src/lib/rekenen.js', join(out, 'js/lib/rekenen.js'), { recursive: true });
  return out;
}
function changed(file, before, after) { const s=readFileSync(file,'utf8');assert.ok(s.includes(before));writeFileSync(file,s.replace(before,after)); }
test('alleen onkiesbare batterij.kort mag veranderen zonder rekentool-datumlift', () => {
  const out=fixture();try { const original=rekentoolClientData(out);changed(join(out,'js/lib/maatregelen.js'), "kort: 'Milieu Centraal verwacht dat je hem nu hoogstwaarschijnlijk niet terugverdient.'", "kort: 'Een andere beschrijving zonder invloed op rekentools.'");assert.equal(rekentoolClientData(out),original); } finally { rmSync(out,{recursive:true,force:true}); }
});
test('gewijzigde echte kosten blijven rood in de clientprojectie', () => {
  const out=fixture();try { const original=rekentoolClientData(out);changed(join(out,'js/lib/maatregelen.js'),'T(800, 1800, 1900, 2700)','T(801, 1800, 1900, 2700)');assert.notEqual(rekentoolClientData(out),original); } finally { rmSync(out,{recursive:true,force:true}); }
});
test('een batterij met niet-null kosten wordt niet meer uit de projectie weggelaten', () => {
  const out=fixture();try { const original=rekentoolClientData(out);changed(join(out,'js/lib/maatregelen.js'),'kosten: null, subsidie: null, besparing: null','kosten: { tussen: 1000 }, subsidie: null, besparing: null');assert.notEqual(rekentoolClientData(out),original); } finally { rmSync(out,{recursive:true,force:true}); }
});
test('echte render- of rekencode kan niet door de clientprojectie worden gemaskeerd', () => {
  const out=fixture();try { const original=rekentoolClientData(out);changed(join(out,'js/rekentools.js'),"'kosten'","'gewijzigde kosten'");assert.notEqual(rekentoolClientData(out),original); } finally { rmSync(out,{recursive:true,force:true}); }
});
