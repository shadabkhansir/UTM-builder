import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkLink, checkLinks, extractLinks, unwrap, fixHtml, formulaToRegex, looksLikeHtml } from '../src/lib/checker.js';
import { DEFAULT_RULES } from '../src/lib/rules.js';

const ws = {
  name: 'Acme',
  rules: { ...DEFAULT_RULES, lockMediums: true },
  sources: ['facebook', 'google', 'newsletter'],
  mediums: ['cpc', 'paid_social', 'email'],
  domains: ['acme.com'],
  campaignFormula: '[date:yyyy-mm]_[product]',
};
const codes = r => r.issues.map(i => i.code).sort();

test('clean link passes with channel and reason', () => {
  const r = checkLink('https://acme.com/p?utm_source=facebook&utm_medium=paid_social&utm_campaign=2026-10_boots', ws);
  assert.equal(r.level, 'pass');
  assert.equal(r.channel, 'Paid Social');
  assert.match(r.why, /social-site list/);
  assert.equal(r.fixed, '');
});

test('casing, spaces and GA4 alias are fixed in one go', () => {
  const r = checkLink('https://acme.com/p?utm_source=Meta&utm_medium=Paid%20Social&utm_campaign=2026-10_Boots%20Sale', ws);
  assert.equal(r.level, 'critical'); // medium not on the locked list
  assert.ok(codes(r).includes('naming'));
  assert.ok(codes(r).includes('ga4'));
  assert.equal(r.fixed, 'https://acme.com/p?utm_source=facebook&utm_medium=paid-social&utm_campaign=2026-10_boots-sale');
});

test('missing required field is critical', () => {
  const r = checkLink('https://acme.com/?utm_source=google&utm_medium=cpc', ws);
  assert.equal(r.level, 'critical');
  assert.ok(codes(r).includes('missing'));
});

test('UTMs after # are critical and moved to the query', () => {
  const r = checkLink('https://acme.com/page#utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_oct', ws);
  assert.ok(codes(r).includes('utm-hash'));
  assert.equal(r.level, 'critical');
  assert.equal(r.fixed, 'https://acme.com/page?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_oct');
});

test('anchor kept when UTMs follow it with ?', () => {
  const r = checkLink('https://acme.com/page#faq?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_oct', ws);
  assert.equal(r.fixed, 'https://acme.com/page?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_oct#faq');
});

test('second question mark is critical and folded into &', () => {
  const r = checkLink('https://acme.com/p?ref=1?utm_source=google&utm_medium=cpc&utm_campaign=2026-10_x', ws);
  assert.ok(codes(r).includes('extra-question'));
  assert.equal(r.fixed, 'https://acme.com/p?ref=1&utm_source=google&utm_medium=cpc&utm_campaign=2026-10_x');
});

test('encoded macros, double encoding, duplicates, empty values and click IDs', () => {
  const r = checkLink('https://acme.com/?utm_source=facebook&utm_source=fb&utm_medium=paid_social&utm_campaign=%7B%7Bcampaign.name%7D%7D&utm_content=&utm_term=a%2520b&fbclid=XYZ', ws);
  const c = codes(r);
  for (const code of ['encoded-macro', 'double-encoded', 'duplicate-param', 'empty-param', 'click-id']) assert.ok(c.includes(code), code);
  assert.equal(r.fixed, 'https://acme.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term=a-b');
});

test('unlocked list miss is a warning, locked list miss is critical', () => {
  const r1 = checkLink('https://acme.com/?utm_source=tiktok&utm_medium=cpc&utm_campaign=2026-10_x', ws);
  assert.equal(r1.issues.find(i => i.code === 'not-approved').level, 'warning');
  const r2 = checkLink('https://acme.com/?utm_source=google&utm_medium=banner&utm_campaign=2026-10_x', ws);
  assert.equal(r2.issues.find(i => i.code === 'not-approved').level, 'critical');
});

test('campaign formula and regex', () => {
  assert.ok(formulaToRegex('[date:yyyy-mm]_[region|uae,ksa]').test('2026-10_uae'));
  assert.ok(!formulaToRegex('[date:yyyy-mm]_[region|uae,ksa]').test('oct_uae'));
  const r = checkLink('https://acme.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring', { ...ws, rules: { ...ws.rules, campaignRegex: '^\\d{4}' } });
  assert.ok(codes(r).includes('campaign-pattern'));
  assert.ok(codes(r).includes('campaign-regex'));
});

