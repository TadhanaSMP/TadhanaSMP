"use client";
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { ServerStatus } from "@/lib/status";
const empty: ServerStatus = {
  state: "unknown",
  players: null,
  maximum: null,
  checkedAt: null,
  notice: null,
};
const labels = {
  unknown: "Status unavailable",
  maintenance: "Under maintenance",
  online: "Online",
  offline: "Offline",
};
export function StatusIndicator({
  maintenance = false,
  notice = "",
  expanded = false,
}: {
  maintenance?: boolean;
  notice?: string;
  expanded?: boolean;
}) {
  const [status, setStatus] = useState<ServerStatus>(empty),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/status", { signal: controller.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : empty))
      .then(setStatus)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  async function refresh() {
    setBusy(true);
    try {
      const r = await fetch("/api/status", {
        cache: "no-store",
        signal: AbortSignal.timeout(7000),
      });
      setStatus(r.ok ? await r.json() : empty);
    } catch {
      setStatus(empty);
    } finally {
      setBusy(false);
    }
  }
  const current = maintenance
    ? { ...empty, state: "maintenance" as const, notice }
    : status;
  return (
    <div className={`status-indicator ${expanded ? "status-expanded" : ""}`}>
      <div className={`status-label status-${current.state}`} role="status">
        <span className="status-dot" />
        {labels[current.state]}
      </div>
      {expanded && (
        <>
          <p>
            {current.notice ||
              (current.state === "unknown"
                ? "Live server status is not currently available. Check official announcements before connecting."
                : current.state === "offline"
                  ? "The approved status service reports the server offline. Check Discord for updates."
                  : "Reported by the configured status service.")}
          </p>
          {current.state === "online" && current.players !== null && (
            <p className="status-players">
              <strong>{current.players}</strong>
              {current.maximum !== null ? ` / ${current.maximum}` : ""} players
              online
            </p>
          )}
          {current.checkedAt && (
            <p className="small muted">
              Checked: {new Date(current.checkedAt).toLocaleString()}
            </p>
          )}
          <button
            type="button"
            className="button button-ghost"
            disabled={busy}
            onClick={refresh}
          >
            <RefreshCw size={16} />
            {busy ? "Checking…" : "Refresh status"}
          </button>
        </>
      )}
    </div>
  );
}
