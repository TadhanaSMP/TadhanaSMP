import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authReady, unavailable, json } from "@/lib/auth-config";
import { opaqueToken } from "@/lib/otp-core.mjs";
import { STATE_COOKIE, cookieOptions } from "@/lib/session";
import { allowRequest, clientHint } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!authReady()) return unavailable();
  try {
    if (!(await allowRequest("login", clientHint(request), 8)))
      return json({ error: "Too many requests" }, 429);
    const state = opaqueToken();
    (await cookies()).set(STATE_COOKIE, state, {
      ...cookieOptions,
      maxAge: 600,
    });
    const url = new URL("https://discord.com/oauth2/authorize");
    url.search = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      response_type: "code",
      scope: "identify",
      state,
    }).toString();
    const result = NextResponse.redirect(url);
    result.headers.set("Cache-Control", "private, no-store");
    return result;
  } catch {
    return json({ error: "authentication_unavailable" }, 503);
  }
}
