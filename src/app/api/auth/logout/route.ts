import { cookies } from "next/headers";
import { authReady, sameOrigin, json } from "@/lib/auth-config";
import { destroySession, SESSION_COOKIE, cookieOptions } from "@/lib/session";
export const runtime = "nodejs";
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "invalid_origin" }, 403);
  try {
    if (authReady()) await destroySession();
    else
      (await cookies()).set(SESSION_COOKIE, "", {
        ...cookieOptions,
        maxAge: 0,
      });
    return json({ ok: true });
  } catch {
    return json({ error: "logout_failed" }, 503);
  }
}
