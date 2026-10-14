import { test } from 'node:test';
import assert from 'node:assert/strict';
import { predictChannel, analyze } from '../src/lib/ga4.js';

const cases = [
  [{ source: 'facebook', medium: 'paid_social' }, 'Paid Social'],
  [{ source: 'facebook', medium: 'cpc' }, 'Paid Social'],
  [{ source: 'meta', medium: 'paid_social' }, 'Paid Other'],
  [{ source: 'facebook', medium: 'fb_ads' }, 'Organic Social'],
  [{ source: 'google', medium: 'cpc' }, 'Paid Search'],
  [{ source: 'youtube', medium: 'cpv' }, 'Paid Video'],
  [{ source: 'amazon', medium: 'cpc' }, 'Paid Shopping'],
  [{ source: 'x', medium: 'ppc', campaign: 'winter_shop' }, 'Paid Shopping'],
  [{ source: 'gdn', medium: 'display' }, 'Display'],
  [{ source: 'newsletter', medium: 'email' }, 'Email'],
  [{ source: 'email', medium: 'blast' }, 'Email'],
  [{ source: 'partner', medium: 'affiliate' }, 'Affiliates'],
  [{ source: 'partner', medium: 'referral' }, 'Referral'],
  [{ source: 'sms', medium: 'text' }, 'SMS'],
  [{ source: 'app', medium: 'web_push' }, 'Mobile Push Notifications'],
  [{ source: 'blog', medium: 'social' }, 'Organic Social'],
  [{ source: 'vendor', medium: 'banner_ads' }, 'Unassigned'],
  [{ source: 'linkedin', medium: 'social-paid' }, 'Organic Social'],
  [{ source: 'x', medium: 'y', campaign: 'cross-network_q4' }, 'Cross-network'],
  [{ source: 'chatgpt.com', medium: 'ai-assistant' }, 'AI Assistant'],
  [{ source: 'Facebook', medium: 'CPC' }, 'Paid Social'],
];

for (const [input, expected] of cases) {
  test(`${JSON.stringify(input)} → ${expected}`, () => assert.equal(predictChannel(input), expected));
}

test('analyze warns on meta and suggests facebook', () => {
  const a = analyze({ source: 'meta', medium: 'paid_social' });
  assert.equal(a.level, 'warn');
  assert.match(a.messages.join(' '), /Use "facebook" → Paid Social/);
});

test('analyze warns paid-looking medium counted as organic', () => {
  const a = analyze({ source: 'facebook', medium: 'fb_ads' });
  assert.equal(a.channel, 'Organic Social');
  assert.equal(a.level, 'warn');
});

test('analyze errors on unassigned', () => {
  const a = analyze({ source: 'vendor', medium: 'banner_ads' });
  assert.equal(a.level, 'error');
});

test('analyze is idle when empty', () => {
  assert.equal(analyze({}).level, 'idle');
});

test('no alias nag when the alias does not change the channel', () => {
  const a = analyze({ source: 'newsletter', medium: 'email' });
  assert.equal(a.channel, 'Email');
  assert.equal(a.level, 'ok');
});
