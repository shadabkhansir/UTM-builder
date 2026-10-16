import { buildUrl, parseUtm, normalizeDestination, hostOf } from '../lib/url.js';
import { analyze } from '../lib/ga4.js';
import { normalizeValue, validate, parseFormula, assembleFormula, resolveVariables, hasVariables, DEFAULT_RULES, FIELDS, GA4_EXTRA_FIELDS } from '../lib/rules.js';
import { toTsv, toTsvRow, toCsv, toMarkdown, toHtmlLink } from '../lib/export.js';
import { buildMatrix, tagHtml, lines } from '../lib/bulk.js';
import { parseCsv, rowsToObjects } from '../lib/csv.js';
import { auditGa4Export, cleanValuesFrom, cleanLinks, lintLinks } from '../lib/audit.js';
import { OUTPUTS, platformOutput, adobeCidUrl } from '../lib/platforms.js';
import { BUILTIN_TEMPLATES, BUILTIN_GROUP } from '../lib/templates.js';
import { MACROS } from '../lib/macros.js';
import { shorten, checkLink, landingCheck, fetchClicks, sendWebhook } from '../lib/net.js';
import { encodeRequest } from '../lib/share.js';
import { drawQr as renderQr, qrSvg, DEFAULT_QR } from '../lib/qrstyle.js';
import * as store from '../lib/storage.js';

const $ = id => document.getElementById(id);

let state; // { workspaces, activeWorkspaceId, settings }
let form = emptyForm();
let pageTitle = '';
let result = null;
let shortUrl = '';
let shortMeta = null;
let lastField = 'f-campaign';
let bulkRows = [];
let ga4Combos = [];
let checkTimer = null;
let lastPresetId = '';
let blocked = true; // a rule error or invalid URL: no copying, no QR

function emptyForm() {
  return {
    url: '', urlManual: false,
    source: '', medium: '', campaign: '', term: '', content: '', id: '',
    source_platform: '', creative_format: '', marketing_tactic: '',
    extras: [], formula: {}, qr: null,
  };
}

const ws = () => state.workspaces.find(w => w.id === state.activeWorkspaceId) || state.workspaces[0];
const rules = () => ({ ...DEFAULT_RULES, ...(ws().rules || {}) });
const qrStyle = () => ({ ...DEFAULT_QR, ...(ws().qr || {}), ...(form.qr || {}) });

// ---------- init ----------

async function init() {
  const isPopup = chrome.extension.getViews({ type: 'popup' }).includes(window);
  if (!isPopup) document.body.classList.add('side');

  state = await store.loadState();
  applyTheme();
  renderWorkspaces();
  renderMacroPlatforms();
  bindEvents();

  const [draft, pending] = await Promise.all([store.getDraft(), store.takePending()]);
  if (draft && draft.workspaceId === state.activeWorkspaceId) form = { ...emptyForm(), ...draft.form };
  if (pending) await applyIncomingUrl(pending.url, pending.title);
  else if (!form.url) await useCurrentTab();

  renderWorkspaceUi();
  fillInputs();
  render();
  setupFollowTab();

  chrome.storage.session.onChanged.addListener(async changes => {
    if (changes.pending?.newValue) {
      const p = await store.takePending();
      if (p) {
        await applyIncomingUrl(p.url, p.title);
        fillInputs();
        render();
        persist();
      }
    }
  });
  chrome.storage.local.onChanged.addListener(async changes => {
    if (changes.workspaces || changes.settings) {
      state = await store.loadState();
      applyTheme();
      renderWorkspaces();
      renderWorkspaceUi();
      fillInputs();
      render();
      if (changes.settings) setupFollowTab();
    }
  });
}

function applyTheme() {
  const t = state.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}

async function useCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url && /^https?:/.test(tab.url)) {
    await applyIncomingUrl(tab.url, tab.title);
    return true;
  }
  return false;
}

// Destination from tab/context menu. Already-tagged URLs load their UTMs;
// otherwise tags last used on this site are restored into empty fields.
async function applyIncomingUrl(url, title = '') {
  form.url = url || '';
  form.urlManual = false;
  pageTitle = title || '';
  const existing = parseUtm(url);
  for (const [k, v] of Object.entries(existing)) if (!form[k]) form[k] = v;
  $('memoryHint').replaceChildren();
  if (Object.keys(existing).length || form.source || form.medium) return;
  const host = hostOf(url);
  const mem = await store.recallHost(ws().id, host);
  if (!mem?.values) return;
  const before = { ...form };
  Object.assign(form, mem.values);
  const undo = Object.assign(document.createElement('button'), { textContent: 'Undo', className: 'linkish' });
  undo.onclick = () => {
    form = { ...before };
    $('memoryHint').replaceChildren();
    fillInputs();
    onChange();
  };
  $('memoryHint').append(`Restored the tags you last used on ${host}. `, undo);
}

let followListeners = null;
async function setupFollowTab() {
  if (followListeners) {
    chrome.tabs.onActivated.removeListener(followListeners.activated);
    chrome.tabs.onUpdated.removeListener(followListeners.updated);
    followListeners = null;
  }
  if (!state.settings.followTab || !document.body.classList.contains('side')) return;
  if (!(await chrome.permissions.contains({ permissions: ['tabs'] }))) return;
  const win = await chrome.windows.getCurrent();
  const follow = async tab => {
    if (!tab?.url || !/^https?:/.test(tab.url) || form.urlManual || tab.url === form.url) return;
    await applyIncomingUrl(tab.url, tab.title);
    fillInputs();
    onChange();
  };
  followListeners = {
    activated: async ({ tabId, windowId }) => windowId === win.id && follow(await chrome.tabs.get(tabId)),
    updated: (tabId, info, tab) => info.url && tab.active && tab.windowId === win.id && follow(tab),
  };
  chrome.tabs.onActivated.addListener(followListeners.activated);
  chrome.tabs.onUpdated.addListener(followListeners.updated);
}

