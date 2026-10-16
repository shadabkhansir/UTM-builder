# User feedback research: UTM building, checking and GA4 attribution

Prepared for UTM Builder & Checker for GA4 by The Growth Folks®. Collected 16 October 2026. Contact: team@thegrowthfolks.com.

**Total: 495 individual items**, every one with a source URL: 408 Reddit posts, 58 Chrome Web Store reviews and 29 G2 reviews. No personal names or usernames are included. Text is paraphrased; anything in quotation marks is a short snippet copied from the source (25 words or fewer).

## 1. Method

### Sources searched and what each gave

| Source | How it was reached | Fetched | Itemised | Notes |
|---|---|---|---|---|
| Chrome Web Store reviews | Searched the store for "utm", "utm builder", "utm checker", "utm tracking", "campaign url", "utm parameters", "url builder", "ga4 utm", "utm link", "link tracking", "campaign tracking", "utm generator", "utm manager", "utm viewer" and "tracking parameters". That gave 57 listings; 40 were UTM-related (privacy "UTM remover" and unrelated tools were dropped). Reviews were pulled through the store's own review data endpoint, 100 per listing, so each listing's full review list was read, not just the 10 the page shows. | 116 written reviews across 12 listings (28 of the 40 listings, including Terminus, UTM Params Checker, GA4 UTM Channel Checker, UTM Tagger GA4 Debugger and UTM Parameters for Pardot, have no written reviews) | 58 | 57 reviews were left out because they say nothing beyond "Great!", "ok", "Top!" or "MUST HAVE". One off-topic review was also left out (a URL-parameter tool used for booking filters). The listings are gaidpiakchgkapdgbnoglpnbccdepnpk (46 reviews), eoaapiimcaimddnfhfnifgkinmpcbccp (UTM.io, 23), acidoblgnoinmcobmdfpeoepdkmfoebn (CampaignTrackly, 15), flockfgmfgmpmimlfkkeepkblckodbjg (Express UTM-Builder, 13), aeobmgopfphamnhmagbdgdjdeiiigknk (UTM Forge, 9), kciaggijldaonffolbldkcgdocfjmldg (3), fhfngcdeploenaaeakjdkkacnnjjdhll (2), plus 1 each for babdcjccdkaonphgbmhiibjcanalblkl, debkcejopkpfoabgdkgajangnbdgjdld, ghhpgbckobngiaohcfljdpbpgcklnggp, mpejlmangeopegkhhkoedboenappiggp and ledcfjocmebjmelaefkgegmjkacopjnm. |
| Reddit | reddit.com and old.reddit.com refused requests from this environment (HTTP 403/redirect), and Firecrawl does not support Reddit. Posts were pulled from the Arctic Shift Reddit archive API instead. Title search for "utm" in r/GoogleAnalytics, r/PPC, r/marketing, r/analytics, r/GoogleTagManager, r/SEO, r/bigseo, r/ecommerce, r/shopify, r/IndianStartups, r/agency, r/SaaS, r/Emailmarketing, r/digital_marketing, r/googleads and r/FacebookAds. Then targeted title searches: "unassigned" and "not set" (r/GoogleAnalytics), "whatsapp" (r/GoogleAnalytics, r/PPC, r/FacebookAds, r/digital_marketing, r/IndianStartups), and "link tracking" (r/Emailmarketing). | 884 posts (672 from the "utm" searches, 212 more from the targeted searches, after removing deleted posts and off-topic WhatsApp business posts) | 408 | Cross-posts of the same question to several subreddits count once. Vendor posts were left out: "I built a UTM tool", disclosed "I work on a UTM tool" posts and thinly disguised promotions. Link spam and how-to guides with no user problem were also left out. Each search returns at most 100 posts, so the busiest subreddits are cut off by date: r/PPC "utm" covers 2023-01 to 2026-10, r/GoogleAnalytics "utm" covers 2022-01 onwards, and "unassigned" covers 2023 onwards. |
| G2 | Firecrawl scrape of the first review page for UTM.io, Terminus URL Builder, CampaignTrackly and Claravine | 40 reviews shown | 29 | Two Terminus reviews were about a different product with the same name (an ABM ad platform and a command-line tool) and were dropped. So were generic link-shortener praise reviews with no UTM content. Only page 1 was read for each product. |

**Date range:** 24 Nov 2011 to 16 Oct 2026. Most items fall between 2022 and 2026; the Chrome Web Store reviews are mostly from 2012 to 2019.

**Tags:** every item has one or more of complaint (266), confusion (124), praise (64), feature-request (55) and workaround (27). Every item also carries one or more theme codes: P for pain, F for feature. The codes were assigned by hand from each post's title and opening text.

### Limitations (please read before using the numbers)

- **Reddit items are question posts, not comment threads.** Only the title and roughly the first 350 characters of each post were read. Answers and replies, where most workarounds live, were not collected. Workarounds are therefore under-counted.
- **Reddit over-represents troubleshooting.** People post when something is broken, so complaints and confusion dominate. The counts measure how often a problem comes up, not how serious it is.
- **Many "Unassigned"/"(not set)" posts are not caused by UTMs.** Consent mode, server-side tagging, bots and GA4 processing issues also cause them. Theme P4 includes all of them because they are the same pain for the user, but a UTM tool can only fix the UTM-caused share.
- **Chrome Web Store reviews skew positive and old.** Several clusters look solicited: CampaignTrackly's reviews fall within a few days in Dec 2018, UTM Forge's within 5 to 7 May 2026, and two different listings carry near-identical review text. They are useful for vocabulary and for which features people praise, not for measuring pain.
- **Sources not covered, with reasons.** Capterra, Trustpilot, Product Hunt, Stack Overflow / Webmasters Stack Exchange, MeasureSchool, Analytics Mania and YouTube comments were not collected in this pass. Google Analytics and Google Ads Help Community threads were searched for but the web search returned only third-party articles, so none are included. Bitly and Rebrandly G2 pages were not scraped: their hundreds of reviews are mostly about general link shortening. These are good next sources, especially Help Community threads and Reddit comments for workarounds.
- Counts in sections 2 and 3 can overlap, because one item can carry several themes.


## 2. Top 15 pains, ranked by count

Count = number of items tagged complaint, confusion or workaround that carry the theme (an item can carry more than one theme). Praise-only items are not counted here.

