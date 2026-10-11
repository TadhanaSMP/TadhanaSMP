export const TTL = 90000;
const count = (v) => Number.isSafeInteger(v) && v >= 0 ? v : null;
export function cleanText(v, limit = 240) {
  if (typeof v !== "string") return null;
  // eslint-disable-next-line no-control-regex
  return v.replace(/<[^>]*>/g, "").replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, " ").slice(0, limit);
}
export function unavailable(host, port, reason = "unavailable", now = Date.now()) {
  return { status: "unknown", host, port, players: null, maximum: null, version: null, motd: null, checkedAt: null, retrievedAt: new Date(now).toISOString(), expiresAt: null, stale: false, reason, retryAt: null };
}
export function normalizeProbe(raw, host, port, now = Date.now(), trusted = false) {
  if (!raw || typeof raw.online !== "boolean") return unavailable(host, port, "invalid-response", now);
  const stamp = trusted ? Date.parse(raw.checkedAt) : raw.retrieved_at;
  if (!Number.isFinite(stamp) || stamp < now - 86400000 || stamp > now + 60000) return unavailable(host, port, "invalid-timestamp", now);
  const expiry = trusted ? stamp + TTL : raw.expires_at;
  if (!Number.isFinite(expiry) || expiry < stamp || expiry > now + 86400000) return unavailable(host, port, "invalid-timestamp", now);
  return withStaleness({ status: raw.online ? "online" : "offline", host, port,
    players: raw.online ? count(raw.players?.online) : null, maximum: raw.online ? count(raw.players?.max) : null,
    version: raw.online ? cleanText(raw.version?.name_clean ?? raw.version?.name, 100) : null,
    motd: raw.online ? cleanText(raw.motd?.clean) : null,
    checkedAt: new Date(stamp).toISOString(), retrievedAt: new Date(now).toISOString(), expiresAt: new Date(expiry).toISOString(), stale: false, reason: null, retryAt: null }, now);
}
export function withStaleness(value, now = Date.now()) {
  return { ...value, stale: !!value.checkedAt && (now - Date.parse(value.checkedAt) > 180000 || now > Date.parse(value.expiresAt)) };
}
export async function readBoundedBody(input, limit = 65536, timeout = 7000) {
  if (Number(input.headers.get("content-length")) > limit) throw new RangeError("body-too-large");
  const reader = input.body?.getReader(); if (!reader) return "";
  let timer;
  try {
    return await Promise.race([(async () => {
      let size = 0; const parts = [];
      for (;;) { const { done, value } = await reader.read(); if (done) break;
        size += value.length; if (size > limit) throw new RangeError("body-too-large"); parts.push(value); }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const part of parts) { bytes.set(part, offset); offset += part.length; }
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    })(), new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("body-timeout")), timeout); })]);
  } finally { clearTimeout(timer); void reader.cancel().catch(() => {}); }
}
export function createProbeCache(fetcher = fetch, clock = Date.now) {
  const cache = new Map(), pending = new Map();
  return async function probe(key, url, host, port, headers = {}, trusted = false) {
    const now = clock(), hit = cache.get(key);
    if (hit && hit.until > now) return withStaleness(hit.value, now);
    if (pending.has(key)) return pending.get(key);
    const promise = (async () => {
      let value, until = now + TTL;
      try {
        const res = await fetcher(url, { headers: { Accept: "application/json", ...headers }, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(7000) });
        if (res.status === 429) {
          const retry = res.headers.get("retry-after"), seconds = Number(retry);
          const ms = retry ? (Number.isFinite(seconds) ? seconds * 1000 : Date.parse(retry) - now) : TTL;
          until = now + Math.min(3600000, Math.max(TTL, Number.isFinite(ms) ? ms : TTL));
          value = { ...unavailable(host, port, "provider-rate-limit", now), retryAt: new Date(until).toISOString() };
        } else if (!res.ok) value = unavailable(host, port, "provider-error", now);
        else value = normalizeProbe(JSON.parse(await readBoundedBody(res)), host, port, clock(), trusted);
      } catch { value = unavailable(host, port, "timeout-or-invalid-response", clock()); }
      if (value.expiresAt) until = Math.max(until, Math.min(now + 3600000, Date.parse(value.expiresAt)));
      cache.set(key, { value, until }); return value;
    })();
    pending.set(key, promise);
    try { return await promise; } finally { pending.delete(key); }
  };
}
