# UTM Builder & Checker for GA4 – The Growth Folks® (Chrome MV3)

Local-first Chrome extension for growth marketers and agencies, published by The Growth Folks® (https://thegrowthfolks.com/tools/utm-builder/). It builds UTM links, **checks the links you already have** (on a page, in an email draft or pasted), builds WhatsApp click-to-chat links with a tagged website link, and **tells you which GA4 channel each link will land in, and why, before you ship it**.

Short name: "UTM Builder". Slug: `utm-builder`. Version 0.3.0. Free, with no account and no server. The extension ID and storage keys are unchanged from v0.2 ("UTM Governor"), so existing installs keep their workspaces and history.

## Install (dev)
1. `chrome://extensions` → enable Developer mode → **Load unpacked** → select this folder.
2. Click the toolbar icon (or `Alt+U`). Use ⇥ to dock into the side panel.
3. Right-click any link or page → **Build UTM link for this link/page** or **Check UTM links on this page**.

## Tests and packaging
- `npm test` runs the unit tests (Node 20+, no dependencies): URL engine, GA4 rules (kept as data in `src/lib/ga4-rules.js`), checker, WhatsApp builder, rules file, bulk, rename checks.
- `npm run test:e2e` loads the unpacked extension in Playwright Chromium (`/opt/pw-browsers/chromium`) and drives the Build, Check, WhatsApp and Settings flows against a local fixture page (`tests/e2e/fixtures/`).
- `npm run package` builds `dist/utm-builder.zip` for the Web Store (manifest.json, src, icons only).
- `node store/make-graphics.mjs` regenerates the 1280×800 screenshots in `store/screenshots/` (with `alt-text.json`), the promo tile and the marquee from the real UI.

## Docs
- `docs/RESEARCH.md` and `docs/research/` (competitors, 495 reviews, search demand, personas, risks), `docs/SPEC.md`, `docs/DECISIONS.md`.
- `docs/RULES_SCHEMA.md`: the `tgf.utm-rules` team rules file, shared with The Growth Folks® Bulk UTM Link Checker on the website.
- `store/STORE_LISTING.md`: store copy, permission justifications, data usage and reviewer notes. `HANDOFF.md`: the website tool entry.

## Branding
Styling follows The Growth Folks® design system (`CLAUDE.md`, `brand/`, `.claude/skills/tgf-design-system/`), light and dark. `src/styles/tokens.css` is an unchanged copy of `brand/tokens.css` (the store package only ships `src/`); refresh it whenever `brand/` changes. Inter 400/600/800 is bundled in `src/fonts/` (SIL OFL). Contact: team@thegrowthfolks.com. On first install (not on update) the service worker opens `https://thegrowthfolks.com/tools/utm-builder/welcome/`.

## What's built (v0.3)

**Build**
- Popup and side panel (same UI); the side panel can follow the active tab (optional `tabs` permission). Drafts are saved on every keystroke.
- **GA4 channel prediction with the reason** (for example "source is on Google's search-site list and the medium is paid"), using Google's default channel group rules (as of 13 May 2026, including AI Assistant and Paid Other) and the official 818-source list. One-click fixes (meta → facebook, fb_ads → paid_social).
- Safe URL engine: keeps existing parameters and `#hash`, strips click IDs and old UTMs, never encodes ad macros.
- All GA4 campaign fields, with a note that GA4 doesn't report `utm_creative_format` or `utm_marketing_tactic` in standard reports.
- 16 built-in templates (including WhatsApp), each tested to land in the right GA4 channel. Presets with folders, variables, campaign formulas.
- Copy as URL, parameters, Sheets row, Markdown, HTML, or per-platform output (Meta URL parameters, Google Ads final URL suffix / tracking template, Microsoft, TikTok, LinkedIn, Adobe `cid`).
- Shorten via Bitly / Dub / Rebrandly (your key) with custom endings and click counts. Styled QR (PNG and SVG). Link check and landing test.

**Check (new)**
- **This page**: grades every link on the open tab (all frames) as Critical, Warning or Pass, with the GA4 channel and a **Locate** button.
- **Email draft**: reads only the links inside the draft body in Gmail, Outlook on the web, HubSpot, Mailchimp and Klaviyo, on click, after asking for that one site.
- **Paste**: a list of links or a whole email's HTML; copy the fixed links or the fixed HTML; CSV export.
- Checks: missing UTMs, UTMs after `#`, a second `?`, encoded or broken macros, double encoding, duplicate or empty parameters, click IDs, case/spaces/special characters, mixed separators, locked lists, campaign pattern, allowed domains, duplicate links, and links that would land in Unassigned (for example Klaviyo’s old `utm_medium=campaign` default). Merge tags are "unverifiable", not errors. Safe Links and Google redirect wrappers are unwrapped.
- **Check redirects** (optional all-sites permission): up to 25 links through the service worker; flags redirects that drop UTMs.

**WhatsApp (new)**: `wa.me` click-to-chat builder with country picker, a pre-filled message and a `{link}` placeholder for a tagged website link (UTMs on the wa.me link itself never reach GA4), optional ref code, QR code, history.

**Bulk**: matrix builder, CSV upload (headers auto-mapped), email HTML tagger, UTM Cleaner. Every row gets a GA4 verdict.

**Teams**: unlimited workspaces with naming rules, locked dropdowns, display names, allowed domains and campaign regex; **team rules file** (`tgf.utm-rules` JSON) import with a preview of changes, and export; workspace share codes and QR; admin PIN lock (a soft lock, not a security control); approval requests; activity log; webhooks (Zapier/Make/n8n, Slack, Google Sheets).

**History**: searchable, CSV and Sheets export; WhatsApp links included. **GA4 report audit** (Traffic acquisition CSV → Unassigned pairs) sits under Check.

Permissions: `activeTab`, `storage`, `contextMenus`, `sidePanel`, `clipboardWrite`, `scripting`. Optional, asked only when you use a feature: `tabs` (follow tab), the five email editors' hosts (draft check), shortener API hosts, your webhook host, all sites (link and redirect checks, landing test, checking from the side panel). See `store/STORE_LISTING.md` for the reason behind each.

## Not built yet (needs a server or outside setup)
- Live team sync and a shared audit log across devices (Supabase planned). Share codes + PIN lock are the stopgap.
- Direct GA4 connection (needs a Google OAuth client registered to the published extension ID). The CSV audit covers the same check today.
- Own branded shortener / dynamic QR, SSO, weekly email digest, pushing names into ad platforms.
- Arabic UI translation (the Arabic transliteration rule is in; the interface is English only).

## Corrections to the source research
Verified against Google's docs (support.google.com/analytics/answer/9756891) and source sheet, Oct 2026:
- **`utm_source=meta` is not on GA4's social list** (nor is `x`). `meta + paid_social` → *Paid Other*, not Paid Social. The research's own example (`utm_source=meta&utm_medium=cpc`) is misattributed. Use `facebook`/`fb`/`ig`/`instagram`.
- **`fb_ads` doesn't go to Unassigned** — with source `facebook` it becomes *Organic Social*. That's worse: paid spend silently reported as organic. Same for `social-paid`.
- GA4 now has an **AI Assistant** channel (`medium=ai-assistant`) and **Paid Other** — any predictor that ignores these is wrong.
- Several "top 10" competitors listed (Campouse, Uplinkly, "UTM Builder Pro by Nuvix", UTM Smart Manager) and quoted prices/user counts were not verified and may not exist as described. Re-check on the Chrome Web Store before using them in positioning.

## Roadmap
- Cloud sync of workspaces, history and activity log (Supabase with row-level security), replacing share codes.
- License gating (ExtensionPay or Lemon Squeezy). Suggested: Free = everything local + 2 workspaces; Pro $9 = unlimited workspaces, bulk/CSV, cleaner, styled QR, webhooks; Team $19 = sync, shared audit log, approvals across devices.
- Direct GA4 Data API connection for live picklists and the Unassigned audit.
