// Context menus: right-click a link (or the page) → open the side panel
// pre-filled with that URL.

const WELCOME_URL =
  'https://thegrowthfolks.com/tools/utm-builder/welcome?utm_source=chrome-extension&utm_medium=referral&utm_campaign=utm-builder&utm_content=welcome';

chrome.runtime.onInstalled.addListener(details => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'tag-link', title: 'Build UTM link for this link', contexts: ['link'] });
    chrome.contextMenus.create({ id: 'tag-page', title: 'Build UTM link for this page', contexts: ['page'] });
  });
  // First install only (not updates): open the getting-started page.
  // tabs.create needs no "tabs" permission.
  if (details?.reason === 'install') chrome.tabs.create({ url: WELCOME_URL }).catch(() => {});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const url = info.menuItemId === 'tag-link' ? info.linkUrl : info.pageUrl || tab?.url;
  const title = info.menuItemId === 'tag-link' ? info.selectionText || '' : tab?.title || '';
  // sidePanel.open must run synchronously inside the user gesture.
  chrome.sidePanel.open({ windowId: tab.windowId }).catch(() => {});
  chrome.storage.session.set({ pending: { url, title, at: Date.now() } });
});
