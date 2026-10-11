# Discord OAuth and OTP checklist

The code retains original API contracts but authentication is disabled until configured and tested. No live credentials or database were provided/accessed, so external integration checks below are pending.

## Private settings

Required names: DATABASE_URL, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI, DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_VERIFIED_ROLE_ID, SESSION_SECRET, VERIFICATION_API_SECRET. Also set SITE_URL and AUTH_ENABLED. The original public invite name is DISCORD_INVITE_URL.

Use new staging credentials and a separate staging database. Create long independent session/API secrets (at least 32 characters of cryptographically random material) privately; never paste them into chat or source. Verify app, guild, role and bot ownership. Registered callback must equal `{SITE_URL origin}/api/auth/discord/callback`, without query/fragment. The candidate production callback is listed as a harmless URL in .env.example. Use a stable staging hostname and register it separately; changing a Vercel preview URL requires matching callback configuration.

Only identify is requested from OAuth. Guild membership is checked through the authorized bot rather than extra user scopes. Give the bot only required role-management/member-access permissions, ensure the verified role is below its highest role, and confirm Discord’s current developer requirements for your application. [Official OAuth documentation](https://docs.discord.com/developers/topics/oauth2) describes state binding and the code exchange.

## Database setup without losing original data

Fresh staging database:

```bash
npm ci
npm run db:migrate
```

Existing database:

1. Take a provider-native backup and test restoring it into a separate staging database. Record schema and row counts without dumping private rows into source or logs.
2. Compare the original OTP table with prisma/schema.prisma and the legacy baseline SQL, including nullability/defaults and indexes. Stop on a mismatch and prepare a reviewed corrective migration; do not reset.
3. Only after equivalence is established, mark the original table baseline as applied:

```bash
npx prisma migrate resolve --applied 202610110000_legacy_otp_baseline
npm run db:migrate
```

4. Confirm original OTP rows are retained and the new session/rate tables exist. Stage redaction and cleanup using the dry-run tools. New hashing invalidates old unused codes; users must request new ones. Used proof requires deliberate retention/revocation review.

The package does not run migrations during Vercel builds. Choose pooled runtime connections and a provider-approved direct connection for migration if required, keeping both private. Test Prisma’s serverless connection limits with the actual provider. Migration rollback is operational: disable auth first and restore a reviewed backup if necessary. Do not deploy the insecure legacy JWT implementation as a shortcut.

## Retained API paths

| Path                           | Contract / protection                                                                            |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| GET /api/config                | Public invite field and safe public configuration only                                           |
| GET /api/auth/discord/login    | Rate limit; random state cookie; redirect to Discord                                             |
| GET /api/auth/discord/callback | Exact configured callback, state validation/clear, code exchange, opaque DB session              |
| GET /api/auth/me               | user:null or sanitized Discord identity/verified state; no token; no-store                       |
| POST /api/auth/logout          | Exact Origin; persistent session revocation; ok:true                                             |
| POST /api/auth/otp/generate    | Origin, signed-in DB session, membership, issuance limit; success/otp/expiresIn:600/instructions |
| POST /api/verify               | Backend Bearer secret, bounded JSON, limits, bound atomic redemption; success boolean            |
| POST /api/auth/verify          | Origin, session, membership/proof check, authorized role assignment; status/verified             |

The website’s new cookies are discord_oauth_state and tadhana_session. Legacy JWT cookies are rejected; users reauthenticate. Disabled login/callback/generate/check/bot verification return 503. me returns user:null,enabled:false. Browser mutations without the exact configured Origin return 403. Code failures return a generic INVALID_OTP without leaking whether another account has a code; the original success/boolean contract is kept.

The bot sends a server-to-server request only, never a browser request:

```http
POST /api/verify
Authorization: Bearer <NEW_PRIVATE_VERIFICATION_API_SECRET>
Content-Type: application/json

{"otp":"TADHANA-A12BC","discordUserId":"123456789012345678"}
```

The code and identifier above are test examples. The bot derives discordUserId from the actual authenticated Discord sender. Success is HTTP 200 with success:true. Wrong/expired/used/unbound codes give HTTP 200 success:false,error:INVALID_OTP. Invalid JSON/type/body limits give 400. Missing/wrong Bearer credentials give 401, limit exhaustion 429, unavailable service/configuration 503. Handle every failure rather than treating an HTTP response alone as success. Verify compatibility with the real bot’s parser and command behavior.

## Staging acceptance checks

- [ ] Login returns only the intended application/scopes and exact registered redirect; no token enters a URL chosen by request Host.
- [ ] Correct state/code signs in; missing/forged/expired state, cancellation, reused callback, and external-service timeout fail safely. State cookie clears and focus returns to a useful support flow.
- [ ] Cookie flags are correct under HTTPS; stored session identifiers are hashes, user access tokens absent, no-store applies, and fresh sign-in rotates session identity.
- [ ] Logout revokes the row; an old cookie, forged cookie, legacy JWT, expired session, and session after secret rotation fail.
- [ ] Nonmembers cannot generate codes. Codes are uniform, expire at ten minutes, bind to the issuer, and issuance replaces unused codes only.
- [ ] Wrong Discord sender, malformed code, expired code, replay, and two simultaneous redemptions produce at most one success on real PostgreSQL.
- [ ] Limits persist across separate function instances; database failures fail closed; forwarded headers never grant permission.
- [ ] Missing/invalid backend Bearer secret, oversized JSON, invalid content type, and wrong id type are rejected. Bot never logs secrets or codes.
- [ ] Website verification stays pending until bot redemption, grants only the configured role, and reports not_in_guild/Discord permission failure honestly.
- [ ] Existing authoritative role is respected; revoked proof/role/sessions do not regrant access; retention and cleanup are approved.
- [ ] Bot and website secret rotation is coordinated; backups/restore, environment scopes, and rollback are tested with no customer data.

Only after these checks and legal/privacy review should the owner set AUTH_ENABLED=true in production and redeploy. Keep the public site usable while disabled.
