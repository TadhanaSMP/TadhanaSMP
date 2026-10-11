import "server-only";
import { randomUUID } from "node:crypto";
import { Prisma } from "@prisma/client";
import { database } from "./database";
import { generateCode, hashValue, redeemWith } from "./otp-core.mjs";
export async function issueOTP(discordId: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = generateCode();
    try {
      await database.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${discordId})::bigint)`;
        await tx.oTP.deleteMany({ where: { discordId, used: false } });
        await tx.oTP.create({
          data: {
            code: `redacted_${randomUUID()}`,
            codeHash: hashValue(code, process.env.SESSION_SECRET!),
            discordId,
            expiresAt: new Date(Date.now() + 600000),
          },
        });
      });
      return code;
    } catch (error) {
      if (
        !(error instanceof Prisma.PrismaClientKnownRequestError) ||
        error.code !== "P2002" ||
        attempt === 4
      )
        throw error;
    }
  }
  throw new Error("Unable to issue verification code");
}
export const redeemOTP = (otp: unknown, discordUserId: unknown) =>
  redeemWith(database.oTP, {
    otp,
    discordUserId,
    secret: process.env.SESSION_SECRET!,
  });
export const hasVerifiedOTP = async (discordId: string) =>
  !!(await database.oTP.findFirst({
    where: { discordId, used: true },
    select: { id: true },
  }));
