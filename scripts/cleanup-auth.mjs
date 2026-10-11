import { PrismaClient } from "@prisma/client";
const db = new PrismaClient({ log: [] });
const apply = process.argv.includes("--apply");
const now = new Date();
try {
  const [sessions, buckets, unusedCodes] = await Promise.all([
    db.webSession.count({ where: { expiresAt: { lte: now } } }),
    db.rateLimitBucket.count({ where: { expiresAt: { lte: now } } }),
    db.oTP.count({ where: { used: false, expiresAt: { lte: now } } }),
  ]);
  console.log({
    mode: apply ? "apply" : "dry-run",
    sessions,
    buckets,
    unusedCodes,
    usedProofs: "retained",
  });
  if (apply)
    await db.$transaction([
      db.webSession.deleteMany({ where: { expiresAt: { lte: now } } }),
      db.rateLimitBucket.deleteMany({ where: { expiresAt: { lte: now } } }),
      db.oTP.deleteMany({ where: { used: false, expiresAt: { lte: now } } }),
    ]);
} finally {
  await db.$disconnect();
}
