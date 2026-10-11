import "server-only";
import { database } from "./database";
import { unstable_cache, revalidateTag } from "next/cache";
import { createHash } from "node:crypto";
import { shouldApply, type RelayEvent } from "./announcements-core.mjs";
export function relayReady() { return process.env.ANNOUNCEMENTS_ENABLED === "true" && !!process.env.DATABASE_URL && (process.env.DISCORD_INGEST_HMAC_SECRET || "").length >= 32; }
export async function ingestAnnouncement(event: RelayEvent, nonce: string) {
 const now = new Date(), minute = Math.floor(now.getTime()/60000);
 const outcome = await database.$transaction(async tx => {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(713039494496124938::bigint)`;
  const bucket = `announcement-relay:${minute}`;
  const counts = await tx.$queryRaw<{count:number}[]>`INSERT INTO "RateLimitBucket" ("key","count","expiresAt") VALUES (${bucket},1,${new Date((minute+2)*60000)}) ON CONFLICT ("key") DO UPDATE SET "count"="RateLimitBucket"."count"+1 RETURNING "count"`;
  if (counts[0].count > 120) return "limited";
  const key = createHash("sha256").update(nonce).digest("hex");
  const inserted = await tx.relayReceipt.createMany({data:[{nonceHash:key,expiresAt:new Date(now.getTime()+600000)}],skipDuplicates:true});
  if (!inserted.count) return "replay";
  const previous = await tx.announcement.findUnique({where:{messageId:event.messageId}});
  if (!shouldApply(previous,event)) return "ignored";
  const data = { guildId:event.guildId, channelId:event.channelId, body:event.body, pinned:event.pinned, postedAt:new Date(event.postedAt), eventAt:BigInt(event.eventAt), deletedAt:event.operation === "delete" ? now : null, syncedAt:now };
  await tx.announcement.upsert({where:{messageId:event.messageId},create:{messageId:event.messageId,...data},update:data});
  await tx.relayReceipt.deleteMany({where:{expiresAt:{lt:now}}});
  return "accepted";
 }, {timeout:10000});
 if (outcome === "accepted") revalidateTag("announcements","max");
 return outcome;
}
const cachedFeed = unstable_cache(async () => {
 const rows = await database.announcement.findMany({where:{deletedAt:null},orderBy:[{pinned:"desc"},{postedAt:"desc"}],take:50,select:{messageId:true,body:true,pinned:true,postedAt:true,syncedAt:true}});
 const sync = await database.announcement.aggregate({_max:{syncedAt:true}});
 return { state:"available" as const, lastSyncedAt:sync._max.syncedAt?.toISOString() || null, items:rows.map(r => ({...r,postedAt:r.postedAt.toISOString(),syncedAt:r.syncedAt.toISOString()})) };
}, ["announcements-v2"], {revalidate:60,tags:["announcements"]});
export async function readAnnouncements() {
 if (!relayReady()) return {state:"pending" as const,lastSyncedAt:null,items:[]};
 try { return await cachedFeed(); } catch { return {state:"unavailable" as const,lastSyncedAt:null,items:[]}; }
}
