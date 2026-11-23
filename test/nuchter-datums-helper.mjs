// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
// /blog/isolatie-offertes-vergelijken/ kreeg op 25-11 een eigen bodywijziging (techronde 19-11, inlink); zie test/tech-1911.test.js.
// /spouwmuurisolatie-kosten/ kreeg op 25-11 een eigen bodywijziging (techronde 19-11 SC-fix, inlink); zie test/tech-1911.test.js.
export const STIJL_PADEN = new Set([
  "/",
  "/blog/energiebelasting-2027-isoleren/",
  "/blog/gevelisolatie-kosten/",
  "/blog/huis-verduurzamen-waar-beginnen/",
  "/blog/isde-isolatie-aanvragen/",
  "/blog/warmtepomp-of-isolatie-eerst/",
  "/blog/zonneboiler-kosten/",
  "/blog/zonnepanelen-kosten-2026/",
  "/dakisolatie-kosten/",
  "/glasisolatie-kosten/",
  "/subsidie-isde/",
  "/verduurzaam-match/",
  "/vergelijken/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-17' : vorige;
