// Audits: GA4 traffic export, messy link lists ("UTM Cleaner") and links
// scraped from a page or email (linter).

import { analyze, predictChannel } from './ga4.js';
import { buildUrl, normalizeDestination, parseUtm } from './url.js';
import { normalizeValue, validate, DEFAULT_RULES } from './rules.js';
import { parseCsv, mapHeaders } from './csv.js';

// GA4 "Traffic acquisition" (or Explore) CSV with a source/medium column, or
// separate source and medium columns, plus an optional sessions column.
export function auditGa4Export(text) {
  const rows = parseCsv(text);
  if (!rows.length) return { error: 'The file is empty', combos: [] };
  const headerIdx = rows.findIndex(r => {
    const m = mapHeaders(r);
    return m.sourceMedium != null || (m.source != null && m.medium != null);
  });
  if (headerIdx < 0) return { error: 'No "Session source / medium" or source and medium columns found', combos: [] };
  const map = mapHeaders(rows[headerIdx]);
  const byKey = new Map();
  for (const r of rows.slice(headerIdx + 1)) {
    let source;
    let medium;
    if (map.sourceMedium != null) {
      const sm = String(r[map.sourceMedium] || '');
      const i = sm.lastIndexOf(' / ');
      if (i < 0) continue;
      source = sm.slice(0, i).trim();
      medium = sm.slice(i + 3).trim();
    } else {
      source = String(r[map.source] || '').trim();
      medium = String(r[map.medium] || '').trim();
    }
    if (!source && !medium) continue;
    if (/^(grand )?total/i.test(source)) continue;
    const sessions = map.sessions != null ? Number(String(r[map.sessions]).replace(/[^\d.]/g, '')) || 0 : 0;
    const key = `${source}\u0000${medium}`;
    const cur = byKey.get(key) || { source, medium, sessions: 0 };
    cur.sessions += sessions;
    byKey.set(key, cur);
  }
  const combos = [...byKey.values()].map(c => {
    const a = analyze(c);
    const channel = predictChannel(c);
    const reserved = c.source.startsWith('(') || c.medium.startsWith('(');
    return { ...c, channel, level: reserved ? 'ok' : a.level, note: a.messages[0] || '', fixes: a.fixes };
  });
  combos.sort((a, b) => b.sessions - a.sessions);
  const total = combos.reduce((n, c) => n + c.sessions, 0);
  const lost = combos.filter(c => c.channel === 'Unassigned').reduce((n, c) => n + c.sessions, 0);
  const flagged = combos.filter(c => c.level !== 'ok');
  return { combos, total, unassignedSessions: lost, flagged: flagged.length };
}

// Values worth adding to a workspace's approved lists: combos GA4 classifies
// cleanly, skipping GA4's own placeholders like "(direct)" and "(none)".
export function cleanValuesFrom(combos, rules = DEFAULT_RULES) {
  const sources = new Set();
  const mediums = new Set();
  for (const c of combos) {
    if (c.level !== 'ok' || c.channel === 'Unassigned' || c.channel === 'Direct') continue;
    if (c.source.startsWith('(') || c.medium.startsWith('(')) continue;
    const s = normalizeValue(c.source, rules);
    const m = normalizeValue(c.medium, rules);
    if (s) sources.add(s);
    if (m) mediums.add(m);
  }
  return { sources: [...sources], mediums: [...mediums] };
}

// UTM Cleaner: normalise every tagged link in a list, dedupe, and report.
export function cleanLinks(text, { rules = DEFAULT_RULES, stripTracking = true } = {}) {
  const urls = String(text || '')
    .split(/\s+/)
    .map(s => s.trim().replace(/[),.;]+$/, ''))
    .filter(s => /^https?:\/\//i.test(s));
  const seen = new Set();
  const rows = [];
  for (const raw of urls) {
    const u = normalizeDestination(raw);
    if (!u) continue;
    const before = parseUtm(raw);
    const after = {};
    for (const [k, v] of Object.entries(before)) after[k] = normalizeValue(v, rules);
    const res = buildUrl(u, after, { stripTracking });
    if (!res.ok) continue;
    const duplicate = seen.has(res.url);
    seen.add(res.url);
    const changed = Object.keys(before).filter(k => before[k] !== after[k]);
    const a = analyze(after);
    rows.push({
      original: raw,
      url: res.url,
      ...after,
      changed,
      removed: res.removed.filter(k => !k.toLowerCase().startsWith('utm_')),
      duplicate,
      channel: a.channel || '',
      level: a.level,
      note: a.messages[0] || '',
    });
  }
  return {
    rows,
    changed: rows.filter(r => r.changed.length || r.removed.length).length,
    duplicates: rows.filter(r => r.duplicate).length,
    unique: rows.filter(r => !r.duplicate),
  };
}

// Linter for links found on a page or in an email: grades tagged links
// against GA4 and the workspace rules; untagged links are only counted.
export function lintLinks(links, workspace) {
  const rules = { ...DEFAULT_RULES, ...(workspace?.rules || {}) };
  const results = [];
  let untagged = 0;
  const seen = new Set();
  for (const l of links) {
    const href = typeof l === 'string' ? l : l.href;
    if (!href || seen.has(href)) continue;
    seen.add(href);
    const u = normalizeDestination(href);
    if (!u || !/^https?:/i.test(href)) continue;
    const utm = parseUtm(href);
    if (!Object.keys(utm).length) {
      untagged++;
      continue;
    }
    const problems = [];
    const a = analyze(utm);
    if (a.level !== 'ok') problems.push(...a.messages);
    for (const i of validate(utm, workspace, href)) if (i.field !== 'url') problems.push(i.message);
    for (const [k, v] of Object.entries(utm)) {
      const n = normalizeValue(v, rules);
      if (n !== v && !problems.some(p => p.includes(`utm_${k} breaks`))) problems.push(`utm_${k} "${v}" should be "${n}"`);
    }
    results.push({ href, text: typeof l === 'string' ? '' : (l.text || '').trim().slice(0, 80), utm, channel: a.channel || 'Unassigned', problems: [...new Set(problems)] });
  }
  return { results, tagged: results.length, untagged, withProblems: results.filter(r => r.problems.length).length };
}
