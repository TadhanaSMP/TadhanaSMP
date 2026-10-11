# TadhanaSMP V2

Complete Next.js 16 / React / TypeScript source for manual GitHub and Vercel deployment. No direct upload or deployment was performed.

V2 preserves the cinematic original branding, real community screenshots and existing authentication API contracts. It adds independent Java/Bedrock monitoring, a secure Discord announcement receiver and feed, both public rules views, exact rank thresholds and official store links. Missing integrations are clearly labeled.

## Start

Install Node.js 24 LTS. Open a terminal in the folder containing package.json. On Windows copy .env.example to .env.local through your file manager.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. .env.example contains placeholders. AUTH_ENABLED=false and ANNOUNCEMENTS_ENABLED=false are safe defaults. Public pages work without a database or Discord secrets.

```bash
npm run verify
node scripts/relay-security-smoke.mjs
```

Verification runs type checks, lint, 37 unit tests, production build and a temporary production HTTP smoke server. The separate relay smoke uses generated test credentials and rejects requests before database access. Neither script needs production secrets. Browser and integration limits are in docs/QA_REPORT.md.

## Routes

| Route | Purpose |
| --- | --- |
| / | Cinematic home and announcement excerpts |
| /our-story | Community story |
| /world | Real build showcase |
| /features | Gameplay guide |
| /play | Java/Bedrock join and copy instructions |
| /memories | Gallery, search, filters and accessible viewer |
| /ranks | Nine gameplay ranks and three optional premiums |
| /news | Discord mirror and editorial archive |
| /news/[slug] | Approved editorial articles only |
| /rules | Both public rules collections |
| /rules/server | Server Rules |
| /rules/staff | Staff Rules |
| /faq | Help and troubleshooting |
| /status | Independent edition probes and separate maintenance |
| /support | Support and gated Discord verification |
| /store | Official external merchant information |
| /privacy, /terms, /cookies | Policy drafts and cookie facts |

/about, /join and /gallery retain permanent redirects. All eight original API paths remain. New public read APIs: /api/server-status and /api/announcements. /api/status remains compatible. New private signed receiver: /api/announcements/ingest. No admin dashboard, fake checkout or fake player data.

## Before launch

Read START_HERE.md. Java is play.TadhanaSMP.com. Bedrock uses the same hostname and port 25706. Store is https://store.tadhanasmp.com. Confirm live availability, current supported versions, DNS, invite validity and actual CMI/store settings. Rule text requires approved source messages. Legal pages require operator facts and review. Revoke the exposed incoming Discord webhook and rotate potentially shared credentials.

The existing bot must be extended on its own host using scripts/discord-announcement-relay.mjs and a durable retry queue. A backed-up Postgres database needs the additive migration before enabling the receiver. Authentication has a separate staging checklist. No migrations or live bot changes were made here.

## Guides

- docs/DEPLOYMENT_VERCEL_GITHUB.md
- docs/CONTENT_AND_CONFIG_GUIDE.md
- docs/SERVER_STATUS_SETUP.md
- docs/DISCORD_ANNOUNCEMENTS_SETUP.md
- docs/PUBLIC_RULES_SYNC.md
- docs/RANK_SOURCE_AND_SYNC.md
- docs/WEBHOOK_SECRET_ROTATION.md
- docs/SECURITY_AUDIT_AND_SECRET_ROTATION.md
- docs/DISCORD_OAUTH_AND_OTP_CHECKLIST.md
- docs/COOKIES_PRIVACY_TERMS_REVIEW.md
- docs/ASSET_MANIFEST.md
- docs/EXISTING_SITE_AUDIT.md
- docs/DESIGN_SYSTEM.md
- docs/QA_REPORT.md

Use only npm and package-lock.json. Node is pinned to 24.x, dependencies use exact versions and Prisma generation is included. Vercel uses Next.js preset, npm ci, npm run build and default output directory. GitHub CI is supplied but has not run on GitHub.

The ZIP excludes credentials, private environments, databases, installed dependencies, .next, logs and temporary QA routes. Source snapshots and audit history do not certify real integrations or current browser behavior.
