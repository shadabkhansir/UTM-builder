// URL building that never breaks the destination: existing functional query
// params are kept byte-for-byte, the #fragment stays last, stray click IDs and
// old UTMs are stripped, and ad-platform macros are left unencoded.

export const UTM_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
  // GA4 campaign dimensions: Session source platform / creative format / marketing tactic
  'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
];

// Click IDs and tracking junk that should never be baked into a shared link.
export const TRACKING_PARAMS = new Set([
  'fbclid', 'gclid', 'gclsrc', 'gbraid', 'wbraid', 'dclid', 'msclkid', 'ttclid', 'twclid',
  'li_fat_id', 'yclid', 'igshid', 'mc_cid', 'mc_eid', '_ga', '_gl', '_hsenc', '_hsmi',
  'mkt_tok', 'oly_anon_id', 'oly_enc_id', 'vero_id', 'rb_clickid', 's_cid', 'srsltid',
  'epik', 'sccid', 'ScCid', 'irclickid',
]);

// {{campaign.name}} (Meta/LinkedIn), {campaignid} (Google/Microsoft), __CAMPAIGN_NAME__ (TikTok)
export const MACRO_RE = /(\{\{[^{}]+\}\}|\{[^{}]+\}|__[A-Z0-9_]+__)/g;
const HAS_MACRO = new RegExp(MACRO_RE.source);

export function splitMacros(value) {
  return String(value).split(MACRO_RE).map((text, i) => ({ text, macro: i % 2 === 1 }));
}

export function encodeValue(value) {
  return splitMacros(value)
    .map(p => (p.macro ? p.text : encodeURIComponent(p.text)))
    .join('');
}

export function normalizeDestination(raw) {
  let s = String(raw ?? '').trim();
  if (!s) return null;
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = 'https://' + s.replace(/^\/+/, '');
  let u;
  try {
    u = new URL(s);
  } catch {
    return null;
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
  if (!u.hostname.includes('.') && u.hostname !== 'localhost') return null;
  return u;
}

// Split a raw query string into [rawKey, rawPair] entries without re-encoding.
function rawPairs(search) {
  return search
    .replace(/^\?/, '')
    .split('&')
    .filter(Boolean)
    .map(pair => {
      const key = pair.split('=')[0];
      let decoded;
      try {
        decoded = decodeURIComponent(key.replace(/\+/g, ' '));
      } catch {
        decoded = key;
      }
      return { key: decoded, pair };
    });
}

// utm: { utm_source: 'x', ... } or { source: 'x', ... }; extra: [[key, value], ...]
export function buildUrl(destination, utm, { stripTracking = true, extra = [] } = {}) {
  const u = destination instanceof URL ? destination : normalizeDestination(destination);
  if (!u) return { ok: false, error: 'Enter a valid http(s) URL', url: '' };

  const removed = [];
  const kept = rawPairs(u.search).filter(({ key }) => {
    const lower = key.toLowerCase();
    const drop = lower.startsWith('utm_') || (stripTracking && (TRACKING_PARAMS.has(key) || TRACKING_PARAMS.has(lower)));
    if (drop) removed.push(key);
    return !drop;
  });

  const params = toUtmEntries(utm).concat(extra.filter(([k, v]) => k && v !== ''));
  const added = params.map(([k, v]) => `${encodeURIComponent(k)}=${encodeValue(v)}`);
  const query = kept.map(p => p.pair).concat(added).join('&');
  const auth = u.username ? `${u.username}${u.password ? ':' + u.password : ''}@` : '';
  const base = `${u.protocol}//${auth}${u.host}${u.pathname}`;

  return {
    ok: true,
    url: base + (query ? '?' + query : '') + u.hash,
    query: added.join('&'),
    removed,
    hasMacros: params.some(([, v]) => HAS_MACRO.test(v)),
  };
}

export function toUtmEntries(utm = {}) {
  const out = [];
  for (const key of UTM_KEYS) {
    const short = key.slice(4);
    const v = utm[key] ?? utm[short];
    if (v != null && String(v).trim() !== '') out.push([key, String(v).trim()]);
  }
  return out;
}

// Pull existing UTM values out of a URL (for "edit an already-tagged link").
export function parseUtm(raw) {
  const u = normalizeDestination(raw);
  if (!u) return {};
  const out = {};
  for (const key of UTM_KEYS) {
    const v = u.searchParams.get(key);
    if (v) out[key.slice(4)] = v;
  }
  return out;
}

export function hostOf(raw) {
  const u = normalizeDestination(raw);
  return u ? u.hostname.replace(/^www\./, '') : '';
}
