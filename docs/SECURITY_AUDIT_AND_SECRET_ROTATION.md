# Security audit and secret rotation

Reviewed 11 October 2026. This is a source/architecture review and a record of local checks, not a penetration-test certification. The original Drive source was read selectively; private environments, sensitive setup documents, databases, and live credentials were not fetched.

## Required credential response before integrations go live

The supplied brief identifies .env.local and documentation in the shared Drive export as potential credential exposure. Removing a value from a document does not revoke it. The owner must review access/sharing and rotate potentially exposed credentials through the service owners before production authentication is enabled. No actual secret values are reproduced here or in the source ZIP.

1. Keep AUTH_ENABLED=false while coordinating the change. Confirm ownership of the website, bot, Discord application, database, and shared files.
2. Review shared Drive permissions and Git history; restrict/remove credential-bearing setup documents and private environments from shared/public locations. Review OTP_SETUP, QUICK_REFERENCE, IMPLEMENTATION_SUMMARY and similar documents locally, without publishing values.
3. Generate a new VERIFICATION_API_SECRET and coordinate bot/website updates. Deploy both while verification is disabled, test staging, then enable together. Never reuse the shared value.
4. Rotate potentially exposed DISCORD_BOT_TOKEN and DISCORD_CLIENT_SECRET through Discord, then update only their private environment settings.
5. Rotate SESSION_SECRET. Existing opaque sessions and unused OTP hashes become invalid; require fresh sign-in/codes. Legacy JWT cookies are already rejected. Review/delete obsolete session records as appropriate.
6. Review/rotate DATABASE_URL credentials and access privileges if exposed. Validate pool/direct migration connection choices with the database provider. Restrict database access and retain a tested backup/restore plan.
7. Review original server logs and source history for leakage. Do not attach tokens, codes, full request headers, private database exports, or credentials to support reports or monitoring.

## Source changes

| Original finding                                   | Implemented treatment                                                                                                                                                                  |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plaintext OTP stored despite a hash comment        | New rows keep a HMAC-SHA256 hash and unrelated redacted_UUID legacy placeholder. A separate dry-run redaction tool covers old plaintext.                                               |
| Biased base36 string slicing                       | crypto.randomInt over 36^5 gives a uniform five-character code, preserving the original bot format.                                                                                    |
| Read/check/update redemption race                  | Single database updateMany includes keyed hash, Discord binding, unused state, and future expiry; one affected row means success.                                                      |
| In-memory serverless rate map                      | Shared PostgreSQL atomic fixed-minute counters; user-bound limits supplement caller hints.                                                                                             |
| No issuance limit / overlapping codes              | Three issuance attempts per user/minute; PostgreSQL advisory transaction lock serializes replacement of that user’s unused codes. Used proof is retained.                              |
| Discord access token in readable signed JWT cookie | 256-bit opaque session token; only its keyed hash and sanitized identity reside in the database. Discord access token is transient, best-effort revoked, and never stored in a cookie. |
| Logout without persistent revocation               | Enabled logout deletes the session row and expires the cookie; no legacy JWT decoding.                                                                                                 |
| Request-host-derived callback origin               | SITE_URL and exact registered redirect determine origin/path. Incoming Host does not choose a redirect destination.                                                                    |
| Missing CSRF origin check for browser mutations    | Exact Origin checks on logout, OTP issuance, and verification. OAuth uses random state bound to an HttpOnly cookie and clears state on callback.                                       |
| Revealing OTP error distinctions                   | Original /api/verify success/boolean contract retained; wrong-user, expired, used, and nonexistent codes return the same INVALID_OTP result.                                           |
| Potential privileged client calls                  | Bot secret/token, OAuth secret, database access, and role management are imported through server-only modules.                                                                         |

## Boundaries and defaults

AUTH_ENABLED is false by default. Readiness requires all nine private integration variables, long session/bot API secrets, valid Discord identifiers, and an exact callback origin/path. Private routes return unavailable before querying a database when configuration is absent. Public /api/config contains a whitelist and retains the original invite field. No NEXT_PUBLIC secrets, private source maps, public debugging routes, payment forms, or fake authentication are shipped.

Cookie flags are HttpOnly, host-only, SameSite=Lax, Path=/, and Secure in production. OAuth state lasts ten minutes; sessions last 24 hours. Identify is the only requested OAuth scope. Bot membership lookup/role management use fixed Discord API paths with a five-second timeout, no redirects, and no-store. A role is granted only after bound used OTP proof; an already-granted official role remains authoritative. Configure least-privilege bot permissions and a role below the bot’s own role, never Administrator by convenience.

