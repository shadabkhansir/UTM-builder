// WhatsApp click-to-chat links (https://wa.me/<number>?text=<message>).
// Format per WhatsApp's FAQ (https://faq.whatsapp.com/5913398998672934): full
// international number, digits only. UTMs on the wa.me URL never reach GA4
// because the click opens WhatsApp, not your site, so we tag the website link
// inside the message instead.

import { buildUrl } from './url.js';
import { analyze } from './ga4.js';

export const LINK_TOKEN = '{link}';
export const MESSAGE_SOFT_LIMIT = 2000; // estimate: no official limit published

// Common country calling codes, most-used first for our audiences (not US-first).
export const COUNTRY_CODES = [
  ['91', 'India'], ['971', 'United Arab Emirates'], ['966', 'Saudi Arabia'], ['44', 'United Kingdom'], ['1', 'United States / Canada'],
  ['965', 'Kuwait'], ['974', 'Qatar'], ['973', 'Bahrain'], ['968', 'Oman'], ['92', 'Pakistan'], ['880', 'Bangladesh'],
  ['94', 'Sri Lanka'], ['977', 'Nepal'], ['65', 'Singapore'], ['60', 'Malaysia'], ['62', 'Indonesia'], ['63', 'Philippines'],
  ['61', 'Australia'], ['64', 'New Zealand'], ['27', 'South Africa'], ['234', 'Nigeria'], ['254', 'Kenya'], ['20', 'Egypt'],
  ['49', 'Germany'], ['33', 'France'], ['34', 'Spain'], ['39', 'Italy'], ['31', 'Netherlands'], ['353', 'Ireland'],
  ['55', 'Brazil'], ['52', 'Mexico'], ['54', 'Argentina'], ['57', 'Colombia'], ['90', 'Türkiye'],
];

// Region from the browser language ("en-IN" → IN) mapped to a calling code.
const REGION_TO_CODE = { IN: '91', AE: '971', SA: '966', GB: '44', US: '1', CA: '1', KW: '965', QA: '974', BH: '973', OM: '968', PK: '92', BD: '880', LK: '94', NP: '977', SG: '65', MY: '60', ID: '62', PH: '63', AU: '61', NZ: '64', ZA: '27', NG: '234', KE: '254', EG: '20', DE: '49', FR: '33', ES: '34', IT: '39', NL: '31', IE: '353', BR: '55', MX: '52', AR: '54', CO: '57', TR: '90' };

export function defaultCountry(languages = []) {
  for (const l of languages) {
    const region = String(l).split('-')[1]?.toUpperCase();
    if (region && REGION_TO_CODE[region]) return REGION_TO_CODE[region];
  }
  return '91';
}

// "+44 (0)7700 900123" with country 44 → "447700900123".
export function normalizeNumber(input, country = '') {
  let s = String(input || '').trim();
  if (!s) return { digits: '', warning: '' };
  const hadPlus = s.startsWith('+') || s.startsWith('00');
  s = s.replace(/\(0\)/g, '');
  let digits = s.replace(/\D/g, '');
  if (s.startsWith('00')) digits = digits.slice(2);
  if (!hadPlus) {
    if (country && digits.startsWith(country) && digits.length > 10) {
      // already includes the country code
    } else {
      digits = country + digits.replace(/^0+/, '');
    }
  }
  let warning = '';
  if (digits.length < 8 || digits.length > 15) warning = 'That doesn’t look like a full international number (8–15 digits including the country code).';
  return { digits, warning };
}

// Build the message with a tagged landing link, then the wa.me URL.
// opts: { country, number, message, landing, utm: {source, medium, campaign, content}, ref, stripTracking }
export function buildWhatsApp(opts = {}) {
  const { digits, warning: numberWarning } = normalizeNumber(opts.number, opts.country);
  const warnings = [];
  if (numberWarning) warnings.push(numberWarning);

  let landing = null;
  let ga4 = null;
  if (opts.landing) {
    landing = buildUrl(opts.landing, opts.utm || {}, { stripTracking: opts.stripTracking !== false });
    if (!landing.ok) warnings.push(`Landing page: ${landing.error}`);
    else ga4 = analyze(opts.utm || {});
  }

  let message = String(opts.message || '');
  const link = landing?.ok ? landing.url : '';
  if (link) {
    if (message.includes(LINK_TOKEN)) message = message.split(LINK_TOKEN).join(link);
    else message = message ? `${message.trimEnd()}\n${link}` : link;
  } else {
    message = message.split(LINK_TOKEN).join('').trim();
  }
  if (opts.ref) message = `${message.trimEnd()}${message ? '\n' : ''}Ref: ${String(opts.ref).trim()}`;
  if (message.length > MESSAGE_SOFT_LIMIT) warnings.push(`The message is ${message.length} characters. Long pre-filled messages can be cut off on some phones.`);

  const url = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
  return { url, digits, message, landingUrl: link, ga4, warnings };
}
