// Free vs Pro. The plan comes from a validated licence key (license.js) or, for installs from the free launch,
// the launch offer. Free keeps building, checking pages and pasted email HTML, WhatsApp links and QR codes.
// Pro adds what teams and agencies need: many client workspaces, sharing rules, email draft checks, big bulk runs
// and webhooks.
import { LICENSE_CONFIG } from './license-config.js';
import { getLicense, planFromLicense } from './license.js';

export const LIMITS = {
  free: { workspaces: 1, bulkRows: 10, emailDraft: false, webhook: false, teamShare: false },
  pro: { workspaces: Infinity, bulkRows: Infinity, emailDraft: true, webhook: true, teamShare: true },
};

const vnum = v => String(v).split('.').map(Number).reduce((n, x, i) => n + (x || 0) * 1000 ** (2 - i), 0);

// background.js records installedVersion on install, and "<=x" for updates from a version before the paid build.
export function isLaunchUser(installedVersion, cfg = LICENSE_CONFIG) {
  if (!installedVersion) return false;
  if (String(installedVersion).startsWith('<=')) return true;
  return vnum(installedVersion) < vnum(cfg.paidSinceVersion || '0');
}

export function launchProActive(installedVersion, cfg = LICENSE_CONFIG, now = Date.now()) {
  if (!cfg.launchUsersProUntil || !isLaunchUser(installedVersion, cfg)) return false;
  return now < Date.parse(`${cfg.launchUsersProUntil}T23:59:59Z`);
}

export async function getPlan(cfg = LICENSE_CONFIG) {
  if (cfg.allFree) return 'pro';
  if (!cfg.enabled) return 'free';
  if (planFromLicense(await getLicense(), Date.now(), cfg) === 'pro') return 'pro';
  const { installedVersion } = await chrome.storage.local.get('installedVersion');
  return launchProActive(installedVersion, cfg) ? 'pro' : 'free';
}

export async function getLimits(cfg = LICENSE_CONFIG) {
  return LIMITS[await getPlan(cfg)];
}

export const planLabel = plan => (plan === 'pro' ? 'Pro' : 'Free');

// Pricing page link for an upgrade prompt. `where` names the prompt (utm_content) so analytics show which limit
// sold the upgrade.
export function upgradeUrl(where, cfg = LICENSE_CONFIG) {
  const u = new URL(cfg.checkoutUrl);
  u.searchParams.set('utm_source', 'chrome-extension');
  u.searchParams.set('utm_medium', 'upgrade');
  u.searchParams.set('utm_campaign', cfg.extension);
  if (where) u.searchParams.set('utm_content', where);
  return u.toString();
}

// Appends " Upgrade to Pro" as a link after el's text. DOM nodes, not HTML.
export function appendUpgrade(el, where, label = 'Upgrade to Pro') {
  el.querySelector('.upgrade')?.remove();
  const a = Object.assign(document.createElement('a'), { className: 'upgrade', href: upgradeUrl(where), target: '_blank', rel: 'noopener', textContent: label });
  el.append(' ', a);
}
