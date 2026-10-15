// Regenerates the Chrome Web Store graphics in store/ from the extension's
// real UI. Run from the repo root:
//   node store/make-graphics.mjs
// Uses Playwright's Chromium. Set PLAYWRIGHT_MODULE to point at a playwright
// install if it isn't resolvable (default: /opt/node22/lib/node_modules/playwright/index.mjs).
//
// How it works: the panel/options HTML is served from disk on a fake origin,
// a small stub stands in for the chrome.* APIs (seeded with realistic sample
// data), the UI is screenshotted, and each capture is placed on a branded
// 1280x800 canvas with a benefit headline.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'store');
const ORIGIN = 'http://ext.test';
const PW = process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);

const BRAND = { green: '#1f6b4f', ink: '#16181d', paper: '#fbfaf7', accent: '#f2a541' };
const FONT = `Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

// ---------- sample data ----------

const DAY = 86400000;
const NOW = Date.parse('2026-10-14T10:00:00Z');

const acme = {
  id: 'ws-acme',
  name: 'Acme Outdoor (client)',
  rules: {
    lowercase: true, spaceReplacement: '-', stripSpecial: true,
    lockSources: false, lockMediums: true, required: ['source', 'medium', 'campaign'],
  },
  sources: ['google', 'facebook', 'instagram', 'linkedin', 'tiktok', 'youtube', 'bing', 'email'],
  mediums: ['cpc', 'paid_social', 'display', 'email', 'social', 'referral', 'video'],
  domains: ['acme-outdoor.com'],
  campaignFormula: '[date:yyyy-mm]_[product]_[region|uae,ksa,kw]',
  presets: [
    { id: 'p1', name: 'Meta prospecting', values: { source: 'facebook', medium: 'paid_social', campaign: '', term: '', content: '', id: '' }, extras: [] },
    { id: 'p2', name: 'Monthly newsletter', values: { source: 'email', medium: 'email', campaign: '', term: '', content: '', id: '' }, extras: [] },
  ],
  extraParams: [],
  shortener: { provider: 'none', token: '', domain: '' },
};
const studio = {
  ...acme, id: 'ws-studio', name: 'Northwind Studio', campaignFormula: '', domains: [], presets: [],
  rules: { ...acme.rules, lockMediums: false }, sources: [], mediums: [],
};

function hist(i, source, medium, campaign, content, channel, title) {
  const destination = `https://acme-outdoor.com/${campaign.split('_')[1]}`;
  const q = new URLSearchParams({ utm_source: source, utm_medium: medium, utm_campaign: campaign, ...(content ? { utm_content: content } : {}) });
  return {
    id: 'h' + i, createdAt: NOW - i * DAY * 0.7, workspaceId: 'ws-acme', workspace: acme.name,
    destination, source, medium, campaign, term: '', content, utmId: '', channel,
    url: `${destination}?${q}`, shortUrl: '', title,
  };
}
const history = [
  hist(0, 'facebook', 'paid_social', '2026-10_winter-boots_uae', 'carousel_a', 'Paid Social', 'Winter boots'),
  hist(1, 'google', 'cpc', '2026-10_winter-boots_ksa', '', 'Paid Search', 'Winter boots'),
  hist(2, 'email', 'email', '2026-10_jackets_uae', 'hero_cta', 'Email', 'Jackets'),
  hist(3, 'instagram', 'paid_social', '2026-10_sale_kw', 'story_b', 'Paid Social', 'Autumn sale'),
  hist(4, 'youtube', 'video', '2026-09_tents_uae', 'preroll_15s', 'Paid Video', 'Tents'),
  hist(5, 'linkedin', 'social', '2026-09_jackets_ksa', '', 'Organic Social', 'Jackets'),
];

function seed({ form, workspaceId = 'ws-acme', popup = true, title = 'Winter boots — Acme Outdoor' }) {
  return {
    popup,
    local: {
      workspaces: [acme, studio],
      activeWorkspaceId: workspaceId,
      settings: { stripTracking: true, autoCopy: false, linkCheck: false },
      history,
    },
    session: form ? { draft: { workspaceId, form } } : {},
    tab: { url: 'https://acme-outdoor.com/winter-boots', title },
  };
}

