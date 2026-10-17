// Playwright tests with the unpacked extension (npm run test:e2e).
// A temporary copy of the extension gets host access to the local fixture
// server, so page scanning can be tested without a permission prompt.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PW = process.env.PLAYWRIGHT_MODULE || '/opt/node-tools/node_modules/playwright/index.mjs';
const CHROMIUM = process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium';
const { chromium } = await import(PW);

let server, base, extDir, ctx, extId;

before(async () => {
  server = createServer((req, res) => {
    const file = path.join(ROOT, 'tests/e2e/fixtures', path.basename(new URL(req.url, 'http://x').pathname));
    let body;
    try {
      body = readFileSync(file);
    } catch {
      return res.writeHead(404).end('not found');
    }
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(body);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  base = `http://127.0.0.1:${server.address().port}`;

  extDir = mkdtempSync(path.join(tmpdir(), 'utm-ext-'));
  for (const p of ['manifest.json', 'src', 'icons']) cpSync(path.join(ROOT, p), path.join(extDir, p), { recursive: true });
  const m = JSON.parse(readFileSync(path.join(extDir, 'manifest.json')));
  m.host_permissions = ['http://127.0.0.1/*'];
  writeFileSync(path.join(extDir, 'manifest.json'), JSON.stringify(m));

  ctx = await chromium.launchPersistentContext('', {
    headless: true,
    executablePath: CHROMIUM,
    args: [`--disable-extensions-except=${extDir}`, `--load-extension=${extDir}`, '--headless=new'],
    viewport: { width: 440, height: 1200 },
  });
  let [sw] = ctx.serviceWorkers();
  if (!sw) sw = await ctx.waitForEvent('serviceworker');
  extId = sw.url().split('/')[2];
});

after(async () => {
  await ctx?.close();
  server?.close();
  if (extDir) rmSync(extDir, { recursive: true, force: true });
});

async function openPanel({ activeTabUrl } = {}) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  if (activeTabUrl) {
    // The panel runs in its own tab here, so point "the active tab" at the fixture page.
    await page.addInitScript(url => {
      const orig = chrome.tabs.query.bind(chrome.tabs);
      chrome.tabs.query = async q => (q?.active ? orig({ url }) : orig(q));
    }, activeTabUrl);
  }
  await page.addInitScript(() => {
    window.__clip = [];
    navigator.clipboard.writeText = t => (window.__clip.push(t), Promise.resolve());
  });
  await page.goto(`chrome-extension://${extId}/src/panel/panel.html`);
  await page.waitForTimeout(400);
  return { page, errors, clip: () => page.evaluate(() => window.__clip.at(-1)) };
}

test('renamed UI loads without errors', async () => {
  const { page, errors } = await openPanel();
  assert.equal(await page.title(), 'UTM Builder & Checker for GA4');
  assert.equal(await page.textContent('.product'), 'UTM Builder & Checker');
  assert.deepEqual(errors, []);
  await page.close();
});

test('Build shows the GA4 channel and why', async () => {
  const { page } = await openPanel();
  await page.fill('#url', 'https://acme.com/');
  await page.fill('#f-source', 'meta');
  await page.fill('#f-medium', 'cpc');
  assert.match(await page.textContent('#ga4Pill'), /Paid Other/);
  assert.match(await page.textContent('#ga4Why'), /isn't on any of Google's/);
  await page.close();
});

test('Check: this page finds and grades links, Locate works', async () => {
  const fixture = `${base}/campaign-page.html`;
  const site = await ctx.newPage();
  await site.goto(fixture);
  const { page, errors } = await openPanel({ activeTabUrl: fixture });
  await page.click('[data-tab=check]');
  await page.click('#k-page');
  await page.waitForSelector('#k-list li');
  const summary = await page.textContent('#k-summary');
  assert.match(summary, /5 links/);
  assert.match(summary, /1 skipped/);
  assert.match(summary, /2 critical/); // # fragment + missing campaign
  assert.match(summary, /1 warning\b/); // utm_source=meta → Paid Other
  const cards = await page.$$eval('#k-list > li', ls => ls.map(l => ({ level: l.className, text: l.textContent })));
  const by = t => cards.find(c => c.text.includes(t));
  assert.equal(by('Hash link').level, 'critical');
  assert.equal(by('Missing campaign').level, 'critical');
  assert.equal(by('Clean link').level, 'pass');
  assert.match(by('Meta link').text, /Use "facebook"|isn’t on Google|Paid Other/);
  await page.click('#k-list > li:has-text("Hash link") button:has-text("Copy fixed link")');
  assert.equal(await page.evaluate(() => window.__clip.at(-1)), 'https://acme.com/jackets?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10_jackets');
  await page.click('#k-list > li:has-text("Clean link") button:has-text("Locate")');
  await site.waitForTimeout(300);
  assert.match(await site.$eval('#ok', a => a.style.outline), /solid/);
  assert.deepEqual(errors, []);
  await page.close();
  await site.close();
});

test('Check: paste email HTML and copy the fixed HTML', async () => {
  const { page, clip } = await openPanel();
  await page.click('[data-tab=check]');
  await page.click('[data-csrc=paste]');
  const html = '<p><a href="https://acme.com/?utm_source=Newsletter&amp;utm_medium=Email&amp;utm_campaign=Oct%20Sale&amp;fbclid=1">Shop</a> <a href="https://acme.com/?utm_source=klaviyo&amp;utm_medium=campaign&amp;utm_campaign=oct">B</a> <a href="https://acme.com/?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=*|CAMPAIGN|*">C</a></p>';
  await page.fill('#k-paste', html);
  await page.click('#k-pasteGo');
  await page.waitForSelector('#k-list li');
  const summary = await page.textContent('#k-summary');
  assert.match(summary, /3 links/);
  assert.match(summary, /1 unverifiable/);
  await page.click('#k-menu summary');
  await page.click('#k-copyHtml');
  const fixed = await clip();
  assert.match(fixed, /utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=oct-sale"/);
  assert.ok(!fixed.includes('fbclid'));
  await page.close();
});

test('WhatsApp builder makes a wa.me link with the tagged website link inside', async () => {
  const { page, clip, errors } = await openPanel();
  await page.click('[data-tab=whatsapp]');
  await page.selectOption('#w-country', '44');
  await page.fill('#w-number', '+44 (0)7700 900123');
  await page.fill('#w-message', 'Hi! See the boots: {link}');
  await page.fill('#w-landing', 'https://acme.com/boots');
  await page.fill('#w-campaign', 'Boots Oct');
  await page.fill('#w-ref', 'WA-BOOTS');
  const url = await page.inputValue('#w-out');
  assert.ok(url.startsWith('https://wa.me/447700900123?text='));
  assert.equal(decodeURIComponent(url.split('text=')[1]), 'Hi! See the boots: https://acme.com/boots?utm_source=whatsapp&utm_medium=social&utm_campaign=boots-oct\nRef: WA-BOOTS');
  assert.match(await page.textContent('#w-ga4Pill'), /Organic Social/);
  await page.click('#w-copy');
  assert.equal(await clip(), url);
  await page.click('#w-qrBtn');
  assert.ok(await page.isVisible('#w-qrCanvas'));
  assert.deepEqual(errors, []);
  await page.close();
});

test('Settings: rules file export, then import shows changes and applies', async () => {
  const opt = await ctx.newPage();
  const errors = [];
  opt.on('pageerror', e => errors.push(e.message));
  await opt.goto(`chrome-extension://${extId}/src/options/options.html`);
  await opt.waitForTimeout(300);
  assert.match(await opt.textContent('#rulesAsOf'), /13 May 2026/);
  // Free: exporting a rules file is Pro, with an upgrade link to the pricing page.
  assert.equal(await opt.textContent('#planName'), 'Free');
  await opt.click('#rulesExport');
  assert.match(await opt.textContent('#rulesStatus'), /part of Pro/);
  assert.match(await opt.getAttribute('#rulesStatus a.upgrade', 'href'), /\/tools\/utm-builder\/pricing\/\?.*utm_content=rules-export/);
  // Pro: a validated licence in storage (what activateLicense saves after Dodo says yes).
  await opt.evaluate(() => chrome.storage.local.set({ license: { key: 'TGF-TEST-UTM-PRO-0001', instanceId: 'lki_test', plan: 'pro', activatedPlan: 'pro', valid: true, status: 'active', productName: 'UTM Builder & Checker Pro (Monthly)', validatedAt: Date.now(), checkedAt: Date.now() } }));
  await opt.reload();
  await opt.waitForTimeout(300);
  assert.equal(await opt.textContent('#planName'), 'Pro');
  assert.match(await opt.textContent('#licStatus'), /Active: UTM Builder & Checker Pro/);
  const [dl] = await Promise.all([opt.waitForEvent('download'), opt.click('#rulesExport')]);
  const file = JSON.parse(readFileSync(await dl.path(), 'utf8'));
  assert.equal(file.type, 'tgf.utm-rules');
  file.mediums = { values: ['cpc', 'email'], locked: true, labels: {} };
  file.campaign = { pattern: '{yyyy}-{mm}_{product}', regex: '' };
  const tmp = path.join(extDir, 'rules-in.json');
  writeFileSync(tmp, JSON.stringify(file));
  await opt.setInputFiles('#rulesFile', tmp);
  await opt.waitForSelector('#rulesPreview:not([hidden])');
  const changes = await opt.textContent('#rulesChanges');
  assert.match(changes, /Lock mediums/);
  assert.match(changes, /Campaign formula/);
  await opt.click('#rulesApply');
  await opt.waitForTimeout(300);
  const stored = await opt.evaluate(async () => (await chrome.storage.local.get('workspaces')).workspaces[0]);
  assert.deepEqual(stored.mediums, ['cpc', 'email']);
  assert.equal(stored.rules.lockMediums, true);
  assert.equal(stored.campaignFormula, '[date:yyyy]-[date:mm]_[product]');
  assert.deepEqual(errors, []);
  await opt.evaluate(() => chrome.storage.local.remove('license'));
  await opt.close();
});

test('Free plan: bulk shows the first 10 links, email draft check asks for Pro', async () => {
  const { page, errors } = await openPanel();
  await page.click('[data-tab="bulk"]');
  await page.fill('#b-urls', 'https://acme.com/a\nhttps://acme.com/b\nhttps://acme.com/c');
  await page.fill('#b-source', 'google\nfacebook\nnewsletter\nlinkedin');
  await page.fill('#b-medium', 'cpc');
  await page.fill('#b-campaign', 'spring');
  await page.click('#b-go');
  await page.waitForSelector('#b-result:not([hidden])');
  assert.match(await page.textContent('#b-count'), /first 10 of 12/);
  assert.equal(await page.locator('#b-table tr').count(), 11, 'header + 10 rows');
  await page.click('[data-tab="check"]');
  assert.equal(await page.textContent('[data-csrc="email"]'), 'Email draft (Pro)');
  await page.click('[data-csrc="email"]');
  await page.click('#k-email');
  assert.match(await page.textContent('#k-summary'), /part of Pro/);
  assert.deepEqual(errors, []);
  await page.close();
});
