# Research summary: UTM Builder & Checker for GA4

Date: 2026-10-16. Full evidence, with a URL for every fact, is in `docs/research/`:
[COMPETITORS](research/COMPETITORS.md) (about 40 tools), [REVIEWS](research/REVIEWS.md) (495 tagged items), [DEMAND](research/DEMAND.md), [PERSONAS](research/PERSONAS.md) and [RISKS](research/RISKS.md).

## What people struggle with

From the review mining (counts are items, an item can carry several themes):

| # | Pain | Items | What it means for us |
|---|---|---|---|
| 1 | GA4 shows **Unassigned / (not set) / wrong Direct** | 75 | Predict the channel and **explain why** (rule trace). Be honest that consent mode, server-side tagging and bots also cause this. |
| 2 | Can't find UTM data in GA4 | 47 | In-product answers: where each parameter shows up in GA4, which ones GA4 doesn't report yet. |
| 3 | **UTMs lost on redirects**, domains, forms | 45 | Redirect check in the Checker and the email check, with a clear "UTMs survive / lost" verdict. |
| 4 | **WhatsApp / click-to-chat can't be attributed** | 35 | WhatsApp builder that puts UTMs on the **landing link inside the message**, plus a ref code, not on the wa.me URL itself. |
| 5 | Ad macros broken or confusing | 30 | Keep unencoded macros. Detect encoded macros (`%7B…%7D`) in the Checker. |
| 6 | Inconsistent naming and casing | 25 | Rules engine + shared **team rules file**. Checker grades existing links against it. |
| 7 | Syntax/encoding errors (`?` vs `#`, `&`, `%2B`) | 23 | Checker: UTMs after `#`, double-encoding, `?` inside values, duplicate parameters. |
| 8 | Google Ads auto-tagging vs manual UTMs | 23 | Template note: keep auto-tagging on; UTMs are for non-Google sources. |

Top requests: shared naming rules (17), presets (14), short/branded links (14), a link library (10), custom parameters and an ad-macro library (10 each). We already ship all of these. Shared rules move from a workspace code to a standard JSON rules file.

## What competitors do

- **Closest rival:** the free "UTM Builder" extension (564 users, updated 4 Oct 2026). It has a side panel, GA4 channel prediction with fixes, macros, the GA4 extra fields and BYOK Bitly. It has **no** bulk tools, checker, naming rules, workspaces, QR, history or webhooks.
- **Biggest free incumbent is stale:** Google Analytics UTM Builder (50,000 users) was last updated in June 2023.
- **Paid governance tools** (UTM.io from $19/mo with rules on paid plans; Terminus from $40/mo, approvals at $150–200/mo; CampaignTrackly $15/user/mo; Uplifter from £24/user/mo; Claravine demo-only) **don't mention GA4 channel prediction**.
- **Link checkers are split up and small.** Email Link Checker (13 users) is the most complete pre-send check. Campaign Link Preflight (3 users) scans pages. The channel checkers do one URL at a time. Litmus and Mailgun Inspect are $199–500/mo. Mailchimp's checker ignores UTMs.
- **WhatsApp:** none of the 8 WhatsApp extensions found tag anything. wa.link has no UTMs.

## Demand

- Search: "utm parameters" and "utm builder" are the head terms. "utm builder ga4" is a breakout query and "utm checker" is small but under-served. In India "whatsapp link" is far bigger than "utm builder". There are no real volumes (Keyword Planner wasn't reachable), so these are relative signals.
- "Check links in email before sending" is dominated by phishing intent, so our copy says "campaign links" and "UTM links".

## Rules and risks that shape the build

1. **GA4 channel rules change** (the AI Assistant channel was added 13 May 2026). Keep the rules as versioned data, show "rules as of <date>", and re-check monthly.
2. **Chrome Web Store review**: reading email drafts is "personal communications". Access has to be on-click, optional per-site permissions with an in-product disclosure, and nothing leaves the device. It must stay within the single purpose: checking campaign links.
3. **Email editors change and use iframes**; ESPs and Outlook Safe Links rewrite links after sending. A pre-send check can't promise what the inbox will receive, so we say so and recommend a test send.
4. **Safari** may hide query strings from third-party scripts in Private Browsing. Firefox, Brave and Safari don't strip `utm_*` on navigation; Brave strips `_gl` and Klaviyo's `_kx`.
5. **WhatsApp**: wa.me links take digits-only international numbers and a URL-encoded `text`. UTMs on the wa.me URL never reach GA4.

## Positioning

**UTM Builder & Checker for GA4 – The Growth Folks®** is the free Chrome extension that both **builds** campaign links GA4 understands and **checks** the ones already out there, on any page, in an email draft or in a WhatsApp message. It enforces your team's naming rules and tells you, before you ship, which GA4 channel each link lands in and why. Everything runs in your browser with no account and no link caps, where comparable rule and approval features cost $19–$200 a month elsewhere.

**Three differentiators we can prove:**
1. **GA4 channel prediction with the reason**, on every link we build or check, from Google's published rules and source list. No governance platform we checked offers it.
2. **Builder and checker in one free tool**: page scan, pasted email/HTML, email draft check and bulk lists, all graded against the same team rules file, with one-click fixes.
3. **WhatsApp links done right**: wa.me click-to-chat with a tagged landing link, ref code and QR. None of the WhatsApp extensions we found tag anything.
