import { readAnnouncements } from "@/lib/announcements";
export const dynamic = "force-dynamic";
export async function GET(request:Request) {
 const raw = new URL(request.url).searchParams.get("page") || "1";
 if (!/^[1-5]$/.test(raw)) return Response.json({state:"invalid-page"},{status:400});
 const page = Number(raw), data = await readAnnouncements();
 return Response.json({...data,items:data.items.slice((page-1)*10,page*10),page,hasMore:data.items.length>page*10},{status:data.state === "unavailable" ? 503 : 200,headers:{"Cache-Control":data.state === "available" ? "public, s-maxage=30, stale-while-revalidate=30" : "no-store"}});
}
