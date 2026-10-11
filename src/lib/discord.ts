import "server-only";
import { validDiscordId } from "./otp-core.mjs";
export async function discordFetch(path: string, init: RequestInit = {}) {
  return fetch(`https://discord.com/api/v10${path}`, {
    ...init,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
}
export async function getMember(
  id: string,
): Promise<{ roles: string[] } | null> {
  if (!validDiscordId(id)) throw new Error("Invalid identifier");
  const result = await discordFetch(
    `/guilds/${process.env.DISCORD_GUILD_ID}/members/${id}`,
    { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } },
  );
  if (result.status === 404) return null;
  if (!result.ok) throw new Error("Membership service unavailable");
  const data = await result.json();
  if (
    !Array.isArray(data.roles) ||
    data.roles.some((role: unknown) => !validDiscordId(role))
  )
    throw new Error("Invalid membership response");
  return { roles: data.roles };
}
export async function assignRole(id: string) {
  const result = await discordFetch(
    `/guilds/${process.env.DISCORD_GUILD_ID}/members/${id}/roles/${process.env.DISCORD_VERIFIED_ROLE_ID}`,
    {
      method: "PUT",
      headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` },
    },
  );
  if (result.status !== 204) throw new Error("Role service unavailable");
}
