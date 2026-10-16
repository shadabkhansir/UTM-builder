# Chrome Web Store listing: UTM Builder & Checker for GA4 – The Growth Folks®

Everything below is ready to paste into the Chrome Web Store developer dashboard. It was written against the code in this repo (manifest **v0.3.0**). If the manifest, permissions or network code change, update the permission and data sections to match.

---

## Store listing tab

**Name** (from manifest, 49 characters)
UTM Builder & Checker for GA4 – The Growth Folks®

**Summary** (manifest `description`, 121 characters)
Build and check UTM links for GA4. See the channel before you share. Page and email checker, WhatsApp links, bulk and QR.

**Category:** Tools (alternative: Workflow & Planning)

**Language:** English

**Screenshots** (1280×800, in `store/screenshots/`, alt text in `store/screenshots/alt-text.json`). The Chrome Web Store accepts at most 5, so upload these in this order:
1. `1-build-ga4-channel.png`
2. `2-check-page.png`
3. `3-check-email-draft.png`
4. `4-whatsapp-link.png`
5. `6-bulk-matrix.png`

`5-team-rules-file.png` is used on the website only.

**Promo tiles:** `store/promo-small-440x280.png`, `store/marquee-1400x560.png`.

**Detailed description**

```
Build UTM links that Google Analytics 4 understands, and check the ones you already have, before they go live.

UTM Builder & Checker for GA4 is a free Chrome extension from The Growth Folks®. It shows which GA4 channel every link will land in, and why, using Google's published default channel group rules. It also grades links against your team's naming convention.

WHY IT EXISTS
One wrong value quietly breaks your reports. "utm_source=meta" isn't on GA4's social list, so paid Meta traffic shows up as Paid Other. Klaviyo's older default "utm_medium=campaign" lands in Unassigned. UTMs placed after a "#" never reach GA4 at all. This extension catches those mistakes and gives you the fixed link.

BUILD
• GA4 channel prediction with the reason, including the newer AI Assistant and Paid Other channels, using Google's official source list
• One-click fixes for Unassigned, Paid Other and paid traffic counted as organic
• Clean URLs: keeps your parameters and #anchors, strips fbclid, gclid, msclkid, _gl and old UTMs
• Ad-platform macros for Meta, Google Ads, Microsoft Ads, TikTok and LinkedIn, never encoded
• Copy as a full URL, parameters only, a Meta "URL parameters" string, a Google Ads final URL suffix or tracking template, a Google Sheets row, Markdown or HTML
• 16 built-in templates, presets with folders, campaign-name formulas and variables

CHECK (UTM checker)
• This page: grade every link on the open page, then locate any link with one click
• Email draft: check the links in a draft in Gmail, Outlook on the web, HubSpot, Mailchimp or Klaviyo before you send. It reads links only when you click, and nothing leaves your browser
• Paste: check a list of links or a whole email's HTML, then copy the fixed HTML
• Checks for missing UTMs, UTMs after #, a second "?", encoded macros, double encoding, case and spacing problems, duplicates, click IDs, your naming rules and the GA4 channel
• Critical, warning and pass levels, and merge tags marked as unverifiable rather than broken
• Optional redirect check: do your UTMs survive the redirect?

WHATSAPP LINKS
• wa.me click-to-chat links with a pre-filled message
• A tagged landing-page link inside the message (UTMs on the wa.me link itself never reach GA4), plus an optional ref code
• QR codes for print, packaging and shop windows

TEAMS AND AGENCIES
• Unlimited client workspaces, each with its own approved sources and mediums, locked dropdowns, allowed domains and campaign pattern
• A team rules file in JSON, shared with The Growth Folks® Bulk UTM Link Checker
• Bulk matrix, CSV upload, UTM Cleaner and an email HTML tagger
• Optional short links with your own Bitly, Dub or Rebrandly key, styled QR codes, webhooks to Zapier, Slack or Google Sheets
• Searchable history with CSV and Sheets export

PRIVACY
No account and no server. Your workspaces, rules and history stay in your browser. The extension makes a network request only when you ask it to: to your own shortener when you click Shorten, to the destination page when you run a link or redirect check, or to your own webhook if you set one up. It contains no analytics or tracking.

Made by The Growth Folks®
https://thegrowthfolks.com/tools/utm-builder/
```

---

## Privacy practices tab

### Single purpose

