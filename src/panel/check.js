// Check tab: the UTM Checker for the open page, an email draft or pasted text.

import { checkLinks, extractLinks, fixHtml, looksLikeHtml } from '../lib/checker.js';
import { LINK_CHECK_ORIGINS } from '../lib/net.js';

// Email editors we can read on demand (SPEC M8). Host → label and platform note.
export const EDITORS = [
  { re: /^mail\.google\.com$/, name: 'Gmail', note: '' },
  { re: /^outlook\.(office|office365|live)\.com$/, name: 'Outlook on the web', note: 'Outlook may wrap links with Safe Links after sending. That doesn’t change your UTMs, but send yourself a test to be sure.' },
  { re: /^app(-[a-z0-9]+)?\.hubspot\.com$/, name: 'HubSpot', note: 'HubSpot can add its own tracking and UTMs (for example utm_campaign=hs_email) when it sends. Check its UTM settings and send a test email.' },
  { re: /\.mailchimp\.com$/, name: 'Mailchimp', note: 'If Google Analytics tracking is on in Mailchimp’s Settings & Tracking, it adds its own UTMs at send time. Send a test and check a received link.' },
  { re: /^www\.klaviyo\.com$/, name: 'Klaviyo', note: 'Klaviyo always adds utm_source and utm_medium. Accounts set up before June 2025 may still use utm_medium=campaign or flow, which GA4 puts in Unassigned.' },
];

const LEVEL_LABEL = { critical: '✕ Critical', warning: '! Warning', pass: '✓ Pass', unverifiable: '? Unverifiable' };
const ORDER = { critical: 0, warning: 1, unverifiable: 2, pass: 3 };

export function editorFor(url) {
  try {
    const host = new URL(url).hostname;
    return EDITORS.find(e => e.re.test(host)) || null;
  } catch {
    return null;
  }
}

// Runs inside the page (each frame). Returns the links in editable regions
// (email drafts) or, when wholePage is set, every link on the page.
function collectLinks(wholePage, editorFrames) {
  const out = [];
  const add = root => {
    for (const a of root.querySelectorAll('a[href]')) out.push({ href: a.href || a.getAttribute('href'), text: (a.innerText || a.textContent || '').trim().slice(0, 100) });
  };
  if (wholePage) {
    if (window === window.top) add(document);
    return out;
  }
  const editable = [...document.querySelectorAll('[contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]')].filter(
    el => !el.parentElement?.closest('[contenteditable="true"], [contenteditable=""], [contenteditable="plaintext-only"]')
  );
  if (document.designMode === 'on' || document.body?.isContentEditable) add(document.body);
  else if (editable.length) editable.forEach(add);
  else if (editorFrames && window !== window.top && document.body) add(document.body); // editor canvases live in iframes
  return out;
}

// Runs inside the page: scroll to and outline one link.
function locateLink(href) {
  const a = [...document.querySelectorAll('a[href]')].find(x => x.href === href || x.getAttribute('href') === href);
  if (!a) return false;
  a.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const prev = a.style.outline;
  a.style.outline = '3px solid #1f6b4f'; // brand --brand; page styles can't read our tokens
  a.style.outlineOffset = '2px';
  setTimeout(() => {
    a.style.outline = prev;
  }, 2500);
  return true;
}

