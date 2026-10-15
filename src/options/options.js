import * as store from '../lib/storage.js';
import { DEFAULT_RULES, FIELDS, assembleFormula, normalizeValue } from '../lib/rules.js';
import { predictChannel, sourceCategory } from '../lib/ga4.js';
import { SHORTENERS, shorten, LINK_CHECK_ORIGINS, webhookOrigin, sendWebhook } from '../lib/net.js';
import { lines } from '../lib/bulk.js';
import { parsePresetImport } from '../lib/csv.js';
import { encodeWorkspace, decodeWorkspace, makeLock, checkPin, decodeRequest, shareable } from '../lib/share.js';
import { drawQr } from '../lib/qrstyle.js';

const $ = id => document.getElementById(id);
let state;
let editingId;
let pendingRequest = null;
const unlocked = new Set(); // workspace ids unlocked with the PIN on this page

const cur = () => state.workspaces.find(w => w.id === editingId) || state.workspaces[0];
const isLocked = (w = cur()) => !!w.lock && !unlocked.has(w.id);

const APPS_SCRIPT = `// UTM Governor → Google Sheets
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('UTM links') || ss.insertSheet('UTM links');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Created', 'Workspace', 'Created by', 'Destination', 'Source', 'Medium',
      'Campaign', 'Content', 'Term', 'utm_id', 'GA4 channel', 'Tagged URL', 'Short URL']);
  }
  sheet.appendRow([d.createdAt, d.workspace, d.createdBy, d.destination, d.source, d.medium,
    d.campaign, d.content, d.term, d.utmId, d.channel, d.url, d.shortUrl]);
  return ContentService.createTextOutput('ok');
}`;

async function init() {
  state = await store.loadState();
  editingId = state.activeWorkspaceId;
  applyTheme();
  $('rRequired').replaceChildren(
    ...FIELDS.map(f => {
      const l = Object.assign(document.createElement('label'), { className: 'check' });
      const c = Object.assign(document.createElement('input'), { type: 'checkbox', value: f });
      c.onchange = save;
      l.append(c, ` utm_${f}`);
      return l;
    })
  );
  $('appsScript').value = APPS_SCRIPT;
  bind();
  render();
  renderLog();
}

function applyTheme() {
  const t = state.settings.theme;
  if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t;
  else delete document.documentElement.dataset.theme;
}

function valuesText(list, labels = {}) {
  return (list || []).map(v => (labels[v] ? `${v} = ${labels[v]}` : v)).join('\n');
}

// Full refresh: refills every input from storage. Only for switching,
// importing and locking — never after an ordinary save, or it would wipe
// whatever the user is typing in another field.
function render() {
  const w = cur();
  const r = { ...DEFAULT_RULES, ...w.rules };
  $('wsName').value = w.name;
  $('rLower').checked = r.lowercase;
  $('rSpace').value = r.spaceReplacement;
  $('rStrip').checked = r.stripSpecial;
  $('rNonLatin').value = r.nonLatin || 'allow';
  $('rRegex').value = r.campaignRegex || '';
  $('rLockSources').checked = r.lockSources;
  $('rLockMediums').checked = r.lockMediums;
  $('rRequired').querySelectorAll('input').forEach(c => (c.checked = (r.required || []).includes(c.value)));
  $('wsSources').value = valuesText(w.sources, w.labels);
  $('wsMediums').value = valuesText(w.mediums, w.labels);
  $('wsDomains').value = (w.domains || []).join('\n');
  $('wsGa4Fields').checked = !!w.showGa4Fields;
  $('wsFormula').value = w.campaignFormula || '';
  $('wsExtras').value = (w.extraParams || []).map(p => `${p.key}=${p.value}`).join('\n');
  $('shProvider').value = w.shortener?.provider || 'none';
  $('shToken').value = w.shortener?.token || '';
  $('shDomain').value = w.shortener?.domain || '';
  const q = w.qr || {};
  $('qFg').value = q.fg || '#000000';
  $('qBg').value = q.bg || '#ffffff';
  $('qDots').value = q.dots || 'square';
  $('qCaption').value = q.caption || '';
  $('whUrl').value = w.webhook?.url || '';
  $('whFormat').value = w.webhook?.format || 'json';
  $('adEnabled').checked = !!w.adobe?.enabled;
  $('adParam').value = w.adobe?.param || 'cid';
  $('adDelim').value = w.adobe?.delimiter ?? ':';
  $('sUser').value = state.settings.userName || '';
  $('sTheme').value = state.settings.theme || 'system';
  $('sBuiltins').checked = state.settings.showBuiltins !== false;
  $('sStrip').checked = state.settings.stripTracking;
  $('sLink').checked = state.settings.linkCheck;
  $('sFollow').checked = !!state.settings.followTab;
  renderDerived();
}

