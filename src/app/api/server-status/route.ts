import { readDualStatus } from "@/lib/status";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  return Response.json(await readDualStatus(), { headers: { "Cache-Control": "public, max-age=30, s-maxage=60, stale-while-revalidate=30" } });
}
