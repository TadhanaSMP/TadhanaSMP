import { readStatus } from "@/lib/status";
export const dynamic = "force-dynamic";
export async function GET() {
  return Response.json(await readStatus(), {
    headers: { "Cache-Control": "public, max-age=30" },
  });
}
