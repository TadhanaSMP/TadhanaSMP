import "server-only";
import { cookies } from "next/headers";
import { database } from "./database";
import { hashValue, opaqueToken } from "./otp-core.mjs";
export const SESSION_COOKIE = "tadhana_session";
export const STATE_COOKIE = "discord_oauth_state";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
const digest = (token: string) => hashValue(token, process.env.SESSION_SECRET!);
export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  return database.webSession.findFirst({
    where: { tokenHash: digest(token), expiresAt: { gt: new Date() } },
  });
}
export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token && /^[a-f0-9]{64}$/.test(token) && process.env.SESSION_SECRET)
    await database.webSession.deleteMany({
      where: { tokenHash: digest(token) },
    });
  store.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
export async function createSession(user: {
  id: string;
  username: string;
  global_name: string | null;
  avatar: string | null;
}) {
  await destroySession();
  const token = opaqueToken();
  await database.webSession.create({
    data: {
      tokenHash: digest(token),
      discordId: user.id,
      username: user.username,
      globalName: user.global_name,
      avatar: user.avatar,
      expiresAt: new Date(Date.now() + 86400000),
    },
  });
  (await cookies()).set(SESSION_COOKIE, token, {
    ...cookieOptions,
    maxAge: 86400,
  });
}
