# Personas: UTM Builder & Checker for GA4 – The Growth Folks®

Research date: 16 October 2026. The personas are archetypes built from public evidence: forum threads, job adverts, vendor and platform documentation, and the search data in [DEMAND.md](DEMAND.md). They are labelled by role, not given names. If a detail is my inference rather than something a source says, it is marked **(estimate)**.

Feature codes used in the mappings:

- **Existing (README v0.2)**
  - **B** Build: popup/side panel, GA4 channel predictor with one-click fixes, safe URL engine, all GA4 fields, 15 templates, presets, variables, ad macros, per-platform copy, shortener, styled QR, link check and landing test
  - **K** Bulk: matrix, CSV upload, email HTML tagger, UTM Cleaner
  - **A** Audit: page link checker, GA4 Traffic acquisition CSV audit
  - **G** Governance: workspaces, case/space/character rules, non-Latin rule, campaign regex, required fields, locked dropdowns, domain allowlist, campaign formula
  - **T** Team without a backend: share codes, JSON files, admin PIN, approval codes, activity log
  - **W** Webhooks (Zapier/Make/n8n, Slack, Google Sheets)
- **Candidates**
  - **N1** Page and email UTM checker with one-click fixes (paste HTML or scan the open page or an email preview, then fix each link)
  - **N2** Pre-send link check inside the Gmail, Outlook on the web, HubSpot, Mailchimp and Klaviyo editors
  - **N3** WhatsApp click-to-chat builder: wa.me plus pre-filled text with a UTM-tagged site link inside it, plus QR
  - **N4** Team rules JSON file, shared with a website Bulk UTM Link Checker on thegrowthfolks.com

---

## P1. In-house growth marketer

**Who.** One to five people running paid social, paid search, email and organic for one brand. They own "the numbers" in GA4 but aren't analysts.