```
UTM Builder & Checker for GA4 helps marketers create and check campaign (UTM) links. It adds UTM parameters to destination URLs, grades existing links on a page, in an email draft or in pasted text against the team's naming rules, and predicts which Google Analytics 4 channel each link will be reported under so mistakes can be fixed before the link is used. Every feature (bulk tagging, WhatsApp click-to-chat links with a tagged website link, history, QR codes, optional shortening and link checks) serves that one purpose: creating, checking and reusing tagged campaign links.
```

### Permission justifications

**activeTab**
```
When the user opens the extension from the toolbar icon, the Alt+U shortcut or the right-click menu, it reads the URL and title of the active tab to pre-fill the destination URL. If the user then clicks "Check links on this page", the same one-time grant lets the extension list the link addresses and link text on that tab to grade their UTM tags. It reads only that one tab, and only after the user acts. We use activeTab instead of the broad "tabs" permission so the extension cannot see other tabs or browsing history.
```

**storage**
```
Stores the user's settings in chrome.storage.local on their device: client workspaces (approved sources and mediums, naming rules, allowed domains, presets, campaign formula, optional shortener API key and webhook URL), general settings, link history and a local activity log. chrome.storage.session holds the half-finished forms so closing the popup doesn't lose them, and passes the URL picked from the right-click menu to the panel. Nothing in storage is sent to us.
```

**contextMenus**
```
Adds three right-click items: "Build UTM link for this link", "Build UTM link for this page" and "Check UTM links on this page". Each opens the side panel with that link or page ready to tag or check.
```

**sidePanel**
```
The extension can be docked in Chrome's side panel so it stays open while the user tags or checks many links. It shows the same interface as the popup.
```

**clipboardWrite**
```
The main output is copying: tagged URLs, parameters, spreadsheet rows, Markdown or HTML links, fixed links from the checker, fixed email HTML, WhatsApp links and messages, short links and bulk results. Each copy happens only when the user clicks a Copy button.
```

**scripting**
```
Used only when the user clicks, in three places:
1. "Check links on this page" and "Check this draft" run a short function in the active tab that returns the href and text of its links (for drafts, only links inside the editable email body). Nothing on the page is changed.
2. "Locate" scrolls to one link and outlines it for 2.5 seconds.
3. "Test landing" (only with live link checks turned on) opens the tagged link in a background tab, reads the final URL and whether a Google Analytics/Tag Manager tag is present, then closes the tab.
No content scripts are registered and nothing runs on pages the user hasn't asked to check.
```

**Optional host permissions: https://mail.google.com/\*, https://outlook.office.com/\*, https://outlook.office365.com/\*, https://outlook.live.com/\*, https://app.hubspot.com/\*, https://app-eu1.hubspot.com/\*, https://\*.mailchimp.com/\*, https://www.klaviyo.com/\***
```
Optional and never requested at install. When the user opens a draft in one of these email editors and clicks "Check this draft", the extension requests access to that one site. With it, the extension reads the links inside the draft's editable body (including editors that render the email in a frame) so it can grade their UTM tags before the user sends. Only link addresses and link text are read, only when the user clicks, and they are processed in the browser and never sent anywhere. The user can remove access at any time in Chrome's extension settings.
```

**Optional host permissions: https://api-ssl.bitly.com/\*, https://api.dub.co/\*, https://api.rebrandly.com/\***
```
Optional, and requested only when the user picks that provider as their link shortener in Settings and clicks "Allow access to provider". The extension then sends the tagged URL to that provider's API with the user's own API key, to create a short link (optionally with a custom ending) and, when the user clicks "Clicks" in History, to read that link's click count. Without this permission no request is made to the provider.
```

**Optional host permissions: https://\*/\* and http://\*/\***
```
Optional and never requested at install. Requested in three cases, each from a control the user clicks:
1. "Live link checks" in Settings, or "Check redirects" in the checker: the extension sends a HEAD request (or a GET if HEAD is rejected), without cookies, to the links being checked, at most 25 per run, to show 404s and whether redirects drop the UTM parameters. The same permission lets "Test landing" open a link in a background tab and lets page checks work from the side panel on any tab.
2. Webhook: when the user enters their own https webhook URL (Zapier, Make, Slack or Google Apps Script) and clicks "Allow this webhook", only that origin is requested. Each link the user copies is posted to it.
A broad pattern is needed because destinations and webhooks can be any site the user chooses. The extension never changes web pages and has no content scripts.
```

