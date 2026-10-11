import { authReady, json } from "@/lib/auth-config";
import { getSession } from "@/lib/session";
export const runtime = "nodejs";
export async function GET() {
  if (!authReady()) return json({ user: null, enabled: false });
  try {
    const user = await getSession();
    return json({
      enabled: true,
      user: user
        ? {
            discordId: user.discordId,
            username: user.username,
            displayName: user.globalName || user.username,
            avatar: user.avatar
              ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png?size=128`
              : null,
            verified: user.verified,
          }
        : null,
    });
  } catch {
    return json(
      { user: null, enabled: false, error: "authentication_unavailable" },
      503,
    );
  }
}
