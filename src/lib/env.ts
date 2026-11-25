import { z } from "zod";

/**
 * SINGLE source of server-side environment variables. Everything else imports from here
 * (never reads process.env directly). Full list with explanations: .env.example and README.md.
 */
export const IS_PROD = process.env.NODE_ENV === "production";

/** Values used only under `next dev` – production must set its own. */
const DEV_DEFAULTS = {
  ADMIN_EMAIL: "admin@kimngoan.vn",
  ADMIN_PASSWORD: "1",
  AUTH_SECRET: "dev-only-insecure-secret-change-me-please!!",
} as const;

const authSchema = z.object({
  ADMIN_EMAIL: z.string().trim().email("ADMIN_EMAIL phải là địa chỉ email"),
  ADMIN_PASSWORD: z.string().min(IS_PROD ? 8 : 1, "ADMIN_PASSWORD tối thiểu 8 ký tự"),
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET tối thiểu 32 ký tự (tạo bằng: openssl rand -base64 48)"),
});
type AuthEnv = z.infer<typeof authSchema>;

const pick = (key: keyof typeof DEV_DEFAULTS) => process.env[key] || (IS_PROD ? undefined : DEV_DEFAULTS[key]);

let authCache: AuthEnv | null = null;
/** Admin credentials + session signing key. Throws a clear error when missing or invalid. */
export function authEnv(): AuthEnv {
  if (authCache) return authCache;
  const parsed = authSchema.safeParse({ ADMIN_EMAIL: pick("ADMIN_EMAIL"), ADMIN_PASSWORD: pick("ADMIN_PASSWORD"), AUTH_SECRET: pick("AUTH_SECRET") });
  if (!parsed.success) throw new Error(`[env] Cấu hình đăng nhập admin không hợp lệ:\n${formatIssues(parsed.error.issues)}\n→ Xem .env.example`);
  authCache = parsed.data;
  return authCache;
}

/** Admin data directory (settings, products, content, uploads). Defaults to ./data */
export const DATA_DIR_SETTING = process.env.DATA_DIR || "data";

/** Validates the whole configuration – called at server start-up (src/instrumentation.ts). */
export function checkEnv(): string[] {
  const problems: string[] = [];
  if (IS_PROD && !process.env.NEXT_PUBLIC_SITE_URL) problems.push("NEXT_PUBLIC_SITE_URL chưa đặt – sitemap/canonical đang dùng https://kimngoan.com");
  if (process.env.NEXT_PUBLIC_SITE_URL && !/^https?:\/\/[^/]+/.test(process.env.NEXT_PUBLIC_SITE_URL)) problems.push("NEXT_PUBLIC_SITE_URL phải có dạng https://ten-mien.com");
  try {
    authEnv();
  } catch (e) {
    problems.push((e as Error).message);
  }
  return problems;
}

function formatIssues(issues: { path: PropertyKey[]; message: string }[]) {
  return issues.map((i) => `  • ${String(i.path[0] ?? "")}: ${i.message}`).join("\n");
}
