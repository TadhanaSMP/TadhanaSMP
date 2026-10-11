import { authReady, json, unavailable } from "@/lib/auth-config";
import { safeEqual, validDiscordId, validOTP } from "@/lib/otp-core.mjs";
import { redeemOTP } from "@/lib/otp";
import { allowRequest, clientHint } from "@/lib/rate-limit";
export const runtime = "nodejs";
async function boundedBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new Error("Invalid type");
  if (Number(request.headers.get("content-length")) > 2048)
    throw new Error("Too large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("Missing body");
  let length = 0;
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 2048) {
      await reader.cancel();
      throw new Error("Too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, position);
    position += chunk.length;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}
export async function POST(request: Request) {
  if (!authReady()) return unavailable();
  const header = request.headers.get("authorization");
  if (!header) return json({ error: "Missing Authorization header" }, 401);
  if (
    header.length > 512 ||
    !header.startsWith("Bearer ") ||
    !safeEqual(header.slice(7), process.env.VERIFICATION_API_SECRET)
  )
    return json({ error: "Unauthorized" }, 401);
  try {
    if (!(await allowRequest("bot-caller", clientHint(request), 60)))
      return json({ error: "Too many requests" }, 429);
    let body;
    try {
      body = await boundedBody(request);
    } catch {
      return json({ success: false, error: "INVALID_OTP" }, 400);
    }
    if (!validDiscordId(body?.discordUserId) || !validOTP(body?.otp))
      return json({ success: false, error: "INVALID_OTP" });
    if (!(await allowRequest("redeem", body.discordUserId, 5)))
      return json({ error: "Too many requests" }, 429);
    return (await redeemOTP(body.otp, body.discordUserId))
      ? json({ success: true })
      : json({ success: false, error: "INVALID_OTP" });
  } catch {
    return json({ error: "verification_unavailable" }, 503);
  }
}