**Evidence**
- Job adverts now list UTM conventions as a duty. A Stanford "Audience & Marketing Insights Analyst" advert asks the hire to own "campaign naming and UTM conventions" and to "QA tracking" ([Stanford Careers](https://careersearch.stanford.edu/hcmUI/CandidateExperience/en/sites/Stanford/job/201338/)).
- A thread in r/GoogleAnalytics, "How are you enforcing consistent UTM naming", says a written convention "still depends on every employee, freelancer and agency remembering to follow it" ([Reddit](https://www.reddit.com/r/GoogleAnalytics/comments/1va6k30/how_are_you_enforcing_consistent_utm_naming_or/)).
- Another thread is titled "Manually building UTM parameters for every link is killing my productivity" ([Reddit](https://www.reddit.com/r/GoogleAnalytics/comments/1uffhq9/manually_building_utm_parameters_for_every_link/)).
- A third asks for a "scalable UTM structure for Paid Social (Meta…)" to "move away from manually typing UTMs for every paid social campaign/ad set/ad" ([Reddit](https://www.reddit.com/r/GoogleAnalytics/comments/1t72yyf/need_advice_on_scalable_utm_structure_for_paid/)).
- Search shows the same pattern. "utm builder ga4" is a Breakout rising query, and "utm parameters" peaks in Black Friday week ([Trends](https://trends.firecrawl.dev/explore?q=utm+builder&date=today+5-y); see [DEMAND.md](DEMAND.md)).

**Goals**
- Every campaign shows up in GA4 under the right channel, so spend can be compared.
- Ship links quickly, especially around launches and sales peaks.
- Stop explaining "Unassigned" and "(not set)" in the weekly report.

**Context and tools.** GA4, Meta Ads Manager, Google Ads, an ESP (Klaviyo, Mailchimp or HubSpot), Shopify or WordPress, Google Sheets, Slack, Bitly. Usually Chrome on a laptop.

**Current workaround**
- [Google's Campaign URL Builder](https://ga-dev-tools.google/ga4/campaign-url-builder/), which ranks #1 for "utm builder" ([SERP](https://www.google.com/search?q=utm+builder&hl=en&gl=us)).
- A "master spreadsheet with standardized templates", as described in [r/PPC](https://www.reddit.com/r/PPC/comments/1sjp2b7/how_do_you_keep_utms_consistent_when_running/).
- Copying last month's link and editing it **(estimate)**.

**Frustrations**
- Case and spelling splits. Google confirms values are case sensitive ([10917952](https://support.google.com/analytics/answer/10917952)).
- Paid traffic counted as organic because of medium choices, for example `facebook` + `fb_ads` → Organic Social (README, checked against [9756891](https://support.google.com/analytics/answer/9756891)).
- New channels they didn't know existed: AI Assistant (launched 13 May 2026, [release notes](https://support.google.com/analytics/answer/9164320)) and Paid Other.
- ESP defaults they never chose. Klaviyo changed its default utm_medium on 2 June 2025 ([Klaviyo](https://help.klaviyo.com/hc/en-us/articles/115005247808)).

**What "done" looks like.** One click turns the current page into a tagged link with a green "Paid Social" verdict. It is pasted into Meta's URL parameters field unchanged. The next GA4 report has no new Unassigned rows.

**Feature mapping**

| Need | Existing | Candidate |
|---|---|---|
| Fast correct link from the current tab | B (popup, context menu, templates, channel predictor) | – |
| Per-platform paste format | B (Meta URL parameters, Google Ads suffix/template) | – |
| Check the newsletter before it goes out | K (email HTML tagger) | **N2** (pre-send check in Klaviyo/Mailchimp/HubSpot editor), **N1** (paste HTML, one-click fix) |
| Confirm UTMs survive redirects | B (link check, landing test) | – |
| Keep freelancers on the convention | G, T | **N4** (rules file they can open on the website checker without installing) |

---

## P2. Agency or freelancer managing many clients

**Who.** A performance or growth agency of 3 to 50 people, or a solo freelancer, managing 5 to 30 client GA4 properties. Each client has its own naming conventions and approval habits.

**Evidence**
- From r/AskMarketing: "The UTM chaos is so real. We manage 15 client accounts and every client wants different naming conventions. Half our monthly reporting time…" ([Reddit](https://www.reddit.com/r/AskMarketing/comments/1r2xtic/marketers_how_are_you_using_ai_to_manage_growing/)).
- From r/agency, "What tools do you use to manage your UTMs?": replies recommend per-client "teams" in paid tools ([Reddit](https://www.reddit.com/r/agency/comments/1mtf3e4/what_tools_do_you_use_to_manage_your_utms/)).
- A former agency worker "used custom Excel or Google Sheets templates to build UTMs and naming conventions" ([Reddit](https://www.reddit.com/r/GoogleAnalytics/comments/1uffhq9/manually_building_utm_parameters_for_every_link/)).
- Paid tools sell exactly this model: per-client workspaces in Uplifter ([agency page](https://uplifter.ai/link-management-for-agencies)), per-workspace billing up to $79/month in linkutm ([Capterra](https://www.capterra.ca/software/1106417/linkutm)), and an agency case study about "juggling multiple spreadsheets" from CampaignTrackly ([use cases](https://www.campaigntrackly.com/utm-link-builder-code-generator-use-cases/)).
- An agency glossary says: "For agencies managing campaigns across multiple clients or locations, UTM governance scales from a nice-to-have to a requirement" ([DeltaV Digital](https://www.deltavdigital.com/resources/glossary/utm-parameters/)).

**Goals**
- Switch client context without carrying values across from another client.
- Prove to the client that the agency's work is correctly attributed. CampaignTrackly frames the fear as "inconsistent campaign tracking under-reports your work & erodes client trust" ([CampaignTrackly](https://campaigntrackly.com/?p=81704)).
- Onboard juniors and freelancers onto each client's rules in minutes.

**Context and tools.** Many GA4 properties, Meta Business Manager, Google Ads MCC, client Shopify and HubSpot logins, Google Sheets per client, Slack Connect, Looker Studio. They work in several Chrome profiles **(estimate)**.

**Current workaround.** One Sheets template per client, plus a convention PDF, plus month-end clean-up in Looker Studio with CASE/REGEX **(estimate)**. Some pay for UTM.io or CampaignTrackly. Those extensions have 10,000 and 390 users respectively on CWS ([UTM.io](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp), [CampaignTrackly](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn)).

**Frustrations**
- Per-seat SaaS pricing across many clients.
- Clients' in-house staff and other agencies break the convention.
- No proof trail of who made which link.
- Month-end "Unassigned" reconciliation eats reporting time (the Reddit quote above).

**What "done" looks like**
- Each client has a workspace with locked sources and mediums and a campaign formula.
- A junior builds 200 links from the media plan CSV, and every row shows a GA4 verdict.
- The client receives a rules file and a link checker URL. They can audit any link themselves, with no seat licence.

**Feature mapping**

| Need | Existing | Candidate |
|---|---|---|
| Per-client rules | G (unlimited workspaces, locked dropdowns, regex, formula) | – |
| Bulk from media plan | K (matrix, CSV upload) | – |
| Share rules with client and freelancers | T (share codes, JSON, PIN, approvals) | **N4** (same rules JSON used by the website Bulk UTM Link Checker, so the client checks without installing) |
| Audit client data | A (GA4 CSV audit) | **N1** (scan a client landing page or email and fix links in one click) |
| Proof trail | T (activity log), W (Sheets webhook) | – |
| Email QA for clients' ESPs | K (HTML tagger) | **N2** (pre-send check in HubSpot/Mailchimp/Klaviyo, the ESPs most cited in autocomplete: see [DEMAND.md](DEMAND.md) C2) |

---

## P3. Founder / D2C operator (including an India D2C operator running WhatsApp and Meta ads)

**Who.** The founder, or a one- or two-person growth team, at a direct-to-consumer brand on Shopify. In India the sales motion leans heavily on WhatsApp:
- Meta click-to-WhatsApp ads
- broadcasts to opted-in customers
- COD confirmation
- a WhatsApp button on product pages

**Evidence**
- Meta says it trains Indian small businesses on "how to set up ads that click to WhatsApp" ([Meta newsroom, Sept 2024](https://about.fb.com/news/2024/09/new-ways-for-businesses-to-have-more-meaningful-conversations-on-whatsapp/)).
- Meta reports that WhatsApp Cloud API powers 70,000 Indian businesses a month ([Meta newsroom, Apr 2025](https://about.fb.com/news/2025/04/partnering-with-indias-agency-ecosystem-to-build-agencies-of-the-future/)). These are vendor figures.
- WhatsApp's own [ads that click to WhatsApp](https://whatsappbusiness.com/products/ads-that-click-to-whatsapp/) product page, and the [Marketing API click-to-WhatsApp docs](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp/).
- Pricing pressure: Meta lists higher India marketing-message rates from 1 January 2026 ([WhatsApp pricing](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing)). That makes it more important to know which broadcasts actually drive sales **(estimate)**.
- Search: in India, "whatsapp link" averages 74 on the Trends index while "utm builder" averages 1 ([Trends IN](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cwa.me+link%2Cwhatsapp+link%2Cutm+link&geo=IN&date=today+12-m)). The "whatsapp link generator" SERP is full of Indian WhatsApp-API vendors such as AiSensy, Interakt and Fonada ([SERP](https://www.google.com/search?q=whatsapp+link+generator&hl=en&gl=in)).
- "utm parameters for whatsapp" returns about 92 results, including the PAA "Can I add UTM parameters directly to a WhatsApp link?" ([SERP](https://www.google.com/search?q=utm+parameters+for+whatsapp&hl=en&gl=in)).
- Forums: "Build a Shopify store or send the leads to WhatsApp for conversion?" ([r/dropshipping](https://www.reddit.com/r/dropshipping/comments/1p8obp0/build_a_shopify_store_or_send_the_leads_to/)). "How WhatsApp marketing works for Indian businesses" ([r/WhatsappBusinessAPI](https://www.reddit.com/r/WhatsappBusinessAPI/comments/1q4d6q5/how_whatsapp_marketing_works_for_indian_businesses/)).
- A WhatsApp-attribution vendor notes that ad platforms "can't see what happens after a click into WhatsApp" ([respond.io](https://respond.io/help/capture-leads/how-to-attribute-whatsapp-conversations-to-non-meta-ads.md)).

**Goals**
- Know which ad, influencer post or WhatsApp broadcast produced orders, with limited time and no analyst.
- Create wa.me links with a pre-filled message, and QR codes for packaging, stores and events. The [WhatsApp FAQ](https://faq.whatsapp.com/5913398998672934) gives the format: `https://wa.me/<number>?text=<encoded>`.
- Keep Meta ROAS and GA4/Shopify numbers roughly in agreement.

**Context and tools**
- Shopify
- Meta Ads Manager (often the only paid channel)
- WhatsApp Business app, or an API provider such as AiSensy, Interakt or Wati
- Instagram
- GA4, installed by an agency and rarely opened **(estimate)**
- Google Sheets
- A phone-first workflow with Chrome on desktop only for set-up **(estimate)**

**Current workaround**
- Free web generators (create.wa.link, AiSensy, Kommo) for wa.me links.
- Shopify's own reports rather than GA4.
- `utm_source=whatsapp` typed by hand on broadcast links, with inconsistent mediums **(estimate)**.

**Frustrations**
- WhatsApp traffic lands in **Organic Social** whatever the broadcast. "whatsapp" is on Google's social source list, so `utm_source=whatsapp` with any non-paid medium resolves to Organic Social. I checked this with this repo's predictor against [Google's rules](https://support.google.com/analytics/answer/9756891). The result is that owned messaging gets mixed with organic posts.
- UTMs placed on the wa.me URL itself do nothing for GA4, because the click opens a chat, not the site. This is a common misunderstanding: see the PAA above.
- Meta tags (`utm_source=meta`) fall into Paid Other (README; [9756891](https://support.google.com/analytics/answer/9756891)).
- Health and wellness brands may find Meta restricting URL parameters and custom data. Third-party sources describe this ([PixelFlow](https://docs.pixelflow.so/what-are-metas-health-and-wellness-restrictions-and-how-do-they-affect-tracking-ce3t3)), and Meta's official page confirms health-data filtering ([Meta](https://www.facebook.com/business/help/361948878201809)). See RISKS.md.
- Hindi and regional-language campaign names produce mixed scripts in reports **(estimate)**. The existing non-Latin rule helps here.

**What "done" looks like**
- One screen produces a wa.me link with a pre-filled message. The message contains a short, UTM-tagged product link (for example `utm_source=whatsapp&utm_medium=broadcast` or a team-agreed value), and there is a QR code and a plain-English note on where it will appear in GA4.
- Meta ads use a "Meta FB/IG" template that lands in Paid Social.
- A weekly glance at GA4 shows WhatsApp broadcasts as a separate row.

**Feature mapping**

| Need | Existing | Candidate |
|---|---|---|
| wa.me link + message + QR | B (styled QR) | **N3** (WhatsApp builder: number validation, `?text=` encoding, UTM-tagged site link inside the text, QR, GA4 verdict for that inner link) |
| Correct Meta tags | B (Meta templates, macros, one-click fixes) | – |
| Broadcast link hygiene | B, K (Cleaner) | **N1** (check every link in a broadcast or template draft pasted as text) |
| Non-Latin names | G (non-Latin rule: allow, transliterate or block) | Hindi transliteration support **(estimate: not built; README lists Arabic only)** |
| Light set-up | B (15 templates) | **N4** (download a starter rules file, e.g. "India D2C: Meta + WhatsApp + Shopify") |

---

## P4. Analyst or developer who audits GA4 data

**Who.** A web analyst, analytics engineer or GTM developer, in-house or consultant. They own GA4 configuration, BigQuery export and Looker Studio, and get called in when "the numbers look wrong".

**Evidence**
- "Spike in GA4 unassigned traffic – please help!", where the poster wonders about "renaming the utm source / medium" ([r/PPC](https://www.reddit.com/r/PPC/comments/wwkxoe/spike_in_ga4_unassigned_traffic_please_help/)).
- "Seeing incorrect UTM codes in bulk": mail servers "pre-click" links as a spam check ([r/GoogleAnalytics](https://www.reddit.com/r/GoogleAnalytics/comments/16hhpvy/seeing_incorrect_utm_codes_in_bulk_when_marketing/)).
- "UTM Source and Campaign changed when viewed in GA", for email sent from Salesforce ([r/GoogleAnalytics](https://www.reddit.com/r/GoogleAnalytics/comments/1mlovca/utm_source_and_campaign_changed_when_viewed_in_ga/)).
- "Broken links due to automated UTM / Google Analytics tracking" ([r/MailChimp](https://www.reddit.com/r/MailChimp/comments/ra7r6g/broken_links_due_to_automated_utm_google_analytic/)).
- A thread on the new AI Assistant channel a month after launch ([r/GoogleAnalytics](https://www.reddit.com/r/GoogleAnalytics/comments/1u3rgu4/ga4_launched_an_ai_assistant_channel_heres_what/)).
- A large and growing body of Unassigned explainers: Analytics Mania (Sept 2026), Optimize Smart, InfoTrust, TAGGRS, Stape, and Google's own [tagging best practices](https://support.google.com/analytics/answer/14847402) ([SERP](https://www.google.com/search?q=unassigned+traffic+ga4&hl=en&gl=us)).
- A Google developer forum user reports that BigQuery's source platform field shows only "Google Ads" and "Manual" ([discuss.google.dev](https://discuss.google.dev/t/bigquery-source-platform-ga4-dimension/169296)). This matches Google's note that utm_source_platform is reported as "Manual" for now ([15593651](https://support.google.com/analytics/answer/15593651)).

**Goals**
- Find the source/medium pairs that cause Unassigned, Paid Other and misattributed organic, sized by sessions.
- Fix the cause upstream (link creation) rather than patching with custom channel groups.
- Separate tagging errors from technical causes: tag order, session timeouts, Measurement Protocol, consent. Google lists the technical causes in [14847402](https://support.google.com/analytics/answer/14847402).
- Keep up with Google's rule changes, such as AI Assistant and the Source Group field (June 2026, [release notes](https://support.google.com/analytics/answer/9164320)).

**Context and tools.** GA4 Explorations, BigQuery, GTM (web and server), Looker Studio, GA Debugger and Tag Assistant extensions, Python or SQL, Git. They are comfortable with JSON and regex.

**Current workaround**
- Export Traffic acquisition to Sheets and use REGEXMATCH against the channel rules.
- Build custom channel groups.
- Write a "UTM standards" doc nobody reads **(estimate)**.
- Google's channel definitions page as the reference ([9756891](https://support.google.com/analytics/answer/9756891)).

**Frustrations**
- The rules change, and Google doesn't date the change on the definitions page ([9756891](https://support.google.com/analytics/answer/9756891) says only "recently made improvements").
- Marketers keep reintroducing bad values.
- Link rewriting by ESPs and Safe Links makes "what was sent" hard to reconstruct. Safe Links wraps URLs as `*.safelinks.protection.outlook.com` and detonates unknown links ([Microsoft Learn](https://learn.microsoft.com/en-us/defender-office-365/safe-links-about)).
- Privacy browsers strip click IDs. Brave strips `_gl` and Firefox strips `gclid`/`fbclid` (see RISKS.md), which breaks cross-domain and ads joins. Safari 26 stops "known fingerprinting scripts" reading query parameters ([WebKit](https://webkit.org/blog/17333/webkit-features-in-safari-26-0/)).

**What "done" looks like**
- Upload the GA4 CSV and get a ranked list of bad pairs, each with sessions, the rule that failed and a suggested clean value.
- One click adds the clean value to the workspace's approved lists.
- The same rules JSON lives in Git and is enforced in marketers' browsers and on the website checker.

**Feature mapping**

| Need | Existing | Candidate |
|---|---|---|
| Find bad pairs at scale | A (GA4 CSV audit), K (Cleaner) | Direct GA4 Data API (README roadmap) |
| Rules as code | T (workspace JSON) | **N4** (versioned rules JSON with a published schema, shared with the website Bulk UTM Link Checker; diff-friendly for Git) |
| Verify a live page | A (page link checker), B (landing test checks GA4 tag present) | **N1** (one-click fix suggestions per link) |
| Understand rule changes | B (predictor with Google's rules and source list) | Changelog in-product when Google's rules change **(estimate)** |
| Email-origin anomalies | – | **N2** only partly helps: pre-send checks catch bad tags, not Safe Links or ESP rewriting after send |

---

## Cross-persona summary

| Candidate | P1 In-house | P2 Agency | P3 D2C / India | P4 Analyst | Evidence strength |
|---|---|---|---|---|---|
| N1 Page/email checker with one-click fixes | High | High | Medium | High | Medium. Checker search demand is small, but forum pain is strong and CWS checker titles have barely any users ([DEMAND.md](DEMAND.md)) |
| N2 Pre-send check in Gmail/Outlook/ESP editors | Medium | Medium–High | Low | Low | Weak demand signal: "check links before sending" is phishing intent. Highest technical and policy risk (RISKS.md) |
| N3 WhatsApp click-to-chat builder + UTM + QR | Low–Medium | Medium (Indian, MENA and LatAm clients) | **High** | Low | Strong search volume for WhatsApp links. The WhatsApp+UTM content gap is real (about 92 results) |
| N4 Rules JSON shared with website checker | Medium | **High** | Low | **High** | Medium. Matches agency workflows and gives the website tool a reason to exist |

Suggested build order: N4 and N1 first (low risk, reuse the existing engine), then N3 (high demand in India, no new permissions), and N2 last (see RISKS.md).
