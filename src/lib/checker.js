// UTM Checker: grades existing links (from a page, an email draft or pasted
// text/HTML) against GA4's channel rules and the workspace's naming rules,
// and builds a corrected version of each link. Pure functions, no DOM.

import { analyze } from './ga4.js';
import { buildUrl, normalizeDestination, splitMacros, TRACKING_PARAMS, UTM_KEYS, MACRO_RE } from './url.js';
import { normalizeValue, parseFormula, DEFAULT_RULES } from './rules.js';

export const LEVELS = { critical: 3, warning: 2, unverifiable: 1, pass: 0 };
export const MAX_LINKS = 2000;

const SKIP_RE = /^(mailto:|tel:|sms:|javascript:|data:|#)/i;
// ESP merge tags / personalisation: Mailchimp *|X|*, Liquid/HubSpot {{ x }} and {% x %}, Salesforce %%x%%, [[x]], <%= x %>
const MERGE_RE = /(\*\|[^|]*\|\*|\{\{[^}]*\}\}|\{%[^%]*%\}|%%[^%\s]+%%|\[\[[^\]]*\]\]|<%[^%]*%>)/;
const MERGE_SAFE_MACROS = /\{\{(campaign|adset|ad|site_source_name|placement)\.?[a-z_]*\}\}|\{\{[A-Z_]+\}\}/g;

// ---------- extraction ----------

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