// Everything computed from saved state, safe to refresh after any save.
function renderDerived() {
  $('wsSelect').replaceChildren(...state.workspaces.map(w => new Option(w.name + (w.lock ? ' 🔒' : ''), w.id, false, w.id === editingId)));
  const w = cur();
  const locked = isLocked(w);
  document.querySelectorAll('.lockable').forEach(f => (f.disabled = locked));
  $('lockBanner').hidden = !locked;
  $('lockSet').hidden = !!w.lock;
  $('lockClear').hidden = !w.lock || locked;
  $('wsDel').disabled = state.workspaces.length < 2 || locked;
  const logo = w.qr?.logo;
  $('qLogoPreview').hidden = !logo;
  $('qLogoRemove').hidden = !logo;
  if (logo) $('qLogoPreview').src = logo;
  renderPresets();
  renderListCheck();
  renderFormulaPreview();
  renderRegexHint();
}

function renderPresets() {
  const w = cur();
  const locked = isLocked(w);
  const groups = new Map();
  for (const p of w.presets || []) {
    const g = p.group || '';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(p);
  }
  const items = [];
  for (const [g, presets] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    items.push(Object.assign(document.createElement('li'), { className: 'gh', textContent: g || 'No folder' }));
    for (const p of presets) {
      const li = document.createElement('li');
      const box = Object.assign(document.createElement('div'), { className: 'box' });
      box.append(
        Object.assign(document.createElement('strong'), { textContent: p.name }),
        Object.assign(document.createElement('span'), {
          className: 'vals',
          textContent: Object.entries(p.values).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' · '),
        })
      );
      const grp = Object.assign(document.createElement('input'), { className: 'grp', value: p.group || '', placeholder: 'Folder', disabled: locked });
      grp.setAttribute('aria-label', `Folder for ${p.name}`);
      grp.onchange = () => patch({ presets: w.presets.map(x => (x.id === p.id ? { ...x, group: grp.value.trim() } : x)) });
      const del = Object.assign(document.createElement('button'), { textContent: 'Delete', className: 'ghost small', disabled: locked });
      del.onclick = async () => {
        await patch({ presets: w.presets.filter(x => x.id !== p.id) });
        store.logActivity('preset_deleted', { workspaceId: w.id, workspace: w.name, name: p.name });
      };
      li.append(box, grp, del);
      items.push(li);
    }
  }
  $('presetList').replaceChildren(...items);
}

// Audit the approved lists against GA4's default channel rules.
function renderListCheck() {
  const w = cur();
  const issues = [];
  for (const s of w.sources || []) {
    if (!sourceCategory(s) && !['email', 'newsletter', 'sms', 'firebase'].includes(s)) {
      issues.push(`Source "${s}" isn't on GA4's search/social/video/shopping list — paid traffic from it reports as "Paid Other".`);
    }
  }
  for (const m of w.mediums || []) {
    const probes = ['facebook', 'google', 'partner-site', 'newsletter'].map(source => predictChannel({ source, medium: m }));
    if (probes.every(c => c === 'Unassigned')) issues.push(`Medium "${m}" lands in "Unassigned" in GA4 for every source.`);
  }
  $('listCheck').replaceChildren(...issues.map(t => Object.assign(document.createElement('li'), { className: 'warn', textContent: t })));
}

