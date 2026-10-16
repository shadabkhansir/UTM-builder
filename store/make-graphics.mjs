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

import { readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'store');
const ORIGIN = 'http://ext.test';
const PW = process.env.PLAYWRIGHT_MODULE || '/opt/node22/lib/node_modules/playwright/index.mjs';
const { chromium } = await import(PW);

// Values from brand/tokens.css (light theme). Store graphics: warm off-white,
// real UI, one Inter 800 headline; green only for the brand and one phrase.
const BRAND = { green: '#1f6b4f', ink: '#16181d', inkSoft: '#4a4f5a', paper: '#fbfaf7', surface: '#ffffff', line: '#e6e3dc', brandInk: '#ffffff' };
const FONT = `'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`;
const fontFaces = (
  await Promise.all(
    [400, 600, 800].map(async w => {
      const b64 = (await readFile(path.join(ROOT, `src/fonts/inter-latin-${w}-normal.woff2`))).toString('base64');
      return `@font-face { font-family: 'Inter'; font-weight: ${w}; src: url(data:font/woff2;base64,${b64}) format('woff2'); }`;
    })
  )
).join('\n');

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

function seed({ form, workspaceId = 'ws-acme', popup = true, title = 'Winter boots — Acme Outdoor', tabUrl = 'https://acme-outdoor.com/winter-boots', links, granted = false, session = {} }) {
  return {
    popup,
    links,
    granted,
    local: {
      workspaces: [acme, studio],
      activeWorkspaceId: workspaceId,
      settings: { stripTracking: true, autoCopy: false, linkCheck: false },
      history,
    },
    session: { ...(form ? { draft: { workspaceId, form } } : {}), ...session },
    tab: { id: 7, url: tabUrl, title },
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
    tabs: { query: async () => [cfg.tab], create: noop, onActivated: { addListener() {} }, onUpdated: { addListener() {} } },
    scripting: { executeScript: async () => [{ result: cfg.links || [] }] },
    windows: { getCurrent: async () => ({ id: 1 }) },
    sidePanel: { open: noop },
    runtime: { openOptionsPage: noop, id: 'stub', sendMessage: async () => ({ results: [] }) },
    permissions: { contains: async () => !!cfg.granted, request: async () => !!cfg.granted },
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

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.json': 'application/json', '.woff2': 'font/woff2' };

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

async function captureUi(browser, { page: rel, cfg, width = 420, height = 760, before, clip, viewportShot = false }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, colorScheme: 'light' });
  await servePage(context);
  await context.addInitScript(chromeStub, cfg);
  const page = await context.newPage();
  page.on('pageerror', e => console.error('page error:', e.message));
  await page.goto(`${ORIGIN}/${rel}`);
  await page.waitForTimeout(400);
  if (before) await before(page);
  await page.waitForTimeout(250);
  const buf = await page.screenshot({ fullPage: !clip && !viewportShot, clip, animations: 'disabled' });
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
  ${fontFaces}
  * { box-sizing: border-box; margin: 0; }
  body { font-family: ${FONT}; color: ${BRAND.ink}; background: ${BRAND.paper}; overflow: hidden; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 18px; letter-spacing: -0.01em; color: ${BRAND.ink}; }
  .brand img { width: 36px; height: 36px; }
  .by { color: ${BRAND.inkSoft}; font-weight: 600; }
`;

function screenshotHtml({ shot, headline, sub, bullets = [], shotWidth = 420 }) {
  return `<!doctype html><html><head><style>${baseCss}
    .wrap { width: 1280px; height: 800px; display: grid; grid-template-columns: 560px 1fr; position: relative; }
    .left { padding: 72px 40px 56px 72px; display: flex; flex-direction: column; gap: 22px; }
    h1 { font-size: 46px; line-height: 1.08; letter-spacing: -0.02em; font-weight: 800; }
    h1 em { font-style: normal; color: ${BRAND.green}; }
    p.sub { font-size: 20px; line-height: 1.45; color: ${BRAND.inkSoft}; }
    ul { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; font-size: 17px; color: ${BRAND.ink}; }
    li::before { content: ''; display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${BRAND.green}; margin-right: 12px; vertical-align: 2px; }
    .foot { margin-top: auto; font-size: 15px; color: ${BRAND.inkSoft}; }
    .right { position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .shot { position: relative; width: ${shotWidth}px; max-height: 720px; border-radius: 20px; border: 1px solid ${BRAND.line}; box-shadow: 0 10px 30px -12px rgb(22 24 29 / 0.18); background: ${BRAND.surface}; object-fit: cover; object-position: top; }
  </style></head><body><div class="wrap">
    <div class="left">
      <div class="brand"><img src="${ICON}"> UTM Builder &amp; Checker <span class="by">by The Growth Folks®</span></div>
      <h1>${headline}</h1>
      <p class="sub">${sub}</p>
      <ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="foot">thegrowthfolks.com</div>
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

// Sample links found "on the page" / "in the draft" for the Checker shots.
const pageLinks = [
  { href: 'https://acme-outdoor.com/winter-boots?utm_source=facebook&utm_medium=paid_social&utm_campaign=2026-10_winter-boots_uae', text: 'Shop winter boots' },
  { href: 'https://acme-outdoor.com/jackets?utm_source=Meta&utm_medium=Paid%20Social&utm_campaign=2026-10_jackets_uae', text: 'New jackets' },
  { href: 'https://acme-outdoor.com/tents#utm_source=email&utm_medium=email&utm_campaign=2026-10_tents_ksa', text: 'Tents' },
  { href: 'https://acme-outdoor.com/sale?utm_source=google&utm_medium=cpc', text: 'Autumn sale' },
  { href: 'https://acme-outdoor.com/stores', text: 'Find a store' },
  { href: 'mailto:team@acme-outdoor.com', text: 'Email us' },
];
const draftLinks = [
  { href: 'https://acme-outdoor.com/winter-boots?utm_source=email&utm_medium=email&utm_campaign=2026-10_winter-boots_uae&utm_content=hero', text: 'Shop the boots' },
  { href: 'https://acme-outdoor.com/jackets?utm_source=klaviyo&utm_medium=campaign&utm_campaign=2026-10_jackets_uae', text: 'See jackets' },
  { href: 'https://acme-outdoor.com/winter-boots?utm_source=email&utm_medium=email&utm_campaign=2026-10_winter-boots_uae&utm_content=hero', text: 'Shop now' },
  { href: 'https://acme-outdoor.com/account?id=*|UNIQID|*', text: 'Your account' },
];

// 1. Build: GA4 channel and the reason
const s1 = await captureUi(browser, { page: 'src/panel/panel.html', cfg: seed({ form: goodForm }) });

// 2. Check: every link on this page graded
const s2 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({ form: goodForm, links: pageLinks, title: 'Autumn sale — Acme Outdoor' }),
  height: 900,
  before: async page => {
    await page.click('[data-tab="check"]');
    await page.click('#k-page');
    await page.waitForSelector('#k-list li');
  },
});

