import "server-only";
import {
  approvedStatusUrl,
  normalizeStatus,
  type StatusState,
} from "./validation.mjs";
import { readPublicConfig } from "@/config/server";
export type ServerStatus = {
  state: StatusState;
  players: number | null;
  maximum: number | null;
  checkedAt: string | null;
  notice: string | null;
};
const unknown: ServerStatus = {
  state: "unknown",
  players: null,
  maximum: null,
  checkedAt: null,
  notice: null,
};
let cache: { expires: number; data: ServerStatus } | null = null;
let pending: Promise<ServerStatus> | null = null;
export async function readStatus(): Promise<ServerStatus> {
  const config = readPublicConfig();
  if (config.maintenance)
    return {
      ...unknown,
      state: "maintenance",
      notice: config.maintenanceNotice,
    };
  const endpoint = approvedStatusUrl(process.env.STATUS_ENDPOINT || "");
  if (!endpoint) return unknown;
  if (cache && cache.expires > Date.now()) return cache.data;
  if (pending) return pending;
  pending = (async () => {
    let data = unknown;
    try {
      const result = await fetch(endpoint, {
        cache: "no-store",
        redirect: "error",
        signal: AbortSignal.timeout(5000),
        headers: { Accept: "application/json" },
      });
      if (result.ok) {
        const status = normalizeStatus(await result.json());
        if (status.state !== "unknown")
          data = {
            ...status,
            checkedAt: new Date().toISOString(),
            notice: null,
          };
      }
    } catch {
      /* Fail closed to unknown, never an invented online/offline state. */
    }
    cache = { expires: Date.now() + 30000, data };
    return data;
  })();
  try {
    return await pending;
  } finally {
    pending = null;
  }
}
