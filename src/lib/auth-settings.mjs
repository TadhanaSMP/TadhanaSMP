import { validDiscordId } from "./otp-core.mjs";
export function configuredOrigin(env, production = true) {
  const url = new URL(env.SITE_URL || "https://www.tadhanasmp.com");
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (url.protocol !== "https:" &&
      !(
        production === false &&
        url.protocol === "http:" &&
        ["localhost", "127.0.0.1"].includes(url.hostname)
      ))
  )
    throw new Error("Invalid site origin");
  return url.origin;
}
export function authenticationReady(env, production = true) {
  if (env.AUTH_ENABLED !== "true") return false;
  const keys = [
    "DATABASE_URL",
    "DISCORD_CLIENT_ID",
    "DISCORD_CLIENT_SECRET",
    "DISCORD_REDIRECT_URI",
    "DISCORD_BOT_TOKEN",
    "DISCORD_GUILD_ID",
    "DISCORD_VERIFIED_ROLE_ID",
    "SESSION_SECRET",
    "VERIFICATION_API_SECRET",
  ];
  const present = (value) =>
    typeof value === "string" &&
    value.trim().length > 0 &&
    !/(?:CHANGE_ME|YOUR_|PLACEHOLDER|USER:PASSWORD|@HOST[:/]|REPLACE_ME)/i.test(
      value,
    );
  if (keys.some((key) => !present(env[key]))) return false;
  if (
    env.SESSION_SECRET.trim().length < 32 ||
    env.VERIFICATION_API_SECRET.trim().length < 32
  )
    return false;
  if (
    ![
      "DISCORD_CLIENT_ID",
      "DISCORD_GUILD_ID",
      "DISCORD_VERIFIED_ROLE_ID",
    ].every((key) => validDiscordId(env[key]))
  )
    return false;
  try {
    const db = new URL(env.DATABASE_URL);
    if (!["postgresql:", "postgres:"].includes(db.protocol)) return false;
    const redirect = new URL(env.DISCORD_REDIRECT_URI);
    return (
      !redirect.username &&
      !redirect.password &&
      redirect.origin === configuredOrigin(env, production) &&
      redirect.pathname === "/api/auth/discord/callback" &&
      !redirect.search &&
      !redirect.hash
    );
  } catch {
    return false;
  }
}
export function matchesOrigin(header, env, production = true) {
  try {
    return header === configuredOrigin(env, production);
  } catch {
    return false;
  }
}
