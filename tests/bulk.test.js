import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildMatrix, tagHtml, lines } from '../src/lib/bulk.js';
import { toTsv, toCsv } from '../src/lib/export.js';

test('matrix multiplies every axis', () => {
  const { rows } = buildMatrix({
    urls: ['https://a.com/1', 'https://a.com/2'],
    source: ['facebook', 'google', 'tiktok'],
    medium: ['cpc', 'video'],
    campaign: ['Q4 Launch'],
  });
  assert.equal(rows.length, 12);
  assert.equal(rows[0].url, 'https://a.com/1?utm_source=facebook&utm_medium=cpc&utm_campaign=q4-launch');
  assert.equal(rows[0].channel, 'Paid Social');
});

test('matrix enforces limit', () => {
  const many = Array.from({ length: 100 }, (_, i) => `s${i}`);
  const r = buildMatrix({ urls: many.map(s => `https://a.com/${s}`), source: many, medium: ['a'] });
  assert.ok(r.error);
});

test('lines splits newlines and commas', () => {
  assert.deepEqual(lines('a, b\n\nc'), ['a', 'b', 'c']);
});

test('tags only matching http links in email html', () => {
  const html = `<a href="https://acme.com/p?x=1&amp;y=2">A</a>
<a href='https://other.com'>B</a>
<a href="mailto:a@b.com">C</a>
<a href="*|UNSUB|*">D</a>
<a class="btn" href="https://www.acme.com/#top">E</a>`;
  const r = tagHtml(html, { source: 'newsletter', medium: 'email', campaign: 'oct' }, { domains: ['acme.com'] });
  assert.equal(r.tagged, 2);
  assert.match(r.html, /href="https:\/\/acme\.com\/p\?x=1&amp;y=2&amp;utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=oct"/);
  assert.match(r.html, /href="https:\/\/www\.acme\.com\/\?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=oct#top"/);
  assert.match(r.html, /href='https:\/\/other\.com'/);
  assert.match(r.html, /\*\|UNSUB\|\*/);
});

test('tsv and csv exports', () => {
  const link = { createdAt: Date.UTC(2026, 9, 14), destination: 'https://a.com', source: 'fb', medium: 'cpc', campaign: '=cmd', url: 'https://a.com/?x' };
  const tsv = toTsv([link]);
  assert.equal(tsv.split('\n').length, 2);
  assert.equal(tsv.split('\n')[1].split('\t').length, 12);
  assert.match(toCsv([link]), /'=cmd/);
});

test('matrix flags paid-looking mediums that GA4 counts as organic', () => {
  const { rows } = buildMatrix({ urls: ['https://a.com'], source: ['facebook'], medium: ['banner_ads', 'cpc'] });
  assert.equal(rows[0].channel, 'Organic Social');
  assert.equal(rows[0].level, 'warn');
  assert.equal(rows[1].level, 'ok');
});
