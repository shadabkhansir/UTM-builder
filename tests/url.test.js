import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildUrl, encodeValue, parseUtm, normalizeDestination } from '../src/lib/url.js';

test('keeps existing params and puts UTMs before the hash', () => {
  const r = buildUrl('https://site.com/pricing?currency=aed#faq', { source: 'facebook', medium: 'cpc', campaign: 'q4' });
  assert.equal(r.url, 'https://site.com/pricing?currency=aed&utm_source=facebook&utm_medium=cpc&utm_campaign=q4#faq');
});

test('preserves raw encoding of existing params', () => {
  const r = buildUrl('https://a.com/s?q=a+b%20c&x=%2F', { source: 's' });
  assert.equal(r.url, 'https://a.com/s?q=a+b%20c&x=%2F&utm_source=s');
});

test('strips click ids and old utms', () => {
  const r = buildUrl('https://a.com/?id=1&fbclid=XYZ&utm_source=old&gclid=1&_gl=abc', { source: 'new' });
  assert.equal(r.url, 'https://a.com/?id=1&utm_source=new');
  assert.deepEqual(r.removed.sort(), ['_gl', 'fbclid', 'gclid', 'utm_source']);
});

test('can keep click ids when stripping disabled, still replaces utms', () => {
  const r = buildUrl('https://a.com/?fbclid=1&utm_source=old', { source: 'new' }, { stripTracking: false });
  assert.equal(r.url, 'https://a.com/?fbclid=1&utm_source=new');
});

test('macros are never percent-encoded', () => {
  assert.equal(encodeValue('{{campaign.name}}'), '{{campaign.name}}');
  assert.equal(encodeValue('q4_{campaignid}_x y'), 'q4_{campaignid}_x%20y');
  assert.equal(encodeValue('__CAMPAIGN_NAME__'), '__CAMPAIGN_NAME__');
  const r = buildUrl('https://a.com', { source: 'facebook', campaign: '{{campaign.name}}', content: '{{ad.name}}' });
  assert.equal(r.url, 'https://a.com/?utm_source=facebook&utm_campaign={{campaign.name}}&utm_content={{ad.name}}');
  assert.equal(r.hasMacros, true);
  assert.equal(r.query, 'utm_source=facebook&utm_campaign={{campaign.name}}&utm_content={{ad.name}}');
});

test('encodes reserved characters in plain values', () => {
  const r = buildUrl('https://a.com', { campaign: 'a&b=c#d' });
  assert.equal(r.url, 'https://a.com/?utm_campaign=a%26b%3Dc%23d');
});

test('adds scheme, rejects garbage', () => {
  assert.equal(normalizeDestination('site.com/x').href, 'https://site.com/x');
  assert.equal(normalizeDestination('javascript:alert(1)'), null);
  assert.equal(normalizeDestination('hello'), null);
  assert.equal(buildUrl('', {}).ok, false);
});

test('bare ? and # do not produce broken urls', () => {
  assert.equal(buildUrl('https://a.com/p?', { source: 's' }).url, 'https://a.com/p?utm_source=s');
  assert.equal(buildUrl('https://a.com/p#', { source: 's' }).url, 'https://a.com/p?utm_source=s');
});

test('custom params are appended', () => {
  const r = buildUrl('https://a.com', { source: 's' }, { extra: [['ref', 'x y'], ['empty', '']] });
  assert.equal(r.url, 'https://a.com/?utm_source=s&ref=x%20y');
});

test('parseUtm reads existing tags', () => {
  assert.deepEqual(parseUtm('https://a.com/?utm_source=fb&utm_medium=cpc'), { source: 'fb', medium: 'cpc' });
});
