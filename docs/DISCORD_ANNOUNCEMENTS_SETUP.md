# Discord announcements relay

The website receiver is implemented. The existing bot's source and private database configuration were not supplied. Automatic delivery is **pending bot configuration**, not deployed or verified against Discord. AUTH_ENABLED remains false independently.

## Architecture

The existing always-on bot observes only guild 713039494496124938, channel 900060273258405999. It sends signed POST requests to /api/announcements/ingest. Vercel serves requests, not a persistent Discord Gateway client. Extend the established bot on its existing host, using the adapter in scripts/discord-announcement-relay.mjs. Do not replace its OTP/OAuth commands.

Require View Channel and Read Message History. Message content and embeds require the appropriate MESSAGE_CONTENT intent and Discord account eligibility. See https://docs.discord.com/developers/events/gateway and current Discord settings. Do not request Administrator permission. Use channel branding, never publish member profiles or private staff conversations.

Before enabling: back up Postgres, follow the existing migration baseline instructions, then apply the additive announcement migration with npm run db:migrate. No database operations were performed during website authoring. Configure the same new DISCORD_INGEST_HMAC_SECRET, at least 32 random characters, privately on Vercel and the bot host. Set ANNOUNCEMENTS_ENABLED=true only after staging tests. Never use the old incoming webhook as a source or relay credential.

## Signed transport

Headers: Content-Type application/json, x-relay-timestamp (current epoch milliseconds as 13 decimal digits), x-relay-nonce (fresh 16-80-character UUID or random URL-safe string), x-relay-signature (lowercase hex HMAC-SHA256).

Exact signed bytes: `timestamp + '.' + nonce + '.' + rawJsonBody`. No serialization after signing. The receiver rejects timestamps outside five minutes, malformed signatures, oversized bodies above 32 KiB and other channels before database access. PostgreSQL stores hashed nonces for ten minutes and serializes ingestion with an advisory transaction lock. The shared fixed-minute limiter allows 120 signed attempts/minute. Invalid signatures are rejected before expensive database work. Configure infrastructure limits for unauthenticated network floods separately.

Payload fields: operation upsert or delete, guildId/channelId/messageId decimal strings, eventAt integer epoch milliseconds, content string, pinned boolean, embeds array containing optional title and description strings. eventAt is a stable source version: creation uses createdTimestamp, edits use editedTimestamp, pin/unpin observations use the actual observation time, deletes use actual deletion time. Preserve this timestamp across retries. Do not let an old retry overwrite newer content.

Deletion stores an empty tombstone. Delayed or later upserts never restore a deleted message. Restoration requires an explicit operator review, not automatic resurrection. Duplicate delivery with the same nonce returns 409. Use a new nonce for a retry and keep eventAt unchanged. Events older than the stored version return ignored. DB failure returns 503, and signed rate limit returns 429. Successful or ignored events return 200. A lost success response is safe to retry.

The adapter provides bounded retries. The bot owner must connect failure to the existing durable queue and alerting. In-memory retry alone is not delivery durability. Restart/backfill reconciliation is necessary for downtime and missed deletions. Fetch paginated history using authorized Discord REST, queue snapshots with original versions, compare previously mirrored message IDs to confirm deletions, and retain tombstones. Do not infer deletion from one failed or partial history request. Do not backfill arbitrary private channels. Include pin state in full snapshots and fetch partial message updates before sending.

## Public rendering and retention

GET /api/announcements is read-only, ten posts/page, five pages maximum, cached 60 seconds internally and 30 seconds at the CDN. Homepage shows three excerpts, /news shows the feed with paging and retained editorial posts. Original source links, dates in Philippine time, pin labels and last-received time appear. No guessed Maintenance/Event classification. Empty, pending and unavailable states are distinct.

Bodies use an escaped restricted Markdown subset: bold, inline code and HTTPS Markdown links. HTML, Discord mentions and mass mentions are removed. Common secret assignments, bot token formats, database URLs and incoming webhook URLs are rejected. This detector is defense in depth, not a guarantee against all accidental secrets. Staff must keep the source channel appropriate for public publication and redact confidential posts before syncing.

Embeds publish safe title/description text only. Attachments, external embed URLs, image hotlinks, personal author identifiers and arbitrary HTML are intentionally not mirrored. No image rights or durable attachment-copy storage were provided. Implement attachment publishing only after rights review, approved CDN allowlists, storage and expiry/fallback checks. Discord originals remain linked.

No per-chat SEO pages are generated. Stored messages/tombstones persist until the operator approves a retention plan. Replay receipts expire and are cleaned during successful ingestion. User-data/legal processing and hosting region require owner review. Public last-received time does not certify Gateway connectivity. Monitor signed receiver failures and queue lag privately. A silent bot outage does not create invented new posts.

## Staging acceptance

Create one eligible announcement with disposable content. Verify public feed without login. Edit, pin/unpin and delete it. Replay requests, tamper with bodies, send stale signatures and wrong-channel IDs. Confirm shared rate limiting, real database concurrency, duplicate retries and durable queue recovery. Verify an old edit arriving after deletion cannot restore content. Test server restart, permissions revoked, empty feed and database failure. Rotate the staging relay secret and prove the old key fails. Then configure production separately.
