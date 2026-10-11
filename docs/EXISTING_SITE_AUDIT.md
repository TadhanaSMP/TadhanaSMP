# Existing site audit

Audit date: 11 October 2026. Source: the user-supplied Google Drive project, inspected read-only. This report describes the supplied source, not a penetration test of a live deployment.

## Scope and handling

The original project is a Next.js App Router application with one public homepage and eight API routes. The homepage composes navigation, hero, about, features, gallery, Discord verification, and footer sections. Safe application source, package metadata, and the Prisma schema were inspected. The private environment file, credential setup notes, database file, dependency caches, and generated build output were not downloaded or opened. No production database, bot account, OAuth application, repository, deployment, or DNS configuration was changed.

The Drive listing includes private environment and local database files alongside public source. Their contents were not needed to build the replacement. The owner should review sharing and rotate credentials that have been exposed; see SECURITY_AUDIT_AND_SECRET_ROTATION.md. This delivery never reuses those values.

## Original structure

| Area                  | Observed source                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| Framework             | Next.js 16.3.0, React 19 range, TypeScript 5.7.3                                                |
| Rendering             | App Router, one public app/page.tsx, app/layout.tsx, global CSS                                 |
| Styling/UI            | Tailwind 4, custom sections, lucide icons, shadcn/Base UI dependencies                          |
| Authentication        | Discord authorization code flow; signed HS256 JWT stored in an HTTP-only cookie                 |
| Database              | Prisma 6 range; PostgreSQL; OTP model                                                           |
| Verification          | Website issues a ten-minute code; bot redeems it; website checks proof and assigns a guild role |
| Analytics             | Vercel Analytics rendered in production                                                         |
| Dependency management | Both npm and pnpm lockfiles present; several ranged dependencies                                |
| Agent instructions    | AGENTS.md requires reading installed Next.js documentation before framework edits               |

The public homepage uses anchor navigation. No dedicated world, ranks, news, legal, status, support, or play pages are present in the inspected original app directory. The new website expands that structure into dedicated routes and preserves the integration endpoints below.

## Original API contracts

These paths are compatibility requirements. The original names are intentionally retained; clients must not be redirected to an unrelated normalized path.

| Method and path                | Original input                                                                             | Original response/behavior                                                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET /api/config                | None                                                                                       | 200 JSON { invite: string }                                                                                                                                                                                                |
| GET /api/auth/discord/login    | None                                                                                       | Sets discord_oauth_state cookie for 600 seconds; redirects to Discord. Missing configuration: 503 JSON with error discord_not_configured and a message.                                                                    |
| GET /api/auth/discord/callback | OAuth code, state, optional error query                                                    | Validates state, exchanges code, creates session, then redirects to /#verify. Failure redirects include auth=error, auth=state_mismatch, or auth=exchange_failed.                                                          |
| GET /api/auth/me               | Session cookie                                                                             | 200 { user: null }, or user with discordId, username, displayName, avatar URL, and verified.                                                                                                                               |
| POST /api/auth/logout          | Session cookie                                                                             | 200 { ok: true }; removes cookie.                                                                                                                                                                                          |
| POST /api/auth/otp/generate    | Authenticated session                                                                      | 200 { success: true, otp, expiresIn: 600, instructions }. Unauthenticated: 401 { error: "not_authenticated" }. Server failure: 500 { error: "failed_to_generate_otp" }.                                                    |
| POST /api/verify               | Authorization: Bearer VERIFICATION_API_SECRET; JSON { otp: string, discordUserId: string } | 200 { success: true }, or 200 { success: false, error }. Missing/wrong authorization: 401; throttled: 429; unexpected failure: 500.                                                                                        |
| POST /api/auth/verify          | Authenticated session                                                                      | 200 { status: "not_in_guild", verified: false }, { status: "pending_verification", verified: false }, or { status: "verified", verified: true }. Unauthenticated: 401 not_authenticated; failure: 500 verification_failed. |

Original bot validation error names include INVALID_OTP, OTP_EXPIRED, OTP_ALREADY_USED, and DISCORD_ACCOUNT_MISMATCH. The hardened implementation intentionally combines invalid, expired, used, and mismatched code failures into INVALID_OTP, retaining the HTTP 200 success:false contract without disclosing account or code state. Bot integrations should branch on success rather than exposing private state to users.

The generator's original instruction is “Send this code to the TadhanaSMP Discord bot via DM to verify your account.” Discord snowflakes remain strings; converting them to JavaScript numbers would lose precision.

## Original environment names

The inspected application reads DATABASE_URL, SESSION_SECRET, VERIFICATION_API_SECRET, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_VERIFIED_ROLE_ID, and public DISCORD_INVITE_URL. These names must remain compatible. The replacement adds explicit feature/configuration gates rather than retrieving private settings from the supplied project.

The original redirect fallback is /api/auth/discord/callback on the request origin. The original public invite fallback is https://discord.gg/NRYyTXShcB. Source-level retention does not establish that the invite is currently active.

## Security findings in the original source

