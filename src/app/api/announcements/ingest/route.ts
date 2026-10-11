import { relayReady, ingestAnnouncement } from "@/lib/announcements";
import { normalizeEvent, verifyRelay } from "@/lib/announcements-core.mjs";
import { readBoundedBody } from "@/lib/status-core.mjs";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const reply = (status:number,state:string) => Response.json({state},{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request) {
 if (!relayReady()) return reply(503,"not-configured");
 if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415,"json-required");
 let body:string;
 try { body = await readBoundedBody(request,32768,5000); } catch { return reply(413,"invalid-body"); }
 const nonce = request.headers.get("x-relay-nonce");
 if (!verifyRelay(body,request.headers.get("x-relay-timestamp"),nonce,request.headers.get("x-relay-signature"),process.env.DISCORD_INGEST_HMAC_SECRET!)) return reply(401,"unauthorized");
 let event;
 try { event = normalizeEvent(JSON.parse(body)); } catch { return reply(400,"invalid-event"); }
 try {
  const result = await ingestAnnouncement(event,nonce!);
  return reply(result === "replay" ? 409 : result === "limited" ? 429 : 200,result);
 } catch { return reply(503,"temporarily-unavailable"); }
}
