import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSession } from "@/lib/auth/server";
import { getCatalogProducts, getFertilizerProducts } from "@/lib/products/server";

export const metadata: Metadata = { title: { absolute: "Quản trị · Kim Ngoan" }, robots: { index: false, follow: false } };

// Two layers of protection: proxy.ts already guards /admin; the role is checked again here on the server.
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (session?.role !== "ADMIN") redirect("/admin/login");
  const [pb, lx, st] = await Promise.all([getFertilizerProducts(), getCatalogProducts("lopxe"), getCatalogProducts("satthep")]);
  return (
    <AdminShell user={session.sub} counts={{ phanbon: pb.length, lopxe: lx.length, satthep: st.length }}>
      {children}
    </AdminShell>
  );
}
