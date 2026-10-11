# V2 configuration update

V2 overrides earlier unconfirmed-address guidance below. src/config/server.ts confirms play.TadhanaSMP.com for Java and Bedrock, Bedrock port 25706, no explicit Java display port. src/config/store.ts owns the exact official merchant. src/config/community.ts owns public guild/channel IDs. src/data/ranks.ts contains the owner-confirmed V2 snapshot with all thresholds. Keep actual CMI/store reconciliation separate from the snapshot.

Update reviewed rule data in src/data/rules.ts, with actual source message IDs, reviewed flags and revision dates. Bot announcement setup is separate from OAuth and requires ANNOUNCEMENTS_ENABLED and a private DISCORD_INGEST_HMAC_SECRET. STATUS_SOURCE defaults to mcstatus, not a blank custom endpoint. Maintenance notice and scheduled maintenance are independent of online/offline probes. See the five V2 setup guides for current instructions.

## Retained V1 editing reference

# Content and configuration guide

## Edit verified values in one place

Copy .env.example to a private .env.local for local work, or set variables in Vercel Project Settings for the correct environment. Redeploy after environment changes: public pages are mostly prerendered and need a new build for updated connection copy and maintenance banners. Do not use NEXT_PUBLIC variables for private integrations. Public configuration is explicitly whitelisted by src/config/server.ts.

| Variable                | Meaning / default                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| SITE_URL                | Candidate `https://www.tadhanasmp.com`; verify ownership/DNS. Origin must match enabled OAuth callback.                       |
| JAVA_ADDRESS            | Verified hostname/IP only, without protocol or port; empty shows “currently being updated.”                                   |
| JAVA_PORT               | Optional separate integer 1–65535; appended only to the Java copy value.                                                      |
| BEDROCK_ADDRESS         | Verified hostname/IP only, no protocol or port.                                                                               |
| BEDROCK_PORT            | Required separate integer 1–65535 for usable Bedrock details. Never reuse Java’s port by assumption.                          |
| MINECRAFT_VERSIONS      | Approved current client range; empty directs players to announcements.                                                        |
| MAINTENANCE_MODE        | Literal true shows maintenance in hero, status, and play guide.                                                               |
| MAINTENANCE_NOTICE      | Approved notice; no invented reopening date.                                                                                  |
| DISCORD_INVITE_URL      | Original source variable retained. Default invite came from the source and needs current verification.                        |
| DISCORD_INVITE_ACTIVE   | false hides invite CTAs; default true preserves the original link.                                                            |
| STORE_URL               | Current verified HTTPS external merchant link.                                                                                |
| STORE_ACTIVE            | Literal true exposes the configured official merchant. Default false.                                                         |
| PREMIUM_RANKS_PUBLISHED | Literal true, active store, and valid URL are all required before prices appear. Default false.                               |
| STATUS_ENDPOINT         | Owner-approved public HTTPS JSON status service; empty returns unknown. Private/internal hosts are rejected by a basic guard. |
| AUTH_ENABLED            | Default false; enable only after fresh credentials and staging checks.                                                        |

Address validation rejects whitespace, protocols, embedded ports, paths, and markup. IPv6 uses bracketed notation. Ports are separate values. The website does not check Minecraft connectivity itself. A valid URL is a syntax check, not evidence that an invite or merchant is authorized or working.

## Typed content files

| File                   | What to edit                                                                                                    |
| ---------------------- | --------------------------------------------------------------------------------------------------------------- |
| src/config/site.ts     | Name, tagline, canonical fallback, locale, social preview, legal/rules approval flags, operator/privacy details |
| src/config/server.ts   | Public environment whitelist, fallbacks, publication gates                                                      |
| src/config/socials.ts  | Official social URLs; verify current ownership                                                                  |
| src/data/navigation.ts | Desktop, mobile, and footer destinations                                                                        |
| src/data/features.ts   | Approved feature descriptions; no unverified plugin or active-event claims                                      |
| src/data/ranks.ts      | Nine free ranks, approved requirement/perk text, premium PHP prices and one-month duration                      |
| src/data/gallery.ts    | Captions, alt text, categories, visibility, derivative sizes, dimensions, focal positions                       |
| src/data/updates.ts    | Approved article content and publication state                                                                  |
| src/data/faq.ts        | Practical answers and edition troubleshooting                                                                   |
| src/data/rules.ts      | Approved rules, initially proposals                                                                             |

Rank requirements and perks are null until approved. Preserve NewComer, Traveler, Settler, Explorer, Adventurer, Pioneer, Guardian, Champion, and Vanguard. Premium defaults reflect previously supplied one-month PHP 199/299/499 values but remain hidden until the owner re-verifies current products and terms. Editing an amount does not update the merchant; coordinate both.

Add an announcement with a unique URL-safe slug, title, summary, paragraph array, state, and an optional real publication date. Only published/historical states appear publicly; scheduled/postponed posts have no live detail route. Do not infer an event date from an image filename. There are no fabricated initial posts.

## Status integration

The approved service should return:

```json
{ "online": true, "players": 12, "maximum": 100 }
```

The values above illustrate the schema only; they are not server statistics. online must be boolean; optional counts must be nonnegative safe integers. Missing/malformed data, non-2xx responses, redirect attempts, or timeout produce unknown. Offline data does not show counts. Fetch timeout is five seconds and cache TTL is 30 seconds, including failures; in-flight requests are deduplicated per instance. Multi-instance caches are independent and are suitable only for read-only status, never authentication or rate limits.

Manual maintenance wins before consulting a cache or endpoint and shows no stale player count. Never configure RCON, a hosting panel, private network address, credentials in a URL, or an arbitrary user-supplied status URL. The basic private-host guard is not a DNS-rebinding defense; use a known service controlled/approved by the operator.

## Replace a screenshot

Obtain permission and inspect the full image first. Keep the original in your private asset archive. Export WebPs at 640/1280/1920 where the source is at least that wide, with no upscaling. Name derivatives `{id}-{width}.webp` under public/images/memories. Update the item’s original width/height, sizes array, alt text, literal caption, category, and focal position. Set visible:false to remove it from the gallery. A homepage/world id also needs updating where referenced by WorldImage; hidden gallery items may still be explicitly featured.

Use contain for player groups, and inspect both phone and desktop crops for landscapes. Update ASSET_MANIFEST.md and asset-inventory.json with source, permission/review, hashes, and assigned page. Do not treat downloaded artwork as a server screenshot. Events is omitted because no event provenance was verified.

## Replace branding

Use official transparent variants. The current cropped wordmark is 1100×449 and crest 492×512; preserve their aspect ratios and alpha. Update the dimensions in Navigation/Footer or the relevant Image usage if the new files have a different ratio. Keep the exact supplied favicon32 and Apple180 variants unless a newly approved icon set replaces them. Update the 1200×630 social preview deliberately and check its appearance. Do not stretch or invent a replacement logo.

## Private integration variables

DATABASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_VERIFIED_ROLE_ID, SESSION_SECRET, and VERIFICATION_API_SECRET stay server-side. Names are preserved from the original source. Keep secrets in environment settings or a password manager, never chat, screenshots, shared source files, or public bundles. Use separate staging and production credentials and database. Rotation/migration procedures live in the security and Discord checklists.

## Policies and launch copy

The privacy and terms pages are drafts and noindex until reviewed. Fill operator/contact facts and revise the actual policy text after legal/processing review; changing a flag alone does not complete a policy. Set rulesApproved only after the server team accepts the exact text. Approval flags also affect sitemap membership. Optional trackers are absent. Adding them requires real consent controls and policy changes before installation, not a decorative banner.
