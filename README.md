# VerduurzaamMatch.nl
Statische site (Node, geen frameworks). `npm test`, `npm run build`, `npm run images` (illustraties → WebP/OG).
- Cijfers: `src/lib/maatregelen.js` (Milieu Centraal / RVO, met bron). Match: `src/lib/match.js`.
- Partnerlinks: `src/lib/partnerlinks.js` (leeg tot goedkeuring; nooit invloed op advies).
- Netwerkfooter: `src/network.mjs` (één regel per site). GA: `src/analytics.config.mjs`.
Deploy: push naar main → GitHub Actions → Pages.

## Schrijfregel: geen disclaimer-zinnen onder artikelen (16-10-2026, Dave)
Nooit zinnen als "geraadpleegd op …", "kan na een update verschuiven", "controleer altijd zelf", "check altijd de actuele prijs", "informatie/voorwaarden kunnen veranderen", "dit is geen advies". Klinkt te AI-achtig. Bron nodig? Alleen een kale bronnaam/link, zonder datum-voorbehoud. Wettelijk nodige partnerlink-labels en het Goodfellas-blok "Vanaf de pitmuur" blijven.

## Leadtest offertes (branch `leadtest-offerte`, 17-10-2026)
- Partners: `src/lib/leads.js` → `LEADPARTNERS` (leeg = geen offertepagina en geen knoppen; productie ongewijzigd). Eén partner per categorie (warmtepomp, zonnepanelen, isolatie, thuisbatterij).
- Contactgegevens alleen in het formulier van de partner (iframe of redirect). Wij slaan niets op; GA4 krijgt alleen maatregel/termijn/partner.
- Preview: `LEADS_PREVIEW=1 npm run build && npm run serve` → http://localhost:8081/offerte/ (voorbeeldpartner, alles noindex, robots dicht). **Nooit met LEADS_PREVIEW naar main.**
- GA4-events: `lead_cta_click`, `lead_form_start`, `lead_form_step`, `lead_consent`, `lead_partner_view` (iframe), `lead_partner_click` (redirect), `generate_lead` (bedankpagina).
- Live zetten (na akkoord Dave): partner invullen in `LEADPARTNERS`, iframe-origin komt automatisch in `frame-src`, partner laten doorsturen naar `/offerte/bedankt/?m=<categorie>&p=<id>` of `klaar.bericht` (postMessage) instellen, `generate_lead` als key event markeren in GA4.
