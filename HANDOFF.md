# Handoff to the website: UTM Builder & Checker for GA4 (v0.3.0)

For the `shadabkhansir/web` session. This replaces the `utm-builder` entry in `src/data/tools.ts`. Fields follow the `Tool` interface there. The slug is unchanged, so `/tools/utm-builder/`, `/tools/utm-builder/privacy/` and `/tools/utm-builder/welcome/` keep their URLs.

- **Repo / branch:** `shadabkhansir/utm-builder`, branch `claude/utm-builder-checker` (PR into `claude/epic-galileo-qwenfn`).
- **Chrome Web Store:** not live yet. Show "Coming soon" and leave `storeUrl` empty.
- **Pricing:** everything is free. No paid plan, no account, no licence check in the code. Don't show a Pro or pricing section on the landing page.
- **Screenshots:** `store/screenshots/*.png` (1280×800). Copy them to `src/assets/tools/utm-builder/` on the website. Alt text is in `store/screenshots/alt-text.json` and below.
- **Privacy page:** generated from `data` below. It now covers the email draft check and the redirect check, so regenerate it.

## Entry (paste into `src/data/tools.ts`)

```ts
  {
    slug: 'utm-builder',
    name: 'UTM Builder & Checker for GA4',
    kind: 'extension',
    status: 'beta',
    category: 'analytics',
    summary: 'Build and check UTM links for GA4: channel prediction, page and email link checker, WhatsApp links, team rules, bulk and QR.',
    headline: 'UTM Builder and UTM Checker for GA4, in your browser',
    intro: "UTM Builder & Checker is a free Chrome extension from The Growth Folks®. Build a tagged link and see which GA4 channel it will land in, and why, before you share it. Check the links already on a page, in an email draft or in pasted HTML, and fix them in one click. Everything stays in your browser, with no account and no server.",
    features: [
      { title: "GA4 channel prediction, with the reason", body: "Every link is checked against Google's default channel group rules for manual traffic, including Paid Other and the newer AI Assistant channel, using Google's official source list. You see the channel and the rule that decided it, with one-click fixes for Unassigned, Paid Other and paid traffic counted as organic." },
      { title: "UTM checker for any page", body: "Grade every link on the open page as Critical, Warning or Pass: missing UTMs, UTMs after #, a second ?, broken or encoded macros, double encoding, mixed case, click IDs, duplicates and your team's naming rules. Locate any link on the page with one click." },
      { title: "Check email links before you send", body: "Check the links in a draft in Gmail, Outlook on the web, HubSpot, Mailchimp or Klaviyo, or paste a whole email's HTML and copy back the fixed version. Merge tags are marked as unverifiable, not broken. An optional redirect check shows whether your UTMs survive." },
      { title: "WhatsApp click-to-chat links", body: "Build wa.me links with a pre-filled message and a tagged website link inside it, because UTMs on the wa.me link itself never reach GA4. Add a ref code and download a QR code for print, packaging or shop windows." },
      { title: "Team rules file", body: "One JSON rules file per client: approved sources and mediums (optionally locked), allowed domains, campaign pattern, casing and click-ID rules. Import it with a preview of what will change. The same file works in our Bulk UTM Link Checker on the website." },
      { title: "Bulk, QR and every copy format", body: "Bulk matrix, CSV upload, UTM Cleaner and an email HTML tagger, each with a GA4 verdict per row. Copy a full URL, parameters for Meta or a Google Ads final URL suffix, a Sheets row, Markdown or HTML. Styled QR codes and short links with your own Bitly, Dub or Rebrandly key." },
    ],
    steps: [
      "Add UTM Builder & Checker to Chrome (the Chrome Web Store listing is coming soon) and pin it to your toolbar.",
      "Open the page you want to promote and click the icon (or press Alt+U). Enter source, medium and campaign and watch the GA4 channel and its reason update as you type.",
      "Copy the link in the format you need, or make a QR code or short link.",
      "Open the Check tab to grade every link on a page, in an email draft or in pasted HTML, then copy the fixed links.",
      "In Settings, create a workspace per client or import your team rules file so everyone uses the same names.",
    ],
    faqs: [
      { q: "Is UTM Builder & Checker free?", a: "Yes. Every feature is free, and there is no account or sign-up." },
      { q: "How accurate is the GA4 channel prediction?", a: "It implements Google's published default channel group rules for manually tagged traffic (as of 13 May 2026) and Google's official source list. Custom channel groups in your own GA4 property aren't taken into account." },
      { q: "Does it read my emails?", a: "No. The email check only runs when you click \"Check this draft\" on a draft you have open, and only after you allow that one site. It reads the link addresses and link text inside the draft body, checks them in your browser and sends nothing anywhere." },
      { q: "Why don't UTMs on a wa.me link show up in GA4?", a: "The wa.me link opens WhatsApp, not your website, so GA4 never sees it. Put a tagged link to your website inside the message instead. The WhatsApp tab does this for you with a {link} placeholder." },
      { q: "Why does it ask for access to all websites?", a: "It doesn't at install. That permission is optional and only requested if you turn on Live link checks or click Check redirects, which send a request without cookies to the links you're checking to find 404s and redirects that drop UTMs." },
    ],
    tactics: ['utm-naming-convention', 'tracking-audit-before-scaling', 'retargeting-site-visitors'],
    data: {
      collected: [
        'Nothing is sent to The Growth Folks®. There is no account, analytics or tracking inside the extension.',
        'Only when you ask: clicking Shorten sends the tagged link and your API key to the shortener you chose; a link or redirect check sends a request (without cookies) to the links being checked; a webhook you set up receives each link you copy.',
        'Page and email draft checks read link addresses and link text in your browser, only when you click. They are not stored after the check and never leave your device.',
      ],
      storage:
        "chrome.storage.local and chrome.storage.session, on your device only. Your workspaces, rules, link history (including page titles and WhatsApp links), activity log and any shortener API key stay on your device. Clearing history or removing the extension deletes it. The online version on this page keeps your last inputs in your browser’s local storage.",
      thirdParties: [
        "Your chosen link shortener (Bitly, Dub or Rebrandly), only when you click Shorten or Clicks. It receives the tagged URL and your API key.",
        "The websites you check, only when you run a link check, redirect check or landing test. They receive a request without cookies.",
        "Your own webhook (Zapier, Make, Slack or Google Sheets), only if you set one up. It receives each link you copy.",
      ],
      permissions: [
        { name: "activeTab", why: "Reads the URL and title of the tab you're on when you open the extension, to pre-fill the destination. When you click \"Check links on this page\", it lets the extension read that tab's link addresses and text." },
        { name: "storage", why: "Saves your workspaces, settings, link history and unfinished forms in your browser." },
        { name: "contextMenus", why: "Adds \"Build UTM link for this link / page\" and \"Check UTM links on this page\" to the right-click menu." },
        { name: "sidePanel", why: "Lets you dock the extension in Chrome's side panel while you work." },
        { name: "clipboardWrite", why: "Copies links, parameters, Sheets rows, fixed HTML and WhatsApp messages when you click a Copy button." },
        { name: "scripting", why: "Runs a short, read-only function in the tab when you click Check, Locate or Test landing, to list links, highlight one or read the final URL. Nothing runs on pages you haven't asked to check." },
        { name: "Optional: mail.google.com, Outlook on the web, app.hubspot.com, *.mailchimp.com, www.klaviyo.com", why: "Requested only when you click \"Check this draft\" on that site. Lets the extension read the links inside the draft you have open, including editors that render the email in a frame." },
        { name: "Optional: api-ssl.bitly.com, api.dub.co, api.rebrandly.com", why: "Requested only if you set up a link shortener. Lets the extension create short links and read click counts with your own API key." },
        { name: "Optional: all http/https sites", why: "Requested only if you turn on Live link checks, click Check redirects or set up a webhook (then only that one site). Lets the extension check for 404s and redirects that drop your UTMs, or post links to your webhook." },
        { name: "Optional: tabs", why: "Requested only if you turn on \"Side panel follows the tab you're on\", so the destination URL updates when you switch tabs." },
      ],
    },
    extension: {
      version: "0.3.0",
      webVersion: true,
      screenshots: [
        { src: 'tools/utm-builder/1-build-ga4-channel.png', alt: "Building a UTM link with the predicted GA4 channel and the rule that decided it" },
        { src: 'tools/utm-builder/2-check-page.png', alt: "UTM Checker grading every link on a web page with critical, warning and pass levels" },
        { src: 'tools/utm-builder/3-check-email-draft.png', alt: "Checking the links in an email draft before sending, including a duplicate and a merge tag" },
        { src: 'tools/utm-builder/4-whatsapp-link.png', alt: "WhatsApp click-to-chat link builder with a tagged website link inside the message and a QR code" },
        { src: 'tools/utm-builder/5-team-rules-file.png', alt: "Importing a team rules file in Settings with a preview of what will change" },
        { src: 'tools/utm-builder/6-bulk-matrix.png', alt: "Bulk matrix generating every UTM combination with a GA4 prediction per row" },
      ],
      quickStart: [
        'Open any page you want to promote and click the UTM Builder icon, or press Alt+U.',
        'Pick a source, medium and campaign. Check the GA4 channel and its reason, and accept any suggested fix.',
        'Open Check to grade every link on the page, in an email draft or in pasted HTML before it goes out.',
        'Use WhatsApp to build a click-to-chat link with a tagged website link inside the message.',
        'In Settings, create a workspace per client or import your team rules file.',
      ],
      audiences: [
        "Performance marketers running paid social and search",
        "Email and lifecycle teams checking links before a send",
        "Agencies managing UTM conventions for several clients",
        "D2C and retail teams selling on WhatsApp",
        "Marketing ops and analytics teams cleaning up GA4 attribution",
      ],
    },
    featured: true,
  },
```