// ---------- chrome.* stub ----------

function chromeStub(cfg) {
  const mkArea = data => ({
    async get(keys) {
      if (keys == null) return structuredClone(data);
      const list = typeof keys === 'string' ? [keys] : Array.isArray(keys) ? keys : Object.keys(keys);
      const out = {};
      for (const k of list) if (k in data) out[k] = structuredClone(data[k]);
      return out;
    },
    async set(obj) { Object.assign(data, structuredClone(obj)); },
    async remove(k) { for (const x of [].concat(k)) delete data[x]; },
    onChanged: { addListener() {} },
  });
  const noop = async () => {};
  window.chrome = {
    storage: { local: mkArea(cfg.local), session: mkArea(cfg.session) },
    extension: { getViews: () => (cfg.popup ? [window] : []) },
    tabs: { query: async () => [cfg.tab], create: noop },
    windows: { getCurrent: async () => ({ id: 1 }) },
    sidePanel: { open: noop },
    runtime: { openOptionsPage: noop, id: 'stub' },
    permissions: { contains: async () => false, request: async () => false },
  };
  // Pin "today" so the formula date token is stable.
  const RealDate = Date;
  const fixed = new RealDate('2026-10-14T10:00:00Z').getTime();
  window.Date = class extends RealDate {
    constructor(...a) { super(...(a.length ? a : [fixed])); }
    static now() { return fixed; }
  };
}

// ---------- capture helpers ----------

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json' };

async function servePage(context) {
  await context.route(`${ORIGIN}/**`, async route => {
    const rel = decodeURIComponent(new URL(route.request().url()).pathname);
    const file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) return route.abort();
    try {
      const body = await readFile(file);
      route.fulfill({ status: 200, body, contentType: MIME[path.extname(file)] || 'application/octet-stream' });
    } catch {
      route.fulfill({ status: 404, body: 'not found' });
    }
  });
  // Block anything else (fonts, external links): graphics must render offline.
  await context.route(/^https?:\/\/(?!ext\.test)/, r => r.abort());
}

async function captureUi(browser, { page: rel, cfg, width = 400, height = 760, before, clip }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: 'light' });
  await servePage(context);
  await context.addInitScript(chromeStub, cfg);
  const page = await context.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`${ORIGIN}/${rel}`);
  await page.waitForTimeout(400);
  if (before) await before(page);
  await page.waitForTimeout(250);
  const buf = await page.screenshot({ fullPage: !clip, clip, animations: 'disabled' });
  await context.close();
  return buf;
}

const dataUrl = buf => `data:image/png;base64,${buf.toString('base64')}`;

async function render(browser, html, width, height, file) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(OUT, file), clip: { x: 0, y: 0, width, height } });
  await page.close();
  console.log('wrote', file);
}

const baseCss = `
  * { box-sizing: border-box; margin: 0; }
  body { font-family: ${FONT}; color: ${BRAND.ink}; background: ${BRAND.paper}; overflow: hidden; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 18px; color: ${BRAND.ink}; }
  .brand img { width: 36px; height: 36px; }
  .by { color: ${BRAND.green}; }
`;

function screenshotHtml({ shot, headline, sub, bullets = [], shotWidth = 400 }) {
  return `<!doctype html><html><head><style>${baseCss}
    .wrap { width: 1280px; height: 800px; display: grid; grid-template-columns: 560px 1fr; position: relative; }
    .left { padding: 72px 40px 56px 72px; display: flex; flex-direction: column; gap: 22px; }
    h1 { font-size: 46px; line-height: 1.08; letter-spacing: -0.02em; font-weight: 800; }
    h1 em { font-style: normal; color: ${BRAND.green}; }
    p.sub { font-size: 20px; line-height: 1.45; color: #3d4250; }
    ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 17px; color: #2a2e38; }
    li::before { content: ''; display: inline-block; width: 10px; height: 10px; border-radius: 3px; background: ${BRAND.accent}; margin-right: 12px; vertical-align: 1px; }
    .foot { margin-top: auto; }
    .right { background: ${BRAND.green}; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .right::before { content: ''; position: absolute; width: 560px; height: 560px; border-radius: 50%; background: rgba(255,255,255,.06); top: -160px; right: -180px; }
    .right::after { content: ''; position: absolute; width: 220px; height: 220px; border-radius: 50%; background: ${BRAND.accent}; opacity: .9; bottom: -90px; left: -70px; }
    .shot { position: relative; z-index: 1; width: ${shotWidth}px; max-height: 720px; border-radius: 12px; box-shadow: 0 30px 70px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.08); background: #fff; object-fit: cover; object-position: top; }
  </style></head><body><div class="wrap">
    <div class="left">
      <div class="brand"><img src="${ICON}"> UTM Governor <span class="by">by The Growth Folks®</span></div>
      <h1>${headline}</h1>
      <p class="sub">${sub}</p>
      <ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="foot"></div>
    </div>
    <div class="right"><img class="shot" src="${shot}"></div>
  </div></body></html>`;
}

