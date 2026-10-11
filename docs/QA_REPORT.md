# V2 verification report

11 October 2026. Source delivery for manual GitHub and Vercel upload. No deployment, GitHub push, game-server change, bot-host change, DNS change or database migration was performed.

## Implemented

Retained cinematic V1 design, official branding, all 64 public image files, curated 16-screenshot gallery, keyboard/touch lightbox, cookie preferences and eight legacy authentication API paths. Restored confirmed Java address, Bedrock address/25706, independent monitoring, public Server Rules and Staff Rules routes, exact official merchant link, all nine rank thresholds and three monthly PHP premium prices. Added signed bot receiver, durable nonce/rate controls, database feed, edit/delete tombstones, safe Markdown subset, bot adapter, setup guides and CI workflow.

Two new rule routes bring the public page total to 18, plus retained redirects and the editorial article route. Rules are incomplete because no approved source text was supplied. Authentication and announcement ingestion default to disabled. The announcement feed reports pending configuration, never invented posts.

## Final run evidence

- TypeScript and ESLint passed.
- 37 unit tests passed: retained auth/OTP/contrast cases plus HMAC/body/time/nonce binding, wrong channel, credential filtering, tombstone ordering, complete rank snapshot, status zero-player/partial-failure/cache/429/timeout/oversize cases.
- Production Next.js webpack build passed with Prisma generation. No database operation occurs during build.
- Production route smoke and signed receiver rejection smoke are included in scripts. Final run passed 181 HTTP smoke assertions across 18 public pages and eight signed receiver rejection cases. Counts are also recorded in RELEASE_CHECKS.json.
- All 64 public images decoded successfully with Pillow. Original asset manifests/hashes remain retained.
- Runtime dependency audit: zero findings. Full dependency audit: four high findings in the development-only Next lint plugin/fast-glob/micromatch/braces chain. No forced framework downgrade. See security audit.
- Source/package review excludes private environments, databases, logs, node_modules, build output, source maps and temporary QA routes. No known credential values were copied from the original reference.

## Browser and responsive verification limits

V1 browser evidence is retained in V1_QA_HISTORY.md and responsive-qa-results.json. It covers 16 pages at 320/375/390/430/768/1024/1440/1920 widths and navigation/gallery/cookie/copy/rank controls on that earlier source. Do not treat historical evidence as a completed final V2 browser audit.

This resumed environment has no supported browser-control skill. The Sites skill explicitly forbids installing a browser or improvising browser automation in this managed container. Therefore no new browser server, fresh V2 screenshot, interactive responsive audit, screen-reader run or Lighthouse score was produced. New modules use constrained grids, wrap long content, native buttons and labels, escaped React text, independent status labels and the retained reduced-motion CSS. These source checks are not a substitute for browser testing.

Before public release, test all 18 pages at all eight widths, especially the longer rank metric panels, Discord excerpts/paging, status cards, both rule tabs, mobile menu, real copy permissions, keyboard focus, reduced motion and external links. Existing fixtures are private test files and are not public routes.

## External setup and unverified behavior

Live mcstatus endpoints, canonical domain and store were inaccessible through the web tool in the final resumed run. Provider API documentation was read and schema rechecked. No fresh online/offline/checkout claim follows. Current rank sheet retrieval failed, so values use the explicit owner-confirmed V2 snapshot. Reconcile active CMI/store settings before launch.

Existing bot code and real Postgres credentials were not supplied. Receiver signature failures were tested before database access. Actual writes, nonce replay, shared rate limits, transactional concurrency, bot delivery, downtime backfill, deletions during outages and credential rotation need a staging database and bot host. Default feed is pending. Attachments remain Discord-only until approved rights and durable image handling exist.

Approved Server Rules and Staff Rules message exports, operator/legal details, policy retention, image rights and live authentication remain owner actions. Rotate the exposed incoming webhook and any potentially shared credentials before enabling integrations. See START_HERE.md.