// 3. Check: email draft before you send
const s3 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({ form: goodForm, links: draftLinks, tabUrl: 'https://www.klaviyo.com/email-editor/abc', title: 'October newsletter — Klaviyo', granted: true }),
  height: 900,
  before: async page => {
    await page.click('[data-tab="check"]');
    await page.click('[data-csrc="email"]');
    await page.waitForTimeout(150);
    await page.click('#k-email');
    await page.waitForSelector('#k-list li');
  },
});

// 4. WhatsApp click-to-chat with a tagged website link
const s4 = await captureUi(browser, {
  page: 'src/panel/panel.html',
  cfg: seed({
    form: goodForm,
    session: {
      waDraft: {
        country: '971', number: '50 123 4567', message: 'Hi Acme! I saw the winter boots and want to know about sizes: {link}',
        landing: 'https://acme-outdoor.com/winter-boots', preset: 'chat', source: 'whatsapp', medium: 'social',
        campaign: '2026-10_winter-boots_uae', content: 'status_story', ref: 'WA-BOOTS-OCT',
      },
    },
  }),
  height: 720,
  viewportShot: true,
  before: async page => {
    await page.click('[data-tab="whatsapp"]');
    await page.waitForTimeout(150);
    // Show the tagged link, its GA4 verdict and the finished wa.me link under the sticky header.
    await page.evaluate(() => {
      const header = document.querySelector('.top').getBoundingClientRect().height;
      const y = document.querySelector('#w-message').getBoundingClientRect().top + window.scrollY - header - 12;
      window.scrollTo(0, y);
      document.querySelector('#w-linkBox').open = false;
    });
  },
});

