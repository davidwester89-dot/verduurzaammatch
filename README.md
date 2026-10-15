# VerduurzaamMatch.nl
Statische site (Node, geen frameworks). `npm test`, `npm run build`, `npm run images` (illustraties → WebP/OG).
- Cijfers: `src/lib/maatregelen.js` (Milieu Centraal / RVO, met bron). Match: `src/lib/match.js`.
- Partnerlinks: `src/lib/partnerlinks.js` (leeg tot goedkeuring; nooit invloed op advies).
- Netwerkfooter: `src/network.mjs` (één regel per site). GA: `src/analytics.config.mjs`.
Deploy: push naar main → GitHub Actions → Pages.