// Pull every link out of pasted HTML, plain text or a URL list.
export function extractLinks(input) {
  const text = String(input || '');
  const links = [];
  const seenSpans = [];
  const aRe = /<a\b[^>]*?\bhref\s*=\s*(["'])([\s\S]*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = aRe.exec(text))) {
    links.push({ href: decodeEntities(m[2].trim()), text: decodeEntities(m[3].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()) });
    seenSpans.push([m.index, aRe.lastIndex]);
  }
  const urlRe = /https?:\/\/[^\s"'<>()]+/gi;
  while ((m = urlRe.exec(text))) {
    if (seenSpans.some(([a, b]) => m.index >= a && m.index < b)) continue;
    links.push({ href: m[0].replace(/[),.;:!?]+$/, ''), text: '' });
  }
  return links;
}

// Outlook Safe Links and Google redirect wrappers hide the real destination.
export function unwrap(href) {
  try {
    const u = new URL(href);
    if (/(^|\.)safelinks\.protection\.outlook\.com$/i.test(u.hostname) && u.searchParams.get('url')) {
      return { href: u.searchParams.get('url'), wrapper: 'Outlook Safe Links' };
    }
    if (/^(www\.)?google\.[a-z.]+$/i.test(u.hostname) && u.pathname === '/url') {
      const inner = u.searchParams.get('q') || u.searchParams.get('url');
      if (inner && /^https?:/i.test(inner)) return { href: inner, wrapper: 'Google redirect' };
    }
  } catch {
    // not a URL; fall through
  }
  return { href, wrapper: '' };
}

// ---------- parsing ----------

function safeDecode(s) {
  try {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  } catch {
    return s;
  }
}

// Raw query pairs, including UTMs hidden after a second "?" or in the #fragment.
function readParams(u, rawSearch) {
  const pairs = [];
  const add = (str, where) => {
    for (const part of str.split('&')) {
      if (!part) continue;
      const i = part.indexOf('=');
      const rawKey = i < 0 ? part : part.slice(0, i);
      const rawVal = i < 0 ? '' : part.slice(i + 1);
      pairs.push({ key: safeDecode(rawKey).toLowerCase(), rawKey, rawVal, value: safeDecode(rawVal), where });
    }
  };
  add(rawSearch.replace(/^\?/, '').replace(/\?/g, '&'), 'query');
  const hash = u.hash.replace(/^#/, '');
  const qi = hash.indexOf('?');
  const hashParams = qi >= 0 ? hash.slice(qi + 1) : hash.includes('=') ? hash : '';
  if (/(^|&)utm_/i.test(hashParams)) add(hashParams, 'hash');
  return pairs;
}

// ---------- campaign pattern ----------

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Workspace formula "[date:yyyy-mm]_[product]_[region|uae,ksa]" → a regex for grading.
export function formulaToRegex(formula) {
  if (!formula) return null;
  const parts = parseFormula(formula).map(p => {
    if (p.type === 'literal') return escapeRe(p.text);
    if (p.type === 'date') {
      return p.fmt
        .split(/(yyyy|yy|mm|dd|ww|q)/)
        .map(t => ({ yyyy: '\\d{4}', yy: '\\d{2}', mm: '\\d{2}', dd: '\\d{2}', ww: '\\d{2}', q: 'q[1-4]' })[t] || escapeRe(t))
        .join('');
    }
    if (p.options?.length) return `(?:${p.options.map(escapeRe).join('|')})`;
    return '[^_\\s]+?';
  });
  return new RegExp(`^${parts.join('')}$`, 'i');
}

// ---------- checks ----------

function issue(code, level, message) {
  return { code, level, message };
}

function worst(issues) {
  let level = 'pass';
  for (const i of issues) if (LEVELS[i.level] > LEVELS[level]) level = i.level;
  return level;
}

function hostMatches(host, domains) {
  const h = host.replace(/^www\./, '').toLowerCase();
  return domains.some(d => h === d || h.endsWith('.' + d));
}

// Check one link. ws = workspace (rules, sources, mediums, domains, campaignFormula).
export function checkLink(link, ws = {}) {
  const raw = typeof link === 'string' ? link : link.href;
  const text = typeof link === 'string' ? '' : link.text || '';
  const rules = { ...DEFAULT_RULES, ...(ws.rules || {}) };
  const result = { original: raw, href: raw, text, issues: [], utm: {}, tagged: false, channel: '', why: '', fixed: '', level: 'pass', wrapper: '' };

  if (!raw || SKIP_RE.test(raw.trim()) || !/^https?:/i.test(raw.trim())) return { ...result, skipped: true };
  if (MERGE_RE.test(raw.replace(MERGE_SAFE_MACROS, ''))) {
    result.issues.push(issue('merge-tag', 'unverifiable', 'Contains a merge tag that your email platform fills in at send time, so the final link can’t be checked here.'));
    result.level = 'unverifiable';
    return result;
  }

  const un = unwrap(raw.trim());
  result.href = un.href;
  result.wrapper = un.wrapper;
  if (un.wrapper) result.issues.push(issue('wrapped', 'warning', `Wrapped by ${un.wrapper}. Checked the real destination instead.`));

  const u = normalizeDestination(un.href);
  if (!u || !/^https?:/i.test(un.href)) {
    result.issues.push(issue('invalid', 'critical', 'Not a valid web address.'));
    result.level = 'critical';
    return result;
  }
  const qStart = un.href.indexOf('?');
  const hStart = un.href.indexOf('#');
  const rawSearch = qStart >= 0 && (hStart < 0 || qStart < hStart) ? un.href.slice(qStart, hStart >= 0 ? hStart : undefined) : '';
  const pairs = readParams(u, rawSearch);
  const utmPairs = pairs.filter(p => p.key.startsWith('utm_'));
  result.tagged = utmPairs.length > 0;

  // Structure
  if ((rawSearch.match(/\?/g) || []).length > 1) {
    result.issues.push(issue('extra-question', 'critical', 'The link has a second “?”. Everything after it is glued to the previous value, so GA4 misses those parameters.'));
  }
  if (utmPairs.some(p => p.where === 'hash')) {
    result.issues.push(issue('utm-hash', 'critical', 'UTMs are after the “#”. Browsers don’t send that part, so GA4 never sees them.'));
  }
  const counts = {};
  for (const p of utmPairs) counts[p.key] = (counts[p.key] || 0) + 1;
  for (const [k, n] of Object.entries(counts)) if (n > 1) result.issues.push(issue('duplicate-param', 'warning', `${k} appears ${n} times. Keep one.`));
  for (const p of utmPairs) if (!p.value.trim()) result.issues.push(issue('empty-param', 'warning', `${p.key} is empty.`));
  for (const p of utmPairs) {
    if (/%7b|%7d/i.test(p.rawVal)) result.issues.push(issue('encoded-macro', 'warning', `${p.key} has an encoded ad macro (%7B…%7D). The ad platform won’t replace it.`));
    else if (/%25[0-9a-f]{2}/i.test(p.rawVal)) result.issues.push(issue('double-encoded', 'warning', `${p.key} is encoded twice (%25…), so GA4 shows codes instead of text.`));
  }
  const clickIds = pairs.filter(p => TRACKING_PARAMS.has(p.key) || TRACKING_PARAMS.has(p.rawKey));
  if (rules.stripClickIds !== false && clickIds.length) {
    result.issues.push(issue('click-id', 'warning', `Contains ${[...new Set(clickIds.map(p => p.rawKey))].join(', ')}. Click IDs belong to one visit and shouldn’t be shared.`));
  }

  // Values (first non-empty value of each UTM wins)
  const utm = {};
  for (const p of utmPairs) {
    const field = p.key.slice(4);
    if (!UTM_KEYS.includes(p.key) || utm[field]) continue;
    let v = p.value;
    if (/%[0-9a-f]{2}/i.test(v)) v = safeDecode(v);
    if (v.trim()) utm[field] = v.trim();
  }
  result.utm = utm;

  const domains = (ws.domains || []).map(d => d.toLowerCase().replace(/^www\./, ''));
  if (!result.tagged) {
    if (domains.length && hostMatches(u.hostname, domains)) {
      result.issues.push(issue('untagged', 'warning', `Links to ${u.hostname.replace(/^www\./, '')} with no UTMs. GA4 will credit the previous source or Direct.`));
    }
  } else {
    for (const f of rules.required || []) {
      if (!utm[f]) result.issues.push(issue('missing', 'critical', `utm_${f} is missing.`));
    }
    for (const [f, v] of Object.entries(utm)) {
      const plain = splitMacros(v).filter(x => !x.macro).map(x => x.text).join('');
      const reasons = [];
      if (rules.lowercase && plain !== plain.toLowerCase()) reasons.push('uppercase');
      if (rules.spaceReplacement && /\s/.test(plain)) reasons.push('spaces');
      if (rules.stripSpecial && /[^\p{L}\p{N}\-_.~+|:\s]/u.test(plain)) reasons.push('special characters');
      if (reasons.length) {
        result.issues.push(issue('naming', 'warning', `utm_${f} “${v}” has ${reasons.join(', ')} → “${normalizeValue(v, rules)}”. GA4 treats different spellings as different values.`));
      }
      // Campaign names often mix separators on purpose (2026-10_boots), so skip them.
      if (f !== 'campaign' && /-/.test(plain) && /_/.test(plain)) result.issues.push(issue('mixed-separators', 'warning', `utm_${f} “${v}” mixes “-” and “_”.`));
    }
    const norm = f => normalizeValue(utm[f] || '', rules);
    for (const [field, list] of [['source', ws.sources || []], ['medium', ws.mediums || []]]) {
      const value = norm(field);
      if (!value || !list.length || list.includes(value)) continue;
      const locked = field === 'source' ? rules.lockSources : rules.lockMediums;
      result.issues.push(issue('not-approved', locked ? 'critical' : 'warning', `utm_${field} “${value}” isn’t on ${ws.name || 'the workspace'}’s approved list.`));
    }
    if (utm.campaign) {
      const c = norm('campaign');
      const fRe = formulaToRegex(ws.campaignFormula);
      if (fRe && !fRe.test(c)) result.issues.push(issue('campaign-pattern', 'warning', `Campaign “${c}” doesn’t follow the naming formula ${ws.campaignFormula}.`));
      if (rules.campaignRegex) {
        try {
          if (!new RegExp(rules.campaignRegex).test(c)) result.issues.push(issue('campaign-regex', 'warning', `Campaign “${c}” doesn’t match the pattern ${rules.campaignRegex}.`));
        } catch {
          // invalid workspace regex is reported in Settings
        }
      }
    }
    if (domains.length && !hostMatches(u.hostname, domains)) {
      result.issues.push(issue('domain', 'warning', `${u.hostname} isn’t one of ${ws.name || 'the workspace'}’s domains.`));
    }
    const a = analyze({ source: norm('source'), medium: norm('medium'), campaign: norm('campaign') });
    result.channel = a.channel || 'Unassigned';
    result.why = a.why;
    if (a.level === 'error') result.issues.push(issue('ga4-unassigned', 'critical', `GA4 will put this in Unassigned: ${a.why}.`));
    else if (a.level === 'warn') for (const msg of a.messages) result.issues.push(issue('ga4', 'warning', msg));
    result.ga4Fix = a.fixes;
  }

  result.fixed = fixLink(result, rules);
  if (result.fixed === raw) result.fixed = '';
  result.level = worst(result.issues);
  return result;
}

// Corrected link for a checked result: real destination, UTMs in the query,
// values cleaned to the workspace rules and GA4's recognised sources, no click IDs.
function fixLink(result, rules) {
  const u = normalizeDestination(result.href);
  if (!u) return '';
  const values = {};
  for (const [f, v] of Object.entries(result.utm)) values[f] = normalizeValue(v.replace(/%7B/gi, '{').replace(/%7D/gi, '}'), rules);
  for (const fx of result.ga4Fix || []) if (fx.field === 'source' && values.source) values.source = fx.value;
  // Fold a second "?" into "&" and drop UTMs from the fragment before rebuilding.
  const qStart = result.href.indexOf('?');
  let href = result.href;
  if (qStart >= 0) href = href.slice(0, qStart + 1) + href.slice(qStart + 1).replace(/\?/g, (m, i, s) => (s.lastIndexOf('#', i) >= 0 ? m : '&'));
  const base = normalizeDestination(href);
  if (!base) return '';
  const hash = base.hash.replace(/^#/, '');
  if (/(^|[?&])utm_/i.test(hash)) {
    const qi = hash.indexOf('?');
    const head = qi >= 0 ? hash.slice(0, qi) : hash.includes('=') ? '' : hash;
    const rest = (qi >= 0 ? hash.slice(qi + 1) : hash.includes('=') ? hash : '').split('&').filter(p => p && !/^utm_/i.test(p));
    base.hash = head + (rest.length ? (head ? '?' : '') + rest.join('&') : '');
  }
  if (!result.tagged) return '';
  const res = buildUrl(base, values, { stripTracking: rules.stripClickIds !== false });
  return res.ok ? res.url : '';
}

// Check many links: adds duplicate detection and a summary.
export function checkLinks(links, ws = {}) {
  const list = links.slice(0, MAX_LINKS);
  const results = [];
  let skipped = 0;
  const seen = new Map();
  for (const l of list) {
    const r = checkLink(l, ws);
    if (r.skipped) {
      skipped++;
      continue;
    }
    const key = r.fixed || r.href;
    if (r.tagged && seen.has(key)) {
      const first = seen.get(key);
      first.dupes = (first.dupes || 1) + 1;
      continue;
    }
    if (r.tagged) seen.set(key, r);
    results.push(r);
  }
  for (const r of results) {
    if (r.dupes > 1) {
      r.issues.push(issue('duplicate-link', 'warning', `Appears ${r.dupes} times. Use a different utm_content per placement to tell them apart.`));
      r.level = worst(r.issues);
    }
  }
  const summary = { total: results.length, critical: 0, warning: 0, pass: 0, unverifiable: 0, untagged: 0, skipped, truncated: links.length > MAX_LINKS };
  for (const r of results) {
    summary[r.level]++;
    if (!r.tagged && r.level !== 'unverifiable') summary.untagged++;
  }
  return { results, summary };
}

// Replace every fixable href in pasted HTML with its fixed version.
export function fixHtml(html, ws = {}) {
  let changed = 0;
  const out = String(html).replace(/(<a\b[^>]*?\bhref\s*=\s*)(["'])([\s\S]*?)\2/gi, (all, pre, q, rawHref) => {
    const r = checkLink(decodeEntities(rawHref.trim()), ws);
    if (!r.fixed || r.skipped) return all;
    changed++;
    const enc = r.fixed.replace(/&/g, '&amp;').replace(new RegExp(q, 'g'), q === '"' ? '&quot;' : '&#39;');
    return `${pre}${q}${enc}${q}`;
  });
  return { html: out, changed };
}

export function looksLikeHtml(text) {
  return /<a\b[^>]*href/i.test(String(text || ''));
}

export { MACRO_RE };
