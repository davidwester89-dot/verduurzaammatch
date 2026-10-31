// Siteconfig voor scripts/l7check.mjs (L7-datumcheck, naamgrep, repo-root-404). Wijzigingen in exempt/BEKEND_* alleen met SC-OK.
import { execSync, execFileSync } from 'node:child_process';
import { join } from 'node:path';
export const CFG = {
  build: (dir, env) => { execSync('node build.mjs', { cwd: dir, env, stdio: 'ignore' }); return join(dir, 'dist'); },
  hubs: [{ hub: '/gidsen/', children: /^\/[^/]+\/$/ }],
  // Alleen ONTBREKENDE velden die de template van deze pagina niet heeft. Een aanwezig veld moet altijd kloppen.
  exempt: {},
};
export const ALLOW_NAME = [];
export const BEKEND_ORPHAN = [];
// Hub-audit: bestaande bevindingen op origin/main (30-10). Haal een regel weg zodra de hub is gefixt; dan bewaakt de test hem.
export const BEKEND_HUB = [
  { pad: '/gidsen/', reden: 'gidsenoverzicht: zichtbaar 2026-10-29 maar lastmod 2026-10-20 (30-10, inhoudsfix niet in deze commit; SC/MM beslist)' },
];
// Datumcorrectie /isde-2027/ (31-10): sitemap-lastmod, zichtbaar en dateModified naar 2026-10-22, de deploydatum van de laatste
// bodywijziging (e20de42, live 22-10 09:14). Geen nieuwe bodywijziging, dus niet naar de pushdatum (SC 30-10 bij BM). VM heeft de
// D-regel (dateCorrection) nog niet; tot die per site is gesynchroniseerd alleen deze twee exacte meldingen, vervalt na 8-11.
export const BEKEND_L7 = [
  { pad: '/isde-2027/', alleen: /^\/isde-2027\/ \(datum verschoven; verwacht \d{4}-\d{2}-\d{2}\): dateModified 2026-10-22, zichtbaar 2026-10-22, lastmod 2026-10-22$/, tot: '2026-11-08', reden: 'datumcorrectie naar deploydatum laatste bodywijziging (e20de42, 22-10), geen bodywijziging' },
  { pad: '/gidsen/', alleen: /^\/gidsen\/ \(hub van \/isde-2027\/; verwacht \d{4}-\d{2}-\d{2}\): zichtbaar 2026-10-29, lastmod 2026-10-20$/, tot: '2026-11-08', reden: 'hub volgt alleen door de datumcorrectie van /isde-2027/; hub-lastmod staat al in BEKEND_HUB' },
];