// ---------- events ----------

function bindEvents() {
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
  document.querySelectorAll('.subtabs button').forEach(b => b.addEventListener('click', () => showSub(b.dataset.sub)));
  $('settings').onclick = () => chrome.runtime.openOptionsPage();
  $('dock').onclick = async () => {
    const win = await chrome.windows.getCurrent();
    await chrome.sidePanel.open({ windowId: win.id });
    window.close();
  };
  $('workspace').onchange = async e => {
    state.activeWorkspaceId = e.target.value;
    await store.setActiveWorkspace(state.activeWorkspaceId);
    form.formula = {};
    form.extras = [];
    renderWorkspaceUi();
    fillInputs();
    render();
    persist();
    renderHistory();
  };

  $('url').addEventListener('input', e => {
    form.url = e.target.value;
    form.urlManual = true;
    onChange();
  });
  $('url').addEventListener('blur', () => {
    const existing = parseUtm(form.url);
    if (Object.keys(existing).length) {
      for (const [k, v] of Object.entries(existing)) if (!form[k]) form[k] = v;
      fillInputs();
      onChange();
    }
  });
  $('useTab').onclick = async () => {
    if (!(await useCurrentTab())) toast('Click the extension icon on the tab to give access to its URL');
    fillInputs();
    onChange();
  };
  $('openUrl').onclick = () => result?.ok && chrome.tabs.create({ url: result.url });

  for (const f of FIELDS) {
    const input = $('f-' + f);
    input.addEventListener('focus', () => (lastField = input.id));
    input.addEventListener('input', () => {
      form[f] = input.value;
      onChange();
    });
    input.addEventListener('blur', () => {
      if (hasVariables(input.value)) return;
      const n = normalizeValue(input.value, rules());
      if (n !== input.value) {
        input.value = n;
        form[f] = n;
        onChange();
      }
    });
  }
  for (const f of ['source', 'medium']) {
    $('s-' + f).addEventListener('change', e => {
      form[f] = e.target.value;
      $('f-' + f).value = form[f];
      onChange();
    });
  }

  $('preset').onchange = e => {
    applyPreset(e.target.value);
    e.target.value = '';
  };
  $('savePreset').onclick = savePreset;

  $('requestBtn').onclick = () => ($('requestForm').hidden = !$('requestForm').hidden);
  $('reqCopy').onclick = async () => {
    const value = normalizeValue($('reqValue').value, rules());
    if (!value) return toast('Type the value you need');
    const code = encodeRequest({
      workspaceId: ws().id, workspace: ws().name, field: $('reqField').value, value,
      reason: $('reqReason').value.trim(), by: state.settings.userName || '', at: Date.now(),
    });
    await writeClipboard(`Please approve ${$('reqField').value} "${value}" for ${ws().name}. Paste this in UTM Governor → Settings → Approval requests:\n${code}`);
    await store.logActivity('value_requested', { workspaceId: ws().id, workspace: ws().name, field: $('reqField').value, value });
    toast('Request copied — send it to your admin');
  };

  $('addExtra').onclick = () => {
    form.extras.push(['', '']);
    renderExtras();
    persist();
  };
  $('macroPlatform').onchange = renderMacroChips;
  document.querySelectorAll('[data-var]').forEach(b => {
    b.onmousedown = e => e.preventDefault();
    b.onclick = () => insertToken(b.dataset.var);
  });

  $('copyUrl').onclick = () => copy('url');
  $('copyQuery').onclick = () => copy('query');
  $('copyRow').onclick = () => copy('row');
  $('copyMd').onclick = () => copy('md');
  $('copyHtml').onclick = () => copy('html');
  $('platform').onchange = renderPlatformHint;
  $('copyPlatform').onclick = () => copy('platform');
  $('shorten').onclick = doShorten;
  $('qrBtn').onclick = () => {
    $('qr').hidden = !$('qr').hidden;
    drawQr();
  };
  for (const id of ['qrFg', 'qrBg', 'qrDots', 'qrCaption', 'qrLogo']) {
    $(id).addEventListener('input', () => {
      form.qr = {
        fg: $('qrFg').value, bg: $('qrBg').value, dots: $('qrDots').value, caption: $('qrCaption').value,
        logo: $('qrLogo').checked ? ws().qr?.logo || '' : '',
      };
      persist();
      drawQr();
    });
  }
  $('qrShort').onchange = drawQr;
  $('qrPng').onclick = downloadPng;
  $('qrSvg').onclick = downloadSvg;
  $('checkBtn').onclick = () => runCheck(true);
  $('landingBtn').onclick = runLanding;
  $('reset').onclick = () => {
    const { url, urlManual } = form;
    form = { ...emptyForm(), url, urlManual };
    shortUrl = '';
    shortMeta = null;
    renderWorkspaceUi();
    fillInputs();
    onChange();
  };

  // Close the "Copy as" menu on outside click or Escape.
  document.addEventListener('click', e => {
    if ($('copyMenu').open && !$('copyMenu').contains(e.target)) $('copyMenu').open = false;
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') $('copyMenu').open = false;
  });
  document.addEventListener('keydown', e => {
    if ($('tab-build').hidden || !(e.ctrlKey || e.metaKey) || e.key !== 'Enter') return;
    e.preventDefault();
    copy(e.shiftKey ? 'query' : 'url');
  });

  // Bulk
  $('b-go').onclick = runMatrix;
  $('c-file').onchange = async e => {
    const f = e.target.files[0];
    if (f) $('c-in').value = await f.text();
    runCsv();
  };
  $('c-go').onclick = runCsv;
  $('h-go').onclick = runHtmlTagger;
  $('h-copy').onclick = async () => {
    await writeClipboard($('h-in').value);
    toast('Tagged HTML copied');
  };
  $('k-go').onclick = runCleaner;
  $('b-copy').onclick = async () => {
    await writeClipboard(toTsv(bulkRows.map(withMeta)));
    toast(`Copied ${plural(bulkRows.length, 'row')} — paste into Sheets`);
  };
  $('b-copyUrls').onclick = async () => {
    await writeClipboard(bulkRows.map(r => r.url).join('\n'));
    toast(`Copied ${plural(bulkRows.length, 'URL')}`);
  };
  $('b-csv').onclick = () => download(`utm-links-${today()}.csv`, toCsv(bulkRows.map(withMeta)), 'text/csv');
  $('b-save').onclick = async () => {
    await store.addHistory(bulkRows.map(withMeta));
    await store.logActivity('bulk_saved', { workspaceId: ws().id, workspace: ws().name, count: bulkRows.length });
    toast(`Saved ${plural(bulkRows.length, 'link')} to history`);
  };

  // Audit
  $('a-scan').onclick = scanPage;
  $('g-file').onchange = async e => {
    const f = e.target.files[0];
    if (f) runGa4Audit(await f.text());
    e.target.value = '';
  };
  $('g-adopt').onclick = adoptGa4Values;
  $('g-copy').onclick = async () => {
    const rows = [['Source', 'Medium', 'Sessions', 'GA4 channel', 'Note'], ...ga4Combos.map(c => [c.source, c.medium, c.sessions, c.channel, c.note])];
    await writeClipboard(rows.map(r => r.join('\t')).join('\n'));
    toast('Table copied');
  };

  // History
  $('hSearch').oninput = renderHistory;
  $('hAllWs').onchange = renderHistory;
  $('hCopy').onclick = async () => {
    const items = await filteredHistory();
    await writeClipboard(toTsv(items));
    toast(`Copied ${plural(items.length, 'row')}`);
  };
  $('hCsv').onclick = async () => download(`utm-history-${today()}.csv`, toCsv(await filteredHistory()), 'text/csv');
  confirmButton($('hClear'), 'Click again to clear all', async () => {
    await store.clearHistory();
    renderHistory();
  });
}

