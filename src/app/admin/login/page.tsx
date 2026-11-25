import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/login-form";
import { ProductArt } from "@/components/shared/product-art";
import { getSettings } from "@/lib/settings/server";

export const metadata: Metadata = { title: { absolute: "Đăng nhập quản trị · Kim Ngoan" }, robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ COMPANY }, { next }] = await Promise.all([getSettings(), searchParams]);
  const safeNext = next?.startsWith("/admin") ? next : "/admin";
  return (
    <main className="theme-hub grid min-h-screen place-items-center bg-hub-canvas p-4 text-hub-ink">
      <div className="w-full max-w-[380px]">
        <ul aria-hidden className="mb-6 flex justify-center gap-2">
          {(["border-hub-signal", "border-hub-coral", "border-hub-marigold"] as const).map((ring, i) => (
            <li key={ring} style={{ animationDelay: `${i * 0.3}s` }} className={`grid size-11 animate-bob place-items-center rounded-full border-2 bg-hub-paper ${ring}`}>
              <ProductArt kind={(["roofing", "tyre", "ibeam"] as const)[i]} className="!size-7" />
            </li>
          ))}
        </ul>
        <div className="rounded-xl border border-hub-line bg-hub-paper p-7">
          <h1 className="text-center text-[24px] font-bold tracking-[-0.025em]">Đăng nhập quản trị</h1>
          <p className="mt-1.5 text-center text-sm text-hub-ink-soft">{COMPANY.legalName}</p>
          <LoginForm next={safeNext} />
        </div>
        <p className="mt-5 text-center text-sm text-hub-ink/50">
          <Link href="/" className="hover:text-hub-ink hover:underline">← Về website</Link>
        </p>
      </div>
    </main>
  );
}