The bot must derive discordUserId from the actual Discord sender. It must not trust a user-entered identifier. /api/verify requires a constant-time Bearer secret comparison, JSON bounded to 2KB, strict code/id formats, a 60/minute caller support limit, and a 5/minute Discord-user limit. Generate is 3/minute per user, check is 12/minute, login is 8/minute per caller hint, callback 12/minute. Limits fail closed on database failures. IP-like forwarding headers are only abuse hints and must never become authorization. Fixed windows permit bursts across boundaries; review stricter limits with traffic.

Five base36 characters provide about 25.85 bits of code entropy, not a high-entropy account credential. The short format remains for bot compatibility and relies on private bot authorization, identity binding, short expiry, atomic redemption, and limits. A longer coordinated format is a sensible future change after both services are updated. Unit tests use a repository double to verify one atomic operation and concurrent-one-winner semantics; real PostgreSQL concurrency and rate limits still require staging tests.

## Data preservation, redaction, and revocation

The original OTP schema/records are retained. Migrations add WebSession and RateLimitBucket; they do not drop/reset user data. Fresh databases run the baseline. Existing databases must first back up, verify exact schema equivalence, mark the baseline as applied, and then run the additive migration. Never run db push/reset to make an error disappear. No database operation was applied during this task.

Run `npm run db:redact-legacy` for counts only. After reviewing a backup and count, `npm run db:redact-legacy -- --apply` replaces legacy code plaintext with a per-record placeholder while retaining used verification proof. HMAC differs from the original unkeyed hash, so old unused codes cannot be redeemed by the new implementation and should be regenerated. Existing used proof remains usable unless deliberately revoked.

Run `npm run db:cleanup` for dry-run counts; `npm run db:cleanup -- --apply` deletes expired sessions, rate buckets, and expired unused codes only. It does not delete used proof. Schedule a reviewed cleanup through an operator-controlled job; no unattended production deletion is installed automatically.

Used proof has no approved retention period yet. For staff revocation, remove the Discord role, used OTP proof, and relevant website sessions together. Otherwise retained proof may grant the role again. Approve retention/data-request procedures before enabling auth. Expiry does not equal physical deletion.

## Headers, status service, and remaining limitations

Production sends CSP, nosniff, frame-ancestors none/X-Frame-Options DENY, Referrer-Policy, Permissions-Policy, and HSTS for 180 days without includeSubDomains. CSP allows same-site scripts/fonts/styles and Discord avatar images. Next’s inline rendering currently requires unsafe-inline script/style allowances; this is a practical baseline, not a nonce-based strict CSP. Evaluate a nonce design if threat/routing requirements change. Never add unsafe script hosts merely to silence an error. HSTS appears only in production; establish correct HTTPS before release.

Development permits same-origin frames and eval/WebSocket tooling solely for local QA. The explicit terminal.local development origin allows this workspace preview to load Next’s tooling; it does not expand production script/connect sources. Production forbids framing. STATUS_ENDPOINT is server-only, HTTPS, timeout-bounded, redirect-blocked, cached, and manually overridden by maintenance. A basic private-host filter cannot protect against every alternate IP encoding or DNS rebinding. Only configure a known owner-approved endpoint, never accept one from a visitor. Unknown data never becomes fictional online/offline/player statistics.

OAuth and membership APIs, managed Postgres, role hierarchy, credential rotations, production HTTPS/cookies, actual bot behavior, provider retention, and restored database backups have not been tested against live services. No production-ready claim follows solely from local build success.

## Dependency audit

Direct versions are pinned in package.json and npm is the sole lockfile. Next.js 16.4.0, React 19.3.0, Prisma 6.19.3, and Node 24.x were installed and built locally. An override updates @prisma/config’s deepmerge-ts to 8.0.2 to address its affected dependency branch; install, generate, type checks, and build passed with it.

`npm audit --omit=dev` reported zero advisories on 11 October 2026. Full audit reported four high findings from one development-only chain: @next/eslint-plugin-next → fast-glob → micromatch → braces. [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) affects braces through 3.0.3 and lists no patch. npm proposes downgrading the Next lint plugin to 14.2.35; this was not forced because it would mismatch the maintained framework. Lint uses trusted local globs and this tool is not imported into website runtime, but the full audit remains nonzero. Recheck upstream updates before release and do not feed untrusted patterns into the lint toolchain. A clean dependency audit is not proof that the application has no vulnerabilities.