function onChange() {
  shortUrl = '';
  shortMeta = null;
  $('short').textContent = '';
  render();
  persist();
}

function persist() {
  store.saveDraft({ workspaceId: state.activeWorkspaceId, form });
}

function showTab(name) {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  for (const t of ['build', 'bulk', 'audit', 'history']) $('tab-' + t).hidden = t !== name;
  if (name === 'history') renderHistory();
}

function showSub(name) {
  document.querySelectorAll('.subtabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.sub === name)));
  document.querySelectorAll('[data-subpanel]').forEach(s => (s.hidden = s.dataset.subpanel !== name));
}

// ---------- workspace-driven UI ----------

function renderWorkspaces() {
  $('workspace').replaceChildren(...state.workspaces.map(w => new Option(w.name + (w.lock ? ' 🔒' : ''), w.id, false, w.id === state.activeWorkspaceId)));
}

function label(value) {
  const l = ws().labels?.[value];
  return l ? `${l} (${value})` : value;
}

function renderWorkspaceUi() {
  const w = ws();
  const r = rules();
  for (const f of ['source', 'medium']) {
    const list = w[f + 's'] || [];
    $('dl-' + f).replaceChildren(
      ...list.map(v => {
        const o = new Option(v, v);
        if (w.labels?.[v]) o.label = w.labels[v];
        return o;
      })
    );
    const locked = r[f === 'source' ? 'lockSources' : 'lockMediums'] && list.length;
    $('s-' + f).hidden = !locked;
    $('f-' + f).hidden = !!locked;
    if (locked) $('s-' + f).replaceChildren(new Option(`Select ${f}…`, ''), ...list.map(v => new Option(label(v), v)));
  }
  $('requestBox').hidden = !((r.lockSources && w.sources?.length) || (r.lockMediums && w.mediums?.length));
  for (const f of FIELDS) {
    const el = document.querySelector(`[data-f="${f}"] .req`);
    if (el) el.hidden = !(r.required || []).includes(f);
  }
  renderPresetSelect();
  if (!form.extras.length && (w.extraParams || []).length) form.extras = w.extraParams.map(p => [p.key, p.value || '']);
  renderPlatformOptions();
  renderFormula();
  renderExtras();
}

function renderPresetSelect() {
  const sel = $('preset');
  const groups = new Map();
  for (const p of ws().presets || []) {
    const g = p.group || 'Presets';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(p);
  }
  const nodes = [new Option('Apply preset or template…', '')];
  for (const [g, items] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const og = document.createElement('optgroup');
    og.label = g;
    og.append(...items.sort((a, b) => a.name.localeCompare(b.name)).map(p => new Option(p.name, p.id)));
    nodes.push(og);
  }
  if (state.settings.showBuiltins) {
    const og = document.createElement('optgroup');
    og.label = BUILTIN_GROUP;
    og.append(...BUILTIN_TEMPLATES.map(t => new Option(`${t.name} → ${t.channel}`, t.id)));
    nodes.push(og);
  }
  sel.replaceChildren(...nodes);
  sel.hidden = nodes.length === 1;
}

function applyPreset(id) {
  const p = (ws().presets || []).find(x => x.id === id) || BUILTIN_TEMPLATES.find(t => t.id === id);
  if (!p) return;
  const keep = { url: form.url, urlManual: form.urlManual, formula: form.formula, qr: form.qr, campaign: form.campaign };
  form = { ...emptyForm(), ...keep, ...Object.fromEntries(Object.entries(p.values).filter(([, v]) => v)) };
  if (p.extras) form.extras = p.extras.map(x => [...x]);
  else if ((ws().extraParams || []).length) form.extras = ws().extraParams.map(x => [x.key, x.value || '']);
  lastPresetId = p.id;
  if (GA4_EXTRA_FIELDS.some(f => form[f]) || form.id) $('more').open = true;
  fillInputs();
  onChange();
  toast(`Applied "${p.name}"`);
}

function renderFormula() {
  const formula = ws().campaignFormula;
  const box = $('formula');
  const input = $('f-campaign');
  if (!formula) {
    box.hidden = true;
    input.readOnly = false;
    return;
  }
  box.hidden = false;
  input.readOnly = true;
  input.title = `Assembled from: ${formula}`;
  const nodes = parseFormula(formula).map(p => {
    if (p.type === 'literal') return Object.assign(document.createElement('span'), { className: 'lit', textContent: p.text });
    if (p.type === 'date') return Object.assign(document.createElement('span'), { className: 'lit', textContent: `[${p.fmt}]` });
    if (p.type === 'var') return Object.assign(document.createElement('span'), { className: 'lit', textContent: `[${p.name}]` });
    let el;
    if (p.options.length) {
      el = document.createElement('select');
      el.append(new Option(p.name, ''), ...p.options.map(o => new Option(o, o)));
    } else {
      el = Object.assign(document.createElement('input'), { placeholder: p.name, spellcheck: false });
    }
    el.value = form.formula[p.name] || '';
    el.setAttribute('aria-label', p.name);
    el.addEventListener('input', () => {
      form.formula[p.name] = el.value;
      onChange();
    });
    return el;
  });
  box.replaceChildren(...nodes);
}

function renderExtras() {
  const rows = form.extras.map(([k, v], i) => {
    const row = document.createElement('div');
    row.className = 'extra';
    const key = Object.assign(document.createElement('input'), { value: k, placeholder: 'param', spellcheck: false });
    const val = Object.assign(document.createElement('input'), { value: v, placeholder: 'value', spellcheck: false, id: `extra-${i}` });
    const del = Object.assign(document.createElement('button'), { textContent: '×', className: 'ghost small', title: 'Remove' });
    key.setAttribute('aria-label', 'Parameter name');
    val.setAttribute('aria-label', 'Parameter value');
    key.oninput = () => {
      form.extras[i][0] = key.value.trim();
      onChange();
    };
    val.oninput = () => {
      form.extras[i][1] = val.value;
      onChange();
    };
    val.addEventListener('focus', () => (lastField = val.id));
    del.onclick = () => {
      form.extras.splice(i, 1);
      renderExtras();
      onChange();
    };
    row.append(key, val, del);
    return row;
  });
  $('extras').replaceChildren(...rows);
  if (rows.length) $('more').open = true;
}

function renderMacroPlatforms() {
  $('macroPlatform').replaceChildren(...Object.entries(MACROS).map(([k, m]) => new Option(m.label, k)));
  renderMacroChips();
}

function renderMacroChips() {
  const m = MACROS[$('macroPlatform').value];
  $('macroChips').replaceChildren(
    ...m.items.map(([token, title]) => {
      const b = Object.assign(document.createElement('button'), { textContent: token, title });
      b.onmousedown = e => e.preventDefault(); // keep focus/caret in the field
      b.onclick = () => insertToken(token);
      return b;
    })
  );
}

function insertToken(token) {
  const el = $(lastField);
  if (!el || el.readOnly) return toast('Click into a field first');
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, start) + token + el.value.slice(end);
  el.dispatchEvent(new Event('input'));
  el.focus();
  el.setSelectionRange(start + token.length, start + token.length);
}

