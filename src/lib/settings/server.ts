import "server-only";
import { cache } from "react";
import { readJson, removeJson, writeJson } from "@/lib/store/json-file";
import { COMPANY as DEFAULT_COMPANY, VERTICALS as DEFAULT_VERTICALS, type Vertical, type VerticalId } from "@/lib/verticals";
import { settingsSchema, type SiteSettings } from "./schema";

const FILE = "settings.json";
const IDS: VerticalId[] = ["phanbon", "lopxe", "satthep"];

export const defaultSettings: SiteSettings = {
  company: { ...DEFAULT_COMPANY },
  verticals: Object.fromEntries(
    IDS.map((id) => {
      const { name, short, tagline, description, contactLabel, phone, phone2 = "", address = "", seoTitle, seoDescription } = DEFAULT_VERTICALS[id];
      return [id, { name, short, tagline, description, contactLabel, phone, phone2, address, seoTitle, seoDescription }];
    }),
  ) as SiteSettings["verticals"],
};

/** Raw record (shown in the admin form). */
export const getRawSettings = cache(async (): Promise<SiteSettings> => {
  const raw = await readJson(FILE);
  if (raw === undefined) return defaultSettings;
  const parsed = settingsSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  console.warn("[settings] settings.json không hợp lệ, dùng mặc định", parsed.error.issues);
  return defaultSettings;
});

/**
 * Shared settings merged with the fixed parts – used by every server component:
 *   const { COMPANY, VERTICALS, VERTICAL_LIST } = await getSettings();
 */
export const getSettings = cache(async () => {
  const s = await getRawSettings();
  const VERTICALS = Object.fromEntries(IDS.map((id) => [id, { ...DEFAULT_VERTICALS[id], ...s.verticals[id] }])) as Record<VerticalId, Vertical>;
  return {
    COMPANY: { ...DEFAULT_COMPANY, ...s.company },
    VERTICALS,
    VERTICAL_LIST: IDS.map((id) => VERTICALS[id]),
  };
});

export type Settings = Awaited<ReturnType<typeof getSettings>>;

export const saveSettings = (s: SiteSettings) => writeJson(FILE, s);
export const resetSettings = () => removeJson(FILE);
