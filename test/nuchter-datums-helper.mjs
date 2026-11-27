// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
// /blog/isolatie-offertes-vergelijken/ kreeg op 25-11 een eigen bodywijziging (techronde 19-11, inlink); zie test/tech-1911.test.js.
// /spouwmuurisolatie-kosten/ kreeg op 25-11 een eigen bodywijziging (techronde 19-11 SC-fix, inlink); zie test/tech-1911.test.js.
// /blog/huis-verduurzamen-waar-beginnen/ kreeg op 26-11 een eigen bodywijziging (wk48, inlink energielabel); zie test/wk48-energielabel.test.js.
// /verduurzaam-match/ kreeg op 27-11 een client-side wijziging (Daisycon-partnerlinks in het offerteblok); zie test/huisassist-offerte.test.js.
export const STIJL_PADEN = new Set([
  "/",
  "/blog/energiebelasting-2027-isoleren/",
  "/blog/gevelisolatie-kosten/",
  "/blog/isde-isolatie-aanvragen/",
  "/blog/warmtepomp-of-isolatie-eerst/",
  "/blog/zonneboiler-kosten/",
  "/blog/zonnepanelen-kosten-2026/",
  "/dakisolatie-kosten/",
  "/glasisolatie-kosten/",
  "/subsidie-isde/",
  "/vergelijken/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-17' : vorige;