// 5. Team rules file import preview in Settings
const rulesTmp = path.join(tmpdir(), 'tgf-rules-sample.json');
await writeFile(rulesTmp, JSON.stringify({
  type: 'tgf.utm-rules', version: 1, name: 'Acme Outdoor (team rules)', casing: 'lower', spaceReplacement: '-',
  sources: { values: ['google', 'facebook', 'instagram', 'tiktok', 'email', 'whatsapp'], locked: true, labels: {} },
  mediums: { values: ['cpc', 'paid_social', 'email', 'social'], locked: true, labels: {} },
  domains: ['acme-outdoor.com'], campaign: { pattern: '{yyyy}-{mm}_{product}_{region|uae,ksa,kw}', regex: '' },
}));
const s5 = await captureUi(browser, {
  page: 'src/options/options.html',
  cfg: seed({ form: goodForm }),
  width: 800,
  height: 1000,
  before: async page => {
    await page.setInputFiles('#rulesFile', rulesTmp);
    await page.waitForSelector('#rulesPreview:not([hidden])');
    await page.evaluate(() => document.querySelector('#s-share').scrollIntoView());
    await page.waitForTimeout(100);
  },
  viewportShot: true,
});
await rm(rulesTmp, { force: true });

// 6. Bulk matrix
const s6 = await captureUi(browser, {
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

const shots = [
  {
    file: 'screenshots/1-build-ga4-channel.png', shot: s1,
    alt: 'Building a UTM link with the predicted GA4 channel and the rule that decided it',
    headline: 'See the <em>GA4 channel</em> before you ship the link',
    sub: 'Every link gets the channel GA4 will report, and why, from Google’s own channel rules.',
    bullets: ['Popup or side panel, one click from any page', 'Strips fbclid, gclid and old UTMs', 'Copy as URL, parameters or a Sheets row'],
  },
  {
    file: 'screenshots/2-check-page.png', shot: s2,
    alt: 'UTM Checker grading every link on a web page with critical, warning and pass levels',
    headline: '<em>Check every link</em> on any page',
    sub: 'Missing UTMs, UTMs after #, casing, naming rules and Unassigned links, each with a one-click fix.',
    bullets: ['Critical, warning and pass, never colour alone', 'Locate the link on the page', 'Copy all fixed links or export CSV'],
  },
  {
    file: 'screenshots/3-check-email-draft.png', shot: s3,
    alt: 'Checking the links in an email draft before sending, including a duplicate and a merge tag',
    headline: 'Check your <em>email draft</em> before you send',
    sub: 'Gmail, Outlook on the web, HubSpot, Mailchimp and Klaviyo. Only when you click, nothing leaves your browser.',
    bullets: ['Spots platform defaults that land in Unassigned', 'Leaves merge tags alone', 'Optional redirect check: do your UTMs survive?'],
  },
  {
    file: 'screenshots/4-whatsapp-link.png', shot: s4, shotWidth: 420,
    alt: 'WhatsApp click-to-chat link builder with a tagged website link inside the message and a QR code',
    headline: '<em>WhatsApp links</em> GA4 can actually track',
    sub: 'A wa.me link with your message, a tagged website link inside it and a ref code, plus a QR code.',
    bullets: ['Country code and number cleaned for you', 'GA4 verdict for the link in the message', 'QR code for print, packaging and stores'],
  },
  {
    file: 'screenshots/5-team-rules-file.png', shot: s5, shotWidth: 600,
    alt: 'Importing a team rules file in Settings with a preview of what will change',
    headline: 'One <em>rules file</em> for the whole team',
    sub: 'Approved sources and mediums, casing, separators and the campaign pattern in one JSON file.',
    bullets: ['Preview every change before applying', 'Works with our Bulk UTM Link Checker', 'Unlimited client workspaces, free'],
  },
  {
    file: 'screenshots/6-bulk-matrix.png', shot: s6, shotWidth: 600,
    alt: 'Bulk matrix generating every UTM combination with a GA4 prediction per row',
    headline: 'Tag <em>hundreds of links</em> in one go',
    sub: 'Pages × sources × mediums × campaigns. Every row gets a GA4 prediction, ready for Sheets or CSV.',
    bullets: ['Flags rows GA4 will misattribute', 'CSV upload and UTM Cleaner', 'Tag every link in email HTML'],
  },
];

await mkdir(path.join(OUT, 'screenshots'), { recursive: true });
await writeFile(path.join(OUT, 'screenshots', 'alt-text.json'), JSON.stringify(shots.map(({ file, alt }) => ({ file: `store/${file}`, alt })), null, 2) + '\n');
for (const s of shots) await render(browser, screenshotHtml({ ...s, shot: dataUrl(s.shot) }), 1280, 800, s.file);

// Small promo tile 440x280
await render(
  browser,
  `<!doctype html><html><head><style>${baseCss}
    body { background: ${BRAND.green}; color: ${BRAND.brandInk}; }
    .t { width: 440px; height: 280px; padding: 30px 32px; display: flex; flex-direction: column; gap: 12px; }
    .row { display: flex; align-items: center; gap: 12px; }
    .inv { width: 52px; height: 52px; border-radius: 15px; background: ${BRAND.brandInk}; color: ${BRAND.green}; display: grid; place-items: center; font-weight: 800; font-size: 26px; }
    h1 { font-size: 34px; font-weight: 800; letter-spacing: -0.02em; }
    p { font-size: 19px; line-height: 1.3; max-width: 340px; }
    .t .by { margin-top: auto; font-size: 14px; font-weight: 600; color: ${BRAND.brandInk}; }
  </style></head><body><div class="t">
    <div class="row"><span class="inv">U</span><h1>UTM Builder &amp; Checker</h1></div>
    <p>Build and check GA4-safe UTM links, emails and WhatsApp links.</p>
    <div class="by">by The Growth Folks®</div>
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
    p { font-size: 22px; color: ${BRAND.inkSoft}; max-width: 600px; line-height: 1.4; }
    .r { position: relative; overflow: hidden; }
    .r img.shot { position: absolute; width: 420px; top: 48px; left: 100px; border-radius: 20px; border: 1px solid ${BRAND.line}; box-shadow: 0 10px 30px -12px rgb(22 24 29 / 0.18); }
  </style></head><body><div class="m">
    <div class="l">
      <div class="brand"><img src="${ICON}"> UTM Builder &amp; Checker <span class="by">by The Growth Folks®</span></div>
      <h1>Build and check UTM links GA4 <em>actually understands</em></h1>
      <p>Channel prediction with the reason, a checker for pages and email drafts, WhatsApp links and team naming rules. Free, in your browser.</p>
    </div>
    <div class="r"><img class="shot" src="${dataUrl(s1)}"></div>
  </div></body></html>`,
  1400, 560, 'marquee-1400x560.png'
);

await browser.close();
