import "server-only";
import { safeAddress, safePort, httpsUrl } from "@/lib/validation.mjs";
import { store } from "./store";
export const server = { java: { host: "play.TadhanaSMP.com", explicitPort: null }, bedrock: { host: "play.TadhanaSMP.com", port: 25706 }, status: { refreshIntervalMs: 90000, source: "mcstatus", maintenanceEnabled: false } } as const;
export function readPublicConfig() {
  const javaAddress = safeAddress(process.env.JAVA_ADDRESS || server.java.host),
    bedrockAddress = safeAddress(process.env.BEDROCK_ADDRESS || server.bedrock.host);
  const invite = httpsUrl(
    process.env.DISCORD_INVITE_URL || "https://discord.gg/NRYyTXShcB",
  );
  const discordUrl =
    process.env.DISCORD_INVITE_ACTIVE !== "false" &&
    invite &&
    ["discord.gg", "discord.com"].includes(new URL(invite).hostname)
      ? invite
      : "";
  const storeUrl = store.officialUrl;
  return {
    javaAddress,
    javaPort: safePort(process.env.JAVA_PORT),
    bedrockAddress,
    bedrockPort: safePort(process.env.BEDROCK_PORT || String(server.bedrock.port)),
    scheduledMaintenance: process.env.SCHEDULED_MAINTENANCE === "true",
    statusRefreshIntervalMs: server.status.refreshIntervalMs,
    supportedVersions: process.env.MINECRAFT_VERSIONS?.trim() || "",
    maintenance: process.env.MAINTENANCE_MODE === "true",
    maintenanceNotice:
      process.env.MAINTENANCE_NOTICE?.trim() ||
      "The world is taking a pause. Follow Discord announcements for confirmed reopening updates.",
    discordUrl,
    storeUrl: process.env.STORE_ACTIVE !== "false" ? storeUrl : "",
    premiumPublished:
      process.env.PREMIUM_RANKS_PUBLISHED !== "false" &&
      process.env.STORE_ACTIVE !== "false" &&
      !!storeUrl,
  };
}
export type PublicConfig = ReturnType<typeof readPublicConfig>;
