# Risks: platform, policy, privacy and legal (2025–2026)

Research date: 16 October 2026. I preferred official sources: Google, Chrome, Apple/WebKit, Mozilla, Brave's own repository, Meta/WhatsApp, Microsoft, ESP help centres, and the Government of India and EU texts. Where I had to rely on a third-party source or my own inference, the item is marked **(third-party)** or **(estimate)**. This is product research, not legal advice.

---

## 1. GA4 channel and traffic-source changes

### 1.1 Default channel group: current rules

Source: [GA4 default channel group](https://support.google.com/analytics/answer/9756891).

- **AI Assistant**: medium exactly matches `ai-assistant`. Traffic from recognised AI assistants is also given this medium automatically, with campaign `(ai-assistant)`.
  - The channel launched on **13 May 2026**, per the [GA4 release notes](https://support.google.com/analytics/answer/9164320).
  - On **11 June 2026**, Google added a Source Group field "for emerging traffic sources like ChatGPT (OpenAI) and Perplexity" (same release notes).
- **Paid Other**: medium matches the paid regex (cp, ppc, retargeting, paid…) but the source is not on the search, social, shopping or video lists. This is why `utm_source=meta&utm_medium=paid_social` lands in Paid Other: "meta" isn't on Google's social list (README; this repo's `src/lib/ga4-sources.js`).
- **Cross-network**: campaign name contains `cross-network`. For Google Ads, it also covers network type "Cross-network" and campaign types such as Performance Max and Demand Gen.
- **Email**: source *or* medium matches email, e-mail, e_mail or "e mail".
- **SMS**: source or medium is exactly `sms`.
- **Mobile Push Notifications**: medium ends with "push", or contains "mobile" or "notification", or source is `firebase`.
- **Referral**: medium is `referral`, `app` or `link`.
- **Unassigned**: no rule matched.

**Risk.** Google changes these rules without dating the change. The page says only that Google "recently made improvements". A predictor that ships a frozen copy goes stale silently. AI Assistant and Paid Other are the proof: they broke older predictors.

**Product implications**
- Keep the rules and the source lists as versioned data, not code. Remotely fetched *data* is allowed under MV3; *code* is not (see §2.2).
- Show "Rules as of <date>" in the UI.
- Re-check 9756891 and the release notes every month.

### 1.2 Manual traffic dimensions and utm_source_platform

Sources: [URL builders / UTM parameters](https://support.google.com/analytics/answer/10917952), [how traffic source dimensions are updated](https://support.google.com/analytics/answer/15593651).

- **Supported parameters**:
  - `utm_id`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_source_platform`, `utm_term`, `utm_content`.
  - `utm_creative_format` and `utm_marketing_tactic` are also listed, but Google says these two are "**not currently reported**" in GA properties.
- **Case sensitivity**: "utm_source=google is different from utm_source=Google."
- **utm_source_platform**: "At present, even if you set utm_source_platform as recommended, cross-channel reports … will continue to show the 'Manual' value". Google says it will report passed values "in the future", with no date. A Google developer-forum user sees the same thing in BigQuery ([discuss.google.dev](https://discuss.google.dev/t/bigquery-source-platform-ga4-dimension/169296), **third-party**).
- **Auto-tagging**:
  - GCLID/DCLID win whenever they can be used.
  - UTMs fill cross-channel dimensions "only when the GCLID or DCLID can't be used", for example when ad_user_data consent is denied.
  - UTMs always populate the *manual* dimensions.
  - Google recommends setting all relevant UTMs, including `utm_id` and `utm_source_platform`, on Google Ads traffic as a fallback.
  - Caveat: 15593651 says the enhancements apply to allow-listed properties.
- **Where to look**: UTMs are omitted from "Landing page + query string" and "Page path + query string" and appear in Page location (10917952).

**Risk.** Users fill in utm_creative_format, utm_marketing_tactic and utm_source_platform and expect to see them in reports. They won't, or they'll see "Manual", and the tool gets blamed.

**Mitigation.** Add inline notes such as "Collected but not shown in GA4 reports yet (Google, 10917952)". Keep those fields optional and collapsed.

---

## 2. Chrome Web Store and Manifest V3 policy

### 2.1 What the policies require

Sources: [Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies) (updated 22 May 2025), [Limited Use](https://developer.chrome.com/docs/webstore/program-policies/limited-use), [User Data FAQ](https://developer.chrome.com/docs/webstore/program-policies/user-data-faq), [Review process](https://developer.chrome.com/docs/webstore/review-process), [Privacy fields](https://developer.chrome.com/docs/webstore/cws-dashboard-privacy).

- **Single purpose**: "An extension must have a single purpose that is narrow and easy to understand." Also: "If two pieces of functionality are clearly separate, they should be put into two different extensions."
  - **Risk for this product.** A WhatsApp chat-link builder and an in-Gmail email scanner both stretch "UTM links for GA4".
  - **Framing.** Present everything as "build and check campaign links for GA4". The WhatsApp builder exists to put a UTM-tagged *site* link into the message. The email check is a *campaign link* check, not an email tool.
  - **Estimate.** A reviewer could still ask for these to be split. Keep N2 and N3 in a form that could be pulled into separate extensions.
- **Permissions**: "Request access to the narrowest permissions necessary." Reviews "may take longer for extensions that request broad host permissions or sensitive execution permissions", and "a few days … up to a few weeks" is normal (review-process page).
  - This repo already lists `https://*/*` and `http://*/*` as *optional* host permissions (`manifest.json`), and that is the right pattern.
  - Adding `mail.google.com`, `outlook.office.com`, `outlook.live.com`, `app.hubspot.com`, `*.admin.mailchimp.com` or `www.klaviyo.com` as *required* host permissions would trigger slower review and a scarier install warning. That is an inference from the review-process text **(estimate)**.
- **User data and Limited Use**:
  - "Collection and use of web browsing activity is prohibited, except to the extent required for a user-facing feature."
  - "Do not allow humans to read user data" except in narrow cases.
  - Transfers to third parties such as ad platforms and data brokers are prohibited.
- **Local processing still counts.** Extensions must "disclose how they handle user data, even when data is processed or stored locally", and a privacy policy is required even for local-only storage (User Data FAQ #3, #14).
- **Personal communications** (email) and "website content" are both user-data categories (User Data FAQ #4).
- **Prominent disclosure**: it must be shown in the product's own UI, before consent. A disclosure "must not be located only in a privacy policy", and "Disclosures in the Chrome Web Store description … do not satisfy this requirement" (User Data FAQ #10).
- **Keyword spam**: "Unnatural repetition of the same keyword more than 5 times" is not allowed (Program Policies). This is relevant to the listing copy in [DEMAND.md](DEMAND.md).
- **Permission justifications**: each permission needs a justification in the Privacy practices tab, and over-broad permissions "may cause rejection" (Privacy fields page).

### 2.2 Remote code ban (MV3)

Source: [Remotely hosted code](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code) (updated 13 Dec 2023).

- "extensions now need to bundle *all* code."
- Remotely hosted code means anything executed that isn't in the package, and that includes dead code.
- **Data such as JSON or CSS is not remote code.**
- The Program Policies add that "the full functionality of an extension must be easily discernible from its submitted code".

**Implications**
- GA4 rule updates and team rules JSON (N4) can be fetched as data, provided they are *declarative* (lists, regexes, labels) and never `eval`'d.
- Don't ship a rules format that embeds JavaScript expressions. The campaign formula language must stay a parser, not code.
- No injected remote SDKs (e.g. InboxSDK loaded from a CDN) for Gmail. Any helper library must be bundled.

### 2.3 Content scripts on mail and ESP editors

Source: [Content scripts](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts).

- Content scripts run in an **isolated world**, share the page's DOM, and can't see page JavaScript variables.
- The page's CSP applies only "When a content script is injected into the main world". Isolated-world scripts get the extension's own CSP instead.
- Editors inside iframes need `all_frames`, `match_about_blank` or `match_origin_as_fallback`. That last option covers `about:`, `data:` and `blob:` frames created by a matching origin.

**Requirement set for an email-reading extension (N2).** This is a synthesis of §2.1–2.3:
1. **Activation**:
   - Prefer user-initiated `activeTab` + `scripting` injection ("Check links in this draft" from the toolbar or a keyboard shortcut). That needs no host permission.
   - Only offer an always-on pre-send banner behind an *optional* host permission, requested per site.
2. **Disclosure**: add an in-product screen before first use: "Reads the links in the draft you're editing, on this device only. Nothing is sent." Have the user tick a box to consent.
3. **Data handling**:
   - Parse only `href`s and link text.
   - Never store body text.
   - Never send draft content anywhere: no webhooks, no analytics.
   - Declare "Personal communications" and "Website content" in the CWS data-usage form, and certify Limited Use.
4. **Privacy policy**: update it on thegrowthfolks.com before submitting.
5. **No remote code. No main-world injection** unless unavoidable. If it is, the host page's CSP and Trusted Types rules apply (see §8).

### 2.4 Gmail API alternative (not recommended)

Source: [Gmail API scopes](https://developers.google.com/gmail/api/auth/scopes).

- `gmail.readonly`, `gmail.compose` and `gmail.modify` are **restricted** scopes and require "restricted scope OAuth App Verification".
- If restricted-scope data is stored on or transmitted to servers, a security assessment is also required.
- Gmail add-on compose actions get only minimal draft data by default, with recipients if `METADATA` is enabled. The page describes no way to read the body or to intercept Send ([Extending the compose UI](https://developers.google.com/workspace/add-ons/gmail/extending-compose-ui)).

**Conclusion.** An official Gmail add-on can't do a pre-send link check, and the API route is heavy. A DOM-reading extension is the only practical route for Gmail **(estimate)**.

---

## 3. Browser link-tracking protection: which parameters get stripped?

**Short answer: none of the three strip `utm_*` on navigation today.** All three strip click IDs. Each has edge cases that matter.

### 3.1 Safari (iOS 17+, macOS Sonoma+, Safari 26)

**Link Tracking Protection**
- Applies in Mail, Messages and Safari Private Browsing ([Apple newsroom, June 2023](https://www.apple.com/newsroom/2023/06/apple-announces-powerful-new-privacy-and-security-features/)).
- Safari "removes a subset of query parameters that have been identified as being used for pervasive cross-site tracking granular to users or clicks", "prior to navigation" ([WebKit: Private Browsing 2.0, 16 Jul 2024](https://webkit.org/blog/15697/private-browsing-2-0/)).
- Parameters "only used for campaign attribution … Safari allows such parameters to pass through".
- Apple does not publish the list. Third-party tests report that `gclid`, `fbclid`, `msclkid`, `dclid`, `twclid`, `mc_eid` and `igshid` are stripped and `utm_*` survive ([MessageGears](https://messagegears.com/blog/the-impact-of-ios-17-link-tracking-protection/), **third-party**).

**Hidden-URL rule (bigger risk)**
- In Private Browsing, or in all browsing if the user enables Advanced Tracking and Fingerprinting Protection, "all third-party scripts that attempt to read the full URL (e.g. using location.search, location.href, or document.URL) will get a version of the URL that has no query parameters or fragment" after a cross-site navigation (WebKit, same post).
- **Inference (estimate):** a GA4 tag loaded as a third-party script (gtag.js from googletagmanager.com) may then not see UTMs at all in those sessions, and the visit falls into Direct or Unassigned. This is untested. Run the landing test in Safari Private Browsing to confirm.

**Safari 26.0**
- Safari 26.0 "prevents known fingerprinting scripts from reading state that could be used for navigational tracking, such as query parameters and document.referrer" ([WebKit: Safari 26.0](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)).
- WebKit doesn't say which scripts are on the "known fingerprinting" list. Whether analytics tags are affected is **unverified**.

**Product implication**
- Don't promise "UTMs always work".
- Add a help note: "Safari Private Browsing can hide UTMs from third-party tags. First-party or server-side tagging is more robust."
- A Safari check can't be automated from a Chrome extension. Document a manual test.

### 3.2 Firefox

- **Parameters stripped**: Mozilla's live Remote Settings collection `query-stripping` lists `gclid`, `dclid`, `msclkid`, `_openstat`, `yclid`, `wickedid`, `twclid`, `_hsenc`, `__hssc`, `__hstc`, `__hsfp`, `hsctatracking`, `wbraid`, `gbraid`, `ysclid`, `mc_eid`, `oly_anon_id`, `oly_enc_id`, `__s`, `vero_id`, `mkt_tok` and `fbclid`. `googleadservices.com` is allow-listed. **No `utm_*`.** Source: [firefox.settings.services.mozilla.com … /query-stripping/records](https://firefox.settings.services.mozilla.com/v1/buckets/main/collections/query-stripping/records), fetched 16 Oct 2026.
- **Scope**: stripping is on in Enhanced Tracking Protection *Strict* and in Private Browsing. It shipped in Firefox 102/103 per a [Mozilla Nightly blog post](https://blog.nightly.mozilla.org/2022/06/02/these-weeks-in-firefox-issue-117/) and the [Firefox source docs](https://firefox-source-docs.mozilla.org/toolkit/components/antitracking/anti-tracking/query-stripping/index.html). Users can add their own parameters via `privacy.query_stripping.strip_list`.
- **Impact**:
  - HubSpot's `_hsenc` and `__hs*` are stripped, which weakens HubSpot contact attribution from email in Strict/Private.
  - `wbraid`/`gbraid`/`gclid` loss means GA4 falls back to UTMs (§1.2). That is a good reason to keep UTMs on Google Ads links.

### 3.3 Brave

- **Query String Filter**: aims to stop individual tracking "without interfering with coarse-grained campaign-level tracking" ([Brave wiki](https://github.com/brave/brave-browser/wiki/Query-String-Filter)).
- **Tracker list (older brave-core tag v1.80.113)**: includes `fbclid`, `gclid`, `gbraid`, `wbraid`, `dclid`, `msclkid`, `twclid`, `igshid`, `igsh`, `mc_eid`, `_hsenc`, `__hs*`, `mkt_tok` (except on unsubscribe pages), `_kx` (Klaviyo), `srsltid`, `si`, `mtm_cid`, `pk_cid`, `s_cid` and **`_gl`** (the GA cross-domain linker). **No `utm_*`.** Source: [utils.cc @ v1.80.113](https://github.com/brave/brave-core/blob/v1.80.113/components/query_filter/utils.cc).
- On master, the list has moved to a downloadable `query-filter.json` component ([query_filter_data.cc](https://github.com/brave/brave-core/blob/master/components/query_filter/browser/query_filter_data.cc)). It can now change without a browser release.
- **"Copy clean link"** is a separate, user-triggered feature. Its goal is "to remove anything that's not needed … (typically attribution clutter like `utm_source=facebook`)", using [clean-urls.json](https://github.com/brave/adblock-lists/blob/master/brave-lists/clean-urls.json) ([Brave wiki](https://github.com/brave/brave-browser/wiki/Copy-clean-link)).
- **Impact**:
  - Shared links copied with "Copy clean link" can lose UTMs.
  - `_gl` stripping breaks GA4 cross-domain stitching in Brave.
  - `_kx` stripping breaks Klaviyo identification.
  - The extension's Cleaner already strips click IDs and `_gl` (README), which is consistent with these browsers.

---

## 4. Ad platforms: tracking templates and URL parameters

### 4.1 Google Ads

Sources: [Tracking templates, final URL suffix, custom parameters](https://support.google.com/google-ads/answer/6076199), [Destination requirements](https://support.google.com/adspolicy/answer/6368661).

- **Parallel tracking is mandatory** for Search, Shopping, Display, Video and Performance Max.
- The tracking template URL and every redirect must be **HTTPS** and **server-side**.
- Template changes at account, campaign or ad-group level don't trigger ad re-review. Changes at ad, keyword or sitelink level do.
- **Policy**: "Tracking template or expanded URL that don't lead to the same content as the final URL" is a destination mismatch. So are "Redirects from the final URL that take the user to a different domain".
- **Risk**: the tool's "Google Ads tracking template" output must keep `{lpurl}` and never point to a different landing page. Shortener domains in final URLs (Bitly, Dub) risk destination-mismatch disapproval **(estimate)**. Warn when a short link is copied in Google Ads format.

### 4.2 Meta

- **URL parameters field**: parameters in the "URL parameters" field override duplicates in the website URL. They apply only to the first landing page, and dynamic parameters aren't supported for some formats and objectives ([Meta Business Help, URL parameters (es-LA)](https://es-la.facebook.com/business/help/1016122818401732)).
- **Meta's own UTM guidance**: Meta's [URL builder](https://www.facebook.com/business/google-analytics/build-your-url) suggests `utm_medium` = CPC, CPM or oCPM, all uppercase. GA4 values are case-sensitive (§1.2), so "CPC" from one team member and "cpc" from another become separate rows. Whether GA4's channel regexes match uppercase values is **unverified** here. Recommend lowercase `paid_social` or `cpc`, and have the case rule fix this automatically.
- **Health and wellness / sensitive categories**:
  - Meta filters "potentially sensitive health-related data" out of ad ranking and optimisation ([Meta: About Sensitive Health Information](https://www.facebook.com/business/help/361948878201809)).
  - From **2 September 2025**, custom conversions suggesting health conditions or financial status are flagged and blocked (per Meta's developer documentation as quoted in search results, **verify** at [Meta conversion tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking/)).
  - Third-party reports say restricted advertisers lose custom parameters and the URL path and query, including UTMs, in data shared with Meta ([PixelFlow](https://docs.pixelflow.so/what-are-metas-health-and-wellness-restrictions-and-how-do-they-affect-tracking-ce3t3), **third-party**).
  - **Product implication**: warn against sensitive words in `utm_campaign` and `utm_content` (diagnoses, "diabetes", "credit score"). Add an optional "sensitive terms" rule to workspaces.

---

## 5. WhatsApp links

### 5.1 Format and limits

Source: [WhatsApp Help Center: How to use click to chat](https://faq.whatsapp.com/5913398998672934). The page is JS-rendered, so I read it via search snippets.

- Format: `https://wa.me/<number>`, where the number is "a full phone number in international format". "Omit any zeroes, brackets, or dashes."
- A pre-filled message is added as `?text=<URL-encoded text>`. A link without a number lets the user pick a contact.
- Works on phone and WhatsApp Web.
- WhatsApp Business app **short links** (`wa.me/message/…`) have a default message set in the app ([FAQ: How to create short links](https://faq.whatsapp.com/502291734918768)).
- **Message length**: there is no official maximum for `text` in the FAQ **(unverified)**. Practical URL-length limits apply in QR codes and SMS **(estimate)**.
- **Key fact for the product**: a UTM on the wa.me URL does nothing for GA4, because the click opens WhatsApp, not your site. The UTM belongs on the *website* link inside `text`. A WhatsApp button click on your site is measured as a GA4 event, not a UTM ([respond.io guide](https://respond.io/help/capture-leads/how-to-attribute-whatsapp-conversations-to-non-meta-ads.md), **third-party**).
- **GA4 classification**: `whatsapp` is on Google's social source list, so `utm_source=whatsapp` lands in Organic Social unless the medium matches the paid regex. I checked this with this repo's predictor against [9756891](https://support.google.com/analytics/answer/9756891). Tell users this plainly, or WhatsApp broadcasts will look like organic social posts.

### 5.2 WhatsApp Business policy

Source: [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/), updated 23 Sept 2026.

- Businesses may contact people only if those people gave their number and **opted in**. Business-initiated conversations need approved **Message Templates**. Free-form replies are allowed within the **24-hour customer service window**.
- "Do not confuse, deceive, defraud, mislead, spam, or surprise people", and no impersonation.
- The policy text I read **does not mention pre-filled messages or click-to-chat entry points**.
- **Estimate**:
  - A pre-filled `text` is drafted by the business but sent by the user. It is a user-initiated chat, which opens the 24-hour window.
  - Deceptive pre-fills ("I agree to receive offers") would breach the "do not … mislead" clause and may not count as valid opt-in.
  - The builder should warn against consent language in pre-fills.
- **Pricing context**: India marketing-message rates rose on 1 Jan 2026 ([WhatsApp Business Platform pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)). Click-to-WhatsApp ad entry points open a free window (same page).
- **Brand and trust**: autocomplete shows "wa me link virus/spam/scam" ([DEMAND.md](DEMAND.md) C10). Don't shorten wa.me links by default, and show the full destination next to the QR code.

---

## 6. Email clients and ESPs rewriting links

- **Outlook / Microsoft Defender Safe Links** ([Microsoft Learn](https://learn.microsoft.com/en-us/defender-office-365/safe-links-about), updated 14 Oct 2026):
  - Scanned URLs are "rewritten or *wrapped*" as `https://<region>.safelinks.protection.outlook.com`, including on forward and reply.
  - Unknown URLs "are detonated asynchronously in the background". That produces non-human clicks, which matches reports of "pre-click" inflated UTM sessions ([r/GoogleAnalytics](https://www.reddit.com/r/GoogleAnalytics/comments/16hhpvy/seeing_incorrect_utm_codes_in_bulk_when_marketing/), **third-party**).
  - The original URL and query string are preserved inside the wrapper. Admins can disable rewriting ("Do not rewrite URLs, do checks via SafeLinks API only").
  - **Implication**: a pre-send checker sees clean links. Post-send audits of received email will see wrapped links, so the checker must unwrap `safelinks.protection.outlook.com?url=`.
- **Gmail**: I found no official Google statement on Gmail's click-time redirect (`google.com/url?q=`). Treat as **unverified**. The extension must decode such wrappers when scanning received mail.
- **HubSpot**:
  - When email tracking is on, HubSpot appends tracking to every URL: `_hsenc`, `_hsmi`, `hsCtaTracking` and UTMs ([HubSpot KB](https://knowledge.hubspot.com/email/links-in-emails-or-ctas-lead-to-an-error-page)).
  - `utm_content` is auto-added for emails, and `utm_campaign` defaults to `hs_email` ([HubSpot KB](https://knowledge.hubspot.com/reports/understand-hubspots-traffic-sources-in-the-traffic-analytics-tool)).
  - Users report HubSpot overriding their own UTMs ([HubSpot Community](https://community.hubspot.com/t5/Email-Marketing-Tool/Hubspot-Overriding-UTM-Parameters/td-p/497651), **third-party**).
- **Mailchimp**:
  - Google Analytics link tracking is toggled per email ("Settings & Tracking") and per automation flow ([Mailchimp help](https://mailchimp.com/help/integrate-google-analytics-with-mailchimp/)).
  - The destination "needs to handle utm_source, utm_campaign, and utm_medium", or links can break ([Mailchimp KB](https://kb.mailchimp.com/campaigns/design/troubleshoot-broken-links)).
  - Click tracking wraps links in Mailchimp's redirect domain **(estimate; I didn't find an official page naming the domain in this session)**.
- **Klaviyo**:
  - `utm_source` and `utm_medium` are always on. Since **2 June 2025** the default utm_medium is "Message type" (email, sms, whatsapp, push). Accounts that saved settings earlier keep old values: `campaign`/`flow` ([Klaviyo help](https://help.klaviyo.com/hc/en-us/articles/115005247808), updated 14 Jan 2026).
  - This repo's predictor classes `klaviyo` + `campaign`/`flow` as **Unassigned**.
  - Klaviyo also appends `_kx`, which Brave strips (§3.3).
- **Risk for N2**: the editor shows the author's links, but the ESP rewrites or adds parameters at send time. A "green" pre-send check can therefore be wrong about what arrives.
- **Mitigations**:
  - Read the ESP's UTM settings where visible, and show an "ESP will add: …" note.
  - Detect duplicate UTMs (author's plus ESP's).
  - Recommend a test send combined with the page/email checker (N1) on the received copy.

---

## 7. Privacy law: DPDP Act (India) and GDPR, for an extension that reads email drafts

### India: DPDP Act 2023 and DPDP Rules 2025
- **Status**: the Rules were notified **14 November 2025** with an **18-month** phased timeline ([PIB press release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190014); [PIB backgrounder PDF](https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/nov/doc20251117695301.pdf)).
- **Timeline**: most substantive obligations (notice, consent, security, breach) apply from about **May 2027**, per the 18-month window (PIB).
- **Penalties**: up to ₹200 crore for failing to notify breaches (PIB). A later PIB note covers simplified compliance for start-ups ([PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2198217&reg=48&lang=2)).
- **Email drafts are personal data**: recipients' names and addresses, and personal content.
- **Estimate**: if processing happens only on the user's device and The Growth Folks® never receives the data, The Growth Folks® is arguably not the Data Fiduciary for it. The user's organisation is. Any telemetry, crash report, webhook or "send to support" path that carries draft content would change that.

### EU/UK: GDPR
- [Regulation (EU) 2016/679](https://eur-lex.europa.eu/eli/reg/2016/679/oj) applies the same way.
- Art. 5(1)(c) (data minimisation) and Art. 25 (data protection by design) favour reading only link `href`s, never storing body text, and doing no server processing.
- If a future cloud feature (team sync, the Supabase plan in the README) receives draft-derived data, The Growth Folks® becomes a processor for business customers. That needs a DPA under Art. 28 and an international-transfer basis **(estimate)**.

### Both
- Chrome Web Store Limited Use and prominent-disclosure rules (§2.1) apply regardless of law, and are stricter in practice.

---

## 8. Feasibility: a pre-send checker inside each editor

These notes were not tested against live, signed-in editors in this session. Header checks used unauthenticated `curl -I`. Treat each item as an **estimate** unless a source is cited.

| Editor | Where the draft lives | DOM stability | Iframes | CSP / Trusted Types | ToS / policy notes | Verdict |
|---|---|---|---|---|---|---|
| **Gmail** (mail.google.com) | `contenteditable` div in the compose dialog **(estimate)** | Low: obfuscated, frequently changing class names. Anchor on ARIA roles and labels instead **(estimate)** | Compose is in the top document **(estimate)** | Google pages enforce strict CSP and Trusted Types **(estimate)**. Isolated-world content scripts avoid page CSP ([Chrome docs](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts)), but writing `innerHTML` back can fail under Trusted Types. Use DOM APIs or Range edits | No official pre-send hook for add-ons ([compose UI docs](https://developers.google.com/workspace/add-ons/gmail/extending-compose-ui)). The Gmail API is a restricted scope ([scopes](https://developers.google.com/gmail/api/auth/scopes)). Intercepting the Send button is fragile | **Feasible as "check on demand"**. Risky as a send-blocker |
| **Outlook on the web / new Outlook** (outlook.office.com, outlook.live.com) | `contenteditable` editor **(estimate)** | Medium. Microsoft ships UI changes often **(estimate)** | Possible iframes for some panes **(estimate)** | Unknown: `curl -I` returned HTTP 417 without a session | **Official route exists**: an Outlook add-in with Smart Alerts `OnMessageSend` runs "after a user selects Send" with prompt user / soft block / block modes, supported on the web and new Outlook ([Microsoft Learn](https://learn.microsoft.com/en-us/office/dev/add-ins/outlook/onmessagesend-onappointmentsend-events)). Marketplace listing requires prompt user or soft block | **Build as an Outlook add-in, not via the Chrome DOM**. Chrome on-demand check as a fallback |
| **HubSpot** email editor (app.hubspot.com) | Drag-and-drop editor. Content is likely rendered in an iframe **(estimate)** | Medium–low | Likely; needs `all_frames` / `match_origin_as_fallback` | Unknown | HubSpot rewrites links at send (§6). HubSpot's own UTM fields may be the better integration point **(estimate)** | On-demand check feasible. Pre-send block impractical |
| **Mailchimp** (*.admin.mailchimp.com) | New builder; canvas likely in an iframe **(estimate)** | Medium–low | Likely | Login page CSP only sets `frame-ancestors` (observed via `curl -I` on login.mailchimp.com) | Google Analytics tracking toggle adds UTMs at send ([Mailchimp help](https://mailchimp.com/help/integrate-google-analytics-with-mailchimp/)). "Preview / Send test" is the reliable check | **Better**: run N1 on the preview or test email |
| **Klaviyo** (www.klaviyo.com) | Drag-and-drop editor, likely iframes **(estimate)** | Medium–low | Likely | Strict `script-src 'strict-dynamic'` with nonce (observed on the login page via `curl -I`). Blocks main-world injection. The isolated world is fine | Global UTM settings are added at send ([Klaviyo help](https://help.klaviyo.com/hc/en-us/articles/115005247808)) | **Better**: read the UTM settings page and check the preview/test send |

**Overall recommendation (estimate)**
1. Ship **N1** first: paste HTML, scan the current page or a "view in browser" email, and fix links with one click. It needs no new permissions beyond `activeTab`/`scripting`.
2. Add an on-demand "Check this draft" for Gmail via `activeTab`. It reads `a[href]` only.
3. For Outlook, build a separate Office add-in using Smart Alerts.
4. Treat HubSpot, Mailchimp and Klaviyo as "check the preview / test send", plus read the ESP's UTM defaults.
5. Avoid an always-on Send interceptor.

---

## 9. Risk table

Likelihood: H/M/L that the risk materialises within 12 months. Impact: H/M/L on users or the listing.

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 1 | Google changes default channel rules or source lists again (as with AI Assistant, May 2026), and predictions go silently wrong | **H** | **H** | Store rules and source lists as versioned JSON data. Show a "rules as of" date. Check [9756891](https://support.google.com/analytics/answer/9756891) and the [release notes](https://support.google.com/analytics/answer/9164320) monthly. Unit-test each channel (already done for templates) |
| 2 | CWS rejection or slow review when adding Gmail/Outlook/ESP access (broad hosts, personal communications, single purpose) | **H** for required hosts, **M** for optional | **H** | Use `activeTab` + on-demand injection. Use optional per-site host permissions. Add in-product prominent disclosure and consent. Update the privacy policy and CWS data-usage form. Frame everything as "campaign link check". Keep N2 separable into its own extension |
| 3 | Pre-send check gives false confidence because the ESP or Safe Links rewrites links after the check | **H** | **M** | Show "ESP will add …" notes. Detect duplicate or overridden UTMs. Recommend test send + N1 check. Unwrap Safe Links and Google redirects when scanning received mail |
| 4 | Safari Private Browsing / Advanced Protection hides query strings from third-party scripts, and Safari 26 blocks "known fingerprinting scripts" from query params. UTMs look broken in GA4 | **M** | **M–H** | Document it and advise first-party or server-side tagging. Never claim "UTMs always work". Add a manual Safari test to the landing-test help |
| 5 | Editor DOM changes break the in-editor checker (Gmail obfuscated classes, ESP iframes) | **H** | **M** | Anchor on ARIA roles and `a[href]` only. Fail soft with a "couldn't read draft, paste HTML instead" message. Use the official Outlook add-in route |
| 6 | Remote-code violation if team rules or GA4 rule updates contain executable logic | **L** | **H** | Rules stay declarative (lists, regex, labels). No `eval`/`Function`. Bundle all libraries. Ship a JSON schema for N4 |
| 7 | Users put UTMs on wa.me links and expect GA4 data, or WhatsApp broadcasts land in Organic Social | **H** | **M** | The WhatsApp builder puts UTMs only on the inner site link. Show the GA4 verdict for that link. Explain why "whatsapp" means Organic Social. Offer a team-agreed medium and a custom channel-group tip |
| 8 | Pre-filled WhatsApp text used to fake consent or mislead, breaching WhatsApp policy | **L–M** | **M** | Warn on consent-like phrases. Link to the [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/). Never auto-send |
| 9 | Meta restricts URL parameters or custom data for health, finance and other sensitive advertisers, so UTMs in shared data are stripped or campaigns blocked | **M** (for those categories) | **M** | Add a "sensitive terms" workspace rule that warns on health or financial words in campaign/content. Recommend neutral IDs (`utm_id`) |
| 10 | Google Ads disapproval from tracking templates or short links that change domain or content | **L–M** | **M** | Keep `{lpurl}` and HTTPS. Warn when a shortener URL is copied as a Google Ads final URL. Never alter the landing path |
| 11 | Users fill `utm_creative_format`, `utm_marketing_tactic` and `utm_source_platform` and see nothing or "Manual" in GA4 | **H** | **L** | Inline note citing [10917952](https://support.google.com/analytics/answer/10917952) and [15593651](https://support.google.com/analytics/answer/15593651). Collapse these fields by default |
| 12 | Brave/Firefox strip `_gl`, `gclid`, `_hsenc`, `_kx`, so cross-domain and ESP identification breaks and users blame the tool | **M** | **L–M** | Explain in help. Keep UTMs as a fallback on Google Ads links (Google recommends this). The Cleaner already strips these from shared links |
| 13 | Privacy-law exposure (DPDP from ~May 2027, GDPR now) if draft content ever leaves the device: telemetry, webhooks, cloud sync | **L** today, **M** with cloud sync | **H** | Local-only by design. Never include draft text in webhooks or logs. Before Supabase sync, add a DPA, data map, retention limits and a breach process |
| 14 | Keyword-stuffed listing flagged as keyword spam | **L** | **M** | Use each keyword at most 5 times ([CWS policy](https://developer.chrome.com/docs/webstore/program-policies/policies)). Use the keyword set in [DEMAND.md](DEMAND.md) |
| 15 | Third-party facts in this document (Safari strip list, Meta health restrictions, Mailchimp redirect domain, Gmail redirect) are out of date | **M** | **M** | Re-verify each **(third-party)** and **(estimate)** item before relying on it in UI copy. Test empirically where possible |