function renderFormulaPreview() {
  const f = $('wsFormula').value.trim();
  const sample = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? k : '') });
  const ctx = { page_title: 'Page Title', domain: 'acme.com', path: 'shop-boots', client: cur().name, user: state.settings.userName || 'you' };
  $('formulaPreview').textContent = f ? `Example: ${assembleFormula(f, sample, { ...DEFAULT_RULES, ...cur().rules }, new Date(), ctx)}` : '';
}

function renderRegexHint() {
  const v = $('rRegex').value.trim();
  if (!v) return ($('regexHint').textContent = '');
  try {
    new RegExp(v);
    $('regexHint').className = 'hint ok';
    $('regexHint').textContent = 'Valid pattern';
  } catch (e) {
    $('regexHint').className = 'hint err';
    $('regexHint').textContent = `Invalid pattern: ${e.message}`;
  }
}

async function patch(p) {
  state.workspaces = await store.updateWorkspace(cur().id, p);
  renderDerived();
}

function parseValues(text, rules) {
  const values = [];
  const labels = {};
  for (const line of String(text).split('\n')) {
    const [raw, ...rest] = line.split('=');
    const v = normalizeValue(raw.trim(), rules);
    if (!v || values.includes(v)) continue;
    values.push(v);
    const l = rest.join('=').trim();
    if (l) labels[v] = l;
  }
  return { values, labels };
}

// Saves run one at a time so two quick edits can't overwrite each other.
let saving = Promise.resolve();
function save() {
  saving = saving.then(doSave, doSave);
  return saving;
}