function renderPlatformOptions() {
  const opts = Object.entries(OUTPUTS).map(([k, o]) => new Option(o.label, k));
  if (ws().adobe?.enabled) opts.push(new Option(`Adobe Analytics – ${ws().adobe.param || 'cid'} link`, 'adobe'));
  const prev = $('platform').value;
  $('platform').replaceChildren(new Option('Copy for ad platform…', ''), ...opts);
  if ([...$('platform').options].some(o => o.value === prev)) $('platform').value = prev;
}

function fillInputs() {
  $('url').value = form.url;
  for (const f of FIELDS) $('f-' + f).value = form[f] || '';
  for (const f of ['source', 'medium']) if (!$('s-' + f).hidden) $('s-' + f).value = form[f] || '';
  if (GA4_EXTRA_FIELDS.some(f => form[f]) || ws().showGa4Fields) $('more').open = true;
  const q = qrStyle();
  $('qrFg').value = q.fg;
  $('qrBg').value = q.bg;
  $('qrDots').value = q.dots;
  $('qrCaption').value = q.caption || '';
  $('qrLogo').checked = !!q.logo;
  $('qrLogo').disabled = !ws().qr?.logo;
  $('qrLogo').parentElement.title = ws().qr?.logo ? '' : 'Upload a logo in Settings → QR codes';
  renderFormula();
  renderExtras();
}

// ---------- build ----------

