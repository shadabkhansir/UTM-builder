import * as store from '../lib/storage.js';
import { DEFAULT_RULES, FIELDS, assembleFormula, normalizeValue } from '../lib/rules.js';
import { predictChannel, sourceCategory } from '../lib/ga4.js';
import { SHORTENERS, shorten, LINK_CHECK_ORIGINS } from '../lib/net.js';
import { lines } from '../lib/bulk.js';

const $ = id => document.getElementById(id);
let state;
let editingId;

const cur = () => state.workspaces.find(w => w.id === editingId) || state.workspaces[0];

async function init() {
  state = await store.loadState();
  editingId = state.activeWorkspaceId;
  $('rRequired').replaceChildren(
    ...FIELDS.map(f => {
      const l = Object.assign(document.createElement('label'), { className: 'check' });
      const c = Object.assign(document.createElement('input'), { type: 'checkbox', value: f });
      c.onchange = save;
      l.append(c, ` utm_${f}`);
      return l;
    })
  );
  bind();
  render();
}

function render() {
  $('wsSelect').replaceChildren(...state.workspaces.map(w => new Option(w.name, w.id, false, w.id === editingId)));
  const w = cur();
  const r = { ...DEFAULT_RULES, ...w.rules };
  $('wsName').value = w.name;
  $('rLower').checked = r.lowercase;
  $('rSpace').value = r.spaceReplacement;
  $('rStrip').checked = r.stripSpecial;
  $('rLockSources').checked = r.lockSources;
  $('rLockMediums').checked = r.lockMediums;
  $('rRequired').querySelectorAll('input').forEach(c => (c.checked = (r.required || []).includes(c.value)));
  $('wsSources').value = (w.sources || []).join('\n');
  $('wsMediums').value = (w.mediums || []).join('\n');
  $('wsDomains').value = (w.domains || []).join('\n');
  $('wsFormula').value = w.campaignFormula || '';
  $('wsExtras').value = (w.extraParams || []).map(p => `${p.key}=${p.value}`).join('\n');
  $('shProvider').value = w.shortener?.provider || 'none';
  $('shToken').value = w.shortener?.token || '';
  $('shDomain').value = w.shortener?.domain || '';
  $('sStrip').checked = state.settings.stripTracking;
  $('sLink').checked = state.settings.linkCheck;
  $('wsDel').disabled = state.workspaces.length < 2;
  renderPresets();
  renderListCheck();
  renderFormulaPreview();
}

function renderPresets() {
  const w = cur();
  $('presetList').replaceChildren(
    ...(w.presets || []).map(p => {
      const li = document.createElement('li');
      const name = Object.assign(document.createElement('strong'), { textContent: p.name });
      const vals = Object.assign(document.createElement('span'), {
        className: 'vals',
        textContent: Object.entries(p.values).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(' · '),
      });
      const del = Object.assign(document.createElement('button'), { textContent: 'Delete', className: 'ghost small' });
      del.onclick = async () => {
        await patch({ presets: w.presets.filter(x => x.id !== p.id) });
      };
      const box = document.createElement('div');
      box.style.minWidth = '0';
      box.append(name, document.createElement('br'), vals);
      li.append(box, del);
      return li;
    })
  );
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
  $('formulaPreview').textContent = f
    ? `Example: ${assembleFormula(f, new Proxy({}, { get: (_, k) => (typeof k === 'string' ? k : '') }), { ...DEFAULT_RULES, ...cur().rules })}`
    : '';
}

async function patch(p) {
  state.workspaces = await store.updateWorkspace(cur().id, p);
  render();
}

async function save() {
  const w = cur();
  const rules = {
    ...DEFAULT_RULES,
    ...w.rules,
    lowercase: $('rLower').checked,
    spaceReplacement: $('rSpace').value,
    stripSpecial: $('rStrip').checked,
    lockSources: $('rLockSources').checked,
    lockMediums: $('rLockMediums').checked,
    required: [...$('rRequired').querySelectorAll('input:checked')].map(c => c.value),
  };
  const norm = v => normalizeValue(v, rules);
  const extraParams = $('wsExtras')
    .value.split('\n')
    .map(l => l.trim())
    .filter(l => l.includes('='))
    .map(l => ({ key: l.slice(0, l.indexOf('=')).trim(), value: l.slice(l.indexOf('=') + 1).trim() }));
  await patch({
    name: $('wsName').value.trim() || 'Untitled',
    rules,
    sources: [...new Set(lines($('wsSources').value).map(norm).filter(Boolean))],
    mediums: [...new Set(lines($('wsMediums').value).map(norm).filter(Boolean))],
    domains: lines($('wsDomains').value).map(d => d.toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '')),
    campaignFormula: $('wsFormula').value.trim(),
    extraParams,
    shortener: { provider: $('shProvider').value, token: $('shToken').value.trim(), domain: $('shDomain').value.trim() },
  });
  toast('Saved');
}

