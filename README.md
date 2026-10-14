# UTM Governor — GA4-safe UTM builder & link governance (Chrome MV3)

Local-first Chrome extension for growth marketers and agencies. Builds UTM links in one click and **tells you which GA4 channel each link will land in before you ship it**.

## Install (dev)
1. `chrome://extensions` → enable Developer mode → **Load unpacked** → select this folder.
2. Click the toolbar icon (or `Alt+U`). Use ⇥ to dock into the side panel.
3. Right-click any link or page → **Build UTM link for this link/page**.

`npm test` runs the engine unit tests (Node 20+, no dependencies). `npm run package` builds `dist/utm-governor.zip` for the Web Store.

## What's built (v0.1, free tier — zero server cost)
| Feature | Notes |
|---|---|
| Popup + side panel (same UI) | Side panel stays open while you tag 20 links |
| Draft auto-persist | Every keystroke saved to `chrome.storage.session`; closing the popup loses nothing |
| **GA4 channel predictor** | Implements Google's current manual-traffic rules (incl. the new *AI Assistant* channel) and Google's official 818-entry source list (`src/lib/ga4-sources.js`). Flags *Unassigned*, *Paid Other* and paid-looking mediums counted as organic, with one-click fixes |
| Safe URL engine | `new URL()`-based; keeps existing params byte-for-byte, keeps `#hash` last, strips `fbclid/gclid/msclkid/_gl/…` and old UTMs |
| Macro picker | Meta, Google Ads, Microsoft, TikTok, LinkedIn macros; never percent-encoded |
| Copy formats | Full URL · params only (Meta "URL parameters" / Google Ads suffix) · Sheets row (TSV) · Markdown · HTML |
| QR code | PNG (1024px) / SVG, vendored MIT library, no network |
| Link check | Opt-in. Detects 404s and redirects that **drop your UTMs** |
| Workspaces | Unlimited client workspaces with own sources, mediums, domains, presets, shortener |
| Governance | Lowercase, space replacement, special-char stripping, required fields, **locked dropdowns**, domain allowlist |
| Campaign formula | `[date:yyyy-mm]_[product]_[region\|uae,ksa]` → mini inputs/dropdowns that assemble the name |
| Bulk matrix | URLs × sources × mediums × campaigns × content, GA4 prediction per row, copy to Sheets / CSV |
| Email HTML tagger | Tags every `<a href>` on allowed domains, skips mailto/anchors/ESP merge tags, handles `&amp;` |
| BYOK shortener | Bitly, Dub, Rebrandly — your key, your account, $0 infra |
| History | Searchable, per workspace, edit/re-copy, CSV / Sheets export |
| Team sharing (no backend) | Export/import workspace JSON (API keys never exported) |

Permissions: `activeTab`, `storage`, `contextMenus`, `sidePanel`, `clipboardWrite`. Host access is **optional** and requested only when you enable a shortener or live link checks — keeps Web Store review fast.

## Corrections to the source research
Verified against Google's docs (support.google.com/analytics/answer/9756891) and source sheet, Oct 2026:
- **`utm_source=meta` is not on GA4's social list** (nor is `x`). `meta + paid_social` → *Paid Other*, not Paid Social. The research's own example (`utm_source=meta&utm_medium=cpc`) is misattributed. Use `facebook`/`fb`/`ig`/`instagram`.
- **`fb_ads` doesn't go to Unassigned** — with source `facebook` it becomes *Organic Social*. That's worse: paid spend silently reported as organic. Same for `social-paid`.
- GA4 now has an **AI Assistant** channel (`medium=ai-assistant`) and **Paid Other** — any predictor that ignores these is wrong.
- Several "top 10" competitors listed (Campouse, Uplinkly, "UTM Builder Pro by Nuvix", UTM Smart Manager) and quoted prices/user counts were not verified and may not exist as described. Re-check on the Chrome Web Store before using them in positioning.

## Roadmap (paid tier)
- Cloud sync of workspaces/history (Supabase: `workspaces`, `rules`, `links` with RLS) — today's JSON export is the stopgap.
- Admin-locked workspaces (members can't edit rules), audit log of who built which link.
- License gating (ExtensionPay / Lemon Squeezy). Suggested gate: free = 1 workspace + 50 history items; Pro = unlimited workspaces, bulk, shortener, formula.
- Google Sheets direct append (OAuth `chrome.identity`), QR center logo, GA4 property import of real source/medium values.
- Known limitation: in the side panel, "use current tab" needs the tab to have granted `activeTab` (click the icon or right-click once); adding `tabs` permission would fix it at the cost of a "read browsing history" install warning.