async function doSave() {
  const w = cur();
  const personal = {
    shortener: { provider: $('shProvider').value, token: $('shToken').value.trim(), domain: $('shDomain').value.trim() },
    qr: { ...w.qr, fg: $('qFg').value, bg: $('qBg').value, dots: $('qDots').value, caption: $('qCaption').value.trim() },
    webhook: { url: $('whUrl').value.trim(), format: $('whFormat').value },
  };
  if (isLocked(w)) {
    await patch(personal);
    return toast('Saved');
  }
  const rules = {
    ...DEFAULT_RULES,
    ...w.rules,
    lowercase: $('rLower').checked,
    spaceReplacement: $('rSpace').value,
    stripSpecial: $('rStrip').checked,
    nonLatin: $('rNonLatin').value,
    campaignRegex: $('rRegex').value.trim(),
    lockSources: $('rLockSources').checked,
    lockMediums: $('rLockMediums').checked,
    required: [...$('rRequired').querySelectorAll('input:checked')].map(c => c.value),
  };
  const s = parseValues($('wsSources').value, rules);
  const m = parseValues($('wsMediums').value, rules);
  const extraParams = $('wsExtras')
    .value.split('\n')
    .map(l => l.trim())
    .filter(l => l.includes('='))
    .map(l => ({ key: l.slice(0, l.indexOf('=')).trim(), value: l.slice(l.indexOf('=') + 1).trim() }));
  await patch({
    ...personal,
    name: $('wsName').value.trim() || 'Untitled',
    rules,
    sources: s.values,
    mediums: m.values,
    labels: { ...s.labels, ...m.labels },
    domains: lines($('wsDomains').value).map(d => d.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')),
    showGa4Fields: $('wsGa4Fields').checked,
    campaignFormula: $('wsFormula').value.trim(),
    extraParams,
    adobe: { enabled: $('adEnabled').checked, param: $('adParam').value.trim() || 'cid', delimiter: $('adDelim').value || ':' },
  });
  store.logActivity('workspace_saved', { workspaceId: w.id, workspace: $('wsName').value.trim() });
  toast('Saved');
}

async function saveSettings(patchObj) {
  state.settings = { ...state.settings, ...patchObj };
  await store.saveSettings(state.settings);
  applyTheme();
  toast('Saved');
}

function bind() {
  $('wsSelect').onchange = e => {
    editingId = e.target.value;
    render();
    renderLog();
  };
  $('wsAdd').onclick = async () => {
    const w = store.defaultWorkspace(`Client ${state.workspaces.length + 1}`);
    state.workspaces.push(w);
    await store.saveWorkspaces(state.workspaces);
    store.logActivity('workspace_created', { workspaceId: w.id, workspace: w.name });
    editingId = w.id;
    render();
    $('wsName').select();
  };
  $('wsDup').onclick = async () => {
    const w = { ...structuredClone(cur()), id: store.uid(), name: `${cur().name} copy`, lock: null };
    state.workspaces.push(w);
    await store.saveWorkspaces(state.workspaces);
    editingId = w.id;
    render();
  };
  confirmButton($('wsDel'), () => `Delete "${cur().name}"?`, async () => {
    if (state.workspaces.length < 2 || isLocked()) return;
    const gone = cur();
    state.workspaces = state.workspaces.filter(w => w.id !== editingId);
    await store.saveWorkspaces(state.workspaces);
    if (state.activeWorkspaceId === editingId) await store.setActiveWorkspace(state.workspaces[0].id);
    store.logActivity('workspace_deleted', { workspaceId: gone.id, workspace: gone.name });
    editingId = state.workspaces[0].id;
    render();
  });

  for (const id of ['wsName', 'wsSources', 'wsMediums', 'wsDomains', 'wsFormula', 'wsExtras', 'shToken', 'shDomain', 'rRegex', 'qCaption', 'whUrl', 'adParam', 'adDelim']) $(id).addEventListener('change', save);
  for (const id of ['rLower', 'rSpace', 'rStrip', 'rNonLatin', 'rLockSources', 'rLockMediums', 'shProvider', 'wsGa4Fields', 'qFg', 'qBg', 'qDots', 'whFormat', 'adEnabled']) $(id).addEventListener('change', save);
  $('wsFormula').addEventListener('input', renderFormulaPreview);
  $('rRegex').addEventListener('input', renderRegexHint);

  // Presets import
  $('pImportFile').onchange = async e => {
    const f = e.target.files[0];
    if (f) $('pImportText').value = await f.text();
  };
  $('pImportGo').onclick = importPresets;

  // Approval requests
  $('reqCheck').onclick = () => {
    try {
      pendingRequest = decodeRequest($('reqIn').value.trim().split(/\s+/).find(t => t.startsWith('UTMG-REQ1.')) || $('reqIn').value);
      const w = state.workspaces.find(x => x.id === pendingRequest.workspaceId);
      status('reqStatus', `${pendingRequest.by || 'Someone'} asks to add ${pendingRequest.field} “${pendingRequest.value}” to ${w ? w.name : pendingRequest.workspace + ' (not on this device)'}${pendingRequest.reason ? ` — “${pendingRequest.reason}”` : ''}. GA4: ${pendingRequest.field === 'medium' ? predictChannel({ source: 'facebook', medium: pendingRequest.value }) + ' with facebook' : predictChannel({ source: pendingRequest.value, medium: 'cpc' }) + ' with cpc'}.`, '');
      $('reqActions').hidden = !w;
    } catch (e) {
      status('reqStatus', e.message, 'err');
      $('reqActions').hidden = true;
    }
  };
  $('reqApprove').onclick = async () => {
    const req = pendingRequest;
    const w = state.workspaces.find(x => x.id === req?.workspaceId);
    if (!w) return;
    if (isLocked(w)) return status('reqStatus', 'Unlock this workspace first', 'err');
    const key = req.field === 'source' ? 'sources' : 'mediums';
    if (!(w[key] || []).includes(req.value)) {
      state.workspaces = await store.updateWorkspace(w.id, { [key]: [...(w[key] || []), req.value] });
    }
    store.logActivity('value_approved', { workspaceId: w.id, workspace: w.name, field: req.field, value: req.value, requestedBy: req.by });
    status('reqStatus', `Added “${req.value}”. Share the updated workspace code with your team.`, 'ok');
    $('reqActions').hidden = true;
    $('reqIn').value = '';
    render();
  };
  $('reqReject').onclick = () => {
    $('reqActions').hidden = true;
    $('reqIn').value = '';
    status('reqStatus', '', '');
  };

  // Shortener
  $('shGrant').onclick = async () => {
    const impl = SHORTENERS[$('shProvider').value];
    if (!impl) return status('shStatus', 'Pick a provider first', 'err');
    const ok = await chrome.permissions.request({ origins: impl.origins });
    status('shStatus', ok ? `Access to ${impl.label} allowed` : 'Permission not granted', ok ? 'ok' : 'err');
  };
  $('shTest').onclick = async () => {
    await save();
    status('shStatus', 'Testing…', '');
    try {
      const { link } = await shorten('https://example.com/?utm_source=test&utm_medium=test', cur().shortener);
      status('shStatus', `Works: ${link}`, 'ok');
    } catch (e) {
      status('shStatus', e.message, 'err');
    }
  };

  // QR logo
  $('qLogo').onchange = async e => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 300 * 1024) return status('qStatus', 'Use an image under 300 KB', 'err');
    const dataUrl = await new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    });
    await patch({ qr: { ...cur().qr, logo: dataUrl } });
    status('qStatus', 'Logo saved. QR codes with a logo use high error correction.', 'ok');
  };
  $('qLogoRemove').onclick = () => patch({ qr: { ...cur().qr, logo: '' } });

  // Webhook
  $('whGrant').onclick = async () => {
    const origin = webhookOrigin($('whUrl').value.trim());
    if (!origin) return status('whStatus', 'Enter an https:// URL first', 'err');
    const ok = await chrome.permissions.request({ origins: [origin] });
    if (ok) await save();
    status('whStatus', ok ? 'Webhook allowed' : 'Permission not granted', ok ? 'ok' : 'err');
  };
  $('whTest').onclick = async () => {
    await save();
    status('whStatus', 'Sending…', '');
    const r = await sendWebhook(cur().webhook, {
      createdAt: new Date().toISOString(), workspace: cur().name, createdBy: state.settings.userName || 'test',
      destination: 'https://example.com/', source: 'test', medium: 'test', campaign: 'webhook-test', content: '', term: '',
      utmId: '', channel: 'Unassigned', url: 'https://example.com/?utm_source=test&utm_medium=test&utm_campaign=webhook-test', shortUrl: '',
    });
    status('whStatus', r.ok ? 'Test sent — check the destination' : r.error, r.ok ? 'ok' : 'err');
  };
  $('copyScript').onclick = async () => {
    await navigator.clipboard.writeText(APPS_SCRIPT);
    toast('Script copied');
  };

  // Lock
  $('lockBtn').onclick = async () => {
    const pin = $('lockPin').value.trim();
    if (pin.length < 4) return toast('Use a PIN of at least 4 characters');
    await patch({ lock: await makeLock(pin) });
    unlocked.add(cur().id);
    $('lockPin').value = '';
    store.logActivity('workspace_locked', { workspaceId: cur().id, workspace: cur().name });
    renderDerived();
    toast('Workspace locked. Share its code so teammates get the locked version.');
  };
  $('unlockBtn').onclick = async () => {
    if (await checkPin(cur().lock, $('unlockPin').value)) {
      unlocked.add(cur().id);
      $('unlockPin').value = '';
      renderDerived();
      toast('Unlocked for this page');
    } else toast('Wrong PIN');
  };
  $('unlockPin').onkeydown = e => e.key === 'Enter' && $('unlockBtn').click();
  $('lockRemove').onclick = async () => {
    await patch({ lock: null });
    store.logActivity('workspace_unlocked', { workspaceId: cur().id, workspace: cur().name });
  };

  // Share codes
  $('codeMake').onclick = async () => {
    const code = await encodeWorkspace(cur());
    $('codeOut').value = code;
    $('codeOut').hidden = false;
    $('codeCopy').disabled = false;
    const qrOk = code.length <= 2000;
    $('codeQr').hidden = !qrOk;
    if (qrOk) await drawQr($('codeQr'), code, { fg: '#000000', bg: '#ffffff', dots: 'square' }, { size: 220, margin: 2 });
    else toast('Code is too long for a QR — copy it instead');
  };
  $('codeCopy').onclick = async () => {
    await navigator.clipboard.writeText($('codeOut').value);
    toast('Code copied');
  };
  $('codeImport').onclick = async () => {
    try {
      const raw = await decodeWorkspace($('codeIn').value);
      const { added, updated } = await mergeWorkspaces([raw]);
      status('codeStatus', added ? `Imported “${raw.name}”` : updated ? `Updated “${raw.name}”` : 'Nothing imported', 'ok');
      $('codeIn').value = '';
    } catch (e) {
      status('codeStatus', e.message, 'err');
    }
  };

  $('exWs').onclick = () => exportJson([cur()], `utm-workspace-${slug(cur().name)}.json`);
  $('exAll').onclick = () => exportJson(state.workspaces, `utm-workspaces-${new Date().toISOString().slice(0, 10)}.json`);
  $('imFile').onchange = importJson;

  // General
  $('sUser').onchange = () => saveSettings({ userName: $('sUser').value.trim() });
  $('sTheme').onchange = () => saveSettings({ theme: $('sTheme').value });
  $('sBuiltins').onchange = () => saveSettings({ showBuiltins: $('sBuiltins').checked });
  $('sStrip').onchange = () => saveSettings({ stripTracking: $('sStrip').checked });
  $('sLink').onchange = async () => {
    if ($('sLink').checked && !(await chrome.permissions.request({ origins: LINK_CHECK_ORIGINS }))) {
      $('sLink').checked = false;
      return toast('Permission not granted');
    }
    saveSettings({ linkCheck: $('sLink').checked });
  };
  $('sFollow').onchange = async () => {
    if ($('sFollow').checked && !(await chrome.permissions.request({ permissions: ['tabs'] }))) {
      $('sFollow').checked = false;
      return toast('Permission not granted');
    }
    saveSettings({ followTab: $('sFollow').checked });
  };

  $('logAll').onchange = renderLog;
  $('logCsv').onclick = async () => {
    const rows = await filteredLog();
    const csv = toCsvGeneric(['Time', 'User', 'Event', 'Workspace', 'Details'], rows.map(r => [new Date(r.at).toISOString(), r.user, r.type, r.workspace || '', details(r)]));
    downloadText(`utm-activity-${new Date().toISOString().slice(0, 10)}.csv`, csv, 'text/csv');
  };
  chrome.storage.local.onChanged.addListener(changes => changes.activity && renderLog());
}

