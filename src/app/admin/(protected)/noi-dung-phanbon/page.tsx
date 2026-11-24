import { ContentEditor } from "@/components/admin/content-editor";
import { getSession } from "@/lib/auth/server";
import { getRawContent } from "@/lib/content/store";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [content, session] = await Promise.all([getRawContent(), getSession()]);
  return <ContentEditor initial={content} user={session!.sub} />;
}
