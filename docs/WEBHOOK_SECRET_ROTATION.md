# Rotate the exposed incoming Discord webhook

The previously shared incoming webhook is compromised. Its URL and token are not included here, tested, embedded or used by this project.

In Discord server settings, locate the exposed webhook under Integrations and delete it. If outbound broadcasting is still needed, create a replacement privately, restrict its channel/access, and update only the authorized sender's private environment settings. Do not paste the replacement into chat, GitHub or shared Drive. Confirm the deleted webhook no longer exists from Discord settings without publishing its URL.

Incoming webhooks send into Discord. They cannot read channel announcements. V2 uses a separate signed bot-to-website relay with a newly generated DISCORD_INGEST_HMAC_SECRET. No replacement incoming webhook is necessary for this feature.

Review shared Drive permissions and source history, remove credential-bearing documents from shared access, and rotate potentially exposed bot, OAuth, verification, session and database credentials as described in SECURITY_AUDIT_AND_SECRET_ROTATION.md. Removing a secret from a file does not revoke it. Keep authentication disabled through coordinated staging tests.
