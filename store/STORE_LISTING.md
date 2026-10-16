# Chrome Web Store listing: UTM Governor by The Growth Folks®

Everything below is ready to paste into the Chrome Web Store developer dashboard. It was written against the code in this repo (manifest v0.2.0); if the manifest or the network code changes, update the permission and data sections to match.

---

## Store listing tab

**Name** (from manifest)
UTM Governor by The Growth Folks®

**Summary** (manifest `description`, 123 characters)
GA4-safe UTM links in one click: channel prediction, naming rules, client workspaces, bulk matrix, QR. By The Growth Folks®

**Category:** Tools (alternative: Workflow & Planning)

**Language:** English

**Detailed description**

```
Build UTM links that GA4 actually understands, and see which channel each link will land in before you ship it.

UTM Governor is the Chrome extension version of the free UTM builder from The Growth Folks®. It sits in your toolbar or side panel, picks up the page you're on, and checks every link against Google Analytics 4's default channel rules while you type.

WHY IT EXISTS
A single wrong value quietly breaks your reporting. "utm_source=meta" isn't on GA4's social list, so paid Meta spend tagged that way shows up as Paid Other. A medium like "fb_ads" with source "facebook" gets counted as Organic Social. UTM Governor catches these before the link goes live and offers a one-click fix.

FEATURES
• GA4 channel prediction: follows Google's published rules for manual traffic, including the newer AI Assistant and Paid Other channels, and uses Google's official source list
• One-click fixes for Unassigned, Paid Other and paid-traffic-counted-as-organic mistakes
• Clean URLs: keeps your existing parameters and #anchors intact, strips click IDs (fbclid, gclid, msclkid, _gl …) and old UTMs
• Naming rules: force lowercase, replace spaces, strip special characters, required fields
• Client workspaces: each one has its own approved sources and mediums (optionally locked to a dropdown), allowed domains, presets and campaign-name formula
• Campaign-name formulas such as [date:yyyy-mm]_[product]_[region|uae,ksa] that turn into small inputs and dropdowns
• Ad-platform macros for Meta, Google Ads, Microsoft Ads, TikTok and LinkedIn, inserted without being encoded
• Copy as full URL, parameters only (for Meta "URL parameters" or a Google Ads final URL suffix), Google Sheets row, Markdown or HTML
• Bulk matrix: landing pages × sources × mediums × campaigns × content, with a GA4 prediction on every row. Copy to Sheets or download a CSV
• Email HTML tagger: adds UTMs to every link in an email's HTML, skipping mailto:, anchors and ESP merge tags
• QR codes: download as PNG (1024 px) or SVG, generated on your device
• Optional link check that spots 404s and redirects that drop your UTMs
• Optional link shortening with your own Bitly, Dub or Rebrandly API key
• Searchable link history with CSV and Sheets export
• Share a workspace with your team as a JSON file (API keys are never included)
• Right-click any link or page to tag it. Keyboard shortcut: Alt+U

WHO IT'S FOR
Performance marketers, agencies that manage several clients, growth and lifecycle teams, and anyone whose GA4 reports are full of "(not set)" and Unassigned traffic.

PRIVACY
UTM Governor has no account and no server. Your workspaces, rules and link history are stored in your browser. The extension sends a network request only when you ask it to: to your own shortener with your own key when you click Shorten, or to the destination page when you check a link. It has no analytics or tracking.

Made by The Growth Folks®
https://thegrowthfolks.com/tools/utm-builder
```

---

## Privacy practices tab

### Single purpose

```
UTM Governor helps marketers build correctly tagged campaign (UTM) links. It adds UTM parameters to a destination URL, applies the team's naming rules, and predicts which Google Analytics 4 channel the link will be reported under so mistakes can be fixed before the link is used. Every feature (bulk tagging, link history, QR codes, optional shortening, link and landing-page checks, and auditing existing tagged links) serves that one purpose: creating, checking and reusing tagged links.
```

### Permission justifications

**activeTab**
```
When the user opens UTM Governor from the toolbar icon, the Alt+U shortcut or the right-click menu, the extension reads the URL and title of the active tab so it can pre-fill the "Destination URL" field with the page the user wants to tag. If the user then clicks "Scan this page" on the Audit tab, the same one-time grant lets the extension list the link addresses and link text on that page to check their UTM tags. It reads only that one tab, only after the user acts. We use activeTab instead of the broad "tabs" permission so the extension cannot see the user's other tabs or browsing history.
```

