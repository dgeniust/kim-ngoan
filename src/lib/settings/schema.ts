import { z } from "zod";
import { COMPANY } from "@/lib/verticals";

const text = z.string().trim();
const phone = text.regex(/^[\d\s+().-]{6,20}$/, "Số điện thoại không hợp lệ");
const url = text.refine((v) => v === "" || /^https?:\/\//.test(v), "Đường dẫn phải bắt đầu bằng http:// hoặc https://");

const companySchema = z.object({
  prefix: text,
  name: text.min(1, "Bắt buộc"),
  legalName: text.min(1, "Bắt buộc"),
  slogan: text,
  hotline: phone,
  email: text.email("Email không hợp lệ").or(z.literal("")),
  address: text.min(1, "Bắt buộc"),
  // .default: settings.json files saved before this field existed stay valid
  area: text.min(2, "Bắt buộc").default(COMPANY.area),
  mapQuery: text,
  openingHours: text,
  founded: text.regex(/^\d{4}$/, "Năm gồm 4 chữ số"),
  zalo: url,
  facebook: url,
});

/** Editable part of each sector site (paths, ids and colours are fixed in code). */
const verticalEditableSchema = z.object({
  name: text.min(1, "Bắt buộc"),
  short: text.min(1, "Bắt buộc"),
  tagline: text,
  description: text,
  contactLabel: text,
  phone,
  seoTitle: text.min(10, "Tối thiểu 10 ký tự").max(100, "Tối đa 100 ký tự (Google thường chỉ hiện ~60–70)"),
  seoDescription: text.min(20, "Tối thiểu 20 ký tự").max(220, "Tối đa 220 ký tự (Google thường chỉ hiện ~160)"),
});

export const settingsSchema = z.object({
  company: companySchema,
  verticals: z.object({ phanbon: verticalEditableSchema, lopxe: verticalEditableSchema, satthep: verticalEditableSchema }),
});

export type SiteSettings = z.infer<typeof settingsSchema>;
