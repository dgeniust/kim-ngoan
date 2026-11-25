import { NextResponse, type NextRequest } from "next/server";
import { getNews } from "@/lib/data/news";
import { VERTICALS, type VerticalId } from "@/lib/verticals";

/** GET /api/tin-tuc            -> all news (landing hub)
 *  GET /api/tin-tuc?site=lopxe -> filtered to one sector site; ?limit=3 caps the count */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const siteParam = sp.get("site");
  if (siteParam && !(siteParam in VERTICALS)) {
    return NextResponse.json({ error: "site không hợp lệ (phanbon | lopxe | satthep)" }, { status: 400 });
  }
  const limit = Math.min(Math.max(Number(sp.get("limit")) || 0, 0), 50) || undefined;
  const items = await getNews({ site: (siteParam as VerticalId) ?? undefined, limit });
  // Drop the article body from the list to keep the payload small
  return NextResponse.json({ items: items.map(({ content, ...rest }) => { void content; return rest; }) });
}
