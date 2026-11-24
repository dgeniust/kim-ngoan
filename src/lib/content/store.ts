import "server-only";
import { cache } from "react";
import { getSettings } from "@/lib/settings/server";
import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/store/json-file";
import { defaultContent } from "./default-content";
import { siteContentSchema, type SiteContent } from "./schema";

/**
 * File-based content store (data/content.json).
 * Swap this module for a DB implementation (Prisma, Supabase…) when deploying
 * to a serverless host with a read-only filesystem — the rest of the app only
 * depends on getContent / saveContent.
 */
const CONTENT_FILE = path.join(DATA_DIR, "content.json");

/** Bản ghi thô của trình sửa nội dung trang phân bón (admin). */
export async function getRawContent(): Promise<SiteContent> {
  try {
    const raw = await fs.readFile(CONTENT_FILE, "utf8");
    const parsed = siteContentSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
    console.warn("[content] invalid content.json, falling back to defaults", parsed.error.issues);
  } catch {
    // file missing -> defaults
  }
  return defaultContent;
}

export async function saveContent(content: SiteContent): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${CONTENT_FILE}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(content, null, 2), "utf8");
  await fs.rename(tmp, CONTENT_FILE);
}

export async function resetContent(): Promise<void> {
  await fs.rm(CONTENT_FILE, { force: true });
}

/**
 * Nội dung trang phân bón cho website: thông tin công ty, liên hệ và SEO luôn lấy từ
 * “Thông tin chung” (nguồn duy nhất) – content.json chỉ còn giữ logo, menu và các khối nội dung.
 */
export const getContent = cache(async (): Promise<SiteContent> => {
  const [raw, { COMPANY, VERTICALS }] = await Promise.all([getRawContent(), getSettings()]);
  const v = VERTICALS.phanbon;
  return {
    ...raw,
    site: {
      ...raw.site,
      companyPrefix: COMPANY.prefix,
      companyName: COMPANY.name,
      slogan: v.tagline,
      phone: v.phone,
      email: COMPANY.email,
      address: COMPANY.address,
      facebook: COMPANY.facebook,
      seoTitle: v.seoTitle,
      seoDescription: v.seoDescription,
    },
  };
});
