import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BUILTIN_TEMPLATES } from '../src/lib/templates.js';
import { analyze, predictChannel } from '../src/lib/ga4.js';
import { buildUrl, parseUtm } from '../src/lib/url.js';
import { normalizeValue, validate, resolveVariables, assembleFormula, DEFAULT_RULES } from '../src/lib/rules.js';
import { parseCsv, rowsToObjects, parsePresetImport } from '../src/lib/csv.js';
import { auditGa4Export, cleanValuesFrom, cleanLinks, lintLinks } from '../src/lib/audit.js';
import { platformOutput, adobeCidUrl } from '../src/lib/platforms.js';
import { encodeWorkspace, decodeWorkspace, makeLock, checkPin, encodeRequest, decodeRequest } from '../src/lib/share.js';
import { qrSvg } from '../src/lib/qrstyle.js';

for (const t of BUILTIN_TEMPLATES) {
  test(`template "${t.name}" lands in ${t.channel} with no warnings`, () => {
    const a = analyze(t.values);
    assert.equal(a.channel, t.channel);
    assert.equal(a.level, 'ok', a.messages.join(' '));
    for (const v of Object.values(t.values)) assert.equal(normalizeValue(v), v, `"${v}" must survive normalisation`);
  });
}

test('GA4 extra params are emitted after the standard ones', () => {
  const r = buildUrl('https://a.com', { source: 'google', medium: 'cpc', source_platform: 'google_ads', creative_format: 'video', marketing_tactic: 'remarketing' });
  assert.equal(r.url, 'https://a.com/?utm_source=google&utm_medium=cpc&utm_source_platform=google_ads&utm_creative_format=video&utm_marketing_tactic=remarketing');
  assert.equal(parseUtm(r.url).marketing_tactic, 'remarketing');
});

test('campaign regex rule', () => {
  const ws = { name: 'Acme', rules: { ...DEFAULT_RULES, campaignRegex: '^\\d{4}-\\d{2}_' } };
  assert.ok(validate({ source: 'a', medium: 'b', campaign: 'spring' }, ws).some(i => i.field === 'campaign' && i.level === 'error'));
  assert.ok(!validate({ source: 'a', medium: 'b', campaign: '2026-10_spring' }, ws).some(i => i.field === 'campaign'));
  const bad = { name: 'X', rules: { ...DEFAULT_RULES, campaignRegex: '([' } };
  assert.ok(validate({ source: 'a', medium: 'b', campaign: 'x' }, bad).some(i => i.message.includes('not a valid')));
});

test('non-Latin: transliterate and block', () => {
  assert.equal(normalizeValue('عرض الشتاء', { ...DEFAULT_RULES, nonLatin: 'transliterate' }), 'ard-alshta');
  assert.equal(normalizeValue('Été Promo', { ...DEFAULT_RULES, nonLatin: 'transliterate' }), 'ete-promo');
  const ws = { name: 'GCC', rules: { ...DEFAULT_RULES, nonLatin: 'block' } };
  assert.ok(validate({ source: 'a', medium: 'b', campaign: 'عرض' }, ws).some(i => i.level === 'error' && i.field === 'campaign'));
  assert.ok(!validate({ source: 'a', medium: 'b', campaign: '{{campaign.name}}' }, ws).some(i => i.field === 'campaign'));
});

test('dynamic variables in fields and formulas', () => {
  const ctx = { page_title: 'Winter Boots Sale', domain: 'acme.com', path: 'boots', client: 'acme', user: 'sk', now: new Date(2026, 9, 15) };
  assert.equal(resolveVariables('[client]_[date:yyyymm]', ctx), 'acme_202610');
  assert.equal(assembleFormula('[date:yyyy]_[page_title]_[region]', { region: 'UAE' }, DEFAULT_RULES, ctx.now, ctx), '2026_winter-boots-sale_uae');
});

test('CSV parsing: delimiters, quotes, GA4 comments', () => {
  const rows = parseCsv('# comment\nurl;source;medium\n"https://a.com/?x=1;2";fb;cpc\n');
  assert.deepEqual(rows, [['url', 'source', 'medium'], ['https://a.com/?x=1;2', 'fb', 'cpc']]);
  const objs = rowsToObjects(parseCsv('Landing Page,UTM_Source,utm_medium,Campaign\nhttps://a.com,Facebook,paid_social,Q4'));
  assert.deepEqual(objs[0], { url: 'https://a.com', source: 'Facebook', medium: 'paid_social', campaign: 'Q4' });
  const headerless = rowsToObjects(parseCsv('https://a.com,google,cpc,q4'));
  assert.equal(headerless[0].medium, 'cpc');
});

test('preset import from JSON and CSV', () => {
  const json = parsePresetImport(JSON.stringify({ presets: [{ name: 'FB', group: 'Acme', tags: { utm_source: 'facebook', utm_medium: 'cpc' } }] }));
  assert.deepEqual(json, [{ name: 'FB', group: 'Acme', values: { source: 'facebook', medium: 'cpc' } }]);
  const csv = parsePresetImport('Template Name,Source,Medium\nNewsletter,newsletter,email');
  assert.equal(csv[0].name, 'Newsletter');
  assert.equal(csv[0].values.medium, 'email');
});

