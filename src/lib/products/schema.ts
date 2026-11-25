import { z } from "zod";

const text = z.string().trim();
const slug = text.min(2, "Tối thiểu 2 ký tự").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Chỉ gồm chữ thường không dấu, số và dấu gạch ngang");
const lines = z.array(text.min(1)).default([]);
const pairs = z.array(z.object({ name: text.min(1, "Thiếu tên"), value: text.min(1, "Thiếu giá trị") })).default([]);
const imagePath = text.refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Ảnh phải là /đường-dẫn hoặc https://");

/** Fertilizer product (matches types/phanbon.ts → Product). */
export const fertilizerProductSchema = z.object({
  slug,
  name: text.min(2, "Bắt buộc"),
  categorySlug: text.min(1, "Chọn danh mục"),
  shortDescription: text.min(1, "Bắt buộc"),
  images: z.array(imagePath).min(1, "Cần ít nhất 1 ảnh"),
  sku: text.min(1, "Bắt buộc"),
  packing: lines,
  origin: text,
  ingredients: pairs,
  uses: lines,
  usage: lines,
  crops: lines,
  description: lines,
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

export const ART_KINDS = ["tyre", "tyre-at", "tyre-truck", "rebar", "ibeam", "pipe", "box", "roofing", "coil", "plate"] as const;

/** Tyre / steel product (matches types/catalog.ts → CatalogProduct). */
export const catalogProductSchema = z.object({
  site: z.enum(["lopxe", "satthep"]),
  slug,
  name: text.min(2, "Bắt buộc"),
  brand: text.min(1, "Bắt buộc"),
  categorySlug: text.min(1, "Chọn nhóm"),
  sku: text.min(1, "Bắt buộc"),
  shortDescription: text.min(1, "Bắt buộc"),
  keySpec: text.min(1, "Bắt buộc"),
  specs: pairs,
  highlights: lines,
  description: lines,
  art: z.enum(ART_KINDS),
  images: z.array(imagePath).optional(),
  featured: z.boolean().optional(),
  isNew: z.boolean().optional(),
});
