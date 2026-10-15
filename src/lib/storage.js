// Local-first persistence. Everything lives in chrome.storage.local; the
// half-typed draft lives in chrome.storage.session so closing the popup to
// copy a headline from the page never wipes the form.

import { DEFAULT_RULES } from './rules.js';

export const HISTORY_LIMIT = 5000;

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function defaultWorkspace(name = 'My workspace') {
  return {
    id: uid(),
    name,
    rules: { ...DEFAULT_RULES },
    sources: ['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'snapchat', 'youtube', 'bing', 'newsletter', 'twitter'],
    mediums: ['cpc', 'paid_social', 'display', 'email', 'social', 'referral', 'affiliate', 'sms', 'video'],
    domains: [],
    campaignFormula: '',
    presets: [],
    extraParams: [],
    shortener: { provider: 'none', token: '', domain: '' },
    labels: {}, // display names: { facebook: 'Meta – Facebook' }
    showGa4Fields: false,
    adobe: { enabled: false, param: 'cid', delimiter: ':' },
    qr: { fg: '#000000', bg: '#ffffff', dots: 'square', logo: '', caption: '' },
    webhook: { url: '', format: 'json' },
    lock: null, // { salt, hash } — admin PIN
  };
}

const area = () => chrome.storage.local;

export async function loadState() {
  const data = await area().get(['workspaces', 'activeWorkspaceId', 'settings']);
  let workspaces = data.workspaces;
  if (!Array.isArray(workspaces) || !workspaces.length) {
    workspaces = [defaultWorkspace()];
    await area().set({ workspaces, activeWorkspaceId: workspaces[0].id });
  }
  // Fill in fields added in later versions without touching saved values.
  workspaces = workspaces.map(w => ({ ...defaultWorkspace(), ...w, rules: { ...DEFAULT_RULES, ...(w.rules || {}) } }));
  const activeWorkspaceId = workspaces.some(w => w.id === data.activeWorkspaceId) ? data.activeWorkspaceId : workspaces[0].id;
  return {
    workspaces,
    activeWorkspaceId,
    settings: {
      stripTracking: true,
      linkCheck: false,
      theme: 'system',
      userName: '',
      showBuiltins: true,
      followTab: false,
      ...(data.settings || {}),
    },
  };
}

export async function saveWorkspaces(workspaces) {
  await area().set({ workspaces });
}

export async function updateWorkspace(id, patch) {
  const { workspaces } = await area().get('workspaces');
  const next = (workspaces || []).map(w => (w.id === id ? { ...w, ...patch } : w));
  await area().set({ workspaces: next });
  return next;
}

export async function setActiveWorkspace(id) {
  await area().set({ activeWorkspaceId: id });
}

export async function saveSettings(settings) {
  await area().set({ settings });
}

export async function getHistory() {
  const { history } = await area().get('history');
  return Array.isArray(history) ? history : [];
}

// Newest first; re-copying the same final URL just bumps it to the top.
export async function addHistory(entries) {
  const list = Array.isArray(entries) ? entries : [entries];
  const history = await getHistory();
  const urls = new Set(list.map(e => e.url));
  const next = list
    .map(e => ({ id: uid(), createdAt: Date.now(), ...e }))
    .concat(history.filter(h => !urls.has(h.url)))
    .slice(0, HISTORY_LIMIT);
  await area().set({ history: next });
  return next;
}

export async function updateHistory(url, patch) {
  const history = await getHistory();
  const next = history.map(h => (h.url === url ? { ...h, ...patch } : h));
  await area().set({ history: next });
}

export async function removeHistory(id) {
  const history = await getHistory();
  await area().set({ history: history.filter(h => h.id !== id) });
}

export async function clearHistory() {
  await area().set({ history: [] });
}

export async function getDraft() {
  const { draft } = await chrome.storage.session.get('draft');
  return draft || null;
}

export async function saveDraft(draft) {
  await chrome.storage.session.set({ draft });
}

export async function takePending() {
  const { pending } = await chrome.storage.session.get('pending');
  if (pending) await chrome.storage.session.remove('pending');
  return pending || null;
}

// Tags last used per site, so revisiting a page restores them.
export async function rememberHost(workspaceId, host, entry) {
  if (!host) return;
  const { memory = {} } = await area().get('memory');
  const ws = memory[workspaceId] || {};
  ws[host] = { ...entry, at: Date.now() };
  // Keep the 300 most recent hosts per workspace.
  const keys = Object.keys(ws).sort((a, b) => ws[b].at - ws[a].at);
  for (const k of keys.slice(300)) delete ws[k];
  memory[workspaceId] = ws;
  await area().set({ memory });
}

export async function recallHost(workspaceId, host) {
  const { memory = {} } = await area().get('memory');
  return memory[workspaceId]?.[host] || null;
}

export const ACTIVITY_LIMIT = 3000;

// Local activity log: who did what, per device. Exportable for audits.
export async function logActivity(type, detail = {}) {
  const { activity = [], settings = {} } = await area().get(['activity', 'settings']);
  activity.unshift({ id: uid(), at: Date.now(), type, user: settings.userName || '', ...detail });
  await area().set({ activity: activity.slice(0, ACTIVITY_LIMIT) });
}

export async function getActivity() {
  const { activity = [] } = await area().get('activity');
  return activity;
}
