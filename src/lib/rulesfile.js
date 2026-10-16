// Team rules file, format "tgf.utm-rules" v1 (docs/RULES_SCHEMA.md).
// Shared with The Growth Folks® Bulk UTM Link Checker web tool.

import { DEFAULT_RULES, FIELDS, normalizeValue } from './rules.js';

export const RULES_TYPE = 'tgf.utm-rules';
export const RULES_FILE_VERSION = 1;
export const MAX_BYTES = 256 * 1024;
const MAX_VALUES = 2000;
const SPACE_OPTIONS = ['-', '_', '+', ''];
const NON_LATIN = ['allow', 'transliterate', 'block'];
const DATE_TOKENS = ['yyyy', 'yy', 'mm', 'dd', 'ww', 'q'];

// In-app "[date:yyyy-mm]_[product|a,b]" → file "{yyyy}-{mm}_{product|a,b}".
export function formulaToPattern(formula) {
  return String(formula || '').replace(/\[([^\]]+)\]/g, (_, token) => {
    const t = token.trim();
    if (/^date/i.test(t)) {
      const fmt = t.split(':')[1] || 'yyyy-mm-dd';
      return fmt.replace(/yyyy|yy|mm|dd|ww|q/g, x => `{${x}}`);
    }
    return `{${t}}`;
  });
}

// File "{yyyy}-{mm}_{product}" or "{date:yyyy-mm}" → in-app "[date:yyyy]-[date:mm]_[product]".
export function patternToFormula(pattern) {
  return String(pattern || '').replace(/\{([^}]+)\}/g, (_, token) => {
    const t = token.trim();
    if (DATE_TOKENS.includes(t)) return `[date:${t}]`;
    if (/^date:/i.test(t)) return `[date:${t.slice(5)}]`;
    return `[${t}]`;
  });
}

export function toRulesFile(ws) {
  const r = { ...DEFAULT_RULES, ...(ws.rules || {}) };
  const list = (values, locked) => ({
    values: [...(values || [])],
    locked: !!locked,
    labels: Object.fromEntries(Object.entries(ws.labels || {}).filter(([k]) => (values || []).includes(k))),
  });
  return {
    type: RULES_TYPE,
    version: RULES_FILE_VERSION,
    name: ws.name || 'Untitled',
    updatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
    casing: r.lowercase ? 'lower' : 'preserve',
    spaceReplacement: r.spaceReplacement,
    stripSpecial: !!r.stripSpecial,
    nonLatin: r.nonLatin || 'allow',
    stripClickIds: r.stripClickIds !== false,
    required: [...(r.required || [])],
    sources: list(ws.sources, r.lockSources),
    mediums: list(ws.mediums, r.lockMediums),
    domains: [...(ws.domains || [])],
    campaign: { pattern: formulaToPattern(ws.campaignFormula), regex: r.campaignRegex || '' },
    defaultParams: (ws.extraParams || []).map(p => ({ key: p.key, value: p.value || '' })),
  };
}