| Finding                                         | Evidence and implication                                                                                                                                 | Required remediation                                                                                                                                                                    |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plaintext OTP persistence                       | createOTP writes the actual code to the unique code column despite a comment saying only hashes are stored.                                              | Store an unrelated redaction value in that legacy column and a keyed digest in codeHash. Redact historical plaintext with an explicit owner-run migration script.                       |
| Biased short code generation                    | Four random bytes are converted to base 36, padded, and truncated to five characters. The result is not uniformly sampled from the five-character space. | Uniformly sample the full space with crypto.randomInt; keep ten-minute expiry and strong server-side throttling.                                                                        |
| Non-atomic redemption                           | findUnique, checks, and update are separate operations. Concurrent requests can both report success.                                                     | Redeem with a conditional atomic database update where unused, unexpired, hash and Discord identity all match.                                                                          |
| Proof erased during issuance                    | New-code issuance deletes every OTP record for that Discord identity, including used verification proof.                                                 | Delete only unused codes and serialize issuance for an identity. Preserve proof according to an approved retention/revocation policy.                                                   |
| Process-local rate limiting                     | A Map holds rate-limit counters. Different server instances do not share them. Generation has no issuance throttle.                                      | Persist atomic shared limits in PostgreSQL and add user-bound issuance and verification limits.                                                                                         |
| OAuth token in browser cookie                   | SessionData includes accessToken; HS256 signs the payload without encrypting it. The cookie payload is readable if obtained.                             | Keep only an opaque random session token in the cookie; retain a hashed server-side identifier and minimal user fields in the database. Discard/revoke transient Discord access tokens. |
| Logout lacks server-side revocation             | Removing a JWT cookie does not invalidate a stolen JWT.                                                                                                  | Revoke the server-side session when logging out and enforce expiry.                                                                                                                     |
| Request-derived redirect origin                 | OAuth login and callback use request.nextUrl.origin as fallback.                                                                                         | Require a trusted configured site origin and exact callback URL.                                                                                                                        |
| Mutation Origin checks absent                   | Website generation, verification, and logout do not validate Origin.                                                                                     | Validate exact trusted same-origin requests for cookie-authenticated mutations.                                                                                                         |
| OAuth state cleanup incomplete                  | Callback returns early for error or missing code before clearing the state cookie. State comparison is ordinary string comparison.                       | Consume/clear state on callback attempts; enforce format, expiry, and constant-time comparison.                                                                                         |
| Unbounded external API waits                    | Discord fetches lack explicit timeout and redirect policy.                                                                                               | Use short timeouts, no-store responses, and reject external redirects.                                                                                                                  |
| Broad OAuth scope                               | Original scope is identify guilds, while membership is queried by the bot.                                                                               | Use identify only unless another approved feature requires additional scope.                                                                                                            |
| Expired-code cleanup removes proof              | cleanupExpiredOTPs deletes all expired records, including used proof.                                                                                    | Keep proof until an approved retention or revocation action; clean only expired unused OTPs automatically.                                                                              |
| Cookie lifetime                                 | Original JWT/session cookie lifetime is seven days.                                                                                                      | Document the replacement's shorter lifetime and server-side expiry/revocation.                                                                                                          |
| Authentication/OTP response caching unspecified | Original handlers do not consistently set explicit private no-store headers.                                                                             | Apply private no-store behavior to identity, OAuth, and OTP routes.                                                                                                                     |

OTP codes still have a small guess space by design. Keyed hashing limits offline attack value if the database alone is exposed; it does not replace strict online attempt limits. Atomic pure-unit tests are useful but do not prove PostgreSQL behavior or a successful Discord role grant. Staging end-to-end verification remains necessary.

## Content and visual findings

The original homepage contains numeric claims of 1,200+ members, 24/7 uptime, and three seasons. It also mentions no reset anxiety, custom dungeons, seasonal quests, and events without an accompanying source of current operational truth. The replacement omits unsupported numeric/uptime guarantees and does not invent events, testimonials, rank thresholds, launch dates, or store inventory.

Original feature headings include Custom Bosses, Active Community, Economy, Casual Friendly, Crossplay, and Server Custom Shops. These are prior website copy, not proof that each subsystem is currently active. The user-supplied master brief controls the replacement's approved feature direction. Platform addresses, supported versions, live counts, maintenance, premium rank availability, and merchant links require owner configuration.

Original gallery entries use six generic local images with descriptive captions including dungeon/event claims. The replacement uses the supplied world screenshot archive and an explicit asset manifest. Captions describe visible archived scenes rather than claiming a current event or biome condition.

Original official links retained from source are the Discord invite above, Facebook https://www.facebook.com/profile.php?id=61593644497556, and TikTok https://www.tiktok.com/@tadhanasmp. No new social account or merchant destination is invented. Current external availability is not confirmed by source inspection.

The original root wrapper hides horizontal overflow. The replacement should resolve layout overflow at its source and verify narrow layouts, rather than use clipping to conceal it. The original gallery supports arrow keys and Escape but uses a custom overlay. The replacement requires a modal dialog, contained full image, clear accessible labels, touch support, and focus restoration.

The original production layout includes optional analytics. The replacement defaults to no optional analytics and documents only necessary cookies. Privacy, terms, rules, merchant, and legal/operator details remain owner-review drafts until approved.

## Change strategy and operational limits

The source refactor is justified by dedicated page architecture, configurable public data, supplied official assets, and the authentication findings above. Existing database OTP fields are preserved for compatibility; session and shared-rate-limit tables are additive. An existing database requires backup, schema comparison, and explicit migration baselining before deployment. No destructive automatic database migration should run as part of a frontend build.

Public pages can run without database or Discord credentials. Authentication must remain disabled until new credentials, trusted callback configuration, migrations, bot permissions, retention decisions, and staging success are confirmed. The package's security and OAuth checklists describe those owner actions.

This audit does not certify production security, legal compliance, Minecraft policy compliance, current community statistics, live server availability, or successful OAuth/Discord verification. Those require the respective owner approvals and real integration checks.