Keep the existing `featured` value if it differs. The FAQ about internal links ("Should I add UTMs to links on my own website?") from v0.2 is still true; keep it as a sixth FAQ if the page allows more than five.

## Welcome page

The extension opens `https://thegrowthfolks.com/tools/utm-builder/welcome/` (trailing slash) on first install only. The `quickStart` list above is what it should show.

## Rules file

`docs/RULES_SCHEMA.md` defines `tgf.utm-rules` v1. The website's Bulk UTM Link Checker (`tgf-bulk-utm-checker`, not created yet) should read and write the same file, so a team can export rules from either tool and import them into the other.

## Changelog

**0.3.0**
- Renamed from "UTM Governor" to "UTM Builder & Checker for GA4 – The Growth Folks®" (short name "UTM Builder"). The extension ID, storage keys and the workspace export format are unchanged.
- New Check tab: this page, email draft (Gmail, Outlook on the web, HubSpot, Mailchimp, Klaviyo) and paste, with critical/warning/pass levels, one-click fixes, fixed HTML, CSV, Locate and an optional redirect check.
- New WhatsApp tab: wa.me builder with a tagged website link, ref code, QR code and history.
- Team rules file import (with preview) and export, compatible with the website's Bulk UTM Link Checker.
- GA4 rules kept as data with "as of" date 13 May 2026; every prediction now shows why.
- Right-click "Check UTM links on this page". Contact email changed to team@thegrowthfolks.com.

## Known limitations

- The email draft check runs when you click. It doesn't block or intercept Send. Gmail and Outlook layouts change often; if a draft isn't found, use Paste.
- The redirect check shows the final URL and whether UTMs survived, not every hop. Up to 25 links per run.
- Predictions use Google's default channel group. Custom channel groups in a GA4 property aren't read.
- No cloud sync yet. Teams share rules with the rules file, workspace codes or JSON.
- The interface is English only.
