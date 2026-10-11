CREATE TABLE "Announcement" ("messageId" TEXT NOT NULL PRIMARY KEY,"guildId" TEXT NOT NULL,"channelId" TEXT NOT NULL,"body" TEXT NOT NULL,"pinned" BOOLEAN NOT NULL DEFAULT false,"postedAt" TIMESTAMP(3) NOT NULL,"eventAt" BIGINT NOT NULL,"deletedAt" TIMESTAMP(3),"syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX "Announcement_deletedAt_postedAt_idx" ON "Announcement"("deletedAt","postedAt");
CREATE TABLE "RelayReceipt" ("nonceHash" TEXT NOT NULL PRIMARY KEY,"expiresAt" TIMESTAMP(3) NOT NULL);
CREATE INDEX "RelayReceipt_expiresAt_idx" ON "RelayReceipt"("expiresAt");
