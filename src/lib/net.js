// Network features. Both are opt-in and use optional host permissions, so the
// base install asks for nothing beyond activeTab/storage/contextMenus.

export const SHORTENERS = {
  bitly: {
    label: 'Bitly',
    origins: ['https://api-ssl.bitly.com/*'],
    async shorten(longUrl, { token, domain }, { slug } = {}) {
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
      const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers,
        body: JSON.stringify(domain ? { long_url: longUrl, domain } : { long_url: longUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.description || body.message || `Bitly error ${res.status}`);
      let link = body.link;
      if (slug) {
        // Custom back-halves need a paid Bitly plan and a branded domain.
        const custom = `${domain || 'bit.ly'}/${slug}`;
        const r2 = await fetch('https://api-ssl.bitly.com/v4/custom_bitlinks', {
          method: 'POST',
          headers,
          body: JSON.stringify({ custom_bitlink: custom, bitlink_id: body.id }),
        });
        const b2 = await r2.json().catch(() => ({}));
        if (!r2.ok) throw new Error(`Short link created (${link}) but the custom ending failed: ${b2.description || b2.message || r2.status}`);
        link = `https://${custom}`;
      }
      return { link, meta: { provider: 'bitly', id: body.id } };
    },
    async clicks(meta, { token }) {
      const res = await fetch(`https://api-ssl.bitly.com/v4/bitlinks/${encodeURIComponent(meta.id)}/clicks/summary?unit=month&units=-1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.description || body.message || `Bitly error ${res.status}`);
      return body.total_clicks ?? 0;
    },
  },
  dub: {
    label: 'Dub',
    origins: ['https://api.dub.co/*'],
    async shorten(longUrl, { token, domain }, { slug } = {}) {
      const payload = { url: longUrl };
      if (domain) payload.domain = domain;
      if (slug) payload.key = slug;
      const res = await fetch('https://api.dub.co/links', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error?.message || `Dub error ${res.status}`);
      return { link: body.shortLink, meta: { provider: 'dub', id: body.id } };
    },
    async clicks(meta, { token }) {
      const res = await fetch(`https://api.dub.co/links/info?linkId=${encodeURIComponent(meta.id)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error?.message || `Dub error ${res.status}`);
      return body.clicks ?? 0;
    },
  },
  rebrandly: {
    label: 'Rebrandly',
    origins: ['https://api.rebrandly.com/*'],
    async shorten(longUrl, { token, domain }, { slug } = {}) {
      const payload = { destination: longUrl };
      if (domain) payload.domain = { fullName: domain };
      if (slug) payload.slashtag = slug;
      const res = await fetch('https://api.rebrandly.com/v1/links', {
        method: 'POST',
        headers: { apikey: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `Rebrandly error ${res.status}`);
      const link = body.shortUrl.startsWith('http') ? body.shortUrl : `https://${body.shortUrl}`;
      return { link, meta: { provider: 'rebrandly', id: body.id } };
    },
    async clicks(meta, { token }) {
      const res = await fetch(`https://api.rebrandly.com/v1/links/${encodeURIComponent(meta.id)}`, { headers: { apikey: token } });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `Rebrandly error ${res.status}`);
      return body.clicks ?? 0;
    },
  },
};

async function ready(shortener) {
  const impl = SHORTENERS[shortener?.provider];
  if (!impl) throw new Error('No shortener configured — add an API key in Settings');
  if (!shortener.token) throw new Error(`Add your ${impl.label} API key in Settings`);
  const granted = await chrome.permissions.contains({ origins: impl.origins });
  if (!granted) throw new Error(`Allow access to ${impl.label} in Settings first`);
  return impl;
}

export const SLUG_RE = /^[A-Za-z0-9][A-Za-z0-9_-]{0,49}$/;

// Returns { link, meta } — meta is kept in history to fetch click counts later.
export async function shorten(longUrl, shortener, opts = {}) {
  if (opts.slug && !SLUG_RE.test(opts.slug)) throw new Error('Custom ending can use letters, numbers, - and _ (max 50)');
  const impl = await ready(shortener);
  return impl.shorten(longUrl, shortener, opts);
}

export async function fetchClicks(meta, shortener) {
  if (!meta?.id) throw new Error('This link has no click data');
  if (meta.provider !== shortener?.provider) throw new Error(`This link was made with ${SHORTENERS[meta.provider]?.label || meta.provider}`);
  const impl = await ready(shortener);
  return impl.clicks(meta, shortener);
}

export function webhookOrigin(url) {
  try {
    const u = new URL(url);
    if (u.protocol !== 'https:') return null;
    return `${u.origin}/*`;
  } catch {
    return null;
  }
}

// POST each copied link to a webhook (Zapier, Make, Google Apps Script → Sheets, Slack).
export async function sendWebhook(webhook, record) {
  const origin = webhookOrigin(webhook?.url);
  if (!origin) return { ok: false, error: 'Webhook URL must start with https://' };
  if (!(await chrome.permissions.contains({ origins: [origin] }))) return { ok: false, error: 'Allow the webhook in Settings first' };
  const body =
    webhook.format === 'slack'
      ? { text: `New link in *${record.workspace}* by ${record.createdBy || 'someone'}: ${record.shortUrl || record.url}\n${record.source} / ${record.medium} / ${record.campaign} → ${record.channel}` }
      : { event: 'link.created', ...record };
  try {
    const res = await fetch(webhook.url, {
      method: 'POST',
      // Apps Script answers a POST with a 302 to googleusercontent.com; the row is
      // already written by then, so don't follow it.
      redirect: webhook.format === 'sheets' ? 'manual' : 'follow',
      headers: { 'Content-Type': webhook.format === 'sheets' ? 'text/plain;charset=utf-8' : 'application/json' },
      body: JSON.stringify(body),
    });
    return res.ok || res.type === 'opaqueredirect' ? { ok: true } : { ok: false, error: `Webhook returned ${res.status}` };
  } catch {
    return { ok: false, error: 'Could not reach the webhook' };
  }
}

export const LINK_CHECK_ORIGINS = ['https://*/*', 'http://*/*'];

// Returns { state: 'ok'|'redirect'|'error'|'unknown', status, finalUrl, message }
export async function checkLink(url, { timeoutMs = 8000 } = {}) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const granted = await chrome.permissions.contains({ origins: LINK_CHECK_ORIGINS });
    if (!granted) {
      // Opaque probe: can detect DNS/connection failures but not 404s.
      await fetch(url, { method: 'HEAD', mode: 'no-cors', signal: ctrl.signal, credentials: 'omit' });
      return { state: 'unknown', message: 'Reachable (enable live link checks in Settings for status codes)' };
    }
    let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: ctrl.signal, credentials: 'omit' });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, { method: 'GET', redirect: 'follow', signal: ctrl.signal, credentials: 'omit' });
    }
    const finalUrl = res.url;
    const lost = utmsLost(url, finalUrl);
    if (res.status >= 400) return { state: 'error', status: res.status, finalUrl, lost, message: `Returns ${res.status}` };
    if (res.redirected || finalUrl !== url) {
      if (lost.length) {
        return { state: 'error', status: res.status, finalUrl, lost, message: `Redirects to ${short(finalUrl)} and drops ${lost.join(', ')}` };
      }
      if (stripQuery(finalUrl) !== stripQuery(url)) {
        return { state: 'redirect', status: res.status, finalUrl, lost, message: `Redirects to ${short(finalUrl)}; UTMs survive` };
      }
    }
    return { state: 'ok', status: res.status, finalUrl, lost, message: `${res.status} OK` };
  } catch (e) {
    return { state: 'error', message: e.name === 'AbortError' ? 'Timed out' : 'Could not reach this URL' };
  } finally {
    clearTimeout(timer);
  }
}

