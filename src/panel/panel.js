import { buildUrl, parseUtm, normalizeDestination } from '../lib/url.js';
import { analyze } from '../lib/ga4.js';
import { normalizeValue, validate, parseFormula, assembleFormula, DEFAULT_RULES } from '../lib/rules.js';
import { toTsv, toTsvRow, toCsv, toMarkdown, toHtmlLink } from '../lib/export.js';
import { buildMatrix, tagHtml, lines } from '../lib/bulk.js';
import { MACROS } from '../lib/macros.js';
import { shorten, checkLink } from '../lib/net.js';
import * as store from '../lib/storage.js';
import qrcode from '../vendor/qrcode.js';

const $ = id => document.getElementById(id);
const FIELDS = ['source', 'medium', 'campaign', 'term', 'content', 'id'];

let state; // { workspaces, activeWorkspaceId, settings }
let form = emptyForm();
let pageTitle = '';
let result = null;
let shortUrl = '';
let lastField = 'f-campaign';
let matrixRows = [];
let checkTimer = null;

function emptyForm() {
  return { url: '', source: '', medium: '', campaign: '', term: '', content: '', id: '', extras: [], formula: {} };
}

const ws = () => state.workspaces.find(w => w.id === state.activeWorkspaceId) || state.workspaces[0];
const rules = () => ({ ...DEFAULT_RULES, ...(ws().rules || {}) });

// ---------- init ----------

async function init() {
  const isPopup = chrome.extension.getViews({ type: 'popup' }).includes(window);
  if (!isPopup) document.body.classList.add('side');

  state = await store.loadState();
  renderWorkspaces();
  renderMacroPlatforms();
  bindEvents();

  const [draft, pending] = await Promise.all([store.getDraft(), store.takePending()]);
  if (draft && draft.workspaceId === state.activeWorkspaceId) form = { ...emptyForm(), ...draft.form };
  if (pending) applyIncomingUrl(pending.url, pending.title);
  else if (!form.url) await useCurrentTab();

  renderWorkspaceUi();
  fillInputs();
  render();

  chrome.storage.session.onChanged.addListener(async changes => {
    if (changes.pending?.newValue) {
      const p = await store.takePending();
      if (p) {
        applyIncomingUrl(p.url, p.title);
        fillInputs();
        render();
        persist();
      }
    }
  });
  chrome.storage.local.onChanged.addListener(async changes => {
    if (changes.workspaces || changes.settings) {
      state = await store.loadState();
      renderWorkspaces();
      renderWorkspaceUi();
      fillInputs();
      render();
    }
  });
}

async function useCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.url && /^https?:/.test(tab.url)) {
    applyIncomingUrl(tab.url, tab.title);
    return true;
  }
  return false;
}

// Destination from tab/context menu. If it's already tagged, load its UTMs
// into empty fields so you can edit an existing link.
function applyIncomingUrl(url, title = '') {
  form.url = url || '';
  pageTitle = title || '';
  const existing = parseUtm(url);
  for (const [k, v] of Object.entries(existing)) if (!form[k]) form[k] = v;
}

// ---------- events ----------

