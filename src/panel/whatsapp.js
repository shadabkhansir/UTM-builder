// WhatsApp tab: wa.me click-to-chat links with a tagged website link inside the message.

import { buildWhatsApp, COUNTRY_CODES, defaultCountry, LINK_TOKEN } from '../lib/whatsapp.js';
import { normalizeValue } from '../lib/rules.js';
import { drawQr, qrSvg, DEFAULT_QR } from '../lib/qrstyle.js';
import * as store from '../lib/storage.js';

const PRESETS = { chat: { source: 'whatsapp', medium: 'social' } };
const FIELDS = ['country', 'number', 'message', 'landing', 'preset', 'source', 'medium', 'campaign', 'content', 'ref'];

export function initWhatsApp(ctx) {
  const { $ } = ctx;
  let result = null;

  $('w-country').replaceChildren(...COUNTRY_CODES.map(([code, name]) => new Option(`+${code} ${name}`, code)));

  async function load() {
    const [{ waDraft }, { waPrefs }] = await Promise.all([chrome.storage.session.get('waDraft'), chrome.storage.local.get('waPrefs')]);
    const d = waDraft || {};
    $('w-country').value = d.country || waPrefs?.country || defaultCountry(navigator.languages || []);
    for (const f of FIELDS.slice(1)) if (d[f] != null) $(`w-${f}`).value = d[f];
    if (!d.preset) $('w-preset').value = 'chat';
    if (!d.landing) {
      const url = await ctx.currentTabUrl();
      if (url) $('w-landing').value = url;
    }
    applyPreset(false);
    update();
  }

  function values() {
    return Object.fromEntries(FIELDS.map(f => [f, $(`w-${f}`).value]));
  }

  function applyPreset(fromUser) {
    const p = PRESETS[$('w-preset').value];
    if (!p) return;
    if (fromUser || !$('w-source').value) $('w-source').value = p.source;
    if (fromUser || !$('w-medium').value) $('w-medium').value = p.medium;
  }

  function update() {
    const v = values();
    const rules = ctx.rules();
    const utm = {};
    for (const k of ['source', 'medium', 'campaign', 'content']) if (v[k].trim()) utm[k] = normalizeValue(v[k], rules);
    result = buildWhatsApp({ country: v.country, number: v.number, message: v.message, landing: v.landing.trim(), utm, ref: v.ref, stripTracking: ctx.settings().stripTracking });
    $('w-out').value = result.url;
    $('w-numberHint').textContent = result.digits ? `Opens a chat with +${result.digits}.` : 'Leave the number empty to let people choose who to send it to.';
    const ga4 = result.ga4;
    const status = { ok: '✓ Pass', warn: '! Warning', error: '✕ Critical', idle: '' };
    $('w-ga4').className = `ga4 ${ga4?.level || 'idle'}`;
    $('w-ga4Pill').textContent = ga4?.channel ? `${status[ga4.level]} · Website link lands in GA4 as ${ga4.channel}` : 'Add a landing page to tag the website link.';
    $('w-warnings').replaceChildren(
      ...result.warnings.map(w => Object.assign(document.createElement('li'), { className: 'warn', textContent: w })),
      ...(ga4?.messages || []).map(w => Object.assign(document.createElement('li'), { className: ga4.level === 'error' ? 'error' : 'warn', textContent: w }))
    );
    for (const id of ['w-copy', 'w-qrBtn']) $(id).disabled = !!result.warnings.find(w => w.startsWith('Landing page'));
    $('w-copyLanding').disabled = !result.landingUrl;
    if (!$('w-qr').hidden) renderQr();
    chrome.storage.session.set({ waDraft: v });
  }

  function style() {
    return { ...DEFAULT_QR, ...(ctx.ws().qr || {}), caption: '' };
  }

  async function renderQr() {
    await drawQr($('w-qrCanvas'), result?.url || '', style(), { size: 480 });
    $('w-qrCanvas').style.width = '240px';
    $('w-qrDest').textContent = result ? `Opens: ${result.digits ? `chat with +${result.digits}` : 'contact picker'} with your message` : '';
  }

  async function record() {
    if (!result) return;
    const w = ctx.ws();
    const v = values();
    await store.addHistory({
      kind: 'whatsapp',
      workspaceId: w.id,
      workspace: w.name,
      destination: result.landingUrl || result.url,
      source: normalizeValue(v.source, ctx.rules()),
      medium: normalizeValue(v.medium, ctx.rules()),
      campaign: normalizeValue(v.campaign, ctx.rules()),
      content: normalizeValue(v.content, ctx.rules()),
      channel: result.ga4?.channel || '',
      url: result.url,
      waNumber: result.digits,
      title: 'WhatsApp link',
      createdBy: ctx.settings().userName || '',
    });
    store.logActivity('whatsapp_link_created', { workspaceId: w.id, workspace: w.name, url: result.url });
    chrome.storage.local.set({ waPrefs: { country: v.country } });
  }

  for (const f of FIELDS) $(`w-${f}`).addEventListener('input', () => {
    if (f === 'source' || f === 'medium') $('w-preset').value = 'custom';
    update();
  });
  $('w-preset').addEventListener('change', () => {
    applyPreset(true);
    update();
  });
  $('w-insertLink').onclick = () => {
    const el = $('w-message');
    const at = el.selectionStart ?? el.value.length;
    el.value = el.value.slice(0, at) + LINK_TOKEN + el.value.slice(el.selectionEnd ?? at);
    el.focus();
    update();
  };
  $('w-useTab').onclick = async () => {
    const url = await ctx.currentTabUrl();
    if (!url) return ctx.toast('Click the extension icon on the tab to give access to its URL');
    $('w-landing').value = url;
    update();
  };
  $('w-copy').onclick = async () => {
    await ctx.copy(result.url, 'WhatsApp link copied');
    record();
  };
  $('w-copyMsg').onclick = () => {
    $('w-menu').open = false;
    ctx.copy(result.message, 'Message copied');
  };
  $('w-copyLanding').onclick = () => {
    $('w-menu').open = false;
    if (result.landingUrl) ctx.copy(result.landingUrl, 'Tagged website link copied');
  };
  $('w-open').onclick = () => {
    $('w-menu').open = false;
    chrome.tabs.create({ url: result.url });
  };
  $('w-qrBtn').onclick = () => {
    $('w-qr').hidden = !$('w-qr').hidden;
    if (!$('w-qr').hidden) renderQr();
  };
  $('w-qrPng').onclick = async () => {
    const c = document.createElement('canvas');
    await drawQr(c, result.url, style(), { size: 1200 });
    c.toBlob(b => ctx.downloadBlob('whatsapp-qr.png', b));
    record();
  };
  $('w-qrSvg').onclick = () => {
    ctx.download('whatsapp-qr.svg', qrSvg(result.url, style()), 'image/svg+xml');
    record();
  };

  load();
  return { refresh: update };
}
