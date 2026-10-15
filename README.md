# UTM Governor — GA4-safe UTM builder & link governance (Chrome MV3)

Local-first Chrome extension for growth marketers and agencies. Builds UTM links in one click and **tells you which GA4 channel each link will land in before you ship it**.

## Install (dev)
1. `chrome://extensions` → enable Developer mode → **Load unpacked** → select this folder.
2. Click the toolbar icon (or `Alt+U`). Use ⇥ to dock into the side panel.
3. Right-click any link or page → **Build UTM link for this link/page**.

`npm test` runs the engine unit tests (Node 20+, no dependencies). `npm run package` builds `dist/utm-governor.zip` for the Web Store.

## What's built (v0.2) — all local, zero server cost

**Build**
- Popup + side panel (same UI); side panel can follow the active tab (optional `tabs` permission). Draft saved on every keystroke.
- **GA4 channel predictor** using Google's current manual-traffic rules and official 818-source list, with one-click fixes (meta → facebook, fb_ads → paid_social).
- Safe URL engine: keeps existing params and `#hash`, strips click IDs and old UTMs, never encodes ad macros.
- All GA4 campaign fields: `utm_id`, `utm_source_platform`, `utm_creative_format`, `utm_marketing_tactic`.
- 15 built-in templates (Google Ads Search/PMax, YouTube, Microsoft, Meta FB/IG, TikTok, LinkedIn, Snapchat, X, newsletter, organic social, SMS, push, affiliate) — each verified by test to land in the right GA4 channel.
- Presets with folders; tags remembered per site and restored on return (with Undo).
- Variables in any field or formula: `[page_title]` `[domain]` `[path]` `[client]` `[user]` `[date:yyyy-mm]`.
- Ad macros for Meta, Google, Microsoft, TikTok, LinkedIn.
- Copy as URL, params only, Sheets row, Markdown, HTML, or **exact per-platform output**: Meta URL parameters, Google Ads final URL suffix / tracking template, Microsoft suffix, TikTok, LinkedIn, Adobe Analytics `cid` link.
- Shorten via Bitly / Dub / Rebrandly (your key) with **custom endings** and **click counts** in History.
- **Styled QR**: colours, round dots, caption, workspace logo; PNG (1200px) and SVG.
- Link check (404s, redirects that drop UTMs) and **landing test** (opens the page in a background tab, confirms UTMs survive redirects/SPA routing and a GA4 tag is present).
- Keyboard: `Alt+U` open, `Ctrl/⌘+Enter` copy URL, `+Shift` copy params. Light/dark/system theme.

**Bulk**: matrix builder, **CSV upload** (headers auto-mapped), email HTML tagger, **UTM Cleaner** (normalise, strip click IDs, dedupe, GA4 verdict). Every row gets a GA4 verdict; copy for Sheets, copy URLs, CSV, save to history.

**Audit**: **page link checker** (grades every tagged link on the open page) and **GA4 report audit** (upload the Traffic acquisition CSV → Unassigned/misattributed pairs with sessions → add clean values to approved lists).

**Governance (per workspace)**: unlimited workspaces; lowercase/space/special-char rules; **non-Latin rule** (allow / transliterate Arabic & accents / block); **campaign regex**; required fields; locked dropdowns with **display names**; domain allowlist; campaign formula; default custom params.

**Team without a backend**: **workspace share codes** (+ QR) and JSON files (API keys/webhooks never included); **admin PIN lock** (members can use but not edit rules — a soft lock, not a security control); **approval requests** (member copies a request code, admin pastes and approves); **activity log** with CSV export; your name on every link.

**Integrations**: per-workspace **webhook** on every copied link — JSON (Zapier/Make/n8n), Slack message, or **Google Sheets** via the bundled Apps Script.

Permissions: `activeTab`, `storage`, `contextMenus`, `sidePanel`, `clipboardWrite`, `scripting`. Optional, asked only when you turn a feature on: `tabs` (follow tab), shortener API hosts, your webhook host, all sites (link check / landing test / scanning any tab).

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
