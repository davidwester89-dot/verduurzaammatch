# VerduurzaamMatch.nl
Statische site (Node, geen frameworks). `npm test`, `npm run build`, `npm run images` (illustraties → WebP/OG).
- Cijfers: `src/lib/maatregelen.js` (Milieu Centraal / RVO, met bron). Match: `src/lib/match.js`.
- Partnerlinks: `src/lib/partnerlinks.js` (leeg tot goedkeuring; nooit invloed op advies).
- Netwerkfooter: `src/network.mjs` (één regel per site). GA: `src/analytics.config.mjs`.
Deploy: push naar main → GitHub Actions → Pages.

## Schrijfregel: geen disclaimer-zinnen onder artikelen (16-10-2026, Dave)
Nooit zinnen als "geraadpleegd op …", "kan na een update verschuiven", "controleer altijd zelf", "check altijd de actuele prijs", "informatie/voorwaarden kunnen veranderen", "dit is geen advies". Klinkt te AI-achtig. Bron nodig? Alleen een kale bronnaam/link, zonder datum-voorbehoud. Wettelijk nodige partnerlink-labels en het Goodfellas-blok "Vanaf de pitmuur" blijven.