| Rank | Pain | Items | Main sources |
|---|---|---|---|
| 1 | "Unassigned", "(not set)" and wrong "Direct" attribution | 75 | Reddit r/GoogleAnalytics 61, Reddit r/FacebookAds 7 |
| 2 | Can't find or see UTM data in GA4 (set-up confusion) | 47 | Reddit r/GoogleAnalytics 23, Reddit r/FacebookAds 5 |
| 3 | UTMs lost across redirects, page changes, domains, iframes and forms/CRM | 45 | Reddit r/PPC 12, Reddit r/GoogleTagManager 9 |
| 4 | WhatsApp / click-to-chat conversions can't be attributed | 35 | Reddit r/PPC 23, Reddit r/FacebookAds 10 |
| 5 | Ad-platform dynamic parameters/macros broken or confusing (Meta, TikTok, LinkedIn, X, Snapchat) | 30 | Reddit r/PPC 16, Reddit r/FacebookAds 13 |
| 6 | Inconsistent naming and casing fragments reports | 25 | Reddit r/GoogleAnalytics 11, G2 4 |
| 7 | Syntax and encoding errors (? vs #, &, %7B, %2B, apostrophes) | 23 | Reddit r/PPC 7, Reddit r/analytics 5 |
| 8 | Google Ads auto-tagging vs manual UTMs conflicts | 23 | Reddit r/GoogleAnalytics 8, Reddit r/googleads 7 |
| 9 | Ad formats where UTMs can't be added or don't carry through | 21 | Reddit r/FacebookAds 10, Reddit r/PPC 7 |
| 10 | Ad platform or email tool numbers don't match GA4 UTM data | 15 | Reddit r/FacebookAds 7, Reddit r/GoogleAnalytics 3 |
| 11 | Shopify / Merchant Center overwrites UTMs (sag_organic, product_sync) | 13 | Reddit r/PPC 4, Reddit r/shopify 4 |
| 12 | Tool bugs, reliability and support | 11 | Chrome Web Store 9, G2 2 |
| 13 | Building UTMs by hand is slow and tedious | 9 | Reddit r/GoogleAnalytics 2, Reddit r/PPC 2 |
| 14 | UTM URLs indexed or duplicated in SEO and page reports | 9 | Reddit r/SEO 5, Reddit r/GoogleAnalytics 1 |
| 15 | utm_content / utm_term hard to find in GA4 | 9 | Reddit r/PPC 3, Reddit r/GoogleAnalytics 2 |

**1. "Unassigned", "(not set)" and wrong "Direct" attribution** (75 items)

- Reddit r/FacebookAds, 2026-10-16: Meta ads to Shopify now show as direct or "Shop" app even though UTMs have worked for years. ([U001](https://www.reddit.com/r/FacebookAds/comments/1x736c9/no_utm_or_conversion_tracking_on_shopify/))
- Reddit r/GoogleAnalytics, 2026-05-15: The entire UTM string shows up as the Source in GA4 and the medium is "not set". ([U017](https://www.reddit.com/r/GoogleAnalytics/comments/1tdxw96/entire_utm_string_showing_as_source_in_ga4/))
- Reddit r/PPC, 2025-07-23: Meta dynamic UTMs ({{campaign.name}} etc.) all show as "not set" in GA4. ([U066](https://www.reddit.com/r/PPC/comments/1m74mfa/where_am_i_going_wrong_with_meta_utm_tracking/))
- All items: U001, U017, U032, U047, U066, U326, U330, U331, U340, U343, U347, U144, U355, U358, U363, U370, U376, U382, U390, U392, U267, U310, U315, U317, U318, U323, U046, U075, U076, U098, U128, U325, U327, U328, U332, U333, U338, U339, U344, U345 …

**2. Can't find or see UTM data in GA4 (set-up confusion)** (47 items)

- Reddit r/GoogleAnalytics, 2026-02-04: Used Google's Campaign URL Builder; test click not in Traffic Acquisition; maybe under "(not set)"? ([U032](https://www.reddit.com/r/GoogleAnalytics/comments/1qw1l0q/utm_not_tracking_on_ga4/))
- Reddit r/marketing, 2025-01-13: "Very confused by the whole concept": do I need to connect anything for UTM data to appear in GA4? ([U126](https://www.reddit.com/r/marketing/comments/1i01psq/utm_codes/))
- Reddit r/googleads, 2024-09-16: Asked to "install GA4 UTM links" on Google Ads campaigns; how? ([U166](https://www.reddit.com/r/googleads/comments/1fi94rf/installing_utm_links/))
- All items: U032, U036, U093, U108, U126, U166, U223, U481, U007, U013, U026, U030, U037, U039, U052, U053, U055, U062, U065, U073, U074, U080, U096, U099, U100, U101, U115, U117, U118, U119, U128, U134, U143, U149, U153, U168, U203, U224, U235, U240 …

**3. UTMs lost across redirects, page changes, domains, iframes and forms/CRM** (45 items)

- Reddit r/GoogleAnalytics, 2026-05-18: Solo founder: GA4 knows "google / cpc" but the users table has no UTM columns, so signups cannot be attributed. ([U016](https://www.reddit.com/r/GoogleAnalytics/comments/1tgwrvu/from_gtm_migration_to_missing_utm_columns_getting/))
- Reddit r/PPC, 2024-03-05: CRM UTM fields fill with "(Not reported at origin)" for months. ([U216](https://www.reddit.com/r/PPC/comments/1b77iy5/utm_not_reported_at_origin/))
- Reddit r/digital_marketing, 2026-10-02: Influencer links with UTMs: unsure whether GA4 credits the sale to the influencer or a referral ID is needed. ([U004](https://www.reddit.com/r/digital_marketing/comments/1wvowwx/do_i_need_our_developers_to_set_up_referral_ids/))
- All items: U016, U216, U004, U005, U010, U022, U041, U046, U054, U061, U071, U076, U081, U082, U083, U091, U092, U102, U106, U107, U120, U157, U171, U179, U180, U192, U194, U200, U204, U206, U227, U233, U236, U237, U264, U266, U282, U285, U291, U293 …

**4. WhatsApp / click-to-chat conversions can't be attributed** (35 items)

- Reddit r/FacebookAds, 2026-02-08: Ad to WhatsApp to cash on delivery: purchase tracking "essentially unavailable". ([U324](https://www.reddit.com/r/FacebookAds/comments/1qz6zb3/campaign_type_with_whatsapp_cod_funnel/))
- Reddit r/PPC, 2025-09-03: Paid traffic into WhatsApp; GA4/Ads rows empty: "We've tried UTMs + sheets + zaps. Painful." ([U334](https://www.reddit.com/r/PPC/comments/1n7bejm/anyone_cracked_clicktowhatsapp_attribution_our/))
- Reddit r/GoogleAnalytics, 2024-10-04: Do clicks from WhatsApp get tracked as direct or referral (or organic social)? ([U362](https://www.reddit.com/r/GoogleAnalytics/comments/1fvxi3n/do_clicks_from_whatsapp_get_tracked_as_direct_or/))
- All items: U324, U334, U336, U337, U360, U377, U405, U311, U312, U313, U314, U316, U319, U320, U321, U322, U329, U335, U341, U342, U349, U190, U361, U362, U371, U383, U257, U388, U391, U399, U400, U402, U403, U404, U407

**5. Ad-platform dynamic parameters/macros broken or confusing (Meta, TikTok, LinkedIn, X, Snapchat)** (30 items)

- Reddit r/PPC, 2025-07-23: Meta dynamic UTMs ({{campaign.name}} etc.) all show as "not set" in GA4. ([U066](https://www.reddit.com/r/PPC/comments/1m74mfa/where_am_i_going_wrong_with_meta_utm_tracking/))
- Reddit r/FacebookAds, 2025-08-14: Meta ads: difference between UTMs in the Destination section and the Tracking section? ([U058](https://www.reddit.com/r/FacebookAds/comments/1mpv3ls/utm_tags_configuration/))
- Chrome Web Store (Google Analytics UTM Builder, 2★), 2016-08-16: Google Analytics UTM Builder: Ad macros get encoded as %7Bkeyword%7D instead of {keyword}. ([U450](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews))
- All items: U066, U067, U202, U003, U015, U021, U058, U079, U118, U124, U129, U140, U151, U158, U170, U173, U174, U184, U188, U195, U205, U215, U225, U245, U246, U248, U249, U255, U263, U450

**6. Inconsistent naming and casing fragments reports** (25 items)

- Reddit r/GoogleAnalytics, 2026-07-29: "paid social / paid-social / paid_social / paidsocial": "GA4 treats these as separate values"; how do teams enforce naming? ([U009](https://www.reddit.com/r/GoogleAnalytics/comments/1va6k30/how_are_you_enforcing_consistent_utm_naming_or/))
- Reddit r/PPC, 2026-04-26: Links live in spreadsheets and Slack threads, duplicates get created, "nobody knowing what campaign a link belongs to months later". ([U020](https://www.reddit.com/r/PPC/comments/1svwd4m/how_are_you_keeping_utm_naming_consistent_across/))
- Reddit r/digital_marketing, 2026-04-12: facebook, fb, meta all separate; cpc, paid, ads mixed; reporting "hard to trust". ([U025](https://www.reddit.com/r/digital_marketing/comments/1sjp0f7/anyone_else_struggling_with_messy_utm_data_in_ga4/))
- All items: U009, U012, U020, U025, U028, U114, U475, U479, U008, U023, U024, U037, U039, U049, U109, U133, U138, U154, U159, U160, U193, U195, U395, U482, U493

**7. Syntax and encoding errors (? vs #, &, %7B, %2B, apostrophes)** (23 items)

- Reddit r/GoogleAnalytics, 2026-05-15: The entire UTM string shows up as the Source in GA4 and the medium is "not set". ([U017](https://www.reddit.com/r/GoogleAnalytics/comments/1tdxw96/entire_utm_string_showing_as_source_in_ga4/))
- Reddit r/PPC, 2025-08-12: If the URL already has a query (?q=), will Google/Meta switch "?" to "&" for UTMs or break the link? ([U059](https://www.reddit.com/r/PPC/comments/1mo0mlw/will_google_and_meta_change_utm_tracking_insert/))
- Reddit r/GoogleTagManager, 2022-07-06: Why does the UTM query start with "#" instead of "?" ([U269](https://www.reddit.com/r/GoogleTagManager/comments/vt11uw/google_utm_query_string_delimiter_beginning_with/))
- All items: U017, U059, U150, U229, U269, U303, U304, U308, U060, U069, U085, U089, U164, U184, U212, U218, U226, U234, U253, U493, U299, U450, U452

**8. Google Ads auto-tagging vs manual UTMs conflicts** (23 items)

- Reddit r/shopify, 2026-02-16: Will UTMs in the Google Ads "Final URL suffix" show in Shopify's order conversion details? ([U031](https://www.reddit.com/r/shopify/comments/1r6nnps/will_utm_parameters_added_in_final_url_suffix/))
- Reddit r/PPC, 2024-03-28: UTMs "always overwhelmed me": account, campaign or ad level? ([U213](https://www.reddit.com/r/PPC/comments/1bplsof/utm_tracking_google_ads/))
- Reddit r/GoogleAnalytics, 2024-07-30: Google Ads sessions suddenly "(referral)" and "(not set)" campaign despite stable clicks. ([U370](https://www.reddit.com/r/GoogleAnalytics/comments/1efr8wj/getting_session_campaign_referral_and_not_set/))
- All items: U031, U213, U370, U034, U042, U064, U090, U105, U125, U147, U152, U155, U161, U172, U366, U373, U230, U242, U244, U275, U276, U287, U290

**9. Ad formats where UTMs can't be added or don't carry through** (21 items)

- Reddit r/PPC, 2025-05-20: Wants UTM-based custom audiences in Meta; knows a "Persist Campaign Data" GTM script workaround. ([U087](https://www.reddit.com/r/PPC/comments/1kqrvtl/utm_based_custom_audience/))
- Reddit r/FacebookAds, 2024-11-14: Boosted Facebook/Instagram posts show as "(not set)"; there is no option to add UTMs. ([U144](https://www.reddit.com/r/FacebookAds/comments/1grc04j/setting_proper_utms_on_boosted_posts/))
- Reddit r/googleads, 2024-10-29: Demand Gen campaigns give no UTM data: "It's been rough running blind". ([U146](https://www.reddit.com/r/googleads/comments/1gepo7t/solution_for_demand_gen_lack_of_utm_data/))
- All items: U087, U121, U144, U146, U178, U011, U095, U103, U111, U130, U141, U189, U197, U199, U207, U217, U238, U243, U273, U279, U284

**10. Ad platform or email tool numbers don't match GA4 UTM data** (15 items)

- Reddit r/marketing, 2025-03-25: Email tool says 11,000 clicked a link; GA4 shows about 235 first users. "Night and day." ([U104](https://www.reddit.com/r/marketing/comments/1jjrlm3/campaigner_utm_tracking/))
- Reddit r/FacebookAds, 2026-05-28: UTM data in the checkout system is drastically different from what Meta's dashboard reports. ([U014](https://www.reddit.com/r/FacebookAds/comments/1tptt1i/meta_data_utm_data_not_matching_at_all/))
- Reddit r/GoogleAnalytics, 2026-01-28: 90% gap between UTM data in GA4 and figures the agency reports (French-language post). ([U033](https://www.reddit.com/r/GoogleAnalytics/comments/1qpdg02/remontée_de_données_utm/))
- All items: U104, U014, U033, U035, U072, U084, U328, U137, U145, U148, U156, U167, U185, U209, U247

**11. Shopify / Merchant Center overwrites UTMs (sag_organic, product_sync)** (13 items)

- Reddit r/FacebookAds, 2026-10-16: Meta ads to Shopify now show as direct or "Shop" app even though UTMs have worked for years. ([U001](https://www.reddit.com/r/FacebookAds/comments/1x736c9/no_utm_or_conversion_tracking_on_shopify/))
- Reddit r/PPC, 2026-02-22: Shopify labels PMax shopping conversions "sag_organic" instead of the paid campaign. ([U029](https://www.reddit.com/r/PPC/comments/1rbjlaw/sag_organic_shopify_not_showing_paid_ads_via_utm/))
- Reddit r/shopify, 2026-02-16: Will UTMs in the Google Ads "Final URL suffix" show in Shopify's order conversion details? ([U031](https://www.reddit.com/r/shopify/comments/1r6nnps/will_utm_parameters_added_in_final_url_suffix/))
- All items: U001, U029, U031, U038, U070, U043, U048, U113, U182, U228, U232, U239, U256

**12. Tool bugs, reliability and support** (11 items)

- G2 (UTM.io), 2021-10-18: UTM.io: systematised naming; "Rarely, a created UTM string doesn't save." ([U475](https://www.g2.com/products/utm-io/reviews))
- Chrome Web Store (UTM.io, 2★), 2018-04-24: UTM.io: New version "not working efficiently". ([U422](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews))
- Chrome Web Store (CampaignTrackly, 1★), 2017-12-02: CampaignTrackly: "Not working!!!" ([U413](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews))
- All items: U475, U422, U413, U451, U453, U495, U421, U439, U428, U432, U454

**13. Building UTMs by hand is slow and tedious** (9 items)

- Reddit r/GoogleAnalytics, 2026-10-08: Running ads on several platforms; UTM links "getting messy fast" with slightly different versions of the same URL; wants them organised. ([U002](https://www.reddit.com/r/GoogleAnalytics/comments/1x0xhtz/how_do_you_guys_keep_track_of_utm_links/))
- G2 (CampaignTrackly), 2026-04-14: CampaignTrackly: replaced Excel sheets: "No more version control issues or broken formulas." ([U483](https://www.g2.com/products/campaigntrackly/reviews))
- Reddit r/PPC, 2025-08-15: Click-to-WhatsApp: started with "manual UTM tagging + spreadsheets, which is tedious and annoying". ([U337](https://www.reddit.com/r/PPC/comments/1mqr99m/whats_your_setup_for_tracking_which_ads_are/))
- All items: U002, U012, U483, U337, U018, U191, U196, U416, U430

**14. UTM URLs indexed or duplicated in SEO and page reports** (9 items)

- Reddit r/SEO, 2026-08-10: Product URLs with UTMs got indexed and now pull more clicks than the clean slugs, despite canonicals. ([U006](https://www.reddit.com/r/SEO/comments/1vkom68/utm_urls_of_some_of_the_product_pages_got_indexed/))
- Reddit r/GoogleAnalytics, 2025-09-18: Funnel reports clogged by redundant page rows that differ only by UTM codes. ([U050](https://www.reddit.com/r/GoogleAnalytics/comments/1nju2so/trim_utm_code_from_google_analytics_funnel_reports/))
- Reddit r/bigseo, 2023-05-09: robots.txt allowed /*utm_source URLs; Google crawled a huge number. ([U252](https://www.reddit.com/r/bigseo/comments/13cjqxs/utm_source_urls_indexed_by_google/))
- All items: U006, U050, U077, U176, U252, U254, U277, U288, U305

**15. utm_content / utm_term hard to find in GA4** (9 items)

- Reddit r/GoogleAnalytics, 2026-03-25: Cannot find "Session manual ad content" (utm_content) anywhere in Traffic Acquisition. ([U027](https://www.reddit.com/r/GoogleAnalytics/comments/1s3dvu2/utm_code_content_parameter/))
- Reddit r/googleads, 2021-12-22: utm_content often shows "not set" while source, medium and campaign are fine. ([U280](https://www.reddit.com/r/googleads/comments/rm4dwr/google_analytics_not_recognising_utm_content/))
- Reddit r/SEO, 2021-04-30: GA4 shows term/content "in the most useless way possible". ([U286](https://www.reddit.com/r/SEO/comments/n1hzlw/utm_parameters_in_google_analytics_4/))
- All items: U027, U280, U286, U041, U110, U112, U175, U231, U289

## 3. Top 15 requested features, ranked by count

Count = items that ask for the capability, complain that it is missing, or praise a tool specifically for having it. "Explicit asks" = items tagged feature-request.

| Rank | Feature | Items | Explicit asks |
|---|---|---|---|
| 1 | Team-wide naming rules and shared templates (pick-lists, lower-casing) | 17 | 6 |
| 2 | Saved presets / templates | 14 | 3 |
| 3 | Short / branded links (Bitly etc.) | 14 | 4 |
| 4 | Link history / central library of every link | 10 | 8 |
| 5 | Custom parameters beyond the standard five, IDs, merge fields | 10 | 6 |
| 6 | Library of ad-platform dynamic macros (Meta, Google Ads, TikTok) | 10 | 9 |
| 7 | UTM checker / audit (verify a link or a session's attribution) | 7 | 6 |
| 8 | Persist UTMs into forms / CRM | 5 | 4 |
| 9 | Bulk generation (many links, CSV) | 5 | 3 |
| 10 | Auto-fill the current tab's URL | 5 | 0 |
| 11 | Remember last values (per domain) | 4 | 2 |
| 12 | Quick access (right-click menu, popup stays open, favourites) | 3 | 1 |
| 13 | Offline / print (QR) campaign tagging | 2 | 1 |
| 14 | Tagged WhatsApp links per team or agent | 2 | 2 |
| 15 | Control over parameter order | 2 | 1 |

**1. Team-wide naming rules and shared templates (pick-lists, lower-casing)** (17 items)

- Reddit r/GoogleAnalytics, 2026-07-29: "paid social / paid-social / paid_social / paidsocial": "GA4 treats these as separate values"; how do teams enforce naming? ([U009](https://www.reddit.com/r/GoogleAnalytics/comments/1va6k30/how_are_you_enforcing_consistent_utm_naming_or/))
- Reddit r/analytics, 2026-03-24: Naming conventions exist but no enforcement ("google", "Google", "adwords"); everyone "relying on a shared spreadsheet and hoping". ([U028](https://www.reddit.com/r/analytics/comments/1s2aipc/how_do_you_enforce_utm_naming_conventions_across/))
- Reddit r/FacebookAds, 2025-01-23: Agency: manual UTMs for every ad across many clients "takes a ton of time"; can creation be automated? ([U122](https://www.reddit.com/r/FacebookAds/comments/1i849gw/is_it_possible_to_automate_utm_creation_for/))
- All items: U009, U028, U122, U472, U440, U476, U479, U018, U219, U220, U468, U485, U420, U437, U441, U442, U446

**2. Saved presets / templates** (14 items)

- Reddit r/GoogleAnalytics, 2026-06-25: "Manually building UTM parameters for every link is killing my productivity"; messes up naming; wants fill-in fields plus a record of links. ([U012](https://www.reddit.com/r/GoogleAnalytics/comments/1uffhq9/manually_building_utm_parameters_for_every_link/))
- Chrome Web Store (UTM Forge, 5★), 2026-05-07: UTM Forge: Building, saving and adding favourites accessible anywhere in Chrome is "a breeze". ([U417](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews))
- G2 (Claravine), 2026-05-26: Claravine: parameterised links track emails and WhatsApps; wishes templates were pre-filled since most values repeat. ([U490](https://www.g2.com/products/claravine/reviews))
- All items: U012, U417, U451, U490, U484, U468, U420, U474, U430, U431, U434, U435, U455, U459

**3. Short / branded links (Bitly etc.)** (14 items)

- Reddit r/digital_marketing, 2024-04-06: Reasons not to use UTMs include the "long, ugly and awkward tail" on links. ([U210](https://www.reddit.com/r/digital_marketing/comments/1bx5l71/what_would_be_the_reasons_for_not_using_utm/))
- Chrome Web Store (Google Analytics UTM Builder, 4★), 2016-01-13: Google Analytics UTM Builder: Loves presets and bit.ly link; "a bit buggy"; would pay for a supported version. ([U451](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews))
- G2 (Terminus), 2016-11-01: Terminus: drop-down lists made team UTMs consistent; having to use the bit.ly version is "irritating". ([U476](https://www.g2.com/products/terminus-url-builder/reviews))
- All items: U210, U451, U476, U045, U078, U142, U487, U467, U468, U265, U433, U480, U455, U456

**4. Link history / central library of every link** (10 items)

- Reddit r/GoogleAnalytics, 2026-10-08: Running ads on several platforms; UTM links "getting messy fast" with slightly different versions of the same URL; wants them organised. ([U002](https://www.reddit.com/r/GoogleAnalytics/comments/1x0xhtz/how_do_you_guys_keep_track_of_utm_links/))
- Reddit r/PPC, 2026-04-26: Links live in spreadsheets and Slack threads, duplicates get created, "nobody knowing what campaign a link belongs to months later". ([U020](https://www.reddit.com/r/PPC/comments/1svwd4m/how_are_you_keeping_utm_naming_consistent_across/))
- G2 (CampaignTrackly), 2026-04-14: CampaignTrackly: replaced Excel sheets: "No more version control issues or broken formulas." ([U483](https://www.g2.com/products/campaigntrackly/reviews))
- All items: U002, U012, U020, U483, U281, U183, U471, U302, U307, U427

**5. Custom parameters beyond the standard five, IDs, merge fields** (10 items)

- Chrome Web Store (UTM.io, 4★), 2017-04-12: UTM.io: Wants last state per (sub)domain, presets are too much effort ("ain't nobody got time for that"), custom params like utm_month, and parameter reordering: "Every. Time." ([U424](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews))
- Reddit r/GoogleAnalytics, 2026-07-31: How to use utm_id at a large company; how to generate a unique code per campaign. ([U008](https://www.reddit.com/r/GoogleAnalytics/comments/1vby9xt/utm_id_guidance/))
- Reddit r/Emailmarketing, 2025-01-17: Do lemlist custom variables work inside UTM query strings for per-recipient tracking? ([U123](https://www.reddit.com/r/Emailmarketing/comments/1i3gfv8/lemlist_custom_variables_in_url_query_string_utm/))
- All items: U424, U008, U123, U181, U186, U211, U222, U258, U268, U438

**6. Library of ad-platform dynamic macros (Meta, Google Ads, TikTok)** (10 items)

- Reddit r/FacebookAds, 2025-01-23: Agency: manual UTMs for every ad across many clients "takes a ton of time"; can creation be automated? ([U122](https://www.reddit.com/r/FacebookAds/comments/1i849gw/is_it_possible_to_automate_utm_creation_for/))
- Reddit r/PPC, 2024-09-24: Needs Google Ads equivalents of Meta's {{ad.name}}; "googling this for 30 minutes". ([U162](https://www.reddit.com/r/PPC/comments/1fogkup/what_are_the_dynamic_utm_to_pull_automatically/))
- Reddit r/googleads, 2025-02-17: Wants the exact Google Ads search query as a UTM; {keyword} only gives the matched keyword. ([U116](https://www.reddit.com/r/googleads/comments/1iro3k0/how_can_i_track_the_exact_google_ads_search_query/))
- All items: U122, U162, U015, U018, U086, U116, U165, U169, U187, U191

**7. UTM checker / audit (verify a link or a session's attribution)** (7 items)

- Reddit r/analytics, 2026-03-24: Naming conventions exist but no enforcement ("google", "Google", "adwords"); everyone "relying on a shared spreadsheet and hoping". ([U028](https://www.reddit.com/r/analytics/comments/1s2aipc/how_do_you_enforce_utm_naming_conventions_across/))
- Chrome Web Store (UTM Channel Checker, 5★), 2026-10-04: UTM Channel Checker: "A good extension. I was looking for something similar. Simple and working" ([U466](https://chromewebstore.google.com/detail/babdcjccdkaonphgbmhiibjcanalblkl/reviews))
- Reddit r/GoogleAnalytics, 2025-11-06: How often do you audit utm_* usage and who owns the definitions? Teams each run their own patterns. ([U040](https://www.reddit.com/r/GoogleAnalytics/comments/1opyljn/how_do_you_keep_track_audit_ga4_utm_param_usage/))
- All items: U028, U466, U040, U131, U220, U241, U272

**8. Persist UTMs into forms / CRM** (5 items)

- Reddit r/GoogleAnalytics, 2026-05-18: Solo founder: GA4 knows "google / cpc" but the users table has no UTM columns, so signups cannot be attributed. ([U016](https://www.reddit.com/r/GoogleAnalytics/comments/1tgwrvu/from_gtm_migration_to_missing_utm_columns_getting/))
- Reddit r/ecommerce, 2025-08-22: Wants a website chatbot that captures gclid and utm_* with the lead. ([U056](https://www.reddit.com/r/ecommerce/comments/1mx2cwq/recommendation_request_which_llm_chatbot_should_i/))
- Reddit r/GoogleTagManager, 2024-05-17: Wants to keep GCLID and UTMs in cookies and pass them to Contact Form 7 emails. ([U201](https://www.reddit.com/r/GoogleTagManager/comments/1cu09du/how_do_i_capture_gclid_and_utm_parameter_info/))
- All items: U016, U056, U201, U221, U300

**9. Bulk generation (many links, CSV)** (5 items)

- G2 (Terminus), 2016-08-01: Terminus: remembers params, bulk build; had started building it in Google Sheets/Forms; "damn expensive" for business. ([U477](https://www.g2.com/products/terminus-url-builder/reviews))
- Reddit r/PPC, 2024-07-31: Big team may need tens of thousands of UTMs; wants a tool with a central inventory. ([U183](https://www.reddit.com/r/PPC/comments/1egnryz/looking_for_a_tool_that_creates_and_tracks_utms/))
- Reddit r/googleads, 2022-11-08: Wants a different UTM per creative/ad size in the same ad group. ([U261](https://www.reddit.com/r/googleads/comments/ypnzm8/is_it_possible_to_set_a_different_utm_link_for/))
- All items: U477, U183, U261, U411, U478

**10. Auto-fill the current tab's URL** (5 items)

- Chrome Web Store (Google Analytics UTM Builder, 2★), 2015-06-24: Google Analytics UTM Builder: Suddenly stopped auto-filling the URL from the address bar; "seems to be no support". ([U453](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews))
- Chrome Web Store (Google Analytics UTM Builder, 1★), 2011-12-05: Google Analytics UTM Builder: "Barely more than a bookmark": must type the URL instead of using the current page. ([U461](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews))
- Chrome Web Store (CampaignTrackly, 5★), 2018-12-22: CampaignTrackly: No need to open a new tab and a separate UTM website any more. ([U412](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews))
- All items: U453, U461, U412, U415, U462

**11. Remember last values (per domain)** (4 items)

- Chrome Web Store (UTM.io, 4★), 2017-04-12: UTM.io: Wants last state per (sub)domain, presets are too much effort ("ain't nobody got time for that"), custom params like utm_month, and parameter reordering: "Every. Time." ([U424](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews))
- Chrome Web Store (UTM Builder, 5★), 2024-05-22: UTM Builder: Likes that it preserves subdomain state and allows changing parameter order. ([U436](https://chromewebstore.google.com/detail/fhfngcdeploenaaeakjdkkacnnjjdhll/reviews))
- Chrome Web Store (UTM.io, 5★), 2017-01-17: UTM.io: Remembers filled fields so past campaign names can be recalled. ([U427](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews))
- All items: U424, U436, U427, U458

**12. Quick access (right-click menu, popup stays open, favourites)** (3 items)

- Chrome Web Store (UTM Forge, 5★), 2026-05-07: UTM Forge: Building, saving and adding favourites accessible anywhere in Chrome is "a breeze". ([U417](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews))
- Chrome Web Store (UTM Forge, 5★), 2026-05-07: UTM Forge: Was "toggling between tabs and messy spreadsheets"; loves right-click favourites and local-first privacy; free. ([U418](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews))
- Chrome Web Store (Google Analytics UTM Builder, 4★), 2012-08-09: Google Analytics UTM Builder: Wants the popup to stay open until closed manually. ([U460](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews))
- All items: U417, U418, U460

**13. Offline / print (QR) campaign tagging** (2 items)

- Reddit r/analytics, 2025-10-10: Sticker QR-code campaign: can a campaign be tagged without source or medium? ([U044](https://www.reddit.com/r/analytics/comments/1o2q7sv/utm_parameters_campaign_without_source_or_medium/))
- Reddit r/marketing, 2024-08-19: QR codes on signage, murals and print at two locations: best practice for offline UTMs? ([U177](https://www.reddit.com/r/marketing/comments/1ew8vp0/how_do_you_determine_utm_parameters_for_offline/))
- All items: U044, U177

**14. Tagged WhatsApp links per team or agent** (2 items)

- Reddit r/PPC, 2024-04-14: How do CRMs track WhatsApp numbers/UTMs via WhatsApp Web QR authentication? ([U208](https://www.reddit.com/r/PPC/comments/1c3qozl/question_about_whatsapp_api_for_utm_tracking/))
- Reddit r/GoogleAnalytics, 2024-02-27: Wants a WhatsApp payment link with a unique UTM for each of five teams; asks for naming convention. ([U381](https://www.reddit.com/r/GoogleAnalytics/comments/1b1de2o/utm_advice_for_whatsapp_individual_links/))
- All items: U208, U381

**15. Control over parameter order** (2 items)

- Chrome Web Store (UTM.io, 4★), 2017-04-12: UTM.io: Wants last state per (sub)domain, presets are too much effort ("ain't nobody got time for that"), custom params like utm_month, and parameter reordering: "Every. Time." ([U424](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews))
- Chrome Web Store (UTM Builder, 5★), 2024-05-22: UTM Builder: Likes that it preserves subdomain state and allows changing parameter order. ([U436](https://chromewebstore.google.com/detail/fhfngcdeploenaaeakjdkkacnnjjdhll/reviews))
- All items: U424, U436

## 4. Notable workarounds people use today

Item IDs refer to the appendix.

- **Spreadsheets and Excel templates are the default.** People build UTMs in Excel and paste them into ad platforms (U021). Others keep a self-built Google Sheet that is "a bit clumsy" (U281) or ask for a shareable builder sheet (U302). Paid-tool reviewers describe leaving spreadsheets with "complicated and fragile formulas" (U472), "version control issues or broken formulas" (U483) or outdated values (U482, U485). One had started building a tool from Google Sheets and Forms (U477). Links also end up scattered across spreadsheets and Slack threads (U020). No Google Apps Script workaround turned up in the posts read.
- **Sheets and Zapier pipelines for leads.** Form to Zapier to Google Sheet chains capture UTM columns, but they arrive blank "a few times a day" (U227). For WhatsApp leads, one team reports "We've tried UTMs + sheets + zaps. Painful." (U334). Another uses "manual UTM tagging + spreadsheets", which it calls tedious (U337). Shopify UTM reports get exported to Sheets by hand (U051).
- **GTM and cookie scripts to keep UTMs alive.** UTMs are stored in a cookie and written into hidden form fields (U294, U201, U171) or pushed into iframes (U071). Some use a "Persist Campaign Data" GTM script (U087) or a site script that appends stored UTMs to later links, which breaks when the site changes (U300). Others keep UTMs through to Calendly with GTM (U022).
- **Offline conversion import for WhatsApp.** The GCLID is captured when the WhatsApp button is clicked, and conversions are uploaded when the chat becomes a sale (U349). This is because a click on "Chat on WhatsApp" is not a lead (U371).
- **Fixing GA4 after the fact.** Custom channel groups absorb "Unassigned", which one site cut from 38% of traffic (U382). Custom reports get re-filtered every time (U325). One team changed a server-side GTM cookie setting (U346), and others exclude self-referrals and subdomains (U356). An agency audit got Unassigned down to 0.68% (U318).
- **Google Ads scripts and home-made parameters.** A script pushes PMax campaign names into the tracking template (U238). Hand-made parameters fill gaps, such as utm_knock=g (U196). One site switched from utm_source to ref because some analytics tools ignore UTMs (U258).
- **Shorteners to hide the long tail.** UTM'd links go inside Bitly (U265, U451), and branded short links are used for bio links and app-store routing (U045, U078).
- **Separate tagged links per team** for WhatsApp payment links, so each team's sales can be told apart (U381).
- **Paid tools** (UTM.io, Terminus, CampaignTrackly, Claravine) are the fix for teams that can afford them. Their own reviewers name cost, learning curve and dated interfaces as the downsides (U469, U477, U486, U489, U491).

## 5. Words and phrases users use

Use these in the UI copy and the store listing (in British spelling, for example standardise and organise).

- **What they call the thing:** UTM links, UTM codes, UTM tags, UTMs, tracking links, tagged URLs, campaign URLs, trackable links, parameters, "UTM string", "naked link" (an untagged link).
- **The mess:** "getting messy fast", messy UTM data, inconsistent naming, naming convention, "fb vs facebook", duplicates, "hard to trust", fragmented data, "nobody knowing what campaign a link belongs to".
- **The loss:** UTMs "dropped", "stripped", "falling off", "lost", "not sticking", redirect "strips my link", "running blind".
- **GA4 symptoms:** "Unassigned", "(not set)", "(direct) / (none)", "shows as direct", "not showing up in GA4", "Traffic acquisition", "session source / medium", "manual ad content".
- **Ad platform terms:** dynamic parameters, URL parameters, "{{campaign.name}}", "{{site_source_name}}", "{lpurl}", ValueTrack, tracking template, "Final URL suffix", auto-tagging, gclid, fbclid, sag_organic.
- **WhatsApp:** Click-to-WhatsApp (CTWA), "Chat on WhatsApp" button, WhatsApp button click, conversations started, "leads come through WhatsApp", cash on delivery.
- **Effort:** "killing my productivity", "time suck", "tedious", "retyping", "every. time.", "toggling between tabs and messy spreadsheets".
- **What good looks like:** presets, templates, favourites, consistent, standardise, "clean", "in one place", "share templates with others", "stops me making typos", "local-first privacy", free.
- **Checking:** "check if UTM parameters lost", audit, "which UTM is my session attributed to", test the link.


## 6. Appendix: full tagged item list

495 items. Themes use the codes from sections 2 and 3 (P = pain, F = feature). Text is a paraphrase unless in quotation marks; quotes are short snippets from the source.

| ID | Source type | Link | Date | Tags | Paraphrase / short quote | Theme |
|---|---|---|---|---|---|---|
| U001 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1x736c9/no_utm_or_conversion_tracking_on_shopify/) | 2026-10-16 | complaint | Meta ads to Shopify now show as direct or "Shop" app even though UTMs have worked for years. | P10, P4 |
| U002 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1x0xhtz/how_do_you_guys_keep_track_of_utm_links/) | 2026-10-08 | confusion, feature-request | Running ads on several platforms; UTM links "getting messy fast" with slightly different versions of the same URL; wants them organised. | P6, P14, F3 |
| U003 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1wzxlxy/linkedin_ads_breaking_my_urlutm_string/) | 2026-10-07 | complaint | LinkedIn breaks a URL's UTM string (the & separators) inside a post being turned into a Thought Leader Ad. | P5 |
| U004 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1wvowwx/do_i_need_our_developers_to_set_up_referral_ids/) | 2026-10-02 | confusion | Influencer links with UTMs: unsure whether GA4 credits the sale to the influencer or a referral ID is needed. | P3 |
| U005 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1wi3svh/i_thought_utm_tracking_solved_attribution_it/) | 2026-09-16 | complaint | UTMs capture the lead's origin, but it is lost by the time the lead becomes a customer weeks later. | P3 |
| U006 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1vkom68/utm_urls_of_some_of_the_product_pages_got_indexed/) | 2026-08-10 | complaint | Product URLs with UTMs got indexed and now pull more clicks than the clean slugs, despite canonicals. | P12 |
| U007 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1vkcly2/utm_links_for_play_store_and_app_store/) | 2026-08-10 | confusion | How do you build UTM links for Play Store and App Store download clicks? No tutorial found. | P1 |
| U008 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1vby9xt/utm_id_guidance/) | 2026-07-31 | confusion, feature-request | How to use utm_id at a large company; how to generate a unique code per campaign. | F8, P2 |
| U009 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1va6k30/how_are_you_enforcing_consistent_utm_naming_or/) | 2026-07-29 | complaint, feature-request | "paid social / paid-social / paid_social / paidsocial": "GA4 treats these as separate values"; how do teams enforce naming? | P2, F2 |
| U010 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1v7yxm6/need_advice_on_reliable_utm_tracking_between/) | 2026-07-27 | complaint | UTM tags frequently dropped between Calendly bookings and Pipedrive CRM, so campaign ROI cannot be tracked. | P3 |
| U011 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1uiivma/utm_in_instant_form/) | 2026-06-29 | confusion | How to add UTMs to Meta instant forms. | P11 |
| U012 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1uffhq9/manually_building_utm_parameters_for_every_link/) | 2026-06-25 | complaint, feature-request | "Manually building UTM parameters for every link is killing my productivity"; messes up naming; wants fill-in fields plus a record of links. | P6, P2, F1, F3 |
| U013 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/1tvj969/how_to_track_button_clicks_with_utm_parameters/) | 2026-06-03 | confusion | Wants UTMs on internal CTA buttons to see which button was clicked (misuse of UTMs). | P1 |
| U014 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1tptt1i/meta_data_utm_data_not_matching_at_all/) | 2026-05-28 | complaint | UTM data in the checkout system is drastically different from what Meta's dashboard reports. | P7 |
| U015 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1tjp8ta/utm_parameter_for_snapchat_and_meta/) | 2026-05-21 | confusion | How to add UTM macros ({{campaign.id}} etc.) to Snapchat campaigns so they show in GA4. | P5, F12 |
| U016 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1tgwrvu/from_gtm_migration_to_missing_utm_columns_getting/) | 2026-05-18 | complaint, feature-request | Solo founder: GA4 knows "google / cpc" but the users table has no UTM columns, so signups cannot be attributed. | P3, F13 |
| U017 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1tdxw96/entire_utm_string_showing_as_source_in_ga4/) | 2026-05-15 | complaint | The entire UTM string shows up as the Source in GA4 and the medium is "not set". | P4, P16 |
| U018 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1t72zfv/need_advice_on_scalable_utm_structure_for_paid/) | 2026-05-08 | feature-request, complaint | Wants to stop manually typing UTMs for every paid social campaign/ad set/ad across Meta, LinkedIn and TikTok. | P6, F12, F2 |
| U019 | Reddit r/Emailmarketing | [link](https://www.reddit.com/r/Emailmarketing/comments/1sxin58/klaviyo_deprecating_utm_links/) | 2026-04-27 | complaint | Klaviyo deprecated UTMs on individual links used to tell image vs button clicks apart: "Are we joking???" | P15 |
| U020 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1svwd4m/how_are_you_keeping_utm_naming_consistent_across/) | 2026-04-26 | complaint, feature-request | Links live in spreadsheets and Slack threads, duplicates get created, "nobody knowing what campaign a link belongs to months later". | P14, P2, F3 |
| U021 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1svh8k8/any_advice_on_for_why_im_seeing_utm_id_parameter/) | 2026-04-25 | confusion, workaround | An unexpected utm_id appears on Instagram ad URLs; poster builds UTMs in Excel and pastes them in. | P5 |
| U022 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1sosnc0/how_to_pass_utm_parameters_through_to_calendly/) | 2026-04-18 | complaint | How to keep UTM parameters through to Calendly when users move between pages (GTM). | P3 |
| U023 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1so1e5l/placement_in_utm_source/) | 2026-04-17 | complaint | Agency puts {{placement}} in utm_source; inconsistent sources break GA's data import. | P2 |
| U024 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1sjp3xg/how_do_you_deal_with_inconsistent_utm_naming_in/) | 2026-04-12 | complaint | fb vs facebook and cpc vs paid fragment GA4 data; enforce naming up front or clean later in Looker/BigQuery? | P2 |
| U025 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1sjp0f7/anyone_else_struggling_with_messy_utm_data_in_ga4/) | 2026-04-12 | complaint | facebook, fb, meta all separate; cpc, paid, ads mixed; reporting "hard to trust". | P2 |
| U026 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1s84fxq/how_do_i_get_utm_data_from_google_analytics/) | 2026-03-30 | confusion | Client wanted UTMs on banner ads without any tag on the site; confused why no data. | P1 |
| U027 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1s3dvu2/utm_code_content_parameter/) | 2026-03-25 | confusion | Cannot find "Session manual ad content" (utm_content) anywhere in Traffic Acquisition. | P19 |
| U028 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/1s2aipc/how_do_you_enforce_utm_naming_conventions_across/) | 2026-03-24 | complaint, feature-request | Naming conventions exist but no enforcement ("google", "Google", "adwords"); everyone "relying on a shared spreadsheet and hoping". | P2, F2, F7 |
| U029 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1rbjlaw/sag_organic_shopify_not_showing_paid_ads_via_utm/) | 2026-02-22 | complaint | Shopify labels PMax shopping conversions "sag_organic" instead of the paid campaign. | P10 |
| U030 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1r7fepi/how_do_i_set_up_utm_links_for_ga4_in_2026/) | 2026-02-17 | confusion | How to set up UTM links for GA4 in 2026; many guides seem outdated. | P1 |
| U031 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/1r6nnps/will_utm_parameters_added_in_final_url_suffix/) | 2026-02-16 | confusion | Will UTMs in the Google Ads "Final URL suffix" show in Shopify's order conversion details? | P9, P10 |
| U032 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1qw1l0q/utm_not_tracking_on_ga4/) | 2026-02-04 | confusion | Used Google's Campaign URL Builder; test click not in Traffic Acquisition; maybe under "(not set)"? | P1, P4 |
| U033 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1qpdg02/remontée_de_données_utm/) | 2026-01-28 | complaint | 90% gap between UTM data in GA4 and figures the agency reports (French-language post). | P7 |
| U034 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1qe0rjw/google_ads_with_utm_campaign/) | 2026-01-16 | complaint | With Google Ads auto-tagging, utm_campaign never reaches the site, so it cannot be stored locally. | P9 |
| U035 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1pt8j27/why_does_my_utm_data_appear_to_be_incorrect/) | 2025-12-22 | confusion | GA4 shows 49 sessions from an Instagram UTM link while Instagram shows 17 clicks. | P7 |
| U036 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1pt40lb/ive_added_the_utm_parameters_to_my_urls_now_how/) | 2025-12-22 | confusion | Newbie added UTMs to URLs; how do I "tell Google" to track them? | P1 |
| U037 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1pqhdma/how_do_you_effectively_use_utm_in_ga4/) | 2025-12-19 | confusion | Understands UTMs but in GA4 tying traffic to real campaigns feels messy; which parameters matter? | P1, P2 |
| U038 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/1p3t59d/shopify_overwriting_utm_parameters_cant_identify/) | 2025-11-22 | complaint | "Shopify overwriting UTM parameters, can't identify which are paid ads" (sag_organic / product_sync). | P10 |
| U039 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1ov6ln6/utm_parameters_explained_for_a_newbie/) | 2025-11-12 | confusion | Newbie: should every social post get its own tag? How detailed should UTMs be? | P1, P2 |
| U040 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1opyljn/how_do_you_keep_track_audit_ga4_utm_param_usage/) | 2025-11-06 | confusion, feature-request | How often do you audit utm_* usage and who owns the definitions? Teams each run their own patterns. | P14, F7 |
| U041 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1oep0uz/ga4_not_recording_utm_content_parameters_suddenly/) | 2025-10-24 | complaint | GA4 not recording utm_content; landing page redirect breaks the UTM. | P3, P19 |
| U042 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1oc01m6/ga4_utm_vs_google_ads_autotagging/) | 2025-10-21 | complaint | GA4 session campaign shows both the UTM campaign and the Google Ads campaign name. | P9 |
| U043 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1obfjjz/ads_utm_says_organic/) | 2025-10-20 | complaint | Shopping-tab Sponsored Products sales show as organic; impossible to separate ads vs organic. | P10 |
| U044 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/1o2q7sv/utm_parameters_campaign_without_source_or_medium/) | 2025-10-10 | confusion | Sticker QR-code campaign: can a campaign be tagged without source or medium? | F19 |
| U045 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1o0pdtt/how_do_you_track_links_with_utm_parameters_while/) | 2025-10-07 | feature-request | Wants UTM-tracked links that are short and branded and route to the right app store. | F6 |
| U046 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1o063ye/shopify_utm_tag_problem/) | 2025-10-07 | complaint | Shopify influencer UTM links show (direct)/(none) in GA4; landing page sometimes redirects. | P4, P3 |
| U047 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1nx7rl8/question_about_utm_link_not_set_in_pages_and/) | 2025-10-03 | confusion | New to GA4: confused by "(not set)" in Pages and Screens for a UTM-linked onboarding flow. | P4 |
| U048 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1nuhkzo/meta_shopify_price_increases_with_utm_parameters/) | 2025-09-30 | complaint | Shopify product price jumps when UTM parameters are in the URL from Meta ads. | P10 |
| U049 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/1nojdxx/does_anybody_else_enjoy_injecting_random_utm/) | 2025-09-23 | complaint | People tamper with UTM values in public links; analysts worry junk values reach reports. | P2 |
| U050 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1nju2so/trim_utm_code_from_google_analytics_funnel_reports/) | 2025-09-18 | complaint | Funnel reports clogged by redundant page rows that differ only by UTM codes. | P12 |
| U051 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/1njc3gl/exporting_utm_parameters_to_google_sheet/) | 2025-09-17 | workaround, feature-request | Wants Shopify UTM campaign reports exported automatically to Google Sheets. | F16 |
| U052 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1nefjt6/utm_code_tracking_help/) | 2025-09-11 | confusion | How do I actually apply UTM codes, on third-party sites or our own? What about AI tool traffic? | P1 |
| U053 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1n8d59j/ecommerce_revenue_by_utm_source_and_item/) | 2025-09-04 | confusion | Wants revenue broken down by UTM source and product together in GA4. | P1 |
| U054 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1mxvp3g/passing_utm_parameters/) | 2025-08-23 | complaint | Prelander to landing page: how to pass Taboola UTM parameters on to the second page? | P3 |
| U055 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1mx9sz7/why_dont_my_ga4_traffic_acquisition_reports_show/) | 2025-08-22 | confusion | LinkedIn UTM link tested in incognito but the campaign never appears in Traffic Acquisition. | P1 |
| U056 | Reddit r/ecommerce | [link](https://www.reddit.com/r/ecommerce/comments/1mx2cwq/recommendation_request_which_llm_chatbot_should_i/) | 2025-08-22 | feature-request | Wants a website chatbot that captures gclid and utm_* with the lead. | F13 |
| U057 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1msxwpa/how_to_exclude_a_specific_utm_source_from_reports/) | 2025-08-17 | complaint | Dealers keep using an old campaign URL months later; its utm_source still pollutes GA4 and Looker reports. | P14 |
| U058 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1mpv3ls/utm_tags_configuration/) | 2025-08-14 | confusion | Meta ads: difference between UTMs in the Destination section and the Tracking section? | P5 |
| U059 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1mo0mlw/will_google_and_meta_change_utm_tracking_insert/) | 2025-08-12 | confusion | If the URL already has a query (?q=), will Google/Meta switch "?" to "&" for UTMs or break the link? | P16 |
| U060 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1mlovca/utm_source_and_campaign_changed_when_viewed_in_ga/) | 2025-08-09 | complaint | Newsletter UTMs show up with source and campaign altered by random characters. | P16 |
| U061 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/1mia7ek/utm_params_dropping_off/) | 2025-08-05 | complaint | New Shopify store: UTM params drop off as soon as users navigate to another page. | P3 |
| U062 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1mhj84n/when_i_built_urls_with_utm_tracking_i_cant_see/) | 2025-08-04 | confusion | Built URLs with UTM tracking but sees no metrics at all in GA4. | P1 |
| U063 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1mgiutb/will_adding_utm_parameter_to_existing_ad_reset/) | 2025-08-03 | confusion | Does adding UTMs to an existing winning Meta ad reset learning? Afraid to touch it. | P13 |
| U064 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1mfo0zi/how_to_use_utm_tracking_gclid_together/) | 2025-08-02 | confusion | Adding campaign-level UTMs in Google Ads seems to stop gclid/wbraid appearing. | P9 |
| U065 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1mdnbc1/utm_tracking_source_persistence/) | 2025-07-31 | confusion | How long does an email/newsletter source persist if the user later returns via organic? | P1 |
| U066 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1m74mfa/where_am_i_going_wrong_with_meta_utm_tracking/) | 2025-07-23 | complaint | Meta dynamic UTMs ({{campaign.name}} etc.) all show as "not set" in GA4. | P5, P4 |
| U067 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1m5h6rb/another_utm_meta_post_apologies/) | 2025-07-21 | complaint | Meta dynamic links failing: "scratching my head after 3 intense days of searching for a solution". | P5 |
| U068 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1m0t1mg/why_is_hubspot_not_attributing_utm_source/) | 2025-07-15 | complaint | HubSpot puts links tagged utm_source=referral under "Other" instead of Referrals. | P20 |
| U069 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1lw6gky/google_ads_sends_people_to_404_utm_problem/) | 2025-07-10 | complaint | PMax adds tracking automatically and clicks land on a 404 even for the homepage. | P16 |
| U070 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1lvly4t/google_shopping_ads_utm_issue/) | 2025-07-09 | complaint | Shopping ad URL is "a mess": suffix UTMs are doubled up with organic feed UTMs. | P10 |
| U071 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1lqnxkp/how_to_push_utm_parameters_from_parent_site_to/) | 2025-07-03 | complaint | Stuck pushing UTM parameters from parent page into an iframe form via GTM cookies. | P3 |
| U072 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1lqi9ix/utm_tags_cause_shopify_tracking_to_worsen_despite/) | 2025-07-03 | complaint | After UTM changes, Meta tracks even fewer of the Shopify sales (57 sales, 34 in Meta). | P7 |
| U073 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1lpm4k1/utm_tags_not_on_ga/) | 2025-07-02 | confusion | Beginner blogger: sponsor gave UTM links but the tags cannot be found in GA. | P1 |
| U074 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1ll117p/relationship_between_utm_and_gtm_in_ad_campaigns/) | 2025-06-26 | confusion | What is the connection between UTMs and GTM? | P1 |
| U075 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1ljvjey/more_sales_showing_no_utm_tracking/) | 2025-06-25 | complaint | More and more sales arriving with no UTM parameters at all. | P4 |
| U076 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1lfnvb1/ga4_showing_directnone_for_linkedin_ads_utm_issue/) | 2025-06-19 | complaint | LinkedIn Ads traffic shows (direct)/(none) instead of linkedin/cpc; suspects link shortening or redirect. | P4, P3 |
| U077 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1lfdtwj/high_number_of_deindexed_page_on_search_console/) | 2025-06-19 | complaint | Search Console flags many live pages as 404/missing because of UTM-parameter versions. | P12 |
| U078 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ldzlys/how_to_add_utm_parameters_to_bio_link_by_only/) | 2025-06-17 | feature-request | Wants UTMs on an Instagram bio link while only showing mysite.com. | F6 |
| U079 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1lcmmnw/cannot_changeremove_utm_link_in_my_facebook/) | 2025-06-16 | complaint | Cannot change or remove a UTM link on a Facebook public post once used in an ad. | P5 |
| U080 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1lbsewd/need_help_figuring_out_utm_tracking_in_google/) | 2025-06-15 | confusion | Tried various UTM tools but GA will not show the campaigns, mediums and sources set. | P1 |
| U081 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1l7ghje/can_someone_explain_how_to_setup_utm_persistence/) | 2025-06-09 | complaint | GA4 is ~95% accurate but CRM UTM fields are often empty with server-side tracking. | P3 |
| U082 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1l3cfty/utm_tracking_issue_is_broken_when_i_use_an_iframe/) | 2025-06-04 | complaint | iframe booking widget: transactions arrive but UTMs are lost (new session). | P3 |
| U083 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1kyl6zn/do_you_lose_utm_parameters_when_you_switch/) | 2025-05-29 | complaint | WordPress site: UTMs lost between pages, HubSpot shows Direct for landing page leads; redirect suspected. | P3 |
| U084 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1kwbyd4/shopify_utm_captures_conversion_but_facebook/) | 2025-05-27 | complaint | Shopify UTMs capture Facebook conversions that Ads Manager does not show. | P7 |
| U085 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1kr7va9/google_ads_disapproving_url_with_utm_code_but/) | 2025-05-20 | complaint | Google Ads disapproves the URL when it includes a UTM code but approves it without. | P16 |
| U086 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1kr6dmv/tracking_dynamic_parameters_for_ai_variation/) | 2025-05-20 | feature-request | Wants Meta AI-variation headlines/images passed as UTM values; docs list only ids and names. | F12 |
| U087 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1kqrvtl/utm_based_custom_audience/) | 2025-05-20 | workaround | Wants UTM-based custom audiences in Meta; knows a "Persist Campaign Data" GTM script workaround. | P11 |
| U088 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1kq4mvq/utm_medium_shows_cpc_in_analytics_despite_using/) | 2025-05-19 | confusion | utm_medium=paid-search shows as "cpc" in Analytics. Why? | P20 |
| U089 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1koqh6x/double_utmparameters/) | 2025-05-17 | confusion | Can one link carry two or three utm_content values? | P16 |
| U090 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1knhazi/utm_issues/) | 2025-05-15 | complaint | Auto-tagging off and UTMs set in Google Ads, yet GA4 still ignores the UTMs. | P9 |
| U091 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1kmq17b/anyone_else_have_problems_with_utm_tags_because/) | 2025-05-14 | complaint | In-app browser: users click the ad, then search Google later, so signups never carry the ad UTMs. | P3 |
| U092 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1klv1sm/how_to_setup_redirects_where_the_from_url/) | 2025-05-13 | complaint | Old email links need redirecting to a new landing page without losing their UTM codes. | P3 |
| U093 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1kiepdu/struggling_with_utm_tags_any_idea/) | 2025-05-09 | complaint | Tags blog links ?utm_source=blog but GA shows zero sessions from "blog", even testing own clicks. | P1 |
| U094 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1khsh5u/utm_tags_in_gmc/) | 2025-05-08 | feature-request | Needs to bulk-remove UTM tags from 3,000 Merchant Center product URLs automatically. | P10 |
| U095 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1kbfd44/performance_max_asset_group_utm_tracking/) | 2025-04-30 | complaint | PMax: the asset-group-level tracking template seems to have disappeared. | P11 |
| U096 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1k9mxhf/how_does_ga4_calculate_utm_contribution_of_a/) | 2025-04-28 | confusion | Struggling to replicate how GA4 attributes UTMs to a session from raw event data. | P1 |
| U097 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1k0kici/ga4_utm_tracking_in_consent_mode/) | 2025-04-16 | confusion | New to GA4/GTM in the EU: how do UTMs behave once tags fire only after consent? | P21 |
| U098 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jzws48/why_direct_organic_search_channel_groups_for_utm/) | 2025-04-15 | confusion | Why do UTM-tagged links show under Direct and Organic Search channel groups? | P4 |
| U099 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jzfk7j/utm_link_not_showing_up_on_ga4/) | 2025-04-15 | confusion | Test of a LinkedIn UTM link does not show in GA4 (utm_term=-). | P1 |
| U100 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jlho5i/is_the_only_way_to_track_link_clicks_inside_a_pdf/) | 2025-03-27 | confusion | Are UTMs the only way to track link clicks inside a PDF? | P1 |
| U101 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jl1v9d/can_not_find_utm_datas_whats_the_problem/) | 2025-03-27 | confusion | Created a URL with UTM but cannot find any data in GA4, real-time or later. | P1 |
| U102 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1jkd5a9/utm_link_in_gbp_profile_gets_removed_after_you/) | 2025-03-26 | complaint | UTM link in a Google Business Profile is removed after clicking the website button. | P3 |
| U103 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1jjx4nx/will_ad_level_utm_params_pass_back_with_a_native/) | 2025-03-25 | confusion | Will ad-level dynamic UTMs come back with a Meta native lead form submission? | P11 |
| U104 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1jjrlm3/campaigner_utm_tracking/) | 2025-03-25 | complaint | Email tool says 11,000 clicked a link; GA4 shows about 235 first users. "Night and day." | P7, P15 |
| U105 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jaeakw/ga4_forcing_manual_utm_paramaters/) | 2025-03-13 | complaint | GA4 seems to force auto-tagged values; cannot find the old manual-override setting. | P9 |
| U106 | Reddit r/Emailmarketing | [link](https://www.reddit.com/r/Emailmarketing/comments/1j9iesv/utm_parameters_from_ads_in_brevo/) | 2025-03-12 | confusion | Client wants Google/Meta ad UTMs to land in Brevo contact lists via forms. | P3 |
| U107 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1j8mvit/utm_parameters_dissapear/) | 2025-03-11 | complaint | Cross-domain ticket purchase: URL parameters do not stick, so revenue counts as direct. | P3 |
| U108 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j87xvd/utm_parameters_not_showing_in_analytics/) | 2025-03-10 | confusion | Running Reddit ads with UTMs but "reddit" never appears as a source. | P1 |
| U109 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1j5ur90/question_on_utm_setup/) | 2025-03-07 | confusion | Different employers name utm_campaign differently; muddled when promoting assets across campaigns. | P2 |
| U110 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j5mq85/utm_campaign_content_medium_tracked_in_ga4/) | 2025-03-07 | confusion | Included utm_content in links but cannot see campaign content in GA4. | P19 |
| U111 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j2mikm/utm_data_not_showing_in_ga4/) | 2025-03-03 | complaint | Demand Gen video UTMs only populate GA4 when optimised targeting is on. | P11 |
| U112 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1j0yfa2/utm_tracking/) | 2025-03-01 | confusion | Added ad_id at campaign level; GA only shows campaign. Must tracking be set at ad level too? | P19 |
| U113 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1iv3dud/help_with_utm_parameters_for_shopify_store/) | 2025-02-21 | complaint | All Google sales in Shopify show sag_organic / product_sync. | P10 |
| U114 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1iu62sq/is_meta_a_valid_utm_source/) | 2025-02-20 | confusion | Is "meta" a valid utm_source, or should Facebook and Instagram be separate for channel grouping? | P2, P20 |
| U115 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1itxtg2/how_can_i_track_a_visitor_journey_coming_from/) | 2025-02-20 | confusion | Same landing page for email and SEO: how to tell which channel a won lead came from? | P1 |
| U116 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1iro3k0/how_can_i_track_the_exact_google_ads_search_query/) | 2025-02-17 | feature-request | Wants the exact Google Ads search query as a UTM; {keyword} only gives the matched keyword. | F12 |
| U117 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1irk6vl/utm_link_parameters/) | 2025-02-17 | confusion | Is a link with only utm_source still recognised by GA4? | P1 |
| U118 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1irfm48/issues_with_utm_tracking_meta_ads_and_google/) | 2025-02-17 | complaint | Set up GA to see Meta ad traffic but UTM tracking does not work as expected. | P1, P5 |
| U119 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1igqf26/utm_tracking_codes_not_populating/) | 2025-02-03 | complaint | Using the GA campaign URL builder for BizDev PDF campaigns; tags not populating. | P1 |
| U120 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1ibf2tu/google_ads_hubspot_utm_parameters_implementation/) | 2025-01-27 | confusion | How to set up UTMs so Google Ads performance shows in HubSpot. | P3 |
| U121 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ib1yaa/meta_instant_form_utm/) | 2025-01-27 | confusion | Meta instant form "Contact us" link: which UTMs apply? | P11 |
| U122 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1i849gw/is_it_possible_to_automate_utm_creation_for/) | 2025-01-23 | feature-request | Agency: manual UTMs for every ad across many clients "takes a ton of time"; can creation be automated? | P6, F12, F2 |
| U123 | Reddit r/Emailmarketing | [link](https://www.reddit.com/r/Emailmarketing/comments/1i3gfv8/lemlist_custom_variables_in_url_query_string_utm/) | 2025-01-17 | confusion | Do lemlist custom variables work inside UTM query strings for per-recipient tracking? | F8 |
| U124 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1i2pkw3/utm_tracking_meta_ads_with_dynamic_utm_parameters/) | 2025-01-16 | complaint | Meta dynamic UTMs work 9/10 times; the rest show medium=paid and only a campaign id. | P5 |
| U125 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1i2c1dr/do_google_ad_clicks_not_have_utm_source_utm/) | 2025-01-16 | confusion | Only Facebook ads show UTMs; do Google Ads clicks not get them automatically? | P9 |
| U126 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1i01psq/utm_codes/) | 2025-01-13 | confusion | "Very confused by the whole concept": do I need to connect anything for UTM data to appear in GA4? | P1 |
| U127 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1hx3sru/dv360_utm_traffic_misattributed_to_sourcemedium/) | 2025-01-09 | complaint | DV360 traffic tagged utm_source=dv360 shows as google / cpc in GA4 since Oct 2024. | P20 |
| U128 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1hw0oly/where_to_find_utm_tags_in_dashboard/) | 2025-01-07 | confusion | GA noob: cannot see UTM link clicks, only lots of direct traffic. | P1, P4 |
| U129 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1houqfn/fbmeta_ads_best_approach_for_utm_configuration_in/) | 2024-12-29 | confusion | Meta: use Destination URL or Tracking section? Dynamic or static parameters? Best template? | P5 |
| U130 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1hitr4o/need_help_with_adding_utms_in_shopping_campaigns/) | 2024-12-20 | complaint | Cannot add UTMs to shopping campaigns; tracking template test throws an error. | P11 |
| U131 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1haxwmv/check_if_utm_parameters_lost/) | 2024-12-10 | feature-request | How to check that a purchase event still has its UTM source and nothing was lost along the way? | F7, P3 |
| U132 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1hakidx/does_updating_utm_tags_reset_engagement/) | 2024-12-09 | confusion | Changing UTMs on thousands of ads: will engagement (likes, comments) reset? | P13 |
| U133 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1h7c4ko/utm_term_okay_to_use_for_paid_audience_names/) | 2024-12-05 | confusion | Is it OK to use utm_term for paid social audience names? | P2 |
| U134 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1h6xvha/how_do_you_add_utm_links_to_chatgpt_responses/) | 2024-12-05 | confusion | How did a brand get utm_source=chatgpt.com into ChatGPT's answer links? | P1 |
| U135 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1h4e5f6/adding_utm_parameters_to_exiting_ad_url/) | 2024-12-01 | confusion | Will adding UTMs to an existing ad URL restart the learning phase? "Some say yes, some say no." | P13 |
| U136 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1h1b21g/appending_utm_parameters_and_ads_already_having/) | 2024-11-27 | confusion | Taking over an account with UTMs pasted into URLs; will cleaning them up send ads back to learning? | P13 |
| U137 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1h123up/utm_parameters_and_contributions/) | 2024-11-27 | confusion | WooCommerce reads UTMs last-click; should attribution be judged in Woo, GA or per channel? | P7 |
| U138 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1h0bum1/source_medium_and_campaign_head_scratcher_they/) | 2024-11-26 | complaint | GA4 source/medium and campaign values do not match the UTM tags that were set. | P20, P2 |
| U139 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1gwnilv/utm_and_ga4/) | 2024-11-21 | complaint | Paid ads always land under Organic Social in GA4 despite UTMs. | P4 |
| U140 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gvllpz/tiktok_dynamic_utm_parameters_not_working/) | 2024-11-20 | complaint | TikTok dynamic parameters (__CAMPAIGN_NAME__ etc.) do not seem to work in GA4. | P5 |
| U141 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gvcxcf/campaign_level_utm_tracking_for_video_campaigns/) | 2024-11-20 | complaint | Video campaign-level tracking template set in Editor cannot be found in the Google Ads UI. | P11 |
| U142 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1gsopyf/utmtracking_links_posted_on_various_sources_how/) | 2024-11-16 | confusion | Bio links on Instagram, Reddit and LinkedIn: are UTMs the best way to compare traffic? | F6 |
| U143 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1grq6m1/how_to_make_utm_link/) | 2024-11-15 | confusion | How do I make a UTM link? Any tool for it? | P1 |
| U144 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1grc04j/setting_proper_utms_on_boosted_posts/) | 2024-11-14 | complaint | Boosted Facebook/Instagram posts show as "(not set)"; there is no option to add UTMs. | P11, P4 |
| U145 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gk2m6y/x_ads_traffic_double_counting_in_ga4_bots/) | 2024-11-05 | complaint | X Ads: 2,000 clicks in-platform but 5,000+ sessions in GA4. | P7 |
| U146 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1gepo7t/solution_for_demand_gen_lack_of_utm_data/) | 2024-10-29 | complaint | Demand Gen campaigns give no UTM data: "It's been rough running blind". | P11 |
| U147 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ge8or7/why_cant_i_see_the_utm_campaign_for_google_ads_in/) | 2024-10-28 | complaint | Google Ads campaigns appear bundled in GA4, not the exact UTM'd ad links; keyword attribution is a pain. | P9 |
| U148 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gbpy0q/utm_tags_accuracy/) | 2024-10-25 | complaint | Newsletter sponsor reports 600 clicks; own UTM data shows far fewer. | P7 |
| U149 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gb6eie/utm_link_issue_and_help/) | 2024-10-24 | confusion | Used a UTM link in a newsletter ad; cannot find where that traffic shows in GA. | P1 |
| U150 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gb181d/please_help_my_utm_tag_is_adding_random/) | 2024-10-24 | complaint | "aaa_utm_source=" gets prepended to each parameter, so traffic lands as direct. | P16 |
| U151 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1gazs0u/x_ads_utm_updation/) | 2024-10-24 | confusion | How to add UTM/URL parameters in X ads? | P5 |
| U152 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1g8tcfe/googles_auto_tag_utm_campaign_is_showing_up_in/) | 2024-10-21 | complaint | Auto-tag campaign name shows in Analytics alongside the utm_campaign set in tracking templates. | P9 |
| U153 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1g7gmza/trying_to_use_utm_but_no_data_showing_up/) | 2024-10-19 | confusion | GoFundMe campaign UTM set up; three hours later still no data; wonders if it just needs time. | P1 |
| U154 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1g1v7hm/is_anyone_else_facing_utm_parameters_not_getting/) | 2024-10-12 | complaint | UTM parameters not captured correctly in GA4; how to keep campaigns consistent across platforms? | P2 |
| U155 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1g0i6mb/ga4_not_recognizing_manual_utm_medium_from_google/) | 2024-10-10 | complaint | Turned auto-tagging off for display accounts; GA4 still ignores the manual utm_medium. | P9 |
| U156 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1fykn9o/utm_codes_huge_discrepancy_between_ga4_and_meta/) | 2024-10-07 | complaint | Meta says 7 ROAS and $100k; GA4 says $5k, even though every ad has a UTM code. | P7 |
| U157 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ftrh7f/issue_with_utm_source_and_google_ads/) | 2024-10-01 | complaint | UTM source works on the landing page but is lost on the registration page on a subdomain. | P3 |
| U158 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1fsxkp8/is_this_google_link_correct_to_pass_utm_variables/) | 2024-09-30 | complaint | Dynamic values in a Google Ads template are not passed to the CRM or landing page. | P5 |
| U159 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1frb1cd/how_detailed_do_you_get_with_your_utm_parameters/) | 2024-09-28 | confusion | How granular should UTMs be for ads? Custom naming or just the basics? | P2 |
| U160 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1fpm536/how_can_i_better_distinguish_between_organic_gmb/) | 2024-09-26 | complaint | Same utm_campaign used on GMB and Ads location extensions, so organic and paid cannot be separated. | P2 |
| U161 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1fp4fle/do_parameters_like_utm_campaign_in_google_ads/) | 2024-09-25 | confusion | Will adding utm_campaign to the Google Ads tracking template change GA4 data? | P9 |
| U162 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1fogkup/what_are_the_dynamic_utm_to_pull_automatically/) | 2024-09-24 | feature-request | Needs Google Ads equivalents of Meta's {{ad.name}}; "googling this for 30 minutes". | F12 |
| U163 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1fm5mgn/add_utm_to_existing_ad/) | 2024-09-21 | confusion | Adding UTMs to a performing ad: will it restart? "Some says yes, some says no." | P13 |
| U164 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1flborw/does_reddit_allow_sharing_links_with_utm_tags/) | 2024-09-20 | complaint | Reddit blocked a DM containing a link with UTM parameters. | P16 |
| U165 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1fj6kdv/utm_tracking_w_dynamic_creatives/) | 2024-09-17 | feature-request | Dynamic creatives: wants the winning image's name passed as a UTM value. | F12 |
| U166 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1fi94rf/installing_utm_links/) | 2024-09-16 | confusion | Asked to "install GA4 UTM links" on Google Ads campaigns; how? | P1 |
| U167 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1fhgm7y/utm_parameters_falling_off/) | 2024-09-15 | complaint | Since 12 Sept, almost 50% of Meta link clicks arrive with no UTM parameters. | P4, P7 |
| U168 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1fdekkv/utm_tracking_source/) | 2024-09-10 | complaint | Offline referral UTM link shows tagassistant.google.com as the source. | P1 |
| U169 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1f6pk52/list_of_all_standard_google_utm_parameters_for/) | 2024-09-01 | feature-request | Is there a list of all standard Google Ads UTM/ValueTrack parameters? | F12 |
| U170 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1f431d3/meta_site_links_on_ads_where_to_add_utm_parameters/) | 2024-08-29 | confusion | Do Meta ad-level URL parameters apply to site link URLs too? | P5 |
| U171 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1f3qbzm/help_with_utm_fields/) | 2024-08-29 | complaint | Typeform hidden UTM fields reach the database as literal 'xxxxx' on a new form. | P3 |
| U172 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1f3ag6j/quick_question_what_would_be_a_typical_use_case/) | 2024-08-28 | confusion | Is there any benefit to UTMs on Google Ads if GA4 is linked? | P9 |
| U173 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1f1xlo6/is_there_something_wrong_with_my_meta_utm_setup/) | 2024-08-26 | complaint | Meta UTM template (campaign.name, adset.name, ad.name) returns nothing in GA4. | P5 |
| U174 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1ez7iam/meta_doesnt_take_utm_parameters_in_the_url_itself/) | 2024-08-23 | complaint | Meta now errors when a client's final URL already includes UTM parameters. | P5 |
| U175 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ey6910/sa360_how_can_i_report_on_a_the_utm_content/) | 2024-08-22 | confusion | SA360: how to report conversions by utm_content? | P19 |
| U176 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1exraek/url_with_utm_parameters_ranks_over_the_naked_url/) | 2024-08-21 | complaint | Viral page with UTMs now ranks instead of the naked URL; GA4 misattributes the traffic to Reddit. | P12 |
| U177 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1ew8vp0/how_do_you_determine_utm_parameters_for_offline/) | 2024-08-19 | feature-request | QR codes on signage, murals and print at two locations: best practice for offline UTMs? | F19, F15 |
| U178 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1ete2qp/utm_parameters_in_product_catalog_carousel_ads/) | 2024-08-16 | complaint | UTMs cannot be added per product in catalogue carousel ads: "It absolutely destroys my tracking". | P11 |
| U179 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1esdtzj/if_you_put_a_utm_parameter_in_a_direct_email_but/) | 2024-08-14 | confusion | UTM link in an email that goes to Linktree: will GA4 still track it? | P3 |
| U180 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1errd0k/2_questions_how_to_validate_google_ads_conversion/) | 2024-08-14 | complaint | How to pass UTM parameters through a lead form email so sales can validate Google Ads leads? | P3 |
| U181 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1elt20q/custom_utm_parameters/) | 2024-08-06 | feature-request | Can custom parameters like utm_mytag=custom be used beyond the five standard ones? | F8 |
| U182 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1egxst6/shopify_utm_attribution_problem/) | 2024-07-31 | complaint | Shopify says some orders are from an unknown source yet resolves the UTM source as google. | P10 |
| U183 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1egnryz/looking_for_a_tool_that_creates_and_tracks_utms/) | 2024-07-31 | feature-request | Big team may need tens of thousands of UTMs; wants a tool with a central inventory. | F3, F4 |
| U184 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1egm1cq/utm_data_looks_weird/) | 2024-07-31 | complaint | Leads sheet shows numbers and %7Badname%7D instead of real values. | P5, P16 |
| U185 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1e9olyc/tracking_utm_performance/) | 2024-07-22 | complaint | Shopify UTM data and ad platforms disagree (about 50%). | P7 |
| U186 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1e71n1p/utm_mapping/) | 2024-07-19 | feature-request | Wants to map a campaign id UTM to the campaign name. | F8 |
| U187 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1e54l5k/utm_parameter_for_text/) | 2024-07-17 | feature-request | A/B testing Meta headlines; wants a parameter showing which copy converted in Shopify. | F12 |
| U188 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1e0j24j/need_help_with_using_dynamic_utm_parameters_in/) | 2024-07-11 | complaint | Meta dynamic UTMs show the parameter placeholders themselves in GA4 source/medium. | P5 |
| U189 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1dy8fj5/utm_tags_not_applied_when_using_instant/) | 2024-07-08 | complaint | Instant experience ads: Meta reports landing page views but nothing under the UTM in GA4. | P11 |
| U190 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1dxz73m/how_to_track_fb_ads_with_utmengagement_ads/) | 2024-07-08 | complaint | Engagement ads go straight to WhatsApp: can build UTMs in Meta but cannot track them. | P8 |
| U191 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1dvzbgx/utm_best_practices_do_you_use_any_automation/) | 2024-07-05 | workaround, feature-request | Manually creates UTMs per ad platform; any hacks or automation to cut manual work? | P6, F12 |
| U192 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/1dvrrcw/utms_getting_stripped_from_url_by_redirects/) | 2024-07-05 | complaint | Site redirect strips an affiliate's tracking parameters before they hit the site. | P3 |
| U193 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1dlv8l1/how_do_you_use_utm_medium/) | 2024-06-22 | confusion | Should utm_medium distinguish Instagram bio, post, stories, reels and carousel? | P2 |
| U194 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1de1vxb/utm_tracking_for_lead_generation_google_ads/) | 2024-06-12 | complaint | New form tool captures UTMs and gclid but the conversion happens on another page. | P3 |
| U195 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ddfa53/how_do_you_guys_set_your_utm_parameters_between/) | 2024-06-11 | confusion | Naming convention that fits both Meta and Google Ads parameters at once? | P2, P5 |
| U196 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/1dbec5x/utm_tracking_advice/) | 2024-06-08 | workaround | Adds a custom ?utm_knock=g to 30 ads by hand; looking for an account-level way. | P6 |
| U197 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1da1vf8/catalog_utm_tracking_in_ga4/) | 2024-06-07 | complaint | Catalogue feed allows only one utm_campaign, so retargeting and prospecting cannot both be tracked. | P11 |
| U198 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1d7urcu/utm_for_fb_catalogue_ads/) | 2024-06-04 | feature-request | How to use UTMs on dynamic catalogue carousel ads at ad and product level? | P11 |
| U199 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1d3ftcw/pmax_utm_tagging_on_the_asset_group_level/) | 2024-05-29 | confusion | PMax: UTM tagging at asset group level possible? | P11 |
| U200 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1d3crt1/server_gtm_and_utm_campaignsourcemedium_not/) | 2024-05-29 | complaint | Server-side GTM: GA4 picks up no source/medium/campaign despite correct query strings. | P3 |
| U201 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/1cu09du/how_do_i_capture_gclid_and_utm_parameter_info/) | 2024-05-17 | workaround, feature-request | Wants to keep GCLID and UTMs in cookies and pass them to Contact Form 7 emails. | F13 |
| U202 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1csvr1t/utm_tracking_in_google_ads_coming_into_my_crm_as/) | 2024-05-15 | complaint | CRM receives "Campaign Name: {Campaignname}" literally from the Google Ads template. | P5 |
| U203 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1csktpf/the_state_and_future_of_utm_parameters/) | 2024-05-15 | confusion | Will 2025 cookie changes affect UTMs? | P1 |
| U204 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1cd1c7r/adding_gclid_to_the_end_of_a_utm_parameter_in/) | 2024-04-25 | complaint | Tracking lost when the CTA sends traffic to a marketplace; wants gclid inside a UTM. | P3 |
| U205 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1cbye6z/why_my_url_parameters_sometimes_shows_utm_and/) | 2024-04-24 | confusion | Same ad sometimes shows UTMs and other times only fbclid in form submissions. | P5 |
| U206 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1cbthff/utm_link_issue_razorpay/) | 2024-04-24 | complaint | UTM links to a Razorpay payment page do not track conversions. | P3 |
| U207 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1c9k2ax/no_utm_info_when_users_click_on_instagram_profile/) | 2024-04-21 | complaint | Most users go ad, Instagram profile, bio link, so the ad's UTM is lost. | P11 |
| U208 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1c3qozl/question_about_whatsapp_api_for_utm_tracking/) | 2024-04-14 | feature-request | How do CRMs track WhatsApp numbers/UTMs via WhatsApp Web QR authentication? | P8, F14 |
| U209 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1bxw0yf/for_those_using_utm_do_you_have_the_problem_of/) | 2024-04-07 | complaint | For those using UTMs: is inaccurate data a common problem? | P7 |
| U210 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/1bx5l71/what_would_be_the_reasons_for_not_using_utm/) | 2024-04-06 | confusion | Reasons not to use UTMs include the "long, ugly and awkward tail" on links. | F6 |
| U211 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/1bvoxl6/can_i_use_utm_parameters_however_i_want/) | 2024-04-04 | confusion | Campaign and content are not enough; can utm_term be repurposed for messaging? | F8 |
| U212 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1brim6v/ga4_query_string_sees_utm_params_differently_then/) | 2024-03-30 | complaint | GA4 'query string' reads Bing UTM parameters differently from the actual URL. | P16 |
| U213 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1bplsof/utm_tracking_google_ads/) | 2024-03-28 | confusion | UTMs "always overwhelmed me": account, campaign or ad level? | P9 |
| U214 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1bmsnd6/utm_facebook_ads_woocommerce_not_tracking_fb/) | 2024-03-24 | complaint | Meta ad spend spike shows as Facebook organic, not paid, in GA4 (WooCommerce). | P4 |
| U215 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1b94omq/why_are_there_two_fields_for_utm_parameters/) | 2024-03-07 | confusion | Why does Meta have two fields for UTM parameters? | P5 |
| U216 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1b77iy5/utm_not_reported_at_origin/) | 2024-03-05 | complaint | CRM UTM fields fill with "(Not reported at origin)" for months. | P3 |
| U217 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1b71knq/can_we_make_a_utm_for_facebook_app_install_ads/) | 2024-03-05 | complaint | UTMs on Facebook App Install ads give no usable data in GA4. | P11 |
| U218 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1b4ourr/need_some_help_with_utm_parameter_being_added/) | 2024-03-02 | complaint | UTM parameters get added even on organic visits to the landing page. | P16 |
| U219 | Reddit r/marketing | [link](https://www.reddit.com/r/marketing/comments/1b2fz3q/hows_your_team_deal_with_utm_marks/) | 2024-02-28 | feature-request | How do teams clean up messy, inconsistent UTM rules outside FB/Google campaigns? | F2 |
| U220 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1awvo3i/tracking_granular_utm_parameters/) | 2024-02-22 | feature-request | Large brand: best way to enforce proper UTMs on all campaigns so data stays clean? | F2, F7 |
| U221 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ardx16/contact_form_database_utm_tracking_inside/) | 2024-02-15 | feature-request | Wants a WordPress plugin that saves form entries with UTM data. | F13 |
| U222 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/19f7okb/custom_utm_how_can_i_register_custom_utm/) | 2024-01-25 | feature-request | Wants a custom parameter like segmen=... as a GA4 report dimension. | F8 |
| U223 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/19da0xp/utm_parameters_not_tracking_data_in_google_ads/) | 2024-01-22 | complaint | GA4 to BigQuery: collected_traffic_source took "a lot of trouble" to populate. | P1 |
| U224 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/19clnzg/confused_about_utm_parameters/) | 2024-01-22 | confusion | Do I need new UTMs for each new campaign to the same landing page? | P1 |
| U225 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/19a3gwp/utm_paramamter_from_ad_set_on_meta_is_not_being/) | 2024-01-18 | complaint | Meta ad-set UTMs not found anywhere in GA4, so traffic is not Paid Social. | P4, P5 |
| U226 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/193xxp1/google_ads_utm_parameters_problem/) | 2024-01-11 | complaint | Malformed Google Ads campaign template (?url={lpurl}?utm_...) breaks lead attribution. | P16 |
| U227 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/192plc1/missing_utm_parameters/) | 2024-01-09 | complaint | LeadPages to Typeform to Zapier to Sheet: UTM columns blank a few times a day. | P3 |
| U228 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/18ws1w3/products_inside_merchant_centre_have_preset_utm/) | 2024-01-02 | complaint | Merchant Center products carry pre-set sag_organic UTMs that leak into ads. | P10 |
| U229 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/18nljwt/utm_tracking_is_too_confusing/) | 2023-12-21 | complaint | "UTM tracking is too confusing": inherited template mixing utm_ and hsa_ parameters. | P16 |
| U230 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/18iaywz/utm_and_autotagging_hybrid/) | 2023-12-14 | complaint | UA let UTMs override GCLID; cannot find the same checkbox in GA4. | P9 |
| U231 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/18hajc3/ad_content_utm_not_showing_in_ga4/) | 2023-12-13 | complaint | Ad content UTM has disappeared from GA4, so ads cannot be compared. | P19 |
| U232 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/18gxion/pmax_utm_tracking_question/) | 2023-12-12 | confusion | What creates conversions tagged sag_organic / product_sync? Is it PMax? | P10 |
| U233 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/17snij5/utm_coode_from_facebook_ads_not_following_through/) | 2023-11-11 | complaint | Healthcare, no Meta pixel: UTMs from Facebook never reach custom conversion events. | P3 |
| U234 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/17s6oft/meta_utm_parameters/) | 2023-11-10 | confusion | Link already has UTMs and Meta adds dynamic ones: duplication or override? | P16 |
| U235 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/17pds9n/ga4_not_tracking_utm_codes/) | 2023-11-06 | complaint | GA4 not tracking UTM codes even with the GA4 option enabled. | P1 |
| U236 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/17isczu/ga4_utm_and_crossdomain_purchases/) | 2023-10-29 | complaint | Cross-domain checkout: GA4 loses the link from UTM campaign to purchase. | P3 |
| U237 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/17a4e6c/our_utm_was_stripped_and_were_seeing_1_second/) | 2023-10-17 | complaint | UTM was stripped, and sessions show one-second engagement. | P3 |
| U238 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/179kvct/pmax_campaign_utm_parameters_for_tracking/) | 2023-10-17 | workaround | Wrote a Google Ads script to push PMax campaign names into the tracking template. | P11 |
| U239 | Reddit r/shopify | [link](https://www.reddit.com/r/shopify/comments/177kjf5/why_does_my_shopifys_utm_tracking_say_campaign/) | 2023-10-14 | complaint | Shopify shows Google shopping / CPC though no paid ads are running. | P10 |
| U240 | Reddit r/bigseo | [link](https://www.reddit.com/r/bigseo/comments/170a0ob/has_anyone_been_able_to_parse_out_utm_attributes/) | 2023-10-05 | confusion | Can UTM attributes be broken out in a Looker Studio table? | P1 |
| U241 | Reddit r/digital_marketing | [link](https://www.reddit.com/r/digital_marketing/comments/16y59z9/ga4_question_is_there_a_way_to_see_session_data/) | 2023-10-02 | feature-request | In UA you could paste a full UTM URL and see its sessions; wants the same in GA4 for stakeholders. | F7 |
| U242 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/16ulwp3/implement_utm_in_google_ads_while_maintaining_the/) | 2023-09-28 | confusion | Needs UTMs on Google Ads for the CRM without breaking GA logic. | P9 |
| U243 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/16ul1hx/how_to_add_utm_parameters_to_facebook_app_install/) | 2023-09-28 | complaint | No field to add UTMs to app install campaigns pointing to the stores. | P11 |
| U244 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/15ivpo2/utm_tracking_with_autotagging_enabled/) | 2023-08-05 | confusion | How will GA4 populate data with auto-tagging on and templates blank? | P9 |
| U245 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/157e41z/facebook_ads_dynamic_utm_parameters_will_they/) | 2023-07-23 | confusion | Meta dynamic parameters keep first-published names; will renamed values show in GA4? | P5 |
| U246 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/154a59h/utm_and_fbclid/) | 2023-07-19 | complaint | Meta URL parameters set, but clicked ad links show only ?fbclid=. | P5 |
| U247 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/14f6xun/got_5_sales_today_none_of_it_is_tracked_by/) | 2023-06-21 | complaint | Five sales today, none tracked by Facebook; UTMs and CAPI show data. | P7 |
| U248 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/147mun6/one_campaign_not_sending_utm_parameters/) | 2023-06-12 | complaint | One of two campaigns sends no UTM data to GA4 despite configuration. | P5 |
| U249 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/145c5ys/utm_parameters_are_missing_only_see_fbclid_in_ga4/) | 2023-06-09 | complaint | UTMs missing; GA4 only shows FBCLID. | P5 |
| U250 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/144u9vl/utm_tracking_issue/) | 2023-06-09 | complaint | Cannot see UTM URLs in GA4 Traffic Acquisition. | P1 |
| U251 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/13dejwb/why_does_the_traffic_tracking_of_facebook_ads/) | 2023-05-10 | complaint | Facebook traffic appears as utm_medium=paid though it was not set that way. | P20 |
| U252 | Reddit r/bigseo | [link](https://www.reddit.com/r/bigseo/comments/13cjqxs/utm_source_urls_indexed_by_google/) | 2023-05-09 | complaint | robots.txt allowed /*utm_source URLs; Google crawled a huge number. | P12 |
| U253 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/12qnxqk/facebook_ads_utm_problem_with_google_analytics/) | 2023-04-18 | complaint | Apostrophe in a campaign name; GA4 shows 4 sessions against far more in Meta. | P16 |
| U254 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/12kumd9/one_of_my_top_performing_links_in_gsc_is_a_utm_i/) | 2023-04-13 | complaint | Top GSC link is a UTM URL (rss) the poster never created. | P12 |
| U255 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/11mqly6/do_utm_tags_like_campaign_name_will_stay_from_the/) | 2023-03-09 | confusion | Duplicating a Meta ad: which campaign name do dynamic UTMs keep? | P5 |
| U256 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/11lcgxk/google_utm_not_working_with_shopify/) | 2023-03-07 | complaint | After changing the Meta pixel, campaign names stopped showing on Shopify conversions. | P10 |
| U257 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/10fa27v/do_utms_have_any_purpose_on_straight_to_instagram/) | 2023-01-18 | confusion | Do UTMs have any purpose on straight-to-Instagram-DM ads? | P8 |
| U258 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/10e29mm/using_both_ref_and_utm_source_in_external_link/) | 2023-01-17 | complaint | Switched from utm_source to ref because some analytics tools ignore utm_source. | F8 |
| U259 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/zx53cr/do_i_need_utm_parameter_link_to_be_map_in_google/) | 2022-12-28 | confusion | Generated a UTM link but does not know where to paste it or how to map it in GA. | P1 |
| U260 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/z2oef7/ga4_facebook_ads_utm_how_to_push_into_paid_social/) | 2022-11-23 | confusion | Which UTM values make Facebook ads land in GA4's Paid Social channel? | P20 |
| U261 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/ypnzm8/is_it_possible_to_set_a_different_utm_link_for/) | 2022-11-08 | feature-request | Wants a different UTM per creative/ad size in the same ad group. | F4 |
| U262 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/xvdjt2/what_dimension_is_utm_id_in_ga4/) | 2022-10-04 | confusion | What GA4 dimension shows utm_id? | P1 |
| U263 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/xpbkdp/fb_ad_utm_tracking_campaign_id_does_not_exist/) | 2022-09-27 | complaint | Facebook utm_campaign returns a campaign name and id that do not exist. | P5 |
| U264 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/xibb1w/when_doing_a_redirect_ab_test_in_google_optimize/) | 2022-09-19 | complaint | Do UTMs pass through a Google Optimize redirect test? They must stay intact. | P3 |
| U265 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/xfrdav/utm_links/) | 2022-09-16 | confusion | Will a UTM still work inside a Bitly short link? | F6 |
| U266 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/x2f570/analytics_assign_conversions_from_social/) | 2022-08-31 | complaint | UTMs must persist from marketing site to app domain to fill CRM fields. | P3 |
| U267 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/whbus9/email_utm_tracking/) | 2022-08-06 | complaint | Social ad conversions attributed to "direct" in Analytics. | P4 |
| U268 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/we5hcy/utm_content_term_facebook_ua_is_tracked_as/) | 2022-08-02 | feature-request | Wants a merge field like [[email]] in UTMs to identify who clicked. | F8 |
| U269 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/vt11uw/google_utm_query_string_delimiter_beginning_with/) | 2022-07-06 | complaint | Why does the UTM query start with "#" instead of "?" | P16 |
| U270 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/vkhnkv/help_fb_utm_is_not_shown_on_google_analytics/) | 2022-06-25 | complaint | Facebook UTMs built with a builder always show direct / none. | P4 |
| U271 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/v37sje/google_analytics_question_in_our_campaigne_data/) | 2022-06-02 | confusion | Unknown campaign names in GA; which destination URL carried these old UTMs? | P14 |
| U272 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/us8dk3/seeing_the_utm_parameters_of_my_session/) | 2022-05-18 | feature-request | Is there a Chrome plugin that shows the UTM source/medium attributed to my current session? | F7 |
| U273 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/undj3q/utm_parameters_on_instant_experience_ads/) | 2022-05-11 | confusion | Do ad-level UTMs apply inside an instant experience? | P11 |
| U274 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/tlw6uu/utm_codes/) | 2022-03-24 | complaint | FB ads seem to generate revenue but UTMs show none in GA. | P1 |
| U275 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/tawdb7/ad_group_vs_campaign_utm_parameter/) | 2022-03-10 | confusion | With auto-tagging on, do I still need utm_id={campaignid} and similar? | P9 |
| U276 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/szfchr/utm_source_addition_to_url_gets_indexed_how_to/) | 2022-02-23 | confusion | Which wins if campaign- and ad-group-level UTMs differ? | P9 |
| U277 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/sq4r29/google_ads_not_linked_with_google_analytics/) | 2022-02-11 | complaint | Only the ?utm_source=rss version of new articles gets indexed. | P12 |
| U278 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/so9l4t/can_you_still_run_successful_campaigns_without/) | 2022-02-09 | complaint | Client's GA shows no conversions from our UTM-tagged campaign. | P1 |
| U279 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/s6p1c2/utm_help_facebook/) | 2022-01-18 | complaint | Cannot add UTMs to regular Facebook posts, only paid campaigns. | P11 |
| U280 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/rm4dwr/google_analytics_not_recognising_utm_content/) | 2021-12-22 | complaint | utm_content often shows "not set" while source, medium and campaign are fine. | P19 |
| U281 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/qc6kyu/how_do_you_keep_track_ofmanage_your_utm_tags/) | 2021-10-20 | workaround, feature-request | Self-built Google spreadsheet for UTMs is "a bit clumsy"; wants a better template or tool. | F3 |
| U282 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/q7wlo2/analytics_utm_nooverride1_parameter_still_working/) | 2021-10-14 | confusion | Is utm_nooverride=1 still a valid way to keep the original source after a payment provider? | P3 |
| U283 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/pwz6la/google_analytics_sale_from_facebook_ads_with_utm/) | 2021-09-28 | complaint | Shopify sale from a Facebook ad with UTMs shows as google / organic in GA. | P4 |
| U284 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/p82c9k/utm_parameters_are_not_getting_assigned_to/) | 2021-08-20 | complaint | Display ad users are not tracked with UTMs, unlike search ads. | P11 |
| U285 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/o6dr1f/do_mobile_apps_remove_utm_parameters_in_google/) | 2021-06-23 | complaint | Facebook and TikTok traffic shows as direct; are mobile apps stripping UTMs? | P3, P4 |
| U286 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/n1hzlw/utm_parameters_in_google_analytics_4/) | 2021-04-30 | complaint | GA4 shows term/content "in the most useless way possible". | P19 |
| U287 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/mu10fo/help_google_analytics_shows_campaign_name_instead/) | 2021-04-19 | complaint | GA shows the Google Ads campaign name instead of the UTM campaign tag. | P9 |
| U288 | Reddit r/SEO | [link](https://www.reddit.com/r/SEO/comments/m1ukfb/google_indexing_posts_twice_one_with_utm_sourcerss/) | 2021-03-10 | complaint | Posts indexed twice, once with utm_source=rss. | P12 |
| U289 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/lyd90u/how_to_match_a_utm_term_tag_with_the_session/) | 2021-03-05 | confusion | Cannot match utm_term to session_start in a GA4 exploration. | P19 |
| U290 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/kiiiof/final_urls_utm_source_not_populating_correctly_in/) | 2020-12-23 | complaint | utm_source=youtube shows as google / cpc because of auto-tagging. | P9 |
| U291 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/jtbsqr/unable_to_track_traffic_links_getting_stripped_of/) | 2020-11-13 | complaint | Landing page redirect strips UTMs from links on every social profile. | P3 |
| U292 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/j61k9c/facebook_ads_and_utm_parameters_reports_show/) | 2020-10-06 | confusion | Old, unused Facebook UTM values keep appearing in reports. | P14 |
| U293 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/j2fq6n/how_to_get_utm_data_from_datalayer_to_ga_without/) | 2020-09-30 | complaint | Single-page site strips UTM tags by redirecting. | P3 |
| U294 | Reddit r/GoogleTagManager | [link](https://www.reddit.com/r/GoogleTagManager/comments/ixadtx/utm_parameters_in_event/) | 2020-09-21 | complaint, workaround | UTMs not attached to Gravity Forms events; uses hidden fields to write them. | P3 |
| U295 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/ho9xjb/utm_ppc_wind_up_in_other_not_paid_search_in_ga/) | 2020-07-09 | complaint | Half of UTM-tagged PPC clicks land in "Other", not Paid Search. | P20 |
| U296 | Reddit r/googleads | [link](https://www.reddit.com/r/googleads/comments/hf2i10/facebook_ads_not_tracked_in_google_analytics_via/) | 2020-06-24 | complaint | Facebook ads with UTMs absent as a source/medium despite spend. | P1 |
| U297 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/h0vync/ga_is_there_a_way_to_ignore_attribution_from_a/) | 2020-06-11 | complaint | A 'forgot password' email steals last-click attribution from the original channel. | P3 |
| U298 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/fvmrc6/tracking_utm_parameters_between_two_domains/) | 2020-04-05 | complaint | How to keep UTMs from main site to a separate Shopify domain? | P3 |
| U299 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/f6iz92/dynamic_landing_page_content_based_on_utm/) | 2020-02-19 | complaint | fbclid breaks dynamic landing content driven by a custom utm_county parameter. | P16 |
| U300 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/f5u3qv/need_some_advice_on_persisting_ga_utm_parameters/) | 2020-02-18 | workaround | A script cookies UTMs and appends them to later links; breaks with new features. | F13 |
| U301 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/est6wp/hi_campaign_change_will_lead_to_a_new_session/) | 2020-01-23 | complaint | Landing page removes query params (UTMs) and reloads. | P3 |
| U302 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/dw9sa9/anyone_have_a_sharable_utm_builder_sheet_help/) | 2019-11-14 | workaround, feature-request | New to UTMs: asks for a shareable UTM builder spreadsheet. | F3 |
| U303 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/dfzbp3/does_anyone_know_what_utm_scrub_is_associated_with/) | 2019-10-10 | complaint | Programmatic vendor traffic shows "?utm_scrub=" instead of UTMs. | P16 |
| U304 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/ay3ag9/ga_not_taking_in_the_utm_campaign_parameter_ideas/) | 2019-03-06 | complaint | utm_campaign after a "#/" hash route is not picked up by GA. | P16 |
| U305 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/an5vbo/how_to_combine_urls_with_added_utm_tags_to_view/) | 2019-02-04 | complaint | Same page appears as several URLs in reports due to UTMs. | P12 |
| U306 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/a5x63y/utm_tracking_what_am_i_doing_wrong_here_what/) | 2018-12-13 | complaint | Struggling to capture UTMs on site and pass them into Salesforce. | P3 |
| U307 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/9dmslv/started_using_utms/) | 2018-09-06 | feature-request | Non-profit: random tags make campaigns hard to track; wants a tool. | F3, P14 |
| U308 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/846owd/i_made_an_error_with_a_utm_tag_can_i_still_get/) | 2018-03-13 | complaint | Typed "#" instead of "?" in a UTM link; is the data still accurate? | P16 |
| U309 | Reddit r/analytics | [link](https://www.reddit.com/r/analytics/comments/82ruu1/in_google_analytics_is_it_possible_to_update_utm/) | 2018-03-07 | feature-request | Can past utm_medium=display data be renamed to "banner" in GA? | P2 |
| U310 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1wblg74/unassigned_traffic/) | 2026-09-09 | complaint | Sudden spike in Unassigned traffic across multiple GA4 properties. | P4 |
| U311 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1wb55dn/agencies_running_clicktowhatsapp_campaigns_how_do/) | 2026-09-08 | confusion | Click-to-WhatsApp: how do agencies connect conversations to qualified leads and sales? | P8 |
| U312 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1wahzfg/how_are_you_tracking_whatsapp_conversions_from/) | 2026-09-08 | complaint | Tracking the WhatsApp button click in GTM gives junk conversions from people who never message. | P8 |
| U313 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1vp77bl/how_to_track_whatsapp_based_orders/) | 2026-08-15 | confusion | Visitor from a campaign clicks the WhatsApp icon; how to know the message came from that campaign? | P8 |
| U314 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1veqdda/800_link_clicks_to_whatsapp_zero_messages_am_i/) | 2026-08-03 | complaint | 800 link clicks to WhatsApp, zero messages. | P8 |
| U315 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1uj3vl6/big_amount_of_not_set_unassigned_traffic_source/) | 2026-06-29 | complaint | High share of (not set) source/medium and Unassigned; wants to reassign it. | P4 |
| U316 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1u5qwle/whats_going_on_with_my_leads_whatsapp_campaign/) | 2026-06-14 | complaint | 32 link clicks to WhatsApp, 0 conversations started. | P8 |
| U317 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1u306jg/not_set_problem/) | 2026-06-11 | complaint | Large (not set) in landing page report across sites. | P4 |
| U318 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ts3r5f/finally_got_a_clients_ga4_unassigned_traffic_down/) | 2026-05-30 | workaround | Agency fixed a client's GA4 Unassigned down to 0.68% after auditing causes. | P4 |
| U319 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1tkb1zw/how_to_let_meta_track_whatsapp_purchases_and/) | 2026-05-22 | confusion | How can Meta track purchases made in WhatsApp after a messaging campaign? | P8 |
| U320 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1tjcd3f/should_i_kill_my_traffic_campaigns_context_heavy/) | 2026-05-21 | complaint | Sales happen in WhatsApp/DMs, so traffic campaigns cannot be judged. | P8 |
| U321 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1s95pmc/tracking_leads_via_whatsapp/) | 2026-04-01 | confusion | Ads to WhatsApp: how to tell Meta which leads were qualified or converted? | P8 |
| U322 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1s39sta/messaging_events_capi_whatsapp_ctwa_suddenly/) | 2026-03-25 | complaint | Click-to-WhatsApp messaging events suddenly stopped tracking. | P8 |
| U323 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1qzim5d/unassigned_revenue_in_acquisition_traffic_source/) | 2026-02-08 | complaint | Revenue under Unassigned in Traffic acquisition. | P4 |
| U324 | Reddit r/FacebookAds | [link](https://www.reddit.com/r/FacebookAds/comments/1qz6zb3/campaign_type_with_whatsapp_cod_funnel/) | 2026-02-08 | complaint | Ad to WhatsApp to cash on delivery: purchase tracking "essentially unavailable". | P8 |
| U325 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1pzr8d8/using_3rd_party_to_run_ads_their_traffic_shows_up/) | 2025-12-30 | complaint, workaround | Third-party ad agency traffic shows Unassigned/(not set); runs custom reports every time. | P4 |
| U326 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ppw7aq/new_to_ga4_not_set_appearing_in_top_landing_pages/) | 2025-12-18 | confusion | New to GA4: what does "(not set)" in top landing pages mean? | P4 |
| U327 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ppnaqh/seeing_a_huge_spike_in_unassigned_traffic_in_the/) | 2025-12-18 | complaint | Huge spike of Unassigned traffic, mostly from China. | P4 |
| U328 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1p8eha0/not_set_traffic_in_ga4_could_this_be_reddit/) | 2025-11-27 | complaint | Reddit says 200+ clicks; GA4 shows a fraction, much in (not set), Unassigned or Direct. | P4, P7 |
| U329 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1p0c10k/whatsapp_status_ads_help/) | 2025-11-18 | confusion | WhatsApp Status ads: how to track website conversions from those messages? | P8 |
| U330 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1onlb3t/how_much_not_set_traffic_do_you_find_acceptable/) | 2025-11-03 | confusion | How much "not set" traffic is acceptable: under 5%? under 1%? | P4 |
| U331 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ol0y4e/surge_in_sessions_with_not_set_source_medium_with/) | 2025-10-31 | complaint | 3.7k of 21k sessions suddenly "Not Set" source/medium with ~0% engagement. | P4 |
| U332 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ocgyki/unassigned_spike/) | 2025-10-21 | complaint | Specific days almost 99% Unassigned/(not set) with no changes made. | P4 |
| U333 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1nas4ab/not_set_traffic_attribution_issue/) | 2025-09-07 | complaint | After migrating to Node.js, 35-40% of landing page traffic is (not set). | P4 |
| U334 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1n7bejm/anyone_cracked_clicktowhatsapp_attribution_our/) | 2025-09-03 | complaint, workaround | Paid traffic into WhatsApp; GA4/Ads rows empty: "We've tried UTMs + sheets + zaps. Painful." | P8 |
| U335 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1n1dvh4/offline_tracking_for_whatsapp_leads_for_pmax/) | 2025-08-27 | confusion | Offline WhatsApp lead tracking for PMax in healthcare? | P8 |
| U336 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1mrsmv2/losing_my_mind_over_google_ads_whatsapp/) | 2025-08-16 | complaint | "Losing My Mind Over Google Ads + WhatsApp Conversion Tracking" for clinics. | P8 |
| U337 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1mqr99m/whats_your_setup_for_tracking_which_ads_are/) | 2025-08-15 | workaround, complaint | Click-to-WhatsApp: started with "manual UTM tagging + spreadsheets, which is tedious and annoying". | P8, P6 |
| U338 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1lqqw86/help_with_spikes_in_unassigned_traffic/) | 2025-07-03 | complaint | Every few months organic drops to 0 for a day and Unassigned skyrockets. | P4 |
| U339 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1lq95xc/landing_page_report_is_30_not_set/) | 2025-07-02 | complaint | 30% of landing page report is (not set) across nearly every source/medium. | P4 |
| U340 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1lefgsm/unassingednot_set_issue_there_has_been_a_sudden/) | 2025-06-18 | complaint | Unassigned ("not set" source) rising while Paid Social falls. | P4 |
| U341 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1k6326w/facebook_ads_whatsapp_call_leads/) | 2025-04-23 | confusion | Facebook lead ads to WhatsApp or calls: how does Facebook track conversions without a pixel? | P8 |
| U342 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1jlymfv/whatsapp_button_and_tracked_conversions/) | 2025-03-28 | complaint | WhatsApp conversions tracked differ from the asset report's message count. | P8 |
| U343 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1jd41zj/massive_amount_of_not_set_traffic_unsure_how_to/) | 2025-03-17 | complaint | Designer forced to moonlight in analytics; "massive amount of (not set) traffic". | P4 |
| U344 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j8tjpd/sustained_spike_in_unassigned_traffic/) | 2025-03-11 | complaint | Large sustained spike in Unassigned; help articles, AI and forums did not solve it. | P4 |
| U345 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j7ql1l/unassigned_and_direct_traffic_spiked_since/) | 2025-03-10 | complaint | Unassigned and direct spiked after switching to GTM; yesterday's data re-labelled Unassigned. | P4 |
| U346 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1j4sn1z/updated_the_server_side_gtm_client_cookie_to/) | 2025-03-06 | workaround | Changing the server GTM client cookie to JavaScript-managed cut Unassigned (but total traffic dropped). | P4 |
| U347 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1iwxrsj/ga4_traffic_acquisition_total_revenue_is_all/) | 2025-02-24 | complaint | 100% of revenue in Traffic acquisition is "Unassigned". | P4 |
| U348 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1indmbw/if_users_dont_accept_cookie_does_it_show_as/) | 2025-02-12 | confusion | Does declining cookies make sessions show as Unassigned / not set? | P21 |
| U349 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1i8wfga/how_to_track_whatsapp_conversions_not_clicks_in/) | 2025-01-24 | workaround | Tracks WhatsApp conversions (not clicks) by capturing GCLID and uploading offline conversions. | P8 |
| U350 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1i5hocm/unassigned/) | 2025-01-20 | complaint | Checked UTMs, hostnames and tags, waited 72h; Unassigned still unexplained. | P4 |
| U351 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1hxl7u7/14_of_revenue_is_attributed_to_not_set_on_traffic/) | 2025-01-09 | complaint | A quarter of revenue attributed to not_set in Traffic acquisition. | P4 |
| U352 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1hcl8it/receiving_unassigned_traffic_to_site_with_very/) | 2024-12-12 | complaint | 3,000+ Unassigned sessions with only 3 engaged sessions. | P4 |
| U353 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gwnk6a/direct_traffic_being_flagged_as_unassigned/) | 2024-11-21 | complaint | Direct traffic replaced by Unassigned / (not set). | P4 |
| U354 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1grt09j/unassigned_traffic_increse_on_13112024/) | 2024-11-15 | complaint | Unassigned spike on 13 Nov 2024 across six accounts. | P4 |
| U355 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gqg16j/juicyads_data_is_showing_up_as_not_set_in_ga4/) | 2024-11-13 | complaint | UTM-tagged links from an ad network categorised as "not set" in GA4. | P4 |
| U356 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gml3cs/why_not_set_shows_for_landing_pages_sometimes/) | 2024-11-08 | workaround | Found self-referrals and subdomain sessions cause (not set) landing pages. | P4 |
| U357 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gei0yi/unassigned_visits/) | 2024-10-29 | complaint | Unusual Unassigned sessions on most sites, 95-100% bounce, wrecking monthly reports. | P4 |
| U358 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1gbdok8/why_is_nearly_40_of_my_new_traffic_not_set/) | 2024-10-24 | complaint | Nearly 40% of new traffic lands on "(not set)". | P4 |
| U359 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1g8s9x2/unassigned_traffic_spike/) | 2024-10-21 | complaint | Unassigned jumped from 60-80 a day to 600 in one day. | P4 |
| U360 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1fybl08/enhanced_conversions_for_whatsapp_call_buttons/) | 2024-10-07 | confusion | How to set up enhanced conversions for "WhatsApp Us" and "Call Us" buttons? | P8 |
| U361 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1fvxw24/how_do_you_track_whatsapp_as_a_conversion_in/) | 2024-10-04 | complaint | WhatsApp button clicks tracked as conversions do not match actual enquiries. | P8 |
| U362 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1fvxi3n/do_clicks_from_whatsapp_get_tracked_as_direct_or/) | 2024-10-04 | confusion | Do clicks from WhatsApp get tracked as direct or referral (or organic social)? | P8 |
| U363 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1fp06kl/does_anyone_know_how_to_fix_the_not_set/) | 2024-09-25 | complaint | Almost all revenue "not set", breaking Google Ads conversion tracking. | P4 |
| U364 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1fnhr00/consent_mode_v2_unassigned_sessions/) | 2024-09-23 | complaint | Unassigned sessions increased after implementing Consent Mode v2. | P21 |
| U365 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1f9kl5p/unassigned_vs_direct_traffic/) | 2024-09-05 | confusion | Why do sessions with (not set) utm_source/medium count as Unassigned, not Direct? | P4 |
| U366 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1f2ggdn/paid_search_campaign_not_set/) | 2024-08-27 | complaint | Since 24 July, much Google Ads traffic gets no campaign, manual or auto-tagged. | P4, P9 |
| U367 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1eqn2kf/spike_in_unassigned_traffic_correlating_with_drop/) | 2024-08-12 | complaint | Unassigned spiked the day extra parameters were added to the GA4 tag. | P4 |
| U368 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ei1oel/unassigned_traffic_increasing_in_first_24hours/) | 2024-08-02 | complaint | Unassigned is high in the first 24h then redistributes after 48h. | P4 |
| U369 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1eg4tsv/ga4_issue_with_unassigned_traffic_for_returning/) | 2024-07-30 | complaint | Returning users' sessions marked Unassigned / (not set) from a specific date. | P4 |
| U370 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1efr8wj/getting_session_campaign_referral_and_not_set/) | 2024-07-30 | complaint | Google Ads sessions suddenly "(referral)" and "(not set)" campaign despite stable clicks. | P4, P9 |
| U371 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1ebfexb/whatsapp_tracking_any_clever_ideas/) | 2024-07-24 | workaround | High-value lead gen shifting to WhatsApp; click tag fires but many never message; seeks clever ideas. | P8 |
| U372 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1e5ple0/not_set_session_source_medium_revenue_increasing/) | 2024-07-17 | complaint | (not set) source/medium revenue increasing; custom channel groups stopped working. | P4 |
| U373 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1e4o7ns/organic_or_not_set_as_session_campaign_for_google/) | 2024-07-16 | complaint | google / cpc traffic gets (organic) or (not set) as session campaign. | P9 |
| U374 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1dz3cgs/session_source_medium_not_set_on_purhcase_event/) | 2024-07-09 | complaint | Purchase events Unassigned / (not set) after changing the GA plugin. | P4 |
| U375 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1dv9cpe/a_lot_of_unassigned_traffic_anyone_faces_same/) | 2024-07-04 | complaint | High Unassigned; suspects iPhone/iOS app users. | P4 |
| U376 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1dqekgr/unassigned_traffic_exploding_in_many_ga4/) | 2024-06-28 | complaint | Unassigned "exploded" since 27 June 2024 in many unrelated accounts. | P4 |
| U377 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1dijx7e/has_anyone_yet_nailed_offline_whatsapp_conversions/) | 2024-06-18 | complaint | 70% of sales come via WhatsApp chat; Google Ads conversion tracking "a painful point". | P8 |
| U378 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1c7k417/unassigned_traffic_increasing_on_ecommerce_site/) | 2024-04-19 | complaint | Unassigned jumped from 1-5% to over 50% of traffic on some days. | P4 |
| U379 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1c64awy/unassigned_traffic_and_conversions_in_ga4_after/) | 2024-04-17 | complaint | After adding a consent banner, Unassigned traffic rose by 2,707%. | P21 |
| U380 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1c5apz6/help_more_than_50_of_revenue_is_unassigned/) | 2024-04-16 | complaint | 50% of revenue Unassigned after implementing consent mode. | P21 |
| U381 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1b1de2o/utm_advice_for_whatsapp_individual_links/) | 2024-02-27 | feature-request | Wants a WhatsApp payment link with a unique UTM for each of five teams; asks for naming convention. | P8, F14 |
| U382 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/1ay5924/eliminating_the_dreaded_unassigned_category_in/) | 2024-02-23 | workaround | Removed "Unassigned" (38% of traffic) with custom channel groups. | P4 |
| U383 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/1aweebg/tracking_google_ads_conversions_through_whatsapp/) | 2024-02-21 | complaint | WhatsApp pop-up click only a secondary conversion; wants to track actual messages. | P8 |
| U384 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/19ffmrl/massive_uptick_in_not_set_traffic_in_ga4/) | 2024-01-25 | complaint | Major increase in (not set) traffic across multiple properties. | P4 |
| U385 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/18l7pfw/google_ads_anyone_done_any_work_on_linking_gclids/) | 2023-12-18 | feature-request | Needs to link GCLIDs to WhatsApp messages started from a landing page button for the CRM. | P8 |
| U386 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/17jssm2/unassigned_not_set_traffic_in_ga4_with_0/) | 2023-10-30 | complaint | Unassigned (not set) traffic with 0 engagement for months. | P4 |
| U387 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/17g8gcr/unassigned_data_in_ga4/) | 2023-10-25 | complaint | 40% of revenue and 43% of sessions Unassigned, all dimensions missing. | P4 |
| U388 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/179hz4a/google_adstags_opening_whatsapp_on_site_not/) | 2023-10-16 | complaint | Days spent trying to track WhatsApp icon clicks with GTM and Google Ads. | P8 |
| U389 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/16zpkdr/october_3rd_organic_to_unassigned_double_check/) | 2023-10-04 | complaint | Half of organic traffic turned Unassigned on 3 Oct. | P4 |
| U390 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/16ilulp/ga4_traffic_from_googlebingsocial_showing_up_as/) | 2023-09-14 | complaint | Google, Bing and social traffic showing as "Unassigned". | P4 |
| U391 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/161szzw/how_to_attribute_whatsapp_orders_to_google_ads/) | 2023-08-26 | complaint | 65% order via WhatsApp (cash on delivery); how to attribute to Google Ads? | P8 |
| U392 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/15m4y5h/unassigned_for_all_revenue/) | 2023-08-09 | complaint | All revenue attributed to "Unassigned". | P4 |
| U393 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/14xmvpc/unassigned_after_server_side_implementation/) | 2023-07-12 | complaint | 75% of sessions Unassigned after a server-side implementation. | P4 |
| U394 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/14hdave/ga4_direct_none_traffic_categorised_as_unassigned/) | 2023-06-23 | confusion | Why is (direct)/(none) traffic categorised as Unassigned? | P4 |
| U395 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/14duk64/ga4_unassigned_traffic_group_with_unassigned/) | 2023-06-19 | confusion | Unassigned with Unassigned source/medium; manual tags no longer recognised. | P4, P2 |
| U396 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/13ip2ky/google_ads_traffic_reporting_as_unassigned_in_ga4/) | 2023-05-16 | complaint | Google Ads traffic reporting as Unassigned in GA4. | P4 |
| U397 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/128vmu5/100_of_traffic_is_unassigned/) | 2023-04-01 | complaint | 100% of traffic Unassigned, even tracking links with source and medium. | P4 |
| U398 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/11n3an7/massive_amounts_of_unassigned_traffic_in_ga4/) | 2023-03-09 | complaint | Massive Unassigned with blank / not set source/medium. Bug? | P4 |
| U399 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/11l9eml/whatsapp_button_on_landing_page/) | 2023-03-07 | complaint | Cannot accurately track clicks on a WhatsApp button on a landing page. | P8 |
| U400 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/11izje4/button_redirect_to_whatsapp_will_it_be_recorded/) | 2023-03-05 | confusion | Button redirects via /test to WhatsApp: will GA4 record it? | P8 |
| U401 | Reddit r/Emailmarketing | [link](https://www.reddit.com/r/Emailmarketing/comments/seodxk/link_tracking_underreporting_is_this_possible/) | 2022-01-28 | complaint | Email platform support says some content clicks cannot be reported. | P15 |
| U402 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/qq4gid/1536_clicks_on_link_only_2_whatsapp_chats/) | 2021-11-09 | complaint | 1,536 link clicks, only 2 WhatsApp chats. | P8 |
| U403 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/pbt670/not_able_to_track_whatsapp_click/) | 2021-08-26 | complaint | Cannot debug a GTM tag for WhatsApp clicks. | P8 |
| U404 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/ntaot9/conversion_metric_on_facebook_ads_with_click_to/) | 2021-06-06 | confusion | Conversion objective with WhatsApp: link clicks but hardly any messages. | P8 |
| U405 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/mxknib/so_ive_made_a_facebook_ads_campaign_to_a_realtor/) | 2021-04-24 | complaint | Ads to a realtor's WhatsApp with prefilled message; could not track leads: "I had to trust his word." | P8 |
| U406 | Reddit r/Emailmarketing | [link](https://www.reddit.com/r/Emailmarketing/comments/mnp5yl/gmass_question_has_anyone_had_this_problem_emails/) | 2021-04-09 | complaint | Recipient claims emails with link tracking get "ignored and blocked". | P15 |
| U407 | Reddit r/PPC | [link](https://www.reddit.com/r/PPC/comments/kp11f3/can_i_track_conversion_rates_for_my_whatsapp/) | 2021-01-02 | confusion | Can I track WhatsApp button conversions in Google Ads, and actual messages sent? | P8 |
| U408 | Reddit r/GoogleAnalytics | [link](https://www.reddit.com/r/GoogleAnalytics/comments/gaq9ed/connecting_google_analytics_to_whatsapp_anyone/) | 2020-04-30 | feature-request | Wants GA tracking of what users do inside a WhatsApp bot. | P8 |
| U409 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2018-12-27 | praise | CampaignTrackly saves time on UTM tracking for many email campaigns a year. | P6 |
| U410 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2018-12-26 | praise, feature-request | CampaignTrackly: Lots of features and reports; would recommend a training course to explain them; keeps you consistent. | P18 |
| U411 | Chrome Web Store (CampaignTrackly, 4★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2018-12-23 | praise, feature-request | CampaignTrackly: Extension is single-link only; the website has a multiple-link option. | F4 |
| U412 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2018-12-22 | praise | CampaignTrackly: No need to open a new tab and a separate UTM website any more. | F5 |
| U413 | Chrome Web Store (CampaignTrackly, 1★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2017-12-02 | complaint | CampaignTrackly: "Not working!!!" | P17 |
| U414 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2017-11-06 | praise | CampaignTrackly: Likes the integration with Google Analytics. | P6 |
| U415 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2017-01-02 | praise | CampaignTrackly: Easy to copy tagged links while browsing. | F5 |
| U416 | Chrome Web Store (CampaignTrackly, 5★) | [link](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn/reviews) | 2016-10-13 | praise, workaround | CampaignTrackly: Does everything at once; no need for Excel sheets to tag links. | P6 |
| U417 | Chrome Web Store (UTM Forge, 5★) | [link](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews) | 2026-05-07 | praise | UTM Forge: Building, saving and adding favourites accessible anywhere in Chrome is "a breeze". | F1, F17 |
| U418 | Chrome Web Store (UTM Forge, 5★) | [link](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews) | 2026-05-07 | praise | UTM Forge: Was "toggling between tabs and messy spreadsheets"; loves right-click favourites and local-first privacy; free. | P6, F17, F20 |
| U419 | Chrome Web Store (UTM Forge, 5★) | [link](https://chromewebstore.google.com/detail/aeobmgopfphamnhmagbdgdjdeiiigknk/reviews) | 2026-05-06 | praise | UTM Forge: Uses UTMs all day; extension a life saver. | P6 |
| U420 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2022-03-09 | praise | UTM.io: Standard UTM tags across projects and teams with custom templates. | F1, F2 |
| U421 | Chrome Web Store (UTM.io, 4★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2021-07-06 | complaint | UTM.io: Social share buttons (Facebook, Twitter) missing. | P17 |
| U422 | Chrome Web Store (UTM.io, 2★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2018-04-24 | complaint | UTM.io: New version "not working efficiently". | P17 |
| U423 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2017-05-23 | praise | UTM.io: Lightweight; makes using UTMs a reality. | P6 |
| U424 | Chrome Web Store (UTM.io, 4★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2017-04-12 | feature-request | UTM.io: Wants last state per (sub)domain, presets are too much effort ("ain't nobody got time for that"), custom params like utm_month, and parameter reordering: "Every. Time." | F11, F8, F9 |
| U425 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2017-03-13 | praise | UTM.io: Saves time creating trackable links for a newsletter. | P6 |
| U426 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2017-01-27 | praise | UTM.io: Saves 30-60 seconds per UTM; creates hundreds a day. | P6 |
| U427 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2017-01-17 | praise | UTM.io: Remembers filled fields so past campaign names can be recalled. | F3, F11 |
| U428 | Chrome Web Store (UTM.io, 2★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-12-27 | complaint | UTM.io: Often ignores mouse clicks; cannot go back to fix an input error; reinstalled twice. | P17 |
| U429 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-09-01 | praise | UTM.io: Building UTMs "can be a time suck"; recommends the tool. | P6 |
| U430 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-07-28 | praise, workaround | UTM.io: Moved away from spreadsheet templates; presets are the big time-saver. | F1, P6 |
| U431 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-07-08 | praise | UTM.io: Presets for different accounts and campaigns when scheduling social links. | F1 |
| U432 | Chrome Web Store (UTM.io, 1★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-05-07 | complaint | UTM.io: Settings page not working even with other extensions disabled. | P17 |
| U433 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2016-02-03 | feature-request | UTM.io: Wishes for URL shortener support and an option to hide term and content fields. | F6, F10 |
| U434 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2015-07-02 | praise | UTM.io: Presets save time on similar campaign links. | F1 |
| U435 | Chrome Web Store (UTM.io, 5★) | [link](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp/reviews) | 2015-06-29 | praise | UTM.io: Presets save time across campaigns. | F1 |
| U436 | Chrome Web Store (UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/fhfngcdeploenaaeakjdkkacnnjjdhll/reviews) | 2024-05-22 | praise | UTM Builder: Likes that it preserves subdomain state and allows changing parameter order. | F11, F9 |
| U437 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2020-03-06 | praise | Express UTM-Builder: Wonderful for standardising URLs; essential for marketing teams. | F2 |
| U438 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2019-03-14 | praise | Express UTM-Builder: Creates parameters for different tracking tools (GA and Matomo). | F8 |
| U439 | Chrome Web Store (Express UTM-Builder, 1★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2019-03-06 | complaint | Express UTM-Builder: Could not log in. | P17 |
| U440 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2018-10-17 | praise | Express UTM-Builder: Team defines "fb", "facebook", "fb-homepage" once; no retyping. | F2 |
| U441 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2018-10-09 | praise | Express UTM-Builder: Templates ensure consistency across the team. | F2 |
| U442 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2018-10-03 | praise | Express UTM-Builder: Fast, consistent parameters across the whole company. | F2 |
| U443 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2018-06-02 | praise | Express UTM-Builder: Massive time saver; stops typos; perhaps too many features. | P16 |
| U444 | Chrome Web Store (Express UTM-Builder, 5★) | [link](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg/reviews) | 2018-04-30 | praise | Express UTM-Builder: Easy, effective and affordable. | P18 |
| U445 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2021-02-03 | praise | Google Analytics UTM Builder: Quick, consistent, working UTM URLs for organic and ads. | P2 |
| U446 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2018-09-11 | praise | Google Analytics UTM Builder: Easy to share templates so everyone tags the same way. | F2 |
| U447 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2018-02-19 | praise | Google Analytics UTM Builder: "There is NEVER an excuse to send out a naked link ever again." | P6 |
| U448 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2017-08-03 | praise | Google Analytics UTM Builder: Time saver; a PPC must-have. | P6 |
| U449 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2017-08-02 | praise | Google Analytics UTM Builder: Useful when generating tagged URLs over and over manually. | P6 |
| U450 | Chrome Web Store (Google Analytics UTM Builder, 2★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2016-08-16 | complaint | Google Analytics UTM Builder: Ad macros get encoded as %7Bkeyword%7D instead of {keyword}. | P16, P5 |
| U451 | Chrome Web Store (Google Analytics UTM Builder, 4★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2016-01-13 | praise, complaint, feature-request | Google Analytics UTM Builder: Loves presets and bit.ly link; "a bit buggy"; would pay for a supported version. | F1, F6, P17 |
| U452 | Chrome Web Store (Google Analytics UTM Builder, 3★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2016-01-06 | complaint | Google Analytics UTM Builder: Encodes spaces as %2B rather than %20, unlike Google's builder. | P16 |
| U453 | Chrome Web Store (Google Analytics UTM Builder, 2★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2015-06-24 | complaint | Google Analytics UTM Builder: Suddenly stopped auto-filling the URL from the address bar; "seems to be no support". | P17, F5 |
| U454 | Chrome Web Store (Google Analytics UTM Builder, 1★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2015-02-04 | complaint | Google Analytics UTM Builder: Crashed a lot. | P17 |
| U455 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2014-09-18 | praise | Google Analytics UTM Builder: Presets and bitly integration. | F1, F6 |
| U456 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2014-05-03 | praise | Google Analytics UTM Builder: Bitly integration a fantastic idea. | F6 |
| U457 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2013-09-24 | praise | Google Analytics UTM Builder: Developer very responsive. | P17 |
| U458 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2013-04-10 | feature-request | Google Analytics UTM Builder: Use the last used set as the default. | F11 |
| U459 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2012-11-02 | praise | Google Analytics UTM Builder: Pre-populated lists make creating links a snap. | F1 |
| U460 | Chrome Web Store (Google Analytics UTM Builder, 4★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2012-08-09 | feature-request | Google Analytics UTM Builder: Wants the popup to stay open until closed manually. | F17 |
| U461 | Chrome Web Store (Google Analytics UTM Builder, 1★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2011-12-05 | complaint | Google Analytics UTM Builder: "Barely more than a bookmark": must type the URL instead of using the current page. | F5 |
| U462 | Chrome Web Store (Google Analytics UTM Builder, 5★) | [link](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk/reviews) | 2011-11-24 | praise | Google Analytics UTM Builder: Saves hunting for the web page. | F5 |
| U463 | Chrome Web Store (Campaign Link, 5★) | [link](https://chromewebstore.google.com/detail/kciaggijldaonffolbldkcgdocfjmldg/reviews) | 2026-10-07 | praise | Campaign Link: Simple and fast UTM generator. | P6 |
| U464 | Chrome Web Store (Campaign Link, 4★) | [link](https://chromewebstore.google.com/detail/kciaggijldaonffolbldkcgdocfjmldg/reviews) | 2026-09-28 | praise | Campaign Link: Lightweight compared to others. | P17 |
| U465 | Chrome Web Store (TAGLAB, 5★) | [link](https://chromewebstore.google.com/detail/mpejlmangeopegkhhkoedboenappiggp/reviews) | 2024-05-08 | praise | TAGLAB: Simple and useful for day-to-day UTM building. | P6 |
| U466 | Chrome Web Store (UTM Channel Checker, 5★) | [link](https://chromewebstore.google.com/detail/babdcjccdkaonphgbmhiibjcanalblkl/reviews) | 2026-10-04 | praise | UTM Channel Checker: "A good extension. I was looking for something similar. Simple and working" | F7 |
| U467 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-06-20 | praise, complaint | UTM.io: collaborative; good shortener; cost a little pricey and little learning material. | P18, F6 |
| U468 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-05-23 | praise | UTM.io: saved templates, team sharing, custom-domain shortener, Chrome extension; occasional minor glitches. | F1, F2, F6 |
| U469 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-06-09 | complaint | UTM.io: dislikes subscription cost; new users "will take weeks to learn". | P18 |
| U470 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-09-10 | praise, confusion | UTM.io: extension easy; unsure of best use of terms and campaigns. | P1 |
| U471 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-06-10 | praise, feature-request | UTM.io: organises and categorises links by campaign, channel, source; support could improve. | F3 |
| U472 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2022-12-07 | praise, complaint, workaround | UTM.io: "better than a spreadsheet with complicated and fragile formulas"; lowercase rules; wishes paid features were free. | F2, P18 |
| U473 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2023-06-08 | complaint | UTM.io: learning curve for new users. | P18 |
| U474 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2022-10-13 | praise | UTM.io: create campaign templates and apply them from the extension. | F1 |
| U475 | G2 (UTM.io) | [link](https://www.g2.com/products/utm-io/reviews) | 2021-10-18 | praise, complaint | UTM.io: systematised naming; "Rarely, a created UTM string doesn't save." | P17, P2 |
| U476 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2016-11-01 | praise, complaint | Terminus: drop-down lists made team UTMs consistent; having to use the bit.ly version is "irritating". | F2, F6 |
| U477 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2016-08-01 | praise, complaint, workaround | Terminus: remembers params, bulk build; had started building it in Google Sheets/Forms; "damn expensive" for business. | F4, P18 |
| U478 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2016-04-29 | praise, complaint | Terminus: bulk URLs via dashboard or CSV; UI looks dated. | F4 |
| U479 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2016-10-24 | complaint | Terminus: freedom let the account get unorganised, so "tracking/results aren't really reliable". | P2, F2 |
| U480 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2015-12-29 | praise | Terminus: better than an Excel sheet; short URL gives a click report per UTM. | F6 |
| U481 | G2 (Terminus) | [link](https://www.g2.com/products/terminus-url-builder/reviews) | 2016-06-10 | confusion | Terminus: "Not always clear about tracking abilities". | P1 |
| U482 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2023-09-05 | praise, workaround | CampaignTrackly: removed the spreadsheet from the UTM process; consistent UTMs. | P2 |
| U483 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2026-04-14 | praise, workaround | CampaignTrackly: replaced Excel sheets: "No more version control issues or broken formulas." | P6, F3 |
| U484 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2024-01-13 | praise | CampaignTrackly: easy presets; does not interfere with browsing. | F1 |
| U485 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2023-09-05 | praise, workaround | CampaignTrackly: ditched the outdated spreadsheet; templates keep the whole team consistent. | F2 |
| U486 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2024-01-03 | complaint | CampaignTrackly: interface "little difficult to understand and handle". | P18 |
| U487 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2024-01-30 | praise | CampaignTrackly: short links replace long ugly links in marketing emails. | F6 |
| U488 | G2 (CampaignTrackly) | [link](https://www.g2.com/products/campaigntrackly/reviews) | 2023-09-22 | praise | CampaignTrackly: fewer hand-offs and human errors in campaign link creation. | P6 |
| U489 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2026-07-22 | complaint | Claravine: simple, but interface looks dated. | P18 |
| U490 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2026-05-26 | praise, feature-request | Claravine: parameterised links track emails and WhatsApps; wishes templates were pre-filled since most values repeat. | P8, F1 |
| U491 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2023-05-19 | complaint | Claravine: learning curve, cost for small businesses, implementation complexity. | P18 |
| U492 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2022-08-23 | praise, feature-request | Claravine: templates and line duplication; wants to copy a previous submission and edit fields. | F18 |
| U493 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2022-08-24 | praise, complaint | Claravine: no spelling/typo errors; copy-pasting regions sometimes errors; confusing cell resizing. | P16, P2 |
| U494 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2022-08-23 | praise | Claravine: generates tracking codes to monitor social clicks. | P6 |
| U495 | G2 (Claravine) | [link](https://www.g2.com/products/claravine/reviews) | 2022-10-20 | complaint | Claravine: creating aliases/IDs sometimes takes a while. | P17 |

**Theme key.** P1: Can't find or see UTM data in GA4 (set-up confusion); P2: Inconsistent naming and casing fragments reports; P3: UTMs lost across redirects, page changes, domains, iframes and forms/CRM; P4: "Unassigned", "(not set)" and wrong "Direct" attribution; P5: Ad-platform dynamic parameters/macros broken or confusing (Meta, TikTok, LinkedIn, X, Snapchat); P6: Building UTMs by hand is slow and tedious; P7: Ad platform or email tool numbers don't match GA4 UTM data; P8: WhatsApp / click-to-chat conversions can't be attributed; P9: Google Ads auto-tagging vs manual UTMs conflicts; P10: Shopify / Merchant Center overwrites UTMs (sag_organic, product_sync); P11: Ad formats where UTMs can't be added or don't carry through; P12: UTM URLs indexed or duplicated in SEO and page reports; P13: Fear that editing UTMs resets ad learning; P14: No link inventory; old links and ownership get lost; P15: Email platform link-tracking gaps; P16: Syntax and encoding errors (? vs #, &, %7B, %2B, apostrophes); P17: Tool bugs, reliability and support; P18: Paid tools: cost, learning curve, dated UI; P19: utm_content / utm_term hard to find in GA4; P20: GA4 or CRM reclassifies source/medium unexpectedly; P21: Consent mode pushes traffic into Unassigned. F1: Saved presets / templates; F2: Team-wide naming rules and shared templates (pick-lists, lower-casing); F3: Link history / central library of every link; F4: Bulk generation (many links, CSV); F5: Auto-fill the current tab's URL; F6: Short / branded links (Bitly etc.); F7: UTM checker / audit (verify a link or a session's attribution); F8: Custom parameters beyond the standard five, IDs, merge fields; F9: Control over parameter order; F10: Hide unused fields; F11: Remember last values (per domain); F12: Library of ad-platform dynamic macros (Meta, Google Ads, TikTok); F13: Persist UTMs into forms / CRM; F14: Tagged WhatsApp links per team or agent; F15: QR codes; F16: Export to Google Sheets; F17: Quick access (right-click menu, popup stays open, favourites); F18: Duplicate a previous batch and edit; F19: Offline / print (QR) campaign tagging; F20: Local-first and free.
