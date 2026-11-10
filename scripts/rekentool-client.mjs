// Exacte runtime-invoerprojectie voor de drie rekentools, geen vrijstelling van clientwijzigingen.
// Alleen batterij.kort valt weg zolang kosten null is: die optie kan niet worden gekozen.
// Alle overige moduledata/-functies én beide reken-/renderbestanden tellen volledig mee.
import { execFileSync } from 'node:child_process';
export function rekentoolClientData(outDir) {
  const script = `
    import fs from 'node:fs';
    import path from 'node:path';
    const out = process.argv[1];
    const src = fs.readFileSync(path.join(out, 'js/lib/maatregelen.js'), 'utf8');
    const mod = await import('data:text/javascript,' + encodeURIComponent(src));
    const measures = JSON.parse(JSON.stringify(mod.MAATREGELEN));
    if (measures.batterij?.kosten === null) delete measures.batterij.kort;
    console.log(JSON.stringify({
      data: { ...mod, MAATREGELEN: measures },
      code: ['js/rekentools.js', 'js/lib/rekenen.js'].map(f => fs.readFileSync(path.join(out, f), 'utf8'))
    }, (_, value) => typeof value === 'function' ? value.toString() : value));
  `;
  return execFileSync(process.execPath, ['--input-type=module', '-e', script, outDir], { encoding: 'utf8' }).trim();
}