export function initCheck(ctx) {
  const { $ } = ctx;
  let mode = 'page';
  let last = null; // { results, summary, tabId, source, html }

  document.querySelectorAll('[data-csrc]').forEach(b =>
    b.addEventListener('click', () => {
      mode = b.dataset.csrc;
      document.querySelectorAll('[data-csrc]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
      document.querySelectorAll('[data-cpanel]').forEach(p => (p.hidden = p.dataset.cpanel !== mode));
      if (mode === 'email') detectEditor();
    })
  );

  async function activeTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  async function detectEditor() {
    const tab = await activeTab();
    const ed = tab?.url ? editorFor(tab.url) : null;
    $('k-editor').textContent = ed
      ? `${ed.name} is open in this tab.`
      : tab?.url
        ? 'This tab isn’t a supported email editor. Open a draft in Gmail, Outlook on the web, HubSpot, Mailchimp or Klaviyo.'
        : 'Open a draft in Gmail, Outlook on the web, HubSpot, Mailchimp or Klaviyo, then click the extension icon on that tab.';
    $('k-espNote').hidden = !ed?.note;
    $('k-espNote').textContent = ed?.note || '';
    return { tab, ed };
  }

  async function runPage() {
    $('k-page').disabled = true;
    try {
      const tab = await activeTab();
      if (!tab || (tab.url && !/^https?:/.test(tab.url))) throw new Error('not a web page');
      const frames = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: collectLinks, args: [true, false] });
      show(checkLinks(frames.flatMap(f => f.result || []), ctx.ws()), { tabId: tab.id, source: 'page' });
    } catch {
      summaryMessage('Can’t read this tab. Click the extension icon while on the page, or turn on live link checks in Settings to check from the side panel.');
    } finally {
      $('k-page').disabled = false;
    }
  }

  async function runEmail() {
    $('k-email').disabled = true;
    try {
      const tab = await activeTab();
      const ed = tab?.url ? editorFor(tab.url) : null;
      if (tab?.url && !ed) return summaryMessage('This tab isn’t a supported email editor. Use Paste to check any other email.');
      if (tab?.url) {
        const origin = `${new URL(tab.url).origin}/*`;
        if (!(await chrome.permissions.contains({ origins: [origin] }))) {
          const ok = await chrome.permissions.request({ origins: [origin] });
          if (!ok) return summaryMessage('Permission not given. You can still copy the email’s HTML and use Paste.');
        }
      }
      const frames = await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, func: collectLinks, args: [false, true] });
      const links = frames.flatMap(f => f.result || []);
      if (!links.length) return summaryMessage('No links found in an open draft. Click into the draft body and try again, or paste the email’s HTML.');
      show(checkLinks(links, ctx.ws()), { tabId: tab.id, source: 'email', editor: ed?.name });
    } catch {
      summaryMessage('Can’t read this draft. Click the extension icon on the email tab first, or paste the email’s HTML instead.');
    } finally {
      $('k-email').disabled = false;
    }
  }

  function runPaste() {
    const text = $('k-paste').value;
    const links = extractLinks(text);
    if (!links.length) return summaryMessage('No http(s) links found.');
    show(checkLinks(links, ctx.ws()), { source: 'paste', html: looksLikeHtml(text) ? text : '' });
  }

  function summaryMessage(msg) {
    last = null;
    $('k-result').hidden = false;
    $('k-summary').textContent = msg;
    $('k-list').replaceChildren();
    $('k-menu').hidden = true;
  }

  function show(res, meta) {
    last = { ...res, ...meta };
    $('k-result').hidden = false;
    $('k-menu').hidden = false;
    $('k-copyHtml').hidden = !meta.html;
    const s = res.summary;
    const chips = [
      ['critical', `✕ ${s.critical} critical`],
      ['warning', `! ${ctx.plural(s.warning, 'warning')}`],
      ['pass', `✓ ${s.pass} pass`],
    ];
    if (s.unverifiable) chips.push(['unverifiable', `? ${s.unverifiable} unverifiable`]);
    const head = document.createElement('div');
    head.className = 'sumline';
    head.textContent = `${ctx.plural(s.total, 'link')}${meta.editor ? ` in your ${meta.editor} draft` : ''}${s.untagged ? ` · ${s.untagged} without UTMs` : ''}${s.skipped ? ` · ${s.skipped} skipped (mailto, tel, anchors)` : ''}${s.truncated ? ' · first 2,000 checked' : ''}`;
    $('k-summary').replaceChildren(head, ...chips.map(([lvl, t]) => Object.assign(document.createElement('span'), { className: `chip ${lvl}`, textContent: t })));
    render();
  }

  function render() {
    if (!last) return;
    const onlyProblems = $('k-problems').checked;
    const items = last.results
      .filter(r => !onlyProblems || r.level === 'critical' || r.level === 'warning')
      .sort((a, b) => ORDER[a.level] - ORDER[b.level]);
    $('k-list').replaceChildren(...items.map(card));
  }

  function card(r) {
    const li = document.createElement('li');
    li.className = r.level;
    const top = document.createElement('div');
    top.className = 'cardtop';
    top.append(Object.assign(document.createElement('span'), { className: `chip ${r.level}`, textContent: LEVEL_LABEL[r.level] }));
    if (r.text) top.append(Object.assign(document.createElement('span'), { className: 'ltext', textContent: `“${r.text}”` }));
    const url = Object.assign(document.createElement('div'), { className: 'u', textContent: r.original });
    li.append(top, url);
    if (r.tagged && r.channel) {
      li.append(Object.assign(document.createElement('div'), { className: 'why', textContent: `GA4: ${r.channel} · because ${r.why}` }));
    } else if (!r.tagged && r.level !== 'unverifiable') {
      li.append(Object.assign(document.createElement('div'), { className: 'why', textContent: 'No UTMs on this link.' }));
    }
    if (r.redirect) {
      li.append(Object.assign(document.createElement('div'), { className: `why redirect ${r.redirect.state}`, textContent: `Redirect check: ${r.redirect.message}` }));
    }
    if (r.issues.length) {
      const ul = document.createElement('ul');
      ul.append(...r.issues.map(i => Object.assign(document.createElement('li'), { className: i.level, textContent: i.message })));
      li.append(ul);
    }
    if (r.fixed) li.append(Object.assign(document.createElement('div'), { className: 'u fixed', textContent: `Fixed: ${r.fixed}` }));
    const acts = document.createElement('div');
    acts.className = 'acts';
    const btn = (text, fn) => Object.assign(document.createElement('button'), { textContent: text, className: 'small', onclick: fn });
    if (r.fixed) acts.append(btn('Copy fixed link', () => ctx.copy(r.fixed, 'Fixed link copied')));
    if (last.tabId && last.source === 'page') {
      acts.append(
        btn('Locate', async () => {
          try {
            const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: last.tabId }, func: locateLink, args: [r.original] });
            if (!result) ctx.toast('Couldn’t find that link on the page any more');
          } catch {
            ctx.toast('Can’t reach the page');
          }
        })
      );
    }
    if (r.tagged) acts.append(btn('Edit in Build', () => ctx.openInBuild(r.fixed || r.href)));
    if (acts.childElementCount) li.append(acts);
    return li;
  }

  async function checkRedirects() {
    $('k-menu').open = false;
    if (!last) return;
    if (!(await chrome.permissions.contains({ origins: LINK_CHECK_ORIGINS }))) {
      const ok = await chrome.permissions.request({ origins: LINK_CHECK_ORIGINS });
      if (!ok) return ctx.toast('Redirect checks need permission to request the linked sites');
    }
    const targets = last.results.filter(r => r.tagged);
    if (!targets.length) return ctx.toast('No tagged links to check');
    ctx.toast(`Checking ${ctx.plural(Math.min(targets.length, 25), 'link')}…`);
    const res = await chrome.runtime.sendMessage({ type: 'tgf-check-redirects', urls: targets.map(r => r.fixed || r.href) });
    if (res?.error) return ctx.toast(res.error);
    const byUrl = new Map(res.results.map(x => [x.url, x]));
    for (const r of targets) {
      const x = byUrl.get(r.fixed || r.href);
      if (!x) continue;
      r.redirect = x;
      if (x.lost?.length && !r.issues.some(i => i.code === 'redirect-drops')) {
        r.issues.push({ code: 'redirect-drops', level: 'critical', message: `The redirect drops ${x.lost.join(', ')}, so GA4 won’t see them. Link straight to ${x.finalUrl.split('?')[0]}.` });
        r.level = 'critical';
      } else if (x.state === 'error' && !x.lost?.length && !r.issues.some(i => i.code === 'broken')) {
        r.issues.push({ code: 'broken', level: 'critical', message: x.message });
        r.level = 'critical';
      }
    }
    render();
    if (res.truncated) ctx.toast('Checked the first 25 links');
  }

  $('k-page').onclick = runPage;
  $('k-email').onclick = runEmail;
  $('k-pasteGo').onclick = runPaste;
  $('k-problems').onchange = render;
  $('k-copyFixed').onclick = () => {
    $('k-menu').open = false;
    if (!last) return;
    const fixed = last.results.filter(r => r.fixed).map(r => r.fixed);
    if (!fixed.length) return ctx.toast('Nothing to fix');
    ctx.copy(fixed.join('\n'), `Copied ${ctx.plural(fixed.length, 'fixed link')}`);
  };
  $('k-copyHtml').onclick = () => {
    $('k-menu').open = false;
    if (!last?.html) return;
    const r = fixHtml(last.html, ctx.ws());
    ctx.copy(r.html, `Fixed HTML copied (${ctx.plural(r.changed, 'link')} changed)`);
  };
  $('k-csv').onclick = () => {
    $('k-menu').open = false;
    if (!last) return;
    const rows = [['Level', 'Link text', 'Original URL', 'GA4 channel', 'Why', 'Issues', 'Fixed URL']];
    for (const r of last.results) rows.push([r.level, r.text, r.original, r.channel, r.why, r.issues.map(i => i.message).join(' | '), r.fixed]);
    ctx.download(`utm-check-${new Date().toISOString().slice(0, 10)}.csv`, ctx.csv(rows), 'text/csv');
  };
  $('k-redirects').onclick = checkRedirects;

  return {
    runPage,
    setMode(m) {
      document.querySelector(`[data-csrc="${m}"]`)?.click();
    },
  };
}
