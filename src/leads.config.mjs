// Welke offertepartners zijn actief in deze build. Productie: alleen goedgekeurde partners (nu: geen).
// Preview (LEADS_PREVIEW=1): voorbeeldpartner, alle pagina's noindex. Nooit naar main deployen met preview aan.
import { actievePartners, routing, frameOrigins } from './lib/leads.js';
export const PREVIEW = process.env.LEADS_PREVIEW === '1';
export const LEADS = actievePartners({ preview: PREVIEW });
export const ROUTING = routing(LEADS);
export const LEADS_AAN = Object.keys(LEADS).length > 0;
export const FRAMES = frameOrigins(LEADS);