async function importPresets() {
  const w = cur();
  if (isLocked(w)) return status('pImportStatus', 'Unlock this workspace first', 'err');
  let items;
  try {
    items = parsePresetImport($('pImportText').value);
  } catch (e) {
    return status('pImportStatus', `Couldn't read that: ${e.message}`, 'err');
  }
  if (!items.length) return status('pImportStatus', 'No presets found — check the columns', 'err');
  const rules = { ...DEFAULT_RULES, ...w.rules };
  const presets = items.map(p => ({
    id: store.uid(),
    name: p.name,
    group: p.group,
    values: Object.fromEntries(Object.entries(p.values).map(([k, v]) => [k, normalizeValue(v, rules)])),
  }));
  const p = { presets: [...(w.presets || []), ...presets] };
  let added = '';
  if ($('pImportLists').checked) {
    const s = [...new Set(presets.map(x => x.values.source).filter(Boolean))].filter(v => !(w.sources || []).includes(v));
    const m = [...new Set(presets.map(x => x.values.medium).filter(Boolean))].filter(v => !(w.mediums || []).includes(v));
    p.sources = [...(w.sources || []), ...s];
    p.mediums = [...(w.mediums || []), ...m];
    added = ` · added ${s.length} sources and ${m.length} mediums`;
  }
  await patch(p);
  render();
  store.logActivity('presets_imported', { workspaceId: w.id, workspace: w.name, count: presets.length });
  status('pImportStatus', `Imported ${presets.length} presets${added}`, 'ok');
  $('pImportText').value = '';
}