function bindEvents() {
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => showTab(b.dataset.tab)));
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
    renderWorkspaceUi();
    fillInputs();
    render();
    persist();
    renderHistory();
  };

  $('url').addEventListener('input', e => {
    form.url = e.target.value;
    onChange();
  });
  $('url').addEventListener('blur', () => {
    const u = normalizeDestination(form.url);
    if (u && u.href !== form.url) {
      const existing = parseUtm(form.url);
      for (const [k, v] of Object.entries(existing)) if (!form[k]) form[k] = v;
      fillInputs();
      onChange();
    }
  });
  $('useTab').onclick = async () => {
    if (!(await useCurrentTab())) toast('Click the extension icon on the tab to grant access to its URL');
    fillInputs();
    onChange();
  };

  for (const f of FIELDS) {
    const input = $('f-' + f);
    input.addEventListener('focus', () => (lastField = input.id));
    input.addEventListener('input', () => {
      form[f] = input.value;
      onChange();
    });
    input.addEventListener('blur', () => {
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
    const p = (ws().presets || []).find(x => x.id === e.target.value);
    if (p) {
      Object.assign(form, p.values);
      if (p.extras) form.extras = p.extras.map(x => [...x]);
      fillInputs();
      onChange();
      toast(`Applied "${p.name}"`);
    }
    e.target.value = '';
  };
  $('savePreset').onclick = savePreset;

  $('addExtra').onclick = () => {
    form.extras.push(['', '']);
    renderExtras();
    persist();
  };
  $('macroPlatform').onchange = renderMacroChips;

  $('copyUrl').onclick = () => copy('url');
  $('copyQuery').onclick = () => copy('query');
  $('copyRow').onclick = () => copy('row');
  $('copyMd').onclick = () => copy('md');
  $('copyHtml').onclick = () => copy('html');
  $('shorten').onclick = doShorten;
  $('qrBtn').onclick = () => {
    $('qr').hidden = !$('qr').hidden;
    drawQr();
  };
  $('qrShort').onchange = drawQr;
  $('qrPng').onclick = downloadPng;
  $('qrSvg').onclick = downloadSvg;
  $('checkBtn').onclick = () => runCheck(true);
  $('reset').onclick = () => {
    const url = form.url;
    form = { ...emptyForm(), url };
    shortUrl = '';
    fillInputs();
    onChange();
  };

  $('b-go').onclick = runMatrix;
  $('b-copy').onclick = async () => {
    await writeClipboard(toTsv(matrixRows.map(withMeta)));
    toast(`Copied ${matrixRows.length} rows — paste into Sheets`);
  };
  $('b-csv').onclick = () => download(`utm-links-${today()}.csv`, toCsv(matrixRows.map(withMeta)), 'text/csv');
  $('b-save').onclick = async () => {
    await store.addHistory(matrixRows.map(withMeta));
    toast(`Saved ${matrixRows.length} links to history`);
    renderHistory();
  };
  $('h-go').onclick = runHtmlTagger;
  $('h-copy').onclick = async () => {
    await writeClipboard($('h-in').value);
    toast('Tagged HTML copied');
  };

  $('hSearch').oninput = renderHistory;
  $('hAllWs').onchange = renderHistory;
  $('hCopy').onclick = async () => {
    const items = await filteredHistory();
    await writeClipboard(toTsv(items));
    toast(`Copied ${items.length} rows`);
  };
  $('hCsv').onclick = async () => download(`utm-history-${today()}.csv`, toCsv(await filteredHistory()), 'text/csv');
  $('hClear').onclick = async () => {
    if ($('hClear').dataset.confirm !== '1') {
      $('hClear').dataset.confirm = '1';
      $('hClear').textContent = 'Click again to clear all';
      setTimeout(() => {
        $('hClear').dataset.confirm = '';
        $('hClear').textContent = 'Clear';
      }, 3000);
      return;
    }
    await store.clearHistory();
    $('hClear').dataset.confirm = '';
    $('hClear').textContent = 'Clear';
    renderHistory();
  };
}

function onChange() {
  shortUrl = '';
  $('short').textContent = '';
  render();
  persist();
}

function persist() {
  store.saveDraft({ workspaceId: state.activeWorkspaceId, form });
}

function showTab(name) {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === name)));
  for (const t of ['build', 'bulk', 'history']) $('tab-' + t).hidden = t !== name;
  if (name === 'history') renderHistory();
}

// ---------- workspace-driven UI ----------

function renderWorkspaces() {
  const sel = $('workspace');
  sel.replaceChildren(...state.workspaces.map(w => new Option(w.name, w.id, false, w.id === state.activeWorkspaceId)));
}

