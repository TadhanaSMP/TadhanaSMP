# Java and Bedrock monitoring

V2 confirms Java `play.TadhanaSMP.com` with no displayed explicit port, and Bedrock `play.TadhanaSMP.com`, port **25706**. Change src/config/server.ts defaults or JAVA_ADDRESS/JAVA_PORT/BEDROCK_ADDRESS/BEDROCK_PORT privately. Java copying copies only the hostname, preserving SRV discovery. Bedrock provides hostname and port separately.

GET /api/server-status checks Java and Bedrock independently through mcstatus.io v2. GET /api/status retains the legacy summary. The server normalizes only status, counts, cleaned MOTD/version, timestamps, expiry and failure reason. It never sends resolved IPs, player names, plugins or provider credentials to browsers. Counts are per edition and never summed.

Documentation checked 11 October 2026: https://mcstatus.io/docs. Provider limit is five requests/second per client IP. Server-side Next cache revalidates in 90 seconds, process-local cache coalesces concurrent probes and respects response expiry and 429 Retry-After up to one hour. The outer cache can add up to one revalidation interval to a long Retry-After. CDN adds 60-second shared cache and 30-second stale window. Measurements past expiry or 180 seconds old are labeled unavailable. There is no guarantee of instant telemetry. Multiple regions have independent caches. Review provider headers, traffic and limits after launch.

Requests and body reads time out after seven seconds. JSON is capped at 64 KiB. Network, HTTP error, 429 and malformed schema become unknown, never offline. Only online:false is offline, with proxy-compatibility guidance. Browser refreshes every 90 seconds while visible and aborts hidden-tab requests. Refresh controls reuse server caches, never force provider cache bypass.

MAINTENANCE_MODE and MAINTENANCE_NOTICE create an independent notice. SCHEDULED_MAINTENANCE adds a scheduled-maintenance label while preserving actual probe status. Neither changes the game server. Maintain both values false when no approved notice exists.

Alternative trusted monitoring: set STATUS_SOURCE=trusted, STATUS_JAVA_ENDPOINT and STATUS_BEDROCK_ENDPOINT to HTTPS endpoints on exactly STATUS_MONITOR_HOST. Set STATUS_MONITOR_TOKEN to a new private secret of at least 32 characters. Endpoint schema: online boolean, checkedAt ISO timestamp, players.online/players.max nonnegative integers, version.name and motd.clean text. Use only operator-approved services. Private-host validation is not a complete DNS-rebinding defense. Never configure RCON or a hosting-panel URL.

Tests cover online with zero players, offline, malformed/timed-out provider, partial failure, expiry, coalescing and rate limits. Current network restrictions blocked live endpoint access in the final resumed run. Validate actual Java and Bedrock probes and in-game connections after deployment, including the custom port. Never treat the website revamp as server downtime.
