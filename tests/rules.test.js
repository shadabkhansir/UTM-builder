import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeValue, validate, assembleFormula, formulaFields, formatDate, DEFAULT_RULES } from '../src/lib/rules.js';

test('normalises case, spaces and junk but not macros', () => {
  assert.equal(normalizeValue('  Winter Boots  Sale!! '), 'winter-boots-sale');
  assert.equal(normalizeValue('Q4 __CAMPAIGN_NAME__'), 'q4-__CAMPAIGN_NAME__');
  assert.equal(normalizeValue('{{Campaign.Name}}'), '{{Campaign.Name}}');
  assert.equal(normalizeValue('Facebook', { ...DEFAULT_RULES, lowercase: false }), 'Facebook');
  assert.equal(normalizeValue('a b', { ...DEFAULT_RULES, spaceReplacement: '_' }), 'a_b');
});

test('validate enforces required, locked lists and domains', () => {
  const ws = { name: 'Acme', rules: { ...DEFAULT_RULES, lockMediums: true }, mediums: ['cpc'], domains: ['acme.com'] };
  const issues = validate({ source: 'Facebook', medium: 'fb_ads' }, ws, 'https://evil.com/x');
  const msgs = issues.map(i => `${i.level}:${i.field}`);
  assert.ok(msgs.includes('error:campaign'));
  assert.ok(msgs.includes('error:medium'));
  assert.ok(msgs.includes('warn:source'));
  assert.ok(msgs.includes('warn:url'));
  assert.equal(validate({ source: 'a', medium: 'cpc', campaign: 'c' }, ws, 'https://shop.acme.com').length, 0);
});

test('campaign formula assembles', () => {
  const f = '[date:yyyy-mm]_[product]_[region|uae,ksa]_[objective]';
  assert.deepEqual(formulaFields(f).map(p => p.name), ['product', 'region', 'objective']);
  assert.deepEqual(formulaFields(f)[1].options, ['uae', 'ksa']);
  const out = assembleFormula(f, { product: 'Winter Boots', region: 'UAE', objective: 'Conversions' }, DEFAULT_RULES, new Date(2026, 9, 5));
  assert.equal(out, '2026-10_winter-boots_uae_conversions');
  assert.equal(assembleFormula(f, { product: 'x' }, DEFAULT_RULES, new Date(2026, 9, 5)), '2026-10_x');
});

test('date tokens', () => {
  const d = new Date(2026, 0, 1);
  assert.equal(formatDate(d, 'yyyymmdd'), '20260101');
  assert.equal(formatDate(d, 'yy_q'), '26_q1');
  assert.equal(formatDate(d, 'yyyy-ww'), '2026-01');
});