function renderWorkspaceUi() {
  const w = ws();
  const r = rules();
  for (const f of ['source', 'medium']) {
    const list = w[f + 's'] || [];
    $('dl-' + f).replaceChildren(...list.map(v => new Option(v, v)));
    const locked = r[f === 'source' ? 'lockSources' : 'lockMediums'] && list.length;
    $('s-' + f).hidden = !locked;
    $('f-' + f).hidden = !!locked;
    if (locked) {
      $('s-' + f).replaceChildren(new Option(`Select ${f}…`, ''), ...list.map(v => new Option(v, v)));
    }
  }
  for (const f of FIELDS) {
    const req = (r.required || []).includes(f);
    const label = document.querySelector(`[data-f="${f}"] .req`);
    if (label) label.hidden = !req;
  }
  $('preset').replaceChildren(new Option('Apply preset…', ''), ...(w.presets || []).map(p => new Option(p.name, p.id)));
  $('preset').hidden = !(w.presets || []).length;

  if (!form.extras.length && (w.extraParams || []).length) {
    form.extras = w.extraParams.map(p => [p.key, p.value || '']);
  }
  renderFormula();
  renderExtras();
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
    const val = Object.assign(document.createElement('input'), { value: v, placeholder: 'value', spellcheck: false });
    const del = Object.assign(document.createElement('button'), { textContent: '×', className: 'ghost small', title: 'Remove' });
    key.oninput = () => {
      form.extras[i][0] = key.value.trim();
      onChange();
    };
    val.oninput = () => {
      form.extras[i][1] = val.value;
      onChange();
    };
    val.id = `extra-${i}`;
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
    ...m.items.map(([token, label]) => {
      const b = Object.assign(document.createElement('button'), { textContent: token, title: label });
      b.onmousedown = e => e.preventDefault(); // keep focus/caret in the field
      b.onclick = () => insertMacro(token);
      return b;
    })
  );
}

function insertMacro(token) {
  const el = $(lastField);
  if (!el || el.readOnly) return toast('Click into a field first');
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, start) + token + el.value.slice(end);
  el.dispatchEvent(new Event('input'));
  el.focus();
  el.setSelectionRange(start + token.length, start + token.length);
}

function fillInputs() {
  $('url').value = form.url;
  for (const f of FIELDS) $('f-' + f).value = form[f] || '';
  for (const f of ['source', 'medium']) if (!$('s-' + f).hidden) $('s-' + f).value = form[f] || '';
  renderFormula();
  renderExtras();
}

// ---------- build ----------

function currentValues() {
  const r = rules();
  const v = {};
  for (const f of FIELDS) v[f] = normalizeValue(form[f], r);
  if (ws().campaignFormula) {
    v.campaign = assembleFormula(ws().campaignFormula, form.formula, r);
    $('f-campaign').value = v.campaign;
  }
  return v;
}

function render() {
  const v = currentValues();
  const w = ws();

  // GA4 prediction
  const a = analyze(v);
  const box = $('ga4');
  box.className = `ga4 ${a.level}`;
  const icon = { ok: '🟢', warn: '🟡', error: '🔴', idle: '' }[a.level];
  $('ga4Pill').textContent = a.channel ? `${icon} GA4 channel: ${a.channel}` : 'GA4 channel: enter source & medium';
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

  // Governance
  const issues = validate(v, w, form.url);
  document.querySelectorAll('.field[data-f]').forEach(el => el.classList.remove('error', 'warn'));
  for (const i of issues) document.querySelector(`.field[data-f="${i.field}"]`)?.classList.add(i.level);
  $('issues').replaceChildren(...issues.map(i => Object.assign(document.createElement('li'), { className: i.level, textContent: i.message })));

  // URL
  const extras = form.extras.filter(([k]) => k).map(([k, val]) => [k, normalizeValue(val, { ...rules(), lowercase: false })]);
  result = form.url ? buildUrl(form.url, v, { stripTracking: state.settings.stripTracking, extra: extras }) : null;
  const blocked = !result?.ok || issues.some(i => i.level === 'error');
  $('out').value = result?.ok ? result.url : '';
  $('removed').textContent = result?.removed?.length ? `Removed: ${result.removed.join(', ')}` : '';
  $('urlStatus').textContent = form.url && !result?.ok ? result?.error || '' : '';
  $('urlStatus').className = 'hint err';
  for (const id of ['copyUrl', 'copyQuery', 'copyRow', 'copyMd', 'copyHtml', 'shorten', 'qrBtn', 'checkBtn']) $(id).disabled = blocked;
  $('copyQuery').disabled = !result?.ok || !result.query;
  if (!$('qr').hidden) drawQr();

  if (state.settings.linkCheck && result?.ok) {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(() => runCheck(false), 1000);
  }
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
    title: pageTitle,
  };
}

