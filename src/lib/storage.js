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
    sources: ['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'bing', 'newsletter', 'twitter'],
    mediums: ['cpc', 'paid_social', 'display', 'email', 'social', 'referral', 'affiliate', 'sms', 'video'],
    domains: [],
    campaignFormula: '',
    presets: [],
    extraParams: [],
    shortener: { provider: 'none', token: '', domain: '' },
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
  const activeWorkspaceId = workspaces.some(w => w.id === data.activeWorkspaceId) ? data.activeWorkspaceId : workspaces[0].id;
  return {
    workspaces,
    activeWorkspaceId,
    settings: { stripTracking: true, autoCopy: false, linkCheck: false, ...(data.settings || {}) },
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
