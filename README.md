# TadhanaSMP

A complete Next.js App Router website for the TadhanaSMP Minecraft community. The cinematic homepage, 16 public pages, responsive gallery, edition-specific play guide, rank journey, and retained Discord API contracts use the supplied official branding and real community screenshots.

This is source code for manual GitHub and Vercel deployment. It has not been deployed to production. Authentication defaults to disabled; public pages build and run without a database or Discord secrets. Missing connection details, live status, announcements, store links, and rank requirements stay honest rather than showing invented values.

## Start locally

Install Node.js 24 LTS, then open a terminal in the `tadhanasmp` folder containing package.json:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The example environment contains harmless placeholders only. Do not enable authentication until the security and Discord checklists are complete. On Windows, copy .env.example to .env.local using your file manager rather than the `cp` command. Keep private environment files off GitHub.

```bash
npm run verify
```

This runs type checking, ESLint, 21 security/configuration unit tests, a production build, and a production HTTP smoke test. `npm run smoke` starts its own temporary production server and stops it afterward. Browser checks and external integration limits are documented separately in docs/QA_REPORT.md.

## Website routes

| Route                            | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `/`                              | Cinematic community introduction                              |
| `/our-story`                     | Filipino roots and community story                            |
| `/world`                         | Editorial archive of real builds and landscapes               |
| `/features`                      | Grounded survival/community feature guide                     |
| `/play`                          | Java and Bedrock instructions and connection details          |
| `/memories`                      | Search, category filters, accessible high-resolution lightbox |
| `/ranks`                         | Nine earnable gameplay ranks                                  |
| `/news`                          | Owner-approved announcements; honest empty state initially    |
| `/news/[slug]`                   | Published/historical articles only                            |
| `/rules`                         | Clearly marked proposed community guidelines                  |
| `/faq`                           | Practical joining and support questions                       |
| `/status`                        | Manual maintenance priority and approved live status          |
| `/support`                       | Official support route and gated Discord verification         |
| `/store`                         | Approved external merchant only; initially unavailable        |
| `/privacy`, `/terms`, `/cookies` | Privacy/terms drafts and factual necessary-cookie information |

Legacy `/about`, `/join`, and `/gallery` redirect permanently to `/our-story`, `/play`, and `/memories`. No events page is fabricated without real approved events. All eight original API paths remain, plus `/api/status`; see the source audit for contracts.

## Before public release

Confirm current Java/Bedrock addresses, ports, supported versions, maintenance state, Discord invite, socials, and canonical domain. Verify the retained Discord invite; its current validity was not established. Approve rules, image rights, legal/operator facts, and store details. Rotate potentially exposed credentials from the original shared Drive material before enabling integrations. Run database migration and OAuth/bot tests in staging with fresh credentials before production.

The candidate canonical URL remains `https://www.tadhanasmp.com`. Ownership and DNS have not been changed or verified. Development-only dependency findings are recorded in the security audit; a clean runtime audit does not certify the entire application.

## Owner guides

- [Existing source audit](docs/EXISTING_SITE_AUDIT.md)
- [Asset manifest](docs/ASSET_MANIFEST.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Content and configuration](docs/CONTENT_AND_CONFIG_GUIDE.md)
- [Security audit and secret rotation](docs/SECURITY_AUDIT_AND_SECRET_ROTATION.md)
- [Discord OAuth and OTP checklist](docs/DISCORD_OAUTH_AND_OTP_CHECKLIST.md)
- [Cookies, privacy, and terms review](docs/COOKIES_PRIVACY_TERMS_REVIEW.md)
- [Manual GitHub and Vercel deployment](docs/DEPLOYMENT_VERCEL_GITHUB.md)
- [QA report](docs/QA_REPORT.md)

Only npm is supported and package-lock.json is authoritative. Direct dependencies are pinned; Node stays on the supported 24.x LTS family. Original source archives remain in the supplied inputs; the distributable includes optimized selected screenshots, all 18 official branding originals, and complete inventory hashes. It excludes private source files, databases, installed packages, build output, and temporary QA routes.
