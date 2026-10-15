// The exact string each ad platform's tracking field expects, plus an Adobe
// Analytics cid link. Each output says where it goes and what's wrong with it.

import { buildUrl, encodeValue } from './url.js';

export const OUTPUTS = {
  meta: {
    label: 'Meta – URL parameters',
    where: 'Ads Manager → Ad → Destination → URL parameters',
    build: ({ query }) => query,
  },
  googleSuffix: {
    label: 'Google Ads – Final URL suffix',
    where: 'Campaign/Account settings → Campaign URL options → Final URL suffix',
    build: ({ query }) => query,
    check: s => (/[?#]/.test(s) ? 'The suffix must not contain ? or #' : ''),
  },
  googleTemplate: {
    label: 'Google Ads – Tracking template',
    where: 'Campaign URL options → Tracking template (Google adds {lpurl} at click time)',
    build: ({ query }) => `{lpurl}?${query}`,
  },
  microsoftSuffix: {
    label: 'Microsoft Ads – Final URL suffix',
    where: 'Campaign settings → Tracking template / Final URL suffix',
    build: ({ query }) => query,
  },
  tiktok: {
    label: 'TikTok – URL parameters',
    where: 'Ad → Destination → Website URL → Build URL parameters',
    build: ({ query }) => query,
  },
  linkedin: {
    label: 'LinkedIn – full URL',
    where: 'Ad → Destination URL (LinkedIn also accepts UTM fields in campaign settings)',
    build: ({ url }) => url,
  },
};

export function platformOutput(kind, result) {
  const o = OUTPUTS[kind];
  if (!o || !result?.ok) return null;
  const text = o.build(result);
  return { text, label: o.label, where: o.where, warning: o.check?.(text) || '' };
}

// Adobe Analytics tracking code: cid=<values joined by a delimiter>.
export function adobeCidUrl(destination, values, { param = 'cid', delimiter = ':', order = ['source', 'medium', 'campaign', 'content', 'term'], stripTracking = true } = {}) {
  const parts = order.map(k => values[k] || '').filter(Boolean);
  if (!parts.length) return { ok: false, error: 'Fill in at least one field for the cid' };
  const value = parts.join(delimiter);
  const res = buildUrl(destination, {}, { stripTracking, extra: [[param, value]] });
  return res.ok ? { ...res, cid: value, query: `${param}=${encodeValue(value)}` } : res;
}