**storage**
```
Stores the user's settings in chrome.storage.local on their device: client workspaces (approved sources and mediums, naming rules, allowed domains, presets, campaign-name formula, and an optional shortener API key the user enters), general settings, and the history of links they built. chrome.storage.session holds the half-finished form so closing the popup doesn't lose it, and passes the URL picked from the right-click menu to the panel. Nothing in storage is sent to us.
```

**contextMenus**
```
Adds two right-click menu items, "Build UTM link for this link" and "Build UTM link for this page". Choosing one opens the side panel with that link's URL (or the page URL) already filled in as the destination.
```

**sidePanel**
```
The builder can be docked into Chrome's side panel (the ⇥ button, or automatically from the right-click menu), so it stays open while the user tags many links or copies values from the page. The side panel shows the same UI as the popup.
```

**scripting**
```
Used only on the user's click, in two places. (1) "Scan this page" on the Audit tab runs a one-line function in the active tab that returns the href and text of the page's links, so the extension can grade their UTM tags against the user's naming rules; nothing on the page is changed. (2) "Test landing", available only after the user turns on live link checks, opens the tagged link in a background tab, waits for it to load, reads the final URL and whether a Google Analytics/Tag Manager tag is present, then closes the tab. No content scripts are registered and nothing runs on pages the user hasn't asked to check.
```

**clipboardWrite**
```
The main output is copying: the tagged URL, the parameters only, a spreadsheet row, a Markdown or HTML link, a short link, bulk results for Google Sheets, and tagged email HTML. Each copy happens only when the user clicks a Copy button.
```

**Optional host permission: https://api-ssl.bitly.com/\***
```
Optional, and requested only when the user picks Bitly as their link shortener in Settings and clicks "Allow access to provider". The extension then sends the tagged URL to Bitly's API, using the user's own Bitly API key, to create a short link in the user's own Bitly account. Without this permission no request is made to Bitly.
```

**Optional host permission: https://api.dub.co/\***
```
Optional, and requested only when the user picks Dub as their link shortener in Settings and clicks "Allow access to provider". The extension then sends the tagged URL to Dub's API, using the user's own Dub API key, to create a short link in the user's own Dub account. Without this permission no request is made to Dub.
```

**Optional host permission: https://api.rebrandly.com/\***
```
Optional, and requested only when the user picks Rebrandly as their link shortener in Settings and clicks "Allow access to provider". The extension then sends the tagged URL to Rebrandly's API, using the user's own Rebrandly API key, to create a short link in the user's own Rebrandly account. Without this permission no request is made to Rebrandly.
```

**Optional host permissions: https://\*/\* and http://\*/\***
```
Optional, and never requested at install. Requested in three cases, each from a Settings control the user turns on:
1. "Live link checks": the extension sends a HEAD request (or a GET if the server rejects HEAD) to the destination link the user is tagging, with cookies left out, to show whether it returns a 404 or redirects somewhere that drops the UTM parameters. The same permission lets "Test landing" open that link in a background tab and read its final URL, and lets "Scan this page" work in the side panel on any tab.
2. Webhook: when the user enters their own https webhook URL (Zapier, Make, Slack or a Google Apps Script) and clicks "Allow this webhook", only that one origin is requested, and each link the user copies is posted to it.
A broad pattern is needed because the destination and the webhook can be any site the user chooses. The extension never changes web pages and has no content scripts.
```

**Optional permission: tabs**
```
Optional, and requested only when the user turns on "Side panel follows the tab you're on" in Settings. It lets the docked side panel update the Destination URL when the user switches tabs, so they can tag page after page without clicking the toolbar icon each time. It is not requested at install.
```

**Content scripts:** none (the scripting permission only runs on-click functions described above). **Commands:** `_execute_action` (Alt+U) opens the popup. This is a keyboard shortcut, not a permission.

### Remote code

