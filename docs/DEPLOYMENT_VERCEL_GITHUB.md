# Manual GitHub + Vercel deployment

No GitHub push, Vercel deployment, migration, domain switch, or DNS change was performed for this source package. These are owner steps for the completed code. Begin with public-only staging; authentication remains disabled until its checklist passes.

## 1. Prepare the source

Extract TadhanaSMP-Website-Source.zip. Open the tadhanasmp folder containing package.json. Install Node.js 24 LTS. Vercel’s [official supported-runtime page](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) lists 24.x; package.json fixes that major rather than an open-ended engine range.

```bash
npm ci
npm run verify
```

The lockfile is package-lock.json only. Direct versions are pinned. Prisma Client is generated after installation and before builds, without querying a database or running migrations. The public build works with AUTH_ENABLED=false and no database. Read the security audit’s remaining development-tool advisory before release.

## 2. Create a GitHub repository

Create an owner-controlled private repository initially. Upload/commit the contents of tadhanasmp so package.json is at the repository root, or deliberately keep the folder and select it as Vercel’s Root Directory. Include src, public, prisma, scripts, tests, docs, README, AGENTS, package.json, package-lock.json, tsconfig.json, eslint.config.mjs, next.config.mjs, vercel.json, .gitignore, .nvmrc, and .env.example. Ensure your file manager displays the configuration files when preparing the upload.

Do not upload .env.local or any other private environment, node_modules, .next, .vercel, old Drive setup documents, database files/exports, access tokens, logs, or temporary QA endpoints. The supplied ZIP excludes them. If you already have a repository, review a branch and diff rather than overwriting its history or integrations blindly.

## 3. Import into Vercel

Use Add New Project and import the correct GitHub repository under the intended account/team. Confirm the project root and these settings:

| Setting          | Value                             |
| ---------------- | --------------------------------- |
| Framework preset | Next.js                           |
| Root Directory   | Folder containing package.json    |
| Node.js version  | 24.x                              |
| Install Command  | npm ci                            |
| Build Command    | npm run build                     |
| Output Directory | Default; do not enter dist or out |

The checked-in vercel.json already provides framework/install/build commands and intentionally has no Output Directory override. This is a real App Router application with API handlers, not a static export.

## 4. Configure environments

For a first preview, set AUTH_ENABLED=false, keep STORE_ACTIVE=false and PREMIUM_RANKS_PUBLISHED=false, and use the preview’s approved canonical strategy. Add verified public variables from .env.example: SITE_URL, edition addresses/ports, versions, maintenance, DISCORD_INVITE_URL/ACTIVE, optional approved status endpoint, and social/content configuration. Never add private values with NEXT_PUBLIC prefixes. Environment changes require a new deployment because many pages are prerendered.

When preparing authentication, configure the nine private integration variables only in the intended Vercel environment. Use new credentials, a separate staging database, and a stable staging callback. Review exposure/rotation first. Run reviewed migrations separately against the correct database before enabling auth; builds must not migrate production automatically. Read DISCORD_OAUTH_AND_OTP_CHECKLIST.md and follow its fresh/existing database distinction.

## 5. Verify the preview

Check all 16 public routes, permanent legacy redirects, missing-page behavior, icons/social preview, mobile and desktop menus, Java/Bedrock details, real copy success/fallback, gallery categories/search/empty results/lightbox/arrows/Escape/focus, rank tabs, FAQ, cookie preferences, and reduced motion. Confirm maintenance overrides status and there is no fake player count or unapproved product pricing.

Confirm HTTPS and security headers. Test metadata/canonical links on actual URLs. Review noindex draft rules/privacy/terms/store/support, sitemap, robots, and external destinations. Open the retained Discord invite to establish current validity. Run the full OAuth/bot/role/expiry/replay/concurrency/limit checklist against staging before enabling production credentials.

The local QA report does not replace this environment-specific verification. Serverless Postgres behavior, deployment protection, real Clipboard permissions, Discord permissions, and domain configuration can differ from local QA.

## 6. Connect the established domain deliberately

The candidate is https://www.tadhanasmp.com, retained from the brief. Ownership, active DNS, apex/www redirects, and the actual production hostname have not been verified. Confirm them before changing anything. Add the confirmed domain in Vercel, follow its exact current DNS instructions at the registrar, confirm a valid certificate, and choose one canonical origin with redirects from the alternate only after approval.

Set SITE_URL to that origin, align the registered Discord callback and DISCORD_REDIRECT_URI, and redeploy. Do not move or rename the community’s main domain by assumption. Check HTTPS cookies and deep-link redirects after the domain change. HSTS is production-only and excludes subdomains; verify HTTPS before publication.

## 7. Release and maintain

Approve image rights, rules, legal facts/policies, addresses, features, socials, announcements, and current store terms. Remove review notices only after the actual text is approved. Release the tested commit through Vercel’s Git workflow and inspect deployment/build/function logs without exposing private request content. Keep a last-known-working source/build and a tested database backup.

For rollback, disable authentication first when integrations are uncertain, then roll back the website to an approved build while maintaining the compatible additive schema. Do not restore insecure legacy sessions or drop retained data to resolve an error. Database restoration/rollback requires the owner’s provider-specific plan. Review dependency updates and the nonzero development-tool audit before future releases.

## Common fixes

| Symptom                          | Check                                                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Next/package not found           | Correct Root Directory and npm ci; package.json at selected root                                                |
| Stale lockfile/install failure   | Keep one npm lockfile; regenerate locally with the pinned compatible package set and retest                     |
| Expected dist/output missing     | Remove Output Directory override; use Next.js preset                                                            |
| Prisma Client missing            | postinstall/prisma generate completed; installed packages are allowed to execute their reviewed install scripts |
| Callback/login unavailable       | AUTH_ENABLED plus all private settings, long secrets, valid ids, exact SITE_URL callback                        |
| Origin failure                   | Browser URL origin equals SITE_URL; preview and production settings are separate                                |
| Status unavailable               | Endpoint approved/HTTPS/schema/timeout; unknown is intentional when no endpoint exists                          |
| Old addresses/notices after edit | Redeploy to rebuild prerendered public content                                                                  |