// ---------- main ----------

const ICON = dataUrl(await readFile(path.join(ROOT, 'icons/icon128.png')));
const browser = await chromium.launch();

const goodForm = {
  url: 'https://acme-outdoor.com/winter-boots?fbclid=IwAR0xYz',
  source: 'facebook', medium: 'paid_social', campaign: '', term: '', content: 'carousel_a', id: '',
  extras: [], formula: { product: 'winter-boots', region: 'uae' },
};
const badForm = { ...goodForm, source: 'meta', medium: 'paid_social' };
const studioBad = {
  url: 'https://northwind.studio/spring-lookbook',
  source: 'Meta', medium: 'paid_social', campaign: 'Spring Lookbook', term: '', content: '', id: '', extras: [], formula: {},
};

// 1. Build tab, healthy link
const s1 = await captureUi(browser, { page: 'src/panel/panel.html', cfg: seed({ form: goodForm }) });

// 2. Build tab, misattribution caught (unlocked workspace so free text is visible)
const s2 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({ form: studioBad, workspaceId: 'ws-studio', title: 'Spring lookbook' }),
  before: async page => {
    // Values are as-typed; blur normalises them like a real user would see.
    for (const id of ['f-source', 'f-medium', 'f-campaign']) {
      await page.focus('#' + id);
      await page.locator('#' + id).blur();
    }
  },
});

// 3. Bulk matrix
const s3 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({ form: goodForm }),
  width: 640,
  before: async page => {
    await page.evaluate(() => document.body.classList.add('side'));
    await page.click('[data-tab="bulk"]');
    await page.fill('#b-urls', 'https://acme-outdoor.com/winter-boots\nhttps://acme-outdoor.com/jackets');
    await page.fill('#b-source', 'facebook\ninstagram\nmeta');
    await page.fill('#b-medium', 'paid_social');
    await page.fill('#b-campaign', '2026-10_autumn-launch');
    await page.fill('#b-content', 'carousel_a');
    await page.click('#b-go');
  },
});

// 4. History
const s4 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({ form: goodForm }),
  before: async page => {
    await page.click('[data-tab="history"]');
  },
});

// 5. Options (workspaces & rules)
const s5 = await captureUi(browser, {
  page: 'src/options/options.html',
  cfg: seed({ form: goodForm }),
  width: 800,
  height: 1100,
  clip: { x: 0, y: 0, width: 800, height: 1100 },
});

