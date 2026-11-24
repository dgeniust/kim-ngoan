import { SettingsForm } from "@/components/admin/settings-form";
import { getRawSettings } from "@/lib/settings/server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  return <SettingsForm initial={await getRawSettings()} />;
}
