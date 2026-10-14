// GA4 Default Channel Group predictor for manually tagged (UTM) traffic.
// Mirrors the "Channels for manual traffic" table at
// https://support.google.com/analytics/answer/9756891 — rules are evaluated
// top to bottom and the first match wins. Matching is case-insensitive.

import { SEARCH_SOURCES, SOCIAL_SOURCES, SHOPPING_SOURCES, VIDEO_SOURCES } from './ga4-sources.js';

const PAID_MEDIUM = /^(.*cp.*|ppc|retargeting|paid.*)$/;
const SHOP_CAMPAIGN = /^(.*(([^a-df-z]|^)shop|shopping).*)$/;
const DISPLAY_MEDIUMS = new Set(['display', 'banner', 'expandable', 'interstitial', 'cpm']);
const SOCIAL_MEDIUMS = new Set(['social', 'social-network', 'social-media', 'sm', 'social network', 'social media']);
const EMAIL_VALUES = new Set(['email', 'e-mail', 'e_mail', 'e mail']);
const REFERRAL_MEDIUMS = new Set(['referral', 'app', 'link']);

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

// Returns the channel GA4 will assign for the given UTM values.
export function predictChannel({ source = '', medium = '', campaign = '' } = {}) {
  const s = norm(source);
  const m = norm(medium);
  const c = norm(campaign);
  const cat = sourceCategory(s);
  const paid = PAID_MEDIUM.test(m);
  const shopCampaign = SHOP_CAMPAIGN.test(c);

  if (s === '(direct)' && (m === '(not set)' || m === '(none)')) return 'Direct';
  if (c.includes('cross-network')) return 'Cross-network';
  if ((cat === 'shopping' || shopCampaign) && paid) return 'Paid Shopping';
  if (cat === 'search' && paid) return 'Paid Search';
  if (cat === 'social' && paid) return 'Paid Social';
  if (cat === 'video' && paid) return 'Paid Video';
  if (DISPLAY_MEDIUMS.has(m)) return 'Display';
  if (paid) return 'Paid Other';
  if (cat === 'shopping' || shopCampaign) return 'Organic Shopping';
  if (cat === 'social' || SOCIAL_MEDIUMS.has(m)) return 'Organic Social';
  if (cat === 'video' || m.includes('video')) return 'Organic Video';
  if (cat === 'search' || m === 'organic') return 'Organic Search';
  if (m === 'ai-assistant') return 'AI Assistant';
  if (REFERRAL_MEDIUMS.has(m)) return 'Referral';
  if (EMAIL_VALUES.has(s) || EMAIL_VALUES.has(m)) return 'Email';
  if (m === 'affiliate') return 'Affiliates';
  if (m === 'audio') return 'Audio';
  if (s === 'sms' || m === 'sms') return 'SMS';
  if (m.endsWith('push') || m.includes('mobile') || m.includes('notification') || s === 'firebase') {
    return 'Mobile Push Notifications';
  }
  return 'Unassigned';
}

// Prediction plus human-readable warnings/suggestions for the UI badge.
// level: 'ok' | 'warn' | 'error' | 'idle'
export function analyze(values) {
  const source = norm(values.source);
  const medium = norm(values.medium);
  if (!source && !medium) return { channel: null, level: 'idle', messages: [], fixes: [] };

  const channel = predictChannel(values);
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

  return { channel, level, messages, fixes };
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
