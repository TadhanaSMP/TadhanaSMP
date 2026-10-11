import "server-only";
import { database } from "./database";
import { hashValue } from "./otp-core.mjs";
export function clientHint(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for") ||
    "unknown"
  )
    .split(",")[0]
    .trim()
    .slice(0, 128);
}
export async function allowRequest(
  scope: string,
  subject: string,
  limit: number,
) {
  const minute = Math.floor(Date.now() / 60000);
  const key = `${scope}:${hashValue(subject, process.env.SESSION_SECRET!)}:${minute}`;
  const expiry = new Date((minute + 2) * 60000);
  const result = await database.$queryRaw<
    { count: number }[]
  >`INSERT INTO "RateLimitBucket" ("key","count","expiresAt") VALUES (${key},1,${expiry}) ON CONFLICT ("key") DO UPDATE SET "count"="RateLimitBucket"."count"+1 RETURNING "count"`;
  return result[0].count <= limit;
}
