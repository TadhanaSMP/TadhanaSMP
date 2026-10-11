import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { readPublicConfig } from "@/config/server";
import { approvedStatusUrl } from "./validation.mjs";
import { createProbeCache, unavailable, withStaleness } from "./status-core.mjs";
const probe = createProbeCache();
export async function readDualStatus() {
  const config = readPublicConfig();
  const trusted = process.env.STATUS_SOURCE === "trusted";
  const token = process.env.STATUS_MONITOR_TOKEN || "";
  async function edition(name: "java" | "bedrock") {
    const host = name === "java" ? config.javaAddress : config.bedrockAddress;
    const port = name === "java" ? config.javaPort : config.bedrockPort;
    let url = `https://api.mcstatus.io/v2/status/${name}/${encodeURIComponent(host + (port ? `:${port}` : ""))}`;
    if (trusted) {
      url = approvedStatusUrl(process.env[name === "java" ? "STATUS_JAVA_ENDPOINT" : "STATUS_BEDROCK_ENDPOINT"] || "");
      if (!url || new URL(url).hostname !== process.env.STATUS_MONITOR_HOST || token.length < 32) return unavailable(host, port, "monitor-not-configured");
    }
    const key = createHash("sha256").update(`${name}:${url}:${trusted ? token : "public"}`).digest("hex");
    const read = unstable_cache(() => probe(key, url, host, port, trusted ? { Authorization: `Bearer ${token}` } : {}, trusted), ["status-v2", key], { revalidate: 90 });
    return withStaleness(await read());
  }
  const [java, bedrock] = await Promise.all([edition("java"), edition("bedrock")]);
  return { java, bedrock, maintenance: { enabled: config.maintenance, scheduled: config.scheduledMaintenance, message: config.maintenanceNotice }, refreshedAt: new Date().toISOString() };
}
export type DualStatus = Awaited<ReturnType<typeof readDualStatus>>;
export async function readStatus() {
  const data = await readDualStatus(), state = data.maintenance.enabled ? "maintenance" : data.java.stale ? "unknown" : data.java.status;
  return { state, players: state === "online" ? data.java.players : null, maximum: state === "online" ? data.java.maximum : null, checkedAt: data.java.checkedAt, notice: data.maintenance.enabled ? data.maintenance.message : null };
}
export type ServerStatus = Awaited<ReturnType<typeof readStatus>>;
