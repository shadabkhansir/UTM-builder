# Competitor research: UTM builders, UTM checkers and WhatsApp link builders

For: UTM Builder & Checker for GA4 – The Growth Folks® (Chrome extension, v0.2)
Research date: **2026-10-16**. All prices and Chrome Web Store (CWS) figures were checked on 2026-10-16 unless marked otherwise.

## How to read this document

- Every fact has a source URL. CWS figures (users, rating, number of ratings, last updated, version) were read from the public CWS detail page HTML at `https://chromewebstore.google.com/detail/<id>` on 2026-10-16.
- **"unverified"** means the figure comes from a third party (G2, Capterra, review blogs) or the vendor page was ambiguous. **"not found"** means we looked on the cited page and the feature was not mentioned. That does not prove the feature is missing.
- **"Page inspection"** UX teardowns describe what the page shows (fields, labels, buttons, copy). They were not hands-on clicking sessions.
- Where CWS shows no user count, the listing displays none. This usually means very few installs.
- Publisher names that are personal names are left out on purpose. Listings are identified by their CWS ID.
- We could not run a GitHub repository search from this session (the API was blocked). GitHub coverage is limited to what web search returned.

---

## 1. Summary of the landscape

| Segment | Players | Typical price | What they have in common |
|---|---|---|---|
| Governance platforms (team UTM rules, approval, audit) | UTM.io, Terminus Hub, CampaignTrackly, Uplifter, Claravine, UTMConfig, Express UTM-Builder | $15–$200+/month, or demo-only | Account required, cloud sync, rules and picklists. Most have no GA4 channel prediction. |
| Shorteners with a UTM builder | Bitly, Rebrandly, Dub | Free tiers capped at 5–25 links a month. Paid from $8–$30 a month. | Monthly link caps, branded domains and QR codes are the paywall. |
| Free single-link builders | Google Campaign URL Builder, HubSpot tracking URL (paid hub), many small CWS extensions | Free | No rules, no checking. Many extensions have few users and are abandoned. |
| UTM / link checkers | Email Link Checker (CWS), Campaign Link Preflight (CWS), UTM Channel Checker (CWS), GA4 UTM Channel Checker (CWS), CampaignTrackly UTM Checker (web), SourceLoop validator (web), Litmus, Mailgun Inspect (formerly Email on Acid), Mailchimp Link Checker | Free to $500/month | Fragmented. Email QA suites are expensive. Free checkers check one URL or one page, and only a few predict GA4 channels. |
| WhatsApp click-to-chat generators | wa.link, RichAutomate, LeadTrapper, ALLO and several tiny CWS extensions | Free (wa.link Premium is $9 a year per link) | Phone number plus message gives a link and a QR code. UTM support is rare and confused. |

---

## 2. Governance and team platforms

### 2.1 UTM.io

