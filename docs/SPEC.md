# Spec: UTM Builder & Checker for GA4 – The Growth Folks® (v0.3)

Evidence for every line is in [RESEARCH.md](RESEARCH.md) and `docs/research/`. Tags: **P#** = pain rank in REVIEWS §2, **R#** = request rank in REVIEWS §3, **C** = COMPETITORS §9, **K** = RISKS, **D** = DEMAND, personas **GM** (growth marketer), **AG** (agency), **DF** (D2C founder incl. India/WhatsApp), **AN** (analyst/developer).

## 0. Identity

- Store title / manifest `name`: **UTM Builder & Checker for GA4 – The Growth Folks®** (49 chars, ≤ 75). `short_name`: **UTM Builder**.
- Website slug `utm-builder`. Welcome URL `https://thegrowthfolks.com/tools/utm-builder/welcome/` (first install only).
- Extension ID and every storage key stay the same, so existing users keep their data.
- Contact team@thegrowthfolks.com. Brand: tokens only, dense sizes, light and dark (`brand/GUIDELINES.md`).

## 1. Features

### Must (v1)

| # | Feature | Why |
|---|---|---|
| M1 | Keep every v0.2 builder feature (prefill tab, templates, presets, macros, GA4 fields, copy formats, shortener, QR, bulk, history, workspaces, rules, webhooks) | R1–R5; C9.1 |
| M2 | **GA4 channel rules as versioned data**, with "rules as of 13 May 2026" shown in Settings and under the prediction | K1 |
| M3 | **"Why this channel"** line on every prediction (which rule matched, or why none did) | P1, C9.1 #6 |
| M4 | **Checker tab** with three inputs: *This page*, *Email draft*, *Paste* (URLs, text, HTML). Extracts every http(s) link | P3, P6, P7, C9.2 |
| M5 | Per-link checks: invalid URL; missing required UTMs; empty or duplicate parameters; uppercase; spaces; special characters; mixed separators; UTMs after `#`; encoded macros (`%7B…%7D`); double-encoding (`%25`); a second `?`; click IDs; locked-list and not-approved values; domain allowlist; campaign pattern/regex; predicted GA4 channel with level; duplicate links; merge tags (unverifiable); wrapped links (Outlook Safe Links, `google.com/url`) unwrapped | P1, P5, P6, P7, K3; C9.1 #7 |
| M6 | **Severity**: ✕ Critical, ! Warning, ✓ Pass, ? Unverifiable (icon + word) and a summary bar with counts | C9.1 #5 |
| M7 | **One-click fixes**: per-link *Copy fixed link*, plus *Copy all fixed links* and, for pasted HTML, *Copy fixed HTML* | brief §2.1; P6 |
| M8 | **Email draft check** on demand in Gmail, Outlook on the web, HubSpot, Mailchimp and Klaviyo editors. Optional per-site permission asked on first use, with a disclosure. Reads links only, on click | brief §2.2; K2, K5; RISKS §5 table |
| M9 | **Redirect check** for checked links (optional all-sites permission, run in the service worker): final URL, status, whether UTMs survive. Limits: 25 links per run, 4 at a time, 8 s timeout each | P3; C9.1 #4 |
| M10 | **WhatsApp builder** tab: wa.me click-to-chat link with country code + number (digits only), pre-filled message, tagged landing link inserted into the message, optional ref code, GA4 verdict for the inner link, copy link / copy message / open / QR (styled, existing engine) | P4 (35 items); C9.2; K7 |
| M11 | **Team rules file** (`tgf.utm-rules` v1, [RULES_SCHEMA.md](RULES_SCHEMA.md)): export from and import into a workspace; the Checker grades against the active workspace's rules | R1 (17); brief §2.4 |
| M12 | Rename everywhere: app strings, store listing, README, privacy text, screenshots | brief §1 |
| M13 | In-product notes: GA4 doesn't report `utm_creative_format`/`utm_marketing_tactic` yet and shows `utm_source_platform` as Manual; keep Google Ads auto-tagging on | P2, P8; K11; D Q3 |

### Advanced (v1, our edge)

| # | Feature | Why |
|---|---|---|
| A1 | **Locate**: on *This page* results, scroll to and outline the link on the page | C9.1 #5 |
| A2 | **Untagged campaign links**: links to the workspace's own domains without UTMs are flagged (warning). Other untagged links are counted, not flagged | C9.2 |
| A3 | **Email platform notes**: when the draft is in HubSpot, Mailchimp or Klaviyo, say which UTMs the platform may add or override at send time, and recommend a test send | K3; RISKS §6 |
| A4 | **WhatsApp channel presets**: "Chat link (Organic Social)" `whatsapp / social`, plus the option to use your own medium with live GA4 verdict | K7 |
| A5 | **"Problems only" filter** and CSV export of checker results | P6; R4 |
| A6 | Built-in template "WhatsApp chat link" | P4 |

### Later

| # | Feature | Why later |
|---|---|---|
| L1 | Button injected into email editors that runs before Send | Editor DOMs change often and use iframes (K5). The on-demand check covers the job without injected UI |
| L2 | Outlook add-in with Smart Alerts `OnMessageSend` | Separate product and store (RISKS §5) |
| L3 | Full redirect chain (every hop) | Needs `webRequest`; v1 shows original → final and UTM survival |
| L4 | Cloud team sync, shared audit log | Needs a server |
| L5 | Dependent dropdowns (medium list per source) | C9.1 #3; not in top pains |
| L6 | Direct GA4 Data API connection | Needs an OAuth client for the published ID; the CSV audit covers it |
| L7 | Arabic interface | Transliteration rule ships; UI translation later |