**Optional permission: tabs**
```
Optional, and requested only when the user turns on "Side panel follows the tab you're on" in Settings. It lets the docked side panel update the destination URL when the user switches tabs. It is not requested at install.
```

**Content scripts:** none (the scripting permission only runs on-click functions described above). **Commands:** `_execute_action` (Alt+U) opens the popup.

### Remote code

```
No, I am not using remote code.
```
(Verified: all JavaScript ships in the package, including the vendored MIT QR-code library in src/vendor/qrcode.js. Inter is bundled in src/fonts. There is no eval, no new Function, no remotely loaded script and no remote CSS or fonts.)

### Data usage

Nothing is ever sent to The Growth Folks®. We run no server, analytics or telemetry.

| CWS category | Tick? | What happens |
|---|---|---|
| Personally identifiable information | No | Not collected. The optional "Your name" setting stays on the device and is only added to the user's own history, activity log and webhook. |
| Health information | No | Not handled. |
| Financial and payment information | No | Not handled. |
| **Authentication information** | **Yes (recommended)** | If the user sets up a shortener, the API key they enter is stored locally and sent only to that provider when they click Shorten, Test or Clicks. Exports leave the key out. |
| **Personal communications** | **Yes (recommended)** | "Check this draft" reads the link addresses and link text in an open email draft, only when the user clicks, on a site they allowed. Pasted email HTML is processed the same way. This data stays in the browser and isn't stored after the check. |
| Location | No | Not handled. The WhatsApp country code comes from the browser's language setting and is stored locally. |
| **Web history** | **Yes (recommended)** | On the user's action, the active tab's URL and title pre-fill the form; built links (with page titles) are saved in a local history the user can search, export or clear. A URL leaves the device only for Shorten, a link/redirect check or the user's own webhook. |
| User activity | No | Nothing is monitored. The local activity log records the user's own actions in the extension and stays on the device unless exported. |
| **Website content** | **Yes (recommended)** | Only on click: page checks read link addresses and link text of the open page; "Test landing" reads the final URL and whether an analytics tag ID is present. Results stay in the browser. |

Ticking these is the conservative choice. Make sure the privacy policy at https://thegrowthfolks.com/tools/utm-builder/privacy/ says the same thing.

**Certifications** (tick all three; they are true):
- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

### URLs

- **Homepage URL:** https://thegrowthfolks.com/tools/utm-builder/
- **Support URL:** https://thegrowthfolks.com/tools/utm-builder/ (support email: team@thegrowthfolks.com)
- **Privacy policy URL:** https://thegrowthfolks.com/tools/utm-builder/privacy/

---

## Reviewer notes / test instructions

```
No account, login or API key is needed to test the core features.

1. Install the extension. A welcome page (thegrowthfolks.com/tools/utm-builder/welcome/) opens once, on first install only.
2. Open any web page, e.g. https://example.com/, and click the toolbar icon (or press Alt+U). The destination URL is filled in from the current tab.
3. Build tab: type Source = facebook, Medium = paid_social, Campaign = test. The bar reads "✓ Pass · GA4 channel: Paid Social" with the reason. Change Source to "meta": it reads "! Warning · Paid Other" with a one-click "Use "facebook"" fix.
4. Check tab → This page → "Check links on this page": every link on the page is listed with Critical / Warning / Pass. Click "Locate" on a result to highlight it on the page.
5. Check tab → Paste: paste this and click Check:
   https://example.com/?utm_source=Newsletter&utm_medium=Email#top https://example.com/#utm_source=x
   Both links are flagged, with fixed versions to copy.
6. WhatsApp tab: enter a number and message; the wa.me link updates and contains a tagged website link. Click "QR code".
7. Optional features (no need to test): "Check this draft" asks for access to the email site (Gmail, Outlook, HubSpot, Mailchimp or Klaviyo) on first use; "Check redirects" and "Live link checks" ask for the optional http/https permission; a link shortener asks for its provider's host and needs the user's own key; a webhook asks for the one origin entered; "Side panel follows the tab" asks for the optional tabs permission.

The extension has no content scripts and makes no network requests unless the user clicks Shorten, Clicks, Check link, Check redirects or Test landing, turns on live link checks, or sets up their own webhook.
```
