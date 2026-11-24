import "server-only";
import { HUB_HERO, HUB_PRODUCTS, HUB_STATS } from "@/lib/content/hub-home";
import { ZONES } from "@/lib/content/hub-extras";
import { getCategories, getProducts } from "@/lib/data/catalog";
import type { ArtKind, NewsItem } from "@/lib/data/types";
import { getCategory as getFertilizerCategory } from "@/lib/mock/categories";
import type { Product } from "@/lib/mock/types";
import type { Settings } from "@/lib/settings/server";
import { telHref, type VerticalId } from "@/lib/verticals";

/** Dựng dữ liệu cho landing tổng từ cài đặt + kho sản phẩm + tin tức. Chỉ chạy trên server. */

type Company = Settings["COMPANY"];
type Verticals = Settings["VERTICALS"];

const PLACEHOLDER_IMAGE = /tmp-img/;
const fill = (text: string, company: Company) => text.replace("{founded}", company.founded).replace("{area}", company.area);

/** Bán chạy trước, rồi hàng mới. */
const byHighlight = <T extends { featured?: boolean; isNew?: boolean }>(a: T, b: T) =>
  Number(!!b.featured) - Number(!!a.featured) || Number(!!b.isNew) - Number(!!a.isNew);

/* ------------------------------------------------------------------ hero */

export type HeroSlide = (typeof HUB_HERO.slides)[number] & { label: string };

export const buildHeroSlides = (verticals: Verticals, company: Company): HeroSlide[] =>
  HUB_HERO.slides.map((s) => ({ ...s, lead: fill(s.lead, company), label: verticals[s.id].short }));

/* ------------------------------------------------------------------ số liệu (thanh neo đáy hero) */

export type Stat = { value: string; label: string };

export function buildStats(company: Company): Stat[] {
  const years = String(new Date().getFullYear() - Number(company.founded));
  return HUB_STATS.map((s) => ({ ...s, value: s.value.replace("{years}", years) }));
}

/* ------------------------------------------------------------------ sản phẩm: không gian trưng bày từng ngành */

/** Một dòng sản phẩm tiêu biểu: ảnh thật nếu có, không thì hình vẽ `art`; `use` = ứng dụng (cây trồng). */
export type SpotlightLine = { name: string; group: string; spec?: string; use?: string; href: string; image?: string; art?: ArtKind };

/** Ảnh cây trồng thật cho dòng phân bón (ảnh bao phân mẫu chưa có) – theo cây trồng đầu tiên của sản phẩm. */
const CROP_IMAGE: Record<string, string> = {
  "Cà phê": "/coffee.jpg",
  "Sầu riêng": "/durian.jpg",
  Tiêu: "/tieu.webp",
  "Cao su": "/caosu.jpg",
  Lúa: "/lua.jpg",
};
const cropImage = (crops: string[]) => crops.map((c) => CROP_IMAGE[c]).find(Boolean) ?? "/garden.jpg";
export type Spotlight = (typeof HUB_PRODUCTS.sectors)[number] & {
  name: string;
  short: string;
  href: string;
  phone: string;
  phoneHref: string;
  total: number;
  lines: SpotlightLine[];
};

const LINES_PER_SECTOR = 4;

export async function buildSpotlights(verticals: Verticals, fertilizers: Product[]) {
  const [tyres, steels] = await Promise.all([getProducts("lopxe"), getProducts("satthep")]);

  const linesBySector: Record<VerticalId, SpotlightLine[]> = {
    phanbon: [...fertilizers].sort(byHighlight).map((p) => ({
      name: p.name,
      group: getFertilizerCategory(p.categorySlug)?.name ?? "Phân bón",
      spec: p.packing[0],
      use: p.crops.slice(0, 3).join(", "),
      href: `${verticals.phanbon.base}/san-pham/${p.slug}`,
      image: p.images.find((src) => !PLACEHOLDER_IMAGE.test(src)) ?? cropImage(p.crops),
    })),
    lopxe: [...tyres].sort(byHighlight).map((p) => ({
      name: p.name,
      group: getCategories("lopxe").find((c) => c.slug === p.categorySlug)?.name ?? "",
      spec: p.keySpec,
      href: `${verticals.lopxe.base}/san-pham/${p.slug}`,
      image: p.images?.[0],
      art: p.art,
    })),
    satthep: [...steels].sort(byHighlight).map((p) => ({
      name: p.name,
      group: getCategories("satthep").find((c) => c.slug === p.categorySlug)?.name ?? "",
      spec: p.keySpec,
      href: `${verticals.satthep.base}/san-pham/${p.slug}`,
      image: p.images?.[0],
      art: p.art,
    })),
  };

  const spotlights: Spotlight[] = HUB_PRODUCTS.sectors.map((s) => {
    const v = verticals[s.id];
    return {
      ...s,
      name: v.name,
      short: v.short,
      href: v.base,
      phone: v.phone,
      phoneHref: telHref(v.phone),
      total: linesBySector[s.id].length,
      lines: linesBySector[s.id].slice(0, LINES_PER_SECTOR),
    };
  });

  return { spotlights, productCount: fertilizers.length + tyres.length + steels.length };
}

/* ------------------------------------------------------------------ tin tức */

/**
 * 1 bài tiêu điểm (bài phân bón có ảnh, ưu tiên) + 3 bài xếp dọc: lốp xe, sắt thép và một bài phân bón khác.
 */
export function pickHomeNews(all: NewsItem[]) {
  const fertilizer = all.filter((n) => n.site === "phanbon");
  const feature = fertilizer.find((n) => n.cover && !PLACEHOLDER_IMAGE.test(n.cover)) ?? fertilizer[0] ?? all[0];
  const bySite = (["lopxe", "satthep"] as const).map((site) => all.find((n) => n.site === site && n.cover) ?? all.find((n) => n.site === site));
  const list = [...bySite, ...fertilizer.filter((n) => n !== feature)].filter((n): n is NewsItem => !!n && n !== feature).slice(0, 3);
  return { feature, list };
}
