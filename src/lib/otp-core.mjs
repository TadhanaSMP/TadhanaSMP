import {
  createHmac,
  createHash,
  randomInt,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
export const validDiscordId = (value) =>
  typeof value === "string" && /^\d{17,20}$/.test(value);
export const validOTP = (value) =>
  typeof value === "string" && /^TADHANA-[A-Z0-9]{5}$/.test(value);
export const generateCode = () =>
  "TADHANA-" +
  randomInt(36 ** 5)
    .toString(36)
    .padStart(5, "0")
    .toUpperCase();
export const hashValue = (value, secret) =>
  createHmac("sha256", secret).update(value).digest("hex");
export const opaqueToken = () => randomBytes(32).toString("hex");
export function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const digest = (s) => createHash("sha256").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}
export async function redeemWith(
  repository,
  { otp, discordUserId, secret, now = new Date() },
) {
  if (!validOTP(otp) || !validDiscordId(discordUserId)) return false;
  const result = await repository.updateMany({
    where: {
      codeHash: hashValue(otp, secret),
      discordId: discordUserId,
      used: false,
      expiresAt: { gt: now },
    },
    data: { used: true, usedAt: now },
  });
  return result.count === 1;
}
