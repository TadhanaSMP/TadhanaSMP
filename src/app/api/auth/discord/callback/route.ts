import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authReady, appOrigin, unavailable } from "@/lib/auth-config";
import { safeEqual, validDiscordId } from "@/lib/otp-core.mjs";
import { STATE_COOKIE, cookieOptions, createSession } from "@/lib/session";
import { discordFetch } from "@/lib/discord";
import { allowRequest, clientHint } from "@/lib/rate-limit";
export const runtime = "nodejs";
export async function GET(request: Request) {
  if (!authReady()) return unavailable();
  const store = await cookies();
  const expected = store.get(STATE_COOKIE)?.value;
  store.set(STATE_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  const url = new URL(request.url),
    state = url.searchParams.get("state"),
    code = url.searchParams.get("code");
  let accessToken: string | null = null,
    success = false;
  try {
    if (
      !state ||
      !/^[a-f0-9]{64}$/.test(state) ||
      !expected ||
      !safeEqual(state, expected) ||
      !code ||
      code.length > 2048 ||
      !(await allowRequest("callback", clientHint(request), 12))
    )
      throw new Error("Invalid callback");
    const exchanged = await discordFetch("/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      }),
    });
    if (!exchanged.ok) throw new Error("Exchange failed");
    const tokens = await exchanged.json();
    if (
      typeof tokens.access_token !== "string" ||
      tokens.access_token.length > 4096
    )
      throw new Error("Invalid token");
    accessToken = tokens.access_token;
    const response = await discordFetch("/users/@me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error("Identity unavailable");
    const user = await response.json();
    if (
      !validDiscordId(user.id) ||
      typeof user.username !== "string" ||
      user.username.length > 100
    )
      throw new Error("Invalid identity");
    await createSession({
      id: user.id,
      username: user.username,
      global_name:
        typeof user.global_name === "string"
          ? user.global_name.slice(0, 100)
          : null,
      avatar:
        typeof user.avatar === "string" &&
        /^(?:a_)?[a-f0-9]{32}$/.test(user.avatar)
          ? user.avatar
          : null,
    });
    success = true;
  } catch {
    /* Return a generic failure without logging codes, tokens, or identity data. */
  } finally {
    if (accessToken)
      try {
        await discordFetch("/oauth2/token/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_id: process.env.DISCORD_CLIENT_ID!,
            client_secret: process.env.DISCORD_CLIENT_SECRET!,
            token: accessToken,
          }),
        });
      } catch {
        /* Best-effort revocation; the transient token is never persisted. */
      }
  }
  const result = NextResponse.redirect(
    new URL(
      `/support?auth=${success ? "success" : "failed"}#verify`,
      appOrigin(),
    ),
  );
  result.headers.set("Cache-Control", "private, no-store");
  return result;
}
