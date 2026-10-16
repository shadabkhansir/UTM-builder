import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RULES, RULES_AS_OF } from '../src/lib/ga4-rules.js';
import { explainChannel, CHANNELS } from '../src/lib/ga4.js';

// One example per row of Google's "Channels for manual traffic" table.
const EXAMPLES = {
  Direct: { source: '(direct)', medium: '(none)' },
  'Cross-network': { source: 'google', medium: 'cpc', campaign: 'q4_cross-network' },
  'Paid Shopping': { source: 'amazon', medium: 'cpc' },
  'Paid Search': { source: 'google', medium: 'cpc' },
  'Paid Social': { source: 'facebook', medium: 'paid_social' },
  'Paid Video': { source: 'youtube', medium: 'cpv' },
  Display: { source: 'partner', medium: 'banner' },
  'Paid Other': { source: 'meta', medium: 'cpc' },
  'Organic Shopping': { source: 'amazon', medium: 'listing' },
  'Organic Social': { source: 'whatsapp', medium: 'chat' },
  'Organic Video': { source: 'blog', medium: 'video_embed' },
  'Organic Search': { source: 'bing', medium: 'organic' },
  'AI Assistant': { source: 'chatgpt.com', medium: 'ai-assistant' },
  Referral: { source: 'partner-site', medium: 'referral' },
  Email: { source: 'newsletter', medium: 'email' },
  Affiliates: { source: 'partner', medium: 'affiliate' },
  Audio: { source: 'podcast', medium: 'audio' },
  SMS: { source: 'sms', medium: 'text' },
  'Mobile Push Notifications': { source: 'app', medium: 'web_push' },
};

test('rules data covers every channel except Unassigned, in Google order', () => {
  assert.deepEqual(RULES.map(r => r.channel), CHANNELS.filter(c => c !== 'Unassigned'));
  assert.match(RULES_AS_OF, /^\d{4}-\d{2}-\d{2}$/);
});

for (const rule of RULES) {
  test(`rule "${rule.channel}" matches and explains itself`, () => {
    const r = explainChannel(EXAMPLES[rule.channel]);
    assert.equal(r.channel, rule.channel);
    assert.equal(r.why, rule.why);
  });
}

test('no match explains Unassigned', () => {
  const r = explainChannel({ source: 'klaviyo', medium: 'campaign' });
  assert.equal(r.channel, 'Unassigned');
  assert.match(r.why, /no GA4 rule/);
});
