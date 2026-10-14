// Network features. Both are opt-in and use optional host permissions, so the
// base install asks for nothing beyond activeTab/storage/contextMenus.

export const SHORTENERS = {
  bitly: {
    label: 'Bitly',
    origins: ['https://api-ssl.bitly.com/*'],
    async shorten(longUrl, { token, domain }) {
      const res = await fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(domain ? { long_url: longUrl, domain } : { long_url: longUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.description || body.message || `Bitly error ${res.status}`);
      return body.link;
    },
  },
  dub: {
    label: 'Dub',
    origins: ['https://api.dub.co/*'],
    async shorten(longUrl, { token, domain }) {
      const res = await fetch('https://api.dub.co/links', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(domain ? { url: longUrl, domain } : { url: longUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error?.message || `Dub error ${res.status}`);
      return body.shortLink;
    },
  },
  rebrandly: {
    label: 'Rebrandly',
    origins: ['https://api.rebrandly.com/*'],
    async shorten(longUrl, { token, domain }) {
      const res = await fetch('https://api.rebrandly.com/v1/links', {
        method: 'POST',
        headers: { apikey: token, 'Content-Type': 'application/json' },
        body: JSON.stringify(domain ? { destination: longUrl, domain: { fullName: domain } } : { destination: longUrl }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.message || `Rebrandly error ${res.status}`);
      return body.shortUrl.startsWith('http') ? body.shortUrl : `https://${body.shortUrl}`;
    },
  },
};

export async function shorten(longUrl, shortener) {
  const impl = SHORTENERS[shortener?.provider];
  if (!impl) throw new Error('No shortener configured — add an API key in Settings');
  if (!shortener.token) throw new Error(`Add your ${impl.label} API key in Settings`);
  const granted = await chrome.permissions.contains({ origins: impl.origins });
  if (!granted) throw new Error(`Allow access to ${impl.label} in Settings first`);
  return impl.shorten(longUrl, shortener);
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
    if (res.status >= 400) return { state: 'error', status: res.status, finalUrl, message: `Returns ${res.status}` };
    if (res.redirected && stripQuery(finalUrl) !== stripQuery(url)) {
      const lost = !new URL(finalUrl).searchParams.has('utm_source') && new URL(url).searchParams.has('utm_source');
      return {
        state: 'redirect',
        status: res.status,
        finalUrl,
        message: lost ? `Redirects to ${short(finalUrl)} and DROPS the UTMs` : `Redirects to ${short(finalUrl)}`,
      };
    }
    return { state: 'ok', status: res.status, finalUrl, message: `${res.status} OK` };
  } catch (e) {
    return { state: 'error', message: e.name === 'AbortError' ? 'Timed out' : 'Could not reach this URL' };
  } finally {
    clearTimeout(timer);
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