function varContext() {
  const u = normalizeDestination(form.url);
  return {
    page_title: pageTitle,
    domain: u ? u.hostname.replace(/^www\./, '') : '',
    path: u ? u.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, '-') : '',
    client: ws().name,
    user: state.settings.userName || '',
    now: new Date(),
  };
}

function currentValues() {
  const r = rules();
  const ctx = varContext();
  const v = {};
  for (const f of FIELDS) v[f] = normalizeValue(resolveVariables(form[f], ctx), r);
  if (ws().campaignFormula) {
    v.campaign = assembleFormula(ws().campaignFormula, form.formula, r, ctx.now, ctx);
    $('f-campaign').value = v.campaign;
  }
  return v;
}

function render() {
  const v = currentValues();
  const w = ws();

  const a = analyze(v);
  $('ga4').className = `ga4 ${a.level}`;
  // Status is always icon + word + colour, never colour alone.
  const status = { ok: '✓ Pass', warn: '! Warning', error: '✕ Critical', idle: '' }[a.level];
  $('ga4Pill').textContent = a.channel ? `${status} · GA4 channel: ${a.channel}` : 'GA4 channel: enter source & medium';
  $('ga4Msgs').replaceChildren(
    ...a.messages.map(m => Object.assign(document.createElement('li'), { textContent: m })),
    ...a.fixes.map(fx => {
      const li = document.createElement('li');
      const b = Object.assign(document.createElement('button'), { textContent: fx.label, className: 'small' });
      b.onclick = () => {
        form[fx.field] = fx.value;
        fillInputs();
        onChange();
      };
      li.append(b);
      return li;
    })
  );

  const issues = validate(v, w, form.url);
  document.querySelectorAll('.field[data-f]').forEach(el => el.classList.remove('error', 'warn'));
  for (const i of issues) document.querySelector(`.field[data-f="${i.field}"]`)?.classList.add(i.level);
  $('issues').replaceChildren(...issues.map(i => Object.assign(document.createElement('li'), { className: i.level, textContent: i.message })));

  const extras = form.extras.filter(([k]) => k).map(([k, val]) => [k, normalizeValue(resolveVariables(val, varContext()), { ...rules(), lowercase: false })]);
  result = form.url ? buildUrl(form.url, v, { stripTracking: state.settings.stripTracking, extra: extras }) : null;
  blocked = !result?.ok || issues.some(i => i.level === 'error');
  $('out').value = result?.ok ? result.url : '';
  $('removed').textContent = result?.removed?.length ? `Removed: ${result.removed.join(', ')}` : '';
  $('urlStatus').textContent = form.url && !result?.ok ? result?.error || '' : '';
  $('urlStatus').className = 'hint err';
  for (const id of ['copyUrl', 'copyRow', 'copyMd', 'copyHtml', 'copyPlatform', 'shorten', 'qrBtn', 'checkBtn', 'landingBtn', 'openUrl']) $(id).disabled = blocked;
  $('copyQuery').disabled = blocked || !result.query;
  renderPlatformHint();
  if (!$('qr').hidden) drawQr();

  if (state.settings.linkCheck && result?.ok) {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(() => runCheck(false), 1000);
  }
}

function platformText() {
  const kind = $('platform').value;
  if (!kind || !result?.ok) return null;
  if (kind === 'adobe') {
    const r = adobeCidUrl(form.url, currentValues(), { ...ws().adobe, stripTracking: state.settings.stripTracking });
    return r.ok ? { text: r.url, where: `Adobe Analytics tracking code ${ws().adobe.param || 'cid'}=${r.cid}`, warning: '' } : { text: '', where: '', warning: r.error };
  }
  return platformOutput(kind, result);
}

function renderPlatformHint() {
  const p = platformText();
  $('platformHint').className = `hint ${p?.warning ? 'warn' : ''}`;
  $('platformHint').textContent = p ? p.warning || `Paste into: ${p.where}` : '';
}

function linkRecord() {
  const { id: utmId, ...v } = currentValues(); // "id" is the history key, keep utm_id separate
  return {
    workspaceId: ws().id,
    workspace: ws().name,
    destination: normalizeDestination(form.url)?.href || form.url,
    ...v,
    utmId,
    channel: analyze(v).channel || '',
    url: result.url,
    shortUrl,
    shortMeta,
    title: pageTitle,
    createdBy: state.settings.userName || '',
  };
}

function withMeta(row) {
  return { createdAt: Date.now(), workspaceId: ws().id, workspace: ws().name, createdBy: state.settings.userName || '', ...row };
}

async function recordLink(kind) {
  const rec = linkRecord();
  await store.addHistory(rec);
  const host = hostOf(form.url);
  const remember = Object.fromEntries(FIELDS.map(f => [f, form[f]]).filter(([, val]) => val));
  store.rememberHost(ws().id, host, { values: remember, presetId: lastPresetId });
  store.logActivity('link_created', { workspaceId: ws().id, workspace: ws().name, url: rec.shortUrl || rec.url, kind, channel: rec.channel });
  if (ws().webhook?.url) {
    sendWebhook(ws().webhook, { ...rec, createdAt: new Date().toISOString() }).then(r => r.ok || toast(`Webhook: ${r.error}`));
  }
}

