// Onafhankelijke verwachting voor de stijlrelease van 13 november 2026.
export const STIJL_PADEN = new Set([
  "/",
  "/blog/energiebelasting-2027-isoleren/",
  "/blog/gevelisolatie-kosten/",
  "/blog/huis-verduurzamen-waar-beginnen/",
  "/blog/isde-isolatie-aanvragen/",
  "/blog/isolatie-offertes-vergelijken/",
  "/blog/warmtepomp-of-isolatie-eerst/",
  "/blog/zonneboiler-kosten/",
  "/blog/zonnepanelen-kosten-2026/",
  "/dakisolatie-kosten/",
  "/glasisolatie-kosten/",
  "/spouwmuurisolatie-kosten/",
  "/subsidie-isde/",
  "/verduurzaam-match/",
  "/vergelijken/"
]);
export const revisieDatum = (pad, vorige) => STIJL_PADEN.has(pad) ? '2026-11-13' : vorige;
