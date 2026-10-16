// Service worker: right-click menus, first-install welcome page, and
// redirect checks for the Checker (run here so they keep going if the popup closes).

import { checkLink } from '../lib/net.js';

const WELCOME_URL =
  'https://thegrowthfolks.com/tools/utm-builder/welcome/?utm_source=chrome-extension&utm_medium=referral&utm_campaign=utm-builder&utm_content=welcome';

// Redirect-check limits (SPEC M9).
const MAX_URLS = 25;
const CONCURRENCY = 4;
const TIMEOUT_MS = 8000;

chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'tag-link', title: 'Build UTM link for this link', contexts: ['link'] });
    chrome.contextMenus.create({ id: 'tag-page', title: 'Build UTM link for this page', contexts: ['page'] });
    chrome.contextMenus.create({ id: 'check-page', title: 'Check UTM links on this page', contexts: ['page'] });
  });
  // First install only (not updates): open the getting-started page.
  // tabs.create needs no "tabs" permission.
  if (details?.reason === 'install') chrome.tabs.create({ url: WELCOME_URL }).catch(() => {});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const action = info.menuItemId === 'check-page' ? 'check-page' : 'build';
  const url = info.menuItemId === 'tag-link' ? info.linkUrl : info.pageUrl || tab?.url;
  const title = info.menuItemId === 'tag-link' ? info.selectionText || '' : tab?.title || '';
  // sidePanel.open must run synchronously inside the user gesture.
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
  chrome.storage.session.set({ pending: { action, url, title, tabId: tab?.id, at: Date.now() } });
});

async function checkRedirects(urls) {
  const list = [...new Set(urls)].slice(0, MAX_URLS);
  const results = new Array(list.length);
  let next = 0;
  async function worker() {
    while (next < list.length) {
      const i = next++;
      results[i] = { url: list[i], ...(await checkLink(list[i], { timeoutMs: TIMEOUT_MS })) };
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, list.length) }, worker));
  return { results, truncated: urls.length > MAX_URLS };
}

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg?.type !== 'tgf-check-redirects' || sender.id !== chrome.runtime.id) return false;
  checkRedirects(msg.urls || []).then(reply, e => reply({ error: e.message }));
  return true; // async reply
});
