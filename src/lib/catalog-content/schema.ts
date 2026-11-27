import { z } from "zod";

const text = z.string().trim();
const req = (msg = "Bắt buộc") => text.min(1, msg);
const item = z.object({ title: req("Thiếu tiêu đề"), description: req("Thiếu mô tả") });

const sectionHeadingSchema = z.object({
  title: req("Thiếu tiêu đề"),
  highlight: text.optional(),
  after: text.optional(),
  subtitle: text.optional(),
});

export const catalogContentSchema = z.object({
  hero: z.object({
    eyebrow: req(),
    title: req(),
    highlight: req("Thiếu chữ nổi bật"),
    after: text.optional(),
    note: text.optional(),
    description: req(),
    stats: z.array(z.object({ value: req("Thiếu số"), label: req("Thiếu nhãn") })).min(1, "Cần ít nhất 1 số liệu").max(3, "Tối đa 3 số liệu"),
  }),
  usps: z.array(item).min(2, "Cần ít nhất 2 mục").max(4, "Tối đa 4 mục"),
  services: z.array(item).min(1, "Cần ít nhất 1 mục").max(4, "Tối đa 4 mục"),
  about: z.object({ title: req(), paragraphs: z.array(req()).min(1, "Cần ít nhất 1 đoạn") }),
  sections: z.record(z.string(), sectionHeadingSchema),
  cta: z.object({ title: req(), description: req() }),
  quote: z
    .object({
      title: req(),
      status: req(),
      documents: req(),
      notes: z.array(req()).max(4, "Tối đa 4 dòng"),
      prices: z.array(z.object({ slug: req(), price: text, unit: text, trend: z.enum(["up", "down", "flat"]) })).optional(),
      updated: text.optional(),
    })
    .optional(),
});
