-- Fresh databases only. Existing databases must verify equivalence and baseline with migrate resolve.
CREATE TABLE "OTP" (
 "id" TEXT NOT NULL, "code" TEXT NOT NULL, "codeHash" TEXT NOT NULL, "discordId" TEXT NOT NULL,
 "expiresAt" TIMESTAMP(3) NOT NULL, "used" BOOLEAN NOT NULL DEFAULT false, "usedAt" TIMESTAMP(3),
 "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "OTP_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OTP_code_key" ON "OTP"("code");
CREATE UNIQUE INDEX "OTP_codeHash_key" ON "OTP"("codeHash");
CREATE INDEX "OTP_discordId_idx" ON "OTP"("discordId");
CREATE INDEX "OTP_expiresAt_idx" ON "OTP"("expiresAt");
