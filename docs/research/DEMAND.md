# Search demand: UTM Builder & Checker for GA4 – The Growth Folks®

Research date: 16 October 2026. Scope: Google web search (en, US and India), Google Trends and Chrome Web Store (CWS) search.

## How this was measured, and what it can't tell you

- **No absolute search volumes.** I couldn't reach Google Ads Keyword Planner or any free source that gives real monthly volumes. Every number below is a **relative signal**. None of them is a volume, and I haven't invented any.
- **Google autocomplete.** I queried `https://suggestqueries.google.com/complete/search?client=firefox&q=<seed>` and repeated each seed with a trailing space and with a–z. That gave 2,271 suggestions across 22 seeds (raw files are in the session scratchpad). If a phrase appears in autocomplete, enough people search it for Google to suggest it. Absence doesn't prove zero demand.
- **Relative interest (Google Trends data via the Firecrawl Trends provider).** This is a 0–100 index, worldwide unless noted, for the 12 months to 16 Oct 2026. Source views: [set 1](https://trends.firecrawl.dev/explore?q=utm+builder%2Cutm+generator%2Ccampaign+url+builder%2Cutm+checker%2Cutm+parameters&date=today+12-m), [set 2](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cunassigned+ga4%2Cutm+naming+convention%2Cbulk+utm&date=today+12-m), [India set](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cwa.me+link%2Cwhatsapp+link%2Cutm+link&geo=IN&date=today+12-m), [related: utm builder, 5 years](https://trends.firecrawl.dev/explore?q=utm+builder&date=today+5-y), [related: utm](https://trends.firecrawl.dev/explore?q=utm&date=today+12-m). Google's own Trends endpoint returned HTTP 429.
- **SERP features.** I scraped "People also ask" (PAA), "People also search for" and the "About N results" count from Google result pages (`https://www.google.com/search?q=...&hl=en&gl=us`, or `gl=in` for India). A tiny result count (under about 150) means few pages target that exact phrase. That points to a niche phrase or a content gap, but it is not a measure of demand.
- **"UTM" is ambiguous.** It also means Universiti Teknologi Malaysia, University of Toronto Mississauga, Chile's Unidad Tributaria Mensual ("valor utm"), the UTM Mac virtualiser, UTM coordinates and Check Point UTM firewalls. The [related queries for "utm"](https://trends.firecrawl.dev/explore?q=utm&date=today+12-m) are led by "utm 2026", "utm valor" and "coordenadas utm". Bare "utm", "utm code", "utm checker" and "utm template" are therefore mostly *not* our audience. Always pair the word with builder / link / parameters / tracking / GA4.

## Headline signals

| Signal | Finding | Source |
|---|---|---|
| Biggest head terms | "utm parameters" (avg 27) ≈ "utm builder" (avg 22) > "utm generator" (8) > "campaign url builder" (6). "utm checker" is under 1 (Trends shows 0). | [Trends set 1](https://trends.firecrawl.dev/explore?q=utm+builder%2Cutm+generator%2Ccampaign+url+builder%2Cutm+checker%2Cutm+parameters&date=today+12-m) |
| Seasonality | "utm parameters" peaked at 100 in the week of 23–29 Nov 2025 (Black Friday). "utm builder" dips in late Dec (8) and Aug (18–20). | same |
| Fastest-growing modifier | "utm builder ga4" is a **Breakout** rising query over 5 years, and "ga4" is also Breakout. "google campaign url builder" +250%, "utm builder free" +170%, "qr code generator" +300%. | [Trends related, 5y](https://trends.firecrawl.dev/explore?q=utm+builder&date=today+5-y) |
| Checker demand is tiny but under-served | The "utm checker" SERP shows only **"About 88 results"**, and validators/checkers are mostly small free web tools. | [Google SERP: utm checker](https://www.google.com/search?q=utm+checker&hl=en&gl=us) |
| GA4 diagnosis demand is large | "utm parameters not showing in ga4": about 3,280,000 results with PAA. "are utm parameters case sensitive": about 1,500,000. | [SERP](https://www.google.com/search?q=utm+parameters+not+showing+in+ga4&hl=en&gl=us), [SERP](https://www.google.com/search?q=are+utm+parameters+case+sensitive&hl=en&gl=us) |
| "unassigned ga4" | Small in Trends (avg 1), but 24 autocomplete variants, incl. "unassigned traffic spike", "unassigned vs direct" and Japanese "unassignedとは". | Trends set 2; [autocomplete](https://suggestqueries.google.com/complete/search?client=firefox&q=unassigned%20ga4) |
| WhatsApp link demand dwarfs UTM demand | Worldwide, "whatsapp link generator" averages 22 against 74 for "utm builder" in the same set. In **India**, "whatsapp link" averages **74** while "utm builder" is 1. Much of "whatsapp link" is group-invite intent. | [Trends set 2](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cunassigned+ga4%2Cutm+naming+convention%2Cbulk+utm&date=today+12-m), [India](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cwa.me+link%2Cwhatsapp+link%2Cutm+link&geo=IN&date=today+12-m) |
| WhatsApp + UTM overlap is a gap | "utm parameters for whatsapp" (gl=in) shows about 92 results. One PAA is "Can I add UTM parameters directly to a WhatsApp link?" | [SERP](https://www.google.com/search?q=utm+parameters+for+whatsapp&hl=en&gl=in) |
| Email pre-send link check is **not** a search category | "check links in email before sending" shows about 133 results, and the SERP is dominated by phishing-safety intent. "email link checker" autocomplete is almost all phishing/safety. | [SERP](https://www.google.com/search?q=check+links+in+email+before+sending&hl=en&gl=us), [autocomplete](https://suggestqueries.google.com/complete/search?client=firefox&q=email%20link%20checker) |
| Where interest in "utm builder" concentrates (top of the 0–100 index) | Armenia 100, Israel 53, Canada 50, UAE 46, Netherlands 42 … India 26, UK 19, US 11. This index is per-capita share, not volume. | [Trends by region](https://trends.firecrawl.dev/explore?q=utm+builder&date=today+12-m) |

## Keyword clusters

Intent codes: **T** = transactional (wants a tool now), **I** = informational (wants to understand), **D** = diagnostic (something is broken), **N** = navigational (wants a specific brand or tool).

All phrases were present in Google autocomplete for the seed shown unless marked otherwise. Autocomplete URL pattern: `https://suggestqueries.google.com/complete/search?client=firefox&q=<seed>`.

### C1. Build a UTM link (core, T)
Seeds: [utm builder](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20builder), [utm generator](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20generator), [utm link](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20link), [campaign url builder](https://suggestqueries.google.com/complete/search?client=firefox&q=campaign%20url%20builder)

- utm builder · utm builder free · utm builder tool · utm builder online · best utm builder · utm builder ga4 · utm builder for ga4 · utm builder google analytics 4 · utm builder google · utm builder by google · google utm builder
- utm generator · utm generator free · utm generator ga4 · utm link generator · utm link generator free · utm url generator · utm code generator · utm tag generator · utm parameters generator · utm link maker · utm link creator · create utm link · how to create a utm link · how to create utm links
- campaign url builder · campaign url builder ga4 · campaign url builder for ga4 · campaign url builder google analytics · google campaign url builder free · campaign tracking url builder · is google campaign url builder free
- utm builder chrome extension · utm builder extension · utm chrome extension ("utm io chrome extension" is navigational, toward a competitor)
- utm builder short · utm link shortener · utm builder bitly · campaign url builder bitly
- People also ask on "utm builder": *What is an UTM builder? · How do I create an UTM builder? · What does the UTM stand for? · How to use google UTM Builder?* ([SERP](https://www.google.com/search?q=utm+builder&hl=en&gl=us))
- People also search for: *UTM builder Google · free · Bitly · GA4 UTM builder · Meta · Excel · net · extension* (same SERP)

### C2. Platform-specific building (T)
- **Meta:** utm builder meta · utm builder meta ads · utm builder for meta ads · utm generator meta · utm builder facebook · meta campaign url builder · facebook campaign url builder · dynamic utm parameters meta · utm parameters facebook ads example · utm tracking meta ads
- **Google Ads:** utm builder for google ads · utm generator google ads · utm template google ads · utm tracking template google ads · utm tracking template for google ads · dynamic utm parameters google ads · google ads campaign url builder
- **Others:** utm builder linkedin · linkedin utm parameters builder · utm builder tiktok · tiktok utm parameters builder · utm link youtube · utm parameters pinterest · dv360 utm parameters · outbrain utm parameters
- **Other analytics tools:** utm builder adobe · utm builder for adobe analytics · utm builder matomo · campaign url builder matomo · utm parameters posthog
- **CMS/CRM/ESP:** utm builder hubspot · utm generator hubspot · create utm link hubspot · utm tracking klaviyo · klaviyo utm parameters · mailchimp utm · mailchimp utm parameters · utm links mailchimp · utm parameters shopify · utm link shopify · how to check utm in shopify · utm tracking woocommerce · utm parameters wordpress · utm parameters gohighlevel · utm tracking zoho crm/forms · utm parameters salesforce marketing cloud · utm parameters marketo · utm parameters eloqua · utm builder tilda (sources: autocomplete for [utm parameters](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20parameters), [utm tracking](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20tracking), [mailchimp utm](https://suggestqueries.google.com/complete/search?client=firefox&q=mailchimp%20utm), [klaviyo utm](https://suggestqueries.google.com/complete/search?client=firefox&q=klaviyo%20utm))

### C3. Bulk, templates and spreadsheets (T)
Seeds: [bulk utm](https://suggestqueries.google.com/complete/search?client=firefox&q=bulk%20utm), [utm template](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20template), [utm spreadsheet](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20spreadsheet)

- bulk utm builder · bulk utm generator · utm builder excel · utm builder excel template · utm builder excel formula · utm builder google sheets · utm builder google sheets template · utm builder spreadsheet template · utm generator excel template · utm link builder spreadsheet · utm tracker spreadsheet · utm tracker template · utm builder xlsx · utm templates github · utm naming convention template · utm parameters template · utm link template
- Signal: "bulk utm" averages 2 against 74 for "utm builder" ([Trends set 2](https://trends.firecrawl.dev/explore?q=utm+builder%2Cwhatsapp+link+generator%2Cunassigned+ga4%2Cutm+naming+convention%2Cbulk+utm&date=today+12-m)). The spreadsheet-template phrasings outnumber "bulk" phrasings in autocomplete, so people describe bulk work as *Sheets/Excel*.

### C4. Check, validate and test a link (T/D)
Seeds: [utm checker](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20checker), [check utm](https://suggestqueries.google.com/complete/search?client=firefox&q=check%20utm), [utm validator](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20validator)

- utm checker · utm checker online · utm checker tool · google utm checker · utm link checker · utm link tester · utm link test · utm link validator · utm parameter checker · utm parameter validator · utm parameters checker · utm parameters test · utm tag checker · utm tracking checker · utm url checker · utm code checker · utm validator · utm validator google · test utm link · test utm parameters · test utm url · check utm link · check utm parameters · how to check if utm is working · utm link not working
- People also search for on "utm checker": *Utm checker online · software · free · UTM builder · UTM Tracker · Google UTM · UTM URL example · Google UTM builder* ([SERP](https://www.google.com/search?q=utm+checker&hl=en&gl=us))
- Ranking pages for "utm checker": utmchecker.com, validateurl.com (incl. an "Email Campaign UTM Validator"), madlitics.com URL tester ("See how your campaign URL will be classified"), utmbuilder.net, ga-dev-tools.google, utm.io, expertise.ai, utmbuildertool.com, linkutm.com, pulsepanda.dev "Bulk UTM Builder & Link Checker", yukt.tools (same SERP). Several of these already promise GA4 "classification" or "prevent Unassigned", so the channel predictor is a known pitch rather than a unique one.

### C5. Understand UTMs and GA4 (I)
Seeds: [utm parameters](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20parameters), [ga4 utm](https://suggestqueries.google.com/complete/search?client=firefox&q=ga4%20utm), [utm tracking](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20tracking)

- utm parameters · utm parameters ga4 · ga4 utm parameters list · utm parameters list · google utm parameters list · ga4 standard utm parameters · ga4 default utm parameters · required utm parameters · utm parameters explained · utm parameters example · what are utm parameters · how do utm parameters work · utm link meaning · utm link explained · utm full form · what does utm stand for
- ga4 utm_id · ga4 utm_source · ga4 utm_medium · ga4 utm_campaign · ga4 utm_term · ga4 utm content · utm_source platform · utm_creative_format ([autocomplete: utm_source_platform](https://suggestqueries.google.com/complete/search?client=firefox&q=utm_source_platform))
- utm parameter character limit · utm parameters max length · can utm parameters have spaces · are utm parameters case sensitive · utm case sensitive ([autocomplete](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20case%20sensitive))
- utm medium examples · utm source examples · utm format example · utm examples
- Rising: "what is utm tracking" +190%, "utm source" +190%, "what is a utm" +150%, "utm links" +70% ([Trends related: utm](https://trends.firecrawl.dev/explore?q=utm&date=today+12-m))

### C6. Naming conventions and governance (I, high value)
Seed: [utm naming convention](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20naming%20convention), [utm best practices](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20best%20practices)

- utm naming convention · utm naming convention template · what is utm naming convention · utm naming best practices · utm best practices · ga4 utm best practices · utm tagging best practices · utm campaign best practices · utm tracking structure · utm tracking framework · utm tracking management · utm link manager
- PAA on "utm naming convention": *What does the abbreviation UTM stand for in marketing? · What is a naming convention? · Can you provide some examples of UTM parameters? · Is UTM tracking still used?* ([SERP](https://www.google.com/search?q=utm+naming+convention&hl=en&gl=us), about 1,200,000 results)
- PAA on "are utm parameters case sensitive": *What are the best practices for tracking UTM parameters? · What are UTM parameters? · Why are UTM parameters so valuable? · How to set up UTM parameters?* Related searches: *UTM medium list · Standard UTM parameters · UTM guidelines* ([SERP](https://www.google.com/search?q=are+utm+parameters+case+sensitive&hl=en&gl=us))
- Low search volume (Trends avg 0) but strong forum pull: see PERSONAS.md.

### C7. GA4 diagnosis: Unassigned, (not set), Direct, Paid Other, AI Assistant (D)
Seeds: [unassigned ga4](https://suggestqueries.google.com/complete/search?client=firefox&q=unassigned%20ga4), [ga4 unassigned](https://suggestqueries.google.com/complete/search?client=firefox&q=ga4%20unassigned), [ga4 paid other](https://suggestqueries.google.com/complete/search?client=firefox&q=ga4%20paid%20other), [ga4 ai assistant](https://suggestqueries.google.com/complete/search?client=firefox&q=ga4%20ai%20assistant)

- unassigned ga4 · unassigned traffic in ga4 · unassigned channel ga4 · unassigned channel group ga4 · unassigned sessions ga4 · unassigned source ga4 · ga4 unassigned traffic spike · ga4 unassigned not set · unassigned vs direct traffic ga4 · ga4 direct vs unassigned · unassigned ga4 meaning · ga4 direct traffic spike · ga4 direct traffic high
- ga4 paid other · ga paid other · paid other ga4 意思 / ga4 paid otherとは (Chinese/Japanese)
- ga4 ai assistant channel · ga4 ai assistant traffic · chatgpt ai assistant ga4 (the channel launched 13 May 2026: [GA4 release notes](https://support.google.com/analytics/answer/9164320?hl=en))
- utm parameters not showing in ga4 · no utm parameters were available for this session · utm parameters being stripped · how to check utm in ga4 · how to check utm source in ga4 · ga4 see utm parameters · ga4 utm report · ga4 utm campaign report
- PAA on "unassigned traffic ga4": *How do I exclude internal traffic in GA4? · Does GA4 exclude bot traffic? · What is considered direct traffic in GA4? · What does "direct/none traffic" mean?* Related: *Unassigned traffic ga4 meaning · reddit · Not set GA4 · What is direct traffic*. Google's own [tagging best-practices page](https://support.google.com/analytics/answer/14847402?hl=en) ranks #2 ([SERP](https://www.google.com/search?q=unassigned+traffic+ga4&hl=en&gl=us)).
- PAA on "utm parameters not showing in ga4": *Where to find UTM parameters in GA4? · How do I add UTM parameters to Google Analytics? · How to see UTM codes in Google Analytics? · Why is my UTM link not working?* Related: *How to view utm_content in GA4* ([SERP](https://www.google.com/search?q=utm+parameters+not+showing+in+ga4&hl=en&gl=us))

### C8. Clean, remove and strip (T)
Seeds: [utm cleaner](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20cleaner), [remove utm](https://suggestqueries.google.com/complete/search?client=firefox&q=remove%20utm)

- utm cleaner · utm link cleaner · remove utm from url · remove utm parameters · remove utm parameters from url · remove utm from link · utm link remover · **remove utm_source chatgpt com** (people want to strip the `utm_source=chatgpt.com` that ChatGPT appends)
- The intent is split: most people searching want to *remove* tracking for privacy or cleaner sharing, not to normalise it. The Cleaner should be worded as "normalise / fix", not "remove".

### C9. QR codes with UTMs (T)
Seed: [utm qr](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20qr)

- utm qr code · utm qr code generator · utm qr code tracking · utm link qr code · utm parameters for qr code · utm tracking for qr codes · utm_source=qr · utm_source=qr code
- "qr code generator" is a +300% rising related query for "utm builder" ([Trends](https://trends.firecrawl.dev/explore?q=utm+builder&date=today+5-y)).
- Engine note: `utm_source=qr&utm_medium=offline` or `print` falls into **Unassigned** under Google's rules (checked with this repo's predictor against [Google's channel rules](https://support.google.com/analytics/answer/9756891)). This is a common, fixable mistake for print and QR campaigns.

### C10. WhatsApp click-to-chat links (T; large in India)
Seeds: [whatsapp link generator](https://suggestqueries.google.com/complete/search?client=firefox&q=whatsapp%20link%20generator), [wa.me link](https://suggestqueries.google.com/complete/search?client=firefox&q=wa.me%20link), [utm for whatsapp](https://suggestqueries.google.com/complete/search?client=firefox&q=utm%20for%20whatsapp), [whatsapp utm](https://suggestqueries.google.com/complete/search?client=firefox&q=whatsapp%20utm), [whatsapp qr code](https://suggestqueries.google.com/complete/search?client=firefox&q=whatsapp%20qr%20code)

- whatsapp link generator · whatsapp link generator free · whatsapp link generator with message · whatsapp link generator with text · whatsapp link generator qr code · whatsapp link generator for instagram · whatsapp link generator for website · whatsapp business link generator · whatsapp prefilled message link generator · whatsapp custom message link generator · whatsapp direct chat link generator · click to whatsapp link generator · bulk whatsapp link generator · whatsapp link generator api · whatsapp link to qr generator · whatsapp link generator short
- Vendor-branded variants (navigational, showing competitors): aisensy, wati, interakt, gallabox, kommo, respond io, sleekflow, delightchat, postcron, chatfuel, alvo chat
- wa.me link · wa.me link with message · wa me link with custom message · wa me link with text · wa me link qr code · wa me link for whatsapp business · wa me link india · wa me 91 mobile number link · wa me link not working · wa.me link doesn't work · wa me link format · wa me url format · wa me link syntax · wa me link html · wa me link safe / virus / spam / scam text message (a trust concern)
- whatsapp utm link · whatsapp utm tracking · utm_source=whatsapp · utm whatsapp · utm para whatsapp
- PAA on "whatsapp link generator" (gl=in): *Https wa me WhatsApp number link · WhatsApp link generator free · WhatsApp link to message · How to create WhatsApp link for my number · How to create WhatsApp link for business · WhatsApp link shortener · WhatsApp link generator QR code · WhatsApp link format*. About 5,000,000 results. Ranking: create.wa.link, fonada, zipchat.ai, aisensy, postcron, businesschat.io, kommo ([SERP](https://www.google.com/search?q=whatsapp+link+generator&hl=en&gl=in))
- PAA on "wa.me link with message": *How do I create a WhatsApp link with a message? · Can you hyperlink a WhatsApp message? · How to create WhatsApp link for business? · How do I get my WA me link?* The WhatsApp Help Center ranks #1 ([SERP](https://www.google.com/search?q=wa.me+link+with+message&hl=en&gl=in))
- PAA on "utm parameters for whatsapp": *What are the 5 UTM parameters? · Can I add UTM parameters directly to a WhatsApp link? · What is the purpose of UTM parameters?* Ranking: zoko.io, insiderone academy, linkutm.com, interakt.shop, heltar ([SERP](https://www.google.com/search?q=utm+parameters+for+whatsapp&hl=en&gl=in))

### C11. Email link checking (D, mostly not our intent)
Seeds: [email link checker](https://suggestqueries.google.com/complete/search?client=firefox&q=email%20link%20checker), [gmail link checker](https://suggestqueries.google.com/complete/search?client=firefox&q=gmail%20link%20checker)

- email link checker · email link checker online · email link check · email link safety checker · phishing email link checker · how to check if an email link is safe · why are email links not working · gmail link checker · gmail links not working · utm tracking email · utm parameters email · utm parameters for email campaigns · utm code for email · utm tag helps monitor the traffic from email · utm parameter newsletter
- PAA on "check links in email before sending": *What if I accidentally clicked on a suspicious link in email? · How to safely verify links before clicking? · What should I do if I clicked on a phishing link? · How to check links before sending an email?* Related: *Check links in email before sending gmail · outlook · android* ([SERP](https://www.google.com/search?q=check+links+in+email+before+sending&hl=en&gl=us))
- Read: people do ask "check links before sending" in Gmail and Outlook, but the phrase is drowned out by security intent. In-store wording must say "campaign links" or "UTM links" so users don't mistake this for a phishing scanner.

## Chrome Web Store: what ranks

These are CWS search results pages, fetched 16 Oct 2026 (`https://chromewebstore.google.com/search/<q>?hl=en`). User counts come from each listing page.

| Query | Top titles in order |
|---|---|
| [utm builder](https://chromewebstore.google.com/search/utm%20builder) | Google Analytics UTM Builder · UTM.io - Google Analytics URL Builder · UTM Builder · UTM Builder – UTM Link Generator for Google Analytics · Campaign URL Builder for Google Analytics (GA4) · Terminus UTM Builder · Google Analytics UTM Builder · UTM Generator · Just UTM Builder · Express UTM-Builder |
| [utm checker](https://chromewebstore.google.com/search/utm%20checker) | UTM.io · **UTM Params Checker** · UTM Builder · Google Analytics UTM Builder · **Email Link Checker: Campaign QA & UTM Check** · **UTM Channel Checker** · **GA4 UTM Channel Checker** · OSOMA - UTM Tracker · UTM Codebook — UTM Validator · UTM Tagger & GA4 Debugger |
| [campaign url builder](https://chromewebstore.google.com/search/campaign%20url%20builder) | Campaign URL Builder for Google Analytics (GA4) · UTM Builder · Google Analytics UTM Builder · UTM Builder: Campaign URL Tagger · Odexly UTM Builder – Campaign URL Manager · … · UTM Manager – Campaign URL Builder |
| [whatsapp link generator](https://chromewebstore.google.com/search/whatsapp%20link%20generator) | WhatsApp Link Generator · WhatsApp link generator by Gredich · WA Link Generator · WhatsApp Link & QR Generator \| Click to Chat by Spur · WhatsApp Link Generator by ALLO · WA Link Generator - Click to Chat · Click-to-Chat Link & QR Generator by LeadTrapper |

User counts (listing pages, 16 Oct 2026):
- [Google Analytics UTM Builder](https://chromewebstore.google.com/detail/gaidpiakchgkapdgbnoglpnbccdepnpk): **50,000 users**, 4.6★ (102 ratings). This is the only large incumbent.
- [UTM.io](https://chromewebstore.google.com/detail/eoaapiimcaimddnfhfnifgkinmpcbccp): **10,000**, 4.5★ (34).
- [Utm builder](https://chromewebstore.google.com/detail/debkcejopkpfoabgdkgajangnbdgjdld): 1,000.
- [Campaign URL Builder for Google Analytics (GA4)](https://chromewebstore.google.com/detail/lmgdpibpdijgpjjdpbcmbaakaimgodab): 895.
- [Express UTM-Builder](https://chromewebstore.google.com/detail/flockfgmfgmpmimlfkkeepkblckodbjg): 881.
- [UTM Generator](https://chromewebstore.google.com/detail/nigngflgkegdafhhpopodlahplncljhl): 850.
- [UTM Builder](https://chromewebstore.google.com/detail/fhfngcdeploenaaeakjdkkacnnjjdhll): 564.
- [CampaignTrackly](https://chromewebstore.google.com/detail/acidoblgnoinmcobmdfpeoepdkmfoebn): 390.
- [UTM Builder – UTM Link Generator for Google Analytics](https://chromewebstore.google.com/detail/nebodfojlimnoegcgeoegmgncfbfeaan): 304.
- [Terminus UTM Builder](https://chromewebstore.google.com/detail/cpibiaebckfaajijhjhkfmedpnagcmmo): 239.
- **Checker titles:**
  - [UTM Params Checker](https://chromewebstore.google.com/detail/cldpbepggcfgegalhpiccmelepffhemk): 230
  - [OSOMA - UTM Tracker](https://chromewebstore.google.com/detail/jgcmmbnhhgdkknaiaoicmmapoejffbkk): 192
  - [UTM Tagger & GA4 Debugger](https://chromewebstore.google.com/detail/menndhdnbbdcikeclcgpmboimepagadj): 33
  - [GA4 UTM Channel Checker](https://chromewebstore.google.com/detail/gilkeeihkhampikhcdfkpeakcbpnbbji): 31
  - [Email Link Checker: Campaign QA & UTM Check](https://chromewebstore.google.com/detail/hlianpkoiglgdkkacoelpjheikcodfje): 13
  - [UTM Channel Checker](https://chromewebstore.google.com/detail/babdcjccdkaonphgbmhiibjcanalblkl): 4
- **WhatsApp generators:**
  - [WA Link Generator](https://chromewebstore.google.com/detail/fgmmhlgbkieebimhondmhbnihhaoccmj): 401
  - [WhatsApp Link Generator](https://chromewebstore.google.com/detail/cpcnmfdapbmmfjfaahbaeombgbikckja): 172
  - [Spur](https://chromewebstore.google.com/detail/fbfikkhdebfpkpaipeciflglkkepdipi): 110

Reading:
1. CWS titles that rank use the literal head terms: "UTM Builder", "Google Analytics", "Campaign URL Builder", "GA4", "Link Generator", "Checker".
2. Apart from one 50k-user extension and UTM.io, the field is small, so a well-reviewed listing can rank.
3. "Channel Checker" and "Email Link Checker … UTM Check" listings already exist but have almost no users. The concept isn't new, but nobody has won it.
4. The WhatsApp link-generator extensions are all small. Nobody combines WhatsApp links with UTMs and a GA4 verdict.

## (a) Questions the tool must answer in-product

Ordered by how often they show up across autocomplete, PAA and CWS. Each entry names the cluster it comes from. Where a channel is stated, it comes from Google's rules ([9756891](https://support.google.com/analytics/answer/9756891)).

1. **"Which GA4 channel will this link land in?"** Show the channel name with a one-line reason (C4, C7). Already built. Keep the verdict visible above the fold.
2. **"Why would this be Unassigned / Paid Other / (not set)?"** Give the exact rule that failed. For example, "`utm_medium=print` matches no channel rule → Unassigned". (C7)
3. **"Are UTM parameters case sensitive?"** Yes. Google says "utm_source=google is different from utm_source=Google" ([10917952](https://support.google.com/analytics/answer/10917952)). Show a warning and a one-click fix. (C5, C6)
4. **"Which UTM parameters are required, and what does GA4 support?"** Source, medium and campaign are required. utm_id, term, content, source_platform, creative_format and marketing_tactic are optional, and Google notes the last two "aren't currently reported" ([10917952](https://support.google.com/analytics/answer/10917952)). Also: "utm_source_platform shows as Manual" ([15593651](https://support.google.com/analytics/answer/15593651)). (C5)
5. **"Will my UTMs survive the redirect / landing page?"** Covered by the link check and landing test. Expose them as "Test link". (C4)
6. **"Where do I see this in GA4?"** Name the dimensions: Session source/medium, Session campaign, Session manual ad content ([10917952](https://support.google.com/analytics/answer/10917952)). (C7, PAA)
7. **"What should utm_medium be for Meta / Google Ads / email / QR / WhatsApp / AI?"** Use per-platform templates plus a medium cheat sheet: paid_social, cpc, email, sms, affiliate, ai-assistant, display. (C2, C5)
8. **"How do I paste this into Meta URL parameters / a Google Ads tracking template or final URL suffix?"** Already built as exact per-platform output. (C2)
9. **"Can I add UTMs to a WhatsApp (wa.me) link?"** Not usefully: a wa.me link opens a chat, not your site, so GA4 never sees those parameters. Put the UTM on the website link inside the pre-filled message, or on the landing page that hosts the WhatsApp button. Also explain that `utm_source=whatsapp` lands in Organic Social, because "whatsapp" is on Google's social source list (`src/lib/ga4-sources.js`, from Google's [source list](https://support.google.com/analytics/answer/9756891)). (C10)
10. **"How do I make a wa.me link with a message and a QR code?"** Use the format from the [WhatsApp FAQ](https://faq.whatsapp.com/5913398998672934): international number, no zeroes, brackets or dashes, plus `?text=` with URL encoding. (C10)
11. **"Are all the links in this email / page tagged correctly?"** Covered by the page checker and email HTML tagger. Add a paste-or-scan email check. (C4, C11)
12. **"Why does my ESP's default UTM break GA4?"** Example: older Klaviyo defaults used utm_medium=campaign or flow, which this repo's predictor classes as Unassigned. Klaviyo moved new accounts to "Message type" on 2 June 2025 ([Klaviyo help](https://help.klaviyo.com/hc/en-us/articles/115005247808)). (C2, C11)
13. **"What naming convention should we use, and how do we enforce it?"** Covered by workspace rules, locked dropdowns and a campaign formula. Offer a downloadable rules file. (C6)
14. **"How do I build many links at once / from a sheet?"** Covered by the matrix and CSV import. Word it as "Google Sheets / Excel", which is what people search. (C3)
15. **"How do I remove or clean UTMs and click IDs?"** Covered by the Cleaner. (C8)
16. **"Is a UTM link safe? Will it look like spam?"** Trust copy for wa.me and shortened links: "wa me link spam/virus" appears in autocomplete. (C10)

## (b) Words to use in the UI and store listing

Use the exact phrasing searchers type:
- **Primary nouns:** UTM builder, UTM link, UTM parameters, campaign URL, link checker, GA4, Google Analytics 4.
- **Verbs:** build, generate, create, check, test, validate, fix, clean, tag, bulk. "Generate" and "create" are as common as "build".
- **GA4 vocabulary (keep Google's capitalisation):** Default channel group, Unassigned, (not set), Direct, Paid Social, Organic Social, Paid Other, Cross-network, AI Assistant, Session source / medium, Session campaign.
- **Platform names:** Meta Ads (and "Facebook"), Google Ads, LinkedIn, TikTok, YouTube, Microsoft Ads, HubSpot, Mailchimp, Klaviyo, Shopify, Google Sheets, Excel, Bitly, QR code, WhatsApp, wa.me.
- **Problem words:** "not showing in GA4", "case sensitive", "naming convention", "tracking template", "URL parameters", "final URL suffix", "redirect drops UTMs".
- **Avoid as lead words:**
  - "UTM" on its own or "UTM code/test/checker" without a qualifier. These collide with universities, Chilean tax units, the Mac VM and tensile-test machines.
  - "governance" and "taxonomy". These aren't searched. Keep them for the agency/admin sections.
  - "email link checker" without "campaign/UTM". People read it as phishing.
  - "remove UTM" as the Cleaner's headline. That intent is privacy, not fixing.
- **British spelling in UI copy:** normalise, colour, organisation, licence (noun). Keep Google's own UI labels verbatim even where Google uses US spelling.

## (c) Recommended store keyword set

Title (fixed, 49 characters): **UTM Builder & Checker for GA4 – The Growth Folks®**. It already holds the three strongest head terms: "UTM Builder", "Checker" and "GA4". It is well inside the 75-character manifest `name` limit ([manifest name docs](https://developer.chrome.com/docs/extensions/reference/manifest/name)). `manifest.json` now uses this name (v0.3.0).

**Short description.** This is the manifest `description`, limited to 132 characters ([manifest description docs](https://developer.chrome.com/docs/extensions/reference/manifest/description)). Two options, both under the limit:
- A (124 chars): `Build and check UTM links for Google Analytics 4. See the GA4 channel before you share. Bulk, QR, Meta and Google Ads ready.`
- B (129 chars): `Free UTM link generator and checker for GA4: predicts the channel, fixes Unassigned, bulk from Sheets, QR codes, Meta/Google Ads.`

**Keyword set for the detailed description.** Use each phrase once or twice, naturally. CWS treats "unnatural repetition of the same keyword more than 5 times" as keyword spam ([CWS policy](https://developer.chrome.com/docs/webstore/program-policies/policies)).
1. UTM builder / UTM link builder
2. UTM generator / campaign URL builder (Google's tool name)
3. UTM checker / UTM link checker / validate UTM parameters
4. GA4 / Google Analytics 4 channel (Default channel group)
5. Unassigned / (not set) / Paid Other / AI Assistant
6. UTM naming convention / lowercase / case sensitive
7. Bulk UTM / Google Sheets / Excel / CSV
8. Meta Ads URL parameters / Google Ads tracking template / final URL suffix
9. QR code with UTM
10. WhatsApp link with UTM / wa.me (only once the WhatsApp builder ships)
11. Email campaign links / HubSpot / Mailchimp / Klaviyo (only once the email checker ships, and phrased as "campaign link check", not "safety")

Don't add competitor names (Bitly is fine as an integration). Don't add "free" unless the core stays free.
