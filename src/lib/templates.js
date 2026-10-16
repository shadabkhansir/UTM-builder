// Built-in presets. Every one passes the GA4 channel check (see tests) and
// keeps ad-platform macros intact. Campaign is left blank where the team
// should name it; the ID-style macros go into utm_id for GA4 cost import.

export const BUILTIN_GROUP = 'Built-in templates';

export const BUILTIN_TEMPLATES = [
  {
    id: 'bt-google-search',
    name: 'Google Ads – Search',
    channel: 'Paid Search',
    values: { source: 'google', medium: 'cpc', term: '{keyword}', content: '{creative}', id: '{campaignid}', source_platform: 'google_ads' },
  },
  {
    id: 'bt-google-pmax',
    name: 'Google Ads – Performance Max',
    channel: 'Paid Search',
    values: { source: 'google', medium: 'cpc', id: '{campaignid}', source_platform: 'google_ads', marketing_tactic: 'pmax' },
  },
  {
    id: 'bt-youtube',
    name: 'YouTube Ads',
    channel: 'Paid Video',
    values: { source: 'youtube', medium: 'cpv', content: '{creative}', id: '{campaignid}', source_platform: 'google_ads', creative_format: 'video' },
  },
  {
    id: 'bt-microsoft',
    name: 'Microsoft Ads – Search',
    channel: 'Paid Search',
    values: { source: 'bing', medium: 'cpc', campaign: '{Campaign}', term: '{keyword}', id: '{CampaignId}', source_platform: 'microsoft_ads' },
  },
  {
    id: 'bt-meta-fb',
    name: 'Meta Ads – Facebook',
    channel: 'Paid Social',
    values: { source: 'facebook', medium: 'paid_social', campaign: '{{campaign.name}}', term: '{{adset.name}}', content: '{{ad.name}}', id: '{{campaign.id}}', source_platform: 'meta_ads' },
  },
  {
    id: 'bt-meta-ig',
    name: 'Meta Ads – Instagram',
    channel: 'Paid Social',
    values: { source: 'instagram', medium: 'paid_social', campaign: '{{campaign.name}}', term: '{{adset.name}}', content: '{{ad.name}}', id: '{{campaign.id}}', source_platform: 'meta_ads' },
  },
  {
    id: 'bt-tiktok',
    name: 'TikTok Ads',
    channel: 'Paid Social',
    values: { source: 'tiktok', medium: 'paid_social', campaign: '__CAMPAIGN_NAME__', term: '__AID_NAME__', content: '__CID_NAME__', id: '__CAMPAIGN_ID__', source_platform: 'tiktok_ads' },
  },
  {
    id: 'bt-linkedin',
    name: 'LinkedIn Ads',
    channel: 'Paid Social',
    values: { source: 'linkedin', medium: 'paid_social', content: '{{CREATIVE_ID}}', id: '{{CAMPAIGN_ID}}', source_platform: 'linkedin_ads' },
  },
  {
    id: 'bt-snapchat',
    name: 'Snapchat Ads',
    channel: 'Paid Social',
    values: { source: 'snapchat', medium: 'paid_social', source_platform: 'snapchat_ads' },
  },
  {
    id: 'bt-x',
    name: 'X (Twitter) Ads',
    channel: 'Paid Social',
    values: { source: 'twitter', medium: 'paid_social', source_platform: 'x_ads' },
  },
  {
    id: 'bt-newsletter',
    name: 'Email newsletter',
    channel: 'Email',
    values: { source: 'newsletter', medium: 'email' },
  },
  {
    id: 'bt-organic-social',
    name: 'Organic social post',
    channel: 'Organic Social',
    values: { source: 'linkedin', medium: 'social' },
  },
  {
    id: 'bt-whatsapp',
    name: 'WhatsApp chat or status',
    channel: 'Organic Social',
    values: { source: 'whatsapp', medium: 'social' },
  },
  {
    id: 'bt-sms',
    name: 'SMS',
    channel: 'SMS',
    values: { source: 'sms', medium: 'sms' },
  },
  {
    id: 'bt-push',
    name: 'App push notification',
    channel: 'Mobile Push Notifications',
    values: { source: 'app', medium: 'push' },
  },
  {
    id: 'bt-affiliate',
    name: 'Affiliate / partner',
    channel: 'Affiliates',
    values: { source: 'partner-name', medium: 'affiliate' },
  },
];