async function copy(kind) {
  if (!result?.ok || $('copyUrl').disabled) return;
  const link = shortUrl || result.url;
  let text;
  if (kind === 'platform') {
    const p = platformText();
    if (!p?.text) return toast(p?.warning || 'Pick an ad platform first');
    text = p.text;
  } else {
    text = {
      url: result.url,
      query: result.query,
      row: toTsvRow({ ...linkRecord(), createdAt: Date.now() }),
      md: toMarkdown(link, pageTitle),
      html: toHtmlLink(link, pageTitle),
    }[kind];
  }
  await writeClipboard(text);
  $('copyMenu').open = false;
  await recordLink(kind);
  toast({ url: 'URL copied', query: 'Parameters copied', row: 'Row copied — paste into Sheets', md: 'Markdown copied', html: 'HTML copied', platform: 'Copied for ' + $('platform').selectedOptions[0].text }[kind]);
}

async function doShorten() {
  if (!result?.ok) return;
  $('shorten').disabled = true;
  $('short').className = 'hint';
  $('short').textContent = 'Shortening…';
  try {
    const r = await shorten(result.url, ws().shortener, { slug: $('slug').value.trim() });
    shortUrl = r.link;
    shortMeta = r.meta;
    $('short').className = 'hint ok';
    $('short').textContent = `Short link: ${shortUrl} (copied)`;
    await writeClipboard(shortUrl);
    await recordLink('short');
    if (!$('qr').hidden) drawQr();
  } catch (e) {
    $('short').className = 'hint err';
    $('short').textContent = e.message;
  } finally {
    $('shorten').disabled = false;
  }
}

const STATE_CLASS = { ok: 'ok', redirect: 'warn', error: 'err', unknown: '' };
const STATE_ICON = { ok: '✓', redirect: '↪', error: '✗', unknown: '•' };

async function runCheck(manual) {
  if (!result?.ok) return;
  const target = result.url;
  $('urlStatus').className = 'hint';
  $('urlStatus').textContent = 'Checking…';
  const r = await checkLink(target);
  if (result?.url !== target) return; // stale
  $('urlStatus').className = `hint ${STATE_CLASS[r.state]}`;
  $('urlStatus').textContent = `${STATE_ICON[r.state]} ${r.message}`;
  if (manual && r.state === 'unknown') toast('Enable live link checks in Settings to see 404s and redirects');
}

async function runLanding() {
  if (!result?.ok) return;
  const target = result.url;
  $('landingBtn').disabled = true;
  $('urlStatus').className = 'hint';
  $('urlStatus').textContent = 'Opening the landing page in a background tab…';
  try {
    const r = await landingCheck(target);
    if (result?.url !== target) return;
    $('urlStatus').className = `hint ${STATE_CLASS[r.state]}`;
    $('urlStatus').textContent = `${STATE_ICON[r.state]} ${r.message}`;
  } finally {
    $('landingBtn').disabled = false;
  }
}

// ---------- QR ----------

function qrText() {
  return $('qrShort').checked && shortUrl ? shortUrl : result?.url;
}

async function drawQr() {
  const canvas = $('qrCanvas');
  await renderQr(canvas, blocked ? '' : qrText(), qrStyle(), { size: 480 });
  canvas.style.width = '240px';
}

async function downloadPng() {
  if (blocked) return;
  const c = document.createElement('canvas');
  await renderQr(c, qrText(), qrStyle(), { size: 1200 });
  c.toBlob(b => downloadBlob(`qr-${slug()}.png`, b));
}

function downloadSvg() {
  if (!blocked) download(`qr-${slug()}.svg`, qrSvg(qrText(), qrStyle()), 'image/svg+xml');
}

// ---------- bulk ----------

function renderBulk(rows, summary) {
  bulkRows = rows;
  $('b-result').hidden = !rows.length && !summary;
  $('b-count').textContent = summary;
  const head = ['Source', 'Medium', 'Campaign', 'Content', 'GA4 channel', 'Note', 'URL'];
  const thead = document.createElement('tr');
  thead.append(...head.map(h => Object.assign(document.createElement('th'), { textContent: h })));
  const body = rows.slice(0, 500).map(x => {
    const tr = document.createElement('tr');
    if (x.level === 'warn' || x.level === 'error') tr.className = 'flag';
    tr.append(...[x.source, x.medium, x.campaign, x.content, x.channel, x.note, x.url].map(t => Object.assign(document.createElement('td'), { textContent: t || '' })));
    return tr;
  });
  $('b-table').replaceChildren(thead, ...body);
  for (const id of ['b-copy', 'b-copyUrls', 'b-csv', 'b-save']) $(id).disabled = !rows.length;
}

function flaggedSummary(rows) {
  const flagged = rows.filter(x => x.level === 'warn' || x.level === 'error').length;
  return plural(rows.length, 'link') + (flagged ? ` · ⚠ ${flagged} misattributed in GA4 (see Note)` : '');
}

function runMatrix() {
  const dims = {
    urls: lines($('b-urls').value),
    source: lines($('b-source').value),
    medium: lines($('b-medium').value),
    campaign: lines($('b-campaign').value),
    content: lines($('b-content').value),
  };
  if (!dims.urls.length) return toast('Add at least one landing page');
  const r = buildMatrix(dims, { rules: rules(), stripTracking: state.settings.stripTracking });
  if (r.error) return renderBulk([], r.error);
  renderBulk(r.rows, flaggedSummary(r.rows) + (r.errors.length ? ` · ${r.errors.length} invalid URLs skipped` : ''));
}

