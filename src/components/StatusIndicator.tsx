"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Monitor, Gamepad2, RefreshCw } from "lucide-react";
import type { DualStatus } from "@/lib/status";
import type { PublicConfig } from "@/config/server";
import { CopyButton } from "./CopyButton";
const labels = { online: "Online", offline: "Offline", unknown: "Status unavailable" };
export function StatusIndicator({ config, expanded = false }: { config: PublicConfig; expanded?: boolean }) {
  const [data, setData] = useState<DualStatus | null>(null), [busy, setBusy] = useState(false), [clock, setClock] = useState(0);
  const active = useRef<AbortController | null>(null), last = useRef(0);
  const refresh = useCallback(async () => {
    if (document.hidden || active.current) return;
    const controller = new AbortController(); active.current = controller; setBusy(true);
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
      const res = await fetch("/api/server-status", { signal: controller.signal, cache: "no-store" });
      if (!res.ok) throw new Error("unavailable");
      const value = await res.json();
      if (!value.java || !value.bedrock || !value.maintenance || ![value.java.status, value.bedrock.status].every(x => ["online", "offline", "unknown"].includes(x))) throw new Error("invalid");
      setData(value);
    } catch { if (!document.hidden) setData(null); }
    finally { clearTimeout(timeout); active.current = null; last.current = Date.now(); setClock(Date.now()); setBusy(false); }
  }, []);
  useEffect(() => {
    const initial = setTimeout(() => void refresh(), 0);
    const interval = setInterval(() => { setClock(Date.now()); void refresh(); }, config.statusRefreshIntervalMs);
    const visibility = () => { if (document.hidden) active.current?.abort(); else if (Date.now() - last.current >= config.statusRefreshIntervalMs) void refresh(); };
    document.addEventListener("visibilitychange", visibility);
    return () => { clearTimeout(initial); clearInterval(interval); active.current?.abort(); document.removeEventListener("visibilitychange", visibility); };
  }, [refresh, config.statusRefreshIntervalMs]);
  const editions = (["java", "bedrock"] as const).map(name => {
    const probe = data?.[name], expired = !!probe?.expiresAt && clock > Date.parse(probe.expiresAt);
    return { name, probe, state: probe && !probe.stale && !expired ? probe.status : "unknown" as const,
      host: name === "java" ? config.javaAddress : config.bedrockAddress };
  });
  const maintenance = data?.maintenance.enabled ?? config.maintenance;
  const scheduled = data?.maintenance.scheduled ?? config.scheduledMaintenance;
  if (!expanded) return <div className="dual-pill" aria-label="Server availability">
    <Link href="/status">{editions.map(({name,state}) => <span key={name} className={`status-label status-${state}`}><span className="status-dot" />{name === "java" ? "Java" : "Bedrock"}: {labels[state]}</span>)}<span aria-hidden="true">↗</span></Link>
    {(maintenance || scheduled) && <span className="small">{maintenance ? "Maintenance notice" : "Scheduled maintenance soon"}</span>}
  </div>;
  return <section className="dual-status" aria-label="Java and Bedrock status">
    {(maintenance || scheduled) && <aside className="notice"><strong>{maintenance ? "Maintenance notice" : "Scheduled maintenance soon"}</strong><p>{data?.maintenance.message || config.maintenanceNotice}</p><p className="small">Probe results below are independent of this notice.</p></aside>}
    <div className="status-cards">{editions.map(({name,probe,state,host}) => <article className={`status-card status-${state}`} key={name}>
      <div className="status-card-heading">{name === "java" ? <Monitor /> : <Gamepad2 />}<h2>{name === "java" ? "Java Edition" : "Bedrock Edition"}</h2></div>
      <p className="status-label" role="status"><span className="status-dot" />{labels[state]}{state === "online" && scheduled ? " · Scheduled maintenance soon" : ""}</p>
      <div className="address-field"><span>Server address</span><code>{host}</code><CopyButton value={host} /></div>
      {name === "bedrock" && <div className="address-field"><span>Bedrock port</span><code>{config.bedrockPort}</code><CopyButton value={String(config.bedrockPort)} label="Copy port" /></div>}
      {state === "online" && probe && <><p className="status-players">{probe.players !== null ? `${probe.players}${probe.maximum !== null ? ` / ${probe.maximum}` : ""} players on this endpoint` : "Player count unavailable"}</p>{probe.version && <p>Reported version: {probe.version}</p>}{probe.motd && <p>{probe.motd}</p>}</>}
      {state === "unknown" && <p className="small">The latest probe is unavailable or stale. This does not establish whether the game server is offline.</p>}
      {state === "offline" && <p className="small">The provider could not connect. Proxy compatibility and routing also affect probes. Check the game and official announcements.</p>}
      <p className="small muted">Last checked: {probe?.checkedAt ? new Date(probe.checkedAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC" : "No verified check yet"}<br />Website retrieved: {probe?.retrievedAt ? new Date(probe.retrievedAt).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC" : "Unavailable"}</p>
    </article>)}</div>
    <p className="small muted">Checks refresh about every 90 seconds while this page is visible. Java and Bedrock counts may represent the same players and are never added together.</p>
    <button className="button button-ghost" type="button" disabled={busy} onClick={() => void refresh()}><RefreshCw size={16} />{busy ? "Checking…" : "Refresh status"}</button>
    <Link className="text-link" href="/play">Connection guide →</Link>
  </section>;
}
