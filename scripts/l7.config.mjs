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
export const BEKEND_HUB = [];
// Datumcorrectie kindpagina's (31-10, SC-review c91465c): dak/vloer naar 2026-10-20 (laatste bodywijziging 73f688a, live 20-10 14:04),
// zonnepanelen-na-2027 naar 2026-10-22 (e20de42, live 22-10 09:14). Geen nieuwe bodywijziging, dus niet naar de pushdatum. VM heeft de
// D-regel nog niet; tot die per site is gesynchroniseerd alleen deze vier exacte meldingen, vervalt na 8-11 (SC beslist).
export const BEKEND_L7 = [
  { pad: '/dakisolatie-kosten/', alleen: /^\/dakisolatie-kosten\/ \(datum verschoven; verwacht \d{4}-\d{2}-\d{2}\): dateModified 2026-10-20, article:modified_time 2026-10-20, zichtbaar 2026-10-20, lastmod 2026-10-20$/, tot: '2026-11-08', reden: 'datumcorrectie naar deploydatum laatste bodywijziging (73f688a, 20-10), geen bodywijziging' },
  { pad: '/vloerisolatie-kosten/', alleen: /^\/vloerisolatie-kosten\/ \(datum verschoven; verwacht \d{4}-\d{2}-\d{2}\): dateModified 2026-10-20, article:modified_time 2026-10-20, zichtbaar 2026-10-20, lastmod 2026-10-20$/, tot: '2026-11-08', reden: 'datumcorrectie naar deploydatum laatste bodywijziging (73f688a, 20-10), geen bodywijziging' },
  { pad: '/zonnepanelen-na-2027/', alleen: /^\/zonnepanelen-na-2027\/ \(datum verschoven; verwacht \d{4}-\d{2}-\d{2}\): dateModified 2026-10-22, article:modified_time 2026-10-22, zichtbaar 2026-10-22, lastmod 2026-10-22$/, tot: '2026-11-08', reden: 'datumcorrectie naar deploydatum laatste bodywijziging (e20de42, 22-10), geen bodywijziging' },
  { pad: '/gidsen/', alleen: /^\/gidsen\/ \(hub van \/dakisolatie-kosten\/, \/vloerisolatie-kosten\/, \/zonnepanelen-na-2027\/; verwacht \d{4}-\d{2}-\d{2}\): zichtbaar 2026-10-29, lastmod 2026-10-29$/, tot: '2026-11-08', reden: 'hub volgt alleen door deze datumcorrecties; hubdatum blijft de nieuwste gidsdatum 2026-10-29 (spouwmuur)' },
];
