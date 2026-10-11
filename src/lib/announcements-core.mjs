import { createHmac, timingSafeEqual } from "node:crypto";
export const GUILD = "713039494496124938", CHANNEL = "900060273258405999";
const snowflake = v => typeof v === "string" && /^[0-9]{17,20}$/.test(v);
export function signRelay(body, timestamp, nonce, secret) {
 return createHmac("sha256", secret).update(`${timestamp}.${nonce}.${body}`).digest("hex");
}
export function verifyRelay(body, timestamp, nonce, signature, secret, now = Date.now()) {
 if (typeof secret !== "string" || secret.length < 32 || !/^[0-9]{13}$/.test(timestamp || "") || Math.abs(now-Number(timestamp)) > 300000 || !/^[a-zA-Z0-9_-]{16,80}$/.test(nonce || "") || !/^[a-f0-9]{64}$/.test(signature || "")) return false;
 return timingSafeEqual(Buffer.from(signature,"hex"), Buffer.from(signRelay(body,timestamp,nonce,secret),"hex"));
}
export function safeAnnouncementText(value, limit = 12000) {
 if (typeof value !== "string" || value.length > limit) throw new Error("invalid-content");
 // Fail closed for common credential formats, assignments and incoming webhook URLs.
 if (/discord(?:app)?\.com\/api\/webhooks\/|(?:TOKEN|SECRET|PASSWORD|DATABASE_URL)\s*[:=]\s*\S+|(?:mfa\.[\w-]{20,}|[\w-]{24,}\.[\w-]{6}\.[\w-]{25,})|postgres(?:ql)?:\/\//i.test(value)) throw new Error("private-content");
 // eslint-disable-next-line no-control-regex
 return value.replace(/<[^>]*>/g, "").replace(/@(everyone|here)/gi,"[announcement]").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "").trim();
}
export function normalizeEvent(raw, now = Date.now()) {
 if (!raw || !snowflake(raw.messageId) || raw.guildId !== GUILD || raw.channelId !== CHANNEL || !["upsert","delete"].includes(raw.operation) || !Number.isSafeInteger(raw.eventAt) || raw.eventAt < 1420070400000 || raw.eventAt > now+60000) throw new Error("invalid-event");
 const createdAt = Number((BigInt(raw.messageId) >> 22n)+1420070400000n);
 if (createdAt > now+60000 || raw.eventAt < createdAt) throw new Error("invalid-message-time");
 const base = { messageId: raw.messageId, guildId: GUILD, channelId: CHANNEL, eventAt: raw.eventAt, operation: raw.operation };
 if (raw.operation === "delete") return { ...base, body: "", pinned: false, postedAt: new Date(Number((BigInt(raw.messageId) >> 22n)+1420070400000n)).toISOString() };
 if (typeof raw.pinned !== "boolean" || !Array.isArray(raw.embeds || []) || (raw.embeds || []).length > 10) throw new Error("invalid-event");
 const texts = [safeAnnouncementText(raw.content || ""), ...(raw.embeds || []).map(e => {
 if (!e || typeof e !== "object") throw new Error("invalid-embed");
 return [safeAnnouncementText(e.title || "",256),safeAnnouncementText(e.description || "",4096)].filter(Boolean).join("\n");
 })];
 const body = texts.filter(Boolean).join("\n\n");
 if (!body || body.length > 16000) throw new Error("empty-or-long-content");
 return { ...base, body, pinned: raw.pinned, postedAt: new Date(Number((BigInt(raw.messageId) >> 22n)+1420070400000n)).toISOString() };
}
export function shouldApply(previous, event) {
 return !previous || (!previous.deletedAt && event.eventAt > Number(previous.eventAt));
}