## 2. Screens

**Header** (all tabs): TGF mark, "UTM Builder", side-panel and Settings buttons; workspace select; segmented tabs **Build · Check · WhatsApp · Bulk · History**.

**Build**: unchanged from v0.2, plus a "Why" line under the GA4 status and the M13 note under the GA4 fields.

**Check**
1. Segmented source picker: *This page* · *Email draft* · *Paste*.
2. *This page*: "Check links on this page" (primary). *Email draft*: shows which editor was detected (or "Open a draft in Gmail, Outlook, HubSpot, Mailchimp or Klaviyo"), the disclosure "Reads the links in your open draft when you click. Nothing leaves your browser.", then "Check this draft" (primary; asks for the site permission on first use). *Paste*: textarea + "Check".
3. Summary bar: total, ✕ critical, ! warnings, ✓ pass, ? unverifiable, untagged count. Toggle "Problems only". Menu: Copy all fixed links · Copy fixed HTML (paste mode with HTML) · Export CSV · Check redirects.
4. Result cards: severity chip, link text, URL (monospace), "GA4: Paid Social · because source is on Google's social list and medium matches paid", issue list, buttons *Copy fixed* · *Locate* (page only) · *Open in Build*.
5. GA4 report audit (existing) below, collapsed.

**WhatsApp**
1. Country code select (defaults from browser region, never US-first by default) + number. Empty number = "Let them choose a contact".
2. Message textarea with a `{link}` placeholder button.
3. "Link in the message": landing URL (prefilled from the current tab), channel preset select, source / medium / campaign / content (prefilled `whatsapp` / `social`), GA4 status line.
4. Ref code (optional), appended as "Ref: CODE".
5. Output: wa.me link (readonly), *Copy link* (primary), *Copy message*, *Open*, *QR code*. Note: "UTMs on the wa.me link itself never reach GA4. We tag the website link inside your message."

**Settings**: new "Team rules file" block in Share (export / import, shows what will change before applying); "GA4 channel rules as of 13 May 2026" in General.

## 3. Data model

- Unchanged keys: `workspaces`, `activeWorkspaceId`, `settings`, `history`, `memory`, `activity` (local), `draft`, `pending` (session).
- New: `settings.wa` = `{ country: '91', lastNumber: '' }` (local); `draft.wa` = WhatsApp form (session); history records gain `kind: 'whatsapp'` and `waNumber`.
- Checker results are not stored.
- Rules file ↔ workspace mapping in `src/lib/rulesfile.js` (fields per RULES_SCHEMA).

## 4. Edge cases

- Links with merge tags (`*|…|*`, `{{…}}`, `%%…%%`, `{% %}`) → Unverifiable, never "broken".
- Relative links, `mailto:`, `tel:`, `#` anchors, `javascript:` → skipped and counted.
- Wrapped links (`safelinks.protection.outlook.com?url=`, `google.com/url?q=`) → checked as the inner URL, with a note.
- UTMs in the fragment (`#utm_source=`) → Critical (GA4 won't read them), fix moves them to the query.
- Values with `+` meaning space in forms vs a literal plus → treat `%2B` as a literal plus; flag only if it decodes into a space and the workspace bans spaces.
- 2,000+ links on a page → check the first 2,000, say so.
- Email draft in an iframe from another origin → needs that origin's optional permission; if missing, say which site to allow.
- WhatsApp number with leading `+`, `00`, spaces or a national leading `0` → strip to digits; warn if the result isn't 8–15 digits.
- WhatsApp message over 2,000 characters → warning (estimate, not an official limit).
- Rules file from a newer version → refuse with a message; unknown keys ignored.

## 5. Accessibility

Labels on every control; tabs are buttons with `aria-selected`; results list is `aria-live="polite"` for the summary; status is never colour alone; focus ring on every control; works with keyboard only; light and dark; no horizontal scroll at the 420px popup width and the 360px side panel.

## 6. Performance budgets

- Popup interactive in < 150 ms on a mid laptop; no work at load beyond reading storage.
- Checker: 2,000 links graded in < 300 ms (unit-tested at 2,000).
- Redirect check: ≤ 25 requests per run, 4 concurrent, 8 s timeout, cookies omitted.
- Package < 700 KB (fonts ≈ 72 KB).

## 7. Acceptance criteria

1. Manifest name is exactly "UTM Builder & Checker for GA4 – The Growth Folks®", short name "UTM Builder"; no visible "UTM Governor" left (grep test).
2. Existing storage loads unchanged (unit test of `loadState` merge).
3. Channel predictor reads its rules from data; every manual-traffic rule from Google's table has a unit test; the trace names the matched rule.
4. Checker unit tests cover every M5 check, fixes, merge tags, wrappers, duplicates and the 2,000-link budget.
5. Paste mode: a sample email HTML with 6 known problems reports exactly those and "Copy fixed HTML" fixes them (Playwright).
6. Page mode: scanning a local test page lists its tagged links with correct levels (Playwright, with the optional permission granted in the test profile).
7. WhatsApp: `+44 (0)7700 900123` + message + landing link builds `https://wa.me/447700900123?text=…` whose decoded text contains the tagged landing URL (unit + Playwright).
8. Rules file: export → import round-trip yields identical rules; brace patterns convert both ways (unit).
9. `npm test`, the Playwright suite and `npm run package` pass.
10. `HANDOFF.md` filled; ≥ 5 new 1280×800 screenshots in `store/screenshots/`.
