# Start here

## Your manual upload

1. Extract TadhanaSMP-V2-Website-Source.zip.
2. Open tadhanasmp. Upload its contents to your GitHub repository so package.json sits at the root. Include hidden .github, .gitignore, .nvmrc and .env.example. Do not upload the ZIP itself as your deployed source.
3. In Vercel import that repository. Choose Next.js, Node 24.x, install npm ci, build npm run build, default output directory.
4. Keep AUTH_ENABLED=false and ANNOUNCEMENTS_ENABLED=false for the first preview. The website, public server addresses and status probing work independently of those systems.
5. Set SITE_URL to your confirmed website origin. Verify both game connection paths and actual status API results. Read docs/DEPLOYMENT_VERCEL_GITHUB.md.

## Still needs your setup

- Revoke the exposed incoming Discord webhook. Review and rotate potentially exposed verification, OAuth, bot, session and database credentials. Do not paste replacements into chat or GitHub.
- Back up Postgres and apply additive migrations using the fresh/existing database checklist. No migration was applied while preparing this ZIP.
- Add a newly generated DISCORD_INGEST_HMAC_SECRET privately to Vercel and your existing bot host. Extend the bot with the relay adapter, correct permissions/intents and durable retry/backfill logic. Test create/edit/pin/delete/replay/concurrency in staging before setting ANNOUNCEMENTS_ENABLED=true.
- Send an approved export of the actual public Server Rules and Staff Rules messages to populate the two rule views. Direct original links already work in the website.
- Compare the V2 rank snapshot to current CMI config and store products. Prices use PHP and one-month duration. No perks were invented.
- Complete legal/operator/retention and image-rights review. Verify current Minecraft versions, Discord invite and your existing domain configuration.
- Run the V2 browser checklist at 320, 375, 390, 430, 768, 1024, 1440 and 1920 pixels. Final resumed browser access was unavailable, so historical V1 screenshots are not final V2 evidence.

For Discord login, use docs/DISCORD_OAUTH_AND_OTP_CHECKLIST.md separately. Leave authentication disabled until coordinated credential rotation, database and real bot tests pass.