function runCsv() {
  const objs = rowsToObjects(parseCsv($('c-in').value));
  if (!objs.length) return toast('Paste or upload a CSV first');
  const r = rules();
  const rows = [];
  let invalid = 0;
  for (const o of objs) {
    const v = {};
    for (const f of FIELDS) if (o[f]) v[f] = normalizeValue(o[f], r);
    const res = buildUrl(o.url, v, { stripTracking: state.settings.stripTracking });
    if (!res.ok) {
      invalid++;
      continue;
    }
    const a = analyze(v);
    const issues = validate(v, ws(), o.url).filter(i => i.level === 'error');
    rows.push({
      destination: o.url, ...v, channel: a.channel || 'Unassigned',
      level: issues.length ? 'error' : a.level, note: issues[0]?.message || a.messages[0] || '', url: res.url,
    });
  }
  renderBulk(rows, flaggedSummary(rows) + (invalid ? ` · ${invalid} rows without a valid URL skipped` : ''));
}

function runCleaner() {
  const r = cleanLinks($('k-in').value, { rules: rules(), stripTracking: state.settings.stripTracking });
  if (!r.rows.length) return toast('No http(s) links found');
  const rows = r.unique.map(x => ({
    destination: x.url.split('?')[0], source: x.source, medium: x.medium, campaign: x.campaign, content: x.content, term: x.term,
    channel: x.channel, level: x.level,
    note: [x.changed.length ? `fixed ${x.changed.map(c => 'utm_' + c).join(', ')}` : '', x.removed.length ? `removed ${x.removed.join(', ')}` : '', x.note].filter(Boolean).join(' · '),
    url: x.url,
  }));
  renderBulk(rows, `${plural(r.rows.length, 'link')} in · ${r.changed} fixed · ${r.duplicates} duplicates dropped → ${flaggedSummary(rows)}`);
}

function runHtmlTagger() {
  const v = currentValues();
  if (!v.source || !v.medium) return toast('Set source & medium in the Build tab first');
  const r = tagHtml($('h-in').value, v, { domains: ws().domains || [], stripTracking: state.settings.stripTracking });
  $('h-in').value = r.html;
  $('h-count').textContent = `Tagged ${plural(r.tagged, 'link')} · skipped ${r.skipped}`;
  $('h-copy').disabled = !r.tagged;
}

// ---------- audit ----------

async function scanPage() {
  $('a-scanCount').textContent = 'Scanning…';
  let links;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !/^https?:/.test(tab.url || 'https:')) throw new Error('not a web page');
    const [{ result: found }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => [...document.querySelectorAll('a[href]')].map(a => ({ href: a.href, text: a.innerText })),
    });
    links = found;
  } catch {
    $('a-scanCount').textContent = "Can't read this tab. Click the extension icon while on the page, or turn on live link checks in Settings.";
    return;
  }
  const r = lintLinks(links, ws());
  $('a-scanCount').textContent = `${plural(r.tagged, 'tagged link')} · ${r.withProblems} with problems · ${r.untagged} untagged`;
  $('a-scanList').replaceChildren(
    ...r.results
      .sort((a, b) => b.problems.length - a.problems.length)
      .map(x => {
        const li = document.createElement('li');
        li.className = x.problems.length ? 'bad' : 'good';
        const head = Object.assign(document.createElement('div'), { className: 'u', textContent: x.href });
        const meta = Object.assign(document.createElement('div'), { className: 'hint', textContent: `${x.text ? `"${x.text}" · ` : ''}${x.channel}` });
        const ul = document.createElement('ul');
        ul.append(...x.problems.map(p => Object.assign(document.createElement('li'), { textContent: p })));
        li.append(head, meta, ul);
        return li;
      })
  );
}

function runGa4Audit(text) {
  const r = auditGa4Export(text);
  if (r.error) {
    $('g-summary').className = 'hint err';
    $('g-summary').textContent = r.error;
    return;
  }
  ga4Combos = r.combos;
  const pct = r.total ? Math.round((r.unassignedSessions / r.total) * 100) : 0;
  $('g-summary').className = 'hint';
  $('g-summary').textContent = `${plural(r.combos.length, 'source / medium pair')} · ${r.flagged} need fixing · ${r.unassignedSessions.toLocaleString()} sessions (${pct}%) in Unassigned`;
  $('g-actions').hidden = false;
  $('g-wrap').hidden = false;
  const thead = document.createElement('tr');
  thead.append(...['Source / medium', 'Sessions', 'GA4 channel', 'Note'].map(h => Object.assign(document.createElement('th'), { textContent: h })));
  const rows = r.combos.slice(0, 500).map(c => {
    const tr = document.createElement('tr');
    if (c.level !== 'ok') tr.className = 'flag';
    tr.append(...[`${c.source} / ${c.medium}`, c.sessions.toLocaleString(), c.channel, c.note].map(t => Object.assign(document.createElement('td'), { textContent: t })));
    return tr;
  });
  $('g-table').replaceChildren(thead, ...rows);
}

async function adoptGa4Values() {
  const { sources, mediums } = cleanValuesFrom(ga4Combos, rules());
  const w = ws();
  const newS = sources.filter(s => !(w.sources || []).includes(s));
  const newM = mediums.filter(m => !(w.mediums || []).includes(m));
  if (!newS.length && !newM.length) return toast('Your approved lists already include every clean value');
  if (w.lock) {
    await writeClipboard(`Values to approve for ${w.name}:\nsources: ${newS.join(', ')}\nmediums: ${newM.join(', ')}`);
    return toast('Workspace is admin-locked — values copied to send to your admin');
  }
  state.workspaces = await store.updateWorkspace(w.id, { sources: [...(w.sources || []), ...newS], mediums: [...(w.mediums || []), ...newM] });
  await store.logActivity('values_adopted', { workspaceId: w.id, workspace: w.name, sources: newS, mediums: newM });
  toast(`Added ${plural(newS.length, 'source')} and ${plural(newM.length, 'medium')}`);
}

