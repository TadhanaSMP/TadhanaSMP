# Cookies, privacy, terms review

## Verified website behavior

Public pages require no account and have no ticket, appeal, email collection, payment form, optional analytics, marketing script, or consent-storage record. Bundled fonts are served locally. External links do not embed social widgets. Discord sign-in is disabled by default.

When enabled, sign-in requests identify only. Discord id, username, global display name, avatar reference, verification state, session creation, and expiration are stored in PostgreSQL. No email or Discord access token is retained in the session; the access token is transient and best-effort revoked after identity retrieval. Rate-limit subjects are keyed hashes. OTP values are never intentionally logged and new rows retain only a keyed hash plus a non-sensitive legacy placeholder.

| Cookie              | Purpose                                 | Lifetime                              | Flags                                                           |
| ------------------- | --------------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| discord_oauth_state | CSRF binding for Discord callback       | 10 minutes, cleared on callback       | HttpOnly, SameSite=Lax, Secure in production, Path=/, host-only |
| tadhana_session     | Opaque reference to server-side session | 24 hours, revoked/cleared on sign-out | Same flags                                                      |

No optional categories exist, so no consent banner is fabricated. The footer and cookies page reopen the native preference dialog, which states necessary cookies and absent optional tracking. It does not pretend to turn off authentication security cookies or store a meaningless consent record.

## Facts the owner must confirm

- Actual operator identity, contact address, and responsible privacy contact.
- Hosting/database processors, regions, technical-log collection and retention, access roles, and service agreements.
- Appropriate legal basis, rights-request procedures, deletion/verification policy, and applicable jurisdictions.
- Retention schedule for used membership proof, revoked sessions, support records in Discord, backups, and moderation evidence.
- Participation and age policy and any responsibilities involving younger players.
- Image permission, player privacy concerns, takedown/attribution process, and uncertain artwork excluded from public use.
- Approved moderation/appeal procedures, official support destination, current merchant products, durations, fulfillment, refunds, and external terms.

No company registration, legal entity, jurisdiction, privacy email, compliance certification, or age threshold is invented. The public privacy/terms drafts show an owner-review notice and noindex metadata. Proposed rules have an approval notice and noindex. Dedicated operator/contact fields start null, and the actual pages must be revised when these facts are provided.

## Operational review

Read every public policy against enabled features. Sessions expire after 24 hours, codes after ten minutes, but expiry is not physical database deletion. Run reviewed cleanup on a schedule. Used OTP rows currently serve as membership proof and require an approved retention/revocation policy; remove them when membership proof must be revoked. Support happens in the authorized Discord environment, whose own processing also needs review.

Before enabling any optional tracker, add versioned and time-stamped consent where needed, block scripts before consent, offer equally accessible acceptance/rejection/management, support withdrawal from the footer, and test that no optional request precedes consent. Update policies and processor inventory. No analytics should be added solely to justify a banner.

After qualified owner/legal review, revise text and contacts, communicate effective changes, set legalReviewed and rulesApproved as appropriate, and rebuild. These drafts are engineering documentation, not a legal compliance determination.
