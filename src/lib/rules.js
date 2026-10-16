// Workspace governance: naming normalisation, locked value lists, domain
// allowlists and compound campaign-name formulas. Macro tokens are never
// touched by normalisation (TikTok's __CAMPAIGN_NAME__ must stay uppercase).

import { splitMacros, hostOf, normalizeDestination } from './url.js';

export const FIELDS = ['source', 'medium', 'campaign', 'term', 'content', 'id', 'source_platform', 'creative_format', 'marketing_tactic'];
export const GA4_EXTRA_FIELDS = ['source_platform', 'creative_format', 'marketing_tactic'];

export const DEFAULT_RULES = {
  lowercase: true,
  spaceReplacement: '-', // '-', '_', '+', or '' to leave spaces as %20
  stripSpecial: true,
  lockSources: false,
  lockMediums: false,
  required: ['source', 'medium', 'campaign'],
  campaignRegex: '', // optional extra check, e.g. ^\d{4}-\d{2}_[a-z0-9-]+$
  nonLatin: 'allow', // 'allow' | 'transliterate' (Arabic → Latin, é → e) | 'block'
  stripClickIds: true, // flag fbclid/gclid/… on links being checked
};

// Variables usable in any field or campaign formula. Resolved at build time.
export const VARIABLES = ['page_title', 'domain', 'path', 'client', 'user'];
const VAR_RE = /\[(page_title|domain|path|client|user|date(?::[^\]]*)?)\]/gi;

export function resolveVariables(value, ctx = {}) {
  return String(value ?? '').replace(VAR_RE, (_, name) => {
    const n = name.toLowerCase();
    if (n.startsWith('date')) return formatDate(ctx.now || new Date(), name.split(':')[1] || 'yyyy-mm-dd');
    return ctx[n] ?? '';
  });
}

export function hasVariables(value) {
  VAR_RE.lastIndex = 0;
  const found = VAR_RE.test(String(value ?? ''));
  VAR_RE.lastIndex = 0;
  return found;
}

const ARABIC = {
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'aa', 'ٱ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
  'غ': 'gh', 'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a',
  'ة': 'a', 'ء': '', 'ئ': 'y', 'ؤ': 'w', 'ـ': '', 'پ': 'p', 'چ': 'ch', 'ژ': 'zh', 'گ': 'g', 'ک': 'k', 'ی': 'y',
};

export function transliterate(text) {
  return String(text)
    .replace(/[\u064B-\u0652\u0670]/g, '') // Arabic diacritics
    .replace(/[\u0660-\u0669]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, d => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[\u0600-\u06FF]/g, c => ARABIC[c] ?? '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '');
}

const NON_LATIN = /[^\p{Script=Latin}\p{N}\p{P}\p{S}\s]/u;

export function normalizeValue(value, rules = DEFAULT_RULES) {
  const parts = splitMacros(String(value ?? '')).filter(p => p.text !== '');
  return parts
    .map(({ text, macro }, i) => {
      if (macro) return text;
      let t = normalizeText(text, rules);
      if (i === 0) t = t.replace(/^[-_.]+/, '');
      if (i === parts.length - 1) t = t.replace(/[-_.]+$/, '');
      return t;
    })
    .join('');
}

function normalizeText(text, rules) {
  let t = text;
  if (rules.nonLatin === 'transliterate') t = transliterate(t);
  if (rules.lowercase) t = t.toLowerCase();
  if (rules.spaceReplacement) t = t.replace(/\s+/g, rules.spaceReplacement);
  if (rules.stripSpecial) t = t.replace(/[^\p{L}\p{N}\-_.~+|:]/gu, '');
  if (rules.spaceReplacement) {
    const sep = escapeRe(rules.spaceReplacement);
    t = t.replace(new RegExp(`(${sep}){2,}`, 'g'), rules.spaceReplacement);
  }
  return t;
}

export function normalizeAll(values, rules = DEFAULT_RULES) {
  const out = { ...values };
  for (const f of FIELDS) if (out[f] != null) out[f] = normalizeValue(out[f], rules);
  return out;
}

// Returns [{ field, level: 'error'|'warn', message }]
export function validate(values, workspace, destination) {
  const rules = { ...DEFAULT_RULES, ...(workspace?.rules || {}) };
  const issues = [];
  const v = values || {};

  for (const f of rules.required || []) {
    if (!String(v[f] ?? '').trim()) issues.push({ field: f, level: 'error', message: `utm_${f} is required` });
  }

  const sources = workspace?.sources || [];
  if (rules.lockSources && sources.length && v.source && !sources.includes(v.source)) {
    issues.push({ field: 'source', level: 'error', message: `"${v.source}" is not an approved source for ${workspace.name}` });
  }
  const mediums = workspace?.mediums || [];
  if (rules.lockMediums && mediums.length && v.medium && !mediums.includes(v.medium)) {
    issues.push({ field: 'medium', level: 'error', message: `"${v.medium}" is not an approved medium for ${workspace.name}` });
  }

  if (rules.campaignRegex && v.campaign) {
    let re = null;
    try {
      re = new RegExp(rules.campaignRegex);
    } catch {
      issues.push({ field: 'campaign', level: 'warn', message: 'The campaign pattern in Settings is not a valid regular expression' });
    }
    if (re && !re.test(v.campaign)) {
      issues.push({ field: 'campaign', level: 'error', message: `Campaign doesn't match ${workspace?.name || 'the'} naming pattern ${rules.campaignRegex}` });
    }
  }

  for (const f of FIELDS) {
    const raw = String(v[f] ?? '');
    if (!raw) continue;
    if (rules.nonLatin === 'block' && NON_LATIN.test(raw.replace(/\{[^}]*\}|__[A-Z0-9_]+__/g, ''))) {
      issues.push({ field: f, level: 'error', message: `utm_${f} contains non-Latin characters; this workspace requires Latin only` });
    }
    if (raw !== normalizeValue(raw, rules)) {
      issues.push({ field: f, level: 'warn', message: `utm_${f} breaks naming rules → "${normalizeValue(raw, rules)}"` });
    }
  }

  const domains = (workspace?.domains || []).map(d => d.toLowerCase().replace(/^www\./, ''));
  if (destination && domains.length) {
    const host = hostOf(destination);
    if (host && !domains.some(d => host === d || host.endsWith('.' + d))) {
      issues.push({ field: 'url', level: 'warn', message: `${host} is not in ${workspace.name}'s domain list` });
    }
  }
  if (destination && !normalizeDestination(destination)) {
    issues.push({ field: 'url', level: 'error', message: 'Destination is not a valid http(s) URL' });
  }
  return issues;
}