// Parse and validate. Returns { patch, name, ignored: [keys], warnings: [] } or throws.
export function fromRulesFile(text) {
  if (String(text).length > MAX_BYTES) throw new Error('The rules file is larger than 256 KB.');
  let data;
  try {
    data = typeof text === 'string' ? JSON.parse(text) : text;
  } catch {
    throw new Error('That isn’t valid JSON.');
  }
  if (!data || data.type !== RULES_TYPE) throw new Error('This isn’t a UTM rules file (type must be "tgf.utm-rules").');
  if (!Number.isInteger(data.version)) throw new Error('The rules file has no version.');
  if (data.version > RULES_FILE_VERSION) throw new Error('This rules file was made with a newer version. Update the tool to import it.');
  if (typeof data.name !== 'string' || !data.name.trim()) throw new Error('The rules file needs a name.');

  const ignored = [];
  const pick = (key, ok, fallback) => {
    if (data[key] === undefined) return fallback;
    if (ok(data[key])) return data[key];
    ignored.push(key);
    return fallback;
  };
  const casing = pick('casing', v => ['lower', 'preserve'].includes(v), 'lower');
  const spaceReplacement = pick('spaceReplacement', v => SPACE_OPTIONS.includes(v), DEFAULT_RULES.spaceReplacement);
  const stripSpecial = pick('stripSpecial', v => typeof v === 'boolean', true);
  const nonLatin = pick('nonLatin', v => NON_LATIN.includes(v), 'allow');
  const stripClickIds = pick('stripClickIds', v => typeof v === 'boolean', true);
  const required = pick('required', v => Array.isArray(v) && v.every(x => FIELDS.includes(x)), DEFAULT_RULES.required);
  const rules = { ...DEFAULT_RULES, lowercase: casing === 'lower', spaceReplacement, stripSpecial, nonLatin, stripClickIds, required };

  const valueList = key => {
    const v = data[key];
    if (v === undefined) return { values: [], locked: false, labels: {} };
    if (!v || !Array.isArray(v.values)) {
      ignored.push(key);
      return { values: [], locked: false, labels: {} };
    }
    const values = [...new Set(v.values.slice(0, MAX_VALUES).map(x => normalizeValue(String(x), rules)).filter(Boolean))];
    const labels = v.labels && typeof v.labels === 'object' ? Object.fromEntries(Object.entries(v.labels).filter(([k, l]) => values.includes(normalizeValue(k, rules)) && typeof l === 'string')) : {};
    return { values, locked: v.locked === true, labels };
  };
  const sources = valueList('sources');
  const mediums = valueList('mediums');
  const domains = pick('domains', v => Array.isArray(v), []).map(d => String(d).toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '')).filter(Boolean);
  const campaign = pick('campaign', v => v && typeof v === 'object', {});
  const warnings = [];
  let regex = typeof campaign.regex === 'string' ? campaign.regex : '';
  if (regex) {
    try {
      new RegExp(regex);
    } catch {
      warnings.push('The campaign regex is invalid and was ignored.');
      regex = '';
    }
  }
  const defaultParams = pick('defaultParams', v => Array.isArray(v), [])
    .filter(p => p && typeof p.key === 'string' && p.key.trim())
    .map(p => ({ key: p.key.trim(), value: String(p.value ?? '') }));
  const known = ['type', 'version', 'name', 'updatedAt', 'casing', 'spaceReplacement', 'stripSpecial', 'nonLatin', 'stripClickIds', 'required', 'sources', 'mediums', 'domains', 'campaign', 'defaultParams'];
  const unknown = Object.keys(data).filter(k => !known.includes(k));

  return {
    name: data.name.trim().slice(0, 80),
    patch: {
      rules: { ...rules, lockSources: sources.locked, lockMediums: mediums.locked, campaignRegex: regex },
      sources: sources.values,
      mediums: mediums.values,
      labels: { ...sources.labels, ...mediums.labels },
      domains,
      campaignFormula: patternToFormula(typeof campaign.pattern === 'string' ? campaign.pattern : ''),
      extraParams: defaultParams,
    },
    ignored,
    unknown,
    warnings,
  };
}

// Human-readable list of what importing would change.
export function diffRules(ws, patch) {
  const changes = [];
  const r0 = { ...DEFAULT_RULES, ...(ws.rules || {}) };
  for (const [k, label] of [['lowercase', 'Lowercase'], ['spaceReplacement', 'Space replacement'], ['stripSpecial', 'Strip special characters'], ['nonLatin', 'Non-Latin text'], ['lockSources', 'Lock sources'], ['lockMediums', 'Lock mediums'], ['campaignRegex', 'Campaign regex']]) {
    if (JSON.stringify(r0[k]) !== JSON.stringify(patch.rules[k])) changes.push(`${label}: ${JSON.stringify(r0[k])} → ${JSON.stringify(patch.rules[k])}`);
  }
  if (JSON.stringify(r0.required) !== JSON.stringify(patch.rules.required)) changes.push(`Required fields: ${patch.rules.required.join(', ')}`);
  for (const k of ['sources', 'mediums', 'domains']) {
    const a = new Set(ws[k] || []);
    const b = new Set(patch[k]);
    const add = [...b].filter(x => !a.has(x));
    const del = [...a].filter(x => !b.has(x));
    if (add.length || del.length) changes.push(`${k[0].toUpperCase() + k.slice(1)}: ${add.length ? '+' + add.join(', +') : ''}${add.length && del.length ? '; ' : ''}${del.length ? '−' + del.join(', −') : ''}`);
  }
  if ((ws.campaignFormula || '') !== patch.campaignFormula) changes.push(`Campaign formula: ${patch.campaignFormula || '(none)'}`);
  return changes;
}