// ---------- history ----------

async function filteredHistory() {
  const q = $('hSearch').value.trim().toLowerCase();
  const all = $('hAllWs').checked;
  return (await store.getHistory()).filter(
    h =>
      (all || h.workspaceId === ws().id) &&
      (!q || [h.url, h.shortUrl, h.source, h.medium, h.campaign, h.content, h.term, h.title, h.channel, h.createdBy].some(x => String(x || '').toLowerCase().includes(q)))
  );
}

async function renderHistory() {
  const items = await filteredHistory();
  $('hCount').textContent = plural(items.length, 'link');
  $('hList').replaceChildren(
    ...items.slice(0, 200).map(h => {
      const li = document.createElement('li');
      const meta = document.createElement('div');
      meta.className = 'meta';
      const tags = [
        new Date(h.createdAt).toLocaleDateString(), h.source, h.medium, h.campaign, h.channel,
        h.createdBy ? `by ${h.createdBy}` : '', $('hAllWs').checked ? h.workspace : '',
        h.clicks != null ? `${h.clicks.toLocaleString()} clicks` : '',
      ].filter(Boolean);
      meta.append(...tags.map(t => Object.assign(document.createElement('span'), { className: 'tag', textContent: t })));
      const u = Object.assign(document.createElement('div'), { className: 'u', textContent: h.shortUrl ? `${h.shortUrl}  →  ${h.url}` : h.url });
      const acts = document.createElement('div');
      acts.className = 'acts';
      const btn = (text, fn) => Object.assign(document.createElement('button'), { textContent: text, onclick: fn });
      acts.append(btn('Copy', async () => {
        await writeClipboard(h.url);
        toast('Copied');
      }));
      if (h.shortUrl) {
        acts.append(btn('Copy short', async () => {
          await writeClipboard(h.shortUrl);
          toast('Copied');
        }));
      }
      if (h.shortMeta?.id) {
        acts.append(btn('Clicks', async () => {
          const owner = state.workspaces.find(w => w.id === h.workspaceId) || ws();
          try {
            const clicks = await fetchClicks(h.shortMeta, owner.shortener);
            await store.updateHistory(h.url, { clicks, clicksAt: Date.now() });
            renderHistory();
          } catch (e) {
            toast(e.message);
          }
        }));
      }
      acts.append(
        btn('Edit', () => {
          form = { ...emptyForm(), url: h.destination, urlManual: true, id: h.utmId || '' };
          for (const f of FIELDS) if (f !== 'id' && h[f]) form[f] = h[f];
          fillInputs();
          onChange();
          showTab('build');
        }),
        btn('Delete', async () => {
          await store.removeHistory(h.id);
          renderHistory();
        })
      );
      li.append(meta, u, acts);
      return li;
    })
  );
}

// ---------- presets ----------

function savePreset() {
  const btn = $('savePreset');
  if (btn.dataset.naming) return;
  btn.dataset.naming = '1';
  const groups = [...new Set((ws().presets || []).map(p => p.group).filter(Boolean))];
  const name = Object.assign(document.createElement('input'), { placeholder: 'Preset name', value: currentValues().campaign || '' });
  const group = Object.assign(document.createElement('input'), { placeholder: 'Folder (optional)' });
  group.setAttribute('list', 'dl-groups');
  const dl = Object.assign(document.createElement('datalist'), { id: 'dl-groups' });
  dl.append(...groups.map(g => new Option(g, g)));
  name.setAttribute('aria-label', 'Preset name');
  group.setAttribute('aria-label', 'Preset folder');
  const ok = Object.assign(document.createElement('button'), { textContent: 'Save', className: 'primary' });
  const row = btn.parentElement;
  $('preset').hidden = true;
  btn.hidden = true;
  row.append(name, group, dl, ok);
  name.focus();
  const done = async save => {
    if (save && name.value.trim()) {
      const values = {};
      for (const f of FIELDS) if (form[f]) values[f] = form[f];
      if (ws().campaignFormula) delete values.campaign;
      const presets = [...(ws().presets || []), { id: store.uid(), name: name.value.trim(), group: group.value.trim(), values, extras: form.extras.filter(([k]) => k) }];
      state.workspaces = await store.updateWorkspace(ws().id, { presets });
      await store.logActivity('preset_saved', { workspaceId: ws().id, workspace: ws().name, name: name.value.trim() });
      toast('Preset saved');
    }
    name.remove();
    group.remove();
    dl.remove();
    ok.remove();
    btn.hidden = false;
    delete btn.dataset.naming;
    renderWorkspaceUi();
  };
  ok.onclick = () => done(true);
  for (const el of [name, group]) {
    el.onkeydown = e => {
      if (e.key === 'Enter') done(true);
      if (e.key === 'Escape') done(false);
    };
  }
}

// ---------- utils ----------

function confirmButton(button, prompt, action) {
  const original = button.textContent;
  button.onclick = async () => {
    if (button.dataset.confirm !== '1') {
      button.dataset.confirm = '1';
      button.textContent = prompt;
      setTimeout(() => {
        button.dataset.confirm = '';
        button.textContent = original;
      }, 3000);
      return;
    }
    button.dataset.confirm = '';
    button.textContent = original;
    await action();
  };
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

function download(name, text, type) {
  downloadBlob(name, new Blob([text], { type }));
}

function downloadBlob(name, blob) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function slug() {
  return (currentValues().campaign || 'link').slice(0, 40);
}

function plural(n, word) {
  return `${n} ${word}${n === 1 ? '' : 's'}`;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

let toastTimer;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (t.hidden = true), 2200);
}

init();