function bind() {
  $('wsSelect').onchange = e => {
    editingId = e.target.value;
    render();
  };
  $('wsAdd').onclick = async () => {
    const w = store.defaultWorkspace(`Client ${state.workspaces.length + 1}`);
    state.workspaces.push(w);
    await store.saveWorkspaces(state.workspaces);
    editingId = w.id;
    render();
    $('wsName').select();
  };
  $('wsDup').onclick = async () => {
    const w = { ...structuredClone(cur()), id: store.uid(), name: `${cur().name} copy` };
    state.workspaces.push(w);
    await store.saveWorkspaces(state.workspaces);
    editingId = w.id;
    render();
  };
  $('wsDel').onclick = async () => {
    if (state.workspaces.length < 2) return;
    if ($('wsDel').dataset.confirm !== '1') {
      $('wsDel').dataset.confirm = '1';
      $('wsDel').textContent = `Delete "${cur().name}"?`;
      setTimeout(() => {
        $('wsDel').dataset.confirm = '';
        $('wsDel').textContent = 'Delete';
      }, 3000);
      return;
    }
    state.workspaces = state.workspaces.filter(w => w.id !== editingId);
    await store.saveWorkspaces(state.workspaces);
    if (state.activeWorkspaceId === editingId) await store.setActiveWorkspace(state.workspaces[0].id);
    editingId = state.workspaces[0].id;
    $('wsDel').dataset.confirm = '';
    $('wsDel').textContent = 'Delete';
    render();
  };

  for (const id of ['wsName', 'wsSources', 'wsMediums', 'wsDomains', 'wsFormula', 'wsExtras', 'shToken', 'shDomain']) $(id).addEventListener('change', save);
  for (const id of ['rLower', 'rSpace', 'rStrip', 'rLockSources', 'rLockMediums', 'shProvider']) $(id).addEventListener('change', save);
  $('wsFormula').addEventListener('input', renderFormulaPreview);

  $('sStrip').onchange = async () => {
    state.settings.stripTracking = $('sStrip').checked;
    await store.saveSettings(state.settings);
    toast('Saved');
  };
  $('sLink').onchange = async () => {
    if ($('sLink').checked) {
      const ok = await chrome.permissions.request({ origins: LINK_CHECK_ORIGINS });
      if (!ok) {
        $('sLink').checked = false;
        return toast('Permission not granted');
      }
    }
    state.settings.linkCheck = $('sLink').checked;
    await store.saveSettings(state.settings);
    toast('Saved');
  };

  $('shGrant').onclick = async () => {
    const impl = SHORTENERS[$('shProvider').value];
    if (!impl) return status('Pick a provider first', 'err');
    const ok = await chrome.permissions.request({ origins: impl.origins });
    status(ok ? `Access to ${impl.label} allowed` : 'Permission not granted', ok ? 'ok' : 'err');
  };
  $('shTest').onclick = async () => {
    await save();
    status('Testing…', '');
    try {
      const link = await shorten('https://example.com/?utm_source=test&utm_medium=test', cur().shortener);
      status(`Works: ${link}`, 'ok');
    } catch (e) {
      status(e.message, 'err');
    }
  };

  $('exWs').onclick = () => exportJson([cur()], `utm-workspace-${slug(cur().name)}.json`);
  $('exAll').onclick = () => exportJson(state.workspaces, `utm-workspaces-${new Date().toISOString().slice(0, 10)}.json`);
  $('imFile').onchange = importJson;
}

function exportJson(workspaces, name) {
  const clean = workspaces.map(w => ({ ...w, shortener: { ...w.shortener, token: '' } }));
  const blob = new Blob([JSON.stringify({ type: 'utm-governor', version: 1, workspaces: clean }, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: name });
  a.click();
}

async function importJson(e) {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (data.type !== 'utm-governor' || !Array.isArray(data.workspaces)) throw new Error('Not a UTM Governor export');
    let added = 0;
    let updated = 0;
    for (const raw of data.workspaces) {
      const w = { ...store.defaultWorkspace(), ...raw, rules: { ...DEFAULT_RULES, ...raw.rules } };
      const i = state.workspaces.findIndex(x => x.id === w.id);
      if (i >= 0) {
        // Keep the local API key when a teammate's export updates a workspace.
        w.shortener = { ...w.shortener, token: state.workspaces[i].shortener?.token || '' };
        state.workspaces[i] = w;
        updated++;
      } else {
        state.workspaces.push(w);
        added++;
      }
    }
    await store.saveWorkspaces(state.workspaces);
    $('imStatus').className = 'hint ok';
    $('imStatus').textContent = `Imported: ${added} new, ${updated} updated`;
    render();
  } catch (err) {
    $('imStatus').className = 'hint err';
    $('imStatus').textContent = err.message;
  }
  e.target.value = '';
}

function status(msg, cls) {
  $('shStatus').className = `hint ${cls}`;
  $('shStatus').textContent = msg;
}

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

let t;
function toast(msg) {
  $('toast').textContent = msg;
  $('toast').hidden = false;
  clearTimeout(t);
  t = setTimeout(() => ($('toast').hidden = true), 1500);
}

init();
