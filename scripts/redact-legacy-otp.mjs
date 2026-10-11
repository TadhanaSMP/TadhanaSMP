import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ log: [] });
const apply = process.argv.includes("--apply");
try {
  const count = await db.oTP.count({
    where: { code: { startsWith: "TADHANA-" } },
  });
  console.log({
    mode: apply ? "apply" : "dry-run",
    plaintextLegacyRecords: count,
    usedProofs: "retained",
  });
  if (apply)
    await db.$executeRaw`UPDATE "OTP" SET "code" = 'legacy_redacted_' || "id" WHERE "code" LIKE 'TADHANA-%'`;
} finally {
  await db.$disconnect();
}