- **What it does:** A web app plus Chrome extension for building, saving and governing UTM links. It covers templates, rules ("conventions"), a shortener (UTM.guru or a branded domain), QR codes and workspaces. Sources: https://web.utm.io/ and https://web.utm.io/pricing/
- **Target user:** Marketing teams and agencies that need shared conventions. Enterprise adds global teams across workspaces (https://web.utm.io/).
- **Pricing (checked 2026-10-16, https://web.utm.io/pricing/):**
  - Starter: free forever. 3 templates, 1 workspace, 25 new links a month, unlimited users and clicks, UTM.guru shortener, dynamic QR codes, Chrome extension.
  - Plus: $19/month, or $16/month billed yearly. 5 templates, 1 branded shortener, limited UTM rules, custom QR design, bulk builder, user roles, Bitly integration.
  - Professional: $69/month, or $58/month yearly. 10 templates, standard UTM rules, workspace admin permissions, Zapier, API.
  - Business: $159/month, or $133/month yearly. 30 templates, 2 workspaces, custom parameter rules, global admin panel, dynamic variables, "pretty names", UTM cleaner.
  - Enterprise: contact sales. Unlimited templates, 3 workspaces, UTM conventions, attributes. SSO is an add-on at $2,000 a year.
  - API limits: 20 requests a minute, 600 an hour, 7,200 a day.
  - All paid plans have a 14-day trial with Enterprise features and a 30-day money-back guarantee. The yearly discount is labelled both "2 months free" and "20%", which do not match each other.
- **Chrome extension** `eoaapiimcaimddnfhfnifgkinmpcbccp`: 10,000 users, 4.5 stars from 34 ratings, updated 11 August 2026, version 2026.8.16639 (https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp). The listing says: "No sign up or sign in required to use UTM Extension". Listed features include bulk create, branded shortener, templates, template sync across the team, auto-filled current URL, Bitly and "Save all links and user activity to your account".
- **Onboarding:** "Start Free" or "Signup with Google" on the website (https://web.utm.io/). The page does not say whether a card is needed for the trial (unverified).
- **Standout features:** Conventions that can "Require, lock, hide, and validate specific parameters and attributes", "Enforce lowercase uppercase, spaces, etc.", "Prohibit characters and symbols", and per-user or delegated rules (https://web.utm.io/conventions/). There is also a UTM cleaner on Business.
- **Weaknesses:** Real rules start at Plus ($19) and get stronger at Professional ($69) and Business ($159). The free plan allows 25 links a month. No GA4 channel prediction was found on the home page or the conventions page, and regex rules are not mentioned. Only 3 workspaces even on Enterprise.
- **Key screens (from the vendor pages):** link builder form, link dashboard grouped by parameter, conventions and rules admin, templates, QR designer.

### 2.2 Terminus Hub (terminusapp.com / terminus.app)

- **What it does:** A UTM and campaign governance platform. You define "fields, picklists, and taxonomies once, with the rules attached". Picklists are "Hierarchical, conditional, automated". Approval workflows mean "Records only go live when someone signs off". A grid mode builds governed URLs in bulk. It also has branded short links, styled QR codes, click analytics and an AI-assistant connection (Claude or ChatGPT). Source: https://terminusapp.com/ (pages under terminus.app/governance-models/ and terminus.app/short-links/).
- **Target user:** Teams and enterprises that need approval and governance.
- **Pricing (checked 2026-10-16, https://terminusapp.com/pricing):** "Terminus Classic is no longer sold to new customers."
  - Professional: $40/month, or $30/month billed yearly ($360 a year). 1 user, $20 per extra user ($15 yearly), 3 workspaces, 3 custom domains, bulk up to 25 records, 1 year of click history, API.
  - Business: $200/month, or $150/month yearly ($1,800 a year). 10 workspaces and 10 domains, bulk up to 1,000 records, scoped workspaces, approval workflows, outbound connectors, automated picklists.
  - Enterprise: custom price. SSO and SAML, and an audit log marked "Coming soon".
  - Every plan has unlimited links, short URLs and QR codes.
  - **No free plan.** The 21-day Business trial needs no card. If you do not subscribe when the trial ends, the account locks and links stop redirecting.
- **Chrome extension** "Terminus UTM Builder" `cpibiaebckfaajijhjhkfmedpnagcmmo`: 239 users, no ratings, updated 3 June 2022, version 3.0.0 (https://chromewebstore.google.com/detail/cpibiaebckfaajijhjhkfmedpnagcmmo). The listing says it "Requires Terminus account". It also says you can "Add UTM tracking to all URLs in your emails with a couple of clicks". This extension is for the Classic product.
- **Standout features:** Approval workflow, conditional picklists, bulk grid, AI-assistant drafts.
- **Weaknesses:** Expensive per seat. Nothing is free. Links break if you stop paying. The extension has not been updated since 2022. The home page does not mention GA4 channel prediction, link checking or Adobe. The pricing page lists the audit log as "Coming soon", which conflicts with the governance page's "Full audit trail".
- **Key screens:** governance model editor (fields and picklists), grid bulk builder, approval queue, analytics grouped by governance fields.

### 2.3 CampaignTrackly

- **What it does:** UTM generator, URL builder and shortener with templates, "One-click Conventions", bulk operations, building URLs inside HubSpot or Mailchimp, an Excel add-in, a browser extension and 25+ integrations (https://www.campaigntrackly.com/pricing-plans/).
- **Target user:** Marketing teams and enterprises (Salesforce, Workfront, Marketo and Slack integration layer on Enterprise).
- **Pricing (checked 2026-10-16, https://www.campaigntrackly.com/pricing-plans/):**
  - URL Builder Pro: "15$/ User /Mo", billed annually. No monthly price is shown.
  - URL Builder Pro + Excel Add-in: $17.99 per user per month, billed annually.
  - Enterprise: "Let's Chat".
  - "Get Started for FREE*" with the footnote "*No credit card required". The trial length is not shown on that page. G2 says 21 days (https://g2.com/products/campaigntrackly/pricing, unverified).
- **Chrome extension** `acidoblgnoinmcobmdfpeoepdkmfoebn`: 390 users, 4.8 stars from 23 ratings, updated 8 March 2023, version 3.7.6 (https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn). The listing calls it "an automated page link grabber that lets you add tracking tags to any page". It says "You need to register to get started".
- **Free web UTM checker:** https://www.campaigntrackly.com/google-utm-checker/. See the teardown in §6.5.
- **Standout features:** Tags every link on a page. Builds URLs inside HubSpot and Mailchimp. Excel add-in.
- **Weaknesses:** Registration required. Annual billing only. The extension has not been updated since March 2023. The pricing page does not map features to plans.

### 2.4 Uplifter

- **What it does:** Link management for campaign tracking. UTM links built from your own taxonomy, short links, QR codes, app deep links, landing-page monitoring, connectors (Google Analytics, Adobe Analytics, Meta Ads, LinkedIn Ads, Looker Studio) and campaign reports. It also has a free single-link builder (https://uplifter.ai/).
- **Target user:** Marketers, analytics teams and agencies.
- **Pricing (checked 2026-10-16, https://uplifter.ai/pricing, GBP, per user):**
  - Startup: £30/month, or £24/month yearly (£288 a year). Up to 5 users, 250 links per user, 1 workspace, 1 connector.
  - Business: £50/month, or £40/month yearly. Up to 10 users, 1,000 links per user, 2 workspaces.
  - Enterprise: £69/month, or £58/month yearly. Also shown as "Contact us" elsewhere on the page. Unlimited users and links, 3 workspaces, open API and SSO.
  - Extra connectors cost £500 a year. "Domain integrations" cost £6,000 per domain per year.
  - No free plan. The page mentions both a "14 day free trial" and a 30-day money-back guarantee. It does not say whether a card is needed.
- **Chrome extension:** none found on CWS (search "uplifter" returned no listing, checked 2026-10-16).
- **Standout features:** Landing-page monitoring, Adobe Analytics connector, upload an existing UTM spreadsheet.
- **Weaknesses:** Per-user GBP pricing. A low link cap on Startup. No browser extension.

### 2.5 Claravine

- **What it does:** An enterprise "data standards" platform. It covers templates, tag validation, "powered lists", field mapping, link generation (Bitly, Branch, QR Code Monkey via connectors), Smart Correct, a Smart Campaign Builder, a Platform API, and Adobe Analytics and Adobe Experience Manager connectors (https://www.claravine.com/pricing/).
- **Pricing:** Not published. "Pricing is a conversation, not a form." Plans are Essential, Premium and Premium Plus, all demo-only with unlimited users (https://www.claravine.com/pricing/).
- **Chrome extension** "Claravine Extension" `dfdbeplahlnccdhcdmemjdndlkkkepmn`: 46 users, 5.0 stars from 1 rating, updated 4 May 2026, version 0.0.40 (https://chromewebstore.google.com/detail/dfdbeplahlnccdhcdmemjdndlkkkepmn). It validates object names in real time inside Meta Ads Manager, Campaign Manager 360 and TikTok Ads Manager against your Claravine taxonomy.
- **Weaknesses for our market:** Enterprise sales only, no self-serve, account and contract required.

### 2.6 UTMConfig

- **What it does:** Standardises campaign, ad-set and ad names from a naming schema (fields, order, separator, casing, abbreviations) and builds UTM URLs that "preserve existing query parameters". It also does bulk CSV generation, parsed in the browser. It does not connect to ad accounts (https://www.utmconfig.com/).
- **Target user:** Agencies and media buyers.
- **Pricing (checked 2026-10-16, https://www.utmconfig.com/, pricing section of the home page):**
  - Free: $0 forever. 1 client, 1 convention, unlimited name generation, UTM builder. "No card required."
  - Pro: $19/month or $190/year. Unlimited clients and conventions, history, bulk CSV, custom UTM mappings.
  - Agency: $49/month or $490/year. Shared workspace, 5 seats, owner, admin and member roles.
- **Onboarding:** Sign up at https://app.utmconfig.com/signup (account required).
- **Chrome extension:** none found on CWS (search "utmconfig", checked 2026-10-16).
- **Weaknesses:** Web app only. No shortener, QR or checking was mentioned.

### 2.7 Express UTM-Builder

- **CWS** `flockfgmfgmpmimlfkkeepkblckodbjg`: 881 users, 4.7 stars from 15 ratings, updated 7 April 2025, version 0.8.15 (https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg).
- **What it does:** A click-based ("button interface") builder that enforces a team convention. Its listing claims complex rules and taxonomy, extra parameters beyond UTMs, Bitly, bulk creation, full history, vanity domains, access control, sharing parts of the convention externally, an API, and "ID based UTM tagging, so that urls are not publicly readable". It also says it works with Adobe Analytics and Matomo.
- **Onboarding:** "Try our demo, with no need to sign up". Pricing was not found on the listing (unverified).

---

## 3. Shorteners with UTM builders

### 3.1 Bitly

- **Pricing (checked 2026-10-16, https://bitly.com/pages/pricing):**
  - Free: $0. 5 short links and 2 QR codes a month, 3 custom back-halves a month. UTM builder not listed.
  - Core: $10/month, annual billing only ($120 a year). 100 links and 5 QR codes a month, UTM builder included, 30 days of click data.
  - Growth: $29/month ($348 a year). 500 links a month, 1 free custom domain, branded links, bulk creation, 4 months of data.
  - Premium: $199/month ($2,388 a year). 3,000 links a month, campaign-level tracking.
  - Enterprise: custom.
- **CWS** "Bitly | Short links and QR Codes" `iabeihobmhlgpkcgjiloemdbofjbdcic`: 500,000 users, 3.2 stars from 1.6K ratings, updated 10 September 2026, version 4.5.3, publisher Bitly Inc (https://chromewebstore.google.com/detail/iabeihobmhlgpkcgjiloemdbofjbdcic). It shortens the current tab in one click and makes QR codes.
- **Weaknesses:** The free plan is close to useless for campaign work (5 links a month). There is no UTM builder on Free. There are no naming rules and no GA4 checks.

### 3.2 Rebrandly

- **Pricing (checked 2026-10-16, https://www.rebrandly.com/pricing):**
  - Free: 10 links and 10 QR codes a month, 1 custom domain (Yourbrand.bio), 100 tracked clicks a month, UTM builder included. No destination edits and no bulk import.
  - Essentials: $11/month billed monthly, or $8/month billed annually. 250 links a month, 2 domains.
  - Professional: $32/month, or $22/month annually. 1,500 links a month, 3 domains, 2+ teammates.
  - Growth: $149/month, or $104/month annually. 3,500 links a month, 10 domains.
  - Enterprise: quote.
  - The page also shows a second, higher set of figures for each plan ($16/$9, $39/$27, $179/$125). We could not tell which option they belong to (unverified).
- **CWS** "URL Shortener by Rebrandly" `eaidebojanpehpceonghnmgdofblnlae`: 70,000 users, 4.0 stars from 188 ratings, updated 6 October 2026, version 5.0.14 (https://chromewebstore.google.com/detail/eaidebojanpehpceonghnmgdofblnlae). Features listed: shorten, QR, "Manage UTM parameters", click tracking.
- **Weakness:** Link caps. UTMs are a side feature with no rules.

### 3.3 Dub (dub.co)

- **Pricing (checked 2026-10-16, https://dub.co/pricing/links):**
  - Free: $0. 25 new links a month, 1K tracked events, 3 custom domains, 1 user, UTM templates, QR codes, API, 30 days of analytics.
  - Pro: $30/month. 1K links, 3 users, UTM builder plus templates, custom QR.
  - Business: $90/month. Advanced: $300/month. Enterprise: custom.
  - The yearly toggle says "10% discount + 12x usage upfront". No yearly prices are shown.
- **Extension:** No official Dub extension was found. A third-party "Dub.co Link Shortener" `ninmnkcainfimpdekpiblgokdbdfipin` has 48 users and was updated 16 May 2025 (https://chromewebstore.google.com/detail/ninmnkcainfimpdekpiblgokdbdfipin).
- **Relevance:** We already support Dub as a bring-your-own-key (BYOK) shortener. Dub's free tier (25 links a month) is the most generous of the three for BYOK users.

---

## 4. Free single-link builders

### 4.1 Google Campaign URL Builder (ga-dev-tools)

- **URL:** https://ga-dev-tools.google/ga4/campaign-url-builder/ (scraped 2026-10-16). Free, no account.
- **UX teardown (page inspection):**
  - **Steps to first result:** 1. Paste the website URL. 2. Type the source. 3. Type the medium. 4. Type the campaign name or ID. The URL is "generated for you" as you type. So 4 fields before anything useful appears.
  - **Fields, in page order:** website URL\*, campaign ID, campaign source\*, campaign medium\*, campaign name, campaign term, campaign content. Helper text includes "The referrer (e.g. google, newsletter)" and "Marketing medium (e.g. cpc, banner, email)".
  - **Confusing parts:**
    - Campaign name has no asterisk but says "One of campaign name or campaign id are required." The required rule is hidden in helper text.
    - The ID field comes before source and medium even though most users never fill it.
    - The validation message "The website URL provided is not a valid URL." shows before the user has typed anything.
    - The reference table says utm_campaign is "Used for keyword analysis", which is misleading.
    - Tab labels at the top read "Web" and "Play" (app campaigns).
  - **What is missing (not visible in the scraped page):**
    - GA4 channel prediction or warnings about "Unassigned".
    - GA4 extra parameters (source_platform, creative_format, marketing_tactic).
    - Templates, history and current-tab capture.
    - Any shortener button.
- **Why it matters:** It is the default free benchmark that many people try first. Anything we add (channel prediction, presets, current tab) is a visible improvement on it.

### 4.2 HubSpot tracking URL builder

- In-product only. Fields are URL, UTM campaign (required), a Source dropdown (Email marketing, Paid search, Organic social, Paid social, Other campaigns), and optional medium, term and content. Actions include "Copy short URL" (https://knowledge.hubspot.com/settings/how-do-i-create-a-tracking-url).
- **Plans:** Marketing Hub or Content Hub Professional and Enterprise, or legacy Marketing Hub Basic. So it is not free. HubSpot plan prices were not checked.
- **Relevance:** A source dropdown mapped to channel is a nice idea, but it is locked inside a paid CRM.

---

## 5. Chrome extensions that build UTM links

All figures were read from the CWS detail page on 2026-10-16.

| Extension (CWS ID) | Users | Rating (count) | Updated | Model | Notable features (from listing) |
|---|---|---|---|---|---|
| **UTM Builder** (`fhfngcdeploenaaeakjdkkacnnjjdhll`) https://chromewebstore.google.com/detail/fhfngcdeploenaaeakjdkkacnnjjdhll | 564 | 4.8 (5) | 4 Oct 2026, v1.2.1 | Free, no account | Side panel; GA4 channel preview with one-click fixes for Unassigned ("names one of 20 channels"); 11 presets for Google Ads, Facebook and Twitter; right-click to tag a link; Bitly BYOK; per-URL tag memory; force lowercase; macros such as `{campaignid}` and `{{campaign.name}}` kept; GA4 extra parameters toggle (campaign ID, source platform, creative format, marketing tactic); JSON template import and export; 52 languages; no history list. Closest feature match to us. |
| **Google Analytics UTM Builder** (`gaidpiakchgkapdgbnoglpnbccdepnpk`) https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk | 50,000 | 4.6 (102) | 11 Jun 2023, v10.2.1 | Free | Unlimited presets grouped by client; "Dynamic sync to cloud"; "presets hub to share with colleagues"; workspaces; GA4 UTMs; force lowercase; Bitly; remembers last set for 60 minutes; "Copy UTM's only"; import and export; docked mode. Largest install base, but not updated for over 3 years. |
| **UTM Link & QR Code Builder by Market Adoption** (`bbhmapdonfafabciokdlnoogebjanohn`) https://chromewebstore.google.com/detail/bbhmapdonfafabciokdlnoogebjanohn | 4 | none | 12 Apr 2026, v1.1 | Free, local | Current-tab prefill; live preview; QR as PNG or SVG with error-correction level; named presets with import and export; recent history. Warns that presets "may be lost when the extension is updated or browser data is cleared". |
| **Campaign URL Builder for Google Analytics (GA4)** (`lmgdpibpdijgpjjdpbcmbaakaimgodab`) https://chromewebstore.google.com/detail/lmgdpibpdijgpjjdpbcmbaakaimgodab | 895 | 5.0 (1) | 16 May 2025 | Free, local | Current tab; presets; "Auto-detect matching presets when you revisit websites"; open in a new tab. |
| **UTM Builder: Campaign URL Tagger** (`pdkdnbpkibdbfjfalddgmpmfjgokldob`) https://chromewebstore.google.com/detail/pdkdnbpkibdbfjfalddgmpmfjgokldob | not shown | none | 3 Aug 2026, v0.1.2 | Freemium: **$15 one-time** Premium | Free: 3 presets, lowercase toggle, warnings, keeps the original encoding of existing parameters. Premium: unlimited presets, `{token}` templates, local history with QR, CSV export with a formula-injection guard. No account. |
| **UTM Generator** (`nigngflgkegdafhhpopodlahplncljhl`) https://chromewebstore.google.com/detail/nigngflgkegdafhhpopodlahplncljhl | 850 | 5.0 (4) | 25 Mar 2024 | Free | Basic generator. |
| **Express UTM-Builder** | 881 | 4.7 (15) | 7 Apr 2025 | Account or demo | See §2.7. |
| **Just UTM Builder** (`accnjdgmnmkalggbdbnkhdkkkahdaima`) https://chromewebstore.google.com/detail/accnjdgmnmkalggbdbnkhdkkkahdaima | 11 | none | 22 Mar 2023 | Free | Zero permissions; remembers last parameters. |
| **Google Analytics UTM Builder** (open source, `ghhpgbckobngiaohcfljdpbpgcklnggp`) https://chromewebstore.google.com/detail/ghhpgbckobngiaohcfljdpbpgcklnggp | 51 | 5.0 (1) | 4 Mar 2025 | Free | Templates and history. Web search says the source is on GitHub (unverified). |
| **UTM Builder – campaign link generator** (`adjfdibpgojbdeipgdlbajagbmipiobd`) https://chromewebstore.google.com/detail/adjfdibpgojbdeipgdlbajagbmipiobd | 3 | none | 23 Sep 2026 | Free | Current tab; cleans values; local. |
| **UTM Builder – Glass** (`dimibalhbecdnoigibaphoinbcamimcg`) https://chromewebstore.google.com/detail/dimibalhbecdnoigibaphoinbcamimcg | 8 | none | 16 Nov 2025 | Free | Safe encoding; keeps the existing query string. |
| **QR Code Generator with UTM – Analytics Pro** (`bmkfmojdglgakgdckfadalhoookdkeid`) https://chromewebstore.google.com/detail/bmkfmojdglgakgdckfadalhoookdkeid | 12 | none | 17 Aug 2026 | Free | QR codes with UTM fields, logo and colours. |
| **Tracking QR Code Generator** (`mcmchdlcconihfdggenbhdiehcegmnkm`) https://chromewebstore.google.com/detail/mcmchdlcconihfdggenbhdiehcegmnkm | 10 | 5.0 (2) | 29 Sep 2025 | Free | QR code for the current URL with UTMs. |
| **Flyn: URL Shortener with QR Code & UTM Builder** (`jeibijfgphoklbfbpbccaggmjfkpanbn`) https://chromewebstore.google.com/detail/jeibijfgphoklbfbpbccaggmjfkpanbn | 175 | 5.0 (3) | 20 Sep 2026 | "Needs a free account" | One-click shortening of the current tab; slugs; QR; UTM builder; right-click menu. |
| **Short Link Pro** (`fplaplaaoohieiddklklmlghlbckanhk`) https://chromewebstore.google.com/detail/fplaplaaoohieiddklklmlghlbckanhk | 6 | 5.0 (1) | 2 Jan 2026 | Free | is.gd aliases, UTM presets, "Link Health Check" for 404s, bulk processing, QR with logo. |
| **UTM.io**, **Terminus**, **CampaignTrackly**, **Bitly**, **Rebrandly** | see §2–3 | | | | |

**Onboarding pattern:**
- The small extensions need no account: install, open the popup, and the current URL is prefilled.
- UTM.io's extension also works without sign-in.
- Terminus and CampaignTrackly require an account before the extension does anything.
- Flyn needs a free account.

---

## 6. Tools that CHECK or AUDIT existing links

### 6.1 Email Link Checker: Campaign QA & UTM Check (CWS)

- `hlianpkoiglgdkkacoelpjheikcodfje`: 13 users, no ratings, updated 5 September 2026, version 1.0.0 (https://chromewebstore.google.com/detail/hlianpkoiglgdkkacoelpjheikcodfje).
- **What it does:** A pre-send QA side panel for campaigns open in Gmail, Mailchimp or Klaviyo. You press "Check campaign".
- **Statuses:** critical, warning, passed, and "unverifiable".
- **Checks:**
  - 4xx and 5xx responses, timeouts, and the full redirect chain from original to final URL.
  - Empty href, http links, staging and localhost destinations.
  - Required utm_source, utm_medium and utm_campaign; UTM consistency across the campaign; casing, whitespace and duplicated parameters.
  - Merge tags (Mailchimp, Klaviyo, Liquid, HubSpot, Salesforce); placeholders such as lorem ipsum, TODO and example.com.
  - Subject line, preheader, unsubscribe, CTA and Gmail clipping risk.
  - Accessibility; English spell check with a brand dictionary.
  - Domain allowlist; one rule profile per client.
- **"Test Inbox":** You get a temporary address and send a test to it. The tool then parses the raw MIME, re-checks the rewritten tracking URLs, verifies DKIM, and reports SPF, DMARC and List-Unsubscribe.
- **Privacy and onboarding:** No sign-up. Only destination URLs leave the browser, and only when you check status. Shared reports are redacted and expire in 24 hours.
- **What it does not do:** Render in many mail clients, score deliverability, or support Outlook Web.
- **Pricing:** Not stated on the listing (unverified).
- **Relevance:** The most direct competitor to our planned email pre-send check. Its feature list is very deep, but it has almost no users.

### 6.2 Campaign Link Preflight (CWS)

- `ahaialifoklkfcnponppempmgecglaki`: 3 users, no ratings, updated 29 September 2026, version 0.1.4 (https://chromewebstore.google.com/detail/ahaialifoklkfcnponppempmgecglaki).
- **What it does:** A local-first page scan ("Scan this page") with a "Locate" button that highlights each link. Findings are grouped by URL and rule, with Critical, Warning and Info levels.
- **Checks:**
  - Missing source, medium or campaign on links that already carry UTMs.
  - Duplicate or empty UTM parameters.
  - Staging, dev and local destinations.
  - One-character typos in source or medium against repeated values.
  - Casing; test or template values.
- **Scope limits (stated):** Static anchors in the main page only. No redirect following, no HTTP status, no iframes or shadow DOM. Links with no UTMs at all are not flagged.
- **Pricing:** Free for unlimited scans. Markdown report export costs **$29 one-time** via Gumroad. No account is needed, but the licence is verified online.

### 6.3 UTM Channel Checker and GA4 UTM Channel Checker (CWS)

- **UTM Channel Checker** `babdcjccdkaonphgbmhiibjcanalblkl`: 4 users, 5.0 from 1 rating, updated 2 October 2026 (https://chromewebstore.google.com/detail/babdcjccdkaonphgbmhiibjcanalblkl).
  - Paste a URL or pull the current tab. It predicts the GA4 Default Channel Group, shows the matched rule, flags Unassigned risk, and lets you copy the verdict.
  - "It is not a URL builder first and it does not invent QR codes."
- **GA4 UTM Channel Checker** `gilkeeihkhampikhcdfkpeakcbpnbbji`: 31 users, no ratings, updated 22 February 2026 (https://chromewebstore.google.com/detail/gilkeeihkhampikhcdfkpeakcbpnbbji).
  - Two modes: "Full URL or Only UTMs". Predicts the channel and flags Unassigned.

### 6.4 Other on-page UTM inspectors (CWS)

- **UTM Params Checker** `cldpbepggcfgegalhpiccmelepffhemk`: 230 users, updated 19 March 2025. Checks the UTMs in the current URL. The listing is in Chinese (https://chromewebstore.google.com/detail/cldpbepggcfgegalhpiccmelepffhemk).
- **OSOMA – UTM Tracker** `jgcmmbnhhgdkknaiaoicmmapoejffbkk`: 192 users, 5.0 from 1 rating, updated 11 July 2025. Shows the UTMs present when you land on a site (https://chromewebstore.google.com/detail/jgcmmbnhhgdkknaiaoicmmapoejffbkk).
- **UTM Tagger & GA4 Debugger** `menndhdnbbdcikeclcgpmboimepagadj`: 33 users, updated 13 April 2026. Appends UTMs to every URL you visit and toggles GA4 DebugView, for testing (https://chromewebstore.google.com/detail/menndhdnbbdcikeclcgpmboimepagadj).
- **LinkTruth – Link Preview Checker** `himnbonkggcbfdehcebikjkcppgiemib`: no user count, updated 1 January 2026. Hover a link to see its final destination, redirects and affiliate parameters. Consumer safety focus (https://chromewebstore.google.com/detail/himnbonkggcbfdehcebikjkcppgiemib).
- **Google Workspace "UTM Parameter Checker"** add-on: checks the current page against naming rules. Requests Google account and Drive access, and has no reviews (https://workspace.google.com/marketplace/app/utm_parameter_checker/567404007161, via web search; not opened).

### 6.5 Free web checkers (no signup), with UX teardowns from page inspection

**CampaignTrackly "Interactive Google UTM Checker"** (https://www.campaigntrackly.com/google-utm-checker/)

- **Inputs:** Three fields: "1. Medium (The Channel)", "2. Source (The Platform)", "3. Campaign Name". Buttons: "VALIDATE MY TAGS! 🚀" and "RESET".
- **Output:** "Your Link Fragment:" with COPY, then "STRICT ERRORS DETECTED:", "VALID BUT NEEDS ATTENTION:" and "GA4 CHANNEL GROUP:".
- **Friction:** It does not accept a URL, so you have to split a link into its parts yourself. Medium comes first, which is the reverse of most builders. The page never explains the difference between "strict" errors and "attention" items. You get only a fragment, not a full URL. One set of values at a time; no page or bulk scan.

**SourceLoop "GA4 Channel Grouping Validator"** (https://sourceloop.ai/tools/free-ga4-channel-grouping-validator/)

- **Inputs:** Two fields, utm_source and utm_medium, plus 8 preset buttons such as "Google CPC" and "YouTube paid".
- **Output:** A step-by-step rule trace ("1 medium matches paid? ✓", and so on) and fix guidance. 17 channels, checked in priority order.
- **Onboarding:** "No signup, no email gate."
- **Friction:** You cannot paste a full URL. Its source lists are short (10 search engines, 11 social, 5 video) compared with Google's full source-category list. It says its rules match GA4 "as of late 2024". There is a sales pitch on the page.
- **Takeaway:** The rule trace is a good pattern to copy.

**Other web builders that claim GA4 channel prediction** (found by web search, not opened): accs-net.com/utm-builder/ and leadjourney.io/free-tools/google-utm-builder.

### 6.6 Email QA suites and ESP link checkers

**Litmus (now part of Validity)**
- The pre-send checklist validates "links, images, and tracking" and includes a UTM check. Builder has a UTM Manager that applies UTMs to every link (https://www.litmus.com/blog/litmus-101-a-how-to-on-previews-pre-send-checks and https://help.litmus.com/article/377-add-analytics-tracking-in-builder, via search results).
- **Pricing:** https://www.litmus.com/pricing shows no prices, only "contact sales". Third parties report a Core plan at **$500/month** with 5 users and 2,000 previews (https://www.capterra.com/p/178360/Litmus/pricing). They also report that Basic was removed and Plus was renamed Core in August 2025 (https://emailexpert.com/litmus-from-validity-introduces-significant-price-hikes/). All Litmus prices are unverified.

**Email on Acid, now Mailgun Inspect**
- https://www.emailonacid.com/pricing/ now shows Mailgun Inspect plans (checked 2026-10-16).
- Basic: $99/month, 1,000 previews. Link validation is not listed.
- Premium: $199/month, 2,000 previews, "Link and image validation".
- Contract: custom.
- No UTM-specific check is mentioned.

**Mailchimp Link Checker** (built into Mailchimp)
- New builder: Preview, then "Check email links". Legacy builder: "Open Link Checker". It shows each URL with a site preview and an "invalid URL" warning (https://mailchimp.com/help/preview-and-test-your-email-campaign/).
- It cannot check merge-tag, anchor or mailto links, and it is not available for "Code Your Own" templates.
- It does not check UTMs. Mailchimp adds UTMs itself only through its Google Analytics tracking setting (https://matomo.org/faq/how-to-track-mailchimp-email-clicks-in-matomo-using-utm-parameters/).

**Gap:** Paid suites check that links resolve, and Litmus has a UTM check. None of the free ESP checkers validate UTM naming or predict the GA4 channel.

---

## 7. WhatsApp click-to-chat (wa.me) link generators

### 7.1 wa.link (create.wa.link)

- **URL:** https://create.wa.link/
- **Pricing (checked 2026-10-16):** Free "USD $0 Forever"; Premium "USD $9/year per link" (branded wa.link/YourBrand, analytics, editable links, multilink page); Multiagent add-on "USD $5/agent/month". Free links "don't support analytics options".
- **UX teardown (page inspection):**
  - Fields: phone number with a country-code selector (defaults to +1 with a US flag; hint "Remember to check your country code") and "Custom message" (optional).
  - Steps: enter number, add message, press "Generate my wa.link". Output is a short wa.link URL, a QR code and a chat mock-up ("This is how your users will see it"). No registration.
  - Friction: The US default country is wrong for most of the world.
  - Gaps: No UTM support of any kind, and you get a wa.link redirect rather than a plain wa.me link.

### 7.2 RichAutomate Click-to-WhatsApp Link Generator

- **URL:** https://richautomate.in/tools/click-to-whatsapp-link-generator
- **UX teardown (page inspection):**
  - Fields: "Business WhatsApp number" (with + and country code), "Prefilled message" (live counter "43/320"), and four "UTM tracking" fields (utm_source, utm_medium, utm_campaign, utm_content).
  - The tags are written **into the message** as "[src=instagram · med=cpc · cmp=… · cnt=…]" so sales reps can see the source in the chat.
  - The FAQ claims UTMs are also added as URL parameters, but the sample output link shows only `text`. This claim is unverified.
  - Outputs: wa.me link and QR code (PNG). Downloading the "toolkit" requires a lead form.
  - Inconsistent guidance on message length: 90, 160 and 320 characters are all mentioned.

### 7.3 WhatsApp generator extensions (CWS)

| Extension (ID) | Users | Rating | Updated | Notes |
|---|---|---|---|---|
| Click-to-Chat Link & QR Generator by LeadTrapper (`oodebfhfgmihnileefdhacjagngicdej`) https://chromewebstore.google.com/detail/oodebfhfgmihnileefdhacjagngicdej | not shown | none | 13 Oct 2026 | Number plus optional message, then Generate; link and print-size PNG QR; strips a leading + or 00; local only; no UTMs. |
| WA Link Generator (`fgmmhlgbkieebimhondmhbnihhaoccmj`) | 401 | none | 3 Feb 2025 | Custom WhatsApp links. |
| WhatsApp Link Generator (`cpcnmfdapbmmfjfaahbaeombgbikckja`) | 172 | 5.0 (3) | 10 Sep 2024 | Strips non-digits. |
| WhatsApp Link & QR Generator by Spur (`fbfikkhdebfpkpaipeciflglkkepdipi`) | 110 | 5.0 (3) | 5 Aug 2024 | Right-click a selected number and choose "Send via WhatsApp"; QR. |
| WhatsApp Link Generator by ALLO (`bdgihdbjfcglfnejcomnffkpoodafgjm`) | not shown | none | 25 Jul 2026 | Saudi-first (+966), English and Arabic; website buttons. |
| WA Link Generator – Click to Chat (`okngbpenhagadbonchkkfikppeacpbcd`) | 12 | 5.0 (1) | 11 Jun 2026 | Message templates for sales, support, quotations and so on. |
| WhatsApp link generator by Gredich (`igoaogaodefchkpgmobfpghhnjnfdjhe`) | 3 | none | 28 Sep 2026 | Searchable country selector with flags; number validation. |
| WA Link Generator (`abnjnjnmmdebcdhlfnlfogipbnhlgafn`) | 5 | none | 8 Oct 2026 | Paste a number and the chat opens. |

All figures are from `https://chromewebstore.google.com/detail/<id>`, checked 2026-10-16. **None of these extensions offers UTM tagging.**

### 7.4 What tracking on WhatsApp links actually means

- Some help centres describe adding `utm_*` directly to a wa.me URL (https://www.zoko.io/post/track-whatsapp-links-utm-tags and https://support.kommo.com/docs/track-whatsapp-ad-campaigns-with-utms.md).
- respond.io says "WhatsApp link doesn't support UTM tracking" and recommends putting a source reference in the prefilled message instead (https://respond.io/blog/whatsapp-link).
- Linkly tracks clicks on its own redirect, with UTMs and pixels configured on the short link (https://linklyhq.com/release-notes/whatsapp-link-generator, via search; the page itself returned HTTP 429).
- **Our reasoning (not a sourced fact):** A wa.me click opens WhatsApp, not your website, so GA4 never sees UTMs placed on the wa.me URL itself. Three things do work:
  1. UTMs on the **landing-page link inside the prefilled message**.
  2. A **ref code in the message text** that the CRM or agent can read.
  3. A **tracked redirect or short link** in front of the wa.me link.
- We should test this in a GA4 property before we write marketing copy about it.

---

## 8. Feature matrix

**Legend:**
- **Y** = yes (cited above)
- **P** = partial or plan-limited
- **N** = not offered or explicitly excluded
- **?** = not found or unverified
- **C** = in Terminus Classic or the legacy extension only

Matrix A covers the paid or platform tools. Matrix B covers the extensions and free tools. Sources are the sections cited above.

### Matrix A: platforms and shorteners

| Feature | UTM.io | Terminus Hub | CampaignTrackly | Uplifter | Claravine | UTMConfig | Bitly | Rebrandly | Dub | **Us (v0.2 today)** |
|---|---|---|---|---|---|---|---|---|---|---|
| Build single link | Y | Y | Y | Y | Y | Y | P (Core+) | Y | Y | **Y** |
| Auto current-tab URL | Y (ext) | C | Y (ext) | N (no ext) | ? | N | Y (ext, shorten) | Y (ext) | N | **Y** |
| Presets / templates | Y (3 free) | Y | Y | ? | Y | Y (conventions) | ? | ? | Y (templates) | **Y (15 built-in, folders)** |
| Team template sync | Y (cloud) | Y | Y | Y | Y | P (Agency) | N | N | ? | **P (share codes, no cloud)** |
| Naming rules / locked values | Y (Plus+) | Y (picklists) | Y | Y (taxonomy) | Y | Y (schema) | N | N | N | **Y** |
| Regex rules | ? | ? | ? | ? | ? | N | N | N | N | **Y** |
| GA4 channel prediction | ? (not found) | ? | P (web checker) | ? | ? | N | N | N | N | **Y (818-source list, fixes)** |
| GA4 extra params | ? | ? | ? | ? | ? | ? | N | N | N | **Y** |
| Ad macros kept unencoded | ? | ? | ? | ? | ? | ? | N | N | N | **Y** |
| Bulk / CSV | Y (Plus+) | Y (25 / 1,000) | Y | Y | Y | Y (Pro) | P (Growth) | P (paid) | ? | **Y** |
| Email HTML tagging | ? | C | Y (HubSpot/Mailchimp) | ? | ? | N | N | N | N | **Y** |
| Page link checker / audit | N found | N found | Y (ext link grabber) | P (LP monitoring) | Y (ad objects) | N | N | N | N | **Y (page link scan)** |
| Email pre-send check | N | N | ? | ? | N | N | N | N | N | **N (planned)** |
| Redirect check | ? | ? | ? | P (LP monitoring) | ? | N | N | ? | ? | **P (link check / LP test)** |
| Link shortener | Y | Y | Y | Y | P (connectors) | N | Y | Y | Y | **Y (BYOK Bitly, Dub, Rebrandly)** |
| Branded domain | Y (Plus+) | Y | Y | Y (Business+) | P | N | Y (Growth) | Y | Y | **P (via your BYOK account)** |
| QR | Y | Y | ? | Y | P | N | Y | Y | Y | **Y** |
| Styled QR | Y (Plus) | Y | ? | Y (branded) | ? | N | ? | ? | Y (Pro) | **Y (PNG/SVG)** |
| WhatsApp link builder | N | N | N | N | N | N | N | N | N | **N (planned)** |
| History / search | Y | Y | Y | Y | Y | Y (Pro) | Y | Y | Y | **Y (local)** |
| Export CSV / Sheets | ? | ? | Y (Excel add-in) | Y | Y (flat file) | ? | ? | ? | ? | **Y** |
| Webhooks / Zapier / API | Y (Pro: Zapier, API) | Y (API; connectors on Business) | Y (25+ integrations) | Y (connectors) | Y (API) | N | ? | Y (API) | Y (API) | **Y (webhooks: JSON, Slack, Sheets)** |
| Workspaces | 1 / 1 / 1 / 2 / 3 | 3 / 10 / unlimited | "Unlimited" (plan unclear) | 1 / 2 / 3 | ? | 1 client free, unlimited on Pro | ? | 1 / 1 / 2+ / 5+ | ? | **Unlimited** |
| Admin roles / approval | Y roles, approval ? | Y both (Business) | Y permissions | Y permissions | ? | Y roles (Agency) | P (Enterprise) | P | ? | **P (soft PIN lock; approval by code)** |
| Audit log | ? | P ("Coming soon" on pricing) | ? | ? | ? | Y history | ? | ? | ? | **Y (local activity log)** |
| Adobe cid | ? | ? | ? | Y (Adobe connector) | Y (Adobe) | ? | N | N | N | **Y** |
| Free-tier limits | 25 links/mo, 3 templates | No free plan (21-day trial) | Trial only | No free plan (14-day trial) | None (demo) | 1 client, 1 convention | 5 links, 2 QR/mo | 10 links, 10 QR/mo | 25 links/mo | **Everything free, no limits** |
| Account required | Web: Y. Ext: N | Y | Y | Y | Y | Y | Y (to shorten) | Y (for branded) | Y | **N** |
| Cheapest paid plan (2026-10-16) | $19/mo ($16 yearly) | $40/mo ($30 yearly) + seats | $15/user/mo (annual) | £30/user/mo (£24 yearly) | Not published | $19/mo | $10/mo (annual only) | $11/mo ($8 yearly) | $30/mo | **$0** |

### Matrix B: extensions and free tools

Column key:
- **UTM Bldr** = UTM Builder (`fhfng…`)
- **GA UTM (trafikant)** = Google Analytics UTM Builder (`gaidp…`)
- **MA QR** = UTM Link & QR Code Builder by Market Adoption
- **Tagger** = UTM Builder: Campaign URL Tagger
- **Express** = Express UTM-Builder
- **Google CUB** = Google Campaign URL Builder
- **Email LC** = Email Link Checker (`hlian…`)
- **Preflight** = Campaign Link Preflight
- **Ch. Checker** = UTM Channel Checker
- **Litmus** and **Mailchimp LC** (Mailchimp Link Checker)
- **wa.link** and **RichAuto** (RichAutomate)

| Feature | UTM Bldr | GA UTM (trafikant) | MA QR | Tagger | Express | Google CUB | Email LC | Preflight | Ch. Checker | Litmus | Mailchimp LC | wa.link | RichAuto | **Us** |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Build single link | Y | Y | Y | Y | Y | Y | N | N | N | P (Builder) | N | N | N | **Y** |
| Auto current tab | Y | ? | Y | Y | Y | N | N/A | Y (page) | Y | N | N | N | N | **Y** |
| Presets / templates | Y (11) | Y (unlimited, groups) | Y | P (3 free; $15 for more) | Y | N | N | N | N | ? | N | N | N | **Y (15)** |
| Team template sync | P (JSON file) | Y (cloud hub) | P (export) | N | Y | N | P (profiles) | N | N | Y | N | N | N | **P (share codes)** |
| Naming rules / locked values | P (lowercase, spaces) | P (lowercase) | N | P (lowercase, warnings) | Y | N | Y (required UTMs, brand rules) | P (consistency) | N | ? | N | N | N | **Y** |
| Regex rules | ? | N | N | N | ? | N | ? | N | N | ? | N | N | N | **Y** |
| GA4 channel prediction | Y (20 channels, fixes) | N | N | N | N | N | ? | N | Y | ? | N | N | N | **Y (818 sources)** |
| GA4 extra params | Y | ? | N | N | ? | N | N | N | N | N | N | N | N | **Y** |
| Ad macros unencoded | Y | ? | N | ? | ? | N | N/A | N/A | N/A | N/A | N/A | N | N | **Y (5 platforms)** |
| Bulk / CSV | N | N | N | P (CSV export, Premium) | Y | N | N | N | N | N | N | N | N | **Y** |
| Email HTML tagging | N | N | N | N | N | N | N | N | N | Y (UTM Manager) | N | N | N | **Y** |
| Page link checker / audit | N | N | N | N | N | N | Y (email) | Y (page) | N | Y (email) | Y (email) | N | N | **Y** |
| Email pre-send check | N | N | N | N | N | N | Y | P (web preview) | N | Y | Y (basic) | N | N | **N (planned)** |
| Redirect check | N | N | N | N | N | N | Y (full chain) | N | N | ? | P (site works) | N | N | **P** |
| Shortener | Y (Bitly BYOK) | Y (Bitly) | N | N | Y | N | N | N | N | N | N | Y (wa.link) | N | **Y (3 BYOK)** |
| Branded domain | N | N | N | N | Y | N | N | N | N | N | N | P (Premium $9/yr) | N | **P (BYOK)** |
| QR | ? | N | Y (PNG/SVG) | P (Premium) | ? | N | N | N | N | N | N | Y | Y | **Y** |
| Styled QR | N | N | P (error correction only) | N | ? | N | N | N | N | N | N | ? | N | **Y** |
| WhatsApp link builder | N | N | N | N | N | N | N | N | N | N | N | Y (no UTM) | Y (UTM in message) | **N (planned)** |
| History / search | N (per-URL memory) | P (60-min memory) | Y (recent) | P (Premium) | Y | N | ? | N | N | Y | N | P (Premium) | N | **Y** |
| Export CSV / Sheets | N | P (presets) | P (presets) | P (Premium CSV) | ? | N | P (shared report) | P ($29 Markdown) | N | ? | N | ? | P (toolkit behind form) | **Y** |
| Webhooks / API | N | N | N | N | Y (API) | N | N | N | N | ? | N | ? | N | **Y (webhooks)** |
| Workspaces | ? | Y (count ?) | N | N | ? | N | P (client profiles) | N | N | ? | N | N | N | **Unlimited** |
| Admin roles / approval | N | N | N | N | Y (access control) | N | N | N | N | Y (users) | N | N | N | **P (soft)** |
| Audit log | N | N | N | P (local history) | Y (history) | N | N | N | N | ? | N | N | N | **Y (local)** |
| Adobe cid | ? | N | N | N | Y (claims Adobe support) | N | N | N | N | ? | N | N | N | **Y** |
| Free-tier limits | All free | All free | All free | 3 presets | Demo; price ? | Free | Not stated | Free scans | Free | No free tier (unverified) | Free in Mailchimp | Free; analytics paid | Free | **All free** |
| Account required | N | ? ("sync to cloud") | N | N | Y (after demo) | N | N | N | N | Y | Y (Mailchimp) | N | N (form for toolkit) | **N** |
| Cheapest paid | – | – | – | $15 one-time | ? | – | ? | $29 one-time | – | ~$500/mo (unverified) | (Mailchimp plan) | $9/yr per link | – | **$0** |
| CWS users (2026-10-16) | 564 | 50,000 | 4 | not shown | 881 | – | 13 | 3 | 4 | – | – | – | – | – |

---

## 9. Takeaways for our spec

### 9.1 Must-haves the best competitors already have (and where we stand)

1. **Approval workflow with locked records** (Terminus Hub, Business plan at $150–200 a month). Ours is approval by code with a soft PIN, which works without an account. We should make it clear what the code-based flow guarantees and what it does not.
2. **Cloud template sync for teams** (UTM.io, and GA UTM Builder's "presets hub" with 50,000 users). This is our main structural gap. Share codes and import/export are the local-first answer, so they must be very low friction: one paste, a visible diff, and a "this preset is newer than yours" prompt.
3. **Conditional, hierarchical picklists** (Terminus). We have locked dropdowns and display names. **Dependent dropdowns** (for example, the medium list depends on the chosen source) are worth considering.
4. **Full redirect chain plus final status on every link** (Email Link Checker). The email pre-send check should show original URL, then the chain, then the final URL and status. It should also check that UTMs survive the redirect.
5. **Severity model** (critical, warning, passed, unverifiable) and a **"Locate" button that highlights the element** (Email Link Checker, Campaign Link Preflight). Use the same model in the page UTM Checker and the email check. An explicit "unverifiable" state builds trust.
6. **Rule trace for channel predictions** (SourceLoop shows which rule fired at each step). Our predictor should show *why* a link lands in a channel, not only the result.
7. **Merge-tag awareness in email checks** (Email Link Checker covers Mailchimp, Klaviyo, Liquid, HubSpot and Salesforce tokens; Mailchimp's own checker skips merge-tag links). The email pre-send check must leave merge tags inside URLs alone and must not report them as broken.
8. **Branded domains and click analytics** are table stakes for shorteners. BYOK covers this without us hosting anything. Keep it.

### 9.2 Gaps nobody fills

- **A GA4 channel predictor combined with governance rules.** No platform (UTM.io, Terminus, Uplifter, Claravine, UTMConfig) mentions GA4 Default Channel Group prediction on the pages we checked. The tools that do predict (UTM Builder `fhfng…`, UTM Channel Checker, SourceLoop, CampaignTrackly's checker) have no rules, workspaces or bulk.
- **A page UTM checker that also predicts the GA4 channel.** Campaign Link Preflight scans pages but makes no GA4 prediction, does not follow redirects, and ignores links without UTMs. Channel checkers handle one URL at a time. A page scan that shows the **predicted channel per link**, flags untagged outbound campaign links and checks naming rules would be new.
- **An email pre-send check with GA4 channel prediction and the team's own naming rules.** Litmus (about $500 a month, unverified) and Mailgun Inspect ($199 a month for link validation) do not mention channel prediction. Mailchimp's checker ignores UTMs entirely. Email Link Checker is the closest, with 13 users and no GA4 prediction found on its listing.
- **A WhatsApp builder that does attribution properly.** None of the eight CWS WhatsApp extensions tag anything. wa.link has no UTMs. RichAutomate puts tags into the message text, and its URL-parameter claim is unverified. Nobody offers the combination that works in practice:
  1. Click-to-chat link plus a prefilled message.
  2. A **tagged landing-page URL inside the message**, built with our rules.
  3. An optional **ref code** in the text.
  4. An optional **BYOK short link or QR**, with a clear note that UTMs on the wa.me URL itself do not reach GA4.

  The country-code default should not be US-first, unlike wa.link.
- **Non-Latin transliteration, regex rules and Adobe cid in a free tool.** We found none of these in any free competitor.
- **Ad macro safety.** Only UTM Builder (`fhfng…`) explicitly promises unencoded macros. The platforms do not mention it.

### 9.3 Where a free, no-account, local-first tool wins

- **Price and limits.** Every platform is either paid from $15–$40 per user per month or link-capped: Bitly 5 links a month, Rebrandly 10, Dub 25, UTM.io 25. Terminus links **stop redirecting** if a trial lapses. Our tool has no caps and no lock-in.
- **Time to first link.** Google's builder needs 4 fields before it shows a URL. Terminus and CampaignTrackly need an account before their extensions work. Ours prefills the current tab and a template, so the first link takes about one click. Lead with that in store copy and screenshots.
- **Privacy.** Campaign Link Preflight, Email Link Checker, LeadTrapper and the Tagger all sell "nothing leaves your browser". It is a recognised value in this category. We can match it and also offer far more features.
- **Freshness versus incumbents.** The biggest free incumbent, Google Analytics UTM Builder (50,000 users), was last updated 11 June 2023. The Terminus extension was last updated in June 2022 and CampaignTrackly's in March 2023. Keeping a frequent update cadence and explicit GA4 extra parameters (source_platform, creative_format, marketing_tactic) is a visible differentiator.
- **Watch closely:** UTM Builder (`fhfngcdeploenaaeakjdkkacnnjjdhll`, updated 4 October 2026) overlaps us most: side panel, GA4 channel fixes, macros, GA4 extra parameters, Bitly BYOK, free with no account, 52 languages. It does **not** list bulk, email tagging, page scan, naming rules, workspaces, QR, webhooks or history. Those are our differentiators against it, so they should appear early in our listing.