function withMeta(row) {
  return { createdAt: Date.now(), workspaceId: ws().id, workspace: ws().name, ...row };
}

async function copy(kind) {
  if (!result?.ok) return;
  const rec = linkRecord();
  const link = shortUrl || result.url;
  const text = {
    url: result.url,
    query: result.query,
    row: toTsvRow({ ...rec, createdAt: Date.now() }),
    md: toMarkdown(link, pageTitle),
    html: toHtmlLink(link, pageTitle),
  }[kind];
  await writeClipboard(text);
  await store.addHistory(rec);
  toast({ url: 'URL copied', query: 'Parameters copied', row: 'Row copied — paste into Sheets', md: 'Markdown copied', html: 'HTML copied' }[kind]);
}

async function doShorten() {
  if (!result?.ok) return;
  $('shorten').disabled = true;
  $('short').className = 'hint';
  $('short').textContent = 'Shortening…';
  try {
    shortUrl = await shorten(result.url, ws().shortener);
    $('short').className = 'hint ok';
    $('short').textContent = `Short link: ${shortUrl} (copied)`;
    await writeClipboard(shortUrl);
    await store.addHistory(linkRecord());
    if (!$('qr').hidden) drawQr();
  } catch (e) {
    $('short').className = 'hint err';
    $('short').textContent = e.message;
  } finally {
    $('shorten').disabled = false;
  }
}

async function runCheck(manual) {
  if (!result?.ok) return;
  const target = result.url;
  $('urlStatus').className = 'hint';
  $('urlStatus').textContent = 'Checking…';
  const r = await checkLink(target);
  if (result?.url !== target) return; // stale
  $('urlStatus').className = `hint ${{ ok: 'ok', redirect: 'warn', error: 'err', unknown: '' }[r.state]}`;
  $('urlStatus').textContent = `${{ ok: '✓', redirect: '↪', error: '✗', unknown: '•' }[r.state]} ${r.message}`;
  if (manual && r.state === 'unknown') toast('Enable live link checks in Settings to see 404s and redirects');
}

// ---------- QR ----------

function makeQr() {
  const text = $('qrShort').checked && shortUrl ? shortUrl : result?.url;
  if (!text) return null;
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr;
}

function drawQr() {
  const qr = makeQr();
  const canvas = $('qrCanvas');
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!qr) return;
  const n = qr.getModuleCount();
  const margin = 4;
  const cell = Math.floor(canvas.width / (n + margin * 2));
  const offset = Math.floor((canvas.width - cell * n) / 2);
  ctx.fillStyle = '#000';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(offset + c * cell, offset + r * cell, cell, cell);
}

function downloadPng() {
  const qr = makeQr();
  if (!qr) return;
  const n = qr.getModuleCount();
  const cell = Math.max(8, Math.ceil(1024 / (n + 8)));
  const c = document.createElement('canvas');
  c.width = c.height = cell * (n + 8);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = '#000';
  for (let r = 0; r < n; r++) for (let col = 0; col < n; col++) if (qr.isDark(r, col)) ctx.fillRect((col + 4) * cell, (r + 4) * cell, cell, cell);
  c.toBlob(b => downloadBlob(`qr-${slug()}.png`, b));
}

function downloadSvg() {
  const qr = makeQr();
  if (qr) download(`qr-${slug()}.svg`, qr.createSvgTag({ cellSize: 8, margin: 32, scalable: true }), 'image/svg+xml');
}

