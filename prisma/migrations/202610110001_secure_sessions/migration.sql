-- Additive only: retains the original OTP table and records.
CREATE TABLE "WebSession" (
 "tokenHash" TEXT NOT NULL, "discordId" TEXT NOT NULL, "username" TEXT NOT NULL, "globalName" TEXT,
 "avatar" TEXT, "verified" BOOLEAN NOT NULL DEFAULT false, "expiresAt" TIMESTAMP(3) NOT NULL,
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "WebSession_pkey" PRIMARY KEY ("tokenHash")
);
CREATE INDEX "WebSession_expiresAt_idx" ON "WebSession"("expiresAt");
CREATE TABLE "RateLimitBucket" (
 "key" TEXT NOT NULL, "count" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL,
 CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("key")
);
CREATE INDEX "RateLimitBucket_expiresAt_idx" ON "RateLimitBucket"("expiresAt");
