// Output formats: spreadsheet rows (TSV pastes across columns in Sheets/Excel),
// CSV downloads, Markdown and HTML links.

export const COLUMNS = [
  ['date', 'Date'],
  ['workspace', 'Workspace'],
  ['destination', 'Destination URL'],
  ['source', 'Source'],
  ['medium', 'Medium'],
  ['campaign', 'Campaign'],
  ['term', 'Term'],
  ['content', 'Content'],
  ['utmId', 'utm_id'],
  ['source_platform', 'utm_source_platform'],
  ['creative_format', 'utm_creative_format'],
  ['marketing_tactic', 'utm_marketing_tactic'],
  ['channel', 'GA4 Channel'],
  ['url', 'Tagged URL'],
  ['shortUrl', 'Short URL'],
  ['createdBy', 'Created by'],
];

function cell(v) {
  return String(v ?? '').replace(/[\t\r\n]+/g, ' ');
}

export function toTsvRow(link) {
  return COLUMNS.map(([k]) => cell(k === 'date' ? isoDate(link.createdAt) : link[k])).join('\t');
}

export function toTsv(links, { header = true } = {}) {
  const rows = links.map(toTsvRow);
  if (header) rows.unshift(COLUMNS.map(([, h]) => h).join('\t'));
  return rows.join('\n');
}

export function toCsv(links) {
  const esc = v => {
    const s = String(v ?? '');
    // Guard against spreadsheet formula injection from page titles etc.
    const safe = /^[=+\-@]/.test(s) && !/^-?\d/.test(s) ? "'" + s : s;
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  const rows = [COLUMNS.map(([, h]) => esc(h)).join(',')];
  for (const l of links) rows.push(COLUMNS.map(([k]) => esc(k === 'date' ? isoDate(l.createdAt) : l[k])).join(','));
  return rows.join('\r\n');
}

export function toMarkdown(url, text) {
  return `[${String(text || url).replace(/([[\]])/g, '\\$1')}](${url.replace(/\)/g, '%29')})`;
}

export function toHtmlLink(url, text) {
  return `<a href="${escapeAttr(url)}">${escapeHtml(text || url)}</a>`;
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

export function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function isoDate(ts) {
  const d = ts ? new Date(ts) : new Date();
  return d.toISOString().slice(0, 10);
}