// ---------- bulk ----------

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
  if (r.error) {
    $('b-count').textContent = r.error;
    return;
  }
  matrixRows = r.rows;
  const flagged = r.rows.filter(x => x.level === 'warn' || x.level === 'error').length;
  $('b-count').textContent =
    plural(r.rows.length, 'link') + (flagged ? ` · ⚠ ${flagged} misattributed in GA4 (see Note)` : '') + (r.errors.length ? ` · ${r.errors.length} invalid URLs skipped` : '');
  $('b-result').hidden = !r.rows.length;
  const head = ['Source', 'Medium', 'Campaign', 'Content', 'GA4 Channel', 'Note', 'URL'];
  const thead = document.createElement('tr');
  thead.append(...head.map(h => Object.assign(document.createElement('th'), { textContent: h })));
  const body = r.rows.slice(0, 500).map(x => {
    const tr = document.createElement('tr');
    if (x.level === 'warn' || x.level === 'error') tr.className = 'flag';
    tr.append(...[x.source, x.medium, x.campaign, x.content, x.channel, x.note, x.url].map(t => Object.assign(document.createElement('td'), { textContent: t })));
    return tr;
  });
  $('b-table').replaceChildren(thead, ...body);
}

function runHtmlTagger() {
  const v = currentValues();
  if (!v.source || !v.medium) return toast('Set source & medium in the Build tab first');
  const r = tagHtml($('h-in').value, v, { domains: ws().domains || [], stripTracking: state.settings.stripTracking });
  $('h-in').value = r.html;
  $('h-count').textContent = `Tagged ${plural(r.tagged, 'link')} · skipped ${r.skipped}`;
  $('h-copy').disabled = !r.tagged;
}

// ---------- history ----------

async function filteredHistory() {
  const q = $('hSearch').value.trim().toLowerCase();
  const all = $('hAllWs').checked;
  return (await store.getHistory()).filter(
    h =>
      (all || h.workspaceId === ws().id) &&
      (!q || [h.url, h.shortUrl, h.source, h.medium, h.campaign, h.content, h.term, h.title, h.channel].some(x => String(x || '').toLowerCase().includes(q)))
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
      const tags = [new Date(h.createdAt).toLocaleDateString(), h.source, h.medium, h.campaign, h.channel, $('hAllWs').checked ? h.workspace : ''].filter(Boolean);
      meta.append(...tags.map(t => Object.assign(document.createElement('span'), { className: 'tag', textContent: t })));
      const u = Object.assign(document.createElement('div'), { className: 'u', textContent: h.shortUrl ? `${h.shortUrl}  →  ${h.url}` : h.url });
      const acts = document.createElement('div');
      acts.className = 'acts';
      const btn = (label, fn) => Object.assign(document.createElement('button'), { textContent: label, onclick: fn });
      acts.append(
        btn('Copy', async () => {
          await writeClipboard(h.url);
          toast('Copied');
        })
      );
      if (h.shortUrl) acts.append(btn('Copy short', async () => {
        await writeClipboard(h.shortUrl);
        toast('Copied');
      }));
      acts.append(
        btn('Edit', () => {
          form = { ...emptyForm(), url: h.destination, source: h.source, medium: h.medium, campaign: h.campaign, term: h.term || '', content: h.content || '', id: h.utmId || '' };
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
  const input = Object.assign(document.createElement('input'), { placeholder: 'Preset name', value: currentValues().campaign || '' });
  const ok = Object.assign(document.createElement('button'), { textContent: 'Save', className: 'primary' });
  const row = btn.parentElement;
  const sel = $('preset');
  sel.hidden = true;
  btn.hidden = true;
  row.append(input, ok);
  input.focus();
  const done = async save => {
    if (save && input.value.trim()) {
      const v = currentValues();
      const values = { source: v.source, medium: v.medium, campaign: ws().campaignFormula ? '' : v.campaign, term: v.term, content: v.content, id: v.id };
      const presets = [...(ws().presets || []), { id: store.uid(), name: input.value.trim(), values, extras: form.extras.filter(([k]) => k) }];
      state.workspaces = await store.updateWorkspace(ws().id, { presets });
      toast('Preset saved');
    }
    input.remove();
    ok.remove();
    btn.hidden = false;
    delete btn.dataset.naming;
    renderWorkspaceUi();
  };
  ok.onclick = () => done(true);
  input.onkeydown = e => {
    if (e.key === 'Enter') done(true);
    if (e.key === 'Escape') done(false);
  };
}

// ---------- utils ----------

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
  toastTimer = setTimeout(() => (t.hidden = true), 1800);
}

init();
