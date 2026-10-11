import { readPublicConfig } from "@/config/server";
export function GET() {
  const config = readPublicConfig();
  return Response.json(
    { invite: config.discordUrl, ...config },
    { headers: { "Cache-Control": "public, max-age=60" } },
  );
}
