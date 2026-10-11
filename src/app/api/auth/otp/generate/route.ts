import { authReady, sameOrigin, json, unavailable } from "@/lib/auth-config";
import { getSession } from "@/lib/session";
import { issueOTP } from "@/lib/otp";
import { getMember } from "@/lib/discord";
import { allowRequest } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "invalid_origin" }, 403);
  if (!authReady()) return unavailable();
  try {
    const session = await getSession();
    if (!session) return json({ error: "not_authenticated" }, 401);
    if (!(await allowRequest("issue", session.discordId, 3)))
      return json({ error: "Too many requests" }, 429);
    if (!(await getMember(session.discordId)))
      return json({ error: "not_in_guild" }, 403);
    const otp = await issueOTP(session.discordId);
    return json({
      success: true,
      otp,
      expiresIn: 600,
      instructions:
        "Send this code to the TadhanaSMP Discord bot via DM to verify your account.",
    });
  } catch {
    return json({ error: "verification_unavailable" }, 503);
  }
}
