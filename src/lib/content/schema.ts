import { z } from "zod";

const text = z.string().trim();
const link = z.object({ label: text.min(1), href: text.min(1) });

const heroSlideSchema = z.object({
  eyebrow: text,
  titleLine1: text,
  titleLine2: text,
  tagline: text,
  description: text,
  ctaLabel: text,
  ctaHref: text,
  image: text.min(1),
});

export const siteContentSchema = z.object({
  site: z.object({
    companyPrefix: text,
    companyName: text.min(1),
    slogan: text,
    logo: text, // empty string => default leaf logo
    phone: text,
    email: text,
    address: text,
    facebook: text,
    seoTitle: text,
    seoDescription: text,
  }),
  nav: z.array(link),
  hero: z.object({
    autoplay: z.boolean(),
    slides: z.array(heroSlideSchema).min(1),
    /** Số liệu tạo niềm tin dưới hero (VD: "10+" / "Năm hoạt động"). */
    stats: z.array(z.object({ value: text, label: text })).default([]),
  }),
  features: z.array(z.object({ icon: text, title: text, description: text })),
  products: z.object({
    title: text,
    subtitle: text,
    items: z.array(
      z.object({
        title: text,
        bullets: z.array(text),
        image: text,
        ctaLabel: text,
        ctaHref: text,
      })
    ),
  }),
  crops: z.object({
    title: text,
    subtitle: text,
    items: z.array(z.object({ name: text, description: text, image: text })),
  }),
  about: z.object({
    title: text,
    quote: text,
    image: text,
    paragraphs: z.array(text),
    ctaLabel: text,
    ctaHref: text,
    highlights: z.array(z.object({ icon: text, title: text })),
  }),
  /** “Vườn thật, người thật” – CHỈ đăng câu chuyện thật, có ảnh, được chủ vườn đồng ý. Trống → khối mời gửi câu chuyện. */
  stories: z
    .object({
      title: text,
      subtitle: text,
      items: z.array(
        z.object({
          name: text.min(1),
          place: text,
          crop: text,
          area: text,
          quote: text,
          result: text,
          image: text,
          products: z.array(text),
        }),
      ),
    })
    .default({ title: "Vườn thật, người thật", subtitle: "", items: [] }),
  contact: z.object({ title: text, subtitle: text, addressLabel: text }),
  footer: z.object({ sloganLine1: text, sloganLine2: text, copyright: text, links: z.array(link) }),
});

export type SiteContent = z.infer<typeof siteContentSchema>;