test('GA4 export audit', () => {
  const csv = `# Traffic acquisition
# Start date: 20260901
Session source / medium,Sessions,Engaged sessions
google / organic,5000,3000
meta / paid_social,1200,400
facebook / fb_ads,300,100
partner / banner_ads,250,50
(direct) / (none),900,500
Grand total,7650,4050`;
  const r = auditGa4Export(csv);
  assert.equal(r.combos.length, 5);
  assert.equal(r.total, 7650);
  assert.equal(r.unassignedSessions, 250);
  const meta = r.combos.find(c => c.source === 'meta');
  assert.equal(meta.channel, 'Paid Other');
  assert.equal(meta.level, 'warn');
  assert.equal(r.combos.find(c => c.source === '(direct)').level, 'ok');
  const clean = cleanValuesFrom(r.combos);
  assert.deepEqual(clean, { sources: ['google'], mediums: ['organic'] });
});

test('UTM cleaner normalises, strips and dedupes', () => {
  const r = cleanLinks('https://a.com/?utm_source=Facebook&utm_medium=CPC&fbclid=1\nhttps://a.com/?utm_source=facebook&utm_medium=cpc, junk https://b.com/x');
  assert.equal(r.rows.length, 3);
  assert.equal(r.rows[0].url, 'https://a.com/?utm_source=facebook&utm_medium=cpc');
  assert.deepEqual(r.rows[0].changed.sort(), ['medium', 'source']);
  assert.deepEqual(r.rows[0].removed, ['fbclid']);
  assert.equal(r.duplicates, 1);
  assert.equal(r.unique.length, 2);
});

test('linter grades tagged links and counts untagged', () => {
  const ws = { name: 'Acme', rules: { ...DEFAULT_RULES, required: ['source', 'medium', 'campaign'] } };
  const r = lintLinks(
    [
      { href: 'https://a.com/?utm_source=Facebook&utm_medium=fb_ads&utm_campaign=q4', text: 'Shop' },
      { href: 'https://a.com/?utm_source=newsletter&utm_medium=email&utm_campaign=oct' },
      'https://a.com/about',
      'mailto:x@y.z',
    ],
    ws
  );
  assert.equal(r.tagged, 2);
  assert.equal(r.untagged, 1);
  assert.equal(r.withProblems, 1);
  assert.ok(r.results[0].problems.some(p => p.includes('utm_source')));
});

test('platform outputs', () => {
  const res = buildUrl('https://a.com/p?x=1', { source: 'facebook', medium: 'paid_social', campaign: '{{campaign.name}}' });
  assert.equal(platformOutput('meta', res).text, 'utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}');
  assert.equal(platformOutput('googleTemplate', res).text, '{lpurl}?utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}');
  assert.equal(platformOutput('googleSuffix', res).warning, '');
  assert.equal(platformOutput('linkedin', res).text, res.url);
});

test('Adobe cid url', () => {
  const r = adobeCidUrl('https://a.com/?fbclid=1', { source: 'facebook', medium: 'paid_social', campaign: 'q4 launch' });
  assert.equal(r.url, 'https://a.com/?cid=facebook%3Apaid_social%3Aq4%20launch');
  assert.equal(r.cid, 'facebook:paid_social:q4 launch');
});

test('workspace share code round-trips without secrets', async () => {
  const ws = { id: 'w1', name: 'Acme', sources: ['facebook'], shortener: { provider: 'bitly', token: 'SECRET' }, webhook: { url: 'https://hooks.x/y', format: 'json' } };
  const code = await encodeWorkspace(ws);
  assert.match(code, /^UTMG1\./);
  const back = await decodeWorkspace(code);
  assert.equal(back.name, 'Acme');
  assert.equal(back.shortener.token, '');
  assert.equal(back.webhook.url, '');
  await assert.rejects(decodeWorkspace('nope'));
});

test('admin PIN lock', async () => {
  const lock = await makeLock('4321');
  assert.equal(await checkPin(lock, '4321'), true);
  assert.equal(await checkPin(lock, '0000'), false);
  assert.equal(await checkPin(null, ''), true);
});

test('approval request round-trip', () => {
  const code = encodeRequest({ workspaceId: 'w1', field: 'medium', value: 'paid_video', by: 'sk', reason: 'YouTube' });
  assert.equal(decodeRequest(code).value, 'paid_video');
  assert.throws(() => decodeRequest('x'));
});

test('styled QR svg contains colours, caption and logo', () => {
  const svg = qrSvg('https://a.com', { fg: '#123456', bg: '#fafafa', dots: 'round', logo: 'data:image/png;base64,AAAA', caption: 'Scan me' });
  assert.match(svg, /fill="#123456"/);
  assert.match(svg, /<circle/);
  assert.match(svg, /Scan me/);
  assert.match(svg, /<image href="data:image\/png/);
});

test('predictor sanity for templates sources', () => {
  assert.equal(predictChannel({ source: 'snapchat', medium: 'paid_social' }), 'Paid Social');
});

test('CSV headers with spaces or dashes map to UTM fields', () => {
  const o = rowsToObjects(parseCsv('Landing Page,UTM Source,utm-medium\nhttps://a.com,Facebook,cpc'))[0];
  assert.equal(o.source, 'Facebook');
  assert.equal(o.medium, 'cpc');
});