// UTM parameters present on the original link but missing or changed on the final one.
export function utmsLost(original, final) {
  try {
    const a = new URL(original).searchParams;
    const b = new URL(final).searchParams;
    return [...new Set([...a.keys()].filter(k => k.toLowerCase().startsWith('utm_') && b.get(k) !== a.get(k)))];
  } catch {
    return [];
  }
}

function stripQuery(u) {
  try {
    const x = new URL(u);
    return (x.origin + x.pathname).replace(/\/$/, '');
  } catch {
    return u;
  }
}

function short(u) {
  try {
    const x = new URL(u);
    return x.host + x.pathname;
  } catch {
    return u;
  }
}

// Open the tagged link in a background tab, let redirects and client-side
// routing settle, then read the final URL and look for a GA4/GTM tag.
// Needs the live-link-check (all sites) permission plus "scripting".
export async function landingCheck(url, { settleMs = 2500, timeoutMs = 20000 } = {}) {
  if (!(await chrome.permissions.contains({ origins: LINK_CHECK_ORIGINS }))) {
    return { state: 'unknown', message: 'Enable live link checks in Settings to test the landing page' };
  }
  const expected = new URL(url).searchParams;
  const tab = await chrome.tabs.create({ url, active: false });
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        chrome.tabs.onUpdated.removeListener(listener);
        reject(new Error('timeout'));
      }, timeoutMs);
      function listener(id, info) {
        if (id === tab.id && info.status === 'complete') {
          clearTimeout(timer);
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }
      }
      chrome.tabs.onUpdated.addListener(listener);
    });
    await new Promise(r => setTimeout(r, settleMs));
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      world: 'MAIN',
      func: () => {
        const ids = new Set();
        const gtm = window.google_tag_manager || {};
        for (const k of Object.keys(gtm)) if (/^(G-|GT-|GTM-|AW-)/.test(k)) ids.add(k);
        for (const s of document.scripts) {
          const m = (s.src || '').match(/[?&]id=((G|GT|GTM|AW)-[A-Z0-9]+)/);
          if (m) ids.add(m[1]);
        }
        return { href: location.href, tags: [...ids], dataLayer: Array.isArray(window.dataLayer) };
      },
    });
    const finalParams = new URL(result.href).searchParams;
    const lost = [...expected.keys()].filter(k => k.startsWith('utm_') && finalParams.get(k) !== expected.get(k));
    const ga4 = result.tags.filter(t => /^G-/.test(t));
    const parts = [];
    parts.push(lost.length ? `Lost on landing: ${lost.join(', ')}` : 'UTMs survive to the landing page');
    parts.push(ga4.length ? `GA4 tag found (${ga4.join(', ')})` : result.tags.length ? `Tags found (${result.tags.join(', ')}) but no GA4 ID` : 'No GA4 or GTM tag detected');
    return {
      state: lost.length ? 'error' : ga4.length || result.tags.length ? 'ok' : 'redirect',
      finalUrl: result.href,
      lost,
      tags: result.tags,
      message: parts.join(' · '),
    };
  } catch (e) {
    return { state: 'error', message: e.message === 'timeout' ? 'Landing page took too long to load' : `Could not inspect the page: ${e.message}` };
  } finally {
    chrome.tabs.remove(tab.id).catch(() => {});
  }
}