const shots = [
  {
    file: 'screenshot-1-1280x800.png', shot: s1,
    headline: 'See the <em>GA4 channel</em> before you ship the link',
    sub: 'UTM Governor predicts exactly where each link will land in GA4 using Google\'s own channel rules.',
    bullets: ['Popup or side panel, one click from any page', 'Strips fbclid, gclid and old UTMs', 'Copy as URL, params, Sheets row, Markdown or HTML'],
  },
  {
    file: 'screenshot-2-1280x800.png', shot: s2,
    headline: 'Catch <em>misattributed</em> UTMs with one-click fixes',
    sub: '"meta" isn\'t a GA4 social source. Paid spend tagged that way lands in Paid Other or even Organic.',
    bullets: ['Flags Unassigned, Paid Other and paid-as-organic', 'Auto-cleans casing, spaces and special characters', 'Required fields and domain allowlists'],
  },
  {
    file: 'screenshot-3-1280x800.png', shot: s3, shotWidth: 600,
    headline: 'Tag <em>hundreds of links</em> in one go',
    sub: 'Pages × sources × mediums × campaigns. Every row gets a GA4 prediction, ready for Sheets or CSV.',
    bullets: ['Bulk matrix with misattribution flags', 'Tag every link in email HTML', 'Paste straight into Google Sheets'],
  },
  {
    file: 'screenshot-4-1280x800.png', shot: s4,
    headline: 'Every link you build, <em>searchable</em>',
    sub: 'A local history per client workspace. Re-copy, edit or export any link in seconds.',
    bullets: ['Search by campaign, source or URL', 'CSV and Sheets export', 'Stays in your browser, no account needed'],
  },
  {
    file: 'screenshot-5-1280x800.png', shot: s5, shotWidth: 640,
    headline: 'Naming rules your <em>whole team</em> follows',
    sub: 'One workspace per client: approved values, locked dropdowns, campaign formulas and presets.',
    bullets: ['Campaign name formulas with dropdowns', 'Share workspaces as a JSON file', 'Bring your own Bitly, Dub or Rebrandly key'],
  },
];

for (const s of shots) await render(browser, screenshotHtml({ ...s, shot: dataUrl(s.shot) }), 1280, 800, s.file);

// Small promo tile 440x280
await render(
  browser,
  `<!doctype html><html><head><style>${baseCss}
    body { background: ${BRAND.green}; color: #fff; }
    .t { width: 440px; height: 280px; padding: 30px 32px; display: flex; flex-direction: column; gap: 12px; position: relative; overflow: hidden; }
    .t::after { content: ''; position: absolute; width: 180px; height: 180px; border-radius: 50%; background: ${BRAND.accent}; right: -60px; bottom: -70px; }
    .row { display: flex; align-items: center; gap: 12px; }
    .row img { width: 52px; height: 52px; border-radius: 12px; background: #fff; padding: 4px; }
    h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; }
    p { font-size: 19px; line-height: 1.3; max-width: 330px; color: #e9f3ee; }
    .by { margin-top: auto; font-size: 14px; color: #cfe5da; position: relative; z-index: 1; }
    .by b { color: #fff; }
  </style></head><body><div class="t">
    <div class="row"><img src="${ICON}"><h1>UTM Governor</h1></div>
    <p>GA4-safe UTM links. See the channel before you ship.</p>
    <div class="by">by <b>The Growth Folks®</b></div>
  </div></body></html>`,
  440, 280, 'promo-small-440x280.png'
);

// Marquee 1400x560
await render(
  browser,
  `<!doctype html><html><head><style>${baseCss}
    .m { width: 1400px; height: 560px; display: grid; grid-template-columns: 1fr 620px; background: ${BRAND.paper}; }
    .l { padding: 70px 40px 60px 80px; display: flex; flex-direction: column; gap: 22px; }
    h1 { font-size: 60px; line-height: 1.04; font-weight: 800; letter-spacing: -0.025em; }
    h1 em { font-style: normal; color: ${BRAND.green}; }
    p { font-size: 22px; color: #3d4250; max-width: 600px; line-height: 1.4; }
    .r { background: ${BRAND.green}; position: relative; overflow: hidden; }
    .r::after { content: ''; position: absolute; width: 260px; height: 260px; border-radius: 50%; background: ${BRAND.accent}; left: -90px; bottom: -110px; }
    .r img.shot { position: absolute; z-index: 1; width: 400px; top: 50px; left: 110px; border-radius: 12px; box-shadow: 0 30px 70px rgba(0,0,0,.35); }
  </style></head><body><div class="m">
    <div class="l">
      <div class="brand"><img src="${ICON}"> UTM Governor <span class="by">by The Growth Folks®</span></div>
      <h1>Build UTM links GA4 <em>actually understands</em></h1>
      <p>Live channel prediction, naming rules, client workspaces and bulk tagging, all in your browser.</p>
    </div>
    <div class="r"><img class="shot" src="${dataUrl(s1)}"></div>
  </div></body></html>`,
  1400, 560, 'marquee-1400x560.png'
);

await browser.close();
