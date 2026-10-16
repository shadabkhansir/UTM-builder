# Team rules file: `tgf.utm-rules` v1

One JSON file holds a team's UTM naming convention. The same file is read and written by:

- **UTM Builder & Checker for GA4 – The Growth Folks®** (this Chrome extension): Settings → Share → *Export rules file* / *Import rules file*, and the Checker uses it to grade links.
- **Bulk UTM Link Checker & Naming Generator** (`thegrowthfolks.com/tools/bulk-utm-checker/`, repo `tgf-bulk-utm-checker`, not built yet): rules import/export.

This document is the contract. Both tools must accept every valid v1 file, ignore unknown keys, and never write keys outside this spec without bumping `version`.

Extension workspaces hold more than a rules file does (presets, shortener keys, webhooks, QR styling, lock PIN). Those are **not** part of this schema. Use the extension's own workspace code (`UTMG1.…`) to move a whole workspace between browsers.

## Example

```json
{
  "type": "tgf.utm-rules",
  "version": 1,
  "name": "Acme Outdoor",
  "updatedAt": "2026-10-16T09:30:00Z",
  "casing": "lower",
  "spaceReplacement": "-",
  "stripSpecial": true,
  "nonLatin": "transliterate",
  "stripClickIds": true,
  "required": ["source", "medium", "campaign"],
  "sources": {
    "values": ["google", "facebook", "instagram", "newsletter"],
    "locked": false,
    "labels": { "facebook": "Meta – Facebook" }
  },
  "mediums": {
    "values": ["cpc", "paid_social", "email", "social"],
    "locked": true,
    "labels": {}
  },
  "domains": ["acme-outdoor.com"],
  "campaign": {
    "pattern": "{yyyy}-{mm}_{product}_{market|uae,ksa,kw}",
    "regex": "^\\d{4}-\\d{2}_[a-z0-9-]+_(uae|ksa|kw)$"
  },
  "defaultParams": [{ "key": "ref", "value": "partner" }]
}
```

## Fields

| Key | Type | Required | Default | Meaning |
|---|---|---|---|---|
| `type` | string | yes | — | Always `"tgf.utm-rules"`. Readers reject other values. |
| `version` | integer | yes | — | `1`. A reader that sees a higher major version must refuse with a clear message. |
| `name` | string | yes | — | Human name (client, brand or team). Max 80 chars. |
| `updatedAt` | string | no | — | ISO 8601 UTC timestamp of the last edit. Informational. |
| `casing` | `"lower"` \| `"preserve"` | no | `"lower"` | `lower`: every UTM value must be lowercase (GA4 treats `Facebook` and `facebook` as different values). |
| `spaceReplacement` | `"-"` \| `"_"` \| `"+"` \| `""` | no | `"-"` | What spaces become. `""` keeps spaces (encoded as `%20`). |
| `stripSpecial` | boolean | no | `true` | Remove characters other than letters, digits and `- _ . ~ + \| :`. |
| `nonLatin` | `"allow"` \| `"transliterate"` \| `"block"` | no | `"allow"` | Non-Latin text such as Arabic: keep, transliterate to Latin (عرض → `ard`, é → `e`), or flag as an error. |
| `stripClickIds` | boolean | no | `true` | Treat `fbclid`, `gclid`, `msclkid`, `_gl` and similar on a shared link as a problem and remove them in fixes. |
| `required` | string[] | no | `["source","medium","campaign"]` | Fields that must be present. Allowed items: `source`, `medium`, `campaign`, `term`, `content`, `id`, `source_platform`, `creative_format`, `marketing_tactic`. |
| `sources` | ValueList | no | empty, unlocked | Approved `utm_source` values. |
| `mediums` | ValueList | no | empty, unlocked | Approved `utm_medium` values. |
| `domains` | string[] | no | `[]` | Allowed destination hostnames. A subdomain matches its parent (`shop.acme.com` matches `acme.com`). Empty = any. |
| `campaign.pattern` | string | no | `""` | Campaign-name pattern (see below). Used to generate names and to grade them. |
| `campaign.regex` | string | no | `""` | ECMAScript regular expression the final `utm_campaign` must match. An invalid regex is reported as a warning and ignored. |
| `defaultParams` | `{key, value}[]` | no | `[]` | Extra query parameters added to every generated link. Not used for grading. |

**ValueList** = `{ "values": string[], "locked": boolean, "labels": { [value]: string } }`

- `values` are stored already normalised under this file's casing/space rules. Readers should normalise on import anyway.
- `locked: true` means a value outside the list is an **error**, not a warning.
- `labels` are display names only. They never appear in URLs.

## Campaign pattern syntax

Tokens in `{braces}`, everything else literal:

| Token | Meaning |
|---|---|
| `{yyyy}` `{yy}` `{mm}` `{dd}` `{ww}` `{q}` | Today's year, 2-digit year, month, day, ISO week, quarter (`q4`). |
| `{date:FORMAT}` | Same tokens combined, e.g. `{date:yyyy-mm}`. |
| `{name}` | A free-text input called *name*, normalised with the file's rules. |
| `{name\|a,b,c}` | A dropdown called *name* with options a, b, c. |
| `{page_title}` `{domain}` `{path}` `{client}` `{user}` | Variables filled by the tool (page title, destination domain, destination path, `name`, the user's own name). |

When a token is empty, its preceding separator is dropped (`{a}_{b}_{c}` with b empty → `a_c`).

The extension's in-app formula syntax uses square brackets (`[date:yyyy-mm]_[product]`) so it never collides with ad-platform macros like `{campaignid}`. On import and export the extension converts between the two forms. A rules file always uses braces.

## Grading levels (shared vocabulary)

Both tools report each problem with one of three levels, shown as icon + word:

- **✕ Critical**: link will be misattributed or lost (invalid URL, missing required field, locked-list violation, GA4 `Unassigned`, UTMs after `#`).
- **! Warning**: likely mistake (casing, spaces, special characters, click IDs, `Paid Other`, paid-looking medium counted as organic, domain not allowed, campaign doesn't match pattern/regex, duplicate link).
- **✓ Pass**.

## Validation rules for readers

1. Reject if `type` ≠ `"tgf.utm-rules"` or `version` is missing or not an integer.
2. Reject if `version` > 1. Message: "This rules file was made with a newer version. Update the tool to import it."
3. Ignore unknown keys. Coerce wrong-typed optional keys to their defaults and report which were ignored.
4. File size limit: 256 KB. Values lists: 2,000 items each.
5. Never execute anything from the file. `campaign.regex` is compiled with `new RegExp()` inside try/catch only.

## Versioning

Additive, optional keys may be added within v1. Renaming or removing a key, or changing a meaning, requires `version: 2`. Readers keep accepting v1.