test('Unassigned is critical with the reason', () => {
  const r = checkLink('https://acme.com/?utm_source=klaviyo&utm_medium=campaign&utm_campaign=2026-10_x', { name: 'x' });
  assert.equal(r.level, 'critical');
  assert.match(r.issues.find(i => i.code === 'ga4-unassigned').message, /no GA4 rule/);
});

test('untagged link to own domain warns; other untagged links pass', () => {
  assert.equal(checkLink('https://shop.acme.com/boots', ws).level, 'warning');
  const other = checkLink('https://example.org/', ws);
  assert.equal(other.level, 'pass');
  assert.equal(other.tagged, false);
});

test('domain outside the allowlist warns', () => {
  const r = checkLink('https://evil.com/?utm_source=google&utm_medium=cpc&utm_campaign=2026-10_x', ws);
  assert.ok(codes(r).includes('domain'));
});

test('merge tags are unverifiable, Meta macros are not', () => {
  assert.equal(checkLink('https://acme.com/?utm_source=newsletter&utm_medium=email&utm_campaign=*|CAMPAIGN|*', ws).level, 'unverifiable');
  assert.equal(checkLink('https://acme.com/?id={{ contact.id }}', ws).level, 'unverifiable');
  assert.notEqual(checkLink('https://acme.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}', ws).level, 'unverifiable');
});

test('wrapped links are unwrapped', () => {
  const inner = 'https://acme.com/?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_x';
  assert.equal(unwrap(`https://eur01.safelinks.protection.outlook.com/?url=${encodeURIComponent(inner)}&data=abc`).href, inner);
  assert.equal(unwrap(`https://www.google.com/url?q=${encodeURIComponent(inner)}&sa=D`).href, inner);
  const r = checkLink(`https://www.google.com/url?q=${encodeURIComponent(inner)}`, ws);
  assert.ok(codes(r).includes('wrapped'));
  assert.equal(r.channel, 'Email');
});

test('skips mailto, tel, anchors and relative links', () => {
  for (const h of ['mailto:a@b.c', 'tel:+1', '#top', '/relative', 'javascript:void(0)']) assert.equal(checkLink(h, ws).skipped, true, h);
});

test('extracts links from HTML and plain text', () => {
  const links = extractLinks('<p>Hi <a href="https://acme.com/?a=1&amp;b=2">Shop <b>now</b></a></p> also https://x.com/y. and (https://z.com/q)');
  assert.deepEqual(links, [
    { href: 'https://acme.com/?a=1&b=2', text: 'Shop now' },
    { href: 'https://x.com/y', text: '' },
    { href: 'https://z.com/q', text: '' },
  ]);
  assert.ok(looksLikeHtml('<a class="x" href="y">'));
});

test('duplicate links are merged and flagged', () => {
  const u = 'https://acme.com/?utm_source=google&utm_medium=cpc&utm_campaign=2026-10_x';
  const { results, summary } = checkLinks([u, u, 'https://acme.com/?utm_source=Google&utm_medium=cpc&utm_campaign=2026-10_x', 'mailto:x'], ws);
  assert.equal(results.length, 1);
  assert.equal(results[0].dupes, 3);
  assert.ok(results[0].issues.some(i => i.code === 'duplicate-link'));
  assert.equal(summary.skipped, 1);
});

test('fixHtml rewrites hrefs and keeps entities', () => {
  const html = '<a href="https://acme.com/?x=1&amp;utm_source=Newsletter&amp;utm_medium=email&amp;utm_campaign=2026-10_x">A</a><a href="mailto:a@b">m</a>';
  const r = fixHtml(html, ws);
  assert.equal(r.changed, 1);
  assert.equal(r.html, '<a href="https://acme.com/?x=1&amp;utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=2026-10_x">A</a><a href="mailto:a@b">m</a>');
});

test('2,000 links are graded inside the performance budget', () => {
  const links = Array.from({ length: 2000 }, (_, i) => `https://acme.com/p${i}?utm_source=Facebook&utm_medium=paid_social&utm_campaign=2026-10_c${i}`);
  const t = performance.now();
  const { results } = checkLinks(links, ws);
  const ms = performance.now() - t;
  assert.equal(results.length, 2000);
  assert.ok(ms < 1500, `took ${ms}ms`); // 300 ms target on a laptop; CI containers are slower
});
