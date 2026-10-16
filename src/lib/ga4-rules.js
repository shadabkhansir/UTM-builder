// GA4 Default Channel Group rules for manually tagged traffic, kept as data.
// Source: "Channels for manual traffic", https://support.google.com/analytics/answer/9756891
// Rules are checked top to bottom; the first match wins. Matching is case-insensitive.
// When Google changes the table: edit RULES, bump RULES_VERSION and RULES_AS_OF,
// and update tests/ga4-rules.test.js.

export const RULES_VERSION = 3;
export const RULES_AS_OF = '2026-05-13'; // AI Assistant channel added
export const RULES_SOURCE = 'https://support.google.com/analytics/answer/9756891';

const PAID = '^(.*cp.*|ppc|retargeting|paid.*)$';
const SHOP_CAMPAIGN = '^(.*(([^a-df-z]|^)shop|shopping).*)$';
const EMAIL = ['email', 'e-mail', 'e_mail', 'e mail'];

// Condition language:
//   { all: [...] } | { any: [...] } | { field, op, value }
//   field: source | medium | campaign
//   op: is | in | regex | contains | endsWith | category (Google's source lists)
export const RULES = [
  {
    channel: 'Direct',
    when: { all: [{ field: 'source', op: 'is', value: '(direct)' }, { field: 'medium', op: 'in', value: ['(not set)', '(none)'] }] },
    why: 'source is "(direct)" and medium is "(none)" or "(not set)"',
  },
  {
    channel: 'Cross-network',
    when: { field: 'campaign', op: 'contains', value: 'cross-network' },
    why: 'campaign name contains "cross-network"',
  },
  {
    channel: 'Paid Shopping',
    when: {
      all: [
        { any: [{ field: 'source', op: 'category', value: 'shopping' }, { field: 'campaign', op: 'regex', value: SHOP_CAMPAIGN }] },
        { field: 'medium', op: 'regex', value: PAID },
      ],
    },
    why: 'source is a shopping site (or the campaign name contains "shop") and the medium is paid (contains "cp", or is ppc, retargeting or paid…)',
  },
  {
    channel: 'Paid Search',
    when: { all: [{ field: 'source', op: 'category', value: 'search' }, { field: 'medium', op: 'regex', value: PAID }] },
    why: "source is on Google's search-site list and the medium is paid",
  },
  {
    channel: 'Paid Social',
    when: { all: [{ field: 'source', op: 'category', value: 'social' }, { field: 'medium', op: 'regex', value: PAID }] },
    why: "source is on Google's social-site list and the medium is paid",
  },
  {
    channel: 'Paid Video',
    when: { all: [{ field: 'source', op: 'category', value: 'video' }, { field: 'medium', op: 'regex', value: PAID }] },
    why: "source is on Google's video-site list and the medium is paid",
  },
  {
    channel: 'Display',
    when: { field: 'medium', op: 'in', value: ['display', 'banner', 'expandable', 'interstitial', 'cpm'] },
    why: 'medium is display, banner, expandable, interstitial or cpm',
  },
  {
    channel: 'Paid Other',
    when: { field: 'medium', op: 'regex', value: PAID },
    why: "the medium is paid but the source isn't on any of Google's search, social, video or shopping lists",
  },
  {
    channel: 'Organic Shopping',
    when: { any: [{ field: 'source', op: 'category', value: 'shopping' }, { field: 'campaign', op: 'regex', value: SHOP_CAMPAIGN }] },
    why: 'source is a shopping site or the campaign name contains "shop"',
  },
  {
    channel: 'Organic Social',
    when: {
      any: [
        { field: 'source', op: 'category', value: 'social' },
        { field: 'medium', op: 'in', value: ['social', 'social-network', 'social-media', 'sm', 'social network', 'social media'] },
      ],
    },
    why: "source is on Google's social-site list or the medium is social",
  },
  {
    channel: 'Organic Video',
    when: { any: [{ field: 'source', op: 'category', value: 'video' }, { field: 'medium', op: 'contains', value: 'video' }] },
    why: 'source is a video site or the medium contains "video"',
  },
  {
    channel: 'Organic Search',
    when: { any: [{ field: 'source', op: 'category', value: 'search' }, { field: 'medium', op: 'is', value: 'organic' }] },
    why: 'source is a search engine or the medium is "organic"',
  },
  {
    channel: 'AI Assistant',
    when: { field: 'medium', op: 'is', value: 'ai-assistant' },
    why: 'medium is "ai-assistant"',
  },
  {
    channel: 'Referral',
    when: { field: 'medium', op: 'in', value: ['referral', 'app', 'link'] },
    why: 'medium is referral, app or link',
  },
  {
    channel: 'Email',
    when: { any: [{ field: 'source', op: 'in', value: EMAIL }, { field: 'medium', op: 'in', value: EMAIL }] },
    why: 'source or medium is "email"',
  },
  { channel: 'Affiliates', when: { field: 'medium', op: 'is', value: 'affiliate' }, why: 'medium is "affiliate"' },
  { channel: 'Audio', when: { field: 'medium', op: 'is', value: 'audio' }, why: 'medium is "audio"' },
  {
    channel: 'SMS',
    when: { any: [{ field: 'source', op: 'is', value: 'sms' }, { field: 'medium', op: 'is', value: 'sms' }] },
    why: 'source or medium is "sms"',
  },
  {
    channel: 'Mobile Push Notifications',
    when: {
      any: [
        { field: 'medium', op: 'endsWith', value: 'push' },
        { field: 'medium', op: 'contains', value: 'mobile' },
        { field: 'medium', op: 'contains', value: 'notification' },
        { field: 'source', op: 'is', value: 'firebase' },
      ],
    },
    why: 'medium ends with "push" or contains "mobile" or "notification", or source is "firebase"',
  },
];

export const UNASSIGNED_WHY = 'no GA4 rule matches this source and medium';