```
No, I am not using remote code.
```
(Verified: all JavaScript ships in the package, including the vendored MIT QR-code library in src/vendor/qrcode.js. There is no eval, no new Function, no remotely loaded script, and no remote CSS or fonts. The only network calls are fetch() requests to the user's chosen shortener API (to shorten and to read click counts), to the link being checked, and to the user's own webhook URL.)

### Data usage

Which user data the extension handles, based on the code. Nothing is ever sent to The Growth Folks®. We run no server, analytics or telemetry.

| CWS category | Tick? | What happens |
|---|---|---|
| Personally identifiable information | No | Not handled. |
| Health information | No | Not handled. |
| Financial and payment information | No | Not handled. |
| **Authentication information** | **Yes (recommended)** | If the user sets up a shortener, the API key they enter is stored locally in chrome.storage.local and sent only to that provider (Bitly, Dub or Rebrandly) in the request header when they click Shorten or Test. Workspace exports leave the key out. |
| Personal communications | No | The email-HTML tagger works on HTML the user pastes in. It runs entirely on the device and is never sent anywhere. |
| Location | No | Not handled. |
| **Web history** | **Yes (recommended)** | On the user's action (opening the popup, the right-click menu, or the "use current tab" button), the URL and title of the active tab are read to pre-fill the form. The links the user builds, with that page title, are saved in a local history the user can search, export or clear. A tagged URL leaves the device only when the user clicks Shorten (it goes to their own shortener), runs a link check or landing test (the request goes to the destination URL itself), or has set up their own webhook (each copied link record is posted to it). |
| User activity | No | Nothing is monitored. The Settings page keeps a local activity log of the user's own actions inside the extension (links created, rules changed, imports, approvals), with the name they typed in Settings; it stays on the device unless the user exports it. |
| **Website content** | **Yes (recommended)** | Only on click: "Scan this page" reads the link addresses and link text of the open page, and "Test landing" reads the final URL and whether an analytics tag ID is present. Results are shown to the user and never sent anywhere. |

Ticking "Authentication information", "Web history" and "Website content" is the conservative choice. The data never reaches the developer, but some of it does leave the device when the user asks (to their shortener, or as a request to the destination URL), and CWS reviewers prefer disclosure. If you'd rather not declare them, the argument is that only the user's own chosen service receives it. Choose one approach and make sure the privacy policy says the same thing.

**Certifications** (tick all three; they are true):
- [x] I do not sell or transfer user data to third parties, outside of the approved use cases
- [x] I do not use or transfer user data for purposes that are unrelated to my item's single purpose
- [x] I do not use or transfer user data to determine creditworthiness or for lending purposes

### URLs

- **Homepage URL:** https://thegrowthfolks.com/tools/utm-builder
- **Support URL:** https://thegrowthfolks.com/tools/utm-builder (support email: team@thegrowthfolks.com)
- **Privacy policy URL:** https://thegrowthfolks.com/tools/utm-builder/privacy

---

## Reviewer notes / test instructions

```
No account, login or API key is needed to test the core features.

1. Install the extension. A welcome page (thegrowthfolks.com/tools/utm-builder/welcome) opens once. This happens on first install only, not on updates.
2. Open any web page, e.g. https://example.com/, and click the UTM Governor toolbar icon (or press Alt+U). The Destination URL field is filled in from the current tab.
3. Type Source = facebook, Medium = paid_social, Campaign = test. The green bar reads "GA4 channel: Paid Social" and the tagged URL appears below. Click "Copy URL".
4. Change Source to "meta". The bar turns amber and reads "Paid Other", with a one-click "Use "facebook"" fix.
5. Right-click any link on a page and choose "Build UTM link for this link". The side panel opens with that link as the destination.
6. Bulk tab: enter a URL, two sources and a medium, then click Generate to see the link matrix. The History tab lists every link you copied.
7. Audit tab → "Scan this page" lists the tagged links on the open page with any naming or GA4 problems.
8. Optional features (no need to test): Settings → "Live link checks" asks for the optional http/https host permission (also used by "Test landing"); Settings → Link shortener asks for the chosen provider's host permission and needs the user's own API key; Settings → Webhook asks for the one origin the user enters; Settings → "Side panel follows the tab you're on" asks for the optional tabs permission.

The extension has no content scripts and makes no network requests unless the user clicks Shorten, Check link or Test landing, turns on live link checks, or sets up their own webhook.
```
