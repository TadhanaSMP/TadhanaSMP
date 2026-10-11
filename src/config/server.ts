import "server-only";
import { safeAddress, safePort, httpsUrl } from "@/lib/validation.mjs";
export function readPublicConfig() {
  const javaAddress = safeAddress(process.env.JAVA_ADDRESS),
    bedrockAddress = safeAddress(process.env.BEDROCK_ADDRESS);
  const invite = httpsUrl(
    process.env.DISCORD_INVITE_URL || "https://discord.gg/NRYyTXShcB",
  );
  const discordUrl =
    process.env.DISCORD_INVITE_ACTIVE !== "false" &&
    invite &&
    ["discord.gg", "discord.com"].includes(new URL(invite).hostname)
      ? invite
      : "";
  const storeUrl = httpsUrl(process.env.STORE_URL);
  return {
    javaAddress,
    javaPort: safePort(process.env.JAVA_PORT),
    bedrockAddress,
    bedrockPort: safePort(process.env.BEDROCK_PORT),
    supportedVersions: process.env.MINECRAFT_VERSIONS?.trim() || "",
    maintenance: process.env.MAINTENANCE_MODE === "true",
    maintenanceNotice:
      process.env.MAINTENANCE_NOTICE?.trim() ||
      "The world is taking a pause. Follow Discord announcements for confirmed reopening updates.",
    discordUrl,
    storeUrl: process.env.STORE_ACTIVE === "true" ? storeUrl : "",
    premiumPublished:
      process.env.PREMIUM_RANKS_PUBLISHED === "true" &&
      process.env.STORE_ACTIVE === "true" &&
      !!storeUrl,
  };
}
export type PublicConfig = ReturnType<typeof readPublicConfig>;
