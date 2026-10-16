// Eén set lijniconen (24x24, stroke=currentColor), inline in de HTML: geen extra requests.
// Zelfde set op boekhoudmatch.nl en verduurzaammatch.nl.
export const PADEN = {
  huis: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  kalender: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  label: '<path d="M4 6h10M4 10h13M4 14h16M4 18h8"/>',
  euro: '<path d="M17 6.5A7 7 0 1 0 17 17.5"/><path d="M4 10h9M4 14h9"/>',
  doel: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  muur: '<rect x="3" y="4" width="18" height="16"/><path d="M3 9h18M3 15h18M9 4v5M15 9v6M9 15v5"/>',
  dak: '<path d="M2 13 12 4l10 9"/><path d="M5 11v9h14v-9"/><path d="M4.5 15.5 12 9l7.5 6.5"/>',
  vloer: '<path d="M3 9h18M3 13h18"/><path d="M5 13v7M10 13v7M14 13v7M19 13v7"/><path d="M6 6c1.5-1.5 3 1.5 4.5 0s3 1.5 4.5 0 3 1.5 4.5 0"/>',
  glas: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/>',
  warmtepomp: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="10" cy="12" r="4"/><path d="M10 8v8M6 12h8M17 9v6"/>',
  stekker: '<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>',
  zon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  batterij: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M10 2h4"/><path d="M13 8l-3 5h4l-3 5"/>',
  rekenmachine: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8v3H8z"/><path d="M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01M16 17h.01"/>',
  tabel: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M9 4v16"/>',
  klok: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  persoon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
  winkel: '<path d="M3 9l2-5h14l2 5"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M5 13v7h14v-7"/>',
  factuur: '<path d="M6 2h9l4 4v16H6z"/><path d="M15 2v4h4M9 11h7M9 15h7M9 19h4"/>',
  bank: '<path d="M3 10 12 4l9 6"/><path d="M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
  uren: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2h4"/>',
  wereld: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
  telefoon: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  ster: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  vink: '<path d="M4 12l5 5L20 6"/>',
  pijl: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  vraag: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
};
/** Inline SVG, decoratief (aria-hidden). */
export function icoon(naam, cls = 'ico') {
  const p = PADEN[naam];
  if (!p) throw new Error(`Onbekend icoon ${naam}`);
  return `<svg class="${cls}" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}