async function mergeWorkspaces(list) {
  let added = 0;
  let updated = 0;
  for (const raw of list) {
    const w = { ...store.defaultWorkspace(), ...raw, rules: { ...DEFAULT_RULES, ...raw.rules } };
    const i = state.workspaces.findIndex(x => x.id === w.id);
    if (i >= 0) {
      // Keep this device's API key, webhook and logo when a teammate's export updates a workspace.
      const mine = state.workspaces[i];
      w.shortener = { ...w.shortener, token: mine.shortener?.token || '' };
      w.webhook = { ...w.webhook, url: mine.webhook?.url || '' };
      w.qr = { ...w.qr, logo: w.qr?.logo || mine.qr?.logo || '' };
      state.workspaces[i] = w;
      updated++;
    } else {
      state.workspaces.push(w);
      added++;
    }
    store.logActivity('workspace_imported', { workspaceId: w.id, workspace: w.name });
  }
  await store.saveWorkspaces(state.workspaces);
  render();
  return { added, updated };
}

function exportJson(workspaces, name) {
  const blob = new Blob([JSON.stringify({ type: 'utm-governor', version: 2, workspaces: workspaces.map(shareable) }, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
}

async function importJson(e) {
  const file = e.target.files[0];
  e.target.value = '';
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.type !== 'utm-governor' || !Array.isArray(data.workspaces)) throw new Error('Not a UTM Governor export');
    const { added, updated } = await mergeWorkspaces(data.workspaces);
    status('imStatus', `Imported: ${added} new, ${updated} updated`, 'ok');
  } catch (err) {
    status('imStatus', err.message, 'err');
  }
}

// ---------- activity log ----------

async function filteredLog() {
  const all = $('logAll').checked;
  return (await store.getActivity()).filter(r => all || !r.workspaceId || r.workspaceId === cur().id);
}

function details(r) {
  const skip = new Set(['id', 'at', 'type', 'user', 'workspace', 'workspaceId']);
  return Object.entries(r)
    .filter(([k, v]) => !skip.has(k) && v !== '' && v != null)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
    .join(' · ');
}

async function renderLog() {
  const rows = (await filteredLog()).slice(0, 100);
  const head = document.createElement('tr');
  head.append(...['Time', 'User', 'Event', 'Workspace', 'Details'].map(h => Object.assign(document.createElement('th'), { textContent: h })));
  $('logTable').replaceChildren(
    head,
    ...rows.map(r => {
      const tr = document.createElement('tr');
      tr.append(...[new Date(r.at).toLocaleString(), r.user || '—', r.type.replace(/_/g, ' '), r.workspace || '', details(r)].map(t => Object.assign(document.createElement('td'), { textContent: t })));
      return tr;
    })
  );
}

function toCsvGeneric(header, rows) {
  // Same quoting and formula-injection guard as the link CSV export.
  const esc = v => {
    const s = String(v ?? '');
    const safe = /^[=+\-@]/.test(s) ? "'" + s : s;
    return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
  };
  return [header, ...rows].map(r => r.map(esc).join(',')).join('\r\n');
}

function downloadText(name, text, type) {
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([text], { type })), download: name });
  a.click();
}

// ---------- utils ----------

function confirmButton(button, prompt, action) {
  const original = button.textContent;
  button.onclick = async () => {
    if (button.dataset.confirm !== '1') {
      button.dataset.confirm = '1';
      button.textContent = prompt();
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

function status(id, msg, cls) {
  $(id).className = `hint ${cls}`;
  $(id).textContent = msg;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

let t;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').hidden = false;
  clearTimeout(t);
  t = setTimeout(() => ($('toast').hidden = true), 1800);
}

init();
