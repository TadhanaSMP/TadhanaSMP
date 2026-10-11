import { authReady, sameOrigin, json, unavailable } from "@/lib/auth-config";
import { getSession } from "@/lib/session";
import { getMember, assignRole } from "@/lib/discord";
import { hasVerifiedOTP } from "@/lib/otp";
import { allowRequest } from "@/lib/rate-limit";
import { database } from "@/lib/database";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "invalid_origin" }, 403);
  if (!authReady()) return unavailable();
  try {
    const session = await getSession();
    if (!session) return json({ error: "not_authenticated" }, 401);
    if (!(await allowRequest("check", session.discordId, 12)))
      return json({ error: "Too many requests" }, 429);
    const member = await getMember(session.discordId);
    if (!member) return json({ status: "not_in_guild", verified: false });
    // Previously granted role remains authoritative; OTP proof is required before granting a new role.
    if (!member.roles.includes(process.env.DISCORD_VERIFIED_ROLE_ID!)) {
      if (!(await hasVerifiedOTP(session.discordId)))
        return json({ status: "pending_verification", verified: false });
      await assignRole(session.discordId);
    }
    await database.webSession.update({
      where: { tokenHash: session.tokenHash },
      data: { verified: true },
    });
    return json({ status: "verified", verified: true });
  } catch {
    return json({ error: "verification_failed" }, 503);
  }
}
