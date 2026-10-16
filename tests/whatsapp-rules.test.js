import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildWhatsApp, normalizeNumber, defaultCountry } from '../src/lib/whatsapp.js';
import { toRulesFile, fromRulesFile, formulaToPattern, patternToFormula, diffRules } from '../src/lib/rulesfile.js';
import { DEFAULT_RULES } from '../src/lib/rules.js';
import { defaultWorkspace } from '../src/lib/storage.js';

test('normalises phone numbers to digits', () => {
  assert.equal(normalizeNumber('+44 (0)7700 900123', '44').digits, '447700900123');
  assert.equal(normalizeNumber('07700 900123', '44').digits, '447700900123');
  assert.equal(normalizeNumber('0044 7700 900123', '91').digits, '447700900123');
  assert.equal(normalizeNumber('98765 43210', '91').digits, '919876543210');
  assert.equal(normalizeNumber('919876543210', '91').digits, '919876543210');
  assert.ok(normalizeNumber('123', '91').warning);
  assert.equal(normalizeNumber('', '91').digits, '');
});

test('builds a wa.me link with a tagged landing link inside the message', () => {
  const r = buildWhatsApp({
    country: '44',
    number: '+44 (0)7700 900123',
    message: 'Hi! See the new boots: {link}',
    landing: 'https://acme.com/boots?fbclid=1',
    utm: { source: 'whatsapp', medium: 'social', campaign: 'boots' },
    ref: 'WA-BOOTS',
  });
  assert.equal(r.digits, '447700900123');
  assert.ok(r.url.startsWith('https://wa.me/447700900123?text='));
  const text = decodeURIComponent(r.url.split('text=')[1]);
  assert.equal(text, 'Hi! See the new boots: https://acme.com/boots?utm_source=whatsapp&utm_medium=social&utm_campaign=boots\nRef: WA-BOOTS');
  assert.equal(r.ga4.channel, 'Organic Social');
  assert.deepEqual(r.warnings, []);
});

test('appends the link when there is no placeholder; no number lets people choose', () => {
  const r = buildWhatsApp({ message: 'Hello', landing: 'https://acme.com', utm: { source: 'whatsapp', medium: 'social' } });
  assert.equal(r.url, `https://wa.me/?text=${encodeURIComponent('Hello\nhttps://acme.com/?utm_source=whatsapp&utm_medium=social')}`);
  assert.equal(buildWhatsApp({ country: '91', number: '9876543210' }).url, 'https://wa.me/919876543210');
});

test('long message warns', () => {
  assert.ok(buildWhatsApp({ number: '+919876543210', message: 'x'.repeat(2100) }).warnings.length);
});

test('default country follows browser region, India otherwise', () => {
  assert.equal(defaultCountry(['en-GB']), '44');
  assert.equal(defaultCountry(['ar-AE', 'en']), '971');
  assert.equal(defaultCountry(['en']), '91');
});

test('pattern syntax converts both ways', () => {
  assert.equal(formulaToPattern('[date:yyyy-mm]_[product]_[region|uae,ksa]'), '{yyyy}-{mm}_{product}_{region|uae,ksa}');
  assert.equal(patternToFormula('{yyyy}-{mm}_{product}_{region|uae,ksa}'), '[date:yyyy]-[date:mm]_[product]_[region|uae,ksa]');
  assert.equal(patternToFormula('{date:yyyy-mm}_{page_title}'), '[date:yyyy-mm]_[page_title]');
});

test('rules file round-trips', () => {
  const ws = {
    ...defaultWorkspace('Acme'),
    rules: { ...DEFAULT_RULES, lockMediums: true, campaignRegex: '^\\d{4}', nonLatin: 'transliterate' },
    sources: ['facebook', 'google'],
    mediums: ['cpc'],
    labels: { facebook: 'Meta – Facebook' },
    domains: ['acme.com'],
    campaignFormula: '[date:yyyy-mm]_[product]',
    extraParams: [{ key: 'ref', value: 'p' }],
  };
  const file = toRulesFile(ws);
  assert.equal(file.type, 'tgf.utm-rules');
  assert.equal(file.campaign.pattern, '{yyyy}-{mm}_{product}');
  const back = fromRulesFile(JSON.stringify(file));
  assert.equal(back.name, 'Acme');
  assert.deepEqual(back.patch.sources, ws.sources);
  assert.deepEqual(back.patch.labels, ws.labels);
  assert.equal(back.patch.rules.lockMediums, true);
  assert.equal(back.patch.rules.campaignRegex, '^\\d{4}');
  assert.equal(back.patch.rules.nonLatin, 'transliterate');
  assert.equal(back.patch.campaignFormula, '[date:yyyy]-[date:mm]_[product]');
  assert.deepEqual(diffRules({ ...ws, campaignFormula: back.patch.campaignFormula }, back.patch), []);
});

test('rules file validation', () => {
  assert.throws(() => fromRulesFile('nope'), /valid JSON/);
  assert.throws(() => fromRulesFile('{"type":"x","version":1,"name":"a"}'), /isn’t a UTM rules file/);
  assert.throws(() => fromRulesFile('{"type":"tgf.utm-rules","version":2,"name":"a"}'), /newer version/);
  const r = fromRulesFile('{"type":"tgf.utm-rules","version":1,"name":"A","casing":"SHOUT","sources":{"values":["Facebook"," "]},"campaign":{"regex":"(["},"extra":1}');
  assert.deepEqual(r.ignored, ['casing']);
  assert.deepEqual(r.unknown, ['extra']);
  assert.deepEqual(r.patch.sources, ['facebook']);
  assert.equal(r.warnings.length, 1);
});

test('diffRules lists changes', () => {
  const ws = defaultWorkspace('A');
  const { patch } = fromRulesFile(JSON.stringify({ type: 'tgf.utm-rules', version: 1, name: 'A', sources: { values: ['google', 'meta'], locked: true } }));
  const d = diffRules(ws, patch);
  assert.ok(d.some(x => x.startsWith('Lock sources')));
  assert.ok(d.some(x => x.includes('+meta')));
});
