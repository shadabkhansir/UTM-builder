// Bulk tools: cartesian link matrix and "tag every link in this email HTML".

import { buildUrl, normalizeDestination } from './url.js';
import { normalizeValue, DEFAULT_RULES } from './rules.js';
import { analyze } from './ga4.js';

export function lines(text) {
  return String(text || '')
    .split(/[\n,]+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export const MATRIX_LIMIT = 5000;

// dims: { urls: [], source: [], medium: [], campaign: [], content: [], term: [] }
export function buildMatrix(dims, { rules = DEFAULT_RULES, stripTracking = true } = {}) {
  const keys = ['source', 'medium', 'campaign', 'content', 'term'];
  const axes = [['url', dims.urls || []], ...keys.map(k => [k, (dims[k] || []).map(v => normalizeValue(v, rules))])]
    .filter(([, vals]) => vals.length);

  const total = axes.reduce((n, [, vals]) => n * vals.length, axes.length ? 1 : 0);
  if (total > MATRIX_LIMIT) return { error: `That's ${total} links — limit is ${MATRIX_LIMIT}.`, rows: [] };

  let combos = [{}];
  for (const [key, vals] of axes) {
    combos = combos.flatMap(c => vals.map(v => ({ ...c, [key]: v })));
  }

  const rows = [];
  const errors = [];
  for (const c of combos) {
    if (!c.url) continue;
    const res = buildUrl(c.url, c, { stripTracking });
    if (!res.ok) {
      errors.push(`${c.url}: ${res.error}`);
      continue;
    }
    const a = analyze(c);
    rows.push({
      destination: c.url,
      source: c.source || '',
      medium: c.medium || '',
      campaign: c.campaign || '',
      content: c.content || '',
      term: c.term || '',
      channel: a.channel || 'Unassigned',
      level: a.level,
      note: a.messages[0] || '',
      url: res.url,
    });
  }
  return { rows, errors: [...new Set(errors)] };
}

const SKIP_HREF = /^(mailto:|tel:|sms:|javascript:|#|data:)/i;
// ESP merge tags / personalisation that must not be touched.
const MERGE_TAG = /(\*\|[^|]*\|\*|%%[^%]+%%|\{\{[^}]*\}\}|\{%[^%]*%\}|\[\[[^\]]*\]\]|<%[^%]*%>)/;

// Append UTMs to every <a href> in an HTML string. domains: optional allowlist.
export function tagHtml(html, utm, { domains = [], stripTracking = true } = {}) {
  const allow = domains.map(d => d.toLowerCase().replace(/^www\./, '')).filter(Boolean);
  let tagged = 0;
  let skipped = 0;
  const out = String(html).replace(/(<a\b[^>]*?\bhref\s*=\s*)(["'])([\s\S]*?)\2/gi, (all, pre, q, rawHref) => {
    const href = rawHref.trim().replace(/&amp;/g, '&');
    if (!href || SKIP_HREF.test(href) || MERGE_TAG.test(href)) {
      skipped++;
      return all;
    }
    const u = normalizeDestination(href);
    if (!u || !/^https?:/i.test(href)) {
      skipped++;
      return all;
    }
    const host = u.hostname.toLowerCase().replace(/^www\./, '');
    if (allow.length && !allow.some(d => host === d || host.endsWith('.' + d))) {
      skipped++;
      return all;
    }
    const res = buildUrl(u, utm, { stripTracking });
    if (!res.ok) {
      skipped++;
      return all;
    }
    tagged++;
    const encoded = res.url.replace(/&/g, '&amp;').replace(new RegExp(q, 'g'), q === '"' ? '&quot;' : '&#39;');
    return `${pre}${q}${encoded}${q}`;
  });
  return { html: out, tagged, skipped };
}
