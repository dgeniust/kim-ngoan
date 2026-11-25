"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { IS_PROD } from "@/lib/env";
import { revalidatePath } from "next/cache";
import { authenticate, requireAdmin } from "@/lib/auth/server";
import { SESSION_COOKIE, signSession } from "@/lib/auth/session";
import { siteContentSchema, type SiteContent } from "@/lib/content/schema";
import { resetContent, saveContent } from "@/lib/content/store";
import { settingsSchema, type SiteSettings } from "@/lib/settings/schema";
import { defaultSettings, resetSettings, saveSettings } from "@/lib/settings/server";
import { catalogProductSchema, fertilizerProductSchema } from "@/lib/products/schema";
import { getCatalogProducts, getFertilizerProducts, saveCatalogProducts, saveFertilizerProducts, type ProductSite } from "@/lib/products/server";
import type { CatalogContent, CatalogProduct } from "@/types/catalog";
import { catalogContentSchema } from "@/lib/catalog-content/schema";
import { CATALOG_CONTENT_DEFAULTS, resetCatalogContent, saveCatalogContent } from "@/lib/catalog-content/server";
import type { Product } from "@/types/phanbon";

type ActionResult = { ok: true } | { ok: false; error: string; code?: "FORBIDDEN" };

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");
  let session: ReturnType<typeof authenticate>;
  let token: string;
  try {
    session = authenticate(email, password);
    if (!session || session.role !== "ADMIN") return { ok: false, error: "Email hoặc mật khẩu không đúng" };
    token = await signSession(session);
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Máy chủ chưa cấu hình tài khoản quản trị (ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET). Liên hệ bộ phận kỹ thuật." };
  }

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PROD,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export async function saveContentAction(content: SiteContent): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Phiên đăng nhập đã hết hạn hoặc bạn không có quyền ADMIN", code: "FORBIDDEN" };
  }
  const parsed = siteContentSchema.safeParse(content);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `Dữ liệu không hợp lệ: ${issue.path.join(".")} – ${issue.message}` };
  }
  await saveContent(parsed.data);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetContentAction(): Promise<ActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Phiên đăng nhập đã hết hạn hoặc bạn không có quyền ADMIN", code: "FORBIDDEN" };
  }
  await resetContent();
  revalidatePath("/", "layout");
  return { ok: true };
}

/* =====================================================================
 * Shared settings (company + three sector sites)
 * ===================================================================== */

export type FieldErrors = Record<string, string>;
type FormResult = { ok: true } | { ok: false; error: string; code?: "FORBIDDEN"; fieldErrors?: FieldErrors };

const firstErrors = (issues: { path: PropertyKey[]; message: string }[]): FieldErrors => {
  const out: FieldErrors = {};
  for (const i of issues) {
    const k = i.path.map(String).join(".");
    out[k] ??= i.message;
  }
  return out;
};

async function guard(): Promise<FormResult | null> {
  try {
    await requireAdmin();
    return null;
  } catch {
    return { ok: false, error: "Phiên đăng nhập đã hết hạn hoặc bạn không có quyền ADMIN", code: "FORBIDDEN" };
  }
}

export async function saveSettingsAction(input: SiteSettings): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
  await saveSettings(parsed.data);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetSettingsAction(): Promise<FormResult & { settings?: SiteSettings }> {
  const denied = await guard();
  if (denied) return denied;
  await resetSettings();
  revalidatePath("/", "layout");
  return { ok: true, settings: defaultSettings };
}

/* =====================================================================
 * Products – CRUD per sector site
 * ===================================================================== */
/** `insertAt`: insertion index for new items (used by "Undo" after a delete to restore the original position). */
export async function upsertProductAction(site: ProductSite, input: unknown, originalSlug: string | null, insertAt?: number): Promise<FormResult & { slug?: string }> {
  const denied = await guard();
  if (denied) return denied;

  if (site === "phanbon") {
    const parsed = fertilizerProductSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
    const list = [...(await getFertilizerProducts())];
    const next = parsed.data as Product;
    const clash = list.findIndex((p) => p.slug === next.slug);
    const idx = originalSlug ? list.findIndex((p) => p.slug === originalSlug) : -1;
    if (clash !== -1 && clash !== idx) return { ok: false, error: "Đường dẫn (slug) đã tồn tại", fieldErrors: { slug: "Đã có sản phẩm dùng đường dẫn này" } };
    if (idx >= 0) list[idx] = next;
    else if (typeof insertAt === "number" && insertAt >= 0) list.splice(Math.min(insertAt, list.length), 0, next);
    else list.unshift(next);
    await saveFertilizerProducts(list);
  } else {
    const parsed = catalogProductSchema.safeParse({ ...(input as object), site });
    if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
    const list = [...(await getCatalogProducts(site))];
    const next = parsed.data as CatalogProduct;
    const clash = list.findIndex((p) => p.slug === next.slug);
    const idx = originalSlug ? list.findIndex((p) => p.slug === originalSlug) : -1;
    if (clash !== -1 && clash !== idx) return { ok: false, error: "Đường dẫn (slug) đã tồn tại", fieldErrors: { slug: "Đã có sản phẩm dùng đường dẫn này" } };
    if (idx >= 0) list[idx] = next;
    else if (typeof insertAt === "number" && insertAt >= 0) list.splice(Math.min(insertAt, list.length), 0, next);
    else list.unshift(next);
    await saveCatalogProducts(site, list);
  }
  revalidatePath("/", "layout");
  return { ok: true, slug: (input as { slug: string }).slug };
}

export async function deleteProductAction(site: ProductSite, slug: string): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  if (site === "phanbon") {
    const list = await getFertilizerProducts();
    if (list.length <= 1) return { ok: false, error: "Cần giữ lại ít nhất 1 sản phẩm" };
    await saveFertilizerProducts(list.filter((p) => p.slug !== slug));
  } else {
    const list = await getCatalogProducts(site);
    if (list.length <= 1) return { ok: false, error: "Cần giữ lại ít nhất 1 sản phẩm" };
    await saveCatalogProducts(site, list.filter((p) => p.slug !== slug));
  }
  revalidatePath("/", "layout");
  return { ok: true };
}

/* =====================================================================
 * Home-page content of the tyre / steel sites
 * ===================================================================== */

const CONTENT_SITES = ["lopxe", "satthep"] as const;
type ContentSite = (typeof CONTENT_SITES)[number];

export async function saveCatalogContentAction(site: ContentSite, input: CatalogContent): Promise<FormResult> {
  const denied = await guard();
  if (denied) return denied;
  if (!CONTENT_SITES.includes(site)) return { ok: false, error: "Chuyên trang không hợp lệ" };
  const parsed = catalogContentSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Vui lòng kiểm tra các ô được đánh dấu", fieldErrors: firstErrors(parsed.error.issues) };
  await saveCatalogContent(site, parsed.data as CatalogContent);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function resetCatalogContentAction(site: ContentSite): Promise<FormResult & { content?: CatalogContent }> {
  const denied = await guard();
  if (denied) return denied;
  if (!CONTENT_SITES.includes(site)) return { ok: false, error: "Chuyên trang không hợp lệ" };
  await resetCatalogContent(site);
  revalidatePath("/", "layout");
  return { ok: true, content: CATALOG_CONTENT_DEFAULTS[site] };
}
