export function safeAddress(value = "") {
  const v = value.trim();
  return v.length <= 253 &&
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?|\[[a-fA-F0-9:]+\])$/.test(
      v,
    ) &&
    !v.includes("..")
    ? v
    : "";
}
export function safePort(value = "") {
  if (!/^\d{1,5}$/.test(value)) return null;
  const n = Number(value);
  return n >= 1 && n <= 65535 ? n : null;
}
export function httpsUrl(value = "") {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password
      ? u.toString()
      : "";
  } catch {
    return "";
  }
}
export function normalizeStatus(data) {
  if (!data || typeof data.online !== "boolean")
    return { state: "unknown", players: null, maximum: null };
  const count = (n) => (Number.isSafeInteger(n) && n >= 0 ? n : null);
  return {
    state: data.online ? "online" : "offline",
    players: data.online ? count(data.players) : null,
    maximum: data.online ? count(data.maximum) : null,
  };
}
export function approvedStatusUrl(value) {
  const safe = httpsUrl(value);
  if (!safe) return "";
  const host = new URL(safe).hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.includes(":") ||
    /^(?:0|10|127|169\.254|192\.168|172\.(?:1[6-9]|2\d|3[01]))\./.test(host)
  )
    return "";
  return safe;
}
export function contrast(a, b) {
  const luminance = (hex) => {
    const rgb = hex
      .replace("#", "")
      .match(/.{2}/g)
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
