# Decisions before building (checkpoint)

I re-read the research files and SPEC.md. These are the things we left out, or did differently from the brief, and why.

## Left out of v1

1. **A checker button injected into Gmail/Outlook/HubSpot/Mailchimp/Klaviyo that runs when you press Send.**
   - Why: all five editors change their DOM often, and most render the email body in iframes (RISKS §5).
   - Why: intercepting Send is fragile and would need permanent content scripts on mail sites. That means a harsher install warning and slower Chrome Web Store review, and reading "personal communications" all the time (RISKS §2).
   - Instead: v1 checks the open draft **on demand** from the extension. It uses optional per-site permissions asked on first use, plus a disclosure. This does the same job ("check before you send") without injected UI. (SPEC L1)
2. **Outlook Smart Alerts add-in.** Microsoft's official pre-send hook is an Office add-in, which is a separate product, store and codebase (RISKS §5). (L2)
3. **Every hop of a redirect chain.** In MV3, a fetch from the service worker only exposes the final URL. Seeing each hop needs the `webRequest` permission. v1 shows original → final, the status, and whether the UTMs survived. That answers the pain in the reviews (P3: UTMs lost on redirect). (L3)
4. **Cloud sync and a shared audit log.** These need a server. The JSON team rules file and workspace codes cover sharing for v1. (L4)
5. **Dependent dropdowns** (medium list depends on source). Terminus has them, but they weren't in the top 15 pains or requests. (L5)
6. **Direct GA4 API.** Needs an OAuth client registered to the published extension ID. The GA4 CSV audit stays. (L6)
7. **Arabic interface.** The transliteration rule ships; translating the UI is a separate job. (L7)
8. **Putting UTMs on the wa.me URL.** Research is consistent that a wa.me click opens WhatsApp, not your site, so GA4 never sees those UTMs (RISKS §4, COMPETITORS §7.4). We tag the website link *inside* the message instead and say so in the UI.
9. **Shortening wa.me links by default.** Autocomplete shows "wa me link spam/scam" worries (DEMAND C10). We show the full destination; shortening stays opt-in through the user's own key.
10. **Message length limit as a hard rule.** We found no official WhatsApp limit for `text`, so 2,000 characters is a warning (estimate), not a block.
11. **A server-side redirect checker** like the web tool's Cloudflare function. The extension can fetch directly with the user's permission, so it doesn't need one.

## Done differently from the brief

- **Tab name:** the brief says "Checker mode". The tab is called **Check**, to fit the segmented control at popup width. Its heading reads "UTM Checker".
- **Rules file schema:** the website's Bulk UTM Link Checker repo doesn't exist yet, so this extension sets the schema (`docs/RULES_SCHEMA.md`). The campaign pattern uses the brace syntax from that tool's brief (`{yyyy}-{mm}_{market}`); the extension converts to its in-app bracket syntax.
- **GA4 rules "as of" date:** 13 May 2026, the date of the most recent change we could find (AI Assistant channel, RISKS K1). Not today's date.

## Known risks we accept

- Pre-send checks see links before the email platform rewrites them (HubSpot/Mailchimp tracking, Outlook Safe Links). The UI says so and recommends a test send (K3).
- Editor detection uses heuristics (editable regions, editor iframes). If an editor changes, the fallback is the Paste mode, and the UI says so.