// Campaign formula: "[date:yyyy-mm]_[product]_[region]_[objective]".
// Square brackets so formulas never collide with {macro} syntax.
export function parseFormula(formula) {
  const parts = [];
  const re = /\[([^\]]+)\]/g;
  let last = 0;
  let m;
  while ((m = re.exec(formula || ''))) {
    if (m.index > last) parts.push({ type: 'literal', text: formula.slice(last, m.index) });
    const token = m[1].trim();
    if (token.toLowerCase().startsWith('date')) {
      parts.push({ type: 'date', fmt: token.split(':')[1] || 'yyyy-mm-dd' });
    } else if (VARIABLES.includes(token.toLowerCase())) {
      parts.push({ type: 'var', name: token.toLowerCase() });
    } else {
      const [name, ...opts] = token.split('|');
      parts.push({ type: 'field', name: name.trim(), options: opts.join('|').split(',').map(s => s.trim()).filter(Boolean) });
    }
    last = re.lastIndex;
  }
  if (last < (formula || '').length) parts.push({ type: 'literal', text: formula.slice(last) });
  return parts;
}

export function formulaFields(formula) {
  return parseFormula(formula).filter(p => p.type === 'field');
}

export function assembleFormula(formula, inputs, rules = DEFAULT_RULES, now = new Date(), ctx = {}) {
  // Empty fields drop out together with the separator before them (or after,
  // when the field leads), so "[a]_[b]_[c]" with b empty gives "a_c".
  const parts = parseFormula(formula).map(p => {
    if (p.type === 'literal') return { ...p, value: p.text };
    if (p.type === 'date') return { ...p, value: formatDate(now, p.fmt) };
    if (p.type === 'var') return { ...p, value: normalizeValue(ctx[p.name] ?? '', rules) };
    return { ...p, value: normalizeValue(inputs?.[p.name] ?? '', rules) };
  });
  const out = [];
  let pendingSep = '';
  let started = false;
  for (const p of parts) {
    if (p.type === 'literal') {
      pendingSep += p.value;
      continue;
    }
    if (!p.value) {
      pendingSep = '';
      continue;
    }
    out.push(started ? pendingSep : pendingSep.replace(/^[-_\s]+/, ''), p.value);
    pendingSep = '';
    started = true;
  }
  return out.join('') + (started ? pendingSep.replace(/[-_\s]+$/, '') : '');
}

export function formatDate(d, fmt) {
  const pad = n => String(n).padStart(2, '0');
  const q = Math.floor(d.getMonth() / 3) + 1;
  return fmt
    .replace(/yyyy/g, d.getFullYear())
    .replace(/yy/g, String(d.getFullYear()).slice(-2))
    .replace(/mm/g, pad(d.getMonth() + 1))
    .replace(/dd/g, pad(d.getDate()))
    .replace(/ww/g, pad(isoWeek(d)))
    .replace(/q/g, 'q' + q);
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
