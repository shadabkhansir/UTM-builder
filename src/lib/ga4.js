// GA4 Default Channel Group predictor for manually tagged (UTM) traffic.
// The rules themselves live as data in ga4-rules.js (Google's "Channels for
// manual traffic" table); this file evaluates them and explains the result.

import { SEARCH_SOURCES, SOCIAL_SOURCES, SHOPPING_SOURCES, VIDEO_SOURCES } from './ga4-sources.js';
import { RULES, UNASSIGNED_WHY } from './ga4-rules.js';

const PAID_MEDIUM = /^(.*cp.*|ppc|retargeting|paid.*)$/;

// Aliases people commonly type that GA4 does NOT recognise, mapped to a value it does.
const SOURCE_FIXES = {
  meta: 'facebook',
  'meta-ads': 'facebook',
  meta_ads: 'facebook',
  fb_ads: 'facebook',
  facebook_ads: 'facebook',
  'facebook-ads': 'facebook',
  insta: 'instagram',
  x: 'twitter',
  'x.com': 'twitter',
  tik_tok: 'tiktok',
  'tik-tok': 'tiktok',
  yt: 'youtube',
  google_ads: 'google',
  'google-ads': 'google',
  adwords: 'google',
  gads: 'google',
  microsoft: 'bing',
  microsoft_ads: 'bing',
  newsletter: 'email',
};

export const CHANNELS = [
  'Direct', 'Cross-network', 'Paid Shopping', 'Paid Search', 'Paid Social', 'Paid Video',
  'Display', 'Paid Other', 'Organic Shopping', 'Organic Social', 'Organic Video',
  'Organic Search', 'AI Assistant', 'Referral', 'Email', 'Affiliates', 'Audio', 'SMS',
  'Mobile Push Notifications', 'Unassigned',
];

export function sourceCategory(source) {
  const s = norm(source);
  if (SEARCH_SOURCES.has(s)) return 'search';
  if (SOCIAL_SOURCES.has(s)) return 'social';
  if (SHOPPING_SOURCES.has(s)) return 'shopping';
  if (VIDEO_SOURCES.has(s)) return 'video';
  return null;
}

const REGEX_CACHE = new Map();
function re(pattern) {
  if (!REGEX_CACHE.has(pattern)) REGEX_CACHE.set(pattern, new RegExp(pattern));
  return REGEX_CACHE.get(pattern);
}

function test(cond, v) {
  if (cond.all) return cond.all.every(c => test(c, v));
  if (cond.any) return cond.any.some(c => test(c, v));
  const x = v[cond.field];
  switch (cond.op) {
    case 'is': return x === cond.value;
    case 'in': return cond.value.includes(x);
    case 'regex': return re(cond.value).test(x);
    case 'contains': return x.includes(cond.value);
    case 'endsWith': return x.endsWith(cond.value);
    case 'category': return sourceCategory(x) === cond.value;
    default: throw new Error(`Unknown GA4 rule op: ${cond.op}`);
  }
}

// Which channel GA4 assigns, and the rule that decided it.
export function explainChannel({ source = '', medium = '', campaign = '' } = {}) {
  const v = { source: norm(source), medium: norm(medium), campaign: norm(campaign) };
  for (const rule of RULES) {
    if (test(rule.when, v)) return { channel: rule.channel, why: rule.why };
  }
  return { channel: 'Unassigned', why: UNASSIGNED_WHY };
}

// Returns the channel GA4 will assign for the given UTM values.
export function predictChannel(values) {
  return explainChannel(values).channel;
}

// Prediction plus human-readable warnings/suggestions for the UI badge.
// level: 'ok' | 'warn' | 'error' | 'idle'
export function analyze(values) {
  const source = norm(values.source);
  const medium = norm(values.medium);
  if (!source && !medium) return { channel: null, why: '', level: 'idle', messages: [], fixes: [] };

  const { channel, why } = explainChannel(values);
  const cat = sourceCategory(source);
  const paidMedium = PAID_MEDIUM.test(medium);
  const messages = [];
  const fixes = []; // [{ field, value, label }] one-click corrections for the UI
  let level = 'ok';

  if (channel === 'Unassigned') {
    level = 'error';
    messages.push('GA4 will put this traffic in "Unassigned".');
  }

  const fix = SOURCE_FIXES[source];
  const better = fix && !cat ? predictChannel({ ...values, source: fix }) : null;
  if (better && better !== channel) {
    level = level === 'error' ? 'error' : 'warn';
    messages.push(`"${source}" is not in GA4's source list. Use "${fix}" → ${better}.`);
    fixes.push({ field: 'source', value: fix, label: `Use "${fix}"` });
  }

  if (channel === 'Paid Other' && !cat && !(better && better !== channel)) {
    level = 'warn';
    messages.push(`"${source}" is not a known search/social/video/shopping source, so paid traffic falls into "Paid Other".`);
  }

  if (cat && !paidMedium && looksPaid(medium)) {
    level = 'warn';
    const paidChannel = predictChannel({ ...values, medium: 'cpc' });
    messages.push(`Medium "${medium}" isn't recognised as paid — this counts as ${channel}. Use "cpc" or "paid_${cat}" → ${paidChannel}.`);
    fixes.push({ field: 'medium', value: `paid_${cat}`, label: `Use "paid_${cat}"` });
  }

  if (channel === 'Unassigned' && medium && !(better && better !== channel)) {
    messages.push(suggestMedium(source, cat));
  }

  return { channel, why, level, messages, fixes };
}

function looksPaid(m) {
  return /(paid|ads?$|^ads?[_-]|[_-]ads?[_-]|sponsored|boost|promoted|cpa|cpv|cpi|cpl)/.test(m);
}

function suggestMedium(source, cat) {
  if (cat) return `Try medium "cpc" (paid) or "${cat === 'social' ? 'social' : cat === 'search' ? 'organic' : 'referral'}" (organic).`;
  return 'Use a recognised medium: cpc, paid_social, display, email, social, referral, affiliate, sms, organic.';
}

function norm(v) {
  return String(v ?? '').trim().toLowerCase();
}
