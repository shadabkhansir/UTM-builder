import { test } from 'node:test';
import assert from 'node:assert/strict';

function stubChrome(stored = {}) {
  globalThis.chrome = {
    storage: { local: { get: async k => ({ [k]: stored[k] }), set: async o => Object.assign(stored, o), remove: async () => {} } },
    runtime: { getManifest: () => ({ version: '0.4.0' }) },
  };
}
stubChrome();
const { LIMITS, isLaunchUser, launchProActive, getPlan, upgradeUrl } = await import('../src/lib/plan.js');
const { LICENSE_CONFIG: c } = await import('../src/lib/license-config.js');
const { entitlementFor } = await import('../src/lib/license.js');
const { handleSiteMessage } = await import('../src/lib/site-activate.js');

test('paid build: licensing on, Dodo IDs filled in for the selected mode', () => {
  assert.equal(c.allFree, false);
  assert.equal(c.enabled, true);
  assert.equal(c.extension, 'utm-builder');
  assert.match(c.storeId || '', /^bus_/, `storeId missing for mode ${c.mode}`);
  assert.ok(Object.keys(c.products).length >= 2);
  assert.match(c.manageUrl || '', /^https:\/\/(test\.)?customer\.dodopayments\.com\/login\/bus_/);
  assert.equal(c.paidSinceVersion, '0.4.0');
});

test('free keeps one workspace and 10 bulk rows; Pro removes the limits', () => {
  assert.deepEqual(LIMITS.free, { workspaces: 1, bulkRows: 10, emailDraft: false, webhook: false, teamShare: false });
  assert.equal(LIMITS.pro.workspaces, Infinity);
  assert.equal(LIMITS.pro.emailDraft, true);
});

test('only this extension and the All-Access bundle unlock Pro', () => {
  const [monthly] = Object.keys(c.products);
  const [bundle] = Object.keys(c.bundleProducts);
  assert.equal(entitlementFor({ storeId: c.storeId, productId: monthly }, c), 'pro');
  assert.equal(entitlementFor({ storeId: c.storeId, productId: bundle }, c), 'pro');
  assert.equal(entitlementFor({ storeId: c.storeId, productId: 'pdt_0Npxkz5LBfgbvi5QHUQOk' }, c), null, 'Pixel & Tag Checker key');
  assert.equal(entitlementFor({ storeId: 'bus_someone_else', productId: monthly }, c), null);
});

test('v0.3 installs keep Pro until the cut-off; new installs do not', () => {
  const cfg = { launchUsersProUntil: '2027-01-31', paidSinceVersion: '0.4.0' };
  assert.equal(isLaunchUser('<=0.3.0', cfg), true);
  assert.equal(isLaunchUser('0.3.0', cfg), true);
  assert.equal(isLaunchUser('0.4.0', cfg), false);
  assert.equal(isLaunchUser('0.10.0', cfg), false);
  assert.equal(launchProActive('<=0.3.0', cfg, Date.parse('2027-01-31T22:00:00Z')), true);
  assert.equal(launchProActive('<=0.3.0', cfg, Date.parse('2027-02-01T00:00:01Z')), false);
});

test('getPlan: free without a key, Pro for a launch user', async () => {
  const cfg = { ...c, launchUsersProUntil: '2999-01-01' };
  stubChrome({});
  assert.equal(await getPlan(cfg), 'free');
  stubChrome({ installedVersion: '<=0.3.0' });
  assert.equal(await getPlan(cfg), 'pro');
  assert.equal(await getPlan({ ...cfg, allFree: true }), 'pro');
});

test('upgrade links go to the pricing page with the prompt in utm_content', () => {
  const u = new URL(upgradeUrl('bulk-limit'));
  assert.equal(u.pathname, '/tools/utm-builder/pricing/');
  assert.equal(u.searchParams.get('utm_content'), 'bulk-limit');
  assert.equal(u.searchParams.get('utm_medium'), 'upgrade');
});

test('thank-you page messages: only thegrowthfolks.com, only ping and activate', async () => {
  stubChrome();
  const calls = [];
  const deps = { activate: async k => { calls.push(k); return { ok: true, state: { plan: 'pro' } }; }, getPlan: async () => 'free' };
  assert.equal((await handleSiteMessage({ type: 'tgf-activate', key: 'K' }, { origin: 'https://evil.example' }, deps)).ok, false);
  assert.deepEqual(await handleSiteMessage({ type: 'tgf-activate', key: ' K1 ' }, { origin: 'https://thegrowthfolks.com' }, deps), { ok: true, version: '0.4.0', plan: 'pro' });
  assert.deepEqual(calls, ['K1']);
});
