import { NextResponse, type NextRequest } from "next/server";
import { getNews } from "@/lib/data/news";
import { VERTICALS, type VerticalId } from "@/lib/verticals";

/** GET /api/tin-tuc            -> tất cả tin (landing tổng)
 *  GET /api/tin-tuc?site=lopxe -> lọc theo chuyên trang; ?limit=3 giới hạn số bài */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const siteParam = sp.get("site");
  if (siteParam && !(siteParam in VERTICALS)) {
    return NextResponse.json({ error: "site không hợp lệ (phanbon | lopxe | satthep)" }, { status: 400 });
  }
  const limit = Math.min(Math.max(Number(sp.get("limit")) || 0, 0), 50) || undefined;
  const items = await getNews({ site: (siteParam as VerticalId) ?? undefined, limit });
  // Bỏ nội dung chi tiết khỏi danh sách cho nhẹ payload
  return NextResponse.json({ items: items.map(({ content, ...rest }) => { void content; return rest; }) });
}
