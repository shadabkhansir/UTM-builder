// CSV parsing and column mapping for imports: bulk link sheets, presets from
// other UTM tools, and GA4 traffic-acquisition exports.

export function parseCsv(text) {
  const src = String(text || '').replace(/^﻿/, '');
  const firstLine = src.split(/\r?\n/).find(l => l.trim() && !l.startsWith('#')) || '';
  const delim = ['\t', ';', ','].map(d => [d, firstLine.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"' && cell === '') quoted = true;
    else if (c === delim) {
      row.push(cell);
      cell = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += c;
  }
  if (cell !== '' || row.length) {
    row.push(cell);
    rows.push(row);
  }
  // GA4 exports start with "# ----" comment lines.
  return rows.filter(r => r.some(c => c.trim()) && !String(r[0]).startsWith('#'));
}

const ALIASES = {
  url: ['url', 'destination', 'destination url', 'landing page', 'landing page url', 'website url', 'link', 'long url', 'final url', 'base url'],
  source: ['source', 'utm_source', 'campaign source'],
  medium: ['medium', 'utm_medium', 'campaign medium'],
  campaign: ['campaign', 'utm_campaign', 'campaign name'],
  term: ['term', 'utm_term', 'campaign term', 'keyword'],
  content: ['content', 'utm_content', 'campaign content'],
  id: ['id', 'utm_id', 'campaign id'],
  source_platform: ['source_platform', 'utm_source_platform'],
  creative_format: ['creative_format', 'utm_creative_format'],
  marketing_tactic: ['marketing_tactic', 'utm_marketing_tactic'],
  name: ['name', 'preset', 'preset name', 'template', 'template name', 'title', 'label'],
  group: ['group', 'folder', 'category', 'client', 'theme'],
  sourceMedium: ['session source / medium', 'source / medium', 'first user source / medium', 'session source/medium'],
  sessions: ['sessions', 'users', 'total users', 'active users', 'event count'],
};

// "UTM Source", "utm_source" and "utm-source" all read as the same header.
function norm(h) {
  return String(h).trim().toLowerCase().replace(/[\s_-]+/g, ' ');
}

const NORMALIZED = Object.fromEntries(Object.entries(ALIASES).map(([k, names]) => [k, names.map(norm)]));

export function mapHeaders(headers) {
  const map = {};
  headers.forEach((h, i) => {
    const n = norm(h);
    for (const [key, names] of Object.entries(NORMALIZED)) if (map[key] == null && names.includes(n)) map[key] = i;
  });
  return map;
}

// rows → [{ url, source, medium, ... }] using header names; headerless sheets
// are read as url, source, medium, campaign, content, term.
export function rowsToObjects(rows) {
  if (!rows.length) return [];
  const map = mapHeaders(rows[0]);
  const hasHeader = Object.keys(map).length > 0;
  const fallback = { url: 0, source: 1, medium: 2, campaign: 3, content: 4, term: 5 };
  const m = hasHeader ? map : fallback;
  return (hasHeader ? rows.slice(1) : rows).map(r => {
    const o = {};
    for (const [k, i] of Object.entries(m)) o[k] = String(r[i] ?? '').trim();
    return o;
  });
}

// Accepts CSV text or JSON (array, or {presets|templates|items: [...]}) from
// other UTM tools and returns preset-like objects.
export function parsePresetImport(text) {
  const t = String(text || '').trim();
  let items = [];
  if (t.startsWith('[') || t.startsWith('{')) {
    const data = JSON.parse(t);
    const arr = Array.isArray(data) ? data : data.presets || data.templates || data.items || data.data || Object.values(data).find(Array.isArray) || [];
    items = arr.map(flattenPreset);
  } else {
    items = rowsToObjects(parseCsv(t));
  }
  return items
    .map((o, i) => ({
      name: o.name || [o.source, o.medium, o.campaign].filter(Boolean).join(' / ') || `Imported ${i + 1}`,
      group: o.group || '',
      values: pick(o, ['source', 'medium', 'campaign', 'term', 'content', 'id', 'source_platform', 'creative_format', 'marketing_tactic']),
    }))
    .filter(p => Object.values(p.values).some(Boolean));
}

function flattenPreset(o) {
  const flat = {};
  const visit = (obj, depth = 0) => {
    for (const [k, v] of Object.entries(obj || {})) {
      if (v && typeof v === 'object' && depth < 3) visit(v, depth + 1);
      else {
        const n = norm(k);
        for (const [key, names] of Object.entries(NORMALIZED)) if (flat[key] == null && names.includes(n)) flat[key] = String(v ?? '');
      }
    }
  };
  visit(o);
  return flat;
}

function pick(o, keys) {
  const out = {};
  for (const k of keys) if (o[k]) out[k] = o[k];
  return out;
}
